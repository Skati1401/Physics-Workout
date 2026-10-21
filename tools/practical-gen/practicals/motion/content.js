/* ================= 1. OVERVIEW ================= */
{
  const body=act('overview','Fill in the blanks','The practical in one passage','Drag a word into each gap, or tap a word and then tap a gap. Some words are not needed.');
  const parts=[
    'Raise one end of a ramp on a block, and mark distances down it every 20 cm. Release a toy car from ',['b1','rest'],' at the start line, and time how long it takes to reach each mark with a ',
    ['b2','stopwatch'],'. Time each distance three times and work out the ',['b3','mean'],'. Plot distance against ',['b4','time'],'. The graph curves upwards, because the car is ',['b5','accelerating'],
    '. The gradient of a distance–time graph gives the ',['b6','speed'],'. To find the speed at one point, use a ',['b7','light gate'],' and a card of known length on the car. The acceleration is the ',
    ['b8','gradient'],' of the velocity–time graph. A dropped tennis ball also speeds up as it falls, until air resistance balances its ',['b9','weight'],'.'
  ];
  const cloze=mk('div','cloze'),slots=[],chips=[];
  parts.forEach(p=>{
    if(typeof p==='string')cloze.appendChild(document.createTextNode(p));
    else{const s=mk('span','blank');cloze.appendChild(s);slots.push({id:p[0],el:s,answer:p[1]});chips.push({id:'c-'+p[0],text:p[1]});}
  });
  ['slowing down','area','mass','a push'].forEach((t,i)=>chips.push({id:'d'+i,text:t}));
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
  const body=act('method','Order','Carry out the practical','Put the steps in the order you would do them. Drag the ≡ handle, or use the ▲▼ buttons.');
  createReorder({host:body,steps:[
    {id:'a',text:'Raise one end of the ramp on a block. Measure the height with a ruler held upright.'},
    {id:'b',text:'Mark the start line, then mark distances every 20 cm down the ramp with a metre rule.'},
    {id:'c',text:'Hold the car still with its front edge on the start line.'},
    {id:'d',text:'Let go without pushing, and start the stopwatch at the same moment.'},
    {id:'e',text:'Stop the stopwatch as the front of the car passes the first mark.'},
    {id:'f',text:'Repeat three times, then do the same for each of the other marks.'},
    {id:'g',text:'Work out the mean time for each distance, and plot distance against time.'}
  ],constraints:[['a','c'],['b','c'],['c','d'],['d','e'],['e','f'],['f','g']],
  why:'The ramp and the marks are set up first; the car starts from rest on the start line, and you need every mean time before you can plot the graph.'});
}
{
  const body=act('method','Match','What each piece of equipment is for','Pair each piece of equipment with its job. Drag one card onto the other, or tap one card and then the other.');
  createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'r',l:'Metre rule',r:'Measures the distances marked along the ramp'},
    {id:'s',l:'Stopwatch',r:'Times the car, but your reaction time adds an error'},
    {id:'g',l:'Light gates',r:'Time the car to 0.001 s, with no reaction time'},
    {id:'c',l:'Card on the car',r:'Lets a light gate find the speed at one point'},
    {id:'b',l:'Block under the ramp',r:'Raises the ramp to a measured height'},
    {id:'x',l:'Box at the bottom',r:'Catches the car when it leaves the ramp'}
  ]});
}

/* ================= 3. VARIABLES ================= */
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
  const body=act('variables','Predict','A new question to test','');
  createPredict({host:body,q:'Sophie wants to find out how the height of the ramp affects the car’s speed at the bottom. What is her independent variable?',options:[
    {text:'The height of the ramp',correct:true},
    {text:'The speed at the bottom',why:'That is what she measures for each height, so it is the dependent variable.'},
    {text:'The length of the ramp',why:'She should keep the same ramp, so its length is a control variable.'},
    {text:'The mass of the toy car',why:'She should use the same car each time, so its mass is a control variable.'}
  ],explain:'The independent variable is the one she changes on purpose: the height of the ramp. For each height she measures the speed at the bottom, and keeps everything else the same.'});
}
{
  const body=act('variables','Predict','Let go, don’t push','');
  createPredict({host:body,q:'Why must Ali let go of the car rather than give it a little push?',options:[
    {text:'So it starts from rest, with the same speed every run',correct:true},
    {text:'So that the stopwatch can start a little bit later',why:'The stopwatch should start the moment the car moves. Letting go is about the car’s starting speed.'},
    {text:'So the car speeds up more quickly down the ramp',why:'A push changes the starting speed, not how quickly the ramp makes it speed up.'},
    {text:'So that his hand stays well clear of the ramp',why:'That is sensible, but the main reason is that every run must start from rest.'}
  ],explain:'The initial speed must be zero every run. A push gives the car a starting speed that is different each time, so the times would not be repeatable.'});
}

