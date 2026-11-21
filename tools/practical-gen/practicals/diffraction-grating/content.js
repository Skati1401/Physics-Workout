/* IAL CP6 Determine the wavelength of light from a laser or other light source using a diffraction grating (spec points 51, 52).
   Built on the CP15 model (gamma-absorption): nλ = d sin θ, so sin θ against n is a straight line through the origin, gradient λ/d.
   The Do the Experiment tab frames animations/slit-interference.html?show=measure (the Grating part of that page), whose fixed
   readings must match DG_L and DG_R below (xr() and MP in the animation; tools/CORE-PRACTICALS.md, "Measure modes").
   Written 20 Nov 2026 (TODO 5m) from the IAL specification and the summaries in the IAL Past Paper Index (8PH0/02 Specimen Q12(c),
   Nov 2021 Q16(c), June 2024 Q11(a); WPH12 Jan 2020 Q9, Oct 2021 Q2, Jan 2021 Q18(b), Oct 2024 Q16, Oct 2025 Q16, June 2026 Q18(c);
   9PH0/03 June 2017 Q12(b)(i)). Mark scheme wording check (TODO 5ab, 21 Nov 2026, school account): Method, Accuracy and Exam
   checked against the WPH12 mark schemes Oct 2024 Q13(b) and Q16 (safety, the two distances, nλ = d sin θ with θ = 90°) and
   Jan 2021 Q18(b) (d = distance between adjacent slits; measure maximum to maximum across the centre and increase the grating–screen
   distance to decrease the percentage uncertainty). The 8PH0/9PH0 mark schemes are not on the school Drive, so they were not read. */
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
const g3=v=>String(+(+v).toPrecision(3));
const g4=v=>String(+(+v).toPrecision(4));
const DG_ANIM='animations/slit-interference.html';

/* ================= 1. OVERVIEW ================= */
{
  const body=act('overview','Fill in the blanks','The practical in one passage','Drag a word into each gap, or tap a word and then tap a gap. Some words are not needed.');
  const parts=[
    'A laser beam passes at right angles through a diffraction grating and falls on a screen a distance D away. Light from each slit ',['b1','diffracts'],
    ', and the waves from all the slits ',['b2','superpose'],'. A bright dot (a maximum) forms where the path difference between light from neighbouring slits is a ',['b3','whole number'],
    ' of wavelengths, so nλ = d sin θ. The slit spacing d is 1 m divided by the number of ',['b4','lines per metre'],'. The distance x from the central maximum to the nth order is measured, and θ is found from ',['b5','tan θ = x/D'],
    '. A graph of sin θ against n is a straight line through the origin with gradient ',['b6','λ/d'],'. The screen is put several metres away so that x is large and its ',['b7','percentage uncertainty'],' is small.'
  ];
  const cloze=mk('div','cloze'),slots=[],chips=[];
  parts.forEach(p=>{
    if(typeof p==='string')cloze.appendChild(document.createTextNode(p));
    else{const s=mk('span','blank');cloze.appendChild(s);slots.push({id:p[0],el:s,answer:p[1]});chips.push({id:'c-'+p[0],text:p[1]});}
  });
  ['refracts','sin θ = x/D','d/λ','lines per mm'].forEach((t,i)=>chips.push({id:'d'+i,text:t}));
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
    {id:'a',text:'Fix the grating in a holder so that the laser beam meets it at right angles, with a screen several metres away.'},
    {id:'b',text:'Measure the perpendicular distance D between the diffraction grating and the screen with a tape measure.'},
    {id:'c',text:'Switch on the laser and find the central maximum (n = 0) and the first-order maximum on each side of it.'},
    {id:'d',text:'Measure the distance between the two first-order maxima and halve it to get x.'},
    {id:'e',text:'Repeat for the second order, and for every higher order that lands on the screen.'},
    {id:'f',text:'For each order, find θ from tan θ = x/D and work out sin θ.'},
    {id:'g',text:'Plot sin θ against n, draw a line of best fit and find the wavelength from λ = gradient × d.'}
  ],constraints:[['a','c'],['c','d'],['d','e'],['e','f'],['b','f'],['f','g']],
  why:'The grating and screen are set up before anything is measured. D can be measured at any time before θ is worked out. The graph comes once sin θ is known for every order.'});
}
{
  const body=act('method','Match','What each piece of equipment is for','Pair each piece of equipment with its job. Drag one card onto the other, or tap one card and then the other.');
  createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'l',l:'Laser',r:'Gives a narrow beam of light of one wavelength'},
    {id:'g',l:'Diffraction grating',r:'Has many equally spaced slits, so the maxima are sharp and bright'},
    {id:'r',l:'Metre rules along the screen',r:'Measure the distance between the two maxima of the same order'},
    {id:'t',l:'Tape measure',r:'Measures the distance D from the grating to the screen'},
    {id:'s',l:'Set square',r:'Checks that the beam meets the grating at right angles'}
  ]});
}

