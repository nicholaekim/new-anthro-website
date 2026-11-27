import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { slot } from "@/content/slot";
import type { Chapter } from "@/content/types";
import { countSlots, fixtureChapter, fixturePerson } from "@/test/fixtures";
import { ChapterPage } from "./ChapterPage";

const next = { href: "/chapters/fixture-2", label: "Next chapter" };
const person = fixturePerson();

// Beat 6 repeats, for each era, the instrument's title and the rule with its citation, so it can
// compare them side by side; every other slot is shown once.
function beat6Repeats(c: Chapter): number {
  const historical = c.items.find((i) => i.id === c.changeOfDate?.historicalItemId);
  return countSlots([
    historical?.provenance.title,
    c.present.instrument?.provenance.title,
    c.basis?.quote,
    c.basis?.citation,
    c.present.basis?.quote,
    c.present.basis?.citation,
  ]);
}

function renderChapter(chapter: Chapter) {
  return render(<ChapterPage chapter={chapter} person={person} next={next} />);
}

describe("ChapterPage", () => {
  it("renders the eight beats in order, starting with place and date", () => {
    const c = fixtureChapter();
    const { container } = renderChapter(c);
    const beats = [...container.querySelectorAll("section[data-beat]")];
    expect(beats.map((b) => b.getAttribute("data-beat"))).toEqual(["1", "2", "3", "4", "5", "6", "7", "8"]);
    expect(beats.map((b) => b.id)).toEqual(["beat-1", "beat-2", "beat-3", "beat-4", "beat-5", "beat-6", "beat-7", "beat-8"]);
    for (const beat of beats) expect(beat.querySelector("h1, h2")).not.toBeNull();
    const firstHeading = container.querySelector("h1, h2, h3, h4, h5, h6");
    expect(firstHeading).toHaveTextContent(c.place);
    expect(firstHeading).toHaveTextContent(String(c.historicalYear));
  });

  it("gives a chapter without an outcome no outcome beat and no mark", () => {
    const { container } = renderChapter(fixtureChapter(1, { withOutcome: false }));
    expect(container.querySelector('[data-beat="5"]')).toBeNull();
    expect(container.querySelector("[data-mark]")).toBeNull();
  });

  it("renders a chapter with no basis, items, change of date or instrument", () => {
    const c = fixtureChapter();
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
    const c = fixtureChapter();
    c.items[0].gapNote = slot("fixture gap note");
    const { container } = renderChapter(c);
    const mount = container.querySelector(`#${c.items[0].id} [data-empty-mount]`);
    expect(mount).toHaveTextContent("fixture gap note");
    expect(mount).not.toHaveTextContent("No image");
  });

  it('shows "No image" in the empty mount of an item without an image or a gap note', () => {
    const c = fixtureChapter();
    const { container } = renderChapter(c);
    expect(container.querySelector(`#${c.items[0].id} [data-empty-mount]`)).toHaveTextContent("No image");
  });

  it("shows a sensitive item closed, with its content note as the summary", () => {
    const c = fixtureChapter();
    c.items[0].contentNote = slot("fixture content note");
    const { container } = renderChapter(c);
    const item = container.querySelector(`#${c.items[0].id}`);
    const details = item?.querySelector("details");
    expect(details).not.toBeNull();
    expect(details).not.toHaveAttribute("open");
    expect(details?.querySelector(":scope > summary")).toHaveTextContent("fixture content note");
    expect(details).toHaveTextContent("fixture transcription");
  });

  it("server-renders both eras and one marked slot per slot in the content, plus beat 6's repeats", () => {
    const c = fixtureChapter();
    const html = renderToString(<ChapterPage chapter={c} person={person} next={next} />);
    expect(html).toContain('data-era="historical"');
    expect(html).toContain('data-era="present"');
    expect(html.match(/data-slot=/g)?.length ?? 0).toBe(countSlots(c) + countSlots(person) + beat6Repeats(c));
  });

  it("gives every details summary an accessible name", () => {
    const c = fixtureChapter();
    c.items[0].contentNote = slot("fixture content note");
    const { container } = renderChapter(c);
    const summaries = [...container.querySelectorAll("details > summary")];
    expect(summaries.length).toBeGreaterThan(0);
    for (const s of summaries) expect(s.textContent?.trim()).not.toBe("");
  });

  it("lists the person-card facts a basis uses as plain text, not as links", () => {
    const c = fixtureChapter();
    if (!c.basis) throw new Error("fixture needs a basis");
    c.basis.cardFactsUsed = ["fact-1"];
    const { container } = renderChapter(c);
    const beat4 = container.querySelector('[data-beat="4"]');
    expect(beat4).toHaveTextContent("Person-card facts used:");
    expect(beat4).toHaveTextContent("fixture fact 1 label");
    expect(beat4?.querySelector('a[href^="#person-"]')).toBeNull();
  });

  it("shows the person card, with its button and its column, when the chapter shows it", () => {
    const { container } = renderChapter(fixtureChapter());
    expect(container.querySelector("[data-person-card]")).not.toBeNull();
    expect(container.querySelector('button[popovertarget="person-card-panel"]')).not.toBeNull();
    expect(container.querySelector("[data-chapter]")?.className).toMatch(/lg:grid-cols-/);
  });

  it("shows no person card at any width, and no facts in beat 4, when the chapter does not show it", () => {
    const c = fixtureChapter(1, { showPersonCard: false });
    // Even if a basis names a fact (the content check reports that), none is listed.
    if (!c.basis) throw new Error("fixture needs a basis");
    c.basis.cardFactsUsed = ["fact-1"];
    const { container } = renderChapter(c);
    expect(container.querySelector("[data-person-card]")).toBeNull();
    expect(container.querySelector("[popovertarget]")).toBeNull();
    expect(container.querySelector("#person-card-heading")).toBeNull();
    expect(container.querySelector("[data-chapter]")?.className).not.toMatch(/lg:grid-cols-/);
    expect(container.querySelector("main")?.className ?? "").not.toMatch(/lg:col-start-2/);
    expect(container.querySelector('[data-beat="4"]')).not.toHaveTextContent("Person-card facts used:");
    // Every slot shown is the chapter's own.
    const html = renderToString(<ChapterPage chapter={c} person={person} next={next} />);
    expect(html.match(/data-slot=/g)?.length ?? 0).toBe(countSlots(c) + beat6Repeats(c));
  });

  it("shows a translated quotation and transcription as labelled original and translation in beats 3, 4, 6 and 7", () => {
    const c = fixtureChapter();
    c.items[0].translation = slot("fixture item translation");
    c.present.instrument!.translation = slot("fixture instrument translation");
    if (c.basis) c.basis.quoteTranslation = slot("fixture quote translation");
    if (c.present.basis) c.present.basis.quoteTranslation = slot("fixture present quote translation");
    const { container } = renderChapter(c);
    const pairsIn = (selector: string) =>
      [...container.querySelectorAll(selector)].map((p) => [p.getAttribute("data-language-part"), p.textContent]);
    const beat = (n: number) => `section[data-beat="${n}"] [data-language-part]`;
    expect(pairsIn(beat(3))).toEqual([
      ["original", "Original[fixture transcription]"],
      ["translation", "English translation[fixture item translation]"],
    ]);
    expect(pairsIn(beat(4))).toEqual([
      ["original", "Original[fixture quote]"],
      ["translation", "English translation[fixture quote translation]"],
    ]);
    // Beat 6: each era’s rule, original and translation.
    expect(pairsIn(beat(6)).map(([, t]) => t)).toEqual([
      "Original[fixture quote]",
      "English translation[fixture quote translation]",
      "Original[fixture quote]",
      "English translation[fixture present quote translation]",
    ]);
    expect(pairsIn(beat(7)).map(([, t]) => t)).toEqual([
      "Original[fixture transcription]",
      "English translation[fixture instrument translation]",
      "Original[fixture quote]",
      "English translation[fixture present quote translation]",
    ]);
  });
});
