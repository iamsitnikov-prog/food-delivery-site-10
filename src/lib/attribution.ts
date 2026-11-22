// Откуда пришёл посетитель (с 23.11.2026). Данные уходят вместе с заявкой
// в CRM кабинета /dokumenty, чтобы видеть, какие статьи и запросы приводят клиентов.
//
// Что запоминаем в браузере посетителя (только на этом сайте, без личных данных):
//   first   первый заход за 180 дней: страница входа, откуда пришёл, utm-метки
//   last    заход в этом визите (новый, если пришёл снаружи или по ссылке с метками)
//   pages   последние 12 страниц, которые человек открыл до заявки
// Сервер (api/lead.php → crm-lib.php) сам определяет по этому поисковик и канал.

const FIRST = "agg_src_first";
const LAST = "agg_src_last";
const SESSION = "agg_src_sess";
const PAGES = "agg_src_pages";
const FIRST_TTL = 180 * 86400 * 1000;
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "yclid", "gclid", "ysclid", "fbclid", "from", "_openstat"];

export type Touch = { at: string; landing: string; ref: string; utm: Record<string, string> };

const read = <T>(store: Storage | undefined, key: string): T | null => {
  try {
    const v = store?.getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
};
const write = (store: Storage | undefined, key: string, v: unknown) => {
  try {
    store?.setItem(key, JSON.stringify(v));
  } catch {
    /* приватный режим: просто не запоминаем */
  }
};
const ls = () => (typeof window === "undefined" ? undefined : window.localStorage);
const ss = () => (typeof window === "undefined" ? undefined : window.sessionStorage);

const ownHost = (h: string) => /(^|\.)agregatory\.pro$/i.test(h) || /^(localhost|127\.0\.0\.1)$/.test(h);

// Вызывается один раз при загрузке сайта в браузере
export const captureTouch = () => {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (url.pathname.startsWith("/dokumenty")) return; // свой кабинет не считаем
  const utm: Record<string, string> = {};
  for (const p of PARAMS) {
    const v = url.searchParams.get(p);
    if (v) utm[p] = v.slice(0, 120);
  }
  let ref = "";
  try {
    const r = document.referrer ? new URL(document.referrer) : null;
    if (r && !ownHost(r.hostname)) ref = r.href.slice(0, 300);
  } catch {
    /* битый referrer */
  }
  const session = read<Touch>(ss(), SESSION);
  const external = ref !== "" || Object.keys(utm).length > 0;
  if (session && !external) return; // переход внутри того же визита
  const touch: Touch = {
    at: new Date().toISOString(),
    landing: (url.pathname + url.search).slice(0, 300),
    ref,
    utm,
  };
  write(ss(), SESSION, touch);
  write(ls(), LAST, touch);
  const first = read<Touch>(ls(), FIRST);
  if (!first || Date.now() - Date.parse(first.at) > FIRST_TTL) write(ls(), FIRST, touch);
  if (!session) write(ss(), PAGES, []);
};

// Каждая открытая страница (вызывается при смене адреса)
export const trackPage = (path: string) => {
  if (typeof window === "undefined" || path.startsWith("/dokumenty")) return;
  const list = read<string[]>(ss(), PAGES) || [];
  if (list[list.length - 1] === path) return;
  list.push(path.slice(0, 200));
  write(ss(), PAGES, list.slice(-12));
};

const clientId = () =>
  new Promise<string>((resolve) => {
    const ym = (window as unknown as { ym?: (...a: unknown[]) => void }).ym;
    if (typeof ym !== "function") return resolve("");
    const t = setTimeout(() => resolve(""), 400);
    try {
      ym(112965538, "getClientID", (id: string) => {
        clearTimeout(t);
        resolve(String(id || ""));
      });
    } catch {
      clearTimeout(t);
      resolve("");
    }
  });

// Что отправить вместе с заявкой
export const sourcePayload = async () => {
  if (typeof window === "undefined") return {};
  return {
    first: read<Touch>(ls(), FIRST),
    last: read<Touch>(ss(), SESSION) || read<Touch>(ls(), LAST),
    pages: read<string[]>(ss(), PAGES) || [],
    form: window.location.pathname.slice(0, 200),
    cid: await clientId(),
  };
};
