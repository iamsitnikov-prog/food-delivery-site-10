import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { PEOPLE, COURSE } from "@/data/team";

const ExpertiseStrip = () => (
  <section className="px-5 pb-11 md:px-14 md:pb-24">
    <div className="rounded-[24px] md:rounded-[32px] bg-pale p-4 md:p-11">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <h2 className="font-display text-[1.7em] font-semibold leading-tight tracking-[-0.025em] md:text-[2.3em]">
          кто ведёт ваш проект
        </h2>
        <p className="max-w-[420px] text-[0.95em] leading-snug text-foreground/70">
          Не&nbsp;менеджеры на&nbsp;потоке&nbsp;— практики, которые сами управляли доставкой в&nbsp;сетях и&nbsp;холдингах.
        </p>
      </div>

      <div className="mt-8 grid gap-3 md:gap-4 md:grid-cols-2">
        {PEOPLE.map((p) => (
          <article key={p.name} className="rounded-[24px] bg-background p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <img
                src={p.photo}
                alt={`${p.name} — эксперт по продвижению ресторанов на Яндекс Еде`}
                width={400}
                height={400}
                loading="lazy"
                decoding="async"
                className="h-16 w-16 shrink-0 rounded-full border-2 border-foreground/15 object-cover object-top"
              />
              <div className="min-w-0">
                <h3 className="font-display text-[1.25em] font-semibold leading-tight tracking-[-0.02em]">
                  {p.name}
                </h3>
                <div className="mt-1 text-[max(12px,0.85em)] text-foreground/70">{p.exp}</div>
              </div>
            </div>
            <p className="mt-4 text-[0.92em] leading-snug text-foreground/75">{p.role}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 flex flex-col justify-between gap-5 rounded-[24px] border-2 border-primary/25 p-4 md:p-6 md:flex-row md:items-center">
        <div className="flex items-start gap-3 md:gap-4">
          <Icon name="GraduationCap" size={26} className="mt-0.5 shrink-0" />
          <div>
            <div className="text-[max(12px,0.78em)] font-medium uppercase tracking-wide text-foreground/70">
              создатели и соавторы курса
            </div>
            <div className="mt-1.5 font-display text-[1.15em] font-semibold leading-tight tracking-[-0.02em] md:text-[1.3em]">
              {COURSE}
            </div>
          </div>
        </div>
        <Link
          to="/#team"
          className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          подробнее о нас
          <Icon name="ArrowRight" size={17} />
        </Link>
      </div>
    </div>
  </section>
);

export default ExpertiseStrip;
