/* ================= 1. OVERVIEW ================= */
{
  const body=act('overview','Fill in the blanks','The practical in one passage','Drag a word into each gap, or tap a word and then tap a gap. Some words are not needed.');
  const parts=[
    'Put a bar magnet in the middle of a sheet of paper and draw round it. Place a small ',['b1','plotting compass'],' next to the north pole. Mark a dot at the ',['b2','north'],
    ' end of the needle, then move the compass so the other end of the needle sits on that dot. Keep going until you reach the ',['b3','south'],' pole or the edge of the paper, then join the dots to make a ',
    ['b4','field line'],'. Add an arrow pointing from N to S, and repeat from other starting points. The lines are closest together at the ',['b5','poles'],', where the field is ',['b6','strongest'],
    '. Between two north poles facing each other there is a ',['b7','neutral point'],', where the field is zero. Two large unlike poles close together give a ',['b8','uniform'],
    ' field: straight, parallel, evenly spaced lines. Iron filings show the same pattern, but not the ',['b9','direction'],' of the field.'
  ];
  const cloze=mk('div','cloze'),slots=[],chips=[];
  parts.forEach(p=>{
    if(typeof p==='string')cloze.appendChild(document.createTextNode(p));
    else{const s=mk('span','blank');cloze.appendChild(s);slots.push({id:p[0],el:s,answer:p[1]});chips.push({id:'c-'+p[0],text:p[1]});}
  });
  ['weakest','middle','random','east'].forEach((t,i)=>chips.push({id:'d'+i,text:t}));
  body.appendChild(cloze);
  body.appendChild(mk('div','pool-label','Word bank'));
  const pool=mk('div','chip-pool');body.appendChild(pool);
  const g={};
  const b=bar(body,[{label:'Check',primary:true,fn:()=>g.check()},{label:'Shuffle again',fn:()=>g.reset()}]);
  const score=mk('span','score');b.el.insertBefore(score,b.msg);
  Object.assign(g,createBlankGame({slots,pool,chips,msg:b,score,isCorrect:(c,s)=>c.text===s.answer}));
}

