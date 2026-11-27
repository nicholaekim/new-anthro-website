import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import EndingPage from "@/app/ending/page";
import { chapters } from "@/content";
import { ending } from "@/content/pages";
import { MotionProvider } from "@/motion/MotionProvider";
import { CONFIDENCE_WORDS, NO_PERSON_PLACED } from "../story";

vi.mock("@/content", async () => (await import("@/test/fixtures")).fixtureContent());
vi.mock("@/content/pages", async () => (await import("@/test/fixtures")).fixturePages());

const realMatchMedia = window.matchMedia;
afterEach(() => {
  window.matchMedia = realMatchMedia;
  sessionStorage.clear();
});

function preferReducedMotion() {
  window.matchMedia = (media: string) => ({ ...realMatchMedia(media), matches: media === "(prefers-reduced-motion: reduce)" });
}

const VIEW_LABELS = ["Who decides", "On what evidence", "Outcome and confidence"];
// The fixture's last chapter places no person, as Tobique does.
const unplaced = () => chapters[chapters.length - 1];

// Scripts running: the provider reports ready once hydrated.
const renderEnhanced = () =>
  render(
    <MotionProvider>
      <EndingPage />
    </MotionProvider>,
  );

const viewSection = (label: string) => screen.getByRole("heading", { level: 3, name: label }).closest("section") as HTMLElement;

describe("comparison matrix without scripts", () => {
  it("shows every view in the server markup, one table after another, each with a heading, and no view control", () => {
    const host = document.createElement("div");
    host.innerHTML = renderToString(<EndingPage />);
    const tables = [...host.querySelectorAll("table")];
    expect(tables).toHaveLength(3);
    tables.forEach((table, i) => {
      const section = table.closest("section");
      expect(section?.querySelector("h3")?.textContent).toBe(VIEW_LABELS[i]);
      expect(section).not.toHaveAttribute("hidden");
      expect(table.querySelector("caption")?.textContent).toContain(VIEW_LABELS[i]);
    });
    expect(host.querySelector("[role=group]")).toBeNull();
    expect(host.querySelectorAll("[hidden]")).toHaveLength(0);
  });
});

