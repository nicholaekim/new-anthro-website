import { describe, expect, it, vi } from "vitest";
import { MOTION_ATTR, resolveMotionMode, type MotionMode } from "./motionMode";
import { PENDING_ATTR, PENDING_FAILSAFE_MS, pendingScript, shouldMarkPending } from "./pending";

const combinations: [boolean, MotionMode | null][] = [
  [true, null],
  [false, null],
  [true, "full"],
  [false, "full"],
  [true, "still"],
  [false, "still"],
];

// Runs the inline script against stand-ins for the globals it reads.
function runScript(systemReduced: boolean, storage: { getItem: (key: string) => string | null }) {
  const attrs = new Map<string, string>();
  const root = {
    setAttribute: (name: string, value: string) => attrs.set(name, value),
    removeAttribute: (name: string) => attrs.delete(name),
  };
  const timers: [() => void, number][] = [];
  const run = new Function("document", "sessionStorage", "matchMedia", "setTimeout", pendingScript());
  run(
    { documentElement: root },
    storage,
    (query: string) => ({ matches: query === "(prefers-reduced-motion: reduce)" && systemReduced }),
    (fn: () => void, ms: number) => timers.push([fn, ms]),
  );
  return { attrs, timers };
}

describe("shouldMarkPending", () => {
  it.each(combinations)("reduced %s, override %s: agrees with resolveMotionMode", (reduced, override) => {
    expect(shouldMarkPending(reduced, override)).toBe(resolveMotionMode(reduced, override) === "full");
  });
});

describe("pendingScript", () => {
  it.each(combinations)("reduced %s, override %s: marks the document exactly when motion will be full", (reduced, override) => {
    const { attrs, timers } = runScript(reduced, { getItem: (key) => (key === "opmb:motion" ? override : null) });
    const marked = shouldMarkPending(reduced, override);
    expect(attrs.has(PENDING_ATTR)).toBe(marked);
    if (!marked) {
      expect(timers).toHaveLength(0);
      return;
    }
    expect(timers).toHaveLength(1);
    expect(timers[0][1]).toBe(PENDING_FAILSAFE_MS);
    expect(PENDING_FAILSAFE_MS).toBe(2500);
    timers[0][0]();
    expect(attrs.has(PENDING_ATTR)).toBe(false);
  });

  it.each(combinations)("reduced %s, override %s: sets data-motion to the mode", (reduced, override) => {
    const { attrs } = runScript(reduced, { getItem: (key) => (key === "opmb:motion" ? override : null) });
    expect(attrs.get(MOTION_ATTR)).toBe(resolveMotionMode(reduced, override));
  });

  it("treats storage that throws as no override, without throwing", () => {
    const throwing = {
      getItem: vi.fn(() => {
        throw new Error("blocked");
      }),
    };
    expect(() => runScript(false, throwing)).not.toThrow();
    expect(runScript(false, throwing).attrs.has(PENDING_ATTR)).toBe(true);
    expect(runScript(true, throwing).attrs.has(PENDING_ATTR)).toBe(false);
  });
});
