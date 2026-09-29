import { useMemo, useState } from "react";
import Icon from "@/components/ui/icon";

export type Builder = {
  slug: string;
  name: string;
  tagline: string;
  fee: number;
  feeNote: string;
  setup: number;
  revenueShare: number;
  strong: string[];
  weak: string[];
  url?: string;
  promo?: string;
  hasApp: boolean;
  hasLoyalty: boolean;
  hasCrm: boolean;
  forNetwork: boolean;
  retention: number;
  bestFor: string;
};

export const BUILDERS: Builder[] = [
  {
    slug: "starter",
    name: "STARTER",
    tagline: "Приложение, сайт и лояльность в одной системе",
    fee: 15000,
    feeNote: "Тариф обсуждается индивидуально, зависит от числа точек",
    setup: 0,
    revenueShare: 0,
    strong: [
      "Своё приложение и сайт заказа под ваш бренд",
      "CRM с RFM-анализом и рассылками по сегментам",
      "Программа лояльности и геймификация",
      "Безлимитные SMS-авторизации и push-уведомления",
      "Интеграции с iiko и r_keeper, поддержка 24/7",
    ],
    weak: [
      "Точная стоимость только после разговора с менеджером",
      "Нужна своя доставка или подключение курьерской службы",
    ],
    url: "https://www.starterapp.ru/?utm_source=partners&utm_medium=sitnikov",
    promo: "AGREGATORYPRO",
    hasApp: true,
    hasLoyalty: true,
    hasCrm: true,
    forNetwork: true,
    retention: 4,
    bestFor:
      "Тем, кто хочет не просто сайт заказа, а систему удержания: приложение, лояльность, RFM-сегменты и безлимитные рассылки в одном месте.",
  },
  {
    slug: "sellkit",
    name: "Sellkit",
    tagline: "Платформа прямых заказов для сетей",
    fee: 11880,
    feeNote: "Базовый тариф; для сетей стоимость считается индивидуально",
    setup: 0,
    revenueShare: 0,
    strong: [
      "Сайт и мобильное приложение заказа",
      "Маркетинговые инструменты и аналитика продаж",
      "Интеграции с кассовыми системами",
      "Подходит сетям с несколькими точками",
    ],
    weak: [
      "Стоимость выше входного уровня конкурентов",
      "Часть возможностей — в старших тарифах",
    ],
    hasApp: true,
    hasLoyalty: true,
    hasCrm: true,
    forNetwork: true,
    retention: 3,
    bestFor:
      "Сетям, которым нужен готовый набор из сайта и приложения с понятной аналитикой продаж.",
  },
  {
    slug: "smartomato",
    name: "Смартомато",
    tagline: "Самый дешёвый вход на рынке",
    fee: 2400,
    feeNote: "Стартовый тариф; версия с приложением — около 8 400 ₽ в месяц",
    setup: 0,
    revenueShare: 0,
    strong: [
      "Низкий порог входа: можно начать с минимальных вложений",
      "Сайт заказа с корзиной и оплатой",
      "Тарифная линейка под разный размер бизнеса",
      "Понятно для небольшого заведения без IT-отдела",
    ],
    weak: [
      "Мобильное приложение — только в старших тарифах",
      "Функциональность лояльности скромнее, чем у лидеров",
    ],
    hasApp: false,
    hasLoyalty: false,
    hasCrm: false,
    forNetwork: false,
    retention: 1,
    bestFor:
      "Одиночному заведению, которому нужен рабочий сайт заказа при минимальном бюджете.",
  },
  {
    slug: "foodpicasso",
    name: "ФудПикассо",
    tagline: "Конструктор сайта доставки с фотобанком",
    fee: 4900,
    feeNote: "Ориентир: тарифы зависят от набора модулей",
    setup: 0,
    revenueShare: 0,
    strong: [
      "Быстрый запуск сайта доставки без разработчиков",
      "Готовые шаблоны и банк фотографий блюд",
      "Простое редактирование меню",
      "Низкая стоимость входа",
    ],
    weak: [
      "Акцент на сайте, приложение слабее конкурентов",
      "Меньше инструментов удержания и аналитики",
    ],
    hasApp: false,
    hasLoyalty: false,
    hasCrm: false,
    forNetwork: false,
    retention: 1,
    bestFor:
      "Тем, кому нужно быстро запустить красивый сайт доставки и не тратиться на фотосъёмку.",
  },
];

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

type Need = "hasApp" | "hasLoyalty" | "hasCrm" | "forNetwork";

