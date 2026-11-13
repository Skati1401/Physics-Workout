/* ================= YOUR OWN RESULTS TABLE (Do Experiment; 5c rebuild, 13 Nov 2026) =================
   The same helper is copied on the six pages rebuilt together (3.17, 3.19, 3.25P, 3.27P, 5.11P, 5.14P); 1.22 has its own.
   o.cols: the header cells. o.rows: one array per row; a cell is given text, or a box
     {k:key, label:'for screen readers', ok:(v,g)=>true if right, fill:g=>'text', need:[keys]}.
   g(k) is the number in box k once that box is locked (checked right, or filled in), so a box worked out from the
   student's own readings is marked against them; ok() is only asked once every box in need[] is locked.
   Fill in table is always there (Alex, 5 Nov 2026), so a student who cannot read the instrument can still go on.
   o.beside: put the animation frame just above this activity side by side with it (the 1.22 layout). */
function measTable(body,o){
  const wrap=mk('div','table-scroll');body.appendChild(wrap);
  const boxes=[];
  wrap.innerHTML='<table class="units res-tbl mt-tbl"><thead><tr>'+o.cols.map(h=>'<th>'+h+'</th>').join('')+'</tr></thead><tbody>'+
    o.rows.map(r=>'<tr>'+r.map(c=>{if(c&&typeof c==='object'){boxes.push(c);return '<td><input class="calc-num-input" data-k="'+c.k+'" inputmode="decimal" autocomplete="off" aria-label="'+c.label+'"></td>';}return '<td class="given">'+c+'</td>';}).join('')+'</tr>').join('')+'</tbody></table>';
  const inp=k=>$('input[data-k="'+k+'"]',wrap), all=()=>$$('input',wrap);
  const num=e=>{const t=e.value.trim().replace(/[−–]/g,'-').replace(',','.');return /^-?(\d+\.?\d*|\.\d+)$/.test(t)?parseFloat(t):NaN;};
  const g=k=>{const e=inp(k);return e&&e.disabled?num(e):NaN;};
  const ready=c=>(c.need||[]).every(k=>inp(k).disabled);
  const b=bar(body,[{label:'Check table',primary:true,fn:check},{label:'Fill in table',fn:fill},{label:'Clear',fn:reset}]);
  const lock=(e,shown)=>{e.disabled=true;e.classList.remove('is-wrong');e.classList.add(shown?'is-shown':'pop');};
  const changed=()=>{if(o.onChange)try{o.onChange();}catch(e){console.error(e);}};
  const DONE=o.done||'All correct.';
  function check(){
    let ok=0,bad=0,blank=0,wait=0,more=true;
    while(more){more=false;boxes.forEach(c=>{const e=inp(c.k);if(e.disabled||e.value.trim()===''||!ready(c))return;const v=num(e);if(isFinite(v)&&c.ok(v,g)){lock(e,false);more=true;}});}
    boxes.forEach(c=>{const e=inp(c.k);if(e.disabled){ok++;return;}if(e.value.trim()===''){blank++;return;}if(!ready(c)){wait++;return;}bad++;e.classList.add('is-wrong');});
    if(ok===boxes.length){b.say(DONE,'good');celebrate(b.msg);}
    else b.say(ok+' of '+boxes.length+' correct'+(blank?', '+blank+' left blank':'')+'.'+(wait?' '+wait+' wait for the readings they are worked out from.':'')+(bad&&o.hint?' '+o.hint:''),bad?'bad':'');
    changed();
  }
  function fill(){
    boxes.forEach(c=>{const e=inp(c.k);if(e.disabled)return;e.value=c.fill(g);lock(e,true);});
    b.say(o.filled||'Table filled in (dashed). Boxes worked out from your own readings use your values.','');changed();
  }
  function reset(){all().forEach(e=>{e.value='';e.disabled=false;e.classList.remove('is-wrong','is-shown','pop');});b.say('','');changed();}
  all().forEach(e=>e.addEventListener('input',()=>e.classList.remove('is-wrong')));
  if(o.beside){const a=body.closest('.act'),fr=a.previousElementSibling;if(fr&&fr.classList.contains('anim-wrap')){const sp=mk('div','mt-split');fr.parentNode.insertBefore(sp,fr);sp.appendChild(fr);sp.appendChild(a);}}
  track(body,{reset:reset,
    getState:()=>({v:all().map(e=>e.value),ok:all().map(e=>e.disabled),sh:all().map(e=>e.classList.contains('is-shown'))}),
    setState:s=>{reset();all().forEach((e,i)=>{if(!s||!s.v||typeof s.v[i]!=='string')return;e.value=s.v[i];if(s.ok&&s.ok[i]){e.disabled=true;if(s.sh&&s.sh[i])e.classList.add('is-shown');}});if(all().every(e=>e.disabled))b.say(DONE,'good');changed();},
    isDone:()=>all().every(e=>e.disabled)});
  return {g:g,text:k=>{const e=inp(k);return e&&e.disabled?e.value.trim():'';}};
}
// the list beside a Plot shows the student's own values once their table is checked (rowText does the same on each redraw)
function plotLabels(body,fn){$$('.plot-row',body).forEach((li,i)=>{const s=li.firstElementChild;if(s)s.textContent=fn(i);});}
const near=(v,a,t)=>Math.abs(v-a)<=t+1e-9;
const dp=(v,n)=>Number(v).toFixed(n);

