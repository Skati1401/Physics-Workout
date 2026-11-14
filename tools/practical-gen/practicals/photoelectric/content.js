/* IB E.2 (HL) The photoelectric effect: stopping voltage against frequency, h from the gradient, f₀ and Φ from the intercepts.
   Built on the CP15 model (gamma-absorption). IB 2025 has no prescribed practicals: this is the experiment behind the E.2
   understandings "photons of a certain frequency, known as the threshold frequency, are required to release photoelectrons"
   and "Emax = hf − Φ", and the guidance on the features the wave theory of light cannot explain.
   Symbols and equations as in the IB guide and data booklet: E = hf, Emax = hf − Φ, V = W/q (B.5), so eVs = Emax.
   Constants as in quantum-physics.html (IB data booklet): h = 6.63 × 10⁻³⁴ J s, c = 3.00 × 10⁸ m s⁻¹, e = 1.60 × 10⁻¹⁹ C.
   The Do the Experiment tab frames animations/photoelectric.html?show=measure&level=ib, whose fixed readings must match
   PE_LAM and PE_VS below (MEAS_LAM and MEAS_VS in the animation; tools/CORE-PRACTICALS.md, "Measure modes").
   Written without the IB Question Index (14 Nov 2026: Alex's PC offline): the Exam wording follows the guide and its
   command terms, and is on TODO 5g's list for the mark-scheme check. */
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
// a generator that rejects a pick (returns null) is asked again
const retry=g=>rnd=>{for(let i=0;i<80;i++){const r=g(rnd);if(r)return r;}return g(rnd);};
const g3=v=>String(+(+v).toPrecision(3));
// a number in standard form for the working, e.g. 6.63 × 10⁻³⁴
const SUP={'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
const sf=(v,p)=>{const s=(+v).toExponential((p||3)-1).split('e');return s[0]+' × 10'+String(+s[1]).replace(/./g,c=>SUP[c]||c);};
const CONSTS='Use h = 6.63 × 10⁻³⁴ J s, c = 3.00 × 10⁸ m s⁻¹ and e = 1.60 × 10⁻¹⁹ C. Type powers of ten as 6.6e-34 or 6.6×10^-34.';
// The photoelectric animation, framed at IB level (frameAct cannot add &level).
function peFrame(panel,show,title){
  const w=mk('div','anim-wrap');
  w.innerHTML='<iframe class="anim-frame" src="animations/photoelectric.html?embed&level=ib'+(show?'&show='+show:'')+'" title="'+title+'"></iframe><p class="anim-open"><a href="animations/photoelectric.html?level=ib">Open the photoelectric effect animation full screen &rarr;</a></p>';
  $('#panel-'+panel+' .acts').appendChild(w);
}

/* ================= 1. OVERVIEW ================= */
{
  const body=act('overview','Fill in the blanks','The practical in one passage','Drag a word into each gap, or tap a word and then tap a gap. Some words are not needed.');
  const parts=[
    'Light from a lamp passes through a ',['b1','filter'],' and falls on a clean metal plate inside an evacuated tube. Each ',['b2','photon'],
    ' gives all its energy, hf, to one electron. An electron can escape only if hf is at least the ',['b3','work function'],
    ', Φ, of the metal, so below the threshold ',['b4','frequency'],' no photoelectrons are released, however intense the light. The fastest photoelectrons leave with E<sub>max</sub> = hf − Φ. The collector is made ',['b5','negative'],
    ' and the reverse voltage is raised until the microammeter first reads ',['b6','zero'],': this is the stopping voltage, V<sub>s</sub>, and eV<sub>s</sub> = E<sub>max</sub>. Repeat with each filter and work out f = [[c|λ]]. A graph of V<sub>s</sub> against f is a straight line; its gradient multiplied by e is the ',['b7','Planck'],
    ' constant, it crosses the f axis at the threshold frequency, and its intercept on the V<sub>s</sub> axis gives the ',['b8','work function'],'.'
  ];
  const cloze=mk('div','cloze'),slots=[],chips=[];
  parts.forEach((p,i)=>{
    if(typeof p==='string')cloze.insertAdjacentHTML('beforeend',FR(p));
    else{const s=mk('span','blank');cloze.appendChild(s);slots.push({id:p[0],el:s,answer:p[1]});if(!chips.some(c=>c.text===p[1]))chips.push({id:'c-'+p[0],text:p[1]});}
  });
  ['positive','intensity','maximum','Boltzmann'].forEach((t,i)=>chips.push({id:'d'+i,text:t}));
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
    {id:'a',text:'Join the collector of the vacuum photocell to the negative terminal of a variable d.c. supply, with a microammeter in series and a voltmeter across the photocell.'},
    {id:'b',text:'Darken the room, put the first filter in front of the lamp and switch the lamp on.'},
    {id:'c',text:'Starting from zero, raise the reverse voltage slowly until the microammeter first reads zero.'},
    {id:'d',text:'Record the voltmeter reading as the stopping voltage, V<sub>s</sub>, with the wavelength of the filter.'},
    {id:'e',text:'Set the voltage back to zero, change the filter and repeat, until every filter has been used.'},
    {id:'f',text:'Work out the frequency of each filter’s light from f = [[c|λ]].'},
    {id:'g',text:'Plot V<sub>s</sub> against f: h = e × gradient, f<sub>0</sub> is where the line crosses the f axis, and the V<sub>s</sub> intercept is −[[Φ|e]].'}
  ],constraints:[['a','c'],['b','c'],['c','d'],['d','e'],['e','g'],['f','g']],
  why:'The circuit and the first filter come before any reading. The frequencies can be worked out at any point before the graph, which comes last.'});
}
{
  const body=act('method','Match','What each piece of equipment is for','Pair each piece of equipment with its job. Drag one card onto the other, or tap one card and then the other.');
  createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'p',l:'Vacuum photocell',r:'Holds the metal plate and the collector with no air, so the photoelectrons are not stopped by gas molecules'},
    {id:'l',l:'Mercury lamp',r:'Gives bright light that includes ultraviolet, so some photons have a high frequency'},
    {id:'f',l:'Set of filters',r:'Each lets through one narrow band of wavelengths, so the light has one known frequency'},
    {id:'s',l:'Variable d.c. supply',r:'Makes the collector negative, by a voltage that can be raised in small steps'},
    {id:'a',l:'Microammeter',r:'Shows the tiny photoelectric current, so you can see when it first reaches zero'},
    {id:'v',l:'Voltmeter across the photocell',r:'Measures the reverse voltage, which is the stopping voltage once the current is zero'}
  ]});
}

