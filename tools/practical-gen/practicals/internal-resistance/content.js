/* IAL CP8 Determine the e.m.f. and internal resistance of an electrical cell (spec points 77, 78).
   Built on the CP15 model (gamma-absorption): ε = V + Ir, so V against I is a straight line, intercept ε and gradient −r.
   The Do the Experiment tab frames animations/internal-resistance.html?show=measure, whose fixed readings must match
   IR_I and IR_V below (MEAS_I and MEAS_V in the animation; tools/CORE-PRACTICALS.md, "Measure modes").
   Not yet checked against the WPH12 mark schemes (14 Nov 2026: written without the PC); the Build tab's tasks follow
   WPH12 Oct 2022 Q12(a), Jan 2024 Q14(b) and Jun 2022 Q15(b)(ii). */
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
const g3=v=>String(+(+v).toPrecision(3));

/* ================= 1. OVERVIEW ================= */
{
  const body=act('overview','Fill in the blanks','The practical in one passage','Drag a word into each gap, or tap a word and then tap a gap. Some words are not needed.');
  const parts=[
    'A cell is connected in series with an ammeter, a switch and a ',['b1','variable resistor'],', with a voltmeter across the ',['b2','cell'],
    '. The voltmeter reads the terminal potential difference, V. As the resistance is made smaller the current, I, rises and V ',['b3','falls'],
    ', because more energy per coulomb is transferred in the cell’s own ',['b4','internal resistance'],'. Since ε = V + Ir, a graph of V against I is a straight line. Its intercept on the V axis is the ',['b5','e.m.f.'],
    ', ε, and its gradient is ',['b6','−r'],'. The switch is opened between readings so that the cell does not ',['b7','warm up'],' or run down, which would change r and ε.'
  ];
  const cloze=mk('div','cloze'),slots=[],chips=[];
  parts.forEach(p=>{
    if(typeof p==='string')cloze.appendChild(document.createTextNode(p));
    else{const s=mk('span','blank');cloze.appendChild(s);slots.push({id:p[0],el:s,answer:p[1]});chips.push({id:'c-'+p[0],text:p[1]});}
  });
  ['rises','r','terminal p.d.','cool down'].forEach((t,i)=>chips.push({id:'d'+i,text:t}));
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
    {id:'a',text:'Connect the cell in series with an ammeter, a switch and a variable resistor, with a voltmeter across the cell’s terminals.'},
    {id:'b',text:'Set the variable resistor to its largest resistance.'},
    {id:'c',text:'Close the switch, read I and V, then open the switch again.'},
    {id:'d',text:'Make the resistance a little smaller and take the next pair of readings.'},
    {id:'e',text:'Repeat until you have at least six pairs of readings across the range.'},
    {id:'f',text:'Plot V against I and draw a line of best fit.'},
    {id:'g',text:'Read ε from the intercept on the V axis and find r from the gradient (r = −gradient).'}
  ],constraints:[['a','b'],['b','c'],['c','d'],['d','e'],['e','f'],['f','g']],
  why:'Start with the largest resistance, so the current is small at first, and take each reading with the switch closed only briefly. The graph comes once all the readings are in.'});
}
{
  const body=act('method','Match','What each piece of equipment is for','Pair each piece of equipment with its job. Drag one card onto the other, or tap one card and then the other.');
  createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'v',l:'Voltmeter across the cell',r:'Measures the terminal potential difference, V'},
    {id:'a',l:'Ammeter in series',r:'Measures the current through the cell, I'},
    {id:'r',l:'Variable resistor',r:'Changes the current, to give a range of readings'},
    {id:'s',l:'Switch',r:'Lets the current flow only while a reading is taken'},
    {id:'p',l:'Fixed resistor in series',r:'Stops the current getting too large at the smallest setting'}
  ]});
}
{
  act('method','Build','Build the circuit','The circuit is built on the bench beside its diagram. Put the ammeter and the voltmeter in for each task, then press Go to see if it works.');
}
frameAct('method','animations/internal-resistance.html','build','Internal resistance: build the circuit with the ammeter and voltmeter','internal resistance',false);

