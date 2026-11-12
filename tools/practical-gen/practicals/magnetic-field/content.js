/* ================= 1. METHOD ================= */
{
  const body=act('method','Order','Plot a field line with a compass','Put the steps in the order you would do them. Drag the ≡ handle, or use the ▲▼ buttons.');
  createReorder({host:body,steps:[
    {id:'a',text:'Put the bar magnet in the middle of a sheet of paper, and draw round it.'},
    {id:'b',text:'Label the N and S poles on your outline.'},
    {id:'c',text:'Place the plotting compass next to the north pole.'},
    {id:'d',text:'Mark a dot where the north end of the needle points.'},
    {id:'e',text:'Move the compass on so the tail (south end) of the needle is at that dot.'},
    {id:'f',text:'Mark the next dot, and repeat until you reach the S pole or the edge of the paper.'},
    {id:'g',text:'Join the dots to form a field line, and add an arrow from N to S.'},
    {id:'h',text:'Repeat from other starting points to draw several field lines.'}
  ],constraints:[['a','c'],['b','g'],['c','d'],['d','e'],['e','f'],['f','g'],['g','h']],
  why:'Each new dot is marked where the north end of the needle points, after its tail has been moved onto the last dot, so the dots follow the field from N to S.'});
}
{
  const body=act('method','Match','What each piece of equipment is for','Pair each piece of equipment with its job. Drag one card onto the other, or tap one card and then the other.');
  createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'c',l:'Plotting compass',r:'Its needle lines up with the field and shows its direction'},
    {id:'p',l:'Sheet of paper',r:'Holds the outline of the magnet and the dots you mark'},
    {id:'s',l:'Sharp pencil',r:'Marks each dot exactly at the end of the needle'},
    {id:'f',l:'Iron filings',r:'Show the whole pattern at once, but not its direction'},
    {id:'k',l:'Card over the magnet',r:'Keeps iron filings off the magnet so they can be poured back'},
    {id:'m',l:'Second bar magnet',r:'Shows the pattern between like or unlike poles'}
  ]});
}

/* ================= 2. IRON FILINGS ================= */
{
  const body=act('filings','Order','Show the pattern with iron filings','Put the steps in order. Drag the ≡ handle, or use the ▲▼ buttons.');
  createReorder({host:body,steps:[
    {id:'a',text:'Place a sheet of card (or paper) over the bar magnet.'},
    {id:'b',text:'Sprinkle iron filings thinly onto the card.'},
    {id:'c',text:'Tap the card gently.'},
    {id:'d',text:'Watch the filings line up to show the shape of the field.'},
    {id:'e',text:'Sketch the pattern, add arrows using a plotting compass, then pour the filings back.'}
  ],constraints:[['a','b'],['b','c'],['c','d'],['d','e']],
  why:'The card goes on first so the filings never touch the magnet, and tapping lets them turn to line up with the field. Filings show only the shape, so a plotting compass gives the direction.'});
}
{
  const body=act('filings','Predict','Tapping the card','');
  createPredict({host:body,q:'Why does Nabil tap the card after sprinkling the iron filings?',options:[
    {text:'It lets the filings turn to line up with the field',correct:true},
    {text:'It magnetises the filings so they stick to each other',why:'The magnet’s field magnetises the filings. Tapping just frees them to turn.'},
    {text:'It shakes the filings towards the north pole',why:'A tap does not push the filings towards either pole. It frees them from the friction of the card so they can turn.'},
    {text:'It makes the magnetic field of the bar magnet stronger',why:'Tapping the card cannot change the magnet’s field. It only frees the filings to turn.'}
  ],explain:'Friction holds each filing where it lands. A gentle tap frees them for a moment, so each one turns to line up with the magnetic field. Tapping also helps spread the filings out, and mark schemes credit “tap to spread the filings” too.'});
}
{
  const body=act('filings','Predict','What filings cannot show','');
  createPredict({host:body,q:'What can the plotting compass method show that iron filings cannot?',options:[
    {text:'The direction of the field',correct:true},
    {text:'Where the field is strongest',why:'Filings show this too: they gather most thickly near the poles, where the field is strongest.'},
    {text:'The shape of the field lines',why:'Filings show the shape well: each one lines up along the field.'},
    {text:'Where the two poles are',why:'Filings crowd round both poles, so they do show where the poles are.'}
  ],explain:'A filing lines up with the field but has no north or south end, so it shows only the shape of the field. A plotting compass is needed to show the direction: its north end points along the field.'});
}
{
  const body=act('filings','Sort','Compass or filings?','Which method is each card about? Sort each card, then press Check.');
  createSortGame({host:body,cats:[
    {id:'c',label:'Plotting compass',hint:'',color:'--c1',soft:'--c1-soft'},
    {id:'f',label:'Iron filings',hint:'',color:'--c2',soft:'--c2-soft'}
  ],items:[
    {id:'1',text:'Shows the direction of the field',cat:'c'},
    {id:'2',text:'Dots are marked where the needle points, then joined up',cat:'c'},
    {id:'3',text:'Still works further from the magnet, where the field is weak',cat:'c'},
    {id:'4',text:'Shows the shape of the whole pattern at once',cat:'f'},
    {id:'5',text:'Gathers most thickly where the field is strongest',cat:'f'},
    {id:'6',text:'Sprinkled on a card over the magnet, then the card is tapped',cat:'f'}
  ]});
}