/* ================= DO THE EXPERIMENT ================= */
// The student reads the voltmeter for each filter in the animation's measure mode (?show=measure) and works out f = c/λ.
// PE_LAM and PE_VS must match MEAS_LAM and MEAS_VS in animations/photoelectric.html. The 600 nm filter frees no electrons.
const PE_LAM=[600,500,462,428,375,333,300], PE_VS=[null,0.24,0.44,0.64,1.06,1.46,1.90];
const PE_F=PE_LAM.map(l=>3.00e8/(l*1e-9)/1e14);          // in units of 10¹⁴ Hz: 5.00, 6.00, 6.49, 7.01, 8.00, 9.01, 10.0
const peF3=k=>PE_F[k]>=10?PE_F[k].toFixed(1):PE_F[k].toFixed(2);
let peTable=null,pePlotRows=()=>{};
{
  act('do','Your turn','Take your own readings','1. Choose a filter and press Switch on. 2. Raise the reverse voltage until the microammeter first reads zero, and write the voltmeter reading in the table as V<sub>s</sub>. 3. Repeat with every filter. 4. Work out f = [[c|λ]] for each.');
}
peFrame('do','measure','Photoelectric effect experiment: read the voltmeter and the microammeter');
{
  const body=act('do','Calculate','Your results table','Give f to 3 significant figures, in units of 10¹⁴ Hz, using c = 3.00 × 10⁸ m s⁻¹. Write V<sub>s</sub> exactly as the voltmeter shows it. If no current flows even with no reverse voltage, write none. Press Check.');
  const wrap=mk('div','table-scroll');body.appendChild(wrap);
  const cell=(c,k,lab,txt)=>'<td><input class="calc-num-input" data-c="'+c+'" data-k="'+k+'" inputmode="'+(txt?'text':'decimal')+'" autocomplete="off" aria-label="'+lab+'"></td>';
  wrap.innerHTML='<table class="units res-tbl ga-tbl pe-tbl"><thead><tr><th>Filter λ (nm)</th><th>f (×10¹⁴ Hz)</th><th>V<sub>s</sub> (V)</th></tr></thead><tbody>'+
    PE_LAM.map((l,k)=>'<tr><td class="given">'+l+'</td>'+cell('f',k,'Frequency for the '+l+' nanometre filter, in units of 10 to the 14 hertz')+cell('v',k,'Stopping voltage with the '+l+' nanometre filter, volts',PE_VS[k]===null)+'</tr>').join('')+'</tbody></table>';
  const inp=(c,k)=>$('input[data-c="'+c+'"][data-k="'+k+'"]',wrap), all=()=>$$('input',wrap);
  const val=e=>{const t=e.value.trim().replace(/[−–]/g,'-').replace(',','.').replace(/\s*[×x]\s*10\s*\^\s*/i,'e');if(t===''||!/^-?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(t))return NaN;let v=parseFloat(t);return v;};
  const NONE=/^(none|no current|no electrons|no reading|no emission|n\/a|-|0|0\.0+)$/i;
  // f to 3 significant figures (± 0.006 × 10¹⁴ Hz; a whole frequency such as 6.49e14 is accepted too), V_s to 0.01 V
  const ok=(c,k,e)=>{
    if(c==='v'&&PE_VS[k]===null)return NONE.test(e.value.trim());
    let v=val(e);if(!isFinite(v))return false;
    if(c==='f'){if(v>=1e10)v/=1e14;return Math.abs(v-PE_F[k])<=0.006;}
    return Math.abs(v-PE_VS[k])<=0.005+1e-9;
  };
  const show=(c,k)=>c==='f'?peF3(k):PE_VS[k]===null?'none':PE_VS[k].toFixed(2);
  const b=bar(body,[{label:'Check table',primary:true,fn:check},{label:'Clear',fn:reset}]);
  const ans=answerBtn(b,()=>{
    all().forEach(e=>{if(e.disabled)return;e.value=show(e.dataset.c,+e.dataset.k);e.disabled=true;e.classList.add('is-shown');e.classList.remove('is-wrong');});
    b.say('Answers shown (dashed). Now plot Vₛ against f below.','');pePlotRows();
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
    if(n_ok===n){b.say('All correct. Now plot Vₛ against f.','good');celebrate(b.msg);ans.off();}
    else{b.say(n_ok+' of '+n+' correct'+(blank?', '+blank+' left blank':'')+'.'+(bad?' f = c/λ with λ in metres (500 nm = 500 × 10⁻⁹ m), then divide by 10¹⁴. Vₛ is the voltmeter reading at the moment the current first reads zero, not after it.':''),bad?'bad':'');ans.on();}
    pePlotRows();
  }
  // Show answer is always there for this table (as on CP15), so students can skip it and go on to the plot
  function reset(){all().forEach(e=>{e.value='';e.disabled=false;e.classList.remove('is-wrong','is-shown','pop');});ans.on();b.say('','');pePlotRows();}
  all().forEach(e=>e.addEventListener('input',()=>e.classList.remove('is-wrong')));
  ans.on();
  const got=(c,k)=>{const e=inp(c,k);return e.value.trim()===''||!e.disabled?null:e.value.trim();};
  peTable={f:k=>got('f',k),v:k=>got('v',k)};
  track(body,{reset:reset,
    getState:()=>({v:all().map(e=>e.value),ok:all().map(e=>e.disabled),sh:all().map(e=>e.classList.contains('is-shown'))}),
    setState:s=>{reset();all().forEach((e,i)=>{if(!s||!s.v||typeof s.v[i]!=='string')return;e.value=s.v[i];if(s.ok&&s.ok[i]){e.disabled=true;if(s.sh&&s.sh[i])e.classList.add('is-shown');}});if(all().every(e=>e.disabled)){b.say('All correct. Now plot Vₛ against f.','good');ans.off();}pePlotRows();},
    isDone:()=>all().every(e=>e.disabled)});
}
{
  // the same steps as a worked answer: from the data booklet equation to y = mx + c
  const body=act('do','Explain','Why plot Vₛ against f?','Start from the data booklet equation. A charge e that crosses a p.d. V<sub>s</sub> loses energy eV<sub>s</sub> (V = [[W|q]]), and V<sub>s</sub> just stops the fastest photoelectrons, so eV<sub>s</sub> = E<sub>max</sub>:');
  body.insertAdjacentHTML('beforeend',FR(
    '<div class="ln-steps"><span>E<sub>max</sub></span><span>=</span><span>hf − Φ</span>'+
    '<span>eV<sub>s</sub></span><span>=</span><span>hf − Φ</span>'+
    '<span>V<sub>s</sub></span><span>=</span><span>[[h|e]]f − [[Φ|e]]</span></div>'+
    '<p class="act-intro">In the order of y = mx + c:</p>'+
    '<div class="ln-match"><span>V<sub>s</sub></span><span>=</span><span>[[h|e]]</span><span>f</span><span>+</span><span>(−[[Φ|e]])</span>'+
    '<span>y</span><span>=</span><span>m</span><span>x</span><span>+</span><span>c</span></div>'+
    '<p class="act-intro">So V<sub>s</sub> against f is a straight line. Gradient = [[h|e]], so h = e × gradient. Intercept on the V<sub>s</sub> axis = −[[Φ|e]]. Where the line crosses the f axis, E<sub>max</sub> = 0: that is the threshold frequency, f<sub>0</sub>, and hf<sub>0</sub> = Φ.</p>'+
    '<p class="act-intro">The 600 nm filter is left off the graph. Its frequency, 5.00 × 10¹⁴ Hz, is below f<sub>0</sub>, so it frees no photoelectrons at all, however bright the lamp. V<sub>s</sub> = 0 would be wrong: there is nothing to stop.</p>'));
}
{
  const body=act('do','Plot','Plot your results','Plot Vₛ against f from your table as small crosses (leave out the 600 nm filter). Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');
  const ks=[1,2,3,4,5,6];
  createPlot({host:body,next:' Now find h, Φ and f₀ from the line of best fit below.',
    points:ks.map(k=>({x:+PE_F[k].toFixed(2),y:PE_VS[k]})),
    rowText:p=>{const k=ks.find(j=>+PE_F[j].toFixed(2)===p.x);return rowLabel(k);},
    graph:{xMin:4,xMax:11,yMin:0,yMax:2.4,xTicks:[4,5,6,7,8,9,10,11],yTicks:[0,0.4,0.8,1.2,1.6,2.0,2.4],minor:[0.2,0.04],snap:[0.1,0.02],xLabel:'f (×10¹⁴ Hz)',yLabel:'Vₛ (V)',W:560,H:340}});
  function rowLabel(k){let f=peTable&&peTable.f(k);const v=peTable&&peTable.v(k);if(f&&/e|10\^/i.test(f))f=peF3(k);return (f?'f = '+f:'your f')+', '+(v?'Vₛ = '+v+' V':'your Vₛ');}
  // the animation and the results table side by side, as on CP15; Your turn sits above the animation
  {const fr=$('#panel-do .anim-wrap'),tb=$('#panel-do .pe-tbl').closest('.act'),yt=$('#panel-do .act[data-title="Take your own readings"]');
   if(fr&&tb){const sp=mk('div','hk-split'),left=mk('div','ga-left');fr.parentNode.insertBefore(sp,fr);sp.appendChild(left);if(yt)left.appendChild(yt);left.appendChild(fr);sp.appendChild(tb);}}
  pePlotRows=()=>{$$('.plot-row',body).forEach((li,i)=>{const s=li.firstElementChild;if(s)s.textContent=rowLabel(ks[i]);});};
  pePlotRows();
}
{
  const body=act('do','Calculate','h, Φ and f₀ from your line','A good line of best fit through your points passes through (6.00 × 10¹⁴ Hz, 0.23 V) and (11.00 × 10¹⁴ Hz, 2.30 V). Read nothing else off the graph. '+CONSTS);
  createCalc({host:body,questions:[
    {q:'What is the gradient of the line?',unit:'V s',answer:4.14e-15,working:'first point = (6.00 × 10¹⁴ Hz, 0.23 V)<br>second point = (11.00 × 10¹⁴ Hz, 2.30 V)<br>gradient = ?||gradient = [[change in V<sub>s</sub>|change in f]]<br>gradient = [[2.30 − 0.23|(11.00 − 6.00) × 10¹⁴]]<br>gradient = [[2.07|5.00 × 10¹⁴]]<br>gradient = 4.14 × 10⁻¹⁵ V s'},
    {q:'What value of the Planck constant, h, does the line give?',unit:'J s',answer:6.62e-34,working:'gradient = 4.14 × 10⁻¹⁵ V s<br>e = 1.60 × 10⁻¹⁹ C<br>h = ?||gradient = [[h|e]]<br>4.14 × 10⁻¹⁵ = [[h|1.60 × 10⁻¹⁹]]<br>h = 4.14 × 10⁻¹⁵ × 1.60 × 10⁻¹⁹<br>h = 6.62 × 10⁻³⁴ J s'},
    {q:'What is the work function, Φ, of the metal, in eV?',unit:'eV',answer:2.25,working:'gradient = 4.14 × 10⁻¹⁵ V s<br>point on the line = (6.00 × 10¹⁴ Hz, 0.23 V)<br>Φ = ?||y = mx + c<br>0.23 = 4.14 × 10⁻¹⁵ × 6.00 × 10¹⁴ + c<br>0.23 = 2.484 + c<br>c = −2.254 V<br>c = −[[Φ|e]]<br>[[Φ|e]] = 2.254 V<br>Φ = 2.25 eV'},
    {q:'What is the threshold frequency, f₀?',unit:'Hz',answer:5.44e14,working:'gradient = 4.14 × 10⁻¹⁵ V s<br>intercept c = −2.254 V<br>f<sub>0</sub> = ?||V<sub>s</sub> = [[h|e]]f − [[Φ|e]]<br>0 = 4.14 × 10⁻¹⁵ × f<sub>0</sub> − 2.254<br>4.14 × 10⁻¹⁵ × f<sub>0</sub> = 2.254<br>f<sub>0</sub> = [[2.254|4.14 × 10⁻¹⁵]]<br>f<sub>0</sub> = 5.44 × 10¹⁴ Hz'}
  ]});
}

/* ================= SHOW: the readings taken for you ================= */
{
  act('experiment','Your turn','Watch the readings','Press Experiment, then Switch on: the supply steps from +2 V to −4 V and each microammeter reading is plotted, so the graph of current against voltage fills in by itself. Where does the current reach zero? Press Keep this curve, raise the frequency and run it again: how does V<sub>s</sub> change? Then keep the frequency and change the intensity: what changes on the graph, and what stays the same? Finally choose zinc with visible light: why is there no current at all?');
}
peFrame('experiment','','Photoelectric effect animation: a lamp, a metal plate in a vacuum tube, a variable supply, a microammeter and a graph of current against voltage');

/* ================= 5. ANALYSIS ================= */
function lab(g0,t,x,y){return '<circle cx="'+g0.gx(x)+'" cy="'+g0.gy(y)+'" r="13" fill="var(--panel)" stroke="var(--ink)" stroke-width="2"/><text x="'+g0.gx(x)+'" y="'+(g0.gy(y)+5)+'" text-anchor="middle" font-size="14" fill="var(--ink)">'+t+'</text>';}
const minusTicks=s=>s.replace(/>-(\d)/g,'>−$1');      // a real minus sign on the scale
const GA={xMin:0,xMax:12,yMin:-3,yMax:3,xTicks:[0,2,4,6,8,10,12],yTicks:[-3,-2,-1,0,1,2,3],xLabel:'f (×10¹⁴ Hz)',yLabel:'Vₛ (V)',W:560,H:340};
{
  const body=act('graphs','Calculate','Both intercepts','The graph shows V<sub>s</sub> against f for a metal. The solid part was measured; the dashed part extends the line back to the V<sub>s</sub> axis. Read your answers off the graph. '+CONSTS);
  const split=mk('div','graph-split');body.appendChild(split);
  const g0=lineGraph(Object.assign({points:[[0,0]]},GA));
  const zero='<line x1="'+g0.gx(0)+'" x2="'+g0.gx(12)+'" y1="'+g0.gy(0)+'" y2="'+g0.gy(0)+'" stroke="var(--ink-faint)" stroke-width="1.5"/>';
  split.appendChild(mk('div','graph-box',minusTicks(lineGraph(Object.assign({label:'Stopping voltage against frequency: a straight line crossing the f axis at 6.0 and the V axis at minus 2.5, measured from 7 to 12 and dashed below 7',
    segments:[{pts:[[0,-2.5],[7,5/12]],cls:'g-dash'},{pts:[[7,5/12],[12,2.5]]}],extra:zero},GA)).svg)));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'What is the threshold frequency, f₀?',unit:'Hz',answer:6.0e14,working:'Read where the line crosses the f axis (V<sub>s</sub> = 0).<br>f<sub>0</sub> = 6.0 × 10¹⁴ Hz'},
    {q:'Use the intercept on the Vₛ axis to find the work function, Φ, in J.',unit:'J',answer:4.0e-19,working:'intercept = −2.5 V<br>e = 1.60 × 10⁻¹⁹ C<br>Φ = ?||intercept = −[[Φ|e]]<br>−2.5 = −[[Φ|1.60 × 10⁻¹⁹]]<br>Φ = 2.5 × 1.60 × 10⁻¹⁹<br>Φ = 4.0 × 10⁻¹⁹ J'},
    {q:'Use the gradient to find the Planck constant, h.',unit:'J s',answer:6.67e-34,working:'first point = (0, −2.5 V)<br>second point = (12 × 10¹⁴ Hz, 2.5 V)<br>h = ?||gradient = [[2.5 − (−2.5)|12 × 10¹⁴ − 0]]<br>gradient = [[5.0|12 × 10¹⁴]]<br>gradient = 4.17 × 10⁻¹⁵ V s<br>gradient = [[h|e]]<br>h = 4.17 × 10⁻¹⁵ × 1.60 × 10⁻¹⁹<br>h = 6.67 × 10⁻³⁴ J s'}
  ]});
}
const GT={xMin:0,xMax:16,yMin:0,yMax:3,xTicks:[0,2,4,6,8,10,12,14,16],yTicks:[0,0.5,1,1.5,2,2.5,3],xLabel:'f (×10¹⁴ Hz)',yLabel:'Vₛ (V)',W:560,H:340};
{
  const body=act('graphs','Calculate','Two metals','The graph shows V<sub>s</sub> against f for two metals, P and Q, measured with the same lamp and filters. '+CONSTS);
  const split=mk('div','graph-split');body.appendChild(split);
  const g0=lineGraph(Object.assign({points:[[0,0]]},GT));
  const k=6.63e-34/1.60e-19*1e14;                     // gradient h/e, in V per 10¹⁴ Hz
  split.appendChild(mk('div','graph-box',lineGraph(Object.assign({label:'Stopping voltage against frequency for metal P, crossing the f axis at 5.0, and metal Q, crossing it at 10.0; the two lines are parallel',
    segments:[{pts:[[5,0],[12,7*k]]},{pts:[[10,0],[16,6*k]],cls:'g-line-b'}],
    extra:lab(g0,'P',9.4,4.4*k+0.45)+lab(g0,'Q',14.6,4.6*k+0.45)},GT)).svg));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'What is the threshold frequency of metal Q?',unit:'Hz',answer:1.0e15,working:'Read where line Q crosses the f axis.<br>f<sub>0</sub> = 10.0 × 10¹⁴ Hz<br>f<sub>0</sub> = 1.0 × 10¹⁵ Hz'},
    {q:'What is the work function of metal Q, in eV?',unit:'eV',answer:4.14,working:'f<sub>0</sub> = 1.0 × 10¹⁵ Hz<br>Φ = ?||hf<sub>0</sub> = Φ<br>Φ = 6.63 × 10⁻³⁴ × 1.0 × 10¹⁵<br>Φ = 6.63 × 10⁻¹⁹ J<br>Φ = [[6.63 × 10⁻¹⁹|1.60 × 10⁻¹⁹]]<br>Φ = 4.14 eV'}
  ]});
}
{
  const body=act('graphs','Multiple choice','Reading the lines','A quick question about the same graph.');
  createPredict({host:body,q:'Why are the lines for metals P and Q parallel?',options:[
    {text:'Their gradient is set by h and e alone',correct:true},
    {text:'The same lamp gives the same intensity',why:'Intensity changes how many photoelectrons there are (the current), not their E<sub>max</sub>, so it does not change V<sub>s</sub> or the gradient.'},
    {text:'Both metals have the same work function',why:'The work functions differ: that is why the lines cross the f axis at different places. Φ sets the intercept, not the gradient.'}
  ],explain:'V<sub>s</sub> = [[h|e]]f − [[Φ|e]]. The gradient, [[h|e]], is the same for every metal; only the intercept, −[[Φ|e]], depends on the metal. A metal with a larger work function has its line further to the right.'});
}

