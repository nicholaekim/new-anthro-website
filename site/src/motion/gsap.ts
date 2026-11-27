import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// The one place GSAP is set up. Pins only at this width; the same width as Tailwind's lg.
export const MOTION_QUERY = "(min-width: 1024px)";

gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText, useGSAP);

// The ease of the timed cross-fade (the era switch when beat 6 is not scrubbed).
export const FADE_EASE = CustomEase.create("opmb-fade", "0.4,0,0.2,1");

// The house ease of the time-based extras: title reveals, the opening, entrances, the cover.
// The CSS hover and focus transitions use the same curve (--ease-house in globals.css).
export const HOUSE_CURVE = "0.22,1,0.36,1";
export const HOUSE_EASE = CustomEase.create("house", HOUSE_CURVE);

// Every duration the motion layer uses, in seconds, slowest last. quick is also --duration-quick
// in globals.css (a test keeps the two equal).
export const DURATION = {
  quick: 0.15, // hover and focus feedback (CSS)
  coverClose: 0.4, // the cover fading in over the page
  coverOpen: 0.5, // the cover fading away over the new page
  part: 0.6, // a small part arriving: a section number, a rule, a label, the Begin link
  glide: 0.6, // the close view moving to a chosen view (Reset, Fit width, a highlight)
  cardHold: 0.7, // once closed, the cover's title card stays at least this long
  enter: 0.8, // a block rising into place
  title: 0.9, // each line of a page title
  light: 1.2, // the light coming up, the title card's large figures
} as const;

// Between the lines of a title, and between the parts of a section's opening.
export const STAGGER = 0.08;

// How far a block rises as it fades in, in pixels: a little, never a slide.
export const RISE = 12;

// Pins start just below the sticky header, which is measured again on every refresh.
export function pinStart(): string {
  return `top ${document.querySelector("body > header")?.getBoundingClientRect().height ?? 0}px`;
}

if (typeof window !== "undefined") {
  // The site keeps history.scrollRestoration at "manual" (set in FocusOnNavigate). ScrollTrigger
  // records the value it finds when registered and writes it back on every refresh, so tell it too.
  ScrollTrigger.clearScrollMemory("manual");
  // Positions are measured at creation and on refresh: measure again once late fonts and
  // opened or closed disclosures have changed the page's height.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  document.addEventListener("toggle", () => ScrollTrigger.refresh(), true);
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
