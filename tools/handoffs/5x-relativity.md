# 5x Relativity: hand-off from the animation (Fable, 21 Nov 2026) to the page (Opus)

The animation is built and live: `animations/time-dilation.html`. What is left of `TODO.md` 5x is **the A.5 page that frames it**, with Questions and Exam tabs. 5ae (the space–time diagram explorer) is a separate build; its links are at the end.

## Links

| Frame or link | Shows |
|---|---|
| `animations/time-dilation.html?embed&part=clock` | Light clock, Explore (IB) |
| `animations/time-dilation.html?embed&show=derive` | Light clock, the nine-step Derivation |
| `animations/time-dilation.html?embed&part=muon` | Muon experiment, Earth's frame beside the muons' frame (IB) |
| `animations/time-dilation.html?embed&show=exp` | Muon experiment, Experiment on (two one-hour counts and a bar chart) |
| `animations/time-dilation.html?embed&part=muon&level=ial` | Muon experiment at IAL (add `&show=exp` for the Experiment) |
| `&v=0.98` on any link | The starting speed (light clock 0 to 0.99, muons 0.5 to 0.995) |

- In a frame the page heading is hidden, and the Part and Level switches with it, so **every frame must name its part** (`part=` or `show=`). With no `level=` the page is IB. IAL is the muon part only.
- The page deals no questions of its own (no `?show=predict`): Questions and Exam are for the page.
- The frame posts its height (`animHeight`) like every other animation.

## What the animation holds

