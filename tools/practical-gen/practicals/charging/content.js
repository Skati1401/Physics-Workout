/* 2.23P Charging insulators by friction, rebuilt to the 1.22 model (5c, 13 Nov 2026): observe and record, so the
   Do Experiment table records what is seen, not numbers. Only the practical's own material: conductors, earthing,
   dangers and uses (2.22P, 2.27P, 2.28P) are in the 2d workout. Mark scheme wording from the IGCSE Question Index
   (see tools/CORE-PRACTICALS.md). */
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
  const body=act('variables','Sort','Which kind of variable is it?','Lucas brings different rubbed rods near a rubbed polythene rod hanging in a paper stirrup, and watches which way it turns. Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'i',label:'Independent',hint:'You change it',color:'--c1',soft:'--c1-soft'},
    {id:'d',label:'Dependent',hint:'You observe it',color:'--c2',soft:'--c2-soft'},
    {id:'c',label:'Control',hint:'You keep it the same',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'The material of the rod in his hand',cat:'i'},
    {id:'2',text:'Which way the hanging rod turns, if at all',cat:'d'},
    {id:'3',text:'The cloth used to rub every rod',cat:'c'},
    {id:'4',text:'How many times he rubs each rod',cat:'c'},
    {id:'5',text:'How close he brings the rod to the hanging rod',cat:'c'},
    {id:'6',text:'Keeping the rods and the cloth dry',cat:'c'}
  ]});
}
{
  const body=act('variables','Multiple choice','A new question to test','');
  createPredict({host:body,q:'Lucas wants to find out whether rubbing a polythene rod more times gives it more charge. He holds it near an uncharged electroscope. What is his independent variable?',options:[
    {text:'The number of times he rubs the rod',correct:true},
    {text:'How far the gold leaf rises each time',why:'That is what he observes, so it is the dependent variable.'},
    {text:'The material the rod is made of',why:'He uses a polythene rod every time, so it is a control variable.'},
    {text:'How close he holds the rod to the cap',why:'He should hold it at the same distance each time, so it is a control variable.'}
  ],explain:'The independent variable is the one he changes on purpose: the number of rubs. He keeps the rod, the cloth and the distance the same, and watches how far the leaf rises.'});
}
{
  const body=act('variables','Multiple choice','Close, but not touching','');
  createPredict({host:body,q:'Why must Lucas bring the rod close to the hanging rod without touching it?',options:[
    {text:'Touching lets charge pass between the rods',correct:true},
    {text:'The rods only push or pull when they touch',why:'Electrostatic forces act across a gap: that is what the hanging rod shows. Touching is what spoils the test.'},
    {text:'Touching would rub more charge onto both rods',why:'Touching is not rubbing. It lets some charge move from one rod to the other, so neither keeps the charge it was given.'},
    {text:'The hanging rod is a conductor and would earth him',why:'Both rods are insulators. The problem is that charge can pass between them where they touch.'}
  ],explain:'Bring the rod close, without touching. If the rods touch, charge can pass from one to the other, so you are no longer testing the charges the cloth gave them.'});
}