/* ================= 4. EXPERIMENT ================= */
{
  act('experiment','Your turn','Take your own readings','Press Experiment. Time the car to every mark with the stopwatch, then with light gates, on the 20 cm ramp. Then try 10 cm and 30 cm. Which timing method gives repeatable times, what shape is the distance–time graph, and how does the height of the ramp change the acceleration?');
}
frameAct('experiment','animations/ramp-motion.html','','Toy car on a ramp animation: timing the car with a stopwatch or light gates','toy car on a ramp',false);
{
  const body=act('experiment','Predict','Three different times','');
  createPredict({host:body,q:'Ali times the car to the same mark three times with a stopwatch: 1.25 s, 1.27 s and 1.20 s. Why are they different?',options:[
    {text:'His reaction time is different on each run',correct:true},
    {text:'The car speeds up by a different amount each run',why:'The same car on the same ramp speeds up in the same way each time. The difference comes from the timing.'},
    {text:'The stopwatch only measures to the nearest 0.1 s',why:'The stopwatch shows 0.01 s. The 0.07 s spread comes from when he presses the button.'},
    {text:'The distance to the mark changes from run to run',why:'The mark stays in the same place. What changes is when he starts and stops the stopwatch.'}
  ],explain:'He has to press the button as he lets go and again as the car passes the mark. His reaction time is a little different each time, so the times differ. That is why you repeat and find the mean.'});
}
{
  const body=act('experiment','Predict','Short times','');
  createPredict({host:body,q:'For the 20 cm mark the car takes only about 0.7 s. Why are light gates much better than a stopwatch here?',options:[
    {text:'Reaction time is a large part of such a short time',correct:true},
    {text:'A stopwatch cannot measure times below one second',why:'A stopwatch can show 0.70 s. The problem is that a person cannot press it at exactly the right moments.'},
    {text:'Light gates make the car go down the ramp faster',why:'A light gate only detects the car; it does not change its motion.'},
    {text:'The car is too small for the eye to see moving',why:'You can see the car. The problem is how quickly you can react to it.'}
  ],explain:'A reaction-time error of about 0.1 s is a big part of 0.7 s, but a small part of several seconds. Light gates start and stop the timer electronically, with no reaction time.'});
}

