import { useMemo, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import Icon from "@/components/ui/icon";
import useSeo from "@/hooks/use-seo";
import { reachGoal } from "@/lib/metrika";
import { getMiniLevel, getMiniQuiz, MINI_QUIZZES } from "@/data/mini-quizzes";
import { QUIZ_META } from "@/data/quiz-meta";

// Мини тест: без блоков услуг, формы заявки и контактов (решение Юрия 13.10.2026).
// Варианты не перемешиваются: правильные ответы заранее стоят на разных местах.

const LETTERS = ["А", "Б", "В", "Г", "Д"];
const SITE = "https://agregatory.pro";

const plural = (n: number) =>
  n % 10 === 1 && n % 100 !== 11
    ? "правильный ответ"
    : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)
      ? "правильных ответа"
      : "правильных ответов";

const fmtDate = (d: Date) =>
  d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

// Перенос строки для картинки результата
const wrapLines = (ctx: CanvasRenderingContext2D, text: string, max: number) => {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const t = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(t).width <= max) cur = t;
    else {
      if (cur) lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
};

const MiniQuizPage = () => {
  const { pathname } = useLocation();
  const { slug } = useParams();
  const quiz = slug ? getMiniQuiz(slug) : undefined;

  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<(number | null)[]>([]);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  useSeo({
    title: quiz?.title || "",
    description: quiz?.description || "",
    path: pathname,
    jsonLd: quiz
      ? [
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Тесты", item: `${SITE}/testy` },
              { "@type": "ListItem", position: 3, name: quiz.navLabel, item: `${SITE}${pathname}` },
            ],
          },
        ]
      : undefined,
  });

  const total = quiz?.questions.length ?? 0;
  const score = useMemo(
    () =>
      quiz ? picked.filter((p, i) => p !== null && p === quiz.questions[i]?.correct).length : 0,
    [picked, quiz],
  );

  if (!quiz) return <Navigate to="/testy" replace />;

  const level = getMiniLevel(quiz, score);
  const current = quiz.questions[step];
  const answer = picked[step] ?? null;
  const answered = answer !== null;
  const isRight = answered && answer === current.correct;
  const progress = done ? 100 : Math.round(((step + (answered ? 1 : 0)) / total) * 100);
  const pageUrl = `${SITE}${pathname}`;
  const shareText = `Мой результат в мини тесте «${quiz.navLabel}»: ${score} из ${total}. А у вас сколько?`;

  const choose = (i: number) => {
    if (answered) return;
    const next = [...picked];
    next[step] = i;
    setPicked(next);
  };

  const goNext = () => {
    if (step + 1 < total) {
      setStep(step + 1);
      window.scrollTo({ top: document.getElementById("quiz")?.offsetTop ?? 0, behavior: "smooth" });
      return;
    }
    const finalScore = picked.filter((p, i) => p === quiz.questions[i].correct).length;
    setDone(true);
    reachGoal("mini_quiz_finish", { quiz: quiz.slug, score: finalScore });
    window.scrollTo({ top: document.getElementById("quiz")?.offsetTop ?? 0, behavior: "smooth" });
  };

  const restart = () => {
    setPicked([]);
    setStep(0);
    setDone(false);
    setCopied(false);
  };

  const saveImage = async () => {
    reachGoal("mini_quiz_save", { quiz: quiz.slug, score });
    const S = 1080;
    const c = document.createElement("canvas");
    c.width = S;
    c.height = S;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    try {
      await document.fonts?.ready;
    } catch {
      /* noop */
    }
    const font = '"YS Text", system-ui, -apple-system, "Segoe UI", Arial, sans-serif';
    const Y = "#FFD900";
    const K = "#23100B";
    ctx.fillStyle = Y;
    ctx.fillRect(0, 0, S, S);
    // плашка сверху
    ctx.fillStyle = K;
    ctx.beginPath();
    ctx.roundRect(80, 80, 300, 64, 32);
    ctx.fill();
    ctx.fillStyle = Y;
    ctx.font = `700 30px ${font}`;
    ctx.textBaseline = "middle";
    ctx.fillText("Мини тест", 112, 113);
    ctx.fillStyle = K;
    ctx.textBaseline = "alphabetic";
    ctx.font = `700 64px ${font}`;
    let y = 260;
    for (const l of wrapLines(ctx, quiz.navLabel, S - 160)) {
      ctx.fillText(l, 80, y);
      y += 74;
    }
    ctx.font = `800 300px ${font}`;
    ctx.fillText(`${score}`, 80, 620);
    const w = ctx.measureText(`${score}`).width;
    ctx.font = `600 96px ${font}`;
    ctx.fillText(` из ${total}`, 80 + w, 620);
    ctx.font = `700 52px ${font}`;
    y = 740;
    for (const l of wrapLines(ctx, level.title, S - 160)) {
      ctx.fillText(l, 80, y);
      y += 62;
    }
    ctx.font = `400 34px ${font}`;
    ctx.globalAlpha = 0.75;
    ctx.fillText(fmtDate(new Date()), 80, 980);
    ctx.textAlign = "right";
    ctx.globalAlpha = 1;
    ctx.font = `700 34px ${font}`;
    ctx.fillText("agregatory.pro", S - 80, 980);
    const url = c.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `rezultat-${quiz.slug}-${score}-iz-${total}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const share = () => {
    reachGoal("mini_quiz_share", { quiz: quiz.slug, score });
    const link = `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(link, "_blank", "noopener");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${pageUrl}`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header id="top" className="flex items-center justify-between gap-3 px-5 pt-4 md:px-14 md:pt-[22px]">
        <Link
          to="/"
          className="flex items-baseline gap-[2px] font-display text-[1.15em] font-semibold tracking-[-0.02em] md:text-[1.3em]"
        >
          agregatory<span className="font-normal text-muted-foreground">.pro</span>
        </Link>
        <Link
          to="/testy"
          className="inline-flex items-center gap-1.5 text-[max(12px,0.9em)] opacity-[.85] transition-opacity hover:opacity-100"
        >
          <Icon name="ListChecks" size={16} />
          все тесты
        </Link>
      </header>

      <section className="px-5 pb-7 pt-8 md:px-14 md:pb-12 md:pt-14">
        <nav
          aria-label="Хлебные крошки"
          className="mb-6 flex flex-wrap items-center gap-2 text-[max(12px,0.85em)] text-muted-foreground md:mb-8"
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
        <span className="inline-block rounded-lg bg-foreground px-3 py-1.5 text-[max(12px,0.82em)] font-semibold text-brand">
          Мини тест
        </span>
        <h1 className="mt-4 max-w-[20ch] font-display text-[30px] font-semibold leading-[.98] tracking-[-0.035em] md:text-[58px]">
          {quiz.h1}
        </h1>
        <p className="mt-6 max-w-[640px] text-[1.05em] leading-snug text-muted-foreground">{quiz.intro}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[max(12px,0.9em)] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="ListChecks" size={16} />
            {total} вопросов
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="Clock" size={16} />
            {quiz.minutes}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="Flame" size={16} />
            уровень: сложный
          </span>
        </div>
      </section>

      <section id="quiz" className="px-5 pb-11 md:px-14 md:pb-20">
        <div className="mx-auto max-w-[840px] rounded-[24px] bg-surface p-4 text-cream md:rounded-[32px] md:p-11">
          {!done ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 text-[max(12px,0.85em)] text-cream-muted">
                <span>
                  вопрос {step + 1} из {total}
                </span>
                {current.hard && (
                  <span className="rounded-lg bg-brand px-3 py-1.5 font-semibold text-foreground">
                    вопрос с подвохом
                  </span>
                )}
              </div>
              <div
                className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-cream/15"
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

              <h2 className="mt-7 font-display text-[1.35em] font-semibold leading-tight tracking-[-0.02em] md:text-[1.8em]">
                {current.question}
              </h2>

              <div className="mt-7 space-y-3">
                {current.options.map((o, i) => {
                  const right = i === current.correct;
                  const mine = i === answer;
                  const state = !answered
                    ? "border-cream/15 bg-cream/[0.04] hover:border-brand hover:bg-brand hover:text-foreground"
                    : right
                      ? "border-brand bg-brand text-foreground"
                      : mine
                        ? "border-[#ff7a59] bg-[#ff7a59]/15 text-cream"
                        : "border-cream/10 bg-transparent text-cream-muted";
                  return (
                    <button
                      key={o}
                      type="button"
                      disabled={answered}
                      onClick={() => choose(i)}
                      className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-4 text-left text-[1em] leading-snug transition-colors md:px-5 ${state}`}
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[0.9em] font-bold ${
                          answered && right ? "bg-foreground text-brand" : "bg-cream/10"
                        }`}
                      >
                        {LETTERS[i]}
                      </span>
                      <span className="pt-0.5">{o}</span>
                      {answered && (right || mine) && (
                        <Icon
                          name={right ? "Check" : "X"}
                          size={20}
                          className="ml-auto mt-0.5 shrink-0"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className="mt-6 rounded-2xl bg-cream/[0.07] p-4 md:p-6" aria-live="polite">
                  <div className={`font-display text-[1.1em] font-semibold ${isRight ? "text-brand" : "text-[#ff9a80]"}`}>
                    {isRight ? "Верно" : `Неверно. Правильный ответ: ${LETTERS[current.correct]}`}
                  </div>
                  <p className="mt-2 leading-relaxed text-cream-muted">{current.explain}</p>
                  <button
                    type="button"
                    onClick={goNext}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 font-semibold text-foreground transition-transform hover:-translate-y-0.5 sm:w-auto"
                  >
                    {step + 1 < total ? "следующий вопрос" : "показать результат"}
                    <Icon name="ArrowRight" size={18} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <div
                id="result-card"
                className="rounded-[20px] bg-brand p-6 text-foreground md:rounded-[28px] md:p-10"
              >
                <span className="inline-block rounded-lg bg-foreground px-3 py-1.5 text-[max(12px,0.82em)] font-semibold text-brand">
                  Мини тест
                </span>
                <div className="mt-4 font-display text-[1.25em] font-semibold leading-tight md:text-[1.6em]">
                  {quiz.navLabel}
                </div>
                <div className="mt-5 flex items-baseline gap-3">
                  <span className="font-display text-[88px] font-bold leading-none tracking-[-0.05em] md:text-[140px]">
                    {score}
                  </span>
                  <span className="font-display text-[1.6em] font-semibold md:text-[2.2em]">из {total}</span>
                </div>
                <div className="mt-2 text-[max(12px,0.9em)] opacity-75">
                  {score} {plural(score)}
                </div>
                <div className="mt-5 font-display text-[1.3em] font-semibold leading-tight md:text-[1.7em]">
                  {level.title}
                </div>
                <div className="mt-6 flex items-center justify-between gap-3 text-[max(12px,0.85em)]">
                  <span className="opacity-75">{fmtDate(new Date())}</span>
                  <span className="font-semibold">agregatory.pro</span>
                </div>
              </div>

              <p className="mt-6 leading-relaxed text-cream-muted">{level.text}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={saveImage}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 font-semibold text-foreground transition-transform hover:-translate-y-0.5"
                >
                  <Icon name="Download" size={18} />
                  сохранить картинку
                </button>
                <button
                  type="button"
                  onClick={share}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand px-5 py-3.5 font-semibold text-brand transition-colors hover:bg-brand hover:text-foreground"
                >
                  <Icon name="Send" size={18} />
                  поделиться в Telegram
                </button>
              </div>

              <div className="mt-6 rounded-2xl bg-cream/[0.07] p-4 md:p-6">
                <div className="font-display text-[1.1em] font-semibold">Пришлите результат в комментарии</div>
                <p className="mt-2 leading-relaxed text-cream-muted">
                  Сохраните картинку или сделайте скрин и пришлите в комментарии к посту с тестом в канале
                  «Внутри Еды». Посмотрим, у кого больше правильных.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <a
                    href={quiz.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => reachGoal("mini_quiz_to_post", { quiz: quiz.slug })}
                    className="inline-flex items-center gap-2 font-semibold text-brand hover:underline"
                  >
                    открыть пост в канале
                    <Icon name="ArrowUpRight" size={16} />
                  </a>
                  <button
                    type="button"
                    onClick={copy}
                    className="inline-flex items-center gap-2 text-cream-muted transition-colors hover:text-cream"
                  >
                    <Icon name={copied ? "Check" : "Copy"} size={16} />
                    {copied ? "скопировано" : "скопировать результат"}
                  </button>
                </div>
              </div>

              <h3 className="mt-9 font-display text-[1.2em] font-semibold">Ваши ответы</h3>
              <ol className="mt-4 space-y-3">
                {quiz.questions.map((q, i) => {
                  const ok = picked[i] === q.correct;
                  return (
                    <li key={q.question} className="flex gap-3 leading-snug">
                      <Icon
                        name={ok ? "Check" : "X"}
                        size={18}
                        className={`mt-0.5 shrink-0 ${ok ? "text-brand" : "text-[#ff9a80]"}`}
                      />
                      <span className="text-cream-muted">
                        <span className="text-cream">{i + 1}. {q.question}</span>
                        {!ok && (
                          <>
                            {" "}
                            Правильно: {LETTERS[q.correct]}. {q.options[q.correct]}
                          </>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ol>

              <button
                type="button"
                onClick={restart}
                className="mt-8 inline-flex items-center gap-2 text-[max(12px,0.9em)] text-cream-muted transition-colors hover:text-cream"
              >
                <Icon name="RotateCcw" size={16} />
                пройти заново
              </button>
            </>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 pb-11 md:px-14 md:pb-16">
        <h2 className="font-display text-[1.6em] font-semibold tracking-[-0.02em]">другие тесты</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
          {[
            ...MINI_QUIZZES.filter((m) => m.slug !== quiz.slug).map((m) => ({
              href: `/testy/mini/${m.slug}`,
              icon: "Zap",
              tag: "Мини тест",
              title: m.navLabel,
              lead: m.lead,
            })),
            ...QUIZ_META.map((m) => ({
              href: `/testy/${m.slug}`,
              icon: m.icon,
              tag: m.kind === "audit" ? m.minutes : `${m.count} вопросов`,
              title: m.navLabel,
              lead: m.lead,
            })),
          ].map((o) => (
            <Link
              key={o.href}
              to={o.href}
              className="rounded-[24px] bg-surface p-4 text-cream transition-transform hover:-translate-y-1 md:p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <Icon name={o.icon} size={22} className="text-brand" />
                <span className="rounded-lg bg-cream/10 px-2.5 py-1 text-[max(12px,0.74em)] font-medium text-cream-muted">
                  {o.tag}
                </span>
              </div>
              <h3 className="mt-3 font-display text-[1.12em] font-semibold leading-tight">{o.title}</h3>
              <p className="mt-2 text-[max(12px,0.9em)] leading-snug text-cream-muted">{o.lead}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[840px] px-5 pb-14 text-[max(12px,0.9em)] text-muted-foreground md:px-0 md:pb-20">
        <h2 className="font-display text-[1.15em] font-semibold text-foreground">Источники</h2>
        <ul className="mt-3 space-y-2">
          {quiz.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                {s.title}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4">
          Обновлено: {new Date(quiz.updated).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </section>
    </main>
  );
};

export default MiniQuizPage;
