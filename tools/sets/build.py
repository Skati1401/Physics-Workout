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
import os, re, json

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CALC = ['Calculate', 'Spot the error']
GRAPH = ['Label the graph', 'Calculate']
P1 = 'Forces Part 1 (Year 10)'
P2 = 'Forces Part 2 (Year 11)'
U2 = 'Unit 2 Electricity'
U3 = 'Unit 3 Waves'
U4 = 'Unit 4 Energy'
U5 = 'Unit 5 Solids, Liquids and Gases'
U6 = 'Unit 6 Magnetism and Electromagnetism'
U7 = 'Unit 7 Radioactivity and Particles'
U8 = 'Unit 8 Astrophysics'

# Each tab of a set page = one workout section. part = the label its tabs sit under.
SETS = {
  'calculations.html': {
    'title': 'Calculations Set', 'key': 'set-calculations-v1', 'kinds': CALC,
    'tabs': [
      {'part': P1, 'page': 'motion.html', 'src': '1a', 'section': 'SPEED AND ACCELERATION', 'tab': 'calculating', 'label': 'Speed and Acceleration'},
      {'part': P1, 'page': 'forces.html', 'src': '1b', 'section': 'F = ma', 'tab': 'fma', 'label': 'F = ma'},
      {'part': P1, 'page': 'forces.html', 'src': '1b', 'section': 'WEIGHT', 'tab': 'weight', 'label': 'Weight'},
      {'part': P2, 'page': 'falling-stopping-springs.html', 'src': '1c', 'section': '1b. v² = u² + 2as', 'tab': 'suvat', 'label': 'v² = u² + 2as'},
      {'part': P2, 'page': 'falling-stopping-springs.html', 'src': '1c', 'section': 'STOPPING', 'tab': 'stopping', 'label': 'Stopping'},
      {'part': P2, 'page': 'falling-stopping-springs.html', 'src': '1c', 'section': "HOOKE'S LAW", 'tab': 'hooke', 'label': 'Hooke’s Law'},
      {'part': P2, 'page': 'momentum-and-moments.html', 'src': '1d', 'section': 'MOMENTUM', 'tab': 'momentum', 'label': 'Momentum', 'ta': True},
      {'part': P2, 'page': 'momentum-and-moments.html', 'src': '1d', 'section': 'SAFETY', 'tab': 'safety', 'label': 'Safety', 'ta': True},
      {'part': P2, 'page': 'momentum-and-moments.html', 'src': '1d', 'section': 'MOMENTS', 'tab': 'moments', 'label': 'Moments', 'ta': True},
      {'part': P2, 'page': 'momentum-and-moments.html', 'src': '1d', 'section': 'BEAMS', 'tab': 'beams', 'label': 'Beams', 'ta': True},
      {'part': U2, 'page': 'mains-electricity.html', 'src': '2a', 'section': 'POWER AND FUSES', 'tab': 'power', 'label': 'P = IV'},
      {'part': U2, 'page': 'mains-electricity.html', 'src': '2a', 'section': 'ENERGY, a.c. AND d.c.', 'tab': 'energy', 'label': 'E = IVt'},
      {'part': U2, 'page': 'circuits.html', 'src': '2b', 'section': 'CHARGE AND ENERGY', 'tab': 'charge', 'label': 'Q = It, E = QV'},
      {'part': U2, 'page': 'circuits.html', 'src': '2b', 'section': 'SERIES AND PARALLEL', 'tab': 'series', 'label': 'Series and Parallel'},
      {'part': U2, 'page': 'circuits.html', 'src': '2b', 'section': 'RESISTANCE', 'tab': 'resistance', 'label': 'V = IR'},
      {'part': U2, 'page': 'circuits.html', 'src': '2b', 'section': 'SERIES CIRCUIT CALCULATIONS', 'tab': 'seriescalc', 'label': 'Series Calculations'},
      {'part': U3, 'page': 'waves.html', 'src': '3a', 'section': 'WAVE EQUATIONS', 'tab': 'equation', 'label': 'v = fλ'},
      {'part': U3, 'page': 'waves.html', 'src': '3a', 'section': 'ELECTROMAGNETIC SPECTRUM', 'tab': 'spectrum', 'label': 'EM Waves'},
      {'part': U3, 'page': 'light-and-sound.html', 'src': '3b', 'section': 'REFRACTION', 'tab': 'refraction', 'label': 'Refractive Index'},
      {'part': U3, 'page': 'light-and-sound.html', 'src': '3b', 'section': 'TOTAL INTERNAL REFLECTION', 'tab': 'tir', 'label': 'Critical Angle'},
      {'part': U3, 'page': 'light-and-sound.html', 'src': '3b', 'section': 'SPEED OF SOUND', 'tab': 'speed', 'label': 'Speed of Sound', 'ta': True},
      {'part': U3, 'page': 'light-and-sound.html', 'src': '3b', 'section': 'PITCH AND LOUDNESS', 'tab': 'pitch', 'label': 'Oscilloscope', 'ta': True},
      {'part': U4, 'page': 'energy-stores-efficiency.html', 'src': '4a', 'section': 'CONSERVATION', 'tab': 'conserve', 'label': 'Conservation'},
      {'part': U4, 'page': 'energy-stores-efficiency.html', 'src': '4a', 'section': 'EFFICIENCY', 'tab': 'efficiency', 'label': 'Efficiency'},
      {'part': U4, 'page': 'energy-stores-efficiency.html', 'src': '4a', 'section': 'SANKEY DIAGRAMS', 'tab': 'sankey', 'label': 'Sankey', 'kinds': ['Label the diagram', 'Calculate']},
      {'part': U4, 'page': 'work-and-power.html', 'src': '4c', 'section': 'WORK DONE', 'tab': 'work', 'label': 'Work Done'},
      {'part': U4, 'page': 'work-and-power.html', 'src': '4c', 'section': 'GPE AND KE', 'tab': 'gpeke', 'label': 'GPE and KE'},
      {'part': U4, 'page': 'work-and-power.html', 'src': '4c', 'section': 'ENERGY LINK (GPE, KE AND WORK)', 'tab': 'link', 'label': 'Energy Link'},
      {'part': U4, 'page': 'work-and-power.html', 'src': '4c', 'section': 'POWER', 'tab': 'power', 'label': 'Power'},
      {'part': U5, 'page': 'density-pressure-state.html', 'src': '5a', 'section': 'DENSITY', 'tab': 'density', 'label': 'Density'},
      {'part': U5, 'page': 'density-pressure-state.html', 'src': '5a', 'section': 'PRESSURE', 'tab': 'pressure', 'label': 'Pressure'},
      {'part': U5, 'page': 'density-pressure-state.html', 'src': '5a', 'section': 'FLUIDS', 'tab': 'fluids', 'label': 'Pressure and Depth'},
      {'part': U5, 'page': 'density-pressure-state.html', 'src': '5a', 'section': 'SPECIFIC HEAT CAPACITY', 'tab': 'shc', 'label': 'Specific Heat', 'ta': True},
      {'part': U5, 'page': 'gases.html', 'src': '5b', 'section': 'KELVIN', 'tab': 'kelvin', 'label': 'Kelvin'},
      {'part': U5, 'page': 'gases.html', 'src': '5b', 'section': 'GAS LAWS', 'tab': 'laws', 'label': 'Gas Laws'},
      {'part': U6, 'page': 'electromagnetic-induction.html', 'src': '6b', 'section': 'TRANSFORMERS', 'tab': 'transformers', 'label': 'Transformers'},
      {'part': U6, 'page': 'electromagnetic-induction.html', 'src': '6b', 'section': 'NATIONAL GRID', 'tab': 'grid', 'label': 'National Grid'},
      {'part': U7, 'page': 'radioactivity.html', 'src': '7a', 'section': 'ATOMS AND ISOTOPES', 'tab': 'atoms', 'label': 'Atoms'},
      {'part': U7, 'page': 'radioactivity.html', 'src': '7a', 'section': 'DECAY EQUATIONS', 'tab': 'equations', 'label': 'Decay Equations'},
      {'part': U7, 'page': 'radioactivity.html', 'src': '7a', 'section': 'HALF-LIFE', 'tab': 'halflife', 'label': 'Half-Life'},
      {'part': U7, 'page': 'fission-and-fusion.html', 'src': '7b', 'section': 'FISSION', 'tab': 'fission', 'label': 'Fission'},
      {'part': U7, 'page': 'fission-and-fusion.html', 'src': '7b', 'section': 'FUSION', 'tab': 'fusion', 'label': 'Fusion'},
      {'part': U8, 'page': 'universe-and-stars.html', 'src': '8a', 'section': 'GRAVITY AND ORBITS', 'tab': 'orbits', 'label': 'W = mg'},
      {'part': U8, 'page': 'universe-and-stars.html', 'src': '8a', 'section': 'ORBITAL SPEED', 'tab': 'orbital', 'label': 'Orbital Speed'},
      {'part': U8, 'page': 'cosmology.html', 'src': '8b', 'section': 'THE RED-SHIFT EQUATION', 'tab': 'equation', 'label': 'Red-Shift', 'ta': True},
    ]},
  'graphs.html': {
    'title': 'Graphs Set', 'key': 'set-graphs-v1', 'kinds': GRAPH,
    'tabs': [
      {'part': P1, 'page': 'motion.html', 'src': '1a', 'section': 'DISTANCE–TIME GRAPHS', 'tab': 'stgraph', 'label': 's–t Graph'},
      {'part': P1, 'page': 'motion.html', 'src': '1a', 'section': 'VELOCITY–TIME GRAPHS', 'tab': 'vtgraph', 'label': 'v–t Graph'},
      {'part': P1, 'page': 'forces.html', 'src': '1b', 'section': 'F = ma', 'tab': 'fma', 'label': 'F–a Graph', 'titles': ['Read the graph']},
      {'part': P1, 'page': 'forces.html', 'src': '1b', 'section': 'WEIGHT', 'tab': 'weight', 'label': 'W–m Graph', 'titles': ['Read the graph']},
      {'part': P2, 'page': 'falling-stopping-springs.html', 'src': '1c', 'section': 'FALLING', 'tab': 'falling', 'label': 'Falling'},
      {'part': P2, 'page': 'falling-stopping-springs.html', 'src': '1c', 'section': 'STOPPING', 'tab': 'stopping', 'label': 'Stopping'},
      {'part': P2, 'page': 'falling-stopping-springs.html', 'src': '1c', 'section': "HOOKE'S LAW", 'tab': 'hooke', 'label': 'Hooke’s Law', 'kinds': ['Label the graph']},
      {'part': U2, 'page': 'circuits.html', 'src': '2b', 'section': 'CURRENT–VOLTAGE GRAPHS', 'tab': 'iv', 'label': 'I–V Graphs'},
      {'part': U3, 'page': 'waves.html', 'src': '3a', 'section': 'DESCRIBING WAVES', 'tab': 'describing', 'label': 'Wave Graphs', 'titles': ['Read the wave']},
      {'part': U3, 'page': 'waves.html', 'src': '3a', 'section': 'WAVE EQUATIONS', 'tab': 'equation', 'label': 'Period from a Graph', 'titles': ['Read the period off the graph']},
      {'part': U3, 'page': 'light-and-sound.html', 'src': '3b', 'section': 'PITCH AND LOUDNESS', 'tab': 'pitch', 'label': 'Oscilloscope', 'ta': True, 'titles': ['Read the oscilloscope']},
      {'part': U5, 'page': 'density-pressure-state.html', 'src': '5a', 'section': 'HEATING CURVE', 'tab': 'heating', 'label': 'Heating Curve', 'ta': True},
      {'part': U7, 'page': 'radioactivity.html', 'src': '7a', 'section': 'HALF-LIFE', 'tab': 'halflife', 'label': 'Half-Life Graph', 'titles': ['Read the half-life off the graph']},
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
    b = src.index('<body>')
    if '<style' in src[b:b + 400]: return src[b + 6:src.index('</style>', b) + 8]
    return ''

def css_blocks(css):
    out, d, st = [], 0, 0
    for i, c in enumerate(css):
        if c == '{': d += 1
        elif c == '}':
            d -= 1
            if d == 0: out.append(css[st:i + 1].strip()); st = i + 1
    return out

def all_css(src): return ''.join(re.findall(r'<style[^>]*>(.*?)</style>', src, re.S))

def extra_css(src, base, have):
    """A source page's CSS without the rules already on the set page (have: blocks seen so far).
    A page that keeps all its styles in <head> (Unit 4) adds only the rules and colour tokens
    motion.html lacks, so it never overrides motion.html's own rules or tokens."""
    bcss = all_css(base); out = []
    if body_css(src):
        for blk in css_blocks(body_css(src)[len('<style>'):-len('</style>')] if body_css(src).startswith('<style>') else re.sub(r'^<style[^>]*>|</style>$', '', body_css(src).strip())):
            if blk not in have: have.add(blk); out.append(blk)
        return '<style>\n' + '\n'.join(out) + '\n</style>\n'
    sels = {x.split('{')[0].strip() for x in css_blocks(bcss)}
    known = set(re.findall(r'(--[\w-]+)\s*:', bcss))
    for blk in css_blocks(all_css(src)):
        if blk in have: continue
        sel = blk.split('{')[0].strip()
        if ':root' in sel or sel.startswith('@media (prefers-color-scheme'):
            def keep(m):
                decl = [d for d in re.findall(r'(--[\w-]+\s*:[^;}]+)', m.group(2)) if d.split(':')[0].strip() not in known]
                return m.group(1) + '{' + ';'.join(decl) + '}' if decl else ''
            blk = re.sub(r'([^{}]*:root[^{}]*)\{([^{}]*)\}', keep, blk)
        elif sel in sels: continue
        have.add(blk); out.append(blk)
    return '<style>\n' + '\n'.join(out) + '\n</style>\n'

def panel_head(src, tab):
    m = re.search(r'<section id="panel-%s"[^>]*>(.*?)</section>' % re.escape(tab), src, re.S)
    if not m: return ''
    h = re.search(r'\s*(<div class="panel-head">.*?)\s*<div class="acts">', m.group(1), re.S)
    return h.group(1) if h else ''

def build(fname, cfg):
    base = read('motion.html'); bjs = script(base)
    head = base[:base.index('<body>') + 6]
    head = re.sub(r'<title>[^<]*</title>', '<title>' + cfg['title'] + '</title>', head, count=1)
    head = head.replace('<meta charset="utf-8">', '<meta charset="utf-8"><meta name="robots" content="noindex">', 1)
    have = set(css_blocks(all_css(base)))
    css = [body_css(base)] + [extra_css(read(p), base, have) for p in sorted({t['page'] for t in cfg['tabs']}) if p != 'motion.html']
    ids = [t['src'] + '-' + t['tab'] for t in cfg['tabs']]

    # engine: everything up to the first section, with this set's own keys and tabs
    engine = bjs[bjs.index('/* ================= helpers'):bjs.index('/* ================= 1. OVERVIEW')]
    engine = re.sub(r"// The suvat tab moved.*?\n.*?\n", '', engine, count=1)
    engine = re.sub(r"// Units merge \(3 Nov 2026\).*?\n.*?\n", '', engine, count=1)
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
function keepKinds(pid,kinds,titles){
  kinds=kinds||KINDS;
  const p=$('#panel-'+pid);if(p)$$('.act',p).forEach(a=>{const k=$('.kind',a),t=$('.act-title span:last-child',a);
    if(!k||kinds.indexOf(k.textContent)<0||(titles&&(!t||titles.indexOf(t.textContent)<0)))a.remove();});
  if(p)$$('.anim-wrap',p).forEach(w=>w.remove());
  TRASH.innerHTML='';
  for(let i=games.length-1;i>=0;i--){if(!games[i].host||!games[i].host.isConnected)games.splice(i,1);}
}
""" % repr(cfg['kinds'])
    # Helpers a source page declares before its sections that motion.html's engine does not have
    # (e.g. sankeySVG, beamDiagram, createGasSim, COL). They go inside each of that page's blocks,
    # so two pages can each keep their own COL.
    fa = "const acts=$('#panel-'+panel+' .acts');"
    engine = engine.replace(fa, "const acts=$('#panel-'+SRC+'-'+panel+' .acts')||TRASH;")
    declared = set(re.findall(r'^(?:const|let|function)\s+(\w+)', engine, re.M))
    def page_helpers(p):
        js = script(read(p)); first = js.index('/* ================= 1. OVERVIEW') if '/* ================= 1. OVERVIEW' in js else len(js)
        chunks, name = {}, None
        for l in js[:first].split('\n'):
            m = re.match(r'^(?:const|let|function)\s+(\w+)', l)
            if m: name = m.group(1) if m.group(1) not in declared else None
            elif l[:1] and not l[:1].isspace() and l[:1] not in '}])': name = None
            if name: chunks.setdefault(name, []).append(l)
        return {n: '\n'.join(c) for n, c in chunks.items()}
    page_h = {p: page_helpers(p) for p in dict.fromkeys(t['page'] for t in cfg['tabs'])}
    def helpers_for(p, code):
        # only the helpers this section uses, and the helpers those use, in page order
        h, need, todo = page_h[p], set(), [code]
        while todo:
            c = todo.pop()
            for n in h:
                if n not in need and re.search(r'\b%s\b' % re.escape(n), c): need.add(n); todo.append(h[n])
        return '\n'.join(h[n] for n in h if n in need)
    parts = []
    for t, pid in zip(cfg['tabs'], ids):
        sec = sections(script(read(t['page'])))
        key = next((k for k in sec if k.lower() == t['section'].lower()), None)
        assert key, (t['page'], t['section'], list(sec))
        args = "'%s',%s,%s" % (pid, json.dumps(t['kinds']) if 'kinds' in t else 'null', json.dumps(t['titles'], ensure_ascii=False) if 'titles' in t else 'null')
        parts.append("/* ----- %s %s ----- */\nSRC='%s';\n{\n%s\n%s}\nkeepKinds(%s);\n" % (t['src'], key, t['src'], helpers_for(t['page'], sec[key]), sec[key], args))

    nav, panels, last = [], [], None
    for i, (t, pid) in enumerate(zip(cfg['tabs'], ids)):
        if t['part'] != last:
            nav.append('<span class="tab-part">%s</span>' % t['part']); last = t['part']
        nav.append('<button class="tab-btn%s" role="tab" id="tab-%s" data-tab="%s"%s data-grp="" aria-selected="%s" aria-controls="panel-%s">%s</button>'
                   % (' is-active' if i == 0 else '', pid, pid, ' data-ta' if t.get('ta') else '', 'true' if i == 0 else 'false', pid, t['label']))
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
      '<script>\n(function(){\n' + engine + keep + ''.join(parts) + tail + '</script>\n' + open(os.path.join(ROOT, 'tools', 'licence', 'footer.html'), encoding='utf-8').read() + '</body></html>\n')
    open(os.path.join(ROOT, fname), 'w', encoding='utf-8').write(page)
    print('built', fname, len(ids), 'tabs')

if __name__ == '__main__':
    for f, c in SETS.items(): build(f, c)
