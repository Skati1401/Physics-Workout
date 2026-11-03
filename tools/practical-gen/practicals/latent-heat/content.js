/* IAL CP13: determine the specific latent heat of a phase change (spec 127; uses 125 and 128).
   Fusion: two funnels of crushed ice, only one heater on (through a joulemeter); the control funnel corrects for ice
   melted by the room (Alex's 5.1 deck, slide 59). Vaporisation: water kept boiling on a balance (slides 60–61).
   Values from the deck: Lf = 334 kJ/kg, Lv = 2260 kJ/kg. */
const ORDER_INTRO='Put the steps in the order you would do them. Drag the ≡ handle, or use the ▲▼ buttons.';
function sTable(head,rows){
  const t=mk('div','table-scroll');
  t.innerHTML='<table class="units res-tbl"><thead><tr>'+head.map(h=>'<th>'+h+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map((c,i)=>(i?'<td>':'<th>')+c+(i?'</td>':'</th>')).join('')+'</tr>').join('')+'</tbody></table>';
  return t;
}

/* ================= 1. OVERVIEW ================= */
{
  const body=act('overview','Fill in the blanks','The practical in one passage','Drag a word into each gap, or tap a word and then tap a gap. Some words are not needed.');
  const parts=[
    'The specific latent heat of a substance is the energy needed to change the state of ',['b1','1 kg'],' of it without any change in its ',['b2','temperature'],
    ': ΔE = LΔm. To find L for melting ice, fill two funnels with crushed ice, each with an immersion heater. Switch on only one heater, connected through a ',['b3','joulemeter'],
    '. The other funnel is the ',['b4','control'],': it shows how much ice is melted by the ',['b5','room'],'. Δm = mass of water from the heated funnel − mass from the control. To find L for boiling water, keep the water ',
    ['b6','boiling'],' with a heater in a beaker on a ',['b7','balance'],', and measure the mass lost as ',['b8','steam'],'. Plot ΔE against Δm: the ',['b9','gradient'],
    ' of the line is L. While a substance changes state, the energy supplied increases the ',['b10','potential energy'],' of its molecules, not their kinetic energy, so its temperature stays the same.'
  ];
  const cloze=mk('div','cloze'),slots=[],chips=[];
  parts.forEach(p=>{
    if(typeof p==='string')cloze.appendChild(document.createTextNode(p));
    else{const s=mk('span','blank');cloze.appendChild(s);slots.push({id:p[0],el:s,answer:p[1]});chips.push({id:'c-'+p[0],text:p[1]});}
  });
  ['kinetic energy','1 g','thermometer','intercept'].forEach((t,i)=>chips.push({id:'d'+i,text:t}));
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
  const body=act('method','Order','Melting ice (L<sub>f</sub>)',ORDER_INTRO);
  createReorder({host:body,steps:[
    {id:'a',text:'Fill two funnels with crushed ice and put an immersion heater in each. Connect only one heater, through a joulemeter, to the 12 V supply.'},
    {id:'b',text:'Wait until water drips steadily from both funnels, so all the ice is melting at 0 °C.'},
    {id:'c',text:'Put an empty beaker under each funnel and reset the joulemeter to zero.'},
    {id:'d',text:'Switch on the heater in the experimental funnel and start the stopwatch.'},
    {id:'e',text:'After 10 minutes, switch off the heater, remove both beakers and read the joulemeter: this is ΔE.'},
    {id:'f',text:'Measure the mass of water in each beaker on a balance.'},
    {id:'g',text:'Δm = mass from the experimental funnel − mass from the control funnel.'},
    {id:'h',text:'L<sub>f</sub> = [[ΔE|Δm]], in J kg⁻¹, with Δm in kg.'}
  ],constraints:[['a','b'],['b','c'],['c','d'],['d','e'],['e','f'],['f','g'],['g','h']],
  why:'The beakers go under the funnels only once the ice is melting, so every gram collected melted during the timed run. Both beakers are swapped at the same moments, so the control matches the experimental funnel.'});
}
{
  const body=act('method','Order','Boiling water (L<sub>v</sub>)',ORDER_INTRO);
  createReorder({host:body,steps:[
    {id:'a',text:'Put a beaker of water with an immersion heater in it on a balance.'},
    {id:'b',text:'Switch on and wait until the water is boiling steadily.'},
    {id:'c',text:'Read the balance and reset the joulemeter to zero at the same moment.'},
    {id:'d',text:'Leave the water boiling for 10 minutes.'},
    {id:'e',text:'Read the balance and the joulemeter again.'},
    {id:'f',text:'Δm = first balance reading − second balance reading.'},
    {id:'g',text:'L<sub>v</sub> = [[ΔE|Δm]], in J kg⁻¹, with Δm in kg.'}
  ],constraints:[['a','b'],['b','c'],['c','d'],['d','e'],['e','f'],['f','g']],
  why:'Until the water boils, the energy only warms it up. The readings start once it is boiling, so every joule counted turns water into steam.'});
}
{
  const body=act('method','Match','What each piece of equipment is for','Pair each piece of equipment with its job. Drag one card onto the other, or tap one card and then the other.');
  createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'j',l:'Joulemeter',r:'Measures the energy supplied to the heater'},
    {id:'c',l:'Control funnel',r:'Measures how much ice the room melts'},
    {id:'b',l:'Balance',r:'Measures the mass of water collected or boiled away'},
    {id:'i',l:'Crushed ice',r:'Packs round the heater, so its energy goes into the ice'},
    {id:'s',l:'Stopwatch',r:'Times how long the heater is switched on'},
    {id:'l',l:'Lagging round the beaker',r:'Cuts the energy lost from the boiling water'},
    {id:'v',l:'Voltmeter and ammeter',r:'Another way to find the energy, from ΔE = VIt'}
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
    {id:'3',text:'The mass of water collected from the heated funnel',cat:'d'},
    {id:'4',text:'The mass of water boiled away',cat:'d'},
    {id:'5',text:'The power of the heater',cat:'c'},
    {id:'6',text:'The temperature of the room',cat:'c'},
    {id:'7',text:'Crushed ice of the same size in both funnels',cat:'c'}
  ]});
}
{
  const body=act('variables','Predict','A new question to test','');
  createPredict({host:body,q:'Rose wants to find out whether different liquids have different specific latent heats of vaporisation. What is her independent variable?',options:[
    {text:'The type of liquid she boils',correct:true},
    {text:'The energy the heater supplies',why:'She can supply the same energy to each liquid, so it is a control variable, not the one she investigates.'},
    {text:'The mass of liquid boiled away',why:'That is what she measures for each liquid, so it is the dependent variable.'},
    {text:'The power of the immersion heater',why:'She should use the same heater for every liquid, so its power is a control variable.'}
  ],explain:'The independent variable is the one she changes on purpose: the liquid. For each one she measures ΔE and Δm, and works out L = [[ΔE|Δm]].'});
}
{
  const body=act('variables','Predict','Before the timing starts','');
  createPredict({host:body,q:'Why does Nicholas wait until water drips steadily from both funnels before he starts the experiment?',options:[
    {text:'So all the ice is already at 0 °C and melting',correct:true},
    {text:'So the heater has time to warm up the funnel',why:'The heater is still off while he waits. The room is warming the ice up to 0 °C.'},
    {text:'So there is some water in each beaker to start',why:'The beakers go under the funnels empty, after the wait. Water from before the start must not be counted.'},
    {text:'So the joulemeter has time to reset itself',why:'He resets the joulemeter himself. The wait is for the ice, not the meter.'}
  ],explain:'Ice from a freezer is below 0 °C. Some energy would warm it up before any melted, so ΔE would be too big for the mass melted and L<sub>f</sub> too high. Once water drips steadily, all the ice is at 0 °C.'});
}

