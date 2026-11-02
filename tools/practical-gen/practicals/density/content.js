/* ================= METHOD TYPE: regular block, irregular object or liquid =================
   Each way of measuring the volume has its own Overview passage and its own Order; the switch is shared by
   the Overview and Method tabs and remembered in this browser (copied from the 5.14P page). */
const METHODS=[{k:'reg',label:'Regular block'},{k:'irr',label:'Irregular object'},{k:'liq',label:'Liquid'}];
const MKEY='cp-density-method';
let method='reg';try{const v=localStorage.getItem(MKEY);if(METHODS.some(m=>m.k===v))method=v;}catch(e){}
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
function clozeAct(panel,k,title,parts,distractors){
  const body=act(panel,'Fill in the blanks',title,'Drag a word into each gap, or tap a word and then tap a gap. Some words are not needed.');
  forMethod(body,k);
  const cloze=mk('div','cloze'),slots=[],chips=[];
  parts.forEach(p=>{
    if(typeof p==='string')cloze.appendChild(document.createTextNode(p));
    else{const s=mk('span','blank');cloze.appendChild(s);slots.push({id:p[0],el:s,answer:p[1]});chips.push({id:'c-'+p[0],text:p[1]});}
  });
  distractors.forEach((t,i)=>chips.push({id:'d'+i,text:t}));
  body.appendChild(cloze);
  body.appendChild(mk('div','pool-label','Word bank'));
  const pool=mk('div','chip-pool');body.appendChild(pool);
  const g={};
  const b=bar(body,[{label:'Check',primary:true,fn:()=>g.check()},{label:'Shuffle again',fn:()=>g.reset()}]);
  const score=mk('span','score');b.el.insertBefore(score,b.msg);
  Object.assign(g,createBlankGame({slots,pool,chips,msg:b,score,isCorrect:(c,s)=>c.text===s.answer}));
}
const ORDER_INTRO='Put the steps in the order you would do them. Drag the ≡ handle, or use the ▲▼ buttons.';
const MATCH_INTRO='Pair each piece of equipment with its job. Drag one card onto the other, or tap one card and then the other.';

/* ================= 1. OVERVIEW ================= */
methodPicker('overview');
clozeAct('overview','reg','The practical with a regular block',[
  'Density is the mass of each unit of ',['r1','volume'],'. Measure the mass of a rectangular block on a ',['r2','balance'],', and its length, width and height with a ',['r3','ruler'],
  '. Its volume is length × width × height, in ',['r4','cm³'],'. Density is the mass divided by the volume, so a mass in grams and a volume in cm³ give a density in ',['r5','g/cm³'],
  '. To change this to kg/m³, ',['r6','multiply'],' by 1000. For a better result, measure several blocks of different sizes, all made of the same ',['r7','material'],
  '. A graph of mass against volume is a straight line through the ',['r8','origin'],', and its ',['r9','gradient'],' is the density.'
],['divide','cm²','weight','intercept']);
clozeAct('overview','irr','The practical with an irregular object',[
  'An irregular object, such as a stone, has no simple shape, so its volume is found by ',['i1','displacement'],'. Measure its mass on a balance first, while it is still ',['i2','dry'],
  '. Pour enough water to cover the stone into a measuring cylinder and read the level, V₁, with your eye level with the bottom of the ',['i3','meniscus'],'. Lower the stone gently on a ',['i4','thread'],
  ' until it is fully under the water, then read the new level, V₂. The volume of the stone is V₂ ',['i5','−'],' V₁. Or fill a ',['i6','eureka can'],
  ' until water runs out of its spout, then catch the water the stone pushes out in a measuring cylinder: it has the same ',['i7','volume'],' as the stone. Then density is the mass divided by the volume.'
],['+','wet','top','mass']);
clozeAct('overview','liq','The practical with a liquid',[
  'Measure the mass of an empty ',['l1','measuring cylinder'],'. Pour in some of the liquid and read its ',['l2','volume'],' with your eye level with the bottom of the meniscus. Measure the mass again: the mass of the liquid = total mass − mass of the cylinder when it was ',
  ['l3','empty'],'. (Or put the empty cylinder on the balance and press tare, so the balance shows the mass of the liquid alone.) Density is the mass of the liquid divided by its volume. Add more liquid and repeat. A graph of total mass against volume is a straight line that does not go through the ',['l4','origin'],
  ': it crosses the mass axis at the mass of the empty cylinder, and its ',['l5','gradient'],' is the density. Water has a density of 1.0 g/cm³, which is ',['l6','1000'],' kg/m³.'
],['1','100','full','area']);
setMethod(method);

