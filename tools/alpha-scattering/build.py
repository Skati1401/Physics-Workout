"""Build the two alpha particle scattering workouts from one source (TODO 5u, 22 Nov 2026).

    python3 tools/alpha-scattering/build.py

page.html holds the whole page: the shell and engine (copied from relativity.html), and the content, which branches on
LV ('ib' or 'ial'). This script fills in the title, description, tabs and panels for each level and writes
alpha-scattering.html (IB E.1) and alpha-scattering-ial.html (IAL 112) in the repo root, then runs
tools/review/drafts.py sync so the Draft tags are back. Edit page.html or this file, never the built pages.
"""
import json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
SEP = '<span class="sep" aria-hidden="true">›</span>'
HL = '<b class="ta" title="Higher level only">HL</b>'

# (id, tab label, panel heading, spec badges HTML, HL tab?)
LEVELS = {
    'ib': {
        'file': 'alpha-scattering.html',
        'title': 'E.1 Alpha Particle Scattering Workout',
        'store': 'ib-e1-alpha-v1',
        'desc': 'IB Diploma Physics E.1 revision: the Geiger&ndash;Marsden&ndash;Rutherford alpha particle scattering experiment, '
                'its observations and what they show, from the plum pudding model to the nuclear model, and at HL the distance of '
                'closest approach, R = R&#8320;A&sup1;&frasl;&sup3;, nuclear density and deviations from Rutherford scattering at high energies.',
        'crumbs': '<a href="index.html">Workouts</a>' + SEP + '<a href="ib.html">IB</a>' + SEP + '<a href="ib.html#theme-e">Theme E</a>' + SEP,
        'note': '<span class="head-note">HL = higher level only</span>',
        'tabs': [
            ('overview', 'Warm Up', 'Warm Up', '<b>E.1</b>', False),
            ('experiment', 'Experiment', 'The Experiment', '<b>E.1</b>', False),
            ('results', 'Results', 'The Results', '<b>E.1</b>', False),
            ('models', 'Models', 'Models of the Atom', '<b>E.1</b>', False),
            ('nucleus', 'Near a Nucleus', 'Near a Nucleus', '<b>E.1</b>', False),
            ('closest', 'Closest Approach', 'Distance of Closest Approach', HL + '<b>E.1</b>', True),
            ('size', 'Nuclear Size', 'The Size of a Nucleus', HL + '<b>E.1</b>', True),
            ('exam', 'Exam', 'Exam Questions', '<b>E.1</b>', False),
            ('sumup', 'Sum Up', 'Sum Up', '<b>E.1</b>', False),
        ],
    },
    'ial': {
        'file': 'alpha-scattering-ial.html',
        'title': 'Alpha Particle Scattering Workout',
        'store': 'ial-112-alpha-v1',
        'desc': 'Edexcel International A Level Physics Unit 4 revision (spec 112): the alpha particle scattering experiment, '
                'its observations and the conclusion from each, how the plum pudding model gave way to the nuclear model, and the '
                'distance of closest approach from V = Q/4&pi;&epsilon;&#8320;r and W = VQ.',
        'crumbs': '<a href="index.html">Workouts</a>' + SEP + '<a href="ial.html">IAL</a>' + SEP + '<a href="ial.html#unit-4">Unit 4</a>' + SEP,
        'note': '',
        'tabs': [
            ('overview', 'Warm Up', 'Warm Up', '<b>112</b>', False),
            ('experiment', 'Experiment', 'The Experiment', '<b>112</b>', False),
            ('results', 'Results', 'The Results', '<b>112</b>', False),
            ('models', 'Models', 'Models of the Atom', '<b>112</b>', False),
            ('nucleus', 'Near a Nucleus', 'Near a Nucleus', '<b>112</b>', False),
            ('closest', 'Closest Approach', 'Distance of Closest Approach', '<b>98</b><b>112</b>', False),
            ('exam', 'Exam', 'Exam Questions', '<b>98</b><b>112</b>', False),
            ('sumup', 'Sum Up', 'Sum Up', '<b>112</b>', False),
        ],
    },
}


def markup(c):
    out = ['<div class="page">', '<header class="page-head">',
           '<nav class="eyebrow crumbs" aria-label="Breadcrumb">' + c['crumbs'] + '</nav>',
           '<h1>' + c['title'] + '</h1>']
    if c['note']:
        out.append(c['note'])
    out.append('</header>')
    out.append('<nav class="tabs" role="tablist" aria-label="Activities">')
    for i, (tid, lab, head, spec, hl) in enumerate(c['tabs']):
        out.append('<button class="tab-btn%s" role="tab" id="tab-%s" data-tab="%s" data-grp=""%s aria-selected="%s" aria-controls="panel-%s">%s</button>'
                   % (' is-active' if i == 0 else '', tid, tid, ' data-hl' if hl else '', 'true' if i == 0 else 'false', tid, lab))
    out.append('</nav>')
    for i, (tid, lab, head, spec, hl) in enumerate(c['tabs']):
        out.append('<section id="panel-%s" class="panel" role="tabpanel" aria-labelledby="tab-%s"%s>' % (tid, tid, '' if i == 0 else ' hidden'))
        out.append('<div class="panel-head"><h2>%s</h2><div class="spec">%s</div></div>' % (head, spec))
        out.append('<div class="acts"></div>')
        out.append('</section>')
    out.append('</div>')
    return '\n'.join(out)


def main():
    src = open(os.path.join(HERE, 'page.html'), encoding='utf-8').read()
    for lv, c in LEVELS.items():
        s = src
        for k, v in (('%%TITLE%%', c['title']), ('%%DESC%%', c['desc']), ('%%STORE%%', c['store']),
                     ('%%TABIDS%%', json.dumps([t[0] for t in c['tabs']]).replace('"', "'").replace(' ', '')),
                     ('%%LV%%', lv), ('%%MARKUP%%', markup(c))):
            assert k in s, k
            s = s.replace(k, v)
        s = s.replace('<html lang="en"><head>', '<!-- Built by tools/alpha-scattering/build.py from page.html: edit the source and rebuild, never this file. -->\n<html lang="en"><head>', 1)
        open(os.path.join(ROOT, c['file']), 'w', encoding='utf-8').write(s)
        print('wrote', c['file'])
    subprocess.run([sys.executable, os.path.join(ROOT, 'tools', 'review', 'drafts.py'), 'sync'], cwd=ROOT, check=False)


if __name__ == '__main__':
    main()
