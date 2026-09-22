import Icon from "@/components/ui/icon";

const WORDS = [
  "яндекс еда",
  "деливери",
  "рейтинг 4.8+",
  "первые в поиске",
  "ставки на аукционе",
  "поддержка 24/7",
  "первый заказ за 7 дней",
  "обучение персонала",
];

const Marquee = () => {
  const row = [...WORDS, ...WORDS];

  return (
    <div className="overflow-hidden border-y border-primary/20 bg-primary py-4 text-primary-foreground">
      <div className="marquee flex w-max gap-10 pr-10">
        {row.map((w, i) => (
          <span key={`${w}-${i}`} className="flex shrink-0 items-center gap-10 whitespace-nowrap font-display text-[1.1em] font-medium uppercase tracking-[0.02em] md:text-[1.4em]">
            {w}
            <Icon name="Asterisk" size={20} className="text-brand" />
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
