/* IGCSE 7.12, 7.13: find the half-life of a radioactive sample from a graph (with 7.10, background). Not one of the 4PH1
   core practicals: it is the experiment behind "carry out simple calculations on activity, including graphical methods"
   (TODO.md 5w, part 2). Built on the 1.22 model (Variables, Method, Accuracy, Do Experiment, Show Experiment, Results,
   Graph Analysis); the count rate is in counts per second (Alex, 20 Nov 2026): (count in 10 s − 5) divided by 10.
   The Do the Experiment tab frames animations/random-decay.html?show=measure&level=igcse, whose fixed readings (MEAS_SET.igcse)
   must match HL_SET below (tools/CORE-PRACTICALS.md, "Measure modes"; the IAL and IB pages are practicals/half-life-ial and
   practicals/half-life-ib). Question kinds modelled on the parts listed in tools/handoffs/5w-half-life.md; no past-paper data.
   What half-life means, and half-life calculations without a graph, are in the 7a workout (Half-Life tab). 
   Mark scheme wording check (TODO 5ad, 21 Nov 2026, school account): against Phy 14 Jan P1 Q11(b)(ii), 12(a) (remove the source,
   measure the background count rate, measure for a long time or repeat, subtract from each reading), Phy 16 Jan P2 Q6 (background
   subtracted; readings often because the activity changes quickly, short half-life, more points), Phy 23 May P1 Q1(c) (halving
   seen, any indication that decay is random) and Phy 24 Nov P1 Q4(c) (lines drawn on the graph). */
function resTable(head,rows){
  const t=mk('div','table-scroll');
  t.innerHTML='<table class="units res-tbl"><thead><tr>'+head.map(h=>'<th>'+h+'</th>').join('')+'</tr></thead><tbody>'+
    rows.map(r=>'<tr>'+r.map((c,i)=>(i?'<td>':'<th>')+(c==null?'<b>?</b>':c)+(i?'</td>':'</th>')).join('')+'</tr>').join('')+'</tbody></table>';
  return t;
}
/* ================= THE STUDENT'S OWN RESULTS TABLE (Do Experiment; 5c, 13 Nov 2026) =================
   The same helper is copied into each practical rebuilt to the 1.22 model; 1.22 has its own version.
   cfg.head: column headings. cfg.rows: rows of cells. A cell is given text, or a box:
     {k:'key', a:answer, tol, dp, label}           a reading, right if within tol of a (default 0.05)
     {k:'key', f:v=>number, tol, rel, dp, label}  worked from the student's own readings: v('key') is a box the student
                                                   already has right (NaN otherwise); right if within tol, or rel × the answer
     {k:'key', a:'text', opts:[…], label}          a choice from a list (observations)
   Boxes are checked in table order, so a worked box can use readings to its left or in earlier rows.
   Fill in table is always there (Alex, 5 Nov 2026): it fills every box, dashed, so a student who cannot
   read the instrument can still go on. cfg.onChange runs after every check, fill or clear. */
