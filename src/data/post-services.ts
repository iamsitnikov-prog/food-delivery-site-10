// Какая услуга подходит к статье: сначала по slug статьи, иначе по тегу.
// Используется в блоке «поможем с этим» под статьёй — внутренняя ссылка из блога на услугу.
export type PostService = { to: string; label: string; note: string };

const S = (slug: string, label: string, note: string): PostService => ({ to: `/uslugi/${slug}`, label, note });

const AUDIT = S("audit-kabineta", "Аудит кабинета", "Разберём ваш кабинет и дадим план с приоритетами");
const KONSULT = S("konsultatsiya-restoratora", "Консультация ресторатора", "Ответим на вопросы по вашей ситуации и дадим план");
const SHTRAFY = S("shtrafy-i-uderzhaniya", "Оспаривание штрафов и удержаний", "Проверим обоснованность и подготовим обращения");
const REYTING = S("povyshenie-reytinga", "Повышение рейтинга", "Работа с отзывами, жалобами и индексом качества");
const DRR = S("snizhenie-drr", "Снижение ДРР", "Ставки, акции и бюджет под вашу экономику");
const ANALITIKA = S("analitika-i-otchetnost", "Аналитика и отчётность", "Покажем реальную прибыль и точки роста");
const PODKL = S("podklyuchenie-k-yandex-ede", "Подключение к Яндекс Еде", "Анкета, договор, кабинет и меню — под ключ");
const VENDOR = S("nastroyka-vendora", "Настройка вендора", "Меню, стоп-листы, зоны и график — и обучение команды");

const BY_SLUG: Record<string, PostService> = {
  "foto-blyud-dlya-agregatora": S("fotokontent-dlya-menyu", "Фотоконтент для меню", "Съёмка и подготовка фото по требованиям сервиса"),
  "samovyvoz-v-restorane": S("podklyuchenie-samovyvoza", "Подключение самовывоза", "Условия, время готовности и выдача"),
  "kak-snizit-otmeny-zakazov": S("rabota-s-otmenami", "Работа с отменами", "Разбор причин и процессы на кухне"),
  "stop-list-yandex-eda": S("rabota-s-otmenami", "Работа с отменами", "Разбор причин и процессы на кухне"),
  "razdely-lichnogo-kabineta-vendor": VENDOR,
  "zony-dostavki-i-grafik-raboty": S("zony-i-grafik-dostavki", "Зоны и график доставки", "Радиус, стоимость по зонам, часы работы"),
  "moderatsiya-blyud-yandex-eda": S("moderatsiya-blyud", "Модерация блюд", "Подготовим карточки и разберём отклонённые"),
  "opisanie-blyuda-dlya-agregatora": S("sostavlenie-menyu", "Создание меню", "Разделы, описания, вес, модификаторы и цены"),
  "kak-sostavit-menyu-dlya-dostavki": S("sostavlenie-menyu", "Создание меню", "Разделы, описания, вес, модификаторы и цены"),
  "set-restoranov-na-agregatore": S("zapusk-seti-restoranov", "Работа с сетями", "Единые стандарты для всех точек"),
  "obuchenie-komandy-rabote-s-dostavkoy": S("obuchenie-personala", "Обучение персонала", "Курс для команды по работе с агрегатором"),
  "rezhim-vysokaya-nagruzka-yandex-eda": S("obuchenie-personala", "Обучение персонала", "Научим смену работать в пик без отмен"),
  "kak-podklyuchit-restoran-k-yandex-ede": PODKL,
};

const BY_TAG: Record<string, PostService> = {
  "финансы": ANALITIKA,
  "экономика": ANALITIKA,
  "аналитика": ANALITIKA,
  "качество": REYTING,
  "рейтинг": REYTING,
  "штрафы": SHTRAFY,
  "удержание": SHTRAFY,
  "документы": KONSULT,
  "акции": S("nastroyka-aktsiy", "Настройка акций", "Подберём акции под вашу экономику"),
  "инструменты": DRR,
  "продвижение": DRR,
  "раскрутка": DRR,
  "запуск": PODKL,
  "доставка": S("zony-i-grafik-dostavki", "Зоны и график доставки", "Радиус, стоимость по зонам, часы работы"),
  "заказы": S("rabota-s-otmenami", "Работа с отменами", "Разбор причин и процессы на кухне"),
  "сети": S("zapusk-seti-restoranov", "Работа с сетями", "Единые стандарты для всех точек"),
  "обучение": S("obuchenie-personala", "Обучение персонала", "Курс для команды по работе с агрегатором"),
  "настройки": VENDOR,
  "кабинет": VENDOR,
  "меню": S("sostavlenie-menyu", "Создание меню", "Разделы, описания, вес, модификаторы и цены"),
  "контент": S("moderatsiya-blyud", "Модерация блюд", "Подготовим карточки и разберём отклонённые"),
  "выдача": AUDIT,
  "ошибки": AUDIT,
};

export const serviceForPost = (slug: string, tag: string): PostService => BY_SLUG[slug] || BY_TAG[tag] || KONSULT;
