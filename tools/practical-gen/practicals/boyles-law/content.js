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

/* ================= EXPERIMENT ================= */
{
  act('experiment','Your turn','Take your own readings','Press Experiment, then pump to 250 kPa and release the pressure step by step, with “Wait to cool” chosen. Choose “p against 1/V”: is it a straight line through the origin? Then do it again with “Read straight away”. Which readings are off, and why? Use the gradient to find the number of molecules, N.');
}
frameAct('experiment','animations/boyles-law.html','','Boyle’s law animation: trapped air, a pressure gauge and a hand pump','Boyle’s law',false);

/* ================= 3. VARIABLES ================= */
{
  const body=act('variables','Sort','Which kind of variable is it?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'i',label:'Independent',hint:'You change it',color:'--c1',soft:'--c1-soft'},
    {id:'d',label:'Dependent',hint:'You measure it',color:'--c2',soft:'--c2-soft'},
    {id:'c',label:'Control',hint:'You keep it the same',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'The pressure of the trapped air',cat:'i'},
    {id:'2',text:'The reading you set on the pressure gauge',cat:'i'},
    {id:'3',text:'The volume of the trapped air',cat:'d'},
    {id:'4',text:'Where the top of the oil is on the scale',cat:'d'},
    {id:'5',text:'The mass of air trapped in the tube',cat:'c'},
    {id:'6',text:'The temperature of the trapped air',cat:'c'},
    {id:'7',text:'The type of gas in the tube',cat:'c'}
  ]});
}
{
  const body=act('variables','Predict','Why wait?','');
  createPredict({host:body,q:'After pumping, Asma waits a minute before she reads the volume. Why?',options:[
    {text:'Squashing the air warmed it, so it must cool first',correct:true},
    {text:'The pressure gauge needs time to warm up before it reads',why:'A Bourdon gauge reads straight away. It is the air’s temperature that has to settle.'},
    {text:'Some air has to leak out until the pressure is steady',why:'No air should leak: Boyle’s law needs a fixed mass of gas, so a leak would spoil the results.'},
    {text:'Waiting makes the volume bigger, which is easier to read',why:'As the warm air cools its volume gets slightly smaller, not bigger. The point is to read it at room temperature.'}
  ],explain:'Compressing a gas quickly does work on it and warms it. A warmer gas at the same pressure takes up more volume, so Asma waits until the air is back at room temperature: Boyle’s law needs a fixed temperature.'});
}
{
  const body=act('variables','Predict','A new question to test','');
  createPredict({host:body,q:'Ollie now wants to find how the volume of the trapped air depends on its temperature, at a fixed pressure. What is his independent variable?',options:[
    {text:'The temperature of the trapped air',correct:true},
    {text:'The pressure of the trapped air',why:'This time he keeps the pressure the same, so it is a control variable.'},
    {text:'The volume of the trapped air',why:'The volume is what he measures, so it is the dependent variable.'},
    {text:'The mass of air trapped in the tube',why:'The mass must stay the same, so it is a control variable.'}
  ],explain:'The independent variable is the one he changes on purpose: the temperature. He keeps the pressure and the mass of air the same, and measures the volume.'});
}

/* ================= EXPERIMENT (continued) ================= */
{
  const body=act('experiment','Predict','Reading straight away','');
  createPredict({host:body,q:'Ollie pumps up to 250 kPa and reads the volume at once. Compared with the volume at room temperature, his reading is:',options:[
    {text:'Too big: the squashed air is still warm',correct:true},
    {text:'Too small: the squashed air is still warm',why:'At the same pressure a warmer gas takes up more room (pV = NkT), so the volume is too big.'},
    {text:'The same: Boyle’s law says pV is constant',why:'Boyle’s law only holds at a fixed temperature, and the air is warmer than the room.'},
    {text:'Too small: some air escaped while pumping',why:'Nothing has leaked out here. The difference comes from the temperature of the air.'}
  ],explain:'Compressing the air quickly warms it. From pV = NkT, at the same p a higher T gives a larger V, so his first reading is a little too big until the air cools.'});
}
{
  const body=act('experiment','Predict','Letting the pressure out quickly','');
  createPredict({host:body,q:'Rose opens the valve fully, so the pressure drops quickly from 225 kPa to 200 kPa, and reads at once. Her volume reading is:',options:[
    {text:'A little too small: the air cooled as it expanded',correct:true},
    {text:'A little too big: the air warmed as it expanded',why:'A gas that expands quickly does work and cools, not warms.'},
    {text:'Exactly right, because the pressure went down',why:'The pressure is right, but the air is cooler than the room for a short time, so V is not yet at its room-temperature value.'},
    {text:'Much too big: the oil rushes back into the reservoir',why:'The oil level only follows the air. The small error comes from the air being cooler than the room.'}
  ],explain:'A gas that expands quickly cools a little. A cooler gas at the same pressure takes up less room, so the reading is slightly too small. Release the pressure slowly and wait before reading.'});
}

