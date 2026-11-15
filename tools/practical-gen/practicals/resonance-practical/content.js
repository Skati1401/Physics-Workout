/* IAL CP16 Determine the value of an unknown mass using the resonant frequencies of the oscillation of known masses
   (spec point 149, with 144, 145, 148, 151, 152). Built on the CP15 model (gamma-absorption), 15 Nov 2026 (TODO 5q).
   T = 2π√(m/k) and f₀ = 1/T give f₀ = (√k/2π) × 1/√m, so f₀ against 1/√m is a straight line through the origin with
   gradient √k/2π; the unknown mass is read off the line at its own f₀.
   The Do the Experiment tab frames animations/oscillations.html?show=measure, whose fixed readings must match
   OS_M, OS_F and OS_FX below (MEAS_M, MEAS_F and MEAS_FX in the animation; tools/CORE-PRACTICALS.md, "Measure modes").
   Wording checked 15 Nov 2026 against the IAL mark schemes (from the IAL Past Paper Index, CP16 and points 145, 148, 151, 152):
   - finding the resonant frequency: WPH16 Oct 2021 Q3(a) "adjust the signal generator to find the maximum amplitude";
     WPH16A Jun 2026 Q2(b) "vary the frequency gradually until the maximum … or repeat the process of finding the maximum";
     WPH16 Jan 2024 Q1(a) "allow the oscillations to settle", "repeat the measurement and calculate a mean".
   - amplitude: WPH16 Oct 2024 Q2(a)(iii), Jun 2025 Q4(a)(ii), Oct 2025 Q1(a)(i) "use a small (initial) displacement".
     No mark scheme names keeping the vibration generator's amplitude the same: the page says it as a fair-test step only.
   - improving the accuracy: WPH16 Jan 2024 Q1(b)(iii) "not enough readings around the maximum, so the position of the
     peak is uncertain"; WPH16A Jan 2026 Q1(b) "take more readings near the peak, or at smaller increments";
     WPH16 Jan 2024 Q1(c) "data loggers have a high sampling rate, so less uncertainty in the amplitude";
     WPH16 Jun 2026 Q1(c) "not enough data points, range too small, so an accurate best-fit line cannot be drawn".
   - the gradient method: WPH15 Jun 2021 Q17(b)(ii) (f² against 1/m, "compare with y = mx + c", gradient k/4π², large
     triangle); WPH16A Jun 2026 Q2(b) "plot a graph of f² against 1/C and determine the gradient"; WPH16 Jan 2024 Q1(b)(ii).
   - resonance: WPH15 Jan 2021 Q18(c)(ii), Jun 2023 Q19(b)(i), 9PH0/03 Jun 2023 Q6(c)(i) "driven at its natural frequency,
     maximum transfer of energy, maximum amplitude". Damping: WPH15 Oct 2022 Q10 (less damping: amplitude and f₀ increase).
   - mean and uncertainty of repeats: WPH16 Oct 2024 Q2(a), Jun 2025 Q4(a), Oct 2025 Q1(b) (half the range).
   The questions are original: the papers were used for the kinds of question and the mark-scheme wording only. */
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
function pairActs(a,b){const A=a.closest('.act'),B=b.closest('.act'),pr=mk('div','act-pair');A.parentNode.insertBefore(pr,A);pr.appendChild(A);pr.appendChild(B);}
// a square root with a bar over what it covers (as RT() in the animation); no ÷ anywhere
const RT=s=>'<span class="rtw">√<span class="rt">'+s+'</span></span>';
const ISM='1/'+RT('m');   // 1/√m in running text
const g3=v=>String(+(+v).toPrecision(3)), g4=v=>String(+(+v).toPrecision(4));
const PI2='4π²';

/* ================= 1. OVERVIEW ================= */
{
  const body=act('overview','Fill in the blanks','The practical in one passage','Drag a word into each gap, or tap a word and then tap a gap. Some words are not needed.');
  const parts=[
    'A mass hangs on a spring below a vibration generator, which is driven by a signal generator. The mass is made to do a ',['b1','forced'],
    ' oscillation, at the frequency of the signal generator. The frequency is changed gradually, letting the oscillation settle each time, until the ',['b2','amplitude'],
    ' of the mass is a maximum. The driving frequency is then equal to the ',['b3','natural'],' frequency of the mass on the spring: this is ',['b4','resonance'],
    ', and there is a maximum transfer of ',['b5','energy'],' from the vibration generator to the mass. This resonant frequency, f₀, is found for several known masses. Since T = 2π'+RT('[[m|k]]')+' and f₀ = [[1|T]], f₀ is proportional to ',['b6',ISM],
    ', so a graph of f₀ against '+ISM+' is a straight line through the ',['b7','origin'],'. The unknown mass is put on the spring, its own f₀ is found, and its '+ISM+' is read off the line. With more ',['b8','damping'],
    ', the peak would be lower and broader.'
  ];
  const cloze=mk('div','cloze'),slots=[],chips=[];
  parts.forEach(p=>{
    if(typeof p==='string')cloze.insertAdjacentHTML('beforeend',FR(p));
    else{const s=mk('span','blank');cloze.appendChild(s);slots.push({id:p[0],el:s,answer:p[1]});chips.push({id:'c-'+p[0],text:p[1]});}
  });
  ['free','period',RT('m'),'momentum'].forEach((t,i)=>chips.push({id:'d'+i,text:t}));
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
    {id:'a',text:'Clamp the vibration generator above the bench, hang the spring from it with a known mass on the hanger, and connect it to the signal generator.'},
    {id:'b',text:'Set the signal generator’s output so the displacement stays small, and keep that setting for every mass.'},
    {id:'c',text:'Starting well below resonance, increase the frequency gradually, letting the oscillation settle after each change.'},
    {id:'d',text:'Near the peak, change the frequency in smaller steps, and read the frequency at which the amplitude is a maximum.'},
    {id:'e',text:'Repeat the process of finding the maximum, coming down from above as well, and calculate the mean resonant frequency, f₀.'},
    {id:'f',text:'Do the same for at least five known masses, and then for the unknown mass.'},
    {id:'g',text:'Plot f₀ against '+ISM+', draw the line of best fit, and read the unknown mass’s '+ISM+' off the line at its own f₀.'}
  ],constraints:[['a','b'],['a','c'],['b','c'],['c','d'],['d','e'],['e','f'],['f','g']],
  why:'The setting of the signal generator is fixed before any frequency is judged. For each mass the frequency is brought up gradually, then in smaller steps near the peak, and the maximum is found more than once before the mass is changed. The graph needs every known mass first.'});
}
{
  const body=act('method','Match','What each piece of equipment is for','Pair each piece of equipment with its job. Drag one card onto the other, or tap one card and then the other.');
  createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'s',l:'Signal generator',r:'Sets the driving frequency and shows it on its display'},
    {id:'v',l:'Vibration generator',r:'Moves the top of the spring up and down at the driving frequency'},
    {id:'k',l:'Spring',r:'With the mass, sets the natural frequency of the system'},
    {id:'m',l:'Hanger and slotted masses',r:'Change the mass on the spring in known steps'},
    {id:'r',l:'Pointer and vertical rule',r:'Show how far the mass moves, so the largest amplitude can be judged'},
    {id:'c',l:'Clamp stand, clamped to the bench',r:'Holds the vibration generator still, so the stand itself cannot topple'}
  ]});
}

