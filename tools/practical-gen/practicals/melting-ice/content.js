/* ================= YOUR OWN RESULTS TABLE (Do Experiment; 5c rebuild, 13 Nov 2026) =================
   The same helper is copied on the six pages rebuilt together (3.17, 3.19, 3.25P, 3.27P, 5.11P, 5.14P); 1.22 has its own.
   o.cols: the header cells. o.rows: one array per row; a cell is given text, or a box
     {k:key, label:'for screen readers', ok:(v,g)=>true if right, fill:g=>'text', need:[keys]}.
   g(k) is the number in box k once that box is locked (checked right, or filled in), so a box worked out from the
   student's own readings is marked against them; ok() is only asked once every box in need[] is locked.
   Fill in table is always there (Alex, 5 Nov 2026), so a student who cannot read the instrument can still go on.
   o.beside: put the animation frame just above this activity side by side with it (the 1.22 layout). */
function measTable(body,o){
  const wrap=mk('div','table-scroll');body.appendChild(wrap);
  const boxes=[];
  wrap.innerHTML='<table class="units res-tbl mt-tbl"><thead><tr>'+o.cols.map(h=>'<th>'+h+'</th>').join('')+'</tr></thead><tbody>'+
    o.rows.map(r=>'<tr>'+r.map(c=>{if(c&&typeof c==='object'){boxes.push(c);return '<td><input class="calc-num-input" data-k="'+c.k+'" inputmode="decimal" autocomplete="off" aria-label="'+c.label+'"></td>';}return '<td class="given">'+c+'</td>';}).join('')+'</tr>').join('')+'</tbody></table>';
  const inp=k=>$('input[data-k="'+k+'"]',wrap), all=()=>$$('input',wrap);
  const num=e=>{const t=e.value.trim().replace(/[−–]/g,'-').replace(',','.');return /^-?(\d+\.?\d*|\.\d+)$/.test(t)?parseFloat(t):NaN;};
  const g=k=>{const e=inp(k);return e&&e.disabled?num(e):NaN;};
  const ready=c=>(c.need||[]).every(k=>inp(k).disabled);
  const b=bar(body,[{label:'Check table',primary:true,fn:check},{label:'Fill in table',fn:fill},{label:'Clear',fn:reset}]);
  const lock=(e,shown)=>{e.disabled=true;e.classList.remove('is-wrong');e.classList.add(shown?'is-shown':'pop');};
  const changed=()=>{if(o.onChange)try{o.onChange();}catch(e){console.error(e);}};
  const DONE=o.done||'All correct.';
  function check(){
    let ok=0,bad=0,blank=0,wait=0,more=true;
    while(more){more=false;boxes.forEach(c=>{const e=inp(c.k);if(e.disabled||e.value.trim()===''||!ready(c))return;const v=num(e);if(isFinite(v)&&c.ok(v,g)){lock(e,false);more=true;}});}
    boxes.forEach(c=>{const e=inp(c.k);if(e.disabled){ok++;return;}if(e.value.trim()===''){blank++;return;}if(!ready(c)){wait++;return;}bad++;e.classList.add('is-wrong');});
    if(ok===boxes.length){b.say(DONE,'good');celebrate(b.msg);}
    else b.say(ok+' of '+boxes.length+' correct'+(blank?', '+blank+' left blank':'')+'.'+(wait?' '+wait+' wait for the readings they are worked out from.':'')+(bad&&o.hint?' '+o.hint:''),bad?'bad':'');
    changed();
  }
  function fill(){
    boxes.forEach(c=>{const e=inp(c.k);if(e.disabled)return;e.value=c.fill(g);lock(e,true);});
    b.say(o.filled||'Table filled in (dashed). Boxes worked out from your own readings use your values.','');changed();
  }
  function reset(){all().forEach(e=>{e.value='';e.disabled=false;e.classList.remove('is-wrong','is-shown','pop');});b.say('','');changed();}
  all().forEach(e=>e.addEventListener('input',()=>e.classList.remove('is-wrong')));
  if(o.beside){const a=body.closest('.act'),fr=a.previousElementSibling;if(fr&&fr.classList.contains('anim-wrap')){const sp=mk('div','mt-split');fr.parentNode.insertBefore(sp,fr);sp.appendChild(fr);sp.appendChild(a);}}
  track(body,{reset:reset,
    getState:()=>({v:all().map(e=>e.value),ok:all().map(e=>e.disabled),sh:all().map(e=>e.classList.contains('is-shown'))}),
    setState:s=>{reset();all().forEach((e,i)=>{if(!s||!s.v||typeof s.v[i]!=='string')return;e.value=s.v[i];if(s.ok&&s.ok[i]){e.disabled=true;if(s.sh&&s.sh[i])e.classList.add('is-shown');}});if(all().every(e=>e.disabled))b.say(DONE,'good');changed();},
    isDone:()=>all().every(e=>e.disabled)});
  return {g:g,text:k=>{const e=inp(k);return e&&e.disabled?e.value.trim():'';}};
}
// the list beside a Plot shows the student's own values once their table is checked (rowText does the same on each redraw)
function plotLabels(body,fn){$$('.plot-row',body).forEach((li,i)=>{const s=li.firstElementChild;if(s)s.textContent=fn(i);});}
const near=(v,a,t)=>Math.abs(v-a)<=t+1e-9;
const dp=(v,n)=>Number(v).toFixed(n);