/* ================= 2. METHOD ================= */
methodPicker('method');
{
  const body=act('method','Order','Density of a regular block',ORDER_INTRO);forMethod(body,'reg');
  createReorder({host:body,steps:[
    {id:'a',text:'Check the balance reads 0.0 g with nothing on it.'},
    {id:'b',text:'Measure the mass of the block on the balance.'},
    {id:'c',text:'Measure the length, width and height of the block with a ruler, each in two or three places, and use the mean.'},
    {id:'d',text:'Work out the volume: V = length × width × height.'},
    {id:'e',text:'Work out the density: ρ = [[m|V]].'},
    {id:'f',text:'Repeat with blocks of other sizes made of the same material. Plot mass against volume: the gradient is the density.'}
  ],constraints:[['a','b'],['b','e'],['c','d'],['d','e'],['e','f']],
  why:'The balance is zeroed before the block goes on, and the volume needs all three sides first. The mass and the sides can be measured in either order.'});
}
{
  const body=act('method','Order','Irregular stone: measuring cylinder',ORDER_INTRO);forMethod(body,'irr');
  createReorder({host:body,steps:[
    {id:'a',text:'Measure the mass of the stone on a balance while it is dry.'},
    {id:'b',text:'Pour enough water into a measuring cylinder to cover the stone. Read the level V₁, eye level with the bottom of the meniscus.'},
    {id:'c',text:'Tie the stone to a thread and lower it gently, so no water splashes out, until it is fully under the water.'},
    {id:'d',text:'Read the new level V₂ in the same way.'},
    {id:'e',text:'Work out the volume of the stone: V = V₂ − V₁.'},
    {id:'f',text:'Work out the density: ρ = [[m|V]].'}
  ],constraints:[['a','c'],['b','c'],['c','d'],['d','e'],['e','f'],['a','f']],
  why:'The stone is weighed while it is dry, before it goes in the water: a wet stone would weigh more. The water level is read before and after the stone goes in, and the density comes last.'});
}
{
  const body=act('method','Order','Irregular stone: eureka can',ORDER_INTRO);forMethod(body,'irr');
  createReorder({host:body,steps:[
    {id:'a',text:'Measure the mass of the stone on a balance while it is dry.'},
    {id:'b',text:'Fill the eureka can with water until it runs out of the spout.'},
    {id:'c',text:'When the dripping stops, put an empty measuring cylinder under the spout.'},
    {id:'d',text:'Lower the stone gently on a thread until it is fully under the water.'},
    {id:'e',text:'When the dripping stops, read the volume of water in the cylinder, eye level with the bottom of the meniscus.'},
    {id:'f',text:'This is the volume of the stone. Work out the density: ρ = [[m|V]].'}
  ],constraints:[['a','d'],['b','c'],['c','d'],['d','e'],['e','f'],['a','f']],
  why:'The can is filled to the spout and left to stop dripping before the cylinder goes under it, so the cylinder catches only the water the stone pushes out.'});
}
{
  const body=act('method','Order','Density of a liquid',ORDER_INTRO);forMethod(body,'liq');
  createReorder({host:body,steps:[
    {id:'a',text:'Measure the mass of the empty, dry measuring cylinder on a balance.'},
    {id:'b',text:'Pour in some of the liquid and stand the cylinder on a level bench. Read the volume, eye level with the bottom of the meniscus.'},
    {id:'c',text:'Measure the mass of the measuring cylinder and liquid together.'},
    {id:'d',text:'Work out the mass of the liquid: total mass − mass of the empty cylinder.'},
    {id:'e',text:'Work out the density: ρ = [[m|V]].'},
    {id:'f',text:'Add more liquid and repeat. Plot total mass against volume: the gradient is the density.'}
  ],constraints:[['a','b'],['b','c'],['c','d'],['d','e'],['e','f']],
  why:'The empty cylinder must be weighed before any liquid goes in, so the mass of the liquid can be found by difference. (Or press tare with the empty cylinder on the balance.)'});
}
{
  const body=act('method','Match','What each piece of equipment is for',MATCH_INTRO);
  methodGames.push(createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'b',l:'Top-pan balance',r:'Measures the mass of the object, or of the liquid and its container'},
    {id:'r',l:'Ruler',r:'Measures the length, width and height of a regular block'},
    {id:'m',l:'Measuring cylinder',r:'Measures the volume of a liquid, to the bottom of the meniscus'},
    {id:'e',l:'Eureka can',r:'Lets out through its spout the water an object pushes aside'},
    {id:'t',l:'Thin thread',r:'Lowers the object gently, so no water splashes out'},
    {id:'p',l:'Dropping pipette',r:'Adds the last few drops, so the level is exactly on a line'},
    {id:'q',l:'Two set squares',r:'Held against the ruler either side of a ball, to measure its diameter'}
  ]}));
}

