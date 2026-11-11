(function(){
'use strict';
/* ================= helpers ================= */
const $=(s,r)=>(r||document).querySelector(s);
const $$=(s,r)=>Array.from((r||document).querySelectorAll(s));
const mk=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;};
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
// Write a fraction as [[top|bottom]] in any text that goes through FR(); it is drawn stacked.
const FR=t=>String(t).replace(/(\d) (?=\d{3}\b)/g,'$1\u00a0').replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g,'<span class="frac"><span>$1</span><span>$2</span></span>');
const fmt=(n,dp)=>{const t=Number(n).toLocaleString('en-GB',{maximumFractionDigits:dp==null?2:dp});return Math.abs(n)<10000?t.replace(/,/g,''):t.replace(/,/g,'\u2009');};
const REDUCED=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
const numClose=(v,a)=>Math.abs(v-a)<=(a===0?0.05:Math.abs(a)*0.02);
const css=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const raf=f=>requestAnimationFrame(f);

const STORE_KEY='{{STORE_KEY}}',OLD_STORE_KEY='{{OLD_STORE_KEY}}';
// Core route (page.json "core"): {tab: [activity titles]}. Other activities on a core tab go under "Extra practice"; other tabs are extra tabs. null = no core route.
const CORE={{CORE}};
const TAB_IDS={{TAB_IDS}};
let activeTab='{{FIRST_TAB}}';
const reflowers=[];
const tickers=[];
function addTicker(tab,fn){tickers.push({tab,fn});}
function loop(t){if(!document.hidden){for(const k of tickers){if(k.tab===activeTab){try{k.fn(t);}catch(e){console.error(e);}}}}raf(loop);}

function act(panel,kind,title,intro){
  const a=mk('article','act');a.dataset.title=title;
  a.innerHTML='<h3 class="act-title"><span class="kind">'+kind+'</span><span>'+FR(title)+'</span></h3>'+(intro?'<p class="act-intro">'+FR(intro)+'</p>':'');
  const body=mk('div','act-body');a.appendChild(body);
  $('#panel-'+panel+' .acts').appendChild(a);
  return body;
}
function bar(parent,buttons){
  const b=mk('div','bar');
  buttons.forEach(x=>{const btn=mk('button','btn'+(x.primary?' primary':''),x.label);btn.type='button';btn.addEventListener('click',x.fn);b.appendChild(btn);});
  const msg=mk('span','fb');msg.setAttribute('aria-live','polite');b.appendChild(msg);
  parent.appendChild(b);
  return {el:b,msg:msg,say:(t,cls)=>{msg.textContent=t;msg.className='fb'+(cls?' '+cls:'');}};
}
// Show answer (Alex, 4 Nov 2026): appears after a Check with a wrong answer. It fills in and locks the right
// answers, marked as shown (dashed) rather than correct, so a stuck student can see them and move on.
// a shown number: plain, or 4.42×10^-19 for very big or small answers (the answer box accepts both)
const shownVal=a=>{const v=Number(a),t=String(a);if(!/e/i.test(t)&&!(v!==0&&(Math.abs(v)>=1e7||Math.abs(v)<1e-3)))return t;const p=v.toPrecision(3).split('e');return p.length<2?t:p[0]+'×10^'+(+p[1]);};
const SHOWN_MSG='Answers shown (dashed). Read them through, then start again to try it on your own.';
function answerBtn(b,fn){
  const btn=mk('button','btn btn-show','Show answer');btn.type='button';btn.hidden=true;
  btn.addEventListener('click',()=>{btn.hidden=true;fn();});
  b.el.insertBefore(btn,b.msg);
  return {on:()=>{btn.hidden=false;},off:()=>{btn.hidden=true;}};
}

/* ================= saved answers and tab progress =================
   Every graded activity registers with track() and gives getState / setState / isDone.
   Answers are kept in this browser only (localStorage, every call in try/catch), so a reload keeps them.
   A tab gets a tick once all its graded activities are complete, and the header shows how many tabs are done. */
const games=[];
function track(host,g){
  const p=host&&host.closest('.panel');
  g.host=host;g.tab=p?p.id.slice(6):'';
  g.key=g.tab+'-'+games.filter(x=>x.tab===g.tab).length;
  games.push(g);return g;
}
let saveTimer=null,saveReady=false;
function writeSave(){
  if(!saveReady)return;
  const v={};games.forEach(g=>{try{v[g.key]=g.getState();}catch(e){}});
  try{localStorage.setItem(STORE_KEY,JSON.stringify({tab:activeTab,v:v}));}catch(e){}
}
// Saves wait a second, so wrong answers have bounced back to the pool first.
function saveSoon(){if(!saveReady)return;clearTimeout(saveTimer);saveTimer=setTimeout(writeSave,1000);raf(()=>showProgress(true));}
// An activity hidden inside its tab (e.g. one for a method type that is not chosen) does not count.
function shown(g){let e=g.host;while(e&&!(e.classList&&e.classList.contains('panel'))){if(e.hidden)return false;e=e.parentElement;}return true;}
// On a core tab only the core activities count; Extra practice never stops the tick.
function counts(g){return shown(g)&&!(CORE&&CORE[g.tab]&&g.host.closest('.extra-block'));}
function tabDone(t){const gs=games.filter(g=>g.tab===t&&counts(g));return gs.length>0&&gs.every(g=>{try{return g.isDone();}catch(e){return false;}});}
function showProgress(animate){
  const withGames=TAB_IDS.filter(t=>games.some(g=>g.tab===t));
  const graded=CORE?withGames.filter(t=>CORE[t]):withGames;
  let n=0;
  withGames.forEach(t=>{
    const d=tabDone(t),btn=document.getElementById('tab-'+t);if(d&&graded.indexOf(t)>=0)n++;
    if(!btn)return;
    let tk=btn.querySelector('.tab-tick');
    if(d&&!tk){tk=mk('span','tab-tick','<span aria-hidden="true">✓</span><span class="sr-only"> (done)</span>');btn.appendChild(tk);if(animate)tk.classList.add('pop-in');}
    if(!d&&tk)tk.remove();
    btn.classList.toggle('is-done',d);
  });
  let pill=document.getElementById('tabs-done');
  if(!pill){const eb=$('.page-head .eyebrow');if(!eb||!graded.length)return;pill=mk('span','tabs-done');pill.id='tabs-done';pill.setAttribute('aria-live','polite');eb.parentNode.appendChild(pill);}
  const txt=(CORE?'Core route: ':'')+n+' of '+graded.length+' tabs done';
  if(pill.textContent!==txt){
    const up=n>(+pill.dataset.n||0);pill.textContent=txt;pill.dataset.n=n;
    if(animate&&up){pill.classList.remove('pulse');void pill.offsetWidth;pill.classList.add('pulse');}
  }
  pill.classList.toggle('all-done',n===graded.length);
}
['click','input','pointerup'].forEach(t=>document.addEventListener(t,saveSoon));
window.addEventListener('pagehide',()=>{clearTimeout(saveTimer);writeSave();});

/* keyboard helpers: remember what had focus, find it again after a re-render */
function focusKey(){
  const a=document.activeElement;if(!a||a===document.body)return null;
  const d=a.dataset||{};
  if(d.chip)return '[data-chip="'+d.chip+'"]';
  if(d.slotId)return '[data-slot-id="'+d.slotId+'"]';
  if(d.item)return '[data-item="'+d.item+'"]';
  if(d.side)return '.match-card[data-side="'+d.side+'"][data-id="'+d.id+'"]';
  if(a.classList.contains('bin'))return '.bin[data-cat="'+a.dataset.cat+'"]';
  return null;
}
function refocus(root,k){if(!k||!root)return;const e=root.querySelector(k);if(e&&e!==document.activeElement)e.focus({preventScroll:true});}
function keyActivate(el,fn,label){
  el.tabIndex=0;el.setAttribute('role','button');if(label)el.setAttribute('aria-label',label);
  el.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target===el){e.preventDefault();fn(e);}});
}
function celebrate(el){if(!el)return;el.classList.remove('celebrate');void el.offsetWidth;el.classList.add('celebrate');}

/* ================= drag engine (pointer events, mouse + touch) ================= */
function hitEl(ev,selector){
  const t=document.elementFromPoint(ev.clientX,ev.clientY);
  return t?t.closest(selector):null;
}
function makeDraggable(node,o){
  o=o||{};
  node.style.touchAction='none';
  if(o.onClick){
    if(!node.hasAttribute('tabindex'))node.tabIndex=0;
    if(node.tagName!=='BUTTON'&&!node.getAttribute('role'))node.setAttribute('role','button');
    node.addEventListener('keydown',function(e){
      if((e.key==='Enter'||e.key===' ')&&e.target===node&&(!o.enabled||o.enabled())){e.preventDefault();e.stopPropagation();o.onClick(e);}
    });
  }
  node.addEventListener('pointerdown',function(e){
    if(e.button!==undefined&&e.button!==0)return;
    if(o.enabled&&!o.enabled())return;
    const sx=e.clientX,sy=e.clientY,id=e.pointerId,r=node.getBoundingClientRect();
    let dragging=false,g=null;
    const move=function(ev){
      if(ev.pointerId!==id)return;
      if(!dragging&&Math.hypot(ev.clientX-sx,ev.clientY-sy)>6){
        dragging=true;
        g=node.cloneNode(true);g.removeAttribute('id');g.classList.remove('is-dragging');g.classList.add('drag-ghost');
        g.style.width=r.width+'px';g.style.left=r.left+'px';g.style.top=r.top+'px';
        document.body.appendChild(g);node.classList.add('is-dragging');
        if(o.onStart)o.onStart(ev);
      }
      if(dragging){g.style.transform='translate('+(ev.clientX-sx)+'px,'+(ev.clientY-sy)+'px)';if(o.onMove)o.onMove(ev);ev.preventDefault();}
    };
    const up=function(ev){
      if(ev.pointerId!==id)return;
      document.removeEventListener('pointermove',move);document.removeEventListener('pointerup',up);document.removeEventListener('pointercancel',up);
      if(g)g.remove();
      node.classList.remove('is-dragging');
      if(dragging){if(o.onEnd)o.onEnd(ev,ev.type==='pointercancel');}
      else if(ev.type==='pointerup'&&o.onClick){o.onClick(ev);}
    };
    document.addEventListener('pointermove',move,{passive:false});
    document.addEventListener('pointerup',up);document.addEventListener('pointercancel',up);
  });
}

