#!/usr/bin/env python3
"""Build the whole-course practice sets (calculations.html, graphs.html) from the IGCSE workouts.

For end-of-year practice: students can do just the maths or just the graph skills.
The workouts are never changed. This script copies the code of the chosen workout
sections into each set page, keeps only the activities of the chosen kinds, and gives
every set its own saved answers (its own STORE_KEY).

Keeping the sets up to date: .github/workflows/build-sets.yml runs this script on every
push to main and commits the result, so a fix to a workout reaches the sets a minute or two
later. To build by hand:

    python3 tools/sets/build.py

How it copies: a workout's script is the shared act() engine, then one section per tab,
each starting with a "/* ================= n. NAME ================= */" comment.
A tab below names the section (by the words in that comment) and the workout tab id it fills.
Each section runs inside its own { } block, and act() sends its activities to the set
page's panel "<src>-<tab>"; activities of other kinds are removed straight away.
Engine and page CSS come from motion.html; each other source page's CSS is added too,
for its own diagrams.
"""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CALC = ['Calculate', 'Spot the error']
GRAPH = ['Label the graph', 'Calculate']
P1 = 'Forces Part 1 (Year 10)'

# Each tab of a set page = one workout section. part = the label its tabs sit under.
SETS = {
  'calculations.html': {
    'title': 'Calculations Set', 'key': 'set-calculations-v1', 'kinds': CALC,
    'tabs': [
      {'part': P1, 'page': 'motion.html', 'src': '1a', 'section': 'SPEED AND ACCELERATION', 'tab': 'calculating', 'label': 'Speed and Acceleration'},
      {'part': P1, 'page': 'forces.html', 'src': '1b', 'section': 'RESULTANT FORCE', 'tab': 'balanced', 'label': 'Resultant Force'},
      {'part': P1, 'page': 'forces.html', 'src': '1b', 'section': 'F = ma', 'tab': 'fma', 'label': 'F = ma'},
      {'part': P1, 'page': 'forces.html', 'src': '1b', 'section': 'WEIGHT', 'tab': 'weight', 'label': 'Weight'},
    ]},
  'graphs.html': {
    'title': 'Graphs Set', 'key': 'set-graphs-v1', 'kinds': GRAPH,
    'tabs': [
      {'part': P1, 'page': 'motion.html', 'src': '1a', 'section': 'DISTANCE–TIME GRAPHS', 'tab': 'stgraph', 'label': 's–t Graph'},
      {'part': P1, 'page': 'motion.html', 'src': '1a', 'section': 'VELOCITY–TIME GRAPHS', 'tab': 'vtgraph', 'label': 'v–t Graph'},
    ]},
}

SEC = re.compile(r'^/\* =+ (?:\d+\. )?(.+?) =+ \*/', re.M)

def read(f): return open(os.path.join(ROOT, f), encoding='utf-8').read()

def script(src):
    i = src.index('<script>\n(function(){'); return src[i + len('<script>\n(function(){'):src.index('</script>', i)]

def sections(js):
    ms = list(SEC.finditer(js)); out = {}
    for a, b in zip(ms, ms[1:] + [None]):
        out[a.group(1).strip()] = js[a.end():b.start() if b else len(js)]
    return out

def body_css(src):
    b = src.index('<body>'); return src[b + 6:src.index('</style>', b) + 8]

def panel_head(src, tab):
    m = re.search(r'<section id="panel-%s"[^>]*>\s*(<div class="panel-head">.*?</div></div>)' % re.escape(tab), src, re.S)
    return m.group(1) if m else ''