/* ================= 3. EXPERIMENT ================= */
{
  act('experiment','Your turn','Take your own readings','Press Experiment. Plot at least four field lines round one bar magnet, then press Compare with field lines. Then try like poles, unlike poles and unlike poles close together. Where do your lines start and end, where are they closest together, and what happens between two north poles?');
}
frameAct('experiment','animations/magnetic-field-patterns.html','','Magnetic field patterns animation: iron filings, field lines and a plotting compass','magnetic field patterns',false);
{
  const body=act('experiment','Predict','Next to the south pole','');
  createPredict({host:body,q:'A bar magnet lies with its N pole on the left. Fatimah puts a compass just to the right of the S pole. Which way does the north end of its needle point?',options:[
    {text:'Left, towards the south pole',correct:true},
    {text:'Right, away from the south pole',why:'Field lines go into a south pole. The north end of a needle points along the field, so it points into the S pole.'},
    {text:'Up the page, along the magnet',why:'Right next to a pole, the field points straight into (or out of) the pole, not along the magnet.'},
    {text:'Anywhere: there is no field there',why:'The field is strongest near the poles, so the needle lines up firmly.'}
  ],explain:'Field lines go from N to S, so they go into the south pole. The north end of a compass needle points along the field: here, left into the S pole. (Unlike poles attract: the needle’s N end is pulled towards the magnet’s S pole.)'});
}
{
  const body=act('experiment','Predict','Lines that never cross','');
  createPredict({host:body,q:'Lucas notices that his field lines never cross each other. Why not?',options:[
    {text:'At each point the field has only one direction',correct:true},
    {text:'Field lines repel, so they push each other apart',why:'Field lines are a picture of the field; they do not push on each other.'},
    {text:'Where two lines meet, their fields cancel out',why:'If two lines crossed, a compass there would have to point two ways at once, which is impossible.'},
    {text:'He did not plot enough lines to see them cross',why:'However many lines you plot, they never cross: a compass needle can only point one way.'}
  ],explain:'A field line shows the direction a compass needle points. At any point the needle can point only one way, so two field lines can never cross.'});
}

