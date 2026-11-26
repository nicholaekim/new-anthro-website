import type { Chapter } from "@/content/types";

export type NavLink = { href: string; label: string };

// The menu's six links, built on the server (in the root layout) so the client-side menu never
// imports the chapter content.
export function navLinks(chapters: readonly Chapter[]): NavLink[] {
  return [
    { href: "/", label: "Opening" },
    ...chapters.map((c) => ({ href: `/chapters/${c.slug}`, label: `${c.place}, ${c.historicalYear} and ${c.presentYear}` })),
    { href: "/ending", label: "Ending" },
  ];
}
