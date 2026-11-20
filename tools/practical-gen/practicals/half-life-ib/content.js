/* IB E.3: determine the half-life of a radioactive sample (TODO.md 5w, part 2). IB 2025 has no prescribed practicals: this is
   the experiment behind the E.3 understandings on half-life, count rate and "the effect of background radiation on count rate";
   HL adds the decay constant, N = N₀e^(−λt) and T½ = ln 2 / λ.
   Built on the CP15 model (gamma-absorption). Alex, 20 Nov 2026: SL plots the corrected count rate against time and reads the
   half-life from the curve; the ln graph and λ are HL parts, with "HL" in their titles. The page works with count rate only:
   no A = λN, so no fraction detected is needed. IB symbols: T½, λ; count rates in s⁻¹.
   The Do the Experiment tab frames animations/random-decay.html?show=measure&level=ib, whose fixed readings (MEAS_SET.ib)
   must match HL_SET below (tools/CORE-PRACTICALS.md, "Measure modes"; the IGCSE and IAL pages are practicals/half-life and
   practicals/half-life-ial). Question kinds modelled on the parts listed in tools/handoffs/5w-half-life.md; no past-paper data. */
function examPart(body,head,q,bullets){
  body.appendChild(mk('p','sub',head));
  body.appendChild(mk('p','',FR(q)));
  const d=mk('details','');
  d.innerHTML='<summary>Check your answer</summary><div><ul>'+bullets.map(b=>'<li>'+FR(b)+'</li>').join('')+'</ul></div>';
  body.appendChild(d);
}
function resTable(head,rows){
  const t=mk('div','table-scroll');
  t.innerHTML='<table class="units res-tbl"><thead><tr>'+head.map(h=>'<th>'+h+'</th>').join('')+'</tr></thead><tbody>'+
    rows.map(r=>'<tr>'+r.map(c=>'<td>'+(c==null?'<b>?</b>':c)+'</td>').join('')+'</tr>').join('')+'</tbody></table>';
  return t;
}
const g3=v=>String(+(+v).toPrecision(3)), g4=v=>String(+(+v).toPrecision(4));
// The half-life animation, framed at IB level (frameAct cannot add &level).
function hlFrame(panel,show,title){
  const q='level=ib'+(show?'&show='+show:''),w=mk('div','anim-wrap');
  w.innerHTML='<iframe class="anim-frame" src="animations/random-decay.html?embed&'+q+'" title="'+title+'"></iframe><p class="anim-open"><a href="animations/random-decay.html?'+q+'">Open the half-life animation full screen &rarr;</a></p>';
  $('#panel-'+panel+' .acts').appendChild(w);
}
/* A marked table of typed boxes (the CP15 pattern). Each input in wrap has data-c (its column) and data-k (its row);
   o.want(c,k) gives [answer, how close it must be] and o.show(c,k) the text Show answer puts in. Show answer is always
   there (Alex, 5 Nov 2026), so a student can skip the table and go on to the plot. o.onChange runs after every change. */
function markedTable(body,wrap,o){
  const all=()=>$$('input',wrap);
  const val=e=>{const t=e.value.trim().replace(/[−–]/g,'-').replace(',','.');return t===''||!/^-?(\d+\.?\d*|\.\d+)$/.test(t)?NaN:parseFloat(t);};
  const changed=()=>{if(o.onChange)o.onChange();};
  const b=bar(body,[{label:'Check table',primary:true,fn:check},{label:'Clear',fn:reset}]);
  const ans=answerBtn(b,()=>{
    all().forEach(e=>{if(e.disabled)return;e.value=o.show(e.dataset.c,+e.dataset.k);e.disabled=true;e.classList.add('is-shown');e.classList.remove('is-wrong');});
    b.say('Answers shown (dashed). '+o.next,'');changed();
  });
  function check(){
    let ok=0,bad=0,blank=0;
    all().forEach(e=>{
      if(e.disabled){ok++;return;}
      if(e.value.trim()===''){blank++;return;}
      const v=val(e),w=o.want(e.dataset.c,+e.dataset.k);
      if(isFinite(v)&&Math.abs(v-w[0])<=w[1]+1e-9){e.disabled=true;e.classList.remove('is-wrong');e.classList.add('pop');ok++;}
      else{bad++;e.classList.add('is-wrong');}
    });
    const n=all().length;
    if(ok===n){b.say('All correct. '+o.next,'good');celebrate(b.msg);ans.off();}
    else{b.say(ok+' of '+n+' correct'+(blank?', '+blank+' left blank':'')+'.'+(bad?' '+o.hint:''),bad?'bad':'');ans.on();}
    changed();
  }
  function reset(){all().forEach(e=>{e.value='';e.disabled=false;e.classList.remove('is-wrong','is-shown','pop');});ans.on();b.say('','');changed();}
  all().forEach(e=>e.addEventListener('input',()=>e.classList.remove('is-wrong')));
  ans.on();
  track(body,{reset:reset,
    getState:()=>({v:all().map(e=>e.value),ok:all().map(e=>e.disabled),sh:all().map(e=>e.classList.contains('is-shown'))}),
    setState:s=>{reset();all().forEach((e,i)=>{if(!s||!s.v||typeof s.v[i]!=='string')return;e.value=s.v[i];if(s.ok&&s.ok[i]){e.disabled=true;if(s.sh&&s.sh[i])e.classList.add('is-shown');}});if(all().every(e=>e.disabled)){b.say('All correct. '+o.next,'good');ans.off();}changed();},
    isDone:()=>all().every(e=>e.disabled)});
  // what the student has in a box once it is right (or shown), as typed; null until then
  return {got:(c,k)=>{const e=$('input[data-c="'+c+'"][data-k="'+k+'"]',wrap);return !e||e.value.trim()===''||!e.disabled?null:e.value.trim();}};
}
const cellBox=(c,k,lab)=>'<td><input class="calc-num-input" data-c="'+c+'" data-k="'+k+'" inputmode="decimal" autocomplete="off" aria-label="'+lab+'"></td>';

