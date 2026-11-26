import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import EndingPage from "@/app/ending/page";
import OpeningPage from "@/app/page";
import { chapters } from "@/content";
import { ending, opening } from "@/content/pages";
import { isSlot, type Text } from "@/content/slot";
import { MotionProvider } from "@/motion/MotionProvider";
import { OPENING_SEEN_KEY } from "@/motion/opening";

// The pages run against the shared fixture, never the live content.
vi.mock("@/content", async () => (await import("@/test/fixtures")).fixtureContent());
vi.mock("@/content/pages", async () => (await import("@/test/fixtures")).fixturePages());
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

// A slot renders as "[note]", a filled slot as its text.
const shown = (t: Text) => (isSlot(t) ? `[${t.slot}]` : t);

const realMatchMedia = window.matchMedia;
afterEach(() => {
  window.matchMedia = realMatchMedia;
  sessionStorage.clear();
});

// With no override stored, the system preference decides: reduced means still, otherwise full.
function preferReducedMotion() {
  window.matchMedia = (media: string) => ({ ...realMatchMedia(media), matches: media === "(prefers-reduced-motion: reduce)" });
}

const decorations = (root: Element) => [...root.querySelectorAll("[data-opening-light], [data-opening-border]")];

describe("opening sequence", () => {
  it("has a decorative light and a border around the person card, hidden from assistive technology and without text", () => {
    const { container } = render(<OpeningPage />);
    const [light, border] = decorations(container);
    expect(decorations(container)).toHaveLength(2);
    for (const el of [light, border]) {
      expect(el).toHaveAttribute("aria-hidden", "true");
      expect(el.textContent).toBe("");
    }
    expect(light).toHaveAttribute("data-opening-light");
    const card = screen.getByRole("heading", { name: "Person card" }).closest("aside");
    expect(border.parentElement?.contains(card ?? null)).toBe(true);
  });

  it("in still mode has no Skip button and no inline style on the decorations", () => {
    preferReducedMotion();
    const { container } = render(
      <MotionProvider>
        <OpeningPage />
      </MotionProvider>,
    );
    expect(screen.queryByRole("button", { name: "Skip" })).toBeNull();
    for (const el of decorations(container)) {
      expect(el).not.toHaveAttribute("style");
      for (const child of el.querySelectorAll("*")) expect(child).not.toHaveAttribute("style");
    }
  });

  it("in full mode, not yet seen, offers Skip, which records the opening as seen and keeps the card and title", async () => {
    const user = userEvent.setup();
    render(
      <MotionProvider>
        <OpeningPage />
      </MotionProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Skip" }));
    expect(sessionStorage.getItem(OPENING_SEEN_KEY)).not.toBeNull();
    expect(screen.queryByRole("button", { name: "Skip" })).toBeNull();
    expect(screen.getByRole("heading", { name: "Person card" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(shown(opening.title));
  });

  it("in full mode, once seen, offers no Skip", () => {
    sessionStorage.setItem(OPENING_SEEN_KEY, "1");
    render(
      <MotionProvider>
        <OpeningPage />
      </MotionProvider>,
    );
    expect(screen.queryByRole("button", { name: "Skip" })).toBeNull();
  });
});

describe("opening page", () => {
  it("renders the person card, title, framing, site-level note and the way into chapter 1", () => {
    const { container } = render(<OpeningPage />);
    expect(screen.getByRole("heading", { name: "Person card" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(shown(opening.title));
    expect(container).toHaveTextContent(shown(opening.framing));
    expect(container).toHaveTextContent(shown(opening.siteNote));
    expect(container.querySelector(`a[href="/chapters/${chapters[0].slug}"]`)).not.toBeNull();
  });
});

describe("ending page", () => {
  it("renders the conclusion, records, reflection and the closing notes in order", () => {
    const { container } = render(<EndingPage />);
    const text = container.textContent ?? "";
    const order = [
      shown(ending.comparability),
      ...chapters.map((c) => c.place),
      shown(ending.reflection),
      shown(ending.methodNote),
      shown(ending.languageNote),
      shown(ending.bibliography),
      shown(ending.imageCredits),
      shown(ending.fictionStatement),
      shown(ending.aiUse),
    ];
    const positions = order.map((s) => text.indexOf(s));
    for (const p of positions) expect(p).toBeGreaterThanOrEqual(0);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it("shows each chapter's record with both years, and outcomes only where they exist", () => {
    const { container } = render(<EndingPage />);
    const records = [...container.querySelectorAll("[data-record]")];
    expect(records.map((r) => r.getAttribute("data-record"))).toEqual(chapters.map((c) => c.slug));
    chapters.forEach((c, i) => {
      expect(records[i]).toHaveTextContent(String(c.historicalYear));
      expect(records[i]).toHaveTextContent(String(c.presentYear));
      const hasOutcome = c.outcome !== null || c.present.outcome !== null;
      expect(records[i].querySelector("[data-outcome]") !== null).toBe(hasOutcome);
    });
    expect(records.some((r) => r.querySelector("[data-outcome]") === null)).toBe(true);
    expect(container.querySelector("[data-mark]")).toBeNull();
  });

  it("keeps the line breaks of a filled note, as a transcription does", () => {
    const original = ending.bibliography;
    ending.bibliography = "first line\nsecond line";
    try {
      const { container } = render(<EndingPage />);
      const note = container.querySelector("#bibliography-heading + p");
      expect(note?.textContent).toBe("first line\nsecond line");
      expect(note).toHaveClass("whitespace-pre-line");
    } finally {
      ending.bibliography = original;
    }
  });
});
