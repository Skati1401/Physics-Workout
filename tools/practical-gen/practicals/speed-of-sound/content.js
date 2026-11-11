/* ================= METHOD TYPE: direct, echo or two microphones =================
   4PH1 mark schemes for 3.25P accept timing a sound over a measured distance (start on seeing, stop on hearing),
   an echo from a wall (the distance is there and back), or two microphones a measured distance apart with an
   oscilloscope. The Overview and Method tabs each have a "Method type" switch; the choice is shared by both tabs
   and remembered in this browser. */
const METHODS=[{k:'dir',label:'Direct'},{k:'echo',label:'Echo'},{k:'mic',label:'Two microphones'}];
const MKEY='cp-speed-of-sound-method';
let method='dir';try{const v=localStorage.getItem(MKEY);if(METHODS.some(m=>m.k===v))method=v;}catch(e){}
const methodGames=[];
function methodPicker(panel){
  const w=mk('div','method-pick');
  w.innerHTML='<span class="method-lab" id="ml-'+panel+'">Method type</span><div class="seg" role="group" aria-labelledby="ml-'+panel+'">'+
    METHODS.map(m=>'<button type="button" data-m="'+m.k+'">'+m.label+'</button>').join('')+'</div>';
  $('#panel-'+panel+' .acts').prepend(w);
  w.addEventListener('click',e=>{const b=e.target.closest('button[data-m]');if(b)setMethod(b.dataset.m);});
}
function forMethod(body,k){body.closest('.act').dataset.m=k;}
function setMethod(k){
  method=k;try{localStorage.setItem(MKEY,k);}catch(e){}
  $$('.method-pick button').forEach(b=>{const on=b.dataset.m===k;b.classList.toggle('is-on',on);b.setAttribute('aria-pressed',String(on));});
  $$('.act[data-m]').forEach(a=>{a.hidden=a.dataset.m!==k;});
  raf(()=>methodGames.forEach(g=>g.reflow&&g.reflow()));
}
reflowers.push(()=>raf(()=>methodGames.forEach(g=>g.reflow&&g.reflow())));
function clozeAct(panel,k,title,parts,distractors){
  const body=act(panel,'Fill in the blanks',title,'Drag a word into each gap, or tap a word and then tap a gap. Some words are not needed.');
  forMethod(body,k);
  const cloze=mk('div','cloze'),slots=[],chips=[];
  parts.forEach(p=>{
    if(typeof p==='string'){const t=document.createElement('template');t.innerHTML=FR(p);cloze.appendChild(t.content);}
    else{const s=mk('span','blank');cloze.appendChild(s);slots.push({id:p[0],el:s,answer:p[1]});chips.push({id:'c-'+p[0],text:p[1]});}
  });
  distractors.forEach((t,i)=>chips.push({id:'d'+i,text:t}));
  body.appendChild(cloze);
  body.appendChild(mk('div','pool-label','Word bank'));
  const pool=mk('div','chip-pool');body.appendChild(pool);
  const g={};
  const b=bar(body,[{label:'Check answers',primary:true,fn:()=>g.check()},{label:'Shuffle again',fn:()=>g.reset()}]);
  const score=mk('span','score');b.el.insertBefore(score,b.msg);
  Object.assign(g,createBlankGame({fill:true,slots,pool,chips,msg:b,score,isCorrect:(c,s)=>c.text===s.answer}));
}
const ORDER_INTRO='Put the steps in the order you would do them. Drag the ≡ handle, or use the ▲▼ buttons.';
const MATCH_INTRO='Pair each piece of equipment with its job. Drag one card onto the other, or tap one card and then the other.';

