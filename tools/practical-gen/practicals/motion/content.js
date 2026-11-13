/* ================= METHOD TYPE: stopwatch, light gates or video camera =================
   The January 2014 4PH0 mark scheme (toy car down a slope, speed at the bottom) accepts a light gate with an
   interrupter card and a data logger, or a video camera with a scale behind the ramp played back frame by frame,
   as well as timing with a stopwatch. The Method tab has a "Method type" switch; the choice is remembered in this
   browser. The Overview tab was removed on 12 Nov 2026 (Alex). */
const METHODS=[{k:'sw',label:'Stopwatch'},{k:'lg',label:'Light gates'},{k:'vc',label:'Video camera'}];
const MKEY='cp-motion-method';
let method='sw';try{const v=localStorage.getItem(MKEY);if(METHODS.some(m=>m.k===v))method=v;}catch(e){}
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
const ORDER_INTRO='Put the steps in the order you would do them. Drag the ≡ handle, or use the ▲▼ buttons.';
const MATCH_INTRO='Pair each piece of equipment with its job. Drag one card onto the other, or tap one card and then the other.';

/* ================= THE STUDENT'S OWN RESULTS TABLE (Do Experiment; 5c, 13 Nov 2026) =================
   The same helper is copied into each practical rebuilt to the 1.22 model; 1.22 has its own version.
   cfg.head: column headings. cfg.rows: rows of cells. A cell is given text, or a box:
     {k:'key', a:answer, tol, dp, label}           a reading, right if within tol of a (default 0.05)
     {k:'key', f:v=>number, tol, rel, dp, label}  worked from the student's own readings: v('key') is a box the student
                                                   already has right (NaN otherwise); right if within tol, or rel × the answer
     {k:'key', a:'text', opts:[…], label}          a choice from a list (observations)
   Boxes are checked in table order, so a worked box can use readings to its left or in earlier rows.
   Fill in table is always there (Alex, 5 Nov 2026): it fills every box, dashed, so a student who cannot
   read the instrument can still go on. cfg.onChange runs after every check, fill or clear. */
