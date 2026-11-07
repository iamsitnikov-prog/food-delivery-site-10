import { SWIPE, SWIPE_ITEM } from "./swipe";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import useReveal from "@/hooks/use-reveal";

// Один компактный блок вместо четырёх отдельных (тест, разбор отчётов,
// калькуляторы, чек-листы): главная стала короче, инструменты остались в одном клике.
const TOOLS = [
  {
    to: "/testy/audit",
    icon: "ClipboardCheck",
    t: "проверка проекта за 3 минуты",
    d: "21 вопрос о рейтинге, экономике и контенте. В конце оценка и точки роста.",
  },
  {
    to: "/razbor-otchetov",
    icon: "FileBarChart",
    t: "разбор отчётов",
    d: "Загрузите отчёт из кабинета и увидите фактическую нагрузку на оборот и удержания.",
  },
  {
    to: "/kalkulyatory",
    icon: "Calculator",
    t: "калькуляторы",
    d: "Рентабельность заказа, ДРР, порог по НДС и выбор модели доставки.",
  },
  {
    to: "/chek-listy",
    icon: "ListChecks",
    t: "чек-листы",
    d: "Запуск, карточка, сезонный пик, контент, экономика и рейтинг по пунктам.",
  },
  {
    to: "/testy",
    icon: "GraduationCap",
    t: "тесты знаний",
    d: "4 теста по 50 вопросов о правилах сервиса и экономике доставки с пояснениями.",
  },
];

const ToolsHub = () => {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="tools" ref={ref} className="scroll-mt-4 px-5 pb-10 md:px-14 md:pb-28">
      <div className="reveal">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-4 py-2 text-[max(12px,0.82em)] font-semibold text-primary-foreground">
          <Icon name="Gift" size={16} />
          бесплатно и без регистрации
        </span>
        <h2 className="mt-5 font-display text-[24px] font-semibold leading-[.92] tracking-[-0.035em] md:text-[56px]">
          полезные инструменты
        </h2>
        <p className="mt-4 max-w-[540px] leading-snug text-muted-foreground">
          Посчитайте, проверьте и&nbsp;разберитесь сами. Если&nbsp;что-то не&nbsp;сходится, разберём вместе бесплатно.
        </p>

        <div className={`mt-8 ${SWIPE} md:gap-4 md:grid-cols-2 lg:grid-cols-5`}>
          {TOOLS.map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              className={`${SWIPE_ITEM} group flex min-w-0 flex-col rounded-[24px] bg-surface p-4 text-cream transition-transform hover:-translate-y-1 md:p-6`}
            >
              <Icon name={tool.icon} size={24} className="text-brand" />
              <h3 className="mt-4 font-display text-[1.1em] font-semibold leading-tight tracking-[-0.02em]">
                {tool.t}
              </h3>
              <p className="mt-2.5 flex-1 text-[0.9em] leading-snug text-cream-muted">{tool.d}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[max(12px,0.86em)] font-medium text-brand">
                открыть
                <Icon name="ArrowRight" size={15} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsHub;
