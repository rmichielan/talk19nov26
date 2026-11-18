# v22 — focused slide 23 numerical experiments

Based on v21. Modified only the content and operation of slide 23; slide 22 and qualitative theory diagrams unchanged.

- Replaced the old two theoretical mini-diagrams plus small plot with one large exact-recovery plot and a right-hand algorithm reminder.
- Replaced the four narrated steps with two: VD vs CN, then reveal HC curve and HC reminder.
- Added three mutually exclusive clickable buttons: SUB-CONNECTIVITY (`mu=1`), CONNECTIVITY (`mu=5`), SUPER-CONNECTIVITY (`mu=20`). These regimes are illustrative labels at finite n.
- Generated `mu=10` benchmark separately, kept out of the three buttons and saved a preview PNG.
- Shared `k=2..40` domain across all mu values; 21 sampling points, denser near the transitions.
- Simulations use the published `N~Poisson(10000)`, 2D torus, and VD/CN algorithms; 1,000 trials per `(mu,k)` each. HC is additional with 75 trials and exact/approx methods indicated in the README.
- Added portable C++ source, raw runs, combined CSV/JSON and updated embedded JavaScript. No data hand-drawn.
- Removed BC from this slide.
