/* ================= helpers for this page ================= */
function answerBox(body,html){const d=mk('details','');d.innerHTML='<summary>Check your answer</summary><div>'+FR(html)+'</div>';body.appendChild(d);}
function tableHTML(head,rows){return '<div class="table-scroll"><table class="units res-tbl"><thead><tr>'+head.map(h=>'<th>'+h+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map(c=>'<td>'+c+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';}

/* ================= 1. METHOD ================= */
{
  const body=act('method','Order','Measure i and r for a range of angles','Put the steps in the order you would do them. Drag the ≡ handle, or use the ▲▼ buttons.');
  createReorder({host:body,steps:[
    {id:'a',text:'Draw round the rectangular glass block on a sheet of plain paper.'},
    {id:'b',text:'Draw a normal at 90° to one long side, near one end.'},
    {id:'c',text:'Shine a narrow ray from the ray box at the point where the normal meets the block, at 10° to the normal.'},
    {id:'d',text:'Mark the incident ray and the emergent ray with two crosses each, far apart.'},
    {id:'e',text:'Repeat for angles of incidence of 20°, 30° … up to 80°, marking each pair of rays.'},
    {id:'f',text:'Remove the block. Join the crosses, draw each refracted ray through the block, and measure r from the normal with a protractor.'},
    {id:'g',text:'Work out sin i and sin r for each angle of incidence.'},
    {id:'h',text:'Plot sin i against sin r, draw a straight line of best fit through the origin and find its gradient.'}
  ],constraints:[['a','b'],['b','c'],['c','d'],['d','e'],['e','f'],['f','g'],['g','h']],
  why:'Draw the outline and the normal first, so the block can be put back in place. Mark every ray before removing the block, then measure, calculate and plot.'});
}
{
  const body=act('method','Match','What each piece of equipment is for','Pair each piece of equipment with its job. Drag one card onto the other, or tap one card and then the other.');
  createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'r',l:'Ray box (or laser)',r:'Makes a narrow beam whose path can be traced on the paper'},
    {id:'g',l:'Rectangular glass block',r:'The material whose refractive index is being found'},
    {id:'p',l:'Protractor',r:'Measures i and r from the normal, to the nearest degree'},
    {id:'s',l:'Sharp pencil and ruler',r:'Draw thin, straight lines through the crosses'},
    {id:'c',l:'Calculator',r:'Works out sin i and sin r for each pair of angles'}
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
    {id:'1',text:'The angle of incidence',cat:'i'},
    {id:'2',text:'The angle the ray box is turned to',cat:'i'},
    {id:'3',text:'The angle of refraction',cat:'d'},
    {id:'4',text:'Where the refracted ray meets the far side',cat:'d'},
    {id:'5',text:'Using the same glass block for every reading',cat:'c'},
    {id:'6',text:'The colour of the light',cat:'c'}
  ]});
}
{
  const body=act('variables','Predict','A new question to test','');
  createPredict({host:body,q:'Elizabeth wants to see how the material of a block affects the angle of refraction. What is her independent variable?',options:[
    {text:'The material the block is made of',correct:true},
    {text:'The angle of incidence of the ray',why:'She must keep the angle of incidence the same each time, so it is a control variable.'},
    {text:'The angle of refraction in the block',why:'She measures the angle of refraction: it is the dependent variable.'},
    {text:'The thickness of each of the blocks',why:'Thickness does not change the angle of refraction. She changes the material on purpose.'}
  ],explain:'The independent variable is the one she changes on purpose: the material (glass, Perspex, water in a clear box). She keeps the angle of incidence and the colour of the light the same.'});
}
{
  const body=act('variables','Predict','One colour of light','');
  createPredict({host:body,q:'Why is it better to use one colour of light (for example a red filter) than white light?',options:[
    {text:'Each colour has its own n, so white light spreads out',correct:true},
    {text:'White light is too bright to mark on the paper with crosses',why:'White light is easy to see. The problem is that it spreads into colours inside the glass.'},
    {text:'Red light is not refracted, so the angles are easier to see',why:'Red light is refracted, just a little less than the other colours.'},
    {text:'A red filter makes the ray box cooler and so safer to use',why:'The filter does not make the ray box safer. It is about the colours spreading.'}
  ],explain:'Each colour has a slightly different refractive index, so in white light the refracted ray spreads out a little and is hard to measure. One colour gives one sharp ray and one value of n.'});
}