function ownTable(body,cfg){
  const wrap=mk('div','table-scroll');body.appendChild(wrap);
  const cells=[];
  wrap.innerHTML='<table class="units res-tbl own-tbl"><thead><tr>'+cfg.head.map(x=>'<th>'+x+'</th>').join('')+'</tr></thead><tbody>'+
    cfg.rows.map(r=>'<tr>'+r.map(c=>{
      if(c===null||typeof c!=='object')return '<td class="given">'+(c==null?'':c)+'</td>';
      const i=cells.length;cells.push(c);
      if(c.opts)return '<td><select class="own-sel" data-i="'+i+'" aria-label="'+c.label+'"><option value="">Choose</option>'+c.opts.map(o=>'<option>'+o+'</option>').join('')+'</select></td>';
      return '<td><input class="calc-num-input" data-i="'+i+'" inputmode="decimal" autocomplete="off" aria-label="'+c.label+'"></td>';
    }).join('')+'</tr>').join('')+'</tbody></table>';
  const els=$$('[data-i]',wrap);
  const num=e=>{const t=e.value.trim().replace(/[−–]/g,'-').replace(',','.');return t===''||!/^-?(\d+\.?\d*|\.\d+)$/.test(t)?NaN:parseFloat(t);};
  const at={};cells.forEach((c,i)=>{if(c.k)at[c.k]=i;});
  const v=k=>{const e=els[at[k]];return e&&e.disabled?num(e):NaN;};
  const want=c=>c.f?c.f(v):c.a;
  const fmt=(x,c)=>{if(typeof x==='string')return x;const s=x.toFixed(c.dp==null?1:c.dp);return /^-0(\.0+)?$/.test(s)?s.slice(1):s.replace('-','−');};
  const lock=(e,shown)=>{e.disabled=true;e.classList.remove('is-wrong');if(shown)e.classList.add('is-shown');};
  const b=bar(body,[{label:'Check table',primary:true,fn:check},{label:'Fill in table',fn:fill},{label:'Clear',fn:reset}]);
  const changed=()=>{if(cfg.onChange)cfg.onChange();};
  function good(c,e){
    const w=want(c);
    if(c.opts)return e.value===w;
    const x=num(e);if(!isFinite(x)||!isFinite(w))return false;
    return Math.abs(x-w)<=Math.max(c.tol==null?0.05:c.tol,(c.rel||0)*Math.abs(w))+1e-9;
  }
  function check(){
    let ok=0,bad=0,blank=0;
    els.forEach((e,i)=>{
      if(e.disabled){ok++;return;}
      if(e.value.trim()===''){blank++;return;}
      if(good(cells[i],e)){lock(e);e.classList.add('pop');ok++;}else{bad++;e.classList.add('is-wrong');}
    });
    if(ok===els.length){b.say(cfg.done||'All correct.','good');celebrate(b.msg);}
    else b.say(ok+' of '+els.length+' correct'+(blank?', '+blank+' left blank':'')+'.'+(bad&&cfg.hint?' '+cfg.hint:''),bad?'bad':'');
    changed();
  }
  function fill(){
    els.forEach((e,i)=>{if(e.disabled)return;const w=want(cells[i]);if(cells[i].opts||isFinite(w)){e.value=cells[i].opts?w:fmt(w,cells[i]);lock(e,true);}});
    b.say(cfg.filled||'Table filled in (dashed). Read it through.','');changed();
  }
  function reset(){els.forEach(e=>{e.value='';e.disabled=false;e.classList.remove('is-wrong','is-shown','pop');});b.say('','');changed();}
  els.forEach(e=>e.addEventListener(e.tagName==='SELECT'?'change':'input',()=>e.classList.remove('is-wrong')));
  track(body,{reset:reset,
    getState:()=>({v:els.map(e=>e.value),ok:els.map(e=>e.disabled),sh:els.map(e=>e.classList.contains('is-shown'))}),
    setState:s=>{reset();els.forEach((e,i)=>{if(!s||!s.v||typeof s.v[i]!=='string')return;e.value=s.v[i];if(s.ok&&s.ok[i])lock(e,s.sh&&s.sh[i]);});if(els.every(e=>e.disabled))b.say(cfg.done||'All correct.','good');changed();},
    isDone:()=>els.every(e=>e.disabled)});
  // the value in a box the student has got right (or that was filled in), as typed; null until then
  return {val:k=>{const e=els[at[k]];return e&&e.disabled?e.value.trim():null;}};
}
/* The framed animation and the table side by side (as on 1.22), once the page's set-up has run. */
function sideBySide(panel,tableActs){
  setTimeout(()=>{const fr=$('#panel-'+panel+' .anim-wrap');if(!fr)return;const sp=mk('div','do-split');fr.parentNode.insertBefore(sp,fr);sp.appendChild(fr);
    const col=mk('div','do-col');sp.appendChild(col);tableActs.forEach(a=>col.appendChild(a.closest('.act')));},0);
}
// The half-life animation, framed at IGCSE level (frameAct cannot add &level).
function hlFrame(panel,show,title){
  const q='level=igcse'+(show?'&show='+show:''),w=mk('div','anim-wrap');
  w.innerHTML='<iframe class="anim-frame" src="animations/random-decay.html?embed&'+q+'" title="'+title+'"></iframe><p class="anim-open"><a href="animations/random-decay.html?'+q+'">Open the half-life animation full screen &rarr;</a></p>';
  $('#panel-'+panel+' .acts').appendChild(w);
}
function lab(g0,t,x,y){return '<circle cx="'+g0.gx(x)+'" cy="'+g0.gy(y)+'" r="13" fill="var(--panel)" stroke="var(--ink)" stroke-width="2"/><text x="'+g0.gx(x)+'" y="'+(g0.gy(y)+5)+'" text-anchor="middle" font-size="14" fill="var(--ink)">'+t+'</text>';}
// points along a decay curve: start value a, half-life h, a level it falls towards (the background), from 0 to xMax
const decayPts=(a,h,xMax,floor)=>{const p=[];for(let i=0;i<=80;i++){const x=xMax*i/80;p.push([x,(floor||0)+a*Math.pow(0.5,x/h)]);}return p;};

