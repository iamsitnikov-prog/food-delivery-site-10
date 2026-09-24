import { useMemo, useState } from "react";
import Icon from "@/components/ui/icon";
import CalcField from "./CalcField";
import CalcToggle from "./CalcToggle";
import CalcCheck from "./CalcCheck";
import {
  calculateCompare,
  DEFAULT_COMPARE,
  money,
  percent,
  type CompareInput,
  type ModelResult,
  type OwnMode,
} from "@/lib/compare";
import { reachGoal } from "@/lib/metrika";

const Row = ({
  label,
  value,
  accent,
  muted,
  strong,
}: {
  label: string;
  value: string;
  accent?: boolean;
  muted?: boolean;
  strong?: boolean;
}) => (
  <div
    className={`flex items-baseline justify-between gap-4 py-2.5 ${
      strong ? "border-t-2 border-cream/25" : "border-t border-cream/10 first:border-t-0"
    }`}
  >
    <span className={`text-[0.9em] leading-snug ${muted ? "text-cream-muted" : "text-cream"}`}>
      {label}
    </span>
    <span
      className={`shrink-0 font-display font-semibold tabular-nums ${
        accent ? "text-[1.2em] text-brand" : "text-[1.02em] text-cream"
      }`}
    >
      {value}
    </span>
  </div>
);

const ModelCard = ({
  m,
  icon,
  isWinner,
  compact,
}: {
  m: ModelResult;
  icon: string;
  isWinner: boolean;
  compact?: boolean;
}) => (
  <div
    className={`rounded-[24px] p-5 transition-colors md:p-6 ${
      isWinner ? "bg-brand/15 ring-2 ring-brand" : "bg-cream/[0.06]"
    }`}
  >
    <div className="flex flex-wrap items-center gap-2">
      <Icon name={icon} size={18} className="text-brand" />
      <h3 className="font-display text-[1.1em] font-semibold text-cream">{m.label}</h3>
      {isWinner && (
        <span className="rounded-lg bg-brand px-2 py-0.5 text-[0.72em] font-bold uppercase tracking-wide text-foreground">
          выгоднее
        </span>
      )}
    </div>
    {m.note && <p className="mt-1.5 text-[0.85em] leading-snug text-cream-muted">{m.note}</p>}
    <div className="mt-3">
      <Row label="Комиссия · commission" value={`−${money(m.commissionRub)} ₽`} muted />
      {m.deliveryFeeRub > 0 && (
        <Row label="Кнопка Яндекс Доставки" value={`−${money(m.deliveryFeeRub)} ₽`} muted />
      )}
      <Row label="Продвижение · ad spend" value={`−${money(m.adRub)} ₽`} muted />
      {!compact && (
        <>
          <Row label="Придёт на счёт · payout" value={`${money(m.payoutPerOrder)} ₽`} />
          <Row label="Себестоимость · food cost" value={`−${money(m.foodCostRub)} ₽`} muted />
          <Row label="Упаковка · packaging" value={`−${money(m.packagingRub)} ₽`} muted />
        </>
      )}
      <Row label="Валовая с заказа" value={`${money(m.grossPerOrder)} ₽`} strong />
      <Row label="Валовая за месяц" value={`${money(m.grossPerMonth)} ₽`} muted />
      {m.staffCost > 0 && (
        <Row label="Свои курьеры" value={`−${money(m.staffCost)} ₽`} muted />
      )}
      {m.yandexCost > 0 && (
        <Row label="Яндекс Доставка" value={`−${money(m.yandexCost)} ₽`} muted />
      )}
      {m.deliveryCostPerOrder > 0 && (
        <Row label="Доставка на заказ" value={`−${money(m.deliveryCostPerOrder)} ₽`} muted />
      )}
      {m.paidDeliveryIncome > 0 && (
        <Row label="Платные доставки в кассу" value={`+${money(m.paidDeliveryIncome)} ₽`} muted />
      )}
      <Row label="Прибыль за месяц" value={`${money(m.profitPerMonth)} ₽`} accent strong />
      <Row label="Маржинальность · margin" value={percent(m.marginPercent)} />
    </div>
  </div>
);

