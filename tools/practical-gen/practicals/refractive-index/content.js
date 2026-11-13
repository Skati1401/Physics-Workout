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
function tableHTML(head,rows){return '<div class="table-scroll"><table class="units res-tbl"><thead><tr>'+head.map(h=>'<th>'+h+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map(c=>'<td>'+c+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';}
function lab(g0,t,x,y){return '<circle cx="'+g0.gx(x)+'" cy="'+g0.gy(y)+'" r="13" fill="var(--panel)" stroke="var(--ink)" stroke-width="2"/><text x="'+g0.gx(x)+'" y="'+(g0.gy(y)+5)+'" text-anchor="middle" font-size="14" fill="var(--ink)">'+t+'</text>';}
const sinD=a=>Math.sin(a*Math.PI/180);

/* ================= VARIABLES ================= */
{
  const body=act('variables','Sort','Which kind of variable is it?','Aidan measures the angle of refraction for several angles of incidence. Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'i',label:'Independent',hint:'You change it',color:'--c1',soft:'--c1-soft'},
    {id:'d',label:'Dependent',hint:'You measure it',color:'--c2',soft:'--c2-soft'},
    {id:'c',label:'Control',hint:'You keep it the same',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'The angle of incidence, i',cat:'i'},
    {id:'2',text:'The angle of refraction, r',cat:'d'},
    {id:'3',text:'Using the same glass block for every reading',cat:'c'},
    {id:'4',text:'The colour of the light',cat:'c'},
    {id:'5',text:'Using the same narrow ray (the same slit)',cat:'c'}
  ]});
}
{
  const body=act('variables','Multiple choice','One colour of light','');
  createPredict({host:body,q:'Why is it better to use one colour of light (for example a red filter) than white light?',options:[
    {text:'Each colour has its own n, so white light spreads',correct:true},
    {text:'White light is too bright to mark on the paper',why:'White light is easy to see. The problem is that it spreads into colours inside the glass.'},
    {text:'Red light is not refracted, so it is easier to see',why:'Red light is refracted, just a little less than the other colours.'},
    {text:'A red filter keeps the ray box cooler and safer',why:'The filter does not make the ray box safer. It is about the colours spreading.'}
  ],explain:'Each colour has a slightly different refractive index, so in white light the refracted ray spreads out a little and is hard to measure. One colour gives one sharp ray and one value of n.'});
}

/* ================= METHOD ================= */
{
  const body=act('method','Order','Measure i and r for a range of angles','Put the steps in the order you would do them. Drag the ≡ handle, or use the ▲▼ buttons.');
  createReorder({host:body,steps:[
    {id:'a',text:'Draw round the rectangular glass block on a sheet of plain paper.'},
    {id:'b',text:'Draw a normal at 90° to one long side, near one end.'},
    {id:'c',text:'Shine a narrow ray from the ray box at the point where the normal meets the block, at 10° to the normal.'},
    {id:'d',text:'Mark the incident ray and the emergent ray with two crosses each, far apart.'},
    {id:'e',text:'Repeat for angles of incidence of 20°, 30° … up to 70°, marking each pair of rays.'},
    {id:'f',text:'Remove the block. Join the crosses, draw each refracted ray through the block, and measure r from the normal with a protractor.'},
    {id:'g',text:'Work out sin i and sin r for each angle of incidence.'},
    {id:'h',text:'Plot sin i against sin r, draw a straight line of best fit through the origin and find its gradient.'}
  ],constraints:[['a','b'],['b','c'],['c','d'],['d','e'],['e','f'],['f','g'],['g','h']],
  why:'Draw the outline and the normal first, so the block can be put back in place. Mark every ray before removing the block, then measure, calculate and plot.'});
}

/* ================= ACCURACY ================= */
{
  const body=act('accuracy','Sort','Better value of n, or safer?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'Better value of n',hint:'More accurate or more reliable',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps people safe',hint:'Protects people and equipment',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Use a wide range of angles of incidence, 10° to 70°',cat:'a'},
    {id:'2',text:'Find n from the gradient of a graph, not from one pair of angles',cat:'a'},
    {id:'3',text:'Use one colour of light, so the ray does not spread',cat:'a'},
    {id:'4',text:'Measure both angles from the normal, not from the surface',cat:'a'},
    {id:'5',text:'Let the ray box cool before moving it',cat:'s'},
    {id:'6',text:'Never point a laser at anyone’s eyes',cat:'s'},
    {id:'7',text:'In the dimmed room, keep bags and stools out of the way',cat:'s'}
  ]});
}
{
  const body=act('accuracy','Multiple choice','Small angles','');
  createPredict({host:body,q:'David measures i = 5° and r = 3°. Why is this pair the least reliable?',options:[
    {text:'1° of error gives a large percentage uncertainty',correct:true},
    {text:'Light is not refracted at small angles of incidence',why:'It is refracted; the change of direction is just small.'},
    {text:'A protractor cannot read angles below 10°',why:'A protractor reads to 1° at any angle.'},
    {text:'Small angles always give total internal reflection',why:'Total internal reflection needs glass to air and a large angle.'}
  ],explain:'A protractor reads to the nearest degree. An error of 1° in 3° is a percentage uncertainty of over 30%, but in 35° it is under 3%. Small angles have a larger percentage uncertainty, so use larger angles, over a wide range.'});
}