/* ================= 4. RESULTS: reading a field pattern ================= */
// A bar magnet's field lines, traced from two point poles (N on the left), with labelled points.
function barFieldSVG(marks,pick){
  const W=520,H=290,cx=260,cy=145,NX=cx-74,SX=cx+74;
  const B=(x,y)=>{let bx=0,by=0;[[NX,1],[SX,-1]].forEach(([px,q])=>{const dx=x-px,dy=y-cy,r3=Math.pow(dx*dx+dy*dy+1,1.5);bx+=q*dx/r3;by+=q*dy/r3;});return [bx,by];};
  const inMag=(x,y)=>x>cx-92&&x<cx+92&&y>cy-18&&y<cy+18;
  let s='<svg class="graph" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Field lines round a bar magnet, with lettered points"><defs><marker id="bf-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/></marker></defs>';
  s+='<rect x="1" y="1" width="'+(W-2)+'" height="'+(H-2)+'" rx="8" fill="var(--panel)" stroke="var(--panel-border)"/>';
  // lines traced along the field from the N pole, and (for the outer ones) backwards from the S pole, so both ends show
  const starts=[];[28,42,58,76,98,125,155,180].forEach(d=>starts.push([NX,d,1]));[125,155,180].forEach(d=>starts.push([SX,180-d,-1]));
  starts.forEach(([px,deg,dir])=>{
    [1,-1].forEach(side=>{
      if(deg%180===0&&side<0)return;
      const a=deg*Math.PI/180;let x=px+8*Math.cos(a),y=cy+side*8*Math.sin(a);let pts=[[x,y]];
      for(let i=0;i<1500;i++){const b=B(x,y),l=Math.hypot(b[0],b[1]);x+=dir*b[0]/l*3;y+=dir*b[1]/l*3;pts.push([x,y]);if(Math.hypot(x-(dir>0?SX:NX),y-cy)<8||x<-20||x>W+20||y<-20||y>H+20)break;}
      if(dir<0)pts=pts.reverse();
      s+='<polyline points="'+pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')+'" fill="none" stroke="var(--accent)" stroke-width="1.6"/>';
      const vis=pts.filter(p=>p[0]>6&&p[0]<W-6&&p[1]>6&&p[1]<H-6&&!inMag(p[0],p[1]));
      if(vis.length>8){const k=Math.floor(vis.length/2),p=vis[k],q=vis[k+1];s+='<line x1="'+p[0].toFixed(1)+'" y1="'+p[1].toFixed(1)+'" x2="'+q[0].toFixed(1)+'" y2="'+q[1].toFixed(1)+'" stroke="var(--accent)" stroke-width="2" marker-end="url(#bf-ah)"/>';}
    });
  });
  s+='<rect x="'+(cx-92)+'" y="'+(cy-18)+'" width="92" height="36" fill="var(--c2-soft)" stroke="var(--c2)" stroke-width="2"/><text x="'+(cx-46)+'" y="'+(cy+6)+'" text-anchor="middle" font-size="16" fill="var(--c2)">N</text>';
  s+='<rect x="'+cx+'" y="'+(cy-18)+'" width="92" height="36" fill="var(--c1-soft)" stroke="var(--c1)" stroke-width="2"/><text x="'+(cx+46)+'" y="'+(cy+6)+'" text-anchor="middle" font-size="16" fill="var(--c1)">S</text>';
  (marks||[]).forEach(m=>{if(pick)s+='<g class="pick" role="button" tabindex="0" data-pick="'+m[0]+'" aria-label="Point '+m[0]+'">';s+='<circle cx="'+m[1]+'" cy="'+m[2]+'" r="12" fill="var(--panel)" stroke="var(--ink)" stroke-width="2"/><text x="'+m[1]+'" y="'+(m[2]+5)+'" text-anchor="middle" font-size="13" fill="var(--ink)">'+m[0]+'</text>';if(pick)s+='</g>';});
  return s+'</svg>';
}
// Put two activities side by side (laptops), stacking on phones.
function pairActs(a,b,cls){const A=a.closest('.act'),B=b.closest('.act'),pr=mk('div','act-pair'+(cls?' '+cls:''));A.parentNode.insertBefore(pr,A);pr.appendChild(A);pr.appendChild(B);}
// Click a lettered point on a picture (or focus it and press Enter). A first wrong pick says why and lets the student
// try again; the answer is shown once they find it, or after a second wrong pick.
function createPointPick(cfg){
  const host=cfg.host;host.appendChild(mk('p','pred-q',cfg.prompt));   // the instruction above the picture (Alex, 11 Nov 2026)
  const box=mk('div','graph-box',cfg.svg);if(cfg.maxWidth)box.style.maxWidth=cfg.maxWidth;host.appendChild(box);
  const fb=mk('p','pick-fb');fb.setAttribute('aria-live','polite');host.appendChild(fb);
  const b=bar(host,[{label:'Try again',fn:reset}]);b.el.hidden=true;
  const picks=$$('.pick',box);let tries=0,chosen=[],final=false;
  picks.forEach(g=>{
    g.addEventListener('click',()=>choose(g.dataset.pick));
    g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(g.dataset.pick);}});
  });
  const el=id=>picks.find(g=>g.dataset.pick===id);
  function choose(id){
    if(final)return;const g=el(id);if(!g||g.classList.contains('is-off'))return;
    chosen.push(id);
    if(id!==cfg.answer&&tries===0){
      tries++;g.classList.add('is-wrong','is-off');g.setAttribute('aria-disabled','true');
      fb.innerHTML='<strong>Not quite.</strong> '+FR(cfg.why[id])+' Click another point.';return;
    }
    final=true;
    picks.forEach(x=>{x.classList.add('is-off');x.setAttribute('tabindex','-1');x.setAttribute('aria-disabled','true');});
    el(cfg.answer).classList.add('is-right');if(id!==cfg.answer)g.classList.add('is-wrong');
    fb.innerHTML='<strong>'+(id===cfg.answer?'That is right.':'Not quite.')+'</strong> '+FR((id===cfg.answer?'':cfg.why[id]+' ')+cfg.explain);
    b.el.hidden=false;
  }
  function reset(){tries=0;chosen=[];final=false;b.el.hidden=true;fb.innerHTML='';
    picks.forEach(x=>{x.classList.remove('is-right','is-wrong','is-off');x.setAttribute('tabindex','0');x.removeAttribute('aria-disabled');});}
  reset();
  return track(host,{reset:reset,getState:()=>({p:chosen}),setState:s=>{reset();(s.p||[]).forEach(choose);},isDone:()=>final});
}
let lookBody;
{
  lookBody=act('results','Look','Poppy’s field pattern','Poppy plotted these field lines round a bar magnet. Click the point where the magnetic field is strongest.');
  createPointPick({host:lookBody,maxWidth:'560px',answer:'P',
    svg:barFieldSVG([['P',148,112],['Q',260,30],['R',260,108],['T',60,250]],true),
    prompt:'Click P, Q, R or T (or tab to a point and press Enter).',
    why:{
      Q:'Q is far from the magnet, where the lines are spread out, so the field there is weak.',
      R:'Beside the middle of the magnet the lines are more spread out than near the poles.',
      T:'T is far from the magnet, where the lines are spread out, so the field there is weak.'
    },
    explain:'The closer together the field lines, the stronger the field. They crowd together near the poles, so the field is strongest at P.'});
}
{
  const body=act('results','Predict','A compass at R','');
  pairActs(lookBody,body);
  createPredict({host:body,q:'Poppy puts a plotting compass at R. Which way does the north end of its needle point?',options:[
    {text:'To the right, towards the S end',correct:true},
    {text:'To the left, towards the N end',why:'Field lines go from N to S, so above the magnet they point from left to right.'},
    {text:'Straight up, away from the magnet',why:'At R the field line runs along the magnet, from the N end towards the S end.'},
    {text:'Straight down, into the magnet',why:'The field line at R runs along the magnet, not into it.'}
  ],explain:'A compass needle lines up along the field line, with its north end pointing the way of the arrow: from N to S. Above the middle of the magnet that is to the right.'});
}

