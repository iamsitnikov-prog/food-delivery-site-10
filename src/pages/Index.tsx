import Hero from "@/components/landing/Hero";
import Services from "@/components/landing/Services";
import Results from "@/components/landing/Results";
import Faq from "@/components/landing/Faq";
import LeadForm from "@/components/landing/LeadForm";
import Contacts from "@/components/landing/Contacts";

const Index = () => {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Hero />
      <Services />
      <Results />
      <Faq />
      <LeadForm />
      <Contacts />
    </main>
  );
};

export default Index;
