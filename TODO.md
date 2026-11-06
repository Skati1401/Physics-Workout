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
