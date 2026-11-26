# Gates: One Person, Many Boxes site build

OWNS: site/**, docs/**, README.md, GATES-site.md, .unlazy/verify-site.mjs

Scope: the default design in design-plan.md built as a working Next.js site in site/, with every research slot a visible placeholder and no invented content

- [x] G0: this ledger states outcomes that can fail
  CHECK: node "%USERPROFILE%\.claude\skills\unlazy\scripts\gate-lint.mjs" GATES-site.md
  EXPECT: LINT OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=7c3a31ed0d01a44a046a74922d11bd9088cf1bafdc6a35b149d307c401223646; exit=0; EXPECT=matched; output-sha256=34b3d3494ed66e0f7df1ac46a8813a01cef2c690033fdb36db72cf92fd78ed60; output-bytes=1215; shell=C:\Windows\system32\cmd.exe; cwd=C:\Users\nkim2\OneDrive\Desktop\ench contri; path=529c009b1b03/29 entries

- [x] G1: the site's unit tests all pass
  CHECK: node .unlazy/verify-site.mjs test
  EXPECT: SITE-TESTS-OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=2f38379bc449484d6e63844cc66cffdf11d95ff20cc3ab3de6f2bf944a5c6aaf; exit=0; EXPECT=matched; output-sha256=349bc1f884b08f61a0d16955456cda265fcdd9415e9a98544d7af2195d7a58e6; output-bytes=287; shell=C:\Windows\system32\cmd.exe; cwd=C:\Users\nkim2\OneDrive\Desktop\ench contri; path=529c009b1b03/29 entries

- [x] G2: the site has no lint errors
  CHECK: node .unlazy/verify-site.mjs lint
  EXPECT: SITE-LINT-OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=9ff67ec0d02885f71683897e05f797d6ff48b645bf9daf7a31de454e728c8280; exit=0; EXPECT=matched; output-sha256=65b818365ea509a7ad36e323eabe6d76f68862f3d1b43d06ea7035a65831d76f; output-bytes=42; shell=C:\Windows\system32\cmd.exe; cwd=C:\Users\nkim2\OneDrive\Desktop\ench contri; path=529c009b1b03/29 entries

- [x] G3: the production build succeeds and prerenders the opening, four chapters and the ending
  CHECK: node .unlazy/verify-site.mjs build
  EXPECT: SITE-BUILD-OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=44fe04f2a18ae2094bd43c40126756ea0db4c6fb71c29f97679fbf37f93886be; exit=0; EXPECT=matched; output-sha256=6d02113ca1c40abdc17085c9770dff4ac8c6d2b6faf44c141c520deb81516ace; output-bytes=924; shell=C:\Windows\system32\cmd.exe; cwd=C:\Users\nkim2\OneDrive\Desktop\ench contri; path=529c009b1b03/29 entries

- [x] G4: at desktop width in a real browser, beats 2 and 6 pin and scrub and the era switch moves between the two dates
  EVIDENCE: manual, 2026-11-26, controller, production build of ed7808f at 1280x800 on /chapters/johannesburg. Two pin-spacers. Beat 2 inner element position fixed mid-pin. Beat 6 inner fixed mid-pin; media opacity historical 0.38 and present 0.63 at mid-scroll, 0 and 1 at the end; both captions opacity 1 and inside the viewport; era switch inside the viewport; date line scaleX 0.55 at mid-scroll and 1 at the end. Clicking the era switch at the start of the pin scrolled 3794 to 4544 and showed the present era. An earlier run on 36135a6 also showed three foreground layers in beat 2 moving by different amounts. Limits: one browser engine, no real touch device, system reduced-motion setting not exercised.

- [x] G5: below 1024 pixels and in still mode nothing pins, and every slot and both eras are readable in order
  EVIDENCE: manual, 2026-11-26, controller, production build of ed7808f at 900x800. /chapters/louisiana: 0 pin-spacers, beats 1 to 8 in page order, both era captions opacity 1 with the two media layers stacked, no non-empty inline styles, 65 slots of which the 13 person-card slots sit behind its always-visible button. /chapters/tobique: 0 pin-spacers, beats 1,2,3,4,6,7,8, no mark, no person-card control, 46 slots all visible, no horizontal scroll. Still mode at desktop width was checked on 36135a6: switching motion off mid-pin left 0 pin-spacers, no overlap attribute, only empty style attributes, both media opacity 1. The fix-wave implementer checked 320 wide on Tobique (Motion, Menu and Restart clickable). Limits: still mode at desktop width not re-run on ed7808f; no screen reader used.

- [x] G6: the content files hold placeholders only, with no invented historical facts, sources or site wording
  EVIDENCE: manual, 2026-11-26. content.test.ts walks every Text field reachable from the chapters, the person card and the page slots and asserts each is a slot (it runs inside gate G1). The final whole-branch reviewer read site/src/content, the tests and README.md and reported the only real strings are places, countries, years, slugs and interface labels; the fix-wave re-reviewer confirmed the new test fixture holds only slots and neutral strings. Limit: interface labels (beat headings and similar) are AI-written working labels, which README.md now states.

- [x] G8: in full motion in a real browser, page titles reveal without first flashing finished, the opening sequence plays once and can be skipped, and a cover closes and opens on in-app links
  EVIDENCE: manual, 2026-11-26, controller, production build of c8f0678 at 1280x800. Opening on a fresh session: Skip button present, then title visible with its original markup (no wrappers, no aria-label, no inline style), seen flag stored, Skip gone. Skip pressed 186 ms after load: title visible, no page errors. Clicking the link to chapter 1 from a scrolled position: landed on /chapters/louisiana at scrollY 0 with two pin-spacers at 872 and 3784 (the fresh-load values), h1 clean, no cover element left, focus on the h1. On 9c99809 the cover's opacity was sampled every 100 ms: 0.77, 0.96, 1.00 before the route changed, then 0.46, 0.13, 0.03, 0.00 and removed by about 1 s; Back was a plain cut to the top with pins measured correctly. Motion switched off and on again on the opening page: page intact, no errors. Limits: "no flash of the finished title" was sampled frame by frame by the implementer, not by the controller; one browser engine; no screen reader.

- [x] G9: with motion off, at phone width in still mode, and with scripts disabled, every heading is visible and no reveal, opening sequence or cover runs
  EVIDENCE: manual, 2026-11-26. Controller, production build of 9c99809 at desktop width with Motion off: a menu link navigated with no cover element at any sampled moment, no element with visibility hidden, no inline styles, the h1 unsplit, and the pending mark absent. Controller at 375 wide (motion on): heading visible, nothing hidden, no pins, no horizontal scroll. Implementer on the same build: Motion off at 375 wide showed nothing hidden or covered, and with scripts blocked in a sandboxed iframe every heading was visible. Unit tests in gate G1 assert that still mode constructs no SplitText, renders no Skip button and no cover, and that the pending script marks the document only when motion will be full and removes the mark after 2500 ms. Limits: scripts-disabled was checked by the implementer only, through a sandboxed frame and not a browser setting; the system reduced-motion setting was not exercised in a browser.

- [x] G7: every finding from the final whole-branch review is fixed or recorded with a ruling
  EVIDENCE: manual, 2026-11-26. Final review at 3d87d00: 0 critical, 4 important, 6 minor worth fixing, 2 deferred minors promoted. All twelve (A to L) were fixed in ed7808f and a scoped re-review returned "all findings addressed" with no new critical or important breakage. Left by the reviewer's triage and recorded in the build ledger and README known limitations: 29 deferred minors (5 already resolved at head), plus 2 new minors from the re-review (README wording on line breaks on the opening page; a removed greater-than-zero guard in one test) and 2 noted assumptions (beat 6 height cap hard-codes header and beat-bar heights; validateChapter reads the live person card).