/* ================= 2. METHOD ================= */
{
  const body=act('method','Order','Plot a field line with a compass','Put the steps in the order you would do them. Drag the ≡ handle, or use the ▲▼ buttons.');
  createReorder({host:body,steps:[
    {id:'a',text:'Put the bar magnet in the middle of a sheet of paper, and draw round it.'},
    {id:'b',text:'Label the N and S poles on your outline.'},
    {id:'c',text:'Place the plotting compass next to the north pole.'},
    {id:'d',text:'Mark a dot at the north end of the needle.'},
    {id:'e',text:'Move the compass so the south end of the needle is on that dot.'},
    {id:'f',text:'Repeat until you reach the south pole or the edge of the paper.'},
    {id:'g',text:'Join the dots with a smooth line, and add an arrow from N to S.'},
    {id:'h',text:'Start again from a different point next to the north pole.'}
  ],constraints:[['a','c'],['b','g'],['c','d'],['d','e'],['e','f'],['f','g'],['g','h']],
  why:'Each new dot is marked at the north end of the needle, after its south end has been moved onto the last dot, so the dots follow the field from N to S.'});
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
{
  const body=act('method','Spot the error','Find the mistake in a method','Zahra’s method has exactly one wrong step. Click the step with the mistake.');
  const grid=mk('div','');body.appendChild(grid);
  createSpot({host:grid,scenario:'Zahra writes down how she plotted one field line.',
    lines:['Place the compass next to the north pole of the magnet.','Mark a dot at the north end of the needle.','Move the compass so the north end of the needle is on the dot.','Mark a new dot at the north end of the needle.','Join the dots and add an arrow from N to S.'],wrong:2,
    explain:'The south end of the needle goes on the last dot. Then the needle points on along the field, and the next dot carries the line forward. With the north end on the dot, the line doubles back.',
    fix:['Move the compass so the south end of the needle is on the dot.']});
}

/* ================= 3. IRON FILINGS ================= */
{
  const body=act('filings','Order','Show the pattern with iron filings','Put the steps in order. Drag the ≡ handle, or use the ▲▼ buttons.');
  createReorder({host:body,steps:[
    {id:'a',text:'Lay a sheet of card over the bar magnet.'},
    {id:'b',text:'Sprinkle a thin layer of iron filings over the card.'},
    {id:'c',text:'Tap the card gently.'},
    {id:'d',text:'Watch the filings line up along the field lines.'},
    {id:'e',text:'Sketch the pattern, then pour the filings back into their pot.'}
  ],constraints:[['a','b'],['b','c'],['c','d'],['d','e']],
  why:'The card goes on first so the filings never touch the magnet, and tapping lets them turn to line up with the field.'});
}
{
  const body=act('filings','Predict','Tapping the card','');
  createPredict({host:body,q:'Why does Ali tap the card after sprinkling the iron filings?',options:[
    {text:'It lets the filings move and turn to line up with the field',correct:true},
    {text:'It magnetises the filings so they stick to each other',why:'The magnet’s field magnetises the filings. Tapping just frees them to turn.'},
    {text:'It spreads the filings evenly so no part is missed',why:'Sprinkling spreads them. Tapping frees them from the friction of the card so they can turn.'},
    {text:'It makes the magnetic field of the magnet stronger',why:'Tapping the card cannot change the magnet’s field. It only frees the filings to turn.'}
  ],explain:'Friction holds each filing where it lands. A gentle tap frees them for a moment, so each one turns to line up with the magnetic field.'});
}
{
  const body=act('filings','Predict','What filings cannot show','');
  createPredict({host:body,q:'What can the plotting compass method show that iron filings cannot?',options:[
    {text:'The direction of the field',correct:true},
    {text:'Where the field is strongest',why:'Filings show this too: they gather most thickly near the poles, where the field is strongest.'},
    {text:'The shape of the field lines',why:'Filings show the shape well: each one lines up along the field.'},
    {text:'Where the two poles are',why:'Filings crowd round both poles, so they do show where the poles are.'}
  ],explain:'A filing lines up with the field but has no north or south end, so it cannot show which way the field points. A compass needle can: its north end points along the field.'});
}
{
  const body=act('filings','Sort','Compass or filings?','Which method is each card about? Sort each card, then press Check.');
  createSortGame({host:body,cats:[
    {id:'c',label:'Plotting compass',hint:'',color:'--c1',soft:'--c1-soft'},
    {id:'f',label:'Iron filings',hint:'',color:'--c2',soft:'--c2-soft'}
  ],items:[
    {id:'1',text:'Shows the direction of the field',cat:'c'},
    {id:'2',text:'Draws one field line at a time, dot by dot',cat:'c'},
    {id:'3',text:'Still works further from the magnet, where the field is weak',cat:'c'},
    {id:'4',text:'Shows the whole pattern at once',cat:'f'},
    {id:'5',text:'Gathers most thickly where the field is strongest',cat:'f'},
    {id:'6',text:'Needs a card over the magnet to keep it clean',cat:'f'}
  ]});
}

/* ================= 4. EXPERIMENT ================= */
{
  act('experiment','Your turn','Take your own readings','Press Experiment. Plot at least four field lines round one bar magnet, then press Compare with field lines. Then try like poles, unlike poles and unlike poles close together. Where do your lines start and end, where are they closest together, and what happens between two north poles?');
}
frameAct('experiment','animations/magnetic-field-patterns.html','','Magnetic field patterns animation: iron filings, field lines and a plotting compass','magnetic field patterns',false);
{
  const body=act('experiment','Predict','Next to the south pole','');
  createPredict({host:body,q:'A bar magnet lies with its N pole on the left. Sophie puts a compass just to the right of the S pole. Which way does the north end of its needle point?',options:[
    {text:'Left, towards the south pole',correct:true},
    {text:'Right, away from the south pole',why:'Field lines go into a south pole. The north end of a needle points along the field, so it points into the S pole.'},
    {text:'Up the page, along the magnet',why:'Right next to a pole, the field points straight into (or out of) the pole, not along the magnet.'},
    {text:'Anywhere: there is no field there',why:'The field is strongest near the poles, so the needle lines up firmly.'}
  ],explain:'Field lines go from N to S, so they go into the south pole. The north end of a compass needle points along the field: here, left into the S pole. (Unlike poles attract: the needle’s N end is pulled towards the magnet’s S pole.)'});
}
{
  const body=act('experiment','Predict','Lines that never cross','');
  createPredict({host:body,q:'Ali notices that his field lines never cross each other. Why not?',options:[
    {text:'At each point the field has only one direction',correct:true},
    {text:'Field lines repel, so they push each other apart',why:'Field lines are a picture of the field; they do not push on each other.'},
    {text:'Where two lines meet, their fields cancel out',why:'If two lines crossed, a compass there would have to point two ways at once, which is impossible.'},
    {text:'He did not plot enough lines to see them cross',why:'However many lines you plot, they never cross: a compass needle can only point one way.'}
  ],explain:'A field line shows the direction a compass needle points. At any point the needle can point only one way, so two field lines can never cross.'});
}

/* ================= 5. RESULTS: reading a field pattern ================= */
// A bar magnet's field lines, traced from two point poles (N on the left), with labelled points.
function barFieldSVG(marks){
  const W=520,H=290,cx=260,cy=145,NX=cx-74,SX=cx+74;
  const B=(x,y)=>{let bx=0,by=0;[[NX,1],[SX,-1]].forEach(([px,q])=>{const dx=x-px,dy=y-cy,r3=Math.pow(dx*dx+dy*dy+1,1.5);bx+=q*dx/r3;by+=q*dy/r3;});return [bx,by];};
  const inMag=(x,y)=>x>cx-92&&x<cx+92&&y>cy-18&&y<cy+18;
  let s='<svg class="graph" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Field lines round a bar magnet, with points P, Q and R"><defs><marker id="bf-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/></marker></defs>';
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
  (marks||[]).forEach(m=>{s+='<circle cx="'+m[1]+'" cy="'+m[2]+'" r="12" fill="var(--panel)" stroke="var(--ink)" stroke-width="2"/><text x="'+m[1]+'" y="'+(m[2]+5)+'" text-anchor="middle" font-size="13" fill="var(--ink)">'+m[0]+'</text>';});
  return s+'</svg>';
}
{
  const body=act('results','Look','Sophie’s field pattern','Sophie plotted these field lines round a bar magnet. Use them to answer the questions below.');
  const box=mk('div','graph-box',barFieldSVG([['P',148,112],['Q',260,30],['R',260,108]]));box.style.maxWidth='560px';
  body.appendChild(box);
}
{
  const body=act('results','Predict','Where is the field strongest?','');
  createPredict({host:body,q:'Look at Sophie’s pattern. At which point is the magnetic field strongest?',options:[
    {text:'P: the lines are closest together there',correct:true},
    {text:'Q: the lines there are the longest ones',why:'Long lines far from the magnet are spread out, so the field there is weak.'},
    {text:'R: it is closest to the middle of the magnet',why:'Beside the middle of the magnet the lines are more spread out than near the poles.'},
    {text:'It is the same strength at all three points',why:'The lines are much closer together near the poles, so the field is stronger there.'}
  ],explain:'The closer together the field lines, the stronger the field. They crowd together near the poles, so the field is strongest at P.'});
}
{
  const body=act('results','Predict','A compass at R','');
  createPredict({host:body,q:'Sophie puts a plotting compass at R. Which way does the north end of its needle point?',options:[
    {text:'To the right, towards the S end',correct:true},
    {text:'To the left, towards the N end',why:'Field lines go from N to S, so above the magnet they point from left to right.'},
    {text:'Straight up, away from the magnet',why:'At R the field line runs along the magnet, from the N end towards the S end.'},
    {text:'Straight down, into the magnet',why:'The field line at R runs along the magnet, not into it.'}
  ],explain:'A compass needle lines up along the field line, with its north end pointing the way of the arrow: from N to S. Above the middle of the magnet that is to the right.'});
}
{
  const body=act('results','Spot the error','Find the mistake in a description','Ali’s description has exactly one wrong statement. Every statement after it follows from it. Click the wrong one.');
  const grid=mk('div','');body.appendChild(grid);
  createSpot({host:grid,scenario:'Ali describes the field pattern he plotted round a bar magnet.',
    lines:['The field lines come out of the north pole.','They loop round and go into the south pole.','The lines are furthest apart near the poles.','So the field is weakest near the poles.'],wrong:2,
    explain:'Near the poles the lines are closest together, not furthest apart. That is where the field is strongest.',
    fix:['The lines are closest together near the poles.','So the field is strongest near the poles.']});
}

/* ================= 6. TWO MAGNETS ================= */
{
  const body=act('twomag','Sort','Attract, repel or no force?','Sort each pair, then press Check.');
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
  const body=act('twomag','Predict','Two north poles','');
  createPredict({host:body,q:'Zahra plots the field between two north poles facing each other. What does she find halfway between them?',options:[
    {text:'A neutral point: the needle will not settle',correct:true},
    {text:'The strongest field, as both poles add up',why:'The two fields point in opposite directions halfway between, so they cancel rather than add.'},
    {text:'Lines going straight across from one pole',why:'Field lines go from N to S. Lines from the two N poles push away from each other and never join.'},
    {text:'A south pole, made by the two north poles',why:'Magnets cannot make a new pole in the air between them. The fields cancel there.'}
  ],explain:'Halfway between two like poles the two fields are equal and opposite, so they cancel: the field is zero. A compass there does not point any particular way. This is a neutral point.'});
}
{
  const body=act('twomag','Predict','A uniform field','');
  createPredict({host:body,q:'Which pattern of field lines shows a uniform magnetic field?',options:[
    {text:'Straight, parallel lines, evenly spaced',correct:true},
    {text:'Curved lines that spread out from a pole',why:'Spreading lines show a field that gets weaker, and curving lines show a change of direction.'},
    {text:'Straight lines that get closer together',why:'Lines getting closer show the field getting stronger, so it is not the same everywhere.'},
    {text:'Lines that meet at a point in the middle',why:'Field lines never meet. Lines meeting would not show the same field everywhere.'}
  ],explain:'A uniform field has the same strength and direction everywhere, so its lines are straight (same direction), parallel and evenly spaced (same strength). Two large unlike poles close together give one in the gap between them.'});
}

/* ================= 7. MAGNETIC MATERIALS ================= */
{
  const body=act('materials','Match','Magnets and magnetic materials','Pair each term with its meaning. Drag one card onto the other, or tap one card and then the other.');
  createMatchGame({host:body,leftTitle:'Term',rightTitle:'Meaning',pairs:[
    {id:'m',l:'Magnetic material',r:'Attracted to a magnet: iron, steel, nickel or cobalt'},
    {id:'i',l:'Induced magnet',r:'Becomes a magnet only while it is in a magnetic field'},
    {id:'h',l:'Magnetically hard',r:'Hard to magnetise, but keeps its magnetism'},
    {id:'s',l:'Magnetically soft',r:'Easy to magnetise, but loses its magnetism easily'},
    {id:'p',l:'Permanent magnet',r:'Made of a hard material such as steel, so it stays magnetic'},
    {id:'c',l:'Electromagnet core',r:'Made of soft iron, so its magnetism can be switched off'}
  ]});
}
{
  const body=act('materials','Predict','A chain of nails','');
  createPredict({host:body,q:'An iron nail hangs from the N pole of a magnet. A second nail hangs from the bottom of the first one. Why does the second nail stay on?',options:[
    {text:'The first nail has become an induced magnet',correct:true},
    {text:'Iron nails always attract each other',why:'Two ordinary iron nails do not attract each other. The first one is magnetic only while it is in the magnet’s field.'},
    {text:'The magnet’s pull goes straight through',why:'The magnet’s field does reach the second nail, but the first nail is magnetised by it and adds its own pull.'},
    {text:'Friction between the nails holds it',why:'Friction cannot hold a nail up against its weight. A magnetic force does.'}
  ],explain:'In the magnet’s field the first nail becomes an induced magnet, so it attracts the second nail. Take the magnet away and both nails fall.'});
}
{
  const body=act('materials','Predict','Iron or steel?','');
  createPredict({host:body,q:'Ali repeats this with steel paper clips instead of iron nails, then pulls the magnet away. The iron nails fall apart, but the steel clips stay stuck for a while. Why?',options:[
    {text:'Steel is magnetically hard, so it keeps some magnetism',correct:true},
    {text:'Steel is not a magnetic material, so it is not affected',why:'Steel is a magnetic material: it is attracted to a magnet, and the clips were held by it.'},
    {text:'Iron is magnetically hard, so it lets go more quickly',why:'Iron is magnetically soft: it loses its induced magnetism as soon as the field is gone.'},
    {text:'Paper clips are lighter, so they fall more slowly',why:'Being light does not stop them falling. They stay stuck because they are still slightly magnetised.'}
  ],explain:'Soft iron is magnetised easily and loses it easily, so the nails fall apart. Steel is magnetically hard: it keeps some of its induced magnetism, so the clips stay stuck together.'});
}

/* ================= 8. ACCURACY AND SAFETY ================= */
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
{
  const body=act('accuracy','Predict','A smaller compass','');
  createPredict({host:body,q:'Why does a smaller plotting compass give a more accurate field line?',options:[
    {text:'The dots are closer, so the line follows each curve',correct:true},
    {text:'A small compass has a stronger needle than a big one',why:'Size does not make the needle stronger. It sets how far apart the dots are.'},
    {text:'A small compass changes the field of the magnet less',why:'Any compass is a tiny magnet, but the main gain is the shorter needle: the dots are closer together.'},
    {text:'The needle of a small compass turns more slowly',why:'Turning speed does not matter: you wait for it to settle before marking a dot.'}
  ],explain:'Each dot is one needle length from the last. With a shorter needle the dots are closer together, so the joined-up line follows the curve of the field more closely.'});
}
{
  const body=act('accuracy','Predict','Far from the magnet','');
  createPredict({host:body,q:'Far from the magnet, Sophie’s field lines curve off and all point the same way across the page. Why?',options:[
    {text:'The Earth’s field is stronger than the magnet’s there',correct:true},
    {text:'The magnet’s field changes direction far away',why:'The magnet’s lines keep looping round to its S pole. Far away its field is weak, so another field takes over.'},
    {text:'Her compass has lost its magnetism by then',why:'A compass does not lose its magnetism while you use it. It is lining up with a different field.'},
    {text:'Field lines can only be plotted near a magnet',why:'Field lines go on far from the magnet, but its field gets weaker with distance.'}
  ],explain:'A compass lines up with the strongest field where it is. Far from the magnet its field is very weak, so the needle lines up with the Earth’s magnetic field instead. Steel objects nearby can bend the lines too.'});
}

/* ================= EXAM PRACTICE ================= */
{
  const body=act('exam','Exam style','The field of a bar magnet','Write each answer, then check it against the model answer.');
  body.appendChild(mk('p','sub','(a) 4 marks'));
  body.appendChild(mk('p','','Describe how Sophie can use a plotting compass to show the shape and direction of the magnetic field round a bar magnet.'));
  const d1=mk('details','');
  d1.innerHTML='<summary>Check your answer</summary><div><ul><li>Put the magnet on a sheet of paper and draw round it.</li><li>Place the compass next to the N pole and mark a dot at the north end of the needle.</li><li>Move the compass so the south end of the needle is on the dot, and mark the next dot; repeat until the S pole (or the edge of the paper).</li><li>Join the dots with a smooth line and add an arrow from N to S; repeat from other starting points.</li></ul></div>';
  body.appendChild(d1);
  body.appendChild(mk('p','sub','(b) 2 marks'));
  body.appendChild(mk('p','','State where the field of a bar magnet is strongest, and how the field pattern shows this.'));
  const d2=mk('details','');
  d2.innerHTML='<summary>Check your answer</summary><div><ul><li>At the poles (the ends of the magnet).</li><li>The field lines are closest together there.</li></ul></div>';
  body.appendChild(d2);
  body.appendChild(mk('p','sub','(c) 2 marks'));
  body.appendChild(mk('p','','Sophie places two bar magnets end to end with their north poles 6 cm apart. Describe the field pattern between them.'));
  const d3=mk('details','');
  d3.innerHTML='<summary>Check your answer</summary><div><ul><li>The lines from each N pole curve away from each other and do not join.</li><li>Halfway between the poles there is a neutral point, where the field is zero.</li></ul></div>';
  body.appendChild(d3);
  body.appendChild(mk('p','sub','(d) 2 marks'));
  body.appendChild(mk('p','','Describe how two permanent magnets can be used to produce a uniform magnetic field, and what its field lines look like.'));
  const d4=mk('details','');
  d4.innerHTML='<summary>Check your answer</summary><div><ul><li>Place two large flat magnets close together, with a north pole facing a south pole.</li><li>In the gap the field lines are straight, parallel and evenly spaced, from N to S.</li></ul></div>';
  body.appendChild(d4);
  body.appendChild(mk('p','sub','(e) 2 marks'));
  body.appendChild(mk('p','','A steel paper clip is held near the magnet and becomes magnetised. Explain why it stays magnetised after the magnet is taken away, when an iron nail would not.'));
  const d5=mk('details','');
  d5.innerHTML='<summary>Check your answer</summary><div><ul><li>The clip was magnetised by induction while it was in the magnet’s field.</li><li>Steel is magnetically hard, so it keeps its magnetism; iron is magnetically soft, so it loses it once the field is gone.</li></ul></div>';
  body.appendChild(d5);
}
