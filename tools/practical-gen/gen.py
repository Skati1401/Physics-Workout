#!/usr/bin/env python3
"""Build a core practical page from the shared template and one practical's files.

    python3 tools/practical-gen/gen.py hookes-law          # writes hookes-law-practical.html
    python3 tools/practical-gen/gen.py --all               # rebuilds every practical
    python3 tools/practical-gen/gen.py --check hookes-law  # builds, then runs node --check on the script

Each practical lives in tools/practical-gen/practicals/<slug>/:
    page.json   title, unit, header links, tabs (id, label, h2 title, spec badges), store key, accent, draft
    content.js  the activities, written with the engine's helpers (act, createSortGame, createPredict, ...)

The template (template/) is the Unit 5 engine plus createPlot, copied from the Hooke's law page.
Change the engine there, then rebuild every practical with --all, so all the pages stay the same.
The finished pages are ordinary self-contained HTML files committed to the repo root: the site has
no build step, this script only saves copying the engine by hand.
"""
import json, os, re, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
T = os.path.join(HERE, 'template')


def read(*p):
    with open(os.path.join(*p), encoding='utf-8') as f:
        return f.read()


def is_ta(spec):
    # Triple Award spec points end in P (e.g. 5.14P, 2.23P)
    return bool(re.fullmatch(r'\d+\.\d+P', spec))


def build(slug):
    d = os.path.join(HERE, 'practicals', slug)
    cfg = json.loads(read(d, 'page.json'))
    content = read(d, 'content.js')
    tabs = cfg['tabs']
    ids = [t['id'] for t in tabs]
    assert len(ids) == len(set(ids)), 'duplicate tab ids'
    first = ids[0]
    any_ta = any(is_ta(s) for t in tabs for s in t['spec'])

    head = read(T, 'head.html').replace('{{TITLE}}', cfg['title'])
    head = head.replace('{{NOINDEX}}', '<meta name="robots" content="noindex">' if cfg.get('draft') else '')

    acc = cfg.get('accent', {'light': ['#0C7A68', '#D6F3EE'], 'dark': ['#4FD6BD', '#0F2E29']})
    style = (read(T, 'style.css').replace('{{ACCENT}}', acc['light'][0]).replace('{{ACCENT_SOFT}}', acc['light'][1])
             .replace('{{ACCENT_DARK}}', acc['dark'][0]).replace('{{ACCENT_SOFT_DARK}}', acc['dark'][1]))
    style += cfg.get('extraCss', '')

    sep = '<span class="sep" aria-hidden="true">›</span>'
    crumbs = ('<nav class="eyebrow crumbs" aria-label="Breadcrumb">'
              + ''.join('<a href="%s">%s</a>%s' % (h, t, sep) for h, t in
                        [('index.html', 'Workouts'), ('igcse.html', 'IGCSE'), ('igcse.html#unit-cp', 'Core practicals')])
              + '</nav>')
    ta_note = '<span class="head-note">TA = Triple Award only</span>\n' if any_ta else ''
    links = ' &middot; '.join('%s: <a href="%s">%s</a>' % (l['label'], l['href'], l['text']) for l in cfg.get('links', []))

    def tab_btn(i, t):
        ta = ' data-ta' if any(is_ta(s) for s in t['spec']) else ''
        return ('<button class="tab-btn%s" role="tab" id="tab-%s" data-tab="%s"%s aria-selected="%s" aria-controls="panel-%s">%s</button>'
                % (' is-active' if i == 0 else '', t['id'], t['id'], ta, 'true' if i == 0 else 'false', t['id'], t['label']))

    def badges(spec):
        b = ''.join('<b>%s</b>' % s for s in spec)
        if any(is_ta(s) for s in spec):
            b = '<b class="ta" title="Triple Award only">TA</b>' + b
        return b

    def panel(i, t):
        return ('<section id="panel-%s" class="panel" role="tabpanel" aria-labelledby="tab-%s"%s>\n'
                '<div class="panel-head"><h2>%s</h2><div class="spec">%s</div></div>\n<div class="acts"></div>\n</section>'
                % (t['id'], t['id'], '' if i == 0 else ' hidden', t['title'], badges(t['spec'])))

    engine = (read(T, 'engine.js').replace('{{STORE_KEY}}', cfg['storeKey'])
              .replace('{{OLD_STORE_KEY}}', cfg.get('oldStoreKey', ''))
              .replace('{{TAB_IDS}}', json.dumps(ids)).replace('{{FIRST_TAB}}', first))
    tail = read(T, 'tail.js').replace('{{FIRST_TAB}}', first)

    out = (head + '<style>\n' + style + '</style>\n<div class="page">\n'
           '<header class="page-head">\n'
           + crumbs + '\n<h1>' + cfg['title'] + '</h1>\n' + ta_note
           + ('<p class="cp-link">' + links + '</p>\n' if links else '') +
           '</header>\n<nav class="tabs" role="tablist" aria-label="Activities">\n'
           + '\n'.join(tab_btn(i, t) for i, t in enumerate(tabs)) + '\n</nav>\n'
           + '\n'.join(panel(i, t) for i, t in enumerate(tabs)) + '\n</div>\n<script>\n'
           + engine + '\n' + content + '\n' + tail)
    leftover = re.findall(r'\{\{[A-Z_]+\}\}', out)
    assert not leftover, 'unfilled placeholders: %s' % leftover
    path = os.path.join(REPO, cfg['file'])
    with open(path, 'w', encoding='utf-8') as f:
        f.write(out)
    return path


def node_check(path):
    html = read(path)
    js = re.findall(r'<script>(.*?)</script>', html, re.S)[-1]
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as f:
        f.write(js)
    r = subprocess.run(['node', '--check', f.name], capture_output=True, text=True)
    os.unlink(f.name)
    if r.returncode:
        sys.exit('node --check failed for %s:\n%s' % (path, r.stderr))


if __name__ == '__main__':
    args = sys.argv[1:]
    check = '--check' in args
    args = [a for a in args if a != '--check']
    if args == ['--all']:
        args = sorted(os.listdir(os.path.join(HERE, 'practicals')))
    if not args:
        sys.exit(__doc__)
    for slug in args:
        p = build(slug)
        if check:
            node_check(p)
        print('built', os.path.relpath(p, REPO))