/* What you see, chosen from a list (the prism observations): o.rows [{label, ans}], o.options [text…] */
function obsTable(body,o){
  const wrap=mk('div','table-scroll');body.appendChild(wrap);
  wrap.innerHTML='<table class="units res-tbl obs-tbl"><thead><tr><th>'+o.cols[0]+'</th><th>'+o.cols[1]+'</th></tr></thead><tbody>'+
    o.rows.map((r,i)=>'<tr><td class="given">'+r.label+'</td><td><select class="obs-sel" data-i="'+i+'" aria-label="'+r.label+': what you see"><option value="">Choose…</option>'+
      o.options.map(t=>'<option>'+t+'</option>').join('')+'</select></td></tr>').join('')+'</tbody></table>';
  const sels=$$('select',wrap);
  const b=bar(body,[{label:'Check',primary:true,fn:check},{label:'Fill in',fn:fill},{label:'Clear',fn:reset}]);
  const lock=(s,shown)=>{s.disabled=true;s.classList.remove('is-wrong');s.classList.add(shown?'is-shown':'pop');};
  function check(){let ok=0,bad=0,blank=0;
    sels.forEach((s,i)=>{if(s.disabled){ok++;return;}if(!s.value){blank++;return;}if(s.value===o.rows[i].ans){lock(s);ok++;}else{bad++;s.classList.add('is-wrong');}});
    if(ok===sels.length){b.say('All '+ok+' correct.','good');celebrate(b.msg);}
    else b.say(ok+' of '+sels.length+' correct'+(blank?', '+blank+' not chosen':'')+'.'+(bad?' '+o.hint:''),bad?'bad':'');}
  function fill(){sels.forEach((s,i)=>{if(s.disabled)return;s.value=o.rows[i].ans;lock(s,true);});b.say('Filled in (dashed). Try each one in the animation to see it.','');}
  function reset(){sels.forEach(s=>{s.value='';s.disabled=false;s.classList.remove('is-wrong','is-shown','pop');});b.say('','');}
  sels.forEach(s=>s.addEventListener('change',()=>s.classList.remove('is-wrong')));
  if(o.beside){const a=body.closest('.act'),fr=a.previousElementSibling;if(fr&&fr.classList.contains('anim-wrap')){const sp=mk('div','mt-split');fr.parentNode.insertBefore(sp,fr);sp.appendChild(fr);sp.appendChild(a);}}
  track(body,{reset:reset,
    getState:()=>({v:sels.map(s=>s.value),ok:sels.map(s=>s.disabled),sh:sels.map(s=>s.classList.contains('is-shown'))}),
    setState:st=>{reset();sels.forEach((s,i)=>{if(!st||!st.v||typeof st.v[i]!=='string')return;s.value=st.v[i];if(st.ok&&st.ok[i]){s.disabled=true;if(st.sh&&st.sh[i])s.classList.add('is-shown');}});if(sels.every(s=>s.disabled))b.say('All '+sels.length+' correct.','good');},
    isDone:()=>sels.every(s=>s.disabled)});
}

