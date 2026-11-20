// One circuit drawn twice from the same data: built on the bench (seen from in front and above) and as the exam's circuit diagram.
// It needs the solid kit, the instrument kit and the circuit helpers.
// A circuit P = {cell:{x,y,h,kind}, nodes:{name:[x,y]}, edges:[…], vslots:[…], dots:[…]} in its own units (about 400 × 280).
//   edge  = {id, a, b, kind, path, at, h, slot, rd}: kind 'wire' or a component ('res','lamp','diode','var','ldr','therm','custom').
//           path may be a function of the state. slot is the place in a wire where a meter can go (in series).
//   vslot = {id, a, b, at, leads:[toA, toB], of}: the place for a meter across (in parallel with) the component "of".
// A state st = {placed:{slot:'A'|'V'}, cur:{id:amps}, dist:{id:px}, text:{slot:reading}, glow:{id:0..1}, psu, rev, slots, name(e), hi}.
// A view T = {x, y, sx, sy}: where the circuit's units go in the picture.
var EPS=1e-6, RVBIG=1e7;
function kMap(T,q){ return [T.x+q[0]*T.sx, T.y+q[1]*T.sy]; }
function kPts(T,list){ return list.map(function(q){ return kMap(T,q); }); }
function kPath(e,st){ return typeof e.path==='function' ? e.path(st) : e.path; }
function kEdge(P,id){ return P.edges.filter(function(e){ return e.id===id; })[0]; }
function kVslot(P,id){ return P.vslots.filter(function(s){ return s.id===id; })[0]; }
// a lead that turns its corners in a curve
function kRound(p,r){
  if(p.length<3) return p.slice();
  var out=[p[0]], i, k;
  for(i=1;i<p.length-1;i++){ var a=p[i-1], b=p[i], c=p[i+1], la=Math.hypot(a[0]-b[0],a[1]-b[1]), lc=Math.hypot(c[0]-b[0],c[1]-b[1]);
    if(la<0.5 || lc<0.5){ out.push(b); continue; }
    var rr=Math.min(r,la/2,lc/2), p1=[b[0]+(a[0]-b[0])/la*rr, b[1]+(a[1]-b[1])/la*rr], p2=[b[0]+(c[0]-b[0])/lc*rr, b[1]+(c[1]-b[1])/lc*rr];
    for(k=0;k<=4;k++){ var t=k/4, u=1-t; out.push([u*u*p1[0]+2*u*t*b[0]+t*t*p2[0], u*u*p1[1]+2*u*t*b[1]+t*t*p2[1]]); } }
  out.push(p[p.length-1]); return out;
}
// Nodal analysis: the cell holds node P at V and node N at 0. rOf(e) is a component's resistance. A meter in a gap or across a component
// is one more resistance: an ammeter almost none (o.ra), a voltmeter a very large one (o.rv; left out, an ideal voltmeter across takes no current).
function kSolve(P, V, rOf, placed, o){
  o=o||{}; placed=placed||{};
  var names=Object.keys(P.nodes), idx={}, edges=[];
  names.forEach(function(n,i){ idx[n]=i; });
  P.edges.forEach(function(e){ var m=placed[e.id], R = e.kind!=='wire' ? rOf(e) : m==='A' ? (o.ra||EPS) : m==='V' ? (o.rv||RVBIG) : EPS;
    edges.push({id:e.id, a:idx[e.a], b:idx[e.b], R:Math.max(R,EPS)}); });
  P.vslots.forEach(function(s){ var m=placed[s.id];
    if(m==='A') edges.push({id:s.id, a:idx[s.a], b:idx[s.b], R:o.ra||EPS}); else if(m==='V' && o.rv) edges.push({id:s.id, a:idx[s.a], b:idx[s.b], R:o.rv}); });
  var fixed={}; fixed[idx.P]=V; fixed[idx.N]=0;
  var unk=names.map(function(_,i){ return i; }).filter(function(i){ return !(i in fixed); }), col={};
  unk.forEach(function(i,k){ col[i]=k; });
  var m=unk.length, A=[], bv=[], i, c, r, k;
  for(i=0;i<m;i++){ A.push(new Array(m).fill(0)); bv.push(0); }
  edges.forEach(function(e){ var g=1/e.R;
    [[e.a,e.b],[e.b,e.a]].forEach(function(pq){ var p=pq[0], q=pq[1]; if(!(p in col)) return;
      A[col[p]][col[p]]+=g; if(q in col) A[col[p]][col[q]]-=g; else bv[col[p]]+=g*fixed[q]; }); });
  for(c=0;c<m;c++){   // Gaussian elimination with partial pivoting
    var piv=c; for(r=c+1;r<m;r++) if(Math.abs(A[r][c])>Math.abs(A[piv][c])) piv=r;
    var t=A[c]; A[c]=A[piv]; A[piv]=t; var tb=bv[c]; bv[c]=bv[piv]; bv[piv]=tb;
    for(r=c+1;r<m;r++){ var f=A[r][c]/A[c][c]; if(!f) continue; for(k=c;k<m;k++) A[r][k]-=f*A[c][k]; bv[r]-=f*bv[c]; } }
  var x=new Array(m);
  for(r=m-1;r>=0;r--){ var s=bv[r]; for(k=r+1;k<m;k++) s-=A[r][k]*x[k]; x[r]=s/A[r][r]; }
  var pot={}; names.forEach(function(nm,j){ pot[nm] = j in fixed ? fixed[j] : x[col[j]]; });
  var cur={}; edges.forEach(function(e){ cur[e.id]=(pot[names[e.a]]-pot[names[e.b]])/e.R; });
  var Isup=0; edges.forEach(function(e){ if(names[e.a]==='P') Isup+=cur[e.id]; if(names[e.b]==='P') Isup-=cur[e.id]; });
  // a short circuit: an ammeter across two points that plain wire (and ammeters) join straight to the two terminals of the cell
  var par={}; names.forEach(function(n){ par[n]=n; });
  function find(n){ while(par[n]!==n) n=par[n]; return n; }
  P.edges.forEach(function(e){ if(e.kind==='wire' && placed[e.id]!=='V') par[find(e.a)]=find(e.b); });
  var short=null;
  P.vslots.forEach(function(v){ if(placed[v.id]==='A'){ var fa=find(v.a), fb=find(v.b), fp=find('P'), fn=find('N'); if((fa===fp && fb===fn) || (fa===fn && fb===fp)) short=v.id; } });
  // a real supply has some resistance of its own (taken as 0.5 Ω here), so in a short circuit its p.d. collapses: scale everything down
  if(short){ var Rx=V/Isup, kk=Rx/(Rx+0.5); names.forEach(function(nm){ pot[nm]*=kk; }); Object.keys(cur).forEach(function(id){ cur[id]*=kk; }); Isup*=kk; }
  return {pot:pot, cur:cur, I:Isup, R:V/Isup, short:short};
}
// what a meter in a slot reads: an ammeter the current through itself, a voltmeter the p.d. between its two leads
function kReading(P, id, S, m){ var s=kVslot(P,id)||kEdge(P,id); return m==='A' ? Math.abs(S.cur[id]||0) : Math.abs(S.pot[s.a]-S.pot[s.b]); }
// which way a meter's leads run through it: up and down (true) or left to right
function kSlotV(P, id, st){
  var s=kVslot(P,id); if(s){ var q=s.leads[0][s.leads[0].length-1]; return Math.abs(q[0]-s.at[0])<1; }
  var e=kEdge(P,id), p=kPath(e,st), i; for(i=1;i<p.length;i++){ var a=p[i-1], b=p[i];
    if(Math.abs(a[0]-b[0])<1 && Math.abs(e.slot[0]-a[0])<1 && e.slot[1]>=Math.min(a[1],b[1])-1 && e.slot[1]<=Math.max(a[1],b[1])+1) return true; }
  return false;
}
function kSlotAt(P,id){ var s=kVslot(P,id); return s ? s.at : kEdge(P,id).slot; }

