import Icon from "@/components/ui/icon";
import useReveal from "@/hooks/use-reveal";

const ITEMS = [
  {
    icon: "MessagesSquare",
    t: "рабочий чат 24/7",
    d: "Создаём общий чат с вашей командой. Отвечаем на вопросы администраторов и кухни в течение рабочего дня, а в пиковые часы — сразу.",
  },
  {
    icon: "FileBarChart",
    t: "отчёт раз в месяц",
    d: "Присылаем сводку: заказы, выручка, доля рекламных расходов, рейтинг и удержания. Видно, что сделано и что дало результат.",
  },
  {
    icon: "Video",
    t: "созвоны по задачам",
    d: "Раз в месяц разбираем цифры на созвоне и согласуем план на следующий период. Внеплановые созвоны — по запросу, без доплат.",
  },
  {
    icon: "Activity",
    t: "ежедневный контроль",
    d: "Следим за рейтингом, стоп-листами, ставками на аукционе и удержаниями. Реагируем до того, как проблема скажется на заказах.",
  },
];

const AfterLaunch = () => {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="after-launch" ref={ref} className="scroll-mt-4 px-5 pb-10 md:px-14 md:pb-28">
      <div className="reveal mb-6 md:mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <h2 className="font-display text-[24px] font-semibold leading-[.92] tracking-[-0.035em] md:text-[72px]">
          что дальше
          <span className="block pl-[1.2em] text-muted-foreground">после запуска</span>
        </h2>
        <p className="max-w-[380px] text-[1.05em] leading-snug">
          Мы&nbsp;не&nbsp;исчезаем после первого заказа. Ведём проект дальше: контроль, отчёты и&nbsp;связь каждый день.
        </p>
      </div>

      <div className="grid gap-3 md:gap-4 md:grid-cols-2">
        {ITEMS.map((item, i) => {
          const light = i % 2 === 1;
          return (
            <article
              key={item.t}
              style={{ transitionDelay: `${i * 100}ms` }}
              className={`reveal group flex gap-5 rounded-[28px] p-7 transition-transform duration-500 hover:-translate-y-1 md:p-9 ${
                light ? "bg-pale text-foreground" : "bg-surface text-cream"
              }`}
            >
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 ${
                  light ? "bg-foreground text-brand" : "bg-brand text-foreground"
                }`}
              >
                <Icon name={item.icon} size={22} />
              </span>
              <div>
                <h3 className="font-display text-[1.3em] font-semibold leading-tight tracking-[-0.02em] md:text-[1.55em]">
                  {item.t}
                </h3>
                <p className={`mt-3 text-[0.95em] leading-snug ${light ? "text-foreground/80" : "text-cream-muted"}`}>
                  {item.d}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default AfterLaunch;
