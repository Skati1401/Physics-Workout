#!/usr/bin/env python3
"""Build the whole-course practice sets (calculations.html, graphs.html) from the IGCSE workouts.

calculations.html (12 Nov 2026) is a chooser, not tabs: one row per equation (SETS[...]['rows']),
which the student ticks before pressing Start; its page code is chooser.js and chooser.css here.

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
# unit headings on the Calculations chooser (as on igcse.html)
U_1, U_2, U_3, U_4 = 'Unit 1 Forces and Motion', 'Unit 2 Electricity', 'Unit 3 Waves', 'Unit 4 Energy Resources and Energy Transfers'
U_5, U_6, U_7, U_8 = 'Unit 5 Solids, Liquids and Gases', 'Unit 6 Magnetism and Electromagnetism', 'Unit 7 Radioactivity and Particles', 'Unit 8 Astrophysics'

# Each tab of a set page = one workout section. part = the label its tabs sit under.
SETS = {
  'calculations.html': {
    'title': 'Calculations Workout', 'key': 'set-calculations-v2', 'kinds': CALC, 'mode': 'chooser', 'publish': True,
    'description': 'Edexcel IGCSE Physics calculations: tick the equations you want to practise, from all eight units, then answer two questions on each, with New problems for more and the full working.',
    # Each row is one line of the chooser: the equations it practises, a short label, and the
    # workout cards it uses ('src-tab', raw card title as written in the workout). The card's code
    # is copied from that workout, so its questions, New problems, hints and working stay in step.
    'rows': [
      (U_1, 'speed', 'Speed and acceleration', ['average speed = [[distance|time]]', 'a = [[(v − u)|t]]'], [('1a-calculating', 'Speed and acceleration')]),
      (U_1, 'fma', 'Force, mass and acceleration', ['F = ma'], [('1b-fma', 'F = m × a')]),
      (U_1, 'suvat', 'Final speed, acceleration and distance', ['v² = u² + 2as'], [('1c-suvat', 'v² = u² + 2as')]),
      (U_1, 'momentum', 'Momentum and collisions', ['p = mv'], [('1d-momentum', 'Momentum')]),
      (U_1, 'impulse', 'Force and change in momentum', ['F = [[(mv − mu)|t]]'], [('1d-safety', 'Calculate the force')]),
      (U_1, 'moments', 'Moments: balance a beam, planks on two supports', ['moment = Fd'], [('1d-moments', 'Balance the beam'), ('1d-beams', 'Planks on two supports')]),
      (U_2, 'power', 'Electrical power', ['P = IV'], [('2a-power', 'P = I × V')]),
      (U_2, 'energy', 'Energy transferred', ['E = IVt'], [('2a-energy', 'E = I × V × t')]),
      (U_2, 'charge', 'Charge, current and energy', ['Q = It', 'E = QV'], [('2b-charge', 'Q = I × t and E = Q × V')]),
      (U_2, 'series', 'Currents and voltages in series and parallel', ['I = I₁ + I₂', 'V = V₁ + V₂'], [('2b-series', 'Currents and voltages')]),
      (U_2, 'resistance', 'Resistance', ['V = IR'], [('2b-resistance', 'V = I × R')]),
      (U_3, 'wave', 'Wave speed, frequency and period', ['v = fλ', 'f = [[1|T]]'], [('3a-equation', 'v = f × λ and f = [[1|T]]')]),
      (U_3, 'reflection', 'The law of reflection', ['i = r'], [('3b-refraction', 'The law of reflection')]),
      (U_3, 'refraction', 'Refractive index', ['n = [[sin i|sin r]]'], [('3b-refraction', 'n = [[sin i|sin r]]')]),
      (U_3, 'critical', 'Critical angle', ['sin c = [[1|n]]'], [('3b-tir', 'sin c = [[1|n]]')]),
      (U_3, 'sound', 'Speed of sound and echoes', ['speed = [[distance|time]]'], [('3c-speed', 'speed = [[distance|time]]')]),
      (U_4, 'efficiency', 'Efficiency and Sankey diagrams', ['efficiency = [[useful energy output|total energy output]]'], [('4a-efficiency', 'Calculate efficiency')]),
      (U_4, 'work', 'Work done and power', ['W = Fd', 'P = [[W|t]]'], [('4c-work', 'Work done and power')]),
      (U_4, 'gpeke', 'Gravitational potential and kinetic energy', ['GPE = mgh', 'KE = ½mv²'], [('4c-gpeke', 'GPE and KE')]),
      (U_4, 'link', 'GPE, KE and work done against friction', ['GPE lost = KE gained + work done'], [('4c-link', 'GPE, KE and work done')]),
      (U_4, 'cpower', 'Power from energy (two or three steps)', ['P = [[W|t]]'], [('4c-cpower', 'Power from energy')]),
      (U_5, 'density', 'Density', ['ρ = [[m|V]]'], [('5a-density', 'Density, mass and volume')]),
      (U_5, 'pressure', 'Pressure', ['p = [[F|A]]'], [('5a-pressure', 'Pressure, force and area')]),
      (U_5, 'depth', 'Pressure difference in a liquid', ['p = hρg'], [('5a-fluids', 'Pressure difference in a liquid')]),
      (U_5, 'shc', 'Specific heat capacity', ['ΔQ = mcΔT'], [('5a-shc', 'Thermal energy, mass, c and temperature change')]),
      (U_5, 'gaslaws', 'The gas laws', ['p₁V₁ = p₂V₂', '[[p₁|T₁]] = [[p₂|T₂]]'], [('5b-laws', 'Use the gas laws')]),
      (U_6, 'turns', 'Transformer turns ratio', ['[[V<sub>p</sub>|V<sub>s</sub>]] = [[N<sub>p</sub>|N<sub>s</sub>]]'], [('6b-transformers', 'The turns ratio')]),
      (U_6, 'tpower', 'Transformer power', ['V<sub>p</sub>I<sub>p</sub> = V<sub>s</sub>I<sub>s</sub>'], [('6b-grid', 'Input power = output power')]),
      (U_8, 'weight', 'Weight on other worlds', ['W = mg'], [('8a-orbits', 'Weight on other worlds')]),
      (U_8, 'orbital', 'Orbital speed', ['v = [[2πr|T]]'], [('8a-orbital', 'v = [[2 × π × r|T]]')]),
      (U_8, 'redshift', 'Red-shift', ['[[Δλ|λ₀]] = [[v|c]]'], [('8b-equation', '[[Δλ|λ₀]] = [[v|c]]')]),
    ],
    # the workout section each 'src-tab' above comes from
    'sources': {
      '1a-calculating': ('motion.html', 'SPEED AND ACCELERATION'),
      '1b-fma': ('forces.html', 'F = ma'),
      '1c-suvat': ('falling-stopping-springs.html', '1b. v² = u² + 2as'),
      '1d-momentum': ('momentum-and-moments.html', 'MOMENTUM'),
      '1d-safety': ('momentum-and-moments.html', 'SAFETY'),
      '1d-moments': ('momentum-and-moments.html', 'MOMENTS'),
      '1d-beams': ('momentum-and-moments.html', 'BEAMS'),
      '2a-power': ('mains-electricity.html', 'POWER AND FUSES'),
      '2a-energy': ('mains-electricity.html', 'ENERGY, a.c. AND d.c.'),
      '2b-charge': ('circuits.html', 'CHARGE AND ENERGY'),
      '2b-series': ('circuits.html', 'SERIES AND PARALLEL'),
      '2b-resistance': ('circuits.html', 'RESISTANCE'),
      '3a-equation': ('waves.html', 'WAVE EQUATIONS'),
      '3b-refraction': ('light-and-sound.html', 'REFRACTION'),
      '3b-tir': ('light-and-sound.html', 'TOTAL INTERNAL REFLECTION'),
      '3c-speed': ('sound.html', 'SPEED OF SOUND'),
      '4a-efficiency': ('energy-stores-efficiency.html', 'EFFICIENCY'),
      '4c-work': ('work-and-power.html', 'WORK DONE AND POWER'),
      '4c-gpeke': ('work-and-power.html', 'GPE AND KE'),
      '4c-link': ('work-and-power.html', 'ENERGY LINK (GPE, KE AND WORK)'),
      '4c-cpower': ('work-and-power.html', 'CONSERVATION AND POWER'),
      '5a-density': ('density-pressure-state.html', 'DENSITY'),
      '5a-pressure': ('density-pressure-state.html', 'PRESSURE'),
      '5a-fluids': ('density-pressure-state.html', 'FLUIDS'),
      '5a-shc': ('density-pressure-state.html', 'SPECIFIC HEAT CAPACITY'),
      '5b-laws': ('gases.html', 'GAS LAWS'),
      '6b-transformers': ('electromagnetic-induction.html', 'TRANSFORMERS'),
      '6b-grid': ('electromagnetic-induction.html', 'NATIONAL GRID'),
      '8a-orbits': ('universe-and-stars.html', 'GRAVITY AND ORBITS'),
      '8a-orbital': ('universe-and-stars.html', 'ORBITAL SPEED'),
      '8b-equation': ('cosmology.html', 'THE RED-SHIFT EQUATION'),
    }},
  'graphs.html': {
    'title': 'Graphs Set', 'key': 'set-graphs-v1', 'kinds': GRAPH,
    'tabs': [
      {'part': P1, 'page': 'motion.html', 'src': '1a', 'section': 'DISTANCE–TIME GRAPHS', 'tab': 'stgraph', 'label': 's–t Graph'},
      {'part': P1, 'page': 'motion.html', 'src': '1a', 'section': 'VELOCITY–TIME GRAPHS', 'tab': 'vtgraph', 'label': 'v–t Graph'},
      {'part': P1, 'page': 'forces.html', 'src': '1b', 'section': 'WEIGHT', 'tab': 'weight', 'label': 'Force Graphs', 'titles': ['Force–acceleration graph', 'Weight–mass graph']},
      {'part': P2, 'page': 'falling-stopping-springs.html', 'src': '1c', 'section': 'FALLING', 'tab': 'falling', 'label': 'Falling'},
      {'part': P2, 'page': 'falling-stopping-springs.html', 'src': '1c', 'section': 'STOPPING', 'tab': 'stopping', 'label': 'Stopping'},
      {'part': P2, 'page': 'falling-stopping-springs.html', 'src': '1c', 'section': "HOOKE'S LAW", 'tab': 'hooke', 'label': 'Hooke’s Law', 'kinds': ['Label the graph']},
      {'part': U2, 'page': 'circuit-components.html', 'src': '2c', 'section': 'CURRENT–VOLTAGE GRAPHS', 'tab': 'iv', 'label': 'I–V Graphs'},
      {'part': U3, 'page': 'waves.html', 'src': '3a', 'section': 'DESCRIBING WAVES', 'tab': 'describing', 'label': 'Wave Graphs', 'titles': ['Read the wave']},
      {'part': U3, 'page': 'waves.html', 'src': '3a', 'section': 'WAVE EQUATIONS', 'tab': 'equation', 'label': 'Period from a Graph', 'titles': ['Read the period off the graph']},
      {'part': U3, 'page': 'sound.html', 'src': '3c', 'section': 'PITCH AND LOUDNESS', 'tab': 'pitch', 'label': 'Oscilloscope', 'ta': True, 'titles': ['Read the oscilloscope']},
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


HERE = os.path.dirname(os.path.abspath(__file__))
CHOOSER_JS = open(os.path.join(HERE, 'chooser.js'), encoding='utf-8').read()

def chooser_body(cfg, ids):
    """The Calculations chooser: equations to tick, grouped by unit, a Start bar, the practice list,
    and the hidden panels that the copied workout code fills (the cards move from there to the list)."""
    rows = []
    for unit, rid, label, eqs, cards in cfg['rows']:
        page, _ = cfg['sources'][cards[0][0]]
        src, tab = cards[0][0].split('-', 1)
        rows.append({'id': rid, 'unit': unit, 'label': label, 'eqs': eqs, 'cards': [list(c) for c in cards],
                     'ta': any(src_ta(read(cfg['sources'][c[0]][0]), c[0].split('-', 1)[1]) for c in cards),
                     'href': '%s#%s' % (page, tab), 'src': src})
    assert len({r['id'] for r in rows}) == len(rows), 'row ids must differ'
    data = json.dumps(rows, ensure_ascii=False).replace('</', '<\\/')
    sep = '<span class="sep" aria-hidden="true">›</span>'
    body = ('<div class="page">\n<header class="page-head">\n'
      '<nav class="eyebrow crumbs" aria-label="Breadcrumb"><a href="index.html">Workouts</a>' + sep + '<a href="igcse.html">IGCSE</a>' + sep +
      '<a href="igcse.html#unit-cg">Calculations &amp; Graphs</a>' + sep + '</nav>\n'
      '<h1>' + cfg['title'] + '</h1>\n<span class="head-note">TA = Triple Award only</span>\n</header>\n'
      '<section id="chooser" aria-labelledby="ch-title">\n<div class="ch-top">\n'
      '<h2 id="ch-title" tabindex="-1">Choose Your Equations</h2>\n'
      '<p>Every equation is ticked. Press Start to practise them all, or untick the ones you don’t want first. Each one gives you two questions, and New problems gives you two more.</p>\n'
      '<div class="ch-go"><button type="button" class="btn primary" id="ch-start" disabled>Start</button>'
      '<span class="ch-count" id="ch-count" aria-live="polite"></span>'
      '<label class="ch-mix"><input type="checkbox" id="ch-mix"> Mix the order</label>'
      '<button type="button" class="btn" id="ch-all">Tick all</button>'
      '<button type="button" class="btn" id="ch-none">Clear ticks</button>'
      '<button type="button" class="btn" id="ch-da" aria-pressed="false">Leave out TA</button></div>\n</div>\n'
      '<div class="ch-units" id="ch-units"></div>\n</section>\n'
      '<section id="practice" aria-labelledby="pr-title" hidden>\n'
      '<div class="pr-bar"><h2 id="pr-title" tabindex="-1">Practise</h2><span class="pr-count" id="pr-count" aria-live="polite"></span>'
      '<button type="button" class="btn" id="pr-back">&larr; Change equations</button></div>\n'
      '<div id="pr-list"></div>\n'
      '<div class="pr-bar pr-end"><button type="button" class="btn" id="pr-back2">&larr; Change equations</button></div>\n</section>\n'
      '<div id="store" hidden>\n' + '\n'.join('<section id="panel-%s" class="panel"><div class="acts"></div></section>' % pid for pid in ids) + '\n</div>\n'
      '<script type="application/json" id="ch-rows">' + data + '</script>\n'
      '</div>\n')
    return body, open(os.path.join(HERE, 'chooser.css'), encoding='utf-8').read()

def src_ta(src, tab):
    """True when the workout's own tab button for this tab is tagged Triple Award (data-ta)."""
    m = re.search(r'<button[^>]*\bdata-tab="%s"[^>]*>' % re.escape(tab), src)
    return bool(m and re.search(r'\sdata-ta\b', m.group(0)))

