/* IB E.2 (HL) Electron diffraction: ring diameter D against 1/√V, the spacing d of the graphite atoms from the gradient.
   Built on the CP15 model (gamma-absorption) and laid out like photoelectric-practical.html. IB 2025 has no prescribed
   practicals: this is the experiment behind the E.2 understandings "diffraction of particles as evidence of the wave nature
   of matter" and "λ = h/p", and the guidance "a description of a scattering experiment including the location of minimum
   intensity for the diffracted particles based on their de Broglie wavelength" (the Analysis tab's second card).
   Model as in animations/electron-diffraction.html: E_k = eV (V = W/q), E_k = p²/2m, λ = h/p, θ ≈ λ/d, D = 2L tan θ ≈ 2Lθ,
   so D = (2Lh / d√(2me)) × 1/√V, a straight line through the origin. L = 13.5 cm (the animation does not show it).
   Constants (IB data booklet): h = 6.63 × 10⁻³⁴ J s, mₑ = 9.11 × 10⁻³¹ kg, e = 1.60 × 10⁻¹⁹ C, c = 3.00 × 10⁸ m s⁻¹.
   The Do the Experiment tab frames animations/electron-diffraction.html?show=measure&level=ib, whose fixed readings must
   match ED_V, ED_IN and ED_OUT below (reading(v) in the animation; tools/CORE-PRACTICALS.md, "Measure modes").
   Question kinds and wording (21 Nov 2026, TODO 5v) from the IB Physics Question Index (P2 HL Nov 2007 A4(a)(b): the rings,
   and why faster electrons change them; Nov 2008 B3 Pt2 (c)(d)(g); Nov 2010 B1 Pt2 (b): λ of electrons accelerated through
   a p.d.; P1 HL λ ∝ 1/√V items; P2 HL May 2022 TZ2 Q9 and May 2019 TZ1 Q2: first minimum of electrons scattered by nuclei,
   reserved, wording only) and the IAL Past Paper Index with its mark schemes (WPH13 June 2019 Q3(a)(b): measuring the
   ring on a curved screen, interference as a wave property; WPH13 June 2023 Q3(a): vernier calipers, reserved; WPH12
   Oct 2022 Q11, Oct 2023 Q15(a)(b)(iii): diffraction and interference, regular structure, λ similar to the atomic spacing,
   higher p.d. → more momentum → shorter λ → smaller rings, reserved). No question copies a paper's scenario or numbers. */
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
// The electron diffraction animation, framed at IB level (frameAct cannot add &level).
function edFrame(panel,show,title){
  const w=mk('div','anim-wrap');
  w.innerHTML='<iframe class="anim-frame" src="animations/electron-diffraction.html?embed&level=ib'+(show?'&show='+show:'')+'" title="'+title+'"></iframe><p class="anim-open"><a href="animations/electron-diffraction.html?level=ib">Open the electron diffraction animation full screen &rarr;</a></p>';
  $('#panel-'+panel+' .acts').appendChild(w);
}