/* ================= 1. OVERVIEW ================= */
methodPicker('overview');
clozeAct('overview','dir','The practical: timing a sound over a measured distance',[
  'Ali and Sophie stand at least ',['b1','100 m'],' apart on a large, flat field, and measure the distance between them with a ',['b2','trundle wheel'],
  ' or a long tape measure. Ali bangs two wooden blocks together above his head, so the sound can be seen being made. Sophie ',['b3','starts'],
  ' her stopwatch when she sees the blocks hit, and stops it when she ',['b4','hears'],' the sound. Light travels so fast that it arrives almost ',['b5','instantly'],
  ', so the stopwatch measures the time the sound took. Repeat the timing several times and find the ',['b6','mean'],' of the times. Then the speed of sound = [[distance|mean time]], which is about ',
  ['b7','340 m/s'],'. The biggest source of error is Sophie’s ',['b8','reaction time'],', so a large distance is used: then that error is only a small fraction of the time.'
],['10 m','3 × 10⁸ m/s','stops','echo']);
clozeAct('overview','echo','The practical with an echo',[
  'Ali stands at least ',['e1','50 m'],' from a large, flat ',['e2','wall'],' and measures the distance to it with a trundle wheel. When he claps, the sound is ',['e3','reflected'],
  ' by the wall and he hears an echo. The sound goes to the wall and back, so it travels ',['e4','twice'],' the distance to the wall. One echo takes less than a second, which is too short to time well by hand. So Ali claps in a steady rhythm, so that each clap is at the same moment as the ',
  ['e5','echo'],' of the one before. Sophie times ',['e6','20'],' intervals, from the 1st clap to the 21st, and divides the time by 20 to find the time for one echo. Speed of sound = [[2 × distance to the wall|time for one echo]].'
],['5 m','half','refracted','light']);
clozeAct('overview','mic','The practical with two microphones',[
  'Two ',['m1','microphones'],' are placed in a straight line with a sound source, about 1 m apart, and the distance between them is measured with a ',['m2','metre rule'],
  '. Each one is connected to a dual-trace ',['m3','oscilloscope'],'. A sharp sound, such as a hammer hitting a metal plate, reaches the nearer microphone first. Read the time between the two pulses from the screen: count the divisions between them and multiply by the ',
  ['m4','time base'],'. No one has to start or stop a timer, so there is no error from a person’s ',['m5','reaction time'],'. Speed of sound = [[distance between the microphones|time between the pulses]].'
],['loudspeakers','amplitude','protractor','frequency']);
{
  const body=act('overview','Predict','What an echo shows','');
  createPredict({host:body,q:'Ali claps near a large wall and hears an echo. What does the echo show about sound waves?',options:[
    {text:'Sound waves can be reflected',correct:true},
    {text:'Sound waves are transverse waves',why:'An echo does not show which way the air vibrates. Sound is a longitudinal wave.'},
    {text:'Sound speeds up when it bounces',why:'The echo travels through the same air, so it has the same speed there and back.'},
    {text:'Sound waves can be refracted',why:'Refraction is a change of direction when a wave changes speed. An echo is a wave bouncing back: reflection.'}
  ],explain:'An echo is sound reflected by a hard, flat surface. Sound waves can be reflected and refracted, like light, but they are longitudinal waves.'});
}
{
  const body=act('overview','Predict','A longitudinal wave','');
  createPredict({host:body,q:'Sound waves are longitudinal. What does that mean?',options:[
    {text:'The air vibrates along the direction the wave travels',correct:true},
    {text:'The air vibrates at right angles to the direction of travel',why:'That is a transverse wave, such as light or a wave on a rope.'},
    {text:'The air itself flows from the source to your ear',why:'A wave transfers energy, not matter: each bit of air vibrates back and forth about one place.'},
    {text:'The wave has a long wavelength compared with light',why:'Sound does have a much longer wavelength than light, but that is not what longitudinal means.'}
  ],explain:'In a longitudinal wave the particles vibrate parallel to the direction the wave travels, making compressions and rarefactions.'});
}

