import { useCallback, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Header from "@/components/landing/Header";
import LeadForm from "@/components/landing/LeadForm";
import CrossLinks from "@/components/landing/CrossLinks";
import Contacts from "@/components/landing/Contacts";
import LetterNav from "@/components/glossary/LetterNav";
import TermSearch from "@/components/glossary/TermSearch";
import TermCard from "@/components/glossary/TermCard";
import useSeo from "@/hooks/use-seo";
import {
  CYRILLIC_LETTERS,
  GLOSSARY,
  GLOSSARY_GROUPS,
  LATIN_LETTERS,
  getRelated,
  type GlossaryGroup,
} from "@/data/glossary";

const SITE = "https://agregatory.pro";

const GlossaryPage = () => {
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<GlossaryGroup | "все">("все");
  const [letter, setLetter] = useState<string | null>(null);

  useSeo({
    title: "Глоссарий доставки: 146 терминов простыми словами",
    description: `ДРР, ROMI, GMV, юнит-экономика, фудкост, SLA — ${GLOSSARY.length} термин доставки простым языком с формулами, примерами и навигацией по буквам.`,
    path: pathname,
    jsonLd: [
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
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "DefinedTermSet",
        name: "Глоссарий доставки",
        description:
          "Термины, которые используют рестораны при работе с сервисами доставки: маркетинг и воронка, юнит-экономика, финансы, операционка и свой канал.",
        inLanguage: "ru-RU",
        url: `${SITE}/slovar`,
        hasDefinedTerm: GLOSSARY.map((t) => ({
          "@type": "DefinedTerm",
          "@id": `${SITE}/slovar/${t.slug}`,
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
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Термины доставки",
        numberOfItems: GLOSSARY.length,
        itemListElement: GLOSSARY.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: t.term,
          url: `${SITE}/slovar/${t.slug}`,
        })),
      },
    ],
  });

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const t of GLOSSARY) map[t.letter] = (map[t.letter] ?? 0) + 1;
    return map;
  }, []);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GLOSSARY.filter((t) => {
      const okGroup = group === "все" || t.group === group;
      const okLetter = !letter || t.letter === letter;
      const okQuery =
        !q ||
        t.term.toLowerCase().includes(q) ||
        t.short.toLowerCase().includes(q) ||
        t.full.toLowerCase().includes(q);
      return okGroup && okLetter && okQuery;
    });
  }, [query, group, letter]);

  const pickTerm = useCallback((slug: string) => {
    setQuery("");
    setGroup("все");
    setLetter(null);
    window.setTimeout(() => {
      const el = document.getElementById(slug);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-brand");
        window.setTimeout(() => el.classList.remove("ring-2", "ring-brand"), 1600);
      }
    }, 60);
  }, []);

  const reset = () => {
    setQuery("");
    setGroup("все");
    setLetter(null);
  };

  const filtered = query.trim() !== "" || group !== "все" || letter !== null;

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <div id="top">
        <Header />
        <section className="px-5 pb-7 pt-8 md:px-14 md:pb-14 md:pt-16">
          <nav
            aria-label="Хлебные крошки"
            className="mb-8 flex items-center gap-2 text-[0.85em] text-muted-foreground"
          >
            <Link to="/" className="hover:text-foreground">
              главная
            </Link>
            <Icon name="ChevronRight" size={14} />
            <span className="text-foreground">глоссарий</span>
          </nav>
          <h1 className="max-w-[17ch] font-display text-[38px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[62px]">
            Глоссарий доставки
          </h1>
          <p className="mt-6 max-w-[660px] text-[1.08em] leading-snug text-muted-foreground">
            {GLOSSARY.length} понятий из кабинета сервиса, отчётов и разговоров с менеджерами —
            простым языком, с формулами, примерами и связями между терминами.
          </p>
        </section>
      </div>

      <section className="px-5 pb-8 md:px-14">
        <div className="flex flex-col gap-4">
          <TermSearch value={query} onChange={setQuery} />

          <LetterNav
            cyrillic={CYRILLIC_LETTERS}
            latin={LATIN_LETTERS}
            active={letter}
            counts={counts}
            onPick={setLetter}
          />

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

          <p className="flex flex-wrap items-center gap-3 text-[0.88em] text-muted-foreground">
            <span>
              Показано {list.length} из {GLOSSARY.length}
            </span>
            {filtered && (
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1.5 text-foreground underline hover:no-underline"
              >
                <Icon name="X" size={14} />
                сбросить фильтры
              </button>
            )}
          </p>
        </div>
      </section>

      <section className="px-5 pb-11 md:px-14 md:pb-24">
        {list.length === 0 ? (
          <p className="rounded-[24px] bg-surface p-8 text-cream-muted">
            Ничего не нашлось. Попробуйте другое слово или{" "}
            <button type="button" onClick={reset} className="text-brand underline hover:no-underline">
              сбросьте фильтры
            </button>
            .
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {list.map((t) => (
              <TermCard
                key={t.slug}
                term={t}
                related={getRelated(t)}
                onPickTerm={pickTerm}
              />
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