/* ================= 6. CALCULATE ================= */
{
  const body=act('calculate','Calculate','Photons, E<sub>max</sub> and V<sub>s</sub>','Use E = hf, c = fλ, E<sub>max</sub> = hf − Φ and eV<sub>s</sub> = E<sub>max</sub>. 1 eV = 1.60 × 10⁻¹⁹ J. '+CONSTS+' Press New problems for another set.');
  const H=6.63e-34,C=3.00e8,E=1.60e-19;
  const METAL=[['caesium',2.10],['sodium',2.30],['potassium',2.29],['calcium',2.90],['lithium',2.90],['zinc',4.30]];
  createCalc({host:body,questions:[
    {q:'Light of wavelength 400 nm falls on sodium (Φ = 2.30 eV). What is E<sub>max</sub> of the photoelectrons, in eV?',unit:'eV',answer:0.81,working:'λ = 400 nm = 4.00 × 10⁻⁷ m<br>Φ = 2.30 eV<br>E<sub>max</sub> = ?||c = fλ<br>3.00 × 10⁸ = f × 4.00 × 10⁻⁷<br>f = [[3.00 × 10⁸|4.00 × 10⁻⁷]]<br>f = 7.50 × 10¹⁴ Hz<br>E = hf<br>E = 6.63 × 10⁻³⁴ × 7.50 × 10¹⁴<br>E = 4.97 × 10⁻¹⁹ J<br>E = [[4.97 × 10⁻¹⁹|1.60 × 10⁻¹⁹]] = 3.11 eV<br>E<sub>max</sub> = hf − Φ<br>E<sub>max</sub> = 3.11 − 2.30<br>E<sub>max</sub> = 0.81 eV',
     hints:['Find f from c = fλ, with λ in metres.','E = hf in J, then divide by 1.60 × 10⁻¹⁹ for eV.','E<sub>max</sub> = hf − Φ, both in eV.'],
     make:retry(rnd=>{const m=calcPick(rnd,METAL.slice(0,5)),lam=calcPick(rnd,[250,280,300,320,350,380,400,420]),f=C/(lam*1e-9),J=+(H*f).toPrecision(3),eV=+(J/E).toFixed(2);
       if(eV-m[1]<0.2)return null;const Em=+(eV-m[1]).toFixed(2);
       return {q:`Light of wavelength ${lam} nm falls on ${m[0]} (Φ = ${m[1].toFixed(2)} eV). What is E<sub>max</sub> of the photoelectrons, in eV?`,unit:'eV',answer:Em,
         hints:['Find f from c = fλ, with λ in metres.','E = hf in J, then divide by 1.60 × 10⁻¹⁹ for eV.','E<sub>max</sub> = hf − Φ, both in eV.'],
         working:`λ = ${lam} nm = ${sf(lam*1e-9)} m<br>Φ = ${m[1].toFixed(2)} eV<br>E<sub>max</sub> = ?||c = fλ<br>3.00 × 10⁸ = f × ${sf(lam*1e-9)}<br>f = [[3.00 × 10⁸|${sf(lam*1e-9)}]]<br>f = ${sf(f)} Hz<br>E = hf<br>E = 6.63 × 10⁻³⁴ × ${sf(f)}<br>E = ${sf(J)} J<br>E = [[${sf(J)}|1.60 × 10⁻¹⁹]] = ${eV.toFixed(2)} eV<br>E<sub>max</sub> = hf − Φ<br>E<sub>max</sub> = ${eV.toFixed(2)} − ${m[1].toFixed(2)}<br>E<sub>max</sub> = ${Em.toFixed(2)} eV`};})},
    {q:'Jessica measures a stopping voltage of 1.20 V when light of frequency 8.00 × 10¹⁴ Hz falls on a metal. What is the work function of the metal, in eV?',unit:'eV',answer:2.12,working:'f = 8.00 × 10¹⁴ Hz<br>V<sub>s</sub> = 1.20 V<br>Φ = ?||E = hf<br>E = 6.63 × 10⁻³⁴ × 8.00 × 10¹⁴<br>E = 5.30 × 10⁻¹⁹ J<br>E = [[5.30 × 10⁻¹⁹|1.60 × 10⁻¹⁹]] = 3.32 eV<br>eV<sub>s</sub> = E<sub>max</sub><br>E<sub>max</sub> = 1.20 eV<br>E<sub>max</sub> = hf − Φ<br>1.20 = 3.32 − Φ<br>Φ = 3.32 − 1.20<br>Φ = 2.12 eV',
     hints:['A stopping voltage of V<sub>s</sub> volts means E<sub>max</sub> = V<sub>s</sub> electronvolts.','Find hf in eV, then Φ = hf − E<sub>max</sub>.'],
     make:retry(rnd=>{const who=calcPick(rnd,['Jessica','Elliot','Gabriel','Malik','Rayan','Victor']),f=calcPick(rnd,[7.00,7.50,8.00,8.50,9.00,10.0,11.0]),Vs=calcPick(rnd,[0.40,0.65,0.80,1.05,1.20,1.45,1.80]),J=+(H*f*1e14).toPrecision(3),eV=+(J/E).toFixed(2),phi=+(eV-Vs).toFixed(2);
       if(phi<1.8)return null;
       return {q:`${who} measures a stopping voltage of ${Vs.toFixed(2)} V when light of frequency ${f.toFixed(2)} × 10¹⁴ Hz falls on a metal. What is the work function of the metal, in eV?`,unit:'eV',answer:phi,
         hints:['A stopping voltage of V<sub>s</sub> volts means E<sub>max</sub> = V<sub>s</sub> electronvolts.','Find hf in eV, then Φ = hf − E<sub>max</sub>.'],
         working:`f = ${f.toFixed(2)} × 10¹⁴ Hz<br>V<sub>s</sub> = ${Vs.toFixed(2)} V<br>Φ = ?||E = hf<br>E = 6.63 × 10⁻³⁴ × ${f.toFixed(2)} × 10¹⁴<br>E = ${sf(J)} J<br>E = [[${sf(J)}|1.60 × 10⁻¹⁹]] = ${eV.toFixed(2)} eV<br>eV<sub>s</sub> = E<sub>max</sub><br>E<sub>max</sub> = ${Vs.toFixed(2)} eV<br>E<sub>max</sub> = hf − Φ<br>${Vs.toFixed(2)} = ${eV.toFixed(2)} − Φ<br>Φ = ${eV.toFixed(2)} − ${Vs.toFixed(2)}<br>Φ = ${phi.toFixed(2)} eV`};})},
    {q:'The work function of zinc is 4.30 eV. What is its threshold frequency?',unit:'Hz',answer:1.04e15,working:'Φ = 4.30 eV<br>f<sub>0</sub> = ?||Φ = 4.30 × 1.60 × 10⁻¹⁹<br>Φ = 6.88 × 10⁻¹⁹ J<br>hf<sub>0</sub> = Φ<br>6.63 × 10⁻³⁴ × f<sub>0</sub> = 6.88 × 10⁻¹⁹<br>f<sub>0</sub> = [[6.88 × 10⁻¹⁹|6.63 × 10⁻³⁴]]<br>f<sub>0</sub> = 1.04 × 10¹⁵ Hz',
     make:retry(rnd=>{const m=calcPick(rnd,METAL),J=+(m[1]*E).toPrecision(3),f0=J/H;
       return {q:`The work function of ${m[0]} is ${m[1].toFixed(2)} eV. What is its threshold frequency?`,unit:'Hz',answer:+f0.toPrecision(3),
         working:`Φ = ${m[1].toFixed(2)} eV<br>f<sub>0</sub> = ?||Φ = ${m[1].toFixed(2)} × 1.60 × 10⁻¹⁹<br>Φ = ${sf(J)} J<br>hf<sub>0</sub> = Φ<br>6.63 × 10⁻³⁴ × f<sub>0</sub> = ${sf(J)}<br>f<sub>0</sub> = [[${sf(J)}|6.63 × 10⁻³⁴]]<br>f<sub>0</sub> = ${sf(f0)} Hz`};})},
    {q:'Ultraviolet light of wavelength 250 nm falls on calcium (Φ = 2.90 eV). What is the stopping voltage?',unit:'V',answer:2.07,working:'λ = 250 nm = 2.50 × 10⁻⁷ m<br>Φ = 2.90 eV<br>V<sub>s</sub> = ?||E = hf = [[hc|λ]]<br>E = [[6.63 × 10⁻³⁴ × 3.00 × 10⁸|2.50 × 10⁻⁷]]<br>E = 7.96 × 10⁻¹⁹ J<br>E = [[7.96 × 10⁻¹⁹|1.60 × 10⁻¹⁹]] = 4.97 eV<br>E<sub>max</sub> = hf − Φ<br>E<sub>max</sub> = 4.97 − 2.90<br>E<sub>max</sub> = 2.07 eV<br>eV<sub>s</sub> = E<sub>max</sub><br>V<sub>s</sub> = 2.07 V',
     hints:['Find the photon energy in eV first.','E<sub>max</sub> in eV is the stopping voltage in volts.'],
     make:retry(rnd=>{const m=calcPick(rnd,METAL.slice(0,5)),lam=calcPick(rnd,[200,220,240,250,260,280,300]),J=+(H*C/(lam*1e-9)).toPrecision(3),eV=+(J/E).toFixed(2),Vs=+(eV-m[1]).toFixed(2);
       if(Vs<0.3)return null;
       return {q:`Ultraviolet light of wavelength ${lam} nm falls on ${m[0]} (Φ = ${m[1].toFixed(2)} eV). What is the stopping voltage?`,unit:'V',answer:Vs,
         hints:['Find the photon energy in eV first.','E<sub>max</sub> in eV is the stopping voltage in volts.'],
         working:`λ = ${lam} nm = ${sf(lam*1e-9)} m<br>Φ = ${m[1].toFixed(2)} eV<br>V<sub>s</sub> = ?||E = hf = [[hc|λ]]<br>E = [[6.63 × 10⁻³⁴ × 3.00 × 10⁸|${sf(lam*1e-9)}]]<br>E = ${sf(J)} J<br>E = [[${sf(J)}|1.60 × 10⁻¹⁹]] = ${eV.toFixed(2)} eV<br>E<sub>max</sub> = hf − Φ<br>E<sub>max</sub> = ${eV.toFixed(2)} − ${m[1].toFixed(2)}<br>E<sub>max</sub> = ${Vs.toFixed(2)} eV<br>eV<sub>s</sub> = E<sub>max</sub><br>V<sub>s</sub> = ${Vs.toFixed(2)} V`};})}
  ]});
}

