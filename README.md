# Planted Clique Recovery in Random Geometric Graphs

**Scientific talk · Slides 1–25 · HTML presentation, 16:9 · 17 November 2026**

This project contains six sections of an English-language mathematics talk:

1. Introduction (slides 1–3)
2. Classical planted problems (slides 4–6)
3. From Erdős–Rényi to random geometric graphs (slides 7–10)
4. Vertex Degree — intuition, algorithm, recovery theorems, proof and limitations (slides 11–15)
5. Common Neighbors — geometry, algorithm, recovery regimes and three-part proof idea (slides 16–21)
6. Comparison, numerical experiments, conclusions, closing cover (slides 22–25)

The design and navigation derive from the supplied **12 November 2026 HTML presentation starter**; photographs are reused from the supplied **Toronto 2026** PowerPoint talk.

## Run (no installation)

Open `index.html` in Chrome, Firefox, or Edge. All scripts, mathematical fonts as SVGs, logos, photos and simulations are embedded into this single file. Note: the Torino background map on slide 7 still requests the OpenStreetMap-derived image online (a limitation inherited from v06); other visuals work without an Internet connection. DOI links also require a connection.

Presentation shortcuts (click the **?** in the lower-left corner for the on-screen guide; current slide number **01 / 25** appears at bottom-right):

- `→`, `Space`: next reveal / next slide.
- `←`: previous reveal / previous slide.
- `R`: regenerate the current random example where available.
- `T`: slide-specific toggle / trigger where available.
- Drag the graph on slide 8 or 9 to translate the torus view.
- The μ slider on slide 8 varies geometric connectivity, while `R` generates another Poisson RGG and returns μ to `1.2 log n`.
- Slide 9 inherits *the same graph and positions* from 8, and slide 10 inherits the same planted graph from 9. In latent-geometric views, natural edges use torus-wrapped segments and **newly planted edges use direct chords**; the Kamada–Kawai view does not apply torus wrapping. `T` on slide 9 reveals/hides the planting. `T` on slide 10 switches between true latent positions and a Kamada–Kawai graph-only layout.
- Slide 11 starts a fresh, reproducible example with exactly **100 vertices**, μ=4.5, k=10. The presenter advances three manual moments (vertical natural-degree bars → orange increments stacked above the blue without rank changes → smooth left-to-right reordering of the vertical bars). Natural degree is always blue; only newly added edges contribute an orange segment. The default realization recovers all planted vertices.
- Slide 12 keeps the successful example and shows Algorithm 1, its computational complexity and a single large top-k degree-ranking visualization (no redundant network drawing).
- Slide 13 defines alpha, T(n), t(n), and H on the left (without yet identifying the sequences as degree extrema); the positive theorem, negative theorem, and final three-regime aligned summary with the qualitative log–log diagram appear in succession on the right. The two theorem statements retain their epsilon assumptions. Slide 14 uses the Toronto-inspired minimum/maximum degree ladder on the left, and the degree-boost argument with LaTeX-rendered diagram labels and sufficient condition on the right.
- Slide 15 uses the **same 100-vertex demonstration model** with sliders μ∈[0.5,19], k∈{2,…,10}; `T` toggles the same planted set. The set is a prefix of a fixed list of 10 candidates, so changing k preserves prior selections. `R` redraws at the selected μ and k. The network view is replaced by the qualitative log–log regime diagram on the next reveal; the ranked-degree bars remain visible on the right. The marker is schematic and does not assert finite-n theorem validity. μ≤19 maintains the RGG model restriction r<1/4 when n=100.

- Slide 16 presents an independent **exactly 300-vertex** toroidal graph at μ=7.5 and k=10. Drag to translate the graph. The natural-edge sequence reveals endpoints, induced neighborhoods, a centered ~3.675x zoom and highlighted common neighbors; the planted-edge sequence shows the planted-edge witness and the highlighted clique. `R` selects a different eligible edge in the **same graph**, resetting translation. The initial zoom correctly accounts for any prior dragging. All newly planted links (including nonselected ones) use direct chords in the latent view; all clique edges are direct when the planted-edge sequence is active. A numeric common-neighbor count appears only when common neighbors are highlighted.
- Slide 17 reproduces the CN algorithm in the same mathematical/pseudocode visual language as slide 12; its complexity estimate, exact-count check and clique check are visible in successive reveals.
- Slide 18 renders the three sufficient CN recovery regimes **A, B, C** separately with full-size formulas and progressively green regions in a qualitative log–log diagram based on the paper's Fig. 2(b) and the uploaded Toronto talk, with distinct B/C regions and a gray connectivity band (math labels rendered from LaTeX); final reveal compares all conditions side-by-side.
- Slides 19–21 split the proof idea into three linked parts: **what can go wrong?** (clearly defined calligraphic events 𝒜, 𝓑₁, 𝓑₂ and a failure bound), **finding a planted edge** (geometrically distant clique vertices), and **excluding false positives** (highlighted geometric cap sets R₁,R₂ (with mathematical labels/typeset formulae) and Poisson-count tails, explaining c₁,d and c₂,d). Capital A/B/C in the diagram refer to *regimes*, not calligraphic events.

