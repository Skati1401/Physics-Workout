/* Teacher page (Alex, 24 Nov 2026). An animation page opened on its own (not ?embed in a workout) is for a teacher
   showing it on a projector: they know the physics, so the picture is the main display and the controls are small.
   teachPage() hides the Explore | Questions switch (the questions are for students, in the workout frame, which is not
   changed), adds a "Student version with questions" link, puts the note, readings, hint and working behind a Notes
   button (in a card under the stage), moves the choices into one strip under the picture (or onto it), and makes the
   picture as big as the window allows with its controls still on screen.
   o = {
     svg:    the picture (svg.view),
     mode:   id of the Explore | Questions switch,
     strip:  ids of choice blocks for the strip under the picture, in order (a .cgrid, or a label and its buttons in a div),
     pic:    ids of choice blocks the picture itself does in layout B,
     pin:    'tr' | 'tl' | 'br' | 'bl': layout B lays the pic blocks over that corner of the picture;
             'hide': layout B hides them, as the picture already does that job (e.g. click a bar or a planet),
     q:      {href, label} for the student version, or null,
     layout: 'a' | 'b' | 'c' (default 'b'); ?layout= overrides it,
     trial:  true shows a "Layout A | B | C" picker on the title line (while Alex compares),
     onLayout: function(L), called after each change of layout
   }
   A: all the choices in the strip. B: the pic blocks on the picture (or hidden), the rest in the strip. C: the choices in
   a narrow column beside the picture. Returns {fit, layout} or null in a frame. */
