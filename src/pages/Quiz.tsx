import { useMemo, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Header from "@/components/landing/Header";
import LeadForm from "@/components/landing/LeadForm";
import CrossLinks from "@/components/landing/CrossLinks";
import Contacts from "@/components/landing/Contacts";
import useSeo from "@/hooks/use-seo";
import { reachGoal } from "@/lib/metrika";
import { getQuiz, getQuizLevel, QUIZZES, AUDIT_QUIZ } from "@/data/quizzes";
import { maxScore } from "@/data/quiz-types";

const shuffle = <T,>(arr: T[], seed: number): T[] => {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const QuizPage = () => {
  const { pathname } = useLocation();
  const { slug } = useParams();
  const quiz = slug ? getQuiz(slug) : AUDIT_QUIZ;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [seed] = useState(() => Math.floor(Math.random() * 100000) + 1);

  useSeo({
    title: quiz?.title || "",
    description: quiz?.description || "",
    path: pathname,
  });

  const total = quiz?.questions.length ?? 0;
  const max = useMemo(() => (quiz ? maxScore(quiz.questions) : 0), [quiz]);
  const score = useMemo(() => answers.reduce((a, b) => a + b, 0), [answers]);
  const level = useMemo(
    () => (quiz ? getQuizLevel(quiz, score) : undefined),
    [quiz, score],
  );

  if (!quiz) return <Navigate to="/testy" replace />;

  const current = quiz.questions[step];
  const options = shuffle(current.options, seed + step * 7919);
  const progress = done ? 100 : Math.round((step / total) * 100);
  const percent = max > 0 ? Math.round((score / max) * 100) : 0;
  const others = QUIZZES.filter((q) => q.slug !== quiz.slug);
  const isAudit = quiz.kind === "audit";

  const choose = (value: number) => {
    const next = [...answers.slice(0, step), value];
    setAnswers(next);

    if (step + 1 < total) {
      setStep(step + 1);
      return;
    }

    const finalScore = next.reduce((a, b) => a + b, 0);
    setDone(true);
    reachGoal("quiz_finish", {
      quiz: quiz.slug,
      score: finalScore,
      level: getQuizLevel(quiz, finalScore).label,
    });
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
            className="mb-8 flex flex-wrap items-center gap-2 text-[0.85em] text-muted-foreground"
          >
            <Link to="/" className="hover:text-foreground">
              главная
            </Link>
            <Icon name="ChevronRight" size={14} />
            <Link to="/testy" className="hover:text-foreground">
              тесты
            </Link>
            <Icon name="ChevronRight" size={14} />
            <span className="text-foreground">{quiz.navLabel}</span>
          </nav>
          <h1 className="max-w-[20ch] font-display text-[34px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[56px]">
            {quiz.h1}
          </h1>
          <p className="mt-6 max-w-[620px] text-[1.08em] leading-snug text-muted-foreground">
            {quiz.intro}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.9em] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="ListChecks" size={16} />
              {total} вопросов
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="Clock" size={16} />
              {quiz.minutes}
            </span>
          </div>
        </section>
      </div>

      <section className="px-5 pb-16 md:px-14 md:pb-24">
        <div className="mx-auto max-w-[840px] rounded-[32px] bg-surface p-7 text-cream md:p-11">
          {!done ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 text-[0.85em] text-cream-muted">
                <span className="rounded-lg bg-cream/10 px-3 py-1.5 font-medium">
                  {current.block}
                </span>
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

              <h2 className="mt-8 font-display text-[1.5em] font-semibold leading-tight tracking-[-0.025em] md:text-[2em]">
                {current.question}
              </h2>
              {current.note && (
                <p className="mt-3 text-[0.95em] leading-relaxed text-cream-muted">
                  {current.note}
                </p>
              )}

              <div className="mt-8 space-y-3">
                {options.map((o) => (
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
                      className="hidden shrink-0 text-cream-muted transition-colors group-hover:text-foreground min-[380px]:block"
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
                    {score} из {max} баллов
                  </div>
                </div>

                <div className="min-w-0">
                  <h2 className="font-display text-[1.6em] font-semibold leading-tight tracking-[-0.025em] md:text-[2.2em]">
                    {level?.title}
                  </h2>
                  <span className="mt-3 inline-block rounded-lg bg-brand px-3 py-1.5 text-[0.8em] font-medium text-foreground">
                    {level?.label}
                  </span>
                </div>
              </div>

              <p className="mt-7 leading-relaxed text-cream-muted">{level?.summary}</p>

              <div className="mt-8 rounded-[24px] bg-cream/[0.06] p-6 md:p-7">
                <h3 className="font-display text-[1.2em] font-semibold">
                  {isAudit ? "с чего начать" : "что подтянуть"}
                </h3>
                <ul className="mt-4 space-y-3">
                  {level?.advice.map((a) => (
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
                  Посмотрим вашу карточку глазами гостя, сравним с&nbsp;конкурентами в&nbsp;районе
                  и&nbsp;покажем точки роста. Без обязательств, результат пришлём
                  в&nbsp;течение 2&nbsp;рабочих дней.
                </p>
                <a
                  href="#lead"
                  onClick={() => reachGoal("quiz_to_lead", { quiz: quiz.slug })}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-center font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 sm:w-auto sm:px-7"
                >
                  получить бесплатный анализ
                  <Icon name="ArrowRight" size={18} className="hidden shrink-0 min-[360px]:block" />
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
                  to="/testy"
                  className="inline-flex items-center gap-2 text-[0.9em] text-cream-muted transition-colors hover:text-cream"
                >
                  <Icon name="ListChecks" size={16} />
                  другие тесты
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 pb-16 md:px-14 md:pb-24">
        <h2 className="font-display text-[1.6em] font-semibold tracking-[-0.02em]">другие тесты</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((o) => (
            <Link
              key={o.slug}
              to={`/testy/${o.slug}`}
              className="rounded-[24px] bg-surface p-6 text-cream transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between gap-3">
                <Icon name={o.icon} size={22} className="text-brand" />
                <span className="rounded-lg bg-cream/10 px-2.5 py-1 text-[0.74em] font-medium text-cream-muted">
                  {o.questions.length} вопр.
                </span>
              </div>
              <h3 className="mt-3 font-display text-[1.12em] font-semibold leading-tight">
                {o.navLabel}
              </h3>
              <p className="mt-2 text-[0.9em] leading-snug text-cream-muted">{o.lead}</p>
            </Link>
          ))}
        </div>
      </section>

      <CrossLinks
        items={["audit", "reports", "calc"]}
        title="что дальше"
      />

      <LeadForm />
      <Contacts />
    </main>
  );
};

export default QuizPage;
