import { describe, expect, it } from "vitest";
import { chapters, getChapter, person } from "@/content";
import { isSlot, type Text } from "@/content/slot";
import type { Chapter } from "@/content/types";
import { validateChapter } from "@/content/validate";

// String fields that are real values rather than research slots.
const EXEMPT_KEYS = new Set([
  "id",
  "slug",
  "place",
  "country",
  "kind",
  "status",
  "historicalItemId",
  "presentItemId",
  "cardFactsUsed",
  "src",
  "largeSrc",
]);

function nonSlotStrings(value: unknown, path: string, out: string[]): void {
  if (typeof value === "string") {
    out.push(path);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => nonSlotStrings(v, `${path}[${i}]`, out));
    return;
  }
  if (value !== null && typeof value === "object") {
    if (isSlot(value as Text)) return;
    for (const [key, v] of Object.entries(value)) {
      if (EXEMPT_KEYS.has(key)) continue;
      nonSlotStrings(v, `${path}.${key}`, out);
    }
  }
}

function countSlots(value: unknown): number {
  if (Array.isArray(value)) return value.reduce((n: number, v) => n + countSlots(v), 0);
  if (value !== null && typeof value === "object") {
    if (isSlot(value as Text)) return 1;
    return Object.values(value).reduce((n: number, v) => n + countSlots(v), 0);
  }
  return 0;
}

function louisianaCopy(): Chapter {
  const c = getChapter("louisiana");
  if (!c) throw new Error("louisiana chapter missing");
  return structuredClone(c);
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

  it("holds only slots in every research field", () => {
    const found: string[] = [];
    nonSlotStrings(chapters, "chapters", found);
    nonSlotStrings(person, "person", found);
    expect(found).toEqual([]);
    expect(countSlots(chapters)).toBeGreaterThan(0);
    expect(countSlots(person)).toBeGreaterThan(0);
  });

  it("returns undefined for an unknown slug", () => {
    expect(getChapter("nope")).toBeUndefined();
  });
});

describe("validateChapter", () => {
  it("reports a document with an image but no transcription", () => {
    const c = louisianaCopy();
    const doc = c.items.find((i) => i.kind === "document");
    if (!doc) throw new Error("fixture needs a document item");
    doc.image = { src: "/placeholder.png", width: 10, height: 10 };
    doc.transcription = null;
    expect(validateChapter(c)).not.toEqual([]);
  });

  it("reports a change of date naming an unknown historical item", () => {
    const c = louisianaCopy();
    if (!c.changeOfDate) throw new Error("fixture needs a change of date");
    c.changeOfDate.historicalItemId = "missing-item";
    expect(validateChapter(c)).not.toEqual([]);
  });

  it("reports a change of date naming an unknown present-day item", () => {
    const c = louisianaCopy();
    if (!c.changeOfDate) throw new Error("fixture needs a change of date");
    c.changeOfDate.presentItemId = "missing-item";
    expect(validateChapter(c)).not.toEqual([]);
  });

  it("reports a basis using a fact not on the person card", () => {
    const c = louisianaCopy();
    if (!c.basis) throw new Error("fixture needs a basis");
    c.basis.cardFactsUsed = ["no-such-fact"];
    expect(validateChapter(c)).not.toEqual([]);
  });

  it("reports a present-day basis using a fact not on the person card", () => {
    const c = louisianaCopy();
    if (!c.present.basis) throw new Error("fixture needs a present-day basis");
    c.present.basis.cardFactsUsed = ["no-such-fact"];
    expect(validateChapter(c)).not.toEqual([]);
  });
});
