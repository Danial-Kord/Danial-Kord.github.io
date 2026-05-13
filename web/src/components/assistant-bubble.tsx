"use client";

/**
 * Assistant chat bubble that runs an in-place matrix-rain → decode effect.
 *
 * Lifecycle:
 *   1. state = "pending"   → canvas runs an idle matrix rain in a fixed area.
 *   2. state = "revealing" → canvas measures the response, builds per-column
 *                            "target" glyph positions, and lets the rain
 *                            deposit the real characters as each head crosses
 *                            its target Y. Columns die after delivering.
 *   3. state = "done"      → swap canvas for static HTML so the text is
 *                            selectable, copyable, and screen-reader friendly.
 *
 * Honors prefers-reduced-motion (skips straight to static text).
 */

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const FONT_SIZE = 13;
const LINE_HEIGHT_MUL = 1.55;
const LINE_HEIGHT = FONT_SIZE * LINE_HEIGHT_MUL;
const CHARSET =
  "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]()/\\|=+-*&^%$#@!?".split(
    "",
  );

const PENDING_HEIGHT = 92;
const COL_DYING_DURATION = 260;
const TAIL_DURATION = 420;
const MIN_HEAD_SPEED = 1.1;
const HEAD_SPEED_RANGE = 2.4;

export type AssistantBubbleState = "pending" | "revealing" | "done";

type Glyph = {
  ch: string;
  x: number;
  y: number;
  col: number;
};

type Column = {
  x: number;
  y: number;
  speed: number;
  len: number;
  swap: number;
  head: string;
  hueShift: number;
  targets: number[];
  targetIdx: number;
  dyingSince: number;
};

