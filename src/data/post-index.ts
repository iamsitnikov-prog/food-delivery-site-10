/**
 * Лёгкий список статей блога: заголовок, рубрика, дата, время чтения.
 *
 * Текст статьи лежит отдельным файлом и подгружается только на её странице
 * через loadPost() — поэтому список блога и другие страницы больше не тянут
 * все статьи сразу.
 */
import type { BlogPost } from "./blog-types";
import INDEX from "./generated/post-index.json";

export type { PostBlock, BlogPost } from "./blog-types";

/** Краткая запись статьи — то, что показывает список блога. */
export type PostBrief = {
  slug: string;
  title: string;
  h1: string;
  lead: string;
  description: string;
  date: string;
  dateLabel: string;
  readTime: string;
  tag: string;
  isNew?: boolean;
  pinned?: boolean;
};

/** Статьи с будущей датой отфильтрует visiblePosts — здесь список полный,
 * иначе сломается предпросмотр черновиков. */
export const POST_INDEX = INDEX as PostBrief[];

/** Совместимость с прежним названием. */
export const BLOG_POSTS = POST_INDEX;

export const findPostBrief = (slug?: string) =>
  POST_INDEX.find((p) => p.slug === slug);

/** Полный текст одной статьи — отдельным файлом. */
export const loadPost = async (slug: string): Promise<BlogPost | null> => {
  if (!findPostBrief(slug)) return null;
  try {
    const mod = await import(`./generated/posts/${slug}.json`);
    return (mod.default ?? mod) as BlogPost;
  } catch {
    return null;
  }
};
