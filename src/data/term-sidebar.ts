import type { GlossaryGroup, GlossaryTerm } from "@/data/glossary";

/** Какой мини-расчёт показать рядом с термином. */
export type MiniCalcKind = "drr" | "marzha" | "komissiya" | "okupaemost" | "nds";

export type MiniCalcMeta = {
  kind: MiniCalcKind;
  title: string;
  /** Полный калькулятор, куда ведёт ссылка снизу. */
  to: string;
  linkLabel: string;
};

const MINI: Record<MiniCalcKind, MiniCalcMeta> = {
  drr: {
    kind: "drr",
    title: "посчитать ДРР",
    to: "/kalkulyatory/drr",
    linkLabel: "открыть полный калькулятор ДРР",
  },
  marzha: {
    kind: "marzha",
    title: "маржа заказа",
    to: "/kalkulyatory/rentabelnost-zakaza",
    linkLabel: "открыть калькулятор рентабельности",
  },
  komissiya: {
    kind: "komissiya",
    title: "сколько придёт на счёт",
    to: "/kalkulyatory/rentabelnost-zakaza",
    linkLabel: "открыть калькулятор рентабельности",
  },
  okupaemost: {
    kind: "okupaemost",
    title: "окупаемость вложений",
    to: "/kalkulyatory/okupaemost",
    linkLabel: "открыть калькулятор окупаемости",
  },
  nds: {
    kind: "nds",
    title: "порог по НДС",
    to: "/kalkulyatory/nds",
    linkLabel: "открыть калькулятор НДС",
  },
};

/** Термин → мини-калькулятор. Точечно, чтобы расчёт всегда был по теме. */
const BY_SLUG: Record<string, MiniCalcKind> = {
  drr: "drr",
  roas: "drr",
  romi: "drr",
  roi: "drr",
  cpo: "drr",
  cpa: "drr",
  cpc: "drr",
  cpm: "drr",
  "stavka-na-aukcione": "drr",
  "promo-aktsii": "drr",
  "akciya-za-schet-partnyora": "marzha",
  "kontekstnaya-reklama": "drr",
  cac: "drr",

  "marzha-zakaza": "marzha",
  marzha: "marzha",
  "valovaya-marzha": "marzha",
  "valovaya-pribyl": "marzha",
  rentabelnost: "marzha",
  natsenka: "marzha",
  sebestoimost: "marzha",
  fudkost: "marzha",
  pakkost: "marzha",
  "prajm-kost": "marzha",
  "yunit-ekonomika": "marzha",
  "srednij-chek": "marzha",
  "chistaya-pribyl": "marzha",
  "operacionnaya-pribyl": "marzha",
  ebitda: "marzha",
  "menyu-inzhiniring": "marzha",
  kombo: "marzha",
  doprodazhi: "marzha",

  komissiya: "komissiya",
  "vyruchka-k-vyplate": "komissiya",
  uderzhaniya: "komissiya",
  ekvajring: "komissiya",
  "dostavka-platformy": "komissiya",
  "svoya-dostavka": "komissiya",
  "gibridnaya-model": "komissiya",
  "stoimost-dostavki": "komissiya",
  "kurery-servisa": "komissiya",
  "svoi-kurery": "komissiya",
  gmv: "komissiya",
  "agentskaya-shema": "komissiya",
  "otchet-agenta": "komissiya",
  "platformennaya-ekonomika": "komissiya",

  "srok-okupaemosti": "okupaemost",
  "tochka-bezubytochnosti": "okupaemost",
  capex: "okupaemost",
  opex: "okupaemost",
  "postoyannye-rashody": "okupaemost",
  "peremennye-rashody": "okupaemost",
  ltv: "okupaemost",
  "lifetime-value": "okupaemost",
  "ltv-cac": "okupaemost",
  arpu: "okupaemost",
  retention: "okupaemost",
  churn: "okupaemost",
  "povtornye-zakazy": "okupaemost",
  "chastota-zakazov": "okupaemost",
  kogorta: "okupaemost",

  "porog-nds": "nds",
  "usn-dohody": "nds",
  vyruchka: "nds",
};

export const getMiniCalc = (term: GlossaryTerm): MiniCalcMeta | null => {
  const kind = BY_SLUG[term.slug];
  return kind ? MINI[kind] : null;
};

