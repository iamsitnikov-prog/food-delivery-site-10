import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { useReveal } from "@/hooks/use-reveal";
import { QUIZ_META } from "@/data/quiz-meta";

const PREVIEW = [
  "Знаете ли вы свой ДРР?",
  "Считаете прибыль после удержаний?",
  "Проверяете отчёты в срок?",
  "Есть канал заказов кроме агрегатора?",
];

const AUDIT = QUIZ_META[0];

const QuizTeaser = () => {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="px-5 pb-20 md:px-14 md:pb-28">
      <div className="reveal grid gap-8 rounded-[32px] bg-surface p-7 text-cream md:p-11 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-1.5 text-[0.78em] font-medium text-foreground">
            <Icon name="ClipboardCheck" size={15} />
            бесплатно и без регистрации
          </span>

          <h2 className="mt-5 font-display text-[38px] font-semibold leading-[.92] tracking-[-0.035em] md:text-[56px]">
            проверьте свой проект
            <span className="block text-brand">за 3 минуты</span>
          </h2>

          <p className="mt-5 max-w-[500px] leading-relaxed text-cream-muted">
            {AUDIT.count}&nbsp;вопросов о&nbsp;работе вашего заведения на&nbsp;агрегаторе: рейтинг, экономика, контент, отчётность и&nbsp;команда. В&nbsp;конце&nbsp;— оценка проекта и&nbsp;точки роста, с&nbsp;которых стоит начать.
          </p>

          <Link
            to="/testy/audit"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-4 font-medium text-foreground transition-transform hover:-translate-y-0.5"
          >
            пройти тест
            <Icon name="ArrowRight" size={18} />
          </Link>
        </div>

        <div className="rounded-[24px] bg-cream/[0.06] p-6 md:p-7">
          <div className="text-[0.8em] font-medium uppercase tracking-wide text-cream-muted">
            о чём спросим
          </div>
          <ul className="mt-5 space-y-3.5">
            {PREVIEW.map((q) => (
              <li key={q} className="flex gap-3 leading-snug">
                <Icon name="CircleHelp" size={18} className="mt-0.5 shrink-0 text-brand" />
                {q}
              </li>
            ))}
            <li className="flex gap-3 leading-snug text-cream-muted">
              <Icon name="MoreHorizontal" size={18} className="mt-0.5 shrink-0 text-brand" />и ещё{" "}
              {AUDIT.count - PREVIEW.length} вопросов
            </li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <div className="flex flex-col justify-between gap-3 border-t border-cream/15 pt-8 sm:flex-row sm:items-end">
            <div className="min-w-0">
              <h3 className="font-display text-[1.4em] font-semibold tracking-[-0.02em] md:text-[1.7em]">
                а ещё — проверка знаний
              </h3>
              <p className="mt-2 max-w-[560px] leading-snug text-cream-muted">
                Четыре теста по&nbsp;50&nbsp;вопросов о&nbsp;правилах сервиса, экономике доставки
                и&nbsp;требованиях закона. С&nbsp;пояснениями к&nbsp;ответам.
              </p>
            </div>
            <Link
              to="/testy"
              className="inline-flex shrink-0 items-center gap-2 self-start text-[0.92em] font-medium text-brand transition-colors hover:text-cream sm:self-auto"
            >
              все тесты
              <Icon name="ArrowRight" size={16} />
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {QUIZ_META.filter((q) => q.kind === "knowledge").map((q) => (
              <Link
                key={q.slug}
                to={`/testy/${q.slug}`}
                className="rounded-2xl border border-cream/15 p-5 transition-colors hover:border-brand hover:bg-brand/10"
              >
                <div className="flex items-center justify-between gap-3">
                  <Icon name={q.icon} size={20} className="text-brand" />
                  <span className="text-[0.76em] text-cream-muted">{q.count} вопр.</span>
                </div>
                <span className="mt-3 block font-display text-[1.02em] font-semibold leading-tight">
                  {q.navLabel}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuizTeaser;
