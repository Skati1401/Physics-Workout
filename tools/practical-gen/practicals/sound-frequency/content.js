/* 3.27P Frequency of a sound wave with an oscilloscope. Observe-and-measure: the Variables, Results and Graphs
   tabs of the model page became Reading Traces, Pitch and Loudness and Hearing (3.24P, 3.26P, 3.28P, 3.29P).
   Mark scheme wording from the IGCSE Question Index (see tools/CORE-PRACTICALS.md). */
function examPart(body,head,q,bullets){
  body.appendChild(mk('p','sub',head));
  body.appendChild(mk('p','',FR(q)));
  const d=mk('details','');
  d.innerHTML='<summary>Check your answer</summary><div><ul>'+bullets.map(b=>'<li>'+FR(b)+'</li>').join('')+'</ul></div>';
  body.appendChild(d);
}
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

/* ================= 1. OVERVIEW ================= */
{
  const body=act('overview','Fill in the blanks','The practical in one passage','Drag a word into each gap, or tap a word and then tap a gap. Some words are not needed.');
  const parts=[
    'Connect a ',['b1','microphone'],' to the input of an oscilloscope, and play a steady note from a signal generator and loudspeaker or a tuning fork. Adjust the oscilloscope until the trace is ',['b2','steady'],
    '. Set the ',['b3','time base'],' so that several complete cycles fit across the screen, and the Y-gain so the trace is as tall as possible without going off the screen. Count the divisions across a number of complete cycles, divide by the number of cycles, and multiply by the time base to find the ',['b4','period'],
    ', T. The frequency is f = [[1|T]], in ',['b5','hertz'],'. A sound with a higher pitch has a higher ',['b6','frequency'],', so more cycles fit on the screen. A louder sound has a larger ',['b7','amplitude'],
    ', so the trace is taller. Humans can hear frequencies from 20 Hz to ',['b8','20 000 Hz'],'.'
  ];
  const cloze=mk('div','cloze'),slots=[],chips=[];
  parts.forEach(p=>{
    if(typeof p==='string')cloze.appendChild(mk('span','',FR(p)));
    else{const s=mk('span','blank');cloze.appendChild(s);slots.push({id:p[0],el:s,answer:p[1]});chips.push({id:'c-'+p[0],text:p[1]});}
  });
  ['wavelength','speed','2000 Hz','Y-gain'].forEach((t,i)=>chips.push({id:'d'+i,text:t}));
  body.appendChild(cloze);
  body.appendChild(mk('div','pool-label','Word bank'));
  const pool=mk('div','chip-pool');body.appendChild(pool);
  const g={};
  const b=bar(body,[{label:'Check',primary:true,fn:()=>g.check()},{label:'Shuffle again',fn:()=>g.reset()}]);
  const score=mk('span','score');b.el.insertBefore(score,b.msg);
  Object.assign(g,createBlankGame({slots,pool,chips,msg:b,score,isCorrect:(c,s)=>c.text===s.answer}));
}

