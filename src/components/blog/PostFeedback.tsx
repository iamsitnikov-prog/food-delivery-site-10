import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { reachGoal } from "@/lib/metrika";

const API = "https://functions.poehali.dev/5384928e-d232-4529-9e00-cfdcc6458060";
const TELEGRAM = "https://t.me/sitnikovy1";
const WHATSAPP = "https://wa.me/79310028222";

const PostFeedback = ({ slug, title }: { slug: string; title: string }) => {
  const [likes, setLikes] = useState<number | null>(null);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    setVoted(localStorage.getItem(`liked:${slug}`) === "1");
    fetch(`${API}?slugs=${slug}`)
      .then((r) => r.json())
      .then((d) => setLikes(d?.likes?.[slug] ?? 0))
      .catch(() => setLikes(null));
  }, [slug]);

  const like = () => {
    if (voted) return;
    setVoted(true);
    setLikes((v) => (v ?? 0) + 1);
    localStorage.setItem(`liked:${slug}`, "1");
    reachGoal("post_like", { slug });
    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    })
      .then((r) => r.json())
      .then((d) => typeof d?.likes === "number" && setLikes(d.likes))
      .catch(() => undefined);
  };

  const url = typeof window !== "undefined" ? window.location.href : "";
  const share = (net: "tg" | "wa") => {
    reachGoal("post_share", { net, slug });
    const text = encodeURIComponent(`${title} — ${url}`);
    window.open(
      net === "tg"
        ? `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
        : `https://wa.me/?text=${text}`,
      "_blank",
      "noopener",
    );
  };

  return (
    <div className="mt-8 md:mt-14 space-y-4">
      <div className="flex flex-col gap-5 rounded-[28px] border-2 border-primary/25 p-4 md:flex-row md:items-center md:justify-between md:p-7">
        <button
          onClick={like}
          disabled={voted}
          className={`inline-flex w-fit items-center gap-3 rounded-xl px-6 py-3.5 font-medium transition-all ${
            voted
              ? "cursor-default bg-primary text-primary-foreground"
              : "bg-pale text-foreground hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"
          }`}
        >
          <Icon name={voted ? "Check" : "Star"} size={19} />
          {voted ? "спасибо за отзыв" : "статья полезна"}
          {likes !== null && likes > 0 && (
            <span className={voted ? "text-primary-foreground/60" : "text-foreground/45"}>{likes}</span>
          )}
        </button>

        <div className="flex items-center gap-3">
          <span className="text-[max(12px,0.9em)] text-muted-foreground">поделиться</span>
          <button
            onClick={() => share("tg")}
            aria-label="Поделиться в Telegram"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <Icon name="Send" size={18} />
          </button>
          <button
            onClick={() => share("wa")}
            aria-label="Поделиться в WhatsApp"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <Icon name="MessageCircle" size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-5 rounded-[28px] bg-surface p-4 text-cream md:flex-row md:items-center md:justify-between md:p-9">
        <div>
          <h2 className="font-display text-[1.35em] font-semibold leading-tight tracking-[-0.02em] md:text-[1.7em]">
            Остались вопросы по вашему заведению?
          </h2>
          <p className="mt-3 max-w-[520px] text-[0.95em] leading-relaxed text-cream-muted">
            Напишите нам&nbsp;— разберём вашу ситуацию и&nbsp;подскажем, с&nbsp;чего начать именно в&nbsp;вашем случае.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <a
            href={TELEGRAM}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => reachGoal("post_contact", { net: "tg" })}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3.5 font-medium text-foreground transition-transform hover:-translate-y-0.5"
          >
            <Icon name="Send" size={18} />
            телеграм
          </a>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => reachGoal("post_contact", { net: "wa" })}
            className="inline-flex items-center gap-2 rounded-xl border border-cream/30 px-5 py-3.5 font-medium transition-colors hover:bg-brand hover:text-foreground"
          >
            <Icon name="MessageCircle" size={18} />
            whatsapp
          </a>
        </div>
      </div>
    </div>
  );
};

export default PostFeedback;