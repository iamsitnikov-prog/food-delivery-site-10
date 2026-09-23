import { useMemo } from "react";
import { Link, Navigate, useParams, useLocation } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Icon from "@/components/ui/icon";
import Header from "@/components/landing/Header";
import LeadForm from "@/components/landing/LeadForm";
import Contacts from "@/components/landing/Contacts";
import PostBody from "@/components/blog/PostBody";
import useSeo from "@/hooks/use-seo";
import { BLOG_POSTS, findPost } from "@/data/blog-posts";

const BlogPost = () => {
  const { slug } = useParams();
  const { pathname } = useLocation();
  const post = findPost(slug);

  const jsonLd = useMemo(() => {
    if (!post) return [];
    const url = `https://agregatory.pro${pathname}`;
    return [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.h1,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
        author: { "@type": "Organization", name: "agregatory.pro" },
        publisher: { "@type": "Organization", name: "agregatory.pro" },
        mainEntityOfPage: url,
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: "https://agregatory.pro/" },
          { "@type": "ListItem", position: 2, name: "Блог", item: "https://agregatory.pro/blog" },
          { "@type": "ListItem", position: 3, name: post.h1, item: url },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ];
  }, [post, pathname]);

  useSeo({ title: post?.title || "", description: post?.description || "", path: pathname, jsonLd });

  if (!post) return <Navigate to="/404" replace />;

  const rest = BLOG_POSTS.filter((p) => p.slug !== post.slug);
  const sameTag = rest.filter((p) => p.tag === post.tag);
  const others = [...sameTag, ...rest.filter((p) => p.tag !== post.tag)].slice(0, 4);

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <div id="top">
        <Header />

        <article className="mx-auto max-w-[1240px] px-5 pb-16 pt-12 md:px-14 md:pb-24 md:pt-16">
          <nav aria-label="Хлебные крошки" className="mb-8 flex items-center gap-2 text-[0.85em] text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              главная
            </Link>
            <Icon name="ChevronRight" size={14} />
            <Link to="/blog" className="hover:text-foreground">
              блог
            </Link>
          </nav>

          <div className="flex flex-wrap items-center gap-4 text-[0.85em] text-muted-foreground">
            <span className="rounded-lg bg-pale px-3 py-1.5 font-medium text-foreground">{post.tag}</span>
            <span>{post.dateLabel}</span>
            <span className="flex items-center gap-1.5">
              <Icon name="Clock" size={15} /> {post.readTime}
            </span>
          </div>

          <h1 className="mt-6 max-w-[20ch] font-display text-[38px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[60px]">
            {post.h1}
          </h1>
          <p className="mt-6 max-w-[760px] text-[1.15em] leading-snug text-muted-foreground">{post.lead}</p>

          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-20 lg:items-start">
            <PostBody blocks={post.blocks} slug={post.slug} />

            <aside className="order-first rounded-[28px] bg-pale p-6 lg:order-last lg:sticky lg:top-8">
              <h2 className="font-display text-[1.1em] font-semibold">содержание</h2>
              <ol className="mt-4 space-y-2.5 text-[0.9em] leading-snug">
                {post.toc.map((t, i) => (
                  <li key={t.id} className="flex gap-2.5">
                    <span className="text-foreground/40">{i + 1}.</span>
                    <a href={`#${t.id}`} className="text-foreground/75 transition-colors hover:text-foreground">
                      {t.label}
                    </a>
                  </li>
                ))}
              </ol>
              <a
                href="#lead"
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3.5 text-[0.95em] font-medium text-primary-foreground"
              >
                бесплатный анализ
              </a>
            </aside>
          </div>
        </article>
      </div>

      <section className="mx-auto max-w-[1240px] px-5 pb-16 md:px-14 md:pb-24">
        <h2 className="font-display text-[32px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[48px]">
          частые
          <span className="pl-3 text-muted-foreground">вопросы</span>
        </h2>
        <Accordion type="single" collapsible defaultValue="q-0" className="mt-8 border-t border-primary/25">
          {post.faq.map((f, i) => (
            <AccordionItem key={f.q} value={`q-${i}`} className="border-b border-primary/25">
              <AccordionTrigger className="py-6 text-left font-display text-[1.15em] font-semibold hover:no-underline md:text-[1.35em]">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="pb-6 leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 pb-16 md:px-14 md:pb-24">
        <h2 className="font-display text-[1.6em] font-semibold tracking-[-0.02em]">читайте также</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {others.map((o, i) => (
            <Link
              key={o.slug}
              to={`/blog/${o.slug}`}
              className={`group flex flex-col rounded-[28px] p-7 transition-transform duration-500 hover:-translate-y-1 ${
                i % 2 === 1 ? "bg-pale text-foreground" : "bg-surface text-cream"
              }`}
            >
              <h3 className="font-display text-[1.3em] font-semibold leading-tight tracking-[-0.02em]">{o.h1}</h3>
              <p className={`mt-3 flex-1 text-[0.93em] leading-relaxed ${i % 2 === 1 ? "text-foreground/75" : "text-cream-muted"}`}>
                {o.lead}
              </p>
              <span className={`mt-5 inline-flex items-center gap-2 text-[0.9em] font-medium ${i % 2 === 1 ? "text-foreground" : "text-brand"}`}>
                читать
                <Icon name="ArrowRight" size={17} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <LeadForm />
      <Contacts />
    </main>
  );
};

export default BlogPost;