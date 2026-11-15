# Build-time scientific layouts

Place a `<!-- @partial NAME {...} -->` directive in an HTML slide. The builder expands it to ordinary HTML **before** compilation. Runtime overhead: zero.

Available names:

- `scientific-header`: `section`, `title`, `subtitle`.
- `scientific-footer`: `number` (use `"auto"` for the manifest's zero-based index), `label`.
- `scientific-theorem-card`: `label`, `heading`, `statement`, `formula`.
- `scientific-algorithm-card`: `label`, `heading`, `steps` (newline characters supported in the JSON string).
- `scientific-takeaway`: `heading`, `message`.
- `scientific-panel`: `classes`, `reveal`, `body` (plain text; for rich HTML customize directly).

Example:

```html
<!-- @partial scientific-header {"section":"THEOREMS","title":"Main theorem","subtitle":"Exact and efficient generation"} -->
<!-- @partial scientific-theorem-card {"label":"THEOREM","heading":"Exactness","statement":"Every edge is sampled with the required marginal law.","formula":"E[T] = O(n + m)"} -->
<!-- @partial scientific-footer {"number":"auto","label":"MAIN THEOREM"} -->
```

Complex math-heavy or interactive slides should continue to use normal HTML and custom JS; the partials are convenient defaults, not a restrictive layout language. The archival talk uses header and footer partials on slides 14 and 18 without changing the visual output.
