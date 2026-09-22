import useReveal from "@/hooks/use-reveal";

const STATS = [
  { v: "7,81%", l: "доля рекламных расходов в сети кавказской кухни" },
  { v: "×13", l: "рублей выручки на каждый рубль продвижения" },
  { v: "+15%", l: "выручки за месяц без продвижения и акций" },
  { v: "5", l: "дней от старта проекта до первого заказа" },
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
            Настраиваем работу таким образом, чтобы гарантировать реальные результаты для&nbsp;вашего бизнеса.
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
              <div className="flex items-center justify-between text-[0.82em] font-semibold text-brand">
                <span>{c.tag}</span>
                <span className="text-cream-muted">{c.city}</span>
              </div>
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