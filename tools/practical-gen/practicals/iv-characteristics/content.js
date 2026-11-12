/* ================= 1. METHOD ================= */
{
  const body=act('method','Order','Carry out the practical','Put the steps in the order you would do them. Drag the ≡ handle, or use the ▲▼ buttons.');
  createReorder({host:body,steps:[
    {id:'a',text:'Connect the component in series with an ammeter, a variable resistor and the power supply (or use a variable power supply).'},
    {id:'b',text:'Connect a voltmeter in parallel across the component.'},
    {id:'c',text:'Set the variable resistor so the voltage is small. Record the voltage and the current.'},
    {id:'d',text:'Change the variable resistor in steps, recording the voltage and current each time, for a range of voltages.'},
    {id:'h',text:'Repeat each reading and work out the mean current at each voltage.'},
    {id:'e',text:'Reverse the connections to the component (or the supply) and repeat, to get negative readings.'},
    {id:'f',text:'Switch off between readings, so the component does not heat up.'},
    {id:'g',text:'Plot current (y-axis) against voltage (x-axis), and draw a line of best fit.'}
  ],constraints:[['a','c'],['b','c'],['c','d'],['d','h'],['d','e'],['h','g'],['e','g']],
  why:'Build the circuit with both meters before taking any readings, take readings over a range in both directions, repeating them to find a mean, then plot. Switching off between readings can happen at any point while you take them.'});
}
{
  const body=act('method','Match','What each piece of equipment is for','Pair each piece of equipment with its job. Drag one card onto the other, or tap one card and then the other.');
  createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'a',l:'Ammeter, in series',r:'Measures the current through the component'},
    {id:'v',l:'Voltmeter, in parallel',r:'Measures the voltage across the component'},
    {id:'r',l:'Variable resistor',r:'Changes the current, and so the voltage across the component'},
    {id:'p',l:'Protective resistor',r:'Stops too big a current flowing through a diode'},
    {id:'s',l:'Switch',r:'Turns the current off between readings, so the component stays cool'}
  ]});
}

