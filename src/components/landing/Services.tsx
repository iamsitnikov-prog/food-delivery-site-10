import { useState } from "react";
import Icon from "@/components/ui/icon";
import useReveal from "@/hooks/use-reveal";

const SERVICES = [
  {
    icon: "SearchCheck",
    title: "аудит карточки",
    short: "находим, где теряются заказы",
    text: "Смотрим рейтинг, фото, описания, цены и зоны доставки, сравниваем с конкурентами в радиусе 3 км. На выходе — список правок по приоритету и прогноз по выручке.",
    points: ["разбор 10+ конкурентов", "проверка фото и названий", "план правок на месяц"],
  },
  {
    icon: "PlugZap",
    title: "подключение к площадкам",
    short: "Яндекс Еда, Деливери и другие",
    text: "Берём на себя переписку с агрегаторами, договор и модерацию. Настраиваем точку, часы работы, зоны и время доставки, связываем с кассой.",
    points: ["от заявки до запуска за 7–14 дней", "все документы — на нас", "интеграция с кассой"],
  },
  {
    icon: "UtensilsCrossed",
    title: "настройка меню",
    short: "меню, которое продаёт",
    text: "Пересобираем структуру меню, пишем аппетитные названия и описания, делаем комбо и допродажи, выставляем цены с учётом комиссии площадки.",
    points: ["структура и категории", "комбо и допродажи", "цены с учётом комиссии"],
  },
  {
    icon: "Megaphone",
    title: "продвижение",
    short: "реклама и акции внутри агрегатора",
    text: "Запускаем и ведём рекламные кампании, промокоды и скидки, следим за рейтингом и отвечаем на отзывы, чтобы вас находили первыми.",
    points: ["ведение рекламного кабинета", "акции и промокоды", "работа с отзывами"],
  },
  {
    icon: "ChartNoAxesCombined",
    title: "отчётность",
    short: "прозрачные цифры каждый месяц",
    text: "Раз в месяц присылаем отчёт: заказы, средний чек, выручка, расходы на рекламу и что меняем дальше. Созваниваемся и договариваемся о плане.",
    points: ["ежемесячный отчёт", "созвон с разбором", "план на следующий месяц"],
  },
];

const Services = () => {
  const [active, setActive] = useState(0);
  const ref = useReveal<HTMLElement>();
  const s = SERVICES[active];

  return (
    <section id="services" ref={ref} className="scroll-mt-4 px-5 py-20 md:px-14 md:py-28">
      <div className="reveal mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <h2 className="font-display text-[44px] font-semibold leading-[.92] tracking-[-0.035em] md:text-[72px]">
          услуги
          <span className="block pl-[1.2em] text-muted-foreground">от&nbsp;аудита до&nbsp;роста</span>
        </h2>
        <p className="max-w-[360px] text-[1.05em] leading-snug">
          Берём любой этап отдельно или ведём ресторан в&nbsp;агрегаторах целиком — вы&nbsp;занимаетесь кухней.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <ul className="reveal border-t border-primary/25">
          {SERVICES.map((item, i) => (
            <li key={item.title}>
              <button
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                className={`group flex w-full items-center gap-5 border-b border-primary/25 px-2 py-5 text-left transition-colors md:py-6 ${
                  active === i ? "text-foreground" : "text-foreground/60 hover:text-foreground"
                }`}
              >
                <span className="w-8 text-[0.82em] font-semibold">0{i + 1}</span>
                <span className="flex-1">
                  <span className="block font-display text-[1.5em] font-semibold leading-tight tracking-[-0.02em] md:text-[1.9em]">
                    {item.title}
                  </span>
                  <span className="text-[0.9em] text-muted-foreground">{item.short}</span>
                </span>
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all ${
                    active === i
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-primary/30"
                  }`}
                >
                  <Icon name="ArrowUpRight" size={20} />
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="reveal flex">
        <div key={active} className="flex w-full animate-fade-in flex-col rounded-xl bg-surface p-7 text-cream md:p-10">
          <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-xl bg-brand text-foreground">
            <Icon name={s.icon} size={28} />
          </div>
          <h3 className="font-display text-[2em] font-semibold leading-none tracking-[-0.02em]">{s.title}</h3>
          <p className="mt-5 text-[1.02em] leading-relaxed text-cream-muted">{s.text}</p>
          <ul className="mt-8 space-y-3">
            {s.points.map((p) => (
              <li key={p} className="flex items-center gap-3 border-t border-cream/20 pt-3">
                <Icon name="Check" size={18} className="text-brand" />
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-8">
          <a
            href="#lead"
            className="inline-flex self-start rounded-xl bg-brand px-6 py-3.5 font-medium text-foreground transition-transform hover:-translate-y-0.5"
          >
            обсудить задачу
          </a>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
