import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Bilingual } from "./Bilingual";

const box = (text: React.ReactNode) => <blockquote>{text}</blockquote>;

describe("Bilingual", () => {
  it("shows the original alone, with no labels, when there is no translation", () => {
    const { container } = render(<Bilingual original="Texto original" translation={null} render={box} />);
    expect(container.querySelectorAll("blockquote")).toHaveLength(1);
    expect(container).toHaveTextContent("Texto original");
    expect(screen.queryByText(/original/i, { selector: "p" })).toBeNull();
    expect(screen.queryByText(/translation/i)).toBeNull();
  });

  it("shows the original, then the translation, each under its own label", () => {
    const { container } = render(<Bilingual original="Texto original" translation="Original text" render={box} />);
    const parts = [...container.querySelectorAll("[data-language-part]")];
    expect(parts.map((p) => p.getAttribute("data-language-part"))).toEqual(["original", "translation"]);
    expect(parts[0]).toHaveTextContent(/^Original/);
    expect(parts[0].querySelector("blockquote")).toHaveTextContent("Texto original");
    expect(parts[1]).toHaveTextContent(/^English translation/);
    expect(parts[1].querySelector("blockquote")).toHaveTextContent("Original text");
  });

  it("sets the original's language on its text only, never on the English label or translation", () => {
    const { container } = render(<Bilingual original="Texto original" translation="Original text" lang="pt" render={box} />);
    const marked = [...container.querySelectorAll("[lang]")];
    expect(marked.map((el) => [el.getAttribute("lang"), el.textContent])).toEqual([["pt", "Texto original"]]);
    const alone = render(<Bilingual original="Texto" translation={null} lang="pt" render={box} />);
    expect(alone.container.querySelector("blockquote [lang='pt']")).toHaveTextContent("Texto");
  });

  it("marks a placeholder in either part", () => {
    const { container } = render(<Bilingual original={{ slot: "a" }} translation={{ slot: "b" }} render={box} />);
    expect(container.querySelectorAll("[data-slot]")).toHaveLength(2);
  });
});
