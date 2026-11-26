import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import EndingPage from "@/app/ending/page";
import OpeningPage from "@/app/page";
import { chapters } from "@/content";
import { ending, opening } from "@/content/pages";
import { isSlot, type Text } from "@/content/slot";

// The pages run against the shared fixture, never the live content.
vi.mock("@/content", async () => (await import("@/test/fixtures")).fixtureContent());
vi.mock("@/content/pages", async () => (await import("@/test/fixtures")).fixturePages());

// A slot renders as "[note]", a filled slot as its text.
const shown = (t: Text) => (isSlot(t) ? `[${t.slot}]` : t);

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
