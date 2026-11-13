/* ================= YOUR OWN RESULTS TABLE (Do Experiment; 5c rebuild, 13 Nov 2026) =================
   The same helper is copied on the six pages rebuilt together (3.17, 3.19, 3.25P, 3.27P, 5.11P, 5.14P); 1.22 has its own.
   o.cols: the header cells. o.rows: one array per row; a cell is given text, or a box
     {k:key, label:'for screen readers', ok:(v,g)=>true if right, fill:g=>'text', need:[keys]}.
   g(k) is the number in box k once that box is locked (checked right, or filled in), so a box worked out from the
   student's own readings is marked against them; ok() is only asked once every box in need[] is locked.
   Fill in table is always there (Alex, 5 Nov 2026), so a student who cannot read the instrument can still go on.
   o.beside: put the animation frame just above this activity side by side with it (the 1.22 layout). */
function measTable(body,o){
  const wrap=mk('div','table-scroll');body.appendChild(wrap);
  const boxes=[];
  wrap.innerHTML='<table class="units res-tbl mt-tbl"><thead><tr>'+o.cols.map(h=>'<th>'+h+'</th>').join('')+'</tr></thead><tbody>'+
    o.rows.map(r=>'<tr>'+r.map(c=>{if(c&&typeof c==='object'){boxes.push(c);return '<td><input class="calc-num-input" data-k="'+c.k+'" inputmode="decimal" autocomplete="off" aria-label="'+c.label+'"></td>';}return '<td class="given">'+c+'</td>';}).join('')+'</tr>').join('')+'</tbody></table>';
  const inp=k=>$('input[data-k="'+k+'"]',wrap), all=()=>$$('input',wrap);
  const num=e=>{const t=e.value.trim().replace(/[−–]/g,'-').replace(',','.');return /^-?(\d+\.?\d*|\.\d+)$/.test(t)?parseFloat(t):NaN;};
  const g=k=>{const e=inp(k);return e&&e.disabled?num(e):NaN;};
  const ready=c=>(c.need||[]).every(k=>inp(k).disabled);
  const b=bar(body,[{label:'Check table',primary:true,fn:check},{label:'Fill in table',fn:fill},{label:'Clear',fn:reset}]);
  const lock=(e,shown)=>{e.disabled=true;e.classList.remove('is-wrong');e.classList.add(shown?'is-shown':'pop');};
  const changed=()=>{if(o.onChange)try{o.onChange();}catch(e){console.error(e);}};
  const DONE=o.done||'All correct.';
  function check(){
    let ok=0,bad=0,blank=0,wait=0,more=true;
    while(more){more=false;boxes.forEach(c=>{const e=inp(c.k);if(e.disabled||e.value.trim()===''||!ready(c))return;const v=num(e);if(isFinite(v)&&c.ok(v,g)){lock(e,false);more=true;}});}
    boxes.forEach(c=>{const e=inp(c.k);if(e.disabled){ok++;return;}if(e.value.trim()===''){blank++;return;}if(!ready(c)){wait++;return;}bad++;e.classList.add('is-wrong');});
    if(ok===boxes.length){b.say(DONE,'good');celebrate(b.msg);}
    else b.say(ok+' of '+boxes.length+' correct'+(blank?', '+blank+' left blank':'')+'.'+(wait?' '+wait+' wait for the readings they are worked out from.':'')+(bad&&o.hint?' '+o.hint:''),bad?'bad':'');
    changed();
  }
  function fill(){
    boxes.forEach(c=>{const e=inp(c.k);if(e.disabled)return;e.value=c.fill(g);lock(e,true);});
    b.say(o.filled||'Table filled in (dashed). Boxes worked out from your own readings use your values.','');changed();
  }
  function reset(){all().forEach(e=>{e.value='';e.disabled=false;e.classList.remove('is-wrong','is-shown','pop');});b.say('','');changed();}
  all().forEach(e=>e.addEventListener('input',()=>e.classList.remove('is-wrong')));
  if(o.beside){const a=body.closest('.act'),fr=a.previousElementSibling;if(fr&&fr.classList.contains('anim-wrap')){const sp=mk('div','mt-split');fr.parentNode.insertBefore(sp,fr);sp.appendChild(fr);sp.appendChild(a);}}
  track(body,{reset:reset,
    getState:()=>({v:all().map(e=>e.value),ok:all().map(e=>e.disabled),sh:all().map(e=>e.classList.contains('is-shown'))}),
    setState:s=>{reset();all().forEach((e,i)=>{if(!s||!s.v||typeof s.v[i]!=='string')return;e.value=s.v[i];if(s.ok&&s.ok[i]){e.disabled=true;if(s.sh&&s.sh[i])e.classList.add('is-shown');}});if(all().every(e=>e.disabled))b.say(DONE,'good');changed();},
    isDone:()=>all().every(e=>e.disabled)});
  return {g:g,text:k=>{const e=inp(k);return e&&e.disabled?e.value.trim():'';}};
}
// the list beside a Plot shows the student's own values once their table is checked (rowText does the same on each redraw)
function plotLabels(body,fn){$$('.plot-row',body).forEach((li,i)=>{const s=li.firstElementChild;if(s)s.textContent=fn(i);});}
const near=(v,a,t)=>Math.abs(v-a)<=t+1e-9;
const dp=(v,n)=>Number(v).toFixed(n);