/* Field drawings for the two "find the mistake" activities. Every line is traced along the real field of point poles, so the
   right lines are right; each mistake is then put in on purpose. Magnets are solid (N red, S blue, white letters).
   One magnet: May 2021 P1 2(b), May 2023 P1R 4(b), Jan 2021 P1R 8(a) (lines from pole to pole, never crossing, arrows N to S).
   Two north poles: May 2026 P1R 2(a)(i) (the central line should not be drawn; the arrows should point away from the north poles). */
const FD={
  B(poles,x,y){let bx=0,by=0;poles.forEach(([px,py,q])=>{const dx=x-px,dy=y-py,r3=Math.pow(dx*dx+dy*dy+0.5,1.5);bx+=q*dx/r3;by+=q*dy/r3;});return [bx,by];},
  // follow the field from (x,y), forwards (dir 1) or backwards (dir -1), until stop(x,y) is true
  trace(poles,x,y,dir,stop){const pts=[[x,y]];for(let i=0;i<4000;i++){const b=FD.B(poles,x,y),l=Math.hypot(b[0],b[1])||1;x+=dir*b[0]/l*1.5;y+=dir*b[1]/l*1.5;pts.push([x,y]);if(stop(x,y))break;}return pts;},
  path(pts,w){return '<polyline points="'+pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')+'" fill="none" stroke="var(--accent)" stroke-width="'+(w||2)+'" stroke-linecap="round" stroke-linejoin="round"/>';},
  // an arrowhead on a line, a fraction f of the way along it; rev turns it round
  head(pts,f,rev){const k=Math.max(1,Math.min(pts.length-2,Math.round(f*(pts.length-1)))),p=pts[k],a=pts[k-1],b=pts[k+1];let ang=Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI;if(rev)ang+=180;
    return '<path d="M-6,-5.5 L6,0 L-6,5.5 L-3,0 z" fill="var(--accent)" transform="translate('+p[0].toFixed(1)+' '+p[1].toFixed(1)+') rotate('+ang.toFixed(1)+')"/>';},
  // a solid bar magnet: x is its left end, n says which end is north ('l' or 'r')
  magnet(x,cy,len,h,n){const half=len/2,cN='#d23b3b',cS='#2f62d6',lx=n==='l'?[cN,'N',cS,'S']:[cS,'S',cN,'N'];
    let s='<rect x="'+(x+2)+'" y="'+(cy-h/2+3)+'" width="'+len+'" height="'+h+'" rx="2" fill="#000" opacity=".16"/>';
    s+='<rect x="'+x+'" y="'+(cy-h/2)+'" width="'+half+'" height="'+h+'" fill="'+lx[0]+'"/><rect x="'+(x+half)+'" y="'+(cy-h/2)+'" width="'+half+'" height="'+h+'" fill="'+lx[2]+'"/>';
    s+='<rect x="'+x+'" y="'+(cy-h/2)+'" width="'+len+'" height="'+(h*0.3).toFixed(1)+'" fill="#fff" opacity=".22"/><rect x="'+x+'" y="'+(cy+h*0.25).toFixed(1)+'" width="'+len+'" height="'+(h*0.25).toFixed(1)+'" fill="#000" opacity=".14"/>';
    s+='<rect x="'+x+'" y="'+(cy-h/2)+'" width="'+len+'" height="'+h+'" fill="none" stroke="#1b2333" stroke-opacity=".55" stroke-width="1.2"/>';
    const fs=Math.round(h*0.68);
    s+='<text x="'+(x+half/2)+'" y="'+(cy+fs*0.36)+'" text-anchor="middle" font-size="'+fs+'" font-weight="700" fill="#fff">'+lx[1]+'</text><text x="'+(x+half*1.5)+'" y="'+(cy+fs*0.36)+'" text-anchor="middle" font-size="'+fs+'" font-weight="700" fill="#fff">'+lx[3]+'</text>';
    return s;},
  tag(t){return '<circle cx="22" cy="22" r="13" fill="var(--panel)" stroke="var(--ink)" stroke-width="2"/><text x="22" y="27" text-anchor="middle" font-size="14" font-weight="600" fill="var(--ink)">'+t+'</text>';},
  frame(W,H,label){return '<svg class="graph" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+label+'"><rect x="1" y="1" width="'+(W-2)+'" height="'+(H-2)+'" rx="8" fill="var(--panel)" stroke="var(--panel-border)"/>';}
};
// One bar magnet (N on the left) with three loops above and three below; kind puts in one mistake.
function mistakeFieldSVG(tag,kind){
  const W=220,H=215,cx=110,cy=110,a=33,poles=[[cx-a,cy,1],[cx+a,cy,-1]];
  const near=(px)=>(x,y)=>Math.hypot(x-px,y-cy)<3;
  // each loop leaves the N pole at an angle to the magnet and is followed along the field until it reaches the S pole
  const loop=(deg,side)=>{const t=deg*Math.PI/180;return FD.trace(poles,cx-a+4*Math.cos(t),cy+side*4*Math.sin(t),1,near(cx+a));};
  const hs=[46,78,102];
  const names=[];[-1,1].forEach(side=>hs.forEach((h,i)=>names.push({side,i,pts:loop(h,side)})));
  let s=FD.frame(W,H,'Drawing '+tag+': a student’s field lines round a bar magnet');
  names.forEach(L=>{
    let pts=L.pts,arrow=kind!=='none',rev=false;
    if(kind==='rev'&&L.side===-1&&L.i===2)rev=true;
    if(kind==='gap'&&L.side===1&&L.i===1){pts=pts.slice(0,Math.round(pts.length*0.62));}
    if(kind==='cross'&&L.side===-1&&L.i===0){   // leaves N as the inner line but arrives at S as the outer one, so it cuts across the middle line
      const o=names[2].pts,n=160,at=(P,f)=>{const x=f*(P.length-1),k=Math.min(P.length-2,Math.floor(x)),u=x-k;return [P[k][0]+(P[k+1][0]-P[k][0])*u,P[k][1]+(P[k+1][1]-P[k][1])*u];};
      const q=[];for(let j=0;j<=n;j++){const f=j/n,t=Math.min(1,Math.max(0,(f-0.2)/0.45)),m=t*t*(3-2*t),p1=at(pts,f),p2=at(o,f);q.push([p1[0]+(p2[0]-p1[0])*m,p1[1]+(p2[1]-p1[1])*m]);}
      pts=q;
    }
    if(kind==='cross'&&L.side===-1&&L.i===2)return;   // the outer line's place is taken by the crossing one
    s+=FD.path(pts);
    if(arrow)s+=FD.head(pts,kind==='cross'&&L.side===-1&&L.i===0?0.82:0.5,rev);
  });
  s+=FD.magnet(cx-42,cy,84,22,'l')+FD.tag(tag);
  return s+'</svg>';
}
// Two bar magnets with their north poles facing. wrong: the student's drawing (a line straight across, arrows towards the north poles).
function twoNorthSVG(wrong){
  const W=520,H=300,cy=150,g=64,len=150,xl=W/2-g,xr=W/2+g;   // inner (north) ends at xl and xr
  const poles=[[xl-10,cy,1],[xl-len+10,cy,-1],[xr+10,cy,1],[xr+len-10,cy,-1]];
  const out=(x,y)=>x<8||x>W-8||y<8||y>H-8||poles.some(p=>p[2]<0&&Math.hypot(x-p[0],y-p[1])<4);
  let s=FD.frame(W,H,wrong?'A student’s drawing of the field between two north poles':'The field between two north poles, drawn correctly');
  [[xl-10,1],[xr+10,-1]].forEach(([px,sg])=>{
    [22,44,68,96].forEach(deg=>[-1,1].forEach(side=>{
      const t=deg*Math.PI/180,pts=FD.trace(poles,px+sg*4*Math.cos(t),cy+side*4*Math.sin(t),1,out);
      const vis=pts.filter(p=>!(p[0]>xl-len&&p[0]<xl&&Math.abs(p[1]-cy)<24)&&!(p[0]>xr&&p[0]<xr+len&&Math.abs(p[1]-cy)<24));
      s+=FD.path(pts);
      if(vis.length>12)s+=FD.head(vis,0.55,wrong);
    }));
  });
  if(wrong){
    const mid=[];for(let x=xl;x<=xr;x+=2)mid.push([x,cy]);
    s+=FD.path(mid)+FD.head(mid,0.3,true)+FD.head(mid,0.7,false);
  }else{
    s+='<path d="M'+(W/2-6)+','+(cy-6)+' L'+(W/2+6)+','+(cy+6)+' M'+(W/2-6)+','+(cy+6)+' L'+(W/2+6)+','+(cy-6)+'" stroke="var(--ink)" stroke-width="2" stroke-linecap="round"/>';
  }
  s+=FD.magnet(xl-len,cy,len,44,'r')+FD.magnet(xr,cy,len,44,'l');
  return s+'</svg>';
}
{
  const body=act('results','Match','Find the mistake in each drawing','Four students drew the field round a bar magnet. Each drawing has one mistake. Pair each drawing with its mistake. A field drawing scores when its lines go from pole to pole, never cross, and have arrows from N to S.');
  const grid=mk('div','');grid.style.cssText='display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,150px),1fr));gap:12px;margin-bottom:14px';
  [['A','rev'],['B','gap'],['C','cross'],['D','none']].forEach(([t,k])=>{const b=mk('div','graph-box',mistakeFieldSVG(t,k));grid.appendChild(b);});
  body.appendChild(grid);
  createMatchGame({host:body,leftTitle:'Drawing',rightTitle:'Its mistake',pairs:[
    {id:'a',l:'Drawing A',r:'An arrow points from S to N'},
    {id:'b',l:'Drawing B',r:'A line does not start and end on the magnet'},
    {id:'c',l:'Drawing C',r:'Two field lines cross'},
    {id:'d',l:'Drawing D',r:'There are no arrows to show the direction'}
  ]});
}

/* ================= 5. TWO MAGNETS ================= */
let sortBody;
{
  const body=sortBody=act('twomag','Sort','Attract, repel or no force?','Sort each pair, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'Attract',hint:'',color:'--c3',soft:'--c3-soft'},
    {id:'r',label:'Repel',hint:'',color:'--c2',soft:'--c2-soft'},
    {id:'n',label:'No force',hint:'',color:'--c1',soft:'--c1-soft'}
  ],items:[
    {id:'1',text:'A north pole near a south pole',cat:'a'},
    {id:'2',text:'A north pole near an iron nail',cat:'a'},
    {id:'3',text:'A south pole near a steel paper clip',cat:'a'},
    {id:'4',text:'A north pole near a north pole',cat:'r'},
    {id:'5',text:'A south pole near a south pole',cat:'r'},
    {id:'6',text:'Either pole near a copper coin',cat:'n'},
    {id:'7',text:'Either pole near aluminium foil',cat:'n'}
  ]});
}
{
  const body=act('twomag','Predict','A uniform field','');
  pairActs(sortBody,body,'wide-first');   // the sort wider, so its cards fit three to a row (Alex, 11 Nov 2026)
  createPredict({host:body,q:'Which pattern of field lines shows a uniform magnetic field?',options:[
    {text:'Straight, parallel lines, evenly spaced',correct:true},
    {text:'Curved lines that spread out from a pole',why:'Spreading lines show a field that gets weaker, and curving lines show a change of direction.'},
    {text:'Straight lines that get closer together',why:'Lines getting closer show the field getting stronger, so it is not the same everywhere.'},
    {text:'Lines that meet at a point in the middle',why:'Field lines never meet. Lines meeting would not show the same field everywhere.'}
  ],explain:'A uniform field has the same strength and direction everywhere, so its lines are straight (same direction), parallel and evenly spaced (same strength). Opposite poles facing each other, close together but not touching, give one in the gap between them.'});
}