/* ================= 3. EXPERIMENT ================= */
{
  act('experiment','Your turn','Take your own readings','Press Experiment. With the rectangular block, take readings for angles of incidence from 10° to 80°, and watch the graph of sin i against sin r build up. Then repeat with the flat side of the semicircular block. What is the gradient each time? Does r go up by the same amount for each 10°?');
}
frameAct('experiment','animations/refraction.html','','Refraction of light animation: a ray box, a glass block and a protractor, with a graph of sin i against sin r','refraction of light',false);
{
  const body=act('experiment','Predict','Each 10° more','');
  createPredict({host:body,q:'Henry increases i by 10° each time. What happens to the angle of refraction?',options:[
    {text:'It goes up by a smaller amount each time',correct:true},
    {text:'It increases by the same amount each time',why:'From 10° to 20° r goes up by about 6.5°, but from 70° to 80° only by about 2°.'},
    {text:'It increases by a bigger amount each time',why:'Look at your readings: the steps in r get smaller as i gets bigger.'},
    {text:'It decreases as the ray gets more slanted',why:'A bigger angle of incidence always gives a bigger angle of refraction.'}
  ],explain:'r increases at a decreasing rate: i and r are not proportional, so a graph of r against i curves. sin i and sin r are proportional, which is why we plot those.'});
}
{
  const body=act('experiment','Predict','A different glass','');
  createPredict({host:body,q:'Henry repeats the experiment with a glass that has a bigger refractive index. How does his graph of sin i against sin r change?',options:[
    {text:'It is steeper, through the origin',correct:true},
    {text:'It is less steep, through the origin',why:'The gradient is the refractive index, so a bigger n gives a steeper line.'},
    {text:'It is the same line as before',why:'The gradient is n, so a different n gives a different gradient.'},
    {text:'It starts to curve at large angles',why:'sin i is still proportional to sin r, so it is still a straight line.'}
  ],explain:'The gradient of sin i against sin r is n. A glass with a bigger refractive index bends the light more (smaller r for the same i), so the line is steeper. It still goes through the origin.'});
}

/* ================= 4. RESULTS ================= */
{
  const body=act('results','Calculate','Complete the results table','Aidan measured these angles for a glass block. Work out the missing values, to 3 decimal places.');
  const tbl=mk('div','');
  tbl.innerHTML=tableHTML(['i (°)','r (°)','sin i','sin r'],[['15','10','0.259','0.174'],['30','19','0.500','?'],['40','25','0.643','0.423'],['50','31','?','0.515'],['60','35','0.866','?'],['70','39','0.940','0.629']]);
  body.appendChild(tbl);
  createCalc({host:body,questions:[
    {q:'sin r when r = 19°',unit:'',answer:0.326,working:'sin r = sin 19°<br>sin r = 0.326'},
    {q:'sin i when i = 50°',unit:'',answer:0.766,working:'sin i = sin 50°<br>sin i = 0.766'},
    {q:'sin r when r = 35°',unit:'',answer:0.574,working:'sin r = sin 35°<br>sin r = 0.574'}
  ]});
}
{
  const body=act('results','Plot','Plot Aidan’s results','Plot each pair from Aidan’s table as a small cross, rounded to 2 decimal places: sin i up the side, sin r along the bottom. Click the graph paper, or click it and then use the arrow keys and Enter. Click a cross to take it off.');
  createPlot({host:body,
    points:[{x:0.17,y:0.26},{x:0.33,y:0.5},{x:0.42,y:0.64},{x:0.52,y:0.77},{x:0.57,y:0.87},{x:0.63,y:0.94}],
    rowText:p=>'sin r = '+p.x.toFixed(2)+', sin i = '+p.y.toFixed(2),
    graph:{xMin:0,xMax:0.7,yMin:0,yMax:1,xTicks:[0,0.1,0.2,0.3,0.4,0.5,0.6,0.7],yTicks:[0,0.2,0.4,0.6,0.8,1],minor:[0.02,0.02],snap:[0.01,0.01],xLabel:'sin r',yLabel:'sin i',W:560,H:380}});
}
{
  const body=act('results','Predict','The line of best fit','');
  createPredict({host:body,q:'What line of best fit should Aidan draw through his points?',options:[
    {text:'One straight line through the origin',correct:true},
    {text:'Short straight lines joining each point',why:'Joining the dots follows every small error. A line of best fit shows the trend.'},
    {text:'A smooth curve that bends over at the top',why:'sin i is proportional to sin r, so the points lie on a straight line.'},
    {text:'A straight line that misses the origin',why:'When i = 0, r = 0 too, so the line goes through the origin.'}
  ],explain:'sin i is directly proportional to sin r, so the best-fit line is straight. At i = 0 there is no bending (r = 0), so it passes through the origin. Its gradient is n.'});
}
{
  const body=act('results','Predict','An anomalous result','');
  createPredict({host:body,q:'Fatimah measures these angles. Which reading is anomalous, and what should she do?',
    pre:tableHTML(['i (°)','20','30','40','50','60'],[['r (°)','13','19','30','31','35']]),
    options:[
    {text:'40°: repeat it, leave it out of the line',correct:true},
    {text:'60°: it is the biggest, so leave it out',why:'35° fits the pattern. Being the biggest does not make a reading anomalous.'},
    {text:'40°: keep it, and use it in the mean of n',why:'An anomalous reading drags the mean away. Repeat it, and leave it out.'},
    {text:'None: every one of the readings must be used',why:'r should rise more slowly each time. 30° at 40° breaks that pattern.'}
  ],explain:'r should increase at a decreasing rate: 13°, 19°, about 25°, 31°, 35°. 30° at i = 40° is too big, perhaps a cross marked in the wrong place. Repeat it, and leave it out of the line of best fit.'});
}

