/* ================= 1. OVERVIEW ================= */
{
  const body=act('overview','Fill in the blanks','The practical in one passage','Drag a word into each gap, or tap a word and then tap a gap. Some words are not needed.');
  const parts=[
    'Put crushed ice and a thermometer in a beaker, and heat it gently in a ',['b1','water bath'],'. ',['b2','Stir'],' the ice all the time, and read the thermometer every ',['b3','minute'],
    ', timed with a stopwatch. Plot temperature against ',['b4','time'],'. While the ice melts, the temperature stays ',['b5','constant'],' at ',['b6','0 °C'],
    ': the energy supplied overcomes the ',['b7','forces between the particles'],' instead of raising the temperature. Once all the ice has melted, the temperature ',['b8','rises'],
    ' again. In the solid the particles ',['b9','vibrate'],' about fixed positions; in the liquid they ',['b10','slide past each other'],'. Stearic acid can be used instead: as it cools, its temperature stays constant while it ',['b11','freezes'],'.'
  ];
  const cloze=mk('div','cloze'),slots=[],chips=[];
  parts.forEach(p=>{
    if(typeof p==='string')cloze.appendChild(document.createTextNode(p));
    else{const s=mk('span','blank');cloze.appendChild(s);slots.push({id:p[0],el:s,answer:p[1]});chips.push({id:'c-'+p[0],text:p[1]});}
  });
  ['100 °C','falls','expand','mass of the particles'].forEach((t,i)=>chips.push({id:'d'+i,text:t}));
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
    {id:'a',text:'Half fill a beaker with crushed ice. Put a thermometer in it, with the bulb in the middle of the ice, not touching the glass.'},
    {id:'b',text:'Stand the beaker in a larger beaker of water on a tripod and gauze, over a Bunsen burner.'},
    {id:'c',text:'Read the starting temperature of the ice.'},
    {id:'d',text:'Light the Bunsen burner, with a gentle flame, and start the stopwatch.'},
    {id:'e',text:'Stir the ice all the time and read the thermometer every minute.'},
    {id:'f',text:'Carry on until all the ice has melted and the water has warmed for several minutes.'},
    {id:'g',text:'Plot a graph of temperature against time.'}
  ],constraints:[['a','c'],['b','d'],['c','d'],['d','e'],['e','f'],['f','g']],
  why:'The starting temperature is read before heating begins, and you need readings past the end of melting to see the whole shape of the graph.'});
}
{
  const body=act('method','Match','What each piece of equipment is for','Pair each piece of equipment with its job. Drag one card onto the other, or tap one card and then the other.');
  createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'i',l:'Crushed ice',r:'Small pieces pack round the thermometer bulb and melt evenly'},
    {id:'w',l:'Beaker of water (water bath)',r:'Heats the ice gently and from all sides'},
    {id:'s',l:'Stirring rod',r:'Keeps the temperature the same all through the beaker'},
    {id:'t',l:'Thermometer',r:'Measures the temperature of the ice and water'},
    {id:'c',l:'Stopwatch',r:'Times the interval between readings'},
    {id:'m',l:'Heatproof mat',r:'Protects the bench from the Bunsen burner'}
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
    {id:'1',text:'The time since heating started',cat:'i'},
    {id:'2',text:'The temperature of the ice and water',cat:'d'},
    {id:'3',text:'The reading on the thermometer',cat:'d'},
    {id:'4',text:'The mass of ice in the beaker',cat:'c'},
    {id:'5',text:'The size of the Bunsen flame',cat:'c'},
    {id:'6',text:'Where the thermometer bulb sits in the ice',cat:'c'},
    {id:'7',text:'How often the ice is stirred',cat:'c'}
  ]});
}
{
  const body=act('variables','Predict','A new question to test','');
  createPredict({host:body,q:'Ali wants to find out whether adding salt to ice changes the temperature it melts at. What is his independent variable?',options:[
    {text:'The mass of salt he adds to the ice',correct:true},
    {text:'The time since he started heating',why:'Time is the independent variable for one graph. To answer his question he changes the amount of salt and compares the graphs.'},
    {text:'The temperature at which the ice melts',why:'That is what he measures from each graph, so it is the dependent variable.'},
    {text:'The mass of ice in the beaker',why:'He should keep the mass of ice the same for every test, so it is a control variable.'}
  ],explain:'The independent variable is the one he changes on purpose: the mass of salt. For each mass he heats the same mass of ice in the same way, and reads the melting temperature off the flat part of the graph.'});
}
{
  const body=act('variables','Predict','Why crushed ice?','');
  createPredict({host:body,q:'Why should Zahra use crushed ice rather than a few large ice cubes?',options:[
    {text:'Small pieces surround the bulb, so it reads the ice temperature',correct:true},
    {text:'Crushed ice melts at a lower temperature than ice cubes',why:'Ice melts at 0 °C however big the pieces are. Crushing it only helps the thermometer and the heating.'},
    {text:'Crushed ice has a bigger mass, so it takes longer to melt',why:'Crushing does not change the mass. The same mass of ice needs the same energy to melt.'},
    {text:'Large cubes would make the water boil before they melt',why:'The water bath heats gently. The problem with large cubes is the gaps of warm water round the thermometer.'}
  ],explain:'With large cubes the thermometer sits in gaps of meltwater, which can be warmer than the ice. Crushed ice packs round the bulb and melts evenly, so the reading is the temperature of the melting ice.'});
}

