import { useMemo, useState } from "react";
import Icon from "@/components/ui/icon";

const STARTER_URL =
  "https://www.starterapp.ru/?utm_source=partners&utm_medium=sitnikov";

type Model = "service" | "own";

const CHANNELS = [
  {
    slug: "yandex-eda",
    name: "Яндекс Еда",
    note: "максимальный трафик",
    rate: { service: 0.35, own: 0.2 },
    needsOwnCourier: false,
    fee: 0,
  },
  {
    slug: "kuper",
    name: "Купер",
    note: "второй канал",
    rate: { service: 0.35, own: 0.2 },
    needsOwnCourier: false,
    fee: 0,
  },
  {
    slug: "chibbis",
    name: "Чиббис",
    note: "низкая ставка",
    rate: { service: null, own: 0.17 },
    needsOwnCourier: true,
    fee: 0,
  },
  {
    slug: "starter",
    name: "STARTER",
    note: "свой канал, 0% с заказа",
    rate: { service: null, own: 0 },
    needsOwnCourier: true,
    fee: 15000,
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

  const revenue = check * orders * 30;

  const rows = useMemo(() => {
    const cogs = revenue * (foodcost / 100);
    const monthOrders = orders * 30;

    return CHANNELS.map((c) => {
      const rate = model === "service" ? c.rate.service : c.rate.own;
      if (rate === null) {
        return { ...c, available: false as const, profit: 0, commission: 0, delivery: 0 };
      }
      const commission = revenue * rate;
      const delivery =
        model === "own" || c.needsOwnCourier ? monthOrders * courierCost : 0;
      const profit = revenue - cogs - commission - delivery - c.fee;
      return { ...c, available: true as const, profit, commission, delivery };
    });
  }, [revenue, foodcost, orders, model, courierCost]);

  const best = Math.max(...rows.filter((r) => r.available).map((r) => r.profit));
  const starter = rows.find((r) => r.slug === "starter");
  const yandex = rows.find((r) => r.slug === "yandex-eda");
  const diff =
    starter?.available && yandex?.available ? starter.profit - yandex.profit : 0;

  return (
    <section className="px-5 pb-16 md:px-14 md:pb-24">
      <h2 className="font-display text-[32px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[48px]">
        посчитайте
        <span className="pl-3 text-muted-foreground">на своих цифрах</span>
      </h2>
      <p className="mt-5 max-w-[660px] leading-snug text-muted-foreground">
        Подвигайте ползунки — увидите, сколько остаётся в кассе за месяц на
        каждом канале после комиссии, себестоимости и доставки.
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
              label="Заказов в день"
              value={orders}
              onChange={setOrders}
              suffix="шт"
              min={5}
              max={200}
              note={`Выручка за месяц — ${rub(revenue)} ₽`}
            />
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

            <Field
              label="Стоимость своей доставки"
              value={courierCost}
              onChange={setCourierCost}
              suffix="₽ / заказ"
              min={0}
              max={500}
              step={10}
              note="Учитывается там, где везёте вы"
            />
          </div>
        </div>

        <div className="rounded-[28px] bg-surface p-7 text-cream md:p-8">
          <div className="space-y-3">
            {rows.map((r) => {
              const isBest = r.available && r.profit === best;
              return (
                <div
                  key={r.slug}
                  className={`rounded-2xl p-5 transition-colors ${
                    isBest
                      ? "bg-brand text-foreground"
                      : r.available
                        ? "bg-cream/[0.06]"
                        : "bg-cream/[0.03]"
                  }`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <span className="font-display text-[1.1em] font-semibold">
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
                      <span className="font-display text-[1.35em] font-semibold tabular-nums">
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
                      комиссия {rub(r.commission)} ₽
                      {r.delivery > 0 && ` · доставка ${rub(r.delivery)} ₽`}
                      {r.fee > 0 && ` · подписка ${rub(r.fee)} ₽`}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {starter?.available && diff > 0 && (
            <p className="mt-6 rounded-2xl bg-cream/[0.06] p-5 text-[0.92em] leading-snug">
              <span className="text-brand">Свой канал выгоднее. </span>
              На ваших цифрах прямые заказы через STARTER оставляют на{" "}
              {rub(diff)} ₽ в месяц больше, чем Яндекс Еда. Но учтите: агрегатор
              приводит новых гостей, а свой канал удерживает тех, кто уже
              заказывал.
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={STARTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3.5 font-medium text-foreground transition-transform hover:-translate-y-0.5"
            >
              посмотреть STARTER
              <Icon name="ArrowUpRight" size={18} />
            </a>
            <span className="self-center text-[0.82em] text-cream-muted">
              промокод AGREGATORYPRO
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChannelCalc;
