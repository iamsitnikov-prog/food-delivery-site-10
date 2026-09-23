import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Header from "@/components/landing/Header";
import LeadForm from "@/components/landing/LeadForm";
import Contacts from "@/components/landing/Contacts";
import useSeo from "@/hooks/use-seo";
import { BLOG_POSTS } from "@/data/blog-posts";
import { BLOG_GROUPS } from "@/data/blog-groups";

const Blog = () => {
  const { pathname } = useLocation();
  const [group, setGroup] = useState<string | null>(null);

  const sorted = useMemo(() => [...BLOG_POSTS].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew)), []);

  const posts = useMemo(() => {
    if (!group) return sorted;
    const tags = BLOG_GROUPS.find((g) => g.id === group)?.tags ?? [];
    return sorted.filter((p) => tags.includes(p.tag));
  }, [group, sorted]);

  useSeo({
    title: "Блог о работе ресторана с агрегаторами доставки — agregatory.pro",
    description:
      "Разборы для рестораторов: как поднять рейтинг на Яндекс Еде, почему нет заказов, сколько стоит продвижение. На основе официальной справки сервиса и нашей практики.",
    path: pathname,
  });

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <div id="top">
        <Header />
        <section className="px-5 pb-14 pt-12 md:px-14 md:pb-20 md:pt-16">
          <nav aria-label="Хлебные крошки" className="mb-8 flex items-center gap-2 text-[0.85em] text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              главная
            </Link>
            <Icon name="ChevronRight" size={14} />
            <span className="text-foreground">блог</span>
          </nav>
          <h1 className="max-w-[16ch] font-display text-[40px] font-semibold leading-[.95] tracking-[-0.035em] md:text-[68px]">
            Разборы для рестораторов
          </h1>
          <p className="mt-6 max-w-[600px] text-[1.1em] leading-snug text-muted-foreground">
            Подробные материалы о&nbsp;работе с&nbsp;агрегаторами доставки: на&nbsp;основе официальной справки сервиса и&nbsp;нашей практики с&nbsp;ресторанами по&nbsp;всей России.
          </p>
        </section>
      </div>

      <section className="px-5 pb-16 md:px-14 md:pb-24">
        <div className="mb-10 flex flex-wrap gap-2">
          <button
            onClick={() => setGroup(null)}
            className={`rounded-xl px-4 py-2.5 text-[0.9em] transition-colors ${
              group === null ? "bg-primary text-primary-foreground" : "border border-primary/30 hover:bg-pale"
            }`}
          >
            все материалы
            <span className={group === null ? "pl-2 text-primary-foreground/50" : "pl-2 text-muted-foreground"}>
              {BLOG_POSTS.length}
            </span>
          </button>
          {BLOG_GROUPS.map((g) => {
            const count = BLOG_POSTS.filter((p) => g.tags.includes(p.tag)).length;
            const active = group === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setGroup(g.id)}
                className={`inline-flex items-center rounded-xl px-4 py-2.5 text-[0.9em] transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "border border-primary/30 hover:bg-pale"
                }`}
              >
                {g.label}
                {g.isNew && (
                  <span
                    className={`ml-2.5 rounded-md px-2 py-0.5 text-[0.75em] font-medium uppercase tracking-wide ${
                      active ? "bg-brand text-foreground" : "bg-foreground text-brand"
                    }`}
                  >
                    новое
                  </span>
                )}
                <span className={active ? "pl-2 text-primary-foreground/50" : "pl-2 text-muted-foreground"}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className={`group flex flex-col rounded-[28px] p-7 transition-transform duration-500 hover:-translate-y-1 md:p-8 ${
                i % 2 === 1 ? "bg-pale text-foreground" : "bg-surface text-cream"
              }`}
            >
              <div className="flex flex-wrap items-center gap-3 text-[0.82em]">
                <span
                  className={`rounded-lg px-3 py-1.5 font-medium ${
                    i % 2 === 1 ? "bg-foreground text-brand" : "bg-brand text-foreground"
                  }`}
                >
                  {post.tag}
                </span>
                {post.isNew && (
                  <span className="rounded-lg bg-brand px-3 py-1.5 font-medium uppercase tracking-wide text-foreground">
                    новое
                  </span>
                )}
                <span className={i % 2 === 1 ? "text-foreground/60" : "text-cream-muted"}>{post.readTime}</span>
              </div>

              <h2 className="mt-6 font-display text-[1.45em] font-semibold leading-[1.05] tracking-[-0.025em]">
                {post.h1}
              </h2>
              <p className={`mt-4 flex-1 text-[0.95em] leading-relaxed ${i % 2 === 1 ? "text-foreground/75" : "text-cream-muted"}`}>
                {post.lead}
              </p>

              <span
                className={`mt-7 inline-flex items-center gap-2 text-[0.92em] font-medium ${
                  i % 2 === 1 ? "text-foreground" : "text-brand"
                }`}
              >
                читать статью
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

export default Blog;