/* ================= DO THE EXPERIMENT ================= */
// The student reads where each bright dot is on the metre rules in the animation's measure mode (?show=measure), and D on the bench rule.
// DG_L and DG_R must match the animation's readings (xr() with MP = 633 nm, 300 lines per mm, D = 1.00 m).
const DG_L=[80.6,59.0,30.8], DG_R=[119.2,140.9,169.2], DG_D=1.00;
const DG_W=DG_L.map((l,k)=>+(DG_R[k]-l).toFixed(1));                       // 38.6, 81.9, 138.4 cm between the two maxima
const DG_X=DG_W.map(w=>w/2);                                               // 19.30, 40.95, 69.20 cm
const DG_T=DG_X.map(x=>Math.atan(x/(DG_D*100))*180/Math.PI);               // 10.92, 22.27, 34.68 degrees
const DG_S=DG_T.map(t=>Math.sin(t*Math.PI/180));                           // 0.1895, 0.3790, 0.5690
let dgTable=null,dgPlotRows=()=>{};
{
  act('do','Your turn','Take your own readings','1. Read D on the rule along the bench. 2. Choose each bright spot in turn and read where its centre is on the metre rules, to 0.1 cm. 3. For each order, work out 2x (right − left), x, θ from tan θ = x/D, and sin θ.');
}
frameAct('do',DG_ANIM,'measure&level=ial','Diffraction grating experiment: read where each bright dot is on the metre rules','diffraction grating',false);
{
  const body=act('do','Calculate','Your results table','Write each reading as the rule shows it, to 0.1 cm. Give θ to 0.1° and sin θ to 3 decimal places. Press Check.');
  const wrap=mk('div','table-scroll');body.appendChild(wrap);
  const cell=(c,k,lab)=>'<td><input class="calc-num-input" data-c="'+c+'" data-k="'+k+'" inputmode="decimal" autocomplete="off" aria-label="'+lab+'"></td>';
  wrap.innerHTML='<table class="units res-tbl ga-tbl"><tbody><tr><td class="given">Grating to screen, D (m)</td>'+cell('D',0,'Distance from the grating to the screen, metres')+'</tr></tbody></table>'+
    '<table class="units res-tbl ga-tbl"><thead><tr><th>n</th><th>Left (cm)</th><th>Right (cm)</th><th>2x (cm)</th><th>x (cm)</th><th>θ (°)</th><th>sin θ</th></tr></thead><tbody>'+
    DG_L.map((x,k)=>'<tr><td class="given">'+(k+1)+'</td>'+cell('l',k,'Order '+(k+1)+', reading of the left spot, centimetres')+cell('r',k,'Order '+(k+1)+', reading of the right spot, centimetres')+
      cell('w',k,'Order '+(k+1)+', distance between the two spots, centimetres')+cell('x',k,'Order '+(k+1)+', x, centimetres')+cell('t',k,'Order '+(k+1)+', angle theta, degrees')+cell('s',k,'Order '+(k+1)+', sine of theta')+'</tr>').join('')+'</tbody></table>';
  const inp=(c,k)=>$('input[data-c="'+c+'"][data-k="'+k+'"]',wrap), all=()=>$$('input',wrap);
  const val=e=>{const t=e.value.trim().replace(/[−–]/g,'-').replace(',','.');return t===''||!/^-?(\d+\.?\d*|\.\d+)$/.test(t)?NaN:parseFloat(t);};
  const want=(c,k)=>c==='D'?[DG_D,0.005]:c==='l'?[DG_L[k],0.05]:c==='r'?[DG_R[k],0.05]:c==='w'?[DG_W[k],0.05]:c==='x'?[DG_X[k],0.03]:c==='t'?[DG_T[k],0.06]:[DG_S[k],0.0015];
  const show=(c,k)=>{const w=want(c,k)[0];return c==='D'||c==='x'?w.toFixed(2):c==='s'?w.toFixed(3):w.toFixed(1);};
  const b=bar(body,[{label:'Check table',primary:true,fn:check},{label:'Clear',fn:reset}]);
  const ans=answerBtn(b,()=>{
    all().forEach(e=>{if(e.disabled)return;e.value=show(e.dataset.c,+e.dataset.k);e.disabled=true;e.classList.add('is-shown');e.classList.remove('is-wrong');});
    b.say('Answers shown (dashed). Now plot sin θ against n below.','');dgPlotRows();
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
    if(ok===n){b.say('All correct. Now plot sin θ against n.','good');celebrate(b.msg);ans.off();}
    else{b.say(ok+' of '+n+' correct'+(blank?', '+blank+' left blank':'')+'.'+(bad?' Check which spot you read, that D and x are in the same unit before you divide, and that your calculator is in degrees.':''),bad?'bad':'');ans.on();}
    dgPlotRows();
  }
  // Show answer is always there for this table (as on CP15), so students can skip it and go on to the plot
  function reset(){all().forEach(e=>{e.value='';e.disabled=false;e.classList.remove('is-wrong','is-shown','pop');});ans.on();b.say('','');dgPlotRows();}
  all().forEach(e=>e.addEventListener('input',()=>e.classList.remove('is-wrong')));
  ans.on();
  dgTable={s:k=>{const e=inp('s',k);return e.value.trim()===''||!e.disabled?null:e.value.trim();}};
  track(body,{reset:reset,
    getState:()=>({v:all().map(e=>e.value),ok:all().map(e=>e.disabled),sh:all().map(e=>e.classList.contains('is-shown'))}),
    setState:s=>{reset();all().forEach((e,i)=>{if(!s||!s.v||typeof s.v[i]!=='string')return;e.value=s.v[i];if(s.ok&&s.ok[i]){e.disabled=true;if(s.sh&&s.sh[i])e.classList.add('is-shown');}});if(all().every(e=>e.disabled)){b.say('All correct. Now plot sin θ against n.','good');ans.off();}dgPlotRows();},
    isDone:()=>all().every(e=>e.disabled)});
}
{
  const body=act('do','Explain','Why plot sin θ against n?','Each maximum is where the path difference between neighbouring slits is a whole number of wavelengths:');
  body.insertAdjacentHTML('beforeend',
    '<div class="ln-steps"><span>nλ</span><span>=</span><span>d sin θ</span>'+
    '<span>sin θ</span><span>=</span><span>'+FR('[[nλ|d]]')+'</span>'+
    '<span>sin θ</span><span>=</span><span>'+FR('[[λ|d]]')+' × n</span></div>'+
    '<p class="act-intro">In the order of y = mx + c:</p>'+
    '<div class="ln-match"><span>sin θ</span><span>=</span><span>'+FR('[[λ|d]]')+'</span><span>n</span><span>+</span><span>0</span>'+
    '<span>y</span><span>=</span><span>m</span><span>x</span><span>+</span><span>c</span></div>'+
    '<p class="act-intro">So sin θ against n is a straight line through the origin, with gradient '+FR('[[λ|d]]')+'. Every order is used, so the wavelength is more accurate than from one order alone.</p>');
}
{
  const body=act('do','Plot','Plot your results','Plot sin θ against n from your table as small crosses. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');
  createPlot({host:body,next:' Now find the wavelength from the line of best fit below.',
    points:DG_S.map((s,k)=>({x:k+1,y:s})),
    rowText:p=>{const k=p.x-1,e=dgTable&&dgTable.s(k);return 'n = '+p.x+', '+(e?'sin θ = '+e:'your sin θ');},
    graph:{xMin:0,xMax:4,yMin:0,yMax:0.7,xTicks:[0,1,2,3,4],yTicks:[0,0.1,0.2,0.3,0.4,0.5,0.6,0.7],minor:[0.5,0.01],snap:[0.5,0.01],xLabel:'order, n',yLabel:'sin θ',W:560,H:380}});
  // the animation and the results table side by side, as on CP15
  {const fr=$('#panel-do .anim-wrap'),tb=$('#panel-do .ga-tbl').closest('.act'),yt=$('#panel-do .act[data-title="Take your own readings"]');
   if(fr&&tb){const sp=mk('div','hk-split'),left=mk('div','ga-left');fr.parentNode.insertBefore(sp,fr);sp.appendChild(left);if(yt)left.appendChild(yt);left.appendChild(fr);sp.appendChild(tb);}}
  dgPlotRows=()=>{$$('.plot-row',body).forEach((li,k)=>{const e=dgTable&&dgTable.s(k),s=li.firstElementChild;if(s)s.textContent='n = '+(k+1)+', '+(e?'sin θ = '+e:'your sin θ');});};
  dgPlotRows();
}
{
  const body=act('do','Calculate','The wavelength from your line','A good line of best fit through your points passes through the origin and (3.0, 0.570). The grating has 300 lines per mm.');
  createCalc({host:body,questions:[
    {q:'What is the gradient of the line?',unit:'',answer:0.19,working:'first point = (0, 0)<br>second point = (3.0, 0.570)<br>gradient = ?||gradient = [[change in sin θ|change in n]]<br>gradient = [[0.570 − 0|3.0 − 0]]<br>gradient = 0.190'},
    {q:'What is the slit spacing, d, of the grating?',unit:'μm',answer:3.33,working:'300 lines per mm = 3.00 × 10⁵ lines per metre<br>d = ?||d = [[1|number of lines per metre]]<br>d = [[1|3.00 × 10⁵]]<br>d = 3.333 × 10⁻⁶ m<br>d = 3.33 μm'},
    {q:'What is the wavelength of the laser light?',unit:'nm',answer:633,working:'gradient = 0.190<br>d = 3.333 × 10⁻⁶ m<br>λ = ?||gradient = [[λ|d]]<br>λ = gradient × d<br>λ = 0.190 × 3.333 × 10⁻⁶<br>λ = 6.33 × 10⁻⁷ m<br>λ = 633 nm'}
  ]});
}

/* ================= SHOW: the readings taken for you ================= */
{
  act('experiment','Your turn','Watch the readings','Press Play: each order on the screen is measured between its two dots, and sin θ is plotted against n. Then change to the grating with 100 lines per mm, or move the screen: what happens to the dots, to the number of points and to the gradient?');
}
frameAct('experiment',DG_ANIM,'exp&part=grating&level=ial','Diffraction grating animation: a laser, a grating and a screen, with a graph of sin theta against the order n','diffraction grating',false);
// the "full screen" links open the Grating part of the page, not its double-slit part
$$('.anim-open a').forEach(a=>{a.href=DG_ANIM+'?level=ial&part=grating';});

/* ================= 5. ANALYSIS ================= */
function lab(g0,t,x,y){return '<circle cx="'+g0.gx(x)+'" cy="'+g0.gy(y)+'" r="13" fill="var(--panel)" stroke="var(--ink)" stroke-width="2"/><text x="'+g0.gx(x)+'" y="'+(g0.gy(y)+5)+'" text-anchor="middle" font-size="14" fill="var(--ink)">'+t+'</text>';}
const GV={xMin:0,xMax:5,yMin:0,yMax:1,xTicks:[0,1,2,3,4,5],yTicks:[0,0.2,0.4,0.6,0.8,1],xLabel:'order, n',yLabel:'sin θ',W:560,H:340};
{
  const body=act('graphs','Calculate','Two gratings','Light of wavelength 600 nm from the same laser passes through two gratings, P and Q. The graph shows sin θ against n for each. Read your answers off the graph.');
  const split=mk('div','graph-split');body.appendChild(split);
  const g0=lineGraph(Object.assign({points:[[0,0]]},GV));
  split.appendChild(mk('div','graph-box',lineGraph(Object.assign({label:'sin theta against n for two gratings: the line for P is steep and ends at n = 3, sin theta = 0.90; the line for Q is less steep and reaches sin theta = 0.60 at n = 5',segments:[{pts:[[0,0],[3,0.9]]},{pts:[[0,0],[5,0.6]],cls:'g-line-b'}],
    extra:lab(g0,'P',2.2,0.66+0.13)+lab(g0,'Q',4.2,0.504+0.13)},GV)).svg));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'What is the gradient of the line for grating P?',unit:'',answer:0.3,working:'first point = (0, 0)<br>second point = (3, 0.90)<br>gradient = ?||gradient = [[0.90 − 0|3 − 0]]<br>gradient = 0.30'},
    {q:'What is the slit spacing of grating P?',unit:'μm',answer:2,working:'gradient = 0.30<br>λ = 600 nm = 6.00 × 10⁻⁷ m<br>d = ?||gradient = [[λ|d]]<br>d = [[λ|gradient]]<br>d = [[6.00 × 10⁻⁷|0.30]]<br>d = 2.0 × 10⁻⁶ m<br>d = 2.0 μm'},
    {q:'How many lines per mm does grating Q have?',unit:'lines per mm',answer:200,working:'first point = (0, 0)<br>second point = (5, 0.60)<br>λ = 6.00 × 10⁻⁷ m<br>lines per mm = ?||gradient = [[0.60 − 0|5 − 0]]<br>gradient = 0.12<br>d = [[λ|gradient]]<br>d = [[6.00 × 10⁻⁷|0.12]]<br>d = 5.0 × 10⁻⁶ m<br>lines per metre = [[1|d]]<br>lines per metre = 2.0 × 10⁵<br>lines per mm = 200'}
  ]});
}
{
  const body=act('graphs','Multiple choice','Reading the line','A quick question about the same graph.');
  createPredict({host:body,q:'The line for grating P stops at n = 3. Why is there no fourth-order maximum?',options:[
    {text:'sin θ would have to be more than 1',correct:true},
    {text:'The fourth order is too dim to see',why:'The higher orders are dimmer, but that is not why this one is missing: no angle has a sine of 1.2.'},
    {text:'The screen is not wide enough',why:'A wider screen catches more of the orders that exist, but no screen can catch an order that needs sin θ to be more than 1.'}
  ],explain:'For P the gradient is 0.30, so the fourth order needs sin θ = 4 × 0.30 = 1.2, which is impossible. The highest order is the largest whole number below d/λ = 3.33. Grating Q, with slits further apart, can give up to n = 8.'});
}

