/* IAL CP13: determine the specific latent heat of a phase change (spec 127; uses 125 and 128).
   Fusion: two funnels of crushed ice, only one heater on (through a joulemeter); the control funnel corrects for ice
   melted by the room (Alex's 5.1 deck, slide 59). Vaporisation: water kept boiling on a balance (slides 60–61).
   Values from the deck: Lf = 334 kJ/kg, Lv = 2260 kJ/kg.
   Rebuilt on the CP15 model on 14 Nov 2026 (TODO.md 5z): 8 tabs, no Variables or Results tab, no Predicts.
   The Do the Experiment tab frames animations/latent-heat.html?show=measure&part=fus, whose fixed readings must match
   LH_ME, LH_MC and LH_B below (MEAS_ME, MEAS_MC and MEAS_B in the animation; tools/CORE-PRACTICALS.md, "Measure modes"). */
const ORDER_INTRO='Put the steps in the order you would do them. Drag the ≡ handle, or use the ▲▼ buttons.';
function sTable(head,rows){
  const t=mk('div','table-scroll');
  t.innerHTML='<table class="units res-tbl"><thead><tr>'+head.map(h=>'<th>'+h+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map((c,i)=>(i?'<td>':'<th>')+c+(i?'</td>':'</th>')).join('')+'</tr>').join('')+'</tbody></table>';
  return t;
}

/* measTable: the student's own results table for Do Experiment (CP15 model; written for CP12–14, 14 Nov 2026).
   cols: [{c, head, val:k=>number, tol, show:k=>string, given:k=>string (a printed cell instead of a box), lab:k=>aria label}].
   Show answer is always visible (as on CP15), so a student can skip to the plot; it hides once the table is complete. */
