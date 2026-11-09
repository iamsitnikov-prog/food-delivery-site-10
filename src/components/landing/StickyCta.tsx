import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";

/* Кнопки разделов, которые ведут к заявке. Пока одна из них видна на телефоне, плашка не нужна. */
const SECTION_CTA = 'main a[href="#lead"]:not([data-sticky-cta])';

const StickyCta = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const lead = document.getElementById("lead");
      const vh = window.innerHeight;
      const past = window.scrollY > vh * 1.2;
      const nearForm = lead ? lead.getBoundingClientRect().top < vh : false;
      let ownCta = false;
      if (window.innerWidth < 640) {
        ownCta = Array.from(document.querySelectorAll<HTMLElement>(SECTION_CTA)).some((el) => {
          const r = el.getBoundingClientRect();
          return r.height > 0 && r.bottom > 0 && r.top < vh;
        });
      }
      setShow(past && !nearForm && !ownCta);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-2 left-1/2 z-40 -translate-x-1/2 px-4 transition-all duration-300 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <div className="flex items-center gap-2 rounded-xl bg-surface p-1 pl-1 text-cream shadow-[0_8px_28px_rgba(0,0,0,.22)] sm:pl-4">
        <span className="hidden whitespace-nowrap text-[0.82em] leading-tight sm:block">
          бесплатно разберём ваш проект
        </span>
        <a
          href="#lead"
          data-sticky-cta
          tabIndex={show ? 0 : -1}
          className="inline-flex min-h-[40px] items-center gap-1.5 whitespace-nowrap rounded-lg bg-brand px-4 py-2 text-[0.94em] font-medium text-foreground transition-transform hover:-translate-y-0.5"
        >
          <span className="sm:hidden">бесплатный анализ</span>
          <span className="hidden sm:inline">оставить заявку</span>
          <Icon name="ArrowRight" size={15} />
        </a>
      </div>
    </div>
  );
};

export default StickyCta;
