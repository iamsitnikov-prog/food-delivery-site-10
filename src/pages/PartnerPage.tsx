import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/landing/Header";
import LeadForm from "@/components/landing/LeadForm";
import Contacts from "@/components/landing/Contacts";
import PartnerProfile from "@/components/PartnerProfile";
import useSeo from "@/hooks/use-seo";
import { getPartner, getSection } from "@/data/partners";
import NotFound from "./PageNotFound";

const PartnerPage = () => {
  const { slug = "" } = useParams();
  const { pathname } = useLocation();
  const p = getPartner(slug);
  // Ссылка-визитка /partnery/slug?v: специалист отправляет её своим клиентам.
  // Без шапки сайта, других партнёров и нашей формы. Включаем после загрузки, чтобы не спорить с готовой разметкой.
  const [clean, setClean] = useState(false);
  useEffect(() => {
    setClean(new URLSearchParams(window.location.search).has("v"));
  }, []);

  useSeo({
    title: p ? `${p.name}: ${getSection(p.section).title.toLowerCase()} | agregatory.pro` : "Партнёр не найден | agregatory.pro",
    description: p ? `${p.description.slice(0, 150)}` : "",
    path: pathname,
    noindex: !p,
  });

  if (!p) return <NotFound />;

  if (clean)
    return (
      <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
        <PartnerProfile p={p} clean />
        <footer className="px-5 pb-8 text-center text-[max(12px,0.8em)] text-foreground/50 md:px-14">
          страница на{" "}
          <a href="https://agregatory.pro" className="underline underline-offset-4">
            agregatory.pro
          </a>
        </footer>
      </main>
    );

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Header />
      <PartnerProfile p={p} />
      <LeadForm />
      <Contacts />
    </main>
  );
};

export default PartnerPage;
