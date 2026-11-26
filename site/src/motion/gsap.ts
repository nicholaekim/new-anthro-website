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

// The house ease of the time-based extras: title reveals, the opening, the cover.
export const HOUSE_EASE = CustomEase.create("house", "0.22,1,0.36,1");

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

