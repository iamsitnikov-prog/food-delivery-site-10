export type BlogGroup = { id: string; label: string; tags: string[]; isNew?: boolean };

export const BLOG_GROUPS: BlogGroup[] = [
  { id: "documents", label: "правила и документы", tags: ["документы", "штрафы"], isNew: true },
  { id: "tools", label: "новые инструменты", tags: ["инструменты"], isNew: true },
  {
    id: "promo",
    label: "продвижение",
    tags: ["продвижение", "раскрутка", "выдача", "акции", "заказы", "агентство", "услуги"],
  },
  { id: "start", label: "запуск и настройка", tags: ["запуск", "кабинет", "настройки", "стратегия"] },
  { id: "content", label: "меню и контент", tags: ["меню", "контент"] },
  { id: "money", label: "деньги и аналитика", tags: ["финансы", "экономика", "аналитика"] },
  {
    id: "ops",
    label: "работа заведения",
    tags: ["качество", "рейтинг", "доставка", "обучение", "ошибки", "сети", "каналы", "удержание"],
  },
];