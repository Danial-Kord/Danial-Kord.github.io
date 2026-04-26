import type { MDXComponents } from "mdx/types";

/**
 * Custom MDX block primitives used inside case studies.
 * These slot into the `components` map passed to MDXRemote.
 */

export function Architecture({ children }: { children: React.ReactNode }) {
  return (
    <figure className="my-10 border border-rule bg-bg-1">
      <div className="flex items-center justify-between border-b border-rule px-4 py-2">
        <span className="label">system architecture</span>
        <span className="font-mono text-[10px] text-fg-mute">ascii · v1</span>
      </div>
      <pre className="overflow-x-auto bg-transparent p-6 font-mono text-[12.5px] leading-[1.55] text-fg">
        {children}
      </pre>
    </figure>
  );
}

export function Failure({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="my-8 border border-rule bg-[rgba(255,107,107,0.04)] p-5">
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-block h-1.5 w-1.5 bg-err shadow-[0_0_6px_var(--err)]" />
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-err">
          what broke · {title}
        </span>
      </div>
      <div className="text-[15.5px] leading-relaxed text-[#c9cdd9]">
        {children}
      </div>
    </aside>
  );
}

export function Step({
  n,
  label,
  children,
}: {
  n: number | string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="my-5 grid grid-cols-[auto_1fr] gap-4 border-l border-rule pl-5">
      <div className="font-mono text-[12px] tracking-[0.18em] text-accent">
        {String(n).padStart(2, "0")}
      </div>
      <div>
        <div className="font-display text-[17px] text-fg">{label}</div>
        <div className="mt-1 text-[15.5px] leading-relaxed text-[#c9cdd9]">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Pull({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-10 border-y border-rule py-6">
      <p className="font-display text-2xl font-light leading-snug text-fg sm:text-3xl">
        {children}
      </p>
    </div>
  );
}

export const mdxComponents: MDXComponents = {
  Architecture,
  Failure,
  Step,
  Pull,
};
