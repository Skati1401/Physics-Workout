/* IAL: determine the half-life and decay constant of a radioactive sample (spec points 137, 141, 142). Not a numbered core
   practical: it is the experiment behind 142, "determine the half-lives of radioactive isotopes graphically" (TODO.md 5w, part 2).
   Built on the CP15 model (gamma-absorption). The page works with count rate only (Alex, 20 Nov 2026): C is the corrected
   count rate, C = C₀e^(−λt), ln C against t, λ from the gradient and t½ = ln 2 / λ. No A = λN, so no fraction detected is needed.
   The Do the Experiment tab frames animations/random-decay.html?show=measure&level=ial, whose fixed readings (MEAS_SET.ial)
   must match HL_SET below (tools/CORE-PRACTICALS.md, "Measure modes"; the IGCSE and IB pages are practicals/half-life and
   practicals/half-life-ib). Question kinds modelled on the parts listed in tools/handoffs/5w-half-life.md; no past-paper data. */
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
// The half-life animation, framed at IAL level (frameAct cannot add &level).
function hlFrame(panel,show,title){
  const q='level=ial'+(show?'&show='+show:''),w=mk('div','anim-wrap');
  w.innerHTML='<iframe class="anim-frame" src="animations/random-decay.html?embed&'+q+'" title="'+title+'"></iframe><p class="anim-open"><a href="animations/random-decay.html?'+q+'">Open the half-life animation full screen &rarr;</a></p>';
  $('#panel-'+panel+' .acts').appendChild(w);
}

/* ================= 1. OVERVIEW ================= */
{
  const body=act('overview','Fill in the blanks','The practical in one passage','Drag a word into each gap, or tap a word and then tap a gap. Some words are not needed.');
  const parts=[
    'A radioactive sample with a short half-life is fixed in front of a ',['b1','GM tube'],' connected to a counter. The counter counts for 10 s at regular times as the sample decays. The ',['b2','background'],
    ' count rate, measured with the sample shut in its lead box, is taken off every reading to give the corrected count rate, C. Nobody can say which nucleus will decay next, because decay is ',['b3','random'],
    ', but each nucleus has the same chance of decaying each second, so with a very large number of nuclei C falls ',['b4','exponentially'],': C = C₀e<sup>−λt</sup>, where λ is the ',['b5','decay constant'],
    '. Taking natural logs gives ln C = ln C₀ − λt, so a graph of ',['b6','ln C'],' against t is a straight line with a gradient of ',['b7','−λ'],'. The ',['b8','half-life'],
    ' is the time for C to halve, and it equals ln 2 divided by ',['b9','λ'],'.'
  ];
  const cloze=mk('div','cloze'),slots=[],chips=[];
  parts.forEach(p=>{
    if(typeof p==='string')cloze.appendChild(mk('span','',p));
    else{const s=mk('span','blank');cloze.appendChild(s);slots.push({id:p[0],el:s,answer:p[1]});chips.push({id:'c-'+p[0],text:p[1]});}
  });
  ['linearly','C','activity','ln 2'].forEach((t,i)=>chips.push({id:'d'+i,text:t}));
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
    {id:'a',text:'With the sample shut in its lead box, count for 5 minutes and work out the background count rate per second.'},
    {id:'b',text:'Using tongs, fix the sample in its holder close to the window of the GM tube, and start the stopwatch.'},
    {id:'c',text:'Count for 10 s straight away, and record the count against the time the count started.'},
    {id:'d',text:'Without moving the sample or the tube, take another 10 s count every 30 s until the count is close to background.'},
    {id:'e',text:'Divide each count by 10 s and take away the background count rate to get C, then work out ln C.'},
    {id:'f',text:'Plot ln C against t and draw a line of best fit.'},
    {id:'g',text:'Find λ from the gradient of the line, then the half-life from ln 2 divided by λ.'}
  ],constraints:[['a','e'],['b','c'],['c','d'],['d','e'],['e','f'],['f','g']],
  why:'The background can be measured before the sample goes in or after it is put away, as long as it is before you correct the counts. The first count starts as soon as the sample is in place, the sample and tube then stay where they are, and the graph comes once every count is corrected.'});
}
{
  const body=act('method','Match','What each piece of equipment is for','Pair each piece of equipment with its job. Drag one card onto the other, or tap one card and then the other.');
  createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'g',l:'Geiger–Müller tube',r:'Detects the radiation that reaches its window'},
    {id:'c',l:'Counter (scaler)',r:'Counts the pulses from the tube in a set time'},
    {id:'s',l:'Stopwatch',r:'Shows the time since the sample was put in place'},
    {id:'b',l:'Lead box',r:'Shields the sample while the background is counted'},
    {id:'h',l:'Fixed holders',r:'Keep the sample and tube the same distance apart'},
    {id:'t',l:'Tongs',r:'Hold the sample well away from your hand'}
  ]});
}

