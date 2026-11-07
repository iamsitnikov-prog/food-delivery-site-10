import Icon from "@/components/ui/icon";
import Header from "./Header";

export const ROBOT = "/robot.webp?v=2";

const STEPS = [
  { n: "шаг 1", t: "регистрация", d: "анкета, акцепт оферты, личный кабинет и его настройка" },
  { n: "шаг 2", t: "контент и вендор", d: "SEO, теги, титульное фото и все параметры меню" },
  { n: "шаг 3", t: "обучение", d: "учим весь персонал, который участвует в доставке" },
  { n: "шаг 4", t: "продвижение", d: "ставки на аукционе, акции и контроль рейтинга" },
  { n: "шаг 5", t: "запуск и первые заказы", d: "выводим проект на сервис и сопровождаем первые заказы" },
];

const STATS = [
  { v: "124", l: "проекта в работе" },
  { v: "2,6 млрд ₽", l: "выручка проектов" },
  { v: "×13", l: "выручки на рубль продвижения" },
];

const Hero = () => {
  return (
    <div id="top" className="relative grid grid-rows-[auto_1fr_auto] overflow-hidden bg-background">
      <Header />

      <section className="relative min-h-0 overflow-hidden lg:grid lg:grid-cols-[1.05fr_1fr]">
        <div className="relative z-10 px-5 pb-8 pt-8 sm:pt-9 md:px-14 md:pt-11 lg:self-center lg:pb-10 lg:pt-6 lg:pr-0">
          <h1 className="max-w-[860px] animate-rise font-display text-[34px] font-semibold leading-[.95] tracking-[-0.035em] sm:text-[64px] lg:text-[62px] xl:text-[80px] text-left">
            Продвижение ресторана{" "}
            <span className="block px-0">в Яндекс Еде</span>
          </h1>
          <p className="mt-5 max-w-[470px] animate-rise-delay text-[1.02em] leading-[1.3] md:mt-7 md:text-[1.2em] lg:mt-4 lg:text-[1.1em]">
            Заказы и&nbsp;выручка на&nbsp;Яндекс Еде уже&nbsp;с&nbsp;первой недели. Настраиваем вендор, акции, продвижение и&nbsp;лояльность, обучаем персонал.
          </p>
          <div className="mt-6 flex animate-rise-delay flex-wrap items-center gap-x-5 gap-y-3 md:mt-8 lg:mt-5">
            <a
              href="#lead"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-primary px-[26px] py-[15px] text-[1em] font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 md:px-[30px] md:py-[18px] md:text-[1.06em]"
            >
              начать сотрудничать
            </a>
            <a href="#free-audit" className="text-[0.95em] font-medium underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground">
              бесплатный разбор карточки
            </a>
          </div>

          <div className="mt-7 flex max-w-[520px] items-start gap-3 rounded-2xl bg-pale/80 p-4 md:mt-9 lg:mt-6">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-brand">
              <Icon name="ShieldCheck" size={18} />
            </span>
            <p className="text-[max(13px,0.92em)] leading-snug">
              <b className="font-semibold">Мы не Яндекс</b>, работаем на&nbsp;стороне ресторана. Авторы Бизнес школы Яндекс Еды, эксперты и&nbsp;спикеры проектов Яндекс Еды.
            </p>
          </div>

          <ul aria-label="Цифры" className="mt-7 grid max-w-[520px] grid-cols-3 divide-x divide-foreground/15 md:mt-9 lg:mt-6">
            {STATS.map((st) => (
              <li key={st.l} className="px-3 first:pl-0">
                <b className="block whitespace-nowrap font-display text-[1.35em] font-semibold leading-none tracking-[-0.02em] md:text-[1.9em] lg:text-[1.45em] xl:text-[1.9em]">{st.v}</b>
                <span className="mt-1.5 block text-[12px] leading-tight text-foreground/70 md:text-[max(12px,0.82em)]">{st.l}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Юрий и Лилия: стоят на тёмной полосе «как мы работаем», за ними светлый круг */}
        <figure className="relative mx-auto w-full max-w-[560px] self-end px-5 lg:mx-0 lg:max-w-none lg:px-10 xl:pr-14">
          <div aria-hidden className="absolute bottom-[-12%] left-1/2 aspect-square w-[92%] -translate-x-1/2 rounded-full bg-pale" />
          <img
            src="/team-pair.webp?v=4"
            srcSet="/team-pair-720.webp?v=4 720w, /team-pair.webp?v=4 1124w"
            sizes="(max-width: 1023px) 92vw, 46vw"
            alt="Лилия Ковальчук и Юрий Ситников, agregatory.pro"
            width={1124}
            height={820}
            {...{ fetchpriority: "high" }}
            decoding="async"
            className="relative block h-auto w-full"
          />
          <figcaption className="pointer-events-none absolute inset-x-5 bottom-4 flex items-end justify-between gap-2 lg:inset-x-10 xl:right-14">
            <span className="rounded-xl bg-surface/95 px-3 py-2 text-cream shadow-lg md:px-4 md:py-2.5">
              <b className="block text-[13px] font-semibold leading-tight md:text-[15px]">Лилия Ковальчук</b>
              <span className="block text-[11px] leading-tight text-cream-muted md:text-[12px]">15 лет в доставке</span>
            </span>
            <span className="rounded-xl bg-surface/95 px-3 py-2 text-right text-cream shadow-lg md:px-4 md:py-2.5">
              <b className="block text-[13px] font-semibold leading-tight md:text-[15px]">Юрий Ситников</b>
              <span className="block text-[11px] leading-tight text-cream-muted md:text-[12px]">эксперт Яндекс Еды и Forbes</span>
            </span>
          </figcaption>
        </figure>
      </section>

      <section
        id="steps"
        aria-label="Этапы работы"
        className="grid animate-up scroll-mt-4 grid-cols-1 gap-7 rounded-t-[28px] md:rounded-t-[40px] bg-surface px-5 pb-[34px] pt-[30px] text-cream sm:grid-cols-2 md:px-14 lg:grid-cols-[200px_repeat(5,1fr)]"
      >
        <h2 className="font-display text-[1.75em] font-semibold leading-none tracking-[-0.02em] sm:col-span-2 lg:col-span-1">
          как мы <em className="not-italic text-brand">работаем</em>
        </h2>
        {STEPS.map((s) => (
          <div key={s.n} className="border-t border-cream/25 pt-3.5">
            <b className="mb-2.5 block text-[max(12px,0.82em)] font-semibold text-brand">{s.n}</b>
            <h3 className="mb-1.5 text-[1.12em] font-medium leading-[1.15]">{s.t}</h3>
            <p className="text-[max(12px,0.86em)] leading-[1.3] text-cream-muted">{s.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Hero;