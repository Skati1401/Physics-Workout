/* 7.6 Penetrating power of alpha, beta and gamma (radioactive sources or a simulation).
   The Graphs and Calculate tabs of the model page became Alpha, Beta, Gamma and Background (7.4, 7.5, 7.9, 7.10).
   Mark scheme wording from the IGCSE Question Index (see tools/CORE-PRACTICALS.md). */
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
    rows.map(r=>'<tr>'+r.map((c,i)=>(i?'<td>':'<th>')+(c==null?'<b>?</b>':c)+(i?'</td>':'</th>')).join('')+'</tr>').join('')+'</tbody></table>';
  return t;
}

/* ================= 1. OVERVIEW ================= */
{
  const body=act('overview','Fill in the blanks','The practical in one passage','Drag a word into each gap, or tap a word and then tap a gap. Some words are not needed.');
  const parts=[
    'First, with the source taken away, measure the ',['b1','background'],' count three times and find the mean. Then place the source a few centimetres from a ',['b2','Geiger–Müller tube'],
    ' connected to a counter, and count for one minute with no absorber. Repeat with a sheet of paper, a few millimetres of aluminium and a few centimetres of lead between them, keeping the ',['b3','distance'],
    ' the same. Take the mean background away from every count to get the ',['b4','corrected'],' count. Alpha particles are stopped by paper (or a few cm of air). Beta particles pass through paper but are stopped by ',['b5','aluminium'],
    '. Gamma rays pass through both and are only reduced by thick lead. Alpha is the most ',['b6','ionising'],' and the least penetrating. Use ',['b7','tongs'],' to handle the source, and keep it pointing away from people.'
  ];
  const cloze=mk('div','cloze'),slots=[],chips=[];
  parts.forEach(p=>{
    if(typeof p==='string')cloze.appendChild(document.createTextNode(p));
    else{const s=mk('span','blank');cloze.appendChild(s);slots.push({id:p[0],el:s,answer:p[1]});chips.push({id:'c-'+p[0],text:p[1]});}
  });
  ['lead only','gloves only','half-life','penetrating'].forEach((t,i)=>chips.push({id:'d'+i,text:t}));
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
  const body=act('method','Order','Find what a source emits','Put the steps in the order you would do them. Drag the ≡ handle, or use the ▲▼ buttons.');
  createReorder({host:body,steps:[
    {id:'a',text:'With no source near, count for one minute with the GM tube and counter.'},
    {id:'b',text:'Repeat the background count twice more and find the mean.'},
    {id:'c',text:'Using tongs, place the source a fixed distance (e.g. 3 cm) from the GM tube.'},
    {id:'d',text:'Count for one minute with no absorber.'},
    {id:'e',text:'Repeat with paper, then aluminium, then lead between the source and the tube.'},
    {id:'f',text:'Take the mean background away from each count.'},
    {id:'g',text:'Compare: where does the corrected count drop?'}
  ],constraints:[['a','b'],['b','f'],['c','d'],['d','e'],['e','f'],['f','g']],
  why:'The background is measured with no source present, and its mean is taken away from every count. The distance stays the same while only the absorber changes, so any drop in the count is caused by the absorber.'});
}
{
  const body=act('method','Match','What each piece of equipment is for','Pair each piece of equipment with its job. Drag one card onto the other, or tap one card and then the other.');
  createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'g',l:'Geiger–Müller tube',r:'Detects ionising radiation that enters its window'},
    {id:'c',l:'Counter and timer',r:'Counts the radiation detected in a fixed time, such as 1 minute'},
    {id:'t',l:'Tongs',r:'Keep the source at a distance from your hand'},
    {id:'r',l:'Metre rule',r:'Keeps the distance from the source to the tube the same'},
    {id:'p',l:'Paper, aluminium and lead',r:'Absorbers of different penetrating power, placed in turn between them'},
    {id:'b',l:'Lead-lined box',r:'Stores the source safely when it is not being used'}
  ]});
}

