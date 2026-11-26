import { act, fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CoverLink } from "./CoverLink";
import { CoverProvider } from "./CoverProvider";
import { COVER_FAILSAFE_MS } from "./cover";
import { gsap } from "./gsap";
import { MotionProvider } from "./MotionProvider";

const nav = vi.hoisted(() => ({ push: vi.fn(), linkNavigated: vi.fn(), pathname: "/" }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: nav.push }),
  usePathname: () => nav.pathname,
}));

// Outside an app router, the real Link never calls onNavigate. This stand-in keeps its documented
// contract: on a plain click it calls onNavigate with an event whose preventDefault cancels the
// client-side navigation, which otherwise goes ahead (linkNavigated).
vi.mock("next/link", () => ({
  default: ({ href, onNavigate, children, ...rest }: ComponentProps<"a"> & { onNavigate?: (e: { preventDefault: () => void }) => void }) => (
    <a
      href={href}
      {...rest}
      onClick={(e) => {
        rest.onClick?.(e);
        e.preventDefault();
        let prevented = false;
        onNavigate?.({ preventDefault: () => (prevented = true) });
        if (!prevented) nav.linkNavigated(href);
      }}
    >
      {children}
    </a>
  ),
}));

const realMatchMedia = window.matchMedia;
afterEach(() => {
  window.matchMedia = realMatchMedia;
  vi.useRealTimers();
  nav.push.mockReset();
  nav.linkNavigated.mockReset();
});

function renderLink(href = "/ending") {
  return render(
    <MotionProvider>
      <CoverProvider>
        <CoverLink href={href}>Go</CoverLink>
      </CoverProvider>
    </MotionProvider>,
  );
}

const cover = () => document.querySelector("[data-cover]");

describe("CoverLink", () => {
  it("in still mode navigates as a plain link and renders no cover", () => {
    window.matchMedia = (media: string) => ({ ...realMatchMedia(media), matches: media === "(prefers-reduced-motion: reduce)" });
    renderLink();
    fireEvent.click(screen.getByRole("link", { name: "Go" }));
    expect(nav.linkNavigated).toHaveBeenCalledWith("/ending");
    expect(cover()).toBeNull();
  });

  it("in full mode covers the page first and pushes the route only once the cover has closed", () => {
    renderLink();
    fireEvent.click(screen.getByRole("link", { name: "Go" }));
    expect(nav.linkNavigated).not.toHaveBeenCalled();
    const el = cover();
    expect(el).not.toBeNull();
    expect(el).toHaveAttribute("aria-hidden", "true");
    expect(nav.push).not.toHaveBeenCalled();
    act(() => {
      for (const tween of gsap.getTweensOf(el)) tween.progress(1);
    });
    expect(nav.push).toHaveBeenCalledWith("/ending");
  });

  it("in full mode leaves a link to the page already shown alone", () => {
    renderLink("/#top");
    fireEvent.click(screen.getByRole("link", { name: "Go" }));
    expect(nav.linkNavigated).toHaveBeenCalledWith("/#top");
    expect(cover()).toBeNull();
  });

  it("opens again and goes idle when the route never changes", () => {
    vi.useFakeTimers();
    renderLink();
    fireEvent.click(screen.getByRole("link", { name: "Go" }));
    expect(cover()).not.toBeNull();
    act(() => {
      for (const tween of gsap.getTweensOf(cover())) tween.progress(1);
    });
    expect(nav.push).toHaveBeenCalledTimes(1);
    act(() => vi.advanceTimersByTime(COVER_FAILSAFE_MS));
    act(() => vi.advanceTimersByTime(2000));
    const el = cover();
    expect(el === null || el.hasAttribute("hidden")).toBe(true);
  });
});