/* ================= DO THE EXPERIMENT ================= */
// The student turns the dial in the animation's measure mode (?show=measure) until the amplitude is largest, and writes down f₀.
// OS_M, OS_F and OS_FX must match MEAS_M, MEAS_F and MEAS_FX in animations/oscillations.html.
const OS_M=[100,150,200,250,400];                 // the known masses, g
const OS_F=[2.52,2.06,1.78,1.60,1.26];            // their resonant frequencies, Hz
const OS_FX=1.40;                                 // mass X (0.325 kg, never shown)
const OS_KG=OS_M.map(g=>g/1000), OS_U=OS_KG.map(m=>1/Math.sqrt(m));   // 1/√m: 3.162, 2.582, 2.236, 2.000, 1.581 kg⁻½
// f₀ within one step of the dial (± 0.02 Hz) is accepted: near the peak the amplitude changes by only about 8% a step.
const OS_TOL=0.02;
let osTable=null,osPlotRows=()=>{};
{
  act('do','Your turn','Take your own readings','1. Choose the 100 g mass and press Switch on. 2. Turn the frequency up from about 2 Hz, in steps of 0.1 Hz, then 0.02 Hz near the peak, letting the oscillation settle each time. Check the peak again coming down from above. 3. The frequency at which the band on the rule is widest is f₀: write it in the table. Do every mass, then mass X.');
}
frameAct('do','animations/oscillations.html','measure','Resonance experiment: turn the signal generator until the amplitude is largest','oscillations',false);
{
  const body=act('do','Calculate','Your results table','Give m in kg to 3 decimal places, '+ISM+' to 3 significant figures, and f₀ as the signal generator shows it, to 0.02 Hz. Press Check.');
  const wrap=mk('div','table-scroll');body.appendChild(wrap);
  const cell=(c,k,lab)=>'<td><input class="calc-num-input" data-c="'+c+'" data-k="'+k+'" inputmode="decimal" autocomplete="off" aria-label="'+lab+'"></td>';
  wrap.innerHTML='<table class="units res-tbl ga-tbl os-tbl"><thead><tr><th>Mass</th><th>m (kg)</th><th>'+ISM+' (kg⁻½)</th><th>f₀ (Hz)</th></tr></thead><tbody>'+
    OS_M.map((g,k)=>'<tr><td class="given">'+g+' g</td>'+cell('m',k,'Mass in kilograms, '+g+' g mass')+cell('u',k,'1 over root m, '+g+' g mass')+cell('f',k,'Resonant frequency, '+g+' g mass')+'</tr>').join('')+
    '<tr><td class="given">Mass X</td><td class="na">?</td><td class="na">from the line</td>'+cell('f',5,'Resonant frequency, mass X')+'</tr></tbody></table>';
  const inp=(c,k)=>$('input[data-c="'+c+'"][data-k="'+k+'"]',wrap), all=()=>$$('input',wrap);
  const val=e=>{const t=e.value.trim().replace(/[−–]/g,'-').replace(',','.');return t===''||!/^-?(\d+\.?\d*|\.\d+)$/.test(t)?NaN:parseFloat(t);};
  const want=(c,k)=>c==='m'?[OS_KG[k],0.0005]:c==='u'?[OS_U[k],0.005]:[k<5?OS_F[k]:OS_FX,OS_TOL];
  const show=(c,k)=>c==='m'?OS_KG[k].toFixed(3):c==='u'?OS_U[k].toPrecision(3):(k<5?OS_F[k]:OS_FX).toFixed(2);
  const b=bar(body,[{label:'Check table',primary:true,fn:check},{label:'Clear',fn:reset}]);
  const ans=answerBtn(b,()=>{
    all().forEach(e=>{if(e.disabled)return;e.value=show(e.dataset.c,+e.dataset.k);e.disabled=true;e.classList.add('is-shown');e.classList.remove('is-wrong');});
    b.say('Answers shown (dashed). Now plot f₀ against 1/√m below.','');osPlotRows();
  });
  function check(){
    let ok=0,bad=0,blank=0,near=0;
    all().forEach(e=>{
      if(e.disabled){ok++;return;}
      if(e.value.trim()===''){blank++;return;}
      const v=val(e),c=e.dataset.c,k=+e.dataset.k,w=want(c,k);
      if(isFinite(v)&&Math.abs(v-w[0])<=w[1]+1e-9){e.disabled=true;e.classList.remove('is-wrong');e.classList.add('pop');ok++;if(c==='f'&&Math.abs(v-w[0])>0.005)near++;}
      else{bad++;e.classList.add('is-wrong');}
    });
    const n=all().length;
    const nearMsg=near?' One step of the dial either side of the peak is accepted; '+(near===1?'one of your':near+' of your')+' f₀ values is a step away from the largest amplitude.':'';
    if(ok===n){b.say('All correct.'+nearMsg+' Now plot f₀ against 1/√m.','good');celebrate(b.msg);ans.off();}
    else{b.say(ok+' of '+n+' correct'+(blank?', '+blank+' left blank':'')+'.'+(bad?' m in kg: 100 g = 0.100 kg. 1/√m: take the square root of m in kg, then 1 over it. f₀: the frequency on the display when the band on the rule is widest.':'')+nearMsg,bad?'bad':'');ans.on();}
    osPlotRows();
  }
  // Show answer is always there for this table (as on CP15), so students can skip it and go on to the plot
  function reset(){all().forEach(e=>{e.value='';e.disabled=false;e.classList.remove('is-wrong','is-shown','pop');});ans.on();b.say('','');osPlotRows();}
  all().forEach(e=>e.addEventListener('input',()=>e.classList.remove('is-wrong')));
  ans.on();
  const got=(c,k)=>{const e=inp(c,k);return e.value.trim()===''||!e.disabled?null:e.value.trim();};
  osTable={u:k=>got('u',k),f:k=>got('f',k)};
  track(body,{reset:reset,
    getState:()=>({v:all().map(e=>e.value),ok:all().map(e=>e.disabled),sh:all().map(e=>e.classList.contains('is-shown'))}),
    setState:s=>{reset();all().forEach((e,i)=>{if(!s||!s.v||typeof s.v[i]!=='string')return;e.value=s.v[i];if(s.ok&&s.ok[i]){e.disabled=true;if(s.sh&&s.sh[i])e.classList.add('is-shown');}});if(all().every(e=>e.disabled)){b.say('All correct. Now plot f₀ against 1/√m.','good');ans.off();}osPlotRows();},
    isDone:()=>all().every(e=>e.disabled)});
}
{
  // the same steps as the animation's Experiment working (TODO 5q hand-off note)
  const body=act('do','Explain','Why plot f₀ against 1/√m?','A graph of f₀ against m would be a curve. Start from T = 2π'+RT('[[m|k]]')+', change T to f₀, and separate the mass from the constants:');
  body.insertAdjacentHTML('beforeend',FR(
    '<div class="ln-steps"><span>T</span><span>=</span><span>2π'+RT('[[m|k]]')+'</span>'+
    '<span>f₀</span><span>=</span><span>[[1|T]]</span>'+
    '<span>f₀</span><span>=</span><span>[[1|2π]]'+RT('[[k|m]]')+'</span>'+
    '<span>f₀</span><span>=</span><span>[['+RT('k')+'|2π]] × [[1|'+RT('m')+']]</span></div>'+
    '<p class="act-intro">In the order of y = mx + c:</p>'+
    '<div class="ln-match"><span>f₀</span><span>=</span><span>[['+RT('k')+'|2π]]</span><span>[[1|'+RT('m')+']]</span><span>+</span><span>0</span>'+
    '<span>y</span><span>=</span><span>m</span><span>x</span><span>+</span><span>c</span></div>'+
    '<p class="act-intro">So f₀ against '+ISM+' is a straight line through the origin, with gradient = [['+RT('k')+'|2π]], so k = 4π² × gradient². The line holds every known mass, so the unknown mass is read off it at its own f₀. Using the line of five masses, not one reading, averages out the error in judging each peak.</p>'));
}
{
  const body=act('do','Plot','Plot your results','Plot f₀ against 1/√m for the five known masses, as small crosses. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');
  // 1/√m to 3 s.f. and f₀ are all even hundredths, so the 0.02 snap holds every point; tol 0.04 accepts a cross within
  // less than half a small square (and an f₀ one dial step out, which the table accepts)
  createPlot({host:body,next:' Now find k and mass X from the line of best fit below.',
    points:OS_M.map((g,k)=>({x:+OS_U[k].toPrecision(3),y:OS_F[k]})),
    rowText:p=>rowLab(OS_F.indexOf(p.y)),
    graph:{xMin:0,xMax:3.5,yMin:0,yMax:3.0,xTicks:[0,0.5,1,1.5,2,2.5,3,3.5],yTicks:[0,0.5,1,1.5,2,2.5,3],minor:[0.1,0.1],snap:[0.02,0.02],tol:[0.04,0.04],xLabel:'1/√m (kg⁻½)',yLabel:'f₀ (Hz)',W:560,H:400}});
  function rowLab(k){const u=osTable&&osTable.u(k),f=osTable&&osTable.f(k);return OS_M[k]+' g: '+(u?'1/√m = '+u:'your 1/√m')+', '+(f?'f₀ = '+f+' Hz':'your f₀');}
  // the animation and the results table side by side, as on CP15
  {const fr=$('#panel-do .anim-wrap'),tb=$('#panel-do .os-tbl').closest('.act'),yt=$('#panel-do .act[data-title="Take your own readings"]');
   if(fr&&tb){const sp=mk('div','hk-split'),left=mk('div','ga-left');fr.parentNode.insertBefore(sp,fr);sp.appendChild(left);if(yt)left.appendChild(yt);left.appendChild(fr);sp.appendChild(tb);}}
  osPlotRows=()=>{$$('.plot-row',body).forEach((li,k)=>{const s=li.firstElementChild;if(s)s.textContent=rowLab(k);});};
  osPlotRows();
}
{
  const body=act('do','Calculate','k and mass X from your line','A good line of best fit through your points passes through the origin and (3.00, 2.39). Mass X resonates at 1.40 Hz. Read nothing else off the graph.');
  createCalc({host:body,questions:[
    {q:'What is the gradient of the line?',unit:'Hz kg½',answer:0.797,working:'first point = (0, 0)<br>second point = (3.00, 2.39)<br>gradient = ?||gradient = [[change in f₀|change in 1/√m]]<br>gradient = [[2.39 − 0|3.00 − 0]]<br>gradient = 0.797 Hz kg<sup>½</sup>'},
    {q:'What is the stiffness, k, of the spring?',unit:'N m⁻¹',answer:25.1,working:'gradient = 0.7967 Hz kg<sup>½</sup><br>k = ?||gradient = [['+RT('k')+'|2π]]<br>0.7967 = [['+RT('k')+'|2π]]<br>'+RT('k')+' = 2π × 0.7967<br>'+RT('k')+' = 5.006<br>k = 5.006²<br>k = 25.1 N m⁻¹'},
    {q:'From the line, what is 1/√m for mass X?',unit:'kg⁻½',answer:1.757,working:'f₀ = 1.40 Hz<br>gradient = 0.7967 Hz kg<sup>½</sup><br>1/√m = ?||f₀ = gradient × [[1|'+RT('m')+']]<br>1.40 = 0.7967 × [[1|'+RT('m')+']]<br>[[1|'+RT('m')+']] = [[1.40|0.7967]]<br>[[1|'+RT('m')+']] = 1.757 kg<sup>−½</sup>'},
    {q:'What is the mass of X?',unit:'kg',answer:0.324,working:'1/√m = 1.757 kg<sup>−½</sup><br>m = ?||[[1|'+RT('m')+']] = 1.757<br>'+RT('m')+' = [[1|1.757]]<br>'+RT('m')+' = 0.5691<br>m = 0.5691²<br>m = 0.324 kg'}
  ]});
}