/* ================= VARIABLES ================= */
{
  const body=act('variables','Sort','Which kind of variable is it?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'i',label:'Independent',hint:'You change it',color:'--c1',soft:'--c1-soft'},
    {id:'d',label:'Dependent',hint:'You measure it',color:'--c2',soft:'--c2-soft'},
    {id:'c',label:'Control',hint:'You keep it the same',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'The time since heating started',cat:'i'},
    {id:'2',text:'The temperature of the ice and water',cat:'d'},
    {id:'4',text:'The mass of ice in the beaker',cat:'c'},
    {id:'5',text:'The size of the Bunsen flame',cat:'c'},
    {id:'6',text:'Where the thermometer bulb sits in the ice',cat:'c'},
    {id:'7',text:'How often the ice is stirred',cat:'c'}
  ]});
}
{
  const body=act('variables','Multiple choice','Why crushed ice?','');
  createPredict({host:body,q:'Why should Ruby use crushed ice rather than a few large ice cubes?',options:[
    {text:'It packs round the bulb, so it reads the ice temperature',correct:true},
    {text:'Crushed ice melts at a lower temperature than ice cubes',why:'Ice melts at 0 °C however big the pieces are. Crushing it only helps the thermometer and the heating.'},
    {text:'Crushed ice has a bigger mass, so it takes longer to melt',why:'Crushing does not change the mass. The same mass of ice needs the same energy to melt.'},
    {text:'Large cubes would make the water boil before they melt',why:'The water bath heats gently. The problem with large cubes is the gaps of warm water round the thermometer.'}
  ],explain:'With large cubes the thermometer sits in gaps of meltwater, which can be warmer than the ice. Crushed ice packs round the bulb and melts evenly, so the reading is the temperature of the melting ice.'});
}

/* ================= METHOD ================= */
{
  const body=act('method','Order','Carry out the practical','Put the steps in the order you would do them. Drag the ≡ handle, or use the ▲▼ buttons.');
  createReorder({host:body,steps:[
    {id:'a',text:'Half fill a beaker with crushed ice. Put a thermometer in it, with the bulb in the middle of the ice, off the bottom of the beaker.'},
    {id:'b',text:'Stand the beaker in a larger beaker of water on a tripod and gauze, over a Bunsen burner.'},
    {id:'c',text:'Read the starting temperature of the ice.'},
    {id:'d',text:'Light the Bunsen burner, with a gentle flame, and start the stopwatch.'},
    {id:'e',text:'Stir all the time, so the temperature is the same throughout, and read the thermometer every minute.'},
    {id:'f',text:'Carry on until all the ice has melted and the water has warmed for several minutes.'},
    {id:'g',text:'Plot a graph of temperature against time.'}
  ],constraints:[['a','c'],['b','d'],['c','d'],['d','e'],['e','f'],['f','g']],
  why:'The starting temperature is read before heating begins, and you need readings past the end of melting to see the whole shape of the graph.'});
}
{
  const body=act('method','Multiple choice','Why a water bath?','');
  createPredict({host:body,q:'Why is the beaker of ice heated in a beaker of water, instead of directly over the flame?',options:[
    {text:'It heats the ice gently and evenly, from all sides',correct:true},
    {text:'Water lowers the melting point of the ice',why:'The water bath is outside the beaker of ice, so it cannot change the melting point. It controls the heating.'},
    {text:'A flame cannot heat ice that is below 0 °C',why:'A flame can heat anything. Direct heating would be fast and uneven: the bottom would be much hotter than the top.'},
    {text:'It stops the thermometer from reading above 100 °C',why:'The thermometer is not near 100 °C in this practical. The point is gentle, even heating.'}
  ],explain:'Heating directly makes the bottom of the beaker much hotter than the rest, and the temperature rises too fast to read. A water bath warms the beaker gently and evenly, so the readings show the true shape of the graph.'});
}

