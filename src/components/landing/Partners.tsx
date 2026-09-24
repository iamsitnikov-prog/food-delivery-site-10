import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { useReveal } from "@/hooks/use-reveal";
import { PARTNERS } from "@/data/partners";

const Partners = () => {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="partners" ref={ref} className="hidden scroll-mt-4 px-5 pb-20 md:block md:px-14 md:pb-28">
      <div className="reveal mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <h2 className="font-display text-[38px] font-semibold leading-[.92] tracking-[-0.035em] md:text-[60px]">
          с кем работаем
        </h2>
        <p className="max-w-[420px] text-[1.02em] leading-snug text-muted-foreground">
          Сервисы, которые мы советуем клиентам и&nbsp;используем сами в&nbsp;работе с&nbsp;проектами.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {PARTNERS.map((p) => (
          <a
            key={p.slug}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="reveal group flex flex-col rounded-[28px] bg-surface p-7 text-cream transition-transform duration-500 hover:-translate-y-1 md:p-8"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-display text-[1.5em] font-semibold tracking-[-0.03em]">{p.name}</span>
              <span className="rounded-lg bg-brand px-3 py-1.5 text-[0.78em] font-medium text-foreground">
                {p.category}
              </span>
              {p.isNew && (
                <span className="rounded-lg border border-brand px-3 py-1.5 text-[0.78em] font-medium uppercase tracking-wide text-brand">
                  новое
                </span>
              )}
            </div>

            <p className="mt-4 text-[1.05em] leading-snug">{p.tagline}</p>
            <p className="mt-4 flex-1 text-[0.95em] leading-relaxed text-cream-muted">{p.description}</p>

            {p.promo && (
              <div className="mt-6 inline-flex w-fit items-center gap-3 rounded-xl border border-brand/40 px-4 py-3">
                <span className="text-[0.8em] uppercase tracking-wide text-cream-muted">промокод</span>
                <span className="font-display text-[1.15em] font-semibold tracking-[-0.01em] text-brand">
                  {p.promo.code}
                </span>
              </div>
            )}

            <span className="mt-7 inline-flex items-center gap-2 font-medium text-brand">
              перейти на сайт
              <Icon name="ArrowUpRight" size={18} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </a>
        ))}

        <div className="reveal flex flex-col justify-between rounded-[28px] bg-pale p-7 md:p-8">
          <div>
            <h3 className="font-display text-[1.5em] font-semibold leading-tight tracking-[-0.025em] md:text-[1.9em]">
              Подробнее о партнёрах
            </h3>
            <p className="mt-4 leading-relaxed text-foreground/75">
              Рассказываем, чем полезен каждый сервис и&nbsp;кому он&nbsp;подойдёт.
            </p>
          </div>
          <Link
            to="/partnery"
            className="mt-7 inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            смотреть партнёров
            <Icon name="ArrowRight" size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Partners;