# V29 — Targeted refinements to slides 14 and 15

## Slide 14 — Proof idea: separation of degrees

- Moved alpha=0 down and alpha=infinity up; centered the alpha=1 label on the actual horizontal minimum-degree divider, using the post-reveal position.
- Lowered the maximum-degree divider and enlarged the finite-alpha formula to match the other mathematical entries.
- Placed MINIMUM and MAXIMUM transition captions under their corresponding columns and added the explicit wording "transition at" for both.
- Used context-free delta and Delta notation exclusively in the right-hand panel, including the sufficient condition k-1+delta>Delta. The left panel's mathematical definitions were unchanged.

## Slide 15 — When degrees are not enough

- Replaced the legacy inline SVG diagram with the exact approved text-free VD v3 asset already used on slide 13.
- Created independent HTML headings, logarithmic axes, color legend and a schematicity note; the v3 geometric regions and transition bands are unchanged.
- Reimplemented the interactive marker as an overlaid SVG with the same plot viewBox; preserved the existing graph, sliders, ranked bars and recovery computation.
- Slider ranges remain mu in [0.5, 19] and k in [2, 10]; the qualitative marker does not assert finite-n thresholds.

## Verification

- All five reveal moments of slide 14 and both moments of slide 15 rendered in Chromium.
- Alpha=1 label aligned to within one pixel of the minimum-degree horizontal divider.
- Min/max slider values move the diagram marker within the expected bounds; backward navigation hides the diagram when the network returns.
- JavaScript error check, offline HTML build and patch-rebuild verification passed.
