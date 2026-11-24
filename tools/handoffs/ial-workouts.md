# IAL workouts: the plan (6b, 24 Nov 2026)

The plan for the IAL workouts, Unit 5 first, then Unit 1 (Alex's order, `TODO.md` top). Each workout is one `TODO.md` item in section 6 (6c to 6r) and one Opus chat on the school account. Units 2 and 4 are planned later (6s).

## Rules for every IAL workout

- **Size:** the IGCSE rule in `tools/WORKOUT-RULES.md` ("How big a workout is"): one spec topic or a group of points, 5–8 short tabs, Warm Up first and Sum Up last, 15–30 minutes. IAL pages also end with an **Exam** tab before Sum Up (as `alpha-scattering-ial.html` and `relativity.html`): one original exam-style question, marked part by part.
- **Shell and engine:** copy from `alpha-scattering-ial.html` (the first IAL workout). Breadcrumb "Workouts › IAL › Unit n ›" to `ial.html#unit-n`. `STORE_KEY` `ial-<points>-<topic>-v1`.
- **IB twins:** where the same topic is in the IB guide and in Alex's IB order, build the IAL page and the IB page from one source in the same chat, the way `tools/alpha-scattering/` does (`page.html` branching on the level, `build.py` writing both pages). The IAL page is `<topic>-ial.html`, the IB page `<topic>.html` (check the root for a clash first: `radioactivity.html`, `gases.html` and `space.html` are IGCSE). Twins are marked below. **Alex, 24 Nov 2026: yes to the twins for 6c (C.1), 6d (E.3) and 6g (E.5), and 6d stays second** (IAL taught, but IB E.3 is third in the IB order).
- **Frames:** each tab frames the animation that already has an IAL level (`?embed&level=ial`, naming its part or show). The query strings are in `tools/PAGE-NOTES.md`. Practicals are links on the tab row (`.tab-btn.tab-cp`), never frames.
- **Question kinds and wording:** from the IAL Past Paper Index and the WPH1x mark schemes on the school Drive (load `alex-school-drive`). Reserved papers (IAL from 2020) may lend wording and a similar example, never the same question. Model answers use the mark schemes' words.
- **List:** `ial.html` gets a section per unit in unit-number order (`#unit-1`, `#unit-5`; Unit 4 and Core Practicals are there already), as collapsible units like `igcse.html`. Card title "<Topic> Workout", one line saying what students do, spec points in brackets. The first chat in each unit adds the section.
- **Review:** each page 🔍 in `tools/REVIEW.md`; notes in `tools/PAGE-NOTES.md`.

## Unit 5 (build order: still to teach first, then the IB twins that are still to teach)

Alex has taught Thermodynamics and Nuclear decay; Oscillations and Astrophysics are next. IB C.1 is next in the IB order, then E.3.

| ID | Workout | Points | Tabs (Warm Up, …, Exam, Sum Up) | Frames | Practical links | IB twin |
|---|---|---|---|---|---|---|
| 6c | Simple Harmonic Motion | 143–147, 150 (undamped energy) | The SHM Condition (F = −kx, a = −ω²x; is it SHM?), Graphs (x, v, a against t; gradients), SHM Equations (x = A cos ωt and friends, ω = 2πf), Springs and Pendulums (T = 2π√(m/k), T = 2π√(l/g)), Energy | `simple-harmonic-motion.html` (Spring, Pendulum, graphs, energy, reference circle 9a) | CP16 resonance | **C.1** (next in IB order): HL adds x = x₀ sin(ωt + ϕ), v = ±ω√(x₀² − x²), E<sub>T</sub> = ½mω²x₀² |
| 6d | Radioactive Decay | 137–142 | Alpha, Beta, Gamma (nature, penetration, ionising, range; background), Nuclear Equations, Random Decay, Half-Life (from a graph), Decay Equations (A = λN, λ = ln 2 / t½, N = N₀e<sup>−λt</sup>, ln form) | `film-badge.html`, `gamma-radiation.html`, `decay-chart.html`, `random-decay.html`, `isotope-choice.html` | CP15 gamma absorption, IAL half-life practical | **E.3** decay half (IB order 3rd): SL integer half-lives, HL λ and the exponential |
| 6e | Damping and Resonance | 148, 150 (damped), 151–153 | Free and Forced, Resonance (amplitude around the natural frequency), Damping (light, heavy; effect on resonance), Damping in Buildings (earthquakes, plastic deformation of ductile materials) | `oscillations.html`, `simple-harmonic-motion.html` (damping) | CP16 resonance | Optional: C.4 (standing waves and resonance) would need standing-wave tabs at IB only; decide in the chat |
| 6f | Gravitational Fields | 154–160 | Field Strength (g = F/m, g = Gm/r², derive it), Newton's Law of Gravitation, Potential (V = −Gm/r), Orbits (gravity as the centripetal force), Gravity and Electric Fields (compare) | `orbits.html`, `weight-on-planets.html` (IAL levels from 7j) | — | None (D.1 is not in the IB order) |
| 6g | Stars | 161–163, 167, 168 | Black Bodies (radiation curves), Wien's Law, Luminosity (L = σAT⁴, a star's radius), The HR Diagram, Life Cycle of a Star | `wiens-law.html`, `star-life-cycle.html`, `star-clusters.html` | — | **E.5** (IB order): adds parallax in parsecs, b = L/4πd², fusion and the instability strip at IB only |
| 6h | Distances and the Expanding Universe | 164–166, 169–171 | Parallax, Standard Candles (I = L/4πd²), Red-Shift (Doppler, z = Δλ/λ ≈ v/c), Hubble's Law (v = H₀d, the age 1/H₀), The Fate of the Universe (H₀ controversy, dark matter) | `parallax.html`, `standard-candles.html`, `doppler-effect.html`, `red-shift.html` | — | None (no cosmology in IB 2025) |
| 6i | Mass Defect, Binding Energy, Fission and Fusion | 133–136 | Mass and Energy (ΔE = c²Δm, the atomic mass unit), Binding Energy (mass defect, per nucleon curve), Fission, Fusion (why very high temperature and density) | `chain-reaction.html`; the 9g curve and 9h fusion animations once built (so build 6i after them) | — | Decide in the chat: the binding energy part is IB E.3, fission E.4, fusion E.5 |
| 6j | Thermal Energy | 125, 128, 129 (absolute zero) | Heating (ΔE = mcΔθ), Changing State (ΔE = LΔm), Internal Energy, Absolute Zero | `specific-heat.html`, `latent-heat.html`, `thermistor.html` | CP12 thermistor, CP13 latent heat | Optional: B.1 (not in IB order) |
| 6k | Ideal Gases | 129 (KE ∝ T), 130–132 | Gas Laws (p, V and T; a log graph for pV), pV = NkT, Molecules and Pressure, ½m⟨c²⟩ = 3/2 kT (the derivation from 6a) | `gas-molecules.html` (incl. `?show=derive`), `boyles-law.html` | CP14 Boyle's law | Optional: B.3 (not in IB order) |

