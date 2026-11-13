/* ================= METHOD TYPE: conduction, convection or radiation =================
   Alex, 13 Nov 2026: one choice at the top of the Method tab instead of four activities on one tab.
   Each choice shows its method Order and an equipment Match; Radiation shows its two Orders
   (Leslie cube, two cans) side by side. The choice is remembered in this browser. */
const METHODS=[{k:'cond',label:'Conduction'},{k:'conv',label:'Convection'},{k:'rad',label:'Radiation'}];
const MKEY='cp-heat-transfer-method';
let method='cond';try{const v=localStorage.getItem(MKEY);if(METHODS.some(m=>m.k===v))method=v;}catch(e){}
const methodGames=[];
function methodPicker(panel){
  const w=mk('div','method-pick');
  w.innerHTML='<span class="method-lab" id="ml-'+panel+'">Method</span><div class="seg" role="group" aria-labelledby="ml-'+panel+'">'+
    METHODS.map(m=>'<button type="button" data-m="'+m.k+'">'+m.label+'</button>').join('')+'</div>';
  $('#panel-'+panel+' .acts').prepend(w);
  w.addEventListener('click',e=>{const b=e.target.closest('button[data-m]');if(b)setMethod(b.dataset.m);});
}
function forMethod(body,k){body.closest('.act').dataset.m=k;}
function setMethod(k){
  method=k;try{localStorage.setItem(MKEY,k);}catch(e){}
  $$('.method-pick button').forEach(b=>{const on=b.dataset.m===k;b.classList.toggle('is-on',on);b.setAttribute('aria-pressed',String(on));});
  $$('.act[data-m],.act-pair[data-m]').forEach(a=>{a.hidden=a.dataset.m!==k;});
  raf(()=>methodGames.forEach(g=>g&&g.reflow&&g.reflow()));
}
reflowers.push(()=>raf(()=>methodGames.forEach(g=>g&&g.reflow&&g.reflow())));
const ORDER_INTRO='Put the steps in the order you would do them. Drag the ≡ handle, or use the ▲▼ buttons.';
const MATCH_INTRO='Pair each piece of equipment with its job. Drag one card onto the other, or tap one card and then the other.';

/* Two activities side by side, one row (laptop); they stack on a narrow screen. */
function pairLast(k){
  const acts=$('#panel-method .acts'),list=acts.querySelectorAll(':scope>.act'),pair=mk('div','act-pair');pair.dataset.m=k;
  const x=list[list.length-2],y=list[list.length-1];delete x.dataset.m;delete y.dataset.m;
  pair.appendChild(x);pair.appendChild(y);acts.appendChild(pair);
}