// ---- the parts as they stand on the bench
// a flat part on the bench: its top face, a darker front edge and a soft shadow
function kPlate(x,y,w,h,o){ o=o||{}; var d=o.d==null?5:o.d, r=o.r==null?4:o.r;
  return ell(x+w/2+3,y+h+d+1,w/2+3,3.6,'#000',' opacity=".1"')+rect(x,y+d,w,h,o.side||'var(--case-s)',' rx="'+r+'"')+rect(x,y,w,h,o.top||'var(--case-f)',' rx="'+r+'"')+
    rect(x+1.5,y+1.5,w-3,Math.min(5,h*0.3),'#fff',' rx="'+Math.max(1,r-1)+'" opacity=".16"'); }
function kWood(cx,cy,h,L,W){ var w=h?L:W, hh=h?W:L; return kPlate(cx-w/2,cy-hh/2,w,hh,{top:'var(--wood-t)',side:'var(--wood-s)'}); }
function kEnds(cx,cy,h,L){ var a=L/2-5; return h ? stud(cx-a,cy)+stud(cx+a,cy) : stud(cx,cy-a)+stud(cx,cy+a); }
function kTurn(cx,cy,h,s){ return '<g transform="rotate('+(h?0:90)+' '+f1(cx)+' '+f1(cy)+')">'+s+'</g>'; }
function kLegs(cx,cy,L){ return ln(cx-L/2+6,cy,cx+L/2-6,cy,'var(--steel)',2.2)+ln(cx-L/2+6,cy-0.7,cx+L/2-6,cy-0.7,'var(--steel-hi)',0.8); }
function kRes(cx,cy,h,o){ o=o||{}; var L=o.L||50;
  return kWood(cx,cy,h,L,24)+kTurn(cx,cy,h,kLegs(cx,cy,L)+rect(cx-13,cy-6.5,26,13,'var(--ceramic)',' rx="5.5" stroke="var(--steel-sh)" stroke-width="0.8"')+
    [['#7a4a21',-8],['#1b1b1b',-3.2],['#b3261e',1.6],['#c9a13b',7.4]].map(function(b){ return rect(cx+b[1]-1.4,cy-6,2.8,12,b[0]); }).join('')+
    rect(cx-10,cy-5,20,2.6,'#fff',' rx="1.3" opacity=".5"'))+kEnds(cx,cy,h,L); }