/* ================= 3. VARIABLES ================= */
{
  const body=act('variables','Sort','Which kind of variable is it?','Ali measures five blocks of the same metal, all of different sizes, and plots mass against volume. Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'i',label:'Independent',hint:'You change it',color:'--c1',soft:'--c1-soft'},
    {id:'d',label:'Dependent',hint:'You measure it',color:'--c2',soft:'--c2-soft'},
    {id:'c',label:'Control',hint:'You keep it the same',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'The size of the block',cat:'i'},
    {id:'2',text:'The volume of the block',cat:'i'},
    {id:'3',text:'The mass of the block',cat:'d'},
    {id:'4',text:'The metal the blocks are made of',cat:'c'},
    {id:'5',text:'The balance used for every block',cat:'c'},
    {id:'6',text:'Whether each block is solid, with no holes',cat:'c'}
  ]});
}
{
  const body=act('variables','Predict','A new question to test','');
  createPredict({host:body,q:'Zahra wants to find out how the density of salt water changes as she dissolves more salt in it. What is her independent variable?',options:[
    {text:'The mass of salt she dissolves',correct:true},
    {text:'The density of the salt water',why:'That is what she works out each time, so it is the dependent variable.'},
    {text:'The volume of water she uses',why:'She should use the same volume of water each time, so it is a control variable.'},
    {text:'The mass of the empty cylinder',why:'She uses the same cylinder each time, so this does not change.'}
  ],explain:'The independent variable is the one she changes on purpose: the mass of salt. She keeps the volume of water the same, and measures the density each time.'});
}
{
  const body=act('variables','Predict','Zeroing the balance','');
  createPredict({host:body,q:'Before he starts, Ali checks the empty balance reads 0.0 g. Why?',options:[
    {text:'So the reading is the mass of the block alone',correct:true},
    {text:'So the balance can measure heavier blocks',why:'Zeroing does not change how much the balance can hold. It removes a zero error.'},
    {text:'So the reading is given to more decimal places',why:'The balance always reads to 0.1 g. Zeroing makes the reading start from 0.'},
    {text:'So the balance warms up before it is used',why:'Zeroing is not about warming up. If it read 0.4 g when empty, every mass would be 0.4 g too big.'}
  ],explain:'If the empty balance read 0.4 g, every mass would be 0.4 g too big: a zero error. Zeroing it first means each reading is the mass of the block alone.'});
}

/* ================= 4. EXPERIMENT ================= */
{
  act('experiment','Your turn','Take your own readings','Press Experiment. For the regular block, measure all five blocks of one material and look at the graph. For the irregular object, weigh it, read the water level, drag it down into the water, then read the level again; try the eureka can too. For the liquid, weigh the empty cylinder, then add the liquid a little at a time. Which graph goes through the origin, and why does the other one not?');
}
frameAct('experiment','animations/density.html','','Measuring density animation: a regular block, an irregular object and a liquid','measuring density',false);
{
  const body=act('experiment','Sort','Which method would you use?','How would you find the volume of each one? Sort each card, then press Check.');
  createSortGame({host:body,cats:[
    {id:'r',label:'Ruler',hint:'Measure the sides',color:'--c1',soft:'--c1-soft'},
    {id:'d',label:'Displacement',hint:'Measuring cylinder or eureka can',color:'--c2',soft:'--c2-soft'},
    {id:'l',label:'Pour into a measuring cylinder',hint:'',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'A wooden cube',cat:'r'},
    {id:'2',text:'A rectangular glass block',cat:'r'},
    {id:'3',text:'A small stone',cat:'d'},
    {id:'4',text:'A door key',cat:'d'},
    {id:'5',text:'A lump of modelling clay',cat:'d'},
    {id:'6',text:'Cooking oil',cat:'l'},
    {id:'7',text:'Salt water',cat:'l'}
  ]});
}
{
  const body=act('experiment','Predict','Waiting for the drips to stop','');
  createPredict({host:body,q:'Sophie fills a eureka can until water runs out of the spout. She puts the empty cylinder under the spout before the dripping stops. What goes wrong?',options:[
    {text:'The extra drips add to the volume she collects',correct:true},
    {text:'The stone will not sink to the bottom of the can',why:'The drips do not affect the stone. They would end up in her measuring cylinder.'},
    {text:'The water in the can is at the wrong temperature',why:'Temperature is not the problem. Any water still dripping would be collected too.'},
    {text:'The water level is too low to cover the stone',why:'The can is full to the spout. The problem is the drips getting into her cylinder.'}
  ],explain:'Any water still dripping from the spout would be collected with the water the stone pushes out, so her volume would be too big and her density too small.'});
}
{
  const body=act('experiment','Predict','The liquid graph','');
  createPredict({host:body,q:'Ali plots the total mass of the cylinder and liquid against the volume of liquid. Why does his line not go through the origin?',options:[
    {text:'The mass includes the empty cylinder',correct:true},
    {text:'The liquid gets denser as he adds more',why:'The density stays the same: the points still lie on a straight line.'},
    {text:'He did not zero the balance at the start',why:'Even with a zeroed balance, the empty cylinder has mass, and it is in every reading.'},
    {text:'Liquids never have mass at zero volume',why:'With no liquid there is no mass of liquid. The mass at zero volume is the cylinder’s.'}
  ],explain:'Every reading includes the mass of the empty cylinder, so the line crosses the mass axis at that mass. The gradient is still the density of the liquid.'});
}