/* The last two activities on a tab side by side, one row on a laptop; they stack on a narrow screen. */
function pairIn(panel){
  const acts=$('#panel-'+panel+' .acts'),list=acts.querySelectorAll(':scope>.act'),pair=mk('div','act-pair');
  pair.appendChild(list[list.length-2]);pair.appendChild(list[list.length-1]);acts.appendChild(pair);
  return pair;
}
/* ================= 1. METHOD ================= */
methodPicker('method');
{
  const body=act('method','Order','Comparing conductors',ORDER_INTRO);forMethod(body,'cond');
  methodGames.push(createReorder({host:body,steps:[
    {id:'a',text:'Choose rods of copper, aluminium, iron and glass, all the same length and thickness.'},
    {id:'b',text:'Stick a drawing pin to each rod with the same amount of wax, the same distance from one end.'},
    {id:'c',text:'Hold the rods upright in a clamp stand.'},
    {id:'d',text:'Lower the other ends into the same hot water, to the same depth, at the same moment, and start the stopwatch.'},
    {id:'e',text:'Record the time when each pin drops off. After 10 minutes, record any pin still on as “still on”.'},
    {id:'f',text:'Let the rods cool, put on fresh wax and pins, and repeat. Find the mean time for each rod.'},
    {id:'g',text:'Rank the materials: the shorter the mean time, the better the conductor.'}
  ],constraints:[['a','b'],['a','c'],['b','d'],['c','d'],['d','e'],['e','f'],['f','g']],
  why:'The rods are prepared and clamped before heating starts, the clock starts when they go into the water, the test is repeated once they have cooled, and the ranking comes from the mean times.'}));
}
{
  const body=act('method','Match','What each piece of equipment is for',MATCH_INTRO);forMethod(body,'cond');
  methodGames.push(createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'w',l:'Wax and drawing pin',r:'Shows when that point on the rod has reached a set temperature'},
    {id:'s',l:'Stopwatch',r:'Times how long the energy takes to reach each pin'},
    {id:'c',l:'Clamp stand',r:'Holds the rods still, at the same depth in the water'},
    {id:'h',l:'Beaker of hot water',r:'Heats the end of every rod from the same source, at the same temperature'}
  ]}));
}
pairLast('cond');
{
  const body=act('method','Order','Follow the dye',ORDER_INTRO);forMethod(body,'conv');
  methodGames.push(createReorder({host:body,steps:[
    {id:'a',text:'Fill a beaker with cold water and leave it until the water is still.'},
    {id:'b',text:'Drop one small crystal of potassium permanganate down a wide straw, so it lands on the bottom at one side.'},
    {id:'c',text:'Stand the beaker on a tripod and gauze, with a small Bunsen flame under the crystal.'},
    {id:'d',text:'Heat gently, and start the stopwatch.'},
    {id:'e',text:'Every 30 seconds, mark on a sketch of the beaker where the purple dye has got to.'},
    {id:'f',text:'Describe the path: up above the flame, across the top, down the far side, back along the bottom.'}
  ],constraints:[['a','b'],['b','d'],['c','d'],['d','e'],['e','f']],
  why:'The water must be still before the crystal goes in, or the dye moves for another reason. The crystal goes in down a straw so it does not colour the water on the way down, and only then does the heating start.'}));
}
{
  const body=act('method','Match','What each piece of equipment is for',MATCH_INTRO);forMethod(body,'conv');
  methodGames.push(createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'k',l:'Potassium permanganate crystal',r:'Colours the water so its movement can be seen'},
    {id:'t',l:'Wide straw',r:'Puts the crystal on the bottom without colouring the water on the way'},
    {id:'b',l:'Small Bunsen flame',r:'Heats the water gently at one point, under the crystal'},
    {id:'g',l:'Tripod and gauze',r:'Holds the beaker steady over the flame'}
  ]}));
}
pairLast('conv');
{
  const body=act('method','Order','Radiation from a Leslie cube',ORDER_INTRO);
  methodGames.push(createReorder({host:body,steps:[
    {id:'a',text:'Fill the Leslie cube with hot water from a kettle and put the lid on.'},
    {id:'b',text:'Place the infrared detector a measured distance, say 10 cm, from one face.'},
    {id:'c',text:'Record the detector reading for that face.'},
    {id:'d',text:'Turn the cube so the next face points at the detector, keeping the same distance.'},
    {id:'e',text:'Record the reading, and repeat for the other two faces.'},
    {id:'f',text:'Compare the readings: the highest reading is from the best emitter.'}
  ],constraints:[['a','b'],['b','c'],['c','d'],['d','e'],['e','f']],
  why:'The cube is filled first, so every face is at the same temperature. Only the surface facing the detector changes between readings.'}));
}
{
  const body=act('method','Order','Comparing absorbers: two cans',ORDER_INTRO);
  methodGames.push(createReorder({host:body,steps:[
    {id:'a',text:'Pour the same volume of cold water into a matt black can and a shiny can.'},
    {id:'b',text:'Check the water in both cans starts at the same temperature.'},
    {id:'c',text:'Stand both cans the same distance from the same radiant heater.'},
    {id:'d',text:'Switch on the heater and start the stopwatch.'},
    {id:'e',text:'Stir, then read both thermometers every 2 minutes for 10 minutes.'},
    {id:'f',text:'Repeat, and compare the mean rise in temperature: the bigger rise shows the better absorber.'}
  ],constraints:[['a','b'],['b','d'],['c','d'],['d','e'],['e','f']],
  why:'Everything except the surface is made the same before the heater goes on: the volume of water, its starting temperature and the distance from the heater. Then both cans are read at the same times.'}));
}
pairLast('rad');
{
  const body=act('method','Match','What each piece of equipment is for',MATCH_INTRO);forMethod(body,'rad');
  methodGames.push(createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'l',l:'Leslie cube',r:'Gives four different surfaces all at the same temperature'},
    {id:'d',l:'Infrared detector',r:'Measures how much radiation reaches it from a surface'},
    {id:'r',l:'Ruler',r:'Keeps the detector, or each can, the same distance from the source'},
    {id:'h',l:'Radiant heater',r:'Shines the same radiation on both cans'},
    {id:'t',l:'Thermometer',r:'Measures how much the water in each can warms up'}
  ]}));
}
setMethod(method);