/* ================= 4. EXPERIMENT ================= */
{
  act('experiment','Your turn','Take your own readings','Press Experiment in each part below. In Fusion, take readings every 2 minutes with the control, then try again with no control and with ice from the freezer. In Vaporisation, try the beaker lagged and with no lagging. Each time, compare your gradient with the accepted value: which way is it out, and why?');
}
frameAct('experiment','animations/latent-heat.html','fus','Specific latent heat animation: melting ice in two funnels','fusion',false);
frameAct('experiment','animations/latent-heat.html','vap','Specific latent heat animation: boiling water on a balance','vaporisation',false);
{
  const body=act('experiment','Sort','What happens to the molecules?','Internal energy is the random distribution of potential and kinetic energy amongst the molecules. Sort each change by which energy of the molecules increases, then press Check.');
  createSortGame({host:body,cats:[
    {id:'k',label:'Kinetic energy increases',hint:'The mean speed of the molecules rises',color:'--c1',soft:'--c1-soft'},
    {id:'p',label:'Potential energy increases',hint:'Bonds between molecules are broken',color:'--c2',soft:'--c2-soft'}
  ],items:[
    {id:'1',text:'Water is heated from 20 °C to 60 °C',cat:'k'},
    {id:'2',text:'Ice is warmed from −10 °C to 0 °C',cat:'k'},
    {id:'3',text:'Steam is heated from 100 °C to 120 °C',cat:'k'},
    {id:'4',text:'Ice melts in the funnel at 0 °C',cat:'p'},
    {id:'5',text:'Water boils away at 100 °C',cat:'p'},
    {id:'6',text:'Solid wax melts at its melting point',cat:'p'}
  ]});
}
{
  const body=act('experiment','Predict','Ice or water?','');
  createPredict({host:body,q:'Amelia has 1 kg of ice at 0 °C and 1 kg of water at 0 °C. Which has more internal energy?',options:[
    {text:'Water: more potential energy in its molecules',correct:true},
    {text:'Neither: they are at the same temperature',why:'The same temperature means the same mean kinetic energy, but internal energy includes potential energy too.'},
    {text:'The ice: its molecules are held tightly in place',why:'Tightly bound molecules have less potential energy. Energy (L<sub>f</sub>) had to go in to free them.'},
    {text:'The water: its molecules move much faster',why:'At the same temperature the molecules have the same mean kinetic energy. The difference is in potential energy.'}
  ],explain:'Melting 1 kg of ice needs 334 kJ, which raises the potential energy of the molecules without changing their mean kinetic energy. So the water has 334 kJ more internal energy.'});
}
{
  const body=act('experiment','Predict','Steam burns','');
  createPredict({host:body,q:'Why does steam at 100 °C cause a worse burn than the same mass of water at 100 °C?',options:[
    {text:'It releases latent heat as it condenses on skin',correct:true},
    {text:'Steam is hotter than the water, so it burns more',why:'Both are at 100 °C. The extra energy comes from the steam changing state.'},
    {text:'Steam molecules move far faster than water’s',why:'At the same temperature the mean kinetic energy is the same. The difference is potential energy.'},
    {text:'Steam spreads out, so it touches more skin',why:'The question compares the same mass, and the main reason is energy, not area.'}
  ],explain:'As steam condenses on the skin, it gives out its latent heat (2260 kJ for each kilogram) before it even starts to cool. Water at 100 °C only gives out energy as it cools.'});
}

