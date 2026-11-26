import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
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

async function openView(item: Item) {
  const user = userEvent.setup();
  const { container } = render(<CloseView item={item} />);
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

  it("shows the gap note in the mount of an item without an image", async () => {
    const item = fixtureItem("item");
    item.gapNote = slot("fixture gap note");
    const dialog = await openView(item);
    const mount = dialog.querySelector("[data-empty-mount]");
    expect(mount).toHaveTextContent("fixture gap note");
    expect(mount).not.toHaveTextContent("No image");
  });
});
