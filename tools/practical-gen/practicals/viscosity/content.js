/* IAL CP2 Use a falling-ball method to determine the viscosity of a liquid (spec points 9, 23, 24, 25, 26).
   Built on the CP15 model (gamma-absorption): at terminal velocity W = U + F with F = 6πηrv, so v = 2r²(ρs − ρf)g/9η,
   and v against r² is a straight line through the origin with gradient 2(ρs − ρf)g/9η.
   The Do the Experiment tab frames animations/viscosity.html?show=measure, whose fixed readings must match
   VS_D, VS_BAND, VS_LAP and VS_T below (MEAS_D, MEAS_BAND, MEAS_LAP and MEAS_T in the animation; tools/CORE-PRACTICALS.md, "Measure modes").
   Written on 14 Nov 2026 from the IAL spec (points 9, 23–26) without the PC. Mark scheme wording checked 14 Nov 2026 (TODO 5g) against WPH11 Oct 2019 Q15(a), Oct 2020 Q15,
   Jun 2022 Q19, Oct 2023 Q18; WPH13 Jun 2021 Q3, Oct 2024 Q1; 9PH0/03 Jun 2022 Q10. No IAL practical guide is in the project; the IGCSE guide does not cover CP2. */
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
// numbers for the working: ex(v,n) = "3.351 × 10⁻⁸"; nm(v,n) = n significant figures, as a power of ten when very small
const SUPD=s=>String(s).replace('-','⁻').replace(/\d/g,c=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[c]);
function ex(v,n){let e=Math.floor(Math.log10(Math.abs(v))),m=+(v/Math.pow(10,e)).toPrecision(n);if(Math.abs(m)>=10){m/=10;e++;}return m.toFixed(n-1)+' × 10'+SUPD(e);}
function nm(v,n){const a=Math.abs(v);return a>=1000?String(Math.round(v)):a>=0.01?(+v).toPrecision(n):ex(v,n);}
const RHO_S=7800, GV=9.81;

/* ================= 1. OVERVIEW ================= */
{
  const body=act('overview','Fill in the blanks','The practical in one passage','Drag a word into each gap, or tap a word and then tap a gap. Some words are not needed.');
  const parts=[
    'A tall measuring cylinder is filled with glycerol and three rubber bands are put round it, the top one well below the surface, so that each ball is already at its ',['b1','terminal velocity'],
    ' when it passes it. The diameter of each steel ball is measured with a ',['b2','micrometer'],', and each ball is dropped down the centre of the cylinder and timed between the bands. Equal times between the first two bands and the last two show that its velocity is ',['b3','constant'],
    '. Then the weight of the ball equals the ',['b4','upthrust'],' plus the viscous drag, F&nbsp;=&nbsp;6πηrv. This gives v = [[2r²(ρ<sub>s</sub> − ρ<sub>f</sub>)g|9η]], so a graph of v against ',['b5','r²'],
    ' is a straight line through the origin, and η is found from its ',['b6','gradient'],'. Stokes’ law only holds for small spheres moving slowly with ',['b7','laminar'],
    ' flow, and the temperature of the glycerol is measured, because its viscosity ',['b8','falls'],' as the temperature rises.'
  ];
  const cloze=mk('div','cloze'),slots=[],chips=[];
  parts.forEach(p=>{
    if(typeof p==='string')cloze.insertAdjacentHTML('beforeend',FR(p));
    else{const s=mk('span','blank');cloze.appendChild(s);slots.push({id:p[0],el:s,answer:p[1]});chips.push({id:'c-'+p[0],text:p[1]});}
  });
  ['turbulent','r','rises','accelerating'].forEach((t,i)=>chips.push({id:'d'+i,text:t}));
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
  const body=act('method','Order','Carry out the practical','Put the steps in the order you would do them. Drag the ≡ handle, or use the ▲▼ buttons.');
  createReorder({host:body,steps:[
    {id:'a',text:'Measure the diameter of each ball with a micrometer in several directions, find the mean and halve it to get r.'},
    {id:'b',text:'Fill a tall measuring cylinder with glycerol and put three rubber bands round it, the top one well below the surface.'},
    {id:'c',text:'Measure the distance between the bands with a metre rule, with your eye level with each band, and measure the temperature of the glycerol.'},
    {id:'d',text:'Drop a ball down the centre of the cylinder. Start the stopwatch as it passes the top band, take a lap time at the middle band and stop it at the bottom band.'},
    {id:'e',text:'Check that the times between each pair of bands are equal, so the ball was at terminal velocity.'},
    {id:'f',text:'Repeat three times for each of at least five sizes of ball, and find the mean time for each size.'},
    {id:'g',text:'Work out v = [[distance|mean time]] and r², plot v against r², and find η from the gradient.'}
  ],constraints:[['b','c'],['b','d'],['d','e'],['e','f'],['f','g'],['a','g'],['c','g']],
  why:'The balls can be measured first or at any point before the graph. The bands go on before anything is timed, each drop is checked for terminal velocity before it is repeated, and the graph comes last.'});
}
{
  const body=act('method','Match','What each piece of equipment is for','Pair each piece of equipment with its job. Drag one card onto the other, or tap one card and then the other.');
  createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'m',l:'Micrometer',r:'Measures the diameter of a ball to 0.01 mm'},
    {id:'b',l:'Rubber bands',r:'Mark where the timed distance starts and ends'},
    {id:'r',l:'Metre rule',r:'Measures the distance between the bands'},
    {id:'s',l:'Stopwatch',r:'Times the ball between the bands, with a lap time at the middle one'},
    {id:'t',l:'Thermometer',r:'Measures the temperature, which the viscosity depends on'},
    {id:'g',l:'Magnet',r:'Takes the steel balls back out of the cylinder'}
  ]});
}

