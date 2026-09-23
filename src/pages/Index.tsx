import Hero from "@/components/landing/Hero";
import Services from "@/components/landing/Services";
import Advantages from "@/components/landing/Advantages";
import Results from "@/components/landing/Results";
import Pricing from "@/components/landing/Pricing";
import Extra from "@/components/landing/Extra";
import FreeAudit from "@/components/landing/FreeAudit";
import Guarantees from "@/components/landing/Guarantees";
import AfterLaunch from "@/components/landing/AfterLaunch";
import StickyCta from "@/components/landing/StickyCta";
import Team from "@/components/landing/Team";
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
      <Faq />
      <LeadForm />
      <Contacts />
      <StickyCta />
    </main>
  );
};

export default Index;