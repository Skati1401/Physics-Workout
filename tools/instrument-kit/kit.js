// Bench instruments drawn straight on for pictures of circuits: a digital meter, a supply, leads that hang, current arrows.
// It needs the solid kit above (pg, pl, ln, rect, txt, ell). tri and flowMarks are the 3D kit's (dc-motor.html), flowPath is electromagnets.html's.
// a solid arrowhead with its tip at (x, y), pointing along ang (degrees, screen)
function tri(x,y,ang,size,col,extra){ return '<path d="M0,0 L'+(-size*1.7).toFixed(1)+','+(size*0.8).toFixed(1)+' L'+(-size*1.7).toFixed(1)+','+(-size*0.8).toFixed(1)+' z" transform="translate('+x.toFixed(1)+','+y.toFixed(1)+') rotate('+ang.toFixed(1)+')" fill="'+col+'"'+(extra||'')+'/>'; }
// small arrowheads that travel along a wire the way the (conventional) current flows; pts are screen points
function flowMarks(pts, phase, gap, size){
  var g='', d=[], tot=0, i;
  for(i=1;i<pts.length;i++){ var l=Math.hypot(pts[i][0]-pts[i-1][0], pts[i][1]-pts[i-1][1]); d.push(l); tot+=l; }
  for(var s=((phase%gap)+gap)%gap; s<tot; s+=gap){
    var acc=0; for(i=0;i<d.length;i++){ if(s<=acc+d[i]) break; acc+=d[i]; }
    if(i>=d.length || d[i]<0.5) continue;
    var u=(s-acc)/d[i], a=pts[i], b=pts[i+1];
    g+=tri(a[0]+(b[0]-a[0])*u+0, a[1]+(b[1]-a[1])*u+0, Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI, size, 'var(--cur)', ' stroke="var(--panel)" stroke-width="0.8" stroke-linejoin="round"');
  }
  return g;
}
function pathLen(p){ var t=0; for(var j=1;j<p.length;j++) t+=Math.hypot(p[j][0]-p[j-1][0],p[j][1]-p[j-1][1]); return t; }
// A path is a list of pieces [points, visible]: the current arrows are drawn on the visible pieces only (not inside a meter or a cell),
// in step along the whole path. back turns the current round.
function flowPath(pieces, phase, gap, size, back){
  var g='', list=pieces, acc=0;
  pieces.forEach(function(p){ p.len=pathLen(p[0]); });
  if(back) list=pieces.slice().reverse();
  list.forEach(function(p){ var q=back?p[0].slice().reverse():p[0]; if(p[1]) g+=flowMarks(q, phase-acc, gap, size); acc+=p.len; });
  return g;
}
// points along a lead that hangs from a to b: its middle hangs sag below the straight line
function hang(a,b,sag,n){ n=n||14; var c=[(a[0]+b[0])/2,(a[1]+b[1])/2+2*sag], out=[];
  for(var i=0;i<=n;i++){ var t=i/n, u=1-t; out.push([u*u*a[0]+2*u*t*c[0]+t*t*b[0], u*u*a[1]+2*u*t*c[1]+t*t*b[1]]); } return out; }
// points along a curved lead from a to b, pulled towards c1 then c2
function bez(a,c1,c2,b,n){ n=n||20; var out=[];
  for(var i=0;i<=n;i++){ var t=i/n, u=1-t, k0=u*u*u, k1=3*u*u*t, k2=3*u*t*t, k3=t*t*t; out.push([k0*a[0]+k1*c1[0]+k2*c2[0]+k3*b[0], k0*a[1]+k1*c1[1]+k2*c2[1]+k3*b[1]]); } return out; }