/* ================= 3. VARIABLES ================= */
{
  const body=act('variables','Sort','Which variable is it?','Ananya measures the count through different absorbers. Sort each variable, then press Check.');
  createSortGame({host:body,cats:[
    {id:'i',label:'Independent',hint:'What she changes',color:'--c1',soft:'--c1-soft'},
    {id:'d',label:'Dependent',hint:'What she measures',color:'--c2',soft:'--c2-soft'},
    {id:'c',label:'Control',hint:'What she keeps the same',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'The absorber material',cat:'i'},
    {id:'2',text:'The count in one minute',cat:'d'},
    {id:'3',text:'The distance from the source to the GM tube',cat:'c'},
    {id:'4',text:'The time each count lasts',cat:'c'},
    {id:'5',text:'The thickness of each absorber',cat:'c'},
    {id:'6',text:'The source and the GM tube used',cat:'c'}
  ]});
}
{
  const body=act('variables','Predict','The same distance','');
  createPredict({host:body,q:'Why must the distance from the source to the GM tube stay the same?',options:[
    {text:'The count also changes with distance',correct:true},
    {text:'The tube only works at one distance',why:'A GM tube detects radiation at any distance. The count changes with distance, so distance would affect the results.'},
    {text:'The source decays faster when close',why:'The decay of a source does not depend on how far away the tube is.'},
    {text:'Moving it would change the background',why:'The background is the same everywhere in the room. The count from the source changes with distance.'}
  ],explain:'Radiation spreads out, and alpha is absorbed by a few cm of air, so the count falls as the distance rises. If the distance changed too, she could not tell whether the absorber or the distance caused a drop. It is a control variable: a fair test.'});
}
{
  const body=act('variables','Predict','Bar chart or line graph?','');
  createPredict({host:body,q:'Ananya plots the corrected count for each absorber. Which kind of graph should she draw?',options:[
    {text:'A bar chart',correct:true},
    {text:'A line graph',why:'A line graph needs a continuous variable on the x-axis. The absorber material is a category, not a number.'},
    {text:'A scatter graph',why:'A scatter graph needs numbers on both axes. The absorber materials are categories.'},
    {text:'A pie chart',why:'A pie chart shows parts of a whole. Each count here is separate, not part of a total.'}
  ],explain:'The independent variable (paper, aluminium, lead) is categoric, so the results go on a bar chart. A line graph is for a continuous variable, such as the thickness of lead.'});
}

/* ================= 4. EXPERIMENT ================= */
{
  act('experiment','Your turn','Take your own readings','Press Experiment. First measure the background three times, with no source. Then, for each source, count for one minute with no absorber, paper, aluminium and lead, at the same distance. Use your corrected counts to work out what Source X and Source Y emit. Then drag the GM tube further away from the alpha source: where does the count fall to background?');
}
frameAct('experiment','animations/penetrating-power.html','','Penetrating power animation: a radioactive source, absorbers and a Geiger–Müller tube with a counter','penetrating power of radiation',false);
{
  const body=act('experiment','Predict','Alpha in air','');
  createPredict({host:body,q:'With no absorber, Charlie moves the GM tube from 3 cm to 8 cm from an alpha source. What happens to the corrected count?',options:[
    {text:'It falls to about zero',correct:true},
    {text:'It falls to about half',why:'Alpha does not just spread out: it is absorbed by a few cm of air, so almost none reaches 8 cm.'},
    {text:'It stays about the same',why:'Alpha particles have a range of only a few cm in air, so the count falls sharply.'},
    {text:'It rises a little',why:'Moving further away can only lower the count.'}
  ],explain:'Alpha particles are strongly ionising, so they lose their energy quickly and travel only a few centimetres in air. At 8 cm the count is about the background, so the corrected count is about zero.'});
}
{
  const body=act('experiment','Predict','Two counts differ','');
  createPredict({host:body,q:'Charlie repeats a one-minute count with nothing changed. The count goes from 1849 to 1812. Why?',options:[
    {text:'Radioactive decay is random',correct:true},
    {text:'The source has used up its radiation',why:'In one minute, a long-lived source like this hardly decays at all. The difference is random.'},
    {text:'The GM tube has warmed up',why:'Warming does not change a GM tube like this. Decay is random, so counts always vary a little.'},
    {text:'He must have moved the source',why:'Nothing changed. Even with an identical setup, the number of decays each minute varies.'}
  ],explain:'Each nucleus decays at random, so the number detected in each minute varies. That is why counts are repeated, or taken over a longer time, and a mean is found.'});
}