/* ================= VARIABLES ================= */
{
  const body=act('variables','Sort','Which kind of variable is it?','Sofia puts a radioactive sample in front of a GM tube and measures how its count rate changes as time goes by. Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'i',label:'Independent',hint:'What changes from one reading to the next',color:'--c1',soft:'--c1-soft'},
    {id:'d',label:'Dependent',hint:'What she measures',color:'--c2',soft:'--c2-soft'},
    {id:'c',label:'Control',hint:'What she keeps the same',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'The time since the sample was put in place',cat:'i'},
    {id:'2',text:'The count in each 10 s',cat:'d'},
    {id:'3',text:'The distance from the sample to the GM tube',cat:'c'},
    {id:'4',text:'How long each count lasts',cat:'c'},
    {id:'5',text:'The GM tube and counter used',cat:'c'},
    {id:'6',text:'The sample being counted',cat:'c'}
  ]});
}
{
  const body=act('variables','Multiple choice','One count at each time','');
  createPredict({host:body,q:'Sofia cannot repeat her count at 40 s and take a mean. Why not?',options:[
    {text:'The sample has decayed since then',correct:true},
    {text:'A counter can only be used once a day',why:'A counter can be reset and used again straight away. The problem is the sample: its count rate is now lower.'},
    {text:'Repeats are never useful with radiation',why:'Repeats are useful when the count rate stays steady, as with a long-lived source. Here the sample is changing.'},
    {text:'The background would be counted twice',why:'The background is taken away from each count separately. The problem is that the sample’s count rate has fallen.'}
  ],explain:'The count rate falls all the time, so a second count taken later would be lower: it is a different reading, not a repeat. Each time can be counted only once. To check the results, the whole experiment is run again with a fresh sample.'});
}
{
  const body=act('variables','Multiple choice','How often to count','');
  createPredict({host:body,q:'The half-life of the sample is about a minute. Why does Sofia take a count every 20 s, and not every 2 minutes?',options:[
    {text:'The activity changes quickly, so she needs more points for an accurate curve',correct:true},
    {text:'The counter switches itself off after 20 s',why:'The counter runs for as long as it is left on. The reason is the number of points on the graph.'},
    {text:'Counting more often slows down the decay',why:'Nothing she does changes how fast the sample decays. The reason is the number of points on the graph.'},
    {text:'The background changes every 20 seconds',why:'The background stays about the same all the time. The reason is the number of points on the graph.'}
  ],explain:'The sample has a short half-life, so its activity changes quickly: in 2 minutes the count rate falls to about a quarter, and counts every 2 minutes would give only two or three points before the sample was almost gone. A count every 20 s gives more points to plot, so the curve is smoother and more accurate, and the half-life can be read from it.'});
}

/* ================= METHOD ================= */
{
  const body=act('method','Order','Measure a half-life','Put the steps in the order you would do them. Drag the ≡ handle, or use the ▲▼ buttons.');
  createReorder({host:body,steps:[
    {id:'a',text:'With the sample shut in its lead box, count for 1 minute to find the background count.'},
    {id:'b',text:'Using tongs, put the sample in its holder in front of the GM tube and start the stopwatch.'},
    {id:'c',text:'Count for 10 s straight away and write down the count.'},
    {id:'d',text:'Take another 10 s count every 20 s, with its time, until the count is close to background.'},
    {id:'e',text:'Take the background away from every count, then work out each corrected count rate.'},
    {id:'f',text:'Plot corrected count rate against time and draw a smooth curve of best fit.'},
    {id:'g',text:'Read from the curve the time taken for the count rate to halve: the half-life.'}
  ],constraints:[['a','e'],['b','c'],['c','d'],['d','e'],['e','f'],['f','g']],
  why:'The background can be counted before the sample goes in or after it is put away, as long as it is before you correct the counts. The first count starts as soon as the sample is in place, and the graph comes once every count is corrected.'});
}
{
  const body=act('method','Match','What each piece of equipment is for','Pair each piece of equipment with its job. Drag one card onto the other, or tap one card and then the other.');
  createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'g',l:'Geiger–Müller tube',r:'Detects the radiation from the sample'},
    {id:'c',l:'Counter',r:'Counts the pulses from the tube'},
    {id:'s',l:'Stopwatch',r:'Shows the time since the sample was put in'},
    {id:'b',l:'Lead box',r:'Absorbs the sample’s radiation during the background count'},
    {id:'h',l:'Holder',r:'Keeps the sample the same distance from the tube'},
    {id:'t',l:'Tongs',r:'Keep the sample away from your hand'}
  ]});
}