/* ================= DO THE EXPERIMENT ================= */
// The student reads the counter and the stopwatch in the animation's measure mode and fills in the table, then plots ln C.
// HL_SET must match MEAS_SET.ial in animations/random-decay.html (tools/CORE-PRACTICALS.md, "Measure modes").
const HL_SET={name:'Y',bgT:300,bg:120,every:30,c:[610,455,321,251,184,138,103,78]};   // decay constant 0.0100 per second
const HL_T=HL_SET.c.map((c,k)=>k*HL_SET.every), HL_B=HL_SET.bg/HL_SET.bgT;            // 0, 30 … 210 s; 0.40 per second
const HL_C=HL_SET.c.map(c=>c/10-HL_B), HL_LN=HL_C.map(c=>Math.log(c));                // 60.6 … 7.4 per second; 4.104 … 2.001
let hlTable=null,hlPlotRows=()=>{};
{
  act('do','Your turn','Take your own readings','1. Press Count the background and write down the count after 300 s. 2. Press Put in the sample: the first 10 s count starts at once. 3. Press Take the next count each time, and write each count beside the time its count started. 4. Work out C = [[count|10]] − background count rate, then ln C.');
}
hlFrame('do','measure','Half-life experiment: read the counter and the stopwatch');
{
  const body=act('do','Calculate','Your results table','Write each count exactly as the counter shows it. Give the background count rate to 2 decimal places, C to 1 decimal place and ln C to 3 decimal places. Press Check.');
  const wrap=mk('div','table-scroll');body.appendChild(wrap);
  const cell=(c,k,lab)=>'<td><input class="calc-num-input" data-c="'+c+'" data-k="'+k+'" inputmode="decimal" autocomplete="off" aria-label="'+lab+'"></td>';
  wrap.innerHTML='<table class="units res-tbl ga-tbl"><thead><tr><th>Background count in 300 s</th><th>Background count rate (s⁻¹)</th></tr></thead><tbody><tr>'+
    cell('bg',0,'Background count in 300 seconds')+cell('bgr',0,'Background count rate, per second')+'</tr></tbody></table>'+
    '<table class="units res-tbl ga-tbl" style="margin-top:10px"><thead><tr><th>t (s)</th><th>Count in 10 s</th><th>C (s⁻¹)</th><th>ln (C / s⁻¹)</th></tr></thead><tbody>'+
    HL_T.map((t,k)=>'<tr><td class="given">'+t+'</td>'+cell('n',k,'Count in 10 seconds, started at '+t+' seconds')+cell('i',k,'Corrected count rate C at '+t+' seconds')+cell('l',k,'ln C at '+t+' seconds')+'</tr>').join('')+'</tbody></table>';
  const inp=(c,k)=>$('input[data-c="'+c+'"][data-k="'+k+'"]',wrap), all=()=>$$('input',wrap);
  const val=e=>{const t=e.value.trim().replace(/[−–]/g,'-').replace(',','.');return t===''||!/^-?(\d+\.?\d*|\.\d+)$/.test(t)?NaN:parseFloat(t);};
  // every cell is right to the accuracy asked for: counts exactly, the background rate to 0.005, C to 0.05, ln C to 0.005
  const want=(c,k)=>c==='bg'?[HL_SET.bg,0.5]:c==='bgr'?[HL_B,0.005]:c==='n'?[HL_SET.c[k],0.5]:c==='i'?[HL_C[k],0.05]:[HL_LN[k],0.005];
  const show=(c,k)=>c==='bg'||c==='n'?String(want(c,k)[0]):c==='l'?want(c,k)[0].toFixed(3):c==='bgr'?want(c,k)[0].toFixed(2):want(c,k)[0].toFixed(1);
  const b=bar(body,[{label:'Check table',primary:true,fn:check},{label:'Clear',fn:reset}]);
  const ans=answerBtn(b,()=>{
    all().forEach(e=>{if(e.disabled)return;e.value=show(e.dataset.c,+e.dataset.k);e.disabled=true;e.classList.add('is-shown');e.classList.remove('is-wrong');});
    b.say('Answers shown (dashed). Now plot ln C against t below.','');hlPlotRows();
  });
  function check(){
    let ok=0,bad=0,blank=0;
    all().forEach(e=>{
      if(e.disabled){ok++;return;}
      if(e.value.trim()===''){blank++;return;}
      const v=val(e),w=want(e.dataset.c,+e.dataset.k);
      if(isFinite(v)&&Math.abs(v-w[0])<=w[1]+1e-9){e.disabled=true;e.classList.remove('is-wrong');e.classList.add('pop');ok++;}
      else{bad++;e.classList.add('is-wrong');}
    });
    const n=all().length;
    if(ok===n){b.say('All correct. Now plot ln C against t.','good');celebrate(b.msg);ans.off();}
    else{b.say(ok+' of '+n+' correct'+(blank?', '+blank+' left blank':'')+'.'+(bad?' The background was counted for 300 s, so divide it by 300 for a rate per second. Divide each count by 10 s, then take away the background count rate to get C. Then take ln of C.':''),bad?'bad':'');ans.on();}
    hlPlotRows();
  }
  // Show answer is always there for this table (as on CP15), so students can skip it and go on to the plot
  function reset(){all().forEach(e=>{e.value='';e.disabled=false;e.classList.remove('is-wrong','is-shown','pop');});ans.on();b.say('','');hlPlotRows();}
  all().forEach(e=>e.addEventListener('input',()=>e.classList.remove('is-wrong')));
  ans.on();
  hlTable={ln:k=>{const e=inp('l',k);return e.value.trim()===''||!e.disabled?null:e.value.trim();}};
  track(body,{reset:reset,
    getState:()=>({v:all().map(e=>e.value),ok:all().map(e=>e.disabled),sh:all().map(e=>e.classList.contains('is-shown'))}),
    setState:s=>{reset();all().forEach((e,i)=>{if(!s||!s.v||typeof s.v[i]!=='string')return;e.value=s.v[i];if(s.ok&&s.ok[i]){e.disabled=true;if(s.sh&&s.sh[i])e.classList.add('is-shown');}});if(all().every(e=>e.disabled)){b.say('All correct. Now plot ln C against t.','good');ans.off();}hlPlotRows();},
    isDone:()=>all().every(e=>e.disabled)});
}
{
  // the same steps as a worked answer: from the decay equation to y = mx + c
  const body=act('do','Explain','Why plot ln C?','The tube detects a fixed fraction of the decays, so C falls in the same way as the activity, A = A<sub>0</sub>e<sup>−λt</sup>. So C = C<sub>0</sub>e<sup>−λt</sup>, which is a curve. Take ln of each side:');
  body.insertAdjacentHTML('beforeend',
    '<div class="ln-steps"><span>ln C</span><span>=</span><span>ln (C<sub>0</sub>e<sup>−λt</sup>)</span>'+
    '<span>ln C</span><span>=</span><span>ln C<sub>0</sub> + ln (e<sup>−λt</sup>)</span>'+
    '<span>ln C</span><span>=</span><span>ln C<sub>0</sub> − λt</span></div>'+
    '<p class="act-intro">In the order of y = mx + c:</p>'+
    '<div class="ln-match"><span>ln C</span><span>=</span><span>−λ</span><span>t</span><span>+</span><span>ln C<sub>0</sub></span>'+
    '<span>y</span><span>=</span><span>m</span><span>x</span><span>+</span><span>c</span></div>'+
    '<p class="act-intro">So ln C against t is a straight line: gradient = −λ, intercept = ln C<sub>0</sub>. A straight line shows the decay is exponential.</p>');
}
{
  const body=act('do','Plot','Plot your results','Plot ln C against t from your table as small crosses. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');
  createPlot({host:body,next:' Now find λ from the line of best fit below.',
    points:HL_T.map((t,k)=>({x:t,y:+HL_LN[k].toFixed(3)})),
    rowText:p=>{const k=HL_T.indexOf(p.x),e=hlTable&&hlTable.ln(k);return p.x+' s, '+(e?'ln C = '+e:'your ln C');},
    graph:{xMin:0,xMax:210,yMin:1.6,yMax:4.4,xTicks:[0,30,60,90,120,150,180,210],yTicks:[1.6,2.0,2.4,2.8,3.2,3.6,4.0,4.4],minor:[10,0.1],snap:[10,0.05],xLabel:'t (s)',yLabel:'ln (C / s⁻¹)',W:560,H:340}});
  // the animation and the results table side by side, so students read and write without scrolling
  // the Your turn card sits above the animation in the left column, so the results table starts at the top on the right
  {const fr=$('#panel-do .anim-wrap'),tb=$('#panel-do .ga-tbl').closest('.act'),yt=$('#panel-do .act[data-title="Take your own readings"]');
   if(fr&&tb){const sp=mk('div','hk-split'),left=mk('div','ga-left');fr.parentNode.insertBefore(sp,fr);sp.appendChild(left);if(yt)left.appendChild(yt);left.appendChild(fr);sp.appendChild(tb);}}
  hlPlotRows=()=>{$$('.plot-row',body).forEach((li,k)=>{const e=hlTable&&hlTable.ln(k),s=li.firstElementChild;if(s)s.textContent=HL_T[k]+' s, '+(e?'ln C = '+e:'your ln C');});};
  hlPlotRows();
}
{
  const body=act('do','Calculate','λ and the half-life from your line','A good line of best fit through your points passes through (30, 3.795) and (180, 2.294). Read nothing else off the graph.');
  createCalc({host:body,questions:[
    {q:'What is the gradient of the line?',unit:'s⁻¹',answer:-0.0100,working:'first point = (30, 3.795)<br>second point = (180, 2.294)<br>gradient = ?||gradient = [[change in ln C|change in t]]<br>gradient = [[2.294 − 3.795|180 − 30]]<br>gradient = [[−1.501|150]]<br>gradient = −0.0100 s⁻¹'},
    {q:'What is the decay constant, λ?',unit:'s⁻¹',answer:0.0100,working:'gradient = −0.0100 s⁻¹<br>λ = ?||gradient = −λ<br>−0.0100 = −λ<br>λ = 0.0100 s⁻¹'},
    {q:'What is the half-life of sample Y?',unit:'s',answer:69.3,working:'λ = 0.0100 s⁻¹<br>t<sub>½</sub> = ?||λ = [[ln 2|t<sub>½</sub>]]<br>0.0100 = [[0.6931|t<sub>½</sub>]]<br>t<sub>½</sub> = [[0.6931|0.0100]]<br>t<sub>½</sub> = 69.3 s'}
  ]});
}

