//@part tri
// a solid arrowhead with its tip at (x, y), pointing along ang (degrees, screen)
function tri(x,y,ang,size,col,extra){ return '<path d="M0,0 L'+(-size*1.7).toFixed(1)+','+(size*0.8).toFixed(1)+' L'+(-size*1.7).toFixed(1)+','+(-size*0.8).toFixed(1)+' z" transform="translate('+x.toFixed(1)+','+y.toFixed(1)+') rotate('+ang.toFixed(1)+')" fill="'+col+'"'+(extra||'')+'/>'; }
//@part flowMarks
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
//@part scene3
// world axes: X to the right, Y away from you (along the axle), Z up; the coil turns about the Y axis.
// The camera looks along the axle from the front, a little from the right and from above, so neither pole hides the coil.
// Everything is cut into short pieces and drawn from the back to the front.
function scene3(ox, oy, s){
  var PHI=14*DEG, EL=30*DEG, cp=Math.cos(PHI), sp=Math.sin(PHI), ce=Math.cos(EL), se=Math.sin(EL), items=[];
  function pr(p){ var d=-p[0]*sp+p[1]*cp; return [ox+s*(p[0]*cp+p[1]*sp), oy-s*(p[2]*ce+d*se), d*ce-p[2]*se]; }
  function xy(p){ var a=pr(p); return a[0].toFixed(1)+','+a[1].toFixed(1); }
  function add(k, svg){ items.push([k, svg]); }
  function poly(list, fill, o){ o=o||{}; var k=0; list.forEach(function(q){ k+=pr(q)[2]; });
    add(k/list.length+(o.bias||0), '<polygon points="'+list.map(xy).join(' ')+'" fill="'+fill+'" stroke="'+(o.stroke||fill)+'" stroke-width="'+(o.sw||0.7)+'" stroke-linejoin="round"'+(o.extra||'')+'/>'); }
  function seg(a,b,col,w,o){ o=o||{};
    var n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2])/14));
    for(var i=0;i<n;i++){ var u=i/n, v=(i+1)/n,
      P=pr([a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u,a[2]+(b[2]-a[2])*u]), Q=pr([a[0]+(b[0]-a[0])*v,a[1]+(b[1]-a[1])*v,a[2]+(b[2]-a[2])*v]);
      add((P[2]+Q[2])/2+(o.bias||0), '<line x1="'+P[0].toFixed(1)+'" y1="'+P[1].toFixed(1)+'" x2="'+Q[0].toFixed(1)+'" y2="'+Q[1].toFixed(1)+'" stroke="'+col+'" stroke-width="'+w.toFixed(1)+'" stroke-linecap="'+(o.cap||'round')+'"'+(o.extra||'')+'/>'); } }
  // a round wire: its colour with a lighter streak along the middle
  function tube(a,b,col,hi,w){ seg(a,b,col,w*s); seg(a,b,hi,w*s*0.42,{bias:-14}); }
  function head(a,b,size,col,extra){ var P=pr(a), Q=pr(b); add(Q[2]-1, tri(Q[0],Q[1],Math.atan2(Q[1]-P[1],Q[0]-P[0])*180/Math.PI,size*s,col,extra)); }
  // a block: the faces you can see are the top, the front and the right-hand side
  function box(x0,x1,y0,y1,z0,z1,top,front,side,edge){
    function f(list,fill){ return '<polygon points="'+list.map(xy).join(' ')+'" fill="'+fill+'" stroke="'+edge+'" stroke-width="1" stroke-linejoin="round"/>'; }
    return f([[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]],top)+f([[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[x1,y0,z1]],side)+f([[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1]],front);
  }
  function out(){ items.sort(function(a,b){ return b[0]-a[0]; }); return items.map(function(x){ return x[1]; }).join(''); }
  return {pr:pr, xy:xy, add:add, poly:poly, seg:seg, tube:tube, head:head, box:box, out:out, s:s, view:[-sp*ce, cp*ce, -se]};
}
//@part rig3
// The whole machine in 3D: magnet, coil (side A copper, side B grey), split ring or slip rings, brushes and the outside circuit.
// o.th angle of side A; o.nl N pole on the left; o.c current in side A (+1 = towards you, out of the page in the end-on view);
// o.sig +1 when the current leaves the coil through the right-hand brush; o.ring 'split' or 'slip' (o.aLeft: ring A's brush is the left one);
// o.device 'cell' or 'meter';
// o.plusLeft the cell's + is joined to the left brush; o.meter needle from -1 to 1; o.flow phase of the current arrows (px);
// o.force length of the force arrows (0 = none); o.spin +1 anticlockwise, -1 clockwise, 0 no arrow; o.on circuit live
function rig3(ox, oy, s, o){
  var sc=scene3(ox,oy,s), R=70, L=92, PX0=112, PX1=172, PY=72, PZ=78, RC=24, RI=11, BL=20, W=74, ZB=120, WD=7.5;
  var th=o.th, ca=Math.cos(th), sa=Math.sin(th), slip=o.ring==='slip', fd=o.nl?1:-1, PI=Math.PI, k;
  var CA='var(--copper)', CAh='var(--copper-hi)', CB='var(--coilb)', CBh='var(--coilb-hi)', INS='var(--insul)';
  function rim(r,y,sg){ return [sg*r*ca, y, sg*r*sa]; }
  function pole(x0,x1,name){ var c=name==='N'?'north':'south', p=sc.pr([(x0+x1)/2,-PY,0]);
    return sc.box(x0,x1,-PY,PY,-PZ,PZ,'var(--'+c+'-t)','var(--'+c+'-f)','var(--'+c+'-s)','var(--'+c+'-s)')+
      '<text x="'+p[0].toFixed(1)+'" y="'+(p[1]+11*s).toFixed(1)+'" text-anchor="middle" font-size="'+(32*s).toFixed(1)+'" font-weight="800" style="font-family:var(--font-display)" fill="#fff">'+name+'</text>'; }
  sc.add(1e4, pole(-PX1,-PX0,o.nl?'N':'S'));
  sc.add(sc.pr([0,-L-10,0])[2], pole(PX0,PX1,o.nl?'S':'N'));
  // field lines, from the N pole to the S pole
  [-44,44].forEach(function(y){ [-50,0,50].forEach(function(z){
    sc.seg([-PX0,y,z],[PX0,y,z],'var(--topic)',1.5*s,{extra:' opacity="0.6"',cap:'butt'});
    [-91,91].forEach(function(x){ sc.head([x-fd*5,y,z],[x+fd*5,y,z],3.6,'var(--topic)'); });
  }); });
  // the coil and its two leads to the rings
  var A0=rim(R,L,1), A1=rim(R,-L,1), B0=rim(R,L,-1), B1=rim(R,-L,-1), yAb, yAf, yBb, yBf;
  if(slip){ yAb=-L-24; yAf=-L-42; yBb=-L-64; yBf=-L-82; } else { yAb=yBb=-L-30; yAf=yBf=-L-56; }
  var rA=16, rB=slip?5:16, LA=[A1,rim(rA,-L,1),rim(rA,yAb,1)], LB=[B1,rim(rB,-L,-1),rim(rB,yBb,-1)];
  sc.seg([0,L+26,0],[0,yBf-14,0],'var(--ink-faint)',3.4*s);
  sc.tube(A0,A1,CA,CAh,WD); sc.tube(B0,B1,CB,CBh,WD);
  sc.tube(A0,[0,L,0],CA,CAh,WD); sc.tube([0,L,0],B0,CB,CBh,WD);
  sc.tube(LA[0],LA[1],CA,CAh,WD*0.8); sc.tube(LA[1],LA[2],CA,CAh,WD*0.8);
  sc.tube(LB[0],LB[1],CB,CBh,WD*0.8); sc.tube(LB[1],LB[2],CB,CBh,WD*0.8);
  // part of a ring round the axle, from angle a0 to a1: the curved outside, then the flat front
  function ring(a0,a1,yb,yf,col,front){
    var n=Math.max(1,Math.round((a1-a0)/(PI/10))), u, v, m, q, f=[];
    for(k=0;k<n;k++){ u=a0+(a1-a0)*k/n; v=a0+(a1-a0)*(k+1)/n; m=(u+v)/2;
      if(Math.cos(m)*sc.view[0]+Math.sin(m)*sc.view[2]<0){
        q=[[RC*Math.cos(u),yb,RC*Math.sin(u)],[RC*Math.cos(v),yb,RC*Math.sin(v)],[RC*Math.cos(v),yf,RC*Math.sin(v)],[RC*Math.cos(u),yf,RC*Math.sin(u)]];
        sc.poly(q,col); sc.poly(q,'#fff',{bias:-0.1,stroke:'none',extra:' fill-opacity="'+(0.4*Math.max(0,Math.sin(m))).toFixed(2)+'"'}); } }
    if(front===false) return;
    for(k=0;k<=n;k++){ u=a0+(a1-a0)*k/n; f.push([RC*Math.cos(u),yf,RC*Math.sin(u)]); }
    for(k=n;k>=0;k--){ u=a0+(a1-a0)*k/n; f.push([RI*Math.cos(u),yf,RI*Math.sin(u)]); }
    sc.poly(f,col,{bias:-14,stroke:INS,sw:0.6});
  }
  function core(yf){ var f=[]; for(k=0;k<24;k++) f.push([(RC-0.6)*Math.cos(k*PI/12),yf,(RC-0.6)*Math.sin(k*PI/12)]); sc.poly(f,INS,{bias:-7}); }
  var gp=0.2;
  if(slip){ ring(0,2*PI,yAb,yAf,CA); core(yAf); ring(0,2*PI,yBb,yBf,CB); core(yBf); }
  else { ring(th-PI/2+gp,th+PI/2-gp,yAb,yAf,CA); ring(th+PI/2+gp,th+3*PI/2-gp,yAb,yAf,CB);
    ring(th+PI/2-gp,th+PI/2+gp,yAb,yAf,INS,false); ring(th-PI/2-gp,th-PI/2+gp,yAb,yAf,INS,false); core(yAf); }
  // carbon brushes (the right one presses on ring A or half A's side, the left one on B's) and the wires down to the cell or meter
  var yA=(yAb+yAf)/2, yB=(yBb+yBf)/2, ym=(yA+yB)/2, dv=o.device==='meter'?25:8;
  function brush(sg,y){ var x0=sg>0?RC+0.6:-RC-BL, c=sc.pr([x0+BL/2,y,0]);
    sc.add(c[2]-4, sc.box(x0,x0+BL-0.6,y-9,y+9,-7,7,'var(--brush-t)','var(--brush-f)','var(--brush-s)','var(--brush-s)')); }
  var yR=o.aLeft?yB:yA, yL=o.aLeft?yA:yB;
  brush(1,yR); brush(-1,yL);
  var wr=[[RC+BL,yR,0],[W,yR,0],[W,yR,-ZB],[dv,ym,-ZB]], wl=[[-RC-BL,yL,0],[-W,yL,0],[-W,yL,-ZB],[-dv,ym,-ZB]];
  [wr,wl].forEach(function(p){ for(k=1;k<p.length;k++) sc.seg(p[k-1],p[k],'var(--ink-soft)',2.4*s); });
  var g=sc.out(), D=sc.pr([0,ym,-ZB]), dx=sc.pr([dv,ym,-ZB])[0]-D[0];
  function f1(n){ return n.toFixed(1); }
  if(o.device==='cell'){
    var xp=D[0]+(o.plusLeft?-dx:dx), xn=D[0]+(o.plusLeft?dx:-dx);
    g+=line(f1(xp),f1(D[1]-15*s),f1(xp),f1(D[1]+15*s),'var(--ink)',2.6*s)+line(f1(xn),f1(D[1]-8*s),f1(xn),f1(D[1]+8*s),'var(--ink)',5.5*s);
    g+=txt(f1(xp+(o.plusLeft?-11:11)*s),f1(D[1]-10*s),'+',{a:'middle',c:'var(--ink)',w:600,fs:15*s})+txt(f1(xn+(o.plusLeft?12:-12)*s),f1(D[1]-10*s),'−',{a:'middle',c:'var(--ink)',w:600,fs:15*s});
    g+=txt(f1(D[0]),f1(D[1]+30*s),o.on?'switched on':'switched off',{a:'middle',fs:12.5,c:o.on?'var(--accent)':'var(--ink-soft)'});
  } else {
    var MR=dx, ang=o.meter*55*DEG, cy=D[1]+6*s;
    g+='<circle cx="'+f1(D[0])+'" cy="'+f1(D[1])+'" r="'+f1(MR)+'" fill="var(--panel)" stroke="var(--ink)" stroke-width="2"/>';
    for(k=-2;k<=2;k++){ var ka=k*27.5*DEG; g+=line(f1(D[0]+(MR-4)*Math.sin(ka)),f1(cy-(MR-4)*Math.cos(ka)),f1(D[0]+(MR-10)*Math.sin(ka)),f1(cy-(MR-10)*Math.cos(ka)),'var(--ink-soft)',k?1.2:2); }
    g+=line(f1(D[0]),f1(cy),f1(D[0]+(MR-6)*Math.sin(ang)),f1(cy-(MR-6)*Math.cos(ang)),'var(--accent)',2.5,' stroke-linecap="round"')+'<circle cx="'+f1(D[0])+'" cy="'+f1(cy)+'" r="3" fill="var(--ink)"/>';
    g+=txt(f1(D[0]),f1(D[1]+18*s),'V',{a:'middle',c:'var(--ink)',w:600,fs:11*s})+txt(f1(D[0]),f1(D[1]+MR+13),'voltmeter',{a:'middle',fs:12.5});
  }
  // the current: arrowheads moving round the coil and the outside circuit
  if(o.on && o.c){
    var P2=function(list){ return list.map(function(q){ return sc.pr(q); }); };
    var coil=P2([LB[2],LB[1],B1,B0,A0,A1,LA[1],LA[2]]), r2=P2(wr), l2=P2(wl);
    if(o.c<0) coil.reverse();
    if(o.sig>0) l2.reverse(); else r2.reverse();
    g+=flowMarks(coil,o.flow,44*s,4.2*s)+flowMarks(r2,o.flow,44*s,4.2*s)+flowMarks(l2,o.flow,44*s,4.2*s);
  }
  // forces on the two long sides (Fleming's left-hand rule)
  if(o.force && o.c) [[1,o.c*fd],[-1,-o.c*fd]].forEach(function(sd){
    var b=rim(R,0,sd[0]), p=sc.pr([b[0],0,b[2]+sd[1]*9]), q=sc.pr([b[0],0,b[2]+sd[1]*(9+o.force)]), a=Math.atan2(q[1]-p[1],q[0]-p[0]);
    g+=line(f1(p[0]),f1(p[1]),f1(q[0]-7*s*Math.cos(a)),f1(q[1]-7*s*Math.sin(a)),'var(--accent)',4.5*s,' stroke-linecap="round"')+tri(q[0],q[1],a*180/PI,5.5*s,'var(--accent)');
    g+=txt(f1(q[0]+10*s),f1((p[1]+q[1])/2+5*s),'F',{c:'var(--accent)',w:600,fs:14*s});
  });
  // which way it is turning: an arrow round the far end of the axle
  if(o.spin){ var pl=[], a0=th+o.spin*0.45; for(k=0;k<=14;k++){ var aa=a0+o.spin*0.8*k/14; pl.push(sc.pr([30*Math.cos(aa),L+16,30*Math.sin(aa)])); }
    var e1=pl[13], e2=pl[14];
    g+='<polyline points="'+pl.slice(0,14).map(function(p){ return f1(p[0])+','+f1(p[1]); }).join(' ')+'" fill="none" stroke="var(--ink)" stroke-width="'+f1(2.2*s)+'" stroke-linecap="round"/>'+tri(e2[0],e2[1],Math.atan2(e2[1]-e1[1],e2[0]-e1[0])*180/PI,4.2*s,'var(--ink)'); }
  // A and B sit just outside the far end of the coil, each beside its own half, clear of the poles, rings, circuit and force arrows
  [[1,'A',CA],[-1,'B',CB]].forEach(function(e){ var p=sc.pr(rim(R*0.8,L,e[0])), q=sc.pr(rim(R,L,e[0])), m=sc.pr([0,L,0]), dx=q[0]-m[0], dy=q[1]-m[1], dl=Math.hypot(dx,dy)||1, nx=-dy/dl, ny=dx/dl;
    if(nx*5-ny*11<0){ nx=-nx; ny=-ny; }
    g+=txt(f1(p[0]+nx*13*s),f1(p[1]+ny*13*s+5*s),e[1],{a:'middle',c:e[2],w:600,fs:14*s,halo:1}); });
  // labels: in the clear space inside the circuit, under the parts they name, so no text lies over the picture
  if(o.labels!==false){
    var rb=sc.pr([0,yBf,-RC]), bq=sc.pr([RC+BL/2,yR,-7]), ly=rb[1]+19*s;
    g+=line(f1(rb[0]-12*s),f1(rb[1]+1),f1(rb[0]-12*s),f1(ly-12*s),'var(--ink-faint)',1)+txt(f1(rb[0]-15*s),f1(ly),slip?'slip rings':'split ring',{a:'middle',fs:12*s,c:'var(--ink)',halo:1});
    g+=line(f1(bq[0]),f1(bq[1]+2),f1(bq[0]+6*s),f1(ly-12*s),'var(--ink-faint)',1)+txt(f1(bq[0]-5*s),f1(ly),'brush',{fs:12*s,c:'var(--ink)',halo:1});
  }
  return g;
}
//@part endOn
// The same coil seen end-on (from the front): the diagram drawn in exam answers. o.pre is the page's marker-id prefix.
function endOn(cx, cy, R, o){
  var k=R/92, g='', inn=1.42*R, pw=0.62*R, hh=1.16*R, th=o.th, fs=Math.max(15,28*k), i;
  g+=poleRect(cx-inn-pw,cy-hh,pw,2*hh,o.nl?'N':'S',fs)+poleRect(cx+inn,cy-hh,pw,2*hh,o.nl?'S':'N',fs);
  for(i=-3;i<=3;i++){ var y=cy+i*R*0.315, a0=o.nl?cx-inn+2:cx+inn-2, a1=o.nl?cx+inn-2:cx-inn+2;
    g+=line(a0,y,a1,y,'var(--topic)',1.3,' opacity="0.5"')+line(a0+(a1-a0)*0.05,y,a0+(a1-a0)*0.09,y,'var(--topic)',2,' opacity="0.75" marker-end="url(#'+o.pre+'-ba)"'); }
  var A=[cx+R*Math.cos(th),cy-R*Math.sin(th)], B=[cx-R*Math.cos(th),cy+R*Math.sin(th)], wr=Math.max(9,14*k);
  g+=line(A[0],A[1],cx,cy,'var(--copper)',Math.max(3.5,5*k),' stroke-linecap="round" opacity="0.6"')+line(cx,cy,B[0],B[1],'var(--coilb)',Math.max(3.5,5*k),' stroke-linecap="round" opacity="0.6"');
  g+='<circle cx="'+cx+'" cy="'+cy+'" r="'+Math.max(4,6*k)+'" fill="var(--panel)" stroke="var(--ink)" stroke-width="2.2"/>';
  if(o.force && o.c) [[A,o.c],[B,-o.c]].forEach(function(s){ var up=s[1]*(o.nl?1:-1), fl=o.force*Math.max(0.7,k);
    g+=line(s[0][0],s[0][1]-up*(wr+3),s[0][0],s[0][1]-up*(wr+3+fl),'var(--accent)',Math.max(3,4*k),' marker-end="url(#'+o.pre+'-fa)"'); });
  g+=wireEnd(A[0],A[1],wr,o.c,'var(--copper)')+wireEnd(B[0],B[1],wr,-o.c,'var(--coilb)');
  var lr=R+wr+(R>60?11:7), la=[cx+lr*Math.cos(th),cy-lr*Math.sin(th)], lb=[cx-lr*Math.cos(th),cy+lr*Math.sin(th)];
  g+=txt(la[0].toFixed(1),(la[1]+5).toFixed(1),'A',{a:'middle',c:'var(--copper)',w:600,fs:14})+txt(lb[0].toFixed(1),(lb[1]+5).toFixed(1),'B',{a:'middle',c:'var(--coilb)',w:600,fs:14});
  if(o.spin){ var r2=R*0.6, s0=th+o.spin*0.5, s1=th+o.spin*1.2;
    g+='<path d="M'+(cx+r2*Math.cos(s0)).toFixed(1)+','+(cy-r2*Math.sin(s0)).toFixed(1)+' A'+r2+','+r2+' 0 0 '+(o.spin>0?0:1)+' '+(cx+r2*Math.cos(s1)).toFixed(1)+','+(cy-r2*Math.sin(s1)).toFixed(1)+'" fill="none" stroke="var(--ink-soft)" stroke-width="2" marker-end="url(#'+o.pre+'-ta)"/>'; }
  return g;
}
//@part keyRows
// key: what the dot, the cross and the moving arrowheads mean
function keyRows(x, y, flow, brief){
  var g=wireEnd(x+7,y,7,1,'var(--ink-soft)')+txt(x+20,y+4,(brief?'':'current ')+'out of the page',{fs:12})+wireEnd(x+7,y+19,7,-1,'var(--ink-soft)')+txt(x+20,y+23,(brief?'':'current ')+'into the page',{fs:12});
  if(flow) g+=tri(x+12,y+38,0,4.6,'var(--cur)')+txt(x+20,y+42,'current, + to −',{fs:12});
  return g;
}