/* ================= 4. EXPERIMENT ================= */
{
  act('experiment','Your turn','Take your own readings','Press Experiment. Heat the crushed ice with a reading every minute, then try 30 s and 2 minutes. Then cool the stearic acid. For each one, what is the melting or freezing point, how long does the temperature stay constant, and which interval shows the flat part best?');
}
frameAct('experiment','animations/heating-curve.html','','Heating curve animation: the temperature–time graph and the particles together','heating curve',false);
{
  const body=act('experiment','Sort','Solid, liquid or gas?','Sort each description of the particles into the right state, then press Check.');
  createSortGame({host:body,cats:[
    {id:'s',label:'Solid',hint:'',color:'--c1',soft:'--c1-soft'},
    {id:'l',label:'Liquid',hint:'',color:'--c3',soft:'--c3-soft'},
    {id:'g',label:'Gas',hint:'',color:'--c2',soft:'--c2-soft'}
  ],items:[
    {id:'1',text:'Particles touching, in a regular pattern',cat:'s'},
    {id:'2',text:'Particles vibrate about fixed positions',cat:'s'},
    {id:'3',text:'Particles touching, but with no regular pattern',cat:'l'},
    {id:'4',text:'Particles slide past each other',cat:'l'},
    {id:'5',text:'Particles far apart, randomly arranged',cat:'g'},
    {id:'6',text:'Particles move quickly in all directions',cat:'g'}
  ]});
}
{
  const body=act('experiment','Predict','While the ice melts','');
  createPredict({host:body,q:'The temperature stays at 0 °C while the ice melts, but the Bunsen burner is still supplying energy. What happens to the particles?',options:[
    {text:'The energy overcomes the forces holding them in place',correct:true},
    {text:'They move faster, so the temperature goes up',why:'The temperature stays at 0 °C, so the particles’ average speed does not change while the ice melts.'},
    {text:'They stop vibrating and lose energy',why:'Energy is going in, not out. The particles gain energy as they break free of their fixed positions.'},
    {text:'They get bigger, so the ice turns to water',why:'Particles do not change size when a substance melts. Their arrangement and motion change.'}
  ],explain:'Heating changes the energy stored in the ice. While it melts, the energy breaks the particles free of their fixed positions instead of making them move faster, so the temperature stays constant until all the ice has melted.'});
}
{
  const body=act('experiment','Predict','Evaporating or boiling?','');
  createPredict({host:body,q:'A puddle dries up on a cool day, when the air is at 15 °C. What happened to the water?',options:[
    {text:'Fast particles escaped from its surface: it evaporated',correct:true},
    {text:'It boiled, because the Sun heated it a little',why:'Water boils at 100 °C, with bubbles forming all through the liquid. A puddle at 15 °C is far below that.'},
    {text:'Its particles shrank until they could not be seen',why:'Particles do not shrink. They escape from the surface and spread out as a gas.'},
    {text:'It melted into the air above the puddle',why:'Melting is solid to liquid. Liquid to gas below the boiling point is evaporation.'}
  ],explain:'Evaporation happens at any temperature, only from the surface: the fastest particles escape. Boiling happens at the boiling point, all through the liquid.'});
}

