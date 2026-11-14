/* IAL CP7 Determine the electrical resistivity of a material (spec points 66, 71, 72).
   Built on the CP15 model (gamma-absorption): R = ρL/A, so R against L is a straight line with gradient ρ/A.
   The Do the Experiment tab frames animations/resistivity.html?show=measure, whose fixed readings must match
   RS_D, RS_L, RS_V and RS_I below (MEAS_D, MEAS_L, MEAS_V and MEAS_I in the animation; tools/CORE-PRACTICALS.md, "Measure modes").
   Mark scheme wording checked 14 Nov 2026 (TODO 5g) against WPH12 Oct 2019 Q15, Jun 2024 Q14(a)(ii); WPH13 Jan 2023 Q1(b), Oct 2023 Q2(a)(b), Jun 2024 Q4(a)(ii)(b); WPH16 Oct 2022 Q4(a); 9PH0/03 Jun 2017 Q6; the Build tab's tasks follow
   WPH12 Jan 2021 Q19(a). */
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

/* ================= 1. OVERVIEW ================= */
{
  const body=act('overview','Fill in the blanks','The practical in one passage','Drag a word into each gap, or tap a word and then tap a gap. Some words are not needed.');
  const parts=[
    'A length of wire is taped along a metre rule. A fixed clip sits at the zero mark and a ',['b1','crocodile clip'],' is moved along the wire, so the length, L, between the clips can be changed. An ammeter is connected in ',['b2','series'],
    ' with the wire and a voltmeter in ',['b3','parallel'],' with the length being tested, and R = V/I gives its resistance. The diameter of the wire is measured with a ',['b4','micrometer'],
    ' in several places and at different angles, and the mean is used to work out the ',['b5','cross-sectional area'],', A = πd²/4. Since R = ρL/A, a graph of R against L is a straight line with a gradient of ',['b6','ρ/A'],
    ', so ρ = gradient × A. The line may not pass through the origin, because the clips and their contacts add a small extra ',['b7','resistance'],
    '. The current is kept small and switched off between readings so that the wire does not ',['b8','heat up'],'.'
  ];
  const cloze=mk('div','cloze'),slots=[],chips=[];
  parts.forEach(p=>{
    if(typeof p==='string')cloze.appendChild(document.createTextNode(p));
    else{const s=mk('span','blank');cloze.appendChild(s);slots.push({id:p[0],el:s,answer:p[1]});chips.push({id:'c-'+p[0],text:p[1]});}
  });
  ['metre rule','A/ρ','cool down','length'].forEach((t,i)=>chips.push({id:'d'+i,text:t}));
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
    {id:'a',text:'Measure the diameter of the wire with a micrometer at several places along it, turning it through 90° each time, and find the mean.'},
    {id:'b',text:'Tape the wire along a metre rule and connect the circuit: cell, ammeter, protective resistor and the wire in series, with the voltmeter across the length being tested.'},
    {id:'c',text:'Put the crocodile clip on the wire at a measured length, L, from the fixed clip.'},
    {id:'d',text:'Close the switch, read V and I, then open the switch again.'},
    {id:'e',text:'Move the clip to a new length and repeat, for at least six lengths across the rule.'},
    {id:'f',text:'Work out R = V/I for each length and plot R against L.'},
    {id:'g',text:'Find the gradient of the line of best fit and work out ρ = gradient × A.'}
  ],constraints:[['b','c'],['c','d'],['d','e'],['e','f'],['f','g'],['a','g']],
  why:'The diameter can be measured first or at any point before you work out ρ. Each reading needs the clip in place before the switch is closed, and the graph comes once every R is worked out.'});
}
{
  const body=act('method','Match','What each piece of equipment is for','Pair each piece of equipment with its job. Drag one card onto the other, or tap one card and then the other.');
  createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'m',l:'Micrometer',r:'Measures the diameter of the wire to 0.01 mm'},
    {id:'r',l:'Metre rule',r:'Measures the length of wire between the clips'},
    {id:'c',l:'Crocodile clip',r:'Makes contact with the wire at a chosen length'},
    {id:'a',l:'Ammeter',r:'Measures the current through the wire'},
    {id:'v',l:'Voltmeter',r:'Measures the potential difference across the length being tested'},
    {id:'p',l:'Protective resistor',r:'Limits the current so the wire does not overheat'}
  ]});
}
{
  act('method','Build','Build the circuit','The circuit is built on the bench beside its diagram. Put the ammeter and the voltmeter in for each task, then press Go to see if it works.');
}
frameAct('method','animations/resistivity.html','build','Resistivity: build the circuit with the ammeter and voltmeter','resistivity',false);