/* The circuit diagram: the most-asked 2.9 item. Build it (the animation's Build mode, modelled on May 2023 P1 2(a), Nov 2024 P1 9(a),
   Nov 2020 P1 5(a)), then find the errors in a drawn circuit (Jan 2015 P1 10(a): cells the wrong way round, ammeter in parallel, voltmeter in series). */
{
  act('method','Your turn','Build the circuit','The animation deals a task. Put the ammeter and the voltmeter into the circuit diagram, then press Go to see whether it works. In the exam: correct symbols, the ammeter in series, the voltmeter in parallel with the component, and a variable resistor (or a variable supply) to change the current.');
}
frameAct('method','animations/iv-characteristics.html','build','Build the I–V circuit: put the meters into the circuit diagram','current–voltage characteristics',false);
// Ali's circuit as an exam circuit diagram. fixed=false: his drawing (second cell turned round, ammeter across the lamp, voltmeter in the
// main loop). fixed=true: the same circuit put right, with the three changes in green.
function iv29CircuitSVG(fixed){
  const INK='var(--ink)',OK='var(--good)',col=c=>fixed&&c?OK:INK;
  const ln=(x1,y1,x2,y2,c,w)=>'<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+col(c)+'" stroke-width="'+(w||2.4)+'" stroke-linecap="round"/>';
  const dot=(x,y,c)=>'<circle cx="'+x+'" cy="'+y+'" r="4" fill="'+col(c)+'"/>';
  const meter=(x,y,t,c)=>'<circle cx="'+x+'" cy="'+y+'" r="17" fill="var(--panel)" stroke="'+col(c)+'" stroke-width="2.4"/><text x="'+x+'" y="'+(y+6)+'" text-anchor="middle" font-size="18" font-weight="600" fill="'+col(c)+'">'+t+'</text>';
  // a cell: the long thin plate is positive, the short thick plate negative; pos says which side the long plate is on
  const cell=(x,y,pos,c)=>{const xl=pos==='l'?x-5:x+5,xs=pos==='l'?x+5:x-5;return ln(xl,y-17,xl,y+17,c,2.4)+ln(xs,y-9,xs,y+9,c,5.5);};
  const L=60,R=330,T=48,B=222,X2=412;
  let s='<svg class="graph" viewBox="0 0 460 270" role="img" aria-label="'+(fixed?'Ali’s circuit put right: both cells the same way round, the ammeter in series and the voltmeter across the lamp':'Ali’s circuit diagram: two cells, a switch, a variable resistor, a voltmeter, a filament lamp and an ammeter')+'">';
  s+='<rect x="1" y="1" width="458" height="268" rx="8" fill="var(--panel)" stroke="var(--panel-border)"/>';
  // top: two cells joined by a short wire
  s+=ln(L,T,165,T)+cell(170,T,'l')+ln(175,T,215,T)+cell(220,T,fixed?'l':'r',true)+ln(225,T,R,T);
  // right: the filament lamp, with a meter connected across it
  s+=ln(R,T,R,118)+'<circle cx="'+R+'" cy="135" r="17" fill="var(--panel)" stroke="'+INK+'" stroke-width="2.4"/>'+ln(R-12,123,R+12,147)+ln(R+12,123,R-12,147)+ln(R,152,R,B);
  s+=ln(R,88,X2,88,true)+ln(X2,88,X2,118,true)+meter(X2,135,fixed?'V':'A',true)+ln(X2,152,X2,182,true)+ln(X2,182,R,182,true)+dot(R,88,true)+dot(R,182,true);
  // bottom: a meter and the variable resistor in the main loop
  s+=ln(R,B,267,B)+meter(250,B,fixed?'A':'V',true)+ln(233,B,176,B)+'<rect x="124" y="211" width="52" height="22" fill="var(--panel)" stroke="'+INK+'" stroke-width="2.4"/>'+ln(124,B,L,B);
  s+='<path d="M116,243 L182,203" stroke="'+INK+'" stroke-width="2.4" stroke-linecap="round"/><path d="M187,200 L175,201 L181,211 z" fill="'+INK+'" stroke="'+INK+'" stroke-width="1.5" stroke-linejoin="round"/>';
  // left: an open switch
  s+=ln(L,B,L,158)+ln(L,154,L+22,118)+ln(L,112,L,T)+'<circle cx="'+L+'" cy="154" r="4.5" fill="var(--panel)" stroke="'+INK+'" stroke-width="2.4"/><circle cx="'+L+'" cy="112" r="4.5" fill="var(--panel)" stroke="'+INK+'" stroke-width="2.4"/>';
  return s+'</svg>';
}
{
  const body=act('method','Sort','Find the errors in Ali’s circuit','Ali draws the circuit he will use to find the I–V characteristic of a filament lamp. Look at where each part is connected, then sort it and press Check.');
  const split=mk('div','graph-split'),box=mk('div','graph-box',iv29CircuitSVG(false)),side=mk('div','act-body');
  split.appendChild(box);split.appendChild(side);body.appendChild(split);
  createSortGame({host:side,cats:[
    {id:'ok',label:'Connected correctly',hint:'Leave it as it is',color:'--c1',soft:'--c1-soft'},
    {id:'no',label:'Connected wrongly',hint:'Ali must change it',color:'--c2',soft:'--c2-soft'}
  ],items:[
    {id:'1',text:'The ammeter',cat:'no'},
    {id:'2',text:'The voltmeter',cat:'no'},
    {id:'3',text:'The two cells',cat:'no'},
    {id:'4',text:'The variable resistor',cat:'ok'},
    {id:'5',text:'The switch',cat:'ok'},
    {id:'6',text:'The filament lamp',cat:'ok'}
  ]});
  const d=mk('details','');
  d.innerHTML='<summary>Why</summary><div><ul><li>The ammeter is in parallel with the lamp: it must be in series, so the same current flows through it.</li><li>The voltmeter is in series: it must be in parallel across the lamp.</li><li>The second cell faces the wrong way, so the two cells cancel: each cell’s long plate must join the next cell’s short plate.</li><li>The variable resistor and the switch are in series, as they should be.</li></ul><p class="act-intro">Ali’s circuit put right (his three changes are in green):</p><div class="graph-box">'+iv29CircuitSVG(true)+'</div></div>';
  body.appendChild(d);
}

/* ================= 2. VARIABLES ================= */
{
  const body=act('variables','Sort','Which kind of variable is it?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'i',label:'Independent',hint:'You change it',color:'--c1',soft:'--c1-soft'},
    {id:'d',label:'Dependent',hint:'You measure it',color:'--c2',soft:'--c2-soft'},
    {id:'c',label:'Control',hint:'You keep it the same',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'The voltage across the component',cat:'i'},
    {id:'2',text:'The setting of the variable resistor',cat:'i'},
    {id:'3',text:'The current through the component',cat:'d'},
    {id:'4',text:'The reading on the ammeter',cat:'d'},
    {id:'5',text:'Using the same component for every reading',cat:'c'},
    {id:'6',text:'The temperature of a resistor or wire',cat:'c'},
    {id:'7',text:'The length of a wire being tested',cat:'c'}
  ]});
}
{
  const body=act('variables','Predict','A new question to test','');
  createPredict({host:body,q:'Fatimah wants to find out how the length of a wire affects its resistance. What is her independent variable?',options:[
    {text:'The length of the wire',correct:true},
    {text:'The current through the wire',why:'She measures the current (and the voltage) to work out the resistance. It is not what she chooses to change.'},
    {text:'The resistance of the wire',why:'The resistance is what she works out from her readings, so it depends on the length.'},
    {text:'The thickness of the wire',why:'She must keep the thickness the same, so it is a control variable.'}
  ],explain:'The independent variable is the one she changes on purpose: the length. She keeps the thickness, the material and the temperature the same, and works out the resistance for each length from V = I × R.'});
}
{
  const body=act('variables','Predict','Where the voltmeter goes','');
  createPredict({host:body,q:'Why is the voltmeter connected in parallel across the component, not in series?',options:[
    {text:'It measures the voltage across the component’s ends',correct:true},
    {text:'A voltmeter in series would make the current bigger',why:'A voltmeter has a very high resistance, so in series it would almost stop the current.'},
    {text:'It must measure the current flowing through the component',why:'That is the ammeter’s job. The voltmeter measures the voltage across the component.'},
    {text:'In parallel the voltmeter stays cooler and safer',why:'It is about what it measures, not its temperature. It compares the two ends of the component.'}
  ],explain:'Voltage is the energy transferred per unit charge between two points, so the voltmeter is joined across the two ends of the component. Its very high resistance means hardly any current goes through it.'});
}

