# How to work on this site

This repository is a small website of interactive physics revision activities for Alex's students, hosted on GitHub Pages. Each activity is one self-contained HTML page. `index.html` is the launch page with a Year 9 button and an IGCSE button; these open `year-9.html` and `igcse.html`, which list the workouts for that course. Below them, an "Animations" section on `index.html` holds a card for each teaching animation (e.g. `animations/friction.html`): one page per animation, kept in the `animations/` folder, no tabs or activities, a Play/Pause, Reset and Slow motion bar, and a "← Home" back link.

## Before you start any task

- **Most activities are for Edexcel IGCSE Physics (4PH1).** Pitch a new activity at IGCSE level unless the request says otherwise. If the request suggests a different group (e.g. KS3), confirm the year group first (see "Pitching it" below), as it changes the whole page.
- **Copy from the existing pages, don't start from scratch.** The current activity pages are the reference implementation. Open the one closest to the new topic and copy its `<style>` block, helpers and activity factories, then change only the data and the panels. The Forces page has the fullest engine (`makeDraggable`, `createSortGame`, `createMatchGame`, `createReorderGame`, `numClose`, `lineGraph`, `applyTabUI`, `collectState`). The Heat Transfer page has the original shell, the icon class set and the fill-in-the-blank passage. The Unit 5 page (`solids-liquids-gases.html`) has the newest pieces: `createSpot`, `createPredict`, `createCalc`, the `FR()` fraction helper, `.act-pair`, `.sim-small`, and the side-by-side layouts below.
- **Commit straight to `main`** unless Alex asks for a branch. Pushing to `main` updates the live site in a minute or two.
- **When students are using the site** (Alex says not to push live), commit to a working branch instead and push only that branch. Keep a list of what is waiting, and merge it into `main` in one go when Alex says "go live".

## Site structure

- One HTML file per activity in the repository root (teaching animations go in `animations/` instead), named in lowercase with hyphens (e.g. `forces-and-motion.html`, `heat-transfer.html`, `solids-liquids-gases.html`).
- Every activity page has a small back link at the top to its course list: "← Year 9 workouts" (`year-9.html`) or "← IGCSE workouts" (`igcse.html`). The course lists link back to `index.html`.
- When you add a new page, also add its card to the right course list (`year-9.html` or `igcse.html`): title ending in "Workout", and one line saying what students do. IGCSE titles start with the unit number (e.g. "1a Forces and Motion Workout"), and `igcse.html` lists cards in unit-number order, not by year.
- **Drafts (not ready to publish):** commit the page to `main` as normal, but add `<meta name="robots" content="noindex">` after the charset meta and give it no card on any list. It is still reachable by its URL (and the repo is public), so nothing sensitive. To publish: add its card to the right list and remove the `noindex` line. Current drafts: `maths-skills.html`.
- Each page is a complete standalone document: `<!doctype html>`, `<meta charset="utf-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1">`, a `<title>`, then the content. Nothing loads from claude.ai.
- External files: Google Fonts only. All CSS and JavaScript are inline. No build step, no frameworks, no animation libraries.
- Never put student surnames, class lists or results in this repository. It is public. Questions and animations may use a first name for the person in them (Alex likes this), but only common first names from Alex's classes (Alex has shared which). Never write a list of names, rare or distinctive names, or anything linking a name to a class or a result.
- **One copy of each animation.** An animation that is both a lesson tool and part of a workout lives only on its own page in `animations/` (e.g. `animations/skydiver.html`). The workout tab shows it in `<iframe class="anim-frame" src="animations/skydiver.html?embed">` with an "Open … full screen" link below. With `?embed` the page hides its back link and heading, opens its working, and posts `{animHeight}` to the parent, whose `message` listener sizes the frame. Fix the animation page and both places update; never copy the animation code back into the workout. Unit 5 adds its frames with `frameAct()`, and `?embed&show=<panel>` shows just one part of a page that holds two (e.g. `gas-molecules.html?embed&show=laws`). Animation pages (all in `animations/`; their back link is `../index.html`): `motion-graphs.html`, `force-mass-acceleration.html` (1a); `skydiver.html`, `stopping-distance.html`, `momentum-collision.html`, `hookes-law.html`, `seesaw-moments.html` (1b); `heating-curve.html`, `gas-molecules.html`, `liquid-pressure.html` (Unit 5); `friction.html` (lesson only). Each has a card in the Animations section of `index.html`. The repository root keeps a small redirect page under each animation's old name (e.g. `skydiver.html` → `animations/skydiver.html`, query string kept) so links already shared still work; don't edit those, and give a new animation no redirect.