/* ================= 1. OVERVIEW ================= */
{
  const body=act('overview','Fill in the blanks','The practical in one passage','Drag a word into each gap, or tap a word and then tap a gap. Some words are not needed.');
  const parts=[
    'A radioactive sample with a short half-life is fixed in front of a ',['b1','GM tube'],' connected to a counter, which counts for 10 s at regular times as the sample decays. The ',['b2','background'],
    ' count rate, measured with the sample shut in its lead box, is subtracted from every reading to give the ',['b3','corrected'],' count rate. Nobody can say which nucleus will decay next, because decay is ',['b4','random'],
    '. But the sample holds a very large number of nuclei, so the corrected count rate falls along a smooth ',['b5','curve'],', and takes the same time to halve wherever you start. This time is the ',['b6','half-life'],
    '. After two half-lives the corrected count rate is one ',['b7','quarter'],' of its first value, and after three it is one ',['b8','eighth'],'. The counter’s own reading never falls to zero: it levels off above it, because of the background.'
  ];
  const cloze=mk('div','cloze'),slots=[],chips=[];
  parts.forEach(p=>{
    if(typeof p==='string')cloze.appendChild(document.createTextNode(p));
    else{const s=mk('span','blank');cloze.appendChild(s);slots.push({id:p[0],el:s,answer:p[1]});chips.push({id:'c-'+p[0],text:p[1]});}
  });
  ['straight line','third','sixth','activity'].forEach((t,i)=>chips.push({id:'d'+i,text:t}));
  body.appendChild(cloze);
  body.appendChild(mk('div','pool-label','Word bank'));
  const pool=mk('div','chip-pool');body.appendChild(pool);
  const g={};
  const b=bar(body,[{label:'Check answers',primary:true,fn:()=>g.check()},{label:'Shuffle again',fn:()=>g.reset()}]);
  const score=mk('span','score');b.el.insertBefore(score,b.msg);
  Object.assign(g,createBlankGame({fill:true,slots,pool,chips,msg:b,score,isCorrect:(c,s)=>c.text===s.answer}));
}

/* ================= 2. METHOD ================= */
{
  const body=act('method','Order','Carry out the practical','Put the steps in the order you would do them. Drag the ≡ handle, or use the ▲▼ buttons.');
  createReorder({host:body,steps:[
    {id:'a',text:'With the sample shut in its lead box, count for 2 minutes and work out the background count rate per second.'},
    {id:'b',text:'Using tongs, fix the sample in its holder close to the window of the GM tube, and start the stopwatch.'},
    {id:'c',text:'Count for 10 s straight away, and record the count against the time the count started.'},
    {id:'d',text:'Without moving the sample or the tube, take another 10 s count every 40 s until the count is close to background.'},
    {id:'e',text:'Divide each count by 10 s and subtract the background count rate to get the corrected count rate.'},
    {id:'f',text:'Plot the corrected count rate against time and draw a smooth curve of best fit.'},
    {id:'g',text:'Read off the time for the count rate to halve at several places on the curve, and take the mean.'}
  ],constraints:[['a','e'],['b','c'],['c','d'],['d','e'],['e','f'],['f','g']],
  why:'The background can be measured before the sample goes in or after it is put away, as long as it is before you correct the counts. The first count starts as soon as the sample is in place, the sample and tube then stay where they are, and the graph comes once every count is corrected.'});
}
{
  const body=act('method','Match','What each piece of equipment is for','Pair each piece of equipment with its job. Drag one card onto the other, or tap one card and then the other.');
  createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'g',l:'Geiger–Müller tube',r:'Detects the radiation that reaches its window'},
    {id:'c',l:'Counter',r:'Counts the pulses from the tube in a set time'},
    {id:'s',l:'Stopwatch',r:'Shows the time since the sample was put in place'},
    {id:'b',l:'Lead box',r:'Shields the sample while the background is counted'},
    {id:'h',l:'Fixed holders',r:'Keep the sample and tube the same distance apart'},
    {id:'t',l:'Tongs',r:'Hold the sample well away from your hand'}
  ]});
}

