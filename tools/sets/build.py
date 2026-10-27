#!/usr/bin/env python3
"""Build the whole-course set pages (calculations.html, graphs.html) for the IGCSE workouts.

A set page holds no questions of its own. Each section frames a workout in set mode
(page.html?set&tabs=...&kinds=...), which shows only those tabs' activities of those kinds,
so a fix in a workout reaches the set straight away, and answers save to the workout's own
STORE_KEY (work done in a set also ticks the workout). Only workouts with setMode() in their
script can be framed (so far: motion.html, forces.html).

To add a part or unit: add a tab to PARTS below (and setMode() to its workouts), then run
    python3 tools/sets/build.py
Shell: header, fonts, tokens and counter are copied from motion.html.
"""
import html, os, re, urllib.parse
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

CALC = 'Calculate,Spot the error'
GRAPH = 'Label the graph,Calculate'

SETS = {
  'calculations.html': {
    'title': 'Calculations Set', 'kinds': CALC,
    'intro': 'Every calculation from the workouts in one place. Your answers are saved with the workout they come from, so work done here also counts there.',
    'parts': [
      {'id': 'forces1', 'label': 'Forces Part 1', 'head': 'Forces Part 1 (Year 10)', 'sources': [
        {'page': 'motion.html', 'name': '1a Motion Workout', 'tabs': 'calculating'},
        {'page': 'forces.html', 'name': '1b Forces Workout', 'tabs': 'balanced,fma,weight'},
      ]},
    ]},
  'graphs.html': {
    'title': 'Graphs Set', 'kinds': GRAPH,
    'intro': 'Every graph from the workouts in one place: label the line, then work out the numbers from it. Your answers are saved with the workout they come from, so work done here also counts there.',
    'parts': [
      {'id': 'forces1', 'label': 'Forces Part 1', 'head': 'Forces Part 1 (Year 10)', 'sources': [
        {'page': 'motion.html', 'name': '1a Motion Workout', 'tabs': 'stgraph,vtgraph'},
      ]},
    ]},
}

def shell():
    s = open(os.path.join(ROOT, 'motion.html'), encoding='utf-8').read()
    return s[:s.index('<div class="page">')]

EXTRA_CSS = """<style>
  .set-intro{color:var(--ink-soft);margin:4px 0 14px}
  .set-src{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 12px;margin:18px 0 6px}
  .set-src h2{margin:0}
  .set-src a{min-height:44px;display:inline-flex;align-items:center}
  .set-frame{display:block;width:100%;height:900px;border:0;background:transparent}
  .set-todo{margin-top:22px;color:var(--ink-faint)}
</style>
"""

SCRIPT = """<script>
(function(){
  const btns=[...document.querySelectorAll('.tab-btn')],ids=btns.map(b=>b.dataset.tab);
  function show(t){
    if(ids.indexOf(t)<0)t=ids[0];
    btns.forEach(b=>{const on=b.dataset.tab===t;b.classList.toggle('is-active',on);b.setAttribute('aria-selected',on?'true':'false');b.tabIndex=on?0:-1;});
    ids.forEach(id=>{const p=document.getElementById('panel-'+id);p.hidden=id!==t;
      if(id===t)p.querySelectorAll('iframe[data-src]').forEach(f=>{f.src=f.dataset.src;f.removeAttribute('data-src');});});
    try{history.replaceState(null,'','#'+t);}catch(e){}
    try{window.pwCountTab&&pwCountTab(t,document.getElementById('tab-'+t).textContent.trim());}catch(e){}
  }
  btns.forEach(b=>b.addEventListener('click',()=>show(b.dataset.tab)));
  // each framed workout reports its height
  window.addEventListener('message',e=>{const h=e.data&&e.data.setHeight;if(typeof h!=='number')return;
    document.querySelectorAll('iframe.set-frame').forEach(f=>{if(f.contentWindow===e.source)f.style.height=h+'px';});});
  let t='';try{t=location.hash.slice(1);}catch(e){}
  show(t);
})();
</script>
"""

def build(fname, cfg):
    sh = shell()
    sh = re.sub(r'<title>[^<]*</title>', '<title>' + cfg['title'] + '</title>', sh, count=1)
    sh = sh.replace('<meta charset="utf-8">', '<meta charset="utf-8"><meta name="robots" content="noindex">', 1)
    out = [sh, EXTRA_CSS, '<div class="page">\n<header class="page-head">\n',
      '<nav class="eyebrow crumbs" aria-label="Breadcrumb"><a href="index.html">Workouts</a><span class="sep" aria-hidden="true">›</span><a href="igcse.html">IGCSE</a><span class="sep" aria-hidden="true">›</span></nav>\n',
      '<h1>' + cfg['title'] + '</h1>\n</header>\n<p class="set-intro">' + cfg['intro'] + '</p>\n',
      '<nav class="tabs" role="tablist" aria-label="Parts">\n']
    for p in cfg['parts']:
        out.append('<button class="tab-btn" role="tab" id="tab-%s" data-tab="%s" aria-controls="panel-%s">%s</button>\n' % (p['id'], p['id'], p['id'], p['label']))
    out.append('</nav>\n')
    for p in cfg['parts']:
        out.append('<section id="panel-%s" class="panel" role="tabpanel" aria-labelledby="tab-%s" hidden>\n' % (p['id'], p['id']))
        for s in p['sources']:
            src = s['page'] + '?set&tabs=' + s['tabs'] + '&kinds=' + urllib.parse.quote(cfg['kinds'], safe=',')
            out.append('<div class="set-src"><h2>%s</h2><a href="%s">Open the workout &rarr;</a></div>\n' % (s['name'], s['page']))
            out.append('<iframe class="set-frame" data-src="%s" title="%s: %s"></iframe>\n' % (html.escape(src), html.escape(cfg['title']), html.escape(s['name'])))
        out.append('</section>\n')
    out.append('<p class="set-todo">More parts are added as each unit is done (see tools/WORKOUTS.md).</p>\n</div>\n')
    out.append(SCRIPT + '</body></html>\n')
    open(os.path.join(ROOT, fname), 'w', encoding='utf-8').write(''.join(out))
    print('built', fname)

if __name__ == '__main__':
    for f, c in SETS.items(): build(f, c)