// An oscilloscope screen, 10 divisions across and 8 up. per = divisions for one cycle, amp = amplitude in divisions.
function scopeSVG(o){
  const D=o.d||26,W=10*D,H=8*D,cy=H/2,id='sc'+Math.random().toString(36).slice(2,7);
  let s='<svg class="graph" viewBox="0 0 '+(W+2)+' '+(H+(o.tb?22:2))+'" role="img" aria-label="'+(o.label||'Oscilloscope trace')+'" style="max-width:'+(o.max||340)+'px">';
  s+='<rect x="1" y="1" width="'+W+'" height="'+H+'" fill="#0f2a1c"/>';
  for(let i=1;i<10;i++)s+='<line x1="'+(1+i*D)+'" y1="1" x2="'+(1+i*D)+'" y2="'+(H+1)+'" stroke="rgba(120,220,160,0.25)" stroke-width="0.8"/>';
  for(let j=1;j<8;j++)s+='<line x1="1" y1="'+(1+j*D)+'" x2="'+(W+1)+'" y2="'+(1+j*D)+'" stroke="rgba(120,220,160,'+(j===4?0.5:0.25)+')" stroke-width="0.8"/>';
  const pts=[];
  for(let px=0;px<=W;px++){const t=px/D/o.per;pts.push((1+px)+','+(1+cy-(o.amp||2)*D*Math.sin(2*Math.PI*t+(o.ph||0))).toFixed(1));}
  s+='<polyline points="'+pts.join(' ')+'" fill="none" stroke="#3ddc84" stroke-width="2"/>';
  if(o.tag)s+='<text x="8" y="18" font-size="14" font-weight="600" fill="#ffd34d" font-family="IBM Plex Mono,monospace">'+o.tag+'</text>';
  if(o.tb)s+='<text x="1" y="'+(H+17)+'" font-size="12" fill="currentColor" font-family="IBM Plex Mono,monospace">'+o.tb+'</text>';
  return s+'</svg>';
}