/* ================= ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Better results or safer?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'Better results',hint:'More reliable readings',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps people safe',hint:'Less exposure to radiation',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Handle the sample with tongs, at arm’s length',cat:'s'},
    {id:'2',text:'Point the sample away from people',cat:'s'},
    {id:'3',text:'Keep the sample in its lead-lined box when it is not being counted',cat:'s'},
    {id:'4',text:'Measure the background count rate (with the source removed) and subtract it from each reading',cat:'a'},
    {id:'8',text:'Measure the background for a long time, or repeat it',cat:'a'},
    {id:'5',text:'Keep the sample and the GM tube the same distance apart',cat:'a'},
    {id:'6',text:'Start each count at exactly the planned time',cat:'a'},
    {id:'7',text:'Draw a smooth curve of best fit, not a line from point to point',cat:'a'}
  ]});
}
{
  const body=act('accuracy','Multiple choice','Taking away the background','');
  createPredict({host:body,q:'Why is the background count taken away from every count?',options:[
    {text:'The tube also detects background radiation',correct:true},
    {text:'Background radiation makes the sample decay faster',why:'Nothing outside the nucleus changes how fast a sample decays. The background simply adds extra counts.'},
    {text:'The counter always reads a little lower than it should',why:'The counter reads too high, not too low: it counts the background as well as the sample.'},
    {text:'Background radiation is too dangerous to leave in',why:'The background is weak and is always there. It is taken away so that the count is from the sample alone.'}
  ],explain:'Background radiation comes from rocks, the air, food, buildings and space, and the GM tube detects it along with the radiation from the sample. Taking it away leaves the count from the sample alone. If it is left in, the counts fall to half more slowly, and the half-life comes out too long.'});
}
{
  const body=act('accuracy','Multiple choice','Points off the curve','');
  createPredict({host:body,q:'Sofia corrects every count for background, but her points still do not all lie exactly on a smooth curve. Why not?',options:[
    {text:'Radioactive decay is random',correct:true},
    {text:'The half-life changes as the sample decays',why:'The half-life of an isotope is constant. The points scatter because decay is random.'},
    {text:'The tube detects only some of the radiation',why:'That lowers every count by the same fraction, so the points would still lie on a smooth curve.'},
    {text:'The sample was too close to the GM tube',why:'A sample close to the tube gives bigger counts, which scatter less. The points scatter because decay is random.'}
  ],explain:'Nobody can say which nucleus will decay next, or when, so each 10 s count is a little above or below the expected value. That is why a smooth curve of best fit is drawn, with some points above it and some below.'});
}

/* ================= DO THE EXPERIMENT (the 1.22 model) =================
   The student reads the counter and the stopwatch in the animation's measure mode and types the counts.
   HL_SET must match MEAS_SET.igcse in animations/random-decay.html (tools/CORE-PRACTICALS.md, "Measure modes"). */
