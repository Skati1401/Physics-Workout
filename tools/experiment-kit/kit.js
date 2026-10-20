/* ================= Experiment kit (copy this block into an animation page's <script>) =================
   The reusable parts of an animation's Experiment mode, taken from animations/hookes-law.html:
   - expRun():     the run itself: step the independent variable up one interval at a time, then
                   (optionally) back down again, measuring at every step
   - expReading(): a reading with a small, fixed pattern of reading error, rounded to the instrument's
                   resolution, that never goes the wrong way
   - expTable():   the results table (sticky header, newest row highlighted, a column per run)
   - expCross(), expRing(), expKey(): SVG marks for plotted readings (× first run, ○ return run)
   The page keeps its own picture, physics, graph axes and notes. See tools/experiment-kit/README.md.
   Plain ES5 so it can sit inside any animation page's IIFE. */

// A fixed pattern of reading errors, in units of the instrument's resolution. Fixed (not random) so a
// teacher sees the same results as the class, and a re-run gives the same table.
var EXP_ERR = [0, 1, -1, 0, 2, -1, 1, -2, 0, 1, -1, 0, 1, -1, 2, 0, -1, 1, 0, -2, 1];
function expErr(i){ return EXP_ERR[((i % EXP_ERR.length) + EXP_ERR.length) % EXP_ERR.length]; }

// What the student reads off the instrument.
//   trueVal  the value the physics gives at this step
//   prevVal  the reading taken at the step before (or the start value)
//   res      the instrument's resolution (0.1 cm ruler, 0.05 mm vernier, 0.01 A ammeter, 1° protractor)
//   i        the step number (picks the error from the pattern)
//   scale    how big the error is, in resolutions (default 1; 0.5 for a fine instrument)
// The error is never more than a quarter of the change since the last reading, so a reading never
// goes the wrong way (an extension never falls as the load rises, a current never drops as V rises).
function expReading(trueVal, prevVal, res, i, scale){
  var gap = Math.abs(trueVal - prevVal);
  var err = i > 0 ? expErr(i) * Math.min(res * (scale == null ? 1 : scale), gap / 4) : 0;
  var r = Math.round((trueVal + err) / res) * res;
  var dp = Math.max(0, Math.ceil(-Math.log10(res) - 1e-9));
  return +r.toFixed(dp);
}

// The run. cfg = {
//   start: 0,                 value of the independent variable before the first step
//   max: 10,                  last value of the first run (the run stops there)
//   step: 1,                  the interval (the page can change it with setStep, which resets the run)
//   reverse: true,            allow a return run (unloading, turning the voltage back down)
//   measure: function(v, phase, prevReading){ return reading },   phase is 'up' or 'down'
//   onChange: function(run, what){}  what is 'up', 'down' or 'reset'
// }
// run.up and run.down are arrays of {v, r}. run.phase is 'up' until the first step back, then 'down'.
function expRun(cfg){
  var run = { up: [], down: [], phase: 'up', value: cfg.start || 0, peak: cfg.start || 0, step: cfg.step || 1 };
  var r6 = function(x){ return Math.round(x * 1e6) / 1e6; };
  run.upDone = function(){ return run.phase === 'down' || run.peak >= cfg.max - 1e-9; };
  run.downDone = function(){ return run.phase === 'down' && run.value <= (cfg.start || 0) + 1e-9; };
  run.last = function(){ var a = run.phase === 'down' && run.down.length ? run.down : run.up; return a[a.length - 1] || null; };
  run.stepUp = function(){
    if(run.phase !== 'up' || run.upDone()) return false;
    var prev = run.up.length ? run.up[run.up.length - 1].r : null;
    var v = r6(Math.min(cfg.max, run.value + run.step));
    run.value = run.peak = v;
    run.up.push({ v: v, r: cfg.measure(v, 'up', prev) });
    if(cfg.onChange) cfg.onChange(run, 'up');
    return true;
  };
  run.stepDown = function(){
    if(!cfg.reverse || run.value <= (cfg.start || 0) + 1e-9 || !run.up.length) return false;
    run.phase = 'down';
    var prev = run.down.length ? run.down[run.down.length - 1].r : run.up[run.up.length - 1].r;
    var v = r6(Math.max(cfg.start || 0, run.value - run.step));
    run.value = v;
    run.down.push({ v: v, r: cfg.measure(v, 'down', prev) });
    if(cfg.onChange) cfg.onChange(run, 'down');
    return true;
  };
  run.reset = function(){ run.up = []; run.down = []; run.phase = 'up'; run.value = run.peak = cfg.start || 0; if(cfg.onChange) cfg.onChange(run, 'reset'); };
  run.setStep = function(s){ run.step = s; run.reset(); };
  return run;
}

// The results table. cols = [{label:'Load (N)', key:'v', dp:0}, {label:'Extension loading (cm)', key:'up', dp:1}, ...]
// rows = [{v:1, up:1.6, down:''}, ...]. newKey/newV highlight the reading just taken (fades in).
// Wrap it in .rtable-wrap so a long table scrolls under its sticky header.
function expTable(el, cols, rows, newV){
  var fmt = function(x, dp){ return (x === '' || x == null) ? '' : (+x).toFixed(dp || 0); };
  var h = '<table class="rtable"><thead><tr>' + cols.map(function(c){ return '<th>' + c.label + '</th>'; }).join('') + '</tr></thead><tbody>';
  rows.forEach(function(row){
    h += '<tr' + (newV != null && row.v === newV ? ' class="new"' : '') + '>' + cols.map(function(c){ return '<td>' + fmt(row[c.key], c.dp) + '</td>'; }).join('') + '</tr>';
  });
  el.innerHTML = h + '</tbody></table>';
}

// Plotted readings, as SVG strings. Size 5 suits a 300px-wide graph.
function expCross(cx, cy, s){ s = s || 5; return '<path d="M' + (cx - s) + ',' + (cy - s) + ' L' + (cx + s) + ',' + (cy + s) + ' M' + (cx + s) + ',' + (cy - s) + ' L' + (cx - s) + ',' + (cy + s) + '" stroke="var(--ink)" stroke-width="2"/>'; }
function expRing(cx, cy, r){ return '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r || 4.5) + '" fill="none" stroke="var(--accent)" stroke-width="2"/>'; }
// A two-line key in the bottom-right corner of a graph: expKey(rightX, bottomY, 'loading', 'unloading')
function expKey(x, y, upLabel, downLabel){
  return '<text x="' + x + '" y="' + (y - 14) + '" text-anchor="end" font-size="10.5" fill="var(--ink)">× ' + upLabel + '</text>' +
         '<text x="' + x + '" y="' + y + '" text-anchor="end" font-size="10.5" fill="var(--accent)">○ ' + downLabel + '</text>';
}
/* ================= end of Experiment kit ================= */
