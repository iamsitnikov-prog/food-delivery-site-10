import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Header from "@/components/landing/Header";
import LeadForm from "@/components/landing/LeadForm";
import CrossLinks from "@/components/landing/CrossLinks";
import Contacts from "@/components/landing/Contacts";
import useSeo from "@/hooks/use-seo";
import { GLOSSARY, GLOSSARY_GROUPS, type GlossaryGroup } from "@/data/glossary";

const SITE = "https://agregatory.pro";

const GlossaryPage = () => {
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<GlossaryGroup | "все">("все");

  useSeo({
    title: "Словарь терминов доставки и агрегаторов | agregatory.pro",
    description:
      "ДРР, ROMI, медианное место, фудкост, индекс качества — 41 термин доставки простым языком с формулами и примерами расчёта.",
    path: pathname,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Словарь", item: `${SITE}/slovar` },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "DefinedTermSet",
        name: "Словарь терминов доставки и агрегаторов",
        description:
          "Термины, которые используют рестораны при работе с агрегаторами доставки: метрики, реклама, операционка, документы.",
        inLanguage: "ru-RU",
        url: `${SITE}/slovar`,
        hasDefinedTerm: GLOSSARY.map((t) => ({
          "@type": "DefinedTerm",
          "@id": `${SITE}/slovar#${t.slug}`,
          name: t.term,
          description: t.short,
          inDefinedTermSet: `${SITE}/slovar`,
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: GLOSSARY.map((t) => ({
          "@type": "Question",
          name: `Что такое ${t.term}?`,
          acceptedAnswer: { "@type": "Answer", text: t.full },
        })),
      },
    ],
  });

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GLOSSARY.filter((t) => {
      const okGroup = group === "все" || t.group === group;
      const okQuery =
        !q || t.term.toLowerCase().includes(q) || t.short.toLowerCase().includes(q);
      return okGroup && okQuery;
    });
  }, [query, group]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <div id="top">
        <Header />
        <section className="px-5 pb-10 pt-12 md:px-14 md:pb-14 md:pt-16">
          <nav
            aria-label="Хлебные крошки"
            className="mb-8 flex items-center gap-2 text-[0.85em] text-muted-foreground"
          >
            <Link to="/" className="hover:text-foreground">
              главная
            </Link>
            <Icon name="ChevronRight" size={14} />
            <span className="text-foreground">словарь</span>
          </nav>
          <h1 className="max-w-[17ch] font-display text-[38px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[62px]">
            Словарь терминов доставки
          </h1>
          <p className="mt-6 max-w-[640px] text-[1.08em] leading-snug text-muted-foreground">
            {GLOSSARY.length} понятий, которые встречаются в кабинете агрегатора и в разговорах с
            менеджерами — объясняем простым языком, с формулами и примерами.
          </p>
        </section>
      </div>

      <section className="px-5 pb-8 md:px-14">
        <div className="flex flex-col gap-4">
          <label className="relative block max-w-[420px]">
            <Icon
              name="Search"
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Найти термин"
              className="w-full rounded-xl border border-foreground/15 bg-background py-3.5 pl-11 pr-4 text-[0.97em] outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/40"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {(["все", ...GLOSSARY_GROUPS] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGroup(g as GlossaryGroup | "все")}
                className={`rounded-xl border px-4 py-2.5 text-[0.88em] transition-colors ${
                  group === g
                    ? "border-foreground bg-foreground text-background"
                    : "border-foreground/15 text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 md:px-14 md:pb-24">
        {list.length === 0 ? (
          <p className="rounded-[24px] bg-surface p-8 text-cream-muted">
            Ничего не нашлось. Попробуйте другое слово или сбросьте фильтр.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {list.map((t) => (
              <article
                key={t.slug}
                id={t.slug}
                className="scroll-mt-24 rounded-[28px] bg-surface p-7 text-cream md:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-display text-[1.45em] font-semibold leading-tight tracking-[-0.02em] text-cream">
                    {t.term}
                  </h2>
                  <span className="shrink-0 rounded-lg bg-cream/10 px-2.5 py-1 text-[0.72em] text-cream-muted">
                    {t.group}
                  </span>
                </div>

                <p className="mt-3 text-[1em] leading-snug text-brand">{t.short}</p>
                <p className="mt-3 leading-relaxed text-cream-muted">{t.full}</p>

                {t.formula && (
                  <p className="mt-4 rounded-2xl border border-cream/15 bg-cream/[0.04] px-4 py-3 font-mono text-[0.88em] leading-snug text-cream">
                    {t.formula}
                  </p>
                )}

                {t.example && (
                  <p className="mt-3 text-[0.9em] leading-snug text-cream-muted">
                    <span className="text-cream">Пример. </span>
                    {t.example}
                  </p>
                )}

                {t.links && t.links.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {t.links.map((l) => (
                      <Link
                        key={l.to}
                        to={l.to}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-cream/25 px-3.5 py-2 text-[0.85em] text-cream transition-colors hover:border-brand hover:text-brand"
                      >
                        {l.label}
                        <Icon name="ArrowUpRight" size={14} />
                      </Link>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <CrossLinks
        items={["reports", "calc", "audit"]}
        title="применить"
        subtitle="на практике"
      />

      <LeadForm />
      <Contacts />
    </main>
  );
};

export default GlossaryPage;