/* ================= 2. METHOD ================= */
methodPicker('method');
{
  const body=act('method','Order','Time a sound over a measured distance',ORDER_INTRO);forMethod(body,'dir');
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
  const body=act('method','Order','Time echoes from a wall',ORDER_INTRO);forMethod(body,'echo');
  createReorder({host:body,steps:[
    {id:'a',text:'Find a large, flat wall with open space in front of it and no other buildings nearby.'},
    {id:'b',text:'Stand at least 50 m from the wall and measure the distance to it with a trundle wheel or tape measure.'},
    {id:'c',text:'Clap once and listen for the echo.'},
    {id:'d',text:'Clap in a steady rhythm, changing it until each clap is at the same moment as the echo of the one before.'},
    {id:'e',text:'A partner starts the stopwatch on one clap and stops it 20 claps later.'},
    {id:'f',text:'Divide the time by 20 to get the time for one echo. Repeat and find the mean.'},
    {id:'g',text:'Work out speed = [[2 × distance to the wall|time for one echo]].'}
  ],constraints:[['a','b'],['b','c'],['c','d'],['d','e'],['e','f'],['f','g']],
  why:'Measure the distance first. Get the rhythm right before timing, time many echoes at once, then divide. The sound goes there and back, so the distance is doubled.'});
}
{
  const body=act('method','Order','Use two microphones and an oscilloscope',ORDER_INTRO);forMethod(body,'mic');
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
{
  const body=act('method','Match','What each piece of equipment is for',MATCH_INTRO);forMethod(body,'dir');
  methodGames.push(createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'t',l:'Trundle wheel',r:'Measures the long distance between the two people'},
    {id:'s',l:'Stopwatch',r:'Times from seeing the blocks hit to hearing the sound'},
    {id:'b',l:'Two wooden blocks',r:'Make a loud sound that can also be seen being made'},
    {id:'f',l:'Large, open field',r:'Gives a long distance, with no walls to cause echoes'},
    {id:'n',l:'Several timers',r:'Give more timings of the same bang, for a reliable mean'}
  ]}));
}
{
  const body=act('method','Match','What each piece of equipment is for',MATCH_INTRO);forMethod(body,'echo');
  methodGames.push(createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'w',l:'Large, flat wall',r:'Reflects the sound straight back as a clear echo'},
    {id:'t',l:'Trundle wheel',r:'Measures the distance from you to the wall'},
    {id:'o',l:'Open space with no other walls',r:'Means there is only one echo to listen for'},
    {id:'c',l:'Claps in a steady rhythm',r:'Let you time many echoes in one go'},
    {id:'s',l:'Stopwatch',r:'Times 20 intervals between the claps'}
  ]}));
}
{
  const body=act('method','Match','What each piece of equipment is for',MATCH_INTRO);forMethod(body,'mic');
  methodGames.push(createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'m',l:'Two microphones',r:'Detect the sound as it passes each one'},
    {id:'o',l:'Dual-trace oscilloscope',r:'Shows both pulses against the same time scale'},
    {id:'t',l:'Time base (ms per division)',r:'Turns divisions on the screen into a time'},
    {id:'r',l:'Metre rule',r:'Measures the distance between the microphones'},
    {id:'h',l:'Hammer and metal plate',r:'Make a short, sharp sound with a clear start'}
  ]}));
}
{
  const body=act('method','Sort','Which method?','Which method is each card about? Sort each card, then press Check.');
  createSortGame({host:body,cats:[
    {id:'dir',label:'Direct',hint:'',color:'--c1',soft:'--c1-soft'},
    {id:'echo',label:'Echo',hint:'',color:'--c2',soft:'--c2-soft'},
    {id:'mic',label:'Two microphones',hint:'',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Start timing on seeing the sound being made',cat:'dir'},
    {id:'2',text:'The two people stand at least 100 m apart',cat:'dir'},
    {id:'3',text:'The sound travels to the wall and back',cat:'echo'},
    {id:'4',text:'Clap in time with the sound coming back',cat:'echo'},
    {id:'5',text:'No reaction time in the time measured',cat:'mic'},
    {id:'6',text:'The time is read from a screen, in milliseconds',cat:'mic'}
  ]});
}
setMethod(method);

/* ================= 3. VARIABLES ================= */
{
  const body=act('variables','Sort','Which kind of variable is it?','Charlie times a sound over several distances and plots a distance–time graph. Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'i',label:'Independent',hint:'You change it',color:'--c1',soft:'--c1-soft'},
    {id:'d',label:'Dependent',hint:'You measure it',color:'--c2',soft:'--c2-soft'},
    {id:'c',label:'Control',hint:'You keep it the same',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'The distance between the sound and the timer',cat:'i'},
    {id:'2',text:'The distance between the two microphones',cat:'i'},
    {id:'3',text:'The time on the stopwatch',cat:'d'},
    {id:'4',text:'The time between the two pulses on the screen',cat:'d'},
    {id:'5',text:'The person who does the timing',cat:'c'},
    {id:'6',text:'The air temperature (do every reading on the same day)',cat:'c'},
    {id:'7',text:'The wind (choose a still day)',cat:'c'}
  ]});
}
{
  const body=act('variables','Predict','A new question to test','');
  createPredict({host:body,q:'Hana wants to find out how the air temperature affects the speed of sound. What is her independent variable?',options:[
    {text:'The temperature of the air',correct:true},
    {text:'The time the sound takes',why:'She measures the time to work out the speed. It is not what she chooses to change.'},
    {text:'The speed of the sound',why:'The speed is what she works out, so it depends on the temperature.'},
    {text:'The distance the sound travels',why:'She keeps the distance the same, so it is a control variable.'}
  ],explain:'The independent variable is the one she changes on purpose: the air temperature. She keeps the distance and the method the same, and works out the speed at each temperature.'});
}
{
  const body=act('variables','Predict','Why so far apart?','');
  createPredict({host:body,q:'Why do Ali and Sophie stand at least 100 m apart, rather than 10 m?',options:[
    {text:'So reaction time is a small part of the time',correct:true},
    {text:'So the sound is loud enough for Sophie to hear',why:'The sound is louder when she is closer, not further away.'},
    {text:'So the light has time to arrive before the sound',why:'Light arrives almost instantly at any distance. The problem is timing by hand.'},
    {text:'So the sound has time to reach its full speed',why:'Sound travels at a steady speed through the air from the start.'}
  ],explain:'Over 10 m the sound takes only about 0.03 s, far shorter than a reaction time of about 0.2 s. Over 100 m or more it takes 0.3 s or longer, so the same reaction-time error is a much smaller fraction of the time.'});
}

