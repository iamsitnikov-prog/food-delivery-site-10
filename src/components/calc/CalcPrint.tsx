import { money, percent, TAX_MODES, type CalcInput, type CalcResult } from "@/lib/calc";

type Props = {
  input: CalcInput;
  r: CalcResult;
  title: string;
  full?: boolean;
};

const DARK = "#23100B";
const BRAND = "#FFD900";
const CREAM = "#FFFAF5";
const LINE = "#E6DFD9";

const Line = ({
  label,
  value,
  bold,
  top,
  accent,
}: {
  label: string;
  value: string;
  bold?: boolean;
  top?: boolean;
  accent?: boolean;
}) => (
  <tr>
    <td
      style={{
        padding: accent ? "8px 10px" : "6px 10px",
        borderTop: top ? `1.5px solid ${DARK}` : `1px solid ${LINE}`,
        fontWeight: bold || accent ? 700 : 400,
        background: accent ? BRAND : "transparent",
        borderRadius: accent ? "6px 0 0 6px" : 0,
      }}
    >
      {label}
    </td>
    <td
      style={{
        padding: accent ? "8px 10px" : "6px 10px",
        borderTop: top ? `1.5px solid ${DARK}` : `1px solid ${LINE}`,
        textAlign: "right",
        whiteSpace: "nowrap",
        fontWeight: bold || accent ? 700 : 400,
        fontSize: accent ? 13 : 12,
        background: accent ? BRAND : "transparent",
        borderRadius: accent ? "0 6px 6px 0" : 0,
      }}
    >
      {value}
    </td>
  </tr>
);

const Block = ({ head, children }: { head: string; children: React.ReactNode }) => (
  <div style={{ marginTop: 16, breakInside: "avoid" }}>
    <h2
      style={{
        fontSize: 11,
        margin: "0 0 4px",
        padding: "5px 10px",
        textTransform: "uppercase",
        letterSpacing: 0.6,
        background: DARK,
        color: CREAM,
        borderRadius: 6,
        fontWeight: 700,
      }}
    >
      {head}
    </h2>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
      <tbody>{children}</tbody>
    </table>
  </div>
);

