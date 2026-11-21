# Activity 7: Spot the Error (interactive-revision-lab)

Shared rules (headings, no capitals, checklist, verification) are in SKILL.md; the engine helpers, layout and equations are in the `workout-page-shell` skill.

`createSpot({host, scenario, lines, wrong, explain, fix})` in the `act()` engine (`density-pressure-state.html`). For calculation topics, each example is a **clean worked solution, one step per line**, in substitute-then-rearrange order, with the step number in its own small badge (never typed into the line text, and never several steps on one numbered line):
- **Exactly one mistake, and it is in the algebraic rearranging** (dividing instead of multiplying, putting a quantity on the top instead of the bottom, swapping p₁ and p₂). The first line, the equation itself, is always right, and so is the substitution line straight after it. Every line after the mistake is worked correctly from it, so the final answer is wrong only because of that one step. Say this in the activity intro.
- Vary which line holds the mistake (line 3, 4, 6…), sometimes after a correct intermediate step, so it is not always the first rearranging line. A wildly unreasonable final answer (882 000 000 °C) is a good extra cue to mention in the explanation.
- Show all divisions as stacked fractions (see "Equations" in the `workout-page-shell` skill).
- Clicking the mistake locks the example and shows why it is wrong plus the corrected working as a short block. Clicking a correct line says it is fine; for a line after the mistake, say it is worked correctly from the line above and the mistake is earlier. A wrong click never reveals the answer or costs a mark. Each example has a Try Again button; feedback goes in an `aria-live` region.
- Put 2–3 examples per tab, laid out as cards side by side.

For diagram topics (e.g. free-body diagrams) the same click-to-investigate idea works with clickable regions of an SVG (each a `<button>` or focusable `<g>`), each example seeded with a different classic misconception so together they cover the topic's main error modes: a reaction force drawn as the book pushing on itself, weight and normal force called an action–reaction pair, friction pointing along the motion, arrow lengths that don't reflect the relative sizes of the forces.
