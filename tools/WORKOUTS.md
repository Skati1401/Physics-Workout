# Workout pages: to-do list

Started 27 Oct 2026. Tick items off here as they are done (and update `tools/REVIEW.md` and the repo CLAUDE.md as usual). Core practicals have their own list in `tools/CORE-PRACTICALS.md`.

## 1. Calculations and Graphs sets (start now, Forces Part 1 only)

Two whole-course pages made of the activities already in the workouts, like the Core Practicals heading on `igcse.html`. Build them now for Forces Part 1 (1a, 1b) and add each unit as it is finished.

- [x] **How the sets work (27 Oct 2026):** the workouts are never changed. `tools/sets/build.py` copies the chosen workout sections into each set page and keeps only the activities of that set's kinds (Calculate and Spot the error; Label the graph and Calculate). Each set has its own saved answers. A GitHub Action (`.github/workflows/build-sets.yml`) re-runs the script on every push to `main`, so a fix to a workout reaches the sets a minute or two later. To add a tab, add a line to `SETS` in `build.py`.
- [x] **Drafts started (27 Oct 2026):** `calculations.html` (1a Speed and Acceleration; 1b Resultant Force, F = ma, Weight) and `graphs.html` (1a s–t and v–t Graph). Both `noindex`, no card yet.
- [ ] Alex to look at both drafts. Then add the cards to `igcse.html` (below Core Practicals) and remove `noindex` (in `build.py`).
- [ ] Graphs set: 1b has no graph activities; consider the 1.5 practical's plotting activities (practical pages are built by `gen.py`, so `build.py` would need to read their `content.js`).
- [ ] Add Forces Part 2 (1c with suvat, 1d), then Units 4, 5 and 6.

## 2. Remaining IGCSE units (spec order)

For each: ask Alex for the spec page first (spec numbers from the spec, never memory), build to the size rule in CLAUDE.md (one workout per spec sub-section, 5–8 tabs), add the cards under a new unit heading on `igcse.html`, then add the unit's activities to both sets.

- [ ] **Unit 2 Electricity** (about 2 pages). Core practicals 2.9 and 2.23P are in batches B and C.
- [ ] **Unit 3 Waves** (about 2 pages). Core practicals 3.17, 3.19, 3.25P, 3.27P.
- [ ] **Unit 7 Radioactivity and Particles** (1–2 pages). Core practical 7.6; `animations/film-badge.html` already exists.
- [ ] **Unit 8 Astrophysics** (1 page).

## 3. Teaching animations to build

Stand-alone pages in `animations/` (teaching-animations skill), one copy framed in the workouts. Added 2 Nov 2026 from the IAL 5.4 Nuclear Decay deck (spec 133–142); cards on `animations/ial.html` and `animations/ib.html` (and `animations/igcse.html` where it fits Unit 7).

- [x] **Random decay and half-life (2 Nov 2026):** `animations/random-decay.html`, on all three lists (IGCSE | IAL | IB switch). Rn-220, Pa-234m or Ba-137m; 100, 400 or 1600 nuclei; jump to 1, 2 or 3 half-lives. KS5 adds the ln N–t graph, λ and A = λN. Experiment mode hides the theory and finds t½ (KS4) or λ from the best-fit gradient (KS5). Frame it in the Unit 7 workout when that is built.
- [x] **α, β and γ deflection in fields (2 Nov 2026):** `animations/radiation-in-fields.html` (IAL Unit 4 and IB Theme D lists). Magnetic (into / out of the page, B slider) or electric (+ plate top or bottom, voltage slider); β as a fan of momenta; α drawn 20× more curved, with a "True scale for α" button; working r = p/BQ, E = V/d, F = EQ. A new page rather than an extension of `motor-effect.html`, which already holds three views and is an IGCSE (6.11P) page.
- [x] **Inverse-square law for gamma (2 Nov 2026):** first part of `animations/gamma-radiation.html` (IAL list only). Graphs C–d, C–1/d² and 1/√C–d (x-intercept −d₀, the tube's sensitive point 1 cm inside the window).
- [x] **IAL CP15 gamma absorption (2 Nov 2026):** second part of `animations/gamma-radiation.html`. Add 1, 2 or 5 mm lead sheets (to 30 mm) at 10 cm; Experiment mode: measure the background (5 min), count 60 s per thickness, table and crosses from the experiment kit, ln I–x best fit gives μ and x½. Counts are Poisson, seeded so the same setup gives the same table. Model μ = 0.0667 mm⁻¹ (Co-60 in lead).
- [x] **Friction at IB level (2 Nov 2026):** `animations/friction.html` has an "IGCSE | IB" switch; IB adds the static and dynamic friction pull with μ<sub>s</sub> and μ<sub>d</sub>.
- [x] **IAL 5.3 / IB B.1, B.3 thermal physics (2 Nov 2026):** IAL and IB levels added to `animations/specific-heat.html` (125: ΔE = VIt, ΔE = mcΔθ, c from the θ–t gradient) and `animations/gas-molecules.html` (128 internal energy, 129 absolute zero and mean kinetic energy, 130 pV = NkT, 132 ½m⟨c²⟩ = 3/2 kT). Not covered yet: the derivation of ½m⟨c²⟩ = 3/2 kT (132 says "derive"); it could be an Order activity or a step-by-step reveal.
- [ ] **IAL 5.3 core practicals (for a new chat; Alex is finding the practical sheets).** Spec (IAL 2018, Issue 2, p. 34): CP12 "Calibrate a thermistor in a potential divider circuit as a thermostat" (126), CP13 "Determine the specific latent heat of a phase change" (127), CP14 "Investigate the relationship between pressure and volume of a gas at fixed temperature" (131). Plan agreed 2 Nov 2026: one copy of each animation, with an Experiment mode and a "Core practical 13" (etc.) `.cp-tag` on its IAL card, so it also appears in the IAL list's Core Practicals section.
  - **CP13 specific latent heat:** extend `animations/heating-curve.html` (it already has an Experiment mode) with an IAL / IB level: ΔE = LΔm, ice melted by an immersion heater (V, I, t), mass of water collected, and a control funnel with no heater to correct for melting by the room. IB B.1 also has Q = mL, so give it an IB card under Theme B.
  - **CP14 pressure and volume:** extend `animations/gas-molecules.html` (its "How pressure changes" part already has Pressure and volume): a syringe or Bourdon gauge apparatus with an Experiment mode, readings of p and V, then graphs of p against V and p against 1/V; the gradient of p against 1/V gives NkT. Wait between readings so the temperature stays fixed. IB B.3 has the gas laws too.
  - **CP12 thermistor thermostat:** no animation exists yet. A new page: a thermistor in a potential divider in a water bath, read V<sub>out</sub> at each temperature, plot the calibration curve, then use it to set the switching temperature. Check whether IB (B.5 current and circuits) uses it before adding an IB card.
  - Use Alex's practical sheets for the method and apparatus; check every point against the spec, not other boards.
- [ ] **Film badge:** `animations/film-badge.html` exists (cards on both animation lists) but is not framed in any workout yet. Frame it in the Unit 7 workout tab for radiation types, with the full-screen link. Waiting for the Unit 7 workout (section 2); frame `random-decay.html` there too.

## Done

- 27 Oct 2026: Forces split into Part 1 (1a, 1b) and Part 2 (1c with suvat, 1d) to match Alex's school.
- Unit 4 (4a–4d), Unit 5 (5a, 5b), Unit 6 (6a, 6b) workouts built to the size rule.
