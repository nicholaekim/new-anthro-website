import { describe, expect, it } from "vitest";
import { chapters, getChapter, person } from "@/content";
import { ending, opening } from "@/content/pages";
import { isSlot, type Text } from "@/content/slot";
import { validateChapter } from "@/content/validate";
import { fixtureChapter } from "@/test/fixtures";

// Text that describes or credits an image stays a placeholder until that image is added:
// the place photograph and its context, each item's alternative text, longer description
// and alteration note, and the image credits.
const IMAGE_DEPENDENT =
  /\.photograph\.|\.photographContext$|\.alt$|\.longDescription$|\.alterations$|\.imageCredits$/;

function slotPaths(value: unknown, path: string, out: string[]): void {
  if (Array.isArray(value)) {
    value.forEach((v, i) => slotPaths(v, `${path}[${i}]`, out));
    return;
  }
  if (value !== null && typeof value === "object") {
    if (isSlot(value as Text)) {
      out.push(path);
      return;
    }
    for (const [key, v] of Object.entries(value)) slotPaths(v, `${path}.${key}`, out);
  }
}

describe("chapters", () => {
  it("has the four chapters in order", () => {
    expect(chapters).toHaveLength(4);
    expect(chapters.map((c) => c.slug)).toEqual([
      "louisiana",
      "sao-paulo",
      "johannesburg",
      "tobique",
    ]);
  });

  it("has the fixed places, countries and dates", () => {
    expect(chapters.map((c) => [c.place, c.country, c.historicalYear])).toEqual([
      ["Louisiana", "United States", 1930],
      ["São Paulo", "Brazil", 1950],
      ["Johannesburg", "South Africa", 1955],
      ["Tobique, New Brunswick", "Canada", 1960],
    ]);
    for (const c of chapters) expect(c.presentYear).toBe(2020);
  });

  it("validates every chapter", () => {
    for (const c of chapters) expect(validateChapter(c)).toEqual([]);
  });

  it("gives Tobique no outcome", () => {
    const tobique = getChapter("tobique");
    expect(tobique).toBeDefined();
    expect(tobique?.outcome).toBeNull();
    expect(tobique?.present.outcome).toBeNull();
  });

  it("leaves a placeholder only where the text depends on an image not yet added", () => {
    const found: string[] = [];
    slotPaths({ chapters, person, opening, ending }, "content", found);
    expect(found.filter((path) => !IMAGE_DEPENDENT.test(path))).toEqual([]);
  });

  it("shows the person card in every chapter but Tobique", () => {
    expect(chapters.map((c) => [c.slug, c.showPersonCard])).toEqual([
      ["louisiana", true],
      ["sao-paulo", true],
      ["johannesburg", true],
      ["tobique", false],
    ]);
  });

  it("returns undefined for an unknown slug", () => {
    expect(getChapter("nope")).toBeUndefined();
  });
});

describe("validateChapter", () => {
  it("accepts the fixture chapter", () => {
    expect(validateChapter(fixtureChapter())).toEqual([]);
  });

  it("reports a basis listing card facts in a chapter that shows no person card", () => {
    for (const which of ["basis", "present"] as const) {
      const c = fixtureChapter(1, { showPersonCard: false });
      const b = which === "basis" ? c.basis : c.present.basis;
      if (!b) throw new Error("fixture needs both bases");
      b.cardFactsUsed = ["fact-1"];
      expect(validateChapter(c).some((p) => p.includes("showPersonCard"))).toBe(true);
    }
  });

  it("reports a document with an image but no transcription", () => {
    const c = fixtureChapter();
    const doc = c.items.find((i) => i.kind === "document");
    if (!doc) throw new Error("fixture needs a document item");
    doc.image = { src: "/placeholder.png", width: 10, height: 10 };
    doc.transcription = null;
    expect(validateChapter(c)).not.toEqual([]);
  });

  it("reports a change of date naming an unknown historical item", () => {
    const c = fixtureChapter();
    if (!c.changeOfDate) throw new Error("fixture needs a change of date");
    c.changeOfDate.historicalItemId = "missing-item";
    expect(validateChapter(c)).not.toEqual([]);
  });

  it("reports a change of date naming an unknown present-day item", () => {
    const c = fixtureChapter();
    if (!c.changeOfDate) throw new Error("fixture needs a change of date");
    c.changeOfDate.presentItemId = "missing-item";
    expect(validateChapter(c)).not.toEqual([]);
  });

  it("reports a basis using a fact not on the person card", () => {
    const c = fixtureChapter();
    if (!c.basis) throw new Error("fixture needs a basis");
    c.basis.cardFactsUsed = ["no-such-fact"];
    expect(validateChapter(c)).not.toEqual([]);
  });

  it("reports a present-day basis using a fact not on the person card", () => {
    const c = fixtureChapter();
    if (!c.present.basis) throw new Error("fixture needs a present-day basis");
    c.present.basis.cardFactsUsed = ["no-such-fact"];
    expect(validateChapter(c)).not.toEqual([]);
  });
});
