// Checks design-plan.md against the acceptance gates in GATES.md.
// Usage: node .unlazy/verify-plan.mjs <structure|no-code|control>
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const here = (rel) => fileURLToPath(new URL(rel, import.meta.url));
const fail = (problems) => {
  console.error('FAILED');
  for (const p of problems) console.error(' - ' + p);
  process.exit(1);
};
const read = (path) => {
  try {
    return readFileSync(path, 'utf8');
  } catch {
    fail(['cannot read ' + path]);
  }
};

// Naming an API feature inline (ScrollTrigger, gsap.matchMedia()) is allowed;
// anything shaped like a statement, config literal, markup or fenced block is not.
function codeProblems(text) {
  const rules = [
    [/^\s{0,3}(```|~~~)/, 'fenced block'],
    [/^\s*(import|export|const|let|var|function|return)\s/, 'statement keyword'],
    [/=>/, 'arrow function'],
    [/<\/?[A-Za-z][A-Za-z0-9]*(\s[^>]*)?\/?>/, 'markup tag'],
    [/[;{]\s*$/, 'statement terminator'],
    [/\w\.\w+\([^)\s][^)]*\)/, 'call with arguments'],
    [/className=|scrollTrigger\s*:/, 'prop or config literal'],
  ];
  const problems = [];
  text.split(/\r?\n/).forEach((line, i) => {
    for (const [pattern, label] of rules) {
      if (pattern.test(line)) problems.push(`line ${i + 1}: ${label}`);
    }
  });
  return problems;
}

function structureProblems(text) {
  const problems = [];
  const lines = text.split(/\r?\n/);
  const headings = lines.filter((l) => /^#{1,4}\s/.test(l)).join('\n');
  const sections = {
    'cinematic storytelling': /cinematic|storytelling/i,
    'GSAP techniques': /gsap/i,
    'interactive environments': /interactive|environment/i,
    'visual design': /visual/i,
    'user experience': /user experience|navigation/i,
    'build order': /build order/i,
    'cut list': /cut/i,
  };
  for (const [name, pattern] of Object.entries(sections)) {
    if (!pattern.test(headings)) problems.push(`no heading for ${name}`);
  }
  const places = [
    [/Louisiana/, '1930'],
    [/S[aã]o Paulo/, '1950'],
    [/Johannesburg/, '1955'],
    [/Tobique/, '1960'],
  ];
  for (const [place, year] of places) {
    const both = lines.some((l) => place.test(l) && l.includes(year) && l.includes('2020'));
    if (!both) problems.push(`no line pairing ${place.source} with ${year} and 2020`);
  }
  const words = text.split(/\s+/).filter(Boolean).length;
  if (words < 1500) problems.push(`only ${words} words; a plan this broad needs at least 1500`);
  return problems;
}

const mode = process.argv[2];
if (mode === 'structure') {
  const problems = structureProblems(read(here('../design-plan.md')));
  if (problems.length) fail(problems);
  console.log('PLAN-STRUCTURE-OK');
} else if (mode === 'no-code') {
  const problems = codeProblems(read(here('../design-plan.md')));
  if (problems.length) fail(problems);
  console.log('PLAN-NOCODE-OK');
} else if (mode === 'control') {
  const problems = [];
  if (codeProblems(read(here('./fixtures/has-code.md'))).length === 0) {
    problems.push('checker accepted the fixture that contains code');
  }
  const clean = codeProblems(read(here('./fixtures/names-only.md')));
  if (clean.length) problems.push('checker rejected the names-only fixture: ' + clean.join(', '));
  if (problems.length) fail(problems);
  console.log('NOCODE-CONTROL-OK');
} else {
  fail(['unknown mode: ' + mode]);
}