/* ================= 5. GRAPHS ================= */
function lab(g0,t,x,y){return '<circle cx="'+g0.gx(x)+'" cy="'+g0.gy(y)+'" r="13" fill="var(--panel)" stroke="var(--ink)" stroke-width="2"/><text x="'+g0.gx(x)+'" y="'+(g0.gy(y)+5)+'" text-anchor="middle" font-size="14" fill="var(--ink)">'+t+'</text>';}
const GA={xMin:0,xMax:0.8,yMin:0,yMax:1,xTicks:[0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8],yTicks:[0,0.2,0.4,0.6,0.8,1],xLabel:'sin r',yLabel:'sin i',W:560,H:340};
{
  const body=act('graphs','Calculate','Two materials','The graph shows sin i against sin r for a glass block A and for water in a thin clear box, B. Read values off each line to find its gradient.');
  const split=mk('div','graph-split');body.appendChild(split);
  const g0=lineGraph(Object.assign({points:[[0,0]]},GA));
  split.appendChild(mk('div','graph-box',lineGraph(Object.assign({label:'sin i against sin r for lines A and B',segments:[{pts:[[0,0],[2/3,1]]},{pts:[[0,0],[0.75,1]],cls:'g-line-c'}],
    extra:lab(g0,'A',0.56,0.93)+lab(g0,'B',0.72,0.86)},GA)).svg));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'Line A: the refractive index of the glass',unit:'',answer:1.5,working:'At sin r = 0.60, sin i = 0.90<br>gradient = [[change in sin i|change in sin r]]<br>gradient = [[0.90 − 0|0.60 − 0]]<br>n = 1.50'},
    {q:'Line B: the refractive index of water',unit:'',answer:1.33,working:'At sin r = 0.60, sin i = 0.80<br>gradient = [[change in sin i|change in sin r]]<br>gradient = [[0.80 − 0|0.60 − 0]]<br>n = 1.33'}
  ]});
}
{
  const body=act('graphs','Predict','Which bends light more?','');
  createPredict({host:body,q:'Use the graph above. Which material bends the light more (gives a smaller r for the same i)?',options:[
    {text:'A: its line is steeper, so n is bigger',correct:true},
    {text:'B: its line is less steep, so n is bigger',why:'With sin i up the side, the gradient is n. The less steep line has the smaller n.'},
    {text:'B: it reaches sin i = 1.0 further along',why:'Reaching sin i = 1.0 at a bigger sin r means r is bigger: B bends the light less.'},
    {text:'Neither: both lines go through the origin',why:'Both start at the origin, but their gradients, and so their refractive indices, differ.'}
  ],explain:'With sin i up the side, gradient = n. A is steeper (n = 1.50) than B (n = 1.33), so for the same i, A gives a smaller r: it bends the light more.'});
}
const GB={xMin:0,xMax:1,yMin:0,yMax:0.8,xTicks:[0,0.2,0.4,0.6,0.8,1],yTicks:[0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8],xLabel:'sin i',yLabel:'sin r',W:560,H:340};
{
  const body=act('graphs','Calculate','The axes the other way round','Some exam questions plot sin r up the side and sin i along the bottom. Find the gradient of this line for a glass block, then the refractive index.');
  const split=mk('div','graph-split');body.appendChild(split);
  split.appendChild(mk('div','graph-box',lineGraph(Object.assign({label:'sin r against sin i for a glass block',segments:[{pts:[[0,0],[1,2/3]]}]},GB)).svg));
  const side=mk('div','graph-side');split.appendChild(side);
  createCalc({host:side,questions:[
    {q:'The gradient of the line',unit:'',answer:0.667,working:'At sin i = 0.90, sin r = 0.60<br>gradient = [[change in sin r|change in sin i]]<br>gradient = [[0.60 − 0|0.90 − 0]]<br>gradient = 0.667'},
    {q:'The refractive index of the glass',unit:'',answer:1.5,working:'n = [[sin i|sin r]]<br>n = [[1|gradient]]<br>n = [[1|0.667]]<br>n = 1.50'}
  ]});
}
{
  const body=act('graphs','Predict','Steeper, with the axes swapped','');
  createPredict({host:body,q:'Nabil plots sin r up the side and sin i along the bottom for two blocks. Which block has the bigger refractive index?',options:[
    {text:'The block with the less steep line',correct:true},
    {text:'The block with the steeper of the lines',why:'With sin r up the side, the gradient is 1/n, so a steeper line means a smaller n.'},
    {text:'The block whose line is longer',why:'The length of the line depends on the range of angles used, not on n.'},
    {text:'You cannot tell from these axes',why:'You can: n = 1/gradient. Just check which way round the axes are.'}
  ],explain:'With sin r up the side, gradient = [[sin r|sin i]] = [[1|n]]. A bigger n gives a smaller gradient: a less steep line.'});
}
{
  const body=act('graphs','Predict','Why sin i and sin r?','');
  createPredict({host:body,q:'Why plot sin i against sin r, rather than i against r?',options:[
    {text:'It gives a straight line whose gradient is n',correct:true},
    {text:'Angles cannot be plotted on a graph axis',why:'They can: r against i is a curve, which is harder to use.'},
    {text:'sin i and sin r are bigger, so easier to plot',why:'sin values are less than 1, so they are smaller, not bigger.'},
    {text:'The graph of i against r is a straight line',why:'r increases at a decreasing rate, so i against r curves.'}
  ],explain:'n = [[sin i|sin r]], so sin i = n × sin r: a straight line through the origin with gradient n. i against r curves, so it has no single gradient to read.'});
}

