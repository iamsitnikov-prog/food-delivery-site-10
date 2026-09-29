import Icon from "@/components/ui/icon";

const Letter = ({
  letter,
  count,
  active,
  onPick,
}: {
  letter: string;
  count: number;
  active: boolean;
  onPick: () => void;
}) => (
  <button
    id={`letter-${letter}`}
    type="button"
    onClick={onPick}
    aria-current={active ? "true" : undefined}
    title={`${count} терминов на «${letter}»`}
    className={`min-w-[38px] scroll-mt-24 rounded-lg px-2.5 py-2 text-[max(12px,0.85em)] font-medium transition-colors ${
      active
        ? "bg-foreground text-background"
        : "border border-foreground/15 text-muted-foreground hover:border-foreground/40 hover:text-foreground"
    }`}
  >
    {letter}
    <span
      className={`ml-1 text-[max(12px,0.78em)] ${active ? "text-background/80" : "text-muted-foreground"}`}
    >
      {count}
    </span>
  </button>
);

const LetterNav = ({
  cyrillic,
  latin,
  active,
  counts,
  onPick,
}: {
  cyrillic: string[];
  latin: string[];
  active: string | null;
  counts: Record<string, number>;
  onPick: (letter: string | null) => void;
}) => (
  <nav aria-label="Навигация по буквам" className="flex flex-col gap-2.5">
    <div className="flex flex-wrap items-center gap-1.5">
      <button
        type="button"
        onClick={() => onPick(null)}
        aria-current={active === null ? "true" : undefined}
        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[max(12px,0.85em)] font-medium transition-colors ${
          active === null
            ? "bg-foreground text-background"
            : "border border-foreground/15 text-muted-foreground hover:border-foreground/40 hover:text-foreground"
        }`}
      >
        <Icon name="LayoutGrid" size={14} />
        все
      </button>

      {cyrillic.map((l) => (
        <Letter
          key={l}
          letter={l}
          count={counts[l] ?? 0}
          active={active === l}
          onPick={() => onPick(active === l ? null : l)}
        />
      ))}
    </div>

    {latin.length > 0 && (
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-[max(12px,0.8em)] uppercase tracking-wide text-muted-foreground">
          латиница
        </span>
        {latin.map((l) => (
          <Letter
            key={l}
            letter={l}
            count={counts[l] ?? 0}
            active={active === l}
            onPick={() => onPick(active === l ? null : l)}
          />
        ))}
      </div>
    )}
  </nav>
);

export default LetterNav;