/* ================= ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Better results or safer?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'Better results',hint:'More accurate or more useful readings',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps people safe',hint:'Protects people and equipment',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Stir all the time, so the temperature is the same throughout',cat:'a'},
    {id:'2',text:'Keep the thermometer bulb off the bottom of the beaker',cat:'a'},
    {id:'3',text:'Read the thermometer with your eye level with the liquid',cat:'a'},
    {id:'4',text:'Take readings at short, regular intervals',cat:'a'},
    {id:'5',text:'Wear safety goggles',cat:'s'},
    {id:'7',text:'Tie long hair back near the Bunsen burner',cat:'s'},
    {id:'8',text:'Let the tripod and gauze cool before you touch them',cat:'s'}
  ]});
}
{
  const body=act('accuracy','Multiple choice','The bottom of the beaker','');
  createPredict({host:body,q:'Why should the thermometer bulb be kept off the bottom of the beaker?',options:[
    {text:'The glass there is warmer than the ice, so it reads too high',correct:true},
    {text:'The thermometer could crack the bottom of the beaker',why:'That is unlikely. The real problem is that the glass next to the hot water bath is warmer than the ice.'},
    {text:'The bottom of the beaker is colder, so readings would be too low',why:'The hot water bath warms the glass, so the bottom of the beaker is warmer than the ice, not colder.'},
    {text:'Ice cannot reach the bottom, so there would be no reading',why:'The ice does reach the bottom. The bulb must measure the ice, not the warmer glass.'}
  ],explain:'The glass is in contact with the hot water bath, so it is warmer than the melting ice. A bulb touching it reads too high. Keep the bulb in the middle of the ice and keep stirring.'});
}
{
  const body=act('accuracy','Multiple choice','Rounded corners','');
  createPredict({host:body,q:'In real results the graph often curves into and out of the flat part, instead of having sharp corners. Why?',options:[
    {text:'The temperature is not the same throughout',correct:true},
    {text:'The melting point of ice changes as it melts',why:'Pure ice always melts at 0 °C. The rounding comes from parts of the beaker being at different temperatures.'},
    {text:'The thermometer reads to only 0.5 °C',why:'A 0.5 °C scale limits each reading a little, but it does not make the corners curve.'},
    {text:'The Bunsen burner gets hotter as time goes on',why:'A steady flame supplies energy at a steady rate. The rounding is about the temperature in different parts of the beaker.'}
  ],explain:'Ice near the glass melts first, and meltwater next to it can warm up while ice in the middle is still melting. Stirring all the time keeps the temperature the same throughout, which makes the corners sharper.'});
}

/* ================= DO THE EXPERIMENT ================= */
// The student heats the crushed ice 1 minute at a time and reads the thermometer close-up to 0.5 °C.
// MI_T must match animations/heating-curve.html?show=measure&sub=ice (tools/CORE-PRACTICALS.md, "Measure modes", 5.11P).
const MI_T=[-10,-4.5,0,0,0,0,0,0,0,3.5,5.5,9,12.5,14.5,19,21,24];
const neg=v=>String(v).replace('-','−');
let miTable=null,miRows=()=>{};
{
  act('do','Your turn','Take your own readings','Read the thermometer in the close-up, to the nearest 0.5 °C, and write it in your table at 0 minutes. Press Heat for 1 minute, read it again, and carry on to 16 minutes, after all the ice has melted.');
}
frameAct('do','animations/heating-curve.html','measure&sub=ice','Melting ice experiment: heat the crushed ice and read the thermometer every minute','heating curve',false);
{
  const body=act('do','Calculate','Your results table','Write each temperature to the nearest 0.5 °C. Use a minus sign below 0 °C. Press Check.');
  miTable=measTable(body,{beside:true,cols:['Time (min)','Temperature (°C)'],
    rows:MI_T.map((T,j)=>[j,{k:'T'+j,label:'Temperature at '+j+' minutes, in °C',ok:v=>near(v,T,0.25),fill:()=>dp(T,1).replace('-','−')}]),
    hint:'Read the top of the red liquid against the scale. Each small mark is 1 °C.',
    done:'All correct. Now plot your results.',onChange:()=>miRows()});
}
{
  const body=act('do','Plot','Plot your results','Plot temperature (up the side) against time (along the bottom), as small crosses. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');
  const row=j=>{const t=miTable&&miTable.text('T'+j);return j+' min, '+(t?t+' °C':'your temperature');};
  createPlot({host:body,
    points:MI_T.map((T,j)=>({x:j,y:T})),
    rowText:p=>row(p.x),next:' Your graph rises, stays flat at 0 °C while the ice melts, then rises again.',
    graph:{xMin:0,xMax:16,yMin:-10,yMax:25,xTicks:[0,2,4,6,8,10,12,14,16],yTicks:[-10,-5,0,5,10,15,20,25],minor:[1,1],snap:[1,0.5],xLabel:'time (min)',yLabel:'temperature (°C)',W:560,H:400,pl:64}});
  miRows=()=>plotLabels(body,row);miRows();
}
{
  const body=act('do','Calculate','Read your results','Use your table or your graph.');
  createCalc({host:body,questions:[
    {q:'At what temperature did the ice melt?',unit:'°C',answer:0,working:'The temperature stays constant at 0 °C from 2 to 8 minutes.<br>melting point = 0 °C'},
    {q:'For how many minutes did the readings stay at 0 °C?',unit:'min',answer:6,working:'first reading at 0 °C: 2 min<br>last reading at 0 °C: 8 min<br>time = 8 − 2<br>time = 6 min'}
  ]});
}
{
  const body=act('do','Multiple choice','While the ice melts','');
  createPredict({host:body,q:'The temperature stays at 0 °C while the ice melts, but the Bunsen burner is still supplying energy. What happens to the particles?',options:[
    {text:'The bonds between them break; their kinetic energy is constant',correct:true},
    {text:'They gain kinetic energy, so they move faster and the ice melts',why:'The temperature stays at 0 °C, so the particles’ kinetic energy and average speed do not change while the ice melts.'},
    {text:'They stop vibrating, so they lose kinetic energy',why:'Energy is going in, not out. The kinetic energy stays the same while the bonds between the particles break.'},
    {text:'They get bigger, so the solid ice turns to liquid water',why:'Particles do not change size when a substance melts. Their arrangement and motion change.'}
  ],explain:'While the ice melts, the energy supplied weakens and breaks the bonds between the particles. Their kinetic energy stays constant, so the temperature stays at 0 °C until all the ice has melted. The arrangement changes from regular to irregular, and the particles go from vibrating about fixed positions to sliding past each other.'});
}
{
  const body=act('do','Multiple choice','The ice and the water','');
  createPredict({host:body,q:'In your results the ice warms by about 5 °C each minute, but the water only by about 3 °C each minute. Why is the ice part of the graph steeper?',options:[
    {text:'Ice needs less energy to warm by 1 °C',correct:true},
    {text:'The Bunsen burner is hotter at the start',why:'The flame is kept the same all the way through. The difference is in the substance being heated.'},
    {text:'Water loses energy as some of it boils',why:'The water is far below 100 °C, so none of it is boiling.'},
    {text:'There is more water than there was ice',why:'Melting does not change the mass: the water has the same mass as the ice did.'}
  ],explain:'Ice has a lower specific heat capacity than water: it needs about half as much energy to warm each kilogram by 1 °C. With the same energy each minute, the ice warms faster, so its part of the graph is steeper. Examiners look for this in a sketch.'});
}

