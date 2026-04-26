export function SectionHeader({
  num,
  kicker,
  title,
  intro,
}: {
  num: string;
  kicker: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[160px_1fr]">
      <div className="label pt-2">
        {num} · {kicker}
      </div>
      <div>
        <h2 className="font-display text-3xl font-light tracking-tight text-fg sm:text-4xl">
          {title}
        </h2>
        {intro && (
          <p className="mt-3 max-w-2xl text-fg-dim">{intro}</p>
        )}
      </div>
    </div>
  );
}