/* ================= WATCH: the readings taken for you ================= */
{
  act('experiment','Your turn','Watch the readings','Here the picture shows the nuclei themselves, so the graph is of the number left, N, and there is no background to take off. Press Experiment, then Play: N and ln N are plotted as the sample decays. When the run ends, the note gives λ from the gradient of the ln N line, and the half-life. Run it again: why are they a little different each time? Then try 100 nuclei and 1600 nuclei: which gives the better straight line, and why?');
}
hlFrame('experiment','','Random decay animation: a grid of nuclei decaying at random, with graphs of N and ln N against time');

/* ================= 5. ANALYSIS ================= */
function lab(g0,t,x,y){return '<circle cx="'+g0.gx(x)+'" cy="'+g0.gy(y)+'" r="13" fill="var(--panel)" stroke="var(--ink)" stroke-width="2"/><text x="'+g0.gx(x)+'" y="'+(g0.gy(y)+5)+'" text-anchor="middle" font-size="14" fill="var(--ink)">'+t+'</text>';}
const GI={xMin:0,xMax:250,yMin:0,yMax:80,xTicks:[0,50,100,150,200,250],yTicks:[0,10,20,30,40,50,60,70,80],xLabel:'t (s)',yLabel:'C (s⁻¹)',W:560,H:340};
{
  const body=act('graphs','Calculate','A graph of C against t','The graph shows the corrected count rate, C, from a sample. Read your answers off the graph.');
  const split=mk('div','graph-split');body.appendChild(split);
  const pts=[];for(let i=0;i<=100;i++){const x=i*2.5;pts.push([x,80*Math.pow(0.5,x/50)]);}
  split.appendChild(mk('div','graph-box',lineGraph(Object.assign({label:'Corrected count rate against time, a curve falling from 80 per second',segments:[{pts:pts}]},GI)).svg));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'How long does C take to fall from 80 s⁻¹ to 40 s⁻¹?',unit:'s',answer:50,working:'Read across from 40 to the curve, then down.<br>C = 80 s⁻¹ at t = 0<br>C = 40 s⁻¹ at t = 50 s<br>time = 50 s'},
    {q:'How long does C take to fall from 40 s⁻¹ to 20 s⁻¹?',unit:'s',answer:50,working:'C = 40 s⁻¹ at t = 50 s<br>C = 20 s⁻¹ at t = 100 s<br>time = 100 − 50<br>time = 50 s<br>The two times are equal: the half-life is constant, so the decay is exponential.'},
    {q:'Use the half-life to find λ.',unit:'s⁻¹',answer:0.0139,working:'t<sub>½</sub> = 50 s<br>λ = ?||λ = [[ln 2|t<sub>½</sub>]]<br>λ = [[0.6931|50]]<br>λ = 0.0139 s⁻¹'}
  ]});
}
const GL={xMin:0,xMax:200,yMin:1,yMax:5.5,xTicks:[0,50,100,150,200],yTicks:[1,1.5,2,2.5,3,3.5,4,4.5,5,5.5],xLabel:'t (s)',yLabel:'ln (C / s⁻¹)',W:560,H:340};
{
  const body=act('graphs','Calculate','Two isotopes','The graph shows ln C against t for samples of two isotopes, P and Q, in front of the same GM tube. Use two points on each line.');
  const split=mk('div','graph-split');body.appendChild(split);
  const g0=lineGraph(Object.assign({points:[[0,1]]},GL));
  split.appendChild(mk('div','graph-box',lineGraph(Object.assign({label:'ln C against time for two isotopes: line P falls steeply, line Q falls gently, both from 5.0',segments:[{pts:[[0,5.0],[200,2.0]]},{pts:[[0,5.0],[200,4.0]],cls:'g-line-b'}],
    extra:lab(g0,'P',170,2.45-0.4)+lab(g0,'Q',170,4.15+0.4)},GL)).svg));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'Line P: what is λ?',unit:'s⁻¹',answer:0.015,working:'first point = (0, 5.0)<br>second point = (200, 2.0)<br>λ = ?||gradient = [[change in ln C|change in t]]<br>gradient = [[2.0 − 5.0|200 − 0]]<br>gradient = −0.0150 s⁻¹<br>gradient = −λ<br>λ = 0.0150 s⁻¹'},
    {q:'Line Q: what is λ?',unit:'s⁻¹',answer:0.005,working:'first point = (0, 5.0)<br>second point = (200, 4.0)<br>λ = ?||gradient = [[change in ln C|change in t]]<br>gradient = [[4.0 − 5.0|200 − 0]]<br>gradient = −0.00500 s⁻¹<br>gradient = −λ<br>λ = 0.00500 s⁻¹'},
    {q:'What is the half-life of P?',unit:'s',answer:46.2,working:'λ = 0.0150 s⁻¹<br>t<sub>½</sub> = ?||λ = [[ln 2|t<sub>½</sub>]]<br>0.0150 = [[0.6931|t<sub>½</sub>]]<br>t<sub>½</sub> = [[0.6931|0.0150]]<br>t<sub>½</sub> = 46.2 s'}
  ]});
}
{
  const body=act('graphs','Multiple choice','Reading the lines','A quick question about the same graph.');
  createPredict({host:body,q:'A third sample, R, starts with the same count rate as P but has a shorter half-life. How does its line compare with P’s?',options:[
    {text:'Steeper, from the same intercept',correct:true},
    {text:'Less steep, from the same intercept',why:'A shorter half-life means a larger λ, because λ = [[ln 2|t<sub>½</sub>]]. The gradient is −λ, so the line is steeper.'},
    {text:'Parallel, from a lower intercept',why:'The intercept is ln C<sub>0</sub>, and the count rate at the start is the same. It is the gradient, −λ, that changes.'},
    {text:'Parallel, from a higher intercept',why:'The intercept is ln C<sub>0</sub>, and the count rate at the start is the same. It is the gradient, −λ, that changes.'}
  ],explain:'λ = [[ln 2|t<sub>½</sub>]], so a shorter half-life means a larger decay constant. The gradient of ln C against t is −λ, so R’s line falls more steeply. Both lines start at ln C<sub>0</sub>, which is the same.'});
}

