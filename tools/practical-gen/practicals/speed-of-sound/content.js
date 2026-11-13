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

const ORDER_INTRO='Put the steps in the order you would do them. Drag the ≡ handle, or use the ▲▼ buttons.';

/* ================= VARIABLES ================= */
{
  const body=act('variables','Sort','Which kind of variable is it?','Charlie times a sound over several distances and plots a distance–time graph. Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'i',label:'Independent',hint:'You change it',color:'--c1',soft:'--c1-soft'},
    {id:'d',label:'Dependent',hint:'You measure it',color:'--c2',soft:'--c2-soft'},
    {id:'c',label:'Control',hint:'You keep it the same',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'The distance between the sound and the timer',cat:'i'},
    {id:'3',text:'The time on the stopwatch',cat:'d'},
    {id:'5',text:'The person who does the timing',cat:'c'},
    {id:'8',text:'Hitting the blocks together the same way each time',cat:'c'},
    {id:'6',text:'The air temperature (do every reading on the same day)',cat:'c'},
    {id:'7',text:'The wind (choose a still day)',cat:'c'}
  ]});
}
{
  const body=act('variables','Multiple choice','Why so far apart?','');
  createPredict({host:body,q:'Why do Ali and Sophie stand at least 100 m apart, rather than 10 m?',options:[
    {text:'So reaction time is a small part of the time',correct:true},
    {text:'So the sound is loud enough for Sophie to hear',why:'The sound is louder when she is closer, not further away.'},
    {text:'So the light has time to arrive before the sound',why:'Light arrives almost instantly at any distance. The problem is timing by hand.'},
    {text:'So the sound has time to reach its full speed',why:'Sound travels at a steady speed through the air from the start.'}
  ],explain:'Over 10 m the sound takes only about 0.03 s, far shorter than a reaction time of about 0.2 s. Over 100 m or more it takes 0.3 s or longer, so the same reaction-time error is a much smaller fraction of the time.'});
}

/* ================= METHOD ================= */
{
  const body=act('method','Order','Time a sound over a measured distance',ORDER_INTRO);
  createReorder({host:body,steps:[
    {id:'a',text:'Choose a large, flat, open field, away from buildings that could cause echoes.'},
    {id:'b',text:'Measure a distance of at least 100 m with a trundle wheel or tape measure, and mark both ends.'},
    {id:'c',text:'Ali stands at one end with two wooden blocks; Sophie stands at the other end with a stopwatch.'},
    {id:'d',text:'Ali bangs the blocks together above his head, so Sophie can see them hit.'},
    {id:'e',text:'Sophie starts the stopwatch when she sees the blocks hit, and stops it when she hears the sound.'},
    {id:'f',text:'Repeat several times (or use several timers) and work out the mean time.'},
    {id:'g',text:'Work out speed = [[distance|mean time]].'}
  ],constraints:[['a','b'],['b','c'],['c','d'],['d','e'],['e','f'],['f','g']],
  why:'Choose the place, measure the distance, take up positions, then make the sound and time it. Repeat to find a mean before working out the speed.'});
}
{
  const body=act('method','Order','Use two microphones and an oscilloscope',ORDER_INTRO);
  createReorder({host:body,steps:[
    {id:'a',text:'Place a sound source (a hammer and a metal plate) in a straight line with two microphones.'},
    {id:'b',text:'Connect each microphone to one input of a dual-trace oscilloscope.'},
    {id:'c',text:'Measure the distance between the microphones with a metre rule (about 1 m).'},
    {id:'d',text:'Make a sharp sound at the source, beside the first microphone.'},
    {id:'e',text:'Read the time between the starts of the two pulses: number of divisions × time base.'},
    {id:'f',text:'Repeat, then move one microphone to change the distance and take more readings.'},
    {id:'g',text:'Plot distance against time: the gradient is the speed of sound.'}
  ],constraints:[['a','d'],['b','d'],['c','d'],['d','e'],['e','f'],['f','g']],
  why:'Set up and measure before making the sound; then read the time, repeat at more distances and plot. Connecting the microphones and measuring the distance can be done in either order.'});
}

