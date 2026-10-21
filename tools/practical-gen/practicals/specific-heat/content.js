/* ================= 1. OVERVIEW ================= */
{
  const body=act('overview','Fill in the blanks','The practical in one passage','Drag a word into each gap, or tap a word and then tap a gap. Some words are not needed.');
  const parts=[
    'Measure the mass of an aluminium block with a ',['b1','balance'],'. Put an immersion heater and a thermometer into the holes in the block, and wrap it in ',['b2','lagging'],
    '. A ',['b3','joulemeter'],' measures the energy supplied by the heater. Record the starting temperature, switch on for 10 minutes, then keep reading the thermometer to find the ',['b4','highest'],
    ' temperature. The specific heat capacity, c, is the energy needed to raise the temperature of ',['b5','1 kg'],' of a substance by ',['b6','1 °C'],'. Work it out from ΔQ = m × c × ',['b7','ΔT'],
    ', in ',['b8','J/kg °C'],'. Water has a much ',['b9','higher'],' specific heat capacity than metals. Most results come out too high, because some of the energy heats the ',['b10','surroundings'],'.'
  ];
  const cloze=mk('div','cloze'),slots=[],chips=[];
  parts.forEach(p=>{
    if(typeof p==='string')cloze.appendChild(document.createTextNode(p));
    else{const s=mk('span','blank');cloze.appendChild(s);slots.push({id:p[0],el:s,answer:p[1]});chips.push({id:'c-'+p[0],text:p[1]});}
  });
  ['1 g','lower','stopwatch','N/kg'].forEach((t,i)=>chips.push({id:'d'+i,text:t}));
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
  const body=act('method','Order','Carry out the practical','Put the steps in the order you would do them. Drag the ≡ handle, or use the ▲▼ buttons.');
  createReorder({host:body,steps:[
    {id:'a',text:'Measure the mass of the aluminium block on a balance.'},
    {id:'b',text:'Put the heater in one hole and the thermometer in the other, with a few drops of water round the bulb.'},
    {id:'c',text:'Wrap the block in lagging.'},
    {id:'d',text:'Read the starting temperature of the block.'},
    {id:'e',text:'Connect the heater to the joulemeter and the power supply. Switch on and start the stopwatch.'},
    {id:'f',text:'After 10 minutes, switch off the heater and read the joulemeter.'},
    {id:'g',text:'Keep reading the thermometer until the temperature stops rising. Record the highest reading.'},
    {id:'h',text:'Work out ΔT, then use ΔQ = m × c × ΔT to find c.'}
  ],constraints:[['a','h'],['b','d'],['c','e'],['d','e'],['e','f'],['f','g'],['g','h']],
  why:'The starting temperature is read before the heater goes on, and the highest temperature comes after it is switched off, because the hot heater keeps passing energy to the block for a while.'});
}
{
  const body=act('method','Match','What each piece of equipment is for','Pair each piece of equipment with its job. Drag one card onto the other, or tap one card and then the other.');
  createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'b',l:'Balance',r:'Measures the mass of the block'},
    {id:'j',l:'Joulemeter',r:'Measures the energy supplied by the heater'},
    {id:'h',l:'Immersion heater',r:'Transfers energy to the block'},
    {id:'t',l:'Thermometer',r:'Measures the temperature of the block'},
    {id:'l',l:'Lagging',r:'Cuts the energy lost to the surroundings'},
    {id:'w',l:'Drops of water in the hole',r:'Give good thermal contact with the thermometer bulb'}
  ]});
}

