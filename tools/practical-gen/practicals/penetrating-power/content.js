/* 7.6 Penetrating power of alpha, beta and gamma (radioactive sources or a simulation), rebuilt to the 1.22 model
   (5c, 13 Nov 2026). Only the practical's own material: what alpha, beta and gamma are, why alpha stops so soon,
   the sources of background radiation and the dangers inside the body are in the 7a workout (Alpha, Beta, Gamma tab).
   Mark scheme wording from the IGCSE Question Index (see tools/CORE-PRACTICALS.md). */
function resTable(head,rows){
  const t=mk('div','table-scroll');
  t.innerHTML='<table class="units res-tbl"><thead><tr>'+head.map(h=>'<th>'+h+'</th>').join('')+'</tr></thead><tbody>'+
    rows.map(r=>'<tr>'+r.map((c,i)=>(i?'<td>':'<th>')+(c==null?'<b>?</b>':c)+(i?'</td>':'</th>')).join('')+'</tr>').join('')+'</tbody></table>';
  return t;
}
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


/* ================= VARIABLES ================= */
{
  const body=act('variables','Sort','Which kind of variable is it?','Ananya compares how well different materials absorb the radiation from one source, using a 1 cm thick sheet of each. Sort each card into the right bin, then press Check.');
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
  const body=act('variables','Multiple choice','The same distance','');
  createPredict({host:body,q:'Why must the distance from the source to the GM tube stay the same?',options:[
    {text:'The count also changes with distance',correct:true},
    {text:'The tube only works at one distance',why:'A GM tube detects radiation at any distance. The count changes with distance, so distance would affect the results.'},
    {text:'The source decays faster when close',why:'The decay of a source does not depend on how far away the tube is.'},
    {text:'Moving it would change the background',why:'The background is the same everywhere in the room. The count from the source changes with distance.'}
  ],explain:'Radiation spreads out, and alpha is absorbed by a few cm of air, so the count falls as the distance rises. If the distance changed too, she could not tell whether the absorber or the distance caused a drop. It is a control variable: a fair test.'});
}
{
  const body=act('variables','Multiple choice','Bar chart or line graph?','');
  createPredict({host:body,q:'Ananya plots the corrected count for each absorber. Which kind of graph should she draw?',options:[
    {text:'A bar chart',correct:true},
    {text:'A line graph',why:'A line graph needs a continuous variable on the x-axis. The absorber material is a category, not a number.'},
    {text:'A scatter graph',why:'A scatter graph needs numbers on both axes. The absorber materials are categories.'},
    {text:'A pie chart',why:'A pie chart shows parts of a whole. Each count here is separate, not part of a total.'}
  ],explain:'The independent variable (paper, aluminium, lead) is categoric, so the results go on a bar chart. A line graph is for a continuous variable, such as the thickness of lead.'});
}

/* ================= METHOD ================= */
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

/* ================= ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Better results or safer?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'Better results',hint:'More reliable counts',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps people safe',hint:'Less exposure to radiation',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Handle the source with tongs, at arm’s length',cat:'s'},
    {id:'2',text:'Point the source away from people',cat:'s'},
    {id:'3',text:'Keep the source in its lead-lined box when not in use',cat:'s'},
    {id:'4',text:'Use the source for as short a time as possible',cat:'s'},
    {id:'5',text:'Measure the background and take it away from every count',cat:'a'},
    {id:'6',text:'Count for longer, or repeat each count and find the mean',cat:'a'},
    {id:'7',text:'Keep the distance the same, and the absorber thickness when comparing materials',cat:'a'}
  ]});
}
{
  const body=act('accuracy','Multiple choice','Counting for longer','');
  createPredict({host:body,q:'Why does counting for 5 minutes give a more reliable result than counting for 10 seconds?',options:[
    {text:'Random variation averages out',correct:true},
    {text:'The source gets stronger over time',why:'A source never gets stronger; it slowly gets weaker as it decays.'},
    {text:'The background stops after a while',why:'Background radiation is always present. A longer count averages out its random variation too.'},
    {text:'The GM tube needs time to warm up',why:'The tube works straight away. Decay is random, so a short count varies a lot.'}
  ],explain:'Decay is random, so a short count can be well above or below the true rate. Over a longer time, the random ups and downs average out, so the count rate is more reliable. Repeating and finding the mean does the same.'});
}
{
  const body=act('accuracy','Multiple choice','A simulation','');
  createPredict({host:body,q:'The spec says this practical can be done with a simulation instead of real sources. Why might a school choose a simulation?',options:[
    {text:'No one is exposed to radiation',correct:true},
    {text:'Real sources give random counts',why:'A good simulation gives random counts too. The main reason is safety and the rules on keeping sources.'},
    {text:'Simulations need no background count',why:'A good simulation includes background radiation, so it still has to be measured.'},
    {text:'Real GM tubes cannot detect alpha',why:'A GM tube with a thin window can detect alpha. The reason for a simulation is safety and access.'}
  ],explain:'Sources must be stored, used and recorded under strict local rules, and every use exposes people to a little radiation. A simulation gives the same kind of results with no exposure.'});
}

/* ================= DO THE EXPERIMENT (the 1.22 model; 5c, 13 Nov 2026) =================
   The student reads the counter and the rule in the animation's measure mode (animations/penetrating-power.html
   ?show=measure, all sources shown) and types the counts. The counts are fixed there and must match PP_BG and PP_X, PP_Y
   here (tools/CORE-PRACTICALS.md, "Measure modes": background 22, 32, 34; at 3 cm, none, paper, aluminium, lead). */
