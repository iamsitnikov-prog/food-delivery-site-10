import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Header from "@/components/landing/Header";
import LeadForm from "@/components/landing/LeadForm";
import Contacts from "@/components/landing/Contacts";
import useSeo from "@/hooks/use-seo";
import { reachGoal } from "@/lib/metrika";
import { QUIZ_QUESTIONS, MAX_SCORE, getLevel } from "@/data/quiz";

const QuizPage = () => {
  const { pathname } = useLocation();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  useSeo({
    title: "Тест: проверьте свой проект на агрегаторе за 3 минуты | agregatory.pro",
    description:
      "20 вопросов о работе вашего ресторана на Яндекс Еде и Деливери: рейтинг, ДРР, экономика, контент, отзывы, настройки и отчётность. В конце — оценка проекта и рекомендации.",
    path: pathname,
  });

  const total = QUIZ_QUESTIONS.length;
  const current = QUIZ_QUESTIONS[step];
  const progress = done ? 100 : Math.round((step / total) * 100);

  const score = useMemo(() => answers.reduce((a, b) => a + b, 0), [answers]);
  const level = useMemo(() => getLevel(score), [score]);
  const percent = Math.round((score / MAX_SCORE) * 100);

  const choose = (value: number) => {
    const next = [...answers.slice(0, step), value];
    setAnswers(next);

    if (step + 1 < total) {
      setStep(step + 1);
      return;
    }

    const finalScore = next.reduce((a, b) => a + b, 0);
    setDone(true);
    reachGoal("quiz_finish", { score: finalScore, level: getLevel(finalScore).label });
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const restart = () => {
    setAnswers([]);
    setStep(0);
    setDone(false);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <div id="top">
        <Header />
        <section className="px-5 pb-10 pt-12 md:px-14 md:pb-14 md:pt-16">
          <nav
            aria-label="Хлебные крошки"
            className="mb-8 flex items-center gap-2 text-[0.85em] text-muted-foreground"
          >
            <Link to="/" className="hover:text-foreground">
              главная
            </Link>
            <Icon name="ChevronRight" size={14} />
            <span className="text-foreground">тест</span>
          </nav>
          <h1 className="max-w-[18ch] font-display text-[38px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[62px]">
            Проверьте свой проект за 3 минуты
          </h1>
          <p className="mt-6 max-w-[580px] text-[1.08em] leading-snug text-muted-foreground">
            {total}&nbsp;вопросов о&nbsp;работе вашего заведения на&nbsp;агрегаторе: рейтинг, экономика, контент, настройки и&nbsp;команда. В&nbsp;конце&nbsp;— оценка проекта и&nbsp;точки роста, с&nbsp;которых стоит начать.
          </p>
        </section>
      </div>

      <section className="px-5 pb-16 md:px-14 md:pb-24">
        <div className="mx-auto max-w-[840px] rounded-[32px] bg-surface p-7 text-cream md:p-11">
          {!done ? (
            <>
              <div className="flex items-center justify-between gap-4 text-[0.85em] text-cream-muted">
                <span className="rounded-lg bg-cream/10 px-3 py-1.5 font-medium">{current.block}</span>
                <span>
                  вопрос {step + 1} из {total}
                </span>
              </div>

              <div
                className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-cream/15"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-brand transition-all duration-500"
                  style={{ width: `${Math.max(progress, 4)}%` }}
                />
              </div>

              <h2 className="mt-8 font-display text-[1.65em] font-semibold leading-tight tracking-[-0.025em] md:text-[2.1em]">
                {current.question}
              </h2>
              {current.note && (
                <p className="mt-3 text-[0.95em] leading-relaxed text-cream-muted">{current.note}</p>
              )}

              <div className="mt-8 space-y-3">
                {current.options.map((o) => (
                  <button
                    key={o.label}
                    type="button"
                    onClick={() => choose(o.score)}
                    className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-cream/15 bg-cream/[0.04] px-5 py-4 text-left text-[1.02em] leading-snug transition-colors hover:border-brand hover:bg-brand hover:text-foreground"
                  >
                    {o.label}
                    <Icon
                      name="ArrowRight"
                      size={18}
                      className="shrink-0 text-cream-muted transition-colors group-hover:text-foreground"
                    />
                  </button>
                ))}
              </div>

              {step > 0 && (
                <button
                  type="button"
                  onClick={back}
                  className="mt-7 inline-flex items-center gap-2 text-[0.9em] text-cream-muted transition-colors hover:text-cream"
                >
                  <Icon name="ArrowLeft" size={16} />
                  назад
                </button>
              )}
            </>
          ) : (
            <>
              <div className="text-[0.85em] font-medium uppercase tracking-wide text-cream-muted">
                результат
              </div>

              <div className="mt-6 flex flex-col gap-7 md:flex-row md:items-center md:gap-10">
                <div className="shrink-0">
                  <div className="font-display text-[64px] font-semibold leading-none tracking-[-0.04em] text-brand md:text-[88px]">
                    {percent}
                    <span className="text-[0.45em]">%</span>
                  </div>
                  <div className="mt-2 text-[0.88em] text-cream-muted">
                    {score} из {MAX_SCORE} баллов
                  </div>
                </div>

                <div className="min-w-0">
                  <h2 className="font-display text-[1.7em] font-semibold leading-tight tracking-[-0.025em] md:text-[2.3em]">
                    {level.title}
                  </h2>
                  <span className="mt-3 inline-block rounded-lg bg-brand px-3 py-1.5 text-[0.8em] font-medium text-foreground">
                    {level.label}
                  </span>
                </div>
              </div>

              <p className="mt-7 leading-relaxed text-cream-muted">{level.summary}</p>

              <div className="mt-8 rounded-[24px] bg-cream/[0.06] p-6 md:p-7">
                <h3 className="font-display text-[1.2em] font-semibold">с чего начать</h3>
                <ul className="mt-4 space-y-3">
                  {level.advice.map((a) => (
                    <li key={a} className="flex gap-3 leading-snug text-cream-muted">
                      <Icon name="Check" size={18} className="mt-0.5 shrink-0 text-brand" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 rounded-[24px] bg-brand p-6 text-foreground md:p-8">
                <h3 className="font-display text-[1.4em] font-semibold leading-tight tracking-[-0.02em] md:text-[1.8em]">
                  Разберём ваш проект бесплатно
                </h3>
                <p className="mt-3 max-w-[560px] leading-relaxed text-foreground/80">
                  Посмотрим вашу карточку глазами гостя, сравним с&nbsp;конкурентами в&nbsp;районе и&nbsp;покажем точки роста. Без обязательств, результат пришлём в&nbsp;течение 2&nbsp;рабочих дней.
                </p>
                <a
                  href="#lead"
                  onClick={() => reachGoal("quiz_to_lead", { level: level.label })}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-4 font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
                >
                  получить бесплатный анализ
                  <Icon name="ArrowRight" size={18} />
                </a>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-6">
                <button
                  type="button"
                  onClick={restart}
                  className="inline-flex items-center gap-2 text-[0.9em] text-cream-muted transition-colors hover:text-cream"
                >
                  <Icon name="RotateCcw" size={16} />
                  пройти заново
                </button>
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-[0.9em] text-cream-muted transition-colors hover:text-cream"
                >
                  <Icon name="BookOpen" size={16} />
                  читать разборы в блоге
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <LeadForm />
      <Contacts />
    </main>
  );
};

export default QuizPage;
