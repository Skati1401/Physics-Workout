# Alex's to-do list

The one list for everything still to do: the website, lesson decks, and anything else. Every chat (claude.ai projects, Claude Code, PPT reviews) adds its to-dos here and ticks them off here. Nowhere else holds a to-do.

- **This repo is public.** No surnames, class lists, results, or anything that links a student to a class or a result. Common first names in questions are fine, as everywhere on the site.
- **Detail lives elsewhere, the to-do lives here.** How to build a core practical is in `tools/CORE-PRACTICALS.md`; what Alex still has to look at on each page is in `tools/REVIEW.md`. This file holds the task and links there.
- Format: `- [ ] task (where, added date)`. Tick with `[x]` and move it to **Done** with the date. Most urgent section first.

## 1. Fix now (site audit, 3 Nov 2026)

The audit's fixes are done (see Done). What changed on each page is in `tools/REVIEW.md` (🔍 rows dated 3 Nov 2026). Still open:


## 2. Lesson decks (PPT reviews)

Items from the claude.ai PPT-review projects go here, one line each: deck, slide, change.

- [ ] Move the open to-dos from the PPT-review project docs into this section (Alex, 3 Nov 2026).

**Animation ideas from the reviews.** "Link" lines: the page exists, so put its link (Copperplate hyperlink, `?level=` for the course) on the slide. "Build" lines: build the page with the `teaching-animations` skill, add its card to the course list, then link it on the slide and tick the line. Each PPT review checks these lines before suggesting new ideas.

- [ ] 4 Energy, Lesson 2 Sankey slides (24–49): link the 4a workout Sankey tab's "Sankey diagrams to scale" explore (`energy-stores-efficiency.html#sankey`) on a Sankey teaching slide; the L2 To Do slide (47) already links the tab (review row E26, added 3 Nov 2026).
- [ ] 4 Energy, Lesson 3 conduction slides (50–66): link `animations/heat-transfer.html?level=igcse` (conduction and free electrons) (review row H26, added 3 Nov 2026).
- [ ] 4 Energy, Lesson 4 convection slides (67–88): link `animations/heat-transfer.html?level=igcse` (convection) (review row H25, added 3 Nov 2026).
- [ ] 4 Energy, Lessons 9–10 GPE → KE slides (190–222): link `animations/roller-coaster-energy.html?level=igcse` (review row W04, added 3 Nov 2026).
- [ ] 5.2 Nuclear Decay (IAL), slide 42: link `animations/chain-reaction.html?level=ial` (built 4 Nov 2026; review row S8).
- [ ] 6 Magnetism (IGCSE), slides 29–30: link `animations/electromagnets.html?level=igcse` (built 4 Nov 2026; review row M18).
- [ ] E2 Quantum (IB), slides 55–70: link `animations/electron-diffraction.html?level=ib` (built 4 Nov 2026; review row Q28).

## 3. Alex to review

- [ ] Check the 20-minute review of all 21 IGCSE workouts (4 Nov 2026): every page cut to about 20 minutes of content (477 → 300 activities), Quick check cards instead of single Predicts, memory games replaced by one crossword per unit. What changed on each page is in `tools/REVIEW.md` (rows starting "4 Nov 2026 20-minute review"). Calculate cards were then put back to 3 questions (Alex, 4 Nov 2026), so pages may run a little over 20 minutes, never 30.

51 pages are 🔍 To review and 17 are ❔ Not recorded in `tools/REVIEW.md`. Go through that table; only Alex marks a page ✅.

- [ ] Check Units 7 and 8 (7a `radioactivity.html`, 7b `fission-and-fusion.html`, 8a `universe-and-stars.html`, 8b `cosmology.html`; what to look at is in `tools/REVIEW.md`). When each is checked, remove its Draft labels (added 4 Nov 2026).
- [ ] Check Unit 3 (3a `waves.html`, 3b `light-and-sound.html`, 3c `sound.html`; what to look at is in `tools/REVIEW.md`). When it is checked, remove its Draft labels (CLAUDE.md, "Draft units") (added 4 Nov 2026).
- [ ] Look at the drafts `calculations.html` and `graphs.html`. If they're fine, add their cards to `igcse.html` below Core Practicals and remove `noindex` (in `tools/sets/build.py`).
- [x] `iv-characteristics.html`: reversible 6 V battery instead of the two-cell −6 V to +6 V potentiometer (3 Nov 2026).