// an insulated lead with a streak of light along it
function lead(list,col,w){ w=w||3.4; return pl(list,col||'var(--lead)',w)+pl(list.map(function(q){ return [q[0]-0.5,q[1]-0.8]; }),'var(--lead-hi)',Math.max(0.9,w*0.3),' opacity=".85"'); }
// a bare metal wire or rod with a streak of light
function rod(list,col,hi,w){ return pl(list,col,w)+pl(list.map(function(q){ return [q[0]-0.3,q[1]-w*0.22]; }),hi,Math.max(0.7,w*0.3),' opacity=".9"'); }
// the soft shadow an object throws on the bench: under its base, which runs from x to x + w at height y
function shadow(x,y,w,h){ return ell(x+w/2+5,y+1,w/2+7,h||4.5,'#000',' opacity=".09"'); }
// a terminal: a brass stud, or a coloured socket
function stud(x,y,col){ return '<circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="3.6" fill="'+(col||'var(--brass)')+'" stroke="var(--case-s)" stroke-width="0.8"/><circle cx="'+f1(x-0.9)+'" cy="'+f1(y-1)+'" r="1.1" fill="#fff" opacity=".6"/>'; }
// the case of an instrument that faces you: a front, a lit top and a darker right-hand side
function icase(x,t,w,h,o){ o=o||{}; var ex=10, ey=-9;
  return pg([[x+3,t+6],[x+3+ex,t+ey],[x+w+ex,t+ey],[x+w-3,t+6]],o.top||'var(--case-t)')+
    pg([[x+w-6,t+3],[x+w+ex,t+ey],[x+w+ex,t+h+ey-4],[x+w-6,t+h-3]],o.side||'var(--case-s)')+
    rect(x,t,w,h,o.front||'var(--case-f)',' rx="7" stroke="'+(o.side||'var(--case-s)')+'" stroke-width="1.2"'); }
// A digital meter with a terminal on each side. M = {cx, top, w, h}. dmmGeom gives where the leads plug in (l and r).
// o.text is the reading on the display and o.unit comes after it; o.letter is printed on the case (A, V, μA); o.tl and o.tr colour the terminals.
// M.posts = [x1, x2] puts the two terminals on top of the case instead, at those x positions (a supply that stands under what it feeds).
function dmmGeom(M){ var x=M.cx-M.w/2, y=M.top+M.h*0.7;
  return M.posts ? {l:[M.posts[0],M.top-14], r:[M.posts[1],M.top-14], x:x, base:M.top+M.h} : {l:[x-10,y], r:[x+M.w+13,y-3], x:x, base:M.top+M.h}; }
function dmm(M,o){ o=o||{}; var x=M.cx-M.w/2, t=M.top, w=M.w, h=M.h, T=dmmGeom(M), lh=Math.round(h*0.42), g='';
  g+=shadow(x,t+h,w);
  if(M.posts){ g+=icase(x,t,w,h,o); [[T.l,o.tl||'var(--plug-r)'],[T.r,o.tr||'var(--plug-k)']].forEach(function(e){
    g+=rect(e[0][0]-4.5,e[0][1],9,11,e[1],' rx="2"')+ell(e[0][0],e[0][1],4.5,2.2,'var(--case-t)'); }); }
  else g+=rect(T.l[0],T.l[1]-4,13,8,o.tl||'var(--plug-r)',' rx="2"')+icase(x,t,w,h,o)+rect(x+w+1,T.r[1]-4,12,8,o.tr||'var(--plug-k)',' rx="2"');
  g+=rect(x+6,t+8,w-12,lh,'var(--lcd)',' rx="3" stroke="var(--case-s)" stroke-width="1"');
  var ufs=String(o.unit||'').length>1?11:12, ux=x+w-10, uw=o.unit?(String(o.unit).length*ufs*0.62+3):0, by=t+8+lh/2+(o.fs||16)*0.36;
  g+=txt(ux-uw,by,o.text==null?'':o.text,{a:'end',fs:o.fs||16,w:600,c:'var(--lcd-ink)'});
  if(o.unit) g+=txt(ux,by,o.unit,{a:'end',fs:ufs,w:600,c:'var(--lcd-ink)'});
  g+='<circle cx="'+f1(x+w-18)+'" cy="'+f1(t+h-(h-lh-8)/2-1)+'" r="'+f1(Math.min(9,(h-lh-14)/2))+'" fill="var(--case-s)" stroke="var(--case-t)" stroke-width="1.2"/>'+
    ln(x+w-18,t+h-(h-lh-8)/2-1,x+w-18,t+h-(h-lh-8)/2-1-Math.min(8,(h-lh-16)/2),'var(--case-t)',1.6,' stroke-linecap="round"');
  if(o.letter) g+=txt(x+11,t+h-(h-lh-8)/2+5,o.letter,{fs:15,w:700,c:'#fff'});
  return g; }
// the picture is wide on a laptop (apparatus, then the graph and the exam diagram beside it) and tall on a phone (those go underneath)
function sizeView(svg, wide, tall){
  var w=svg.getBoundingClientRect().width, t=w>0 && w<520, L=t?tall:wide, vb='0 0 '+L.VW+' '+L.VH;
  if(svg.getAttribute('viewBox')!==vb){ svg.setAttribute('viewBox',vb); svg.classList.toggle('tall',t); }
  return L;
}
