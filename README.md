# Planted Clique Recovery in Random Geometric Graphs

**Scientific talk · Slides 1–10 · HTML presentation, 16:9 · 15 November 2026**

This project is the first three sections of an English-language mathematics talk:

1. Introduction (slides 1–3)
2. Classical planted problems (slides 4–6)
3. From Erdős–Rényi to random geometric graphs (slides 7–10)

The design and navigation derive from the supplied **12 November 2026 HTML presentation starter**; photographs are reused from the supplied **Toronto 2026** PowerPoint talk.

## Run (no installation)

Open `index.html` in Chrome, Firefox, or Edge. Everything required to display the slides, mathematics, logos, figures, photos and simulations is embedded in this single file. Internet is not required (except if you click the DOI link).

Presentation shortcuts:

- `→`, `Space`: next reveal / next slide.
- `←`: previous reveal / previous slide.
- `R`: regenerate the current random example where available.
- `T`: slide-specific toggle / trigger where available.
- Drag the graph on slide 8 or 9 to translate the torus view.
- The μ slider on slide 8 varies geometric connectivity, while `R` generates another Poisson RGG and returns μ to `1.2 log n`.
- Slide 9 inherits *the same graph and positions* from 8, and slide 10 inherits the same planted graph from 9. `T` on slide 9 reveals/hides the planting. `T` on slide 10 switches between true latent positions and a Kamada–Kawai graph-only layout.

All animations and revealed states are reproducible with the initial seed. `R` changes seeds. Slide 7 uses **40 fixed, manually curated, illustrative** coordinates; it does not randomly regenerate positions.

## Edit source

- `src/slides/`: semantic HTML and lightweight controllers for each of the 10 slides; edit these to change texts/formulas.
- `src/styles/rgg-talk.css`: typography, layout, animations and colors.
- `src/talk/math-model.js`: deterministic graph generation, periodic torus edges, planted examples, Kamada–Kawai stress layout.
- `src/talk/scene-renderer.js`: SVG graphs, interactivity, sequences and persistent state for slides 8–10.
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
