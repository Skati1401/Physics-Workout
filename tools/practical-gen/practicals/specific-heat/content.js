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

/* ================= METHOD TYPE: metal block or water =================
   The 4PH1 mark schemes accept a solid block or water (or another liquid), and the energy from a joulemeter,
   from voltmeter reading × ammeter reading × time, or from P × t for a heater of known power. The Method tab has
   a "Method type" switch (copied from the 1.5 page); the choice is remembered in this browser. The Overview tab was
   removed on 12 Nov 2026 (Alex). The water activities come after the block ones, so saved answers keep their places. */
const METHODS=[{k:'bl',label:'Metal block'},{k:'wa',label:'Water'}];
const MKEY='cp-specific-heat-method';
let method='bl';try{const v=localStorage.getItem(MKEY);if(METHODS.some(m=>m.k===v))method=v;}catch(e){}
const methodGames=[];
function methodPicker(panel){
  const w=mk('div','method-pick');
  w.innerHTML='<span class="method-lab" id="ml-'+panel+'">Method type</span><div class="seg" role="group" aria-labelledby="ml-'+panel+'">'+
    METHODS.map(m=>'<button type="button" data-m="'+m.k+'">'+m.label+'</button>').join('')+'</div>';
  $('#panel-'+panel+' .acts').prepend(w);
  w.addEventListener('click',e=>{const b=e.target.closest('button[data-m]');if(b)setMethod(b.dataset.m);});
}
function forMethod(body,k){body.closest('.act').dataset.m=k;}
function setMethod(k){
  method=k;try{localStorage.setItem(MKEY,k);}catch(e){}
  $$('.method-pick button').forEach(b=>{const on=b.dataset.m===k;b.classList.toggle('is-on',on);b.setAttribute('aria-pressed',String(on));});
  $$('.act[data-m]').forEach(a=>{a.hidden=a.dataset.m!==k;});
  raf(()=>methodGames.forEach(g=>g.reflow&&g.reflow()));
}
reflowers.push(()=>raf(()=>methodGames.forEach(g=>g.reflow&&g.reflow())));
const ORDER_INTRO='Put the steps in the order you would do them. Drag the ≡ handle, or use the ▲▼ buttons.';

/* ================= VARIABLES ================= */
{
  const body=act('variables','Sort','Which kind of variable is it?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'i',label:'Independent',hint:'You change it',color:'--c1',soft:'--c1-soft'},
    {id:'d',label:'Dependent',hint:'You measure it',color:'--c2',soft:'--c2-soft'},
    {id:'c',label:'Control',hint:'You keep it the same',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'The energy supplied by the heater',cat:'i'},
    {id:'4',text:'The rise in temperature of the block',cat:'d'},
    {id:'5',text:'The mass of the block',cat:'c'},
    {id:'6',text:'The power of the heater',cat:'c'},
    {id:'7',text:'The lagging round the block',cat:'c'},
    {id:'8',text:'The starting temperature of the block',cat:'c'}
  ]});
}
{
  const body=act('variables','Multiple choice','A new question to test','');
  createPredict({host:body,q:'Aidan wants to find out whether thicker lagging gives a value of c closer to the accepted value. What is his independent variable?',options:[
    {text:'The thickness of the lagging',correct:true},
    {text:'The energy the heater supplies',why:'He should supply the same energy each time, so it is a control variable.'},
    {text:'The value of c he calculates',why:'That is what he works out from each test, so it is the dependent variable.'},
    {text:'The mass of the aluminium block',why:'He should use the same block every time, so its mass is a control variable.'}
  ],explain:'The independent variable is the one he changes on purpose: the thickness of the lagging. He keeps the block and the energy the same, and compares the values of c.'});
}