/* ================= 1. OVERVIEW ================= */
{
  const body=act('overview','Fill in the blanks','The practical in one passage','Drag a word into each gap, or tap a word and then tap a gap. Some words are not needed.');
  const parts=[
    'Electrons are released from a hot cathode and accelerated through a ',['b1','potential difference'],', V, in an evacuated tube, so each gains kinetic energy eV. They pass through a thin film of ',['b2','graphite'],
    ', whose atoms are arranged in regular layers. The electrons are ',['b3','diffracted'],' and form bright ',['b4','rings'],' on the screen: the diffracted electrons interfere, which only waves do. This is evidence of the wave nature of matter. Each electron has a de Broglie wavelength λ = [[h|p]], and diffraction is clear because λ is similar to the ',['b5','spacing'],
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
  const body=act('do','Explain','Why plot D against 1/√V?','Each electron gains kinetic energy eV crossing the p.d. V (V = [[W|q]]). Use E<sub>k</sub> = [[p²|2m]] and λ = [[h|p]]. A ring is at angle θ ≈ [[λ|d]] to the beam, and on a screen a distance L away its diameter is D = 2L tan θ ≈ 2Lθ for small angles:');
  body.insertAdjacentHTML('beforeend',FR(
    '<div class="ln-steps"><span>eV</span><span>=</span><span>[[p²|2m<sub>e</sub>]]</span>'+
    '<span>p</span><span>=</span><span>√(2m<sub>e</sub>eV)</span>'+
    '<span>λ</span><span>=</span><span>[[h|√(2m<sub>e</sub>eV)]]</span>'+
    '<span>D</span><span>=</span><span>[[2Lλ|d]]</span>'+
    '<span>D</span><span>=</span><span>[[2Lh|d√(2m<sub>e</sub>e)]] × [[1|√V]]</span></div>'+
    '<p class="act-intro">In the order of y = mx + c:</p>'+
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
    {q:'What is the de Broglie wavelength of the electrons at 3.0 kV?',unit:'m',answer:2.24e-11,working:'V = 3.0 kV = 3000 V<br>λ = ?||E<sub>k</sub> = eV<br>E<sub>k</sub> = 1.60 × 10⁻¹⁹ × 3000<br>E<sub>k</sub> = 4.80 × 10⁻¹⁶ J<br>E<sub>k</sub> = [[p²|2m<sub>e</sub>]]<br>4.80 × 10⁻¹⁶ = [[p²|2 × 9.11 × 10⁻³¹]]<br>p² = 8.746 × 10⁻⁴⁶<br>p = 2.957 × 10⁻²³ kg m s⁻¹<br>λ = [[h|p]]<br>λ = [[6.63 × 10⁻³⁴|2.957 × 10⁻²³]]<br>λ = 2.24 × 10⁻¹¹ m',
     hints:['E<sub>k</sub> = eV, with V in volts.','p = √(2m<sub>e</sub>E<sub>k</sub>).','λ = [[h|p]].']}
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
// Electrons scattered by nuclei: a first minimum at 32°. Intensity on a log scale, as the papers draw it.
const GS={xMin:0,xMax:64,yMin:-3,yMax:2,xTicks:[0,8,16,24,32,40,48,56,64],yTicks:[],xLabel:'Scattering angle θ (°)',yLabel:'Relative intensity',W:560,H:340};
{
  const body=act('graphs','Calculate','The first minimum','Electrons of energy 420 MeV are fired at a thin carbon-12 foil. A detector measures how many are scattered at each angle θ. At this energy the de Broglie wavelength of the electrons is λ = 2.96 × 10⁻¹⁵ m. The first minimum of the pattern is where sin θ ≈ [[λ|D]], where D is the diameter of a nucleus.');
  const split=mk('div','graph-split');body.appendChild(split);
  const sinc2=t=>{const u=Math.PI*t/32;return t===0?1:Math.pow(Math.sin(u)/u,2);};
  const pts=[];for(let t=0;t<=64;t+=0.5)pts.push([t,Math.log10(100*Math.exp(-t/10)*(sinc2(t)+0.004))]);
  const g0=lineGraph(Object.assign({points:[[0,0]]},GS));
  let ex='';[-3,-2,-1,0,1,2].forEach(p=>{const y=g0.gy(p);ex+='<line class="g-grid" x1="58" x2="'+(560-18)+'" y1="'+y+'" y2="'+y+'"/><text class="g-tick" x="50" y="'+(y+5)+'" text-anchor="end">'+(p<0?'10⁻'+[0,'¹','²','³'][-p]:p===0?'1':p===1?'10':'100')+'</text>';});
  split.appendChild(mk('div','graph-box',lineGraph(Object.assign({label:'Relative intensity on a log scale against scattering angle: it falls from 100 at 0 degrees to a sharp minimum at 32 degrees, rises to a small maximum near 46 degrees, then falls again',
    segments:[{pts:pts}],extra:ex},GS)).svg));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'Read the angle of the first minimum.',unit:'°',answer:32,working:'graph of intensity against θ<br>θ = ?||The first minimum is the first dip in the intensity after the central maximum.<br>θ = 32°'},
    {q:'Estimate the diameter D of a carbon-12 nucleus.',unit:'m',answer:5.59e-15,working:'λ = 2.96 × 10⁻¹⁵ m<br>θ = 32°<br>D = ?||sin θ ≈ [[λ|D]]<br>sin 32° = [[2.96 × 10⁻¹⁵|D]]<br>D = [[2.96 × 10⁻¹⁵|sin 32°]]<br>D = [[2.96 × 10⁻¹⁵|0.5299]]<br>D = 5.59 × 10⁻¹⁵ m'},
    {q:'Use R = R<sub>0</sub>A<sup>⅓</sup> to find R<sub>0</sub>.',unit:'m',answer:1.22e-15,working:'D = 5.59 × 10⁻¹⁵ m<br>A = 12<br>R<sub>0</sub> = ?||R = [[D|2]] = 2.793 × 10⁻¹⁵ m<br>R = R<sub>0</sub>A<sup>⅓</sup><br>2.793 × 10⁻¹⁵ = R<sub>0</sub> × 12<sup>⅓</sup><br>2.793 × 10⁻¹⁵ = R<sub>0</sub> × 2.289<br>R<sub>0</sub> = [[2.793 × 10⁻¹⁵|2.289]]<br>R<sub>0</sub> = 1.22 × 10⁻¹⁵ m',
     hints:['The radius is half the diameter.','12<sup>⅓</sup> = 2.289.']}
  ]});
}

