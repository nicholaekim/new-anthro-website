import type { Chapter } from "@/content/types";
import type { TitleCard } from "@/motion/cover";

// card: what the cover between pages shows while it is closed (CoverProvider).
export type NavLink = { href: string; label: string; card: TitleCard };

export const OPENING_CARD: TitleCard = { kicker: null, title: "Opening", year: null };
export const ENDING_CARD: TitleCard = { kicker: null, title: "Ending", year: null };

export function chapterTitleCard(chapter: Pick<Chapter, "place" | "historicalYear">, number: number, count: number): TitleCard {
  return { kicker: `Chapter ${number} of ${count}`, title: chapter.place, year: chapter.historicalYear };
}

// The menu's six links, built on the server (in the root layout) so the client-side menu never
// imports the chapter content.
export function navLinks(chapters: readonly Chapter[]): NavLink[] {
  return [
    { href: "/", label: "Opening", card: OPENING_CARD },
    ...chapters.map((c, i) => ({
      href: `/chapters/${c.slug}`,
      label: `${c.place}, ${c.historicalYear} and ${c.presentYear}`,
      card: chapterTitleCard(c, i + 1, chapters.length),
    })),
    { href: "/ending", label: "Ending", card: ENDING_CARD },
  ];
}