function ownTable(body,cfg){
  const wrap=mk('div','table-scroll');body.appendChild(wrap);
  const cells=[];
  wrap.innerHTML='<table class="units res-tbl own-tbl"><thead><tr>'+cfg.head.map(x=>'<th>'+x+'</th>').join('')+'</tr></thead><tbody>'+
    cfg.rows.map(r=>'<tr>'+r.map(c=>{
      if(c===null||typeof c!=='object')return '<td class="given">'+(c==null?'':c)+'</td>';
      const i=cells.length;cells.push(c);
      if(c.opts)return '<td><select class="own-sel" data-i="'+i+'" aria-label="'+c.label+'"><option value="">Choose</option>'+c.opts.map(o=>'<option>'+o+'</option>').join('')+'</select></td>';
      return '<td><input class="calc-num-input" data-i="'+i+'" inputmode="decimal" autocomplete="off" aria-label="'+c.label+'"></td>';
    }).join('')+'</tr>').join('')+'</tbody></table>';
  const els=$$('[data-i]',wrap);
  const num=e=>{const t=e.value.trim().replace(/[−–]/g,'-').replace(',','.');return t===''||!/^-?(\d+\.?\d*|\.\d+)$/.test(t)?NaN:parseFloat(t);};
  const at={};cells.forEach((c,i)=>{if(c.k)at[c.k]=i;});
  const v=k=>{const e=els[at[k]];return e&&e.disabled?num(e):NaN;};
  const want=c=>c.f?c.f(v):c.a;
  const fmt=(x,c)=>{if(typeof x==='string')return x;const s=x.toFixed(c.dp==null?1:c.dp);return /^-0(\.0+)?$/.test(s)?s.slice(1):s.replace('-','−');};
  const lock=(e,shown)=>{e.disabled=true;e.classList.remove('is-wrong');if(shown)e.classList.add('is-shown');};
  const b=bar(body,[{label:'Check table',primary:true,fn:check},{label:'Fill in table',fn:fill},{label:'Clear',fn:reset}]);
  const changed=()=>{if(cfg.onChange)cfg.onChange();};
  function good(c,e){
    const w=want(c);
    if(c.opts)return e.value===w;
    const x=num(e);if(!isFinite(x)||!isFinite(w))return false;
    return Math.abs(x-w)<=Math.max(c.tol==null?0.05:c.tol,(c.rel||0)*Math.abs(w))+1e-9;
  }
  function check(){
    let ok=0,bad=0,blank=0;
    els.forEach((e,i)=>{
      if(e.disabled){ok++;return;}
      if(e.value.trim()===''){blank++;return;}
      if(good(cells[i],e)){lock(e);e.classList.add('pop');ok++;}else{bad++;e.classList.add('is-wrong');}
    });
    if(ok===els.length){b.say(cfg.done||'All correct.','good');celebrate(b.msg);}
    else b.say(ok+' of '+els.length+' correct'+(blank?', '+blank+' left blank':'')+'.'+(bad&&cfg.hint?' '+cfg.hint:''),bad?'bad':'');
    changed();
  }
  function fill(){
    els.forEach((e,i)=>{if(e.disabled)return;const w=want(cells[i]);if(cells[i].opts||isFinite(w)){e.value=cells[i].opts?w:fmt(w,cells[i]);lock(e,true);}});
    b.say(cfg.filled||'Table filled in (dashed). Read it through.','');changed();
  }
  function reset(){els.forEach(e=>{e.value='';e.disabled=false;e.classList.remove('is-wrong','is-shown','pop');});b.say('','');changed();}
  els.forEach(e=>e.addEventListener(e.tagName==='SELECT'?'change':'input',()=>e.classList.remove('is-wrong')));
  track(body,{reset:reset,
    getState:()=>({v:els.map(e=>e.value),ok:els.map(e=>e.disabled),sh:els.map(e=>e.classList.contains('is-shown'))}),
    setState:s=>{reset();els.forEach((e,i)=>{if(!s||!s.v||typeof s.v[i]!=='string')return;e.value=s.v[i];if(s.ok&&s.ok[i])lock(e,s.sh&&s.sh[i]);});if(els.every(e=>e.disabled))b.say(cfg.done||'All correct.','good');changed();},
    isDone:()=>els.every(e=>e.disabled)});
  // the value in a box the student has got right (or that was filled in), as typed; null until then
  return {val:k=>{const e=els[at[k]];return e&&e.disabled?e.value.trim():null;}};
}
/* The framed animation and the table side by side (as on 1.22), once the page's set-up has run. */
function sideBySide(panel,tableActs){
  setTimeout(()=>{const fr=$('#panel-'+panel+' .anim-wrap');if(!fr)return;const sp=mk('div','do-split');fr.parentNode.insertBefore(sp,fr);sp.appendChild(fr);
    const col=mk('div','do-col');sp.appendChild(col);tableActs.forEach(a=>col.appendChild(a.closest('.act')));},0);
}

