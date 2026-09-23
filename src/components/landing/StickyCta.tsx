import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";

const StickyCta = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const lead = document.getElementById("lead");
      const past = window.scrollY > window.innerHeight * 1.2;
      const nearForm = lead ? lead.getBoundingClientRect().top < window.innerHeight : false;
      setShow(past && !nearForm);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-4 left-1/2 z-40 -translate-x-1/2 px-4 transition-all duration-300 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <div className="flex items-center gap-2 rounded-2xl bg-surface p-2 pl-5 text-cream shadow-[0_10px_40px_rgba(0,0,0,.25)]">
        <span className="hidden text-[0.92em] leading-tight sm:block">
          бесплатно разберём ваш проект
        </span>
        <a
          href="#lead"
          className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-brand px-5 py-3 font-medium text-foreground transition-transform hover:-translate-y-0.5"
        >
          <span className="sm:hidden">бесплатный анализ</span>
          <span className="hidden sm:inline">оставить заявку</span>
          <Icon name="ArrowRight" size={17} />
        </a>
      </div>
    </div>
  );
};

export default StickyCta;