const HL_SET={name:'X',bgT:60,bg:30,every:20,c:[409,325,251,209,161,131,101,85,71,54]};   // half-life 60 s
const HL_T=HL_SET.c.map((c,k)=>k*HL_SET.every), HL_B10=HL_SET.bg/HL_SET.bgT*10;           // 0, 20 … 180 s; 5 background counts in 10 s
const HL_C=HL_SET.c.map(c=>(c-HL_B10)/10);                                                // 40.4 … 4.9 counts per second
const HL_FIT=t=>40*Math.pow(0.5,t/60);                                                    // the curve of best fit through them
const hlBodies=[];let hlOwn=null,hlRows=()=>{};
{
  act('do','Your turn','Take your own readings','Press <b>Count the background</b> and write down the count when the counter stops at 60 s. Then press <b>Put in the sample</b>: the first 10 s count starts at once. Press <b>Take the next count</b> each time, and write each count beside the time its count started (the stopwatch shows minutes and seconds, so 1:20 is 80 s).');
}
hlFrame('do','measure','Half-life experiment: read the counter and the stopwatch, and write the counts in your tables');
{
  const body=act('do','Record','Your background count','The sample is shut in its lead box. Type the count, then work out how many of those counts there would be in 10 s, and press Check table.');hlBodies.push(body);
  ownTable(body,{head:['Background count in 60 s','Background count in 10 s'],
    rows:[[{k:'bg',a:HL_SET.bg,tol:0,dp:0,label:'Background count in 60 seconds'},{k:'b10',f:v=>v('bg')/6,tol:0.05,dp:0,label:'Background count in 10 seconds'}]],
    hint:'Read the counter when its timer stops at 60 s. In 10 s there would be one sixth as many counts: divide by 6.',done:'All correct. Take this background count in 10 s away from every count in the next table.'});
}
{
  const body=act('do','Record','Your results for sample X','Type each count. Then work out the corrected count rate = [[count − background count in 10 s|10]], in counts per second. Press Check table.');hlBodies.push(body);
  hlOwn=ownTable(body,{head:['Time (s)','Count in 10 s','Corrected count rate (counts/s)'],
    rows:HL_T.map((t,k)=>[t,{k:'n'+k,a:HL_SET.c[k],tol:0,dp:0,label:'Count in 10 seconds, started at '+t+' seconds'},{k:'r'+k,f:v=>(v('n'+k)-HL_B10)/10,tol:0.05,dp:1,label:'Corrected count rate at '+t+' seconds, in counts per second'}]),
    hint:'Each count is taken as the stopwatch reaches the time in its row. Take 5 (the background count in 10 s) away from the count, then divide by 10.',done:'All correct. Now plot your results below.',
    filled:'Table filled in (dashed). Read it through, then plot the results below.',onChange:()=>hlRows()});
}
sideBySide('do',hlBodies);
{
  const body=act('do','Plot','Plot your results','Plot the corrected count rate against time from your table as small crosses. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off. A cross within half a small square is marked right.');
  createPlot({host:body,next:' Now choose the curve of best fit below.',
    points:HL_T.map((t,k)=>({x:t,y:+HL_C[k].toFixed(1)})),
    rowText:p=>{const k=HL_T.indexOf(p.x),e=hlOwn&&hlOwn.val('r'+k);return p.x+' s, '+(e?e+' counts/s':'your count rate');},
    graph:{xMin:0,xMax:180,yMin:0,yMax:45,xTicks:[0,20,40,60,80,100,120,140,160,180],yTicks:[0,5,10,15,20,25,30,35,40,45],minor:[10,1],snap:[10,0.5],tol:[5,0.5],xLabel:'Time (s)',yLabel:'Corrected count rate (counts/s)',W:560,H:400}});
  hlRows=()=>{$$('.plot-row',body).forEach((li,k)=>{const e=hlOwn&&hlOwn.val('r'+k),s=li.firstElementChild;if(s)s.textContent=HL_T[k]+' s, '+(e?e+' counts/s':'your count rate');});};
  hlRows();
}
{
  const body=act('do','Multiple choice','The curve of best fit','');
  createPredict({host:body,q:'What line of best fit should you draw through your points?',options:[
    {text:'A smooth curve close to the points',correct:true},
    {text:'A straight line from the first point to the last',why:'The count rate falls quickly at first and then more slowly, so the points follow a curve, not a straight line.'},
    {text:'Short straight lines joining each point to the next',why:'Joining the dots follows every random up and down. A line of best fit shows the trend: one smooth curve.'},
    {text:'A smooth curve through every one of the points',why:'Decay is random, so the points scatter a little. The curve passes close to them, with some above it and some below.'}
  ],explain:'The count rate halves in equal times, so it falls along a smooth curve that gets less and less steep. Decay is random, so the points do not all lie on the curve: draw it with about as many points above it as below.'});
}
{
  // the student's points with the curve of best fit drawn through them: 40 → 20 → 10 counts/s at 0, 60 and 120 s
  const body=act('do','Calculate','The half-life from your curve','The graph shows your readings with a smooth curve of best fit. Read your answers off the curve.');
  const split=mk('div','graph-split');body.appendChild(split);
  const GC={xMin:0,xMax:180,yMin:0,yMax:45,xTicks:[0,20,40,60,80,100,120,140,160,180],yTicks:[0,5,10,15,20,25,30,35,40,45],xLabel:'Time (s)',yLabel:'Corrected count rate (counts/s)',W:560,H:380};
  const g0=lineGraph(Object.assign({points:[[0,0]]},GC)),pts=[];
  for(let t=0;t<=180;t+=3)pts.push([t,HL_FIT(t)]);
  const cross=(x,y)=>{const cx=g0.gx(x),cy=g0.gy(y);return '<path class="pc" d="M'+(cx-5)+','+(cy-5)+' L'+(cx+5)+','+(cy+5)+' M'+(cx+5)+','+(cy-5)+' L'+(cx-5)+','+(cy+5)+'"/>';};
  split.appendChild(mk('div','graph-box',lineGraph(Object.assign({label:'Corrected count rate against time: ten crosses close to a smooth curve that falls from 40 counts per second, getting less steep',segments:[{pts:pts}],
    extra:HL_T.map((t,k)=>cross(t,HL_C[k])).join('')},GC)).svg));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'What count rate does the curve start at, when the time is 0?',unit:'counts/s',answer:40,working:'Read the curve, not the first cross, where the time is 0.<br>count rate = 40 counts/s'},
    {q:'At what time has the count rate halved, to 20 counts/s?',unit:'s',answer:60,working:'Half of 40 is 20.<br>Read across from 20 to the curve, then down.<br>time = 60 s'},
    {q:'At what time has it halved again, to 10 counts/s?',unit:'s',answer:120,working:'Half of 20 is 10.<br>Read across from 10 to the curve, then down.<br>time = 120 s'},
    {q:'What is the half-life of sample X?',unit:'s',answer:60,working:'40 to 20 counts/s: time = 60 − 0<br>40 to 20 counts/s: time = 60 s<br>20 to 10 counts/s: time = 120 − 60<br>20 to 10 counts/s: time = 60 s<br>The two times are the same.<br>half-life = 60 s'}
  ]});
}
{
  const body=act('do','Predict','Reading your results','');
  createPredict({host:body,q:'Your curve reaches 10 counts/s at 120 s. What will the corrected count rate be at 240 s?',options:[
    {text:'About 2.5 counts/s',correct:true},
    {text:'About 5 counts/s',why:'That is the count rate at 180 s, one half-life after 120 s. By 240 s it has halved again.'},
    {text:'About 0 counts/s',why:'The count rate halves every 60 s. It gets closer and closer to zero, but half of what was there is always left.'},
    {text:'About 7.5 counts/s',why:'The count rate does not fall by the same amount each minute. It halves every 60 s.'}
  ],explain:'From 120 s to 240 s is 120 s, which is two half-lives of 60 s. The count rate halves twice: 10 → 5 → 2.5 counts/s. The counts are small by then, so their random scatter matters more: that is why the readings stop at 180 s.'});
}

