/* IAL spec points 53 and 54 (Unit 2, Waves and Particle Nature of Light): electron diffraction, ring diameter D against 1/√V,
   the spacing d of the graphite atoms from the gradient. Not a numbered core practical. The IB E.2 page is
   electron-diffraction-practical.html (source practicals/electron-diffraction/); this copy uses IAL equations and wording.
   Model as in animations/electron-diffraction.html, in IAL terms: W = QV so eV = ½mv², p = mv, λ = h/p, nλ = d sin θ with
   n = 1 (spec 51), sin θ ≈ tan θ for small angles and D = 2L tan θ, so D = (2Lh / d√(2me)) × 1/√V. L = 13.5 cm.
   Constants: h = 6.63 × 10⁻³⁴ J s, mₑ = 9.11 × 10⁻³¹ kg, e = 1.60 × 10⁻¹⁹ C.
   The Do the Experiment tab frames animations/electron-diffraction.html?show=measure&level=ial, whose fixed readings must
   match ED_V, ED_IN and ED_OUT below (as on the IB page; tools/CORE-PRACTICALS.md, "Measure modes").
   Question kinds and wording (22 Nov 2026, TODO 5v) from the IAL Past Paper Index and its mark schemes: WPH13 June 2019
   Q3 (measuring the first ring on a curved screen: calipers, diameter halved, several orientations, middle of the ring;
   interference as a wave property; λ against sin θ with gradient d), WPH13 June 2023 Q3(a) (vernier calipers: smaller
   resolution, no parallax, tips fit the curved screen; reserved), WPH12 Oct 2022 Q11 and Oct 2023 Q15 (diffraction and
   interference, maxima from constructive interference, regular structure, λ similar to the gaps between atoms; W = QV,
   ½mv², more momentum → shorter λ → smaller rings; reserved), WPH12 June 2025 Q15(b)(i) and WPH14 Jan 2024 Q15 (λ from an
   accelerating p.d. and the p.d. for a given λ; reserved, wording only). No question copies a paper's scenario or numbers. */
function examPart(body,head,q,bullets){
  body.appendChild(mk('p','sub',head));
  body.appendChild(mk('p','',FR(q)));
  const d=mk('details','');
  d.innerHTML='<summary>Check your answer</summary><div><ul>'+bullets.map(b=>'<li>'+FR(b)+'</li>').join('')+'</ul></div>';
  body.appendChild(d);
}
function resTable(head,rows){
  const t=mk('div','table-scroll');
  t.innerHTML='<table class="units res-tbl"><thead><tr>'+head.map(h=>'<th>'+h+'</th>').join('')+'</tr></thead><tbody>'+
    rows.map(r=>'<tr>'+r.map(c=>'<td>'+(c==null?'<b>?</b>':c)+'</td>').join('')+'</tr>').join('')+'</tbody></table>';
  return t;
}
const retry=g=>rnd=>{for(let i=0;i<80;i++){const r=g(rnd);if(r)return r;}return g(rnd);};
const SUP={'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
const sf=(v,p)=>{const s=(+v).toExponential((p||3)-1).split('e');return s[0]+' × 10'+String(+s[1]).replace(/./g,c=>SUP[c]||c);};
const CONSTS='Use h = 6.63 × 10⁻³⁴ J s, mₑ = 9.11 × 10⁻³¹ kg and e = 1.60 × 10⁻¹⁹ C. Type powers of ten as 2.1e-10 or 2.1×10^-10.';
const XS='<tspan dy="-6" font-size="75%">−½</tspan><tspan dy="6"></tspan>';   // V^−½ in an SVG axis label
const H=6.63e-34,ME=9.11e-31,EC=1.60e-19,C=3.00e8,RT=Math.sqrt(2*ME*EC);   // √(2me) = 5.399 × 10⁻²⁵
// The electron diffraction animation, framed at IAL level (frameAct cannot add &level).
function edFrame(panel,show,title){
  const w=mk('div','anim-wrap');
  w.innerHTML='<iframe class="anim-frame" src="animations/electron-diffraction.html?embed&level=ial'+(show?'&show='+show:'')+'" title="'+title+'"></iframe><p class="anim-open"><a href="animations/electron-diffraction.html?level=ial">Open the electron diffraction animation full screen &rarr;</a></p>';
  $('#panel-'+panel+' .acts').appendChild(w);
}

/* ================= 1. OVERVIEW ================= */
{
  const body=act('overview','Fill in the blanks','The practical in one passage','Drag a word into each gap, or tap a word and then tap a gap. Some words are not needed.');
  const parts=[
    'Electrons are released from a hot cathode and accelerated through a ',['b1','potential difference'],', V, in an evacuated tube, so each gains kinetic energy eV. They pass through a thin film of ',['b2','graphite'],
    ', whose atoms are arranged in regular layers. The graphite acts as a diffraction grating: the electrons are ',['b3','diffracted'],' and form bright ',['b4','rings'],' on the screen, where the diffracted electrons interfere constructively. Diffraction and interference are wave properties. This is evidence of the wave nature of matter. Each electron has a de Broglie wavelength λ = [[h|p]], and diffraction is clear because λ is similar to the ',['b5','spacing'],
    ' of the atoms. Raising V gives the electrons more ',['b6','momentum'],', so λ is shorter and the rings get ',['b7','smaller'],'. Measure the diameter D of each ring at each voltage. A graph of D against ',['b8','1/√V'],' is a straight line through the origin, and its gradient gives the spacing d of the atoms.'
  ];
  const cloze=mk('div','cloze'),slots=[],chips=[];
  parts.forEach(p=>{
    if(typeof p==='string')cloze.insertAdjacentHTML('beforeend',FR(p));
    else{const s=mk('span','blank');cloze.appendChild(s);slots.push({id:p[0],el:s,answer:p[1]});if(!chips.some(c=>c.text===p[1]))chips.push({id:'c-'+p[0],text:p[1]});}
  });
  ['larger','refracted','current','V²'].forEach((t,i)=>chips.push({id:'d'+i,text:t}));
  body.appendChild(cloze);
  body.appendChild(mk('div','pool-label','Word bank'));
  const pool=mk('div','chip-pool');body.appendChild(pool);
  const g={};
  const b=bar(body,[{label:'Check answers',primary:true,fn:()=>g.check()},{label:'Shuffle again',fn:()=>g.reset()}]);
  const score=mk('span','score');b.el.insertBefore(score,b.msg);
  Object.assign(g,createBlankGame({fill:true,palette:true,slots,pool,chips,msg:b,score,isCorrect:(c,s)=>c.text===s.answer}));
}

/* ================= 2. METHOD ================= */
{
  const body=act('method','Order','Carry out the practical','Put the steps in the order you would do them. Drag the ≡ handle, or use the ▲▼ buttons.');
  createReorder({host:body,steps:[
    {id:'a',text:'With the supplies switched off, connect the heater supply and the high-voltage supply to the electron diffraction tube (anode positive, cathode negative).'},
    {id:'b',text:'Darken the room, switch on the heater and let the cathode warm up.'},
    {id:'c',text:'Set the accelerating voltage to 2.0 kV and read it on the supply.'},
    {id:'d',text:'Measure the diameter of the inner ring and of the outer ring, to the middle of each bright line, in several directions, and take the mean.'},
    {id:'e',text:'Raise the voltage in steps of 0.5 kV up to 5.0 kV, measuring both rings at each voltage.'},
    {id:'f',text:'Work out [[1|√V]] for each voltage.'},
    {id:'g',text:'Plot D against [[1|√V]], draw the line of best fit through the origin and find d = [[2Lh|gradient × √(2m<sub>e</sub>e)]].'}
  ],constraints:[['a','b'],['b','c'],['c','d'],['d','e'],['e','g'],['f','g']],
  why:'The circuit is joined up with the supplies off, and the tube must be warm before any reading. 1/√V can be worked out at any point before the graph, which comes last.'});
}
{
  const body=act('method','Match','What each piece of equipment is for','Pair each piece of equipment with its job. Drag one card onto the other, or tap one card and then the other.');
  createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'t',l:'Evacuated glass tube',r:'Holds no air, so the electrons are not stopped or scattered by gas molecules'},
    {id:'c',l:'Heated cathode',r:'Releases electrons when it is hot (thermionic emission)'},
    {id:'s',l:'High-voltage supply, 2 to 5 kV',r:'Accelerates the electrons, giving each one kinetic energy eV'},
    {id:'g',l:'Thin graphite film',r:'Its regularly spaced layers of atoms diffract the electrons'},
    {id:'f',l:'Fluorescent screen',r:'Glows where electrons land, so the rings can be seen'},
    {id:'v',l:'Vernier calipers',r:'Measure a ring’s diameter across the curved screen with a small resolution'}
  ]});
}