## Page shell

- Order: `<title>`, Google Fonts links, one `<style>` block, then `<div class="page">` holding a `<header class="page-head">` (short eyebrow line + `<h1>`, no intro paragraph), a `<nav class="tabs" role="tablist">` with 1–2 word tab labels, then one `<section id="panel-{id}" class="panel" hidden>` per activity (the first tab has no `hidden`), then a single `<script>` containing all data, helpers, factories and wiring.
- Tabs: a `TAB_IDS` array drives everything, and `applyTabUI(tab)` shows the active panel. To rename or reorder tabs, edit only the nav buttons and `TAB_IDS`; leave the `<section>` blocks where they are.
- Split a tab into two specifically named tabs once it is doing two unrelated jobs, or once it holds more than about five activities (e.g. Fluids became Pressure & Depth + Manometer; Gas Motion became Gas Motion + Gas Pressure).
- **Order inside a tab:** Explore or Watch first (see the idea), then the concept checks (Predict, Sort, Match, Order, Label the graph), then Calculate, with Spot the Error last, straight after the Calculate it builds on. Don't repeat the same simulation in two tabs; keep it in the tab where it does most work.
- Design tokens: define them in `:root` (light), then repeat them under `@media (prefers-color-scheme: dark){ :root:not([data-theme="light"]){...} }` and under `:root[data-theme="dark"]{...}`. Core tokens: `--bg, --bg-grid, --panel, --panel-border, --ink, --ink-soft, --ink-faint, --accent, --good/-soft, --bad/-soft, --shadow`. Give each topic category its own colour pair and reuse it everywhere that category appears.
- Fonts: Big Shoulders (headings), IBM Plex Sans (body), IBM Plex Mono (labels, badges, numbers).
- **No capitals-only text, anywhere.** Never use `text-transform:uppercase` or type words in capitals. Tab labels, page and panel headings use title case ("Moments", "Pressure and Depth"); activity titles, section labels, bin labels, badges and diagram labels use sentence case ("Explore — a collision", "Contact force", "Cold outside air"). Keep symbols in their real case (v² = u² + 2as, not V² = U² + 2AS), and follow normal grammar and punctuation ("Solids, Liquids and Gases").
- Layout: `.page{max-width:1400px; margin-inline:auto; padding-inline:20px;}` (Year 9 mostly use Chromebooks, where the page simply fills the window; IGCSE mostly use laptops, about 1280–1536px wide, where the extra width lets cards wrap less, which saves scrolling on their short screens). In match games whose left items are short terms, give the left column less width (e.g. `minmax(0,1fr) minmax(0,2.6fr)` on wide screens) so each definition fits on one line and the whole list fits on screen. No `max-width` on intro paragraphs. Small decorative diagrams stay small (≤130px) so the activity is never pushed below the fold. Must work at phone width (about 380px) with no sideways scrolling.
- **Use the width; put things side by side.** On wide screens:
  - Two activities of the same small kind in a row sit side by side in an `.act-pair` (`grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr))`), stacking on narrow screens. Every Predict should have a partner (write a second one if a tab has only one), and two parallel Order chains can pair too.
  - Calculate questions sit two to a row (`.calc-inputs` grid, `minmax(min(100%,520px),1fr)`), each in its own light box with the answer box beside the question.
  - Explore/slider diagrams are capped (`.sim.sim-small`, `--simw` 340–420px) so the readings sit alongside instead of the picture filling half the page. Reveal pictures inside a Predict stay at about 200px.
  - Label the graph puts the caption pool in a column to the right of the graph (stacking below it under about 860px).
  - Spot the Error examples sit in a grid of cards about 400px wide.
- Same-height cards: use a flat pixel `min-height` sized for the longest text, never an `em` value.
- Saving progress: save `collectState()` to `localStorage`, keyed by page name, with every read and write wrapped in try/catch, and render normally when nothing is saved. Do not use any `window.claude` code; it doesn't exist outside claude.ai, so remove it if you find it in an older page.
- Every activity has a "Shuffle Again" (or reset) button so a teacher can rerun it with the next class.

## How activities behave