/* ================= WATCH: the readings taken for you ================= */
{
  act('experiment','Your turn','Watch the readings','Press Sweep the frequency: the signal generator is stepped 0.1 Hz at a time, then every 0.02 Hz near the peak, and the amplitude is plotted at each frequency. Why are the extra readings taken near the peak? Do all five known masses, then mass X: the second graph is f₀ against 1/√m. What value of k does its gradient give, and what is the mass of X?');
}
frameAct('experiment','animations/oscillations.html','exp','Resonance animation: a mass on a spring driven by a vibration generator, with graphs of amplitude against frequency and of f₀ against 1/√m','oscillations',false);

/* ================= 5. ANALYSIS ================= */
// A resonance curve for a 0.313 kg mass on a 40 N m⁻¹ spring (f₀ = 1.80 Hz), heavily damped so a few readings show its shape:
// A = Y ω₀² / √((ω₀² − ω²)² + (γω)²), Y = 2.0 mm, γ = 2.5 s⁻¹. Readings every 0.2 Hz from 1.0 to 3.0 Hz.
const AN_K=40, AN_F0=1.80, AN_Y=2.0, AN_G=2.5;
function anA(f){const w0=2*Math.PI*AN_F0,w=2*Math.PI*f;return AN_Y*w0*w0/Math.sqrt(Math.pow(w0*w0-w*w,2)+Math.pow(AN_G*w,2));}
{
  const body=act('graphs','Calculate','A resonance curve','Jordan drives a mass on a spring of stiffness 40 N m⁻¹ and measures its amplitude every 0.2 Hz. The graph shows his readings and his curve of best fit.');
  const split=mk('div','graph-split');body.appendChild(split);
  const G={xMin:1.0,xMax:3.0,yMin:0,yMax:10,xTicks:[1.0,1.2,1.4,1.6,1.8,2.0,2.2,2.4,2.6,2.8,3.0],yTicks:[0,2,4,6,8,10],xLabel:'f (Hz)',yLabel:'A (mm)',W:560,H:340};
  const curve=[];for(let i=0;i<=200;i++){const f=1+i/100;curve.push([f,anA(f)]);}
  const g0=lineGraph(Object.assign({points:[[1,0]]},G));
  let crosses='';for(let i=0;i<=10;i++){const f=1+i/5,cx=g0.gx(f),cy=g0.gy(anA(f));crosses+='<path d="M'+(cx-5)+','+(cy-5)+' L'+(cx+5)+','+(cy+5)+' M'+(cx+5)+','+(cy-5)+' L'+(cx-5)+','+(cy+5)+'" stroke="var(--ink)" stroke-width="2"/>';}
  split.appendChild(mk('div','graph-box',lineGraph(Object.assign({label:'Amplitude against driving frequency: readings every 0.2 Hz and a curve rising to a peak of about 9 mm at 1.8 Hz, then falling',segments:[{pts:curve}],extra:crosses},G)).svg));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'What is the resonant frequency, f₀?',unit:'Hz',answer:1.8,working:'Read the frequency at the top of the curve.<br>f₀ = 1.8 Hz'},
    {q:'Calculate the mass on the spring.',unit:'kg',answer:0.313,working:'f₀ = 1.8 Hz<br>k = 40 N m⁻¹<br>m = ?||T = [[1|f₀]]<br>T = [[1|1.8]]<br>T = 0.5556 s<br>T = 2π'+RT('[[m|k]]')+'<br>0.5556 = 2π'+RT('[[m|40]]')+'<br>[[0.5556|2π]] = '+RT('[[m|40]]')+'<br>0.08842 = '+RT('[[m|40]]')+'<br>0.007818 = [[m|40]]<br>m = 0.007818 × 40<br>m = 0.313 kg',
     hints:['T = [[1|f₀]].','Then put T and k into T = 2π'+RT('[[m|k]]')+', and square both sides to get rid of the root.']}
  ]});
}
{
  const b1=act('graphs','Multiple choice','Is f₀ accurate?','Look at Jordan’s readings near the top of the curve.');
  createPredict({host:b1,q:'Why might Jordan’s value of f₀ not be accurate?',options:[
    {text:'There are not enough readings around the maximum',correct:true},
    {text:'The readings are not repeated at each frequency',why:'Repeats would help with each amplitude, but the problem here is where the peak is: with readings 0.2 Hz apart, the top of the curve could be anywhere between 1.6 and 2.0 Hz.'},
    {text:'The readings do not start from a frequency of zero',why:'Readings far below resonance tell you nothing about where the peak is. The readings that matter are the ones near it.'}
  ],explain:'There are only three readings near the top, 0.2 Hz apart, so the best fit curve, and the position of the peak, is uncertain. Take more readings near the peak, at smaller increments of frequency (as the animation does every 0.02 Hz).'});
  const b2=act('graphs','Multiple choice','More damping','Jordan fixes a large card disc under the mass, so the air damps it more, and repeats his readings.');
  createPredict({host:b2,q:'How does his new curve compare with the old one?',options:[
    {text:'A lower, broader peak, at a slightly lower frequency',correct:true},
    {text:'A higher, sharper peak, at exactly the same frequency',why:'That is what less damping does. More damping removes energy faster, so the amplitude cannot build up as much.'},
    {text:'The same height of peak, at a much lower frequency',why:'Damping does not change the mass or the stiffness much, so the peak stays near the natural frequency; it is the height of the peak that falls.'}
  ],explain:'More damping means more energy is dissipated each cycle, so the maximum amplitude is smaller and the peak is broader. The resonant frequency falls slightly. With less damping, both the peak amplitude and the resonant frequency increase.'});
  pairActs(b1,b2);
}

