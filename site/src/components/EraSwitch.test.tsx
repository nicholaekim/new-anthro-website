import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getChapter, person } from "@/content";
import { MotionProvider } from "@/motion/MotionProvider";
import { ChapterPage } from "./ChapterPage";
import { MotionSwitch } from "./MotionSwitch";

beforeEach(() => sessionStorage.clear());
afterEach(() => vi.restoreAllMocks());

function renderLouisiana() {
  const chapter = getChapter("louisiana");
  if (!chapter) throw new Error("louisiana chapter missing");
  return render(
    <MotionProvider>
      <ChapterPage chapter={chapter} person={person} next={{ href: "/chapters/sao-paulo", label: "Next" }} />
    </MotionProvider>,
  );
}

describe("EraSwitch", () => {
  it("in still mode switches the shown era in place, without scrolling", async () => {
    sessionStorage.setItem("opmb:motion", "still");
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const { container } = renderLouisiana();
    const beat6 = container.querySelector('section[data-beat="6"]');
    if (!beat6) throw new Error("beat 6 missing");
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
});

describe("MotionSwitch", () => {
  it("stores the override under opmb:motion, and MotionProvider reads it back on mount", async () => {
    const first = render(
      <MotionProvider>
        <MotionSwitch />
      </MotionProvider>,
    );
    const button = screen.getByRole("button", { name: "Motion" });
    expect(button).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(button);
    expect(sessionStorage.getItem("opmb:motion")).toBe("still");
    expect(button).toHaveAttribute("aria-pressed", "false");
    first.unmount();

    render(
      <MotionProvider>
        <MotionSwitch />
      </MotionProvider>,
    );
    expect(screen.getByRole("button", { name: "Motion" })).toHaveAttribute("aria-pressed", "false");
  });
});
