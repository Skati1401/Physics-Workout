function pairPredicts(){
  const isPred=a=>a&&a.classList.contains('act')&&(($('.kind',a)||{}).textContent==='Predict');
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