/* ================= 6. CALCULATE ================= */
// [object, how it is held, of stiffness k] for the questions
const OBJ=[['mass','hangs from a spring','spring'],['trolley','is held between two springs','pair of springs'],['model car body','rests on a suspension spring','spring']];
// question 1: the unknown is m or k (never T or f₀), found from f₀ = 1/T and T = 2π√(m/k)
const oq1=rnd=>{
  const kind=calcPick(rnd,['m','k']),o=calcPick(rnd,OBJ),k=calcPick(rnd,[20,24,30,36,40,45,50,60]),m=calcPick(rnd,[0.150,0.200,0.250,0.300,0.350,0.400,0.500]);
  const f=+(Math.sqrt(k/m)/(2*Math.PI)).toPrecision(3),T=1/f,r=T/(2*Math.PI),r2=r*r;
  const head=`f₀ = ${f} Hz<br>`,steps=`T = [[1|f₀]]<br>T = [[1|${f}]]<br>T = ${g4(T)} s<br>T = 2π${RT('[[m|k]]')}<br>`;
  if(kind==='m'){const a=r2*k;
    return {q:`A ${o[0]} ${o[1]}. The stiffness of the ${o[2]} is ${k} N m⁻¹. When it is driven, its amplitude is largest at ${f} Hz. Calculate the mass of the ${o[0]}.`,unit:'kg',answer:+a.toPrecision(3),
      working:`${head}k = ${k} N m⁻¹<br>m = ?||${steps}${g4(T)} = 2π${RT('[[m|'+k+']]')}<br>[[${g4(T)}|2π]] = ${RT('[[m|'+k+']]')}<br>${g4(r)} = ${RT('[[m|'+k+']]')}<br>${g4(r2)} = [[m|${k}]]<br>m = ${g4(r2)} × ${k}<br>m = ${g3(a)} kg`};}
  const a=m/r2;
  return {q:`A ${m.toFixed(3)} kg ${o[0]} ${o[1]}. When it is driven, its amplitude is largest at ${f} Hz. Calculate the stiffness, k, of the ${o[2]}.`,unit:'N m⁻¹',answer:+a.toPrecision(3),
    working:`${head}m = ${m.toFixed(3)} kg<br>k = ?||${steps}${g4(T)} = 2π${RT('[['+m.toFixed(3)+'|k]]')}<br>[[${g4(T)}|2π]] = ${RT('[['+m.toFixed(3)+'|k]]')}<br>${g4(r)} = ${RT('[['+m.toFixed(3)+'|k]]')}<br>${g4(r2)} = [[${m.toFixed(3)}|k]]<br>k = [[${m.toFixed(3)}|${g4(r2)}]]<br>k = ${g3(a)} N m⁻¹`};
};
// question 2, harder: grams to kg and two equations, or how f₀ changes with the mass (a root)
const oq2=rnd=>{
  const kind=calcPick(rnd,['f','ratio']);
  if(kind==='f'){
    const g=calcPick(rnd,[120,180,250,320,450,600]),k=calcPick(rnd,[18,25,32,40,48]),m=g/1000,q=m/k,s=Math.sqrt(q),T=2*Math.PI*s,f=1/T;
    return {q:`A ${g} g mass hangs from a spring of stiffness ${k} N m⁻¹ below a vibration generator. At what driving frequency will its amplitude be largest?`,unit:'Hz',answer:+f.toPrecision(3),
      hints:['Change the mass to kg.','Find the natural period from T = 2π'+RT('[[m|k]]')+'.','Resonance is at the natural frequency, f₀ = [[1|T]].'],
      working:`m = ${g} g = ${calcNum(m)} kg<br>k = ${k} N m⁻¹<br>f₀ = ?||T = 2π${RT('[[m|k]]')}<br>T = 2π${RT('[['+calcNum(m)+'|'+k+']]')}<br>T = 2π × ${g4(s)}<br>T = ${g4(T)} s<br>f₀ = [[1|T]]<br>f₀ = [[1|${g4(T)}]]<br>f₀ = ${g3(f)} Hz`};
  }
  const n=calcPick(rnd,[[2,'twice'],[3,'three times'],[4,'four times'],[9,'nine times']]),f1=calcPick(rnd,[1.20,1.50,1.80,2.40,3.00]),root=Math.sqrt(1/n[0]),f2=f1*root;
  return {q:`A mass on a spring resonates at ${f1.toFixed(2)} Hz. It is replaced by a mass ${n[1]} as large, on the same spring. Calculate the new resonant frequency.`,unit:'Hz',answer:+f2.toPrecision(3),
    hints:['f₀ = [[1|2π]]'+RT('[[k|m]]')+', and k does not change.','So f₀ is proportional to [[1|'+RT('m')+']]: write [[f₂|f₁]] in terms of the two masses.'],
    working:`f₁ = ${f1.toFixed(2)} Hz<br>m₂ = ${n[0]}m₁<br>f₂ = ?||f₀ = [[1|2π]]${RT('[[k|m]]')}<br>[[f₂|f₁]] = ${RT('[[m₁|m₂]]')}<br>[[f₂|${f1.toFixed(2)}]] = ${RT('[[1|'+n[0]+']]')}<br>[[f₂|${f1.toFixed(2)}]] = ${g4(root)}<br>f₂ = ${f1.toFixed(2)} × ${g4(root)}<br>f₂ = ${g3(f2)} Hz`};
};
// question 3: a gradient of f₀ against 1/√m gives k, or an unknown mass
const oq3=rnd=>{
  const kind=calcPick(rnd,['k','m']),k=calcPick(rnd,[16,20,25,30,36,45,50]),gr=+(Math.sqrt(k)/(2*Math.PI)).toPrecision(3);
  if(kind==='k'){const sk=2*Math.PI*gr,a=sk*sk;
    return {q:`A graph of f₀ against 1/√m for masses on a spring is a straight line through the origin, with a gradient of ${gr} Hz kg½. Calculate the stiffness of the spring.`,unit:'N m⁻¹',answer:+a.toPrecision(3),
      working:`gradient = ${gr} Hz kg<sup>½</sup><br>k = ?||gradient = [[${RT('k')}|2π]]<br>${gr} = [[${RT('k')}|2π]]<br>${RT('k')} = 2π × ${gr}<br>${RT('k')} = ${g4(sk)}<br>k = ${g4(sk)}²<br>k = ${g3(a)} N m⁻¹`};}
  const f=calcPick(rnd,[0.90,1.10,1.25,1.40,1.60,1.75]),u=f/gr,sm=1/u,a=sm*sm;
  return {q:`A graph of f₀ against 1/√m is a straight line through the origin, with a gradient of ${gr} Hz kg½. An unknown mass on the same spring resonates at ${f.toFixed(2)} Hz. Calculate the unknown mass.`,unit:'kg',answer:+a.toPrecision(3),
    working:`gradient = ${gr} Hz kg<sup>½</sup><br>f₀ = ${f.toFixed(2)} Hz<br>m = ?||f₀ = gradient × [[1|${RT('m')}]]<br>${f.toFixed(2)} = ${gr} × [[1|${RT('m')}]]<br>[[1|${RT('m')}]] = [[${f.toFixed(2)}|${gr}]]<br>[[1|${RT('m')}]] = ${g4(u)}<br>${RT('m')} = [[1|${g4(u)}]]<br>${RT('m')} = ${g4(sm)}<br>m = ${g4(sm)}²<br>m = ${g3(a)} kg`};
};
// question 4, harder: the gradient from two points first, on f₀² against 1/m (WPH15 Jun 2021 Q17) or f₀ against 1/√m
const oq4=rnd=>{
  const kind=calcPick(rnd,['sq','root']),k=calcPick(rnd,[18,22,26,30,35,42]);
  if(kind==='sq'){
    const x1=calcPick(rnd,[1.0,2.0]),x2=calcPick(rnd,[6.0,8.0,10.0]),gr=k/(4*Math.PI*Math.PI),y1=(gr*x1).toPrecision(3),y2=(gr*x2).toPrecision(3),gg=(y2-y1)/(x2-x1),a=4*Math.PI*Math.PI*gg;
    return {q:`Amelia plots f₀² against 1/m for masses on a spring. Her line of best fit passes through (${x1.toFixed(1)} kg⁻¹, ${y1} Hz²) and (${x2.toFixed(1)} kg⁻¹, ${y2} Hz²). Calculate the stiffness of the spring.`,unit:'N m⁻¹',answer:+a.toPrecision(3),
      hints:['Square f₀ = [[1|2π]]'+RT('[[k|m]]')+' to get f₀² = [[k|4π²]] × [[1|m]].','So the gradient of f₀² against [[1|m]] is [[k|4π²]].'],
      working:`first point = (${x1.toFixed(1)}, ${y1})<br>second point = (${x2.toFixed(1)}, ${y2})<br>k = ?||f₀² = [[k|4π²]] × [[1|m]]<br>gradient = [[k|4π²]]<br>gradient = [[${y2} − ${y1}|${x2.toFixed(1)} − ${x1.toFixed(1)}]]<br>gradient = ${g4(gg)} kg s⁻²<br>${g4(gg)} = [[k|4π²]]<br>k = 4π² × ${g4(gg)}<br>k = ${g3(a)} N m⁻¹`};
  }
  const x1=calcPick(rnd,[1.20,1.50]),x2=calcPick(rnd,[2.80,3.00,3.20]),gr=Math.sqrt(k)/(2*Math.PI),y1=(gr*x1).toPrecision(3),y2=(gr*x2).toPrecision(3),gg=(y2-y1)/(x2-x1),sk=2*Math.PI*gg,a=sk*sk;
  return {q:`Isaac plots f₀ against 1/√m for masses on a spring. His line of best fit passes through (${x1.toFixed(2)} kg⁻½, ${y1} Hz) and (${x2.toFixed(2)} kg⁻½, ${y2} Hz). Calculate the stiffness of the spring.`,unit:'N m⁻¹',answer:+a.toPrecision(3),
    hints:['Find the gradient from the two points.','gradient = [['+RT('k')+'|2π]], so '+RT('k')+' = 2π × gradient. Then square it.'],
    working:`first point = (${x1.toFixed(2)}, ${y1})<br>second point = (${x2.toFixed(2)}, ${y2})<br>k = ?||gradient = [[${y2} − ${y1}|${x2.toFixed(2)} − ${x1.toFixed(2)}]]<br>gradient = ${g4(gg)} Hz kg<sup>½</sup><br>gradient = [[${RT('k')}|2π]]<br>${g4(gg)} = [[${RT('k')}|2π]]<br>${RT('k')} = 2π × ${g4(gg)}<br>${RT('k')} = ${g4(sk)}<br>k = ${g4(sk)}²<br>k = ${g3(a)} N m⁻¹`};
};
{
  const body=act('calculate','Calculate','Resonant frequency and mass','At resonance the driving frequency equals the natural frequency: use T = 2π'+RT('[[m|k]]')+' and f₀ = [[1|T]]. Press New problems for another set.');
  createCalc({host:body,questions:[calcFix(oq1,2),calcFix(oq2,3)]});
}
{
  const body=act('calculate','Calculate','Using the straight-line graph','Use the gradient of the line of best fit. Press New problems for another set.');
  createCalc({host:body,questions:[calcFix(oq3,1),calcFix(oq4,4)]});
}

