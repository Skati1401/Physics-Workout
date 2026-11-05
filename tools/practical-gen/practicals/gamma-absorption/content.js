/* IAL CP15 Investigate the absorption of gamma radiation by lead (spec points 137, 138, 140, 141).
   Built from Alex's worksheet (5.2 Nuclear Decay, CP15): I = I₀e^(−μx), background subtracted, ln I against x, μ and x½.
   The Do the Experiment tab frames animations/gamma-radiation.html?show=measure, whose fixed counts must match GA_BG and GA_C. */
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

/* ================= 1. OVERVIEW ================= */
{
  const body=act('overview','Fill in the blanks','The practical in one passage','Drag a word into each gap, or tap a word and then tap a gap. Some words are not needed.');
  const parts=[
    'Gamma rays from a sealed ',['b1','cobalt-60'],' source pass through sheets of lead to a ',['b2','GM tube'],' connected to a counter. First measure the ',['b3','background'],
    ' count with the source put away, and take it off every count to get the corrected count rate, I. Keep the ',['b4','distance'],
    ' from the source to the tube the same throughout, because the count rate also falls as the tube moves away. Count for 60 s with no lead, then add lead a few millimetres at a time, measuring its thickness, x, with a ',['b5','micrometer'],
    '. Each extra millimetre absorbs the same fraction of the gamma rays, so I falls ',['b6','exponentially'],'. Taking natural logs gives ln I = ln I₀ − μx, so a graph of ',['b7','ln I'],
    ' against x is a straight line with a gradient of ',['b8','−μ'],'. The half-thickness, x½, is the thickness of lead that ',['b9','halves'],' the count rate.'
  ];
  const cloze=mk('div','cloze'),slots=[],chips=[];
  parts.forEach(p=>{
    if(typeof p==='string')cloze.appendChild(document.createTextNode(p));
    else{const s=mk('span','blank');cloze.appendChild(s);slots.push({id:p[0],el:s,answer:p[1]});chips.push({id:'c-'+p[0],text:p[1]});}
  });
  ['linearly','I','μ','doubles'].forEach((t,i)=>chips.push({id:'d'+i,text:t}));
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
    {id:'a',text:'With the source in its lead box, count for 5 minutes and work out the background count rate per minute.'},
    {id:'b',text:'Using tongs, put the source in its holder a fixed distance (e.g. 10 cm) from the window of the GM tube.'},
    {id:'c',text:'Count for 60 s with no lead between the source and the tube.'},
    {id:'d',text:'Without moving the source or the tube, put a sheet of lead between them, measure its thickness with a micrometer, and count for 60 s.'},
    {id:'e',text:'Add more lead a few millimetres at a time, measuring the total thickness and counting for 60 s each time.'},
    {id:'f',text:'Take the background count rate away from every count to get I, then work out ln I.'},
    {id:'g',text:'Plot ln I against x, draw a line of best fit and find μ from its gradient.'}
  ],constraints:[['a','f'],['b','c'],['c','d'],['d','e'],['e','f'],['f','g']],
  why:'The background can be measured first or last, as long as it is before you correct the counts. The source and tube stay in the same place while only the lead changes, and the graph comes once every count is corrected.'});
}
{
  const body=act('method','Match','What each piece of equipment is for','Pair each piece of equipment with its job. Drag one card onto the other, or tap one card and then the other.');
  createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'s',l:'Cobalt-60 source',r:'Gives out the gamma rays that pass through the lead'},
    {id:'g',l:'Geiger–Müller tube',r:'Detects the gamma rays that reach its window'},
    {id:'c',l:'Counter (scaler)',r:'Counts the pulses from the tube in a set time'},
    {id:'m',l:'Micrometer',r:'Measures the thickness of the lead to 0.01 mm'},
    {id:'h',l:'Fixed holders on a bench',r:'Keep the source and tube the same distance apart'},
    {id:'t',l:'Tongs',r:'Hold the source well away from your hand'}
  ]});
}