/* ================= DO THE EXPERIMENT ================= */
// The student reads each ring's diameter on the ruler in the animation's measure mode (?show=measure) and works out 1/√V.
// ED_V, ED_IN and ED_OUT must match reading(v) in animations/electron-diffraction.html (the comment above MEAS there).
const ED_V=[2.0,2.5,3.0,3.5,4.0,4.5,5.0], ED_IN=[3.5,3.1,2.9,2.6,2.4,2.3,2.2], ED_OUT=[6.1,5.5,5.0,4.6,4.3,4.1,3.8];
const ED_X=ED_V.map(v=>100/Math.sqrt(v*1000));        // 1/√V in units of 10⁻² V^−½: 2.236, 2.000, 1.826, 1.690, 1.581, 1.491, 1.414
let edTable=null,edPlotRows=()=>{};
{
  act('do','Your turn','Take your own readings','1. Press Switch on and set the supply to 2.0 kV. 2. Choose Ruler on: Inner ring, read the ring’s diameter and write it in the table; then do the same for the outer ring. 3. Repeat at every voltage up to 5.0 kV. 4. Work out [[1|√V]] for each.');
}
edFrame('do','measure','Electron diffraction experiment: set the voltage and read each ring’s diameter on the ruler');
{
  const body=act('do','Calculate','Your results table','Write each diameter exactly as you read it on the ruler, to 0.1 cm. Give [[1|√V]] to 3 decimal places in units of 10⁻² V<sup>−½</sup>, with V in volts (2.0 kV = 2000 V). Press Check.');
  const wrap=mk('div','table-scroll');body.appendChild(wrap);
  const cell=(c,k,lab)=>'<td><input class="calc-num-input" data-c="'+c+'" data-k="'+k+'" inputmode="decimal" autocomplete="off" aria-label="'+lab+'"></td>';
  wrap.innerHTML='<table class="units res-tbl ga-tbl ed-tbl"><thead><tr><th>V (kV)</th><th>D inner (cm)</th><th>D outer (cm)</th><th>1/√V (×10⁻² V<sup>−½</sup>)</th></tr></thead><tbody>'+
    ED_V.map((v,k)=>'<tr><td class="given">'+v.toFixed(1)+'</td>'+cell('i',k,'Inner ring diameter at '+v.toFixed(1)+' kilovolts, centimetres')+cell('o',k,'Outer ring diameter at '+v.toFixed(1)+' kilovolts, centimetres')+cell('x',k,'One over root V at '+v.toFixed(1)+' kilovolts, in units of 10 to the minus 2')+'</tr>').join('')+'</tbody></table>';
  const inp=(c,k)=>$('input[data-c="'+c+'"][data-k="'+k+'"]',wrap), all=()=>$$('input',wrap);
  const val=e=>{const t=e.value.trim().replace(/[−–]/g,'-').replace(',','.').replace(/\s*[×x]\s*10\s*\^\s*/i,'e');if(t===''||!/^-?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(t))return NaN;return parseFloat(t);};
  // diameters to 0.1 cm (exact); 1/√V to 3 d.p. (± 0.0015 × 10⁻² V^−½; a value typed in V^−½, such as 0.02236, is accepted too)
  const ok=(c,k,e)=>{
    let v=val(e);if(!isFinite(v))return false;
    if(c==='x'){if(v<0.1)v*=100;return Math.abs(v-ED_X[k])<=0.0015+1e-9;}
    return Math.abs(v-(c==='i'?ED_IN:ED_OUT)[k])<=0.02;
  };
  const show=(c,k)=>c==='x'?ED_X[k].toFixed(3):(c==='i'?ED_IN:ED_OUT)[k].toFixed(1);
  const b=bar(body,[{label:'Check table',primary:true,fn:check},{label:'Clear',fn:reset}]);
  const ans=answerBtn(b,()=>{
    all().forEach(e=>{if(e.disabled)return;e.value=show(e.dataset.c,+e.dataset.k);e.disabled=true;e.classList.add('is-shown');e.classList.remove('is-wrong');});
    b.say('Answers shown (dashed). Now plot D against 1/√V for the inner ring below.','');edPlotRows();
  });
  function check(){
    let n_ok=0,bad=0,blank=0;
    all().forEach(e=>{
      if(e.disabled){n_ok++;return;}
      if(e.value.trim()===''){blank++;return;}
      if(ok(e.dataset.c,+e.dataset.k,e)){e.disabled=true;e.classList.remove('is-wrong');e.classList.add('pop');n_ok++;}
      else{bad++;e.classList.add('is-wrong');}
    });
    const n=all().length;
    if(n_ok===n){b.say('All correct. Now plot D against 1/√V for the inner ring.','good');celebrate(b.msg);ans.off();}
    else{b.say(n_ok+' of '+n+' correct'+(blank?', '+blank+' left blank':'')+'.'+(bad?' The ruler’s zero is on the left of the ring: read where the middle of the bright line crosses it on the right. For 1/√V, put V in volts (3.5 kV = 3500 V), then multiply by 100.':''),bad?'bad':'');ans.on();}
    edPlotRows();
  }
  // Show answer is always there for this table (as on CP15), so students can skip it and go on to the plot
  function reset(){all().forEach(e=>{e.value='';e.disabled=false;e.classList.remove('is-wrong','is-shown','pop');});ans.on();b.say('','');edPlotRows();}
  all().forEach(e=>e.addEventListener('input',()=>e.classList.remove('is-wrong')));
  ans.on();
  const got=(c,k)=>{const e=inp(c,k);return e.value.trim()===''||!e.disabled?null:e.value.trim();};
  edTable={x:k=>got('x',k),i:k=>got('i',k)};
  track(body,{reset:reset,
    getState:()=>({v:all().map(e=>e.value),ok:all().map(e=>e.disabled),sh:all().map(e=>e.classList.contains('is-shown'))}),
    setState:s=>{reset();all().forEach((e,i)=>{if(!s||!s.v||typeof s.v[i]!=='string')return;e.value=s.v[i];if(s.ok&&s.ok[i]){e.disabled=true;if(s.sh&&s.sh[i])e.classList.add('is-shown');}});if(all().every(e=>e.disabled)){b.say('All correct. Now plot D against 1/√V for the inner ring.','good');ans.off();}edPlotRows();},
    isDone:()=>all().every(e=>e.disabled)});
}
{
  // the same steps as a worked answer: from the data booklet equations to y = mx + c
  const body=act('do','Explain','Why plot D against 1/√V?','Each electron gains kinetic energy eV crossing the p.d. V (W = QV). Use p = mv and λ = [[h|p]]. A ring forms where d sin θ = λ (nλ = d sin θ with n = 1), and on a screen a distance L away its diameter is D = 2L tan θ. For small angles sin θ ≈ tan θ:');
  body.insertAdjacentHTML('beforeend',FR(
    '<div class="ln-steps"><span>eV</span><span>=</span><span>½m<sub>e</sub>v²</span>'+
    '<span>v</span><span>=</span><span>√([[2eV|m<sub>e</sub>]])</span>'+
    '<span>p</span><span>=</span><span>m<sub>e</sub>v = √(2m<sub>e</sub>eV)</span>'+
    '<span>λ</span><span>=</span><span>[[h|√(2m<sub>e</sub>eV)]]</span>'+
    '<span>D</span><span>=</span><span>2L tan θ ≈ 2L sin θ = [[2Lλ|d]]</span>'+
    '<span>D</span><span>=</span><span>[[2Lh|d√(2m<sub>e</sub>e)]] × [[1|√V]]</span></div>'+
    '<p class="act-intro">Compare with y = mx + c:</p>'+
    '<div class="ln-match"><span>D</span><span>=</span><span>[[2Lh|d√(2m<sub>e</sub>e)]]</span><span>[[1|√V]]</span><span>+</span><span>0</span>'+
    '<span>y</span><span>=</span><span>m</span><span>x</span><span>+</span><span>c</span></div>'+
    '<p class="act-intro">So D against [[1|√V]] is a straight line through the origin. Gradient = [[2Lh|d√(2m<sub>e</sub>e)]], so d = [[2Lh|gradient × √(2m<sub>e</sub>e)]]. A plot of D against V would be a curve, which cannot show the relationship or give d so easily.</p>'+
    '<p class="act-intro">Each ring comes from a different spacing of the atoms in graphite: the smaller the spacing d, the larger the ring. The screen in this tube is L = 13.5 cm from the graphite.</p>'));
}
{
  const body=act('do','Plot','Plot your results','Plot D against 1/√V for the inner ring, from your table, as small crosses. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');
  const ks=[0,1,2,3,4,5,6];
  createPlot({host:body,next:' Now find d from the line of best fit below.',
    points:ks.map(k=>({x:+ED_X[k].toFixed(3),y:ED_IN[k]})),
    rowText:p=>{const k=ks.find(j=>+ED_X[j].toFixed(3)===p.x);return rowLabel(k);},
    graph:{xMin:0,xMax:2.5,yMin:0,yMax:4,xTicks:[0,0.5,1,1.5,2,2.5],yTicks:[0,1,2,3,4],minor:[0.1,0.2],snap:[0.01,0.1],tol:[0.05,0.1],xLabel:'1/√V (×10⁻² V'+XS+')',yLabel:'D inner (cm)',W:560,H:340}});
  function rowLabel(k){const x=edTable&&edTable.x(k),d=edTable&&edTable.i(k);return (x?'1/√V = '+x:'your 1/√V')+', '+(d?'D = '+d+' cm':'your D');}
  // the animation and the results table side by side, as on CP15; Your turn sits above the animation
  {const fr=$('#panel-do .anim-wrap'),tb=$('#panel-do .ed-tbl').closest('.act'),yt=$('#panel-do .act[data-title="Take your own readings"]');
   if(fr&&tb){const sp=mk('div','hk-split'),left=mk('div','ga-left');fr.parentNode.insertBefore(sp,fr);sp.appendChild(left);if(yt)left.appendChild(yt);left.appendChild(fr);sp.appendChild(tb);}}
  edPlotRows=()=>{$$('.plot-row',body).forEach((li,i)=>{const s=li.firstElementChild;if(s)s.textContent=rowLabel(ks[i]);});};
  edPlotRows();
}
{
  const body=act('do','Calculate','d from your line','A good line of best fit through your points passes through the origin and (2.40 × 10⁻² V<sup>−½</sup>, 3.72 cm). Read nothing else off the graph. L = 13.5 cm. '+CONSTS);
  createCalc({host:body,questions:[
    {q:'What is the gradient of the line, in m V<sup>½</sup>?',unit:'m V½',answer:1.55,working:'first point = (0, 0)<br>second point = (2.40 × 10⁻² V<sup>−½</sup>, 3.72 × 10⁻² m)<br>gradient = ?||gradient = [[change in D|change in 1/√V]]<br>gradient = [[3.72 × 10⁻² − 0|2.40 × 10⁻² − 0]]<br>gradient = 1.55 m V<sup>½</sup>'},
    {q:'What spacing d of the graphite atoms does the line give?',unit:'m',answer:2.14e-10,working:'gradient = 1.55 m V<sup>½</sup><br>L = 0.135 m<br>d = ?||gradient = [[2Lh|d√(2m<sub>e</sub>e)]]<br>1.55 = [[2 × 0.135 × 6.63 × 10⁻³⁴|d × √(2 × 9.11 × 10⁻³¹ × 1.60 × 10⁻¹⁹)]]<br>1.55 = [[1.790 × 10⁻³⁴|d × 5.399 × 10⁻²⁵]]<br>d = [[1.790 × 10⁻³⁴|1.55 × 5.399 × 10⁻²⁵]]<br>d = 2.14 × 10⁻¹⁰ m',
     hints:['gradient = [[2Lh|d√(2m<sub>e</sub>e)]], with L in metres.','Work out √(2m<sub>e</sub>e) first: 5.399 × 10⁻²⁵.','d = [[2Lh|gradient × √(2m<sub>e</sub>e)]].']},
    {q:'What is the de Broglie wavelength of the electrons at 3.0 kV?',unit:'m',answer:2.24e-11,working:'V = 3.0 kV = 3000 V<br>λ = ?||W = QV<br>W = 1.60 × 10⁻¹⁹ × 3000<br>W = 4.80 × 10⁻¹⁶ J<br>½m<sub>e</sub>v² = 4.80 × 10⁻¹⁶<br>½ × 9.11 × 10⁻³¹ × v² = 4.80 × 10⁻¹⁶<br>v² = 1.054 × 10¹⁵<br>v = 3.246 × 10⁷ m s⁻¹<br>p = m<sub>e</sub>v<br>p = 9.11 × 10⁻³¹ × 3.246 × 10⁷<br>p = 2.957 × 10⁻²³ kg m s⁻¹<br>λ = [[h|p]]<br>λ = [[6.63 × 10⁻³⁴|2.957 × 10⁻²³]]<br>λ = 2.24 × 10⁻¹¹ m',
     hints:['W = QV gives the kinetic energy, with V in volts.','½m<sub>e</sub>v² = W gives v, then p = m<sub>e</sub>v.','λ = [[h|p]].']}
  ]});
}

