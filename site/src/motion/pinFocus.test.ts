import { describe, expect, it } from "vitest";
import { scrollTargetForFocus } from "./pinFocus";

// The visible slot while pinned: between the header (40) and the beat bar (768).
const slot = { top: 40, bottom: 768 };

describe("scrollTargetForFocus", () => {
  it("leaves the page where it is when the focused element is wholly in the slot", () => {
    expect(scrollTargetForFocus({ top: 300, bottom: 330 }, slot, 2000, 16)).toBeNull();
  });

  it("scrolls past the pin's end by how far the element lies below the slot, plus the margin", () => {
    expect(scrollTargetForFocus({ top: 900, bottom: 930 }, slot, 2000, 16)).toBe(2000 + (930 - 768) + 16);
  });

  it("leaves the page where it is when the element is not below the slot, even if it starts above it", () => {
    expect(scrollTargetForFocus({ top: 10, bottom: 60 }, slot, 2000, 16)).toBeNull();
    expect(scrollTargetForFocus({ top: 700, bottom: 768 }, slot, 2000, 16)).toBeNull();
  });

  it("brings in an element that is only partly below the slot", () => {
    expect(scrollTargetForFocus({ top: 750, bottom: 780 }, slot, 2000, 16)).toBe(2000 + 12 + 16);
  });
});