/* ================= 1. METHOD ================= */
methodPicker('method');
{
  const body=act('method','Order','Time the car with a stopwatch',ORDER_INTRO);forMethod(body,'sw');
  createReorder({host:body,steps:[
    {id:'a',text:'Raise one end of the ramp on a block. Measure its height with a ruler held vertically (check with a set square), reading at eye level.'},
    {id:'b',text:'Mark the start line, then mark distances every 20 cm down the ramp, measured with a metre rule or tape measure.'},
    {id:'c',text:'Hold the car still with its front edge on the start line.'},
    {id:'d',text:'Release the car from rest (no push), and start the stopwatch at the same moment.'},
    {id:'e',text:'Stop the stopwatch as the front of the car passes the first mark.'},
    {id:'f',text:'Repeat three times, then do the same for each of the other marks, keeping the same car and the same ramp height.'},
    {id:'g',text:'Find the mean time for each distance, and plot distance against time. Average speed = [[distance|time]].'}
  ],constraints:[['a','c'],['b','c'],['c','d'],['d','e'],['e','f'],['f','g']],
  why:'The ramp and the marks are set up first; the car starts from rest on the start line, and you need every mean time before you can plot the graph.'});
}
{
  const body=act('method','Order','Find the speed with a light gate',ORDER_INTRO);forMethod(body,'lg');
  createReorder({host:body,steps:[
    {id:'a',text:'Measure the length of the card with a ruler, then fix it to the top of the car.'},
    {id:'b',text:'Clamp a light gate at the bottom of the ramp, with the card able to pass through its beam, and connect it to a data logger.'},
    {id:'c',text:'Hold the car still with its front edge on the start line.'},
    {id:'d',text:'Let go without pushing.'},
    {id:'e',text:'Read from the data logger the time for which the card blocked the beam.'},
    {id:'f',text:'Work out the speed = [[length of card|time the beam is blocked]].'},
    {id:'g',text:'Repeat three times and find the mean speed.'}
  ],constraints:[['a','f'],['b','d'],['c','d'],['d','e'],['e','f'],['f','g']],
  why:'The card is measured and the gate set up before the run; the data logger gives the time only after the car has passed through the beam.'});
}
{
  const body=act('method','Order','Film the car with a video camera',ORDER_INTRO);forMethod(body,'vc');
  createReorder({host:body,steps:[
    {id:'a',text:'Fix a metre rule along the side of the ramp, as a scale.'},
    {id:'b',text:'Set up the camera on a tripod, side-on to the ramp and level with the car, so the whole ramp is in view.'},
    {id:'c',text:'Start recording.'},
    {id:'d',text:'Release the car from rest at the start line.'},
    {id:'e',text:'Play the video back frame by frame.'},
    {id:'f',text:'For each frame, note the frame number and read the position of the front of the car against the scale.'},
    {id:'g',text:'Work out each time = [[frame number|frames per second]], and plot distance against time.'}
  ],constraints:[['a','c'],['b','c'],['c','d'],['d','e'],['e','f'],['f','g']],
  why:'The scale and the camera are in place before filming starts, and the camera must be recording before the car is released.'});
}
{
  const body=act('method','Match','What each piece of equipment is for',MATCH_INTRO);forMethod(body,'sw');
  methodGames.push(createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'r',l:'Metre rule or tape measure',r:'Measures the distances marked along the ramp'},
    {id:'s',l:'Stopwatch',r:'Times the car, but your reaction time adds an error'},
    {id:'q',l:'Set square',r:'Checks the ruler is vertical when measuring the height'},
    {id:'b',l:'Block under the ramp',r:'Raises the ramp to a measured height'},
    {id:'x',l:'Box at the bottom',r:'Catches the car when it leaves the ramp'}
  ]}));
}
{
  const body=act('method','Match','What each piece of equipment is for',MATCH_INTRO);forMethod(body,'lg');
  methodGames.push(createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'g',l:'Light gate',r:'Detects when the card enters and leaves its beam'},
    {id:'d',l:'Data logger',r:'Times how long the beam is blocked, to 0.001 s'},
    {id:'c',l:'Card on the car',r:'Blocks the beam for longer when the car is slower'},
    {id:'r',l:'Ruler',r:'Measures the length of the card'},
    {id:'k',l:'Clamp and stand',r:'Holds the light gate still at the right point'}
  ]}));
}
{
  const body=act('method','Match','What each piece of equipment is for',MATCH_INTRO);forMethod(body,'vc');
  methodGames.push(createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'v',l:'Video camera',r:'Records the car’s position many times each second'},
    {id:'t',l:'Tripod',r:'Keeps the camera still and side-on to the ramp'},
    {id:'m',l:'Metre rule along the ramp',r:'Gives a scale to read each position from'},
    {id:'f',l:'Frame-by-frame playback',r:'Lets you read the position at each known time'},
    {id:'n',l:'Frame rate (frames per second)',r:'Tells you the time between one frame and the next'}
  ]}));
}
{
  const body=act('method','Sort','Which method?','Which timing method is each card about? Sort each card, then press Check.');
  createSortGame({host:body,cats:[
    {id:'sw',label:'Stopwatch',hint:'',color:'--c1',soft:'--c1-soft'},
    {id:'lg',label:'Light gates',hint:'',color:'--c2',soft:'--c2-soft'},
    {id:'vc',label:'Video camera',hint:'',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Your reaction time adds an error to every time',cat:'sw'},
    {id:'2',text:'Times the car between two marks a measured distance apart, by hand',cat:'sw'},
    {id:'3',text:'Needs a card of measured length on the car',cat:'lg'},
    {id:'4',text:'Gives the speed at one point directly',cat:'lg'},
    {id:'5',text:'Needs a scale in the picture',cat:'vc'},
    {id:'6',text:'Records the whole run, to study afterwards',cat:'vc'}
  ]});
}
/* ================= 2. VARIABLES ================= */
{
  const body=act('variables','Sort','Which kind of variable is it?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'i',label:'Independent',hint:'You change it',color:'--c1',soft:'--c1-soft'},
    {id:'d',label:'Dependent',hint:'You measure it',color:'--c2',soft:'--c2-soft'},
    {id:'c',label:'Control',hint:'You keep it the same',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'The distance from the start line to the mark',cat:'i'},
    {id:'2',text:'The time the car takes to reach the mark',cat:'d'},
    {id:'3',text:'The height of the ramp',cat:'c'},
    {id:'4',text:'Using the same toy car every time',cat:'c'},
    {id:'5',text:'Releasing the car from the same start line',cat:'c'},
    {id:'6',text:'Timing to the front edge of the car each time',cat:'c'}
  ]});
}
{
  const body=act('variables','Multiple choice','A new question to test','');
  createPredict({host:body,q:'Zahra wants to find out how the height of the ramp affects the car’s speed at the bottom. What is her independent variable?',options:[
    {text:'The height of the ramp',correct:true},
    {text:'The speed at the bottom',why:'That is what she measures for each height, so it is the dependent variable.'},
    {text:'The length of the ramp',why:'She should keep the same ramp, so its length is a control variable.'},
    {text:'The mass of the toy car',why:'She should use the same car each time, so its mass is a control variable.'}
  ],explain:'The independent variable is the one she changes on purpose: the height of the ramp. For each height she measures the speed at the bottom, and keeps everything else the same.'});
}
{
  const body=act('variables','Multiple choice','Let go, don’t push','');
  createPredict({host:body,q:'Why must Charlie let go of the car rather than give it a little push?',options:[
    {text:'So it starts from rest, with no push, every run',correct:true},
    {text:'So that the stopwatch can start a little bit later',why:'The stopwatch should start the moment the car moves. Letting go is about the car’s starting speed.'},
    {text:'So the car speeds up more quickly down the ramp',why:'A push changes the starting speed, not how quickly the ramp makes it speed up.'},
    {text:'So that his hand stays well clear of the ramp',why:'That is sensible, but the main reason is that every run must start from rest.'}
  ],explain:'The car must be released from rest: its initial speed must be zero every run. A push gives the car a starting speed that is different each time, so the times would not be repeatable.'});
}

