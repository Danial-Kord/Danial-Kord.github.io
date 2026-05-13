"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { MessageSquare, Send, RotateCcw, X } from "lucide-react";
import {
  CHAT_API_URL,
  ChatError,
  sendChat,
  type ChatMessage,
} from "@/lib/chat";
import { cn } from "@/lib/cn";
import {
  AssistantBubble,
  type AssistantBubbleState,
} from "./assistant-bubble";

type UIMessage = {
  id: string;
  role: ChatMessage["role"];
  content: string;
  // Assistant-only. user messages and the static welcome are always "done".
  state?: AssistantBubbleState;
};

let _uidCounter = 0;
const makeId = () => `m_${Date.now().toString(36)}_${(_uidCounter++).toString(36)}`;

const WELCOME: UIMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi — I'm kordmodanlou.engine, Danial's portfolio assistant. Ask me about his projects, experience, or how to get in touch.",
  state: "done",
};

const SUGGESTIONS: string[] = [
  "Tell me about DigiHuman.",
  "What's his VR firefighter work?",
  "How can I hire him?",
];

const MAX_INPUT_CHARS = 2000;
const HASH = "#chat";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<UIMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const launcherRef = useRef<HTMLButtonElement | null>(null);

  const backendReady = useMemo(() => CHAT_API_URL.length > 0, []);

  const close = useCallback(() => {
    setOpen(false);
    if (typeof window !== "undefined" && window.location.hash === HASH) {
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
  }, []);

  // Open via #chat hash so the Nav "Ask" link keeps working.
  useEffect(() => {
    const sync = () => {
      if (window.location.hash === HASH) setOpen(true);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading, open]);

  // Lock body scroll while dialog is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on Escape; focus textarea on open; restore focus on close.
  useEffect(() => {
    if (!open) {
      launcherRef.current?.focus({ preventScroll: true });
      return;
    }
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    const raf = requestAnimationFrame(() => textareaRef.current?.focus());
    return () => {
      window.removeEventListener("keydown", handler);
      cancelAnimationFrame(raf);
    };
  }, [open, close]);

  const markRevealComplete = useCallback((id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, state: "done" } : m)),
    );
  }, []);

  const submit = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      if (!backendReady) {
        setError(
          "Chat backend isn't wired up yet. Reach out via the Contact section below.",
        );
        return;
      }

      const userMsg: UIMessage = {
        id: makeId(),
        role: "user",
        content: trimmed.slice(0, MAX_INPUT_CHARS),
      };
      const placeholder: UIMessage = {
        id: makeId(),
        role: "assistant",
        content: "",
        state: "pending",
      };

      const optimistic = [...messages, userMsg, placeholder];
      setMessages(optimistic);
      setInput("");
      setIsLoading(true);
      setError(null);

      // The Worker only takes role+content and rejects empty/non-user tails,
      // so strip the placeholder before sending.
      const apiPayload: ChatMessage[] = optimistic
        .filter((m) => m.state !== "pending")
        .map(({ role, content }) => ({ role, content }));

      try {
        const reply = await sendChat(apiPayload);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === placeholder.id
              ? { ...m, content: reply || "No response.", state: "revealing" }
              : m,
          ),
        );
      } catch (err) {
        const msg =
          err instanceof ChatError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Something went wrong.";
        setError(msg);
        setMessages((prev) =>
          prev.filter((m) => m.id !== userMsg.id && m.id !== placeholder.id),
        );
        setInput(trimmed);
      } finally {
        setIsLoading(false);
        textareaRef.current?.focus();
      }
    },
    [backendReady, isLoading, messages],
  );

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void submit(input);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void submit(input);
    }
  };

  const reset = () => {
    if (isLoading) return;
    setMessages([WELCOME]);
    setInput("");
    setError(null);
  };

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open chat with the portfolio AI"
        aria-expanded={open}
        aria-controls="chat-dialog"
        className={cn(
          "group fixed bottom-5 right-5 z-50 inline-flex h-14 items-center gap-2.5 border border-accent bg-bg/85 px-4 font-mono text-[12px] uppercase tracking-[0.18em] text-accent shadow-[0_0_24px_rgba(127,255,212,0.18)] backdrop-blur-md transition-all duration-200 hover:bg-accent hover:text-bg hover:shadow-[0_0_36px_rgba(127,255,212,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 sm:bottom-6 sm:right-6",
          open && "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <MessageSquare className="h-5 w-5" />
        <span className="hidden sm:inline">ask the engine</span>
        <span
          className="absolute -right-1 -top-1 h-2 w-2 animate-pulse bg-accent shadow-[0_0_8px_var(--accent)]"
          aria-hidden
        />
      </button>

      {open && (
        <div
          id="chat-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="chat-dialog-title"
          className="chat-dialog fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6"
        >
          <button
            type="button"
            aria-label="Close chat"
            onClick={close}
            className="chat-dialog__backdrop absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div className="chat-dialog__panel relative z-10 flex h-[min(680px,calc(100dvh-1.5rem))] w-full max-w-[760px] flex-col border border-rule bg-bg-1/92 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md">
            <div className="flex items-start justify-between gap-4 border-b border-rule px-4 py-3 sm:px-5">
              <div className="flex items-start gap-3">
                <span
                  className="mt-2 inline-block h-2 w-2 animate-pulse bg-accent shadow-[0_0_10px_var(--accent)]"
                  aria-hidden
                />
                <div className="min-w-0">
                  <div className="label">008 · ask the engine</div>
                  <h2
                    id="chat-dialog-title"
                    className="font-display text-xl font-light tracking-tight text-fg sm:text-2xl"
                  >
                    Talk to the portfolio AI.
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-rule text-fg-dim transition-colors hover:border-accent/60 hover:text-accent focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/60"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div
              ref={scrollRef}
              aria-live="polite"
              aria-label="Chat transcript"
              className="relative flex-1 overflow-y-auto p-4 sm:p-5"
            >
              <ol className="flex flex-col gap-3">
                {messages.map((m) => (
                  <li
                    key={m.id}
                    className={cn(
                      "flex w-full",
                      m.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    {m.role === "user" ? (
                      <UserBubble text={m.content} />
                    ) : (
                      <AssistantBubble
                        text={m.content}
                        state={m.state ?? "done"}
                        messageId={m.id}
                        onRevealComplete={markRevealComplete}
                      />
                    )}
                  </li>
                ))}
              </ol>
            </div>

            {error && (
              <div
                role="alert"
                className="border-t border-err/40 bg-err/5 px-4 py-2 font-mono text-[12px] text-err sm:px-5"
              >
                {error}
              </div>
            )}

            {messages.length <= 1 && (
              <div className="border-t border-rule px-4 py-3 sm:px-5">
                <div className="label mb-2">try asking</div>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={isLoading || !backendReady}
                      onClick={() => void submit(s)}
                      className="border border-rule px-3 py-1.5 font-mono text-[11px] text-fg-dim transition-colors hover:border-accent/60 hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form
              onSubmit={onFormSubmit}
              className="flex items-end gap-3 border-t border-rule p-4 sm:p-5"
            >
              <label htmlFor="chat-input" className="sr-only">
                Message
              </label>
              <textarea
                id="chat-input"
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={
                  backendReady
                    ? "Ask about a project, role, or skill…"
                    : "Chat backend not configured yet."
                }
                maxLength={MAX_INPUT_CHARS}
                rows={2}
                disabled={isLoading || !backendReady}
                className="min-h-[56px] w-full resize-none border border-rule bg-bg/60 px-3 py-2.5 font-mono text-[13px] text-fg placeholder:text-fg-mute focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/40 disabled:opacity-60"
              />
              <div className="flex shrink-0 flex-col gap-2">
                <button
                  type="submit"
                  disabled={isLoading || !input.trim() || !backendReady}
                  aria-label={isLoading ? "Sending" : "Send message"}
                  title={isLoading ? "Sending" : "Send"}
                  className="inline-flex h-10 items-center justify-center gap-2 border border-accent bg-accent/10 px-4 font-mono text-[12px] uppercase tracking-[0.18em] text-accent transition-colors hover:bg-accent hover:text-bg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-accent/10 disabled:hover:text-accent"
                >
                  <Send className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={reset}
                  disabled={isLoading || messages.length <= 1}
                  aria-label="Reset conversation"
                  title="Reset conversation"
                  className="inline-flex h-8 items-center justify-center border border-rule px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-fg-mute transition-colors hover:border-accent/60 hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RotateCcw className="h-3 w-3" />
                </button>
              </div>
            </form>

            <p className="border-t border-rule px-4 py-2 font-mono text-[10.5px] leading-relaxed text-fg-mute sm:px-5">
              Conversations are not stored. The model can be wrong — verify
              anything critical via{" "}
              <a
                href="#contact"
                onClick={close}
                className="text-fg-dim underline decoration-rule-strong underline-offset-2 hover:text-accent hover:decoration-accent"
              >
                Contact
              </a>
              .
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="max-w-[88%] border border-accent/60 bg-accent/5 px-3 py-2 font-mono text-[13px] leading-relaxed whitespace-pre-wrap">
      <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-accent/70">
        you
      </div>
      <div className="text-fg">{text}</div>
    </div>
  );
}
