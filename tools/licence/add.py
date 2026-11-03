"""Add the licence footer (tools/licence/footer.html) to every hand-written page.
Practical pages get it from gen.py, calculations.html and graphs.html from tools/sets/build.py.
Redirect pages are skipped. Safe to re-run: pages that already have it are left alone."""
import glob, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FOOT = open(os.path.join(ROOT, 'tools/licence/footer.html'), encoding='utf-8').read().strip()
done = []
for p in sorted(glob.glob(os.path.join(ROOT, '*.html')) + glob.glob(os.path.join(ROOT, 'animations/*.html'))):
    name = os.path.relpath(p, ROOT)
    s = open(p, encoding='utf-8').read()
    if 'pw-licence' in s or name.endswith('-practical.html') or name in ('calculations.html', 'graphs.html'):
        continue
    if len(s) < 2500 and re.search(r'http-equiv="refresh"|location\.replace', s):
        continue
    i = s.rfind('</body>')
    if i < 0:
        print('NO </body>:', name); continue
    open(p, 'w', encoding='utf-8').write(s[:i] + FOOT + '\n' + s[i:])
    done.append(name)
print(len(done), 'pages')