/* ================= DO THE EXPERIMENT ================= */
// The student reads the counter and the stopwatch in the animation's measure mode and fills in the table, then plots the
// corrected count rate and reads the half-life from the curve. HL: the ln values, the ln graph and λ.
// HL_SET must match MEAS_SET.ib in animations/random-decay.html (tools/CORE-PRACTICALS.md, "Measure modes").
const HL_SET={name:'Z',bgT:120,bg:72,every:40,c:[480,337,250,180,121,91,67,47,36]};   // half-life 80 s
const HL_T=HL_SET.c.map((c,k)=>k*HL_SET.every), HL_B=HL_SET.bg/HL_SET.bgT;            // 0, 40 … 320 s; 0.60 per second
const HL_C=HL_SET.c.map(c=>c/10-HL_B), HL_LN=HL_C.map(c=>Math.log(c));                // 47.4 … 3.0 per second; 3.859 … 1.099
const HL_FIT=t=>47.7*Math.pow(0.5,t/80);                                              // the curve of best fit through them
let hlTable=null,hlLnTable=null,hlRows=()=>{};
{
  act('do','Your turn','Take your own readings','1. Press Count the background and write down the count after 120 s. 2. Press Put in the sample: the first 10 s count starts at once. 3. Press Take the next count each time, and write each count beside the time its count started. 4. Work out the corrected count rate = [[count|10]] − background count rate.');
}
hlFrame('do','measure','Half-life experiment: read the counter and the stopwatch');
{
  const body=act('do','Calculate','Your results table','Write each count exactly as the counter shows it. Give the background count rate to 2 decimal places and each corrected count rate to 1 decimal place. Press Check.');
  const wrap=mk('div','table-scroll');body.appendChild(wrap);
  wrap.innerHTML='<table class="units res-tbl ga-tbl"><thead><tr><th>Background count in 120 s</th><th>Background count rate (s⁻¹)</th></tr></thead><tbody><tr>'+
    cellBox('bg',0,'Background count in 120 seconds')+cellBox('bgr',0,'Background count rate, per second')+'</tr></tbody></table>'+
    '<table class="units res-tbl ga-tbl" style="margin-top:10px"><thead><tr><th>t (s)</th><th>Count in 10 s</th><th>Corrected count rate (s⁻¹)</th></tr></thead><tbody>'+
    HL_T.map((t,k)=>'<tr><td class="given">'+t+'</td>'+cellBox('n',k,'Count in 10 seconds, started at '+t+' seconds')+cellBox('i',k,'Corrected count rate at '+t+' seconds')+'</tr>').join('')+'</tbody></table>';
  // every cell is right to the accuracy asked for: counts exactly, the background rate to 0.005, the corrected rate to 0.05
  const want=(c,k)=>c==='bg'?[HL_SET.bg,0.5]:c==='bgr'?[HL_B,0.005]:c==='n'?[HL_SET.c[k],0.5]:[HL_C[k],0.05];
  hlTable=markedTable(body,wrap,{want:want,
    show:(c,k)=>c==='bg'||c==='n'?String(want(c,k)[0]):c==='bgr'?want(c,k)[0].toFixed(2):want(c,k)[0].toFixed(1),
    next:'Now plot the corrected count rate against t below.',
    hint:'The background was counted for 120 s, so divide it by 120 for a rate per second. Divide each count by 10 s, then subtract the background count rate.',
    onChange:()=>hlRows()});
}
{
  const body=act('do','Plot','Plot your results','Plot the corrected count rate against t from your table as small crosses. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off. A cross within half a small square is marked right.');
  createPlot({host:body,next:' Now find the half-life from the curve of best fit below.',
    points:HL_T.map((t,k)=>({x:t,y:+HL_C[k].toFixed(1)})),
    rowText:p=>{const k=HL_T.indexOf(p.x),e=hlTable&&hlTable.got('i',k);return p.x+' s, '+(e?e+' s⁻¹':'your count rate');},
    graph:{xMin:0,xMax:320,yMin:0,yMax:50,xTicks:[0,40,80,120,160,200,240,280,320],yTicks:[0,5,10,15,20,25,30,35,40,45,50],minor:[10,1],snap:[10,0.5],tol:[5,0.5],xLabel:'t (s)',yLabel:'Corrected count rate (s⁻¹)',W:560,H:420}});
  // the animation and the results table side by side, so students read and write without scrolling
  // the Your turn card sits above the animation in the left column, so the results table starts at the top on the right
  {const fr=$('#panel-do .anim-wrap'),tb=$('#panel-do .ga-tbl').closest('.act'),yt=$('#panel-do .act[data-title="Take your own readings"]');
   if(fr&&tb){const sp=mk('div','hk-split'),left=mk('div','ga-left');fr.parentNode.insertBefore(sp,fr);sp.appendChild(left);if(yt)left.appendChild(yt);left.appendChild(fr);sp.appendChild(tb);}}
  const rows=()=>{$$('.plot-row',body).forEach((li,k)=>{const e=hlTable&&hlTable.got('i',k),s=li.firstElementChild;if(s)s.textContent=HL_T[k]+' s, '+(e?e+' s⁻¹':'your count rate');});};
  hlRows=rows;rows();
}
{
  // the student's points with the curve of best fit drawn through them: three halvings, each of 80 s
  const body=act('do','Calculate','The half-life from your curve','The graph shows your readings with a smooth curve of best fit. The points do not all lie on the curve, because decay is random. The curve passes through 40 s⁻¹ at t = 20 s. Read your answers off the curve.');
  const split=mk('div','graph-split');body.appendChild(split);
  const GC={xMin:0,xMax:320,yMin:0,yMax:50,xTicks:[0,20,40,60,80,100,120,140,160,180,200,220,240,260,280,300,320],yTicks:[0,5,10,15,20,25,30,35,40,45,50],xLabel:'t (s)',yLabel:'Corrected count rate (s⁻¹)',W:560,H:380};
  const g0=lineGraph(Object.assign({points:[[0,0]]},GC)),pts=[];
  for(let t=0;t<=320;t+=4)pts.push([t,HL_FIT(t)]);
  const cross=(x,y)=>{const cx=g0.gx(x),cy=g0.gy(y);return '<path class="pc" d="M'+(cx-5)+','+(cy-5)+' L'+(cx+5)+','+(cy+5)+' M'+(cx+5)+','+(cy-5)+' L'+(cx-5)+','+(cy+5)+'"/>';};
  split.appendChild(mk('div','graph-box',lineGraph(Object.assign({label:'Corrected count rate against time: nine crosses close to a smooth curve that falls from 48 per second and levels off towards zero',segments:[{pts:pts}],
    extra:HL_T.map((t,k)=>cross(t,HL_C[k])).join('')},GC)).svg));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'At what time has the count rate halved from 40 s⁻¹ to 20 s⁻¹?',unit:'s',answer:100,working:'Read across from 20 to the curve, then down.<br>t = 100 s'},
    {q:'At what time has it halved again, to 10 s⁻¹?',unit:'s',answer:180,working:'Read across from 10 to the curve, then down.<br>t = 180 s'},
    {q:'At what time has it halved again, to 5 s⁻¹?',unit:'s',answer:260,working:'Read across from 5 to the curve, then down.<br>t = 260 s'},
    {q:'What is the half-life of sample Z?',unit:'s',answer:80,working:'40 s⁻¹ to 20 s⁻¹: time = 100 − 20<br>40 s⁻¹ to 20 s⁻¹: time = 80 s<br>20 s⁻¹ to 10 s⁻¹: time = 180 − 100<br>20 s⁻¹ to 10 s⁻¹: time = 80 s<br>10 s⁻¹ to 5 s⁻¹: time = 260 − 180<br>10 s⁻¹ to 5 s⁻¹: time = 80 s<br>The three times are equal, so the half-life is constant.<br>T<sub>½</sub> = 80 s'}
  ]});
}
{
  const body=act('do','Calculate','HL: ln of your count rates','For HL, work out ln (corrected count rate) for each row of your table, to 3 decimal places. Press Check.');
  const wrap=mk('div','table-scroll');body.appendChild(wrap);
  wrap.innerHTML='<table class="units res-tbl ga-tbl hl-tbl"><thead><tr><th>t (s)</th><th>Corrected count rate (s⁻¹)</th><th>ln (count rate / s⁻¹)</th></tr></thead><tbody>'+
    HL_T.map((t,k)=>'<tr><td class="given">'+t+'</td><td class="given hl-own" data-k="'+k+'">from your table</td>'+cellBox('l',k,'ln of the corrected count rate at '+t+' seconds')+'</tr>').join('')+'</tbody></table>';
  hlLnTable=markedTable(body,wrap,{want:(c,k)=>[HL_LN[k],0.005],show:(c,k)=>HL_LN[k].toFixed(3),
    next:'Now plot ln (count rate) against t below.',
    hint:'Use the ln key on your calculator (not log) on each corrected count rate, and give 3 decimal places.',
    onChange:()=>hlRows()});
}
{
  // the same steps as a worked answer: from the data booklet equation to y = mx + c
  const body=act('do','Explain','HL: why plot ln (count rate)?','The count rate is proportional to the number of undecayed nuclei, N, and N = N<sub>0</sub>e<sup>−λt</sup> (data booklet). So, writing C for the corrected count rate, C = C<sub>0</sub>e<sup>−λt</sup>, which is a curve. Take ln of each side:');
  body.insertAdjacentHTML('beforeend',
    '<div class="ln-steps"><span>ln C</span><span>=</span><span>ln (C<sub>0</sub>e<sup>−λt</sup>)</span>'+
    '<span>ln C</span><span>=</span><span>ln C<sub>0</sub> + ln (e<sup>−λt</sup>)</span>'+
    '<span>ln C</span><span>=</span><span>ln C<sub>0</sub> − λt</span></div>'+
    '<p class="act-intro">In the order of y = mx + c:</p>'+
    '<div class="ln-match"><span>ln C</span><span>=</span><span>−λ</span><span>t</span><span>+</span><span>ln C<sub>0</sub></span>'+
    '<span>y</span><span>=</span><span>m</span><span>x</span><span>+</span><span>c</span></div>'+
    '<p class="act-intro">So ln (count rate) against t is a straight line: gradient = −λ, intercept = ln C<sub>0</sub>. A straight line shows the decay is exponential, and its gradient uses every reading.</p>');
}
{
  const body=act('do','Plot','HL: plot ln (count rate) against t','Plot your ln values against t as small crosses. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');
  createPlot({host:body,next:' Now find λ from the line of best fit below.',
    points:HL_T.map((t,k)=>({x:t,y:+HL_LN[k].toFixed(3)})),
    rowText:p=>{const k=HL_T.indexOf(p.x),e=hlLnTable&&hlLnTable.got('l',k);return p.x+' s, '+(e?'ln = '+e:'your ln value');},
    graph:{xMin:0,xMax:320,yMin:1,yMax:4,xTicks:[0,40,80,120,160,200,240,280,320],yTicks:[1,1.5,2,2.5,3,3.5,4],minor:[10,0.1],snap:[10,0.05],xLabel:'t (s)',yLabel:'ln (count rate / s⁻¹)',W:560,H:340}});
  const first=hlRows;
  hlRows=()=>{first();
    $$('.plot-row',body).forEach((li,k)=>{const e=hlLnTable&&hlLnTable.got('l',k),s=li.firstElementChild;if(s)s.textContent=HL_T[k]+' s, '+(e?'ln = '+e:'your ln value');});
    $$('#panel-do .hl-own').forEach(td=>{const e=hlTable&&hlTable.got('i',+td.dataset.k);td.textContent=e||'from your table';});};
  hlRows();
}
{
  const body=act('do','Calculate','HL: λ and the half-life from your line','A good line of best fit through your ln points passes through (20, 3.692) and (300, 1.266). Read nothing else off the graph.');
  createCalc({host:body,questions:[
    {q:'What is the gradient of the line?',unit:'s⁻¹',answer:-0.00866,working:'first point = (20, 3.692)<br>second point = (300, 1.266)<br>gradient = ?||gradient = [[change in ln (count rate)|change in t]]<br>gradient = [[1.266 − 3.692|300 − 20]]<br>gradient = [[−2.426|280]]<br>gradient = −0.00866 s⁻¹'},
    {q:'What is the decay constant, λ?',unit:'s⁻¹',answer:0.00866,working:'gradient = −0.00866 s⁻¹<br>λ = ?||gradient = −λ<br>−0.00866 = −λ<br>λ = 0.00866 s⁻¹<br>λ = 8.66 × 10⁻³ s⁻¹'},
    {q:'What is the half-life of sample Z?',unit:'s',answer:80,working:'λ = 0.00866 s⁻¹<br>T<sub>½</sub> = ?||T<sub>½</sub> = [[ln 2|λ]]<br>T<sub>½</sub> = [[0.6931|0.00866]]<br>T<sub>½</sub> = 80.0 s'}
  ]});
}

