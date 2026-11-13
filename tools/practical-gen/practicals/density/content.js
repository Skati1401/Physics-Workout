/* ================= METHOD TYPE: regular block, irregular object or liquid =================
   Each way of measuring the volume has its own Order; the switch is on the Method tab and remembered in this
   browser (copied from the 5.14P page). The Overview tab was removed on 12 Nov 2026 (Alex). */
const METHODS=[{k:'irr',label:'Irregular object'},{k:'reg',label:'Regular block'},{k:'liq',label:'Liquid'}];
const MKEY='cp-density-method';
let method='irr';try{const v=localStorage.getItem(MKEY);if(METHODS.some(m=>m.k===v))method=v;}catch(e){}
const methodGames=[];
function methodPicker(panel){
  const w=mk('div','method-pick');
  w.innerHTML='<span class="method-lab" id="ml-'+panel+'">Method type</span><div class="seg" role="group" aria-labelledby="ml-'+panel+'">'+
    METHODS.map(m=>'<button type="button" data-m="'+m.k+'">'+m.label+'</button>').join('')+'</div>';
  $('#panel-'+panel+' .acts').prepend(w);
  w.addEventListener('click',e=>{const b=e.target.closest('button[data-m]');if(b)setMethod(b.dataset.m);});
}
function forMethod(body,k){body.closest('.act').dataset.m=k;}
const methodHooks=[];
function setMethod(k){
  method=k;methodHooks.forEach(f=>f(k));try{localStorage.setItem(MKEY,k);}catch(e){}
  $$('.method-pick button').forEach(b=>{const on=b.dataset.m===k;b.classList.toggle('is-on',on);b.setAttribute('aria-pressed',String(on));});
  $$('.act[data-m]').forEach(a=>{a.hidden=a.dataset.m!==k;});
  raf(()=>methodGames.forEach(g=>g.reflow&&g.reflow()));
}
reflowers.push(()=>raf(()=>methodGames.forEach(g=>g.reflow&&g.reflow())));
const ORDER_INTRO='Put the steps in the order you would do them. Drag the ≡ handle, or use the ▲▼ buttons.';
const MATCH_INTRO='Pair each piece of equipment with its job. Drag one card onto the other, or tap one card and then the other.';

/* ================= THE STUDENT'S OWN RESULTS TABLE (Do Experiment; 5c, 13 Nov 2026) =================
   The same helper is copied into each practical rebuilt to the 1.22 model; 1.22 has its own version.
   cfg.head: column headings. cfg.rows: rows of cells. A cell is given text, or a box:
     {k:'key', a:answer, tol, dp, label}           a reading, right if within tol of a (default 0.05)
     {k:'key', f:v=>number, tol, rel, dp, label}  worked from the student's own readings: v('key') is a box the student
                                                   already has right (NaN otherwise); right if within tol, or rel × the answer
     {k:'key', a:'text', opts:[…], label}          a choice from a list (observations)
   Boxes are checked in table order, so a worked box can use readings to its left or in earlier rows.
   Fill in table is always there (Alex, 5 Nov 2026): it fills every box, dashed, so a student who cannot
   read the instrument can still go on. cfg.onChange runs after every check, fill or clear. */
