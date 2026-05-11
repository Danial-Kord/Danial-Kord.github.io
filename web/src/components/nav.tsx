import Link from "next/link";

const items = [
  { href: "/#portfolio", label: "Work" },
  { href: "/#experience", label: "Experience" },
  { href: "/#awards", label: "Honors" },
  { href: "/#skills", label: "Skills" },
  { href: "/#chat", label: "Ask" },
  { href: "/#contact", label: "Contact" },
];

export function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-rule bg-bg/60 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-[1240px] items-center justify-between px-5">
        <Link
          href="/"
          className="group flex items-center gap-2 font-mono text-[12px] tracking-[0.18em] uppercase text-fg-dim hover:text-fg"
        >
          <span
            className="inline-block h-2 w-2 bg-accent shadow-[0_0_10px_var(--accent)] group-hover:animate-pulse"
            aria-hidden
          />
          <span>kordmodanlou.engine</span>
        </Link>
        <nav className="flex items-center gap-1">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="group relative px-3 py-1.5 font-mono text-[12px] tracking-[0.16em] uppercase text-fg-dim transition-colors hover:text-fg"
            >
              <span className="opacity-50 mr-1.5 text-accent">/</span>
              {it.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
