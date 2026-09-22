import useReveal from "@/hooks/use-reveal";

const STATS = [
  { v: "×2,4", l: "средний рост заказов за первые 3 месяца" },
  { v: "7–14", l: "дней от заявки до первого заказа" },
  { v: "4,8", l: "средний рейтинг карточек клиентов" },
  { v: "120+", l: "ресторанов и кафе уже в агрегаторах" },
];

const CASES = [
  {
    name: "Кафе «Гриль-Хаус»",
    city: "Казань",
    before: "38 заказов в неделю",
    after: "112 заказов в неделю",
    what: "переделали меню, запустили комбо и рекламу в Яндекс Еде",
  },
  {
    name: "Сеть «Лапша&Ко»",
    city: "Москва, 5 точек",
    before: "рейтинг 4,3",
    after: "рейтинг 4,9",
    what: "работа с отзывами, новые фото, поправили время доставки",
  },
  {
    name: "Дарк-китчен «Суши Бокс»",
    city: "Екатеринбург",
    before: "средний чек 890 ₽",
    after: "средний чек 1 340 ₽",
    what: "допродажи, наборы и акции выходного дня",
  },
];

const Results = () => {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="results" ref={ref} className="relative scroll-mt-4 overflow-hidden rounded-[40px] bg-surface px-5 py-20 text-cream md:mx-3 md:px-14 md:py-28">
      <img
        src="/robot-flip.webp"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-10 w-[300px] animate-float opacity-90 md:-left-16 md:w-[420px]"
      />
      <div className="relative">
        <div className="reveal mb-14 md:pl-[34%]">
          <h2 className="font-display text-[44px] font-semibold leading-[.92] tracking-[-0.035em] md:text-[72px]">
            результаты
            <span className="block pl-[1.2em] text-brand">в&nbsp;цифрах</span>
          </h2>
          <p className="mt-6 max-w-[440px] leading-snug text-cream-muted">
            Считаем не лайки, а&nbsp;заказы и&nbsp;выручку. Вот что обычно происходит, когда за&nbsp;агрегаторы берёмся мы.
          </p>
        </div>

        <div className="reveal grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.v} className="border-t border-cream/25 pt-4">
              <div className="font-display text-[48px] font-semibold leading-none tracking-[-0.04em] text-brand md:text-[72px]">
                {s.v}
              </div>
              <p className="mt-3 max-w-[220px] text-[0.9em] leading-snug text-cream-muted">{s.l}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {CASES.map((c, i) => (
            <article
              key={c.name}
              style={{ transitionDelay: `${i * 120}ms` }}
              className="reveal group rounded-xl border border-cream/20 p-6 transition-colors hover:border-brand"
            >
              <div className="text-[0.82em] font-semibold text-brand">{c.city}</div>
              <h3 className="mt-2 font-display text-[1.4em] font-semibold tracking-[-0.02em]">{c.name}</h3>
              <div className="mt-6 flex items-center gap-3 text-[0.92em]">
                <span className="text-cream-muted line-through decoration-cream/40">{c.before}</span>
              </div>
              <div className="mt-1 font-display text-[1.5em] font-semibold text-cream">{c.after}</div>
              <p className="mt-5 border-t border-cream/20 pt-4 text-[0.88em] leading-snug text-cream-muted">{c.what}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Results;
