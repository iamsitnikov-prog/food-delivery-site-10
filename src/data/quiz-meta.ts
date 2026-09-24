export type QuizMeta = {
  slug: string;
  icon: string;
  navLabel: string;
  lead: string;
  minutes: string;
  count: number;
  kind: "audit" | "knowledge";
};

export const QUIZ_META: QuizMeta[] = [
  {
    slug: "audit",
    icon: "ClipboardCheck",
    navLabel: "Экспресс-аудит заведения",
    lead: "21 вопрос о вашем заведении: рейтинг, экономика, продвижение и процессы.",
    minutes: "3 минуты",
    count: 21,
    kind: "audit",
  },
  {
    slug: "kabinet",
    icon: "LayoutDashboard",
    navLabel: "Кабинет и запуск",
    lead: "50 вопросов о разделах кабинета, настройке меню, зонах доставки и запуске заведения.",
    minutes: "12–15 минут",
    count: 50,
    kind: "knowledge",
  },
  {
    slug: "ekonomika",
    icon: "TrendingUp",
    navLabel: "Продвижение и экономика",
    lead: "50 вопросов об аукционе, ставках, ДРР, марже и экономике акций.",
    minutes: "12–15 минут",
    count: 50,
    kind: "knowledge",
  },
  {
    slug: "kachestvo",
    icon: "Star",
    navLabel: "Качество и рейтинг",
    lead: "50 вопросов о рейтинге, отменах, комплектации, отзывах и стандартах кухни.",
    minutes: "12–15 минут",
    count: 50,
    kind: "knowledge",
  },
  {
    slug: "dokumenty",
    icon: "FileText",
    navLabel: "Документы и 289-ФЗ",
    lead: "50 вопросов о кодах классификации, сертификации, оферте и бухгалтерии доставки.",
    minutes: "12–15 минут",
    count: 50,
    kind: "knowledge",
  },
];