/* ================= DO THE EXPERIMENT ================= */
// The student reads the micrometer, the clip on the rule and the meters in the animation's measure mode (?show=measure).
// RS_D, RS_L, RS_V and RS_I must match MEAS_D, MEAS_L, MEAS_V and MEAS_I in animations/resistivity.html.
const RS_D=[0.32,0.31,0.33], RS_L=[0.18,0.28,0.40,0.48,0.64,0.78,0.90], RS_V=[0.32,0.46,0.60,0.69,0.86,0.99,1.08], RS_I=[0.267,0.255,0.240,0.230,0.215,0.202,0.193];
const RS_DM=(RS_D[0]+RS_D[1]+RS_D[2])/3, RS_A=Math.PI*Math.pow(RS_DM/2,2)*100, RS_R=RS_V.map((v,k)=>v/RS_I[k]);   // RS_A in units of 10⁻⁸ m² (d in mm: π(d/2)² mm² = that × 10⁻⁶ m²)
let rsTable=null,rsPlotRows=()=>{};
{
  act('do','Your turn','Take your own readings','1. Read the micrometer at Places 1, 2 and 3. 2. Put the clip at marks 1 to 7 in turn, read L off the rule, press Take reading and read both meters. 3. Fill in the table, then work out R = V/I for each length.');
}
frameAct('do','animations/resistivity.html','measure','Resistivity experiment: read the micrometer, the rule and the meters','resistivity',false);
{
  const body=act('do','Calculate','Your results table','Write each reading as the instrument shows it: d in mm, L in m, V in V, I in A. Give the mean d to 2 decimal places, A to 3 significant figures and R to 2 decimal places. Press Check.');
  const wrap=mk('div','table-scroll');body.appendChild(wrap);
  const cell=(c,k,lab)=>'<td><input class="calc-num-input" data-c="'+c+'" data-k="'+k+'" inputmode="decimal" autocomplete="off" aria-label="'+lab+'"></td>';
  wrap.innerHTML='<table class="units res-tbl ga-tbl"><thead><tr><th>d at place 1 (mm)</th><th>d at place 2 (mm)</th><th>d at place 3 (mm)</th></tr></thead><tbody><tr>'+
    cell('d',0,'Diameter at place 1, mm')+cell('d',1,'Diameter at place 2, mm')+cell('d',2,'Diameter at place 3, mm')+'</tr></tbody></table>'+
    '<table class="units res-tbl ga-tbl" style="margin-top:10px"><thead><tr><th>Mean d (mm)</th><th>A (× 10⁻⁸ m²)</th></tr></thead><tbody><tr>'+
    cell('dm',0,'Mean diameter, mm')+cell('a',0,'Cross-sectional area, times 10 to the minus 8 square metres')+'</tr></tbody></table>'+
    '<table class="units res-tbl ga-tbl" style="margin-top:10px"><thead><tr><th>Mark</th><th>L (m)</th><th>V (V)</th><th>I (A)</th><th>R (Ω)</th></tr></thead><tbody>'+
    RS_L.map((x,k)=>'<tr><td class="given">'+(k+1)+'</td>'+cell('l',k,'Length at mark '+(k+1)+', metres')+cell('v',k,'Voltmeter reading at mark '+(k+1))+cell('i',k,'Ammeter reading at mark '+(k+1))+cell('r',k,'Resistance at mark '+(k+1))+'</tr>').join('')+'</tbody></table>';
  const inp=(c,k)=>$('input[data-c="'+c+'"][data-k="'+k+'"]',wrap), all=()=>$$('input',wrap);
  const val=e=>{const t=e.value.trim().replace(/[−–]/g,'-').replace(',','.');return t===''||!/^-?(\d+\.?\d*|\.\d+)$/.test(t)?NaN:parseFloat(t);};
  // readings to the instrument's resolution; the mean, A and R to the accuracy asked for
  const want=(c,k)=>c==='d'?[RS_D[k],0.005]:c==='dm'?[RS_DM,0.005]:c==='a'?[RS_A,0.02]:c==='l'?[RS_L[k],0.0015]:c==='v'?[RS_V[k],0.005]:c==='i'?[RS_I[k],0.0005]:[RS_R[k],0.0101];
  const show=(c,k)=>c==='d'||c==='dm'||c==='v'?want(c,k)[0].toFixed(2):c==='a'?g3(RS_A):c==='l'?RS_L[k].toFixed(3):c==='i'?RS_I[k].toFixed(3):RS_R[k].toFixed(2);
  const b=bar(body,[{label:'Check table',primary:true,fn:check},{label:'Clear',fn:reset}]);
  const ans=answerBtn(b,()=>{
    all().forEach(e=>{if(e.disabled)return;e.value=show(e.dataset.c,+e.dataset.k);e.disabled=true;e.classList.add('is-shown');e.classList.remove('is-wrong');});
    b.say('Answers shown (dashed). Now plot R against L below.','');rsPlotRows();
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
    if(ok===n){b.say('All correct. Now plot R against L.','good');celebrate(b.msg);ans.off();}
    else{b.say(ok+' of '+n+' correct'+(blank?', '+blank+' left blank':'')+'.'+(bad?' L in metres: 18.0 cm is 0.180 m. A = πd²/4 with d in mm gives mm²; 1 mm² = 10⁻⁶ m². R = V/I.':''),bad?'bad':'');ans.on();}
    rsPlotRows();
  }
  // Show answer is always there for this table (as on CP15), so students can skip it and go on to the plot
  function reset(){all().forEach(e=>{e.value='';e.disabled=false;e.classList.remove('is-wrong','is-shown','pop');});ans.on();b.say('','');rsPlotRows();}
  all().forEach(e=>e.addEventListener('input',()=>e.classList.remove('is-wrong')));
  ans.on();
  rsTable={r:k=>{const e=inp('r',k);return e.value.trim()===''||!e.disabled?null:e.value.trim();}};
  track(body,{reset:reset,
    getState:()=>({v:all().map(e=>e.value),ok:all().map(e=>e.disabled),sh:all().map(e=>e.classList.contains('is-shown'))}),
    setState:s=>{reset();all().forEach((e,i)=>{if(!s||!s.v||typeof s.v[i]!=='string')return;e.value=s.v[i];if(s.ok&&s.ok[i]){e.disabled=true;if(s.sh&&s.sh[i])e.classList.add('is-shown');}});if(all().every(e=>e.disabled)){b.say('All correct. Now plot R against L.','good');ans.off();}rsPlotRows();},
    isDone:()=>all().every(e=>e.disabled)});
}
{
  const body=act('do','Explain','Why plot R against L?','R = [[ρL|A]]. The wire is the same all along, so ρ and A stay the same:');
  body.insertAdjacentHTML('beforeend',
    '<p class="act-intro">In the order of y = mx + c:</p>'+
    '<div class="ln-match"><span>R</span><span>=</span><span>ρ/A</span><span>L</span><span>+</span><span>0</span>'+
    '<span>y</span><span>=</span><span>m</span><span>x</span><span>+</span><span>c</span></div>'+
    '<p class="act-intro">So R against L is a straight line with gradient = ρ/A, and ρ = gradient × A. The clips add a small resistance that does not depend on L, so a real line cuts the R axis a little above zero. Using the gradient, not one reading, leaves that extra resistance out of ρ.</p>');
}
{
  const body=act('do','Plot','Plot your results','Plot R against L from your table as small crosses. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');
  createPlot({host:body,next:' Now find ρ from the line of best fit below.',
    points:RS_L.map((x,k)=>({x:x,y:+RS_R[k].toFixed(1)})),
    rowText:p=>{const k=RS_L.indexOf(p.x),e=rsTable&&rsTable.r(k);return p.x.toFixed(2)+' m, '+(e?'R = '+e+' Ω':'your R');},
    graph:{xMin:0,xMax:1,yMin:0,yMax:6,xTicks:[0,0.2,0.4,0.6,0.8,1],yTicks:[0,1,2,3,4,5,6],minor:[0.02,0.1],snap:[0.02,0.1],xLabel:'L (m)',yLabel:'R (Ω)',W:560,H:340}});
  // the animation and the results table side by side, as on CP15
  {const fr=$('#panel-do .anim-wrap'),tb=$('#panel-do .ga-tbl').closest('.act'),yt=$('#panel-do .act[data-title="Take your own readings"]');
   if(fr&&tb){const sp=mk('div','hk-split'),left=mk('div','ga-left');fr.parentNode.insertBefore(sp,fr);sp.appendChild(left);if(yt)left.appendChild(yt);left.appendChild(fr);sp.appendChild(tb);}}
  rsPlotRows=()=>{$$('.plot-row',body).forEach((li,k)=>{const e=rsTable&&rsTable.r(k),s=li.firstElementChild;if(s)s.textContent=RS_L[k].toFixed(2)+' m, '+(e?'R = '+e+' Ω':'your R');});};
  rsPlotRows();
}
{
  const body=act('do','Calculate','ρ from your line','A good line of best fit through your points passes through (0.10, 0.68) and (0.90, 5.61). The mean diameter is 0.32 mm. Type a power of ten as e.g. 8.04e-8.');
  createCalc({host:body,questions:[
    {q:'What is the gradient of the line?',unit:'Ω m⁻¹',answer:6.16,working:'first point = (0.10, 0.68)<br>second point = (0.90, 5.61)<br>gradient = ?||gradient = [[change in R|change in L]]<br>gradient = [[5.61 − 0.68|0.90 − 0.10]]<br>gradient = [[4.93|0.80]]<br>gradient = 6.16 Ω m⁻¹'},
    {q:'What is the cross-sectional area of the wire?',unit:'m²',answer:8.04e-8,working:'d = 0.32 mm<br>d = 0.32 × 10⁻³ m<br>A = ?||A = [[πd²|4]]<br>A = [[π × (0.32 × 10⁻³)²|4]]<br>A = 8.04 × 10⁻⁸ m²'},
    {q:'What is the resistivity of the wire?',unit:'Ω m',answer:4.95e-7,working:'gradient = 6.16 Ω m⁻¹<br>A = 8.04 × 10⁻⁸ m²<br>ρ = ?||gradient = [[ρ|A]]<br>ρ = gradient × A<br>ρ = 6.16 × 8.04 × 10⁻⁸<br>ρ = 4.95 × 10⁻⁷ Ω m'}
  ]});
}

/* ================= SHOW: the readings taken for you ================= */
{
  act('experiment','Your turn','Watch the readings','Press Experiment. Drag the crocodile clip to a length and press Take reading; do this for at least six lengths: here the table and graph fill in by themselves. Where does the line cut the R axis, and why is it not at zero? Then change the wire: how does the gradient change for a thicker wire?');
}
frameAct('experiment','animations/resistivity.html','','Resistivity animation: a wire on a metre rule with a crocodile clip, two meters and a graph of R against L','resistivity',false);

/* ================= 5. ANALYSIS ================= */
function lab(g0,t,x,y){return '<circle cx="'+g0.gx(x)+'" cy="'+g0.gy(y)+'" r="13" fill="var(--panel)" stroke="var(--ink)" stroke-width="2"/><text x="'+g0.gx(x)+'" y="'+(g0.gy(y)+5)+'" text-anchor="middle" font-size="14" fill="var(--ink)">'+t+'</text>';}
const GR={xMin:0,xMax:1,yMin:0,yMax:12,xTicks:[0,0.2,0.4,0.6,0.8,1],yTicks:[0,2,4,6,8,10,12],xLabel:'L (m)',yLabel:'R (Ω)',W:560,H:340};
{
  const body=act('graphs','Calculate','Two wires','The graph shows R against L for two wires of the same metal: P has a diameter of 0.25 mm, and Q is thicker. Use two points on each line.');
  const split=mk('div','graph-split');body.appendChild(split);
  const g0=lineGraph(Object.assign({points:[[0,0]]},GR));
  split.appendChild(mk('div','graph-box',lineGraph(Object.assign({label:'R against L for two wires of the same metal, line P steeper than line Q',segments:[{pts:[[0,0.2],[1,10.2]]},{pts:[[0,0.2],[1,2.7]],cls:'g-line-b'}],
    extra:lab(g0,'P',0.8,8.2+1.1)+lab(g0,'Q',0.8,2.2+1.1)},GR)).svg));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'Line P: what is its gradient?',unit:'Ω m⁻¹',answer:10,working:'first point = (0, 0.2)<br>second point = (1.0, 10.2)<br>gradient = ?||gradient = [[change in R|change in L]]<br>gradient = [[10.2 − 0.2|1.0 − 0]]<br>gradient = 10.0 Ω m⁻¹'},
    {q:'Use line P to find the resistivity of the metal.',unit:'Ω m',answer:4.91e-7,working:'gradient = 10.0 Ω m⁻¹<br>d = 0.25 mm = 0.25 × 10⁻³ m<br>ρ = ?||A = [[πd²|4]]<br>A = [[π × (0.25 × 10⁻³)²|4]]<br>A = 4.909 × 10⁻⁸ m²<br>ρ = gradient × A<br>ρ = 10.0 × 4.909 × 10⁻⁸<br>ρ = 4.91 × 10⁻⁷ Ω m'},
    {q:'Line Q has a quarter of the gradient of P. What is the diameter of wire Q?',unit:'mm',answer:0.5,working:'gradient of Q = [[1|4]] × gradient of P<br>d of P = 0.25 mm<br>d of Q = ?||gradient = [[ρ|A]], so A is 4 times bigger<br>A ∝ d², so d is √4 = 2 times bigger<br>d = 2 × 0.25<br>d = 0.50 mm'}
  ]});
}
{
  const body=act('graphs','Multiple choice','Reading the line','Two quick questions about a graph of R against L.');
  createPredict({host:body,q:'A student’s line of best fit cuts the R axis at 0.15 Ω, not at 0. What does the 0.15 Ω show?',options:[
    {text:'The clips’ contact resistance',correct:true},
    {text:'A zero error on the metre rule',why:'A zero error in L would move the line sideways, and it would show on the L axis in metres, not on the R axis in ohms.'},
    {text:'The internal resistance of the cell',why:'The voltmeter is across the wire only, so R = V/I does not include anything inside the cell.'}
  ],explain:'An extra resistance that is the same at every length moves the whole line up. The gradient, ρ/A, is not changed by it, which is why ρ comes from the gradient.'});
}