/* ================= 5. RESULTS ================= */
const ZR=[[0,0,0,0],[2,4800,15.6,1.6],[4,9600,31.2,3.2],[6,14400,46.8,4.8],[8,19200,62.9,6.4],[10,24000,78.5,8.0]];
{
  const body=act('results','Calculate','Work out L<sub>f</sub> from Rose’s results','Rose used two funnels of melting ice, with the heater on in the experimental funnel only. She swapped both beakers every 2 minutes and added up the masses.');
  body.appendChild(sTable(['Time (min)','Joulemeter, ΔE (J)','Experimental funnel (g)','Control funnel (g)'],ZR.map(r=>[r[0],fmt(r[1]),r[2].toFixed(1),r[3].toFixed(1)])));
  createCalc({host:body,questions:[
    {q:'What mass of ice did the heater melt in the 10 minutes?',unit:'g',answer:70.5,working:'Δm = m<sub>exp</sub> − m<sub>control</sub><br>Δm = 78.5 − 8.0<br>Δm = 70.5 g'},
    {q:'Use the 10-minute readings to find L<sub>f</sub>.',unit:'kJ kg⁻¹',answer:340,working:'Δm = 70.5 g = 0.0705 kg<br>ΔE = LΔm<br>24 000 = L<sub>f</sub> × 0.0705<br>L<sub>f</sub> = [[24 000|0.0705]]<br>L<sub>f</sub> = 340 400 J kg⁻¹<br>L<sub>f</sub> = 340 kJ kg⁻¹'},
    {q:'What was the power of the heater?',unit:'W',answer:40,working:'P = [[ΔE|t]]<br>P = [[24 000|600]]<br>P = 40 W'},
    {q:'How much ice did the room melt in each funnel every minute?',unit:'g',answer:0.8,working:'rate = [[8.0|10]]<br>rate = 0.8 g each minute'}
  ]});
}
{
  const body=act('results','Plot','Plot ΔE against Δm','Work out Δm (experimental − control) for each reading in Rose’s table, then plot ΔE against Δm as a small cross. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');
  createPlot({host:body,
    points:[{x:0,y:0},{x:14,y:4.8},{x:28,y:9.6},{x:42,y:14.4},{x:56.5,y:19.2},{x:70.5,y:24}],
    rowText:p=>'Δm = '+p.x.toFixed(1)+' g, ΔE = '+p.y.toFixed(1)+' kJ',
    graph:{xMin:0,xMax:80,yMin:0,yMax:28,xTicks:[0,10,20,30,40,50,60,70,80],yTicks:[0,4,8,12,16,20,24,28],minor:[2,0.8],snap:[0.5,0.4],xLabel:'Δm (g)',yLabel:'ΔE (kJ)',W:560,H:340}});
}
{
  const body=act('results','Predict','What the gradient tells you','');
  createPredict({host:body,q:'Rose draws a line of best fit through her points. What does its gradient give her?',options:[
    {text:'The value of L for melting ice',correct:true},
    {text:'The power of the heater, in watts',why:'Power is the energy transferred per second. This graph has energy against mass, not against time.'},
    {text:'The mass of ice melted by the room',why:'The control readings are already taken off in Δm, so the room’s melting is not on this graph.'},
    {text:'The specific heat capacity of the ice',why:'The ice stays at 0 °C, so there is no temperature change. c needs ΔE = mcΔθ.'}
  ],explain:'ΔE = LΔm, so ΔE against Δm is a straight line through the origin with gradient L. Her gradient is 0.340 kJ g⁻¹ = 340 kJ kg⁻¹.'});
}
{
  const body=act('results','Predict','Why use a graph?','');
  createPredict({host:body,q:'Nicholas’s ice came straight from the freezer. His line of ΔE against Δm misses the origin, cutting the ΔE axis at 3 kJ. Which is right?',options:[
    {text:'The gradient still gives the right value of L',correct:true},
    {text:'His results are useless and must all be repeated',why:'The points still lie on a straight line. Only the intercept is affected, and the gradient still gives L<sub>f</sub>.'},
    {text:'The 3 kJ was used up by the joulemeter itself',why:'The joulemeter measures the energy; it does not use it. The 3 kJ warmed the ice up to 0 °C.'},
    {text:'The gradient is too big because of the 3 kJ',why:'The extra 3 kJ moves every point up by the same amount, so it shifts the line without changing its slope.'}
  ],explain:'The first 3 kJ warmed the ice from below 0 °C to 0 °C before any melted. That adds the same energy to every point, so the line moves up but its gradient is still L<sub>f</sub>. One reading, [[ΔE|Δm]], would include the 3 kJ and come out too high.'});
}
{
  const body=act('results','Predict','An anomalous result','');
  createPredict({host:body,q:'Amelia boils water on a balance with a 60 W heater. Which reading is anomalous, and what should she do?',
    pre:'<div class="table-scroll"><table class="units res-tbl"><thead><tr><th>Time (min)</th><th>0</th><th>2</th><th>4</th><th>6</th><th>8</th></tr></thead><tbody><tr><th>Balance (g)</th><td>385.0</td><td>382.0</td><td>379.0</td><td>374.6</td><td>373.0</td></tr></tbody></table></div>',
    options:[
    {text:'6 min: repeat it and leave it out',correct:true},
    {text:'8 min: it is the lowest, so leave it out',why:'373.0 g fits the pattern of 3.0 g lost every 2 minutes. Being the lowest does not make it anomalous.'},
    {text:'6 min: average it in with the other readings',why:'Averaging an anomalous result in pulls the line away from the true trend. Leave it out of the line.'},
    {text:'None: the mass always falls, so they all fit',why:'From 4 to 6 minutes it falls 4.4 g, then only 1.6 g from 6 to 8. That breaks the steady 3.0 g every 2 minutes.'}
  ],explain:'The water loses about 3.0 g every 2 minutes, so at 6 minutes the balance should read about 376.0 g, not 374.6 g. Perhaps she knocked the beaker or misread the display. Repeat the reading if you can, and leave it out of the line of best fit.'});
}

