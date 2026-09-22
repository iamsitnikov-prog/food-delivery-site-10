import Header from "./Header";

export const ROBOT = "/robot.webp";

const STEPS = [
  { n: "шаг 1", t: "аудит", d: "разбираем кухню, район, цены и карточки конкурентов" },
  { n: "шаг 2", t: "подключение", d: "договор с площадками, меню, фото, зоны доставки" },
  { n: "шаг 3", t: "продвижение", d: "реклама, акции и рейтинг внутри агрегаторов" },
  { n: "шаг 4", t: "отчёты", d: "цифры по продажам и план роста каждый месяц" },
];

const TAGS = ["рестораны и кафе", "сети общепита", "дарк-китчены"];

const Hero = () => {
  return (
    <div id="top" className="relative grid min-h-[680px] md:h-[100svh] md:max-h-[900px] grid-rows-[auto_1fr_auto] overflow-hidden bg-background">
      <Header />

      <section className="relative min-h-0 overflow-hidden">
        <img
          src={ROBOT}
          alt="Жёлтый робот-курьер agregatory.pro"
          className="pointer-events-none absolute -right-24 top-auto bottom-10 z-0 w-[360px] animate-rise object-contain mask-fade-left sm:w-[460px] md:-right-10 md:bottom-auto md:-top-[70px] md:h-[640px] md:w-[640px]"
        />
        <div className="relative z-10 h-full px-5 pb-28 pt-9 md:px-14 md:pt-11">
          <h1 className="max-w-[860px] animate-rise font-display text-[44px] font-semibold leading-[.92] tracking-[-0.035em] sm:text-[64px] lg:text-[88px]">
            Ваш ресторан в&nbsp;агрегаторах{" "}
            <span className="block pl-[1.62em]">под ключ</span>
          </h1>
          <div className="mt-[34px] flex animate-rise-delay flex-col items-start gap-6 md:flex-row md:items-end md:gap-10">
            <p className="max-w-[430px] text-[1.15em] leading-[1.2] md:text-[1.3em]">
              выводим в&nbsp;Яндекс Еду и&nbsp;Деливери, продвигаем и&nbsp;ведём аккаунт, пока вы&nbsp;готовите
            </p>
            <div className="flex flex-col items-start gap-2.5">
              <a
                href="#lead"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-primary px-[30px] py-[18px] text-[1.06em] font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                оставить заявку
              </a>
              <span className="text-[0.82em] text-muted-foreground">консультация бесплатно</span>
            </div>
          </div>
        </div>
        <ul aria-label="Для кого" className="absolute bottom-[22px] left-5 z-10 flex flex-wrap gap-2 pr-5 md:left-14">
          {TAGS.map((t) => (
            <li key={t} className="rounded-full bg-cream px-3.5 py-[7px] text-[0.82em] text-foreground">
              {t}
            </li>
          ))}
        </ul>
      </section>

      <section
        id="steps"
        aria-label="Этапы работы"
        className="grid animate-up scroll-mt-4 grid-cols-1 gap-7 rounded-t-[40px] bg-surface px-5 pb-[34px] pt-[30px] text-cream sm:grid-cols-2 md:px-14 lg:grid-cols-[220px_repeat(4,1fr)]"
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
