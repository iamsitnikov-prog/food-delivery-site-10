import { useMemo, useState } from "react";
import Icon from "@/components/ui/icon";
import CalcPrint from "./CalcPrint";
import CalcForm from "./CalcForm";
import CalcOutput from "./CalcOutput";
import {
  calculate,
  DEFAULTS,
  COMMISSION_SERVICE,
  COMMISSION_OWN,
  type CalcInput,
  type DeliveryType,
  type TaxMode,
  type Unit,
} from "@/lib/calc";
import { reachGoal } from "@/lib/metrika";

export type CalcMode = "all" | "profit" | "drr" | "vat" | "breakeven" | "compare";

const Calculator = ({ mode = "all", hideCta = false }: { mode?: CalcMode; hideCta?: boolean }) => {
  const [input, setInput] = useState<CalcInput>(DEFAULTS);
  const r = useMemo(() => calculate(input), [input]);

  const set = (key: keyof CalcInput) => (v: number) => {
    setInput((p) => ({ ...p, [key]: v }));
    reachGoal("calc_use", { mode, field: key });
  };

  const flag = (key: keyof CalcInput) => (v: boolean) => {
    setInput((p) => ({ ...p, [key]: v }));
    reachGoal("calc_use", { mode, field: key });
  };

  const setUnit = (key: keyof CalcInput) => (u: Unit) => {
    setInput((p) => ({ ...p, [key]: u }));
  };

  const setDelivery = (v: DeliveryType) => {
    setInput((p) => ({
      ...p,
      deliveryType: v,
      commission: v === "service" ? COMMISSION_SERVICE : COMMISSION_OWN,
      commissionUnit: "percent",
      useYandexDelivery: v === "service" ? false : p.useYandexDelivery,
    }));
    reachGoal("calc_use", { mode, field: "deliveryType" });
  };

  const setYandexDelivery = (v: number) => {
    setInput((p) => ({ ...p, useYandexDelivery: v === 1 }));
    reachGoal("calc_use", { mode, field: "useYandexDelivery" });
  };

  const setTaxMode = (v: TaxMode) => {
    setInput((p) => ({ ...p, taxMode: v }));
    reachGoal("calc_use", { mode, field: "taxMode" });
  };

  const show = (block: CalcMode) =>
    mode === "all" || mode === block || (mode === "breakeven" && block === "drr");
  const isVat = mode === "vat";
  const isFull = mode === "all" || mode === "breakeven";

  const handlePrint = () => {
    reachGoal("calc_print", { mode });
    document.body.classList.add("printing-calc");
    const cleanup = () => {
      document.body.classList.remove("printing-calc");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
    setTimeout(cleanup, 1500);
  };

  return (
    <div className="rounded-[32px] bg-surface p-6 text-cream md:p-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-11">
        <div>
          <h2 className="font-display text-[1.5em] font-semibold tracking-[-0.02em]">ваши данные</h2>
          <p className="mt-2 text-[0.92em] leading-snug text-cream-muted">
            Отметьте каналы, которые у вас работают. Расчёт обновится сразу.
          </p>

          <CalcForm
            input={input}
            r={r}
            isVat={isVat}
            isFull={isFull}
            set={set}
            flag={flag}
            setUnit={setUnit}
            setDelivery={setDelivery}
            setYandexDelivery={setYandexDelivery}
            setTaxMode={setTaxMode}
          />

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <button
              type="button"
              onClick={() => setInput(DEFAULTS)}
              className="inline-flex items-center gap-2 text-[0.88em] text-cream-muted transition-colors hover:text-cream"
            >
              <Icon name="RotateCcw" size={15} />
              сбросить значения
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl border border-cream/25 px-4 py-2.5 text-[0.88em] font-medium text-cream transition-colors hover:border-brand hover:bg-brand hover:text-foreground"
            >
              <Icon name="Download" size={15} />
              сохранить расчёт в PDF
            </button>
          </div>
        </div>

        <CalcOutput input={input} r={r} show={show} />
      </div>

      {!hideCta && (
      <div className="mt-8 rounded-[24px] bg-brand p-6 text-foreground md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-8">
          <div className="min-w-0">
            <h3 className="font-display text-[1.35em] font-semibold leading-tight tracking-[-0.02em] md:text-[1.7em]">
              Проверим ваши цифры на реальных данных
            </h3>
            <p className="mt-2 max-w-[520px] leading-relaxed text-foreground/80">
              Разберём ваши отчёты и кабинет, найдём, где теряется маржа, и покажем, что можно
              изменить. Бесплатно, результат за 2 рабочих дня.
            </p>
          </div>
          <a
            href="#lead"
            onClick={() => reachGoal("calc_to_lead", { mode })}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-center font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            бесплатный разбор
            <Icon name="ArrowRight" size={18} className="hidden shrink-0 min-[360px]:block" />
          </a>
        </div>
      </div>
      )}

      <CalcPrint
        input={input}
        r={r}
        full={isFull}
        title={isFull ? "Экономика доставки — расчёт" : "Рентабельность заказа — расчёт"}
      />
    </div>
  );
};

export default Calculator;