/* ================= METHOD ================= */
methodPicker('method');
{
  const body=act('method','Order','Heat a metal block',ORDER_INTRO);forMethod(body,'bl');
  createReorder({host:body,steps:[
    {id:'a',text:'Measure the mass of the aluminium block on a balance.'},
    {id:'b',text:'Put the heater in one hole and the thermometer in the other, with a few drops of water round the bulb.'},
    {id:'c',text:'Wrap the block in lagging.'},
    {id:'d',text:'Read the starting temperature of the block.'},
    {id:'e',text:'Connect the heater to the joulemeter and the power supply. Switch on and start the stopwatch.'},
    {id:'f',text:'Read the thermometer every minute. After 10 minutes, switch off the heater and read the joulemeter: this is the energy supplied, ΔQ.'},
    {id:'g',text:'Keep reading the thermometer after switching off, until the temperature stops rising. Record the maximum temperature.'},
    {id:'h',text:'Temperature change ΔT = maximum temperature − starting temperature. Then c = [[ΔQ|m × ΔT]].'},
    {id:'i',text:'Also plot temperature against time while the heater is on. With the heater’s power P, c = [[P|m × gradient]].'}
  ],constraints:[['a','h'],['b','d'],['c','e'],['d','e'],['e','f'],['f','g'],['g','h'],['f','i']],
  why:'The starting temperature is read before the heater goes on, and the maximum temperature comes after it is switched off, because the hot heater keeps passing energy to the block for a while. Without a joulemeter, measure the energy as voltmeter reading × ammeter reading × time.'});
}
{
  const body=act('method','Order','Heat some water',ORDER_INTRO);forMethod(body,'wa');
  createReorder({host:body,steps:[
    {id:'a',text:'Measure the mass of the empty polystyrene cup on a balance.'},
    {id:'b',text:'Add the water and measure the mass again. Mass of water = mass of cup and water − mass of cup.'},
    {id:'c',text:'Put the heater and the thermometer in the water. Connect a voltmeter across the heater and an ammeter in series with it.'},
    {id:'d',text:'Stir the water and read its starting temperature.'},
    {id:'e',text:'Switch on the heater and start the stopwatch. Read the voltmeter and the ammeter.'},
    {id:'f',text:'Keep stirring, so all the water is at the same temperature. Read the temperature every minute.'},
    {id:'g',text:'Switch off after 10 minutes. Keep stirring and reading until the temperature stops rising, and record the maximum.'},
    {id:'h',text:'Energy supplied ΔQ = V × I × t, and ΔT = maximum temperature − starting temperature. Then c = [[ΔQ|m × ΔT]].'},
    {id:'i',text:'Repeat the experiment and find the mean value of c.'}
  ],constraints:[['a','b'],['b','c'],['c','d'],['d','e'],['e','f'],['f','g'],['g','h'],['h','i']],
  why:'The mass of water is found by difference, so the empty cup is weighed first. Stirring makes the thermometer read the temperature of all the water. A joulemeter, or ΔQ = P × t for a heater of known power, would also give the energy.'});
}
setMethod(method);

