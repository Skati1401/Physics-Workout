/* ================= Calculations chooser (tools/sets/chooser.js, copied in by tools/sets/build.py) =================
   The page has no tabs. The cards built above sit in hidden panels (#store), one panel per workout section.
   The chooser lists one row per equation (ROWS, from build.py); a student ticks rows and presses Start,
   and the ticked rows' cards are moved into #pr-list. The ticks, Mix the order, Leave out TA and the open
   view are kept in this browser under STORE_KEY+'-pick'; the answers are saved by the engine as usual. */
function applyTabUI(){}
const ROWS=JSON.parse(byId('ch-rows').textContent);
const PICK_KEY=STORE_KEY+'-pick';
let pick={on:[],mix:false,da:false,view:'choose',order:[],v:0};
try{const s=JSON.parse(localStorage.getItem(PICK_KEY)||'null');if(s&&typeof s==='object')pick=Object.assign(pick,s);}catch(e){}
// Every equation starts ticked (Alex, 12 Nov 2026); ticks saved before then (v<2) are replaced once.
if(pick.v!==2){pick.on=ROWS.map(r=>r.id);pick.v=2;}
function savePick(){try{localStorage.setItem(PICK_KEY,JSON.stringify(pick));}catch(e){}}
ROWS.forEach(r=>{
  r.els=r.cards.map(c=>$$('#panel-'+c[0]+' .act').find(a=>a.dataset.raw===c[1])).filter(Boolean);
  if(r.els.length<r.cards.length)console.error('Calculations: a card is missing for row',r.id);
  r.els.forEach(a=>{a._home=a.parentNode;});
  r.games=games.filter(g=>r.els.some(a=>a.contains(g.host)));
});
const visible=r=>r.els.length>0&&!(pick.da&&r.ta);
const isOn=r=>pick.on.indexOf(r.id)>-1;
const rowDone=r=>r.games.length>0&&r.games.every(g=>{try{return g.isDone();}catch(e){return false;}});
function setOn(id,on){pick.on=pick.on.filter(x=>x!==id);if(on)pick.on.push(id);}

/* ---- draw the chooser: one box per unit, one row per equation ---- */
const UNITS=[];
ROWS.forEach(r=>{let u=UNITS.find(x=>x.name===r.unit);if(!u){u={name:r.unit,rows:[]};UNITS.push(u);}u.rows.push(r);});
UNITS.forEach(u=>{
  const box=mk('fieldset','ch-unit'),lg=mk('legend'),lab=mk('label','ch-unit-label'),ub=mk('input');
  ub.type='checkbox';ub.setAttribute('aria-label','Tick all of '+u.name);
  const cnt=mk('span','ch-unit-count');
  lab.append(ub,mk('span','ch-unit-name',u.name),cnt);lg.appendChild(lab);box.appendChild(lg);
  u.el=box;u.box=ub;u.cnt=cnt;
  u.rows.forEach(r=>{
    const row=mk('label','ch-row'),cb=mk('input'),txt=mk('span','ch-text'+(r.eqs.length?'':' no-eq'));
    cb.type='checkbox';cb.value=r.id;
    txt.innerHTML=(r.eqs.length?'<span class="ch-eqs">'+r.eqs.map(e=>'<span class="ch-eq">'+FR(e)+'</span>').join('')+'</span>':'')+'<span class="ch-label">'+r.label+'</span>';
    row.append(cb,txt);
    if(r.ta){const t=mk('span','ch-ta','TA');t.title='Triple Award only';row.appendChild(t);}
    const dn=mk('span','ch-done','<span aria-hidden="true">✓</span><span class="sr-only"> (done)</span>');row.appendChild(dn);
    r.row=row;r.cb=cb;r.dn=dn;
    cb.addEventListener('change',()=>{setOn(r.id,cb.checked);savePick();refresh();});
    box.appendChild(row);
  });
  ub.addEventListener('change',()=>{u.rows.filter(visible).forEach(r=>setOn(r.id,ub.checked));savePick();refresh();});
  byId('ch-units').appendChild(box);
});

