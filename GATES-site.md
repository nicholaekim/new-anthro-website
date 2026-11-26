# Gates: One Person, Many Boxes site build

OWNS: site/**, docs/**, README.md, GATES-site.md, .unlazy/verify-site.mjs

Scope: the default design in design-plan.md built as a working Next.js site in site/, with every research slot a visible placeholder and no invented content

- [ ] G0: this ledger states outcomes that can fail
  CHECK: node "%USERPROFILE%\.claude\skills\unlazy\scripts\gate-lint.mjs" GATES-site.md
  EXPECT: LINT OK
  EVIDENCE: pending

- [ ] G1: the site's unit tests all pass
  CHECK: node .unlazy/verify-site.mjs test
  EXPECT: SITE-TESTS-OK
  EVIDENCE: pending

- [ ] G2: the site has no lint errors
  CHECK: node .unlazy/verify-site.mjs lint
  EXPECT: SITE-LINT-OK
  EVIDENCE: pending

- [ ] G3: the production build succeeds and prerenders the opening, four chapters and the ending
  CHECK: node .unlazy/verify-site.mjs build
  EXPECT: SITE-BUILD-OK
  EVIDENCE: pending

- [ ] G4: at desktop width in a real browser, beats 2 and 6 pin and scrub and the era switch moves between the two dates
  EVIDENCE: pending

- [ ] G5: below 1024 pixels and in still mode nothing pins, and every slot and both eras are readable in order
  EVIDENCE: pending

- [ ] G6: the content files hold placeholders only, with no invented historical facts, sources or site wording
  EVIDENCE: pending

- [ ] G7: every finding from the final whole-branch review is fixed or recorded with a ruling
  EVIDENCE: pending
