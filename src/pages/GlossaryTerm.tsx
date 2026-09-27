import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Header from "@/components/landing/Header";
import LeadForm from "@/components/landing/LeadForm";
import CrossLinks from "@/components/landing/CrossLinks";
import Contacts from "@/components/landing/Contacts";
import useSeo from "@/hooks/use-seo";
import { GLOSSARY, getRelated, getSameGroup, getTerm } from "@/data/glossary";

const SITE = "https://agregatory.pro";

const GlossaryTermPage = () => {
  const { pathname } = useLocation();
  const { slug } = useParams();
  const term = getTerm(slug || "");

  const related = term ? getRelated(term) : [];
  const sameGroup = term ? getSameGroup(term) : [];
  const index = term ? GLOSSARY.findIndex((t) => t.slug === term.slug) : -1;
  const prev = index > 0 ? GLOSSARY[index - 1] : null;
  const next = index >= 0 && index < GLOSSARY.length - 1 ? GLOSSARY[index + 1] : null;

  useSeo({
    title: term
      ? `${term.term} — что это такое простыми словами | agregatory.pro`
      : "Термин не найден | agregatory.pro",
    description: term
      ? `${term.term}: ${term.short}${term.formula ? ` Формула: ${term.formula}.` : ""} Объясняем простым языком с примером расчёта для ресторанов на доставке.`
      : "Термин не найден в глоссарии доставки.",
    path: pathname,
    jsonLd: term
      ? [
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE}/` },
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
                acceptedAnswer: { "@type": "Answer", text: `${term.short} ${term.full}` },
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
            ],
          },
        ]
      : undefined,
  });

  if (!term) return <Navigate to="/slovar" replace />;

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Header />

      <section className="px-5 pb-10 pt-12 md:px-14 md:pb-14 md:pt-16">
        <nav
          aria-label="Хлебные крошки"
          className="mb-8 flex flex-wrap items-center gap-2 text-[0.85em] text-muted-foreground"
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

        <span className="inline-flex items-center gap-2 rounded-lg bg-foreground px-3 py-1.5 text-[0.78em] font-medium text-brand">
          {term.group}
        </span>

        <h1 className="mt-5 max-w-[20ch] font-display text-[38px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[58px]">
          {term.term}
        </h1>
        <p className="mt-6 max-w-[680px] text-[1.15em] leading-snug text-muted-foreground">
          {term.short}
        </p>
      </section>

      <section className="px-5 pb-16 md:px-14 md:pb-24">
        <div className="rounded-[32px] bg-surface p-7 text-cream md:p-10">
          <h2 className="font-display text-[1.4em] font-semibold tracking-[-0.02em]">
            что это значит
          </h2>
          <p className="mt-4 max-w-[760px] text-[1.05em] leading-relaxed text-cream-muted">
            {term.full}
          </p>

          {term.formula && (
            <div className="mt-7">
              <h3 className="text-[0.85em] uppercase tracking-wide text-cream-muted">
                как считать
              </h3>
              <p className="mt-2.5 rounded-2xl border border-cream/15 bg-cream/[0.05] px-5 py-4 font-mono text-[0.95em] leading-snug text-cream">
                {term.formula}
              </p>
            </div>
          )}

          {term.example && (
            <div className="mt-6 rounded-2xl bg-brand/12 p-5">
              <h3 className="flex items-center gap-2 text-[0.85em] uppercase tracking-wide text-brand">
                <Icon name="Lightbulb" size={15} />
                пример
              </h3>
              <p className="mt-2 text-[1em] leading-snug text-cream">{term.example}</p>
            </div>
          )}

          {term.links && term.links.length > 0 && (
            <div className="mt-7 border-t border-cream/12 pt-6">
              <h3 className="text-[0.85em] uppercase tracking-wide text-cream-muted">
                применить на практике
              </h3>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {term.links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-[0.9em] font-medium text-foreground transition-transform hover:-translate-y-0.5"
                  >
                    {l.label}
                    <Icon name="ArrowRight" size={15} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="px-5 pb-16 md:px-14 md:pb-24">
          <h2 className="font-display text-[30px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[44px]">
            связанные
            <span className="pl-3 text-muted-foreground">термины</span>
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {related.map((r) => (
              <Link
                key={r.slug}
                to={`/slovar/${r.slug}`}
                className="group rounded-[24px] bg-surface p-6 text-cream transition-transform hover:-translate-y-1"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="font-display text-[1.2em] font-semibold leading-tight tracking-[-0.02em]">
                    {r.term}
                  </span>
                  <Icon
                    name="ArrowUpRight"
                    size={17}
                    className="shrink-0 text-cream-muted transition-colors group-hover:text-brand"
                  />
                </span>
                <span className="mt-2.5 block leading-snug text-cream-muted">{r.short}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {sameGroup.length > 0 && (
        <section className="px-5 pb-16 md:px-14 md:pb-24">
          <h2 className="font-display text-[1.3em] font-semibold tracking-[-0.02em]">
            рядом по теме «{term.group}»
          </h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {sameGroup.map((g) => (
              <Link
                key={g.slug}
                to={`/slovar/${g.slug}`}
                title={g.short}
                className="rounded-xl border border-foreground/15 px-4 py-2.5 text-[0.9em] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
              >
                {g.term}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="px-5 pb-16 md:px-14 md:pb-24">
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

      <CrossLinks items={["audit", "reports", "calc"]} title="ещё" subtitle="полезное" />

      <LeadForm />
      <Contacts />
    </main>
  );
};

export default GlossaryTermPage;
