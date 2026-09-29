import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Header from "@/components/landing/Header";
import LeadForm from "@/components/landing/LeadForm";
import CrossLinks from "@/components/landing/CrossLinks";
import TermsStrip from "@/components/glossary/TermsStrip";
import Contacts from "@/components/landing/Contacts";
import Calculator from "@/components/calc/Calculator";
import useSeo from "@/hooks/use-seo";
import CalcSwitcher from "@/components/calc/CalcSwitcher";
import { VISIBLE_CALC_PAGES } from "@/data/calculators";

const CalculatorsPage = () => {
  const { pathname } = useLocation();

  useSeo({
    title: "Калькуляторы для ресторанов на агрегаторах | agregatory.pro",
    description:
      "Бесплатные калькуляторы для доставки: рентабельность заказа, ДРР, порог по НДС и окупаемость канала. Введите свои цифры и получите расчёт сразу.",
    path: pathname,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: "https://agregatory.pro/" },
          {
            "@type": "ListItem",
            position: 2,
            name: "Калькуляторы",
            item: "https://agregatory.pro/kalkulyatory",
          },
        ],
      },
    ],
  });

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <div id="top">
        <Header />
        <section className="px-5 pb-7 pt-8 md:px-14 md:pb-14 md:pt-16">
          <nav
            aria-label="Хлебные крошки"
            className="mb-6 md:mb-8 flex items-center gap-2 text-[max(12px,0.85em)] text-muted-foreground"
          >
            <Link to="/" className="hover:text-foreground">
              главная
            </Link>
            <Icon name="ChevronRight" size={14} />
            <span className="text-foreground">калькуляторы</span>
          </nav>
          <h1 className="max-w-[17ch] font-display text-[23px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[62px]">
            Калькуляторы экономики доставки
          </h1>
          <p className="mt-6 max-w-[620px] text-[1.08em] leading-snug text-muted-foreground">
            Введите свои цифры один раз&nbsp;— увидите рентабельность заказа, ДРР, окупаемость канала и&nbsp;порог по&nbsp;НДС. Бесплатно, без регистрации, данные никуда не&nbsp;отправляются.
          </p>

          <div className="mt-8">
            <CalcSwitcher />
          </div>
        </section>
      </div>

      <section className="px-5 pb-11 md:px-14 md:pb-24">
        <Calculator mode="all" />
      </section>

      <section className="px-5 pb-11 md:px-14 md:pb-24">
        <h2 className="font-display text-[27px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[48px]">
          отдельные
          <span className="pl-3 text-muted-foreground max-sm:pl-0 max-sm:before:content-['_']">калькуляторы</span>
        </h2>
        <div className="mt-8 grid gap-3 md:gap-4 md:grid-cols-2">
          {VISIBLE_CALC_PAGES.map((p) => (
            <Link
              key={p.slug}
              to={`/kalkulyatory/${p.slug}`}
              className={`group relative rounded-[28px] p-7 transition-transform hover:-translate-y-1 md:p-8 ${
                p.accent ? "bg-[#C7161B] text-white" : "bg-surface text-cream"
              }`}
            >
              {p.accent && (
                <span className="absolute right-6 top-6 rounded-lg bg-white/15 px-2.5 py-1 text-[max(12px,0.72em)] font-bold uppercase tracking-wide">
                  новое
                </span>
              )}
              <Icon name={p.icon} size={26} className={p.accent ? "text-white" : "text-brand"} />
              <h3 className="mt-4 font-display text-[1.35em] font-semibold leading-tight tracking-[-0.02em] max-sm:hyphens-auto max-sm:break-words">
                {p.navLabel}
              </h3>
              <p
                className={`mt-3 leading-relaxed ${p.accent ? "text-white/80" : "text-cream-muted"}`}
              >
                {p.lead}
              </p>
              <span
                className={`mt-5 inline-flex items-center gap-2 text-[0.92em] font-medium ${
                  p.accent ? "text-white" : "text-brand"
                }`}
              >
                открыть
                <Icon name="ArrowRight" size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <TermsStrip slugs={["yunit-ekonomika", "marzha-zakaza", "drr", "fudkost", "tochka-bezubytochnosti", "porog-nds"]} />

      <CrossLinks
        items={["reports", "compare", "audit"]}
        title="ещё"
        subtitle="полезное"
      />

      <LeadForm />
      <Contacts />
    </main>
  );
};

export default CalculatorsPage;