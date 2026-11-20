# 5w Half-life: hand-off from part 1 (the animation) to part 2 (the practical pages)

Written 16 Nov 2026 after part 1; copied into the repo 20 Nov 2026 so a batch run on Alex's PC can read it, with Alex's decisions on the open points (bottom). Part 1 is done and live (commit `299cfe5`). Part 2, the practical pages built with `gen.py`, is the batch.

## Links

| Level | Measure mode | Frame it with |
|---|---|---|
| IGCSE | `animations/random-decay.html?show=measure&level=igcse` | `frameAct('do', 'animations/random-decay.html', 'measure&level=igcse', …)` |
| IAL | `animations/random-decay.html?show=measure&level=ial` | `'measure&level=ial'` |
| IB | `animations/random-decay.html?show=measure&level=ib` | `'measure&level=ib'` |

- No `&level=` gives IGCSE. The level fixes the sample and its readings; the Level switch is hidden.
- Watch Experiment: the page's existing Experiment mode (`random-decay.html?embed&level=…`, Experiment button) is unchanged. It counts nuclei N at random for Rn-220, Pa-234m or Ba-137m; it has no counter and no background, so it does not match Do Experiment's numbers.
- Repo: `animations/random-decay.html` (`MEAS_SET`, `measDraw`, `measMain`, `measBg`), `tools/CORE-PRACTICALS.md` "Measure modes" (the readings), `tools/REVIEW.md` (row 🔍), `TODO.md` 5w.

## What the student does

1. **Count the background**: the sample is shut in its lead box; the counter runs for a long count and stops. Read the counter and its timer.
2. **Put in the sample**: the stopwatch starts and the first 10 s count begins at once.
3. **Take the next count**: the stopwatch runs on to the next fixed time, is held there, and the counter counts for 10 s. Read the stopwatch (m:ss, the time the count started) and the counter.
4. After the last count the sample goes back in its box. The background can be counted before the run or after it, not during it.

A reading cannot be taken again (the sample has decayed). Reset starts the run again and gives the same readings. Nothing else is shown: no graph, working, reading boxes, isotope name or half-life.

## Fixed readings

`MEAS_SET` in the animation must equal `HL_SET` in each practical's `content.js`; put a comment in each file naming the other. Check these numbers against `MEAS_SET` before using them.

| | IGCSE, sample X | IAL, sample Y | IB, sample Z |
|---|---|---|---|
| Tidy result | half-life 60 s | λ = 0.0100 s⁻¹ (t½ = 69.3 s) | half-life 80 s (HL: λ = 8.66 × 10⁻³ s⁻¹) |
| Background | 30 counts in 60 s | 120 counts in 300 s | 72 counts in 120 s |
| Background rate | 0.5 counts/s (5 per 10 s) | 0.40 s⁻¹ | 0.60 s⁻¹ |
| Count starts every | 20 s, 0 to 180 s | 30 s, 0 to 210 s | 40 s, 0 to 320 s |
| Counts in 10 s | 409, 325, 251, 209, 161, 131, 101, 85, 71, 54 | 610, 455, 321, 251, 184, 138, 103, 78 | 480, 337, 250, 180, 121, 91, 67, 47, 36 |
| Corrected count rate (per s) | 40.4, 32.0, 24.6, 20.4, 15.6, 12.6, 9.6, 8.0, 6.6, 4.9 | 60.6, 45.1, 31.7, 24.7, 18.0, 13.4, 9.9, 7.4 | 47.4, 33.1, 24.4, 17.4, 11.5, 8.5, 6.1, 4.1, 3.0 |
| ln (rate / s⁻¹) | not needed | 4.104, 3.809, 3.456, 3.207, 2.890, 2.595, 2.293, 2.001 | HL: 3.859, 3.500, 3.195, 2.856, 2.442, 2.140, 1.808, 1.411, 1.099 |
| Best fit | C = 40.0 × (½)^(t/60) | gradient −0.0100 s⁻¹, intercept 4.095; through (30, 3.795) and (180, 2.294) | 47.7 × (½)^(t/80); HL line gradient −8.66 × 10⁻³ s⁻¹, intercept 3.865; through (20, 3.692) and (300, 1.266) |
| Safe plot snap | 0.5 counts/s | 0.05 in ln C | 0.5 s⁻¹; 0.05 in ln |

- IGCSE: the curve gives 40 → 20 → 10 → 5 counts/s at 0, 60, 120, 180 s. Accept about 56 to 64 s from a student's own curve. The table alone does not show an exact halving, so the graph is needed.
- IB: four equal half-lives of 80 s on the curve (47.7 → 23.9 → 11.9 → 6.0 → 3.0), which suits a "show the half-life is constant" part.

## The model

- Count in 10 s = 10 × (C₀e^(−λt) + B), plus a small fixed scatter (about 2% in ln C). C is the count rate from the sample alone, B the background count rate.
- Each count is the mean rate over its 10 s, written against the time the count started. This scales every reading by one factor, so the half-life and the ln gradient are unchanged.
- The count rate is not the activity: the tube detects only part of the radiation. The animation sets no detection fraction (see decision 3).

## Symbols

Taken from the wording in the three question indexes; check against the spec and data booklet before writing the pages.

| | IGCSE | IAL | IB |
|---|---|---|---|
| Count rate | count rate, counts per second | C (the WPH16 papers plot ln C against t); s⁻¹ | count rate, s⁻¹ |
| Activity | activity, Bq | A; A = λN, A = A₀e^(−λt) | A; A = λN (HL) |
| Half-life | half-life | t½; λ = ln 2 / t½ | T½; T½ = ln 2 / λ (HL) |
| Decay constant | not used | λ, s⁻¹ | λ, HL only |

