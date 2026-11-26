import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => sessionStorage.clear());
afterEach(() => vi.restoreAllMocks());

// The motion override lives in module memory, so every test loads the modules fresh, as a page load would.
async function load() {
  vi.resetModules();
  const [{ getChapter, person }, { MotionProvider }, { ChapterPage }, { MotionSwitch }] = await Promise.all([
    import("@/content"),
    import("@/motion/MotionProvider"),
    import("./ChapterPage"),
    import("./MotionSwitch"),
  ]);
  return { getChapter, person, MotionProvider, ChapterPage, MotionSwitch };
}

async function renderLouisiana() {
  const { getChapter, person, MotionProvider, ChapterPage } = await load();
  const chapter = getChapter("louisiana");
  if (!chapter) throw new Error("louisiana chapter missing");
  const utils = render(
    <MotionProvider>
      <ChapterPage chapter={chapter} person={person} next={{ href: "/chapters/sao-paulo", label: "Next" }} />
    </MotionProvider>,
  );
  const beat6 = utils.container.querySelector<HTMLElement>('section[data-beat="6"]');
  if (!beat6) throw new Error("beat 6 missing");
  return { ...utils, chapter, beat6 };
}

// Text a reader gets: everything outside aria-hidden subtrees.
function realText(el: Element): string {
  if (el.getAttribute("aria-hidden") === "true") return "";
  return [...el.childNodes]
    .map((n) => (n.nodeType === Node.TEXT_NODE ? (n.textContent ?? "") : n instanceof Element ? realText(n) : ""))
    .join("")
    .trim();
}

async function pressAndWaitForFade(beat6: HTMLElement) {
  await userEvent.click(screen.getByRole("button", { name: "Show 2020" }));
  // The fade has run once the historical media layer carries a reduced inline opacity.
  await waitFor(() => {
    const media = beat6.querySelector<HTMLElement>('[data-media="historical"]');
    expect(Number(media?.style.opacity || 1)).toBeLessThan(1);
  }, { timeout: 3000 });
}

describe("EraSwitch", () => {
  it("in still mode switches the shown era in place, without scrolling", async () => {
    sessionStorage.setItem("opmb:motion", "still");
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const { beat6 } = await renderLouisiana();
    scrollTo.mockClear(); // the page itself starts at the top on mount; only the press matters here
    const button = screen.getByRole("button", { name: "Show 2020" });
    expect(beat6).toContainElement(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(beat6).toHaveAttribute("data-era-shown", "historical");

    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(beat6).toHaveAttribute("data-era-shown", "present");

    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(beat6).toHaveAttribute("data-era-shown", "historical");
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("keeps both captions as real, unfaded text when two image-less items are switched in still mode", async () => {
    sessionStorage.setItem("opmb:motion", "still");
    const { beat6, chapter } = await renderLouisiana();
    const historical = chapter.items.find((i) => i.id === chapter.changeOfDate?.historicalItemId);
    expect(historical?.image).toBeNull();
    expect(chapter.present.instrument?.image).toBeNull();

    await pressAndWaitForFade(beat6);
    const captions = [...beat6.querySelectorAll<HTMLElement>("[data-caption]")];
    expect(captions.map((c) => c.dataset.caption)).toEqual(["historical", "present"]);
    captions.forEach((caption, i) => {
      const year = String(i === 0 ? chapter.historicalYear : chapter.presentYear);
      expect(realText(caption)).toContain(year);
      expect(realText(caption).replace(year, "").trim()).not.toBe(""); // the gap note or "No image"
      for (const el of [caption, ...caption.querySelectorAll("*")]) {
        expect(el.getAttribute("style")).toBeNull();
        expect(el.getAttribute("class") ?? "").not.toMatch(/opacity/);
        expect(el.hasAttribute("hidden")).toBe(false);
      }
    });
  });

  it("never puts an inline opacity on an element that contains text", async () => {
    sessionStorage.setItem("opmb:motion", "still");
    const { container, beat6 } = await renderLouisiana();
    await pressAndWaitForFade(beat6);
    const faded = [...container.querySelectorAll<HTMLElement>("[style]")].filter((el) => el.style.opacity !== "");
    expect(faded.length).toBeGreaterThan(0);
    for (const el of faded) expect(realText(el)).toBe("");
  });
});

describe("MotionSwitch", () => {
  it("stores the override under opmb:motion, and MotionProvider reads it back on mount", async () => {
    const first = await load();
    const view = render(
      <first.MotionProvider>
        <first.MotionSwitch />
      </first.MotionProvider>,
    );
    const button = screen.getByRole("button", { name: "Motion" });
    expect(button).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(button);
    expect(sessionStorage.getItem("opmb:motion")).toBe("still");
    expect(button).toHaveAttribute("aria-pressed", "false");
    view.unmount();

    const again = await load();
    render(
      <again.MotionProvider>
        <again.MotionSwitch />
      </again.MotionProvider>,
    );
    expect(screen.getByRole("button", { name: "Motion" })).toHaveAttribute("aria-pressed", "false");
  });

  it("keeps the override when sessionStorage cannot store it", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    const { MotionProvider, MotionSwitch } = await load();
    render(
      <MotionProvider>
        <MotionSwitch />
      </MotionProvider>,
    );
    const button = screen.getByRole("button", { name: "Motion" });
    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
  });
});