function measTable(body,o){
  const wrap=mk('div','table-scroll');body.appendChild(wrap);
  const rows=[];for(let k=0;k<o.n;k++)rows.push(k);
  wrap.innerHTML='<table class="units res-tbl ga-tbl"><thead><tr>'+o.cols.map(c=>'<th>'+c.head+'</th>').join('')+'</tr></thead><tbody>'+
    rows.map(k=>'<tr>'+o.cols.map(c=>c.given?'<td class="given">'+c.given(k)+'</td>':
      '<td><input class="calc-num-input" data-c="'+c.c+'" data-k="'+k+'" inputmode="decimal" autocomplete="off" aria-label="'+c.lab(k)+'"></td>').join('')+'</tr>').join('')+'</tbody></table>';
  const col=id=>o.cols.find(c=>c.c===id), all=()=>$$('input',wrap), inp=(c,k)=>$('input[data-c="'+c+'"][data-k="'+k+'"]',wrap);
  const val=e=>{const t=e.value.trim().replace(/[−–]/g,'-').replace(',','.');return t===''||!/^-?(\d+\.?\d*|\.\d+)$/.test(t)?NaN:parseFloat(t);};
  const done=()=>all().every(e=>e.disabled), changed=()=>{if(o.onChange)o.onChange();};
  const b=bar(body,[{label:'Check table',primary:true,fn:check},{label:'Clear',fn:reset}]);
  const ans=answerBtn(b,()=>{
    all().forEach(e=>{if(e.disabled)return;e.value=col(e.dataset.c).show(+e.dataset.k);e.disabled=true;e.classList.add('is-shown');e.classList.remove('is-wrong');});
    b.say('Answers shown (dashed). '+o.next,'');changed();
  });
  function check(){
    let ok=0,bad=0,blank=0;
    all().forEach(e=>{
      if(e.disabled){ok++;return;}
      if(e.value.trim()===''){blank++;return;}
      const c=col(e.dataset.c),v=val(e),w=c.val(+e.dataset.k);
      if(isFinite(v)&&Math.abs(v-w)<=c.tol+1e-9){e.disabled=true;e.classList.remove('is-wrong');e.classList.add('pop');ok++;}
      else{bad++;e.classList.add('is-wrong');}
    });
    const n=all().length;
    if(ok===n){b.say('All correct. '+o.next,'good');celebrate(b.msg);ans.off();}
    else{b.say(ok+' of '+n+' correct'+(blank?', '+blank+' left blank':'')+'.'+(bad?' '+o.hint:''),bad?'bad':'');ans.on();}
    changed();
  }
  function reset(){all().forEach(e=>{e.value='';e.disabled=false;e.classList.remove('is-wrong','is-shown','pop');});ans.on();b.say('','');changed();}
  all().forEach(e=>e.addEventListener('input',()=>e.classList.remove('is-wrong')));
  ans.on();
  track(body,{reset:reset,
    getState:()=>({v:all().map(e=>e.value),ok:all().map(e=>e.disabled),sh:all().map(e=>e.classList.contains('is-shown'))}),
    setState:s=>{reset();all().forEach((e,i)=>{if(!s||!s.v||typeof s.v[i]!=='string')return;e.value=s.v[i];if(s.ok&&s.ok[i]){e.disabled=true;if(s.sh&&s.sh[i])e.classList.add('is-shown');}});if(done()){b.say('All correct. '+o.next,'good');ans.off();}changed();},
    isDone:done});
  // a checked (or shown) cell's text, for the plot's row labels
  return {cell:(c,k)=>{const e=inp(c,k);return e&&e.disabled&&e.value.trim()!==''?e.value.trim():null;}};
}
/* Put the Your turn card and the framed animation in a left column, with the table on the right (as on CP15). */
function splitDo(tab,turnTitle){
  const fr=$('#panel-'+tab+' .anim-wrap'),tb=$('#panel-'+tab+' .ga-tbl'),yt=$('#panel-'+tab+' .act[data-title="'+turnTitle+'"]');
  if(!fr||!tb)return;
  const t=tb.closest('.act'),sp=mk('div','hk-split'),left=mk('div','ga-left');
  fr.parentNode.insertBefore(sp,fr);sp.appendChild(left);if(yt)left.appendChild(yt);left.appendChild(fr);sp.appendChild(t);
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
  const b=bar(body,[{label:'Check answers',primary:true,fn:()=>g.check()},{label:'Shuffle again',fn:()=>g.reset()}]);
  const score=mk('span','score');b.el.insertBefore(score,b.msg);
  Object.assign(g,createBlankGame({fill:true,slots,pool,chips,msg:b,score,isCorrect:(c,s)=>c.text===s.answer}));
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
/* ================= DO THE EXPERIMENT ================= */
// The student reads the joulemeter and the two balances in the animation's measure mode (?show=measure&part=fus).
// LH_ME, LH_MC and LH_B must match MEAS_ME, MEAS_MC and MEAS_B in animations/latent-heat.html (LH_B is the vaporisation balance, not used here yet).
const LH_T=[0,2,4,6,8,10], LH_E=[0,4800,9600,14400,19200,24000], LH_ME=[0.0,15.6,31.4,47.1,62.8,78.5], LH_MC=[0.0,1.6,3.3,4.7,6.4,8.0];
const LH_B=[350.0,345.0,340.1,335.0,329.9,325.0];
const LH_DM=LH_ME.map((m,k)=>+(m-LH_MC[k]).toFixed(1));
let lhTable=null,lhPlotRows=()=>{};
{
  act('do','Your turn','Take your own readings','1. Read the joulemeter and both balances at 0 minutes. 2. Press Switch on for 2 minutes, then read all three again; do this five times. 3. Fill in the table, then work out Δm, the mass melted by the heater alone.');
}
frameAct('do','animations/latent-heat.html','measure&part=fus','Latent heat experiment: read the joulemeter and the two balances','latent heat',false);
{
  const body=act('do','Calculate','Your results table','Write ΔE as the joulemeter shows it, in J, and each mass of water as its balance shows it, in g. Δm = mass under the heated funnel − mass under the control funnel. Press Check.');
  lhTable=measTable(body,{n:LH_T.length,next:'Now plot ΔE against Δm below.',
    hint:'The joulemeter counts the energy since it was reset. Δm takes off the ice the room melted: 15.6 − 1.6 = 14.0 g.',
    onChange:()=>lhPlotRows(),
    cols:[
      {c:'t',head:'t (min)',given:k=>String(LH_T[k])},
      {c:'e',head:'ΔE (J)',val:k=>LH_E[k],tol:0,show:k=>String(LH_E[k]),lab:k=>'Joulemeter reading at '+LH_T[k]+' minutes, joules'},
      {c:'me',head:'Heated funnel (g)',val:k=>LH_ME[k],tol:0.05,show:k=>LH_ME[k].toFixed(1),lab:k=>'Mass of water under the heated funnel at '+LH_T[k]+' minutes, grams'},
      {c:'mc',head:'Control funnel (g)',val:k=>LH_MC[k],tol:0.05,show:k=>LH_MC[k].toFixed(1),lab:k=>'Mass of water under the control funnel at '+LH_T[k]+' minutes, grams'},
      {c:'dm',head:'Δm (g)',val:k=>LH_DM[k],tol:0.05,show:k=>LH_DM[k].toFixed(1),lab:k=>'Mass melted by the heater at '+LH_T[k]+' minutes, grams'}
    ]});
}
{
  const body=act('do','Explain','Why plot ΔE against Δm?','The energy the heater gives the ice melts it: ΔE = LΔm. L stays the same, so:');
  body.insertAdjacentHTML('beforeend',
    '<p class="act-intro">In the order of y = mx + c:</p>'+
    '<div class="ln-match"><span>ΔE</span><span>=</span><span>L</span><span>Δm</span><span>+</span><span>0</span>'+
    '<span>y</span><span>=</span><span>m</span><span>x</span><span>+</span><span>c</span></div>'+
    '<p class="act-intro">So ΔE against Δm is a straight line through the origin with gradient = L<sub>f</sub>. The control funnel takes off the ice melted by the room, so Δm is the mass the heater alone melted. Using the gradient of the line, not one reading, averages out the scatter in the readings.</p>');
}
{
  const body=act('do','Plot','Plot your results','Plot ΔE (in kJ) against Δm from your table as small crosses. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');
  const rowT=k=>{const e=lhTable&&lhTable.cell('dm',k);return (LH_E[k]/1000).toFixed(1)+' kJ, '+(e?'Δm = '+e+' g':'your Δm');};
  createPlot({host:body,next:' Now find the specific latent heat from the line of best fit below.',
    points:LH_DM.map((x,k)=>({x:x,y:LH_E[k]/1000})),
    rowText:p=>rowT(LH_E.indexOf(Math.round(p.y*1000))),
    graph:{xMin:0,xMax:80,yMin:0,yMax:28,xTicks:[0,10,20,30,40,50,60,70,80],yTicks:[0,4,8,12,16,20,24,28],minor:[2,0.8],snap:[0.5,0.4],xLabel:'Δm (g)',yLabel:'ΔE (kJ)',W:560,H:340}});
  splitDo('do','Take your own readings');
  lhPlotRows=()=>{$$('.plot-row',body).forEach((li,k)=>{const s=li.firstElementChild;if(s)s.textContent=rowT(k);});};
  lhPlotRows();
}
{
  const body=act('do','Calculate','L<sub>f</sub> from your line','A good line of best fit through your points passes through (10, 3.42) and (70, 23.82), with Δm in g and ΔE in kJ. Type a power of ten as e.g. 3.40e5.');
  createCalc({host:body,questions:[
    {q:'What is the gradient of the line?',unit:'kJ g⁻¹',answer:0.34,working:'first point = (10, 3.42)<br>second point = (70, 23.82)<br>gradient = ?||gradient = [[change in ΔE|change in Δm]]<br>gradient = [[23.82 − 3.42|70 − 10]]<br>gradient = [[20.40|60]]<br>gradient = 0.340 kJ g⁻¹'},
    {q:'What is the specific latent heat of fusion of ice, in J kg⁻¹?',unit:'J kg⁻¹',answer:3.4e5,working:'gradient = 0.340 kJ g⁻¹<br>1 kJ = 1000 J<br>1 g = 0.001 kg<br>L<sub>f</sub> = ?||L<sub>f</sub> = [[0.340 × 1000|0.001]]<br>L<sub>f</sub> = 340 000 J kg⁻¹<br>L<sub>f</sub> = 3.40 × 10⁵ J kg⁻¹'},
    {q:'The accepted value is 3.34 × 10⁵ J kg⁻¹. What is the percentage difference of your value from it?',unit:'%',answer:1.8,working:'your value = 3.40 × 10⁵ J kg⁻¹<br>accepted = 3.34 × 10⁵ J kg⁻¹<br>difference = ?||difference = [[3.40 − 3.34|3.34]] × 100%<br>difference = [[0.06|3.34]] × 100%<br>difference = 1.8%'}
  ]});
}
/* ================= WATCH THE EXPERIMENT ================= */
{
  act('experiment','Your turn','Watch the readings','Press Experiment in each part below. In Fusion, take readings every 2 minutes with the control, then try again with no control and with ice from the freezer. In Vaporisation, try the beaker lagged and with no lagging. Each time, compare your gradient with the accepted value: which way is it out, and why?');
}
frameAct('experiment','animations/latent-heat.html','fus','Specific latent heat animation: melting ice in two funnels','fusion',false);
frameAct('experiment','animations/latent-heat.html','vap','Specific latent heat animation: boiling water on a balance','vaporisation',false);
/* ================= ANALYSIS ================= */
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
  const body=act('graphs','Multiple choice','Which liquid is water?','');
  createPredict({host:body,q:'One of the liquids is water (L<sub>v</sub> = 2260 kJ kg⁻¹). Which line is it?',options:[
    {text:'A: it needs the most energy for each gram',correct:true},
    {text:'C: it boils away the most for each kilojoule',why:'Boiling away the most for each kilojoule means the least energy for each gram: the smallest L<sub>v</sub>, not water.'},
    {text:'B: its line is between the other two lines',why:'B needs 0.9 kJ for each gram, 900 kJ kg⁻¹: far less than water.'},
    {text:'You cannot tell which is water from this graph',why:'You can: the gradient of each line is its L<sub>v</sub>, and A’s is 2.25 kJ g⁻¹ = 2250 kJ kg⁻¹.'}
  ],explain:'With energy up the side, the gradient is L<sub>v</sub>. Water has the biggest specific latent heat of vaporisation, so its line is the steepest: A.'});
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
  const body=act('graphs','Multiple choice','Is steeper always bigger L?','');
  createPredict({host:body,q:'Nicholas says, “On these graphs, the steeper line always has the bigger specific latent heat.” Is he right?',options:[
    {text:'Only when energy is plotted up the side',correct:true},
    {text:'Yes, on every graph of these two quantities',why:'On the second graph, with mass up the side, the steeper line (P) has the smaller L<sub>f</sub>.'},
    {text:'Only when the mass is plotted up the side',why:'With mass up the side, the gradient is 1/L, so a steeper line means a smaller L.'},
    {text:'No: L cannot be found from a graph at all',why:'It can: from the gradient (energy up the side) or from [[1|gradient]] (mass up the side).'}
  ],explain:'Always check the axes. Energy up the side: gradient = L, so steeper means bigger L. Mass up the side: gradient = 1/L, so steeper means smaller L.'});
}
/* ================= CALCULATE ================= */
{
  const body=act('calculate','Calculate','Using ΔE = LΔm and ΔE = mcΔθ','Give each answer in the unit shown. L<sub>f</sub> of ice = 3.34 × 10⁵ J kg⁻¹, L<sub>v</sub> of water = 2.26 × 10⁶ J kg⁻¹, c of ice = 2100 J kg⁻¹ K⁻¹.');
  createCalc({host:body,questions:[
    {q:'How much energy melts 0.25 kg of ice at 0 °C?',unit:'J',answer:83500,working:'ΔE = LΔm<br>ΔE = 3.34 × 10⁵ × 0.25<br>ΔE = 83 500 J'},
    {q:'A 60 W heater keeps water boiling for 5.0 minutes. What mass of water boils away?',unit:'g',answer:7.96,working:'ΔE = P × t<br>ΔE = 60 × 300<br>ΔE = 18 000 J<br>ΔE = LΔm<br>18 000 = 2.26 × 10⁶ × Δm<br>Δm = [[18 000|2.26 × 10⁶]]<br>Δm = 0.00796 kg = 7.96 g'},
    {q:'How much energy turns 0.20 kg of ice at −10 °C into water at 0 °C?',unit:'J',answer:71000,working:'warm the ice: ΔE = mcΔθ<br>ΔE = 0.20 × 2100 × 10<br>ΔE = 4200 J<br>melt it: ΔE = LΔm<br>ΔE = 3.34 × 10⁵ × 0.20<br>ΔE = 66 800 J<br>total = 4200 + 66 800<br>total = 71 000 J'},
    {q:'A joulemeter reads 30 000 J. The heated funnel gives 95.0 g of water and the control 5.0 g. Find L<sub>f</sub>.',unit:'kJ kg⁻¹',answer:333,working:'Δm = 95.0 − 5.0<br>Δm = 90.0 g = 0.0900 kg<br>ΔE = LΔm<br>30 000 = L<sub>f</sub> × 0.0900<br>L<sub>f</sub> = [[30 000|0.0900]]<br>L<sub>f</sub> = 333 000 J kg⁻¹ = 333 kJ kg⁻¹'}
  ]});
}
/* ================= ACCURACY AND SAFETY ================= */
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
  const body=act('accuracy','Multiple choice','Why is L<sub>v</sub> too high?','');
  createPredict({host:body,q:'Amelia finds L<sub>v</sub> = 2.6 × 10⁶ J kg⁻¹. The accepted value is 2.26 × 10⁶ J kg⁻¹. What is the most likely reason?',options:[
    {text:'Energy was lost from the beaker to the room',correct:true},
    {text:'The water was boiling before she started',why:'That is what she should do. It means every joule counted goes into boiling, not warming.'},
    {text:'Some water splashed out as it boiled',why:'Splashing would make the beaker lose extra mass, so Δm would be too big and L<sub>v</sub> too low, not too high.'},
    {text:'The joulemeter counted less than was supplied',why:'Too little energy counted would make ΔE too small, and L<sub>v</sub> too low, not too high.'}
  ],explain:'Some of the energy supplied heats the beaker and the air round it instead of boiling water. So less water boils away than the energy counted, Δm is too small, and L = [[ΔE|Δm]] comes out too high. Lagging the beaker cuts this.'});
}
{
  const body=act('accuracy','Multiple choice','No control funnel','');
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
