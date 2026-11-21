# 5ae Space–time diagrams: hand-off from the animation (Fable, 21 Nov 2026) to the page (Opus)

The animation is built and live: `animations/spacetime-diagram.html` (IB A.5, HL; IB only, as the IAL and IGCSE specs have no space–time diagrams). **Left:** the Space–Time Diagrams tab or tabs on `relativity.html`, after Muon Numbers (see `tools/PAGE-NOTES.md`, "A.5 Relativity Workout"). The question kinds below were read from the IB Physics Question Index at home on 21 Nov 2026, so the page itself no longer needs the index; only a check of its model answers against the mark scheme PDFs does (add it to `TODO.md` 5af).

## Links

| Frame or link | Shows |
|---|---|
| `animations/spacetime-diagram.html?embed&part=event` | One event read in both frames, with the grid of S′ |
| `…?embed&part=simul` | Two events A and B: the relativity of simultaneity |
| `…?embed&part=dilation` | A clock's ticks and the curves of constant interval: time dilation |
| `…?embed&part=contraction` | The band between two world lines, cut along each frame's "now": length contraction |
| `…?embed&part=interval` | Two events P and Q: (cΔt)² − (Δx)² in both frames |
| `…?embed&part=velocity` | A probe or light sent from the Earth: velocity addition |
| `…?embed&show=predict` | Questions, all six kinds in turn |
| `…?embed&show=predict&q=wline` | Questions of one kind only: `wline`, `xaxis`, `light`, `plot`, `first` or `tick` |
| `&v=0.8` on any link | The speed of S′ (0 to 0.90) |

- In a frame the page heading is hidden. A frame that names a part or `show=predict` also hides the Explore | Questions switch and the Show row, so the frame does one job; a frame with neither (`?embed`) keeps both.
- The frame posts its height (`animHeight`) like every other animation.
- Relativity: Special | Galilean is on every Explore view (the Galilean transformation leaves the x′ axis on the x axis).

## What the animation holds

- **The picture.** Left: the space–time diagram of frame S (the Earth), x and ct in light-years, light at 45°, with the ct′ and x′ axes of frame S′ (a ship at v) marked in units of S′. Right: two strips, the same events in space as S records them when its clocks read ct = T and as S′ records them when its clocks read ct′ = T; Play runs T from 0 to 5 years, and each frame's line of "now" sweeps up the diagram. Objects are drawn contracted in the frame where they move.
- **One event.** E is dragged; blue lines read x and ct, orange lines parallel to the S′ axes read x′ and ct′; working is the Lorentz (or Galilean) transformation.
- **Simultaneity.** A and B, dragged; each event's line of simultaneity in S (to the ct axis) and in S′ (to the ct′ axis); buttons put B at the same time as A in S or in S′.
- **Time dilation.** The ship's clock (or the Earth's) ticks once a year; curves (ct)² − x² = n² mark the scale on the ct′ axis; each clock shows its reading in both strips.
- **Contraction.** Two ships at rest in S′, or the Earth and a station at rest in S, L₀ = 2.00 ly; the band between the world lines is cut along each frame's "now".
- **Interval.** P and Q, dragged; the steps Δx, cΔt and Δx′, cΔt′; the curve of constant interval through Q.
- **Velocity.** A probe at u (−0.95c to 0.95c) or light; u′ by the relativistic and the Galilean equations; the strips show the probe in each frame.
- **Questions (on the picture, then Go).** `wline` draw the world line of a ship at a given speed, from a given ct; `xaxis` draw the x′ axis, given the ct′ axis; `light` draw the world line of a light signal from event P to the Earth or to a station; `plot` mark an event from its x′ and ct′; `first` click the event that is first in S′; `tick` mark where the ship's clock reads n years. Lines are right within 2.6°, marks within about 0.17 ly. The papers each kind is modelled on are in the comment at the top of the page's script.

## Fixed numbers (the page's questions must use different data)

Opening state, v = 0.60c (γ = 1.25, θ = 31.0°): E at x = 3, ct = 2 gives x′ = 2.25, ct′ = 0.25; A (1, 2.5) and B (4, 2.5) give cΔt′ = −2.25, Δx′ = 3.75; P (2, 1) and Q (3, 4) give (Δs)² = 8.00 ly², Δx′ = −1.00, cΔt′ = 3.00; L₀ = 2.00 ly gives L = 1.60 ly; a probe at 0.90c gives u′ = 0.652c (Galilean 0.30c). Question pools: speeds 0.25c to 0.80c; `plot` uses 0.50c and 0.60c with whole-number x′ and ct′; `tick` uses 0.50c, 0.60c and 0.80c.

