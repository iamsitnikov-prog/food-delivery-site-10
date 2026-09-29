import { Link, useLocation, useParams, Navigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Icon from "@/components/ui/icon";
import Header from "@/components/landing/Header";
import LeadForm from "@/components/landing/LeadForm";
import CrossLinks from "@/components/landing/CrossLinks";
import Contacts from "@/components/landing/Contacts";
import ChecklistBoard from "@/components/checklist/ChecklistBoard";
import ChecklistCases from "@/components/checklist/ChecklistCases";
import useSeo from "@/hooks/use-seo";
import { CHECKLIST_PAGES, getChecklistPage } from "@/data/checklists";

const SITE = "https://agregatory.pro";

const ChecklistDetailPage = () => {
  const { slug } = useParams();
  const { pathname } = useLocation();
  const page = getChecklistPage(slug || "");

  useSeo({
    title: page?.title || "",
    description: page?.description || "",
    path: pathname,
    jsonLd: page
      ? [
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE}/` },
              {
                "@type": "ListItem",
                position: 2,
                name: "Чек-листы",
                item: `${SITE}/chek-listy`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: page.navLabel,
                item: `${SITE}/chek-listy/${page.slug}`,
              },
            ],
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
          {
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: page.h1,
            description: page.description,
            totalTime: "PT7D",
            inLanguage: "ru-RU",
            url: `${SITE}/chek-listy/${page.slug}`,
            step: page.groups.map((g, gi) => ({
              "@type": "HowToSection",
              position: gi + 1,
              name: g.title,
              itemListElement: g.items.map((it, ii) => ({
                "@type": "HowToStep",
                position: ii + 1,
                name: it.text,
                text: it.hint ? `${it.text}. ${it.hint}` : it.text,
                url: `${SITE}/chek-listy/${page.slug}#${gi + 1}-${ii + 1}`,
              })),
            })),
          },
        ]
      : undefined,
  });

  if (!page) return <Navigate to="/chek-listy" replace />;

  const others = CHECKLIST_PAGES.filter((p) => p.slug !== page.slug);

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <div id="top">
        <Header />
        <section className="px-5 pb-7 pt-8 md:px-14 md:pb-14 md:pt-16">
          <nav
            aria-label="Хлебные крошки"
            className="mb-8 flex flex-wrap items-center gap-2 text-[0.85em] text-muted-foreground"
          >
            <Link to="/" className="hover:text-foreground">
              главная
            </Link>
            <Icon name="ChevronRight" size={14} />
            <Link to="/chek-listy" className="hover:text-foreground">
              чек-листы
            </Link>
            <Icon name="ChevronRight" size={14} />
            <span className="text-foreground">{page.navLabel}</span>
          </nav>
          <h1 className="max-w-[20ch] font-display text-[27px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[56px]">
            {page.h1}
          </h1>
          <p className="mt-6 max-w-[620px] text-[1.08em] leading-snug text-muted-foreground">
            {page.lead}
          </p>
        </section>
      </div>

      <section className="px-5 pb-10 md:px-14 md:pb-20">
        <ChecklistBoard page={page} />
      </section>

      <section className="mx-auto max-w-[820px] px-5 pb-11 md:px-14 md:pb-24">
        {page.intro.map((p) => (
          <p key={p} className="mb-5 text-[1.05em] leading-relaxed text-foreground/85">
            {p}
          </p>
        ))}
      </section>

      <ChecklistCases slug={page.slug} />

      <section className="mx-auto max-w-[1240px] px-5 pb-11 md:px-14 md:pb-24">
        <h2 className="font-display text-[27px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[48px]">
          частые
          <span className="pl-3 text-muted-foreground">вопросы</span>
        </h2>
        <Accordion
          type="single"
          collapsible
          defaultValue="q-0"
          className="mt-8 border-t border-primary/25"
        >
          {page.faq.map((f, i) => (
            <AccordionItem key={f.q} value={`q-${i}`} className="border-b border-primary/25">
              <AccordionTrigger className="py-6 text-left font-display text-[1.15em] font-semibold hover:no-underline md:text-[1.35em]">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="pb-6 leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {others.length > 0 && (
        <section className="mx-auto max-w-[1240px] px-5 pb-11 md:px-14 md:pb-24">
          <h2 className="font-display text-[1.6em] font-semibold tracking-[-0.02em]">
            другие чек-листы
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {others.map((o) => (
              <Link
                key={o.slug}
                to={`/chek-listy/${o.slug}`}
                className="rounded-[24px] bg-surface p-6 text-cream transition-transform hover:-translate-y-1"
              >
                <Icon name={o.icon} size={22} className="text-brand" />
                <h3 className="mt-3 font-display text-[1.15em] font-semibold leading-tight">
                  {o.navLabel}
                </h3>
                <p className="mt-2 text-[0.92em] leading-snug text-cream-muted">{o.lead}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <CrossLinks
        items={["audit", "reports", "checklists"]}
        title="ещё"
        subtitle="полезное"
      />

      <LeadForm />
      <Contacts />
    </main>
  );
};

export default ChecklistDetailPage;