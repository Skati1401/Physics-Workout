# Workout pages: build notes

**The to-do list is now `TODO.md` in the repo root (3 Nov 2026).** The open items here moved there; this file keeps the notes on what was built and how.

Started 27 Oct 2026.

## 1. Calculations and Graphs sets (start now, Forces Part 1 only)

Two whole-course pages made of the activities already in the workouts, like the Core Practicals heading on `igcse.html`. Build them now for Forces Part 1 (1a, 1b) and add each unit as it is finished.

- [x] **How the sets work (27 Oct 2026):** the workouts are never changed. `tools/sets/build.py` copies the chosen workout sections into each set page and keeps only the activities of that set's kinds (Calculate and Spot the error; Label the graph and Calculate). Each set has its own saved answers. A GitHub Action (`.github/workflows/build-sets.yml`) re-runs the script on every push to `main`, so a fix to a workout reaches the sets a minute or two later. To add a tab, add a line to `SETS` in `build.py`.
- [x] **Drafts started (27 Oct 2026):** `calculations.html` (1a Speed and Acceleration; 1b Resultant Force, F = ma, Weight) and `graphs.html` (1a s–t and v–t Graph). Both `noindex`, no card yet.

## 2. Remaining IGCSE units (spec order)

For each: ask Alex for the spec page first (spec numbers from the spec, never memory), build to the size rule in CLAUDE.md (one workout per spec sub-section, 5–8 tabs), add the cards under a new unit heading on `igcse.html`, then add the unit's activities to both sets.


## 3. Teaching animations to build

Stand-alone pages in `animations/` (teaching-animations skill), one copy framed in the workouts. Added 2 Nov 2026 from the IAL 5.4 Nuclear Decay deck (spec 133–142); cards on `animations/ial.html` and `animations/ib.html` (and `animations/igcse.html` where it fits Unit 7).

