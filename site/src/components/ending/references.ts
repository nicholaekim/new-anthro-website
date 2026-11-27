// The ending's reference notes (bibliography, image credits) as they are written in pages.ts:
// groups separated by a blank line, one entry a line. A group's first line is its heading when it
// reads as one: short, with no full stop, and followed by at least one entry ("Louisiana",
// "Place photographs"). The strings themselves are never changed.
export interface ReferenceGroup {
  heading: string | null;
  entries: string[];
}

const HEADING_MAX = 40;

export function parseReferences(text: string): ReferenceGroup[] {
  return text
    .split(/\r?\n\s*\r?\n/)
    .map((block) => block.split(/\r?\n/).map((line) => line.trim()).filter((line) => line !== ""))
    .filter((lines) => lines.length > 0)
    .map((lines) => {
      const [first, ...rest] = lines;
      const isHeading = rest.length > 0 && first.length <= HEADING_MAX && !first.includes(".");
      return isHeading ? { heading: first, entries: rest } : { heading: null, entries: lines };
    });
}

export type Segment = { text: string; href?: string };

// An entry split into text and web addresses. An address runs from https:// to the next space;
// a full stop, comma, semicolon or colon at its end is the sentence's, and so is a closing
// bracket the address did not open ("(https://…/4.0/).").
export function linkSegments(entry: string): Segment[] {
  const segments: Segment[] = [];
  let last = 0;
  for (const match of entry.matchAll(/https:\/\/\S+/g)) {
    const url = trimUrl(match[0]);
    const start = match.index;
    if (start > last) segments.push({ text: entry.slice(last, start) });
    segments.push({ text: url, href: url });
    last = start + url.length;
  }
  if (last < entry.length) segments.push({ text: entry.slice(last) });
  return segments;
}

function trimUrl(url: string): string {
  let end = url.length;
  for (;;) {
    const ch = url[end - 1];
    const part = url.slice(0, end);
    if (".,;:".includes(ch)) end -= 1;
    else if (ch === ")" && count(part, "(") < count(part, ")")) end -= 1;
    else return part;
  }
}

const count = (s: string, ch: string) => s.split(ch).length - 1;
