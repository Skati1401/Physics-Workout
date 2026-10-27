# Workout pages: to-do list

Started 27 Oct 2026. Tick items off here as they are done (and update `tools/REVIEW.md` and the repo CLAUDE.md as usual). Core practicals have their own list in `tools/CORE-PRACTICALS.md`.

## 1. Calculations and Graphs sets (start now, Forces Part 1 only)

Two whole-course pages made of the activities already in the workouts, like the Core Practicals heading on `igcse.html`. Build them now for Forces Part 1 (1a, 1b) and add each unit as it is finished.

- [x] **How the sets stay in step (27 Oct 2026):** a set page holds no questions. It frames each workout in set mode (`page.html?set&tabs=…&kinds=…`, the workout's `setMode()`), which shows only those tabs' activities of those kinds. A fix in a workout reaches the set at once, and answers save to the workout's own `STORE_KEY`, so work done in a set also ticks the workout. Pages are built by `tools/sets/build.py` (edit its `SETS` list, then run it).
- [x] **Drafts started (27 Oct 2026):** `calculations.html` (1a Calculate; 1b Resultant, F = ma, Weight: calcs and Spot the Error) and `graphs.html` (1a s–t and v–t: label the line + its calc). Both `noindex`, no card yet.
- [ ] Alex to look at both drafts. Then add the cards to `igcse.html` (below Core Practicals) and remove `noindex` (in `build.py`).
- [ ] Graphs set: 1b has no graph activities; consider adding the 1.5 practical's plotting activities (practical pages need `setMode()` in `tools/practical-gen/template/`).
- [ ] Each new workout added to a set needs `setMode()` copied in from `motion.html` (just above `start(readSaved())`, plus `if(setMode(data))return;` in `start`).
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
