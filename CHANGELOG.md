# Talk RGG · changelog

## v13 — 17 November 2026
- Added Section VI (slides 22–25), preserving approved slides 1–21.
- Slide 22: synchronized qualitative VD/CN regions on two shared axes, 300-vertex conditional RGG, genuine topology-derived Kamada–Kawai network, k=2..30, mu=0.5..55; orange clique revealed, parameter markers update in both diagrams, `R` reseeds. No actual VD/CN algorithm outcome indicators are shown because this slide compares **theoretical guarantees**, not individual recovery tests.
- Slide 23: recomputed real finite-n results, not reused PowerPoint screenshots. Three fixed-mu slices (2.5, 7.5, 38.0) show VD and CN; fourth reveal returns to middle mu and adds harmonic centrality (exact) and betweenness (32-source approximation). Honest sample sizes 45 vs 28 replications, n=300 fixed, 2D toroidal RGG, with proper data and scripts. Independent experiments can be rerun and re-embedded.
- Slide 24: succinct research takeaways, future directions and PAiNe bridge.
- Slide 25: dark-mode closing cover preserving 12 November 2026 motif, using the animated network from slide 1, QR to the existing personal research site, GSSI / UniPD / MSCA marks and correct paper collaborators.
- Screenshots, runtime interaction checks, reproducibility docs and single-file HTML generator validation performed.

## v12 — 17 November 2026
- Slide 16: all newly planted edges are drawn as direct long chords in latent geometric view (and all edges internal to the highlighted clique are direct from the planted-edge reveal onward). Natural RGG edges retain periodic segments, consistently with slides 9–10. This fixes the previous partial rendering rule, which applied direct chords only to the main selected edge and final clique highlight.
- Slide 18: recovery regions B and C are now **geometrically separated**, as in the paper/Toronto qualitative figure; improved connectivity transition with a narrow textured gray band, removed the lower redundant legend, and replaced graphical axis math notation with embedded LaTeX SVG.
- Slide 21: redesigned R1/R2 as clean orange clipped caps inside the actual intersection of the two r-balls, with typeset mathematical labels. Enlarged and simplified the right overlapping-ball illustration; removed the tiny redundant explanatory sentence. B and C use the same dark-green marker treatment as A.
- Presentation-wide audit: visually reviewed each of 21 slides at 1600×900 with settled transitions; checked for out-of-canvas labels and collisions. Simplified/remove slide 8 microcopy, enlarged useful labels and legend typography in slides 8–10 and the CN condition text in slide 16. The only apparent bounding-box overlaps were intentional inline math/text runs.
- Generated HTML and cache verified, no JavaScript runtime errors, long direct clique edges confirmed by browser geometry checks.

## v11 — 17 November 2026
- Slide 16: fixed the first zoom after dragging by computing the focus in the translated torus coordinates; natural-edge zoom is 50% larger, highlighted elements thicker, inactive graph less transparent, parameter strip more prominent. The smaller numeric CN count appears only at reveal moments 3 and 6.
- Slides 9–10 (latent geometric views) and 16: natural edges use shortest torus-wrapped segments, while **added planted edges are rendered as direct chords**, even if long. Graph-only Kamada–Kawai positions remain unchanged.
- Slide 17 untouched as requested.
- Slide 18: theorem conditions A/B/C show individually in larger mathematical typography and highlight their diagram regions progressively; a final reveal shows all three. Rebuilt diagram using the original CN qualitative phase portrait (Toronto 2026 talk / paper Fig. 2(b)) rather than simplified prior shapes.
- Proof idea expanded to **three slides (19–21)**: visible event definitions and failure decomposition; planted-edge existence with two geometrically disjoint balls; false-positive rejection via clearly orange R₁/R₂ caps and a centered overlap lens with quantitative CN comparison. Removed the redundant conclusion banner.
- Region labels A/B/C remain plain capital roman; events use distinct calligraphic 𝒜, 𝓑₁, 𝓑₂ throughout. Total: **21 slides**, all editable; previous sections preserved except geometric chord rendering.
- Chromium browser QA at 1600×900 for reveals, formulas, zoom after pointer dragging, R reroll behavior, and qualitative theorem states.