{
  const body=act('twomag','Sort','Two north poles: find the two mistakes','Henry draws the field between two bar magnets with their north poles facing each other. His drawing has two mistakes. Sort each statement about his drawing, then press Check.');
  const split=mk('div','graph-split'),box=mk('div','graph-box',twoNorthSVG(true)),side=mk('div','act-body');
  split.appendChild(box);split.appendChild(side);body.appendChild(split);
  createSortGame({host:side,cats:[
    {id:'no',label:'A mistake',hint:'Henry must change it',color:'--c2',soft:'--c2-soft'},
    {id:'ok',label:'Drawn correctly',hint:'Leave it as it is',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'A straight line joins the two north poles',cat:'no'},
    {id:'2',text:'The arrows point towards the north poles',cat:'no'},
    {id:'3',text:'The lines from the two magnets curve away from each other',cat:'ok'},
    {id:'4',text:'None of the curved lines cross',cat:'ok'},
    {id:'5',text:'The lines are closest together next to the poles',cat:'ok'}
  ]});
  const d=mk('details','');
  d.innerHTML='<summary>Why</summary><div><ul><li>The central line should not be drawn. A field line goes from a north pole to a south pole, so no line can join two north poles. Halfway between them the two fields cancel: a neutral point (the cross in the drawing below).</li><li>The arrows point the wrong way. They should point away from the north poles.</li><li>The rest is right: like poles repel, so the lines from the two magnets curve away from each other and never cross.</li></ul><p class="act-intro">Henry’s drawing put right:</p><div class="graph-box">'+twoNorthSVG(false)+'</div></div>';
  body.appendChild(d);
}