- **Drag and drop** uses custom mouse and touch events (not HTML5 drag and drop) via `makeDraggable`, with a 6px threshold to tell a tap from a drag.
- **Tentative, then Check.** Never mark an answer on drop. A "Check" button reveals results: correct ones lock and turn green; wrong ones shake, then return to the pool after 700–800ms. Students must be able to get it wrong and see it.
- **One click empties a slot.** Clicking any filled, unlocked slot sends its chip straight back. Dropping a new chip on a filled slot replaces it.
- **Reorder** updates the order live while dragging and also has ▲▼ buttons. Check gives a score, not per-row marks.
- **Don't give the answer away.** Labels and chips describe the physics meaning ("Constant velocity, backwards"), never a visual feature the student can match by eye ("sloping down"). Ask: could a student get this right by matching words instead of understanding? If so, reword it.
- **Keyboard and screen readers.** Every chip, card and slot is a `<button>` (or has `tabindex="0"` and `role="button"`). Select-then-target works with Enter and Space as well as clicks. Keep a visible `:focus-visible` outline. Announce Check results in an `aria-live="polite"` region (e.g. "6 / 8 correct"). Touch targets are at least 44px tall.

## Animation

Animation is feedback, not decoration. CSS transitions and `@keyframes` only.

- Correct: brief scale to 1.05 and back with the green fading in (about 250ms). Wrong: `shake` (about 500ms), then the bounce back. Chip settling into a slot: 150ms ease-out. New panel: 250ms fade-in. Predict-then-reveal outcomes: 400–600ms. Finished activity: one brief celebration, such as the score pill pulsing, never full screen.
- Animate only `transform` and `opacity`, so it runs smoothly on old Chromebooks and phones.
- **Respect reduced motion.** Put movement inside `@media (prefers-reduced-motion: no-preference)`. Under `reduce`, swap the shake for a colour change and slides or flips for an instant change. The meaning must still come through.
- Nothing loops forever, and nothing flashes more than three times a second.

## Equations

- **Never use ÷ in an equation.** Show every division as a stacked fraction: write `[[top|bottom]]` in the text and pass it through the page's `FR()` helper (see `solids-liquids-gases.html`), which draws the fraction and keeps numbers like "15 000" on one line. This applies to Spot the Error steps, Calculate intros and "Show full working", the equation readouts beside sliders, Predict feedback and Order steps. For screen readers, a fraction reads as "top over bottom".
- **Show every step, never jump to it.** Where a readout or worked answer uses a rearranged form, write the equation as learnt, then each step of the algebra on its own line, then the numbers (e.g. m₁u₁ + m₂u₂ = (m₁ + m₂)v → 2 × 3 + 1 × 0 = (2 + 1) × v → 6 = 3 × v → v = [[6|3]] → v = 2 m/s). Don't add notes like "divide both sides by 3": the lines themselves show the algebra. For braking distance from v² = u² + 2as, state v = 0 and acceleration −a, then 0 = u² − 2as → 2as = u² → s = [[u²|2a]].
- **Motion: use the graph.** Wherever a motion graph is shown (an animation, an explore, a Calculate question), find the answers from it: speed or acceleration as the gradient of the right stretch (read the two points off the graph), and distance as the area under the velocity–time graph (rectangle, triangle, ½ × base × height). Don't use v² = u² + 2as or other equations of motion there; they belong in the "Using v² = u² + 2as" tab and in questions with no graph.
- **Line up the = signs** in every working readout, so each line reads left | = | right like a worked answer on paper (`watchEquals()` does this automatically for `.eq`, `.xs-eq` and `.fma-eq`). Keep explanations of *why an answer is wrong* in Spot the Error and Predict feedback; those are not algebra notes.

## Slider explores

- **Layout (the 1b momentum collision is the model):** the picture on the left with its sliders underneath; on the right, the choice buttons (stick/bounce, road surface, material…), Go and Reset, then the working and a one-line note. On phones the two columns stack. `stackSliders()` arranges this from the markup, and `balanceSims()` then sizes the picture so the two columns end at about the same height (less empty space), moving sliders up to the right column if the left is still much taller. Give a picture that holds graphs a larger minimum width with `data-minw` (e.g. `0.45`–`0.55`) so the graphs stay readable.
- The readout shows the equation, every step of the algebra on its own line, and the numbers, with the = signs lined up; it updates on every `input` event.
- A Go button runs a `requestAnimationFrame` loop that always ends (end of track or a fixed time) and then shows a one-line conclusion. Changing a slider resets it. These runs play even when reduced motion is on: they only start when a student presses Go, they are short and they always stop, and seeing the motion is the point (many school laptops have animations switched off, which made the trolleys appear to jump straight to the end). Reduced motion still turns off the decorative effects (shake, fades, flips). A sim that loops continuously (the Unit 5 particle boxes) still starts paused under reduced motion, with a Play button.
- Don't keep an animated position in a stepped range input: `step="0.5"` rounds each small increment back down. Keep it in a JS variable and copy it to the slider.
- Test the largest and smallest slider values at phone width; nothing should be clipped at either end.
- Reference sims: the animation pages listed under "One copy of each animation" (the skydiver page is the model for the lesson layout: picture left with the Play/Go, Reset and Slow motion buttons and sliders under it; choices, fixed points, note, readings and "Show working" on the right). Sims still inside workouts: Unit 5 (pressure, specific heat), 1b (bridge).