/* ================= 5. RESULTS ================= */
// Zahra's five blocks of PVC plastic (density 1.40 g/cm³), measured with a ruler and a balance.
const RB=[['A',2.0,2.0,2.0,8.0,11.0],['B',4.0,2.0,2.0,16.0,22.5],['C',4.0,3.0,2.0,null,33.5],['D',4.0,4.0,2.0,32.0,45.0],['E',5.0,4.0,2.0,40.0,56.0]];
{
  const body=act('results','Calculate','Complete Zahra’s results','Zahra measured five blocks of the same plastic. One volume is missing.');
  const t=mk('div','table-scroll');
  t.innerHTML='<table class="units res-tbl"><thead><tr><th>Block</th><th>Length (cm)</th><th>Width (cm)</th><th>Height (cm)</th><th>Volume (cm³)</th><th>Mass (g)</th></tr></thead><tbody>'+
    RB.map(r=>'<tr><th>'+r[0]+'</th><td>'+r[1].toFixed(1)+'</td><td>'+r[2].toFixed(1)+'</td><td>'+r[3].toFixed(1)+'</td><td>'+(r[4]==null?'<b>?</b>':r[4].toFixed(1))+'</td><td>'+r[5].toFixed(1)+'</td></tr>').join('')+'</tbody></table>';
  body.appendChild(t);
  createCalc({host:body,questions:[
    {q:'What is the volume of block C?',unit:'cm³',answer:24,working:'V = l × w × h<br>V = 4.0 × 3.0 × 2.0<br>V = 24.0 cm³'},
    {q:'What is the density of block E?',unit:'g/cm³',answer:1.4,working:'ρ = [[m|V]]<br>ρ = [[56.0|40.0]]<br>ρ = 1.40 g/cm³'},
    {q:'Give the density of block E in kg/m³.',unit:'kg/m³',answer:1400,working:'1 g/cm³ = 1000 kg/m³<br>ρ = 1.40 × 1000<br>ρ = 1400 kg/m³'},
    {q:'A block of the same plastic has a volume of 60.0 cm³. Use your density to find its mass.',unit:'g',answer:84,working:'ρ = [[m|V]]<br>1.40 = [[m|60.0]]<br>m = 1.40 × 60.0<br>m = 84.0 g'}
  ]});
}
{
  const body=act('results','Plot','Plot Zahra’s results','Plot mass against volume for each block, as a small cross. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');
  createPlot({host:body,
    points:RB.map(r=>({x:r[4]==null?24:r[4],y:r[5]})),
    rowText:p=>'V = '+p.x.toFixed(1)+' cm³, m = '+p.y.toFixed(1)+' g',
    graph:{xMin:0,xMax:40,yMin:0,yMax:60,xTicks:[0,5,10,15,20,25,30,35,40],yTicks:[0,10,20,30,40,50,60],minor:[1,1],snap:[1,0.5],xLabel:'volume (cm³)',yLabel:'mass (g)',W:560,H:340}});
}
{
  const body=act('results','Predict','The line of best fit','');
  createPredict({host:body,q:'What line of best fit should Zahra draw through her points?',options:[
    {text:'One straight line through the origin',correct:true},
    {text:'Lines joining each point to the next',why:'A line of best fit is one smooth line that follows the trend, not dot-to-dot.'},
    {text:'A smooth curve that bends near the top',why:'The points lie on a straight line, so a curve does not fit them.'},
    {text:'A straight line that starts at block A',why:'A block with no volume has no mass, so the line should go through the origin.'}
  ],explain:'The points lie on a straight line, and a block with no volume has no mass, so the line goes through the origin: mass is directly proportional to volume.'});
}
{
  const body=act('results','Predict','What the gradient shows','');
  createPredict({host:body,q:'Zahra works out the gradient of her line of best fit. What does it tell her?',options:[
    {text:'The density of the plastic',correct:true},
    {text:'The mass of the largest block',why:'The gradient is the mass for each 1 cm³, not the mass of one block.'},
    {text:'The volume of each 1 g of plastic',why:'That would be volume divided by mass. With mass up the side, the gradient is mass divided by volume.'},
    {text:'The mistake in each of her readings',why:'The gradient shows the trend of all her readings, not the errors in them.'}
  ],explain:'Gradient = change in mass divided by change in volume, which is the mass of each 1 cm³: the density. Using all five points gives a better value than one block alone.'});
}
{
  const body=act('results','Predict','An anomalous result','');
  createPredict({host:body,q:'Ali’s blocks are made of another plastic. Which block gives an anomalous result, and what should he do about it?',
    pre:'<div class="table-scroll"><table class="units res-tbl"><thead><tr><th>Block</th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th></tr></thead><tbody><tr><th>Volume (cm³)</th><td>8.0</td><td>16.0</td><td>24.0</td><td>32.0</td><td>40.0</td></tr><tr><th>Mass (g)</th><td>9.6</td><td>19.3</td><td>24.5</td><td>38.3</td><td>48.0</td></tr></tbody></table></div>',
    options:[
    {text:'C: measure it again, and leave it out of the line',correct:true},
    {text:'E: it has the biggest mass, so it must be wrong',why:'E fits the pattern: 1.2 g for each 1 cm³, the same as A, B and D.'},
    {text:'C: draw the line of best fit through it anyway',why:'An anomalous point does not fit the pattern, so it should not pull the line away from the others.'},
    {text:'None: the mass always goes up, so all fit the pattern',why:'C should be about 28.8 g. At 24.5 g it is well below the line through the others.'}
  ],explain:'The others all have about 1.2 g for each 1 cm³, so C should be about 28.8 g. Perhaps it has a hole inside, or a side was misread. Measure it again if you can, and leave it out of the line of best fit.'});
}