/* ================= DO THE EXPERIMENT ================= */
// The student reads the micrometer, the rule and the stopwatch in the animation's measure mode (?show=measure).
// VS_D, VS_BAND, VS_LAP and VS_T must match MEAS_D, MEAS_BAND, MEAS_LAP and MEAS_T in animations/viscosity.html.
const VS_D=[3.16,4.24,5.30,6.16,6.92];                                                 // micrometer, mm: balls 1 to 5
const VS_BAND=[7.6,18.6,29.6];                                                         // bands A, B, C, cm below the surface
const VS_LAP=[[4.35,4.39,4.36],[2.46,2.41,2.44],[1.54,1.57,1.55],[1.16,1.13,1.15],[0.93,0.89,0.91]];   // lap at B (A to B), s
const VS_T=[[8.68,8.75,8.73],[4.90,4.84,4.87],[3.07,3.12,3.11],[2.31,2.26,2.30],[1.85,1.79,1.82]];     // time at C (A to C), s
const VS_AC=(VS_BAND[2]-VS_BAND[0])/100;                                               // 0.220 m
const VS_TM=VS_T.map(r=>(r[0]+r[1]+r[2])/3);                                           // 8.72, 4.87, 3.10, 2.29, 1.82 s
const VS_V=VS_TM.map(t=>VS_AC/t*100);                                                  // cm s⁻¹
const VS_R2=VS_D.map(d=>Math.pow(d/2,2));                                              // mm²
let vsTable=null,vsPlotRows=()=>{};
{
  act('do','Your turn','Take your own readings','1. Choose Ball 1. Read the micrometer, and read bands A, B and C on the rule. 2. Press Drop the ball, then Start at A, Lap at B and Stop at C. Time each ball three times. 3. Fill in the table: the mean time, v and r² (r = d/2).');
}
frameAct('do','animations/viscosity.html','measure','Viscosity experiment: read the micrometer and the rule, and time the ball with the stopwatch','viscosity',false);
{
  const body=act('do','Calculate','Your results table','Write each reading as the instrument shows it: band positions in cm, d in mm, and the three times from A to C in s. Give the distance A to C in m, the mean time to 2 decimal places, and v and r² to 3 significant figures. Press Check.');
  const wrap=mk('div','table-scroll');body.appendChild(wrap);
  const cell=(c,k,lab)=>'<td><input class="calc-num-input" data-c="'+c+'" data-k="'+k+'" inputmode="decimal" autocomplete="off" aria-label="'+lab+'"></td>';
  const ROWS=[['d','d (mm)','Diameter'],['t0','t₁ (s)','First time, A to C,'],['t1','t₂ (s)','Second time, A to C,'],['t2','t₃ (s)','Third time, A to C,'],
    ['tm','Mean t (s)','Mean time'],['v','v (cm s⁻¹)','Terminal velocity, centimetres per second,'],['r2','r² (mm²)','Radius squared, square millimetres,']];
  wrap.innerHTML='<table class="units res-tbl ga-tbl vs-tbl"><thead><tr><th>Band A (cm)</th><th>Band B (cm)</th><th>Band C (cm)</th><th>A to C (m)</th></tr></thead><tbody><tr>'+
    cell('b',0,'Band A, centimetres')+cell('b',1,'Band B, centimetres')+cell('b',2,'Band C, centimetres')+cell('ac',0,'Distance from A to C, metres')+'</tr></tbody></table>'+
    '<table class="units res-tbl ga-tbl vs-tbl" style="margin-top:10px"><thead><tr><th>Ball</th>'+VS_D.map((x,k)=>'<th>'+(k+1)+'</th>').join('')+'</tr></thead><tbody>'+
    ROWS.map(r=>'<tr><th scope="row">'+r[1]+'</th>'+VS_D.map((x,k)=>cell(r[0],k,r[2]+' for ball '+(k+1))).join('')+'</tr>').join('')+'</tbody></table>';
  const inp=(c,k)=>$('input[data-c="'+c+'"][data-k="'+k+'"]',wrap), all=()=>$$('input',wrap);
  const val=e=>{const t=e.value.trim().replace(/[−–]/g,'-').replace(',','.');return t===''||!/^-?(\d+\.?\d*|\.\d+)$/.test(t)?NaN:parseFloat(t);};
  // readings to the instrument's resolution; the mean to 2 dp; v and r² to 3 s.f. (half a per cent either way)
  const want=(c,k)=>c==='b'?[VS_BAND[k],0.05]:c==='ac'?[VS_AC,0.0015]:c==='d'?[VS_D[k],0.005]:c[0]==='t'&&c!=='tm'?[VS_T[k][+c[1]],0.005]:
    c==='tm'?[VS_TM[k],0.006]:c==='v'?[VS_V[k],Math.max(0.006,VS_V[k]*0.005)]:[VS_R2[k],Math.max(0.006,VS_R2[k]*0.005)];
  const show=(c,k)=>c==='b'?VS_BAND[k].toFixed(1):c==='ac'?VS_AC.toFixed(3):c==='d'?VS_D[k].toFixed(2):c[0]==='t'&&c!=='tm'?VS_T[k][+c[1]].toFixed(2):
    c==='tm'?VS_TM[k].toFixed(2):c==='v'?VS_V[k].toPrecision(3):VS_R2[k].toPrecision(3);
  const b=bar(body,[{label:'Check table',primary:true,fn:check},{label:'Clear',fn:reset}]);
  const ans=answerBtn(b,()=>{
    all().forEach(e=>{if(e.disabled)return;e.value=show(e.dataset.c,+e.dataset.k);e.disabled=true;e.classList.add('is-shown');e.classList.remove('is-wrong');});
    b.say('Answers shown (dashed). Now plot v against r² below.','');vsPlotRows();
  });
  function check(){
    let ok=0,bad=0,blank=0;
    all().forEach(e=>{
      if(e.disabled){ok++;return;}
      if(e.value.trim()===''){blank++;return;}
      const v=val(e),w=want(e.dataset.c,+e.dataset.k);
      if(isFinite(v)&&Math.abs(v-w[0])<=w[1]+1e-9){e.disabled=true;e.classList.remove('is-wrong');e.classList.add('pop');ok++;}
      else{bad++;e.classList.add('is-wrong');}
    });
    const n=all().length;
    if(ok===n){b.say('All correct. Now plot v against r².','good');celebrate(b.msg);ans.off();}
    else{b.say(ok+' of '+n+' correct'+(blank?', '+blank+' left blank':'')+'.'+(bad?' A to C in metres: 22.0 cm is 0.220 m. v is the distance A to C divided by the mean time, in cm s⁻¹. r is half the diameter.':''),bad?'bad':'');ans.on();}
    vsPlotRows();
  }
  // Show answer is always there for this table (as on CP15), so students can skip it and go on to the plot
  function reset(){all().forEach(e=>{e.value='';e.disabled=false;e.classList.remove('is-wrong','is-shown','pop');});ans.on();b.say('','');vsPlotRows();}
  all().forEach(e=>e.addEventListener('input',()=>e.classList.remove('is-wrong')));
  ans.on();
  const got=(c,k)=>{const e=inp(c,k);return e.value.trim()===''||!e.disabled?null:e.value.trim();};
  vsTable={v:k=>got('v',k),r2:k=>got('r2',k)};
  track(body,{reset:reset,
    getState:()=>({v:all().map(e=>e.value),ok:all().map(e=>e.disabled),sh:all().map(e=>e.classList.contains('is-shown'))}),
    setState:s=>{reset();all().forEach((e,i)=>{if(!s||!s.v||typeof s.v[i]!=='string')return;e.value=s.v[i];if(s.ok&&s.ok[i]){e.disabled=true;if(s.sh&&s.sh[i])e.classList.add('is-shown');}});if(all().every(e=>e.disabled)){b.say('All correct. Now plot v against r².','good');ans.off();}vsPlotRows();},
    isDone:()=>all().every(e=>e.disabled)});
}
{
  const body=act('do','Multiple choice','Terminal velocity?','Look at Ball 1’s first drop: the lap time at B and the time at C.');
  createPredict({host:body,q:'For Ball 1’s first drop the stopwatch read 4.35 s at B and 8.68 s at C. A to B and B to C are both 11.0 cm. What does this show?',options:[
    {text:'Its speed was steady from A to C',correct:true},
    {text:'It was still speeding up from A to B',why:'Then A to B would take longer than B to C. Here B to C took 8.68 − 4.35 = 4.33 s, the same as A to B to within the timing.'},
    {text:'It was slowing down from B to C',why:'A falling ball never slows down in a liquid: the drag only grows until it balances the weight minus the upthrust. And B to C did not take longer.'}
  ],explain:'Equal distances in equal times mean a constant velocity, so the ball was at terminal velocity before it reached A. Only then do the forces balance (W = U + F), which the method needs.'});
}
{
  const body=act('do','Explain','Why plot v against r²?','At terminal velocity the forces on the ball balance: weight = upthrust + viscous drag. The volume of a sphere is [[4|3]]πr³, and the upthrust is the weight of the glycerol it pushes aside:');
  body.insertAdjacentHTML('beforeend',FR(
    '<div class="ln-steps"><span>W</span><span>=</span><span>U + F</span>'+
    '<span>[[4|3]]πr³ρ<sub>s</sub>g</span><span>=</span><span>[[4|3]]πr³ρ<sub>f</sub>g + 6πηrv</span>'+
    '<span>6πηrv</span><span>=</span><span>[[4|3]]πr³(ρ<sub>s</sub> − ρ<sub>f</sub>)g</span>'+
    '<span>v</span><span>=</span><span>[[2r²(ρ<sub>s</sub> − ρ<sub>f</sub>)g|9η]]</span></div>'+
    '<p class="act-intro">In the order of y = mx + c:</p>'+
    '<div class="ln-match"><span>v</span><span>=</span><span>[[2(ρ<sub>s</sub> − ρ<sub>f</sub>)g|9η]]</span><span>r²</span><span>+</span><span>0</span>'+
    '<span>y</span><span>=</span><span>m</span><span>x</span><span>+</span><span>c</span></div>'+
    '<p class="act-intro">So v against r² is a straight line through the origin, with gradient = [[2(ρ<sub>s</sub> − ρ<sub>f</sub>)g|9η]], and η = [[2(ρ<sub>s</sub> − ρ<sub>f</sub>)g|9 × gradient]]. Put the gradient in SI units first: 1 cm s⁻¹ mm⁻² = [[10⁻² m s⁻¹|10⁻⁶ m²]] = 10⁴ m⁻¹ s⁻¹. Using the gradient of five sizes, not one ball, averages out the timing errors.</p>'));
}
{
  const body=act('do','Plot','Plot your results','Plot v against r² from your table as small crosses. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');
  // v and r² to 3 s.f.; the 0.25 snap puts every point within 0.11 of a grid step, and graph.tol accepts half a small square
  createPlot({host:body,next:' Now find η from the line of best fit below.',
    points:VS_D.map((x,k)=>({x:+VS_R2[k].toPrecision(3),y:+VS_V[k].toPrecision(3)})),
    rowText:p=>{const k=VS_R2.findIndex(r=>+r.toPrecision(3)===p.x);return rowLab(k);},
    graph:{xMin:0,xMax:14,yMin:0,yMax:14,xTicks:[0,2,4,6,8,10,12,14],yTicks:[0,2,4,6,8,10,12,14],minor:[0.5,0.5],snap:[0.25,0.25],tol:[0.16,0.16],xLabel:'r² (mm²)',yLabel:'v (cm s⁻¹)',W:560,H:340}});
  function rowLab(k){const r=vsTable&&vsTable.r2(k),v=vsTable&&vsTable.v(k);return 'Ball '+(k+1)+': '+(r?'r² = '+r+' mm²':'your r²')+', '+(v?'v = '+v+' cm s⁻¹':'your v');}
  // the animation and the results table side by side, as on CP15
  {const fr=$('#panel-do .anim-wrap'),tb=$('#panel-do .vs-tbl').closest('.act'),yt=$('#panel-do .act[data-title="Take your own readings"]');
   if(fr&&tb){const sp=mk('div','hk-split'),left=mk('div','ga-left');fr.parentNode.insertBefore(sp,fr);sp.appendChild(left);if(yt)left.appendChild(yt);left.appendChild(fr);sp.appendChild(tb);}}
  vsPlotRows=()=>{$$('.plot-row',body).forEach((li,k)=>{const s=li.firstElementChild;if(s)s.textContent=rowLab(k);});};
  vsPlotRows();
}
{
  const body=act('do','Calculate','η from your line','A good line of best fit through your points passes through (1.00, 1.01) and (11.00, 11.12). The steel has a density of 7800 kg m⁻³ and the glycerol 1260 kg m⁻³; g = 9.81 N kg⁻¹. Type a power of ten as e.g. 1.0e4.');
  createCalc({host:body,questions:[
    {q:'What is the gradient of the line, in cm s⁻¹ mm⁻²?',unit:'cm s⁻¹ mm⁻²',answer:1.011,working:'first point = (1.00, 1.01)<br>second point = (11.00, 11.12)<br>gradient = ?||gradient = [[change in v|change in r²]]<br>gradient = [[11.12 − 1.01|11.00 − 1.00]]<br>gradient = [[10.11|10.00]]<br>gradient = 1.011 cm s⁻¹ mm⁻²'},
    {q:'What is the gradient in SI units?',unit:'m⁻¹ s⁻¹',answer:1.011e4,working:'gradient = 1.011 cm s⁻¹ mm⁻²<br>1 cm s⁻¹ = 10⁻² m s⁻¹<br>1 mm² = 10⁻⁶ m²<br>gradient = ?||gradient = [[1.011 × 10⁻² m s⁻¹|10⁻⁶ m²]]<br>gradient = 1.011 × 10⁴ m⁻¹ s⁻¹'},
    {q:'What is the viscosity of the glycerol?',unit:'Pa s',answer:1.41,working:'gradient = 1.011 × 10⁴ m⁻¹ s⁻¹<br>ρ<sub>s</sub> = 7800 kg m⁻³<br>ρ<sub>f</sub> = 1260 kg m⁻³<br>g = 9.81 N kg⁻¹<br>η = ?||gradient = [[2(ρ<sub>s</sub> − ρ<sub>f</sub>)g|9η]]<br>1.011 × 10⁴ = [[2 × (7800 − 1260) × 9.81|9η]]<br>1.011 × 10⁴ = [[1.283 × 10⁵|9η]]<br>η = [[1.283 × 10⁵|9 × 1.011 × 10⁴]]<br>η = 1.41 Pa s',
     hints:['Use the gradient in SI units, m⁻¹ s⁻¹.','gradient = [[2(ρ<sub>s</sub> − ρ<sub>f</sub>)g|9η]], so η = [[2(ρ<sub>s</sub> − ρ<sub>f</sub>)g|9 × gradient]].']}
  ]});
}

