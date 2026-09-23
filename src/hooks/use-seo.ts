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
};

const useSeo = ({ title, description, path, jsonLd }: Options) => {
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
    setLink("canonical", url);

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
      setLink("canonical", prevUrl);
    };
  }, [title, description, path, jsonLd]);
};

export default useSeo;