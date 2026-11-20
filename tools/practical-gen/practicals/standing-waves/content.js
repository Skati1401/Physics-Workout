/* IAL CP5 Investigate the effects of length, tension and mass per unit length on the frequency of a vibrating string or wire
   (spec points 41, 42, 43). Built on the CP15 model (gamma-absorption): one loop means λ = 2L, so f = v/2L with v = √(T/μ), and
   f against 1/L is a straight line through the origin with gradient v/2.
   The Do the Experiment tab frames animations/standing-waves.html?show=measure, whose fixed readings must match SW_L and SW_F
   below (a 1.0 g/m string with 300 g hanging; round(v/2L) in the animation; tools/CORE-PRACTICALS.md, "Measure modes").
   Written 20 Nov 2026 (TODO 5l) from the IAL specification and the summaries in the IAL Past Paper Index (WPH13 June 2019 Q4;
   8PH0/02 June 2016 Q12, June 2019 Q11, June 2023 Q12; 9PH0/03 June 2022 Q13; 9PH0/02 Oct 2020 Q15, June 2022 Q18, June 2024 Q15).
   The wording has not yet been checked against the mark schemes themselves. */
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
const SW_ANIM='animations/standing-waves.html';

/* ================= 1. OVERVIEW ================= */
{
  const body=act('overview','Fill in the blanks','The practical in one passage','Drag a word into each gap, or tap a word and then tap a gap. Some words are not needed.');
  const parts=[
    'A vibration generator, driven by a signal generator, sends waves along a stretched string. They reflect at the far end, and the two waves travelling in opposite directions ',['b1','superpose'],
    '. At certain frequencies a ',['b2','standing wave'],' is seen, with points that never move called ',['b3','nodes'],
    '. At the lowest of these frequencies the string vibrates in one loop, so the wavelength is ',['b4','twice'],' the length L of the string. The speed of the waves is v = √(T/μ), where T is the ',['b5','tension'],
    ', set by the weight of the hanging masses, and μ is the ',['b6','mass per unit length'],' of the string. So f = v/2L, and a graph of f against ',['b7','1/L'],' is a straight line through the origin.'
  ];
  const cloze=mk('div','cloze'),slots=[],chips=[];
  parts.forEach(p=>{
    if(typeof p==='string')cloze.appendChild(document.createTextNode(p));
    else{const s=mk('span','blank');cloze.appendChild(s);slots.push({id:p[0],el:s,answer:p[1]});chips.push({id:'c-'+p[0],text:p[1]});}
  });
  ['antinodes','half','L','diffract'].forEach((t,i)=>chips.push({id:'d'+i,text:t}));
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
    {id:'a',text:'Fix one end of the string to the vibration generator and pass the other end over a bridge and a pulley to a mass hanger.'},
    {id:'b',text:'Hang a known mass on the string and record the tension, T = mg.'},
    {id:'c',text:'Measure the length L of the string between the vibration generator and the bridge with a metre rule.'},
    {id:'d',text:'Raise the frequency slowly from zero until the string vibrates in one loop of the largest amplitude, and record the frequency.'},
    {id:'e',text:'Move the bridge to change L and find the new frequency. Repeat for at least six lengths.'},
    {id:'f',text:'Plot f against 1/L and draw a line of best fit.'},
    {id:'g',text:'Repeat with a fixed length, changing the tension, and then with strings of different mass per unit length.'}
  ],constraints:[['a','b'],['a','c'],['b','d'],['c','d'],['d','e'],['e','f'],['f','g']],
  why:'The string is set up and put under tension before anything is measured. The length and the tension can be recorded in either order, but both come before the first frequency. Only one of L, T and μ is changed at a time.'});
}
{
  const body=act('method','Match','What each piece of equipment is for','Pair each piece of equipment with its job. Drag one card onto the other, or tap one card and then the other.');
  createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'s',l:'Signal generator',r:'Sets the frequency of the vibration and shows its value'},
    {id:'v',l:'Vibration generator',r:'Moves one end of the string up and down'},
    {id:'m',l:'Hanging masses',r:'Keep the tension in the string constant and known'},
    {id:'b',l:'Bridge',r:'Fixes the far end of the vibrating length, so that L can be changed'},
    {id:'r',l:'Metre rule',r:'Measures the length of the string that vibrates'},
    {id:'t',l:'Top-pan balance',r:'Measures the mass of a known length of string, to find μ'}
  ]});
}