/* ================= 6. CALCULATE ================= */
{
  const body=act('calculate','Calculate','Using n = [[sin i|sin r]] and sin c = [[1|n]]','Give each answer to 3 significant figures, in the unit shown.');
  createCalc({host:body,questions:[
    {q:'A ray goes into a block with i = 60° and r = 35°. The refractive index is',unit:'',answer:1.51,working:'n = [[sin i|sin r]]<br>n = [[sin 60°|sin 35°]]<br>n = [[0.8660|0.5736]]<br>n = 1.51'},
    {q:'Glass has n = 1.50. A ray inside has r = 28°. The angle of incidence was',unit:'°',answer:44.8,working:'n = [[sin i|sin r]]<br>1.50 = [[sin i|sin 28°]]<br>sin i = 1.50 × sin 28°<br>sin i = 1.50 × 0.4695<br>sin i = 0.7042<br>i = 44.8°'},
    {q:'Diamond has a refractive index of 2.42. Its critical angle is',unit:'°',answer:24.4,working:'sin c = [[1|n]]<br>sin c = [[1|2.42]]<br>sin c = 0.4132<br>c = 24.4°'},
    {q:'A plastic has a critical angle of 42°. Its refractive index is',unit:'',answer:1.49,working:'sin c = [[1|n]]<br>sin 42° = [[1|n]]<br>0.6691 = [[1|n]]<br>n = [[1|0.6691]]<br>n = 1.49'}
  ]});
}

/* ================= 7. ACCURACY AND RELIABILITY ================= */
{
  const body=act('accuracy','Sort','Better value of n, or safer?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'Better value of n',hint:'More accurate or more reliable',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps people safe',hint:'Protects people and equipment',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Use a wide range of angles of incidence, 10° to 80°',cat:'a'},
    {id:'2',text:'Measure r for each angle more than once and find the mean',cat:'a'},
    {id:'3',text:'Find n from the gradient of a graph, not from one pair of angles',cat:'a'},
    {id:'4',text:'Use one colour of light, so the ray does not spread',cat:'a'},
    {id:'5',text:'Let the ray box cool before moving it',cat:'s'},
    {id:'6',text:'Never point a laser at anyone’s eyes',cat:'s'},
    {id:'7',text:'Keep the room light enough to move around safely',cat:'s'}
  ]});
}
{
  const body=act('accuracy','Predict','Why use a graph?','');
  createPredict({host:body,q:'Why does a graph of sin i against sin r give a better value of n than one pair of angles?',options:[
    {text:'It uses all the readings, so errors average',correct:true},
    {text:'One pair of angles always gives the wrong n',why:'One pair can give a good value, but one bad cross would spoil it.'},
    {text:'A graph does not need a protractor at all',why:'You still need a protractor to measure every angle you plot.'},
    {text:'A graph gives the unit of refractive index',why:'Refractive index has no unit: it is a ratio.'}
  ],explain:'The line of best fit uses all the readings, so small random errors in each one average out, and an anomalous point stands out and can be left out.'});
}
{
  const body=act('accuracy','Predict','Small angles','');
  createPredict({host:body,q:'David measures i = 5° and r = 3°. Why is this pair the least reliable?',options:[
    {text:'1° of error is a big fraction of 3°',correct:true},
    {text:'Light does not refract at small angles',why:'It does refract; the change of direction is just small.'},
    {text:'A protractor cannot read below 10°',why:'A protractor reads to 1° at any angle.'},
    {text:'Small angles always give reflection',why:'Total internal reflection needs glass to air and a large angle.'}
  ],explain:'A protractor reads to the nearest degree. An error of 1° in 3° is over 30%, but in 35° it is under 3%. So use larger angles, over a wide range.'});
}

