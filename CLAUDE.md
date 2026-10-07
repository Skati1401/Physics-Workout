# How to work on this site

This repository is a small website of interactive physics revision activities for Alex's students, hosted on GitHub Pages. Each activity is one self-contained HTML page. `index.html` is the launch page with a Year 9 button and an IGCSE button; these open `year-9.html` and `igcse.html`, which list the workouts for that course.

## Before you start any task

- **Most activities are for Edexcel IGCSE Physics (4PH1).** Pitch a new activity at IGCSE level unless the request says otherwise. If the request suggests a different group (e.g. KS3), confirm the year group first (see "Pitching it" below), as it changes the whole page.
- **Copy from the existing pages, don't start from scratch.** The current activity pages are the reference implementation. Open the one closest to the new topic and copy its `<style>` block, helpers and activity factories, then change only the data and the panels. The Forces page has the fullest engine (`makeDraggable`, `createSortGame`, `createMatchGame`, `createReorderGame`, `numClose`, `lineGraph`, `applyTabUI`, `collectState`). The Heat Transfer page has the original shell, the icon class set and the fill-in-the-blank passage.
- **Commit straight to `main`** unless Alex asks for a branch. Pushing to `main` updates the live site in a minute or two.

## Site structure

- One HTML file per activity in the repository root, named in lowercase with hyphens (e.g. `forces-and-motion.html`, `heat-transfer.html`, `solids-liquids-gases.html`).
- Every activity page has a small back link at the top to its course list: "← Year 9 workouts" (`year-9.html`) or "← IGCSE workouts" (`igcse.html`). The course lists link back to `index.html`.
- When you add a new page, also add its card to the right course list (`year-9.html` or `igcse.html`): title ending in "Workout", and one line saying what students do. IGCSE titles start with the unit number (e.g. "1a Forces and Motion Workout"), and `igcse.html` lists cards in unit-number order, not by year.
- **Drafts (not ready to publish):** commit the page to `main` as normal, but add `<meta name="robots" content="noindex">` after the charset meta and give it no card on any list. It is still reachable by its URL (and the repo is public), so nothing sensitive. To publish: add its card to the right list and remove the `noindex` line. Current drafts: `maths-skills.html`.
- Each page is a complete standalone document: `<!doctype html>`, `<meta charset="utf-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1">`, a `<title>`, then the content. Nothing loads from claude.ai.
- External files: Google Fonts only. All CSS and JavaScript are inline. No build step, no frameworks, no animation libraries.
- Never put student names, class lists or results in this repository. It is public.

## Page shell

- Order: `<title>`, Google Fonts links, one `<style>` block, then `<div class="page">` holding a `<header class="page-head">` (short eyebrow line + `<h1>`, no intro paragraph), a `<nav class="tabs" role="tablist">` with 1–2 word tab labels, then one `<section id="panel-{id}" class="panel" hidden>` per activity (the first tab has no `hidden`), then a single `<script>` containing all data, helpers, factories and wiring.
- Tabs: a `TAB_IDS` array drives everything, and `applyTabUI(tab)` shows the active panel. To rename or reorder tabs, edit only the nav buttons and `TAB_IDS`; leave the `<section>` blocks where they are.
- Split a tab into two specifically named tabs once it is doing two unrelated jobs.
- Design tokens: define them in `:root` (light), then repeat them under `@media (prefers-color-scheme: dark){ :root:not([data-theme="light"]){...} }` and under `:root[data-theme="dark"]{...}`. Core tokens: `--bg, --bg-grid, --panel, --panel-border, --ink, --ink-soft, --ink-faint, --accent, --good/-soft, --bad/-soft, --shadow`. Give each topic category its own colour pair and reuse it everywhere that category appears.
- Fonts: Big Shoulders (headings), IBM Plex Sans (body), IBM Plex Mono (labels, badges, numbers).
- Layout: `.page{max-width:1200px; margin-inline:auto; padding-inline:20px;}` (1200px is the widest that fits a school Chromebook or laptop window, about 1280–1536px, and wider cards wrap less, which saves scrolling on their short screens). No `max-width` on intro paragraphs. Small decorative diagrams stay small (≤130px) so the activity is never pushed below the fold. Must work at phone width (about 380px) with no sideways scrolling.
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

## Activity types to choose from

Fill in the blank (word bank with distractors) · Sort into labelled bins (`createSortGame`; bins above the pool) · Reorder · Match two columns (`createMatchGame`, with connecting lines and ~40px column gap) · Reveal a worked example (`<details>`, model answer as bullet points) · Predict-then-reveal (choices include real misconceptions; explain why the chosen wrong answer is wrong) · Spot the error · Flip-card memory match (8–10 pairs) · Slider simulation (one real formula, for older students) · Type-the-number (`numClose`: 2% tolerance, 0.05 minimum; unit shown beside the box) · Label the graph line (chips dropped onto the line, named by physics meaning) · Quantity–Symbol–Unit table (one given cell per row, chosen so the row has only one correct answer; watch symbol clashes such as p, s, m, a, t, W, V, g).

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