/* ================= SHOW THE EXPERIMENT: the readings taken for you ================= */
{
  act('experiment','Your turn','Watch the readings','Here the picture shows the nuclei themselves, so the graph is of the number left, not the count rate, and there is no background. Press Experiment, then Play: the number left is plotted as the sample decays. How long does it take to halve from 400 to 200, and from 200 to 100? Run it again: are the readings exactly the same? Then choose another isotope: is its half-life the same?');
}
hlFrame('experiment','','Random decay animation: a grid of nuclei decaying at random, with the number left plotted against time');
{
  const body=act('experiment','Multiple choice','More nuclei','');
  createPredict({host:body,q:'Luca starts with 1600 nuclei of the same isotope instead of 400. What happens to the half-life?',options:[
    {text:'It stays the same',correct:true},
    {text:'It is four times longer',why:'More nuclei means more decays each second, but the same fraction decays. Half of them still decay in the same time.'},
    {text:'It is four times shorter',why:'More nuclei means more decays each second, but the same fraction decays. Half of them still decay in the same time.'}
  ],explain:'The half-life is the time taken for half of the nuclei to decay, whatever the number at the start. It depends only on the isotope: different isotopes have different half-lives. With more nuclei the count rate is higher and the curve is smoother, but it halves in the same time.'});
}
{
  const body=act('experiment','Predict','After three half-lives','');
  createPredict({host:body,q:'A sample has 400 undecayed nuclei and a half-life of 56 s. About how many are left after 168 s?',options:[
    {text:'50',correct:true},
    {text:'100',why:'That is after two half-lives (112 s). In the third half-life, half of those 100 decay as well.'},
    {text:'133',why:'After three half-lives the number has halved three times. It has not been divided by three.'},
    {text:'0',why:'Half of the nuclei that are left decay in each half-life, so some are always left: 400 → 200 → 100 → 50.'}
  ],explain:'168 s is three half-lives of 56 s. The number left halves each time: 400 → 200 → 100 → 50. Decay is random, so the real number would be close to 50, not exactly 50.'});
}

