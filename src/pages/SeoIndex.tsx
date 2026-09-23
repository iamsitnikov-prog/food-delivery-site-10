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
    lead: "Подключаем и ведём заведения в любом городе страны: обучение и поддержка проходят онлайн, команда 24/7 в ваших рабочих чатах. Ниже — города, по которым мы отдельно расписали местную специфику.",
    title: "Продвижение ресторанов на агрегаторах по всей России",
    description:
      "Продвигаем рестораны в Яндекс Еде и Деливери по всей России — от Калининграда до Дальнего Востока. Работаем онлайн, поддержка 24/7.",
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

        {kind === "city" && (
          <div className="mt-6 flex flex-col items-start justify-between gap-6 rounded-[28px] border border-primary/30 p-7 md:flex-row md:items-center md:p-9">
            <div>
              <h2 className="font-display text-[1.5em] font-semibold tracking-[-0.025em]">вашего города нет в списке?</h2>
              <p className="mt-2 max-w-[560px] leading-snug text-muted-foreground">
                Это не&nbsp;ограничение&nbsp;— мы&nbsp;просто расписали специфику не&nbsp;для всех городов. Работаем с&nbsp;ресторанами по&nbsp;всей России: от&nbsp;Калининграда до&nbsp;Дальнего Востока, включая небольшие города.
              </p>
            </div>
            <a
              href="#lead"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-7 py-4 font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              обсудить ваш город <Icon name="ArrowRight" size={18} />
            </a>
          </div>
        )}
      </section>

      <LeadForm />
      <Contacts />
    </main>
  );
};

export default SeoIndex;