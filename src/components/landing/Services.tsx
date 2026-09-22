import { useState } from "react";
import Icon from "@/components/ui/icon";
import useReveal from "@/hooks/use-reveal";

const SERVICES = [
  {
    icon: "FileSignature",
    title: "условия и регистрация",
    short: "от анкеты до готового личного кабинета",
    text: "Заполняем анкету и подписываем акцепт оферты. Заводим данные личного кабинета и настраиваем его. Разрабатываем персонализированные решения, учитывающие специфику вашего бизнеса, меню и целевых пользователей.",
    points: ["анкета и акцепт оферты", "заведение и настройка ЛК", "решения под ваш формат"],
  },
  {
    icon: "UtensilsCrossed",
    title: "функционал и контент",
    short: "вендор, SEO и продающее меню",
    text: "Настраиваем разделы вендора для эффективной работы ресторана на сервисе. Оптимизируем SEO, настраиваем теги, титульное фото, создаём продающий контент и заполняем все параметры меню.",
    points: ["настройка разделов вендора", "SEO, теги и титульное фото", "все параметры меню"],
  },
  {
    icon: "GraduationCap",
    title: "качество и обучение",
    short: "негатив, жалобы и персонал",
    text: "Работаем с негативными отзывами, удержаниями сервиса и жалобами пользователей, обращаясь в поддержку напрямую и отрабатывая каждую ситуацию. Обучаем весь персонал ресторана, который участвует в процессе доставки.",
    points: ["работа с негативом и удержаниями", "прямая связь с поддержкой", "обучение всей команды"],
  },
  {
    icon: "Headset",
    title: "поддержка 24/7",
    short: "мы в ваших рабочих чатах",
    text: "Наша команда круглосуточно находится в ваших рабочих чатах, оперативно отвечая на любые вопросы сотрудников ресторана. Мы обучаем правильному выполнению задач, но сами работу за вас не делаем. Работаем с вашими пользователями на возвращаемость и привлекаем гостей из доставки в офлайн-зал.",
    points: ["ответы в чатах круглосуточно", "работа на возвращаемость", "гости из доставки в зал"],
  },
  {
    icon: "Star",
    title: "рейтинг и индекс качества",
    short: "видимость и место на сервисе",
    text: "Формируем положительный рейтинг проекта, следим за видимостью ресторана на сервисе, за местом и индексом качества. Отслеживаем и работаем со всеми параметрами качественной работы.",
    points: ["рост рейтинга", "контроль индекса качества", "видимость в поиске сервиса"],
  },
  {
    icon: "Megaphone",
    title: "акции и продвижение",
    short: "ставки, аукцион и бюджет",
    text: "Анализируем других партнёров, выстраиваем конкурентные ставки на аукционе. Поддерживаем недельный бюджет. Выбираем и настраиваем акции для быстрого роста.",
    points: ["анализ конкурентов", "ставки на аукционе", "акции для быстрого роста"],
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
          наши
          <span className="block pl-[1.2em] text-muted-foreground">услуги</span>
        </h2>
        <p className="max-w-[360px] text-[1.05em] leading-snug">
          Обеспечиваем полный цикл запуска и&nbsp;продвижения вашего ресторана в&nbsp;доставке: от&nbsp;регистрации до&nbsp;лояльности гостей.
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