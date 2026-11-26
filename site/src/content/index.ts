import { johannesburg } from "./chapters/johannesburg";
import { louisiana } from "./chapters/louisiana";
import { saoPaulo } from "./chapters/sao-paulo";
import { tobique } from "./chapters/tobique";
import type { Chapter } from "./types";

export { person } from "./person";

export const chapters: readonly Chapter[] = [louisiana, saoPaulo, johannesburg, tobique];

export function getChapter(slug: string): Chapter | undefined {
  return chapters.find((c) => c.slug === slug);
}
