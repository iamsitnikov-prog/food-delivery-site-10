import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Header from "@/components/landing/Header";
import LeadForm from "@/components/landing/LeadForm";
import CrossLinks from "@/components/landing/CrossLinks";
import Contacts from "@/components/landing/Contacts";
import useSeo from "@/hooks/use-seo";
import { PARTNERS } from "@/data/partners";

const PartnersPage = () => {
  const { pathname } = useLocation();

  useSeo({
    title: "Партнёры — сервисы для ресторанов на агрегаторах | agregatory.pro",
    description:
      "Сервисы, которые мы рекомендуем клиентам и используем в работе с проектами: аналитика прибыли, инструменты для партнёров Яндекс Еды и Деливери.",
    path: pathname,
  });

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <div id="top">
        <Header />
        <section className="px-5 pb-14 pt-12 md:px-14 md:pb-20 md:pt-16">
          <nav aria-label="Хлебные крошки" className="mb-8 flex items-center gap-2 text-[0.85em] text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              главная
            </Link>
            <Icon name="ChevronRight" size={14} />
            <span className="text-foreground">партнёры</span>
          </nav>
          <h1 className="max-w-[17ch] font-display text-[40px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[68px]">
            Сервисы, которые мы рекомендуем
          </h1>
          <p className="mt-6 max-w-[620px] text-[1.1em] leading-snug text-muted-foreground">
            Мы&nbsp;не&nbsp;занимаемся всем сразу. Там, где нужен отдельный инструмент, советуем тех, кем пользуемся сами в&nbsp;работе с&nbsp;проектами.
          </p>
        </section>
      </div>

      <section className="px-5 pb-16 md:px-14 md:pb-24">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PARTNERS.map((p) => (
            <article
              key={p.slug}
              className="flex flex-col rounded-[28px] bg-surface p-7 text-cream md:p-8"
            >
              <div className="flex items-start gap-4">
                <img
                  src={p.logo}
                  alt={`Логотип ${p.name}`}
                  width={96}
                  height={96}
                  loading="lazy"
                  decoding="async"
                  className="h-12 w-12 shrink-0 rounded-xl bg-cream/[0.07] object-contain p-2"
                />
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-[1.6em] font-semibold leading-tight tracking-[-0.03em]">
                    {p.name}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-brand px-2.5 py-1 text-[0.75em] font-medium text-foreground">
                      {p.category}
                    </span>
                    {p.isNew && (
                      <span className="rounded-lg border border-brand px-2.5 py-1 text-[0.75em] font-medium uppercase tracking-wide text-brand">
                        новое
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="mt-4 min-h-[2.6em] text-[1.02em] leading-snug">{p.tagline}</p>

              <p className="mt-4 flex-1 text-[0.92em] leading-relaxed text-cream-muted">{p.description}</p>

              {p.promo && (
                <div className="mt-5 inline-flex w-fit items-center gap-2.5 rounded-xl border border-brand/40 px-3.5 py-2.5">
                  <span className="text-[0.75em] uppercase tracking-wide text-cream-muted">промокод</span>
                  <span className="font-display text-[1.05em] font-semibold tracking-[-0.01em] text-brand">
                    {p.promo.code}
                  </span>
                </div>
              )}

              <details className="group mt-6 border-t border-cream/15 pt-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[0.9em] font-medium text-cream-muted transition-colors hover:text-cream [&::-webkit-details-marker]:hidden">
                  что входит
                  <Icon
                    name="ChevronDown"
                    size={17}
                    className="shrink-0 transition-transform duration-300 group-open:rotate-180"
                  />
                </summary>

                <ul className="mt-5 space-y-2.5">
                  {p.points.map((point) => (
                    <li key={point} className="flex gap-2.5 text-[0.9em] leading-snug text-cream-muted">
                      <Icon name="Check" size={16} className="mt-0.5 shrink-0 text-brand" />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 rounded-[18px] bg-cream/[0.06] p-4">
                  <div className="text-[0.78em] uppercase tracking-wide text-cream-muted">кому подойдёт</div>
                  <p className="mt-2 text-[0.9em] leading-relaxed text-cream-muted">{p.forWhom}</p>
                </div>

                {p.promo && (
                  <p className="mt-4 text-[0.85em] leading-snug text-cream-muted">{p.promo.text}</p>
                )}
              </details>

              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 font-medium text-foreground transition-transform hover:-translate-y-0.5"
              >
                перейти на сайт
                <Icon name="ArrowUpRight" size={18} />
              </a>
            </article>
          ))}
        </div>

        <div className="mt-4 flex flex-col justify-between gap-6 rounded-[32px] bg-pale p-7 md:flex-row md:items-center md:p-11">
          <div>
            <h2 className="font-display text-[1.6em] font-semibold leading-tight tracking-[-0.025em] md:text-[2.1em]">
              Хотите стать партнёром?
            </h2>
            <p className="mt-3 max-w-[560px] leading-relaxed text-foreground/75">
              Если ваш сервис полезен ресторанам на&nbsp;агрегаторах и&nbsp;не&nbsp;дублирует то, что делаем мы,&nbsp;— напишите, обсудим.
            </p>
          </div>
          <a
            href="#lead"
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-primary px-7 py-4 font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            написать нам
            <Icon name="ArrowRight" size={18} />
          </a>
        </div>
      </section>

      <CrossLinks
        items={["audit", "reports", "calc"]}
        title="ещё"
        subtitle="полезное"
      />

      <LeadForm />
      <Contacts />
    </main>
  );
};

export default PartnersPage;