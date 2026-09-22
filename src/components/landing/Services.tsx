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
  const ref = useReveal<HTMLElement>();

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((item, i) => (
          <article
            key={item.title}
            style={{ transitionDelay: `${i * 90}ms` }}
            className="reveal group flex flex-col rounded-[28px] bg-surface p-7 text-cream transition-transform duration-500 hover:-translate-y-1 md:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-foreground transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                <Icon name={item.icon} size={24} />
              </span>
              <span className="font-display text-[1.1em] font-semibold text-cream/35">0{i + 1}</span>
            </div>

            <h3 className="mt-7 font-display text-[1.5em] font-semibold leading-[1.02] tracking-[-0.025em]">
              {item.title}
            </h3>
            <p className="mt-2 text-[0.92em] text-brand">{item.short}</p>
            <p className="mt-4 text-[0.95em] leading-relaxed text-cream-muted">{item.text}</p>

            <ul className="mt-7 flex-1 space-y-3 border-t border-cream/20 pt-6 text-[0.93em] leading-snug">
              {item.points.map((p) => (
                <li key={p} className="flex gap-3">
                  <Icon name="Check" size={18} className="mt-0.5 shrink-0 text-brand" />
                  {p}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="reveal mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <a
          href="#lead"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-7 py-4 font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          обсудить задачу
        </a>
        <span className="text-[0.92em] text-muted-foreground">подберём услуги под ваш ресторан</span>
      </div>
    </section>
  );
};

export default Services;