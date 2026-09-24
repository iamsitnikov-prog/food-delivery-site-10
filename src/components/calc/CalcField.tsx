import Icon from "@/components/ui/icon";

type Props = {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
};

const CalcField = ({ label, hint, value, onChange, suffix, min = 0, max, step = 1 }: Props) => {
  const id = `f-${label.replace(/\s+/g, "-").toLowerCase()}`;

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
          max={max}
          step={step}
          onChange={(e) => {
            const v = e.target.value === "" ? 0 : Number(e.target.value);
            onChange(Number.isFinite(v) ? v : 0);
          }}
          className="h-13 w-full rounded-xl border border-cream/20 bg-cream/[0.06] py-3.5 pl-4 pr-12 text-[1.05em] font-medium text-cream outline-none transition-colors focus:border-brand [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        {suffix && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[0.92em] text-cream-muted">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};

export default CalcField;