/* ================= 6. CALCULATE ================= */
{
  const body=act('calculate','Calculate','Decay constant and count rate','Use C = C<sub>0</sub>e<sup>−λt</sup> and λ = [[ln 2|t<sub>½</sub>]]. C is the corrected count rate, unless the question says otherwise. Press New problems for another set.');
  createCalc({host:body,questions:[
    {q:'An isotope has a half-life of 52 s. What is its decay constant?',unit:'s⁻¹',answer:0.0133,working:'t<sub>½</sub> = 52 s<br>λ = ?||λ = [[ln 2|t<sub>½</sub>]]<br>λ = [[0.6931|52]]<br>λ = 0.0133 s⁻¹',
     make:rnd=>{const h=calcPick(rnd,[26,38,45,52,56,64,75,88]),lam=Math.LN2/h;
       return {q:`An isotope has a half-life of ${h} s. What is its decay constant?`,unit:'s⁻¹',answer:+lam.toPrecision(3),
         working:`t<sub>½</sub> = ${h} s<br>λ = ?||λ = [[ln 2|t<sub>½</sub>]]<br>λ = [[0.6931|${h}]]<br>λ = ${g3(lam)} s⁻¹`};}},
    {q:'C₀ = 85 s⁻¹ and λ = 0.012 s⁻¹. What is C after 90 s?',unit:'s⁻¹',answer:28.9,working:'C<sub>0</sub> = 85 s⁻¹<br>λ = 0.012 s⁻¹<br>t = 90 s<br>C = ?||C = C<sub>0</sub>e<sup>−λt</sup><br>C = 85 × e<sup>−0.012 × 90</sup><br>C = 85 × e<sup>−1.08</sup><br>C = 85 × 0.3396<br>C = 28.9 s⁻¹',
     make:rnd=>{const C0=calcPick(rnd,[60,75,85,96,110,125]),lam=calcPick(rnd,[0.008,0.01,0.012,0.015,0.02]),t=calcPick(rnd,[40,60,90,120,150]),p=g4(lam*t),f=Math.exp(-lam*t),C=C0*f;
       return {q:`C₀ = ${C0} s⁻¹ and λ = ${lam} s⁻¹. What is C after ${t} s?`,unit:'s⁻¹',answer:+C.toPrecision(3),
         working:`C<sub>0</sub> = ${C0} s⁻¹<br>λ = ${lam} s⁻¹<br>t = ${t} s<br>C = ?||C = C<sub>0</sub>e<sup>−λt</sup><br>C = ${C0} × e<sup>−${lam} × ${t}</sup><br>C = ${C0} × e<sup>−${p}</sup><br>C = ${C0} × ${g4(f)}<br>C = ${g3(C)} s⁻¹`};}},
    {q:'C falls from 96 s⁻¹ to 24 s⁻¹ in 150 s. What is λ?',unit:'s⁻¹',answer:0.00924,working:'C<sub>0</sub> = 96 s⁻¹<br>C = 24 s⁻¹<br>t = 150 s<br>λ = ?||C = C<sub>0</sub>e<sup>−λt</sup><br>24 = 96 × e<sup>−150λ</sup><br>[[24|96]] = e<sup>−150λ</sup><br>ln 0.25 = −150λ<br>−1.386 = −150λ<br>λ = [[1.386|150]]<br>λ = 0.00924 s⁻¹',
     make:rnd=>{const C0=calcPick(rnd,[60,120,180,240,300]),r=calcPick(rnd,[3,4,5,6]),t=calcPick(rnd,[60,90,120,150,200]),C=C0/r,ln=Math.log(r),lam=ln/t;
       return {q:`C falls from ${C0} s⁻¹ to ${C} s⁻¹ in ${t} s. What is λ?`,unit:'s⁻¹',answer:+lam.toPrecision(3),
         working:`C<sub>0</sub> = ${C0} s⁻¹<br>C = ${C} s⁻¹<br>t = ${t} s<br>λ = ?||C = C<sub>0</sub>e<sup>−λt</sup><br>${C} = ${C0} × e<sup>−${t}λ</sup><br>[[${C}|${C0}]] = e<sup>−${t}λ</sup><br>ln ${g4(1/r)} = −${t}λ<br>−${g4(ln)} = −${t}λ<br>λ = [[${g4(ln)}|${t}]]<br>λ = ${g3(lam)} s⁻¹`};}},
    {q:'Priya counts 412 in 10 s from a sample. The background was 96 counts in 240 s. What is the corrected count rate?',unit:'s⁻¹',answer:40.8,working:'count = 412 in 10 s<br>background = 96 counts in 240 s<br>C = ?||count rate = [[412|10]]<br>count rate = 41.2 s⁻¹<br>background count rate = [[96|240]]<br>background count rate = 0.4 s⁻¹<br>C = 41.2 − 0.4<br>C = 40.8 s⁻¹',
     make:rnd=>{const who=calcPick(rnd,['Priya','Hugo','Clara','Mateo','Sofia','Finn','Meera','Luca']),raw=calcPick(rnd,[186,238,294,357,412,468,523]),b=calcPick(rnd,[0.3,0.4,0.5,0.6]),T=calcPick(rnd,[120,180,240,300]),bc=Math.round(b*T),C=raw/10-b;
       return {q:`${who} counts ${raw} in 10 s from a sample. The background was ${bc} counts in ${T} s. What is the corrected count rate?`,unit:'s⁻¹',answer:+C.toFixed(1),
         working:`count = ${raw} in 10 s<br>background = ${bc} counts in ${T} s<br>C = ?||count rate = [[${raw}|10]]<br>count rate = ${raw/10} s⁻¹<br>background count rate = [[${bc}|${T}]]<br>background count rate = ${b} s⁻¹<br>C = ${raw/10} − ${b}<br>C = ${C.toFixed(1)} s⁻¹`};}}
  ]});
}