function teachPage(o){
  if(/[?&]embed\b/.test(location.search) || window.self!==window.top) return null;
  var $=function(id){ return document.getElementById(id); };
  var root=document.documentElement, svg=o.svg, stage=svg.closest('.stage'), left=svg.closest('.stage > *');
  var under=left.querySelector('.under'), side=stage.querySelector('.side'), head=document.querySelector('.page-head');
  var strip=(o.strip||[]).map($).filter(Boolean), pics=(o.pic||[]).map($).filter(Boolean), L='b';
  root.classList.add('teach');
  if(!$('teach-kit-css')){
    var st=document.createElement('style'); st.id='teach-kit-css';
    st.textContent=''
      +'.teach .page{max-width:1900px;padding-block:6px 24px;}'
      +'.teach .home-link{min-height:32px;margin:0;}'
      +'.teach .page-head{display:flex;flex-wrap:wrap;align-items:center;gap:6px 16px;margin-bottom:8px;}'
      +'.teach .page-head .eyebrow{display:none;}'
      +'.teach .page-head h1{font-size:26px;}'
      +'.tk-q{font:600 13px var(--font-mono,monospace);color:var(--topic,var(--accent));text-decoration:none;min-height:32px;display:inline-flex;align-items:center;}'
      +'.tk-q:hover{text-decoration:underline;}'
      +'.tk-lay{margin-left:auto;display:flex;align-items:center;gap:8px;font:12.5px var(--font-mono,monospace);color:var(--ink-soft);}'
      +'.tk-lay .seg button{min-height:32px;padding:4px 12px;}'
      +'.teach .stage{padding:12px;gap:12px 18px;grid-template-columns:minmax(0,1fr);}'
      +'.teach .view{max-height:none;}'
      +'.teach .side{display:none;}'
      +'.teach .under{margin-top:10px;gap:10px 20px;align-items:flex-end;}'
      +'.teach .under .sliders{flex:1 1 340px;}'
      +'.tk-strip{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:flex-end;}'
      +'.tk-strip:empty{display:none;}'
      +'.tk-strip>*{margin:0;}'
      +'.tk-pic{position:relative;margin-inline:auto;}'
      +'.tk-on{position:absolute;display:flex;flex-direction:column;gap:4px;padding:3px;border-radius:8px;background:color-mix(in srgb,var(--panel) 80%,transparent);max-width:calc(100% - 12px);}'
      +'.tk-on:empty{display:none;}'
      +'.tk-on.tr{top:6px;right:6px;align-items:flex-end;}.tk-on.tl{top:6px;left:6px;}.tk-on.br{bottom:6px;right:6px;align-items:flex-end;}.tk-on.bl{bottom:6px;left:6px;}'
      +'.tk-on .rowlab{display:none;}'
      +'.tk-on .cgrid.kit,.tk-on .cgrid.kit>.cgroup{gap:0;}'
      +'.tk-on .seg button{min-height:26px;padding:2px 8px;font-size:11.5px;}'
      +'.tk-on .seg{flex-wrap:wrap;justify-content:flex-end;}'
      +'.tk-notes{margin-top:12px;padding:14px;}'
      +'.tk-notes>div{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:10px 18px;align-items:start;}'
      +'.tk-notes .note{min-height:0;}'
      +'.lay-c .stage{grid-template-columns:minmax(0,1fr) 250px;}'
      +'.lay-c .side{display:flex;}'
      +'@media (max-width:860px){ .lay-c .stage{grid-template-columns:minmax(0,1fr);} }';
    document.head.appendChild(st);
  }
  // the title line: back link, title, student version, layout picker
  var home=document.querySelector('.home-link'); if(home && head) head.insertBefore(home, head.firstChild);
  if(o.q && head){ var a=document.createElement('a'); a.className='tk-q'; a.href=o.q.href; a.innerHTML=o.q.label||'Student version with questions &rarr;'; head.appendChild(a); }
  $(o.mode).hidden=true;                     // the Choice kit then hides "Try the questions" too
  // Notes: everything left in the side column that is not a choice
  var notes=document.createElement('div'); notes.className='card tk-notes'; notes.hidden=true;
  var inner=document.createElement('div'); notes.appendChild(inner);
  Array.prototype.slice.call(side.children).forEach(function(c){ if(c.id!==o.mode && strip.indexOf(c)<0 && pics.indexOf(c)<0) inner.appendChild(c); });
  stage.parentNode.insertBefore(notes, stage.nextSibling);
  var bg=under.querySelector('.btn-group'), nb=document.createElement('button');
  nb.className='btn'; nb.type='button'; nb.textContent='Notes'; nb.setAttribute('aria-expanded','false');
  var toq=bg.querySelector('.to-q'); bg.insertBefore(nb, toq||null);
  nb.addEventListener('click',function(){ notes.hidden=!notes.hidden; nb.setAttribute('aria-expanded',notes.hidden?'false':'true'); if(!notes.hidden) notes.scrollIntoView({block:'nearest'}); });
  // where the choices go
  var row=document.createElement('div'); row.className='tk-strip'; under.insertBefore(row, under.firstChild);
  var wrap=document.createElement('div'); wrap.className='tk-pic'; svg.parentNode.insertBefore(wrap, svg); wrap.appendChild(svg);
  var on=document.createElement('div'); on.className='tk-on '+(o.pin||'tr'); wrap.appendChild(on);
  function fit(){
    svg.style.maxHeight=''; wrap.style.maxWidth='';
    if(window.innerWidth<=560) return;
    var r=stage.getBoundingClientRect(), sv=svg.getBoundingClientRect(), rest=r.height-sv.height;
    if(L==='c') rest=Math.max(0, left.getBoundingClientRect().height-sv.height)+24;
    var mh=Math.max(260, Math.floor(window.innerHeight-(r.top+window.scrollY)-rest-12));
    svg.style.maxHeight=mh+'px';
    // the box round the picture is only as wide as the picture drawn, so anything laid on a corner stays on it
    var vb=svg.viewBox && svg.viewBox.baseVal;
    if(vb && vb.height) wrap.style.maxWidth=Math.floor(mh*vb.width/vb.height)+'px';
  }
  function layout(x){
    L=x; root.classList.remove('lay-a','lay-b','lay-c'); root.classList.add('lay-'+x);
    var hide=x==='b' && o.pin==='hide';
    if(x==='c'){ strip.concat(pics).forEach(function(e){ side.appendChild(e); }); }
    else{
      strip.forEach(function(e){ row.appendChild(e); });
      pics.forEach(function(e){ (x==='b' && !hide ? on : row).appendChild(e); });
    }
    pics.forEach(function(e){ e.style.display=hide?'none':''; });
    if(lp) Array.prototype.forEach.call(lp.querySelectorAll('button'),function(b){ b.setAttribute('aria-pressed',b.getAttribute('data-l')===x?'true':'false'); });
    if(o.trial){ try{ var u=new URL(location.href); u.searchParams.set('layout',x); history.replaceState(null,'',u.href); }catch(e){} }
    if(o.onLayout) o.onLayout(x);
    fit();
  }
  var lp=null;
  if(o.trial && head){
    lp=document.createElement('div'); lp.className='tk-lay';
    lp.innerHTML='<span id="tk-lay-lab">Layout</span><div class="seg pick fit" role="group" aria-labelledby="tk-lay-lab"><button type="button" data-l="a">A</button><button type="button" data-l="b">B</button><button type="button" data-l="c">C</button></div>';
    head.appendChild(lp);
    lp.addEventListener('click',function(e){ var b=e.target.closest('button'); if(b) layout(b.getAttribute('data-l')); });
  }
  layout((location.search.match(/[?&]layout=([abc])\b/)||[])[1]||o.layout||'b');
  window.addEventListener('resize',fit); window.addEventListener('load',fit); setTimeout(fit,0);
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  if(window.ResizeObserver) new ResizeObserver(function(){ requestAnimationFrame(fit); }).observe(under);
  return {fit:fit, layout:function(){ return L; }};
}