/* ================= VARIABLES ================= */
{
  const body=act('variables','Sort','What changes what?','Rose measures the frequency of a tuning fork with a microphone and an oscilloscope. Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'s',label:'You set it',hint:'To get a trace you can read',color:'--c1',soft:'--c1-soft'},
    {id:'r',label:'You read it or work it out',hint:'From the trace',color:'--c2',soft:'--c2-soft'},
    {id:'h',label:'Changes only the height of the trace',hint:'Not the frequency',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'The time base (ms per division)',cat:'s'},
    {id:'2',text:'The trigger, for a steady trace',cat:'s'},
    {id:'3',text:'The number of divisions across the cycles you count',cat:'r'},
    {id:'4',text:'The period, T',cat:'r'},
    {id:'5',text:'The frequency, f',cat:'r'},
    {id:'6',text:'The Y-gain (mV per division)',cat:'h'},
    {id:'7',text:'How hard the fork is struck',cat:'h'},
    {id:'8',text:'How close the microphone is to the fork',cat:'h'}
  ]});
}
{
  const body=act('variables','Predict','A higher note','');
  createPredict({host:body,q:'Lucas swaps a 250 Hz fork for a 500 Hz fork and strikes it just as hard. He does not change the time base. What changes on the screen?',options:[
    {text:'Twice as many cycles fit across it',correct:true},
    {text:'Half as many cycles fit across it',why:'A higher frequency means a shorter period, so each cycle takes fewer divisions and more of them fit.'},
    {text:'The trace becomes twice as tall',why:'The height shows the amplitude (loudness), not the frequency.'},
    {text:'Nothing: the time base has not changed',why:'The time base is the same, but each cycle now takes half as long, so it is half as wide.'}
  ],explain:'Doubling the frequency halves the period, so each cycle is half as many divisions wide and twice as many cycles fit across the screen. A higher frequency is a higher pitch.'});
}

/* ================= METHOD ================= */
{
  const body=act('method','Order','Measure the frequency of a sound','Put the steps in the order you would do them. Drag the ≡ handle, or use the ▲▼ buttons.');
  createReorder({host:body,steps:[
    {id:'a',text:'Connect a microphone to the input of the oscilloscope.'},
    {id:'b',text:'Play a steady note near the microphone.'},
    {id:'c',text:'Adjust the oscilloscope (the trigger) to get a steady trace.'},
    {id:'d',text:'Adjust the time base so that several complete cycles are on the screen.'},
    {id:'e',text:'Count the divisions (squares) across as many complete cycles as you can.'},
    {id:'f',text:'Divide by the number of cycles, and multiply by the time base, to find T.'},
    {id:'g',text:'Work out the frequency with f = [[1|T]].'}
  ],constraints:[['a','c'],['b','c'],['c','e'],['d','e'],['e','f'],['f','g']],
  why:'The trace must be steady, with several complete cycles on the screen, before you count divisions. Divisions × time base gives the time for those cycles; dividing by the number of cycles gives T, then f = [[1|T]].'});
}
{
  const body=act('method','Multiple choice','Too many cycles','');
  createPredict({host:body,q:'Fatimah sees about 40 cycles squashed across the screen. What should she do?',options:[
    {text:'Choose a smaller time base',correct:true},
    {text:'Choose a larger time base',why:'A larger time base puts even more time on the screen, so even more cycles are squashed in.'},
    {text:'Turn the Y-gain down a lot',why:'The Y-gain only changes the height of the trace, not how many cycles fit across it.'},
    {text:'Move the microphone further away',why:'That makes the trace smaller, but the number of cycles across the screen stays the same.'}
  ],explain:'The time base is the time for each division across the screen. A smaller time base (fewer ms per division) shows less time, so fewer cycles fit across the screen and each one is wider and easier to measure.'});
}