/* ================= EXPERIMENT ================= */
{
  act('experiment','Your turn','Take your own readings','Press Experiment. Direct method: drag Sophie to a distance and press Clap and time three times; do at least 4 distances from 100 m to 400 m. Then try Echo, once timing 1 echo and once timing 20 echoes, and then Two microphones. Which method gives the most precise timings, and why? Which distance gives the most reliable speed with a stopwatch?');
}
frameAct('experiment','animations/speed-of-sound.html','','Speed of sound animation: timing a sound over a field, echoes from a wall, and two microphones with an oscilloscope','speed of sound',false);
{
  const body=act('experiment','Predict','Do the reaction times cancel?','');
  createPredict({host:body,q:'Sophie is slow to start the stopwatch and slow to stop it. Ali says the two delays cancel out, so her reaction time does not matter. Is he right?',options:[
    {text:'Not quite: her two delays are not the same',correct:true},
    {text:'Yes: the two delays always cancel out exactly',why:'Reacting to something you see and to something you hear take different times, and both vary from go to go.'},
    {text:'No: reaction time always makes the time too long',why:'The delay at the start makes the time shorter, and the one at the stop makes it longer. Overall it can go either way.'},
    {text:'Yes, as long as she uses a digital stopwatch',why:'A digital stopwatch is precise, but it cannot change how quickly she reacts.'}
  ],explain:'The delay at the start shortens the time and the delay at the stop lengthens it, so they partly cancel. But they are rarely equal, so each timing has a small error. That is why the timings scatter, and why you repeat and use a large distance.'});
}
{
  const body=act('experiment','Predict','What about the light?','');
  createPredict({host:body,q:'Sophie starts timing when she sees the blocks hit. Why can she ignore the time the light takes to reach her?',options:[
    {text:'Light is about a million times faster',correct:true},
    {text:'Light and sound take the same time to arrive',why:'If they did, she would hear the bang at the same moment she saw it. The sound arrives later.'},
    {text:'Light does not need to travel to reach her',why:'Light does travel, but at 300 000 000 m/s it crosses 200 m in less than a millionth of a second.'},
    {text:'Her stopwatch only measures the sound’s time',why:'A stopwatch measures the time between start and stop, whatever starts it.'}
  ],explain:'Light crosses a few hundred metres in about a millionth of a second, so it arrives almost instantly. The time on the stopwatch is the time the sound took.'});
}
{
  const body=act('experiment','Predict','Timing one echo','');
  createPredict({host:body,q:'Charlie stands 50 m from a wall and times one echo with a stopwatch. Why are his timings so spread out?',options:[
    {text:'One echo takes about 0.3 s, close to his reaction time',correct:true},
    {text:'The echo travels more slowly than the clap itself',why:'The echo travels through the same air, at the same speed as the clap.'},
    {text:'50 m is too far away for the echo to be heard',why:'He can hear it; at 50 m it comes back about 0.3 s later.'},
    {text:'The wall absorbs a different amount of sound each time',why:'The loudness of the echo does not change how long it takes to come back.'}
  ],explain:'The sound travels 100 m there and back, in about 0.3 s. A reaction time of about 0.2 s is a big part of that. Clapping in time with the echoes and timing 20 of them makes the same reaction-time error 20 times smaller for each echo.'});
}
{
  const body=act('experiment','Predict','No stopwatch here','');
  createPredict({host:body,q:'Two microphones are 1.0 m apart. Why is the time between them measured with an oscilloscope, not a stopwatch?',options:[
    {text:'It is about 3 ms: far too short to time by hand',correct:true},
    {text:'Stopwatches cannot measure the time of a sound',why:'A stopwatch can time a sound, as in the direct method, but only if the time is much longer than a reaction time.'},
    {text:'The microphones would be too quiet to hear',why:'The microphones are not listened to. They turn the sound into a signal for the oscilloscope.'},
    {text:'An oscilloscope makes the sound travel more slowly',why:'The oscilloscope only displays the signals. The sound travels at the same speed.'}
  ],explain:'Sound crosses 1.0 m in about 0.003 s (3 ms), much shorter than a reaction time. The oscilloscope shows both pulses on the same time scale, so the time between them can be read from the screen.'});
}