/* ================= ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Better results or safer?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'Better results',hint:'More accurate or more useful readings',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps people safe',hint:'Protects people and equipment',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Wrap the block in lagging',cat:'a'},
    {id:'2',text:'Put a few drops of water in the thermometer hole',cat:'a'},
    {id:'3',text:'Keep reading after switching off, to catch the highest temperature',cat:'a'},
    {id:'4',text:'Stir water as it heats, so it is all at the same temperature',cat:'a'},
    {id:'9',text:'Put a lid on the cup of water, so less evaporates',cat:'a'},
    {id:'5',text:'Let the heater cool down before you take it out',cat:'s'},
    {id:'7',text:'Keep water away from the power supply and its plugs',cat:'s'},
    {id:'8',text:'Only switch the heater on when it is in the block or water',cat:'s'}
  ]});
}
{
  const body=act('accuracy','Multiple choice','Why is the value too high?','');
  createPredict({host:body,q:'Charlotte’s value for aluminium is 993 J/kg °C. The accepted value is 900 J/kg °C. What is the most likely reason?',options:[
    {text:'Energy also heated the thermometer and surroundings',correct:true},
    {text:'The joulemeter counted less energy than was supplied',why:'Less energy counted would make ΔQ too small, and her value of c lower, not higher.'},
    {text:'Her block had less mass than the 1.00 kg she used',why:'A smaller block would warm up more, so ΔT would be bigger. With 1.00 kg in the calculation, her value of c would come out too low, not too high.'},
    {text:'She read the highest temperature far too early',why:'She kept reading until 12 minutes, after the temperature had stopped rising.'}
  ],explain:'Some of the energy also heats the thermometer, the heater and the surroundings (the air and the bench), not just the block. The block’s temperature change is smaller than it would be, and a smaller ΔT on the bottom of c = [[ΔQ|m × ΔT]] gives a bigger c.'});
}
{
  const body=act('accuracy','Multiple choice','Repeat it?','');
  createPredict({host:body,q:'Charlotte repeats her experiment three times and finds the mean value of c. Will the mean be closer to the accepted 900 J/kg °C?',options:[
    {text:'No: every repeat loses the same energy',correct:true},
    {text:'Yes: repeating always removes the errors',why:'Repeating averages out random errors, but energy lost to the surroundings makes every value too high.'},
    {text:'Yes: the block warms up more each time',why:'She starts from the same temperature each time. The losses are the same in every repeat.'},
    {text:'No: repeating makes the value more random',why:'Repeating makes the mean more reliable. It just cannot fix an error that is the same every time.'}
  ],explain:'A mean of repeats is more reliable: it averages out random errors such as misreading the thermometer. But energy lost to the surroundings makes every value of c too high, so the mean is still too high. To get closer to 900 J/kg °C, cut the losses: thicker lagging, a lid on water.'});
}

/* ================= DO THE EXPERIMENT ================= */
// The student heats the lagged aluminium block 1 minute at a time and reads the thermometer close-up and the joulemeter.
// SH_T must match animations/specific-heat.html?show=measure&mat=al&lag=on (1.0 kg, 48 W, off at 10 min, 28 800 J;
// tools/CORE-PRACTICALS.md, "Measure modes", 5.14P).
const SH_T=[20.0,22.0,24.5,28.0,31.5,34.0,37.5,40.0,43.5,46.5,49.0,50.5,50.5];
let shTableM=null,shRows=()=>{};
{
  act('do','Your turn','Take your own readings','Read the thermometer in the close-up, to the nearest 0.5 °C, and write it in your table at 0 minutes. Press Heat for 1 minute and read it again. The heater switches off by itself after 10 minutes: carry on with Wait 1 minute to 12 minutes. Note the joulemeter reading at the end.');
}
frameAct('do','animations/specific-heat.html','measure&mat=al&lag=on','Specific heat capacity experiment: heat the aluminium block and read the thermometer every minute','specific heat capacity',false);
{
  const body=act('do','Calculate','Your results table','Write each temperature to the nearest 0.5 °C, then press Check.');
  shTableM=measTable(body,{beside:true,cols:['Time (min)','Temperature (°C)'],
    rows:SH_T.map((T,j)=>[j,{k:'T'+j,label:'Temperature at '+j+' minutes, in °C',ok:v=>near(v,T,0.25),fill:()=>dp(T,1)}]),
    hint:'Read the top of the red liquid against the scale. Each small mark is 1 °C.',
    done:'All correct. Now plot your results.',onChange:()=>shRows()});
}
{
  const body=act('do','Plot','Plot your results','Plot temperature (up the side) against time (along the bottom), as small crosses. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');
  const row=j=>{const t=shTableM&&shTableM.text('T'+j);return j+' min, '+(t?t+' °C':'your temperature');};
  createPlot({host:body,
    points:SH_T.map((T,j)=>({x:j,y:T})),
    rowText:p=>row(p.x),next:' The line is straight while the heater is on, then levels off after it is switched off.',
    graph:{xMin:0,xMax:12,yMin:20,yMax:55,xTicks:[0,2,4,6,8,10,12],yTicks:[20,25,30,35,40,45,50,55],minor:[1,1],snap:[1,0.5],xLabel:'time (min)',yLabel:'temperature (°C)',W:560,H:380}});
  shRows=()=>plotLabels(body,row);shRows();
}
{
  const body=act('do','Calculate','Work out c','The block’s mass is 1.0 kg. The joulemeter read 28 800 J when the heater switched off, and did not change after that.');
  createCalc({host:body,questions:[
    {q:'What is the temperature change, from the start to the maximum reading?',unit:'°C',answer:30.5,working:'ΔT = maximum temperature − starting temperature<br>ΔT = 50.5 − 20.0<br>ΔT = 30.5 °C'},
    {q:'Use ΔQ = m × c × ΔT to find the specific heat capacity of aluminium.',unit:'J/kg °C',answer:944,working:'ΔQ = m × c × ΔT<br>28 800 = 1.0 × c × 30.5<br>28 800 = 30.5 × c<br>c = [[28 800|30.5]]<br>c = 944 J/kg °C'}
  ]});
}
{
  const body=act('do','Predict','A slow start','');
  createPredict({host:body,q:'In the first 2 minutes the temperature rises 4.5 °C. After that it rises about 6 °C every 2 minutes. Why is the start slower?',options:[
    {text:'The heater must warm itself up before it heats the block',correct:true},
    {text:'The block is cold, so it needs more energy for each 1 °C',why:'The block’s specific heat capacity does not change with temperature here. The energy is going into the heater first.'},
    {text:'The joulemeter only starts counting after a minute',why:'The joulemeter counts from the moment the heater is switched on: 2880 J in the first minute, the same as every later minute.'},
    {text:'Energy is lost faster while the block is still cold',why:'A cold block loses the least energy, because it is closest to room temperature. The heater warming up is the cause.'}
  ],explain:'The heater must get hotter than the block before energy flows into it, so some of the energy at the start warms the heater. That is why a value of c from the steady middle part of the graph is more accurate.'});
}
{
  const body=act('do','Predict','After the heater is switched off','');
  createPredict({host:body,q:'The heater switched off at 10 minutes (49.0 °C), but at 11 minutes the reading was 50.5 °C. Why did it still rise?',options:[
    {text:'The hot heater was still passing energy to the block',correct:true},
    {text:'The joulemeter was still supplying energy to the heater',why:'The joulemeter reading stayed at 28 800 J, so no more energy was supplied after 10 minutes.'},
    {text:'The room was warming the block up through the lagging',why:'The room is cooler than the block, so energy flows out of the block, not in.'},
    {text:'The thermometer needs a minute to show each reading',why:'The thermometer kept up with the block before. The block really did get hotter.'}
  ],explain:'When it is switched off, the heater is hotter than the block, so it keeps heating the block for a short while. That is why you keep reading after switching off, until the temperature stops rising, and use the maximum reading.'});
}

