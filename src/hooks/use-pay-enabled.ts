import { useEffect, useState } from "react";

// Включена ли онлайн оплата на хостинге (заданы ли ключи ЮKassa).
// До ответа сервера и при любой ошибке считаем, что выключена:
// кнопки оплаты не показываются, сайт работает как раньше.
let cached: boolean | null = null;
let pending: Promise<boolean> | null = null;

const load = () => {
  if (!pending) {
    pending = fetch("/api/pay.php?check=1", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { enabled: false }))
      .then((d) => (cached = d?.enabled === true))
      .catch(() => (cached = false));
  }
  return pending;
};

const usePayEnabled = () => {
  const [enabled, setEnabled] = useState<boolean | null>(cached);
  useEffect(() => {
    let alive = true;
    load().then((v) => alive && setEnabled(v));
    return () => {
      alive = false;
    };
  }, []);
  return enabled;
};

export default usePayEnabled;
