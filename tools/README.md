# Tools

Nothing here is linked from the site. The site itself still has no build step: every page in the repo root and in `animations/` is a finished, self-contained HTML file. These tools only save copying shared code by hand.

## practical-gen: core practical pages

```
python3 tools/practical-gen/gen.py --check hookes-law   # build hookes-law-practical.html, then node --check its script
python3 tools/practical-gen/gen.py --all --check        # rebuild every practical
```

- `template/`: the page shell, styles, engine and tab wiring, copied from the Unit 5 workout plus `createPlot`.
  - `head.html`: the head, fonts and visit counter.
  - `style.css`: the styles, with accent placeholders.
  - `engine.js`: helpers, drag engine and every activity factory (`act`, `bar`, `createBlankGame`, `createSortGame`, `createMatchGame`, `createMemoryGame`, `createCalc`, `createReorder`, `createPredict`, `createSpot`, `lineGraph`, `frameAct`, `createPlot`).
  - `tail.js`: pairs side-by-side Predicts, lines up = signs, and handles tabs, `#tab` links, restoring saved answers and the tab ticks.
  - Every graded factory returns `track(host,{getState,setState,isDone})`, so its answers are saved and its tab can be ticked. A new graded factory must do the same.
- `practicals/<slug>/page.json`:
  - `file`, `title`, `unit`, `links` (header links to the animation and the workout tab), `storeKey` (bump it when questions move) and `oldStoreKey` (the key before the last bump; only the open tab is carried over from it), `draft` (true adds noindex), `accent` (light and dark pairs), optional `extraCss`.
  - `tabs`: each has `id`, `label`, `title` and `spec`. A spec badge ending in P adds the TA badge, the tab's TA tag and the eyebrow note automatically.
- `practicals/<slug>/content.js`: the activities, in tab order. Each `act(tab, kind, title, intro)` call adds a card to that tab. Two Predicts in a row are paired side by side automatically.

To change something on every practical page (a bug fix, a new factory), edit `template/`, rebuild with `--all`, and check each page.

`check.py` answers every graded activity on a built page in Playwright and reports what the page says, then checks every tab for sideways scroll at 380px and each framed animation's height. Run `python3 -m http.server 8765` in the repo root first, then `python3 tools/practical-gen/check.py hookes-law-practical.html` (add `--shots DIR` for screenshots).

## experiment-kit: Experiment mode for animation pages

- `kit.js`: copy into the animation page's script.
  - `expRun`: step the independent variable up one interval at a time, then optionally back down.
  - `expReading`: readings on the instrument's resolution, with a small fixed error that never makes a reading go the wrong way.
  - `expTable`: the results table.
  - `expCross`, `expRing`, `expKey`: plotted marks and their key.
- `kit.css`: copy into the page's `<style>`. It provides the table with a sticky header and a fade-in for each new row.
- `demo.html`: a small working example (I–V for a resistor), not linked from any list and marked noindex.
- `kit.test.js`: `node tools/experiment-kit/kit.test.js`. It checks the readings never go backwards, for several curve shapes, resolutions and intervals. Run it after changing `kit.js`.

`animations/hookes-law.html` was built before the kit, so it has its own copy of the same logic. Leave it as it is unless you are changing that page anyway.

## CORE-PRACTICALS.md

The tracker for building the remaining practicals in batches, each in its own chat. It covers how to start a batch, the steps for each practical, and the status table.
