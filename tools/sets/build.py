#!/usr/bin/env python3
"""Build calculations.html, the Calculations Workout, from calculation-generator.html.

22 Nov 2026 (Alex): the Calculations Workout is the quick version of the Calculation Generator.
A student ticks whole units and chooses Easy (substitute and rearrange) or Hard (also unit
conversions and multipliers), then answers one new question after another. The Generator stays
the detailed selector (ticks per equation, and every option on its own).

So there is one question bank: this script copies calculation-generator.html and swaps in
- the title, description, Draft meta and heading,
- the chooser (#chooser with data-quick, which switches the page's script to quick mode),
- the practice bar (with the Easy / Hard switch).
Everything else (questions, marking, hints, working, the quick-mode code and CSS) lives in
calculation-generator.html. Edit that page, never calculations.html.

Until 22 Nov 2026 this script built calculations.html from the workouts' Calculate cards
(one row per equation, two questions each); that code is in the git history.

.github/workflows/build-sets.yml runs this on every push to main and commits the result.
To build by hand:

    python3 tools/sets/build.py
"""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC, OUT = 'calculation-generator.html', 'calculations.html'
TITLE = 'Calculations Workout'
DESCRIPTION = ('Edexcel IGCSE Physics calculations: tick the units you want, choose Easy or Hard, '
               'then answer one new question after another, with hints and the full working.')

LEVEL = ('<div class="q-level" role="radiogroup" aria-label="Difficulty">'
         '<label><input type="radio" name="%(name)s" value="easy" data-level><b>Easy</b>%(easy)s</label>'
         '<label><input type="radio" name="%(name)s" value="hard" data-level><b>Hard</b>%(hard)s</label></div>')

CHOOSER = ('<section id="chooser" aria-labelledby="ch-title" data-quick>\n<div class="ch-top">\n'
  '<h2 id="ch-title" tabindex="-1">Choose Your Units</h2>\n'
  '<p>Pick how hard and tick the units you want, then press Start. Every question is new.</p>\n'
  + LEVEL % {'name': 'lv-choose', 'easy': '<small>Substitute and rearrange</small>',
             'hard': '<small>Also unit conversions and multipliers</small>'} + '\n'
  '<div class="ch-go"><button type="button" class="btn primary" id="ch-start" disabled>Start</button>'
  '<span class="ch-count" id="ch-count" aria-live="polite"></span>'
  '<button type="button" class="btn" id="ch-all">Tick all</button>'
  '<button type="button" class="btn" id="ch-da" aria-pressed="false">Leave out TA</button></div>\n'
  '</div>\n<div class="q-units" id="ch-units"></div>\n</section>\n')

PRACTICE = ('<section id="practice" aria-labelledby="pr-title" hidden>\n'
  '<div class="pr-bar"><h2 id="pr-title" tabindex="-1">Practise</h2>'
  + LEVEL % {'name': 'lv-practise', 'easy': '', 'hard': ''} +
  '<button type="button" class="btn" id="pr-back">&larr; Change units</button></div>\n'
  '<div id="pr-card"></div>\n</section>\n')

def swap(s, pattern, new, flags=0):
    t, n = re.subn(pattern, lambda m: new, s, count=1, flags=flags)
    assert n == 1, ('not found in ' + SRC, pattern)
    return t

def build():
    s = open(os.path.join(ROOT, SRC), encoding='utf-8').read()
    s = swap(s, r'<title>[^<]*</title>', '<title>' + TITLE + '</title>')
    s = swap(s, r'<meta name="description" content="[^"]*">', '<meta name="description" content="%s">' % DESCRIPTION)
    s = re.sub(r'<meta name="pw-draft" content="[^"]*">', '<meta name="pw-draft" content="%s">' % OUT, s)  # drafts.py sync keeps it right
    s = swap(s, r'<h1>[^<]*</h1>', '<h1>' + TITLE + '</h1>')
    s = swap(s, r'<section id="chooser".*?</section>\n', CHOOSER, re.S)
    s = swap(s, r'<section id="practice".*?</section>\n', PRACTICE, re.S)
    s = swap(s, r'\n<script>\n\(function\(\)\{\nconst \$=',
             '\n<!-- Built by tools/sets/build.py from %s. Do not edit by hand: edit %s; this page rebuilds on push. -->'
             '\n<script>\n(function(){\nconst $=' % (SRC, SRC))
    open(os.path.join(ROOT, OUT), 'w', encoding='utf-8').write(s)
    print('built', OUT, 'from', SRC)

if __name__ == '__main__':
    build()