/* ================= 3. VARIABLES ================= */
{
  const body=act('variables','Sort','Which kind of variable is it?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'i',label:'Independent',hint:'You change it',color:'--c1',soft:'--c1-soft'},
    {id:'d',label:'Dependent',hint:'You measure it',color:'--c2',soft:'--c2-soft'},
    {id:'c',label:'Control',hint:'You keep it the same',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'The energy supplied by the heater',cat:'i'},
    {id:'2',text:'The time the heater is switched on',cat:'i'},
    {id:'3',text:'The temperature of the block',cat:'d'},
    {id:'4',text:'The rise in temperature of the block',cat:'d'},
    {id:'5',text:'The mass of the block',cat:'c'},
    {id:'6',text:'The power of the heater',cat:'c'},
    {id:'7',text:'The lagging round the block',cat:'c'}
  ]});
}
{
  const body=act('variables','Predict','A new question to test','');
  createPredict({host:body,q:'Ali wants to find out whether thicker lagging gives a value of c closer to the accepted value. What is his independent variable?',options:[
    {text:'The thickness of the lagging',correct:true},
    {text:'The energy the heater supplies',why:'He should supply the same energy each time, so it is a control variable.'},
    {text:'The value of c he calculates',why:'That is what he works out from each test, so it is the dependent variable.'},
    {text:'The mass of the aluminium block',why:'He should use the same block every time, so its mass is a control variable.'}
  ],explain:'The independent variable is the one he changes on purpose: the thickness of the lagging. He keeps the block and the energy the same, and compares the values of c.'});
}
{
  const body=act('variables','Predict','Water in the thermometer hole','');
  createPredict({host:body,q:'Why does Zahra put a few drops of water in the hole before she puts the thermometer in?',options:[
    {text:'Water conducts better than air, so the bulb reads the block',correct:true},
    {text:'It cools the thermometer so that the glass does not crack',why:'The block only gets to about 50 °C, far below anything that would harm the thermometer.'},
    {text:'It stops the block from losing energy to the air outside',why:'A few drops in the hole cannot insulate the block. That is the job of the lagging.'},
    {text:'It adds mass, so the temperature rises more slowly',why:'A few drops add almost no mass. They are there so the bulb is in good contact with the block.'}
  ],explain:'Air is a poor conductor. With air round the bulb, the thermometer lags behind the block’s temperature. A little water fills the gap, so the thermometer reads the temperature of the block.'});
}

/* ================= 4. EXPERIMENT ================= */
{
  act('experiment','Your turn','Take your own readings','Press Experiment. Heat the aluminium block, lagged, with a reading every minute. Then do it again with no lagging, and try water and copper. For each one, how close is your value of c to the accepted value, and why is it usually too high?');
}
frameAct('experiment','animations/specific-heat.html','','Specific heat capacity animation: heating a block with an immersion heater','specific heat capacity',false);
{
  const body=act('experiment','Predict','What c means','');
  createPredict({host:body,q:'The specific heat capacity of aluminium is 900 J/kg °C. What does this mean?',options:[
    {text:'900 J raises the temperature of 1 kg of it by 1 °C',correct:true},
    {text:'900 J raises the temperature of 1 g of it by 1 °C',why:'Specific heat capacity is for each kilogram, which is why the unit is J/kg °C. One gram would need only 0.9 J.'},
    {text:'900 J is the energy needed to melt 1 kg of it',why:'Melting is a change of state at a fixed temperature. Specific heat capacity is about raising the temperature.'},
    {text:'It can be heated to 900 °C before it starts to melt',why:'The number is an amount of energy, in joules, not a temperature.'}
  ],explain:'Specific heat capacity is the energy needed to raise the temperature of 1 kg of a substance by 1 °C. For aluminium that is 900 J.'});
}
{
  const body=act('experiment','Predict','Water or copper?','');
  createPredict({host:body,q:'Sophie gives 1 kg of water and 1 kg of copper the same amount of energy. Which has the bigger rise in temperature?',options:[
    {text:'Copper: it needs less energy for each 1 °C',correct:true},
    {text:'Water: it is a liquid, so it warms up faster',why:'Being a liquid does not make it warm faster. Water needs 4200 J for each kilogram and each 1 °C, far more than copper.'},
    {text:'Neither: with the same mass, the rise is the same',why:'The same mass and energy give the same rise only if c is the same. Copper’s c (390 J/kg °C) is much lower than water’s.'},
    {text:'Water: it has the bigger specific heat capacity',why:'A bigger specific heat capacity means more energy for each 1 °C, so a smaller rise for the same energy.'}
  ],explain:'ΔT = [[ΔQ|m × c]]. With the same energy and mass, the material with the smaller c has the bigger rise. Copper’s rise is about 11 times water’s.'});
}