/* ================= ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Better results or safer?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'Better results',hint:'More accurate or more reliable timings',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps people safe',hint:'Protects people and their hearing',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Use a distance of at least 100 m',cat:'a'},
    {id:'3',text:'Use several timers and find the mean of their times',cat:'a'},
    {id:'4',text:'Measure the distance with a trundle wheel, not a metre rule',cat:'a'},
    {id:'9',text:'Take readings at more distances, over a wider range',cat:'a'},
    {id:'5',text:'Choose a still day, with no wind',cat:'a'},
    {id:'6',text:'Choose a field well away from roads and traffic',cat:'s'},
    {id:'7',text:'Never make a loud sound right next to someone’s ear',cat:'s'}
  ]});
}
{
  const body=act('accuracy','Multiple choice','Measuring 100 m','');
  createPredict({host:body,q:'Elena measures 100 m with a metre rule. Why is that a poor choice?',options:[
    {text:'Laying it 100 times adds an error each time',correct:true},
    {text:'It cannot be read to the nearest millimetre',why:'A metre rule reads to 1 mm, far better than needed. The problem is laying it end to end 100 times.'},
    {text:'Metre rules are only for indoor experiments',why:'The problem is not where it is used, but how many times it must be moved.'},
    {text:'It measures in centimetres, not in metres',why:'Units can be converted. The errors from moving it 100 times cannot.'}
  ],explain:'Each time the rule is moved there is a small error, and it may not stay in a straight line. Over 100 lengths these add up, and miscounting is easy. A trundle wheel, a long tape measure or a laser distance meter is better.'});
}
{
  const body=act('accuracy','Multiple choice','A windy day','');
  createPredict({host:body,q:'Why should the direct method be done on a still day?',options:[
    {text:'Moving air changes the sound’s speed',correct:true},
    {text:'Wind makes the blocks harder to see clearly',why:'The blocks are just as easy to see in the wind. The wind moves the air the sound travels through.'},
    {text:'Wind stops the sound from travelling far',why:'Wind can make a sound quieter or louder, but the main problem is that it changes the speed.'},
    {text:'Wind bends the light coming from the blocks',why:'Wind has no effect on light.'}
  ],explain:'Sound travels through the air, so if the air is moving, the sound is carried faster with the wind and slower against it. A still day, or timing in both directions and averaging, avoids this.'});
}

/* ================= DO THE EXPERIMENT ================= */
// The student drags Sophie to each mark on the tape and reads the stopwatch close-up (three timings at each place),
// then measures with two microphones. SS_T and SS_DT must match animations/speed-of-sound.html?show=measure
// (&part=direct and &part=mics; tools/CORE-PRACTICALS.md, "Measure modes", 3.25P).
const SS_D=[100,200,300,400], SS_T=[[0.30,0.18,0.24],[0.52,0.59,0.47],[0.87,0.87,0.84],[1.12,1.21,1.13]];
const SS_M=[0.60,0.90,1.20,1.50], SS_DT=[[1.8,1.7,1.8],[2.6,2.7,2.6],[3.5,3.5,3.6],[4.4,4.4,4.4]];   // hits 1, 2 and 3
const ssMean=j=>(SS_T[j][0]+SS_T[j][1]+SS_T[j][2])/3;
let ssTable=null,ssRows=()=>{};
{
  act('do','Your turn','Time the sound yourself','Ali bangs two blocks together; Sophie starts the stopwatch when she sees them hit and stops it when she hears the bang. Drag Sophie to 100 m on the tape and press Clap and time three times, writing down each time. Do the same at 200 m, 300 m and 400 m.');
}
frameAct('do','animations/speed-of-sound.html','measure&part=direct','Speed of sound experiment: drag Sophie along the tape and read the stopwatch','speed of sound',false);
{
  const body=act('do','Calculate','Your results table','Write each time to 0.01 s, then work out the mean time to 2 decimal places. Press Check.');
  const t=(j,n)=>({k:'t'+j+n,label:'Time '+(n+1)+' at '+SS_D[j]+' m, in s',ok:v=>near(v,SS_T[j][n],0.005),fill:()=>dp(SS_T[j][n],2)});
  ssTable=measTable(body,{beside:true,cols:['Distance (m)','Time 1 (s)','Time 2 (s)','Time 3 (s)','Mean time (s)'],
    rows:SS_D.map((d,j)=>[d,t(j,0),t(j,1),t(j,2),{k:'m'+j,label:'Mean time at '+d+' m, in s',need:['t'+j+'0','t'+j+'1','t'+j+'2'],
      ok:(v,g)=>near(v,(g('t'+j+'0')+g('t'+j+'1')+g('t'+j+'2'))/3,0.0051),fill:g=>dp((g('t'+j+'0')+g('t'+j+'1')+g('t'+j+'2'))/3,2)}]),
    hint:'Read the stopwatch to 0.01 s. Mean = the three times added up, divided by 3.',
    done:'All correct. Now plot your results.',onChange:()=>ssRows()});
}
{
  const body=act('do','Plot','Plot your results','Plot distance (up the side) against mean time (along the bottom), as small crosses. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');
  const row=j=>{const m=ssTable&&ssTable.text('m'+j);return SS_D[j]+' m, '+(m?m+' s':'your mean time');};
  createPlot({host:body,
    points:SS_D.map((d,j)=>({x:+ssMean(j).toFixed(4),y:d,j:j})),
    rowText:p=>row(p.j),next:' Now find the speed from the line of best fit below.',
    graph:{xMin:0,xMax:1.2,yMin:0,yMax:400,xTicks:[0,0.2,0.4,0.6,0.8,1.0,1.2],yTicks:[0,100,200,300,400],minor:[0.02,20],snap:[0.01,10],xLabel:'mean time (s)',yLabel:'distance (m)',W:560,H:380}});
  ssRows=()=>plotLabels(body,row);ssRows();
}
{
  const body=act('do','Calculate','The speed of sound','Your line of best fit is straight. It passes through (0.20 s, 89 m) and (1.00 s, 349 m).');
  createCalc({host:body,questions:[
    {q:'Find the gradient of the line. This is the speed of sound.',unit:'m/s',answer:325,working:'gradient = [[change in distance|change in time]]<br>gradient = [[349 − 89|1.00 − 0.20]]<br>gradient = [[260|0.80]]<br>speed = 325 m/s'}
  ]});
}
{
  const body=act('do','Predict','Why does your line miss the origin?','');
  createPredict({host:body,q:'Your line of best fit crosses the distance axis at about 24 m, not at the origin. What does this show about Sophie’s timings?',options:[
    {text:'They are all a little too short',correct:true},
    {text:'They are all a little too long',why:'Times that were too long would move the line to the right, so it would cross the time axis to the right of the origin.'},
    {text:'The tape was 24 m short every time',why:'The distances were read from the same tape at every mark. The error is in the times.'},
    {text:'Sound travels faster close to Ali',why:'Sound travels at the same speed all the way across the field.'}
  ],explain:'Sophie reacts a little more slowly to seeing the blocks hit than to hearing the bang, so she starts the stopwatch late by more than she stops it late. Every time is about 0.07 s short, which moves the whole line to the left. The gradient, and so the speed, is not changed.'});
}
{
  act('do','Your turn','Now use two microphones','Drag microphone B to 0.60 m from microphone A and press Hit the plate. Count the divisions between the start of pulse A and the start of pulse B, and multiply by the time base (0.5 ms per division). Do the same at 0.90 m, 1.20 m and 1.50 m.');
}
frameAct('do','animations/speed-of-sound.html','measure&part=mics','Speed of sound experiment: two microphones and an oscilloscope','speed of sound',false);
{
  const body=act('do','Calculate','Two microphones','Write each time in ms, then work out the speed: speed = [[distance|time]], with the time in seconds. Give each speed to 3 significant figures.');
  measTable(body,{beside:true,cols:['Distance (m)','Time between pulses (ms)','Speed (m/s)'],
    rows:SS_M.map((d,j)=>[dp(d,2),{k:'dt'+j,label:'Time between the pulses at '+dp(d,2)+' m, in ms',ok:v=>SS_DT[j].some(x=>near(v,x,0.05)),fill:()=>dp(SS_DT[j][0],1)},
      {k:'v'+j,label:'Speed at '+dp(d,2)+' m, in m/s',need:['dt'+j],ok:(v,g)=>near(v,d/g('dt'+j)*1000,d/g('dt'+j)*10),fill:g=>String(Math.round(d/g('dt'+j)*1000))}]),
    hint:'Time = divisions × 0.5 ms. Change ms to s (divide by 1000) before you work out the speed.',
    done:'All correct. Compare these speeds with your stopwatch value.'});
}
{
  const body=act('experiment','Multiple choice','No stopwatch here','');
  createPredict({host:body,q:'Two microphones are 1.0 m apart. Why is the time between them measured with an oscilloscope, not a stopwatch?',options:[
    {text:'It is about 3 ms: far too short to time by hand',correct:true},
    {text:'Stopwatches cannot measure the time of a sound',why:'A stopwatch can time a sound, as in the direct method, but only if the time is much longer than a reaction time.'},
    {text:'The microphones would be too quiet to hear',why:'The microphones are not listened to. They turn the sound into a signal for the oscilloscope.'},
    {text:'An oscilloscope makes the sound travel more slowly',why:'The oscilloscope only displays the signals. The sound travels at the same speed.'}
  ],explain:'Sound crosses 1.0 m in about 0.003 s (3 ms), much shorter than a reaction time. The oscilloscope shows both pulses on the same time scale, so the time between them can be read from the screen.'});
}

