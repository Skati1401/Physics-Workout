# 8q: teacher pages for the IGCSE animations (prompt for a school chat)

Paste this into a new chat on the school account (Opus, medium effort), in the physics-workouts project:

---

Do TODO 8q: give the IGCSE animations the teacher-page layout the Year 9 animations got on 24 Nov 2026.

Attach the repo Skati1401/Physics-Workout and follow its CLAUDE.md. Load the teaching-animations skill from the repo (`.claude/skills/teaching-animations/SKILL.md`, section "Teacher page for a projector") and read "Teacher page: the teach kit" in `tools/ANIMATION-STYLE.md`. The teach kit is `tools/teach-kit/kit.js`; the eight Year 9 pages are the models (`animations/seasons.html`, `orbits.html`, `weight-on-planets.html`, `solar-system-scale.html`, `moon-phases.html`, `solar-system-models.html`, `zoom-out.html`, `constellations.html`). Search for `teachPage(` to see each call.

What the teacher page is (Alex): opened on its own (not `?embed`), an animation is for the teacher on a projector. The teacher knows the physics, so the picture is the main display and the controls are small. No Questions (link to the student version in the workout instead), the note, readings and working behind a Notes button, the choices in one strip under the picture or on the picture itself (layout B). The workout frames (`?embed`) must not change at all.

Steps:
1. List the pages: every card on `animations/igcse.html` (unit by unit), less the ones that already call `teachPage(` (orbits, weight-on-planets and zoom-out do). Skip redirect pages. Core practical animations: the teacher page must not change `?show=measure` or the Experiment mode; if a page's practical frame or Experiment mode would be affected, leave that page out and list it.
2. For each page, find the workout tab that frames it (grep the workouts for the page name; `tools/PAGE-NOTES.md` has the map) for the "Student version" link. A page on several lists links by `PW_LEVEL` (see `orbits.html`); no link at a level with no workout.
3. Add the kit markers and one `teachPage({...})` call before the `?show=predict` line, then `python3 tools/kits.py teach-kit`. Choose for each page: `strip` (choices for the strip under the picture, main choice first), and `pic` with `pin:'hide'` where the picture already does that choice (something to click in the picture), or `pin:'tr'` etc. for a small block over an empty corner. Keep every other choice in the strip.
4. Pages that don't fit the usual shape (several pictures, graphs under the picture, a Build mode, a level switch in the side column, choices that only make sense with their readings): if unsure, use `trial:true` and list the page with links `?layout=a`, `?layout=b` and `?layout=c` so Alex can choose. Do the clear ones as layout B.
5. Check every page with `python3 tools/anim-check.py <page>` and `<page>?embed` (serve the repo with `python3 -m http.server 8765` first). The card must end above the window at 1366×657 and at 1024×768 (Alex's projector), with no sideways scroll. New label clashes the check finds that come from the picture itself (not the layout) are worth fixing if small; list the rest.
6. Look at a screenshot of each page at 1024×768, only at the end.
7. Set each changed page's row in `tools/REVIEW.md` to 🔍 with a short "teacher page" note, add the pages to the teacher-page line in `tools/PAGE-NOTES.md`, and update the "All eight Year 9 animations have it" line in the skill and in `tools/ANIMATION-STYLE.md`. Tick 8q in `TODO.md` (and its row drops off `tools/todo.html` by itself). Commit to main and push.
8. Reply with: the pages done, one line each saying where the choices went; the pages left out and why; and, for any trial page, the three links with a one-line A / B / C choice each, my recommendation first.

Work unattended where you can: choose sensibly and say what you chose. Many pages: work unit by unit and push after each unit, so a part-finished job still helps.