/* ================= 6. CALCULATE ================= */
{
  const body=act('calculate','Calculate','Resistivity','Use R = [[ρL|A]] and A = [[πd²|4]]. Type a power of ten as e.g. 4.9e-7. Press New problems for another set.');
  const MET=[['constantan',4.9e-7],['nichrome',1.1e-6],['manganin',4.4e-7],['copper',1.7e-8]];
  createCalc({host:body,questions:[
    {q:'A constantan wire has a diameter of 0.40 mm and a resistance of 3.9 Ω. Its resistivity is 4.9 × 10⁻⁷ Ω m. How long is it?',unit:'m',answer:1.0,working:'d = 0.40 mm = 0.40 × 10⁻³ m<br>R = 3.9 Ω<br>ρ = 4.9 × 10⁻⁷ Ω m<br>L = ?||A = [[πd²|4]]<br>A = [[π × (0.40 × 10⁻³)²|4]]<br>A = 1.257 × 10⁻⁷ m²<br>R = [[ρL|A]]<br>3.9 = [[4.9 × 10⁻⁷ × L|1.257 × 10⁻⁷]]<br>L = [[3.9 × 1.257 × 10⁻⁷|4.9 × 10⁻⁷]]<br>L = 1.0 m',
     make:rnd=>{const m=calcPick(rnd,MET.slice(0,3)),d=calcPick(rnd,[0.20,0.25,0.30,0.32,0.40,0.50]),L=calcPick(rnd,[0.50,0.75,1.20,1.50,2.00]),A=Math.PI*Math.pow(d*1e-3,2)/4,R=+(m[1]*L/A).toPrecision(2),Lc=R*A/m[1];
       const ex=(v)=>{const e=Math.floor(Math.log10(v)),mm=v/Math.pow(10,e);return g4(mm)+' × 10'+String(e).replace('-','⁻').replace(/\d/g,c=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[c]);};
       return {q:`A ${m[0]} wire has a diameter of ${d.toFixed(2)} mm and a resistance of ${R} Ω. Its resistivity is ${ex(m[1])} Ω m. How long is it?`,unit:'m',answer:+Lc.toPrecision(2),
         working:`d = ${d.toFixed(2)} mm = ${d.toFixed(2)} × 10⁻³ m<br>R = ${R} Ω<br>ρ = ${ex(m[1])} Ω m<br>L = ?||A = [[πd²|4]]<br>A = [[π × (${d.toFixed(2)} × 10⁻³)²|4]]<br>A = ${ex(A)} m²<br>R = [[ρL|A]]<br>${R} = [[${ex(m[1])} × L|${ex(A)}]]<br>L = [[${R} × ${ex(A)}|${ex(m[1])}]]<br>L = ${g3(Lc)} m`};}},
    {q:'A wire 1.50 m long with a diameter of 0.25 mm has a resistance of 33.6 Ω. What is the resistivity of the metal?',unit:'Ω m',answer:1.1e-6,working:'L = 1.50 m<br>d = 0.25 mm = 0.25 × 10⁻³ m<br>R = 33.6 Ω<br>ρ = ?||A = [[πd²|4]]<br>A = [[π × (0.25 × 10⁻³)²|4]]<br>A = 4.909 × 10⁻⁸ m²<br>R = [[ρL|A]]<br>ρ = [[RA|L]]<br>ρ = [[33.6 × 4.909 × 10⁻⁸|1.50]]<br>ρ = 1.10 × 10⁻⁶ Ω m',
     hints:['Change d to metres and work out A = πd²/4 first.','Rearrange R = ρL/A to ρ = RA/L.'],
     make:rnd=>{const m=calcPick(rnd,MET),d=calcPick(rnd,[0.20,0.25,0.30,0.40,0.50]),L=calcPick(rnd,[0.80,1.00,1.20,1.50,2.00]),A=Math.PI*Math.pow(d*1e-3,2)/4,R=+(m[1]*L/A).toPrecision(3),rho=R*A/L;
       const ex=(v)=>{const e=Math.floor(Math.log10(v)),mm=v/Math.pow(10,e);return g3(mm)+' × 10'+String(e).replace('-','⁻').replace(/\d/g,c=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[c]);};
       return {q:`A wire ${L.toFixed(2)} m long with a diameter of ${d.toFixed(2)} mm has a resistance of ${R} Ω. What is the resistivity of the metal?`,unit:'Ω m',answer:+rho.toPrecision(3),
         hints:['Change d to metres and work out A = πd²/4 first.','Rearrange R = ρL/A to ρ = RA/L.'],
         working:`L = ${L.toFixed(2)} m<br>d = ${d.toFixed(2)} mm = ${d.toFixed(2)} × 10⁻³ m<br>R = ${R} Ω<br>ρ = ?||A = [[πd²|4]]<br>A = [[π × (${d.toFixed(2)} × 10⁻³)²|4]]<br>A = ${ex(A)} m²<br>R = [[ρL|A]]<br>ρ = [[RA|L]]<br>ρ = [[${R} × ${ex(A)}|${L.toFixed(2)}]]<br>ρ = ${ex(rho)} Ω m`};}}
  ]});
}