/* ================= DO THE EXPERIMENT ================= */
// The student traces the ray at seven places for the ray box and reads i and r on the protractor close-up.
// RI_I and RI_R must match animations/refraction.html?show=measure&part=index (tools/CORE-PRACTICALS.md, "Measure modes", 3.19).
const RI_I=[10,20,30,40,50,60,70], RI_R=[7,13,19,25,31,35,39];
let riTable=null;
{
  act('do','Your turn','Take your own readings','Choose position 1 for the ray box and press Trace the ray. Read the angle of incidence (pink) and the angle of refraction (orange) on the protractor close-up, and write them in your table. Do the same for positions 2 to 7. Then work out sin i and sin r, to 3 decimal places.');
}
frameAct('do','animations/refraction.html','measure&part=index','Refractive index experiment: trace the ray through a rectangular block and read the protractor','refraction of light',false);
{
  const body=act('do','Calculate','Your results table','Write each angle to the nearest degree, and each sine to 3 decimal places. Press Check.');
  const sinOk=k=>(v,g)=>near(v,sinD(g(k)),0.0015);
  riTable=measTable(body,{beside:true,cols:['Position','i (°)','r (°)','sin i','sin r'],
    rows:RI_I.map((a,j)=>[j+1,
      {k:'i'+j,label:'Angle of incidence at position '+(j+1),ok:v=>near(v,a,1),fill:()=>String(a)},
      {k:'r'+j,label:'Angle of refraction at position '+(j+1),ok:v=>near(v,RI_R[j],1),fill:()=>String(RI_R[j])},
      {k:'si'+j,label:'sin i at position '+(j+1),need:['i'+j],ok:sinOk('i'+j),fill:g=>dp(sinD(g('i'+j)),3)},
      {k:'sr'+j,label:'sin r at position '+(j+1),need:['r'+j],ok:sinOk('r'+j),fill:g=>dp(sinD(g('r'+j)),3)}]),
    hint:'Read each angle from 0° at the normal. Check your calculator is in degrees.',
    done:'All correct. Now plot your results.',onChange:()=>riRows()});
}
let riRows=()=>{};
{
  const body=act('do','Plot','Plot your results','Plot sin i (up the side) against sin r (along the bottom) from your table, as small crosses. Round to 2 decimal places. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');
  const row=i=>{const a=riTable&&riTable.text('sr'+i),b=riTable&&riTable.text('si'+i);return 'Position '+(i+1)+': '+(a&&b?'sin r = '+a+', sin i = '+b:'your values');};
  createPlot({host:body,
    points:RI_I.map((a,j)=>({x:+dp(sinD(RI_R[j]),3),y:+dp(sinD(a),3),j:j})),
    rowText:p=>row(p.j),next:' Now find the gradient of the line of best fit below.',
    graph:{xMin:0,xMax:0.7,yMin:0,yMax:1,xTicks:[0,0.1,0.2,0.3,0.4,0.5,0.6,0.7],yTicks:[0,0.2,0.4,0.6,0.8,1],minor:[0.02,0.02],snap:[0.01,0.01],xLabel:'sin r',yLabel:'sin i',W:560,H:480}});
  riRows=()=>plotLabels(body,row);riRows();
}
{
  const body=act('do','Calculate','The refractive index','Your points lie on a straight line through the origin. The line of best fit passes through (0, 0) and (0.60, 0.90).');
  createCalc({host:body,questions:[
    {q:'Find the gradient of the line. This is the refractive index of the glass.',unit:'',answer:1.5,working:'gradient = [[change in sin i|change in sin r]]<br>gradient = [[0.90 − 0|0.60 − 0]]<br>n = 1.50'}
  ]});
}
{
  const body=act('do','Predict','Each 10° more','');
  createPredict({host:body,q:'Look at your table. i goes up by 10° each time. What happens to the angle of refraction?',options:[
    {text:'It goes up by a smaller amount each time',correct:true},
    {text:'It goes up by the same amount each time',why:'From 10° to 20° r goes up by 6°, but from 60° to 70° only by 4°.'},
    {text:'It goes up by a bigger amount each time',why:'Look at your readings: the steps in r get smaller as i gets bigger.'},
    {text:'It goes down as the ray gets more slanted',why:'A bigger angle of incidence always gives a bigger angle of refraction.'}
  ],explain:'r increases at a decreasing rate: i and r are not proportional, so a graph of r against i curves. sin i and sin r are proportional, which is why we plot those.'});
}