/* ================= 5. RESULTS ================= */
const RM=[[0.20,[0.74,0.70,0.75],'0.73'],[0.40,[1.05,0.99,1.02],'?'],[0.60,[1.25,1.27,1.20],'1.24'],[0.80,[1.44,1.41,1.47],'1.44'],[1.00,[1.60,1.63,1.57],'1.60'],[1.20,[1.78,1.73,1.77],'?']];
function rmTable(){
  const t=mk('div','table-scroll');
  t.innerHTML='<table class="units res-tbl"><thead><tr><th>Distance (m)</th><th>Time 1 (s)</th><th>Time 2 (s)</th><th>Time 3 (s)</th><th>Mean time (s)</th></tr></thead><tbody>'+
    RM.map(r=>'<tr><td>'+r[0].toFixed(2)+'</td>'+r[1].map(x=>'<td>'+x.toFixed(2)+'</td>').join('')+'<td>'+(r[2]==='?'?'<b>?</b>':r[2])+'</td></tr>').join('')+'</tbody></table>';
  t.querySelector('table').style.width='fit-content';
  return t;
}
{
  const body=act('results','Calculate','Complete Sophie’s results','Sophie timed her toy car three times to each mark with a stopwatch, on a ramp 20 cm high.');
  body.appendChild(rmTable());
  createCalc({host:body,questions:[
    {q:'Work out the mean time for 0.40 m.',unit:'s',answer:1.02,working:'mean = [[1.05 + 0.99 + 1.02|3]]<br>mean = [[3.06|3]]<br>mean = 1.02 s'},
    {q:'Work out the mean time for 1.20 m.',unit:'s',answer:1.76,working:'mean = [[1.78 + 1.73 + 1.77|3]]<br>mean = [[5.28|3]]<br>mean = 1.76 s'},
    {q:'What is the car’s average speed over the whole 1.20 m?',unit:'m/s',answer:0.68,working:'average speed = [[distance|time]]<br>average speed = [[1.20|1.76]]<br>average speed = 0.68 m/s'},
    {q:'The car sped up steadily from rest, so its final speed was twice its average speed. What was its acceleration?',unit:'m/s²',answer:0.775,working:'final speed = 2 × 0.682<br>final speed = 1.364 m/s<br>a = [[v − u|t]]<br>a = [[1.364 − 0|1.76]]<br>a = 0.775 m/s²'}
  ]});
}
{
  const body=act('results','Plot','Plot Sophie’s results','Plot distance against mean time for each row of Sophie’s table, as a small cross. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');
  createPlot({host:body,
    points:[{x:0.73,y:0.2},{x:1.02,y:0.4},{x:1.24,y:0.6},{x:1.44,y:0.8},{x:1.60,y:1.0},{x:1.76,y:1.2}],
    rowText:p=>fmt(p.x,2)+' s, '+p.y.toFixed(1)+' m',
    graph:{xMin:0,xMax:2,yMin:0,yMax:1.2,xTicks:[0,0.5,1,1.5,2],yTicks:[0,0.2,0.4,0.6,0.8,1,1.2],minor:[0.1,0.1],snap:[0.05,0.1],xLabel:'mean time (s)',yLabel:'distance (m)',W:560,H:340}});
}
{
  const body=act('results','Predict','The line of best fit','');
  createPredict({host:body,q:'What line of best fit should Sophie draw through her points?',options:[
    {text:'A smooth curve from the origin, getting steeper',correct:true},
    {text:'Short straight lines joining each point in turn',why:'Joining the dots follows every small timing error. A line of best fit shows the trend.'},
    {text:'One straight line through as many points as it can',why:'The points do not lie on a straight line: each 0.2 m takes less time than the one before.'},
    {text:'A smooth curve from the origin, getting less steep',why:'A curve getting less steep would mean the car was slowing down, but it covers each 0.2 m faster.'}
  ],explain:'At the start (time 0) the car is at distance 0, so the curve starts at the origin. It gets steeper and steeper because the car covers each 0.2 m more quickly: it is speeding up.'});
}
{
  const body=act('results','Predict','The speed at the bottom','');
  createPredict({host:body,q:'Ali divides 1.20 m by 1.76 s to get 0.68 m/s, and says this is the car’s speed as it passes the 1.20 m mark. Is he right?',options:[
    {text:'No: that is the average; it was faster at the end',correct:true},
    {text:'Yes: speed is always distance divided by time',why:'Distance divided by time gives the average speed for the whole trip. The car sped up, so it was going faster than average at the end.'},
    {text:'No: the car was going slower than that at the end',why:'The car was speeding up all the way, so at the end it was going faster than its average speed, not slower.'},
    {text:'Yes: the car went at a steady speed down the ramp',why:'The graph curves, so the speed was not steady: the car was speeding up.'}
  ],explain:'Distance divided by time gives the average speed. The car started from rest and sped up steadily, so its speed at the end was about twice the average: about 1.36 m/s. To measure it directly, use a light gate at the mark.'});
}
{
  const body=act('results','Predict','An anomalous result','');
  createPredict({host:body,q:'Zahra’s three times to the 0.60 m mark are below. Which is anomalous, and what should she do?',
    pre:'<div class="table-scroll"><table class="units res-tbl" style="width:fit-content"><thead><tr><th>Run</th><th>1</th><th>2</th><th>3</th></tr></thead><tbody><tr><th>Time (s)</th><td>1.25</td><td>1.27</td><td>1.62</td></tr></tbody></table></div>',
    options:[
    {text:'Run 3: time it again, and leave it out of the mean',correct:true},
    {text:'Run 1: it is the shortest, so it must be wrong',why:'1.25 s is close to 1.27 s. Being the shortest does not make a result anomalous.'},
    {text:'Run 3: keep it in the mean, as all runs count',why:'Including it would push the mean far too high. An anomalous result is repeated and left out.'},
    {text:'None: stopwatch times always spread by this much',why:'Reaction time spreads the times by a few hundredths of a second, not by 0.35 s.'}
  ],explain:'Runs 1 and 2 agree to within 0.02 s, but run 3 is 0.35 s longer: perhaps the car rubbed the side of the ramp, or she stopped the stopwatch late. Time it again, and leave it out of the mean.'});
}