/* ================= 5. RESULTS ================= */
const ICE=[[0,-8],[1,-4],[2,0],[3,0],[4,0],[5,0],[6,0],[7,3],[8,6],[9,9]];
function iceTable(){
  const t=mk('div','table-scroll');
  t.innerHTML='<table class="units res-tbl"><thead><tr><th>Time (min)</th>'+ICE.map(r=>'<th>'+r[0]+'</th>').join('')+'</tr></thead><tbody><tr><th>Temperature (°C)</th>'+ICE.map(r=>'<td>'+String(r[1]).replace('-','−')+'</td>').join('')+'</tr></tbody></table>';
  return t;
}
{
  const body=act('results','Calculate','Read Sophie’s results','Sophie heated crushed ice and read the thermometer every minute. Use her table to answer.');
  body.appendChild(iceTable());
  createCalc({host:body,questions:[
    {q:'By how much did the temperature rise in the first 2 minutes?',unit:'°C',answer:8,working:'temperature rise = final temperature − starting temperature<br>temperature rise = 0 − (−8)<br>temperature rise = 8 °C'},
    {q:'At what temperature did the ice melt?',unit:'°C',answer:0,working:'The temperature stays constant at 0 °C from 2 to 6 minutes.<br>melting point = 0 °C'},
    {q:'For how many minutes did the readings stay at 0 °C?',unit:'min',answer:4,working:'first reading at 0 °C: 2 min<br>last reading at 0 °C: 6 min<br>time = 6 − 2<br>time = 4 min'},
    {q:'Once the ice had all melted, how much did the temperature rise each minute?',unit:'°C',answer:3,working:'From 6 to 9 minutes, the temperature rises from 0 °C to 9 °C.<br>rise each minute = [[9 − 0|9 − 6]]<br>rise each minute = 3 °C'}
  ]});
}
{
  const body=act('results','Plot','Plot Sophie’s results','Plot each point from Sophie’s table as a small cross. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');
  createPlot({host:body,
    points:ICE.map(r=>({x:r[0],y:r[1]})),
    rowText:p=>p.x+' min, '+String(p.y).replace('-','−')+' °C',
    graph:{xMin:0,xMax:10,yMin:-10,yMax:10,xTicks:[0,2,4,6,8,10],yTicks:[-10,-5,0,5,10],minor:[0.5,1],snap:[0.5,1],xLabel:'time (min)',yLabel:'temperature (°C)',W:560,H:340}});
}
{
  const body=act('results','Predict','The line of best fit','');
  createPredict({host:body,q:'What line should Sophie draw through her plotted points?',options:[
    {text:'Straight lines: rising, then flat at 0 °C, then rising again',correct:true},
    {text:'One smooth curve from the first point to the last one',why:'A smooth curve would cut the corners and hide the flat part, which is the whole point of the graph.'},
    {text:'One straight line of best fit through all of the points',why:'The points are not on one straight line. Forcing one through them hides the constant temperature while melting.'},
    {text:'Short straight lines from each point to the next one',why:'Joining the dots follows every small reading error. Draw lines that follow the trend of each part.'}
  ],explain:'The graph has three parts: the ice warming, a flat part at 0 °C while it melts, and the water warming. Draw a line of best fit for each part, meeting at the corners.'});
}
{
  const body=act('results','Predict','What the flat part shows','');
  createPredict({host:body,q:'From 2 to 6 minutes Sophie’s readings stay at 0 °C. What does this show?',options:[
    {text:'The ice was melting, and all the energy went into melting it',correct:true},
    {text:'The Bunsen burner went out for four minutes',why:'The burner stayed on: the energy supplied was being used to melt the ice, not to warm it.'},
    {text:'The thermometer stopped working until the ice melted',why:'The thermometer was working. The ice really was at 0 °C the whole time it was melting.'},
    {text:'The ice had all melted by 2 minutes and stopped heating up',why:'At 2 minutes the ice had only just started to melt. It finished at about 6 minutes, when the temperature began to rise.'}
  ],explain:'A flat part on a heating curve means a change of state. The energy supplied overcomes the forces between the particles, so the temperature stays at the melting point until all the solid has melted.'});
}
{
  const body=act('results','Predict','An anomalous result','');
  createPredict({host:body,q:'Ali’s results are below. Which reading is anomalous, and what is the most likely cause?',
    pre:'<div class="table-scroll"><table class="units res-tbl"><thead><tr><th>Time (min)</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr></thead><tbody><tr><th>Temperature (°C)</th><td>−6</td><td>−2</td><td>0</td><td>0</td><td>3</td><td>0</td><td>2</td></tr></tbody></table></div>',
    options:[
    {text:'4 min: the thermometer may have touched the hot glass',correct:true},
    {text:'6 min: the ice cannot have melted by then',why:'The ice can finish melting at any time. A rise once it has all melted is expected, so 2 °C at 6 minutes fits.'},
    {text:'2 min: the ice cannot reach 0 °C so quickly',why:'The ice warmed 4 °C in the first minute, so reaching 0 °C during the second minute fits the pattern.'},
    {text:'None: every reading fits a smooth heating curve',why:'At 4 minutes the temperature jumps to 3 °C, then falls back to 0 °C. That breaks the pattern while the ice is melting.'}
  ],explain:'While there is still ice, the temperature should stay at 0 °C. The 3 °C reading sits between two 0 °C readings, so it is anomalous: probably the bulb touched the warm bottom of the beaker, or the ice was not stirred. Repeat it if you can, and leave it out of the line.'});
}

