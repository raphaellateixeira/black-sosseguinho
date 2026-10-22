# Black Sossegada — página de captação

Landing de captação de leads para a Black Friday da Renata Bermudez (Sosseguinho).
Revelação da oferta: **11/11/2026**.

Estática, sem build, sem dependência. Só `index.html`.

---

## Subir no GitHub + Netlify

```bash
cd lp-black-sossegada
git init
git add .
git commit -m "Black Sossegada: pagina de captacao"
git branch -M main
git remote add origin git@github.com:SEU-USUARIO/black-sossegada.git
git push -u origin main
```

No Netlify: **Add new site → Import an existing project → GitHub**, escolhe o repositório.

- Build command: *(deixar vazio)*
- Publish directory: `.`

Deploy sai em segundos. Cada push na `main` republica sozinho.

---

## Antes de mandar tráfego

| O quê | Onde | Status |
|---|---|---|
| Link do grupo de WhatsApp | `index.html`, const `GRUPO` | pronto |
| Meta Pixel | bloco comentado no `<head>` | **pendente** |
| GA4 | bloco comentado no `<head>` | **pendente** |
| Foto da Renata | `/renata.jpg` na raiz | **pendente** |
| Imagem de compartilhamento 1200x630 | `/og.jpg` na raiz | **pendente** |
| URL final na og:image | meta tag do `<head>` | **pendente** |
| Cores da marca | `:root` no CSS | usando provisórias |

---

## Captura de leads

O formulário usa **Netlify Forms** (`data-netlify="true"`). Não precisa de backend.

Os envios aparecem em **Site configuration → Forms** no painel do Netlify, com
exportação em CSV. Depois do envio a pessoa é redirecionada para o grupo.

Campos gravados: `nome`, `email`, `telefone`, mais `utm_source`, `utm_medium`,
`utm_campaign`, `utm_content`, `utm_term`, `referrer` e `landing_url`.

As UTMs são lidas da query string e gravadas junto do lead, então dá para cruzar
lead com criativo direto no CSV.

> Se a captação for pelo ManyChat, o `fetch` no fim do `index.html` é onde se
> troca o destino. O resto da página não muda.

**Anti-spam:** honeypot (campo `empresa`, invisível). Sem CAPTCHA, que atrapalharia
a conversão.

---

## Afirmações a confirmar com a Renata

Estão marcadas com `TODO CONFIRMAR` no HTML.

- **Credenciais.** A página diz "Bióloga, especialista em Neurociência e
  Desenvolvimento Infantil". Veio do briefing, mas precisa do aval dela.
- **Desde 2008.** O briefing registra atuação desde 2008. A página não afirma
  número de anos, para não repetir o erro dos "17 anos".
- **Número de famílias atendidas.** Deixei **fora** da página de propósito: o
  briefing fala em mais de 10.000 e a VSL fala em 6.500. Antes de publicar
  qualquer número, confirmar qual é o certo e corrigir nos dois lugares.
- **"Desconto não é uma coisa que eu faço".** Formulação de prática atual, não
  de histórico. Ela mesma lembrou na call que vendeu cursos a R$ 100,00 e
  R$ 50,00 há uns 8 anos, então a página não diz "nunca dei desconto".