function ownTable(body,cfg){
  const wrap=mk('div','table-scroll');body.appendChild(wrap);
  const cells=[];
  wrap.innerHTML='<table class="units res-tbl own-tbl"><thead><tr>'+cfg.head.map(x=>'<th>'+x+'</th>').join('')+'</tr></thead><tbody>'+
    cfg.rows.map(r=>'<tr>'+r.map(c=>{
      if(c===null||typeof c!=='object')return '<td class="given">'+(c==null?'':c)+'</td>';
      const i=cells.length;cells.push(c);
      if(c.opts)return '<td><select class="own-sel" data-i="'+i+'" aria-label="'+c.label+'"><option value="">Choose</option>'+c.opts.map(o=>'<option>'+o+'</option>').join('')+'</select></td>';
      return '<td><input class="calc-num-input" data-i="'+i+'" inputmode="decimal" autocomplete="off" aria-label="'+c.label+'"></td>';
    }).join('')+'</tr>').join('')+'</tbody></table>';
  const els=$$('[data-i]',wrap);
  const num=e=>{const t=e.value.trim().replace(/[−–]/g,'-').replace(',','.');return t===''||!/^-?(\d+\.?\d*|\.\d+)$/.test(t)?NaN:parseFloat(t);};
  const at={};cells.forEach((c,i)=>{if(c.k)at[c.k]=i;});
  const v=k=>{const e=els[at[k]];return e&&e.disabled?num(e):NaN;};
  const want=c=>c.f?c.f(v):c.a;
  const fmt=(x,c)=>{if(typeof x==='string')return x;const s=x.toFixed(c.dp==null?1:c.dp);return /^-0(\.0+)?$/.test(s)?s.slice(1):s.replace('-','−');};
  const lock=(e,shown)=>{e.disabled=true;e.classList.remove('is-wrong');if(shown)e.classList.add('is-shown');};
  const b=bar(body,[{label:'Check table',primary:true,fn:check},{label:'Fill in table',fn:fill},{label:'Clear',fn:reset}]);
  const changed=()=>{if(cfg.onChange)cfg.onChange();};
  function good(c,e){
    const w=want(c);
    if(c.opts)return e.value===w;
    const x=num(e);if(!isFinite(x)||!isFinite(w))return false;
    return Math.abs(x-w)<=Math.max(c.tol==null?0.05:c.tol,(c.rel||0)*Math.abs(w))+1e-9;
  }
  function check(){
    let ok=0,bad=0,blank=0;
    els.forEach((e,i)=>{
      if(e.disabled){ok++;return;}
      if(e.value.trim()===''){blank++;return;}
      if(good(cells[i],e)){lock(e);e.classList.add('pop');ok++;}else{bad++;e.classList.add('is-wrong');}
    });
    if(ok===els.length){b.say(cfg.done||'All correct.','good');celebrate(b.msg);}
    else b.say(ok+' of '+els.length+' correct'+(blank?', '+blank+' left blank':'')+'.'+(bad&&cfg.hint?' '+cfg.hint:''),bad?'bad':'');
    changed();
  }
  function fill(){
    els.forEach((e,i)=>{if(e.disabled)return;const w=want(cells[i]);if(cells[i].opts||isFinite(w)){e.value=cells[i].opts?w:fmt(w,cells[i]);lock(e,true);}});
    b.say(cfg.filled||'Table filled in (dashed). Read it through.','');changed();
  }
  function reset(){els.forEach(e=>{e.value='';e.disabled=false;e.classList.remove('is-wrong','is-shown','pop');});b.say('','');changed();}
  els.forEach(e=>e.addEventListener(e.tagName==='SELECT'?'change':'input',()=>e.classList.remove('is-wrong')));
  track(body,{reset:reset,
    getState:()=>({v:els.map(e=>e.value),ok:els.map(e=>e.disabled),sh:els.map(e=>e.classList.contains('is-shown'))}),
    setState:s=>{reset();els.forEach((e,i)=>{if(!s||!s.v||typeof s.v[i]!=='string')return;e.value=s.v[i];if(s.ok&&s.ok[i])lock(e,s.sh&&s.sh[i]);});if(els.every(e=>e.disabled))b.say(cfg.done||'All correct.','good');changed();},
    isDone:()=>els.every(e=>e.disabled)});
  // the value in a box the student has got right (or that was filled in), as typed; null until then
  return {val:k=>{const e=els[at[k]];return e&&e.disabled?e.value.trim():null;}};
}
/* The framed animation and the table side by side (as on 1.22), once the page's set-up has run. */
function sideBySide(panel,tableActs){
  setTimeout(()=>{const fr=$('#panel-'+panel+' .anim-wrap');if(!fr)return;const sp=mk('div','do-split');fr.parentNode.insertBefore(sp,fr);sp.appendChild(fr);
    const col=mk('div','do-col');sp.appendChild(col);tableActs.forEach(a=>col.appendChild(a.closest('.act')));},0);
}