/* ================= 2. METHOD ================= */
{
  const body=act('method','Order','Measure the frequency of a sound','Put the steps in the order you would do them. Drag the ≡ handle, or use the ▲▼ buttons.');
  createReorder({host:body,steps:[
    {id:'a',text:'Connect a microphone to the input of the oscilloscope.'},
    {id:'b',text:'Play a steady note near the microphone.'},
    {id:'c',text:'Adjust the oscilloscope (the trigger) to get a steady trace.'},
    {id:'d',text:'Adjust the time base so that several complete cycles are on the screen.'},
    {id:'e',text:'Count the divisions across as many complete cycles as you can.'},
    {id:'f',text:'Divide by the number of cycles, and multiply by the time base, to find T.'},
    {id:'g',text:'Work out the frequency with f = [[1|T]].'}
  ],constraints:[['a','c'],['b','c'],['c','e'],['d','e'],['e','f'],['f','g']],
  why:'The trace must be steady, with several complete cycles on the screen, before you count divisions. Divisions × time base gives the time for those cycles; dividing by the number of cycles gives T, then f = [[1|T]].'});
}
{
  const body=act('method','Match','What each part does','Pair each part with its job. Drag one card onto the other, or tap one card and then the other.');
  createMatchGame({host:body,leftTitle:'Part',rightTitle:'Its job',pairs:[
    {id:'m',l:'Microphone',r:'Turns the sound into a changing voltage for the oscilloscope'},
    {id:'s',l:'Signal generator and loudspeaker',r:'Make a steady note whose frequency can be changed'},
    {id:'t',l:'Time base',r:'Sets the time each division across the screen stands for'},
    {id:'y',l:'Y-gain',r:'Sets the voltage each division up the screen stands for'},
    {id:'g',l:'Trigger',r:'Starts each sweep at the same point, so the trace stands still'},
    {id:'f',l:'Tuning fork',r:'Gives a note of one fixed frequency when it is struck'}
  ]});
}
{
  const body=act('method','Spot the error','Find the mistake in a method','Elena’s method has exactly one wrong step. Click the step with the mistake.');
  const grid=mk('div','');body.appendChild(grid);
  createSpot({host:grid,scenario:'Elena writes down how she measured the period of a note.',
    lines:['Connect a microphone to the oscilloscope and get a steady trace.','Set the time base so three complete cycles fit on the screen.','Count the divisions across the three cycles.','Multiply the number of divisions by the Y-gain.','Divide by three to get the time for one cycle.'],wrong:3,
    explain:'The Y-gain is the voltage per division, up the screen. Time is across the screen, so the divisions must be multiplied by the time base.',
    fix:['Multiply the number of divisions by the time base.','Divide by three to get the time for one cycle.']});
}

/* ================= 3. EXPERIMENT ================= */
{
  act('experiment','Your turn','Take your own readings','Press Experiment. For Fork A, Fork B, Fork C and the hidden tone: press Play, turn the trigger on, choose a time base that shows several complete cycles and a Y-gain that fills the screen. Then drag the two cursors to the same point on two waves, set the number of cycles between them, and record three readings. How close is your mean to the stamped value?');
}
frameAct('experiment','animations/oscilloscope.html','','Frequency of a sound wave animation: a signal generator or tuning fork, a microphone and an oscilloscope','frequency of a sound wave',false);
{
  const body=act('experiment','Predict','Too many cycles','');
  createPredict({host:body,q:'Fatimah sees about 40 cycles squashed across the screen. What should she do?',options:[
    {text:'Choose a smaller time base',correct:true},
    {text:'Choose a larger time base',why:'A larger time base puts even more time on the screen, so even more cycles are squashed in.'},
    {text:'Turn the Y-gain down a lot',why:'The Y-gain only changes the height of the trace, not how many cycles fit across it.'},
    {text:'Move the microphone further away',why:'That makes the trace smaller, but the number of cycles across the screen stays the same.'}
  ],explain:'The time base is the time for each division across the screen. A smaller time base (fewer ms per division) shows less time, so fewer cycles fit across the screen and each one is wider and easier to measure.'});
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

/* ================= 4. READING TRACES ================= */
{
  const body=act('traces','Calculate','Trace A','The time base is 0.5 ms per division. Each square is one division.');
  const split=mk('div','graph-split');body.appendChild(split);
  split.appendChild(mk('div','graph-box',scopeSVG({per:4,amp:2.5,tag:'A',tb:'time base 0.5 ms/div',label:'Trace A: a sine wave, one cycle every 4 divisions, time base 0.5 ms per division'})));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'How many complete cycles are on the screen?',unit:'cycles',answer:2.5,working:'One cycle is 4 divisions wide.<br>cycles = [[10|4]]<br>cycles = 2.5'},
    {q:'What is the period, T?',unit:'ms',answer:2,working:'T = divisions for one cycle × time base<br>T = 4 × 0.5<br>T = 2.0 ms'},
    {q:'What is the frequency?',unit:'Hz',answer:500,working:'T = 2.0 ms<br>T = 0.0020 s<br>f = [[1|T]]<br>f = [[1|0.0020]]<br>f = 500 Hz'}
  ]});
}
{
  const body=act('traces','Calculate','Trace B','The time base is 50 µs per division (1 µs = 0.000 001 s).');
  const split=mk('div','graph-split');body.appendChild(split);
  split.appendChild(mk('div','graph-box',scopeSVG({per:5,amp:1.5,tag:'B',tb:'time base 50 µs/div',label:'Trace B: a sine wave, one cycle every 5 divisions, time base 50 microseconds per division'})));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'What is the period, T, in µs?',unit:'µs',answer:250,working:'T = divisions for one cycle × time base<br>T = 5 × 50<br>T = 250 µs'},
    {q:'What is the frequency?',unit:'Hz',answer:4000,working:'T = 250 µs<br>T = 0.000 25 s<br>f = [[1|T]]<br>f = [[1|0.000 25]]<br>f = 4000 Hz'}
  ]});
}
{
  const body=act('traces','Predict','Counting cycles','');
  createPredict({host:body,pre:'<div class="graph-box" style="max-width:300px">'+scopeSVG({per:10/3,amp:2.5,label:'A trace with three complete cycles across the screen',max:300})+'</div>',
    q:'How many complete cycles does this trace show?',options:[
    {text:'3',correct:true},
    {text:'6',why:'You have counted the peaks and the troughs. One complete cycle includes one peak and one trough.'},
    {text:'4',why:'Count from the start of the trace: it ends exactly after the third cycle.'},
    {text:'10',why:'There are 10 divisions across the screen, but that is not the number of cycles.'}
  ],explain:'One complete cycle goes up to a peak, down through the centre line to a trough, and back up to the centre line. This trace does that three times across the 10 divisions, so one cycle is [[10|3]] = 3.3 divisions.'});
}
{
  const body=act('traces','Predict','Several cycles','');
  createPredict({host:body,q:'Why is it better to measure the time across several cycles, then divide, than to measure one cycle?',options:[
    {text:'Reading errors are a smaller fraction',correct:true},
    {text:'Each cycle has a different period',why:'For a steady note every cycle has the same period. The gain is in accuracy, not in averaging different values.'},
    {text:'The time base works only for long times',why:'The time base works for any number of divisions. Measuring more divisions just makes the reading more accurate.'},
    {text:'One cycle is always too small to see',why:'With the right time base one cycle can fill much of the screen. Measuring several is still more accurate.'}
  ],explain:'You can only read the trace to about 0.1 or 0.2 of a division. Spread over several cycles, that error is a smaller fraction of the time measured, so T is more accurate. (A bare “repeat and average” scores nothing in mark schemes: say what you repeat.)'});
}