/* ================= 4. RESULTS ================= */
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
  const body=act('results','Plot','Plot Charlie’s results','Plot each mean time from Charlie’s table as a small cross: distance up the side, time along the bottom. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');
  createPlot({host:body,
    points:[{x:0.30,y:100},{x:0.58,y:200},{x:0.88,y:300},{x:1.18,y:400}],
    rowText:p=>fmt(p.x,2)+' s, '+p.y+' m',
    graph:{xMin:0,xMax:1.2,yMin:0,yMax:400,xTicks:[0,0.2,0.4,0.6,0.8,1.0,1.2],yTicks:[0,100,200,300,400],minor:[0.1,50],snap:[0.02,10],xLabel:'mean time (s)',yLabel:'distance (m)',W:560,H:360}});
}
{
  const body=act('results','Predict','The most accurate speed','');
  createPredict({host:body,q:'Use Charlie’s table. Which distance should give the most accurate speed of sound?',options:[
    {text:'400 m: reaction time matters least there',correct:true},
    {text:'100 m: the sound is loudest and easiest to hear',why:'It is easiest to hear, but 0.3 s is so short that a reaction-time error of a few hundredths of a second is a big fraction of it.'},
    {text:'None: the speed of sound is the same every time',why:'The speed of sound is the same, but the error in measuring it is not.'},
    {text:'200 m: it is in the middle of the range',why:'Being in the middle does not make a reading more accurate. The longest time has the smallest fractional error.'}
  ],explain:'The reaction-time error is about the same at every distance, so it is the smallest fraction of the longest time. At 400 m the times are close together and the speed comes out at 339 m/s.'});
}
{
  const body=act('results','Predict','The line of best fit','');
  createPredict({host:body,q:'What line of best fit should Charlie draw through his plotted points?',options:[
    {text:'A straight line, close to the origin',correct:true},
    {text:'A curve, as the sound slows down further away',why:'Sound travels at a steady speed, so equal extra distances take equal extra times: a straight line.'},
    {text:'Short straight lines joining each point to the next',why:'Joining the dots follows every small timing error. A line of best fit shows the trend.'},
    {text:'A horizontal line, as the speed stays constant',why:'A horizontal line on a distance–time graph would mean no distance covered. Constant speed is a straight sloping line.'}
  ],explain:'Sound travels at a constant speed, so distance against time is a straight line. Its gradient is the speed of sound. Reaction time can shift the line a little, so it may not pass exactly through the origin.'});
}
{
  const body=act('results','Predict','An anomalous result','');
  createPredict({host:body,q:'Lucas times the bang at 300 m three times. Which result is anomalous, and what should he do?',
    pre:'<div class="table-scroll"><table class="units res-tbl"><thead><tr><th></th><th>Time 1</th><th>Time 2</th><th>Time 3</th></tr></thead><tbody><tr><th>Time (s)</th><td>0.88</td><td>0.87</td><td>0.61</td></tr></tbody></table></div>',
    options:[
    {text:'0.61 s: repeat it, and leave it out of the mean',correct:true},
    {text:'0.88 s: it is the longest, so leave it out',why:'0.88 s agrees with 0.87 s. Being the longest does not make a result anomalous.'},
    {text:'0.61 s: keep it, and average it with the others',why:'Averaging it in drags the mean far too low. Repeat it, and leave it out of the mean.'},
    {text:'None: every timing counts, so use all three',why:'One timing is far from the other two, so it is probably a mistake (perhaps he started late).'}
  ],explain:'0.61 s is far from the other two, so it is anomalous: perhaps he started the stopwatch late. Repeat it, and find the mean of the timings that agree: [[0.88 + 0.87|2]] = 0.875 s.'});
}
{
  const body=act('results','Predict','Several timers','');
  createPredict({host:body,q:'Four students all time the same bang from 300 m: 0.88 s, 0.86 s, 0.91 s and 0.87 s. Why is it better to use all four timings?',options:[
    {text:'Their mean is more reliable than one timing',correct:true},
    {text:'The four reaction times cancel out exactly',why:'Some are early and some late, so errors partly cancel in the mean, but not exactly.'},
    {text:'It makes the sound travel at a steadier speed',why:'The timers do not change the sound. They give more readings of the same thing.'},
    {text:'The shortest of the four times is the true one',why:'The shortest could be someone stopping early. Use the mean.'}
  ],explain:'Each timer makes a different small error. Taking the mean of several timings of the same bang, or repeating the bang, gives a more reliable time.'});
}