/* ================= GRAPHS ================= */
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
{
  const body=act('graphs','Predict','Which line is hotter?','');
  createPredict({host:body,q:'Look at the graph above. How can you tell that line B is at the higher temperature?',options:[
    {text:'pV is larger at every point on line B',correct:true},
    {text:'Line B is the steeper curve near the axes',why:'Line B is further from the axes, not steeper. Compare pV at any point instead.'},
    {text:'Line B starts at a higher pressure',why:'Both curves carry on up the p-axis as V falls. Where they start on this graph depends only on where they were drawn from.'},
    {text:'Line B reaches a smaller volume',why:'At any pressure line B has the larger volume, not the smaller one.'}
  ],explain:'From pV = NkT, with the same N, pV ∝ T. Every point on line B has pV = 3600 kPa cm³, and line A 2400 kPa cm³, so B is hotter. A hotter isotherm lies further from the axes.'});
}
{
  const body=act('graphs','Predict','Why kelvin?','');
  createPredict({host:body,q:'In pV = NkT, why must the temperature be in kelvin, not °C?',options:[
    {text:'pV ∝ T only when T is measured from absolute zero',correct:true},
    {text:'Kelvin numbers are bigger, so the answer is more precise',why:'Precision is not the reason. The equation only works when T starts from absolute zero.'},
    {text:'Gases cannot be measured in degrees Celsius',why:'You can measure a gas’s temperature in °C; you must convert it to kelvin before using pV = NkT.'},
    {text:'The pressure gauge is marked in kelvin',why:'The gauge is marked in kPa. The kelvin is needed because of how pV depends on T.'}
  ],explain:'The average kinetic energy of the molecules, and so pV, is proportional to the absolute temperature. At absolute zero (0 K) pV would be zero; at 0 °C (273 K) it is not.'});
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
  const body=act('graphs','Predict','A steeper line','');
  createPredict({host:body,q:'On this graph (V against 1/p), what does Q’s steeper line tell you?',options:[
    {text:'Q has more molecules: pV = NkT is bigger',correct:true},
    {text:'Q is at a lower temperature than P',why:'Both are at room temperature. A larger gradient means a larger pV, so more gas, not a lower temperature.'},
    {text:'Q does not obey Boyle’s law',why:'Q is a straight line through the origin, so V ∝ 1/p: it obeys Boyle’s law.'},
    {text:'Q is at a lower pressure for every volume',why:'Read across at any volume: Q has the smaller 1/p, so the higher pressure. That is because it holds more gas.'}
  ],explain:'The gradient of V against 1/p is pV, which equals NkT. At the same temperature, a steeper line means more molecules (a larger mass of gas). With p up the side and 1/V along the bottom the gradient is also pV.'});
}

