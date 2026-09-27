import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Header from "@/components/landing/Header";
import LeadForm from "@/components/landing/LeadForm";
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

          <div className="mt-8">
            <CalcSwitcher />
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
          {VISIBLE_CALC_PAGES.map((p) => (
            <Link
              key={p.slug}
              to={`/kalkulyatory/${p.slug}`}
              className={`group relative rounded-[28px] p-7 transition-transform hover:-translate-y-1 md:p-8 ${
                p.accent ? "bg-[#C7161B] text-white" : "bg-surface text-cream"
              }`}
            >
              {p.accent && (
                <span className="absolute right-6 top-6 rounded-lg bg-white/15 px-2.5 py-1 text-[0.72em] font-bold uppercase tracking-wide">
                  новое
                </span>
              )}
              <Icon name={p.icon} size={26} className={p.accent ? "text-white" : "text-brand"} />
              <h3 className="mt-4 font-display text-[1.35em] font-semibold leading-tight tracking-[-0.02em]">
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

      <section className="px-5 pb-16 md:px-14 md:pb-24">
        <Link
          to="/razbor-otchetov"
          className="group block rounded-[32px] bg-surface p-7 text-cream transition-transform hover:-translate-y-1 md:p-12"
        >
          <Icon name="FileSearch" size={30} className="text-brand" />
          <h2 className="mt-5 max-w-[20ch] font-display text-[26px] font-semibold leading-[1.05] tracking-[-0.02em] md:text-[36px]">
            Разберите свой отчёт агрегатора
          </h2>
          <p className="mt-4 max-w-[600px] leading-relaxed text-cream-muted">
            Калькуляторы считают по вашим предположениям, а отчёт показывает
            факт. Загрузите файл из кабинета площадки — увидите реальный процент
            удержаний, куда ушли деньги и что можно оспорить. Файл остаётся в
            вашем браузере.
          </p>
          <span className="mt-6 inline-flex items-center gap-2 font-medium text-brand">
            открыть разбор отчётов
            <Icon name="ArrowRight" size={18} />
          </span>
        </Link>
      </section>

      <LeadForm />
      <Contacts />
    </main>
  );
};

export default CalculatorsPage;