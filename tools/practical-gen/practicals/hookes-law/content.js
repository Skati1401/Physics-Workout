/* ================= 1. OVERVIEW ================= */
{
  const body=act('overview','Fill in the blanks','The practical in one passage','Drag a word into each gap, or tap a word and then tap a gap. Some words are not needed.');
  const parts=[
    'Hang a spring from a clamp and use a ruler and a ',['b1','pointer'],' to read its original length. Add ',['b2','100 g'],' masses one at a time; each one adds a force of ',['b3','1 N'],
    '. The extension is the new length minus the ',['b4','original length'],'. Plot force against ',['b5','extension'],'. Where the graph is a straight line through the origin, extension is ',
    ['b6','directly proportional'],' to force, so the spring obeys ',['b7','Hooke’s law'],'. The point where the straight line starts to curve is the ',['b8','limit of proportionality'],
    '. If the spring goes back to its original length when the masses are removed, its behaviour is ',['b9','elastic'],'. A metal wire also obeys Hooke’s law at first, but its extension is tiny. A rubber band’s graph is ',['b10','curved'],', with no straight part, so it never obeys Hooke’s law.'
  ];
  const cloze=mk('div','cloze'),slots=[],chips=[];
  parts.forEach(p=>{
    if(typeof p==='string')cloze.appendChild(document.createTextNode(p));
    else{const s=mk('span','blank');cloze.appendChild(s);slots.push({id:p[0],el:s,answer:p[1]});chips.push({id:'c-'+p[0],text:p[1]});}
  });
  ['inversely proportional','plastic','volume','temperature'].forEach((t,i)=>chips.push({id:'d'+i,text:t}));
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
    {id:'a',text:'Clamp the spring to a stand, and clamp a ruler beside it. Check the ruler is vertical with a set square.'},
    {id:'b',text:'Fix a pointer to the bottom of the spring.'},
    {id:'c',text:'Read the original length at the pointer, with your eye level with it.'},
    {id:'d',text:'Hang a 100 g mass hanger on the spring. This adds a 1 N load.'},
    {id:'e',text:'Read the new length, then work out the extension.'},
    {id:'f',text:'Add another 100 g mass and repeat, until you have at least 8 readings.'},
    {id:'g',text:'Take the masses off one at a time and check the spring returns to its original length.'},
    {id:'h',text:'Plot force against extension and draw a line of best fit.'}
  ],constraints:[['a','c'],['b','c'],['c','d'],['d','e'],['e','f'],['f','g'],['f','h']],
  why:'You need the original length before any load goes on, and enough readings before you can plot the graph.'});
}
{
  const body=act('method','Match','What each piece of equipment is for','Pair each piece of equipment with its job. Drag one card onto the other, or tap one card and then the other.');
  createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'p',l:'Pointer',r:'Marks one exact point on the spring to read against the ruler'},
    {id:'s',l:'Set square',r:'Checks that the ruler is vertical'},
    {id:'m',l:'100 g masses',r:'Each one adds a known force of 1 N'},
    {id:'c',l:'Clamp and stand',r:'Hold the spring and the ruler still'},
    {id:'g',l:'Safety goggles',r:'Protect your eyes if the spring or wire snaps'},
    {id:'t',l:'Tray or crash pad',r:'Catches the masses if they fall'}
  ]});
}

/* ================= EXPERIMENT ================= */
{
  const body=act('experiment','Your turn','Take your own readings','Press Experiment, choose a mass size, then add the masses one at a time and watch your results table and graph fill in. Then take them off one at a time. Do it for all three samples. Which obeys Hooke’s law, up to what load, and which go back to their original length?');
}
frameAct('experiment','animations/hookes-law.html','','Hooke’s law animation: stretching a spring, wire or rubber band','Hooke’s law',false);