/* ================= 5. RESULTS ================= */
const SH=[[0,0,20.0],[2,5760,24.5],[4,11520,30.5],[6,17280,36.5],[8,23040,42.5],[10,28800,48.0],[12,28800,49.0]];
function shTable(){
  const t=mk('div','table-scroll');
  t.innerHTML='<table class="units res-tbl"><thead><tr><th>Time (min)</th>'+SH.map(r=>'<th>'+r[0]+'</th>').join('')+'</tr></thead><tbody><tr><th>Joulemeter (J)</th>'+SH.map(r=>'<td>'+fmt(r[1])+'</td>').join('')+'</tr><tr><th>Temperature (°C)</th>'+SH.map(r=>'<td>'+r[2].toFixed(1)+'</td>').join('')+'</tr></tbody></table>';
  return t;
}
{
  const body=act('results','Calculate','Work out c from Sophie’s results','Sophie’s aluminium block has a mass of 1.00 kg. She switched the heater off at 10 minutes and kept reading the thermometer.');
  body.appendChild(shTable());
  createCalc({host:body,questions:[
    {q:'What is the rise in temperature, from the start to the highest reading?',unit:'°C',answer:29,working:'ΔT = highest temperature − starting temperature<br>ΔT = 49.0 − 20.0<br>ΔT = 29.0 °C'},
    {q:'How much energy did the heater supply each minute?',unit:'J',answer:2880,working:'energy each minute = [[28 800|10]]<br>energy each minute = 2880 J'},
    {q:'Use ΔQ = 28 800 J and your ΔT to find the specific heat capacity of aluminium.',unit:'J/kg °C',answer:993,working:'ΔQ = m × c × ΔT<br>28 800 = 1.00 × c × 29.0<br>28 800 = 29.0 × c<br>c = [[28 800|29.0]]<br>c = 993 J/kg °C'},
    {q:'Now use only the readings from 2 to 8 minutes, while the temperature rises steadily. What value of c does this give?',unit:'J/kg °C',answer:960,working:'ΔQ = 23 040 − 5760<br>ΔQ = 17 280 J<br>ΔT = 42.5 − 24.5<br>ΔT = 18.0 °C<br>17 280 = 1.00 × c × 18.0<br>c = [[17 280|18.0]]<br>c = 960 J/kg °C'}
  ]});
}
{
  const body=act('results','Plot','Plot Sophie’s results','Plot temperature against time for each reading in Sophie’s table, as a small cross. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');
  createPlot({host:body,
    points:SH.map(r=>({x:r[0],y:r[2]})),
    rowText:p=>p.x+' min, '+p.y.toFixed(1)+' °C',
    graph:{xMin:0,xMax:12,yMin:20,yMax:50,xTicks:[0,2,4,6,8,10,12],yTicks:[20,25,30,35,40,45,50],minor:[1,1],snap:[1,0.5],xLabel:'time (min)',yLabel:'temperature (°C)',W:560,H:340}});
}
{
  const body=act('results','Predict','A slow start','');
  createPredict({host:body,q:'In the first 2 minutes the temperature rises 4.5 °C. After that it rises about 6 °C every 2 minutes. Why is the start slower?',options:[
    {text:'The heater has to warm up itself before it heats the block',correct:true},
    {text:'The block is cold, so it needs more energy for each 1 °C',why:'The block’s specific heat capacity does not change with temperature here. The energy is going into the heater first.'},
    {text:'The joulemeter only starts counting after a minute',why:'The joulemeter counts from the moment the heater is switched on: 5760 J by 2 minutes, the same as every later 2 minutes.'},
    {text:'Energy is lost faster while the block is still cold',why:'A cold block loses the least energy, because it is closest to room temperature. The heater warming up is the cause.'}
  ],explain:'The heater must get hotter than the block before energy flows into it, so the first minute or so of energy warms the heater. That is why a value of c from the steady middle part of the graph is more accurate.'});
}
{
  const body=act('results','Predict','After the heater is switched off','');
  createPredict({host:body,q:'Sophie switched off at 10 minutes (48.0 °C), but at 12 minutes the reading was 49.0 °C. Why did it still rise?',options:[
    {text:'The hot heater was still passing energy to the block',correct:true},
    {text:'The joulemeter was still supplying energy to the heater',why:'The joulemeter reading stayed at 28 800 J, so no more energy was supplied after 10 minutes.'},
    {text:'The room was warming the block up through the lagging',why:'The room is cooler than the block, so energy flows out of the block, not in.'},
    {text:'The thermometer needs 2 minutes to show each reading',why:'The thermometer kept up with the block before, rising about 6 °C every 2 minutes. The block really did get hotter.'}
  ],explain:'When it is switched off, the heater is hotter than the block, so it keeps heating the block for a short while. That is why you keep reading until the temperature stops rising, and use the highest reading.'});
}
{
  const body=act('results','Predict','The line of best fit','');
  createPredict({host:body,q:'What line of best fit should Sophie draw through her points from 2 to 10 minutes?',options:[
    {text:'One straight line close to all of the points',correct:true},
    {text:'Short straight lines that join each point to the next',why:'Joining the dots follows every small reading error. A line of best fit shows the trend.'},
    {text:'A curve that passes exactly through every point',why:'These points lie close to a straight line, because the energy goes in at a steady rate. A curve hides that.'},
    {text:'A straight line from the origin through the points',why:'The graph starts at 20 °C, not 0 °C, so the line should not be forced through the origin.'}
  ],explain:'While the heater is on, energy goes in at a steady rate, so the temperature rises steadily: draw one straight line of best fit through these points, with about as many above it as below.'});
}
{
  const body=act('results','Predict','An anomalous result','');
  createPredict({host:body,q:'Ali heats some water in a lagged beaker. Which reading is anomalous, and what should he do?',
    pre:'<div class="table-scroll"><table class="units res-tbl"><thead><tr><th>Time (min)</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr></thead><tbody><tr><th>Temperature (°C)</th><td>20.0</td><td>21.5</td><td>23.0</td><td>26.5</td><td>26.0</td><td>27.5</td></tr></tbody></table></div>',
    options:[
    {text:'3 min: repeat it, and leave it out of the line',correct:true},
    {text:'5 min: it is the highest, so leave it out',why:'27.5 °C fits the pattern of 1.5 °C each minute. Being the highest does not make a result anomalous.'},
    {text:'3 min: average it in with the other readings',why:'Averaging an anomalous result in pulls the line away from the true trend. Leave it out of the line.'},
    {text:'None: the temperature always goes up, so all fit',why:'At 3 minutes it jumps 3.5 °C, then falls at 4 minutes. That breaks the steady 1.5 °C each minute.'}
  ],explain:'The water warms by about 1.5 °C each minute, so at 3 minutes it should be about 24.5 °C, not 26.5 °C. Perhaps the water was not stirred, or the bulb touched the heater. Repeat the reading if you can, and leave it out of the line of best fit.'});
}

/* ================= 6. GRAPHS ================= */
function lab(g0,t,x,y){return '<circle cx="'+g0.gx(x)+'" cy="'+g0.gy(y)+'" r="13" fill="var(--panel)" stroke="var(--ink)" stroke-width="2"/><text x="'+g0.gx(x)+'" y="'+(g0.gy(y)+5)+'" text-anchor="middle" font-size="14" fill="var(--ink)">'+t+'</text>';}
const GT={xMin:0,xMax:48,yMin:0,yMax:40,xTicks:[0,6,12,18,24,30,36,42,48],yTicks:[0,5,10,15,20,25,30,35,40],xLabel:'energy supplied (kJ)',yLabel:'rise in temperature (°C)',W:560,H:340};
function riseGraph(){
  const g0=lineGraph(Object.assign({points:[[0,0]]},GT));
  return lineGraph(Object.assign({label:'Rise in temperature against energy supplied for samples A, B and C',segments:[{pts:[[0,0],[18,40]]},{pts:[[0,0],[36,40]],cls:'g-line-b'},{pts:[[0,0],[48,48/42*10]],cls:'g-line-c'}],
    extra:lab(g0,'A',18,40)+lab(g0,'B',36,40)+lab(g0,'C',46,48/42*10+3.2)},GT)).svg;
}
{
  const body=act('graphs','Calculate','Read the graph','Three 1.0 kg samples (water, aluminium and iron) are heated in turn. The graph shows each sample’s rise in temperature against the energy supplied. Read your answers off the graph.');
  const split=mk('div','graph-split');body.appendChild(split);
  split.appendChild(mk('div','graph-box',riseGraph()));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'Sample B: how much energy raises its temperature by 20 °C?',unit:'kJ',answer:18,working:'Read across from 20 °C to line B, then down.<br>energy = 18 kJ'},
    {q:'Sample B: use your answer to find its specific heat capacity.',unit:'J/kg °C',answer:900,working:'ΔQ = 18 kJ = 18 000 J<br>ΔQ = m × c × ΔT<br>18 000 = 1.0 × c × 20<br>18 000 = 20 × c<br>c = [[18 000|20]]<br>c = 900 J/kg °C'},
    {q:'Sample A: what is its rise in temperature for the same 18 kJ?',unit:'°C',answer:40,working:'Read up from 18 kJ to line A, then across.<br>rise in temperature = 40 °C'},
    {q:'Sample C: how much energy raises its temperature by 10 °C?',unit:'kJ',answer:42,working:'Read across from 10 °C to line C, then down.<br>energy = 42 kJ'}
  ]});
}
{
  const body=act('graphs','Predict','Which line is water?','');
  createPredict({host:body,q:'Look at the graph above. Which line is the water?',options:[
    {text:'C: it needs the most energy for each 1 °C',correct:true},
    {text:'A: it has the steepest line on the graph',why:'The steepest line has the biggest rise for each kilojoule, so it needs the least energy: that is the iron.'},
    {text:'B: its line is between the other two lines',why:'B needs 0.9 kJ for each 1 °C: that is the aluminium.'},
    {text:'You cannot tell from a graph of this kind',why:'You can: the sample needing the most energy for each 1 °C has the biggest specific heat capacity, and that is water.'}
  ],explain:'Water has the biggest specific heat capacity (4200 J/kg °C), so it warms up the least for each kilojoule. Its line is the least steep. A is iron (450 J/kg °C) and B is aluminium (900 J/kg °C).'});
}
{
  const body=act('graphs','Predict','Steeper line, bigger c?','');
  createPredict({host:body,q:'On this graph (rise in temperature up the side), what does a steeper line show about a 1.0 kg sample?',options:[
    {text:'A smaller specific heat capacity',correct:true},
    {text:'A bigger specific heat capacity',why:'A steeper line means a bigger rise for each kilojoule, so less energy is needed for each 1 °C.'},
    {text:'A bigger mass of the sample',why:'All three samples have the same mass, 1.0 kg. The slope shows how much energy each 1 °C needs.'},
    {text:'A more powerful heater was used',why:'The energy is along the bottom, so the heater’s power does not change the slope.'}
  ],explain:'With rise in temperature up the side, a steeper line means more degrees for each kilojoule: less energy for each 1 °C, so a smaller specific heat capacity.'});
}
/* the same idea with the axes the other way round */
const GE={xMin:0,xMax:40,yMin:0,yMax:48,xTicks:[0,5,10,15,20,25,30,35,40],yTicks:[0,6,12,18,24,30,36,42,48],xLabel:'rise in temperature (°C)',yLabel:'energy supplied (kJ)',W:560,H:340};
function energyGraph(){
  const g0=lineGraph(Object.assign({points:[[0,0]]},GE));
  return lineGraph(Object.assign({label:'Energy supplied against rise in temperature for samples P and Q',segments:[{pts:[[0,0],[20,42]],cls:'g-line-c'},{pts:[[0,0],[40,18]],cls:'g-line-b'}],
    extra:lab(g0,'P',20,42)+lab(g0,'Q',40,18)},GE)).svg;
}
{
  const body=act('graphs','Calculate','The axes the other way round','This graph plots energy supplied up the side. Samples P and Q each have a mass of 0.50 kg. Read your answers off the graph.');
  const split=mk('div','graph-split');body.appendChild(split);
  split.appendChild(mk('div','graph-box',energyGraph()));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'Sample P: how much energy raises its temperature by 20 °C?',unit:'kJ',answer:42,working:'Read up from 20 °C to line P, then across.<br>energy = 42 kJ'},
    {q:'Sample Q: use the point at 40 °C to find its specific heat capacity.',unit:'J/kg °C',answer:900,working:'At 40 °C, ΔQ = 18 kJ = 18 000 J<br>ΔQ = m × c × ΔT<br>18 000 = 0.50 × c × 40<br>18 000 = 20 × c<br>c = [[18 000|20]]<br>c = 900 J/kg °C'}
  ]});
}
{
  const body=act('graphs','Predict','Steeper, with the axes swapped','');
  createPredict({host:body,q:'On this graph, which sample has the bigger specific heat capacity, P or Q?',options:[
    {text:'P: it needs more energy for each 1 °C',correct:true},
    {text:'Q: its line goes further along the bottom',why:'Going further along means a bigger rise for less energy, so Q needs less energy for each 1 °C.'},
    {text:'Q: its line is less steep, so it heats slowly',why:'With energy up the side, a less steep line means less energy for each 1 °C: Q heats up more easily.'},
    {text:'Neither: both have the same mass of 0.50 kg',why:'They have the same mass, but P needs 2.1 kJ for each 1 °C and Q only 0.45 kJ.'}
  ],explain:'With energy up the side, the steeper line needs more energy for each 1 °C, so it has the bigger specific heat capacity. P (water, 4200 J/kg °C) is steeper than Q (aluminium, 900 J/kg °C).'});
}
{
  const body=act('graphs','Predict','Is steeper always bigger c?','');
  createPredict({host:body,q:'Zahra says, “On these graphs, the steeper line always has the bigger specific heat capacity.” Is she right?',options:[
    {text:'Only when energy is plotted up the side',correct:true},
    {text:'Yes, on every graph like these',why:'Look at the first graph: with rise in temperature up the side, the steepest line (A) is iron, the smallest c.'},
    {text:'Only when the rise is plotted up the side',why:'With the rise up the side, a steeper line means more degrees for each kilojoule, so a smaller c.'},
    {text:'No: c cannot be seen on a graph',why:'You can see it from the slope; you just have to check which way round the axes are.'}
  ],explain:'Always check the axes. Energy up the side: steeper means a bigger c. Rise in temperature up the side: steeper means a smaller c (for samples of the same mass).'});
}

