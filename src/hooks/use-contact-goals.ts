import { useEffect } from "react";
import { reachGoal } from "@/lib/metrika";

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
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement)?.closest?.("a");
      if (!link) return;
      const href = link.getAttribute("href") || "";
      const goal = resolveGoal(href);
      if (goal) reachGoal(goal);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
};

export default useContactGoals;
