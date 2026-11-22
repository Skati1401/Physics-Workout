/* IAL CP4 Determine the speed of sound in air using a 2-beam oscilloscope, signal generator, speaker and microphone
   (spec points 33, 34, 38, 39, 40). Built on the CP15 model (gamma-absorption). The signal generator gives the upper trace and
   the microphone the lower trace; each wavelength the microphone moves away brings the traces back into phase, so
   λ = distance moved / number of wavelengths, f = 1/T from the trace, and v = fλ. λ against 1/f is a straight line through
   the origin with gradient v.
   The Do the Experiment tab frames animations/speed-of-sound.html?show=measure&part=phase, whose fixed readings (MEAS_T,
   MEAS_X1, MEAS_X2) must match SS4_T, SS4_X1 and SS4_X2 below (tools/CORE-PRACTICALS.md, "Measure modes").
   Written 22 Nov 2026 (TODO 5k) from the IAL specification, the IAL Past Paper Index and these mark schemes:
   WPH12 Oct 2019 Q19(b) (in phase or antiphase, record the position, move until next in phase, distance moved, multiply by
   the frequency, or a graph of λ against 1/f with gradient v; (b)(iii) a longer wavelength has a smaller percentage
   uncertainty, or measure across several wavelengths), WPH12 June 2021 Q17 (T from the time base, multiply the wavelength by
   1/T; a larger amplitude means the microphone is closer), WPH12 June 2024 Q15(a) and (c) (at least 3 waves for T; the
   gradient of λ against 1/f), WPH13 Jan 2022 Q5(a) (divisions × time per division; choosing the time base).
   Papers from 2020 are reserved: the wording is used, never a question's scenario with its numbers. */
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
const SS4_ANIM='animations/speed-of-sound.html';

/* ================= 1. OVERVIEW ================= */
{
  const body=act('overview','Fill in the blanks','The practical in one passage','Drag a word into each gap, or tap a word and then tap a gap. Some words are not needed.');
  const parts=[
    'A signal generator drives a loudspeaker and is also connected to one input of a two-beam oscilloscope. A ',['b1','microphone'],
    ' is connected to the other input, so the screen shows two traces of the same ',['b2','frequency'],
    '. The sound takes time to reach the microphone, so there is usually a ',['b3','phase'],
    ' difference between the traces. As the microphone is moved away from the loudspeaker, its trace slides across the screen. Each time the microphone has moved one ',['b4','wavelength'],
    ', the two traces are in phase again. The ',['b5','period'],' is read from a trace: the number of divisions for one cycle multiplied by the ',['b6','time base'],
    '. Then f = 1/T and v = fλ. A graph of λ against 1/f is a straight line through the origin, and its ',['b7','gradient'],' is the speed of sound.'
  ];
  const cloze=mk('div','cloze'),slots=[],chips=[];
  parts.forEach(p=>{
    if(typeof p==='string')cloze.appendChild(document.createTextNode(p));
    else{const s=mk('span','blank');cloze.appendChild(s);slots.push({id:p[0],el:s,answer:p[1]});chips.push({id:'c-'+p[0],text:p[1]});}
  });
  ['amplitude','intercept','path','Y-gain'].forEach((t,i)=>chips.push({id:'d'+i,text:t}));
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
    {id:'a',text:'Connect the signal generator to the loudspeaker and to one input of the two-beam oscilloscope. Connect the microphone to the other input.'},
    {id:'b',text:'Switch on, set a frequency and adjust the time base until a few cycles of each trace fill the screen.'},
    {id:'c',text:'Find the period T from a trace: the divisions for several whole cycles × the time base, divided by the number of cycles.'},
    {id:'d',text:'Move the microphone until the two traces are in phase, and record its position on the metre rule.'},
    {id:'e',text:'Move the microphone gradually away from the loudspeaker, counting each time the traces are next in phase, and record the new position.'},
    {id:'f',text:'Calculate the distance moved by the microphone and divide it by the number of wavelengths counted, to find λ.'},
    {id:'g',text:'Multiply the wavelength by the frequency (f = 1/T) to find the speed. Repeat at other frequencies and plot λ against 1/f.'}
  ],constraints:[['a','b'],['b','c'],['b','d'],['d','e'],['e','f'],['c','g'],['f','g']],
  why:'The apparatus is connected and the traces are set up before anything is measured. The period can be found before or after the microphone is moved, but both T and λ are needed before the speed can be calculated.'});
}
{
  const body=act('method','Match','What each piece of equipment is for','Pair each piece of equipment with its job. Drag one card onto the other, or tap one card and then the other.');
  createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'s',l:'Signal generator',r:'Gives an alternating p.d. of the chosen frequency, to the loudspeaker and to one input'},
    {id:'l',l:'Loudspeaker',r:'Turns the alternating p.d. into a sound wave of the same frequency'},
    {id:'m',l:'Microphone',r:'Turns the sound wave at the place where it stands into an alternating p.d.'},
    {id:'o',l:'Two-beam oscilloscope',r:'Shows both signals against time, so that their phases can be compared'},
    {id:'t',l:'Time base',r:'Sets how much time each division across the screen stands for'},
    {id:'r',l:'Metre rule',r:'Measures how far the microphone has been moved'}
  ]});
}

