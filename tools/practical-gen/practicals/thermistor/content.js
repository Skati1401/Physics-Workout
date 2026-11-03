/* CP12 Calibrate a thermistor in a potential divider circuit as a thermostat (IAL spec 126).
   Model thermistor (same as animations/thermistor.html): R = R₀e^(b/T), b = 3900 K, 5.00 kΩ at 25 °C,
   so ln (R₀ / Ω) = −4.57. T = θ + 273. */

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
  const b=bar(body,[{label:'Check',primary:true,fn:()=>g.check()},{label:'Shuffle again',fn:()=>g.reset()}]);
  const score=mk('span','score');b.el.insertBefore(score,b.msg);
  Object.assign(g,createBlankGame({slots,pool,chips,msg:b,score,isCorrect:(c,s)=>c.text===s.answer}));
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

/* ================= 3. VARIABLES ================= */
{
  const body=act('variables','Sort','Which kind of variable is it?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'i',label:'Independent',hint:'You change it',color:'--c1',soft:'--c1-soft'},
    {id:'d',label:'Dependent',hint:'You measure it',color:'--c2',soft:'--c2-soft'},
    {id:'c',label:'Control',hint:'You keep it the same',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'The temperature of the water',cat:'i'},
    {id:'2',text:'The resistance of the thermistor',cat:'d'},
    {id:'3',text:'Using the same thermistor for every reading',cat:'c'},
    {id:'4',text:'The thermometer bulb’s position, next to the thermistor',cat:'c'},
    {id:'5',text:'Keeping the thermistor fully under the water',cat:'c'}
  ]});
}
{
  const body=act('variables','Predict','Planning the potential divider','');
  createPredict({host:body,q:'Amelia keeps the water at 40 °C and tries different settings of the variable resistor to see how the output voltage changes. What is her independent variable?',options:[
    {text:'The resistance of the variable resistor',correct:true},
    {text:'The temperature of the water',why:'She keeps the water at 40 °C, so here the temperature is a control variable.'},
    {text:'The output voltage across the thermistor',why:'The output voltage is what she measures, so it is the dependent variable.'},
    {text:'The voltage of the power supply',why:'The supply stays at 6.0 V for every reading, so it is a control variable.'}
  ],explain:'The independent variable is the one she changes on purpose: the variable resistor. She measures the output voltage and keeps the temperature and the supply voltage the same.'});
}
{
  const body=act('variables','Predict','Why kelvin?','');
  createPredict({host:body,q:'Haris’s readings are in °C. Why must he convert them to kelvin before he works out 1/T?',options:[
    {text:'R = R₀e<sup>b/T</sup> only works with absolute temperature',correct:true},
    {text:'Kelvin readings are more precise than °C readings',why:'A change of 1 K is the same as a change of 1 °C, so the precision is the same. The equation needs absolute temperature.'},
    {text:'The thermometer measures in kelvin anyway',why:'The thermometer reads °C. He has to add 273 to each reading himself.'},
    {text:'1/θ would be too small to plot on a graph',why:'The real problem is the opposite: at 0 °C, 1/θ would be infinite. The equation uses absolute temperature, T = θ + 273.'}
  ],explain:'The equation uses absolute temperature, measured from absolute zero. With θ in °C the first reading would give 1/0, which cannot be worked out. T = θ + 273.'});
}

