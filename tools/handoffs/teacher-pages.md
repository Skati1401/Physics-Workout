# Teacher pages for the IGCSE, IAL and IB animations (TODO 8q to 8ac)

Thirteen batches of 3 to 7 pages, one chat each, in any order. Paste this into a new chat on the school account (Opus, medium effort), in the physics-workouts project, with the batch's ID in place of 8q:

---

Do TODO 8q: give the animations listed in that item the teacher-page layout the Year 9 animations got on 24 Nov 2026. Do only that batch's pages.

Attach the repo Skati1401/Physics-Workout and follow its CLAUDE.md. Load the teaching-animations skill from the repo (`.claude/skills/teaching-animations/SKILL.md`, section "Teacher page for a projector") and read "Teacher page: the teach kit" in `tools/ANIMATION-STYLE.md`. The teach kit is `tools/teach-kit/kit.js`; the eight Year 9 pages are the models (`animations/seasons.html`, `orbits.html`, `weight-on-planets.html`, `solar-system-scale.html`, `moon-phases.html`, `solar-system-models.html`, `zoom-out.html`, `constellations.html`). Search for `teachPage(` to see each call.

What the teacher page is (Alex): opened on its own (not `?embed`), an animation is for the teacher on a projector. The teacher knows the physics, so the picture is the main display and the controls are small. No Questions (link to the student version in the workout instead), the note, readings and working behind a Notes button, the choices in one strip under the picture or on the picture itself (layout B). The workout frames (`?embed`) must not change at all.

Steps:
1. The pages are the ones named in the TODO item. Skip any that already call `teachPage(`. Many are on more than one list (IGCSE, IAL, IB): one call serves every level, so check the page at each `?level=` it has. Core practical animations: the teacher page must not change `?show=measure` or the Experiment mode (their practical pages frame them with `?embed`, which the kit leaves alone: check it); if it would, leave that page out and list it.
2. For each page, find where students meet it for the "Student version" link: the workout tab that frames it (grep the root pages for the file name; `tools/PAGE-NOTES.md` has the map), or for a core practical animation its practical page. A page on several lists links by `PW_LEVEL` (see `orbits.html`); no link at a level where students have no page with it.
3. Add the kit markers and one `teachPage({...})` call before the `?show=predict` line, then `python3 tools/kits.py teach-kit`. Choose for each page: `strip` (choices for the strip under the picture, main choice first), and `pic` with `pin:'hide'` where the picture already does that choice (something to click in the picture), or `pin:'tr'` etc. for a small block over an empty corner. Keep every other choice in the strip.
4. Pages that don't fit the usual shape (several pictures, graphs under the picture, a Build mode, a level switch in the side column, choices that only make sense with their readings): if unsure, use `trial:true` and list the page with links `?layout=a`, `?layout=b` and `?layout=c` so Alex can choose. Do the clear ones as layout B.
5. Check every page with `python3 tools/anim-check.py <page>` and `<page>?embed` (serve the repo with `python3 -m http.server 8765` first). The card must end above the window at 1366×657 and at 1024×768 (Alex's projector), with no sideways scroll. New label clashes the check finds that come from the picture itself (not the layout) are worth fixing if small; list the rest.
6. Look at a screenshot of each page at 1024×768, only at the end.
7. Set each changed page's row in `tools/REVIEW.md` to 🔍 with a short "teacher page" note, add the pages to the teacher-page line in `tools/PAGE-NOTES.md`, and update the line saying which animations have it in the skill (`.claude/skills/teaching-animations/SKILL.md`) and in `tools/ANIMATION-STYLE.md`. Tick the item in `TODO.md` (and its row drops off `tools/todo.html` by itself). Commit to main and push.
8. Reply with: the pages done, one line each saying where the choices went; the pages left out and why; and, for any trial page, the three links with a one-line A / B / C choice each, my recommendation first.

Work unattended where you can: choose sensibly and say what you chose. Push after every two or three pages, so a part-finished batch still helps. If the skill changed, end with an update card for this account's copy and a handover for home (see the alex-school-drive skill), as on 24 Nov 2026.

## The batches

| ID | Batch | Pages |
|---|---|---|
| 8q | IGCSE Unit 1 Forces and Motion (a) | motion-graphs, ramp-motion, force-mass-acceleration, friction, skydiver |
| 8r | IGCSE Unit 1 Forces and Motion (b) | reaction-time, stopping-distance, momentum-collision, hookes-law, seesaw-moments |
| 8s | IGCSE Units 2 Electricity and 4 Energy | series-parallel, iv-characteristics, potential-divider, electrostatic-charging, sankey-diagram, roller-coaster-energy, heat-transfer |
| 8t | IGCSE Unit 3 Waves | travelling-waves, doppler-effect, refraction, speed-of-sound, oscilloscope |
| 8u | IGCSE Unit 5 Solids, Liquids and Gases | density, heating-curve, specific-heat, gas-molecules, liquid-pressure |
| 8v | IGCSE Unit 6 Magnetism (a) | magnetic-field-patterns, electromagnet-field-patterns, electromagnets, motor-effect, dc-motor |
| 8w | IGCSE Unit 6 Electromagnetism (b) | magnet-and-coil, ac-generator, transformer, national-grid, loudspeaker |
| 8x | IGCSE Unit 7 Radioactivity | film-badge, random-decay, decay-chart, radiation-in-fields, chain-reaction, penetrating-power |
| 8y | IAL Unit 1 Mechanics (also IB Theme A) | projectile-lab, shoot-the-monkey, free-body-diagrams, newtons-laws, inclined-plane, viscosity |
| 8z | IAL Unit 2 Waves and Electricity (also IB B and C) | standing-waves, slit-interference, resistivity, internal-resistance |
| 8aa | IAL Unit 5 Thermal, Nuclear and Oscillations (also IB) | thermistor, latent-heat, boyles-law, gamma-radiation, simple-harmonic-motion, oscillations |
| 8ab | Space: IGCSE Unit 8, IAL Unit 5 | star-life-cycle, red-shift, wiens-law, star-clusters, parallax, standard-candles |
| 8ac | Quantum, scattering and relativity: IAL Units 2 and 4, IB A.5 and E | photoelectric, electron-diffraction, rutherford-scattering, time-dilation, spacetime-diagram |

Each page is in one batch only, under the first list it appears on (IGCSE, then IAL, then IB); the batch does every level the page has. Already done (24 Nov 2026): the eight Year 9 pages, including orbits, weight-on-planets and zoom-out on the IGCSE, IAL and IB lists.