/* ================= SHOW: the readings taken for you ================= */
{
  act('experiment','Your turn','Watch the readings','Press Experiment. Heat the crushed ice with a reading every minute, and watch the table and graph fill in. Then cool the stearic acid. For each one, what is the melting or freezing point, and how long does the temperature stay constant?');
}
frameAct('experiment','animations/heating-curve.html','','Heating curve animation: the temperature–time graph and the particles together','heating curve',false);
{
  const body=act('experiment','Multiple choice','Cooling but not falling','');
  createPredict({host:body,q:'From 2 to 8 minutes the stearic acid is still losing energy to the air, yet its temperature stays at 69 °C. Why?',options:[
    {text:'Energy is released as the liquid turns to solid',correct:true},
    {text:'The air around the tube is also at 69 °C',why:'The room is much cooler than 69 °C, so the acid keeps losing energy. Something must replace that energy.'},
    {text:'The particles stop moving while it freezes',why:'Particles in a solid still vibrate. They settle into fixed positions; they do not stop.'},
    {text:'Stearic acid cannot cool below its melting point',why:'After 8 minutes it does cool below 69 °C, once it has all turned solid.'}
  ],explain:'As bonds form and the particles settle into fixed positions, energy is released. This balances the energy lost to the surroundings, so the temperature stays at the freezing point until all the acid is solid.'});
}
{
  const body=act('experiment','Predict','Melting point or freezing point?','');
  createPredict({host:body,q:'Yassin also heats some solid stearic acid until it melts. At what temperature is the flat part of that heating curve?',options:[
    {text:'69 °C: its melting and freezing points are equal',correct:true},
    {text:'Above 69 °C: melting needs a higher temperature',why:'A pure substance melts and freezes at the same temperature. Only the direction of the energy transfer is different.'},
    {text:'Below 69 °C: solids melt before they get that hot',why:'The solid has to warm all the way up to its melting point before it starts to melt.'},
    {text:'There is no flat part when a solid is heated',why:'Any pure solid has a flat part while it melts, just as the liquid had one while it froze.'}
  ],explain:'The melting point and the freezing point of a pure substance are the same temperature. Heating, the flat part is melting; cooling, the flat part is freezing.'});
}