/* ================= 4. EXPERIMENT ================= */
{
  act('experiment','Your turn','Take your own readings','Press Experiment. Read θ and R at 0 °C, then heat 10 °C at a time up to 80 °C and watch your table and graph fill in. Choose “ln R against 1/T” to find b and R₀. Then do it again with No stirring: how far out is b, and why? Your calibration is used again in the Divider tab, to find the temperature of a mystery beaker.');
}
frameAct('experiment','animations/thermistor.html','cal','Thermistor calibration animation','thermistor calibration',false);
{
  const body=act('experiment','Predict','Reading without stirring','');
  createPredict({host:body,q:'Asma heats the water quickly and reads the ohmmeter without stirring or waiting. The thermistor is cooler than the thermometer says. How are her values of R affected?',options:[
    {text:'Each R is too high for the θ she writes down',correct:true},
    {text:'Each R is too low for the θ she writes down',why:'A cooler NTC thermistor has a higher resistance, not a lower one.'},
    {text:'They are not affected; only θ is wrong',why:'θ is right for the water. The problem is that the thermistor is not at that temperature yet, so its R does not match θ.'},
    {text:'They are not affected, because R does not depend on stirring',why:'Stirring does not change R directly, but without it the thermistor and thermometer are at different temperatures.'}
  ],explain:'The thermistor lags behind the water. It is cooler than the thermometer reading, and a cooler NTC thermistor has a higher resistance. So each R is too high for its θ, and her value of b comes out wrong. Heat slowly, stir, and wait for thermal equilibrium.'});
}
{
  const body=act('experiment','Predict','What does NTC mean?','');
  createPredict({host:body,q:'Haris’s thermistor goes from 16.6 kΩ at 0 °C to 0.65 kΩ at 80 °C. Why is it called a negative temperature coefficient (NTC) thermistor?',options:[
    {text:'Its resistance falls as its temperature rises',correct:true},
    {text:'It only works at temperatures below 0 °C',why:'It works from 0 °C to 80 °C here. “Negative” describes how R changes with temperature.'},
    {text:'Its resistance rises as its temperature rises',why:'That would be a positive temperature coefficient, like a metal wire. Haris’s R falls.'},
    {text:'Current can only pass through it one way',why:'That describes a diode. A thermistor conducts both ways; its resistance depends on temperature.'}
  ],explain:'As the semiconductor warms up, more charge carriers are freed, so it conducts better. Its resistance falls as the temperature rises: a negative temperature coefficient.'});
}

/* ================= 5. RESULTS ================= */
{
  const body=act('results','Calculate','Complete the results table','Haris’s calibration readings. Work out the missing values. Give 1/T in units of 10⁻³ K⁻¹, and use R in ohms for ln R. T = θ + 273.');
  const tbl=mk('div','table-scroll');
  tbl.innerHTML='<table class="units res-tbl"><thead><tr><th>θ (°C)</th><th>R (kΩ)</th><th>T (K)</th><th>1/T (10⁻³ K⁻¹)</th><th>ln (R / Ω)</th></tr></thead><tbody>'+
    [[0,'16.6','273','3.663','9.717'],[20,'6.25','293','3.413','8.740'],[40,'2.67','?','?','?'],[60,'1.26','333','3.003','7.139'],[80,'0.651','353','2.833','?']]
    .map(r=>'<tr>'+r.map(c=>'<td>'+c+'</td>').join('')+'</tr>').join('')+'</tbody></table>';
  body.appendChild(tbl);
  createCalc({host:body,questions:[
    {q:'T at 40 °C',unit:'K',answer:313,working:'T = θ + 273<br>T = 40 + 273<br>T = 313 K'},
    {q:'1/T at 40 °C',unit:'10⁻³ K⁻¹',answer:3.195,working:'[[1|T]] = [[1|313]]<br>[[1|T]] = 0.003195 K⁻¹<br>[[1|T]] = 3.195 × 10⁻³ K⁻¹'},
    {q:'ln R at 40 °C',unit:'',answer:7.890,working:'R = 2.67 kΩ = 2670 Ω<br>ln R = ln 2670<br>ln R = 7.890'},
    {q:'ln R at 80 °C',unit:'',answer:6.478,working:'R = 0.651 kΩ = 651 Ω<br>ln R = ln 651<br>ln R = 6.478'}
  ]});
}
{
  const body=act('results','Plot','Plot Haris’s results','Plot ln R against 1/T for all five rows of Haris’s table. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');
  createPlot({host:body,
    points:[{x:3.663,y:9.717},{x:3.413,y:8.740},{x:3.195,y:7.890},{x:3.003,y:7.139},{x:2.833,y:6.478}],
    rowText:p=>fmt(p.x,3)+' × 10⁻³ K⁻¹, '+fmt(p.y,3),
    graph:{xMin:2.8,xMax:3.7,yMin:6,yMax:10,xTicks:[2.8,3.0,3.2,3.4,3.6],yTicks:[6,7,8,9,10],minor:[0.05,0.25],snap:[0.01,0.05],xLabel:'1/T (10⁻³ K⁻¹)',yLabel:'ln (R / Ω)',W:560,H:340}});
}
{
  const body=act('results','Predict','The line of best fit','');
  createPredict({host:body,q:'What line should Haris draw through his ln R against 1/T points?',options:[
    {text:'One straight line, with points on both sides of it',correct:true},
    {text:'A smooth curve through every point',why:'The points lie close to a straight line, which is the point of plotting ln R against 1/T. A curve hides that.'},
    {text:'A straight line forced through the origin',why:'The line has an intercept, ln R₀, which is not zero (it is about −4.6), so it must not be forced through the origin.'},
    {text:'Short straight lines joining each point to the next',why:'Joining the dots follows every small error. A line of best fit shows the trend.'}
  ],explain:'R = R₀e<sup>b/T</sup> means ln R = b(1/T) + ln R₀: a straight line that does not pass through the origin. Draw one thin straight line of best fit, with the points spread evenly on both sides.'});
}
{
  const body=act('results','Predict','An anomalous result','');
  createPredict({host:body,q:'Amelia’s values of ln R are below. Which result is anomalous, and what should she do?',
    pre:'<div class="table-scroll"><table class="units res-tbl"><thead><tr><th>θ (°C)</th><th>0</th><th>20</th><th>40</th><th>60</th><th>80</th></tr></thead><tbody><tr><th>ln (R / Ω)</th><td>9.72</td><td>8.74</td><td>8.31</td><td>7.14</td><td>6.48</td></tr></tbody></table></div>',
    options:[
    {text:'40 °C: repeat it, and leave it out of the line',correct:true},
    {text:'80 °C: it is the smallest, so leave it out',why:'6.48 fits the pattern of the others. Being the smallest does not make a result anomalous.'},
    {text:'40 °C: keep it, and average it with the others',why:'Averaging an anomalous result in pulls the line away from the true trend. Repeat it, and leave it out of the line.'},
    {text:'None: every reading lies on a smooth curve',why:'Plotted against 1/T, the other four lie on a straight line; the 40 °C point is well above it.'}
  ],explain:'Going by the other points, 40 °C should give about 7.9. 8.31 is too high: perhaps she read R before the thermistor had warmed up. Repeat it and leave it out of the line of best fit.'});
}

/* ================= 6. GRAPHS ================= */
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
  const body=act('graphs','Predict','Hot or cold?','');
  createPredict({host:body,q:'On the ln R against 1/T graph, which end of the line is the hottest water?',options:[
    {text:'The left end, where 1/T is smallest',correct:true},
    {text:'The right end, where 1/T is largest',why:'A large 1/T means a small T. The right end is the coldest water.'},
    {text:'The top end, where ln R is largest',why:'The largest resistance is at the lowest temperature for an NTC thermistor, so the top is the coldest.'},
    {text:'You cannot tell from this graph',why:'You can: T gets bigger as 1/T gets smaller, so temperature rises to the left.'}
  ],explain:'1/T is smallest when T is largest, so the hottest readings are on the left, where ln R is also smallest (an NTC thermistor’s resistance is lowest when hot).'});
}
{
  const body=act('graphs','Predict','The axes the other way round','');
  createPredict({host:body,q:'Asma plots 1/T up the side and ln R along the bottom instead. What is the gradient of her straight line?',options:[
    {text:'1/b',correct:true},
    {text:'b',why:'b is the gradient when ln R is up the side. Swapping the axes turns the gradient upside down.'},
    {text:'ln R₀',why:'ln R₀ is the intercept of the ln R against 1/T graph, not a gradient.'},
    {text:'−b',why:'Swapping the axes does not change the sign of the gradient: both quantities still go up together.'}
  ],explain:'ln R = b(1/T) + ln R₀ rearranges to 1/T = (1/b) ln R − (ln R₀)/b. With 1/T up the side, the gradient is 1/b, so b = 1/gradient. Always check which way round the axes are.'});
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
  const body=act('graphs','Predict','Why plot logs?','');
  createPredict({host:body,q:'Why does Haris plot ln R against 1/T instead of using his R against θ curve to find b?',options:[
    {text:'A straight line gives b as its gradient',correct:true},
    {text:'The R against θ curve is drawn wrongly',why:'The curve is right; it is just hard to get b from a curve.'},
    {text:'Logs make the resistances bigger',why:'Logs make large numbers smaller, but that is not the reason. Taking logs turns the curve into a straight line.'},
    {text:'1/T makes the temperatures more precise',why:'Changing what you plot cannot make a reading more precise. It makes the graph a straight line.'}
  ],explain:'R = R₀e<sup>b/T</sup> gives a curve. Taking natural logs gives ln R = b(1/T) + ln R₀, which has the form y = mx + c. A straight line is easier to draw accurately, and its gradient gives b.'});
}

/* ================= 7. POTENTIAL DIVIDER ================= */
{
  act('divider','Watch','The thermostat circuit','The thermistor is in series with a variable resistor across a 6.0 V supply. Change the water temperature and the resistor. Choose 40 °C design and set R so the output is 3.0 V. Then press Experiment: read the voltmeters for a mystery beaker and work out its temperature (in this frame it uses the model calibration, b = 3900 K and ln R₀ = −4.57).');
}
frameAct('divider','animations/thermistor.html','pd','Thermistor potential divider animation','thermistor potential divider',false);
{
  const body=act('divider','Predict','Warming up','');
  createPredict({host:body,q:'The water around the thermistor warms up. What happens to the output voltage across the thermistor?',options:[
    {text:'It falls, because R<sub>T</sub> falls',correct:true},
    {text:'It rises, because R<sub>T</sub> falls',why:'The same current passes through both parts, so each takes a share of 6.0 V in proportion to its resistance. A smaller R<sub>T</sub> gets a smaller share.'},
    {text:'It stays at 3.0 V',why:'It is only 3.0 V when R<sub>T</sub> equals R. As R<sub>T</sub> changes, the share changes.'},
    {text:'It rises, because R<sub>T</sub> rises',why:'This is an NTC thermistor: its resistance falls as it warms up.'}
  ],explain:'V<sub>out</sub> = [[R<sub>T</sub>|R<sub>T</sub> + R]] × V. As the water warms, R<sub>T</sub> falls, so the thermistor’s share of the 6.0 V falls. The voltage across the variable resistor rises by the same amount.'});
}
{
  const body=act('divider','Predict','Switching on a heater','');
  createPredict({host:body,q:'A thermostat must switch a heater on when the room gets cold, using an output that rises as the temperature falls. Where should the output be taken?',options:[
    {text:'Across the thermistor',correct:true},
    {text:'Across the variable resistor',why:'The voltage across the resistor rises when it gets hotter, so that output would suit a cooling fan, not a heater.'},
    {text:'Across the whole 6.0 V supply',why:'The supply voltage stays at 6.0 V whatever the temperature, so it cannot signal a change.'},
    {text:'Either part: both outputs rise as it cools',why:'They share a fixed 6.0 V, so when one rises the other must fall.'}
  ],explain:'When it gets colder, R<sub>T</sub> rises, so the thermistor takes a bigger share of the 6.0 V. The output across the thermistor rises as the temperature falls, which can switch the heater on.'});
}
{
  const body=act('divider','Calculate','Design and use the divider','Use the thermistor in the graphs: R<sub>T</sub> = 2.67 kΩ at 40 °C and 6.25 kΩ at 20 °C. The supply is 6.0 V.');
  createCalc({host:body,questions:[
    {q:'What setting of the variable resistor gives an output of 3.0 V across the thermistor at 40 °C?',unit:'kΩ',answer:2.67,working:'V<sub>out</sub> = [[R<sub>T</sub>|R<sub>T</sub> + R]] × V<br>3.0 = [[2.67|2.67 + R]] × 6.0<br>3.0 × (2.67 + R) = 2.67 × 6.0<br>8.01 + 3.0 R = 16.02<br>3.0 R = 8.01<br>R = [[8.01|3.0]]<br>R = 2.67 kΩ'},
    {q:'With R = 2.67 kΩ, what is the output across the thermistor at 20 °C?',unit:'V',answer:4.20,working:'V<sub>out</sub> = [[R<sub>T</sub>|R<sub>T</sub> + R]] × V<br>V<sub>out</sub> = [[6.25|6.25 + 2.67]] × 6.0<br>V<sub>out</sub> = [[6.25|8.92]] × 6.0<br>V<sub>out</sub> = 4.20 V'}
  ]});
}

