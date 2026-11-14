/* IAL CP14 Investigate the relationship between pressure and volume of a gas at fixed temperature (spec points 129, 130, 131).
   Rebuilt on the CP15 model (gamma-absorption) on 14 Nov 2026 (TODO.md 5z): 8 tabs, no Variables or Results tab, no Predicts.
   The Do the Experiment tab frames animations/boyles-law.html?show=measure, whose fixed readings must match
   BL_P and BL_V below (MEAS_P and MEAS_V in the animation; tools/CORE-PRACTICALS.md, "Measure modes"). */
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
    'A fixed mass of air is trapped at the top of a sealed glass tube, above some ',['b1','oil'],'. A hand pump raises the pressure, which is read on a ',['b2','pressure gauge'],
    ' in kPa, and the volume of the air is read from the scale beside the tube. Pump to the maximum safe pressure, then release the pressure in ',['b3','25 kPa'],' steps. Squashing the air warms it, so ',
    ['b4','wait'],' before each reading until the air is back at room ',['b5','temperature'],'. Plot p against ',['b6','1/V'],'. A straight line through the ',['b7','origin'],
    ' shows that pressure is ',['b8','inversely proportional'],' to volume, so pV is ',['b9','constant'],': Boyle’s law. It only holds for a fixed ',['b10','mass'],
    ' of gas at a fixed temperature. Since pV = NkT, the gradient of the line is NkT, so it gives the ',['b11','number of molecules'],', N.'
  ];
  const cloze=mk('div','cloze'),slots=[],chips=[];
  parts.forEach(p=>{
    if(typeof p==='string')cloze.appendChild(document.createTextNode(p));
    else{const s=mk('span','blank');cloze.appendChild(s);slots.push({id:p[0],el:s,answer:p[1]});chips.push({id:'c-'+p[0],text:p[1]});}
  });
  ['directly proportional','thermometer','speed','heat'].forEach((t,i)=>chips.push({id:'d'+i,text:t}));
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
    {id:'a',text:'Check that air is trapped above the oil and that every joint is tight, so no air can escape. Put on goggles and set up the safety screen.'},
    {id:'b',text:'Use the hand pump to raise the pressure to the maximum safe value, about 250 kPa.'},
    {id:'c',text:'Wait for the trapped air to cool back to room temperature.'},
    {id:'d',text:'Read the pressure on the gauge, and the volume on the scale with your eye level with the top of the oil.'},
    {id:'e',text:'Open the valve slowly to lower the pressure by 25 kPa, then close it.'},
    {id:'f',text:'Wait again, then read the pressure and volume. Repeat down to atmospheric pressure, about 100 kPa.'},
    {id:'g',text:'Work out 1/V for each reading, plot p against 1/V and draw a line of best fit.'}
  ],constraints:[['a','b'],['b','c'],['c','d'],['d','e'],['e','f'],['f','g']],
  why:'Pump up first, wait for the air to cool, and only then take each reading; plot once all the readings are in.'});
}
{
  const body=act('method','Match','What each part of the apparatus is for','Pair each part with its job. Drag one card onto the other, or tap one card and then the other.');
  createMatchGame({host:body,leftTitle:'Apparatus',rightTitle:'Its job',pairs:[
    {id:'t',l:'Glass tube with a scale',r:'Holds the trapped air and shows its volume'},
    {id:'o',l:'Oil',r:'Seals in the air and passes the pressure on to it'},
    {id:'g',l:'Bourdon pressure gauge',r:'Measures the pressure of the trapped air'},
    {id:'p',l:'Hand pump',r:'Raises the pressure of the oil and the air'},
    {id:'v',l:'Release valve',r:'Lowers the pressure a little at a time'},
    {id:'s',l:'Safety screen and goggles',r:'Protect you if the glass tube shatters under pressure'}
  ]});
}
/* ================= DO THE EXPERIMENT ================= */
// The student reads the Bourdon gauge and the scale at the top of the oil in the animation's measure mode (?show=measure).
// BL_P and BL_V must match MEAS_P and MEAS_V in animations/boyles-law.html.
const BL_P=[250,225,200,175,150,125,100], BL_V=[12.2,13.2,14.8,17.2,20.0,24.0,29.8];
const BL_IV=BL_V.map(v=>1/v);
let blTable=null,blPlotRows=()=>{};
{
  act('do','Your turn','Take your own readings','1. Press Pump up the pressure, then read the gauge and the volume on the scale. 2. Press Let some air out and read both again, down to 100 kPa. 3. Fill in the table, then work out 1/V for each reading.');
}
frameAct('do','animations/boyles-law.html','measure','Boyle’s law experiment: read the pressure gauge and the volume scale','Boyle’s law',false);
{
  const body=act('do','Calculate','Your results table','Write p as the gauge shows it, in kPa, and V as the scale shows it, in cm³. Give 1/V to 3 significant figures. Press Check.');
  blTable=measTable(body,{n:BL_P.length,next:'Now plot p against 1/V below.',
    hint:'The gauge has a mark every 5 kPa; the scale has a mark every 0.2 cm³. 1/V for 12.2 cm³ is 1 ÷ 12.2 = 0.0820 cm⁻³.',
    onChange:()=>blPlotRows(),
    cols:[
      {c:'p',head:'p (kPa)',val:k=>BL_P[k],tol:0,show:k=>String(BL_P[k]),lab:k=>'Pressure, reading '+(k+1)+', kilopascals'},
      {c:'v',head:'V (cm³)',val:k=>BL_V[k],tol:0.05,show:k=>BL_V[k].toFixed(1),lab:k=>'Volume, reading '+(k+1)+', cubic centimetres'},
      {c:'iv',head:'1/V (cm⁻³)',val:k=>BL_IV[k],tol:0.00011,show:k=>BL_IV[k].toPrecision(3),lab:k=>'One over V, reading '+(k+1)}
    ]});
}
{
  const body=act('do','Explain','Why plot p against 1/V?','For a fixed mass of gas, pV = NkT. Divide both sides by V:');
  body.insertAdjacentHTML('beforeend',
    '<div class="ln-steps"><span>pV</span><span>=</span><span>NkT</span>'+
    '<span>p</span><span>=</span><span>NkT × [[1|V]]</span></div>'.replace('[[1|V]]','1/V')+
    '<p class="act-intro">In the order of y = mx + c:</p>'+
    '<div class="ln-match"><span>p</span><span>=</span><span>NkT</span><span>1/V</span><span>+</span><span>0</span>'+
    '<span>y</span><span>=</span><span>m</span><span>x</span><span>+</span><span>c</span></div>'+
    '<p class="act-intro">At a fixed temperature NkT is constant, so p against 1/V is a straight line through the origin: Boyle’s law. Its gradient is pV = NkT, so with T known it gives N, the number of molecules.</p>');
}
{
  const body=act('do','Plot','Plot your results','Plot p against 1/V from your table as small crosses. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');
  const rowT=k=>{const e=blTable&&blTable.cell('iv',k);return BL_P[k]+' kPa, '+(e?'1/V = '+e+' cm⁻³':'your 1/V');};
  createPlot({host:body,next:' Now find N from the line of best fit below.',
    points:BL_IV.map((x,k)=>({x:+x.toFixed(4),y:BL_P[k]})),
    rowText:p=>rowT(BL_P.indexOf(p.y)),
    graph:{xMin:0,xMax:0.1,yMin:0,yMax:300,xTicks:[0,0.02,0.04,0.06,0.08,0.1],yTicks:[0,50,100,150,200,250,300],minor:[0.004,10],snap:[0.002,5],xLabel:'1/V (cm⁻³)',yLabel:'p (kPa)',W:560,H:340}});
  splitDo('do','Take your own readings');
  blPlotRows=()=>{$$('.plot-row',body).forEach((li,k)=>{const s=li.firstElementChild;if(s)s.textContent=rowT(k);});};
  blPlotRows();
}
{
  const body=act('do','Calculate','N from your line','A good line of best fit through your points passes through (0.030, 89.1) and (0.080, 240.4). The room, and so the air, is at 20 °C. k = 1.38 × 10⁻²³ J K⁻¹. Type a power of ten as e.g. 7.48e20.');
  createCalc({host:body,questions:[
    {q:'What is the gradient of the line?',unit:'kPa cm³',answer:3026,working:'first point = (0.030, 89.1)<br>second point = (0.080, 240.4)<br>gradient = ?||gradient = [[change in p|change in 1/V]]<br>gradient = [[240.4 − 89.1|0.080 − 0.030]]<br>gradient = [[151.3|0.050]]<br>gradient = 3026 kPa cm³'},
    {q:'Write the gradient, pV, in joules.',unit:'J',answer:3.026,working:'gradient = 3026 kPa cm³<br>1 kPa = 10³ Pa<br>1 cm³ = 10⁻⁶ m³<br>pV = ?||pV = 3026 × 10³ × 10⁻⁶<br>pV = 3.026 J'},
    {q:'How many molecules of air are trapped in the tube?',unit:'molecules',answer:7.48e20,working:'pV = 3.026 J<br>T = 20 + 273 = 293 K<br>k = 1.38 × 10⁻²³ J K⁻¹<br>N = ?||pV = NkT<br>N = [[pV|kT]]<br>N = [[3.026|1.38 × 10⁻²³ × 293]]<br>N = 7.48 × 10²⁰'}
  ]});
}
/* ================= WATCH THE EXPERIMENT ================= */
{
  act('experiment','Your turn','Watch the readings','Press Experiment, then pump to 250 kPa and release the pressure step by step, with “Wait to cool” chosen. Choose “p against 1/V”: is it a straight line through the origin? Then do it again with “Read straight away”. Which readings are off, and why? Use the gradient to find the number of molecules, N.');
}
frameAct('experiment','animations/boyles-law.html','','Boyle’s law animation: trapped air, a pressure gauge and a hand pump','Boyle’s law',false);
/* ================= ANALYSIS ================= */
const GP={xMin:0,xMax:40,yMin:0,yMax:300,xTicks:[0,10,20,30,40],yTicks:[0,50,100,150,200,250,300],xLabel:'V (cm³)',yLabel:'p (kPa)',W:560,H:340};
function lab(g0,t,x,y){return '<circle cx="'+g0.gx(x)+'" cy="'+g0.gy(y)+'" r="13" fill="var(--panel)" stroke="var(--ink)" stroke-width="2"/><text x="'+g0.gx(x)+'" y="'+(g0.gy(y)+5)+'" text-anchor="middle" font-size="14" fill="var(--ink)">'+t+'</text>';}
function iso(c,v0,v1){const p=[];for(let i=0;i<=40;i++){const v=v0+(v1-v0)*i/40;p.push([v,c/v]);}return p;}
function isoGraph(label){
  const g0=lineGraph(Object.assign({points:[[0,0]]},GP));
  return lineGraph(Object.assign({label:label,segments:[{pts:iso(2400,8,40)},{pts:iso(3600,12,40),cls:'g-line-b'}],
    extra:lab(g0,'A',37,2400/37-24)+lab(g0,'B',37,3600/40+24)},GP)).svg;
}
{
  const body=act('graphs','Calculate','Two temperatures','The graph shows p against V for the same trapped air at two temperatures. Line A is at 300 K. Read your answers off the graph.');
  const split=mk('div','graph-split');body.appendChild(split);
  split.appendChild(mk('div','graph-box',isoGraph('Pressure against volume for the same gas at two temperatures, lines A and B')));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'Line A: what is the pressure when V = 12 cm³?',unit:'kPa',answer:200,working:'Read up from 12 cm³ to line A, then across.<br>p = 200 kPa'},
    {q:'Line B: what is the volume at 150 kPa?',unit:'cm³',answer:24,working:'Read across from 150 kPa to line B, then down.<br>V = 24 cm³'},
    {q:'Line A is at 300 K. What is the temperature of line B?',unit:'K',answer:450,working:'pV = NkT, and N is the same, so pV ∝ T<br>line A: pV = 200 × 12 = 2400 kPa cm³<br>line B: pV = 150 × 24 = 3600 kPa cm³<br>[[T<sub>B</sub>|300]] = [[3600|2400]]<br>T<sub>B</sub> = [[3600|2400]] × 300<br>T<sub>B</sub> = 450 K'}
  ]});
}
/* the same data with the axes the other way round: V against 1/p */
const GV={xMin:0,xMax:10,yMin:0,yMax:40,xTicks:[0,2,4,6,8,10],yTicks:[0,10,20,30,40],xLabel:'1/p (10⁻³ kPa⁻¹)',yLabel:'V (cm³)',W:560,H:340};
function vGraph(label){
  const g0=lineGraph(Object.assign({points:[[0,0]]},GV));
  return lineGraph(Object.assign({label:label,segments:[{pts:[[0,0],[10,24]],cls:'g-line-c'},{pts:[[0,0],[10,36]],cls:'g-line-b'}],
    extra:lab(g0,'P',9.4,22.6-6)+lab(g0,'Q',9.4,33.8-6)},GV)).svg;
}
{
  const body=act('graphs','Calculate','The axes the other way round','Some exam questions plot V up the side and 1/p along the bottom. Lines P and Q are two samples of air at room temperature.');
  const split=mk('div','graph-split');body.appendChild(split);
  split.appendChild(mk('div','graph-box',vGraph('Volume against 1 over pressure for samples P and Q')));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'Line P: what is the volume at p = 200 kPa?',unit:'cm³',answer:12,working:'[[1|p]] = [[1|200]] = 0.005 kPa⁻¹ = 5 × 10⁻³ kPa⁻¹<br>Read up from 5 to line P.<br>V = 12 cm³'},
    {q:'Line Q: what is its gradient, pV?',unit:'kPa cm³',answer:3600,working:'gradient = [[change in V|change in 1/p]]<br>gradient = [[36 − 0|(10 − 0) × 10⁻³]]<br>gradient = 3600 kPa cm³'}
  ]});
}
{
  const body=act('graphs','Multiple choice','A line that misses the origin','');
  createPredict({host:body,q:'Rose’s gauge reads 0 kPa when the valve is open to the air: it shows the pressure above atmospheric. She plots her gauge readings against 1/V. Her graph is:',options:[
    {text:'A straight line cutting the p-axis at about −100 kPa',correct:true},
    {text:'A straight line through the origin',why:'Every reading is about 100 kPa (atmospheric pressure) below the true pressure, so the whole line is shifted down.'},
    {text:'A curve, because Boyle’s law no longer holds',why:'Taking the same amount off every pressure moves the line down; it does not bend it.'},
    {text:'A straight line cutting the p-axis at about +100 kPa',why:'Her readings are lower than the true pressure, so the line is shifted down, not up.'}
  ],explain:'Boyle’s law uses the total (absolute) pressure. True p = gauge reading + 100 kPa, so gauge reading = pV × [[1|V]] − 100: a straight line with intercept −100 kPa. Add atmospheric pressure to each reading first.'});
}
{
  const body=act('graphs','Multiple choice','Why kelvin?','');
  createPredict({host:body,q:'In pV = NkT, why must the temperature be in kelvin, not °C?',options:[
    {text:'pV ∝ T only when T is measured from absolute zero',correct:true},
    {text:'Kelvin numbers are bigger, so the answer is more precise',why:'Precision is not the reason. The equation only works when T starts from absolute zero.'},
    {text:'Gases cannot be measured in degrees Celsius',why:'You can measure a gas’s temperature in °C; you must convert it to kelvin before using pV = NkT.'},
    {text:'The pressure gauge is marked in kelvin',why:'The gauge is marked in kPa. The kelvin is needed because of how pV depends on T.'}
  ],explain:'The average kinetic energy of the molecules, and so pV, is proportional to the absolute temperature. At absolute zero (0 K) pV would be zero; at 0 °C (273 K) it is not.'});
}
/* ================= CALCULATE ================= */
{
  const body=act('calculate','Calculate','Boyle’s law and pV = NkT','The temperature stays the same in each question. k = 1.38 × 10⁻²³ J K⁻¹. Type a power of ten as e, so 7.4 × 10²⁰ is 7.4e20.');
  createCalc({host:body,questions:[
    {q:'Air at 120 kPa has a volume of 25.0 cm³. It is squashed to 15.0 cm³. What is its new pressure?',unit:'kPa',answer:200,working:'p<sub>1</sub>V<sub>1</sub> = p<sub>2</sub>V<sub>2</sub><br>120 × 25.0 = p<sub>2</sub> × 15.0<br>3000 = p<sub>2</sub> × 15.0<br>p<sub>2</sub> = [[3000|15.0]]<br>p<sub>2</sub> = 200 kPa'},
    {q:'Air at 180 kPa has a volume of 20.0 cm³. The pressure is let down to 100 kPa. What is its new volume?',unit:'cm³',answer:36,working:'p<sub>1</sub>V<sub>1</sub> = p<sub>2</sub>V<sub>2</sub><br>180 × 20.0 = 100 × V<sub>2</sub><br>3600 = 100 × V<sub>2</sub><br>V<sub>2</sub> = [[3600|100]]<br>V<sub>2</sub> = 36.0 cm³'},
    {q:'Trapped air at 1.00 × 10⁵ Pa has a volume of 30.0 cm³ at 293 K. How many molecules are there?',unit:'molecules',answer:7.42e20,working:'30.0 cm³ = 3.00 × 10⁻⁵ m³<br>pV = NkT<br>(1.00 × 10⁵) × (3.00 × 10⁻⁵) = N × 1.38 × 10⁻²³ × 293<br>3.00 = N × 4.043 × 10⁻²¹<br>N = [[3.00|4.043 × 10⁻²¹]]<br>N = 7.42 × 10²⁰'},
    {q:'9.00 × 10²⁰ molecules of a gas are at 1.20 × 10⁵ Pa in a volume of 3.00 × 10⁻⁵ m³. What is their temperature?',unit:'K',answer:290,working:'pV = NkT<br>(1.20 × 10⁵) × (3.00 × 10⁻⁵) = 9.00 × 10²⁰ × 1.38 × 10⁻²³ × T<br>3.60 = 1.242 × 10⁻² × T<br>T = [[3.60|1.242 × 10⁻²]]<br>T = 290 K'}
  ]});
}
/* ================= ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Better results or safer?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'Better results',hint:'More accurate or more useful readings',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps people safe',hint:'Protects people and equipment',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Wait for the air to return to room temperature before each reading',cat:'a'},
    {id:'2',text:'Read the scale with your eye level with the top of the oil',cat:'a'},
    {id:'3',text:'Open the valve slowly, a little at a time',cat:'a'},
    {id:'4',text:'Take readings over the whole safe range of pressures',cat:'a'},
    {id:'5',text:'Wear goggles in case the glass tube shatters',cat:'s'},
    {id:'6',text:'Put a safety screen between you and the tube',cat:'s'},
    {id:'7',text:'Never pump above the maximum safe pressure',cat:'s'},
    {id:'8',text:'Wipe up any spilled oil so nobody slips',cat:'s'}
  ]});
}
{
  const body=act('accuracy','Multiple choice','Reading straight away','');
  createPredict({host:body,q:'Ollie pumps up to 250 kPa and reads the volume at once. Compared with the volume at room temperature, his reading is:',options:[
    {text:'Too big: the squashed air is still warm',correct:true},
    {text:'Too small: the squashed air is still warm',why:'At the same pressure a warmer gas takes up more room (pV = NkT), so the volume is too big.'},
    {text:'The same: Boyle’s law says pV is constant',why:'Boyle’s law only holds at a fixed temperature, and the air is warmer than the room.'},
    {text:'Too small: some air escaped while pumping',why:'Nothing has leaked out here. The difference comes from the temperature of the air.'}
  ],explain:'Compressing the air quickly warms it. From pV = NkT, at the same p a higher T gives a larger V, so his first reading is a little too big until the air cools.'});
}
{
  const body=act('accuracy','Multiple choice','Percentage uncertainty','');
  createPredict({host:body,q:'Ollie can read the volume to ±0.5 cm³. His volumes go from 12 cm³ at 250 kPa to 30 cm³ at 100 kPa. Where is the percentage uncertainty in V largest?',options:[
    {text:'At 250 kPa, where V is smallest',correct:true},
    {text:'At 100 kPa, where the volume is largest',why:'The same ±0.5 cm³ is a smaller fraction of a larger volume: 1.7% of 30 cm³.'},
    {text:'It is the same for every reading',why:'The uncertainty in cm³ is the same, but as a percentage it depends on the size of the volume.'},
    {text:'At 175 kPa, in the middle of the range',why:'The percentage uncertainty is largest where V is smallest, which is at the highest pressure.'}
  ],explain:'percentage uncertainty = [[0.5|12]] × 100% = 4.2% at 250 kPa, but [[0.5|30]] × 100% = 1.7% at 100 kPa. The smallest volumes have the largest percentage uncertainty.'});
}
/* ================= EXAM PRACTICE ================= */
{
  const body=act('exam','Exam style','Testing Boyle’s law','Asma traps some air above oil and records these results at room temperature, 20 °C. One reading is missing.');
  const tbl=mk('div','table-scroll');
  tbl.innerHTML='<table class="units res-tbl"><thead><tr><th>p (kPa)</th><th>240</th><th>200</th><th>160</th><th>120</th><th>100</th></tr></thead><tbody><tr><th>V (cm³)</th><td>10.0</td><td>12.0</td><td><b>?</b></td><td>20.0</td><td>24.0</td></tr></tbody></table>';
  body.appendChild(tbl);
  body.appendChild(mk('p','sub','(a) 2 marks'));
  createCalc({host:body,questions:[
    {q:'Asma forgot to write down the volume at 160 kPa. Predict the missing result.',unit:'cm³',answer:15,working:'pV = 240 × 10.0 = 2400 kPa cm³ for the other readings<br>160 × V = 2400<br>V = [[2400|160]]<br>V = 15.0 cm³'}
  ]});
  body.appendChild(mk('p','sub','(b) 3 marks'));
  body.appendChild(mk('p','','Show that Asma’s results support Boyle’s law. Write your answer, then check it.'));
  const d1=mk('details','');
  d1.innerHTML='<summary>Check your answer</summary><div><ul><li>Work out pV for each reading: 240 × 10.0, 200 × 12.0, 120 × 20.0 and 100 × 24.0.</li><li>Each gives pV = 2400 kPa cm³.</li><li>pV is constant, so p is inversely proportional to V for this fixed mass of gas at a fixed temperature: Boyle’s law.</li></ul><p class="sub">Or: plot p against 1/V and show it is a straight line through the origin.</p></div>';
  body.appendChild(d1);
  body.appendChild(mk('p','sub','(c) 3 marks'));
  createCalc({host:body,questions:[
    {q:'Calculate the number of air molecules trapped in the tube. k = 1.38 × 10⁻²³ J K⁻¹. Type 6.0 × 10²⁰ as 6.0e20.',unit:'molecules',answer:5.94e20,working:'T = 20 + 273 = 293 K<br>pV = 2400 kPa cm³ = 2400 × 10³ × 10⁻⁶ = 2.40 J<br>pV = NkT<br>2.40 = N × 1.38 × 10⁻²³ × 293<br>2.40 = N × 4.043 × 10⁻²¹<br>N = [[2.40|4.043 × 10⁻²¹]]<br>N = 5.94 × 10²⁰'}
  ]});
  body.appendChild(mk('p','sub','(d) 2 marks'));
  body.appendChild(mk('p','','After each change of pressure, Asma waits before reading the volume. Explain why.'));
  const d2=mk('details','');
  d2.innerHTML='<summary>Check your answer</summary><div><ul><li>Changing the pressure quickly changes the temperature of the air: it warms when compressed and cools when it expands.</li><li>Boyle’s law needs a constant temperature, so she waits for the air to return to room temperature before reading the volume.</li></ul></div>';
  body.appendChild(d2);
  body.appendChild(mk('p','sub','(e) 6 marks'));
  body.appendChild(mk('p','','Describe how Asma could use this apparatus to obtain results that show Boyle’s law. Include how to make her results accurate, how to use them, and one safety precaution.'));
  const d3=mk('details','');
  d3.innerHTML='<summary>Check your answer</summary><div><ul><li>Trap a fixed mass of air above the oil in a sealed tube; check the joints so none can escape.</li><li>Use the pump to raise the pressure to the maximum safe value; read the pressure on the gauge.</li><li>Read the volume of the air on the scale, with her eye level with the top of the oil (no parallax).</li><li>Release the pressure in small steps (e.g. 25 kPa) with the valve, reading p and V each time, down to atmospheric pressure.</li><li>Wait after each change so the air is back at room temperature (constant temperature).</li><li>Plot p against 1/V: a straight line through the origin shows p ∝ 1/V (or show pV is constant).</li><li>Safety: wear goggles and use a safety screen in case the tube shatters; do not exceed the safe pressure.</li></ul><p class="sub">“Be careful” scores nothing: say what protects you from what.</p></div>';
  body.appendChild(d3);
  body.appendChild(mk('p','sub','(f) 2 marks'));
  body.appendChild(mk('p','','Asma repeats the experiment with the tube in a water bath at 60 °C. Describe how her graph of p against V would change.'));
  const d4=mk('details','');
  d4.innerHTML=FR('<summary>Check your answer</summary><div><ul><li>It is still a curve with the same shape (p ∝ 1/V), but further from the axes.</li><li>pV = NkT and N is the same, so pV is larger, by [[333|293]]: about 14% bigger at every point.</li></ul></div>');
  body.appendChild(d4);
}