/* ================= 6. GRAPHS ================= */
function lab(g0,t,x,y){return '<circle cx="'+g0.gx(x)+'" cy="'+g0.gy(y)+'" r="13" fill="var(--panel)" stroke="var(--ink)" stroke-width="2"/><text x="'+g0.gx(x)+'" y="'+(g0.gy(y)+5)+'" text-anchor="middle" font-size="14" fill="var(--ink)">'+t+'</text>';}
const GE={xMin:0,xMax:20,yMin:0,yMax:45,xTicks:[0,4,8,12,16,20],yTicks:[0,5,10,15,20,25,30,35,40,45],xLabel:'mass boiled away, Δm (g)',yLabel:'energy supplied, ΔE (kJ)',W:560,H:340};
function boilGraph(){
  const g0=lineGraph(Object.assign({points:[[0,0]]},GE));
  return lineGraph(Object.assign({label:'Energy supplied against mass boiled away for liquids A, B and C',segments:[{pts:[[0,0],[20,45]]},{pts:[[0,0],[20,18]],cls:'g-line-b'},{pts:[[0,0],[20,8]],cls:'g-line-c'}],
    extra:lab(g0,'A',19,45-2.25*1-1)+lab(g0,'B',20,18+3.2)+lab(g0,'C',20,8+3.2)},GE)).svg;
}
{
  const body=act('graphs','Calculate','Read the graph','Three liquids, A, B and C, are each kept boiling by a heater with a joulemeter. The graph shows the energy supplied against the mass boiled away. Read your answers off the graph.');
  const split=mk('div','graph-split');body.appendChild(split);
  split.appendChild(mk('div','graph-box',boilGraph()));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'Liquid A: how much energy boils away 8 g?',unit:'kJ',answer:18,working:'Read up from 8 g to line A, then across.<br>ΔE = 18 kJ'},
    {q:'Liquid A: use your answer to find L<sub>v</sub>.',unit:'kJ kg⁻¹',answer:2250,working:'ΔE = 18 kJ = 18 000 J<br>Δm = 8 g = 0.008 kg<br>ΔE = LΔm<br>18 000 = L<sub>v</sub> × 0.008<br>L<sub>v</sub> = [[18 000|0.008]]<br>L<sub>v</sub> = 2 250 000 J kg⁻¹<br>L<sub>v</sub> = 2250 kJ kg⁻¹'},
    {q:'Liquid B: what mass boils away when 18 kJ is supplied?',unit:'g',answer:20,working:'Read across from 18 kJ to line B, then down.<br>Δm = 20 g'},
    {q:'Liquid C: find L<sub>v</sub> from the gradient of its line.',unit:'kJ kg⁻¹',answer:400,working:'gradient = [[ΔE|Δm]]<br>gradient = [[8 kJ|20 g]]<br>gradient = 0.40 kJ g⁻¹<br>L<sub>v</sub> = 400 kJ kg⁻¹'}
  ]});
}
{
  const body=act('graphs','Predict','Which liquid is water?','');
  createPredict({host:body,q:'One of the liquids is water (L<sub>v</sub> = 2260 kJ kg⁻¹). Which line is it?',options:[
    {text:'A: it needs the most energy for each gram',correct:true},
    {text:'C: it boils away the most for each kilojoule',why:'Boiling away the most for each kilojoule means the least energy for each gram: the smallest L<sub>v</sub>, not water.'},
    {text:'B: its line is between the other two lines',why:'B needs 0.9 kJ for each gram, 900 kJ kg⁻¹: far less than water.'},
    {text:'You cannot tell which is water from this graph',why:'You can: the gradient of each line is its L<sub>v</sub>, and A’s is 2.25 kJ g⁻¹ = 2250 kJ kg⁻¹.'}
  ],explain:'With energy up the side, the gradient is L<sub>v</sub>. Water has the biggest specific latent heat of vaporisation, so its line is the steepest: A.'});
}
{
  const body=act('graphs','Predict','Steeper line, bigger L?','');
  createPredict({host:body,q:'On this graph (energy up the side), what does a steeper line show about a liquid?',options:[
    {text:'A bigger specific latent heat',correct:true},
    {text:'A smaller specific latent heat',why:'A steeper line means more kilojoules for each gram, so more energy is needed to boil each kilogram.'},
    {text:'A more powerful heater was used',why:'The energy itself is on the axis, so the heater’s power does not change the slope.'},
    {text:'A higher boiling point',why:'The graph shows energy for each gram once it is boiling. It says nothing about the temperature it boils at.'}
  ],explain:'gradient = [[ΔE|Δm]] = L. A steeper line means more energy for each gram, so a bigger specific latent heat.'});
}
/* the same idea with the axes the other way round */
const GM={xMin:0,xMax:10,yMin:0,yMax:40,xTicks:[0,2,4,6,8,10],yTicks:[0,5,10,15,20,25,30,35,40],xLabel:'energy supplied, ΔE (kJ)',yLabel:'mass melted, Δm (g)',W:560,H:340};
function meltGraph(){
  const g0=lineGraph(Object.assign({points:[[0,0]]},GM));
  return lineGraph(Object.assign({label:'Mass melted against energy supplied for solids P and Q',segments:[{pts:[[0,0],[10,40]],cls:'g-line-c'},{pts:[[0,0],[10,20]],cls:'g-line-b'}],
    extra:lab(g0,'P',9.3,40)+lab(g0,'Q',10,20+3)},GM)).svg;
}
{
  const body=act('graphs','Calculate','The axes the other way round','This graph has the mass melted up the side. Solids P and Q are each melted at their melting point by a heater with a joulemeter. Read your answers off the graph.');
  const split=mk('div','graph-split');body.appendChild(split);
  split.appendChild(mk('div','graph-box',meltGraph()));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'Solid P: what mass melts when 5 kJ is supplied?',unit:'g',answer:20,working:'Read up from 5 kJ to line P, then across.<br>Δm = 20 g'},
    {q:'Solid Q: use the point at 10 kJ to find its L<sub>f</sub>.',unit:'kJ kg⁻¹',answer:500,working:'At 10 kJ, Δm = 20 g = 0.020 kg<br>ΔE = LΔm<br>10 000 = L<sub>f</sub> × 0.020<br>L<sub>f</sub> = [[10 000|0.020]]<br>L<sub>f</sub> = 500 000 J kg⁻¹<br>L<sub>f</sub> = 500 kJ kg⁻¹'}
  ]});
}
{
  const body=act('graphs','Predict','Steeper, with the axes swapped','');
  createPredict({host:body,q:'On this graph, which solid has the bigger specific latent heat of fusion, P or Q?',options:[
    {text:'Q: it melts less for each kilojoule',correct:true},
    {text:'P: its line is the steeper of the two',why:'With mass up the side, a steeper line means more grams melted for each kilojoule: less energy for each gram.'},
    {text:'P: more of it melts, so it holds more energy',why:'More melting for the same energy means each gram needs less energy, so P’s L<sub>f</sub> is smaller.'},
    {text:'Neither: both were given the same energy',why:'They were, but Q melted only half as much, so each gram of Q needed twice the energy.'}
  ],explain:'With mass up the side, gradient = [[Δm|ΔE]] = [[1|L]]. The less steep line has the bigger L<sub>f</sub>: Q (500 kJ kg⁻¹) against P (250 kJ kg⁻¹).'});
}
{
  const body=act('graphs','Predict','Is steeper always bigger L?','');
  createPredict({host:body,q:'Nicholas says, “On these graphs, the steeper line always has the bigger specific latent heat.” Is he right?',options:[
    {text:'Only when energy is plotted up the side',correct:true},
    {text:'Yes, on every graph of these two quantities',why:'On the second graph, with mass up the side, the steeper line (P) has the smaller L<sub>f</sub>.'},
    {text:'Only when the mass is plotted up the side',why:'With mass up the side, the gradient is 1/L, so a steeper line means a smaller L.'},
    {text:'No: L cannot be found from a graph at all',why:'It can: from the gradient (energy up the side) or from [[1|gradient]] (mass up the side).'}
  ],explain:'Always check the axes. Energy up the side: gradient = L, so steeper means bigger L. Mass up the side: gradient = 1/L, so steeper means smaller L.'});
}

