import Icon from "@/components/ui/icon";
import useReveal from "@/hooks/use-reveal";

const POINTS = [
  { icon: "Search", t: "смотрим вашу карточку", d: "как выглядит ресторан глазами гостя: фото, описание, меню, цены" },
  { icon: "Users", t: "сравниваем с конкурентами", d: "кто выше вас в выдаче в вашем районе и почему" },
  { icon: "TrendingUp", t: "показываем точки роста", d: "что даст прирост заказов быстрее всего именно у вас" },
];

const FreeAudit = () => {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="free-audit" ref={ref} className="scroll-mt-4 px-5 pb-10 md:px-14 md:pb-28">
      <div className="reveal overflow-hidden rounded-[28px] bg-surface p-4 text-cream md:p-12">
        <div className="grid items-center gap-6 md:gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand px-4 py-2 text-[0.82em] font-semibold text-foreground">
              <Icon name="Gift" size={16} />
              бесплатно
            </span>
            <h2 className="mt-6 font-display text-[27px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[56px]">
              бесплатный анализ
              <span className="block text-brand">вашей точки</span>
            </h2>
            <p className="mt-6 max-w-[420px] leading-snug text-cream-muted">
              Перед началом работы бесплатно разбираем ваш ресторан на&nbsp;агрегаторе и&nbsp;показываем, где вы&nbsp;теряете заказы. Без обязательств и&nbsp;навязывания услуг.
            </p>

            <a
              href="#lead"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-4 font-medium text-foreground transition-transform hover:-translate-y-0.5"
            >
              получить бесплатный анализ
              <Icon name="ArrowRight" size={18} />
            </a>
            <p className="mt-4 text-[0.86em] text-cream-muted">результат пришлём в течение 2 рабочих дней</p>
          </div>

          <div>
            {/* Одна колонка: три карточки в ряд на планшете сжимались до 176 px и резали текст */}
            <div className="grid grid-cols-1 gap-3 md:gap-4">
              {POINTS.map((p) => (
                <div key={p.t} className="flex items-center gap-3 md:gap-4 rounded-[20px] bg-pale p-4 md:p-5 text-foreground min-w-0">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-foreground text-brand">
                    <Icon name={p.icon} size={20} />
                  </span>
                  <span>
                    <b className="block text-[1.05em] font-semibold leading-tight">{p.t}</b>
                    <span className="mt-1.5 block text-[0.9em] leading-snug text-foreground/75">{p.d}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreeAudit;