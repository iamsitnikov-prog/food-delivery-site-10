import { useEffect, useRef, useState } from "react";
import { money, percent, type CalcResult } from "@/lib/calc";
import type { CalcMode } from "./Calculator";

type Props = { r: CalcResult; mode: CalcMode };

const mainMetric = (r: CalcResult, mode: CalcMode) => {
  if (mode === "vat")
    return {
      label: "Выручка за год",
      value: `${money(r.revenuePerYear)} ₽`,
      good: r.revenuePerYear <= 20_000_000,
    };

  if (mode === "drr")
    return {
      label: "ДРР",
      value: r.adSpendPerMonth > 0 ? percent(r.drr) : "—",
      good: r.adSpendPerMonth > 0 ? r.drr <= 15 : undefined,
    };

  if (mode === "breakeven")
    return {
      label: "Прибыль за месяц",
      value: `${money(r.netProfitPerMonth)} ₽`,
      good: r.netProfitPerMonth > 0,
    };

  return {
    label: "Прибыль с заказа",
    value: `${money(r.profitPerOrder)} ₽`,
    good: r.profitPerOrder > 0,
  };
};

/**
 * Плашка с главным числом, закреплённая снизу на телефоне.
 *
 * На мобильном результат уходит примерно на четыре экрана ниже полей ввода:
 * человек меняет цифру и не видит, что поменялось. Плашка держит главный
 * показатель перед глазами и подсвечивает изменение.
 *
 * Появляется только когда блок результатов ушёл за пределы экрана,
 * чтобы не дублировать то, что и так видно.
 */
const CalcStickyBar = ({ r, mode }: Props) => {
  const [hidden, setHidden] = useState(true);
  const [flash, setFlash] = useState(false);
  const { label, value, good } = mainMetric(r, mode);
  const prev = useRef(value);

  useEffect(() => {
    const target = document.getElementById("calc-results");
    if (!target) return;
    const io = new IntersectionObserver(
      ([e]) => setHidden(e.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px" },
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (prev.current === value) return;
    prev.current = value;
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 450);
    return () => clearTimeout(t);
  }, [value]);

  const tone =
    good === undefined ? "text-cream" : good ? "text-brand" : "text-red-400";

  return (
    <div
      aria-hidden={hidden}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-cream/15 bg-surface/95 px-5 py-3 backdrop-blur transition-transform duration-300 lg:hidden print:hidden ${
        hidden ? "translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-[0.82em] leading-tight text-cream-muted">{label}</span>
        <span
          className={`font-display text-[1.45em] font-semibold leading-none tabular-nums transition-colors ${tone} ${
            flash ? "opacity-60" : "opacity-100"
          }`}
        >
          {value}
        </span>
        <a
          href="#calc-results"
          className="shrink-0 rounded-lg border border-cream/25 px-3 py-1.5 text-[0.8em] font-medium text-cream"
        >
          детали
        </a>
      </div>
    </div>
  );
};

export default CalcStickyBar;