/* ================= 7. CALCULATE ================= */
{
  const body=act('calculate','Calculate','Using ΔE = LΔm and ΔE = mcΔθ','Give each answer in the unit shown. L<sub>f</sub> of ice = 3.34 × 10⁵ J kg⁻¹, L<sub>v</sub> of water = 2.26 × 10⁶ J kg⁻¹, c of ice = 2100 J kg⁻¹ K⁻¹.');
  createCalc({host:body,questions:[
    {q:'How much energy melts 0.25 kg of ice at 0 °C?',unit:'J',answer:83500,working:'ΔE = LΔm<br>ΔE = 3.34 × 10⁵ × 0.25<br>ΔE = 83 500 J'},
    {q:'A 60 W heater keeps water boiling for 5.0 minutes. What mass of water boils away?',unit:'g',answer:7.96,working:'ΔE = P × t<br>ΔE = 60 × 300<br>ΔE = 18 000 J<br>ΔE = LΔm<br>18 000 = 2.26 × 10⁶ × Δm<br>Δm = [[18 000|2.26 × 10⁶]]<br>Δm = 0.00796 kg = 7.96 g'},
    {q:'How much energy turns 0.20 kg of ice at −10 °C into water at 0 °C?',unit:'J',answer:71000,working:'warm the ice: ΔE = mcΔθ<br>ΔE = 0.20 × 2100 × 10<br>ΔE = 4200 J<br>melt it: ΔE = LΔm<br>ΔE = 3.34 × 10⁵ × 0.20<br>ΔE = 66 800 J<br>total = 4200 + 66 800<br>total = 71 000 J'},
    {q:'A joulemeter reads 30 000 J. The heated funnel gives 95.0 g of water and the control 5.0 g. Find L<sub>f</sub>.',unit:'kJ kg⁻¹',answer:333,working:'Δm = 95.0 − 5.0<br>Δm = 90.0 g = 0.0900 kg<br>ΔE = LΔm<br>30 000 = L<sub>f</sub> × 0.0900<br>L<sub>f</sub> = [[30 000|0.0900]]<br>L<sub>f</sub> = 333 000 J kg⁻¹ = 333 kJ kg⁻¹'}
  ]});
}
{
  const body=act('calculate','Spot the error','Find the mistake','Each answer has exactly one mistake, made while rearranging. Every line after it is worked correctly from it. Click the line with the mistake.');
  const grid=mk('div','');body.appendChild(grid);
  createSpot({host:grid,scenario:'A heater supplies 9040 J to boiling water. What mass boils away? (L<sub>v</sub> = 2.26 × 10⁶ J kg⁻¹)',
    lines:['ΔE = LΔm','9040 = 2.26 × 10⁶ × Δm','Δm = 9040 × 2.26 × 10⁶','Δm = 2.04 × 10¹⁰ kg'],wrong:2,
    explain:'Δm is multiplied by 2.26 × 10⁶, so divide 9040 by it. Twenty billion kilograms from one small heater is far too much.',
    fix:['Δm = [[9040|2.26 × 10⁶]]','Δm = 0.004 kg']});
  createSpot({host:grid,scenario:'A joulemeter reads 26 720 J. The heated funnel gives 0.0850 kg of water and the control 0.0050 kg. Find L<sub>f</sub>.',
    lines:['Δm = 0.0850 − 0.0050','Δm = 0.0800 kg','ΔE = LΔm','26 720 = L × 0.0800','L = [[0.0800|26 720]]','L = 2.99 × 10⁻⁶ J kg⁻¹'],wrong:4,
    explain:'L is multiplied by 0.0800, so divide 26 720 by 0.0800. The fraction has been turned upside down.',
    fix:['L = [[26 720|0.0800]]','L = 3.34 × 10⁵ J kg⁻¹']});
  createSpot({host:grid,scenario:'25 200 J is supplied to 1.2 kg of water (c = 4200 J kg⁻¹ K⁻¹). What is its rise in temperature?',
    lines:['ΔE = mcΔθ','25 200 = 1.2 × 4200 × Δθ','25 200 = 5040 × Δθ','Δθ = 25 200 − 5040','Δθ = 20 160 K'],wrong:3,
    explain:'Δθ is multiplied by 5040, so divide 25 200 by 5040. Taking 5040 away does not undo a multiplication.',
    fix:['Δθ = [[25 200|5040]]','Δθ = 5.0 K']});
}