export function AssistantBubble({
  text,
  state,
  messageId,
  onRevealComplete,
}: {
  text: string;
  state: AssistantBubbleState;
  messageId: string;
  /**
   * Called once with `messageId` when the reveal animation has finished.
   * The parent is expected to flip the message's state to "done", which
   * unmounts the canvas and renders the text as static HTML.
   */
  onRevealComplete?: (id: string) => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const completeFiredRef = useRef(false);
  const [contentWidth, setContentWidth] = useState(0);

  // Reset the "completed" guard if the parent restarts the reveal.
  useEffect(() => {
    if (state !== "done") completeFiredRef.current = false;
  }, [state]);

  // Track the inner content width so the canvas can size to it.
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    setContentWidth(el.clientWidth);
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      if (w > 0) setContentWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Drive the canvas animation. Re-runs when phase, text, or width changes.
  useEffect(() => {
    if (state === "done") return;
    if (contentWidth <= 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const maybeCtx = canvas.getContext("2d", { alpha: false });
    if (!maybeCtx) return;
    const ctx: CanvasRenderingContext2D = maybeCtx;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduced) {
      if (state === "revealing" && !completeFiredRef.current) {
        completeFiredRef.current = true;
        // Defer so React doesn't see the parent's setState during render.
        queueMicrotask(() => onRevealComplete?.(messageId));
      }
      return;
    }

    // -- Layout: figure out where each glyph in the response will land. --
    ctx.font = `${FONT_SIZE}px "JetBrains Mono", ui-monospace, monospace`;
    const charWidth = ctx.measureText("M").width || FONT_SIZE * 0.6;
    const glyphs: Glyph[] =
      state === "revealing" ? layoutText(text, contentWidth, charWidth) : [];

    const maxY = glyphs.reduce((m, g) => Math.max(m, g.y), 0);
    const canvasHeight =
      state === "revealing"
        ? Math.max(PENDING_HEIGHT, Math.ceil(maxY + LINE_HEIGHT + 6))
        : PENDING_HEIGHT;

    // -- Canvas sizing (DPR-aware). --
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    canvas.width = Math.floor(contentWidth * dpr);
    canvas.height = Math.floor(canvasHeight * dpr);
    canvas.style.width = `${contentWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.fillStyle = "rgba(10, 13, 18, 1)";
    ctx.fillRect(0, 0, contentWidth, canvasHeight);

    // -- Build columns, bucketing each glyph into its nearest column. --
    const colCount = Math.max(1, Math.floor(contentWidth / FONT_SIZE));
    const targetsByCol: number[][] = Array.from({ length: colCount }, () => []);
    glyphs.forEach((g, idx) => {
      const c = Math.min(colCount - 1, Math.max(0, Math.round(g.x / FONT_SIZE)));
      g.col = c;
      targetsByCol[c].push(idx);
    });
    for (const list of targetsByCol) {
      list.sort((a, b) => glyphs[a].y - glyphs[b].y);
    }

    const cols: Column[] = Array.from({ length: colCount }, (_, i) => ({
      x: i * FONT_SIZE,
      // Pending: scatter Y across the canvas so the rain is visible
      // immediately. Revealing: start above so the rain falls *through*
      // the targets and deposits each letter as it crosses.
      y:
        state === "pending"
          ? -16 + Math.random() * (canvasHeight + 24)
          : -Math.random() * canvasHeight * 0.6 - 8,
      speed: MIN_HEAD_SPEED + Math.random() * HEAD_SPEED_RANGE,
      len: 6 + Math.floor(Math.random() * 14),
      swap: 0.06 + Math.random() * 0.14,
      head: CHARSET[(Math.random() * CHARSET.length) | 0],
      hueShift: Math.random(),
      targets: targetsByCol[i],
      targetIdx: 0,
      dyingSince: 0,
    }));

    // Glyphs that have been "deposited" by their column.
    const locked = new Set<number>();

    let rafId = 0;
    let lastT = performance.now();
    // Timestamp when the last target was locked. Once set, all still-living
    // columns start their fade so the canvas resolves to just the message.
    let allDeliveredAt: number | null = null;

    // Re-use a working glyph point for drawing the deposited letters.
    const drawLocked = () => {
      ctx.fillStyle = "rgba(220, 255, 235, 0.98)";
      for (const gi of locked) {
        const g = glyphs[gi];
        ctx.fillText(g.ch, g.x, g.y);
      }
    };

    function step(now: number) {
      const dt = Math.min(48, now - lastT) / 16.6667; // ≈1 at 60fps
      lastT = now;

      // Soft trail fade.
      ctx.fillStyle = "rgba(10, 13, 18, 0.11)";
      ctx.fillRect(0, 0, contentWidth, canvasHeight);

      ctx.font = `${FONT_SIZE}px "JetBrains Mono", ui-monospace, monospace`;
      ctx.textBaseline = "top";

      // First pass: deliver targets that the heads have just crossed.
      if (state === "revealing") {
        for (const c of cols) {
          while (c.targetIdx < c.targets.length) {
            const t = glyphs[c.targets[c.targetIdx]];
            if (c.y < t.y) break;
            locked.add(c.targets[c.targetIdx]);
            c.targetIdx += 1;
            if (c.targetIdx < c.targets.length) {
              // Respawn just below the deposited glyph so rain "continues"
              // toward the next target in this column.
              c.y = t.y + FONT_SIZE * 0.35;
              c.head = CHARSET[(Math.random() * CHARSET.length) | 0];
            } else {
              c.dyingSince = now;
            }
          }
        }

        // Once every column with targets has delivered them, mark the
        // remaining (no-target) columns as dying so they fade together.
        if (allDeliveredAt === null) {
          const everyDelivered = cols.every(
            (c) => c.targetIdx >= c.targets.length,
          );
          if (everyDelivered) {
            allDeliveredAt = now;
            for (const c of cols) {
              if (c.dyingSince === 0) c.dyingSince = now;
            }
          }
        }
      }

      for (const c of cols) {
        const dying = c.dyingSince > 0;
        const dyingT = dying
          ? Math.min(1, (now - c.dyingSince) / COL_DYING_DURATION)
          : 0;
        const colVis = dying ? 1 - dyingT : 1;

        if (colVis > 0.02) {
          if (Math.random() < c.swap) {
            c.head = CHARSET[(Math.random() * CHARSET.length) | 0];
          }

          if (c.y > -FONT_SIZE && c.y < canvasHeight) {
            const r = 180 + Math.floor(c.hueShift * 30);
            const g = 255;
            const b = 220 + Math.floor(c.hueShift * 20);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.95 * colVis})`;
            ctx.fillText(c.head, c.x, c.y);
          }

          for (let k = 1; k < c.len; k++) {
            const ty = c.y - k * FONT_SIZE;
            if (ty < -FONT_SIZE) break;
            if (ty >= canvasHeight) continue;
            const t = k / c.len;
            const a = (1 - t) * 0.55 * colVis;
            if (a < 0.03) continue;
            const ch =
              CHARSET[
                (((ty | 0) + k * 7 + (c.x | 0) * 13) >>> 0) % CHARSET.length
              ];
            const r = 110 + Math.floor(c.hueShift * 40);
            const g = 240;
            const b = 200 + Math.floor(c.hueShift * 30);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
            ctx.fillText(ch, c.x, ty);
          }
        }

        if (!dying) c.y += c.speed * dt;

        // Recycle columns that finished or never had a target.
        if (
          c.y > canvasHeight + 20 &&
          (state === "pending" ||
            (state === "revealing" && c.targets.length === 0))
        ) {
          c.y = -Math.random() * 80 - 12;
          c.speed = MIN_HEAD_SPEED + Math.random() * HEAD_SPEED_RANGE;
          c.head = CHARSET[(Math.random() * CHARSET.length) | 0];
        }
      }

      // Locked glyphs are re-drawn every frame so the trail fade doesn't eat them.
      drawLocked();

      if (state === "pending") {
        rafId = requestAnimationFrame(step);
        return;
      }

      // state === "revealing" — wait for every column to finish its fade,
      // then settle to a clean frame and signal completion.
      if (
        allDeliveredAt !== null &&
        now - allDeliveredAt > COL_DYING_DURATION + TAIL_DURATION
      ) {
        ctx.fillStyle = "rgba(10, 13, 18, 1)";
        ctx.fillRect(0, 0, contentWidth, canvasHeight);
        drawLocked();
        if (!completeFiredRef.current) {
          completeFiredRef.current = true;
          // Defer so we don't setState inside the parent's render cycle.
          queueMicrotask(() => onRevealComplete?.(messageId));
        }
        return;
      }

      rafId = requestAnimationFrame(step);
    }

    rafId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [state, text, contentWidth, messageId, onRevealComplete]);

  return (
    <div
      className={cn(
        "max-w-[88%] border border-rule-strong bg-bg-1/60 px-3 py-2 font-mono text-[13px] leading-relaxed text-fg-dim",
        // While the canvas is showing, widen the bubble so the rain has room.
        state !== "done" && "w-full max-w-[88%]",
      )}
    >
      <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-mute">
        engine
      </div>
      <div ref={contentRef} className="relative w-full min-w-[200px]">
        {state === "done" ? (
          <div className="whitespace-pre-wrap text-fg">{text}</div>
        ) : (
          <canvas
            ref={canvasRef}
            aria-hidden
            className="block w-full"
            style={{ height: PENDING_HEIGHT }}
          />
        )}
        {/* Hidden mirror so screen readers get the text as soon as it arrives. */}
        {state !== "done" && text && (
          <span className="sr-only">{text}</span>
        )}
      </div>
    </div>
  );
}