/* ================= 6. GRAPHS ================= */
function lab(g0,t,x,y){return '<circle cx="'+g0.gx(x)+'" cy="'+g0.gy(y)+'" r="13" fill="var(--panel)" stroke="var(--ink)" stroke-width="2"/><text x="'+g0.gx(x)+'" y="'+(g0.gy(y)+5)+'" text-anchor="middle" font-size="14" fill="var(--ink)">'+t+'</text>';}
const GV={xMin:0,xMax:2.5,yMin:0,yMax:2.0,xTicks:[0,0.5,1,1.5,2,2.5],yTicks:[0,0.4,0.8,1.2,1.6,2.0],xLabel:'time (s)',yLabel:'velocity (m/s)',W:560,H:340};
function rampGraph(){
  const g0=lineGraph(Object.assign({points:[[0,0]]},GV));
  return lineGraph(Object.assign({label:'Velocity against time for three ramps A, B and C',segments:[{pts:[[0,0],[1.5,1.8]]},{pts:[[0,0],[2.25,1.8]],cls:'g-line-b'},{pts:[[0,0],[2.5,1.0]],cls:'g-line-c'}],
    extra:lab(g0,'A',1.5,1.8)+lab(g0,'B',2.25,1.8)+lab(g0,'C',2.5,1.0)},GV)).svg;
}
{
  const body=act('graphs','Calculate','Three ramps','The same toy car is released from rest on three ramps of different heights, A, B and C. Light gates give these velocity–time graphs. Read your answers off the graph.');
  const split=mk('div','graph-split');body.appendChild(split);
  split.appendChild(mk('div','graph-box',rampGraph()));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'Ramp B: what is the car’s acceleration?',unit:'m/s²',answer:0.8,working:'acceleration = gradient of the velocity–time graph<br>acceleration = [[change in velocity|time taken]]<br>acceleration = [[1.2 − 0|1.5 − 0]]<br>acceleration = 0.8 m/s²'},
    {q:'Ramp C: how far does the car travel in the first 2.0 s?',unit:'m',answer:0.8,working:'distance = area under the velocity–time graph<br>At 2.0 s, velocity = 0.8 m/s<br>distance = ½ × 2.0 × 0.8<br>distance = 0.8 m'},
    {q:'Ramp A: how long does the car take to reach 1.2 m/s?',unit:'s',answer:1.0,working:'Read across from 1.2 m/s to line A, then down.<br>time = 1.0 s'}
  ]});
}
{
  const body=act('graphs','Predict','Which is the highest ramp?','');
  createPredict({host:body,q:'Look at the graph above. Which line is the car on the highest ramp?',options:[
    {text:'A: its velocity rises fastest',correct:true},
    {text:'C: its line runs the longest',why:'C runs for the longest time because the car is slowest to reach the bottom, so its ramp is the lowest.'},
    {text:'B: it lies between the two',why:'B has the middle gradient, so it is the middle ramp.'},
    {text:'All the same: it is one car',why:'The same car speeds up faster on a steeper ramp, so the lines have different gradients.'}
  ],explain:'A steeper ramp gives a bigger acceleration, so the velocity–time line is steeper. Line A (1.2 m/s²) is the highest ramp and line C (0.4 m/s²) the lowest.'});
}
{
  const body=act('graphs','Predict','A straight line','');
  createPredict({host:body,q:'Each line on this velocity–time graph is straight. What does that tell you about the car?',options:[
    {text:'Its acceleration stays the same',correct:true},
    {text:'It moves at a steady speed',why:'A steady speed gives a flat line on a velocity–time graph. These lines slope up.'},
    {text:'Its acceleration keeps growing',why:'A growing acceleration would make the line curve upwards, getting steeper.'},
    {text:'It travels equal distances each second',why:'That would be a steady speed. The car covers more distance each second as it speeds up.'}
  ],explain:'The gradient of a velocity–time graph is the acceleration. A straight line has the same gradient all the way, so the acceleration is constant (uniform).'});
}
const GB={xMin:0,xMax:8,yMin:0,yMax:25,xTicks:[0,2,4,6,8],yTicks:[0,5,10,15,20,25],xLabel:'time (s)',yLabel:'velocity (m/s)',W:560,H:340};
function ballGraph(){
  const P=[];for(let t=0;t<=8.001;t+=0.1)P.push([t,20*(1-Math.exp(-t/2))]);
  const g0=lineGraph(Object.assign({points:[[0,0]]},GB));
  return lineGraph(Object.assign({label:'Velocity against time for a falling ball, with a tangent at the start',points:P,
    extra:'<line x1="'+g0.gx(0)+'" y1="'+g0.gy(0)+'" x2="'+g0.gx(2.5)+'" y2="'+g0.gy(25)+'" stroke="var(--ink-soft)" stroke-width="2" stroke-dasharray="7 5"/><text x="'+(g0.gx(2.5)+6)+'" y="'+(g0.gy(24)+4)+'" font-size="13" fill="var(--ink-soft)">tangent at t = 0</text>'},GB)).svg;
}
{
  const body=act('graphs','Calculate','A ball falling a long way','A ball is dropped from a great height. Its velocity–time graph is a curve; the dashed line is the tangent to the curve at the start. Read your answers off the graph.');
  const split=mk('div','graph-split');body.appendChild(split);
  split.appendChild(mk('div','graph-box',ballGraph()));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'What is the ball’s terminal velocity?',unit:'m/s',answer:20,working:'The curve levels off at 20 m/s.<br>terminal velocity = 20 m/s'},
    {q:'Use the tangent to find the ball’s acceleration at the start.',unit:'m/s²',answer:10,working:'acceleration = gradient of the tangent<br>acceleration = [[20 − 0|2.0 − 0]]<br>acceleration = 10 m/s²'}
  ]});
}
{
  const body=act('graphs','Predict','Why the curve levels off','');
  createPredict({host:body,q:'The ball’s velocity–time graph gets less and less steep, then flat. Why?',options:[
    {text:'Air resistance grows with speed until it equals the weight',correct:true},
    {text:'The ball’s weight gets smaller as it falls further down',why:'The weight stays the same. It is air resistance that changes as the ball speeds up.'},
    {text:'Gravity stops acting once the ball is moving quickly',why:'Gravity keeps acting; the weight is balanced by air resistance at terminal velocity.'},
    {text:'Air resistance gets smaller as the ball goes faster',why:'Air resistance gets bigger, not smaller, as the speed goes up.'}
  ],explain:'As the ball speeds up, air resistance grows, so the resultant force and the acceleration get smaller: the graph gets less steep. When air resistance equals the weight, the resultant force is zero and the ball falls at terminal velocity.'});
}
{
  const body=act('graphs','Predict','A short drop','');
  createPredict({host:body,q:'Sophie drops a tennis ball from 1 m in the lab. Why can she ignore air resistance for this drop?',options:[
    {text:'The ball is still slow, so air resistance is tiny',correct:true},
    {text:'There is no air resistance indoors at all',why:'There is air in the lab. It just cannot push much on a slow ball.'},
    {text:'A tennis ball is too heavy to feel air resistance',why:'Any moving ball feels air resistance; it grows with speed. After 1 m it is still small.'},
    {text:'Air resistance only acts on a ball moving upwards',why:'Air resistance acts against the motion, whichever way the ball moves.'}
  ],explain:'Air resistance grows with speed. After falling only 1 m the ball is moving at about 4.5 m/s, far below its terminal velocity, so air resistance is small compared with its weight.'});
}