/* ================= 1. METHOD ================= */
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
/* ================= 2. VARIABLES ================= */
{
  const body=act('variables','Sort','Which kind of variable is it?','Charlie measures five blocks of the same metal, all of different sizes, and plots mass against volume. Sort each card into the right bin, then press Check.');
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
  const body=act('variables','Multiple choice','A new question to test','');
  createPredict({host:body,q:'Zahra wants to find out how the density of salt water changes as she dissolves more salt in it. What is her independent variable?',options:[
    {text:'The mass of salt she dissolves',correct:true},
    {text:'The density of the salt water',why:'That is what she works out each time, so it is the dependent variable.'},
    {text:'The volume of water she uses',why:'She should use the same volume of water each time, so it is a control variable.'},
    {text:'The mass of the empty cylinder',why:'She uses the same cylinder each time, so this does not change.'}
  ],explain:'The independent variable is the one she changes on purpose: the mass of salt. She keeps the volume of water the same, and measures the density each time.'});
}
{
  const body=act('variables','Multiple choice','Zeroing the balance','');
  createPredict({host:body,q:'Before he starts, Charlie checks the empty balance reads 0.0 g. Why?',options:[
    {text:'So the reading is the mass of the block alone',correct:true},
    {text:'So the balance can measure heavier blocks',why:'Zeroing does not change how much the balance can hold. It removes a zero error.'},
    {text:'So the reading is given to more decimal places',why:'The balance always reads to 0.1 g. Zeroing makes the reading start from 0.'},
    {text:'So the balance warms up before it is used',why:'Zeroing is not about warming up. If it read 0.4 g when empty, every mass would be 0.4 g too big.'}
  ],explain:'If the empty balance read 0.4 g, every mass would be 0.4 g too big: a zero error. Zeroing it first means each reading is the mass of the block alone.'});
}

/* ================= 7. ACCURACY AND SAFETY ================= */
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
    {id:'8',text:'Find the mass of the object before it goes in the water, so no water is weighed with it',cat:'a'},
    {id:'9',text:'Check the balance is level, reads zero, and is out of draughts',cat:'a'}
  ]});
}
{
  const body=act('accuracy','Multiple choice','Reading from above','');
  createPredict({host:body,q:'Charlie reads the measuring cylinder looking down from above the water level. How does this affect his reading?',options:[
    {text:'His reading is higher than the true level',correct:true},
    {text:'His reading is lower than the true level',why:'Looking down, his line of sight meets the scale above the meniscus, so he reads too high.'},
    {text:'It makes no difference at all to the reading',why:'The scale is in front of the water, so where his eye is changes which mark lines up: this is a parallax error.'},
    {text:'It only matters for liquids such as oil',why:'Parallax affects any reading of a scale, whatever the liquid.'}
  ],explain:'Looking from above, his line of sight to the bottom of the meniscus crosses the scale higher up, so he reads too high. This is a parallax error: keep your eye level with the bottom of the meniscus.'});
}
{
  const body=act('accuracy','Multiple choice','Air bubbles','');
  createPredict({host:body,q:'Air bubbles stick to Ananya’s stone under the water. How does this affect her value for its density?',options:[
    {text:'Too small: the bubbles add to V₂',correct:true},
    {text:'Too big: the bubbles add to V₂',why:'A bigger V₂ gives a bigger volume, and dividing by a bigger volume gives a smaller density.'},
    {text:'No change: air has almost no mass',why:'The mass is fine, but the bubbles push the water up too, so the volume comes out too big.'},
    {text:'Too small: the bubbles add mass',why:'The stone was weighed dry, so the bubbles do not change its mass. They change V₂.'}
  ],explain:'The bubbles push water up as well as the stone, so V₂ and the volume are too big. Dividing the mass by a volume that is too big gives a density that is too small. Shake the bubbles off.'});
}

/* ================= DO THE EXPERIMENT (the 1.22 model; 5c, 13 Nov 2026) =================
   The student reads the balance, ruler and measuring cylinder in the animation's measure mode
   (animations/density.html?show=measure&part=reg|irr|liq), fills in the table and plots it.
   The method type chosen on the Method tab picks the part here too.
   These readings must match the animation's measure mode (MEAS in animations/density.html; tools/CORE-PRACTICALS.md,
   "Measure modes"): aluminium blocks, the stone with a measuring cylinder, and water. */