const PP_BG=[22,32,34], PP_MEAN=(22+32+34)/3;
const PP_ABS=['None','Paper','Aluminium, 5 mm','Lead, 2 cm'];
const PP_X=[1849,329,316,111], PP_Y=[1480,1349,247,86];
const ppBodies=[];
{
  act('do','Your turn','Take your own readings','First choose <b>None</b> for the source and press Count for 1 minute three times: these are your background counts. Then choose <b>Source X</b>, leave the GM tube at 3 cm on the rule, and count with no absorber, paper, aluminium and lead. Do the same for <b>Source Y</b>. Read each count off the counter when its timer stops at 60 s.');
}
frameAct('do','animations/penetrating-power.html','measure','Penetrating power experiment: read the counter and the rule, and write the counts in your tables','penetrating power of radiation',false);
{
  const body=act('do','Record','Your background counts','No source. Type each count, then the mean, and press Check table.');ppBodies.push(body);
  ownTable(body,{head:['Background count','Count in 1 minute'],
    rows:[['1st',{k:'b1',a:22,tol:0,dp:0,label:'First background count'}],['2nd',{k:'b2',a:32,tol:0,dp:0,label:'Second background count'}],['3rd',{k:'b3',a:34,tol:0,dp:0,label:'Third background count'}],
      ['Mean',{k:'bm',f:v=>(v('b1')+v('b2')+v('b3'))/3,tol:0.35,dp:1,label:'Mean background count'}]],
    hint:'Count again with no source: the three counts come round in turn. Mean = the sum of the three counts divided by 3.',done:'All correct. Take this mean away from every count in the next table.'});
}
{
  const body=act('do','Record','Your results for sources X and Y','The GM tube is 3 cm from the source. Type each count, then the corrected count (count − mean background), and press Check table.');ppBodies.push(body);
  const row=(a,i)=>[a,{k:'x'+i,a:PP_X[i],tol:0,dp:0,label:'Source X, '+a.toLowerCase()+': count'},{k:'xc'+i,f:v=>v('x'+i)-PP_MEAN,tol:0.5,dp:1,label:'Source X, '+a.toLowerCase()+': corrected count'},
    {k:'y'+i,a:PP_Y[i],tol:0,dp:0,label:'Source Y, '+a.toLowerCase()+': count'},{k:'yc'+i,f:v=>v('y'+i)-PP_MEAN,tol:0.5,dp:1,label:'Source Y, '+a.toLowerCase()+': corrected count'}];
  ownTable(body,{head:['Absorber','X: count','X: corrected','Y: count','Y: corrected'],rows:PP_ABS.map(row),
    hint:'Check the source and the absorber chosen, and that the tube is at 3 cm on the rule. Corrected count = count − 29.3.',done:'All correct.'});
}
sideBySide('do',ppBodies);
{
  const body=act('do','Predict','Reading your results: source X','');
  createPredict({host:body,q:'Use your corrected counts for source X. Which radiations does it emit?',options:[
    {text:'Alpha and gamma',correct:true},
    {text:'Beta and gamma',why:'Aluminium hardly lowers the count after paper (about 300 to 287), so there is no beta. The big drop is with paper.'},
    {text:'Only gamma',why:'Paper cuts the count from about 1820 to 300. Gamma passes through paper, so that drop is alpha.'},
    {text:'Alpha and beta',why:'About 82 counts a minute still get through 2 cm of lead, well above zero, so there must be gamma.'}
  ],explain:'Paper cuts the corrected count sharply, so alpha has been stopped. Aluminium makes little more difference, so there is no beta. Lead reduces what is left, but not to zero, so the source also emits gamma.'});
}
{
  const body=act('do','Predict','Reading your results: source Y','');
  createPredict({host:body,q:'Use your corrected counts for source Y. Which radiations does it emit?',options:[
    {text:'Beta and gamma',correct:true},
    {text:'Alpha and gamma',why:'Paper hardly changes the count (about 1450 to 1320), so there is no alpha. The big drop is with aluminium.'},
    {text:'Only beta',why:'About 57 counts a minute still get through 2 cm of lead, so there must be gamma as well.'},
    {text:'Alpha and beta',why:'Paper hardly lowers the count, so there is no alpha, and something gets through the lead, so there is gamma.'}
  ],explain:'Paper hardly changes the corrected count, so there is no alpha. Aluminium cuts it sharply, so beta has been stopped. Lead reduces what is left, but not to zero, so the source also emits gamma.'});
}