/* ================= 3. VARIABLES ================= */
{
  const body=act('variables','Sort','Which kind of variable is it?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'i',label:'Independent',hint:'You change it',color:'--c1',soft:'--c1-soft'},
    {id:'d',label:'Dependent',hint:'You measure it',color:'--c2',soft:'--c2-soft'},
    {id:'c',label:'Control',hint:'You keep it the same',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'The force (load) on the spring',cat:'i'},
    {id:'2',text:'The number of masses on the hanger',cat:'i'},
    {id:'3',text:'The extension of the spring',cat:'d'},
    {id:'4',text:'The length of the spring at the pointer',cat:'d'},
    {id:'5',text:'Using the same spring for every reading',cat:'c'},
    {id:'6',text:'Where the pointer is fixed on the spring',cat:'c'},
    {id:'7',text:'The temperature of the room',cat:'c'}
  ]});
}
{
  const body=act('variables','Predict','A new question to test','');
  createPredict({host:body,q:'Sophie wants to find out whether springs made of thicker wire stretch less. What is her independent variable?',options:[
    {text:'The thickness of the spring’s wire',correct:true},
    {text:'The load she hangs on each spring',why:'The load is what she changes in the basic practical. Here she must keep it the same for every spring, so it is a control variable.'},
    {text:'The extension of each spring',why:'The extension is what she measures, so it is the dependent variable.'},
    {text:'The original length of each spring',why:'The original length should be the same for every spring, so it is a control variable.'}
  ],explain:'The independent variable is the one she changes on purpose: the thickness of the wire. She keeps the load the same and measures the extension.'});
}
{
  const body=act('variables','Predict','Measuring the original length','');
  createPredict({host:body,q:'Why must Ali read the length of the spring before he adds any masses?',options:[
    {text:'Each extension is the new length minus this original length',correct:true},
    {text:'It is the only way to check the ruler is vertical',why:'A set square checks the ruler is vertical. The original length is needed to work out every extension.'},
    {text:'The spring is at its longest before any masses go on',why:'With no load the spring is at its shortest. That length is what each extension is measured from.'},
    {text:'It shows whether the spring obeys Hooke’s law',why:'One length on its own cannot show that. You need the extensions for several loads.'}
  ],explain:'Extension = new length − original length. Without the original length you cannot work out any extension, and an error in it would shift every result.'});
}

/* ================= EXPERIMENT (continued): wires, rubber bands, elastic behaviour ================= */
{
  const body=act('experiment','Sort','Elastic or permanently deformed?','Elastic means it goes back to its original shape once the force is removed. Sort each card, then press Check.');
  createSortGame({host:body,cats:[
    {id:'e',label:'Elastic behaviour',hint:'Back to its original shape',color:'--c3',soft:'--c3-soft'},
    {id:'p',label:'Permanently deformed',hint:'Stays changed',color:'--c2',soft:'--c2-soft'}
  ],items:[
    {id:'1',text:'A spring with a small load is unloaded and returns to its original length',cat:'e'},
    {id:'2',text:'A rubber band is stretched, released, and goes back to its original length',cat:'e'},
    {id:'3',text:'A copper wire is loaded only in its straight-line region, then unloaded',cat:'e'},
    {id:'4',text:'A trampoline goes back to flat after someone jumps on it',cat:'e'},
    {id:'5',text:'A spring loaded past its elastic limit is longer once unloaded',cat:'p'},
    {id:'6',text:'A copper wire is loaded until it thins and keeps stretching',cat:'p'},
    {id:'7',text:'A paper clip is bent open and stays bent',cat:'p'},
    {id:'8',text:'Modelling clay is squashed and keeps its new shape',cat:'p'}
  ]});
}
{
  const body=act('experiment','Predict','Testing a metal wire','');
  createPredict({host:body,q:'Copper wire stretches very little. Why do you test a long, thin wire (about 2 m) instead of a short, thick one?',options:[
    {text:'A long, thin wire gives an extension big enough to measure',correct:true},
    {text:'A short, thick wire would snap more easily',why:'A thick wire is stronger, not weaker. The problem is that its extension would be too small to measure.'},
    {text:'A long wire makes the load on it bigger',why:'The load is set by the masses you hang, not by the length of the wire.'},
    {text:'Thin wire obeys Hooke’s law, but thick wire does not',why:'Both obey Hooke’s law at first. The thin, long wire just stretches more, so it is easier to measure.'}
  ],explain:'Each part of the wire stretches a little, so a longer wire stretches more in total, and a thinner wire stretches more for the same load. Even then the extension is only millimetres, so it is read with a marker and a vernier scale rather than a ruler.'});
}
{
  const body=act('experiment','Predict','Unloading a rubber band','');
  createPredict({host:body,q:'Ali stretches a rubber band with loads up to 5 N. Its graph is curved. When he takes the loads off, it returns to its original length. Which is right?',options:[
    {text:'It shows elastic behaviour, but does not obey Hooke’s law',correct:true},
    {text:'It obeys Hooke’s law, because it is elastic',why:'Elastic only means it returns to its original shape. Hooke’s law needs a straight line through the origin, and this graph is curved.'},
    {text:'It is not elastic, because its graph is curved',why:'The shape of the graph does not decide whether it is elastic. It went back to its original length, so it is elastic.'},
    {text:'It is neither elastic nor obeys Hooke’s law',why:'It returned to its original length, so it is elastic, even though it does not obey Hooke’s law.'}
  ],explain:'Elastic behaviour and Hooke’s law are different ideas. A rubber band returns to its original length (elastic), but its extension is not proportional to the force (no Hooke’s law).'});
}

