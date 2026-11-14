/* CP12 Calibrate a thermistor in a potential divider circuit as a thermostat (IAL spec 126).
   Model thermistor (same as animations/thermistor.html): R = R₀e^(b/T), b = 3900 K, 5.00 kΩ at 25 °C,
   so ln (R₀ / Ω) = −4.57. T = θ + 273. 
   Rebuilt on the CP15 model on 14 Nov 2026 (TODO.md 5z): no Variables or Results tab, no Predicts; a ninth tab, Use the Divider,
   keeps Part 2 of the practical. Do the Experiment frames animations/thermistor.html?show=measure&part=cal and Use the Divider
   ?show=measure&part=pd; TH_TH, TH_R, TH_RV, TH_VR and TH_VT below must match MEAS_TH, MEAS_R, MEAS_RV, MEAS_VR and MEAS_VT
   in the animation (tools/CORE-PRACTICALS.md, "Measure modes"). */
/* measTable: the student's own results table for Do Experiment (CP15 model; written for CP12–14, 14 Nov 2026).
   cols: [{c, head, val:k=>number, tol, show:k=>string, given:k=>string (a printed cell instead of a box), lab:k=>aria label}].
   Show answer is always visible (as on CP15), so a student can skip to the plot; it hides once the table is complete. */
function measTable(body,o){
  const wrap=mk('div','table-scroll');body.appendChild(wrap);
  const rows=[];for(let k=0;k<o.n;k++)rows.push(k);
  wrap.innerHTML='<table class="units res-tbl ga-tbl"><thead><tr>'+o.cols.map(c=>'<th>'+c.head+'</th>').join('')+'</tr></thead><tbody>'+
    rows.map(k=>'<tr>'+o.cols.map(c=>c.given?'<td class="given">'+c.given(k)+'</td>':
      '<td><input class="calc-num-input" data-c="'+c.c+'" data-k="'+k+'" inputmode="decimal" autocomplete="off" aria-label="'+c.lab(k)+'"></td>').join('')+'</tr>').join('')+'</tbody></table>';
  const col=id=>o.cols.find(c=>c.c===id), all=()=>$$('input',wrap), inp=(c,k)=>$('input[data-c="'+c+'"][data-k="'+k+'"]',wrap);
  const val=e=>{const t=e.value.trim().replace(/[−–]/g,'-').replace(',','.');return t===''||!/^-?(\d+\.?\d*|\.\d+)$/.test(t)?NaN:parseFloat(t);};
  const done=()=>all().every(e=>e.disabled), changed=()=>{if(o.onChange)o.onChange();};
  const b=bar(body,[{label:'Check table',primary:true,fn:check},{label:'Clear',fn:reset}]);
  const ans=answerBtn(b,()=>{
    all().forEach(e=>{if(e.disabled)return;e.value=col(e.dataset.c).show(+e.dataset.k);e.disabled=true;e.classList.add('is-shown');e.classList.remove('is-wrong');});
    b.say('Answers shown (dashed). '+o.next,'');changed();
  });
  function check(){
    let ok=0,bad=0,blank=0;
    all().forEach(e=>{
      if(e.disabled){ok++;return;}
      if(e.value.trim()===''){blank++;return;}
      const c=col(e.dataset.c),v=val(e),w=c.val(+e.dataset.k);
      if(isFinite(v)&&Math.abs(v-w)<=c.tol+1e-9){e.disabled=true;e.classList.remove('is-wrong');e.classList.add('pop');ok++;}
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
    setState:s=>{reset();all().forEach((e,i)=>{if(!s||!s.v||typeof s.v[i]!=='string')return;e.value=s.v[i];if(s.ok&&s.ok[i]){e.disabled=true;if(s.sh&&s.sh[i])e.classList.add('is-shown');}});if(done()){b.say('All correct. '+o.next,'good');ans.off();}changed();},
    isDone:done});
  // a checked (or shown) cell's text, for the plot's row labels
  return {cell:(c,k)=>{const e=inp(c,k);return e&&e.disabled&&e.value.trim()!==''?e.value.trim():null;}};
}
/* Put the Your turn card and the framed animation in a left column, with the table on the right (as on CP15). */
function splitDo(tab,turnTitle){
  const fr=$('#panel-'+tab+' .anim-wrap'),tb=$('#panel-'+tab+' .ga-tbl'),yt=$('#panel-'+tab+' .act[data-title="'+turnTitle+'"]');
  if(!fr||!tb)return;
  const t=tb.closest('.act'),sp=mk('div','hk-split'),left=mk('div','ga-left');
  fr.parentNode.insertBefore(sp,fr);sp.appendChild(left);if(yt)left.appendChild(yt);left.appendChild(fr);sp.appendChild(t);
}

/* ================= 1. OVERVIEW ================= */
{
  const body=act('overview','Fill in the blanks','The practical in one passage','Drag a word into each gap, or tap a word and then tap a gap. Some words are not needed.');
  const parts=[
    'Put the thermistor and a thermometer side by side in a beaker of ',['b1','ice and water'],', so you start at 0 °C. Measure the thermistor’s resistance with an ',['b2','ohmmeter'],
    '. Heat the water slowly and keep ',['b3','stirring'],'; before each reading, wait for the thermistor to reach the same temperature as the water (thermal equilibrium). Read θ and R every 10 °C. The resistance of an NTC thermistor ',['b4','decreases'],
    ' as its temperature rises. R = R₀e<sup>b/T</sup>, where T is the ',['b5','absolute temperature'],', in kelvin. Taking natural logs gives ln R = b × (1/T) + ln R₀, so a graph of ',['b6','ln R against 1/T'],
    ' is a straight line, and its gradient is ',['b7','b'],'. To make a thermostat, put the thermistor in series with a variable resistor across a 6.0 V supply: a ',['b8','potential divider'],
    '. The output across the thermistor is 3.0 V at 40 °C when the variable resistor is set to the ',['b9','thermistor’s resistance at 40 °C'],'.'
  ];
  const cloze=mk('div','cloze'),slots=[],chips=[];
  parts.forEach(p=>{
    if(typeof p==='string')cloze.appendChild(mk('span','',p));
    else{const s=mk('span','blank');cloze.appendChild(s);slots.push({id:p[0],el:s,answer:p[1]});chips.push({id:'c-'+p[0],text:p[1]});}
  });
  ['increases','ammeter','R against θ','ln R₀','temperature in °C'].forEach((t,i)=>chips.push({id:'d'+i,text:t}));
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
  const body=act('method','Order','Calibrate the thermistor','Put the steps in the order you would do them. Drag the ≡ handle, or use the ▲▼ buttons.');
  createReorder({host:body,steps:[
    {id:'a',text:'Connect the thermistor to an ohmmeter (a multimeter on its resistance setting).'},
    {id:'b',text:'Put the thermistor and the thermometer bulb side by side in a beaker of ice and water.'},
    {id:'c',text:'Stir, wait until the readings are steady, then record θ (0 °C) and R.'},
    {id:'d',text:'Heat the water gently with the Bunsen burner, stirring all the time.'},
    {id:'e',text:'At each 10 °C rise, remove the heat, stir and wait for the reading to settle, then record θ and R.'},
    {id:'f',text:'Repeat up to 80 °C.'},
    {id:'g',text:'Convert each θ to T in kelvin, then work out 1/T and ln R.'},
    {id:'h',text:'Plot ln R against 1/T: the gradient is b and the intercept is ln R₀.'}
  ],constraints:[['a','c'],['b','c'],['c','d'],['d','e'],['e','f'],['f','h'],['g','h']],
  why:'The first reading is in ice and water at 0 °C, before any heating; the graph needs every reading converted first.'});
}
{
  const body=act('method','Match','What each piece of equipment is for','Pair each piece of equipment with its job. Drag one card onto the other, or tap one card and then the other.');
  createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'o',l:'Ohmmeter',r:'Measures the resistance of the thermistor directly'},
    {id:'t',l:'Alcohol thermometer',r:'Measures the temperature of the water next to the thermistor'},
    {id:'i',l:'Ice',r:'Brings the water down to the 0 °C starting point'},
    {id:'s',l:'Stirrer',r:'Keeps the water at the same temperature all through the beaker'},
    {id:'v',l:'Variable resistor',r:'Sets how the 6.0 V supply is shared in the potential divider'},
    {id:'m',l:'Voltmeter',r:'Measures the output voltage across the thermistor or the resistor'}
  ]});
}
/* ================= DO THE EXPERIMENT (Part 1: calibration) ================= */
// The student reads the thermometer close-up and the ohmmeter in the animation's measure mode (?show=measure&part=cal).
const TH_TH=[0.0,11.0,21.0,30.0,39.5,50.5,59.5,70.5,79.0], TH_R=[16.57,9.47,5.97,4.03,2.71,1.788,1.286,0.886,0.671];   // θ in °C, R in kΩ
const TH_IT=TH_TH.map(t=>1000/(t+273)), TH_LN=TH_R.map(r=>Math.log(r*1000));   // 1/T in 10⁻³ K⁻¹, ln (R / Ω)
let thTable=null,thPlotRows=()=>{};
{
  act('do','Your turn','Take your own readings','1. Read the thermometer and the ohmmeter in the ice and water. 2. Press Heat the water and read both again; do this eight times, up to about 80 °C. 3. Fill in the table, then work out 1/T (T = θ + 273) and ln (R / Ω) for each reading.');
}
frameAct('do','animations/thermistor.html','measure&part=cal','Thermistor calibration experiment: read the thermometer and the ohmmeter','thermistor',false);
{
  const body=act('do','Calculate','Your results table','Write θ to 0.5 °C and R as the ohmmeter shows it, in kΩ. Give 1/T in 10⁻³ K⁻¹ to 4 significant figures and ln (R / Ω) to 3 decimal places. Press Check.');
  thTable=measTable(body,{n:TH_TH.length,next:'Now plot ln R against 1/T below.',
    hint:'T = θ + 273, so at 11.0 °C, 1/T = 1 ÷ 284.0 = 3.521 × 10⁻³ K⁻¹. Change R to ohms before taking ln: 9.47 kΩ = 9470 Ω, ln 9470 = 9.156.',
    onChange:()=>thPlotRows(),
    cols:[
      {c:'th',head:'θ (°C)',val:k=>TH_TH[k],tol:0.05,show:k=>TH_TH[k].toFixed(1),lab:k=>'Temperature, reading '+(k+1)+', degrees Celsius'},
      {c:'r',head:'R (kΩ)',val:k=>TH_R[k],tol:0.0005,show:k=>String(TH_R[k]),lab:k=>'Resistance, reading '+(k+1)+', kilohms'},
      {c:'it',head:'1/T (10⁻³ K⁻¹)',val:k=>TH_IT[k],tol:0.0011,show:k=>TH_IT[k].toFixed(3),lab:k=>'One over T, reading '+(k+1)+', times 10 to the minus 3 per kelvin'},
      {c:'ln',head:'ln (R / Ω)',val:k=>TH_LN[k],tol:0.0015,show:k=>TH_LN[k].toFixed(3),lab:k=>'Natural log of R in ohms, reading '+(k+1)}
    ]});
}
{
  const body=act('do','Explain','Why plot ln R against 1/T?','R = R<sub>0</sub>e<sup>b/T</sup> is a curve. Take ln of each side:');
  body.insertAdjacentHTML('beforeend',
    '<div class="ln-steps"><span>ln R</span><span>=</span><span>ln (R<sub>0</sub>e<sup>b/T</sup>)</span>'+
    '<span>ln R</span><span>=</span><span>ln R<sub>0</sub> + ln (e<sup>b/T</sup>)</span>'+
    '<span>ln R</span><span>=</span><span>ln R<sub>0</sub> + b/T</span></div>'+
    '<p class="act-intro">In the order of y = mx + c:</p>'+
    '<div class="ln-match"><span>ln R</span><span>=</span><span>b</span><span>1/T</span><span>+</span><span>ln R<sub>0</sub></span>'+
    '<span>y</span><span>=</span><span>m</span><span>x</span><span>+</span><span>c</span></div>'+
    '<p class="act-intro">So ln R against 1/T is a straight line: gradient = b, intercept = ln R<sub>0</sub>. T must be in kelvin, and R in ohms before taking the log. The line is the calibration: from any resistance it gives the temperature.</p>');
}
{
  const body=act('do','Plot','Plot your results','Plot ln (R / Ω) against 1/T from your table as small crosses. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');
  const rowT=k=>{const a=thTable&&thTable.cell('it',k),c=thTable&&thTable.cell('ln',k);return TH_TH[k].toFixed(1)+' °C: '+(a&&c?'1/T = '+a+', ln R = '+c:'your 1/T and ln R');};
  createPlot({host:body,next:' Now find b from the line of best fit below.',
    points:TH_IT.map((x,k)=>({x:+x.toFixed(3),y:+TH_LN[k].toFixed(3)})),
    rowText:p=>rowT(TH_IT.findIndex(x=>Math.abs(x-p.x)<0.0006)),
    graph:{xMin:2.8,xMax:3.7,yMin:6,yMax:10,xTicks:[2.8,3.0,3.2,3.4,3.6],yTicks:[6,7,8,9,10],minor:[0.05,0.25],snap:[0.01,0.05],xLabel:'1/T (10⁻³ K⁻¹)',yLabel:'ln (R / Ω)',W:560,H:340}});
  splitDo('do','Take your own readings');
  thPlotRows=()=>{$$('.plot-row',body).forEach((li,k)=>{const s=li.firstElementChild;if(s)s.textContent=rowT(k);});};
  thPlotRows();
}
{
  const body=act('do','Calculate','b from your line','A good line of best fit through your points passes through (2.80, 6.351) and (3.60, 9.467), with 1/T in 10⁻³ K⁻¹.');
  createCalc({host:body,questions:[
    {q:'What is the gradient of the line, b?',unit:'K',answer:3895,working:'first point = (2.80 × 10⁻³, 6.351)<br>second point = (3.60 × 10⁻³, 9.467)<br>b = ?||b = [[change in ln R|change in 1/T]]<br>b = [[9.467 − 6.351|(3.60 − 2.80) × 10⁻³]]<br>b = [[3.116|0.80 × 10⁻³]]<br>b = 3895 K'},
    {q:'Use the line to find the resistance of the thermistor at 25 °C.',unit:'kΩ',answer:5.0,working:'T = 25 + 273 = 298 K<br>[[1|T]] = [[1|298]] = 3.356 × 10⁻³ K⁻¹<br>b = 3895 K<br>R = ?||ln R = 6.351 + b × ([[1|T]] − 2.80 × 10⁻³)<br>ln R = 6.351 + 3895 × (3.356 − 2.80) × 10⁻³<br>ln R = 6.351 + 2.166<br>ln R = 8.517<br>R = e<sup>8.517</sup><br>R = 5000 Ω = 5.0 kΩ'}
  ]});
}
/* ================= WATCH THE EXPERIMENT ================= */
{
  act('experiment','Your turn','Watch the readings','Press Experiment. Read θ and R at 0 °C, then heat 10 °C at a time up to 80 °C and watch your table and graph fill in. Choose “ln R against 1/T” to find b and R₀. Then do it again with No stirring: how far out is b, and why?');
}
frameAct('experiment','animations/thermistor.html','cal','Thermistor calibration animation','thermistor calibration',false);
/* ================= USE THE DIVIDER (Part 2) ================= */
// The thermistor is in a beaker whose temperature is not shown; the student reads the two voltmeters at three settings of R.
const TH_RV=[2.0,5.0,8.0], TH_VR=[2.21,3.56,4.19], TH_VT=[3.77,2.42,1.79];   // R in kΩ, voltages in V
const TH_RT=TH_RV.map((r,k)=>r*TH_VT[k]/TH_VR[k]);
{
  act('divider','Your turn','Find the temperature','The thermistor is now in a potential divider with a variable resistor, in a beaker of water at a temperature you are not told. 1. Read both voltmeters at each setting of the variable resistor. 2. Work out R<sub>T</sub> for each, then use your calibration to find the temperature.');
}
frameAct('divider','animations/thermistor.html','measure&part=pd','Thermistor potential divider: read the two voltmeters','thermistor',false);
{
  const body=act('divider','Calculate','Your results table','Write each voltage as the voltmeter shows it, in V. The current is the same through both parts, so R<sub>T</sub> = R × V<sub>T</sub> / V<sub>R</sub>; give it in kΩ to 2 decimal places. Press Check.');
  measTable(body,{n:3,next:'Now find the temperature below.',
    hint:'R<sub>T</sub> = R × V<sub>T</sub> / V<sub>R</sub>: at 2.0 kΩ, 2.0 × 3.77 / 2.21 = 3.41 kΩ.'.replace(/<\/?sub>/g,''),
    cols:[
      {c:'rv',head:'R (kΩ)',given:k=>TH_RV[k].toFixed(1)},
      {c:'vr',head:'V across R (V)',val:k=>TH_VR[k],tol:0.005,show:k=>TH_VR[k].toFixed(2),lab:k=>'Voltage across the variable resistor at '+TH_RV[k]+' kilohms'},
      {c:'vt',head:'V across thermistor (V)',val:k=>TH_VT[k],tol:0.005,show:k=>TH_VT[k].toFixed(2),lab:k=>'Voltage across the thermistor at '+TH_RV[k]+' kilohms'},
      {c:'rt',head:'R<sub>T</sub> (kΩ)',val:k=>TH_RT[k],tol:0.0101,show:k=>TH_RT[k].toFixed(2),lab:k=>'Resistance of the thermistor at '+TH_RV[k]+' kilohms setting'}
    ]});
  splitDo('divider','Find the temperature');
}
{
  const body=act('divider','Calculate','The temperature of the water','Use the mean of your three values of R<sub>T</sub> and the calibration line from Do the Experiment: it passes through (2.80 × 10⁻³ K⁻¹, 6.351) with gradient b = 3895 K.');
  createCalc({host:body,questions:[
    {q:'What is the mean resistance of the thermistor?',unit:'kΩ',answer:3.41,working:'R<sub>T</sub> = 3.41, 3.40, 3.42 kΩ<br>mean = ?||mean = [[3.41 + 3.40 + 3.42|3]]<br>mean = 3.41 kΩ'},
    {q:'What is the temperature of the water?',unit:'°C',answer:34,working:'R<sub>T</sub> = 3410 Ω<br>ln R<sub>T</sub> = 8.135<br>b = 3895 K<br>θ = ?||ln R = 6.351 + b × ([[1|T]] − 2.80 × 10⁻³)<br>8.135 = 6.351 + 3895 × ([[1|T]] − 2.80 × 10⁻³)<br>[[1|T]] − 2.80 × 10⁻³ = [[1.784|3895]] = 0.458 × 10⁻³<br>[[1|T]] = 3.258 × 10⁻³ K⁻¹<br>T = 306.9 K<br>θ = 306.9 − 273 = 34 °C'}
  ]});
}
{
  const body=act('divider','Calculate','Design and use the divider','Use the thermistor in the graphs: R<sub>T</sub> = 2.67 kΩ at 40 °C and 6.25 kΩ at 20 °C. The supply is 6.0 V.');
  createCalc({host:body,questions:[
    {q:'What setting of the variable resistor gives an output of 3.0 V across the thermistor at 40 °C?',unit:'kΩ',answer:2.67,working:'V<sub>out</sub> = [[R<sub>T</sub>|R<sub>T</sub> + R]] × V<br>3.0 = [[2.67|2.67 + R]] × 6.0<br>3.0 × (2.67 + R) = 2.67 × 6.0<br>8.01 + 3.0 R = 16.02<br>3.0 R = 8.01<br>R = [[8.01|3.0]]<br>R = 2.67 kΩ'},
    {q:'With R = 2.67 kΩ, what is the output across the thermistor at 20 °C?',unit:'V',answer:4.20,working:'V<sub>out</sub> = [[R<sub>T</sub>|R<sub>T</sub> + R]] × V<br>V<sub>out</sub> = [[6.25|6.25 + 2.67]] × 6.0<br>V<sub>out</sub> = [[6.25|8.92]] × 6.0<br>V<sub>out</sub> = 4.20 V'}
  ]});
}
{
  const body=act('divider','Multiple choice','Warming up','');
  createPredict({host:body,q:'The water around the thermistor warms up. What happens to the output voltage across the thermistor?',options:[
    {text:'It falls, because R<sub>T</sub> falls',correct:true},
    {text:'It rises, because R<sub>T</sub> falls',why:'The same current passes through both parts, so each takes a share of 6.0 V in proportion to its resistance. A smaller R<sub>T</sub> gets a smaller share.'},
    {text:'It stays at 3.0 V',why:'It is only 3.0 V when R<sub>T</sub> equals R. As R<sub>T</sub> changes, the share changes.'},
    {text:'It rises, because R<sub>T</sub> rises',why:'This is an NTC thermistor: its resistance falls as it warms up.'}
  ],explain:'V<sub>out</sub> = [[R<sub>T</sub>|R<sub>T</sub> + R]] × V. As the water warms, R<sub>T</sub> falls, so the thermistor’s share of the 6.0 V falls. The voltage across the variable resistor rises by the same amount.'});
}
/* ================= ANALYSIS ================= */
const GL={xMin:2.8,xMax:3.7,yMin:6,yMax:10,xTicks:[2.8,3.0,3.2,3.4,3.6],yTicks:[6,7,8,9,10],xLabel:'1/T (10⁻³ K⁻¹)',yLabel:'ln (R / Ω)',W:560,H:340};
function dot(g0,x,y,t,dx,dy){return '<circle cx="'+g0.gx(x)+'" cy="'+g0.gy(y)+'" r="5" fill="var(--accent)"/><text x="'+(g0.gx(x)+(dx||8))+'" y="'+(g0.gy(y)+(dy||-8))+'" font-size="13" fill="var(--ink)" text-anchor="'+((dx||8)<0?'end':'start')+'">'+t+'</text>';}
{
  const body=act('graphs','Calculate','Read the ln R graph','Read your answers off the graph. The two marked points are on the line.');
  const split=mk('div','graph-split');body.appendChild(split);
  const g0=lineGraph(Object.assign({points:[[2.8,6.35]]},GL));
  split.appendChild(mk('div','graph-box',lineGraph(Object.assign({label:'ln R against 1/T for a thermistor',segments:[{pts:[[2.8,6.35],[3.7,9.86]]}],
    extra:dot(g0,2.8,6.35,'(2.80, 6.35)',10,4)+dot(g0,3.7,9.86,'(3.70, 9.86)',-10,-8)},GL)).svg));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'Find b from the gradient.',unit:'K',answer:3900,working:'gradient = [[change in ln R|change in 1/T]]<br>gradient = [[9.86 − 6.35|(3.70 − 2.80) × 10⁻³]]<br>gradient = [[3.51|0.90 × 10⁻³]]<br>b = 3900 K'},
    {q:'Find ln R₀ (R₀ in Ω). The intercept is off the graph, so use y = mx + c.',unit:'',answer:-4.57,working:'ln R = b × [[1|T]] + ln R₀<br>6.35 = 3900 × 2.80 × 10⁻³ + ln R₀<br>6.35 = 10.92 + ln R₀<br>ln R₀ = 6.35 − 10.92<br>ln R₀ = −4.57'},
    {q:'Read ln R at 1/T = 3.30 × 10⁻³ K⁻¹, then find R.',unit:'kΩ',answer:4.02,working:'At 1/T = 3.30, ln R = 8.30<br>R = e<sup>8.30</sup><br>R = 4024 Ω<br>R = 4.02 kΩ'}
  ]});
}
{
  const body=act('graphs','Multiple choice','Hot or cold?','');
  createPredict({host:body,q:'On the ln R against 1/T graph, which end of the line is the hottest water?',options:[
    {text:'The left end, where 1/T is smallest',correct:true},
    {text:'The right end, where 1/T is largest',why:'A large 1/T means a small T. The right end is the coldest water.'},
    {text:'The top end, where ln R is largest',why:'The largest resistance is at the lowest temperature for an NTC thermistor, so the top is the coldest.'},
    {text:'You cannot tell from this graph',why:'You can: T gets bigger as 1/T gets smaller, so temperature rises to the left.'}
  ],explain:'1/T is smallest when T is largest, so the hottest readings are on the left, where ln R is also smallest (an NTC thermistor’s resistance is lowest when hot).'});
}
const GR={xMin:0,xMax:80,yMin:0,yMax:18,xTicks:[0,10,20,30,40,50,60,70,80],yTicks:[0,3,6,9,12,15,18],xLabel:'θ (°C)',yLabel:'R (kΩ)',W:560,H:340};
const RT=t=>5*Math.exp(3900*(1/(t+273)-1/298));
{
  const body=act('graphs','Calculate','Read the R against θ graph','The calibration curve of the same thermistor. Read your answers off the graph.');
  const split=mk('div','graph-split');body.appendChild(split);
  const pts=[];for(let t=0;t<=80;t+=2)pts.push([t,+RT(t).toFixed(3)]);
  split.appendChild(mk('div','graph-box',lineGraph(Object.assign({label:'Resistance against temperature for an NTC thermistor',segments:[{pts}]},GR)).svg));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'What is the resistance at 20 °C?',unit:'kΩ',answer:6.25,working:'Read up from 20 °C to the curve, then across.<br>R = 6.25 kΩ'},
    {q:'At what temperature is the resistance 10 kΩ?',unit:'°C',answer:10,working:'Read across from 10 kΩ to the curve, then down.<br>θ = 10 °C'}
  ]});
}
{
  const body=act('graphs','Multiple choice','The axes the other way round','');
  createPredict({host:body,q:'Asma plots 1/T up the side and ln R along the bottom instead. What is the gradient of her straight line?',options:[
    {text:'1/b',correct:true},
    {text:'b',why:'b is the gradient when ln R is up the side. Swapping the axes turns the gradient upside down.'},
    {text:'ln R₀',why:'ln R₀ is the intercept of the ln R against 1/T graph, not a gradient.'},
    {text:'−b',why:'Swapping the axes does not change the sign of the gradient: both quantities still go up together.'}
  ],explain:'ln R = b(1/T) + ln R₀ rearranges to 1/T = (1/b) ln R − (ln R₀)/b. With 1/T up the side, the gradient is 1/b, so b = 1/gradient. Always check which way round the axes are.'});
}
/* ================= CALCULATE ================= */
{
  const body=act('calculate','Calculate','Using the calibration','Use T = θ + 273. For this thermistor, b = 3900 K and ln (R₀ / Ω) = −4.57.');
  createCalc({host:body,questions:[
    {q:'Find the resistance of the thermistor at 50 °C.',unit:'kΩ',answer:1.82,working:'ln R = [[b|T]] + ln R₀<br>ln R = [[3900|323]] + (−4.57)<br>ln R = 12.07 − 4.57<br>ln R = 7.504<br>R = e<sup>7.504</sup><br>R = 1816 Ω<br>R = 1.82 kΩ'},
    {q:'In a mystery beaker the thermistor’s resistance is 1.20 kΩ. Find the temperature of the water in °C.',unit:'°C',answer:61.5,working:'ln R = [[b|T]] + ln R₀<br>ln 1200 = [[3900|T]] + (−4.57)<br>7.090 + 4.57 = [[3900|T]]<br>11.66 = [[3900|T]]<br>T = [[3900|11.66]]<br>T = 334.5 K<br>θ = 334.5 − 273<br>θ = 61.5 °C'},
    {q:'A thermistor is 16.6 kΩ at 0 °C and 0.651 kΩ at 80 °C. Find b.',unit:'K',answer:3900,working:'ln R₁ − ln R₂ = b × ([[1|T₁]] − [[1|T₂]])<br>ln 16 600 − ln 651 = b × ([[1|273]] − [[1|353]])<br>3.239 = b × 8.301 × 10⁻⁴<br>b = [[3.239|8.301 × 10⁻⁴]]<br>b = 3902 K'},
    {q:'In the divider, R = 2.70 kΩ. The voltmeters read 4.10 V across R and 1.88 V across the thermistor. Find R<sub>T</sub>.',unit:'kΩ',answer:1.24,working:'[[R<sub>T</sub>|R]] = [[V<sub>T</sub>|V<sub>R</sub>]]<br>[[R<sub>T</sub>|2.70]] = [[1.88|4.10]]<br>R<sub>T</sub> = [[1.88 × 2.70|4.10]]<br>R<sub>T</sub> = 1.24 kΩ'}
  ]});
}
/* ================= ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Better results or safer?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'Better results',hint:'More accurate or more useful readings',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps people safe',hint:'Protects people and equipment',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Heat slowly and stir, so the thermistor reaches the water’s temperature',cat:'a'},
    {id:'2',text:'Put the thermometer bulb right next to the thermistor',cat:'a'},
    {id:'3',text:'Take readings over the whole range, from 0 °C to 80 °C',cat:'a'},
    {id:'4',text:'Log θ and R together with a data logger and probes',cat:'a'},
    {id:'5',text:'Keep the leads away from the hot gauze and Bunsen flame',cat:'s'},
    {id:'6',text:'Clamp the thermometer so the beaker cannot be knocked over',cat:'s'},
    {id:'7',text:'Keep the supply below the thermistor’s voltage rating',cat:'s'},
    {id:'8',text:'Let the tripod and gauze cool before you touch them',cat:'s'}
  ]});
}
{
  const body=act('accuracy','Multiple choice','Thermal equilibrium','');
  createPredict({host:body,q:'Why should Asma remove the heat and stir for a while before each reading?',options:[
    {text:'So the thermistor is as hot as the water',correct:true},
    {text:'So the ohmmeter has time to warm up',why:'The ohmmeter is outside the beaker. The waiting is for the thermistor to reach the water’s temperature.'},
    {text:'So that the water does not boil',why:'The water only goes up to 80 °C. The reason is to let the thermistor catch up with the water.'},
    {text:'So that the resistance stops changing for good',why:'R will change again as soon as she heats more. She waits so that R matches the θ she records.'}
  ],explain:'The thermistor and thermometer warm up more slowly than the water near the flame. Stirring and waiting brings everything to the same temperature (thermal equilibrium), so each R really belongs to the θ recorded with it.'});
}
{
  const body=act('accuracy','Multiple choice','Checking the result','');
  createPredict({host:body,q:'Haris’s potential divider should give 3.0 V at 40 °C. He measures 2.9 V. How should he judge his design?',options:[
    {text:'Compare the difference with his uncertainty',correct:true},
    {text:'It failed, because 2.9 V is not 3.0 V',why:'No measurement is exact. He needs to see whether the difference is bigger than his uncertainties.'},
    {text:'Repeat until a reading of exactly 3.0 V appears',why:'Repeating until you get the answer you want is not fair testing. Compare the difference with the uncertainty instead.'},
    {text:'Change the supply voltage until it reads 3.0 V',why:'That changes the design to fit the result. The supply must stay at 6.0 V.'}
  ],explain:'2.9 V is about 3% below 3.0 V. A 1 °C error in temperature changes R<sub>T</sub> by about 4%, but V<sub>out</sub> by only about 2%, because R<sub>T</sub> and R share the supply equally. So a 0.1 V difference needs about 2 °C of temperature error, or a few per cent of error in setting R. If his uncertainties are that big or bigger, the design works within experimental error. He can also check how straight his ln R graph is.'});
}
/* ================= EXAM PRACTICE ================= */
{
  const body=act('exam','Exam style','Calibrating a thermistor','Amelia calibrates an NTC thermistor. From her graph of ln R against 1/T she finds b = 3900 K and ln (R₀ / Ω) = −4.57. One result in her table is missing.');
  const tbl=mk('div','table-scroll');
  tbl.innerHTML='<table class="units res-tbl"><thead><tr><th>θ (°C)</th><th>0</th><th>30</th><th>60</th><th>80</th></tr></thead><tbody><tr><th>R (kΩ)</th><td>16.6</td><td>4.03</td><td><b>?</b></td><td>0.651</td></tr></tbody></table>';
  body.appendChild(tbl);
  body.appendChild(mk('p','sub','(a) 3 marks'));
  createCalc({host:body,questions:[
    {q:'Calculate the missing resistance at 60 °C.',unit:'kΩ',answer:1.26,working:'T = 60 + 273 = 333 K<br>ln R = [[b|T]] + ln R₀<br>ln R = [[3900|333]] + (−4.57)<br>ln R = 11.71 − 4.57<br>ln R = 7.142<br>R = e<sup>7.142</sup><br>R = 1264 Ω = 1.26 kΩ'}
  ]});
  body.appendChild(mk('p','sub','(b) 6 marks'));
  body.appendChild(mk('p','','Describe how Amelia should obtain accurate readings of θ and R from 0 °C to 80 °C.'));
  const d1=mk('details','');
  d1.innerHTML='<summary>Check your answer</summary><div><ul><li>Connect the thermistor to an ohmmeter (or measure V and I and use R = V/I).</li><li>Put the thermistor and thermometer bulb side by side in a beaker of ice and water, to start at 0 °C.</li><li>Heat the water slowly (Bunsen, tripod and gauze), stirring all the time.</li><li>Before each reading, remove the heat, stir and wait for the readings to become steady, so the thermistor is at the water’s temperature.</li><li>Record θ and R at regular intervals, e.g. every 10 °C, up to 80 °C.</li><li>Read the thermometer at eye level; a data logger with temperature and resistance probes can record both together.</li></ul></div>';
  body.appendChild(d1);
  body.appendChild(mk('p','sub','(c) 3 marks'));
  body.appendChild(mk('p','','R = R₀e<sup>b/T</sup>. Explain why Amelia plots ln R against 1/T, and how she finds b and R₀ from it.'));
  const d2=mk('details','');
  d2.innerHTML='<summary>Check your answer</summary><div><ul><li>Taking natural logs: ln R = b(1/T) + ln R₀, which has the form y = mx + c.</li><li>So ln R against 1/T is a straight line (with T in kelvin); the gradient is b.</li><li>The y-intercept is ln R₀, so R₀ = e<sup>intercept</sup>; as the intercept is far off the graph, work it out from c = y − mx for a point on the line.</li></ul></div>';
  body.appendChild(d2);
  body.appendChild(mk('p','sub','(d) 3 marks'));
  body.appendChild(mk('p','','Amelia puts the thermistor in series with a variable resistor across a 6.0 V supply. Explain how she should set the resistor so that the output across the thermistor is 3.0 V at 40 °C, and what happens to the output above 40 °C.'));
  const d3=mk('details','');
  d3.innerHTML='<summary>Check your answer</summary><div><ul><li>3.0 V is half of 6.0 V, so both parts must have the same resistance: set R equal to R<sub>T</sub> at 40 °C (2.67 kΩ, from the calibration).</li><li>The same current passes through both, so the voltage is shared in proportion to resistance.</li><li>Above 40 °C, R<sub>T</sub> falls (NTC), so the output across the thermistor falls below 3.0 V.</li></ul></div>';
  body.appendChild(d3);
  body.appendChild(mk('p','sub','(e) 2 marks'));
  body.appendChild(mk('p','','Amelia’s value of b is 6% lower than the manufacturer’s value. Suggest two improvements to her experiment (not her circuit design).'));
  const d4=mk('details','');
  d4.innerHTML='<summary>Check your answer</summary><div><ul><li>Heat more slowly and stir, waiting at each temperature, so the thermistor reaches thermal equilibrium with the water.</li><li>Keep the thermometer bulb right next to the thermistor, or use a data logger with temperature and resistance probes so θ and R are read at the same moment.</li><li>Take more readings over the whole range, so the line of best fit is more reliable.</li></ul><p class="sub">Any two. “Repeat the experiment” on its own is not enough: say what you would change.</p></div>';
  body.appendChild(d4);
}
