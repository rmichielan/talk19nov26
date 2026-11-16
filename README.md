# Planted Clique Recovery in Random Geometric Graphs

**Scientific talk · Slides 1–15 · HTML presentation, 16:9 · 16 November 2026**

This project contains the first four sections of an English-language mathematics talk:

1. Introduction (slides 1–3)
2. Classical planted problems (slides 4–6)
3. From Erdős–Rényi to random geometric graphs (slides 7–10)
4. Vertex Degree — intuition, algorithm, recovery theorems, proof and limitations (slides 11–15)

The design and navigation derive from the supplied **12 November 2026 HTML presentation starter**; photographs are reused from the supplied **Toronto 2026** PowerPoint talk.

## Run (no installation)

Open `index.html` in Chrome, Firefox, or Edge. All scripts, mathematical fonts as SVGs, logos, photos and simulations are embedded into this single file. Note: the Torino background map on slide 7 still requests the OpenStreetMap-derived image online (a limitation inherited from v06); other visuals work without an Internet connection. DOI links also require a connection.

Presentation shortcuts:

- `→`, `Space`: next reveal / next slide.
- `←`: previous reveal / previous slide.
- `R`: regenerate the current random example where available.
- `T`: slide-specific toggle / trigger where available.
- Drag the graph on slide 8 or 9 to translate the torus view.
- The μ slider on slide 8 varies geometric connectivity, while `R` generates another Poisson RGG and returns μ to `1.2 log n`.
- Slide 9 inherits *the same graph and positions* from 8, and slide 10 inherits the same planted graph from 9. `T` on slide 9 reveals/hides the planting. `T` on slide 10 switches between true latent positions and a Kamada–Kawai graph-only layout.
- Slide 11 starts a fresh, reproducible example with exactly **100 vertices**, μ=4.5, k=10. The presenter advances three manual moments (natural bars → orange degree increments with no rank changes → smooth reordering). Natural degree is always blue; only newly added edges contribute an orange segment. The default realization recovers all planted vertices.
- Slide 12 keeps the successful example and shows Algorithm 1, its computational complexity and a single large top-k degree-ranking visualization (no redundant network drawing).
- Slide 13 defines T(n) and t(n) on the left; the positive theorem, negative theorem, and final compact summary with the qualitative log–log regime diagram appear in succession on the right. The two theorem statements retain their epsilon assumptions. Slide 14 uses the Toronto-inspired minimum/maximum degree ladder on the left, and the degree-boost argument and sufficient condition on the right.
- Slide 15 uses the **same 100-vertex demonstration model** with sliders μ∈[0.5,19], k∈{2,…,10}; `T` toggles the same planted set. The set is a prefix of a fixed list of 10 candidates, so changing k preserves prior selections. `R` redraws at the selected μ and k. The network view is replaced by the qualitative log–log regime diagram on the next reveal; the ranked-degree bars remain visible on the right. The marker is schematic and does not assert finite-n theorem validity. μ≤19 maintains the RGG model restriction r<1/4 when n=100.

All animations and revealed states are reproducible with the initial seed. `R` changes seeds. Slide 7 uses **40 fixed, manually curated, illustrative** coordinates; it does not randomly regenerate positions.

## Edit source

- `src/slides/`: semantic HTML and lightweight controllers for each of the 15 slides; edit these to change texts/formulas.
- `src/styles/rgg-talk.css`: typography, layout, animations and colors.
- `src/talk/math-model.js`: deterministic graph generation, periodic torus edges, planted examples, Kamada–Kawai stress layout.
- `src/talk/scene-renderer.js`: SVG graphs, interactivity, sequences and persistent state for slides 8–10.
- `src/talk/vd-scenes.js`: animations and state of the degree-sorting demonstrations, slides 11–15.
- `src/styles/vd-section.css`: layout and typography for section IV.
- `src/assets/`: three collaborator portraits and UniPD / MSCA logos.
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

This is a working **first implementation of slides 1–10**; subsequent sections have not been created.

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
