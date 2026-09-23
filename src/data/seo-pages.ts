import type { SeoPage } from "./seo-types";
import { SERVICE_PAGES } from "./seo-services";
import { CITY_PAGES } from "./seo-cities";

export type { Block, SeoPage } from "./seo-types";
export { SERVICE_PAGES } from "./seo-services";
export { CITY_PAGES } from "./seo-cities";

export const ALL_PAGES: SeoPage[] = [...SERVICE_PAGES, ...CITY_PAGES];

export const findPage = (slug?: string) => ALL_PAGES.find((p) => p.slug === slug);