/* ================= SHOW: the readings taken for you ================= */
{
  act('experiment','Your turn','Watch the readings','Press Experiment. Heat the aluminium block, lagged, with a reading every minute, and watch the table and graph fill in. Then do it again with no lagging, and try water and copper. For each one, how close is the value of c to the accepted value, and why is it usually too high?');
}
frameAct('experiment','animations/specific-heat.html','','Specific heat capacity animation: heating a block with an immersion heater','specific heat capacity',false);
{
  const body=act('experiment','Predict','Without the lagging','');
  createPredict({host:body,q:'The lagged aluminium block gives c = 944 J/kg °C. Charlotte heats the same block for the same time with no lagging. What value of c will she get?',options:[
    {text:'Higher than 944, further from 900',correct:true},
    {text:'Lower than 944, closer to 900',why:'Without lagging more energy escapes, so the block warms less. A smaller ΔT gives a bigger c.'},
    {text:'Exactly 944 again: c belongs to aluminium',why:'The real c does not change, but her measured value does, because more energy escapes.'},
    {text:'Much lower than 900 J/kg °C',why:'Losing energy makes ΔT smaller, which makes the value of c bigger, never smaller.'}
  ],explain:'With no lagging, more of the energy escapes to the surroundings, so the block’s rise in temperature is smaller. A smaller ΔT on the bottom of c = [[ΔQ|m × ΔT]] gives a bigger value of c: about 1090 J/kg °C in the animation.'});
}

