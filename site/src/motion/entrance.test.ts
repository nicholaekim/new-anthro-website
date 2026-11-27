import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { coverHoldMs, startsBelowView } from "./entrance";
import { DURATION, HOUSE_CURVE } from "./gsap";

describe("startsBelowView", () => {
  it("is true only for an element whose top is at or below the bottom of the view", () => {
    expect(startsBelowView(800, 800)).toBe(true);
    expect(startsBelowView(1400, 800)).toBe(true);
    expect(startsBelowView(799, 800)).toBe(false);
    expect(startsBelowView(0, 800)).toBe(false);
  });

  it("is false for an element above the view, which the reader has already passed", () => {
    expect(startsBelowView(-300, 800)).toBe(false);
  });
});

describe("coverHoldMs", () => {
  it("waits out what is left of the hold since the cover closed", () => {
    expect(coverHoldMs(1000, 1000, 700)).toBe(700);
    expect(coverHoldMs(1000, 1500, 700)).toBe(200);
  });

  it("is 0 once the hold has passed, or when the cover has not closed", () => {
    expect(coverHoldMs(1000, 1700, 700)).toBe(0);
    expect(coverHoldMs(1000, 5000, 700)).toBe(0);
    expect(coverHoldMs(null, 5000, 700)).toBe(0);
  });
});

describe("motion tokens", () => {
  it("are the same in the CSS as in gsap.ts", () => {
    const css = readFileSync(resolve(process.cwd(), "src/app/globals.css"), "utf8");
    expect(css).toContain(`--ease-house: cubic-bezier(${HOUSE_CURVE.split(",").join(", ")});`);
    expect(css).toContain(`--duration-quick: ${DURATION.quick * 1000}ms;`);
  });
});