/* ================= SHOW: the readings taken for you ================= */
{
  act('experiment','Your turn','Watch the readings','Press Experiment. Direct: drag Sophie to a distance and press Clap and time three times, at 4 distances from 100 m to 400 m. Then Echo: time one echo, then 20 echoes, at the same distance. Then Two microphones. Which method gives the most precise timings, and why?');
}
frameAct('experiment','animations/speed-of-sound.html','','Speed of sound animation: timing a sound over a field, echoes from a wall, and two microphones with an oscilloscope','speed of sound',false);
{
  const body=act('experiment','Multiple choice','Do the reaction times cancel?','');
  createPredict({host:body,q:'Sophie is slow to start the stopwatch and slow to stop it. Ali says the two delays cancel out, so her reaction time does not matter. Is he right?',options:[
    {text:'Not quite: her two delays are not the same',correct:true},
    {text:'Yes: the two delays always cancel out exactly',why:'Reacting to something you see and to something you hear take different times, and both vary from go to go.'},
    {text:'No: reaction time always makes the time too long',why:'The delay at the start makes the time shorter, and the one at the stop makes it longer. Overall it can go either way.'},
    {text:'Yes, as long as she uses a digital stopwatch',why:'A digital stopwatch is precise, but it cannot change how quickly she reacts.'}
  ],explain:'The delay at the start shortens the time and the delay at the stop lengthens it, so they partly cancel. But they are rarely equal, so each timing has a small error. That is why the timings scatter, and why you repeat and use a large distance.'});
}
{
  const body=act('experiment','Multiple choice','Timing one echo','');
  createPredict({host:body,q:'Charlie stands 50 m from a wall and times one echo with a stopwatch. Why are his timings so spread out?',options:[
    {text:'One echo takes about 0.3 s, close to his reaction time',correct:true},
    {text:'The echo travels more slowly than the clap itself',why:'The echo travels through the same air, at the same speed as the clap.'},
    {text:'50 m is too far away for the echo to be heard',why:'He can hear it; at 50 m it comes back about 0.3 s later.'},
    {text:'The wall absorbs a different amount of sound each time',why:'The loudness of the echo does not change how long it takes to come back.'}
  ],explain:'The sound travels 100 m there and back, in about 0.3 s. A reaction time of about 0.2 s is a big part of that. Clapping in time with the echoes and timing 20 of them makes the same reaction-time error 20 times smaller for each echo.'});
}