/* ================= SHOW: the readings taken for you ================= */
{
  act('experiment','Your turn','Watch the readings','Press Experiment and choose the rectangular block. Take readings for angles of incidence from 10° to 80°, and watch the table and the graph of sin i against sin r fill in. What is the gradient? Does r go up by the same amount for each 10°?');
}
frameAct('experiment','animations/refraction.html','','Refraction of light animation: a ray box, a glass block and a protractor, with a graph of sin i against sin r','refraction of light',false);
{
  const body=act('experiment','Predict','A different glass','');
  createPredict({host:body,q:'Henry repeats the experiment with a glass that has a bigger refractive index. How does his graph of sin i against sin r change?',options:[
    {text:'It is steeper, through the origin',correct:true},
    {text:'It is less steep, through the origin',why:'The gradient is the refractive index, so a bigger n gives a steeper line.'},
    {text:'It is the same line as before',why:'The gradient is n, so a different n gives a different gradient.'},
    {text:'It starts to curve at large angles',why:'sin i is still proportional to sin r, so it is still a straight line.'}
  ],explain:'The gradient of sin i against sin r is n. A glass with a bigger refractive index bends the light more (smaller r for the same i), so the line is steeper. It still goes through the origin.'});
}

/* ================= RESULTS ================= */
{
  const body=act('results','Multiple choice','The line of best fit','');
  createPredict({host:body,q:'What line of best fit should Aidan draw through his points of sin i against sin r?',options:[
    {text:'One straight line through the origin',correct:true},
    {text:'Short straight lines joining each point',why:'Joining the dots follows every small error. A line of best fit shows the trend.'},
    {text:'A smooth curve that bends over at the top',why:'sin i is proportional to sin r, so the points lie on a straight line.'},
    {text:'A straight line that misses the origin',why:'When i = 0, r = 0 too, so the line goes through the origin.'}
  ],explain:'sin i is directly proportional to sin r, so the best-fit line is straight. At i = 0 there is no bending (r = 0), so it passes through the origin. Its gradient is n.'});
}
{
  const body=act('results','Multiple choice','An anomalous result','');
  createPredict({host:body,q:'Fatimah measures these angles. Which reading is anomalous, and what should she do?',
    pre:tableHTML(['i (°)','20','30','40','50','60'],[['r (°)','13','19','30','31','35']]),
    options:[
    {text:'40°: repeat it, leave it out of the line',correct:true},
    {text:'60°: it is the biggest, so leave it out',why:'35° fits the pattern. Being the biggest does not make a reading anomalous.'},
    {text:'40°: keep it, and use it in the mean of n',why:'An anomalous reading drags the mean away. Repeat it, and leave it out.'},
    {text:'None: every one of the readings is used',why:'r should rise more slowly each time. 30° at 40° breaks that pattern.'}
  ],explain:'r should increase at a decreasing rate: 13°, 19°, about 25°, 31°, 35°. 30° at i = 40° is too big, perhaps a cross marked in the wrong place. Repeat it, and leave it out of the line of best fit.'});
}
{
  const body=act('results','Multiple choice','Why use a graph?','');
  createPredict({host:body,q:'Why does a graph of sin i against sin r give a better value of n than one pair of angles?',options:[
    {text:'All readings are used, so errors average',correct:true},
    {text:'One pair of angles always gives the wrong n',why:'One pair can give a good value, but one badly placed cross would spoil it.'},
    {text:'A graph does not need a protractor at all',why:'You still need a protractor to measure every angle you plot.'},
    {text:'A graph gives the unit of refractive index',why:'Refractive index has no unit: it is a ratio.'}
  ],explain:'The line of best fit uses all the readings, so small random errors in each one average out, and an anomalous point stands out and can be left out. In an exam, a bare “repeat and average” does not score: say what you repeat (the readings at each angle of incidence) and what you average (the refractive index), or plot sin i against sin r and use the gradient.'});
}

