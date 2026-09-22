import useReveal from "@/hooks/use-reveal";
import CountUp from "./CountUp";

const HERO_STAT = { v: "2,6", unit: "млрд ₽", l: "выручка проектов, которые ведём" };

const STATS = [
  { v: "×13", l: "рублей выручки на каждый рубль продвижения" },
  { v: "5", l: "дней от старта проекта до первого заказа" },
  { v: "124", l: "проекта в работе" },
  { v: "17", l: "городов ведения проектов по России" },
  { v: "5", l: "городов международного формата" },
  { v: "5+", l: "лет работы с агрегаторами" },
];

const CASES = [
  {
    tag: "кейс 1",
    name: "Точка фастфуда с моно кухней",
    city: "результат за 4 дня",
    before: "старт с нуля",
    after: "122 695 ₽ за 4 дня",
    what: "Запустили проект за 5 дней и получили первый заказ в первые 60 минут существования на сервисе — только органические продажи, без анонсов. Сегодня проект делает до 40 тыс. ₽ в день. 64 выполненных заказа.",
  },
  {
    tag: "кейс 2",
    name: "Сеть японских ресторанов",
    city: "результат за месяц",
    before: "без продвижения и акций",
    after: "+15% к выручке",
    what: "Привели контент в карточках в порядок, увеличили конверсию в клик и в заказ. 46 205 224 ₽ выручки и 15 052 выполненных заказа за период. Никакой магии, только системный подход.",
  },
  {
    tag: "кейс 3",
    name: "Сеть ресторанов кавказской кухни",
    city: "результат за месяц",
    before: "высокий ДРР",
    after: "ДРР снижен до 7,81%",
    what: "Разобрались в рекомендованных ставках, соотнесли их с конкурентными, привели контент в порядок. 470 заказов, 62 335 433 ₽ выручки от рекламы при затратах 4 868 697 ₽. Каждый рубль продвижения приносит до 13 рублей выручки.",
  },
  {
    tag: "кейс 4",
    name: "Кейс 4",
    city: "результат",
    before: "исходная ситуация",
    after: "результат проекта",
    what: "Текст кейса скоро появится.",
  },
  {
    tag: "кейс 5",
    name: "Кейс 5",
    city: "результат",
    before: "исходная ситуация",
    after: "результат проекта",
    what: "Текст кейса скоро появится.",
  },
  {
    tag: "кейс 6",
    name: "Кейс 6",
    city: "результат",
    before: "исходная ситуация",
    after: "результат проекта",
    what: "Текст кейса скоро появится.",
  },
];

const Results = () => {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="results" ref={ref} className="relative mt-5 scroll-mt-4 overflow-hidden rounded-[40px] bg-surface px-5 py-20 text-cream md:mx-3 md:mt-7 md:px-14 md:py-28">
      <img
        src="/robot-flip.webp"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-10 w-[300px] animate-float opacity-90 md:-left-16 md:w-[420px]"
      />
      <div className="relative">
        <div className="reveal mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end md:pl-[34%]">
          <h2 className="font-display text-[44px] font-semibold leading-[.92] tracking-[-0.035em] md:text-[72px]">
            результаты
            <span className="block pl-[1.2em] text-brand">в&nbsp;цифрах</span>
          </h2>
          <p className="max-w-[340px] text-[1.05em] leading-snug text-cream-muted">
            Настраиваем работу таким образом, чтобы гарантировать реальные результаты для&nbsp;вашего бизнеса.
          </p>
        </div>

        <div className="reveal flex flex-col gap-4 border-y border-cream/25 py-8 md:flex-row md:items-end md:justify-between md:gap-10 md:py-10">
          <span className="flex items-baseline gap-3 font-display font-semibold leading-[.85] tracking-[-0.045em] text-brand">
            <span className="text-[72px] md:text-[130px]">{HERO_STAT.v}</span>
            <span className="text-[26px] md:text-[44px]">{HERO_STAT.unit}</span>
          </span>
          <p className="max-w-[300px] text-[1em] leading-snug text-cream-muted md:pb-3 md:text-right md:text-[1.1em]">
            {HERO_STAT.l}
          </p>
        </div>

        <div className="reveal mt-14 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.l} className="group border-t border-cream/25 pt-4 transition-colors hover:border-brand">
              <CountUp
                value={s.v}
                className="block font-display text-[44px] font-semibold leading-none tracking-[-0.04em] text-brand transition-transform duration-500 group-hover:-translate-y-1 md:text-[64px]"
              />
              <p className="mt-3 max-w-[260px] text-[0.92em] leading-snug text-cream-muted">{s.l}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {CASES.map((c, i) => {
            const light = i % 2 === 1;
            return (
              <article
                key={c.name}
                style={{ transitionDelay: `${i * 120}ms` }}
                className={`reveal group rounded-[24px] p-6 transition-all duration-500 hover:-translate-y-1.5 ${
                  light ? "bg-pale text-foreground" : "border border-cream/20"
                }`}
              >
                <div
                  className={`flex items-center justify-between text-[0.82em] font-semibold ${
                    light ? "text-foreground" : "text-brand"
                  }`}
                >
                  <span>{c.tag}</span>
                  <span className={light ? "text-foreground/60" : "text-cream-muted"}>{c.city}</span>
                </div>
                <h3 className="mt-2 font-display text-[1.4em] font-semibold tracking-[-0.02em]">{c.name}</h3>
                <div className="mt-6 text-[0.92em]">
                  <span
                    className={`line-through ${
                      light ? "text-foreground/60 decoration-foreground/40" : "text-cream-muted decoration-cream/40"
                    }`}
                  >
                    {c.before}
                  </span>
                </div>
                <CountUp
                  value={c.after}
                  className={`mt-1 block font-display text-[1.5em] font-semibold ${light ? "text-foreground" : "text-cream"}`}
                />
                <p
                  className={`mt-5 border-t pt-4 text-[0.88em] leading-snug ${
                    light ? "border-foreground/20 text-foreground/80" : "border-cream/20 text-cream-muted"
                  }`}
                >
                  {c.what}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Results;