/* ================= 4. RESULTS ================= */
{
  const body=act('results','Calculate','Complete the results table','Asma’s readings are below. Work out the missing values.');
  const tbl=mk('div','table-scroll');
  tbl.innerHTML='<table class="units res-tbl"><thead><tr><th>p (kPa)</th><th>V (cm³)</th><th>1/V (cm⁻³)</th><th>pV (kPa cm³)</th></tr></thead><tbody>'+
    [[250,'9.6','0.1042','2400'],[200,'12.0','?','2400'],[150,'16.0','0.0625','?'],[125,'19.2','?','2400'],[100,'24.0','0.0417','?']].map(r=>'<tr><td>'+r.join('</td><td>')+'</td></tr>').join('')+'</tbody></table>';
  body.appendChild(tbl);
  createCalc({host:body,questions:[
    {q:'1/V at 200 kPa',unit:'cm⁻³',answer:0.0833,working:'[[1|V]] = [[1|12.0]]<br>[[1|V]] = 0.0833 cm⁻³'},
    {q:'1/V at 125 kPa',unit:'cm⁻³',answer:0.0521,working:'[[1|V]] = [[1|19.2]]<br>[[1|V]] = 0.0521 cm⁻³'},
    {q:'pV at 150 kPa',unit:'kPa cm³',answer:2400,working:'pV = 150 × 16.0<br>pV = 2400 kPa cm³'},
    {q:'pV at 100 kPa',unit:'kPa cm³',answer:2400,working:'pV = 100 × 24.0<br>pV = 2400 kPa cm³'}
  ]});
}
{
  const body=act('results','Plot','Plot Asma’s results','Plot p against 1/V as small crosses. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');
  createPlot({host:body,
    points:[{x:0.1042,y:250},{x:0.0833,y:200},{x:0.0625,y:150},{x:0.0521,y:125},{x:0.0417,y:100}],
    rowText:p=>p.y+' kPa, 1/V = '+fmt(p.x,4)+' cm⁻³',
    graph:{xMin:0,xMax:0.12,yMin:0,yMax:300,xTicks:[0,0.02,0.04,0.06,0.08,0.1,0.12],yTicks:[0,50,100,150,200,250,300],minor:[0.004,10],snap:[0.002,5],xLabel:'1/V (cm⁻³)',yLabel:'p (kPa)',W:560,H:340}});
}
{
  const body=act('results','Predict','The line of best fit','');
  createPredict({host:body,q:'What line of best fit should Asma draw through her points on p against 1/V?',options:[
    {text:'One straight line, close to all of the points',correct:true},
    {text:'Short straight lines joining each point to the next',why:'Joining the dots follows every small error. A line of best fit shows the trend, so it is one line.'},
    {text:'A smooth curve that bends to pass through every point',why:'p against 1/V should be a straight line for Boyle’s law; a curve hides that.'},
    {text:'A straight line from the first point to the last one',why:'That uses only two of the readings. A best-fit line balances all of them.'}
  ],explain:'Draw one thin straight line with the points scattered evenly either side of it. For Boyle’s law it should pass through (or very close to) the origin; check this once it is drawn.'});
}
{
  const body=act('results','Predict','The gradient','');
  createPredict({host:body,q:'What does the gradient of Asma’s p against 1/V graph equal?',options:[
    {text:'pV, which equals NkT',correct:true},
    {text:'[[p|V]], the pressure per unit volume',why:'gradient = [[change in p|change in 1/V]], which is p × V, not p divided by V.'},
    {text:'The temperature of the air',why:'The gradient is pV = NkT. It depends on T, but it also depends on N and k.'},
    {text:'The Boltzmann constant, k',why:'k is a fixed constant. The gradient is NkT, so it depends on how much gas there is and its temperature.'}
  ],explain:'p = pV × [[1|V]] has the form y = mx, so the gradient is pV. From pV = NkT, gradient = NkT: with T known you can find N.'});
}
{
  const body=act('results','Predict','An anomalous result','');
  createPredict({host:body,q:'Ollie’s results are below. Which result is anomalous, and what should he do?',
    pre:'<div class="table-scroll"><table class="units res-tbl"><thead><tr><th>p (kPa)</th><th>250</th><th>200</th><th>150</th><th>125</th><th>100</th></tr></thead><tbody><tr><th>V (cm³)</th><td>12.0</td><td>15.0</td><td>21.8</td><td>24.0</td><td>30.0</td></tr></tbody></table></div>',
    options:[
    {text:'150 kPa: repeat that reading, and leave it out of the line',correct:true},
    {text:'100 kPa: it has the biggest volume, so leave it out',why:'100 × 30.0 = 3000, the same pV as the others. Being the biggest does not make it anomalous.'},
    {text:'150 kPa: keep it, and average it in with the other results',why:'Averaging an anomalous result in drags the answer away from the true value. Repeat it, and leave it out of the line.'},
    {text:'None: every reading counts, so use them all',why:'One reading breaks the pattern: 150 × 21.8 = 3270, while the others give 3000 kPa cm³.'}
  ],explain:'pV should be about 3000 kPa cm³ every time, so at 150 kPa V should be about 20.0 cm³. Repeat that reading if you can, and leave it out when drawing the line of best fit.'});
}
{
  const body=act('results','Predict','A line that misses the origin','');
  createPredict({host:body,q:'Rose’s gauge reads 0 kPa when the valve is open to the air: it shows the pressure above atmospheric. She plots her gauge readings against 1/V. Her graph is:',options:[
    {text:'A straight line cutting the p-axis at about −100 kPa',correct:true},
    {text:'A straight line through the origin',why:'Every reading is about 100 kPa (atmospheric pressure) below the true pressure, so the whole line is shifted down.'},
    {text:'A curve, because Boyle’s law no longer holds',why:'Taking the same amount off every pressure moves the line down; it does not bend it.'},
    {text:'A straight line cutting the p-axis at about +100 kPa',why:'Her readings are lower than the true pressure, so the line is shifted down, not up.'}
  ],explain:'Boyle’s law uses the total (absolute) pressure. True p = gauge reading + 100 kPa, so gauge reading = pV × [[1|V]] − 100: a straight line with intercept −100 kPa. Add atmospheric pressure to each reading first.'});
}