/* ================= GRAPH ANALYSIS ================= */
const GA={xMin:0,xMax:0.8,yMin:0,yMax:1,xTicks:[0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8],yTicks:[0,0.2,0.4,0.6,0.8,1],xLabel:'sin r',yLabel:'sin i',W:560,H:340};
{
  const body=act('graphs','Calculate','Two materials','The graph shows sin i against sin r for a glass block A and for water in a thin clear box, B. Read values off each line to find its gradient.');
  const split=mk('div','graph-split');body.appendChild(split);
  const g0=lineGraph(Object.assign({points:[[0,0]]},GA));
  split.appendChild(mk('div','graph-box',lineGraph(Object.assign({label:'sin i against sin r for lines A and B',segments:[{pts:[[0,0],[2/3,1]]},{pts:[[0,0],[0.75,1]],cls:'g-line-c'}],
    extra:lab(g0,'A',0.56,0.93)+lab(g0,'B',0.72,0.86)},GA)).svg));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'Line A: the refractive index of the glass',unit:'',answer:1.5,working:'At sin r = 0.60, sin i = 0.90<br>gradient = [[change in sin i|change in sin r]]<br>gradient = [[0.90 − 0|0.60 − 0]]<br>n = 1.50'},
    {q:'Line B: the refractive index of water',unit:'',answer:1.33,working:'At sin r = 0.60, sin i = 0.80<br>gradient = [[change in sin i|change in sin r]]<br>gradient = [[0.80 − 0|0.60 − 0]]<br>n = 1.33'}
  ]});
}
{
  const body=act('graphs','Multiple choice','Why sin i and sin r?','');
  createPredict({host:body,q:'Why plot sin i against sin r, rather than i against r?',options:[
    {text:'It gives a straight line whose gradient is n',correct:true},
    {text:'Angles cannot be plotted on a graph axis',why:'They can: r against i is a curve, which is harder to use.'},
    {text:'sin i and sin r are bigger, so easier to plot',why:'sin values are less than 1, so they are smaller, not bigger.'},
    {text:'A graph of i against r is a straight line',why:'r increases at a decreasing rate, so i against r curves.'}
  ],explain:'n = [[sin i|sin r]], so sin i = n × sin r: a straight line through the origin with gradient n. i against r curves, so it has no single gradient to read.'});
}
const GB={xMin:0,xMax:1,yMin:0,yMax:0.8,xTicks:[0,0.2,0.4,0.6,0.8,1],yTicks:[0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8],xLabel:'sin i',yLabel:'sin r',W:560,H:340};
{
  const body=act('graphs','Calculate','The axes the other way round','Some exam questions plot sin r up the side and sin i along the bottom. Find the gradient of this line for a glass block, then the refractive index.');
  const split=mk('div','graph-split');body.appendChild(split);
  split.appendChild(mk('div','graph-box',lineGraph(Object.assign({label:'sin r against sin i for a glass block',segments:[{pts:[[0,0],[1,2/3]]}]},GB)).svg));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'The gradient of the line',unit:'',answer:0.667,working:'At sin i = 0.90, sin r = 0.60<br>gradient = [[change in sin r|change in sin i]]<br>gradient = [[0.60 − 0|0.90 − 0]]<br>gradient = 0.667'},
    {q:'The refractive index of the glass',unit:'',answer:1.5,working:'gradient = [[sin r|sin i]] = [[1|n]]<br>n = [[1|gradient]]<br>n = [[1|0.667]]<br>n = 1.50'}
  ]});
}
{
  const body=act('graphs','Multiple choice','Steeper, with the axes swapped','');
  createPredict({host:body,q:'Nabil plots sin r up the side and sin i along the bottom for two blocks. Which block has the bigger refractive index?',options:[
    {text:'The block with the less steep line',correct:true},
    {text:'The block with the steeper of the lines',why:'With sin r up the side, the gradient is [[1|n]], so a steeper line means a smaller n.'},
    {text:'The block whose line is the longer one',why:'The length of the line depends on the range of angles used, not on n.'},
    {text:'You cannot tell from axes this way round',why:'You can: n = [[1|gradient]]. Just check which way round the axes are.'}
  ],explain:'With sin r up the side, gradient = [[sin r|sin i]] = [[1|n]]. A bigger n gives a smaller gradient: a less steep line.'});
}
