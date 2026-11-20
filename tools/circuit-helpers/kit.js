function wire(pts, col, w){ return '<polyline points="'+pts.map(function(p){ return f1(p[0])+','+f1(p[1]); }).join(' ')+'" fill="none" stroke="'+(col||'var(--ink)')+'" stroke-width="'+(w||1.8)+'" stroke-linejoin="round"/>'; }
function jdot(x,y){ return '<circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="2.8" fill="var(--ink)"/>'; }
// a cell: long thin plate (+) on the left, short thick plate (−) on the right; wires meet the plates at x−4 and x+4
function cellH(x,y,flip){
  var a=flip?x+4:x-4, b=flip?x-4:x+4;
  return ln(a,y-15,a,y+15,'var(--ink)',1.8)+ln(b,y-8,b,y+8,'var(--ink)',4.5);
}
function cellV(x,y){ return ln(x-15,y-4,x+15,y-4,'var(--ink)',1.8)+ln(x-8,y+4,x+8,y+4,'var(--ink)',4.5); }   // + at the top
function resH(x,y,w,h,fill){ w=w||44; h=h||16; return '<rect x="'+f1(x-w/2)+'" y="'+f1(y-h/2)+'" width="'+w+'" height="'+h+'" fill="'+(fill||'var(--panel)')+'" stroke="var(--ink)" stroke-width="1.8"/>'; }
function resV(x,y,w,h,fill){ w=w||16; h=h||44; return '<rect x="'+f1(x-w/2)+'" y="'+f1(y-h/2)+'" width="'+w+'" height="'+h+'" fill="'+(fill||'var(--panel)')+'" stroke="var(--ink)" stroke-width="1.8"/>'; }
function meter(cx,cy,l,hi){ return '<circle cx="'+f1(cx)+'" cy="'+f1(cy)+'" r="13" fill="var(--panel)" stroke="'+(hi?'var(--topic)':'var(--ink)')+'" stroke-width="'+(hi?2.4:1.8)+'"/>'+txt(cx,cy+4.5,l,{a:'middle',fs:13,w:600,c:'var(--ink)'}); }
function lampH(x,y,glow){
  var g='';
  if(glow>0.02) g+='<circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="'+f1(13+12*glow)+'" fill="#facc15" opacity="'+(0.15+0.45*glow).toFixed(2)+'"/>';
  return g+'<circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="12" fill="var(--panel)" stroke="var(--ink)" stroke-width="1.8"/>'+ln(x-8.5,y-8.5,x+8.5,y+8.5,'var(--ink)',1.6)+ln(x-8.5,y+8.5,x+8.5,y-8.5,'var(--ink)',1.6);
}
function diodeH(x,y){   // conducts left to right
  return '<path d="M'+f1(x-9)+','+f1(y-10)+' L'+f1(x+9)+','+f1(y)+' L'+f1(x-9)+','+f1(y+10)+' Z" fill="var(--panel)" stroke="var(--ink)" stroke-width="1.8"/>'+ln(x+9,y-11,x+9,y+11,'var(--ink)',2.2);
}
function ldrV(x,y){   // resistor in a circle with two arrows coming in
  return '<circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="26" fill="var(--panel)" stroke="var(--ink)" stroke-width="1.6"/>'+resV(x,y,14,36)+
    '<path d="M'+f1(x-44)+','+f1(y-30)+' L'+f1(x-24)+','+f1(y-14)+' M'+f1(x-46)+','+f1(y-16)+' L'+f1(x-26)+','+f1(y)+'" stroke="var(--ink)" stroke-width="1.5" marker-end="url(#ah-ink)"/>';
}
function thermV(x,y){ return resV(x,y)+'<path d="M'+f1(x-20)+','+f1(y+20)+' H'+f1(x-14)+' L'+f1(x+14)+','+f1(y-18)+'" fill="none" stroke="var(--ink)" stroke-width="1.5"/>'; }
function switchH(x,y,open){   // contacts at x−14 and x+14
  return '<circle cx="'+f1(x-14)+'" cy="'+f1(y)+'" r="3" fill="var(--panel)" stroke="var(--ink)" stroke-width="1.6"/><circle cx="'+f1(x+14)+'" cy="'+f1(y)+'" r="3" fill="var(--panel)" stroke="var(--ink)" stroke-width="1.6"/>'+
    (open ? ln(x-12,y-1,x+11,y-14,'var(--ink)',1.8) : ln(x-12,y-1,x+12,y-2,'var(--ink)',1.8));
}
function arrowDefs(){
  return '<defs><marker id="ah-ink" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--ink)"/></marker>'+
    '<marker id="ah-top" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--topic)"/></marker></defs>';
}
// Current shown as dots moving along a path: the dots keep their spacing, so the number passing a
// point each second is proportional to the current (more dots per second in a bigger current).
function pointAt(pts, s){
  for(var i=1;i<pts.length;i++){
    var d=Math.hypot(pts[i][0]-pts[i-1][0], pts[i][1]-pts[i-1][1]);
    if(s<=d || i===pts.length-1){ var t=d?Math.min(1,s/d):0; return [pts[i-1][0]+(pts[i][0]-pts[i-1][0])*t, pts[i-1][1]+(pts[i][1]-pts[i-1][1])*t]; }
    s-=d;
  }
  return pts[0];
}
function flow(pts, dist, spacing, col){
  // dist: how far the charge has moved along this path (grows with I × time); negative runs backwards
  spacing=spacing||18; var L=pathLen(pts), g='';
  if(L<1) return '';
  var off=((dist%spacing)+spacing)%spacing;
  for(var s=off; s<L; s+=spacing){ var p=pointAt(pts,s); g+='<circle cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" r="2.6" fill="'+(col||'var(--cur)')+'"/>'; }
  return g;
}
// Pointer position in the SVG's own units
function svgPoint(svg, e){ var p=svg.createSVGPoint(); p.x=e.clientX; p.y=e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); }
// Drag something in the picture: o.hit(q) says whether the press grabbed it, o.move(q) moves it, o.ok() allows it now.
function svgDrag(svg, o){
  var on=false, ctm=null;
  svg.addEventListener('pointerdown', function(e){
    if(o.ok && !o.ok()) return;
    var q=svgPoint(svg,e); if(!o.hit(q)) return;
    on=true; ctm=svg.getScreenCTM().inverse();   // freeze the scale while dragging
    svg.setPointerCapture(e.pointerId); svg.classList.add('dragging'); e.preventDefault();
    if(o.start) o.start(q);
  });
  svg.addEventListener('pointermove', function(e){ if(!on) return; var p=svg.createSVGPoint(); p.x=e.clientX; p.y=e.clientY; o.move(p.matrixTransform(ctm)); });
  function end(){ if(!on) return; on=false; svg.classList.remove('dragging'); if(o.end) o.end(); }
  svg.addEventListener('pointerup', end); svg.addEventListener('pointercancel', end);
}
// Graph axes. G = {x,y,w,h} in SVG units; a = {x0,x1,xs,y0,y1,ys,xl,yl,dpx,dpy,lx,ly}
function gx(G,a,v){ return G.x+(v-a.x0)/(a.x1-a.x0)*G.w; }
function gy(G,a,v){ return G.y+G.h-(v-a.y0)/(a.y1-a.y0)*G.h; }
function axes(G,a){
  var g='', v, i;
  for(v=a.x0, i=0; v<=a.x1+1e-9; v+=a.xs, i++){ var X=gx(G,a,v); g+=ln(X,G.y,X,G.y+G.h,'var(--panel-border)',1); if(!a.lx || i%a.lx===0) g+=txt(X, G.y+G.h+17, sn(v,a.dpx||0), {a:'middle',fs:11,c:'var(--ink-faint)'}); }
  for(v=a.y0, i=0; v<=a.y1+1e-9; v+=a.ys, i++){ var Y=gy(G,a,v); g+=ln(G.x,Y,G.x+G.w,Y,'var(--panel-border)',1); if(!a.ly || i%a.ly===0) g+=txt(G.x-6, Y+3.5, sn(v,a.dpy||0), {a:'end',fs:11,c:'var(--ink-faint)'}); }
  var X0 = a.x0<0 && a.x1>0 ? gx(G,a,0) : G.x, Y0 = a.y0<0 && a.y1>0 ? gy(G,a,0) : G.y+G.h;
  g+=ln(X0,G.y,X0,G.y+G.h,'var(--ink-soft)',2)+ln(G.x,Y0,G.x+G.w,Y0,'var(--ink-soft)',2);
  g+=txt(G.x, G.y-9, a.yl, {fs:12})+txt(G.x+G.w/2, G.y+G.h+33, a.xl, {a:'middle',fs:12});
  return g;
}
function inBox(a,u,v){ return u>=a.x0-1e-9 && u<=a.x1+1e-9 && v>=a.y0-1e-9 && v<=a.y1+1e-9; }
function curve(G,a,fn,u0,u1,col,dash,n){
  var pts=[]; n=n||160;
  for(var k=0;k<=n;k++){ var u=u0+(u1-u0)*k/n, w=fn(u); if(isFinite(w) && inBox(a,u,w)) pts.push(f1(gx(G,a,u))+','+f1(gy(G,a,w))); }
  return pts.length>1 ? '<polyline points="'+pts.join(' ')+'" fill="none" stroke="'+col+'" stroke-width="'+(dash?1.8:2.4)+'"'+(dash?' stroke-dasharray="5 4"':'')+'/>' : '';
}
function pdot(G,a,u,v,col){ return inBox(a,u,v) ? '<circle cx="'+f1(gx(G,a,u))+'" cy="'+f1(gy(G,a,v))+'" r="5" fill="'+(col||'var(--topic)')+'" stroke="var(--panel)" stroke-width="2"/>' : ''; }
// A tidy axis: max and step for a range 0..v, about n steps
function niceAxis(v, n){
  n=n||5; if(v<=0) v=1;
  var raw=v/n, p=Math.pow(10,Math.floor(Math.log10(raw))), m=raw/p;
  var st=(m<=1?1:m<=2?2:m<=2.5?2.5:m<=5?5:10)*p;
  return {max:Math.ceil(v/st-1e-9)*st, step:st, dp:Math.max(0,-Math.floor(Math.log10(st)+1e-9)+(st/p===2.5?1:0))};
}
function stat(lab, val, hi){ return '<div class="stat'+(hi?' hi':'')+'"><small>'+lab+'</small><strong>'+val+'</strong></div>'; }
// The level switch (IGCSE | IAL | IB): opens on the level of the list the page came from
function levelGroup(el, onPick){
  var sg=segGroup(el, onPick);
  if(PW_LEVEL && el.querySelector('[data-v="'+PW_LEVEL+'"]')) sg.pick(PW_LEVEL);
  return sg;
}
// keyboard for a focusable picture that sets one value: arrows, Page Up/Down, Home/End
function keySlider(svg, get, set, step0, big0, min, max0, ok){
  var step, big, max;
  svg.addEventListener('keydown', function(e){
    if(ok && !ok()) return;
    var k=e.key, v=null, x=get(); var F=function(q){ return typeof q==='function'?q():q; }; step=F(step0); big=F(big0); max=F(max0);
    if(k==='ArrowRight'||k==='ArrowUp') v=x+step; else if(k==='ArrowLeft'||k==='ArrowDown') v=x-step;
    else if(k==='PageUp') v=x+big; else if(k==='PageDown') v=x-big; else if(k==='Home') v=min; else if(k==='End') v=max;
    if(v!==null){ set(Math.max(min,Math.min(max,v))); e.preventDefault(); }
  });
}
// Play runs the current dots for at most 30 s, then pauses (nothing loops forever)
var RUN_MAX=30, runFor=0;