/* ================= DO THE EXPERIMENT ================= */
// The student reads the period from the trace and the microphone's position from the rule in the animation's measure mode
// (?show=measure&part=phase). These must match MEAS_T, MEAS_X1 and MEAS_X2 in animations/speed-of-sound.html:
// the period at settings 1 to 6, the first place from the 10 cm mark where the traces are in phase, and the place five wavelengths on.
const SS4_T=[0.500,0.400,0.320,0.250,0.200,0.125];     // ms
const SS4_X1=[12.3,15.6,11.9,13.2,10.4,12.7];          // cm
const SS4_X2=[97.3,84.6,66.9,55.2,45.4,33.7];          // cm
const SS4_LAM=SS4_X1.map((x,k)=>+((SS4_X2[k]-x)/5).toFixed(1));   // 17.0, 13.8, 11.0, 8.4, 7.0, 4.2 cm
let ssTable=null,ssPlotRows=()=>{};
{
  act('do','Your turn','Take your own readings','1. Choose a setting of the signal generator. Find the period T of the upper trace: count the divisions for several whole cycles, multiply by the time base and divide by the number of cycles. 2. Starting from the 10 cm mark, move the microphone away until the traces are in phase, and read its position x₁ on the close-up of the rule. 3. Keep moving it away until the traces have come back into phase 5 more times, and read x₂. 4. The wavelength is one fifth of the distance moved.');
}
frameAct('do',SS4_ANIM,'measure&part=phase','Speed of sound experiment: choose a signal generator setting and a time base, move the microphone along the rule and compare the two traces on the oscilloscope','speed of sound',false);
{
  const body=act('do','Calculate','Your results table','Write T in milliseconds, each position as the rule shows it (to 0.1 cm) and λ to 0.1 cm. Press Check.');
  const wrap=mk('div','table-scroll');body.appendChild(wrap);
  const cell=(c,k,lab)=>'<td><input class="calc-num-input" data-c="'+c+'" data-k="'+k+'" inputmode="decimal" autocomplete="off" aria-label="'+lab+'"></td>';
  wrap.innerHTML='<table class="units res-tbl ga-tbl"><thead><tr><th>Setting</th><th>T (ms)</th><th>x₁ (cm)</th><th>x₂ (cm)</th><th>λ (cm)</th></tr></thead><tbody>'+
    SS4_T.map((t,k)=>'<tr><td class="given">'+(k+1)+'</td>'+cell('t',k,'Setting '+(k+1)+': period, milliseconds')+cell('a',k,'Setting '+(k+1)+': first position in phase, centimetres')+
      cell('b',k,'Setting '+(k+1)+': position five wavelengths further on, centimetres')+cell('l',k,'Setting '+(k+1)+': wavelength, centimetres')+'</tr>').join('')+'</tbody></table>';
  const inp=(c,k)=>$('input[data-c="'+c+'"][data-k="'+k+'"]',wrap), all=()=>$$('input',wrap);
  const val=e=>{const t=e.value.trim().replace(/[−–]/g,'-').replace(',','.');return t===''||!/^-?(\d+\.?\d*|\.\d+)$/.test(t)?NaN:parseFloat(t);};
  const want=(c,k)=>c==='t'?[SS4_T[k],0.003]:c==='a'?[SS4_X1[k],0.1]:c==='b'?[SS4_X2[k],0.1]:[SS4_LAM[k],0.05];
  const show=(c,k)=>c==='t'?SS4_T[k].toFixed(3):c==='a'?SS4_X1[k].toFixed(1):c==='b'?SS4_X2[k].toFixed(1):SS4_LAM[k].toFixed(1);
  const b=bar(body,[{label:'Check table',primary:true,fn:check},{label:'Clear',fn:reset}]);
  const ans=answerBtn(b,()=>{
    all().forEach(e=>{if(e.disabled)return;e.value=show(e.dataset.c,+e.dataset.k);e.disabled=true;e.classList.add('is-shown');e.classList.remove('is-wrong');});
    b.say('Answers shown (dashed). Now plot λ against 1/f below.','');ssPlotRows();
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
    if(ok===n){b.say('All correct. Now plot λ against 1/f.','good');celebrate(b.msg);ans.off();}
    else{b.say(ok+' of '+n+' correct'+(blank?', '+blank+' left blank':'')+'.'+(bad?' Check that T is in milliseconds and found from several whole cycles, that x₁ is the first place from the 10 cm mark where the traces are in phase, that x₂ is 5 wavelengths further on, and that λ is one fifth of the distance moved.':''),bad?'bad':'');ans.on();}
    ssPlotRows();
  }
  // Show answer is always there for this table (as on CP15), so students can skip it and go on to the plot
  function reset(){all().forEach(e=>{e.value='';e.disabled=false;e.classList.remove('is-wrong','is-shown','pop');});ans.on();b.say('','');ssPlotRows();}
  all().forEach(e=>e.addEventListener('input',()=>e.classList.remove('is-wrong')));
  ans.on();
  ssTable={v:(c,k)=>{const e=inp(c,k);return e.value.trim()===''||!e.disabled?null:e.value.trim();}};
  track(body,{reset:reset,
    getState:()=>({v:all().map(e=>e.value),ok:all().map(e=>e.disabled),sh:all().map(e=>e.classList.contains('is-shown'))}),
    setState:s=>{reset();all().forEach((e,i)=>{if(!s||!s.v||typeof s.v[i]!=='string')return;e.value=s.v[i];if(s.ok&&s.ok[i]){e.disabled=true;if(s.sh&&s.sh[i])e.classList.add('is-shown');}});if(all().every(e=>e.disabled)){b.say('All correct. Now plot λ against 1/f.','good');ans.off();}ssPlotRows();},
    isDone:()=>all().every(e=>e.disabled)});
}
{
  const body=act('do','Explain','Why plot λ against 1/f?','The wave equation links the speed, the frequency and the wavelength:');
  body.insertAdjacentHTML('beforeend',
    '<div class="ln-steps"><span>v</span><span>=</span><span>fλ</span>'+
    '<span>λ</span><span>=</span><span>'+FR('[[v|f]]')+'</span>'+
    '<span>λ</span><span>=</span><span>v × '+FR('[[1|f]]')+'</span></div>'+
    '<p class="act-intro">In the order of y = mx + c:</p>'+
    '<div class="ln-match"><span>λ</span><span>=</span><span>v</span><span>'+FR('[[1|f]]')+'</span><span>+</span><span>0</span>'+
    '<span>y</span><span>=</span><span>m</span><span>x</span><span>+</span><span>c</span></div>'+
    '<p class="act-intro">So λ against 1/f is a straight line through the origin, and its gradient is the speed of sound. The period T is 1/f, so the T you read from the oscilloscope is the value to plot on the x-axis.</p>');
}
{
  const body=act('do','Plot','Plot your results','Plot λ against 1/f (your T) from your table as small crosses. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');
  createPlot({host:body,next:' Now find the speed of sound from the line of best fit below.',
    points:SS4_T.map((t,k)=>({x:t,y:SS4_LAM[k]})),
    rowText:p=>'1/f = '+p.x.toFixed(3)+' ms, your λ',
    graph:{xMin:0,xMax:0.6,yMin:0,yMax:20,xTicks:[0,0.1,0.2,0.3,0.4,0.5,0.6],yTicks:[0,2,4,6,8,10,12,14,16,18,20],minor:[0.02,0.4],snap:[0.005,0.2],tol:[0.005,0.2],xLabel:'1/f (ms)',yLabel:'λ (cm)',W:560,H:420}});
  // the animation and the results table side by side, as on CP15
  {const fr=$('#panel-do .anim-wrap'),tb=$('#panel-do .ga-tbl').closest('.act'),yt=$('#panel-do .act[data-title="Take your own readings"]');
   if(fr&&tb){const sp=mk('div','hk-split'),left=mk('div','ga-left');fr.parentNode.insertBefore(sp,fr);sp.appendChild(left);if(yt)left.appendChild(yt);left.appendChild(fr);sp.appendChild(tb);}}
  ssPlotRows=()=>{$$('.plot-row',body).forEach((li,k)=>{const t=ssTable&&ssTable.v('t',k),l=ssTable&&ssTable.v('l',k),s=li.firstElementChild;if(s)s.textContent='1/f = '+(t||SS4_T[k].toFixed(3))+' ms, '+(l?'λ = '+l+' cm':'your λ');});};
  ssPlotRows();
}
{
  const body=act('do','Calculate','The speed of sound from your line','A good line of best fit through your points passes through the origin and (0.500, 17.1).');
  createCalc({host:body,questions:[
    {q:'What is the gradient of the line, in centimetres per millisecond?',unit:'cm ms⁻¹',answer:34.2,working:'first point = (0, 0)<br>second point = (0.500, 17.1)<br>gradient = ?||gradient = [[change in λ|change in 1/f]]<br>gradient = [[17.1 − 0|0.500 − 0]]<br>gradient = 34.2 cm ms⁻¹'},
    {q:'What is the speed of sound in air, in m s⁻¹?',unit:'m s⁻¹',answer:342,working:'gradient = 34.2 cm ms⁻¹<br>v = ?||v = gradient<br>v = [[34.2 × 10⁻² m|1 × 10⁻³ s]]<br>v = 342 m s⁻¹'},
    {q:'What is the frequency at setting 3, where T = 0.320 ms?',unit:'Hz',answer:3125,working:'T = 0.320 ms = 3.20 × 10⁻⁴ s<br>f = ?||f = [[1|T]]<br>f = [[1|3.20 × 10⁻⁴]]<br>f = 3125 Hz<br>f = 3130 Hz (3 significant figures)'}
  ]});
}

/* ================= SHOW: the readings taken for you ================= */
{
  act('experiment','Your turn','Watch the readings','Press Play: at each frequency the microphone is moved to the first place where the traces are in phase, and then on through five wavelengths. Watch the lower trace slide past the upper one. Then switch between the two graphs under the picture: which one is a straight line?');
}
frameAct('experiment',SS4_ANIM,'phase&run=auto','Speed of sound animation: a signal generator, loudspeaker, microphone and two-beam oscilloscope on a bench, with a table of readings and a graph of wavelength against frequency or against 1/f','speed of sound',false);
// the full-screen links open the page at the IAL level, on this method
$$('#panel-do .anim-open a, #panel-experiment .anim-open a').forEach(a=>{a.href=SS4_ANIM+'?level=ial';});

/* ================= 5. ANALYSIS ================= */
function lab(g0,t,x,y){return '<circle cx="'+g0.gx(x)+'" cy="'+g0.gy(y)+'" r="13" fill="var(--panel)" stroke="var(--ink)" stroke-width="2"/><text x="'+g0.gx(x)+'" y="'+(g0.gy(y)+5)+'" text-anchor="middle" font-size="14" fill="var(--ink)">'+t+'</text>';}
{
  const body=act('graphs','Calculate','Reading the oscilloscope','The trace shows the signal from a microphone. The time base is 0.5 ms per division. Read your answers off the trace.');
  const split=mk('div','graph-split');body.appendChild(split);
  const pts=[];for(let i=0;i<=200;i++){const x=i/20;pts.push([x,+(2+1.5*Math.sin(2*Math.PI*x/1.6)).toFixed(3)]);}
  split.appendChild(mk('div','graph-box',lineGraph({label:'An oscilloscope trace 10 divisions wide: a sine wave that completes 5 whole cycles in 8.0 divisions',
    segments:[{pts:pts}],xMin:0,xMax:10,yMin:0,yMax:4,xTicks:[0,1,2,3,4,5,6,7,8,9,10],yTicks:[0,1,2,3,4],xLabel:'divisions across the screen',yLabel:'divisions',W:560,H:300}).svg));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'What is the period of the sound, in milliseconds? Use as many whole cycles as you can.',unit:'ms',answer:0.8,working:'5 cycles = 8.0 divisions<br>time base = 0.5 ms per division<br>T = ?||time for 5 cycles = 8.0 × 0.5<br>time for 5 cycles = 4.0 ms<br>T = [[4.0|5]]<br>T = 0.80 ms'},
    {q:'What is the frequency of the sound?',unit:'Hz',answer:1250,working:'T = 0.80 ms = 8.0 × 10⁻⁴ s<br>f = ?||f = [[1|T]]<br>f = [[1|8.0 × 10⁻⁴]]<br>f = 1250 Hz'},
    {q:'With this sound, the microphone has to be moved 81.6 cm to bring the two traces back into phase 3 times. What is the speed of sound?',unit:'m s⁻¹',answer:340,working:'distance moved = 81.6 cm<br>number of wavelengths = 3<br>f = 1250 Hz<br>v = ?||λ = [[81.6|3]]<br>λ = 27.2 cm<br>λ = 0.272 m<br>v = fλ<br>v = 1250 × 0.272<br>v = 340 m s⁻¹'}
  ]});
}
{
  const GV={xMin:0,xMax:0.5,yMin:0,yMax:18,xTicks:[0,0.1,0.2,0.3,0.4,0.5],yTicks:[0,2,4,6,8,10,12,14,16,18],xLabel:'1/f (ms)',yLabel:'λ (cm)',W:560,H:360};
  const body=act('graphs','Calculate','Two gases','The experiment is done in air (line P) and then in a tube filled with a denser gas (line Q). The graph shows the wavelength against 1/f for each. Read your answers off the graph.');
  const split=mk('div','graph-split');body.appendChild(split);
  const g0=lineGraph(Object.assign({points:[[0,0]]},GV));
  split.appendChild(mk('div','graph-box',lineGraph(Object.assign({label:'Wavelength against 1 over f for two gases: line P passes through the origin and reaches 17.0 centimetres at 0.5 milliseconds; line Q passes through the origin and reaches 12.0 centimetres at 0.5 milliseconds',
    segments:[{pts:[[0,0],[0.5,17]]},{pts:[[0,0],[0.5,12]],cls:'g-line-b'}],
    extra:lab(g0,'P',0.33,11.2+1.6)+lab(g0,'Q',0.42,10.1-1.9)},GV)).svg));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'What is the speed of sound in air (line P)?',unit:'m s⁻¹',answer:340,working:'first point = (0, 0)<br>second point = (0.50, 17.0)<br>v = ?||gradient = [[17.0 − 0|0.50 − 0]]<br>gradient = 34.0 cm ms⁻¹<br>v = [[34.0 × 10⁻² m|1 × 10⁻³ s]]<br>v = 340 m s⁻¹'},
    {q:'What is the speed of sound in gas Q?',unit:'m s⁻¹',answer:240,working:'first point = (0, 0)<br>second point = (0.50, 12.0)<br>v = ?||gradient = [[12.0 − 0|0.50 − 0]]<br>gradient = 24.0 cm ms⁻¹<br>v = [[24.0 × 10⁻² m|1 × 10⁻³ s]]<br>v = 240 m s⁻¹'},
    {q:'What frequency has a wavelength of 6.0 cm in gas Q?',unit:'Hz',answer:4000,working:'λ = 6.0 cm on line Q<br>f = ?||from the graph, 1/f = 0.25 ms<br>1/f = 2.5 × 10⁻⁴ s<br>f = [[1|2.5 × 10⁻⁴]]<br>f = 4000 Hz'}
  ]});
}

