import type { ReactNode } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type Item = { q: string; a: ReactNode };

/**
 * Блок «частые вопросы» во всю ширину страницы.
 *
 * На десктопе заголовок и подсказка стоят слева, вопросы — справа, как на
 * главной. Раньше вопросы шли узкой колонкой по центру, и на широких экранах
 * по бокам оставались большие пустые поля.
 */
const FaqSection = ({
  items,
  title = ["частые", "вопросы"],
  note,
  id,
}: {
  items: Item[];
  title?: [string, string];
  note?: ReactNode;
  id?: string;
}) => {
  if (!items.length) return null;

  return (
    <section id={id} className="scroll-mt-6 px-5 pb-11 md:px-14 md:pb-24">
      <div className="grid gap-6 md:gap-10 lg:grid-cols-[minmax(280px,4fr)_minmax(0,8fr)] lg:gap-16 xl:gap-24">
        <div className="lg:sticky lg:top-8 lg:self-start">
          <h2 className="font-display text-[27px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[48px]">
            {title[0]}
            <span className="pl-3 text-muted-foreground max-sm:pl-0 max-sm:before:content-['_'] lg:block lg:pl-[1.2em]">
              {title[1]}
            </span>
          </h2>
          <div className="mt-5 max-w-[340px] leading-snug text-muted-foreground max-lg:hidden">
            {note ?? (
              <>
                Не нашли свой вопрос? Задайте его, когда оставите заявку на&nbsp;
                <a href="#lead" className="text-foreground underline decoration-foreground/40 underline-offset-4 hover:decoration-foreground">
                  бесплатный анализ
                </a>
                .
              </>
            )}
          </div>
        </div>

        <Accordion type="single" collapsible defaultValue="q-0" className="border-t border-primary/25">
          {items.map((f, i) => (
            <AccordionItem key={f.q} value={`q-${i}`} className="border-b border-primary/25">
              <AccordionTrigger className="py-6 text-left font-display text-[1.15em] font-semibold hover:no-underline md:text-[1.35em]">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="max-w-[760px] pb-6 leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FaqSection;