## Unit 1 (after Unit 5; Paper 3 practicals come between in Alex's order)

| ID | Workout | Points | Tabs (Warm Up, …, Exam, Sum Up) | Frames | Practical links |
|---|---|---|---|---|---|
| 6l | Motion | 1–3 | Displacement–Time (gradient, tangent, average against instantaneous), Velocity–Time (gradient, area, non-uniform), Acceleration–Time, suvat | `motion-graphs.html`, `ramp-motion.html` | CP1 once built (5h) |
| 6m | Vectors and Projectiles | 4–7 | Scalars and Vectors, Resolving, Adding Vectors (drawing; right angles by calculation), Projectiles | `projectile-lab.html`, `shoot-the-monkey.html`, `inclined-plane.html` | — |
| 6n | Forces and Newton's Laws | 8–10, 12 | Free-Body Diagrams (centre of gravity), ΣF = ma, Terminal Velocity, Weight and g, Newton's Third Law | `free-body-diagrams.html`, `newtons-laws.html`, `skydiver.html` | CP1 once built (5h) |
| 6o | Momentum and Moments | 13–16 | Momentum (p = mv, conservation in one dimension), Moments (Fx, perpendicular distance), Centre of Gravity and Equilibrium | `momentum-collision.html`, `seesaw-moments.html` | — |
| 6p | Work, Energy and Power | 17–22 | Work Done (incl. a force at an angle), Kinetic and Potential Energy, Conservation of Energy, Power, Efficiency | `roller-coaster-energy.html` needs an IAL level first (small) | — |
| 6q | Fluids | 23–26 | Density, Upthrust, Stokes' Law and Viscosity (laminar flow, temperature), Falling through a Fluid (weight = upthrust + drag) | `viscosity.html`, `density.html` | CP2 viscosity |
| 6r | Materials | 27–32 | Hooke's Law (stiffness), Stress, Strain and the Young Modulus, Force–Extension Graphs (limit of proportionality, elastic limit, yield point, plastic), Stress–Strain Graphs (breaking stress), Elastic Strain Energy (area, non-linear too) | `hookes-law.html` | CP3 once built (5j) |

IB twins for Unit 1 (A.1 to A.3) are left out: Theme A apart from A.5 is not in Alex's IB order.

## Gaps found while planning

No animation yet for these; each workout covers them with its own activities unless Alex wants an animation:
- L = σAT⁴ (6g): `wiens-law.html` has no Stefan–Boltzmann reading; a Luminosity part there would serve IB B.1 and E.5 too.
- Gravitational potential and field lines (6f): no picture of V = −Gm/r (a potential well) or field lines; the electric fields idea 9n could share one page.
- Upthrust (6q), stress–strain graphs (6r), and an IAL level for `roller-coaster-energy.html` (6p).
