// Услуги с онлайн оплатой. Цены для показа на сайте.
// Сумму платежа считает сервер (api/pay.php в репозитории agregatory-deploy):
// менять цену нужно в обоих местах.

// Реквизиты исполнителя (оплата принимается на ИП Юрия Ситникова).
export const SELLER_INN = "632509481120";
export const SELLER_OGRNIP = "325632700100793";

export type PayProduct = {
  code: "konsultaciya" | "audit" | "kurs-komandy" | "po-schetu";
  title: string;
  short: string;
  price: number; // 0 — сумму вводит клиент
  note: string;
  icon: string;
};

export const PAY_PRODUCTS: PayProduct[] = [
  {
    code: "konsultaciya",
    title: "Консультация по доставке на агрегаторах, 60 минут",
    short: "консультация",
    price: 20000,
    note: "60 минут онлайн, запись и резюме встречи",
    icon: "PhoneCall",
  },
  {
    code: "audit",
    title: "Аудит ресторана на агрегаторе",
    short: "аудит ресторана",
    price: 30000,
    note: "разбор кабинета и витрины, отчёт с рекомендациями",
    icon: "ClipboardCheck",
  },
  {
    code: "kurs-komandy",
    title: "Курс «Работа с агрегатором» для команды до 6 человек",
    short: "курс для команды",
    price: 80000,
    note: "5 недель, 5 уроков по 45 минут, до 6 человек",
    icon: "GraduationCap",
  },
  {
    code: "po-schetu",
    title: "Оплата по счёту или договору",
    short: "по счёту",
    price: 0,
    note: "для тарифов сопровождения и услуг по КП",
    icon: "FileText",
  },
];

export const formatRub = (n: number) => `${n.toLocaleString("ru-RU").replace(/ /g, " ")} ₽`;
