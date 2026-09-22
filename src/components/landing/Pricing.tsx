import Icon from "@/components/ui/icon";
import useReveal from "@/hooks/use-reveal";

const PLANS = [
  {
    name: "для действующих",
    tag: "уже на сервисе",
    price: "от 25 000 ₽",
    period: "в месяц*",
    text: "Для тех партнёров, которые уже работают на сервисе и им требуется помощь",
    items: [
      "Аудит проекта",
      "Настройка акций и продвижение",
      "Обучение персонала",
      "Консультации",
      "Контроль рейтинга и качества",
      "Поддержка в рабочих чатах 24/7",
    ],
    accent: false,
  },
  {
    name: "для новичков",
    tag: "запуск с нуля",
    price: "от 35 000 ₽",
    period: "в месяц*",
    text: "Для тех, кто только хочет запустить доставку на агрегаторах. Полное введение в работу и поддержка на всех этапах",
    items: [
      "Регистрация на сервисе",
      "Создание и настройка ЛК",
      "Обучение персонала",
      "Заполнение контента",
      "Настройка акций и продвижения",
      "Запуск",
      "Контроль рейтинга и качества",
      "Консультации",
      "Поддержка в рабочих чатах 24/7",
    ],
    accent: true,
  },
];

const Pricing = () => {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="pricing" ref={ref} className="scroll-mt-4 px-5 py-20 md:px-14 md:py-28">
      <div className="reveal mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <h2 className="font-display text-[44px] font-semibold leading-[.92] tracking-[-0.035em] md:text-[72px]">
          стоимость
          <span className="block pl-[1.2em] text-muted-foreground">услуг</span>
        </h2>
        <p className="max-w-[380px] text-[1.05em] leading-snug">
          Предлагаем тарифы для старта доставки с&nbsp;нуля или усиления текущих позиций ресторана на&nbsp;агрегаторе.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {PLANS.map((p, i) => (
          <article
            key={p.name}
            style={{ transitionDelay: `${i * 120}ms` }}
            className={`reveal flex flex-col rounded-[28px] p-7 transition-transform duration-500 hover:-translate-y-1 md:p-10 ${
              p.accent ? "bg-pale text-foreground" : "bg-surface text-cream"
            }`}
          >
            <span
              className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-[0.82em] font-semibold ${
                p.accent ? "bg-foreground text-brand" : "bg-brand text-foreground"
              }`}
            >
              <Icon name={p.accent ? "Rocket" : "TrendingUp"} size={16} />
              {p.tag}
            </span>

            <h3 className="mt-6 font-display text-[1.9em] font-semibold leading-[.95] tracking-[-0.03em] md:text-[2.4em]">
              {p.name}
            </h3>
            <div className="mt-5 flex items-baseline gap-2">
              <span className="font-display text-[2.2em] font-semibold leading-none tracking-[-0.03em] md:text-[2.8em]">
                {p.price}
              </span>
              <span className={`text-[0.9em] ${p.accent ? "text-foreground/70" : "text-cream-muted"}`}>
                {p.period}
              </span>
            </div>
            <p className={`mt-4 max-w-[400px] leading-snug ${p.accent ? "text-foreground/80" : "text-cream-muted"}`}>
              {p.text}
            </p>

            <ul
              className={`mt-8 flex-1 space-y-3 border-t pt-7 leading-snug ${
                p.accent ? "border-foreground/20" : "border-cream/20"
              }`}
            >
              {p.items.map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <Icon
                    name="Check"
                    size={18}
                    className={`mt-0.5 shrink-0 ${p.accent ? "text-foreground" : "text-brand"}`}
                  />
                  {t}
                </li>
              ))}
            </ul>

            <a
              href="#lead"
              className={`mt-8 inline-flex h-14 items-center justify-center rounded-xl font-medium transition-transform hover:-translate-y-0.5 ${
                p.accent ? "bg-foreground text-brand" : "bg-brand text-foreground"
              }`}
            >
              выбрать тариф
            </a>
          </article>
        ))}
      </div>

      <p className="reveal mt-6 text-[0.82em] text-muted-foreground">
        * Точная стоимость зависит от количества точек и объёма работ. Владеете сетью — для вас индивидуальные условия.
      </p>
    </section>
  );
};

export default Pricing;