import Icon from "@/components/ui/icon";

type Option<T extends string | number> = { value: T; label: string };

type Props<T extends string | number> = {
  label: string;
  hint?: string;
  value: T;
  options: Option<T>[];
  onChange: (v: T) => void;
};

const CalcToggle = <T extends string | number>({
  label,
  hint,
  value,
  options,
  onChange,
}: Props<T>) => (
  <div>
    <span className="relative flex items-center gap-1.5 text-[0.9em] font-medium text-cream">
      {label}
      {hint && (
        <span className="group relative inline-flex max-sm:static">
          <Icon name="Info" size={14} className="text-cream-muted" />
          <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 max-sm:left-0 max-sm:right-0 max-sm:w-auto max-sm:translate-x-0 w-[230px] -translate-x-1/2 rounded-xl bg-cream p-3 text-[0.82em] font-normal leading-snug text-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            {hint}
          </span>
        </span>
      )}
    </span>
    <div
      className={`mt-2 gap-2 ${options.length > 3 ? "grid grid-cols-1 min-[400px]:grid-cols-2 sm:flex sm:flex-wrap" : "flex flex-wrap"}`}
    >
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          className={`rounded-xl border px-4 py-3 text-[0.92em] font-medium transition-colors ${
            value === o.value
              ? "border-brand bg-brand text-foreground"
              : "border-cream/20 bg-cream/[0.06] text-cream hover:border-cream/40"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  </div>
);

export default CalcToggle;
