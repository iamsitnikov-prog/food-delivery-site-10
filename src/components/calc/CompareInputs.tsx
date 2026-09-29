import Icon from "@/components/ui/icon";
import CalcField from "./CalcField";
import CalcToggle from "./CalcToggle";
import CalcCheck from "./CalcCheck";
import { money, type CompareInput, type CompareResult, type OwnMode } from "@/lib/compare";

type Props = {
  input: CompareInput;
  r: CompareResult;
  set: (key: keyof CompareInput) => (v: number) => void;
  flag: (key: keyof CompareInput) => (v: boolean) => void;
  onOwnMode: (v: OwnMode) => void;
  onYandexKnowOrders: (v: number) => void;
};

const CompareInputs = ({ input, r, set, flag, onOwnMode, onYandexKnowOrders }: Props) => {
  const isStaff = input.ownMode === "staff";

  return (
    <div className="mt-6 space-y-5">
      <div className="grid gap-3 md:gap-4 sm:grid-cols-2">
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

      <div className="rounded-2xl border border-cream/15 p-4 md:p-5">
        <p className="flex items-center gap-2 text-[0.95em] font-semibold text-cream">
          <Icon name="Truck" size={16} className="text-brand" />
          Модель 1 — курьеры сервиса
        </p>
        <div className="mt-4 grid gap-3 md:gap-4 sm:grid-cols-2">
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

      <div className="rounded-2xl border border-cream/15 p-4 md:p-5">
        <p className="flex items-center gap-2 text-[0.95em] font-semibold text-cream">
          <Icon name="Bike" size={16} className="text-brand" />
          Модель 2 — своя доставка
        </p>

        <div className="mt-4 space-y-4">
          <div className="grid gap-3 md:gap-4 sm:grid-cols-2">
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
            onChange={(v) => onOwnMode(v as OwnMode)}
            options={[
              { value: "staff" as OwnMode, label: "Свои курьеры в штате" },
              { value: "yandex" as OwnMode, label: "Курьер Яндекс Доставки" },
            ]}
            hint="Свои курьеры — фиксированная зарплата. Яндекс Доставка — оплата за каждый заказ."
          />

          {isStaff && (
            <>
              <div className="grid gap-3 md:gap-4 sm:grid-cols-2">
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
                onChange={onYandexKnowOrders}
                options={[
                  { value: 1, label: "Заказы и сумма" },
                  { value: 0, label: "Только сумма" },
                ]}
                hint="Данные берутся из отчёта Яндекс Доставки за месяц."
              />

              <div className="grid gap-3 md:gap-4 sm:grid-cols-2">
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

      <div className="rounded-2xl border border-cream/15 p-4 md:p-5">
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
            <div className="grid gap-3 md:gap-4 sm:grid-cols-2">
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
              Чтобы посчитать гибрид точно, переключите модель 2 на Яндекс Доставку и укажите её
              стоимость — она подставится сюда. Сейчас: {money(r.yandexPerOrder)} ₽ за заказ.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-cream/15 p-4 md:p-5">
        <p className="flex items-center gap-2 text-[0.95em] font-semibold text-cream">
          <Icon name="ChefHat" size={16} className="text-brand" />
          Себестоимость заказа
        </p>
        <div className="mt-4 grid gap-3 md:gap-4 sm:grid-cols-2">
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
  );
};

export default CompareInputs;
