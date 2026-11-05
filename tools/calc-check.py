"""Check every Calculate card on workout pages: no page errors; for the fixed set and 15 New problems sets, each
question's Show answer value is accepted as correct, the working has no NaN/undefined, and its last line contains the
answer. Also checks 380px has no sideways scroll with every working open. Usage: calccheck.py page.html [page.html ...]
(server on localhost:8765, repo root)."""
import sys,re
from playwright.sync_api import sync_playwright
JS_ROWS="""(()=>[...document.querySelectorAll('.calc-inputs')].map((w,ci)=>({ci,n:w.children.length,np:!!w.parentElement.querySelector('.bar .btn')&&[...w.parentElement.querySelectorAll('.bar .btn')].some(b=>b.textContent==='New problems')})))()"""
def run(pg,page):
    probs=[]
    cards=pg.evaluate(JS_ROWS)
    for c in cards:
        rounds=16 if c['np'] else 1
        for r in range(rounds):
            res=pg.evaluate("""(ci)=>{const w=document.querySelectorAll('.calc-inputs')[ci],host=w.parentElement,act=w.closest('.act');
              const panel=w.closest('.panel');panel.hidden=false;
              const btn=t=>[...host.querySelectorAll('.bar .btn')].find(b=>b.textContent===t);
              btn('Clear').click();const out=[];
              [...w.children].forEach(row=>{const inp=row.querySelector('input');inp.value='999999.123';});
              btn('Check answers').click();
              [...w.children].forEach((row,i)=>{const sb=row.querySelector('.calc-show');if(!sb.hidden)sb.click();
                const ans=row.querySelector('input').value,cw=row.querySelector('.cw'),txt=cw.innerText,lab=row.querySelector('label').innerText;
                const lines=txt.trim().split(/\\n/);out.push({i,ans,lab,txt,split:!!cw.querySelector('.cw-split'),last:lines.slice(-3).join(' ')});});
              btn('Clear').click();
              [...w.children].forEach((row,i)=>{row.querySelector('input').value=out[i].ans.replace('×10^','e');});
              btn('Check answers').click();
              [...w.children].forEach((row,i)=>{out[i].ok=row.querySelector('input').disabled;});
              btn('Clear').click();
              const title=(act&&act.querySelector('.act-title')||{}).textContent||'';
              return {title,out};}""",c['ci'])
            for o in res['out']:
                bad=[]
                if not o['ok']: bad.append('shown answer not accepted')
                if re.search(r'NaN|undefined|Infinity',o['txt']+o['lab']+o['ans']): bad.append('NaN/undefined')
                num=o['ans'].replace('×10^','e')
                try:
                    v=float(num); keys={num,o['ans'],('%g'%v),('%g'%v).replace('e','×10^'),('%g'%v).replace('e+0','e').replace('e-0','e-'),('%.2e'%v).replace('e+0','e').replace('e-0','e-'),('%.3g'%v)}
                    sup=str.maketrans('⁰¹²³⁴⁵⁶⁷⁸⁹⁻','0123456789-')
                    flat=o['last'].translate(sup).replace('×10','e').replace('\u2212','-').replace('\u2009','').replace(' ','').replace('\u00a0','')
                    if not any(k.replace(' ','') in flat for k in keys if k): bad.append('answer %s not in last lines'%o['ans'])
                except: pass
                if not o['split']: bad.append('no givens||steps layout')
                if bad: probs.append((res['title'],'fixed' if r==0 else 'new%d'%r,o['i'],o['lab'][:60],'; '.join(bad)))
            if c['np']: pg.evaluate("""(ci)=>{const host=document.querySelectorAll('.calc-inputs')[ci].parentElement;[...host.querySelectorAll('.bar .btn')].find(b=>b.textContent==='New problems').click();}""",c['ci'])
    return cards,probs
with sync_playwright() as p:
    b=p.chromium.launch()
    for page in sys.argv[1:]:
        pg=b.new_page(viewport={'width':1366,'height':800});errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('http://localhost:8765/'+page);pg.wait_for_timeout(800)
        pg.evaluate("try{localStorage.clear()}catch(e){}");pg.reload();pg.wait_for_timeout(800)
        cards,probs=run(pg,page)
        pg.set_viewport_size({'width':380,'height':800});pg.wait_for_timeout(300)
        pg.evaluate("document.querySelectorAll('.panel').forEach(p=>p.hidden=false);document.querySelectorAll('.calc-working').forEach(w=>w.hidden=false)")
        sw=pg.evaluate('document.documentElement.scrollWidth')
        print('==',page,'cards',len(cards),'with New problems',sum(c['np'] for c in cards),'questions',sum(c['n'] for c in cards),'errors',errs[:3],'scrollW380',sw)
        seen=set()
        for pr in probs:
            k=(pr[0],pr[2],pr[4])
            if k in seen: continue
            seen.add(k);print('  ',pr)
        pg.close()
    b.close()
