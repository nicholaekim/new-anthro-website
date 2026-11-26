import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { chapters } from "@/content";
import { NavMenu } from "./NavMenu";

vi.mock("next/navigation", () => ({ usePathname: () => "/chapters/sao-paulo" }));

function openMenu() {
  const utils = render(
    <>
      <NavMenu />
      <button type="button">After the menu</button>
    </>,
  );
  const details = utils.container.querySelector("details");
  const summary = utils.container.querySelector("summary");
  if (!details || !summary) throw new Error("menu missing");
  details.open = true;
  return { ...utils, details, summary };
}

describe("NavMenu", () => {
  it("opens from one control", () => {
    const { container } = render(<NavMenu />);
    expect(container.querySelectorAll("summary, button")).toHaveLength(1);
  });

  it("lists the opening, the four chapters and the ending, in order", () => {
    const { container } = render(<NavMenu />);
    const links = [...container.querySelectorAll("a")];
    expect(links.map((a) => a.getAttribute("href"))).toEqual([
      "/",
      "/chapters/louisiana",
      "/chapters/sao-paulo",
      "/chapters/johannesburg",
      "/chapters/tobique",
      "/ending",
    ]);
    chapters.forEach((c, i) => {
      const text = links[i + 1].textContent ?? "";
      expect(text).toContain(c.place);
      expect(text).toContain(String(c.historicalYear));
      expect(text).toContain(String(c.presentYear));
    });
  });

  it("marks exactly the current page's link with aria-current", () => {
    const { container } = render(<NavMenu />);
    const current = container.querySelectorAll('a[aria-current="page"]');
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveAttribute("href", "/chapters/sao-paulo");
  });

  it("closes on Escape and returns focus to its summary", async () => {
    const user = userEvent.setup();
    const { details, summary, container } = openMenu();
    container.querySelector<HTMLAnchorElement>('a[href="/ending"]')?.focus();
    await user.keyboard("{Escape}");
    expect(details.open).toBe(false);
    expect(document.activeElement).toBe(summary);
  });

  it("closes when focus leaves it", async () => {
    const user = userEvent.setup();
    const { details, container } = openMenu();
    container.querySelector<HTMLAnchorElement>('a[href="/ending"]')?.focus();
    await user.tab();
    expect(document.activeElement).toHaveTextContent("After the menu");
    expect(details.open).toBe(false);
  });

  it("closes when the link to the current page is chosen", () => {
    const { details, container } = openMenu();
    const link = container.querySelector('a[aria-current="page"]');
    if (!link) throw new Error("no current link");
    link.addEventListener("click", (e) => e.preventDefault());
    fireEvent.click(link);
    expect(details.open).toBe(false);
  });
});