const DN_REG=[[22.4,2.0,2.0,2.1],[41.6,3.0,2.6,2.0],[62.5,4.1,2.9,1.9],[98.5,3.9,3.1,3.0],[134.9,5.0,4.1,2.4]];   // m (g), l, w, h (cm)
const DN_IRR={m:62.0,v1:50,v2:73};                                     // stone: mass (g), level before and after (cm³)
const DN_LIQ={m0:74.6,v:[19,41,60,82,100],m:[93.7,115.5,134.8,156.4,174.7]};   // empty cylinder (g); volume (cm³), total mass (g)
const DN_FRAME=k=>'animations/density.html?embed&show=measure&part='+k;
const dnTables={},dnBodies=[];
methodPicker('do');
{
  const t=act('do','Your turn','Take your own readings','Weigh each block on the balance and write its mass in the table. Then read its length, width and height on the ruler in the close-up, to the nearest 0.1 cm (press Length, Width or Height). Do all five blocks, work out each volume, then plot mass against volume.');forMethod(t,'reg');
  const i=act('do','Your turn','Take your own readings','Weigh the stone and write its mass in the table. Read the water level, eye level with the bottom of the meniscus. Hang the stone over the cylinder, lower it into the water, and read the level again. Work out the volume and the density of the stone.');forMethod(i,'irr');
  const l=act('do','Your turn','Take your own readings','Weigh the empty measuring cylinder. Then press Pour in some liquid: read the volume at the bottom of the meniscus and the total mass on the balance. Do this five times, work out each mass of liquid, then plot it against the volume.');forMethod(l,'liq');
}
frameAct('do','animations/density.html','measure&part='+method,'Density experiment: read the balance, the ruler and the measuring cylinder','measuring density',false);
{
  const body=act('do','Calculate','Your results: regular blocks','Write each mass to 0.1 g and each side to 0.1 cm. Then work out each volume: V = length × width × height. Press Check table.');forMethod(body,'reg');dnBodies.push(body);
  const L='abcde';
  dnTables.reg=ownTable(body,{head:['Block','Mass (g)','Length (cm)','Width (cm)','Height (cm)','Volume (cm³)'],
    rows:DN_REG.map((r,i)=>{const n=i+1,k=L[i];return [n,
      {k:'m'+k,a:r[0],label:'Mass of block '+n+', in g'},
      {k:'l'+k,a:r[1],label:'Length of block '+n+', in cm'},
      {k:'w'+k,a:r[2],label:'Width of block '+n+', in cm'},
      {k:'h'+k,a:r[3],label:'Height of block '+n+', in cm'},
      {k:'v'+k,f:v=>v('l'+k)*v('w'+k)*v('h'+k),tol:0.1,rel:0.005,label:'Volume of block '+n+', in cm³'}];}),
    hint:'Read each side where the end of the block meets the ruler, to the nearest 0.1 cm. Volume = length × width × height, from your own sides.',
    done:'All correct. Now plot your results.',filled:'Table filled in (dashed). Now plot the mass against the volume.',
    onChange:()=>dnRows()});
}
{
  const body=act('do','Calculate','Your results: the stone','Write the mass to 0.1 g and each water level to the nearest 1 cm³. Then work out the volume and the density of the stone. Press Check table.');forMethod(body,'irr');dnBodies.push(body);
  dnTables.irr=ownTable(body,{head:['Quantity','Your value'],rows:[
    ['Mass of the stone, m (g)',{k:'m',a:DN_IRR.m,label:'Mass of the stone, in g'}],
    ['Water level before, V₁ (cm³)',{k:'v1',a:DN_IRR.v1,tol:0.5,dp:0,label:'Water level before, in cm³'}],
    ['Water level after, V₂ (cm³)',{k:'v2',a:DN_IRR.v2,tol:0.5,dp:0,label:'Water level after, in cm³'}],
    ['Volume of the stone, V₂ − V₁ (cm³)',{k:'v',f:v=>v('v2')-v('v1'),tol:0.05,dp:0,label:'Volume of the stone, in cm³'}],
    [FR('Density, ρ = [[m|V]] (g/cm³)'),{k:'d',f:v=>v('m')/v('v'),tol:0.01,dp:2,label:'Density of the stone, in g/cm³'}]],
    hint:'Read the level at the bottom of the meniscus. Volume = level after − level before; density = mass divided by volume, from your own readings.',
    done:'All correct. The stone’s density is about 2.7 g/cm³.'});
}
{
  const body=act('do','Calculate','Your results: water','Write each volume to the nearest 1 cm³ and each mass to 0.1 g. Then work out each mass of water: total mass − mass of the empty cylinder. Press Check table.');forMethod(body,'liq');dnBodies.push(body);
  dnTables.liq=ownTable(body,{head:['Volume of water (cm³)','Total mass (g)','Mass of water (g)'],
    rows:[['0 (empty)',{k:'m0',a:DN_LIQ.m0,label:'Mass of the empty cylinder, in g'},'0']].concat(DN_LIQ.v.map((V,i)=>[
      {k:'v'+i,a:V,tol:0.5,dp:0,label:'Volume of water, pour '+(i+1)+', in cm³'},
      {k:'t'+i,a:DN_LIQ.m[i],label:'Total mass, pour '+(i+1)+', in g'},
      {k:'w'+i,f:v=>v('t'+i)-v('m0'),label:'Mass of water, pour '+(i+1)+', in g'}])),
    hint:'Read the volume at the bottom of the meniscus. Mass of water = total mass − your mass of the empty cylinder.',
    done:'All correct. Now plot your results.',filled:'Table filled in (dashed). Now plot the mass of water against the volume.',
    onChange:()=>dnRows()});
}
let dnRows=()=>{};
{
  const body=act('do','Plot','Plot your results','Plot the mass of each block against its volume as a small cross. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');forMethod(body,'reg');
  const V=DN_REG.map(r=>+(r[1]*r[2]*r[3]).toFixed(1));
  createPlot({host:body,points:DN_REG.map((r,i)=>({x:V[i],y:r[0],n:i})),
    rowText:p=>'Block '+(p.n+1)+': '+dnVal('reg','v'+'abcde'[p.n],'cm³')+', '+dnVal('reg','m'+'abcde'[p.n],'g'),
    next:' Now answer the question below.',
    graph:{xMin:0,xMax:50,yMin:0,yMax:140,xTicks:[0,10,20,30,40,50],yTicks:[0,20,40,60,80,100,120,140],minor:[1,5],snap:[0.5,0.5],tol:[0.5,2.5],xLabel:'volume (cm³)',yLabel:'mass (g)',W:560,H:340}});
}
{
  const body=act('do','Plot','Plot your results','Plot the mass of water against its volume as a small cross. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');forMethod(body,'liq');
  createPlot({host:body,points:DN_LIQ.v.map((V,i)=>({x:V,y:+(DN_LIQ.m[i]-DN_LIQ.m0).toFixed(1),n:i})),
    rowText:p=>'Pour '+(p.n+1)+': '+dnVal('liq','v'+p.n,'cm³')+', '+dnVal('liq','w'+p.n,'g'),
    next:' Now answer the question below.',
    graph:{xMin:0,xMax:100,yMin:0,yMax:120,xTicks:[0,20,40,60,80,100],yTicks:[0,20,40,60,80,100,120],minor:[2,4],snap:[1,0.5],tol:[1,2],xLabel:'volume (cm³)',yLabel:'mass of water (g)',W:560,H:340}});
}
// the list beside each graph shows the student's own values once they are right in the table
function dnVal(t,k,u){const x=dnTables[t]&&dnTables[t].val(k);return x?x+' '+u:'your '+(u==='g'?'mass':'volume');}
dnRows=()=>{
  $$('#panel-do .act[data-m="reg"] .plot-row').forEach((li,i)=>{const s=li.firstElementChild;if(s)s.textContent='Block '+(i+1)+': '+dnVal('reg','v'+'abcde'[i],'cm³')+', '+dnVal('reg','m'+'abcde'[i],'g');});
  $$('#panel-do .act[data-m="liq"] .plot-row').forEach((li,i)=>{const s=li.firstElementChild;if(s)s.textContent='Pour '+(i+1)+': '+dnVal('liq','v'+i,'cm³')+', '+dnVal('liq','w'+i,'g');});
};
{
  const body=act('do','Predict','Reading your results','');forMethod(body,'reg');
  createPredict({host:body,q:'Your points lie on a straight line through the origin. What is the density of the aluminium?',options:[
    {text:'About 2.7 g/cm³: the gradient of the line',correct:true},
    {text:'About 0.37 g/cm³: the volume of each gram',why:'Density is mass divided by volume. With mass up the side, the gradient is the mass of each 1 cm³: about 2.7 g.'},
    {text:'134.9 g: the mass of the biggest block',why:'That is one block’s mass. Density is the mass of each 1 cm³, the same for every block.'},
    {text:'It is different for each block',why:'Every block is aluminium, so they have the same density (within reading errors): the points lie on one straight line.'}
  ],explain:'The gradient is the change in mass divided by the change in volume, for example [[134.9|49.2]] = 2.74 g/cm³. Aluminium’s density is 2.70 g/cm³. Using the line through all five points is better than one block alone.'});
}
{
  const body=act('do','Predict','Reading your results','');forMethod(body,'liq');
  createPredict({host:body,q:'Use your graph. What is the density of water?',options:[
    {text:'About 1.0 g/cm³: about 1 g for each 1 cm³',correct:true},
    {text:'About 1.7 g/cm³: the total mass of each 1 cm³',why:'The total mass includes the 74.6 g cylinder. Use the mass of the water alone.'},
    {text:'About 0.5 g/cm³: half a gram for each 1 cm³',why:'Read the graph again: 100 cm³ has a mass of about 100 g.'},
    {text:'About 100 g/cm³: the mass at 100 cm³',why:'That is the mass of 100 cm³. Density is the mass of each 1 cm³.'}
  ],explain:'The line goes through the origin with a gradient of about [[100.1|100]] = 1.00 g/cm³ (1000 kg/m³). If you plot the total mass instead, the line is parallel but crosses the mass axis at 74.6 g, the empty cylinder.'});
}
// the frame shows the part for the method type chosen
methodHooks.push(k=>{const f=$('#panel-do iframe.anim-frame');if(f&&!f.src.endsWith(DN_FRAME(k)))f.src=DN_FRAME(k);});
sideBySide('do',dnBodies);