/* ---- keep every tick, count and tag in step ---- */
function refresh(){
  let shown=0,done=0,ticked=0;
  UNITS.forEach(u=>{
    const vis=u.rows.filter(visible),on=vis.filter(isOn),d=vis.filter(rowDone);
    u.el.hidden=!vis.length;
    u.box.checked=vis.length>0&&on.length===vis.length;u.box.indeterminate=on.length>0&&on.length<vis.length;
    u.cnt.textContent=on.length?on.length+' of '+vis.length+' ticked':vis.length+(vis.length===1?' equation':' equations');
    u.rows.forEach(r=>{r.row.hidden=!visible(r);r.cb.checked=isOn(r);r.row.classList.toggle('is-on',isOn(r));r.dn.hidden=!rowDone(r);});
    shown+=vis.length;done+=d.length;ticked+=on.length;
  });
  byId('ch-count').textContent=ticked?ticked+(ticked===1?' equation':' equations')+' ticked':'Nothing ticked yet';
  byId('ch-start').disabled=!ticked;
  byId('ch-mix').checked=!!pick.mix;
  const da=byId('ch-da');da.setAttribute('aria-pressed',pick.da?'true':'false');
  da.title=pick.da?'Triple Award (TA) equations are left out. Click to show them.':'Click to leave out the Triple Award (TA) equations.';
  let pill=byId('tabs-done');
  if(!pill){pill=mk('span','tabs-done');pill.id='tabs-done';pill.setAttribute('aria-live','polite');$('.page-head').appendChild(pill);}
  const txt=done+' of '+shown+' done';
  if(pill.textContent!==txt){const up=done>(+pill.dataset.n||0);pill.textContent=txt;pill.dataset.n=done;
    if(up&&saveReady){pill.classList.remove('pulse');void pill.offsetWidth;pill.classList.add('pulse');}}
  pill.classList.toggle('all-done',shown>0&&done===shown);
  pill.title='An equation is done when every question on it has been answered right.';
  if(!byId('practice').hidden)byId('pr-count').textContent=prRows().filter(rowDone).length+' of '+prRows().length+' done';
}
// The engine calls showProgress after every click (see saveSoon).
function showProgress(){refresh();}

/* ---- practise the ticked equations ---- */
const prRows=()=>pick.order.map(id=>ROWS.find(r=>r.id===id)).filter(r=>r&&visible(r));
function showPractice(){
  ROWS.forEach(r=>r.els.forEach(a=>a._home.appendChild(a)));
  const list=byId('pr-list');list.innerHTML='';
  prRows().forEach(r=>{
    const box=mk('div','pr-row');
    box.appendChild(mk('p','pr-from',r.unit+' · from the <a href="'+r.href+'">'+r.src+' workout</a>'));
    r.els.forEach(a=>box.appendChild(a));list.appendChild(box);
  });
  byId('chooser').hidden=true;byId('practice').hidden=false;activeTab='practice';refresh();
}
function startPractice(){
  const on=ROWS.filter(r=>isOn(r)&&visible(r));if(!on.length)return;
  pick.order=(pick.mix?shuffle(on):on).map(r=>r.id);pick.view='practice';savePick();
  showPractice();window.scrollTo(0,0);byId('pr-title').focus({preventScroll:true});
  on.forEach(r=>{try{window.pwCountTab&&pwCountTab(r.id,r.label);}catch(e){}});
}
function showChooser(){
  pick.view='choose';savePick();activeTab='choose';
  byId('practice').hidden=true;byId('chooser').hidden=false;refresh();
  window.scrollTo(0,0);byId('ch-title').focus({preventScroll:true});
}
byId('ch-start').addEventListener('click',startPractice);
byId('pr-back').addEventListener('click',showChooser);
byId('pr-back2').addEventListener('click',showChooser);
byId('ch-none').addEventListener('click',()=>{pick.on=[];savePick();refresh();});
byId('ch-da').addEventListener('click',()=>{pick.da=!pick.da;savePick();refresh();});
byId('ch-mix').addEventListener('change',e=>{pick.mix=e.target.checked;savePick();});

/* ---- startup: put saved answers back, then open the view the student left ---- */
function readSaved(){try{const s=JSON.parse(localStorage.getItem(STORE_KEY)||'null');if(s&&typeof s==='object')return s;}catch(e){}return {};}
function start(data){
  const v=(data&&data.v)||{};
  games.forEach(g=>{if(v[g.key]&&typeof v[g.key]==='object'){try{g.setState(v[g.key]);}catch(e){console.error(e);}}});
  saveReady=true;activeTab='choose';
  if(pick.view==='practice'&&prRows().length)showPractice();else refresh();
  raf(loop);
}
start(readSaved());
})();
