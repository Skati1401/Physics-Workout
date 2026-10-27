# Workout pages: to-do list

Started 27 Oct 2026. Tick items off here as they are done (and update `tools/REVIEW.md` and the repo CLAUDE.md as usual). Core practicals have their own list in `tools/CORE-PRACTICALS.md`.

## 1. Calculations and Graphs sets (start now, Forces Part 1 only)

Two whole-course pages made of the activities already in the workouts, like the Core Practicals heading on `igcse.html`. Build them now for Forces Part 1 (1a, 1b) and add each unit as it is finished.

- [ ] **Decide how the sets stay in step with the workouts.** Each activity is written inside its workout's script (`calcAct`, `spotAct`, `labelGraphAct`), not on a page of its own. Plan: a small build script (like `tools/practical-gen/gen.py`) copies the marked activities from each workout into the set page, so the pages stay single-file and a fix in a workout reaches the set by re-running it. Agree this with Alex before building.
- [ ] **Calculations set** (`calculations.html`), one tab per part/unit. Forces Part 1 holds:
  - 1a Calculate: speed and acceleration calc, Spot the Error
  - 1a s–t Graph and v–t Graph: "Work out the numbers" calcs
  - 1b Resultant?: calc
  - 1b F = ma: calc, Spot the Error
  - 1b Weight: calc, Spot the Error
- [ ] **Graphs set** (`graphs.html`). Forces Part 1 holds:
  - 1a s–t Graph: label the line + its calc
  - 1a v–t Graph: label the line + its calc
  - (1b has no graph activities; consider the 1.5 practical's plotting activities)
- [ ] Each set gets its own saved progress (`STORE_KEY`), the breadcrumb header and a card on `igcse.html` (after the units, before Core Practicals).
- [ ] Add Forces Part 2 (1c with suvat, 1d), then Units 4, 5 and 6.

## 2. Remaining IGCSE units (spec order)

For each: ask Alex for the spec page first (spec numbers from the spec, never memory), build to the size rule in CLAUDE.md (one workout per spec sub-section, 5–8 tabs), add the cards under a new unit heading on `igcse.html`, then add the unit's activities to both sets.

- [ ] **Unit 2 Electricity** (about 2 pages). Core practicals 2.9 and 2.23P are in batches B and C.
- [ ] **Unit 3 Waves** (about 2 pages). Core practicals 3.17, 3.19, 3.25P, 3.27P.
- [ ] **Unit 7 Radioactivity and Particles** (1–2 pages). Core practical 7.6; `animations/film-badge.html` already exists.
- [ ] **Unit 8 Astrophysics** (1 page).

## Done

- 27 Oct 2026: Forces split into Part 1 (1a, 1b) and Part 2 (1c with suvat, 1d) to match Alex's school.
- Unit 4 (4a–4d), Unit 5 (5a, 5b), Unit 6 (6a, 6b) workouts built to the size rule.
