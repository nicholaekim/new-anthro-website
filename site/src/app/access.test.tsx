import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ChapterRoute, { generateMetadata as chapterMetadata } from "@/app/chapters/[slug]/page";
import EndingPage, { metadata as endingMetadata } from "@/app/ending/page";
import OpeningPage, { metadata as openingMetadata } from "@/app/page";
import { ChapterPage } from "@/components/ChapterPage";
import { MotionSwitch } from "@/components/MotionSwitch";
import { NavMenu } from "@/components/NavMenu";
import { RestartButton } from "@/components/RestartButton";
import { navLinks } from "@/components/navLinks";
import { chapters, person } from "@/content";
import type { Chapter } from "@/content/types";
import { MotionProvider } from "@/motion/MotionProvider";
import { fixtureChapter } from "@/test/fixtures";

vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/navigation")>()),
  usePathname: () => "/chapters/fixture-1",
}));
// The routes and pages run against the shared fixture, never the live content.
vi.mock("@/content", async () => (await import("@/test/fixtures")).fixtureContent());
vi.mock("@/content/pages", async () => (await import("@/test/fixtures")).fixturePages());

// Still mode for the whole file: the override is read from storage on first use.
beforeEach(() => sessionStorage.setItem("opmb:motion", "still"));

const SITE = "One Person, Many Boxes";
const params = (slug: string) => ({ params: Promise.resolve({ slug }), searchParams: Promise.resolve({}) });

// The layout's header controls plus the page, as a visitor gets them (the skip link is plain text in the layout).
function renderWithHeader(page: ReactNode) {
  return render(
    <MotionProvider>
      <header>
        <NavMenu links={navLinks(chapters)} />
        <RestartButton />
        <MotionSwitch />
      </header>
      {page}
    </MotionProvider>,
  );
}

async function renderChapterRoute(slug: string) {
  return renderWithHeader(await ChapterRoute(params(slug)));
}

function headingLevels(root: Element): number[] {
  return [...root.querySelectorAll("h1, h2, h3, h4, h5, h6")].map((h) => Number(h.tagName[1]));
}

function expectHeadingOutline(root: Element) {
  const levels = headingLevels(root);
  expect(levels.filter((l) => l === 1)).toHaveLength(1);
  expect(levels[0]).toBe(1);
  levels.forEach((level, i) => {
    if (i > 0) expect(level).toBeLessThanOrEqual(levels[i - 1] + 1);
  });
}

// No inline styles at all, except the one next/image puts on every img (color: transparent, which
// hides the alt text while the image loads). It is not an animation state.
function expectNoInlineStyles(root: Element) {
  for (const el of root.querySelectorAll<HTMLElement>("[style]")) {
    expect(el.tagName).toBe("IMG");
    expect(el.style.length).toBe(1);
    expect(el.style.color).toBe("transparent");
  }
}

function withImages(): Chapter {
  const c = fixtureChapter();
  c.photograph.image = { src: "/fixture-photo.jpg", width: 800, height: 600 };
  c.items[0].image = { src: "/fixture-item.jpg", width: 800, height: 1000, largeSrc: "/fixture-item-large.jpg" };
  if (c.present.instrument) c.present.instrument.image = { src: "/fixture-instrument.jpg", width: 800, height: 1000 };
  return c;
}

describe("chapter pages", () => {
  it.each(chapters.map((c) => c.slug))("%s: every button and link has an accessible name", async (slug) => {
    const { container } = await renderChapterRoute(slug);
    const controls = [...container.querySelectorAll("button, a")];
    expect(controls.length).toBeGreaterThan(0);
    for (const el of controls) expect(el).toHaveAccessibleName();
  });

  it.each(chapters.map((c) => c.slug))("%s: one h1, and headings never skip a level", async (slug) => {
    const { container } = await renderChapterRoute(slug);
    expectHeadingOutline(container);
  });

  it.each(chapters.map((c) => c.slug))("%s: no style attribute in still mode", async (slug) => {
    const { container } = await renderChapterRoute(slug);
    expect(screen.getByRole("button", { name: "Motion" })).toHaveAttribute("aria-pressed", "false");
    expectNoInlineStyles(container);
  });

  it.each(chapters)("$slug: the h1 reads as place, country and year", (c) => {
    render(<ChapterPage chapter={c} person={person} next={{ href: "/ending", label: "Ending" }} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveAccessibleName(`${c.place}, ${c.country}, ${c.historicalYear}`);
  });

  it("gives every image an alt attribute, including in the close view, and hides decorative layers", async () => {
    const c = withImages();
    const { container } = renderWithHeader(<ChapterPage chapter={c} person={person} next={{ href: "/ending", label: "Ending" }} />);
    await userEvent.click(container.querySelector<HTMLElement>(`#${c.items[0].id} [data-close-view-open]`) as HTMLElement);
    const images = [...document.querySelectorAll("img")];
    // photograph, item 1 in beat 3 and beat 6, the instrument in beat 6 and beat 7, and the close view
    expect(images.length).toBeGreaterThanOrEqual(6);
    for (const img of images) expect(img).toHaveAttribute("alt");

    // Beat 6's empty frames hold their gap note or "No image" as text, so they are not decoration.
    const decorative = [
      ...container.querySelectorAll(
        "[data-place-figures], [data-depth], [data-chapter-figures], [data-chapter-number], [data-rule], [data-date-line], [data-date-indicator], [data-divider], [data-mark], [data-tick] > span:not(.sr-only)",
      ),
    ];
    // Beat 2's side column: the year and the place set large, as type only.
    expect(container.querySelectorAll("[data-place-figures] [data-depth]")).toHaveLength(2);
    expect(container.querySelector("[data-place-figures] img")).toBeNull();
    expect(container.querySelector("[data-chapter-figures]")).toHaveTextContent(String(c.historicalYear));
    expect(container.querySelector("[data-date-line]")).not.toBeNull();
    expect(container.querySelector("[data-mark]")).not.toBeNull();
    for (const el of decorative) expect(el.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it("adds no style attribute with images in still mode, other than next/image's own color:transparent on img", () => {
    const c = withImages();
    const { container } = renderWithHeader(<ChapterPage chapter={c} person={person} next={{ href: "/ending", label: "Ending" }} />);
    expect(screen.getByRole("button", { name: "Motion" })).toHaveAttribute("aria-pressed", "false");
    expect(container.querySelectorAll("img").length).toBeGreaterThan(0);
    expectNoInlineStyles(container);
  });
});

describe("opening and ending", () => {
  it("each has one h1, headings never skip a level, and no style attribute", () => {
    for (const Page of [OpeningPage, EndingPage]) {
      const { container, unmount } = render(<Page />);
      expectHeadingOutline(container);
      expectNoInlineStyles(container);
      unmount();
    }
  });
});

describe("document titles", () => {
  it("names the opening and the ending plainly, after the site name", () => {
    expect(openingMetadata.title).toBe(`Opening | ${SITE}`);
    expect(endingMetadata.title).toBe(`Ending | ${SITE}`);
  });

  it.each(chapters)("$slug: names the place and both years", async (c) => {
    const meta = await chapterMetadata(params(c.slug));
    expect(meta.title).toBe(`${c.place}, ${c.historicalYear} and ${c.presentYear} | ${SITE}`);
  });
});
