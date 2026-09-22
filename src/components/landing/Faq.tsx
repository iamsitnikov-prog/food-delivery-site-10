import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import useReveal from "@/hooks/use-reveal";

const FAQ = [
  {
    q: "С какими агрегаторами вы работаете?",
    a: "В первую очередь с Яндекс Едой и Деливери — это основной объём заказов. По запросу подключаем и другие площадки, если они есть в вашем городе.",
  },
  {
    q: "Сколько времени занимает подключение?",
    a: "Обычно от 7 до 14 дней: аудит и подготовка меню — несколько дней, дальше зависит от скорости модерации самой площадки.",
  },
  {
    q: "Нужно ли мне что-то делать самому?",
    a: "Только прислать документы и ответить на пару вопросов о кухне. Фото, тексты, настройку и переписку с площадками мы берём на себя.",
  },
  {
    q: "Сколько стоят ваши услуги?",
    a: "Зависит от количества точек и объёма работ. Консультация и первичный аудит — бесплатно, после них называем точную стоимость без скрытых платежей.",
  },
  {
    q: "Я уже работаю в агрегаторе. Вы поможете?",
    a: "Да, это частый случай. Проводим аудит текущей карточки, находим, где теряются заказы, и берём продвижение на себя.",
  },
  {
    q: "Как я пойму, что продвижение работает?",
    a: "Каждый месяц присылаем отчёт: заказы, выручка, средний чек, расходы на рекламу. Все цифры можно проверить в вашем кабинете агрегатора.",
  },
];

const Faq = () => {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="faq" ref={ref} className="scroll-mt-4 px-5 py-20 md:px-14 md:py-28">
      <div className="grid gap-10 lg:grid-cols-[380px_1fr]">
        <div className="reveal">
          <h2 className="font-display text-[44px] font-semibold leading-[.92] tracking-[-0.035em] md:text-[64px]">
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