/** Текст призыва под тему термина — он попадает в карточку справа. */
const CTA_BY_GROUP: Record<GlossaryGroup, { title: string; text: string }> = {
  "Деньги и метрики": {
    title: "посчитаем вашу экономику",
    text: "Разберём отчёты за месяц и покажем, сколько реально остаётся с заказа после всех удержаний.",
  },
  "Реклама и выдача": {
    title: "разберём ваше продвижение",
    text: "Посмотрим ставки, акции и позицию в выдаче — где вы переплачиваете, а где недобираете заказы.",
  },
  Операционка: {
    title: "проверим вашу операционку",
    text: "Меню, зоны, время сборки и стоп-листы: найдём, что тормозит заказы и роняет выдачу.",
  },
  "Качество и рейтинг": {
    title: "поднимем рейтинг",
    text: "Найдём причины опозданий, отмен и низких оценок — и уберём то, что бьёт по рейтингу.",
  },
  "Документы и право": {
    title: "сверим документы и деньги",
    text: "Проверим акты, удержания и штрафы: что можно оспорить и вернуть на счёт.",
  },
  "Свой канал и CRM": {
    title: "построим свой канал",
    text: "Поможем увести повторные заказы из агрегатора в свою доставку без потери потока.",
  },
};

export const getCta = (term: GlossaryTerm) => CTA_BY_GROUP[term.group];

/** Кто комментирует термин: экономика и документы — Юрий, остальное — Лилия. */
const EXPERT_BY_GROUP: Record<GlossaryGroup, 0 | 1> = {
  "Деньги и метрики": 0,
  "Документы и право": 0,
  "Реклама и выдача": 1,
  Операционка: 1,
  "Качество и рейтинг": 1,
  "Свой канал и CRM": 0,
};

export const getExpertIndex = (term: GlossaryTerm) => EXPERT_BY_GROUP[term.group];

/**
 * Комментарий эксперта. Точечные тексты для частых терминов,
 * для остальных — реплика по теме группы.
 */
const NOTE_BY_SLUG: Record<string, string> = {
  drr: "ДРР выше 20% почти всегда значит, что ставка задрана, а не что реклама плохая. Сначала снижаем ставку на треть и смотрим неделю: обычно заказы почти не падают, а расход заметно уменьшается.",
  komissiya:
    "Комиссию невозможно снизить переговорами, но можно изменить модель доставки. Переход на своих курьеров экономит около 15% оборота — если есть кому возить в час пик.",
  rejting:
    "Рейтинг тянут вниз не разовые провалы, а систематические опоздания в пиковые часы. Уберите два самых долгих блюда из доставочного меню — и оценка выправится за пару недель.",
  "stavka-na-aukcione":
    "Ставку подбирают не один раз, а раз в неделю: аукцион живой, конкуренты меняют цены. Ставьте минимальную, при которой держитесь в первой десятке, и не выше.",
  "marzha-zakaza":
    "Маржа ниже 15% — это канал, который живёт до первого повышения комиссии. Сначала поднимаем цены в доставочном меню на 15–20%, и только потом думаем про рекламу.",
  fudkost:
    "Фудкост в доставке всегда выше, чем в зале: упаковка, потери при перевозке, компенсации. Закладывайте плюс 5 процентных пунктов к залу — иначе цифры разойдутся с фактом.",
  "porog-nds":
    "Порог по НДС подкрадывается незаметно: агрегатор даёт рост оборота, а не прибыли. Считайте выручку нарастающим итогом с января, а не по месяцам.",
  "akciya-za-schet-partnyora":
    "Акция за свой счёт оправдана, только если поднимает средний чек или частоту. Скидка на весь ассортимент — самый быстрый способ уйти в минус при растущих заказах.",
  "stop-list":
    "Стоп-лист — тихий убийца выдачи. Каждая позиция в стопе снижает показы карточки, а на выходных это сразу минус заказы.",
  otzyvy:
    "Отвечайте на негатив в тот же день и по делу. Гость редко меняет оценку, но новый читатель видит, что заведение работает с ошибками.",
};

const NOTE_BY_GROUP: Record<GlossaryGroup, string> = {
  "Деньги и метрики":
    "Смотреть на оборот в кабинете — самая частая ошибка. Считайте, сколько дошло до расчётного счёта: разница обычно около половины.",
  "Реклама и выдача":
    "Продвижение не спасает слабую карточку. Сначала фото и описания, потом ставки — иначе вы платите за показы, которые не конвертируются.",
  Операционка:
    "Большинство проблем в доставке решается на кухне, а не в кабинете. Сократите время сборки на пять минут — вырастет и рейтинг, и выдача.",
  "Качество и рейтинг":
    "Рейтинг — это накопленная привычка работать стабильно. Один хороший месяц его не поднимет, зато одна плохая неделя уронит надолго.",
  "Документы и право":
    "Акты нужно сверять каждый месяц, а не раз в год. Спорные удержания принимают к рассмотрению, пока не прошёл срок по оферте.",
  "Свой канал и CRM":
    "Агрегатор — это аренда клиентов, а не ваша база. Забирайте повторные заказы в свой канал: там маржа выше вдвое.",
};

export const getExpertNote = (term: GlossaryTerm) =>
  NOTE_BY_SLUG[term.slug] ?? NOTE_BY_GROUP[term.group];
