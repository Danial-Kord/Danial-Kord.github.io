/**
 * Client helper for the portfolio chatbot.
 *
 * Hits the Cloudflare Worker (see ../../../chatbot-worker) which proxies
 * to Gemini 3.1 Flash Lite and holds the API key + persona prompt.
 *
 * Set NEXT_PUBLIC_CHAT_API_URL at build time (GitHub Actions secret or
 * web/.env.local). Values are normalized (quotes / trailing slashes stripped).
 */

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

/**
 * Normalize URL baked in at build time (GitHub secrets sometimes include
 * wrapping quotes, trailing slashes, or stray whitespace).
 */
export function normalizeChatApiUrl(raw: string | undefined): string {
  if (raw == null) return "";
  let s = String(raw).trim().replace(/\r|\n/g, "");
  if (!s) return "";
  s = s.replace(/^["'`]+|["'`]+$/g, "").trim();
  if (!s) return "";
  s = s.replace(/\/+$/, "");
  try {
    const u = new URL(s);
    if (u.protocol !== "http:" && u.protocol !== "https:") return "";
    return `${u.protocol}//${u.host}${u.pathname.replace(/\/+$/, "")}${u.search}`;
  } catch {
    return "";
  }
}

/**
 * Production Pages builds must set NEXT_PUBLIC_CHAT_API_URL (GitHub Actions
 * secret or web/.env.local) to your deployed Worker URL, e.g.
 * https://chatbot-backend.<subdomain>.workers.dev
 *
 * Local `next dev` falls back to the Worker from `wrangler dev` when unset.
 */
function resolveChatApiUrl(): string {
  const fromEnv = normalizeChatApiUrl(process.env.NEXT_PUBLIC_CHAT_API_URL);
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV !== "production") {
    return "http://127.0.0.1:8787";
  }
  return "";
}

export const CHAT_API_URL = resolveChatApiUrl();

export class ChatError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ChatError";
    this.status = status;
  }
}

/**
 * Send a multi-turn conversation to the Worker and return the assistant
 * reply. The Worker enforces:
 *   - max 20 messages per request
 *   - max 2000 chars per message
 *   - last message must come from `user`
 */
export async function sendChat(messages: ChatMessage[]): Promise<string> {
  if (!CHAT_API_URL) {
    throw new ChatError(
      "Chat backend not configured (NEXT_PUBLIC_CHAT_API_URL is empty).",
    );
  }

  let res: Response;
  try {
    res = await fetch(CHAT_API_URL, {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
  } catch (err) {
    let msg =
      err instanceof Error ? err.message : "Network error.";
    if (msg === "Failed to fetch") {
      let host = "";
      try {
        host = new URL(CHAT_API_URL).hostname;
      } catch {
        host = "(invalid URL)";
      }
      msg =
        `Could not reach chat backend (${host}). Often: wrong NEXT_PUBLIC_CHAT_API_URL (re-save GitHub secret without quotes; redeploy Pages), ` +
        `or CORS if you use a custom domain — add https://your-domain.com to Worker EXTRA_ALLOWED_ORIGINS and redeploy the Worker.`;
    }
    throw new ChatError(msg);
  }

  const data = (await res.json().catch(() => ({}))) as {
    reply?: string;
    error?: string;
  };

  if (!res.ok) {
    throw new ChatError(
      data.error || `Chat backend returned ${res.status}.`,
      res.status,
    );
  }

  return data.reply ?? "";
}
