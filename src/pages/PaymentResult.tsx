import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import Icon from "@/components/ui/icon";
import useSeo from "@/hooks/use-seo";
import { reachGoal } from "@/lib/metrika";
import { formatRub } from "@/data/payments";

type Order = { status: "pending" | "paid" | "canceled"; title: string; amount: number; name: string };

const PaymentResult = () => {
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const id = (params.get("order") || "").replace(/[^a-f0-9]/g, "");
  const [order, setOrder] = useState<Order | null>(null);
  const [failed, setFailed] = useState(false);

  useSeo({
    title: "Статус оплаты | agregatory.pro",
    description: "Статус оплаты услуги на agregatory.pro: подтверждение платежа, чек на почту и следующие шаги.",
    path: pathname,
    noindex: true,
  });

  useEffect(() => {
    if (!id) {
      setFailed(true);
      return;
    }
    let alive = true;
    let tries = 0;
    let timer: ReturnType<typeof setTimeout>;
    const poll = async () => {
      try {
        const res = await fetch(`/api/pay.php?order=${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error();
        const data: Order = await res.json();
        if (!alive) return;
        setOrder(data);
        if (data.status === "paid") reachGoal("pay_success", { amount: data.amount });
        // Банк иногда подтверждает оплату с задержкой: спрашиваем ещё около минуты.
        if (data.status === "pending" && tries++ < 20) timer = setTimeout(poll, 3000);
      } catch {
        if (alive) setFailed(true);
      }
    };
    poll();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [id]);

  const first = order?.name.trim().split(" ")[0];
  let icon = "Loader2";
  let title = "проверяем оплату";
  let text = "Это займёт несколько секунд.";
  if (order?.status === "paid") {
    icon = "PartyPopper";
    title = `спасибо${first ? `, ${first}` : ""}!`;
    text = `Оплата получена: ${order.title}, ${formatRub(order.amount)}. Чек придёт на почту. Свяжемся с вами в течение рабочего дня, чтобы договориться о времени.`;
  } else if (order?.status === "canceled") {
    icon = "CircleX";
    title = "оплата не прошла";
    text = "Деньги не списаны. Попробуйте ещё раз, оплатите другой картой или через СБП. Если не получается, позвоните: +7 931 002-82-22.";
  } else if (order?.status === "pending") {
    icon = "Clock";
    title = "ждём подтверждения от банка";
    text = "Обычно это занимает до минуты. Если вы уже оплатили, ничего делать не нужно: как только банк подтвердит платёж, мы получим уведомление и свяжемся с вами.";
  } else if (failed) {
    icon = "CircleHelp";
    title = "заказ не найден";
    text = "Проверьте ссылку или напишите нам, поможем разобраться: +7 931 002-82-22, Telegram @sitnikovy1.";
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="px-5 py-10 md:px-14 md:py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-surface px-5 py-3 font-medium text-cream transition-transform hover:-translate-y-0.5"
        >
          <Icon name="ArrowLeft" size={18} />
          на главную
        </Link>
        <div className="mt-10 max-w-[760px] rounded-[28px] bg-surface p-6 text-cream md:p-12">
          <span className="flex h-16 w-16 items-center justify-center rounded-xl bg-brand text-foreground">
            <Icon name={icon} size={30} className={icon === "Loader2" ? "animate-spin" : ""} />
          </span>
          <h1 className="mt-6 font-display text-[2em] font-semibold leading-none tracking-[-0.02em] md:text-[2.8em]">
            {title}
          </h1>
          <p className="mt-4 max-w-[560px] leading-snug text-cream-muted">{text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {order?.status === "canceled" && (
              <Link to="/oplata" className="rounded-xl bg-brand px-6 py-4 font-medium text-foreground">
                попробовать ещё раз
              </Link>
            )}
            <a href="https://t.me/sitnikovy1" className="rounded-xl border border-cream/30 px-6 py-4 font-medium">
              написать в Telegram
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PaymentResult;