/* ================= SHOW: the readings taken for you ================= */
{
  act('experiment','Your turn','Watch the readings','Press Experiment, then Switch on: the supply steps from 2.0 kV to 5.0 kV, both ring diameters are read off the scale and plotted against [[1|√V]], so the graph fills in by itself. Why are both sets of points on straight lines through the origin? Which ring gives the smaller spacing d? Then open Show working: why does the outer ring give 1.21 × 10⁻¹⁰ m, a little below the true 1.23 × 10⁻¹⁰ m?');
}
edFrame('experiment','','Electron diffraction animation: an electron gun, a graphite film and a screen in a glass tube, the high-voltage supply, the rings on the screen and a graph');

/* ================= 5. ANALYSIS ================= */
const GR={xMin:0,xMax:2.5,yMin:0,yMax:7,xTicks:[0,0.5,1,1.5,2,2.5],yTicks:[0,0.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7],xLabel:'1/√V (×10⁻² V'+XS+')',yLabel:'D (cm)',W:560,H:340};
function lab(g0,t,x,y){return '<circle cx="'+g0.gx(x)+'" cy="'+g0.gy(y)+'" r="13" fill="var(--panel)" stroke="var(--ink)" stroke-width="2"/><text x="'+g0.gx(x)+'" y="'+(g0.gy(y)+5)+'" text-anchor="middle" font-size="14" fill="var(--ink)">'+t+'</text>';}
{
  const body=act('graphs','Calculate','Two rings','Dev measures both rings in a tube with L = 13.5 cm. The graph shows his lines of best fit: A for the inner ring, B for the outer ring. Read your answers off the graph. '+CONSTS);
  const split=mk('div','graph-split');body.appendChild(split);
  const g0=lineGraph(Object.assign({points:[[0,0]]},GR));
  split.appendChild(mk('div','graph-box',lineGraph(Object.assign({label:'Ring diameter against one over root V: line A through the origin and (2.0, 3.0), line B through the origin and (2.0, 5.5)',
    segments:[{pts:[[0,0],[2.4,3.6]]},{pts:[[0,0],[2.4,6.6]],cls:'g-line-b'}],
    extra:lab(g0,'A',2.25,3.4+0.5)+lab(g0,'B',2.0,5.5+0.6)},GR)).svg));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'What is the gradient of line B, in m V<sup>½</sup>?',unit:'m V½',answer:2.75,working:'point on line B = (2.0 × 10⁻² V<sup>−½</sup>, 5.5 × 10⁻² m)<br>gradient = ?||gradient = [[5.5 × 10⁻² − 0|2.0 × 10⁻² − 0]]<br>gradient = 2.75 m V<sup>½</sup>'},
    {q:'What spacing d gives the outer ring?',unit:'m',answer:1.21e-10,working:'gradient = 2.75 m V<sup>½</sup><br>L = 0.135 m<br>d = ?||d = [[2Lh|gradient × √(2m<sub>e</sub>e)]]<br>d = [[2 × 0.135 × 6.63 × 10⁻³⁴|2.75 × 5.399 × 10⁻²⁵]]<br>d = [[1.790 × 10⁻³⁴|1.485 × 10⁻²⁴]]<br>d = 1.21 × 10⁻¹⁰ m'},
    {q:'How many times larger is the spacing for the inner ring than for the outer ring?',unit:'',answer:1.83,working:'gradient A = [[3.0|2.0]] = 1.5 m V<sup>½</sup><br>gradient B = 2.75 m V<sup>½</sup><br>[[d<sub>A</sub>|d<sub>B</sub>]] = ?||d = [[2Lh|gradient × √(2m<sub>e</sub>e)]], so d ∝ [[1|gradient]]<br>[[d<sub>A</sub>|d<sub>B</sub>]] = [[gradient B|gradient A]]<br>[[d<sub>A</sub>|d<sub>B</sub>]] = [[2.75|1.5]]<br>[[d<sub>A</sub>|d<sub>B</sub>]] = 1.83'}
  ]});
}
// λ against sin θ for one ring: a line through the origin whose gradient is d (nλ = d sin θ, n = 1).
const GL={xMin:0,xMax:0.25,yMin:0,yMax:3,xTicks:[0,0.05,0.1,0.15,0.2,0.25],yTicks:[0,0.5,1,1.5,2,2.5,3],xLabel:'sin θ',yLabel:'λ (×10⁻¹¹ m)',W:560,H:340};
{
  const body=act('graphs','Calculate','λ against sin θ','Hao works out the de Broglie wavelength λ of the electrons at each voltage and measures the angle θ of one ring. He plots λ against sin θ and draws the line of best fit. '+CONSTS);
  const split=mk('div','graph-split');body.appendChild(split);
  const g0=lineGraph(Object.assign({points:[[0,0]]},GL));
  const cross=(x,y)=>{const X=g0.gx(x),Y=g0.gy(y);return '<path d="M'+(X-5)+' '+(Y-5)+'l10 10M'+(X+5)+' '+(Y-5)+'l-10 10" stroke="var(--ink)" stroke-width="2"/>';};
  const pts=[[0.098,1.24],[0.112,1.38],[0.128,1.62],[0.145,1.80],[0.160,2.01],[0.181,2.25],[0.196,2.47]];
  split.appendChild(mk('div','graph-box',lineGraph(Object.assign({label:'Wavelength against sine of the angle: seven crosses close to a straight line through the origin and (0.20, 2.5)',
    segments:[{pts:[[0,0],[0.24,3.0]]}],extra:pts.map(p=>cross(p[0],p[1])).join('')},GL)).svg));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'Use the gradient of the line to find the spacing d of the atoms that give this ring.',unit:'m',answer:1.25e-10,working:'first point = (0, 0)<br>second point = (0.20, 2.5 × 10⁻¹¹ m)<br>d = ?||nλ = d sin θ, with n = 1<br>λ = d × sin θ<br>y = m × x, so d = gradient<br>gradient = [[2.5 × 10⁻¹¹ − 0|0.20 − 0]]<br>d = 1.25 × 10⁻¹⁰ m',
     hints:['Compare λ = d sin θ with y = mx.','Read two points far apart on the line.']},
    {q:'Read λ when sin θ = 0.16, then find the accelerating p.d. that gives it.',unit:'V',answer:3770,working:'λ = 2.0 × 10⁻¹¹ m (read off the line)<br>V = ?||λ = [[h|p]]<br>p = [[6.63 × 10⁻³⁴|2.0 × 10⁻¹¹]]<br>p = 3.315 × 10⁻²³ kg m s⁻¹<br>p = m<sub>e</sub>v<br>v = [[3.315 × 10⁻²³|9.11 × 10⁻³¹]]<br>v = 3.639 × 10⁷ m s⁻¹<br>eV = ½m<sub>e</sub>v²<br>1.60 × 10⁻¹⁹ × V = ½ × 9.11 × 10⁻³¹ × (3.639 × 10⁷)²<br>1.60 × 10⁻¹⁹ × V = 6.032 × 10⁻¹⁶<br>V = [[6.032 × 10⁻¹⁶|1.60 × 10⁻¹⁹]]<br>V = 3770 V',
     hints:['At sin θ = 0.16 the line is at λ = 2.0 × 10⁻¹¹ m.','p = [[h|λ]], then v = [[p|m<sub>e</sub>]].','eV = ½m<sub>e</sub>v².']}
  ]});
}