/* A graph with all four quadrants: the axes go through the origin, the scale numbers sit along the bottom and left edges.
   (lineGraph in the engine puts its axes at xMin and yMin, so it cannot show reversed readings.)
   sketch:true draws exam sketch axes: no grid or numbers, the labels at the ends of the axes. */
const LAMP=[[0,0],[1,0.1],[2,0.16],[3,0.21],[4,0.25],[5,0.28],[6,0.3]];
const LAMP4=LAMP.slice(1).reverse().map(p=>[-p[0],-p[1]]).concat(LAMP);   // reversed: the same curve rotated 180° about the origin
function quadGraph(o){
  const W=o.W||560,H=o.H||400,sk=!!o.sketch,pl=sk?14:58,pr=sk?14:18,pt=sk?14:16,pb=sk?14:50;
  const gx=x=>pl+(x-o.xMin)/(o.xMax-o.xMin)*(W-pl-pr), gy=y=>H-pb-(y-o.yMin)/(o.yMax-o.yMin)*(H-pt-pb);
  const n=t=>String(t).replace('-','−');
  let s='<svg class="graph" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+(o.label||'Graph')+'">';
  if(!sk){
    o.yTicks.forEach(t=>{s+='<line class="g-grid" x1="'+pl+'" x2="'+(W-pr)+'" y1="'+gy(t)+'" y2="'+gy(t)+'"/><text class="g-tick" x="'+(pl-8)+'" y="'+(gy(t)+5)+'" text-anchor="end">'+n(t)+'</text>';});
    o.xTicks.forEach(t=>{s+='<line class="g-grid" y1="'+pt+'" y2="'+(H-pb)+'" x1="'+gx(t)+'" x2="'+gx(t)+'"/><text class="g-tick" x="'+gx(t)+'" y="'+(H-pb+20)+'" text-anchor="middle">'+n(t)+'</text>';});
    s+='<text class="g-lab" x="'+(pl+(W-pl-pr)/2)+'" y="'+(H-8)+'" text-anchor="middle">'+o.xLabel+'</text>';
    s+='<text class="g-lab" transform="translate(16 '+(pt+(H-pt-pb)/2)+') rotate(-90)" text-anchor="middle">'+o.yLabel+'</text>';
  }else{
    s+='<text class="g-lab" x="'+(W-pr)+'" y="'+(gy(0)+18)+'" text-anchor="end">'+o.xLabel+'</text>';
    s+='<text class="g-lab" x="'+(gx(0)+8)+'" y="'+(pt+10)+'">'+o.yLabel+'</text>';
    s+='<text class="g-lab" x="'+(gx(0)+7)+'" y="'+(gy(0)+17)+'">0</text>';
  }
  s+='<line class="g-axis g-axis0" x1="'+gx(0)+'" x2="'+gx(0)+'" y1="'+pt+'" y2="'+(H-pb)+'"/><line class="g-axis g-axis0" x1="'+pl+'" x2="'+(W-pr)+'" y1="'+gy(0)+'" y2="'+gy(0)+'"/>';
  o.segments.forEach(sg=>{s+='<polyline class="g-line '+(sg.cls||'')+'" points="'+sg.pts.map(p=>gx(p[0]).toFixed(1)+','+gy(p[1]).toFixed(1)).join(' ')+'"/>';});
  return {svg:s+(o.extra?o.extra(gx,gy):'')+'</svg>',toString(){return this.svg;}};
}

