# v25 — Slide 23 layout and plot readability

- Marker radii increased for VD (open circles), CN (filled diamonds), and HC (green triangles).
- HC is now solid for all three regimes. Its measurements are still exploratory and the exact/approximate methodology is clearly disclosed.
- Right explanation column rebuilt with native `<details>` / `<summary>` elements, with narrative step defaults: step 0 VD+CN open; step 1 VD+CN closed and HC open. Manual clicking is supported; revisiting a step restores the narrative state.
- HC includes the formula `H(v)=sum_{u in V\{v}} 1/d_G(v,u)` and the disconnected-pairs convention.
- Unchanged: all datasets, regime buttons, axis labels, plots values, slide 22 and qualitative diagrams.
