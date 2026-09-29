import Icon from "@/components/ui/icon";
import { READ_CHANNELS } from "@/data/channels";
import { reachGoal } from "@/lib/metrika";

type Props = {
  title?: string;
  lead?: string;
  source: string;
  variant?: "dark" | "light";
};

const ChannelsBlock = ({
  title = "Пишем о доставке каждый день",
  lead = "Разбираем обновления сервисов, механики акций и реальные цифры из проектов. Подпишитесь, чтобы не пропустить изменения, которые влияют на ваши деньги.",
  source,
  variant = "dark",
}: Props) => {
  const isDark = variant === "dark";

  return (
    <div
      className={`rounded-[28px] p-6 md:p-8 ${isDark ? "bg-surface text-cream" : "bg-cream/[0.06] text-cream"}`}
    >
      <h3 className="font-display text-[1.3em] font-semibold leading-tight tracking-[-0.02em] md:text-[1.55em]">
        {title}
      </h3>
      <p
        className={`mt-2 max-w-[640px] leading-relaxed ${isDark ? "text-cream-muted" : "text-cream-muted"}`}
      >
        {lead}
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {READ_CHANNELS.map((c) => (
          <a
            key={c.id}
            href={c.href}
            target="_blank"
            rel="noreferrer"
            onClick={() => reachGoal("channel_click", { channel: c.id, source })}
            className="group flex flex-col rounded-2xl border border-cream/15 p-4 md:p-5 transition-colors hover:border-brand hover:bg-brand/10"
          >
            <div className="flex items-center gap-3">
              {c.photo && (
                <img
                  src={c.photo}
                  alt={c.author}
                  width={44}
                  height={44}
                  loading="lazy"
                  className="h-11 w-11 shrink-0 rounded-full object-cover"
                />
              )}
              <span className="min-w-0">
                <span className="flex items-center gap-1.5">
                  <Icon name={c.icon} size={15} className="shrink-0 text-brand" />
                  <span className="font-display text-[1.05em] font-semibold">{c.label}</span>
                </span>
                <span className="mt-0.5 block text-[max(12px,0.8em)] text-cream-muted">{c.handle}</span>
              </span>
            </div>
            <span className="mt-3 text-[max(12px,0.9em)] leading-snug text-cream-muted">{c.short}</span>
            <span className="mt-4 inline-flex items-center gap-1.5 text-[max(12px,0.88em)] font-medium text-brand">
              открыть
              <Icon name="ArrowUpRight" size={15} />
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ChannelsBlock;