/* ================= 5. PITCH AND LOUDNESS ================= */
{
  const body=act('pitch','Look','Four sounds, same settings','The oscilloscope settings are the same for all four traces.');
  const row=mk('div','');row.style.cssText='display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:14px';body.appendChild(row);
  [['P',4,2],['Q',2,2],['R',4,3.5],['S',2,1]].forEach(t=>row.appendChild(mk('div','graph-box',scopeSVG({per:t[1],amp:t[2],tag:t[0],max:300,label:'Trace '+t[0]}))));
}
{
  const body=act('pitch','Predict','Louder, same pitch','');
  createPredict({host:body,q:'Which trace shows a louder sound with the same pitch as P?',options:[
    {text:'R',correct:true},
    {text:'Q',why:'Q has more cycles across the screen, so it is a higher pitch, and it is the same height as P, so it is not louder.'},
    {text:'S',why:'S is shorter (quieter) and has more cycles (higher pitch).'},
    {text:'None of them',why:'R has the same number of cycles as P (same frequency, same pitch) but is taller (louder).'}
  ],explain:'Pitch depends on frequency: the same number of cycles across the screen means the same pitch. Loudness depends on amplitude: the taller trace is the louder sound. R matches P’s cycles but is taller.'});
}
{
  const body=act('pitch','Predict','Quieter and higher','');
  createPredict({host:body,q:'Which trace shows a quieter sound with a higher pitch than P?',options:[
    {text:'S',correct:true},
    {text:'Q',why:'Q is a higher pitch than P, but it is the same height, so it is not quieter.'},
    {text:'R',why:'R is taller (louder) with the same pitch as P.'},
    {text:'P',why:'P is the sound being compared with.'}
  ],explain:'S has twice as many cycles on the screen as P (twice the frequency, so a higher pitch) and a smaller amplitude (quieter).'});
}
{
  const body=act('pitch','Sort','Pitch or loudness?','What does each change do to the note? Sort each card, then press Check.');
  createSortGame({host:body,cats:[
    {id:'p',label:'Changes the pitch',hint:'The frequency changes',color:'--c1',soft:'--c1-soft'},
    {id:'l',label:'Changes the loudness',hint:'The amplitude changes',color:'--c2',soft:'--c2-soft'}
  ],items:[
    {id:'1',text:'Turn the frequency dial on the signal generator up',cat:'p'},
    {id:'2',text:'Swap to a tuning fork stamped with a different number',cat:'p'},
    {id:'3',text:'Tighten a guitar string so it vibrates faster',cat:'p'},
    {id:'4',text:'Turn up the volume on the signal generator',cat:'l'},
    {id:'5',text:'Strike the tuning fork harder',cat:'l'},
    {id:'6',text:'Pluck the same string harder, so it vibrates further',cat:'l'}
  ]});
}
{
  const body=act('pitch','Match','Words for waves','Pair each word with its meaning. Drag one card onto the other, or tap one card and then the other.');
  createMatchGame({host:body,leftTitle:'Word',rightTitle:'Meaning',pairs:[
    {id:'f',l:'Frequency',r:'The number of waves passing a point each second, in hertz (Hz)'},
    {id:'t',l:'Period',r:'The time for one complete wave, in seconds'},
    {id:'a',l:'Amplitude',r:'The largest distance from the centre line to a peak'},
    {id:'p',l:'Pitch',r:'How high or low a note sounds: set by the frequency'},
    {id:'l',l:'Loudness',r:'How loud a note sounds: set by the amplitude'}
  ]});
}