/* ================= 8. EXAM PRACTICE ================= */
{
  const body=act('exam','Exam style','The refractive index of glass','Yassin measures the angle of refraction for five angles of incidence. One reading is missing.');
  body.appendChild(mk('div','',tableHTML(['i (°)','15','30','45','60','75'],[['r (°)','10','20','<b>?</b>','35','40']])));
  body.appendChild(mk('p','sub','(a) 3 marks'));
  createCalc({host:body,questions:[
    {q:'The glass has a refractive index of 1.50. Predict the missing angle of refraction.',unit:'°',answer:28.1,working:'n = [[sin i|sin r]]<br>1.50 = [[sin 45°|sin r]]<br>sin r = [[sin 45°|1.50]]<br>sin r = [[0.7071|1.50]]<br>sin r = 0.4714<br>r = 28.1°'}
  ]});
  body.appendChild(mk('p','sub','(b) 6 marks'));
  body.appendChild(mk('p','','Describe how Yassin could take these measurements. You may draw a labelled diagram.'));
  answerBox(body,'<ul><li>Put the glass block on paper and draw round it.</li><li>Draw a normal where the ray will go in.</li><li>Shine a narrow ray from a ray box (or laser) into the block at an angle to the normal.</li><li>Mark the incident ray and the emergent ray with crosses, far apart.</li><li>Remove the block, join the crosses and draw the ray through the block.</li><li>Measure the angles of incidence and refraction from the normal with a protractor.</li><li>Repeat for a range of angles of incidence.</li></ul><p class="sub">Any six points score. A labelled diagram with the block, the normal, i and r can score too.</p>');
  body.appendChild(mk('p','sub','(c) 3 marks'));
  body.appendChild(mk('p','','Explain how Yassin should use his results to find an accurate value for the refractive index.'));
  answerBox(body,'<ul><li>Work out sin i and sin r for each pair of angles.</li><li>Plot sin i (y-axis) against sin r (x-axis) and draw a straight line of best fit through the origin.</li><li>The refractive index is the gradient of the line.</li></ul><p class="sub">Also accepted: work out n = [[sin i|sin r]] for every pair and find the mean. "Repeat and average" on its own does not score.</p>');
  body.appendChild(mk('p','sub','(d) 2 marks'));
  createCalc({host:body,questions:[
    {q:'Use the reading at i = 75° to calculate the refractive index.',unit:'',answer:1.5,working:'n = [[sin i|sin r]]<br>n = [[sin 75°|sin 40°]]<br>n = [[0.9659|0.6428]]<br>n = 1.50'}
  ]});
  body.appendChild(mk('p','sub','(e) 3 marks'));
  createCalc({host:body,questions:[
    {q:'Calculate the critical angle of glass with n = 1.50.',unit:'°',answer:41.8,working:'sin c = [[1|n]]<br>sin c = [[1|1.50]]<br>sin c = 0.6667<br>c = 41.8°'}
  ]});
  body.appendChild(mk('p','sub','(f) 2 marks'));
  body.appendChild(mk('p','','Yassin repeats the experiment with a block that has a bigger refractive index. Describe how his graph of sin i against sin r, and the critical angle, would change.'));
  answerBox(body,'<ul><li>The line would be steeper (still straight, through the origin).</li><li>The critical angle would be smaller.</li></ul>');
  body.appendChild(mk('p','sub','(g) 2 marks'));
  body.appendChild(mk('p','','Explain why refractive index has no unit.'));
  answerBox(body,'<ul><li>It is a ratio of two sines (or of two speeds).</li><li>The units cancel, so there is no unit.</li></ul>');
}