/* ================= 8. CALCULATE ================= */
{
  const body=act('calculate','Calculate','Using the calibration','Use T = θ + 273. For this thermistor, b = 3900 K and ln (R₀ / Ω) = −4.57.');
  createCalc({host:body,questions:[
    {q:'Find the resistance of the thermistor at 50 °C.',unit:'kΩ',answer:1.82,working:'ln R = [[b|T]] + ln R₀<br>ln R = [[3900|323]] + (−4.57)<br>ln R = 12.07 − 4.57<br>ln R = 7.504<br>R = e<sup>7.504</sup><br>R = 1816 Ω<br>R = 1.82 kΩ'},
    {q:'In a mystery beaker the thermistor’s resistance is 1.20 kΩ. Find the temperature of the water in °C.',unit:'°C',answer:61.5,working:'ln R = [[b|T]] + ln R₀<br>ln 1200 = [[3900|T]] + (−4.57)<br>7.090 + 4.57 = [[3900|T]]<br>11.66 = [[3900|T]]<br>T = [[3900|11.66]]<br>T = 334.5 K<br>θ = 334.5 − 273<br>θ = 61.5 °C'},
    {q:'A thermistor is 16.6 kΩ at 0 °C and 0.651 kΩ at 80 °C. Find b.',unit:'K',answer:3900,working:'ln R₁ − ln R₂ = b × ([[1|T₁]] − [[1|T₂]])<br>ln 16 600 − ln 651 = b × ([[1|273]] − [[1|353]])<br>3.239 = b × 8.301 × 10⁻⁴<br>b = [[3.239|8.301 × 10⁻⁴]]<br>b = 3902 K'},
    {q:'In the divider, R = 2.70 kΩ. The voltmeters read 4.10 V across R and 1.88 V across the thermistor. Find R<sub>T</sub>.',unit:'kΩ',answer:1.24,working:'[[R<sub>T</sub>|R]] = [[V<sub>T</sub>|V<sub>R</sub>]]<br>[[R<sub>T</sub>|2.70]] = [[1.88|4.10]]<br>R<sub>T</sub> = [[1.88 × 2.70|4.10]]<br>R<sub>T</sub> = 1.24 kΩ'}
  ]});
}
{
  const body=act('calculate','Spot the error','Find the mistake','Each answer has exactly one mistake, made while rearranging. Every line after it is worked correctly from it. Click the line with the mistake.');
  const grid=mk('div','');body.appendChild(grid);
  createSpot({host:grid,scenario:'Haris finds the temperature when the thermistor’s resistance is 2.67 kΩ. b = 3900 K and ln (R₀ / Ω) = −4.57.',
    lines:['ln R = [[b|T]] + ln R₀','ln 2670 = [[3900|T]] + (−4.57)','7.890 + 4.57 = [[3900|T]]','12.46 = [[3900|T]]','T = [[12.46|3900]]','T = 0.003195 K'],wrong:4,
    explain:'To get T on its own, multiply both sides by T and divide by 12.46: T = 3900 over 12.46. Haris turned the fraction upside down, which gives 1/T, not T. A temperature of 0.003 K is far below anything in the beaker.',
    fix:['T = [[3900|12.46]]','T = 313 K (40 °C)']});
  createSpot({host:grid,scenario:'Amelia finds R<sub>T</sub> in the divider. R = 3.00 kΩ, V<sub>R</sub> = 2.40 V and V<sub>T</sub> = 3.60 V.',
    lines:['[[R<sub>T</sub>|R]] = [[V<sub>T</sub>|V<sub>R</sub>]]','[[R<sub>T</sub>|3.00]] = [[3.60|2.40]]','R<sub>T</sub> = [[3.60|2.40 × 3.00]]','R<sub>T</sub> = 0.500 kΩ'],wrong:2,
    explain:'To get R<sub>T</sub> on its own, multiply both sides by 3.00, so 3.00 goes on the top. Amelia divided by it. A check: the thermistor has the bigger voltage, so it must have the bigger resistance, more than 3.00 kΩ.',
    fix:['R<sub>T</sub> = [[3.60 × 3.00|2.40]]','R<sub>T</sub> = 4.50 kΩ']});
}