/* ================= 7. ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Better results or safer?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'Better results',hint:'More accurate or more repeatable times',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps people safe',hint:'Protects people and equipment',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Time each distance three times and find the mean',cat:'a'},
    {id:'2',text:'Use light gates instead of a stopwatch',cat:'a'},
    {id:'3',text:'Time to the front edge of the car every time',cat:'a'},
    {id:'4',text:'Use longer distances, so reaction time matters less',cat:'a'},
    {id:'5',text:'Put a box at the bottom to catch the car',cat:'s'},
    {id:'6',text:'Make sure the ramp cannot slip off its block',cat:'s'},
    {id:'7',text:'Keep bags and feet clear of the end of the ramp',cat:'s'},
    {id:'8',text:'Never lean out of a window to drop a ball',cat:'s'}
  ]});
}
{
  const body=act('accuracy','Multiple choice','The front of the car','');
  createPredict({host:body,q:'Why should Ananya stop the stopwatch when the front of the car passes each mark, every time?',options:[
    {text:'The distances are measured to the front of the car',correct:true},
    {text:'The front of the car is the part that moves fastest',why:'Every part of the car moves at the same speed. The point is to time to the same place you measured to.'},
    {text:'The back of the car is too hard to see clearly',why:'You could see the back, but the distance would then be wrong by the length of the car.'},
    {text:'It makes the car accelerate more steadily',why:'Where she looks cannot change how the car moves. It changes which distance she is timing.'}
  ],explain:'The car starts with its front edge on the start line, so each distance runs to the front of the car. Timing to the back instead would add the car’s length to every distance.'});
}
{
  const body=act('accuracy','Multiple choice','Improving the graph','');
  createPredict({host:body,q:'Charlie only times the car to three marks, all within 30 cm of the start. His graph looks almost straight. How should he improve it?',options:[
    {text:'Use more marks, all the way down the ramp',correct:true},
    {text:'Repeat each of the three times and find the mean',why:'Repeats make each time more reliable, but three marks close together still cannot show that the graph curves.'},
    {text:'Use a stopwatch that shows times to 0.001 s',why:'A finer display does not remove reaction time, and three close marks still hide the curve.'},
    {text:'Push the car to give it a faster start each time',why:'A push changes the starting speed every run, so the times would be less repeatable.'}
  ],explain:'The curve only shows up with enough distances over a wide range. Over the first 30 cm the curve looks nearly straight, so use marks every 20 cm all the way down.'});
}


/* ================= DO THE EXPERIMENT (the 1.22 model; 5c, 13 Nov 2026) =================
   The student reads the metre rule and the stopwatch in the animation's measure mode
   (animations/ramp-motion.html?show=measure, the 20 cm ramp), fills in the table and plots distance against mean time.
   These readings must match the animation's measure mode (MEAS in animations/ramp-motion.html; tools/CORE-PRACTICALS.md,
   "Measure modes"): markers at 20 … 120 cm, three stopwatch times at each. */