/* ================= EXPERIMENT ================= */
{
  act('experiment','Your turn','Take your own readings','Press Experiment, choose a component, then drag the potentiometer to each voltage and press Take reading. Take readings from 0 to 6 V, then reverse the battery and take them again, for the fixed resistor, the filament lamp and the diode. Which one has a constant resistance, which one’s resistance rises, and which one only conducts one way?');
}
frameAct('experiment','animations/iv-characteristics.html','','Current–voltage characteristics animation: a resistor, filament lamp or diode with its I–V graph','current–voltage characteristics',false);
{
  const body=act('experiment','Sort','What happens to the resistance?','Sort each component by what its resistance does as the voltage across it goes up, then press Check.');
  createSortGame({host:body,cats:[
    {id:'s',label:'Stays the same',color:'--c1',soft:'--c1-soft'},
    {id:'u',label:'Increases',color:'--c2',soft:'--c2-soft'},
    {id:'f',label:'Falls sharply once it conducts',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'A fixed resistor',cat:'s'},
    {id:'2',text:'A metal wire kept at a constant temperature',cat:'s'},
    {id:'3',text:'A filament lamp',cat:'u'},
    {id:'4',text:'A metal wire that is allowed to get hot',cat:'u'},
    {id:'5',text:'A diode, connected forwards',cat:'f'},
    {id:'6',text:'An LED, connected forwards',cat:'f'}
  ]});
}
{
  const body=act('experiment','Predict','Testing a wire','');
  createPredict({host:body,q:'Charlotte tests a long metal wire with small currents, so it stays cool. What shape is its I–V graph?',options:[
    {text:'Straight, through the origin, like a resistor',correct:true},
    {text:'A curve that bends over, like a filament lamp',why:'A lamp curves because it gets very hot. A wire kept cool has a constant resistance.'},
    {text:'Almost no current in one direction, like a diode',why:'A metal wire conducts equally well both ways.'},
    {text:'A flat line: the current does not change',why:'A bigger voltage pushes a bigger current through the wire.'}
  ],explain:'At constant temperature a metal wire has a constant resistance, so the current is directly proportional to the voltage: a straight line through the origin, in both directions.'});
}
{
  const body=act('experiment','Predict','Why reverse the voltage?','');
  createPredict({host:body,q:'Why do you take readings with the connections reversed, as well as forwards?',options:[
    {text:'To see if it conducts the same both ways round',correct:true},
    {text:'To check that the voltmeter is reading correctly',why:'Reversing tests the component, not the meter.'},
    {text:'To let the component cool down between readings',why:'Switching off does that. Reversing shows how the component behaves the other way round.'},
    {text:'Negative values make the graph easier to draw',why:'They add a second part to the graph, which is what shows how a diode differs from a resistor or a lamp.'}
  ],explain:'A resistor and a lamp behave the same both ways round. Reversed, the voltage and the current are both negative, so the lamp’s graph is the same curve rotated 180° about the origin, into the negative quadrant. A diode lets almost no current through in reverse, which only shows if you test it that way.',
  reveal:'<div class="iv-sketch">'+quadGraph({label:'Sketch of current against voltage for a filament lamp: an S-shaped curve through the origin, the same shape in the negative quadrant as in the positive one',sketch:true,W:260,H:210,xMin:-6,xMax:6,yMin:-0.36,yMax:0.36,xLabel:'voltage',yLabel:'current',segments:[{pts:LAMP4,cls:'g-line-c'}]})+'</div>'});
}