/* ================= 5. RESULTS ================= */
{
  const body=act('results','Calculate','Complete the results for source P','The mean background count is 30 counts per minute. Two corrected counts are missing.');
  body.appendChild(resTable(['Absorber','Count in 1 min','Corrected count'],[['None','1250','1220'],['Paper','1238',null],['Aluminium, 5 mm','85',null],['Lead, 2 cm','31','1']]));
  createCalc({host:body,questions:[
    {q:'Corrected count with paper:',unit:'counts per minute',answer:1208,working:'corrected count = count − background<br>corrected count = 1238 − 30<br>corrected count = 1208'},
    {q:'Corrected count with aluminium:',unit:'counts per minute',answer:55,working:'corrected count = count − background<br>corrected count = 85 − 30<br>corrected count = 55'}
  ]});
}
{
  const body=act('results','Look','Results for source Q','The mean background count is 30 counts per minute.');
  body.appendChild(resTable(['Absorber','Count in 1 min','Corrected count'],[['None','2140','2110'],['Paper','612','582'],['Aluminium, 5 mm','596','566'],['Lead, 2 cm','210','180']]));
}
{
  const body=act('results','Predict','What does P emit?','');
  createPredict({host:body,q:'Use the table for source P. Which radiation does it emit?',options:[
    {text:'Beta',correct:true},
    {text:'Alpha',why:'Alpha would be stopped by the paper, but the count with paper is almost the same as with no absorber.'},
    {text:'Gamma',why:'Gamma would pass through 5 mm of aluminium. The count drops sharply with aluminium.'},
    {text:'Alpha and gamma',why:'There is no big drop with paper (so no alpha), and lead takes the count to background (so no gamma).'}
  ],explain:'Paper hardly changes the count, so there is no alpha. Aluminium cuts the count sharply, so the source emits beta. With lead the count is the same as background, so there is no gamma either.'});
}
{
  const body=act('results','Predict','What does Q emit?','');
  createPredict({host:body,q:'Use the table for source Q. Which radiations does it emit?',options:[
    {text:'Alpha and gamma',correct:true},
    {text:'Beta and gamma',why:'Aluminium hardly changes the count, so there is no beta. The big drop is with paper.'},
    {text:'Only gamma rays',why:'Paper cuts the count from 2110 to 582, which gamma would not do: that drop is alpha.'},
    {text:'Alpha and beta',why:'A count well above background gets through 2 cm of lead, so there must be gamma.'}
  ],explain:'Paper cuts the corrected count sharply (alpha stopped). Aluminium makes little more difference (no beta). Lead reduces what is left, but it is still well above background, so the source also emits gamma.'});
}
{
  const body=act('results','Predict','Lead and the count','');
  createPredict({host:body,q:'With 2 cm of lead, the count from source P is 31 per minute, and the background is 30 per minute. What does this show?',options:[
    {text:'No radiation from P gets through',correct:true},
    {text:'Lead makes the source give out less',why:'An absorber does not change what the source emits. It absorbs what reaches it.'},
    {text:'Lead is the worst absorber of P',why:'The count with lead is the lowest, so lead absorbs best.'},
    {text:'Only 1 count reached the tube',why:'About 31 counts reached the tube, but only 1 more than background: the difference is just random variation.'}
  ],explain:'The count is the same as the background (within random variation), so no radiation from the source reaches the tube through the lead. The 31 counts are all background radiation.'});
}

{
  const body=act('results','Predict','The best absorber','');
  createPredict({host:body,q:'Lucas says: “Paper is the best absorber of source Q, because it gives the largest drop in the count.” Is he right?',options:[
    {text:'No: lead gives the lowest count',correct:true},
    {text:'Yes: the drop with paper is biggest',why:'The paper stops the alpha, but lead stops far more of the radiation overall: its count is the lowest.'},
    {text:'Yes: paper stops all the alpha',why:'Paper stops the alpha, but the best absorber is the one with the lowest count, and that is lead.'},
    {text:'No: aluminium gives the lowest count',why:'Aluminium gives 566 counts; lead gives only 180, so lead absorbs most.'}
  ],explain:'A better absorber lets less radiation through, so it gives a lower count. Lead gives the lowest corrected count (180 per minute), so lead is the best absorber.'});
}