/* ================= 6. CALCULATE ================= */
{
  const body=act('calculate','Calculate','Sound waves and the oscilloscope','Use v = fλ and f = 1/T. For a phase difference, the fraction of a whole cycle (2π radians) is the same as the fraction of a wavelength. Press New problems for another set.');
  createCalc({host:body,questions:[
    {q:'A loudspeaker gives a note of frequency 2.75 kHz. The speed of sound in air is 340 m s⁻¹. What is the wavelength of the sound, in centimetres?',unit:'cm',answer:12.4,
     working:'f = 2.75 kHz = 2750 Hz<br>v = 340 m s⁻¹<br>λ = ?||v = fλ<br>340 = 2750λ<br>λ = [[340|2750]]<br>λ = 0.1236 m<br>λ = 12.4 cm',
     hints:['Change kHz to Hz first.','v = fλ gives λ in metres: multiply by 100 for centimetres.'],
     make:rnd=>{const f=calcPick(rnd,[1.25,1.60,3.40,4.25,6.80]),lam=340/(f*1000);
       return {q:`A loudspeaker gives a note of frequency ${f.toFixed(2)} kHz. The speed of sound in air is 340 m s⁻¹. What is the wavelength of the sound, in centimetres?`,unit:'cm',answer:+(lam*100).toPrecision(3),
         hints:['Change kHz to Hz first.','v = fλ gives λ in metres: multiply by 100 for centimetres.'],
         working:`f = ${f.toFixed(2)} kHz = ${Math.round(f*1000)} Hz<br>v = 340 m s⁻¹<br>λ = ?||v = fλ<br>340 = ${Math.round(f*1000)}λ<br>λ = [[340|${Math.round(f*1000)}]]<br>λ = ${(+lam.toPrecision(4))} m<br>λ = ${g3(lam*100)} cm`};}},
    {q:'Sound of wavelength 0.160 m travels from a loudspeaker to a microphone. The microphone is moved 0.060 m further away. By how much does the phase difference between the two traces change, in radians?',unit:'rad',answer:2.36,
     working:'λ = 0.160 m<br>path difference = 0.060 m<br>Δφ = ?||[[Δφ|2π]] = [[path difference|λ]]<br>[[Δφ|2π]] = [[0.060|0.160]]<br>[[Δφ|2π]] = 0.375<br>Δφ = 0.375 × 2π<br>Δφ = 2.36 rad',
     hints:['Find what fraction of a wavelength the microphone moved.','A whole wavelength is a phase difference of 2π radians.'],
     make:rnd=>{const lam=calcPick(rnd,[0.080,0.120,0.200,0.240]),k=calcPick(rnd,[0.125,0.25,0.625,0.75]),dx=lam*k;
       return {q:`Sound of wavelength ${lam.toFixed(3)} m travels from a loudspeaker to a microphone. The microphone is moved ${dx.toFixed(3)} m further away. By how much does the phase difference between the two traces change, in radians?`,unit:'rad',answer:+(2*Math.PI*k).toPrecision(3),
         hints:['Find what fraction of a wavelength the microphone moved.','A whole wavelength is a phase difference of 2π radians.'],
         working:`λ = ${lam.toFixed(3)} m<br>path difference = ${dx.toFixed(3)} m<br>Δφ = ?||[[Δφ|2π]] = [[path difference|λ]]<br>[[Δφ|2π]] = [[${dx.toFixed(3)}|${lam.toFixed(3)}]]<br>[[Δφ|2π]] = ${k}<br>Δφ = ${k} × 2π<br>Δφ = ${g3(2*Math.PI*k)} rad`};}},
    {q:'An oscilloscope screen is 10 divisions wide. A student wants exactly 2 whole cycles of a 400 Hz note to fill the screen. What time base should she choose, in milliseconds per division?',unit:'ms per division',answer:0.5,
     working:'f = 400 Hz<br>2 cycles in 10 divisions<br>time base = ?||T = [[1|f]]<br>T = [[1|400]]<br>T = 2.5 × 10⁻³ s<br>T = 2.5 ms<br>time for 2 cycles = 2 × 2.5<br>time for 2 cycles = 5.0 ms<br>time base = [[5.0|10]]<br>time base = 0.50 ms per division',
     hints:['Find the period first, then the time for 2 cycles.','That time is spread over 10 divisions.']},
    {q:'A student moves the microphone through 10 wavelengths. The distance moved is 23.0 cm, with an uncertainty of 0.2 cm. What is the percentage uncertainty in the wavelength?',unit:'%',answer:0.87,
     working:'distance = 23.0 cm<br>uncertainty = 0.2 cm<br>percentage uncertainty = ?||percentage uncertainty = [[uncertainty|distance]] × 100<br>percentage uncertainty = [[0.2|23.0]] × 100<br>percentage uncertainty = 0.87%',
     hints:['The wavelength is the distance divided by 10, and so is its uncertainty: the percentage uncertainty is the same as for the distance.','Over one wavelength (2.3 cm) the same 0.2 cm would be 8.7%.']}
  ]});
}