/* ================= 3. RESULTS ================= */
{
  const body=act('results','Calculate','Complete the results table','Ali tests a filament lamp. Work out its resistance at each voltage, using V = I × R.');
  const tbl=mk('div','table-scroll');
  tbl.innerHTML='<table class="units res-tbl"><thead><tr><th>Voltage (V)</th><th>Current (A)</th><th>Resistance (Ω)</th></tr></thead><tbody>'+
    [['1.0','0.10','10'],['2.0','0.16','?'],['3.0','0.21','14.3'],['4.0','0.25','?'],['5.0','0.28','17.9'],['6.0','0.30','?']].map(r=>'<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td></tr>').join('')+'</tbody></table>';
  body.appendChild(tbl);
  const w=(V,I,R)=>'V = I × R<br>'+V+' = '+I+' × R<br>R = [['+V+'|'+I+']]<br>R = '+R+' Ω';
  createCalc({host:body,questions:[
    {q:'Resistance at 2.0 V',unit:'Ω',answer:12.5,working:w('2.0','0.16','12.5')},
    {q:'Resistance at 4.0 V',unit:'Ω',answer:16,working:w('4.0','0.25','16')},
    {q:'Resistance at 6.0 V',unit:'Ω',answer:20,working:w('6.0','0.30','20')}
  ]});
}
{
  const body=act('results','Plot','Plot Ali’s results','Ali then reverses the connections to the lamp and takes six more readings. The voltage and the current are now both negative. Plot all twelve readings as small crosses: current up the side, voltage along the bottom. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');
  createPlot({host:body,
    // forwards first, then reversed: saved answers go by position, so the six reversed readings are added at the end
    points:LAMP.slice(1).concat(LAMP.slice(1).map(p=>[-p[0],-p[1]])).map(p=>({x:p[0],y:p[1]})),
    rowText:p=>(p.x<0?'−':'')+fmt(Math.abs(p.x),1)+' V, '+(p.y<0?'−':'')+fmt(Math.abs(p.y),2)+' A',
    graph:{xMin:-6,xMax:6,yMin:-0.32,yMax:0.32,xTicks:[-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6],yTicks:[-0.3,-0.25,-0.2,-0.15,-0.1,-0.05,0,0.05,0.1,0.15,0.2,0.25,0.3],minor:[0.5,0.01],snap:[0.5,0.01],xLabel:'voltage (V)',yLabel:'current (A)',W:574,H:580,pl:72}});
}
{
  const body=act('results','Predict','Reading the results','');
  createPredict({host:body,q:'Use Ali’s table. What happens to the lamp’s resistance as the voltage goes up?',options:[
    {text:'It increases, from 10 Ω to 20 Ω',correct:true},
    {text:'It stays at 10 Ω, as the current also goes up',why:'The current goes up, but not in proportion: 6 V gives 0.30 A, not 0.60 A. Work out the resistance at each row.'},
    {text:'It decreases, as more current flows',why:'More current flows, but the voltage rises faster than the current, so the resistance goes up.'},
    {text:'It doubles each time the voltage doubles',why:'At 3.0 V it is 14.3 Ω and at 6.0 V it is 20 Ω, which is not double.'}
  ],explain:'R = [[V|I]] rises from [[1.0|0.10]] = 10 Ω to [[6.0|0.30]] = 20 Ω. The bigger current heats the filament, and a hotter metal has a bigger resistance.'});
}
{
  const body=act('results','Predict','The line of best fit','');
  createPredict({host:body,q:'What line of best fit should Ali draw through his plotted points?',options:[
    {text:'One smooth curve through the origin',correct:true},
    {text:'Short straight lines joining each point to the next',why:'Joining the dots follows every small error. A line of best fit shows the trend, so it is one smooth line.'},
    {text:'One straight line through the origin and the last point',why:'The points do not lie on a straight line: the gradient gets less as the voltage rises. A straight line hides that.'},
    {text:'A curve that does not go through the origin',why:'With no voltage there is no current, so the line must start at the origin.'}
  ],explain:'With 0 V there is no current, so the line goes through the origin. The points curve over on both sides as the lamp heats up, so draw one smooth curve close to all of them. The negative part is the same curve rotated 180° about the origin.'});
}
{
  const body=act('results','Predict','An anomalous result','');
  createPredict({host:body,q:'Ananya tests a fixed resistor. Which result is anomalous, and what should she do?',
    pre:'<div class="table-scroll"><table class="units res-tbl"><thead><tr><th>Voltage (V)</th><th>1.0</th><th>2.0</th><th>3.0</th><th>4.0</th><th>5.0</th></tr></thead><tbody><tr><th>Current (A)</th><td>0.05</td><td>0.10</td><td>0.18</td><td>0.20</td><td>0.25</td></tr></tbody></table></div>',
    options:[
    {text:'3.0 V: repeat it, and leave it out of the line',correct:true},
    {text:'5.0 V: it is the biggest, so leave it out',why:'0.25 A fits the pattern: 0.05 A for each volt. Being the biggest does not make a result anomalous.'},
    {text:'3.0 V: keep it, and average it with the other results',why:'Averaging it in drags the answer away from the true value. Repeat it, and ignore it when drawing the line.'},
    {text:'None: every reading counts, so use them all',why:'One result breaks the pattern of 0.05 A for each volt, so it is probably a mistake.'}
  ],explain:'Each volt adds 0.05 A, so 3.0 V should give 0.15 A, not 0.18 A. Repeat the reading if you can, and leave it out when drawing the line of best fit.'});
}

{
  const body=act('results','Predict','Resistance against voltage','');
  createPredict({host:body,q:'Ananya works out the resistance of her fixed resistor at each voltage, then plots resistance against voltage. What shape is the graph?',options:[
    {text:'A horizontal straight line above the axis',correct:true},
    {text:'A straight line rising from the origin',why:'That is the shape of its current against voltage. Its resistance is the same at every voltage.'},
    {text:'A curve that rises more steeply each time',why:'The resistor stays at the same temperature, so its resistance does not change with voltage.'},
    {text:'A straight line falling towards zero',why:'More voltage gives more current in proportion, so the resistance [[V|I]] stays the same.'}
  ],explain:'For a fixed resistor at constant temperature, the current is directly proportional to the voltage, so R = [[V|I]] is the same at every voltage: a horizontal line.'});
}