/* ================= 6. ALPHA, BETA, GAMMA ================= */
{
  const body=act('radiation','Match','Alpha, beta and gamma','Pair each term with its description. Drag one card onto the other, or tap one card and then the other.');
  createMatchGame({host:body,leftTitle:'Term',rightTitle:'Description',pairs:[
    {id:'a',l:'Alpha particle',r:'A helium nucleus: 2 protons and 2 neutrons'},
    {id:'b',l:'Beta particle',r:'A fast electron given out by an unstable nucleus'},
    {id:'g',l:'Gamma ray',r:'A high-frequency electromagnetic wave from a nucleus'},
    {id:'i',l:'Ionising radiation',r:'Radiation that removes electrons from atoms'},
    {id:'r',l:'Random decay',r:'You cannot tell which nucleus will decay next, or when'}
  ]});
}
{
  const body=act('radiation','Sort','Alpha, beta or gamma?','Sort each property, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'Alpha',hint:'',color:'--c2',soft:'--c2-soft'},
    {id:'b',label:'Beta',hint:'',color:'--c1',soft:'--c1-soft'},
    {id:'g',label:'Gamma',hint:'',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Stopped by a sheet of paper or a few cm of air',cat:'a'},
    {id:'2',text:'The most strongly ionising',cat:'a'},
    {id:'3',text:'Charge of +2',cat:'a'},
    {id:'4',text:'Stopped by a few mm of aluminium',cat:'b'},
    {id:'5',text:'Charge of −1',cat:'b'},
    {id:'6',text:'Only reduced by several cm of lead',cat:'g'},
    {id:'7',text:'No charge and no mass',cat:'g'}
  ]});
}
{
  const body=act('radiation','Predict','Why alpha stops so soon','');
  createPredict({host:body,q:'Why do alpha particles penetrate the least?',options:[
    {text:'They ionise strongly and lose energy fast',correct:true},
    {text:'They travel faster than beta or gamma',why:'Alpha particles are the slowest of the three. They stop because they ionise strongly.'},
    {text:'They have no charge, so are easily stopped',why:'Alpha particles have the largest charge, +2. Gamma has no charge.'},
    {text:'They are given out with very little energy',why:'Alpha particles have plenty of energy, but they lose it quickly by ionising atoms.'}
  ],explain:'Alpha particles have a large charge (+2) and a large mass, so they ionise many atoms along their path. Each ionisation takes some energy, so they lose all their energy within a few cm of air or a sheet of paper.'});
}
{
  const body=act('radiation','Predict','Inside the body','');
  createPredict({host:body,q:'Which source is the most dangerous if it is swallowed?',options:[
    {text:'An alpha source',correct:true},
    {text:'A gamma source',why:'Gamma is the least ionising. Most of it passes straight out of the body.'},
    {text:'A beta source',why:'Beta is less ionising than alpha, so it does less damage to the cells around it.'},
    {text:'They are all equally dangerous',why:'Inside the body, alpha does by far the most damage: it is the most ionising.'}
  ],explain:'Outside the body, alpha is stopped by the dead outer layer of skin. Inside the body, all its energy goes into ionising the nearby cells, which can damage them or cause mutations and cancer.'});
}

/* ================= 7. BACKGROUND ================= */
{
  const body=act('background','Sort','Background radiation or not?','Sort each card, then press Check.');
  createSortGame({host:body,cats:[
    {id:'y',label:'A source of background radiation',hint:'Always present',color:'--c3',soft:'--c3-soft'},
    {id:'n',label:'Not background radiation',hint:'',color:'--c2',soft:'--c2-soft'}
  ],items:[
    {id:'1',text:'Radon gas from the ground',cat:'y'},
    {id:'2',text:'Rocks such as granite',cat:'y'},
    {id:'3',text:'Cosmic rays from space',cat:'y'},
    {id:'4',text:'Food and drink',cat:'y'},
    {id:'5',text:'Medical X-rays and scans',cat:'y'},
    {id:'6',text:'The source being tested',cat:'n'},
    {id:'7',text:'Radio waves from a phone mast',cat:'n'}
  ]});
}
{
  const body=act('background','Calculate','Correcting for background','Hana counts for one minute with no source three times: 28, 34 and 31 counts.');
  createCalc({host:body,questions:[
    {q:'What is the mean background count?',unit:'counts per minute',answer:31,working:'mean = [[28 + 34 + 31|3]]<br>mean = [[93|3]]<br>mean = 31 counts per minute'},
    {q:'With a source, she counts 450 in one minute. What is the corrected count?',unit:'counts per minute',answer:419,working:'corrected count = count − background<br>corrected count = 450 − 31<br>corrected count = 419 counts per minute'},
    {q:'What is the corrected count rate in counts per second?',unit:'counts per second',answer:6.98,working:'count rate = [[corrected count|time]]<br>count rate = [[419|60]]<br>count rate = 6.98 counts per second'}
  ]});
}