/* ================= 2. VARIABLES ================= */
{
  const body=act('variables','Sort','Comparing conductors: which variable?','Elena compares how well four rods conduct. Sort each variable, then press Check.');
  createSortGame({host:body,cats:[
    {id:'i',label:'Independent',hint:'What she changes',color:'--c1',soft:'--c1-soft'},
    {id:'d',label:'Dependent',hint:'What she measures',color:'--c2',soft:'--c2-soft'},
    {id:'c',label:'Control',hint:'What she keeps the same',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'The material of the rod',cat:'i'},
    {id:'2',text:'The time taken for the pin to drop',cat:'d'},
    {id:'3',text:'The length and thickness of each rod',cat:'c'},
    {id:'4',text:'The temperature of the hot water',cat:'c'},
    {id:'5',text:'The distance from the water to the pin',cat:'c'},
    {id:'6',text:'The amount of wax holding each pin',cat:'c'},
    {id:'7',text:'How deep each rod dips into the water',cat:'c'}
  ]});
}
{
  const body=act('variables','Predict','The Leslie cube','');
  createPredict({host:body,q:'In the Leslie cube test, what is the independent variable?',options:[
    {text:'The type of surface facing the detector',correct:true},
    {text:'The reading on the infrared detector',why:'The reading is what is measured, so it is the dependent variable.'},
    {text:'The temperature of the water in the cube',why:'All four faces share the same water, so its temperature is kept the same.'},
    {text:'The distance from the face to the detector',why:'The distance must stay the same for every face, so it is a control variable.'}
  ],explain:'Only the surface changes from one reading to the next. The detector reading depends on it, and the water temperature and distance are kept the same.'});
}
{
  const body=act('variables','Predict','The same amount of wax','');
  createPredict({host:body,q:'Why does Aidan use the same amount of wax on every pin?',options:[
    {text:'More wax takes more energy to melt',correct:true},
    {text:'More wax would make the rod conduct better',why:'The wax is outside the rod. It does not change how well the rod itself conducts.'},
    {text:'Wax is a good conductor of thermal energy',why:'Wax is a poor conductor. The point is that a bigger lump needs more energy before it melts.'},
    {text:'So that all the pins drop at the same time',why:'The pins should drop at different times; that is the result. Equal wax keeps the test fair.'}
  ],explain:'A bigger lump of wax needs more energy to melt, so its pin would drop later even on a good conductor. With equal wax, only the material of the rod changes the time.'});
}

/* ================= 3. CONDUCTION ================= */
{
  act('conduction','Your turn','Time the pins','Press Experiment, then Start. Record the time when each pin drops. Which rod is the best conductor, and which is a poor conductor? Then turn Experiment off and press Play to see the temperature along each rod.');
}
frameAct('conduction','animations/heat-transfer.html','cond','Conduction animation: four rods in hot water with a pin waxed to each','conduction',false);
{
  const body=act('conduction','Predict','The glass rod','');
  createPredict({host:body,q:'After 10 minutes the pin on the glass rod is still on. What does this show?',options:[
    {text:'Glass is a poor conductor',correct:true},
    {text:'The wax on the glass rod was too thick',why:'The same amount of wax was used on every rod, so the wax is not the cause.'},
    {text:'No energy entered the glass rod at all',why:'The end in the water does get hot. Energy is conducted along glass, but very slowly.'},
    {text:'Glass needs a higher water temperature',why:'The water was the same for every rod. Glass conducts slowly at any temperature.'}
  ],explain:'The end of the glass rod in the water is hot, but energy is conducted along glass so slowly that the wax 11 cm away never reaches its melting point. Glass is a poor conductor (an insulator).'});
}
{
  const body=act('conduction','Predict','Bar chart or line graph?','');
  createPredict({host:body,q:'Aidan wants to show his times on a graph. Why should he draw a bar chart, not a line graph?',options:[
    {text:'The rod material is a categoric variable',correct:true},
    {text:'The times are too far apart to join up',why:'The spread of the times does not matter. A line needs values in between to join.'},
    {text:'A bar chart is easier to draw neatly',why:'It is not about neatness. There is nothing between copper and iron to join with a line.'},
    {text:'Line graphs are only used for temperatures',why:'Line graphs suit any continuous variable. The material is not continuous.'}
  ],explain:'The material is a categoric variable: there are no values between copper and iron, so the points cannot be joined by a line. Draw one bar for each material, against a time axis with an even (linear) scale.'});
}
pairIn('conduction'); /* The glass rod beside Bar chart or line graph? (Alex, 13 Nov 2026) */

