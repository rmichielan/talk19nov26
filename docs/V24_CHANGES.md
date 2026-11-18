# v24 — Slide 23, Harmonic Centrality reveal

Reinstated exactly one slide reveal (two moments). Step 0 is VD/CN only, unchanged.
Step 1 adds the HC curve in green with triangle markers and an explanation of global distance-based centrality.

**Methodological distinction**: the HC data are exploratory, 40 trials per plotted point (19 actual measured k values for each mu). For mu=4, HC is computed exactly. For mu=12 and mu=36, the study used an approximate ranking based on distances from 256 sampled reference vertices. These estimates have known mismatches with the exact HC top-k selection for small k; do not describe them as exact HC or as 1,000-trial outcomes.

The 1,000-trial approved VD/CN data for k=2...40 are untouched. No error bars, no smoothing or invented data points.

The HC source values are in `experiments/hc_exploratory_mu4_12_36.csv`, copied from `RGG_study_mu4_12_36/results/mu{4,12,36}/hc_pilot_results.csv`.