/* ================= 7. CALCULATE ================= */
{
  const body=act('calculate','Calculate','Speed, acceleration and distance','Give each answer in the unit shown.');
  createCalc({host:body,questions:[
    {q:'A toy car rolls 1.5 m down a ramp in 2.5 s. What is its average speed?',unit:'m/s',answer:0.6,working:'average speed = [[distance|time]]<br>average speed = [[1.5|2.5]]<br>average speed = 0.6 m/s'},
    {q:'The car goes from rest to 1.2 m/s in 1.5 s. What is its acceleration?',unit:'m/s²',answer:0.8,working:'a = [[v − u|t]]<br>a = [[1.2 − 0|1.5]]<br>a = 0.8 m/s²'},
    {q:'From rest, the car accelerates at 0.80 m/s² for 1.0 m. Use v² = u² + 2as to find its final speed.',unit:'m/s',answer:1.26,working:'v² = u² + 2as<br>v² = 0² + 2 × 0.80 × 1.0<br>v² = 1.6<br>v = √1.6<br>v = 1.26 m/s'},
    {q:'A 5.0 cm card on the car blocks a light gate for 0.040 s. What is the car’s speed?',unit:'m/s',answer:1.25,working:'5.0 cm = 0.050 m<br>speed = [[distance|time]]<br>speed = [[0.050|0.040]]<br>speed = 1.25 m/s'}
  ]});
}
{
  const body=act('calculate','Spot the error','Find the mistake','Each answer has exactly one mistake, made while rearranging. Every line after it is worked correctly from it. Click the line with the mistake.');
  const grid=mk('div','');body.appendChild(grid);
  createSpot({host:grid,scenario:'A car accelerates from rest at 0.6 m/s² until it reaches 1.5 m/s. How long does this take?',
    lines:['a = [[v − u|t]]','0.6 = [[1.5 − 0|t]]','t = [[0.6|1.5]]','t = 0.4 s'],wrong:2,
    explain:'t is on the bottom, so 0.6 × t = 1.5, and t = 1.5 divided by 0.6. The fraction is upside down. A check: speeding up by only 0.6 m/s each second, it needs more than 2 s to reach 1.5 m/s.',
    fix:['0.6 × t = 1.5','t = [[1.5|0.6]]','t = 2.5 s']});
  createSpot({host:grid,scenario:'A car starts from rest and reaches 1.2 m/s, accelerating at 0.8 m/s². How far does it travel?',
    lines:['v² = u² + 2as','1.2² = 0² + 2 × 0.8 × s','1.44 = 1.6 × s','s = 1.6 × 1.44','s = 2.30 m'],wrong:3,
    explain:'s is multiplied by 1.6, so divide 1.44 by 1.6 to get s on its own.',
    fix:['s = [[1.44|1.6]]','s = 0.9 m']});
}

