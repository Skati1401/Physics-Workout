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

const STORE_KEY='{{STORE_KEY}}';
const TAB_IDS={{TAB_IDS}};
let activeTab='{{FIRST_TAB}}';
const reflowers=[];
const tickers=[];
function addTicker(tab,fn){tickers.push({tab,fn});}
function loop(t){if(!document.hidden){for(const k of tickers){if(k.tab===activeTab){try{k.fn(t);}catch(e){console.error(e);}}}}raf(loop);}

function act(panel,kind,title,intro){
  const a=mk('article','act');
  a.innerHTML='<h3 class="act-title"><span class="kind">'+kind+'</span><span>'+title+'</span></h3>'+(intro?'<p class="act-intro">'+FR(intro)+'</p>':'');
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

/* ================= drag engine (pointer events, mouse + touch) ================= */
function hitEl(ev,selector){
  const t=document.elementFromPoint(ev.clientX,ev.clientY);
  return t?t.closest(selector):null;
}
function makeDraggable(node,o){
  o=o||{};
  node.style.touchAction='none';
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
  let placed={},locked={},selected=null;
  slots.forEach(s=>{
    s.el.dataset.slotId=s.id;s.el.classList.add('slot','is-empty');
    s.el.addEventListener('click',function(e){
      if(e.target.closest('.chip'))return;
      if(selected&&!placed[s.id]&&!locked[s.id])place(selected,s.id);
    });
  });
  function say(t,c){if(cfg.msg)cfg.msg.say(t,c);}
  function chipEl(c,inSlot){
    const e=mk('span','chip'+(inSlot?' is-placed':''));
    e.innerHTML=inSlot&&cfg.slotText?cfg.slotText(c):c.text;
    if(inSlot&&cfg.placedClass)e.classList.add(cfg.placedClass);
    e.dataset.chip=c.id;return e;
  }
  function place(chipId,slotId){
    Object.keys(placed).forEach(k=>{if(placed[k]===chipId)delete placed[k];});
    placed[slotId]=chipId;selected=null;render();
  }
  function unplace(slotId){if(!locked[slotId]){delete placed[slotId];render();}}
  function slotAt(ev){
    const t=hitEl(ev,'.slot');
    if(t&&slotMap[t.dataset.slotId]&&slotMap[t.dataset.slotId].el===t)return slotMap[t.dataset.slotId];
    return null;
  }
  function render(){
    pool.innerHTML='';
    const used=new Set(Object.keys(placed).map(k=>placed[k]));
    order.filter(id=>!used.has(id)).forEach(id=>{
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
  }
  function check(){
    const wrong=[];let empty=0,newRight=0;
    slots.forEach(s=>{
      if(locked[s.id])return;
      const cid=placed[s.id];
      if(!cid){empty++;return;}
      if(cfg.isCorrect(chipMap[cid],s)){locked[s.id]=true;newRight++;}else wrong.push(s.id);
    });
    render();
    wrong.forEach(id=>{slotMap[id].el.classList.add('is-wrong');});
    const done=Object.keys(locked).length;
    if(done===slots.length)say('All '+slots.length+' correct. Well done.','good');
    else if(wrong.length)say(wrong.length+' in the wrong place. They will pop back so you can try again.'+(empty?' '+empty+' still empty.':''),'bad');
    else say(empty+' still to fill.','');
    if(wrong.length)setTimeout(()=>{wrong.forEach(id=>{if(!locked[id])delete placed[id];});render();},850);
  }
  function reset(){placed={};locked={};selected=null;order=shuffle(cfg.chips.map(c=>c.id));say('','');render();}
  render();
  return {check:check,reset:reset,render:render};
}

/* ================= sort into bins ================= */
function createSortGame(cfg){
  const host=cfg.host,items=cfg.items,cats=cfg.cats,itemMap={};
  items.forEach(i=>itemMap[i.id]=i);
  const binsEl=mk('div','bins bins-'+cats.length);
  const poolLabel=mk('div','pool-label','Cards to sort');
  const poolEl=mk('div','sort-pool');
  host.appendChild(binsEl);host.appendChild(poolLabel);host.appendChild(poolEl);
  let where={},locked={},selected=null,order;
  const b=bar(host,[{label:'Check',primary:true,fn:check},{label:'Shuffle again',fn:reset}]);
  const score=mk('span','score');b.el.insertBefore(score,b.msg);
  function itemEl(i){const e=mk('div','sort-item',i.text);e.dataset.item=i.id;if(locked[i.id])e.classList.add('is-correct');return e;}
  function drop(id,ev){
    const bin=hitEl(ev,'.bin');
    if(bin&&binsEl.contains(bin))where[id]=bin.dataset.cat;
    else if(hitEl(ev,'.sort-pool')===poolEl)where[id]='pool';
    selected=null;render();
  }
  function render(){
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
      binsEl.appendChild(bin);
    });
    poolEl.innerHTML='';
    order.filter(id=>where[id]==='pool').forEach(id=>{
      const e=itemEl(itemMap[id]);if(selected===id)e.classList.add('is-selected');poolEl.appendChild(e);
      makeDraggable(e,{onEnd:ev=>drop(id,ev),onClick:()=>{selected=selected===id?null:id;render();}});
    });
    score.textContent=Object.keys(locked).length+' / '+items.length+' correct';
  }
  function check(){
    const wrong=[];let inPool=0;
    items.forEach(i=>{
      if(locked[i.id])return;
      if(where[i.id]==='pool'){inPool++;return;}
      if(where[i.id]===i.cat)locked[i.id]=true;else wrong.push(i.id);
    });
    render();
    wrong.forEach(id=>{const e=binsEl.querySelector('[data-item="'+id+'"]');if(e)e.classList.add('is-wrong');});
    if(Object.keys(locked).length===items.length)b.say('All correct. Well done.','good');
    else if(wrong.length)b.say(wrong.length+' in the wrong bin. They will go back to the pool.'+(inPool?' '+inPool+' not sorted yet.':''),'bad');
    else b.say(inPool+' cards still to sort.','');
    if(wrong.length)setTimeout(()=>{wrong.forEach(id=>{if(!locked[id])where[id]='pool';});render();},850);
  }
  function reset(){where={};locked={};selected=null;items.forEach(i=>where[i.id]='pool');order=shuffle(items.map(i=>i.id));b.say('','');render();}
  reset();
  return {reset:reset};
}

/* ================= match (lines between two columns) ================= */
function createMatchGame(cfg){
  const host=cfg.host,pairs=cfg.pairs;
  const grid=mk('div','match-grid');
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('class','match-lines');
  const colL=mk('div','match-col'),colR=mk('div','match-col');
  grid.appendChild(svg);grid.appendChild(colL);grid.appendChild(colR);host.appendChild(grid);
  let L,R,link,locked,sel,wrongSet={};
  const b=bar(host,[{label:'Check matches',primary:true,fn:check},{label:'Shuffle again',fn:reset}]);
  const score=mk('span','score');b.el.insertBefore(score,b.msg);
  function card(side,id){
    const p=pairs.find(x=>x.id===id);
    const e=mk('div','match-card',side==='L'?p.l:p.r);e.dataset.side=side;e.dataset.id=id;
    const linked=side==='L'?link[id]!==undefined:Object.values(link).indexOf(id)>=0;
    if(linked)e.classList.add('is-linked');
    const lid=side==='L'?id:Object.keys(link).find(k=>link[k]===id);
    if(lid!==undefined&&locked[lid]){e.classList.remove('is-linked');e.classList.add('is-correct');}
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
    colL.innerHTML='<h4>'+cfg.leftTitle+'</h4>';colR.innerHTML='<h4>'+cfg.rightTitle+'</h4>';
    L.forEach(id=>colL.appendChild(card('L',id)));R.forEach(id=>colR.appendChild(card('R',id)));
    score.textContent=Object.keys(locked).length+' / '+pairs.length+' matched';
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
    pairs.forEach(p=>{if(locked[p.id])return;if(link[p.id]===undefined){unpaired++;return;}if(link[p.id]===p.id)locked[p.id]=true;else wrong.push(p.id);});
    wrongSet={};wrong.forEach(id=>wrongSet[id]=true);
    render();
    if(Object.keys(locked).length===pairs.length)b.say('All pairs correct. Well done.','good');
    else if(wrong.length)b.say(wrong.length+' pair'+(wrong.length>1?'s are':' is')+' wrong. They will come apart so you can try again.'+(unpaired?' '+unpaired+' not paired yet.':''),'bad');
    else b.say(unpaired+' still to pair.','');
    if(wrong.length)setTimeout(()=>{wrong.forEach(id=>{if(!locked[id])delete link[id];});wrongSet={};render();},900);
  }
  function reset(){L=shuffle(pairs.map(p=>p.id));R=shuffle(pairs.map(p=>p.id));link={};locked={};sel=null;wrongSet={};b.say('','');render();}
  window.addEventListener('resize',()=>raf(reflow));
  reset();
  return {reflow:reflow,reset:reset};
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
function createCalc(cfg){
  const host=cfg.host,qs=cfg.questions,id='calc'+(++calcN);
  const wrap=mk('div','calc-inputs');host.appendChild(wrap);
  qs.forEach((q,i)=>{
    const row=mk('div','calc-input-row');
    row.innerHTML='<div class="calc-input-label"><label for="'+id+'-'+i+'">'+q.q+'</label></div>'+
      '<div class="calc-input-wrap"><input class="calc-num-input" id="'+id+'-'+i+'" type="text" inputmode="decimal" autocomplete="off" spellcheck="false"><span class="calc-input-unit">'+q.unit+'</span></div>'+
      '<div class="calc-fb" aria-live="polite"></div>'+
      '<div class="calc-working" hidden><div class="calc-working-head">Working</div><div>'+FR(q.working)+'</div></div>';
    wrap.appendChild(row);
  });
  const b=bar(host,[{label:'Check answers',primary:true,fn:check},{label:'Clear',fn:reset}]);
  function check(){
    let ok=0,blank=0,bad=0;
    qs.forEach((q,i)=>{
      const inp=$('#'+id+'-'+i),fb=inp.closest('.calc-input-row').querySelector('.calc-fb');
      if(inp.disabled){ok++;return;}
      const raw=inp.value.trim();
      if(raw===''){blank++;fb.textContent='';fb.className='calc-fb';return;}
      const clean=raw.replace(/[\s,\u2009]/g,'').replace(/[\u00D7x]10\^?(-?\d+)/i,'e$1');
      const v=/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(clean)?parseFloat(clean):NaN;
      if(isFinite(v)&&numClose(v,q.answer)){inp.disabled=true;inp.classList.remove('is-wrong');fb.textContent='Correct.';fb.className='calc-fb good';ok++;}
      else{bad++;inp.classList.add('is-wrong');inp.closest('.calc-input-row').querySelector('.calc-working').hidden=false;fb.textContent=q.hint||'Not quite. Check the rearrangement and the units, then try again.';fb.className='calc-fb bad';}
    });
    if(ok===qs.length)b.say('All '+qs.length+' correct.','good');
    else b.say(ok+' of '+qs.length+' correct'+(blank?', '+blank+' left blank':'')+'.',bad?'bad':'');
  }
  function reset(){
    qs.forEach((q,i)=>{const inp=$('#'+id+'-'+i);inp.value='';inp.disabled=false;inp.classList.remove('is-wrong');const fb=inp.closest('.calc-input-row').querySelector('.calc-fb');fb.textContent='';fb.className='calc-fb';inp.closest('.calc-input-row').querySelector('.calc-working').hidden=true;});
    b.say('','');
  }
  return {reset:reset};
}

/* ================= reorder (live reorder + up/down buttons) ================= */
function createReorder(cfg){
  const host=cfg.host,steps=cfg.steps,map={};
  steps.forEach(s=>map[s.id]=s);
  const list=mk('ol','reorder');host.appendChild(list);
  const b=bar(host,[{label:'Check order',primary:true,fn:check},{label:'Shuffle again',fn:reset}]);
  let order,rows={},done=false;
  const valid=o=>cfg.constraints.filter(c=>o.indexOf(c[0])<o.indexOf(c[1])).length;
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
    if(n===t){done=true;Object.keys(rows).forEach(k=>rows[k].classList.add('is-correct'));b.say('Correct order. '+(cfg.why||''),'good');}
    else b.say(n+' of '+t+' sequence checks passed. Think about what must happen before what, then try again.','bad');
  }
  function reset(){
    done=false;let o;
    do{o=shuffle(steps.map(s=>s.id));}while(valid(o)===cfg.constraints.length);
    order=o;b.say('','');build();
  }
  reset();
  return {reset:reset};
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
  let order,tries=0;
  function render(){
    opts.innerHTML='';
    order.forEach(i=>{
      const o=cfg.options[i];
      const btn=mk('button','pred-opt',o.text);btn.type='button';
      btn.addEventListener('click',()=>choose(i));
      btn.dataset.i=i;opts.appendChild(btn);
    });
  }
  // A first wrong answer lights up only that option and explains why it is wrong; the student tries again.
  // The right answer is shown once they find it, or after a second wrong answer.
  function choose(i){
    const o=cfg.options[i];
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
      if(k.correct)btn.classList.add('is-right');
      if(+btn.dataset.i===i){btn.classList.add('is-chosen');if(!k.correct)btn.classList.add('is-wrong');}
    });
    const right=cfg.options.find(x=>x.correct);
    out.innerHTML='<p><strong>'+(o.correct?'That is right.':'Not quite.')+'</strong> '+FR(o.correct?cfg.explain:o.why+' '+cfg.explain)+'</p>'+(cfg.reveal||'');
    out.hidden=false;out.classList.remove('go');b.el.hidden=false;
    raf(()=>raf(()=>out.classList.add('go')));
  }
  function reset(){tries=0;order=shuffle(cfg.options.map((o,i)=>i));out.hidden=true;out.classList.remove('go');b.el.hidden=true;render();}
  reset();
  return {reset:reset};
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
  const blk=mk('div','err-block');cfg.host.appendChild(blk);
  blk.appendChild(mk('p','err-scn',nb(cfg.scenario)));
  const btns=cfg.lines.map((t,i)=>{
    const btn=mk('button','err-line','<span class="err-num" aria-hidden="true">'+(i+1)+'</span><span aria-hidden="true">'+html(t)+'</span>');
    btn.type='button';btn.setAttribute('aria-label','Line '+(i+1)+': '+said(t));
    btn.addEventListener('click',()=>pick(i,btn));
    blk.appendChild(btn);return btn;
  });
  const fb=mk('p','err-fb');fb.setAttribute('aria-live','polite');blk.appendChild(fb);
  const reset=()=>{btns.forEach(x=>{x.disabled=false;x.classList.remove('is-ok','is-bad','shake');});fb.textContent='Click the line that contains the mistake.';};
  function pick(i,btn){
    if(i===cfg.wrong){
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
  const W=o.W,H=o.H,pl=58,pr=18,pt=16,pb=50;
  const gx=x=>pl+(x-o.xMin)/(o.xMax-o.xMin)*(W-pl-pr), gy=y=>H-pb-(y-o.yMin)/(o.yMax-o.yMin)*(H-pt-pb);
  const ix=px=>o.xMin+(px-pl)/(W-pl-pr)*(o.xMax-o.xMin), iy=py=>o.yMin+(H-pb-py)/(H-pt-pb)*(o.yMax-o.yMin);
  const snap=(v,s)=>Math.round(v/s)*s;
  const wrap=mk('div','plot-split');host.appendChild(wrap);
  const box=mk('div','plot-box');wrap.appendChild(box);
  const side=mk('div','plot-side');wrap.appendChild(side);
  const list=mk('ol','plot-list');side.appendChild(list);
  let placed=[],locked=[],cur={x:0,y:0},wrongIdx=-1;
  const b=bar(side,[{label:'Check plot',primary:true,fn:check},{label:'Clear',fn:reset}]);
  function next(){for(let i=0;i<pts.length;i++)if(!placed[i])return i;return -1;}
  function cross(x,y,cls){const cx=gx(x),cy=gy(y);return '<path class="'+cls+'" d="M'+(cx-6)+','+(cy-6)+' L'+(cx+6)+','+(cy+6)+' M'+(cx+6)+','+(cy-6)+' L'+(cx-6)+','+(cy+6)+'"/>';}
  function render(){
    let s='<svg class="graph plot-svg" viewBox="0 0 '+W+' '+H+'" tabindex="0" role="application" aria-label="Graph paper: click to plot the next point, or move with the arrow keys and press Enter">';
    for(let x=o.xMin;x<=o.xMax+1e-9;x+=o.minor[0])s+='<line class="g-minor" x1="'+gx(x)+'" x2="'+gx(x)+'" y1="'+pt+'" y2="'+(H-pb)+'"/>';
    for(let y=o.yMin;y<=o.yMax+1e-9;y+=o.minor[1])s+='<line class="g-minor" y1="'+gy(y)+'" y2="'+gy(y)+'" x1="'+pl+'" x2="'+(W-pr)+'"/>';
    o.yTicks.forEach(t=>{s+='<line class="g-grid" x1="'+pl+'" x2="'+(W-pr)+'" y1="'+gy(t)+'" y2="'+gy(t)+'"/><text class="g-tick" x="'+(pl-8)+'" y="'+(gy(t)+5)+'" text-anchor="end">'+t+'</text>';});
    o.xTicks.forEach(t=>{s+='<line class="g-grid" y1="'+pt+'" y2="'+(H-pb)+'" x1="'+gx(t)+'" x2="'+gx(t)+'"/><text class="g-tick" x="'+gx(t)+'" y="'+(H-pb+20)+'" text-anchor="middle">'+t+'</text>';});
    s+='<line class="g-axis" x1="'+pl+'" x2="'+pl+'" y1="'+pt+'" y2="'+(H-pb)+'"/><line class="g-axis" x1="'+pl+'" x2="'+(W-pr)+'" y1="'+(H-pb)+'" y2="'+(H-pb)+'"/>';
    s+='<text class="g-lab" x="'+(pl+(W-pl-pr)/2)+'" y="'+(H-8)+'" text-anchor="middle">'+o.xLabel+'</text><text class="g-lab" transform="translate(16 '+(pt+(H-pt-pb)/2)+') rotate(-90)" text-anchor="middle">'+o.yLabel+'</text>';
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
      if(d){e.preventDefault();cur={x:clamp(snap(cur.x+d[0]*o.snap[0],o.snap[0]),o.xMin,o.xMax),y:clamp(snap(cur.y+d[1]*o.snap[1],o.snap[1]),o.yMin,o.yMax)};render();box.querySelector('svg').focus();b.say('Cursor at ('+fmt(cur.x,1)+', '+fmt(cur.y,1)+')','');}
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
    if(ok===pts.length){b.say('All '+pts.length+' points plotted correctly. Now choose the line of best fit below.','good');wrongIdx=-1;render();return;}
    if(bad>=0){wrongIdx=bad;render();b.say(ok+' of '+pts.length+' correct. The red cross is in the wrong place: check the scale on each axis.','bad');
      setTimeout(()=>{if(!locked[bad])placed[bad]=null;wrongIdx=-1;render();},900);}
    else b.say(ok+' of '+pts.length+' correct so far. Plot the rest.','');
  }
  function reset(){placed=[];locked=[];cur={x:0,y:0};wrongIdx=-1;b.say('','');render();}
  reset();
}
