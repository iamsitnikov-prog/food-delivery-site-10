import Icon from "@/components/ui/icon";
import type { Unit } from "@/lib/calc";

type Props = {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: Unit;
  onUnitChange?: (u: Unit) => void;
  note?: string;
};

const CalcField = ({
  label,
  hint,
  value,
  onChange,
  suffix,
  min = 0,
  max,
  step = 1,
  unit,
  onUnitChange,
  note,
}: Props) => {
  const id = `f-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const hasUnits = !!unit && !!onUnitChange;
  const shownSuffix = hasUnits ? undefined : suffix;

  return (
    <div>
      <label htmlFor={id} className="flex items-center gap-1.5 text-[0.9em] font-medium text-cream">
        {label}
        {hint && (
          <span className="group relative inline-flex">
            <Icon name="Info" size={14} className="text-cream-muted" />
            <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-[210px] -translate-x-1/2 rounded-xl bg-cream p-3 text-[0.82em] font-normal leading-snug text-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              {hint}
            </span>
          </span>
        )}
      </label>
      <div className="relative mt-2">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={Number.isFinite(value) ? value : ""}
          min={min}
          max={unit === "percent" ? 100 : max}
          step={step}
          onChange={(e) => {
            const v = e.target.value === "" ? 0 : Number(e.target.value);
            onChange(Number.isFinite(v) ? v : 0);
          }}
          className={`h-13 w-full rounded-xl border border-cream/20 bg-cream/[0.06] py-3.5 pl-4 text-[1.05em] font-medium text-cream outline-none transition-colors focus:border-brand [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
            hasUnits ? "pr-[92px]" : "pr-12"
          }`}
        />
        {shownSuffix && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[0.92em] text-cream-muted">
            {shownSuffix}
          </span>
        )}
        {hasUnits && (
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 overflow-hidden rounded-lg border border-cream/20">
            {(["percent", "rub"] as Unit[]).map((u) => (
              <button
                key={u}
                type="button"
                aria-pressed={unit === u}
                aria-label={u === "percent" ? "в процентах" : "в рублях"}
                onClick={() => onUnitChange(u)}
                className={`w-9 py-1.5 text-[0.9em] font-semibold transition-colors ${
                  unit === u
                    ? "bg-brand text-foreground"
                    : "bg-transparent text-cream-muted hover:text-cream"
                }`}
              >
                {u === "percent" ? "%" : "₽"}
              </button>
            ))}
          </div>
        )}
      </div>
      {note && <p className="mt-1.5 text-[0.82em] leading-snug text-cream-muted">{note}</p>}
    </div>
  );
};

export default CalcField;