- [x] **Electricity: five animations (2 Nov 2026):** `animations/internal-resistance.html` (IAL CP8, IB B.5), `potential-divider.html` (IAL 75–76, IB B.5, IGCSE 2.11 LDR/thermistor view), `iv-characteristics.html` (IGCSE core practical 2.9, IAL 70, IB B.5), `resistivity.html` (IAL CP7, IB B.5), `series-parallel.html` (IGCSE 2.7–2.19, IAL 67–68, IB B.5, non-ideal meters at IAL/IB). New "elec" card colour and a Unit 2 Electricity section on `animations/igcse.html`. Framed in the Unit 2 workouts (3 Nov 2026): `series-parallel.html`, `iv-characteristics.html` and `potential-divider.html?level=igcse` in `circuits.html` (the other two are IAL/IB only); the 2.9 practical page is built. Still to do: IAL CP7/CP8 practical pages if Alex wants them (the shared code for these five pages was assembled by a scratch generator; each page is self-contained, edit it directly).
- [x] **Random decay and half-life (2 Nov 2026):** `animations/random-decay.html`, on all three lists (IGCSE | IAL | IB switch). Rn-220, Pa-234m or Ba-137m; 100, 400 or 1600 nuclei; jump to 1, 2 or 3 half-lives. KS5 adds the ln N–t graph, λ and A = λN. Experiment mode hides the theory and finds t½ (KS4) or λ from the best-fit gradient (KS5). Frame it in the Unit 7 workout when that is built.
- [x] **α, β and γ deflection in fields (2 Nov 2026):** `animations/radiation-in-fields.html` (IAL Unit 4 and IB Theme D lists). Magnetic (into / out of the page, B slider) or electric (+ plate top or bottom, voltage slider); β as a fan of momenta; α drawn 20× more curved, with a "True scale for α" button; working r = p/BQ, E = V/d, F = EQ. A new page rather than an extension of `motor-effect.html`, which already holds three views and is an IGCSE (6.11P) page.
- [x] **Inverse-square law for gamma (2 Nov 2026):** first part of `animations/gamma-radiation.html` (IAL list only). Graphs C–d, C–1/d² and 1/√C–d (x-intercept −d₀, the tube's sensitive point 1 cm inside the window).
- [x] **IAL CP15 gamma absorption (2 Nov 2026):** second part of `animations/gamma-radiation.html`. Add 1, 2 or 5 mm lead sheets (to 30 mm) at 10 cm; Experiment mode: measure the background (5 min), count 60 s per thickness, table and crosses from the experiment kit, ln I–x best fit gives μ and x½. Counts are Poisson, seeded so the same setup gives the same table. Model μ = 0.0667 mm⁻¹ (Co-60 in lead).
- [x] **IAL CP12 thermistor (2 Nov 2026):** `animations/thermistor.html` (IAL Unit 5 list, tagged Core practical 12), from Alex's 5.1 Thermodynamics deck (slides 20–24) and the Pearson CP12 sheets. Part 1 Calibrate: ice and water to 80 °C, 5, 10 or 20 °C steps, thermometer to 0.5 °C, ohmmeter to 4 digits; Experiment mode with Stir and wait (b within 0.1% of 3900 K) or No stirring (thermistor lags, b about 6% low); R–θ and ln R–1/T graphs, best fit gives b and R₀. Part 2 Potential divider: R slider, output across thermistor or resistor, 3.0 V at 40 °C design point; Experiment mode is the mystery beaker (read V_R and V_T, find R_T, then θ from your own calibration, Check). No practical page yet (IAL has no practical-page template).
- [x] **IAL CP12–CP14 practical pages (2 Nov 2026):** `thermistor-practical.html` (10 tabs, incl. Divider), `latent-heat-practical.html` and `boyles-law-practical.html` (9 tabs each), built by gen.py with `"course": "ial"`, listed on the new student list `ial.html` (Core Practicals) with an IAL door on the front page. New animations `animations/latent-heat.html` (CP13) and `animations/boyles-law.html` (CP14), tagged on `animations/ial.html` Unit 5. Spec badges from the IAL spec rows 125–132 (Alex's 5.1 deck, slide 3). Not done: the IAL Unit 2 spec points for potential dividers and thermistors (numbers not to hand), no mark-scheme wording check yet (no IAL question index).
- [x] **Friction at IB level (2 Nov 2026):** `animations/friction.html` has an "IGCSE | IB" switch; IB adds the static and dynamic friction pull with μ<sub>s</sub> and μ<sub>d</sub>.
- [x] **IAL 5.3 / IB B.1, B.3 thermal physics (2 Nov 2026):** IAL and IB levels added to `animations/specific-heat.html` (125: ΔE = VIt, ΔE = mcΔθ, c from the θ–t gradient) and `animations/gas-molecules.html` (128 internal energy, 129 absolute zero and mean kinetic energy, 130 pV = NkT, 132 ½m⟨c²⟩ = 3/2 kT). Not covered yet: the derivation of ½m⟨c²⟩ = 3/2 kT (132 says "derive"); it could be an Order activity or a step-by-step reveal.

## Done

- 27 Oct 2026: Forces split into Part 1 (1a, 1b) and Part 2 (1c with suvat, 1d) to match Alex's school.
- Unit 4 (4a–4d), Unit 5 (5a, 5b), Unit 6 (6a, 6b) workouts built to the size rule.
- 3 Nov 2026: Unit 2 (2a, 2b, 2c TA) built to the size rule, and its Calculate, Spot the error and graph activities added to the Calculations and Graphs sets under a "Unit 2 Electricity" heading.
- 3 Nov 2026: Forces Part 2 (1c, 1d) and Units 4, 5 and 6 added to both sets. `build.py` now also: takes a tab's own `kinds` or `titles` (e.g. 4a Sankey keeps the drill's Label the diagram, which its Calculate refers to; 1b's graph tabs keep only "Read the graph"); tags a tab `'ta': True`; copies the page-only helpers a section uses (`sankeySVG`, `beamDiagram`, `COL`…) into that section's block; takes only the CSS rules motion.html lacks (Unit 4 pages keep their CSS in `<head>`); removes framed animations. 4b, 4d, 6a and 6b's Induction and Generators tabs have no Calculate, Spot the error or Label the graph activities, so they are not in the sets.

## 4. Key-word crosswords

`createCrossword` is in every copy of the act() engine (2 Nov 2026). Make the layout with `node tools/crossword/layout.js ROWS COLS WORD …`, then add each clue; a clue never contains its own answer, and a multi-word term drops to one word with the rest in the clue ("___ diagram").

- [x] **One crossword per unit (4 Nov 2026, 20-minute review):** the memory games and most key-term matches were replaced by one crossword on each unit's Units and Terms tab, TA words marked "(TA)" in the clue: Unit 1 (10 words, `falling-stopping-springs.html#terms`), Unit 2 (14, `circuits.html#terms`), Unit 3 (13, `light-and-sound.html#terms`), Unit 4 (14, `work-and-power.html#units`: CONSERVATION, EFFICIENCY, DISSIPATE, SANKEY, CONDUCTION, CONVECTION, INFRARED, INSULATION, EMITTER, KINETIC, GRAVITATIONAL, POWER, TURBINE, RENEWABLE; it replaces the 4a + 4b one below), Unit 6 (14, `electromagnetic-induction.html#terms`), Unit 7 (12, `fission-and-fusion.html#terms`), Unit 8 (13, `universe-and-stars.html#terms`). Unit 5 keeps its key-terms match (no memory game).
- [x] **4a + 4b (2 Nov 2026):** one crossword on 4b's Key Terms tab, moved on 3 Nov 2026 to Unit 4's Units and Terms tab (`work-and-power.html#units`), 15 words from the Energy deck slides 6 and 7. Reserves if a word is changed: KINETIC, THERMAL, NUCLEAR, ELASTIC, VACUUM, METALS, ABSORBER.

