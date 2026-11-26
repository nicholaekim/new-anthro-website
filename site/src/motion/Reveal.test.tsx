import { act, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CoverContext } from "./CoverProvider";
import type { CoverState } from "./cover";
import { MotionProvider } from "./MotionProvider";
import { MotionReady } from "./MotionReady";
import { PENDING_ATTR } from "./pending";
import { Reveal } from "./Reveal";

// jsdom has no layout, so line splitting means nothing here: watch the constructor instead. Like
// the real one, the stand-in remembers the target's markup and restores it with innerHTML.
type SplitStandIn = { lines: Element[]; revert: () => void };
const split = vi.hoisted(() => ({
  created: [] as { target: unknown; vars: Record<string, unknown>; instance: SplitStandIn }[],
}));
vi.mock("gsap/SplitText", () => {
  class SplitText {
    lines: Element[] = [];
    isSplit = true;
    html: string;
    target: Element;
    constructor(target: Element, vars: Record<string, unknown>) {
      this.target = target;
      this.html = target.innerHTML;
      split.created.push({ target, vars, instance: this });
    }
    revert() {
      if (!this.isSplit) return;
      this.isSplit = false;
      this.target.innerHTML = this.html;
    }
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

type OnSplit = (self: SplitStandIn) => gsap.core.Tween;
const onSplitOf = (i = 0) => split.created[i].vars.onSplit as OnSplit;

describe("Reveal keeps React's own nodes", () => {
  it("puts the original child nodes back when the reveal ends, and React can still update them", () => {
    let original: HTMLSpanElement | null = null;
    const page = (children: ReactNode) => (
      <MotionProvider>
        <Reveal>{children}</Reveal>
      </MotionProvider>
    );
    const { rerender } = render(page(<span ref={(el) => void (original ??= el)}>first title</span>));
    const { instance } = split.created[0];
    act(() => {
      onSplitOf()(instance).progress(1);
    });
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.firstChild).toBe(original);
    expect(heading.childNodes).toHaveLength(1);
    expect(heading).not.toHaveAttribute("aria-label");
    expect(() =>
      rerender(
        page(
          <>
            second title <em>part</em>
          </>,
        ),
      ),
    ).not.toThrow();
    expect(heading).toHaveTextContent("second title part");
    expect(heading.querySelector("span")).toBeNull();
  });

  it("puts the original child nodes back when unmounted mid-reveal", () => {
    let original: HTMLSpanElement | null = null;
    const { unmount, container } = render(
      <MotionProvider>
        <Reveal>
          <span ref={(el) => void (original ??= el)}>title</span>
        </Reveal>
      </MotionProvider>,
    );
    const heading = container.querySelector("h1");
    onSplitOf()(split.created[0].instance);
    unmount();
    expect(heading?.firstChild).toBe(original);
  });
});

describe("Reveal under the cover", () => {
  function underCover(state: CoverState) {
    return (
      <MotionProvider>
        <CoverContext value={{ state, start: () => false }}>
          <Reveal>title</Reveal>
        </CoverContext>
      </MotionProvider>
    );
  }

  it.each<CoverState>(["closing", "covered"])("holds the tween paused while the cover is %s, and plays it when the cover opens", (state) => {
    const { rerender } = render(underCover(state));
    const tween = onSplitOf()({ lines: [document.createElement("div")], revert: () => {} });
    expect(tween.paused()).toBe(true);
    rerender(underCover("opening"));
    expect(tween.paused()).toBe(false);
  });
});