/* ================= GRAPHS ================= */
const GR={xMin:0,xMax:20,yMin:0,yMax:10,xTicks:[0,4,8,12,16,20],yTicks:[0,2,4,6,8,10],xLabel:'extension (cm)',yLabel:'force (N)',W:560,H:340};
function lab(g0,t,x,y){return '<circle cx="'+g0.gx(x)+'" cy="'+g0.gy(y)+'" r="13" fill="var(--panel)" stroke="var(--ink)" stroke-width="2"/><text x="'+g0.gx(x)+'" y="'+(g0.gy(y)+5)+'" text-anchor="middle" font-size="14" fill="var(--ink)">'+t+'</text>';}
function hookeGraph(label){
  const A=[[0,0],[4,8],[4.6,8.7],[5.4,9.4],[6.5,10]];
  const C=[[0,0],[10,5],[12,5.7],[14.5,6.3],[18,6.8]];
  const B=[[0,0],[1,0.9],[2.5,1.5],[5,2],[8,2.5],[11,3.1],[13.5,3.9],[15,5],[16,6.6],[16.6,8.2],[17,10]];
  const g0=lineGraph(Object.assign({points:[[0,0]]},GR));
  return lineGraph(Object.assign({label:label,segments:[{pts:A},{pts:B,cls:'g-line-b'},{pts:C,cls:'g-line-c'}],
    extra:lab(g0,'A',6.5,10)+lab(g0,'B',17,10)+lab(g0,'C',18,6.8)},GR)).svg;
}
{
  const body=act('graphs','Calculate','Read the graph','The graph shows force against extension for two springs and a rubber band. Read your answers off the graph.');
  const split=mk('div','graph-split');body.appendChild(split);
  split.appendChild(mk('div','graph-box',hookeGraph('Force against extension for lines A, B and C')));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'Spring A: what is its extension with a 6 N load?',unit:'cm',answer:3,working:'Line A is straight up to 8 N.<br>At 8 N, extension = 4 cm<br>At 6 N, extension = [[6|8]] × 4<br>extension = 3 cm'},
    {q:'Spring C: at what load is its limit of proportionality?',unit:'N',answer:5,working:'Line C is straight up to the point (10 cm, 5 N), then curves.<br>limit of proportionality = 5 N'},
    {q:'Spring C: what is its extension with a 4 N load?',unit:'cm',answer:8,working:'At 5 N, extension = 10 cm<br>At 4 N, extension = [[4|5]] × 10<br>extension = 8 cm'},
    {q:'Spring A: what load gives an extension of 2 cm?',unit:'N',answer:4,working:'At 4 cm, force = 8 N<br>At 2 cm, force = [[2|4]] × 8<br>force = 4 N'}
  ]});
}
{
  const body=act('graphs','Predict','Which line?','');
  createPredict({host:body,q:'Look at the graph above. Which line is the rubber band?',options:[
    {text:'Line B: it is never a straight line',correct:true},
    {text:'Line A: it is the steepest line',why:'Line A is straight up to 8 N, so it obeys Hooke’s law at first. A rubber band never does.'},
    {text:'Line C: it reaches the largest extension',why:'Line C is straight up to 5 N, so it is a spring that obeys Hooke’s law at first.'},
    {text:'None: rubber bands obey Hooke’s law too',why:'A rubber band’s force–extension graph is curved, so extension is not proportional to force.'}
  ],explain:'Lines A and C start as straight lines through the origin (springs obeying Hooke’s law). Line B is never straight: it stretches easily in the middle, then gets stiffer, which is what a rubber band does.'});
}
{
  const body=act('graphs','Predict','Which spring is stiffer?','');
  createPredict({host:body,q:'Which spring is stiffer (harder to stretch), A or C?',options:[
    {text:'A: it needs more force for each centimetre',correct:true},
    {text:'C: its line goes further across the graph',why:'Going further across means it stretched more, which makes it easier to stretch, not stiffer.'},
    {text:'Neither: both start as straight lines',why:'Both obey Hooke’s law at first, but their lines have different slopes, so they are not equally stiff.'},
    {text:'C: it has the lower limit of proportionality',why:'The limit tells you where the straight part ends, not how stiff the spring is.'}
  ],explain:'On a force–extension graph (force up the side) the stiffer spring has the steeper line. Spring A needs 2 N for each centimetre; spring C needs only 0.5 N.'});
}
/* the same idea with the axes the other way round, as many exam papers draw it */
const GR2={xMin:0,xMax:10,yMin:0,yMax:12,xTicks:[0,2,4,6,8,10],yTicks:[0,2,4,6,8,10,12],xLabel:'force (N)',yLabel:'extension (cm)',W:560,H:340};
function swapGraph(label){
  const P=[[0,0],[8,9.6],[9,11],[9.6,12]];
  const Q=[[0,0],[10,5]];
  const g0=lineGraph(Object.assign({points:[[0,0]]},GR2));
  return lineGraph(Object.assign({label:label,segments:[{pts:P,cls:'g-line-c'},{pts:Q,cls:'g-line-b'}],
    extra:lab(g0,'P',9.6,12)+lab(g0,'Q',10,5)},GR2)).svg;
}
{
  const body=act('graphs','Calculate','The axes the other way round','Many exam questions plot extension up the side and force along the bottom. Read your answers off this graph for springs P and Q.');
  const split=mk('div','graph-split');body.appendChild(split);
  split.appendChild(mk('div','graph-box',swapGraph('Extension against force for springs P and Q')));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'Spring P: what is its extension with a 5 N load?',unit:'cm',answer:6,working:'Line P is straight up to 8 N.<br>At 5 N, read across from the line: extension = 6 cm'},
    {q:'Spring Q: what load gives an extension of 3 cm?',unit:'N',answer:6,working:'At 10 N, extension = 5 cm<br>At 3 cm, force = [[3|5]] × 10<br>force = 6 N'}
  ]});
}
{
  const body=act('graphs','Predict','Stiffer, with the axes swapped','');
  createPredict({host:body,q:'On this graph, which spring is stiffer (harder to stretch), P or Q?',options:[
    {text:'Q: it stretches less for each newton',correct:true},
    {text:'P: its line is steeper',why:'With extension up the side, a steeper line means more stretch for each newton, so P is easier to stretch.'},
    {text:'P: it reaches a bigger extension',why:'A bigger extension for the same load means the spring is easier to stretch, not stiffer.'},
    {text:'Neither: both are straight lines',why:'Both obey Hooke’s law, but they stretch by different amounts for the same load.'}
  ],explain:'With extension up the side, the stiffer spring has the less steep line. Q stretches 0.5 cm for each newton; P stretches 1.2 cm.'});
}
{
  const body=act('graphs','Predict','Is steeper always stiffer?','');
  createPredict({host:body,q:'Sophie says, “The steeper line is always the stiffer spring.” Is she right?',options:[
    {text:'Only when force is up the side of the graph',correct:true},
    {text:'Yes, on every force–extension graph',why:'Look at P and Q: with extension up the side, the steeper line (P) is the easier spring to stretch.'},
    {text:'Only when extension is up the side of the graph',why:'With extension up the side, the steeper line stretches more for each newton, so it is less stiff.'},
    {text:'No: stiffness cannot be seen on a graph',why:'You can see it from the slope; you just have to check which way round the axes are.'}
  ],explain:'Always check the axes. Force up the side: steeper means stiffer. Extension up the side: steeper means easier to stretch.'});
}

