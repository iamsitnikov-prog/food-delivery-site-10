import { useEffect, useRef, useState } from "react";

type Props = {
  value: string;
  className?: string;
  duration?: number;
};

const parse = (v: string) => {
  const m = v.match(/-?[\d\s.,]+/);
  if (!m) return null;
  const raw = m[0];
  const num = parseFloat(raw.replace(/\s/g, "").replace(",", "."));
  if (Number.isNaN(num)) return null;
  const decimals = (raw.replace(/\s/g, "").split(/[.,]/)[1] || "").length;
  const sep = raw.includes(",") ? "," : ".";
  const grouped = /\d\s\d/.test(raw);
  return {
    num,
    decimals,
    sep,
    grouped,
    prefix: v.slice(0, m.index),
    suffix: v.slice((m.index ?? 0) + raw.length),
  };
};

const format = (n: number, decimals: number, sep: string, grouped: boolean) => {
  let s = n.toFixed(decimals);
  if (decimals) s = s.replace(".", sep);
  if (grouped) {
    const [int, frac] = s.split(sep);
    s = int.replace(/\B(?=(\d{3})+(?!\d))/g, " ") + (frac ? sep + frac : "");
  }
  return s;
};

const CountUp = ({ value, className, duration = 1600 }: Props) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(() => {
    const p = parse(value);
    if (!p) return value;
    return p.prefix + format(0, p.decimals, p.sep, p.grouped) + p.suffix;
  });

  useEffect(() => {
    const node = ref.current;
    const p = parse(value);
    if (!node || !p) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(value);
      return;
    }

    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setText(p.prefix + format(p.num * eased, p.decimals, p.sep, p.grouped) + p.suffix);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(node);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {text}
    </span>
  );
};

export default CountUp;
