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
- [ ] 5.2 Nuclear Decay (IAL), slide 42 Chain Reaction: build a chain-reaction animation set in a reactor (power-station theme): fuel rods of U-235, a moderator slowing the neutrons, control rods the student raises and lowers to set how many neutrons are absorbed, and the chain dying out, staying steady (critical) or growing, with a live graph of fissions per generation; then link it on slide 42 (review row S8, added 3 Nov 2026).
- [ ] 6 Magnetism (IGCSE), slides 29–30: build an electromagnets and circuit-breaker animation (tab 1: coil picking up clips, with current, turns and iron core; tab 2: a circuit breaker that trips at a set current), then link it on slides 29–30 (review row M18, added 3 Nov 2026).
- [ ] E2 Quantum (IB), slides 55–70: build an electron-diffraction tube animation (voltage slider, rings shrink as the voltage rises; second view: count against angle with the first minimum), then link it on slides 55–70 (review row Q28, added 3 Nov 2026).

## 3. Alex to review

51 pages are 🔍 To review and 17 are ❔ Not recorded in `tools/REVIEW.md`. Go through that table; only Alex marks a page ✅.

- [ ] Look at the drafts `calculations.html` and `graphs.html`. If they're fine, add their cards to `igcse.html` below Core Practicals and remove `noindex` (in `tools/sets/build.py`).
- [ ] `iv-characteristics.html`: is the two-cell potentiometer set-up how you teach it, or should Experiment mode have a "reverse the connections" step instead?

## 4. Build: workouts (IGCSE, spec order)

Ask Alex for the spec page first. Build to the size rule in `CLAUDE.md`, add the cards to `igcse.html`, then add the unit's activities to the Calculations and Graphs sets.

- [ ] Unit 3 Waves (about 2 pages).
- [ ] Unit 7 Radioactivity and Particles (1–2 pages). Frame `film-badge.html` and `random-decay.html` in it.
- [ ] Unit 8 Astrophysics (1 page).
- [ ] Calculations and Graphs sets: add Forces Part 2 (1c with suvat, 1d), then Units 4, 5 and 6 (Unit 2 added 3 Nov 2026).
- [ ] Graphs set: 1b has no graph activities. Consider using the 1.5 practical's plotting activities (`build.py` would need to read its `content.js`).
- [ ] Key-word crosswords for other units, if Alex wants them.

## 5. Build: core practicals

How to build one: `tools/CORE-PRACTICALS.md`.

- [ ] 2.9 I–V characteristics: guide pages (PDF 193–196) and mark scheme wording check, as for the other practicals (added 3 Nov 2026).
- [ ] 3.19 Refractive index of glass (batch B; do 3.17 first so they share the light box).
- [ ] 3.25P Speed of sound in air (batch B).
- [ ] 2.23P Charging insulators by friction (batch C). Add its `.cp-banner` to `electric-charge.html#charging` when built.
- [ ] 3.17 Refraction (batch C).
- [ ] 3.27P Frequency of sound with an oscilloscope (batch C).
- [ ] 7.6 Penetrating power of radiation (batch C).
- [ ] IAL CP7 resistivity and CP8 internal resistance practical pages, if Alex wants them (the animations are done).
- [ ] IAL CP12–14: mark scheme wording check (no IAL question index yet).

## 6. Build: IAL and IB

- [ ] IAL 132: the derivation of ½m⟨c²⟩ = 3/2 kT (an Order activity or a step-by-step reveal).
- [ ] `ial.html` holds only Core Practicals so far; IAL workouts are still to plan.

## Done

- 3 Nov 2026: Unit 2 Electricity workouts: 2a `mains-electricity.html`, 2b `circuits.html`, 2c `electric-charge.html` (TA), cards on `igcse.html`, the three IGCSE electricity animations framed in 2b, Unit 2 tabs in the Calculations and Graphs sets. 2.9 practical page `iv-characteristics-practical.html` published, with its `.cp-banner` on 2b I–V Graphs. All marked 🔍 in `tools/REVIEW.md`.
- 3 Nov 2026: Hooke's law animation animated, with draggable masses and a rubber band hysteresis loop. Heating-curve simplification accepted by Alex. TA tags on Triple Award units (1d, 5a).
- 3 Nov 2026: specs uploaded. 5a Units tab: 5.2 (J/kg °C) is Double Award in the 4PH1 spec, so its badge is right and no change was needed. IAL thermistor practical: Divider tab now badged 75, 76 and Experiment tab 79 (resistance and temperature).
- 3 Nov 2026: site audit fixes on 26 pages and 2 animations: wrong physics (5a and animation heating curve, Boyle's law Predict, thermistor explanation, light gates, Year 9 flask/aircon/thermometer), fractions now drawn in Predict options and activity titles (engine, every copy), right answers that were marked wrong, giveaways, missing working steps, Slow motion on `seesaw-moments.html`.
- 3 Nov 2026: names spread across the site; each page uses its own course's names (Year 9 KS3, IAL practicals IAL, IGCSE pages IGCSE).
- 3 Nov 2026: one master to-do list (this file). The open items from `tools/WORKOUTS.md` moved here.
