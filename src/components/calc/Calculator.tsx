import { useMemo, useState } from "react";
import Icon from "@/components/ui/icon";
import CalcField from "./CalcField";
import { calculate, DEFAULTS, money, percent, type CalcInput } from "@/lib/calc";
import { reachGoal } from "@/lib/metrika";

export type CalcMode = "all" | "profit" | "drr" | "vat" | "breakeven";

const Row = ({
  label,
  value,
  accent,
  muted,
}: {
  label: string;
  value: string;
  accent?: boolean;
  muted?: boolean;
}) => (
  <div className="flex items-baseline justify-between gap-4 border-t border-cream/10 py-3 first:border-t-0">
    <span className={`text-[0.93em] leading-snug ${muted ? "text-cream-muted" : "text-cream"}`}>
      {label}
    </span>
    <span
      className={`shrink-0 font-display font-semibold tabular-nums ${
        accent ? "text-[1.25em] text-brand" : "text-[1.05em] text-cream"
      }`}
    >
      {value}
    </span>
  </div>
);

const Card = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-[24px] bg-cream/[0.06] p-6">
    <h3 className="flex items-center gap-2 font-display text-[1.15em] font-semibold text-cream">
      <Icon name={icon} size={18} className="text-brand" />
      {title}
    </h3>
    <div className="mt-3">{children}</div>
  </div>
);

