# Alex's to-do list

The one list for everything still to do: the website, lesson decks, and anything else. Every chat (claude.ai projects, Claude Code, PPT reviews) adds its to-dos here and ticks them off here. Nowhere else holds a to-do.

- **This repo is public.** No surnames, class lists, results, or anything that links a student to a class or a result. Common first names in questions are fine, as everywhere on the site.
- **Detail lives elsewhere, the to-do lives here.** How to build a core practical is in `tools/CORE-PRACTICALS.md`; what Alex still has to look at on each page is in `tools/REVIEW.md`. This file holds the task and links there.
- Format: `- [ ] task (where, added date)`. Tick with `[x]` and move it to **Done** with the date. Most urgent section first.

## 1. Fix now (site audit, 3 Nov 2026)

_Filled in from the audit below._

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
