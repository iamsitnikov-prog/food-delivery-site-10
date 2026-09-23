export type Person = {
  name: string;
  photo: string;
  exp: string;
  role: string;
  facts: string[];
  link?: { label: string; href: string };
};

export const COURSE = "Бесплатная школа доставки Яндекс Еды";

export const PEOPLE: Person[] = [
  {
    name: "Юрий Ситников",
    photo: "/team-yuriy.webp",
    exp: "15 лет общепит · 5 лет доставка",
    role: "Руководитель агрегаторов, преподаватель Novikov Business School",
    facts: [
      "Руководитель агрегаторов (Ginza Project, Faces Team, GrigGroup)",
      "Преподаватель Novikov Business School",
      "Модератор «Тема Еды» 2023–2026",
      "Эксперт Яндекс Еда «Рецепты Роста», «Консалтинг для региональных рестораторов»",
      "Сертифицированный эксперт FORBES Экспертиза",
    ],
    link: { label: "читать FORBES", href: "https://blogs.forbes.ru/author/sitnikov/" },
  },
  {
    name: "Лилия Ковальчук",
    photo: "/team-liliya.webp",
    exp: "20 лет общепит · 15 лет доставка",
    role: "Эксперт-практик в доставке, автор курса «Сильная доставка»",
    facts: [
      "Эксперт-практик в доставке еды",
      "Ex. партнёр сети «Дагестанская Лавка»",
      "Автор курса «Сильная доставка» в Novikov Business School",
      "Модератор «Тема Еды» 2024–2025",
      "Эксперт проекта Яндекс Еда «Консалтинг для региональных рестораторов»",
    ],
    link: { label: "профиль в Novikov School", href: "https://novikovspace.com/school/chefs/liliya-kovalchuk" },
  },
];
