import { money, percent, TAX_MODES, type CalcInput, type CalcResult } from "@/lib/calc";

type Props = {
  input: CalcInput;
  r: CalcResult;
  title: string;
};

const Line = ({
  label,
  value,
  bold,
  top,
}: {
  label: string;
  value: string;
  bold?: boolean;
  top?: boolean;
}) => (
  <tr>
    <td
      style={{
        padding: "5px 0",
        borderTop: top ? "1.5px solid #111" : "1px solid #ddd",
        fontWeight: bold ? 700 : 400,
      }}
    >
      {label}
    </td>
    <td
      style={{
        padding: "5px 0",
        borderTop: top ? "1.5px solid #111" : "1px solid #ddd",
        textAlign: "right",
        whiteSpace: "nowrap",
        fontWeight: bold ? 700 : 400,
      }}
    >
      {value}
    </td>
  </tr>
);

const Block = ({ head, children }: { head: string; children: React.ReactNode }) => (
  <div style={{ marginTop: 18, breakInside: "avoid" }}>
    <h2 style={{ fontSize: 13, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: 0.4 }}>
      {head}
    </h2>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
      <tbody>{children}</tbody>
    </table>
  </div>
);

const CalcPrint = ({ input, r, title }: Props) => {
  const today = new Date().toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const taxLabel = TAX_MODES.find((t) => t.value === input.taxMode)?.label || "—";

  return (
    <div id="calc-print" style={{ display: "none", color: "#111", fontSize: 12 }}>
      <div style={{ borderBottom: "2px solid #111", paddingBottom: 10, marginBottom: 6 }}>
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.5 }}>{title}</div>
        <div style={{ fontSize: 11, marginTop: 4 }}>
          Расчёт от {today} · agregatory.pro
        </div>
      </div>

      <Block head="Исходные данные">
        <Line label="Средний чек" value={`${money(input.avgCheck)} ₽`} />
        <Line label="Заказов в день" value={`${money(input.ordersPerDay)} шт`} />
        <Line
          label="Доставка"
          value={input.deliveryType === "service" ? "курьеры сервиса" : "свои курьеры"}
        />
        <Line label="Комиссия сервиса" value={percent(input.commission)} />
        {input.deliveryType === "own" && input.useYandexDelivery && (
          <Line label="Вызов Яндекс Доставки" value="2%" />
        )}
        {input.marketingShare > 0 && (
          <Line label="Маркетинг Ultima" value={percent(input.marketingShare)} />
        )}
        <Line label="Продвижение (CPA, буст)" value={percent(input.adShare)} />
        {input.promoShare > 0 && <Line label="Скидки и акции" value={percent(input.promoShare)} />}
        <Line label="Возвраты за счёт ресторана" value={percent(input.refundShare)} />
        <Line label="Штрафы и удержания" value={percent(input.penaltyShare)} />
        <Line label="Фудкост" value={percent(input.foodCost)} />
        <Line label="Упаковка на заказ" value={`${money(input.packaging)} ₽`} />
        {input.fixedPerMonth > 0 && (
          <Line label="Постоянные расходы" value={`${money(input.fixedPerMonth)} ₽/мес`} />
        )}
        <Line label="Система налогообложения" value={taxLabel} />
      </Block>

      <Block head="Что удерживает сервис (с одного заказа)">
        <Line label="Средний чек" value={`${money(input.avgCheck)} ₽`} />
        <Line label="Комиссия сервиса" value={`−${money(r.commissionRub)} ₽`} />
        {r.deliveryFeeRub > 0 && (
          <Line label="Вызов Яндекс Доставки" value={`−${money(r.deliveryFeeRub)} ₽`} />
        )}
        <Line label="Продвижение" value={`−${money(r.adRub)} ₽`} />
        {r.marketingRub > 0 && (
          <Line label="Маркетинг Ultima" value={`−${money(r.marketingRub)} ₽`} />
        )}
        {r.promoRub > 0 && <Line label="Скидки и акции" value={`−${money(r.promoRub)} ₽`} />}
        <Line label="Возвраты гостям" value={`−${money(r.refundRub)} ₽`} />
        <Line label="Штрафы и удержания" value={`−${money(r.penaltyRub)} ₽`} />
        <Line label="Придёт на счёт с заказа" value={`${money(r.payoutPerOrder)} ₽`} bold top />
        <Line label="Доля от суммы заказа" value={percent(r.payoutPercent)} />
      </Block>

      <Block head="Рентабельность заказа">
        <Line label="Поступило на счёт" value={`${money(r.payoutPerOrder)} ₽`} />
        <Line label="Себестоимость блюд" value={`−${money(r.foodCostRub)} ₽`} />
        <Line label="Упаковка" value={`−${money(r.packagingRub)} ₽`} />
        <Line label="Остаётся с заказа" value={`${money(r.profitPerOrder)} ₽`} bold top />
        <Line label="Маржинальность" value={percent(r.marginPercent)} />
      </Block>

      <Block head="Продвижение">
        <Line label="ДРР — доля рекламных расходов" value={percent(r.drr)} bold />
        <Line label="Предельный ДРР при вашей марже" value={percent(r.drrLimit)} />
        <Line label="Расходы на рекламу в месяц" value={`${money(r.adSpendPerMonth)} ₽`} />
      </Block>

      {input.staffEnabled && (
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
        {r.staffTotal > 0 && (
          <Line label="Персонал доставки" value={`−${money(r.staffTotal)} ₽`} />
        )}
        {input.fixedPerMonth > 0 && (
          <Line label="Постоянные расходы" value={`−${money(input.fixedPerMonth)} ₽`} />
        )}
        <Line label="Прибыль до налогов" value={`${money(r.profitBeforeTax)} ₽`} top />
        <Line label={r.taxLabel} value={`−${money(r.taxAmount)} ₽`} />
        <Line label="Чистая прибыль" value={`${money(r.netProfitPerMonth)} ₽`} bold top />
        <Line label="Чистая рентабельность" value={percent(r.netMarginPercent)} />
        {r.breakEvenOrders > 0 && (
          <Line label="Заказов в день для выхода в ноль" value={`${money(r.breakEvenOrders)} шт`} />
        )}
      </Block>

      <Block head="НДС при работе на УСН">
        <Line label="Оборот за год" value={`${money(r.revenuePerYear)} ₽`} />
        <Line label="Ставка НДС" value={r.vat.label} bold />
        {r.vat.rate > 0 && <Line label="НДС за год" value={`${money(r.vatAmountPerYear)} ₽`} />}
      </Block>

      <div style={{ marginTop: 14, fontSize: 10.5, lineHeight: 1.45, breakInside: "avoid" }}>
        <p style={{ margin: "0 0 4px" }}>
          <b>Важно:</b> в доход для налогообложения засчитывается вся сумма заказа, оплаченная
          гостем, а не деньги, поступившие на счёт после удержания комиссии.
        </p>
        <p style={{ margin: 0 }}>
          Расчёт носит справочный характер и не заменяет консультацию бухгалтера.
        </p>
      </div>

      <div
        style={{
          marginTop: 16,
          paddingTop: 10,
          borderTop: "2px solid #111",
          fontSize: 11,
          breakInside: "avoid",
        }}
      >
        <b>agregatory.pro</b> — продвижение ресторанов на агрегаторах доставки
        <br />
        Бесплатный разбор вашего проекта: +7 931 002-82-22 · Telegram @sitnikovy
      </div>
    </div>
  );
};

export default CalcPrint;