/* ================= RESULTS: what the readings show ================= */
{
  const body=act('results','Calculate','Complete the results for sample P','The background count is 6 counts in 10 s. Two corrected count rates are missing.');
  body.appendChild(resTable(['Time (s)','Count in 10 s','Corrected count rate (counts/s)'],[['0','326','32.0'],['30','230',null],['60','166','16.0'],['90','118',null]]));
  createCalc({host:body,questions:[
    {q:'Corrected count rate at 30 s:',unit:'counts/s',answer:22.4,working:'corrected count rate = [[count − background|10]]<br>corrected count rate = [[230 − 6|10]]<br>corrected count rate = [[224|10]]<br>corrected count rate = 22.4 counts/s'},
    {q:'Corrected count rate at 90 s:',unit:'counts/s',answer:11.2,working:'corrected count rate = [[count − background|10]]<br>corrected count rate = [[118 − 6|10]]<br>corrected count rate = [[112|10]]<br>corrected count rate = 11.2 counts/s'}
  ]});
}
{
  const body=act('results','Multiple choice','The half-life of P','');
  createPredict({host:body,q:'Use the completed table for sample P. What is its half-life?',options:[
    {text:'60 s',correct:true},
    {text:'30 s',why:'In the first 30 s the corrected count rate falls from 32.0 to 22.4 counts/s. That is not yet half.'},
    {text:'90 s',why:'By 90 s the corrected count rate is 11.2 counts/s, which is less than half of 32.0.'},
    {text:'16 s',why:'16.0 is the count rate when the first value has halved. The half-life is the time this takes.'}
  ],explain:'The corrected count rate halves from 32.0 to 16.0 counts/s between 0 and 60 s, and from 22.4 to 11.2 counts/s between 30 s and 90 s. Each halving takes 60 s, so the half-life is 60 s.'});
}
{
  const body=act('results','Multiple choice','Without the correction','');
  createPredict({host:body,q:'Minh uses the counts for sample P straight from the counter, without taking away the background. He looks for the time when 326 has halved to 163. What happens to his half-life?',options:[
    {text:'It comes out too long',correct:true},
    {text:'It comes out too short',why:'The background adds 6 to every count and does not decay, so the counts fall more slowly than the sample’s own count rate.'},
    {text:'It comes out the same',why:'It would be the same only with no background. Here 6 counts of every reading do not decay, so the counts take longer to halve.'}
  ],explain:'At 60 s the counter reads 166, not 163, so the uncorrected count has not quite halved: Minh’s time is a little more than 60 s. The background does not decay, so always take it away first.'});
}
{
  const body=act('results','Multiple choice','An anomalous result','');
  createPredict({host:body,pre:resTable(['Time (s)','Corrected count rate (counts/s)'],[['0','50.0'],['20','39.7'],['40','36.5'],['60','25.0'],['80','19.8']]).outerHTML,
    q:'Yuki’s results for another sample are in the table. One result does not fit the pattern. What should she do?',options:[
    {text:'Leave out 40 s when she draws the curve',correct:true},
    {text:'Leave out 60 s when she draws the curve',why:'From 39.7 the count rate should fall to about 31.5 at 40 s and 25.0 at 60 s. The reading at 60 s fits; the one at 40 s is too high.'},
    {text:'Draw the curve through all five points',why:'The reading at 40 s (36.5) is well above the trend of the others. It would pull the curve away from them.'},
    {text:'Count again at 40 s and take the mean',why:'She cannot: the sample has decayed since then, so a new count would be much lower. Each time can be counted only once.'}
  ],explain:'Every 20 s the count rate falls to about 0.79 of what it was, so at 40 s it should be about 31.5 counts/s, not 36.5. The reading cannot be taken again, because the sample has decayed, so it is left out of the curve of best fit.'});
}

