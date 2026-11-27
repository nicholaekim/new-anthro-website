import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Highlight } from "@/content/regions";
import { slot } from "@/content/slot";
import type { Item } from "@/content/types";
import { fixtureItem } from "@/test/fixtures";

// jsdom has no layout: the viewport reports a fixed size, and a ResizeObserver reports once, on
// observe, as a browser does. The page is 10 by 10, so it is drawn 300 by 300 in a 400 by 300 view.
// dialogScrolls: whether the dialog is one scrolling column (below the breakpoint).
let dialogScrolls = true;
beforeEach(() => {
  sessionStorage.clear();
  dialogScrolls = true;
  class Observer {
    constructor(private readonly callback: ResizeObserverCallback) {}
    observe() {
      this.callback([], this as unknown as ResizeObserver);
    }
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal("ResizeObserver", Observer);
  const size = (el: Element, viewport: number, dialog: number) =>
    el.matches("[data-viewer-viewport]") ? viewport : el.matches("dialog") ? dialog : 0;
  vi.spyOn(Element.prototype, "clientWidth", "get").mockImplementation(function (this: Element) {
    return size(this, 400, 1000);
  });
  vi.spyOn(Element.prototype, "clientHeight", "get").mockImplementation(function (this: Element) {
    return size(this, 300, 800);
  });
  vi.spyOn(Element.prototype, "scrollHeight", "get").mockImplementation(function (this: Element) {
    return this.matches("dialog") && dialogScrolls ? 2000 : size(this, 300, 800);
  });
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  sessionStorage.clear();
});

function scan(): { item: Item; highlights: Highlight[] } {
  const item = fixtureItem("item");
  item.image = { src: "/scan.png", width: 10, height: 10 };
  item.annotations = [{ id: "item-annotation-1", text: slot("first annotation") }];
  const highlights: Highlight[] = [
    { id: "h-1", label: "Paragraph 1", region: { x: 0.1, y: 0.1, w: 0.3, h: 0.1 }, annotationIds: ["item-annotation-1"] },
    { id: "h-2", label: "Paragraph 2", region: { x: 0.1, y: 0.5, w: 0.3, h: 0.1 }, annotationIds: [] },
  ];
  return { item, highlights };
}

// The modules are loaded fresh, as a page load would, so the stored motion mode is read.
async function openViewer(mode: "full" | "still" = "still") {
  sessionStorage.setItem("opmb:motion", mode);
  vi.resetModules();
  const [{ MotionProvider }, { CloseView }, { gsap }] = await Promise.all([
    import("@/motion/MotionProvider"),
    import("../CloseView"),
    import("@/motion/gsap"),
  ]);
  const { item, highlights } = scan();
  const user = userEvent.setup();
  render(
    <MotionProvider>
      <CloseView item={item} highlights={highlights} />
    </MotionProvider>,
  );
  await user.click(screen.getByRole("button", { name: /open close view/i }));
  const dialog = document.querySelector("dialog") as HTMLDialogElement;
  const area = within(dialog).getByRole("group", { name: "Page image" });
  const page = () => (area.querySelector("[data-viewer-page]") as HTMLElement).style.transform;
  return { dialog, area, page, user, gsap };
}

// The whole page, centred across the view.
const WHOLE = "translate(50px) scale(1)";

const wheel = (el: Element, init: WheelEventInit) => {
  const event = new WheelEvent("wheel", { cancelable: true, bubbles: true, ...init });
  act(() => {
    el.dispatchEvent(event);
  });
  return event;
};

describe("the viewer's page", () => {
  it("draws one outline button per highlight, named by its label, over the page at its whole size", async () => {
    const { area, page } = await openViewer();
    expect(page()).toBe(WHOLE);
    expect(within(area).getAllByRole("button").map((b) => b.getAttribute("aria-label"))).toEqual(["Paragraph 1", "Paragraph 2"]);
  });

  it("marks an outline chosen, zooms to it, and says so", async () => {
    const { dialog, area, page, user } = await openViewer();
    const outline = within(area).getByRole("button", { name: "Paragraph 2" });
    await user.click(outline);
    expect(outline).toHaveAttribute("aria-current", "true");
    expect(within(area).getByRole("button", { name: "Paragraph 1" })).not.toHaveAttribute("aria-current");
    expect(page()).not.toBe(WHOLE);
    expect(dialog).toHaveTextContent("Showing Paragraph 2.");
  });

  it("moves and zooms by keys only while the image area itself has focus", async () => {
    const { area, page } = await openViewer();
    const outline = within(area).getByRole("button", { name: "Paragraph 1" });
    const start = page();
    fireEvent.keyDown(outline, { key: "+" });
    fireEvent.keyDown(outline, { key: "ArrowUp" });
    expect(page()).toBe(start);
    fireEvent.keyDown(area, { key: "+" });
    const zoomed = page();
    expect(zoomed).toContain("scale(1.25)");
    fireEvent.keyDown(area, { key: "ArrowUp" });
    expect(page()).not.toBe(zoomed);
    fireEvent.keyDown(area, { key: "-" });
    expect(page()).toContain("scale(1)");
  });

  it("announces the zoom after Reset and Fit width", async () => {
    const { dialog, user } = await openViewer();
    await user.click(within(dialog).getByRole("button", { name: "Fit width" }));
    expect(dialog).toHaveTextContent("Zoom 133 percent");
    await user.click(within(dialog).getByRole("button", { name: /reset/i }));
    expect(dialog).toHaveTextContent("Zoom 100 percent");
  });

  it("in still mode moves at once and never starts a tween", async () => {
    const { dialog, area, page, user, gsap } = await openViewer("still");
    const to = vi.spyOn(gsap, "to");
    await user.click(within(dialog).getByRole("button", { name: "Fit width" }));
    expect(page()).toContain("scale(1.333");
    await user.click(within(area).getByRole("button", { name: "Paragraph 1" }));
    await user.click(within(dialog).getByRole("button", { name: /reset/i }));
    expect(page()).toBe(WHOLE);
    expect(to).not.toHaveBeenCalled();
  });

  it("in full motion glides to a chosen view", async () => {
    const { dialog, user, gsap } = await openViewer("full");
    const to = vi.spyOn(gsap, "to");
    await user.click(within(dialog).getByRole("button", { name: "Fit width" }));
    expect(to).toHaveBeenCalled();
  });
});

describe("scrolling past the page", () => {
  it("lets the wheel scroll the dialog while the page is whole and the dialog scrolls; zooms once zoomed in", async () => {
    const { area, page } = await openViewer();
    expect(wheel(area, { deltaY: 100 }).defaultPrevented).toBe(false);
    expect(wheel(area, { deltaY: -100 }).defaultPrevented).toBe(false);
    expect(page()).toContain("scale(1)");
    // A pinch on a trackpad (ctrl and the wheel) still zooms.
    expect(wheel(area, { deltaY: -50, ctrlKey: true }).defaultPrevented).toBe(true);
    expect(page()).not.toContain("scale(1)");
    expect(wheel(area, { deltaY: -100 }).defaultPrevented).toBe(true);
  });

  it("zooms with the wheel when the dialog does not scroll (side by side)", async () => {
    dialogScrolls = false;
    const { area, page } = await openViewer();
    expect(wheel(area, { deltaY: -100 }).defaultPrevented).toBe(true);
    expect(page()).not.toContain("scale(1)");
  });

  it("leaves vertical touch scrolling to the browser while the page is whole, and pans once zoomed", async () => {
    const { area } = await openViewer();
    expect(area.style.touchAction).toBe("pan-y");
    fireEvent.keyDown(area, { key: "+" });
    expect(area.style.touchAction).toBe("none");
  });
});
