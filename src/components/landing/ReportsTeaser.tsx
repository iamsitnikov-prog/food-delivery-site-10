import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { useReveal } from "@/hooks/use-reveal";

const POINTS = [
  {
    icon: "Percent",
    title: "Фактическая нагрузка на оборот",
    text: "Ставка в договоре и итоговая нагрузка на оборот — разные цифры. Маркетинговые услуги, абонентская плата и прочие сервисы считаются отдельно.",
  },
  {
    icon: "Layers",
    title: "Состав удержаний",
    text: "Вознаграждение за услуги, продвижение, подписка, буст и компенсации гостям — с суммами и долей в обороте.",
  },
  {
    icon: "ScanSearch",
    title: "Сверка с поступлениями",
    text: "Сумма транзакций сопоставляется с платёжными поручениями: видно, сошлись ли расчёты за период.",
  },
  {
    icon: "ShieldAlert",
    title: "Позиции для уточнения",
    text: "Удержания по п. 14.7 оферты и признанные претензии выделяются отдельно — по ним можно запросить основание в поддержке.",
  },
];

const ReportsTeaser = () => {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="px-5 pb-10 md:px-14 md:pb-28">
      <div className="reveal rounded-[24px] md:rounded-[32px] bg-surface p-4 text-cream md:p-12">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-1.5 text-[0.75em] font-bold uppercase tracking-wide text-foreground">
              <Icon name="Sparkles" size={13} />
              бесплатно и без регистрации
            </span>
            <h2 className="mt-4 font-display text-[23px] font-semibold leading-[.92] tracking-[-0.035em] md:text-[56px]">
              разбор отчётов
            </h2>
            <p className="mt-4 max-w-[560px] leading-snug text-cream-muted">
              Загрузите отчёт из личного кабинета сервиса — покажем фактическую
              нагрузку на&nbsp;оборот и&nbsp;состав удержаний. Файл обрабатывается
              в&nbsp;браузере и&nbsp;не&nbsp;передаётся на&nbsp;сервер.
            </p>
          </div>
          <Link
            to="/razbor-otchetov"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl bg-brand px-6 py-3.5 font-medium text-foreground transition-transform hover:-translate-y-0.5 md:self-auto"
          >
            разобрать отчёт
            <Icon name="ArrowRight" size={17} />
          </Link>
        </div>

        <div className="mt-9 grid gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map((p) => (
            <div key={p.title} className="rounded-[20px] bg-cream/[0.06] p-4 md:p-5">
              <Icon name={p.icon} size={22} className="text-brand" />
              <h3 className="mt-3.5 font-display text-[1.08em] font-semibold leading-tight tracking-[-0.02em]">
                {p.title}
              </h3>
              <p className="mt-2 text-[0.88em] leading-snug text-cream-muted">
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReportsTeaser;
