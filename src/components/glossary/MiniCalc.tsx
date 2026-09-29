import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import type { MiniCalcMeta } from "@/data/term-sidebar";

type Field = { key: string; label: string; suffix: string; init: number; step?: number };

const FIELDS: Record<MiniCalcMeta["kind"], Field[]> = {
  drr: [
    { key: "ad", label: "расход на продвижение", suffix: "₽", init: 30000, step: 1000 },
    { key: "rev", label: "выручка с рекламных заказов", suffix: "₽", init: 200000, step: 5000 },
  ],
  marzha: [
    { key: "check", label: "средний чек", suffix: "₽", init: 1200, step: 50 },
    { key: "com", label: "комиссия сервиса", suffix: "%", init: 35, step: 1 },
    { key: "food", label: "себестоимость блюд", suffix: "%", init: 30, step: 1 },
  ],
  komissiya: [
    { key: "rev", label: "оборот за месяц", suffix: "₽", init: 900000, step: 10000 },
    { key: "com", label: "комиссия сервиса", suffix: "%", init: 35, step: 1 },
    { key: "ad", label: "продвижение", suffix: "%", init: 8, step: 1 },
  ],
  okupaemost: [
    { key: "inv", label: "вложения в запуск", suffix: "₽", init: 300000, step: 10000 },
    { key: "profit", label: "прибыль в месяц", suffix: "₽", init: 60000, step: 5000 },
  ],
  nds: [
    { key: "rev", label: "выручка в месяц", suffix: "₽", init: 1500000, step: 50000 },
    { key: "months", label: "прошло месяцев с января", suffix: "мес", init: 6, step: 1 },
  ],
};

const rub = (n: number) =>
  `${Math.round(n).toLocaleString("ru-RU")} ₽`;

const NDS_LIMIT = 60_000_000;

type Result = { label: string; value: string; note: string; warn?: boolean };

const compute = (kind: MiniCalcMeta["kind"], v: Record<string, number>): Result => {
  if (kind === "drr") {
    const drr = v.rev > 0 ? (v.ad / v.rev) * 100 : 0;
    return {
      label: "ДРР",
      value: `${drr.toFixed(1)}%`,
      note:
        drr === 0
          ? "укажите выручку с рекламных заказов"
          : drr <= 10
            ? "здоровый уровень — реклама окупается"
            : drr <= 20
              ? "терпимо, но ставку стоит проверить"
              : "слишком дорого: снижайте ставку",
      warn: drr > 20,
    };
  }

  if (kind === "marzha") {
    const left = v.check * (1 - v.com / 100) - v.check * (v.food / 100);
    const pct = v.check > 0 ? (left / v.check) * 100 : 0;
    return {
      label: "остаётся с заказа",
      value: rub(left),
      note:
        pct >= 20
          ? `${pct.toFixed(0)}% от чека — хороший запас`
          : pct >= 15
            ? `${pct.toFixed(0)}% от чека — рабочий минимум`
            : `${pct.toFixed(0)}% от чека — канал в зоне риска`,
      warn: pct < 15,
    };
  }

  if (kind === "komissiya") {
    const left = v.rev * (1 - v.com / 100 - v.ad / 100);
    return {
      label: "придёт на счёт",
      value: rub(left),
      note: `удержания сервиса — ${rub(v.rev - left)} за месяц`,
      warn: left < v.rev * 0.5,
    };
  }

  if (kind === "okupaemost") {
    const months = v.profit > 0 ? v.inv / v.profit : 0;
    return {
      label: "срок окупаемости",
      value: months > 0 ? `${months.toFixed(1)} мес` : "—",
      note:
        months === 0
          ? "укажите прибыль за месяц"
          : months <= 12
            ? "вложения вернутся в пределах года"
            : "окупаемость дольше года — считайте риски",
      warn: months > 12,
    };
  }

  const year = v.rev * 12;
  const already = v.rev * v.months;
  const monthsLeft = v.rev > 0 ? (NDS_LIMIT - already) / v.rev : 0;
  return {
    label: "выручка за год",
    value: rub(year),
    note:
      year >= NDS_LIMIT
        ? monthsLeft > 0
          ? `порог 60 млн будет пройден примерно через ${Math.max(0, Math.floor(monthsLeft))} мес`
          : "порог 60 млн уже пройден"
        : "в пределах порога 60 млн",
    warn: year >= NDS_LIMIT,
  };
};

const MiniCalc = ({ meta }: { meta: MiniCalcMeta }) => {
  const fields = FIELDS[meta.kind];
  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(fields.map((f) => [f.key, f.init])),
  );

  const res = compute(meta.kind, values);

  return (
    <div className="rounded-[24px] bg-surface p-6 text-cream">
      <h2 className="flex items-center gap-2 font-display text-[1.1em] font-semibold tracking-[-0.02em]">
        <Icon name="Calculator" size={17} className="text-brand" />
        {meta.title}
      </h2>

      <div className="mt-4 space-y-3">
        {fields.map((f) => (
          <div key={f.key}>
            <label
              htmlFor={`mini-${f.key}`}
              className="block text-[0.85em] leading-snug text-cream-muted"
            >
              {f.label}
            </label>
            <div className="relative mt-1.5">
              <input
                id={`mini-${f.key}`}
                type="number"
                inputMode="decimal"
                min={0}
                step={f.step ?? 1}
                value={Number.isFinite(values[f.key]) ? values[f.key] : ""}
                onChange={(e) => {
                  const raw = e.target.value === "" ? 0 : Number(e.target.value);
                  const safe = Number.isFinite(raw) ? Math.max(0, raw) : 0;
                  setValues((s) => ({ ...s, [f.key]: safe }));
                }}
                className="h-11 w-full rounded-xl border border-cream/20 bg-cream/[0.06] py-2 pl-3.5 pr-11 text-[0.98em] font-medium text-cream outline-none transition-colors focus:border-brand [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[0.85em] text-cream-muted">
                {f.suffix}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div
        className={`mt-4 rounded-2xl p-4 ${res.warn ? "bg-brand/12" : "bg-cream/[0.06]"}`}
      >
        <p className="text-[0.8em] uppercase tracking-wide text-cream-muted">{res.label}</p>
        <p className="mt-1 font-display text-[1.5em] font-semibold leading-none text-brand">
          {res.value}
        </p>
        <p className="mt-2 text-[0.85em] leading-snug text-cream-muted">{res.note}</p>
      </div>

      <Link
        to={meta.to}
        className="mt-3.5 inline-flex items-center gap-1.5 text-[0.88em] font-medium text-brand transition-opacity hover:opacity-80"
      >
        {meta.linkLabel}
        <Icon name="ArrowRight" size={15} />
      </Link>
    </div>
  );
};

export default MiniCalc;