## Question kinds from the index (IB Physics Question Index, spec point A.5; read 21 Nov 2026)

Kinds and wording only; never copy a question or its data. Every row here is in a reserve group in the index (topic test or mock): take extra care that nothing of its data or setting is echoed. The kinds done on the picture by the animation's Questions mode are marked (anim); the page needs the typed and written kinds.

**Read from a space–time diagram**

1. Speed of a ship or frame from the slope of its world line or ct′ axis (Determine, Calculate or Show that, 1 or 2 marks): P2 May 2026 TZ3 Q4(a), P2 May 2025 TZ1 Q7(b)(ii), P3 Nov 2024 Q4(a)(ii), P3 May 2024 TZ1 Q5(a), P3 May 2024 TZ2 Q5(a)(i), P3 May 2023 TZ2 Q5(a), P3 May 2023 TZ1 Q4(a), P3 Nov 2020 Q5(a)(i), P3 May 2019 TZ1 Q5(e), P3 May 2019 TZ2 Q7(a). Multiple choice, pick the right world line: P1A Nov 2025 TZ3 Q8.
2. Coordinates of an event read from the diagram, in S (State, Estimate 1 or 2: P3 Nov 2024 Q4(b)(ii), P3 May 2023 TZ2 Q5(b), P3 May 2019 TZ2 Q7(c)(ii)) or in S′ (Determine 2 or 3, from the diagram or by the Lorentz transformation: P3 May 2024 TZ1 Q5(b)(iii), P3 May 2023 TZ1 Q4(c)(ii)).
3. Length of a moving object read from the diagram (State or Estimate 1: P2 May 2025 TZ3 Q2(d), P3 Nov 2018 Q5(c)(ii)), and why a rod at rest in S is shorter in S′ (Outline 3: P3 Nov 2018 Q5(c)(i)).
4. Time on the moving clock at an event (Estimate or Identify 2: P3 May 2018 TZ2 Q4(d)(ii), P3 Nov 2024 Q4(a)(iii)).

**Draw on a space–time diagram** (anim)

5. A world line for a given speed and starting event (Draw 2): P3 May 2018 TZ1 Q5(a). (`wline`)
6. The x′ axis, or both S′ axes (Draw 1; Sketch 2 for the frame in which two events are simultaneous): P2 May 2025 TZ3 Q2(a), P2 May 2025 TZ1 Q7(b)(i), P3 May 2024 TZ2 Q5(a)(ii), P3 Nov 2020 Q5(a)(ii), P3 Nov 2019 Q4(c)(i), P3 May 2017 TZ1 Q4(d)(i). (`xaxis`)
7. The world line of a light or radio signal from an event (Draw 1; Construct 2 or 3 with the arrival event): P2 May 2026 TZ3 Q4(b)(i), P2 May 2025 TZ2 Q6(b)(i), P2 May 2025 TZ3 Q2(b), P3 Nov 2023 TZ2 Q5(c)(i), P3 May 2018 TZ2 Q4(d)(i). (`light`)
8. Plot or label an event from its coordinates (Plot 1 or 2, Label 1 or 2): in S, P3 May 2024 TZ1 Q5(b)(i), P3 May 2019 TZ1 Q5(a), P3 May 2017 TZ2 Q5(c)(i); in S′, P3 Nov 2018 Q5(b)(i) and (ii); defined by light arriving, P3 Nov 2020 Q5(b)(i), P3 May 2023 TZ1 Q4(c)(i). (`plot`)
9. The point on the ct′ axis where ct′ has a given value (Label 2): P3 May 2023 TZ1 Q4(b)(ii). (`tick`)

**Simultaneity**

10. Which event is first for the moving observer, with a line parallel to the x′ axis through each event (Identify, Justify, Demonstrate or Determine, 2): P3 May 2024 TZ2 Q5(c), P3 May 2024 TZ1 Q5(b)(ii), P3 Nov 2019 Q4(c)(ii), P3 May 2019 TZ1 Q5(d)(ii), P3 May 2017 TZ1 Q4(d)(ii) (Deduce 3). (`first`, anim) Events simultaneous for the observer at rest (List 1): P3 May 2024 TZ2 Q5(b). Multiple choice: P1A Nov 2025 TZ1 Q9.
11. Speed of the observer for whom two events are simultaneous (Determine 2): P2 May 2026 TZ2 Q5(c).
12. Explain, with light world lines, which observer finds two flashes simultaneous, or sees them arrive together (Explain 2): P2 May 2025 TZ3 Q2(c), P3 May 2024 TZ2 Q5(d), P3 May 2018 TZ1 Q5(c), P3 Nov 2019 Q4(c)(iii); the train and tunnel (Draw 3, Explain 2): P3 Nov 2017 Q6(b) and (d).
13. The time between two events in the other frame, by Δt′ = γ(Δt − vΔx/c²) (Determine or Show that, 1 or 2): P3 May 2017 TZ2 Q5(b)(i) and (ii), P3 Nov 2019 Q4(c)(iv), P3 May 2017 TZ1 Q4(d)(iii), P3 May 2024 TZ1 Q4(b).

