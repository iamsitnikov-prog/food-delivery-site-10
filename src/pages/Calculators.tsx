import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Header from "@/components/landing/Header";
import LeadForm from "@/components/landing/LeadForm";
import Contacts from "@/components/landing/Contacts";
import Calculator from "@/components/calc/Calculator";
import useSeo from "@/hooks/use-seo";
import { CALC_PAGES } from "@/data/calculators";

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
        <section className="px-5 pb-10 pt-12 md:px-14 md:pb-14 md:pt-16">
          <nav
            aria-label="Хлебные крошки"
            className="mb-8 flex items-center gap-2 text-[0.85em] text-muted-foreground"
          >
            <Link to="/" className="hover:text-foreground">
              главная
            </Link>
            <Icon name="ChevronRight" size={14} />
            <span className="text-foreground">калькуляторы</span>
          </nav>
          <h1 className="max-w-[17ch] font-display text-[38px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[62px]">
            Калькуляторы экономики доставки
          </h1>
          <p className="mt-6 max-w-[620px] text-[1.08em] leading-snug text-muted-foreground">
            Введите свои цифры один раз&nbsp;— увидите рентабельность заказа, ДРР, окупаемость канала и&nbsp;порог по&nbsp;НДС. Бесплатно, без регистрации, данные никуда не&nbsp;отправляются.
          </p>

          <div className="mt-8 flex flex-wrap gap-2.5">
            {CALC_PAGES.map((p) => (
              <Link
                key={p.slug}
                to={`/kalkulyatory/${p.slug}`}
                className="inline-flex items-center gap-2 rounded-xl border border-foreground/20 px-4 py-2.5 text-[0.88em] font-medium transition-colors hover:bg-foreground hover:text-brand"
              >
                <Icon name={p.icon} size={16} />
                {p.navLabel}
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="px-5 pb-16 md:px-14 md:pb-24">
        <Calculator mode="all" />
      </section>

      <section className="px-5 pb-16 md:px-14 md:pb-24">
        <h2 className="font-display text-[32px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[48px]">
          отдельные
          <span className="pl-3 text-muted-foreground">калькуляторы</span>
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {CALC_PAGES.map((p) => (
            <Link
              key={p.slug}
              to={`/kalkulyatory/${p.slug}`}
              className="group rounded-[28px] bg-surface p-7 text-cream transition-transform hover:-translate-y-1 md:p-8"
            >
              <Icon name={p.icon} size={26} className="text-brand" />
              <h3 className="mt-4 font-display text-[1.35em] font-semibold leading-tight tracking-[-0.02em]">
                {p.navLabel}
              </h3>
              <p className="mt-3 leading-relaxed text-cream-muted">{p.lead}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-[0.92em] font-medium text-brand">
                открыть
                <Icon name="ArrowRight" size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <LeadForm />
      <Contacts />
    </main>
  );
};

export default CalculatorsPage;