/* ================= WATCH: the readings taken for you ================= */
{
  act('experiment','Your turn','Watch the readings','Here the picture shows the nuclei themselves, so the graph is of the number left, N, and there is no background to subtract. Press Experiment, then Play: N is plotted as the sample decays. How long does N take to halve from 400 to 200, and from 200 to 100? Run it again: why are the readings a little different each time? Then try 100 nuclei and 1600 nuclei: which gives the smoother curve, and why? HL: the ln N points lie close to a straight line, and when the run ends the note gives λ from its gradient.');
}
hlFrame('experiment','','Random decay animation: a grid of nuclei decaying at random, with graphs of N and ln N against time');

/* ================= 5. ANALYSIS ================= */
function lab(g0,t,x,y){return '<circle cx="'+g0.gx(x)+'" cy="'+g0.gy(y)+'" r="13" fill="var(--panel)" stroke="var(--ink)" stroke-width="2"/><text x="'+g0.gx(x)+'" y="'+(g0.gy(y)+5)+'" text-anchor="middle" font-size="14" fill="var(--ink)">'+t+'</text>';}
const GB={xMin:0,xMax:320,yMin:0,yMax:90,xTicks:[0,40,80,120,160,200,240,280,320],yTicks:[0,10,20,30,40,50,60,70,80,90],xLabel:'t (s)',yLabel:'Count rate (s⁻¹)',W:560,H:340};
{
  const body=act('graphs','Calculate','With the background still in','The graph shows the count rate read from a counter near a sample. The background has not been subtracted. Read your answers off the graph.');
  const split=mk('div','graph-split');body.appendChild(split);
  const pts=[];for(let t=0;t<=320;t+=4)pts.push([t,10+80*Math.pow(0.5,t/40)]);
  split.appendChild(mk('div','graph-box',lineGraph(Object.assign({label:'Count rate against time: a curve falling from 90 per second and levelling off at 10 per second',segments:[{pts:pts}]},GB)).svg));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'The curve levels off. What is the background count rate?',unit:'s⁻¹',answer:10,working:'After many half-lives almost none of the sample is left to decay, so the counter reads the background alone.<br>background count rate = 10 s⁻¹'},
    {q:'What is the corrected count rate at t = 0?',unit:'s⁻¹',answer:80,working:'reading at t = 0 = 90 s⁻¹<br>corrected count rate = 90 − 10<br>corrected count rate = 80 s⁻¹'},
    {q:'What does the counter read when the corrected count rate has halved?',unit:'s⁻¹',answer:50,working:'half of 80 s⁻¹ = 40 s⁻¹<br>reading = 40 + 10<br>reading = 50 s⁻¹'},
    {q:'What is the half-life of the sample?',unit:'s',answer:40,working:'Read across from 50 to the curve, then down.<br>T<sub>½</sub> = 40 s'}
  ]});
}
{
  const body=act('graphs','Multiple choice','Without the correction','A quick question about the same graph.');
  createPredict({host:body,q:'Kenji forgets the background. He reads the time for the counter’s reading to fall from 90 s⁻¹ to 45 s⁻¹ and calls it the half-life. How does his value compare with the true half-life?',options:[
    {text:'It is too long',correct:true},
    {text:'It is too short',why:'The background does not decay, so the reading falls more slowly than the sample’s own count rate. The reading takes longer to halve.'},
    {text:'It is still right',why:'It would be right only with no background. Here 10 s⁻¹ of every reading does not decay, so the reading takes longer to halve.'}
  ],explain:'The reading is 45 s⁻¹ when the corrected count rate is 35 s⁻¹, which is less than half of 80 s⁻¹. That takes about 48 s, not 40 s. Subtract the background first: 80 s⁻¹ halves to 40 s⁻¹ when the counter reads 50 s⁻¹.'});
}
const GL={xMin:0,xMax:240,yMin:1,yMax:5,xTicks:[0,40,80,120,160,200,240],yTicks:[1,1.5,2,2.5,3,3.5,4,4.5,5],xLabel:'t (s)',yLabel:'ln (count rate / s⁻¹)',W:560,H:340};
{
  const body=act('graphs','Calculate','HL: two nuclides','The graph shows ln (corrected count rate) against t for samples of two nuclides, P and Q, in front of the same GM tube. Use two points on each line.');
  const split=mk('div','graph-split');body.appendChild(split);
  const g0=lineGraph(Object.assign({points:[[0,1]]},GL));
  split.appendChild(mk('div','graph-box',lineGraph(Object.assign({label:'ln of count rate against time for two nuclides: line P falls steeply, line Q falls gently, both from 4.8',segments:[{pts:[[0,4.8],[240,1.2]]},{pts:[[0,4.8],[240,3.6]],cls:'g-line-b'}],
    extra:lab(g0,'P',200,1.8-0.4)+lab(g0,'Q',200,3.8+0.4)},GL)).svg));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'Line P: what is λ?',unit:'s⁻¹',answer:0.015,working:'first point = (0, 4.8)<br>second point = (240, 1.2)<br>λ = ?||gradient = [[change in ln (count rate)|change in t]]<br>gradient = [[1.2 − 4.8|240 − 0]]<br>gradient = −0.0150 s⁻¹<br>gradient = −λ<br>λ = 0.0150 s⁻¹'},
    {q:'Line Q: what is λ?',unit:'s⁻¹',answer:0.005,working:'first point = (0, 4.8)<br>second point = (240, 3.6)<br>λ = ?||gradient = [[change in ln (count rate)|change in t]]<br>gradient = [[3.6 − 4.8|240 − 0]]<br>gradient = −0.00500 s⁻¹<br>gradient = −λ<br>λ = 0.00500 s⁻¹'},
    {q:'What is the half-life of Q?',unit:'s',answer:139,working:'λ = 0.00500 s⁻¹<br>T<sub>½</sub> = ?||T<sub>½</sub> = [[ln 2|λ]]<br>T<sub>½</sub> = [[0.6931|0.00500]]<br>T<sub>½</sub> = 139 s'}
  ]});
}