def build(fname, cfg):
    chooser = cfg.get('mode') == 'chooser'
    if chooser:
        # tabs (hidden panels the copied code fills) come from the rows, in row order
        raws = {}
        for unit, rid, label, eqs, cards in cfg['rows']:
            for pid, raw in cards:
                assert pid in cfg['sources'], ('no source for', pid)
                raws.setdefault(pid, []).append(raw)
        cfg = dict(cfg, tabs=[{'page': cfg['sources'][pid][0], 'section': cfg['sources'][pid][1],
                               'src': pid.split('-', 1)[0], 'tab': pid.split('-', 1)[1], 'raws': raws[pid]} for pid in raws])
    base = read('motion.html'); bjs = script(base)
    head = base[:base.index('<body>') + 6]
    head = re.sub(r'<title>[^<]*</title>', '<title>' + cfg['title'] + '</title>', head, count=1)
    if cfg.get('description'):
        head = re.sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="%s">' % cfg['description'], head, count=1)
    if not cfg.get('publish'):
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
    # each card remembers the title it was given in the workout, so a set can pick cards by title
    old = "const a=mk('article','act');"
    assert old in engine, 'act() has changed in motion.html'
    engine = engine.replace(old, "const a=mk('article','act');a.dataset.raw=title;", 1)
    engine = "let SRC='';const TRASH=document.createElement('div');\n" + engine
    tail = bjs[bjs.index('/* ================= tabs, startup'):]
    if chooser:
        # no tabs: the chooser has its own progress line and startup (CHOOSER_JS below)
        assert 'function showProgress(' in engine
        engine = engine.replace('function showProgress(', 'function showTabProgress(', 1)
        tail = tail[:tail.index('function applyTabUI(')] + CHOOSER_JS
    else:
        # a set page has no Overview tab
        for a, b in [("byId('tab-overview').parentNode", "$('.tabs')"), ("t='overview';", "t=TAB_IDS[0];")]:
            assert a in tail, a
            tail = tail.replace(a, b)

    keep = """
/* ================= set page: keep only this set's kinds of activity ================= */
const KINDS=%s;
function keepKinds(pid,kinds,titles,raws){
  kinds=kinds||KINDS;
  const p=$('#panel-'+pid);if(p)$$('.act',p).forEach(a=>{const k=$('.kind',a),t=$('.act-title span:last-child',a);
    if(!k||kinds.indexOf(k.textContent)<0||(titles&&(!t||titles.indexOf(t.textContent)<0))||(raws&&raws.indexOf(a.dataset.raw)<0))a.remove();});
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
    # names motion.html's script already has (engine and startup): never copied from a source page
    declared = set(re.findall(r'^(?:const|let|function)\s+(\w+)', engine + bjs, re.M))
    def decl_chunks(js, skip=()):
        """Top-level const/let/function declarations in js (name -> its lines)."""
        chunks, name = {}, None
        for l in js.split('\n'):
            m = re.match(r'^(?:const|let|function)\s+(\w+)', l)
            if m: name = m.group(1) if m.group(1) not in declared and m.group(1) not in skip else None
            elif l[:1] and not l[:1].isspace() and l[:1] not in '}])': name = None
            if name: chunks.setdefault(name, []).append(l)
        return {n: '\n'.join(c) for n, c in chunks.items()}
    def page_helpers(p):
        js = script(read(p)); first = js.index('/* ================= 1. OVERVIEW') if '/* ================= 1. OVERVIEW' in js else len(js)
        return decl_chunks(js[:first])
    page_h = {p: page_helpers(p) for p in dict.fromkeys(t['page'] for t in cfg['tabs'])}
    def helpers_for(p, code, key):
        # only the helpers this section uses, and the helpers those use, in page order. Besides the
        # page's helpers, this takes data a section uses from an earlier section of its page
        # (e.g. 7a's EQ_BETA, declared in Atoms and used in Decay Equations).
        own = set(decl_chunks(code))
        h = dict(page_h[p])
        for k, c in sections(script(read(p))).items():
            if k != key:
                for n, v in decl_chunks(c, own).items(): h.setdefault(n, v)
        need, todo = set(), [code]
        while todo:
            c = todo.pop()
            for n in h:
                if n not in need and n not in own and re.search(r'\b%s\b' % re.escape(n), c): need.add(n); todo.append(h[n])
        return '\n'.join(h[n] for n in h if n in need)
    parts = []
    for t, pid in zip(cfg['tabs'], ids):
        sec = sections(script(read(t['page'])))
        key = next((k for k in sec if k.lower() == t['section'].lower()), None)
        assert key, (t['page'], t['section'], list(sec))
        code = sec[key]
        for raw in t.get('raws', []):
            assert "'%s'" % raw in code, ('card title not found in', t['page'], key, raw)
        # a section's own layout code looks up its tab by id: point it at the set's panel
        code = re.sub(r"#panel-%s\b" % re.escape(t['tab']), '#panel-' + pid, code)
        args = "'%s',%s,%s,%s" % (pid, json.dumps(t['kinds']) if 'kinds' in t else 'null',
                                   json.dumps(t['titles'], ensure_ascii=False) if 'titles' in t else 'null',
                                   json.dumps(t['raws'], ensure_ascii=False) if 'raws' in t else 'null')
        # one section that throws must not stop the sections after it
        parts.append("/* ----- %s %s ----- */\nSRC='%s';\ntry{\n%s\n%s}catch(e){console.error('set section %s',e);}\nkeepKinds(%s);\n"
                     % (t['src'], key, t['src'], helpers_for(t['page'], code, key), code, pid, args))

    if chooser:
        body, extra = chooser_body(cfg, ids)
    else:
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
        body = ('<div class="page">\n<header class="page-head">\n'
          '<nav class="eyebrow crumbs" aria-label="Breadcrumb"><a href="index.html">Workouts</a><span class="sep" aria-hidden="true">›</span><a href="igcse.html">IGCSE</a><span class="sep" aria-hidden="true">›</span></nav>\n'
          '<h1>' + cfg['title'] + '</h1>\n</header>\n'
          '<nav class="tabs" role="tablist" aria-label="Activities">\n' + '\n'.join(nav) + '\n</nav>\n' +
          '\n'.join(panels) + '\n</div>\n')
    page = (head + ''.join(css) + extra + body +
      '<!-- Built by tools/sets/build.py from the workouts. Do not edit by hand: edit the workout; the set rebuilds on push. -->\n'
      '<script>\n(function(){\n' + engine + keep + ''.join(parts) + tail + '</script>\n' + open(os.path.join(ROOT, 'tools', 'licence', 'footer.html'), encoding='utf-8').read() + '</body></html>\n')
    open(os.path.join(ROOT, fname), 'w', encoding='utf-8').write(page)
    print('built', fname, len(cfg.get('rows', ids)), 'rows' if chooser else 'tabs')

if __name__ == '__main__':
    for f, c in SETS.items(): build(f, c)
