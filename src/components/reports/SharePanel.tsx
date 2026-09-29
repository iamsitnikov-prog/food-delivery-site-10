import Icon from "@/components/ui/icon";

const SharePanel = ({
  copied,
  onShare,
}: {
  copied: boolean;
  onShare: (where: "tg" | "wa" | "copy", anon: boolean) => void;
}) => (
  <div className="mt-6 rounded-2xl bg-cream/[0.08] p-4 md:p-5">
    <h3 className="flex items-center gap-2 font-display text-[1.1em] font-semibold">
      <Icon name="Share2" size={17} className="text-brand" />
      отправить разбор
    </h3>
    <p className="mt-2 text-[max(12px,0.88em)] leading-snug text-cream-muted">
      Отправится текстовая сводка: оборот, фактическая нагрузка и позиции,
      требующие проверки. Сам файл отчёта не передаётся.
    </p>

    <div className="mt-4 grid gap-3 md:grid-cols-2">
      <div className="rounded-xl bg-cream/[0.06] p-4">
        <span className="text-[max(12px,0.85em)] font-medium text-cream">
          С названием компании
        </span>
        <p className="mt-1 text-[max(12px,0.8em)] leading-snug text-cream-muted">
          Для бухгалтера или управляющего
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onShare("tg", false)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-[max(12px,0.85em)] font-medium text-foreground"
          >
            <Icon name="Send" size={14} />
            Telegram
          </button>
          <button
            type="button"
            onClick={() => onShare("wa", false)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-cream/25 px-3 py-2 text-[max(12px,0.85em)] transition-colors hover:border-cream/60"
          >
            <Icon name="MessageCircle" size={14} />
            WhatsApp
          </button>
          <button
            type="button"
            onClick={() => onShare("copy", false)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-cream/25 px-3 py-2 text-[max(12px,0.85em)] transition-colors hover:border-cream/60"
          >
            <Icon name={copied ? "Check" : "Copy"} size={14} />
            {copied ? "скопировано" : "копировать"}
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-cream/[0.06] p-4">
        <span className="text-[max(12px,0.85em)] font-medium text-cream">
          Без названия компании
        </span>
        <p className="mt-1 text-[max(12px,0.8em)] leading-snug text-cream-muted">
          Для чатов и коллег — только цифры
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onShare("tg", true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-[max(12px,0.85em)] font-medium text-foreground"
          >
            <Icon name="Send" size={14} />
            Telegram
          </button>
          <button
            type="button"
            onClick={() => onShare("wa", true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-cream/25 px-3 py-2 text-[max(12px,0.85em)] transition-colors hover:border-cream/60"
          >
            <Icon name="MessageCircle" size={14} />
            WhatsApp
          </button>
          <button
            type="button"
            onClick={() => onShare("copy", true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-cream/25 px-3 py-2 text-[max(12px,0.85em)] transition-colors hover:border-cream/60"
          >
            <Icon name={copied ? "Check" : "Copy"} size={14} />
            {copied ? "скопировано" : "копировать"}
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default SharePanel;