/* ================= DO THE EXPERIMENT ================= */
// The student reads both meters at seven positions of the rheostat in the animation's measure mode (?show=measure).
// IR_I and IR_V must match MEAS_I and MEAS_V in animations/internal-resistance.html.
const IR_I=[0.12,0.20,0.30,0.42,0.50,0.64,0.86], IR_V=[1.48,1.42,1.34,1.26,1.20,1.10,0.94];
let irTable=null,irPlotRows=()=>{};
{
  act('do','Your turn','Take your own readings','1. Put the rheostat’s slider at position 1. 2. Press Take reading and read both meters. 3. Repeat at positions 2 to 7, writing each pair of readings in the table.');
}
frameAct('do','animations/internal-resistance.html','measure','Internal resistance experiment: read the ammeter and the voltmeter','internal resistance',false);
{
  const body=act('do','Calculate','Your results table','Write each reading exactly as the meter shows it. Press Check.');
  const wrap=mk('div','table-scroll');body.appendChild(wrap);
  const cell=(c,k,lab)=>'<td><input class="calc-num-input" data-c="'+c+'" data-k="'+k+'" inputmode="decimal" autocomplete="off" aria-label="'+lab+'"></td>';
  wrap.innerHTML='<table class="units res-tbl ga-tbl"><thead><tr><th>Position</th><th>I (A)</th><th>V (V)</th></tr></thead><tbody>'+
    IR_I.map((x,k)=>'<tr><td class="given">'+(k+1)+'</td>'+cell('i',k,'Current at position '+(k+1)+', amps')+cell('v',k,'Terminal potential difference at position '+(k+1)+', volts')+'</tr>').join('')+'</tbody></table>';
  const inp=(c,k)=>$('input[data-c="'+c+'"][data-k="'+k+'"]',wrap), all=()=>$$('input',wrap);
  const val=e=>{const t=e.value.trim().replace(/[−–]/g,'-').replace(',','.');return t===''||!/^-?(\d+\.?\d*|\.\d+)$/.test(t)?NaN:parseFloat(t);};
  const want=(c,k)=>c==='i'?[IR_I[k],0.005]:[IR_V[k],0.005];
  const show=(c,k)=>want(c,k)[0].toFixed(2);
  const b=bar(body,[{label:'Check table',primary:true,fn:check},{label:'Clear',fn:reset}]);
  const ans=answerBtn(b,()=>{
    all().forEach(e=>{if(e.disabled)return;e.value=show(e.dataset.c,+e.dataset.k);e.disabled=true;e.classList.add('is-shown');e.classList.remove('is-wrong');});
    b.say('Answers shown (dashed). Now plot V against I below.','');irPlotRows();
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
    if(ok===n){b.say('All correct. Now plot V against I.','good');celebrate(b.msg);ans.off();}
    else{b.say(ok+' of '+n+' correct'+(blank?', '+blank+' left blank':'')+'.'+(bad?' Check the slider was at the right position, and that I is in amps (the ammeter reads A, not mA).':''),bad?'bad':'');ans.on();}
    irPlotRows();
  }
  // Show answer is always there for this table (as on CP15), so students can skip it and go on to the plot
  function reset(){all().forEach(e=>{e.value='';e.disabled=false;e.classList.remove('is-wrong','is-shown','pop');});ans.on();b.say('','');irPlotRows();}
  all().forEach(e=>e.addEventListener('input',()=>e.classList.remove('is-wrong')));
  ans.on();
  irTable={v:k=>{const e=inp('v',k);return e.value.trim()===''||!e.disabled?null:e.value.trim();},i:k=>{const e=inp('i',k);return e.value.trim()===''||!e.disabled?null:e.value.trim();}};
  track(body,{reset:reset,
    getState:()=>({v:all().map(e=>e.value),ok:all().map(e=>e.disabled),sh:all().map(e=>e.classList.contains('is-shown'))}),
    setState:s=>{reset();all().forEach((e,i)=>{if(!s||!s.v||typeof s.v[i]!=='string')return;e.value=s.v[i];if(s.ok&&s.ok[i]){e.disabled=true;if(s.sh&&s.sh[i])e.classList.add('is-shown');}});if(all().every(e=>e.disabled)){b.say('All correct. Now plot V against I.','good');ans.off();}irPlotRows();},
    isDone:()=>all().every(e=>e.disabled)});
}
{
  const body=act('do','Explain','Why plot V against I?','The e.m.f. is shared between the terminal p.d. and the p.d. across the internal resistance:');
  body.insertAdjacentHTML('beforeend',
    '<div class="ln-steps"><span>ε</span><span>=</span><span>V + Ir</span>'+
    '<span>V</span><span>=</span><span>ε − Ir</span>'+
    '<span>V</span><span>=</span><span>−rI + ε</span></div>'+
    '<p class="act-intro">In the order of y = mx + c:</p>'+
    '<div class="ln-match"><span>V</span><span>=</span><span>−r</span><span>I</span><span>+</span><span>ε</span>'+
    '<span>y</span><span>=</span><span>m</span><span>x</span><span>+</span><span>c</span></div>'+
    '<p class="act-intro">So V against I is a straight line: intercept on the V axis = ε (the p.d. when no current flows), gradient = −r.</p>');
}
{
  const body=act('do','Plot','Plot your results','Plot V against I from your table as small crosses. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');
  createPlot({host:body,next:' Now find ε and r from the line of best fit below.',
    points:IR_I.map((x,k)=>({x:x,y:IR_V[k]})),
    rowText:p=>{const k=IR_I.indexOf(p.x),e=irTable&&irTable.v(k);return 'I = '+p.x.toFixed(2)+' A, '+(e?'V = '+e+' V':'your V');},
    graph:{xMin:0,xMax:1,yMin:0.8,yMax:1.6,xTicks:[0,0.2,0.4,0.6,0.8,1],yTicks:[0.8,1.0,1.2,1.4,1.6],minor:[0.02,0.02],snap:[0.02,0.02],xLabel:'I (A)',yLabel:'V (V)',W:560,H:340}});
  // the animation and the results table side by side, as on CP15
  {const fr=$('#panel-do .anim-wrap'),tb=$('#panel-do .ga-tbl').closest('.act'),yt=$('#panel-do .act[data-title="Take your own readings"]');
   if(fr&&tb){const sp=mk('div','hk-split'),left=mk('div','ga-left');fr.parentNode.insertBefore(sp,fr);sp.appendChild(left);if(yt)left.appendChild(yt);left.appendChild(fr);sp.appendChild(tb);}}
  irPlotRows=()=>{$$('.plot-row',body).forEach((li,k)=>{const e=irTable&&irTable.v(k),s=li.firstElementChild;if(s)s.textContent='I = '+IR_I[k].toFixed(2)+' A, '+(e?'V = '+e+' V':'your V');});};
  irPlotRows();
}
{
  const body=act('do','Calculate','ε and r from your line','A good line of best fit through your points passes through (0.10, 1.49) and (0.80, 0.98).');
  createCalc({host:body,questions:[
    {q:'What is the gradient of the line?',unit:'V A⁻¹',answer:-0.729,working:'first point = (0.10, 1.49)<br>second point = (0.80, 0.98)<br>gradient = ?||gradient = [[change in V|change in I]]<br>gradient = [[0.98 − 1.49|0.80 − 0.10]]<br>gradient = [[−0.51|0.70]]<br>gradient = −0.729 V A⁻¹'},
    {q:'What is the internal resistance of the cell?',unit:'Ω',answer:0.729,working:'gradient = −0.729 V A⁻¹<br>r = ?||gradient = −r<br>−0.729 = −r<br>r = 0.729 Ω'},
    {q:'What is the e.m.f. of the cell?',unit:'V',answer:1.56,working:'r = 0.729 Ω<br>at I = 0.10 A, V = 1.49 V<br>ε = ?||ε = V + Ir<br>ε = 1.49 + 0.10 × 0.729<br>ε = 1.49 + 0.0729<br>ε = 1.56 V'}
  ]});
}

/* ================= SHOW: the readings taken for you ================= */
{
  act('experiment','Your turn','Watch the readings','Press Experiment. Move the rheostat’s slider to a new place and press Take reading; do this for at least six places: here the table and graph fill in by themselves. Change the source (an AA cell, a car battery, a potato cell): which has the largest internal resistance, and how does the graph show it?');
}
frameAct('experiment','animations/internal-resistance.html','','Internal resistance animation: a cell with a rheostat, two meters and a graph of V against I','internal resistance',false);

/* ================= 5. ANALYSIS ================= */
function lab(g0,t,x,y){return '<circle cx="'+g0.gx(x)+'" cy="'+g0.gy(y)+'" r="13" fill="var(--panel)" stroke="var(--ink)" stroke-width="2"/><text x="'+g0.gx(x)+'" y="'+(g0.gy(y)+5)+'" text-anchor="middle" font-size="14" fill="var(--ink)">'+t+'</text>';}
const GV={xMin:0,xMax:2,yMin:0,yMax:10,xTicks:[0,0.5,1,1.5,2],yTicks:[0,2,4,6,8,10],xLabel:'I (A)',yLabel:'V (V)',W:560,H:340};
{
  const body=act('graphs','Calculate','Two batteries','The graph shows V against I for two batteries, P and Q. Read your answers off the graph.');
  const split=mk('div','graph-split');body.appendChild(split);
  const g0=lineGraph(Object.assign({points:[[0,0]]},GV));
  split.appendChild(mk('div','graph-box',lineGraph(Object.assign({label:'V against I for two batteries: P starts at 9 V and falls steeply, Q starts at 6 V and falls gently',segments:[{pts:[[0,9],[2,1]]},{pts:[[0,6],[2,5]],cls:'g-line-b'}],
    extra:lab(g0,'P',1.6,2.6+1.1)+lab(g0,'Q',1.6,5.2+1.0)},GV)).svg));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'What is the e.m.f. of battery P?',unit:'V',answer:9,working:'Read the intercept on the V axis, where I = 0.<br>ε = 9.0 V'},
    {q:'What is the internal resistance of battery P?',unit:'Ω',answer:4,working:'first point = (0, 9.0)<br>second point = (2.0, 1.0)<br>r = ?||gradient = [[1.0 − 9.0|2.0 − 0]]<br>gradient = −4.0 V A⁻¹<br>r = −gradient<br>r = 4.0 Ω'},
    {q:'Battery Q: what is its internal resistance?',unit:'Ω',answer:0.5,working:'first point = (0, 6.0)<br>second point = (2.0, 5.0)<br>r = ?||gradient = [[5.0 − 6.0|2.0 − 0]]<br>gradient = −0.50 V A⁻¹<br>r = −gradient<br>r = 0.50 Ω'}
  ]});
}
{
  const body=act('graphs','Multiple choice','Reading the line','A quick question about the same graph.');
  createPredict({host:body,q:'A car’s starter motor needs a very large current for a few seconds. Which battery on the graph could give the larger current?',options:[
    {text:'Q, as its r is much smaller',correct:true},
    {text:'P, as its e.m.f. is much larger',why:'A larger e.m.f. helps, but P’s internal resistance is 8 times bigger, so most of its e.m.f. is lost inside it at a large current.'},
    {text:'Neither, as the current is the same',why:'The current is the same all round one circuit, but these are two different batteries in two circuits.'}
  ],explain:'Extend each line to V = 0: that is the largest current, ε/r. For P it is 9.0/4.0 = 2.25 A; for Q it is 6.0/0.50 = 12 A. A car battery has a tiny internal resistance for this reason.'});
}