/* ================= GRAPH ANALYSIS ================= */
{
  const G1={xMin:0,xMax:160,yMin:0,yMax:80,xTicks:[0,20,40,60,80,100,120,140,160],yTicks:[0,10,20,30,40,50,60,70,80],xLabel:'Time (s)',yLabel:'Corrected count rate (counts/s)',W:560,H:340};
  const body=act('graphs','Calculate','Half-life from a graph','The graph shows the corrected count rate from a sample. Read your answers off the graph.');
  const split=mk('div','graph-split');body.appendChild(split);
  split.appendChild(mk('div','graph-box',lineGraph(Object.assign({label:'Corrected count rate against time, a curve falling from 80 counts per second and getting less steep',segments:[{pts:decayPts(80,40,160)}]},G1)).svg));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'How long does the count rate take to fall from 80 to 40 counts/s?',unit:'s',answer:40,working:'Read across from 40 to the curve, then down.<br>80 counts/s at 0 s<br>40 counts/s at 40 s<br>time = 40 s'},
    {q:'How long does it take to fall from 40 to 20 counts/s?',unit:'s',answer:40,working:'40 counts/s at 40 s<br>20 counts/s at 80 s<br>time = 80 − 40<br>time = 40 s<br>The two times are the same: the half-life is 40 s.'},
    {q:'The graph stops at 160 s. What will the count rate be at 200 s?',unit:'counts/s',answer:2.5,working:'half-life = 40 s<br>number of half-lives = [[200|40]]<br>number of half-lives = 5<br>80 → 40 → 20 → 10 → 5 → 2.5<br>count rate = 2.5 counts/s'}
  ]});
}
{
  const G2={xMin:0,xMax:240,yMin:0,yMax:50,xTicks:[0,30,60,90,120,150,180,210,240],yTicks:[0,5,10,15,20,25,30,35,40,45,50],xLabel:'Time (s)',yLabel:'Count rate (counts/s)',W:560,H:340};
  const body=act('graphs','Calculate','With the background still in','This graph shows the count rate straight from a counter near a sample. The background has not been taken away. Read your answers off the graph.');
  const split=mk('div','graph-split');body.appendChild(split);
  split.appendChild(mk('div','graph-box',lineGraph(Object.assign({label:'Count rate against time: a curve falling from 45 counts per second and levelling off at 5 counts per second',segments:[{pts:decayPts(40,30,240,5)}]},G2)).svg));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'The curve levels off. What is the background count rate?',unit:'counts/s',answer:5,working:'After many half-lives almost none of the sample is left to decay, so the counter reads the background alone.<br>background = 5 counts/s'},
    {q:'What is the corrected count rate at the start?',unit:'counts/s',answer:40,working:'count rate at 0 s = 45 counts/s<br>corrected count rate = 45 − 5<br>corrected count rate = 40 counts/s'},
    {q:'What does the counter read when the corrected count rate has halved?',unit:'counts/s',answer:25,working:'half of 40 = 20 counts/s<br>reading = 20 + 5<br>reading = 25 counts/s'},
    {q:'What is the half-life of the sample?',unit:'s',answer:30,working:'Read across from 25 to the curve, then down.<br>half-life = 30 s'}
  ]});
}
{
  const G3={xMin:0,xMax:120,yMin:0,yMax:60,xTicks:[0,20,40,60,80,100,120],yTicks:[0,10,20,30,40,50,60],xLabel:'Time (s)',yLabel:'Corrected count rate (counts/s)',W:560,H:300};
  const g0=lineGraph(Object.assign({points:[[0,0]]},G3));
  const svg=lineGraph(Object.assign({label:'Corrected count rate against time for two isotopes, both starting at 60 counts per second: curve P falls quickly, curve Q falls slowly',
    segments:[{pts:decayPts(60,20,120)},{pts:decayPts(60,60,120),cls:'g-line-b'}],extra:lab(g0,'P',30,21.2-9)+lab(g0,'Q',90,21.2+9)},G3)).svg;
  const body=act('graphs','Multiple choice','Two isotopes','');
  createPredict({host:body,pre:'<div class="graph-box">'+svg+'</div>',q:'The graph shows the corrected count rates from samples of two different isotopes, P and Q. Which statement is right?',options:[
    {text:'Q has the longer half-life',correct:true},
    {text:'P has the longer half-life',why:'P falls from 60 to 30 counts/s in 20 s. Q takes 60 s to do the same. The steeper curve has the shorter half-life.'},
    {text:'They have the same half-life',why:'They start at the same count rate, but P halves in 20 s and Q in 60 s. Different isotopes have different half-lives.'}
  ],explain:'Read the time for each curve to fall from 60 to 30 counts/s: 20 s for P and 60 s for Q. Each isotope has its own half-life, so the half-life can be used to tell isotopes apart.'});
}