/* ================= 7. ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Better results or safer?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'Better results',hint:'More accurate or more reliable readings',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps people safe',hint:'Protects eyes and skin, or stops burns',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Darken the room, so only light through the filter reaches the plate',cat:'a'},
    {id:'2',text:'Raise the reverse voltage in very small steps near the stopping voltage',cat:'a'},
    {id:'3',text:'Use a microammeter sensitive enough to show the smallest current',cat:'a'},
    {id:'4',text:'Repeat V<sub>s</sub> for each filter and take the mean',cat:'a'},
    {id:'5',text:'Never look straight into the mercury lamp',cat:'s'},
    {id:'6',text:'Wear goggles that block ultraviolet',cat:'s'},
    {id:'7',text:'Let the lamp cool down before moving it',cat:'s'},
    {id:'8',text:'Keep hands and skin out of the ultraviolet beam',cat:'s'}
  ]});
}

/* ================= EXAM PRACTICE ================= */
// Original question in the IB guide's terms and command terms (state, calculate, show that, determine, explain, outline, describe).
// Rayan's metal: Φ = 2.00 eV; V_s = 1243.1/λ − 2.00 (h, c and e as above).
{
  const body=act('exam','Exam style','The photoelectric effect','Rayan shines light from a mercury lamp through a filter onto a metal plate in a vacuum photocell. For each filter he raises the reverse voltage until the current is zero and records the stopping voltage, V<sub>s</sub>. One reading is missing. '+CONSTS);
  body.appendChild(resTable(['λ (nm)','546','436','405','365'],[['V<sub>s</sub> (V)','0.28','0.85',null,'1.41']]));
  examPart(body,'(a) 1 mark','State what is meant by the threshold frequency.',[
    'The minimum frequency of light (photons) that releases photoelectrons from the metal surface.'
  ]);
  body.appendChild(mk('p','sub','(b) 1 mark'));
  createCalc({host:body,questions:[
    {q:'Calculate the frequency of the 436 nm light.',unit:'Hz',answer:6.88e14,working:'λ = 436 nm = 4.36 × 10⁻⁷ m<br>f = ?||c = fλ<br>3.00 × 10⁸ = f × 4.36 × 10⁻⁷<br>f = [[3.00 × 10⁸|4.36 × 10⁻⁷]]<br>f = 6.88 × 10¹⁴ Hz'}
  ]});
  body.appendChild(mk('p','sub','(c) 3 marks'));
  createCalc({host:body,questions:[
    {q:'Show that the work function of the metal is about 2 eV. Give your value to 3 significant figures.',unit:'eV',answer:2.00,working:'f = 6.88 × 10¹⁴ Hz<br>V<sub>s</sub> = 0.85 V<br>Φ = ?||E = hf<br>E = 6.63 × 10⁻³⁴ × 6.88 × 10¹⁴<br>E = 4.56 × 10⁻¹⁹ J<br>E = [[4.56 × 10⁻¹⁹|1.60 × 10⁻¹⁹]] = 2.85 eV<br>E<sub>max</sub> = eV<sub>s</sub> = 0.85 eV<br>E<sub>max</sub> = hf − Φ<br>0.85 = 2.85 − Φ<br>Φ = 2.85 − 0.85<br>Φ = 2.00 eV'}
  ]});
  body.appendChild(mk('p','sub','(d) 2 marks'));
  createCalc({host:body,questions:[
    {q:'Determine the missing stopping voltage for the 405 nm filter.',unit:'V',answer:1.07,working:'λ = 405 nm = 4.05 × 10⁻⁷ m<br>Φ = 2.00 eV<br>V<sub>s</sub> = ?||E = [[hc|λ]]<br>E = [[6.63 × 10⁻³⁴ × 3.00 × 10⁸|4.05 × 10⁻⁷]]<br>E = 4.91 × 10⁻¹⁹ J<br>E = [[4.91 × 10⁻¹⁹|1.60 × 10⁻¹⁹]] = 3.07 eV<br>E<sub>max</sub> = hf − Φ<br>E<sub>max</sub> = 3.07 − 2.00<br>E<sub>max</sub> = 1.07 eV<br>V<sub>s</sub> = 1.07 V'}
  ]});
  examPart(body,'(e) 3 marks','Rayan plots V<sub>s</sub> against f. Explain why the graph is a straight line, and how he can find the Planck constant and the work function from it.',[
    'eV<sub>s</sub> = E<sub>max</sub> = hf − Φ, so V<sub>s</sub> = [[h|e]]f − [[Φ|e]].',
    'This has the form y = mx + c, so V<sub>s</sub> against f is a straight line.',
    'h = e × gradient.',
    'The intercept on the V<sub>s</sub> axis is −[[Φ|e]] (or Φ = hf<sub>0</sub>, where the line crosses the f axis at f<sub>0</sub>).'
  ]);
  examPart(body,'(f) 2 marks','With a 650 nm filter no current is detected, even when the lamp is made much brighter. Explain this observation.',[
    'Each 650 nm photon has energy hf = 1.91 eV, which is less than the work function (2.00 eV), so its frequency is below the threshold frequency.',
    'One photon gives its energy to one electron, so no electron gains enough energy to escape; a brighter lamp only gives more photons, each with the same energy.'
  ]);
  examPart(body,'(g) 3 marks','Outline why the photoelectric effect is evidence for the particle nature of light. Refer to features that the wave theory of light cannot explain.',[
    'Wave theory: any frequency should release electrons if the light is intense enough; in fact there is a threshold frequency, below which none are released.',
    'Wave theory: brighter light should give faster electrons; in fact E<sub>max</sub> depends only on the frequency, not on the intensity.',
    'Wave theory: dim light should need time to build up energy; in fact electrons are released at once, with no delay.',
    'Each photon transfers all its energy, hf, to one electron, so light behaves as particles (photons).'
  ]);
  examPart(body,'(h) 6 marks','Describe how Rayan could use this apparatus to determine the Planck constant. Include one safety precaution.',[
    'Join the collector to the negative terminal of a variable d.c. supply, with a (micro)ammeter in series and a voltmeter across the photocell.',
    'Use a filter to give light of one known wavelength; darken the room.',
    'Increase the reverse voltage from zero until the current just becomes zero; record this as V<sub>s</sub>.',
    'Repeat for at least five filters, and repeat each reading and take the mean.',
    'Calculate f = [[c|λ]] for each filter; plot V<sub>s</sub> against f and draw a line of best fit.',
    'h = e × gradient.',
    'Safety: do not look directly at the lamp / wear UV-blocking goggles, as mercury lamps give out ultraviolet.'
  ]);
  examPart(body,'(i) 2 marks','State why the same metal plate must be used for every filter, but the lamp’s intensity need not be kept the same.',[
    'The work function depends on the metal, and V<sub>s</sub> depends on Φ, so a different plate would change the intercept (and the stopping voltages).',
    'Intensity changes only the number of photons per second (the current), not E<sub>max</sub>, so V<sub>s</sub> does not depend on it.'
  ]);
}