/* ================= 4. CONVECTION ================= */
{
  act('convection','Your turn','Follow the dye','Press Experiment, then Play. Press Mark the front every few seconds to mark where the front of the purple dye has got to, then press Compare. Try heating under the crystal, in the middle and at the top. Where does the warm water go, and what happens when you heat the top?');
}
frameAct('convection','animations/heat-transfer.html','conv','Convection animation: a beaker of water with a potassium permanganate crystal, heated from below or at the top','convection',false);
{
  const body=act('convection','Order','Why a convection current forms','Put the steps in order, starting at the flame. Drag the ≡ handle, or use the ▲▼ buttons.');
  createReorder({host:body,steps:[
    {id:'a',text:'The water just above the flame is heated.'},
    {id:'b',text:'Its particles move faster and further apart, so the water expands.'},
    {id:'c',text:'The same mass now has a bigger volume, so its density is lower.'},
    {id:'d',text:'The less dense warm water rises.'},
    {id:'e',text:'Cooler, denser water sinks to take its place, and is heated in turn.'}
  ],constraints:[['a','b'],['b','c'],['c','d'],['d','e']],
  why:'Heating makes the water expand. With the same mass in a bigger volume, ρ = [[m|V]] is smaller, so the warm water rises and denser water flows in below it.'});
}
{
  const body=act('convection','Predict','Heating at the top','');
  createPredict({host:body,q:'Aidan heats the water near the top of the beaker instead. What happens to the dye at the bottom?',options:[
    {text:'It stays near the bottom',correct:true},
    {text:'It rises quickly to the heater',why:'Only warm, less dense water rises. The water at the bottom stays cold and dense.'},
    {text:'It sinks into the glass of the beaker',why:'The dye stays in the water. With no current to carry it, it only spreads slowly.'},
    {text:'It goes round the beaker as before',why:'A current needs warm water below cooler water. Here the warm water is already at the top.'}
  ],explain:'The warm water at the top is less dense, so it stays at the top, and the cold, denser water stays at the bottom. No convection current forms, and the dye only spreads slowly.'});
}
pairIn('convection'); /* the Order beside the Predict (Alex, 13 Nov 2026) */

/* ================= 5. RADIATION ================= */
{
  act('radiation','Your turn','Compare the surfaces','Press Experiment. With the Leslie cube, drag the detector to a distance, then read each face without moving it. Then choose Two cans and take readings every minute. Which surface is the best emitter, and which is the best absorber?');
}
frameAct('radiation','animations/heat-transfer.html','rad','Radiation animation: a Leslie cube with an infrared detector, and two cans beside a heater','radiation',false);
{
  const body=act('radiation','Predict','A hotter cube','');
  createPredict({host:body,q:'Elena refills the Leslie cube with hotter water. What happens to the reading from the matt black face?',options:[
    {text:'It goes up',correct:true},
    {text:'It goes down',why:'A hotter object emits more infrared, not less.'},
    {text:'It stays the same',why:'The surface is the same, but the amount emitted also depends on its temperature.'},
    {text:'Only the shiny faces change',why:'Every face emits more when it is hotter, the black face as well.'}
  ],explain:'The hotter an object, the more infrared radiation it emits each second. Every face gives a bigger reading, and matt black is still the highest.'});
}

