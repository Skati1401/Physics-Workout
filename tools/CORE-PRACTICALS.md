# Core practicals: tracker and how to build a batch

Alex wants every IGCSE physics practical built the way 1.22 Hooke's law was. Each batch is built in its own chat.

## Starting a batch in a new chat

Paste this into a new chat in the "Animated activities for kids" project:

> Build core practical batch **A** (or B, C) for the physics-workout repo (`Skati1401/Physics-Workout`), following `tools/CORE-PRACTICALS.md`.

The new chat should then:

1. Attach and clone `Skati1401/Physics-Workout` (push access). Read `CLAUDE.md`, this file and `tools/README.md`.
2. Load the **interactive-revision-lab** skill and read its "Core practicals" section. That section has the design rules, the tab pattern, the wording rules and the review checklist.
3. Open the model pages: `hookes-law-practical.html` (built from `tools/practical-gen/practicals/hookes-law/`) and `animations/hookes-law.html`.
4. Read the guide pages for each practical in the batch from the Project doc `claude/core-practical-guide-physics.md`. The PDF page numbers are in the table below. Use the guide for the method, safety, apparatus and the questions it suggests. Never copy its exam questions; the repo is public.
5. **Check the spec numbers against the current 4PH1 specification.** The guide is from 2017 and leaves the P off some Triple Award points. CLAUDE.md says to take the numbers from the spec itself, so if the spec pages aren't in the chat, ask Alex for them.
6. Build each practical in the batch (steps below), push it as a **draft**, and send Alex the links. After he reviews a practical, publish it.

## Steps for one practical

1. **Animation.**
   - If one already exists (see the table), extend it; never make a second copy.
   - Otherwise create `animations/<topic>.html` from the closest animation page, following CLAUDE.md's "Animation page layout".
   - Add an Experiment mode using the kit (`tools/experiment-kit/`):
     - Copy `kit.css` into the page's `<style>` and `kit.js` into its script.
     - Drive the run with `expRun`, take readings with `expReading`, show them with `expTable`, and plot them with `expCross` and `expRing`.
     - `tools/experiment-kit/demo.html` is a small working example.
   - For a practical that isn't measure-and-plot (charging, refraction rays, field lines, penetration), the Experiment mode still means the student takes the observations one at a time and records them, with the conclusion withheld until the end.
2. **Practical page.**
   - Copy `tools/practical-gen/practicals/hookes-law/` to `practicals/<slug>/`.
   - Edit `page.json`: title, unit, links, tabs and spec badges (a badge ending in P makes that tab and the eyebrow TA automatically), plus `storeKey` and `accent`. Set `"draft": true`.
   - Rewrite `content.js`: the same nine tabs, with new activities.
   - Build it: `python3 tools/practical-gen/gen.py --check <slug>`.
   - Check it: `python3 tools/practical-gen/check.py <slug>-practical.html` (with `python3 -m http.server 8765` running in the repo root) answers every graded activity and checks the frames and phone width.
3. **Test** as in the skill's "Verification before publishing":
   - Click every tab, and check there's no sideways scroll at 380px.
   - Answer every graded activity in Playwright.
   - Run the Experiment for every case, in both directions.
   - Check the stage card fits 1366×657.
   - Serve the folder on localhost so the frames can be measured.