/* ================= SHOW THE EXPERIMENT: the readings taken for you ================= */
{
  act('experiment','Your turn','Watch the readings','Press Experiment. First choose None and count the background three times: the mean is taken from every count for you. Then, for each source, count with no absorber, paper, aluminium and lead, at the same distance. What do sources X and Y emit? Then drag the GM tube away from the alpha source: where does the count fall to background?');
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
  const body=act('experiment','Multiple choice','More through the paper?','');
  createPredict({host:body,q:'With the gamma source, Charlie counts 597 with no absorber and then 619 with paper. Why is the count with paper higher?',options:[
    {text:'Radioactive decay is random',correct:true},
    {text:'Paper gives out radiation of its own',why:'Paper is not a source. Gamma passes straight through it, and the counts vary at random.'},
    {text:'Paper makes the gamma rays stronger',why:'An absorber can only take radiation away. The difference is random variation.'},
    {text:'He must have moved the GM tube',why:'Even with nothing changed, the number of decays each minute varies.'}
  ],explain:'Gamma passes through paper almost unaffected, so the two counts should be about the same. Each nucleus decays at random, so the number detected in a minute varies by a few per cent. That is why counts are repeated, or taken over a longer time, and a mean is found.'});
}

/* ================= RESULTS: what the readings show ================= */
{
  const body=act('results','Calculate','Complete the results for source P','The mean background count is 30 counts per minute. Two corrected counts are missing.');
  body.appendChild(resTable(['Absorber','Count in 1 min','Corrected count'],[['None','1250','1220'],['Paper','1238',null],['Aluminium, 5 mm','85',null],['Lead, 2 cm','31','1']]));
  createCalc({host:body,questions:[
    {q:'Corrected count with paper:',unit:'counts per minute',answer:1208,working:'corrected count = count − background<br>corrected count = 1238 − 30<br>corrected count = 1208'},
    {q:'Corrected count with aluminium:',unit:'counts per minute',answer:55,working:'corrected count = count − background<br>corrected count = 85 − 30<br>corrected count = 55'}
  ]});
}
{
  const body=act('results','Multiple choice','What does P emit?','');
  createPredict({host:body,q:'Use the table for source P. Which radiation does it emit?',options:[
    {text:'Beta',correct:true},
    {text:'Alpha',why:'Alpha would be stopped by the paper, but the count with paper is almost the same as with no absorber.'},
    {text:'Gamma',why:'Gamma would pass through 5 mm of aluminium. The count drops sharply with aluminium.'},
    {text:'Alpha and gamma',why:'There is no big drop with paper (so no alpha), and lead takes the count to background (so no gamma).'}
  ],explain:'Paper hardly changes the count, so there is no alpha. Aluminium cuts the count sharply, so the source emits beta. With lead the count (31) is the same as background, so there is no gamma either: the 1 left is random variation.'});
}
{
  const body=act('results','Multiple choice','Below zero','');
  createPredict({host:body,q:'Charlie’s mean background is 29.3 per minute. With paper in front of the alpha source he counts 27, so his corrected count is −2.3 per minute. What does this show?',options:[
    {text:'No alpha gets through: it is background',correct:true},
    {text:'The paper absorbs the background as well',why:'Background radiation comes from all directions, and a sheet of paper stops almost none of it.'},
    {text:'He has made a mistake in his working',why:'27 − 29.3 = −2.3 is right. A corrected count a little below zero is normal.'},
    {text:'The source now takes in radiation',why:'A source cannot take in radiation. The count is just background, which varies at random.'}
  ],explain:'Background counts vary at random (Charlie’s were 22, 32 and 34). A count of 27 lies within that spread, so no alpha reaches the tube: the paper stops it all. The corrected count is about zero.'});
}
{
  const body=act('results','Multiple choice','The best absorber','');
  createPredict({host:body,pre:resTable(['Absorber, 1 cm thick','Corrected count in 1 min'],[['None','2110'],['Paper (a stack of sheets)','560'],['Aluminium','520'],['Lead','280']]).outerHTML,
    q:'To compare materials fairly, Lucas puts a 1 cm thick sheet of each material in front of source Q in turn. He says: “Paper is the best absorber, because it gives the largest drop in the count.” Is he right?',options:[
    {text:'No: lead gives the lowest count',correct:true},
    {text:'Yes: the drop with paper is biggest',why:'The paper stops the alpha, but so does every 1 cm sheet. Lead lets the least radiation through: its count is the lowest.'},
    {text:'Yes: paper stops all the alpha',why:'Paper stops the alpha, but the best absorber is the one with the lowest count, and that is lead.'},
    {text:'No: aluminium gives the lowest count',why:'Aluminium gives 520 counts; lead gives only 280, so lead absorbs most.'}
  ],explain:'A better absorber lets less radiation through, so it gives a lower count. With the same thickness of each, lead gives the lowest corrected count (280 per minute), so lead is the best absorber. Paper, 5 mm of aluminium and 2 cm of lead are for finding what a source emits, not for comparing materials: they are different thicknesses, so they would not be a fair test of which material absorbs best.'});
}