/* ================= 1. METHOD ================= */
{
  const body=act('method','Order','Show that there are two types of charge','Put the steps in the order you would do them. Drag the ≡ handle, or use the ▲▼ buttons.');
  createReorder({host:body,steps:[
    {id:'a',text:'Rub a polythene rod with a dry cloth.'},
    {id:'b',text:'Hang it from a thread in a paper stirrup, so it can turn freely.'},
    {id:'c',text:'Rub a second polythene rod with the cloth.'},
    {id:'d',text:'Bring it close to one end of the hanging rod, without touching.'},
    {id:'e',text:'Watch whether the hanging rod turns towards it or away from it.'},
    {id:'f',text:'Rub an acetate rod with the cloth and bring it close in the same way.'},
    {id:'g',text:'Compare: one rod repels the hanging rod and the other attracts it.'}
  ],constraints:[['a','b'],['b','d'],['c','d'],['d','e'],['e','g'],['f','g']],
  why:'The hanging rod is charged and free to turn, so a small force moves it. A rod that repels it has the same type of charge; one that attracts it has the opposite type. Seeing both attraction and repulsion shows there are two types of charge.'});
}
{
  const body=act('method','Match','What each piece of equipment is for','Pair each piece of equipment with its job. Drag one card onto the other, or tap one card and then the other.');
  createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'c',l:'Dry cloth or duster',r:'Rubbed on a rod, so friction moves electrons between them'},
    {id:'p',l:'Polythene rod',r:'An insulator that gains electrons when rubbed, so it becomes negative'},
    {id:'a',l:'Acetate rod',r:'An insulator that loses electrons when rubbed, so it becomes positive'},
    {id:'s',l:'Paper stirrup on a thread',r:'Holds a charged rod so it can turn freely when pushed or pulled'},
    {id:'e',l:'Gold-leaf electroscope',r:'Its leaf rises when a charged object is brought near its cap'},
    {id:'w',l:'Small pieces of paper',r:'Jump up to a charged rod held just above them'}
  ]});
}
/* ================= 7. ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Better results or safer?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'Better results',hint:'Clearer, more reliable observations',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps people safe',hint:'',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Use a dry cloth and dry rods: damp lets the charge leak away',cat:'a'},
    {id:'2',text:'Hold the rod by one end and rub only the other end',cat:'a'},
    {id:'3',text:'Bring the rod close without touching',cat:'a'},
    {id:'4',text:'Hang the rod so it can turn freely, out of draughts',cat:'a'},
    {id:'5',text:'Repeat each test to check you see the same thing',cat:'a'},
    {id:'6',text:'Mop up water spilled in the water-stream test, so no one slips',cat:'s'},
    {id:'7',text:'Keep charged objects and sparks away from flammable vapours',cat:'s'},
    {id:'8',text:'Handle glass rods carefully: a broken rod has sharp edges',cat:'s'}
  ]});
}
{
  const body=act('accuracy','Multiple choice','A damp day','');
  createPredict({host:body,q:'On a very damp day, Charlotte’s rubbed rods hardly move the hanging rod. Why?',options:[
    {text:'Charge leaks away through the damp',correct:true},
    {text:'Water makes the rods conduct electrons less',why:'Water on the surface conducts, so it lets the charge leak away; it does not stop charging.'},
    {text:'Damp air is heavier, so the rod cannot turn',why:'The air is not much heavier. The rods lose their charge, so the force is tiny.'},
    {text:'Damp cloths give the rods too much charge',why:'A damp cloth makes it harder, not easier, to keep charge on the rod.'}
  ],explain:'A thin layer of water on the rods, the cloth and the stirrup conducts, so the charge leaks away almost as soon as it is rubbed on. Dry equipment (or a warm, dry room) gives much clearer results.'});
}
{
  const body=act('accuracy','Multiple choice','Why hang the rod?','');
  createPredict({host:body,q:'Why is one rod hung from a thread instead of being laid on the bench?',options:[
    {text:'Small forces can turn it, so you can see them',correct:true},
    {text:'The thread charges the rod as it turns',why:'The thread is there to let the rod turn freely, not to charge it.'},
    {text:'On the bench, its charge would vanish',why:'The bench is an insulator, so the charge would mostly stay. The problem is friction stopping it moving.'},
    {text:'Hanging it makes the force between the rods bigger',why:'The force is the same. Hanging the rod just lets that small force move it.'}
  ],explain:'The electrostatic force between the rods is small. On the bench, friction would stop the rod moving. Hung from a thread (or balanced on a watch glass), the rod can swing freely, so even a small attraction or repulsion turns it.'});
}

/* ================= DO THE EXPERIMENT (the 1.22 model; 5c, 13 Nov 2026) =================
   No numbers: the student watches each test in the animation's measure mode (animations/electrostatic-charging.html
   ?show=measure, the Test with choice left on the page) and records what they see. Charges are hidden there.
   The right answers must match the animation (outcome() and seen() in animations/electrostatic-charging.html;
   tools/CORE-PRACTICALS.md, "Measure modes"). */
const CH_SEEN=['Turns towards','Turns away','Does not move'];
const CH_HANG=[['Polythene','Polythene','Turns away'],['Polythene','Acetate','Turns towards'],['Polythene','Metal','Does not move'],['Polythene','Polythene, not rubbed','Does not move'],
  ['Acetate','Polythene','Turns towards'],['Acetate','Acetate','Turns away'],['Acetate','Metal','Does not move'],['Acetate','Polythene, not rubbed','Does not move']];
const CH_OTHER_SEEN=['Moves towards the rod','Nothing happens','Leaf rises','Leaf rises further','Leaf falls'];
const CH_OTHER=[['Paper bits','Polythene','Moves towards the rod'],['Paper bits','Metal','Nothing happens'],['Water stream','Acetate','Moves towards the rod'],
  ['Electroscope, uncharged','Acetate','Leaf rises'],['Electroscope, charged negative','Polythene','Leaf rises further'],['Electroscope, charged negative','Acetate','Leaf falls']];
