import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MotionProvider } from "./MotionProvider";
import { MotionReady } from "./MotionReady";
import { PENDING_ATTR } from "./pending";
import { Reveal } from "./Reveal";

// jsdom has no layout, so line splitting means nothing here: watch the constructor instead.
const split = vi.hoisted(() => ({ created: [] as { target: unknown; vars: Record<string, unknown> }[] }));
vi.mock("gsap/SplitText", () => {
  class SplitText {
    lines: Element[] = [];
    constructor(target: unknown, vars: Record<string, unknown>) {
      split.created.push({ target, vars });
    }
    revert() {}
    kill() {}
    static register() {}
  }
  return { SplitText, default: SplitText };
});

const realMatchMedia = window.matchMedia;
afterEach(() => {
  window.matchMedia = realMatchMedia;
  split.created.length = 0;
  document.documentElement.removeAttribute(PENDING_ATTR);
});

// The system asks for reduced motion and there is no override: the provider resolves to still.
function preferReducedMotion() {
  window.matchMedia = (media: string) => ({ ...realMatchMedia(media), matches: media === "(prefers-reduced-motion: reduce)" });
}

describe("Reveal", () => {
  it("renders an h1 marked for reveal whose accessible name is its text", () => {
    render(
      <Reveal className="font-title">
        Fixture title <span>second part</span>
      </Reveal>,
    );
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveAttribute("data-reveal");
    expect(heading).toHaveClass("font-title");
    expect(heading).toHaveAccessibleName(heading.textContent ?? "");
  });

  it("in still mode splits nothing and leaves no inline style", () => {
    preferReducedMotion();
    render(
      <MotionProvider>
        <Reveal>Fixture title</Reveal>
      </MotionProvider>,
    );
    expect(split.created).toHaveLength(0);
    expect(screen.getByRole("heading", { level: 1 })).not.toHaveAttribute("style");
  });

  it("in full mode splits the h1 into masked lines that re-split, with the tween built in onSplit", () => {
    render(
      <MotionProvider>
        <Reveal>Fixture title</Reveal>
      </MotionProvider>,
    );
    expect(split.created).toHaveLength(1);
    const { target, vars } = split.created[0];
    expect(target).toBe(screen.getByRole("heading", { level: 1 }));
    expect(vars).toMatchObject({ type: "lines", mask: "lines", autoSplit: true });
    expect(vars.aria).toBeUndefined(); // SplitText's default labelling stays on
    expect(typeof vars.onSplit).toBe("function");
  });

  it("builds a tween in onSplit that reverts the split once the lines are in place", () => {
    render(
      <MotionProvider>
        <Reveal>Fixture title</Reveal>
      </MotionProvider>,
    );
    const onSplit = split.created[0].vars.onSplit as (self: { lines: Element[]; revert: () => void }) => gsap.core.Tween;
    const line = document.createElement("div");
    const revert = vi.fn();
    const tween = onSplit({ lines: [line], revert });
    expect(revert).not.toHaveBeenCalled();
    tween.progress(1);
    expect(revert).toHaveBeenCalledTimes(1);
  });
});

describe("MotionReady", () => {
  it("removes the pending mark on mount", () => {
    document.documentElement.setAttribute(PENDING_ATTR, "");
    render(
      <MotionProvider>
        <MotionReady />
      </MotionProvider>,
    );
    expect(document.documentElement.hasAttribute(PENDING_ATTR)).toBe(false);
  });
});