/* ================= RESULTS ================= */
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
    {q:'For how many minutes did the readings stay at 0 °C?',unit:'min',answer:4,working:'first reading at 0 °C: 2 min<br>last reading at 0 °C: 6 min<br>time = 6 − 2<br>time = 4 min'}
  ]});
}
{
  const body=act('results','Multiple choice','The line of best fit','');
  createPredict({host:body,q:'What line should Sophie draw through her plotted points?',options:[
    {text:'Straight lines: rising, flat at 0 °C, then rising',correct:true},
    {text:'One smooth curve from the first point to the last one',why:'A smooth curve would cut the corners and hide the flat part, which is the whole point of the graph.'},
    {text:'One straight line of best fit through all of the points',why:'The points are not on one straight line. Forcing one through them hides the constant temperature while melting.'},
    {text:'Short straight lines from each point to the next one',why:'Joining the dots follows every small reading error. Draw lines that follow the trend of each part.'}
  ],explain:'The graph has three parts: it rises to 0 °C as the ice warms, has a horizontal (flat) section at 0 °C while the ice melts, then rises as the water warms. Draw a line of best fit for each part, meeting at the corners.'});
}
{
  const body=act('results','Multiple choice','An anomalous result','');
  createPredict({host:body,q:'Yassin’s results are below. Which reading is anomalous, and what is the most likely cause?',
    pre:'<div class="table-scroll"><table class="units res-tbl"><thead><tr><th>Time (min)</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr></thead><tbody><tr><th>Temperature (°C)</th><td>−6</td><td>−2</td><td>0</td><td>0</td><td>3</td><td>0</td><td>2</td></tr></tbody></table></div>',
    options:[
    {text:'4 min: the bulb may have touched the hot glass',correct:true},
    {text:'6 min: the ice cannot have melted by then',why:'The ice can finish melting at any time. A rise once it has all melted is expected, so 2 °C at 6 minutes fits.'},
    {text:'2 min: the ice cannot reach 0 °C so quickly',why:'The ice warmed 4 °C in the first minute, so reaching 0 °C during the second minute fits the pattern.'},
    {text:'None: every reading fits a smooth heating curve',why:'At 4 minutes the temperature jumps to 3 °C, then falls back to 0 °C. That breaks the pattern while the ice is melting.'}
  ],explain:'While there is still ice, the temperature should stay at 0 °C. The 3 °C reading sits between two 0 °C readings, so it is anomalous: probably the bulb touched the warm bottom of the beaker, or the ice was not stirred, so the temperature was not the same throughout. Repeat it if you can, and leave it out of the line.'});
}