**The space–time interval**

14. (Δs)² between two events read from the diagram (Calculate 1 or 2; zero for two events on one light world line): P2 May 2026 TZ2 Q5(b), P2 May 2025 TZ1 Q7(a)(i), P2 May 2026 TZ3 Q4(b)(ii), P3 May 2017 TZ2 Q5(c)(iii), P3 May 2018 TZ2 Q5(b)(i).
15. What "invariant" means (Outline or Explain 1): P2 May 2025 TZ1 Q7(a)(ii), P3 May 2018 TZ2 Q5(a).
16. Show that it is the same in both frames, or use that to find ct′, Δt′ or Δx′ (Show that 1 or 2, Determine 2): P3 May 2024 TZ1 Q5(b)(iv), P3 May 2019 TZ1 Q5(c) and (d)(i), P3 May 2017 TZ1 Q4(d)(iv), P3 May 2023 TZ2 Q5(c), P2 May 2026 TZ2 Q5(d), P2 May 2025 TZ2 Q6(b)(ii) (Determine 3), P3 May 2018 TZ2 Q5(b)(ii).

**Transformations and velocity addition**

17. Coordinates of an event by the Lorentz transformation (Calculate, Show that or Determine, 2): P2 May 2026 TZ3 Q4(c), P3 Nov 2018 Q5(a)(ii), P3 May 2023 TZ1 Q4(b)(i), P3 Nov 2023 TZ2 Q5(c)(ii), P3 May 2024 TZ2 Q4(b)(ii).
18. Relativistic velocity addition (Calculate, Show that or Determine, 1 or 2; multiple choice): P3 May 2024 TZ1 Q4(a), P3 May 2023 TZ2 Q4(d), P3 Nov 2020 Q4(c), P3 Nov 2023 TZ2 Q5(b)(ii), P3 May 2024 TZ2 Q3(c)(i), P3 Nov 2024 Q3(b) (light: still c); P1A May 2026 TZ1 Q9, P1A May 2026 TZ2 Q9, P1A May 2025 TZ1 Q9.
19. Galilean velocity addition, and what it gets wrong (State, Write down or Calculate 1; Outline 1): P3 Nov 2024 Q3(a), P3 May 2023 TZ2 Q4(b), P3 May 2018 TZ2 Q3(a)(i) and (b), P3 May 2019 TZ1 Q3(a), P3 May 2019 TZ2 Q4(a)(ii); a length by Galilean relativity (P3 May 2024 TZ1 Q3(a)); what the Galilean transformation assumes (Outline 1: P3 Nov 2020 Q4(a)); light in a moving box by the Galilean transformation (Explain 2, Show that 1: P3 Nov 2018 Q3(b)(i) and (ii)).
20. Meaning of a reference frame, or an inertial frame (State or Define 1): P3 May 2023 TZ2 Q3(a), P3 May 2017 TZ1 Q3(a), P3 Nov 2018 Q3(a), P3 May 2019 TZ2 Q4(a)(i), P3 Nov 2017 Q5(a).

Check the mark schemes' wording before writing model answers (the PDFs are on Alex's PC: `IB Spec Analysis\Past Paper`).

## Suggested tabs (for the Opus chat to decide with Alex)

- **Space–Time Diagrams:** frame `part=event` (or `part=dilation&v=…` to follow Muon Numbers), then a frame of `show=predict` for the drawing kinds 5 to 9, and a Calculate card for kinds 1 and 2 with the page's own small diagram or a described one.
- **Simultaneity and Interval:** frame `part=simul`; Quick check or Predict for kinds 10 to 12; Calculate for kinds 13, 14 and 16; a one-mark "invariant" Explain (kind 15).
- **Transformations:** frame `part=velocity`; Calculate for kinds 17 to 19 (Lorentz, velocity addition, Galilean beside it), with light as the special case.
- The Exam tab's structured question could gain a space–time diagram part; the Sum Up word boxes need a third box for simultaneity and the interval.
