import { HOME_FAQ as FAQ } from "@/data/home";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import useReveal from "@/hooks/use-reveal";


const Faq = () => {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="faq" ref={ref} className="scroll-mt-4 px-5 py-10 md:px-14 md:py-28">
      <div className="grid gap-6 md:gap-10 lg:grid-cols-[380px_1fr]">
        <div className="reveal">
          <h2 className="font-display text-[24px] font-semibold leading-[.92] tracking-[-0.035em] md:text-[64px]">
            вопросы
            <span className="block pl-[1.2em] text-muted-foreground">и&nbsp;ответы</span>
          </h2>
          <p className="mt-6 max-w-[320px] leading-snug">
            Не нашли свой вопрос? Задайте его на&nbsp;консультации — это бесплатно.
          </p>
        </div>
        <Accordion type="single" collapsible defaultValue="item-0" className="reveal border-t border-primary/25">
          {FAQ.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`} className="border-b border-primary/25">
              <AccordionTrigger className="py-6 text-left font-display text-[1.2em] font-semibold tracking-[-0.01em] hover:no-underline md:text-[1.45em]">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="max-w-[640px] pb-6 text-[1em] leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default Faq;