/* ================= VARIABLES ================= */
{
  const body=act('variables','Sort','Which kind of variable is it?','Rose finds the critical angle of a semicircular glass block. Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'i',label:'Independent',hint:'You change it',color:'--c1',soft:'--c1-soft'},
    {id:'d',label:'Dependent',hint:'You measure or observe it',color:'--c2',soft:'--c2-soft'},
    {id:'c',label:'Control',hint:'You keep it the same',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'The angle of incidence in the glass, at the flat face',cat:'i'},
    {id:'2',text:'The angle of refraction in the air',cat:'d'},
    {id:'3',text:'Whether any light leaves the flat face',cat:'d'},
    {id:'4',text:'Using the same glass block every time',cat:'c'},
    {id:'5',text:'The colour of the light',cat:'c'},
    {id:'6',text:'Aiming the ray at the centre of the flat face',cat:'c'}
  ]});
}
{
  const body=act('variables','Multiple choice','A new question to test','');
  createPredict({host:body,q:'Rose wants to find out whether the critical angle is different for red light and violet light. What is her independent variable?',options:[
    {text:'The colour of the light',correct:true},
    {text:'The critical angle of the glass',why:'The critical angle is what she finds for each colour, so it is the dependent variable.'},
    {text:'The angle of incidence in the glass',why:'She turns the ray box to find the critical angle, but what she chooses to change between tests is the colour.'},
    {text:'The glass block that she uses',why:'She must use the same block for both colours, so it is a control variable.'}
  ],explain:'The independent variable is the one she changes on purpose: the colour of the light (a red or a violet filter). She keeps the same block and finds the critical angle for each colour.'});
}

/* ================= METHOD ================= */
{
  const body=act('method','Order','Find the critical angle','Put the steps in the order you would do them. Drag the ≡ handle, or use the ▲▼ buttons.');
  createReorder({host:body,steps:[
    {id:'a',text:'Put the semicircular block on plain paper, draw round it and mark the centre of the flat face.'},
    {id:'b',text:'Draw the normal to the flat face, through its centre.'},
    {id:'c',text:'Shine a narrow ray through the curved side, aimed at the centre of the flat face.'},
    {id:'d',text:'Mark the ray going in, and the ray leaving the flat face, with two crosses each, far apart.'},
    {id:'e',text:'Turn the ray box a little at a time, so the angle in the glass gets bigger, and mark the rays each time.'},
    {id:'f',text:'Find the angle where the ray leaving the flat face just runs along it. Turn a little more: all the light is reflected inside.'},
    {id:'g',text:'Remove the block, join the crosses, and measure each angle in the glass from the normal with a protractor.'}
  ],constraints:[['a','b'],['a','c'],['c','d'],['d','e'],['e','f'],['f','g'],['b','g']],
  why:'Draw round the block and mark the centre first, so the ray can be aimed there and the block put back. Mark the rays as you go; the angles are measured once the block is removed and the crosses are joined.'});
}
{
  const body=act('method','Multiple choice','Aim at the centre','');
  createPredict({host:body,q:'Why must the ray be aimed through the curved side at the centre of the flat face?',options:[
    {text:'It travels along a radius, so it does not bend going in',correct:true},
    {text:'It reflects off the curved side, back towards the centre',why:'The ray goes through the curved side. Along a radius it meets that side along the normal.'},
    {text:'So that the angle at the flat face is always 90°',why:'The angle at the flat face changes as you turn the ray box. That is what you measure.'},
    {text:'The centre of the flat face is the brightest part',why:'Brightness has nothing to do with it. It is about where the ray bends.'}
  ],explain:'A radius meets a circle at 90°, so the ray meets the curved side along the normal and does not bend. All the bending then happens at the flat face, where you measure the angles.'});
}

