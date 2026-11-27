import { describe, expect, it } from "vitest";
import { progressBetween } from "@/components/story";
import { eraYear, progressFromYear, rangeValueText, scrollForProgress, yearFromProgress } from "./era";

describe("yearFromProgress", () => {
  it("is the historical year at 0, 2020 at 1, and whole years between", () => {
    expect(yearFromProgress(0, 1930, 2020)).toBe(1930);
    expect(yearFromProgress(1, 1930, 2020)).toBe(2020);
    expect(yearFromProgress(0.5, 1930, 2020)).toBe(1975);
    expect(yearFromProgress(0.333, 1930, 2020)).toBe(1960);
  });

  it("stays within the two years", () => {
    expect(yearFromProgress(-0.2, 1930, 2020)).toBe(1930);
    expect(yearFromProgress(1.4, 1930, 2020)).toBe(2020);
  });
});

describe("progressFromYear", () => {
  it("is 0 at the historical year, 1 at 2020, clamped outside them", () => {
    expect(progressFromYear(1930, 1930, 2020)).toBe(0);
    expect(progressFromYear(2020, 1930, 2020)).toBe(1);
    expect(progressFromYear(1975, 1930, 2020)).toBe(0.5);
    expect(progressFromYear(1900, 1930, 2020)).toBe(0);
    expect(progressFromYear(2100, 1930, 2020)).toBe(1);
  });

  it("is 0 when the two years are the same", () => {
    expect(progressFromYear(2020, 2020, 2020)).toBe(0);
  });
});

describe("scrollForProgress", () => {
  it("is the pin's start at 0, its end at 1, and in proportion between", () => {
    expect(scrollForProgress(0, 1000, 2200)).toBe(1000);
    expect(scrollForProgress(1, 1000, 2200)).toBe(2200);
    expect(scrollForProgress(0.25, 1000, 2200)).toBe(1300);
    expect(scrollForProgress(2, 1000, 2200)).toBe(2200);
    expect(scrollForProgress(-1, 1000, 2200)).toBe(1000);
  });

  it("comes back to the same year after the page is scrolled to a whole pixel", () => {
    // The range scrolls the page; the scroll position then sets the range. They must agree.
    for (const [from, start, end] of [
      [1930, 1000, 2200],
      [1950, 3517, 4317],
      [1955, 0, 640],
    ]) {
      for (let year = from; year <= 2020; year++) {
        const scroll = Math.round(scrollForProgress(progressFromYear(year, from, 2020), start, end));
        expect(yearFromProgress(progressBetween(scroll, start, end), from, 2020)).toBe(year);
      }
    }
  });
});

describe("eraYear", () => {
  it("is the year of the era in view: the historical year below half way, 2020 from half way", () => {
    expect(eraYear(0, 1930, 2020)).toBe(1930);
    expect(eraYear(0.49, 1930, 2020)).toBe(1930);
    expect(eraYear(0.5, 1930, 2020)).toBe(2020);
  });
});

describe("rangeValueText", () => {
  it("names the year in view, and the year the range is at when that differs", () => {
    expect(rangeValueText(1930, 1930, 2020)).toBe("1930 in view");
    expect(rangeValueText(1962, 1930, 2020)).toBe("1962, 1930 in view");
    expect(rangeValueText(1975, 1930, 2020)).toBe("1975, 2020 in view");
    expect(rangeValueText(2020, 1930, 2020)).toBe("2020 in view");
  });
});
