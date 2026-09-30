import { useMemo } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Icon from "@/components/ui/icon";
import Header from "@/components/landing/Header";
import LeadForm from "@/components/landing/LeadForm";
import CrossLinks from "@/components/landing/CrossLinks";
import Contacts from "@/components/landing/Contacts";
import ChannelsBlock from "@/components/shared/ChannelsBlock";
import CityCaseBlock from "@/components/seo/CityCaseBlock";
import LinkCloud from "@/components/seo/LinkCloud";
import ResourceLinks from "@/components/seo/ResourceLinks";
import { getCityCase } from "@/data/city-cases";
import ExpertiseStrip from "@/components/landing/ExpertiseStrip";
import useSeo from "@/hooks/use-seo";
import PageNotFound from "@/pages/PageNotFound";
import { CITY_PAGES, SERVICE_PAGES, findPage } from "@/data/seo-pages";
import { PEOPLE } from "@/data/team";

const SeoLanding = () => {
  const { slug } = useParams();
  const { pathname } = useLocation();
  const page = findPage(slug);

  const jsonLd = useMemo(() => {
    if (!page) return [];
    return [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: "https://agregatory.pro/" },
          { "@type": "ListItem", position: 2, name: page.h1, item: `https://agregatory.pro${pathname}` },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: page.h1,
        description: page.description,
        provider: {
          "@type": "ProfessionalService",
          name: "agregatory.pro",
          telephone: "+7 931 002-82-22",
          employee: PEOPLE.map((p) => ({
            "@type": "Person",
            name: p.name,
            jobTitle: p.role,
          })),
        },
        areaServed: page.kind === "city" ? page.navLabel : "RU",
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: page.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ];
  }, [page, pathname]);

  useSeo({
    title: page?.title || "",
    description: page?.description || "",
    path: pathname,
    jsonLd,
  });

  if (!page) return <PageNotFound />;

  const others = (page.kind === "service" ? SERVICE_PAGES : CITY_PAGES).filter((p) => p.slug !== page.slug);
  const cityCase = page.kind === "city" ? getCityCase(page.slug) : undefined;
  const cross = page.kind === "service" ? CITY_PAGES : SERVICE_PAGES;
  const base = page.kind === "service" ? "/uslugi" : "/goroda";
  const crossBase = page.kind === "service" ? "/goroda" : "/uslugi";
  // У страниц услуг на десктопе: карточка с цифрой справа от заголовка
  // и тексты в две колонки — чтобы не оставалось пустых полей.
  const svc = page.kind === "service" && Boolean(page.when?.length);

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <div id="top" className="bg-background">
        <Header />

        <section className="px-5 pb-11 pt-8 md:px-14 md:pb-24 md:pt-16">
          <nav aria-label="Хлебные крошки" className="mb-6 md:mb-8 flex flex-wrap items-center gap-2 text-[max(12px,0.85em)] text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              главная
            </Link>
            <Icon name="ChevronRight" size={14} />
            <span className="text-foreground">{page.navLabel}</span>
          </nav>

          <div className={svc ? "lg:grid lg:grid-cols-[1fr_400px] lg:items-center lg:gap-12" : undefined}>
          <div>
          <h1 className="max-w-[16ch] font-display text-[23px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[68px]">
            {page.h1}
          </h1>
          <p className="mt-6 max-w-[560px] text-[1.1em] leading-snug text-muted-foreground">{page.lead}</p>

          <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <a
              href="#lead"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-4 font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              бесплатный анализ <Icon name="ArrowRight" size={18} />
            </a>
            <a href="tel:+79310028222" className="text-[0.95em] text-muted-foreground hover:text-foreground">
              +7 931 002-82-22
            </a>
          </div>
          </div>

          {svc && (
            <aside className="hidden rounded-[32px] bg-surface p-8 text-cream lg:block">
              {page.result ? (
                <>
                  <div className="text-[0.85em] font-medium text-cream-muted">результат в нашем кейсе</div>
                  <div
                    className={`mt-3 text-balance font-display font-semibold leading-[0.95] tracking-[-0.04em] text-brand ${
                      page.result.value.length > 9 ? "text-[2.8em]" : "text-[4.2em]"
                    }`}
                  >
                    {page.result.value.replace(/ (\S+)$/, "\u00a0$1")}
                  </div>
                  <div className="mt-3 font-display text-[1.15em] font-semibold leading-tight">{page.result.label}</div>
                  <p className="mt-3 text-[0.92em] leading-snug text-cream-muted">{page.result.text}</p>
                </>
              ) : (
                <ul className="divide-y divide-cream/15">
                  {[
                    ["до 7 дней", "от заявки до первого заказа"],
                    ["124", "проекта в работе"],
                    ["24/7", "команда в ваших рабочих чатах"],
                  ].map(([v, l]) => (
                    <li key={v} className="py-4 first:pt-0 last:pb-0">
                      <div className="font-display text-[2.6em] font-semibold leading-none tracking-[-0.04em] text-brand">{v}</div>
                      <div className="mt-2 text-[0.95em] text-cream-muted">{l}</div>
                    </li>
                  ))}
                </ul>
              )}
            </aside>
          )}
          </div>
        </section>
      </div>

      {page.when?.length ? (
        <section aria-label="Когда нужна услуга" className="px-5 pb-10 md:px-14 md:pb-20">
          <h2 className="font-display text-[1.5em] font-semibold leading-tight tracking-[-0.025em] md:text-[2.2em]">
            когда это нужно
          </h2>
          <div className="mt-5 grid gap-3 md:mt-8 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
            {page.when.map((w, i) => (
              <article key={w.t} className="rounded-[20px] bg-pale p-4 md:rounded-[24px] md:p-6">
                <span className="font-display text-[0.9em] font-semibold text-foreground/70">0{i + 1}</span>
                <h3 className="mt-2 font-display text-[1.1em] font-semibold leading-tight md:text-[1.2em]">{w.t}</h3>
                <p className="mt-2 text-[0.95em] leading-snug text-foreground/75">{w.d}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-[28px] md:rounded-[40px] bg-surface px-5 py-10 text-cream md:mx-3 md:px-14 md:py-24">
        <div className={svc ? "space-y-9 md:space-y-14" : "grid gap-6 md:gap-10 lg:grid-cols-[1fr_340px]"}>
          <div className={svc ? "grid gap-9 md:gap-12 lg:grid-cols-2 lg:gap-x-16" : "space-y-9 md:space-y-12"}>
            {page.blocks.map((b) => (
              <article key={b.h}>
                <h2 className="font-display text-[1.4em] font-semibold leading-tight tracking-[-0.025em] md:text-[2.2em]">
                  {b.h}
                </h2>
                <p className="mt-3 max-w-[680px] leading-relaxed text-cream-muted md:mt-4">{b.p}</p>
              </article>
            ))}

            {page.result && (
              <article className={`rounded-[24px] bg-brand p-5 text-foreground md:rounded-[28px] md:p-8 ${svc ? "lg:hidden" : ""}`}>
                <div className="font-display text-[2.6em] font-semibold leading-none tracking-[-0.04em] md:text-[4em]">
                  {page.result.value.replace(/ (\S+)$/, "\u00a0$1")}
                </div>
                <div className="mt-2 font-display text-[1.05em] font-semibold md:text-[1.2em]">{page.result.label}</div>
                <p className="mt-3 max-w-[560px] text-[0.95em] leading-snug text-foreground/80">{page.result.text}</p>
              </article>
            )}

            {cityCase && (
              <article id="case" className="scroll-mt-8">
                <h2 className="font-display text-[1.7em] font-semibold leading-tight tracking-[-0.025em] md:text-[2.2em]">
                  Наш кейс в {cityCase.cityIn}
                </h2>
                <div className="mt-5">
                  <CityCaseBlock data={cityCase} city={page.navLabel} inline />
                </div>
              </article>
            )}
          </div>

          <aside
            className={`h-fit rounded-[28px] border border-cream/20 p-4 md:p-7 ${
              svc ? "lg:grid lg:grid-cols-[180px_1fr_230px] lg:items-center lg:gap-10" : "lg:sticky lg:top-24 lg:self-start"
            }`}
          >
            <h2 className="font-display text-[1.35em] font-semibold text-brand">что входит</h2>
            <ul
              className={`mt-5 space-y-3 text-[0.95em] leading-snug text-cream-muted ${
                svc ? "lg:mt-0 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-3 lg:space-y-0" : ""
              }`}
            >
              {page.bullets.map((b) => (
                <li key={b} className="flex gap-3">
                  <Icon name="Check" size={18} className="mt-0.5 shrink-0 text-brand" />
                  {b}
                </li>
              ))}
            </ul>
            <a
              href="#lead"
              className={`mt-7 inline-flex w-full items-center justify-center rounded-xl bg-brand px-6 py-4 font-medium text-foreground ${
                svc ? "lg:mt-0" : ""
              }`}
            >
              обсудить задачу
            </a>
          </aside>
        </div>
      </section>

      {page.steps?.length ? (
        <section aria-label="Как проходит работа" className="px-5 pt-10 md:px-14 md:pt-24">
          <h2 className="font-display text-[1.5em] font-semibold leading-tight tracking-[-0.025em] md:text-[2.2em]">
            как проходит работа
          </h2>
          <ol className="mt-5 grid gap-3 md:mt-8 md:gap-4 lg:grid-cols-5">
            {page.steps.map((st, i) => (
              <li key={st.t} className="flex gap-3 rounded-[20px] border border-foreground/15 p-4 md:rounded-[24px] md:p-5 lg:block">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground font-display text-[0.9em] font-semibold text-brand">
                  {i + 1}
                </span>
                <div>
                  <h3 className="pt-1 font-display text-[1.05em] font-semibold leading-tight lg:mt-3 lg:pt-0">{st.t}</h3>
                  <p className="mt-1.5 text-[0.92em] leading-snug text-foreground/75 lg:mt-2">{st.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {page.needFromYou?.length || page.price ? (
        <section className="px-5 pt-10 md:px-14 md:pt-16">
          <div className="grid gap-3 md:grid-cols-2 md:gap-4">
            {page.needFromYou?.length ? (
              <article className="rounded-[24px] bg-pale p-5 md:rounded-[28px] md:p-8">
                <h2 className="font-display text-[1.3em] font-semibold leading-tight md:text-[1.6em]">что нужно от вас</h2>
                <ul className="mt-4 space-y-2.5 text-[0.95em] leading-snug">
                  {page.needFromYou.map((n) => (
                    <li key={n} className="flex gap-3">
                      <Icon name="Check" size={18} className="mt-0.5 shrink-0" />
                      {n}
                    </li>
                  ))}
                </ul>
              </article>
            ) : null}
            {page.price ? (
              <article className="flex flex-col rounded-[24px] bg-surface p-5 text-cream md:rounded-[28px] md:p-8">
                <h2 className="font-display text-[1.3em] font-semibold leading-tight md:text-[1.6em]">сколько стоит</h2>
                <div className="mt-4 font-display text-[1.9em] font-semibold leading-none tracking-[-0.03em] text-brand md:text-[2.4em]">
                  {page.price.value}
                </div>
                <p className="mt-3 text-[0.95em] leading-snug text-cream-muted">{page.price.text}</p>
                <a
                  href="#lead"
                  className="mt-6 inline-flex items-center justify-center self-start rounded-xl bg-brand px-6 py-3.5 font-medium text-foreground md:mt-auto"
                >
                  получить расчёт <Icon name="ArrowRight" size={18} className="ml-2" />
                </a>
              </article>
            ) : null}
          </div>
        </section>
      ) : null}

      <div className="pt-10 md:pt-24">
        <ExpertiseStrip />
      </div>

      <section className="px-5 pb-11 md:px-14 md:pb-24">
        <h2 className="font-display text-[27px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[52px]">
          вопросы
          <span className="pl-3 text-muted-foreground max-sm:pl-0 max-sm:before:content-['_']">и ответы</span>
        </h2>
        <Accordion type="single" collapsible defaultValue="q-0" className="mt-8 max-w-[840px] border-t border-primary/25">
          {page.faq.map((f, i) => (
            <AccordionItem key={f.q} value={`q-${i}`} className="border-b border-primary/25">
              <AccordionTrigger className="py-6 text-left font-display text-[1.2em] font-semibold hover:no-underline md:text-[1.4em]">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="pb-6 leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <ResourceLinks slug={page.slug} kind={page.kind} />

      <section className="px-5 pb-11 md:px-14 md:pb-24">
        <div className="grid gap-6 md:gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-[1.6em] font-semibold tracking-[-0.02em]">
              {page.kind === "service" ? "другие услуги" : "другие города"}
            </h2>
            {page.kind === "city" && (
              <p className="mt-3 max-w-[460px] text-[0.95em] leading-snug text-muted-foreground">
                Это лишь часть городов&nbsp;— работаем с&nbsp;ресторанами по&nbsp;всей России, от&nbsp;Калининграда до&nbsp;Дальнего Востока.
              </p>
            )}
            <LinkCloud items={others} base={base} />
          </div>
          <div>
            <h2 className="font-display text-[1.6em] font-semibold tracking-[-0.02em]">
              {page.kind === "service" ? "работаем по всей России" : "наши услуги"}
            </h2>
            {page.kind === "service" && (
              <p className="mt-3 max-w-[460px] text-[0.95em] leading-snug text-muted-foreground">
                Обучение и&nbsp;поддержка проходят онлайн, поэтому подключаем и&nbsp;ведём рестораны в&nbsp;любом городе страны. Ниже&nbsp;— города, по&nbsp;которым мы&nbsp;расписали местную специфику.
              </p>
            )}
            <LinkCloud items={cross} base={crossBase} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 pb-11 md:px-14 md:pb-24">
        <ChannelsBlock source={`seo:${page.slug}`} />
      </section>

      <CrossLinks
        items={["reports", "calc", "audit"]}
        title="ещё"
        subtitle="полезное"
      />

      <LeadForm />
      <Contacts />
    </main>
  );
};

export default SeoLanding;