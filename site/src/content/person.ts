import { slot } from "./slot";
import type { PersonCard, PersonFact } from "./types";

const fact = (id: string, n: number): PersonFact => ({
  id,
  label: slot(`the name of fact ${n} you define about the fictional person (no physical description)`),
  value: slot(`the value of fact ${n} you define about the fictional person`),
  reason: slot(`your sourced reason for including fact ${n}`),
});

export const person: PersonCard = {
  facts: [fact("fact-1", 1), fact("fact-2", 2), fact("fact-3", 3), fact("fact-4", 4)],
  fictionStatement: slot("your visible statement that the person is fictional"),
};
