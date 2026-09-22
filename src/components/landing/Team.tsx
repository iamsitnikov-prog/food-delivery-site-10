import useReveal from "@/hooks/use-reveal";

const PEOPLE = [
  {
    name: "Юрий Ситников",
    photo: "/team-yuriy.webp",
    exp: "15 лет общепит · 5 лет доставка",
    facts: [
      "Руководитель агрегаторов в проектах Ginza Project",
      "Преподаватель Novikov Business School",
      "Модератор «Тема Еды» 2023–2025",
      "Эксперт проектов Яндекс Еда «Рецепты Роста» и «Консалтинг для региональных рестораторов»",
    ],
  },
  {
    name: "Лилия Ковальчук",
    photo: "/team-liliya.webp",
    exp: "20 лет общепит · 15 лет доставка",
    facts: [
      "Эксперт-практик в доставке еды",
      "Ex. партнёр сети «Дагестанская Лавка»",
      "Автор курса «Сильная доставка» в Novikov Business School",
      "Модератор «Тема Еды» 2024–2025",
      "Эксперт проекта Яндекс Еда «Консалтинг для региональных рестораторов»",
    ],
  },
];

const Team = () => {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="team" ref={ref} className="scroll-mt-4 px-5 pb-20 md:px-14 md:pb-28">
      <div className="reveal mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <h2 className="font-display text-[44px] font-semibold leading-[.92] tracking-[-0.035em] md:text-[72px]">
          кто мы?
          <span className="block pl-[1.2em] text-muted-foreground">нам доверяют</span>
        </h2>
        <p className="max-w-[380px] text-[1.05em] leading-snug">
          Два опытных специалиста-практика в&nbsp;сфере доставки. За&nbsp;нами стоит целая команда специалистов поддержки и&nbsp;контента.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {PEOPLE.map((p, i) => (
          <article
            key={p.name}
            style={{ transitionDelay: `${i * 120}ms` }}
            className="reveal rounded-xl border border-primary/25 bg-pale p-6 md:p-9"
          >
            <div className="flex items-center gap-5">
              <img
                src={p.photo}
                alt={p.name}
                loading="lazy"
                className="h-20 w-20 shrink-0 rounded-full border border-primary/30 object-cover object-top md:h-24 md:w-24"
              />
              <div>
                <h3 className="font-display text-[1.6em] font-semibold leading-tight tracking-[-0.03em] md:text-[2.1em]">
                  {p.name}
                </h3>
                <div className="mt-2 inline-flex rounded-full bg-primary px-4 py-2 text-[0.85em] font-medium text-primary-foreground">
                  {p.exp}
                </div>
              </div>
            </div>
            <ul className="mt-7 space-y-3.5 border-t border-primary/25 pt-7">
              {p.facts.map((f) => (
                <li key={f} className="flex gap-3 leading-snug">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {f}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Team;