import Hero from "@/components/landing/Hero";
import Services from "@/components/landing/Services";
import Advantages from "@/components/landing/Advantages";
import Results from "@/components/landing/Results";
import Pricing from "@/components/landing/Pricing";
import Extra from "@/components/landing/Extra";
import FreeAudit from "@/components/landing/FreeAudit";
import QuizTeaser from "@/components/landing/QuizTeaser";
import CalcTeaser from "@/components/landing/CalcTeaser";
import ReportsTeaser from "@/components/landing/ReportsTeaser";
import Guarantees from "@/components/landing/Guarantees";
import AfterLaunch from "@/components/landing/AfterLaunch";
import StickyCta from "@/components/landing/StickyCta";
import Team from "@/components/landing/Team";
import ChecklistTeaser from "@/components/landing/ChecklistTeaser";
import Reviews from "@/components/landing/Reviews";
import Faq from "@/components/landing/Faq";
import LeadForm from "@/components/landing/LeadForm";
import Contacts from "@/components/landing/Contacts";

const Index = () => {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Hero />
      <Services />
      <Advantages />
      <Guarantees />
      <Results />
      <Pricing />
      <Extra />
      <AfterLaunch />
      <FreeAudit />
      <Team />
      <Reviews />
      <QuizTeaser />
      <ReportsTeaser />
      <CalcTeaser />
      <ChecklistTeaser />
      <Faq />
      <LeadForm />
      <Contacts />
      <StickyCta />
    </main>
  );
};

export default Index;