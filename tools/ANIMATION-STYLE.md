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
- **Colour carries meaning and repeats.** N red, S blue (solid, white letter), field teal, force orange, current purple. Field lines drawn on a mid-grey object (an iron core) are bright with a dark edge (`--fld` over `--fld-edge`, as in `transformer.html`), because plain teal does not show on grey; a stronger field has more lines. Two parts that must be told apart get two colours and keep them everywhere they appear (coil side A copper, side B grey, and the same colours on their ring halves, slip rings and end-on symbols).
- **Labels never lie over the picture (Alex, 10 Nov 2026).** Put each label in clear space next to the part it names, with a short leader line and a panel-coloured halo (`txt(…,{halo:1})`). Labels that move with a part (A, B) sit where nothing else is drawn. Check every position of a full cycle, not one frame.
- **A wave or a pattern of particles is drawn flat, in the exam diagram (Alex, 10 Nov 2026).** In the 3D kit's camera a flat sheet of dots slopes away from the apparatus and reads as wrong perspective (the loudspeaker's air did). Draw it straight on, in line with the part that makes it, and label its features as they travel (`air()` in `loudspeaker.html`: compressions, rarefactions, one wavelength).
- **Text is readable from the back of a room:** 12–14 in `viewBox` units for labels, never under 11.
- **Predict on the picture, then Go (Alex, 10 Nov 2026).** Where a rule gives a direction or a position (Fleming's left-hand rule, induced current, which way a ray bends, where the image forms), the page has a question mode: a button deals a question in the diagram, the student clicks on the diagram where or which way they think (an arrow, a spot, a pole), then presses Go and the animation shows what really happens and marks the click. No row of answer buttons under the picture when the answer can be given on the picture itself.
- **Build it yourself where the exam asks for it (Alex, 10 Nov 2026).** Circuit pages deal a task ("Make a circuit that measures the current in the lamp and the p.d. across it"), let the student add the ammeter and the voltmeter themselves (drag or click into place), and on Go show it working, or what goes wrong when a meter is in the wrong place.
- **Numbers in the reading boxes sit level (Alex, 10 Nov 2026).** `.stat` is a column (`display:flex;flex-direction:column;justify-content:space-between`), so the number is on the bottom line of every box whether its label takes one line or two. Every animation page has this; keep it when a page is rebuilt.
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

## Picture extras: the left hand, picks and hidden wires (batch 2, 10 Nov 2026)

`motor-effect.html` and `loudspeaker.html` carry a block marked `picture extras`; `motor-effect.html` also has `scene3` from the 3D kit. A fix to the picks goes into both pages. (`loudspeaker.html` shows only the flat exam diagram: Alex had its 3D cut-away speaker removed on 10 Nov 2026, so it keeps the picks but not `scene3`, `hand3`, `hiddenBy` or `flow3`.)

- **`hand3(cx, cy, k, f, s, t, o)` draws a solid left hand** for Fleming's left-hand rule in the kit's camera: `f`, `s` and `t` are unit vectors along the field, the current and the force, and the hand's arrows carry one word each (Field, Current, Force or Motion); `handKey` adds the key naming the fingers. Because t = s × f, the hand cannot be drawn the wrong way round. Show it only once the answer is known. It needs the `--hand`, `--hand-hi` and `--hand-sh` colours. Never mirror a picture to change the view: a mirrored left hand is a right hand.
- **Picks:** `ghost` (a dashed arrow), `ghostSym` (a dot or a cross) and `pickG` (anything else, such as a pole) make `<g class="pick" data-k="…">` targets; `wirePicks(svg, fn)` handles click, Enter and Space; `setSvg` redraws a picture and keeps the keyboard's place; `badge` puts the tick or cross on the pick after Go. Their CSS is the `.pick` block.
- **Hidden wires:** list the solid blocks as `[x0,x1,y0,y1,z0,z1]`; `hiddenBy(p, solids)` says whether a point is behind one. Draw the blocks first, back to front, then only the pieces of wire that can be seen (`vseg` in `motor-effect.html`), and give `flow3` the same test so no current arrow shows through a magnet.
- **Three sets of apparatus for the motor effect (Alex, 10 Nov 2026):** a straight wire between two poles (field across, force up or down), a rod on rails and a wire swing (U-shaped magnet on its side, field vertical, force sideways). Explore starts on the straight wire and has a switch. Practise no longer uses them (see the next point).
- **A question's picture never changes (Alex, 10 Nov 2026).** In `motor-effect.html` each Practise question is one exam-style diagram, drawn alone; it stays as dealt through the pick and through Go, which runs that same diagram (field lines and the force arrow appear, the wire or particle moves) and marks the pick. The left hand for the question appears beside the explanation in the right-hand column, not in the picture. No cell in a question: the current is a dot or a cross with the words beside it, or arrowheads on the wire. The page's block marked `Practise kit` holds the engine (`quiz`), the pick helpers (`arrowSet`, `cbox`, `boxes`) and one object per kind of question (`W1` to `W6` for the wire, `P1` to `P6` for charged particles); the kinds were chosen from the Edexcel IGCSE past papers (project doc `claude/motor-effect-feedback-2026-11-10.md`). An SVG element has no `.hidden` property: show and hide one with the `hidden` attribute.
- `motor-effect.html` keeps its older tab names, Explore and Practise (batch 3's pages use Explore and Predict); both of its parts, the wire and charged particles, have the switch.

## The solid kit (batch 9, 10 Nov 2026)

`roller-coaster-energy.html`, `heat-transfer.html`, `density.html`, `liquid-pressure.html` and `reaction-time.html` carry one identical block, marked `solid kit`, for bench apparatus that needs no camera: everything is drawn straight on, with depth going up and to the right. A fix goes into every page that has the block.

- `box(x, y, w, h, dx, dy, col)`: a solid block with a lit top, a plain front and a darker side (benches, bases, bars of a chart). `tube` is a round bar with a streak of light, `cyl` an upright cylinder (a can), `ell`, `pg`, `pl`, `ln`, `rect` the plain shapes, `arrow` a solid arrow.
- `thermo(x, yb, y0, t0, y1, t1, T, o)`: a glass thermometer whose scale can be read: ticks and numbers stand beside the stem, in clear space. Give it enough length for about 2 px per degree, and repeat the reading as text only where the scale is too coarse to read to the precision asked for.
- `stopwatch(x, y, text)` for any run that is timed. `txt(…, {halo:1})`, `wrapLines`, `onPick` and `setKeepFocus` are the same as in the bench kit.
- Colour tokens it needs (copy the three theme blocks from `heat-transfer.html`): `--steel`, `--steel-hi`, `--steel-sh`, `--glass`, `--glass-in`, `--wood-f/-t/-s`, `--thermo`, `--thread`, and `--case` for the stopwatch.
- **A picture that already had its own units keeps them.** `density.html` draws its scene in the same 380 × 300 units as before, inside a group that is 1.15 times larger in the wide picture (`SC`); pointer positions are divided by `SC` before they are used. `heat-transfer.html` gives each part a layout function (`condLay`, `convLay`, `cubeLay`) that returns the wide or the tall positions; the physics never reads them.
- **A cube that turns** (the Leslie cube): work out each face's outward direction from the angle, draw only the faces towards the viewer, and add a small "seen from above" picture where the face that matters is hard to see.
- **Predict by letter:** where the answer is a place on the picture rather than a direction, deal three or four dashed rings with letters (`roller-coaster-energy.html`); after Go, the right one turns green and the values appear beside the rings.

## Field patterns on a card (batch 1, 10 Nov 2026)

`magnetic-field-patterns.html` and `electromagnet-field-patterns.html` share these pieces (a fix goes into both):

- **The card keeps its own units** (560 × 340, which the physics, filings and Experiment use). `layout()` places it in the wide or tall picture (`L.cx`, `L.cy`, `L.cs`); `cardG()` wraps card drawing in that transform, `cardPoint()` turns a pointer into card units, and the filings canvas uses the same numbers.
- **Filings settle tap by tap:** Sprinkle drops them at random; each **Tap the card** turns every filing a fraction `k` of the way still left (near 1 where the field is strong, about 0.2 where it is weak) and jolts the card. With no field (current off) `k` is 0.
- **The compass needle swings** to the field and settles (`swing()`, a damped spring on the needle's angle, updated in place so a drag is never interrupted). Under reduced motion it turns straight to the field.
- **The exam diagram:** for the magnets, a smaller copy of the card with flat poles and arrowed lines beside it, showing "?" until the filings have been tapped, Field lines is on, or a question is answered. For wires and coils the card seen from above is itself the exam diagram, and the 3D picture beside it shows where the card is.
- **Predict** deals a spot with eight dashed arrows round it (which way the compass's north end points), lettered spots, or the ends of a solenoid or core; only questions whose answer is clear (within 8° of an arrow, or a field at least three times stronger) are dealt.

## Checks before pushing

1. `node --check` on the page's scripts (CLAUDE.md, "Check before you commit").
2. `python3 tools/anim-check.py page.html "page.html?show=x"` with a server on port 8765: errors, one-screen fit, sideways scrolling, clipped or overlapping picture text, at three sizes, pressing every button.
3. Screenshots at 1366×657, phone width and dark mode; look at them. The script cannot see a label lying over a drawn object.
4. The workout tab that frames the page: frame height equals the inner page's height, at laptop and phone width.
5. Physics: for each direction the page shows, check one case by hand against the rule.

## Starting a batch in a new chat

> Do animation batch N from `TODO.md` section 8 in the physics-workout repo (`Skati1401/Physics-Workout`), following `tools/ANIMATION-STYLE.md`.
