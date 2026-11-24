"""Build the two simple harmonic motion workouts from one source (TODO 6c, 24 Nov 2026).

    python3 tools/shm/build.py

page.html holds the whole page: the shell and engine (copied from tools/alpha-scattering/page.html), and the content,
content.js, which branches on LV ('ib' or 'ial'). This script fills in the title, description, tabs and panels for each
level and writes simple-harmonic-motion.html (IB C.1) and simple-harmonic-motion-ial.html (IAL 143 to 147, 150) in the
repo root, then runs tools/review/drafts.py sync so the Draft tags are back. Edit page.html, content.js or this file,
never the built pages. A tab given as ('cp', href, label, title) is a core practical link on the tab row, not a panel.
"""
import json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
SEP = '<span class="sep" aria-hidden="true">›</span>'
HL = '<b class="ta" title="Higher level only">HL</b>'

# (id, tab label, panel heading, spec badges HTML, HL tab?), or ('cp', href, label, title) for a practical link
LEVELS = {
    'ib': {
        'file': 'simple-harmonic-motion.html',
        'title': 'C.1 Simple Harmonic Motion Workout',
        'store': 'ib-c1-shm-v1',
        'desc': 'IB Diploma Physics C.1 revision: the conditions for simple harmonic motion and a = &minus;&omega;&sup2;x, '
                'displacement, velocity and acceleration graphs, T = 1/f = 2&pi;/&omega;, the mass&ndash;spring system and the simple pendulum, '
                'and the energy changes in a cycle, with x = x&#8320; sin(&omega;t + &phi;), v = &plusmn;&omega;&radic;(x&#8320;&sup2; &minus; x&sup2;) and E&#8340; = &frac12;m&omega;&sup2;x&#8320;&sup2; at HL.',
        'crumbs': '<a href="index.html">Workouts</a>' + SEP + '<a href="ib.html">IB</a>' + SEP + '<a href="ib.html#theme-c">Theme C</a>' + SEP,
        'note': '<span class="head-note">HL = higher level only</span>',
        'tabs': [
            ('overview', 'Warm Up', 'Warm Up', '<b>C.1</b>', False),
            ('condition', 'The SHM Condition', 'The Condition for SHM', '<b>C.1</b>', False),
            ('graphs', 'Graphs', 'Displacement, Velocity and Acceleration', '<b>C.1</b>', False),
            ('equations', 'SHM Equations', 'The SHM Equations', '<b>C.1</b>', False),
            ('springs', 'Springs and Pendulums', 'Springs and Pendulums', '<b>C.1</b>', False),
            ('energy', 'Energy', 'Energy in SHM', '<b>C.1</b>', False),
            ('exam', 'Exam', 'Exam Questions', '<b>C.1</b>', False),
            ('sumup', 'Sum Up', 'Sum Up', '<b>C.1</b>', False),
        ],
    },
    'ial': {
        'file': 'simple-harmonic-motion-ial.html',
        'title': 'Simple Harmonic Motion Workout',
        'store': 'ial-143-shm-v1',
        'desc': 'Edexcel International A Level Physics Unit 5 revision (spec 143 to 147 and 150): the condition F = &minus;kx for simple harmonic motion, '
                'displacement, velocity and acceleration graphs and their gradients, a = &minus;&omega;&sup2;x, x = A cos &omega;t, v = &minus;A&omega; sin &omega;t and &omega; = 2&pi;f, '
                'T = 2&pi;&radic;(m/k) and T = 2&pi;&radic;(l/g), and energy in an undamped oscillator.',
        'crumbs': '<a href="index.html">Workouts</a>' + SEP + '<a href="ial.html">IAL</a>' + SEP + '<a href="ial.html#unit-5">Unit 5</a>' + SEP,
        'note': '',
        'tabs': [
            ('overview', 'Warm Up', 'Warm Up', '<b>143&ndash;147</b><b>150</b>', False),
            ('condition', 'The SHM Condition', 'The Condition for SHM', '<b>143</b>', False),
            ('graphs', 'Graphs', 'Displacement, Velocity and Acceleration', '<b>146</b><b>147</b>', False),
            ('equations', 'SHM Equations', 'The SHM Equations', '<b>144</b>', False),
            ('springs', 'Springs and Pendulums', 'Springs and Pendulums', '<b>145</b>', False),
            ('cp', 'resonance-practical.html', 'CP16 Practical &rarr;', 'Core practical 16: an unknown mass from resonant frequencies'),
            ('energy', 'Energy', 'Energy in SHM', '<b>150</b>', False),
            ('exam', 'Exam', 'Exam Questions', '<b>143</b><b>144</b><b>145</b><b>147</b><b>150</b>', False),
            ('sumup', 'Sum Up', 'Sum Up', '<b>143&ndash;147</b><b>150</b>', False),
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
    for i, t in enumerate(c['tabs']):
        if t[0] == 'cp':
            out.append('<a class="tab-btn tab-cp" href="%s" title="%s. Opens the practical page." aria-label="%s: open the practical page">%s</a>' % (t[1], t[3], t[3], t[2]))
            continue
        tid, lab, head, spec, hl = t
        out.append('<button class="tab-btn%s" role="tab" id="tab-%s" data-tab="%s" data-grp=""%s aria-selected="%s" aria-controls="panel-%s">%s</button>'
                   % (' is-active' if i == 0 else '', tid, tid, ' data-hl' if hl else '', 'true' if i == 0 else 'false', tid, lab))
    out.append('</nav>')
    for i, (tid, lab, head, spec, hl) in enumerate(t for t in c['tabs'] if t[0] != 'cp'):
        out.append('<section id="panel-%s" class="panel" role="tabpanel" aria-labelledby="tab-%s"%s>' % (tid, tid, '' if i == 0 else ' hidden'))
        out.append('<div class="panel-head"><h2>%s</h2><div class="spec">%s</div></div>' % (head, spec))
        out.append('<div class="acts"></div>')
        out.append('</section>')
    out.append('</div>')
    return '\n'.join(out)


def main():
    src = open(os.path.join(HERE, 'page.html'), encoding='utf-8').read()
    src = src.replace('%%CONTENT%%', open(os.path.join(HERE, 'content.js'), encoding='utf-8').read())
    for lv, c in LEVELS.items():
        s = src
        for k, v in (('%%TITLE%%', c['title']), ('%%DESC%%', c['desc']), ('%%STORE%%', c['store']),
                     ('%%TABIDS%%', json.dumps([t[0] for t in c['tabs'] if t[0] != 'cp']).replace('"', "'").replace(' ', '')),
                     ('%%LV%%', lv), ('%%MARKUP%%', markup(c))):
            assert k in s, k
            s = s.replace(k, v)
        s = s.replace('<html lang="en"><head>', '<!-- Built by tools/shm/build.py from page.html and content.js: edit the source and rebuild, never this file. -->\n<html lang="en"><head>', 1)
        open(os.path.join(ROOT, c['file']), 'w', encoding='utf-8').write(s)
        print('wrote', c['file'])
    subprocess.run([sys.executable, os.path.join(ROOT, 'tools', 'review', 'drafts.py'), 'sync'], cwd=ROOT, check=False)


if __name__ == '__main__':
    main()