/* ================= 7. ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Why each step is done','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'More accurate results',hint:'Cuts the uncertainty in T or λ',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps people safe',hint:'Hearing, and mains equipment',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Move the microphone through several wavelengths and divide, so the percentage uncertainty in λ is smaller',cat:'a'},
    {id:'2',text:'Use a lower frequency: the wavelength is longer, so its percentage uncertainty is smaller',cat:'a'},
    {id:'3',text:'Find T from at least 3 whole cycles on the screen, not from one',cat:'a'},
    {id:'4',text:'Choose a time base that spreads a few cycles across the whole screen',cat:'a'},
    {id:'5',text:'Use a faster time base to judge exactly when the peaks of the two traces line up',cat:'a'},
    {id:'6',text:'Read the rule at eye level, directly above the pointer on the microphone stand, to reduce parallax error',cat:'a'},
    {id:'7',text:'Repeat at several frequencies and find the speed from the gradient of the line of best fit',cat:'a'},
    {id:'8',text:'Keep the loudspeaker quiet, or wear ear protection: a loud note can damage hearing',cat:'s'},
    {id:'9',text:'Check the mains leads of the signal generator and the oscilloscope for damage before switching on',cat:'s'},
    {id:'10',text:'Keep the leads tidy and away from the edge of the bench, so the apparatus cannot be pulled off',cat:'s'}
  ]});
}

/* ================= EXAM PRACTICE ================= */
{
  const body=act('exam','Exam style','The speed of sound in a classroom','Mei finds the speed of sound in air with a signal generator, a loudspeaker, a microphone and a two-beam oscilloscope. The upper trace comes directly from the signal generator and the lower trace from the microphone. At each frequency she moves the microphone away from the loudspeaker until the traces have come back into phase 4 times, and records the distance moved.');
  body.appendChild(resTable(['Frequency (kHz)','1.50','2.00','3.00','4.00'],[['Distance moved (cm)','91.6','68.4','45.4',null]]));
  examPart(body,'(a) 3 marks','Explain why moving the microphone away from the loudspeaker changes the phase difference between the two traces.',[
    'The sound has further to travel, so it takes longer to reach the microphone.',
    'The lower trace is delayed (shifted along the time axis) compared with the trace from the signal generator, so the phase difference changes.',
    'When the microphone has moved one wavelength the delay is one period, so the traces are in phase again.'
  ]);
  body.appendChild(mk('p','sub','(b) 3 marks'));
  createCalc({host:body,questions:[
    {q:'Use the reading for 2.00 kHz to calculate the speed of sound in air.',unit:'m s⁻¹',answer:342,working:'f = 2.00 kHz = 2000 Hz<br>distance moved = 68.4 cm<br>number of wavelengths = 4<br>v = ?||λ = [[68.4|4]]<br>λ = 17.1 cm<br>λ = 0.171 m<br>v = fλ<br>v = 2000 × 0.171<br>v = 342 m s⁻¹'}
  ]});
  body.appendChild(mk('p','sub','(c) 2 marks'));
  createCalc({host:body,questions:[
    {q:'Calculate the missing reading: the distance moved at 4.00 kHz, in centimetres.',unit:'cm',answer:34.2,working:'v = 342 m s⁻¹<br>f = 4000 Hz<br>distance for 4 wavelengths = ?||v = fλ<br>342 = 4000λ<br>λ = [[342|4000]]<br>λ = 0.0855 m<br>λ = 8.55 cm<br>distance = 4 × 8.55<br>distance = 34.2 cm'}
  ]});
  examPart(body,'(d) 2 marks','The scale on the signal generator is not accurate. Describe how Mei finds an accurate value of the frequency from the oscilloscope.',[
    'Measure the time for several whole cycles (at least 3): the number of divisions × the time base, then divide by the number of cycles to find the period T.',
    'Use f = [[1|T]].'
  ]);
  examPart(body,'(e) 2 marks','Explain why Mei should plot λ against 1/f, and not λ against f.',[
    'λ = [[v|f]], so λ is inversely proportional to f: a graph of λ against f is a curve.',
    'λ against 1/f is a straight line through the origin whose gradient is v, so the speed comes from a line of best fit through all the readings.'
  ]);
  examPart(body,'(f) 6 marks','Describe how the apparatus is used to find the speed of sound in air at one frequency. Say how the result is made accurate, and include one safety precaution.',[
    'Connect the signal generator to the loudspeaker and to one input of the oscilloscope, and the microphone to the other input.',
    'Move the microphone until the two traces are in phase (or in antiphase), and record its position on the metre rule.',
    'Move the microphone gradually away until the traces are next in phase, and record the new position; the distance moved by the microphone is one wavelength.',
    'For accuracy, move it through several wavelengths and divide the distance moved by the number of wavelengths.',
    'Read the time period from the oscilloscope (divisions for several cycles × the time base) and multiply the wavelength by 1/T: v = fλ.',
    'Safety: keep the sound quiet (or wear ear protection), or check the mains leads before switching on.'
  ]);
  examPart(body,'(g) 3 marks','Tariq says the result would be more accurate at 10.0 kHz than at 2.00 kHz. Evaluate his suggestion, using a calculation. Take the speed of sound as 340 m s⁻¹.',[
    'λ = [[v|f]]: the wavelength is [[340|2000]] = 0.170 m (17.0 cm) at 2.00 kHz, and [[340|10 000]] = 0.0340 m (3.40 cm) at 10.0 kHz.',
    'The uncertainty in the distance is the same, so the percentage uncertainty is greater for the 3.40 cm wavelength: Tariq is not correct.',
    'Or: the percentage uncertainty is reduced if the measurement is taken across several wavelengths, so he is not necessarily wrong.'
  ]);
  examPart(body,'(h) 2 marks','Explain why the temperature of the room should stay the same during the experiment.',[
    'The speed of sound in air depends on the temperature of the air.',
    'If the temperature changed, the wavelength at a given frequency would change, so the readings would not lie on one straight line (they would not give a single value for the speed).'
  ]);
}
