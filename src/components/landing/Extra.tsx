import Icon from "@/components/ui/icon";
import useReveal from "@/hooks/use-reveal";

const ITEMS = [
  {
    icon: "PhoneCall",
    tag: "личная встреча",
    title: "консультация",
    price: "от 20 000 ₽",
    note: "от 60 минут",
    cta: "заказать консультацию",
    points: [
      "Ответы на любые вопросы и сложности, связанные с доставкой",
      "Возможность записи консультации для последующего просмотра",
      "Отправка резюме обсуждения после встречи",
      "Полезные материалы для персонала ресторана",
    ],
  },
  {
    icon: "ClipboardCheck",
    tag: "анализ проекта",
    title: "аудит ресторана на агрегаторе",
    price: "от 30 000 ₽",
    note: "разовая услуга",
    cta: "заказать аудит",
    points: [
      "Всестороннее изучение текущего состояния проекта на агрегаторе",
      "Анализ внешнего вида проекта глазами пользователя",
      "Изучение операционных и управленческих метрик",
      "Отчёт с результатами анализа и рекомендациями",
    ],
  },
];

const COURSE_POINTS = [
  "Обучение всех сотрудников команды доставки ресторана",
  "Теория и выполнение домашних заданий",
  "Итоговая аттестация сотрудников через тестирование",
  "Готовность команды к эффективной работе с агрегатором",
];

const PROGRAM = [
  { t: "экономика доставки", d: "расчёт прибыли и управление финансами" },
  { t: "работа с вендором", d: "разбор функционала и настройка параметров" },
  { t: "контент", d: "создание привлекательного профиля ресторана" },
  { t: "акции и продвижение", d: "эффективные акции и инструменты продвижения" },
  { t: "коммуникация", d: "работа с поддержкой и повышение лояльности гостей" },
];

const Extra = () => {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="extra" ref={ref} className="scroll-mt-4 px-5 pb-10 md:px-14 md:pb-28">
      <div className="reveal mb-6 md:mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <h2 className="font-display text-[24px] font-semibold leading-[.92] tracking-[-0.035em] md:text-[72px]">
          дополнительно
          <span className="block pl-[1.2em] text-muted-foreground">консультации и&nbsp;обучение</span>
        </h2>
        <p className="max-w-[380px] text-[1.05em] leading-snug">
          Повышаем эффективность вашей доставки: консультации, аудит и&nbsp;обучение сотрудников ресторана на&nbsp;агрегаторе.
        </p>
      </div>

      <div className="grid gap-3 md:gap-4 md:grid-cols-2">
        {ITEMS.map((item, i) => {
          const light = i === 1;
          return (
            <article
              key={item.title}
              style={{ transitionDelay: `${i * 110}ms` }}
              className={`reveal group flex flex-col overflow-hidden rounded-[28px] p-6 md:p-10 ${
                light ? "bg-pale text-foreground" : "bg-surface text-cream"
              }`}
            >
              <span
                className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-[max(12px,0.82em)] font-semibold ${
                  light ? "bg-foreground text-brand" : "bg-brand text-foreground"
                }`}
              >
                <Icon name={item.icon} size={16} />
                {item.tag}
              </span>
              <h3 className="mt-6 font-display text-[1.7em] font-semibold leading-[.95] tracking-[-0.03em] md:text-[2.2em]">
                {item.title}
              </h3>
              <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-display text-[1.8em] font-semibold leading-none tracking-[-0.03em] md:text-[2.2em]">
                  {item.price}
                </span>
                <span className={light ? "text-foreground/70" : "text-cream-muted"}>{item.note}</span>
              </div>
              <ul
                className={`mt-8 flex-1 space-y-3 border-t pt-6 text-[0.95em] leading-snug ${
                  light ? "border-foreground/20 text-foreground/80" : "border-cream/20 text-cream-muted"
                }`}
              >
                {item.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <Icon
                      name="Check"
                      size={18}
                      className={`mt-0.5 shrink-0 ${light ? "text-foreground" : "text-brand"}`}
                    />
                    {p}
                  </li>
                ))}
              </ul>
              <a
                href="#lead"
                className={`mt-8 inline-flex w-fit items-center justify-center rounded-xl px-7 py-4 font-medium transition-transform hover:-translate-y-0.5 ${
                  light ? "bg-foreground text-brand" : "bg-brand text-foreground"
                }`}
              >
                {item.cta}
              </a>
            </article>
          );
        })}
      </div>

      <article className="reveal mt-4 overflow-hidden rounded-[28px] bg-surface p-4 text-cream md:p-10">
        <div className="grid gap-6 md:gap-10 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-[max(12px,0.82em)] font-semibold text-foreground">
              <Icon name="GraduationCap" size={16} />
              обучение команды
            </span>
            <h3 className="mt-6 font-display text-[2em] font-semibold leading-[.95] tracking-[-0.03em] md:text-[3em]">
              курс: работа
              <span className="block text-brand">с&nbsp;агрегатором</span>
            </h3>
            <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-display text-[1.8em] font-semibold leading-none tracking-[-0.03em] md:text-[2.4em]">
                от 80 000 ₽
              </span>
              <span className="text-cream-muted">до 6 человек</span>
            </div>
            <p className="mt-4 text-cream-muted">Без воды. 5 недель. 5 уроков по 45 минут.</p>

            <ul className="mt-8 space-y-3 border-t border-cream/20 pt-6 text-[0.95em] leading-snug text-cream-muted">
              {COURSE_POINTS.map((p) => (
                <li key={p} className="flex gap-3">
                  <Icon name="Check" size={18} className="mt-0.5 shrink-0 text-brand" />
                  {p}
                </li>
              ))}
            </ul>

            <a
              href="#lead"
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-brand px-7 py-4 font-medium text-foreground transition-transform hover:-translate-y-0.5"
            >
              записать команду на курс
            </a>
          </div>

          <div className="rounded-xl border border-cream/20 p-4 md:p-7">
            <h4 className="font-display text-[1.3em] font-semibold tracking-[-0.02em] md:text-[1.6em]">
              программа курса
            </h4>
            <ol className="mt-6 space-y-5">
              {PROGRAM.map((p, i) => (
                <li key={p.t} className="flex gap-3 md:gap-4 border-t border-cream/20 pt-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand font-display text-[0.95em] font-semibold text-foreground">
                    {i + 1}
                  </span>
                  <span>
                    <b className="block text-[1.08em] font-medium leading-tight">{p.t}</b>
                    <span className="mt-1 block text-[max(12px,0.9em)] leading-snug text-cream-muted">{p.d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </article>
    </section>
  );
};

export default Extra;