/* ================= 7. ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Better results or safer?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'Better results',hint:'More accurate or more reliable readings',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps people safe',hint:'Cuts the dose people receive',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Count the background for a long time, such as 5 minutes',cat:'a'},
    {id:'2',text:'Take the background count rate away from every count rate, so C is not too large',cat:'a'},
    {id:'3',text:'Fix the sample and the tube in holders so the distance cannot change',cat:'a'},
    {id:'4',text:'Put the sample close to the tube, so each count is large compared with background',cat:'a'},
    {id:'5',text:'Find λ from the gradient of a line of best fit, not from two readings',cat:'a'},
    {id:'6',text:'Start each count at exactly the planned time on the stopwatch',cat:'a'},
    {id:'7',text:'Move the sample with tongs, never with your fingers',cat:'s'},
    {id:'8',text:'Keep the sample in its lead box when it is not being counted',cat:'s'},
    {id:'9',text:'Never point the sample at anyone',cat:'s'},
    {id:'10',text:'Stand well back from the sample while the counter is running',cat:'s'}
  ]});
}

/* ================= EXAM PRACTICE ================= */
{
  const body=act('exam','Exam style','The half-life of a radioactive sample','Arjun measures the background as 135 counts in 5 minutes. He then fixes a radioactive sample in front of a GM tube and counts for 10 s, starting a count every 60 s. One reading is missing.');
  body.appendChild(resTable(['t (s)','0','60','120','180','240'],[['Count in 10 s','525','326',null,'128','81']]));
  body.appendChild(mk('p','sub','(a) 1 mark'));
  createCalc({host:body,questions:[
    {q:'Calculate the background count rate, in counts per second.',unit:'s⁻¹',answer:0.45,working:'background = 135 counts in 5 min<br>5 min = 300 s<br>background count rate = ?||background count rate = [[135|300]]<br>background count rate = 0.45 s⁻¹'}
  ]});
  body.appendChild(mk('p','sub','(b) 3 marks'));
  createCalc({host:body,questions:[
    {q:'Predict the missing count at 120 s.',unit:'counts',answer:203,working:'background count rate = 0.45 s⁻¹<br>count at 0 s = 525<br>count at 60 s = 326<br>count at 120 s = ?||C (0 s) = [[525|10]] − 0.45<br>C (0 s) = 52.05 s⁻¹<br>C (60 s) = [[326|10]] − 0.45<br>C (60 s) = 32.15 s⁻¹<br>factor per 60 s = [[32.15|52.05]]<br>factor per 60 s = 0.6177<br>C (120 s) = 32.15 × 0.6177<br>C (120 s) = 19.86 s⁻¹<br>count = (19.86 + 0.45) × 10<br>count = 203'}
  ]});
  examPart(body,'(c) 3 marks','The corrected count rate is given by C = C<sub>0</sub>e<sup>−λt</sup>. Explain why Arjun should plot ln C against t, and how he can find λ from his graph.',[
    'Taking natural logs gives ln C = ln C<sub>0</sub> − λt.',
    'This has the form y = mx + c, so ln C against t is a straight line (if the decay is exponential).',
    'The gradient = −λ, so λ = −gradient (and the intercept is ln C<sub>0</sub>).'
  ]);
  body.appendChild(mk('p','sub','(d) 3 marks'));
  createCalc({host:body,questions:[
    {q:'Use the readings at 0 and 240 s to calculate λ.',unit:'s⁻¹',answer:0.00799,working:'background count rate = 0.45 s⁻¹<br>count at 0 s = 525<br>count at 240 s = 81<br>λ = ?||C (0 s) = 52.05 s⁻¹<br>ln C (0 s) = 3.952<br>C (240 s) = [[81|10]] − 0.45<br>C (240 s) = 7.65 s⁻¹<br>ln C (240 s) = 2.035<br>gradient = [[2.035 − 3.952|240 − 0]]<br>gradient = −0.00799 s⁻¹<br>gradient = −λ<br>λ = 0.00799 s⁻¹'}
  ]});
  body.appendChild(mk('p','sub','(e) 2 marks'));
  createCalc({host:body,questions:[
    {q:'Calculate the half-life of the sample.',unit:'s',answer:86.7,working:'λ = 0.00799 s⁻¹<br>t<sub>½</sub> = ?||λ = [[ln 2|t<sub>½</sub>]]<br>0.00799 = [[0.6931|t<sub>½</sub>]]<br>t<sub>½</sub> = [[0.6931|0.00799]]<br>t<sub>½</sub> = 86.7 s'}
  ]});
  examPart(body,'(f) 6 marks','Describe how Arjun should carry out this investigation to obtain an accurate value for the half-life. Include how he should use his results and one safety precaution.',[
    'Measure the background count with the sample shielded (or far away) for several minutes, and find the background count rate.',
    'Fix the sample and the GM tube in holders, close together, and keep the distance the same throughout.',
    'Count for a fixed short time (e.g. 10 s) at regular intervals, recording the time each count starts.',
    'Carry on for at least two or three half-lives, or until the count is close to background.',
    'Subtract the background count rate from each count rate to get C.',
    'Plot ln C against t and draw a line of best fit; λ = −gradient.',
    'Half-life t<sub>½</sub> = [[ln 2|λ]] (or plot C against t and find the mean time for C to halve, from several places on the curve).',
    'Safety: handle the sample with tongs (or keep it at arm’s length), keep it in its lead box when not in use, never point it at anyone.'
  ]);
  examPart(body,'(g) 2 marks','Radioactive decay is random. Explain why a value for λ can still be found from Arjun’s readings.',[
    'Each nucleus has a fixed probability of decaying in each second (this probability is λ), although nobody can say which nucleus will decay next, or when.',
    'The sample contains a very large number of nuclei, so the fraction that decays each second is (very nearly) constant: the count rate follows a predictable exponential curve, with only small random fluctuations about it.'
  ]);
  examPart(body,'(h) 2 marks','Arjun suggests counting for 60 s each time instead of 10 s. Give one advantage and one disadvantage of this change.',[
    'Advantage: each count is larger, so the random variation is a smaller percentage of the count (and the background matters less).',
    'Disadvantage: the count rate falls a lot during 60 s (the half-life is only about 87 s), so each reading is an average over the count and not the count rate at one time. Fewer readings also fit into the experiment.'
  ]);
}
