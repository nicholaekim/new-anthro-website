import { describe, expect, it } from "vitest";
import { fixtureChapter } from "@/test/fixtures";
import { cellHref, matrixCell, MATRIX_VIEWS } from "./matrix";

describe("MATRIX_VIEWS", () => {
  it("lists the three views in order", () => {
    expect(MATRIX_VIEWS.map((v) => v.view)).toEqual(["decides", "evidence", "outcome"]);
  });
});

describe("matrixCell", () => {
  const c = fixtureChapter(1);

  it("shows each era's summary, linked to the section that quotes that era's rule", () => {
    expect(matrixCell(c, "historical", "decides")).toEqual({ kind: "text", text: c.summary.historical.decides, beat: 4 });
    expect(matrixCell(c, "historical", "evidence")).toEqual({ kind: "text", text: c.summary.historical.evidence, beat: 4 });
    expect(matrixCell(c, "present", "decides")).toEqual({ kind: "text", text: c.summary.present.decides, beat: 7 });
    expect(matrixCell(c, "present", "evidence")).toEqual({ kind: "text", text: c.summary.present.evidence, beat: 7 });
  });

  it("shows each era's outcome level and full text, linked to the section that gives it", () => {
    expect(matrixCell(c, "historical", "outcome")).toEqual({
      kind: "outcome",
      level: "high",
      text: c.outcome?.text,
      confidence: c.outcome?.confidence,
      citation: c.outcome?.citation,
      beat: 5,
    });
    expect(matrixCell(c, "present", "outcome")).toEqual({
      kind: "outcome",
      level: "low",
      text: c.present.outcome?.text,
      confidence: c.present.outcome?.confidence,
      citation: c.present.outcome?.citation,
      beat: 7,
    });
  });

  it("for a chapter with no outcome, says none is given and links to the change of date, which says the same", () => {
    const none = fixtureChapter(4, { withOutcome: false, showPersonCard: false });
    expect(matrixCell(none, "historical", "outcome")).toEqual({ kind: "none", beat: 6 });
    expect(matrixCell(none, "present", "outcome")).toEqual({ kind: "none", beat: 6 });
    expect(matrixCell(none, "historical", "decides")).toEqual({ kind: "text", text: none.summary.historical.decides, beat: 4 });
  });
});

describe("cellHref", () => {
  it("is the chapter page at the section's anchor", () => {
    expect(cellHref("tobique", 6)).toBe("/chapters/tobique#beat-6");
  });
});
