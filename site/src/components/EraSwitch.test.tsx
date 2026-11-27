import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Chapter } from "@/content/types";
import { fixtureChapter, fixturePerson } from "@/test/fixtures";

beforeEach(() => sessionStorage.clear());
afterEach(() => vi.restoreAllMocks());

// The motion override lives in module memory, so every test loads the modules fresh, as a page load would.
async function load() {
  vi.resetModules();
  const [{ MotionProvider }, { ChapterPage }, { MotionSwitch }] = await Promise.all([
    import("@/motion/MotionProvider"),
    import("./ChapterPage"),
    import("./MotionSwitch"),
  ]);
  return { MotionProvider, ChapterPage, MotionSwitch };
}

async function renderChapter(chapter: Chapter = fixtureChapter()) {
  const { MotionProvider, ChapterPage } = await load();
  const utils = render(
    <MotionProvider>
      <ChapterPage chapter={chapter} person={fixturePerson()} next={{ href: "/chapters/fixture-2", label: "Next" }} />
    </MotionProvider>,
  );
  const beat6 = utils.container.querySelector<HTMLElement>('section[data-beat="6"]');
  if (!beat6) throw new Error("beat 6 missing");
  return { ...utils, chapter, beat6 };
}

const panel = (beat6: HTMLElement, era: string) => beat6.querySelector<HTMLElement>(`[data-era="${era}"]`) as HTMLElement;

describe("beat 6 without its script", () => {
  it("shows both eras in full, one after the other, with no control", async () => {
    const { ChapterPage } = await load();
    const c = fixtureChapter();
    const host = document.createElement("div");
    host.innerHTML = renderToString(<ChapterPage chapter={c} person={fixturePerson()} next={{ href: "/ending", label: "Ending" }} />);
    const beat6 = host.querySelector<HTMLElement>('section[data-beat="6"]') as HTMLElement;
    expect(beat6.querySelector("input")).toBeNull();
    expect(beat6.querySelector("[aria-hidden='true'][data-era], [inert]")).toBeNull();
    expect([...beat6.querySelectorAll("[data-era]")].map((e) => e.getAttribute("data-era"))).toEqual(["historical", "present"]);
    for (const [era, year, summary] of [
      ["historical", c.historicalYear, c.summary.historical],
      ["present", c.presentYear, c.summary.present],
    ] as const) {
      const p = panel(beat6, era);
      expect(p.querySelector("h3")).toHaveTextContent(String(year));
      expect(p.querySelector("[data-document] [data-mount]")).not.toBeNull();
      expect(p).toHaveTextContent("Instrument");
      expect(p).toHaveTextContent("fixture title");
      expect(p).toHaveTextContent(`Who decides${summary.decides}`);
      expect(p).toHaveTextContent(`On what evidence${summary.evidence}`);
      expect(p.querySelector("blockquote")).toHaveTextContent("fixture quote");
      expect(p.querySelector("details > summary")).toHaveTextContent("Citation");
    }
    expect(panel(beat6, "historical").querySelector('a[href="#beat-5"]')).toHaveTextContent("See the outcome");
    expect(panel(beat6, "historical")).toHaveTextContent("High");
    expect(panel(beat6, "present").querySelector('a[href="#beat-7"]')).toHaveTextContent("See the outcome");
    expect(panel(beat6, "present")).toHaveTextContent("Low");
  });
});