/* ================= 6. GRAPHS ================= */
const GW={xMin:0,xMax:20,yMin:20,yMax:100,xTicks:[0,4,8,12,16,20],yTicks:[20,40,60,80,100],xLabel:'time (min)',yLabel:'temperature (°C)',W:560,H:340};
function lab(g0,t,x,y){return '<circle cx="'+g0.gx(x)+'" cy="'+g0.gy(y)+'" r="13" fill="var(--panel)" stroke="var(--ink)" stroke-width="2"/><text x="'+g0.gx(x)+'" y="'+(g0.gy(y)+5)+'" text-anchor="middle" font-size="14" fill="var(--ink)">'+t+'</text>';}
function waxGraph(){
  const P=[[0,25],[6,55],[14,55],[20,85]];
  const g0=lineGraph(Object.assign({points:[[0,25]]},GW));
  return lineGraph(Object.assign({label:'Temperature against time for a heated solid',points:P,extra:lab(g0,'A',3,40)+lab(g0,'B',10,55)+lab(g0,'C',17,70)},GW)).svg;
}
{
  const body=act('graphs','Calculate','Read the graph','Zahra heats a solid wax gently and records its temperature. Read your answers off the graph.');
  const split=mk('div','graph-split');body.appendChild(split);
  split.appendChild(mk('div','graph-box',waxGraph()));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'What is the melting point of the wax?',unit:'°C',answer:55,working:'The flat part of the graph is at 55 °C.<br>melting point = 55 °C'},
    {q:'How long does the wax take to melt?',unit:'min',answer:8,working:'The flat part runs from 6 min to 14 min.<br>time = 14 − 6<br>time = 8 min'},
    {q:'In part A, how much does the temperature rise each minute?',unit:'°C',answer:5,working:'From 0 to 6 min the temperature rises from 25 °C to 55 °C.<br>rise each minute = [[55 − 25|6 − 0]]<br>rise each minute = [[30|6]]<br>rise each minute = 5 °C'},
    {q:'What temperature does the wax reach after 18 minutes?',unit:'°C',answer:75,working:'In part C the temperature rises 30 °C in 6 minutes: 5 °C each minute.<br>temperature at 18 min = 55 + 5 × (18 − 14)<br>temperature at 18 min = 55 + 20<br>temperature at 18 min = 75 °C'}
  ]});
}
{
  const body=act('graphs','Predict','Which part?','');
  createPredict({host:body,q:'Look at the graph above. In which part are the wax particles sliding past each other and moving faster and faster?',options:[
    {text:'Part C: the wax is a liquid and getting hotter',correct:true},
    {text:'Part A: the temperature is rising there too',why:'In part A the wax is still solid, so its particles vibrate about fixed positions; they do not slide past each other.'},
    {text:'Part B: the wax is turning into a liquid',why:'In part B the particles are breaking free, but the temperature is constant, so they are not getting faster.'},
    {text:'None: wax particles never slide past each other',why:'Once wax has melted it is a liquid, and in a liquid the particles slide past each other.'}
  ],explain:'Part A: solid warming, particles vibrate faster. Part B: melting at constant temperature. Part C: liquid warming, particles slide past each other and move faster as the temperature rises.'});
}
{
  const body=act('graphs','Predict','Twice as much wax','');
  createPredict({host:body,q:'Zahra repeats the test with twice the mass of wax, heated in the same way. How does the flat part of her graph change?',options:[
    {text:'Same temperature, but it lasts about twice as long',correct:true},
    {text:'It moves up to a higher temperature',why:'The melting point belongs to the substance. More wax melts at the same 55 °C.'},
    {text:'It lasts the same time at the same temperature',why:'Twice the mass needs twice the energy to melt, and the heater supplies energy at the same rate, so it takes longer.'},
    {text:'It disappears, as the extra wax melts slowly',why:'Any pure solid has a flat part while it melts. More wax makes the flat part longer, not missing.'}
  ],explain:'The melting point depends only on the substance, so the flat part stays at 55 °C. Twice the mass needs twice as much energy to melt, so with the same heating it lasts about twice as long.'});
}
const GC={xMin:0,xMax:14,yMin:40,yMax:90,xTicks:[0,2,4,6,8,10,12,14],yTicks:[40,50,60,70,80,90],xLabel:'time (min)',yLabel:'temperature (°C)',W:560,H:340};
function coolGraph(){
  const P=[];for(let t=0;t<=14.001;t+=0.25){P.push([t,t<2?20+65*Math.exp(-t*Math.log(65/49)/2):t<8?69:20+49*Math.exp(-(t-8)/7)]);}
  return lineGraph(Object.assign({label:'Temperature against time for cooling stearic acid',points:P},GC)).svg;
}
{
  const body=act('graphs','Calculate','A cooling curve','Ali melts some stearic acid, then lets it cool in its boiling tube. Read your answers off his graph.');
  const split=mk('div','graph-split');body.appendChild(split);
  split.appendChild(mk('div','graph-box',coolGraph()));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'What is the freezing point of stearic acid?',unit:'°C',answer:69,working:'The flat part of the graph is at 69 °C.<br>freezing point = 69 °C'},
    {q:'How long does the stearic acid take to freeze?',unit:'min',answer:6,working:'The flat part runs from 2 min to 8 min.<br>time = 8 − 2<br>time = 6 min'}
  ]});
}
{
  const body=act('graphs','Predict','Cooling but not falling','');
  createPredict({host:body,q:'From 2 to 8 minutes the stearic acid is still losing energy to the air, yet its temperature stays at 69 °C. Why?',options:[
    {text:'Energy is released as the liquid turns to solid',correct:true},
    {text:'The air around the tube is also at 69 °C',why:'The room is much cooler than 69 °C, so the acid keeps losing energy. Something must replace that energy.'},
    {text:'The particles stop moving while it freezes',why:'Particles in a solid still vibrate. They settle into fixed positions; they do not stop.'},
    {text:'Stearic acid cannot cool below its melting point',why:'After 8 minutes it does cool below 69 °C, once it has all turned solid.'}
  ],explain:'As the particles settle into fixed positions, energy is released. This balances the energy lost to the surroundings, so the temperature stays at the freezing point until all the acid is solid.'});
}
{
  const body=act('graphs','Predict','Melting point or freezing point?','');
  createPredict({host:body,q:'Ali also heats some solid stearic acid until it melts. At what temperature is the flat part of that heating curve?',options:[
    {text:'69 °C: it melts and freezes at the same temperature',correct:true},
    {text:'Above 69 °C: melting needs a higher temperature',why:'A pure substance melts and freezes at the same temperature. Only the direction of the energy transfer is different.'},
    {text:'Below 69 °C: solids melt before they get that hot',why:'The solid has to warm all the way up to its melting point before it starts to melt.'},
    {text:'There is no flat part when a solid is heated',why:'Any pure solid has a flat part while it melts, just as the liquid had one while it froze.'}
  ],explain:'The melting point and the freezing point of a pure substance are the same temperature. Heating, the flat part is melting; cooling, the flat part is freezing.'});
}

