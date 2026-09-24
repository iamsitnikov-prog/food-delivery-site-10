import {
  money,
  percent,
  TAX_MODES,
  type CalcInput,
  type CalcResult,
  type ChannelResult,
} from "@/lib/calc";

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

const ChannelLines = ({ c }: { c: ChannelResult }) => (
  <>
    <Line label="Средний чек · average check" value={`${money(c.avgCheck)} ₽`} />
    <Line label="Заказов в день · orders" value={`${money(c.orders)} шт`} />
    <Line label="Выручка в месяц · revenue" value={`${money(c.revenuePerMonth)} ₽`} bold />
    {c.serviceFeeRub > 0 && (
      <Line label="Сервисный сбор · service fee" value={`+${money(c.serviceFeeRub)} ₽`} />
    )}
    {c.serviceFeeRub > 0 && <Line label="Доход с заказа" value={`${money(c.income)} ₽`} bold />}
    {c.commissionRub > 0 && <Line label="Комиссия · commission" value={`−${money(c.commissionRub)} ₽`} />}
    {c.subscriptionRub > 0 && (
      <Line label="Подписка · subscription" value={`−${money(c.subscriptionRub)} ₽`} />
    )}
    {c.deliveryFeeRub > 0 && (
      <Line label="Вызов Яндекс Доставки" value={`−${money(c.deliveryFeeRub)} ₽`} />
    )}
    {c.adRub > 0 && <Line label="Продвижение · ad spend" value={`−${money(c.adRub)} ₽`} />}
    {c.marketingRub > 0 && <Line label="Маркетинг Ultima" value={`−${money(c.marketingRub)} ₽`} />}
    {c.promoRub > 0 && <Line label="Скидки · promo" value={`−${money(c.promoRub)} ₽`} />}
    {c.refundRub > 0 && <Line label="Возвраты · refunds" value={`−${money(c.refundRub)} ₽`} />}
    {c.penaltyRub > 0 && <Line label="Штрафы · penalties" value={`−${money(c.penaltyRub)} ₽`} />}
    <Line label="Придёт на счёт · payout" value={`${money(c.payoutPerOrder)} ₽`} bold top />
    <Line label="Себестоимость · food cost" value={`−${money(c.foodCostRub)} ₽`} />
    <Line label="Упаковка · packaging" value={`−${money(c.packagingRub)} ₽`} />
    {c.suppliesRub > 0 && <Line label="Расходники · supplies" value={`−${money(c.suppliesRub)} ₽`} />}
    {c.writeOffRub > 0 && <Line label="Списания · write-offs" value={`−${money(c.writeOffRub)} ₽`} />}
    {c.royaltyRub > 0 && <Line label="Роялти · royalty" value={`−${money(c.royaltyRub)} ₽`} />}
    <Line label="Остаётся с заказа · profit" value={`${money(c.profitPerOrder)} ₽`} accent top />
    <Line label="Маржинальность · margin" value={percent(c.marginPercent)} />
    <Line label="Валовая прибыль · gross profit" value={`${money(c.profitPerMonth)} ₽`} bold />
  </>
);

const CalcPrint = ({ input, r, title, full = true }: Props) => {
  const today = new Date().toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const taxLabel = TAX_MODES.find((t) => t.value === input.taxMode)?.label || "—";
  const channels = [
    input.aggEnabled ? "агрегатор" : null,
    input.selfEnabled ? "своя доставка" : null,
  ]
    .filter(Boolean)
    .join(" + ");

  return (
    <div id="calc-print" style={{ display: "none", color: DARK, fontSize: 12, lineHeight: 1.35 }}>
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
          {today}
          {channels && ` · ${channels}`} · agregatory
          <span style={{ color: BRAND }}>.pro</span>
        </div>
      </div>

      {input.aggEnabled && (
        <Block head="Канал 1 — агрегатор">
          <ChannelLines c={r.agg} />
        </Block>
      )}

      {input.selfEnabled && (
        <Block head={input.aggEnabled ? "Канал 2 — собственная доставка" : "Собственная доставка"}>
          <ChannelLines c={r.self} />
        </Block>
      )}

      {r.bothChannels && (
        <Block head="Итого по каналам">
          <Line label="Заказов в день" value={`${money(r.ordersPerDay)} шт`} />
          <Line label="Средний чек" value={`${money(r.avgCheck)} ₽`} />
          <Line label="Выручка · revenue" value={`${money(r.revenuePerMonth)} ₽`} bold />
          <Line label="Поступит на счёт" value={`${money(r.payoutPerMonth)} ₽`} />
          <Line label="Валовая прибыль · gross profit" value={`${money(r.grossProfitPerMonth)} ₽`} accent top />
          <Line label="Средняя маржинальность" value={percent(r.marginPercent)} />
        </Block>
      )}

      <Block head="Продвижение">
        <Line label="ДРР — доля рекламных расходов" value={percent(r.drr)} bold />
        {r.bothChannels && <Line label="ДРР агрегатора" value={percent(r.agg.drr)} />}
        {r.bothChannels && <Line label="ДРР своей доставки" value={percent(r.self.drr)} />}
        <Line label="Предельный ДРР при вашей марже" value={percent(r.drrLimit)} />
        <Line label="Расходы на рекламу · ad spend" value={`${money(r.adSpendPerMonth)} ₽`} />
        <Line label="ROMI · возврат на маркетинг" value={percent(r.romi, 0)} />
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
        <Line label="Выручка · revenue" value={`${money(r.revenuePerMonth)} ₽`} />
        <Line label="Валовая прибыль · gross profit" value={`${money(r.grossProfitPerMonth)} ₽`} bold />
        {full ? (
          <>
            {r.staffTotal > 0 && (
              <Line label="Персонал · payroll" value={`−${money(r.staffTotal)} ₽`} />
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
              <Line label="Амортизация · depreciation" value={`−${money(r.depreciationCost)} ₽`} />
            )}
            <Line label="Прибыль до налогов" value={`${money(r.profitBeforeTax)} ₽`} />
            <Line label={`${r.taxLabel} (${taxLabel})`} value={`−${money(r.taxAmount)} ₽`} />
            <Line label="Чистая прибыль · net profit" value={`${money(r.netProfitPerMonth)} ₽`} accent top />
            <Line label="Рентабельность · net margin" value={percent(r.netMarginPercent)} />
            {r.breakEvenOrders > 0 && (
              <Line
                label="Заказов в день для выхода в ноль"
                value={`${money(r.breakEvenOrders)} шт`}
              />
            )}
          </>
        ) : (
          <Line label="Маржинальность" value={percent(r.marginPercent)} accent top />
        )}
      </Block>

      {full && (
        <Block head="НДС при работе на УСН">
          <Line label="Выручка за год · annual revenue" value={`${money(r.revenuePerYear)} ₽`} />
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
            Расчёт учитывает только удержания каналов и себестоимость заказа. Зарплаты, аренда и
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