const RW_D=[20,40,60,80,100,120];
const RW_T=[[0.70,0.70,0.74],[0.95,0.99,0.99],[1.29,1.25,1.25],[1.48,1.48,1.40],[1.65,1.69,1.53],[1.80,1.80,1.80]];
const RW_MEAN=RW_T.map(t=>+((t[0]+t[1]+t[2])/3).toFixed(2));
let rwTable=null,rwRows=()=>{};
{
  act('do','Your turn','Take your own readings','Marker 1 is 20 cm down the ramp. Read its distance from the start line on the metre rule in the close-up, then press Release three times and write down each stopwatch time. Do the same for markers 2 to 6, work out each mean time, then plot distance against mean time.');
}
frameAct('do','animations/ramp-motion.html','measure','Toy car experiment: read the metre rule and the stopwatch','toy car on a ramp',false);
{
  const body=act('do','Calculate','Your results table','Write each distance to the nearest 1 cm and each time to 0.01 s, as the stopwatch shows it. Then work out each mean time, to 0.01 s. Press Check table.');
  rwTable=ownTable(body,{head:['Marker','Distance (cm)','Time 1 (s)','Time 2 (s)','Time 3 (s)','Mean time (s)'],
    rows:RW_D.map((d,i)=>[i+1,
      {k:'d'+i,a:d,tol:0.5,dp:0,label:'Distance to marker '+(i+1)+', in cm'},
      {k:'a'+i,a:RW_T[i][0],tol:0.005,dp:2,label:'Time 1 to marker '+(i+1)+', in s'},
      {k:'b'+i,a:RW_T[i][1],tol:0.005,dp:2,label:'Time 2 to marker '+(i+1)+', in s'},
      {k:'c'+i,a:RW_T[i][2],tol:0.005,dp:2,label:'Time 3 to marker '+(i+1)+', in s'},
      {k:'m'+i,f:v=>(v('a'+i)+v('b'+i)+v('c'+i))/3,tol:0.006,dp:2,label:'Mean time to marker '+(i+1)+', in s'}]),
    hint:'Read the distance where the marker meets the rule. Mean = (time 1 + time 2 + time 3) divided by 3, from your own times.',
    done:'All correct. Now plot your results.',filled:'Table filled in (dashed). Now plot distance against mean time.',
    onChange:()=>rwRows()});
}
{
  const body=act('do','Plot','Plot your results','Plot distance against mean time as a small cross for each marker. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');
  const row=i=>{const d=rwTable&&rwTable.val('d'+i),m=rwTable&&rwTable.val('m'+i);return 'Marker '+(i+1)+': '+(m?m+' s':'your mean time')+', '+(d?d+' cm':'your distance');};
  createPlot({host:body,points:RW_MEAN.map((t,i)=>({x:t,y:RW_D[i],n:i})),rowText:p=>row(p.n),next:' Now answer the question below.',
    graph:{xMin:0,xMax:2,yMin:0,yMax:120,xTicks:[0,0.5,1,1.5,2],yTicks:[0,20,40,60,80,100,120],minor:[0.1,5],snap:[0.05,5],tol:[0.05,2.5],xLabel:'mean time (s)',yLabel:'distance (cm)',W:560,H:340}});
  rwRows=()=>{$$('.plot-row',body).forEach((li,i)=>{const s=li.firstElementChild;if(s)s.textContent=row(i);});};
}
sideBySide('do',[$('#panel-do .own-tbl')]);
{
  const body=act('do','Predict','Reading your results','');
  createPredict({host:body,q:'Use your table and graph. How is the car moving down the ramp?',options:[
    {text:'Speeding up: each 20 cm takes less time',correct:true},
    {text:'At a steady speed: the distance goes up each time',why:'Look at the times: the first 20 cm takes about 0.71 s, the last 20 cm only about 0.18 s. Equal distances in less and less time means it is speeding up.'},
    {text:'Slowing down: the line gets steeper',why:'On a distance–time graph a steeper line means a faster speed, so the car is speeding up, not slowing down.'},
    {text:'Speeding up, then steady after marker 3',why:'The gaps between the mean times keep getting smaller all the way down, so the car speeds up all the way.'}
  ],explain:'The car covers each 20 cm more quickly, so the distance–time graph is a curve that gets steeper: the car is accelerating. Its average speed over 120 cm is [[1.20 m|1.80 s]] = 0.67 m/s, and because it started from rest and sped up steadily, its speed at the bottom is about twice that.'});
}

