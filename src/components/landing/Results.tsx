import { useState } from "react";
import Icon from "@/components/ui/icon";
import useReveal from "@/hooks/use-reveal";
import CountUp from "./CountUp";

const HERO_STAT = { v: "2,6", unit: "млрд ₽", l: "выручка проектов, которые ведём" };

const STATS = [
  { v: "×13", l: "рублей выручки на каждый рубль продвижения" },
  { v: "5", l: "дней от старта проекта до первого заказа" },
  { v: "124", l: "проекта в работе" },
  { v: "19", l: "городов ведения проектов по России" },
  { v: "5", l: "городов международного формата" },
  { v: "5+", l: "лет работы с агрегаторами" },
];

const CASES = [
  {
    tag: "кейс 1",
    name: "Точка фастфуда с моно кухней",
    city: "результат за 4 дня",
    before: "старт с нуля",
    after: "122 695 ₽ за 4 дня",
    what: "Запустили проект за 5 дней и получили первый заказ в первые 60 минут существования на сервисе — только органические продажи, без анонсов. За 4 дня 64 выполненных заказа на 122 695 ₽, средний чек 1 917 ₽. Сегодня проект делает до 40 000 ₽ в день.",
  },
  {
    tag: "кейс 2",
    name: "Сеть японских ресторанов",
    city: "результат за месяц",
    before: "без продвижения и акций",
    after: "+15% к выручке",
    what: "Привели контент в карточках в порядок, увеличили конверсию в клик и в заказ. 46 205 224 ₽ выручки и 15 052 выполненных заказа за месяц, средний чек 3 070 ₽. Рост выручки +15% без увеличения рекламного бюджета.",
  },
  {
    tag: "кейс 3",
    name: "Сеть ресторанов кавказской кухни",
    city: "результат за месяц",
    before: "ДРР 14,2%",
    after: "ДРР снижен до 7,81%",
    what: "Разобрались в рекомендованных ставках, соотнесли их с конкурентными, привели контент в порядок. 62 335 433 ₽ выручки от рекламы при затратах 4 868 697 ₽. ДРР снижен с 14,2% до 7,81% — каждый рубль продвижения приносит до 13 рублей выручки.",
  },
  {
    tag: "кейс 4",
    name: "Сеть кофеен",
    city: "результат за 2 месяца",
    before: "рейтинг 4.3",
    after: "рейтинг с 4.3 до 4.9",
    what: "Подняли рейтинг сети с 4.3 до 4.9 за 2 месяца — отработали 340 негативных отзывов и обучили 28 бариста работе с жалобами прямо в личном кабинете. Доля повторных заказов выросла на 28%, выручка с доставки — на 22% без дополнительных вложений в рекламу.",
  },
  {
    tag: "кейс 5",
    name: "Пекарня-кондитерская",
    city: "результат за 3 месяца",
    before: "19% повторных заказов",
    after: "+34% повторных заказов",
    what: "Настроили персонализированные акции для гостей, уже заказывавших ранее, и переработали 84 карточки десертов под конверсию в клик. Доля повторных заказов выросла с 19% до 34%, средний чек — с 640 ₽ до 850 ₽, то есть на 210 ₽.",
  },
  {
    tag: "кейс 6",
    name: "Сеть шаурмы, 5 точек",
    city: "результат за 10 дней",
    before: "запуск сразу на несколько точек",
    after: "5 точек — 5 дней",
    what: "Одновременно зарегистрировали и запустили 5 точек сети в новом городе за 5 дней. Каждая точка получила первый заказ в течение первых 24 часов после публикации. За 10 дней сеть суммарно выполнила 612 заказов на 890 000 ₽ — в среднем 12 заказов в день на точку.",
  },
  {
    tag: "кейс 7",
    name: "Ресторан паназиатской кухни",
    city: "результат за 6 недель",
    before: "удержания 312 000 ₽ в месяц",
    after: "удержания снижены на 76%",
    what: "Разобрали структуру штрафов: 68% приходилось на отсутствие позиций в наличии и нарушение времени приготовления. Настроили автостоп-лист, пересмотрели тайминги кухни, оспорили 47 некорректных начислений через поддержку. Удержания снизились с 312 000 ₽ до 75 000 ₽ в месяц — на 76% за 6 недель.",
  },
  {
    tag: "кейс 8",
    name: "Сеть пиццерий",
    city: "результат за 5 недель",
    before: "рейтинг 4.1",
    after: "доля негатива снижена в 3 раза",
    what: "Ввели регламент ответа на отзывы в течение 30 минут и обучили администраторов 9 точек закрывать жалобы без эскалации в поддержку. Доля отзывов с оценкой 1–2 звезды снизилась с 12% до 4% — в 3 раза, средний рейтинг вырос с 4.1 до 4.7 за 5 недель.",
  },
  {
    tag: "кейс 9",
    name: "Кафе восточной кухни",
    city: "результат за 4 месяца",
    before: "гости не возвращались после доставки",
    after: "15% гостей доставки пришли в зал",
    what: "Настроили цепочку персонализированных предложений для гостей доставки с приглашением в зал и бонусом на первый визит. За 4 месяца 15% гостей, впервые заказавших через агрегатор, посетили заведение офлайн — средний чек в зале 1 460 ₽ против 1 080 ₽ в доставке, то есть на 380 ₽ выше.",
  },
];

