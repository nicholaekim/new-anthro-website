import { person } from "./person";
import { highlights as allHighlights, type Highlight } from "./regions";
import { isSlot, type Text } from "./slot";
import { CONFIDENCE_LEVELS, type Basis, type Chapter, type ConfidenceLevel } from "./types";

const LEVELS: readonly ConfidenceLevel[] = CONFIDENCE_LEVELS;

// Fractions that add up to 1 may come out a hair over it.
const EPSILON = 1e-9;

const isText = (t: Text) => !isSlot(t) && t.trim() !== "";

// Checks the chapter's internal references. An empty array means valid. highlights defaults to
// the site's own (regions.ts); a test may pass others.
export function validateChapter(c: Chapter, highlights: Record<string, Highlight[]> = allHighlights): string[] {
  const problems: string[] = [];
  const instrument = c.present.instrument;
  const allItems = [c.photograph, ...c.items, ...(instrument ? [instrument] : [])];

  for (const item of allItems) {
    if (item.kind === "document" && item.image !== null && item.transcription === null) {
      problems.push(`${c.slug}: document "${item.id}" has an image but no transcription`);
    }
    const annotationIds = new Set(item.annotations.map((a) => a.id));
    for (const h of highlights[item.id] ?? []) {
      for (const id of h.annotationIds) {
        if (!annotationIds.has(id)) problems.push(`${c.slug}: highlight "${h.id}" names "${id}", which is not an annotation of "${item.id}"`);
      }
      const { x, y, w, h: height } = h.region;
      const inside = [x, y, w, height].every((v) => v >= 0 && v <= 1) && x + w <= 1 + EPSILON && y + height <= 1 + EPSILON && w > 0 && height > 0;
      if (!inside) problems.push(`${c.slug}: highlight "${h.id}" has a region outside the image`);
    }
  }

  if (c.changeOfDate) {
    const { historicalItemId, presentItemId } = c.changeOfDate;
    if (!c.items.some((i) => i.id === historicalItemId)) {
      problems.push(`${c.slug}: changeOfDate names "${historicalItemId}", which is not in items`);
    }
    if (instrument?.id !== presentItemId) {
      problems.push(`${c.slug}: changeOfDate names "${presentItemId}", which is not present.instrument`);
    }
  }

  for (const [era, s] of Object.entries(c.summary)) {
    if (!isText(s.decides)) problems.push(`${c.slug}: the ${era} summary's "decides" must be text`);
    if (!isText(s.evidence)) problems.push(`${c.slug}: the ${era} summary's "evidence" must be text`);
  }

  for (const outcome of [c.outcome, c.present.outcome]) {
    if (outcome && !LEVELS.includes(outcome.level)) problems.push(`${c.slug}: an outcome's level "${outcome.level}" is not one of ${LEVELS.join(", ")}`);
  }

  const factIds = new Set(person.facts.map((f) => f.id));
  const bases: Basis[] = [c.basis, c.present.basis].filter((b): b is Basis => b !== null);
  for (const basis of bases) {
    if (!c.showPersonCard && basis.cardFactsUsed.length > 0) {
      problems.push(`${c.slug}: showPersonCard is false, so cardFactsUsed must be empty`);
    }
    for (const id of basis.cardFactsUsed) {
      if (!factIds.has(id)) problems.push(`${c.slug}: cardFactsUsed names "${id}", which is not a person fact`);
    }
  }

  return problems;
}
