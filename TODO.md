# Alex's to-do list

The one list for everything still to do: the website, lesson decks, and anything else. Every chat (claude.ai projects, Claude Code, PPT reviews) adds its to-dos here and ticks them off here. Nowhere else holds a to-do.

- **This repo is public.** No surnames, class lists, results, or anything that links a student to a class or a result. Common first names in questions are fine, as everywhere on the site.
- **Detail lives elsewhere, the to-do lives here.** How to build a core practical is in `tools/CORE-PRACTICALS.md`; what Alex still has to look at on each page is in `tools/REVIEW.md`. This file holds the task and links there.
- Format: `- [ ] task (where, added date)`. Tick with `[x]` and move it to **Done** with the date. Most urgent section first.

## 1. Fix now (site audit, 3 Nov 2026)

Automated checks were clean: no script errors, no broken links, and no sideways scroll at 380px on any tab of any page. Every Calculate and Spot the Error answer was recomputed and none is wrong. The items below are what the physics review found, worst first. Line numbers are approximate. Practical pages: fix `tools/practical-gen/practicals/<slug>/content.js`, then rebuild with `gen.py`.

**Wrong physics (students learn something false)**
- [ ] 5a `density-pressure-state.html` ~1705, heating-curve `PTS`: ice warms 3× slower than water. It should be about 2× faster (c of ice ≈ ½ c of water). Make the solid stretch steeper.
- [ ] CP14 `boyles-law` ~175, Predict "A steeper line": "Q is at a higher pressure for every volume" is true but marked wrong, and its "why" text is backwards.
- [ ] CP12 `thermistor` ~302, "Checking the result" explanation: ±1 °C changes R_T by 4%, but V_out only by about 2%, so it doesn't explain the 3% shortfall.
- [ ] 1a `motion.html` ~1502, light-gates Order: "interrupt card of known length", but the two-gate method never uses the card's length.
- [ ] Y9 `heat-transfer.html` ~1705: "the seal stops convection currents forming" (it's the narrow gap that limits convection); the vacuum is "no particles" here but "almost no particles" on the Summary card.
- [ ] Y9 `heat-transfer.html` ~1656, convection Order: "Aircon" is listed as a heat source.
- [ ] Y9 `working-scientifically.html` ~1479, "Which thermometer?": calls smaller divisions "more accurate"; that is resolution (precision).

**Raw `[[a|b]]` showing on screen (fraction not drawn)**
- [ ] CP14 `boyles-law` ~213 (Predict option `[[p|V]]`) and ~334 (exam (f) `[[333|293]]`).
- [ ] CP5.4 `density` ~322, the "Using ρ = [[m|V]]" title.
- [ ] IB `quantum-physics.html`, exam (b) "gradient [[h|e]]".
- [ ] Root cause: `createPredict` option text and `act()` titles skip `FR()`. Fix the engine in every copy and in `tools/practical-gen/template/engine.js`.

**Right answers marked wrong (two chips or options fit)**
- [ ] 1b `forces.html` ~1532–1548, free-body slots: "Friction" should also count for the fish and the plane.
- [ ] 1c `falling-stopping-springs.html` ~1549: hysteresis item h6 is beyond 4PH1; h7 "Returns to its original length" needs "if not loaded past its elastic limit".
- [ ] 1c ~1562, Hooke Order: working out each extension straight after each reading is also valid.
- [ ] 1d `momentum-and-moments.html` ~1519, third-law cloze: the "type" and "size" gaps take each other's chips.
- [ ] 1d ~1630, plank: the distractor "stays the same" is also true.
- [ ] 4a `energy-stores-efficiency.html` ~1356: "A cold drink warms up on a sunny table" fits radiation too.
- [ ] 4b `heat-transfer-igcse.html` ~1600: vacuum flask labels B and C sit in the same gap.
- [ ] 4b ~1295, cloze: the distractor "conductors" fits "shiny surfaces are good ___".
- [ ] 4d `energy-resources.html` ~1440: a solar water panel also "has no moving parts".
- [ ] 5b `gases.html` ~1488: "hit the walls more often" also fits "The gas is heated".
- [ ] 6a `magnetism-and-motor-effect.html` ~1405: "No field there" between two N poles. Earth's field is still there, so say "no field from the magnets: a neutral point".
- [ ] IB `quantum-physics.html` ~1764, duality Match: pairs a and b can be swapped.
- [ ] Y9 `heat-transfer.html` ~1745: the stopper also reduces conduction; "Body (skin) surface → radiation" is unclear.
- [ ] Y9 `working-scientifically.html` ~1409, graph Order: "scale" and "label" can go either way.
- [ ] Practicals: `heat-transfer` ~222 "Cool air above the sea moving in" (rises or sinks?); `density` ~178 modelling clay (could be moulded into a block); `density` ~357 "level bench" (better results or safety?).

**Giveaways (matchable by words, or the longest option)**
- [ ] Y9 `heat-transfer.html` ~1705 insulation match and ~1692 absorb/reflect sort; Y9 `energy.html` ~1331 insulation match.
- [ ] 4d `energy-resources.html` ~1414, the solar tower Predict (the right answer is the longest).

**Smaller fixes**
- [ ] Show every step: `gases.html` ~1583 (p₁/T₁ = p₂/T₂, p₁V₁ = p₂V₂); 5a petrol V, A = F/p, oil h, m = ΔQ/cΔT; 6b ~1462 "Count the turns".
- [ ] 5a Units tab: check whether the J/kg °C point is 5.2P (TA), and that the specific heat rows aren't sitting in an untagged tab.
- [ ] 6a Electromagnets tab: 6.8 (Double Award) is only in a TA-tagged tab.
- [ ] 1d ~1498, seat belt Predict: "them" has no referent; only 3 options.
- [ ] 4a ~1361: the elastic bar uses the gravitational colour.
- [ ] Y9 `heat-transfer.html` ~1624, sort hints; Y9 `energy.html` ~1285 "always hotter to cooler" (only for heating); Y9 `working-scientifically.html` ~1440 "rise by about 7 °C each minute" (one rise is 2 °C).
- [ ] 1a ~1427: two identical "Moving backwards" captions; heading says distance–time, but the graph shows displacement.
- [ ] `animations/hookes-law.html`, `animations/seesaw-moments.html`: no Slow motion button (the code looks for one).
- [ ] Three ÷ signs in `latent-heat` content.js (~176, ~188, ~272).

## 2. Lesson decks (PPT reviews)

Items from the claude.ai PPT-review projects go here, one line each: deck, slide, change.

- [ ] Move the open to-dos from the PPT-review project docs into this section (Alex, 3 Nov 2026).

## 3. Alex to review

51 pages are 🔍 To review and 17 are ❔ Not recorded in `tools/REVIEW.md`. Go through that table; only Alex marks a page ✅.

- [ ] Look at the drafts `calculations.html` and `graphs.html`. If they're fine, add their cards to `igcse.html` below Core Practicals and remove `noindex` (in `tools/sets/build.py`).
- [ ] `iv-characteristics.html`: is the two-cell potentiometer set-up how you teach it, or should Experiment mode have a "reverse the connections" step instead?

## 4. Build: workouts (IGCSE, spec order)

Ask Alex for the spec page first. Build to the size rule in `CLAUDE.md`, add the cards to `igcse.html`, then add the unit's activities to the Calculations and Graphs sets.

- [ ] Unit 2 Electricity (about 2 pages). Frame the five electricity animations in it.
- [ ] Unit 3 Waves (about 2 pages).
- [ ] Unit 7 Radioactivity and Particles (1–2 pages). Frame `film-badge.html` and `random-decay.html` in it.
- [ ] Unit 8 Astrophysics (1 page).
- [ ] Calculations and Graphs sets: add Forces Part 2 (1c with suvat, 1d), then Units 4, 5 and 6.
- [ ] Graphs set: 1b has no graph activities. Consider using the 1.5 practical's plotting activities (`build.py` would need to read its `content.js`).
- [ ] Key-word crosswords for other units, if Alex wants them.

## 5. Build: core practicals

How to build one: `tools/CORE-PRACTICALS.md`.

- [ ] 2.9 I–V characteristics: practical page (the animation is done).
- [ ] 3.19 Refractive index of glass (batch B; do 3.17 first so they share the light box).
- [ ] 3.25P Speed of sound in air (batch B).
- [ ] 2.23P Charging insulators by friction (batch C).
- [ ] 3.17 Refraction (batch C).
- [ ] 3.27P Frequency of sound with an oscilloscope (batch C).
- [ ] 7.6 Penetrating power of radiation (batch C).
- [ ] IAL CP7 resistivity and CP8 internal resistance practical pages, if Alex wants them (the animations are done).
- [ ] IAL CP12–14: mark scheme wording check (no IAL question index yet).

## 6. Build: IAL and IB

- [ ] IAL 132: the derivation of ½m⟨c²⟩ = 3/2 kT (an Order activity or a step-by-step reveal).
- [ ] IAL Unit 2 spec numbers for potential dividers and thermistors (Alex to send the spec page).
- [ ] `ial.html` holds only Core Practicals so far; IAL workouts are still to plan.

## Done

- 3 Nov 2026: one master to-do list (this file). The open items from `tools/WORKOUTS.md` moved here.