/* ================= 6. CALCULATE ================= */
{
  const body=act('calculate','Calculate','The diffraction grating','Use nλ = d sin θ, with d = 1 m divided by the number of lines per metre. Press New problems for another set.');
  const pos=(lam,N,n,D)=>{const s=n*lam*1e-9*N*1e3;return s<1?D*s/Math.sqrt(1-s*s):null;};
  createCalc({host:body,questions:[
    {q:'Laser light passes through a grating with 300 lines per mm. On a screen 2.00 m away, the second-order maximum is 0.890 m from the central maximum. What is the wavelength of the light?',unit:'nm',answer:678,
     working:'300 lines per mm = 3.00 × 10⁵ lines per metre<br>n = 2<br>x = 0.890 m<br>D = 2.00 m<br>λ = ?||tan θ = [[x|D]]<br>tan θ = [[0.890|2.00]]<br>θ = 23.99°<br>d = [[1|3.00 × 10⁵]]<br>d = 3.333 × 10⁻⁶ m<br>nλ = d sin θ<br>2 × λ = 3.333 × 10⁻⁶ × sin 23.99°<br>λ = [[3.333 × 10⁻⁶ × 0.4066|2]]<br>λ = 6.78 × 10⁻⁷ m<br>λ = 678 nm',
     hints:['Find θ first, from tan θ = x/D. The angle is too large to treat sin θ and tan θ as equal.','Then nλ = d sin θ, with d in metres.'],
     make:rnd=>{let lam,N,n,D,x;do{lam=calcPick(rnd,[450,520,532,589,633,650]);N=calcPick(rnd,[200,300,400,500]);n=calcPick(rnd,[1,2,3]);D=calcPick(rnd,[1.50,2.00,2.50,3.00]);x=pos(lam,N,n,D);}while(x==null||x<0.2||x>2.5);
       x=+x.toPrecision(3);const th=Math.atan(x/D),d=1e-3/N,lw=d*Math.sin(th)/n*1e9,ord=['','first','second','third'][n];
       return {q:`Laser light passes through a grating with ${N} lines per mm. On a screen ${D.toFixed(2)} m away, the ${ord}-order maximum is ${g3(x)} m from the central maximum. What is the wavelength of the light?`,unit:'nm',answer:+lw.toPrecision(3),
         hints:['Find θ first, from tan θ = x/D. The angle is too large to treat sin θ and tan θ as equal.','Then nλ = d sin θ, with d in metres.'],
         working:`${N} lines per mm = ${(N/100).toFixed(2)} × 10⁵ lines per metre<br>n = ${n}<br>x = ${g3(x)} m<br>D = ${D.toFixed(2)} m<br>λ = ?||tan θ = [[x|D]]<br>tan θ = [[${g3(x)}|${D.toFixed(2)}]]<br>θ = ${g4(th*180/Math.PI)}°<br>d = [[1|${(N/100).toFixed(2)} × 10⁵]]<br>d = ${g4(d*1e6)} × 10⁻⁶ m<br>nλ = d sin θ<br>${n} × λ = ${g4(d*1e6)} × 10⁻⁶ × sin ${g4(th*180/Math.PI)}°<br>λ = [[${g4(d*1e6)} × 10⁻⁶ × ${g4(Math.sin(th))}|${n}]]<br>λ = ${g3(lw/100)} × 10⁻⁷ m<br>λ = ${g3(lw)} nm`};}},
    {q:'Light of wavelength 610 nm passes through a grating with 600 lines per mm. What is the angle between the central maximum and the first-order maximum?',unit:'°',answer:21.5,
     working:'λ = 610 nm = 6.10 × 10⁻⁷ m<br>600 lines per mm = 6.00 × 10⁵ lines per metre<br>n = 1<br>θ = ?||d = [[1|6.00 × 10⁵]]<br>d = 1.667 × 10⁻⁶ m<br>nλ = d sin θ<br>sin θ = [[1 × 6.10 × 10⁻⁷|1.667 × 10⁻⁶]]<br>sin θ = 0.3660<br>θ = 21.5°',
     hints:['d is 1 m divided by the number of lines per metre.','Rearrange nλ = d sin θ for sin θ, then use sin⁻¹.'],
     make:rnd=>{let lam,N,n,s;do{lam=calcPick(rnd,[450,480,532,589,610,650]);N=calcPick(rnd,[300,400,500,600]);n=calcPick(rnd,[1,2]);s=n*lam*1e-9*N*1e3;}while(s>0.95);
       const d=1e-3/N,th=Math.asin(s)*180/Math.PI,ord=['','first','second'][n];
       return {q:`Light of wavelength ${lam} nm passes through a grating with ${N} lines per mm. What is the angle between the central maximum and the ${ord}-order maximum?`,unit:'°',answer:+th.toPrecision(3),
         hints:['d is 1 m divided by the number of lines per metre.','Rearrange nλ = d sin θ for sin θ, then use sin⁻¹.'],
         working:`λ = ${lam} nm = ${(lam/100).toFixed(2)} × 10⁻⁷ m<br>${N} lines per mm = ${(N/100).toFixed(2)} × 10⁵ lines per metre<br>n = ${n}<br>θ = ?||d = [[1|${(N/100).toFixed(2)} × 10⁵]]<br>d = ${g4(d*1e6)} × 10⁻⁶ m<br>nλ = d sin θ<br>sin θ = [[${n} × ${(lam/100).toFixed(2)} × 10⁻⁷|${g4(d*1e6)} × 10⁻⁶]]<br>sin θ = ${g4(s)}<br>θ = ${g3(th)}°`};}},
    {q:'Light of wavelength 580 nm passes through a grating with 400 lines per mm. How many maxima are produced in total, counting the central maximum and both sides?',unit:'maxima',answer:9,
     working:'λ = 5.80 × 10⁻⁷ m<br>400 lines per mm = 4.00 × 10⁵ lines per metre<br>number of maxima = ?||d = [[1|4.00 × 10⁵]]<br>d = 2.50 × 10⁻⁶ m<br>nλ = d sin θ<br>largest sin θ = 1<br>largest n = [[d|λ]]<br>[[d|λ]] = [[2.50 × 10⁻⁶|5.80 × 10⁻⁷]]<br>[[d|λ]] = 4.31<br>highest order = 4<br>number of maxima = 2 × 4 + 1<br>number of maxima = 9',
     hints:['sin θ cannot be more than 1, so n cannot be more than d/λ.','Round down to a whole number, then count both sides and the centre.']},
    {q:'The angle between the two first-order maxima is 21.9° for laser light of wavelength 633 nm. How many lines per mm does the grating have?',unit:'lines per mm',answer:300,
     working:'angle between the two first orders = 21.9°<br>λ = 6.33 × 10⁻⁷ m<br>n = 1<br>lines per mm = ?||θ = [[21.9°|2]]<br>θ = 10.95°<br>nλ = d sin θ<br>d = [[1 × 6.33 × 10⁻⁷|sin 10.95°]]<br>d = [[6.33 × 10⁻⁷|0.1899]]<br>d = 3.333 × 10⁻⁶ m<br>lines per metre = [[1|d]]<br>lines per metre = 3.00 × 10⁵<br>lines per mm = 300',
     hints:['θ in nλ = d sin θ is measured from the central maximum, so halve the angle.','The number of lines per metre is 1 divided by d.']}
  ]});
}