## v10 — 17 November 2026
- Introduced Section V, **Common Neighbors** (slides 16–20), preserving the design and simulations of slides 1–15.
- Slide 16: native interactive torus RGG with exactly 300 vertices, μ=7.5 and k=10; natural-edge neighborhood/reveal and genuine zoom with radius-r balls, followed by an added planted-edge comparison and the full highlighted planted clique. R selects another eligible edge in the same realization. Natural edges use toroidal geodesics; planted-clique highlights use direct chords to expose their non-geometric nature.
- Slide 17: algorithm-styled CN pseudocode, exact-count and clique checks, and original complexity bound, aligned with slide 12.
- Slide 18: theorem conditions in three named sufficient-recovery regions A, B, C, with separate highlights on the qualitative diagram.
- Slides 19–20: rigorous failure decomposition with separate calligraphic 𝒜, 𝓑₁, 𝓑₂; planted-edge witness and geometry/Poisson reasoning behind c₁,d and c₂,d.
- Source formulas checked against the published paper (DOI: 10.1093/comnet/cnag025); the phase diagram is qualitative, not a finite-n predictor.
- Browser-based slide-by-slide and reveal-by-reveal validation at 1600 × 900, including zoom/drag, R rerolls, CN recovery and embedded LaTeX.

## v09 — 16 November 2026
- Slides 11, 12 and 15: restored **vertical** vertex-degree histograms. Natural degree is blue and each planted increment is an orange segment stacked above, with reordering only in the third presenter-controlled reveal.
- Increased size of `Degree` and `top-k` labels, including when `k` is small; only a dashed cutoff marks the top-k region.
- Slide 12: reduced the right ranking panel and made the final exact-recovery question a prominent mathematical takeaway; maintained the algorithm environment and complexity.
- Slide 13: recast the left panel as a single mathematical **Definition** featuring alpha, T(n), t(n) and H. No premature labels as maximum/minimum degree and no Delta_n introduced here. Positive and negative theorems remain sequential.
- Slide 13 final reveal: 3-column summary aligned with the sub-connectivity, connectivity and super-connectivity panels of the qualitative log-log figure. Recovery formula spans the first two; failure condition is only in the connectivity cell, with the remaining formulas in super-connectivity.
- Slide 14: made alpha and the **MINIMUM DEGREE / MAXIMUM DEGREE** terminology prominent; mathematical labels on the right are typeset as embedded SVG LaTeX rather than manually styled SVG text.
- Removed surplus right-aligned footer annotations from slides 7, 8, 10, 13, 14 and 15 (slide numerals and section labels are retained).
- Visual QA: each new slide and all relevant reveal states examined at 1600x900 in Chromium; behavior tests for 100 bars, boost, sorting, slider changes and `T` toggling; no runtime errors.

## v08 — 16 November 2026
- Slides 11–15 redesigned following review of v07; slides 1–10 otherwise retained.
- Set exactly 100 vertices in the VD demonstrations (slides 11–15). Slide 11 starts at μ=4.5, k=10 and is selected to succeed.
- Slide 11: presenter-driven three moments (natural sorted bars; orange increments appended to blue; only then a smooth re-sort). No Kamada–Kawai labels or redundant annotations.
- Slide 12: removed graph; larger scientific algorithm environment, computational complexity and degree ranking with only the top-k cutoff line.
- Slide 13: definitions of T(n) and t(n) permanently left, positive and negative theorems sequentially right, then condensed theorems and improved qualitative log–log phase diagram; epsilon hypotheses retained.
- Slide 14: Toronto-style minimum/maximum extreme-degree ladder left, degree-boost illustration and genuine sufficient condition right; no overlaps.
- Slide 15: left-side network/phase-diagram substitution, large persistent bar ranking right, compact μ/k sliders, exact numerical recovery status.
- All new visualizations are offline SVG.


## v07 — 16 November 2026
- Added five slides (11–15), Section IV: Vertex Degree.
- Slide 11: successful degree-sorting planting example, animated rank changes; `T` toggles.
- Slide 12: true algorithm-style layout and `O_p(n(μ+log k))` complexity; ranked-degree graph selection.
- Slide 13: positive/negative results from Theorems 3.1 and 3.2, plus a qualitative phase diagram.
- Slide 14: Toronto-style table of degree extremes, two separate changes at α=0 and α=1, degree-boost illustration and sufficient condition.
- Slide 15: sliders for μ and k, stable ordered planted candidates, Kamada–Kawai, ranked-degree updates, status and asymptotic diagram with finite-n disclaimer.
- Slide 8: added α definition alongside μ.
- Slides 1–7, 9–10: otherwise unchanged.

## v06 — baseline
- First three sections (slides 1–10); slide 7 Torino map and political quadrants corrected.