/* ================= ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Better results or safer?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'Better results',hint:'More accurate angles',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps people safe',hint:'Protects people and equipment',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Mark the crosses on each ray far apart',cat:'a'},
    {id:'2',text:'Use a narrow ray from a single slit',cat:'a'},
    {id:'3',text:'Near the critical angle, turn the ray box 1° at a time',cat:'a'},
    {id:'4',text:'Dim the room, so the faint ray along the flat face shows up',cat:'a'},
    {id:'5',text:'Do not touch the ray box: it gets hot',cat:'s'},
    {id:'6',text:'Never look along a laser beam',cat:'s'},
    {id:'7',text:'Handle the glass block carefully: chipped edges are sharp',cat:'s'}
  ]});
}
{
  const body=act('accuracy','Multiple choice','Crosses far apart','');
  createPredict({host:body,q:'Why should the two crosses on each ray be far apart?',options:[
    {text:'A small slip in a cross changes the angle less',correct:true},
    {text:'So that the ray looks brighter on the white paper',why:'Where you put the crosses does not change the light.'},
    {text:'So that the protractor fits in between the crosses',why:'The protractor goes on the normal, where the ray meets the flat face.'},
    {text:'So that the light does not reflect off the pencil',why:'The pencil marks do not affect the light.'}
  ],explain:'Each cross can be off by a millimetre or so. With the crosses far apart, that error turns the line through a much smaller angle, so the angles you measure are more accurate.'});
}
{
  const body=act('accuracy','Multiple choice','Measured from the surface','');
  createPredict({host:body,q:'Sophie measures 50° between the ray in the glass and the flat face. What is the angle of incidence?',options:[
    {text:'40°, because it is measured from the normal',correct:true},
    {text:'50°, because that is the angle she measured',why:'She measured from the surface. Angles of incidence are measured from the normal.'},
    {text:'130°, the angle on the other side of the ray',why:'An angle of incidence is never more than 90°.'},
    {text:'90°, because the normal is at 90° to the surface',why:'90° is the angle between the normal and the surface, not the ray.'}
  ],explain:'The normal is at 90° to the surface, so i = 90° − 50° = 40°.'});
}

/* ================= DO THE EXPERIMENT ================= */
// The student traces each ray in the animation's measure mode and reads the protractor close-up.
// RF_AIR must match animations/refraction.html (measure mode, semicircle, ray in through the curved side, n = 1.50):
// tools/CORE-PRACTICALS.md, "Measure modes", 3.17: 10 → 15, 20 → 31, 30 → 49, 35 → 59, 40 → 75, 41 → 80; none from 42°.
const RF_GLASS=[10,20,30,35,40,41], RF_AIR=[15,31,49,59,75,80];
{
  act('do','Your turn','Find the critical angle','The ray box shines through the curved side of a semicircular block, at the centre of the flat face. Turn it until the protractor reads 10° in the glass, press Trace the ray, and read the angle of the ray in the air. Do the same for each angle in your table. Then go up 1° at a time until no ray leaves the flat face.');
}
frameAct('do','animations/refraction.html','measure&block=semi&entry=curved','Refraction experiment: trace the ray through a semicircular block and read the protractor','refraction of light',false);
{
  const body=act('do','Calculate','Your results table','Write each angle in the air to the nearest degree, then press Check.');
  measTable(body,{beside:true,cols:['Angle in the glass (°)','Angle in the air (°)'],
    rows:RF_GLASS.map((a,i)=>[a,{k:'a'+i,label:'Angle in the air when the angle in the glass is '+a+'°',ok:v=>near(v,RF_AIR[i],1),fill:()=>String(RF_AIR[i])}]),
    hint:'Read the orange line (the ray in the air) on the protractor, from 0° at the normal.',
    done:'All correct. Now find the angle at which no ray leaves the flat face.'});
}
{
  const body=act('do','Calculate','The critical angle','Use your readings, and the animation.');
  createCalc({host:body,questions:[
    {q:'Go up 1° at a time from 41°. At what angle in the glass does no ray leave the flat face?',unit:'°',answer:42,working:'At 41° the ray leaves at 80° to the normal, close to the flat face.<br>At 42° no ray leaves: all the light is reflected inside.'},
    {q:FR('The critical angle is between 41° and 42°. Take c = 41.5° and use sin c = [[1|n]] to find the refractive index of the glass.'),unit:'',answer:1.51,working:'sin c = [[1|n]]<br>sin 41.5° = [[1|n]]<br>0.6626 = [[1|n]]<br>n = [[1|0.6626]]<br>n = 1.51'}
  ]});
}
{
  const body=act('do','Predict','Reading your results','');
  createPredict({host:body,q:'Use your table. As the angle in the glass goes up from 35° to 41°, what happens to the angle in the air?',options:[
    {text:'It rises quickly towards 90°, along the flat face',correct:true},
    {text:'It rises by the same amount for each degree',why:'From 10° to 20° in the glass it rises 16°, but from 40° to 41° it rises 5° for just one degree. It is not steady.'},
    {text:'It stays a little bigger than the angle in the glass',why:'Near the critical angle it is much bigger: 80° in the air for 41° in the glass.'},
    {text:'It gets smaller, as the light is reflected',why:'Up to 41° the ray still leaves the flat face, and its angle keeps getting bigger.'}
  ],explain:'Going from glass into air the ray bends away from the normal. Near the critical angle the angle in the air shoots up towards 90°: at the critical angle the ray runs along the flat face, and above it there is no refracted ray at all (total internal reflection).'});
}
{
  act('do','Your turn','Now the prisms','Choose the 60° prism, then the 45° prism. For each line of the table, set up the ray as it says, press Trace the ray, and choose what you see.');
}
frameAct('do','animations/refraction.html','measure','Refraction experiment: trace the ray through a triangular prism','refraction of light',false);
{
  const body=act('do','Record','What happens in the prism?','Choose what you see for each set-up, then press Check.');
  obsTable(body,{beside:true,cols:['Set-up','What you see'],
    options:['Refracted out of the second face','Totally internally reflected inside','Spreads out into colours','Turned through 90°','Turned back through 180°'],
    rows:[
      {label:'60° prism, one colour, ray in at about 50° to the normal',ans:'Refracted out of the second face'},
      {label:'60° prism, one colour, ray in at about 20° to the normal',ans:'Totally internally reflected inside'},
      {label:'60° prism, white light, ray in at about 50° to the normal',ans:'Spreads out into colours'},
      {label:'45° prism, ray in through a short side, along the normal',ans:'Turned through 90°'},
      {label:'45° prism, ray in through the long side, along the normal',ans:'Turned back through 180°'}
    ],hint:'Set each one up in the animation and trace the ray: look at what it does at the second face.'});
}

