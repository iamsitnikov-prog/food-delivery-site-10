import { QUIZ_QUESTIONS, QUIZ_LEVELS } from "../quiz";
import type { QuizDef } from "../quiz-types";
import { KABINET_QUIZ } from "./kabinet";
import { EKONOMIKA_QUIZ } from "./ekonomika";
import { KACHESTVO_QUIZ } from "./kachestvo";
import { DOKUMENTY_QUIZ } from "./dokumenty";

export const AUDIT_QUIZ: QuizDef = {
  slug: "audit",
  icon: "ClipboardCheck",
  navLabel: "Экспресс-аудит заведения",
  h1: "Тест: как ваше заведение работает с агрегатором",
  title: "Тест для ресторана: аудит работы с агрегатором доставки",
  description:
    "Короткий тест на 21 вопрос: оцените, как ваше заведение работает с агрегатором — рейтинг, экономика, продвижение и процессы. Результат с рекомендациями.",
  lead: "21 вопрос о вашем заведении: рейтинг, экономика, продвижение и процессы.",
  intro:
    "Это не проверка знаний, а экспресс-аудит: отвечайте о том, как всё устроено у вас сейчас. В конце получите оценку и список первых шагов.",
  minutes: "3 минуты",
  kind: "audit",
  questions: QUIZ_QUESTIONS,
  levels: QUIZ_LEVELS,
};

export const QUIZZES: QuizDef[] = [
  AUDIT_QUIZ,
  KABINET_QUIZ,
  EKONOMIKA_QUIZ,
  KACHESTVO_QUIZ,
  DOKUMENTY_QUIZ,
];

export const getQuiz = (slug: string) => QUIZZES.find((q) => q.slug === slug);

export const getQuizLevel = (q: QuizDef, score: number) =>
  q.levels.find((l) => score >= l.min) || q.levels[q.levels.length - 1];
