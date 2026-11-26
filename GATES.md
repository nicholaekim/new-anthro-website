# Gates: One Person, Many Boxes design plan

OWNS: design-plan.md, GATES.md, .unlazy/**

Scope: a structured, verified design plan (design brainstorming, conceptual architecture, GSAP feature explanations) delivered as design-plan.md and in chat, with no code, no submission-ready text, no historical claims and no AI-asset proposals

- [x] G0: this ledger states outcomes that can fail
  CHECK: node "%USERPROFILE%\.claude\skills\unlazy\scripts\gate-lint.mjs" GATES.md
  EXPECT: LINT OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=8861b9aaa9541ac1c9597f5d97511c3d455cd79164cc639a0c6ac656d904107f; exit=0; EXPECT=matched; output-sha256=c94fad9eaeb7ac657c50ea62088304c4e137bf801afbb08d3f491323abb8ee0f; output-bytes=386; shell=C:\Windows\system32\cmd.exe; cwd=C:\Users\nkim2\OneDrive\Desktop\ench contri; path=529c009b1b03/29 entries

- [x] G1: the plan covers all five requested areas, a build order, and all four locations with both of their years
  CHECK: node .unlazy/verify-plan.mjs structure
  EXPECT: PLAN-STRUCTURE-OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=fa9b511d1759fa9d7ad87b962ab4df37e4deff995cf2fb803156c25b851877a5; exit=0; EXPECT=matched; output-sha256=19122f175d2ab6a844f0241666d5a3def04add035642184e344d252c64b39ca3; output-bytes=18; shell=C:\Windows\system32\cmd.exe; cwd=C:\Users\nkim2\OneDrive\Desktop\ench contri; path=529c009b1b03/29 entries

- [x] G2: the plan contains no website code
  CHECK: node .unlazy/verify-plan.mjs no-code
  EXPECT: PLAN-NOCODE-OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=7c27105f062ccfb2dc130fb7d13d4efe9f657e920a801d71608d8e61c1145bba; exit=0; EXPECT=matched; output-sha256=06e9368bbff62d5c940973308717d33225295f4fd5644ad58079f8f59d0b680f; output-bytes=15; shell=C:\Windows\system32\cmd.exe; cwd=C:\Users\nkim2\OneDrive\Desktop\ench contri; path=529c009b1b03/29 entries

- [x] G3: the no-code checker rejects a fixture that contains code and accepts one that only names API features
  CHECK: node .unlazy/verify-plan.mjs control
  EXPECT: NOCODE-CONTROL-OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=a2930258f2834c8a395e75cb4e3a5d01d9e7ddd9b43d9b6018f46ad86fecf526; exit=0; EXPECT=matched; output-sha256=1e18fc5e7df2ea792bdd92f95c2714ed244bc32d35d3f4f5eac6c129d331d177; output-bytes=18; shell=C:\Windows\system32\cmd.exe; cwd=C:\Users\nkim2\OneDrive\Desktop\ench contri; path=529c009b1b03/29 entries

- [x] G4: every GSAP feature the plan names is described consistently with the official GSAP documentation
  EVIDENCE: manual, 2026-11-25. Two independent verifier agents checked draft 1 against gsap.com, nextjs.org and react.dev: 48 claims confirmed, 12 findings (2 major, 10 minor), all 12 applied in the revision. Feature names added by the revision (onNavigate, ViewTransition, matchMediaRefresh, labelToScroll, the useGSAP scope option) come from those verifiers' sourced corrections. Second round, 2026-11-26: a fresh agent re-checked the revision against gsap.com, nextjs.org, react.dev, MDN and Tailwind docs: no blockers, about 60 claims confirmed, 9 findings (2 major on SplitText accessibility and autoSplit, 7 minor), all applied in the third version. Limit: the third version was not checked again, and most pages were read through a summarising fetch tool.

- [x] G5: the plan states no historical claims, invents no evidence, contains no submission-ready site text, and proposes no AI-generated assets
  EVIDENCE: manual, 2026-11-25. An independent integrity-audit agent read draft 1 line by line: no blockers, no code, no AI-asset proposals; 17 major and 13 minor findings on liftable phrasing and history implied by presupposition, all addressed in the revision (thesis sentences removed, place-specific contingencies made place-neutral, prompt and option wording turned into slots, labels declared as working labels). One finding cannot be fixed by rewording and is disclosed at the top of the plan and to the user: the plan's depth may exceed what a strict instructor counts as brainstorming. Second round, 2026-11-26: a fresh agent re-audited the revision: clean on literal code, site copy, stated history and generated media; 3 blockers (a sentence presupposing a research finding, wiring described precisely enough to transcribe, a disclosure that overstated the review) and 17 further findings. The three blockers and the representation findings are fixed in the third version; feature and option names are kept because the user asked for GSAP features to be explained. Unresolved by design: both audits judge the plan's depth may exceed brainstorming for a strict instructor; this is disclosed at the top of the plan and put to the user. Limit: the third version was not audited again.

- [x] G6: the plan gives a build order and cut list that one student can realistically finish
  EVIDENCE: manual, 2026-11-25. An independent feasibility agent judged draft 1 not buildable as written (1 blocker, 31 major, 13 minor). The revision adds the missing staging description (the blocker), fixes the pin count, removes the 2020 prediction mismatch, recounts assets (about 25), adds a first-days checklist, a parallel research track, a reworked six-week table, a four-week variant and a cut list split into unscheduled extras and real cuts. Second round, 2026-11-26: a fresh agent judged the revision partly buildable (2 blockers: the change-of-date beat and the era switch were undefined; 13 major, 5 minor) and estimated the build at 70 to 80 hours against 48 to 60 available. The third version defines both blockers, adds phone staging and a viewport composition, and cuts default scope (no prediction, no pinned outcome, still opening and ending). Limit: the third version was not reviewed again, the hour figures are a reviewer's estimate, and research and asset time is outside the build hours.