/* ================= 4. GRAPHS ================= */
const GR={xMin:-6,xMax:6,yMin:-0.6,yMax:0.6,xTicks:[-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6],yTicks:[-0.6,-0.5,-0.4,-0.3,-0.2,-0.1,0,0.1,0.2,0.3,0.4,0.5,0.6],xLabel:'voltage (V)',yLabel:'current (A)',W:560,H:420};
function lab(g0,t,x,y){return '<circle cx="'+g0.gx(x)+'" cy="'+g0.gy(y)+'" r="13" fill="var(--panel)" stroke="var(--ink)" stroke-width="2"/><text x="'+g0.gx(x)+'" y="'+(g0.gy(y)+5)+'" text-anchor="middle" font-size="14" fill="var(--ink)">'+t+'</text>';}
function ivGraph(label){
  // readings with the connections forwards (positive) and reversed (negative)
  const A=[[-6,-0.6],[6,0.6]], B=[[-6,-0.24],[6,0.24]];
  return quadGraph(Object.assign({label:label,segments:[{pts:A},{pts:B,cls:'g-line-b'},{pts:LAMP4,cls:'g-line-c'}],
    extra:(gx,gy)=>{const g0={gx:gx,gy:gy};return lab(g0,'A',4.6,0.52)+lab(g0,'B',5.5,0.15)+lab(g0,'C',5.5,0.36);}},GR)).svg;
}
{
  const body=act('graphs','Calculate','Read the graph','The graph shows current against voltage for two resistors and a filament lamp, with the connections forwards (positive) and reversed (negative). Read values off the graph, then use V = I × R.');
  const split=mk('div','graph-split');body.appendChild(split);
  split.appendChild(mk('div','graph-box',ivGraph('Current against voltage from −6 V to +6 V for lines A, B and C. A and B are straight lines through the origin. C is a curve through the origin, with the same shape in the negative quadrant as in the positive one')));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'Resistor A: what is its resistance?',unit:'Ω',answer:10,working:'At 5.0 V, I = 0.50 A<br>V = I × R<br>5.0 = 0.50 × R<br>R = [[5.0|0.50]]<br>R = 10 Ω'},
    {q:'Resistor B: what is its resistance?',unit:'Ω',answer:25,working:'At 5.0 V, I = 0.20 A<br>V = I × R<br>5.0 = 0.20 × R<br>R = [[5.0|0.20]]<br>R = 25 Ω'},
    {q:'Lamp C: what is the current at 4.0 V?',unit:'A',answer:0.25,working:'Read up from 4.0 V to line C, then across.<br>I = 0.25 A'},
    {q:'Lamp C: what is its resistance at 4.0 V?',unit:'Ω',answer:16,working:'V = I × R<br>4.0 = 0.25 × R<br>R = [[4.0|0.25]]<br>R = 16 Ω'}
  ]});
}
{
  const body=act('graphs','Predict','Which line is the lamp?','');
  createPredict({host:body,q:'Look at the graph above. Which line is the filament lamp?',options:[
    {text:'Line C: it is not a straight line',correct:true},
    {text:'Line A: it carries the biggest current',why:'Line A is a straight line through the origin, so its resistance is constant: a fixed resistor.'},
    {text:'Line B: it carries the smallest current',why:'Line B is straight, so its resistance does not change. A lamp’s resistance rises as it heats.'},
    {text:'Any of them: all three go through the origin',why:'All three start at the origin, but only a lamp’s line curves over as it heats up.'}
  ],explain:'A and B are straight lines through the origin: fixed resistors. C curves over because the lamp’s resistance rises as its filament heats up. Reversed, it heats up just the same, so C is the same curve rotated 180° into the negative quadrant.'});
}
{
  const body=act('graphs','Predict','Which has more resistance?','');
  createPredict({host:body,q:'On this graph (current up the side), which resistor has the bigger resistance, A or B?',options:[
    {text:'B: less current flows for each volt',correct:true},
    {text:'A: its line is the steeper of the two',why:'With current up the side, a steeper line means more current for each volt, so less resistance.'},
    {text:'A: it reaches a bigger current',why:'A bigger current for the same voltage means a smaller resistance.'},
    {text:'Neither: both lines are straight',why:'Both are straight, so each has a constant resistance, but the two resistances are different.'}
  ],explain:'With current up the side, the less steep line has the bigger resistance. B lets only 0.04 A through for each volt (25 Ω); A lets 0.1 A through (10 Ω).'});
}
/* the same idea with the axes the other way round */
const GR2={xMin:0,xMax:0.5,yMin:0,yMax:10,xTicks:[0,0.1,0.2,0.3,0.4,0.5],yTicks:[0,2,4,6,8,10],xLabel:'current (A)',yLabel:'voltage (V)',W:560,H:340};
function swapGraph(label){
  const P=[[0,0],[0.25,10]], Q=[[0,0],[0.5,5]];
  const g0=lineGraph(Object.assign({points:[[0,0]]},GR2));
  return lineGraph(Object.assign({label:label,segments:[{pts:P,cls:'g-line-c'},{pts:Q,cls:'g-line-b'}],
    extra:lab(g0,'P',0.25,10)+lab(g0,'Q',0.47,4.7)},GR2)).svg;
}
{
  const body=act('graphs','Calculate','The axes the other way round','Some exam questions plot voltage up the side and current along the bottom. Read your answers off this graph for resistors P and Q.');
  const split=mk('div','graph-split');body.appendChild(split);
  split.appendChild(mk('div','graph-box',swapGraph('Voltage against current for resistors P and Q')));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'Resistor P: what is its resistance?',unit:'Ω',answer:40,working:'At 0.20 A, V = 8.0 V<br>V = I × R<br>8.0 = 0.20 × R<br>R = [[8.0|0.20]]<br>R = 40 Ω'},
    {q:'Resistor Q: what current flows with 3.0 V across it?',unit:'A',answer:0.3,working:'Read across from 3.0 V to line Q, then down.<br>I = 0.30 A'}
  ]});
}
{
  const body=act('graphs','Predict','Steeper, with the axes swapped','');
  createPredict({host:body,q:'Elizabeth says, “The steeper line always has the smaller resistance.” Is she right?',options:[
    {text:'Only when current is up the side of the graph',correct:true},
    {text:'Yes, on every I–V graph',why:'Look at P and Q: with voltage up the side, the steeper line (P) has the bigger resistance.'},
    {text:'Only when voltage is up the side of the graph',why:'With voltage up the side, a steeper line needs more volts for each amp, so it has more resistance.'},
    {text:'No: resistance cannot be seen on a graph',why:'You can see it from the slope; you just have to check which way round the axes are.'}
  ],explain:'Always check the axes. Current up the side: steeper means less resistance. Voltage up the side: steeper means more resistance.'});
}

