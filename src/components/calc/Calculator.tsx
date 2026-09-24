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
  type DeliveryType,
  type TaxMode,
  type Channel,
  type FeeOwner,
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

const Calculator = ({ mode = "all" }: { mode?: CalcMode }) => {
  const [input, setInput] = useState<CalcInput>(DEFAULTS);
  const r = useMemo(() => calculate(input), [input]);

  const set = (key: keyof CalcInput) => (v: number) => {
    setInput((p) => ({ ...p, [key]: v }));
    reachGoal("calc_use", { mode, field: key });
  };

  const setDelivery = (v: DeliveryType) => {
    setInput((p) => ({
      ...p,
      deliveryType: v,
      commission: v === "service" ? COMMISSION_SERVICE : COMMISSION_OWN,
      useYandexDelivery: v === "service" ? false : p.useYandexDelivery,
    }));
    reachGoal("calc_use", { mode, field: "deliveryType" });
  };

  const show = (block: CalcMode) => mode === "all" || mode === block;
  const isVat = mode === "vat";
  const isFull = mode === "all" || mode === "breakeven";
  const isAgg = input.channel === "aggregator";
  const isSelf = input.channel === "self";

  const setChannel = (v: Channel) => {
    setInput((p) => ({
      ...p,
      channel: v,
      deliveryPriceEnabled: v === "self" ? p.deliveryPriceEnabled : false,
    }));
    reachGoal("calc_use", { mode, field: "channel" });
  };

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
            Подставьте свои цифры — расчёт обновится сразу.
          </p>

          <div className="mt-6 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
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
            </div>

            {!isVat && (
              <>
                <CalcToggle
                  label="Канал продаж"
                  value={input.channel}
                  onChange={setChannel}
                  options={[
                    { value: "aggregator" as Channel, label: "Агрегатор" },
                    { value: "self" as Channel, label: "Своя доставка" },
                  ]}
                  hint="Агрегатор — Яндекс Еда, Купер и подобные. Своя доставка — заказы с вашего сайта, приложения или по телефону."
                />

                {isSelf && (
                  <CalcField
                    label="Комиссия платформы"
                    suffix="%"
                    value={input.selfCommission}
                    onChange={set("selfCommission")}
                    max={100}
                    step={0.5}
                    hint="Если сайт или приложение работают на конструкторе с оплатой за заказ — укажите ставку. Если платформа бесплатная или с фиксированной абонплатой, оставьте 0."
                    note="Собственный сайт без комиссии — оставьте 0"
                  />
                )}

                {isAgg && (
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
                )}

                {isAgg && input.deliveryType === "own" && (
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

                <div className="space-y-4 rounded-2xl border border-cream/15 p-5">
                  <p className="text-[0.9em] font-medium text-cream">Доплаты гостя</p>
                  <CalcCheck
                    label="Сервисный сбор с гостя"
                    hint="Надбавка к заказу, которая поступает в кассу ресторана."
                    checked={input.serviceFeeEnabled}
                    onChange={(v) => {
                      setInput((p) => ({ ...p, serviceFeeEnabled: v }));
                      reachGoal("calc_use", { mode, field: "serviceFeeEnabled" });
                    }}
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
                      hint="Сумма или процент от заказа. Сбор увеличивает доход ресторана."
                    />
                  )}

                  <CalcCheck
                    label="Платная доставка для гостя"
                    hint="Гость платит за доставку отдельно. Важно указать, кому достаются эти деньги."
                    checked={input.deliveryPriceEnabled}
                    onChange={(v) => {
                      setInput((p) => ({ ...p, deliveryPriceEnabled: v }));
                      reachGoal("calc_use", { mode, field: "deliveryPriceEnabled" });
                    }}
                  />
                  {input.deliveryPriceEnabled && (
                    <>
                      <CalcField
                        label="Стоимость доставки"
                        suffix="₽"
                        value={input.deliveryPrice}
                        onChange={set("deliveryPrice")}
                        step={10}
                        hint="Сколько гость платит за доставку сверх стоимости блюд."
                      />
                      <CalcToggle
                        label="Кому идут деньги за доставку"
                        value={input.deliveryPriceOwner}
                        onChange={(v) => {
                          setInput((p) => ({ ...p, deliveryPriceOwner: v as FeeOwner }));
                          reachGoal("calc_use", { mode, field: "deliveryPriceOwner" });
                        }}
                        options={[
                          { value: "restaurant" as FeeOwner, label: "В кассу ресторана" },
                          { value: "courier" as FeeOwner, label: "Курьеру напрямую" },
                        ]}
                        hint="Если деньги забирает курьер, они не попадают в доход ресторана и в расчёте не участвуют."
                      />
                    </>
                  )}
                </div>

                {isAgg && (
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
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  {isAgg && (
                    <CalcField
                      label="Комиссия сервиса"
                      suffix="%"
                      value={input.commission}
                      onChange={set("commission")}
                      step={0.5}
                      unit={input.commissionUnit}
                      onUnitChange={(u) => setInput((p) => ({ ...p, commissionUnit: u }))}
                      hint="Подставляется по способу доставки. Уточните свою ставку в договоре — она может отличаться."
                    />
                  )}
                  {isAgg && (
                    <CalcField
                      label="Подписка сервиса"
                      suffix="%"
                      value={input.subscriptionShare}
                      onChange={set("subscriptionShare")}
                      max={100}
                      step={0.1}
                      hint="Плата за подписку на сервис — обычно около 1,44% от заказа. Указана отдельной строкой в актах."
                    />
                  )}
                  <CalcField
                    label="Продвижение (CPA, буст)"
                    suffix="%"
                    value={input.adShare}
                    onChange={set("adShare")}
                    step={0.5}
                    unit={input.adUnit}
                    onUnitChange={(u) => setInput((p) => ({ ...p, adUnit: u }))}
                    hint="Расходы на платное продвижение. В отчётах это строки CPA-маркетинг и Буст."
                  />
                  <CalcField
                    label="Скидки и акции"
                    suffix="%"
                    value={input.promoShare}
                    onChange={set("promoShare")}
                    step={0.5}
                    unit={input.promoUnit}
                    onUnitChange={(u) => setInput((p) => ({ ...p, promoUnit: u }))}
                    hint="Ваша доля софинансирования акций от суммы заказа."
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
                  {isAgg && (
                    <CalcField
                      label="Штрафы и удержания"
                      suffix="%"
                      value={input.penaltyShare}
                      onChange={set("penaltyShare")}
                      max={100}
                      step={0.1}
                      hint="Удержания по п. 14.7 оферты и прочие штрафы. Обычно 0,1–0,5% от оборота."
                    />
                  )}
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
                    label="Расходные материалы"
                    suffix="₽"
                    value={input.suppliesPerOrder}
                    onChange={set("suppliesPerOrder")}
                    step={5}
                    hint="Перчатки, плёнка, фольга, салфетки — всё, что расходуется на приготовление заказа."
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
                  <CalcField
                    label="Роялти по франшизе"
                    suffix="%"
                    value={input.royaltyShare}
                    onChange={set("royaltyShare")}
                    max={100}
                    step={0.5}
                    hint="Отчисления франчайзеру от выручки. Если не работаете по франшизе — оставьте 0."
                  />
                  <CalcField
                    label="Упаковка на заказ"
                    suffix="₽"
                    value={input.packaging}
                    onChange={set("packaging")}
                    step={10}
                    hint="Средние затраты на упаковку одного заказа."
                  />
                  {isFull && (
                    <CalcField
                      label="Постоянные расходы"
                      suffix="₽/мес"
                      value={input.fixedPerMonth}
                      onChange={set("fixedPerMonth")}
                      step={5000}
                      hint="Прочие расходы на доставку, кроме зарплат и общих расходов ресторана. Можно оставить 0."
                    />
                  )}
                  {isFull && (
                    <CalcField
                      label="IT-системы"
                      suffix="₽/мес"
                      value={input.itPerMonth}
                      onChange={set("itPerMonth")}
                      step={1000}
                      hint="Касса, POS-система, сайт, техподдержка — в части, которая относится к доставке."
                    />
                  )}
                  {isFull && (
                    <CalcField
                      label="Амортизация оборудования"
                      suffix="₽/мес"
                      value={input.depreciationPerMonth}
                      onChange={set("depreciationPerMonth")}
                      step={5000}
                      hint="Износ оборудования, отнесённый на доставку. Влияет на итоговую прибыль, но не на EBITDA."
                    />
                  )}
                </div>

                {isFull && (
                  <CalcCheck
                    label="Доля общих расходов ресторана"
                    hint="Если доставка — часть ресторана, аренда и коммуналка делятся между залом и доставкой. Укажите общую сумму и долю, которая приходится на доставку."
                    checked={input.overheadEnabled}
                    onChange={(v) => {
                      setInput((p) => ({ ...p, overheadEnabled: v }));
                      reachGoal("calc_use", { mode, field: "overheadEnabled" });
                    }}
                  />
                )}

                {isFull && input.overheadEnabled && (
                  <div className="grid gap-4 rounded-2xl border border-cream/15 p-5 sm:grid-cols-2">
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
                      hint="Какая часть общих расходов приходится на доставку. Обычно считают по доле выручки или по площади и времени работы персонала."
                      note={`На доставку: ${money((input.overheadTotal * input.overheadShare) / 100)} ₽/мес`}
                    />
                  </div>
                )}

                {isFull && (
                <CalcCheck
                  label="Считать персонал доставки"
                  hint="Отметьте, если сотрудники заняты только доставкой. Если они совмещают работу с залом, их зарплату сюда включать не нужно."
                  checked={input.staffEnabled}
                  onChange={(v) => {
                    setInput((p) => ({ ...p, staffEnabled: v }));
                    reachGoal("calc_use", { mode, field: "staffEnabled" });
                  }}
                />
                )}

                {input.staffEnabled && isFull && (
                  <div className="space-y-4 rounded-2xl border border-cream/15 p-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <CalcField
                        label="Менеджеров доставки"
                        suffix="чел"
                        value={input.managerCount}
                        onChange={set("managerCount")}
                        hint="Сотрудники, которые ведут кабинет, следят за заказами и отвечают на отзывы."
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
                        hint="Штатные курьеры заведения. Если доставляет сервис — оставьте 0."
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
                        hint="Компенсация бензина или транспорта на одного курьера. Если не платите — поставьте 0."
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
                        hint="Взносы с фонда оплаты труда. Стандартная ставка — 30%, для малого бизнеса часть выплат облагается по 15%."
                      />
                    </div>
                  </div>
                )}

                {isFull && (
                <CalcToggle
                  label="Система налогообложения"
                  value={input.taxMode}
                  onChange={(v) => {
                    setInput((p) => ({ ...p, taxMode: v as TaxMode }));
                    reachGoal("calc_use", { mode, field: "taxMode" });
                  }}
                  options={TAX_MODES.map((t) => ({ value: t.value, label: t.label }))}
                  hint="От режима зависит, с какой суммы считается налог. На УСН «Доходы» налог берётся со всего оборота, включая комиссию сервиса."
                />
                )}

                {input.taxMode === "patent" && isFull && (
                  <CalcField
                    label="Стоимость патента"
                    suffix="₽/мес"
                    value={input.patentCost}
                    onChange={set("patentCost")}
                    step={1000}
                    hint="Стоимость патента в пересчёте на месяц."
                  />
                )}
              </>
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
          {show("profit") && (
            <Card title="Что удерживает сервис" icon="Wallet">
              <Row label="Средний чек" value={`${money(input.avgCheck)} ₽`} muted />
              {r.serviceFeeRub > 0 && (
                <Row label="Сервисный сбор с гостя" value={`+${money(r.serviceFeeRub)} ₽`} muted />
              )}
              {r.deliveryPriceRub > 0 && (
                <Row
                  label={
                    input.deliveryPriceOwner === "restaurant"
                      ? "Платная доставка (в кассу)"
                      : "Платная доставка (курьеру)"
                  }
                  value={
                    input.deliveryPriceOwner === "restaurant"
                      ? `+${money(r.deliveryPriceRub)} ₽`
                      : "мимо кассы"
                  }
                  muted
                />
              )}
              {r.restaurantIncome !== input.avgCheck && (
                <Row label="Доход ресторана с заказа" value={`${money(r.restaurantIncome)} ₽`} />
              )}
              <Row
                label={isAgg ? "Комиссия сервиса" : "Комиссия платформы"}
                value={`−${money(r.commissionRub)} ₽`}
                muted
              />
              {r.subscriptionRub > 0 && (
                <Row label="Подписка сервиса" value={`−${money(r.subscriptionRub)} ₽`} muted />
              )}
              {r.deliveryFeeRub > 0 && (
                <Row label="Вызов Яндекс Доставки" value={`−${money(r.deliveryFeeRub)} ₽`} muted />
              )}
              <Row label="Продвижение" value={`−${money(r.adRub)} ₽`} muted />
              {r.marketingRub > 0 && (
                <Row label="Маркетинг Ultima" value={`−${money(r.marketingRub)} ₽`} muted />
              )}
              {r.promoRub > 0 && (
                <Row label="Скидки и акции" value={`−${money(r.promoRub)} ₽`} muted />
              )}
              <Row label="Возвраты гостям" value={`−${money(r.refundRub)} ₽`} muted />
              <Row label="Штрафы и удержания" value={`−${money(r.penaltyRub)} ₽`} muted />
              <Row
                label="Придёт на счёт с заказа"
                value={`${money(r.payoutPerOrder)} ₽`}
                accent
                strong
              />
              <Row
                label="Доля от суммы заказа"
                value={percent(r.payoutPercent)}
              />
              <p className="mt-3 flex gap-2 rounded-xl bg-brand/15 p-3 text-[0.86em] leading-snug text-cream">
                <Icon name="Info" size={16} className="mt-0.5 shrink-0 text-brand" />
                Сервис удерживает {percent(r.withheldPercent)} от суммы заказа. Остальное поступает на расчётный счёт — до вычета себестоимости.
              </p>
            </Card>
          )}

          {show("profit") && (
            <Card title="Рентабельность заказа" icon="Coins">
              <Row label="Поступило на счёт" value={`${money(r.payoutPerOrder)} ₽`} muted />
              <Row label="Себестоимость блюд" value={`−${money(r.foodCostRub)} ₽`} muted />
              <Row label="Упаковка" value={`−${money(r.packagingRub)} ₽`} muted />
              {r.suppliesRub > 0 && (
                <Row label="Расходные материалы" value={`−${money(r.suppliesRub)} ₽`} muted />
              )}
              {r.writeOffRub > 0 && (
                <Row label="Списания продуктов" value={`−${money(r.writeOffRub)} ₽`} muted />
              )}
              {r.royaltyRub > 0 && (
                <Row label="Роялти" value={`−${money(r.royaltyRub)} ₽`} muted />
              )}
              <Row label="Остаётся с заказа" value={`${money(r.profitPerOrder)} ₽`} accent strong />
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
              <div className="flex flex-wrap items-end gap-3">
                <span className={`font-display text-[2.6em] font-semibold leading-none ${drrColor}`}>
                  {percent(r.drr)}
                </span>
                <span className={`pb-1 text-[0.9em] leading-snug ${drrColor}`}>{drrText}</span>
              </div>
              <div className="mt-4">
                <Row label="Продвижение с заказа" value={`${money(r.adRub + r.marketingRub)} ₽`} muted />
                <Row label="Расходы на рекламу в месяц" value={`${money(r.adSpendPerMonth)} ₽`} muted />
                <Row label="Выручка в месяц" value={`${money(r.revenuePerMonth)} ₽`} muted />
                <Row label="Предельный ДРР при вашей марже" value={percent(r.drrLimit)} />
              </div>
              <p className="mt-3 text-[0.86em] leading-snug text-cream-muted">
                Выше предельного значения продвижение работает в убыток. Ориентир для устойчивой работы — до 12%.
              </p>
            </Card>
          )}

          {show("breakeven") && input.staffEnabled && (
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

          {show("breakeven") && (
            <Card title="Окупаемость канала" icon="TrendingUp">
              <Row label="Оборот в месяц" value={`${money(r.revenuePerMonth)} ₽`} muted />
              <Row label="Поступит на счёт" value={`${money(r.payoutPerMonth)} ₽`} muted />
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
              <Row label="Прибыль до налогов" value={`${money(r.profitBeforeTax)} ₽`} />
              <Row label={r.taxLabel} value={`−${money(r.taxAmount)} ₽`} muted />
              <Row label="Чистая прибыль в месяц" value={`${money(r.netProfitPerMonth)} ₽`} accent strong />
              <Row label="Чистая рентабельность" value={percent(r.netMarginPercent)} />
              {input.fixedPerMonth + r.staffTotal > 0 && (
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

          {show("vat") && (
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
                <Row label="Лимит будет достигнут через" value={`${money(r.daysToVatLimit)} дн`} muted />
              )}
              {r.ordersToVatLimit !== null && (
                <Row label="Запас до лимита" value={`${money(r.ordersToVatLimit)} заказов`} muted />
              )}
              <p className="mt-3 text-[0.86em] leading-snug text-cream-muted">{r.vat.note}</p>
              <p className="mt-2 flex gap-2 rounded-xl bg-brand/15 p-3 text-[0.86em] leading-snug text-cream">
                <Icon name="Info" size={16} className="mt-0.5 shrink-0 text-brand" />
                Важно: в доход считается вся сумма заказа, а не то, что пришло после удержаний. При комиссии 35% на счёт поступает примерно половина оборота — а налог считается со всей суммы.
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
              Разберём ваши отчёты и кабинет, найдём, где теряется маржа, и покажем, что можно изменить. Бесплатно, результат за 2 рабочих дня.
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