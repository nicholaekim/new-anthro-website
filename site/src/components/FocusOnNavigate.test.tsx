import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FocusOnNavigate } from "./FocusOnNavigate";

const nav = vi.hoisted(() => ({ pathname: "/ending" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));

afterEach(() => {
  vi.restoreAllMocks();
  nav.pathname = "/ending";
  history.replaceState(null, "", "/");
});

function Page() {
  return (
    <main>
      <h1>Chapter</h1>
      <section id="beat-4">
        <h2>04 Basis</h2>
      </section>
    </main>
  );
}

describe("FocusOnNavigate", () => {
  it("after a route change, focuses the new page's h1", () => {
    const { rerender } = render(<><Page /><FocusOnNavigate /></>);
    nav.pathname = "/chapters/a";
    rerender(<><Page /><FocusOnNavigate /></>);
    expect(document.activeElement).toHaveTextContent("Chapter");
  });

  // A link from the ending's matrix to a section (/chapters/a#beat-4): focusing the h1 would
  // scroll the page back to its top, away from the section the link named.
  it("when the new address names a section, focuses that section's heading instead", () => {
    const { rerender } = render(<><Page /><FocusOnNavigate /></>);
    history.replaceState(null, "", "/chapters/a#beat-4");
    nav.pathname = "/chapters/a";
    rerender(<><Page /><FocusOnNavigate /></>);
    expect(document.activeElement).toHaveTextContent("04 Basis");
  });

  // The page is already scrolled to the section (StartAtTop, after the pins' spacing): focusing
  // must not scroll a second time.
  it("focuses a section's heading without scrolling", () => {
    const focus = vi.spyOn(HTMLElement.prototype, "focus");
    const { rerender } = render(<><Page /><FocusOnNavigate /></>);
    history.replaceState(null, "", "/chapters/a#beat-4");
    nav.pathname = "/chapters/a";
    rerender(<><Page /><FocusOnNavigate /></>);
    expect(focus).toHaveBeenLastCalledWith({ preventScroll: true });
  });

  it("focuses an element the address names that has no heading, itself, without scrolling", () => {
    const focus = vi.spyOn(HTMLElement.prototype, "focus");
    const { rerender } = render(<><Page /><p id="note">A note</p><FocusOnNavigate /></>);
    history.replaceState(null, "", "/chapters/a#note");
    nav.pathname = "/chapters/a";
    rerender(<><Page /><p id="note">A note</p><FocusOnNavigate /></>);
    expect(document.activeElement).toHaveTextContent("A note");
    expect(document.activeElement).toHaveAttribute("tabindex", "-1");
    expect(focus).toHaveBeenLastCalledWith({ preventScroll: true });
  });

  it("falls back to the h1 when the address names nothing, or is malformed", () => {
    for (const hash of ["#nothing-here", "#%E0%A4%A"]) {
      const { rerender, unmount } = render(<><Page /><FocusOnNavigate /></>);
      history.replaceState(null, "", `/chapters/a${hash}`);
      nav.pathname = `/chapters/a${hash.length}`;
      rerender(<><Page /><FocusOnNavigate /></>);
      expect(document.activeElement).toHaveTextContent("Chapter");
      unmount();
      (document.activeElement as HTMLElement | null)?.blur();
    }
  });

  it("does nothing until the route changes", () => {
    render(<><Page /><FocusOnNavigate /></>);
    expect(document.activeElement).toBe(document.body);
  });
});