/* ================= 9. ACCURACY AND SAFETY ================= */
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
  const body=act('accuracy','Predict','Thermal equilibrium','');
  createPredict({host:body,q:'Why should Asma remove the heat and stir for a while before each reading?',options:[
    {text:'So the thermistor is as hot as the water',correct:true},
    {text:'So the ohmmeter has time to warm up',why:'The ohmmeter is outside the beaker. The waiting is for the thermistor to reach the water’s temperature.'},
    {text:'So that the water does not boil',why:'The water only goes up to 80 °C. The reason is to let the thermistor catch up with the water.'},
    {text:'So that the resistance stops changing for good',why:'R will change again as soon as she heats more. She waits so that R matches the θ she records.'}
  ],explain:'The thermistor and thermometer warm up more slowly than the water near the flame. Stirring and waiting brings everything to the same temperature (thermal equilibrium), so each R really belongs to the θ recorded with it.'});
}
{
  const body=act('accuracy','Predict','Checking the result','');
  createPredict({host:body,q:'Haris’s potential divider should give 3.0 V at 40 °C. He measures 2.9 V. How should he judge his design?',options:[
    {text:'Compare the difference with his uncertainty',correct:true},
    {text:'It failed, because 2.9 V is not 3.0 V',why:'No measurement is exact. He needs to see whether the difference is bigger than his uncertainties.'},
    {text:'Repeat until a reading of exactly 3.0 V appears',why:'Repeating until you get the answer you want is not fair testing. Compare the difference with the uncertainty instead.'},
    {text:'Change the supply voltage until it reads 3.0 V',why:'That changes the design to fit the result. The supply must stay at 6.0 V.'}
  ],explain:'2.9 V is about 3% below 3.0 V. A 1 °C error in temperature changes R<sub>T</sub> by about 4%, but V<sub>out</sub> by only about 2%, because R<sub>T</sub> and R share the supply equally. So a 0.1 V difference needs about 2 °C of temperature error, or a few per cent of error in setting R. If his uncertainties are that big or bigger, the design works within experimental error. He can also check how straight his ln R graph is.'});
}

/* ================= 10. EXAM PRACTICE ================= */
{
  const body=act('exam','Exam style','Calibrating a thermistor','Amelia calibrates an NTC thermistor. From her graph of ln R against 1/T she finds b = 3900 K and ln (R₀ / Ω) = −4.57. One result in her table is missing.');
  const tbl=mk('div','table-scroll');
  tbl.innerHTML='<table class="units res-tbl"><thead><tr><th>θ (°C)</th><th>0</th><th>30</th><th>50</th><th>70</th></tr></thead><tbody><tr><th>R (kΩ)</th><td>16.6</td><td>4.03</td><td><b>?</b></td><td>0.898</td></tr></tbody></table>';
  body.appendChild(tbl);
  body.appendChild(mk('p','sub','(a) 3 marks'));
  createCalc({host:body,questions:[
    {q:'Calculate the missing resistance at 50 °C.',unit:'kΩ',answer:1.82,working:'T = 50 + 273 = 323 K<br>ln R = [[b|T]] + ln R₀<br>ln R = [[3900|323]] + (−4.57)<br>ln R = 7.504<br>R = e<sup>7.504</sup><br>R = 1816 Ω = 1.82 kΩ'}
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
