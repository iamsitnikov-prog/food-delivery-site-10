import Header from "./Header";

export const ROBOT = "/robot.webp";

const STEPS = [
  { n: "шаг 1", t: "регистрация", d: "анкета, акцепт оферты, личный кабинет и его настройка" },
  { n: "шаг 2", t: "контент и вендор", d: "SEO, теги, титульное фото и все параметры меню" },
  { n: "шаг 3", t: "обучение", d: "учим весь персонал, который участвует в доставке" },
  { n: "шаг 4", t: "продвижение", d: "ставки на аукционе, акции и контроль рейтинга" },
  { n: "шаг 5", t: "запуск и первые заказы", d: "выводим проект на сервис и сопровождаем первые заказы" },
];

const TAGS = [
  "гарантируем рейтинг от 4.8",
  "отрабатываем все штрафы и удержания",
  "поддержка 24/7",
];

const Hero = () => {
  return (
    <div id="top" className="relative grid md:h-[100svh] md:min-h-[680px] md:max-h-[900px] grid-rows-[auto_1fr_auto] overflow-hidden bg-background">
      <Header />

      <section className="relative min-h-0 overflow-hidden">
        <img
          src={ROBOT}
          alt="Жёлтый робот-курьер agregatory.pro"
          className="pointer-events-none absolute -right-20 top-auto bottom-0 z-0 w-[300px] animate-rise object-contain mask-fade-left sm:w-[460px] md:-right-10 md:bottom-auto md:-top-[70px] md:h-[640px] md:w-[640px]"
        />
        <div className="relative z-10 h-full px-5 pb-10 pt-9 md:pb-28 md:px-14 md:pt-11">
          <h1 className="max-w-[860px] animate-rise font-display text-[44px] font-semibold leading-[.92] tracking-[-0.035em] sm:text-[64px] lg:text-[88px] text-left">
            Продвижение ресторана{" "}
            <span className="block px-0">в Яндекс Еде</span>
          </h1>
          <div className="mt-[34px] flex animate-rise-delay flex-col items-start gap-6 md:flex-row md:items-end md:gap-10">
            <p className="max-w-[430px] text-[1.15em] leading-[1.2] md:text-[1.3em]">
              Заказы и&nbsp;выручка на&nbsp;Яндекс Еде уже&nbsp;с&nbsp;первой недели. Настраиваем вендор, акции, продвижение и&nbsp;лояльность, обучаем персонал.
            </p>
            <div className="flex flex-col items-start gap-2.5 md:mx-auto md:items-center md:text-center">
              <a
                href="#lead"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-primary px-[30px] py-[18px] text-[1.06em] font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                начать сотрудничать
              </a>
              <span className="text-[0.82em] text-muted-foreground">первый заказ — максимум через 7 дней</span>
            </div>
          </div>
        </div>
        <ul
          aria-label="Для кого"
          className="relative z-10 mt-6 flex flex-wrap gap-2 px-5 pb-6 md:absolute md:bottom-[22px] md:left-14 md:mt-0 md:px-0 md:pb-0 md:pr-5"
        >
          {TAGS.map((t) => (
            <li key={t} className="rounded-full bg-pale px-3.5 py-[7px] text-[0.82em] text-foreground">
              {t}
            </li>
          ))}
        </ul>
      </section>

      <section
        id="steps"
        aria-label="Этапы работы"
        className="grid animate-up scroll-mt-4 grid-cols-1 gap-7 rounded-t-[40px] bg-surface px-5 pb-[34px] pt-[30px] text-cream sm:grid-cols-2 md:px-14 lg:grid-cols-[200px_repeat(5,1fr)]"
      >
        <h2 className="font-display text-[1.75em] font-semibold leading-none tracking-[-0.02em] sm:col-span-2 lg:col-span-1">
          как мы <em className="not-italic text-brand">работаем</em>
        </h2>
        {STEPS.map((s) => (
          <div key={s.n} className="border-t border-cream/25 pt-3.5">
            <b className="mb-2.5 block text-[0.82em] font-semibold text-brand">{s.n}</b>
            <h3 className="mb-1.5 text-[1.12em] font-medium leading-[1.15]">{s.t}</h3>
            <p className="text-[0.86em] leading-[1.3] text-cream-muted">{s.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Hero;