const Calculator = ({ mode = "all" }: { mode?: CalcMode }) => {
  const [input, setInput] = useState<CalcInput>(DEFAULTS);
  const r = useMemo(() => calculate(input), [input]);

  const set = (key: keyof CalcInput) => (v: number) => {
    setInput((p) => ({ ...p, [key]: v }));
    reachGoal("calc_use", { mode, field: key });
  };

  const show = (block: CalcMode) => mode === "all" || mode === block;

  const drrColor =
    r.drrVerdict === "good" ? "text-brand" : r.drrVerdict === "ok" ? "text-cream" : "text-red-400";
  const drrText =
    r.drrVerdict === "good"
      ? "В норме — реклама окупается"
      : r.drrVerdict === "ok"
        ? "На границе — стоит следить"
        : "Завышен — реклама съедает прибыль";

  return (
    <div className="rounded-[32px] bg-surface p-6 text-cream md:p-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-11">
        <div>
          <h2 className="font-display text-[1.5em] font-semibold tracking-[-0.02em]">
            ваши данные
          </h2>
          <p className="mt-2 text-[0.92em] leading-snug text-cream-muted">
            Подставьте свои цифры — расчёт обновится сразу.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <CalcField
              label="Средний чек"
              suffix="₽"
              value={input.avgCheck}
              onChange={set("avgCheck")}
              step={50}
              hint="Средняя сумма заказа в доставке по данным кабинета."
            />
            <CalcField
              label="Заказов в день"
              suffix="шт"
              value={input.ordersPerDay}
              onChange={set("ordersPerDay")}
              hint="Среднее количество заказов с агрегатора за день."
            />
            {mode !== "vat" && (
              <CalcField
                label="Комиссия сервиса"
                suffix="%"
                value={input.commission}
                onChange={set("commission")}
                max={100}
                hint="Ставка комиссии по вашему договору. Обычно 20–35% в зависимости от типа доставки."
              />
            )}
            {mode !== "vat" && (
              <CalcField
                label="Скидки и акции"
                suffix="%"
                value={input.promoShare}
                onChange={set("promoShare")}
                max={100}
                hint="Средняя доля вашего софинансирования акций от чека."
              />
            )}
            {mode !== "vat" && (
              <CalcField
                label="Фудкост"
                suffix="%"
                value={input.foodCost}
                onChange={set("foodCost")}
                max={100}
                hint="Себестоимость продуктов в процентах от цены блюда."
              />
            )}
            {mode !== "vat" && (
              <CalcField
                label="Упаковка на заказ"
                suffix="₽"
                value={input.packaging}
                onChange={set("packaging")}
                step={10}
                hint="Средние затраты на упаковку одного заказа."
              />
            )}
            {mode !== "vat" && (
              <CalcField
                label="Продвижение в день"
                suffix="₽"
                value={input.adSpendPerDay}
                onChange={set("adSpendPerDay")}
                step={100}
                hint="Сколько тратите на платное продвижение внутри сервиса за день."
              />
            )}
            {mode !== "vat" && (
              <CalcField
                label="Постоянные расходы"
                suffix="₽/мес"
                value={input.fixedPerMonth}
                onChange={set("fixedPerMonth")}
                step={5000}
                hint="Аренда, зарплаты и прочие расходы, которые относите на доставку. Можно оставить 0."
              />
            )}
          </div>

          <button
            type="button"
            onClick={() => setInput(DEFAULTS)}
            className="mt-6 inline-flex items-center gap-2 text-[0.88em] text-cream-muted transition-colors hover:text-cream"
          >
            <Icon name="RotateCcw" size={15} />
            сбросить значения
          </button>
        </div>

        <div className="space-y-4">
          {show("profit") && (
            <Card title="Рентабельность заказа" icon="Wallet">
              <Row label="Средний чек" value={`${money(input.avgCheck)} ₽`} muted />
              <Row label="Комиссия сервиса" value={`−${money(r.commissionRub)} ₽`} muted />
              <Row label="Скидки и акции" value={`−${money(r.promoRub)} ₽`} muted />
              <Row label="Себестоимость блюд" value={`−${money(r.foodCostRub)} ₽`} muted />
              <Row label="Упаковка" value={`−${money(r.packagingRub)} ₽`} muted />
              <Row label="Продвижение на заказ" value={`−${money(r.adPerOrder)} ₽`} muted />
              <Row label="Остаётся с заказа" value={`${money(r.profitPerOrder)} ₽`} accent />
              <Row label="Маржинальность" value={percent(r.marginPercent)} />
              {!r.isProfitable && (
                <p className="mt-3 flex gap-2 rounded-xl bg-red-500/15 p-3 text-[0.88em] leading-snug text-red-200">
                  <Icon name="TriangleAlert" size={17} className="mt-0.5 shrink-0" />
                  При таких условиях заказ не приносит прибыли — каждый новый заказ увеличивает убыток.
                </p>
              )}
            </Card>
          )}

          {show("drr") && (
            <Card title="ДРР — доля рекламных расходов" icon="Percent">
              <div className="flex items-end gap-3">
                <span className={`font-display text-[2.6em] font-semibold leading-none ${drrColor}`}>
                  {percent(r.drr)}
                </span>
                <span className={`pb-1 text-[0.9em] leading-snug ${drrColor}`}>{drrText}</span>
              </div>
              <div className="mt-4">
                <Row label="Расходы на продвижение в месяц" value={`${money(input.adSpendPerDay * 30)} ₽`} muted />
                <Row label="Выручка в месяц" value={`${money(r.revenuePerMonth)} ₽`} muted />
                <Row label="Предельный ДРР при вашей марже" value={percent(r.drrLimit)} />
              </div>
              <p className="mt-3 text-[0.86em] leading-snug text-cream-muted">
                Выше предельного значения продвижение работает в убыток. Ориентир для устойчивой работы — до 12%.
              </p>
            </Card>
          )}

          {show("breakeven") && (
            <Card title="Окупаемость канала" icon="TrendingUp">
              <Row label="Выручка в месяц" value={`${money(r.revenuePerMonth)} ₽`} muted />
              <Row label="Прибыль в день" value={`${money(r.profitPerDay)} ₽`} muted />
              <Row
                label="Прибыль в месяц"
                value={`${money(r.profitPerMonth)} ₽`}
                accent
              />
              {input.fixedPerMonth > 0 && (
                <Row
                  label="Заказов в день для выхода в ноль"
                  value={r.breakEvenOrders > 0 ? `${money(r.breakEvenOrders)} шт` : "не окупится"}
                />
              )}
              {input.fixedPerMonth === 0 && (
                <p className="mt-3 text-[0.86em] leading-snug text-cream-muted">
                  Укажите постоянные расходы, чтобы увидеть, сколько заказов в день нужно для выхода в ноль.
                </p>
              )}
            </Card>
          )}

          {show("vat") && (
            <Card title="НДС при работе на УСН" icon="Receipt">
              <Row label="Выручка за год" value={`${money(r.revenuePerYear)} ₽`} muted />
              <Row label="Ваша ставка НДС" value={r.vat.label} accent />
              {r.vat.rate > 0 && (
                <>
                  <Row label="НДС за год" value={`${money(r.vatAmountPerYear)} ₽`} />
                  <Row label="НДС в месяц" value={`${money(r.vatAmountPerYear / 12)} ₽`} muted />
                </>
              )}
              {r.daysToVatLimit !== null && (
                <Row label="Лимит будет достигнут через" value={`${money(r.daysToVatLimit)} дн`} muted />
              )}
              {r.ordersToVatLimit !== null && (
                <Row label="Запас до лимита" value={`${money(r.ordersToVatLimit)} заказов`} muted />
              )}
              <p className="mt-3 text-[0.86em] leading-snug text-cream-muted">{r.vat.note}</p>
              <p className="mt-2 flex gap-2 rounded-xl bg-brand/15 p-3 text-[0.86em] leading-snug text-cream">
                <Icon name="Info" size={16} className="mt-0.5 shrink-0 text-brand" />
                Важно: в доход считается вся сумма заказа, а не то, что пришло после удержания комиссии.
              </p>
            </Card>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-[24px] bg-brand p-6 text-foreground md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-8">
          <div className="min-w-0">
            <h3 className="font-display text-[1.35em] font-semibold leading-tight tracking-[-0.02em] md:text-[1.7em]">
              Проверим ваши цифры на реальных данных
            </h3>
            <p className="mt-2 max-w-[520px] leading-relaxed text-foreground/80">
              Посмотрим ваш кабинет, найдём, где теряется маржа, и покажем, что можно изменить. Бесплатно, результат за 2 рабочих дня.
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
    </div>
  );
};

export default Calculator;