/* ================= 5. CALCULATE ================= */
{
  const body=act('calculate','Calculate','Using V = I × R','Give each answer in the unit shown.');
  createCalc({host:body,questions:[
    {q:'A resistor has 4.5 V across it and a current of 0.15 A. Its resistance is',unit:'Ω',answer:30,working:'V = I × R<br>4.5 = 0.15 × R<br>R = [[4.5|0.15]]<br>R = 30 Ω'},
    {q:'A 6.0 V lamp has a resistance of 24 Ω when lit. The current through it is',unit:'A',answer:0.25,working:'V = I × R<br>6.0 = I × 24<br>I = [[6.0|24]]<br>I = 0.25 A'},
    {q:'A current of 40 mA flows through a 150 Ω resistor. The voltage across it is',unit:'V',answer:6,working:'40 mA = 0.040 A<br>V = I × R<br>V = 0.040 × 150<br>V = 6 V'},
    {q:'A diode has 0.70 V across it and a current of 20 mA. Its resistance is',unit:'Ω',answer:35,working:'20 mA = 0.020 A<br>V = I × R<br>0.70 = 0.020 × R<br>R = [[0.70|0.020]]<br>R = 35 Ω'}
  ]});
}

/* ================= 6. ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Better results or safer?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'Better results',hint:'More accurate or more useful readings',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps people safe',hint:'Protects people and equipment',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Check each meter reads zero before switching on',cat:'a'},
    {id:'2',text:'Take readings over a wide range of voltages, in both directions',cat:'a'},
    {id:'3',text:'Take extra readings where the graph changes shape, such as near 0.6 V for a diode',cat:'a'},
    {id:'4',text:'Repeat each reading and find the mean',cat:'a'},
    {id:'9',text:'Keep a wire in a water bath, so its temperature stays the same',cat:'a'},
    {id:'5',text:'Do not touch the lamp: it gets hot',cat:'s'},
    {id:'6',text:'Use a protective resistor in series with a diode',cat:'s'},
    {id:'7',text:'Keep the supply voltage low',cat:'s'},
    {id:'8',text:'Switch off if a wire starts to get hot',cat:'s'},
    {id:'10',text:'Use a wire long enough that it does not get too hot',cat:'s'}
  ]});
}
{
  const body=act('accuracy','Predict','Switch off between readings','');
  createPredict({host:body,q:'Why should you switch off the current between readings when testing a fixed resistor?',options:[
    {text:'So it stays cool, keeping its resistance the same',correct:true},
    {text:'So the meters can reset to zero between readings',why:'Meters do not need resetting each time. The point is to stop the resistor heating up.'},
    {text:'To save energy in the power supply between readings',why:'The energy saved is tiny. Switching off stops the resistor’s temperature changing.'},
    {text:'So the voltmeter can measure the current instead',why:'A voltmeter always measures voltage. Switching off is about temperature.'}
  ],explain:'A current heats the resistor. A hotter resistor has a bigger resistance, so the readings would not be a fair test of a fixed resistance. Its temperature is a control variable: keep it constant by using small currents, switching off between readings, or putting the resistor or wire in a water bath.'});
}
{
  const body=act('accuracy','Predict','A zero error','');
  createPredict({host:body,q:'Before switching on, Fatimah’s ammeter reads 0.02 A. What should she do with her readings?',options:[
    {text:'Take 0.02 A off every current she records',correct:true},
    {text:'Add 0.02 A on to every current she records',why:'The meter already reads 0.02 A too high, so adding more makes it worse.'},
    {text:'Nothing: 0.02 A is far too small to matter',why:'For a small current such as 0.10 A, 0.02 A is a 20% error.'},
    {text:'Only correct the first reading that she takes',why:'The zero error is there for every reading, so correct them all.'}
  ],explain:'A meter that reads 0.02 A with no current has a zero error. Every reading is 0.02 A too high, so subtract it from each one (or reset the meter to zero first).'});
}

/* ================= EXAM PRACTICE ================= */
{
  const body=act('exam','Exam style','Testing a filament lamp','Zahra tests a 12 V filament lamp and records these results. One reading is missing.');
  const tbl=mk('div','table-scroll');
  tbl.innerHTML='<table class="units res-tbl"><thead><tr><th>Voltage (V)</th><th>0</th><th>1.0</th><th>2.0</th><th>4.0</th><th>8.0</th><th>12.0</th></tr></thead><tbody><tr><th>Current (A)</th><td>0</td><td>0.080</td><td><b>?</b></td><td>0.24</td><td>0.33</td><td>0.40</td></tr></tbody></table>';
  body.appendChild(tbl);
  body.appendChild(mk('p','sub','(a) 2 marks'));
  createCalc({host:body,questions:[
    {q:'At low voltages the lamp stays cool and its resistance stays the same. Predict the missing current at 2.0 V.',unit:'A',answer:0.16,working:'At 1.0 V: R = [[1.0|0.080]] = 12.5 Ω<br>V = I × R<br>2.0 = I × 12.5<br>I = [[2.0|12.5]]<br>I = 0.16 A'}
  ]});
  body.appendChild(mk('p','sub','(b) 3 marks'));
  createCalc({host:body,questions:[
    {q:'Calculate the resistance of the lamp at 12.0 V.',unit:'Ω',answer:30,working:'V = I × R<br>12.0 = 0.40 × R<br>R = [[12.0|0.40]]<br>R = 30 Ω'}
  ]});
  body.appendChild(mk('p','sub','(c) 3 marks'));
  body.appendChild(mk('p','','Zahra says the lamp’s current is directly proportional to the voltage. Discuss whether she is right. Use data from the table. Write your answer, then check it.'));
  const d1=mk('details','');
  d1.innerHTML='<summary>Check your answer</summary><div><ul><li>The current increases as the voltage increases, but at a decreasing rate (non-linear).</li><li>If it were proportional, doubling the voltage would double the current.</li><li>From 4.0 V to 8.0 V the current only goes from 0.24 A to 0.33 A, not 0.48 A.</li><li>The resistance rises from 12.5 Ω (at 1.0 V) to 30 Ω (at 12.0 V), so the I–V graph would curve, not be a straight line through the origin.</li><li>So she is wrong (except at the lowest voltages, where the lamp is still cool).</li></ul></div>';
  body.appendChild(d1);
  body.appendChild(mk('p','sub','(d) 2 marks'));
  body.appendChild(mk('p','','Explain why the resistance of the lamp increases as the current increases.'));
  const d2=mk('details','');
  d2.innerHTML='<summary>Check your answer</summary><div><ul><li>A bigger current heats the filament, so its temperature rises.</li><li>The lattice ions vibrate more, so the electrons collide with them more often: the resistance increases with temperature.</li></ul></div>';
  body.appendChild(d2);
  body.appendChild(mk('p','sub','(e) 5 marks'));
  body.appendChild(mk('p','','Describe how Zahra could take readings to plot the full I–V graph for the lamp. Include the circuit she should use.'));
  const d3=mk('details','');
  d3.innerHTML='<summary>Check your answer</summary><div><ul><li>Connect the lamp in series with an ammeter, a variable resistor and a power supply (or use a variable power supply).</li><li>Connect a voltmeter in parallel across the lamp.</li><li>Change the voltage with the variable resistor, in steps.</li><li>Record the ammeter and voltmeter readings at each step, for a range of voltages.</li><li>Repeat the readings and find the mean current at each voltage.</li><li>Switch off between readings, so the lamp does not overheat.</li><li>Reverse the connections to the lamp (or the supply) and repeat, to get negative values.</li><li>Plot current against voltage and draw a smooth curve of best fit.</li></ul><p class="sub">Any five points score. A circuit diagram with the ammeter in series and the voltmeter in parallel also scores.</p></div>';
  body.appendChild(d3);
  body.appendChild(mk('p','sub','(f) 2 marks'));
  body.appendChild(mk('p','','Zahra repeats the practical with a diode. Describe how its I–V graph is different from the lamp’s.'));
  const d4=mk('details','');
  d4.innerHTML='<summary>Check your answer</summary><div><ul><li>In reverse the diode lets almost no current through (very high resistance), while the lamp conducts both ways.</li><li>Forwards, there is very little current until about 0.6 V, then the current rises quickly.</li></ul></div>';
  body.appendChild(d4);
  body.appendChild(mk('p','sub','(g) 2 marks'));
  body.appendChild(mk('p','','Zahra then tests a length of metal wire. She must keep the wire at a constant temperature. Suggest why, and suggest how she could do this.'));
  const d5=mk('details','');
  d5.innerHTML='<summary>Check your answer</summary><div><ul><li>Why: the resistance of the wire changes with temperature, so temperature is a control variable.</li><li>How: use small currents, or switch off between readings (only let the current flow for a short time), or put the wire in a water bath.</li></ul><p class="sub">Covering the wire with insulation does not work: it stops the wire losing heat, so it gets hotter.</p></div>';
  body.appendChild(d5);
}
