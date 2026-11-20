function f1(n){ return (+n).toFixed(1); }
function pts(list){ return list.map(function(p){ return f1(p[0])+','+f1(p[1]); }).join(' '); }
function pl(list,col,w,extra){ return '<polyline points="'+pts(list)+'" fill="none" stroke="'+col+'" stroke-width="'+w+'" stroke-linecap="round" stroke-linejoin="round"'+(extra||'')+'/>'; }
function pg(list,fill,extra){ return '<polygon points="'+pts(list)+'" fill="'+fill+'"'+(extra||'')+'/>'; }
function ln(x1,y1,x2,y2,col,w,extra){ return '<line x1="'+f1(x1)+'" y1="'+f1(y1)+'" x2="'+f1(x2)+'" y2="'+f1(y2)+'" stroke="'+col+'" stroke-width="'+(w||1)+'"'+(extra||'')+'/>'; }
function rect(x,y,w,h,fill,extra){ return '<rect x="'+f1(x)+'" y="'+f1(y)+'" width="'+f1(Math.max(0,w))+'" height="'+f1(Math.max(0,h))+'" fill="'+fill+'"'+(extra||'')+'/>'; }
// text in clear space: halo:1 gives it a panel-coloured edge so a line passing behind never cuts a letter
function txt(x,y,s,o){ o=o||{}; return '<text x="'+f1(x)+'" y="'+f1(y)+'"'+(o.a?' text-anchor="'+o.a+'"':'')+' font-size="'+(o.fs||12)+'" fill="'+(o.c||'var(--ink-soft)')+'"'+(o.w?' font-weight="'+o.w+'"':'')+(o.halo?' paint-order="stroke" stroke="var(--panel)" stroke-width="4" stroke-linejoin="round"':'')+(o.x||'')+'>'+s+'</text>'; }
// a solid block: front face at (x, y), w wide and h tall, going back by (dx, dy). Lit top, plain front, darker side.
function box(x,y,w,h,dx,dy,col,o){ o=o||{};
  return pg([[x,y],[x+w,y],[x+w+dx,y+dy],[x+dx,y+dy]],o.top||col)+(o.top?'':pg([[x,y],[x+w,y],[x+w+dx,y+dy],[x+dx,y+dy]],'#fff',' opacity=".38"'))+
    pg([[x+w,y],[x+w+dx,y+dy],[x+w+dx,y+h+dy],[x+w,y+h]],o.side||col)+(o.side?'':pg([[x+w,y],[x+w+dx,y+dy],[x+w+dx,y+h+dy],[x+w,y+h]],'#000',' opacity=".28"'))+
    rect(x,y,w,h,col); }
// a round bar or post: a dark core with a lighter streak along it
function tube(x1,y1,x2,y2,w,col,hi){ var L=Math.hypot(x2-x1,y2-y1)||1, nx=-(y2-y1)/L*w*0.22, ny=(x2-x1)/L*w*0.22; if(ny>0){ nx=-nx; ny=-ny; }
  return ln(x1,y1,x2,y2,col,w,' stroke-linecap="round"')+ln(x1+nx,y1+ny,x2+nx,y2+ny,hi,Math.max(0.8,w*0.3),' stroke-linecap="round"'); }
function wrapLines(s,n){ var out=[], cur=''; String(s).split(' ').forEach(function(w){ if(cur && (cur+' '+w).length>n){ out.push(cur); cur=w; } else cur=cur?cur+' '+w:w; }); if(cur) out.push(cur); return out; }
function onPick(svg, fn){
  svg.addEventListener('click', function(e){ var t=e.target.closest('.pick'); if(t){ fn(t.getAttribute('data-pick')); } });
  svg.addEventListener('keydown', function(e){ if(e.key!=='Enter' && e.key!==' ') return; var t=e.target.closest('.pick'); if(t){ e.preventDefault(); fn(t.getAttribute('data-pick')); } });
}
function setKeepFocus(el, html){ var f=document.activeElement, k=f && el.contains(f) ? f.getAttribute('data-pick') : null; el.innerHTML=html;
  if(k!==null){ var n=el.querySelector('.pick[data-pick="'+k+'"]'); if(n && n.focus) n.focus(); } }
