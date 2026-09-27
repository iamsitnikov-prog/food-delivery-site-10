export type ResourceLink = { to: string; label: string; note: string; icon: string };

const GLOSSARY = (anchor: string, label: string, note: string): ResourceLink => ({
  to: `/slovar#${anchor}`,
  label,
  note,
  icon: "BookA",
});

const COMPARE: ResourceLink = {
  to: "/sravnenie-agregatorov",
  label: "Яндекс, Купер или Чиббис",
  note: "Сравнение комиссий и условий трёх агрегаторов",
  icon: "GitCompare",
};

const CALC = (slug: string, label: string, note: string): ResourceLink => ({
  to: `/kalkulyatory/${slug}`,
  label,
  note,
  icon: "Calculator",
});

const CHECK = (slug: string, label: string, note: string): ResourceLink => ({
  to: `/chek-listy/${slug}`,
  label,
  note,
  icon: "ListChecks",
});

export const SERVICE_RESOURCES: Record<string, ResourceLink[]> = {
  "podklyuchenie-k-yandex-ede": [
    COMPARE,
    CHECK("zapusk-na-agregatore", "Чек-лист запуска", "Что сделать до первого заказа"),
    GLOSSARY("komissiya", "Комиссия агрегатора", "Почему ставка 35% или 20%"),
  ],
  "nastroyka-vendora": [
    CHECK("zapusk-na-agregatore", "Чек-лист запуска", "Пошаговая настройка кабинета"),
    GLOSSARY("kabinet-partnera", "Кабинет партнёра", "Что где лежит и как читать отчёты"),
    COMPARE,
  ],
  "audit-kabineta": [
    CHECK("proverka-kartochki", "Чек-лист проверки карточки", "Что смотрим при аудите"),
    GLOSSARY("indeks-kachestva", "Индекс качества", "Скрытая метрика, влияющая на позиции"),
    CALC("rentabelnost-zakaza", "Рентабельность заказа", "Сколько остаётся с одного заказа"),
  ],
  "obuchenie-personala": [
    GLOSSARY("stop-list", "Стоп-лист", "Главный инструмент против отмен"),
    CHECK("kachestvo-i-reyting", "Чек-лист качества", "Что проверять каждую смену"),
    GLOSSARY("kabinet-partnera", "Кабинет партнёра", "Чему учим команду в первую очередь"),
  ],
  "snizhenie-drr": [
    CALC("drr", "Калькулятор ДРР", "Считаем предельный ДРР по вашей марже"),
    GLOSSARY("drr", "Что такое ДРР", "Формула и нормальные значения"),
    GLOSSARY("romi", "ROMI", "Отдача рекламы в прибыли, а не в выручке"),
  ],
  "povyshenie-reytinga": [
    CHECK("kachestvo-i-reyting", "Чек-лист качества", "Пошаговый разбор причин негатива"),
    GLOSSARY("rejting", "Рейтинг заведения", "Как он считается и чем восстанавливается"),
    GLOSSARY("indeks-kachestva", "Индекс качества", "Что сервис учитывает кроме оценок"),
  ],
  "sostavlenie-menyu": [
    GLOSSARY("abc-analiz", "ABC-анализ", "Какие блюда кормят заведение"),
    GLOSSARY("fudkost", "Фудкост", "Почему не всякое блюдо годится для акции"),
    CALC("rentabelnost-zakaza", "Рентабельность заказа", "Проверьте экономику позиций"),
  ],
  "moderatsiya-blyud": [
    CHECK("kontent-i-kartochka", "Чек-лист контента", "Требования к фото и описаниям"),
    GLOSSARY("opisanie-blyuda", "Описание блюда", "Что обязательно указывать"),
    GLOSSARY("kartochka-restorana", "Карточка ресторана", "Из чего она состоит"),
  ],
  "fotokontent-dlya-menyu": [
    CHECK("kontent-i-kartochka", "Чек-лист контента", "Что проверить в карточке"),
    GLOSSARY("fotokontent", "Фотоконтент", "Почему фото решает больше рекламы"),
    GLOSSARY("konversiya-kartochki", "Конверсия карточки", "Как её измерить"),
  ],
  "nastroyka-aktsiy": [
    GLOSSARY("promo-aktsii", "Промоакции", "Когда акция уводит в минус"),
    GLOSSARY("fudkost", "Фудкост", "На каких блюдах скидка безопасна"),
    CALC("rentabelnost-zakaza", "Рентабельность заказа", "Посчитайте акцию до запуска"),
  ],
  "rabota-s-otmenami": [
    GLOSSARY("otmeny", "Отмены заказов", "Чем они бьют по выдаче"),
    GLOSSARY("stop-list", "Стоп-лист", "Как избежать отмен по вине кухни"),
    CHECK("kachestvo-i-reyting", "Чек-лист качества", "Разбор причин по сменам"),
  ],
  "shtrafy-i-uderzhaniya": [
    GLOSSARY("uderzhaniya", "Удержания", "За что сервис вычитает деньги"),
    GLOSSARY("oferta", "Оферта", "Где прописаны основания для штрафов"),
    CHECK("kachestvo-i-reyting", "Чек-лист качества", "Профилактика удержаний"),
  ],
  "analitika-i-otchetnost": [
    GLOSSARY("abc-analiz", "ABC-анализ", "Разделение меню по вкладу в выручку"),
    CALC("okupaemost", "Окупаемость канала", "Сходится ли экономика в целом"),
    GLOSSARY("mediannoe-mesto", "Медианное место", "Где вас реально видят в выдаче"),
  ],
  "zony-i-grafik-dostavki": [
    GLOSSARY("zona-dostavki", "Зона доставки", "Баланс между охватом и качеством"),
    GLOSSARY("vremya-prigotovleniya", "Время приготовления", "Чем опасно занижать и завышать"),
    GLOSSARY("chasy-pik", "Часы пик", "Почему их настраивают отдельно"),
  ],
  "podklyuchenie-samovyvoza": [
    GLOSSARY("komissiya", "Комиссия агрегатора", "Почему самовывоз выгоднее"),
    CALC("model-dostavki", "Какая модель выгоднее", "Сравнение схем доставки"),
    COMPARE,
  ],
  "zapusk-seti-restoranov": [
    CHECK("zapusk-na-agregatore", "Чек-лист запуска", "Единый стандарт для всех точек"),
    CALC("model-dostavki", "Какая модель выгоднее", "Свои курьеры или курьеры сервиса"),
    COMPARE,
  ],
  "konsultatsiya-restoratora": [
    COMPARE,
    CALC("rentabelnost-zakaza", "Рентабельность заказа", "Начните с экономики одного заказа"),
    GLOSSARY("drr", "Что такое ДРР", "Базовая метрика здоровья рекламы"),
  ],
};

export const CITY_RESOURCES: ResourceLink[] = [
  COMPARE,
  CALC("rentabelnost-zakaza", "Рентабельность заказа", "Посчитайте экономику на своих цифрах"),
  {
    to: "/slovar",
    label: "Глоссарий доставки",
    note: "41 понятие доставки простым языком",
    icon: "BookA",
  },
];

export const getServiceResources = (slug: string, kind: "service" | "city"): ResourceLink[] =>
  kind === "city" ? CITY_RESOURCES : SERVICE_RESOURCES[slug] || CITY_RESOURCES;
