/**
 * Cloudflare Worker — portfolio chatbot backend.
 *
 * Proxies multi-turn chat from danial-kord.github.io to Google's
 * Gemini 2.5 Flash Lite. Holds the API key as a secret (env.GEMINI_API_KEY)
 * and injects a persona system prompt so the bot answers as Danial's
 * portfolio assistant.
 *
 *   POST /        body: { messages: [{ role: "user"|"assistant", content: string }, ...] }
 *   200 OK        body: { reply: string }
 *   400/403/5xx   body: { error: string }
 */

import { PORTFOLIO_SYSTEM_PROMPT } from "./prompt.js";

const ALLOWED_ORIGINS = new Set([
  "https://danial-kord.github.io",
  "https://www.danial-kord.github.io",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

const MAX_MESSAGES = 20;
const MAX_CONTENT_CHARS = 2000;
const GEMINI_MODEL = "gemini-2.5-flash-lite";
const GEMINI_TIMEOUT_MS = 25_000;

function corsHeaders(origin) {
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : "";
  return {
    "Access-Control-Allow-Origin": allow,
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function json(body, init = {}, origin = "") {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin),
      ...(init.headers || {}),
    },
  });
}

function validate(payload) {
  if (!payload || typeof payload !== "object") {
    return "Request body must be a JSON object.";
  }
  const { messages } = payload;
  if (!Array.isArray(messages) || messages.length === 0) {
    return "`messages` must be a non-empty array.";
  }
  if (messages.length > MAX_MESSAGES) {
    return `Too many messages (max ${MAX_MESSAGES}).`;
  }
  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    if (!m || typeof m !== "object") {
      return `messages[${i}] must be an object.`;
    }
    if (m.role !== "user" && m.role !== "assistant") {
      return `messages[${i}].role must be "user" or "assistant".`;
    }
    if (typeof m.content !== "string" || m.content.length === 0) {
      return `messages[${i}].content must be a non-empty string.`;
    }
    if (m.content.length > MAX_CONTENT_CHARS) {
      return `messages[${i}].content exceeds ${MAX_CONTENT_CHARS} chars.`;
    }
  }
  if (messages[messages.length - 1].role !== "user") {
    return "The last message must come from `user`.";
  }
  return null;
}

async function callGemini(env, messages) {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/` +
    `${GEMINI_MODEL}:generateContent?key=${env.GEMINI_API_KEY}`;

  const body = {
    systemInstruction: { parts: [{ text: PORTFOLIO_SYSTEM_PROMPT }] },
    contents: messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 800,
    },
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.error?.message || `Gemini returned ${res.status}.`;
    const err = new Error(msg);
    err.status = res.status >= 500 ? 502 : res.status;
    throw err;
  }

  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!reply) {
    // Surface a useful hint when the response was filtered or empty.
    const finish = data?.candidates?.[0]?.finishReason;
    if (finish && finish !== "STOP") {
      const err = new Error(`Gemini stopped early: ${finish}.`);
      err.status = 502;
      throw err;
    }
    return "No response.";
  }
  return reply;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed." }, { status: 405 }, origin);
    }

    if (origin && !ALLOWED_ORIGINS.has(origin)) {
      return json({ error: "Origin not allowed." }, { status: 403 }, origin);
    }

    if (!env.GEMINI_API_KEY) {
      return json(
        { error: "Server misconfigured: missing GEMINI_API_KEY." },
        { status: 500 },
        origin,
      );
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: "Invalid JSON body." }, { status: 400 }, origin);
    }

    const invalid = validate(payload);
    if (invalid) {
      return json({ error: invalid }, { status: 400 }, origin);
    }

    try {
      const reply = await callGemini(env, payload.messages);
      return json({ reply }, { status: 200 }, origin);
    } catch (err) {
      const status = err?.status || 500;
      return json(
        { error: err?.message || "Upstream error." },
        { status },
        origin,
      );
    }
  },
};