/* ================= DO THE EXPERIMENT ================= */
// The student sets each length with the bridge and reads the signal generator in the animation's measure mode (?show=measure).
// SW_F must match the animation's readings: round(v/2L) for a 1.0 g/m string with 300 g hanging (v = 54.25 m/s).
const SW_L=[1.0,0.9,0.8,0.7,0.6,0.5,0.4], SW_F=[27,30,34,39,45,54,68];
const SW_X=SW_L.map(l=>1/l);                                               // 1.00, 1.11, 1.25, 1.43, 1.67, 2.00, 2.50 per metre
let swTable=null,swPlotRows=()=>{};
{
  act('do','Your turn','Take your own readings','1. A 300 g mass hangs on the string. Move the bridge to each length in the table and check it on the rule under the bridge. 2. Change the frequency until the string vibrates in one loop that is as large as it can be, and read the signal generator. 3. Work out 1/L for each length.');
}
frameAct('do',SW_ANIM,'measure&level=ial','Vibrating string experiment: move the bridge, tune the signal generator until one large loop appears and read the frequency','standing waves',false);
{
  const body=act('do','Calculate','Your results table','Write each frequency as the signal generator shows it, and 1/L to 2 decimal places. Press Check.');
  const wrap=mk('div','table-scroll');body.appendChild(wrap);
  const cell=(c,k,lab)=>'<td><input class="calc-num-input" data-c="'+c+'" data-k="'+k+'" inputmode="decimal" autocomplete="off" aria-label="'+lab+'"></td>';
  wrap.innerHTML='<table class="units res-tbl ga-tbl"><thead><tr><th>L (m)</th><th>f (Hz)</th><th>1/L (m⁻¹)</th></tr></thead><tbody>'+
    SW_L.map((l,k)=>'<tr><td class="given">'+l.toFixed(3)+'</td>'+cell('f',k,'Length '+l.toFixed(3)+' metres: frequency of one loop, hertz')+cell('x',k,'Length '+l.toFixed(3)+' metres: 1 divided by L, per metre')+'</tr>').join('')+'</tbody></table>';
  const inp=(c,k)=>$('input[data-c="'+c+'"][data-k="'+k+'"]',wrap), all=()=>$$('input',wrap);
  const val=e=>{const t=e.value.trim().replace(/[−–]/g,'-').replace(',','.');return t===''||!/^-?(\d+\.?\d*|\.\d+)$/.test(t)?NaN:parseFloat(t);};
  const want=(c,k)=>c==='f'?[SW_F[k],1]:[SW_X[k],0.006];
  const show=(c,k)=>c==='f'?String(SW_F[k]):SW_X[k].toFixed(2);
  const b=bar(body,[{label:'Check table',primary:true,fn:check},{label:'Clear',fn:reset}]);
  const ans=answerBtn(b,()=>{
    all().forEach(e=>{if(e.disabled)return;e.value=show(e.dataset.c,+e.dataset.k);e.disabled=true;e.classList.add('is-shown');e.classList.remove('is-wrong');});
    b.say('Answers shown (dashed). Now plot f against 1/L below.','');swPlotRows();
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
    if(ok===n){b.say('All correct. Now plot f against 1/L.','good');celebrate(b.msg);ans.off();}
    else{b.say(ok+' of '+n+' correct'+(blank?', '+blank+' left blank':'')+'.'+(bad?' Check that the bridge is at the right length, that the string is in one loop at its largest, and that 1/L is rounded to 2 decimal places.':''),bad?'bad':'');ans.on();}
    swPlotRows();
  }
  // Show answer is always there for this table (as on CP15), so students can skip it and go on to the plot
  function reset(){all().forEach(e=>{e.value='';e.disabled=false;e.classList.remove('is-wrong','is-shown','pop');});ans.on();b.say('','');swPlotRows();}
  all().forEach(e=>e.addEventListener('input',()=>e.classList.remove('is-wrong')));
  ans.on();
  swTable={v:(c,k)=>{const e=inp(c,k);return e.value.trim()===''||!e.disabled?null:e.value.trim();}};
  track(body,{reset:reset,
    getState:()=>({v:all().map(e=>e.value),ok:all().map(e=>e.disabled),sh:all().map(e=>e.classList.contains('is-shown'))}),
    setState:s=>{reset();all().forEach((e,i)=>{if(!s||!s.v||typeof s.v[i]!=='string')return;e.value=s.v[i];if(s.ok&&s.ok[i]){e.disabled=true;if(s.sh&&s.sh[i])e.classList.add('is-shown');}});if(all().every(e=>e.disabled)){b.say('All correct. Now plot f against 1/L.','good');ans.off();}swPlotRows();},
    isDone:()=>all().every(e=>e.disabled)});
}
{
  const body=act('do','Explain','Why plot f against 1/L?','With one loop on the string, the length L is half a wavelength:');
  body.insertAdjacentHTML('beforeend',
    '<div class="ln-steps"><span>v</span><span>=</span><span>fλ</span>'+
    '<span>λ</span><span>=</span><span>2L</span>'+
    '<span>f</span><span>=</span><span>'+FR('[[v|2L]]')+'</span>'+
    '<span>f</span><span>=</span><span>'+FR('[[v|2]]')+' × '+FR('[[1|L]]')+'</span></div>'+
    '<p class="act-intro">In the order of y = mx + c:</p>'+
    '<div class="ln-match"><span>f</span><span>=</span><span>'+FR('[[v|2]]')+'</span><span>'+FR('[[1|L]]')+'</span><span>+</span><span>0</span>'+
    '<span>y</span><span>=</span><span>m</span><span>x</span><span>+</span><span>c</span></div>'+
    '<p class="act-intro">So f against 1/L is a straight line through the origin, with gradient '+FR('[[v|2]]')+'. The speed is v = √(T/μ), so the gradient also gives the mass per unit length of the string.</p>');
}
{
  const body=act('do','Plot','Plot your results','Plot f against 1/L from your table as small crosses. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');
  createPlot({host:body,next:' Now find the speed of the waves from the line of best fit below.',
    points:SW_L.map((l,k)=>({x:+SW_X[k].toFixed(2),y:SW_F[k]})),
    rowText:p=>'1/L = '+p.x.toFixed(2)+' m⁻¹, your f',
    graph:{xMin:0,xMax:3,yMin:0,yMax:80,xTicks:[0,0.5,1,1.5,2,2.5,3],yTicks:[0,10,20,30,40,50,60,70,80],minor:[0.1,2],snap:[0.05,1],tol:[0.05,1],xLabel:'1/L (m⁻¹)',yLabel:'f (Hz)',W:560,H:400}});
  // the animation and the results table side by side, as on CP15
  {const fr=$('#panel-do .anim-wrap'),tb=$('#panel-do .ga-tbl').closest('.act'),yt=$('#panel-do .act[data-title="Take your own readings"]');
   if(fr&&tb){const sp=mk('div','hk-split'),left=mk('div','ga-left');fr.parentNode.insertBefore(sp,fr);sp.appendChild(left);if(yt)left.appendChild(yt);left.appendChild(fr);sp.appendChild(tb);}}
  swPlotRows=()=>{$$('.plot-row',body).forEach((li,k)=>{const x=swTable&&swTable.v('x',k),f=swTable&&swTable.v('f',k),s=li.firstElementChild;if(s)s.textContent='1/L = '+(x||SW_X[k].toFixed(2))+' m⁻¹, '+(f?'f = '+f+' Hz':'your f');});};
  swPlotRows();
}
{
  const body=act('do','Calculate','The string from your line','A good line of best fit through your points passes through the origin and (2.40, 65.0). The hanging mass is 0.300 kg.');
  createCalc({host:body,questions:[
    {q:'What is the gradient of the line?',unit:'Hz m',answer:27.1,working:'first point = (0, 0)<br>second point = (2.40, 65.0)<br>gradient = ?||gradient = [[change in f|change in 1/L]]<br>gradient = [[65.0 − 0|2.40 − 0]]<br>gradient = 27.08 Hz m<br>gradient = 27.1 Hz m'},
    {q:'What is the speed of the waves on the string?',unit:'m s⁻¹',answer:54.2,working:'gradient = 27.08 Hz m<br>v = ?||gradient = [[v|2]]<br>v = 2 × gradient<br>v = 2 × 27.08<br>v = 54.16 m s⁻¹<br>v = 54.2 m s⁻¹'},
    {q:'What is the mass per unit length of the string, in g m⁻¹?',unit:'g m⁻¹',answer:1,working:'m = 0.300 kg<br>v = 54.16 m s⁻¹<br>μ = ?||T = mg<br>T = 0.300 × 9.81<br>T = 2.943 N<br>v = √(T/μ)<br>v² = [[T|μ]]<br>μ = [[T|v²]]<br>μ = [[2.943|54.16²]]<br>μ = 1.003 × 10⁻³ kg m⁻¹<br>μ = 1.00 g m⁻¹'}
  ]});
}

/* ================= SHOW: the readings taken for you ================= */
{
  act('experiment','Your turn','Watch the readings','Press Play: the bridge is moved a step at a time, and each time the frequency is raised until the string vibrates in one loop. Switch between the two graphs. Then choose Tension or String under Change and run it again: which graph is a straight line each time?');
}
frameAct('experiment',SW_ANIM,'exp&level=ial','Standing waves animation: a vibrating string on a bench, with a graph of the frequency of one loop against the length, the tension or the mass per unit length','standing waves',false);

/* ================= 5. ANALYSIS ================= */
function lab(g0,t,x,y){return '<circle cx="'+g0.gx(x)+'" cy="'+g0.gy(y)+'" r="13" fill="var(--panel)" stroke="var(--ink)" stroke-width="2"/><text x="'+g0.gx(x)+'" y="'+(g0.gy(y)+5)+'" text-anchor="middle" font-size="14" fill="var(--ink)">'+t+'</text>';}
const GV={xMin:0,xMax:2.5,yMin:0,yMax:100,xTicks:[0,0.5,1,1.5,2,2.5],yTicks:[0,20,40,60,80,100],xLabel:'√T (√N)',yLabel:'f (Hz)',W:560,H:340};
{
  const body=act('graphs','Calculate','Two strings','Two strings, P and Q, each 0.500 m long, are tested at different tensions. The graph shows the frequency of one loop against √T for each. Read your answers off the graph.');
  const split=mk('div','graph-split');body.appendChild(split);
  const g0=lineGraph(Object.assign({points:[[0,0]]},GV));
  split.appendChild(mk('div','graph-box',lineGraph(Object.assign({label:'Frequency against the square root of the tension for two strings: the line for P is steep and reaches 80 hertz at root T = 2.0; the line for Q reaches 40 hertz at root T = 2.0',segments:[{pts:[[0,0],[2.5,100]]},{pts:[[0,0],[2.5,50]],cls:'g-line-b'}],
    extra:lab(g0,'P',1.5,60+13)+lab(g0,'Q',2.1,42+13)},GV)).svg));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'What is the gradient of the line for string P?',unit:'Hz per √N',answer:40,working:'first point = (0, 0)<br>second point = (2.0, 80)<br>gradient = ?||gradient = [[80 − 0|2.0 − 0]]<br>gradient = 40 Hz per √N'},
    {q:'What is the mass per unit length of string P, in g m⁻¹?',unit:'g m⁻¹',answer:0.625,working:'gradient = 40 Hz per √N<br>L = 0.500 m<br>μ = ?||f = [[v|2L]]<br>f = [[1|2L√μ]] × √T<br>gradient = [[1|2L√μ]]<br>√μ = [[1|2L × gradient]]<br>√μ = [[1|2 × 0.500 × 40]]<br>√μ = 0.0250<br>μ = 0.0250²<br>μ = 6.25 × 10⁻⁴ kg m⁻¹<br>μ = 0.625 g m⁻¹'},
    {q:'How many times bigger is the mass per unit length of Q than that of P?',unit:'times',answer:4,working:'gradient for P = 40<br>gradient for Q = [[40 − 0|2.0 − 0]] = 20<br>ratio of μ = ?||gradient = [[1|2L√μ]]<br>[[gradient for P|gradient for Q]] = [[√μ for Q|√μ for P]]<br>[[√μ for Q|√μ for P]] = [[40|20]]<br>[[√μ for Q|√μ for P]] = 2<br>[[μ for Q|μ for P]] = 2²<br>[[μ for Q|μ for P]] = 4'}
  ]});
}
{
  const body=act('graphs','Multiple choice','Reading the line','A quick question about the same graph.');
  createPredict({host:body,q:'The tension in string P is doubled. What happens to the frequency of one loop?',options:[
    {text:'It becomes √2 times bigger (about 1.4 times)',correct:true},
    {text:'It doubles',why:'The frequency is proportional to √T, not to T: the graph is a straight line only when √T is on the x-axis.'},
    {text:'It halves',why:'A tighter string carries waves faster, so the frequency goes up, not down.'}
  ],explain:'v = √(T/μ), so doubling T makes the speed √2 times bigger. The wavelength is still 2L, so from v = fλ the frequency is √2 times bigger too. The tension has to be four times bigger to double the frequency.'});
}

