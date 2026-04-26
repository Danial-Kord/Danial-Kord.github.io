const links = [
  { label: "GitHub", href: "https://github.com/Danial-Kord" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/danial-kord" },
  { label: "Email", href: "mailto:Danial.Kordmodanlou@gmail.com" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-rule">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-5 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="text-scrim">
          <div className="label mb-2">end of buffer</div>
          <div className="font-display text-2xl tracking-tight">
            Danial Kordmodanlou
          </div>
          <div className="text-fg-dim text-sm">
            ML × real-time systems × game engineering · Toronto
          </div>
        </div>
        <div className="text-scrim flex flex-col items-start gap-3 sm:ml-auto sm:items-end">
          <div className="flex gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-mono text-[12px] tracking-[0.16em] uppercase text-fg-dim transition-colors hover:text-accent"
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="font-mono text-[11px] text-fg-mute">
            © {year} · built with three.js, next.js, and too many late nights
          </div>
        </div>
      </div>
    </footer>
  );
}