/* ================= 7. ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Why each step is done','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'More accurate ρ',hint:'Cuts the uncertainty or a systematic error',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps it safe or the wire cool',hint:'Stops the wire heating up or burning someone',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Measure the diameter in several places and at right angles, then take the mean',cat:'a'},
    {id:'2',text:'Use the gradient of R against L, not one reading',cat:'a'},
    {id:'3',text:'Use lengths spread across the whole metre rule',cat:'a'},
    {id:'4',text:'Check and correct the micrometer for a zero error, which removes a systematic error',cat:'a'}, {id:'8',text:'Close the micrometer with its ratchet, so it is not overtightened on the wire',cat:'a'}, {id:'9',text:'Clean the wire where the clips touch it, so the contact resistance is small',cat:'a'},
    {id:'5',text:'Switch off between readings',cat:'s'},
    {id:'6',text:'Keep the current small with a protective resistor',cat:'s'},
    {id:'7',text:'Do not touch the wire while the current is on, as a short length can get hot',cat:'s'}
  ]});
}
{
  const body=act('accuracy','Multiple choice','The biggest uncertainty','The diameter is about 0.32 mm and the micrometer reads to 0.01 mm.');
  createPredict({host:body,q:'The length is read to 1 mm on lengths of 18 to 90 cm. Which measurement gives the biggest percentage uncertainty in ρ?',options:[
    {text:'The diameter, as A depends on d²',correct:true},
    {text:'The length, as it is the largest reading',why:'Half of 1 mm in 18 cm is only about 0.3%. A large reading has a small percentage uncertainty.'},
    {text:'The current, as it changes with L',why:'Half of 0.001 A in about 0.2 A is about 0.25%. A changing reading is not the same as an uncertain one.'}
  ],explain:'The uncertainty in one reading is half the resolution: 0.005 mm in 0.32 mm is about 1.6%, and squaring d to get A doubles it to about 3%. That is why the diameter is measured several times and averaged.'});
}

/* ================= EXAM PRACTICE ================= */
{
  const body=act('exam','Exam style','The resistivity of nichrome','Rose measures the resistance of different lengths of nichrome wire (type a power of ten as e.g. 6.16e-8). She measures the diameter of the wire at three places: 0.27 mm, 0.28 mm and 0.29 mm.');
  body.appendChild(resTable(['L (m)','0.200','0.400','0.600','0.800'],[['V (V)','0.84','1.38','1.71','1.92'],['I (A)','0.240','0.200','0.165','0.140'],['R (Ω)','3.50','6.90',null,'13.71']]));
  body.appendChild(mk('p','sub','(a) 1 mark'));
  createCalc({host:body,questions:[
    {q:'Calculate the missing resistance at 0.600 m.',unit:'Ω',answer:10.36,working:'V = 1.71 V<br>I = 0.165 A<br>R = ?||R = [[V|I]]<br>R = [[1.71|0.165]]<br>R = 10.36 Ω'}
  ]});
  body.appendChild(mk('p','sub','(b) 2 marks'));
  createCalc({host:body,questions:[
    {q:'Calculate the cross-sectional area of the wire.',unit:'m²',answer:6.16e-8,working:'mean d = [[0.27 + 0.28 + 0.29|3]]<br>mean d = 0.28 mm = 0.28 × 10⁻³ m<br>A = ?||A = [[πd²|4]]<br>A = [[π × (0.28 × 10⁻³)²|4]]<br>A = 6.16 × 10⁻⁸ m²'}
  ]});
  body.appendChild(mk('p','sub','(c) 3 marks'));
  createCalc({host:body,questions:[
    {q:'Use the readings at 0.200 m and 0.800 m to calculate the resistivity of nichrome.',unit:'Ω m',answer:1.05e-6,working:'R at 0.200 m = 3.50 Ω<br>R at 0.800 m = 13.71 Ω<br>A = 6.16 × 10⁻⁸ m²<br>ρ = ?||gradient = [[13.71 − 3.50|0.800 − 0.200]]<br>gradient = [[10.21|0.600]]<br>gradient = 17.02 Ω m⁻¹<br>ρ = gradient × A<br>ρ = 17.02 × 6.16 × 10⁻⁸<br>ρ = 1.05 × 10⁻⁶ Ω m'}
  ]});
  examPart(body,'(d) 2 marks','Explain why Rose uses the gradient of a graph of R against L, rather than one value of R and L.',[
    'The clips and leads (contact resistance), or a zero error on a meter, add a resistance that is the same at every length, so the line does not pass through the origin.',
    'The gradient (ρ/A) does not include that extra resistance, and a line through many points averages out random errors.'
  ]);
  examPart(body,'(e) 2 marks','Explain why Rose measures the diameter at several places along the wire and at right angles.',[
    'The wire may not be uniform, or may not be perfectly round.',
    'Repeating and taking a mean reduces the effect of random errors in d, whose percentage uncertainty is doubled in A because A ∝ d².'
  ]);
  examPart(body,'(f) 6 marks','Describe how Rose should carry out this investigation to obtain an accurate value for the resistivity of nichrome.',[
    'Measure the diameter with a micrometer (using its ratchet) at several places and at right angles; check and correct for zero error; find the mean and A = πd²/4.',
    'Tape the wire to a metre rule; connect it in series with an ammeter (and a protective resistor), with a voltmeter across the length being tested.',
    'Measure L between the clips with the metre rule; record V and I; use R = V/I.',
    'Repeat for at least six lengths across the range (e.g. 0.2 m to 0.9 m).',
    'A fixed resistor limits the current and the switch is opened between readings, so the wire does not overheat and change its resistance.',
    'Plot R against L; the gradient = ρ/A, so ρ = gradient × A.'
  ]);
}
