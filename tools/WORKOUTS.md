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

Stand-alone pages in `animations/` (teaching-animations skill), one copy framed in the workouts. Added 2 Nov 2026 from the IAL 5.2 Nuclear Decay deck (spec 133–142); card on `animations/a-level-ib.html` (and `animations/igcse.html` where it fits Unit 7).

- [ ] **Random decay and half-life:** a grid of nuclei decaying at random, with a live N–t graph and a ln N–t graph; read t½ and λ from them.
- [ ] **α, β and γ deflection in fields:** paths in a magnetic or electric field, sliders for field direction and strength. `animations/motor-effect.html?show=particles` (6.11P) only shows a charged particle / electron in a magnetic field: extend it rather than make a second page, if that fits.
- [ ] **Inverse-square law for gamma:** count rate against distance, background subtracted.
- [ ] **IAL CP15 gamma absorption:** Experiment mode (experiment-kit): add lead sheets, read I, plot ln I against x (I = I₀e^−μx, gradient −μ, x½ = ln 2/μ).
- [ ] **Film badge:** `animations/film-badge.html` exists (cards on both animation lists) but is not framed in any workout yet. Frame it in the Unit 7 workout tab for radiation types, with the full-screen link.

## Done

- 27 Oct 2026: Forces split into Part 1 (1a, 1b) and Part 2 (1c with suvat, 1d) to match Alex's school.
- Unit 4 (4a–4d), Unit 5 (5a, 5b), Unit 6 (6a, 6b) workouts built to the size rule.
