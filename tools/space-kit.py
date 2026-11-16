#!/usr/bin/env python3
"""Copies the space kit (the Sun, Earth and Moon drawings; see tools/ANIMATION-STYLE.md, "The space kit")
from tools/space-kit/kit.js into the animation pages named, or into every page that already has it when none is named.

  python3 tools/space-kit.py                  # after editing tools/space-kit/kit.js
  python3 tools/space-kit.py new-page.html    # add the kit to a new page in animations/

It adds or replaces only the marked block <script id="space-kit-js">…</script>, which goes just before the
page's first <script> inside <body>, so the page's own script can use SK. Pages stay self-contained.
"""
import re, sys, glob, os
HERE = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(HERE, '..', 'animations')
KIT = open(os.path.join(HERE, 'space-kit', 'kit.js'), encoding='utf-8').read().strip()
BLOCK = '<script id="space-kit-js">\n' + KIT + '\n</script>\n'
names = sys.argv[1:] or [os.path.basename(f) for f in glob.glob(os.path.join(A, '*.html'))
                         if 'id="space-kit-js"' in open(f, encoding='utf-8').read()]
for n in sorted(names):
    p = os.path.join(A, os.path.basename(n)); s = o = open(p, encoding='utf-8').read()
    if 'id="space-kit-js"' in s:
        s = re.sub(r'<script id="space-kit-js">.*?</script>\n?', lambda m: BLOCK, s, count=1, flags=re.S)
    else:
        b = s.find('<body')
        j = s.find('<script', b)
        if b < 0 or j < 0: print('no <script> in <body>: ' + n); continue
        s = s[:j] + BLOCK + s[j:]
    if s != o: open(p, 'w', encoding='utf-8').write(s)
    print(('changed  ' if s != o else 'same     ') + n)