/* ================= blank / slot game (cloze, units table, graph labels) ================= */
function createBlankGame(cfg){
  const slots=cfg.slots,pool=cfg.pool,chipMap={},slotMap={};
  cfg.chips.forEach(c=>chipMap[c.id]=c);
  slots.forEach(s=>slotMap[s.id]=s);
  let order=shuffle(cfg.chips.map(c=>c.id));
  let placed={},locked={},shown={},selected=null;
  slots.forEach(s=>{
    s.el.dataset.slotId=s.id;s.el.classList.add('slot','is-empty');
    s.el.addEventListener('click',function(e){
      if(e.target.closest('.chip'))return;
      if(selected&&!locked[s.id])place(selected,s.id);
    });
    keyActivate(s.el,function(){
      if(locked[s.id])return;
      if(selected)place(selected,s.id);else if(placed[s.id])unplace(s.id);
    },s.label||'Gap');
  });
  function say(t,c){if(cfg.msg)cfg.msg.say(t,c);}
  // fill:true (Alex, 5 Nov 2026): every fill-in-the-blanks passage has Check answers, Shuffle again and Fill in.
  // Fill in is always there (in place of the Show answer button that only appears after a wrong Check).
  const ans=cfg.msg&&cfg.msg.el&&!cfg.fill?answerBtn(cfg.msg,showAll):{on(){},off(){}};
  if(cfg.fill&&cfg.msg&&cfg.msg.el){const fb=mk('button','btn','Fill in');fb.type='button';fb.addEventListener('click',showAll);const bs=cfg.msg.el.querySelectorAll('.btn');if(bs.length)bs[bs.length-1].after(fb);else cfg.msg.el.insertBefore(fb,cfg.msg.msg);}
  function showAll(){
    slots.forEach(s=>{
      if(locked[s.id])return;
      const used=new Set(Object.keys(placed).filter(k=>locked[k]).map(k=>placed[k]));
      const c=cfg.chips.find(c=>cfg.isCorrect(c,s)&&(cfg.palette||!used.has(c.id)))||cfg.chips.find(c=>cfg.isCorrect(c,s));
      if(!c)return;
      if(!cfg.palette)Object.keys(placed).forEach(k=>{if(!locked[k]&&placed[k]===c.id)delete placed[k];});
      placed[s.id]=c.id;locked[s.id]=true;shown[s.id]=true;
    });
    render();say(SHOWN_MSG,'');
  }
  function chipEl(c,inSlot){
    const e=mk('span','chip'+(inSlot?' is-placed':''));
    e.innerHTML=inSlot&&cfg.slotText?cfg.slotText(c):c.text;
    if(inSlot&&cfg.placedClass)e.classList.add(cfg.placedClass);
    e.dataset.chip=c.id;return e;
  }
  // palette: chips stay in the bank and are copied into gaps, so one chip can fill several gaps
  function place(chipId,slotId){
    if(!cfg.palette)Object.keys(placed).forEach(k=>{if(placed[k]===chipId)delete placed[k];});
    placed[slotId]=chipId;selected=null;render();
  }
  function unplace(slotId){if(!locked[slotId]){delete placed[slotId];render();}}
  function slotAt(ev){
    const t=hitEl(ev,'.slot');
    if(t&&slotMap[t.dataset.slotId]&&slotMap[t.dataset.slotId].el===t)return slotMap[t.dataset.slotId];
    return null;
  }
  let fresh={};
  const root=pool.closest('.act')||document;
  function render(){
    const fk=focusKey();
    pool.innerHTML='';
    const used=new Set(Object.keys(placed).map(k=>placed[k]));
    order.filter(id=>cfg.palette||!used.has(id)).forEach(id=>{
      const e=chipEl(chipMap[id],false);
      if(selected===id)e.classList.add('is-selected');
      pool.appendChild(e);
      makeDraggable(e,{
        onEnd:function(ev){const s=slotAt(ev);if(s&&!locked[s.id])place(id,s.id);else render();},
        onClick:function(){selected=selected===id?null:id;render();}
      });
    });
    slots.forEach(s=>{
      const old=s.el.querySelector('.chip');if(old)old.remove();
      s.el.classList.toggle('is-empty',!placed[s.id]);
      s.el.classList.toggle('is-correct',!!locked[s.id]);
      s.el.classList.toggle('is-shown',!!shown[s.id]);
      s.el.classList.toggle('pop',!!fresh[s.id]);
      s.el.classList.remove('is-wrong');
      if(placed[s.id]){
        const e=chipEl(chipMap[placed[s.id]],true);s.el.appendChild(e);
        if(!locked[s.id]){
          makeDraggable(e,{
            onEnd:function(ev){
              const t=slotAt(ev),cid=placed[s.id];
              if(t&&t.id!==s.id&&!locked[t.id]){delete placed[s.id];place(cid,t.id);}
              else{delete placed[s.id];render();}
            },
            onClick:function(){unplace(s.id);}
          });
        }
      }
    });
    if(cfg.score)cfg.score.textContent=Object.keys(locked).length+' / '+slots.length+' correct';
    if(cfg.onRender)cfg.onRender();
    fresh={};refocus(root,fk);
  }
  function check(){
    const wrong=[];let empty=0,newRight=0;
    slots.forEach(s=>{
      if(locked[s.id])return;
      const cid=placed[s.id];
      if(!cid){empty++;return;}
      if(cfg.isCorrect(chipMap[cid],s)){locked[s.id]=true;fresh[s.id]=true;newRight++;}else wrong.push(s.id);
    });
    render();
    wrong.forEach(id=>{slotMap[id].el.classList.add('is-wrong');});
    const done=Object.keys(locked).length;
    if(wrong.length)ans.on();
    if(done===slots.length){ans.off();say('All '+slots.length+' correct. Well done.','good');celebrate(cfg.score);}
    else if(wrong.length)say(wrong.length+' in the wrong place. They will pop back so you can try again.'+(empty?' '+empty+' still empty.':''),'bad');
    else say(empty+' still to fill.','');
    if(wrong.length)setTimeout(()=>{wrong.forEach(id=>{if(!locked[id])delete placed[id];});render();},850);
  }
  function reset(){placed={};locked={};shown={};selected=null;ans.off();order=shuffle(cfg.chips.map(c=>c.id));say('','');render();}
  render();
  return track(pool,{check:check,reset:reset,render:render,showAll:()=>{showAll();ans.off();},
    getState:()=>({o:order,p:placed,l:Object.keys(locked)}),
    setState:s=>{
      if(Array.isArray(s.o)&&s.o.length===order.length&&s.o.every(id=>chipMap[id]))order=s.o.slice();
      placed={};locked={};shown={};selected=null;ans.off();
      Object.keys(s.p||{}).forEach(k=>{if(slotMap[k]&&chipMap[s.p[k]])placed[k]=s.p[k];});
      (s.l||[]).forEach(k=>{if(placed[k]&&cfg.isCorrect(chipMap[placed[k]],slotMap[k]))locked[k]=true;});
      render();
      if(Object.keys(locked).length===slots.length)say('All '+slots.length+' correct. Well done.','good');
    },
    isDone:()=>Object.keys(locked).length===slots.length});
}