/* ================= 6. CALCULATE ================= */
{
  const body=act('calculate','Calculate','Waves on a string','Use v = √(T/μ) and v = fλ. With n loops on a string of length L, each loop is half a wavelength. Press New problems for another set.');
  createCalc({host:body,questions:[
    {q:'A string has a mass per unit length of 2.50 × 10⁻³ kg m⁻¹ and is under a tension of 40.0 N. What is the speed of waves on the string?',unit:'m s⁻¹',answer:126,
     working:'T = 40.0 N<br>μ = 2.50 × 10⁻³ kg m⁻¹<br>v = ?||v = √(T/μ)<br>v² = [[T|μ]]<br>v² = [[40.0|2.50 × 10⁻³]]<br>v² = 16 000<br>v = 126 m s⁻¹',
     hints:['v = √(T/μ): divide first, then take the square root.'],
     make:rnd=>{const T=calcPick(rnd,[10,20,30,60,90]),mu=calcPick(rnd,[1.5,2,4,5,6]),v2=T/(mu/1000);
       return {q:`A string has a mass per unit length of ${mu.toFixed(2)} × 10⁻³ kg m⁻¹ and is under a tension of ${T.toFixed(1)} N. What is the speed of waves on the string?`,unit:'m s⁻¹',answer:+Math.sqrt(v2).toPrecision(3),
         hints:['v = √(T/μ): divide first, then take the square root.'],
         working:`T = ${T.toFixed(1)} N<br>μ = ${mu.toFixed(2)} × 10⁻³ kg m⁻¹<br>v = ?||v = √(T/μ)<br>v² = [[T|μ]]<br>v² = [[${T.toFixed(1)}|${mu.toFixed(2)} × 10⁻³]]<br>v² = ${g4(v2)}<br>v = ${g3(Math.sqrt(v2))} m s⁻¹`};}},
    {q:'A string 0.650 m long is under a tension of 72.0 N. Its mass per unit length is 1.80 × 10⁻³ kg m⁻¹. What is the lowest frequency that gives a standing wave on it?',unit:'Hz',answer:154,
     working:'L = 0.650 m<br>T = 72.0 N<br>μ = 1.80 × 10⁻³ kg m⁻¹<br>f = ?||v² = [[T|μ]]<br>v² = [[72.0|1.80 × 10⁻³]]<br>v = 200.0 m s⁻¹<br>λ = 2L<br>λ = 2 × 0.650<br>λ = 1.300 m<br>v = fλ<br>f = [[v|λ]]<br>f = [[200.0|1.300]]<br>f = 154 Hz',
     hints:['The lowest frequency gives one loop, so the wavelength is twice the length of the string.','Find v from √(T/μ), then use v = fλ.'],
     make:rnd=>{const L=calcPick(rnd,[0.45,0.55,0.65,0.75,0.85]),T=calcPick(rnd,[50,60,80,100]),mu=calcPick(rnd,[1.2,2,2.5,4]),v=Math.sqrt(T/(mu/1000)),f=v/(2*L);
       return {q:`A string ${L.toFixed(3)} m long is under a tension of ${T.toFixed(1)} N. Its mass per unit length is ${mu.toFixed(2)} × 10⁻³ kg m⁻¹. What is the lowest frequency that gives a standing wave on it?`,unit:'Hz',answer:+f.toPrecision(3),
         hints:['The lowest frequency gives one loop, so the wavelength is twice the length of the string.','Find v from √(T/μ), then use v = fλ.'],
         working:`L = ${L.toFixed(3)} m<br>T = ${T.toFixed(1)} N<br>μ = ${mu.toFixed(2)} × 10⁻³ kg m⁻¹<br>f = ?||v² = [[T|μ]]<br>v² = [[${T.toFixed(1)}|${mu.toFixed(2)} × 10⁻³]]<br>v = ${g4(v)} m s⁻¹<br>λ = 2L<br>λ = 2 × ${L.toFixed(3)}<br>λ = ${g4(2*L)} m<br>v = fλ<br>f = [[v|λ]]<br>f = [[${g4(v)}|${g4(2*L)}]]<br>f = ${g3(f)} Hz`};}},
    {q:'A string 1.20 m long vibrates with three loops when the frequency is 60.0 Hz. What is the speed of the waves on the string?',unit:'m s⁻¹',answer:48,
     working:'L = 1.20 m<br>three loops<br>f = 60.0 Hz<br>v = ?||L = 3 × [[λ|2]]<br>λ = [[2 × 1.20|3]]<br>λ = 0.800 m<br>v = fλ<br>v = 60.0 × 0.800<br>v = 48.0 m s⁻¹',
     hints:['Each loop is half a wavelength, so three loops are one and a half wavelengths.']},
    {q:'A 0.500 kg mass hangs from a string that passes over a pulley. The string vibrates in one loop, 0.800 m long, at 35.0 Hz. What is the mass per unit length of the string, in g m⁻¹?',unit:'g m⁻¹',answer:1.56,
     working:'m = 0.500 kg<br>L = 0.800 m<br>f = 35.0 Hz<br>μ = ?||λ = 2L<br>λ = 1.600 m<br>v = fλ<br>v = 35.0 × 1.600<br>v = 56.00 m s⁻¹<br>T = mg<br>T = 0.500 × 9.81<br>T = 4.905 N<br>v² = [[T|μ]]<br>μ = [[T|v²]]<br>μ = [[4.905|56.00²]]<br>μ = 1.564 × 10⁻³ kg m⁻¹<br>μ = 1.56 g m⁻¹',
     hints:['Find the speed from v = fλ, with λ = 2L for one loop.','The tension is the weight of the hanging mass. Then rearrange v² = T/μ.']}
  ]});
}

