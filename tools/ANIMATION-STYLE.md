# Animation style: the motor and generator model (10 Nov 2026)

Alex wants every teaching animation good enough to teach from on a projector. `animations/dc-motor.html` and `animations/ac-generator.html` are the model (Alex, 10 Nov 2026: "use it as the model", with the label rule below). The batches are in `TODO.md`, section 8. Alex calls one up by number ("do animation batch 3").

## What a batch chat does

1. Read `CLAUDE.md`, this file, and the two model pages. Load the `teaching-animations` and `interactive-revision-lab` skills.
2. For each page in the batch: open it at 1366×657 and at phone width, play it, and judge it against "The standard" below.
3. Rebuild or restyle what falls short and push straight to `main` (Alex, 10 Nov 2026). **Ask Alex first only where there is a real choice** (two sound ways to show the physics, dropping a feature, a different kind of animation altogether): one question, options one line each, recommendation first.
4. A page that is already at the standard is left alone; say so in the report.
5. Never change the physics, readings, notes, working, `?embed`, `?show=` or `?level=` behaviour unless it is wrong. If something is wrong, fix it and say so plainly in `tools/REVIEW.md`.
6. Run the checks below. Set each changed page's row in `tools/REVIEW.md` to "🔍 To review" with what to look at. Tick the batch in `TODO.md`.
7. Report to Alex: one line per page (left alone, restyled, redrawn, or what you asked), with two or three screenshots.

Another chat may be pushing to the repo: `git pull --rebase` before every push, and one batch per page at a time.

## The standard

