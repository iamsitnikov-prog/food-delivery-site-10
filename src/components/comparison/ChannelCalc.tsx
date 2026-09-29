import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

type Model = "service" | "own";
type City = "million" | "big" | "small";

const CITY: { key: City; label: string }[] = [
  { key: "million", label: "Миллионник" },
  { key: "big", label: "От 300 тысяч" },
  { key: "small", label: "Меньше 300 тысяч" },
];

const CHANNELS = [
  {
    slug: "yandex-eda",
    name: "Яндекс Еда",
    note: "максимальный трафик",
    rate: { service: 0.35, own: 0.2 },
    reach: { million: 1, big: 1, small: 1 },
  },
  {
    slug: "kuper",
    name: "Купер",
    note: "витрина внутри доставки продуктов",
    rate: { service: 0.35, own: 0.2 },
    reach: { million: 0.35, big: 0.25, small: 0.1 },
  },
  {
    slug: "chibbis",
    name: "Чиббис",
    note: "низкая ставка, меньше спроса",
    rate: { service: null, own: 0.17 },
    reach: { million: 0.15, big: 0.45, small: 0.75 },
  },
] as const;

const rub = (n: number) =>
  new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(
    Math.round(n),
  );

const Field = ({
  label,
  value,
  onChange,
  suffix,
  min,
  max,
  step = 1,
  note,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix: string;
  min: number;
  max: number;
  step?: number;
  note?: string;
}) => (
  <div>
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[0.9em] font-medium text-cream">{label}</span>
      <span className="font-display text-[1.05em] font-semibold text-brand">
        {rub(value)} {suffix}
      </span>
    </div>
    <input
      type="range"
      aria-label={label}
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(Number(e.target.value))}
      className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-cream/20 accent-brand"
    />
    {note && (
      <p className="mt-1.5 text-[0.8em] leading-snug text-cream-muted">{note}</p>
    )}
  </div>
);