/* ================= 4. RESULTS ================= */
{
  const body=act('results','Calculate','Complete the results table','Ali’s spring is 12.0 cm long with no load. Work out each extension.');
  const tbl=mk('div','table-scroll');
  tbl.innerHTML='<table class="units res-tbl"><thead><tr><th>Load (N)</th><th>Length (cm)</th><th>Extension (cm)</th></tr></thead><tbody>'+
    [[0,'12.0','0'],[2,'14.4','?'],[4,'16.8','?'],[6,'19.2','?'],[8,'23.0','?']].map(r=>'<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td></tr>').join('')+'</tbody></table>';
  body.appendChild(tbl);
  const w=(L,x)=>'extension = new length − original length<br>extension = '+L+' − 12.0<br>extension = '+x+' cm';
  createCalc({host:body,questions:[
    {q:'Extension with a 2 N load',unit:'cm',answer:2.4,working:w('14.4','2.4')},
    {q:'Extension with a 4 N load',unit:'cm',answer:4.8,working:w('16.8','4.8')},
    {q:'Extension with a 6 N load',unit:'cm',answer:7.2,working:w('19.2','7.2')},
    {q:'Extension with an 8 N load',unit:'cm',answer:11.0,working:w('23.0','11.0')}
  ]});
}
{
  const body=act('results','Plot','Plot Ali’s results','Plot each point from Ali’s table as a small cross. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');
  createPlot({host:body,
    points:[{x:2.4,y:2},{x:4.8,y:4},{x:7.2,y:6},{x:11,y:8}],
    rowText:p=>p.y+' N, '+fmt(p.x,1)+' cm',
    graph:{xMin:0,xMax:12,yMin:0,yMax:8,xTicks:[0,2,4,6,8,10,12],yTicks:[0,2,4,6,8],minor:[0.4,0.5],snap:[0.2,0.5],xLabel:'extension (cm)',yLabel:'force (N)',W:560,H:340}});
}
{
  const body=act('results','Predict','Reading the results','');
  createPredict({host:body,q:'Use Ali’s table. Up to which load does the spring obey Hooke’s law?',options:[
    {text:'To at least 6 N: each extra 2 N adds 2.4 cm',correct:true},
    {text:'Up to 8 N: the extension goes up every time',why:'Going up is not enough. Hooke’s law needs the extension to be proportional to the force; from 6 N to 8 N it grows by 3.8 cm, not 2.4 cm.'},
    {text:'Only to 2 N: the later rows are all different',why:'The extensions are different, but 4.8 cm is twice 2.4 cm and 7.2 cm is three times it, so they are still in proportion.'},
    {text:'Never: no extension equals its load',why:'Proportional does not mean equal. It means doubling the force doubles the extension.'}
  ],explain:'From 0 to 6 N, each extra 2 N adds 2.4 cm, so extension is directly proportional to force. From 6 N to 8 N it adds 3.8 cm. So the spring obeys Hooke’s law to at least 6 N, and its limit of proportionality is somewhere between 6 N and 8 N.'});
}
{
  const body=act('results','Predict','Taking the masses off','');
  createPredict({host:body,q:'Ali takes all the masses off. The spring now measures 12.6 cm, not 12.0 cm. What does this show?',options:[
    {text:'It went past its elastic limit and is permanently stretched',correct:true},
    {text:'It is still elastic, because it got shorter again',why:'Elastic means it returns to its original length. It is 0.6 cm longer than it started, so it has not fully recovered.'},
    {text:'Springs always stay a little longer; that is normal',why:'A spring that is not overloaded returns to its original length. Staying longer is a sign it was overloaded.'},
    {text:'The extension at 8 N must have been measured wrongly',why:'The 8 N reading fits a spring that has gone past its limit. The longer final length is a second sign of the same thing.'}
  ],explain:'Elastic behaviour means the spring goes back to its original shape when the load is removed. This one was loaded too far (8 N), so it has been permanently deformed.'});
}