/* ================= DO THE EXPERIMENT (Alex, 5 Nov 2026) ================= */
// The student reads the counter in the animation's measure mode (?show=measure), fills in the table and plots ln I.
// GA_BG and GA_C must match MEAS_BG and MEAS_C in animations/gamma-radiation.html.
const GA_BG=120, GA_X=[0,4,8,12,16,20,24], GA_C=[476,366,290,224,181,141,112];
const GA_BGR=GA_BG/5, GA_I=GA_C.map(c=>c-GA_BGR), GA_LN=GA_I.map(i=>Math.log(i));
let gaTable=null,gaPlotRows=()=>{};
{
  act('do','Your turn','Take your own readings','1. Measure background (5 minutes). 2. Count for 60 s with no lead, then after each extra 4 mm, up to 24 mm. 3. Write each count in the table, then work out I = count − background count rate, and ln I.');
}
frameAct('do','animations/gamma-radiation.html','measure','Gamma absorption experiment: read the counter','gamma radiation',false);
{
  const body=act('do','Calculate','Your results table','Write each count exactly as the counter shows it. Give I to 1 decimal place and ln I to 3 decimal places. Press Check.');
  const wrap=mk('div','table-scroll');body.appendChild(wrap);
  const cell=(c,k,lab)=>'<td><input class="calc-num-input" data-c="'+c+'" data-k="'+k+'" inputmode="decimal" autocomplete="off" aria-label="'+lab+'"></td>';
  wrap.innerHTML='<table class="units res-tbl ga-tbl"><thead><tr><th>Background count in 300 s</th><th>Background count rate (min⁻¹)</th></tr></thead><tbody><tr>'+
    cell('bg',0,'Background count in 300 s')+cell('bgr',0,'Background count rate, per minute')+'</tr></tbody></table>'+
    '<table class="units res-tbl ga-tbl" style="margin-top:10px"><thead><tr><th>x (mm)</th><th>Count in 60 s</th><th>I (min⁻¹)</th><th>ln (I / min⁻¹)</th></tr></thead><tbody>'+
    GA_X.map((x,k)=>'<tr><td class="given">'+x+'</td>'+cell('n',k,'Count in 60 s with '+x+' mm of lead')+cell('i',k,'Corrected count rate I with '+x+' mm of lead')+cell('l',k,'ln I with '+x+' mm of lead')+'</tr>').join('')+'</tbody></table>';
  const inp=(c,k)=>$('input[data-c="'+c+'"][data-k="'+k+'"]',wrap), all=()=>$$('input',wrap);
  const val=e=>{const t=e.value.trim().replace(/[−–]/g,'-').replace(',','.');return t===''||!/^-?(\d+\.?\d*|\.\d+)$/.test(t)?NaN:parseFloat(t);};
  // every cell is right to the accuracy asked for: counts exactly, I to 0.05, ln I to 0.005
  const want=(c,k)=>c==='bg'?[GA_BG,0.5]:c==='bgr'?[GA_BGR,0.05]:c==='n'?[GA_C[k],0.5]:c==='i'?[GA_I[k],0.05]:[GA_LN[k],0.005];
  const show=(c,k)=>c==='bg'||c==='n'?String(want(c,k)[0]):c==='l'?want(c,k)[0].toFixed(3):want(c,k)[0].toFixed(1);
  const b=bar(body,[{label:'Check table',primary:true,fn:check},{label:'Clear',fn:reset}]);
  const ans=answerBtn(b,()=>{
    all().forEach(e=>{if(e.disabled)return;e.value=show(e.dataset.c,+e.dataset.k);e.disabled=true;e.classList.add('is-shown');e.classList.remove('is-wrong');});
    b.say('Answers shown (dashed). Now answer the questions and plot ln I below.','');gaPlotRows();
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
    if(ok===n){b.say('All correct. Now plot ln I against x.','good');celebrate(b.msg);ans.off();}
    else{b.say(ok+' of '+n+' correct'+(blank?', '+blank+' left blank':'')+'.'+(bad?' The background was counted for 5 minutes, so divide by 5 for a rate per minute. I = count − background rate; then take ln of I.':''),bad?'bad':'');ans.on();}
    gaPlotRows();
  }
  // Show answer is always there for this table (Alex, 5 Nov 2026), so students can skip it and go on to the plot
  function reset(){all().forEach(e=>{e.value='';e.disabled=false;e.classList.remove('is-wrong','is-shown','pop');});ans.on();b.say('','');gaPlotRows();}
  all().forEach(e=>e.addEventListener('input',()=>e.classList.remove('is-wrong')));
  ans.on();
  gaTable={ln:k=>{const e=inp('l',k);return e.value.trim()===''||!e.disabled?null:e.value.trim();}};
  track(body,{reset:reset,
    getState:()=>({v:all().map(e=>e.value),ok:all().map(e=>e.disabled),sh:all().map(e=>e.classList.contains('is-shown'))}),
    setState:s=>{reset();all().forEach((e,i)=>{if(!s||!s.v||typeof s.v[i]!=='string')return;e.value=s.v[i];if(s.ok&&s.ok[i]){e.disabled=true;if(s.sh&&s.sh[i])e.classList.add('is-shown');}});if(all().every(e=>e.disabled)){b.say('All correct. Now plot ln I against x.','good');ans.off();}gaPlotRows();},
    isDone:()=>all().every(e=>e.disabled)});
}
{
  // the same step-by-step "Why plot ln I?" as the animation's note (Alex, 5 Nov 2026)
  const body=act('do','Explain','Why plot ln I?','I = I<sub>0</sub>e<sup>−μx</sup> is a curve. Take ln of each side:');
  body.insertAdjacentHTML('beforeend',
    '<div class="ln-steps"><span>ln I</span><span>=</span><span>ln (I<sub>0</sub>e<sup>−μx</sup>)</span>'+
    '<span>ln I</span><span>=</span><span>ln I<sub>0</sub> + ln (e<sup>−μx</sup>)</span>'+
    '<span>ln I</span><span>=</span><span>ln I<sub>0</sub> − μx</span></div>'+
    '<p class="act-intro">In the order of y = mx + c:</p>'+
    '<div class="ln-match"><span>ln I</span><span>=</span><span>−μ</span><span>x</span><span>+</span><span>ln I<sub>0</sub></span>'+
    '<span>y</span><span>=</span><span>m</span><span>x</span><span>+</span><span>c</span></div>'+
    '<p class="act-intro">So ln I against x is a straight line: gradient = −μ, intercept = ln I<sub>0</sub>. A straight line shows the fall is exponential.</p>');
}
{
  const body=act('do','Plot','Plot your results','Plot ln I against x from your table as small crosses. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');
  createPlot({host:body,next:' Now find μ from the line of best fit below.',
    points:GA_X.map((x,k)=>({x:x,y:+GA_LN[k].toFixed(3)})),
    rowText:p=>{const k=GA_X.indexOf(p.x),e=gaTable&&gaTable.ln(k);return p.x+' mm, '+(e?'ln I = '+e:'your ln I');},
    graph:{xMin:0,xMax:24,yMin:4.4,yMax:6.2,xTicks:[0,4,8,12,16,20,24],yTicks:[4.4,4.6,4.8,5.0,5.2,5.4,5.6,5.8,6.0,6.2],minor:[1,0.04],snap:[1,0.02],xLabel:'x (mm)',yLabel:'ln (I / min⁻¹)',W:560,H:340}});
  // the animation and the results table side by side, so students read and write without scrolling
  // the Your turn card sits above the animation in the left column, so the results table starts at the top on the right
  {const fr=$('#panel-do .anim-wrap'),tb=$('#panel-do .ga-tbl').closest('.act'),yt=$('#panel-do .act[data-title="Take your own readings"]');
   if(fr&&tb){const sp=mk('div','hk-split'),left=mk('div','ga-left');fr.parentNode.insertBefore(sp,fr);sp.appendChild(left);if(yt)left.appendChild(yt);left.appendChild(fr);sp.appendChild(tb);}}
  gaPlotRows=()=>{$$('.plot-row',body).forEach((li,k)=>{const e=gaTable&&gaTable.ln(k),s=li.firstElementChild;if(s)s.textContent=GA_X[k]+' mm, '+(e?'ln I = '+e:'your ln I');});};
  gaPlotRows();
}
{
  const body=act('do','Calculate','μ and the half-thickness from your line','A good line of best fit through your points passes through (0, 6.12) and (24.0, 4.49). Read nothing else off the graph.');
  createCalc({host:body,questions:[
    {q:'What is the gradient of the line?',unit:'mm⁻¹',answer:-0.0679,working:'gradient = [[change in ln I|change in x]]<br>gradient = [[4.49 − 6.12|24.0 − 0]]<br>gradient = [[−1.63|24.0]]<br>gradient = −0.0679 mm⁻¹'},
    {q:'What is the absorption coefficient, μ, in m⁻¹?',unit:'m⁻¹',answer:67.9,working:'gradient = −μ<br>−0.0679 = −μ<br>μ = 0.0679 mm⁻¹<br>μ = 0.0679 × 1000<br>μ = 67.9 m⁻¹'},
    {q:'What is the half-thickness of lead, x½?',unit:'mm',answer:10.2,working:'x<sub>½</sub> = [[ln 2|μ]]<br>x<sub>½</sub> = [[0.6931|0.0679]]<br>x<sub>½</sub> = 10.2 mm'}
  ]});
}

/* ================= SHOW: the readings taken for you ================= */
{
  act('experiment','Your turn','Watch the readings','Press Experiment, then Measure background. Add lead with the + buttons and press Count for 60 s at each thickness, from 0 to 30 mm: here the table and graph fill in by themselves. Switch between “I against x” and “ln I against x”: which is a straight line, and what value of μ does it give? Then press Count again at one thickness: why is the new count different?');
}
frameAct('experiment','animations/gamma-radiation.html','abs','Gamma absorption animation: a cobalt-60 source, lead sheets and a GM tube with a counter and graph','gamma radiation',false);

/* ================= 5. GRAPHS ================= */
function lab(g0,t,x,y){return '<circle cx="'+g0.gx(x)+'" cy="'+g0.gy(y)+'" r="13" fill="var(--panel)" stroke="var(--ink)" stroke-width="2"/><text x="'+g0.gx(x)+'" y="'+(g0.gy(y)+5)+'" text-anchor="middle" font-size="14" fill="var(--ink)">'+t+'</text>';}
const GI={xMin:0,xMax:30,yMin:0,yMax:500,xTicks:[0,5,10,15,20,25,30],yTicks:[0,100,200,300,400,500],xLabel:'x (mm)',yLabel:'I (min⁻¹)',W:560,H:340};
{
  const body=act('graphs','Calculate','A graph of I against x','The graph shows the corrected count rate, I, through lead. Read your answers off the graph.');
  const split=mk('div','graph-split');body.appendChild(split);
  const pts=[];for(let i=0;i<=60;i++){const x=i/2;pts.push([x,480*Math.pow(0.5,x/10)]);}
  split.appendChild(mk('div','graph-box',lineGraph(Object.assign({label:'Corrected count rate against thickness of lead, a curve falling from 480 per minute',segments:[{pts:pts}]},GI)).svg));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'What is I with no lead?',unit:'min⁻¹',answer:480,working:'Read the value where x = 0.<br>I<sub>0</sub> = 480 min⁻¹'},
    {q:'What thickness of lead halves I?',unit:'mm',answer:10,working:'Half of 480 is 240.<br>Read across from 240 to the curve, then down.<br>x<sub>½</sub> = 10 mm'},
    {q:'Use your half-thickness to find μ.',unit:'mm⁻¹',answer:0.0693,working:'x<sub>½</sub> = [[ln 2|μ]]<br>10 = [[0.6931|μ]]<br>μ = [[0.6931|10]]<br>μ = 0.0693 mm⁻¹'}
  ]});
}
const GL={xMin:0,xMax:40,yMin:3,yMax:6.5,xTicks:[0,10,20,30,40],yTicks:[3,3.5,4,4.5,5,5.5,6,6.5],xLabel:'x (mm)',yLabel:'ln (I / min⁻¹)',W:560,H:340};
{
  const body=act('graphs','Calculate','Two absorbers','The graph shows ln I against thickness for the same gamma source with lead (line P) and with aluminium (line Q). Use two points on each line.');
  const split=mk('div','graph-split');body.appendChild(split);
  const g0=lineGraph(Object.assign({points:[[0,0]]},GL));
  split.appendChild(mk('div','graph-box',lineGraph(Object.assign({label:'ln I against thickness for lead, line P, and aluminium, line Q',segments:[{pts:[[0,6.0],[40,3.2]]},{pts:[[0,6.0],[40,5.4]],cls:'g-line-b'}],
    extra:lab(g0,'P',34,3.62-0.35)+lab(g0,'Q',34,5.49+0.3)},GL)).svg));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'Line P: what is μ for lead?',unit:'mm⁻¹',answer:0.07,working:'gradient = [[change in ln I|change in x]]<br>gradient = [[3.2 − 6.0|40 − 0]]<br>gradient = −0.070 mm⁻¹<br>gradient = −μ<br>μ = 0.070 mm⁻¹'},
    {q:'Line Q: what is μ for aluminium?',unit:'mm⁻¹',answer:0.015,working:'gradient = [[5.4 − 6.0|40 − 0]]<br>gradient = −0.015 mm⁻¹<br>gradient = −μ<br>μ = 0.015 mm⁻¹'},
    {q:'What is I with no absorber?',unit:'min⁻¹',answer:403,working:'Both lines meet the ln I axis at 6.0.<br>ln I<sub>0</sub> = 6.0<br>I<sub>0</sub> = e<sup>6.0</sup><br>I<sub>0</sub> = 403 min⁻¹'}
  ]});
}

