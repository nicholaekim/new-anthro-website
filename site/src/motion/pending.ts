import { MOTION_KEY, REDUCED_QUERY, resolveMotionMode, type MotionMode } from "./motionMode";

// While this attribute is on <html>, elements marked data-reveal are hidden (globals.css), so a
// title never shows finished before its reveal is set up. Only the inline script sets it, and
// only when motion will be full; MotionReady removes it, and the script itself after the failsafe.
export const PENDING_ATTR = "data-motion-pending";
export const PENDING_FAILSAFE_MS = 2500;

export function shouldMarkPending(systemReduced: boolean, override: MotionMode | null): boolean {
  return resolveMotionMode(systemReduced, override) === "full";
}

// The inline script in the root layout's head. It runs before first paint and cannot import, so
// it restates shouldMarkPending: a stored "full" or "still" wins, anything else means no override.
export function pendingScript(): string {
  return `(function(){try{var o=null;try{o=sessionStorage.getItem(${JSON.stringify(MOTION_KEY)})}catch(e){}var full=o==="full"||(o!=="still"&&!matchMedia(${JSON.stringify(REDUCED_QUERY)}).matches);if(!full)return;var d=document.documentElement;d.setAttribute(${JSON.stringify(PENDING_ATTR)},"");setTimeout(function(){d.removeAttribute(${JSON.stringify(PENDING_ATTR)})},${PENDING_FAILSAFE_MS})}catch(e){}})()`;
}
