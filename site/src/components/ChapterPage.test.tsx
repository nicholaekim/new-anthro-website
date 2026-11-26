import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getChapter, person } from "@/content";
import { isSlot, slot, type Text } from "@/content/slot";
import type { Chapter } from "@/content/types";
import { ChapterPage } from "./ChapterPage";

const next = { href: "/chapters/sao-paulo", label: "Next chapter" };

function chapterCopy(slug: string): Chapter {
  const c = getChapter(slug);
  if (!c) throw new Error(`${slug} chapter missing`);
  return structuredClone(c);
}

function countSlots(value: unknown): number {
  if (Array.isArray(value)) return value.reduce((n: number, v) => n + countSlots(v), 0);
  if (value !== null && typeof value === "object") {
    if (isSlot(value as Text)) return 1;
    return Object.values(value).reduce((n: number, v) => n + countSlots(v), 0);
  }
  return 0;
}

function renderChapter(chapter: Chapter) {
  return render(<ChapterPage chapter={chapter} person={person} next={next} />);
}

describe("ChapterPage", () => {
  it("renders the eight beats in order, starting with place and date", () => {
    const { container } = renderChapter(chapterCopy("louisiana"));
    const beats = [...container.querySelectorAll("section[data-beat]")];
    expect(beats.map((b) => b.getAttribute("data-beat"))).toEqual(["1", "2", "3", "4", "5", "6", "7", "8"]);
    expect(beats.map((b) => b.id)).toEqual(["beat-1", "beat-2", "beat-3", "beat-4", "beat-5", "beat-6", "beat-7", "beat-8"]);
    for (const beat of beats) expect(beat.querySelector("h1, h2")).not.toBeNull();
    const firstHeading = container.querySelector("h1, h2, h3, h4, h5, h6");
    expect(firstHeading).toHaveTextContent("Louisiana");
    expect(firstHeading).toHaveTextContent("1930");
  });

  it("gives Tobique no outcome beat and no mark", () => {
    const { container } = renderChapter(chapterCopy("tobique"));
    expect(container.querySelector('[data-beat="5"]')).toBeNull();
    expect(container.querySelector("[data-mark]")).toBeNull();
  });

  it("renders a chapter with no basis, items, change of date or instrument", () => {
    const c = chapterCopy("louisiana");
    c.basis = null;
    c.items = [];
    c.changeOfDate = null;
    c.present.instrument = null;
    const { container } = renderChapter(c);
    expect(container.querySelector('[data-beat="4"]')).toBeNull();
    expect(container.querySelector('[data-beat="6"]')).toBeNull();
    const beat7 = container.querySelector('[data-beat="7"]');
    expect(beat7).not.toBeNull();
    expect(beat7?.querySelectorAll("[data-empty-mount]")).toHaveLength(1);
  });

  it("shows the gap note in the empty mount of an item without an image", () => {
    const c = chapterCopy("louisiana");
    c.items[0].image = null;
    c.items[0].gapNote = slot("fixture gap note");
    const { container } = renderChapter(c);
    const mounts = [...container.querySelectorAll("[data-empty-mount]")];
    expect(mounts.some((m) => m.textContent?.includes("fixture gap note"))).toBe(true);
  });

  it("shows a sensitive item closed, with its content note as the summary", () => {
    const c = chapterCopy("louisiana");
    c.items[0].contentNote = slot("fixture content note");
    const { container } = renderChapter(c);
    const item = container.querySelector(`#${c.items[0].id}`);
    const details = item?.querySelector("details");
    expect(details).not.toBeNull();
    expect(details).not.toHaveAttribute("open");
    expect(details?.querySelector(":scope > summary")).toHaveTextContent("fixture content note");
    expect(details).toHaveTextContent("your exact transcription");
  });

  it("server-renders both eras and one marked slot per slot in the content", () => {
    const c = chapterCopy("louisiana");
    const html = renderToString(<ChapterPage chapter={c} person={person} next={next} />);
    expect(html).toContain('data-era="historical"');
    expect(html).toContain('data-era="present"');
    const expected = countSlots(c) + countSlots(person);
    expect(expected).toBeGreaterThan(0);
    expect(html.match(/data-slot=/g)?.length ?? 0).toBe(expected);
  });

  it("gives every details summary an accessible name", () => {
    const c = chapterCopy("louisiana");
    c.items[0].contentNote = slot("fixture content note");
    const { container } = renderChapter(c);
    const summaries = [...container.querySelectorAll("details > summary")];
    expect(summaries.length).toBeGreaterThan(0);
    for (const s of summaries) expect(s.textContent?.trim()).not.toBe("");
  });
});
