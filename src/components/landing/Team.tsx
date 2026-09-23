import Icon from "@/components/ui/icon";
import useReveal from "@/hooks/use-reveal";

const PEOPLE = [
  {
    name: "Юрий Ситников",
    photo: "/team-yuriy.webp",
    exp: "15 лет общепит · 5 лет доставка",
    facts: [
      "Руководитель агрегаторов (Ginza Project, Faces Team, GrigGroup)",
      "Преподаватель Novikov Business School",
      "Модератор «Тема Еды» 2023–2026",
      "Эксперт Яндекс Еда «Рецепты Роста», «Консалтинг для региональных рестораторов»",
      "Сертифицированный эксперт FORBES Экспертиза",
    ],
    link: { label: "читать FORBES", href: "https://blogs.forbes.ru/author/sitnikov/" },
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
    link: { label: "профиль в Novikov School", href: "https://novikovspace.com/school/chefs/liliya-kovalchuk" },
  },
];

const Team = () => {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="team" ref={ref} className="scroll-mt-4 px-5 pb-20 md:px-14 md:pb-28">
      <div className="reveal mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <h2 className="font-display text-[44px] font-semibold leading-[.92] tracking-[-0.035em] md:text-[72px]">
          кто мы?
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
            className={`reveal group flex flex-col rounded-[28px] p-7 transition-transform duration-500 hover:-translate-y-1 md:p-10 ${
              i % 2 === 1 ? "bg-pale text-foreground" : "bg-surface text-cream"
            }`}
          >
            <div className="flex items-center gap-5">
              <img
                src={p.photo}
                alt={`${p.name} — эксперт по продвижению ресторанов на Яндекс Еде, agregatory.pro`}
                width={400}
                height={400}
                loading="lazy"
                decoding="async"
                className={`h-20 w-20 shrink-0 rounded-full border-2 object-cover object-top grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0 md:h-24 md:w-24 ${
                  i % 2 === 1 ? "border-foreground/20" : "border-brand"
                }`}
              />
              <div>
                <h3 className="font-display text-[1.6em] font-semibold leading-tight tracking-[-0.03em] md:text-[2.1em]">
                  {p.name}
                </h3>
                <div
                  className={`mt-2 inline-flex rounded-full px-4 py-2 text-[0.85em] font-medium ${
                    i % 2 === 1 ? "bg-foreground text-brand" : "bg-brand text-foreground"
                  }`}
                >
                  {p.exp}
                </div>
              </div>
            </div>
            <ul
              className={`mt-8 flex-1 space-y-3.5 border-t pt-7 leading-snug ${
                i % 2 === 1 ? "border-foreground/20 text-foreground/80" : "border-cream/20 text-cream-muted"
              }`}
            >
              {p.facts.map((f) => (
                <li key={f} className="flex gap-3">
                  <Icon
                    name="Check"
                    size={18}
                    className={`mt-0.5 shrink-0 ${i % 2 === 1 ? "text-foreground" : "text-brand"}`}
                  />
                  {f}
                </li>
              ))}
            </ul>
            {p.link && (
              <a
                href={p.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-7 inline-flex w-fit items-center gap-2 rounded-xl px-6 py-3.5 font-medium transition-transform hover:-translate-y-0.5 ${
                  i % 2 === 1 ? "bg-foreground text-brand" : "bg-brand text-foreground"
                }`}
              >
                {p.link.label}
                <Icon name="ArrowUpRight" size={18} />
              </a>
            )}
          </article>
        ))}
      </div>

    </section>
  );
};

export default Team;