/* ================= SHOW THE EXPERIMENT: the readings taken for you ================= */
{
  act('experiment','Your turn','Watch the readings','Press Experiment: here the results table and graph fill in by themselves. For the regular block, measure all five blocks of one material and look at the graph. For the irregular object, weigh it, read the water level, drag it down into the water, then read the level again; try the eureka can too. For the liquid, weigh the empty cylinder, then add the liquid a little at a time. Which graph goes through the origin, and why does the other one not?');
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
    {id:'5',text:'A small plastic toy',cat:'d'},
    {id:'6',text:'Cooking oil',cat:'l'},
    {id:'7',text:'Salt water',cat:'l'}
  ]});
}
{
  const body=act('experiment','Predict','Waiting for the drips to stop','');
  createPredict({host:body,q:'Ananya fills a eureka can until water runs out of the spout. She puts the empty cylinder under the spout before the dripping stops. What goes wrong?',options:[
    {text:'The extra drips add to the volume she collects',correct:true},
    {text:'The stone will not sink to the bottom of the can',why:'The drips do not affect the stone. They would end up in her measuring cylinder.'},
    {text:'The water in the can is at the wrong temperature',why:'Temperature is not the problem. Any water still dripping would be collected too.'},
    {text:'The water level is too low to cover the stone',why:'The can is full to the spout. The problem is the drips getting into her cylinder.'}
  ],explain:'Any water still dripping from the spout would be collected with the water the stone pushes out, so her volume would be too big and her density too small.'});
}
{
  const body=act('experiment','Multiple choice','The liquid graph','');
  createPredict({host:body,q:'Charlie plots the total mass of the cylinder and liquid against the volume of liquid. Why does his line not go through the origin?',options:[
    {text:'The mass includes the empty cylinder',correct:true},
    {text:'The liquid gets denser as he adds more',why:'The density stays the same: the points still lie on a straight line.'},
    {text:'He did not zero the balance at the start',why:'Even with a zeroed balance, the empty cylinder has mass, and it is in every reading.'},
    {text:'Liquids never have mass at zero volume',why:'With no liquid there is no mass of liquid. The mass at zero volume is the cylinder’s.'}
  ],explain:'Every reading includes the mass of the empty cylinder, so the line crosses the mass axis at that mass. The gradient is still the density of the liquid.'});
}