/* ================= 6. CALCULATE ================= */
{
  const body=act('calculate','Calculate','Half-lives and background','After each half-life the corrected count rate halves. Subtract the background first, and add it back when the question asks what the counter reads. Press New problems for another set.');
  createCalc({host:body,questions:[
    {q:'A nuclide has a half-life of 80 s. The corrected count rate from a sample of it is 320 s⁻¹. What is it 240 s later?',unit:'s⁻¹',answer:40,working:'T<sub>½</sub> = 80 s<br>time = 240 s<br>count rate = ?||number of half-lives = [[240|80]]<br>number of half-lives = 3<br>320 → 160 → 80 → 40<br>count rate = 40 s⁻¹',
     make:rnd=>{const T=calcPick(rnd,[20,30,40,60,80]),n=calcPick(rnd,[2,3,4]),C0=calcPick(rnd,[160,240,320,400,480]),ch=[C0];for(let i=0;i<n;i++)ch.push(ch[i]/2);
       return {q:`A nuclide has a half-life of ${T} s. The corrected count rate from a sample of it is ${C0} s⁻¹. What is it ${T*n} s later?`,unit:'s⁻¹',answer:ch[n],
         working:`T<sub>½</sub> = ${T} s<br>time = ${T*n} s<br>count rate = ?||number of half-lives = [[${T*n}|${T}]]<br>number of half-lives = ${n}<br>${ch.join(' → ')}<br>count rate = ${ch[n]} s⁻¹`};}},
    {q:'A counter near a sample reads 250 s⁻¹. The background count rate is 10 s⁻¹. What does the counter read after 3 half-lives?',unit:'s⁻¹',answer:40,working:'reading = 250 s⁻¹<br>background = 10 s⁻¹<br>reading after 3 half-lives = ?||corrected count rate = 250 − 10<br>corrected count rate = 240 s⁻¹<br>240 → 120 → 60 → 30<br>reading = 30 + 10<br>reading = 40 s⁻¹',
     make:rnd=>{const B=calcPick(rnd,[5,10,20]),n=calcPick(rnd,[2,3]),C0=calcPick(rnd,[160,240,320,400,480]),ch=[C0];for(let i=0;i<n;i++)ch.push(ch[i]/2);
       return {q:`A counter near a sample reads ${C0+B} s⁻¹. The background count rate is ${B} s⁻¹. What does the counter read after ${n} half-lives?`,unit:'s⁻¹',answer:ch[n]+B,
         working:`reading = ${C0+B} s⁻¹<br>background = ${B} s⁻¹<br>reading after ${n} half-lives = ?||corrected count rate = ${C0+B} − ${B}<br>corrected count rate = ${C0} s⁻¹<br>${ch.join(' → ')}<br>reading = ${ch[n]} + ${B}<br>reading = ${ch[n]+B} s⁻¹`};}},
    {q:'A counter near a sample reads 130 s⁻¹. One half-life later it reads 70 s⁻¹. What is the background count rate?',unit:'s⁻¹',answer:10,working:'first reading = 130 s⁻¹<br>reading one half-life later = 70 s⁻¹<br>background count rate = B||The corrected count rate halves in one half-life.<br>70 − B = [[130 − B|2]]<br>140 − 2B = 130 − B<br>140 − 130 = 2B − B<br>B = 10 s⁻¹',
     make:rnd=>{const B=calcPick(rnd,[5,10,15,20]),C=calcPick(rnd,[80,120,160,200]),r1=C+B,r2=C/2+B;
       return {q:`A counter near a sample reads ${r1} s⁻¹. One half-life later it reads ${r2} s⁻¹. What is the background count rate?`,unit:'s⁻¹',answer:B,
         working:`first reading = ${r1} s⁻¹<br>reading one half-life later = ${r2} s⁻¹<br>background count rate = B||The corrected count rate halves in one half-life.<br>${r2} − B = [[${r1} − B|2]]<br>${2*r2} − 2B = ${r1} − B<br>${2*r2} − ${r1} = 2B − B<br>B = ${B} s⁻¹`};}}
  ]});
}
{
  const body=act('calculate','Calculate','HL: the decay constant','Use T<sub>½</sub> = [[ln 2|λ]]. The count rate is proportional to N, and N = N<sub>0</sub>e<sup>−λt</sup>, so C = C<sub>0</sub>e<sup>−λt</sup>, where C is the corrected count rate. Press New problems for another set.');
  createCalc({host:body,questions:[
    {q:'A nuclide has a half-life of 36 s. What is its decay constant?',unit:'s⁻¹',answer:0.0193,working:'T<sub>½</sub> = 36 s<br>λ = ?||T<sub>½</sub> = [[ln 2|λ]]<br>36 = [[0.6931|λ]]<br>λ = [[0.6931|36]]<br>λ = 0.0193 s⁻¹',
     make:rnd=>{const h=calcPick(rnd,[24,36,42,55,62,72,85,98]),lam=Math.LN2/h;
       return {q:`A nuclide has a half-life of ${h} s. What is its decay constant?`,unit:'s⁻¹',answer:+lam.toPrecision(3),
         working:`T<sub>½</sub> = ${h} s<br>λ = ?||T<sub>½</sub> = [[ln 2|λ]]<br>${h} = [[0.6931|λ]]<br>λ = [[0.6931|${h}]]<br>λ = ${g3(lam)} s⁻¹`};}},
    {q:'C₀ = 120 s⁻¹ and λ = 0.015 s⁻¹. What is C after 50 s?',unit:'s⁻¹',answer:56.7,working:'C<sub>0</sub> = 120 s⁻¹<br>λ = 0.015 s⁻¹<br>t = 50 s<br>C = ?||C = C<sub>0</sub>e<sup>−λt</sup><br>C = 120 × e<sup>−0.015 × 50</sup><br>C = 120 × e<sup>−0.75</sup><br>C = 120 × 0.4724<br>C = 56.7 s⁻¹',
     make:rnd=>{const C0=calcPick(rnd,[60,75,90,120,140,160]),lam=calcPick(rnd,[0.008,0.01,0.012,0.015,0.02]),t=calcPick(rnd,[30,50,70,100,130]),p=g4(lam*t),f=Math.exp(-lam*t),C=C0*f;
       return {q:`C₀ = ${C0} s⁻¹ and λ = ${lam} s⁻¹. What is C after ${t} s?`,unit:'s⁻¹',answer:+C.toPrecision(3),
         working:`C<sub>0</sub> = ${C0} s⁻¹<br>λ = ${lam} s⁻¹<br>t = ${t} s<br>C = ?||C = C<sub>0</sub>e<sup>−λt</sup><br>C = ${C0} × e<sup>−${lam} × ${t}</sup><br>C = ${C0} × e<sup>−${p}</sup><br>C = ${C0} × ${g4(f)}<br>C = ${g3(C)} s⁻¹`};}},
    {q:'C falls from 150 s⁻¹ to 30 s⁻¹ in 200 s. What is λ?',unit:'s⁻¹',answer:0.00805,working:'C<sub>0</sub> = 150 s⁻¹<br>C = 30 s⁻¹<br>t = 200 s<br>λ = ?||C = C<sub>0</sub>e<sup>−λt</sup><br>30 = 150 × e<sup>−200λ</sup><br>[[30|150]] = e<sup>−200λ</sup><br>ln 0.2 = −200λ<br>−1.609 = −200λ<br>λ = [[1.609|200]]<br>λ = 0.00805 s⁻¹',
     make:rnd=>{const C0=calcPick(rnd,[60,120,180,240,300]),r=calcPick(rnd,[3,4,5,6]),t=calcPick(rnd,[60,90,120,150,200]),C=C0/r,ln=Math.log(r),lam=ln/t;
       return {q:`C falls from ${C0} s⁻¹ to ${C} s⁻¹ in ${t} s. What is λ?`,unit:'s⁻¹',answer:+lam.toPrecision(3),
         working:`C<sub>0</sub> = ${C0} s⁻¹<br>C = ${C} s⁻¹<br>t = ${t} s<br>λ = ?||C = C<sub>0</sub>e<sup>−λt</sup><br>${C} = ${C0} × e<sup>−${t}λ</sup><br>[[${C}|${C0}]] = e<sup>−${t}λ</sup><br>ln ${g4(1/r)} = −${t}λ<br>−${g4(ln)} = −${t}λ<br>λ = [[${g4(ln)}|${t}]]<br>λ = ${g3(lam)} s⁻¹`};}}
  ]});
}

