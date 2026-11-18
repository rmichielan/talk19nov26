# v28 — Targeted final layout and navigation polish

See `docs/V28_CHANGES.md` for the complete per-slide checklist and QA. A click on the footer counter now jumps to any slide by number. Slides 1, 4, 5, 8–13 receive targeted edits; other slides and scientific data are unchanged.

# v24 — Exploratory HC reveal (slide 23 only)

- Reinstated the slide 23 second moment; VD/CN remain unchanged in the first moment.
- Adds an exploratory green HC curve and a concise conceptual reminder in the right column.
- Plots 19 actual observed HC points per regime, using 40 runs/point: exact at mu=4, and q=256 sampled-reference approximation at mu=12,36 (with explicit disclosure).
- No confidence bands. No interpolated k measurements. Uses the approved mu=4,12,36 VD/CN curves, 1,000 trials/point, unchanged.
- All other slides unmodified. See docs/V24_CHANGES.md.

# v23 — Approved exact recovery plots (slide 23)

- Replaced the historical v22 VD/CN/HC data with validated corrected VD/CN outcomes for mu=4,12,36 and k=2,...,40 (1,000 trials per point).
- Styled with distinct line colors and circular/diamond markers. Removed uncertainty bands, smoothing and exploratory HC.
- Reduced slide 23 to a single moment, keeping clickable regime buttons. Other slides unchanged.
- The exact CSV snapshot is experiments/approved_vdcn_mu4_12_36.csv. See docs/V23_CHANGES.md.

# v22 — Interactive numerical experiments (slide 23)

See `docs/V22_CHANGES.md`. Experiment code and sample counts in `experiments/README.md`.

## v21 (2026-11-17)

- Fixed slide 1 state transitions and converted outline to a single column.
- Delayed slide 8 natural edges until the edge condition is revealed.
- No changes to other slides.

## v19 — Stability, legibility and slider corrections

See `docs/V19_CHANGES.md` for slide-specific edits (slides 4, 6, 7, 8, 11).

## v18 — Cover-flow correction and orange slide-2 pattern

See `docs/V18_CHANGES.md`.

## v17 — 17 November 2026

See `docs/V17_CHANGES.md` for the three targeted slide edits.

## v14 — 17 November 2026 · parity with 12-Nov presenter template
- Restored the source template control panel: bottom-left help, bottom-right slide counter, and keyboard shortcuts guide.
- Restored 1600x900 responsive viewport scaling and clipping inherited from the 12-Nov cover foundation.
- Aligned common header, title, subtitle, footer typography and surface colors with the reference template.
- Corrected outdated cover-local slide number (was 01 / 10).
- Preserved all 25 scientific slides and interactions. See docs/TEMPLATE_PARITY_12NOV26.md for exact audit.

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

## V15 — Projection readability and slides 1–7 revisions

Third reveal of the cover with sections I–VI, thicker RGB planted-clique glitch, removal of redundant slide 2 caption, slide 3 title/proportion harmonization, shared bibliography styling on slide 6, slide 7 improved backgrounds and plausible fixed latent distributions. Per-slide typography and network visibility audited. See `docs/V15_STYLE_AUDIT.md`.

# V20 — Slide 13 only (17 November 2026)

- Refined definition panel: smaller mathematical notation, compact per-case blocks, content-fitted card.
- Positive and negative theorem cards now have content-based height, smaller formulas, and more generous in-card hierarchy.
- Rebuilt qualitative VD phase diagram as native vector SVG: red non-recovery area rises in the dense regime, two more legible vertical gray separators at equal visual intervals.
- Summary header/formula rows and SVG now share an explicit 720-unit horizontal grid: 75-unit left axis gutter, three equal 206⅔-unit regimes, 25-unit right inset; diagram labels are not redundantly repeated.
- Regions are **schematic**, faithfully preserving success/failure/unknown semantics of Figure 2(a) of *Planted clique recovery in random geometric graphs* (Avrachenkov, Bobu, Litvak, Michielan, Journal of Complex Networks, 2026). The equal spacing is a presentation choice, not exact logarithmic parameter scaling.
- All other slides, interactive behaviour, and mathematical statements are unchanged.
