#!/usr/bin/env python3
"""Checks for teaching animation pages (see tools/ANIMATION-STYLE.md).

Run a local server in the repo root first:  python3 -m http.server 8765
Then:  python3 tools/anim-check.py dc-motor.html ac-generator.html "dc-motor.html?show=gen"

For each page, at 1366x657, 1280x610 and 390x800, it presses every button in the stage card and reports:
  - JavaScript errors
  - whether the stage card ends above the bottom of the window (laptop sizes only)
  - sideways scrolling
  - picture text that is clipped by the edge of the picture, or that overlaps other picture text
It cannot tell whether a label lies over a drawn object: look at screenshots for that
(add --shots DIR to save one per page and size).
"""
import sys
from playwright.sync_api import sync_playwright

JS = """()=>{const out=[];document.querySelectorAll('svg.view').forEach(svg=>{
 const V=svg.getBoundingClientRect(), T=[...svg.querySelectorAll('text')].filter(t=>t.textContent.trim()&&t.getBoundingClientRect().width>0);
 const hit=(a,b)=>!(a.right<=b.left+1||b.right<=a.left+1||a.bottom<=b.top+2||b.bottom<=a.top+2);
 T.forEach((t,i)=>{const r=t.getBoundingClientRect();
  if(r.left<V.left-1||r.right>V.right+1||r.top<V.top-1||r.bottom>V.bottom+1) out.push('clipped: "'+t.textContent+'"');
  T.slice(i+1).forEach(u=>{ if(hit(r,u.getBoundingClientRect())) out.push('overlap: "'+t.textContent+'" and "'+u.textContent+'"'); }); }); });
 return out;}"""

def main():
    args = sys.argv[1:]
    shots = None
    if '--shots' in args:
        i = args.index('--shots'); shots = args[i+1]; del args[i:i+2]
    ok = True
    with sync_playwright() as p:
        b = p.chromium.launch()
        for page in args:
            for w, h in [(1366, 657), (1280, 610), (390, 800)]:
                pg = b.new_page(viewport={'width': w, 'height': h})
                errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
                pg.goto('http://localhost:8765/animations/' + page, wait_until='domcontentloaded'); pg.wait_for_timeout(500)
                bad = set(pg.evaluate(JS))
                n = pg.locator('.stage button:visible').count()
                for i in range(n):
                    btn = pg.locator('.stage button:visible').nth(i)
                    try:
                        if btn.is_enabled(timeout=500): btn.click(timeout=800)
                    except Exception: pass
                    pg.wait_for_timeout(120); bad |= set(pg.evaluate(JS))
                m = pg.evaluate("()=>({bottom:Math.round(document.querySelector('.stage').getBoundingClientRect().bottom),sw:document.documentElement.scrollWidth})")
                notes = []
                if errs: notes.append('errors: ' + '; '.join(errs))
                if w > 600 and m['bottom'] > h: notes.append('card ends at %d, window is %d' % (m['bottom'], h))
                if m['sw'] > w: notes.append('scrolls sideways (%d wide)' % m['sw'])
                notes += sorted(bad)
                if shots: pg.screenshot(path='%s/%s-%d.png' % (shots, page.replace('?', '_').replace('.html', ''), w), full_page=True)
                print('%-34s %4dx%-4d %s' % (page, w, h, 'ok' if not notes else ''))
                for x in notes: print('    ' + x); ok = False
                pg.close()
        b.close()
    sys.exit(0 if ok else 1)

if __name__ == '__main__':
    main()
