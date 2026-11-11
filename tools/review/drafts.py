#!/usr/bin/env python3
"""Draft tags, driven by tools/REVIEW.md (Alex, 11 Nov 2026).

Every page whose REVIEW.md row is not ✅ Checked shows a "Draft" tag after its <h1>,
and its cards on the course and animation lists show one too. Alex clears a tag from
the page itself: in reviewer mode (open any page once with ?reviewer) a "✓ Checked"
button opens a GitHub issue "Checked: <page>"; .github/workflows/mark-checked.yml runs
`drafts.py check <page>` for issues Alex opens, and commits.

  python3 tools/review/drafts.py sync           # make every page and list match REVIEW.md
  python3 tools/review/drafts.py check PAGE     # mark PAGE ✅ in REVIEW.md, then sync
  python3 tools/review/drafts.py list           # print the pages that are Draft

What sync writes:
  - the reviewer snippet (tools/review/snippet.html) in every page that has the visit
    counter, between <!-- pw-review --> markers, just before </head>;
  - <meta name="pw-draft" content="PAGE"> straight after the snippet on each Draft page;
  - data-draft on each list card (a.act, a.anim-card) that links to a Draft page.
Never edit these by hand: change REVIEW.md and run sync (the build-sets workflow runs it
on every push to main).
"""
import datetime
import os
import re
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
REVIEW = os.path.join(ROOT, 'tools', 'REVIEW.md')
SNIPPET = os.path.join(ROOT, 'tools', 'review', 'snippet.html')
LISTS = ['igcse.html', 'ial.html', 'ib.html', 'year-9.html', 'index.html',
         'animations/igcse.html', 'animations/ial.html', 'animations/ib.html']
START, END = '<!-- pw-review -->', '<!-- /pw-review -->'
PAGE_RE = re.compile(r'^(animations/)?[a-z0-9][a-z0-9-]*\.html$')
META_RE = re.compile(r'\n?<meta name="pw-draft" content="[^"]*">')


def read(p):
    with open(os.path.join(ROOT, p), encoding='utf-8') as f:
        return f.read()


def write(p, s):
    with open(os.path.join(ROOT, p), 'w', encoding='utf-8', newline='') as f:
        f.write(s)


def rows():
    """Yield (line index, page path, status column index, cells) for each page row."""
    lines = read('tools/REVIEW.md').split('\n')
    prefix, status_col = '', None
    for i, line in enumerate(lines):
        if line.startswith('## '):
            prefix = 'animations/' if 'Animations' in line else ''
            status_col = None
            continue
        if not line.startswith('|'):
            continue
        cells = line.split('|')
        if status_col is None:
            heads = [c.strip() for c in cells]
            if 'Status' in heads:
                status_col = heads.index('Status')
            continue
        m = re.search(r'`([^`]+\.html)`', cells[1])
        if not m or set(cells[1].strip()) <= set('-: '):
            continue
        page = m.group(1)
        if '/' not in page:
            page = prefix + page
        yield i, page, status_col, cells


def statuses():
    return {page: cells[col].strip() for _, page, col, cells in rows()}


def draft_pages():
    return {p for p, s in statuses().items()
            if not s.startswith('✅') and p not in LISTS and os.path.exists(os.path.join(ROOT, p))}


def add_block(s, page, drafts=None, snippet=None):
    """Put the reviewer snippet before </head> (or refresh it) and the pw-draft meta if PAGE is Draft.
    Also used by tools/practical-gen/gen.py, so a rebuilt practical keeps its tag."""
    if drafts is None:
        drafts = draft_pages()
    if snippet is None:
        snippet = read('tools/review/snippet.html').strip()
    s = META_RE.sub('', s)
    block = START + '\n' + snippet + '\n' + END
    if START in s:
        a, b = s.index(START), s.index(END) + len(END)
        s = s[:a] + block + s[b:]
    else:
        s = s.replace('</head>', block + '\n</head>', 1)
    if page in drafts:
        s = s.replace(END, END + '\n<meta name="pw-draft" content="' + page + '">', 1)
    return s


def sync():
    snippet = read('tools/review/snippet.html').strip()
    drafts = draft_pages()
    changed = []
    pages = [f for f in os.listdir(ROOT) if f.endswith('.html')]
    pages += ['animations/' + f for f in os.listdir(os.path.join(ROOT, 'animations')) if f.endswith('.html')]
    for p in sorted(pages):
        s = old = read(p)
        if 'gc.zgo.at' not in s:          # redirect pages have no visit counter: leave them alone
            continue
        s = add_block(s, p, drafts, snippet)
        if p in LISTS:
            s = tag_cards(p, s, drafts)
        if s != old:
            write(p, s)
            changed.append(p)
    return changed


def tag_cards(listpage, s, drafts):
    base = os.path.dirname(listpage)

    def fix(m):
        tag = m.group(0)
        href = re.search(r'href="([^"#?]+)', tag)
        tag = re.sub(r' data-draft(?=[\s>])', '', tag)
        if href:
            target = os.path.normpath(os.path.join(base, href.group(1))).replace(os.sep, '/')
            if target in drafts:
                tag = tag[:-1] + ' data-draft>'
        return tag
    return re.sub(r'<a class="(?:act|anim-card)"[^>]*>', fix, s)


def check(page):
    page = page.strip()
    if not PAGE_RE.match(page):
        sys.exit('Not a page path: ' + page)
    lines = read('tools/REVIEW.md').split('\n')
    for i, p, col, cells in rows():
        if p == page:
            today = datetime.date.today()
            cells[col] = ' ✅ Checked (Alex, %d %s, ✓ button) ' % (today.day, today.strftime('%b %Y'))
            if len(cells) > col + 2:
                cells[col + 1] = ' '
            lines[i] = '|'.join(cells)
            write('tools/REVIEW.md', '\n'.join(lines))
            return sync()
    sys.exit('No row for %s in tools/REVIEW.md' % page)


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'sync'
    if cmd == 'sync':
        print('\n'.join(sync()) or 'Nothing to change')
    elif cmd == 'check' and len(sys.argv) > 2:
        print('\n'.join(check(sys.argv[2])) or 'Nothing to change')
    elif cmd == 'list':
        print('\n'.join(sorted(draft_pages())))
    else:
        sys.exit(__doc__)