/* ================= sort into bins ================= */
function createSortGame(cfg){
  const host=cfg.host,items=cfg.items,cats=cfg.cats,itemMap={};
  items.forEach(i=>itemMap[i.id]=i);
  const binsEl=mk('div','bins bins-'+cats.length);
  const poolLabel=mk('div','pool-label','Cards to sort');
  const poolEl=mk('div','sort-pool');
  host.appendChild(binsEl);host.appendChild(poolLabel);host.appendChild(poolEl);
  let where={},locked={},shown={},selected=null,order;
  const b=bar(host,[{label:'Check',primary:true,fn:check},{label:'Shuffle again',fn:reset}]);
  const score=mk('span','score');b.el.insertBefore(score,b.msg);
  const ans=answerBtn(b,()=>{items.forEach(i=>{if(!locked[i.id]){where[i.id]=i.cat;locked[i.id]=true;shown[i.id]=true;}});render();b.say(SHOWN_MSG,'');});
  let fresh={};
  function itemEl(i){const e=mk('div','sort-item',i.text);e.dataset.item=i.id;if(locked[i.id])e.classList.add('is-correct');if(shown[i.id])e.classList.add('is-shown');if(fresh[i.id])e.classList.add('pop');return e;}
  function drop(id,ev){
    const bin=hitEl(ev,'.bin');
    if(bin&&binsEl.contains(bin))where[id]=bin.dataset.cat;
    else if(hitEl(ev,'.sort-pool')===poolEl)where[id]='pool';
    selected=null;render();
  }
  function render(){
    const fk=focusKey();
    binsEl.innerHTML='';
    cats.forEach(c=>{
      const bin=mk('div','bin');bin.dataset.cat=c.id;
      bin.style.setProperty('--cat','var('+c.color+')');bin.style.setProperty('--cat-soft','var('+c.soft+')');
      bin.innerHTML='<div class="bin-head"><strong>'+c.label+'</strong>'+(c.hint?'<span>'+c.hint+'</span>':'')+'</div>';
      const body=mk('div','bin-body');bin.appendChild(body);
      order.filter(id=>where[id]===c.id).forEach(id=>{
        const e=itemEl(itemMap[id]);body.appendChild(e);
        if(!locked[id])makeDraggable(e,{onEnd:ev=>drop(id,ev),onClick:()=>{where[id]='pool';render();}});
      });
      bin.addEventListener('click',ev=>{if(selected&&!ev.target.closest('.sort-item')){where[selected]=c.id;selected=null;render();}});
      keyActivate(bin,()=>{if(selected){where[selected]=c.id;selected=null;render();}},c.label+' bin');
      binsEl.appendChild(bin);
    });
    poolEl.innerHTML='';
    order.filter(id=>where[id]==='pool').forEach(id=>{
      const e=itemEl(itemMap[id]);if(selected===id)e.classList.add('is-selected');poolEl.appendChild(e);
      makeDraggable(e,{onEnd:ev=>drop(id,ev),onClick:()=>{selected=selected===id?null:id;render();}});
    });
    score.textContent=Object.keys(locked).length+' / '+items.length+' correct';
    fresh={};refocus(host,fk);
  }
  function check(){
    const wrong=[];let inPool=0;
    items.forEach(i=>{
      if(locked[i.id])return;
      if(where[i.id]==='pool'){inPool++;return;}
      if(where[i.id]===i.cat){locked[i.id]=true;fresh[i.id]=true;}else wrong.push(i.id);
    });
    render();
    wrong.forEach(id=>{const e=binsEl.querySelector('[data-item="'+id+'"]');if(e)e.classList.add('is-wrong');});
    if(wrong.length)ans.on();
    if(Object.keys(locked).length===items.length){ans.off();b.say('All correct. Well done.','good');celebrate(score);}
    else if(wrong.length)b.say(wrong.length+' in the wrong bin. They will go back to the pool.'+(inPool?' '+inPool+' not sorted yet.':''),'bad');
    else b.say(inPool+' cards still to sort.','');
    if(wrong.length)setTimeout(()=>{wrong.forEach(id=>{if(!locked[id])where[id]='pool';});render();},850);
  }
  function reset(){where={};locked={};shown={};selected=null;ans.off();items.forEach(i=>where[i.id]='pool');order=shuffle(items.map(i=>i.id));b.say('','');render();}
  reset();
  return track(host,{reset:reset,
    getState:()=>({o:order,w:where,l:Object.keys(locked)}),
    setState:s=>{
      if(Array.isArray(s.o)&&s.o.length===items.length&&s.o.every(id=>itemMap[id]))order=s.o.slice();
      where={};locked={};shown={};selected=null;ans.off();
      items.forEach(i=>{const w=s.w&&s.w[i.id];where[i.id]=cats.some(c=>c.id===w)?w:'pool';});
      (s.l||[]).forEach(id=>{if(itemMap[id]&&where[id]===itemMap[id].cat)locked[id]=true;});
      render();
      if(Object.keys(locked).length===items.length)b.say('All correct. Well done.','good');
    },
    isDone:()=>Object.keys(locked).length===items.length});
}

/* ================= match (lines between two columns) ================= */
function createMatchGame(cfg){
  const host=cfg.host,pairs=cfg.pairs;
  const grid=mk('div','match-grid'+(cfg.narrowLeft?' narrow-left':''));
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('class','match-lines');
  const colL=mk('div','match-col'),colR=mk('div','match-col');
  grid.appendChild(svg);grid.appendChild(colL);grid.appendChild(colR);host.appendChild(grid);
  let L,R,link,locked,sel,wrongSet={},fresh={},shown={};
  const b=bar(host,[{label:'Check matches',primary:true,fn:check},{label:'Shuffle again',fn:reset}]);
  const score=mk('span','score');b.el.insertBefore(score,b.msg);
  const ans=answerBtn(b,()=>{
    pairs.forEach(p=>{if(locked[p.id])return;Object.keys(link).forEach(k=>{if(k!==p.id&&link[k]===p.id)delete link[k];});link[p.id]=p.id;locked[p.id]=true;shown[p.id]=true;});
    wrongSet={};render();b.say(SHOWN_MSG,'');
  });
  function card(side,id){
    const p=pairs.find(x=>x.id===id);
    const e=mk('div','match-card',side==='L'?p.l:p.r);e.dataset.side=side;e.dataset.id=id;
    const linked=side==='L'?link[id]!==undefined:Object.values(link).indexOf(id)>=0;
    if(linked)e.classList.add('is-linked');
    const lid=side==='L'?id:Object.keys(link).find(k=>link[k]===id);
    if(lid!==undefined&&locked[lid]){e.classList.remove('is-linked');e.classList.add('is-correct');if(shown[lid])e.classList.add('is-shown');if(fresh[lid])e.classList.add('pop');}
    if(lid!==undefined&&wrongSet[lid])e.classList.add('is-wrong');
    if(sel&&sel.side===side&&sel.id===id)e.classList.add('is-selected');
    if(!(lid!==undefined&&locked[lid])){
      makeDraggable(e,{
        onEnd:function(ev){const t=hitEl(ev,'.match-card');if(t&&grid.contains(t)&&t.dataset.side!==side)pairUp(side,id,t.dataset.side,t.dataset.id);render();},
        onClick:function(){
          if(linked){unlink(side,id);sel=null;render();return;}
          if(sel&&sel.side!==side){pairUp(sel.side,sel.id,side,id);sel=null;}
          else sel=(sel&&sel.side===side&&sel.id===id)?null:{side:side,id:id};
          render();
        }
      });
    }
    return e;
  }
  function pairUp(s1,i1,s2,i2){
    const l=s1==='L'?i1:i2,r=s1==='L'?i2:i1;
    Object.keys(link).forEach(k=>{if(k===l||link[k]===r)delete link[k];});
    link[l]=r;sel=null;
  }
  function unlink(side,id){
    Object.keys(link).forEach(k=>{if((side==='L'&&k===id)||(side==='R'&&link[k]===id))delete link[k];});
  }
  function render(){
    const fk=focusKey();
    colL.innerHTML='<h4>'+cfg.leftTitle+'</h4>';colR.innerHTML='<h4>'+cfg.rightTitle+'</h4>';
    L.forEach(id=>colL.appendChild(card('L',id)));R.forEach(id=>colR.appendChild(card('R',id)));
    score.textContent=Object.keys(locked).length+' / '+pairs.length+' matched';
    fresh={};refocus(grid,fk);
    raf(reflow);
  }
  function reflow(){
    if(!grid.offsetParent)return;
    const cards=$$('.match-card',grid);
    cards.forEach(c=>c.style.minHeight='');
    let mx=0;cards.forEach(c=>{mx=Math.max(mx,c.getBoundingClientRect().height);});
    cards.forEach(c=>c.style.minHeight=Math.ceil(mx)+'px');
    const gr=grid.getBoundingClientRect();
    svg.setAttribute('viewBox','0 0 '+gr.width+' '+gr.height);
    svg.innerHTML='';
    Object.keys(link).forEach(l=>{
      const a=$('.match-card[data-side="L"][data-id="'+l+'"]',grid),c=$('.match-card[data-side="R"][data-id="'+link[l]+'"]',grid);
      if(!a||!c)return;
      const ra=a.getBoundingClientRect(),rc=c.getBoundingClientRect();
      const ln=document.createElementNS('http://www.w3.org/2000/svg','line');
      ln.setAttribute('x1',ra.right-gr.left);ln.setAttribute('y1',ra.top-gr.top+ra.height/2);
      ln.setAttribute('x2',rc.left-gr.left);ln.setAttribute('y2',rc.top-gr.top+rc.height/2);
      if(locked[l])ln.setAttribute('class','ok');else if(wrongSet[l])ln.setAttribute('class','no');
      svg.appendChild(ln);
    });
  }
  function check(){
    const wrong=[];let unpaired=0;
    pairs.forEach(p=>{if(locked[p.id])return;if(link[p.id]===undefined){unpaired++;return;}if(link[p.id]===p.id){locked[p.id]=true;fresh[p.id]=true;}else wrong.push(p.id);});
    wrongSet={};wrong.forEach(id=>wrongSet[id]=true);
    render();
    if(wrong.length)ans.on();
    if(Object.keys(locked).length===pairs.length){ans.off();b.say('All pairs correct. Well done.','good');celebrate(score);}
    else if(wrong.length)b.say(wrong.length+' pair'+(wrong.length>1?'s are':' is')+' wrong. They will come apart so you can try again.'+(unpaired?' '+unpaired+' not paired yet.':''),'bad');
    else b.say(unpaired+' still to pair.','');
    if(wrong.length)setTimeout(()=>{wrong.forEach(id=>{if(!locked[id])delete link[id];});wrongSet={};render();},900);
  }
  function reset(){L=shuffle(pairs.map(p=>p.id));R=shuffle(pairs.map(p=>p.id));link={};locked={};shown={};sel=null;wrongSet={};ans.off();b.say('','');render();}
  window.addEventListener('resize',()=>raf(reflow));
  reset();
  const ok=a=>Array.isArray(a)&&a.length===pairs.length&&pairs.every(p=>a.indexOf(p.id)>=0);
  return track(host,{reflow:reflow,reset:reset,
    getState:()=>({L:L,R:R,k:link,l:Object.keys(locked)}),
    setState:s=>{
      if(ok(s.L))L=s.L.slice();if(ok(s.R))R=s.R.slice();
      link={};locked={};shown={};sel=null;wrongSet={};ans.off();
      const used={};
      Object.keys(s.k||{}).forEach(l=>{const r=s.k[l];if(pairs.some(p=>p.id===l)&&pairs.some(p=>p.id===r)&&!used[r]){link[l]=r;used[r]=1;}});
      (s.l||[]).forEach(id=>{if(link[id]===id)locked[id]=true;});
      render();
      if(Object.keys(locked).length===pairs.length)b.say('All pairs correct. Well done.','good');
    },
    isDone:()=>Object.keys(locked).length===pairs.length});
}

