import { describe, expect, it } from "vitest";
import { linkSegments, parseReferences } from "./references";

describe("parseReferences", () => {
  it("makes one group per blank-line-separated block, one entry per line, with a place name as heading", () => {
    const text = "Louisiana\nFirst entry. Accessed 1 May.\nSecond entry.\n\nSão Paulo\nThird entry.";
    expect(parseReferences(text)).toEqual([
      { heading: "Louisiana", entries: ["First entry. Accessed 1 May.", "Second entry."] },
      { heading: "São Paulo", entries: ["Third entry."] },
    ]);
  });

  it("takes a short first line without a full stop as the heading", () => {
    expect(parseReferences("Place photographs\nOne.\nTwo.")[0].heading).toBe("Place photographs");
  });

  it("gives a group no heading when its first line has a full stop, is long, or is the only line", () => {
    expect(parseReferences("No image here is generated.\nAnother line.")).toEqual([
      { heading: null, entries: ["No image here is generated.", "Another line."] },
    ]);
    const long = "A first line that runs on for far too long to be a heading of a group";
    expect(parseReferences(`${long}\nNext`)[0]).toEqual({ heading: null, entries: [long, "Next"] });
    expect(parseReferences("Tobique")).toEqual([{ heading: null, entries: ["Tobique"] }]);
  });

  it("ignores surrounding spaces, empty lines, Windows line ends and extra blank lines", () => {
    expect(parseReferences("\n  Tobique \r\n One. \r\n\r\n\r\n\n Two.\n")).toEqual([
      { heading: "Tobique", entries: ["One."] },
      { heading: null, entries: ["Two."] },
    ]);
  });

  it("is empty for empty text", () => {
    expect(parseReferences("  \n\n ")).toEqual([]);
  });
});

describe("linkSegments", () => {
  it("is the whole entry as text when it has no web address", () => {
    expect(linkSegments("Plain entry.")).toEqual([{ text: "Plain entry." }]);
  });

  it("links a web address up to the next space, leaving a trailing full stop as text", () => {
    expect(linkSegments("Title. https://example.org/a/b.pdf. Accessed 26 November 2026.")).toEqual([
      { text: "Title. " },
      { text: "https://example.org/a/b.pdf", href: "https://example.org/a/b.pdf" },
      { text: ". Accessed 26 November 2026." },
    ]);
  });

  it("leaves the closing bracket of a bracketed address as text", () => {
    expect(linkSegments("Licence (https://creativecommons.org/licenses/by-sa/4.0/). Changes.")).toEqual([
      { text: "Licence (" },
      { text: "https://creativecommons.org/licenses/by-sa/4.0/", href: "https://creativecommons.org/licenses/by-sa/4.0/" },
      { text: "). Changes." },
    ]);
  });

  it("keeps a bracket that belongs to the address", () => {
    const url = "https://example.org/wiki/A_(b)";
    expect(linkSegments(`See ${url}.`)).toEqual([{ text: "See " }, { text: url, href: url }, { text: "." }]);
  });

  it("links every address in an entry, and an address at the very end", () => {
    expect(linkSegments("https://a.example/x and https://b.example/y")).toEqual([
      { text: "https://a.example/x", href: "https://a.example/x" },
      { text: " and " },
      { text: "https://b.example/y", href: "https://b.example/y" },
    ]);
  });
});