## Spec points and Triple Award

- **Every tab starts with the same heading.** A `.panel-head` holding an `<h2>` title (Big Shoulders, title case) and a `.spec` list of the tab's 4PH1 spec numbers as small badges, e.g. `<div class="panel-head"><h2>Momentum</h2><div class="spec"><b class="ta" title="Triple Award only">TA</b><b>1.25P</b><b>1.27P</b></div></div>`. Overview can say "All of Unit 5"; Key Terms and Units can leave the badges out. Take the numbers from the spec itself, never from memory: if you don't have the relevant page of the spec, ask Alex for it rather than guessing.
- **Mark Triple Award content as TA.** Any tab covering a P spec point (e.g. 1.25P–1.33P, 5.8P–5.14P) gets the TA badge first in its spec list and a TA tag on its tab button (`data-ta` attribute, drawn by `.tab-btn[data-ta]::after`). Add "TA = Triple Award only" to the page's eyebrow line.

## Balance against the spec

Before a topic page is finished, list its spec points and check each has at least one activity, that no tab is spent on something the spec doesn't name (Unit 5's Manometer tab became two questions), that no idea is repeated by three activities, that each spec section gets a similar number of tabs, and that every named practical has an Order activity.

## Activity types to choose from

Fill in the blank (word bank with distractors; check every gap against every chip, distractors and other gaps' answers alike, and reword any gap where a second chip reads as sensible; distractors are real misconceptions that fit no gap) · Sort into labelled bins (`createSortGame`; bins above the pool) · Reorder · Match two columns (`createMatchGame`, with connecting lines and ~40px column gap) · Reveal a worked example (`<details>`, model answer as bullet points) · Predict-then-reveal (choices include real misconceptions; explain why the chosen wrong answer is wrong; keep the options a similar length so the right one is never the longest; pair them side by side) · Spot the error (`createSpot`: a clean worked example, one step per line with the step number in its own badge; exactly one mistake, made while rearranging the equation; the first line is always right and every line after the mistake is worked correctly from it; finding it shows why and the corrected working, and each example has Try Again; 2–3 examples per tab) · Flip-card memory match (8–10 pairs) · Slider simulation (one real formula, for older students) · Type-the-number (`numClose`: 2% tolerance, 0.05 minimum; unit shown beside the box) · Label the graph line (chips dropped onto the line, named by physics meaning) · Quantity–Symbol–Unit table (one given cell per row, chosen so the row has only one correct answer; watch symbol clashes such as p, s, m, a, t, W, V, g).

## Pitching it

- **Primary (about 7–11):** 3–5 tabs, one activity each; 4–6 items per sort or match; short words; pictures on chips; chips at least 48px tall with 16px+ text; warmer success animation; no scores that compare pupils.
- **KS3 (11–14):** the Heat Transfer page's level; 6–10 items per activity.
- **GCSE/IGCSE and above:** the Forces page's level; exam-style wording, numeric questions, graphs, units tables.
- Keep wording at the class's reading level. Every scenario should be a plausible exam phrasing, not a giveaway. If a test or scheme of work is shared, use it only to see which skills to target; never copy its questions.

## Group activities

For team tasks (jigsaws, escape rooms), design so the group genuinely has to cooperate: each member holds information the others need, and answers are checked in a way that can't be guessed or copied from one person.

## Check before you commit

1. Extract the `<script>` contents and run `node --check` on it.
2. Check every `getElementById('x')` has a matching `id="x"`, and every `data-action` lookup has a matching attribute.
3. If tabs changed: the nav `data-tab` values, the `panel-…` ids and `TAB_IDS` must be the same set.
4. Check each course list (`year-9.html`, `igcse.html`) links to every published page for that course (drafts excluded) and every page links back to its list.
5. Look at it at phone and desktop width, try one activity with the keyboard only, and one with reduced motion on.
