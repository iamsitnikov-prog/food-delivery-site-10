import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Header from "@/components/landing/Header";
import LeadForm from "@/components/landing/LeadForm";
import CrossLinks from "@/components/landing/CrossLinks";
import Contacts from "@/components/landing/Contacts";
import useSeo from "@/hooks/use-seo";
import { CHECKLIST_META } from "@/data/checklist-meta";

const ChecklistsPage = () => {
  const { pathname } = useLocation();

  useSeo({
    title: "Чек-листы для ресторанов на агрегаторах | agregatory.pro",
    description:
      "Бесплатные чек-листы для доставки: запуск на агрегаторе и проверка карточки ресторана. Отмечайте пункты — прогресс сохраняется.",
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
            name: "Чек-листы",
            item: "https://agregatory.pro/chek-listy",
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
            className="mb-6 md:mb-8 flex items-center gap-2 text-[0.85em] text-muted-foreground"
          >
            <Link to="/" className="hover:text-foreground">
              главная
            </Link>
            <Icon name="ChevronRight" size={14} />
            <span className="text-foreground">чек-листы</span>
          </nav>
          <h1 className="max-w-[17ch] font-display text-[23px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[62px]">
            Чек-листы для доставки
          </h1>
          <p className="mt-6 max-w-[620px] text-[1.08em] leading-snug text-muted-foreground">
            Пошаговые списки без воды: что проверить при запуске и что чинить, если заказы просели.
            Отмечайте пункты — прогресс сохранится в браузере.
          </p>
        </section>
      </div>

      <section className="px-5 pb-11 md:px-14 md:pb-24">
        <div className="grid gap-3 md:gap-4 md:grid-cols-2">
          {CHECKLIST_META.map((p) => (
            <Link
              key={p.slug}
              to={`/chek-listy/${p.slug}`}
              className="group rounded-[28px] bg-surface p-4 text-cream transition-transform hover:-translate-y-1 md:p-8"
            >
              <div className="flex items-center justify-between gap-3 md:gap-4">
                <Icon name={p.icon} size={26} className="text-brand" />
                <span className="rounded-lg bg-cream/10 px-2.5 py-1 text-[0.78em] font-medium text-cream-muted">
                  {p.count} пунктов
                </span>
              </div>
              <h2 className="mt-4 font-display text-[1.35em] font-semibold leading-tight tracking-[-0.02em]">
                {p.navLabel}
              </h2>
              <p className="mt-3 leading-relaxed text-cream-muted">{p.lead}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-[0.92em] font-medium text-brand">
                открыть
                <Icon name="ArrowRight" size={16} />
              </span>
            </Link>
          ))}
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

export default ChecklistsPage;