/* ================= 8. ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Better results or safer?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'Better results',hint:'More accurate or more useful readings',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps people safe',hint:'Protects people and equipment',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Wait until both funnels drip steadily before starting',cat:'a'},
    {id:'2',text:'Use crushed ice, packed round the heater',cat:'a'},
    {id:'3',text:'Set up a control funnel with its heater switched off',cat:'a'},
    {id:'4',text:'Lag the beaker of boiling water',cat:'a'},
    {id:'5',text:'Find L from the gradient of ΔE against Δm',cat:'a'},
    {id:'6',text:'Keep water away from the power supply and its plugs',cat:'s'},
    {id:'7',text:'Only switch the heater on when it is in the ice or water',cat:'s'},
    {id:'8',text:'Keep hands and faces away from the steam',cat:'s'},
    {id:'9',text:'Let the heater cool down before you touch it',cat:'s'}
  ]});
}
{
  const body=act('accuracy','Predict','Why is L<sub>v</sub> too high?','');
  createPredict({host:body,q:'Amelia finds L<sub>v</sub> = 2.6 × 10⁶ J kg⁻¹. The accepted value is 2.26 × 10⁶ J kg⁻¹. What is the most likely reason?',options:[
    {text:'Energy was lost from the beaker to the room',correct:true},
    {text:'The water was boiling before she started',why:'That is what she should do. It means every joule counted goes into boiling, not warming.'},
    {text:'Some steam condensed back into the beaker',why:'Then the beaker would lose less mass for the energy counted, but drops on the inside are tiny. Energy lost to the room is far bigger.'},
    {text:'The joulemeter counted less than was supplied',why:'Too little energy counted would make ΔE too small, and L<sub>v</sub> too low, not too high.'}
  ],explain:'Some of the energy supplied heats the beaker and the air round it instead of boiling water. So less water boils away than the energy counted, Δm is too small, and L = [[ΔE|Δm]] comes out too high. Lagging the beaker cuts this.'});
}
{
  const body=act('accuracy','Predict','No control funnel','');
  createPredict({host:body,q:'Nicholas uses only one funnel, with no control. How does his value of L<sub>f</sub> compare with the accepted value?',options:[
    {text:'Too low: the room melted some of his ice',correct:true},
    {text:'Too high: the room cooled his funnel down',why:'The room is warmer than 0 °C, so it melts some ice; it does not cool the funnel.'},
    {text:'The same: the control only helps with safety',why:'The control is about accuracy. It measures the ice melted by the room so it can be taken off.'},
    {text:'Too low: the heater melted less ice than it should',why:'The heater melted the right amount. The extra water came from the room, making Δm too big.'}
  ],explain:'Without a control, the water melted by the room is counted as if the heater melted it. Δm is too big for the energy counted, so L<sub>f</sub> = [[ΔE|Δm]] comes out too low.'});
}

/* ================= EXAM PRACTICE ================= */
{
  const body=act('exam','Exam style','The specific latent heat of vaporisation of water','Rose keeps a beaker of water boiling with an immersion heater, on a balance. When it is boiling steadily she resets the joulemeter and starts taking readings. One reading is missing.');
  body.appendChild(sTable(['Time (min)','0','2','4','6','8'],[['ΔE (kJ)','0','6.0','12.0','18.0','24.0'],['Balance (g)','412.6','410.0','407.4','<b>?</b>','402.2']]));
  body.appendChild(mk('p','sub','(a) 1 mark'));
  createCalc({host:body,questions:[
    {q:'Rose forgot to write down the balance reading at 6 minutes. Predict the missing reading.',unit:'g',answer:404.8,working:'The balance reading falls 2.6 g every 2 minutes.<br>reading at 6 min = 407.4 − 2.6<br>reading at 6 min = 404.8 g'}
  ]});
  body.appendChild(mk('p','sub','(b) 3 marks'));
  createCalc({host:body,questions:[
    {q:'Use the readings from 0 to 8 minutes to find the specific latent heat of vaporisation of water.',unit:'kJ kg⁻¹',answer:2310,working:'Δm = 412.6 − 402.2<br>Δm = 10.4 g = 0.0104 kg<br>ΔE = 24 000 J<br>ΔE = LΔm<br>24 000 = L<sub>v</sub> × 0.0104<br>L<sub>v</sub> = [[24 000|0.0104]]<br>L<sub>v</sub> = 2.31 × 10⁶ J kg⁻¹ = 2310 kJ kg⁻¹'}
  ]});
  body.appendChild(mk('p','sub','(c) 2 marks'));
  body.appendChild(mk('p','','The accepted value is 2.26 × 10⁶ J kg⁻¹. Explain why Rose’s value is higher. Write your answer, then check it.'));
  const d1=mk('details','');
  d1.innerHTML=FR('<summary>Check your answer</summary><div><ul><li>Some of the energy supplied is transferred to the beaker and the surroundings, not to boiling water.</li><li>So less mass boils away than the energy counted would boil.</li><li>Δm is too small, so L = [[ΔE|Δm]] is too big.</li></ul></div>');
  body.appendChild(d1);
  body.appendChild(mk('p','sub','(d) 2 marks'));
  body.appendChild(mk('p','','Explain why Rose waits until the water is boiling steadily before she resets the joulemeter.'));
  const d2=mk('details','');
  d2.innerHTML='<summary>Check your answer</summary><div><ul><li>Before it boils, energy is used to raise the temperature of the water.</li><li>Once it is boiling, all the energy counted goes into changing water into steam, so ΔE matches the mass boiled away.</li></ul></div>';
  body.appendChild(d2);
  body.appendChild(mk('p','sub','(e) 3 marks'));
  body.appendChild(mk('p','','While the water boils, the heater keeps supplying energy but the temperature stays at 100 °C. Explain this in terms of the molecules.'));
  const d3=mk('details','');
  d3.innerHTML='<summary>Check your answer</summary><div><ul><li>The energy is used to break the bonds between the water molecules / separate the molecules.</li><li>This increases the potential energy of the molecules (their internal energy increases).</li><li>The mean kinetic energy of the molecules does not change, so the temperature stays the same.</li></ul></div>';
  body.appendChild(d3);
  body.appendChild(mk('p','sub','(f) 6 marks'));
  body.appendChild(mk('p','','Describe how Rose could find the specific latent heat of fusion of ice, with crushed ice, two funnels, two immersion heaters and a joulemeter. Explain why she needs two funnels.'));
  const d4=mk('details','');
  d4.innerHTML=FR('<summary>Check your answer</summary><div><ul><li>Put crushed ice and an immersion heater in each funnel, with a beaker under each.</li><li>Connect one heater to the supply through the joulemeter; leave the other switched off (the control).</li><li>Wait until water drips steadily from both, so the ice is at 0 °C, then put empty beakers under them.</li><li>Reset the joulemeter, switch on and time a fixed period.</li><li>Read the joulemeter (ΔE) and measure the mass of water in each beaker on a balance.</li><li>Δm = mass from the heated funnel − mass from the control.</li><li>L<sub>f</sub> = [[ΔE|Δm]]</li><li>The control measures the ice melted by the room, which also melts ice in the heated funnel; taking it off leaves only the ice melted by the heater.</li><li>Repeat for different times and plot ΔE against Δm: the gradient is L<sub>f</sub>.</li></ul></div>');
  body.appendChild(d4);
}