/* ================= 8. SAFETY AND ACCURACY ================= */
{
  const body=act('accuracy','Sort','Safer or better results?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'s',label:'Keeps people safe',hint:'Less exposure to radiation',color:'--c3',soft:'--c3-soft'},
    {id:'a',label:'Better results',hint:'More reliable counts',color:'--c1',soft:'--c1-soft'}
  ],items:[
    {id:'1',text:'Handle the source with tongs, at arm’s length',cat:'s'},
    {id:'2',text:'Point the source away from people',cat:'s'},
    {id:'3',text:'Keep the source in its lead-lined box when not in use',cat:'s'},
    {id:'4',text:'Use the source for as short a time as possible',cat:'s'},
    {id:'5',text:'Measure the background and take it away from every count',cat:'a'},
    {id:'6',text:'Count for longer, or repeat each count and find the mean',cat:'a'},
    {id:'7',text:'Keep the distance and absorber thickness the same',cat:'a'}
  ]});
}
{
  const body=act('accuracy','Predict','Counting for longer','');
  createPredict({host:body,q:'Why does counting for 5 minutes give a more reliable result than counting for 10 seconds?',options:[
    {text:'Random variation averages out',correct:true},
    {text:'The source gets stronger over time',why:'A source never gets stronger; it slowly gets weaker as it decays.'},
    {text:'The background stops after a while',why:'Background radiation is always present. A longer count averages out its random variation too.'},
    {text:'The GM tube needs time to warm up',why:'The tube works straight away. Decay is random, so a short count varies a lot.'}
  ],explain:'Decay is random, so a short count can be well above or below the true rate. Over a longer time, the random ups and downs average out, so the count rate is more reliable. Repeating and finding the mean does the same.'});
}
{
  const body=act('accuracy','Predict','A simulation','');
  createPredict({host:body,q:'The spec says this practical can be done with a simulation instead of real sources. Why might a school choose a simulation?',options:[
    {text:'No one is exposed to radiation',correct:true},
    {text:'Real sources give random counts',why:'A good simulation gives random counts too. The main reason is safety and the rules on keeping sources.'},
    {text:'Simulations need no background count',why:'A good simulation includes background radiation, so it still has to be measured.'},
    {text:'Real GM tubes cannot detect alpha',why:'A GM tube with a thin window can detect alpha. The reason for a simulation is safety and access.'}
  ],explain:'Sources must be stored, used and recorded under strict local rules, and every use exposes people to a little radiation. A simulation gives the same kind of results with no exposure.'});
}

/* ================= EXAM PRACTICE ================= */
{
  const body=act('exam','Exam style','Identify the radiation','Write each answer, then check it against the model answer.');
  examPart(body,'(a) 1 mark','Name a detector Zahra can use to measure the radiation from a source.',['A Geiger–Müller (GM) tube, connected to a counter.']);
  examPart(body,'(b) 4 marks','Describe how Zahra should measure, and allow for, the background count.',[
    'Remove the source (from the room, or into its lead box).',
    'Count with the GM tube for a fixed time, such as one minute.',
    'Repeat the background count and find the mean.',
    'Take (subtract) the mean background from each count with the source.']);
  examPart(body,'(c) 5 marks','Describe an experiment to show that a source emits gamma radiation, and give one safety precaution.',[
    'GM tube and counter; measure and subtract the background count.',
    'Count with the source at a fixed distance, with no absorber.',
    'Count with paper, then aluminium, between the source and the tube: the count hardly changes.',
    'Count with several cm of lead: the count is greatly reduced (but not to background).',
    'Repeat each count and find the mean.',
    'Safety: tongs or keep a distance, short time, source shielded or pointed away from people.']);
  examPart(body,'(d) 2 marks','Explain why every absorber should be the same thickness when comparing absorber materials.',[
    'Thickness also affects the count.',
    'So it is a control variable: only the material changes, so the test is fair (valid).']);
  examPart(body,'(e) 3 marks','A source gives corrected counts of 980 (no absorber), 960 (paper), 18 (aluminium) and 0 (lead) per minute. Identify the radiation and explain your answer.',[
    'Beta.',
    'It passes through paper, so it is not alpha.',
    'It is stopped by aluminium (and lead), so it is not gamma.']);
  examPart(body,'(f) 2 marks','Suggest why counts with the same setup are never exactly the same.',[
    'Radioactive decay is random.',
    'So the number of decays detected each minute varies (repeat and find a mean).']);
}
