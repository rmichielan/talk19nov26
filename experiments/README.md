# Current slide 23 data (v23)

**The plots in the current presentation come from `experiments/approved_vdcn_mu4_12_36.csv`**, not `results.csv`/`results.json`. They contain corrected toroidal model results for VD/CN, mu=4,12,36, k=2..40, 1,000 realizations per point. See `docs/V23_CHANGES.md`. The corresponding embedded data are `src/talk/experimental-data.js`.

The material below documents the **historical v22** exploratory experiments only and should not be run to regenerate the v23 slide.

---

# Planted-clique recovery benchmark — slide 23 (v22)

The numbers shown on slide 23 are **newly simulated** finite-size measurements using the published setup in Avrachenkov, Bobu, Litvak and Michielan, *Planted clique recovery in random geometric graphs*, *Journal of Complex Networks* 14(4), cnag025 (2026), Section 4, Figure 3. They are **not digitized values from that paper**. The paper compares VD and CN; harmonic centrality (HC) is our additional exploratory algorithm.

## Model and plots

- Poisson number of vertices: `N ~ Poisson(10000)`, `d=2`, positions iid uniform on the unit torus, with the Euclidean toroidal metric.
- Hard threshold: `r = sqrt(mu/(pi*10000))`.
- Independently and uniformly choose an ordered list of candidate vertices. For each `k`, add all missing edges between its first `k` elements.
- `mu=1,5,20` are the *three interactive choices* on slide 23. `mu=10` is generated but **only shown in the separate preview**; it is deliberately not a fourth button.
- Shared domain: `k in {2,3,4,5,6,7,8,9,10,12,14,16,18,20,23,26,29,32,35,38,40}`. There is no reason to show larger k, since VD and CN already reach the recovery plateau for all tested mu values.
- Vertical axis: sample proportion with **exact recovery** (estimated probability).

## Replications and methods

- **VD** (Algorithm 1 from the paper): select the top-`k` vertices by observed degree, with vertex-ID tie-break. 1,000 independent graph samples per `(mu,k)`.
- **CN** (Algorithm 2 from the paper): for each observed edge, check whether it has exactly `k-2` common neighbors and whether these common neighbors form a clique. If yes, return the candidate. As the paper does not prescribe edge iteration order, we choose a *uniform random edge order*; this is implemented efficiently by selecting uniformly from all eligible candidates. 1,000 independent samples per `(mu,k)`.
- **HC** (additional benchmark): select the top-`k` vertices by harmonic centrality, using `1/dist_G(u,v)` and zero for unreachable vertices. 75 independent graph samples per `(mu,k)`.
  - `mu=1`: HC is **exact**, using all vertices as BFS sources. On these fragmented graphs, random-source HC approximations can be grossly misleading.
  - `mu=5`: HC estimated with 384 random BFS reference sources.
  - `mu=10,20`: HC estimated with 128 random BFS reference sources.

The HC curves have greater sampling uncertainty and, when approximated, additional landmark error. These curves are exploratory, **not** a published HC result. All methods use the adjacency structure only, never hidden coordinates.

For a fixed `(mu, replication)`, the same underlying natural RGG and planted candidate ordering is reused for increasing `k`. There are 1,000 independent replications per `(mu,k)` for VD/CN. The separate `mu=5` HC rerun follows the same distribution but does not pair each realization with the VD/CN realization.

## Reproduce

From the project root:

```bash
g++ -O3 -std=c++17 -o experiments/fast_benchmark experiments/fast_benchmark.cpp
mkdir -p experiments/runs
KS=2,3,4,5,6,7,8,9,10,12,14,16,18,20,23,26,29,32,35,38,40
for MU in 1 5 10 20; do
  PIVOTS=128
  if [ "$MU" = 1 ]; then PIVOTS=0; fi
  ./experiments/fast_benchmark --mu "$MU" --trials 1000 --hc-trials 75 --pivots "$PIVOTS" --ks "$KS" --seed 20261118 --out "experiments/runs/mu_${MU}.csv"
done
# Replace just the mu=5 HC observations with the higher-precision run:
./experiments/fast_benchmark --mu 5 --trials 75 --hc-trials 75 --pivots 384 --ks "$KS" --seed 20261118 --out experiments/runs/mu_5_hc384.csv
python experiments/combine_results.py
python experiments/sync_results.py
python generate.py
```

`experiments/results.csv`/`.json` contain the combined estimates, and `src/talk/experimental-data.js` embeds them in the standalone HTML. The raw per-regime CSVs are in `experiments/runs/`.

The older `recovery_benchmark.py` is retained only as a historical *n=300* Python prototype; its defaults should **not** be used to regenerate the v22 slide.

## Slide 23 v24: Exploratory Harmonic Centrality

Data: `hc_exploratory_mu4_12_36.csv`, 19 observed k points per mu, 40 runs/point. `HC_exact` for mu=4. `HC_sampled_targets_q256` for mu=12,36 uses 256 reference vertices to approximate the ranking; its success probabilities are **not** exact HC estimates. The slide reveals these only in its second moment and describes them as exploratory. The approved VD/CN datasets are unchanged.