/* ================= 7. CALCULATE ================= */
{
  const body=act('calculate','Calculate','Using ΔQ = m × c × ΔT','Give each answer in the unit shown. Specific heat capacities: water 4200 J/kg °C, copper 390 J/kg °C.');
  createCalc({host:body,questions:[
    {q:'How much energy raises the temperature of 2.0 kg of water by 15 °C?',unit:'J',answer:126000,working:'ΔQ = m × c × ΔT<br>ΔQ = 2.0 × 4200 × 15<br>ΔQ = 126 000 J'},
    {q:'A 250 g copper block receives 1950 J. By how much does its temperature rise?',unit:'°C',answer:20,working:'250 g = 0.25 kg<br>ΔQ = m × c × ΔT<br>1950 = 0.25 × 390 × ΔT<br>1950 = 97.5 × ΔT<br>ΔT = [[1950|97.5]]<br>ΔT = 20 °C'},
    {q:'16 200 J heats a 1.5 kg metal block from 18 °C to 30 °C. What is its specific heat capacity?',unit:'J/kg °C',answer:900,working:'ΔT = 30 − 18<br>ΔT = 12 °C<br>16 200 = 1.5 × c × 12<br>16 200 = 18 × c<br>c = [[16 200|18]]<br>c = 900 J/kg °C'},
    {q:'500 g of oil (c = 2200 J/kg °C) at 20 °C receives 22 000 J. What is its final temperature?',unit:'°C',answer:40,working:'500 g = 0.5 kg<br>ΔQ = m × c × ΔT<br>22 000 = 0.5 × 2200 × ΔT<br>22 000 = 1100 × ΔT<br>ΔT = [[22 000|1100]]<br>ΔT = 20 °C<br>final temperature = 20 + 20<br>final temperature = 40 °C'}
  ]});
}
{
  const body=act('calculate','Spot the error','Find the mistake','Each answer has exactly one mistake, made while rearranging. Every line after it is worked correctly from it. Click the line with the mistake.');
  const grid=mk('div','');body.appendChild(grid);
  createSpot({host:grid,scenario:'25 200 J raises the temperature of some water by 3 °C. What is the mass of the water? (c = 4200 J/kg °C)',
    lines:['ΔQ = m × c × ΔT','25 200 = m × 4200 × 3','m = 25 200 × 4200 × 3','m = 317 520 000 kg'],wrong:2,
    explain:'m is multiplied by 4200 and by 3, so to get m on its own, divide 25 200 by both of them. A mass of 317 million kilograms is far too big.',
    fix:['25 200 = m × 12 600','m = [[25 200|12 600]]','m = 2 kg']});
  createSpot({host:grid,scenario:'5400 J raises the temperature of a 0.5 kg block by 12 °C. What is its specific heat capacity?',
    lines:['ΔQ = m × c × ΔT','5400 = 0.5 × c × 12','5400 = 6 × c','c = 5400 − 6','c = 5394 J/kg °C'],wrong:3,
    explain:'c is multiplied by 6, so divide 5400 by 6. Taking 6 away does not undo a multiplication.',
    fix:['c = [[5400|6]]','c = 900 J/kg °C']});
}

