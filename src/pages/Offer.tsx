import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";
import useSeo from "@/hooks/use-seo";
import { OFFER_SECTIONS } from "@/data/offer";

const Offer = () => {
  const { pathname } = useLocation();

  useSeo({
    title: "Публичная оферта на консультационные услуги | agregatory.pro",
    description:
      "Условия оказания консультаций, аудита ресторана на агрегаторе и обучения команды: стоимость, порядок оплаты картой и СБП, сроки, возврат, реквизиты исполнителя.",
    path: pathname,
  });

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

        <h1 className="mt-10 max-w-[900px] font-display text-[28px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[64px]">
          публичная оферта
          <span className="block text-muted-foreground">на консультационные услуги</span>
        </h1>
        <p className="mt-6 text-foreground/70">Редакция от 15 октября 2026 года</p>

        <div className="mt-10 space-y-4">
          {OFFER_SECTIONS.map((s, i) => (
            <section
              key={s.t}
              className={`rounded-[28px] p-7 md:p-9 ${i % 2 === 1 ? "bg-pale text-foreground" : "bg-surface text-cream"}`}
            >
              <h2 className="font-display text-[1.4em] font-semibold tracking-[-0.02em] md:text-[1.7em]">{s.t}</h2>
              <div className={`mt-5 space-y-3 leading-relaxed ${i % 2 === 1 ? "text-foreground/80" : "text-cream-muted"}`}>
                {s.p.map((t) => (
                  <p key={t}>{t}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <Link
          to="/oplata"
          className="mt-10 inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-4 font-medium text-foreground transition-transform hover:-translate-y-0.5"
        >
          перейти к оплате
          <Icon name="ArrowRight" size={18} />
        </Link>
      </div>
    </main>
  );
};

export default Offer;
