import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Header from "@/components/landing/Header";
import LeadForm from "@/components/landing/LeadForm";
import CrossLinks from "@/components/landing/CrossLinks";
import Contacts from "@/components/landing/Contacts";
import useSeo from "@/hooks/use-seo";
import { useState } from "react";
import { PARTNERS, USEFUL_SITES } from "@/data/partners";

const ALL = "все";
const SITES = "полезные сайты";
const FILTERS = [ALL, ...Array.from(new Set(PARTNERS.map((p) => p.category))), SITES];

const PartnersPage = () => {
  const { pathname } = useLocation();
  const [filter, setFilter] = useState(ALL);
  const partners = filter === ALL ? PARTNERS : PARTNERS.filter((p) => p.category === filter);
  const sites = filter === ALL || filter === SITES ? USEFUL_SITES : [];

  useSeo({
    title: "Партнёры и полезные сайты для ресторанов на агрегаторах | agregatory.pro",
    description:
      "Сервисы, которые мы рекомендуем ресторанам: своя доставка, аналитика прибыли, продвижение на картах. И полезные официальные сайты для партнёров Яндекс Еды.",
    path: pathname,
  });

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <div id="top">
        <Header />
        <section className="px-5 pb-10 pt-8 md:px-14 md:pb-20 md:pt-16">
          <nav aria-label="Хлебные крошки" className="mb-6 md:mb-8 flex items-center gap-2 text-[max(12px,0.85em)] text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              главная
            </Link>
            <Icon name="ChevronRight" size={14} />
            <span className="text-foreground">партнёры</span>
          </nav>
          <h1 className="max-w-[17ch] font-display text-[23px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[68px]">
            Партнёры и полезные сайты
          </h1>
          <p className="mt-6 max-w-[620px] text-[1.1em] leading-snug text-muted-foreground">
            Мы&nbsp;не&nbsp;занимаемся всем сразу. Там, где нужен отдельный инструмент, советуем тех, кем пользуемся сами в&nbsp;работе с&nbsp;проектами.
          </p>
        </section>
      </div>

      <section className="px-5 pb-11 md:px-14 md:pb-24">
        <div className="mb-6 flex flex-wrap gap-2 md:mb-8" role="tablist" aria-label="Фильтр по категориям">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`rounded-xl px-4 py-2 text-[max(12px,0.9em)] font-medium transition-colors ${
                filter === f ? "bg-primary text-primary-foreground" : "bg-pale text-foreground/75 hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {partners.length > 0 && (
          <>
            <h2 className="font-display text-[1.6em] font-semibold leading-tight tracking-[-0.025em] md:text-[2.1em]">
              Сервисы, которые мы рекомендуем
            </h2>
            <p className="mt-2 max-w-[620px] text-muted-foreground">
              Нажмите на&nbsp;сервис: расскажем, что он&nbsp;умеет и&nbsp;кому подойдёт.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 md:gap-4">
              {partners.map((p) => (
                <Link
                  key={p.slug}
                  to={`/partnery/${p.slug}`}
                  className="group flex flex-col rounded-[24px] bg-surface p-5 text-cream transition-transform duration-300 hover:-translate-y-1 md:p-6"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.logo}
                      alt={`Логотип ${p.name}`}
                      width={96}
                      height={96}
                      loading="lazy"
                      decoding="async"
                      className="h-12 w-12 shrink-0 rounded-xl bg-cream/[0.07] object-contain p-2"
                    />
                    <div className="min-w-0">
                      <div className="font-display text-[1.35em] font-semibold leading-tight tracking-[-0.02em]">{p.name}</div>
                      <div className="mt-1 inline-flex items-center gap-1.5 text-[max(12px,0.8em)] text-brand">
                        <Icon name={p.icon} size={14} />
                        {p.category}
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 flex-1 leading-snug text-cream-muted">{p.tagline}</p>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    {p.promo ? (
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-brand/40 px-2.5 py-1 text-[max(12px,0.78em)] text-brand">
                        <Icon name="Gift" size={14} />
                        есть промокод
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="inline-flex items-center gap-1.5 font-medium text-brand">
                      подробнее
                      <Icon name="ArrowRight" size={17} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {sites.length > 0 && (
          <div className={partners.length > 0 ? "mt-12 md:mt-16" : ""}>
            <h2 className="font-display text-[1.6em] font-semibold leading-tight tracking-[-0.025em] md:text-[2.1em]">
              Полезные сайты
            </h2>
            <p className="mt-2 max-w-[620px] text-muted-foreground">
              Официальные ресурсы, которые стоит держать в&nbsp;закладках каждому, кто работает с&nbsp;Яндекс Едой.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 md:gap-4">
              {sites.map((u) => (
                <a
                  key={u.url}
                  href={u.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex gap-4 rounded-[24px] bg-pale p-5 transition-transform duration-300 hover:-translate-y-1 md:p-6"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand text-foreground">
                    <Icon name={u.icon} size={22} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-3">
                      <span className="font-display text-[1.2em] font-semibold leading-tight tracking-[-0.02em]">{u.name}</span>
                      <Icon name="ArrowUpRight" size={18} className="mt-1 shrink-0 text-foreground/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                    <span className="mt-1 block text-[max(12px,0.8em)] text-foreground/55">{u.category}</span>
                    <span className="mt-2 block leading-snug text-foreground/75">{u.text}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-col justify-between gap-6 rounded-[24px] md:rounded-[32px] bg-pale p-4 md:flex-row md:items-center md:p-11">
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