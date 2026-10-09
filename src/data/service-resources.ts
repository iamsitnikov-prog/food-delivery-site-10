export type ResourceLink = { to: string; label: string; note: string; icon: string; from?: string };

const GLOSSARY = (anchor: string, label: string, note: string): ResourceLink => ({
  to: `/slovar/${anchor}`,
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

// Статья блога. from — дата выхода статьи: до неё ссылку не показываем.
const BLOG = (slug: string, label: string, note: string, from?: string): ResourceLink => ({
  to: `/blog/${slug}`,
  label,
  note,
  icon: "FileText",
  from,
});

const CHECK = (slug: string, label: string, note: string): ResourceLink => ({
  to: `/chek-listy/${slug}`,
  label,
  note,
  icon: "ListChecks",
});

export const SERVICE_RESOURCES: Record<string, ResourceLink[]> = {
  "podklyuchenie-k-yandex-ede": [
    BLOG("stoit-li-restoranu-vyhodit-na-agregator", "Стоит ли выходить на агрегатор", "Плюсы, минусы и экономика"),
    BLOG("kak-podklyuchit-restoran-k-yandex-ede", "Как подключить ресторан к Яндекс Еде", "Требования, документы и сроки"),
    BLOG("oferta-yandex-eda-razbor", "Разбор оферты Яндекс Еды", "Что подписываете при подключении"),
    COMPARE,
    CHECK("zapusk-na-agregatore", "Чек-лист запуска", "Что сделать до первого заказа"),
    GLOSSARY("komissiya", "Комиссия агрегатора", "Почему ставка 35% или 20%"),
  ],
  "nastroyka-vendora": [
    BLOG("rezhim-vysokaya-nagruzka-yandex-eda", "Режим «высокая нагрузка»", "Когда включать и как не терять заказы"),
    BLOG("stop-list-yandex-eda", "Стоп-лист в Яндекс Еде", "Как вести без отмен и штрафов", "2026-10-12"),
    {
      to: "/blog/razdely-lichnogo-kabineta-vendor",
      label: "Яндекс Еда Вендор: обзор кабинета",
      note: "Как войти и что лежит в каждом разделе",
      icon: "BookA",
    },
    CHECK("zapusk-na-agregatore", "Чек-лист запуска", "Пошаговая настройка кабинета"),
    GLOSSARY("kabinet-partnera", "Кабинет партнёра", "Что где лежит и как читать отчёты"),
    COMPARE,
  ],
  "audit-kabineta": [
    BLOG("uslugi-po-prodvizheniyu-servisa-yandex-eda", "Услуги по продвижению в Яндекс Еде", "Что входит и как выбрать подрядчика"),
    BLOG("pochemu-net-zakazov-na-yandex-ede", "Почему нет заказов", "Частые причины и что проверить"),
    BLOG("razdely-lichnogo-kabineta-vendor", "Яндекс Еда Вендор: обзор кабинета", "Что смотреть в каждом разделе"),
    CHECK("proverka-kartochki", "Чек-лист проверки карточки", "Что смотрим при аудите"),
    GLOSSARY("indeks-kachestva", "Индекс качества", "Скрытая метрика, влияющая на позиции"),
    CALC("rentabelnost-zakaza", "Рентабельность заказа", "Сколько остаётся с одного заказа"),
  ],
  "obuchenie-personala": [
    BLOG("obuchenie-komandy-rabote-s-dostavkoy", "Обучение команды доставке", "Что должен знать каждый в смене"),
    BLOG("rezhim-vysokaya-nagruzka-yandex-eda", "Режим «высокая нагрузка»", "Как смене пережить пик без отмен"),
    GLOSSARY("stop-list", "Стоп-лист", "Главный инструмент против отмен"),
    CHECK("kachestvo-i-reyting", "Чек-лист качества", "Что проверять каждую смену"),
    GLOSSARY("kabinet-partnera", "Кабинет партнёра", "Чему учим команду в первую очередь"),
  ],
  "snizhenie-drr": [
    BLOG("kak-snizit-drr-na-agregatore", "Как снизить ДРР", "Разбор по шагам"),
    BLOG("reklama-v-yandex-ede", "Реклама в Яндекс Еде", "Форматы и сколько стоит каждый"),
    CALC("drr", "Калькулятор ДРР", "Считаем предельный ДРР по вашей марже"),
    GLOSSARY("drr", "Что такое ДРР", "Формула и нормальные значения"),
    GLOSSARY("romi", "ROMI", "Отдача рекламы в прибыли, а не в выручке"),
  ],
  "povyshenie-reytinga": [
    BLOG("kontrol-kachestva-zakazov", "Контроль качества заказов", "Как не попасть в тот самый 1%"),
    BLOG("kak-podnyat-reyting-na-yandex-ede", "Как поднять рейтинг", "Что влияет на оценку"),
    BLOG("kak-rabotat-s-otzyvami-v-dostavke", "Как работать с отзывами", "Ответы на негатив и жалобы"),
    CHECK("kachestvo-i-reyting", "Чек-лист качества", "Пошаговый разбор причин негатива"),
    GLOSSARY("rejting", "Рейтинг заведения", "Как он считается и чем восстанавливается"),
    GLOSSARY("indeks-kachestva", "Индекс качества", "Что сервис учитывает кроме оценок"),
  ],
  "sostavlenie-menyu": [
    BLOG("kak-sostavit-menyu-dlya-dostavki", "Как составить меню для доставки", "Что оставить и что убрать"),
    BLOG("opisanie-blyuda-dlya-agregatora", "Описание блюда для агрегатора", "Состав, вес, КБЖУ и текст", "2026-10-19"),
    GLOSSARY("abc-analiz", "ABC-анализ", "Какие блюда кормят заведение"),
    GLOSSARY("fudkost", "Фудкост", "Почему не всякое блюдо годится для акции"),
    CALC("rentabelnost-zakaza", "Рентабельность заказа", "Проверьте экономику позиций"),
  ],
  "moderatsiya-blyud": [
    BLOG("moderatsiya-blyud-yandex-eda", "Почему отклоняют блюда", "Причины и как пройти модерацию", "2026-10-14"),
    BLOG("foto-blyud-dlya-agregatora", "Фото блюд для агрегатора", "Требования и частые ошибки"),
    CHECK("kontent-i-kartochka", "Чек-лист контента", "Требования к фото и описаниям"),
    GLOSSARY("opisanie-blyuda", "Описание блюда", "Что обязательно указывать"),
    GLOSSARY("kartochka-restorana", "Карточка ресторана", "Из чего она состоит"),
  ],
  "fotokontent-dlya-menyu": [
    BLOG("foto-blyud-dlya-agregatora", "Фото блюд для агрегатора", "Требования и частые ошибки"),
    BLOG("moderatsiya-blyud-yandex-eda", "Почему отклоняют блюда", "В том числе из-за фото", "2026-10-14"),
    CHECK("kontent-i-kartochka", "Чек-лист контента", "Что проверить в карточке"),
    GLOSSARY("fotokontent", "Фотоконтент", "Почему фото решает больше рекламы"),
    GLOSSARY("konversiya-kartochki", "Конверсия карточки", "Как её измерить"),
  ],
  "nastroyka-aktsiy": [
    BLOG("zadaniya-i-nagrady-yandex-eda", "Задания и награды Яндекс Еды", "Как получить бонусы на продвижение"),
    BLOG("referalnaya-programma-yandex-eda", "Реферальная программа", "Как привести гостей и получить бонус"),
    BLOG("kakie-aktsii-zapuskat-na-agregatore", "Какие акции запускать", "Механики и их экономика"),
    BLOG("kombo-v-yandex-ede", "Комбо в Яндекс Еде", "Как собрать набор без потери маржи", "2026-10-16"),
    GLOSSARY("promo-aktsii", "Промоакции", "Когда акция уводит в минус"),
    GLOSSARY("fudkost", "Фудкост", "На каких блюдах скидка безопасна"),
    CALC("rentabelnost-zakaza", "Рентабельность заказа", "Посчитайте акцию до запуска"),
  ],
  "rabota-s-otmenami": [
    BLOG("kak-snizit-otmeny-zakazov", "Как снизить отмены", "Причины и решения"),
    BLOG("stop-list-yandex-eda", "Стоп-лист в Яндекс Еде", "Главный источник отмен", "2026-10-12"),
    GLOSSARY("otmeny", "Отмены заказов", "Чем они бьют по выдаче"),
    GLOSSARY("stop-list", "Стоп-лист", "Как избежать отмен по вине кухни"),
    CHECK("kachestvo-i-reyting", "Чек-лист качества", "Разбор причин по сменам"),
  ],
  "shtrafy-i-uderzhaniya": [
    BLOG("shtrafy-po-oferte-kak-osporit", "Как оспорить штраф по оферте", "Основания и порядок спора"),
    BLOG("oferta-yandex-eda-razbor", "Разбор оферты и п. 14.7", "Как штрафы попадают в отчёт"),
    GLOSSARY("uderzhaniya", "Удержания", "За что сервис вычитает деньги"),
    GLOSSARY("oferta", "Оферта", "Где прописаны основания для штрафов"),
    CHECK("kachestvo-i-reyting", "Чек-лист качества", "Профилактика удержаний"),
  ],
  "analitika-i-otchetnost": [
    BLOG("analitika-restorana-na-agregatore", "Аналитика ресторана", "Какие отчёты смотреть"),
    BLOG("akty-i-otchety-yandex-eda-13-dney", "Акты и отчёты Яндекс Еды", "Сроки и что проверять"),
    GLOSSARY("abc-analiz", "ABC-анализ", "Разделение меню по вкладу в выручку"),
    CALC("okupaemost", "Окупаемость канала", "Сходится ли экономика в целом"),
    GLOSSARY("mediannoe-mesto", "Медианное место", "Где вас реально видят в выдаче"),
  ],
  "zony-i-grafik-dostavki": [
    BLOG("zony-dostavki-i-grafik-raboty", "Зоны доставки и график", "Как настроить"),
    BLOG("rezhim-vysokaya-nagruzka-yandex-eda", "Режим «высокая нагрузка»", "Что делать в часы пик"),
    GLOSSARY("zona-dostavki", "Зона доставки", "Баланс между охватом и качеством"),
    GLOSSARY("vremya-prigotovleniya", "Время приготовления", "Чем опасно занижать и завышать"),
    GLOSSARY("chasy-pik", "Часы пик", "Почему их настраивают отдельно"),
  ],
  "podklyuchenie-samovyvoza": [
    BLOG("samovyvoz-v-restorane", "Самовывоз в ресторане", "Как организовать выдачу"),
    GLOSSARY("komissiya", "Комиссия агрегатора", "Почему самовывоз выгоднее"),
    CALC("model-dostavki", "Какая модель выгоднее", "Сравнение схем доставки"),
    COMPARE,
  ],
  "zapusk-seti-restoranov": [
    BLOG("set-restoranov-na-agregatore", "Сеть ресторанов на агрегаторе", "Стандарты для всех точек"),
    CHECK("zapusk-na-agregatore", "Чек-лист запуска", "Единый стандарт для всех точек"),
    CALC("model-dostavki", "Какая модель выгоднее", "Свои курьеры или курьеры сервиса"),
    COMPARE,
  ],
  "konsultatsiya-restoratora": [
    BLOG("agentstvo-po-prodvizheniyu-na-yandex-ede", "Агентство по продвижению на Яндекс Еде", "Когда нужно и как выбрать"),
    BLOG("stoit-li-restoranu-vyhodit-na-agregator", "Стоит ли выходить на агрегатор", "Плюсы, минусы и экономика"),
    BLOG("pochemu-net-zakazov-na-yandex-ede", "Почему нет заказов", "С чего начать разбор"),
    BLOG("oshibki-restoranov-na-agregatorah", "Ошибки ресторанов на агрегаторах", "Что встречаем чаще всего"),
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
    label: "Словарь доставки",
    note: "Понятия доставки простым языком",
    icon: "BookA",
  },
  BLOG("kak-podklyuchit-restoran-k-yandex-ede", "Как подключить ресторан к Яндекс Еде", "Требования, документы и сроки"),
  BLOG("prodvizhenie-restorana-na-yandex-ede", "Продвижение ресторана в Яндекс Еде", "С чего начать"),
  BLOG("uslugi-po-prodvizheniyu-servisa-yandex-eda", "Услуги по продвижению в Яндекс Еде", "Что входит и как выбрать подрядчика"),
  BLOG("raskrutka-restorana-v-yandex-ede", "Раскрутка ресторана в Яндекс Еде", "Первые шаги и частые ошибки"),
];

// Дата по UTC — так же, как в пререндере: статья с будущей датой ещё не опубликована.
const isLive = (r: ResourceLink) => !r.from || r.from <= new Date().toISOString().slice(0, 10);

export const getServiceResources = (slug: string, kind: "service" | "city"): ResourceLink[] =>
  (kind === "city" ? CITY_RESOURCES : SERVICE_RESOURCES[slug] || CITY_RESOURCES).filter(isLive);