/* ================= 6. CALCULATE ================= */
{
  const body=act('calculate','Calculate','E.m.f. and internal resistance','Use ε = I(R + r) and ε = V + Ir. Press New problems for another set.');
  createCalc({host:body,questions:[
    {q:'A cell of e.m.f. 1.50 V and internal resistance 0.60 Ω is connected to a 4.4 Ω resistor. What is the terminal p.d.?',unit:'V',answer:1.32,working:'ε = 1.50 V<br>r = 0.60 Ω<br>R = 4.4 Ω<br>V = ?||ε = I(R + r)<br>1.50 = I × (4.4 + 0.60)<br>1.50 = 5.0 × I<br>I = [[1.50|5.0]]<br>I = 0.30 A<br>V = IR<br>V = 0.30 × 4.4<br>V = 1.32 V',
     hints:['First find the current from ε = I(R + r).','Then V = IR across the 4.4 Ω resistor.'],
     make:rnd=>{const e=calcPick(rnd,[1.50,1.60,3.00,4.50,6.00,9.00]),r=calcPick(rnd,[0.40,0.50,0.60,0.80,1.0,1.5]),R=calcPick(rnd,[2.0,3.5,4.4,5.0,7.5,10]),T=R+r,I=e/T,V=I*R;
       return {q:`A cell of e.m.f. ${e.toFixed(2)} V and internal resistance ${r.toFixed(2)} Ω is connected to a ${R} Ω resistor. What is the terminal p.d.?`,unit:'V',answer:+V.toPrecision(3),
         hints:['First find the current from ε = I(R + r).',`Then V = IR across the ${R} Ω resistor.`],
         working:`ε = ${e.toFixed(2)} V<br>r = ${r.toFixed(2)} Ω<br>R = ${R} Ω<br>V = ?||ε = I(R + r)<br>${e.toFixed(2)} = I × (${R} + ${r.toFixed(2)})<br>${e.toFixed(2)} = ${g3(T)} × I<br>I = [[${e.toFixed(2)}|${g3(T)}]]<br>I = ${g3(I)} A<br>V = IR<br>V = ${g3(I)} × ${R}<br>V = ${g3(V)} V`};}},
    {q:'The terminal p.d. of a battery is 8.2 V when the current is 0.40 A, and 7.0 V when the current is 1.0 A. What is its internal resistance?',unit:'Ω',answer:2,working:'V₁ = 8.2 V, I₁ = 0.40 A<br>V₂ = 7.0 V, I₂ = 1.0 A<br>r = ?||ε = V₁ + I₁r = V₂ + I₂r<br>8.2 + 0.40r = 7.0 + 1.0r<br>8.2 − 7.0 = 1.0r − 0.40r<br>1.2 = 0.60r<br>r = [[1.2|0.60]]<br>r = 2.0 Ω',
     hints:['ε is the same both times, so V₁ + I₁r = V₂ + I₂r.','Collect the r terms on one side.'],
     make:rnd=>{const e=calcPick(rnd,[4.5,6.0,9.0,12.0]),r=calcPick(rnd,[0.5,1.0,1.5,2.0,2.5]),I1=calcPick(rnd,[0.20,0.40,0.50]),I2=calcPick(rnd,[1.0,1.2,1.5,2.0]),V1=+(e-I1*r).toFixed(2),V2=+(e-I2*r).toFixed(2),dV=+(V1-V2).toFixed(2),dI=+(I2-I1).toFixed(2);
       return {q:`The terminal p.d. of a battery is ${V1} V when the current is ${I1.toFixed(2)} A, and ${V2} V when the current is ${I2.toFixed(1)} A. What is its internal resistance?`,unit:'Ω',answer:r,
         hints:['ε is the same both times, so V₁ + I₁r = V₂ + I₂r.','Collect the r terms on one side.'],
         working:`V₁ = ${V1} V, I₁ = ${I1.toFixed(2)} A<br>V₂ = ${V2} V, I₂ = ${I2.toFixed(1)} A<br>r = ?||ε = V₁ + I₁r = V₂ + I₂r<br>${V1} + ${I1.toFixed(2)}r = ${V2} + ${I2.toFixed(1)}r<br>${V1} − ${V2} = ${I2.toFixed(1)}r − ${I1.toFixed(2)}r<br>${dV} = ${dI}r<br>r = [[${dV}|${dI}]]<br>r = ${g3(r)} Ω`};}}
  ]});
}