/* ================= 6. CALCULATE ================= */
{
  const body=act('calculate','Calculate','Absorption and background','Use I = I<sub>0</sub>e<sup>−μx</sup> and x<sub>½</sub> = [[ln 2|μ]]. Every count rate here has already had the background taken off, unless the question says otherwise.');
  createCalc({host:body,questions:[
    {q:'I₀ = 520 per minute and μ = 0.065 mm⁻¹ for lead. What is I through 15 mm of lead?',unit:'min⁻¹',answer:196,working:'I = I<sub>0</sub>e<sup>−μx</sup><br>I = 520 × e<sup>−0.065 × 15</sup><br>I = 520 × e<sup>−0.975</sup><br>I = 520 × 0.3772<br>I = 196 min⁻¹'},
    {q:'I falls from 450 to 150 per minute. μ = 0.068 mm⁻¹. How thick is the lead?',unit:'mm',answer:16.2,working:'I = I<sub>0</sub>e<sup>−μx</sup><br>150 = 450 × e<sup>−0.068x</sup><br>[[150|450]] = e<sup>−0.068x</sup><br>ln 0.3333 = −0.068x<br>−1.0986 = −0.068x<br>x = [[1.0986|0.068]]<br>x = 16.2 mm'},
    {q:'A lead absorber has a half-thickness of 12 mm. What is μ?',unit:'mm⁻¹',answer:0.0578,working:'x<sub>½</sub> = [[ln 2|μ]]<br>12 = [[0.6931|μ]]<br>μ = [[0.6931|12]]<br>μ = 0.0578 mm⁻¹'},
    {q:'Iman counts 230 in 1 minute through some lead. The background was 95 counts in 5 minutes. What is the corrected count rate?',unit:'min⁻¹',answer:211,working:'background count rate = [[95|5]]<br>background count rate = 19 min⁻¹<br>I = 230 − 19<br>I = 211 min⁻¹'}
  ]});
}