/* ================= SHOW THE EXPERIMENT: the readings taken for you ================= */
{
  act('experiment','Your turn','Watch the readings','Press Experiment: here the results table and graph fill in by themselves. Time the car to every mark with the stopwatch, then with light gates, on the 20 cm ramp. Then try 10 cm and 30 cm. Which timing method gives repeatable times, what shape is the distance–time graph, and how does the height of the ramp change the acceleration?');
}
frameAct('experiment','animations/ramp-motion.html','','Toy car on a ramp animation: timing the car with a stopwatch or light gates','toy car on a ramp',false);
{
  const body=act('experiment','Multiple choice','Three different times','');
  createPredict({host:body,q:'Charlie times the car to the same mark three times with a stopwatch: 1.25 s, 1.27 s and 1.20 s. Why are they different?',options:[
    {text:'His reaction time is different on each run',correct:true},
    {text:'The car speeds up by a different amount each run',why:'The same car on the same ramp speeds up in the same way each time. The difference comes from the timing.'},
    {text:'The stopwatch only measures to the nearest 0.1 s',why:'The stopwatch shows 0.01 s. The 0.07 s spread comes from when he presses the button.'},
    {text:'The distance to the mark changes from run to run',why:'The mark stays in the same place. What changes is when he starts and stops the stopwatch.'}
  ],explain:'He has to press the button as he lets go and again as the car passes the mark. His reaction time is a little different each time, so the times differ. Other reasons: the car may not start from exactly the same position, may not be released from rest, or friction on it may vary. That is why you repeat and find a mean.'});
}
{
  const body=act('experiment','Multiple choice','Short times','');
  createPredict({host:body,q:'For the 20 cm mark the car takes only about 0.7 s. Why are light gates much better than a stopwatch here?',options:[
    {text:'Reaction time is a big part of so short a time',correct:true},
    {text:'A stopwatch cannot measure times below one second',why:'A stopwatch can show 0.70 s. The problem is that a person cannot press it at exactly the right moments.'},
    {text:'Light gates make the car go down the ramp faster',why:'A light gate only detects the car; it does not change its motion.'},
    {text:'The car is too small for the eye to see moving',why:'You can see the car. The problem is how quickly you can react to it.'}
  ],explain:'A reaction-time error of about 0.1 s is a big part of 0.7 s, but a small part of several seconds. Light gates start and stop the timer electronically, with no reaction time.'});
}

