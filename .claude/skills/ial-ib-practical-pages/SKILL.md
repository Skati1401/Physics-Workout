---
name: "ial-ib-practical-pages"
description: "Use with teaching-animations when building or changing an IAL or IB core practical page on Alex's physics-workout site (the CP15 gamma-absorption model): tabs, Do Experiment, measure mode, Analysis, Exam."
---

# IAL and IB practical pages (the CP15 model, Alex 5 Nov 2026)

A sub-skill of `teaching-animations`: load that skill too, and follow its "Core practicals" section, which applies to every practical page.

IAL and IB practical pages follow `gamma-absorption-practical.html` and its animation `animations/gamma-radiation.html`, not the IGCSE pattern (the `igcse-practical-pages` skill, the Hooke's law model). Copy them. They are for revision at A Level, so leave out anything that is IGCSE-easy.

**Eight tabs, in this order:** Overview, Method, Do Experiment, Watch Experiment, Analysis, Calculate, Accuracy, Exam. Tab ids stay short (`do`, `experiment`, `graphs`) while the labels are "Do Experiment", "Watch Experiment" and "Analysis". No core route.
- **No Variables tab, no Results tab and no Predicts anywhere on the page** (Alex removed all three from CP15: too easy for IAL revision). A control-variable or "what happens if" idea goes into an exam part or the Accuracy sort instead.
- **Overview:** one fill-in-the-blanks passage of the whole practical, with Check, Shuffle again and Fill in.
- **Method:** the Order of the method (constraints only where order matters, e.g. background before correcting the counts) and a Match of apparatus to its job.
- **Do Experiment** (the student takes and processes the readings themselves):
  1. A short "Your turn" card in numbered steps (one or two lines), placed in the left column above the framed animation, so the results table starts at the top of the right column (`.hk-split` with a `.ga-left` column; see the end of the Plot block in `content.js`).
  2. The animation in **measure mode** (`?embed&show=measure`), beside a marked results table built on the page: the raw readings typed from the animation's instrument (e.g. the counter), then the processed columns (corrected count rate, ln). Each cell is checked to the precision asked for (counts exactly, I to 0.05, ln I to 0.005). **Show answer is always visible on this table**, so students can skip to the plot; it hides once the table is complete and comes back after Clear.
  3. A "Why plot …?" Explain card (not marked): the equation as learnt, each step of taking logs on its own line with the = signs lined up, then the result lined up term by term under y = mx + c (y, m, c in the accent colour), then one line saying what the gradient and intercept are.
  4. Plot the processed values (`createPlot`, with `next:` set to say what follows, since no line-of-best-fit question comes after it).
  5. A Calculate from a given best-fit line (two points on it): gradient, the constant (μ, in both mm⁻¹ and m⁻¹ where the spec uses SI) and any derived value (half-thickness).
- **Watch Experiment:** a "Your turn" card and the framed full Experiment mode (`?show=abs`), where the table and graph fill in by themselves; the student switches between the raw and the straight-line graph.
- **Analysis:** graph-reading Calculates beside a graph (`.graph-split`): the curve itself (read I₀ and the half-thickness), then two straight-line (log) graphs on one set of axes (two materials) to compare gradients.
- **Calculate:** about 4 questions using the practical's equations, including a background correction and a log rearrangement.
- **Accuracy:** a Sort of "Better results" against "Keeps people safe".
- **Exam:** an original exam-style question (never a past-paper one): a results table with one missing reading to predict, calculation parts, an "explain why you plot …" part, a 6-mark method with safety, and a short "why must X stay fixed" part; model answers as bullet points.

**Measure mode in the animation** (`?show=measure`; `MEAS` in `gamma-radiation.html`):
- One part of the animation only, with Experiment on and its button hidden; no graph (the SVG `viewBox` is trimmed to the apparatus), no results table, no stat boxes and no working. The note box says what to do next and what to write down; the student reads the instrument (the counter and its timer).
- The readings are **fixed** (`MEAS_BG`, `MEAS_C`), not random, and the practical's `content.js` checks against the same numbers (`GA_BG`, `GA_C`); a comment in each file names the other. Repeating a reading gives the same value.
- Choose the readings so every plotted value lies well away from half a snap step of the plot's grid (e.g. ln I = 4.489 sits almost exactly between 4.48 and 4.50 with a 0.02 snap, so a cross placed on the point can be marked wrong; 4.477 is safe). Then work out the best-fit line through them and use two points on it in the gradient Calculate.
- Fixed steps (4 mm of lead at a time, up to 24 mm) keep the table to about 7 rows.
- Show the apparatus doing what the method says: for a background count the source is taken out of its holder (dashed, "empty") and shut in its lead box beside the counter, and goes back afterwards.

**Explain why the straight-line graph is plotted, in the animation too.** When the student picks the log graph (e.g. "ln I against x"), the note box gives the same steps as the Do Experiment card (the log steps, then the line-up under y = mx + c), and Show working adds the log steps before the gradient and intercept. Keep the stage card within 1366×657 with that note showing.