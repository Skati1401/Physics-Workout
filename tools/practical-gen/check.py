"""Answer every graded activity on a built core practical page in Playwright, and report.

    python3 -m http.server 8765 &                                  # from the repo root (frames need http://)
    python3 tools/practical-gen/check.py motion-practical.html      # add --shots DIR to save a screenshot of every tab

For each Calculate, Predict, Spot the error, Sort, Fill in the blanks, Match, Order and Plot it fills in the intended
answers (taken from the page's own data) and prints the page's verdict. A Predict whose right answer is the longest
option is flagged, so the options can be evened up. Then it clicks every tab at 1366px and 380px, reporting any
sideways scroll and each framed animation's height against its inner page (they should match). Ends with page errors.
"""
import sys, json, re, os
from playwright.sync_api import sync_playwright

URL = 'http://localhost:8765/'
page_file = sys.argv[1]
SHOTS = '--shots' in sys.argv
OUT = sys.argv[sys.argv.index('--shots') + 1] if SHOTS else None
if OUT: os.makedirs(OUT, exist_ok=True)

INSTR = ['Calc', 'SortGame', 'MatchGame', 'BlankGame', 'Reorder', 'Predict', 'Spot', 'Plot']

def instrument(html):
    for n in INSTR:
        html = html.replace('function create%s(cfg){' % n, 'function create%s(cfg){window.__R.push(["%s",cfg]);' % (n, n), 1)
    return '<script>window.__R=[];</script>' + html

ANSWER_JS = r"""
async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  function tap(el){
    const r = el.getBoundingClientRect(), x = r.left + r.width/2, y = r.top + r.height/2;
    el.dispatchEvent(new PointerEvent('pointerdown', {bubbles:true, pointerId:7, button:0, clientX:x, clientY:y}));
    document.dispatchEvent(new PointerEvent('pointerup', {bubbles:true, pointerId:7, button:0, clientX:x, clientY:y}));
  }
  const show = el => { const p = el.closest('.panel'); document.getElementById('tab-' + p.id.slice(6)).click(); return p.id.slice(6); };
  const out = [];
  for (const [kind, c] of window.__R) {
    let host = c.host || c.pool, tab = show(host), res = '';
    await sleep(30);
    try {
    if (kind === 'Calc') {
      const rows = [...host.querySelectorAll('.calc-num-input')].slice(-c.questions.length);
      // find the inputs belonging to this calc: the last calc-inputs added under host with this many rows
      const wraps = [...host.querySelectorAll('.calc-inputs')];
      const wrap = wraps.find(w => w.querySelectorAll('.calc-num-input').length === c.questions.length && !w.dataset.done);
      wrap.dataset.done = 1;
      const inps = [...wrap.querySelectorAll('.calc-num-input')];
      c.questions.forEach((q, i) => { inps[i].value = String(q.answer); });
      const btn = wrap.nextElementSibling.querySelector('.btn.primary'); btn.click();
      res = wrap.nextElementSibling.querySelector('.fb').textContent + ' | ' + c.questions.map(q => q.q.slice(0, 40) + '=' + q.answer).join(' ; ');
    } else if (kind === 'Predict') {
      const right = c.options.filter(o => o.correct);
      const lens = c.options.map(o => o.text.length);
      const btn = [...host.querySelectorAll('.pred-opt')].find(b => b.textContent === right[0].text);
      btn.click();
      const longest = Math.max(...lens) === right[0].text.length && lens.filter(l => l === right[0].text.length).length === 1;
      res = (host.querySelector('.pred-out').textContent.startsWith('That is right') ? 'OK' : 'FAIL') + (right.length !== 1 ? ' NCORRECT=' + right.length : '') + (longest ? ' (right answer is the longest)' : '') + ' lens=' + lens.join(',');
    } else if (kind === 'Spot') {
      const blk = [...host.querySelectorAll('.err-block')].find(b => !b.dataset.done); blk.dataset.done = 1;
      blk.querySelectorAll('.err-line')[c.wrong].click();
      res = blk.querySelector('.err-fb').textContent.startsWith('Found it') ? 'OK' : 'FAIL';
    } else if (kind === 'SortGame') {
      const pool = host.querySelector('.sort-pool'), bins = host.querySelector('.bins');
      for (const it of c.items) {
        const e = pool.querySelector('[data-item="' + it.id + '"]'); tap(e);
        bins.querySelector('[data-cat="' + it.cat + '"]').click();
      }
      host.querySelector('.bar .btn.primary').click();
      res = host.querySelector('.bar .fb').textContent;
    } else if (kind === 'BlankGame') {
      for (const s of c.slots) {
        const chip = [...c.pool.querySelectorAll('.chip')].find(ch => c.isCorrect(c.chips.find(x => x.id === ch.dataset.chip), s));
        if (!chip) { res += 'NO CHIP for ' + s.id + '; '; continue; }
        tap(chip); s.el.click();
      }
      // second chips that would also be correct in a gap
      const dup = c.slots.map(s => c.chips.filter(ch => c.isCorrect(ch, s)).length).filter(n => n > 1).length;
      const bar = c.pool.parentNode.querySelector('.bar'); bar.querySelector('.btn.primary').click();
      res += bar.querySelector('.fb').textContent + (dup ? ' (' + dup + ' gaps with 2 correct chips)' : '');
    } else if (kind === 'MatchGame') {
      for (const p of c.pairs) {
        tap(host.querySelector('.match-card[data-side="L"][data-id="' + p.id + '"]'));
        tap(host.querySelector('.match-card[data-side="R"][data-id="' + p.id + '"]'));
      }
      host.querySelector('.bar .btn.primary').click();
      res = host.querySelector('.bar .fb').textContent;
    } else if (kind === 'Reorder') {
      const ids = c.steps.map(s => s.id);
      const list = host.querySelector('.reorder');
      for (let k = 0; k < ids.length; k++) {
        let cur = [...list.children].map(li => li.dataset.id);
        let i = cur.indexOf(ids[k]);
        while (i > k) { list.children[i].querySelectorAll('.mv button')[0].click(); i--; }
      }
      host.querySelector('.bar .btn.primary').click();
      res = host.querySelector('.bar .fb').textContent.slice(0, 60);
    } else if (kind === 'Plot') {
      const o = c.graph, pl = 58, pr = 18, pt = 16, pb = 50;
      const gx = x => pl + (x - o.xMin) / (o.xMax - o.xMin) * (o.W - pl - pr), gy = y => o.H - pb - (y - o.yMin) / (o.yMax - o.yMin) * (o.H - pt - pb);
      for (const p of c.points) {
        const svg = host.querySelector('.plot-svg'); svg.scrollIntoView({block:'center'});
        const r = svg.getBoundingClientRect();
        svg.dispatchEvent(new MouseEvent('click', {bubbles:true, clientX: r.left + gx(p.x) / o.W * r.width, clientY: r.top + gy(p.y) / o.H * r.height}));
      }
      host.querySelector('.plot-side .btn.primary').click();
      res = host.querySelector('.plot-side .fb').textContent;
    }
    } catch (e) { res = 'ERROR ' + e.message; }
    out.push([tab, kind, res]);
  }
  return out;
}
"""