/* ================= GRAPH ANALYSIS ================= */
const GW={xMin:0,xMax:20,yMin:20,yMax:100,xTicks:[0,4,8,12,16,20],yTicks:[20,40,60,80,100],xLabel:'time (min)',yLabel:'temperature (°C)',W:560,H:340};
function lab(g0,t,x,y){return '<circle cx="'+g0.gx(x)+'" cy="'+g0.gy(y)+'" r="13" fill="var(--panel)" stroke="var(--ink)" stroke-width="2"/><text x="'+g0.gx(x)+'" y="'+(g0.gy(y)+5)+'" text-anchor="middle" font-size="14" fill="var(--ink)">'+t+'</text>';}
function waxGraph(){
  const P=[[0,25],[6,55],[14,55],[20,85]];
  const g0=lineGraph(Object.assign({points:[[0,25]]},GW));
  return lineGraph(Object.assign({label:'Temperature against time for a heated solid',points:P,extra:lab(g0,'A',3,40)+lab(g0,'B',10,55)+lab(g0,'C',17,70)},GW)).svg;
}
{
  /* Sketch the curve: the most-asked 5.11P item (May 2022 P2 7(d), May 2023 P2 2(b)(iii), Jan 2022 P2 2(b)): start and end values,
     one flat section at the melting point, and the ice section steeper than the water section. The corners are plotted and joined. */
  const body=act('graphs','Plot','Sketch the heating curve','Freya heats crushed ice at −10 °C with a heater of constant power. The ice reaches 0 °C after 2 minutes, and has all melted after 10 minutes. The water then warms to 20 °C. Water needs about twice as much energy as ice to warm by 1 °C. Plot the four corners of the graph in order; each is joined to the one before. Work out when the water reaches 20 °C first.');
  createPlot({host:body,join:true,wrong:'The red cross is in the wrong place. Check the scales; for the last corner, how fast does the water warm compared with the ice?',
    points:[{x:0,y:-10,t:'Start: the ice at −10 °C'},{x:2,y:0,t:'The ice starts to melt'},{x:10,y:0,t:'All the ice has melted'},{x:18,y:20,t:'The water reaches 20 °C'}],
    rowText:p=>p.t,
    next:' The ice line rises at 5 °C per minute. Water needs twice the energy for each 1 °C, so it rises at half that rate, 2.5 °C per minute, and takes 8 minutes to warm by 20 °C. In an exam sketch, the marks are for: the start and end temperatures marked on the axis; one flat section at 0 °C; and the ice section steeper than the water section.',
    graph:{xMin:0,xMax:20,yMin:-10,yMax:25,xTicks:[0,2,4,6,8,10,12,14,16,18,20],yTicks:[-10,-5,0,5,10,15,20,25],minor:[1,5],snap:[1,5],xLabel:'time (min)',yLabel:'temperature (°C)',W:560,H:340}});
}
{
  const body=act('graphs','Calculate','Read the graph','Ruby heats a solid wax gently and records its temperature. Read your answers off the graph.');
  const split=mk('div','graph-split');body.appendChild(split);
  split.appendChild(mk('div','graph-box',waxGraph()));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'What is the melting point of the wax?',unit:'°C',answer:55,working:'The flat part of the graph is at 55 °C.<br>melting point = 55 °C'},
    {q:'How long does the wax take to melt?',unit:'min',answer:8,working:'The flat part runs from 6 min to 14 min.<br>time = 14 − 6<br>time = 8 min'}
  ]});
}
{
  const body=act('graphs','Multiple choice','Which part?','');
  createPredict({host:body,q:'Look at the graph above. In which part are the wax particles sliding past each other and moving faster and faster?',options:[
    {text:'Part C: the wax is a liquid and getting hotter',correct:true},
    {text:'Part A: the temperature is rising there too',why:'In part A the wax is still solid, so its particles vibrate about fixed positions; they do not slide past each other.'},
    {text:'Part B: the wax is turning into a liquid',why:'In part B the bonds between the particles are breaking, but their kinetic energy is constant, so they are not getting faster.'},
    {text:'None: wax particles never slide past each other',why:'Once wax has melted it is a liquid, and in a liquid the particles slide past each other.'}
  ],explain:'Part A: solid warming, particles vibrate faster about fixed positions. Part B: melting at constant temperature, bonds breaking and kinetic energy constant. Part C: liquid warming, particles slide past each other and move faster as the temperature rises.'});
}
{
  const body=act('graphs','Predict','Twice as much wax','');
  createPredict({host:body,q:'Ruby repeats the test with twice the mass of wax, heated in the same way. How does the flat part of her graph change?',options:[
    {text:'Same temperature, lasts about twice as long',correct:true},
    {text:'It moves up to a higher temperature',why:'The melting point belongs to the substance. More wax melts at the same 55 °C.'},
    {text:'It lasts the same time at the same temperature',why:'Twice the mass needs twice the energy to melt, and the heater supplies energy at the same rate, so it takes longer.'},
    {text:'It disappears, as the extra wax melts slowly',why:'Any pure solid has a flat part while it melts. More wax makes the flat part longer, not missing.'}
  ],explain:'The melting point depends only on the substance, so the flat part stays at 55 °C. Twice the mass needs twice as much energy to melt, so with the same heating it lasts about twice as long.'});
}
{
  const body=act('graphs','Predict','A different substance','');
  createPredict({host:body,q:'Ruby repeats the test with the same mass of a different solid, which melts at 80 °C, heated in the same way. How is the flat part of her graph different?',options:[
    {text:'It is at 80 °C instead of 55 °C',correct:true},
    {text:'It is still at 55 °C, the melting point',why:'55 °C is the melting point of the wax. Each substance has its own melting point.'},
    {text:'There is no flat part for this solid',why:'Every pure solid has a flat part while it melts, at its own melting point.'},
    {text:'It slopes upwards from 55 °C to 80 °C',why:'While it melts the temperature is constant, so the part is flat, not sloping.'}
  ],explain:'The flat part is always at the melting point of the substance, so it moves to 80 °C. The temperature may also rise at a different rate before and after, and the flat part may last a different time, because a different substance needs a different amount of energy to warm and to melt.'});
}
const GX={xMin:0,xMax:24,yMin:-20,yMax:100,xTicks:[0,4,8,12,16,20,24],yTicks:[-20,0,20,40,60,80,100],xLabel:'time (min)',yLabel:'temperature (°C)',W:560,H:340,pl:64};
{
  const body=act('graphs','Calculate','Melting and boiling','Charlie heats a solid, substance X, at a steady rate until it has all boiled away. Read your answers off the graph.');
  const split=mk('div','graph-split');body.appendChild(split);
  const g0=lineGraph(Object.assign({points:[[0,0]]},GX));
  split.appendChild(mk('div','graph-box',lineGraph(Object.assign({label:'Temperature against time for substance X: rising, flat at −5 °C, rising, flat at 60 °C, then rising',
    points:[[0,-20],[2,-5],[5,-5],[11,60],[19,60],[22,90]],extra:lab(g0,'P',3.5,-5)+lab(g0,'Q',15,60)},GX)).svg));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'What is the boiling point of substance X?',unit:'°C',answer:60,working:'Part Q is the second flat part, where the liquid boils.<br>boiling point = 60 °C'},
    {q:'How long does substance X take to boil away?',unit:'min',answer:8,working:'Part Q runs from 11 min to 19 min.<br>time = 19 − 11<br>time = 8 min'}
  ]});
}
const GC={xMin:0,xMax:14,yMin:40,yMax:90,xTicks:[0,2,4,6,8,10,12,14],yTicks:[40,50,60,70,80,90],xLabel:'time (min)',yLabel:'temperature (°C)',W:560,H:340};
function coolGraph(){
  const P=[];for(let t=0;t<=14.001;t+=0.25){P.push([t,t<2?20+65*Math.exp(-t*Math.log(65/49)/2):t<8?69:20+49*Math.exp(-(t-8)/7)]);}
  return lineGraph(Object.assign({label:'Temperature against time for cooling stearic acid',points:P},GC)).svg;
}
{
  const body=act('graphs','Calculate','A cooling curve','Yassin melts some stearic acid, then lets it cool in its boiling tube. Read your answers off his graph.');
  const split=mk('div','graph-split');body.appendChild(split);
  split.appendChild(mk('div','graph-box',coolGraph()));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'What is the freezing point of stearic acid?',unit:'°C',answer:69,working:'The flat part of the graph is at 69 °C.<br>freezing point = 69 °C'},
    {q:'How long does the stearic acid take to freeze?',unit:'min',answer:6,working:'The flat part runs from 2 min to 8 min.<br>time = 8 − 2<br>time = 6 min'}
  ]});
}