/* ================= 8. ACCURACY AND SAFETY ================= */
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
  const body=act('accuracy','Predict','The front of the car','');
  createPredict({host:body,q:'Why should Zahra stop the stopwatch when the front of the car passes each mark, every time?',options:[
    {text:'The distances are measured to the front of the car',correct:true},
    {text:'The front of the car is the part that moves fastest',why:'Every part of the car moves at the same speed. The point is to time to the same place you measured to.'},
    {text:'The back of the car is too hard to see clearly',why:'You could see the back, but the distance would then be wrong by the length of the car.'},
    {text:'It makes the car accelerate more steadily',why:'Where she looks cannot change how the car moves. It changes which distance she is timing.'}
  ],explain:'The car starts with its front edge on the start line, so each distance runs to the front of the car. Timing to the back instead would add the car’s length to every distance.'});
}
{
  const body=act('accuracy','Predict','Improving the graph','');
  createPredict({host:body,q:'Ali only times the car to three marks, all within 30 cm of the start. His graph looks almost straight. How should he improve it?',options:[
    {text:'Use more marks, all the way down the ramp',correct:true},
    {text:'Repeat each of the three times and find the mean',why:'Repeats make each time more reliable, but three marks close together still cannot show that the graph curves.'},
    {text:'Use a stopwatch that shows times to 0.001 s',why:'A finer display does not remove reaction time, and three close marks still hide the curve.'},
    {text:'Push the car to give it a faster start each time',why:'A push changes the starting speed every run, so the times would be less repeatable.'}
  ],explain:'The curve only shows up with enough distances over a wide range. Over the first 30 cm the curve looks nearly straight, so use marks every 20 cm all the way down.'});
}

