import type { BlogPost } from "@/data/blog-types";

export const PREVIEW_KEY = "draft";
export const PREVIEW_TOKEN = "pokazhi";

export const exitPreview = () => {
  try {
    sessionStorage.removeItem(PREVIEW_KEY);
  } catch {
    /* приватный режим */
  }
  window.location.href = "/blog";
};

export const isPreviewMode = (): boolean => {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  if (params.get(PREVIEW_KEY) === PREVIEW_TOKEN) {
    try {
      sessionStorage.setItem(PREVIEW_KEY, "1");
    } catch {
      /* приватный режим */
    }
    return true;
  }
  try {
    return sessionStorage.getItem(PREVIEW_KEY) === "1";
  } catch {
    return false;
  }
};

const today = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

export const isPublished = (post: Pick<BlogPost, "date">): boolean =>
  !post.date || post.date <= today();

export const isScheduled = (post: Pick<BlogPost, "date">): boolean => !isPublished(post);

export const visiblePosts = <T extends Pick<BlogPost, "date">>(posts: T[]): T[] =>
  isPreviewMode() ? posts : posts.filter(isPublished);

export const scheduledPosts = <T extends Pick<BlogPost, "date">>(posts: T[]): T[] =>
  posts.filter(isScheduled);

export const formatDate = (iso: string): string => {
  const [y, m, d] = iso.split("-");
  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];
  return `${Number(d)} ${months[Number(m) - 1]} ${y}`;
};

export const daysUntil = (iso: string): number => {
  const target = new Date(iso + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / 86400000);
};