/* ================= 6. CALCULATE ================= */
{
  const body=act('calculate','Calculate','De Broglie wavelength and the rings','Use E<sub>k</sub> = eV, E<sub>k</sub> = [[p²|2m]], p = mv and λ = [[h|p]]. '+CONSTS+' Press New problems for another set.');
  const lamV=V=>H/Math.sqrt(2*ME*EC*V);
  const WHO=['Kenji','Arif','Mateo','Rohan','Leon','Minh','Hiroshi','Kabir'];
  createCalc({host:body,questions:[
    {q:'A spaceship’s electron microscope accelerates electrons from rest through 4.5 kV. What is their de Broglie wavelength?',unit:'m',answer:1.83e-11,
     working:'V = 4.5 kV = 4500 V<br>λ = ?||E<sub>k</sub> = eV<br>E<sub>k</sub> = 1.60 × 10⁻¹⁹ × 4500<br>E<sub>k</sub> = 7.200 × 10⁻¹⁶ J<br>E<sub>k</sub> = [[p²|2m<sub>e</sub>]]<br>p = √(2 × 9.11 × 10⁻³¹ × 7.200 × 10⁻¹⁶)<br>p = 3.622 × 10⁻²³ kg m s⁻¹<br>λ = [[h|p]]<br>λ = [[6.63 × 10⁻³⁴|3.622 × 10⁻²³]]<br>λ = 1.83 × 10⁻¹¹ m',
     hints:['E<sub>k</sub> = eV, with V in volts.','p = √(2m<sub>e</sub>E<sub>k</sub>).','λ = [[h|p]].'],
     make:rnd=>{const kv=calcPick(rnd,[1.5,2.5,3.5,4.5,6.0,8.0,10]),ctx=calcPick(rnd,['A spaceship’s electron microscope accelerates','A Mars rover’s electron gun accelerates','An electron diffraction tube accelerates','A space probe’s electron beam instrument accelerates']),V=kv*1000,Ek=EC*V,p=Math.sqrt(2*ME*Ek),l=H/p;
       return {q:`${ctx} electrons from rest through ${kv} kV. What is their de Broglie wavelength?`,unit:'m',answer:+l.toPrecision(3),
         hints:['E<sub>k</sub> = eV, with V in volts.','p = √(2m<sub>e</sub>E<sub>k</sub>).','λ = [[h|p]].'],
         working:`V = ${kv} kV = ${calcNum(V)} V<br>λ = ?||E<sub>k</sub> = eV<br>E<sub>k</sub> = 1.60 × 10⁻¹⁹ × ${calcNum(V)}<br>E<sub>k</sub> = ${sf(Ek,4)} J<br>E<sub>k</sub> = [[p²|2m<sub>e</sub>]]<br>p = √(2 × 9.11 × 10⁻³¹ × ${sf(Ek,4)})<br>p = ${sf(p,4)} kg m s⁻¹<br>λ = [[h|p]]<br>λ = [[6.63 × 10⁻³⁴|${sf(p,4)}]]<br>λ = ${sf(l)} m`};}},
    {q:'Kenji wants electrons with a de Broglie wavelength of 2.50 × 10⁻¹¹ m. Through what potential difference must he accelerate them from rest?',unit:'V',answer:2410,
     working:'λ = 2.50 × 10⁻¹¹ m<br>V = ?||λ = [[h|p]]<br>2.50 × 10⁻¹¹ = [[6.63 × 10⁻³⁴|p]]<br>p = [[6.63 × 10⁻³⁴|2.50 × 10⁻¹¹]]<br>p = 2.652 × 10⁻²³ kg m s⁻¹<br>E<sub>k</sub> = [[p²|2m<sub>e</sub>]]<br>E<sub>k</sub> = [[(2.652 × 10⁻²³)²|2 × 9.11 × 10⁻³¹]]<br>E<sub>k</sub> = 3.860 × 10⁻¹⁶ J<br>E<sub>k</sub> = eV<br>3.860 × 10⁻¹⁶ = 1.60 × 10⁻¹⁹ × V<br>V = [[3.860 × 10⁻¹⁶|1.60 × 10⁻¹⁹]]<br>V = 2410 V',
     hints:['p = [[h|λ]].','E<sub>k</sub> = [[p²|2m<sub>e</sub>]].','V = [[E<sub>k</sub>|e]].'],
     make:rnd=>{const who=calcPick(rnd,WHO),l=calcPick(rnd,[1.50,1.80,2.00,2.20,2.50,3.00,3.50]),p=H/(l*1e-11),Ek=p*p/(2*ME),V=Ek/EC;
       return {q:`${who} wants electrons with a de Broglie wavelength of ${l.toFixed(2)} × 10⁻¹¹ m. Through what potential difference must he accelerate them from rest?`,unit:'V',answer:+V.toPrecision(3),
         hints:['p = [[h|λ]].','E<sub>k</sub> = [[p²|2m<sub>e</sub>]].','V = [[E<sub>k</sub>|e]].'],
         working:`λ = ${l.toFixed(2)} × 10⁻¹¹ m<br>V = ?||λ = [[h|p]]<br>${l.toFixed(2)} × 10⁻¹¹ = [[6.63 × 10⁻³⁴|p]]<br>p = [[6.63 × 10⁻³⁴|${l.toFixed(2)} × 10⁻¹¹]]<br>p = ${sf(p,4)} kg m s⁻¹<br>E<sub>k</sub> = [[p²|2m<sub>e</sub>]]<br>E<sub>k</sub> = [[(${sf(p,4)})²|2 × 9.11 × 10⁻³¹]]<br>E<sub>k</sub> = ${sf(Ek,4)} J<br>E<sub>k</sub> = eV<br>${sf(Ek,4)} = 1.60 × 10⁻¹⁹ × V<br>V = [[${sf(Ek,4)}|1.60 × 10⁻¹⁹]]<br>V = ${calcNum(+V.toPrecision(3))} V`};}},
    {q:'Electrons accelerated through 3.0 kV pass through graphite with atom spacing d = 2.13 × 10⁻¹⁰ m. The screen is 14.0 cm from the graphite. Use θ ≈ [[λ|d]] to find the diameter of the ring.',unit:'cm',answer:2.96,
     working:'V = 3000 V<br>d = 2.13 × 10⁻¹⁰ m<br>L = 0.140 m<br>D = ?||λ = [[h|√(2m<sub>e</sub>eV)]]<br>λ = [[6.63 × 10⁻³⁴|√(2 × 9.11 × 10⁻³¹ × 1.60 × 10⁻¹⁹ × 3000)]]<br>λ = 2.242 × 10⁻¹¹ m<br>θ ≈ [[λ|d]]<br>θ = [[2.242 × 10⁻¹¹|2.13 × 10⁻¹⁰]]<br>θ = 0.1053 rad<br>D = 2L tan θ<br>D = 2 × 0.140 × tan 0.1053<br>D = 0.0296 m = 2.96 cm',
     hints:['First find λ from eV = [[p²|2m<sub>e</sub>]] and λ = [[h|p]].','θ ≈ [[λ|d]] gives θ in radians.','The ring’s radius is L tan θ, so D = 2L tan θ.'],
     make:rnd=>{const kv=calcPick(rnd,[2.0,2.5,3.0,4.0,5.0]),dd=calcPick(rnd,[1.23,2.13]),Lc=calcPick(rnd,[12.0,13.5,14.0,15.0]),l=lamV(kv*1000),th=l/(dd*1e-10),D=2*Lc*Math.tan(th);
       return {q:`Electrons accelerated through ${kv.toFixed(1)} kV pass through graphite with atom spacing d = ${dd.toFixed(2)} × 10⁻¹⁰ m. The screen is ${Lc.toFixed(1)} cm from the graphite. Use θ ≈ [[λ|d]] to find the diameter of the ring.`,unit:'cm',answer:+D.toPrecision(3),
         hints:['First find λ from eV = [[p²|2m<sub>e</sub>]] and λ = [[h|p]].','θ ≈ [[λ|d]] gives θ in radians.','The ring’s radius is L tan θ, so D = 2L tan θ.'],
         working:`V = ${calcNum(kv*1000)} V<br>d = ${dd.toFixed(2)} × 10⁻¹⁰ m<br>L = ${(Lc/100).toFixed(3)} m<br>D = ?||λ = [[h|√(2m<sub>e</sub>eV)]]<br>λ = [[6.63 × 10⁻³⁴|√(2 × 9.11 × 10⁻³¹ × 1.60 × 10⁻¹⁹ × ${calcNum(kv*1000)})]]<br>λ = ${sf(l,4)} m<br>θ ≈ [[λ|d]]<br>θ = [[${sf(l,4)}|${dd.toFixed(2)} × 10⁻¹⁰]]<br>θ = ${th.toFixed(4)} rad<br>D = 2L tan θ<br>D = 2 × ${(Lc/100).toFixed(3)} × tan ${th.toFixed(4)}<br>D = ${(D/100).toPrecision(3)} m = ${D.toPrecision(3)} cm`};}},
    {q:'A beam of electrons moving at 4.0 × 10⁶ m s⁻¹ passes through a gap of width 6.0 × 10⁻¹⁰ m. Use θ = [[λ|b]] to find the angle of the first minimum, in degrees.',unit:'°',answer:17.4,
     working:'v = 4.0 × 10⁶ m s⁻¹<br>b = 6.0 × 10⁻¹⁰ m<br>θ = ?||p = m<sub>e</sub>v<br>p = 9.11 × 10⁻³¹ × 4.0 × 10⁶<br>p = 3.644 × 10⁻²⁴ kg m s⁻¹<br>λ = [[h|p]]<br>λ = [[6.63 × 10⁻³⁴|3.644 × 10⁻²⁴]]<br>λ = 1.819 × 10⁻¹⁰ m<br>θ = [[λ|b]]<br>θ = [[1.819 × 10⁻¹⁰|6.0 × 10⁻¹⁰]]<br>θ = 0.3032 rad<br>θ = 17.4°',
     hints:['p = m<sub>e</sub>v, then λ = [[h|p]].','θ = [[λ|b]] is in radians: multiply by [[180|π]].'],
     make:retry(rnd=>{const v=calcPick(rnd,[2.0,2.5,3.0,4.0,5.0,6.0]),b=calcPick(rnd,[4.0,5.0,6.0,8.0,10]),p=ME*v*1e6,l=H/p,th=l/(b*1e-10);
       if(th>0.45||th<0.08)return null;const deg=th*180/Math.PI;
       return {q:`A beam of electrons moving at ${v.toFixed(1)} × 10⁶ m s⁻¹ passes through a gap of width ${b.toFixed(1)} × 10⁻¹⁰ m. Use θ = [[λ|b]] to find the angle of the first minimum, in degrees.`,unit:'°',answer:+deg.toPrecision(3),
         hints:['p = m<sub>e</sub>v, then λ = [[h|p]].','θ = [[λ|b]] is in radians: multiply by [[180|π]].'],
         working:`v = ${v.toFixed(1)} × 10⁶ m s⁻¹<br>b = ${b.toFixed(1)} × 10⁻¹⁰ m<br>θ = ?||p = m<sub>e</sub>v<br>p = 9.11 × 10⁻³¹ × ${v.toFixed(1)} × 10⁶<br>p = ${sf(p,4)} kg m s⁻¹<br>λ = [[h|p]]<br>λ = [[6.63 × 10⁻³⁴|${sf(p,4)}]]<br>λ = ${sf(l,4)} m<br>θ = [[λ|b]]<br>θ = [[${sf(l,4)}|${b.toFixed(1)} × 10⁻¹⁰]]<br>θ = ${th.toFixed(4)} rad<br>θ = ${deg.toPrecision(3)}°`};})}
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
// Original question in the IB guide's terms and command terms. Kenji's tube: L = 14.0 cm, d = 2.13 × 10⁻¹⁰ m, D = 2Lλ/d.
{
  const body=act('exam','Exam style','Electron diffraction','Kenji accelerates electrons through a potential difference V and fires them at a thin graphite film in an evacuated tube. He measures the diameter D of one ring on a screen 14.0 cm from the graphite. One reading is missing. '+CONSTS);
  body.appendChild(resTable(['V (kV)','1.5','2.0','3.0','4.0','6.0'],[['D (cm)','4.2','3.6','2.9',null,'2.1']]));
  examPart(body,'(a) 3 marks','Describe the pattern on the screen and explain how it shows that electrons have wave properties.',[
    'Concentric (bright) rings around a central spot.',
    'The electrons are diffracted by the regular arrangement of atoms in the graphite, and the diffracted electrons interfere (superpose).',
    'Diffraction and interference are wave properties, so the electrons behave as waves.',
    'The rings are clear because the de Broglie wavelength of the electrons is similar to the spacing of the atoms.'
  ]);
  body.appendChild(mk('p','sub','(b) 3 marks'));
  createCalc({host:body,questions:[
    {q:'Show that the de Broglie wavelength of the electrons at 3.6 kV is about 2 × 10⁻¹¹ m. Give your value to 3 significant figures.',unit:'m',answer:2.05e-11,working:'V = 3600 V<br>λ = ?||E<sub>k</sub> = eV = 1.60 × 10⁻¹⁹ × 3600<br>E<sub>k</sub> = 5.760 × 10⁻¹⁶ J<br>E<sub>k</sub> = [[p²|2m<sub>e</sub>]]<br>p = √(2 × 9.11 × 10⁻³¹ × 5.760 × 10⁻¹⁶)<br>p = 3.240 × 10⁻²³ kg m s⁻¹<br>λ = [[h|p]]<br>λ = [[6.63 × 10⁻³⁴|3.240 × 10⁻²³]]<br>λ = 2.05 × 10⁻¹¹ m'}
  ]});
  body.appendChild(mk('p','sub','(c) 2 marks'));
  createCalc({host:body,questions:[
    {q:'Predict the missing diameter at 4.0 kV.',unit:'cm',answer:2.55,working:'D ∝ λ ∝ [[1|√V]]<br>D at 2.0 kV = 3.6 cm<br>D = ?||[[D|3.6]] = [[√2.0|√4.0]]<br>D = 3.6 × [[√2.0|√4.0]]<br>D = 3.6 × 0.7071<br>D = 2.55 cm'}
  ]});
  examPart(body,'(d) 3 marks','Kenji plots D against [[1|√V]]. Explain why the graph is a straight line through the origin, and how he can find the spacing d of the atoms from it.',[
    'eV = [[p²|2m<sub>e</sub>]] and λ = [[h|p]], so λ = [[h|√(2m<sub>e</sub>eV)]], so λ ∝ [[1|√V]].',
    'For small angles θ ≈ [[λ|d]] and D ≈ 2Lθ, so D = [[2Lh|d√(2m<sub>e</sub>e)]] × [[1|√V]]: the form y = mx, a straight line through the origin.',
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
    'Use vernier calipers (or dividers transferred to a ruler, or a flexible tape) because the screen is curved; this also gives a smaller resolution than a ruler.',
    'Measure the diameter of the ring and halve it for the radius if needed, rather than measuring from the centre.',
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
