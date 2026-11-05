/* Core route: activities named in page.json "core" stay at the top of their tab, in their order; the rest of
   that tab's activities go into a closed "Extra practice" block under them. A tab with no core activities is an
   extra tab: its button moves after the core tabs, behind an "Extra practice" label. */
function applyCore(){
  if(!CORE)return;
  const missing=[];
  TAB_IDS.sort((a,b)=>(CORE[a]?0:1)-(CORE[b]?0:1));
  const nav=byId('tab-'+TAB_IDS[0]).parentNode;
  let sepAdded=false;
  TAB_IDS.forEach(t=>{
    const panel=byId('panel-'+t),btn=byId('tab-'+t),list=panel&&$('.acts',panel);if(!list)return;
    if(!CORE[t]){
      if(!sepAdded){nav.appendChild(mk('span','tabs-sep','Extra practice'));sepAdded=true;}
      nav.appendChild(btn);btn.classList.add('is-extra');panel.classList.add('is-extra');
      $('.panel-head',panel).insertAdjacentElement('afterend',mk('p','extra-note','Extra practice: not part of the core route. Use it to go further, or to revise.'));
      return;
    }
    nav.appendChild(btn);
    const want=CORE[t],found={},extras=[];
    Array.from(list.children).forEach(a=>{
      if(!a.classList.contains('act'))return;
      if(want.indexOf(a.dataset.title)>=0)found[a.dataset.title]=1;else extras.push(a);
    });
    want.forEach(w=>{if(!found[w])missing.push(t+': '+w);});
    if(!extras.length)return;
    const d=mk('details','extra-block');
    d.innerHTML='<summary>Extra practice <span class="extra-n">'+extras.length+' more '+(extras.length>1?'activities':'activity')+', optional</span></summary>';
    const box=mk('div','acts');extras.forEach(a=>box.appendChild(a));d.appendChild(box);
    list.parentNode.insertBefore(d,list.nextSibling);
    d.addEventListener('toggle',()=>{if(d.open)raf(()=>reflowers.forEach(f=>{try{f(activeTab);}catch(e){console.error(e);}}));});
  });
  if(missing.length){window.__coreMissing=missing;console.warn('Core activities not found: '+missing.join(' | '));}
}
applyCore();
function pairPredicts(){
  const isPred=a=>a&&a.classList.contains('act')&&(($('.kind',a)||{}).textContent) in {'Predict':1,'Multiple choice':1};
  $$('.acts').forEach(list=>{
    Array.from(list.children).forEach(a=>{
      if(!isPred(a)||!a.parentNode||a.parentNode!==list)return;
      const b=a.nextElementSibling;if(!isPred(b))return;
      const pair=mk('div','act-pair');list.insertBefore(pair,a);pair.appendChild(a);pair.appendChild(b);
    });
  });
}
// Each line of a working readout becomes left | = | right, so the = signs sit under each other.
function alignEquals(el){
  if(el.querySelector('.eqg')) return;
  var rows = el.innerHTML.split(/<br\s*\/?>/i).map(function(line){
    var i = line.indexOf(' = ');
    if(i<0) return '<span class="eqg-full">'+line+'</span>';
    return '<span class="eqg-l">'+line.slice(0,i)+'</span><span class="eqg-m">=</span><span class="eqg-r">'+line.slice(i+3)+'</span>';
  });
  el.innerHTML = '<div class="eqg">'+rows.join('')+'</div>';
}
function watchEquals(sel){
  Array.prototype.forEach.call(document.querySelectorAll(sel), function(el){
    alignEquals(el);
    new MutationObserver(function(){ alignEquals(el); }).observe(el, {childList:true});
  });
}
pairPredicts();
watchEquals('.eq');
function applyTabUI(tab){
  TAB_IDS.forEach(id=>{const p=byId('panel-'+id);if(p)p.hidden=(id!==tab);});
  $$('.tab-btn').forEach(b=>{const on=b.dataset.tab===tab;b.classList.toggle('is-active',on);b.setAttribute('aria-selected',on?'true':'false');b.tabIndex=on?0:-1;});
  activeTab=tab;
  try{const b=byId('tab-'+tab),r=b&&b.parentNode;if(r&&r.scrollWidth>r.clientWidth)r.scrollLeft=b.offsetLeft-r.offsetLeft-32;}catch(e){}
  reflowers.forEach(f=>{try{f(tab);}catch(e){console.error(e);}});
  try{history.replaceState(null,'','#'+tab);}catch(e){}
  writeSave();
  try{const b=byId('tab-'+tab);window.pwCountTab&&pwCountTab(tab,b&&b.firstChild?b.firstChild.textContent.trim():tab);}catch(e){}
}
$$('.tab-btn').forEach(b=>b.addEventListener('click',()=>applyTabUI(b.dataset.tab)));
byId('tab-{{FIRST_TAB}}').parentNode.addEventListener('keydown',e=>{
  if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft')return;
  const i=TAB_IDS.indexOf(activeTab),n=(i+(e.key==='ArrowRight'?1:-1)+TAB_IDS.length)%TAB_IDS.length;
  applyTabUI(TAB_IDS[n]);byId('tab-'+TAB_IDS[n]).focus();
});
// The open tab is remembered in this browser only, so a reload returns to it.
// Answers and the open tab are remembered in this browser only, so a reload keeps them.
// OLD_STORE_KEY held only the open tab; it is read once so a returning student lands on the same tab.
function readSaved(){
  for(const k of [STORE_KEY,OLD_STORE_KEY]){
    try{const s=JSON.parse(localStorage.getItem(k)||'null');if(s&&typeof s==='object')return s;}catch(e){}
  }
  return {};
}
function start(data){
  const v=(data&&data.v)||{};
  games.forEach(g=>{if(v[g.key]&&typeof v[g.key]==='object'){try{g.setState(v[g.key]);}catch(e){console.error(e);}}});
  saveReady=true;showProgress(false);
  // a #tab link opens that tab, ahead of the tab remembered in this browser
  let t='';try{t=location.hash.slice(1);}catch(e){}
  if(TAB_IDS.indexOf(t)<0)t=data&&data.tab;
  if(TAB_IDS.indexOf(t)<0)t='{{FIRST_TAB}}';
  applyTabUI(t);raf(loop);
}
start(readSaved());
})();
</script>
