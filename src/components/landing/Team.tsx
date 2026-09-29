import Icon from "@/components/ui/icon";
import { useReveal } from "@/hooks/use-reveal";
import { PEOPLE, COURSE } from "@/data/team";

const Team = () => {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="team" ref={ref} className="scroll-mt-4 px-5 pb-10 md:px-14 md:pb-28">
      <div className="reveal mb-6 md:mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <h2 className="font-display text-[24px] font-semibold leading-[.92] tracking-[-0.035em] md:text-[72px]">
          кто мы?
        </h2>
        <p className="max-w-[380px] text-[1.05em] leading-snug">
          Два опытных специалиста-практика в&nbsp;сфере доставки. За&nbsp;нами стоит целая команда специалистов поддержки и&nbsp;контента.
        </p>
      </div>

      <div className="grid gap-3 md:gap-4 md:grid-cols-2">
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

            <div
              className={`mt-7 flex items-start gap-4 rounded-[20px] border-2 p-5 ${
                i % 2 === 1 ? "border-foreground/25 bg-foreground/[0.04]" : "border-brand bg-brand/10"
              }`}
            >
              <Icon
                name="GraduationCap"
                size={26}
                className={`mt-0.5 shrink-0 ${i % 2 === 1 ? "text-foreground" : "text-brand"}`}
              />
              <div>
                <div
                  className={`text-[0.78em] font-medium uppercase tracking-wide ${
                    i % 2 === 1 ? "text-foreground/60" : "text-brand"
                  }`}
                >
                  создатель и соавтор курса
                </div>
                <div className="mt-1.5 font-display text-[1.15em] font-semibold leading-tight tracking-[-0.02em] md:text-[1.3em]">
                  {COURSE}
                </div>
              </div>
            </div>

            <ul
              className={`mt-7 flex-1 space-y-3.5 border-t pt-7 leading-snug ${
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