/* ================= flip-card memory ================= */
function createMemoryGame(cfg){
  const host=cfg.host,pairs=cfg.pairs;
  const grid=mk('div','mem-grid');host.appendChild(grid);
  const b=bar(host,[{label:'Shuffle again',fn:reset}]);
  const counter=mk('span','score');b.el.insertBefore(counter,b.msg);
  let cards,first,busy,flips,matched;
  function reset(){
    const deck=[];pairs.forEach(p=>{deck.push({key:p.id,text:p.a,kind:'a'});deck.push({key:p.id,text:p.b,kind:'b'});});
    cards=shuffle(deck);first=null;busy=false;flips=0;matched=0;b.say('','');
    grid.innerHTML='';
    cards.forEach((c,i)=>{
      const btn=mk('button','mem-card');btn.type='button';btn.setAttribute('aria-label','Card '+(i+1));
      btn.innerHTML='<div class="mem-inner"><div class="mem-face mem-front" aria-hidden="true">?</div><div class="mem-face mem-back'+(c.kind==='a'?' is-term':'')+'">'+c.text+'</div></div>';
      btn.addEventListener('click',()=>flip(i,btn));
      btn.dataset.key=c.key;c.btn=btn;grid.appendChild(btn);
    });
    counter.textContent='Flips: 0';
  }
  function flip(i,btn){
    if(busy||btn.classList.contains('is-flipped')||btn.classList.contains('is-matched'))return;
    btn.classList.add('is-flipped');flips++;counter.textContent='Flips: '+flips;
    if(first===null){first=i;return;}
    const a=cards[first],c=cards[i];
    if(a.key===c.key&&a.kind!==c.kind){
      a.btn.classList.add('is-matched');c.btn.classList.add('is-matched');matched++;first=null;
      if(matched===pairs.length)b.say('All '+pairs.length+' pairs found in '+flips+' flips. The best possible is '+pairs.length*2+'.','good');
    }else{
      busy=true;const f=first;first=null;
      setTimeout(()=>{cards[f].btn.classList.remove('is-flipped');c.btn.classList.remove('is-flipped');busy=false;},800);
    }
  }
  reset();
  return {reset:reset};
}

/* ================= type-the-number ================= */
let calcN=0;
// Worked answers (Alex, 5 Nov 2026): a working written "givens||steps" shows the known values (s = …, u = …) down the
// left and the equation with every step on the right, each column lined up on its = signs, as students should lay out
// an exam answer (wide, not tall). The columns stack on phones. Without "||" the working is one column as before.
const calcCol=t=>'<div class="eqg">'+String(t).split(/<br\s*\/?>/i).map(l=>{const i=l.indexOf(' = ');return i<0?'<span class="eqg-full">'+l+'</span>':'<span class="eqg-l">'+l.slice(0,i)+'</span><span class="eqg-m">=</span><span class="eqg-r">'+l.slice(i+3)+'</span>';}).join('')+'</div>';
const calcWork=w=>{const t=FR(w),k=t.indexOf('||');return k<0?t:'<div class="cw-split"><div class="cw-given">'+calcCol(t.slice(0,k))+'</div><div class="cw-eq">'+calcCol(t.slice(k+2))+'</div></div>';};
// seeded random numbers for New problems: calcRnd(seed) gives a function returning 0 to 1; calcPick(rnd,list) picks one
const calcRnd=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
const calcPick=(rnd,arr)=>arr[Math.floor(rnd()*arr.length)];
function createCalc(cfg){
  const host=cfg.host,qs=cfg.questions,id='calc'+(++calcN);
  function hintLabel(row,q,clear){
    const h=q.hints||[],r=row.querySelector('.calc-hint-row'),ol=r.querySelector('.calc-hints'),bt=r.querySelector('.calc-hint-btn');
    if(clear)ol.innerHTML='';
    r.hidden=!h.length;const n=ol.children.length;
    bt.textContent=n>=h.length?'No more hints':(n?'Next hint':'Hint')+' ('+(n+1)+' of '+h.length+')';bt.disabled=n>=h.length;
  }
  const wrap=mk('div','calc-inputs');host.appendChild(wrap);
  qs.forEach((q,i)=>{
    const row=mk('div','calc-input-row');
    row.innerHTML='<div class="calc-input-label"><label for="'+id+'-'+i+'">'+q.q+'</label></div>'+
      '<div class="calc-input-wrap"><input class="calc-num-input" id="'+id+'-'+i+'" type="text" inputmode="'+(q.answer<0?'text':'decimal')+'" autocomplete="off" spellcheck="false"><span class="calc-input-unit">'+q.unit+'</span></div>'+
      '<div class="calc-fb" aria-live="polite"></div>'+
      '<div class="calc-hint-row" hidden><button type="button" class="btn calc-hint-btn"></button><ol class="calc-hints" aria-live="polite"></ol></div>'+
      '<div class="calc-show-row"><button type="button" class="btn btn-show calc-show" hidden>Show answer</button></div>'+
      '<div class="calc-working" hidden><div class="calc-working-head">Working</div><div class="cw">'+calcWork(q.working)+'</div></div>';
    wrap.appendChild(row);
    // Hints on demand (6 Nov 2026): a question with hints:[...] gets a Hint button that shows one more hint per press
    row.querySelector('.calc-hint-btn').addEventListener('click',()=>{
      const h=qs[i].hints||[],ol=row.querySelector('.calc-hints'),n=ol.children.length;
      if(n<h.length){const li=mk('li','',FR(h[n]));ol.appendChild(li);}
      hintLabel(row,qs[i]);
    });
    hintLabel(row,q);
    // Show answer: puts the answer in the box and opens the working for this question only
    const sb=row.querySelector('.calc-show');
    sb.addEventListener('click',()=>{
      const inp=row.querySelector('.calc-num-input'),fb=row.querySelector('.calc-fb');
      inp.value=shownVal(qs[i].answer);inp.disabled=true;inp.classList.remove('is-wrong');inp.classList.add('is-shown');
      row.querySelector('.cw').innerHTML=calcWork(qs[i].working);row.querySelector('.calc-working').hidden=false;sb.hidden=true;
      fb.textContent='Answer shown, with the working. Try the next one on your own.';fb.className='calc-fb';
    });
  });
  const b=bar(host,[{label:'Check answers',primary:true,fn:check},{label:'Clear',fn:reset}]);
  // New problems (Alex, 5 Nov 2026): a question with make: rnd=>{q,unit,answer,working} (or cfg.makers, one per question)
  // gets new versions from the "New problems" button. The first
  // set is always the fixed questions; the button makes a new set from a seed saved with the answers, so a reload
  // shows the same problems.
  const makers=cfg.makers||qs.map(q=>q.make),fixed=qs.map(q=>Object.assign({},q));let seed=0;
  const apply=s=>{
    seed=s;const rnd=calcRnd(s||1);
    qs.forEach((q,i)=>{
      const m=makers[i];
      Object.assign(q,{hint:undefined,hints:undefined},s&&m?m(rnd):fixed[i]);
      const row=wrap.children[i],inp=row.querySelector('.calc-num-input');hintLabel(row,q,true);
      row.querySelector('label').innerHTML=q.q;row.querySelector('.calc-input-unit').textContent=q.unit;
      row.querySelector('.cw').innerHTML=calcWork(q.working);inp.inputMode=q.answer<0?'text':'decimal';
    });
  };
  if(makers.some(Boolean)){
    const nb=mk('button','btn','New problems');nb.type='button';b.el.insertBefore(nb,b.msg);
    nb.addEventListener('click',()=>{apply(1+Math.floor(Math.random()*2147483646));reset();b.say('New problems: same skills, new questions.','');});
  }
  function check(){
    let ok=0,blank=0,bad=0;
    qs.forEach((q,i)=>{
      const inp=$('#'+id+'-'+i),fb=inp.closest('.calc-input-row').querySelector('.calc-fb');
      if(inp.disabled){ok++;return;}
      const raw=inp.value.trim();
      if(raw===''){blank++;fb.textContent='';fb.className='calc-fb';return;}
      const clean=raw.replace(/[\u2212\u2013]/g,'-').replace(/[\s,\u2009]/g,'').replace(/[\u00D7x]10\^?(-?\d+)/i,'e$1');
      const v=/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(clean)?parseFloat(clean):NaN;
      if(isFinite(v)&&numClose(v,q.answer)){inp.disabled=true;inp.classList.add('pop');inp.classList.remove('is-wrong');fb.textContent='Correct.';fb.className='calc-fb good';ok++;}
      else{bad++;inp.classList.add('is-wrong');inp.closest('.calc-input-row').querySelector('.calc-show').hidden=false;fb.textContent=q.hint||'Not quite. Check the rearrangement and the units, then try again.';fb.className='calc-fb bad';}
    });
    if(ok===qs.length){b.say('All '+qs.length+' correct.','good');celebrate(b.msg);}
    else b.say(ok+' of '+qs.length+' correct'+(blank?', '+blank+' left blank':'')+'.',bad?'bad':'');
  }
  function reset(){
    qs.forEach((q,i)=>{const inp=$('#'+id+'-'+i);inp.value='';inp.disabled=false;inp.classList.remove('is-wrong','is-shown');const row=inp.closest('.calc-input-row'),fb=row.querySelector('.calc-fb');fb.textContent='';fb.className='calc-fb';row.querySelector('.calc-working').hidden=true;row.querySelector('.calc-show').hidden=true;hintLabel(row,q,true);});
    b.say('','');
  }
  const inp=i=>document.getElementById(id+'-'+i);
  return track(host,{reset:reset,
    getState:()=>({v:qs.map((q,i)=>inp(i).value),ok:qs.map((q,i)=>inp(i).disabled),seed:seed}),
    setState:s=>{
      if(makers.some(Boolean))apply((s&&s.seed)||0);
      reset();
      qs.forEach((q,i)=>{
        const e=inp(i),v=s.v&&s.v[i];if(typeof v!=='string')return;
        e.value=v;
        if(s.ok&&s.ok[i]){e.disabled=true;const fb=e.closest('.calc-input-row').querySelector('.calc-fb');fb.textContent='Correct.';fb.className='calc-fb good';}
      });
      if(qs.every((q,i)=>inp(i).disabled))b.say('All '+qs.length+' correct.','good');
    },
    isDone:()=>qs.every((q,i)=>inp(i).disabled)});
}