## 4. Build: workouts (IGCSE, spec order)

Ask Alex for the spec page first. Build to the size rule in `CLAUDE.md`, add the cards to `igcse.html`, then add the unit's activities to the Calculations and Graphs sets.

- [ ] Key-word crosswords for other units, if Alex wants them.

## 5. Build: core practicals

How to build one: `tools/CORE-PRACTICALS.md`.

- [ ] Take the core practicals out of the workouts (Alex, 7 Nov 2026; not started). They appear in lots of places and are large. (1) Remove each practical's animation frame and practical activities from its workout tab, keeping at most a one-line link to the practical page; re-check each workout still has 5–8 tabs of 1–2 activities and 15–30 minutes. (2) On `igcse.html`, each unit's section lists its workouts, then that unit's practical pages as separate cards. (3) The final Core Practicals section (`#unit-cp`) only points to the practical cards in the units (links, no second copy of each card). (4) Then update CLAUDE.md ("Core practicals" and "How big a workout is"), `tools/CORE-PRACTICALS.md` and each practical's `page.json` workout link (rebuild with `gen.py`), bump the `STORE_KEY` of every workout changed, and set their rows in `tools/REVIEW.md` to 🔍. The interactive-revision-lab and teaching-animations skills already describe the new layout.
- [ ] Fix the 4.9 thermal energy transfer practical page `heat-transfer-practical.html` (Alex, 6 Nov 2026: needs fixing; what to fix still to agree). The 4b Practicals tab stays as it is and Unit 4 stays Draft until then.
- [ ] Rebuild the other 13 IGCSE practical pages to the 1.22 Hooke's law model: one row of tabs, no core route, Do/Show Experiment, Multiple choice, no Calculate tab; required tabs Method, Variables, Do Experiment, Show Experiment (`tools/CORE-PRACTICALS.md`, "The 1.22 model"; added 5 Nov 2026)
- [ ] Review the six practicals published 4 Nov 2026: 3.17 `refraction-practical.html`, 3.19 `refractive-index-practical.html`, 3.25P `speed-of-sound-practical.html`, 2.23P `charging-practical.html`, 3.27P `sound-frequency-practical.html`, 7.6 `penetrating-power-practical.html` (what to check is in `tools/REVIEW.md`).
- [ ] After Alex checks 1.22's new Experiment tab (students read the ruler, fill in their own table and plot it; the old run is the Show tab): use the same pattern on the other measure-and-plot practicals (5.4, 2.9, 5.14P, 3.19) (added 5 Nov 2026).
- [ ] Fix the errors the 4 Nov practicals review found, still live on 5 Nov 2026 (full list per page in `claude/practicals-review-2026-11-04.md`). The main ones:
  - 5.4 density: `setMethod` runs before the Method activities exist, so all four Orders show on load; make Irregular object the default.
  - 1.5 motion: the "Three ramps" graph lines end at different distances and speeds; fix the end points.
  - 3.27P: Trace A Q1 asks for "complete" cycles with the answer 2.5; identical repeats possible without moving the cursors.
  - 3.25P: delete "Much over 200 m, the sound gets hard to hear"; "Why miss the origin?" contradicts the animation; Exam (f) uses past-paper data.
  - 5.14P: the "more mass than measured" distractor in "Why is the value too high?" would really give a high c.
  - 6.6: "Tapping the card" marks a creditworthy answer wrong.
  - 7.6: the absorber thickness is a control, yet paper, 5 mm Al and 2 cm lead are compared ("The best absorber").
  - 2.23P Exam (f): add "electrons". CP12: line 93 says the calibration carries to the Divider tab (it doesn't). CP13: the "steam condensed back" distractor would really make L_v high.
  - Duplicate exam numbers to change: 2.9 Exam (b), 3.25P Exam (b), 3.17 Exam (d), 3.19 Exam (d), CP12 Exam (a).
  - Missing activities worth adding: circuit diagram (2.9), field-drawing mistakes (6.6), sketch the heating curve (5.11P).
- [ ] IAL CP7 resistivity and CP8 internal resistance practical pages, if Alex wants them (the animations are done).
- [ ] IAL CP12–15: mark scheme wording check (no IAL question index yet).

## 6. Build: IAL and IB

- [ ] IAL 132: the derivation of ½m⟨c²⟩ = 3/2 kT (an Order activity or a step-by-step reveal).
- [ ] `ial.html` holds only Core Practicals so far; IAL workouts are still to plan.

## 7. Fable visuals (ideas, added 10 Nov 2026)

Drawing and animation jobs worth running on Claude Fable, which draws SVG scenes better than the other models; keep page logic on the usual model, as Fable costs more. Fable can still draw convincing pictures with wrong physics, so drive every motion from the page's equations, not drawn keyframes, and check directions (field lines, current, rotation) before publishing. Build with the `teaching-animations` or `interactive-revision-lab` skill as usual.

- [ ] 6.6 magnetic field practical: draw field diagrams for a "find the mistake" activity (reversed arrow, line not reaching the magnet, lines crossing, no central line between N poles). Same job as the field-drawing item in section 5; do them together.
- [ ] 2.9 I–V practical: a circuit-diagram activity, build it or find the errors (ammeter in parallel, voltmeter in series, cells the wrong way round). Same job as the circuit-diagram item in section 5.
- [ ] 2.9 I–V: show the lamp curve continuing into the negative quadrant (sweep from −V to +V) in `animations/iv-characteristics.html` and the practical's graphs.
- [x] Practical runs that feel passive (the 4 Nov review): richer apparatus scenes, e.g. compass needles swinging and filings settling when the card is tapped (`magnetic-field-patterns.html`), a Leslie cube with a readable thermometer (`heat-transfer.html`; done 10 Nov 2026, batch 9, so only the compass and filings were left; done 10 Nov 2026, batch 1).
- [ ] Drawing pass on existing animations where the picture is plain: `gas-molecules.html` (5b), `heat-transfer.html` convection, `chain-reaction.html` (7b), `roller-coaster-energy.html` and the Year 9 half-pipe and bungee Predicts. The motor and generator pages were redrawn on 10 Nov 2026, so leave those. These pages are also in the animation batches (section 8: batches 9, 10 and 11); tick this when those are done. Batch 9 (10 Nov 2026) did `heat-transfer.html` and `roller-coaster-energy.html`; `gas-molecules.html`, `chain-reaction.html` and the Year 9 Predicts are left.
- [ ] Build: star life cycle and red shift animations for 8a/8b (no animation page yet; frame them in `universe-and-stars.html` and `cosmology.html`).

## 8. Animation batches: review every animation against the motor and generator model (Alex, 10 Nov 2026)

Each batch is one new chat. Alex calls a batch up by number, in any order: "Do animation batch 3 from `TODO.md` section 8, following `tools/ANIMATION-STYLE.md`." The chat reviews each page, rebuilds or restyles what falls short of the model (`animations/dc-motor.html`, `animations/ac-generator.html`) straight to `main`, and asks Alex only where there is a real choice. "Run on" is the suggested model and effort level: high where pictures are redrawn in 3D or a wrong direction would teach wrong physics, medium where it is mostly restyling flat pictures and graphs.

| Batch | Pages (`animations/`) | Run on | Look for |
|---|---|---|---|
| 1 | `magnetic-field-patterns.html`, `electromagnet-field-patterns.html`, `electromagnets.html` | Fable high | Solid magnets, coils and cores; compass needles that swing and filings that settle (section 7); a predict-on-the-picture mode for field direction |
| 2 | `motor-effect.html`, `loudspeaker.html` | Fable high | Fleming's left-hand rule as predict on the picture, then Go: a button deals a question in the diagram, the student clicks which way the wire moves (or which pole, or which way the current goes), Go shows it (Alex, 10 Nov 2026). Replaces the answer buttons in Practise. 3D kit for the magnet and wire |
| 3 | `magnet-and-coil.html`, `transformer.html`, `national-grid.html` | Fable high | Solid coil, magnet and core; moving current arrows; predict the meter's direction on the picture before Go |
| 4 | `motion-graphs.html`, `ramp-motion.html`, `force-mass-acceleration.html`, `friction.html`, `skydiver.html` | Fable medium | Trolleys, ramps and people drawn as solid objects; the graph beside the scene; labels clear of the picture |
| 5 | `reaction-time.html`, `stopping-distance.html`, `momentum-collision.html`, `hookes-law.html`, `seesaw-moments.html` | Fable medium | As batch 4; `hookes-law.html` was animated on 3 Nov 2026, so probably a light pass |
| 6 | `series-parallel.html`, `iv-characteristics.html`, `potential-divider.html`, `electrostatic-charging.html` | Fable high | Build a circuit: a button deals a task ("Make a circuit that measures the current in the lamp and the p.d. across it"), the student adds the ammeter and voltmeter themselves, presses Go, and sees it work or what goes wrong in the wrong place (Alex, 10 Nov 2026; `series-parallel.html` already has drag-in meters, so extend that and add it to `iv-characteristics.html`). Real apparatus beside the circuit diagram; current arrows. The lamp curve into the negative quadrant (section 7) |
| 7 | `resistivity.html`, `internal-resistance.html`, `photoelectric.html`, `electron-diffraction.html` (IAL and IB) | Fable high | Apparatus drawn solid beside its graph; current arrows; labels |
| 8 | `refraction.html`, `speed-of-sound.html`, `oscilloscope.html` | Fable high | Glass blocks, ray box and oscilloscope as solid objects; predict which way the ray bends on the picture, then Go |
| 9 | `roller-coaster-energy.html`, `heat-transfer.html`, `density.html`, `liquid-pressure.html` | Fable high | Plain pictures named in section 7 (roller coaster, convection, Leslie cube with a readable thermometer) |
| 10 | `heating-curve.html`, `specific-heat.html`, `gas-molecules.html` | Fable high | Three large pages (about 1 370 lines each): `gas-molecules.html` is named in section 7. Do one page at a time |
| 11 | `film-badge.html`, `random-decay.html`, `radiation-in-fields.html`, `chain-reaction.html`, `penetrating-power.html` | Fable medium | `chain-reaction.html` is named in section 7; predict which way α and β bend on the picture, then Go |
| 12 | `projectile-lab.html`, `shoot-the-monkey.html`, `free-body-diagrams.html`, `newtons-laws.html`, `inclined-plane.html` (IAL and IB) | Fable medium | Newer pages, likely a light pass: labels, sizes, solid objects |
| 13 | `thermistor.html`, `latent-heat.html`, `boyles-law.html`, `gamma-radiation.html` (IAL practicals) | Fable medium | Apparatus drawn solid; keep every `?show=` mode and the fixed readings the practical pages check against |

- [x] Model pages: `dc-motor.html` and `ac-generator.html` redrawn (10 Nov 2026). Alex to check them (`tools/REVIEW.md`), especially the cell's + on the left brush for "Normal".
- [x] Batch 1 (10 Nov 2026): all three pages redrawn. `magnetic-field-patterns.html`: solid magnets on a card beside the exam diagram, filings that settle tap by tap, a swinging compass, and a Predict tab (compass direction; strongest field or neutral point). `electromagnet-field-patterns.html`: the wire or coil in 3D through the card with moving current arrows, beside the card seen from above; Off / Small / Big current; Predict (right-hand grip rule; which end of a solenoid is N). `electromagnets.html`: solid apparatus with a bench ammeter, the circuit diagram beside it, Predict (which end of the core is N); the circuit breaker redrawn solid beside a diagram of the appliances in parallel. To review in `tools/REVIEW.md`.
- [x] Batch 2 (10 Nov 2026): both pages rebuilt. `motor-effect.html`: one wide picture (3D apparatus, exam diagram, drawn left hand), an apparatus switch (straight wire, rod on rails, swing), predict on the picture then Go in Explore, Practise (nine kinds of question) and charged particles. `loudspeaker.html`: cut-away 3D speaker beside the exam diagram, current arrows, and a dealt question answered on the cone. To review in `tools/REVIEW.md`.
- [x] Batch 3 (10 Nov 2026): all three pages rebuilt. `magnet-and-coil.html`: 3D coil, magnet and meter, Predict (the meter's direction), IGCSE / IAL / IB switch with Lenz's law. `transformer.html`: 3D core and coils, Predict the voltmeter. `national-grid.html`: build the grid on two bases, then send; IGCSE / IAL / IB switch with P = I²R. To review in `tools/REVIEW.md`.
- [ ] Batch 4
- [ ] Batch 5 (`reaction-time.html` done 10 Nov 2026: redrawn with a side-on dart rifle, solid sheep, field and hedge, a velocity–time graph and stopwatch, and a new "Stop the car" test; the other four pages are still to do)
- [ ] Batch 6
- [x] Batch 7 (10 Nov 2026): all four pages redrawn. `resistivity.html` and `internal-resistance.html`: solid apparatus on the bench (digital meters, cells, rheostat, metre rule, micrometer) with purple current arrows, beside the graph and the circuit diagram. `photoelectric.html`: solid lamp, glass tube, supply and microammeter; the electrons shown going round the wires (for Alex to confirm). `electron-diffraction.html`: solid glass tube on a stand with its high-voltage supply, and a larger screen. They share a new drawing block, the instrument kit (`tools/ANIMATION-STYLE.md`). To review in `tools/REVIEW.md`.
- [ ] After batch 6: add its "build the circuit" task (the student places the ammeter and voltmeter, then Go) to `resistivity.html` and `internal-resistance.html`, with question kinds from the IAL papers. Left out of batch 7 so the mechanic is built once, in batch 6.
- [ ] Batch 8
- [x] Batch 9 (10 Nov 2026): all four pages redrawn. `roller-coaster-energy.html`: solid coaster beside a bar chart of the energy stores, and a new Predict tab (click a letter on the picture, then Go). `heat-transfer.html`: solid apparatus for all three parts, the convection exam diagram beside the beaker, a 3D Leslie cube with a readable thermometer. `density.html`: restyled, solid balance, glassware and stand. `liquid-pressure.html`: rebuilt on the standard page (Dam | Manometer tabs, a pressure–depth graph and an Experiment on the dam). They share a new drawing block, the solid kit (`tools/ANIMATION-STYLE.md`). To review in `tools/REVIEW.md`.
- [ ] Batch 10
- [ ] Batch 11
- [ ] Batch 12
- [ ] Batch 13

## Done

- [x] Core route for the other 13 IGCSE practicals (only 1.22 has one): about 12 minutes each, chosen from the Question Index, set in `page.json`, checked with `check.py` (`tools/CORE-PRACTICALS.md`, "Core route + Extra practice"). Start from the recommended route for each page in the Project doc `claude/practicals-review-2026-11-04.md` (added 5 Nov 2026). Superseded 5 Nov 2026: practical pages no longer have a core route (see the rebuild to-do in section 5).
- [x] Two-column Calculate working (givens left, steps right) and a New problems button on every workout Calculate: 21 IGCSE, Year 9 and IB pages, about 190 questions; questions on a fixed graph, table or diagram keep their numbers (Alex, 5 Nov 2026).

- 5 Nov 2026: IAL CP15 `gamma-absorption-practical.html` (8 tabs, from Alex’s CP15 worksheet), card on `ial.html`; `animations/gamma-radiation.html` gets a measure mode for its Do the Experiment tab, the “Why ln I?” explanation, and the second tab labelled CP15.

- [x] Show answer button after a wrong Check on every marked activity, workouts and practicals; Calculate working opens only from it. Spot the error removed from the 17 practical pages too (20 cards) (Alex, 4 Nov 2026).

- [x] Spot the error removed from all IGCSE workouts: 26 cards, 34 worked examples (Alex, 4 Nov 2026: show only clear working).

- [x] Split 2b (now 2b Circuits + 2c Circuit Components; Electric Charge is 2d) and 3b (now 3b Light + 3c Sound, TA) so no workout runs to 30 minutes (Alex, 4 Nov 2026).
- 4 Nov 2026: core practicals 3.17, 3.19 and 3.25P published (cards on `igcse.html`, workout links and `.cp-banner`s on 3b Refraction and Speed of Sound, now 3c `sound.html`).
- 4 Nov 2026: core practicals 2.23P, 3.27P and 7.6 built and published, with new animations `electrostatic-charging.html` (framed in 2c Charging, with the banner), `oscilloscope.html` (framed in 3b Pitch and Loudness) and `penetrating-power.html` (framed in 7a Alpha, Beta, Gamma), each with its banner; mark scheme wording from the IGCSE Question Index.
- 4 Nov 2026: Unit 7 (7a `radioactivity.html`, 7b `fission-and-fusion.html`) and Unit 8 (8a `universe-and-stars.html`, 8b `cosmology.html`, TA) workouts as drafts, with cards on `igcse.html`, Units and Terms on 7b and 8a, tabs in the Calculations and Graphs sets. `film-badge.html` and `random-decay.html` framed in 7a, `chain-reaction.html` in 7b (and now on the IGCSE animation list). Marked 🔍 in `tools/REVIEW.md`.
- 4 Nov 2026: Unit 3 Waves workouts (draft): 3a `waves.html` and 3b `light-and-sound.html` (Units and Terms for Unit 3 on 3b), cards on `igcse.html` under a Draft Unit 3 heading, Unit 3 tabs added to the Calculations and Graphs sets. `refraction.html` and `speed-of-sound.html` framed in 3b. Marked 🔍 in `tools/REVIEW.md`.
- 4 Nov 2026: core practicals 3.17, 3.19 and 3.25P built as drafts with their animations `refraction.html` and `speed-of-sound.html` (new Unit 3 Waves heading on `animations/igcse.html`); mark scheme wording checked from the IGCSE Question Index.
- 4 Nov 2026: `animations/electromagnets.html` (electromagnet and circuit breaker; framed in 6a Electromagnets and 2a Safety) and `animations/electron-diffraction.html` (IAL Unit 2, IB Theme E; framed in `quantum-physics.html` Matter Waves).
- 4 Nov 2026: `animations/chain-reaction.html` (reactor chain reaction, IAL Unit 5 and IB Theme E lists). Licence footer added to 2a, 2b, 2c.
- 3 Nov 2026: Calculations and Graphs sets now cover Forces Part 2 (1c, 1d) and Units 4, 5 and 6 (32 and 9 tabs). 1b gained two graph Calculates ("Read the graph" on F = ma and Weight: force–acceleration and weight–mass lines, mass and g from the gradient), used by the Graphs set. The interactive-revision-lab skill already had the one-Units-tab-per-unit rule.
- 3 Nov 2026: one Units and Key Terms tab per unit ("Units and Terms", last tab) on 1c, 2b, 4c, 5b and 6b; the other workouts' Units/Key Terms tabs removed, old links forwarded, saved answers carried over. 4b's crossword is on 4c; 4d's renewable sort moved to its Renewable tab. Unit 5 gained two units tables from the SLG deck and a key-terms match. Marked 🔍 in `tools/REVIEW.md`.
- 3 Nov 2026: 2.9 I–V characteristics practical: guide pages and mark scheme wording check; same check on the Unit 2 workouts 2a, 2b, 2c. Details in `tools/REVIEW.md` and `tools/CORE-PRACTICALS.md`.
- 3 Nov 2026: Unit 2 Electricity workouts: 2a `mains-electricity.html`, 2b `circuits.html`, 2c `electric-charge.html` (TA), cards on `igcse.html`, the three IGCSE electricity animations framed in 2b, Unit 2 tabs in the Calculations and Graphs sets. 2.9 practical page `iv-characteristics-practical.html` published, with its `.cp-banner` on 2b I–V Graphs. All marked 🔍 in `tools/REVIEW.md`.
- 3 Nov 2026: Hooke's law animation animated, with draggable masses and a rubber band hysteresis loop. Heating-curve simplification accepted by Alex. TA tags on Triple Award units (1d, 5a).
- 3 Nov 2026: specs uploaded. 5a Units tab: 5.2 (J/kg °C) is Double Award in the 4PH1 spec, so its badge is right and no change was needed. IAL thermistor practical: Divider tab now badged 75, 76 and Experiment tab 79 (resistance and temperature).
- 3 Nov 2026: site audit fixes on 26 pages and 2 animations: wrong physics (5a and animation heating curve, Boyle's law Predict, thermistor explanation, light gates, Year 9 flask/aircon/thermometer), fractions now drawn in Predict options and activity titles (engine, every copy), right answers that were marked wrong, giveaways, missing working steps, Slow motion on `seesaw-moments.html`.
- 3 Nov 2026: names spread across the site; each page uses its own course's names (Year 9 KS3, IAL practicals IAL, IGCSE pages IGCSE).
- 3 Nov 2026: one master to-do list (this file). The open items from `tools/WORKOUTS.md` moved here.
