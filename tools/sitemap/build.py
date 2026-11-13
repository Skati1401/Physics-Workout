#!/usr/bin/env python3
"""Write sitemap.xml for Google: the front page, the course lists and every page
they link to, leaving out drafts (noindex) and redirect pages. Run from anywhere;
the build-sets workflow runs it on every push to main."""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BASE = 'https://skati1401.github.io/Physics-Workout/'
LISTS = ['index.html', 'year-9.html', 'igcse.html', 'ial.html', 'ib.html',
         'animations/igcse.html', 'animations/ial.html', 'animations/ib.html', 'animations/extension.html']

def read(p):
    with open(os.path.join(ROOT, p), encoding='utf-8') as f:
        return f.read()

def publishable(p):
    if not os.path.isfile(os.path.join(ROOT, p)):
        return False
    s = read(p)
    return 'noindex' not in s and not re.search(r'http-equiv="?refresh', s, re.I)

pages = []
for lst in LISTS:
    if lst not in pages and publishable(lst):
        pages.append(lst)
    folder = os.path.dirname(lst)
    for href in re.findall(r'href="([^"#?:]+\.html)', read(lst)):
        p = os.path.normpath(os.path.join(folder, href)).replace(os.sep, '/')
        if p not in pages and publishable(p):
            pages.append(p)

lines = ['<?xml version="1.0" encoding="UTF-8"?>',
         '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for p in pages:
    loc = BASE + ('' if p == 'index.html' else p)
    lines.append('  <url><loc>%s</loc></url>' % loc)
lines.append('</urlset>')
with open(os.path.join(ROOT, 'sitemap.xml'), 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines) + '\n')
print('sitemap.xml: %d pages' % len(pages))