const CompareCalc = () => {
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

  const isStaff = input.ownMode === "staff";

  const verdict =
    r.winner === "equal"
      ? "Модели равны по деньгам"
      : `${r.best.label} выгоднее на ${money(Math.abs(r.diffPerMonth))} ₽ в месяц`;

  return (
    <div className="rounded-[32px] bg-surface p-6 text-cream md:p-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-11">
        <div>
          <h2 className="font-display text-[1.5em] font-semibold tracking-[-0.02em]">ваши данные</h2>
          <p className="mt-2 text-[0.92em] leading-snug text-cream-muted">
            Сравним три модели доставки на одних и тех же заказах.
          </p>

          <div className="mt-6 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <CalcField
                label="Средний чек · average check"
                suffix="₽"
                value={input.avgCheck}
                onChange={set("avgCheck")}
                step={50}
                hint="Средняя сумма заказа в доставке."
              />
              <CalcField
                label="Заказов в день · orders"
                suffix="шт"
                value={input.ordersPerDay}
                onChange={set("ordersPerDay")}
                hint="Среднее количество заказов доставки за день."
              />
            </div>

            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-xl bg-brand/12 px-4 py-3">
              <span className="text-[0.88em] text-cream-muted">Выручка · revenue в месяц</span>
              <span className="font-display text-[1.15em] font-semibold tabular-nums text-brand">
                {money(r.revenuePerMonth)} ₽
              </span>
            </div>

            <div className="rounded-2xl border border-cream/15 p-5">
              <p className="flex items-center gap-2 text-[0.95em] font-semibold text-cream">
                <Icon name="Truck" size={16} className="text-brand" />
                Модель 1 — курьеры сервиса
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <CalcField
                  label="Комиссия · commission"
                  suffix="%"
                  value={input.serviceCommission}
                  onChange={set("serviceCommission")}
                  max={100}
                  step={0.5}
                  hint="Ставка при доставке курьерами сервиса — обычно около 35%."
                />
                <CalcField
                  label="Продвижение · ad spend"
                  suffix="%"
                  value={input.serviceAdShare}
                  onChange={set("serviceAdShare")}
                  max={100}
                  step={0.5}
                  hint="Расходы на продвижение внутри сервиса."
                />
              </div>
            </div>

            <div className="rounded-2xl border border-cream/15 p-5">
              <p className="flex items-center gap-2 text-[0.95em] font-semibold text-cream">
                <Icon name="Bike" size={16} className="text-brand" />
                Модель 2 — своя доставка
              </p>

              <div className="mt-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <CalcField
                    label="Комиссия · commission"
                    suffix="%"
                    value={input.ownCommission}
                    onChange={set("ownCommission")}
                    max={100}
                    step={0.5}
                    hint="Ставка при работе своими курьерами — обычно около 20%."
                  />
                  <CalcField
                    label="Продвижение · ad spend"
                    suffix="%"
                    value={input.ownAdShare}
                    onChange={set("ownAdShare")}
                    max={100}
                    step={0.5}
                    hint="Расходы на продвижение при этой модели."
                  />
                </div>

                <CalcToggle
                  label="Кто везёт заказы"
                  value={input.ownMode}
                  onChange={(v) => {
                    setInput((p) => ({ ...p, ownMode: v as OwnMode }));
                    reachGoal("calc_use", { mode: "compare", field: "ownMode" });
                  }}
                  options={[
                    { value: "staff" as OwnMode, label: "Свои курьеры в штате" },
                    { value: "yandex" as OwnMode, label: "Курьер Яндекс Доставки" },
                  ]}
                  hint="Свои курьеры — фиксированная зарплата. Яндекс Доставка — оплата за каждый заказ."
                />

                {isStaff && (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <CalcField
                        label="Курьеров в штате"
                        suffix="чел"
                        value={input.courierCount}
                        onChange={set("courierCount")}
                        hint="Сколько курьеров нужно, чтобы закрыть этот объём заказов."
                      />
                      <CalcField
                        label="Ставка курьера"
                        suffix="₽/мес"
                        value={input.courierSalary}
                        onChange={set("courierSalary")}
                        step={5000}
                        hint="Зарплата одного курьера в месяц до вычета налогов."
                      />
                      <CalcField
                        label="Страховые взносы · payroll tax"
                        suffix="%"
                        value={input.insuranceRate}
                        onChange={set("insuranceRate")}
                        max={100}
                        step={0.5}
                        hint="Взносы с фонда оплаты труда. Стандартная ставка — 30%."
                      />
                    </div>

                    <CalcCheck
                      label="Компенсация бензина"
                      hint="Оплачиваете курьерам топливо или транспортные расходы."
                      checked={input.fuelEnabled}
                      onChange={flag("fuelEnabled")}
                    />
                    {input.fuelEnabled && (
                      <CalcField
                        label="Компенсация на курьера"
                        suffix="₽/мес"
                        value={input.fuelPerCourier}
                        onChange={set("fuelPerCourier")}
                        step={1000}
                        hint="Сколько платите одному курьеру за топливо в месяц."
                      />
                    )}

                    <CalcCheck
                      label="Платные доставки в кассу"
                      hint="Если на дальних зонах гость платит за доставку и деньги идут в кассу ресторана — это доход. Сумму можно взять из кассы или отчёта Яндекс Доставки."
                      checked={input.paidDeliveryEnabled}
                      onChange={flag("paidDeliveryEnabled")}
                    />
                    {input.paidDeliveryEnabled && (
                      <CalcField
                        label="Сумма платных доставок"
                        suffix="₽/мес"
                        value={input.paidDeliveryTotal}
                        onChange={set("paidDeliveryTotal")}
                        step={5000}
                        hint="Итоговая сумма за месяц по кассе или по отчёту сервиса."
                      />
                    )}
                  </>
                )}

                {!isStaff && (
                  <>
                    <CalcToggle
                      label="Что известно по доставке"
                      value={input.yandexKnowOrders ? 1 : 0}
                      onChange={(v) => {
                        setInput((p) => ({ ...p, yandexKnowOrders: v === 1 }));
                        reachGoal("calc_use", { mode: "compare", field: "yandexKnowOrders" });
                      }}
                      options={[
                        { value: 1, label: "Заказы и сумма" },
                        { value: 0, label: "Только сумма" },
                      ]}
                      hint="Данные берутся из отчёта Яндекс Доставки за месяц."
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      {input.yandexKnowOrders && (
                        <CalcField
                          label="Заказов через Доставку"
                          suffix="шт/мес"
                          value={input.yandexOrders}
                          onChange={set("yandexOrders")}
                          step={10}
                          hint="Сколько заказов за месяц везли курьеры Яндекс Доставки."
                        />
                      )}
                      <CalcField
                        label="Сумма за доставку"
                        suffix="₽/мес"
                        value={input.yandexTotal}
                        onChange={set("yandexTotal")}
                        step={5000}
                        hint="Сколько заплатили за доставку за месяц по отчёту сервиса."
                        note={
                          input.yandexKnowOrders && input.yandexOrders > 0
                            ? `Средняя стоимость доставки: ${money(r.yandexPerOrder)} ₽ за заказ`
                            : undefined
                        }
                      />
                    </div>

                    <CalcCheck
                      label="Вызов курьера кнопкой — +2%"
                      hint="При вызове курьера Яндекс Доставки из приложения удерживают дополнительно 2% от стоимости заказа."
                      checked={input.yandexButtonFee}
                      onChange={flag("yandexButtonFee")}
                    />
                  </>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-cream/15 p-5">
              <p className="flex items-center gap-2 text-[0.95em] font-semibold text-cream">
                <Icon name="Shuffle" size={16} className="text-brand" />
                Модель 3 — гибрид
              </p>
              <div className="mt-4 space-y-4">
                <CalcCheck
                  label="Считать гибридную модель"
                  hint="Часть заказов везут свои курьеры, пиковые отдаются Яндекс Доставке. Так работает большинство заведений."
                  checked={input.hybridEnabled}
                  onChange={flag("hybridEnabled")}
                />
                {input.hybridEnabled && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <CalcField
                      label="Курьеров в штате"
                      suffix="чел"
                      value={input.hybridCourierCount}
                      onChange={set("hybridCourierCount")}
                      hint="Сколько курьеров держите постоянно. Обычно меньше, чем при полностью своей доставке."
                    />
                    <CalcField
                      label="Доля своих курьеров"
                      suffix="%"
                      value={input.hybridOwnShare}
                      onChange={set("hybridOwnShare")}
                      max={100}
                      step={5}
                      hint="Какую часть заказов закрывают свои курьеры. Остальное уходит Яндекс Доставке."
                      note={`Свои: ${money(r.hybridOwnOrders)} зак. · Яндекс: ${money(r.hybridYandexOrders)} зак. в месяц`}
                    />
                  </div>
                )}
                {input.hybridEnabled && input.ownMode === "yandex" && (
                  <p className="flex gap-2 rounded-xl bg-brand/15 p-3 text-[0.86em] leading-snug text-cream">
                    <Icon name="Info" size={16} className="mt-0.5 shrink-0 text-brand" />
                    Стоимость доставки для гибрида берётся из полей модели 2 —{" "}
                    {money(r.yandexPerOrder)} ₽ за заказ.
                  </p>
                )}
                {input.hybridEnabled && input.ownMode === "staff" && (
                  <p className="flex gap-2 rounded-xl bg-brand/15 p-3 text-[0.86em] leading-snug text-cream">
                    <Icon name="Info" size={16} className="mt-0.5 shrink-0 text-brand" />
                    Чтобы посчитать гибрид точно, переключите модель 2 на Яндекс Доставку и укажите
                    её стоимость — она подставится сюда. Сейчас: {money(r.yandexPerOrder)} ₽ за
                    заказ.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-cream/15 p-5">
              <p className="flex items-center gap-2 text-[0.95em] font-semibold text-cream">
                <Icon name="ChefHat" size={16} className="text-brand" />
                Себестоимость заказа
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <CalcField
                  label="Фудкост · food cost"
                  suffix="%"
                  value={input.foodCost}
                  onChange={set("foodCost")}
                  max={100}
                  hint="Себестоимость продуктов в процентах от цены блюда."
                />
                <CalcField
                  label="Упаковка · packaging"
                  suffix="₽"
                  value={input.packaging}
                  onChange={set("packaging")}
                  step={10}
                  hint="Затраты на упаковку одного заказа."
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setInput(DEFAULT_COMPARE)}
            className="mt-6 inline-flex items-center gap-2 text-[0.88em] text-cream-muted transition-colors hover:text-cream"
          >
            <Icon name="RotateCcw" size={15} />
            сбросить значения
          </button>
        </div>

        <div className="space-y-4">
          <div
            className={`rounded-[24px] p-6 ${
              r.winner === "equal" ? "bg-cream/[0.08]" : "bg-brand text-foreground"
            }`}
          >
            <p
              className={`text-[0.85em] font-medium uppercase tracking-wide ${
                r.winner === "equal" ? "text-cream-muted" : "text-foreground/70"
              }`}
            >
              вывод
            </p>
            <p
              className={`mt-2 font-display text-[1.35em] font-semibold leading-tight tracking-[-0.02em] md:text-[1.6em] ${
                r.winner === "equal" ? "text-cream" : "text-foreground"
              }`}
            >
              {verdict}
            </p>
            {r.winner !== "equal" && (
              <p className="mt-2 text-[0.95em] leading-snug text-foreground/80">
                Обгоняет «{r.second.label}» на {money(Math.abs(r.diffPerOrder))} ₽ с заказа — это{" "}
                {money(Math.abs(r.diffPerMonth) * 12)} ₽ за год.
              </p>
            )}
            {r.breakEvenOrders !== null && r.breakEvenOrders > 0 && (
              <p
                className={`mt-3 flex gap-2 rounded-xl p-3 text-[0.88em] leading-snug ${
                  r.winner === "equal" ? "bg-brand/15 text-cream" : "bg-foreground/10 text-foreground"
                }`}
              >
                <Icon name="Info" size={16} className="mt-0.5 shrink-0" />
                Свои курьеры окупаются от {money(r.breakEvenOrders)} заказов в день. Ниже этого
                объёма выгоднее отдавать доставку сервису.
              </p>
            )}
          </div>

          <ModelCard m={r.service} icon="Truck" isWinner={r.winner === "service"} />
          <ModelCard m={r.own} icon="Bike" isWinner={r.winner === "own"} />
          {r.hybrid && (
            <ModelCard m={r.hybrid} icon="Shuffle" isWinner={r.winner === "hybrid"} />
          )}
        </div>
      </div>

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
    </div>
  );
};

export default CompareCalc;
