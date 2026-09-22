import Icon from "@/components/ui/icon";
import useReveal from "@/hooks/use-reveal";

const ITEMS = [
  {
    icon: "Percent",
    title: "комиссия ниже, чем при обращении в сервис напрямую",
    text: "Пониженный процент комиссионного вознаграждения при подключении на весь период работы с нами.",
  },
  {
    icon: "MessagesSquare",
    title: "общаемся на первой линии с Яндекс Едой",
    text: "Тесно коммуницируем с командой Яндекс Еда. Кураторы и модераторы «Тема Еды» 2024–2025, эксперты проекта «Консалтинг для региональных рестораторов».",
  },
  {
    icon: "Gift",
    title: "бонусы на продвижение",
    text: "Даём стартовый бонусный пакет на продвижение. Тестируем гипотезы и находим рабочие связки.",
  },
  {
    icon: "Timer",
    title: "первые результаты за 7 дней",
    text: "От подачи заявки до вашего первого заказа пройдёт максимум 7 дней. Но вполне вероятно, что процесс займёт меньше времени.",
  },
  {
    icon: "Building2",
    title: "опыт на масштабе сети, а не в теории",
    text: "Ведём доставку в структуре Холдинга — 20+ ресторанов разных форматов, от фастфуда до премиальных заведений. Знаем, как устроена доставка изнутри крупной сети, а не только по кейсам со стороны.",
  },
  {
    icon: "UserCheck",
    title: "с вами работают эксперты, а не колл-центр",
    text: "Все задачи ведут лично кураторы «Тема Еды» и эксперты Яндекс Еды — без пересказа через менеджеров на аутсорсе и без «уточним и перезвоним».",
  },
];

const Advantages = () => {
  const ref = useReveal<HTMLElement>();

  return (
    <section
      id="advantages"
      ref={ref}
      className="scroll-mt-4 rounded-[40px] bg-surface px-5 py-20 text-cream md:mx-3 md:px-14 md:py-28"
    >
      <div className="reveal mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <h2 className="font-display text-[44px] font-semibold leading-[.92] tracking-[-0.035em] md:text-[72px]">
          преимущества
          <span className="block pl-[1.2em] text-brand">работы с&nbsp;нами</span>
        </h2>
        <p className="max-w-[380px] text-[1.05em] leading-snug text-cream-muted">
          С нами вы&nbsp;сможете заработать на&nbsp;доставке и&nbsp;стать первыми в&nbsp;поиске с&nbsp;рейтингом выше&nbsp;4.8
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {ITEMS.map((item, i) => {
          const light = i % 2 === 1;
          return (
            <article
              key={item.title}
              style={{ transitionDelay: `${i * 100}ms` }}
              className={`reveal group rounded-[28px] p-7 transition-transform duration-500 hover:-translate-y-1 md:p-9 ${
                light ? "bg-pale text-foreground" : "border border-cream/20 text-cream"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 ${
                    light ? "bg-foreground text-brand" : "bg-brand text-foreground"
                  }`}
                >
                  <Icon name={item.icon} size={24} />
                </span>
                <span
                  className={`font-display text-[1.1em] font-semibold ${light ? "text-foreground/40" : "text-cream/35"}`}
                >
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-7 font-display text-[1.35em] font-semibold leading-tight tracking-[-0.02em] md:text-[1.6em]">
                {item.title}
              </h3>
              <p className={`mt-4 text-[0.95em] leading-snug ${light ? "text-foreground/80" : "text-cream-muted"}`}>
                {item.text}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Advantages;