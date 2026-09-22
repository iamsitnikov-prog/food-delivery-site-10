import Icon from "@/components/ui/icon";
import useReveal from "@/hooks/use-reveal";

const ITEMS = [
  {
    icon: "PhoneCall",
    title: "консультация",
    price: "от 60 мин / 20 000 ₽",
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
    title: "аудит ресторана на агрегаторе",
    price: "от 30 000 ₽",
    cta: "заказать аудит",
    points: [
      "Всестороннее изучение текущего состояния проекта на агрегаторе",
      "Анализ внешнего вида проекта глазами пользователя",
      "Изучение операционных и управленческих метрик",
      "Отчёт с результатами анализа и рекомендациями",
    ],
  },
  {
    icon: "GraduationCap",
    title: "курс: работа с агрегатором",
    price: "от 80 000 ₽ / до 6 чел",
    cta: "оставить заявку",
    points: [
      "Обучение всех сотрудников команды доставки ресторана",
      "Теория и выполнение домашних заданий",
      "Итоговая аттестация сотрудников через тестирование",
      "Готовность команды к эффективной работе с агрегатором",
    ],
  },
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
    <section id="extra" ref={ref} className="scroll-mt-4 px-5 pb-20 md:px-14 md:pb-28">
      <div className="reveal mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <h2 className="font-display text-[44px] font-semibold leading-[.92] tracking-[-0.035em] md:text-[72px]">
          дополнительно
          <span className="block pl-[1.2em] text-muted-foreground">консультации и&nbsp;обучение</span>
        </h2>
        <p className="max-w-[380px] text-[1.05em] leading-snug">
          Повышаем эффективность вашей доставки: консультации, аудит и&nbsp;обучение сотрудников ресторана на&nbsp;агрегаторе.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {ITEMS.map((item, i) => (
          <article
            key={item.title}
            style={{ transitionDelay: `${i * 110}ms` }}
            className="reveal flex flex-col rounded-xl border border-primary/25 bg-pale p-6 md:p-8"
          >
            <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Icon name={item.icon} size={24} />
            </span>
            <h3 className="font-display text-[1.45em] font-semibold leading-tight tracking-[-0.02em]">{item.title}</h3>
            <div className="mt-3 font-display text-[1.3em] font-semibold text-foreground">{item.price}</div>
            <ul className="mt-6 flex-1 space-y-3 border-t border-primary/25 pt-6 text-[0.92em] leading-snug text-muted-foreground">
              {item.points.map((p) => (
                <li key={p} className="flex gap-2.5">
                  <Icon name="Dot" size={18} className="mt-0.5 shrink-0 text-primary" />
                  {p}
                </li>
              ))}
            </ul>
            <a
              href="#lead"
              className="mt-7 inline-flex items-center justify-center rounded-xl border border-primary px-5 py-3.5 font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {item.cta}
            </a>
          </article>
        ))}
      </div>

      <div className="reveal mt-4 rounded-xl border border-primary/25 p-6 md:p-9">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <h3 className="font-display text-[1.6em] font-semibold tracking-[-0.02em] md:text-[2em]">
            программа курса
          </h3>
          <p className="text-muted-foreground">Без воды. 5 недель. 5 уроков по 45 минут.</p>
        </div>
        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {PROGRAM.map((p, i) => (
            <li key={p.t} className="border-t border-primary/25 pt-3.5">
              <b className="mb-2 block text-[0.82em] font-semibold text-muted-foreground">урок {i + 1}</b>
              <h4 className="mb-1.5 text-[1.1em] font-medium leading-tight">{p.t}</h4>
              <p className="text-[0.88em] leading-snug text-muted-foreground">{p.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Extra;