const CalcPrint = ({ input, r, title, full = true }: Props) => {
  const today = new Date().toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const taxLabel = TAX_MODES.find((t) => t.value === input.taxMode)?.label || "—";
  const isAgg = input.channel === "aggregator";

  return (
    <div
      id="calc-print"
      style={{ display: "none", color: DARK, fontSize: 12, lineHeight: 1.35 }}
    >
      <div
        style={{
          background: DARK,
          color: CREAM,
          borderRadius: 12,
          padding: "16px 18px",
          marginBottom: 4,
        }}
      >
        <div style={{ fontSize: 21, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1.15 }}>
          {title}
        </div>
        <div style={{ fontSize: 10.5, marginTop: 5, color: "#BBB5B4" }}>
          {today} · канал: {isAgg ? "агрегатор" : "своя доставка"} · agregatory
          <span style={{ color: BRAND }}>.pro</span>
        </div>
      </div>

      <Block head="Исходные данные">
        <Line label="Средний чек" value={`${money(input.avgCheck)} ₽`} />
        <Line label="Заказов в день" value={`${money(input.ordersPerDay)} шт`} />
        {isAgg ? (
          <>
            <Line
              label="Доставка"
              value={input.deliveryType === "service" ? "курьеры сервиса" : "свои курьеры"}
            />
            <Line label="Комиссия сервиса" value={percent(input.commission)} />
            {input.subscriptionShare > 0 && (
              <Line label="Подписка сервиса" value={percent(input.subscriptionShare)} />
            )}
            {input.deliveryType === "own" && input.useYandexDelivery && (
              <Line label="Вызов Яндекс Доставки" value="2%" />
            )}
            {input.marketingShare > 0 && (
              <Line label="Маркетинг Ultima" value={percent(input.marketingShare)} />
            )}
          </>
        ) : (
          <Line
            label="Комиссия платформы"
            value={input.selfCommission > 0 ? percent(input.selfCommission) : "нет"}
          />
        )}
        {input.serviceFeeEnabled && (
          <Line label="Сервисный сбор с гостя" value={`${money(r.serviceFeeRub)} ₽`} />
        )}
        {input.deliveryPriceEnabled && (
          <Line
            label="Платная доставка для гостя"
            value={`${money(input.deliveryPrice)} ₽ — ${
              input.deliveryPriceOwner === "restaurant" ? "в кассу" : "курьеру"
            }`}
          />
        )}
        <Line label="Продвижение (CPA, буст)" value={percent(input.adShare)} />
        {input.promoShare > 0 && <Line label="Скидки и акции" value={percent(input.promoShare)} />}
        <Line label="Возвраты за счёт ресторана" value={percent(input.refundShare)} />
        {isAgg && <Line label="Штрафы и удержания" value={percent(input.penaltyShare)} />}
        <Line label="Фудкост" value={percent(input.foodCost)} />
        <Line label="Упаковка на заказ" value={`${money(input.packaging)} ₽`} />
        {input.suppliesPerOrder > 0 && (
          <Line label="Расходные материалы" value={`${money(input.suppliesPerOrder)} ₽`} />
        )}
        {input.royaltyShare > 0 && (
          <Line label="Роялти по франшизе" value={percent(input.royaltyShare)} />
        )}
        {full && input.fixedPerMonth > 0 && (
          <Line label="Постоянные расходы" value={`${money(input.fixedPerMonth)} ₽/мес`} />
        )}
        {full && <Line label="Система налогообложения" value={taxLabel} />}
      </Block>

      <Block head={isAgg ? "Что удерживает сервис (с заказа)" : "Расходы канала (с заказа)"}>
        <Line label="Средний чек" value={`${money(input.avgCheck)} ₽`} />
        {r.serviceFeeRub > 0 && (
          <Line label="Сервисный сбор с гостя" value={`+${money(r.serviceFeeRub)} ₽`} />
        )}
        {r.deliveryPriceRub > 0 && (
          <Line
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
          />
        )}
        {r.restaurantIncome !== input.avgCheck && (
          <Line label="Доход ресторана с заказа" value={`${money(r.restaurantIncome)} ₽`} bold />
        )}
        {r.commissionRub > 0 && (
          <Line
            label={isAgg ? "Комиссия сервиса" : "Комиссия платформы"}
            value={`−${money(r.commissionRub)} ₽`}
          />
        )}
        {r.subscriptionRub > 0 && (
          <Line label="Подписка сервиса" value={`−${money(r.subscriptionRub)} ₽`} />
        )}
        {r.deliveryFeeRub > 0 && (
          <Line label="Вызов Яндекс Доставки" value={`−${money(r.deliveryFeeRub)} ₽`} />
        )}
        <Line label="Продвижение" value={`−${money(r.adRub)} ₽`} />
        {r.marketingRub > 0 && (
          <Line label="Маркетинг Ultima" value={`−${money(r.marketingRub)} ₽`} />
        )}
        {r.promoRub > 0 && <Line label="Скидки и акции" value={`−${money(r.promoRub)} ₽`} />}
        <Line label="Возвраты гостям" value={`−${money(r.refundRub)} ₽`} />
        {r.penaltyRub > 0 && (
          <Line label="Штрафы и удержания" value={`−${money(r.penaltyRub)} ₽`} />
        )}
        <Line label="Придёт на счёт с заказа" value={`${money(r.payoutPerOrder)} ₽`} accent top />
        <Line label="Доля от дохода с заказа" value={percent(r.payoutPercent)} />
      </Block>

      <Block head="Рентабельность заказа">
        <Line label="Поступило на счёт" value={`${money(r.payoutPerOrder)} ₽`} />
        <Line label="Себестоимость блюд" value={`−${money(r.foodCostRub)} ₽`} />
        <Line label="Упаковка" value={`−${money(r.packagingRub)} ₽`} />
        {r.suppliesRub > 0 && (
          <Line label="Расходные материалы" value={`−${money(r.suppliesRub)} ₽`} />
        )}
        {r.writeOffRub > 0 && (
          <Line label="Списания продуктов" value={`−${money(r.writeOffRub)} ₽`} />
        )}
        {r.royaltyRub > 0 && <Line label="Роялти" value={`−${money(r.royaltyRub)} ₽`} />}
        <Line label="Остаётся с заказа" value={`${money(r.profitPerOrder)} ₽`} accent top />
        <Line label="Маржинальность" value={percent(r.marginPercent)} />
      </Block>

      <Block head="Продвижение">
        <Line label="ДРР — доля рекламных расходов" value={percent(r.drr)} bold />
        <Line label="Предельный ДРР при вашей марже" value={percent(r.drrLimit)} />
        <Line label="Расходы на рекламу в месяц" value={`${money(r.adSpendPerMonth)} ₽`} />
      </Block>

      {full && input.staffEnabled && (
        <Block head="Персонал доставки (в месяц)">
          {r.managersCost > 0 && (
            <Line
              label={`Менеджеры — ${money(input.managerCount)} чел`}
              value={`${money(r.managersCost)} ₽`}
            />
          )}
          {r.couriersCost > 0 && (
            <Line
              label={`Курьеры — ${money(input.courierCount)} чел`}
              value={`${money(r.couriersCost)} ₽`}
            />
          )}
          {r.fuelCost > 0 && <Line label="Компенсация топлива" value={`${money(r.fuelCost)} ₽`} />}
          {r.packersCost > 0 && (
            <Line
              label={`Сборщики — ${money(input.packerCount)} чел`}
              value={`${money(r.packersCost)} ₽`}
            />
          )}
          <Line
            label={`Страховые взносы (${percent(input.insuranceRate)})`}
            value={`${money(r.insuranceCost)} ₽`}
          />
          <Line label="Всего на персонал" value={`${money(r.staffTotal)} ₽`} bold top />
          <Line label="В пересчёте на заказ" value={`${money(r.staffPerOrder)} ₽`} />
        </Block>
      )}

      <Block head="Итоги за месяц">
        <Line label="Оборот" value={`${money(r.revenuePerMonth)} ₽`} />
        <Line label="Поступит на счёт" value={`${money(r.payoutPerMonth)} ₽`} />
        {full ? (
          <>
            {r.staffTotal > 0 && (
              <Line label="Персонал доставки" value={`−${money(r.staffTotal)} ₽`} />
            )}
            {r.overheadCost > 0 && (
              <Line
                label={`Доля общих расходов (${percent(input.overheadShare)})`}
                value={`−${money(r.overheadCost)} ₽`}
              />
            )}
            {input.fixedPerMonth > 0 && (
              <Line label="Постоянные расходы" value={`−${money(input.fixedPerMonth)} ₽`} />
            )}
            {r.itCost > 0 && <Line label="IT-системы" value={`−${money(r.itCost)} ₽`} />}
            <Line label="EBITDA" value={`${money(r.ebitda)} ₽`} bold top />
            {r.depreciationCost > 0 && (
              <Line label="Амортизация" value={`−${money(r.depreciationCost)} ₽`} />
            )}
            <Line label="Прибыль до налогов" value={`${money(r.profitBeforeTax)} ₽`} />
            <Line label={r.taxLabel} value={`−${money(r.taxAmount)} ₽`} />
            <Line label="Чистая прибыль" value={`${money(r.netProfitPerMonth)} ₽`} accent top />
            <Line label="Чистая рентабельность" value={percent(r.netMarginPercent)} />
            {r.breakEvenOrders > 0 && (
              <Line
                label="Заказов в день для выхода в ноль"
                value={`${money(r.breakEvenOrders)} шт`}
              />
            )}
          </>
        ) : (
          <>
            <Line label="Прибыль с заказов" value={`${money(r.profitPerDay * 30)} ₽`} accent top />
            <Line label="Маржинальность" value={percent(r.marginPercent)} />
          </>
        )}
      </Block>

      {full && (
        <Block head="НДС при работе на УСН">
          <Line label="Оборот за год" value={`${money(r.revenuePerYear)} ₽`} />
          <Line label="Ставка НДС" value={r.vat.label} bold />
          {r.vat.rate > 0 && <Line label="НДС за год" value={`${money(r.vatAmountPerYear)} ₽`} />}
        </Block>
      )}

      <div
        style={{
          marginTop: 14,
          padding: "10px 12px",
          background: "#FBF6F1",
          borderLeft: `3px solid ${BRAND}`,
          borderRadius: 6,
          fontSize: 10,
          lineHeight: 1.45,
          breakInside: "avoid",
        }}
      >
        {full && (
          <p style={{ margin: "0 0 4px" }}>
            <b>Важно:</b> в доход для налогообложения засчитывается вся сумма заказа, оплаченная
            гостем, а не деньги, поступившие на счёт после удержания комиссии.
          </p>
        )}
        {!full && (
          <p style={{ margin: "0 0 4px" }}>
            Расчёт учитывает только удержания канала и себестоимость заказа. Зарплаты, аренда и
            налоги в нём не участвуют — для полной картины используйте калькулятор экономики
            доставки.
          </p>
        )}
        <p style={{ margin: 0 }}>
          Расчёт носит справочный характер и не заменяет консультацию бухгалтера.
        </p>
      </div>

      <div
        style={{
          marginTop: 14,
          background: DARK,
          color: CREAM,
          borderRadius: 12,
          padding: "14px 18px",
          breakInside: "avoid",
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.3 }}>
          agregatory<span style={{ color: BRAND }}>.pro</span>
        </div>
        <div style={{ fontSize: 10.5, marginTop: 3, color: "#BBB5B4" }}>
          Продвижение ресторанов на агрегаторах доставки
        </div>
        <div
          style={{
            marginTop: 9,
            paddingTop: 9,
            borderTop: "1px solid rgba(255,250,245,.18)",
            fontSize: 11,
          }}
        >
          <span style={{ color: BRAND, fontWeight: 700 }}>Бесплатный разбор вашего проекта</span>
          <br />
          <span style={{ fontSize: 10.5 }}>
            +7 931 002-82-22 · Telegram @sitnikovy · agregatory.pro
          </span>
        </div>
      </div>
    </div>
  );
};

export default CalcPrint;