/* ================= ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Better results or safer?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'Better results',hint:'A more accurate period',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps people and equipment safe',hint:'',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Adjust the trigger so the trace is steady',cat:'a'},
    {id:'2',text:'Set the time base so several complete cycles fill the screen',cat:'a'},
    {id:'3',text:'Measure across as many complete cycles as possible',cat:'a'},
    {id:'4',text:'Count from matching points on the waves, such as where the trace crosses the centre line going up',cat:'a'},
    {id:'5',text:'Keep the volume low enough to protect your hearing',cat:'s'},
    {id:'6',text:'Do not make very loud sounds: the large vibrations can damage the microphone',cat:'s'},
    {id:'7',text:'Check the leads for damage before plugging in',cat:'s'}
  ]});
}
{
  const body=act('accuracy','Multiple choice','Several cycles','');
  createPredict({host:body,q:'Why is it better to measure the time across several cycles, then divide, than to measure one cycle?',options:[
    {text:'Reading errors are a smaller fraction',correct:true},
    {text:'Each cycle has a different period',why:'For a steady note every cycle has the same period. The gain is in accuracy, not in averaging different values.'},
    {text:'The time base works only for long times',why:'The time base works for any number of divisions. Measuring more divisions just makes the reading more accurate.'},
    {text:'One cycle is always too small to see',why:'With the right time base one cycle can fill much of the screen. Measuring several is still more accurate.'}
  ],explain:'You can only read the trace to about 0.1 or 0.2 of a division. Spread over several cycles, that error is a smaller fraction of the time measured, so T is more accurate. (A bare “repeat and average” scores nothing in mark schemes: say what you repeat.)'});
}
{
  const body=act('accuracy','Multiple choice','The Y-gain','');
  createPredict({host:body,q:'Poppy changes the Y-gain from 20 mV per division to 10 mV per division. What happens to her value of the frequency?',options:[
    {text:'It stays the same',correct:true},
    {text:'It doubles',why:'The Y-gain changes the height of the trace, not the time across the screen.'},
    {text:'It halves',why:'Halving the mV per division makes the trace twice as tall, but the period is unchanged.'},
    {text:'It cannot be read now',why:'The trace is taller but still on the screen, so it can be read as before.'}
  ],explain:'The Y-gain sets the voltage per division, up the screen, so it changes the height of the trace only. The period, and so the frequency, are read across the screen with the time base.'});
}

/* ================= DO THE EXPERIMENT ================= */
// The student sets the time base, counts divisions for whole cycles and works out T and f for each source.
// FQ_T must match animations/oscilloscope.html?show=measure (its own sources: Fork 1 250 Hz, Fork 2 400 Hz, Fork 3 500 Hz,
// Mystery tone 800 Hz; tools/CORE-PRACTICALS.md, "Measure modes", 3.27P). Any time base and number of cycles that fit is accepted.
const FQ_NAME=['Fork 1','Fork 2','Fork 3','Mystery tone'], FQ_T=[4.0,2.5,2.0,1.25], FQ_TB=[0.1,0.2,0.5,1,2,5];
const FQ_FILL=[[1,2],[1,4],[0.5,2],[0.5,4]];   // a good time base and number of cycles for Fill in table
{
  act('do','Your turn','Measure four frequencies','Choose Fork 1 and press Play. Turn the trigger on, choose a time base that shows several complete cycles, and set the Y-gain so the trace fills the screen. Count the divisions across as many complete cycles as fit, and fill in the row. Then do Fork 2, Fork 3 and the Mystery tone.');
}
frameAct('do','animations/oscilloscope.html','measure','Frequency experiment: read the oscilloscope trace of each tuning fork and the mystery tone','frequency of a sound wave',false);
{
  const body=act('do','Calculate','Your results table','Use any time base that shows at least one complete cycle. Divisions to 0.1, T in ms, f to 3 significant figures. Press Check.');
  const fit=(j,tb)=>FQ_T[j]/tb;   // divisions for one cycle
  measTable(body,{cols:['Source','Time base (ms/div)','Cycles counted','Divisions','T (ms)','f (Hz)'],
    rows:FQ_NAME.map((nm,j)=>[nm,
      {k:'tb'+j,label:nm+': time base, in ms per division',ok:v=>FQ_TB.indexOf(v)>=0&&fit(j,v)<=10+1e-9,fill:()=>String(FQ_FILL[j][0])},
      {k:'n'+j,label:nm+': number of complete cycles counted',need:['tb'+j],ok:(v,g)=>Number.isInteger(v)&&v>=1&&v*fit(j,g('tb'+j))<=10+1e-9,
        fill:g=>{const tb=g('tb'+j),best=Math.max(1,Math.floor(10/fit(j,tb)+1e-9));return String(tb===FQ_FILL[j][0]?FQ_FILL[j][1]:best);}},
      {k:'d'+j,label:nm+': divisions across those cycles',need:['tb'+j,'n'+j],ok:(v,g)=>near(v,g('n'+j)*fit(j,g('tb'+j)),0.1),fill:g=>String(+(g('n'+j)*fit(j,g('tb'+j))).toFixed(2))},
      {k:'T'+j,label:nm+': period, in ms',need:['tb'+j,'n'+j,'d'+j],ok:(v,g)=>{const t=g('d'+j)*g('tb'+j)/g('n'+j);return near(v,t,t*0.02);},fill:g=>String(+(g('d'+j)*g('tb'+j)/g('n'+j)).toFixed(3))},
      {k:'f'+j,label:nm+': frequency, in Hz',need:['T'+j],ok:(v,g)=>{const f=1000/g('T'+j);return near(v,f,f*0.01);},fill:g=>String(Math.round(1000/g('T'+j)))}]),
    hint:'Multiply the divisions by the time base, then divide by the cycles counted, to get T. Change T to seconds (divide by 1000) before you work out f. The cycles you count must fit on the 10 divisions of the screen.',
    done:'All correct. Your four frequencies are in the table.'});
}
{
  const body=act('do','Multiple choice','Counting cycles','');
  createPredict({host:body,pre:'<div class="graph-box" style="max-width:300px">'+scopeSVG({per:10/3,amp:2.5,label:'A trace with three complete cycles across the screen',max:300})+'</div>',
    q:'How many complete cycles does this trace show?',options:[
    {text:'3',correct:true},
    {text:'6',why:'You have counted the peaks and the troughs. One complete cycle includes one peak and one trough.'},
    {text:'4',why:'Count from the start of the trace: it ends exactly after the third cycle.'},
    {text:'10',why:'There are 10 divisions across the screen, but that is not the number of cycles.'}
  ],explain:'One complete cycle goes up to a peak, down through the centre line to a trough, and back up to the centre line. This trace does that three times across the 10 divisions, so one cycle is [[10|3]] = 3.3 divisions.'});
}

