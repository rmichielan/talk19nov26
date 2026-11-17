# Template parity — 12 November 2026 vs. RGG talk v14

Audited against the exact user-provided `Talk_Refactored_12Nov26(1).zip`.

## Shared components retained verbatim

- `template/builder.py` — unchanged generic single-file builder.
- `src/styles/theme.css` and `src/styles/layout-primitives.css` — identical shared typography and scientific primitives.
- `src/layouts/scientific-*.html` — identical theorem, algorithm, header, footer and takeaway partials.
- `src/core/viewport.js`, `src/core/runtime.js`, `src/core/boot.js` — identical universal runtime.
- Original two-dimensional graph and planted-clique demonstrations are topic-specific; they must not be replaced with GIRG code from the source talk.

## Discrepancies found and fixed

1. **Missing controls.css:** the RGG build accidentally excluded the 12-Nov `src/styles/controls.css`, despite keeping its DOM and keyboard callbacks. Restored the source stylesheet and its lower-left `?`, lower-right `01 / 25` counter, hidden presenter buttons, dark help panel and focus treatment.
2. **Missing slide viewport foundation:** `12-Nov/src/talk/styles/cover.css` owned the canonical 1600 x 900 `.slide` transform; the RGG build omitted these essential rules. Extracted the original layout rules into `src/styles/template-foundation.css` to retain responsive scaling and clipping on any window size.
3. **Talk-specific shared typography overrides:** common title, eyebrow, subtitle and footer positioning differed slightly. Restored original `theme.css` values for those common elements, while preserving bespoke scientific panels and mathematical diagrams.
4. **Incorrect legacy cover number:** replaced hard-coded `01 / 10` with a cover-local `01 / OPENING` tag, leaving the global 25-slide counter authoritative.
5. **Help content and accessibility:** preserved the original 12-Nov help popover design, but documented RGG-appropriate shortcuts and made its expanded state accessible.

## Deliberately unchanged

- The 25 slide narratives, equations, data, animations, exact graph models, and student/author information.
- The current talk's two-state research cover, its RGG network animation, and its final thank-you slide. They follow the same visual family, but necessarily contain different scientific content.
- Kamada–Kawai, torus wrapping, planted edge drawing, experiment results and numerical/qualitative diagram logic.
- The current talk's fixed-page navigation counter uses real slide IDs `01 ... 25`. The original talk subtracted one to label its cover `00` (`00 / 20`); that old convention is intentionally *not* copied because the requested deck numbers its opening slide `01`.

## QA

Run `python generate.py && python generate.py --check` and verify the built deck in Chromium at native and smaller viewport sizes, all slides, and interactive controls.