/* ================= SHOW: the readings taken for you ================= */
{
  act('experiment','Your turn','Watch the experiment','Press Experiment. Choose the semicircular block, ray in through the curved side, and find the critical angle to within 2°. Then trace the ray through the 60° prism, with one colour and with white light, and through both sides of the 45° prism. What happens at the second face each time, and which colour is refracted most?');
}
frameAct('experiment','animations/refraction.html','','Refraction of light animation: a ray box, a glass block or prism, and a protractor','refraction of light',false);
{
  const body=act('experiment','Sort','Which block showed it?','Sort each observation by the block or prism that shows it best, then press Check.');
  createSortGame({host:body,cats:[
    {id:'r',label:'Rectangular block',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Semicircular block',color:'--c2',soft:'--c2-soft'},
    {id:'p',label:'Triangular prism',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'The ray comes out parallel to the ray going in',cat:'r'},
    {id:'2',text:'The ray comes out shifted sideways, but not turned',cat:'r'},
    {id:'3',text:'Above one angle, no light leaves the flat face',cat:'s'},
    {id:'4',text:'A ray along a radius does not bend where it goes in',cat:'s'},
    {id:'5',text:'White light spreads out into a spectrum',cat:'p'},
    {id:'6',text:'A ray is turned through 90° by total internal reflection',cat:'p'}
  ]});
}
{
  const body=act('experiment','Predict','The ray stops coming out','');
  createPredict({host:body,q:'Lucas makes the angle of incidence smaller at the first face of the 60° prism. Below about 28°, no light comes out of the second face. Why?',options:[
    {text:'Its angle at the second face is above c',correct:true},
    {text:'The glass absorbs light at small angles',why:'Glass absorbs very little light. The light is still there: it reflects inside the prism.'},
    {text:'It reflects off the first face instead',why:'Most of the light still goes in at the first face. The change is at the second face.'},
    {text:'Light cannot be refracted at two faces',why:'At bigger angles of incidence it is refracted at both faces.'}
  ],explain:'Turning the ray at the first face changes the angle at which it meets the second face. Below about 28° at the first face, it meets the second face at more than the critical angle (about 42°), so it is totally internally reflected.'});
}

/* ================= RESULTS: what the observations show ================= */
{
  const body=act('results','Multiple choice','The critical angle','');
  createPredict({host:body,q:'What is the critical angle?',options:[
    {text:'The angle of incidence in the glass that gives an angle of refraction of 90°',correct:true},
    {text:'The angle between the ray and the surface when light first goes into the glass',why:'Angles are measured from the normal, and the critical angle is for light inside the glass, going out.'},
    {text:'The angle of incidence at which all of the light is refracted out of the glass',why:'It is the other way round: above the critical angle, none of the light is refracted out.'},
    {text:'The biggest angle of incidence that a ray box can make with the flat face',why:'A ray box can be turned to any angle. The critical angle depends on the glass.'}
  ],explain:'At the critical angle the refracted ray runs along the surface (angle of refraction 90°). Above it, there is total internal reflection.'});
}
{
  const body=act('results','Multiple choice','When does it happen?','');
  createPredict({host:body,q:'Which two conditions give total internal reflection?',options:[
    {text:'Glass to air, with i bigger than c',correct:true},
    {text:'Air to glass, with i bigger than c',why:'Going into glass the light slows down and can always get in. It must be going from glass to air.'},
    {text:'Glass to air, with i smaller than c',why:'Below the critical angle most of the light refracts out.'},
    {text:'Air to glass, with i smaller than c',why:'That is ordinary refraction into the glass.'}
  ],explain:'Total internal reflection needs light going from a material with a higher refractive index to a lower one (glass to air), with an angle of incidence bigger than the critical angle.'});
}
{
  const body=act('results','Predict','Red and violet light','');
  createPredict({host:body,q:'Rose aims red light, then violet light, at the flat face of the semicircular block, both at 41.5° in the glass. For red light (n = 1.49) a ray leaves the flat face. What happens to the violet light (n = 1.53)?',options:[
    {text:'Total internal reflection: its c is smaller',correct:true},
    {text:'It leaves the flat face, bent less than red',why:'Violet has the bigger refractive index, so it is bent more, not less, and its critical angle is smaller.'},
    {text:'It leaves at the same angle as the red light',why:'Different refractive indices mean different angles, and here different critical angles.'},
    {text:'The glass absorbs it, so no ray is seen',why:'Glass absorbs very little light. The violet light is reflected inside the block.'}
  ],explain:'sin c = [[1|n]], so a bigger refractive index gives a smaller critical angle: about 42.2° for red and 40.8° for violet. At 41.5° the red light is still below its critical angle and refracts out, but the violet light is above its critical angle and is totally internally reflected.'});
}
{
  const body=act('results','Multiple choice','A 45° prism','');
  createPredict({host:body,q:'A ray goes into a short side of a 45° prism along the normal. What happens when it meets the long side?',options:[
    {text:'Total internal reflection: 45° is more than 42°',correct:true},
    {text:'It refracts out into the air: 45° is less than 90°',why:'Compare the angle with the critical angle (about 42°), not with 90°.'},
    {text:'It passes straight out through the long side',why:'It meets the long side at 45°, not along the normal.'},
    {text:'Half of it reflects and half of it refracts out',why:'Above the critical angle there is no refracted ray at all.'}
  ],explain:'The ray meets the long side at 45°. For glass the critical angle is about 42°, so all the light is reflected and the ray turns through 90°. Two such prisms make a periscope.'});
}