{
  const body=act('results','Predict','The line of best fit','');
  createPredict({host:body,q:'What line of best fit should Ali draw through his plotted points?',options:[
    {text:'A straight line through the origin to 6 N, then a smooth curve',correct:true},
    {text:'Short straight lines joining each point to the next',why:'Joining the dots follows every small error. A line of best fit shows the trend, so it is one smooth line.'},
    {text:'One straight line through every point, from 0 to 8 N',why:'The 8 N point is well off the straight line, so the trend changes there. Forcing one straight line hides the limit of proportionality.'},
    {text:'A smooth curve from the origin through every point',why:'The first four points lie on a straight line. Drawing a curve there hides that the spring obeys Hooke’s law.'}
  ],explain:'Draw one thin, smooth line that follows the trend: straight through the origin while the points are in line, then curving once they are not.'});
}
{
  const body=act('results','Predict','An anomalous result','');
  createPredict({host:body,q:'Zahra’s results are below. Which result is anomalous, and what should she do?',
    pre:'<div class="table-scroll"><table class="units res-tbl"><thead><tr><th>Load (N)</th><th>0</th><th>2</th><th>4</th><th>6</th><th>8</th></tr></thead><tbody><tr><th>Extension (cm)</th><td>0</td><td>1.6</td><td>3.2</td><td>5.9</td><td>6.4</td></tr></tbody></table></div>',
    options:[
    {text:'6 N: repeat that reading, and leave it out of the line',correct:true},
    {text:'8 N: it is the biggest, so leave it out',why:'6.4 cm fits the pattern: 1.6 cm for each 2 N. Being the biggest does not make a result anomalous.'},
    {text:'6 N: average it in with the other results',why:'Averaging an anomalous result in drags the answer away from the true value. Repeat it, and ignore it when drawing the line.'},
    {text:'None: every reading counts, so use them all',why:'One result breaks the pattern of 1.6 cm for each 2 N, so it is probably a mistake in measuring or recording.'}
  ],explain:'Each 2 N should add 1.6 cm, so 6 N should give about 4.8 cm, not 5.9 cm. An anomalous result does not fit the pattern: repeat it if you can, and leave it out when drawing the line of best fit.'});
}