- Slide 22 compares VD and CN qualitative recovery regions using **identically aligned log-scale axes**, against a 300-vertex hard-RGG observed graph with its planted clique revealed using Kamada–Kawai. The two synchronized markers respond to `mu ∈ [0.5,55]` and `k ∈ {2,…,30}`. The marker mapping is intentionally **schematic**; theoretical regions describe asymptotic sufficient/negative conditions and do not classify a finite-n realization. `R` reseeds the graph.
- Slide 23 plots **actual newly computed finite-n success fractions**, not reused PowerPoint images. It cycles through `mu=2.5, 7.5, 38` with VD/CN, then returns to `mu=7.5` and adds harmonic and betweenness centrality scores. A bundled self-contained Python benchmark and its CSV/JSON output are in `experiments/`; the slide uses an explicit 45-trial pilot for VD/CN, 28-trial pilot for HC/BC, exact n=300, d=2. Harmonic is exact at this n, betweenness approximates with 32 sampled pivots. **These pilot plots are not Toronto's n=10,000 / 1000-trial results**. More accurate replacements can be computed and embedded with `experiments/sync_results.py`.
- Slide 24 gives three research takeaways and open problems (higher dimension, soft/heterogeneous RGGs, centrality scores) and connects them back to PAiNe.
- Slide 25 recreates the 12-Nov-2026 closing cover (Thank you, Questions, personal site QR, institutional logos), with the **same animated network** as the opening slide. This reuse is intentional; no second independent network renderer is introduced.

All animations and revealed states are reproducible with the initial seed. `R` changes seeds. Slide 7 uses **40 fixed, manually curated, illustrative** coordinates; it does not randomly regenerate positions.

## Edit source

- `src/slides/`: semantic HTML and lightweight controllers for each of the 25 slides; edit these to change texts/formulas.
- `src/styles/rgg-talk.css`: typography, layout, animations and colors.
- `src/talk/math-model.js`: deterministic graph generation, periodic torus edges, planted examples, Kamada–Kawai stress layout.
- `src/talk/scene-renderer.js`: SVG graphs, interactivity, sequences and persistent state for slides 8–10.
- `src/talk/vd-scenes.js`: animations and state of the degree-sorting demonstrations, slides 11–15.
- `src/styles/vd-section.css`: layout and typography for section IV.
- `src/talk/cn-scenes.js`: seeded 300-vertex RGG, edge selection, periodic neighborhood zoom, pointer drag, graph interaction for slide 16.
- `src/styles/cn-section.css`: Section V layout, theorem reveal styles and proof diagrams.
- `src/slides/15-cn-geometry.html` through `20-cn-proof-false-positives.html`: six editable Common Neighbors slide sources; each reveal uses its corresponding lightweight JS controller where needed.
- `src/talk/conclusion-scenes.js`: the 300-vertex KK comparison and experimental plotting of slides 22–23.
- `src/styles/conclusion-section.css`: styles of slides 22–25, including the mirrored 12-Nov closing cover.
- `experiments/recovery_benchmark.py`: reproducible VD/CN/HC/BC benchmarking with configurable sample size and n (see `experiments/README.md`).
- `experiments/results.json`, `experiments/results.csv`: data used for the plotted estimates. Run `experiments/sync_results.py` after rerunning the benchmark to update the standalone presentation.
- `src/assets/`: three collaborator portraits, 12-Nov-2026 website QR, GSSI, UniPD and MSCA logos.
- `src/slides/manifest.json`: order and reveal counts.
- `src/build.json`, `template/builder.py`: original starter's modular single-file bundler.
- `math_assets.json`: build-time SVG cache for LaTeX equations.

To rebuild an unchanged copy (requires Python 3):

```sh
python generate.py
python generate.py --check
```

If you **add or change math expressions not yet cached**, the build script needs Node.js with `mathjax-full` (version 3.2.1) to run `scripts/render_math.cjs` and cache their SVGs.

## Mathematical conventions

