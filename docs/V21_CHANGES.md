# V21 - cover-state fix and slide 8 edge timing

- Cover has exactly three discrete states: 0 cover, 1 coauthors + fixed publication, 2 one-column talk outline + same publication.
- Inactive title and agenda layers are removed from layout, eliminating stale transitions when navigating backwards.
- Cover-to-slide-2 navigation is also instantaneous to avoid stage ghosting.
- On slide 8, natural edges are not drawn until the connection rule is introduced at step 1.
- Slide 9 and 10 network rendering and the original cover network animation are unchanged.

Run `python generate.py` to regenerate `index.html`.
