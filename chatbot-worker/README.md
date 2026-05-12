# chatbot-backend

Cloudflare Worker that proxies the portfolio chatbot on
[danial-kord.github.io](https://danial-kord.github.io) to
Google's Gemini 3.1 Flash Lite. The Worker holds the API key as a secret
and injects a persona system prompt (see [`src/prompt.js`](src/prompt.js))
so the bot answers as Danial's portfolio assistant.

## Layout

```
chatbot-worker/
├── src/
│   ├── index.js     # fetch handler (CORS, validation, Gemini call)
│   └── prompt.js    # PORTFOLIO_SYSTEM_PROMPT (persona + grounding)
├── package.json
├── wrangler.toml
├── .dev.vars.example
└── .gitignore
```

## API

```
POST  /
Content-Type: application/json

{
  "messages": [
    { "role": "user",      "content": "Tell me about DigiHuman." },
    { "role": "assistant", "content": "DigiHuman is..." },
    { "role": "user",      "content": "What does PIFuHD do here?" }
  ]
}
```

Successful response:

```json
{ "reply": "..." }
```

Errors (`4xx`/`5xx`) come back as `{ "error": "..." }`. Limits enforced
by the Worker:

- max 20 messages per request
- max 2000 chars per message
- last message must have `role: "user"`
- CORS: `https://danial-kord.github.io`, `https://www.danial-kord.github.io`,
  and `http://localhost:3000` / `127.0.0.1:3000` by default
- Optional: set plain-text var **`EXTRA_ALLOWED_ORIGINS`** (comma-separated)
  in [`wrangler.toml`](wrangler.toml) or the Cloudflare dashboard for custom
  Pages domains (must match the browser `Origin` exactly, e.g.
  `https://danialkord.com,https://www.danialkord.com`)

## First-time setup

```bash
cd chatbot-worker
npm install
npx wrangler login
```

Get a Gemini API key at [Google AI Studio](https://aistudio.google.com/app/apikey),
then store it as a Worker secret:

```bash
npx wrangler secret put GEMINI_API_KEY
# paste the key when prompted
```

## Local development

```bash
cp .dev.vars.example .dev.vars
# edit .dev.vars and paste your GEMINI_API_KEY
npm run dev
```

`wrangler dev` serves on http://localhost:8787. Smoke test:

```bash
curl -X POST http://localhost:8787 \
  -H "Origin: http://localhost:3000" \
  -H "Content-Type: application/json" \
  -d "{\"messages\":[{\"role\":\"user\",\"content\":\"Hi, who is Danial?\"}]}"
```

## Deploy

```bash
npm run deploy
```

Wrangler prints the production URL, e.g.
`https://chatbot-backend.<your-subdomain>.workers.dev`.

**GitHub Pages:** add a repository secret `NEXT_PUBLIC_CHAT_API_URL` with
that exact URL (Settings → Secrets and variables → Actions). Paste the URL
only — **do not wrap it in quotes.** The
[`deploy-github-pages.yml`](../.github/workflows/deploy-github-pages.yml)
workflow passes it into `next build` so the static site calls the right
Worker.

**Local builds:** copy [`web/.env.local.example`](../web/.env.local.example)
to `web/.env.local` and set the same variable.

After changing allowed origins (`EXTRA_ALLOWED_ORIGINS` in [`wrangler.toml`](wrangler.toml)
or the Worker variables in the Cloudflare dashboard), run `npm run deploy` again.

Then push — the Pages workflow rebuilds with the URL inlined.

To stream logs from production:

```bash
npm run tail
```

## Updating the persona

Edit [`src/prompt.js`](src/prompt.js) and redeploy:

```bash
npm run deploy
```

No changes to the frontend are needed; the prompt lives entirely in the
Worker so users can't read or override it.