/* ================= 6. HEARING ================= */
{
  const body=act('hearing','Sort','Can a human hear it?','Sort each frequency, then press Check.');
  createSortGame({host:body,cats:[
    {id:'lo',label:'Too low to hear',hint:'Below 20 Hz',color:'--c1',soft:'--c1-soft'},
    {id:'ok',label:'Humans can hear it',hint:'20 Hz to 20 000 Hz',color:'--c3',soft:'--c3-soft'},
    {id:'hi',label:'Too high to hear',hint:'Above 20 000 Hz',color:'--c2',soft:'--c2-soft'}
  ],items:[
    {id:'1',text:'5 Hz',cat:'lo'},{id:'2',text:'12 Hz',cat:'lo'},
    {id:'3',text:'60 Hz',cat:'ok'},{id:'4',text:'440 Hz',cat:'ok'},{id:'5',text:'15 kHz',cat:'ok'},
    {id:'6',text:'28 kHz',cat:'hi'},{id:'7',text:'2 MHz (ultrasound scan)',cat:'hi'}
  ]});
}
{
  const body=act('hearing','Calculate','Can it be heard?','A bat call is shown on an oscilloscope with a time base of 10 µs per division.');
  const split=mk('div','graph-split');body.appendChild(split);
  split.appendChild(mk('div','graph-box',scopeSVG({per:2,amp:2,tb:'time base 10 µs/div',label:'A trace with one cycle every 2 divisions at 10 microseconds per division'})));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'What is the period, T, in µs?',unit:'µs',answer:20,working:'T = divisions for one cycle × time base<br>T = 2 × 10<br>T = 20 µs'},
    {q:'What is the frequency?',unit:'Hz',answer:50000,working:'T = 20 µs<br>T = 0.000 020 s<br>f = [[1|T]]<br>f = [[1|0.000 020]]<br>f = 50 000 Hz (too high for humans to hear)'}
  ]});
}
{
  const body=act('hearing','Predict','A dog whistle','');
  createPredict({host:body,q:'Edward blows a dog whistle at 30 000 Hz. A microphone shows a trace, but Edward hears nothing. Why?',options:[
    {text:'It is above 20 kHz: too high to hear',correct:true},
    {text:'The sound is too quiet to be heard',why:'The microphone picks it up clearly. The frequency is the problem: it is outside the human range.'},
    {text:'Sound cannot travel through air at 30 kHz',why:'It does travel through air: the microphone detects it.'},
    {text:'It is below 20 Hz: too low to hear',why:'30 000 Hz is far above 20 Hz. It is above the top of the range, 20 000 Hz.'}
  ],explain:'Humans hear from about 20 Hz to 20 000 Hz. 30 000 Hz is above the upper limit (ultrasound), so Edward cannot hear it, but a dog can.'});
}
{
  const body=act('hearing','Predict','Getting older','');
  createPredict({host:body,q:'A teacher cannot hear a 17 000 Hz tone that most of the class can hear. Why is this likely?',options:[
    {text:'The top of the range falls with age',correct:true},
    {text:'The tone is below 20 Hz',why:'17 000 Hz is far above 20 Hz. It is near the top of the range.'},
    {text:'Teachers always stand further away',why:'Distance makes a sound quieter, but the students heard it from all round the room.'},
    {text:'Higher frequencies travel more slowly',why:'All frequencies of sound travel at the same speed in air.'}
  ],explain:'20–20 000 Hz is the range for a young person. As people get older, the highest frequency they can hear usually falls, so many adults cannot hear 17 000 Hz.'});
}

