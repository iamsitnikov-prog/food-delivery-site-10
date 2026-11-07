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
    <div id="top" className="relative grid lg:min-h-[680px] grid-rows-[auto_1fr_auto] overflow-hidden bg-background">
      <Header />

      <section className="relative min-h-0 overflow-hidden">
        {/* Юрий и Лилия на первом экране вместо робота: живые люди и сразу видно,
            что это не сайт Яндекса. Вырезка без фона, стоит прямо на жёлтом. */}
        <figure className="pointer-events-none absolute bottom-0 right-10 z-0 hidden h-[92%] max-h-[600px] lg:block xl:right-14">
          <img
            src="/team-duo.webp?v=1"
            srcSet="/team-duo-600.webp?v=1 459w, /team-duo.webp?v=1 765w"
            sizes="(max-width: 1024px) 360px, 500px"
            alt="Лилия Ковальчук и Юрий Ситников, agregatory.pro"
            width={765}
            height={1000}
            {...{ fetchpriority: "high" }}
            decoding="async"
            className="h-full w-auto object-contain object-bottom"
          />
          <figcaption className="absolute bottom-6 left-0 right-0 flex justify-between px-[4%] text-[max(12px,0.78em)] font-medium">
            <span className="rounded-full bg-pale/95 px-3 py-1.5 shadow-sm">Лилия Ковальчук</span>
            <span className="rounded-full bg-pale/95 px-3 py-1.5 shadow-sm">Юрий Ситников</span>
          </figcaption>
        </figure>
        <div className="relative z-10 px-5 pb-6 pt-8 sm:pb-10 sm:pt-9 md:px-14 md:pt-11 lg:max-w-[60%] lg:pb-12">
          <h1 className="max-w-[860px] animate-rise font-display text-[30px] font-semibold leading-[.95] tracking-[-0.035em] sm:text-[64px] lg:text-[72px] xl:text-[88px] text-left">
            Продвижение ресторана{" "}
            <span className="block px-0">в Яндекс Еде</span>
          </h1>
          <div className="mt-5 flex animate-rise-delay md:mt-[34px] flex-col items-start gap-5 sm:gap-6 xl:flex-row xl:items-end xl:gap-10">
            <p className="max-w-[430px] leading-[1.25] text-[1.02em] md:text-[1.3em] text-left">
              Заказы и&nbsp;выручка на&nbsp;Яндекс Еде уже&nbsp;с&nbsp;первой недели. Настраиваем вендор, акции, продвижение и&nbsp;лояльность, обучаем персонал.
            </p>
            <div className="flex flex-col items-start gap-2.5">
              <a
                href="#lead"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-primary px-[26px] py-[15px] text-[1em] md:px-[30px] md:py-[18px] md:text-[1.06em] font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                начать сотрудничать
              </a>
              <span className="text-[max(12px,0.82em)] text-muted-foreground">первый заказ — максимум через 7 дней</span>
            </div>
          </div>
          <p className="mt-6 max-w-[560px] text-[max(12px,0.9em)] leading-snug md:mt-8 md:text-[1em]">
            <b className="font-semibold">Юрий Ситников и&nbsp;Лилия Ковальчук</b>, авторы Бизнес школы Яндекс Еды.
            Мы&nbsp;не&nbsp;Яндекс: работаем на&nbsp;стороне ресторана.
          </p>
          {/* На телефоне фото идёт под текстом, а не сбоку */}
          <figure className="relative mx-auto mt-6 w-[260px] sm:w-[340px] lg:hidden">
            <img
              src="/team-duo-600.webp?v=1"
              srcSet="/team-duo-600.webp?v=1 459w, /team-duo.webp?v=1 765w"
              sizes="(max-width: 639px) 260px, 340px"
              alt="Лилия Ковальчук и Юрий Ситников, agregatory.pro"
              width={459}
              height={600}
              decoding="async"
              className="w-full"
            />
            <figcaption className="absolute bottom-3 left-0 right-0 flex justify-between px-1 text-[12px] font-medium">
              <span className="rounded-full bg-pale/95 px-2.5 py-1">Лилия Ковальчук</span>
              <span className="rounded-full bg-pale/95 px-2.5 py-1">Юрий Ситников</span>
            </figcaption>
          </figure>
        </div>
        <ul
          aria-label="Цифры"
          className="relative z-10 grid grid-cols-3 gap-3 px-5 pb-7 sm:flex sm:flex-wrap sm:gap-x-7 sm:gap-y-3 md:px-14 lg:max-w-[62%] lg:gap-x-6 lg:pb-10"
        >
          {STATS.map((s) => (
            <li key={s.l} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
              <b className="whitespace-nowrap font-display text-[1.2em] font-semibold tracking-[-0.02em] sm:text-[1.35em] md:text-[1.6em]">{s.v}</b>
              <span className="text-[12px] leading-tight text-foreground/75 sm:text-[max(12px,0.82em)]">{s.l}</span>
            </li>
          ))}
        </ul>
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