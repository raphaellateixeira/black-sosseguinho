import { createHash } from 'node:crypto';

// Conversions API da Meta, server-side.
// O token NUNCA fica no codigo: vem de variavel de ambiente da Netlify.
const PIXEL_ID = '1577343449799722';
const API      = 'v21.0';

const sha256 = (v) => createHash('sha256').update(String(v)).digest('hex');

// A Meta exige e-mail minusculo sem espaco e telefone so com digitos, com DDI.
const normEmail = (e) => String(e || '').trim().toLowerCase();
const normPhone = (p) => {
  const d = String(p || '').replace(/\D/g, '');
  if (!d) return '';
  return d.startsWith('55') ? d : '55' + d;
};

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type'
};

export default async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (req.method !== 'POST')    return new Response('method not allowed', { status: 405, headers: cors });

  const TOKEN = process.env.META_CAPI_TOKEN;
  if (!TOKEN) {
    console.error('META_CAPI_TOKEN nao configurado nas variaveis de ambiente');
    return new Response(JSON.stringify({ ok: false, motivo: 'token ausente' }),
      { status: 200, headers: { ...cors, 'content-type': 'application/json' } });
  }

  let lead;
  try { lead = await req.json(); }
  catch { return new Response(JSON.stringify({ ok: false, motivo: 'json invalido' }),
    { status: 200, headers: { ...cors, 'content-type': 'application/json' } }); }

  const email = normEmail(lead.Email);
  const phone = normPhone(lead.phone);

  const user_data = {};
  if (email) user_data.em = [sha256(email)];
  if (phone) user_data.ph = [sha256(phone)];
  if (lead.Nome) user_data.fn = [sha256(String(lead.Nome).trim().toLowerCase().split(' ')[0])];
  if (lead.fbp) user_data.fbp = lead.fbp;
  if (lead.fbc) user_data.fbc = lead.fbc;
  user_data.client_user_agent = lead.user_agent || req.headers.get('user-agent') || '';
  const ip = req.headers.get('x-nf-client-connection-ip') ||
             (req.headers.get('x-forwarded-for') || '').split(',')[0].trim();
  if (ip) user_data.client_ip_address = ip;

  const evento = {
    event_name: 'Lead',
    event_time: Math.floor(Date.now() / 1000),
    event_id: lead.event_id || undefined,          // mesmo id do Pixel: deduplica
    event_source_url: lead.event_source_url || lead.landing_url || undefined,
    action_source: 'website',
    user_data,
    custom_data: {
      content_name: 'Black Sosseguinho',
      utm_source:   lead.utm_source   || '',
      utm_medium:   lead.utm_medium   || '',
      utm_campaign: lead.utm_campaign || '',
      utm_content:  lead.utm_content  || '',
      utm_term:     lead.utm_term     || ''
    }
  };

  const url = `https://graph.facebook.com/${API}/${PIXEL_ID}/events?access_token=${encodeURIComponent(TOKEN)}`;
  const corpo = { data: [evento] };
  if (process.env.META_TEST_EVENT_CODE) corpo.test_event_code = process.env.META_TEST_EVENT_CODE;

  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(corpo)
    });
    const resposta = await r.json();
    if (!r.ok) console.error('CAPI recusou:', JSON.stringify(resposta));
    return new Response(JSON.stringify({ ok: r.ok, meta: resposta }),
      { status: 200, headers: { ...cors, 'content-type': 'application/json' } });
  } catch (e) {
    console.error('CAPI falhou:', e);
    return new Response(JSON.stringify({ ok: false, motivo: String(e) }),
      { status: 200, headers: { ...cors, 'content-type': 'application/json' } });
  }
};