/* ================= 7. CALCULATE ================= */
{
  const body=act('calculate','Calculate','Period and frequency','Give each answer in the unit shown.');
  createCalc({host:body,questions:[
    {q:'A tuning fork has a frequency of 250 Hz. What is its period in ms?',unit:'ms',answer:4,working:'f = [[1|T]]<br>250 = [[1|T]]<br>T = [[1|250]]<br>T = 0.004 s<br>T = 4.0 ms'},
    {q:'One cycle of a note takes 2.5 ms. What is its frequency?',unit:'Hz',answer:400,working:'T = 2.5 ms<br>T = 0.0025 s<br>f = [[1|T]]<br>f = [[1|0.0025]]<br>f = 400 Hz'},
    {q:'A 200 Hz note is shown at 1 ms per division. How many divisions wide is one cycle?',unit:'div',answer:5,working:'f = [[1|T]]<br>200 = [[1|T]]<br>T = [[1|200]]<br>T = 0.005 s<br>T = 5 ms<br>divisions = [[5|1]]<br>divisions = 5'},
    {q:'Four complete cycles span 8.0 divisions at 0.2 ms per division. What is the frequency?',unit:'Hz',answer:2500,working:'time for 4 cycles = 8.0 × 0.2<br>time for 4 cycles = 1.6 ms<br>T = [[1.6|4]]<br>T = 0.40 ms<br>T = 0.000 40 s<br>f = [[1|T]]<br>f = [[1|0.000 40]]<br>f = 2500 Hz'}
  ]});
}
{
  const body=act('calculate','Spot the error','Find the mistake','Each working has exactly one mistake, made while rearranging. Every line after it is worked correctly from it. Click the wrong line.');
  const grid=mk('div','');body.appendChild(grid);
  createSpot({host:grid,scenario:'Sophie finds the period of an 800 Hz note.',
    lines:['f = [[1|T]]','800 = [[1|T]]','T = 800 × 1','T = 800 s'],wrong:2,
    explain:'Multiplying both sides by T gives 800 × T = 1, so T = [[1|800]]. A period of 800 s for an audible note is far too long: that is a clue.',
    fix:['800 × T = 1','T = [[1|800]]','T = 0.001 25 s']});
  createSpot({host:grid,scenario:'Aidan sees five complete cycles across 8.0 divisions at 2 ms per division.',
    lines:['time for 5 cycles = 8.0 × 2','time for 5 cycles = 16 ms','5 × T = 16','T = 16 × 5','T = 80 ms'],wrong:3,
    explain:'If 5 × T = 16, then T = [[16|5]]. One cycle must take less time than five cycles, not more.',
    fix:['T = [[16|5]]','T = 3.2 ms']});
}