/* ================= 6. GRAPHS ================= */
function lab(g0,t,x,y){return '<circle cx="'+g0.gx(x)+'" cy="'+g0.gy(y)+'" r="13" fill="var(--panel)" stroke="var(--ink)" stroke-width="2"/><text x="'+g0.gx(x)+'" y="'+(g0.gy(y)+5)+'" text-anchor="middle" font-size="14" fill="var(--ink)">'+t+'</text>';}
const GM={xMin:0,xMax:40,yMin:0,yMax:160,xTicks:[0,5,10,15,20,25,30,35,40],yTicks:[0,20,40,60,80,100,120,140,160],xLabel:'volume (cm³)',yLabel:'mass (g)',W:560,H:340};
function massGraph(){
  const g0=lineGraph(Object.assign({points:[[0,0]]},GM));
  return lineGraph(Object.assign({label:'Mass against volume for materials P and Q',segments:[{pts:[[0,0],[20,160]]},{pts:[[0,0],[40,108]],cls:'g-line-b'}],
    extra:lab(g0,'P',16,150)+lab(g0,'Q',37,86)},GM)).svg;
}
{
  const body=act('graphs','Calculate','Read the graph','The graph shows mass against volume for two materials, P and Q. Read your answers off the graph.');
  const split=mk('div','graph-split');body.appendChild(split);
  split.appendChild(mk('div','graph-box',massGraph()));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'P: what is the mass of 15 cm³?',unit:'g',answer:120,working:'Read up from 15 cm³ to line P, then across.<br>mass = 120 g'},
    {q:'Q: what volume has a mass of 54 g?',unit:'cm³',answer:20,working:'Read across from 54 g to line Q, then down.<br>volume = 20 cm³'},
    {q:'Q: use the point at 40 cm³ to find its density.',unit:'g/cm³',answer:2.7,working:'At 40 cm³, m = 108 g<br>ρ = [[m|V]]<br>ρ = [[108|40]]<br>ρ = 2.70 g/cm³'},
    {q:'P: what is its density?',unit:'g/cm³',answer:8,working:'At 20 cm³, m = 160 g<br>ρ = [[m|V]]<br>ρ = [[160|20]]<br>ρ = 8.00 g/cm³'}
  ]});
}
{
  const body=act('graphs','Predict','Which is denser?','');
  createPredict({host:body,q:'On this graph (mass up the side), what does the steeper line show?',options:[
    {text:'The material with the bigger density',correct:true},
    {text:'The material with the smaller density',why:'Steeper means more grams for each 1 cm³, so the density is bigger.'},
    {text:'The blocks with the bigger volumes',why:'Volume is along the bottom. The slope shows the mass for each 1 cm³.'},
    {text:'It shows nothing about the density',why:'The gradient is mass divided by volume, which is the density.'}
  ],explain:'With mass up the side, the gradient is mass divided by volume: the density. P is steeper, so P is denser (8.00 g/cm³, against 2.70 g/cm³ for Q).'});
}
{
  const body=act('graphs','Predict','Same mass, different volume','');
  createPredict({host:body,q:'Sophie has 80 g of P and 80 g of Q. Which takes up more space?',options:[
    {text:'Q: it is the less dense material',correct:true},
    {text:'P: its line on the graph is steeper',why:'Steeper means denser, so 80 g of P is packed into a smaller volume (10 cm³).'},
    {text:'Neither: the masses are the same',why:'Equal masses do not mean equal volumes; that depends on the density.'},
    {text:'P: denser materials are bigger',why:'A denser material packs more mass into each 1 cm³, so it needs less space.'}
  ],explain:'Read across from 80 g: P reaches it at 10 cm³, Q at about 30 cm³. The less dense material needs more volume for the same mass.'});
}
/* the same idea with the axes the other way round */
const GV={xMin:0,xMax:60,yMin:0,yMax:40,xTicks:[0,10,20,30,40,50,60],yTicks:[0,5,10,15,20,25,30,35,40],xLabel:'mass (g)',yLabel:'volume (cm³)',W:560,H:340};
function volGraph(){
  const g0=lineGraph(Object.assign({points:[[0,0]]},GV));
  return lineGraph(Object.assign({label:'Volume against mass for liquids R and S',segments:[{pts:[[0,0],[60,40]],cls:'g-line-c'},{pts:[[0,0],[60,20]],cls:'g-line-b'}],
    extra:lab(g0,'R',56,40-5.5)+lab(g0,'S',56,20-4.5)},GV)).svg;
}
{
  const body=act('graphs','Calculate','The axes the other way round','This graph plots volume up the side and mass along the bottom, for two liquids R and S. Read your answers off the graph.');
  const split=mk('div','graph-split');body.appendChild(split);
  split.appendChild(mk('div','graph-box',volGraph()));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'R: what volume has a mass of 30 g?',unit:'cm³',answer:20,working:'Read up from 30 g to line R, then across.<br>volume = 20 cm³'},
    {q:'S: use the point at 60 g to find its density.',unit:'g/cm³',answer:3,working:'At 60 g, V = 20 cm³<br>ρ = [[m|V]]<br>ρ = [[60|20]]<br>ρ = 3.00 g/cm³'}
  ]});
}
{
  const body=act('graphs','Predict','Steeper, with the axes swapped','');
  createPredict({host:body,q:'On this graph, R is steeper than S. Which liquid is denser?',options:[
    {text:'S: it has less volume for each gram',correct:true},
    {text:'R: its line is the steeper one',why:'With volume up the side, steeper means more volume for each gram, so R is less dense.'},
    {text:'R: it has more volume for each gram',why:'More volume for each gram means less mass in each 1 cm³: a smaller density.'},
    {text:'Neither: they have the same mass',why:'The masses along the bottom are the same, but the volumes are not, so the densities differ.'}
  ],explain:'Always check the axes. Mass up the side: steeper means denser. Volume up the side: steeper means less dense. R is 1.50 g/cm³ and S is 3.00 g/cm³.'});
}