/* ================= 8. ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Better results or safer?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'Better results',hint:'More accurate or more useful readings',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps people safe',hint:'Protects people and equipment',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Wrap the block in lagging',cat:'a'},
    {id:'2',text:'Put a few drops of water in the thermometer hole',cat:'a'},
    {id:'3',text:'Keep reading after switching off, to catch the highest temperature',cat:'a'},
    {id:'4',text:'Put a lid on a beaker of water you are heating',cat:'a'},
    {id:'5',text:'Let the heater cool down before you take it out',cat:'s'},
    {id:'6',text:'Stand the hot block on a heatproof mat',cat:'s'},
    {id:'7',text:'Keep water away from the power supply and its plugs',cat:'s'},
    {id:'8',text:'Only switch the heater on when it is in the block or water',cat:'s'}
  ]});
}
{
  const body=act('accuracy','Predict','Why is the value too high?','');
  createPredict({host:body,q:'Sophie’s value for aluminium is 993 J/kg °C. The accepted value is 900 J/kg °C. What is the most likely reason?',options:[
    {text:'Energy heated the surroundings, so her ΔT was too small',correct:true},
    {text:'The joulemeter counted less energy than was supplied',why:'Less energy counted would make ΔQ too small, and her value of c lower, not higher.'},
    {text:'Her block had more mass than the 1.00 kg she measured',why:'A balance measures mass very accurately. The big error is energy that never heated the block.'},
    {text:'She read the highest temperature far too early',why:'She kept reading until 12 minutes, after the temperature had stopped rising.'}
  ],explain:'Some of the energy heats the air, the bench and the heater instead of the block. The block’s rise in temperature is smaller than it would be, and a smaller ΔT on the bottom of c = [[ΔQ|m × ΔT]] gives a bigger c.'});
}
{
  const body=act('accuracy','Predict','Thicker lagging','');
  createPredict({host:body,q:'Sophie repeats the test with thicker lagging round the block. How does her value of c change?',options:[
    {text:'It is closer to 900, as less energy is lost',correct:true},
    {text:'It goes up, as the lagging stores energy',why:'Lagging is an insulator. It cuts the energy lost, so more of it heats the block and ΔT is bigger.'},
    {text:'It stays the same: c belongs to aluminium',why:'The real c does not change, but her measured value does, because less energy escapes.'},
    {text:'It drops well below 900 J/kg °C',why:'Lagging can only cut the losses, not stop them, so her value gets closer to 900 but stays a little above it.'}
  ],explain:'Less energy escapes to the surroundings, so more of it heats the block. The rise in temperature is bigger, and her value of c comes closer to the accepted 900 J/kg °C.'});
}

/* ================= EXAM PRACTICE ================= */
{
  const body=act('exam','Exam style','The specific heat capacity of water','Ali heats 0.50 kg of water in a polystyrene cup with an immersion heater, and stirs it. A joulemeter measures the energy supplied. One reading is missing.');
  const tbl=mk('div','table-scroll');
  tbl.innerHTML='<table class="units res-tbl"><thead><tr><th>Time (min)</th><th>0</th><th>2</th><th>4</th><th>6</th><th>8</th></tr></thead><tbody><tr><th>Joulemeter (J)</th><td>0</td><td>6000</td><td>12 000</td><td>18 000</td><td>24 000</td></tr><tr><th>Temperature (°C)</th><td>20.0</td><td>22.0</td><td>24.5</td><td><b>?</b></td><td>29.5</td></tr></tbody></table>';
  body.appendChild(tbl);
  body.appendChild(mk('p','sub','(a) 1 mark'));
  createCalc({host:body,questions:[
    {q:'Ali forgot to write down the temperature at 6 minutes. Predict the missing reading.',unit:'°C',answer:27,working:'From 2 minutes on, the temperature rises 2.5 °C every 2 minutes.<br>temperature at 6 min = 24.5 + 2.5<br>temperature at 6 min = 27.0 °C'}
  ]});
  body.appendChild(mk('p','sub','(b) 3 marks'));
  createCalc({host:body,questions:[
    {q:'Use the readings from 2 to 8 minutes to find the specific heat capacity of water.',unit:'J/kg °C',answer:4800,working:'ΔQ = 24 000 − 6000<br>ΔQ = 18 000 J<br>ΔT = 29.5 − 22.0<br>ΔT = 7.5 °C<br>18 000 = 0.50 × c × 7.5<br>18 000 = 3.75 × c<br>c = [[18 000|3.75]]<br>c = 4800 J/kg °C'}
  ]});
  body.appendChild(mk('p','sub','(c) 2 marks'));
  body.appendChild(mk('p','','The accepted value is 4200 J/kg °C. Explain why Ali’s value is higher. Write your answer, then check it.'));
  const d1=mk('details','');
  d1.innerHTML='<summary>Check your answer</summary><div><ul><li>Some of the energy supplied heats the surroundings (the air, the cup and the heater), not the water.</li><li>So the water’s rise in temperature is smaller than it should be, and dividing by a smaller ΔT gives a bigger value of c.</li></ul></div>';
  body.appendChild(d1);
  body.appendChild(mk('p','sub','(d) 2 marks'));
  body.appendChild(mk('p','','Suggest two ways Ali could get a value closer to 4200 J/kg °C.'));
  const d2=mk('details','');
  d2.innerHTML='<summary>Check your answer</summary><div><ul><li>Put a lid on the cup, or add more insulation round it, to cut the energy lost to the surroundings.</li><li>Keep reading after the heater is switched off, and use the highest temperature; or use the gradient of the straight part of a temperature–time graph.</li></ul></div>';
  body.appendChild(d2);
  body.appendChild(mk('p','sub','(e) 2 marks'));
  body.appendChild(mk('p','','Ali repeats the test with 0.50 kg of copper instead of water, with the same heater for the same time. Describe how the copper’s rise in temperature compares with the water’s, and explain why.'));
  const d3=mk('details','');
  d3.innerHTML='<summary>Check your answer</summary><div><ul><li>The copper’s temperature rises much more (about 11 times as much).</li><li>Copper has a much smaller specific heat capacity, so it needs less energy for each 1 °C rise for each kilogram.</li></ul></div>';
  body.appendChild(d3);
}