/* ================= 5. CALCULATE ================= */
{
  const body=act('calculate','Calculate','Boyle’s law and pV = NkT','The temperature stays the same in each question. k = 1.38 × 10⁻²³ J K⁻¹. Type a power of ten as e, so 7.4 × 10²⁰ is 7.4e20.');
  createCalc({host:body,questions:[
    {q:'Air at 120 kPa has a volume of 25.0 cm³. It is squashed to 15.0 cm³. What is its new pressure?',unit:'kPa',answer:200,working:'p<sub>1</sub>V<sub>1</sub> = p<sub>2</sub>V<sub>2</sub><br>120 × 25.0 = p<sub>2</sub> × 15.0<br>3000 = p<sub>2</sub> × 15.0<br>p<sub>2</sub> = [[3000|15.0]]<br>p<sub>2</sub> = 200 kPa'},
    {q:'Air at 180 kPa has a volume of 20.0 cm³. The pressure is let down to 100 kPa. What is its new volume?',unit:'cm³',answer:36,working:'p<sub>1</sub>V<sub>1</sub> = p<sub>2</sub>V<sub>2</sub><br>180 × 20.0 = 100 × V<sub>2</sub><br>3600 = 100 × V<sub>2</sub><br>V<sub>2</sub> = [[3600|100]]<br>V<sub>2</sub> = 36.0 cm³'},
    {q:'Trapped air at 1.00 × 10⁵ Pa has a volume of 30.0 cm³ at 293 K. How many molecules are there?',unit:'molecules',answer:7.42e20,working:'30.0 cm³ = 3.00 × 10⁻⁵ m³<br>pV = NkT<br>(1.00 × 10⁵) × (3.00 × 10⁻⁵) = N × 1.38 × 10⁻²³ × 293<br>3.00 = N × 4.043 × 10⁻²¹<br>N = [[3.00|4.043 × 10⁻²¹]]<br>N = 7.42 × 10²⁰'},
    {q:'9.00 × 10²⁰ molecules of a gas are at 1.20 × 10⁵ Pa in a volume of 3.00 × 10⁻⁵ m³. What is their temperature?',unit:'K',answer:290,working:'pV = NkT<br>(1.20 × 10⁵) × (3.00 × 10⁻⁵) = 9.00 × 10²⁰ × 1.38 × 10⁻²³ × T<br>3.60 = 1.242 × 10⁻² × T<br>T = [[3.60|1.242 × 10⁻²]]<br>T = 290 K'}
  ]});
}

/* ================= 6. ACCURACY AND SAFETY ================= */
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
  const body=act('accuracy','Predict','Eye level','');
  createPredict({host:body,q:'Why should you read the scale with your eye level with the top of the oil?',options:[
    {text:'At an angle, the oil lines up with the wrong mark',correct:true},
    {text:'It keeps your face safely behind the safety screen',why:'The screen protects you whatever height your eye is. Eye level is about reading the scale correctly.'},
    {text:'It stops the oil moving while you read it',why:'Where you look from cannot move the oil. It only changes the mark the oil seems to be at.'},
    {text:'The scale is only accurate near its middle',why:'The scale is equally accurate along its length. The problem is the angle you look from.'}
  ],explain:'Looking at an angle makes the top of the oil appear against the wrong mark: a parallax error. Read the scale perpendicularly, with your eye level with the top of the oil.'});
}
{
  const body=act('accuracy','Predict','Percentage uncertainty','');
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
