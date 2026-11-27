import { act, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Chapter } from "@/content/types";
import { MotionProvider } from "@/motion/MotionProvider";
import { fixtureChapter, fixturePerson } from "@/test/fixtures";
import { ChapterPage } from "./ChapterPage";

// jsdom has no layout: place each section so that the one named is at the top of the view and the
// next is a full view below it.
let current = 1;
function place(beat: number) {
  current = beat;
}

beforeEach(() => {
  sessionStorage.setItem("opmb:motion", "still");
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
    const beat = this.matches("section[data-beat]") ? Number(this.dataset.beat) : current;
    const top = (beat - current) * 1000;
    return { top, bottom: top + 900, left: 0, right: 0, width: 0, height: 900, x: 0, y: top, toJSON: () => ({}) };
  });
});
afterEach(() => {
  vi.restoreAllMocks();
  sessionStorage.clear();
});

async function scrollTo(beat: number) {
  place(beat);
  await act(async () => {
    window.dispatchEvent(new Event("scroll"));
    await new Promise((resolve) => requestAnimationFrame(resolve));
  });
}

function chapterUsing(): Chapter {
  const c = fixtureChapter(30);
  if (!c.basis || !c.present.basis) throw new Error("fixture needs both bases");
  c.basis.cardFactsUsed = ["fact-1"];
  c.present.basis.cardFactsUsed = ["fact-2", "fact-4"];
  return c;
}

function renderChapter(c: Chapter = chapterUsing()) {
  return render(
    <MotionProvider>
      <ChapterPage chapter={c} person={fixturePerson()} next={{ href: "/ending", label: "Ending" }} position={{ number: 1, count: 4 }} />
    </MotionProvider>,
  );
}

const bar = () => screen.getByRole("navigation", { name: "Sections in this chapter" });

describe("story navigation", () => {
  it("marks the active section on the chapter, in the ticks and in the label", async () => {
    const { container } = renderChapter();
    await scrollTo(4);
    expect(container.querySelector("[data-chapter]")).toHaveAttribute("data-active-beat", "4");
    const current = bar().querySelectorAll('[aria-current="step"]');
    expect([...current].map((a) => a.getAttribute("href"))).toEqual(["#beat-4", "#beat-4"]);
    expect(within(bar()).getByText("04 Basis", { selector: "summary *" })).toBeInTheDocument();
    await scrollTo(7);
    expect(container.querySelector("[data-chapter]")).toHaveAttribute("data-active-beat", "7");
  });

  it("points previous and next at the neighbouring sections, and marks them unavailable at the ends", async () => {
    renderChapter();
    const previous = () => within(bar()).getByRole("link", { name: "Previous section" });
    const next = () => within(bar()).getByRole("link", { name: "Next section" });
    await scrollTo(1);
    expect(previous()).toHaveAttribute("aria-disabled", "true");
    expect(next()).toHaveAttribute("href", "#beat-2");
    await scrollTo(5);
    expect(previous()).toHaveAttribute("href", "#beat-4");
    expect(next()).toHaveAttribute("href", "#beat-6");
    expect(previous()).not.toHaveAttribute("aria-disabled");
    await scrollTo(8);
    expect(next()).toHaveAttribute("aria-disabled", "true");
  });

  it("links every section from the ticks and from the list, by its label", () => {
    renderChapter();
    const hrefs = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `#beat-${n}`);
    expect([...bar().querySelectorAll("[data-tick]")].map((a) => a.getAttribute("href"))).toEqual(hrefs);
    const list = bar().querySelector("[data-section-list] ol");
    expect([...(list?.querySelectorAll("a") ?? [])].map((a) => a.textContent)).toEqual([
      "01 Title",
      "02 Place",
      "03 Items",
      "04 Basis",
      "05 Outcome",
      "06 Change of date",
      "07 Present day",
      "08 Next",
    ]);
  });

  it("uses the same labels as the section headings", () => {
    renderChapter();
    for (const [n, label] of [[4, "Basis"], [6, "Change of date"], [7, "Present day, 2020"]] as const) {
      expect(document.getElementById(`beat-${n}-heading`)).toHaveTextContent(label);
    }
  });

  it("shows which chapter this is beside the place and date", () => {
    renderChapter();
    expect(document.querySelector("[data-chapter-position]")).toHaveTextContent("Chapter 1 of 4");
  });
});

describe("person card in a chapter", () => {
  // The card is in a closed popover below the breakpoint, so it is queried with hidden: true.
  const card = () => screen.getByRole("complementary", { name: "Person card", hidden: true });
  const fact = (id: string) => card().querySelector(`[data-fact="${id}"]`) as HTMLElement;

  it("says for each fact whether each era's rule uses it, linking a used one to its rule", () => {
    renderChapter();
    expect(fact("fact-1")).toHaveTextContent("1930: used");
    expect(fact("fact-1")).toHaveTextContent("2020: not used");
    expect(fact("fact-3")).toHaveTextContent("1930: not used");
    expect(fact("fact-3")).toHaveTextContent("2020: not used");
    expect(within(fact("fact-1")).getByRole("link", { name: "See the rule (1930)", hidden: true })).toHaveAttribute("href", "#beat-4");
    expect(within(fact("fact-2")).getByRole("link", { name: "See the rule (2020)", hidden: true })).toHaveAttribute("href", "#beat-7");
    expect(within(fact("fact-3")).queryByRole("link", { hidden: true })).toBeNull();
  });

  it("emphasises the historical rule's facts at the basis, the 2020 rule's at the present day, and neither elsewhere", async () => {
    renderChapter();
    const emphasis = () => card().querySelector("[data-fact]")?.closest("[data-emphasis]")?.getAttribute("data-emphasis") ?? null;
    await scrollTo(2);
    expect(emphasis()).toBeNull();
    await scrollTo(4);
    expect(emphasis()).toBe("historical");
    await scrollTo(5);
    expect(emphasis()).toBe("historical");
    await scrollTo(7);
    expect(emphasis()).toBe("present");
    await scrollTo(8);
    expect(emphasis()).toBeNull();
    // Still mode: nothing is left inline.
    expect(card().querySelector("[style]")).toBeNull();
  });

  it("gives each outcome's confidence in words, linked to its section", () => {
    const c = chapterUsing();
    renderChapter(c);
    const footer = within(card()).getByRole("region", { name: "In this chapter", hidden: true });
    expect(within(footer).getByRole("link", { name: "1930 outcome, confidence: High", hidden: true })).toHaveAttribute("href", "#beat-5");
    expect(within(footer).getByRole("link", { name: "2020 outcome, confidence: Low", hidden: true })).toHaveAttribute("href", "#beat-7");
  });

  it("shows on its button how many facts the section in view uses", async () => {
    renderChapter();
    const button = () => screen.getByRole("button", { name: /^Person card/ });
    await scrollTo(2);
    expect(button()).toHaveAccessibleName("Person card");
    await scrollTo(4);
    expect(button()).toHaveAccessibleName("Person card, 1 fact used in this section");
    await scrollTo(7);
    expect(button()).toHaveTextContent("2");
  });

  it("in a chapter that shows no card, has no card, no marks and no confidence anywhere", () => {
    renderChapter(fixtureChapter(4, { withOutcome: false, showPersonCard: false }));
    expect(screen.queryByRole("complementary", { name: "Person card", hidden: true })).toBeNull();
    expect(document.querySelector("[data-era-mark], [data-meter]")).toBeNull();
  });
});