/* ================= 7. CALCULATE ================= */
{
  const body=act('calculate','Calculate','Using ρ = [[m|V]]','Give each answer in the unit shown. 1 g/cm³ = 1000 kg/m³.');
  createCalc({host:body,questions:[
    {q:'A 2.5 kg block has a volume of 0.0010 m³. What is its density?',unit:'kg/m³',answer:2500,working:'ρ = [[m|V]]<br>ρ = [[2.5|0.0010]]<br>ρ = 2500 kg/m³'},
    {q:'Cooking oil has a density of 0.92 g/cm³. What is this in kg/m³?',unit:'kg/m³',answer:920,working:'1 g/cm³ = 1000 kg/m³<br>ρ = 0.92 × 1000<br>ρ = 920 kg/m³'},
    {q:'What is the mass of 0.50 m³ of cooking oil (density 920 kg/m³)?',unit:'kg',answer:460,working:'ρ = [[m|V]]<br>920 = [[m|0.50]]<br>m = 920 × 0.50<br>m = 460 kg'},
    {q:'A 135 g stone raises the water in a measuring cylinder from 40 cm³ to 90 cm³. What is its density?',unit:'g/cm³',answer:2.7,working:'V = V₂ − V₁<br>V = 90 − 40<br>V = 50 cm³<br>ρ = [[m|V]]<br>ρ = [[135|50]]<br>ρ = 2.7 g/cm³'}
  ]});
}
{
  const body=act('calculate','Spot the error','Find the mistake','Each answer has exactly one mistake, made while rearranging. Every line after it is worked correctly from it. Click the line with the mistake.');
  const grid=mk('div','');body.appendChild(grid);
  createSpot({host:grid,scenario:'A brass weight has a mass of 425 g. The density of brass is 8.5 g/cm³. What is its volume?',
    lines:['ρ = [[m|V]]','8.5 = [[425|V]]','8.5 × V = 425','V = 8.5 × 425','V = 3612.5 cm³'],wrong:3,
    explain:'V is multiplied by 8.5, so to get V on its own, divide 425 by 8.5. 3612.5 cm³ is more than 3½ litres: far too big for a small weight.',
    fix:['V = [[425|8.5]]','V = 50 cm³']});
  createSpot({host:grid,scenario:'Cooking oil has a density of 0.92 g/cm³. What is the mass of 250 cm³ of it?',
    lines:['ρ = [[m|V]]','0.92 = [[m|250]]','m = [[0.92|250]]','m = 0.00368 g'],wrong:2,
    explain:'m is divided by 250, so to get m on its own, multiply 0.92 by 250. 0.00368 g is far too little for a quarter of a litre of oil.',
    fix:['m = 0.92 × 250','m = 230 g']});
}