function kLampB(cx,cy,h,glow,o){ o=o||{}; var L=o.L||50, g=kWood(cx,cy,h,L,34)+kTurn(cx,cy,h,kLegs(cx,cy,L)), lit=glow>0.02;
  if(lit) g+='<circle cx="'+f1(cx)+'" cy="'+f1(cy)+'" r="'+f1(15+13*glow)+'" fill="#facc15" opacity="'+(0.2+0.45*glow).toFixed(2)+'"/>';
  g+='<circle cx="'+f1(cx)+'" cy="'+f1(cy)+'" r="12.5" fill="var(--brass)" stroke="var(--case-s)" stroke-width="0.8"/>'+
    '<circle cx="'+f1(cx)+'" cy="'+f1(cy)+'" r="9.6" fill="'+(lit?'#fff6c4':'var(--glass-in)')+'" stroke="var(--glass)" stroke-width="1.2"/>'+
    '<path d="M'+f1(cx-5)+','+f1(cy+2)+' l2.5,-5 l2.5,5 l2.5,-5 l2.5,5" fill="none" stroke="'+(lit?'#ea8a04':'var(--ink-soft)')+'" stroke-width="1.3" stroke-linejoin="round"/>'+
    ell(cx-3.6,cy-4.2,2.6,1.7,'#fff',' opacity=".75"');
  return g+kEnds(cx,cy,h,L); }
// a diode: the band is at the end the current leaves by (dir +1: along the path)
function kDiodeB(cx,cy,h,dir,o){ o=o||{}; var L=o.L||50, b=dir<0?-11:7.5;
  return kWood(cx,cy,h,L,24)+kTurn(cx,cy,h,kLegs(cx,cy,L)+rect(cx-11,cy-5.5,22,11,'#262c38',' rx="3"')+rect(cx+b,cy-5.5,3.5,11,'#d6dbe4')+rect(cx-9,cy-4,18,2.2,'#fff',' rx="1" opacity=".3"'))+kEnds(cx,cy,h,L); }
// a variable resistor: a coil of wire with a sliding contact (o.f: where the slider is, 0 to 1)
function kVarB(cx,cy,h,o){ o=o||{}; var L=o.L||56, f=o.f==null?0.6:o.f, s='', i;
  s+=kLegs(cx,cy,L)+rect(cx-19,cy-2,38,10,'var(--ceramic)',' rx="3" stroke="var(--steel-sh)" stroke-width="0.8"');
  for(i=0;i<12;i++) s+=ln(cx-17+i*3.1,cy-1.4,cx-17+i*3.1,cy+7.4,'var(--copper)',1.1);
  s+=ln(cx-21,cy-8,cx+21,cy-8,'var(--steel)',2.4)+ln(cx-21,cy-8.8,cx+21,cy-8.8,'var(--steel-hi)',0.8)+rect(cx-19+38*f-4,cy-12,8,13,'var(--topic)',' rx="2" stroke="var(--case-s)" stroke-width="0.7"');
  return kWood(cx,cy,h,L,30)+kTurn(cx,cy,h,s)+kEnds(cx,cy,h,L); }