/* ================= RESULTS ================= */
{
  const body=act('results','Calculate','Complete the results table','Charlie times a bang three times at each distance. Work out the missing means and speeds. Give each mean to 2 decimal places.');
  const tbl=mk('div','table-scroll');
  tbl.innerHTML='<table class="units res-tbl"><thead><tr><th>Distance (m)</th><th>Time 1 (s)</th><th>Time 2 (s)</th><th>Time 3 (s)</th><th>Mean time (s)</th><th>Speed (m/s)</th></tr></thead><tbody>'+
    [['100','0.31','0.27','0.32','0.30','?'],['200','0.60','0.55','0.59','?','345'],['300','0.86','0.91','0.87','?','?'],['400','1.20','1.15','1.19','1.18','339']].map(r=>'<tr>'+r.map(c=>'<td>'+c+'</td>').join('')+'</tr>').join('')+'</tbody></table>';
  body.appendChild(tbl);
  createCalc({host:body,questions:[
    {q:'Mean time at 200 m',unit:'s',answer:0.58,working:'mean = [[0.60 + 0.55 + 0.59|3]]<br>mean = [[1.74|3]]<br>mean = 0.58 s'},
    {q:'Mean time at 300 m',unit:'s',answer:0.88,working:'mean = [[0.86 + 0.91 + 0.87|3]]<br>mean = [[2.64|3]]<br>mean = 0.88 s'},
    {q:'Speed at 300 m',unit:'m/s',answer:341,working:'speed = [[distance|time]]<br>speed = [[300|0.88]]<br>speed = 341 m/s'},
    {q:'Speed at 100 m',unit:'m/s',answer:333,working:'speed = [[distance|time]]<br>speed = [[100|0.30]]<br>speed = 333 m/s'}
  ]});
}
{
  const body=act('results','Multiple choice','The most accurate speed','');
  createPredict({host:body,q:'Use Charlie’s table. Which distance should give the most accurate speed of sound?',options:[
    {text:'400 m: reaction time matters least there',correct:true},
    {text:'100 m: the sound is loudest and easiest to hear',why:'It is easiest to hear, but 0.3 s is so short that a reaction-time error of a few hundredths of a second is a big fraction of it.'},
    {text:'None: the speed of sound is the same every time',why:'The speed of sound is the same, but the error in measuring it is not.'},
    {text:'200 m: it is in the middle of the range',why:'Being in the middle does not make a reading more accurate. The longest time has the smallest fractional error.'}
  ],explain:'The reaction-time error is about the same at every distance, so it is the smallest fraction of the longest time. At 400 m the times are close together and the speed comes out at 339 m/s.'});
}
{
  const body=act('results','Multiple choice','An anomalous result','');
  createPredict({host:body,q:'Lucas times the bang at 300 m three times. Which result is anomalous, and what should he do?',
    pre:'<div class="table-scroll"><table class="units res-tbl"><thead><tr><th></th><th>Time 1</th><th>Time 2</th><th>Time 3</th></tr></thead><tbody><tr><th>Time (s)</th><td>0.88</td><td>0.87</td><td>0.61</td></tr></tbody></table></div>',
    options:[
    {text:'0.61 s: repeat it, and leave it out of the mean',correct:true},
    {text:'0.88 s: it is the longest, so leave it out',why:'0.88 s agrees with 0.87 s. Being the longest does not make a result anomalous.'},
    {text:'0.61 s: keep it, and average it with the others',why:'Averaging it in drags the mean far too low. Repeat it, and leave it out of the mean.'},
    {text:'None: every timing counts, so use all three',why:'One timing is far from the other two, so it is probably a mistake (perhaps he started late).'}
  ],explain:'0.61 s is far from the other two, so it is anomalous: perhaps he started the stopwatch late. Repeat it, and find the mean of the timings that agree: [[0.88 + 0.87|2]] = 0.875 s.'});
}

