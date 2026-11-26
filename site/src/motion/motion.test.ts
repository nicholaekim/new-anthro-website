import { describe, expect, it } from "vitest";
import { eraFromProgress, scrollTargetForEra } from "./era";
import { resolveMotionMode } from "./motionMode";

describe("resolveMotionMode", () => {
  it("follows the system preference when there is no override", () => {
    expect(resolveMotionMode(true, null)).toBe("still");
    expect(resolveMotionMode(false, null)).toBe("full");
  });

  it("lets the visible switch override the system preference", () => {
    expect(resolveMotionMode(true, "full")).toBe("full");
    expect(resolveMotionMode(false, "still")).toBe("still");
  });
});

describe("eraFromProgress", () => {
  it("is historical below half way and present from half way", () => {
    expect(eraFromProgress(0)).toBe("historical");
    expect(eraFromProgress(0.49)).toBe("historical");
    expect(eraFromProgress(0.5)).toBe("present");
    expect(eraFromProgress(1)).toBe("present");
  });
});

describe("scrollTargetForEra", () => {
  it("is the trigger's start for the historical era and its end for the present", () => {
    expect(scrollTargetForEra(100, 900, "historical")).toBe(100);
    expect(scrollTargetForEra(100, 900, "present")).toBe(900);
  });
});
