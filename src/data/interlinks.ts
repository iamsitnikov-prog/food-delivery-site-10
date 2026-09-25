export type Interlink = { phrase: string; slug: string; to?: string };

const post = (phrase: string, slug: string): Interlink => ({ phrase, slug });

const page = (phrase: string, to: string, slug: string): Interlink => ({ phrase, slug, to });

export const INTERLINKS: Interlink[] = [
  post("рейтинг отмен", "kak-snizit-otmeny-zakazov"),
  post("режим высокой загрузки", "zony-dostavki-i-grafik-raboty"),
  post("аукцион второй цены", "prodvizhenie-restorana-na-yandex-ede"),
  post("индекс видимости", "kak-popast-v-top-vydachi"),
  post("медианное место", "kak-popast-v-top-vydachi"),
  post("коды классификации", "platformennaya-ekonomika-289-fz"),
  post("стартовых бонусов", "bystryy-start-4-shaga"),
  post("апелляцию", "shtrafy-i-uderzhaniya-yandex-eda"),
  post("стоп-листу", "kak-snizit-otmeny-zakazov"),
  post("самовывоз", "samovyvoz-v-restorane"),
  post("пакете акций", "kakie-aktsii-zapuskat-na-agregatore"),
  post("ДРР", "kak-snizit-drr-na-agregatore"),
  post("возвращаемость", "kak-vernut-gostya-v-dostavke"),
  post("упущенные заказы", "analitika-restorana-na-agregatore"),
  post("скрытию заведения", "restoran-skryt-na-servise-chto-delat"),
  post("обучение", "obuchenie-komandy-rabote-s-dostavkoy"),
  post("подписк", "komissiya-i-vyplaty-na-yandex-ede"),

  page("ABC-анализ", "/slovar#abc-analiz", "glossary-abc"),
  page("фудкост", "/slovar#fudkost", "glossary-fudkost"),
  page("ROMI", "/slovar#romi", "glossary-romi"),
  page("индекс качества", "/slovar#indeks-kachestva", "glossary-indeks"),
  page("маржинальност", "/slovar#marzha", "glossary-marzha"),
  page("средний чек", "/slovar#srednij-chek", "glossary-chek"),
  page("точка безубыточности", "/slovar#tochka-bezubytochnosti", "glossary-bezubytochnost"),
  page("LTV", "/slovar#lifetime-value", "glossary-ltv"),
  page("агентск", "/slovar#agentskaya-shema", "glossary-agent"),
  page("конверсия карточки", "/slovar#konversiya-kartochki", "glossary-konversiya"),
  page("допродаж", "/slovar#doprodazhi", "glossary-doprodazhi"),
  page("комбо", "/slovar#kombo", "glossary-kombo"),

  page("стоп-лист", "/slovar#stop-list", "glossary-stoplist"),
  page("время приготовления", "/slovar#vremya-prigotovleniya", "glossary-vremya"),
  page("упаковк", "/slovar#upakovka", "glossary-upakovka"),
  page("зоны доставки", "/slovar#zona-dostavki", "glossary-zona"),
  page("оферт", "/slovar#oferta", "glossary-oferta"),
  page("часы пик", "/slovar#chasy-pik", "glossary-pik"),
  page("удержани", "/slovar#uderzhaniya", "glossary-uderzhaniya"),
  page("кабинет партнёра", "/slovar#kabinet-partnera", "glossary-kabinet"),
  page("повторные заказы", "/slovar#povtornye-zakazy", "glossary-povtornye"),

  page("Чиббис", "/sravnenie-agregatorov", "compare-chibbis"),
  page("Купер", "/sravnenie-agregatorov", "compare-kuper"),
  page("Деливери", "/sravnenie-agregatorov", "compare-delivery"),
  page("курьерами сервиса", "/sravnenie-agregatorov", "compare-kuriery"),
  page("собственной доставк", "/sravnenie-agregatorov", "compare-svoya"),
  page("свои курьеры", "/sravnenie-agregatorov", "compare-svoi"),
  page("выбрать агрегатор", "/sravnenie-agregatorov", "compare-choice"),
  page("нескольких агрегатор", "/sravnenie-agregatorov", "compare-multi"),
];