describe("comparison matrix tables", () => {
  it("has a caption, column headers and one row header per place, with scopes", () => {
    render(<EndingPage />);
    const table = within(viewSection("Who decides")).getByRole("table");
    const cols = within(table).getAllByRole("columnheader");
    expect(cols.map((c) => c.textContent)).toEqual(["Place", "Then", "Now"]);
    cols.forEach((c) => expect(c).toHaveAttribute("scope", "col"));
    const rows = within(table).getAllByRole("rowheader");
    expect(rows).toHaveLength(chapters.length);
    rows.forEach((r, i) => {
      expect(r).toHaveAttribute("scope", "row");
      expect(r).toHaveTextContent(chapters[i].place);
    });
  });

  it("shows each place's summaries, each cell linking to the section that quotes the rule", () => {
    render(<EndingPage />);
    const decides = within(viewSection("Who decides")).getByRole("table");
    const evidence = within(viewSection("On what evidence")).getByRole("table");
    for (const c of chapters) {
      expect(decides).toHaveTextContent(String(c.summary.historical.decides));
      expect(decides).toHaveTextContent(String(c.summary.present.decides));
      expect(evidence).toHaveTextContent(String(c.summary.historical.evidence));
      expect(evidence).toHaveTextContent(String(c.summary.present.evidence));
      const hrefs = [...decides.querySelectorAll(`a[href^="/chapters/${c.slug}#"]`)].map((a) => a.getAttribute("href"));
      expect(hrefs).toEqual([`/chapters/${c.slug}#beat-4`, `/chapters/${c.slug}#beat-7`]);
    }
  });

  it("shows each outcome's confidence as a word and a meter, the full outcome behind a disclosure, and a legend", () => {
    render(<EndingPage />);
    const section = viewSection("Outcome and confidence");
    const table = within(section).getByRole("table");
    const first = chapters[0];
    const row = within(table).getByRole("rowheader", { name: new RegExp(first.place) }).closest("tr") as HTMLElement;
    expect(row).toHaveTextContent(CONFIDENCE_WORDS.high);
    expect(row).toHaveTextContent(CONFIDENCE_WORDS.low);
    expect(row.querySelectorAll("[data-meter]")).toHaveLength(2);
    const disclosures = row.querySelectorAll("details");
    expect(disclosures).toHaveLength(2);
    expect(disclosures[0]).toHaveTextContent("[fixture outcome]");
    // The written confidence statement and the citation, as each outcome's record gave them.
    expect(disclosures[0]).toHaveTextContent("Confidence: [fixture confidence]");
    expect(disclosures[0]).toHaveTextContent("Citation: [fixture citation]");
    expect(disclosures[1]).toHaveTextContent("Confidence: [fixture confidence]");
    expect(disclosures[1]).toHaveTextContent("Citation: [fixture citation]");
    const hrefs = [...row.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual([`/chapters/${first.slug}#beat-5`, `/chapters/${first.slug}#beat-7`]);
    const legend = within(section).getByRole("list", { name: "Confidence" });
    expect(within(legend).getAllByRole("listitem").map((li) => li.textContent)).toEqual(Object.values(CONFIDENCE_WORDS));
  });

  it("for the chapter that places no person, says so in both outcome cells, with no meter, and keeps its other cells", () => {
    render(<EndingPage />);
    const c = unplaced();
    const outcomeRow = within(within(viewSection("Outcome and confidence")).getByRole("table"))
      .getByRole("rowheader", { name: new RegExp(c.place) })
      .closest("tr") as HTMLElement;
    const cells = within(outcomeRow).getAllByRole("cell");
    expect(cells).toHaveLength(2);
    cells.forEach((cell) => expect(cell).toHaveTextContent(NO_PERSON_PLACED));
    expect(outcomeRow.querySelector("[data-meter], details")).toBeNull();
    expect([...outcomeRow.querySelectorAll("a")].map((a) => a.getAttribute("href"))).toEqual([
      `/chapters/${c.slug}#beat-6`,
      `/chapters/${c.slug}#beat-6`,
    ]);
    const decidesRow = within(within(viewSection("Who decides")).getByRole("table"))
      .getByRole("rowheader", { name: new RegExp(c.place) })
      .closest("tr") as HTMLElement;
    expect(decidesRow).toHaveTextContent(String(c.summary.historical.decides));
  });
});

describe("comparison matrix cards", () => {
  it("repeats each view as one card per place, with the place and each date as headings and the same links", () => {
    render(<EndingPage />);
    const section = viewSection("Who decides");
    const cards = section.querySelectorAll("[data-matrix-cards] > li");
    expect(cards).toHaveLength(chapters.length);
    cards.forEach((card, i) => {
      const c = chapters[i];
      expect(within(card as HTMLElement).getByRole("heading", { level: 4 })).toHaveTextContent(c.place);
      expect(within(card as HTMLElement).getAllByRole("heading", { level: 5 }).map((h) => h.textContent)).toEqual([
        `Then, ${c.historicalYear}`,
        `Now, ${c.presentYear}`,
      ]);
      expect(card).toHaveTextContent(String(c.summary.historical.decides));
      expect([...card.querySelectorAll("a")].map((a) => a.getAttribute("href"))).toEqual([
        `/chapters/${c.slug}#beat-4`,
        `/chapters/${c.slug}#beat-7`,
      ]);
    });
    const none = viewSection("Outcome and confidence").querySelectorAll("[data-matrix-cards] > li")[chapters.length - 1];
    expect(none).toHaveTextContent(NO_PERSON_PLACED);
    expect(none.querySelector("[data-meter]")).toBeNull();
  });
});

describe("view control, with scripts", () => {
  it("is a labelled group showing one view at a time, the chosen one pressed", () => {
    renderEnhanced();
    const group = screen.getByRole("group", { name: "Show" });
    const buttons = within(group).getAllByRole("button");
    expect(buttons.map((b) => b.textContent)).toEqual(VIEW_LABELS);
    expect(buttons.map((b) => b.getAttribute("aria-pressed"))).toEqual(["true", "false", "false"]);
    expect(viewSection("Who decides")).not.toHaveAttribute("hidden");
    expect(document.querySelector("[data-view='evidence']")).toHaveAttribute("hidden");
    expect(document.querySelector("[data-view='outcome']")).toHaveAttribute("hidden");
  });

  it("switches by mouse and by keyboard, and announces the change politely once", async () => {
    const user = userEvent.setup();
    renderEnhanced();
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveTextContent("");
    await user.click(screen.getByRole("button", { name: "On what evidence" }));
    expect(screen.getByRole("button", { name: "On what evidence" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Who decides" })).toHaveAttribute("aria-pressed", "false");
    expect(document.querySelector("[data-view='evidence']")).not.toHaveAttribute("hidden");
    expect(document.querySelector("[data-view='decides']")).toHaveAttribute("hidden");
    expect(status).toHaveTextContent("Showing: On what evidence.");

    screen.getByRole("button", { name: "Outcome and confidence" }).focus();
    await user.keyboard("{Enter}");
    expect(document.querySelector("[data-view='outcome']")).not.toHaveAttribute("hidden");
    expect(status).toHaveTextContent("Showing: Outcome and confidence.");
    expect(screen.getAllByRole("status")).toHaveLength(1);
  });

  it("can emphasise one date's column, exposed as pressed", async () => {
    const user = userEvent.setup();
    renderEnhanced();
    const group = screen.getByRole("group", { name: "Emphasise" });
    const buttons = within(group).getAllByRole("button");
    expect(buttons.map((b) => b.textContent)).toEqual(["Both", "Then", "Now"]);
    expect(buttons[0]).toHaveAttribute("aria-pressed", "true");
    await user.click(buttons[2]);
    expect(buttons[2]).toHaveAttribute("aria-pressed", "true");
    expect(buttons[0]).toHaveAttribute("aria-pressed", "false");
    expect(document.querySelector("[data-matrix]")).toHaveAttribute("data-emphasis", "present");
  });
});

describe("still mode", () => {
  it("leaves no inline style on the matrix rows, and the controls still work", async () => {
    preferReducedMotion();
    const user = userEvent.setup();
    const { container } = renderEnhanced();
    for (const row of container.querySelectorAll("[data-matrix-row]")) expect(row).not.toHaveAttribute("style");
    await user.click(screen.getByRole("button", { name: "Outcome and confidence" }));
    expect(document.querySelector("[data-view='outcome']")).not.toHaveAttribute("hidden");
    for (const row of container.querySelectorAll("[data-matrix-row]")) expect(row).not.toHaveAttribute("style");
  });
});

describe("references", () => {
  it("renders each group as an expandable list, one entry per item, web addresses as links", () => {
    const original = { bibliography: ending.bibliography, imageCredits: ending.imageCredits };
    ending.bibliography = "Louisiana\nFirst. https://example.org/a.pdf. Accessed 1 May.\nSecond.\n\nTobique\nThird.";
    ending.imageCredits = "Place photographs\nA photograph.\n\nNo image here is generated.";
    try {
      render(<EndingPage />);
      const bibliography = screen.getByRole("heading", { level: 3, name: "Bibliography" }).closest("section") as HTMLElement;
      const groups = bibliography.querySelectorAll("details");
      expect([...groups].map((d) => d.querySelector("summary")?.textContent)).toEqual(["Louisiana", "Tobique"]);
      const items = within(groups[0] as HTMLElement).getAllByRole("listitem");
      expect(items.map((li) => li.textContent)).toEqual(["First. https://example.org/a.pdf. Accessed 1 May.", "Second."]);
      const link = within(items[0]).getByRole("link", { name: "https://example.org/a.pdf" });
      expect(link).toHaveAttribute("href", "https://example.org/a.pdf");
      const credits = screen.getByRole("heading", { level: 3, name: "Image credits" }).closest("section") as HTMLElement;
      expect(credits.querySelectorAll("details")).toHaveLength(1);
      // A group without a heading is a plain list, always shown.
      expect(within(credits).getByText("No image here is generated.").closest("details")).toBeNull();
    } finally {
      Object.assign(ending, original);
    }
  });

  it("shows a note that is still a slot as its marked placeholder", () => {
    render(<EndingPage />);
    expect(screen.getByText("[fixture bibliography]")).toBeInTheDocument();
  });
});

describe("closing panel", () => {
  it("gives what is fictional, the AI-use disclosure, and links back to the opening and to start again", async () => {
    const user = userEvent.setup();
    render(<EndingPage />);
    const panel = screen.getByRole("heading", { level: 2, name: "Closing" }).closest("section") as HTMLElement;
    expect(panel).toHaveTextContent("[fixture fiction statement]");
    expect(panel).toHaveTextContent("[fixture AI use]");
    expect(within(panel).getByRole("link", { name: "Return to the opening" })).toHaveAttribute("href", "/");
    sessionStorage.setItem("opmb:opening-seen", "1");
    const again = within(panel).getByRole("link", { name: "Start again" });
    expect(again).toHaveAttribute("href", "/");
    await user.click(again);
    expect(sessionStorage.getItem("opmb:opening-seen")).toBeNull();
  });
});