- **Light clock (IB only).** Seen from the lab: clock A at rest, the identical clock B moving at v (slider 0 to 0.99c; Try these 0.60c, 0.80c, 0.87c, 0.99c). Mirrors 0.15 m apart; one tick is the light going there and back, Δt₀ = 1.00 ns. The light's path in B is drawn in the lab's frame; the ticks of A and B are marked against lab time. Beside it, the triangle for half a tick: ½cΔt, ½vΔt, L = ½cΔt₀. Readings: γ, Δt₀, Δt, ticks of A and B. Working: γ, Δt = γΔt₀, and the two path lengths.
- **Derivation (a mode of the light clock).** Nine steps with Back and Next step: the three sides, Pythagoras, then one line of algebra per step to Δt = γΔt₀. The last step says the IB guide does not ask for the derivation.
- **Muon experiment (IB).** A row of 40 muons (half-life at rest 1.5 µs) passes detector 1 on a mountain top and falls L₀ (1.0 to 4.0 km, default 2.00 km) to detector 2 at sea level, at v (0.50c to 0.995c, default 0.99c). Left pane: Earth's frame, with the Earth clocks and the muons' clock. Right pane: the muons' frame, where the Earth, contracted, moves up to the muons. A Relativity switch, Special | Galilean, shows what Galilean relativity predicts in both panes. Beside the picture: the space–time diagram of the trip in the Earth's frame (ct against x, the muons' world line, tan θ = v/c).
- **Muon experiment (IAL).** Left pane as observed; right pane "if their lifetime were not increased". No γ equation and no muons' frame. Beside the picture: a graph of the lifetime as a multiple of the lifetime at rest, against speed.
- **Experiment (both levels).** Detector 1 counts for an hour, the two predictions for sea level appear, then detector 2 counts for an hour.

## Fixed numbers (the page's questions must use different data)

At the default setting (0.99c, 2.00 km): γ = 7.09; trip 6.73 µs in the Earth's frame, 0.950 µs for the muons; contracted distance 282 m; half-life in the Earth's frame 10.6 µs; 26 of 40 arrive (64%), or 2 of 40 by Galilean relativity (4.5%). Experiment: 560 at the top; predictions 25 and 361; measured 367. The measured count is the same every time for the same settings (the prediction plus 0.3√N).

## Question kinds from the indexes (read 21 Nov 2026)

Kinds and wording only; never copy a question or its data. Rows marked R are in a reserve group in the index (topic test or mock exam): take extra care that nothing of their data or setting is echoed.

**IB (IB Physics Question Index, spec point A.5; old Option A P3 papers and the 2025 papers)**

1. Muon decay as evidence (Outline, Explain or Discuss, 3 marks): P3 Nov 2024 Q5(b) R, P3 Nov 2023 TZ2 Q3(b) R, P3 May 2017 TZ2 Q4. The chain: without relativity the flight time is several lifetimes, so very few muons would reach the surface; in the Earth's frame the muons' lifetime is dilated (or in the muons' frame the distance is contracted); so many more muons are detected than Galilean relativity predicts.
2. Fraction that arrives, Newtonian and then relativistic, by counting half-lives (Estimate, 3 and 2 marks): P3 May 2019 TZ1 Q4(a)(i) and (ii).
3. Flight time by Galilean relativity, and why few would arrive (Calculate 1, Deduce 1): P3 May 2018 TZ1 Q4(a).
4. The same trip in the muons' frame: contracted distance, then the time (Show that, Determine, Demonstrate): P3 May 2023 TZ1 Q5(b) R, P3 May 2019 TZ1 Q4(b), P3 May 2018 TZ1 Q4(b)(i).
5. Both frames give the same fraction, and why (Calculate 2, Comment 2): P3 May 2023 TZ1 Q5(c) and (d) R.
6. Dilated lifetime from v (Calculate 2): P3 Nov 2024 Q5(a) R. Distance for half the muons to survive: P3 May 2023 TZ1 Q5(a) R. Distance travelled in one proper lifetime (multiple choice): P1A Nov 2025 TZ1 Q8 R.
7. Time dilation away from muons: a spacecraft's journey time in each frame (P3 Nov 2023 TZ2 Q5(a) R, P2 May 2025 TZ2 Q6(a) R); a moving pendulum's period (P1A May 2025 TZ3 Q9 R); v from γ (P3 May 2018 TZ2 Q4(a)); v from a ratio of times (P3 May 2017 TZ1 Q4(b)).
8. Which time is the proper time, and why (multiple choice, State, Identify and explain): P1A May 2026 TZ3 Q9 R, P1A May 2026 TZ1 Q10 R, P3 May 2023 TZ2 Q4(f) R, P3 May 2017 TZ1 Q4(a), P3 May 2018 TZ2 Q5(c).
9. Length contraction (Calculate 2): a station, a rocket, a bridge or the distance between two stars from a moving frame (P3 May 2024 TZ1 Q3(b)(ii) R, May 2023 TZ2 Q4(c) R, Nov 2023 TZ2 Q5(b)(iii) R, Nov 2019 Q4(a)(i), May 2017 TZ2 Q5(a)(i)); the speed that contracts a train to fit a tunnel (P3 Nov 2017 Q6(c)); a ratio (P1A Nov 2025 TZ3 Q9 R).
10. Define proper length; say which length is proper and why (Define, State, Explain, 1 or 2 marks): P2 May 2026 TZ2 Q5(a) R, P3 May 2024 TZ1 Q3(b)(i) R, P3 Nov 2020 Q4(b)(ii), P3 Nov 2019 Q4(b).
11. The postulates (State 1): P3 Nov 2020 Q3(b), P3 Nov 2019 Q3(a), P3 May 2019 TZ1 Q3(c).

No light-clock question is in the index: the light clock is teaching for Δt = γΔt₀ and proper time (kinds 7 and 8).

**IAL (IAL Past Paper Index, spec point 120; all WPH14)**

1. Why muons made in the upper atmosphere reach the surface (Explain, 2 or 3 marks): Oct 2021 Q16(c) R, Oct 2024 Q13(b) R, June 2026 Q13(b)(ii) R. The chain: speed close to the speed of light; relativistic effects, so the lifetime (as measured on the Earth) is increased; so the muons travel further, or more reach the surface, before they decay.
2. The same with a calculation (Explain, 5 marks, with speed = distance ÷ time): the Rossi–Hall observations, Jan 2021 Q14(a) R; survival over 1600 m, Jan 2026 (A) Q15 R.
3. A fast particle's lifetime against the same particle at rest (Explain 2, or multiple choice): pions at 0.99c, Oct 2023 Q21(d) R; muons in a storage ring, Jan 2022 Q17(d)(iii) R; the fastest Z bosons, Oct 2022 Q13(c) R; June 2022 Q7 R, June 2025 Q4 R, Oct 2025 Q5 R.
4. Is the particle relativistic, by comparing its kinetic energy with its rest energy (Deduce 3), and could it then live long enough (Assess 2): Jan 2023 Q18(b)(iii) and (c) R.

Check the mark schemes' wording before writing model answers (the PDFs are on Alex's PC: `IAL Spec Analysis\Past Paper\IAL Current Spec`, `IB Spec Analysis\Past Paper`).

## Suggested page (for the Opus chat to decide with Alex)

- Tabs: Light Clock (frame `part=clock`, then the Derivation frame or a link to it), Muon Experiment (frame `part=muon`, then `show=exp`), Questions (dealt calculations from kinds 2 to 10), Exam (one original structured question on the muon experiment with a 3-mark "evidence" part, model answers as bullet points). 5ae adds the Space–Time Diagrams tab.
- An IAL version is the muon frame with `level=ial` and IAL kinds 1 to 3; it could be a tab on a Unit 4 workout later (6b) instead of its own page.

## For 5ae (the space–time diagram explorer)

- The muon part already draws the trip's world line in the Earth's frame: events (0, 0) and (L₀, cΔt) in km, θ from the ct axis with tan θ = v/c (`stDiag` in the page's script). 5ae can show the same trip with the ct′ and x′ axes added, where the two events are at the same place (x′ = 0), so cΔt′ = cΔt₀ is the proper time.
- To link the two: 5ae's page can open this one at the same speed with `time-dilation.html?part=muon&v=0.98`, and this page can link to 5ae's with its speed once 5ae has a `?v=` of its own (put the link under the space–time diagram, `#td-diag`, IB only).
