import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { chapters } from "@/content";
import { NavMenu } from "./NavMenu";

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
});
