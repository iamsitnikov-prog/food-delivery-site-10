export type ChecklistMeta = {
  slug: string;
  icon: string;
  navLabel: string;
  lead: string;
  count: number;
};

export const CHECKLIST_META: ChecklistMeta[] = [
  {
    slug: "zapusk-na-agregatore",
    icon: "Rocket",
    navLabel: "Запуск на агрегаторе",
    lead: "Всё, что нужно сделать до первого заказа: от документов до фотографий и зон доставки.",
    count: 28
  },
  {
    slug: "proverka-kartochki",
    icon: "ClipboardCheck",
    navLabel: "Проверка карточки",
    lead: "Пройдитесь по карточке глазами гостя и найдите, что мешает вам получать заказы.",
    count: 23
  },
  {
    slug: "sezonnyy-pik",
    icon: "TrendingUp",
    navLabel: "Подготовка к сезонному пику",
    lead: "Праздники и длинные выходные приносят поток заказов — и обрушивают рейтинг у тех, кто не подготовился.",
    count: 26
  },
  {
    slug: "kontent-i-kartochka",
    icon: "Images",
    navLabel: "Контент и карточка блюда",
    lead: "Гость выбирает глазами: фото, описание и теги решают, откроет ли он вашу карточку и дойдёт ли до корзины.",
    count: 28
  },
  {
    slug: "ekonomika-dostavki",
    icon: "Wallet",
    navLabel: "Экономика и финансы",
    lead: "Заказы растут, а денег не прибавляется? Пройдите по всем статьям расходов и найдите, где теряется маржа.",
    count: 28
  },
  {
    slug: "kachestvo-i-reyting",
    icon: "Star",
    navLabel: "Качество и рейтинг",
    lead: "Рейтинг определяет видимость в выдаче и доступ к продвижению. Проверьте, что его не роняет.",
    count: 28
  }
];
