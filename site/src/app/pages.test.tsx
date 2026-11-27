import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import EndingPage from "@/app/ending/page";
import OpeningPage from "@/app/page";
import { chapters } from "@/content";
import { ending, opening } from "@/content/pages";
import { isSlot, type Text } from "@/content/slot";
import { RestartButton } from "@/components/RestartButton";
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

  it("in still mode leaves the framing, card, note and Begin as they are, and never hides them from assistive technology", () => {
    preferReducedMotion();
    const { container } = render(
      <MotionProvider>
        <OpeningPage />
      </MotionProvider>,
    );
    const parts = [...container.querySelectorAll("[data-opening-part]")];
    expect(parts.map((p) => p.getAttribute("data-opening-part"))).toEqual(["framing", "card", "note", "begin"]);
    for (const el of parts) {
      expect(el).not.toHaveAttribute("style");
      expect(el.closest("[aria-hidden], [inert]")).toBeNull();
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

  it("replays when Restart is chosen on the opening page itself", async () => {
    const user = userEvent.setup();
    sessionStorage.setItem(OPENING_SEEN_KEY, "1");
    render(
      <MotionProvider>
        <RestartButton />
        <OpeningPage />
      </MotionProvider>,
    );
    expect(screen.queryByRole("button", { name: "Skip" })).toBeNull();
    await user.click(screen.getByRole("link", { name: "Restart" }));
    expect(screen.getByRole("button", { name: "Skip" })).toBeInTheDocument();
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

describe("opening page card", () => {
  it("shows the facts only: no era marks, no rule links, no confidence", () => {
    const { container } = render(<OpeningPage />);
    expect(container.querySelectorAll("[data-fact]")).toHaveLength(4);
    expect(container.querySelector("[data-era-mark], [data-meter], [data-emphasis], a[href^=\"#beat-\"]")).toBeNull();
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

  it("compares every chapter in the matrix, in order, with a confidence meter only where an outcome exists", () => {
    const { container } = render(<EndingPage />);
    const outcomeRows = [...container.querySelectorAll("[data-view='outcome'] table [data-matrix-row]")];
    expect(outcomeRows.map((r) => r.getAttribute("data-matrix-row"))).toEqual(chapters.map((c) => c.slug));
    chapters.forEach((c, i) => {
      expect(outcomeRows[i]).toHaveTextContent(String(c.historicalYear));
      expect(outcomeRows[i]).toHaveTextContent(String(c.presentYear));
      const meters = (c.outcome ? 1 : 0) + (c.present.outcome ? 1 : 0);
      expect(outcomeRows[i].querySelectorAll("[data-meter]")).toHaveLength(meters);
    });
    expect(outcomeRows.some((r) => r.querySelector("[data-meter]") === null)).toBe(true);
    expect(container.querySelector("[data-mark]")).toBeNull();
  });

  // The bibliography used to be one paragraph with its line breaks kept; it is now read into
  // groups and one list item per line (src/components/ending/references.ts).
  it("lists a filled bibliography one entry per line, grouped under its headings, instead of one paragraph", () => {
    const original = ending.bibliography;
    ending.bibliography = "Louisiana\nfirst line\nsecond line";
    try {
      const { container } = render(<EndingPage />);
      const section = container.querySelector("#bibliography-heading")?.closest("section");
      expect(section?.querySelector("summary")?.textContent).toBe("Louisiana");
      expect([...(section?.querySelectorAll("li") ?? [])].map((li) => li.textContent)).toEqual(["first line", "second line"]);
    } finally {
      ending.bibliography = original;
    }
  });
});
