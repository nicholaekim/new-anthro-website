import { person } from "./person";
import type { Basis, Chapter } from "./types";

// Checks the chapter's internal references. An empty array means valid.
export function validateChapter(c: Chapter): string[] {
  const problems: string[] = [];
  const instrument = c.present.instrument;
  const allItems = [c.photograph, ...c.items, ...(instrument ? [instrument] : [])];

  for (const item of allItems) {
    if (item.kind === "document" && item.image !== null && item.transcription === null) {
      problems.push(`${c.slug}: document "${item.id}" has an image but no transcription`);
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
