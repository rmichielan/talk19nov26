# Reproducible numerical experiments — scientific talk

This folder contains the **actual source script and result tables** for slide 23 of the HTML presentation. No curve is hand-drawn: `src/talk/experimental-data.js` is generated from `results.json` and is embedded in the standalone `index.html` by `generate.py`.

## Requirements

Python 3.10+ with `numpy`, `scipy`, and `networkx`.

```bash
python -m pip install -r experiments/requirements.txt
```

## Reproduce the delivered pilot

```bash
python experiments/recovery_benchmark.py --n 300 --trials 45 --centrality-trials 28 --bc-pivots 32 --out experiments/results.json
python experiments/sync_results.py
python generate.py
```

The delivered experimental settings: **n=300 fixed vertices**, flat two-dimensional unit torus, hard RGG, `mu` = 2.5, 7.5, 38.0, and `k` = 2,3,4,5,6,8,10,12,15,20,25,30. VD and CN use **45 replications** for each point, while HC and BC use **28 replications** for each point in the middle-mu slice. This is an exploratory numerical demonstration, **not** the n=10,000 / 1000-replication experiment from the Toronto talk. The torus RGG has exactly `n` vertices, rather than the original paper's Poisson number of vertices.

## Scale up or try larger n

```bash
python experiments/recovery_benchmark.py --n 300 --trials 300 --centrality-trials 150 --bc-pivots 60 --out experiments/results.json
```

A larger `n` is more expensive: every k requires a distinct observed graph with a planted clique; CN tests all candidate edges until a valid clique is found (or the scan ends). At n=10,000, start with few replications and a narrower k grid:

```bash
python experiments/recovery_benchmark.py --n 10000 --trials 5 --centrality-trials 0 --mu 3 10 70 --ks 2 4 6 8 12 20 30 --out experiments/large_n_results.json
```

For n>1000, harmonic centrality uses sampled-source shortest paths automatically (the number of pivots can be overridden with `--hc-pivots`), and betweenness uses NetworkX sampled-source approximation (`--bc-pivots`, default 24). At n<=1000, HC is exact by default (`--hc-pivots 0`). **Never label an approximate centrality as exact.** At large n, use `--centrality-trials 0` if the approximate centralities still take too long, then compute them separately.

The experimental curves are estimates; with 45 or 28 trials, steps can be noisy. They should not be treated as mathematical thresholds, and their (binomial) sampling uncertainty is non-negligible.

## Algorithms and conventions

- VD: select the highest-k degree vertices, with vertex-ID tie breaking.
- CN: scan all observed edges in reproducibly shuffled order; for each edge test that its common neighborhood has size *exactly* k-2 **and** induces a clique; return the first qualified candidate or the empty set.
- Harmonic centrality: select the top-k largest harmonic scores based on graph distances, including finite distances across connected components only.
- Betweenness centrality: select the top-k largest sampled-source betweenness scores; see the recorded `metadata` for the number of pivots.

Each replication and mu uses a common natural graph and fixed ordered planted candidate vertices across k values, while each algorithm receives the same observed graph for a fixed k. The benchmark uses no vertex coordinates in the algorithms, only the graph.

`results.json` contains metadata and plot data; `results.csv` contains one row per (mu, k, algorithm). The pilot is embedded by running `python experiments/sync_results.py` followed by `python generate.py`. This will overwrite the slide 23 data and preserve the design.
