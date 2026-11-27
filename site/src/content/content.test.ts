import { describe, expect, it } from "vitest";
import { chapters, getChapter, person } from "@/content";
import { ending, opening } from "@/content/pages";
import { isSlot, slot, type Text } from "@/content/slot";
import { highlights } from "@/content/regions";
import { validateChapter } from "@/content/validate";
import { fixtureChapter } from "@/test/fixtures";
import { linkSegments, parseReferences } from "@/components/ending/references";

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

  it("has the summaries and levels of the plan's table, word for word", () => {
    const table = chapters.map((c) => [
      c.slug,
      c.outcome?.level ?? null,
      c.summary.historical.decides,
      c.summary.historical.evidence,
      c.present.outcome?.level ?? null,
      c.summary.present.decides,
      c.summary.present.evidence,
    ]);
    expect(table).toEqual([
      [
        "louisiana",
        "high",
        "The census enumerator",
        "Ancestry, whatever the share",
        "moderate",
        "The person, or whoever fills in the household’s form",
        "Self-identification; the Census Bureau classifies what is written",
      ],
      [
        "sao-paulo",
        "low",
        "A declarant, often the head of the family; a coder then matches the word against a list",
        "A declared word; no ancestry, standing or papers asked",
        "moderate",
        "Whoever is interviewed: the person, another resident or a non-resident informant",
        "A declaration among five read-out options",
      ],
      [
        "johannesburg",
        "undetermined",
        "The Director of Census; on objection, a board",
        "Appearance, general acceptance and, for one category, membership “in fact”",
        "low",
        "The employee, on a workplace form; the employer if the employee refuses or gives inaccurate information",
        "Self-declaration; failing that, “reliable historical and existing data”",
      ],
      [
        "tobique",
        null,
        "The Registrar, a federal officer; one reference to a judge",
        "Recorded descent through men, band membership and marriage",
        null,
        "The Registrar, on application",
        "Descent through either parent; credible evidence where an ancestor is unknown or unstated",
      ],
    ]);
  });

  it("marks the São Paulo originals as Portuguese, and no other chapter's", () => {
    for (const c of chapters) {
      const sources = [...c.items, ...(c.present.instrument ? [c.present.instrument] : [])]
        .filter((i) => i.translation !== null)
        .map((i) => i.originalLang);
      const quotes = [c.basis, c.present.basis].filter((b) => b && b.quoteTranslation !== null).map((b) => b?.originalLang);
      const expected = c.slug === "sao-paulo" ? "pt" : undefined;
      for (const lang of [...sources, ...quotes]) expect(lang).toBe(expected);
      if (c.slug === "sao-paulo") expect(sources.length + quotes.length).toBe(5);
    }
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

  it("keeps each translation in its own field, never after a marker inside the original", () => {
    const strings = JSON.stringify(chapters);
    expect(strings).not.toContain("English translation:");
    const saoPaulo = getChapter("sao-paulo");
    const translated = [...(saoPaulo?.items ?? []), saoPaulo?.present.instrument].map((i) => i?.translation);
    for (const t of [...translated, saoPaulo?.basis?.quoteTranslation, saoPaulo?.present.basis?.quoteTranslation]) {
      expect(typeof t === "string" && t.trim() !== "").toBe(true);
    }
    // Only the São Paulo sources are quoted in a language other than English.
    for (const c of chapters.filter((c) => c.slug !== "sao-paulo")) {
      const items = [c.photograph, ...c.items, ...(c.present.instrument ? [c.present.instrument] : [])];
      expect(items.map((i) => i.translation).filter((t) => t !== null)).toEqual([]);
      expect([c.basis, c.present.basis].map((b) => b?.quoteTranslation ?? null).filter((t) => t !== null)).toEqual([]);
    }
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

// The ending reads these two notes into groups and entries (src/components/ending/references.ts).
describe("ending reference notes", () => {
  const lines = (t: string) => t.split("\n").map((l) => l.trim()).filter((l) => l !== "");

  it("group the bibliography under the four places, losing no line", () => {
    if (isSlot(ending.bibliography)) return;
    const groups = parseReferences(ending.bibliography);
    expect(groups.map((g) => g.heading)).toEqual(["Louisiana", "São Paulo", "Johannesburg", "Tobique"]);
    expect(groups.flatMap((g) => [g.heading, ...g.entries])).toEqual(lines(ending.bibliography));
  });

  it("group the image credits under their two headings and a closing line, losing no line", () => {
    if (isSlot(ending.imageCredits)) return;
    const groups = parseReferences(ending.imageCredits);
    expect(groups.map((g) => g.heading)).toEqual(["Place photographs", "Document pages", null]);
    expect(groups.flatMap((g) => (g.heading ? [g.heading, ...g.entries] : g.entries))).toEqual(lines(ending.imageCredits));
  });

  it("link only whole web addresses, never with a trailing full stop or an unopened bracket", () => {
    for (const note of [ending.bibliography, ending.imageCredits]) {
      if (isSlot(note)) continue;
      for (const entry of parseReferences(note).flatMap((g) => g.entries)) {
        const segments = linkSegments(entry);
        expect(segments.map((s) => s.text).join("")).toBe(entry);
        for (const s of segments.filter((x) => x.href)) expect(s.href).toMatch(/^https:\/\/\S+[^.,;:)]$/);
      }
    }
  });
});
