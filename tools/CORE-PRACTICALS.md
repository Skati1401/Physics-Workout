# Core practicals: tracker and how to build a batch

Alex wants every IGCSE physics practical built the way 1.22 Hooke's law was. Each batch is built in its own chat.

## The 1.22 model (Alex, 5 Nov 2026)

Every IGCSE practical page now follows `hookes-law-practical.html` as it stands on 5 Nov 2026 (the teaching-animations skill, "IGCSE practicals", has the details). This replaces the core route + Extra practice layout of 4 Nov.

- **One row of tabs**, in this order: Overview, Variables, Method, Accuracy, Do Experiment, Show Experiment, Results, Graph Analysis, Exam Qu Method, Exam Qu Analysis. No core route and no Extra practice: leave `core` and `coreMinutes` out of `page.json`.
- **Required on every page:** Method (with its Order), Variables, Do Experiment and Show Experiment. The other tabs are used only where the practical gives them real work, and one exam question tab (or none) is fine.
- **No Calculate tab** (equation drill belongs in the workout) and **no Plot on Results** (Do Experiment has the student's own plot). Questions that are not real predictions are Multiple choice.
- **Time:** students do Do Experiment or Show Experiment, not both, and may skip the exam tabs, so aim for about 40 minutes without them. Give the estimate per tab whenever a page changes (count a typed results table as about 4 minutes).
- **Choose the content from the papers:** list every Question Index part tagged with the practical's spec points (4PH1 papers from 2019 count most) and cover what is asked most.

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
   - Edit `page.json`: title, unit, links, tabs and spec badges (a badge ending in P makes that tab TA and adds the header's TA note automatically), plus `storeKey` and `accent`. Set `"draft": true`.
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
5. **Check the tabs and time** against "The 1.22 model" above, and run `check.py`.
6. **Review it critically**, using the skill's review list: numbers, wording, spec coverage, trims. Fix what you find before showing Alex.
7. **Push the draft** to `main` and send Alex its link: `https://skati1401.github.io/Physics-Workout/<slug>-practical.html`.
8. **Publish once Alex approves.**
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
| 3 | 2.23P | Charging insulators by friction | 153–155 | 2.22P, 2.24, 2.25, 2.26, 2.27, 2.28 | TA | new `electrostatic-charging.html` (Hanging rod, Paper bits, Water, Electroscope) | `electric-charge.html#charging` (framed, with the banner) | C | **published** (4 Nov 2026; Alex to review; mark scheme check done) |
| 4 | 3.17 | Refraction: rectangular, semicircular blocks, prisms | 156–162 | 3.14, 3.15, 3.16, 3.18, 3.21, 3.22 | | new `refraction.html` (shared with 3.19) | `light-and-sound.html#refraction` (3b; framed, with the banner) | C | **published** (4 Nov 2026; Alex to review; mark scheme check done) |
| 5 | 3.19 | Refractive index of glass | 163–166 | 3.14–3.18, 3.20, 3.21, 3.22 | | `refraction.html` (shared with 3.17) | `light-and-sound.html#refraction` (3b; second banner) | B | **published** (4 Nov 2026; Alex to review; mark scheme check done) |
| 6 | 3.25P | Speed of sound in air | 167–169 | 1.4, 3.23 | TA | new `speed-of-sound.html` (Direct, Echo, Two microphones) | `sound.html#speed` (3c, TA; framed, with the banner) | B | **published** (4 Nov 2026; Alex to review; mark scheme check done) |
| 7 | 3.27P | Frequency of sound with an oscilloscope | 170–173 | 3.24, 3.25, 3.26, 3.28, 3.29 | TA | new `oscilloscope.html` | `sound.html#pitch` (3c, TA; framed, with the banner) | C | **published** (4 Nov 2026; Alex to review; mark scheme check done) |
| 8 | 4.9 | Thermal energy transfer (conduction, convection, radiation) | 174–178 | 4.6, 4.7, 4.8, 4.10, 5.3 | | new `heat-transfer.html` (Conduction, Convection, Radiation) | `heat-transfer-igcse.html#practical` | C | **published** (2 Nov 2026; Alex to review; mark scheme check done 2 Nov 2026) |
| 9 | 5.4 | Density from mass and volume | 179–183 | 1.2 | | new `density.html` (Regular block, Irregular object, Liquid) | `density-pressure-state.html#density` | B | **published** (2 Nov 2026; Alex to review; mark scheme check done 2 Nov 2026) |
| 10 | 5.14P | Specific heat capacity | 184–187 | 5.12, 5.13 | TA | `specific-heat.html` (moved out of the Unit 5 Specific Heat tab, which now frames it) | `density-pressure-state.html#shc` | A | **published** (21 Oct 2026; Alex to review) |
| 11 | 6.6 | Magnetic field of a bar magnet | 188–189 | 6.2, 6.3, 6.4, 6.5, 6.7 | | `magnetic-field-patterns.html` (Experiment mode added) | `magnetism-and-motor-effect.html#fields` | A | **published** (21 Oct 2026; Alex to review) |
| 12 | 7.6 | Penetrating power of radiation | 190–192 | 7.4, 7.5, 7.9, 7.10, 7.16 | | new `penetrating-power.html` (a simulation, as the spec allows) | `radioactivity.html#radiation` (7a; framed, with the banner) | C | **published** (4 Nov 2026; Alex to review; mark scheme check done) |
| 13 | 2.9 | Current–voltage characteristics (wire, resistor, lamp, diode) | 193–196 | 2.10, 2.12, 2.13 | | `iv-characteristics.html` (built 2 Nov 2026, with Experiment mode) | `circuit-components.html#iv` (2c I–V Graphs tab) | B | **published** (3 Nov 2026; Alex to review; mark scheme check done 3 Nov 2026) |
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

**Done 2 Nov 2026** for all five published practicals (1.22, 1.5, 5.11P, 5.14P, 6.6), from the Model Answers sheet and Answer column of Alex's IGCSE Physics Question Index (mark scheme points already extracted there). Method steps, model answers, Exam tab and Overview reworded; every flagged Predict evened up so the right option is never the longest. New Exam parts are in our own words, never copied. No STORE_KEY changed.

- **1.22:** Jan 2022 P1 9(a), May 2026 P1 4(a), Nov 2021 P1 10(a), May 2018 P1 TZ1 2(b)(i), Jan 2022 P1 9(b)(iv), Jan 2023 P1 1(a). New Exam (e) spring method and (f) wire method.
- **1.5:** Jan 2014 P1 5, May 2019 P1 TZ2 7(a), May 2022 P1 11(a), May 2024 P1R 3(a)(ii), Nov 2023 P1 12(b)(i). New Exam (f) ramp-height method. The page's cloze now draws `[[ | ]]` fractions.
- **5.11P:** Nov 2020 P2R 6(b)(ii), Jan 2020 P2R 5(a), May 2021 P2 5(b)(ii), Nov 2021 P2 3(a), Nov 2023 P2 5(b)(iii), May 2024 P2 8(c)(ii), May 2026 P2R 5(a). Melting is "bonds weakened / broken, kinetic energy constant" (mark schemes reject KE changing while melting).
- **5.14P:** Nov 2023 P2 3(a), Nov 2024 P2 5(a), May 2023 P2 8(a), Jan 2023 P2R 6(a), May 2022 P2 7(a), May 2023 P2R 5(b)(ii). New "Metal block / Water" method switch on Overview and Method (water adds mass by difference, stirring, voltmeter and ammeter). New Exam (f) definition and (g) water method.
- **6.6:** Jan 2022 P1 1(d), May 2011 P2 2(a), May 2016 P2 TZ1 4(c), May 2019 P1 2(a), Nov 2025 P1 6(a)(ii), May 2021 P1 8(a), May 2024 P1 6(c), 6(d)(i), May 2025 P1R 2(b)(ii), May 2026 P1R 2(a)(i). New Exam (f) iron filings method. No method switch: the Iron Filings tab already covers it.

- **4.9** (2 Nov 2026, store `cp-heat-transfer-v2`): May 2025 P1R 4(a)(i), 4(a)(ii), 4(b)(ii); Nov 2024 P1 10(a)(iii), 10(a)(iv), 10(b)(ii); Nov 2023 P1 5(a), 5(b), 5(c)(iii); May 2024 P2 3(a), 3(b); May 2021 P1 6(a); Nov 2025 P1 11; Jan 2020 P1 6; May 2025 P2R 7(a), 7(b); May 2026 P1R 3(c); Jan 2022 P2R 7(b); Jan 2017 P1 13(a). Conduction Order now has the clamp stand, same depth, cool and repeat, mean time; new "Comparing absorbers: two cans" Order (equal volume, same start temperature, same distance from the heater, repeat and mean); new Conduction Predicts "Reading the times" (shortest time = best conductor) and "Bar chart or line graph?" (material is categoric); "same depth in the water" control; Accuracy gains stirring and the wooden (insulating) handle; Exam (f) notes that "particles expand" and "heat rises" score nothing, (g) splits shiny inner (poor absorber) and outer (poor emitter), new (h) conduction method and (i) cooling curve with a lid. No method switch: the conduction, convection and radiation experiments are separate tabs already.
- **5.4** (2 Nov 2026, store `cp-density-v2`): Jan 2020 P1R 8(a), May 2023 P1 6(b), May 2024 P1R 5(a), Nov 2025 P1 8(a), Jan 2023 P1R 8(c), May 2022 P1R 8(a)(i), May 2025 P1R 10(a)(i), May 2025 P2 1(a), Nov 2020 P1R 6(a), 6(b), May 2026 P1R 7(a)(i). The Irregular object method now has two Orders, measuring cylinder and eureka can (both accepted); "enough water to cover", "lower gently, no splashing", "weigh it dry first (a wet stone weighs more)"; tare option on the liquid method; sides measured in two or three places; set squares added to the Match (round objects); Accuracy gains a level cylinder and a level, zeroed, draught-free balance; Exam (d) adds "let the liquid run down", (e) is now 5 marks with repeat and mean and the eureka can, new (g) measuring the mass accurately.
- Both pages' STORE_KEYs were bumped (activities were added inside tabs, and saved answers are matched by position), so answers saved before this are cleared; the open tab carries over.

Batches B and C do this check while they build (step 4 above).

## Notes from 4.9 and 5.4 (2 Nov 2026)

Built ahead of their batches, as drafts (noindex, no cards, no banners, no "Core practical" tags yet). Spec numbers checked against the 2017 4PH1 spec PDF Alex uploaded. The guide pages (PDF 174–183) and the mark scheme wording check were done afterwards (2 Nov 2026, see above).

- **4.9** `heat-transfer-practical.html` (store `cp-heat-transfer-v1`), 10 tabs: Overview, Method, Variables, Conduction, Convection, Radiation, Results, Insulation, Accuracy, Exam. New animation `animations/heat-transfer.html` with three parts (`?show=cond|conv|rad`), each framed once in its own tab.
  - Conduction: copper, aluminium, iron and glass rods in 90 °C water, wax melts at 50 °C, pins 11 cm along: drop at about 1:37, 1:52, 11:00, glass still on at 15 min. Experiment mode records the stopwatch times.
  - Convection: permanganate crystal, heat under the crystal, in the middle, or at the top (no current). Experiment mode marks the dye front, then Compare shows the current.
  - Radiation: Leslie cube with a draggable infrared detector (4.0, 3.4, 2.7, 0.4 mV at 10 cm, matt black to shiny silver; a moved detector is flagged as unfair), and two cans by a radiant heater (black about 36.5 °C, shiny about 25.0 °C after 10 min) plotted × and ○.
- **5.4** `density-practical.html` (store `cp-density-v1`, method switch `cp-density-method`), 9 tabs: Overview, Method, Variables, Experiment, Results, Graphs, Calculate, Accuracy, Exam. Spec badges 5.1, 5.3, 5.4 (1.2 left out: it is a TA units point that does not apply). New animation `animations/density.html` with three parts (`?show=reg|irr|liq`).
  - Regular block: ruler 0.1 cm and balance 0.1 g; Experiment mode measures five blocks of one material and plots m against V (gradient = density). Mystery block is Perspex (1.18 g/cm³).
  - Irregular object: stone (2.70 g/cm³) or plasticine, measuring cylinder or eureka can (catches 0.4 cm³ less: drops left in the spout), drag the object into the water; eye-level meniscus close-up.
  - Liquid: cylinder (74.6 g) on the balance, 10 or 20 cm³ at a time; water, oil 0.92, salt water 1.15, mystery glycerol 1.26; total mass against volume, gradient = density, intercept = cylinder.
- **Published on 2 Nov 2026** at Alex's request, before his review and before the mark scheme check: practical cards under Core Practicals, animation cards in `animations/igcse.html` (Unit 4 and Unit 5, with "Core practical" tags), `.cp-banner` and the framed animation on `heat-transfer-igcse.html#practical` (which gained `frameAct` and the frame-height listener) and `density-pressure-state.html#density`.

## Notes from 3.25P (4 Nov 2026)

Built as a draft on branch `cp-sound` (not merged): `speed-of-sound-practical.html` (store `cp-speed-of-sound-v1`, method switch `cp-speed-of-sound-method`), 9 tabs as in the model. Spec badges from the 4PH1 Unit 3 spec points: 3.25P with 1.4 and 3.23, plus 3.26P (oscilloscope and microphone) on the Method and Calculate tabs because the two-microphone method uses it.

- **Workout (4 Nov 2026):** the animation is now framed in 3b `sound.html#speed`. When the practical is published, add its workout link and the `.cp-banner` on that tab.
- **Animation** `animations/speed-of-sound.html` (new; `?show=direct|echo|mics` opens one part), with a d–t graph beside the scene (theory line for sound, and a line up the distance axis for light, in Watch mode):
  - Direct: Ali bangs wooden blocks above his head; Sophie (draggable, 50–400 m) starts on the flash and stops on the bang. 340 m/s; reaction to a sight 0.21 ± 0.03 s, to a sound 0.17 ± 0.03 s, so the stopwatch reads about 0.04 s short and the delays never cancel exactly (seeded, so the same setup gives the same timings). Watch mode plays at ¼ speed.
  - Echo: Ali and Sophie (draggable, 20–150 m) in front of a wall; the reflected rings are centred on the mirror image. Experiment times 1 echo (hear clap, hear echo) or 20 echoes (clapping in rhythm, ±1.2% rhythm error, 21 claps on fast forward).
  - Two microphones: hammer and plate, microphone B draggable 0.20–1.50 m from A, dual-trace oscilloscope at 0.5 ms/div triggered by A; Δt read to 0.05 ms with no reaction time.
  - Experiment mode: three timings at each distance, table with the mean, speed = distance / mean time for that distance, and after 4 distances a best-fit line whose gradient (read at two points on the line) is the speed. In the direct method the line misses the origin, and the note says why.
- **Mark scheme wording check** (from the IGCSE Question Index Model Answers and Answer columns, speed-of-sound parts only): Jan 2022 P2R 3(a), 3(b)(iii); May 2019 P2 TZ1 3(a); May 2022 P2R 2(a); Jan 2021 P2R 4(b); Nov 2020 P2R 4(a)(i), 4(a)(ii); Nov 2024 P2 8(a)–(d); May 2024 P2R 7(a), 7(b)(iv); May 2021 P2 2(a), 2(c), 2(d); May 2015 P1 TZ1 13(b); May 2014 P2 TZ2 3(b)(i)–(iv); May 2012 P1 9(b); Jan 2012 P1 7(b)(iii); Nov 2010 SS 16(b)(i); Nov 2005 SS 10(d). Scoring phrases used: at least 100 m (clap) / 50 m (echo) / about 1 m (microphones); trundle wheel or tape measure, not a metre rule; start on seeing, stop on hearing; repeat and mean; several timers; echo distance is there and back; time 20 echoes; speed = distance / time, or the gradient of a distance–time graph; two microphones and an oscilloscope (time too short for a stopwatch). The "Method type" switch (Direct, Echo, Two microphones) is on Overview and Method, as the mark schemes accept all three. The v = fλ method (May 2022 P2R) and speed against temperature (Nov 2020 P2R, Jan 2016 P2) were left out.
- The guide pages (PDF 167–169) were taken from the key points in the batch brief (the Project doc was not readable from this session): visible and audible signal, ≥ 100 m, trundle wheel, several timers, reaction times need not cancel, light taken as instant, echo by clapping in rhythm or timing 20+ claps, two microphones with a storage oscilloscope.

## Notes from 2.9 (3 Nov 2026)

- `iv-characteristics-practical.html` (store `cp-iv-characteristics-v1`), built with gen.py from `practicals/iv-characteristics/`, published with the Unit 2 workouts (card under Core Practicals, `.cp-banner` on `circuit-components.html#iv`). The animation already had its "Core practical 2.9" tag.
- Spec badges from the 4PH1 spec PDF: 2.9 with 2.10, 2.12, 2.13.
- The method uses a variable resistor and reversing the connections (the usual mark scheme method); the animation uses a potentiometer across one 6 V battery, with a "Reverse the battery" button for the negative readings (Alex, 3 Nov 2026).
- Guide pages (PDF 193–196) and mark scheme wording check done later on 3 Nov 2026 (store `cp-iv-characteristics-v2`). Mark schemes used (from the IGCSE Question Index Model Answers and Answer columns): 4PH1 1P May 2019 TZ1 Q6(a)(ii) and 1PR May 2023 Q6(b) (method: repeat and average, switch off, vary with the variable resistor), 1P May 2023 Q2(b)(i) (current increases at a decreasing rate; reject proportional), 1PR May 2023 Q6(c), 1PR Jan 2023 Q4(c)(ii) and 4PH0 1P May 2014 Q12(b)(ii) (lamp heating, collisions), 4PH0 1PR May 2013 Q10(b)–(c), 1P Jan 2017 Q5(b), 1P Jan 2015 Q10(b)(iv) (constant temperature: water bath, small currents, switch off; R–V horizontal line), 1P May 2023 Q2(a) and 1P Nov 2020 Q5(a) (variable resistor or variable supply). Guide: a wire long enough not to overheat. The same check was run on 2a, 2b and 2c (fuse, earth wire, circuit breaker, heating effect, charging by friction).

## Notes from 3.17 and 3.19 (4 Nov 2026)

Built together as drafts on branch `cp-light` (noindex, no practical cards on `igcse.html`). Spec numbers from the official 4PH1 Unit 3 list (neither is TA).

- **One animation, `animations/refraction.html`**, for both practicals: a ray box on a sheet of paper, seen from above. Blocks: rectangle, semicircle (ray in through the curved side, aimed along a radius at the centre of the flat face, or in through the flat side), 60° prism, 45° prism (in through a short side or the long side). Glass n = 1.50 (c = 41.8°); white light uses seven colours, red 1.490 to violet 1.530. The ray box is dragged round the paper (or the slider, or arrow keys); normals, angle arcs, an optional 360° protractor and the weak partial reflection (Fresnel, so the refracted ray fades and the reflection brightens near c). Play turns the ray box from the current angle to the largest (7°/s) and stops. Fixed points per block (e.g. Below c / At c / Above c).
  - Experiment mode: each reading is traced as in class: two crosses on each ray, the block lifted, the crosses joined through the outline, the normal drawn, and the angles read off a protractor to 1° with a small fixed reading error (never out of order). Rectangle and semicircle flat side: i, r, sin i, sin r table and a sin i–sin r graph; done at 5 or more angles from 30° or less to 60° or more, then a best-fit line through the origin and n = gradient (1.49–1.51). Semicircle curved side: angle in glass and in air (or TIR); done once refraction and TIR are found within 2°, then c between them and n = 1/sin c. Prisms: "Trace the ray" records i, what happens at the next face and how far the ray turned, and ticks off observations (60°: refracts out, TIR, dispersion with white light; 45°: turned 90° through a short side, 180° through the long side).
  - Card under a new "Unit 3 Waves" heading on `animations/igcse.html` (new `waves` colour pair), with one tag "Core practicals 3.17 and 3.19" (two tags would copy the card twice into Core Practicals).
- **`refraction-practical.html`** (3.17, store `cp-refraction-v1`), 9 tabs: Overview, Method, Experiment, Rectangular, Semicircular, Prisms, Calculate, Accuracy, Exam. Observe-and-explain, so no Variables, Results or Graphs tabs; the block tabs cover 3.14, 3.15 (the weak reflection), 3.16, 3.20, 3.21 and 3.22.
- **`refractive-index-practical.html`** (3.19, store `cp-refractive-index-v1`), the 9-tab measure-and-plot pattern: Overview, Method, Variables, Experiment, Results (table of sines, plot, best fit, anomaly), Graphs (two materials; sin r against sin i, gradient = 1/n), Calculate, Accuracy, Exam.
- Unit 3 has no workout yet, so neither page has a workout link or a `.cp-banner`; each header links to the animation and to the other practical. Add the banners when the Unit 3 workouts are built.
- Guide: the key points from PDF pages 156–166 (ray box or LED, crosses far apart, angles inside the block from the normal, aim at the centre of the flat face, sin c = 1/n, prisms for dispersion and TIR, sin i against sin r with gradient n ≈ 1.5, r increases at a decreasing rate).
- **Mark scheme wording check** (from the IGCSE Question Index Model Answers and Answer columns for 3.14–3.22): method and data for 3.19: Jan 2022 P1R 7(a), Jan 2020 P1R 10(b)(i), 10(b)(iv), Nov 2024 P1 6(a), Nov 2021 P1 6(a), 6(c), Jan 2021 P1 9(a)(v), May 2022 P2R 6(a)(i), 6(a)(iii), May 2018 P1 TZ2 4(c)(ii), Jan 2015 P1 11(b), Jan 2012 P1 4(c)(ii), May 2014 P2 TZ1 6(a)(iii), 6(b), May 2016 P1 TZ2 7(a), 7(c)(ii), May 2012 P2 5(c), Nov 2010 SS 15(b)(iii), Nov 2010 Prac 3(b), 3(d), Jun 2005 SS 12(a)(i); 3.17 and TIR: Nov 2020 P1 8(b)(ii), Jun 2007 SS 14(b), May 2019 P1 TZ1 7(c)(i), Nov 2024 P1 6(b)(iii), Jan 2013 P1 2(b)(ii), Jan 2023 P1 6(c), May 2025 P1R 7(b)(ii), Jan 2022 P1R 7(b), May 2015 P1 TZ1 12(a)(ii), Jan 2021 P1 9(b), Nov 2025 P1 10(c)(iii), May 2016 P1 TZ1 7(c)(ii), Jun 2006 Prac 2, May 2012 P1 2(b), Jan 2017 P1 11(b). Wording matched: "thin beam (ray box or laser)", "draw round the block", "mark the incident and refracted rays", "draw normals", "measure angles from the normal with a protractor", "range of angles of incidence", "plot sin i against sin r, n = gradient" (1/n with the axes swapped), "bald repeat and average does not score", TIR as "glass to air (higher to lower refractive index), i greater than c". All exam parts are our own.


## Notes from 2.23P, 3.27P and 7.6 (4 Nov 2026)

Built and published together at Alex's "push them live" (batch C, except 3.17 and 4.9, done earlier). Spec numbers checked against the 4PH1 spec point list in Alex's IGCSE Spec Analysis folder (`_scripts/question_index/spec_points.json`): 2.22P–2.28P, 3.24P–3.29P (plus 3.6, f = 1/T, on the 3.27P Reading Traces, Calculate and Exam tabs), 7.4, 7.5, 7.6, 7.9, 7.10, 7.16. Observe-and-explain, so each page swaps the Results/Graphs/Calculate tabs for topic tabs (see each `content.js` header).

- **2.23P** `charging-practical.html` (store `cp-charging-v1`). Animation `animations/electrostatic-charging.html`: polythene (−), acetate (+), a metal rod held in the hand (electrons flow to earth) or an unrubbed rod; tests: a hanging rubbed rod in a paper stirrup (seen from above), paper bits, a water stream (induced charge), a gold-leaf electroscope, uncharged or charged negative (rises further / falls tells the type). Experiment mode hides the charges and withholds the conclusion until all four hanging-rod pairs are recorded. Framed first in `electric-charge.html#charging`, with the `.cp-banner`.
- **3.27P** `sound-frequency-practical.html` (store `cp-sound-frequency-v1`). Animation `animations/oscilloscope.html`: signal generator (100–2000 Hz) or forks 256/384/512 Hz, draggable microphone, time base 0.1–5 ms/div, Y-gain 5–50 mV/div, trigger (drifting trace when off), optional WebAudio tone. Experiment mode: forks A 320, B 440, C 640 Hz and a hidden 750 Hz tone; two cursors (drag, or keys 1/2 and ←→), number of cycles, three readings, then the mean and the stamped value.
- **7.6** `penetrating-power-practical.html` (store `cp-penetrating-power-v1`). Animation `animations/penetrating-power.html`: Am-241 alpha, Sr-90 beta, Co-60 gamma, mystery X (alpha + gamma) and Y (beta + gamma); paper, 5 mm aluminium, 2 cm lead; GM tube dragged 1–20 cm (alpha range about 5 cm); seeded Poisson counts in 1 minute (shown 20 × faster); background 24 per minute. Experiment mode needs three background counts first and shows corrected counts.
- The Unit 3 and Unit 7 workouts arrived from another chat the same day, so the animations are framed first in `sound.html#pitch` (3c) and `radioactivity.html#radiation` (7a), each with the `.cp-banner`, and the practical headers link there. Their cards show Draft, as Units 2, 3 and 7 are draft units.
- **Mark scheme wording check** (IGCSE Question Index, Model Answers sheet and Answer column):
  - 2.23P: May 2019 P2 TZ2 3(a)(ii), 3(b); May 2023 P2R 3(a), 3(b)(ii); Nov 2020 P2R 1(a)(i), 1(a)(iv), 1(b)(ii); May 2024 P2 4(a)(i), 4(b)(iv); May 2014 P2 TZ1 2(a), 2(c); Jan 2023 P2R 3(b); May 2021 P2 3(b), 3(c); May 2025 P2 5(b); May 2025 P2R 1(a)(i), 1(b); May 2026 P2 5(a); Nov 2024 P2 2(a); Jan 2020 P2 4(c); Nov 2021 P2 7(a), 7(b); Jan 2021 P2 8(a). Phrases used: rub with a (dry) cloth, another insulator; suspend so it can swing freely; bring close, without touching; both attraction and repulsion seen; paper / water stream / hair attracted, electroscope leaf rises (repulsion only with an electroscope); electrons transferred, reject protons or positive charge moving; earthed: charge flows to earth, no charge builds up, no spark; paint drops repel, even coat.
  - 3.27P: Jan 2020 P2 5(a); May 2022 P2 4(b)(ii); May 2026 P2 6(b)(i); May 2026 P2R 8(b); Nov 2021 P2 8(a)(ii); Nov 2025 P2 4(a); plus the trace-reading, hearing-range and pitch/loudness parts (e.g. Jan 2023 P2 7(b)(iii), May 2025 P2 2(c)(ii), Jan 2021 P2 1(c), May 2012 P2 2(a)). Phrases used: connect a microphone; steady trace; adjust the time base to show at least one (several) complete cycles; count squares for a number of complete cycles; multiply by the time base for T; f = 1/T; unqualified "repeat and average" scores nothing.
  - 7.6: Nov 2020 P1 10(b); May 2023 P1R 7(b)(ii), 7(b)(iv); Jan 2023 P1 4(a)(ii), 4(c); Jan 2020 P1 9(c), 9(e)(iii); Jan 2022 P1R 1(c); May 2015 P1 TZ2 12(b); May 2014 P1 TZ1 4(b)(iii); Jan 2016 P1 7(c); Jan 2018 P1 13(b)(i); May 2012 P2 8; Nov 2024 P1 4(b) and the 7.16 precaution parts. Phrases used: GM tube and counter; background with the source removed, repeated, mean, subtracted; count drops sharply with paper (alpha), stopped by aluminium (beta), reduced by lead (gamma); thickness and distance are control variables; tongs, distance, short time, shielding.

- **Published 4 Nov 2026 (later)** at Alex's "publish all": 3.17, 3.19 and 3.25P (`"draft": false`, cards under Core Practicals in spec order, workout links in their headers, banners on 3b Refraction (two, one per practical) and Speed of Sound). All 14 IGCSE practicals are now published.