4. **Check the wording against mark schemes** (Alex, 21 Oct 2026).
   - Use the IGCSE Question Index (Alex's other project) to find every past-paper part tagged with the practical's spec points, then read those parts in the 4PH1 mark schemes uploaded to the "Animated activities for kids" project.
   - Match the method steps, the Order and Match wording, the model answers (bullet points) and the Exam tab to the marking points' phrasing: the details that score (e.g. "ruler held vertically / set square / eye level", "interrupter card", "speed at bottom = 2 × average speed").
   - Where a mark scheme accepts more than one method, offer them with a "Method type" switch, as in the 1.5 page's Overview and Method tabs.
   - Note the papers used in the batch notes below. Never copy a question onto the site; the repo is public.
5. **Review it critically**, using the skill's review list: numbers, wording, spec coverage, trims. Fix what you find before showing Alex.
6. **Push the draft** to `main` and send Alex its link: `https://skati1401.github.io/Physics-Workout/<slug>-practical.html`.
7. **Publish once Alex approves.**
   - Set `"draft": false` and rebuild.
   - Add its card under "Core Practicals" in `igcse.html`, in spec order, with a TA tag if needed.
   - Add the `.cp-banner` to its workout tab's heading line, copying the one in `falling-stopping-springs.html#hooke`. If that workout can't open a tab from `#tab`, add hash support as in the 1b page. Units 2, 3 and 7 have no workouts yet: skip the banner and note it below.
   - Add a "Core practical x.xx" tag on the animation's card in `animations/igcse.html`.
   - Update the status in this table.

## The practicals

The guide's PDF pages are those of the PDF Alex shared; in the Project doc, look for the "---- PDF page N ----" markers. The linked spec points are as the guide lists them (2017), so check the P suffixes against the current spec.

| # | Spec | Practical | Guide PDF pages | Spec points it links to (guide) | TA | Animation | Workout tab | Batch | Status |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 1.5 | Motion of everyday objects (toy car, tennis ball) | 143–148 | 1.6, 1.7, 1.8, 1.10, 1.21 | | new `ramp-motion.html` | `motion.html#measuring` (Measure v tab) | A | **published** (21 Oct 2026; Alex to review) |
| 2 | 1.22 | Extension of springs, wires, rubber bands | 149–152 | 1.18, 1.23, 1.24 | | `hookes-law.html` | `falling-stopping-springs.html#hooke` | done | **published** (the model) |
| 3 | 2.23P | Charging insulators by friction | 153–155 | 2.22P, 2.24, 2.25, 2.26, 2.27, 2.28 | TA | new | none yet (Unit 2) | C | to do |
| 4 | 3.17 | Refraction: rectangular, semicircular blocks, prisms | 156–162 | 3.14, 3.15, 3.16, 3.18, 3.21, 3.22 | | new (can share a light-box animation with 3.19) | none yet (Unit 3) | C | to do |
| 5 | 3.19 | Refractive index of glass | 163–166 | 3.14–3.18, 3.20, 3.21, 3.22 | | new (light box, shared with 3.17) | none yet (Unit 3) | B | to do |
| 6 | 3.25P | Speed of sound in air | 167–169 | 1.4, 3.23 | TA | new | none yet (Unit 3) | B | to do |
| 7 | 3.27P | Frequency of sound with an oscilloscope | 170–173 | 3.24, 3.25, 3.26, 3.28, 3.29 | TA | new | none yet (Unit 3) | C | to do |
| 8 | 4.9 | Thermal energy transfer (conduction, convection, radiation) | 174–178 | 4.6, 4.7, 4.8, 4.10, 5.3 | | new (check the 4b workout's Practicals tab for sims to move out) | `heat-transfer-igcse.html#practical` | C | to do |
| 9 | 5.4 | Density from mass and volume | 179–183 | 1.2 | | new | `density-pressure-state.html#density` | B | to do |
| 10 | 5.14P | Specific heat capacity | 184–187 | 5.12, 5.13 | TA | `specific-heat.html` (moved out of the Unit 5 Specific Heat tab, which now frames it) | `density-pressure-state.html#shc` | A | **published** (21 Oct 2026; Alex to review) |
| 11 | 6.6 | Magnetic field of a bar magnet | 188–189 | 6.2, 6.3, 6.4, 6.5, 6.7 | | `magnetic-field-patterns.html` (Experiment mode added) | `magnetism-and-electromagnetism.html#fields` | A | **published** (21 Oct 2026; Alex to review) |
| 12 | 7.6 | Penetrating power of radiation | 190–192 | 7.4, 7.5, 7.9, 7.10, 7.16 | | new (a simulation is acceptable for the real practical too) | none yet (Unit 7) | C | to do |
| 13 | 2.9 | Current–voltage characteristics (wire, resistor, lamp, diode) | 193–196 | 2.10, 2.12, 2.13 | | new (the kit demo is a start) | none yet (Unit 2) | B | to do |
| 14 | 5.11P | Temperature–time graph for melting ice | 197–200 | 5.8, 5.9, 5.10 | TA | `heating-curve.html` (Experiment mode added) | `density-pressure-state.html#heating` | A | **published** (21 Oct 2026; Alex to review) |

**Batches:**
- **A** (extend what exists): 1.5, 5.11P, 6.6, 5.14P.
- **B** (measure and plot): 2.9, 3.19, 5.4, 3.25P.
- **C** (observe and explain): 2.23P, 3.17, 3.27P, 4.9, 7.6. Do 3.17 before 3.19 if B and C overlap, so they share the light box.

## Notes from Hooke's law (the model)

- Alex asked for: the summary first; the animation in its own tab; variables before the experiment and results straight after; every linked spec point covered (wires, rubber bands and elastic behaviour, not just springs); graph questions, including the axes the other way round; an exam question that asks for a missing result in a table.
- The review found:
  - "up to 6 N" should be "to at least 6 N, the limit lies between 6 N and 8 N"
  - the apparatus must match the precision recorded (a vernier for a wire)
  - bin labels must fit every card
  - the topic needed an unloading run, plotting practice and an anomalous result
- The trims: an easy Predict, a match that repeated definitions, and a separate Materials tab (folded into Experiment).

## Notes from batch A (21 Oct 2026)

All four were built as drafts, then published the same day. Spec numbers were checked against the badges on the Unit 1, 5 and 6 workouts, which were taken from the spec.

- **1.5:** a new animation, `animations/ramp-motion.html`, because `motion-graphs.html` is a car on a 200 m road, not the ramp apparatus. Watch mode draws the distance–time and velocity–time graphs live. Experiment mode times the car to marks every 0.20 m, by stopwatch (three repeats, reaction-time scatter, a small late-stop bias, so it gives a value 5–8% low) or by light gates (to 0.001 s, plus a 5.0 cm card for the speed at each gate). Ramp heights 10, 20 and 30 cm give 0.4, 0.8 and 1.2 m/s².
- **5.14P:** the Unit 5 SHC explore (material, mass, comparison bars) became `animations/specific-heat.html`, and the Unit 5 Specific Heat tab now frames it. Experiment mode has a heater that warms itself first, energy lost to the room (lagged or not), readings to 0.5 °C, and keeps reading for 2 minutes after switch-off. Results come out 5–9% high lagged and 20–35% high unlagged, as in class.
- **6.6:** observe-and-explain, so the Variables, Graphs and Calculate tabs became Iron Filings, Two Magnets (6.2, 6.7) and Magnetic Materials (6.2, 6.3, 6.5). The Experiment mode plots field lines dot by dot with a plotting compass; a line ends at a pole, at the edge of the card, or where the needle will not settle (the neutral point). The field lines appear only when the student presses Compare.
- **5.11P:** Experiment mode on `heating-curve.html`: crushed ice heated in a water bath, or stearic acid cooling; readings every 30 s, 1 or 2 minutes; a small picture of the apparatus with a live thermometer.
- **1.5 method types (Alex, 21 Oct 2026):** the Overview and Method tabs have a "Method type" switch (Stopwatch, Light gates, Video camera), shared by both tabs and remembered in the browser. The light gate and video camera methods follow the January 2014 4PH0 Paper 1P mark scheme (Q5, speed of a toy car at the bottom of a slope), which also accepts ticker tape and a motion sensor. A shared Sort ("Which method?") stays visible under every choice. Worth reusing on other practicals that have more than one accepted method.
- **Engine fix:** in `createPlot`, a point on the top gridline snapped to 1.2000000000000002 and was refused as off the graph. Fixed in `template/engine.js`; every practical rebuilt (Hooke's law changed by that one line only).
- **Published on 21 Oct 2026** at Alex's "go live", before his review: cards under Core Practicals, banners on the workout tabs (1a Measure v, Unit 5 Heating Curve and Specific Heat, Unit 6 Magnetic Field Patterns), "Core practical" tags on the animation cards, new cards for `ramp-motion.html` (Unit 1) and `specific-heat.html` (Unit 5), and the ramp animation framed in the 1a Measure v tab. The 1a, Unit 5 and Unit 6 workouts (and the practical template) now let a `#tab` link win over the tab remembered in the browser.

## Mark scheme wording check: published practicals

Waiting for the IGCSE Question Index and the 4PH1 mark schemes to be added to the project. Then check, in this order: 1.22 Hooke's law, 1.5 (light gate and video methods already from the January 2014 4PH0 mark scheme), 5.11P, 5.14P, 6.6.