The random geometric model follows the accompanying paper *Planted clique recovery in random geometric graphs* (Journal of Complex Networks, 2026, doi:10.1093/comnet/cnag025): a Poisson(`n`) number of uniformly located torus vertices, Euclidean distance with periodic identification, hard radius `r_n`, `μ_n = n φ_d r_n^d`, technical condition `r_n < 1/4` and a uniformly sampled planted vertex set independent of the latent positions. Slide 8 **depicts only d=2** while stating the general-d formula.

The connectivity-scale marker μ ≈ log n is asymptotic; component counts shown are realization-specific. The positional examples on slide 7 (Torino, political orientation, age and mathematics interest) are hypothetical **visual metaphors**, not actual personal data. Kamada–Kawai on slide 10 is a topology-derived schematic layout, not an inference of the hidden positions. The finite-n planted scenarios are illustrative simulations and are not proofs of statistical recovery thresholds.

## Academic sources and assets

- Riccardo Michielan, Konstantin Avrachenkov, Andrei Bobu, Nelly Litvak, *Planted clique recovery in random geometric graphs*, Journal of Complex Networks 14 (2026), cnag025. https://doi.org/10.1093/comnet/cnag025
- Historical timeline: Matula (1970, 1976); Bollobás & Erdős (1976); Kučera (1977, 1995); Alon, Krivelevich & Sudakov (1998).
- Reused uploaded assets: 12 November 2026 HTML talk template, Toronto 2026 collaborator photographs, UniPD / MSCA imagery from provided source materials.

Current delivery: **v14**, complete HTML presentation through slide 25, with the shared 12-Nov template presentation controls, responsive stage geometry, editable modular sources and built-in mathematical figures.

### Cover refinements (15 Nov 2026)
The first cover state keeps the signal propagation and RGB clique glitch.
In the second cover state the network freezes, and all edges and nodes
of one planted clique remain highlighted. Node disks are 35% smaller
and base edge strokes are slightly heavier than in the preceding version.

### Introduction updates (15 Nov 2026)
- Slide 2: the initial graph and both comparison networks now use topology-derived Kamada-Kawai layouts, recomputed whenever R regenerates them.
- Recovery reveal order: natural copy (purple, not planted), then planted copy (orange); detection in the paired network view.
- Slide 2 no longer displays the R-key instruction on the canvas.
- Slide 3 UniPD and MSCA logos enlarged and moved to the upper-right area.
- Section I renamed Introduction. All other slides retain their previous behavior.


## v02 · 15 November 2026

- Slide 3: project website link and a locally embedded QR (currently pointing to the known personal site homepage `https://rmichielan.github.io/site/`; replace with the exact PAiNe page URL when supplied).
- Slide 4: stable Kamada–Kawai graph layout, stronger orange selected vertices, recovery question moved into the final step card.
- Slide 5: corrected 1970 and 1976 bibliographic details, compact references on five separate lines, DOI links where available.
- Slide 6: red below the natural clique scale, green degree-recovery region expanding to the spectral scale, careful statement that the general polynomial-time lower bound is NOT proven.
- Removed on-slide keyboard instructions from slides 4 and 8–10; shortcuts still work.

## v03 (15 November 2026)

- Slide 5: increased legibility of all five bibliographic references.
- Slide 6: thresholds are typeset with embedded MathJax SVG/LaTeX; first polynomial region is labelled consistently; removed schematic caption and kept only the two linked references.
- Slides 1-6: projection-layout and reveal audit; no changes to the narrative or to later slides.

## v04 (15 November 2026)

- Slide 7: rebuilt the illustrative Torino street-map background (Po, Dora Riparia, recognizable major avenues and landmarks); all 40 individuals are now identical teal circular markers. After the three successive geometric spaces, a fourth reveal brings all three panels side by side with the message **Similarity shapes the network** / **Connections arise between closeby vertices**. The positions are illustrative rather than measured personal data.
- Slide 8: node colors no longer encode connected components; all normal vertices share the same color. Initial and `R`-regenerated density is `mu = 1.2 log(n)`, the slider runs from 0.5 to 20 and indicates the illustrative sub-connectivity (`mu < 0.8 log(n)`), connectivity (`0.8 log(n) <= mu <= 2 log(n)`), and super-connectivity (`mu > 2 log(n)`) intervals.
- Slide 9: planted clique size runs from `k=2` to `k=10`, initially `k=5`. Ten candidate vertices are selected per generated graph and slider values use a prefix of this same ordered list; increasing `k` never reselects earlier vertices. The planted edge set is recalculated without altering the underlying geometric graph.
- Slide 10: corrected captions when toggling latent vs graph-only layouts; highlighted planted nodes disappear in the graph-only layout. The same graph and edges are retained from slides 8–9.
- Slides 8–10 use the paper's simplified `G_k(n,r)`, `K`, and `mu` notation (with `r=r_n`, `k=k_n`, and `mu=mu_n` implicitly depending on `n`, just as done in the paper's proofs).