describe("beat 6 comparison", () => {
  it("is one labelled range from the historical year to 2020, with the year in view as its value text", async () => {
    sessionStorage.setItem("opmb:motion", "still");
    const { beat6, chapter } = await renderChapter();
    const range = within(beat6).getByRole("slider", { name: `Date, from ${chapter.historicalYear} to 2020` });
    expect(range).toHaveAttribute("min", String(chapter.historicalYear));
    expect(range).toHaveAttribute("max", "2020");
    expect(range).toHaveAttribute("aria-valuetext", `${chapter.historicalYear} in view`);
    expect(panel(beat6, "historical")).not.toHaveAttribute("aria-hidden");
    expect(panel(beat6, "present")).toHaveAttribute("aria-hidden", "true");
    expect(panel(beat6, "present")).toHaveAttribute("inert");

    fireEvent.change(range, { target: { value: "1950" } });
    expect(range).toHaveAttribute("aria-valuetext", "1950, 1901 in view");
    expect(panel(beat6, "present")).toHaveAttribute("aria-hidden", "true");

    fireEvent.change(range, { target: { value: "1961" } });
    expect(range).toHaveAttribute("aria-valuetext", "1961, 2020 in view");
    expect(panel(beat6, "present")).not.toHaveAttribute("aria-hidden");
    expect(panel(beat6, "historical")).toHaveAttribute("aria-hidden", "true");
    expect(beat6.closest("[data-chapter]")).toHaveAttribute("data-era-in-view", "present");

    // Fully reversible.
    fireEvent.change(range, { target: { value: String(chapter.historicalYear) } });
    expect(range).toHaveAttribute("aria-valuetext", `${chapter.historicalYear} in view`);
    expect(panel(beat6, "historical")).not.toHaveAttribute("aria-hidden");
    expect(beat6.closest("[data-chapter]")).toHaveAttribute("data-era-in-view", "historical");
  });

  it("announces the era change in a polite live region, and only once it changes", async () => {
    sessionStorage.setItem("opmb:motion", "still");
    const { beat6 } = await renderChapter();
    const live = beat6.querySelector('[aria-live="polite"]');
    expect(live).not.toBeNull();
    expect(live?.textContent).toBe("");
    const range = within(beat6).getByRole("slider");
    fireEvent.change(range, { target: { value: "1930" } });
    expect(live?.textContent).toBe("");
    fireEvent.change(range, { target: { value: "2020" } });
    expect(live).toHaveTextContent("Now showing 2020.");
    fireEvent.change(range, { target: { value: "1902" } });
    expect(live).toHaveTextContent("Now showing 1901.");
  });

  it("in still mode the year buttons set the value at once, without scrolling", async () => {
    sessionStorage.setItem("opmb:motion", "still");
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const { beat6 } = await renderChapter();
    scrollTo.mockClear(); // the page itself starts at the top on mount; only the presses matter here
    const range = within(beat6).getByRole("slider");
    const show2020 = within(beat6).getByRole("button", { name: "Show 2020" });
    const show1901 = within(beat6).getByRole("button", { name: "Show 1901" });
    expect(show1901).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(show2020);
    expect(range).toHaveValue("2020");
    expect(show2020).toHaveAttribute("aria-pressed", "true");
    expect(show1901).toHaveAttribute("aria-pressed", "false");
    expect(beat6.querySelector("[data-date-indicator]")).toHaveTextContent("2020");
    await userEvent.click(show1901);
    expect(range).toHaveValue("1901");
    expect(beat6.querySelector("[data-date-indicator]")).toHaveTextContent("1901");
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("in full motion below the breakpoint the year buttons carry the value across", async () => {
    sessionStorage.setItem("opmb:motion", "full");
    const { beat6 } = await renderChapter();
    const range = within(beat6).getByRole("slider");
    await userEvent.click(within(beat6).getByRole("button", { name: "Show 2020" }));
    await waitFor(() => expect(range).toHaveValue("2020"), { timeout: 4000 });
    expect(panel(beat6, "present")).not.toHaveAttribute("aria-hidden");
  });

  it("keeps the decoration hidden and puts no style attribute on the page at rest", async () => {
    sessionStorage.setItem("opmb:motion", "still");
    const { beat6 } = await renderChapter();
    for (const sel of ["[data-date-indicator]", "[data-divider]", "[data-date-line]"]) {
      expect(beat6.querySelector(sel)).toHaveAttribute("aria-hidden", "true");
    }
    expect(beat6.querySelectorAll("[style]")).toHaveLength(0);
  });

  it("works for a chapter with no outcomes and no person: empty frames with their notes, and no outcome", async () => {
    sessionStorage.setItem("opmb:motion", "still");
    const c = fixtureChapter(4, { withOutcome: false, showPersonCard: false });
    c.items[0].gapNote = "fixture historical gap note";
    const { beat6 } = await renderChapter(c);
    const frames = [...beat6.querySelectorAll("[data-document] [data-empty-mount]")];
    expect(frames.map((f) => f.textContent)).toEqual(["fixture historical gap note", "No image"]);
    expect(beat6.querySelector('a[href="#beat-5"], a[href="#beat-7"]')).toBeNull();
    for (const era of ["historical", "present"]) {
      expect(panel(beat6, era)).toHaveTextContent("No person is placed in this chapter, so no outcome is given.");
    }
    fireEvent.change(within(beat6).getByRole("slider"), { target: { value: "2020" } });
    expect(panel(beat6, "present")).not.toHaveAttribute("aria-hidden");
  });
});

describe("MotionSwitch", () => {
  it("stores the override under opmb:motion, and MotionProvider reads it back on mount", async () => {
    const first = await load();
    const view = render(
      <first.MotionProvider>
        <first.MotionSwitch />
      </first.MotionProvider>,
    );
    const button = screen.getByRole("button", { name: "Motion" });
    expect(button).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(button);
    expect(sessionStorage.getItem("opmb:motion")).toBe("still");
    expect(button).toHaveAttribute("aria-pressed", "false");
    view.unmount();

    const again = await load();
    render(
      <again.MotionProvider>
        <again.MotionSwitch />
      </again.MotionProvider>,
    );
    expect(screen.getByRole("button", { name: "Motion" })).toHaveAttribute("aria-pressed", "false");
  });

  it("keeps the override when sessionStorage cannot store it", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    const { MotionProvider, MotionSwitch } = await load();
    render(
      <MotionProvider>
        <MotionSwitch />
      </MotionProvider>,
    );
    const button = screen.getByRole("button", { name: "Motion" });
    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
  });
});