const chBodies=[];
{
  act('do','Your turn','Take your own readings','Choose Hanging rod. For each row of the first table, choose the hanging rod and the rod in your hand, press Rub and bring near, and record what the hanging rod does. Then choose Paper bits, Water stream or Electroscope for the second table. The charges are hidden: go by what you see.');
}
frameAct('do','animations/electrostatic-charging.html','measure','Charging by friction experiment: watch each test and record what you see','charging by friction',false);
{
  const body=act('do','Record','Your results: the hanging rod','Choose what you saw for each pair, then press Check table.');chBodies.push(body);
  ownTable(body,{head:['Hanging rod (rubbed)','Rod in your hand','What the hanging rod does'],
    rows:CH_HANG.map((r,i)=>[r[0],r[1],{k:'h'+i,a:r[2],opts:CH_SEEN,label:'What the hanging '+r[0].toLowerCase()+' rod does near a '+r[1].toLowerCase()+' rod'}]),
    hint:'Try that pair again in the animation and watch the hanging rod.',done:'All correct.'});
}
{
  const body=act('do','Record','Your results: the other tests','Choose what you saw for each test, then press Check table.');chBodies.push(body);
  ownTable(body,{head:['Test','Rod in your hand (rubbed)','What you see'],
    rows:CH_OTHER.map((r,i)=>[r[0],r[1],{k:'o'+i,a:r[2],opts:CH_OTHER_SEEN,label:r[0]+', '+r[1].toLowerCase()+' rod: what you see'}]),
    hint:'Try that test again: for the electroscope, choose Uncharged or Charged negative first.',done:'All correct.'});
}
sideBySide('do',chBodies);
{
  const body=act('do','Predict','Reading your results','');
  createPredict({host:body,q:'Use your first table. What do the hanging-rod results show?',options:[
    {text:'There are two types of charge: like charges repel',correct:true},
    {text:'Every charged rod attracts every other charged rod',why:'Polythene turned away from polythene, and acetate from acetate: some pairs repel.'},
    {text:'Polythene and acetate have the same type of charge',why:'If they had the same type, they would repel each other. They attract, so their charges are different.'},
    {text:'The metal rod has the biggest charge of all',why:'The metal rod did not move the hanging rod at all: held in your hand, it keeps no charge.'}
  ],explain:'Each rod repels a rod of its own material and attracts a rod of the other, so they carry two different types of charge: like charges repel, unlike charges attract. Seeing both attraction and repulsion is what shows there are two types. The metal and unrubbed rods have no charge, so nothing happens.'});
}

/* ================= SHOW THE EXPERIMENT: the readings taken for you ================= */
{
  act('experiment','Your turn','Watch the readings','Press Experiment: here each test is recorded in the table for you. With the hanging rod, try all four pairs: polythene or acetate hanging, and polythene or acetate in your hand. Then try a metal rod and a rod that has not been rubbed, and the paper, water and electroscope tests. Which pairs attract, which repel, and what does that tell you about the types of charge?');
}
frameAct('experiment','animations/electrostatic-charging.html','','Charging by friction animation: rods, a cloth, a hanging rod, paper, water and an electroscope','charging by friction',false);
{
  const body=act('experiment','Predict','A third material','');
  createPredict({host:body,q:'Lucas rubs a Perspex rod and finds it repels the hanging acetate rod. What will it do to a hanging polythene rod?',options:[
    {text:'Attract it',correct:true},
    {text:'Repel it as well',why:'It repels acetate, so it has the same charge as acetate: positive. Polythene is negative, so they attract.'},
    {text:'Not move it at all',why:'The Perspex is charged (it repelled the acetate), so it exerts a force on any charged rod.'},
    {text:'You cannot tell yet',why:'You can: there are only two types of charge, so a rod that repels acetate must attract polythene.'}
  ],explain:'The Perspex repels acetate, so it has the same type of charge as acetate (positive). Polythene has the other type, so the Perspex attracts it. Every rubbed insulator behaves like one or the other: there are only two types of charge.'});
}
{
  const body=act('experiment','Multiple choice','The metal rod','');
  createPredict({host:body,q:'Lucas rubs a metal rod while holding it in his hand. It does not move the hanging rod at all. Why?',options:[
    {text:'Charge flows through it and him to earth',correct:true},
    {text:'Metals cannot gain or lose electrons',why:'Metals do gain electrons when rubbed, but they are conductors, so the electrons flow away.'},
    {text:'The metal rod is too heavy to be charged',why:'Mass has nothing to do with it. The metal is a conductor, so the charge does not stay on it.'},
    {text:'Metal only works with a cloth made of metal',why:'The cloth is fine: the problem is that the metal lets the charge flow away through his hand.'}
  ],explain:'Metal is a conductor. Any electrons moved onto it flow through the rod, Lucas’s hand and his body to earth, so it is left uncharged. Held on an insulating handle, a metal rod can be charged.'});
}

