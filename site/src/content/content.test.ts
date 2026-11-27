import { describe, expect, it } from "vitest";
import { chapters, getChapter, person } from "@/content";
import { ending, opening } from "@/content/pages";
import { isSlot, slot, type Text } from "@/content/slot";
import { highlights } from "@/content/regions";
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

  it("gives every outcome one of the four confidence levels", () => {
    const levels = chapters.flatMap((c) => [c.outcome, c.present.outcome]).flatMap((o) => (o ? [o.level] : []));
    expect(levels).toEqual(["high", "moderate", "low", "moderate", "undetermined", "low"]);
  });

  it("gives every chapter both era summaries as text", () => {
    for (const c of chapters) {
      for (const s of [c.summary.historical, c.summary.present]) {
        for (const t of [s.decides, s.evidence]) {
          expect(isSlot(t)).toBe(false);
          expect(String(t).trim()).not.toBe("");
        }
      }
    }
  });

  it("keys every highlight to a document item of some chapter", () => {
    const ids = new Set(chapters.flatMap((c) => [...c.items, ...(c.present.instrument ? [c.present.instrument] : [])]).map((i) => i.id));
    for (const key of Object.keys(highlights)) expect(ids.has(key)).toBe(true);
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

  it("reports an outcome whose level is not one of the four", () => {
    const c = fixtureChapter();
    if (!c.outcome) throw new Error("fixture needs an outcome");
    (c.outcome as { level: string }).level = "certain";
    expect(validateChapter(c).some((p) => p.includes("level"))).toBe(true);
  });

  it("reports an era summary that is a placeholder or empty", () => {
    const c = fixtureChapter();
    c.summary.historical.decides = slot("who decides");
    c.summary.present.evidence = " ";
    expect(validateChapter(c).filter((p) => p.includes("summary"))).toHaveLength(2);
  });

  it("accepts a highlight whose annotations are on its item, and reports one that names another", () => {
    const c = fixtureChapter();
    const item = c.items[0];
    const region = { x: 0.1, y: 0.1, w: 0.5, h: 0.2 };
    const good = { [item.id]: [{ id: "h1", label: "Paragraph 1", region, annotationIds: [item.annotations[0].id] }] };
    expect(validateChapter(c, good)).toEqual([]);
    const bad = { [item.id]: [{ id: "h1", label: "Paragraph 1", region, annotationIds: ["no-such-annotation"] }] };
    expect(validateChapter(c, bad).some((p) => p.includes("no-such-annotation"))).toBe(true);
  });

  it("reports a highlight region outside the image", () => {
    const c = fixtureChapter();
    const item = c.items[0];
    const bad = { [item.id]: [{ id: "h1", label: "Paragraph 1", region: { x: 0.6, y: 0, w: 0.5, h: 0.2 }, annotationIds: [] }] };
    expect(validateChapter(c, bad).some((p) => p.includes("region"))).toBe(true);
  });

  it("reports a present-day basis using a fact not on the person card", () => {
    const c = fixtureChapter();
    if (!c.present.basis) throw new Error("fixture needs a present-day basis");
    c.present.basis.cardFactsUsed = ["no-such-fact"];
    expect(validateChapter(c)).not.toEqual([]);
  });
});
