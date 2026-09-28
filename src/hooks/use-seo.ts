import { useEffect } from "react";

const SITE = "https://agregatory.pro";

const setMeta = (selector: string, attr: string, value: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    const [key, val] = selector.replace(/[[\]"]/g, "").split("=");
    el.setAttribute(key.replace("meta", ""), val);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
};

const setLink = (rel: string, href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

type Options = {
  title: string;
  description: string;
  path: string;
  jsonLd?: Record<string, unknown>[];
  /** Абсолютный URL картинки для соцсетей. По умолчанию — общий превью сайта. */
  ogImage?: string;
  /** "article" для блога, иначе "website". */
  ogType?: "website" | "article";
  publishedTime?: string;
  noindex?: boolean;
  /** Для 404: не ставить canonical на несуществующий адрес. */
  skipCanonical?: boolean;
};

const DEFAULT_OG = `${SITE}/og-preview.jpg?v=3`;

const useSeo = ({
  title,
  description,
  path,
  jsonLd,
  ogImage,
  ogType = "website",
  publishedTime,
  noindex,
  skipCanonical,
}: Options) => {
  useEffect(() => {
    const prevTitle = document.title;
    const prevDesc =
      document.head.querySelector<HTMLMetaElement>('meta[name="description"]')?.content || "";
    const prevUrl =
      document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href || `${SITE}/`;
    const url = `${SITE}${path}`;
    document.title = title;
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[property="og:image"]', "content", ogImage || DEFAULT_OG);
    setMeta('meta[property="og:type"]', "content", ogType);
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="twitter:image"]', "content", ogImage || DEFAULT_OG);
    setMeta('meta[name="robots"]', "content", noindex ? "noindex, follow" : "index, follow");
    if (publishedTime)
      setMeta('meta[property="article:published_time"]', "content", publishedTime);
    if (!skipCanonical) setLink("canonical", url);

    const nodes: HTMLScriptElement[] = [];
    (jsonLd || []).forEach((data) => {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.dataset.dynamic = "true";
      s.text = JSON.stringify(data);
      document.head.appendChild(s);
      nodes.push(s);
    });

    return () => {
      nodes.forEach((n) => n.remove());
      document.title = prevTitle;
      setMeta('meta[name="description"]', "content", prevDesc);
      setMeta('meta[property="og:title"]', "content", prevTitle);
      setMeta('meta[property="og:description"]', "content", prevDesc);
      setMeta('meta[property="og:url"]', "content", prevUrl);
      setMeta('meta[property="og:image"]', "content", DEFAULT_OG);
      setMeta('meta[property="og:type"]', "content", "website");
      setMeta('meta[name="twitter:title"]', "content", prevTitle);
      setMeta('meta[name="twitter:description"]', "content", prevDesc);
      setMeta('meta[name="twitter:image"]', "content", DEFAULT_OG);
      setMeta('meta[name="robots"]', "content", "index, follow");
      document.head
        .querySelector('meta[property="article:published_time"]')
        ?.remove();
      setLink("canonical", prevUrl);
    };
  }, [
    title,
    description,
    path,
    jsonLd,
    ogImage,
    ogType,
    publishedTime,
    noindex,
    skipCanonical,
  ]);
};

export default useSeo;