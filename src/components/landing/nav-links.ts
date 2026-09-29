// Ссылки шапки и подвала.
// Лежат отдельно от Header.tsx, чтобы пререндер мог собрать навигацию
// в готовый HTML, не подтягивая React-компоненты.

export const USEFUL_LINKS = [
  { href: "/kalkulyatory", label: "калькуляторы", icon: "Calculator" },
  { href: "/sravnenie-agregatorov", label: "сравнение игроков", icon: "GitCompare" },
  { href: "/razbor-otchetov", label: "разбор отчётов", icon: "FileSearch" },
  { href: "/chek-listy", label: "чек-листы", icon: "ListChecks" },
  { href: "/testy", label: "тесты", icon: "CircleHelp" },
  { href: "/slovar", label: "глоссарий", icon: "BookA" },
  { href: "/pochitat", label: "почитать", icon: "BookOpen" },
];

export const NAV = [
  { href: "/uslugi", label: "услуги" },
  { href: "/goroda", label: "города" },
  { href: "/blog", label: "блог" },
  { href: "/partnery", label: "партнёры" },
  { href: "#results", label: "кейсы" },
  { href: "#pricing", label: "стоимость" },
  { href: "#free-audit", label: "бесплатный анализ" },
  { href: "#team", label: "кто мы" },
  { href: "#contacts", label: "контакты" },
];