/* ================= 4. RESULTS ================= */
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
    {q:'What is the density of block E?',unit:'g/cm³',answer:1.4,working:'ρ = [[m|V]]<br>ρ = [[56.0|40.0]]<br>ρ = 1.40 g/cm³'}
  ]});
}
{
  const body=act('results','Multiple choice','The line of best fit','');
  createPredict({host:body,q:'What line of best fit should Zahra draw through her points?',options:[
    {text:'One straight line through the origin',correct:true},
    {text:'Lines joining each point to the next',why:'A line of best fit is one smooth line that follows the trend, not dot-to-dot.'},
    {text:'A smooth curve that bends near the top',why:'The points lie on a straight line, so a curve does not fit them.'},
    {text:'A straight line that starts at block A',why:'A block with no volume has no mass, so the line should go through the origin.'}
  ],explain:'The points lie on a straight line, and a block with no volume has no mass, so the line goes through the origin: mass is directly proportional to volume.'});
}
{
  const body=act('results','Multiple choice','What the gradient shows','');
  createPredict({host:body,q:'Zahra works out the gradient of her line of best fit. What does it tell her?',options:[
    {text:'The density of the plastic',correct:true},
    {text:'The mass of the largest block',why:'The gradient is the mass for each 1 cm³, not the mass of one block.'},
    {text:'The volume of each 1 g of plastic',why:'That would be volume divided by mass. With mass up the side, the gradient is mass divided by volume.'},
    {text:'The mistake in each of her readings',why:'The gradient shows the trend of all her readings, not the errors in them.'}
  ],explain:'Gradient = change in mass divided by change in volume, which is the mass of each 1 cm³: the density. Using all five points gives a better value than one block alone.'});
}
{
  const body=act('results','Multiple choice','An anomalous result','');
  createPredict({host:body,q:'Charlie’s blocks are made of another plastic. Which block gives an anomalous result, and what should he do about it?',
    pre:'<div class="table-scroll"><table class="units res-tbl"><thead><tr><th>Block</th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th></tr></thead><tbody><tr><th>Volume (cm³)</th><td>8.0</td><td>16.0</td><td>24.0</td><td>32.0</td><td>40.0</td></tr><tr><th>Mass (g)</th><td>9.6</td><td>19.3</td><td>24.5</td><td>38.3</td><td>48.0</td></tr></tbody></table></div>',
    options:[
    {text:'C: measure it again, and leave it out of the line',correct:true},
    {text:'E: it has the biggest mass, so it must be wrong',why:'E fits the pattern: 1.2 g for each 1 cm³, the same as A, B and D.'},
    {text:'C: draw the line of best fit through it anyway',why:'An anomalous point does not fit the pattern, so it should not pull the line away from the others.'},
    {text:'None: the mass always goes up, so all fit the pattern',why:'C should be about 28.8 g. At 24.5 g it is well below the line through the others.'}
  ],explain:'The others all have about 1.2 g for each 1 cm³, so C should be about 28.8 g. Perhaps it has a hole inside, or a side was misread. Measure it again if you can, and leave it out of the line of best fit.'});
}

