#!/usr/bin/env python3
"""Copies the shared drawing kits from their master copies into the animation pages.

Each kit has one master copy, tools/<kit>/kit.js. A page that carries a kit has two marker lines in its
main <script>, and this script rewrites everything between them from the master, so pages stay
self-contained and a chat never has to read kit code in a page:

  // ---- solid kit (master: tools/solid-kit/kit.js; copied by tools/kits.py, do not edit here) ----
  ...kit code, written by this script...
  // ---- end of solid kit ----

  python3 tools/kits.py              # after editing a master: copy every kit into every page that has its markers
  python3 tools/kits.py solid-kit    # copy one kit only
  python3 tools/kits.py --check      # change nothing; list the pages that are out of step (exit 1 if any)
  python3 tools/kits.py --list       # which pages carry which kit

To add a kit to a new page, put the two marker lines (copied from any page that has the kit) where the kit's
functions should go, inside the page's main script, then run the script. The kit is indented like the end marker.

Options in the start marker, inside the brackets after "do not edit here":
  parts: tri flowMarks scene3      only those parts of the master (a master is cut into parts by "//@part name" lines)
  renames: arrow=solidArrow txt=ktxt   the page already had its own function of that name, so the kit's is renamed
                                       (every "name(" in the kit becomes "newname(")
Example: // ---- solid kit (master: tools/solid-kit/kit.js; copied by tools/kits.py, do not edit here; renames: ln=kln) ----

The Experiment kit (tools/experiment-kit/kit.js) is copied whole, its own first and last comment lines included.
The space kit and the Choice kit have their own scripts (tools/space-kit.py, tools/choice-kit.py).
"""
import re, sys, glob, os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..')
A = os.path.join(ROOT, 'animations')

# slug: label in the markers
KITS = {
    '3d-kit': '3D kit',
    'bench-kit': 'bench kit',
    'solid-kit': 'solid kit',
    'instrument-kit': 'instrument kit',
    'circuit-helpers': 'circuit helpers',
    'circuit-board-kit': 'circuit board kit',
    'graph-helper': 'graph helper',
    'bench-helpers': 'bench helpers',
    'solid-people': 'solid people',
}
TAG = 'copied by tools/kits.py'
EXP_START = '/* ================= Experiment kit (copy this block'
EXP_END = '/* ================= end of Experiment kit ================= */'


def master(slug):
    return open(os.path.join(HERE, slug, 'kit.js'), encoding='utf-8').read().rstrip('\n').split('\n')


def split_parts(lines):
    """[(name, lines)] in order; lines before the first //@part line belong to every selection."""
    parts, cur = [], ('', [])
    for l in lines:
        m = re.match(r'\s*//@part\s+(\S+)', l)
        if m:
            parts.append(cur); cur = (m.group(1), [])
        else:
            cur[1].append(l)
    parts.append(cur)
    return parts


def options(marker):
    o = {'parts': None, 'renames': []}
    m = re.search(r'parts:\s*([^;)]+)', marker)
    if m: o['parts'] = m.group(1).split()
    m = re.search(r'renames:\s*([^;)]+)', marker)
    if m: o['renames'] = [tuple(x.split('=')) for x in m.group(1).split()]
    return o


def render(slug, marker, indent):
    o = options(marker)
    parts = split_parts(master(slug))
    names = [n for n, _ in parts if n]
    if o['parts']:
        bad = [p for p in o['parts'] if p not in names]
        if bad: raise SystemExit('%s has no part %s (it has %s)' % (slug, ', '.join(bad), ', '.join(names)))
    out = []
    for n, ls in parts:
        if not n or o['parts'] is None or n in o['parts']:
            out += ls
    text = '\n'.join(out)
    for a, b in o['renames']:
        text = re.sub(r'(?<![\w$.])' + re.escape(a) + r'\(', b + '(', text)
    return [(indent + l) if l.strip() else '' for l in text.split('\n')]


def start_re(label):
    return re.compile(r'^(\s*)// ---- ' + re.escape(label) + r' \(.*' + re.escape(TAG))


def end_re(label):
    return re.compile(r'^(\s*)// ---- end of ' + re.escape(label) + r' ----\s*$')


def apply(path, slugs):
    s = open(path, encoding='utf-8').read()
    L = s.split('\n')
    found = []
    for slug in [x for x in slugs if x in KITS]:
        label = KITS[slug]
        sr, er = start_re(label), end_re(label)
        i = 0
        while i < len(L):
            if sr.match(L[i]):
                j = next((k for k in range(i + 1, len(L)) if er.match(L[k])), None)
                if j is None: raise SystemExit('%s: no "end of %s" marker' % (path, label))
                ind = er.match(L[j]).group(1)
                L[i + 1:j] = render(slug, L[i], ind)
                found.append(slug)
                i = i + 1
            i += 1
    if 'experiment-kit' in slugs:
        i = next((k for k, l in enumerate(L) if l.startswith(EXP_START)), None)
        if i is not None:
            j = next((k for k in range(i, len(L)) if L[k].startswith('/* ================= end of Experiment kit')), None)
            if j is None: raise SystemExit('%s: no end of Experiment kit' % path)
            if L[j] != EXP_END: i = None   # a cut-down copy (its end line says so): not kept in step
        if i is not None:
            L[i:j + 1] = open(os.path.join(HERE, 'experiment-kit', 'kit.js'), encoding='utf-8').read().rstrip('\n').split('\n')
            found.append('experiment-kit')
    t = '\n'.join(L)
    return s, t, found


def main():
    args = sys.argv[1:]
    check = '--check' in args; lst = '--list' in args
    slugs = [a for a in args if not a.startswith('--')] or list(KITS) + ['experiment-kit']
    for a in slugs:
        if a not in KITS and a != 'experiment-kit': raise SystemExit('no kit called ' + a + ' (kits: ' + ', '.join(list(KITS) + ['experiment-kit']) + ')')
    out = 0
    for p in sorted(glob.glob(os.path.join(A, '*.html'))):
        n = os.path.basename(p)
        old, new, found = apply(p, slugs)
        if lst:
            if found: print('%-34s %s' % (n, ' '.join(found)))
            continue
        if not found: continue
        if old != new:
            out = 1
            if check: print('out of step  ' + n + '  (' + ' '.join(found) + ')')
            else:
                open(p, 'w', encoding='utf-8').write(new); print('changed      ' + n)
    if check and not out: print('every page is in step with the kit masters')
    sys.exit(out if check else 0)


if __name__ == '__main__':
    main()