/* ================= 6. RESULTS ================= */
const CANS=[[0,20.0,20.0],[2,24.5,21.0],[4,28.0,22.0],[6,31.5,23.0],[8,34.0,24.0],[10,36.5,25.0]];
function cansTable(rows,miss){
  const t=mk('div','table-scroll');
  t.innerHTML='<table class="units res-tbl"><thead><tr><th>Time (min)</th>'+rows.map(r=>'<th>'+r[0]+'</th>').join('')+'</tr></thead><tbody><tr><th>Matt black can (°C)</th>'+rows.map(r=>'<td>'+r[1].toFixed(1)+'</td>').join('')+'</tr><tr><th>Shiny can (°C)</th>'+rows.map(r=>'<td>'+r[2].toFixed(1)+'</td>').join('')+'</tr></tbody></table>';
  return t;
}
{
  const body=act('results','Calculate','Elena’s two cans','Elena put a matt black can and a shiny can of cold water, each with the same volume, the same distance from a radiant heater.');
  body.appendChild(cansTable(CANS));
  createCalc({host:body,questions:[
    {q:'By how much did the water in the matt black can warm up in 10 minutes?',unit:'°C',answer:16.5,working:'rise = final temperature − starting temperature<br>rise = 36.5 − 20.0<br>rise = 16.5 °C'},
    {q:'By how much did the water in the shiny can warm up in 10 minutes?',unit:'°C',answer:5,working:'rise = 25.0 − 20.0<br>rise = 5.0 °C'},
    {q:'What was the average rate of rise of the matt black can in the first 4 minutes?',unit:'°C/min',answer:2,working:'rate = [[rise in temperature|time]]<br>rate = [[28.0 − 20.0|4]]<br>rate = [[8.0|4]]<br>rate = 2.0 °C/min'},
    {q:'And from 6 to 10 minutes?',unit:'°C/min',answer:1.25,working:'rate = [[36.5 − 31.5|4]]<br>rate = [[5.0|4]]<br>rate = 1.25 °C/min'}
  ]});
}
{
  const body=act('results','Plot','Plot the matt black can','Plot temperature against time for the matt black can, as a small cross. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');
  createPlot({host:body,
    points:CANS.map(r=>({x:r[0],y:r[1]})),
    rowText:p=>p.x+' min, '+p.y.toFixed(1)+' °C',
    graph:{xMin:0,xMax:10,yMin:20,yMax:40,xTicks:[0,2,4,6,8,10],yTicks:[20,25,30,35,40],minor:[1,1],snap:[1,0.5],xLabel:'time (min)',yLabel:'temperature (°C)',W:560,H:340}});
}
{
  const body=act('results','Predict','Slowing down','');
  createPredict({host:body,q:'The matt black can warms more slowly near the end. Why?',options:[
    {text:'As it warms, it loses more energy to the air',correct:true},
    {text:'The heater gives out less radiation over time',why:'The heater’s output stays the same. The can itself is losing more energy as it warms.'},
    {text:'The black paint absorbs less once it is warm',why:'The surface absorbs just as well. A warmer can also emits and loses more energy.'},
    {text:'The water in the can is nearly boiling now',why:'At 36 °C it is far below boiling. The rise slows because energy is lost faster.'}
  ],explain:'The can still absorbs the same radiation each second. But the warmer it gets, the more energy it emits and passes to the air, so its temperature rises more slowly.'});
}
{
  const body=act('results','Predict','An anomalous result','');
  createPredict({host:body,q:'Aidan’s shiny can gave these readings. Which one is anomalous?',
    pre:'<div class="table-scroll"><table class="units res-tbl"><thead><tr><th>Time (min)</th><th>0</th><th>2</th><th>4</th><th>6</th><th>8</th><th>10</th></tr></thead><tbody><tr><th>Shiny can (°C)</th><td>20.0</td><td>21.0</td><td>22.0</td><td>25.5</td><td>24.0</td><td>25.0</td></tr></tbody></table></div>',
    options:[
    {text:'6 min',correct:true},
    {text:'10 min',why:'From 8 to 10 minutes it rises 1.0 °C, the same as every other 2 minutes.'},
    {text:'0 min',why:'Both cans start with water at room temperature, so 20.0 °C fits.'},
    {text:'None of them',why:'At 6 minutes it jumps 3.5 °C, then falls at 8 minutes. That breaks the steady pattern.'}
  ],explain:'The shiny can warms by about 1.0 °C every 2 minutes, so at 6 minutes it should be about 23.0 °C. Perhaps the thermometer was read at the wrong angle or touched the side. Repeat the reading if you can, and leave it out of the line of best fit.'});
}