function ell(cx,cy,rx,ry,fill,extra){ return '<ellipse cx="'+f1(cx)+'" cy="'+f1(cy)+'" rx="'+f1(rx)+'" ry="'+f1(ry)+'" fill="'+fill+'"'+(extra||'')+'/>'; }
// a solid arrow from (x1, y1) to its tip at (x2, y2)
function arrow(x1,y1,x2,y2,col,w,extra){ var a=Math.atan2(y2-y1,x2-x1), s=w*2.2, bx=x2-Math.cos(a)*s*1.5, by=y2-Math.sin(a)*s*1.5;
  return '<g'+(extra||'')+'>'+ln(x1,y1,bx,by,col,w)+'<path d="M'+f1(x2)+','+f1(y2)+' L'+f1(bx-Math.sin(a)*s)+','+f1(by+Math.cos(a)*s)+' L'+f1(bx+Math.sin(a)*s)+','+f1(by-Math.cos(a)*s)+' z" fill="'+col+'"/></g>'; }
// an upright cylinder (a can, a beaker of liquid): top ellipse at yt, bottom at yb. o.top fills the top; o.hi adds a streak of light.
function cyl(cx,yt,yb,rx,ry,fill,o){ o=o||{};
  return '<path d="M'+f1(cx-rx)+','+f1(yt)+' L'+f1(cx-rx)+','+f1(yb)+' A'+f1(rx)+','+f1(ry)+' 0 0 0 '+f1(cx+rx)+','+f1(yb)+' L'+f1(cx+rx)+','+f1(yt)+' z" fill="'+fill+'"'+(o.extra||'')+'/>'+
    '<path d="M'+f1(cx+rx*0.45)+','+f1(yt)+' L'+f1(cx+rx*0.45)+','+f1(yb+ry*0.85)+' A'+f1(rx)+','+f1(ry)+' 0 0 0 '+f1(cx+rx)+','+f1(yb)+' L'+f1(cx+rx)+','+f1(yt)+' z" fill="#000" opacity="'+(o.shade==null?0.16:o.shade)+'"/>'+
    (o.hi?ln(cx-rx*0.62,yt+ry+4,cx-rx*0.62,yb-2,o.hi,Math.max(1.6,rx*0.11),' stroke-linecap="round" opacity="'+(o.hiop||0.7)+'"'):'')+
    ell(cx,yt,rx,ry,o.top||fill,o.topx||'')+(o.top?'':ell(cx,yt,rx,ry,'#fff',' opacity=".3"')); }
// a glass thermometer standing upright: bulb at (x, yb); the scale runs from t0 at y0 up to t1 at y1, and the thread stands at T.
// o.step: a tick every so many degrees; o.num: a number every so many; o.side: numbers on the right (1) or the left (-1); o.from: first tick;
// o.nobulb: the bulb is out of sight, inside a can or a cube
function thermo(x,yb,y0,t0,y1,t1,T,o){ o=o||{};
  var w=o.w||7, yT=y1-9, sc=(y1-y0)/(t1-t0), yy=function(t){ return y0+(t-t0)*sc; }, side=o.side||1, fs=o.fs||11, g='', t;
  g+=rect(x-w/2,yT,w,yb-yT,'var(--thermo)',' rx="'+f1(w/2)+'" stroke="var(--ink-faint)" stroke-width="1"');
  g+=ln(x,yb,x,yy(Math.max(t0-4,Math.min(t1+2,T))),'var(--thread)',w*0.36,' stroke-linecap="round"');
  if(!o.nobulb) g+='<circle cx="'+f1(x)+'" cy="'+f1(yb)+'" r="'+f1(w*0.9)+'" fill="var(--thread)" stroke="var(--ink-faint)" stroke-width="0.8"/>'+ell(x-w*0.3,yb-w*0.3,w*0.22,w*0.22,'#fff',' opacity=".7"');
  for(t=(o.from==null?t0:o.from); t<=t1+1e-9; t+=(o.step||10)){ var big=!(Math.round(t)%(o.num||20));
    g+=ln(x+side*w/2,yy(t),x+side*(w/2+(big?7:4)),yy(t),'var(--ink-soft)',big?1.3:0.9);
    if(big && !o.nonum) g+=txt(x+side*(w/2+10),yy(t)+fs*0.36,String(Math.round(t)),{a:side>0?'start':'end',fs:fs,c:'var(--ink)'}); }
  return g; }
// a stopwatch showing s (for example 1:37)
function stopwatch(x,y,s,k){ k=k||1; var w=78*k, h=40*k;
  return rect(x+w/2-7*k,y-7*k,14*k,9*k,'var(--steel-sh,#3f4a5e)',' rx="2"')+rect(x,y,w,h,'var(--case,#3f4a5e)',' rx="'+f1(9*k)+'"')+rect(x+2,y+2,w-4,h*0.4,'#fff',' rx="'+f1(8*k)+'" opacity=".12"')+
    rect(x+7*k,y+8*k,w-14*k,h-16*k,'var(--panel)',' rx="3"')+txt(x+w/2,y+h/2+5.5*k,s,{a:'middle',fs:15*k,c:'var(--ink)',w:600}); }
