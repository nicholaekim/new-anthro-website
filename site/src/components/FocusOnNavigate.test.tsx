import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FocusOnNavigate } from "./FocusOnNavigate";

const nav = vi.hoisted(() => ({ pathname: "/ending" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));

afterEach(() => {
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
});
