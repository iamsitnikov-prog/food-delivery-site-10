export type ReadChannel = {
  id: string;
  label: string;
  handle: string;
  href: string;
  icon: string;
  author: string;
  photo?: string;
  qr: string;
  description: string;
  short: string;
};

export const READ_CHANNELS: ReadChannel[] = [
  {
    id: "vnutri-edy",
    label: "Внутри еды",
    handle: "@vnutri_edy_channel",
    href: "https://t.me/vnutri_edy_channel",
    icon: "Send",
    author: "Юрий Ситников",
    photo: "/team-yuriy.webp",
    qr: "/qr/vnutri-edy.png",
    description:
      "Канал о том, как устроены агрегаторы изнутри: разборы обновлений сервиса, новые инструменты кабинета, механики акций и реальные цифры из наших проектов. Пишу простым языком о том, за что рестораны обычно переплачивают.",
    short: "Разборы обновлений сервиса и цифры из наших проектов",
  },
  {
    id: "kovalchuk",
    label: "Ковальчук о доставке",
    handle: "@Kovalchuk_dostavka",
    href: "https://t.me/Kovalchuk_dostavka",
    icon: "Send",
    author: "Лилия Ковальчук",
    photo: "/team-liliya.webp",
    qr: "/qr/kovalchuk.png",
    description:
      "Канал про операционную сторону доставки: работа с рейтингом и отзывами, штрафы и удержания, процессы на кухне, обучение команды. Много практики из ежедневного сопровождения ресторанов.",
    short: "Рейтинг, отзывы, штрафы и процессы на кухне",
  },
  {
    id: "dzen",
    label: "Дзен",
    handle: "Внутри еды на Дзене",
    href: "https://dzen.ru/id/669050347cf47c302ba6bd98?share_to=link",
    icon: "BookOpen",
    author: "Юрий Ситников",
    photo: "/team-yuriy.webp",
    qr: "/qr/dzen.png",
    description:
      "Длинные материалы и подробные разборы: экономика доставки, кейсы с расчётами, пошаговые инструкции. Формат для тех, кому удобнее читать статьи целиком, а не короткие посты.",
    short: "Длинные разборы, кейсы и пошаговые инструкции",
  },
];