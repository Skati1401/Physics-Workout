---
name: "igcse-practical-pages"
description: "Use with teaching-animations when building or changing an IGCSE core practical page on Alex's physics-workout site (the 1.22 Hooke's law model): which tabs, Do or Show Experiment, plots, wording rules."
---

# IGCSE practical pages (the 1.22 Hooke's law model, Alex 5 Nov 2026)

A sub-skill of `teaching-animations`: load that skill too, and follow its "Core practicals" section, which applies to every practical page.

Every IGCSE practical page follows `hookes-law-practical.html` (source `tools/practical-gen/practicals/hookes-law/`). Copy its `page.json` and `content.js` and change the data. Students do **either** Do Experiment **or** Show Experiment, not both, so the page is about 40 minutes (give the estimate per tab whenever the page changes; count a typed results table as about 4 minutes, not one minute per box as `check.py` does).

**No core route and no Extra practice.** One row of tabs, no dashed extra tabs, no closed Extra practice blocks: leave `core` and `coreMinutes` out of `page.json`. **No Calculate tab:** equation drill (W = mg and the like) belongs in the spec point's workout, so check it is there instead.

**No Overview tab on IGCSE practicals (Alex, 12 Nov 2026), except 1.22 Hooke's law.** Its fill-in-the-blanks retold the Method Order almost line by line and repeated the results tabs, so it was removed from every other IGCSE practical page and the page opens on its first remaining tab (an old `#overview` link falls back to it). Don't add one to a new IGCSE practical. Hooke's law keeps its Overview because it is the law and its key graph, not the method. IAL and IB practicals keep theirs (see the `ial-ib-practical-pages` skill). A "Method type" switch goes on the Method tab only.

**Which tabs every page needs (Alex, 5 Nov 2026).** Only four are required: **Method** (with its Order), **Variables**, **Do Experiment** and **Show Experiment**. Use the others only where the practical gives them real work: a practical with no useful graph-reading needs no Graph Analysis tab, one with nothing to tabulate beyond the experiment needs no Results tab. Keep the order below for whichever tabs a page has.

**No exam question tabs (Alex, 13 Nov 2026).** No Exam Qu Method or Exam Qu Analysis tab and no exam-style long questions on a practical page: they take too long, and students have practice questions elsewhere. The page is for practice in the lesson and for revising an overview. Mark scheme wording still goes into the Method, model answers and Multiple choice explanations.

**The model's eight tabs, in this order** (ids stay short; the labels are what students see):

1. **Overview** (`overview`, Hooke's law only; see "No Overview tab" above): first a short fill-in-the-blanks passage (about 7 gaps, Check answers, Shuffle again and Fill in) on the one idea almost every question on this practical comes back to (Hooke's law: the full statement "extension is directly proportional to force, up to the limit of proportionality", doubling, straight line through the origin, elastic, the rubber band's curve). Distractors are real misconceptions that fit no gap (inversely proportional, halves, plastic, mass). Below it, a **Look** card with the key graph beside its notes (`.graph-split`): the graph labelled with worked points (2 N → 4 cm, 4 N → 8 cm) and the key feature (the limit of proportionality); on the right the statement in a highlighted box (`.hk-law`: accent bar, accent-soft background, 17px body text), 3–4 bullets in body text (`.hk-points`), and an **Exam tip** in body font in a dashed box (`.hk-tip`), never in the small monospace `.sub` style. Method detail (pointer, mass size) is not in the Overview: the Method tab has it.
2. **Variables** (`variables`): a Sort (independent / dependent / control) and two **Multiple choice** cards (`act(tab,'Multiple choice',…)` + `createPredict`): the independent variable for a follow-up test, and why the first reading is taken before any load.
3. **Method** (`method`): the Order of the method (constraints only where order really matters) and a Match of equipment to its job.
4. **Accuracy** (`accuracy`, before the experiment, as planning): a Sort of "Better results" against "Keeps people safe" (check every card fits its bin's label) and two Multiple choice cards (e.g. parallax, improving the range and number of readings).
5. **Do Experiment** (`do`, label "Do Experiment"; the student takes and processes the readings):
   - A short "Your turn" card saying what to read and up to where.
   - The animation in **measure mode** (`frameAct('do', …, 'measure', …)`) side by side with the student's own results table (`.hk-split`, built in a `setTimeout` so the page's set-up has run first). Each cell is typed and marked to the instrument's precision (lengths to 1 mm, extension from the student's own first reading). **Fill in table** is a normal button in the table's bar, always visible (Check table · Fill in table · Clear), so a student who can't read the instrument can still go on to the plot; it fills the cells dashed (`.is-shown`) and counts as done.
   - Plot the student's results (`createPlot`; the row labels show the student's own values once checked), then one question on reading them ("to at least … N").
   - The animation's readings are fixed and the page checks against the same numbers (`HK_LEN` must match the animation; a comment in each file names the other).
6. **Show Experiment** (`experiment`, label "Show Experiment"): a "Your turn" card and the framed full Experiment mode (no `show`), where the table and graph fill in by themselves, then the activities on the other samples or cases the spec names (Hooke's law: Sort elastic or permanently deformed; real Predicts on a metal wire and on unloading a rubber band). This is the alternative to Do Experiment.
7. **Results** (`results`): a given results table to complete (Calculate), **no Plot** (Do Experiment has one), then Multiple choice cards on reading it, what unloading shows, the line of best fit and an anomalous result in a second small table (repeat it and leave it out of the line).
8. **Graph Analysis** (`graphs`, label "Graph Analysis"): questions read off a graph of several samples beside the graph (`.graph-split`), Multiple choice (which line is which sample, which is stiffer), and the same questions on a graph with **the axes the other way round**, since exam papers use both. With force up the side, steeper means stiffer; with extension up the side, steeper means easier to stretch; one card says so.

**Question labels.** Label a card Predict only when it really asks what will happen; recall and reasoning questions are Multiple choice (they pair side by side like Predicts). On the model, Variables, Results, Graph Analysis and Accuracy are all Multiple choice; the Predicts are the Show Experiment ones and "Reading your results".

**Wording rules that review caught:**
- With readings at intervals, say a sample obeys the law **"to at least"** the last proportional load and that the limit of proportionality lies **between** two loads, never "up to 6 N".
- Keep elastic behaviour and Hooke's law separate: a rubber band is elastic but never obeys Hooke's law; an overloaded spring obeyed it at first but is no longer elastic.
- Use proportional reasoning ("each extra 2 N adds 2.4 cm") where the spec has no equation; don't bring in F = kx or work done (area under the graph) unless the spec names them.

**Review before calling it done:** check every number and working against the data, every Predict's right answer and every "why" of a wrong one, the Order constraints, each bin label against its cards, every distractor against every gap, and that each spec point is covered. Then cut what adds little (an easy question, a match that repeats definitions given elsewhere) so the page has only the tabs its practical needs (at least the four required ones) and stays at about 40 minutes or less.