/* ================= 7. ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Why each step is done','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'More accurate results',hint:'Cuts the uncertainty in f, L or μ',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps people safe',hint:'In case the string snaps or the masses fall',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Go past the largest amplitude and come back to it, approaching it from above and from below',cat:'a'},
    {id:'2',text:'Hold the rule close to the string and read it at eye level, to avoid parallax',cat:'a'},
    {id:'3',text:'Use lengths that are as long as possible, so the percentage uncertainty in L is small',cat:'a'},
    {id:'4',text:'Repeat each frequency reading and take a mean',cat:'a'},
    {id:'5',text:'Find μ by weighing several metres of the string, not a short piece',cat:'a'},
    {id:'6',text:'Wear eye protection in case the string or wire snaps',cat:'s'},
    {id:'7',text:'Put a tray of foam or sand under the hanging masses',cat:'s'},
    {id:'8',text:'Keep feet clear of the space under the hanging masses',cat:'s'}
  ]});
}

/* ================= EXAM PRACTICE ================= */
{
  const body=act('exam','Exam style','Frequency and tension','Kenji investigates how the frequency of a vibrating string depends on its tension. The string is 0.750 m long between a vibration generator and a pulley. He hangs different masses on the end of the string, and each time finds the lowest frequency that gives a standing wave (one loop).');
  body.appendChild(resTable(['Hanging mass (kg)','0.100','0.200','0.300','0.400'],[['Frequency (Hz)','23.3','33.0','40.4',null]]));
  examPart(body,'(a) 3 marks','Explain how a standing wave is formed on the string.',[
    'Waves from the vibration generator travel along the string and are reflected at the pulley.',
    'The reflected wave and the incoming wave have the same frequency and travel in opposite directions, so they superpose (interfere).',
    'Where they always meet in antiphase there is a node (destructive interference, zero amplitude); where they meet in phase there is an antinode (constructive interference, maximum amplitude).'
  ]);
  body.appendChild(mk('p','sub','(b) 4 marks'));
  createCalc({host:body,questions:[
    {q:'Use the reading for 0.300 kg to calculate the mass per unit length of the string, in g m⁻¹.',unit:'g m⁻¹',answer:0.801,working:'m = 0.300 kg<br>f = 40.4 Hz<br>L = 0.750 m<br>μ = ?||λ = 2L<br>λ = 1.500 m<br>v = fλ<br>v = 40.4 × 1.500<br>v = 60.60 m s⁻¹<br>T = mg<br>T = 0.300 × 9.81<br>T = 2.943 N<br>v² = [[T|μ]]<br>μ = [[T|v²]]<br>μ = [[2.943|60.60²]]<br>μ = 8.01 × 10⁻⁴ kg m⁻¹<br>μ = 0.801 g m⁻¹'}
  ]});
  body.appendChild(mk('p','sub','(c) 3 marks'));
  createCalc({host:body,questions:[
    {q:'Calculate the missing reading: the frequency with 0.400 kg hanging.',unit:'Hz',answer:46.7,working:'T = 0.400 × 9.81 = 3.924 N<br>μ = 8.01 × 10⁻⁴ kg m⁻¹<br>λ = 1.500 m<br>f = ?||v² = [[T|μ]]<br>v² = [[3.924|8.01 × 10⁻⁴]]<br>v = 69.99 m s⁻¹<br>v = fλ<br>f = [[v|λ]]<br>f = [[69.99|1.500]]<br>f = 46.7 Hz'}
  ]});
  examPart(body,'(d) 2 marks','Explain why Kenji should plot f against √T (or f² against T), and not f against T.',[
    'f = [[1|2L]] × √(T/μ), so f is proportional to √T, not to T: a graph of f against T is a curve.',
    'f against √T (or f² against T) is a straight line through the origin, which shows the relationship and gives μ from its gradient.'
  ]);
  examPart(body,'(e) 6 marks','Describe how Kenji could find how the frequency depends on the length of the string. Say how he makes his results accurate, and include one safety precaution.',[
    'Keep the same string and the same hanging mass, so μ and T are constant.',
    'Change the length L of the vibrating string by moving a bridge (or the vibration generator), and measure L with a metre rule, read at eye level.',
    'For each length, raise the frequency from zero until the string vibrates in one loop with the largest amplitude, and record the frequency from the signal generator.',
    'Approach the largest amplitude from above and from below (or repeat) and take a mean; use at least six lengths over as wide a range as possible.',
    'Plot f against 1/L: a straight line through the origin shows that f is inversely proportional to L.',
    'Safety: wear eye protection in case the string snaps, or put foam under the masses and keep feet clear.'
  ]);
  examPart(body,'(f) 2 marks','State the two main sources of uncertainty in this experiment, and how one of them can be reduced.',[
    'Judging exactly when the amplitude is largest, because the loop stays large over a small range of frequencies; and measuring the length, because the nodes at the generator and the pulley are not sharp points.',
    'Reduce the first by approaching the frequency from both sides and averaging; reduce the second by using a longer string, so the percentage uncertainty in L is smaller.'
  ]);
}