/* ================= reorder (live reorder + up/down buttons) ================= */
function createReorder(cfg){
  const host=cfg.host,steps=cfg.steps,map={};
  steps.forEach(s=>map[s.id]=s);
  const list=mk('ol','reorder');host.appendChild(list);
  const b=bar(host,[{label:'Check order',primary:true,fn:check},{label:'Shuffle again',fn:reset}]);
  let order,rows={},done=false;
  const valid=o=>cfg.constraints.filter(c=>o.indexOf(c[0])<o.indexOf(c[1])).length;
  const ans=answerBtn(b,()=>{
    // a right order: the steps as written, with any step moved after the steps it must follow
    const left=steps.map(s=>s.id),out=[];
    while(left.length){const k=left.findIndex(id=>cfg.constraints.every(c=>c[1]!==id||out.indexOf(c[0])>=0));out.push(left.splice(k<0?0:k,1)[0]);}
    order=out;done=true;sync();Object.keys(rows).forEach(k=>rows[k].classList.add('is-correct','is-shown'));
    b.say('This is the right order (shown, dashed). '+(cfg.why||''),'');
  });
  function build(){
    list.innerHTML='';rows={};
    steps.forEach(s=>{
      const li=mk('li','reorder-row');li.dataset.id=s.id;
      li.innerHTML='<span class="reorder-pos"></span><span class="reorder-grip" aria-hidden="true">≡</span><span class="reorder-text">'+FR(s.text)+'</span><span class="mv"><button type="button" aria-label="Move up">▲</button><button type="button" aria-label="Move down">▼</button></span>';
      const btns=li.querySelectorAll('.mv button');
      btns[0].addEventListener('click',()=>move(s.id,-1));btns[1].addEventListener('click',()=>move(s.id,1));
      makeDraggable(li.querySelector('.reorder-grip'),{
        enabled:()=>!done,
        onMove:function(ev){
          const others=order.filter(x=>x!==s.id);
          const idx=others.filter(x=>{const r=rows[x].getBoundingClientRect();return r.top+r.height/2<ev.clientY;}).length;
          const next=others.slice();next.splice(idx,0,s.id);
          if(next.join()!==order.join()){order=next;sync();}
        },
        onEnd:function(){sync();}
      });
      // dim the whole row while its grip is dragged
      rows[s.id]=li;list.appendChild(li);
    });
    sync();
  }
  function sync(){order.forEach((id,i)=>{list.appendChild(rows[id]);rows[id].querySelector('.reorder-pos').textContent=i+1;});}
  function move(id,d){if(done)return;const i=order.indexOf(id),j=i+d;if(j<0||j>=order.length)return;order.splice(i,1);order.splice(j,0,id);sync();}
  function check(){
    if(done)return;
    const n=valid(order),t=cfg.constraints.length;
    if(n===t){done=true;Object.keys(rows).forEach(k=>rows[k].classList.add('is-correct','pop'));b.say('Correct order. '+(cfg.why||''),'good');}
    else{ans.on();b.say(n+' of '+t+' sequence checks passed. Think about what must happen before what, then try again.','bad');}
  }
  function reset(){
    done=false;ans.off();let o;
    do{o=shuffle(steps.map(s=>s.id));}while(valid(o)===cfg.constraints.length);
    order=o;b.say('','');build();
  }
  reset();
  return track(host,{reset:reset,
    getState:()=>({o:order,d:done}),
    setState:s=>{
      if(!(Array.isArray(s.o)&&s.o.length===steps.length&&s.o.every(id=>map[id])))return;
      order=s.o.slice();done=!!s.d&&valid(order)===cfg.constraints.length;b.say('','');build();
      if(done){Object.keys(rows).forEach(k=>rows[k].classList.add('is-correct'));b.say('Correct order. '+(cfg.why||''),'good');}
    },
    isDone:()=>done});
}

/* ================= predict then reveal ================= */
function barsHTML(rows){
  return '<div class="vbars">'+rows.map(r=>'<div class="vbar"><span>'+r.l+'</span><div class="vtrack"><div class="vfill" style="--w:'+Math.round(clamp(r.v,0.03,1)*100)+'%;--c:'+(r.c||'var(--accent)')+'">'+(r.t||'')+'</div></div></div>').join('')+'</div>';
}
function createPredict(cfg){
  const host=cfg.host;
  host.appendChild(mk('p','pred-q',cfg.q));
  if(cfg.pre)host.appendChild(mk('div','',cfg.pre));
  const opts=mk('div','pred-opts');host.appendChild(opts);
  const out=mk('div','pred-out');out.hidden=true;host.appendChild(out);
  const b=bar(host,[{label:'Try again',fn:reset}]);b.el.hidden=true;
  let order,tries=0,picks=[],final=false;
  function render(){
    opts.innerHTML='';
    order.forEach(i=>{
      const o=cfg.options[i];
      const btn=mk('button','pred-opt',FR(o.text));btn.type='button';
      btn.addEventListener('click',()=>choose(i));
      btn.dataset.i=i;opts.appendChild(btn);
    });
  }
  // A first wrong answer lights up only that option and explains why it is wrong; the student tries again.
  // The right answer is shown once they find it, or after a second wrong answer.
  function choose(i){
    if(final)return;
    const o=cfg.options[i];picks.push(i);
    if(!o.correct&&tries===0){
      tries++;
      const btn=$$('.pred-opt',opts).find(x=>+x.dataset.i===i);
      btn.disabled=true;btn.classList.add('is-chosen','is-wrong');
      out.innerHTML='<p><strong>Not quite.</strong> '+FR(o.why)+' Try another answer.</p>';
      out.hidden=false;out.classList.remove('go');
      return;
    }
    $$('.pred-opt',opts).forEach(btn=>{
      btn.disabled=true;const k=cfg.options[btn.dataset.i];
      if(k.correct){btn.classList.add('is-right');if(+btn.dataset.i===i)btn.classList.add('pop');}
      if(+btn.dataset.i===i){btn.classList.add('is-chosen');if(!k.correct)btn.classList.add('is-wrong');}
    });
    final=true;
    const right=cfg.options.find(x=>x.correct);
    out.innerHTML='<p><strong>'+(o.correct?'That is right.':'Not quite.')+'</strong> '+FR(o.correct?cfg.explain:o.why+' '+cfg.explain)+'</p>'+(cfg.reveal||'');
    out.hidden=false;out.classList.remove('go');b.el.hidden=false;
    raf(()=>raf(()=>out.classList.add('go')));
  }
  function reset(){picks=[];final=false;tries=0;order=shuffle(cfg.options.map((o,i)=>i));out.hidden=true;out.classList.remove('go');b.el.hidden=true;render();}
  reset();
  return track(host,{reset:reset,
    getState:()=>({o:order,p:picks}),
    setState:s=>{
      reset();
      if(Array.isArray(s.o)&&s.o.length===order.length&&cfg.options.every((x,i)=>s.o.indexOf(i)>=0)){order=s.o.slice();render();}
      (s.p||[]).forEach(i=>{if(cfg.options[i])choose(i);});
    },
    isDone:()=>final});
}