/* ================= SHOW: the readings taken for you ================= */
{
  act('experiment','Your turn','Watch the readings','Press Experiment. For Fork A and the hidden tone: press Play, turn the trigger on, choose a time base that shows several complete cycles, drag the two cursors to the same point on two waves, set the number of cycles between them, and record three readings, each across a different number of cycles. How close is your mean to the stamped value?');
}
frameAct('experiment','animations/oscilloscope.html','','Frequency of a sound wave animation: a signal generator or tuning fork, a microphone and an oscilloscope','frequency of a sound wave',false);
{
  const body=act('experiment','Predict','Trigger off','');
  createPredict({host:body,q:'Zahra has a steady trace of Fork A on the screen. She turns the trigger off. What happens?',options:[
    {text:'The trace drifts across the screen',correct:true},
    {text:'The trace turns into a flat line',why:'The microphone still sends the signal, so the wave is still drawn. It just no longer starts at the same point each sweep.'},
    {text:'The cycles get closer together',why:'The trigger does not change the time base, so the cycles stay the same width.'},
    {text:'Nothing on the screen changes at all',why:'Without the trigger each sweep starts at a different point on the wave, so the picture moves.'}
  ],explain:'The trigger starts every sweep at the same point on the wave, so each new trace lands on top of the last and the picture stands still. Without it the trace drifts, and it is hard to count divisions. Mark schemes ask for a steady trace.'});
}
{
  const body=act('experiment','Predict','Louder, same note','');
  createPredict({host:body,q:'Henry turns the volume of the signal generator up, without changing its frequency. What changes on the screen?',options:[
    {text:'The trace gets taller',correct:true},
    {text:'More cycles fit across it',why:'More cycles would mean a higher frequency. The frequency has not changed.'},
    {text:'The trace gets shorter',why:'A louder sound gives a bigger signal from the microphone, so the trace gets taller.'},
    {text:'Nothing changes at all',why:'The amplitude of the sound increases, so the trace gets taller.'}
  ],explain:'Louder means a larger amplitude, so the trace is taller. The frequency, and so the number of cycles on the screen, stays the same.'});
}

