import { useMemo, useState } from "react";
import Icon from "@/components/ui/icon";
import CalcField from "./CalcField";
import CalcToggle from "./CalcToggle";
import CalcCheck from "./CalcCheck";
import CalcPrint from "./CalcPrint";
import {
  calculate,
  DEFAULTS,
  money,
  percent,
  COMMISSION_SERVICE,
  COMMISSION_OWN,
  TAX_MODES,
  type CalcInput,
  type ChannelResult,
  type DeliveryType,
  type TaxMode,
} from "@/lib/calc";
import { reachGoal } from "@/lib/metrika";

export type CalcMode = "all" | "profit" | "drr" | "vat" | "breakeven";

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
    className={`flex items-baseline justify-between gap-4 py-3 ${
      strong ? "border-t-2 border-cream/25" : "border-t border-cream/10 first:border-t-0"
    }`}
  >
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

const Section = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-2xl border border-cream/15 p-5">
    <p className="flex items-center gap-2 text-[0.95em] font-semibold text-cream">
      <Icon name={icon} size={16} className="text-brand" />
      {title}
    </p>
    <div className="mt-4 space-y-4">{children}</div>
  </div>
);

const ChannelBlock = ({ c, title }: { c: ChannelResult; title: string }) => (
  <>
    <Row label="Средний чек" value={`${money(c.avgCheck)} ₽`} muted />
    {c.serviceFeeRub > 0 && (
      <Row label="Сервисный сбор с гостя" value={`+${money(c.serviceFeeRub)} ₽`} muted />
    )}
    {c.serviceFeeRub > 0 && <Row label="Доход с заказа" value={`${money(c.income)} ₽`} />}
    {c.commissionRub > 0 && <Row label="Комиссия" value={`−${money(c.commissionRub)} ₽`} muted />}
    {c.subscriptionRub > 0 && (
      <Row label="Подписка сервиса" value={`−${money(c.subscriptionRub)} ₽`} muted />
    )}
    {c.deliveryFeeRub > 0 && (
      <Row label="Вызов Яндекс Доставки" value={`−${money(c.deliveryFeeRub)} ₽`} muted />
    )}
    {c.adRub > 0 && <Row label="Продвижение" value={`−${money(c.adRub)} ₽`} muted />}
    {c.marketingRub > 0 && (
      <Row label="Маркетинг Ultima" value={`−${money(c.marketingRub)} ₽`} muted />
    )}
    {c.promoRub > 0 && <Row label="Скидки и акции" value={`−${money(c.promoRub)} ₽`} muted />}
    {c.refundRub > 0 && <Row label="Возвраты гостям" value={`−${money(c.refundRub)} ₽`} muted />}
    {c.penaltyRub > 0 && (
      <Row label="Штрафы и удержания" value={`−${money(c.penaltyRub)} ₽`} muted />
    )}
    <Row label="Придёт на счёт" value={`${money(c.payoutPerOrder)} ₽`} accent strong />
    <Row label="Доля от дохода" value={percent(c.payoutPercent)} />
    <Row label="Себестоимость блюд" value={`−${money(c.foodCostRub)} ₽`} muted />
    <Row label="Упаковка" value={`−${money(c.packagingRub)} ₽`} muted />
    {c.suppliesRub > 0 && (
      <Row label="Расходные материалы" value={`−${money(c.suppliesRub)} ₽`} muted />
    )}
    {c.writeOffRub > 0 && (
      <Row label="Списания продуктов" value={`−${money(c.writeOffRub)} ₽`} muted />
    )}
    {c.royaltyRub > 0 && <Row label="Роялти" value={`−${money(c.royaltyRub)} ₽`} muted />}
    <Row
      label={`Остаётся с заказа — ${title}`}
      value={`${money(c.profitPerOrder)} ₽`}
      accent
      strong
    />
    <Row label="Маржинальность" value={percent(c.marginPercent)} />
    <Row label="Валовая прибыль за месяц" value={`${money(c.profitPerMonth)} ₽`} />
  </>
);

