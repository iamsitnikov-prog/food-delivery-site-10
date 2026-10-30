// Какие разделы партнёров показывать рядом со статьёй, термином словаря или услугой.
// Блок «подрядчики по теме» показывает только тех партнёров, кто уже есть в этих разделах:
// новые партнёры появляются в блоках сами.

const BY_POST_SLUG: Record<string, string[]> = {
  "foto-blyud-dlya-agregatora": ["foto", "dizain"],
  "upakovka-dlya-dostavki-edy": ["upakovka", "posuda"],
  "yandex-eda-integratsiya-iiko": ["kassy", "avtomatizaciya"],
  "sayt-dlya-dostavki-edy": ["dostavka", "avtomatizaciya"],
  "obuchenie-komandy-rabote-s-dostavkoy": ["obuchenie", "personal"],
  "yandex-dostavka-podklyuchenie-tarify": ["kurery", "dostavka"],
  "zony-dostavki-i-grafik-raboty": ["kurery", "dostavka"],
  "kak-rabotat-s-otzyvami-v-dostavke": ["geo", "upakovka"],
  "reklama-restorana": ["reklama", "marketing", "geo"],
  "marketing-dostavki-edy": ["marketing", "smm", "reklama"],
  "kak-vernut-gostya-v-dostavke": ["marketing", "dostavka"],
  "programma-loyalnosti-yandex-eda": ["marketing", "dostavka"],
  "dark-kitchen-kak-otkryt": ["dostavka", "kurery", "upakovka"],
  "kak-otkryt-dostavku-edy": ["dostavka", "kurery", "upakovka"],
  // Статьи по Вордстату (31.10.2026)
  "sebestoimost-blyuda": ["analitika", "avtomatizaciya"],
  "kak-uvelichit-sredniy-chek": ["marketing", "analitika"],
  "natsenka-v-restorane": ["analitika"],
  "aktsii-dlya-kafe": ["marketing", "smm", "reklama"],
  "biznes-plan-dostavki-edy": ["analitika", "dostavka"],
  "menedzher-po-agregatoram": ["obuchenie", "personal", "analitika"],
  "kak-otkryt-kofeynyu-s-nulya": ["dostavka", "kassy", "posuda"],
  "agregatory-dostavki-edy": ["dostavka", "kurery"],
  "otkryt-shaurmu-s-nulya": ["upakovka", "kassy", "dostavka"],
  "otkryt-sushi-dostavku": ["upakovka", "foto", "kurery"],
  "skolko-stoit-otkryt-pitstseriyu": ["upakovka", "kassy", "dostavka"],
  "market-delivery-dlya-restorana": ["avtomatizaciya", "analitika"],
  "upakovka-dlya-rollov": ["upakovka", "posuda"],
  "svoya-dostavka-restorana-kurery": ["kurery", "dostavka"],
  "fotograf-edy-dlya-restorana": ["foto", "dizain"],
  "kak-otvetit-na-otzyv-v-yandex-kartah": ["geo", "marketing"],
  "kak-pomenyat-adres-restorana-v-yandex-ede": ["geo", "avtomatizaciya"],
  "programma-dlya-dostavki-edy": ["avtomatizaciya", "dostavka", "kassy"],
  "kak-podnyat-reyting-v-yandex-kartah": ["geo", "marketing"],
};

const BY_POST_TAG: Record<string, string[]> = {
  "контент": ["foto", "dizain"],
  "меню": ["foto", "dizain"],
  "качество": ["upakovka", "geo"],
  "рейтинг": ["geo", "upakovka"],
  "финансы": ["analitika"],
  "экономика": ["analitika"],
  "аналитика": ["analitika"],
  "продвижение": ["marketing", "reklama", "smm"],
  "раскрутка": ["marketing", "reklama", "smm"],
  "инструменты": ["marketing", "analitika"],
  "акции": ["marketing"],
  "удержание": ["marketing", "dostavka"],
  "доставка": ["kurery", "dostavka"],
  "запуск": ["dostavka", "avtomatizaciya", "kassy"],
  "настройки": ["avtomatizaciya", "kassy"],
  "кабинет": ["avtomatizaciya", "kassy"],
  "обучение": ["obuchenie", "personal"],
  "документы": ["yuristy"],
  "штрафы": ["yuristy"],
  "сети": ["avtomatizaciya", "analitika"],
  "заказы": ["avtomatizaciya"],
};

const BY_SERVICE: Record<string, string[]> = {
  "fotokontent-dlya-menyu": ["foto", "dizain"],
  "sostavlenie-menyu": ["foto", "dizain"],
  "moderatsiya-blyud": ["foto"],
  "povyshenie-reytinga": ["geo", "upakovka"],
  "analitika-i-otchetnost": ["analitika"],
  "audit-kabineta": ["analitika"],
  "zony-i-grafik-dostavki": ["kurery", "dostavka"],
  "podklyuchenie-k-yandex-ede": ["dostavka", "avtomatizaciya"],
  "nastroyka-vendora": ["avtomatizaciya", "kassy"],
  "obuchenie-personala": ["obuchenie", "personal"],
  "snizhenie-drr": ["marketing", "reklama"],
  "nastroyka-aktsiy": ["marketing"],
  "shtrafy-i-uderzhaniya": ["yuristy"],
  "zapusk-seti-restoranov": ["avtomatizaciya", "analitika"],
  "podklyuchenie-samovyvoza": ["avtomatizaciya", "dostavka"],
  "rabota-s-otmenami": ["avtomatizaciya"],
  "konsultatsiya-restoratora": ["dostavka", "analitika"],
};

const BY_TERM_GROUP: Record<string, string[]> = {
  "Деньги и метрики": ["analitika"],
  "Реклама и выдача": ["marketing", "reklama"],
  "Операционка": ["kurery", "avtomatizaciya", "upakovka"],
  "Качество и рейтинг": ["upakovka", "geo"],
  "Документы и право": ["yuristy"],
  "Свой канал и CRM": ["dostavka", "marketing", "smm"],
};

export const partnerSectionsForPost = (slug: string, tag: string) => BY_POST_SLUG[slug] || BY_POST_TAG[tag] || [];
export const partnerSectionsForService = (slug: string) => BY_SERVICE[slug] || [];
export const partnerSectionsForTerm = (group: string) => BY_TERM_GROUP[group] || [];
