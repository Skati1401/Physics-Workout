#!/usr/bin/env python3
"""frame-check.py: did a change to an animation page change how it looks in a workout frame?

Usage:  python3 tools/frame-check.py [--base REF] animations/<page>.html ...
        (a bare name such as film-badge works too)

For each page it finds every workout and practical page that frames it, loads those
pages to collect the exact frame links (?embed, &show=, &level=), then loads each
frame twice, once from REF (default origin/main, i.e. before your unpushed commits
and your uncommitted edits) and once from your working copy, at 1280x800 and
390x800. It compares where every element outside the SVG pictures sits, the size
of each picture, and any script errors. Math.random is seeded the same way on both
sides, and anything that changes between two loads of the same version is ignored,
so random questions do not count as a change.

Exit code 0 = every frame is the same; 1 = a frame changed (the lines are listed).
Run it before pushing a change to an animation page (teacher pages, TODO 8q-8ac).
If you have already pushed, give --base the commit before your first one.
"""
import argparse, os, re, socket, subprocess, sys, tempfile, threading, functools, http.server
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SIZES = [(1280, 800), (390, 800)]
SEED = """(()=>{let s=12345;Math.random=function(){s=(s*1103515245+12345)%2147483648;return s/2147483648;};})();"""
LAYOUT = """()=>[...document.querySelectorAll('body *')].filter(e=>!e.closest('svg')&&e.offsetParent!==null).map(e=>{
  const r=e.getBoundingClientRect(); const c=(typeof e.className==='string'?e.className:'');
  return e.tagName+'.'+c+' '+[r.x,r.y,r.width,r.height].map(Math.round).join(',')})
  .concat([...document.querySelectorAll('svg')].filter(s=>!s.parentNode.closest('svg')&&s.getBoundingClientRect().width>60)
  .map(s=>{const r=s.getBoundingClientRect();return 'SVG '+(s.getAttribute('viewBox')||'')+' '+[r.x,r.y,r.width,r.height].map(Math.round).join(',')}))"""
# ids are left out on purpose: giving a block a new id (for the teach kit's strip) does not change the frame


def serve(directory):
    sock = socket.socket(); sock.bind(('127.0.0.1', 0)); port = sock.getsockname()[1]; sock.close()
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    h = functools.partial(Quiet, directory=directory)
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', port), h)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, port


def frame_links(browser, port, page):
    """Load every root page that mentions <page>.html and collect its frame srcs for that page."""
    name = os.path.basename(page)
    hosts = [f for f in sorted(os.listdir(ROOT)) if f.endswith('.html') and name in open(os.path.join(ROOT, f), encoding='utf-8').read()]
    links = set()
    for f in hosts:
        pg = browser.new_page(viewport={'width': 1280, 'height': 800})
        pg.route(re.compile(r'^https?://(?!127\.0\.0\.1).*'), lambda r: r.abort())
        try:
            pg.goto(f'http://127.0.0.1:{port}/{f}', wait_until='load'); pg.wait_for_timeout(300)
            for s in pg.evaluate("()=>[...document.querySelectorAll('iframe')].map(i=>i.getAttribute('src')||'')"):
                if re.search(r'(^|/)' + re.escape(name) + r'\?', s):
                    links.add('animations/' + s.split('animations/')[-1])
        finally:
            pg.close()
    return hosts, sorted(links)


def snapshot(browser, port, url, w, h):
    pg = browser.new_page(viewport={'width': w, 'height': h})
    pg.add_init_script(SEED)
    pg.route(re.compile(r'^https?://(?!127\.0\.0\.1).*'), lambda r: r.abort())   # fonts and counter off: same on both sides
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e).split('\n')[0]))
    pg.goto(f'http://127.0.0.1:{port}/{url}', wait_until='load'); pg.wait_for_timeout(700)
    out = pg.evaluate(LAYOUT) + ['ERROR ' + e for e in errs]
    pg.close()
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--base', default='origin/main')
    ap.add_argument('pages', nargs='+')
    a = ap.parse_args()
    pages = [p if p.startswith('animations/') else 'animations/' + (p if p.endswith('.html') else p + '.html') for p in a.pages]

    base_dir = tempfile.mkdtemp(prefix='frame-base-')
    subprocess.run(['git', '-C', ROOT, 'worktree', 'add', '-q', '--detach', base_dir, a.base], check=True)
    changed = 0
    try:
        new_srv, new_port = serve(ROOT); old_srv, old_port = serve(base_dir)
        with sync_playwright() as p:
            b = p.chromium.launch()
            for page in pages:
                hosts, links = frame_links(b, new_port, page)
                if not links:
                    print(f'{page}: no workout or practical frames it' + (f' (mentioned in {", ".join(hosts)})' if hosts else ''))
                    continue
                print(f'{page}: {len(links)} frame link(s) from {", ".join(hosts)}')
                for url in links:
                    for w, h in SIZES:
                        o1, o2 = snapshot(b, old_port, url, w, h), snapshot(b, old_port, url, w, h)
                        n1, n2 = snapshot(b, new_port, url, w, h), snapshot(b, new_port, url, w, h)
                        noisy = (set(o1) ^ set(o2)) | (set(n1) ^ set(n2))       # changes between loads of one version
                        gone = [x for x in o1 if x not in n1 and x not in noisy]
                        added = [x for x in n1 if x not in o1 and x not in noisy]
                        tag = f'  {w}x{h}  {url}'
                        if gone or added:
                            changed += 1
                            print(tag + '  CHANGED')
                            for x in gone[:6]: print('      before:', x)
                            for x in added[:6]: print('      now:   ', x)
                        else:
                            print(tag + '  same')
            b.close()
        new_srv.shutdown(); old_srv.shutdown()
    finally:
        subprocess.run(['git', '-C', ROOT, 'worktree', 'remove', '--force', base_dir])
    print('\nEvery frame is the same.' if not changed else f'\n{changed} frame view(s) changed: fix before pushing, or say why it is intended.')
    sys.exit(1 if changed else 0)


if __name__ == '__main__':
    main()