/* ================= 7. ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Why each step is done','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'More accurate wavelength',hint:'Cuts the percentage uncertainty',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps people safe',hint:'Keeps laser light out of eyes',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Measure between the two maxima of the same order and halve it, instead of measuring from the centre',cat:'a'},
    {id:'2',text:'Increase the distance from the diffraction grating to the screen, so that x is large',cat:'a'},
    {id:'3',text:'Use every order that lands on the screen and find the wavelength from a graph',cat:'a'},
    {id:'4',text:'Check with a set square that the beam meets the grating at right angles',cat:'a'},
    {id:'5',text:'Use a grating with more lines per mm, so that the angles are larger',cat:'a'},
    {id:'6',text:'Direct the laser away from people’s eyes, and stand behind the laser',cat:'s'},
    {id:'7',text:'Avoid directing the laser at reflective surfaces',cat:'s'},
    {id:'8',text:'Put a laser warning sign on the door',cat:'s'}
  ]});
}

/* ================= EXAM PRACTICE ================= */
{
  const body=act('exam','Exam style','The wavelength of a green laser','Meera shines a green laser at right angles through a diffraction grating with 400 lines per mm. The pattern of bright dots falls on a wall 2.50 m from the grating. She measures the distance between the two maxima of each order.');
  body.appendChild(resTable(['Order, n','1','2','3'],[['Distance between the two maxima (m)','1.09','2.35',null]]));
  examPart(body,'(a) 3 marks','Explain why bright dots are seen only at certain angles.',[
    'Light diffracts (spreads out) at each slit, and the waves from all the slits superpose where they meet.',
    'At certain angles the path difference between light from adjacent slits is a whole number of wavelengths (path difference = nλ, where n is an integer).',
    'There the waves are in phase, so constructive interference occurs: a maximum. At other angles the waves from the many slits cancel (destructive interference).'
  ]);
  body.appendChild(mk('p','sub','(b) 4 marks'));
  createCalc({host:body,questions:[
    {q:'Use the second-order reading to calculate the wavelength of the laser light.',unit:'nm',answer:532,working:'distance between the two maxima = 2.35 m<br>D = 2.50 m<br>400 lines per mm = 4.00 × 10⁵ lines per metre<br>n = 2<br>λ = ?||x = [[2.35|2]]<br>x = 1.175 m<br>tan θ = [[x|D]]<br>tan θ = [[1.175|2.50]]<br>θ = 25.17°<br>d = [[1|4.00 × 10⁵]]<br>d = 2.50 × 10⁻⁶ m<br>nλ = d sin θ<br>2 × λ = 2.50 × 10⁻⁶ × sin 25.17°<br>λ = [[2.50 × 10⁻⁶ × 0.4253|2]]<br>λ = 5.32 × 10⁻⁷ m<br>λ = 532 nm'}
  ]});
  body.appendChild(mk('p','sub','(c) 3 marks'));
  createCalc({host:body,questions:[
    {q:'Calculate the missing reading: the distance between the two third-order maxima.',unit:'m',answer:4.15,working:'λ = 5.32 × 10⁻⁷ m<br>d = 2.50 × 10⁻⁶ m<br>n = 3<br>D = 2.50 m<br>distance = ?||nλ = d sin θ<br>sin θ = [[3 × 5.32 × 10⁻⁷|2.50 × 10⁻⁶]]<br>sin θ = 0.6384<br>θ = 39.67°<br>tan θ = [[x|D]]<br>x = D tan θ<br>x = 2.50 × tan 39.67°<br>x = 2.073 m<br>distance = 2 × 2.073<br>distance = 4.15 m'}
  ]});
  examPart(body,'(d) 2 marks','Explain why Meera measures the distance between the two second-order maxima, and not the distance from the central maximum to one of them.',[
    'Measuring from the maximum on one side of the central maximum to the maximum of the same order on the other side doubles the distance measured, which decreases its percentage uncertainty (the uncertainty of the rule is the same).',
    'She does not need to judge where the centre of the central maximum is, and halving allows for a pattern that is not quite symmetrical.'
  ]);
  examPart(body,'(e) 2 marks','Show that this grating cannot give a fifth-order maximum with this laser.',[
    'Use nλ = d sin θ with θ = 90° (sin θ = 1, its largest value): n<sub>max</sub> = [[d|λ]] = [[2.50 × 10⁻⁶|5.32 × 10⁻⁷]] = 4.70.',
    'n must be a whole number, so the highest order is the fourth: a fifth order would need sin θ = 1.06, which is not possible.'
  ]);
  examPart(body,'(f) 6 marks','Describe how Meera could determine the wavelength of the laser light as accurately as possible. Include one safety precaution.',[
    'Set up the grating so that the laser beam meets it at right angles, with the screen (wall) several metres away; measure the perpendicular distance D between the grating and the screen with a tape measure.',
    'For each order, measure the distance between the two maxima on either side of the centre and halve it to get x.',
    'Find θ for each order from tan θ = x/D, and work out sin θ.',
    'Find d, the distance between adjacent slits, from 1 divided by the number of lines per metre.',
    'Plot sin θ against n and draw a line of best fit: the gradient is [[λ|d]], so λ = gradient × d (or calculate λ = [[d sin θ|n]] for each order and take the mean).',
    'Safety: direct the laser away from people’s eyes, stand behind the laser, and avoid directing it at reflective surfaces.'
  ]);
}