/* ================= 7. ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Better results or safer?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'Better results',hint:'A more accurate f₀ or a better line',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps people safe',hint:'Stops an accident',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Change the frequency gradually, and let the oscillation settle before judging the amplitude',cat:'a'},
    {id:'2',text:'Take more readings near the peak, at smaller increments of frequency',cat:'a'},
    {id:'3',text:'Repeat the process of finding the maximum amplitude and calculate a mean f₀',cat:'a'},
    {id:'4',text:'Use a motion sensor and data logger: its high sampling rate gives less uncertainty in the amplitude',cat:'a'},
    {id:'5',text:'Use at least five known masses over a wide range, so an accurate line of best fit can be drawn',cat:'a'},
    {id:'6',text:'Clamp the stand to the bench so it cannot topple',cat:'s'},
    {id:'7',text:'Keep the displacement small, so the slotted masses cannot jump off the hanger',cat:'s'},
    {id:'8',text:'Put a soft tray under the masses in case they fall',cat:'s'},
    {id:'9',text:'Wear eye protection in case the stretched spring snaps',cat:'s'}
  ]});
}
{
  const b1=act('accuracy','Multiple choice','The biggest uncertainty','The signal generator shows the frequency to 0.01 Hz. Near the peak, a change of 0.02 Hz changes the amplitude by less than a tenth.');
  createPredict({host:b1,q:'What limits the accuracy of f₀ most?',options:[
    {text:'Judging when the amplitude is largest',correct:true},
    {text:'The resolution of the frequency display',why:'Half the resolution, 0.005 Hz, in 1.60 Hz is about 0.3%. Judging the peak to within a step or two of 0.02 Hz is several times worse.'},
    {text:'The masses marked on the slotted masses',why:'Slotted masses are made to within about 1%, and the unknown mass is read off the line, so they are not the main problem.'}
  ],explain:'The amplitude changes very little near the peak, so it is hard to see where it is largest. That is why the process of finding the maximum is repeated (from below and from above) and a mean taken, readings are taken at smaller increments near the peak, or a data logger measures the amplitude.'});
  const b2=act('accuracy','Calculate','Repeated readings','Rose finds the maximum four times for one mass: 1.84, 1.80, 1.86 and 1.82 Hz.');
  createCalc({host:b2,questions:[
    {q:'Calculate the mean resonant frequency.',unit:'Hz',answer:1.83,working:'readings = 1.84, 1.80, 1.86, 1.82 Hz<br>mean f₀ = ?||mean f₀ = [[1.84 + 1.80 + 1.86 + 1.82|4]]<br>mean f₀ = [[7.32|4]]<br>mean f₀ = 1.83 Hz'},
    {q:'Calculate the percentage uncertainty in f₀, using half the range.',unit:'%',answer:1.6,working:'largest = 1.86 Hz<br>smallest = 1.80 Hz<br>mean f₀ = 1.83 Hz<br>percentage uncertainty = ?||half range = [[1.86 − 1.80|2]]<br>half range = 0.03 Hz<br>percentage uncertainty = [[0.03|1.83]] × 100<br>percentage uncertainty = 1.6%'}
  ]});
  pairActs(b1,b2);
}

/* ================= EXAM PRACTICE ================= */
{
  const body=act('exam','Exam style','Finding an unknown mass by resonance','Asma hangs known masses from a spring below a vibration generator. For each mass she finds the resonant frequency, f₀. One value of 1/√m is missing.');
  body.appendChild(resTable(['m (kg)','0.200','0.300','0.400','0.500','0.600'],[['f₀ (Hz)','2.24','1.84','1.60','1.42','1.30'],['1/√m (kg⁻½)','2.24','1.83',null,'1.41','1.29']]));
  examPart(body,'(a) 3 marks','Explain why the amplitude of the mass is largest at one particular driving frequency.',[
    'At that frequency the mass–spring system is driven (forced) at its natural frequency.',
    'There is a maximum transfer of energy (from the vibration generator to the mass–spring system).',
    'This is resonance, so the amplitude of oscillation is a maximum.'
  ]);
  body.appendChild(mk('p','sub','(b) 1 mark'));
  createCalc({host:body,questions:[
    {q:'Calculate the missing value of 1/√m for 0.400 kg.',unit:'kg⁻½',answer:1.58,working:'m = 0.400 kg<br>1/√m = ?||'+RT('m')+' = '+RT('0.400')+'<br>'+RT('m')+' = 0.6325<br>[[1|'+RT('m')+']] = [[1|0.6325]]<br>[[1|'+RT('m')+']] = 1.58 kg<sup>−½</sup>'}
  ]});
  examPart(body,'(c) 3 marks','The period of a mass on a spring is T = 2π'+RT('[[m|k]]')+'. Explain why Asma should plot f₀ against 1/√m, and how she can find k from her graph.',[
    'f₀ = [[1|T]], so f₀ = [[1|2π]]'+RT('[[k|m]]')+' = [['+RT('k')+'|2π]] × [[1|'+RT('m')+']].',
    'Compare with y = mx + c: f₀ against 1/√m is a straight line through the origin.',
    'The gradient = [['+RT('k')+'|2π]], so k = 4π² × gradient².'
  ]);
  body.appendChild(mk('p','sub','(d) 3 marks'));
  createCalc({host:body,questions:[
    {q:'Her line of best fit passes through the origin and (2.20, 2.21). Calculate k.',unit:'N m⁻¹',answer:39.8,working:'first point = (0, 0)<br>second point = (2.20, 2.21)<br>k = ?||gradient = [[2.21 − 0|2.20 − 0]]<br>gradient = 1.005 Hz kg<sup>½</sup><br>gradient = [['+RT('k')+'|2π]]<br>1.005 = [['+RT('k')+'|2π]]<br>'+RT('k')+' = 2π × 1.005<br>'+RT('k')+' = 6.312<br>k = 6.312²<br>k = 39.8 N m⁻¹'}
  ]});
  body.appendChild(mk('p','sub','(e) 2 marks'));
  createCalc({host:body,questions:[
    {q:'An unknown mass on the same spring resonates at 1.75 Hz. Use the line to calculate the unknown mass.',unit:'kg',answer:0.330,working:'f₀ = 1.75 Hz<br>gradient = 1.005 Hz kg<sup>½</sup><br>m = ?||f₀ = gradient × [[1|'+RT('m')+']]<br>1.75 = 1.005 × [[1|'+RT('m')+']]<br>[[1|'+RT('m')+']] = 1.741<br>'+RT('m')+' = [[1|1.741]]<br>'+RT('m')+' = 0.5743<br>m = 0.5743²<br>m = 0.330 kg'}
  ]});
  examPart(body,'(f) 6 marks','Describe how Asma should find an accurate value of f₀ for each mass, and how she should use her results to find the unknown mass. Include one safety precaution.',[
    'Keep the output of the signal generator the same for every mass, with a small displacement.',
    'Vary the frequency gradually until the amplitude is a maximum, allowing the oscillations to settle after each change (judge the amplitude against a pointer or marker on a rule, at eye level).',
    'Near the peak, take readings at smaller increments of frequency.',
    'Repeat the process of finding the maximum (from below and from above) and calculate a mean f₀.',
    'Do this for at least five known masses over a wide range, then for the unknown mass.',
    'Plot f₀ against 1/√m and draw the line of best fit; read the unknown mass’s 1/√m off the line at its f₀, and calculate m.',
    'Safety: clamp the stand to the bench so it cannot topple (or keep the displacement small so the masses cannot fall off).'
  ]);
  examPart(body,'(g) 2 marks','For her first mass, Asma took readings of amplitude every 0.2 Hz. Explain why her value of f₀ may not be accurate.',[
    'There are not enough readings around the maximum value (near the peak).',
    'So the best fit curve, and the position of the peak, is uncertain. (She should take more readings near the peak, at smaller increments.)'
  ]);
}