with sync_playwright() as p:
    b = p.chromium.launch()
    errors = []
    ctx = b.new_context(viewport={'width': 1366, 'height': 900})
    pg = ctx.new_page()
    pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.on('console', lambda m: m.type == 'error' and 'ERR_TUNNEL' not in m.text and errors.append('console: ' + m.text))
    def handler(route):
        r = route.fetch(); route.fulfill(response=r, body=instrument(r.text()))
    pg.route('**/' + page_file, handler)
    pg.goto(URL + page_file); pg.wait_for_timeout(500)
    res = pg.evaluate(ANSWER_JS)
    for r in res:
        print('%-11s %-10s %s' % tuple(r))
    pg.wait_for_timeout(1200)
    # frames: heights vs inner scrollHeight
    tabs = pg.eval_on_selector_all('.tab-btn', 'b=>b.map(x=>x.dataset.tab)')
    for w in (1366, 380):
        pg.set_viewport_size({'width': w, 'height': 800})
        for t in tabs:
            pg.click('#tab-' + t); pg.wait_for_timeout(700)
            sw = pg.evaluate('document.documentElement.scrollWidth')
            fr = pg.evaluate("""()=>[...document.querySelectorAll('.panel:not([hidden]) iframe.anim-frame')].map(f=>{const d=f.contentDocument;return [Math.round(f.getBoundingClientRect().height), d?d.documentElement.scrollHeight:-1, d?d.documentElement.scrollWidth:-1, Math.round(f.getBoundingClientRect().width)]})""")
            bad = sw > w
            if bad or fr:
                over = pg.evaluate("w=>[...document.querySelectorAll('.panel:not([hidden]) *')].filter(e=>e.getBoundingClientRect().right>w+1).slice(0,4).map(e=>e.className+':'+(e.textContent||'').slice(0,40))", w) if bad else ''
                print('w=%d tab=%s scrollWidth=%d frames=%s %s' % (w, t, sw, fr, over))
            if SHOTS:
                pg.screenshot(path='%s/%s-%s-%d.png' % (OUT, page_file[:-5], t, w), full_page=True)
    print('errors:', errors or 'none')
    b.close()