/* ================= 7. ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Better results or safer?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'Better results',hint:'More accurate or more reliable readings',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps people safe',hint:'Cuts the dose people receive',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Count for longer, such as 5 minutes, at each thickness',cat:'a'},
    {id:'2',text:'Repeat each count and take the mean',cat:'a'},
    {id:'3',text:'Measure the lead’s thickness with a micrometer in several places',cat:'a'},
    {id:'4',text:'Fix the source and tube in holders so the distance cannot change',cat:'a'},
    {id:'5',text:'Move the source with tongs, never with your fingers',cat:'s'},
    {id:'6',text:'Keep the source in its lead box when it is not being used',cat:'s'},
    {id:'7',text:'Never point the source at anyone',cat:'s'},
    {id:'8',text:'Stand well back from the source while the counter is running',cat:'s'}
  ]});
}

/* ================= EXAM PRACTICE ================= */
{
  const body=act('exam','Exam style','Absorption of gamma radiation by lead','Nicholas measures the background as 110 counts in 5 minutes. He then counts for 1 minute through different thicknesses of lead, with the source a fixed distance from the GM tube. One reading is missing.');
  body.appendChild(resTable(['x (mm)','0','5.0','10.0','15.0','20.0'],[['Count in 1 minute','512','382',null,'216','165']]));
  body.appendChild(mk('p','sub','(a) 1 mark'));
  createCalc({host:body,questions:[
    {q:'Calculate the background count rate, in counts per minute.',unit:'min⁻¹',answer:22,working:'background count rate = [[110|5]]<br>background count rate = 22 min⁻¹'}
  ]});
  body.appendChild(mk('p','sub','(b) 2 marks'));
  createCalc({host:body,questions:[
    {q:'Predict the missing count at 10.0 mm.',unit:'counts',answer:287,working:'I = count − 22<br>I at 0 mm = 490 min⁻¹, I at 5.0 mm = 360 min⁻¹<br>each 5.0 mm multiplies I by [[360|490]] = 0.7347<br>I at 10.0 mm = 360 × 0.7347<br>I at 10.0 mm = 264.5 min⁻¹<br>count = 264.5 + 22<br>count = 287'}
  ]});
  examPart(body,'(c) 3 marks','The corrected count rate is given by I = I<sub>0</sub>e<sup>−μx</sup>. Explain why Nicholas should plot ln I against x, and how he can find μ from his graph.',[
    'Taking natural logs gives ln I = ln I<sub>0</sub> − μx.',
    'This has the form y = mx + c, so ln I against x is a straight line (if the absorption is exponential).',
    'The gradient = −μ, so μ = −gradient (and the intercept is ln I<sub>0</sub>).'
  ]);
  body.appendChild(mk('p','sub','(d) 3 marks'));
  createCalc({host:body,questions:[
    {q:'Use the readings at 0 and 20.0 mm to calculate μ, in m⁻¹.',unit:'m⁻¹',answer:61.6,working:'I at 0 mm = 512 − 22 = 490 min⁻¹, ln I = 6.194<br>I at 20.0 mm = 165 − 22 = 143 min⁻¹, ln I = 4.963<br>gradient = [[4.963 − 6.194|20.0 − 0]]<br>gradient = −0.0616 mm⁻¹<br>μ = 0.0616 mm⁻¹<br>μ = 0.0616 × 1000<br>μ = 61.6 m⁻¹'}
  ]});
  body.appendChild(mk('p','sub','(e) 2 marks'));
  createCalc({host:body,questions:[
    {q:'Calculate the half-thickness of lead.',unit:'mm',answer:11.3,working:'μ = 0.0616 mm⁻¹<br>x<sub>½</sub> = [[ln 2|μ]]<br>x<sub>½</sub> = [[0.6931|0.0616]]<br>x<sub>½</sub> = 11.3 mm'}
  ]});
  examPart(body,'(f) 6 marks','Describe how Nicholas should carry out this investigation to obtain accurate results. Include how he should use his results and one safety precaution.',[
    'Measure the background count (with the source in its box) for several minutes, or repeat it, and find the count rate per minute.',
    'Place the source and GM tube in fixed holders a fixed distance apart, and keep that distance the same throughout.',
    'Count for a fixed time (e.g. 1 minute, or longer) with no lead, then with increasing thicknesses of lead between them.',
    'Measure each thickness with a micrometer (or vernier callipers).',
    'Repeat each count and take a mean; use long counting times because decay is random.',
    'Subtract the background count rate from each count rate to get I.',
    'Plot ln I against x; μ = −gradient (half-thickness x<sub>½</sub> = [[ln 2|μ]]).',
    'Safety: handle the source with tongs (or keep it at arm’s length), keep it in its lead box when not in use, never point it at anyone.'
  ]);
  examPart(body,'(g) 2 marks','Explain why the distance between the source and the GM tube must not change.',[
    'The count rate also depends on distance (it falls with distance, as the gamma rays spread out: inverse-square law).',
    'So only the thickness of lead should change, or the change in count rate could not be put down to the lead alone.'
  ]);
}
