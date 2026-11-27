import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fixtureChapter, fixturePerson } from "@/test/fixtures";

// jsdom has no layout, so line splitting means nothing here.
vi.mock("gsap/SplitText", () => {
  class SplitText {
    lines: Element[] = [];
    revert() {}
    kill() {}
    static register() {}
  }
  return { SplitText, default: SplitText };
});

beforeEach(() => sessionStorage.clear());
afterEach(() => vi.restoreAllMocks());

// The motion override lives in module memory, so every test loads the modules fresh, as a page load would.
async function renderChapter(mode: "full" | "still") {
  sessionStorage.setItem("opmb:motion", mode);
  vi.resetModules();
  const [{ MotionProvider }, { ChapterPage }, { ScrollTrigger }] = await Promise.all([
    import("@/motion/MotionProvider"),
    import("@/components/ChapterPage"),
    import("@/motion/gsap"),
  ]);
  const utils = render(
    <MotionProvider>
      <ChapterPage
        chapter={fixtureChapter()}
        person={fixturePerson()}
        next={{ href: "/chapters/fixture-2", label: "Next" }}
        position={{ number: 1, count: 4 }}
      />
    </MotionProvider>,
  );
  return { ...utils, ScrollTrigger };
}

const laterSections = (root: Element) => [...root.querySelectorAll("section[data-beat]:not([data-beat='1'])")];

// Every element of the sections after the title page reports its top this far down the page.
function placeLaterSectionsBelowTheView(top = 5000) {
  const real = HTMLElement.prototype.getBoundingClientRect;
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
    if (!this.closest("section[data-beat]:not([data-beat='1'])")) return real.call(this);
    return { top, bottom: top + 100, left: 0, right: 100, width: 100, height: 100, x: 0, y: top, toJSON: () => ({}) };
  });
}

describe("still mode", () => {
  it("sets up no scroll triggers and writes no inline style for the entrances, reveals or parallax", async () => {
    placeLaterSectionsBelowTheView();
    const { container, ScrollTrigger } = await renderChapter("still");
    expect(ScrollTrigger.getAll()).toHaveLength(0);
    const styled = [...container.querySelectorAll<HTMLElement>("[style]")].filter((el) => el.tagName !== "IMG");
    expect(styled).toEqual([]);
    expect(container.querySelector("[data-entering]")).toBeNull();
  });
});

describe("decoration", () => {
  it("the title page's figures and number and beat 2's type are hidden from assistive technology", async () => {
    const { container } = await renderChapter("still");
    const decorative = [...container.querySelectorAll("[data-chapter-figures], [data-chapter-number], [data-place-figures]")];
    expect(decorative).toHaveLength(3);
    for (const el of decorative) expect(el.closest('[aria-hidden="true"]')).not.toBeNull();
    // The content note is not decoration and is never part of an entrance.
    const note = container.querySelector('section[data-beat="1"] p.measure');
    expect(note?.closest("[aria-hidden]")).toBeNull();
  });
});

describe("section reveals in full motion", () => {
  it("leave everything already in view alone", async () => {
    // jsdom puts every element at the top of the view.
    const { container } = await renderChapter("full");
    for (const section of laterSections(container)) {
      expect(section.querySelector("[data-entering]")).toBeNull();
      for (const el of section.querySelectorAll<HTMLElement>("[style]")) {
        expect(el.style.opacity).toBe("");
        expect(el.style.transform).toBe("");
      }
    }
  });

  it("start what is below the view see-through, never hidden, and finish a block at once when focus moves into it", async () => {
    placeLaterSectionsBelowTheView();
    const { container } = await renderChapter("full");
    const link = container.querySelector<HTMLAnchorElement>('section[data-beat="8"] a[href="/chapters/fixture-2"]');
    if (!link) throw new Error("next link missing");
    expect(link).toHaveAttribute("data-entering");
    expect(link.style.opacity).toBe("0");
    // Nothing is hidden from the accessibility tree or the keyboard for an entrance.
    for (const el of container.querySelectorAll("[data-entering]")) {
      expect(el.closest("[inert]")).toBeNull();
      expect((el as HTMLElement).style.visibility).toBe("");
      expect((el as HTMLElement).style.display).toBe("");
    }
    act(() => {
      link.focus();
      fireEvent.focusIn(link);
    });
    expect(link).not.toHaveAttribute("data-entering");
    expect(link).not.toHaveAttribute("style");
  });

  it("revert to the still page, with nothing inline, when the page goes away", async () => {
    placeLaterSectionsBelowTheView();
    const { container, unmount } = await renderChapter("full");
    expect(container.querySelectorAll("[data-entering]").length).toBeGreaterThan(0);
    const entering = [...container.querySelectorAll<HTMLElement>("[data-entering]")];
    unmount();
    for (const el of entering) {
      expect(el).not.toHaveAttribute("data-entering");
      expect(el.style.opacity).toBe("");
      expect(el.style.transform).toBe("");
    }
  });
});