/* ================= 6. CALCULATE ================= */
{
  const body=act('calculate','Calculate','De Broglie wavelength and the rings','Use W = QV, E<sub>k</sub> = ½mv², p = mv, λ = [[h|p]] and nλ = d sin θ. '+CONSTS+' Press New problems for another set.');
  const lamV=V=>H/Math.sqrt(2*ME*EC*V);
  const WHO=['Kenji','Arif','Mateo','Rohan','Leon','Minh','Hiroshi','Kabir'];
  const chainV=V=>{const W=EC*V,v=Math.sqrt(2*W/ME),p=ME*v,l=H/p;return {W,v,p,l};};
  createCalc({host:body,questions:[
    {q:'Kenji wants electrons with a de Broglie wavelength of 2.50 × 10⁻¹¹ m. Through what potential difference must he accelerate them from rest?',unit:'V',answer:2410,
     working:'λ = 2.50 × 10⁻¹¹ m<br>V = ?||λ = [[h|p]]<br>2.50 × 10⁻¹¹ = [[6.63 × 10⁻³⁴|p]]<br>p = [[6.63 × 10⁻³⁴|2.50 × 10⁻¹¹]]<br>p = 2.652 × 10⁻²³ kg m s⁻¹<br>p = m<sub>e</sub>v<br>v = [[2.652 × 10⁻²³|9.11 × 10⁻³¹]]<br>v = 2.911 × 10⁷ m s⁻¹<br>eV = ½m<sub>e</sub>v²<br>1.60 × 10⁻¹⁹ × V = ½ × 9.11 × 10⁻³¹ × (2.911 × 10⁷)²<br>1.60 × 10⁻¹⁹ × V = 3.860 × 10⁻¹⁶<br>V = [[3.860 × 10⁻¹⁶|1.60 × 10⁻¹⁹]]<br>V = 2410 V',
     hints:['p = [[h|λ]].','v = [[p|m<sub>e</sub>]].','eV = ½m<sub>e</sub>v².'],
     make:rnd=>{const who=calcPick(rnd,WHO),l=calcPick(rnd,[1.50,1.80,2.00,2.20,2.50,3.00,3.50]),p=H/(l*1e-11),v=p/ME,Ek=0.5*ME*v*v,V=Ek/EC;
       return {q:`${who} wants electrons with a de Broglie wavelength of ${l.toFixed(2)} × 10⁻¹¹ m. Through what potential difference must he accelerate them from rest?`,unit:'V',answer:+V.toPrecision(3),
         hints:['p = [[h|λ]].','v = [[p|m<sub>e</sub>]].','eV = ½m<sub>e</sub>v².'],
         working:`λ = ${l.toFixed(2)} × 10⁻¹¹ m<br>V = ?||λ = [[h|p]]<br>${l.toFixed(2)} × 10⁻¹¹ = [[6.63 × 10⁻³⁴|p]]<br>p = [[6.63 × 10⁻³⁴|${l.toFixed(2)} × 10⁻¹¹]]<br>p = ${sf(p,4)} kg m s⁻¹<br>p = m<sub>e</sub>v<br>v = [[${sf(p,4)}|9.11 × 10⁻³¹]]<br>v = ${sf(v,4)} m s⁻¹<br>eV = ½m<sub>e</sub>v²<br>1.60 × 10⁻¹⁹ × V = ½ × 9.11 × 10⁻³¹ × (${sf(v,4)})²<br>1.60 × 10⁻¹⁹ × V = ${sf(Ek,4)}<br>V = [[${sf(Ek,4)}|1.60 × 10⁻¹⁹]]<br>V = ${calcNum(+V.toPrecision(3))} V`};}},
    {q:'A spaceship’s electron microscope accelerates electrons from rest through 4.5 kV. What is their de Broglie wavelength?',unit:'m',answer:1.83e-11,
     working:'V = 4.5 kV = 4500 V<br>λ = ?||W = QV<br>W = 1.60 × 10⁻¹⁹ × 4500<br>W = 7.200 × 10⁻¹⁶ J<br>½m<sub>e</sub>v² = 7.200 × 10⁻¹⁶<br>v = √([[2 × 7.200 × 10⁻¹⁶|9.11 × 10⁻³¹]])<br>v = 3.976 × 10⁷ m s⁻¹<br>p = m<sub>e</sub>v<br>p = 9.11 × 10⁻³¹ × 3.976 × 10⁷<br>p = 3.622 × 10⁻²³ kg m s⁻¹<br>λ = [[h|p]]<br>λ = [[6.63 × 10⁻³⁴|3.622 × 10⁻²³]]<br>λ = 1.83 × 10⁻¹¹ m',
     hints:['W = QV, with V in volts.','½m<sub>e</sub>v² = W gives v.','p = m<sub>e</sub>v, then λ = [[h|p]].'],
     make:rnd=>{const kv=calcPick(rnd,[1.5,2.5,3.5,4.5,6.0,8.0,10]),ctx=calcPick(rnd,['A spaceship’s electron microscope accelerates','A Mars rover’s electron gun accelerates','An electron diffraction tube accelerates','A space probe’s electron beam instrument accelerates']),V=kv*1000,c=chainV(V);
       return {q:`${ctx} electrons from rest through ${kv} kV. What is their de Broglie wavelength?`,unit:'m',answer:+c.l.toPrecision(3),
         hints:['W = QV, with V in volts.','½m<sub>e</sub>v² = W gives v.','p = m<sub>e</sub>v, then λ = [[h|p]].'],
         working:`V = ${kv} kV = ${calcNum(V)} V<br>λ = ?||W = QV<br>W = 1.60 × 10⁻¹⁹ × ${calcNum(V)}<br>W = ${sf(c.W,4)} J<br>½m<sub>e</sub>v² = ${sf(c.W,4)}<br>v = √([[2 × ${sf(c.W,4)}|9.11 × 10⁻³¹]])<br>v = ${sf(c.v,4)} m s⁻¹<br>p = m<sub>e</sub>v<br>p = 9.11 × 10⁻³¹ × ${sf(c.v,4)}<br>p = ${sf(c.p,4)} kg m s⁻¹<br>λ = [[h|p]]<br>λ = [[6.63 × 10⁻³⁴|${sf(c.p,4)}]]<br>λ = ${sf(c.l)} m`};}},
    {q:'Electrons accelerated through 3.0 kV pass through graphite with atom spacing d = 2.13 × 10⁻¹⁰ m. The screen is 14.0 cm from the graphite. Use nλ = d sin θ with n = 1 to find the diameter of the ring.',unit:'cm',answer:2.96,
     working:'V = 3000 V<br>d = 2.13 × 10⁻¹⁰ m<br>L = 0.140 m<br>D = ?||λ = [[h|√(2m<sub>e</sub>eV)]]<br>λ = [[6.63 × 10⁻³⁴|√(2 × 9.11 × 10⁻³¹ × 1.60 × 10⁻¹⁹ × 3000)]]<br>λ = 2.242 × 10⁻¹¹ m<br>λ = d sin θ<br>sin θ = [[2.242 × 10⁻¹¹|2.13 × 10⁻¹⁰]]<br>sin θ = 0.1053<br>θ = 6.04°<br>D = 2L tan θ<br>D = 2 × 0.140 × tan 6.04°<br>D = 0.0296 m = 2.96 cm',
     hints:['Find λ from eV = ½m<sub>e</sub>v², p = m<sub>e</sub>v and λ = [[h|p]].','sin θ = [[λ|d]].','The ring’s radius is L tan θ, so D = 2L tan θ.'],
     make:rnd=>{const kv=calcPick(rnd,[2.0,2.5,3.0,4.0,5.0]),dd=calcPick(rnd,[1.23,2.13]),Lc=calcPick(rnd,[12.0,13.5,14.0,15.0]),l=lamV(kv*1000),sn=l/(dd*1e-10),th=Math.asin(sn),D=2*Lc*Math.tan(th),deg=th*180/Math.PI;
       return {q:`Electrons accelerated through ${kv.toFixed(1)} kV pass through graphite with atom spacing d = ${dd.toFixed(2)} × 10⁻¹⁰ m. The screen is ${Lc.toFixed(1)} cm from the graphite. Use nλ = d sin θ with n = 1 to find the diameter of the ring.`,unit:'cm',answer:+D.toPrecision(3),
         hints:['Find λ from eV = ½m<sub>e</sub>v², p = m<sub>e</sub>v and λ = [[h|p]].','sin θ = [[λ|d]].','The ring’s radius is L tan θ, so D = 2L tan θ.'],
         working:`V = ${calcNum(kv*1000)} V<br>d = ${dd.toFixed(2)} × 10⁻¹⁰ m<br>L = ${(Lc/100).toFixed(3)} m<br>D = ?||λ = [[h|√(2m<sub>e</sub>eV)]]<br>λ = [[6.63 × 10⁻³⁴|√(2 × 9.11 × 10⁻³¹ × 1.60 × 10⁻¹⁹ × ${calcNum(kv*1000)})]]<br>λ = ${sf(l,4)} m<br>λ = d sin θ<br>sin θ = [[${sf(l,4)}|${dd.toFixed(2)} × 10⁻¹⁰]]<br>sin θ = ${sn.toFixed(4)}<br>θ = ${deg.toFixed(2)}°<br>D = 2L tan θ<br>D = 2 × ${(Lc/100).toFixed(3)} × tan ${deg.toFixed(2)}°<br>D = ${(D/100).toPrecision(3)} m = ${D.toPrecision(3)} cm`};}},
    {q:'A deep-sea research robot’s electron gun fires electrons at 2.5 × 10⁷ m s⁻¹. What is their de Broglie wavelength?',unit:'m',answer:2.91e-11,
     working:'v = 2.5 × 10⁷ m s⁻¹<br>λ = ?||p = m<sub>e</sub>v<br>p = 9.11 × 10⁻³¹ × 2.5 × 10⁷<br>p = 2.278 × 10⁻²³ kg m s⁻¹<br>λ = [[h|p]]<br>λ = [[6.63 × 10⁻³⁴|2.278 × 10⁻²³]]<br>λ = 2.91 × 10⁻¹¹ m',
     make:rnd=>{const v=calcPick(rnd,[1.5,2.0,2.5,3.2,4.0,4.8,6.0]),ctx=calcPick(rnd,['A deep-sea research robot’s electron gun fires','A Mars rover’s electron microscope fires','A drone’s electron beam sensor fires','A space probe’s electron gun fires']),p=ME*v*1e7,l=H/p;
       return {q:`${ctx} electrons at ${v.toFixed(1)} × 10⁷ m s⁻¹. What is their de Broglie wavelength?`,unit:'m',answer:+l.toPrecision(3),
         working:`v = ${v.toFixed(1)} × 10⁷ m s⁻¹<br>λ = ?||p = m<sub>e</sub>v<br>p = 9.11 × 10⁻³¹ × ${v.toFixed(1)} × 10⁷<br>p = ${sf(p,4)} kg m s⁻¹<br>λ = [[h|p]]<br>λ = [[6.63 × 10⁻³⁴|${sf(p,4)}]]<br>λ = ${sf(l)} m`};}}
  ]});
}

