import { useMemo, useState } from "react";
import Icon from "@/components/ui/icon";
import CompareInputs from "./CompareInputs";
import CompareResults from "./CompareResults";
import {
  calculateCompare,
  DEFAULT_COMPARE,
  type CompareInput,
  type OwnMode,
} from "@/lib/compare";
import { reachGoal } from "@/lib/metrika";

const CompareCalc = ({ hideCta = false }: { hideCta?: boolean }) => {
  const [input, setInput] = useState<CompareInput>(DEFAULT_COMPARE);
  const r = useMemo(() => calculateCompare(input), [input]);

  const set = (key: keyof CompareInput) => (v: number) => {
    setInput((p) => ({ ...p, [key]: v }));
    reachGoal("calc_use", { mode: "compare", field: key });
  };

  const flag = (key: keyof CompareInput) => (v: boolean) => {
    setInput((p) => ({ ...p, [key]: v }));
    reachGoal("calc_use", { mode: "compare", field: key });
  };

  const onOwnMode = (v: OwnMode) => {
    setInput((p) => ({ ...p, ownMode: v }));
    reachGoal("calc_use", { mode: "compare", field: "ownMode" });
  };

  const onYandexKnowOrders = (v: number) => {
    setInput((p) => ({ ...p, yandexKnowOrders: v === 1 }));
    reachGoal("calc_use", { mode: "compare", field: "yandexKnowOrders" });
  };

  return (
    <div className="rounded-[32px] bg-surface p-6 text-cream md:p-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-11">
        <div>
          <h2 className="font-display text-[1.5em] font-semibold tracking-[-0.02em]">ваши данные</h2>
          <p className="mt-2 text-[0.92em] leading-snug text-cream-muted">
            Сравним три модели доставки на одних и тех же заказах.
          </p>

          <CompareInputs
            input={input}
            r={r}
            set={set}
            flag={flag}
            onOwnMode={onOwnMode}
            onYandexKnowOrders={onYandexKnowOrders}
          />

          <button
            type="button"
            onClick={() => setInput(DEFAULT_COMPARE)}
            className="mt-6 inline-flex items-center gap-2 text-[0.88em] text-cream-muted transition-colors hover:text-cream"
          >
            <Icon name="RotateCcw" size={15} />
            сбросить значения
          </button>
        </div>

        <CompareResults r={r} />
      </div>

      {!hideCta && (
      <div className="mt-8 rounded-[24px] bg-cream/[0.06] p-6 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-8">
          <div className="min-w-0">
            <h3 className="font-display text-[1.3em] font-semibold leading-tight tracking-[-0.02em] text-cream md:text-[1.55em]">
              Поможем выбрать модель под ваш объём
            </h3>
            <p className="mt-2 max-w-[520px] leading-relaxed text-cream-muted">
              Посмотрим ваши отчёты, зоны доставки и загрузку курьеров — посчитаем, какая схема
              выгоднее именно вам. Бесплатно.
            </p>
          </div>
          <a
            href="#lead"
            onClick={() => reachGoal("calc_to_lead", { mode: "compare" })}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-4 text-center font-medium text-foreground transition-transform hover:-translate-y-0.5"
          >
            бесплатный разбор
            <Icon name="ArrowRight" size={18} className="hidden shrink-0 min-[360px]:block" />
          </a>
        </div>
      </div>
      )}
    </div>
  );
};

export default CompareCalc;
