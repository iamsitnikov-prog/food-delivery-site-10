import Icon from "@/components/ui/icon";
import CompareRow from "./CompareRow";
import { money, percent, type ModelResult } from "@/lib/compare";

const CompareModelCard = ({
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
        <span className="rounded-lg bg-brand px-2 py-0.5 text-[max(12px,0.72em)] font-bold uppercase tracking-wide text-foreground">
          выгоднее
        </span>
      )}
    </div>
    {m.note && <p className="mt-1.5 text-[max(12px,0.85em)] leading-snug text-cream-muted">{m.note}</p>}
    <div className="mt-3">
      <CompareRow label="Комиссия · commission" value={`−${money(m.commissionRub)} ₽`} muted />
      {m.deliveryFeeRub > 0 && (
        <CompareRow label="Кнопка Яндекс Доставки" value={`−${money(m.deliveryFeeRub)} ₽`} muted />
      )}
      <CompareRow label="Продвижение · ad spend" value={`−${money(m.adRub)} ₽`} muted />
      {!compact && (
        <>
          <CompareRow label="Придёт на счёт · payout" value={`${money(m.payoutPerOrder)} ₽`} />
          <CompareRow
            label="Себестоимость · food cost"
            value={`−${money(m.foodCostRub)} ₽`}
            muted
          />
          <CompareRow label="Упаковка · packaging" value={`−${money(m.packagingRub)} ₽`} muted />
        </>
      )}
      <CompareRow label="Валовая с заказа" value={`${money(m.grossPerOrder)} ₽`} strong />
      <CompareRow label="Валовая за месяц" value={`${money(m.grossPerMonth)} ₽`} muted />
      {m.staffCost > 0 && (
        <CompareRow label="Свои курьеры" value={`−${money(m.staffCost)} ₽`} muted />
      )}
      {m.yandexCost > 0 && (
        <CompareRow label="Яндекс Доставка" value={`−${money(m.yandexCost)} ₽`} muted />
      )}
      {m.deliveryCostPerOrder > 0 && (
        <CompareRow label="Доставка на заказ" value={`−${money(m.deliveryCostPerOrder)} ₽`} muted />
      )}
      {m.paidDeliveryIncome > 0 && (
        <CompareRow
          label="Платные доставки в кассу"
          value={`+${money(m.paidDeliveryIncome)} ₽`}
          muted
        />
      )}
      <CompareRow label="Прибыль за месяц" value={`${money(m.profitPerMonth)} ₽`} accent strong />
      <CompareRow label="Маржинальность · margin" value={percent(m.marginPercent)} />
    </div>
  </div>
);

export default CompareModelCard;
