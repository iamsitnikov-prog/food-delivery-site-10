import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

type Card = {
  to: string;
  icon: string;
  title: string;
  text: string;
  cta: string;
  accent?: boolean;
};

const AUDIT: Card = {
  to: "/#free-audit",
  icon: "Gift",
  title: "Бесплатный разбор вашей точки",
  text: "Смотрим карточку глазами гостя, сравниваем с конкурентами в выдаче и показываем, где теряются заказы. Без обязательств и навязывания услуг.",
  cta: "получить разбор",
  accent: true,
};

const REPORTS: Card = {
  to: "/razbor-otchetov",
  icon: "FileSearch",
  title: "Разбор отчётов сервиса",
  text: "Загрузите отчёт из личного кабинета — покажем фактическую нагрузку на оборот, состав удержаний и позиции, по которым стоит уточнить основание. Файл остаётся в браузере.",
  cta: "разобрать отчёт",
};

const CALC: Card = {
  to: "/kalkulyatory",
  icon: "Calculator",
  title: "Калькуляторы экономики",
  text: "Рентабельность заказа, ДРР, окупаемость собственного канала и порог по НДС. Введите свои цифры — получите расчёт сразу.",
  cta: "открыть калькуляторы",
};

const COMPARE: Card = {
  to: "/sravnenie-agregatorov",
  icon: "GitCompare",
  title: "Сравнение игроков рынка",
  text: "Агрегаторы и конструкторы доставки: ставки за услуги, возможности и окупаемость. С расчётом на ваших цифрах.",
  cta: "сравнить",
};

const CHECKLISTS: Card = {
  to: "/chek-listy",
  icon: "ListChecks",
  title: "Чек-листы для работы",
  text: "Пошаговые проверки карточки, меню и фотографий — то, что влияет на позицию в выдаче и конверсию.",
  cta: "открыть чек-листы",
};

const GLOSSARY: Card = {
  to: "/slovar",
  icon: "BookA",
  title: "Глоссарий доставки",
  text: "ДРР, GMV, юнит-экономика, база расчёта, п. 14.7 — 146 терминов из отчётов и договоров простым языком, у каждого своя страница.",
  cta: "открыть глоссарий",
};

const POOL: Record<string, Card> = {
  audit: AUDIT,
  reports: REPORTS,
  calc: CALC,
  compare: COMPARE,
  checklists: CHECKLISTS,
  glossary: GLOSSARY,
};

export type CrossKey = keyof typeof POOL;

const CrossLinks = ({
  items,
  title = "полезное",
  subtitle,
}: {
  items: CrossKey[];
  title?: string;
  subtitle?: string;
}) => {
  const cards = items.map((k) => POOL[k]).filter(Boolean);
  if (!cards.length) return null;

  return (
    <section className="px-5 pb-16 md:px-14 md:pb-24">
      <h2 className="font-display text-[32px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[48px]">
        {title}
        {subtitle && <span className="pl-3 text-muted-foreground">{subtitle}</span>}
      </h2>
      <div
        className={`mt-8 grid gap-4 ${cards.length > 2 ? "md:grid-cols-3" : "md:grid-cols-2"}`}
      >
        {cards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className={`group flex flex-col rounded-[28px] p-7 transition-transform hover:-translate-y-1 md:p-8 ${
              c.accent ? "bg-[#C7161B] text-white" : "bg-surface text-cream"
            }`}
          >
            <Icon
              name={c.icon}
              size={26}
              className={c.accent ? "text-white" : "text-brand"}
            />
            <h3 className="mt-4 font-display text-[1.3em] font-semibold leading-tight tracking-[-0.02em]">
              {c.title}
            </h3>
            <p
              className={`mt-3 flex-1 leading-relaxed ${
                c.accent ? "text-white/80" : "text-cream-muted"
              }`}
            >
              {c.text}
            </p>
            <span
              className={`mt-5 inline-flex items-center gap-2 text-[0.92em] font-medium ${
                c.accent ? "text-white" : "text-brand"
              }`}
            >
              {c.cta}
              <Icon name="ArrowRight" size={16} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CrossLinks;