/* ================= RESULTS: what the observations show ================= */
{
  const body=act('results','Sort','Does it show the rod is charged?','A rubbed rod is held near each thing. Sort each card by what it shows, then press Check.');
  createSortGame({host:body,cats:[
    {id:'c',label:'Shows the rod is charged',hint:'Either type of charge',color:'--c1',soft:'--c1-soft'},
    {id:'t',label:'Shows which type of charge',hint:'Positive or negative',color:'--c3',soft:'--c3-soft'},
    {id:'n',label:'Shows nothing',hint:'',color:'--c2',soft:'--c2-soft'}
  ],items:[
    {id:'1',text:'Small pieces of paper jump up to the rod',cat:'c'},
    {id:'2',text:'A thin stream of water bends towards the rod',cat:'c'},
    {id:'3',text:'The leaf of an uncharged electroscope rises',cat:'c'},
    {id:'4',text:'A hanging charged polythene rod turns away from it',cat:'t'},
    {id:'5',text:'A negatively charged electroscope’s leaf falls',cat:'t'},
    {id:'6',text:'The rod feels slightly warm after rubbing',cat:'n'},
    {id:'7',text:'The rod looks shiny after rubbing',cat:'n'}
  ]});
}
{
  const body=act('results','Multiple choice','Paper pieces','');
  createPredict({host:body,q:'The pieces of paper are not charged. Why are they attracted to a charged rod held just above them?',options:[
    {text:'It induces an opposite charge nearby',correct:true},
    {text:'The rod pulls on them with a magnetic force',why:'Paper is not magnetic. This is an electrostatic force, between charges.'},
    {text:'Rubbing the rod gave the paper a charge too',why:'The paper was never rubbed. It is uncharged until the rod comes near.'},
    {text:'Gravity pulls them up towards the rod',why:'Gravity pulls them down, towards the Earth. An electrostatic force pulls them up.'}
  ],explain:'The charged rod pushes or pulls electrons in the paper, so the side nearest the rod gets the opposite charge (an induced charge). Unlike charges attract, and the near side is closer than the far side, so the paper is attracted.'});
}
{
  const body=act('results','Predict','A positive rod and water','');
  createPredict({host:body,q:'Ananya holds a positively charged acetate rod near a thin stream of water. What happens?',options:[
    {text:'The stream bends towards the rod',correct:true},
    {text:'The stream bends away from the rod',why:'The rod induces a negative charge on the near side of the water, and unlike charges attract.'},
    {text:'The stream does not move at all',why:'Any charged rod attracts the water, positive or negative.'},
    {text:'It bends only for a negative rod',why:'A negative rod and a positive rod both bend the stream towards them, so this test cannot tell them apart.'}
  ],explain:'Either type of charge induces the opposite charge on the near side of the water, so the stream always bends towards a charged rod. It shows the rod is charged, but not which type of charge it has.'});
}

{
  const body=act('results','Multiple choice','What moves?','');
  createPredict({host:body,q:'An acetate rod becomes positively charged when rubbed with a cloth. What moved?',options:[
    {text:'Electrons, from the rod to the cloth',correct:true},
    {text:'Protons, from the cloth to the rod',why:'Protons are held in the nuclei of the atoms. Only electrons are transferred by rubbing.'},
    {text:'Electrons, from the cloth to the rod',why:'Gaining electrons would make the rod negative, not positive.'},
    {text:'Positive charges, from the cloth to the rod',why:'Positive charges do not move. The rod is positive because it has lost electrons.'}
  ],explain:'Friction transfers electrons. The acetate lost electrons to the cloth, so it is left positive, and the cloth gained them, so it is left negative. Mark schemes reject “protons move” and “positive charge moves”.'});
}
