import type { MotionMode } from "./motionMode";

// The cover between pages: idle (not rendered) -> closing (fading in over the page) -> covered
// (the route is pushed) -> opening (fading out over the new page) -> idle.
export type CoverState = "idle" | "closing" | "covered" | "opening";
export type CoverEvent = "navigate" | "closed" | "arrived" | "opened" | "failsafe";

// If the new page has not arrived this long after the cover started closing, it opens anyway.
export const COVER_FAILSAFE_MS = 4000;

export function coverReducer(state: CoverState, event: CoverEvent): CoverState {
  switch (event) {
    case "navigate":
      return state === "idle" ? "closing" : state;
    case "closed":
      return state === "closing" ? "covered" : state;
    case "arrived":
      return state === "covered" ? "opening" : state;
    case "opened":
      return state === "opening" ? "idle" : state;
    case "failsafe":
      return state === "closing" || state === "covered" ? "opening" : state;
  }
}

// Only a link to another page is covered: not in still mode, not a link to the page already
// shown, not a hash link within it.
export function shouldCover(mode: MotionMode, currentPath: string, href: string): boolean {
  if (mode !== "full") return false;
  return new URL(href, `http://site${currentPath}`).pathname !== currentPath;
}