/* ================= EXAM PRACTICE ================= */
{
  const body=act('exam','Exam style','Timing a toy car','Ali times a toy car rolling from rest down a ramp, three times for each distance. One mean is missing.');
  const tbl=mk('div','table-scroll');
  tbl.innerHTML='<table class="units res-tbl" style="width:fit-content"><thead><tr><th>Distance (m)</th><th>Time 1 (s)</th><th>Time 2 (s)</th><th>Time 3 (s)</th><th>Mean time (s)</th></tr></thead><tbody><tr><td>0.50</td><td>1.10</td><td>1.14</td><td>1.12</td><td>1.12</td></tr><tr><td>1.00</td><td>1.60</td><td>1.56</td><td>1.58</td><td>1.58</td></tr><tr><td>1.50</td><td>1.96</td><td>1.92</td><td>1.97</td><td><b>?</b></td></tr></tbody></table>';
  body.appendChild(tbl);
  body.appendChild(mk('p','sub','(a) 1 mark'));
  createCalc({host:body,questions:[
    {q:'Calculate the missing mean time for 1.50 m.',unit:'s',answer:1.95,working:'mean = [[1.96 + 1.92 + 1.97|3]]<br>mean = [[5.85|3]]<br>mean = 1.95 s'}
  ]});
  body.appendChild(mk('p','sub','(b) 2 marks'));
  createCalc({host:body,questions:[
    {q:'Calculate the car’s average speed over the 1.50 m.',unit:'m/s',answer:0.77,working:'average speed = [[distance|time]]<br>average speed = [[1.50|1.95]]<br>average speed = 0.77 m/s'}
  ]});
  body.appendChild(mk('p','sub','(c) 2 marks'));
  body.appendChild(mk('p','','Explain why the car’s speed as it passes the 1.50 m mark is not 0.77 m/s. Write your answer, then check it.'));
  const d1=mk('details','');
  d1.innerHTML='<summary>Check your answer</summary><div><ul><li>0.77 m/s is the average speed over the whole distance.</li><li>The car speeds up as it goes, so at 1.50 m it is going faster than its average speed (about twice as fast, as it started from rest).</li></ul></div>';
  body.appendChild(d1);
  body.appendChild(mk('p','sub','(d) 3 marks'));
  body.appendChild(mk('p','','Describe how Ali could measure the car’s speed as it passes the 1.50 m mark. Name any extra equipment he needs.'));
  const d2=mk('details','');
  d2.innerHTML='<summary>Check your answer</summary><div><ul><li>Fix a card of known length (for example 5.0 cm) to the top of the car, and measure its length.</li><li>Put a light gate at the 1.50 m mark, connected to a timer or data logger, to time how long the card blocks the beam.</li><li>The speed is the length of the card divided by the time the beam is blocked.</li></ul></div>';
  body.appendChild(d2);
  body.appendChild(mk('p','sub','(e) 3 marks'));
  body.appendChild(mk('p','','Suggest three reasons why Ali’s three times for the same distance are not exactly the same.'));
  const d3=mk('details','');
  d3.innerHTML='<summary>Check your answer</summary><div><ul><li>His reaction time when starting and stopping the stopwatch is different each run.</li><li>The car may not start in exactly the same place, or he may push it slightly as he lets go.</li><li>The car may rub against the side of the ramp, or run a slightly different path.</li></ul><p>“Human error” on its own does not score: say what the error is.</p></div>';
  body.appendChild(d3);
}
