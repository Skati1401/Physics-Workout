// node tools/experiment-kit/kit.test.js
// Checks the kit's promises: readings are on the instrument's resolution, sit close to the true value,
// never go the wrong way, and a run steps up to max and back to the start.
const fs = require('fs'), path = require('path'), assert = require('assert');
eval(fs.readFileSync(path.join(__dirname, 'kit.js'), 'utf8'));

const curves = {
  linear: v => 1.5 * v,
  sCurve: v => { const L = f => 1 / (1 + Math.exp(-(f - 4) / 1.4)); return 20 * (L(v) - L(0)) / (L(10) - L(0)); },
  stiffening: v => 9 * (1 - Math.exp(-v / 3)),          // flattens out: tiny changes at the top
  wire: v => v <= 7 ? 0.25 * v : 1.75 + 0.25 * (v - 7) + 0.6 * (v - 7) * (v - 7),
  falling: v => 10 - 0.8 * v                            // a reading that goes down as v goes up
};
let checks = 0;
for (const [name, f] of Object.entries(curves)) {
  for (const res of [0.1, 0.05, 0.01]) {
    for (const step of [0.5, 1, 2]) {
      const run = expRun({ start: 0, max: 10, step, reverse: true,
        measure: (v, phase, prev) => expReading(f(v), prev == null ? f(0) : prev, res, Math.round(v / step), res === 0.05 ? 0.5 : 1) });
      while (run.stepUp());
      assert(run.upDone(), name + ': up run should end at max');
      assert.strictEqual(run.up[run.up.length - 1].v, 10);
      while (run.stepDown());
      assert(run.downDone(), name + ': down run should end at the start');
      const seq = [{ v: 0, r: f(0) }].concat(run.up);
      for (let i = 1; i < seq.length; i++) {
        const dTrue = f(seq[i].v) - f(seq[i - 1].v), dRead = seq[i].r - seq[i - 1].r;
        if (Math.abs(dTrue) >= res) assert(Math.sign(dRead) === Math.sign(dTrue) || dRead === 0,
          `${name} res ${res} step ${step}: reading went the wrong way at v=${seq[i].v}`);
        assert(Math.abs(seq[i].r - f(seq[i].v)) <= 2.6 * res, `${name}: reading too far from the true value at v=${seq[i].v}`);
        const onGrid = Math.abs(seq[i].r / res - Math.round(seq[i].r / res)) < 1e-6;
        assert(onGrid, `${name}: ${seq[i].r} is not on the ${res} resolution`);
        checks++;
      }
      run.setStep(step);
      assert.strictEqual(run.up.length, 0, 'setStep resets the run');
    }
  }
}
// expTable renders a highlighted row
const el = { innerHTML: '' };
expTable(el, [{ label: 'V', key: 'v' }, { label: 'I (A)', key: 'up', dp: 2 }], [{ v: 1, up: 0.1 }, { v: 2, up: 0.2 }], 2);
assert(el.innerHTML.includes('<tr class="new"><td>2</td><td>0.20</td>'));
console.log('experiment kit: all checks passed (' + checks + ' readings)');