## Past-paper parts to model the questions on

From the IGCSE Physics Question Index, the IAL Past Paper Index and the IB Physics Question Index (index rows only, read 16 Nov 2026; open the mark scheme pages for the wording where you can).

**IGCSE (7.10 to 7.13)**

| Kind | Part | QP p | MS p |
|---|---|---|---|
| Describe measuring and correcting for background | 4PH0/1P Jan 2014 Q12(a)(ii) | 26 | 20 |
| Plot corrected count rate against time, curve of best fit | 4PH0/1P Jan 2014 Q12(a)(iii); 4PH0/1P Jan 2012 Q6(b)(i); 4420/03 Jun 2007 Q4(d)(i) | 27; 14; 11 | 21; 9; 23 |
| Half-life from the graph (lines drawn) | 4PH0/1P Jan 2014 Q12(a)(iv); 4PH1/1P May 2023 Q1(c)(iii); 4PH1/1P Nov 2024 Q4(c)(ii); 4PH0/2P Jan 2016 Q6(c)(i) | 27; 5; 11; 13 | 21; 4; 8; 10 |
| Uncorrected reading: subtract background, then read the time | 4420/03 Jun 2007 Q4(e)(ii) | 12 | 23 |
| Why only one reading at each time | 4420/03 Jun 2007 Q4(f) | 12 | 23 |
| Why readings every 20 s | 4PH0/2P Jan 2016 Q6(c)(ii) | 13 | 10 |
| Circle the anomalous point; why points miss the curve (random) | 4PH1/1P May 2023 Q1(c)(ii), (iv) | 5 | 4 |
| Method with a GM tube and counter | 4PH0/2P May 2013 TZ1 Q1(c) | 5 | 3 |

**IAL (137, 141, 142)**

| Kind | Part | QP p | MS p |
|---|---|---|---|
| Why measure background; how to get the source's count rate | WPH16/01 Jan 2022 Q3(b); WPH16/01A Jun 2026 Q3(b); 9PH0/03 Jun 2017 Q10(a) | 9; 6; 17 | 6; 8; 17 |
| Explain how ln C against t gives λ | WPH16/01 Jan 2022 Q3(c); WPH16/01A Jun 2026 Q3(c)(i) | 9; 6 | 6; 8 |
| Process ln C and plot ln C against t | WPH16/01 Jan 2022 Q3(d)(i); WPH16/01A Jun 2026 Q3(c)(ii) | 10–11; 7 | 6; 8 |
| λ from the gradient, then half-life | WPH16/01 Jan 2022 Q3(d)(ii), (iii); WPH16/01A Jun 2026 Q3(c)(iii) | 10–11; 7 | 6; 9 |
| Effect of a shorter half-life on the ln graph | WPH16/01A Jun 2026 Q3(c)(iv) | 7 | 9 |
| Half-life from a count-rate graph by two halvings; why it never reaches zero | 9PH0/03 Jun 2022 Q8(b)(i), (ii) | 14–15 | 14 |
| Criticise a method (no background, short count); modifications | 9PH0/03 Nov 2021 Q2(a); WPH05/01 Jan 2019 Q17(b) | 4; 15 | 7; 12 |
| Why λ can be found although decay is random | 9PH0/02 Jun 2024 Q19(a)(ii) | 26 | 20 |

WPH16 Jan 2022 Q3 is reserved for topic tests and WPH16/01A Jun 2026 Q3 for the mock: model the kinds on them, do not reuse their data.

**IB (E.3)**

| Kind | Part | QP p | MS p |
|---|---|---|---|
| State the background from a count rate–time graph; half-life after subtracting it | P2 SL/HL Nov 2025 TZ3 Q4(a)(i), (ii) | 13–14 | 8 |
| Why the curve levels off above zero; half-life after subtracting background | P3 SL/HL Nov 2023 TZ2 Q2(a), (b) | 8 | 6 |
| Outline how count rates are corrected for background | P2 SL/HL May 2022 TZ2 Q5(a) | 15 | 11 |
| Show successive half-lives are equal; predict three half-lives | P1B SL/HL Nov 2025 TZ1 Q3(b), (c) | 12 | 8–9 |
| Background from two count rates a half-life apart (MC) | P1A SL Nov 2025 TZ1 Q23; P1 HL Nov 2021 Q20 | 13; 13 | 3; 3 |
| HL: λ from the gradient of ln (activity) against time (MC) | P1 HL Nov 2018 Q39 | 22 | 2 |
| HL: λ from two activities, then half-life | P2 HL May 2010 TZ2 QB1 Part 2(c) | 11 | 8 |
| HL: compare methods for a short and a very long half-life | P2 HL May 2021 TZ1 Q7(c) | 18 | 14 |

The Nov 2025 parts are reserved for the mock and Nov 2023 P3 and May 2022 Q5 for topic tests: model the kinds on them, do not reuse their data.

## Decisions (Alex, 20 Nov 2026)

1. **Three pages, one per level**, each its own `gen.py` practical with its own `course`: IGCSE (card in its unit on `igcse.html`), IAL (card on `ial.html`), IB (card in the Practicals section of `ib.html`, `#unit-cp`, which is `hidden` until its first card). The comment above `MEAS_SET` in `random-decay.html` names one folder, `practicals/half-life/`: change it to the three folders you make.
2. **IGCSE count rate in counts per second** (corrected count = count in 10 s minus 5, divided by 10).
3. **No A = λN**, so no detection fraction is needed. The pages work with count rate only.
4. **IB page: SL plots the corrected count rate against time and reads the half-life; the ln graph and λ are HL parts**, labelled "HL" as on the other IB pages.
