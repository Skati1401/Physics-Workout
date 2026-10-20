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
3. **Test** as in the skill's "Verification before publishing":
   - Click every tab, and check there's no sideways scroll at 380px.
   - Answer every graded activity in Playwright.
   - Run the Experiment for every case, in both directions.
   - Check the stage card fits 1366×657.
   - Serve the folder on localhost so the frames can be measured.
4. **Review it critically**, using the skill's review list: numbers, wording, spec coverage, trims. Fix what you find before showing Alex.
5. **Push the draft** to `main` and send Alex its link: `https://skati1401.github.io/Physics-Workout/<slug>-practical.html`.
6. **Publish once Alex approves.**
   - Set `"draft": false` and rebuild.
   - Add its card under "Core Practicals" in `igcse.html`, in spec order, with a TA tag if needed.
   - Add the `.cp-banner` to its workout tab's heading line, copying the one in `forces-momentum-moments.html#hooke`. If that workout can't open a tab from `#tab`, add hash support as in the 1b page. Units 2, 3 and 7 have no workouts yet: skip the banner and note it below.
   - Add a "Core practical x.xx" tag on the animation's card in `animations/igcse.html`.
   - Update the status in this table.

## The practicals

The guide's PDF pages are those of the PDF Alex shared; in the Project doc, look for the "---- PDF page N ----" markers. The linked spec points are as the guide lists them (2017), so check the P suffixes against the current spec.

| # | Spec | Practical | Guide PDF pages | Spec points it links to (guide) | TA | Animation | Workout tab | Batch | Status |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 1.5 | Motion of everyday objects (toy car, tennis ball) | 143–148 | 1.6, 1.7, 1.8, 1.10, 1.21 | | extend `motion-graphs.html` or a new ramp animation (decide in the batch) | `forces-and-motion.html` (Measure v or v–t Graph tab; that page has no hash support yet) | A | to do |
| 2 | 1.22 | Extension of springs, wires, rubber bands | 149–152 | 1.18, 1.23, 1.24 | | `hookes-law.html` | `forces-momentum-moments.html#hooke` | done | **published** (the model) |
| 3 | 2.23P | Charging insulators by friction | 153–155 | 2.22P, 2.24, 2.25, 2.26, 2.27, 2.28 | TA | new | none yet (Unit 2) | C | to do |
| 4 | 3.17 | Refraction: rectangular, semicircular blocks, prisms | 156–162 | 3.14, 3.15, 3.16, 3.18, 3.21, 3.22 | | new (can share a light-box animation with 3.19) | none yet (Unit 3) | C | to do |
| 5 | 3.19 | Refractive index of glass | 163–166 | 3.14–3.18, 3.20, 3.21, 3.22 | | new (light box, shared with 3.17) | none yet (Unit 3) | B | to do |
| 6 | 3.25P | Speed of sound in air | 167–169 | 1.4, 3.23 | TA | new | none yet (Unit 3) | B | to do |
| 7 | 3.27P | Frequency of sound with an oscilloscope | 170–173 | 3.24, 3.25, 3.26, 3.28, 3.29 | TA | new | none yet (Unit 3) | C | to do |
| 8 | 4.9 | Thermal energy transfer (conduction, convection, radiation) | 174–178 | 4.6, 4.7, 4.8, 4.10, 5.3 | | new (check the 4b workout's Practicals tab for sims to move out) | `heat-transfer-igcse.html#practical` | C | to do |
| 9 | 5.4 | Density from mass and volume | 179–183 | 1.2 | | new | `solids-liquids-gases.html#density` | B | to do |
| 10 | 5.14P | Specific heat capacity | 184–187 | 5.12, 5.13 | TA | move the sim out of the Unit 5 Specific Heat tab into `animations/specific-heat.html` | `solids-liquids-gases.html#shc` | A | to do |
| 11 | 6.6 | Magnetic field of a bar magnet | 188–189 | 6.2, 6.3, 6.4, 6.5, 6.7 | | extend `magnetic-field-patterns.html` | `magnetism-and-electromagnetism.html#fields` | A | to do |
| 12 | 7.6 | Penetrating power of radiation | 190–192 | 7.4, 7.5, 7.9, 7.10, 7.16 | | new (a simulation is acceptable for the real practical too) | none yet (Unit 7) | C | to do |
| 13 | 2.9 | Current–voltage characteristics (wire, resistor, lamp, diode) | 193–196 | 2.10, 2.12, 2.13 | | new (the kit demo is a start) | none yet (Unit 2) | B | to do |
| 14 | 5.11P | Temperature–time graph for melting ice | 197–200 | 5.8, 5.9, 5.10 | TA | extend `heating-curve.html` | `solids-liquids-gases.html#heating` | A | to do |

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
