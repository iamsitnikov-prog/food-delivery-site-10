import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import useSeo from "@/hooks/use-seo";
import {
  dateWords,
  decryptTemplate,
  genderOf,
  genitive,
  money,
  firstPeriod,
  innError,
  ogrnError,
  kppError,
  parseCard,
  type CardData,
  PERIOD_UNIT,
  type Period,
  numberWords,
  plural,
  renderDocx,
  shortName,
  titleCase,
  type Gender,
} from "@/lib/docs-gen";
import { EXECUTORS, getExecutor } from "@/data/executors";
import { renderForPrint } from "@/lib/docs-pdf";

// Закрытая страница для бухгалтера: договор с рестораном (ИП или ООО) по шаблонам Юрия.
// Договор собирается здесь, в браузере; сервер (api/docs.php) проверяет пароль,
// ищет реквизиты по ИНН, ведёт журнал и присылает копию Юрию в Telegram.

const API = "/api/docs.php";
const KEY_STORE = "agd-key";

type Kind = "ooo" | "ip";
type Point = { title: string; address: string; city: string };
type Journal = { id: number; num: string; version?: number; client: string; executor?: string; author?: string; inn: string; total: number; points: number; created: string; has_form?: boolean }[];

const thisMonth = () => new Date().toISOString().slice(0, 7);
const digits = (s: string) => s.replace(/\D/g, "");

const readKey = () => {
  try {
    return sessionStorage.getItem(KEY_STORE) || "";
  } catch {
    return "";
  }
};
const writeKey = (v: string) => {
  try {
    if (v) sessionStorage.setItem(KEY_STORE, v);
    else sessionStorage.removeItem(KEY_STORE);
  } catch {
    /* приватный режим: просто не запоминаем */
  }
};

