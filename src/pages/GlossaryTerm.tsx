import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Header from "@/components/landing/Header";
import LeadForm from "@/components/landing/LeadForm";
import CrossLinks from "@/components/landing/CrossLinks";
import Contacts from "@/components/landing/Contacts";
import useSeo from "@/hooks/use-seo";
import {
  TERM_INDEX,
  getBrief,
  loadTerm,
  type GlossaryTerm,
} from "@/data/term-index";
import { termDescription, termTitle } from "@/lib/term-seo";
import { richText } from "@/lib/rich-text";
import TermSectionBlock from "@/components/glossary/TermSectionBlock";
import TermAside from "@/components/glossary/TermAside";

const SITE = "https://agregatory.pro";

const GlossaryTermPage = () => {
  const { pathname } = useLocation();
  const { slug } = useParams();
  const brief = getBrief(slug || "");

  // Полный текст термина — отдельным файлом: страница больше не тянет
  // за собой все 146 терминов глоссария.
  const [term, setTerm] = useState<GlossaryTerm | null>(null);
  useEffect(() => {
    let alive = true;
    setTerm(null);
    if (slug) {
      loadTerm(slug).then((t) => {
        if (alive) setTerm(t);
      });
    }
    return () => {
      alive = false;
    };
  }, [slug]);

  const index = brief ? TERM_INDEX.findIndex((t) => t.slug === brief.slug) : -1;
  const prev = index > 0 ? TERM_INDEX[index - 1] : null;
  const next =
    index >= 0 && index < TERM_INDEX.length - 1 ? TERM_INDEX[index + 1] : null;

  useSeo({
    title: term ? termTitle(term) : "Термин не найден | agregatory.pro",
    description: term
      ? termDescription({ ...term, hasExample: Boolean(term.example) })
      : "Термин не найден в глоссарии доставки.",
    path: pathname,
    jsonLd: term
      ? [
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Главная",
                item: `${SITE}/`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Глоссарий доставки",
                item: `${SITE}/slovar`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: term.term,
                item: `${SITE}/slovar/${term.slug}`,
              },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "DefinedTerm",
            "@id": `${SITE}/slovar/${term.slug}`,
            name: term.term,
            description: term.short,
            inDefinedTermSet: {
              "@type": "DefinedTermSet",
              name: "Глоссарий доставки",
              url: `${SITE}/slovar`,
            },
            inLanguage: "ru-RU",
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: `Что такое ${term.term}?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `${term.short} ${term.full}`,
                },
              },
              ...(term.formula
                ? [
                    {
                      "@type": "Question",
                      name: `Как считать ${term.term}?`,
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: `${term.formula}${term.example ? `. Пример: ${term.example}` : ""}`,
                      },
                    },
                  ]
                : []),
              ...(term.faq ?? []).map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            ],
          },
        ]
      : undefined,
  });

  if (!brief) return <Navigate to="/slovar" replace />;

  // Пока текст термина едет, показываем то, что уже известно из справочника —
  // заголовок и короткое определение. Пустого экрана читатель не видит.
  if (!term) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
        <Header />
        <section className="px-5 pb-16 pt-8 md:px-14 md:pt-16">
          <h1 className="max-w-[22ch] font-display text-[26px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[62px]">
            {brief.term}
          </h1>
          <p className="mt-5 max-w-[680px] text-[1.08em] leading-snug text-muted-foreground">
            {brief.short}
          </p>
        </section>
      </main>
    );
  }


  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Header />

      <section className="px-5 pb-7 pt-8 md:px-14 md:pb-14 md:pt-16">
        <nav
          aria-label="Хлебные крошки"
          className="mb-6 md:mb-8 flex flex-wrap items-center gap-2 text-[max(12px,0.85em)] text-muted-foreground"
        >
          <Link to="/" className="hover:text-foreground">
            главная
          </Link>
          <Icon name="ChevronRight" size={14} />
          <Link to="/slovar" className="hover:text-foreground">
            глоссарий
          </Link>
          <Icon name="ChevronRight" size={14} />
          <span className="text-foreground">{term.term}</span>
        </nav>

        <span className="inline-flex items-center gap-2 rounded-lg bg-foreground px-3 py-1.5 text-[max(12px,0.78em)] font-medium text-brand">
          {term.group}
        </span>

        <h1 className="mt-5 max-w-[20ch] font-display text-[23px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[58px]">
          {term.term}
        </h1>
        <p className="mt-6 max-w-[680px] text-[1.15em] leading-snug text-muted-foreground">
          {term.short}
        </p>
      </section>

      <section className="grid grid-cols-[minmax(0,1fr)] items-start gap-3 px-5 pb-11 md:px-14 md:pb-24 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-6">
        <div className="rounded-[24px] md:rounded-[32px] bg-surface p-4 text-cream md:p-10">
          {/* Общая колонка: текст и врезки одной ширины, иначе правый край рвётся */}
          <div className="max-w-[760px]">
            <h2
              id="chto-eto-znachit"
              className="scroll-mt-6 font-display text-[1.4em] font-semibold tracking-[-0.02em]"
            >
              что это значит
            </h2>
            <p className="mt-4 text-[1.05em] leading-relaxed text-cream-muted">
              {richText(term.full)}
            </p>

            {term.formula && (
              <div className="mt-7">
                <h3 id="kak-schitat" className="scroll-mt-6 text-[max(12px,0.85em)] uppercase tracking-wide text-cream-muted">
                  как считать
                </h3>
                <p className="mt-2.5 rounded-2xl border border-cream/15 bg-cream/[0.05] px-5 py-4 font-mono text-[0.95em] leading-snug text-cream">
                  {term.formula}
                </p>
              </div>
            )}

            {term.example && (
              <div className="mt-6 rounded-2xl bg-brand/12 p-4 md:p-5">
                <h3 id="primer" className="flex scroll-mt-6 items-center gap-2 text-[max(12px,0.85em)] uppercase tracking-wide text-brand">
                  <Icon name="Lightbulb" size={15} />
                  пример
                </h3>
                <p className="mt-2 text-[1em] leading-snug text-cream">
                  {term.example}
                </p>
              </div>
            )}

            {term.mistake && (
              <div className="mt-6 rounded-2xl border border-cream/15 bg-cream/[0.04] p-4 md:p-5">
                <h3 id="tipichnaya-oshibka" className="flex scroll-mt-6 items-center gap-2 text-[max(12px,0.85em)] uppercase tracking-wide text-cream-muted">
                  <Icon name="TriangleAlert" size={15} />
                  типичная ошибка
                </h3>
                <p className="mt-2 text-[1em] leading-snug text-cream">
                  {richText(term.mistake)}
                </p>
              </div>
            )}

            {term.sections?.map((s) => (
              <TermSectionBlock key={s.title} section={s} />
            ))}

            {term.links && term.links.length > 0 && (
              <div className="mt-7 border-t border-cream/12 pt-6">
                <h3 className="text-[max(12px,0.85em)] uppercase tracking-wide text-cream-muted">
                  применить на практике
                </h3>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {term.links.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-[max(12px,0.9em)] font-medium text-foreground transition-transform hover:-translate-y-0.5"
                    >
                      {l.label}
                      <Icon name="ArrowRight" size={15} />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <TermAside term={term} />
      </section>

      {term.faq && term.faq.length > 0 && (
        <section className="px-5 pb-11 md:px-14 md:pb-24">
          <h2
            id="chastye-voprosy"
            className="scroll-mt-6 font-display text-[23px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[44px]"
          >
            частые
            <span className="pl-3 text-muted-foreground max-sm:pl-0 max-sm:before:content-['_']">вопросы</span>
          </h2>
          <div className="mt-8 grid gap-3 md:gap-4 md:grid-cols-2">
            {term.faq.map((f) => (
              <div
                key={f.q}
                className="rounded-[24px] border border-foreground/12 p-4 md:p-6"
              >
                <h3 className="font-display text-[1.1em] font-semibold leading-tight tracking-[-0.02em]">
                  {f.q}
                </h3>
                <p className="mt-2.5 leading-snug text-muted-foreground">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="px-5 pb-11 md:px-14 md:pb-24">
        <div className="flex flex-col gap-3 border-t border-foreground/12 pt-6 md:flex-row md:items-center md:justify-between">
          {prev ? (
            <Link
              to={`/slovar/${prev.slug}`}
              className="inline-flex items-center gap-2 text-[0.95em] text-muted-foreground transition-colors hover:text-foreground"
            >
              <Icon name="ArrowLeft" size={16} />
              {prev.term}
            </Link>
          ) : (
            <span />
          )}

          <Link
            to="/slovar"
            className="inline-flex items-center gap-2 rounded-xl border border-foreground/20 px-5 py-3 text-[0.92em] font-medium transition-colors hover:bg-foreground hover:text-brand"
          >
            <Icon name="BookA" size={16} />
            весь глоссарий
          </Link>

          {next ? (
            <Link
              to={`/slovar/${next.slug}`}
              className="inline-flex items-center gap-2 text-[0.95em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {next.term}
              <Icon name="ArrowRight" size={16} />
            </Link>
          ) : (
            <span />
          )}
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

export default GlossaryTermPage;