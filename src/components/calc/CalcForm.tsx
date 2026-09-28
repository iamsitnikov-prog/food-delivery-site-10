import Icon from "@/components/ui/icon";
import CalcField from "./CalcField";
import CalcToggle from "./CalcToggle";
import CalcCheck from "./CalcCheck";
import { Section, RevenueBadge } from "./CalcParts";
import {
  money,
  MONTHS,
  daysInMonth,
  TAX_MODES,
  SUBSCRIPTION_PLANS,
  AD_BASES,
  PLATFORMS,
  businessFixedFee,
  type CalcInput,
  type SubscriptionPlan,
  type AdBase,
  type Platform,
  type CalcResult,
  type DeliveryType,
  type TaxMode,
  type Unit,
} from "@/lib/calc";

type Props = {
  input: CalcInput;
  r: CalcResult;
  isVat: boolean;
  isFull: boolean;
  set: (key: keyof CalcInput) => (v: number) => void;
  flag: (key: keyof CalcInput) => (v: boolean) => void;
  setUnit: (key: keyof CalcInput) => (u: Unit) => void;
  setDelivery: (v: DeliveryType) => void;
  setYandexDelivery: (v: number) => void;
  setTaxMode: (v: TaxMode) => void;
  setSubscriptionPlan: (v: SubscriptionPlan) => void;
  setAdBase: (v: AdBase) => void;
  setPlatform: (v: Platform) => void;
};

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = [CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1];