/* ================= 5. GRAPHS ================= */
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
  const body=act('graphs','Multiple choice','Which is denser?','');
  createPredict({host:body,q:'On this graph (mass up the side), what does the steeper line show?',options:[
    {text:'The material with the bigger density',correct:true},
    {text:'The material with the smaller density',why:'Steeper means more grams for each 1 cm³, so the density is bigger.'},
    {text:'The blocks with the bigger volumes',why:'Volume is along the bottom. The slope shows the mass for each 1 cm³.'},
    {text:'It shows nothing about the density',why:'The gradient is mass divided by volume, which is the density.'}
  ],explain:'With mass up the side, the gradient is mass divided by volume: the density. P is steeper, so P is denser (8.00 g/cm³, against 2.70 g/cm³ for Q).'});
}
{
  const body=act('graphs','Multiple choice','Same mass, different volume','');
  createPredict({host:body,q:'Ananya has 80 g of P and 80 g of Q. Which takes up more space?',options:[
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
  const body=act('graphs','Multiple choice','Steeper, with the axes swapped','');
  createPredict({host:body,q:'On this graph, R is steeper than S. Which liquid is denser?',options:[
    {text:'S: it has less volume for each gram',correct:true},
    {text:'R: its line is the steeper one',why:'With volume up the side, steeper means more volume for each gram, so R is less dense.'},
    {text:'R: it has more volume for each gram',why:'More volume for each gram means less mass in each 1 cm³: a smaller density.'},
    {text:'Neither: they have the same mass',why:'The masses along the bottom are the same, but the volumes are not, so the densities differ.'}
  ],explain:'Always check the axes. Mass up the side: steeper means denser. Volume up the side: steeper means less dense. R is 1.50 g/cm³ and S is 3.00 g/cm³.'});
}


/* The method switch is set once every picker and every method's activities exist, so only the chosen method shows on load. */
setMethod(method);
