import { Link } from "react-router-dom";
import { HOME_PLANS } from "@/data/home";
import { PAY_PRODUCTS, formatRub } from "@/data/payments";

// Таблица вверху /uslugi: два тарифа и три разовые услуги (17.10.2026).
// Направления на страницах услуг входят в тарифы и отдельно не продаются.

export const PRICE_ROWS = [
  ...HOME_PLANS.map((p) => ({
    name: `Тариф «${p.name}»`,
    kind: p.tag,
    price: p.price,
    period: "в месяц за 1 точку",
    to: "/#pricing",
  })),
  ...PAY_PRODUCTS.map((p) => ({
    name: p.short.charAt(0).toUpperCase() + p.short.slice(1),
    kind: p.note,
    price: formatRub(p.price),
    period: "разово",
    to: `/oplata?usluga=${p.code}`,
  })),
];

export const PRICE_NOTE =
  "Все направления ниже входят в тарифы сопровождения, отдельно мы их не продаём. Консультацию, аудит и курс для команды можно заказать без тарифа. Для сетей от 2 точек условия по коммерческому предложению.";

const PriceTable = () => (
  <section className="px-5 pb-10 md:px-14 md:pb-16">
    <h2 className="font-display text-[1.6em] font-semibold tracking-[-0.02em] md:text-[2.2em]">сколько стоит</h2>
    <div className="mt-5 overflow-x-auto rounded-[24px] bg-surface text-cream">
      <table className="w-full text-left text-[max(12px,0.95em)]">
        <thead className="text-cream-muted">
          <tr>
            <th scope="col" className="px-5 py-4 font-medium md:px-7">Что</th>
            <th scope="col" className="hidden px-5 py-4 font-medium md:table-cell">Для кого</th>
            <th scope="col" className="px-5 py-4 font-medium md:px-7">Цена</th>
          </tr>
        </thead>
        <tbody>
          {PRICE_ROWS.map((r) => (
            <tr key={r.name} className="border-t border-cream/10">
              <td className="px-5 py-4 font-semibold md:px-7">
                <Link to={r.to} className="hover:text-brand">
                  {r.name}
                </Link>
                <span className="mt-1 block text-[0.92em] font-normal leading-snug text-cream-muted md:hidden">{r.kind}</span>
              </td>
              <td className="hidden px-5 py-4 text-cream-muted md:table-cell">{r.kind}</td>
              <td className="px-5 py-4 text-right align-top md:px-7 md:text-left">
                <span className="block whitespace-nowrap font-display font-semibold text-brand md:inline">{r.price}</span>{" "}
                <span className="text-[0.9em] text-cream-muted">{r.period}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className="mt-4 max-w-[760px] leading-snug text-muted-foreground">{PRICE_NOTE}</p>
  </section>
);

export default PriceTable;