/* ================= 5. CALCULATE ================= */
{
  const body=act('calculate','Calculate','Weight, mass and extension','Use g = 10 N/kg. Give each answer in the unit shown.');
  createCalc({host:body,questions:[
    {q:'A mass hanger and its masses have a total mass of 600 g. What weight do they put on the spring?',unit:'N',answer:6,working:'600 g = 0.6 kg<br>W = m × g<br>W = 0.6 × 10<br>W = 6 N'},
    {q:'A load of 4.5 N is hanging on a spring. What mass is hanging?',unit:'kg',answer:0.45,working:'W = m × g<br>4.5 = m × 10<br>m = [[4.5|10]]<br>m = 0.45 kg'},
    {q:'A spring is 8.0 cm long. With a load on it, it is 13.5 cm long. What is the extension in mm?',unit:'mm',answer:55,working:'extension = new length − original length<br>extension = 13.5 − 8.0<br>extension = 5.5 cm<br>5.5 cm = 55 mm'},
    {q:'A spring obeys Hooke’s law. A 3.0 N load stretches it by 2.4 cm. How far does a 5.0 N load stretch it?',unit:'cm',answer:4.0,working:'extension per newton = [[2.4|3.0]]<br>extension per newton = 0.8 cm per N<br>extension = 0.8 × 5.0<br>extension = 4.0 cm'}
  ]});
}
{
  const body=act('calculate','Spot the error','Find the mistake','Each answer has exactly one mistake, made while rearranging. Every line after it is worked correctly from it. Click the line with the mistake.');
  const grid=mk('div','');body.appendChild(grid);
  createSpot({host:grid,scenario:'Zahra works out the mass that puts a 7 N load on a spring. g = 10 N/kg.',
    lines:['W = m × g','7 = m × 10','m = [[10|7]]','m = 1.4 kg'],wrong:2,
    explain:'To get m on its own, divide 7 by 10. Zahra divided 10 by 7, so the fraction is upside down.',
    fix:['m = [[7|10]]','m = 0.7 kg']});
  createSpot({host:grid,scenario:'A 2.0 N load stretches a spring by 1.6 cm. The spring obeys Hooke’s law. What load gives an extension of 4.0 cm?',
    lines:['extension per newton = [[1.6|2.0]]','extension per newton = 0.8 cm per N','4.0 = 0.8 × load','load = 4.0 × 0.8','load = 3.2 N'],wrong:3,
    explain:'To get the load on its own, divide 4.0 by 0.8, not multiply. A check: a bigger extension (4.0 cm) needs a bigger load than 2.0 N, but 3.2 N would give only 2.56 cm.',
    fix:['load = [[4.0|0.8]]','load = 5.0 N']});
}