/* ================= 4. RESULTS ================= */
const RM=[[0.20,[0.74,0.70,0.75],'0.73'],[0.40,[1.05,0.99,1.02],'1.02'],[0.60,[1.25,1.27,1.20],'1.24'],[0.80,[1.44,1.41,1.47],'1.44'],[1.00,[1.60,1.63,1.57],'1.60'],[1.20,[1.78,1.73,1.77],'?']];
function rmTable(){
  const t=mk('div','table-scroll');
  t.innerHTML='<table class="units res-tbl"><thead><tr><th>Distance (m)</th><th>Time 1 (s)</th><th>Time 2 (s)</th><th>Time 3 (s)</th><th>Mean time (s)</th></tr></thead><tbody>'+
    RM.map(r=>'<tr><td>'+r[0].toFixed(2)+'</td>'+r[1].map(x=>'<td>'+x.toFixed(2)+'</td>').join('')+'<td>'+(r[2]==='?'?'<b>?</b>':r[2])+'</td></tr>').join('')+'</tbody></table>';
  t.querySelector('table').style.width='fit-content';
  return t;
}
{
  const body=act('results','Calculate','Complete Zahra’s results','Zahra timed her toy car three times to each mark with a stopwatch, on a ramp 20 cm high.');
  body.appendChild(rmTable());
  createCalc({host:body,questions:[
    {q:'Work out the mean time for 1.20 m.',unit:'s',answer:1.76,working:'mean = [[1.78 + 1.73 + 1.77|3]]<br>mean = [[5.28|3]]<br>mean = 1.76 s'},
    {q:'What is the car’s average speed over the whole 1.20 m?',unit:'m/s',answer:0.68,working:'average speed = [[distance|time]]<br>average speed = [[1.20|1.76]]<br>average speed = 0.68 m/s'},
    {q:'The car sped up steadily from rest, so its final speed was twice its average speed. What was its acceleration?',unit:'m/s²',answer:0.775,working:'final speed = 2 × 0.682<br>final speed = 1.364 m/s<br>a = [[v − u|t]]<br>a = [[1.364 − 0|1.76]]<br>a = 0.775 m/s²'}
  ]});
}
{
  const body=act('results','Multiple choice','The line of best fit','');
  createPredict({host:body,q:'What line of best fit should Zahra draw through her points?',options:[
    {text:'A smooth curve from the origin, getting steeper',correct:true},
    {text:'Short straight lines joining each point in turn',why:'Joining the dots follows every small timing error. A line of best fit shows the trend.'},
    {text:'One straight line through as many points as it can',why:'The points do not lie on a straight line: each 0.2 m takes less time than the one before.'},
    {text:'A smooth curve from the origin, getting less steep',why:'A curve getting less steep would mean the car was slowing down, but it covers each 0.2 m faster.'}
  ],explain:'At the start (time 0) the car is at distance 0, so the curve starts at the origin. It gets steeper and steeper because the car covers each 0.2 m more quickly: it is speeding up.'});
}
{
  const body=act('results','Multiple choice','The speed at the bottom','');
  createPredict({host:body,q:'Charlie divides 1.20 m by 1.76 s to get 0.68 m/s, and says this is the car’s speed as it passes the 1.20 m mark. Is he right?',options:[
    {text:'No: that is the average; it was faster at the end',correct:true},
    {text:'Yes: speed is always distance divided by time',why:'Distance divided by time gives the average speed for the whole trip. The car sped up, so it was going faster than average at the end.'},
    {text:'No: the car was going slower than that at the end',why:'The car was speeding up all the way, so at the end it was going faster than its average speed, not slower.'},
    {text:'Yes: the car went at a steady speed down the ramp',why:'The graph curves, so the speed was not steady: the car was speeding up.'}
  ],explain:'Distance divided by time gives the average speed. The car started from rest and sped up steadily, so its speed at the end was about twice the average: about 1.36 m/s. To measure it directly, use a light gate at the mark.'});
}
{
  const body=act('results','Multiple choice','An anomalous result','');
  createPredict({host:body,q:'Ananya’s three times to the 0.60 m mark are below. Which is anomalous, and what should she do?',
    pre:'<div class="table-scroll"><table class="units res-tbl" style="width:fit-content"><thead><tr><th>Run</th><th>1</th><th>2</th><th>3</th></tr></thead><tbody><tr><th>Time (s)</th><td>1.25</td><td>1.27</td><td>1.62</td></tr></tbody></table></div>',
    options:[
    {text:'Run 3: repeat it, and leave it out of the mean',correct:true},
    {text:'Run 1: it is the shortest, so it must be wrong',why:'1.25 s is close to 1.27 s. Being the shortest does not make a result anomalous.'},
    {text:'Run 3: keep it in the mean, as all runs count',why:'Including it would push the mean far too high. An anomalous result is repeated and left out.'},
    {text:'None: stopwatch times always spread by this much',why:'Reaction time spreads the times by a few hundredths of a second, not by 0.35 s.'}
  ],explain:'Runs 1 and 2 agree to within 0.02 s, but run 3 is 0.35 s longer: perhaps the car rubbed the side of the ramp, or she stopped the stopwatch late. Time it again, and leave it out of the mean.'});
}