## v05 · Torino map + political compass

Slide 7 includes the public map image `Location map Italy Torino.jpg` (OpenStreetMap data, cartography by Flappiefh, licensed CC BY-SA 3.0, https://commons.wikimedia.org/wiki/File:Location_map_Italy_Torino.jpg). When an internet connection is available, the slide loads and crops the actual street-map image of Torino, with the Po and city-center grid recognizable. The original embedded, offline vector illustration is retained as a fallback if the image cannot load. The political compass uses a true 510 x 510 square in both full-size and triptych views. All 40 people retain the same node shape and color.


## v06 · visual correction to slide 7

Removed all synthetic street grid, landmarks, labels, Po and Dora drawings previously
underneath the real street map. Slide 7 now contains **one** genuine cartographic
image layer, tinted down to 31% opacity, with all 40 individuals above it. The map
source is Wikimedia Commons File:Location map Italy Torino.jpg (Flappiefh / ©
OpenStreetMap contributors, CC BY-SA 3.0). Since the picture is externally loaded,
it requires internet; if the internet is unavailable, the map area stays blank and
neutral (rather than showing the prior invented cartography). The political compass
is a true 510 x 510 square in the main panel and in the three-panel comparison.

Source and license: https://commons.wikimedia.org/wiki/File:Location_map_Italy_Torino.jpg

Only slide 7's geographic background and related description changed; other slides
keep their v05 source.

## Version v07

- Section IV (slides 11–15) implemented in native SVG/HTML with staged reveals, algorithm-style environment, accurate theorem conditions and interactive degree sorting.
- Defined the asymptotic density parameter `α = lim μ/log n` on slide 8 as agreed.
- Used the original Toronto talk for the α-dependent minimum- and maximum-degree transition table.
- Existing slide 7 offline map limitation remains. The rest of slides 1–10 are unchanged.

**Scientific source:** K. Avrachenkov, A. Bobu, N. Litvak, R. Michielan, “Planted clique recovery in random geometric graphs”, *Journal of Complex Networks* 14(4), cnag025 (2026), https://doi.org/10.1093/comnet/cnag025.

## v10 · Section V — Common Neighbors (slides 16–20)

- Slide 16: **300 vertices exactly**, conditional geometric RGG on the flat torus (2D), mean natural degree parameter μ=7.5, planted k=10. The graph is a standalone instance independent of slides 8–15. Natural edge → induced neighborhood → toroidal zoom with r-balls → common neighbors → planted edge → induced neighborhood → planted common-neighbor clique. Press `R` on slide 16 to select another edge *from the same fixed graph*; natural-edge reselection cycles through a randomized ordering of all natural edges with both endpoints outside K (no condition on their CN count); drag the SVG to translate its toroidal view. The scene tests the CN algorithm on candidate seeded realizations to find a clear demonstrative sample; this empirical visual is not a proof of its theorem.
- Slide 17: true algorithm environment in the same style as slide 12. Exact `|Z_ij|=k-2` and clique check are separate reveal moments; complexity `O_p(μ n(n+k²))`.
- Slide 18: theorem 3.3 is split into regions **A (large μ)**, **B (few CN)**, **C (many CN)**, with the original sufficient conditions including k-range assumptions. The figure is qualitative (not a finite-n boundary), with a green region revealed separately for each condition and a beige unknown area.
- Slide 19: events **𝒜, 𝓑₁, 𝓑₂** are not to be confused with the named *regions* A, B, C. Failure decomposition and proof of existence of an edge with exactly k−2 common neighbors. Distance `d_T>2r` visually provides the witness.
- Slide 20: event 𝓑₁ via lens geometry and regions R₁, R₂; event 𝓑₂ via Poisson common-neighbor counts. The geometric meaning of dimension-dependent constants `c_{1,d}`, `c_{2,d}` is displayed.
- In the current v10 only slides 16–20 and the navigation metadata/runtime hook were added. Earlier slide design, counts, animations and interactions are preserved.

The formulas and argument outline were checked against the published 2026 paper, Sections 2.2, 3.3 and 6, https://doi.org/10.1093/comnet/cnag025.