/* ================= 8. ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Better results or safer?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'Better results',hint:'More accurate readings',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps people and equipment safe',hint:'',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Read the scale with your eye level with the bottom of the meniscus',cat:'a'},
    {id:'2',text:'Measure each side in two or three places and use the mean',cat:'a'},
    {id:'3',text:'Shake off any air bubbles stuck to the stone',cat:'a'},
    {id:'4',text:'Measure several blocks and use the gradient of a graph',cat:'a'},
    {id:'5',text:'Wipe up spilt water straight away, so nobody slips',cat:'s'},
    {id:'6',text:'Keep water away from the electric balance',cat:'s'},
    {id:'7',text:'Lower heavy objects on a thread, so the glass cylinder does not crack',cat:'s'},
    {id:'8',text:'Stand the measuring cylinder on a flat, level bench',cat:'a'},
    {id:'9',text:'Check the balance is level, reads zero, and is out of draughts',cat:'a'}
  ]});
}
{
  const body=act('accuracy','Predict','Reading from above','');
  createPredict({host:body,q:'Ali reads the measuring cylinder looking down from above the water level. How does this affect his reading?',options:[
    {text:'His reading is higher than the true level',correct:true},
    {text:'His reading is lower than the true level',why:'Looking down, his line of sight meets the scale above the meniscus, so he reads too high.'},
    {text:'It makes no difference at all to the reading',why:'The scale is in front of the water, so where his eye is changes which mark lines up: this is a parallax error.'},
    {text:'It only matters for liquids such as oil',why:'Parallax affects any reading of a scale, whatever the liquid.'}
  ],explain:'Looking from above, his line of sight to the bottom of the meniscus crosses the scale higher up, so he reads too high. This is a parallax error: keep your eye level with the bottom of the meniscus.'});
}
{
  const body=act('accuracy','Predict','Air bubbles','');
  createPredict({host:body,q:'Air bubbles stick to Sophie’s stone under the water. How does this affect her value for its density?',options:[
    {text:'Too small: the bubbles add to V₂',correct:true},
    {text:'Too big: the bubbles add to V₂',why:'A bigger V₂ gives a bigger volume, and dividing by a bigger volume gives a smaller density.'},
    {text:'No change: air has almost no mass',why:'The mass is fine, but the bubbles push the water up too, so the volume comes out too big.'},
    {text:'Too small: the bubbles add mass',why:'The stone was weighed dry, so the bubbles do not change its mass. They change V₂.'}
  ],explain:'The bubbles push water up as well as the stone, so V₂ and the volume are too big. Dividing the mass by a volume that is too big gives a density that is too small. Shake the bubbles off.'});
}
{
  const body=act('accuracy','Predict','A thick string','');
  createPredict({host:body,q:'Zahra lowers her stone on a thick string instead of a thin thread. Why is this a problem?',options:[
    {text:'The string under the water adds to the volume',correct:true},
    {text:'The string adds to the mass of the stone',why:'She weighs the stone before it is tied on, so the string does not change the mass.'},
    {text:'The string makes the stone sink more slowly',why:'How fast it sinks does not matter. The part of the string under the water pushes water up too.'},
    {text:'The string soaks up water, so the level falls',why:'A little water may soak in, but the main problem is the string’s own volume under the water.'}
  ],explain:'Anything under the water pushes the level up. A thick string adds its own volume, so V comes out too big and the density too small. A thin thread adds so little that it can be ignored.'});
}
{
  const body=act('accuracy','Predict','Why several blocks?','');
  createPredict({host:body,q:'Why is a graph of five blocks of different sizes better than measuring one block?',options:[
    {text:'One misread side matters less, and odd results show up',correct:true},
    {text:'Bigger blocks have a bigger density, so it averages out',why:'Every block of one material has the same density, whatever its size.'},
    {text:'The balance is only accurate for small blocks',why:'The balance reads to 0.1 g for any block. A graph uses all five readings at once.'},
    {text:'A graph means you need no ruler readings at all',why:'You still measure each block’s sides to find its volume.'}
  ],explain:'The gradient of the line of best fit uses all five blocks, so a small error in one reading matters much less, and an anomalous result stands out from the line.'});
}

/* ================= EXAM PRACTICE ================= */
{
  const body=act('exam','Exam style','The density of olive oil','Ali puts an empty measuring cylinder on a balance, then adds olive oil 20 cm³ at a time. He records the total mass each time. One reading is missing.');
  const tbl=mk('div','table-scroll');
  tbl.innerHTML='<table class="units res-tbl"><thead><tr><th>Volume of oil (cm³)</th><th>0</th><th>20</th><th>40</th><th>60</th><th>80</th></tr></thead><tbody><tr><th>Total mass (g)</th><td>52.0</td><td>70.4</td><td>88.8</td><td><b>?</b></td><td>125.6</td></tr></tbody></table>';
  body.appendChild(tbl);
  body.appendChild(mk('p','sub','(a) 1 mark'));
  createCalc({host:body,questions:[
    {q:'Ali forgot to write down the total mass at 60 cm³. Predict the missing reading.',unit:'g',answer:107.2,working:'Each 20 cm³ adds 18.4 g.<br>mass at 60 cm³ = 88.8 + 18.4<br>mass at 60 cm³ = 107.2 g'}
  ]});
  body.appendChild(mk('p','sub','(b) 3 marks'));
  createCalc({host:body,questions:[
    {q:'Use the readings at 0 cm³ and 80 cm³ to find the density of olive oil.',unit:'g/cm³',answer:0.92,working:'mass of oil = 125.6 − 52.0<br>mass of oil = 73.6 g<br>ρ = [[m|V]]<br>ρ = [[73.6|80]]<br>ρ = 0.92 g/cm³'},
    {q:'Give your density in kg/m³.',unit:'kg/m³',answer:920,working:'1 g/cm³ = 1000 kg/m³<br>ρ = 0.92 × 1000<br>ρ = 920 kg/m³'}
  ]});
  body.appendChild(mk('p','sub','(c) 2 marks'));
  body.appendChild(mk('p','','Ali plots total mass against volume of oil. Describe the shape of his graph, and state what the point where it crosses the mass axis shows.'));
  const d1=mk('details','');
  d1.innerHTML='<summary>Check your answer</summary><div><ul><li>A straight line, rising steadily (its gradient is the density of the oil).</li><li>It crosses the mass axis at 52.0 g, not at the origin: this is the mass of the empty measuring cylinder.</li></ul></div>';
  body.appendChild(d1);
  body.appendChild(mk('p','sub','(d) 2 marks'));
  body.appendChild(mk('p','','Describe how Ali should read the volume of oil in the measuring cylinder accurately.'));
  const d2=mk('details','');
  d2.innerHTML='<summary>Check your answer</summary><div><ul><li>Stand the cylinder on a flat, level bench.</li><li>Have his eye level with the oil surface (to avoid parallax).</li><li>Let all the oil run down the sides first.</li><li>Read the scale at the bottom of the meniscus.</li></ul></div>';
  body.appendChild(d2);
  body.appendChild(mk('p','sub','(e) 5 marks'));
  body.appendChild(mk('p','','Ali also wants to find the density of a small, irregular stone. Describe how he can do this, using a balance and a measuring cylinder.'));
  const d3=mk('details','');
  d3.innerHTML=FR('<summary>Check your answer</summary><div><ul><li>Measure the mass of the stone on the balance first, while it is dry (a wet stone weighs more).</li><li>Pour enough water into the measuring cylinder to cover the stone, and read the volume V₁ (eye level, bottom of the meniscus).</li><li>Lower the stone gently on a thread, so no water splashes out, until it is fully under the water. Read the new volume V₂.</li><li>Volume of the stone V = V₂ − V₁. (Or use a eureka can filled to the spout, and measure the water it pushes out.)</li><li>Repeat and find the mean volume.</li><li>Density = [[mass|volume]].</li></ul></div>');
  body.appendChild(d3);
  body.appendChild(mk('p','sub','(f) 2 marks'));
  body.appendChild(mk('p','','Ali’s value for the density of the stone is lower than the accepted value. Suggest one reason, and explain how it makes his value too low.'));
  const d4=mk('details','');
  d4.innerHTML='<summary>Check your answer</summary><div><ul><li>Air bubbles stuck to the stone (or a thick string, or V₂ read from above the water level).</li><li>This makes V₂, and so the volume of the stone, too big.</li><li>Dividing the mass by a volume that is too big gives a density that is too small.</li></ul></div>';
  body.appendChild(d4);
  body.appendChild(mk('p','sub','(g) 2 marks'));
  body.appendChild(mk('p','','Describe how Ali should measure the mass of the stone accurately.'));
  const d5=mk('details','');
  d5.innerHTML='<summary>Check your answer</summary><div><ul><li>Use a (top-pan) balance.</li><li>Check it reads zero with nothing on it (or press tare), stands level and is out of draughts.</li></ul></div>';
  body.appendChild(d5);
}
