import Icon from "@/components/ui/icon";

type Props = {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
};

const CalcCheck = ({ label, hint, checked, onChange }: Props) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-colors ${
      checked ? "border-brand bg-brand/10" : "border-cream/20 bg-cream/[0.04] hover:border-cream/40"
    }`}
  >
    <span
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-colors ${
        checked ? "border-brand bg-brand text-foreground" : "border-cream/35"
      }`}
    >
      {checked && <Icon name="Check" size={15} />}
    </span>
    <span className="min-w-0">
      <span className="block text-[0.95em] font-medium text-cream">{label}</span>
      {hint && <span className="mt-1 block text-[max(12px,0.85em)] leading-snug text-cream-muted">{hint}</span>}
    </span>
  </button>
);

export default CalcCheck;