const api = async (key: string, q: string, init?: RequestInit) => {
  const res = await fetch(`${API}?${q}`, {
    ...init,
    headers: { ...(init?.headers || {}), "X-Docs-Key": encodeURIComponent(key) },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Сервер не ответил");
  return data;
};

// Текст для рабочего чата с клиентом после того, как договор готов
const chatText = (points: number) =>
  `Коллеги, добрый день! Направляем договор на просмотр. В нём условия сотрудничества, описание услуг${points > 1 ? " по каждой точке" : ""} и образцы закрывающих документов (счёт, акт, УПД). После вашей проверки отправим договор вместе со счётом через ЭДО. Ждём от вас подтверждения или правок.`;

// Памятка: что запросить у ресторана (кнопка «скопировать»)
const ASK_TEXT = `Добрый день! Чтобы подготовить договор, пришлите, пожалуйста:
1. Карточку организации: полное название, ИНН, КПП, ОГРН (у ИП ОГРНИП), юридический адрес.
2. Кто подписывает договор: ФИО и должность, на основании чего действует (Устав или доверенность с номером и датой).
3. Банковские реквизиты: БИК, расчётный счёт, название банка, корреспондентский счёт.
4. Телефон и электронную почту для документов.
5. Оператора ЭДО и ваш ID в ЭДО.
6. Точки на Яндекс Еде: название на сервисе, адрес и город каждой.
Проще всего прислать карточку организации файлом или текстом, остальное допишите в сообщении.`;

const LS = {
  get: (k: string) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k: string, v: string | null) => {
    try {
      if (v === null) localStorage.removeItem(k);
      else localStorage.setItem(k, v);
    } catch {
      /* приватный режим */
    }
  },
};
const DRAFT_KEY = "agd-draft";

// Кабинеты: Алиса (и Юрий) видят всех исполнителей и весь журнал, Лиля свои договоры
type DocsUser = { id: string; name: string; all: boolean; tpl: string };
const ALISA: DocsUser = { id: "alisa", name: "Алиса", all: true, tpl: "" };

const EDO = ["СБИС", "Контур.Диадок", "Такском", "Калуга Астрал", "Другой оператор", "Нет ЭДО"];

const field =
  "h-12 rounded-xl border-cream/20 bg-cream/5 px-4 text-[1em] text-cream placeholder:text-cream-muted/60 focus-visible:ring-1 focus-visible:ring-brand focus-visible:ring-offset-0";

// Что не заполнено: подписи полей (по ним подсвечиваем) и сколько осталось в каждом блоке
type Missing = { labels: Set<string>; perCard: Record<number, number>; show: boolean; parsed: Set<string> };
const MissCtx = createContext<Missing>({ labels: new Set(), perCard: {}, show: false, parsed: new Set() });

const Label = ({ t, hint, children, wide, err }: { t: string; hint?: string; children: React.ReactNode; wide?: boolean; err?: string }) => {
  const miss = useContext(MissCtx);
  const bad = (miss.show && miss.labels.has(t)) || !!err;
  const found = !bad && miss.parsed.has(t);
  return (
    <label
      className={`block ${wide ? "md:col-span-2" : ""} ${
        bad ? "rounded-xl outline outline-2 outline-offset-4 outline-red-400/70" : found ? "rounded-xl outline outline-2 outline-offset-4 outline-green-500/70" : ""
      }`}
    >
      <span className={`mb-1.5 block text-[max(12px,0.86em)] font-medium ${bad ? "text-red-600" : found ? "text-green-700" : "text-cream-muted"}`}>
        {t}
        {bad && !err && <span className="ml-2 font-normal">· заполните</span>}
        {found && <span className="ml-2 font-normal">· распознано, проверьте</span>}
      </span>
      {children}
      {err && <span className="mt-1 block text-[max(12px,0.78em)] font-medium text-red-600">{err}</span>}
      {hint && <span className="mt-1 block text-[max(12px,0.78em)] text-cream-muted/70">{hint}</span>}
    </label>
  );
};

const Card = ({ n, t, children }: { n: number; t: string; children: React.ReactNode }) => {
  const left = useContext(MissCtx).perCard[n] || 0;
  return (
    <section id={`card-${n}`} className="docs-card scroll-mt-6 rounded-[24px] bg-surface p-5 text-cream md:p-8">
      <h2 className="flex flex-wrap items-center gap-3 font-display text-[1.3em] font-semibold tracking-[-0.02em]">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-[0.8em] ${left ? "bg-brand text-foreground" : "bg-green-500 text-white"}`}>
          {left ? n : <Icon name="Check" size={16} />}
        </span>
        {t}
        <span className={`ml-auto font-sans text-[max(12px,0.6em)] font-normal ${left ? "text-cream-muted" : "text-green-700"}`}>
          {left ? `осталось ${left}` : "готово"}
        </span>
      </h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
};

// Поле адреса с подсказками DaData (когда ключ задан на сервере)
type AddrItem = { value: string; full: string; city: string; city_part: string };
const AddressInput = ({
  value, onChange, onPick, placeholder, apiKey, enabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onPick: (a: AddrItem) => void;
  placeholder?: string;
  apiKey: string;
  enabled: boolean;
}) => {
  const [items, setItems] = useState<AddrItem[]>([]);
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState(false);
  useEffect(() => {
    if (!enabled || !typed || value.trim().length < 3) return setItems([]);
    const t = setTimeout(() => {
      api(apiKey, `a=addr&q=${encodeURIComponent(value.trim())}`)
        .then((d) => setItems(d.items || []))
        .catch(() => setItems([]));
    }, 300);
    return () => clearTimeout(t);
  }, [value, enabled, typed, apiKey]);
  return (
    <div className="relative">
      <Input
        className={field}
        placeholder={placeholder}
        value={value}
        autoComplete="off"
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onChange={(e) => {
          setTyped(true);
          setOpen(true);
          onChange(e.target.value);
        }}
      />
      {open && items.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-72 overflow-auto rounded-xl border border-cream/20 bg-surface py-1 shadow-xl">
          {items.map((a) => (
            <li key={a.full}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onPick(a);
                  setTyped(false);
                  setItems([]);
                  setOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-[max(13px,0.9em)] text-cream hover:bg-cream/10"
              >
                {a.full}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Контрольный ключ счёта по правилам Банка России (весовые коэффициенты 7, 1, 3)
const accKey = (s: string) => {
  const w = [7, 1, 3];
  let t = 0;
  for (let i = 0; i < 23; i++) t += (Number(s[i]) * w[i % 3]) % 10;
  return t % 10 === 0;
};
/** Ошибка в счёте или "" — длина и сверка с БИК */
const accError = (acc: string, bik: string, corr: boolean) => {
  const a = acc.replace(/\D/g, "");
  if (!a) return "";
  if (a.length !== 20) return `В счёте 20 цифр, сейчас ${a.length}`;
  const b = bik.replace(/\D/g, "");
  if (b.length !== 9) return "";
  const ok = corr ? accKey("0" + b.slice(4, 6) + a) : accKey(b.slice(-3) + a);
  return ok ? "" : "Счёт не сходится с БИК: проверьте цифры счёта и БИК";
};

// Пример для ознакомления: вымышленный ресторан, счёт сходится с БИК
const SAMPLE_NUM = "ОБРАЗЕЦ";
const today = () => new Date().toISOString().slice(0, 10);
const SAMPLE = {
  kind: "ooo" as const,
  num: SAMPLE_NUM,
  inn: "7801234564",
  name: "Вкусная точка",
  ogrn: "1217800012341",
  kpp: "780101001",
  address: "191186, г. Санкт-Петербург, Невский пр-кт, д. 28, помещ. 1-Н",
  person: "Петров Пётр Петрович",
  position: "Генеральный директор" as const,
  basis: "Устав" as const,
  proxy: "",
  bik: "044030653",
  bank: "Северо-Западный банк ПАО Сбербанк",
  ks: "30101810500000000653",
  rs: "40702810550000123455",
  phone: "+7 900 123-45-67",
  email: "buh@vkusnaya-tochka.ru",
  edo: "Контур.Диадок",
  edoId: "2BM-7801234564-780101001-000000000000000",
  contact: "Иванова Мария, управляющая",
  points: [
    { title: "Вкусная точка на Невском", address: "Невский пр-кт, д. 28", city: "Санкт-Петербург" },
    { title: "Вкусная точка на Садовой", address: "Садовая ул., д. 12", city: "Санкт-Петербург" },
  ],
  price: "25000",
};

// Пустая форма: для кнопки «сбросить»
const EMPTY = {
  kind: "ooo" as const, num: "", date: "", inn: "", name: "", ogrn: "", kpp: "", address: "", person: "",
  position: "Генеральный директор" as const, basis: "Устав" as const, proxy: "", personGen: "",
  bik: "", bank: "", ks: "", rs: "", phone: "", email: "", edo: "СБИС", edoId: "", contact: "",
  points: [{ title: "", address: "", city: "" }], price: "25000", period: "month" as const,
};

// Префикс номера договора: три первые буквы названия первой точки (Молодость → МОЛ)
const numPrefix = (title: string) => title.replace(/[^A-Za-zА-Яа-яЁё]/g, "").slice(0, 3).toUpperCase();

const Docs = () => {
  const { pathname } = useLocation();
  useSeo({
    title: "Документы | agregatory.pro",
    description: "Служебная страница agregatory.pro для подготовки договоров с ресторанами. Доступ только у сотрудников по паролю.",
    path: pathname,
    noindex: true,
  });

  const [key, setKey] = useState("");
  const [pw, setPw] = useState("");
  const [authErr, setAuthErr] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [dadata, setDadata] = useState(false);
  const [user, setUser] = useState<DocsUser>(ALISA);

  useEffect(() => {
    const k = readKey();
    if (!k) return;
    api(k, "a=login", { method: "POST" })
      .then((d) => {
        setDadata(!!d.dadata);
        if (d.user) setUser(d.user);
        setKey(k);
      })
      .catch(() => writeKey(""));
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthBusy(true);
    setAuthErr("");
    try {
      const d = await api(pw.trim(), "a=login", { method: "POST" });
      setDadata(!!d.dadata);
      if (d.user) setUser(d.user);
      writeKey(pw.trim());
      setKey(pw.trim());
    } catch (err) {
      setAuthErr((err as Error).message);
    } finally {
      setAuthBusy(false);
    }
  };

  // --- Данные формы ---------------------------------------------------------
  const [kind, setKind] = useState<Kind>("ooo");
  const [executor, setExecutor] = useState(EXECUTORS[0].id as string);
  const [num, setNum] = useState("");
  const [numAuto, setNumAuto] = useState(true); // номер ставится сам, пока бухгалтер не впишет свой
  const [date, setDate] = useState("");
  const [month, setMonth] = useState(thisMonth());
  const [period, setPeriod] = useState<Period>("month");
  const [inn, setInn] = useState("");
  const [name, setName] = useState("");
  const [ogrn, setOgrn] = useState("");
  const [kpp, setKpp] = useState("");
  const [address, setAddress] = useState("");
  const [person, setPerson] = useState(""); // ФИО руководителя ООО или ИП
  const [gender, setGender] = useState<Gender>("male");
  const [position, setPosition] = useState<"Генеральный директор" | "Директор">("Генеральный директор");
  const [basis, setBasis] = useState<"Устав" | "Доверенность">("Устав");
  const [proxy, setProxy] = useState("");
  const [personGen, setPersonGen] = useState("");
  const [bank, setBank] = useState("");
  const [rs, setRs] = useState("");
  const [bik, setBik] = useState("");
  const [ks, setKs] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [edo, setEdo] = useState(EDO[0]);
  const [edoId, setEdoId] = useState("");
  const [contact, setContact] = useState("");
  const [points, setPoints] = useState<Point[]>([{ title: "", address: "", city: "" }]);
  const [price, setPrice] = useState("25000");

  const [bankMsg, setBankMsg] = useState("");
  const [lookupBusy, setLookupBusy] = useState(false);
  const [lookupMsg, setLookupMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [result, setResult] = useState<{ blob: Blob; file: string } | null>(null);
  const [journal, setJournal] = useState<Journal>([]);
  const [dupe, setDupe] = useState("");
  const [histBusy, setHistBusy] = useState<number | null>(null);
  const myExecutors = user.all ? EXECUTORS : EXECUTORS.filter((x) => x.users?.includes(user.id));
  // Лиле по умолчанию её ИП; чужого исполнителя из черновика или журнала не оставляем
  useEffect(() => {
    if (!myExecutors.some((x) => x.id === executor)) setExecutor(myExecutors[0]?.id || EXECUTORS[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id, executor]);
  const exec = getExecutor(executor);

  const loadJournal = () => key && api(key, "a=journal").then((d) => setJournal(d.items || [])).catch(() => {});
  useEffect(() => {
    loadJournal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Пол и родительный падеж ФИО пересчитываются при вводе, бухгалтер может поправить вручную
  useEffect(() => {
    if (!person.trim()) {
      setPersonGen("");
      return;
    }
    const g = genderOf(person);
    setGender(g);
    let alive = true;
    genitive(person, g).then((v) => alive && setPersonGen(v));
    return () => {
      alive = false;
    };
  }, [person]);

  useEffect(() => {
    if (!num.trim() || !key) return setDupe("");
    const t = setTimeout(() => {
      api(key, `a=check&num=${encodeURIComponent(num.trim())}`)
        .then((d) =>
          setDupe(
            d.other
              ? "Такой номер уже занят другим договором. Укажите другой номер."
              : d.exists
                ? `Договор № ${d.item.num} уже есть (${d.item.client}, ${d.item.created}). Новый сохранится как версия ${d.versions + 1}, прошлые останутся в журнале.`
                : "",
          ),
        )
        .catch(() => {});
    }, 500);
    return () => clearTimeout(t);
  }, [num, key]);

  // Номер договора сам: МОЛ01, а если такой уже есть в журнале — МОЛ02 и дальше
  const prefix = numPrefix(points[0]?.title || "");
  useEffect(() => {
    if (!numAuto || !key) return;
    if (!prefix) return setNum("");
    const t = setTimeout(() => {
      api(key, `a=nextnum&prefix=${encodeURIComponent(prefix)}`)
        .then((d) => d.num && setNum(d.num))
        .catch(() => {});
    }, 400);
    return () => clearTimeout(t);
  }, [prefix, numAuto, key]);

  // БИК → банк и корр. счёт из справочника Банка России
  useEffect(() => {
    if (!key || bik.length !== 9) return setBankMsg(bik ? `В БИК 9 цифр, сейчас ${bik.length}` : "");
    let alive = true;
    api(key, `a=bank&bik=${bik}`)
      .then((d) => {
        if (!alive) return;
        if (d.name) setBank(d.name);
        if (d.ks) setKs(d.ks);
        setBankMsg(d.ks ? "" : "Банк найден, корр. счёта у него нет: впишите вручную, если есть");
      })
      .catch((e) => alive && setBankMsg((e as Error).message));
    return () => {
      alive = false;
    };
  }, [bik, key]);
  const rsErr = accError(rs, bik, false);
  const ksErr = accError(ks, bik, true);

  const priceNum = Number(digits(price)) || 0;
  const filledPoints = points.filter((p) => p.title.trim() || p.address.trim());
  const pointsN = Math.max(filledPoints.length, 1);
  const total = priceNum * pointsN;
  const fem = gender === "female";
  const posGen = position === "Генеральный директор" ? "генерального директора" : "директора";
  const basisText = basis === "Устав" ? "Устава" : `доверенности ${proxy.trim()}`.trim();
  const clientTitle = kind === "ooo" ? `ООО «${name.trim()}»` : `ИП ${person.trim()}`;

  const preview = useMemo(() => {
    if (kind === "ooo")
      return `Общество с ограниченной ответственностью «${name}» (ОГРН ${ogrn}, ИНН ${inn}, КПП ${kpp}), в лице ${posGen} ${personGen}, ${fem ? "действующей" : "действующего"} на основании ${basisText}, именуемое в дальнейшем «Заказчик»`;
    return `Индивидуальный предприниматель ${person} (ОГРНИП ${ogrn}, ИНН ${inn}), ${fem ? "действующая" : "действующий"} на основании записи в ЕГРИП, ${fem ? "именуемая" : "именуемый"} в дальнейшем «Заказчик»`;
  }, [kind, name, ogrn, inn, kpp, posGen, personGen, fem, basisText, person]);

  const lookup = async () => {
    setLookupBusy(true);
    setLookupMsg("");
    try {
      const { row, source } = await api(key, `a=lookup&inn=${digits(inn)}`);
      if (row.closed) setLookupMsg("Внимание: по данным налоговой деятельность прекращена.");
      setKind(row.kind);
      setOgrn(row.ogrn);
      setInn(row.inn);
      if (row.kind === "ooo") {
        const m = /[«"](.+)[»"]/.exec(row.short || row.full);
        setName(m ? titleCase(m[1]).replace(/^./, (c: string) => c.toUpperCase()) : titleCase(row.full));
        setKpp(row.kpp);
        setAddress(row.address);
        const head = /:\s*(.+)$/.exec(row.head || "");
        if (head) setPerson(titleCase(head[1]));
        if (/^ДИРЕКТОР/i.test(row.head || "")) setPosition("Директор");
        else setPosition("Генеральный директор");
      } else {
        setPerson(titleCase(row.full));
        if (row.address) setAddress(row.address);
      }
      if (!row.closed)
        setLookupMsg(
          source === "dadata"
            ? `Заполнено по данным ЕГРЮЛ/ЕГРИП (DaData), адрес тоже. Проверьте написание.${row.kind === "ip" ? " У ИП реестр показывает только город: допишите улицу и дом." : ""}`
            : "Заполнено из ЕГРЮЛ, адрес впишите вручную. Проверьте написание.",
        );
    } catch (err) {
      setLookupMsg((err as Error).message);
    } finally {
      setLookupBusy(false);
    }
  };

  const snapshot = () => ({
    kind, executor, num, date, month, period, inn, name, ogrn, kpp, address, person, gender, position, basis, proxy, personGen,
    bank, rs, bik, ks, phone, email, edo, edoId, contact, points, price,
  });
  type Snap = ReturnType<typeof snapshot>;
  const restore = (f: Partial<Snap>) => {
    const set = <T,>(v: T | undefined, fn: (x: T) => void) => v !== undefined && fn(v);
    if (f.num !== undefined) setNumAuto(false);
    set(f.kind, setKind); set(f.executor, setExecutor); set(f.num, setNum); set(f.date, setDate); set(f.month, setMonth); set(f.period, setPeriod);
    set(f.inn, setInn); set(f.name, setName); set(f.ogrn, setOgrn); set(f.kpp, setKpp); set(f.address, setAddress);
    set(f.person, setPerson); set(f.position, setPosition); set(f.basis, setBasis); set(f.proxy, setProxy);
    set(f.bank, setBank); set(f.rs, setRs); set(f.bik, setBik); set(f.ks, setKs); set(f.phone, setPhone); set(f.email, setEmail);
    set(f.edo, setEdo); set(f.edoId, setEdoId); set(f.contact, setContact); set(f.points, setPoints); set(f.price, setPrice);
    // Пол и падеж пересчитываются из ФИО; ставим сохранённые после пересчёта
    setTimeout(() => {
      set(f.gender, setGender);
      set(f.personGen, setPersonGen);
    }, 300);
    setResult(null);
    setErrors([]);
    setMsg("Данные загружены из журнала. Поправьте, что нужно, и сформируйте договор заново.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fillFrom = async (id: number) => {
    setHistBusy(id);
    try {
      const { form } = await api(key, `a=form&id=${id}`);
      restore(form);
    } catch (err) {
      setMsg(`Ошибка: ${(err as Error).message}`);
    } finally {
      setHistBusy(null);
    }
  };

  const fileFrom = async (id: number, num: string) => {
    const res = await fetch(`${API}?a=file&id=${id}`, { headers: { "X-Docs-Key": encodeURIComponent(key) }, cache: "no-store" });
    if (!res.ok) throw new Error("Файл не найден");
    return { blob: await res.blob(), file: `Договор ${num}`.replace(/[\\/:*?"<>|«»]+/g, " ") };
  };

  // Обязательные поля: card = номер блока, label = подпись поля (по ней подсвечиваем), msg = текст ошибки
  const ooo = kind === "ooo";
  const innErr = innError(inn, kind);
  const ogrnErr = ogrnError(ogrn, kind);
  const kppErr = kind === "ooo" ? kppError(kpp) : "";
  const priceLabel = `Стоимость за одну точку в месяц, ₽ (точек в договоре: ${pointsN})`;
  const checks: { card: number; label: string; msg: string; ok: boolean }[] = [
    { card: 1, label: "", msg: `У исполнителя ${exec.label} не заполнено: ${exec.missing.join(", ")}`, ok: !exec.missing.length },
    { card: 2, label: "ИНН", msg: innErr || (ooo ? "ИНН: 10 цифр" : "ИНН: 12 цифр"), ok: !!digits(inn) && !innErr },
    { card: 2, label: ooo ? "ОГРН" : "ОГРНИП", msg: ogrnErr || (ooo ? "ОГРН: 13 цифр" : "ОГРНИП: 15 цифр"), ok: !!digits(ogrn) && !ogrnErr },
    ...(ooo
      ? [
          { card: 2, label: "Название ООО (без кавычек)", msg: "Название ООО", ok: !!name.trim() },
          { card: 2, label: "КПП", msg: kppErr || "КПП: 9 знаков", ok: !!kpp.trim() && !kppErr },
        ]
      : []),
    ...(ooo ? [{ card: 2, label: "Юридический адрес", msg: "Юридический адрес", ok: !!address.trim() }] : []),
    {
      card: 3, label: ooo ? "ФИО руководителя полностью" : "ФИО полностью",
      msg: ooo ? "ФИО руководителя" : "ФИО предпринимателя", ok: person.trim().split(/\s+/).length >= 2,
    },
    ...(ooo && basis === "Доверенность"
      ? [{ card: 3, label: "Номер и дата доверенности", msg: "Номер и дата доверенности", ok: !!proxy.trim() }]
      : []),
    { card: 4, label: "БИК", msg: "БИК: 9 цифр", ok: /^\d{9}$/.test(digits(bik)) },
    { card: 4, label: "Расчётный счёт", msg: rsErr ? "Расчётный счёт не сходится с БИК" : "Расчётный счёт: 20 цифр", ok: /^\d{20}$/.test(digits(rs)) && !rsErr },
    { card: 4, label: "Банк", msg: "Банк", ok: !!bank.trim() },
    { card: 4, label: "Корреспондентский счёт", msg: ksErr ? "Корр. счёт не сходится с БИК" : "Корр. счёт: 20 цифр", ok: /^\d{20}$/.test(digits(ks)) && !ksErr },
    { card: 5, label: "Телефон", msg: "Телефон", ok: !!phone.trim() },
    {
      card: 5, label: "Электронная почта", msg: "Электронная почта (на неё идут юридически значимые сообщения, п. 15.1)",
      ok: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
    },
    {
      card: 6, label: "", msg: "Точки: название, адрес и город у каждой",
      ok: filledPoints.length > 0 && !filledPoints.some((p) => !p.title.trim() || !p.address.trim() || !p.city.trim()),
    },
    { card: 7, label: priceLabel, msg: "Стоимость за точку", ok: !!priceNum },
    { card: 7, label: "Номер договора", msg: dupe.startsWith("Такой номер уже занят") ? "Номер договора занят" : "Номер договора", ok: !!num.trim() && !dupe.startsWith("Такой номер уже занят") },
    { card: 7, label: "Дата договора", msg: "Дата договора (выберите в календаре)", ok: !!date },
  ];
  const left = checks.filter((c) => !c.ok);
  const doneShare = Math.round((100 * (checks.length - left.length)) / checks.length);
  const [showMiss, setShowMiss] = useState(false);
  const [parsed, setParsed] = useState<Set<string>>(new Set());
  const [cardText, setCardText] = useState("");
  const [fileBusy, setFileBusy] = useState("");
  const [dragOver, setDragOver] = useState(false);
  // Файл с реквизитами → текст → поля
  const readFile = async (f: File | undefined) => {
    if (!f) return;
    setParseMsg("");
    setFileBusy(`Читаю «${f.name}»…`);
    try {
      const { extractText } = await import("@/lib/docs-extract");
      const { text, how } = await extractText(f, setFileBusy);
      if (!text.trim()) throw new Error("В файле не нашлось текста. Попробуйте другой файл или скопируйте реквизиты вручную.");
      setCardText(text.trim());
      applyCard(text);
      setFileBusy("");
      setParseMsg((m) => `Файл «${f.name}» прочитан (${how}). ${m}`);
    } catch (e) {
      setFileBusy("");
      const m = e instanceof Error ? e.message : String(e || "неизвестная ошибка");
      setParseMsg(`Не получилось прочитать файл: ${m}`);
    }
  };
  const [parseMsg, setParseMsg] = useState("");
  const [helloOpen, setHelloOpen] = useState(() => LS.get("agd-hello") !== "0");
  const [askCopied, setAskCopied] = useState(false);
  const [journalAll, setJournalAll] = useState(false);
  const [authorPick, setAuthor] = useState(() => LS.get("agd-author") || "Алиса");
  const author = user.all ? authorPick : user.name;
  const draftKey = `${DRAFT_KEY}-${user.id}`;
  const [draftReady, setDraftReady] = useState(false);

  // Черновик: форма сохраняется в браузере и возвращается, если закрыть вкладку
  const draftJson = JSON.stringify(snapshot());
  useEffect(() => {
    if (!key || draftReady) return;
    setDraftReady(true);
    const raw = LS.get(draftKey);
    if (!raw) return;
    try {
      const d = JSON.parse(raw) as { at: number; form: Partial<Snap> };
      restore(d.form);
      const at = new Date(d.at);
      setTimeout(
        () =>
          setMsg(
            `Восстановлен черновик от ${at.toLocaleDateString("ru-RU")} ${at.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}. Начать заново: кнопка «очистить».`,
          ),
        400,
      );
    } catch {
      LS.set(draftKey, null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  useEffect(() => {
    if (!key || !draftReady) return;
    const t = setTimeout(() => LS.set(draftKey, JSON.stringify({ at: Date.now(), form: JSON.parse(draftJson) })), 600);
    return () => clearTimeout(t);
  }, [draftJson, key, draftReady]);

  // Карточка организации одним текстом → поля; распознанное подсвечиваем зелёным
  const applyCard = (src = cardText) => {
    const c: CardData = parseCard(src);
    const k = c.kind || kind;
    const L: Record<string, string> = {
      inn: "ИНН", kpp: "КПП", ogrn: k === "ooo" ? "ОГРН" : "ОГРНИП", name: "Название ООО (без кавычек)",
      address: k === "ooo" ? "Юридический адрес" : "Адрес регистрации ИП (необязательно)",
      person: k === "ooo" ? "ФИО руководителя полностью" : "ФИО полностью",
      bik: "БИК", rs: "Расчётный счёт", ks: "Корреспондентский счёт", bank: "Банк", phone: "Телефон", email: "Электронная почта",
    };
    if (c.kind) setKind(c.kind);
    if (c.inn) setInn(c.inn);
    if (c.kpp && k === "ooo") setKpp(c.kpp);
    if (c.ogrn) setOgrn(c.ogrn);
    if (c.name && k === "ooo") setName(c.name);
    if (c.address) setAddress(c.address);
    if (c.person) setPerson(c.person);
    if (c.position && k === "ooo") setPosition(c.position);
    if (c.bik) setBik(c.bik);
    if (c.rs) setRs(c.rs);
    if (c.ks) setKs(c.ks);
    if (c.bank && !c.bik) setBank(c.bank);
    if (c.phone) setPhone(c.phone);
    if (c.email) setEmail(c.email);
    const found = Object.keys(c).filter((x) => L[x] && !(k === "ip" && (x === "kpp" || x === "name")));
    setParsed(new Set(found.map((x) => L[x])));
    setParseMsg(
      found.length
        ? `Распознано: ${found.map((x) => L[x].replace(/ \(.*\)/, "")).join(", ")}. Поля подсвечены зелёным: проверьте их глазами.`
        : "Ничего не распознал. Проверьте, что в тексте есть слова ИНН, КПП, БИК и т. п., или заполните поля вручную.",
    );
    if (found.length) setTimeout(() => document.getElementById("card-2")?.scrollIntoView({ behavior: "smooth" }), 100);
  };
  const [copied, setCopied] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const missing: Missing = {
    labels: new Set(left.map((c) => c.label).filter(Boolean)),
    perCard: left.reduce<Record<number, number>>((m, c) => ({ ...m, [c.card]: (m[c.card] || 0) + 1 }), {}),
    show: showMiss,
    parsed,
  };
  const validate = () => {
    const e = left.map((c) => c.msg);
    setShowMiss(true);
    setErrors(e);
    if (e.length) document.getElementById(`card-${left[0].card}`)?.scrollIntoView({ behavior: "smooth" });
    return e.length === 0;
  };

  const data = () => ({
    ...exec.data,
    num: num.trim(),
    date: dateWords(date),
    month_year: firstPeriod(month, period),
    period_unit: PERIOD_UNIT[period],
    total: money(total),
    total_words: numberWords(total),
    price: money(priceNum),
    points_phrase: `${pointsN} (${numberWords(pointsN, true)}) ${plural(pointsN, "точка, указанная", "точки, указанные", "точек, указанных")} в Приложении № 1 к Договору`,
    inn: digits(inn),
    address: address.trim() || "—",
    short: shortName(person),
    bank: bank.trim(),
    rs: digits(rs),
    bik: digits(bik),
    ks: digits(ks),
    phone: phone.trim(),
    email: email.trim(),
    edo_operator: edo,
    edo_id: edo === "Нет ЭДО" ? "—" : edoId.trim() || "—",
    contact: contact.trim() || person.trim(),
    points: filledPoints.map((p, i) => ({ n: i + 1, title: p.title.trim(), address: p.address.trim(), city: p.city.trim() })),
    // ООО
    name: name.trim(),
    ogrn: digits(ogrn),
    kpp: digits(kpp),
    sign_position: position,
    sign_pos_gen: posGen,
    dir_full: person.trim(),
    dir_gen: personGen.trim(),
    signer_acting: fem ? "действующей" : "действующего",
    basis_text: basisText,
    // ИП
    fio: person.trim(),
    ogrnip: digits(ogrn),
    acting: fem ? "действующая" : "действующий",
    named: fem ? "именуемая" : "именуемый",
  });

  const generate = async () => {
    setMsg("");
    setResult(null);
    if (!validate()) return;
    setBusy(true);
    try {
      const enc = await fetch(`/api/docs/${user.tpl}${kind}.docx.enc`, { cache: "no-store" }).then((r) => {
        if (!r.ok) throw new Error("Шаблон не загрузился");
        return r.arrayBuffer();
      });
      const tpl = await decryptTemplate(enc, key);
      const blob = await renderDocx(tpl, data());
      const file = `Договор ${num.trim()} ${clientTitle}`.replace(/[\\/:*?"<>|«»]+/g, " ").replace(/\s+/g, " ").trim();
      setResult({ blob, file });

      // Пример для ознакомления клиента: в журнал не пишем, Юрию не отправляем
      if (num.trim() === SAMPLE_NUM) {
        setMsg("Пример готов. Это образец с вымышленными данными: в журнал он не попал.");
        return;
      }
      const fd = new FormData();
      fd.append("docx", blob, `${file}.docx`);
      fd.append(
        "meta",
        JSON.stringify({
          num: num.trim(), client: clientTitle, inn: digits(inn), total, points: pointsN, date: dateWords(date),
          executor: exec.label, author, form: snapshot(),
        }),
      );
      const saved = await api(key, "a=save", { method: "POST", body: fd });
      const v = saved.version > 1 ? ` (версия ${saved.version})` : "";
      setMsg(saved.telegram ? `Договор готов${v}. Сохранён в журнале, копия отправлена Юрию в Telegram.` : `Договор готов${v} и сохранён в журнале.`);
      loadJournal();
    } catch (err) {
      setMsg(`Ошибка: ${(err as Error).message}`);
    } finally {
      setBusy(false);
    }
  };

  const downloadWord = (r = result) => {
    if (!r) return;
    const result = r;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(result.blob);
    a.download = `${result.file}.docx`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  };

  // PDF: рисуем договор в скрытом окне шириной с текст страницы A4 и открываем печать → «Сохранить как PDF»
  const printPdf = async (r = result) => {
    if (!r) return;
    const frame = document.createElement("iframe");
    frame.style.cssText = "position:fixed;left:-10000px;top:0;width:624px;height:900px;border:0";
    document.body.appendChild(frame);
    await renderForPrint(r.blob, frame, r.file.replace(/\.docx$/i, ""));
    frame.contentWindow!.focus();
    frame.contentWindow!.print();
    setTimeout(() => frame.remove(), 60000);
  };

  const setPoint = (i: number, k: keyof Point, v: string) =>
    setPoints((ps) => ps.map((p, j) => (j === i ? { ...p, [k]: v } : p)));

  // --- Вход -------------------------------------------------------------------
  if (!key)
    return (
      <main className="docs-light flex min-h-screen items-center justify-center bg-background px-5 py-16 text-foreground">
        <form onSubmit={login} className="w-full max-w-[420px] rounded-[28px] bg-surface p-7 text-cream md:p-10">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-foreground">
            <Icon name="Lock" size={22} />
          </span>
          <h1 className="mt-6 font-display text-[1.9em] font-semibold leading-none tracking-[-0.02em]">документы</h1>
          <p className="mt-3 text-cream-muted">Служебная страница для подготовки договоров. Введите пин-код.</p>
          <Input
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            className={`${field} mt-6 text-center text-[1.4em] tracking-[0.5em]`}
            placeholder="••••"
            maxLength={8}
            value={pw}
            onChange={(e) => setPw(e.target.value.replace(/\D/g, ""))}
            aria-label="Пин-код"
          />
          {authErr && <p className="mt-2 text-[max(12px,0.86em)] text-destructive">{authErr}</p>}
          <button
            disabled={authBusy || !pw.trim()}
            className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-brand font-medium text-foreground disabled:opacity-60"
          >
            {authBusy ? <Icon name="Loader2" size={18} className="animate-spin" /> : "войти"}
          </button>
        </form>
      </main>
    );

  // --- Форма ------------------------------------------------------------------
  return (
    <MissCtx.Provider value={missing}>
    <main className="docs-light min-h-screen bg-background text-foreground">
      <div className="px-5 py-8 md:px-14 md:py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-[28px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[56px]">
              договор с рестораном
            </h1>
            <p className="mt-3 max-w-[640px] text-foreground/75">
              Заполните данные, которые прислал ресторан. Договор с Приложениями 1–4 соберётся по шаблону Юрия, текст
              шаблона не меняется. Word можно поправить вручную, PDF подходит для отправки клиенту.
            </p>
          </div>
          <button
            onClick={() => {
              writeKey("");
              setKey("");
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-surface px-5 py-3 text-[0.95em] font-medium text-cream"
          >
            <Icon name="LogOut" size={16} /> выйти
          </button>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            <section className="docs-card rounded-[24px] bg-surface p-5 text-cream md:p-7">
              <button
                type="button"
                onClick={() => {
                  setHelloOpen((o) => !o);
                  LS.set("agd-hello", helloOpen ? "0" : "1");
                }}
                className="flex w-full items-center justify-between gap-3 text-left"
                aria-expanded={helloOpen}
              >
                <span className="font-display text-[1.3em] font-semibold tracking-[-0.02em]">{user.id === "lilia" ? "Лиля" : "Алиса"}, привет! 👋</span>
                <span className="inline-flex items-center gap-1 text-[max(12px,0.85em)] text-cream-muted">
                  {helloOpen ? "свернуть" : "развернуть"}
                  <Icon name={helloOpen ? "ChevronUp" : "ChevronDown"} size={16} />
                </span>
              </button>
              {helloOpen && (
                <div className="mt-3 space-y-3 text-[max(14px,0.95em)] leading-relaxed">
                  <p>Это твой кабинет для договоров с ресторанами. Больше не нужно открывать Word и копировать реквизиты по строчке.</p>
                  <p className="font-medium">Как работать:</p>
                  <ol className="list-decimal space-y-1 pl-5">
                    <li>Ресторан прислал свои данные, ты переносишь их в поля.</li>
                    <li>Кабинет сам соберёт договор и Приложения 1–4 по шаблону Юрия. Текст шаблона не меняется, поэтому юридически всё в порядке.</li>
                    <li>Если нужна мелкая правка, скачай Word. Клиенту отправляй PDF.</li>
                  </ol>
                  <p className="rounded-xl bg-pale/70 p-3">
                    Перед отправкой проверь глазами ИНН, название юрлица, банк и подписанта: опечатку в реквизитах кабинет за тебя не заметит.
                  </p>
                  {user.id === "lilia" && (
                    <p>
                      Договоры здесь оформляются от твоего ИП, а в журнале видны только твои договоры. Номер ставится сам по названию первой точки, его можно поменять.
                    </p>
                  )}
                  <p>
                    Если что-то непонятно или не работает, пиши Юрию. {user.id === "lilia" ? "Удачи, пусть договоров будет много! 🚀" : "Удачи, у тебя всё получится! 🌷"}
                  </p>
                </div>
              )}
            </section>

            <div className="grid gap-4 xl:grid-cols-[1.25fr_1fr]">
              <section className="docs-card rounded-[24px] bg-surface p-5 text-cream md:p-7">
                <h2 className="font-display text-[1.2em] font-semibold tracking-[-0.02em]">Загрузи карточку или вставь реквизиты текстом</h2>
                <p className="mt-1 text-[max(12px,0.85em)] text-cream-muted">
                  Кабинет сам разложит ИНН, КПП, ОГРН, адрес, директора, БИК и счета по полям. Файл читается прямо в браузере и никуда не отправляется.
                </p>
                <label
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    readFile(e.dataTransfer.files?.[0]);
                  }}
                  className={`mt-3 flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed px-4 py-5 text-center transition ${
                    dragOver ? "border-brand bg-pale/60" : "border-cream/25 bg-cream/5 hover:border-brand"
                  }`}
                >
                  <Icon name={fileBusy ? "Loader2" : "FileDown"} size={22} className={fileBusy ? "animate-spin" : ""} />
                  <span className="font-medium">{fileBusy || "Перетащи файл сюда или нажми, чтобы выбрать"}</span>
                  <span className="text-[max(12px,0.8em)] text-cream-muted">Word (.docx), PDF, Excel (.xlsx), фото или скан карточки</span>
                  <input
                    type="file"
                    className="sr-only"
                    accept=".docx,.pdf,.xlsx,.txt,.csv,image/*"
                    disabled={!!fileBusy}
                    onChange={(e) => {
                      readFile(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                </label>
                <p className="mt-3 text-[max(12px,0.8em)] text-cream-muted">или вставь текст:</p>
                <textarea
                  value={cardText}
                  onChange={(e) => setCardText(e.target.value)}
                  rows={6}
                  placeholder={"ООО «Вкусная точка»\nИНН/КПП 7801234564/780101001\nОГРН 1217800012341\nЮридический адрес: 191186, г. Санкт-Петербург, Невский пр., д. 28\nГенеральный директор: Петров Пётр Петрович\nБИК 044030653, р/с 40702810550000123455"}
                  className="mt-1 w-full rounded-xl border border-cream/20 bg-cream/5 p-3 text-[max(13px,0.9em)] text-cream placeholder:text-cream-muted/50 focus:outline-none focus:ring-1 focus:ring-brand"
                />
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => applyCard()}
                    disabled={!cardText.trim()}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 font-medium text-foreground disabled:opacity-50"
                  >
                    <Icon name="ArrowRight" size={16} /> разложить по полям
                  </button>
                  {cardText && (
                    <button type="button" onClick={() => setCardText("")} className="rounded-xl px-3 py-2.5 text-[0.9em] text-cream-muted">
                      стереть текст
                    </button>
                  )}
                </div>
                {parseMsg && (
                  <p
                    className={`mt-3 rounded-xl p-3 text-[max(12px,0.86em)] ${
                      /Не получилось|Ничего не распознал/.test(parseMsg) ? "bg-red-50 text-red-700" : "bg-green-50 text-green-800"
                    }`}
                  >
                    {parseMsg}
                  </p>
                )}
              </section>

              <section className="docs-card rounded-[24px] bg-surface p-5 text-cream md:p-7">
                <h2 className="font-display text-[1.2em] font-semibold tracking-[-0.02em]">Что запросить у ресторана</h2>
                <p className="mt-1 text-[max(12px,0.85em)] text-cream-muted">Готовое сообщение со списком реквизитов: скопируй и отправь ресторану.</p>
                <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap rounded-xl bg-cream/5 p-3 font-sans text-[max(12px,0.85em)] leading-relaxed">{ASK_TEXT}</pre>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(ASK_TEXT).then(() => setAskCopied(true)).catch(() => {});
                    setTimeout(() => setAskCopied(false), 2500);
                  }}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 font-medium text-brand"
                >
                  <Icon name={askCopied ? "Check" : "Copy"} size={16} /> {askCopied ? "скопировано" : "скопировать"}
                </button>
              </section>
            </div>

            <div className="flex flex-wrap items-center gap-3 rounded-[24px] border border-dashed border-foreground/25 bg-pale/60 p-4 md:p-5">
              <Icon name="FileText" size={20} />
              <p className="flex-1 text-[max(13px,0.92em)]">
                Хотите показать клиенту, как будет выглядеть договор, ещё до его реквизитов? Заполните форму примером.
              </p>
              <button
                type="button"
                onClick={() => {
                  setNumAuto(false);
                  restore({ ...SAMPLE, date: today(), month: today().slice(0, 7) });
                  setParsed(new Set());
                  setShowMiss(false);
                  setErrors([]);
                  setMsg("Форма заполнена примером с вымышленными данными. Номер «ОБРАЗЕЦ»: такой договор не попадёт в журнал.");
                }}
                className="rounded-xl bg-foreground px-4 py-2.5 text-[0.95em] font-medium text-brand"
              >
                заполнить примером
              </button>
              {confirmReset ? (
                <span className="flex items-center gap-2">
                  <span className="text-[0.9em]">Очистить форму и черновик?</span>
                  <button
                    type="button"
                    onClick={() => {
                      restore({ ...EMPTY, month: thisMonth() });
                      LS.set(draftKey, null);
                      setParsed(new Set());
                      setParseMsg("");
                      setCardText("");
                      setNumAuto(true);
                      setShowMiss(false);
                      setErrors([]);
                      setLookupMsg("");
                      setBankMsg("");
                      setConfirmReset(false);
                      setTimeout(() => setMsg("Форма и черновик очищены."), 350);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="rounded-xl bg-red-600 px-4 py-2.5 text-[0.95em] font-medium text-white"
                  >
                    да, очистить
                  </button>
                  <button type="button" onClick={() => setConfirmReset(false)} className="rounded-xl border border-foreground/30 px-4 py-2.5 text-[0.95em]">
                    нет
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-foreground/30 bg-white/60 px-4 py-2.5 text-[0.95em] font-medium"
                >
                  <Icon name="RotateCcw" size={16} /> очистить
                </button>
              )}
            </div>

            <Card n={1} t="Исполнитель">
              <div className="flex flex-col gap-2 md:col-span-2 md:flex-row" role="radiogroup" aria-label="Исполнитель">
                {myExecutors.map((x) => (
                  <button
                    key={x.id}
                    type="button"
                    role="radio"
                    aria-checked={executor === x.id}
                    onClick={() => setExecutor(x.id)}
                    className={`flex-1 rounded-xl px-4 py-3 text-left font-medium ${executor === x.id ? "bg-brand text-foreground" : "bg-cream/10 text-cream"}`}
                  >
                    {x.label}
                    <span className={`block text-[0.8em] font-normal ${executor === x.id ? "text-foreground/70" : "text-cream-muted"}`}>
                      ИНН {x.data.e_inn} · {x.missing.includes("система налогообложения") ? "налоги уточняются" : x.data.e_tax_gen.match(/\((\S+)\)/)?.[1]}
                    </span>
                  </button>
                ))}
              </div>
              {exec.missing.length > 0 && (
                <p className="rounded-xl bg-pale/70 p-3 text-[max(12px,0.86em)] text-foreground md:col-span-2">
                  Не хватает данных исполнителя: {exec.missing.join(", ")}. Договор от этого исполнителя пока сформировать нельзя.
                </p>
              )}
            </Card>

            <Card n={2} t="Заказчик">
              <div className="flex gap-2 md:col-span-2" role="radiogroup" aria-label="Форма заказчика">
                {(["ooo", "ip"] as Kind[]).map((k) => (
                  <button
                    key={k}
                    type="button"
                    role="radio"
                    aria-checked={kind === k}
                    onClick={() => setKind(k)}
                    className={`flex-1 rounded-xl px-4 py-3 font-medium ${kind === k ? "bg-brand text-foreground" : "bg-cream/10 text-cream"}`}
                  >
                    {k === "ooo" ? "ООО" : "ИП"}
                  </button>
                ))}
              </div>
              <Label t="ИНН" err={innErr} hint="10 цифр у ООО, 12 у ИП. Есть в карточке организации и в выписке ЕГРЮЛ. Нажмите «найти», и реквизиты подтянутся сами">
                <div className="flex gap-2">
                  <Input className={field} inputMode="numeric" value={inn} onChange={(e) => setInn(digits(e.target.value).slice(0, 12))} />
                  <button
                    type="button"
                    onClick={lookup}
                    disabled={lookupBusy || ![10, 12].includes(digits(inn).length)}
                    className="shrink-0 rounded-xl bg-brand px-4 font-medium text-foreground disabled:opacity-50"
                  >
                    {lookupBusy ? <Icon name="Loader2" size={18} className="animate-spin" /> : "найти"}
                  </button>
                </div>
              </Label>
              <Label
                t={kind === "ooo" ? "ОГРН" : "ОГРНИП"}
                err={ogrnErr}
                hint={kind === "ooo" ? "13 цифр, например 1217800012341. В карточке организации или выписке ЕГРЮЛ" : "15 цифр, например 325780000123458. В выписке ЕГРИП или карточке ИП"}
              >
                <Input className={field} inputMode="numeric" value={ogrn} onChange={(e) => setOgrn(digits(e.target.value).slice(0, 15))} />
              </Label>
              {lookupMsg && <p className="rounded-xl bg-pale/70 p-3 text-[max(12px,0.86em)] text-foreground md:col-span-2">{lookupMsg}</p>}
              {kind === "ooo" ? (
                <>
                  <Label t="Название ООО (без кавычек)" hint="Например: Вкусная точка. Без «ООО» и без кавычек, как в выписке">
                    <Input className={field} value={name} onChange={(e) => setName(e.target.value)} />
                  </Label>
                  <Label t="КПП" err={kppErr} hint="9 знаков, например 780101001. В карточке организации рядом с ИНН">
                    <Input className={field} value={kpp} onChange={(e) => setKpp(e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, "").slice(0, 9))} />
                  </Label>
                </>
              ) : null}
              <Label
                t={kind === "ooo" ? "Юридический адрес" : "Адрес регистрации ИП (необязательно)"}
                hint={kind === "ooo" ? "С индексом, как в выписке ЕГРЮЛ: 191186, г. Санкт-Петербург, Невский пр., д. 28" : "Можно оставить город из реестра или пусто: в договоре будет «—»"}
                wide
              >
                <AddressInput
                  apiKey={key}
                  enabled={dadata}
                  value={address}
                  onChange={setAddress}
                  onPick={(a) => setAddress(a.full)}
                  placeholder={dadata ? "Начните вводить, появятся подсказки" : ""}
                />
              </Label>
            </Card>

            <Card n={3} t={kind === "ooo" ? "Кто подписывает" : "Предприниматель"}>
              <Label t={kind === "ooo" ? "ФИО руководителя полностью" : "ФИО полностью"} hint={kind === "ooo" ? "Полностью, как в выписке: Иванов Иван Иванович. В карточке строка «Генеральный директор»" : "Полностью, как в выписке ЕГРИП: Иванов Иван Иванович"}>
                <Input className={field} value={person} onChange={(e) => setPerson(e.target.value)} />
              </Label>
              <Label t="Пол (для «действующий / действующая»)">
                <select
                  className={`${field} w-full border`}
                  value={gender}
                  onChange={(e) => {
                    setGender(e.target.value as Gender);
                    genitive(person, e.target.value as Gender).then(setPersonGen);
                  }}
                >
                  <option value="male">мужской</option>
                  <option value="female">женский</option>
                </select>
              </Label>
              {kind === "ooo" && (
                <>
                  <Label t="Должность">
                    <select className={`${field} w-full border`} value={position} onChange={(e) => setPosition(e.target.value as typeof position)}>
                      <option>Генеральный директор</option>
                      <option>Директор</option>
                    </select>
                  </Label>
                  <Label t="ФИО в родительном падеже" hint="Подставлено автоматически: проверьте («в лице генерального директора …»)">
                    <Input className={field} value={personGen} onChange={(e) => setPersonGen(e.target.value)} />
                  </Label>
                  <Label t="Действует на основании">
                    <select className={`${field} w-full border`} value={basis} onChange={(e) => setBasis(e.target.value as typeof basis)}>
                      <option>Устав</option>
                      <option>Доверенность</option>
                    </select>
                  </Label>
                  {basis === "Доверенность" && (
                    <Label t="Номер и дата доверенности" hint="Например: № 12 от 01.09.2026">
                      <Input className={field} value={proxy} onChange={(e) => setProxy(e.target.value)} />
                    </Label>
                  )}
                </>
              )}
              <div className="rounded-xl bg-cream/5 p-4 text-[max(12px,0.86em)] leading-relaxed text-cream-muted md:col-span-2">
                <b className="text-cream">Так будет в договоре:</b> {preview}
              </div>
            </Card>

            <Card n={4} t="Банковские реквизиты">
              <Label t="БИК" hint="9 цифр, обычно начинается с 04. Начните с БИК: банк и корр. счёт подставятся сами">
                <Input className={field} inputMode="numeric" value={bik} onChange={(e) => setBik(digits(e.target.value).slice(0, 9))} />
              </Label>
              <Label t="Расчётный счёт" hint="20 цифр: у ООО обычно начинается с 40702, у ИП с 40802">
                <Input
                  className={`${field} ${rsErr ? "border-red-400" : ""}`}
                  inputMode="numeric"
                  value={rs}
                  onChange={(e) => setRs(digits(e.target.value).slice(0, 20))}
                />
                {rsErr && <span className="mt-1 block text-[max(12px,0.78em)] text-red-600">{rsErr}</span>}
              </Label>
              {bankMsg && <p className="rounded-xl bg-pale/70 p-3 text-[max(12px,0.86em)] text-foreground md:col-span-2">{bankMsg}</p>}
              <Label t="Банк" hint="Подставится по БИК из справочника Банка России" wide>
                <Input className={field} value={bank} onChange={(e) => setBank(e.target.value)} />
              </Label>
              <Label t="Корреспондентский счёт" hint="20 цифр, начинается с 30101. Подставится по БИК" wide>
                <Input
                  className={`${field} ${ksErr ? "border-red-400" : ""}`}
                  inputMode="numeric"
                  value={ks}
                  onChange={(e) => setKs(digits(e.target.value).slice(0, 20))}
                />
                {ksErr && <span className="mt-1 block text-[max(12px,0.78em)] text-red-600">{ksErr}</span>}
              </Label>
            </Card>

            <Card n={5} t="Контакты заказчика">
              <Label t="Телефон" hint="Например: +7 900 123-45-67. Бухгалтерия или управляющий">
                <Input className={field} inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </Label>
              <Label t="Электронная почта" hint="Сюда по договору идут юридически значимые сообщения">
                <Input className={field} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Label>
              <Label t="Оператор ЭДО" hint="Спросите у ресторана, через кого они подписывают документы">
                <select className={`${field} w-full border`} value={edo} onChange={(e) => setEdo(e.target.value)}>
                  {EDO.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </Label>
              <Label t="ID ЭДО" hint="Например: 2BM-7801234564-780101001-… Есть в кабинете ЭДО ресторана, в реквизитах">
                <Input className={field} value={edoId} disabled={edo === "Нет ЭДО"} onChange={(e) => setEdoId(e.target.value)} />
              </Label>
              <Label t="Ответственное контактное лицо" hint="ФИО и должность; пусто = руководитель" wide>
                <Input className={field} value={contact} onChange={(e) => setContact(e.target.value)} />
              </Label>
            </Card>

            <Card n={6} t="Точки ресторана">
              <div className="space-y-3 md:col-span-2">
                {points.map((p, i) => (
                  <div key={i} className="grid gap-2 rounded-xl bg-cream/5 p-3 md:grid-cols-[1fr_1.3fr_0.8fr_auto]">
                    <Input className={`${field} ${showMiss && !p.title.trim() ? "border-red-400" : ""}`} placeholder="Название на сервисе" value={p.title} onChange={(e) => setPoint(i, "title", e.target.value)} />
                    <AddressInput
                      apiKey={key}
                      enabled={dadata}
                      placeholder="Адрес"
                      value={p.address}
                      onChange={(v) => setPoint(i, "address", v)}
                      onPick={(a) => {
                        const street = a.city_part && a.value.startsWith(a.city_part + ", ") ? a.value.slice(a.city_part.length + 2) : a.value;
                        setPoint(i, "address", street);
                        if (a.city) setPoint(i, "city", a.city);
                      }}
                    />
                    <Input className={`${field} ${showMiss && !p.city.trim() ? "border-red-400" : ""}`} placeholder="Город" value={p.city} onChange={(e) => setPoint(i, "city", e.target.value)} />
                    <button
                      type="button"
                      onClick={() => setPoints((ps) => (ps.length > 1 ? ps.filter((_, j) => j !== i) : ps))}
                      className="flex h-12 items-center justify-center rounded-xl px-3 text-cream-muted hover:text-cream disabled:opacity-30"
                      disabled={points.length === 1}
                      aria-label="Убрать точку"
                    >
                      <Icon name="Trash2" size={18} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setPoints((ps) => [...ps, { title: "", address: "", city: ps[ps.length - 1]?.city || "" }])}
                  className="inline-flex items-center gap-2 rounded-xl border border-cream/30 px-4 py-2.5 font-medium"
                >
                  <Icon name="Plus" size={16} /> добавить точку
                </button>
              </div>
            </Card>

            <Card n={7} t="Стоимость и даты">
              <Label
                t={priceLabel}
                hint={
                  pointsN > 1
                    ? `Сеть из ${pointsN} ${plural(pointsN, "точки", "точек", "точек")}: можно поставить цену со скидкой. Итого ${money(total)} ₽ в месяц (${pointsN} × ${money(priceNum)} ₽)`
                    : `Одна точка: ${money(total)} ₽ в месяц. Для сетей цену за точку можно снизить`
                }
              >
                <Input className={field} inputMode="numeric" value={price} onChange={(e) => setPrice(digits(e.target.value))} />
              </Label>
              <Label
                t="Номер договора"
                hint={numAuto ? "Ставится сам: три буквы названия первой точки и порядковый номер (Молодость → МОЛ01). Можно вписать свой." : "Номер вписан вручную. Сотрите его, и номер снова поставится сам."}
              >
                <Input
                  className={field}
                  value={num}
                  onChange={(e) => {
                    setNum(e.target.value);
                    setNumAuto(e.target.value.trim() === "");
                  }}
                />
              </Label>
              {dupe && <p className="rounded-xl bg-pale/70 p-3 text-[max(12px,0.86em)] text-foreground md:col-span-2">{dupe}</p>}
              <Label t="Дата договора" hint="Выберите в календаре">
                <Input className={field} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </Label>
              <Label t="Отчётный период" hint="Попадает в п. 1.3 и 6.1 договора и в образцы счёта">
                <select className={`${field} w-full border`} value={period} onChange={(e) => setPeriod(e.target.value as Period)}>
                  <option value="month">календарный месяц</option>
                  <option value="16-15">с 16-го по 15-е число</option>
                </select>
              </Label>
              <Label
                t={period === "month" ? "Первый месяц работ" : "Первый период начинается 16-го числа месяца"}
                hint={`В образцах будет: «за ${firstPeriod(month, period) || "…"}»`}
              >
                <Input className={field} type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
              </Label>
            </Card>
          </div>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-[24px] bg-pale p-6 text-foreground md:p-8">
              <div className="mb-5">
                <div className="flex items-baseline justify-between text-[0.9em]">
                  <b>{left.length ? `Заполнено ${doneShare}%` : "Всё заполнено"}</b>
                  <span className="text-foreground/60">
                    {checks.length - left.length} из {checks.length}
                  </span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-foreground/10">
                  <div className={`h-full rounded-full transition-all ${left.length ? "bg-brand" : "bg-green-500"}`} style={{ width: `${doneShare}%` }} />
                </div>
                {left.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {left.map((c) => (
                      <button
                        key={c.msg}
                        type="button"
                        onClick={() => {
                          setShowMiss(true);
                          document.getElementById(`card-${c.card}`)?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="rounded-full bg-foreground/10 px-2.5 py-1 text-[max(12px,0.78em)] hover:bg-foreground/20"
                      >
                        {c.label || c.msg.split(":")[0]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-[0.9em] text-foreground/70">{clientTitle.trim().length > 6 ? clientTitle : "Заказчик не заполнен"}</p>
              <p className="mt-4 text-[0.9em] text-foreground/70">
                {pointsN} {plural(pointsN, "точка", "точки", "точек")} × {money(priceNum)} ₽
              </p>
              <p className="mt-1 font-display text-[2.2em] font-semibold leading-none tracking-[-0.03em]">{money(total)} ₽</p>
              <p className="mt-2 text-[0.9em] text-foreground/70">в месяц, {numberWords(total)} рублей</p>
              {user.all ? (
              <label className="mt-5 flex items-center justify-between gap-3 text-[0.9em]">
                <span className="text-foreground/70">Оформляет</span>
                <select
                  value={author}
                  onChange={(e) => {
                    setAuthor(e.target.value);
                    LS.set("agd-author", e.target.value);
                  }}
                  className="h-10 rounded-lg border border-foreground/20 bg-white/70 px-3"
                >
                  <option>Алиса</option>
                  <option>Юрий</option>
                </select>
              </label>
              ) : (
                <p className="mt-5 flex items-center justify-between text-[0.9em]">
                  <span className="text-foreground/70">Оформляет</span>
                  <b>{user.name}</b>
                </p>
              )}

              <button
                onClick={generate}
                disabled={busy}
                className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-foreground font-medium text-brand disabled:opacity-60"
              >
                {busy ? <Icon name="Loader2" size={20} className="animate-spin" /> : <>сформировать договор <Icon name="ArrowRight" size={18} /></>}
              </button>
              {errors.length > 0 && left.length > 0 && (
                <p className="mt-4 rounded-xl bg-foreground/10 p-4 text-[max(12px,0.86em)]">
                  Не хватает данных: незаполненные поля подсвечены красным, список вверху этого блока.
                </p>
              )}
              {msg && <p className="mt-4 text-[max(12px,0.86em)]">{msg}</p>}
              {result && (
                <div className="mt-4 grid gap-2">
                  <button onClick={() => downloadWord()} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand font-medium">
                    <Icon name="FileText" size={18} /> Word, для нас (можно править)
                  </button>
                  <button onClick={() => printPdf()} className="flex h-12 items-center justify-center gap-2 rounded-xl border border-foreground/30 font-medium">
                    <Icon name="FileDown" size={18} /> PDF, для клиента
                  </button>
                  <p className="text-[max(12px,0.78em)] text-foreground/60">
                    Для PDF откроется окно печати: выберите «Сохранить как PDF».
                  </p>
                  <div className="mt-2 rounded-xl bg-[#23100B] p-4 text-[#FFFBF5]">
                    <p className="font-medium text-brand">Не забудьте: отправьте PDF в рабочий чат с клиентом</p>
                    <p className="mt-2 text-[max(12px,0.86em)] leading-relaxed text-[#FFFBF5]/90">{chatText(pointsN)}</p>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(chatText(pointsN)).then(() => setCopied(true)).catch(() => {});
                        setTimeout(() => setCopied(false), 2500);
                      }}
                      className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-2 text-[0.85em] font-medium text-foreground"
                    >
                      <Icon name={copied ? "Check" : "Copy"} size={16} /> {copied ? "скопировано" : "скопировать текст"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 rounded-[24px] bg-surface p-6 text-cream">
              <h2 className="font-display text-[1.2em] font-semibold">{user.all ? "журнал договоров" : "мои договоры"}</h2>
              <p className="mt-1 text-[max(12px,0.8em)] text-cream-muted">
                {user.all ? "Общий для Юрия и Алисы: видно, кто и когда оформил договор." : "Здесь только твои договоры."} Любой старый договор можно скачать заново (Word или PDF). Нашли ошибку: «заполнить из этого», поправьте и сформируйте снова, сохранится новая версия.
              </p>
              {journal.length === 0 ? (
                <p className="mt-3 text-[0.9em] text-cream-muted">Пока пусто.</p>
              ) : (
                <ul className="mt-3 space-y-3 text-[0.9em]">
                  {journal.slice(0, journalAll ? undefined : 8).map((j, i) => (
                    <li key={i} className="border-t border-cream/15 pt-3">
                      <b>№ {j.num}</b>
                      {j.version && j.version > 1 ? <span className="font-medium text-amber-700"> · версия {j.version}</span> : null} · {j.client}
                      <span className="block text-cream-muted">
                        {j.points} {plural(j.points, "точка", "точки", "точек")}, {money(j.total)} ₽ в месяц
                        {j.executor ? ` · исполнитель ${j.executor.replace("ИП ", "")}` : ""}
                      </span>
                      <span className="block text-[0.92em] text-cream-muted">
                        {j.author ? `Оформил(а): ${j.author} · ` : "Кто оформил: не записано · "}
                        {j.created} МСК
                      </span>
                      <span className="mt-2 flex flex-wrap gap-2">
                        {j.has_form && (
                          <button
                            onClick={() => fillFrom(j.id)}
                            disabled={histBusy === j.id}
                            className="rounded-lg bg-brand px-3 py-1.5 text-[0.85em] font-medium text-foreground disabled:opacity-60"
                          >
                            заполнить из этого
                          </button>
                        )}
                        <button
                          onClick={() => fileFrom(j.id, j.num).then((r) => downloadWord(r)).catch((e) => setMsg(`Ошибка: ${e.message}`))}
                          className="rounded-lg border border-cream/30 px-3 py-1.5 text-[0.85em]"
                        >
                          Word
                        </button>
                        <button
                          onClick={() => fileFrom(j.id, j.num).then((r) => printPdf(r)).catch((e) => setMsg(`Ошибка: ${e.message}`))}
                          className="rounded-lg border border-cream/30 px-3 py-1.5 text-[0.85em]"
                        >
                          PDF
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {journal.length > 8 && (
                <button type="button" onClick={() => setJournalAll((v) => !v)} className="mt-3 text-[0.9em] font-medium underline underline-offset-4">
                  {journalAll ? "свернуть" : `показать все (${journal.length})`}
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
    </MissCtx.Provider>
  );
};

export default Docs;