{
  const body=act('results','Calculate','Charlotte’s cooling cans','Charlotte fills a matt black can and a shiny can with the same volume of hot water. She reads the temperature of each every 2 minutes. One reading is missing.');
  const tbl=mk('div','table-scroll');
  tbl.innerHTML='<table class="units res-tbl"><thead><tr><th>Time (min)</th><th>0</th><th>2</th><th>4</th><th>6</th><th>8</th><th>10</th></tr></thead><tbody><tr><th>Matt black can (°C)</th><td>80.0</td><td>75.5</td><td>71.5</td><td>68.0</td><td>65.0</td><td>62.5</td></tr><tr><th>Shiny can (°C)</th><td>80.0</td><td>78.0</td><td>76.0</td><td><b>?</b></td><td>72.5</td><td>71.0</td></tr></tbody></table>';
  body.appendChild(tbl);
  createCalc({host:body,questions:[
    {q:'Charlotte forgot to write down the temperature of the shiny can at 6 minutes. Predict the missing reading.',unit:'°C',answer:74.2,working:'From 4 to 8 minutes it falls 3.5 °C, about 1.75 °C in each 2 minutes.<br>temperature at 6 min = 76.0 − 1.75<br>temperature at 6 min = 74.25 °C (74.0 °C to 74.5 °C is fine)'},
    {q:'Calculate the fall in temperature of the matt black can in 10 minutes.',unit:'°C',answer:17.5,working:'fall = 80.0 − 62.5<br>fall = 17.5 °C'},
    {q:'Calculate the fall in temperature of the shiny can in 10 minutes.',unit:'°C',answer:9,working:'fall = 80.0 − 71.0<br>fall = 9.0 °C'}
  ]});
}


/* ================= 7. ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Better results or safer?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'Better results',hint:'A fairer or more accurate test',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps people safe',hint:'Protects people from harm',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Keep the detector the same distance from each face',cat:'a'},
    {id:'2',text:'Use rods of the same length and thickness',cat:'a'},
    {id:'3',text:'Read the thermometer with your eye level with the liquid',cat:'a'},
    {id:'4',text:'Repeat each test and find the mean time',cat:'a'},
    {id:'5',text:'Do not touch the Leslie cube: its faces are hot',cat:'s'},
    {id:'6',text:'Stand up, and keep the hot water away from the edge of the bench',cat:'s'},
    {id:'7',text:'Pick up the crystal with tweezers, not your fingers',cat:'s'},
    {id:'8',text:'Let the rods cool before you handle them',cat:'s'},
    {id:'9',text:'Stir the water before you read the thermometer',cat:'a'},
    {id:'10',text:'Hold hot apparatus by a wooden part: wood is a poor conductor',cat:'s'}
  ]});
}
{
  const body=act('accuracy','Predict','Stray radiation','');
  createPredict({host:body,q:'Why should the Leslie cube test be done away from windows and radiators?',options:[
    {text:'They give extra infrared to the detector',correct:true},
    {text:'They cool the water inside the cube',why:'A radiator would not cool the cube. The problem is the extra radiation reaching the detector.'},
    {text:'Their light changes the colour of the faces',why:'The faces stay the same. The detector picks up infrared from the window or radiator.'},
    {text:'They make the detector less sensitive',why:'The detector works the same. It just measures radiation from other sources as well.'}
  ],explain:'An infrared detector measures all the radiation reaching it. Sunlight or a radiator adds radiation that does not come from the face being tested, so the comparison is no longer fair.'});
}
{
  const body=act('accuracy','Predict','Timing the pins','');
  createPredict({host:body,q:'Aidan’s copper and aluminium pins drop only 8 s apart. How can he be more confident which conducts better?',options:[
    {text:'Repeat the test and compare the mean times',correct:true},
    {text:'Use a stopwatch that reads to 0.01 s instead',why:'His reaction time is far bigger than 0.01 s. Repeats give a more reliable comparison.'},
    {text:'Put more wax on the aluminium pin to slow it',why:'That would change a control variable, so the test would not be fair.'},
    {text:'Use hotter water for the copper rod this time',why:'Each rod must go in the same water, or the test is not fair.'}
  ],explain:'Small differences can come from how the wax was stuck on or from reaction time. Repeating the test and comparing mean times shows whether the difference is real.'});
}
