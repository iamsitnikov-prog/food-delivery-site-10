import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Header from "@/components/landing/Header";
import LeadForm from "@/components/landing/LeadForm";
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
        <div className="space-y-4">
          {PARTNERS.map((p) => (
            <article key={p.slug} className="grid gap-8 rounded-[32px] bg-surface p-7 text-cream md:p-11 lg:grid-cols-[1fr_340px]">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-[2em] font-semibold tracking-[-0.03em] md:text-[2.6em]">{p.name}</h2>
                  <span className="rounded-lg bg-brand px-3 py-1.5 text-[0.8em] font-medium text-foreground">
                    {p.category}
                  </span>
                  {p.isNew && (
                    <span className="rounded-lg border border-brand px-3 py-1.5 text-[0.8em] font-medium uppercase tracking-wide text-brand">
                      новое
                    </span>
                  )}
                </div>

                <p className="mt-4 text-[1.15em] leading-snug">{p.tagline}</p>
                <p className="mt-5 leading-relaxed text-cream-muted">{p.description}</p>

                <ul className="mt-8 space-y-3 border-t border-cream/20 pt-7">
                  {p.points.map((point) => (
                    <li key={point} className="flex gap-3 leading-snug text-cream-muted">
                      <Icon name="Check" size={18} className="mt-0.5 shrink-0 text-brand" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <aside className="flex h-fit flex-col gap-6 rounded-[24px] bg-cream/[0.06] p-6">
                <div>
                  <h3 className="font-display text-[1.1em] font-semibold">кому подойдёт</h3>
                  <p className="mt-3 text-[0.95em] leading-relaxed text-cream-muted">{p.forWhom}</p>
                </div>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 font-medium text-foreground transition-transform hover:-translate-y-0.5"
                >
                  перейти на сайт
                  <Icon name="ArrowUpRight" size={18} />
                </a>
              </aside>
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

      <LeadForm />
      <Contacts />
    </main>
  );
};

export default PartnersPage;