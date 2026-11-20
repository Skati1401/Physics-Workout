function P(list){ return list.map(function(q){ return q[0].toFixed(1)+','+q[1].toFixed(1); }).join(' '); }
function pl(list,col,w,extra){ return '<polyline points="'+P(list)+'" fill="none" stroke="'+col+'" stroke-width="'+w+'" stroke-linecap="round" stroke-linejoin="round"'+(extra||'')+'/>'; }
function pg(list,fill,stroke,extra){ return '<polygon points="'+P(list)+'" fill="'+fill+'" stroke="'+(stroke||fill)+'" stroke-width="1" stroke-linejoin="round"'+(extra||'')+'/>'; }
function pathLen(pts){ var t=0; for(var j=1;j<pts.length;j++) t+=Math.hypot(pts[j][0]-pts[j-1][0],pts[j][1]-pts[j-1][1]); return t; }
// break a sentence into lines of at most n characters
function wrapLines(s,n){ var out=[], cur=''; String(s).split(' ').forEach(function(w){ if(cur && (cur+' '+w).length>n){ out.push(cur); cur=w; } else cur=cur?cur+' '+w:w; }); if(cur) out.push(cur); return out; }
// The case of a bench instrument that faces you: a front, a lit top and a darker right-hand side.
function caseBox(x,t,w,h,front){ var ex=10, ey=-9;
  return pg([[x+3,t+6],[x+3+ex,t+ey],[x+w+ex,t+ey],[x+w-3,t+6]],'var(--brush-t)','var(--brush-s)')+
    pg([[x+w-6,t+3],[x+w+ex,t+ey],[x+w+ex,t+h+ey-4],[x+w-6,t+h-3]],'var(--brush-s)','var(--brush-s)')+
    '<rect x="'+x+'" y="'+t+'" width="'+w+'" height="'+h+'" rx="7" fill="'+(front||'var(--brush-f)')+'" stroke="var(--brush-s)" stroke-width="1.2"/>'; }
// A bench meter: a case, a dial with a scale and a needle, and two terminals (on top, or on its left side with M.posts = 'left').
// M = {cx, top, w, h}. The needle turns about (px, py); span is the angle (degrees) of full scale either side of zero.
function meterGeom(M){ var ex=10, ey=-9, x=M.cx-M.w/2, left=M.posts==='left';
  return {cx:M.cx, top:M.top, w:M.w, h:M.h, ex:ex, ey:ey, px:M.cx, py:M.top+M.h-26, r:Math.min(M.w/2-22, M.h-42), span:M.span||55, left:left,
    tl:left?[x-10, M.top+M.h*0.25]:[M.cx-M.w*0.27+ex/2, M.top+ey/2-9], tr:left?[x-10, M.top+M.h*0.75]:[M.cx+M.w*0.27+ex/2, M.top+ey/2-9]}; }
function meterPt(m,deg,r){ return [m.px+r*Math.sin(deg*DEG), m.py-r*Math.cos(deg*DEG)]; }
// o.needle from -1 to 1; o.div divisions each side of zero (o.major: every so many is longer); o.labels [[-1..1, text]]; o.unit on the case; o.label under it
function meterBox(m, o){
  var x=m.cx-m.w/2, t=m.top, w=m.w, h=m.h, g='', k, a, p, q, div=o.div||4;
  if(m.left) [[m.tl,'var(--north-f)'],[m.tr,'var(--insul)']].forEach(function(e){
    g+='<rect x="'+e[0][0].toFixed(1)+'" y="'+(e[0][1]-4).toFixed(1)+'" width="12" height="8" rx="2" fill="'+e[1]+'"/>'; });
  else [[m.tl,'var(--north-f)'],[m.tr,'var(--insul)']].forEach(function(e){
    g+='<rect x="'+(e[0][0]-4.5).toFixed(1)+'" y="'+e[0][1].toFixed(1)+'" width="9" height="10" rx="2" fill="'+e[1]+'"/><ellipse cx="'+e[0][0].toFixed(1)+'" cy="'+e[0][1].toFixed(1)+'" rx="4.5" ry="2.2" fill="var(--brush-t)"/>'; });
  g+=caseBox(x,t,w,h);
  g+='<rect x="'+(x+8)+'" y="'+(t+8)+'" width="'+(w-16)+'" height="'+(h-30)+'" rx="4" fill="var(--panel)" stroke="var(--ink-faint)" stroke-width="1"/>';
  for(k=-div;k<=div;k++){ a=k/div*m.span; var big=(k%(o.major||1)===0); p=meterPt(m,a,m.r); q=meterPt(m,a,m.r-(big?8:5));
    g+=line(p[0].toFixed(1),p[1].toFixed(1),q[0].toFixed(1),q[1].toFixed(1),'var(--ink-soft)',k===0?2.2:(big?1.5:1)); }
  (o.labels||[]).forEach(function(e){ p=meterPt(m,e[0]*m.span,m.r-19); g+=txt(p[0].toFixed(1),(p[1]+4).toFixed(1),e[1],{a:'middle',fs:o.lfs||11,c:'var(--ink)'}); });
  if(o.needle!==null && o.needle!==undefined){ p=meterPt(m,Math.max(-1.06,Math.min(1.06,o.needle))*m.span,m.r-3);
    g+=line(m.px,m.py,p[0].toFixed(1),p[1].toFixed(1),'var(--accent)',2.6,' stroke-linecap="round"'); }
  g+='<circle cx="'+m.px+'" cy="'+m.py+'" r="3.6" fill="var(--ink)"/>';
  if(o.unit) g+=txt(m.cx,t+h-7,o.unit,{a:'middle',fs:12,c:'#fff',w:600});
  if(o.label) g+=txt(m.cx,t+h+16,o.label,{a:'middle',fs:12.5});
  return g;
}
// a slice of the dial between two needle angles (degrees)
function meterWedge(m,a0,a1){ var r=m.r+3, p=meterPt(m,a0,r), q=meterPt(m,a1,r);
  return 'M'+m.px+','+m.py+' L'+p[0].toFixed(1)+','+p[1].toFixed(1)+' A'+r+','+r+' 0 0 1 '+q[0].toFixed(1)+','+q[1].toFixed(1)+' Z'; }
// pointer position in SVG user units
function svgPoint(svg, e){ var r=svg.getBoundingClientRect(), vb=svg.viewBox.baseVal; return {x:vb.x+(e.clientX-r.left)/r.width*vb.width, y:vb.y+(e.clientY-r.top)/r.height*vb.height}; }
// things in the picture that are clicked to answer: one handler for mouse, touch and keyboard (Enter or Space)
function onPick(svg, fn){
  svg.addEventListener('click', function(e){ var t=e.target.closest('.pick'); if(t){ fn(t.getAttribute('data-pick')); } });
  svg.addEventListener('keydown', function(e){ if(e.key!=='Enter' && e.key!==' ') return; var t=e.target.closest('.pick'); if(t){ e.preventDefault(); fn(t.getAttribute('data-pick')); } });
}
// redraw a group without losing which pick has the keyboard focus
function setKeepFocus(el, html){ var f=document.activeElement, k=f && el.contains(f) ? f.getAttribute('data-pick') : null; el.innerHTML=html;
  if(k!==null){ var n=el.querySelector('.pick[data-pick="'+k+'"]'); if(n && n.focus) n.focus(); } }