/* ================= 7. ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Better results or safer?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'Better results',hint:'More accurate or more reliable readings',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps people safe',hint:'Protects from high voltage, glass or heat',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Measure the diameter, not the radius, as the centre of the ring is hard to find',cat:'a'},
    {id:'2',text:'Use vernier calipers, which have a smaller resolution and fit the curved screen',cat:'a'},
    {id:'3',text:'Measure each ring in several directions and take the mean',cat:'a'},
    {id:'4',text:'Measure to the middle of the bright line, and darken the room so it shows clearly',cat:'a'},
    {id:'5',text:'Switch off the high-voltage supply before changing any connection',cat:'s'},
    {id:'6',text:'Use shrouded leads and never touch the terminals while the supply is on',cat:'s'},
    {id:'7',text:'Handle the evacuated glass tube with care, as it could implode if cracked',cat:'s'},
    {id:'8',text:'Let the tube cool before moving it, as the heater makes it hot',cat:'s'}
  ]});
}

/* ================= EXAM PRACTICE ================= */
// Original question in Edexcel IAL command words. Kenji's tube: L = 14.0 cm, d = 2.13 × 10⁻¹⁰ m, D = 2Lλ/d.
{
  const body=act('exam','Exam style','Electron diffraction','Kenji accelerates electrons through a potential difference V and fires them at a thin graphite film in an evacuated tube. He measures the diameter D of one ring on a screen 14.0 cm from the graphite. One reading is missing. '+CONSTS);
  body.appendChild(resTable(['V (kV)','1.5','2.0','3.0','4.0','6.0'],[['D (cm)','4.2','3.6','2.9',null,'2.1']]));
  examPart(body,'(a) 4 marks','Explain what the rings on the screen show about the electrons and about the structure of graphite.',[
    'Electrons can show wave behaviour.',
    'The electrons diffract as they pass through the graphite (the graphite acts as a diffraction grating), and the diffracted electrons interfere (superpose): bright rings are where they interfere constructively.',
    'The structure of graphite must be ordered (regular, layered).',
    'The (de Broglie) wavelength of the electrons is similar to the spacing of the gaps between the atoms.'
  ]);
  body.appendChild(mk('p','sub','(b) 3 marks'));
  createCalc({host:body,questions:[
    {q:'Show that the de Broglie wavelength of the electrons at 3.6 kV is about 2 × 10⁻¹¹ m. Give your value to 3 significant figures.',unit:'m',answer:2.05e-11,working:'V = 3600 V<br>λ = ?||W = QV = 1.60 × 10⁻¹⁹ × 3600<br>W = 5.760 × 10⁻¹⁶ J<br>½m<sub>e</sub>v² = 5.760 × 10⁻¹⁶<br>v = √([[2 × 5.760 × 10⁻¹⁶|9.11 × 10⁻³¹]])<br>v = 3.556 × 10⁷ m s⁻¹<br>p = m<sub>e</sub>v = 9.11 × 10⁻³¹ × 3.556 × 10⁷<br>p = 3.240 × 10⁻²³ kg m s⁻¹<br>λ = [[h|p]]<br>λ = [[6.63 × 10⁻³⁴|3.240 × 10⁻²³]]<br>λ = 2.05 × 10⁻¹¹ m'}
  ]});
  body.appendChild(mk('p','sub','(c) 2 marks'));
  createCalc({host:body,questions:[
    {q:'Predict the missing diameter at 4.0 kV.',unit:'cm',answer:2.55,working:'D ∝ λ ∝ [[1|√V]]<br>D at 2.0 kV = 3.6 cm<br>D = ?||[[D|3.6]] = [[√2.0|√4.0]]<br>D = 3.6 × [[√2.0|√4.0]]<br>D = 3.6 × 0.7071<br>D = 2.55 cm'}
  ]});
  examPart(body,'(d) 3 marks','Kenji plots D against [[1|√V]]. Explain why the graph is a straight line through the origin, and how he can find the spacing d of the atoms from it.',[
    'eV = ½m<sub>e</sub>v², p = m<sub>e</sub>v and λ = [[h|p]], so λ = [[h|√(2m<sub>e</sub>eV)]], so λ ∝ [[1|√V]].',
    'λ = d sin θ, and for small angles sin θ ≈ tan θ = [[D|2L]], so D = [[2Lh|d√(2m<sub>e</sub>e)]] × [[1|√V]]: compare with y = mx (+ c), a straight line through the origin.',
    'd = [[2Lh|gradient × √(2m<sub>e</sub>e)]].'
  ]);
  body.appendChild(mk('p','sub','(e) 2 marks'));
  createCalc({host:body,questions:[
    {q:'The gradient of Kenji’s line is 1.61 m V<sup>½</sup>. Determine d.',unit:'m',answer:2.14e-10,working:'gradient = 1.61 m V<sup>½</sup><br>L = 0.140 m<br>d = ?||d = [[2Lh|gradient × √(2m<sub>e</sub>e)]]<br>d = [[2 × 0.140 × 6.63 × 10⁻³⁴|1.61 × 5.399 × 10⁻²⁵]]<br>d = [[1.856 × 10⁻³⁴|8.692 × 10⁻²⁵]]<br>d = 2.14 × 10⁻¹⁰ m'}
  ]});
  examPart(body,'(f) 3 marks','State and explain what happens to the rings when the accelerating potential difference is increased.',[
    'The electrons gain more kinetic energy, so their (maximum) momentum (and velocity) increases.',
    'λ = [[h|p]], so the de Broglie wavelength of the electrons decreases.',
    'So the diffraction angle is smaller and the diameter of the rings decreases (the rings get closer together).'
  ]);
  examPart(body,'(g) 6 marks','Describe how Kenji could measure the diameter of a ring accurately and use his results to determine d. Include one safety precaution.',[
    'Set V on the supply and read it; darken the room so the rings show clearly.',
    'Use vernier calipers (or dividers transferred to a ruler, or a flexible tape): the screen is curved, so the tips are easier to line up with the ring than a ruler; they also have a smaller resolution and no parallax error.',
    'Measure the diameter of the ring (and divide by 2 for the radius), rather than measuring from the centre.',
    'Measure to the middle (brightest part) of the ring, in several orientations, and take the mean.',
    'Repeat for at least five values of V across the range (e.g. 2 to 5 kV).',
    'Plot D against [[1|√V]], draw a line of best fit through the origin, and d = [[2Lh|gradient × √(2m<sub>e</sub>e)]].',
    'Safety: switch off the high-voltage supply before changing connections / do not touch the terminals while it is on.'
  ]);
  examPart(body,'(h) 2 marks','State why the distance from the graphite to the screen must stay the same for every reading, and why the tube must be evacuated.',[
    'D = 2L tan θ, so D depends on L as well as on λ; L must be fixed (and known) for D to change only because of V, and L appears in the gradient.',
    'Without a vacuum the electrons would collide with gas molecules and be scattered or stopped, so no clear pattern would form.'
  ]);
}
