import { describe, expect, it } from "vitest";
import { fixtureChapters } from "@/test/fixtures";
import { chapterTitleCard, ENDING_CARD, navLinks, OPENING_CARD } from "./navLinks";

describe("title cards", () => {
  it("name a chapter by its number, place and historical year", () => {
    const chapters = fixtureChapters();
    expect(chapterTitleCard(chapters[1], 2, 4)).toEqual({
      kicker: "Chapter 2 of 4",
      title: chapters[1].place,
      year: chapters[1].historicalYear,
    });
  });

  it("go with every menu link: the opening, each chapter in order, the ending", () => {
    const chapters = fixtureChapters();
    const links = navLinks(chapters);
    expect(links[0].card).toEqual(OPENING_CARD);
    chapters.forEach((c, i) => expect(links[i + 1].card).toEqual(chapterTitleCard(c, i + 1, chapters.length)));
    expect(links.at(-1)?.card).toEqual(ENDING_CARD);
    expect(OPENING_CARD).toEqual({ kicker: null, title: "Opening", year: null });
    expect(ENDING_CARD).toEqual({ kicker: null, title: "Ending", year: null });
  });
});
