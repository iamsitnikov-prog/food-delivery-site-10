import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Header from "@/components/landing/Header";
import LeadForm from "@/components/landing/LeadForm";
import Contacts from "@/components/landing/Contacts";
import useSeo from "@/hooks/use-seo";
import { CITY_PAGES, SERVICE_PAGES } from "@/data/seo-pages";

type Props = { kind: "service" | "city" };

const COPY = {
  service: {
    h1: "Услуги по продвижению на агрегаторах",
    lead: "Подключение, настройка кабинета, продвижение, рейтинг и обучение команды — выберите, что нужно вашему заведению.",
    title: "Услуги по продвижению ресторана в Яндекс Еде — agregatory.pro",
    description:
      "Полный список услуг: подключение к Яндекс Еде, настройка вендора, аудит кабинета, снижение ДРР, повышение рейтинга, обучение персонала.",
    base: "/uslugi",
  },
  city: {
    h1: "Работаем с ресторанами по всей России",
    lead: "Обучение и поддержка проходят онлайн, команда 24/7 в ваших рабочих чатах. Выберите свой город.",
    title: "Продвижение ресторанов на агрегаторах по городам России",
    description:
      "Продвигаем рестораны в Яндекс Еде и Деливери в Москве, Санкт-Петербурге, Самаре, Череповце и других городах России.",
    base: "/goroda",
  },
};

const SeoIndex = ({ kind }: Props) => {
  const { pathname } = useLocation();
  const copy = COPY[kind];
  const items = kind === "service" ? SERVICE_PAGES : CITY_PAGES;

  useSeo({ title: copy.title, description: copy.description, path: pathname });

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <div id="top">
        <Header />
        <section className="px-5 pb-14 pt-12 md:px-14 md:pb-20 md:pt-16">
          <nav aria-label="Хлебные крошки" className="mb-8 flex items-center gap-2 text-[0.85em] text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              главная
            </Link>
            <Icon name="ChevronRight" size={14} />
            <span className="text-foreground">{kind === "service" ? "услуги" : "города"}</span>
          </nav>
          <h1 className="max-w-[18ch] font-display text-[40px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[68px]">
            {copy.h1}
          </h1>
          <p className="mt-6 max-w-[560px] text-[1.1em] leading-snug text-muted-foreground">{copy.lead}</p>
        </section>
      </div>

      <section className="px-5 pb-16 md:px-14 md:pb-24">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const light = i % 2 === 1;
            return (
              <Link
                key={item.slug}
                to={`${copy.base}/${item.slug}`}
                className={`group flex flex-col rounded-[28px] p-7 transition-transform duration-500 hover:-translate-y-1 md:p-8 ${
                  light ? "bg-pale text-foreground" : "bg-surface text-cream"
                }`}
              >
                <h2 className="font-display text-[1.45em] font-semibold leading-[1.05] tracking-[-0.025em]">
                  {item.navLabel}
                </h2>
                <p className={`mt-4 flex-1 text-[0.95em] leading-relaxed ${light ? "text-foreground/75" : "text-cream-muted"}`}>
                  {item.lead}
                </p>
                <span className={`mt-6 inline-flex items-center gap-2 text-[0.92em] font-medium ${light ? "text-foreground" : "text-brand"}`}>
                  подробнее
                  <Icon name="ArrowRight" size={17} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <LeadForm />
      <Contacts />
    </main>
  );
};

export default SeoIndex;
