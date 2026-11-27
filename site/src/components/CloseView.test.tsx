import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { Highlight } from "@/content/regions";
import { slot } from "@/content/slot";
import type { Item } from "@/content/types";
import { fixtureItem } from "@/test/fixtures";
import { CloseView } from "./CloseView";

function withLargeImage(): Item {
  const item = fixtureItem("item");
  item.image = { src: "/scan-small.png", width: 10, height: 10, largeSrc: "/scan-large.png" };
  return item;
}

function dialogOf(container: HTMLElement): HTMLDialogElement {
  const dialog = container.querySelector("dialog");
  if (!dialog) throw new Error("no dialog");
  return dialog;
}

async function openView(item: Item, highlights?: Highlight[]) {
  const user = userEvent.setup();
  const { container } = render(<CloseView item={item} highlights={highlights} />);
  await user.click(screen.getByRole("button", { name: /open close view/i }));
  return dialogOf(container);
}

describe("CloseView", () => {
  it("moves focus inside when opened and back to its opener when closed", async () => {
    const user = userEvent.setup();
    const { container } = render(<CloseView item={withLargeImage()} />);
    const dialog = dialogOf(container);
    const opener = screen.getByRole("button", { name: /open close view/i });

    await user.click(opener);
    expect(dialog).toHaveAttribute("open");
    expect(dialog).toContainElement(document.activeElement as HTMLElement);

    await user.click(within(dialog).getByRole("button", { name: /close/i }));
    expect(dialog).not.toHaveAttribute("open");
    expect(document.activeElement).toBe(opener);
  });

  it("has a visible heading naming it, a close button and a plain link to the large image", async () => {
    const dialog = await openView(withLargeImage());
    const heading = within(dialog).getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent(/close view/i);
    expect(dialog).toHaveAttribute("aria-labelledby", heading.id);
    expect(within(dialog).getByRole("button", { name: /close/i })).toBeInTheDocument();
    expect(within(dialog).getByRole("link", { name: /large image/i })).toHaveAttribute("href", "/scan-large.png");
  });

  it("names each opener after the item it opens", () => {
    const first = fixtureItem("first");
    const second = fixtureItem("second");
    first.provenance.title = slot("first fixture title");
    second.provenance.title = slot("second fixture title");
    render(
      <>
        <CloseView item={first} />
        <CloseView item={second} />
      </>,
    );
    const names = screen.getAllByRole("button", { name: /open close view/i }).map((b) => b.getAttribute("aria-label"));
    expect(screen.getByRole("button", { name: /open close view.*first fixture title/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /open close view.*second fixture title/i })).toBeInTheDocument();
    expect(new Set(names).size).toBe(2);
  });

  it("has no large-image link when the item has no large image", async () => {
    const dialog = await openView(fixtureItem("item"));
    expect(within(dialog).queryByRole("link")).toBeNull();
  });

  it('shows "No image" in the mount of an item without an image or a gap note', async () => {
    const dialog = await openView(fixtureItem("item"));
    expect(dialog.querySelector("[data-empty-mount]")).toHaveTextContent("No image");
  });

  it("shows the transcription, the annotations and the source information, in that order, without an image", async () => {
    const dialog = await openView(fixtureItem("item"));
    const text = dialog.textContent ?? "";
    const order = ["fixture transcription", "fixture annotation", "Source information"].map((t) => text.indexOf(t));
    expect(order.every((i) => i >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    expect(within(dialog).queryByRole("group", { name: "Page image" })).toBeNull();
  });

  it("shows a translated transcription as a labelled original and translation", async () => {
    const item = fixtureItem("item");
    item.translation = slot("fixture translation");
    const dialog = await openView(item);
    const parts = [...dialog.querySelectorAll("[data-language-part]")];
    expect(parts.map((p) => p.getAttribute("data-language-part"))).toEqual(["original", "translation"]);
    expect(parts[0]).toHaveTextContent(/Original.*fixture transcription/);
    expect(parts[1]).toHaveTextContent(/English translation.*fixture translation/);
  });

  it("shows the gap note in the mount of an item without an image", async () => {
    const item = fixtureItem("item");
    item.gapNote = slot("fixture gap note");
    const dialog = await openView(item);
    const mount = dialog.querySelector("[data-empty-mount]");
    expect(mount).toHaveTextContent("fixture gap note");
    expect(mount).not.toHaveTextContent("No image");
  });
});

describe("CloseView with highlights", () => {
  function scanWithHighlights(): { item: Item; highlights: Highlight[] } {
    const item = withLargeImage();
    item.annotations = [
      { id: "item-annotation-1", text: slot("first annotation") },
      { id: "item-annotation-2", text: slot("second annotation") },
    ];
    const highlights: Highlight[] = [
      { id: "h-1", label: "Paragraph 1", region: { x: 0.1, y: 0.1, w: 0.3, h: 0.1 }, annotationIds: ["item-annotation-2"] },
      { id: "h-2", label: "Paragraph 2", region: { x: 0.1, y: 0.5, w: 0.3, h: 0.1 }, annotationIds: [] },
    ];
    return { item, highlights };
  }

  it("lists the highlights under the image as buttons that open the close view at that highlight", async () => {
    const user = userEvent.setup();
    const { item, highlights } = scanWithHighlights();
    const { container } = render(<CloseView item={item} highlights={highlights} />);
    const list = screen.getByRole("list", { name: /highlights on this page/i });
    const opener = within(list).getByRole("button", { name: "Paragraph 1" });
    expect(within(list).getAllByRole("button").map((b) => b.textContent)).toEqual(["Paragraph 1", "Paragraph 2"]);

    await user.click(opener);
    const dialog = dialogOf(container);
    expect(dialog).toHaveAttribute("open");
    const chosen = within(dialog).getByRole("list", { name: "Highlights" }).querySelector('[aria-current="true"]');
    expect(chosen).toHaveTextContent("Paragraph 1");
    const marked = [...dialog.querySelectorAll('[data-annotation][aria-current="true"]')];
    expect(marked.map((m) => m.getAttribute("data-annotation"))).toEqual(["item-annotation-2"]);
    expect(within(dialog).getByText(/showing paragraph 1\. annotation 2 marked\./i)).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: /^close$/i }));
    expect(document.activeElement).toBe(opener);
  });

  it("chooses a highlight from an annotation that discusses it, and marks that annotation", async () => {
    const { item, highlights } = scanWithHighlights();
    const user = userEvent.setup();
    const dialog = await openView(item, highlights);
    expect(dialog.querySelector('[aria-current="true"]')).toBeNull();
    await user.click(within(dialog).getByRole("button", { name: "Show on page: Paragraph 1" }));
    expect(dialog.querySelector('[data-annotation="item-annotation-2"]')).toHaveAttribute("aria-current", "true");
    expect(dialog.querySelector('[data-annotation="item-annotation-1"]')).not.toHaveAttribute("aria-current");
    // Only an annotation that a highlight discusses offers to show it.
    expect(within(dialog).getAllByRole("button", { name: /show on page/i })).toHaveLength(1);
  });

  it("chooses a highlight by its name in the dialog and clears the marks of the previous one", async () => {
    const { item, highlights } = scanWithHighlights();
    const user = userEvent.setup();
    const dialog = await openView(item, highlights);
    const names = within(dialog).getByRole("list", { name: "Highlights" });
    await user.click(within(names).getByRole("button", { name: "Paragraph 1" }));
    expect(dialog.querySelectorAll('[data-annotation][aria-current="true"]')).toHaveLength(1);
    await user.click(within(names).getByRole("button", { name: "Paragraph 2" }));
    expect(within(names).getByRole("button", { name: "Paragraph 2" })).toHaveAttribute("aria-current", "true");
    expect(within(names).getByRole("button", { name: "Paragraph 1" })).not.toHaveAttribute("aria-current");
    expect(dialog.querySelectorAll('[data-annotation][aria-current="true"]')).toHaveLength(0);
  });

  it("has a pressed toggle for showing the highlights, and a named image area with written instructions", async () => {
    const { item, highlights } = scanWithHighlights();
    const user = userEvent.setup();
    const dialog = await openView(item, highlights);
    const toggle = within(dialog).getByRole("button", { name: "Show highlights" });
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    const area = within(dialog).getByRole("group", { name: "Page image" });
    expect(area).toHaveAttribute("tabindex", "0");
    expect(area).toHaveAccessibleDescription(/arrow keys/i);
    for (const name of ["Zoom in", "Zoom out", "Fit width", /reset/i]) {
      expect(within(dialog).getByRole("button", { name })).toBeInTheDocument();
    }
  });

  it("lists no highlights, and offers none in the dialog, for an item without an image", async () => {
    const { highlights } = scanWithHighlights();
    const item = fixtureItem("item");
    item.annotations = [{ id: "item-annotation-2", text: slot("second annotation") }];
    const dialog = await openView(item, highlights);
    expect(screen.queryByRole("list", { name: /highlights on this page/i })).toBeNull();
    expect(within(dialog).queryByRole("button", { name: /show on page|show highlights/i })).toBeNull();
    expect(dialog).toHaveTextContent("second annotation");
  });
});
