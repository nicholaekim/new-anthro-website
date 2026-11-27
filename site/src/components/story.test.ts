import { describe, expect, it } from "vitest";
import { fixtureChapter } from "@/test/fixtures";
import {
  activeIndex,
  confidenceSteps,
  CONFIDENCE_WORDS,
  emphasisFor,
  factMarks,
  factsUsedAt,
  neighbours,
  progressBetween,
  sectionTag,
  placeAt,
  scrollForPlace,
  stepIndex,
} from "./story";

describe("activeIndex", () => {
  it("is the first section before any top reaches the line", () => {
    expect(activeIndex([100, 500, 900], 50)).toBe(0);
  });

  it("is the last section whose top is at or above the line", () => {
    expect(activeIndex([-800, -200, 300, 900], 320)).toBe(2);
    expect(activeIndex([-800, -200, 320, 900], 320)).toBe(2);
    expect(activeIndex([-800, -200, 321, 900], 320)).toBe(1);
  });

  it("is the last section once every top has passed the line", () => {
    expect(activeIndex([-900, -500, -100], 0)).toBe(2);
  });

  it("is -1 with no sections", () => {
    expect(activeIndex([], 100)).toBe(-1);
  });
});

describe("progressBetween", () => {
  it("runs from 0 at the start to 1 at the end, clamped", () => {
    expect(progressBetween(-50, 0, 1000)).toBe(0);
    expect(progressBetween(0, 0, 1000)).toBe(0);
    expect(progressBetween(250, 0, 1000)).toBe(0.25);
    expect(progressBetween(1000, 0, 1000)).toBe(1);
    expect(progressBetween(1500, 0, 1000)).toBe(1);
  });

  it("is 0 when there is nothing to scroll", () => {
    expect(progressBetween(0, 0, 0)).toBe(0);
    expect(progressBetween(10, 20, 5)).toBe(0);
  });
});

describe("neighbours", () => {
  const beats = [1, 2, 3, 4, 6, 7, 8];

  it("gives the sections either side of the active one, skipping a missing beat", () => {
    expect(neighbours(beats, 4)).toEqual({ previous: 3, next: 6 });
    expect(neighbours(beats, 6)).toEqual({ previous: 4, next: 7 });
  });

  it("has no previous at the first section and no next at the last", () => {
    expect(neighbours(beats, 1)).toEqual({ previous: null, next: 2 });
    expect(neighbours(beats, 8)).toEqual({ previous: 7, next: null });
  });

  it("treats an unknown active section as the first", () => {
    expect(neighbours(beats, null)).toEqual({ previous: null, next: 2 });
  });
});

describe("stepIndex", () => {
  // The scroll-padding line at 64px; sections 2 and 3 are short, both below the line.
  const tops = [-2000, -300, 64, 200, 400, 1800];

  it("goes next to the first section below the line, even a short one the reading line has passed", () => {
    expect(stepIndex(tops, 64, 1)).toBe(3);
    expect(stepIndex([-500, 63.5, 300], 64, 1)).toBe(2);
  });

  it("goes back to the last section above the line, not the one sitting on it", () => {
    expect(stepIndex(tops, 64, -1)).toBe(1);
    expect(stepIndex([-500, -100, 64.5, 300], 64, -1)).toBe(1);
  });

  it("is -1 when there is nowhere to go", () => {
    expect(stepIndex([64, 900], 64, -1)).toBe(-1);
    expect(stepIndex([-900, -300, 64], 64, 1)).toBe(-1);
    expect(stepIndex([], 64, 1)).toBe(-1);
  });
});

describe("placeAt and scrollForPlace", () => {
  // Three sections, 1000, 400 and 2000px tall, starting at the document's top; line 64.
  const heights = [1000, 400, 2000];

  it("is the section at the line and how far into it the line is, as a share of its height", () => {
    // Scrolled 1164px: the line (64px from the view's top) is 1228px down, 228px into section 2.
    expect(placeAt([-1164, -164, 236], heights, 64)).toEqual({ index: 1, fraction: 0.57 });
    expect(placeAt([0, 1000, 1400], heights, 64)).toEqual({ index: 0, fraction: 0.064 });
  });

  it("finds the same place again after the sections change height", () => {
    const place = { index: 2, fraction: 0.25 };
    // Section 1 lost 300px (a pin's spacing removed); section 3 is now 1600px tall.
    expect(scrollForPlace(place, [0, 700, 1100], [700, 400, 1600], 64)).toBe(1100 + 400 - 64);
  });

  it("never scrolls above the top", () => {
    expect(scrollForPlace({ index: 0, fraction: 0 }, [0, 1000], [1000, 500], 64)).toBe(0);
  });

  it("before any section, keeps to the first at its start", () => {
    expect(placeAt([300, 1300], [1000, 500], 64)).toEqual({ index: 0, fraction: 0 });
  });
});