/* ================= 5. GRAPHS ================= */
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
  const body=act('graphs','Predict','Why miss the origin?','');
  createPredict({host:body,q:'Henry’s line crosses the time axis at 0.05 s, not at 0. What is the most likely reason?',options:[
    {text:'Every timing is out by the same 0.05 s',correct:true},
    {text:'The sound took 0.05 s to start moving',why:'Sound leaves the blocks at full speed straight away.'},
    {text:'He measured every distance 0.05 m too short',why:'A distance error would shift the line up or down, and 0.05 m is far too small to see on this scale.'},
    {text:'The light took 0.05 s to reach him',why:'Light takes about a millionth of a second over these distances.'}
  ],explain:'The same error in every timing (a systematic error, here from reaction time) moves the whole line along the time axis. Henry’s times are each about 0.05 s too long: perhaps he is slower to stop the stopwatch on the sound than to start it on seeing the blocks hit. A timer who is slower to start makes every time too short, and the line crosses below the origin instead, as in the animation’s Direct runs. Either way the gradient does not change.'});
}
{
  const body=act('graphs','Predict','Gradient or one point?','');
  createPredict({host:body,q:'Henry gets 333 m/s from the gradient but 320 m/s from the 400 m point alone. Which should he trust, and why?',options:[
    {text:'The gradient: the 0.05 s error cancels out',correct:true},
    {text:'The single point: it uses his longest distance',why:'The 400 m time still includes the extra 0.05 s, which makes the speed too low.'},
    {text:'The single point: it is a real reading, not a line',why:'The line uses all four readings, so it averages out the random errors too.'},
    {text:'Neither: they should be the same if he did it right',why:'They differ because of the systematic error in every timing. The gradient removes it.'}
  ],explain:'A gradient uses the change in time between two points, so an error that is the same in every timing cancels. [[distance|time]] for one point includes that error.'});
}
/* the same idea with the axes the other way round */
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
  const body=act('graphs','Predict','Steeper, with time up the side','');
  createPredict({host:body,q:'On a graph with time up the side and distance along the bottom, what would a steeper line mean?',options:[
    {text:'A slower sound: more time for each metre',correct:true},
    {text:'A faster sound: the line rises more quickly',why:'With time up the side, a steeper line means more time for each metre, so a slower sound.'},
    {text:'A louder sound: it reaches the microphones sooner',why:'Loudness does not change the speed of sound.'},
    {text:'Nothing: the gradient has no meaning here',why:'The gradient is [[time|distance]], which is [[1|speed]].'}
  ],explain:'Always check the axes. Distance up the side: gradient = speed. Time up the side: gradient = [[1|speed]], so a steeper line means a slower sound.'});
}
{
  const body=act('graphs','Predict','Through the origin','');
  createPredict({host:body,q:'Zahra’s line goes through the origin, but Henry’s does not. Why?',options:[
    {text:'Her times have no reaction-time error',correct:true},
    {text:'Sound travels faster over short distances',why:'Sound travels at the same speed over any distance in the same air.'},
    {text:'She used a metre rule, not a trundle wheel',why:'The distances are both measured well. The difference is in the timing.'},
    {text:'Her graph has time up the side instead',why:'Swapping the axes does not move a line away from the origin or onto it.'}
  ],explain:'The oscilloscope measures the time between the pulses directly, so there is no systematic error from starting or stopping a stopwatch. Zero distance gives zero time.'});
}