/* ================= spot the error ================= */
function createSpot(cfg){
  // cfg.lines: one step per line. cfg.wrong: index of the one wrong step (never the first line).
  // Steps after the wrong one are worked correctly from it, so only the mistake itself is wrong.
  // Write a fraction as [[top|bottom]]; it is drawn stacked, and read aloud as "top over bottom".
  const nb=t=>t.replace(/(\d) (?=\d{3}\b)/g,'$1 ');   // keep "15 000" on one line
  const html=FR;
  const said=t=>t.replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g,'($1) over ($2)');
  cfg.host.classList.add('err-grid');
  let picks=[],found=false;
  const blk=mk('div','err-block');cfg.host.appendChild(blk);
  blk.appendChild(mk('p','err-scn',nb(cfg.scenario)));
  const btns=cfg.lines.map((t,i)=>{
    const btn=mk('button','err-line','<span class="err-num" aria-hidden="true">'+(i+1)+'</span><span aria-hidden="true">'+html(t)+'</span>');
    btn.type='button';btn.setAttribute('aria-label','Line '+(i+1)+': '+said(t));
    btn.addEventListener('click',()=>pick(i,btn));
    blk.appendChild(btn);return btn;
  });
  const fb=mk('p','err-fb');fb.setAttribute('aria-live','polite');blk.appendChild(fb);
  const reset=()=>{btns.forEach(x=>{x.disabled=false;x.classList.remove('is-ok','is-bad','shake');});fb.textContent='Click the line that contains the mistake.';picks=[];found=false;};
  function pick(i,btn){
    if(found)return;
    picks.push(i);
    if(i===cfg.wrong){
      found=true;
      btn.classList.add('is-bad');btns.forEach(x=>x.disabled=true);
      fb.innerHTML='<strong style="color:var(--bad)">Found it: line '+(i+1)+'.</strong> '+html(cfg.explain)+
        '<span class="err-fix" style="display:block">'+cfg.fix.map(f=>'<span class="fix-line">'+html(f)+'</span>').join('')+'</span>';
    }else{
      btn.classList.add('is-ok');
      fb.innerHTML='<strong style="color:var(--good)">Line '+(i+1)+' is fine.</strong> '+
        (i>cfg.wrong?'It is worked correctly from the line above. The mistake is earlier.':'Keep looking.');
    }
  }
  bar(blk,[{label:'Try Again',fn:reset}]);
  reset();
  return track(cfg.host,{reset:reset,
    getState:()=>({p:picks}),
    setState:s=>{reset();(s.p||[]).forEach(i=>{if(btns[i])pick(i,btns[i]);});},
    isDone:()=>found});
}