describe("sectionTag", () => {
  it("is the two-digit number and the section's label", () => {
    expect(sectionTag(4)).toBe("04 Basis");
    expect(sectionTag(6)).toBe("06 Change of date");
  });
});

describe("factMarks", () => {
  it("says for each era whether its rule uses the fact", () => {
    const c = fixtureChapter(30);
    if (!c.basis || !c.present.basis) throw new Error("fixture needs both bases");
    c.basis.cardFactsUsed = ["fact-1"];
    c.present.basis.cardFactsUsed = ["fact-1", "fact-2"];
    expect(factMarks(c, "fact-1").map((m) => [m.era, m.used, m.label])).toEqual([
      ["historical", true, "1930: used"],
      ["present", true, "2020: used"],
    ]);
    expect(factMarks(c, "fact-2").map((m) => m.label)).toEqual(["1930: not used", "2020: used"]);
    expect(factMarks(c, "fact-3").map((m) => m.used)).toEqual([false, false]);
  });

  it("links a used mark to the section that quotes that era's rule", () => {
    const c = fixtureChapter(30);
    if (!c.basis || !c.present.basis) throw new Error("fixture needs both bases");
    c.basis.cardFactsUsed = ["fact-1"];
    c.present.basis.cardFactsUsed = ["fact-1"];
    expect(factMarks(c, "fact-1").map((m) => m.beat)).toEqual([4, 7]);
  });

  it("counts an era without a basis as not using the fact", () => {
    const c = fixtureChapter(30);
    c.basis = null;
    expect(factMarks(c, "fact-1")[0].used).toBe(false);
  });
});

describe("emphasisFor", () => {
  it("is the historical rule at basis and outcome, the 2020 rule at the present day, none elsewhere", () => {
    expect([1, 2, 3, 4, 5, 6, 7, 8, null].map((beat) => emphasisFor(beat))).toEqual([
      null,
      null,
      null,
      "historical",
      "historical",
      null,
      "present",
      null,
      null,
    ]);
  });

  it("is the era in view at the change of date, and only there", () => {
    expect(emphasisFor(6, "historical")).toBe("historical");
    expect(emphasisFor(6, "present")).toBe("present");
    expect(emphasisFor(4, "present")).toBe("historical");
    expect(emphasisFor(7, "historical")).toBe("present");
    expect(emphasisFor(3, "present")).toBeNull();
  });
});

describe("factsUsedAt", () => {
  it("is the facts the rule in view uses, and none where no rule is in view", () => {
    const c = fixtureChapter();
    if (!c.basis || !c.present.basis) throw new Error("fixture needs both bases");
    c.basis.cardFactsUsed = ["fact-1"];
    c.present.basis.cardFactsUsed = ["fact-2", "fact-4"];
    expect(factsUsedAt(c, 4)).toEqual(["fact-1"]);
    expect(factsUsedAt(c, 5)).toEqual(["fact-1"]);
    expect(factsUsedAt(c, 7)).toEqual(["fact-2", "fact-4"]);
    expect(factsUsedAt(c, 2)).toEqual([]);
    expect(factsUsedAt(c, null)).toEqual([]);
    expect(factsUsedAt(c, 6)).toEqual([]);
    expect(factsUsedAt(c, 6, "historical")).toEqual(["fact-1"]);
    expect(factsUsedAt(c, 6, "present")).toEqual(["fact-2", "fact-4"]);
  });
});

describe("confidence", () => {
  it("fills more of the four steps the more determinable the outcome", () => {
    expect(confidenceSteps("high")).toBe(4);
    expect(confidenceSteps("moderate")).toBe(3);
    expect(confidenceSteps("low")).toBe(2);
    expect(confidenceSteps("undetermined")).toBe(0);
  });

  it("names each level in words", () => {
    expect(CONFIDENCE_WORDS).toEqual({
      high: "High",
      moderate: "Moderate",
      low: "Low",
      undetermined: "Cannot be determined",
    });
  });
});
