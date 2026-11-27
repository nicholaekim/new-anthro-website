// The close view's arithmetic. The page is laid out at its fitted size (content) in the top left
// of the viewport and drawn with the CSS transform translate(x, y) scale(scale) about its own top
// left. scale 1 is the whole page; every view below passes through clampView, so the page can
// never be lost from the viewport.

export interface Size {
  width: number;
  height: number;
}
export interface Point {
  x: number;
  y: number;
}
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface View {
  scale: number;
  x: number;
  y: number;
}
// In fractions of the image, 0 to 1, as in src/content/regions.ts.
export interface Region {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const MIN_SCALE = 1;
export const MAX_SCALE = 8;

const clampScale = (scale: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));

// The image contained in the viewport, proportions kept.
export function fitSize(image: Size, viewport: Size): Size {
  const k = Math.min(viewport.width / image.width, viewport.height / image.height);
  return { width: image.width * k, height: image.height * k };
}

// Scale within the limits; on each axis the page is centred while it is smaller than the
// viewport, and otherwise covers it edge to edge (no gap can open on either side).
export function clampView(view: View, content: Size, viewport: Size): View {
  const scale = clampScale(view.scale);
  const axis = (pos: number, size: number, room: number) => {
    const drawn = size * scale;
    return drawn <= room ? (room - drawn) / 2 : Math.min(0, Math.max(room - drawn, pos));
  };
  return { scale, x: axis(view.x, content.width, viewport.width), y: axis(view.y, content.height, viewport.height) };
}

export function wholePage(content: Size, viewport: Size): View {
  return clampView({ scale: MIN_SCALE, x: 0, y: 0 }, content, viewport);
}

// The page's width across the viewport, from the top of the page.
export function fitWidthView(content: Size, viewport: Size): View {
  return clampView({ scale: viewport.width / content.width, x: 0, y: 0 }, content, viewport);
}

// Zoom by factor about a point in the viewport: the page point under it stays under it.
export function zoomAt(view: View, factor: number, point: Point, content: Size, viewport: Size): View {
  const scale = clampScale(view.scale * factor);
  const k = scale / view.scale;
  return clampView(
    { scale, x: point.x - (point.x - view.x) * k, y: point.y - (point.y - view.y) * k },
    content,
    viewport,
  );
}

export function panBy(view: View, dx: number, dy: number, content: Size, viewport: Size): View {
  return clampView({ ...view, x: view.x + dx, y: view.y + dy }, content, viewport);
}

// The region centred and as large as fits inside margin (a fraction of the viewport kept clear
// on every side), then clamped: a region at the page's edge sits off centre rather than leave
// the page.
export function viewForRegion(region: Region, content: Size, viewport: Size, margin = 0.1): View {
  const room = 1 - 2 * margin;
  const scale = clampScale(
    Math.min((viewport.width * room) / (region.w * content.width), (viewport.height * room) / (region.h * content.height)),
  );
  const cx = (region.x + region.w / 2) * content.width * scale;
  const cy = (region.y + region.h / 2) * content.height * scale;
  return clampView({ scale, x: viewport.width / 2 - cx, y: viewport.height / 2 - cy }, content, viewport);
}

// Where a point of the laid-out page (in its own pixels) is drawn in the viewport.
export function toScreen(view: View, p: Point): Point {
  return { x: view.scale * p.x + view.x, y: view.scale * p.y + view.y };
}

// Where a region is drawn in the viewport: the outline over a highlight is placed here.
export function regionRect(region: Region, view: View, content: Size): Rect {
  const topLeft = toScreen(view, { x: region.x * content.width, y: region.y * content.height });
  return {
    x: topLeft.x,
    y: topLeft.y,
    width: region.w * content.width * view.scale,
    height: region.h * content.height * view.scale,
  };
}

// After the viewport changes size (a rotated phone, a resized window): the same scale, and the
// page point that was at the viewport's centre is at the centre again.
export function resizeView(view: View, content: Size, viewport: Size, nextContent: Size, nextViewport: Size): View {
  const fx = (viewport.width / 2 - view.x) / (content.width * view.scale);
  const fy = (viewport.height / 2 - view.y) / (content.height * view.scale);
  return clampView(
    {
      scale: view.scale,
      x: nextViewport.width / 2 - fx * nextContent.width * view.scale,
      y: nextViewport.height / 2 - fy * nextContent.height * view.scale,
    },
    nextContent,
    nextViewport,
  );
}
