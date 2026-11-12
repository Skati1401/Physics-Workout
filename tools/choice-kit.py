#!/usr/bin/env python3
"""Copies the Choice kit (see tools/ANIMATION-STYLE.md, "Choices") from animations/motor-effect.html
into the animation pages named, or into every page that already has it when none is named.

  python3 tools/choice-kit.py                 # after editing the kit in motor-effect.html
  python3 tools/choice-kit.py new-page.html   # add the kit to a new page

It adds or replaces only the two marked blocks (<style id="choice-kit"> and <script id="choice-kit-js">).
The mode switch (class "seg tabs mode") and the .to-q button are in each page's own markup.
"""
import re, sys, glob, os
A = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'animations')
src = open(os.path.join(A, 'motor-effect.html'), encoding='utf-8').read()
CSS = re.search(r'<style id="choice-kit">.*?</style>', src, re.S).group(0)
JS = re.search(r'<script id="choice-kit-js">.*?</script>', src, re.S).group(0)
names = sys.argv[1:] or [os.path.basename(f) for f in glob.glob(os.path.join(A, '*.html')) if 'id="choice-kit"' in open(f, encoding='utf-8').read()]
for n in sorted(names):
    p = os.path.join(A, n); s = o = open(p, encoding='utf-8').read()
    s = re.sub(r'\n?<style id="choice-kit">.*?</style>', '', s, flags=re.S)
    s = re.sub(r'\n?<script id="choice-kit-js">.*?</script>\n?', '', s, flags=re.S)
    i = s.rfind('</style>', 0, s.find('</head>')) + 8
    s = s[:i] + '\n' + CSS + s[i:]
    j = s.find('<footer class="pw-licence"')
    if j < 0: j = s.rfind('</body>')
    s = s[:j] + JS + '\n' + s[j:]
    if s != o: open(p, 'w', encoding='utf-8').write(s)
    print(('changed  ' if s != o else 'same     ') + n)
