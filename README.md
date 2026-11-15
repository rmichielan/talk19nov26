# Planted Clique Recovery in Random Geometric Graphs

**Scientific talk · Slides 1–10 · HTML presentation, 16:9 · 15 November 2026**

This project is the first three sections of an English-language mathematics talk:

1. Motivation (slides 1–3)
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
- The μ slider on slide 8 varies geometric connectivity, while `R` generates another Poisson RGG and returns μ to `log n`.
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