/* ================= 6. CALCULATE ================= */
{
  const body=act('calculate','Calculate','Using speed = [[distance|time]]','Give each answer in the unit shown. Take the speed of sound as 340 m/s where you need it.');
  createCalc({host:body,questions:[
    {q:'Thunder is heard 5.0 s after the lightning is seen. How far away is the storm?',unit:'m',answer:1700,working:'speed = [[distance|time]]<br>340 = [[d|5.0]]<br>d = 340 × 5.0<br>d = 1700 m'},
    {q:'Hana stands 85 m from a wall and hears the echo of a clap 0.50 s later. What speed does this give?',unit:'m/s',answer:340,working:'distance = 2 × 85<br>distance = 170 m<br>speed = [[distance|time]]<br>speed = [[170|0.50]]<br>speed = 340 m/s'},
    {q:'Ali claps in time with the echoes from a wall 99 m away. Twenty echoes take 11.6 s. What speed does this give?',unit:'m/s',answer:341,working:'one echo = [[11.6|20]]<br>one echo = 0.58 s<br>distance = 2 × 99<br>distance = 198 m<br>speed = [[198|0.58]]<br>speed = 341 m/s'},
    {q:'Two microphones are 1.02 m apart. On the oscilloscope the pulses are 6.0 divisions apart, with a time base of 0.5 ms/div. What speed does this give?',unit:'m/s',answer:340,working:'Δt = 6.0 × 0.5<br>Δt = 3.0 ms<br>Δt = 0.0030 s<br>speed = [[1.02|0.0030]]<br>speed = 340 m/s'}
  ]});
}

