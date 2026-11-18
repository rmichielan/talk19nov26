# V27 - text-free qualitative SVGs

- Slides 13, 18 and 22: preserved the approved v3 region geometry, color bands and separators.
- Removed all text and embedded legends from the four SVG assets. Labels, axis captions, regime headings and legends are now editable HTML outside each image.
- On slides 13 and 18, the legends are visibly separate below the respective diagrams.
- Slide 22: two cropped diagrams have the same shared HTML regime header; dynamic markers and simulator range stay unchanged.
- Slide 23 and benchmark datasets are intentionally untouched.
- The diagram SVGs are intentionally graphic-only; regenerate with `python scripts/generate_qualitative_v27.py` after updating the shared v3 geometry.
