import { describe, expect, it } from "vitest";
import { clearStored } from "@/lib/storage";
import { OPENING_SEEN_KEY, shouldPlayOpening } from "./opening";

describe("shouldPlayOpening", () => {
  it("plays only in full motion when the opening has not been seen", () => {
    expect(shouldPlayOpening("full", false)).toBe(true);
    expect(shouldPlayOpening("full", true)).toBe(false);
    expect(shouldPlayOpening("still", false)).toBe(false);
    expect(shouldPlayOpening("still", true)).toBe(false);
  });
});

describe("OPENING_SEEN_KEY", () => {
  it("is cleared by clearStored, so Restart replays the opening", () => {
    expect(OPENING_SEEN_KEY).toBe("opmb:opening-seen");
    sessionStorage.setItem(OPENING_SEEN_KEY, "1");
    clearStored();
    expect(sessionStorage.getItem(OPENING_SEEN_KEY)).toBeNull();
  });
});