/* ================= 7. CALCULATE ================= */
{
  const body=act('calculate','Calculate','Rates, times and readings','Give each answer in the unit shown. The rate of temperature rise is the temperature rise each minute.');
  createCalc({host:body,questions:[
    {q:'After the ice melts, the water warms from 0 °C to 18 °C in 6 minutes. What is the rate of temperature rise?',unit:'°C per min',answer:3,working:'rate = [[temperature rise|time]]<br>rate = [[18 − 0|6]]<br>rate = 3 °C per min'},
    {q:'Stearic acid cools at 2.5 °C per minute. How long does it take to cool from 84 °C to its freezing point of 69 °C?',unit:'min',answer:6,working:'rate = [[temperature fall|time]]<br>2.5 = [[84 − 69|time]]<br>2.5 = [[15|time]]<br>2.5 × time = 15<br>time = [[15|2.5]]<br>time = 6 min'},
    {q:'The ice stays at 0 °C from 2.5 minutes to 9 minutes. For how many seconds is that?',unit:'s',answer:390,working:'time = 9 − 2.5<br>time = 6.5 min<br>time = 6.5 × 60<br>time = 390 s'},
    {q:'Zahra reads the thermometer every 30 s, from 0 s up to and including 12 minutes. How many readings does she take?',unit:'readings',answer:25,working:'12 minutes = 720 s<br>number of intervals = [[720|30]]<br>number of intervals = 24<br>number of readings = 24 + 1<br>number of readings = 25'}
  ]});
}
{
  const body=act('calculate','Spot the error','Find the mistake','Each answer has exactly one mistake, made while rearranging. Every line after it is worked correctly from it. Click the line with the mistake.');
  const grid=mk('div','');body.appendChild(grid);
  createSpot({host:grid,scenario:'Liquid wax cools at 2.5 °C per minute. How long does it take to cool by 15 °C?',
    lines:['rate = [[temperature fall|time]]','2.5 = [[15|time]]','2.5 × time = 15','time = 15 × 2.5','time = 37.5 min'],wrong:3,
    explain:'Line 3 is right: 2.5 × time = 15. To get time on its own, divide 15 by 2.5; multiplying gives a far longer time than it could take.',
    fix:['time = [[15|2.5]]','time = 6 min']});
  createSpot({host:grid,scenario:'Water warms at 3 °C per minute. By how much does its temperature rise in 4 minutes?',
    lines:['rate = [[temperature rise|time]]','3 = [[temperature rise|4]]','temperature rise = [[3|4]]','temperature rise = 0.75 °C'],wrong:2,
    explain:'To get the temperature rise on its own, multiply both sides by 4. Dividing 3 by 4 gives less than one minute’s rise.',
    fix:['temperature rise = 3 × 4','temperature rise = 12 °C']});
}