/* ================= 5. GRAPHS ================= */
function lab(g0,t,x,y){return '<circle cx="'+g0.gx(x)+'" cy="'+g0.gy(y)+'" r="13" fill="var(--panel)" stroke="var(--ink)" stroke-width="2"/><text x="'+g0.gx(x)+'" y="'+(g0.gy(y)+5)+'" text-anchor="middle" font-size="14" fill="var(--ink)">'+t+'</text>';}
const GV={xMin:0,xMax:3.0,yMin:0,yMax:2.4,xTicks:[0,0.5,1,1.5,2,2.5,3],yTicks:[0,0.4,0.8,1.2,1.6,2.0,2.4],xLabel:'time (s)',yLabel:'velocity (m/s)',W:560,H:340};
function rampGraph(){
  const g0=lineGraph(Object.assign({points:[[0,0]]},GV));
  return lineGraph(Object.assign({label:'Velocity against time for three ramps A, B and C',segments:[{pts:[[0,0],[1.5,2.4]]},{pts:[[0,0],[2.0,1.8]],cls:'g-line-b'},{pts:[[0,0],[3.0,1.2]],cls:'g-line-c'}],
    extra:lab(g0,'A',1.5,2.4)+lab(g0,'B',2.0,1.8)+lab(g0,'C',3.0,1.2)},GV)).svg;
}
{
  const body=act('graphs','Calculate','Three ramps','The same toy car is released from rest at the top of three ramps, A, B and C. Each ramp is 1.8 m long, but its top is raised to a different height. Light gates give these velocity–time graphs, which end when the car reaches the bottom. Read your answers off the graph.');
  const split=mk('div','graph-split');body.appendChild(split);
  split.appendChild(mk('div','graph-box',rampGraph()));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'Ramp B: what is the car’s acceleration?',unit:'m/s²',answer:0.9,working:'acceleration = gradient of the velocity–time graph<br>acceleration = [[change in velocity|time taken]]<br>acceleration = [[1.8 − 0|2.0 − 0]]<br>acceleration = 0.9 m/s²'},
    {q:'Ramp C: how far does the car travel in the first 2.0 s?',unit:'m',answer:0.8,working:'distance = area under the velocity–time graph<br>At 2.0 s, velocity = 0.8 m/s<br>distance = ½ × 2.0 × 0.8<br>distance = 0.8 m'},
    {q:'Ramp A: how long does the car take to reach 1.6 m/s?',unit:'s',answer:1.0,working:'Read across from 1.6 m/s to line A, then down.<br>time = 1.0 s'}
  ]});
}
{
  const body=act('graphs','Multiple choice','Which is the highest ramp?','');
  createPredict({host:body,q:'Look at the graph above. Which line is the car on the highest ramp?',options:[
    {text:'A: its gradient is steepest',correct:true},
    {text:'C: its line runs the longest',why:'C runs for the longest time because the car is slowest to reach the bottom, so its ramp is the lowest.'},
    {text:'B: it lies between the two',why:'B has the middle gradient, so it is the middle ramp.'},
    {text:'All the same: it is one car',why:'The same car speeds up faster on a steeper ramp, so the lines have different gradients.'}
  ],explain:'A steeper ramp gives a bigger acceleration, so the velocity–time line is steeper. Line A (1.6 m/s²) is the highest ramp and line C (0.4 m/s²) the lowest. The area under each line is the same, 1.8 m, because every ramp is the same length; on the highest ramp the car covers it in the shortest time and reaches the highest speed.'});
}
{
  const body=act('graphs','Multiple choice','A straight line','');
  createPredict({host:body,q:'Each line on this velocity–time graph is straight. What does that tell you about the car?',options:[
    {text:'Its acceleration stays the same',correct:true},
    {text:'It moves at a steady speed',why:'A steady speed gives a flat line on a velocity–time graph. These lines slope up.'},
    {text:'Its acceleration keeps growing',why:'A growing acceleration would make the line curve upwards, getting steeper.'},
    {text:'It travels equal distances each second',why:'That would be a steady speed. The car covers more distance each second as it speeds up.'}
  ],explain:'The gradient of a velocity–time graph is the acceleration. A straight line has the same gradient all the way, so the acceleration is constant (uniform).'});
}

/* The method switch is set once every method's activities exist, so only the chosen method shows on load. */
setMethod(method);