const ChannelCalc = () => {
  const [check, setCheck] = useState(1200);
  const [orders, setOrders] = useState(25);
  const [foodcost, setFoodcost] = useState(35);
  const [model, setModel] = useState<Model>("service");
  const [courierCost, setCourierCost] = useState(150);
  const [city, setCity] = useState<City>("million");

  const revenue = check * orders * 30;

  const rows = useMemo(() => {
    return CHANNELS.map((c) => {
      const rate = model === "service" ? c.rate.service : c.rate.own;
      if (rate === null) {
        return {
          ...c,
          available: false as const,
          profit: 0,
          commission: 0,
          delivery: 0,
          margin: 0,
          chanOrders: 0,
          chanRevenue: 0,
          rate: 0,
        };
      }
      const share = c.reach[city];
      const chanOrders = Math.round(orders * share) * 30;
      const chanRevenue = check * chanOrders;
      const cogs = chanRevenue * (foodcost / 100);
      const commission = chanRevenue * rate;
      const delivery = model === "own" ? chanOrders * courierCost : 0;
      const profit = chanRevenue - cogs - commission - delivery;
      return {
        ...c,
        available: true as const,
        profit,
        commission,
        delivery,
        chanOrders,
        chanRevenue,
        rate,
        margin: chanRevenue > 0 ? (profit / chanRevenue) * 100 : 0,
      };
    });
  }, [check, foodcost, orders, model, courierCost, city]);

  const available = rows.filter((r) => r.available);
  const best = available.length ? Math.max(...available.map((r) => r.profit)) : 0;
  const worst = available.length
    ? Math.min(...available.map((r) => r.profit))
    : 0;
  const spread = best - worst;
  const bestName = available.find((r) => r.profit === best)?.name ?? "";

  return (
    <section className="px-5 pb-11 md:px-14 md:pb-24">
      <h2 className="font-display text-[27px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[48px]">
        посчитайте
        <span className="pl-3 text-muted-foreground">на своих цифрах</span>
      </h2>
      <p className="mt-5 max-w-[660px] leading-snug text-muted-foreground">
        Подвигайте ползунки — увидите, сколько остаётся в кассе за месяц на
        каждом агрегаторе после комиссии, себестоимости и доставки.
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,380px)_1fr]">
        <div className="rounded-[28px] bg-surface p-7 text-cream md:p-8">
          <div className="space-y-7">
            <Field
              label="Средний чек"
              value={check}
              onChange={setCheck}
              suffix="₽"
              min={300}
              max={5000}
              step={50}
            />
            <Field
              label="Заказов в день на Яндекс Еде"
              value={orders}
              onChange={setOrders}
              suffix="шт"
              min={5}
              max={200}
              note={`Выручка за месяц — ${rub(revenue)} ₽. Объём на других площадках подставится по их охвату.`}
            />

            <div>
              <span className="text-[0.9em] font-medium text-cream">
                Размер города
              </span>
              <div className="mt-3 flex flex-wrap gap-2">
                {CITY.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    aria-pressed={city === c.key}
                    onClick={() => setCity(c.key)}
                    className={`rounded-xl px-3.5 py-2.5 text-[0.85em] font-medium transition-colors ${
                      city === c.key
                        ? "bg-brand text-foreground"
                        : "bg-cream/[0.06] text-cream-muted hover:text-cream"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <Field
              label="Себестоимость блюд"
              value={foodcost}
              onChange={setFoodcost}
              suffix="%"
              min={15}
              max={60}
            />

            <div>
              <span className="text-[0.9em] font-medium text-cream">
                Кто везёт заказ
              </span>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {(
                  [
                    ["service", "Курьеры сервиса"],
                    ["own", "Свои курьеры"],
                  ] as const
                ).map(([m, label]) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={model === m}
                    onClick={() => setModel(m)}
                    className={`rounded-xl px-3 py-3 text-[0.88em] font-medium transition-colors ${
                      model === m
                        ? "bg-brand text-foreground"
                        : "bg-cream/[0.06] text-cream-muted hover:text-cream"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {model === "own" && (
              <Field
                label="Стоимость своей доставки"
                value={courierCost}
                onChange={setCourierCost}
                suffix="₽ / заказ"
                min={0}
                max={500}
                step={10}
                note="Зарплата курьера и бензин в пересчёте на один заказ"
              />
            )}
          </div>
        </div>

        <div className="rounded-[28px] bg-surface p-7 text-cream md:p-8">
          <div className="space-y-3">
            {rows.map((r) => {
              const isBest = r.available && r.profit === best;
              const width =
                r.available && best > 0
                  ? Math.max(4, (r.profit / best) * 100)
                  : 0;
              return (
                <div
                  key={r.slug}
                  className={`relative overflow-hidden rounded-2xl p-5 transition-colors ${
                    r.available ? "bg-cream/[0.06]" : "bg-cream/[0.03]"
                  }`}
                >
                  {r.available && (
                    <div
                      aria-hidden
                      className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                        isBest ? "bg-brand" : "bg-cream/[0.07]"
                      }`}
                      style={{ width: `${width}%` }}
                    />
                  )}
                  <div className="relative">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <span
                        className={`font-display text-[1.1em] font-semibold ${
                          isBest ? "text-foreground" : ""
                        }`}
                      >
                        {r.name}
                        <span
                          className={`pl-2.5 text-[0.72em] font-normal ${
                            isBest ? "text-foreground/60" : "text-cream-muted"
                          }`}
                        >
                          {r.note}
                        </span>
                      </span>
                      {r.available ? (
                        <span
                          className={`font-display text-[1.35em] font-semibold tabular-nums ${
                            isBest ? "text-foreground" : ""
                          }`}
                        >
                          {rub(r.profit)} ₽
                        </span>
                      ) : (
                        <span className="text-[0.85em] text-cream-muted">
                          нужны свои курьеры
                        </span>
                      )}
                    </div>
                    {r.available && (
                      <p
                        className={`mt-1.5 text-[0.82em] leading-snug ${
                          isBest ? "text-foreground/70" : "text-cream-muted"
                        }`}
                      >
                        {Math.round(r.chanOrders / 30)} заказов в день ·{" "}
                        {(r.rate * 100).toFixed(0)}% комиссии ={" "}
                        {rub(r.commission)} ₽
                        {r.delivery > 0 && ` · доставка ${rub(r.delivery)} ₽`}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-6 rounded-2xl bg-cream/[0.06] p-5 text-[0.92em] leading-snug">
            {spread > 0 ? (
              <>
                <span className="text-brand">
                  {bestName} даёт на {rub(spread)} ₽ в месяц больше.{" "}
                </span>
                За год разница с самым слабым каналом — {rub(spread * 12)} ₽.
                Дело не в комиссии, а в потоке: ставка Чиббиса ниже, но заказов
                через него приходит меньше, и низкий процент не успевает
                отыграть разницу в объёме.
              </>
            ) : (
              <>
                <span className="text-brand">Каналы сравнялись. </span>
                При таких значениях прибыль совпадает — подвигайте чек и число
                заказов, чтобы увидеть разницу.
              </>
            )}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/kalkulyatory/rentabelnost-zakaza"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3.5 font-medium text-foreground transition-transform hover:-translate-y-0.5"
            >
              подробный расчёт с налогами
              <Icon name="ArrowRight" size={18} />
            </Link>
          </div>
          <p className="mt-4 text-[0.78em] leading-snug text-cream-muted">
            Расчёт приблизительный: без налогов, упаковки и бюджета на
            продвижение. Ставки взяты усреднённые, ваши условия могут отличаться.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ChannelCalc;