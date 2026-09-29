import { useMemo, useState } from "react";
import Icon from "@/components/ui/icon";

type City = "million" | "big" | "small";
type Couriers = "yes" | "no";
type Goal = "volume" | "margin";

const CITY: { key: City; label: string }[] = [
  { key: "million", label: "Миллионник" },
  { key: "big", label: "От 300 тысяч" },
  { key: "small", label: "Меньше 300 тысяч" },
];

const COURIERS: { key: Couriers; label: string }[] = [
  { key: "no", label: "Нет, нужны курьеры сервиса" },
  { key: "yes", label: "Есть своя доставка" },
];

const GOAL: { key: Goal; label: string }[] = [
  { key: "volume", label: "Больше заказов" },
  { key: "margin", label: "Больше прибыли с заказа" },
];

type Verdict = { main: string; extra: string; why: string; watch: string };

const decide = (city: City, couriers: Couriers, goal: Goal): Verdict => {
  if (couriers === "no") {
    if (city === "small") {
      return {
        main: "Яндекс Еда",
        extra: "Купер — если он работает в вашем городе",
        why: "Без своих курьеров выбор сводится к сервисам с курьерским парком, а из них реальный поток заказов даёт только Яндекс. Чиббис с его низкой ставкой здесь недоступен: доставлять некому.",
        watch:
          "Комиссия 35% в малом городе особенно болезненна при низком чеке. Прежде чем подключаться, проверьте, остаётся ли прибыль на калькуляторе выше.",
      };
    }
    return {
      main: "Яндекс Еда",
      extra: "Купер",
      why:
        goal === "volume"
          ? "У Яндекса максимальная аудитория, а курьеры подключаются автоматически. Купер добавит заказы от людей, которые заказывают продукты и берут готовую еду заодно."
          : "Ставка 35% одинакова у обоих, поэтому прибыль зависит только от объёма. Работайте с Яндексом и снижайте себестоимость, а не ищите площадку подешевле.",
      watch:
        "Заложите 35% в цену блюда заранее и держите расходы на продвижение ниже маржинальности, иначе аукцион съест разницу.",
    };
  }

  if (goal === "margin") {
    if (city === "small") {
      return {
        main: "Чиббис",
        extra: "Яндекс Еда на своей доставке — 20% вместо 35%",
        why: "В небольшом городе это тот редкий случай, когда низкая ставка реально работает: поток Чиббиса здесь сопоставим с Яндексом, а 17% — самая низкая комиссия на рынке.",
        watch:
          "Проверьте стоимость своей доставки: если курьер обходится дороже 20% от чека, экономия на комиссии исчезает. И всё равно подключите Яндекс — он добавит заказы, которых у Чиббиса нет.",
      };
    }
    return {
      main: "Яндекс Еда на своей доставке",
      extra: "Чиббис — дешёвая добавка к основному потоку",
      why: "Своя доставка снижает ставку Яндекса с 35% до 20%: вы получаете тот же поток заказов почти вдвое дешевле. У Чиббиса ставка ещё ниже, но в вашем городе он приносит в разы меньше заказов, и 17% просто не с чего считать.",
      watch:
        "17% от маленькой выручки меньше, чем 20% от большой. Сравните каналы в рублях на калькуляторе выше, прежде чем делать ставку на низкую комиссию.",
    };
  }

  return {
    main: "Яндекс Еда на своей доставке",
    extra: "Чиббис как дешёвый дополнительный канал",
    why: "Цель — объём, а объём даёт только аудитория Яндекса: остальные площадки приносят кратно меньше заказов. Своя доставка снижает ставку с 35% до 20%, то есть тот же поток обходится вам почти вдвое дешевле.",
    watch:
      "Кухня должна выдерживать суммарный поток с двух площадок. Рост отмен ударит по рейтингу сразу везде.",
  };
};

const Group = <T extends string>({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: { key: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) => (
  <div>
    <span className="text-[max(12px,0.9em)] font-medium text-muted-foreground">
      {title}
    </span>
    <div className="mt-3 flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          aria-pressed={value === o.key}
          onClick={() => onChange(o.key)}
          className={`rounded-xl px-4 py-2.5 text-[max(12px,0.88em)] font-medium transition-colors ${
            value === o.key
              ? "bg-foreground text-background"
              : "border border-foreground/15 text-foreground hover:border-foreground/40"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  </div>
);

const ChannelPicker = () => {
  const [city, setCity] = useState<City>("million");
  const [couriers, setCouriers] = useState<Couriers>("no");
  const [goal, setGoal] = useState<Goal>("volume");

  const v = useMemo(() => decide(city, couriers, goal), [city, couriers, goal]);

  return (
    <section className="px-5 pb-11 md:px-14 md:pb-24">
      <h2 className="font-display text-[27px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[48px]">
        что подойдёт
        <span className="pl-3 text-muted-foreground max-sm:pl-0 max-sm:before:content-['_']">именно вам</span>
      </h2>
      <p className="mt-5 max-w-[660px] leading-snug text-muted-foreground">
        Три вопроса — и мы покажем, с какого агрегатора стоит начать и на что
        обратить внимание.
      </p>

      <div className="mt-8 grid gap-3 md:gap-4 lg:grid-cols-[minmax(0,460px)_1fr]">
        <div className="space-y-7 rounded-[28px] border border-foreground/12 p-4 md:p-8">
          <Group title="Размер города" options={CITY} value={city} onChange={setCity} />
          <Group
            title="Свои курьеры"
            options={COURIERS}
            value={couriers}
            onChange={setCouriers}
          />
          <Group
            title="Что важнее сейчас"
            options={GOAL}
            value={goal}
            onChange={setGoal}
          />
        </div>

        <div className="rounded-[28px] bg-surface p-4 text-cream md:p-8">
          <span className="text-[max(12px,0.85em)] text-cream-muted">Рекомендуем начать с</span>
          <p className="mt-2 flex items-center gap-2.5 font-display text-[1.8em] font-semibold leading-tight tracking-[-0.02em] text-brand md:text-[2.2em]">
            <Icon name="Trophy" size={26} className="shrink-0" />
            {v.main}
          </p>

          <p className="mt-5 flex gap-2.5 text-[0.95em] leading-snug">
            <Icon name="Plus" size={17} className="mt-0.5 shrink-0 text-brand" />
            <span>
              <span className="text-cream-muted">Вторым каналом: </span>
              {v.extra}
            </span>
          </p>

          <p className="mt-5 border-t border-cream/12 pt-5 leading-relaxed">
            {v.why}
          </p>

          <p className="mt-5 rounded-2xl bg-cream/[0.06] p-4 md:p-5 text-[0.92em] leading-snug">
            <span className="text-brand">На что смотреть. </span>
            {v.watch}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ChannelPicker;