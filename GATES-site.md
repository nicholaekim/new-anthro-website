# Gates: One Person, Many Boxes site build

OWNS: site/**, docs/**, README.md, GATES-site.md, .unlazy/verify-site.mjs

Scope: the default design in design-plan.md built as a working Next.js site in site/, with every research slot a visible placeholder and no invented content

- [x] G0: this ledger states outcomes that can fail
  CHECK: node "%USERPROFILE%\.claude\skills\unlazy\scripts\gate-lint.mjs" GATES-site.md
  EXPECT: LINT OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=7c3a31ed0d01a44a046a74922d11bd9088cf1bafdc6a35b149d307c401223646; exit=0; EXPECT=matched; output-sha256=e2f04b850c408efca187dfbea7b8dce66f22cb5d935255d470179bf3fe1bcb49; output-bytes=881; shell=C:\Windows\system32\cmd.exe; cwd=C:\Users\nkim2\OneDrive\Desktop\ench contri; path=529c009b1b03/29 entries

- [x] G1: the site's unit tests all pass
  CHECK: node .unlazy/verify-site.mjs test
  EXPECT: SITE-TESTS-OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=2f38379bc449484d6e63844cc66cffdf11d95ff20cc3ab3de6f2bf944a5c6aaf; exit=0; EXPECT=matched; output-sha256=fb40733693aa0a24e750a5e3ede2d1443a598935dc08ac9edefa55e656aac573; output-bytes=285; shell=C:\Windows\system32\cmd.exe; cwd=C:\Users\nkim2\OneDrive\Desktop\ench contri; path=529c009b1b03/29 entries

- [x] G2: the site has no lint errors
  CHECK: node .unlazy/verify-site.mjs lint
  EXPECT: SITE-LINT-OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=9ff67ec0d02885f71683897e05f797d6ff48b645bf9daf7a31de454e728c8280; exit=0; EXPECT=matched; output-sha256=65b818365ea509a7ad36e323eabe6d76f68862f3d1b43d06ea7035a65831d76f; output-bytes=42; shell=C:\Windows\system32\cmd.exe; cwd=C:\Users\nkim2\OneDrive\Desktop\ench contri; path=529c009b1b03/29 entries

- [x] G3: the production build succeeds and prerenders the opening, four chapters and the ending
  CHECK: node .unlazy/verify-site.mjs build
  EXPECT: SITE-BUILD-OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=44fe04f2a18ae2094bd43c40126756ea0db4c6fb71c29f97679fbf37f93886be; exit=0; EXPECT=matched; output-sha256=995a0883d9c91828deea18a9b539d169ba673885d9f653d9052c2a03292c5c2d; output-bytes=926; shell=C:\Windows\system32\cmd.exe; cwd=C:\Users\nkim2\OneDrive\Desktop\ench contri; path=529c009b1b03/29 entries

- [x] G4: at desktop width in a real browser, beats 2 and 6 pin and scrub and the era switch moves between the two dates
  EVIDENCE: manual, 2026-11-26, controller, production build of ed7808f at 1280x800 on /chapters/johannesburg. Two pin-spacers. Beat 2 inner element position fixed mid-pin. Beat 6 inner fixed mid-pin; media opacity historical 0.38 and present 0.63 at mid-scroll, 0 and 1 at the end; both captions opacity 1 and inside the viewport; era switch inside the viewport; date line scaleX 0.55 at mid-scroll and 1 at the end. Clicking the era switch at the start of the pin scrolled 3794 to 4544 and showed the present era. An earlier run on 36135a6 also showed three foreground layers in beat 2 moving by different amounts. Limits: one browser engine, no real touch device, system reduced-motion setting not exercised.

- [x] G5: below 1024 pixels and in still mode nothing pins, and every slot and both eras are readable in order
  EVIDENCE: manual, 2026-11-26, controller, production build of ed7808f at 900x800. /chapters/louisiana: 0 pin-spacers, beats 1 to 8 in page order, both era captions opacity 1 with the two media layers stacked, no non-empty inline styles, 65 slots of which the 13 person-card slots sit behind its always-visible button. /chapters/tobique: 0 pin-spacers, beats 1,2,3,4,6,7,8, no mark, no person-card control, 46 slots all visible, no horizontal scroll. Still mode at desktop width was checked on 36135a6: switching motion off mid-pin left 0 pin-spacers, no overlap attribute, only empty style attributes, both media opacity 1. The fix-wave implementer checked 320 wide on Tobique (Motion, Menu and Restart clickable). Limits: still mode at desktop width not re-run on ed7808f; no screen reader used.

- [x] G6: the content files hold placeholders only, with no invented historical facts, sources or site wording
  EVIDENCE: manual, 2026-11-26. content.test.ts walks every Text field reachable from the chapters, the person card and the page slots and asserts each is a slot (it runs inside gate G1). The final whole-branch reviewer read site/src/content, the tests and README.md and reported the only real strings are places, countries, years, slugs and interface labels; the fix-wave re-reviewer confirmed the new test fixture holds only slots and neutral strings. Limit: interface labels (beat headings and similar) are AI-written working labels, which README.md now states.

- [x] G7: every finding from the final whole-branch review is fixed or recorded with a ruling
  EVIDENCE: manual, 2026-11-26. Final review at 3d87d00: 0 critical, 4 important, 6 minor worth fixing, 2 deferred minors promoted. All twelve (A to L) were fixed in ed7808f and a scoped re-review returned "all findings addressed" with no new critical or important breakage. Left by the reviewer's triage and recorded in the build ledger and README known limitations: 29 deferred minors (5 already resolved at head), plus 2 new minors from the re-review (README wording on line breaks on the opening page; a removed greater-than-zero guard in one test) and 2 noted assumptions (beat 6 height cap hard-codes header and beat-bar heights; validateChapter reads the live person card).