/* ================= 8. ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Better results or safer?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'Better results',hint:'A more accurate period',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps people and equipment safe',hint:'',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Adjust the trigger so the trace is steady',cat:'a'},
    {id:'2',text:'Set the time base so several complete cycles fill the screen',cat:'a'},
    {id:'3',text:'Measure across as many complete cycles as possible',cat:'a'},
    {id:'4',text:'Use matching points on the waves, such as where the trace crosses the centre line going up',cat:'a'},
    {id:'5',text:'Keep the volume low enough to protect your hearing',cat:'s'},
    {id:'6',text:'Keep drinks away from the oscilloscope and its mains lead',cat:'s'},
    {id:'7',text:'Check the leads for damage before plugging in',cat:'s'}
  ]});
}
{
  const body=act('accuracy','Predict','The Y-gain','');
  createPredict({host:body,q:'Poppy changes the Y-gain from 20 mV per division to 10 mV per division. What happens to her value of the frequency?',options:[
    {text:'It stays the same',correct:true},
    {text:'It doubles',why:'The Y-gain changes the height of the trace, not the time across the screen.'},
    {text:'It halves',why:'Halving the mV per division makes the trace twice as tall, but the period is unchanged.'},
    {text:'It cannot be read now',why:'The trace is taller but still on the screen, so it can be read as before.'}
  ],explain:'The Y-gain sets the voltage per division, up the screen, so it changes the height of the trace only. The period, and so the frequency, are read across the screen with the time base.'});
}
{
  const body=act('accuracy','Predict','Pausing the trace','');
  createPredict({host:body,q:'Why does a steady (or frozen) trace give a better reading of the period?',options:[
    {text:'The points stay still while you count',correct:true},
    {text:'It makes the frequency more constant',why:'The frequency is set by the source. A steady trace just stops the picture moving while you read it.'},
    {text:'It makes the trace taller and clearer',why:'The height is set by the Y-gain and the loudness, not by the trigger.'},
    {text:'It gets rid of the reading error',why:'There is still a small reading error, but the trace no longer moves while you read it.'}
  ],explain:'With the trigger on (or the screen frozen), each sweep starts at the same point on the wave, so the trace stands still and you can count divisions accurately.'});
}

/* ================= EXAM PRACTICE ================= */
{
  const body=act('exam','Exam style','The frequency of a tuning fork','Write each answer, then check it against the model answer.');
  examPart(body,'(a) 1 mark','Name the piece of equipment Zahra connects to the oscilloscope so it can display the sound of a tuning fork.',[
    'A microphone.']);
  examPart(body,'(b) 5 marks','Describe how Zahra can use the oscilloscope to measure the frequency of the tuning fork.',[
    'Strike the fork and hold it near the microphone.',
    'Adjust the oscilloscope (trigger) to get a steady trace.',
    'Adjust the time base so at least one (preferably several) complete cycles are on the screen.',
    'Count the squares (divisions) for a number of complete cycles, and divide by the number of cycles.',
    'Multiply by the time base to get the period, T.',
    'Frequency = [[1|T]].',
    'A bare “repeat and average” scores nothing.']);
  examPart(body,'(c) 3 marks','Three complete cycles of a note span 7.5 divisions. The time base is 0.2 ms per division. Calculate the frequency of the note.',[
    'time for 3 cycles = 7.5 × 0.2 = 1.5 ms',
    'T = [[1.5|3]] = 0.50 ms = 0.000 50 s',
    'f = [[1|0.000 50]] = 2000 Hz']);
  examPart(body,'(d) 2 marks','Zahra uses a second fork that sounds quieter and higher pitched. Describe how its trace differs from the first, with the same settings.',[
    'Smaller amplitude: the trace is not as tall.',
    'Higher frequency: more cycles across the screen (each cycle narrower).']);
  examPart(body,'(e) 2 marks','Explain why measuring across several cycles gives a more accurate value of the period.',[
    'The reading error (about 0.1 division at each end) stays the same size.',
    'So it is a smaller fraction (percentage) of the longer time measured.']);
  examPart(body,'(f) 2 marks','The microphone also picks up a signal at 25 kHz. Explain whether Zahra can hear it.',[
    'The range of human hearing is 20 Hz to 20 000 Hz.',
    '25 kHz = 25 000 Hz is above 20 000 Hz, so she cannot hear it.']);
}