/* ================= 7. ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Better results or safer?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'Better results',hint:'More accurate or more reliable timings',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps people safe',hint:'Protects people and their hearing',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Use a distance of at least 100 m',cat:'a'},
    {id:'2',text:'Repeat each timing and find the mean',cat:'a'},
    {id:'3',text:'Use several timers and average their times',cat:'a'},
    {id:'4',text:'Measure the distance with a trundle wheel, not a metre rule',cat:'a'},
    {id:'5',text:'Choose a still day, with no wind',cat:'a'},
    {id:'6',text:'Choose a field well away from roads and traffic',cat:'s'},
    {id:'7',text:'Never make a loud sound right next to someone’s ear',cat:'s'},
    {id:'8',text:'Keep your fingers clear of the blocks as they hit',cat:'s'}
  ]});
}
{
  const body=act('accuracy','Predict','Measuring 100 m','');
  createPredict({host:body,q:'Elena measures 100 m with a metre rule. Why is that a poor choice?',options:[
    {text:'Laying it 100 times adds an error each time',correct:true},
    {text:'It cannot be read to the nearest millimetre',why:'A metre rule reads to 1 mm, far better than needed. The problem is laying it end to end 100 times.'},
    {text:'Metre rules are only for indoor experiments',why:'The problem is not where it is used, but how many times it must be moved.'},
    {text:'It measures in centimetres, not in metres',why:'Units can be converted. The errors from moving it 100 times cannot.'}
  ],explain:'Each time the rule is moved there is a small error, and it may not stay in a straight line. Over 100 lengths these add up, and miscounting is easy. A trundle wheel or a long tape measure is better.'});
}
{
  const body=act('accuracy','Predict','A windy day','');
  createPredict({host:body,q:'Why should the direct method be done on a still day?',options:[
    {text:'Moving air changes the sound’s speed',correct:true},
    {text:'Wind makes the blocks harder to see clearly',why:'The blocks are just as easy to see in the wind. The wind moves the air the sound travels through.'},
    {text:'Wind stops the sound from travelling far',why:'Wind can make a sound quieter or louder, but the main problem is that it changes the speed.'},
    {text:'Wind bends the light coming from the blocks',why:'Wind has no effect on light.'}
  ],explain:'Sound travels through the air, so if the air is moving, the sound is carried faster with the wind and slower against it. A still day, or timing in both directions and averaging, avoids this.'});
}

/* ================= EXAM PRACTICE ================= */
{
  const body=act('exam','Exam style','Measuring the speed of sound','Ananya and her friends time a bang over a field at five distances. The table shows the mean times. One result is missing.');
  const tbl=mk('div','table-scroll');
  tbl.innerHTML='<table class="units res-tbl"><thead><tr><th>Distance (m)</th><th>100</th><th>150</th><th>200</th><th>250</th><th>300</th></tr></thead><tbody><tr><th>Mean time (s)</th><td>0.29</td><td>0.44</td><td>0.59</td><td><b>?</b></td><td>0.89</td></tr></tbody></table>';
  body.appendChild(tbl);
  body.appendChild(mk('p','sub','(a) 2 marks'));
  createCalc({host:body,questions:[
    {q:'Predict the missing mean time at 250 m.',unit:'s',answer:0.74,working:'Each extra 50 m adds about 0.15 s.<br>0.59 + 0.15 = 0.74 s'}
  ]});
  body.appendChild(mk('p','sub','(b) 3 marks'));
  createCalc({host:body,questions:[
    {q:'Calculate the speed of sound, using the result for 300 m.',unit:'m/s',answer:337,working:'speed = [[distance|time]]<br>speed = [[300|0.89]]<br>speed = 337 m/s'}
  ]});
  body.appendChild(mk('p','sub','(c) 5 marks'));
  body.appendChild(mk('p','','Elena tries the same practical on her own. She measures 50 m with a metre rule. She makes a bang, and times it once with a stopwatch, starting when she hears the bang leave and stopping when she hears it arrive. Evaluate her method.'));
  const d1=mk('details','');
  d1.innerHTML='<summary>Check your answer</summary><div><ul><li>50 m is too short: the sound takes only about 0.15 s.</li><li>Her reaction time (about 0.2 s) is large compared with the time being measured.</li><li>A metre rule is unsuitable for 50 m: errors add up each time it is moved, it may not stay straight, and lengths can be miscounted. Use a trundle wheel or tape measure.</li><li>She should start timing when she sees the bang being made, as light arrives almost instantly.</li><li>She takes only one timing: she should repeat it and find a mean.</li><li>Improvements: use 100 m or more, a visible signal, several timers and repeats.</li></ul><p class="sub">Any five points score.</p></div>';
  body.appendChild(d1);
  body.appendChild(mk('p','sub','(d) 5 marks'));
  body.appendChild(mk('p','','Describe how Ananya could use an echo from a wall to measure the speed of sound.'));
  const d2=mk('details','');
  d2.innerHTML='<summary>Check your answer</summary><div><ul><li>Stand at least 50 m from a large, flat wall.</li><li>Measure the distance to the wall with a trundle wheel or tape measure.</li><li>Clap, and listen for the echo.</li><li>Clap in a steady rhythm, so each clap is at the same moment as the echo of the one before.</li><li>Use a stopwatch to time 20 intervals (from the 1st clap to the 21st), and divide by 20 to find the time for one echo.</li><li>Repeat and find the mean.</li><li>The sound goes there and back, so speed = [[2 × distance to the wall|time for one echo]].</li></ul><p class="sub">Any five points score. A clearly labelled diagram can also score.</p></div>';
  d2.querySelector('div').innerHTML=FR(d2.querySelector('div').innerHTML);
  body.appendChild(d2);
  body.appendChild(mk('p','sub','(e) 2 marks'));
  body.appendChild(mk('p','','Suggest one change to the equipment that would remove the error from reaction time. Explain how it helps.'));
  const d3=mk('details','');
  d3.innerHTML='<summary>Check your answer</summary><div><ul><li>Use two microphones a measured distance apart, connected to an oscilloscope (or an electronic timer / data logger).</li><li>The time is measured electronically, so no one has to react to start or stop a stopwatch.</li></ul></div>';
  body.appendChild(d3);
  body.appendChild(mk('p','sub','(f) 3 marks'));
  createCalc({host:body,questions:[
    {q:'Two microphones are 0.86 m apart. On the oscilloscope the two pulses are 5.0 divisions apart, with a time base of 0.5 ms/div. Calculate the speed of sound.',unit:'m/s',answer:344,working:'Δt = 5.0 × 0.5<br>Δt = 2.5 ms<br>Δt = 0.0025 s<br>speed = [[distance|time]]<br>speed = [[0.86|0.0025]]<br>speed = 344 m/s'}
  ]});
  body.appendChild(mk('p','sub','(g) 2 marks'));
  body.appendChild(mk('p','','Ananya hears an echo from a building. State what this shows about sound waves, and name the type of wave sound is.'));
  const d4=mk('details','');
  d4.innerHTML='<summary>Check your answer</summary><div><ul><li>Sound waves can be reflected.</li><li>Sound is a longitudinal wave.</li></ul></div>';
  body.appendChild(d4);
}