/* ================= WATCH: the readings plotted for you ================= */
{
  act('experiment','Your turn','Watch the readings','Press Experiment. Choose a radius with the slider, press Drop the ball and time it: Start at A, Lap at B, Stop at C. Time at least four sizes: the table and graph fill in by themselves. Then change to 25 °C: how does the gradient change, and why? Or choose Mystery and find its viscosity.');
}
frameAct('experiment','animations/viscosity.html','','Viscosity animation: a steel ball falling through glycerol between three bands, with a stopwatch, the forces on it and a graph of v against r²','viscosity',false);

/* ================= 5. ANALYSIS ================= */
function lab(g0,t,x,y){return '<circle cx="'+g0.gx(x)+'" cy="'+g0.gy(y)+'" r="13" fill="var(--panel)" stroke="var(--ink)" stroke-width="2"/><text x="'+g0.gx(x)+'" y="'+(g0.gy(y)+5)+'" text-anchor="middle" font-size="14" fill="var(--ink)">'+t+'</text>';}
const GR={xMin:0,xMax:12,yMin:0,yMax:18,xTicks:[0,2,4,6,8,10,12],yTicks:[0,2,4,6,8,10,12,14,16,18],xLabel:'r² (mm²)',yLabel:'v (cm s⁻¹)',W:560,H:340};
{
  const body=act('graphs','Calculate','Glycerol at two temperatures','The graph shows v against r² for steel balls in glycerol at 20 °C (line P) and at 25 °C (line Q). The steel has a density of 7800 kg m⁻³ and the glycerol 1260 kg m⁻³; g = 9.81 N kg⁻¹.');
  const split=mk('div','graph-split');body.appendChild(split);
  const g0=lineGraph(Object.assign({points:[[0,0]]},GR));
  let minor='';   // small squares every 0.5, so the lines can be read
  for(let x=0.5;x<12;x+=0.5)if(x%2)minor+='<line class="g-grid" style="opacity:.45" x1="'+g0.gx(x)+'" x2="'+g0.gx(x)+'" y1="'+g0.gy(18)+'" y2="'+g0.gy(0)+'"/>';
  for(let y=0.5;y<18;y+=0.5)if(y%2)minor+='<line class="g-grid" style="opacity:.45" y1="'+g0.gy(y)+'" y2="'+g0.gy(y)+'" x1="'+g0.gx(0)+'" x2="'+g0.gx(12)+'"/>';
  split.appendChild(mk('div','graph-box',lineGraph(Object.assign({label:'v against r² for glycerol at 20 °C, line P, and at 25 °C, line Q, both straight lines through the origin, Q steeper',
    segments:[{pts:[[0,0],[12,12.12]]},{pts:[[0,0],[12,18]],cls:'g-line-b'}],
    extra:minor+lab(g0,'P',11,9.4)+lab(g0,'Q',9,15.6)},GR)).svg));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'Line P: read off the terminal velocity of a ball of radius 3.0 mm at 20 °C.',unit:'cm s⁻¹',answer:9.09,working:'r = 3.0 mm<br>r² = 9.0 mm²<br>v = ?||read up from r² = 9.0 mm² to line P<br>v = 9.1 cm s⁻¹'},
    {q:'Line Q: what is its gradient, in m⁻¹ s⁻¹?',unit:'m⁻¹ s⁻¹',answer:1.5e4,working:'first point = (0, 0)<br>second point = (12.0, 18.0)<br>gradient = ?||gradient = [[change in v|change in r²]]<br>gradient = [[18.0 − 0|12.0 − 0]]<br>gradient = 1.50 cm s⁻¹ mm⁻²<br>gradient = 1.50 × 10⁴ m⁻¹ s⁻¹'},
    {q:'Use line Q to find the viscosity of the glycerol at 25 °C.',unit:'Pa s',answer:0.950,working:'gradient = 1.50 × 10⁴ m⁻¹ s⁻¹<br>ρ<sub>s</sub> − ρ<sub>f</sub> = 7800 − 1260 = 6540 kg m⁻³<br>η = ?||gradient = [[2(ρ<sub>s</sub> − ρ<sub>f</sub>)g|9η]]<br>1.50 × 10⁴ = [[2 × 6540 × 9.81|9η]]<br>η = [[2 × 6540 × 9.81|9 × 1.50 × 10⁴]]<br>η = 0.950 Pa s',
     hints:['Change cm s⁻¹ mm⁻² to m⁻¹ s⁻¹: multiply by 10⁴.','η = [[2(ρ<sub>s</sub> − ρ<sub>f</sub>)g|9 × gradient]].']}
  ]});
}
{
  const body=act('graphs','Multiple choice','A point below the line','The point for the largest ball lies below the straight line through the others.');
  createPredict({host:body,q:'For the largest ball, A to B took 1.02 s and B to C took 0.89 s (equal distances). Why is its point below the line?',options:[
    {text:'It was still accelerating at A',correct:true},
    {text:'The stopwatch was started late at A',why:'Starting late at A would make A to B look shorter, not longer.'},
    {text:'The glycerol was colder for that ball',why:'Colder glycerol would slow the ball all the way down, so A to B and B to C would still take the same time.'}
  ],explain:'A to B took longer than B to C, so the ball was still accelerating as it passed A: it had not reached terminal velocity, and its mean speed is too low. A big ball takes longer to reach terminal velocity, so the top band must be further below the surface (or the ball left out).'});
}

