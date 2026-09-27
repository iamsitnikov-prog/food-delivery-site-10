import Icon from "@/components/ui/icon";

const LetterNav = ({
  letters,
  active,
  counts,
  onPick,
}: {
  letters: string[];
  active: string | null;
  counts: Record<string, number>;
  onPick: (letter: string | null) => void;
}) => (
  <nav aria-label="Навигация по буквам" className="flex flex-wrap items-center gap-1.5">
    <button
      type="button"
      onClick={() => onPick(null)}
      aria-current={active === null ? "true" : undefined}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[0.85em] font-medium transition-colors ${
        active === null
          ? "bg-foreground text-background"
          : "border border-foreground/15 text-muted-foreground hover:border-foreground/40 hover:text-foreground"
      }`}
    >
      <Icon name="LayoutGrid" size={14} />
      все
    </button>

    {letters.map((l) => {
      const isActive = active === l;
      return (
        <button
          key={l}
          id={`letter-${l}`}
          type="button"
          onClick={() => onPick(isActive ? null : l)}
          aria-current={isActive ? "true" : undefined}
          title={`${counts[l]} терминов`}
          className={`min-w-[38px] rounded-lg px-2.5 py-2 text-[0.85em] font-medium transition-colors ${
            isActive
              ? "bg-foreground text-background"
              : "border border-foreground/15 text-muted-foreground hover:border-foreground/40 hover:text-foreground"
          }`}
        >
          {l}
          <span
            className={`ml-1 text-[0.78em] ${isActive ? "text-background/60" : "text-muted-foreground/60"}`}
          >
            {counts[l]}
          </span>
        </button>
      );
    })}
  </nav>
);

export default LetterNav;
