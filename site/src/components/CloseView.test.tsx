import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { getChapter } from "@/content";
import type { Item } from "@/content/types";
import { CloseView } from "./CloseView";

function itemCopy(): Item {
  const item = getChapter("louisiana")?.items[0];
  if (!item) throw new Error("fixture needs a louisiana item");
  return structuredClone(item);
}

function withLargeImage(): Item {
  const item = itemCopy();
  item.image = { src: "/scan-small.png", width: 10, height: 10, largeSrc: "/scan-large.png" };
  return item;
}

function dialogOf(container: HTMLElement): HTMLDialogElement {
  const dialog = container.querySelector("dialog");
  if (!dialog) throw new Error("no dialog");
  return dialog;
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
    const user = userEvent.setup();
    const { container } = render(<CloseView item={withLargeImage()} />);
    await user.click(screen.getByRole("button", { name: /open close view/i }));
    const dialog = dialogOf(container);

    const heading = within(dialog).getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent(/close view/i);
    expect(dialog).toHaveAttribute("aria-labelledby", heading.id);
    expect(within(dialog).getByRole("button", { name: /close/i })).toBeInTheDocument();
    expect(within(dialog).getByRole("link", { name: /large image/i })).toHaveAttribute("href", "/scan-large.png");
  });

  it("names each opener after the item it opens", () => {
    const first = itemCopy();
    const second = itemCopy();
    first.id = "first";
    first.provenance.title = "First record";
    second.id = "second";
    second.provenance.title = "Second record";
    render(
      <>
        <CloseView item={first} />
        <CloseView item={second} />
      </>,
    );
    const names = screen.getAllByRole("button", { name: /open close view/i }).map((b) => b.getAttribute("aria-label"));
    expect(screen.getByRole("button", { name: /open close view.*first record/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /open close view.*second record/i })).toBeInTheDocument();
    expect(new Set(names).size).toBe(2);
  });

  it("has no large-image link when the item has no large image", async () => {
    const user = userEvent.setup();
    const { container } = render(<CloseView item={itemCopy()} />);
    await user.click(screen.getByRole("button", { name: /open close view/i }));
    expect(within(dialogOf(container)).queryByRole("link")).toBeNull();
  });
});
