import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { MotionSwitch } from "@/components/MotionSwitch";
import { MotionProvider } from "./MotionProvider";

afterEach(() => {
  sessionStorage.clear();
  document.documentElement.removeAttribute("data-motion");
});

describe("MotionProvider", () => {
  it("marks the document with the mode, and follows the Motion switch", async () => {
    // jsdom reports no reduced-motion preference, so motion starts full.
    render(
      <MotionProvider>
        <MotionSwitch />
      </MotionProvider>,
    );
    expect(document.documentElement).toHaveAttribute("data-motion", "full");
    await userEvent.click(screen.getByRole("button", { name: "Motion" }));
    expect(document.documentElement).toHaveAttribute("data-motion", "still");
  });
});