/* ================= crossword ================= */
// cfg.words: [{a:'ANSWER', clue:'…', r:row, c:col, d:'a'|'d'}], positions from tools/crossword/layout.js.
// Type into the grid; Check locks the right letters and clears the wrong ones after a moment.
let xwN=0;
function createCrossword(cfg){
  if(!document.getElementById('xw-css')){
    const st=document.createElement('style');st.id='xw-css';
    st.textContent='.xw{display:grid;grid-template-columns:auto minmax(0,1fr);gap:22px;align-items:start}'+
    '@media (max-width:860px){.xw{grid-template-columns:minmax(0,1fr)}}'+
    '.xw-scroll{max-width:100%;overflow-x:auto;padding:2px}'+
    // phones: squares stay at least 24px, and the grid scrolls sideways inside its own box
    '.xw-grid{display:grid;grid-template-columns:repeat(var(--xw-c),1fr);gap:2px;width:calc(var(--xw-c) * 37px);max-width:100%;min-width:calc(var(--xw-c) * 24px);user-select:none}'+
    '.xw-cell{position:relative;aspect-ratio:1}'+
    '.xw-cell input{display:block;width:100%;height:100%;margin:0;padding:0;border:1.5px solid var(--ink-faint);border-radius:3px;background:var(--panel);color:var(--ink);text-align:center;text-transform:none;font:600 clamp(13px,2.2vw,19px)/1 var(--f-mono);caret-color:transparent;cursor:pointer}'+
    '.xw-cell input:focus{outline:none}'+
    '.xw-cell.is-word input{background:var(--accent-soft)}'+
    '.xw-cell input:focus-visible,.xw-cell.is-cur input{border-color:var(--accent);box-shadow:inset 0 0 0 2px var(--accent)}'+
    '.xw-cell.is-ok input{background:var(--good-soft);border-color:var(--good);color:var(--good)}'+
    '.xw-cell.is-wrong input{background:var(--bad-soft);border-color:var(--bad)}'+
    '.xw-now{grid-column:1/-1;min-height:44px;margin:0;padding:8px 12px;border-radius:6px;background:var(--accent-soft);font-size:14px;line-height:1.4}'+
    '.xw-now b{font-family:var(--f-mono);margin-right:6px}'+
    '.xw-num{position:absolute;top:1px;left:2px;font:500 clamp(7px,1vw,10px)/1 var(--f-mono);color:var(--ink-soft);pointer-events:none}'+
    '.xw-clues{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:4px 18px;align-content:start}'+
    '.xw-clues h4{margin:4px 0 4px;font:600 15px/1.2 var(--f-body)}'+
    '.xw-clue{display:flex;gap:8px;width:100%;min-height:44px;padding:5px 8px;border:1px solid transparent;border-radius:6px;background:none;text-align:left;font-size:14px;line-height:1.35;cursor:pointer;align-items:flex-start}'+
    '.xw-clue b{font:600 13px/1.5 var(--f-mono);min-width:2.8em;white-space:nowrap;color:var(--ink-soft)}'+
    '.xw-clue:hover{border-color:var(--panel-border)}'+
    '.xw-clue.is-on{background:var(--accent-soft);border-color:var(--accent)}'+
    '.xw-clue.is-done{color:var(--ink-soft)}.xw-clue.is-done b::after{content:" ✓";color:var(--good)}'+
    '@media (prefers-reduced-motion: no-preference){.xw-cell.is-wrong input{animation:xwshake .4s}.xw-cell.pop input{animation:xwpop .25s ease-out}}'+
    '@keyframes xwshake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}'+
    '@keyframes xwpop{50%{transform:scale(1.08)}}';
    document.head.appendChild(st);
  }
  const host=cfg.host,id='xw'+(++xwN);
  const words=cfg.words.map(w=>({a:w.a.toUpperCase(),clue:w.clue,r:w.r,c:w.c,d:w.d==='d'?1:0}));
  const R=Math.max(...words.map(w=>w.r+w.d*(w.a.length-1)))+1,C=Math.max(...words.map(w=>w.c+(1-w.d)*(w.a.length-1)))+1;
  const cells={};   // 'r,c' -> {ch, words:[word indexes], el, inp}
  words.forEach((w,wi)=>{w.cells=[];for(let k=0;k<w.a.length;k++){const key=(w.r+w.d*k)+','+(w.c+(1-w.d)*k);
    const cl=cells[key]||(cells[key]={ch:w.a[k],words:[]});cl.words.push(wi);w.cells.push(key);}});
  // number the squares that start a word, reading left to right, top to bottom
  let n=0;const starts={};
  for(let r=0;r<R;r++)for(let c=0;c<C;c++){if(words.some(w=>w.r===r&&w.c===c))starts[r+','+c]=++n;}
  words.forEach(w=>{w.n=starts[w.r+','+w.c];});
  const order=words.map((w,i)=>i).sort((x,y)=>words[x].d-words[y].d||words[x].n-words[y].n);
  const keys=Object.keys(cells);
  const wrap=mk('div','xw');host.appendChild(wrap);
  const now=mk('p','xw-now','Click a square or a clue, then type. Space or a second click turns between across and down.');wrap.appendChild(now);
  const grid=mk('div','xw-grid');grid.style.setProperty('--xw-c',C);grid.setAttribute('role','group');grid.setAttribute('aria-label','Crossword grid');
  const scroller=mk('div','xw-scroll');scroller.appendChild(grid);wrap.appendChild(scroller);
  for(let r=0;r<R;r++)for(let c=0;c<C;c++){
    const key=r+','+c,cl=cells[key],d=mk('div','xw-cell');grid.appendChild(d);
    if(!cl){d.setAttribute('aria-hidden','true');continue;}
    if(starts[key])d.appendChild(mk('span','xw-num',''+starts[key])).setAttribute('aria-hidden','true');
    const inp=document.createElement('input');inp.type='text';inp.maxLength=2;inp.autocomplete='off';inp.spellcheck=false;
    inp.setAttribute('autocapitalize','characters');inp.id=id+'-'+r+'-'+c;
    inp.setAttribute('aria-label',cl.words.map(wi=>{const w=words[wi];return w.n+(w.d?' down':' across')+', letter '+(w.cells.indexOf(key)+1)+' of '+w.a.length;}).join('; '));
    d.appendChild(inp);cl.el=d;cl.inp=inp;cl.key=key;
  }
  keys.forEach(k=>{cells[k].inp.tabIndex=-1;});cells[words[order[0]].cells[0]].inp.tabIndex=0;
  const clues=mk('div','xw-clues');wrap.appendChild(clues);
  const clueBtn={};
  [0,1].forEach(dd=>{
    const col=mk('div');col.appendChild(mk('h4','',dd?'Down':'Across'));
    order.filter(i=>words[i].d===dd).forEach(i=>{
      const w=words[i],b=mk('button','xw-clue','<b>'+w.n+'</b><span>'+w.clue+' ('+w.a.length+')</span>');b.type='button';
      b.addEventListener('click',()=>{dir=w.d;const k=w.cells.find(k=>!cells[k].inp.value&&!cells[k].ok)||w.cells[0];cells[k].inp.focus();});
      col.appendChild(b);clueBtn[i]=b;
    });
    clues.appendChild(col);
  });
  const b=bar(host,[{label:'Check answers',primary:true,fn:check},{label:'Start again',fn:reset}]);
  const ans=answerBtn(b,()=>{keys.forEach(k=>{const cl=cells[k];if(!cl.ok){lock(cl);cl.el.classList.add('is-shown');}});markDone();b.say(SHOWN_MSG,'');});
  let cur=null,dir=0;
  const wordOf=(key,d)=>{const cl=cells[key];return cl.words.find(wi=>words[wi].d===d);};
  function highlight(){
    keys.forEach(k=>cells[k].el.classList.remove('is-word','is-cur'));
    Object.values(clueBtn).forEach(x=>x.classList.remove('is-on'));
    if(!cur)return;
    const wi=wordOf(cur,dir);
    if(wi!=null){const w=words[wi];w.cells.forEach(k=>cells[k].el.classList.add('is-word'));clueBtn[wi].classList.add('is-on');
      now.innerHTML='<b>'+w.n+(w.d?' down':' across')+'</b>'+w.clue+' ('+w.a.length+')';}
    // only the current square is in the Tab order; the arrow keys move around the grid
    keys.forEach(k=>{cells[k].inp.tabIndex=k===cur?0:-1;});
    cells[cur].el.classList.add('is-cur');
  }
  function go(key){if(cells[key])cells[key].inp.focus();}
  function step(key,s){   // next square along the current word
    const wi=wordOf(key,dir);if(wi==null)return null;const w=words[wi],i=w.cells.indexOf(key)+s;
    return i>=0&&i<w.cells.length?w.cells[i]:null;
  }
  function markDone(){words.forEach((w,i)=>clueBtn[i].classList.toggle('is-done',w.cells.every(k=>cells[k].ok)));}
  keys.forEach(key=>{
    const cl=cells[key],inp=cl.inp;
    inp.addEventListener('focus',()=>{
      if(wordOf(key,dir)==null)dir=1-dir;
      cur=key;highlight();inp.select&&inp.select();
    });
    inp.addEventListener('blur',()=>{setTimeout(()=>{if(!grid.contains(document.activeElement)){cur=null;highlight();}},0);});
    inp.addEventListener('mousedown',e=>{if(document.activeElement===inp&&cl.words.length>1){e.preventDefault();dir=1-dir;highlight();}});
    inp.addEventListener('input',()=>{
      const v=(inp.value.match(/[a-z]/ig)||[]).pop();
      if(cl.ok){inp.value=cl.ch;}
      else{inp.value=v?v.toUpperCase():'';cl.el.classList.remove('is-wrong');}
      if(v){const nx=step(key,1);if(nx)go(nx);}
    });
    inp.addEventListener('keydown',e=>{
      const k=e.key;let r=+key.split(',')[0],c=+key.split(',')[1];
      if(k==='Backspace'){
        if(inp.value&&!cl.ok){inp.value='';e.preventDefault();return;}
        const pv=step(key,-1);if(pv){e.preventDefault();go(pv);if(!cells[pv].ok)cells[pv].inp.value='';}
        return;
      }
      if(k==='Delete'){if(!cl.ok)inp.value='';e.preventDefault();return;}
      if(k===' '){e.preventDefault();if(cl.words.length>1){dir=1-dir;highlight();}return;}
      const mv={ArrowLeft:[0,-1],ArrowRight:[0,1],ArrowUp:[-1,0],ArrowDown:[1,0]}[k];
      if(mv){
        e.preventDefault();
        const nd=mv[0]?1:0;if(nd!==dir&&wordOf(key,nd)!=null){dir=nd;highlight();return;}
        for(let i=1;i<Math.max(R,C);i++){const nk=(r+mv[0]*i)+','+(c+mv[1]*i);if(cells[nk]){go(nk);return;}if(r+mv[0]*i<0||c+mv[1]*i<0||r+mv[0]*i>=R||c+mv[1]*i>=C)return;}
        return;
      }
      if(cl.ok&&/^[a-z]$/i.test(k)){e.preventDefault();const nx=step(key,1);if(nx)go(nx);}
    });
  });
  function lock(cl,pop){cl.ok=true;cl.inp.value=cl.ch;cl.inp.readOnly=true;cl.el.classList.remove('is-wrong');cl.el.classList.add('is-ok');if(pop){cl.el.classList.add('pop');setTimeout(()=>cl.el.classList.remove('pop'),300);}}
  let wrongTimer=null;
  function check(){
    let wrong=[],blank=0;
    keys.forEach(k=>{const cl=cells[k];if(cl.ok)return;const v=cl.inp.value;
      if(!v){blank++;return;}
      if(v===cl.ch)lock(cl,true);else{wrong.push(cl);cl.el.classList.add('is-wrong');}});
    markDone();
    const done=words.filter(w=>w.cells.every(k=>cells[k].ok)).length;
    clearTimeout(wrongTimer);
    wrongTimer=setTimeout(()=>{wrong.forEach(cl=>{if(!cl.ok){cl.inp.value='';cl.el.classList.remove('is-wrong');}});},750);
    if(wrong.length)ans.on();
    if(done===words.length){ans.off();b.say('All '+words.length+' words correct. Well done.','good');celebrate(b.msg);}
    else b.say(done+' of '+words.length+' words correct'+(wrong.length?', '+wrong.length+' wrong letter'+(wrong.length>1?'s':'')+' taken out':'')+(blank?', '+blank+' square'+(blank>1?'s':'')+' empty':'')+'.',wrong.length?'bad':'');
  }
  function reset(){
    clearTimeout(wrongTimer);
    keys.forEach(k=>{const cl=cells[k];cl.ok=false;cl.inp.value='';cl.inp.readOnly=false;cl.el.classList.remove('is-ok','is-wrong','is-shown','pop');});
    ans.off();markDone();b.say('','');
  }
  return track(host,{reset:reset,
    getState:()=>({v:keys.map(k=>cells[k].inp.value||'.').join(''),ok:keys.map(k=>cells[k].ok?1:0).join('')}),
    setState:s=>{
      reset();if(!s||typeof s.v!=='string')return;
      keys.forEach((k,i)=>{const cl=cells[k],v=s.v[i];if(s.ok&&s.ok[i]==='1'&&v===cl.ch)lock(cl);else if(v&&/[A-Z]/.test(v))cl.inp.value=v;});
      markDone();
      if(keys.every(k=>cells[k].ok))b.say('All '+words.length+' words correct.','good');
    },
    isDone:()=>keys.every(k=>cells[k].ok)});
}
/* ================= SVG line graph ================= */
function lineGraph(o){
  const W=o.W||560,H=o.H||340,pl=o.pl||58,pr=o.pr||18,pt=o.pt||16,pb=o.pb||50;
  const gx=x=>pl+(x-o.xMin)/(o.xMax-o.xMin)*(W-pl-pr);
  const gy=y=>H-pb-(y-o.yMin)/(o.yMax-o.yMin)*(H-pt-pb);
  let s='<svg class="graph" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+(o.label||'Graph')+'">';
  (o.yTicks||[]).forEach(t=>{s+='<line class="g-grid" x1="'+pl+'" x2="'+(W-pr)+'" y1="'+gy(t)+'" y2="'+gy(t)+'"/><text class="g-tick" x="'+(pl-8)+'" y="'+(gy(t)+5)+'" text-anchor="end">'+t+'</text>';});
  (o.xTicks||[]).forEach(t=>{s+='<line class="g-grid" y1="'+pt+'" y2="'+(H-pb)+'" x1="'+gx(t)+'" x2="'+gx(t)+'"/><text class="g-tick" x="'+gx(t)+'" y="'+(H-pb+20)+'" text-anchor="middle">'+t+'</text>';});
  s+='<line class="g-axis" x1="'+pl+'" x2="'+pl+'" y1="'+pt+'" y2="'+(H-pb)+'"/><line class="g-axis" x1="'+pl+'" x2="'+(W-pr)+'" y1="'+(H-pb)+'" y2="'+(H-pb)+'"/>';
  s+='<text class="g-lab" x="'+(pl+(W-pl-pr)/2)+'" y="'+(H-8)+'" text-anchor="middle">'+o.xLabel+'</text>';
  s+='<text class="g-lab" transform="translate(16 '+(pt+(H-pt-pb)/2)+') rotate(-90)" text-anchor="middle">'+o.yLabel+'</text>';
  if(o.segments){o.segments.forEach(sg=>{s+='<polyline class="g-line '+(sg.cls||'')+'" points="'+sg.pts.map(p=>gx(p[0])+','+gy(p[1])).join(' ')+'"/>';});}
  else s+='<polyline class="g-line" points="'+o.points.map(p=>gx(p[0]).toFixed(1)+','+gy(p[1]).toFixed(1)).join(' ')+'"/>';
  s+=(o.extra||'')+'</svg>';
  return {svg:s,gx:gx,gy:gy,W:W,H:H,pct:(x,y)=>({x:gx(x)/W*100,y:gy(y)/H*100})};
}
const byId=id=>document.getElementById(id);
// An animation that also has its own page is shown in a frame, so there is one copy (see CLAUDE.md).
// The framed page reports its height, and the frame grows to fit it.
function frameAct(panel,file,show,title,name,first){
  const w=mk('div','anim-wrap');
  w.innerHTML='<iframe class="anim-frame" src="'+file+'?embed'+(show?'&show='+show:'')+'" title="'+title+'"></iframe><p class="anim-open"><a href="'+file+'">Open the '+name+' animation full screen &rarr;</a></p>';
  const acts=$('#panel-'+panel+' .acts');if(first)acts.prepend(w);else acts.appendChild(w);
}
window.addEventListener('message',e=>{
  const h=e.data&&e.data.animHeight;if(typeof h!=='number')return;
  $$('iframe.anim-frame').forEach(f=>{if(f.contentWindow===e.source)f.style.height=h+'px';});
});