function kLdrB(cx,cy,h,o){ o=o||{}; var L=o.L||50;
  return kWood(cx,cy,h,L,34)+kTurn(cx,cy,h,kLegs(cx,cy,L))+'<circle cx="'+f1(cx)+'" cy="'+f1(cy)+'" r="11.5" fill="#e9dcae" stroke="var(--steel-sh)" stroke-width="1"/>'+
    '<path d="M'+f1(cx-7)+','+f1(cy-6)+' h14 v3 h-14 v3 h14 v3 h-14 v3 h14" fill="none" stroke="#b3261e" stroke-width="1.5" stroke-linejoin="round"/>'+ell(cx-4,cy-5.5,3.4,2,'#fff',' opacity=".55"')+kEnds(cx,cy,h,L); }
function kThermB(cx,cy,h,o){ o=o||{}; var L=o.L||50;
  return (o.bare?'':kWood(cx,cy,h,L,30))+kTurn(cx,cy,h,kLegs(cx,cy,L))+'<circle cx="'+f1(cx)+'" cy="'+f1(cy)+'" r="7.5" fill="#2a3140" stroke="var(--case-s)" stroke-width="0.8"/>'+ell(cx-2.4,cy-2.8,2.4,1.6,'#fff',' opacity=".5"')+kEnds(cx,cy,h,L); }
// a battery of cells in a holder. h: lying left to right (+ on the right) or up and down (+ at the top); rev turns it round
function kBattB(cx,cy,h,rev,o){ o=o||{}; var n=o.n||2, cl=o.cl||30, d=18, L=n*cl+10, w=h?L:26, hh=h?26:L, s='', i;
  for(i=0;i<n;i++){ var x=cx-n*cl/2+i*cl, y=cy-d/2;
    s+=rect(x,y,cl-3,d,'#2b323e',' rx="3"')+rect(x+cl*0.56,y,cl*0.44-3,d,'var(--topic)',' rx="3"')+rect(x+cl*0.56,y,5,d,'var(--topic)')+
      rect(x+1,y+d*0.14,cl-5,d*0.2,'#fff',' rx="2" opacity=".3"')+rect(x+1,y+d*0.72,cl-5,d*0.2,'#000',' rx="2" opacity=".2"')+rect(x+cl-3.2,y+d*0.3,3.4,d*0.4,'var(--brass)',' rx="1"'); }
  var ang=(h?0:-90)+(rev?180:0), a=L/2-1;
  var sg = h ? txt(cx-L/2+6,cy+33,rev?'+':'−',{a:'middle',fs:14,w:700,c:'var(--ink)'})+txt(cx+L/2-6,cy+33,rev?'−':'+',{a:'middle',fs:14,w:700,c:'var(--ink)'})
             : txt(cx-21,cy-L/2+13,rev?'−':'+',{a:'middle',fs:14,w:700,c:'var(--ink)'})+txt(cx-21,cy+L/2-3,rev?'+':'−',{a:'middle',fs:14,w:700,c:'var(--ink)'});
  return kPlate(cx-w/2,cy-hh/2,w,hh,{top:'var(--steel-hi)',side:'var(--steel)',r:3})+'<g transform="rotate('+ang+' '+f1(cx)+' '+f1(cy)+')">'+s+'</g>'+
    (h ? stud(cx-a,cy)+stud(cx+a,cy) : stud(cx,cy-a)+stud(cx,cy+a))+sg; }
// a power supply standing up and down in the circuit: + at the top, − at the bottom, its voltage on the display
function kPsuB(cx,cy,text){ var w=62, h=64, x=cx-w/2, y=cy-h/2;
  return rect(cx-5,y-6,10,9,'var(--plug-r)',' rx="2"')+rect(cx-5,y+h+2,10,9,'var(--plug-k)',' rx="2"')+kPlate(x,y,w,h,{r:6})+
    txt(cx+11,y+13,'+',{fs:13,w:700,c:'#fff'})+txt(cx+11,y+h-4,'−',{fs:13,w:700,c:'#fff'})+
    rect(x+6,y+17,w-12,20,'var(--lcd)',' rx="3" stroke="var(--case-s)" stroke-width="1"')+txt(x+w-10,y+31.5,text,{a:'end',fs:12.5,w:600,c:'var(--lcd-ink)'})+
    '<circle cx="'+f1(cx-12)+'" cy="'+f1(y+h-14)+'" r="6.5" fill="var(--case-s)" stroke="var(--case-t)" stroke-width="1.2"/>'+ln(cx-12,y+h-14,cx-9,y+h-19,'var(--case-t)',1.6,' stroke-linecap="round"'); }
