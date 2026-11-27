# 9h Fusion and Stars: hand-off for the Opus half (personal account, 27 Nov 2026)

`animations/fusion-and-stars.html` holds the two pictures (IGCSE 7.24 to 7.26, IAL 136, IB E.5). How they work and how to drive them (`window.FS`) is in the page's note in `tools/PAGE-NOTES.md`. No past paper was read for the Fable half: the notes on the page use the 7b workout's fusion chain and the `star-life-cycle.html` stage notes, which were checked against mark schemes when those pages were built.

## Before writing the questions (school account, `alex-school-drive`)

Read the three question indexes for these spec points and list, as in `9f-isotope-choice.md`, each question kind with the mark schemes' words and the papers:

- **IGCSE 7.23 to 7.26:** what fusion is (larger nucleus, loss of mass, release of energy), fusion against fission, why it needs a very high temperature and pressure (electrostatic repulsion of protons), fusion as the energy source of stars.
- **IAL 136** (with 135): the conditions for fusion (very high temperature, very high density) and why each is needed, why fusion is hard to maintain in a reactor on Earth, and any estimate of the temperature from the energy needed to bring two nuclei together.
- **IB E.5:** equilibrium between radiation pressure and gravity, the conditions for fusion in a star in terms of temperature and density, the effect of the star's mass, what happens when the hydrogen in the core runs out.

Reserved papers (Mock, Topic test): their wording and the same kind of question, never the same question.

## What the pictures can already show

- **Gas:** `FS.box({T, n, nuc})` then `FS.play()`; a run lasts 30 s and `FS.onEnd(state)` gives the collisions and fusions. Good pairs to compare: the same pressure at 5 and 30 million K; 30 million K at n = 1 and n = 8; hydrogen and helium at 35 million K; the Sun's core (15 million K, n = 7) against a reactor (150 million K, n = 1).
- **Star:** `FS.jump('proto' | 'ms' | 'out' | 'contract' | 'giant')`, `FS.squeeze(0.75)` or `FS.squeeze(1.3)`, `FS.play()`; `state().qCore` and `qSurface` are under 1 when gravity is greater and over 1 when the outward pressure is greater.
- Predict on the picture where it can be done there: click the longer arrow, or click whether the surface moves in or out, before Play.

## Still open

- No `Show working`: there is no calculation on the page. If the indexes have one (IAL: the temperature from the energy two nuclei need; IB: energy released), add it with the questions.
- Alex's points are in the page's row of `tools/REVIEW.md`.