/* ================= 6. CALCULATE ================= */
const VLIQ=[['glycerol',1260,1.41,'the glycerol'],['castor oil',961,0.99,'the oil'],['engine oil',880,0.30,'the oil'],['silicone oil',970,0.50,'the oil']];
function steelVt(r,l){return 2*r*r*(RHO_S-l[1])*GV/(9*l[2]);}   // r in m, v in m s⁻¹
const vq1=rnd=>{
  const kind=calcPick(rnd,['eta','v']);let l,r,v,F,t=0;
  do{l=calcPick(rnd,VLIQ);r=calcPick(rnd,[1.0,1.5,2.0,2.5])*1e-3;v=steelVt(r,l);t++;}while(v>0.15&&t<20);
  const vcs=(v*100).toPrecision(3),vc=+vcs,vm=vc/100,eta=l[2],Fg=+(6*Math.PI*eta*r*vm).toPrecision(3),rs=(r*1e3).toFixed(1);
  if(kind==='eta'){
    const a=Fg/(6*Math.PI*r*vm);
    return {q:`A steel ball of radius ${rs} mm falls through ${l[0]} at a steady ${vcs} cm s⁻¹. The viscous drag on it is ${ex(Fg,3)} N. Calculate the viscosity of ${l[3]}.`,unit:'Pa s',answer:+a.toPrecision(3),
      working:`r = ${rs} mm = ${rs} × 10⁻³ m<br>v = ${vcs} cm s⁻¹ = ${nm(vm,3)} m s⁻¹<br>F = ${ex(Fg,3)} N<br>η = ?||F = 6πηrv<br>${ex(Fg,3)} = 6π × η × ${rs} × 10⁻³ × ${nm(vm,3)}<br>η = [[${ex(Fg,3)}|6π × ${rs} × 10⁻³ × ${nm(vm,3)}]]<br>η = ${nm(a,3)} Pa s`};
  }
  const a=Fg/(6*Math.PI*eta*r)*100;
  return {q:`A steel ball of radius ${rs} mm falls through ${l[0]}, of viscosity ${eta.toFixed(2)} Pa s, at terminal velocity. The viscous drag on it is ${ex(Fg,3)} N. Calculate its terminal velocity in cm s⁻¹.`,unit:'cm s⁻¹',answer:+a.toPrecision(3),
    working:`r = ${rs} mm = ${rs} × 10⁻³ m<br>η = ${eta.toFixed(2)} Pa s<br>F = ${ex(Fg,3)} N<br>v = ?||F = 6πηrv<br>${ex(Fg,3)} = 6π × ${eta.toFixed(2)} × ${rs} × 10⁻³ × v<br>v = [[${ex(Fg,3)}|6π × ${eta.toFixed(2)} × ${rs} × 10⁻³]]<br>v = ${nm(a/100,3)} m s⁻¹<br>v = ${nm(a,3)} cm s⁻¹`};
};
const vq2=rnd=>{
  const kind=calcPick(rnd,['U','rho']),l=calcPick(rnd,VLIQ),d=calcPick(rnd,[2.0,3.0,4.0,5.0,6.0]),r=d/2*1e-3,V=4/3*Math.PI*Math.pow(r,3),U=l[1]*V*GV,rs=(d/2).toFixed(1);
  const hints=['Halve the diameter and change it to metres.','V = [[4|3]]πr³ is the volume of liquid the ball pushes aside.','Upthrust = weight of liquid displaced = ρVg.'];
  if(kind==='U')return {q:`A ball of diameter ${d.toFixed(1)} mm is held under the surface of ${l[0]}, of density ${l[1]} kg m⁻³. Calculate the upthrust on it.`,unit:'N',answer:+U.toPrecision(3),hints:hints,
    working:`d = ${d.toFixed(1)} mm<br>r = ${rs} mm = ${rs} × 10⁻³ m<br>ρ = ${l[1]} kg m⁻³<br>U = ?||V = [[4|3]]πr³<br>V = [[4|3]]π × (${rs} × 10⁻³)³<br>V = ${ex(V,4)} m³<br>U = ρVg<br>U = ${l[1]} × ${ex(V,4)} × 9.81<br>U = ${ex(U,3)} N`};
  const Ug=+U.toPrecision(3),rho=Ug/(V*GV);
  return {q:`The upthrust on a ball of diameter ${d.toFixed(1)} mm held under the surface of a liquid is ${ex(Ug,3)} N. Calculate the density of the liquid.`,unit:'kg m⁻³',answer:+rho.toPrecision(3),hints:hints.slice(0,2).concat(['Upthrust = ρVg, so ρ = [[U|Vg]].']),
    working:`d = ${d.toFixed(1)} mm<br>r = ${rs} mm = ${rs} × 10⁻³ m<br>U = ${ex(Ug,3)} N<br>ρ = ?||V = [[4|3]]πr³<br>V = [[4|3]]π × (${rs} × 10⁻³)³<br>V = ${ex(V,4)} m³<br>U = ρVg<br>${ex(Ug,3)} = ρ × ${ex(V,4)} × 9.81<br>ρ = [[${ex(Ug,3)}|${ex(V,4)} × 9.81]]<br>ρ = ${nm(rho,3)} kg m⁻³`};
};
const vq3=rnd=>{
  let l,r,v,t=0;
  do{l=calcPick(rnd,VLIQ);r=calcPick(rnd,[1.0,1.5,2.0,2.5,3.0])*1e-3;v=steelVt(r,l);t++;}while(v>0.15&&t<20);
  const rs=(r*1e3).toFixed(1),V=4/3*Math.PI*Math.pow(r,3),W=RHO_S*V*GV,U=l[1]*V*GV,F=W-U;
  return {q:`A steel ball (density 7800 kg m⁻³) of radius ${rs} mm falls through ${l[0]} (density ${l[1]} kg m⁻³, viscosity ${l[2].toFixed(2)} Pa s). Calculate its terminal velocity in cm s⁻¹.`,unit:'cm s⁻¹',answer:+(v*100).toPrecision(3),
    hints:['Work out V = [[4|3]]πr³, then the weight W = ρ(steel)Vg and the upthrust U = ρ(liquid)Vg.','At terminal velocity W = U + F, so F = W − U.','Then F = 6πηrv gives v.'],
    working:`r = ${rs} mm = ${rs} × 10⁻³ m<br>ρ<sub>s</sub> = 7800 kg m⁻³<br>ρ<sub>f</sub> = ${l[1]} kg m⁻³<br>η = ${l[2].toFixed(2)} Pa s<br>v = ?||V = [[4|3]]π × (${rs} × 10⁻³)³<br>V = ${ex(V,4)} m³<br>W = 7800 × ${ex(V,4)} × 9.81<br>W = ${ex(W,4)} N<br>U = ${l[1]} × ${ex(V,4)} × 9.81<br>U = ${ex(U,4)} N<br>W = U + F<br>F = ${ex(W,4)} − ${ex(U,4)}<br>F = ${ex(F,4)} N<br>F = 6πηrv<br>${ex(F,4)} = 6π × ${l[2].toFixed(2)} × ${rs} × 10⁻³ × v<br>v = [[${ex(F,4)}|6π × ${l[2].toFixed(2)} × ${rs} × 10⁻³]]<br>v = ${nm(v,3)} m s⁻¹<br>v = ${nm(v*100,3)} cm s⁻¹`};
};
const vq4=rnd=>{
  let l,d,v,t=0;
  do{l=calcPick(rnd,VLIQ);d=calcPick(rnd,[2.0,3.0,4.0,5.0,6.0]);v=steelVt(d/2*1e-3,l);t++;}while(v>0.15&&t<20);
  const s=calcPick(rnd,[0.150,0.200,0.250]),tt=+(s/v).toPrecision(3),vm=s/tt,r=d/2*1e-3,rs=(d/2).toFixed(1);
  const V=4/3*Math.PI*Math.pow(r,3),F=(RHO_S-l[1])*V*GV,eta=F/(6*Math.PI*r*vm);
  return {q:`Asma times a steel ball (density 7800 kg m⁻³) of diameter ${d.toFixed(1)} mm between two bands ${(s*100).toFixed(1)} cm apart on a cylinder of ${l[0]} (density ${l[1]} kg m⁻³). It takes ${tt.toPrecision(3)} s at terminal velocity. Calculate the viscosity of ${l[3]}.`,unit:'Pa s',answer:+eta.toPrecision(3),
    hints:['v = [[distance|time]], in m s⁻¹, and r is half the diameter, in metres.','At terminal velocity F = W − U = (ρ<sub>s</sub> − ρ<sub>f</sub>)Vg, with V = [[4|3]]πr³.','Then F = 6πηrv gives η.'],
    working:`d = ${d.toFixed(1)} mm<br>r = ${rs} mm = ${rs} × 10⁻³ m<br>s = ${(s*100).toFixed(1)} cm = ${s.toFixed(3)} m<br>t = ${tt.toPrecision(3)} s<br>η = ?||v = [[s|t]]<br>v = [[${s.toFixed(3)}|${tt.toPrecision(3)}]]<br>v = ${nm(vm,4)} m s⁻¹<br>V = [[4|3]]π × (${rs} × 10⁻³)³<br>V = ${ex(V,4)} m³<br>F = W − U<br>F = (7800 − ${l[1]}) × ${ex(V,4)} × 9.81<br>F = ${ex(F,4)} N<br>F = 6πηrv<br>${ex(F,4)} = 6π × η × ${rs} × 10⁻³ × ${nm(vm,4)}<br>η = [[${ex(F,4)}|6π × ${rs} × 10⁻³ × ${nm(vm,4)}]]<br>η = ${nm(eta,3)} Pa s`};
};
{
  const body=act('calculate','Calculate','Stokes’ law and upthrust','Use F = 6πηrv, V = [[4|3]]πr³ and upthrust = weight of liquid displaced; g = 9.81 N kg⁻¹. Type a power of ten as e.g. 6.0e-4. Press New problems for another set.');
  createCalc({host:body,questions:[calcFix(vq1,3),calcFix(vq2,2)]});
}
{
  const body=act('calculate','Calculate','Terminal velocity','At terminal velocity weight = upthrust + viscous drag. Press New problems for another set.');
  createCalc({host:body,questions:[calcFix(vq3,5),calcFix(vq4,1)]});
}