/* ================= READING TRACES ================= */
{
  const body=act('traces','Calculate','Trace A','The time base is 0.5 ms per division. Each square is one division.');
  const split=mk('div','graph-split');body.appendChild(split);
  split.appendChild(mk('div','graph-box',scopeSVG({per:4,amp:2.5,tag:'A',tb:'time base 0.5 ms/div',label:'Trace A: a sine wave, one cycle every 4 divisions, time base 0.5 ms per division'})));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'Count 2 complete cycles. What is the period, T?',unit:'ms',answer:2,working:'2 cycles = 8 divisions<br>time for 2 cycles = 8 × 0.5<br>time for 2 cycles = 4.0 ms<br>T = [[4.0|2]]<br>T = 2.0 ms'},
    {q:'What is the frequency?',unit:'Hz',answer:500,working:'T = 2.0 ms<br>T = 0.0020 s<br>f = [[1|T]]<br>f = [[1|0.0020]]<br>f = 500 Hz'}
  ]});
}
{
  const body=act('traces','Calculate','Planning the trace','Before you measure, work out what the trace should look like. The screen is 10 divisions across.');
  createCalc({host:body,questions:[
    {q:'A 200 Hz note is shown at 1 ms per division. How many divisions wide is one cycle?',unit:'div',answer:5,working:'f = [[1|T]]<br>200 = [[1|T]]<br>T = [[1|200]]<br>T = 0.005 s<br>T = 5 ms<br>divisions = [[5|1]]<br>divisions = 5'},
    {q:'A 2500 Hz note is shown at 0.1 ms per division. How many complete cycles fit across the screen?',unit:'cycles',answer:2,working:'f = [[1|T]]<br>2500 = [[1|T]]<br>T = [[1|2500]]<br>T = 0.000 40 s<br>T = 0.40 ms<br>one cycle = [[0.40|0.1]]<br>one cycle = 4 divisions<br>cycles = [[10|4]]<br>cycles = 2.5, so 2 complete cycles'}
  ]});
}
{
  const body=act('traces','Look','Four sounds, same settings','The oscilloscope settings are the same for all four traces.');
  const row=mk('div','');row.style.cssText='display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:14px';body.appendChild(row);
  [['P',4,2],['Q',2,2],['R',4,3.5],['S',2,1]].forEach(t=>row.appendChild(mk('div','graph-box',scopeSVG({per:t[1],amp:t[2],tag:t[0],max:300,label:'Trace '+t[0]}))));
}
{
  const body=act('traces','Multiple choice','Louder, same pitch','');
  createPredict({host:body,q:'Which trace shows a louder sound with the same pitch as P?',options:[
    {text:'R',correct:true},
    {text:'Q',why:'Q has more cycles across the screen, so it is a higher pitch, and it is the same height as P, so it is not louder.'},
    {text:'S',why:'S is shorter (quieter) and has more cycles (higher pitch).'},
    {text:'None of them',why:'R has the same number of cycles as P (same frequency, same pitch) but is taller (louder).'}
  ],explain:'Pitch depends on frequency: the same number of cycles across the screen means the same pitch. Loudness depends on amplitude: the taller trace is the louder sound. R matches P’s cycles but is taller.'});
}
{
  const body=act('traces','Multiple choice','Quieter and higher','');
  createPredict({host:body,q:'Which trace shows a quieter sound with a higher pitch than P?',options:[
    {text:'S',correct:true},
    {text:'Q',why:'Q is a higher pitch than P, but it is the same height, so it is not quieter.'},
    {text:'R',why:'R is taller (louder) with the same pitch as P.'},
    {text:'P',why:'P is the sound being compared with.'}
  ],explain:'S has twice as many cycles on the screen as P (twice the frequency, so a higher pitch) and a smaller amplitude (quieter).'});
}