function layoutText(text: string, width: number, charWidth: number): Glyph[] {
  if (!text) return [];
  const maxCols = Math.max(1, Math.floor(width / charWidth));

  // Greedy word-wrap. Keep whitespace tokens so wide words break cleanly.
  const tokens = text.split(/(\s+)/);
  const lines: string[] = [];
  let line = "";
  for (const tok of tokens) {
    if (tok.length === 0) continue;
    if (tok.length > maxCols) {
      // Hard-break tokens that exceed line width.
      let rest = tok;
      while (rest.length > 0) {
        const room = maxCols - line.length;
        if (room <= 0) {
          lines.push(line.replace(/\s+$/, ""));
          line = "";
          continue;
        }
        line += rest.slice(0, room);
        rest = rest.slice(room);
        if (rest.length > 0) {
          lines.push(line);
          line = "";
        }
      }
      continue;
    }
    if (line.length + tok.length > maxCols) {
      lines.push(line.replace(/\s+$/, ""));
      line = /^\s+$/.test(tok) ? "" : tok;
    } else {
      line += tok;
    }
  }
  if (line.length > 0) lines.push(line);

  const glyphs: Glyph[] = [];
  for (let li = 0; li < lines.length; li++) {
    const ln = lines[li];
    const y = li * LINE_HEIGHT + 2;
    for (let ci = 0; ci < ln.length; ci++) {
      const ch = ln[ci];
      if (ch === " " || ch === "\t") continue;
      glyphs.push({
        ch,
        x: ci * charWidth,
        y,
        col: 0,
      });
    }
  }
  return glyphs;
}
