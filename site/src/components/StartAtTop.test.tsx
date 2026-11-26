import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MotionProvider } from "@/motion/MotionProvider";
import { StartAtTop } from "./StartAtTop";

afterEach(() => {
  vi.restoreAllMocks();
  history.replaceState(null, "", location.pathname);
});

describe("StartAtTop", () => {
  it("treats a malformed hash like no target: no throw, no scrollIntoView, starts at the top", () => {
    history.replaceState(null, "", "#%E0%A4%A");
    // jsdom has no scrollIntoView; give it one to watch.
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    const scrollTo = vi.spyOn(window, "scrollTo");

    expect(() =>
      render(
        <MotionProvider>
          <StartAtTop />
        </MotionProvider>,
      ),
    ).not.toThrow();
    expect(scrollIntoView).not.toHaveBeenCalled();
    expect(scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