// a digital meter. v: its leads come in at the top and the bottom (or at the left and the right); o.flip puts the red socket at the other end
function kMeterB(cx,cy,type,text,v,o){ o=o||{}; var w=o.w||70, h=44, x=cx-w/2, y=cy-h/2, c1=o.flip?'var(--plug-k)':'var(--plug-r)', c2=o.flip?'var(--plug-r)':'var(--plug-k)', g='';
  g+= v ? rect(cx-5,y-6,10,9,c1,' rx="2"')+rect(cx-5,y+h+2,10,9,c2,' rx="2"') : rect(x-6,cy-5,9,10,c1,' rx="2"')+rect(x+w-3,cy-5,9,10,c2,' rx="2"');
  g+=kPlate(x,y,w,h,{r:6, top:o.top})+rect(x+5,y+5,w-10,20,'var(--lcd)',' rx="3" stroke="var(--case-s)" stroke-width="1"')+txt(x+w-9,y+19.5,text,{a:'end',fs:12.5,w:600,c:'var(--lcd-ink)'})+
    txt(x+8,y+h-5.5,type,{fs:13,w:700,c:'#fff'})+'<circle cx="'+f1(x+w-13)+'" cy="'+f1(y+h-10.5)+'" r="5.5" fill="var(--case-s)" stroke="var(--case-t)" stroke-width="1.1"/>'+ln(x+w-13,y+h-10.5,x+w-13,y+h-15,'var(--case-t)',1.4,' stroke-linecap="round"');
  return g; }
function kCompB(e,c,st,T){ var k=st.kind?st.kind(e):e.kind, h=!!e.h, L=44*(h?T.sx:T.sy)+2;
  if(k==='custom') return e.bench ? e.bench(st,T) : '';
  if(k==='lamp') return kLampB(c[0],c[1],h,(st.glow||{})[e.id]||0,{L:L});
  if(k==='diode') return kDiodeB(c[0],c[1],h,e.dir||1,{L:L});
  if(k==='var') return kVarB(c[0],c[1],h,{L:L+6,f:st.vf});
  if(k==='ldr') return kLdrB(c[0],c[1],h,{L:L});
  if(k==='therm') return kThermB(c[0],c[1],h,{L:L, bare:st.bareTherm});
  return kRes(c[0],c[1],h,{L:L}); }
// current arrows along one edge or lead: forwards for a positive current
function kFlow(pts, I, d, gap, size){ if(!(Math.abs(I)>2e-5) || pts.length<2) return '';   // under 0.02 mA (a voltmeter in series, a by-passed part): no arrows
  return flowMarks(I<0?pts.slice().reverse():pts, Math.abs(d||0), gap, size); }
function kText(st,id){ var t=(st.text||{})[id]; return t==null ? '– – –' : t; }

// ---- the circuit built on the bench
function kBench(P, st, T){
  var g='', top='', taps='', placed=st.placed||{}, cur=st.cur||{}, dist=st.dist||{}, C=P.cell, cc=kMap(T,[C.x,C.y]);
  // leads first (they run under the parts), then the current arrows, then the parts, then the meters
  P.vslots.forEach(function(s){ if(!placed[s.id]) return; var amm=placed[s.id]==='A';
    s.leads.forEach(function(L,i){ var p=kRound(kPts(T,L),8); g+=lead(p, amm?null:'var(--lead-v)'); taps+=stud(p[0][0],p[0][1]);
      top+=kFlow(i?p.slice().reverse():p, cur[s.id], dist[s.id], 30, 4.4); }); });
  P.edges.forEach(function(e){ var p=kRound(kPts(T,kPath(e,st)),8); if(e.nolead) return; g+=lead(p); if(e.flow!==false) top+=kFlow(p, cur[e.id], dist[e.id], 30, 4.4); });
  g+=top+taps;
  (P.dots||[]).forEach(function(n){ var q=kMap(T,P.nodes[n]); g+=stud(q[0],q[1]); });
  P.edges.forEach(function(e){ if(e.kind!=='wire'){ var c=e.at?kMap(T,e.at):null; g+=kCompB(e,c,st,T); } });
  if(C.kind==='batt') g+=kBattB(cc[0],cc[1],!!C.h,!!st.rev,{n:C.n}); else g+=kPsuB(cc[0],cc[1],st.psu==null?'':st.psu);
  Object.keys(placed).forEach(function(id){ var at=kMap(T,kSlotAt(P,id)), v=kSlotV(P,id,st), e=kEdge(P,id), s=kVslot(P,id), flip=false;
    if(e){ var p=kPath(e,st), back = v ? p[0][1]>p[p.length-1][1] : p[0][0]>p[p.length-1][0]; flip = ((cur[id]||0)<0)!==back; }
    else if(st.pot){ var q0=s.leads[0][0], q1=s.leads[1][0], aFirst = v ? q0[1]<q1[1] : q0[0]<q1[0]; flip = (st.pot[s.a]<st.pot[s.b])===aFirst; }
    g+=kMeterB(at[0],at[1],placed[id],kText(st,id),v,{flip:flip && !st.noflip, w:st.mw}); });
  return g;
}