def build(fname, cfg):
    base = read('motion.html'); bjs = script(base)
    head = base[:base.index('<body>') + 6]
    head = re.sub(r'<title>[^<]*</title>', '<title>' + cfg['title'] + '</title>', head, count=1)
    head = head.replace('<meta charset="utf-8">', '<meta charset="utf-8"><meta name="robots" content="noindex">', 1)
    css = [body_css(base)] + [body_css(read(p)) for p in sorted({t['page'] for t in cfg['tabs']}) if p != 'motion.html']
    ids = [t['src'] + '-' + t['tab'] for t in cfg['tabs']]

    # engine: everything up to the first section, with this set's own keys and tabs
    engine = bjs[bjs.index('/* ================= helpers'):bjs.index('/* ================= 1. OVERVIEW')]
    engine = re.sub(r"// The suvat tab moved.*?\n.*?\n", '', engine, count=1)
    engine = re.sub(r"const STORE_KEY=[^;]+;", "const STORE_KEY='%s',OLD_STORE_KEY='';" % cfg['key'], engine, count=1)
    engine = re.sub(r"const TAB_IDS=\[[^\]]*\];", 'const TAB_IDS=%s;' % repr(ids).replace(' ', ''), engine, count=1)
    old = "$('#panel-'+panel+' .acts').appendChild(a);"
    assert old in engine, 'act() has changed in motion.html'
    engine = engine.replace(old, "($('#panel-'+SRC+'-'+panel+' .acts')||TRASH).appendChild(a);")
    engine = "let SRC='';const TRASH=document.createElement('div');\n" + engine
    tail = bjs[bjs.index('/* ================= tabs, startup'):]
    # a set page has no Overview tab
    for a, b in [("byId('tab-overview').parentNode", "$('.tabs')"), ("t='overview';", "t=TAB_IDS[0];")]:
        assert a in tail, a
        tail = tail.replace(a, b)

    keep = """
/* ================= set page: keep only this set's kinds of activity ================= */
const KINDS=%s;
function keepKinds(pid){
  const p=$('#panel-'+pid);if(p)$$('.act',p).forEach(a=>{const k=$('.kind',a);if(!k||KINDS.indexOf(k.textContent)<0)a.remove();});
  TRASH.innerHTML='';
  for(let i=games.length-1;i>=0;i--){if(!games[i].host||!games[i].host.isConnected)games.splice(i,1);}
}
""" % repr(cfg['kinds'])
    parts = []
    for t, pid in zip(cfg['tabs'], ids):
        sec = sections(script(read(t['page'])))
        key = next((k for k in sec if k.lower() == t['section'].lower()), None)
        assert key, (t['page'], t['section'], list(sec))
        parts.append("/* ----- %s %s ----- */\nSRC='%s';\n{\n%s}\nkeepKinds('%s');\n" % (t['src'], key, t['src'], sec[key], pid))

    nav, panels, last = [], [], None
    for i, (t, pid) in enumerate(zip(cfg['tabs'], ids)):
        if t['part'] != last:
            nav.append('<span class="tab-part">%s</span>' % t['part']); last = t['part']
        nav.append('<button class="tab-btn%s" role="tab" id="tab-%s" data-tab="%s" data-grp="" aria-selected="%s" aria-controls="panel-%s">%s</button>'
                   % (' is-active' if i == 0 else '', pid, pid, 'true' if i == 0 else 'false', pid, t['label']))
        panels.append('<section id="panel-%s" class="panel" role="tabpanel" aria-labelledby="tab-%s"%s>\n%s\n<p class="set-from">From the <a href="%s#%s">%s workout</a>.</p>\n<div class="acts"></div>\n</section>'
                      % (pid, pid, '' if i == 0 else ' hidden', panel_head(read(t['page']), t['tab']), t['page'], t['tab'], t['src']))
    extra = """<style>
  .tab-part{flex:0 0 auto;align-self:center;font:600 12px var(--f-mono);color:var(--ink-faint);padding:0 4px 0 10px}
  .tab-part:first-child{padding-left:0}
  .set-from{margin:-6px 0 12px;color:var(--ink-soft);font-size:13.5px}
  .set-from a{display:inline-block;min-height:44px;line-height:44px}
</style>
"""
    page = (head + ''.join(css) + extra +
      '<div class="page">\n<header class="page-head">\n'
      '<nav class="eyebrow crumbs" aria-label="Breadcrumb"><a href="index.html">Workouts</a><span class="sep" aria-hidden="true">›</span><a href="igcse.html">IGCSE</a><span class="sep" aria-hidden="true">›</span></nav>\n'
      '<h1>' + cfg['title'] + '</h1>\n</header>\n'
      '<nav class="tabs" role="tablist" aria-label="Activities">\n' + '\n'.join(nav) + '\n</nav>\n' +
      '\n'.join(panels) + '\n</div>\n'
      '<!-- Built by tools/sets/build.py from the workouts. Do not edit by hand: edit the workout; the set rebuilds on push. -->\n'
      '<script>\n(function(){\n' + engine + keep + ''.join(parts) + tail + '</script>\n</body></html>\n')
    open(os.path.join(ROOT, fname), 'w', encoding='utf-8').write(page)
    print('built', fname, len(ids), 'tabs')

if __name__ == '__main__':
    for f, c in SETS.items(): build(f, c)