/* ================= GRAPH ANALYSIS ================= */
const GR={xMin:0,xMax:1.4,yMin:0,yMax:400,xTicks:[0,0.2,0.4,0.6,0.8,1.0,1.2,1.4],yTicks:[0,100,200,300,400],xLabel:'time (s)',yLabel:'distance (m)',W:560,H:340};
function xmark(g0,x,y){const cx=g0.gx(x),cy=g0.gy(y);return '<path d="M'+(cx-6)+','+(cy-6)+' L'+(cx+6)+','+(cy+6)+' M'+(cx+6)+','+(cy-6)+' L'+(cx-6)+','+(cy+6)+'" stroke="var(--ink)" stroke-width="2"/>';}
function henryGraph(label){
  const g0=lineGraph(Object.assign({points:[[0,0]]},GR));
  return lineGraph(Object.assign({label:label,segments:[{pts:[[0.05,0],[1.25,400]]}],
    extra:[[0.35,100],[0.65,200],[0.95,300],[1.25,400]].map(p=>xmark(g0,p[0],p[1])).join('')},GR)).svg;
}
{
  const body=act('graphs','Calculate','Read the graph','Henry times a bang at four distances and plots distance against mean time. Read values off his line of best fit.');
  const split=mk('div','graph-split');body.appendChild(split);
  split.appendChild(mk('div','graph-box',henryGraph('Henry’s distance against time, with a straight line of best fit')));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'Use the gradient of the line to find the speed of sound.',unit:'m/s',answer:333,working:'Two points on the line: (0.35 s, 100 m) and (1.25 s, 400 m)<br>gradient = [[change in distance|change in time]]<br>gradient = [[400 − 100|1.25 − 0.35]]<br>gradient = [[300|0.90]]<br>speed = 333 m/s'},
    {q:'At what time does the line cross the time axis?',unit:'s',answer:0.05,working:'Read along the time axis where the line starts: t = 0.05 s'},
    {q:FR('Work out the speed from the 400 m point alone, using speed = [[distance|time]].'),unit:'m/s',answer:320,working:'speed = [[distance|time]]<br>speed = [[400|1.25]]<br>speed = 320 m/s'}
  ]});
}
{
  const body=act('graphs','Multiple choice','Why miss the origin?','');
  createPredict({host:body,q:'Henry’s line crosses the time axis at 0.05 s, not at 0. What is the most likely reason?',options:[
    {text:'Every timing is out by the same 0.05 s',correct:true},
    {text:'The sound took 0.05 s to start moving',why:'Sound leaves the blocks at full speed straight away.'},
    {text:'He measured every distance 0.05 m too short',why:'A distance error would shift the line up or down, and 0.05 m is far too small to see on this scale.'},
    {text:'The light took 0.05 s to reach him',why:'Light takes about a millionth of a second over these distances.'}
  ],explain:'The same error in every timing (a systematic error, here from reaction time) moves the whole line along the time axis. Henry’s times are each about 0.05 s too long: perhaps he is slower to stop the stopwatch on the sound than to start it on seeing the blocks hit. A timer who is slower to start makes every time too short, and the line crosses below the origin instead, as in the animation’s Direct runs. Either way the gradient does not change.'});
}
{
  const body=act('graphs','Multiple choice','Gradient or one point?','');
  createPredict({host:body,q:'Henry gets 333 m/s from the gradient but 320 m/s from the 400 m point alone. Which should he trust, and why?',options:[
    {text:'The gradient: the 0.05 s error cancels out',correct:true},
    {text:'The single point: it uses his longest distance',why:'The 400 m time still includes the extra 0.05 s, which makes the speed too low.'},
    {text:'The single point: it is a real reading, not a line',why:'The line uses all four readings, so it averages out the random errors too.'},
    {text:'Neither: they should be the same if he did it right',why:'They differ because of the systematic error in every timing. The gradient removes it.'}
  ],explain:'A gradient uses the change in time between two points, so an error that is the same in every timing cancels. [[distance|time]] for one point includes that error.'});
}
const GR2={xMin:0,xMax:1.7,yMin:0,yMax:5,xTicks:[0,0.34,0.68,1.02,1.36,1.7],yTicks:[0,1,2,3,4,5],xLabel:'distance between microphones (m)',yLabel:'time between pulses (ms)',W:560,H:340};
function micGraph(label){
  return lineGraph(Object.assign({label:label,segments:[{pts:[[0,0],[1.7,5]],cls:'g-line-c'}]},GR2)).svg;
}
{
  const body=act('graphs','Calculate','The axes the other way round','Some exam questions plot time up the side. Zahra moves one microphone to change the distance between them, and plots the time between the pulses against that distance.');
  const split=mk('div','graph-split');body.appendChild(split);
  split.appendChild(mk('div','graph-box',micGraph('Time between the pulses against distance between the microphones')));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'What is the time between the pulses when the microphones are 1.02 m apart?',unit:'ms',answer:3,working:'Read up from 1.02 m to the line, then across.<br>Δt = 3.0 ms'},
    {q:'Use this to work out the speed of sound.',unit:'m/s',answer:340,working:'3.0 ms = 0.0030 s<br>speed = [[distance|time]]<br>speed = [[1.02|0.0030]]<br>speed = 340 m/s'}
  ]});
}
{
  const body=act('graphs','Multiple choice','Steeper, with time up the side','');
  createPredict({host:body,q:'On a graph with time up the side and distance along the bottom, what would a steeper line mean?',options:[
    {text:'A slower sound: more time for each metre',correct:true},
    {text:'A faster sound: the line rises more quickly',why:'With time up the side, a steeper line means more time for each metre, so a slower sound.'},
    {text:'A louder sound: it reaches the microphones sooner',why:'Loudness does not change the speed of sound.'},
    {text:'Nothing: the gradient has no meaning here',why:'The gradient is [[time|distance]], which is [[1|speed]].'}
  ],explain:'Always check the axes. Distance up the side: gradient = speed. Time up the side: gradient = [[1|speed]], so a steeper line means a slower sound.'});
}
