# Talk RGG · changelog

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