/* ================= 8. ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Better results or safer?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'Better results',hint:'More accurate or more useful readings',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps people safe',hint:'Protects people and equipment',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Stir the ice and water all the time',cat:'a'},
    {id:'2',text:'Keep the thermometer bulb off the bottom of the beaker',cat:'a'},
    {id:'3',text:'Read the thermometer with your eye level with the liquid',cat:'a'},
    {id:'4',text:'Take readings at short, regular intervals',cat:'a'},
    {id:'5',text:'Wear safety goggles',cat:'s'},
    {id:'6',text:'Stand the tripod on a heatproof mat',cat:'s'},
    {id:'7',text:'Tie long hair back near the Bunsen burner',cat:'s'},
    {id:'8',text:'Let the tripod and gauze cool before you touch them',cat:'s'}
  ]});
}
{
  const body=act('accuracy','Predict','The bottom of the beaker','');
  createPredict({host:body,q:'Why should the thermometer bulb be kept off the bottom of the beaker?',options:[
    {text:'The glass there is hotter than the ice, so readings would be too high',correct:true},
    {text:'The thermometer could crack the bottom of the beaker',why:'That is unlikely. The real problem is that the glass next to the hot water bath is warmer than the ice.'},
    {text:'The bottom of the beaker is colder, so readings would be too low',why:'The hot water bath warms the glass, so the bottom of the beaker is warmer than the ice, not colder.'},
    {text:'Ice cannot reach the bottom, so there would be no reading',why:'The ice does reach the bottom. The bulb must measure the ice, not the warmer glass.'}
  ],explain:'The glass is in contact with the hot water bath, so it is warmer than the melting ice. A bulb touching it reads too high. Keep the bulb in the middle of the ice and keep stirring.'});
}
{
  const body=act('accuracy','Predict','Rounded corners','');
  createPredict({host:body,q:'In real results the graph often curves into and out of the flat part, instead of having sharp corners. Why?',options:[
    {text:'Not all the ice and water are at the same temperature',correct:true},
    {text:'The melting point of ice changes as it melts',why:'Pure ice always melts at 0 °C. The rounding comes from parts of the beaker being at different temperatures.'},
    {text:'The thermometer reads to only 0.5 °C',why:'A 0.5 °C scale limits each reading a little, but it does not make the corners curve.'},
    {text:'The Bunsen burner gets hotter as time goes on',why:'A steady flame supplies energy at a steady rate. The rounding is about the temperature in different parts of the beaker.'}
  ],explain:'Ice near the glass melts first, and meltwater next to it can warm up while ice in the middle is still melting. Stirring all the time keeps the temperature even, which makes the corners sharper.'});
}
{
  const body=act('accuracy','Predict','Why a water bath?','');
  createPredict({host:body,q:'Why is the beaker of ice heated in a beaker of water, instead of directly over the flame?',options:[
    {text:'It heats the ice gently and evenly, from all sides',correct:true},
    {text:'Water lowers the melting point of the ice',why:'The water bath is outside the beaker of ice, so it cannot change the melting point. It controls the heating.'},
    {text:'A flame cannot heat ice that is below 0 °C',why:'A flame can heat anything. Direct heating would be fast and uneven: the bottom would be much hotter than the top.'},
    {text:'It stops the thermometer from reading above 100 °C',why:'The thermometer is not near 100 °C in this practical. The point is gentle, even heating.'}
  ],explain:'Heating directly makes the bottom of the beaker much hotter than the rest, and the temperature rises too fast to read. A water bath warms the beaker gently and evenly, so the readings show the true shape of the graph.'});
}

/* ================= EXAM PRACTICE ================= */
{
  const body=act('exam','Exam style','A cooling curve','Zahra melts some stearic acid, then reads its temperature every minute as it cools. One reading is missing.');
  const tbl=mk('div','table-scroll');
  tbl.innerHTML='<table class="units res-tbl"><thead><tr><th>Time (min)</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th></tr></thead><tbody><tr><th>Temperature (°C)</th><td>80</td><td>74</td><td>70</td><td>69</td><td>69</td><td><b>?</b></td><td>69</td><td>66</td><td>62</td></tr></tbody></table>';
  body.appendChild(tbl);
  body.appendChild(mk('p','sub','(a) 1 mark'));
  createCalc({host:body,questions:[
    {q:'Zahra forgot to write down the temperature at 5 minutes. Predict the missing reading.',unit:'°C',answer:69,working:'The temperature is 69 °C at 3, 4 and 6 minutes: the acid is freezing.<br>temperature at 5 min = 69 °C'}
  ]});
  body.appendChild(mk('p','sub','(b) 2 marks'));
  body.appendChild(mk('p','','Explain why the temperature stays the same from 3 to 6 minutes. Write your answer, then check it.'));
  const d1=mk('details','');
  d1.innerHTML='<summary>Check your answer</summary><div><ul><li>The stearic acid is changing state from liquid to solid (freezing).</li><li>Energy is released as the particles settle into fixed positions, which balances the energy lost to the surroundings, so the temperature does not fall.</li></ul></div>';
  body.appendChild(d1);
  body.appendChild(mk('p','sub','(c) 4 marks'));
  body.appendChild(mk('p','','Describe how you would obtain a temperature–time graph for ice as it melts. Name the equipment you would use.'));
  const d2=mk('details','');
  d2.innerHTML='<summary>Check your answer</summary><div><ul><li>Put crushed ice in a beaker with a thermometer, the bulb in the middle of the ice.</li><li>Heat the beaker gently in a water bath (a larger beaker of water over a Bunsen burner).</li><li>Stir all the time, and read the thermometer at regular intervals, such as every minute, timed with a stopwatch.</li><li>Carry on until the ice has melted and the water has warmed; plot temperature against time.</li></ul></div>';
  body.appendChild(d2);
  body.appendChild(mk('p','sub','(d) 2 marks'));
  body.appendChild(mk('p','','Describe the arrangement and motion of the particles in the stearic acid at 1 minute and at 8 minutes.'));
  const d3=mk('details','');
  d3.innerHTML='<summary>Check your answer</summary><div><ul><li>At 1 minute it is a liquid: the particles touch but have no regular arrangement, and slide past each other.</li><li>At 8 minutes it is a solid: the particles are in a regular arrangement and vibrate about fixed positions.</li></ul></div>';
  body.appendChild(d3);
}
