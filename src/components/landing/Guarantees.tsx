import Icon from "@/components/ui/icon";
import useReveal from "@/hooks/use-reveal";

const ITEMS = [
  {
    icon: "Star",
    t: "рейтинг от 4.8 и выше",
    d: "Выводим ресторан на рейтинг 4.8+ без дополнительных вложений в рекламу. Работаем с отзывами, индексом качества и обучаем команду закрывать жалобы до того, как они станут оценкой.",
  },
  {
    icon: "ShieldCheck",
    t: "отработка штрафов и удержаний",
    d: "Разбираем каждое удержание и штраф от сервиса: находим причину, оспариваем некорректные начисления через прямую линию поддержки и настраиваем процессы, чтобы они не повторялись.",
  },
  {
    icon: "Timer",
    t: "первый заказ за 7 дней",
    d: "От подачи заявки до первого заказа проходит максимум 7 дней. Регистрация, контент, настройка вендора и запуск продвижения укладываются в этот срок — часто получается быстрее.",
  },
];

const Guarantees = () => {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="guarantees" ref={ref} className="scroll-mt-4 px-5 pb-20 md:px-14 md:pb-28">
      <div className="reveal mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <h2 className="font-display text-[44px] font-semibold leading-[.92] tracking-[-0.035em] md:text-[72px]">
          наши
          <span className="block pl-[1.2em] text-muted-foreground">гарантии</span>
        </h2>
        <p className="max-w-[380px] text-[1.05em] leading-snug">
          Фиксируем результат в&nbsp;договоре, а&nbsp;не&nbsp;на&nbsp;словах. Вот&nbsp;за&nbsp;что мы&nbsp;отвечаем перед вами.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {ITEMS.map((item, i) => {
          const light = i % 2 === 1;
          return (
            <article
              key={item.t}
              style={{ transitionDelay: `${i * 100}ms` }}
              className={`reveal group flex flex-col rounded-[28px] p-7 transition-transform duration-500 hover:-translate-y-1 md:p-9 ${
                light ? "bg-pale text-foreground" : "bg-surface text-cream"
              }`}
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 ${
                  light ? "bg-foreground text-brand" : "bg-brand text-foreground"
                }`}
              >
                <Icon name={item.icon} size={28} />
              </span>
              <h3 className="mt-7 font-display text-[1.45em] font-semibold leading-tight tracking-[-0.025em] md:text-[1.7em]">
                {item.t}
              </h3>
              <p className={`mt-4 text-[0.95em] leading-snug ${light ? "text-foreground/80" : "text-cream-muted"}`}>
                {item.d}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Guarantees;