/* ================= 6. ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Better results or safer?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'Better results',hint:'More accurate or more useful readings',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps people safe',hint:'Protects people and equipment',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Read the ruler with your eye level with the pointer',cat:'a'},
    {id:'2',text:'Check the ruler is vertical with a set square',cat:'a'},
    {id:'3',text:'Wait for the spring to stop bouncing before you read it',cat:'a'},
    {id:'4',text:'Take readings over a wide range of loads',cat:'a'},
    {id:'5',text:'Wear safety goggles while the spring is stretched',cat:'s'},
    {id:'6',text:'Put a tray or crash pad under the masses',cat:'s'},
    {id:'7',text:'Keep your feet away from where the masses could fall',cat:'s'},
    {id:'8',text:'Clamp the stand to the bench so it cannot tip over',cat:'s'}
  ]});
}
{
  const body=act('accuracy','Predict','Eye level','');
  createPredict({host:body,q:'Why should you read the ruler with your eye level with the pointer?',options:[
    {text:'From above or below, the pointer seems to line up with a different mark',correct:true},
    {text:'It keeps your face close to the spring, which is safer',why:'Being close to a stretched spring is less safe, not more. Goggles keep you safe; eye level is about accuracy.'},
    {text:'It makes the spring stretch the same amount each time',why:'Where you look from cannot change the stretch. It only changes the reading you take.'},
    {text:'A ruler is only accurate near its middle',why:'A ruler is equally accurate along its whole length. The problem is the angle you look from.'}
  ],explain:'Looking at an angle makes the pointer appear against the wrong mark (a parallax error). With your eye level with the pointer, you read the mark it is really at.'});
}
{
  const body=act('accuracy','Predict','Improving the data','');
  createPredict({host:body,q:'Ali tests a rubber band with only three loads: 0.5 N, 1.0 N and 1.5 N. His points look like a straight line. How should he improve his data?',options:[
    {text:'Use more loads, over a wider range',correct:true},
    {text:'Repeat the three readings and average them',why:'Repeating makes each reading more reliable, but three loads close together still cannot show that the graph curves.'},
    {text:'Use a longer ruler',why:'A longer ruler does not help: the problem is that he took too few loads, too close together.'},
    {text:'Use a stiffer band so it stretches less',why:'A smaller stretch is harder to measure, and it still would not show the shape of the graph.'}
  ],explain:'A rubber band’s graph curves, but you only see this with enough readings over a wide range of loads. Three loads close together can look like a straight line.'});
}

/* ================= EXAM PRACTICE ================= */
{
  const body=act('exam','Exam style','Does the spring obey Hooke’s law?','Sophie loads a spring and records these results. One reading is missing.');
  const tbl=mk('div','table-scroll');
  tbl.innerHTML='<table class="units res-tbl"><thead><tr><th>Load (N)</th><th>0</th><th>2</th><th>4</th><th>6</th><th>8</th><th>10</th></tr></thead><tbody><tr><th>Extension (cm)</th><td>0</td><td>1.5</td><td>3.0</td><td><b>?</b></td><td>6.0</td><td>8.9</td></tr></tbody></table>';
  body.appendChild(tbl);
  body.appendChild(mk('p','sub','(a) 2 marks'));
  createCalc({host:body,questions:[
    {q:'Sophie forgot to write down the extension at 6 N. Predict the missing result.',unit:'cm',answer:4.5,working:'From 0 to 8 N, each extra 2 N adds 1.5 cm.<br>extension at 6 N = 3.0 + 1.5<br>extension at 6 N = 4.5 cm'}
  ]});
  body.appendChild(mk('p','sub','(b) 3 marks'));
  body.appendChild(mk('p','','Sophie says the spring obeys Hooke’s law for every load she used. Discuss whether she is right. Use data from the table. Write your answer, then check it.'));
  const d1=mk('details','');
  d1.innerHTML='<summary>Check your answer</summary><div><ul><li>From 0 to 8 N, each extra 2 N adds 1.5 cm, so extension is directly proportional to load.</li><li>From 8 N to 10 N the extension goes up by 2.9 cm, much more than 1.5 cm, so it is no longer proportional.</li><li>So she is wrong: the spring obeys Hooke’s law to at least 8 N, and its limit of proportionality is somewhere between 8 N and 10 N.</li></ul></div>';
  body.appendChild(d1);
  body.appendChild(mk('p','sub','(c) 2 marks'));
  body.appendChild(mk('p','','When Sophie takes all the masses off, the spring is 0.4 cm longer than at the start. Explain what this shows.'));
  const d2=mk('details','');
  d2.innerHTML='<summary>Check your answer</summary><div><ul><li>The spring did not return to its original length.</li><li>So it was stretched past its elastic limit and has been permanently deformed: above that load its behaviour was not elastic.</li></ul></div>';
  body.appendChild(d2);
  body.appendChild(mk('p','sub','(d) 2 marks'));
  body.appendChild(mk('p','','Sophie repeats the test with a rubber band. Describe how its force–extension graph would be different from the spring’s.'));
  const d3=mk('details','');
  d3.innerHTML='<summary>Check your answer</summary><div><ul><li>The rubber band’s graph is curved, with no straight-line part.</li><li>So its extension is not directly proportional to the force: it does not obey Hooke’s law.</li></ul></div>';
  body.appendChild(d3);
}