const CalcForm = ({
  input,
  r,
  isVat,
  isFull,
  set,
  flag,
  setUnit,
  setDelivery,
  setYandexDelivery,
  setTaxMode,
  setSubscriptionPlan,
  setAdBase,
  setPlatform,
}: Props) => {
  const aggOn = input.aggEnabled;
  const selfOn = input.selfEnabled;

  return (
    <div className="mt-6 space-y-5">
      {isFull && (
        <div className="rounded-2xl border border-cream/15 p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <span className="text-[0.9em] font-medium text-cream">
              Период расчёта
            </span>
            <span className="text-[0.85em] text-cream-muted">
              {daysInMonth(input.periodMonth, input.periodYear)} дней в месяце
            </span>
          </div>
          <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
            <select
              aria-label="Месяц"
              value={input.periodMonth}
              onChange={(e) => set("periodMonth")(Number(e.target.value))}
              className="h-12 rounded-xl border border-cream/20 bg-cream/[0.06] px-3 text-[0.95em] font-medium text-cream outline-none transition-colors focus:border-brand"
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i} className="bg-[#1a1a1a]">
                  {m}
                </option>
              ))}
            </select>
            <select
              aria-label="Год"
              value={input.periodYear}
              onChange={(e) => set("periodYear")(Number(e.target.value))}
              className="h-12 rounded-xl border border-cream/20 bg-cream/[0.06] px-3 text-[0.95em] font-medium text-cream outline-none transition-colors focus:border-brand"
            >
              {YEARS.map((y) => (
                <option key={y} value={y} className="bg-[#1a1a1a]">
                  {y}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-2 text-[0.8em] leading-snug text-cream-muted">
            Все месячные суммы считаются на это количество дней, а не на условные 30.
          </p>
        </div>
      )}

      <CalcCheck
        label="Заказы с агрегаторов"
        hint="Яндекс Еда, Купер и другие сервисы доставки."
        checked={aggOn}
        onChange={flag("aggEnabled")}
      />

      {aggOn && (
        <Section title="Агрегатор" icon="Store">
          <CalcToggle
            label="Где работает ресторан"
            value={input.platform}
            onChange={setPlatform}
            options={PLATFORMS.map((p) => ({ value: p.value, label: p.label }))}
            hint={PLATFORMS.find((p) => p.value === input.platform)?.hint}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <CalcField
              label="Средний чек · average check"
              suffix="₽"
              value={input.aggAvgCheck}
              onChange={set("aggAvgCheck")}
              step={50}
              hint="Средняя сумма заказа на агрегаторе по данным кабинета."
            />
            <CalcField
              label="Заказов в день · orders"
              suffix="шт в день"
              value={input.aggOrdersPerDay}
              onChange={set("aggOrdersPerDay")}
              hint="Среднее количество заказов с агрегатора ЗА ОДИН ДЕНЬ, не за месяц. Если знаете месячное число — разделите его на 30."
              note={`≈ ${Math.round((input.aggOrdersPerDay || 0) * 30).toLocaleString("ru-RU")} заказов в месяц`}
            />
          </div>
          <RevenueBadge value={r.agg.revenuePerMonth} />

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
                  onChange={setYandexDelivery}
                  options={[
                    { value: 0, label: "Не используем" },
                    { value: 1, label: "Используем — +2%" },
                  ]}
                  hint="При работе со своими курьерами и вызове курьера Яндекс Доставки удерживают дополнительно 2% от стоимости заказа."
                />
              )}

              <CalcToggle
                label="Тариф Подписки"
                value={input.subscriptionPlan}
                onChange={setSubscriptionPlan}
                options={SUBSCRIPTION_PLANS.map((p) => ({ value: p.value, label: p.label }))}
                hint={SUBSCRIPTION_PLANS.find((p) => p.value === input.subscriptionPlan)?.hint}
              />

              {input.subscriptionPlan === "business" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <CalcField
                    label="Ресторанов в Подписке"
                    suffix="шт"
                    value={input.restaurantCount}
                    onChange={set("restaurantCount")}
                    step={1}
                    hint="Фиксированная часть тарифа «Бизнес» — стоимость личного менеджера: 1 333 ₽ + НДС в месяц за первые три ресторана и 583 ₽ + НДС за каждый следующий. В расчёте — 1 626 ₽ и 711 ₽ с НДС."
                  />
                  <div className="flex flex-col justify-center rounded-2xl bg-cream/5 px-4 py-3">
                    <span className="text-[0.82em] text-cream-muted">фиксированная часть</span>
                    <span className="mt-0.5 font-display text-[1.25em] font-semibold text-brand">
                      {money(businessFixedFee(input.restaurantCount))} ₽/мес
                    </span>
                  </div>
                </div>
              )}

              <CalcToggle
                label="Как считать продвижение"
                value={input.aggAdBase}
                onChange={setAdBase}
                options={AD_BASES.map((b) => ({ value: b.value, label: b.label }))}
                hint={AD_BASES.find((b) => b.value === input.aggAdBase)?.hint}
              />

              {input.platform === "ultima" && (
                <CalcToggle
                  label="Маркетинговые услуги Ultima"
                  value={input.marketingShare}
                  onChange={set("marketingShare")}
                  options={[
                    { value: 2, label: "2%" },
                    { value: 5, label: "5%" },
                  ]}
                  hint="В Ultima.Еда сервис оказывает маркетинговые услуги на выбор ресторана — 2% или 5% от стоимости заказа. Списываются дополнительно к комиссии."
                />
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <CalcField
                  label="Комиссия · commission"
                  suffix="%"
                  value={input.commission}
                  onChange={set("commission")}
                  step={0.5}
                  unit={input.commissionUnit}
                  onUnitChange={setUnit("commissionUnit")}
                  hint="Подставляется по способу доставки. Уточните свою ставку в договоре."
                />
                {input.subscriptionPlan !== "none" && (
                  <CalcField
                    label="Подписка · subscription"
                    suffix="%"
                    value={input.subscriptionShare}
                    onChange={set("subscriptionShare")}
                    step={0.01}
                    unit={input.subscriptionUnit}
                    onUnitChange={setUnit("subscriptionUnit")}
                    hint="Процент от суммы заказов. По текущим условиям — 1,64% + НДС, в расчёте 2,0% с НДС. Указан отдельной строкой «Услуги подписки» в актах."
                  />
                )}
                <CalcField
                  label="Продвижение · ad spend (CPA)"
                  suffix="%"
                  value={input.aggAdShare}
                  onChange={set("aggAdShare")}
                  step={0.5}
                  unit={input.aggAdUnit}
                  onUnitChange={setUnit("aggAdUnit")}
                  hint="Ставка продвижения внутри сервиса. По модели оплаты за заказы списывается только с заказов, пришедших из платной выдачи."
                />
                {input.aggAdBase === "promoted" && (
                  <CalcField
                    label="Доля заказов из рекламы"
                    suffix="%"
                    value={input.aggAdReach}
                    onChange={set("aggAdReach")}
                    step={5}
                    hint="Какая часть всех заказов канала приходит из платного продвижения. Посмотрите в кабинете: Статистика → Продвижение. Если не знаете точно, оставьте 100% — расчёт будет с запасом."
                  />
                )}
                <CalcField
                  label="Скидки и акции · promo"
                  suffix="%"
                  value={input.aggPromoShare}
                  onChange={set("aggPromoShare")}
                  step={0.5}
                  unit={input.aggPromoUnit}
                  onUnitChange={setUnit("aggPromoUnit")}
                  hint="Ваша доля софинансирования акций."
                />
                <CalcField
                  label="Возвраты · refunds"
                  suffix="%"
                  value={input.refundShare}
                  onChange={set("refundShare")}
                  step={0.1}
                  unit={input.refundUnit}
                  onUnitChange={setUnit("refundUnit")}
                  hint="Компенсации гостям за счёт заведения. По практике около 1% от оборота."
                />
                <CalcField
                  label="Штрафы · penalties"
                  suffix="%"
                  value={input.penaltyShare}
                  onChange={set("penaltyShare")}
                  step={0.1}
                  unit={input.penaltyUnit}
                  onUnitChange={setUnit("penaltyUnit")}
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
              label="Средний чек · average check"
              suffix="₽"
              value={input.selfAvgCheck}
              onChange={set("selfAvgCheck")}
              step={50}
              hint="Средний чек заказа на собственной доставке."
            />
            <CalcField
              label="Заказов в день · orders"
              suffix="шт в день"
              value={input.selfOrdersPerDay}
              onChange={set("selfOrdersPerDay")}
              hint="Среднее количество заказов со своих каналов ЗА ОДИН ДЕНЬ, не за месяц. Если знаете месячное число — разделите его на 30."
              note={`≈ ${Math.round((input.selfOrdersPerDay || 0) * 30).toLocaleString("ru-RU")} заказов в месяц`}
            />
          </div>
          <RevenueBadge value={r.self.revenuePerMonth} />

          {!isVat && (
            <>
              <CalcField
                label="Комиссия платформы · commission"
                suffix="%"
                value={input.selfCommission}
                onChange={set("selfCommission")}
                step={0.5}
                unit={input.selfCommissionUnit}
                onUnitChange={setUnit("selfCommissionUnit")}
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
                  onUnitChange={setUnit("serviceFeeUnit")}
                  hint="Сумма или процент от заказа."
                />
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <CalcField
                  label="Продвижение · ad spend"
                  suffix="%"
                  value={input.selfAdShare}
                  onChange={set("selfAdShare")}
                  step={0.5}
                  unit={input.selfAdUnit}
                  onUnitChange={setUnit("selfAdUnit")}
                  hint="Реклама своих каналов: контекст, таргет, рассылки."
                />
                <CalcField
                  label="Скидки и акции · promo"
                  suffix="%"
                  value={input.selfPromoShare}
                  onChange={set("selfPromoShare")}
                  step={0.5}
                  unit={input.selfPromoUnit}
                  onUnitChange={setUnit("selfPromoUnit")}
                  hint="Промокоды и скидки на своих каналах."
                />
                <CalcField
                  label="Роялти · royalty"
                  suffix="%"
                  value={input.royaltyShare}
                  onChange={set("royaltyShare")}
                  step={0.5}
                  unit={input.royaltyUnit}
                  onUnitChange={setUnit("royaltyUnit")}
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
              label="Фудкост · food cost"
              suffix="%"
              value={input.foodCost}
              onChange={set("foodCost")}
              unit={input.foodCostUnit}
              onUnitChange={setUnit("foodCostUnit")}
              hint="Себестоимость продуктов — в процентах от цены блюда или в рублях на заказ."
            />
            <CalcField
              label="Упаковка · packaging"
              suffix="₽"
              value={input.packaging}
              onChange={set("packaging")}
              step={10}
              hint="Коробки, контейнеры, приборы, пакеты."
            />
            <CalcField
              label="Расходники · supplies"
              suffix="₽"
              value={input.suppliesPerOrder}
              onChange={set("suppliesPerOrder")}
              step={5}
              hint="Перчатки, плёнка, фольга, салфетки на один заказ."
            />
            <CalcField
              label="Списания · write-offs"
              suffix="%"
              value={input.writeOffShare}
              onChange={set("writeOffShare")}
              step={0.5}
              unit={input.writeOffUnit}
              onUnitChange={setUnit("writeOffUnit")}
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
                label="Страховые взносы · payroll tax"
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
                label="Общие расходы · overhead"
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
              label="Постоянные расходы · fixed costs"
              suffix="₽/мес"
              value={input.fixedPerMonth}
              onChange={set("fixedPerMonth")}
              step={5000}
              hint="Прочие расходы на доставку, кроме зарплат и общих расходов ресторана."
            />
            <CalcField
              label="IT-системы · IT costs"
              suffix="₽/мес"
              value={input.itPerMonth}
              onChange={set("itPerMonth")}
              step={1000}
              hint="Касса, POS-система, сайт, техподдержка — в части, относящейся к доставке."
            />
            <CalcField
              label="Амортизация · depreciation"
              suffix="₽/мес"
              value={input.depreciationPerMonth}
              onChange={set("depreciationPerMonth")}
              step={5000}
              hint="Износ оборудования, отнесённый на доставку. Не влияет на EBITDA."
            />
          </div>

          <CalcToggle
            label="Налоговый режим · tax system"
            value={input.taxMode}
            onChange={(v) => setTaxMode(v as TaxMode)}
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
  );
};

export default CalcForm;