/* ================= plot the results on graph paper (createPlot) ================= */
// Click (or use the arrow keys and Enter) to place each cross; Check locks the right ones.
function createPlot(cfg){
  const host=cfg.host, pts=cfg.points, o=cfg.graph;
  const W=o.W,H=o.H,pl=o.pl||58,pr=18,pt=16,pb=50;   // graph.pl: a wider left margin, for a scale with minus signs
  const gx=x=>pl+(x-o.xMin)/(o.xMax-o.xMin)*(W-pl-pr), gy=y=>H-pb-(y-o.yMin)/(o.yMax-o.yMin)*(H-pt-pb);
  const ix=px=>o.xMin+(px-pl)/(W-pl-pr)*(o.xMax-o.xMin), iy=py=>o.yMin+(H-pb-py)/(H-pt-pb)*(o.yMax-o.yMin);
  const snap=(v,s)=>+(Math.round(v/s)*s).toFixed(9);   // toFixed: 12 × 0.1 must be 1.2, not 1.2000000000000002 (off the graph)
  const wrap=mk('div','plot-split');host.appendChild(wrap);
  const box=mk('div','plot-box');wrap.appendChild(box);
  const side=mk('div','plot-side');wrap.appendChild(side);
  const list=mk('ol','plot-list');side.appendChild(list);
  let placed=[],locked=[],cur={x:0,y:0},wrongIdx=-1;
  const b=bar(side,[{label:'Check plot',primary:true,fn:check},{label:'Clear',fn:reset}]);
  // what to do next, after the last point: cfg.next overrides it (e.g. when no line-of-best-fit question follows)
  const NEXT=cfg.next===undefined?' Now choose the line of best fit below.':cfg.next;
  const ans=answerBtn(b,()=>{pts.forEach((p,i)=>{if(!locked[i]){placed[i]={x:p.x,y:p.y};locked[i]=true;}});wrongIdx=-1;render();b.say('Points shown. Read them through, then Clear to plot them on your own.'+NEXT,'');});
  function next(){for(let i=0;i<pts.length;i++)if(!placed[i])return i;return -1;}
  const neg=t=>String(t).replace('-','−');   // a real minus sign on the scale
  function cross(x,y,cls){const cx=gx(x),cy=gy(y);return '<path class="'+cls+'" d="M'+(cx-6)+','+(cy-6)+' L'+(cx+6)+','+(cy+6)+' M'+(cx+6)+','+(cy-6)+' L'+(cx-6)+','+(cy+6)+'"/>';}
  function render(){
    let s='<svg class="graph plot-svg" viewBox="0 0 '+W+' '+H+'" tabindex="0" role="application" aria-label="Graph paper: click to plot the next point, or move with the arrow keys and press Enter">';
    for(let x=o.xMin;x<=o.xMax+1e-9;x+=o.minor[0])s+='<line class="g-minor" x1="'+gx(x)+'" x2="'+gx(x)+'" y1="'+pt+'" y2="'+(H-pb)+'"/>';
    for(let y=o.yMin;y<=o.yMax+1e-9;y+=o.minor[1])s+='<line class="g-minor" y1="'+gy(y)+'" y2="'+gy(y)+'" x1="'+pl+'" x2="'+(W-pr)+'"/>';
    o.yTicks.forEach(t=>{s+='<line class="g-grid" x1="'+pl+'" x2="'+(W-pr)+'" y1="'+gy(t)+'" y2="'+gy(t)+'"/><text class="g-tick" x="'+(pl-8)+'" y="'+(gy(t)+5)+'" text-anchor="end">'+neg(t)+'</text>';});
    o.xTicks.forEach(t=>{s+='<line class="g-grid" y1="'+pt+'" y2="'+(H-pb)+'" x1="'+gx(t)+'" x2="'+gx(t)+'"/><text class="g-tick" x="'+gx(t)+'" y="'+(H-pb+20)+'" text-anchor="middle">'+neg(t)+'</text>';});
    s+='<line class="g-axis" x1="'+pl+'" x2="'+pl+'" y1="'+pt+'" y2="'+(H-pb)+'"/><line class="g-axis" x1="'+pl+'" x2="'+(W-pr)+'" y1="'+(H-pb)+'" y2="'+(H-pb)+'"/>';
    // a range that goes below zero (reversed readings): the axes are drawn through the origin as well
    if(o.xMin<0&&o.xMax>0)s+='<line class="g-axis g-axis0" x1="'+gx(0)+'" x2="'+gx(0)+'" y1="'+pt+'" y2="'+(H-pb)+'"/>';
    if(o.yMin<0&&o.yMax>0)s+='<line class="g-axis g-axis0" x1="'+pl+'" x2="'+(W-pr)+'" y1="'+gy(0)+'" y2="'+gy(0)+'"/>';
    s+='<text class="g-lab" x="'+(pl+(W-pl-pr)/2)+'" y="'+(H-8)+'" text-anchor="middle">'+o.xLabel+'</text><text class="g-lab" transform="translate(16 '+(pt+(H-pt-pb)/2)+') rotate(-90)" text-anchor="middle">'+o.yLabel+'</text>';
    // cfg.join: a sketch graph, so each point is joined to the one before it once both are plotted
    if(cfg.join)for(let i=1;i<pts.length;i++)if(placed[i-1]&&placed[i])s+='<path class="g-line g-sketch" d="M'+gx(placed[i-1].x)+','+gy(placed[i-1].y)+' L'+gx(placed[i].x)+','+gy(placed[i].y)+'"/>';
    placed.forEach((p,i)=>{if(p)s+=cross(p.x,p.y,'pc'+(locked[i]?' ok':'')+(i===wrongIdx?' no':''));});
    if(next()>=0)s+='<circle class="pcur" cx="'+gx(cur.x)+'" cy="'+gy(cur.y)+'" r="7"/>';
    s+='</svg>';
    box.innerHTML=s;
    const svg=box.querySelector('svg');
    svg.addEventListener('click',e=>{
      const r=svg.getBoundingClientRect(),px=(e.clientX-r.left)/r.width*W,py=(e.clientY-r.top)/r.height*H;
      const x=snap(ix(px),o.snap[0]),y=snap(iy(py),o.snap[1]);
      if(x<o.xMin||x>o.xMax||y<o.yMin||y>o.yMax)return;
      // clicking an unlocked cross takes it off again
      const hit=placed.findIndex((p,i)=>p&&!locked[i]&&Math.abs(gx(p.x)-gx(x))<8&&Math.abs(gy(p.y)-gy(y))<8);
      if(hit>=0){placed[hit]=null;render();return;}
      cur={x:x,y:y};place();
    });
    svg.addEventListener('keydown',e=>{
      const k=e.key,d={ArrowRight:[1,0],ArrowLeft:[-1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[k];
      if(d){e.preventDefault();cur={x:clamp(snap(cur.x+d[0]*o.snap[0],o.snap[0]),o.xMin,o.xMax),y:clamp(snap(cur.y+d[1]*o.snap[1],o.snap[1]),o.yMin,o.yMax)};render();box.querySelector('svg').focus();b.say('Cursor at ('+neg(cur.x)+', '+neg(cur.y)+')','');}
      else if(k==='Enter'||k===' '){e.preventDefault();place();box.querySelector('svg').focus();}
    });
    list.innerHTML='';
    pts.forEach((p,i)=>{
      const li=mk('li','plot-row'+(locked[i]?' is-correct':'')+(placed[i]&&!locked[i]?' is-placed':'')+(i===next()?' is-next':''),
        '<span>'+cfg.rowText(p)+'</span><span class="plot-state">'+(locked[i]?'✓':placed[i]?'plotted':i===next()?'next':'')+'</span>');
      list.appendChild(li);
    });
  }
  function place(){const i=next();if(i<0)return;placed[i]={x:cur.x,y:cur.y};wrongIdx=-1;render();if(next()<0)b.say('All points plotted. Press Check plot.','');}
  function check(){
    let ok=0,bad=-1;
    pts.forEach((p,i)=>{if(!placed[i])return;if(Math.abs(placed[i].x-p.x)<=o.snap[0]/2+1e-9&&Math.abs(placed[i].y-p.y)<=o.snap[1]/2+1e-9)locked[i]=true;else if(bad<0)bad=i;});
    ok=locked.filter(Boolean).length;
    if(ok===pts.length){b.say('All '+pts.length+' points plotted correctly.'+NEXT,'good');wrongIdx=-1;render();return;}
    if(bad>=0){ans.on();wrongIdx=bad;render();b.say(ok+' of '+pts.length+' correct. '+(cfg.wrong||'The red cross is in the wrong place: check the scale on each axis.'),'bad');
      setTimeout(()=>{if(!locked[bad])placed[bad]=null;wrongIdx=-1;render();},900);}
    else b.say(ok+' of '+pts.length+' correct so far. Plot the rest.','');
  }
  function reset(){placed=[];locked=[];cur={x:0,y:0};wrongIdx=-1;ans.off();b.say('','');render();}
  reset();  return track(host,{reset:reset,
    getState:()=>({p:placed,l:locked}),
    setState:s=>{
      reset();
      const good=v=>v&&typeof v.x==='number'&&typeof v.y==='number';
      pts.forEach((p,i)=>{const v=s.p&&s.p[i];if(good(v)){placed[i]={x:v.x,y:v.y};if(s.l&&s.l[i])locked[i]=true;}});
      render();
      if(locked.filter(Boolean).length===pts.length)b.say('All '+pts.length+' points plotted correctly.'+NEXT,'good');
    },
    isDone:()=>pts.every((p,i)=>locked[i])});
}
