import Icon from "@/components/ui/icon";
import useReveal from "@/hooks/use-reveal";
import CountUp from "./CountUp";

const PLANS = [
  {
    name: "для действующих",
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
            className={`reveal tilt flex flex-col rounded-xl border p-6 md:p-9 ${
              p.accent ? "border-primary bg-primary/10" : "border-primary/25 bg-pale hover:border-primary"
            }`}
          >
            <h3 className="font-display text-[1.7em] font-semibold tracking-[-0.02em] md:text-[2em]">{p.name}</h3>
            <div className="mt-4 flex items-baseline gap-2">
              <CountUp
                value={p.price}
                className="font-display text-[2.2em] font-semibold leading-none tracking-[-0.03em] md:text-[2.8em]"
              />
              <span className="text-[0.9em] text-muted-foreground">{p.period}</span>
            </div>
            <p className="mt-4 max-w-[380px] leading-snug text-muted-foreground">{p.text}</p>

            <ul className="mt-7 space-y-3 border-t border-primary/25 pt-7">
              {p.items.map((t) => (
                <li key={t} className="flex items-start gap-3 leading-snug">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Icon name="Check" size={14} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>

            <a
              href="#lead"
              className="mt-8 inline-flex h-14 items-center justify-center rounded-xl bg-primary font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
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