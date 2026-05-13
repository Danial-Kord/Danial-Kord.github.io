/**
 * Client helper for the portfolio chatbot.
 *
 * Hits the Cloudflare Worker (see ../../../chatbot-worker) which proxies
 * to Gemini 2.5 Flash Lite and holds the API key + persona prompt.
 *
 * Set NEXT_PUBLIC_CHAT_API_URL in web/.env.local at build time to your
 * deployed Worker URL, or hardcode it via the DEFAULT_CHAT_API_URL
 * fallback below once it's known.
 */

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

/**
 * Production Pages builds must set NEXT_PUBLIC_CHAT_API_URL (GitHub Actions
 * secret or web/.env.local) to your deployed Worker URL, e.g.
 * https://chatbot-backend.<subdomain>.workers.dev
 *
 * Local `next dev` falls back to the Worker from `wrangler dev` when unset.
 */
function resolveChatApiUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_CHAT_API_URL?.trim();
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
  } catch (err) {
    let msg =
      err instanceof Error ? err.message : "Network error.";
    if (msg === "Failed to fetch") {
      msg =
        "Could not reach the chat backend. Confirm the Worker URL in NEXT_PUBLIC_CHAT_API_URL, redeploy Pages, and redeploy the Worker after CORS updates.";
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
