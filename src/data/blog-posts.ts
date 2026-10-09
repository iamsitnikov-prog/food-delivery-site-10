import type { BlogPost } from "./blog-types";
import { BASE_POSTS } from "./posts/base";
import { CORE_POSTS } from "./posts/core";
import { DELIVERY_POSTS } from "./posts/delivery";
import { CONTENT_POSTS } from "./posts/content";
import { ECONOMY_POSTS } from "./posts/economy";
import { GROWTH_POSTS } from "./posts/growth";
import { EXTRA_POSTS } from "./posts/extra";
import { RULES_POSTS } from "./posts/rules";
import { FRESH_POSTS } from "./posts/fresh";
import { SETUP_POSTS } from "./posts/setup";
import { FINANCE_POSTS } from "./posts/finance";
import { OFERTA_POSTS } from "./posts/oferta";
import { PLANNED_POSTS } from "./posts/planned";
import { OCTOBER_POSTS } from "./posts/october";

export type { PostBlock, BlogPost } from "./blog-types";

export const BLOG_POSTS: BlogPost[] = [
  ...OCTOBER_POSTS,
  ...PLANNED_POSTS,
  ...OFERTA_POSTS,
  ...FRESH_POSTS,
  ...CORE_POSTS,
  ...BASE_POSTS,
  ...SETUP_POSTS,
  ...RULES_POSTS,
  ...DELIVERY_POSTS,
  ...CONTENT_POSTS,
  ...ECONOMY_POSTS,
  ...FINANCE_POSTS,
  ...GROWTH_POSTS,
  ...EXTRA_POSTS,
];

export const findPost = (slug?: string) => BLOG_POSTS.find((p) => p.slug === slug);