const NEEDS: { key: Need; label: string; note: string }[] = [
  { key: "hasApp", label: "Мобильное приложение", note: "Гость ставит иконку на экран и возвращается сам" },
  { key: "hasLoyalty", label: "Программа лояльности", note: "Баллы и акции, чтобы возвращать гостей" },
  { key: "hasCrm", label: "CRM и рассылки", note: "База гостей, сегменты, push и SMS" },
  { key: "forNetwork", label: "Несколько точек", note: "Сеть или планы на вторую точку" },
];

const BuildersCalc = () => {
  const [check, setCheck] = useState(1200);
  const [orders, setOrders] = useState(20);
  const [aggCommission, setAggCommission] = useState(30);
  const [needs, setNeeds] = useState<Need[]>(["hasApp", "hasLoyalty"]);
  const [fees, setFees] = useState<Record<string, number>>(
    Object.fromEntries(BUILDERS.map((b) => [b.slug, b.fee])),
  );

  const monthOrders = orders * 30;
  const revenue = check * monthOrders;
  const savedCommission = revenue * (aggCommission / 100);

  const rows = useMemo(() => {
    return BUILDERS.map((b) => {
      const fee = fees[b.slug] ?? b.fee;
      const cost = fee + revenue * (b.revenueShare / 100);
      const gain = savedCommission - cost;
      const breakEven = check > 0 ? cost / (check * (aggCommission / 100)) : 0;
      const missing = needs.filter((n) => !b[n]);
      const fits = missing.length === 0;
      return { ...b, fee, cost, gain, breakEven, fits, missing };
    }).sort((a, b) => {
      if (a.fits !== b.fits) return a.fits ? -1 : 1;
      if (needs.length > 0 && a.retention !== b.retention)
        return b.retention - a.retention;
      return b.gain - a.gain;
    });
  }, [fees, revenue, savedCommission, check, aggCommission, needs]);

  const best = rows[0];
  const toggleNeed = (n: Need) =>
    setNeeds((cur) =>
      cur.includes(n) ? cur.filter((x) => x !== n) : [...cur, n],
    );

  return (
    <div className="rounded-[24px] md:rounded-[32px] bg-surface p-4 text-cream md:p-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-11">
        <div>
          <h2 className="font-display text-[1.5em] font-semibold tracking-[-0.02em]">
            ваши данные
          </h2>
          <p className="mt-2 text-[0.92em] leading-snug text-cream-muted">
            Сколько заказов вы готовы перевести на свой канал и сколько за них
            сейчас платите агрегатору.
          </p>

          <div className="mt-7 space-y-7">
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
              label="Прямых заказов в день"
              value={orders}
              onChange={setOrders}
              suffix="шт"
              min={1}
              max={200}
              note={`Оборот своего канала — ${rub(revenue)} ₽ в месяц`}
            />
            <Field
              label="Комиссия агрегатора"
              value={aggCommission}
              onChange={setAggCommission}
              suffix="%"
              min={10}
              max={40}
              note={`На этих заказах агрегатор удержал бы ${rub(savedCommission)} ₽`}
            />
          </div>

          <div className="mt-7 border-t border-cream/12 pt-6">
            <span className="text-[0.9em] font-medium text-cream">
              Что вам нужно
            </span>
            <p className="mt-1.5 text-[0.8em] leading-snug text-cream-muted">
              Платформы без этих возможностей уйдут вниз списка.
            </p>
            <div className="mt-4 space-y-2">
              {NEEDS.map((n) => {
                const on = needs.includes(n.key);
                return (
                  <button
                    key={n.key}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleNeed(n.key)}
                    className={`flex w-full items-start gap-3 rounded-xl p-3.5 text-left transition-colors ${
                      on ? "bg-brand text-foreground" : "bg-cream/[0.06] hover:bg-cream/[0.1]"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                        on ? "border-foreground bg-foreground text-brand" : "border-cream/30"
                      }`}
                    >
                      {on && <Icon name="Check" size={13} />}
                    </span>
                    <span>
                      <span className="block text-[0.9em] font-medium">{n.label}</span>
                      <span
                        className={`mt-0.5 block text-[0.78em] leading-snug ${
                          on ? "text-foreground/70" : "text-cream-muted"
                        }`}
                      >
                        {n.note}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-7 border-t border-cream/12 pt-6">
            <span className="text-[0.9em] font-medium text-cream">
              Стоимость платформ
            </span>
            <p className="mt-1.5 text-[0.8em] leading-snug text-cream-muted">
              Значения ориентировочные. Узнали свою цену — впишите её, расчёт
              обновится.
            </p>
            <div className="mt-4 space-y-3">
              {BUILDERS.map((b) => (
                <div key={b.slug} className="flex items-center gap-3">
                  <label
                    htmlFor={`fee-${b.slug}`}
                    className="flex-1 text-[0.88em] text-cream-muted"
                  >
                    {b.name}
                  </label>
                  <div className="relative w-[130px]">
                    <input
                      id={`fee-${b.slug}`}
                      type="number"
                      inputMode="numeric"
                      min={0}
                      step={100}
                      value={fees[b.slug]}
                      onChange={(e) =>
                        setFees((f) => ({
                          ...f,
                          [b.slug]: Math.max(0, Number(e.target.value) || 0),
                        }))
                      }
                      className="h-11 w-full rounded-xl border border-cream/20 bg-cream/[0.06] py-2 pl-3 pr-8 text-[0.95em] font-medium text-cream outline-none transition-colors focus:border-brand [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[0.9em] text-cream-muted">
                      ₽
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-display text-[1.5em] font-semibold tracking-[-0.02em]">
            что это даст
          </h2>
          <p className="mt-2 text-[0.92em] leading-snug text-cream-muted">
            Выгода — это сэкономленная комиссия минус плата за платформу.
            {needs.length > 0
              ? " Сверху те, кто закрывает ваши задачи глубже, а не просто стоит дешевле."
              : " Задачи не отмечены, поэтому сортировка только по деньгам."}
          </p>

          <div className="mt-7 space-y-3">
            {rows.map((b, i) => {
              const isBest = i === 0 && b.gain > 0 && b.fits;
              return (
                <div
                  key={b.slug}
                  className={`rounded-2xl p-5 transition-colors ${
                    isBest
                      ? "bg-brand text-foreground"
                      : b.fits
                        ? "bg-cream/[0.06]"
                        : "bg-cream/[0.03]"
                  }`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <span className="font-display text-[1.15em] font-semibold">
                      {b.name}
                    </span>
                    <span
                      className={`font-display text-[1.3em] font-semibold tabular-nums ${
                        b.gain < 0 ? "text-[#ff8f8f]" : ""
                      }`}
                    >
                      {b.gain > 0 ? "+" : ""}
                      {rub(b.gain)} ₽
                    </span>
                  </div>
                  <p
                    className={`mt-1 text-[0.82em] leading-snug ${
                      isBest ? "text-foreground/60" : "text-cream-muted"
                    }`}
                  >
                    {b.tagline}
                  </p>
                  <p
                    className={`mt-2.5 text-[0.82em] leading-snug ${
                      isBest ? "text-foreground/70" : "text-cream-muted"
                    }`}
                  >
                    платформа {rub(b.cost)} ₽ · окупается с{" "}
                    {Math.ceil(b.breakEven)} заказов в месяц
                    {b.breakEven / 30 >= 1 &&
                      ` (${Math.ceil(b.breakEven / 30)} в день)`}
                  </p>

                  {!b.fits && (
                    <p className="mt-2.5 flex items-start gap-2 rounded-xl bg-cream/[0.06] p-3 text-[0.8em] leading-snug text-cream-muted">
                      <Icon name="TriangleAlert" size={14} className="mt-0.5 shrink-0" />
                      <span>
                        Не закрывает:{" "}
                        {b.missing
                          .map((m) => NEEDS.find((n) => n.key === m)?.label.toLowerCase())
                          .join(", ")}
                      </span>
                    </p>
                  )}

                  {isBest && (
                    <p className="mt-2.5 text-[0.82em] leading-snug text-foreground/70">
                      {b.bestFor}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {best && (
            <p className="mt-6 rounded-2xl bg-cream/[0.06] p-4 md:p-5 text-[0.92em] leading-snug">
              {best.gain > 0 ? (
                <>
                  <span className="text-brand">
                    {best.name}: выгода {rub(best.gain)} ₽ в месяц.{" "}
                  </span>
                  {needs.length > 0
                    ? "Это единственный вариант, который закрывает все отмеченные задачи и при этом окупается. "
                    : "На ваших цифрах это лучший вариант по деньгам. "}
                  За год — {rub(best.gain * 12)} ₽. Но считать только по цене
                  подписки не стоит: дешёвая платформа без приложения и
                  лояльности не вернёт вам гостя, а значит и экономить будет не
                  на чем.
                </>
              ) : (
                <>
                  <span className="text-brand">Пока рано. </span>
                  При таком объёме прямых заказов плата за платформу не
                  окупается. Свой канал имеет смысл запускать, когда наберётся
                  поток постоянных гостей — поднимите число заказов и посмотрите,
                  где проходит граница.
                </>
              )}
            </p>
          )}

          <p className="mt-4 text-[0.78em] leading-snug text-cream-muted">
            Расчёт показывает экономию на комиссии, а не полную прибыль: в нём
            нет себестоимости блюд и расходов на доставку — они одинаковы для
            всех платформ. Тарифы ориентировочные, уточняйте у сервисов.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BuildersCalc;