const Calculator = ({ mode = "all" }: { mode?: CalcMode }) => {
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

  const show = (block: CalcMode) => mode === "all" || mode === block;
  const isVat = mode === "vat";
  const isFull = mode === "all" || mode === "breakeven";
  const aggOn = input.aggEnabled;
  const selfOn = input.selfEnabled;

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
          <h2 className="font-display text-[1.5em] font-semibold tracking-[-0.02em]">ваши данные</h2>
          <p className="mt-2 text-[0.92em] leading-snug text-cream-muted">
            Отметьте каналы, которые у вас работают. Расчёт обновится сразу.
          </p>

          <div className="mt-6 space-y-5">
            <CalcCheck
              label="Заказы с агрегаторов"
              hint="Яндекс Еда, Купер и другие сервисы доставки."
              checked={aggOn}
              onChange={flag("aggEnabled")}
            />

            {aggOn && (
              <Section title="Агрегатор" icon="Store">
                <div className="grid gap-4 sm:grid-cols-2">
                  <CalcField
                    label="Средний чек"
                    suffix="₽"
                    value={input.aggAvgCheck}
                    onChange={set("aggAvgCheck")}
                    step={50}
                    hint="Средняя сумма заказа на агрегаторе по данным кабинета."
                  />
                  <CalcField
                    label="Заказов в день"
                    suffix="шт"
                    value={input.aggOrdersPerDay}
                    onChange={set("aggOrdersPerDay")}
                    hint="Среднее количество заказов с агрегатора за день."
                  />
                </div>

                {!isVat && (
                  <>
                    <CalcToggle
                      label="Кто доставляет"
                      value={input.deliveryType}
                      onChange={setDelivery}
                      options={[
                        { value: "service" as DeliveryType, label: "Курьеры сервиса — 35%" },
                        { value: "own" as DeliveryType, label: "Свои курьеры — 20%" },
                      ]}
                      hint="От способа доставки зависит ставка комиссии: курьерами сервиса — около 35%, своими силами — около 20%."
                    />

                    {input.deliveryType === "own" && (
                      <CalcToggle
                        label="Кнопка вызова Яндекс Доставки"
                        value={input.useYandexDelivery ? 1 : 0}
                        onChange={(v) => {
                          setInput((p) => ({ ...p, useYandexDelivery: v === 1 }));
                          reachGoal("calc_use", { mode, field: "useYandexDelivery" });
                        }}
                        options={[
                          { value: 0, label: "Не используем" },
                          { value: 1, label: "Используем — +2%" },
                        ]}
                        hint="При работе со своими курьерами и вызове курьера Яндекс Доставки удерживают дополнительно 2% от стоимости заказа."
                      />
                    )}

                    <CalcToggle
                      label="Маркетинг Ultima"
                      value={input.marketingShare}
                      onChange={set("marketingShare")}
                      options={[
                        { value: 0, label: "Нет" },
                        { value: 2, label: "2%" },
                        { value: 5, label: "5%" },
                      ]}
                      hint="Для проектов в Ultima.Еда сервис оказывает маркетинговые услуги на выбор — 2% или 5% от заказа, оплачивает ресторан."
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <CalcField
                        label="Комиссия сервиса"
                        suffix="%"
                        value={input.commission}
                        onChange={set("commission")}
                        step={0.5}
                        unit={input.commissionUnit}
                        onUnitChange={(u) => setInput((p) => ({ ...p, commissionUnit: u }))}
                        hint="Подставляется по способу доставки. Уточните свою ставку в договоре."
                      />
                      <CalcField
                        label="Подписка сервиса"
                        suffix="%"
                        value={input.subscriptionShare}
                        onChange={set("subscriptionShare")}
                        max={100}
                        step={0.1}
                        hint="Плата за подписку — обычно около 1,44% от заказа. Указана отдельной строкой в актах."
                      />
                      <CalcField
                        label="Продвижение (CPA, буст)"
                        suffix="%"
                        value={input.aggAdShare}
                        onChange={set("aggAdShare")}
                        step={0.5}
                        unit={input.aggAdUnit}
                        onUnitChange={(u) => setInput((p) => ({ ...p, aggAdUnit: u }))}
                        hint="Расходы на платное продвижение внутри сервиса."
                      />
                      <CalcField
                        label="Скидки и акции"
                        suffix="%"
                        value={input.aggPromoShare}
                        onChange={set("aggPromoShare")}
                        step={0.5}
                        unit={input.aggPromoUnit}
                        onUnitChange={(u) => setInput((p) => ({ ...p, aggPromoUnit: u }))}
                        hint="Ваша доля софинансирования акций."
                      />
                      <CalcField
                        label="Возвраты за счёт ресторана"
                        suffix="%"
                        value={input.refundShare}
                        onChange={set("refundShare")}
                        max={100}
                        step={0.1}
                        hint="Компенсации гостям за счёт заведения. По практике около 1% от оборота."
                      />
                      <CalcField
                        label="Штрафы и удержания"
                        suffix="%"
                        value={input.penaltyShare}
                        onChange={set("penaltyShare")}
                        max={100}
                        step={0.1}
                        hint="Удержания по п. 14.7 оферты и прочие штрафы."
                      />
                    </div>
                  </>
                )}
              </Section>
            )}

            <CalcCheck
              label="Собственная доставка"
              hint="Заказы с вашего сайта, приложения или по телефону."
              checked={selfOn}
              onChange={flag("selfEnabled")}
            />

            {selfOn && (
              <Section title="Собственная доставка" icon="House">
                <div className="grid gap-4 sm:grid-cols-2">
                  <CalcField
                    label="Средний чек"
                    suffix="₽"
                    value={input.selfAvgCheck}
                    onChange={set("selfAvgCheck")}
                    step={50}
                    hint="Средний чек заказа на собственной доставке."
                  />
                  <CalcField
                    label="Заказов в день"
                    suffix="шт"
                    value={input.selfOrdersPerDay}
                    onChange={set("selfOrdersPerDay")}
                    hint="Среднее количество заказов со своих каналов за день."
                  />
                </div>

                {!isVat && (
                  <>
                    <CalcField
                      label="Комиссия платформы"
                      suffix="%"
                      value={input.selfCommission}
                      onChange={set("selfCommission")}
                      max={100}
                      step={0.5}
                      hint="Если сайт или приложение работают на конструкторе с оплатой за заказ — укажите ставку."
                      note="Свой сайт без комиссии — оставьте 0"
                    />

                    <CalcCheck
                      label="Сервисный сбор с гостя"
                      hint="Надбавка к заказу, которая поступает в кассу ресторана и увеличивает доход."
                      checked={input.serviceFeeEnabled}
                      onChange={flag("serviceFeeEnabled")}
                    />
                    {input.serviceFeeEnabled && (
                      <CalcField
                        label="Размер сервисного сбора"
                        suffix="₽"
                        value={input.serviceFee}
                        onChange={set("serviceFee")}
                        step={10}
                        unit={input.serviceFeeUnit}
                        onUnitChange={(u) => setInput((p) => ({ ...p, serviceFeeUnit: u }))}
                        hint="Сумма или процент от заказа."
                      />
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                      <CalcField
                        label="Продвижение"
                        suffix="%"
                        value={input.selfAdShare}
                        onChange={set("selfAdShare")}
                        step={0.5}
                        unit={input.selfAdUnit}
                        onUnitChange={(u) => setInput((p) => ({ ...p, selfAdUnit: u }))}
                        hint="Реклама своих каналов: контекст, таргет, рассылки."
                      />
                      <CalcField
                        label="Скидки и акции"
                        suffix="%"
                        value={input.selfPromoShare}
                        onChange={set("selfPromoShare")}
                        max={100}
                        step={0.5}
                        hint="Промокоды и скидки на своих каналах."
                      />
                      <CalcField
                        label="Роялти по франшизе"
                        suffix="%"
                        value={input.royaltyShare}
                        onChange={set("royaltyShare")}
                        max={100}
                        step={0.5}
                        hint="Отчисления франчайзеру с выручки собственных каналов. Нет франшизы — оставьте 0."
                      />
                    </div>
                  </>
                )}
              </Section>
            )}

            {!r.anyChannel && (
              <p className="flex gap-2 rounded-xl bg-brand/15 p-4 text-[0.9em] leading-snug text-cream">
                <Icon name="Info" size={17} className="mt-0.5 shrink-0 text-brand" />
                Отметьте хотя бы один канал продаж, чтобы увидеть расчёт.
              </p>
            )}

            {!isVat && r.anyChannel && (
              <Section title="Себестоимость заказа" icon="ChefHat">
                <div className="grid gap-4 sm:grid-cols-2">
                  <CalcField
                    label="Фудкост"
                    suffix="%"
                    value={input.foodCost}
                    onChange={set("foodCost")}
                    unit={input.foodCostUnit}
                    onUnitChange={(u) => setInput((p) => ({ ...p, foodCostUnit: u }))}
                    hint="Себестоимость продуктов — в процентах от цены блюда или в рублях на заказ."
                  />
                  <CalcField
                    label="Упаковка на заказ"
                    suffix="₽"
                    value={input.packaging}
                    onChange={set("packaging")}
                    step={10}
                    hint="Коробки, контейнеры, приборы, пакеты."
                  />
                  <CalcField
                    label="Расходные материалы"
                    suffix="₽"
                    value={input.suppliesPerOrder}
                    onChange={set("suppliesPerOrder")}
                    step={5}
                    hint="Перчатки, плёнка, фольга, салфетки на один заказ."
                  />
                  <CalcField
                    label="Списания продуктов"
                    suffix="%"
                    value={input.writeOffShare}
                    onChange={set("writeOffShare")}
                    max={100}
                    step={0.5}
                    hint="Списание продуктов с истекшим сроком годности, в процентах от выручки."
                  />
                </div>
              </Section>
            )}

            {isFull && r.anyChannel && (
              <Section title="Общие расходы на доставку" icon="Building2">
                <p className="text-[0.86em] leading-snug text-cream-muted">
                  Эти расходы не делятся по каналам — они вычитаются из общей валовой прибыли.
                </p>

                <CalcCheck
                  label="Считать персонал доставки"
                  hint="Отметьте, если сотрудники заняты только доставкой. Если они совмещают работу с залом, их зарплату сюда включать не нужно."
                  checked={input.staffEnabled}
                  onChange={flag("staffEnabled")}
                />

                {input.staffEnabled && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <CalcField
                      label="Менеджеров доставки"
                      suffix="чел"
                      value={input.managerCount}
                      onChange={set("managerCount")}
                      hint="Сотрудники, которые ведут кабинет и следят за заказами."
                    />
                    <CalcField
                      label="Ставка менеджера"
                      suffix="₽/мес"
                      value={input.managerSalary}
                      onChange={set("managerSalary")}
                      step={5000}
                      hint="Зарплата одного менеджера в месяц до вычета налогов."
                    />
                    <CalcField
                      label="Курьеров"
                      suffix="чел"
                      value={input.courierCount}
                      onChange={set("courierCount")}
                      hint="Штатные курьеры заведения. Если везёт только агрегатор — поставьте 0."
                    />
                    <CalcField
                      label="Ставка курьера"
                      suffix="₽/мес"
                      value={input.courierSalary}
                      onChange={set("courierSalary")}
                      step={5000}
                      hint="Зарплата одного курьера в месяц."
                    />
                    <CalcField
                      label="Компенсация топлива"
                      suffix="₽/мес"
                      value={input.fuelPerCourier}
                      onChange={set("fuelPerCourier")}
                      step={1000}
                      hint="Компенсация бензина или транспорта на одного курьера."
                    />
                    <CalcField
                      label="Сборщиков заказов"
                      suffix="чел"
                      value={input.packerCount}
                      onChange={set("packerCount")}
                      hint="Сотрудники на сборке и упаковке заказов доставки."
                    />
                    <CalcField
                      label="Ставка сборщика"
                      suffix="₽/мес"
                      value={input.packerSalary}
                      onChange={set("packerSalary")}
                      step={5000}
                      hint="Зарплата одного сборщика в месяц."
                    />
                    <CalcField
                      label="Страховые взносы"
                      suffix="%"
                      value={input.insuranceRate}
                      onChange={set("insuranceRate")}
                      max={100}
                      step={0.5}
                      hint="Взносы с фонда оплаты труда. Стандартная ставка — 30%."
                    />
                  </div>
                )}

                <CalcCheck
                  label="Доля общих расходов ресторана"
                  hint="Если доставка — часть ресторана, аренда и коммуналка делятся между залом и доставкой."
                  checked={input.overheadEnabled}
                  onChange={flag("overheadEnabled")}
                />

                {input.overheadEnabled && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <CalcField
                      label="Общие расходы ресторана"
                      suffix="₽/мес"
                      value={input.overheadTotal}
                      onChange={set("overheadTotal")}
                      step={10000}
                      hint="Аренда, коммунальные услуги, управляющий персонал — всё, что тратит ресторан целиком."
                    />
                    <CalcField
                      label="Доля доставки"
                      suffix="%"
                      value={input.overheadShare}
                      onChange={set("overheadShare")}
                      max={100}
                      step={5}
                      hint="Какая часть общих расходов приходится на доставку. Обычно считают по доле выручки."
                      note={`На доставку: ${money((input.overheadTotal * input.overheadShare) / 100)} ₽/мес`}
                    />
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <CalcField
                    label="Постоянные расходы"
                    suffix="₽/мес"
                    value={input.fixedPerMonth}
                    onChange={set("fixedPerMonth")}
                    step={5000}
                    hint="Прочие расходы на доставку, кроме зарплат и общих расходов ресторана."
                  />
                  <CalcField
                    label="IT-системы"
                    suffix="₽/мес"
                    value={input.itPerMonth}
                    onChange={set("itPerMonth")}
                    step={1000}
                    hint="Касса, POS-система, сайт, техподдержка — в части, относящейся к доставке."
                  />
                  <CalcField
                    label="Амортизация оборудования"
                    suffix="₽/мес"
                    value={input.depreciationPerMonth}
                    onChange={set("depreciationPerMonth")}
                    step={5000}
                    hint="Износ оборудования, отнесённый на доставку. Не влияет на EBITDA."
                  />
                </div>

                <CalcToggle
                  label="Система налогообложения"
                  value={input.taxMode}
                  onChange={(v) => {
                    setInput((p) => ({ ...p, taxMode: v as TaxMode }));
                    reachGoal("calc_use", { mode, field: "taxMode" });
                  }}
                  options={TAX_MODES.map((t) => ({ value: t.value, label: t.label }))}
                  hint="От режима зависит, с какой суммы считается налог. На УСН «Доходы» налог берётся со всего оборота."
                />

                {input.taxMode === "patent" && (
                  <CalcField
                    label="Стоимость патента"
                    suffix="₽/мес"
                    value={input.patentCost}
                    onChange={set("patentCost")}
                    step={1000}
                    hint="Стоимость патента в пересчёте на месяц."
                  />
                )}
              </Section>
            )}
          </div>

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

        <div className="space-y-4">
          {show("profit") && aggOn && (
            <Card title="Экономика заказа — агрегатор" icon="Store">
              <ChannelBlock c={r.agg} title="агрегатор" />
            </Card>
          )}

          {show("profit") && selfOn && (
            <Card title="Экономика заказа — своя доставка" icon="House">
              <ChannelBlock c={r.self} title="своя доставка" />
            </Card>
          )}

          {show("profit") && r.bothChannels && (
            <Card title="Итого по каналам" icon="Layers">
              <Row label="Заказов в день" value={`${money(r.ordersPerDay)} шт`} muted />
              <Row label="Средний чек" value={`${money(r.avgCheck)} ₽`} muted />
              <Row label="Оборот в месяц" value={`${money(r.revenuePerMonth)} ₽`} />
              <Row label="Поступит на счёт" value={`${money(r.payoutPerMonth)} ₽`} muted />
              <Row
                label="Валовая прибыль"
                value={`${money(r.grossProfitPerMonth)} ₽`}
                accent
                strong
              />
              <Row label="Средняя маржинальность" value={percent(r.marginPercent)} />
            </Card>
          )}

          {show("profit") && r.anyChannel && !r.isProfitable && (
            <p className="flex gap-2 rounded-xl bg-red-500/15 p-4 text-[0.88em] leading-snug text-red-200">
              <Icon name="TriangleAlert" size={17} className="mt-0.5 shrink-0" />
              При таких условиях заказы не приносят прибыли — каждый новый заказ увеличивает убыток.
            </p>
          )}

          {show("drr") && r.anyChannel && (
            <Card title="ДРР — доля рекламных расходов" icon="Percent">
              <div className="flex flex-wrap items-end gap-3">
                <span className={`font-display text-[2.6em] font-semibold leading-none ${drrColor}`}>
                  {percent(r.drr)}
                </span>
                <span className={`pb-1 text-[0.9em] leading-snug ${drrColor}`}>{drrText}</span>
              </div>
              <div className="mt-4">
                {r.bothChannels && (
                  <>
                    <Row label="ДРР агрегатора" value={percent(r.agg.drr)} muted />
                    <Row label="ДРР своей доставки" value={percent(r.self.drr)} muted />
                  </>
                )}
                <Row
                  label="Расходы на рекламу в месяц"
                  value={`${money(r.adSpendPerMonth)} ₽`}
                  muted
                />
                <Row label="Оборот в месяц" value={`${money(r.revenuePerMonth)} ₽`} muted />
                <Row label="Предельный ДРР при вашей марже" value={percent(r.drrLimit)} />
              </div>
              <p className="mt-3 text-[0.86em] leading-snug text-cream-muted">
                Выше предельного значения продвижение работает в убыток. Ориентир для устойчивой
                работы — до 12%.
              </p>
            </Card>
          )}

          {show("breakeven") && input.staffEnabled && r.anyChannel && (
            <Card title="Персонал доставки" icon="Users">
              {r.managersCost > 0 && (
                <Row label="Менеджеры" value={`${money(r.managersCost)} ₽`} muted />
              )}
              {r.couriersCost > 0 && (
                <Row label="Курьеры" value={`${money(r.couriersCost)} ₽`} muted />
              )}
              {r.fuelCost > 0 && (
                <Row label="Компенсация топлива" value={`${money(r.fuelCost)} ₽`} muted />
              )}
              {r.packersCost > 0 && (
                <Row label="Сборщики" value={`${money(r.packersCost)} ₽`} muted />
              )}
              <Row label="Страховые взносы" value={`${money(r.insuranceCost)} ₽`} muted />
              <Row label="Всего на персонал" value={`${money(r.staffTotal)} ₽`} accent strong />
              <Row label="В пересчёте на заказ" value={`${money(r.staffPerOrder)} ₽`} />
            </Card>
          )}

          {show("breakeven") && r.anyChannel && (
            <Card title="Итоги за месяц" icon="TrendingUp">
              <Row label="Оборот" value={`${money(r.revenuePerMonth)} ₽`} muted />
              {r.bothChannels && (
                <>
                  <Row
                    label="Валовая прибыль — агрегатор"
                    value={`${money(r.agg.profitPerMonth)} ₽`}
                    muted
                  />
                  <Row
                    label="Валовая прибыль — своя доставка"
                    value={`${money(r.self.profitPerMonth)} ₽`}
                    muted
                  />
                </>
              )}
              <Row label="Валовая прибыль" value={`${money(r.grossProfitPerMonth)} ₽`} strong />
              {r.staffTotal > 0 && (
                <Row label="Персонал доставки" value={`−${money(r.staffTotal)} ₽`} muted />
              )}
              {r.overheadCost > 0 && (
                <Row label="Доля общих расходов" value={`−${money(r.overheadCost)} ₽`} muted />
              )}
              {input.fixedPerMonth > 0 && (
                <Row label="Постоянные расходы" value={`−${money(input.fixedPerMonth)} ₽`} muted />
              )}
              {r.itCost > 0 && <Row label="IT-системы" value={`−${money(r.itCost)} ₽`} muted />}
              <Row label="EBITDA" value={`${money(r.ebitda)} ₽`} strong />
              {r.depreciationCost > 0 && (
                <Row label="Амортизация" value={`−${money(r.depreciationCost)} ₽`} muted />
              )}
              <Row label={r.taxLabel} value={`−${money(r.taxAmount)} ₽`} muted />
              <Row label="Чистая прибыль" value={`${money(r.netProfitPerMonth)} ₽`} accent strong />
              <Row label="Чистая рентабельность" value={percent(r.netMarginPercent)} />
              {r.operatingTotal > 0 && (
                <Row
                  label="Заказов в день для выхода в ноль"
                  value={r.breakEvenOrders > 0 ? `${money(r.breakEvenOrders)} шт` : "не окупится"}
                />
              )}
              <p className="mt-3 text-[0.86em] leading-snug text-cream-muted">{r.taxNote}</p>
              {r.netProfitPerMonth < 0 && (
                <p className="mt-3 flex gap-2 rounded-xl bg-red-500/15 p-3 text-[0.88em] leading-snug text-red-200">
                  <Icon name="TriangleAlert" size={17} className="mt-0.5 shrink-0" />
                  С учётом всех расходов и налогов канал работает в убыток.
                </p>
              )}
            </Card>
          )}

          {show("vat") && r.anyChannel && (
            <Card title="НДС при работе на УСН" icon="Receipt">
              <Row label="Оборот за год" value={`${money(r.revenuePerYear)} ₽`} muted />
              <Row label="Ваша ставка НДС" value={r.vat.label} accent />
              {r.vat.rate > 0 && (
                <>
                  <Row label="НДС за год" value={`${money(r.vatAmountPerYear)} ₽`} />
                  <Row label="НДС в месяц" value={`${money(r.vatAmountPerYear / 12)} ₽`} muted />
                </>
              )}
              {r.daysToVatLimit !== null && (
                <Row
                  label="Лимит будет достигнут через"
                  value={`${money(r.daysToVatLimit)} дн`}
                  muted
                />
              )}
              {r.ordersToVatLimit !== null && (
                <Row label="Запас до лимита" value={`${money(r.ordersToVatLimit)} заказов`} muted />
              )}
              <p className="mt-3 text-[0.86em] leading-snug text-cream-muted">{r.vat.note}</p>
              <p className="mt-2 flex gap-2 rounded-xl bg-brand/15 p-3 text-[0.86em] leading-snug text-cream">
                <Icon name="Info" size={16} className="mt-0.5 shrink-0 text-brand" />
                Важно: в доход считается вся сумма заказа, а не то, что пришло после удержаний. При
                комиссии 35% на счёт поступает примерно половина оборота — а налог считается со всей
                суммы.
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
