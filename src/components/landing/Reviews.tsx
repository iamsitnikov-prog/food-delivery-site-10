import Icon from "@/components/ui/icon";
import useReveal from "@/hooks/use-reveal";

const REVIEWS = [
  {
    title: "спасибо за оперативность!",
    text: "Юрий, благодарю, честно говоря мы не ожидали заказов сразу! Мы немного накосячили, но ничего — так сказать, боевое крещение! Пока не будем подключать второй тип доставки, пусть справляются с тем объёмом, который есть. Ещё раз спасибо за оперативность и что всегда на связи. До завтра!",
    author: "Иван и Ольга Шалютины",
    place: "кафе «Череда», г. Самара",
    link: "#",
  },
  {
    title: "результат",
    text: "Хочу выразить благодарность Лилии Ковальчук за её вклад в развитие нашей службы доставки! За последние 6 месяцев работы мы увидели взрывной рост выручки на 40%. Когда Лиля пришла к нам, мы слегка буксовали: кабинет в Яндекс Еде был настроен не оптимально, а продвижение было скорее хаотичным. Она провела нас за руку через все настройки кабинета, научила анализировать данные и оптимизировать предложения для гостей.",
    author: "Ольга Самойлова",
    place: "компания «Морсен», г. Череповец",
    link: "#",
  },
  {
    title: "спасибо за обучение!",
    text: "Ура! У нас первый заказ. Мы сидим, телефон как начал пищать! Спасибо за обучение, ребятам зашло. Очень приятно с тобой работать — как будешь проезжать нас, заезжай на обед!",
    author: "Ибрагим Зоров",
    place: "г. Санкт-Петербург",
    link: "#",
  },
  {
    title: "новые горизонты",
    text: "Мы обратились к Лилии с просьбой помочь с развитием кафе — не могли понять, что именно нужно улучшить. На первый взгляд всё было в порядке, но заказов не поступало. Лилия сразу выявила скрытые проблемы, определила целевую аудиторию и составила детальный план действий. Регулярные созвоны и разборы ошибок стали источником инсайтов, а сотрудничество открыло перед нами перспективы для роста.",
    author: "Владимир Фролов",
    place: "кафе «Зарина», г. Москва",
    link: "#",
  },
];

const Reviews = () => {
  const ref = useReveal<HTMLElement>();

  return (
    <section
      id="reviews"
      ref={ref}
      className="scroll-mt-4 rounded-[28px] md:rounded-[40px] bg-surface px-5 py-10 text-cream md:mx-3 md:px-14 md:py-28"
    >
      <div className="reveal mb-6 md:mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <h2 className="font-display text-[24px] font-semibold leading-[.92] tracking-[-0.035em] md:text-[72px]">
          отзывы
          <span className="block pl-[1.2em] text-brand">говорят за&nbsp;нас</span>
        </h2>
        <p className="max-w-[360px] text-[1.05em] leading-snug text-cream-muted">
          Рестораны и&nbsp;кафе по&nbsp;всей России — от&nbsp;Самары до&nbsp;Санкт-Петербурга.
        </p>
      </div>

      <div className="grid gap-3 md:gap-4 md:grid-cols-2">
        {REVIEWS.map((r, i) => (
          <article
            key={r.author}
            style={{ transitionDelay: `${i * 110}ms` }}
            className="reveal tilt group flex flex-col rounded-xl border border-cream/20 p-4 hover:border-brand hover:bg-brand/5 md:p-8"
          >
            <Icon name="Quote" size={28} className="mb-5 text-brand transition-transform duration-500 group-hover:scale-125" />
            <h3 className="font-display text-[1.35em] font-semibold tracking-[-0.02em] text-brand">{r.title}</h3>
            <p className="mt-4 flex-1 text-[0.95em] leading-relaxed text-cream-muted">{r.text}</p>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-3 md:gap-4 border-t border-cream/20 pt-5">
              <div>
                <div className="font-display text-[1.15em] font-semibold">{r.author}</div>
                <div className="text-[max(12px,0.88em)] text-cream-muted">{r.place}</div>
              </div>
              {r.link && r.link !== "#" && (
                <a
                  href={r.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-[max(12px,0.88em)] font-medium text-foreground transition-transform hover:-translate-y-0.5"
                >
                  открыть оригинал
                  <Icon name="ArrowUpRight" size={16} />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Reviews;