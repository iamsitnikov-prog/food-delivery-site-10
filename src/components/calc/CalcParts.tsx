import Icon from "@/components/ui/icon";
import { money, percent, type ChannelResult } from "@/lib/calc";

export const Row = ({
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

export const Card = ({
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

export const Section = ({
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

export const RevenueBadge = ({ value }: { value: number }) => (
  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-xl bg-brand/12 px-4 py-3">
    <span className="text-[0.88em] text-cream-muted">Выручка · revenue в месяц</span>
    <span className="font-display text-[1.15em] font-semibold tabular-nums text-brand">
      {money(value)} ₽
    </span>
  </div>
);

export const ChannelBlock = ({ c, title }: { c: ChannelResult; title: string }) => (
  <>
    <Row label="Средний чек · average check" value={`${money(c.avgCheck)} ₽`} muted />
    <Row label="Заказов в день · orders" value={`${money(c.orders)} шт`} muted />
    <Row label="Выручка в месяц · revenue" value={`${money(c.revenuePerMonth)} ₽`} />
    {c.serviceFeeRub > 0 && (
      <Row label="Сервисный сбор · service fee" value={`+${money(c.serviceFeeRub)} ₽`} muted />
    )}
    {c.serviceFeeRub > 0 && <Row label="Доход с заказа" value={`${money(c.income)} ₽`} />}
    {c.commissionRub > 0 && (
      <Row label="Комиссия · commission" value={`−${money(c.commissionRub)} ₽`} muted />
    )}
    {c.subscriptionRub > 0 && (
      <Row label="Подписка · subscription" value={`−${money(c.subscriptionRub)} ₽`} muted />
    )}
    {c.deliveryFeeRub > 0 && (
      <Row label="Вызов Яндекс Доставки" value={`−${money(c.deliveryFeeRub)} ₽`} muted />
    )}
    {c.adRub > 0 && <Row label="Продвижение · ad spend" value={`−${money(c.adRub)} ₽`} muted />}
    {c.marketingRub > 0 && (
      <Row label="Маркетинг Ultima" value={`−${money(c.marketingRub)} ₽`} muted />
    )}
    {c.promoRub > 0 && (
      <Row label="Скидки и акции · promo" value={`−${money(c.promoRub)} ₽`} muted />
    )}
    {c.refundRub > 0 && <Row label="Возвраты · refunds" value={`−${money(c.refundRub)} ₽`} muted />}
    {c.penaltyRub > 0 && (
      <Row label="Штрафы · penalties" value={`−${money(c.penaltyRub)} ₽`} muted />
    )}
    <Row label="Придёт на счёт · payout" value={`${money(c.payoutPerOrder)} ₽`} accent strong />
    <Row label="Доля от дохода" value={percent(c.payoutPercent)} />
    <Row label="Себестоимость · food cost" value={`−${money(c.foodCostRub)} ₽`} muted />
    <Row label="Упаковка · packaging" value={`−${money(c.packagingRub)} ₽`} muted />
    {c.suppliesRub > 0 && (
      <Row label="Расходники · supplies" value={`−${money(c.suppliesRub)} ₽`} muted />
    )}
    {c.writeOffRub > 0 && (
      <Row label="Списания · write-offs" value={`−${money(c.writeOffRub)} ₽`} muted />
    )}
    {c.royaltyRub > 0 && <Row label="Роялти · royalty" value={`−${money(c.royaltyRub)} ₽`} muted />}
    <Row
      label={`Остаётся с заказа — ${title}`}
      value={`${money(c.profitPerOrder)} ₽`}
      accent
      strong
    />
    <Row label="Маржинальность · margin" value={percent(c.marginPercent)} />
    <Row label="Валовая прибыль · gross profit" value={`${money(c.profitPerMonth)} ₽`} />
  </>
);