- **The picture is the apparatus, drawn as a solid object.** Blocks with a lit top, a front and a darker side; round wires with a lighter streak; real parts (brushes, rings, clamps, meters) where the old page had a symbol or a caption. No flat outline boxes standing in for equipment.
- **Show the exam diagram beside it.** Where the exam uses a flat diagram of the same thing (end-on coil with dot and cross, circuit diagram, ray diagram, graph), show it next to the picture at the same moment, not behind a switch.
- **One wide picture.** `viewBox` about 860×350, so the picture fills the left column of the stage card at 1366×657. Under 520px wide the same `draw()` switches to a tall `viewBox` (430 wide) with the parts stacked, and the SVG gets class `tall` (no height cap).
- **Things that move in the physics move in the picture.** Current is shown by small arrowheads travelling along the wire, + to − (`flowMarks`, colour `--cur`); they stop when the current stops and turn round when it reverses. Meter needles follow the reading.
- **Colour carries meaning and repeats.** N red, S blue (solid, white letter), field teal, force orange, current purple. Two parts that must be told apart get two colours and keep them everywhere they appear (coil side A copper, side B grey, and the same colours on their ring halves, slip rings and end-on symbols).
- **Labels never lie over the picture (Alex, 10 Nov 2026).** Put each label in clear space next to the part it names, with a short leader line and a panel-coloured halo (`txt(…,{halo:1})`). Labels that move with a part (A, B) sit where nothing else is drawn. Check every position of a full cycle, not one frame.
- **Text is readable from the back of a room:** 12–14 in `viewBox` units for labels, never under 11.
- **Predict on the picture, then Go (Alex, 10 Nov 2026).** Where a rule gives a direction or a position (Fleming's left-hand rule, induced current, which way a ray bends, where the image forms), the page has a question mode: a button deals a question in the diagram, the student clicks on the diagram where or which way they think (an arrow, a spot, a pole), then presses Go and the animation shows what really happens and marks the click. No row of answer buttons under the picture when the answer can be given on the picture itself.
- **Build it yourself where the exam asks for it (Alex, 10 Nov 2026).** Circuit pages deal a task ("Make a circuit that measures the current in the lamp and the p.d. across it"), let the student add the ammeter and the voltmeter themselves (drag or click into place), and on Go show it working, or what goes wrong when a meter is in the wrong place.
- Everything in `CLAUDE.md` still holds: fits one laptop screen, buttons under the picture, drag the objects, Experiment toggle, dark mode, reduced motion, no capitals-only text.

## The 3D kit

Both model pages carry the same block of drawing code, marked `3D kit`: `scene3` (camera, back-to-front sorting, `seg`, `tube`, `box`, `poly`, `head`), `rig3` (magnet, coil, split ring or slip rings, brushes, circuit, cell or meter), `endOn`, `flowMarks`, `tri`, `keyRows`, `poleRect`, `wireEnd`. Copy the block into another page and call what you need; pages stay self-contained. A fix to the kit goes into every page that has it (search for `3D kit`).

- Axes: X right, Y away from you, Z up. The camera looks from the front, 14° from the right and 30° from above, so the poles never hide the coil.
- Colour tokens the kit needs (copy all three theme blocks from `dc-motor.html`): `--north-f/-t/-s`, `--south-f/-t/-s`, `--copper-hi`, `--coilb`, `--coilb-hi`, `--cur`, `--insul`, `--brush-t/-f/-s`.
- Directions: `c` is the current in side A (+1 towards you, a dot in the end-on view); `sig` is +1 when the current leaves the coil through the right-hand brush. The split ring is at the front of the coil, so with N on the left and + on the left brush, side A on the right carries current towards you and is pushed up. Work the direction out from F = I l × B or v × B for every new case; do not copy a sign from another page.

## The bench kit and the Predict tab (batch 3, 10 Nov 2026)

`magnet-and-coil.html`, `transformer.html` and `national-grid.html` carry a second small block, marked `bench kit`, for apparatus that is not the motor rig: `caseBox` and `meterBox` (a solid bench meter with a scale, a needle and terminals on top or on its left side; `meterGeom`, `meterPt` and `meterWedge` give its geometry), `pl`, `pg`, `pathLen`, `wrapLines`, `onPick` and `setKeepFocus`. They also carry only part of the 3D kit (`tri`, `flowMarks`, `scene3`). A fix goes into every page that has the block.

- **Predict is a tab beside Explore** at the top of the right-hand column ("Explore | Predict", then the level switch if the page has one). In Predict the setup controls are hidden, a question is dealt, and the buttons under the picture are Go (or Switch on) and New question.
- **The things to click are in the picture**, each a `<g class="pick" data-pick="…" tabindex="0" role="button">` with a `.ring` shape for the keyboard focus outline; `onPick(svg, fn)` handles click, Enter and Space. Draw them in their own group and redraw it with `setKeepFocus`, only when the question changes, so a redraw of the moving picture never drops the focus.
- **Nothing gives the answer away before Go:** hide theory curves, readings and working until the run is marked. The question is also written in the picture, in clear space, with the verdict (✓ or ✗ and the answer in words) in the same place afterwards.
- **Current in a hidden part of a wire:** cut the path into pieces, mark which can be seen, and give `flowMarks` each visible piece with the phase less the length before it, so the arrowheads keep step along the whole wire. To turn the arrowheads round, reverse the pieces and use the total length less the phase.

## Checks before pushing

1. `node --check` on the page's scripts (CLAUDE.md, "Check before you commit").
2. `python3 tools/anim-check.py page.html "page.html?show=x"` with a server on port 8765: errors, one-screen fit, sideways scrolling, clipped or overlapping picture text, at three sizes, pressing every button.
3. Screenshots at 1366×657, phone width and dark mode; look at them. The script cannot see a label lying over a drawn object.
4. The workout tab that frames the page: frame height equals the inner page's height, at laptop and phone width.
5. Physics: for each direction the page shows, check one case by hand against the rule.

## Starting a batch in a new chat

> Do animation batch N from `TODO.md` section 8 in the physics-workout repo (`Skati1401/Physics-Workout`), following `tools/ANIMATION-STYLE.md`.