/* ================= 6. ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Better results or safer?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'Better results',hint:'A more accurate pattern',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps people and equipment safe',hint:'',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Keep steel objects, like zips and pencil cases, away from the paper',cat:'a'},
    {id:'2',text:'Use a small plotting compass',cat:'a'},
    {id:'3',text:'Mark each dot exactly at the end of the needle',cat:'a'},
    {id:'4',text:'Plot lines from many different starting points',cat:'a'},
    {id:'5',text:'Keep iron filings away from your eyes',cat:'s'},
    {id:'6',text:'Wash your hands after using iron filings',cat:'s'},
    {id:'7',text:'Keep magnets away from phones and laptops',cat:'s'},
    {id:'8',text:'Do not drop the magnets: it can weaken them',cat:'s'}
  ]});
}

/* ================= EXAM PRACTICE ================= */
{
  const body=act('exam','Exam style','The field of a bar magnet','Write each answer, then check it against the model answer.');
  body.appendChild(mk('p','sub','(a) 4 marks'));
  body.appendChild(mk('p','','Describe how Camila can use a plotting compass to show the shape and direction of the magnetic field round a bar magnet.'));
  const d1=mk('details','');
  d1.innerHTML='<summary>Check your answer</summary><div><ul><li>Put the magnet on a sheet of paper and draw round it.</li><li>Place a plotting compass next to the N pole and mark a dot where the north end of the needle points.</li><li>Move the compass on so the tail of the needle is at the dot, mark the next dot, and repeat until the S pole (or the edge of the paper).</li><li>Join the dots to form a field line, with an arrow from N to S to show the direction.</li><li>Draw several lines from other starting points (use many compasses, or move one compass repeatedly).</li></ul></div>';
  body.appendChild(d1);
  body.appendChild(mk('p','sub','(b) 2 marks'));
  body.appendChild(mk('p','','State where the field of a bar magnet is strongest, and how the field pattern shows this.'));
  const d2=mk('details','');
  d2.innerHTML='<summary>Check your answer</summary><div><ul><li>At the poles (the ends of the magnet).</li><li>The field lines are closest together there (further apart means a weaker field).</li></ul></div>';
  body.appendChild(d2);
  body.appendChild(mk('p','sub','(c) 2 marks'));
  body.appendChild(mk('p','','Ruby places two bar magnets end to end with their north poles 6 cm apart. Describe the field pattern between them.'));
  const d3=mk('details','');
  d3.innerHTML='<summary>Check your answer</summary><div><ul><li>The lines from each N pole curve away from each other and do not cross or join, with arrows pointing away from both N poles.</li><li>Halfway between the poles there is a neutral point, where the field is zero (no line passes through it).</li></ul></div>';
  body.appendChild(d3);
  body.appendChild(mk('p','sub','(d) 2 marks'));
  body.appendChild(mk('p','','Describe how two permanent magnets can be used to produce a uniform magnetic field, and what its field lines look like.'));
  const d4=mk('details','');
  d4.innerHTML='<summary>Check your answer</summary><div><ul><li>Place two magnets with opposite poles facing (N facing S), close together but not touching.</li><li>In the gap the field lines are straight, parallel and evenly spaced, with arrows from N to S.</li></ul></div>';
  body.appendChild(d4);
  body.appendChild(mk('p','sub','(e) 2 marks'));
  body.appendChild(mk('p','','A steel paper clip is held near the magnet and becomes magnetised. Explain why it stays magnetised after the magnet is taken away, when an iron nail would not.'));
  const d5=mk('details','');
  d5.innerHTML='<summary>Check your answer</summary><div><ul><li>The clip became an induced magnet while it was in the magnet’s field.</li><li>Steel is magnetically hard, so it retains its induced magnetism.</li><li>Iron is magnetically soft, so it loses its magnetism once the field is gone.</li></ul></div>';
  body.appendChild(d5);
  body.appendChild(mk('p','sub','(f) 3 marks'));
  body.appendChild(mk('p','','Ali uses iron filings instead of a compass. Describe how he can show the shape of the field, and explain why he still needs a plotting compass.'));
  const d6=mk('details','');
  d6.innerHTML='<summary>Check your answer</summary><div><ul><li>Place a sheet of card over the magnet and sprinkle iron filings thinly onto it.</li><li>Tap the card gently, so the filings line up to show the shape of the field.</li><li>Filings show only the shape: a plotting compass is needed to show the direction of the field.</li></ul></div>';
  body.appendChild(d6);
}