// ---- the same circuit as a circuit diagram. Slots (the places a meter can go) are returned separately, so they can keep the keyboard's place.
function kVarD(x,y,h,L){ var a=h?[x-L/2-2,y+13,x+L/2+3,y-13]:[x-13,y+L/2+2,x+13,y-L/2-3];
  return (h?resH(x,y,L,16):resV(x,y,16,L))+'<path d="M'+f1(a[0])+','+f1(a[1])+' L'+f1(a[2])+','+f1(a[3])+'" stroke="var(--ink)" stroke-width="1.6" marker-end="url(#ah-ink)"/>'; }
function kDiodeD(x,y,h,dir){ return '<g transform="rotate('+((h?0:90)+(dir<0?180:0))+' '+f1(x)+' '+f1(y)+')">'+diodeH(x,y)+'</g>'; }
function kDiagram(P, st, T){
  var g='', fl='', sl='', placed=st.placed||{}, cur=st.cur||{}, dist=st.dist||{}, C=P.cell, cc=kMap(T,[C.x,C.y]), s=T.sx;
  P.edges.forEach(function(e){ var p=kPts(T,kPath(e,st)); if(!e.nolead) g+=wire(p); if(e.flow!==false) fl+=kFlow(p, cur[e.id], (dist[e.id]||0)*0.85, 32, 3.8); });
  P.vslots.forEach(function(v){ var on=!!placed[v.id];
    v.leads.forEach(function(L,i){ var p=kPts(T,L); g+='<polyline points="'+pts(p)+'" fill="none" stroke="'+(on?'var(--ink)':'var(--ink-faint)')+'" stroke-width="'+(on?1.6:1.2)+'"'+(on?'':' stroke-dasharray="3 4"')+'/>';
      if(on){ g+=jdot(p[0][0],p[0][1]); fl+=kFlow(i?p.slice().reverse():p, cur[v.id], (dist[v.id]||0)*0.85, 32, 3.8); } }); });
  g+=fl;
  P.edges.forEach(function(e){ if(e.kind==='wire') return; var c=e.at?kMap(T,e.at):null, h=!!e.h, L=44*(h?T.sx:T.sy), k=st.kind?st.kind(e):e.kind;
    if(k==='custom') g+=e.diag?e.diag(st,T):'';
    else if(k==='lamp') g+=lampH(c[0],c[1],(st.glow||{})[e.id]||0);
    else if(k==='diode') g+=kDiodeD(c[0],c[1],h,e.dir||1);
    else if(k==='var') g+=kVarD(c[0],c[1],h,L);
    else if(k==='ldr') g+=ldrV(c[0],c[1]);
    else if(k==='therm') g+=thermV(c[0],c[1]);
    else g+= h ? resH(c[0],c[1],L,16) : resV(c[0],c[1],16,L);
    if(st.name && e.at){ var nm=st.name(e); if(nm){ var lines=[].concat(nm), off=e.lab||(h?[0,-15,'middle']:[-15,4,'end']);
      lines.forEach(function(t,i){ g+=txt(c[0]+off[0], c[1]+(off[3]!=null?off[1]*T.sy+off[3]:off[1])+(h?-(lines.length-1-i)*14:(i-(lines.length-1)/2)*14), t, {a:off[2], fs:11.5, c:'var(--ink)'}); }); } } });
  // the cell (cell.n = 1, or a kind other than 'batt') or a battery of two: the long thin plate is +
  var rev=!!st.rev;
  if(C.h){ if(C.kind==='batt' && C.n!==1) g+=rect(cc[0]-11,cc[1]-3,22,6,'var(--panel)')+cellH(cc[0]-8,cc[1],!rev)+wire([[cc[0]-4,cc[1]],[cc[0]+4,cc[1]]])+cellH(cc[0]+8,cc[1],!rev); else g+=cellH(cc[0],cc[1],!rev); }
  else g+='<g'+(rev?' transform="rotate(180 '+f1(cc[0])+' '+f1(cc[1])+')"':'')+'>'+(C.kind==='batt' && C.n!==1 ? rect(cc[0]-3,cc[1]-11,6,22,'var(--panel)')+cellV(cc[0],cc[1]-8)+wire([[cc[0],cc[1]-4],[cc[0],cc[1]+4]])+cellV(cc[0],cc[1]+8) : cellV(cc[0],cc[1]))+'</g>';
  (P.dots||[]).forEach(function(n){ var q=kMap(T,P.nodes[n]); g+=jdot(q[0],q[1]); });
  // the slots: a dashed ring where a meter could go, the meter's symbol where one is
  function slot(id, at, across){ var q=kMap(T,at), m=placed[id], what=across?'across '+(st.slotName?st.slotName(id):'a component'):'in series with '+(st.slotName?st.slotName(id):'the circuit');
    if(!m && !st.slots) return;
    var a='<g class="'+(st.slots?'pick slot':'fixed')+'" data-pick="'+id+'"'+(st.slots?' tabindex="0" role="button" aria-label="'+(m?(m==='A'?'Ammeter ':'Voltmeter ')+what+(st.text&&st.text[id]!=null?', reading '+st.text[id]:'')+'. Press to take it out':'Empty place '+what+' for a meter')+'"':'')+'>';
    if(m) a+='<circle class="ring" cx="'+f1(q[0])+'" cy="'+f1(q[1])+'" r="13" fill="var(--panel)" stroke="'+(st.hi&&st.hi[id]?st.hi[id]:'var(--ink)')+'" stroke-width="'+(st.hi&&st.hi[id]?2.6:1.8)+'"/>'+txt(q[0],q[1]+4.5,m,{a:'middle',fs:13,w:600,c:'var(--ink)'});
    else a+='<circle class="ring" cx="'+f1(q[0])+'" cy="'+f1(q[1])+'" r="11" fill="var(--panel)" stroke="var(--ink-faint)" stroke-width="1.4" stroke-dasharray="3 3"/>'+txt(q[0],q[1]+4,'?',{a:'middle',fs:11,c:'var(--ink-faint)'});
    sl+=a+'<circle cx="'+f1(q[0])+'" cy="'+f1(q[1])+'" r="17" fill="transparent"/></g>'; }
  P.vslots.forEach(function(v){ slot(v.id, v.at, true); });
  P.edges.forEach(function(e){ if(e.slot) slot(e.id, e.slot, false); });
  return {g:g, slots:sl};
}
// ---- putting meters in: drag a chip onto a slot, or pick a chip and then press a slot. cb(slot, meter or null) is told.
function kInput(svg, chips, cb){
  var sel=null, list=Array.prototype.slice.call(chips.querySelectorAll('.chip'));
  function setSel(m){ sel = sel===m ? null : m; list.forEach(function(c){ c.setAttribute('aria-pressed', String(c.dataset.m===sel)); }); }
  onPick(svg, function(id){ cb(id, sel); });
  list.forEach(function(chip){
    var start=null, ghost=null;
    chip.addEventListener('pointerdown', function(e){ start=[e.clientX,e.clientY]; chip.setPointerCapture(e.pointerId); });
    chip.addEventListener('pointermove', function(e){ if(!start) return;
      if(!ghost && Math.hypot(e.clientX-start[0], e.clientY-start[1])>6){ ghost=document.createElement('div'); ghost.className='ghost'; ghost.textContent=chip.dataset.m; document.body.appendChild(ghost); }
      if(ghost) ghost.style.transform='translate('+(e.clientX-15)+'px,'+(e.clientY-15)+'px)'; });
    function end(e, cancel){ if(!start) return; start=null;
      if(ghost){ ghost.remove(); ghost=null;
        if(!cancel){ var el=document.elementFromPoint(e.clientX, e.clientY), s=el && el.closest ? el.closest('.slot') : null; if(s) cb(s.getAttribute('data-pick'), chip.dataset.m, true); }
        chip.dataset.dragged='1'; } }
    chip.addEventListener('pointerup', function(e){ end(e,false); });
    chip.addEventListener('pointercancel', function(e){ end(e,true); });
    chip.addEventListener('click', function(){ if(chip.dataset.dragged){ delete chip.dataset.dragged; return; } setSel(chip.dataset.m); });
  });
  return {sel:function(){ return sel; }, clear:function(){ if(sel) setSel(sel); }};
}
// ---- marking a built circuit. task = {A:[slots that measure the right current], V:[slots across the right part], aOf, vOf (in words), okNote}
// what(id) says in words what a meter in that slot measures; fmt = {A(x), V(x)}.
// A meter of the wrong kind for its place: {kind, bad, html}, or null. note = {lamp(id), off, vs}: extra words for this circuit.
function kFault(P, placed, S, what, fmt, note){
  note=note||{};
  var ids=Object.keys(placed), aAcross=ids.filter(function(id){ return placed[id]==='A' && kVslot(P,id); }), vGap=ids.filter(function(id){ return placed[id]==='V' && kEdge(P,id); });
  if(S.short) return {ok:false, kind:'short', bad:[S.short], html:'<b>Short circuit.</b> The ammeter is connected straight across the supply. An ammeter has almost no resistance, so a very large current ('+fmt.A(kReading(P,S.short,S,'A'))+') takes this easy path and almost none flows through the rest of the circuit. The wires get hot: switch off. An ammeter always goes <b>in series</b>.'};
  var also = aAcross.length ? ' The ammeter is wrong too: it is in parallel with '+what(aAcross[0])+', and an ammeter goes <b>in series</b>.' : '';
  if(vGap.length) return {ok:false, kind:'Vseries', bad:vGap.concat(aAcross), html:'The voltmeter is <b>in series</b>. A voltmeter has a very high resistance, so almost no current can flow'+(note.off||'')+'. It reads '+fmt.V(kReading(P,vGap[0],S,'V'))+': '+(note.vs||'nearly all of the supply’s '+(note.pd||'p.d.').replace(/\.$/,'')+'.')+' A voltmeter goes <b>in parallel</b> with (across) the part it measures.'+also};
  if(aAcross.length) return {ok:false, kind:'Aacross', bad:aAcross, html:'The ammeter is <b>in parallel</b> with '+what(aAcross[0])+'. An ammeter has almost no resistance, so the current goes through the ammeter instead: '+what(aAcross[0])+' is by-passed (short-circuited)'+((note.lamp&&note.lamp(aAcross[0]))||'')+'. An ammeter goes <b>in series</b> with the part it measures.'};
  return null;
}
function kMark(P, task, placed, S, what, fmt, note){
  var F=kFault(P, placed, S, what, fmt, note); if(F) return F;
  var ids=Object.keys(placed), aGap=ids.filter(function(id){ return placed[id]==='A'; }), vAcross=ids.filter(function(id){ return placed[id]==='V'; });
  var needA=task.A&&task.A.length, needV=task.V&&task.V.length, gotA=aGap.filter(function(id){ return needA && task.A.indexOf(id)>=0; }), gotV=vAcross.filter(function(id){ return needV && task.V.indexOf(id)>=0; });
  if((needA && !aGap.length) || (needV && !vAcross.length)) return {ok:false, kind:'missing', bad:[], html:'Not finished yet: the task needs '+(needA && !aGap.length ? 'an <b>ammeter</b>' : '')+(needA && !aGap.length && needV && !vAcross.length ? ' and ' : '')+(needV && !vAcross.length ? 'a <b>voltmeter</b>' : '')+'. Put it in, then press Go again.'};
  if(needA && !gotA.length) return {ok:false, kind:'place', bad:aGap, html:'The circuit works, but this ammeter measures the current in '+what(aGap[0])+' ('+fmt.A(kReading(P,aGap[0],S,'A'))+'), not the current in '+task.aOf+'. Put it in series with '+task.aOf+', where only that current passes through it.'};
  if(needV && !gotV.length) return {ok:false, kind:'place', bad:vAcross, html:'The circuit works, but this voltmeter is across '+what(vAcross[0])+' ('+fmt.V(kReading(P,vAcross[0],S,'V'))+'), not across '+task.vOf+'. Connect it in parallel with '+task.vOf+'.'};
  var h='<b>Correct.</b> ';
  if(needA) h+='The ammeter is in series with '+task.aOf+': <b>'+fmt.A(kReading(P,gotA[0],S,'A'))+'</b>. ';
  if(needV) h+='The voltmeter is in parallel with '+task.vOf+': <b>'+fmt.V(kReading(P,gotV[0],S,'V'))+'</b>. ';
  return {ok:true, kind:'ok', bad:[], good:gotA.concat(gotV), html:h+(task.okNote||'')};
}
