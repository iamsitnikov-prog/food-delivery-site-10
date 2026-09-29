import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Header from "@/components/landing/Header";
import Contacts from "@/components/landing/Contacts";
import useSeo from "@/hooks/use-seo";

const SECTIONS = [
  {
    to: "/uslugi",
    icon: "Wrench",
    label: "услуги",
    note: "Подключение, настройка и продвижение на агрегаторах",
  },
  {
    to: "/blog",
    icon: "Newspaper",
    label: "блог",
    note: "Разборы правил сервисов и практика доставки",
  },
  {
    to: "/kalkulyatory",
    icon: "Calculator",
    label: "калькуляторы",
    note: "Рентабельность, ДРР, НДС и модель доставки",
  },
  {
    to: "/chek-listy",
    icon: "ListChecks",
    label: "чек-листы",
    note: "Пошаговые списки для запуска и проверки карточки",
  },
  {
    to: "/slovar",
    icon: "BookA",
    label: "глоссарий доставки",
    note: "146 понятий доставки простым языком",
  },
  {
    to: "/sravnenie-agregatorov",
    icon: "GitCompare",
    label: "сравнение агрегаторов",
    note: "Яндекс, Купер и Чиббис: комиссии и условия",
  },
  {
    to: "/razbor-otchetov",
    icon: "FileSearch",
    label: "разбор отчётов",
    note: "Загрузите отчёт — покажем фактическую нагрузку на оборот",
  },
];

const PageNotFound = () => {
  const { pathname } = useLocation();

  useSeo({
    title: "Страница не найдена — agregatory.pro",
    description:
      "Такой страницы нет. Посмотрите услуги, блог, калькуляторы и чек-листы для работы ресторана с агрегаторами доставки.",
    path: pathname,
    noindex: true,
    skipCanonical: true,
  });

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <div id="top">
        <Header />

        <section className="px-5 pb-9 pt-8 md:px-14 md:pb-16 md:pt-16">
          <p className="font-display text-[1.1em] font-semibold text-muted-foreground">404</p>
          <h1 className="mt-3 max-w-[18ch] font-display text-[38px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[62px]">
            Такой страницы нет
          </h1>
          <p className="mt-6 max-w-[560px] text-[1.08em] leading-snug text-muted-foreground">
            Возможно, адрес изменился или в ссылке опечатка. Загляните в разделы ниже — скорее
            всего, нужное там.
          </p>

          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-4 font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              на главную
              <Icon name="ArrowRight" size={18} />
            </Link>
            <a
              href="tel:+79310028222"
              className="text-[0.95em] text-muted-foreground hover:text-foreground"
            >
              +7 931 002-82-22
            </a>
          </div>
        </section>
      </div>

      <section className="px-5 pb-11 md:px-14 md:pb-24">
        <h2 className="font-display text-[1.6em] font-semibold tracking-[-0.02em]">
          разделы сайта
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="group rounded-[24px] border border-foreground/12 p-6 transition-colors hover:border-foreground/40"
            >
              <Icon name={s.icon} size={22} className="text-foreground/60" />
              <h3 className="mt-3 font-display text-[1.1em] font-semibold leading-tight">
                {s.label}
              </h3>
              <p className="mt-2 text-[0.9em] leading-snug text-muted-foreground">{s.note}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[0.85em] text-foreground/70 transition-colors group-hover:text-foreground">
                открыть
                <Icon name="ArrowUpRight" size={15} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <Contacts />
    </main>
  );
};

export default PageNotFound;