const NUM = /([+×]?\d[\d\u00A0 ]*(?:[.,]\d+)?(?:\s?[₽%])?)/g;

const highlight = (text: string, light: boolean) =>
  text.split(NUM).map((part, i) => {
    if (!/^[+×]?\d/.test(part)) return <span key={i}>{part}</span>;
    const trimmed = part.trimEnd();
    return (
      <span key={i}>
        <b className={`font-semibold ${light ? "text-foreground" : "text-brand"}`}>{trimmed}</b>
        {part.slice(trimmed.length)}
      </span>
    );
  });

const Results = () => {
  const ref = useReveal<HTMLElement>();
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? CASES : CASES.slice(0, 6);

  return (
    <section id="results" ref={ref} className="relative mt-5 scroll-mt-4 overflow-hidden rounded-[40px] bg-surface px-5 py-20 text-cream md:mx-3 md:mt-7 md:px-14 md:py-28">
      <img
        src="/robot-flip-500.webp?v=2"
        srcSet="/robot-flip-500.webp?v=2 500w, /robot-flip.webp?v=2 800w"
        sizes="(max-width: 768px) 320px, 800px"
        alt=""
        aria-hidden
        width={800}
        height={765}
        loading="lazy"
        decoding="async"
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

        <div className="reveal flex flex-col items-center gap-3 border-y border-cream/25 py-10 text-center md:py-14">
          <span className="flex items-baseline gap-3 font-display font-semibold leading-[.85] tracking-[-0.045em] text-brand">
            <CountUp value={HERO_STAT.v} className="text-[72px] md:text-[130px]" />
            <span className="text-[26px] md:text-[44px]">{HERO_STAT.unit}</span>
          </span>
          <p className="max-w-[420px] text-[1em] leading-snug text-cream-muted md:text-[1.15em]">{HERO_STAT.l}</p>
        </div>

        <div className="reveal mt-14 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {STATS.map((s) => (
            <div
              key={s.l}
              className="group flex flex-col items-center border-t border-cream/25 pt-4 text-center transition-colors hover:border-brand"
            >
              <CountUp
                value={s.v}
                className="block font-display text-[44px] font-semibold leading-none tracking-[-0.04em] text-brand transition-transform duration-500 group-hover:-translate-y-1 md:text-[64px]"
              />
              <p className="mt-3 max-w-[260px] text-[0.92em] leading-snug text-cream-muted">{s.l}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((c, i) => {
            const light = i % 2 === 1;
            return (
              <article
                key={c.name}
                style={{ transitionDelay: `${i * 120}ms` }}
                className={`group animate-fade-in rounded-[24px] p-6 transition-all duration-500 hover:-translate-y-1.5 ${
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
                <span
                  className={`mt-1 block font-display text-[1.5em] font-semibold ${light ? "text-foreground" : "text-cream"}`}
                >
                  {c.after}
                </span>
                <p
                  className={`mt-5 border-t pt-4 text-[0.88em] leading-snug ${
                    light ? "border-foreground/20 text-foreground/80" : "border-cream/20 text-cream-muted"
                  }`}
                >
                  {highlight(c.what, light)}
                </p>
              </article>
            );
          })}
        </div>

        {CASES.length > 6 && (
          <div className="reveal mt-8 flex justify-center">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="inline-flex items-center gap-2 rounded-xl border border-cream/30 px-7 py-4 font-medium transition-colors hover:bg-brand hover:text-foreground"
            >
              {showAll ? "свернуть кейсы" : `показать ещё ${CASES.length - 6}`}
              <Icon name={showAll ? "ChevronUp" : "ChevronDown"} size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Results;