/* ================= 7. ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Better results or safer?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'Better results',hint:'More accurate or more reliable readings',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps people safe',hint:'Cuts the dose people receive',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Count the background for a long time, such as 2 minutes or more',cat:'a'},
    {id:'2',text:'Subtract the background count rate from every count rate',cat:'a'},
    {id:'3',text:'Fix the sample and the tube in holders so the distance cannot change',cat:'a'},
    {id:'4',text:'Put the sample close to the tube, so each count is large compared with background',cat:'a'},
    {id:'5',text:'Read the half-life at several places on the curve and take the mean',cat:'a'},
    {id:'6',text:'Start each count at exactly the planned time on the stopwatch',cat:'a'},
    {id:'7',text:'Move the sample with tongs, never with your fingers',cat:'s'},
    {id:'8',text:'Keep the sample in its lead box when it is not being counted',cat:'s'},
    {id:'9',text:'Never point the sample at anyone',cat:'s'},
    {id:'10',text:'Stand well back from the sample while the counter is running',cat:'s'}
  ]});
}

/* ================= EXAM PRACTICE ================= */
{
  const body=act('exam','Exam style','The half-life of a radioactive sample','Leon measures the background as 150 counts in 300 s. He then fixes a radioactive sample in front of a GM tube and counts for 10 s, starting a count every 50 s. One reading is missing. Parts (i) and (j) are for HL.');
  body.appendChild(resTable(['t (s)','0','50','100','150'],[['Count in 10 s','645','326',null,'86']]));
  examPart(body,'(a) 2 marks','Outline how Leon should correct his count rates for background radiation.',[
    'Measure the count with the sample removed (shut in its lead box, or far away) for a long time, and work out the background count rate.',
    'Subtract the background count rate from each measured count rate.'
  ]);
  body.appendChild(mk('p','sub','(b) 2 marks'));
  createCalc({host:body,questions:[
    {q:'Calculate the corrected count rate at t = 0.',unit:'s⁻¹',answer:64,working:'background = 150 counts in 300 s<br>count at 0 s = 645 in 10 s<br>corrected count rate = ?||background count rate = [[150|300]]<br>background count rate = 0.50 s⁻¹<br>count rate = [[645|10]]<br>count rate = 64.5 s⁻¹<br>corrected count rate = 64.5 − 0.50<br>corrected count rate = 64.0 s⁻¹'}
  ]});
  body.appendChild(mk('p','sub','(c) 3 marks'));
  createCalc({host:body,questions:[
    {q:'Predict the missing count at 100 s.',unit:'counts',answer:166,working:'background count rate = 0.50 s⁻¹<br>corrected count rate at 0 s = 64.0 s⁻¹<br>count at 50 s = 326<br>count at 100 s = ?||corrected count rate (50 s) = [[326|10]] − 0.50<br>corrected count rate (50 s) = 32.1 s⁻¹<br>factor per 50 s = [[32.1|64.0]]<br>factor per 50 s = 0.5016<br>corrected count rate (100 s) = 32.1 × 0.5016<br>corrected count rate (100 s) = 16.10 s⁻¹<br>count = (16.10 + 0.50) × 10<br>count = 166'}
  ]});
  examPart(body,'(d) 2 marks','Show that the half-life of the sample is about 50 s.',[
    'The corrected count rate falls from 64.0 s⁻¹ at 0 s to 32.1 s⁻¹ at 50 s, which is very nearly half.',
    'It halves again in the next 50 s (to about 16 s⁻¹ at 100 s) and again by 150 s ([[86|10]] − 0.50 = 8.1 s⁻¹): equal times for each halving, so T<sub>½</sub> is about 50 s.'
  ]);
  body.appendChild(mk('p','sub','(e) 1 mark'));
  createCalc({host:body,questions:[
    {q:'Predict the corrected count rate at t = 250 s, five half-lives after the start.',unit:'s⁻¹',answer:2,working:'corrected count rate at 0 s = 64.0 s⁻¹<br>number of half-lives = 5<br>count rate = ?||64 → 32 → 16 → 8 → 4 → 2<br>count rate = 2.0 s⁻¹'}
  ]});
  examPart(body,'(f) 2 marks','Leon leaves the counter running for an hour. State and explain the count rate it shows at the end.',[
    'About 0.50 s⁻¹: the background count rate.',
    'An hour is 72 half-lives, so almost no undecayed nuclei of the sample are left. The background does not decay away, so the reading levels off at the background and never reaches zero.'
  ]);
  examPart(body,'(g) 2 marks','Leon’s points do not lie exactly on a smooth curve. Explain why, and state how the scatter could be made smaller.',[
    'Radioactive decay is random: nobody can say which nucleus will decay next, or when, so each count is a little above or below the expected value.',
    'Use a sample that gives larger counts (a more active sample, or the tube closer to it): the random variation is then a smaller fraction of each count.'
  ]);
  examPart(body,'(h) 6 marks','Describe how Leon should carry out this investigation to obtain an accurate value for the half-life. Include how he should use his results and one safety precaution.',[
    'Measure the background count with the sample shielded (or far away) for several minutes, and find the background count rate.',
    'Fix the sample and the GM tube in holders, close together, and keep the distance the same throughout.',
    'Count for a fixed short time (e.g. 10 s) at regular intervals, recording the time each count starts.',
    'Carry on for at least two or three half-lives, or until the count is close to background.',
    'Subtract the background count rate from each count rate.',
    'Plot the corrected count rate against time and draw a smooth curve of best fit.',
    'Read off the time for the count rate to halve from several places on the curve, and take the mean.',
    'Safety: handle the sample with tongs (or keep it at arm’s length), keep it in its lead box when not in use, never point it at anyone.'
  ]);
  body.appendChild(mk('p','sub','(i) HL, 2 marks'));
  createCalc({host:body,questions:[
    {q:'Calculate the decay constant of the sample. Use a half-life of 50 s.',unit:'s⁻¹',answer:0.0139,working:'T<sub>½</sub> = 50 s<br>λ = ?||T<sub>½</sub> = [[ln 2|λ]]<br>50 = [[0.6931|λ]]<br>λ = [[0.6931|50]]<br>λ = 0.0139 s⁻¹'}
  ]});
  examPart(body,'(j) HL, 3 marks','Explain how Leon could use a straight-line graph of his results to find the decay constant.',[
    'Plot ln (corrected count rate) against t.',
    'The count rate is proportional to N, and N = N<sub>0</sub>e<sup>−λt</sup>, so ln (count rate) = ln (initial count rate) − λt: a straight line.',
    'λ = −gradient of the line of best fit. The line uses every reading, so the random scatter is averaged out.'
  ]);
}