/* ================= 7. ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Why each step is done','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'More accurate η',hint:'Cuts the uncertainty in a reading or in η',color:'--c1',soft:'--c1-soft'},
    {id:'k',label:'Makes Stokes’ law apply',hint:'Terminal velocity, laminar flow, away from the walls',color:'--c2',soft:'--c2-soft'},
    {id:'s',label:'Keeps people safe',hint:'Stops an accident',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Measure each diameter in several directions and take the mean',cat:'a'},
    {id:'2',text:'Time each ball three times and use the mean time',cat:'a'},
    {id:'3',text:'Read each band on the rule with your eye level with it',cat:'a'}, {id:'10',text:'Check and correct the micrometer for a zero error, which removes a systematic error',cat:'a'}, {id:'11',text:'Start and stop the stopwatch as the same point of the ball passes each band, with your eye level with the band',cat:'a'},
    {id:'4',text:'Find η from the gradient of v against r² for five sizes',cat:'a'},
    {id:'5',text:'Put the top band well below the surface',cat:'k'},
    {id:'6',text:'Drop each ball down the centre of the cylinder',cat:'k'},
    {id:'7',text:'Use small balls, so they fall slowly',cat:'k'},
    {id:'8',text:'Wipe up spilt glycerol straight away, as it is slippery',cat:'s'},
    {id:'9',text:'Clamp the tall cylinder so it cannot be knocked over',cat:'s'}
  ]});
}
{
  const body=act('accuracy','Multiple choice','The biggest uncertainty','Ball 5: d = 6.92 mm on a micrometer reading to 0.01 mm; A to C = 22.0 cm from two band readings to 0.1 cm; times 1.85, 1.79 and 1.82 s.');
  createPredict({host:body,q:'Which measurement gives the biggest percentage uncertainty in v or r² for Ball 5?',options:[
    {text:'The time, as it is short and hand-timed',correct:true},
    {text:'The diameter, as r is squared',why:'Half the resolution, 0.005 mm, in 6.92 mm is under 0.1%, so even doubled for r² it is only about 0.15%.'},
    {text:'The distance A to C, as it is read twice',why:'Half the resolution, 0.05 cm, for each of two readings is 0.1 cm in 22.0 cm, about 0.5%. That is smaller than the timing uncertainty.'}
  ],explain:'Half the range of the times is 0.03 s in 1.82 s, about 1.6%, and a reaction time of about 0.2 s is a large fraction of so short a time. Fast balls are hardest to time: put the bands further apart, or film the ball beside the rule and step through the video.'});
}

/* ================= EXAM PRACTICE ================= */
{
  const body=act('exam','Exam style','The viscosity of an oil','Haris drops steel balls of different radius r through an oil. He times each one over 0.150 m between two bands, after it has reached terminal velocity. Steel has a density of 7800 kg m⁻³ and the oil 920 kg m⁻³; g = 9.81 N kg⁻¹. Type a power of ten as e.g. 1.88e4.');
  body.appendChild(resTable(['r (mm)','1.0','1.5','2.0','2.5','3.0'],[['t (s)','8.02','3.57','2.01','1.29','0.89'],['v (m s⁻¹)','0.0187','0.0420','0.0746',null,'0.169'],['r² (× 10⁻⁶ m²)','1.00','2.25','4.00','6.25','9.00']]));
  body.appendChild(mk('p','sub','(a) 1 mark'));
  createCalc({host:body,questions:[
    {q:'Calculate the missing terminal velocity for r = 2.5 mm.',unit:'m s⁻¹',answer:0.116,working:'s = 0.150 m<br>t = 1.29 s<br>v = ?||v = [[s|t]]<br>v = [[0.150|1.29]]<br>v = 0.116 m s⁻¹'}
  ]});
  examPart(body,'(b) 3 marks','Show that v = [[2r²(ρ<sub>s</sub> − ρ<sub>f</sub>)g|9η]], where ρ<sub>s</sub> is the density of steel and ρ<sub>f</sub> the density of the oil.',[
    'Weight W = mg = [[4|3]]πr³ρ<sub>s</sub>g, and upthrust U = weight of oil displaced = [[4|3]]πr³ρ<sub>f</sub>g.',
    'At terminal velocity the resultant force is zero, so W = U + F, with F = 6πηrv.',
    '6πηrv = [[4|3]]πr³(ρ<sub>s</sub> − ρ<sub>f</sub>)g, which rearranges to v = [[2r²(ρ<sub>s</sub> − ρ<sub>f</sub>)g|9η]].'
  ]);
  body.appendChild(mk('p','sub','(c) 3 marks'));
  createCalc({host:body,questions:[
    {q:'Use the readings for r = 1.0 mm and r = 3.0 mm to calculate the viscosity of the oil.',unit:'Pa s',answer:0.798,working:'v at r² = 1.00 × 10⁻⁶ m² = 0.0187 m s⁻¹<br>v at r² = 9.00 × 10⁻⁶ m² = 0.169 m s⁻¹<br>η = ?||gradient = [[0.169 − 0.0187|(9.00 − 1.00) × 10⁻⁶]]<br>gradient = [[0.1503|8.00 × 10⁻⁶]]<br>gradient = 1.879 × 10⁴ m⁻¹ s⁻¹<br>gradient = [[2(ρ<sub>s</sub> − ρ<sub>f</sub>)g|9η]]<br>1.879 × 10⁴ = [[2 × (7800 − 920) × 9.81|9η]]<br>η = [[2 × 6880 × 9.81|9 × 1.879 × 10⁴]]<br>η = 0.798 Pa s',
     hints:['The gradient of v against r² is [[change in v|change in r²]]; keep r² in m².','gradient = [[2(ρ<sub>s</sub> − ρ<sub>f</sub>)g|9η]], so η = [[2(ρ<sub>s</sub> − ρ<sub>f</sub>)g|9 × gradient]].']}
  ]});
  examPart(body,'(d) 2 marks','Explain how Haris could check that each ball had reached terminal velocity before it passed the first band.',[
    'Add a third band halfway between the two (or time the ball over two equal distances, e.g. with a lap time).',
    'If the times over the two equal distances are the same, the velocity is constant, so it is the terminal velocity.'
  ]);
  examPart(body,'(e) 2 marks','Explain why Haris measures the temperature of the oil and keeps it the same throughout.',[
    'Viscosity depends on temperature: it falls as the temperature rises.',
    'If the temperature changed between balls, η would not be the same for every point, so the graph would not give one value (and η is quoted at that temperature).'
  ]);
  examPart(body,'(f) 6 marks','Describe how Haris should carry out this investigation to obtain an accurate value for the viscosity of the oil.',[
    'Measure the diameter of each ball with a micrometer in several directions (check and correct for zero error); take the mean and halve it for r.',
    'Put bands round a tall cylinder of oil, the top one well below the surface so the ball is at terminal velocity; measure the distance between them with a metre rule at eye level.',
    'Drop the ball down the centre of the cylinder (away from the walls) and time it between the bands with a stopwatch, starting and stopping as the same point of the ball passes each band at eye level (or film it beside the rule and view it in slow motion); check equal times over equal distances.',
    'Repeat for each ball and find the mean time; use at least five sizes of ball (small enough for laminar flow); measure the temperature.',
    'Work out v = [[distance|mean time]]; plot v against r²; η = [[2(ρ<sub>s</sub> − ρ<sub>f</sub>)g|9 × gradient]].',
    'Safety: wipe up spilt oil straight away (slippery floor) and clamp the cylinder so it cannot fall.'
  ]);
}
