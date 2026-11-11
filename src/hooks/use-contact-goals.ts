import { useEffect } from "react";
import { reachGoal, sendStaff } from "@/lib/metrika";

const resolveGoal = (href: string): string | null => {
  if (href.startsWith("tel:")) return "click_phone";
  if (href.includes("t.me/")) return "click_telegram";
  if (href.includes("wa.me/")) return "click_whatsapp";
  if (href.includes("max.ru/")) return "click_max";
  if (href.startsWith("mailto:")) return "click_email";
  return null;
};

const useContactGoals = () => {
  useEffect(() => {
    sendStaff();
    const t = window.setTimeout(sendStaff, 4000); // счётчик грузится с задержкой
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement)?.closest?.("a");
      if (!link) return;
      const href = link.getAttribute("href") || "";
      const goal = resolveGoal(href);
      if (goal) reachGoal(goal);
      // Переход к партнёру: общая цель и отдельная по партнёру (partner_starter и т. д.).
      const go = href.match(/^\/go\/([a-z0-9-]+)$/);
      if (go) {
        reachGoal("partner_click", { partner: go[1], page: window.location.pathname });
        reachGoal(`partner_${go[1].replace(/-/g, "_")}`);
      }
    };
    document.addEventListener("click", onClick);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("click", onClick);
    };
  }, []);
};

export default useContactGoals;
