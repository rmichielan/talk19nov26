# v17 changes relative to supplied v16

- Slide 8: shared RGG simulation now has Poisson mean `n = 200` (and displays `n = 200`), with node radius increasing slightly from `3.6` to `4.05` SVG units. Slider range is `mu = 0` through `mu = 15`; the three displayed regimes are equally divided `0–5`, `5–10`, `10–15`, and the old small endpoint labels are removed. This partition is illustrative of the scale `mu ~ log n` rather than exact asymptotic threshold classification.
- Slide 9: highlighted planted vertices are radius `5.9` (formerly `4.6`), while non-highlighted vertices follow the shared `4.05` radius. The selected subset and underlying graph stay unchanged.
- Slide 10: `Why can geometry be unavailable?` is revealed alongside the topology-only view at step 1, above the estimator. The estimator arrives at step 2 and exact recovery at step 3; the existing closing question (step 4) is retained.
- All other slides and functions remain as in v16.