/* ================= 7. ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Why each step is done','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'More accurate ε and r',hint:'Cuts the uncertainty or keeps ε and r steady',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps it safe',hint:'Stops anything getting hot',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Open the switch between readings, so the cell does not run down and ε stays the same',cat:'a'},
    {id:'2',text:'Take at least six readings across the whole range of current',cat:'a'},
    {id:'3',text:'Use the line of best fit, not one pair of readings',cat:'a'},
    {id:'4',text:'Use a voltmeter with a very high resistance, so it takes almost no current',cat:'a'},
    {id:'5',text:'Keep a fixed resistor in series, so the rheostat is never at zero resistance',cat:'s'},
    {id:'6',text:'Never short-circuit a battery: a large current can make the wires very hot',cat:'s'}
  ]});
}

/* ================= EXAM PRACTICE ================= */
{
  const body=act('exam','Exam style','The e.m.f. of a battery','Haris connects a battery to a variable resistor and an ammeter, with a voltmeter across the battery. He takes these readings.');
  body.appendChild(resTable(['I (A)','0.20','0.40','0.60','0.80','1.00'],[['V (V)','4.30','4.05','3.85','3.58','3.35']]));
  examPart(body,'(a) 2 marks','Explain why the terminal potential difference falls as the current increases.',[
    'Some of the e.m.f. is “lost” across the internal resistance: the p.d. across it is Ir.',
    'As I increases, Ir increases, so V = ε − Ir decreases.'
  ]);
  body.appendChild(mk('p','sub','(b) 2 marks'));
  createCalc({host:body,questions:[
    {q:'Use the readings at 0.20 A and 1.00 A to calculate the internal resistance.',unit:'Ω',answer:1.19,working:'at 0.20 A, V = 4.30 V<br>at 1.00 A, V = 3.35 V<br>r = ?||gradient = [[3.35 − 4.30|1.00 − 0.20]]<br>gradient = [[−0.95|0.80]]<br>gradient = −1.19 V A⁻¹<br>r = −gradient<br>r = 1.19 Ω'}
  ]});
  body.appendChild(mk('p','sub','(c) 2 marks'));
  createCalc({host:body,questions:[
    {q:'Calculate the e.m.f. of the battery.',unit:'V',answer:4.54,working:'r = 1.19 Ω<br>at 0.20 A, V = 4.30 V<br>ε = ?||ε = V + Ir<br>ε = 4.30 + 0.20 × 1.19<br>ε = 4.30 + 0.238<br>ε = 4.54 V'}
  ]});
  examPart(body,'(d) 2 marks','Haris leaves the switch closed for the whole experiment. Explain how this could affect his value for the e.m.f.',[
    'The battery runs down (and warms up) while current flows, so its e.m.f. falls (and r may change) during the experiment.',
    'So the points do not lie on one straight line, and the intercept (ε) found from the graph is too low or unreliable.'
  ]);
  examPart(body,'(e) 6 marks','Describe how Haris could use a graph to find the e.m.f. and internal resistance of the battery accurately.',[
    'Connect the battery in series with an ammeter, a switch and a variable resistor (and a fixed protective resistor); voltmeter across the battery’s terminals.',
    'Start at the largest resistance; close the switch, record I and V, open the switch.',
    'Decrease the resistance in steps to take at least six pairs of readings over a wide range of I.',
    'Plot V against I and draw a line of best fit.',
    'ε = the intercept on the V axis (where I = 0).',
    'r = −gradient of the line (from ε = V + Ir, so V = −rI + ε).'
  ]);
}