/* ================= RESULTS ================= */
const SH=[[0,0,20.0],[2,5760,24.5],[4,11520,30.5],[6,17280,36.5],[8,23040,42.5],[10,28800,48.0],[12,28800,49.0]];
function shTable(){
  const t=mk('div','table-scroll');
  t.innerHTML='<table class="units res-tbl"><thead><tr><th>Time (min)</th>'+SH.map(r=>'<th>'+r[0]+'</th>').join('')+'</tr></thead><tbody><tr><th>Joulemeter (J)</th>'+SH.map(r=>'<td>'+fmt(r[1])+'</td>').join('')+'</tr><tr><th>Temperature (°C)</th>'+SH.map(r=>'<td>'+r[2].toFixed(1)+'</td>').join('')+'</tr></tbody></table>';
  return t;
}
{
  const body=act('results','Calculate','Work out c from Charlotte’s results','Charlotte’s aluminium block has a mass of 1.00 kg. She switched the heater off at 10 minutes and kept reading the thermometer.');
  body.appendChild(shTable());
  createCalc({host:body,questions:[
    {q:'Use the joulemeter reading at the end and the rise from the start to the maximum temperature to find c.',unit:'J/kg °C',answer:993,working:'ΔQ = 28 800 J<br>ΔT = 49.0 − 20.0<br>ΔT = 29.0 °C<br>ΔQ = m × c × ΔT<br>28 800 = 1.00 × c × 29.0<br>28 800 = 29.0 × c<br>c = [[28 800|29.0]]<br>c = 993 J/kg °C'},
    {q:'Now use only the readings from 2 to 8 minutes, while the temperature rises steadily. What value of c does this give?',unit:'J/kg °C',answer:960,working:'ΔQ = 23 040 − 5760<br>ΔQ = 17 280 J<br>ΔT = 42.5 − 24.5<br>ΔT = 18.0 °C<br>17 280 = 1.00 × c × 18.0<br>c = [[17 280|18.0]]<br>c = 960 J/kg °C'}
  ]});
}
{
  const body=act('results','Multiple choice','The line of best fit','');
  createPredict({host:body,q:'What line of best fit should Charlotte draw through her points from 2 to 10 minutes?',options:[
    {text:'One straight line close to all of the points',correct:true},
    {text:'Short straight lines that join each point to the next',why:'Joining the dots follows every small reading error. A line of best fit shows the trend.'},
    {text:'A curve that passes exactly through every point',why:'These points lie close to a straight line, because the energy goes in at a steady rate. A curve hides that.'},
    {text:'A straight line from the origin through the points',why:'The graph starts at 20 °C, not 0 °C, so the line should not be forced through the origin.'}
  ],explain:'While the heater is on, energy goes in at a steady rate, so the temperature rises steadily: draw one straight line of best fit through these points, with about as many above it as below. Its gradient = [[P|m × c]], where P is the heater’s power, so c = [[P|m × gradient]].'});
}
{
  const body=act('results','Multiple choice','An anomalous result','');
  createPredict({host:body,q:'Aidan heats some water in a lagged beaker. Which reading is anomalous, and what should he do?',
    pre:'<div class="table-scroll"><table class="units res-tbl"><thead><tr><th>Time (min)</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr></thead><tbody><tr><th>Temperature (°C)</th><td>20.0</td><td>21.5</td><td>23.0</td><td>26.5</td><td>26.0</td><td>27.5</td></tr></tbody></table></div>',
    options:[
    {text:'3 min: repeat it, and leave it out of the line',correct:true},
    {text:'5 min: it is the highest, so leave it out',why:'27.5 °C fits the pattern of 1.5 °C each minute. Being the highest does not make a result anomalous.'},
    {text:'3 min: average it in with the other readings',why:'Averaging an anomalous result in pulls the line away from the true trend. Leave it out of the line.'},
    {text:'None: the temperature always goes up, so all fit',why:'At 3 minutes it jumps 3.5 °C, then falls at 4 minutes. That breaks the steady 1.5 °C each minute.'}
  ],explain:'The water warms by about 1.5 °C each minute, so at 3 minutes it should be about 24.5 °C, not 26.5 °C. Perhaps the water was not stirred, or the bulb touched the heater. Repeat the reading if you can, and leave it out of the line of best fit.'});
}

/* ================= GRAPH ANALYSIS ================= */
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
    {q:'Sample B: use your answer to find its specific heat capacity.',unit:'J/kg °C',answer:900,working:'ΔQ = 18 kJ = 18 000 J<br>ΔQ = m × c × ΔT<br>18 000 = 1.0 × c × 20<br>18 000 = 20 × c<br>c = [[18 000|20]]<br>c = 900 J/kg °C'}
  ]});
}
{
  const body=act('graphs','Multiple choice','Which line is water?','');
  createPredict({host:body,q:'Look at the graph above. Which line is the water?',options:[
    {text:'C: it needs the most energy for each 1 °C',correct:true},
    {text:'A: it has the steepest line on the graph',why:'The steepest line has the biggest rise for each kilojoule, so it needs the least energy: that is the iron.'},
    {text:'B: its line is between the other two lines',why:'B needs 0.9 kJ for each 1 °C: that is the aluminium.'},
    {text:'You cannot tell from a graph of this kind',why:'You can: the sample needing the most energy for each 1 °C has the biggest specific heat capacity, and that is water.'}
  ],explain:'Water has the biggest specific heat capacity (4200 J/kg °C), so it warms up the least for each kilojoule. Its line is the least steep. A is iron (450 J/kg °C) and B is aluminium (900 J/kg °C).'});
}
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
  const body=act('graphs','Multiple choice','Is steeper always bigger c?','');
  createPredict({host:body,q:'Camila says, “On these graphs, the steeper line always has the bigger specific heat capacity.” Is she right?',options:[
    {text:'Only when energy is plotted up the side',correct:true},
    {text:'Yes, on every graph like these',why:'Look at the first graph: with rise in temperature up the side, the steepest line (A) is iron, the smallest c.'},
    {text:'Only when the rise is plotted up the side',why:'With the rise up the side, a steeper line means more degrees for each kilojoule, so a smaller c.'},
    {text:'No: c cannot be seen on a graph',why:'You can see it from the slope; you just have to check which way round the axes are.'}
  ],explain:'Always check the axes. Energy up the side: steeper means a bigger c. Rise in temperature up the side: steeper means a smaller c (for samples of the same mass).'});
}
