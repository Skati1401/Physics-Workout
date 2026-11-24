/* ================= Simple harmonic motion (TODO 6c, 24 Nov 2026) =================
   One source, two pages: tools/shm/page.html + content.js are built by tools/shm/build.py into
   simple-harmonic-motion.html (IB C.1, LV 'ib') and simple-harmonic-motion-ial.html (IAL 143 to 147 and 150, LV 'ial').
   Edit the source, never the built pages. Every frame is animations/simple-harmonic-motion.html with its level and view
   (?graph=ax|xva|et, ?circle, ?show=exp).
   Question kinds from the IAL Past Paper Index (WPH15, WPH05, 9PH0/02 and 9PH0/03) and the IB Physics Question Index (C.1).
   Model answers worded from the mark schemes: IAL WPH15 October 2020 Q20, January 2021 Q13 and Q18, June 2021 Q14 and Q17,
   October 2023 Q20; IB P2 HL May 2017 TZ1 Q7, November 2020 Q7. No question or its data is copied from a paper, and the
   numbers avoid the animation's own (200 g on 20 N m⁻¹).
   IAL: A, stiffness, x = A cos ωt, v = −Aω sin ωt, g = 9.81 N kg⁻¹. IB: x₀, spring constant, a = −ω²x and T = 2π/ω at SL;
   x = x₀ sin(ωt + ϕ), v = ±ω√(x₀² − x²) and E_T = ½mω²x₀² at HL only (the guide: energy is quantitative at HL only). */
const LV='%%LV%%',IB=LV==='ib';
const ANIM='animations/simple-harmonic-motion.html',LQ='&level='+LV;
const HLB='<b class="ta" title="Higher level only">HL</b>';
const AM=IB?'x₀':'A',KN=IB?'spring constant':'stiffness',G=IB?9.8:9.81,GS=IB?'9.8':'9.81';
const R3=x=>+(+x).toPrecision(3),R4=x=>+(+x).toPrecision(4);
const g2=x=>Number(x).toPrecision(2),c3=x=>calcNum(R3(x)),c4=x=>calcNum(R4(x));
const wk=(g,st)=>g.join('<br>')+'||'+st.join('<br>');
const fr=(a,b)=>'<span class="frac"><span>'+a+'</span><span>'+b+'</span></span>';
const RT=s=>'<span class="rtw">√<span class="rt">'+s+'</span></span>';
const TS='T = 2π'+RT(fr('m','k')),TP='T = 2π'+RT(fr('l','g'));
const PI2='2π';
// a small sketch of a quantity against time over one period: f(θ) in −1..1 (or 0..1 with pos)
const skPath=(f,pos)=>{let d='';for(let i=0;i<=60;i++){const th=i/60*2*Math.PI,x=18+i/60*126,y=pos?70-58*f(th):38-28*f(th);d+=(i?'L':'M')+x.toFixed(1)+','+y.toFixed(1);}return d;};
const sk=(f,lab,pos,cls)=>'<svg class="'+(cls||'sk')+'" viewBox="0,0,150,82" aria-hidden="true"><path d="M16,4V76M16,'+(pos?70:38)+'H146" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="'+skPath(f,pos)+'" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round"/><text x="3" y="11" class="sk-t">'+lab+'</text><text x="139" y="'+(pos?80:50)+'" class="sk-t">t</text></svg>';
// against displacement, from −A to +A
const skxPath=f=>{let d='';for(let i=0;i<=60;i++){const u=-1+i/30,x=20+i/60*120,y=70-56*f(u);d+=(i?'L':'M')+x.toFixed(1)+','+y.toFixed(1);}return d;};
const skx=f=>'<svg class="sk" viewBox="0,0,150,82" aria-hidden="true"><path d="M80,4V70M14,70H146" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="'+skxPath(f)+'" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round"/><text x="84" y="11" class="sk-t">E<tspan dy="2" font-size="8">k</tspan></text><text x="6" y="80" class="sk-t">−'+AM+'</text><text x="132" y="80" class="sk-t">+'+AM+'</text><text x="77" y="80" class="sk-t">0</text></svg>';
const S=Math.sin,C=Math.cos;
const sketchQs=panel=>$$('#panel-'+panel+' .qc-item').forEach(b=>{if(b.querySelector('.pred-opt svg'))b.classList.add('qc-sketch');});
const SHMDEF=IB?'the acceleration (or restoring force) is proportional to the displacement from the equilibrium position, and in the opposite direction to it (directed towards the equilibrium position)'
  :'the resultant force is proportional to the displacement from the equilibrium position, and always acting towards the equilibrium position';

/* ================= 1. WARM UP ================= */
{
  createPredict({host:act('overview','Predict','Pull it further','A mass on a spring bobs up and down with a period of 0.50 s after it is pulled down 2 cm and let go.'),
    q:'It is pulled down 4 cm instead and let go. What is the period now?',
    options:[
      {text:'0.50 s: the period stays the same',correct:true},
      {text:'1.00 s: it has twice as far to go',why:'It does have twice as far to go, but the force on it is twice as big at each point too, so it moves twice as fast. The two cancel out.'},
      {text:'0.25 s: the bigger force makes it quicker',why:'The force is twice as big, but the distance is twice as far too, so the time is the same.'},
      {text:'A little more than 0.50 s',why:'For a spring that obeys Hooke’s law the period does not change with the amplitude at all, not even a little.'}
    ],
    explain:'Pulled twice as far, the mass has twice as far to go, but the resultant force on it is twice as big at every point, so it moves twice as fast. In simple harmonic motion the period does not depend on the amplitude.'});
  goalsAct('overview',IB?[
    {t:'State the conditions for simple harmonic motion and explain the minus sign in a = −ω²x',sp:'C.1'},
    {t:'Draw and read displacement, velocity and acceleration graphs against time',sp:'C.1'},
    {t:'Use T = [[1|f]] = [[2π|ω]] and a = −ω²x; '+HLB+' use phase angle, x = x₀ sin (ωt + ϕ) and v = ±ω√(x₀² − x²)',sp:'C.1'},
    {t:'Use T = 2π√(m/k) for a mass on a spring and T = 2π√(l/g) for a pendulum',sp:'C.1'},
    {t:'Describe the energy changes in one cycle; '+HLB+' calculate them with E<sub>T</sub> = ½mω²x₀²',sp:'C.1'}
  ]:[
    {t:'State the condition for simple harmonic motion, F = −kx, and decide whether a motion is SHM',sp:'143'},
    {t:'Draw and interpret displacement–time and velocity–time graphs, using their gradients',sp:'146, 147'},
    {t:'Use a = −ω²x, x = A cos ωt, v = −Aω sin ωt and ω = 2πf = [[2π|T]]',sp:'144'},
    {t:'Use T = 2π√(m/k) for a mass on a spring and T = 2π√(l/g) for a simple pendulum',sp:'145'},
    {t:'Apply conservation of energy to an undamped oscillator',sp:'150'}
  ]);
  pairFirstTwo('overview');
}
$$('#panel-overview .goals li').forEach(li=>{li.innerHTML=FR(li.innerHTML);});

/* ================= 2. THE SHM CONDITION ================= */
exploreFrameQ('condition','Force and acceleration against displacement','Drag the mass down and let it go, then try the <b>Pendulum</b>. The graph plots the acceleration against the displacement: a straight line through the origin with a negative gradient, −ω². Watch which way the arrows point on each side of the equilibrium position.',
  ANIM,'graph=ax'+LQ,'Simple harmonic motion animation: a mass on a spring with a graph of acceleration against displacement','simple harmonic motion');
createSortGame({host:act('condition','Sort','Simple harmonic motion or not?',IB?'Is the restoring force proportional to the displacement and directed towards the equilibrium position? Drag each card into the right bin.':'Is the resultant force proportional to the displacement and always towards the equilibrium position? Drag each card into the right bin.'),
  cats:[{id:'y',label:'Simple harmonic motion',color:'--good',soft:'--good-soft'},{id:'n',label:'Not simple harmonic',color:'--accent',soft:'--accent-soft'}],
  items:[
    {id:'a',cat:'y',text:'A mass on a spring that obeys Hooke’s law, pulled down and released'},
    {id:'b',cat:'y',text:'A simple pendulum swinging through a small angle'},
    {id:'c',cat:'y',text:'A test tube floating upright in water, pushed down and let go'},
    {id:'d',cat:'y',text:'A trolley joined between two stretched springs, pulled aside and released'},
    {id:'e',cat:'n',text:'A ball bouncing on the floor, losing no energy'},
    {id:'f',cat:'n',text:'A marble rolling to and fro in a V-shaped groove'},
    {id:'g',cat:'n',text:'A child bouncing so high that she leaves the trampoline'},
    {id:'h',cat:'n',text:'A pendulum let go with its string horizontal'}
  ]});
quickCheck('condition','The condition',[
  {title:'The minus sign',q:IB?'What does the minus sign in a = −ω²x tell you?':'What does the minus sign in F = −kx tell you?',
    options:[{text:IB?'The acceleration is always in the opposite direction to the displacement':'The force is always in the opposite direction to the displacement',correct:true},
      {text:IB?'The acceleration gets smaller as the displacement increases':'The force gets smaller as the displacement increases',why:'The size is proportional to x, so it gets larger as x increases. The sign tells you the direction.'},
      {text:'The oscillation loses energy as it goes',why:'Losing energy is damping. The minus sign is about direction: towards the equilibrium position, whichever side the object is on.'},
      {text:'The displacement is always negative',why:'The displacement is positive on one side of the equilibrium position and negative on the other. The minus sign makes '+(IB?'a':'F')+' the opposite sign to x.'}],
    explain:(IB?'The acceleration (and the restoring force)':'The force')+' is in the opposite direction to the displacement, so it always acts towards the equilibrium position. That is what pulls the object back and keeps it oscillating.'},
  {title:'Which way?',q:'A mass oscillates up and down on a spring. It is above the equilibrium position and moving upwards. Which way is the resultant force on it?',
    options:[{text:'Downwards',correct:true},
      {text:'Upwards',why:'It is moving upwards, but the force is towards the equilibrium position, which is below it. The mass is slowing down.'},
      {text:'There is no resultant force',why:'The resultant force is zero only at the equilibrium position. Anywhere else it pulls back towards it.'},
      {text:'It depends how fast it is moving',why:'In SHM the force depends only on the displacement, F = −kx, not on the velocity.'}],
    explain:'The resultant force always acts towards the equilibrium position. Above it, that is downwards, so the mass slows down, stops at the top and comes back.'}
]);
pairActs('condition',1,2);

/* ================= 3. GRAPHS ================= */
exploreFrameQ('graphs','Displacement, velocity and acceleration','Press <b>Play</b> and watch the three graphs on one time axis. The tangent on each graph shows its gradient, which is the value on the graph below: velocity is the gradient of the displacement–time graph, and acceleration is the gradient of the velocity–time graph.',
  ANIM,'graph=xva'+LQ,'Simple harmonic motion animation: displacement, velocity and acceleration against time','simple harmonic motion');
quickCheck('graphs','From one graph to another',[
  {title:'From displacement',ctx:'The displacement–time graph:'+sk(C,'x',0,'sk sk-in'),q:'Which graph shows the velocity against time?',
    options:[{text:sk(t=>-S(t),'v'),correct:true},
      {text:sk(S,'v'),why:'The sign is the wrong way round: just after t = 0 the displacement is falling, so the gradient, the velocity, is negative.'},
      {text:sk(C,'v'),why:'That has the shape of the displacement graph. The velocity is the gradient of the displacement–time graph, which is zero where the displacement is a maximum.'},
      {text:sk(t=>-C(t),'v'),why:'That is the shape of the acceleration graph, a = −ω²x, not the velocity.'}],
    explain:'Velocity is the gradient of the displacement–time graph. At t = 0 the displacement is a maximum, so the gradient is zero; then the displacement falls, so the velocity is negative. Same period, same shape, a quarter of a cycle out of step.'},
  {title:'From acceleration',ctx:'The acceleration–time graph:'+sk(S,'a',0,'sk sk-in'),q:'Which graph shows the velocity against time?',
    options:[{text:sk(t=>-C(t),'v'),correct:true},
      {text:sk(C,'v'),why:'Acceleration is the gradient of the velocity–time graph. Just after t = 0 the acceleration is positive, so the velocity must be rising, here from its most negative value.'},
      {text:sk(S,'v'),why:'That is the acceleration graph again. The velocity is a quarter of a cycle out of step with the acceleration.'},
      {text:sk(t=>-S(t),'v'),why:'That is the shape of the displacement graph: a = −ω²x, so x is the acceleration graph upside down.'}],
    explain:'The acceleration is the gradient of the velocity–time graph. At t = 0 the acceleration is zero, so the velocity is at a maximum or a minimum; the acceleration is then positive, so the velocity is at its minimum (most negative) and rising.'},
  {title:'From velocity',ctx:'The velocity–time graph:'+sk(C,'v',0,'sk sk-in'),q:'Which graph shows the displacement against time?',
    options:[{text:sk(S,'x'),correct:true},
      {text:sk(t=>-S(t),'x'),why:'At t = 0 the velocity is positive, so the displacement must be increasing, not decreasing.'},
      {text:sk(C,'x'),why:'If the displacement were a maximum at t = 0, the velocity there would be zero. Here it is a maximum.'},
      {text:sk(t=>-C(t),'x'),why:'At t = 0 the speed is a maximum, so the object is passing through the equilibrium position: x = 0, not a maximum.'}],
    explain:'At t = 0 the velocity is a positive maximum, so the object is passing through the equilibrium position in the positive direction: x = 0 and increasing. The gradient of this displacement–time graph is the velocity graph.'}
]);
sketchQs('graphs');
createSortGame({host:act('graphs','Sort','Where is it?','An object is moving with simple harmonic motion. Where is each statement true? Drag each card into the right bin.'),
  cats:[{id:'e',label:'At the equilibrium position',color:'--good',soft:'--good-soft'},{id:'m',label:'At maximum displacement',color:'--accent',soft:'--accent-soft'}],
  items:[
    {id:'a',cat:'e',text:'The speed is a maximum'},
    {id:'b',cat:'e',text:'The acceleration is zero'},
    {id:'c',cat:'e',text:'The kinetic energy is a maximum'},
    {id:'d',cat:'e',text:'The gradient of the displacement–time graph is steepest'},
    {id:'e',cat:'m',text:'The object is momentarily at rest'},
    {id:'f',cat:'m',text:'The acceleration has its greatest magnitude'},
    {id:'g',cat:'m',text:'The potential energy is a maximum'},
    {id:'h',cat:'m',text:'The gradient of the velocity–time graph is steepest'}
  ]});
pairActs('graphs',1,2);

/* ================= 4. SHM EQUATIONS ================= */
exploreFrameQ('equations','The reference circle','Press <b>Play</b>. The point goes round the circle at angular speed ω, one turn per period, and its shadow moves exactly like the oscillator. '+(IB?'At HL, read the phase angle ϕ on the circle.':'The angle it has turned through is ωt, so x = A cos ωt.'),
  ANIM,'circle'+LQ,'Simple harmonic motion animation with a reference circle: a point going round at angular speed ω whose shadow is the motion','simple harmonic motion');
quickCheck('equations','The equations',IB?[
  {title:'Twice the frequency',q:'An oscillator’s frequency is doubled and its amplitude kept the same. What happens to its maximum acceleration?',
    options:[{text:'It becomes four times as big',correct:true},
      {text:'It doubles',why:'The maximum acceleration is ω²x₀. Doubling f doubles ω, and ω is squared: 2² = 4.'},
      {text:'It stays the same',why:'The amplitude is the same, but a = −ω²x depends on ω² as well.'},
      {text:'It halves',why:'The period halves, but the acceleration goes up: a = −ω²x with ω twice as big.'}],
    explain:'ω = 2πf, so doubling f doubles ω. The maximum acceleration is ω²x₀, so it becomes 2² = 4 times as big.'},
  {title:'Phase angle (HL)',q:'A mass is let go from rest at x = +x₀ when t = 0. Which phase angle ϕ makes x = x₀ sin (ωt + ϕ) fit its motion?',
    options:[{text:'[[π|2]] rad',correct:true},
      {text:'0',why:'With ϕ = 0, x = x₀ sin 0 = 0 at t = 0: that oscillator passes through equilibrium at t = 0.'},
      {text:'π rad',why:'sin π = 0, so x = 0 at t = 0, and the object is moving in the negative direction.'},
      {text:'[[3π|2]] rad',why:'sin [[3π|2]] = −1, so that oscillator starts at x = −x₀.'}],
    explain:'At t = 0, x = x₀ sin ϕ = x₀, so sin ϕ = 1 and ϕ = [[π|2]] rad. Then x = x₀ sin (ωt + [[π|2]]) = x₀ cos ωt. Phase angles are in radians.'}
]:[
  {title:'Twice the frequency',q:'A mass on a spring oscillates with the same amplitude, but at twice the frequency. Which quantity doubles?',
    options:[{text:'Its maximum speed',correct:true},
      {text:'Its maximum acceleration',why:'The maximum acceleration is Aω². Doubling f doubles ω, and ω is squared, so the acceleration becomes four times as big.'},
      {text:'Its period',why:'T = [[1|f]], so doubling the frequency halves the period.'},
      {text:'Its amplitude',why:'The question keeps the amplitude the same.'}],
    explain:'The maximum speed is Aω and ω = 2πf, so doubling f doubles the maximum speed. The maximum acceleration, Aω², becomes four times as big.'},
  {title:'Angular frequency',q:'A drone hovering in gusty wind bobs up and down 45 times in 30 s. What is the angular frequency ω of its oscillation?',
    options:[{text:'9.4 rad s⁻¹',correct:true},
      {text:'1.5 rad s⁻¹',why:'1.5 Hz is the frequency f. The angular frequency is ω = 2πf.'},
      {text:'4.2 rad s⁻¹',why:'That is [[2π|f]]. The angular frequency is ω = 2πf, or [[2π|T]].'},
      {text:'0.67 rad s⁻¹',why:'0.67 s is the period T. The angular frequency is ω = [[2π|T]].'}],
    explain:'f = [[45|30 s]] = 1.5 Hz, so ω = 2πf = 2π × 1.5 = 9.4 rad s⁻¹.'}
]);
// Q1: a rearrangement. IAL: A from v_max and f, or f from a_max and A. IB (SL): T from the acceleration at a displacement.
const eq_q1=rnd=>{
  if(IB){
    const c=calcPick(rnd,['the tip of a robot’s vibrating gripper','a Mars rover’s whip antenna','a small sensor on a spring inside a space probe','the cone of a loudspeaker']);
    const x=calcPick(rnd,[1.5,2.0,2.5,3.0,4.0]),a=calcPick(rnd,[3.6,4.8,6.2,7.5,9.0]),xm=x/100,w2=R4(a/xm),w=R4(Math.sqrt(a/xm)),T=R3(2*Math.PI/w);
    return {q:'When '+c+' is '+x.toFixed(1)+' cm from its equilibrium position, its acceleration is '+a.toFixed(1)+' m s⁻² towards the equilibrium position. Calculate the period of its simple harmonic motion.',unit:'s',answer:T,
      hints:['a = −ω²x: the minus sign only gives the direction, so use ω² = [[a|x]] with x in metres.','Then T = [[2π|ω]].'],
      working:wk(['x = '+x.toFixed(1)+' cm = '+calcNum(xm)+' m','a = '+a.toFixed(1)+' m s⁻²','T = ?'],
        ['a = −ω²x',a.toFixed(1)+' = ω² × '+calcNum(xm),'ω² = [['+a.toFixed(1)+'|'+calcNum(xm)+']]','ω² = '+c4(w2)+' s⁻²','ω = '+c4(w)+' rad s⁻¹','T = [[2π|ω]]','T = [[2π|'+c4(w)+']]','T = '+c3(T)+' s'])};
  }
  if(rnd()<0.5){
    const c=calcPick(rnd,['The wing tip of a hummingbird','The cone of a small loudspeaker','The prong of a tuning fork','The tip of a drone’s vibrating rotor arm']);
    const f=calcPick(rnd,[40,55,64,75,120]),v=calcPick(rnd,[0.85,1.2,1.6,2.4]),w=R4(2*Math.PI*f),A=R3(v/w*1000);
    return {q:c+' moves with simple harmonic motion at '+f+' Hz. Its maximum speed is '+g2(v)+' m s⁻¹. Calculate the amplitude, in mm.',unit:'mm',answer:A,
      hints:['v = −Aω sin ωt, and the speed is a maximum when sin ωt = ±1, so v<sub>max</sub> = Aω.','ω = 2πf.'],
      working:wk(['f = '+f+' Hz','v<sub>max</sub> = '+g2(v)+' m s⁻¹','A = ?'],
        ['ω = 2πf','ω = 2π × '+f,'ω = '+c4(w)+' rad s⁻¹','v<sub>max</sub> = Aω',g2(v)+' = A × '+c4(w),'A = [['+g2(v)+'|'+c4(w)+']]','A = '+c3(A/1000)+' m','A = '+c3(A)+' mm'])};
  }
  const c=calcPick(rnd,['A bungee jumper bouncing at the bottom of her jump','A ship’s deck rising and falling on a swell','A deep-sea diver’s marker buoy bobbing on a swell']);
  const A=calcPick(rnd,[0.40,0.65,0.80,1.2]),a=calcPick(rnd,[2.5,3.8,5.0,6.4]),w2=R4(a/A),w=R4(Math.sqrt(a/A)),f=R3(w/(2*Math.PI));
  return {q:c+' oscillates with simple harmonic motion of amplitude '+g2(A)+' m. Its maximum acceleration is '+g2(a)+' m s⁻². Calculate the frequency.',unit:'Hz',answer:f,
    hints:['a = −ω²x: the acceleration is greatest at x = A, so a<sub>max</sub> = Aω².','f = [[ω|2π]].'],
    working:wk(['A = '+g2(A)+' m','a<sub>max</sub> = '+g2(a)+' m s⁻²','f = ?'],
      ['a = −ω²x',g2(a)+' = ω² × '+g2(A),'ω² = [['+g2(a)+'|'+g2(A)+']]','ω² = '+c4(w2)+' s⁻²','ω = '+c4(w)+' rad s⁻¹','ω = 2πf','f = [['+c4(w)+'|2π]]','f = '+c3(f)+' Hz'])};
};
// Q2: harder. IAL: a_max from a count per minute and mm; speed at a time t (radians). IB (HL): v at x; x at t.
const eq_q2=rnd=>{
  const v=rnd();
  if(IB){
    if(v<0.5){
      const c=calcPick(rnd,['A mass on a spring','A buoy bobbing on calm waves','A sensor on a spring mount in a space probe']);
      const f=calcPick(rnd,[1.5,2.0,2.4,3.2]),x0=calcPick(rnd,[4.0,5.0,6.0,8.0]),x=calcPick(rnd,[1.5,2.5,3.0]),w=R4(2*Math.PI*f),r=R4(Math.sqrt((x0/100)**2-(x/100)**2)),sp=R3(w*r);
      return {q:HLB+' '+c+' oscillates with simple harmonic motion of frequency '+f.toFixed(1)+' Hz and amplitude '+x0.toFixed(1)+' cm. Calculate its speed when its displacement is '+x.toFixed(1)+' cm.',unit:'m s⁻¹',answer:sp,
        hints:['v = ±ω√(x₀² − x²), with ω = 2πf and the distances in metres.'],
        working:wk(['f = '+f.toFixed(1)+' Hz','x₀ = '+x0.toFixed(1)+' cm = '+calcNum(x0/100)+' m','x = '+x.toFixed(1)+' cm = '+calcNum(x/100)+' m','v = ?'],
          ['ω = 2πf','ω = 2π × '+f.toFixed(1),'ω = '+c4(w)+' rad s⁻¹','v = ±ω'+RT('x₀² − x²'),'v = '+c4(w)+' × '+RT(calcNum(x0/100)+'² − '+calcNum(x/100)+'²'),'v = '+c4(w)+' × '+c4(r),'v = '+c3(sp)+' m s⁻¹'])};
    }
    const T=calcPick(rnd,[0.80,1.2,1.6,2.0]),x0=calcPick(rnd,[3.0,4.0,5.0]),t=calcPick(rnd,[0.15,0.25,0.35]),w=R4(2*Math.PI/T),ph=R4(w*t+Math.PI/2),x=R3(x0*Math.sin(ph));
    return {q:HLB+' A trolley between two springs is pulled '+x0.toFixed(1)+' cm to the right and let go from rest at t = 0. It oscillates with period '+g2(T)+' s. Calculate its displacement at t = '+t.toFixed(2)+' s, in cm (to the right is positive).',unit:'cm',answer:x,
      hints:['x = x₀ sin (ωt + ϕ). It starts at x = +x₀, so ϕ = [[π|2]] rad.','Work in radians: ω = [[2π|T]].'],
      working:wk(['x₀ = '+x0.toFixed(1)+' cm','T = '+g2(T)+' s','t = '+t.toFixed(2)+' s','x = ?'],
        ['ω = [[2π|T]]','ω = [[2π|'+g2(T)+']]','ω = '+c4(w)+' rad s⁻¹','x = x₀ sin (ωt + ϕ), with ϕ = [[π|2]]','x = '+x0.toFixed(1)+' × sin ('+c4(w)+' × '+t.toFixed(2)+' + [[π|2]])','x = '+x0.toFixed(1)+' × sin '+c4(ph),'x = '+c3(x)+' cm'])};
  }
  if(v<0.5){
    const c=calcPick(rnd,['The head of a massage gun','The needle of a sewing machine','The blade of an electric jigsaw','The tip of an electric toothbrush']);
    const n=calcPick(rnd,[1800,2400,3000,3600]),Amm=calcPick(rnd,[2.5,4.0,6.0,8.0]),f=n/60,w=R4(2*Math.PI*f),a=R3(Amm/1000*w*w);
    return {q:c+' moves with simple harmonic motion, making '+calcNum(n)+' oscillations per minute. The distance between its extreme positions is '+calcNum(2*Amm)+' mm. Calculate its maximum acceleration.',unit:'m s⁻²',answer:a,
      hints:['The amplitude is half the distance between the extreme positions; put it in metres.','f = [[oscillations|time in s]]; ω = 2πf; a<sub>max</sub> = Aω².'],
      working:wk([''+calcNum(n)+' oscillations in 60 s','A = [['+calcNum(2*Amm)+'|2]] mm = '+calcNum(Amm/1000)+' m','a<sub>max</sub> = ?'],
        ['f = [['+calcNum(n)+'|60 s]]','f = '+calcNum(f)+' Hz','ω = 2πf','ω = 2π × '+calcNum(f),'ω = '+c4(w)+' rad s⁻¹','a = −ω²x','a<sub>max</sub> = Aω²','a<sub>max</sub> = '+calcNum(Amm/1000)+' × '+c4(w)+'²','a<sub>max</sub> = '+c3(a)+' m s⁻²'])};
  }
  const c=calcPick(rnd,['A spacecraft’s docking probe on its spring','A seismometer’s mass on its spring','A trolley between two springs']);
  const A=calcPick(rnd,[3.0,4.0,5.0]),T=calcPick(rnd,[0.80,1.2,1.6]),t=calcPick(rnd,[0.10,0.15,0.20]),w=R4(2*Math.PI/T),wt=R4(w*t),vv=R4(-A/100*w*Math.sin(wt)),sp=R3(Math.abs(vv));
  return {q:c+' is pulled '+A.toFixed(1)+' cm from its equilibrium position and released at t = 0. It oscillates with period '+g2(T)+' s. Calculate its speed at t = '+t.toFixed(2)+' s.',unit:'m s⁻¹',answer:sp,
    hints:['It starts at x = A, so x = A cos ωt and v = −Aω sin ωt.','ωt is in radians: set your calculator to radians.'],
    working:wk(['A = '+A.toFixed(1)+' cm = '+calcNum(A/100)+' m','T = '+g2(T)+' s','t = '+t.toFixed(2)+' s','v = ?'],
      ['ω = [[2π|T]]','ω = [[2π|'+g2(T)+']]','ω = '+c4(w)+' rad s⁻¹','v = −Aω sin ωt','v = −'+calcNum(A/100)+' × '+c4(w)+' × sin ('+c4(w)+' × '+t.toFixed(2)+')','v = −'+calcNum(A/100)+' × '+c4(w)+' × sin '+c4(wt),'v = '+c4(vv)+' m s⁻¹','speed = '+c3(sp)+' m s⁻¹'])};
};
calcAct('equations','SHM equations',IB?'The second question is HL. Give answers to 3 significant figures. Press New problems for another pair.':'Give answers to 3 significant figures; ωt is in radians. Press New problems for another pair.',[calcFix(eq_q1,31),calcFix(eq_q2,32)]);
pairActs('equations',1,2);

/* ================= 5. SPRINGS AND PENDULUMS ================= */
exploreFrameQ('springs','Time the oscillations','Time 10 oscillations for each mass (or length, with the <b>Pendulum</b>), then plot T² against m or l. The gradient gives the '+KN+' k or g.',
  ANIM,'show=exp'+LQ,'Simple harmonic motion experiment: time 10 oscillations for five masses or lengths and plot T squared against mass or length','simple harmonic motion');
quickCheck('springs','What changes the period?',[
  {title:'Four times the mass',q:'The mass on a spring is made four times as big. What happens to the period?',
    options:[{text:'It doubles',correct:true},
      {text:'It becomes four times as long',why:'T = 2π√(m/k): the period depends on the square root of the mass, and √4 = 2.'},
      {text:'It halves',why:'A bigger mass accelerates less for the same force, so it takes longer, not shorter.'},
      {text:'It stays the same',why:'The period of a pendulum does not depend on the mass of the bob, but a mass on a spring does: T = 2π√(m/k).'}],
    explain:'T = 2π√(m/k), so T is proportional to √m. Four times the mass gives √4 = 2 times the period.'},
  {title:'A heavier bob',q:'The bob of a simple pendulum is replaced by one with twice the mass. The length is the same. What happens to the period?',
    options:[{text:'It stays the same',correct:true},
      {text:'It increases by a factor of √2',why:'That would be true for a mass on a spring. For a pendulum, T = 2π√(l/g) has no mass in it.'},
      {text:'It doubles',why:'Twice the mass means twice the weight pulling it back, so the acceleration is unchanged.'},
      {text:'It decreases',why:'A heavier bob has a bigger restoring force but more mass to accelerate, in the same ratio.'}],
    explain:'T = 2π√(l/g) does not include the mass. Twice the mass gives twice the restoring force, so the acceleration, and the period, are unchanged.'},
  {title:'A different world',q:'The same pendulum is taken to a moon base where g is a quarter of its value on Earth. What happens to the period?',
    options:[{text:'It doubles',correct:true},
      {text:'It halves',why:'Weaker gravity pulls the bob back more gently, so each swing takes longer, not shorter.'},
      {text:'It becomes four times as long',why:'T = 2π√(l/g), so T depends on [[1|√g]]: a quarter of g gives √4 = 2 times the period.'},
      {text:'It stays the same',why:'T = 2π√(l/g) depends on g, so the period changes.'}],
    explain:'T = 2π√(l/g), so T is proportional to [[1|√g]]. With g a quarter as big, the period is √4 = 2 times as long.'}
]);
// Q1: a rearrangement: k from m and timed oscillations, m from k and f, or l from timed swings.
const sp_q1=rnd=>{
  const v=rnd();
  if(v<0.34){
    const c=calcPick(rnd,[['a camera on a drone’s spring mount',0.45],['a sample tray on a Mars rover’s springs',0.60],['an instrument on a spring inside a deep-sea probe',0.75],['a trolley joined between two springs',0.25]]);
    const n=20,t=calcPick(rnd,[8.4,9.6,11.0,12.6]),T=R4(t/n),k=R3(4*Math.PI**2*c[1]/T**2);
    return {q:'The mass of '+c[0]+' is '+g2(c[1])+' kg. Displaced and let go, it makes '+n+' oscillations in '+t.toFixed(1)+' s. Calculate the '+KN+' of the spring.',unit:'N m⁻¹',answer:k,
      hints:['T = [[time|number of oscillations]].','Square both sides of '+TS+', then make k the subject.'],
      working:wk(['m = '+g2(c[1])+' kg',n+' oscillations in '+t.toFixed(1)+' s','k = ?'],
        ['T = [['+t.toFixed(1)+'|'+n+']]','T = '+c4(T)+' s',TS,'T² = [[4π²m|k]]','k = [[4π²m|T²]]','k = [[4π² × '+g2(c[1])+'|'+c4(T)+'²]]','k = '+c3(k)+' N m⁻¹'])};
  }
  if(v<0.67){
    const c=calcPick(rnd,['A Mars rover’s instrument platform','A robot’s camera mount','A drone’s battery pack, held on a spring mount,']);
    const k=calcPick(rnd,[450,620,850,1200]),f=calcPick(rnd,[3.5,4.6,5.2,6.0]),T=R4(1/f),m=R3(k*T*T/(4*Math.PI**2));
    return {q:c+' rests on a spring of '+KN+' '+k+' N m⁻¹. It oscillates at '+f.toFixed(1)+' Hz. Calculate its mass.',unit:'kg',answer:m,
      hints:['T = [[1|f]].','Square both sides of '+TS+', then make m the subject.'],
      working:wk(['k = '+k+' N m⁻¹','f = '+f.toFixed(1)+' Hz','m = ?'],
        ['T = [[1|f]]','T = [[1|'+f.toFixed(1)+']]','T = '+c4(T)+' s',TS,'T² = [[4π²m|k]]','m = [[kT²|4π²]]','m = [['+k+' × '+c4(T)+'²|4π²]]','m = '+c3(m)+' kg'])};
  }
  const nm=calcPick(rnd,['Kenji','Priya','Sofia','Arif']),n=20,t=calcPick(rnd,[30.2,36.4,40.8,44.6]),T=R4(t/n),l=R3(G*T*T/(4*Math.PI**2));
  return {q:nm+' times '+n+' oscillations of a simple pendulum: '+t.toFixed(1)+' s. Calculate the length of the pendulum. (g = '+GS+' N kg⁻¹)',unit:'m',answer:l,
    hints:['T = [[time|number of oscillations]].','Square both sides of '+TP+', then make l the subject.'],
    working:wk([n+' oscillations in '+t.toFixed(1)+' s','g = '+GS+' N kg⁻¹','l = ?'],
      ['T = [['+t.toFixed(1)+'|'+n+']]','T = '+c4(T)+' s',TP,'T² = [[4π²l|g]]','l = [[gT²|4π²]]','l = [['+GS+' × '+c4(T)+'²|4π²]]','l = '+c3(l)+' m'])};
};
// Q2: harder: k from a static extension then f; a pendulum on Mars with l in cm; the mass added from a change of period.
const sp_q2=rnd=>{
  const v=rnd();
  if(v<0.34){
    const m=calcPick(rnd,[0.15,0.25,0.30,0.40]),dx=calcPick(rnd,[4.0,5.5,6.0,8.0]),k=R4(m*G/(dx/100)),f=R3(Math.sqrt(k/m)/(2*Math.PI));
    return {q:'A '+calcNum(m*1000)+' g mass hangs from a spring, which stretches by '+dx.toFixed(1)+' cm. The mass is pulled down a little and released. Calculate the frequency of its oscillations.',unit:'Hz',answer:f,
      hints:['At rest, the spring’s force balances the weight: k = [[mg|Δx]], with Δx in metres and m in kg.','f = [[1|T]], with '+TS+'.'],
      working:wk(['m = '+calcNum(m*1000)+' g = '+g2(m)+' kg','Δx = '+dx.toFixed(1)+' cm = '+calcNum(dx/100)+' m','f = ?'],
        ['F = kΔx','mg = kΔx','k = [['+g2(m)+' × '+GS+'|'+calcNum(dx/100)+']]','k = '+c4(k)+' N m⁻¹',TS,'T = 2π'+RT(fr(g2(m),c4(k))),'T = '+c4(2*Math.PI*Math.sqrt(m/k))+' s','f = [[1|T]]','f = '+c3(f)+' Hz'])};
  }
  if(v<0.67){
    const gm=IB?3.7:3.71,lc=calcPick(rnd,[45,60,85,120]),T=R4(2*Math.PI*Math.sqrt(lc/100/gm)),n=R3(60/T);
    return {q:'A Mars rover carries a simple pendulum '+lc+' cm long, to measure g on Mars (g = '+gm+' N kg⁻¹). How many complete oscillations does it make in one minute?',unit:'',answer:n,
      hints:['Put l in metres, then use '+TP+' with Mars’s g.','Oscillations in a minute = [[60 s|T]].'],
      working:wk(['l = '+lc+' cm = '+calcNum(lc/100)+' m','g = '+gm+' N kg⁻¹','oscillations in 60 s = ?'],
        [TP,'T = 2π'+RT(fr(calcNum(lc/100),String(gm))),'T = '+c4(T)+' s','number = [[60|'+c4(T)+']]','number = '+c3(n)])};
  }
  const m1=calcPick(rnd,[0.20,0.30,0.50]),T1=calcPick(rnd,[0.42,0.55,0.68]),T2=T1*calcPick(rnd,[1.15,1.25,1.4]),k=R4(4*Math.PI**2*m1/T1**2),m2=R4(k*T2**2/(4*Math.PI**2)),dm=R3(m2-m1);
  return {q:'A '+g2(m1)+' kg mass on a spring oscillates with period '+g2(T1)+' s. A space probe’s sample is added to the mass, and the period becomes '+calcNum(R3(T2))+' s. Calculate the mass of the sample.',unit:'kg',answer:R3(k*R3(T2)**2/(4*Math.PI**2)-m1),
    hints:['Find k from the first period: k = [[4π²m|T²]].','Then the total mass from the second period: m = [[kT²|4π²]]. Subtract the first mass.'],
    working:wk(['m₁ = '+g2(m1)+' kg','T₁ = '+g2(T1)+' s','T₂ = '+calcNum(R3(T2))+' s','sample mass = ?'],
      [TS,'k = [[4π²m₁|T₁²]]','k = [[4π² × '+g2(m1)+'|'+g2(T1)+'²]]','k = '+c4(k)+' N m⁻¹','m₂ = [[kT₂²|4π²]]','m₂ = [['+c4(k)+' × '+calcNum(R3(T2))+'²|4π²]]','m₂ = '+c4(k*R3(T2)**2/(4*Math.PI**2))+' kg','sample = m₂ − m₁','sample = '+c3(k*R3(T2)**2/(4*Math.PI**2)-m1)+' kg'])};
};
calcAct('springs','Springs and pendulums','g = '+GS+' N kg⁻¹ on Earth. Give answers to 3 significant figures. Press New problems for another pair.',[calcFix(sp_q1,41),calcFix(sp_q2,42)]);
pairActs('springs',1,2);

/* ================= 6. ENERGY ================= */
exploreFrameQ('energy','Energy against time','Press <b>Play</b>. Watch the kinetic and potential energy swap over twice in each period while the total stays the same. Switch the graph to energy against displacement as well.',
  ANIM,'graph=et'+LQ,'Simple harmonic motion animation: kinetic, potential and total energy against time','simple harmonic motion');
quickCheck('energy','Energy graphs',[
  {title:'Against displacement',q:'Which graph shows the kinetic energy of an undamped oscillator against its displacement?',
    options:[{text:skx(u=>1-u*u),correct:true},
      {text:skx(u=>u*u),why:'That is the potential energy: zero at the equilibrium position and greatest at the extremes.'},
      {text:skx(()=>0.8),why:'That is the total energy, which stays constant. The kinetic energy changes as the object moves.'},
      {text:skx(u=>1-Math.abs(u)),why:'The kinetic energy is not a straight line: Eₖ falls with x², so it is a curve, flat at the top.'}],
    explain:'The kinetic energy is greatest at the equilibrium position, where the speed is greatest, and zero at ±'+AM+', where the object is momentarily at rest. It is the total energy minus a potential energy that grows with x², so the curve is an upside-down parabola.'},
  {title:'Against time',q:'An oscillator is released from rest at maximum displacement at t = 0. Which graph shows its kinetic energy against time?',
    options:[{text:sk(t=>S(t)**2,'Eₖ',1),correct:true},
      {text:sk(t=>C(t)**2,'Eₖ',1),why:'At t = 0 it is at rest, so the kinetic energy starts at zero, not at its maximum.'},
      {text:sk(t=>0.5+0.5*S(t),'Eₖ',1),why:'The kinetic energy is a maximum each time the object passes the equilibrium position, twice in each period, not once.'},
      {text:sk(()=>0.8,'Eₖ',1),why:'That is the total energy. The kinetic energy is zero at each extreme.'}],
    explain:'The kinetic energy is never negative. It starts at zero, is a maximum each time the object passes the equilibrium position, twice per period, so its graph has twice the frequency of the displacement graph.'},
  IB?{title:'Twice the amplitude (HL)',q:'The amplitude of an oscillator is doubled; its frequency is unchanged. What happens to its total energy?',
    options:[{text:'It becomes four times as big',correct:true},
      {text:'It doubles',why:'E<sub>T</sub> = ½mω²x₀² depends on x₀², and 2² = 4.'},
      {text:'It stays the same',why:'The maximum speed, ωx₀, doubles, so the kinetic energy at equilibrium is four times as big.'},
      {text:'It halves',why:'A bigger amplitude stores more energy, not less.'}],
    explain:'E<sub>T</sub> = ½mω²x₀², so doubling x₀ makes the total energy 2² = 4 times as big.'}
  :{title:'Twice the amplitude',q:'The amplitude of a mass–spring oscillator is doubled. What happens to its maximum kinetic energy?',
    options:[{text:'It becomes four times as big',correct:true},
      {text:'It doubles',why:'The maximum speed, Aω, doubles, and kinetic energy depends on v²: 2² = 4.'},
      {text:'It stays the same',why:'The period is the same, but the mass travels twice as far in that time, so it moves faster.'},
      {text:'It becomes eight times as big',why:'Ek = ½mv² and v<sub>max</sub> = Aω, so the energy depends on A², not A³.'}],
    explain:'v<sub>max</sub> = Aω and ω does not change, so doubling A doubles v<sub>max</sub>. Eₖ = ½mv², so the maximum kinetic energy becomes 2² = 4 times as big.'}
]);
sketchQs('energy');
// Q1: a rearrangement. IAL: T or A from Ek,max. IB (HL): x0 from E_T.
const en_q1=rnd=>{
  if(IB){
    const m=calcPick(rnd,[0.25,0.40,0.80,1.5]),f=calcPick(rnd,[1.2,2.5,3.0,4.0]),E=calcPick(rnd,[0.020,0.045,0.080,0.15]),w=R4(2*Math.PI*f),x0=R3(Math.sqrt(2*E/(m*w*w))*100);
    return {q:HLB+' A '+g2(m)+' kg mass oscillates with simple harmonic motion at '+f.toFixed(1)+' Hz. Its total energy is '+g2(E)+' J. Calculate its amplitude, in cm.',unit:'cm',answer:x0,
      hints:['E<sub>T</sub> = ½mω²x₀², with ω = 2πf.','Make x₀² the subject, then take the square root.'],
      working:wk(['m = '+g2(m)+' kg','f = '+f.toFixed(1)+' Hz','E<sub>T</sub> = '+g2(E)+' J','x₀ = ?'],
        ['ω = 2πf','ω = 2π × '+f.toFixed(1),'ω = '+c4(w)+' rad s⁻¹','E<sub>T</sub> = ½mω²x₀²',g2(E)+' = ½ × '+g2(m)+' × '+c4(w)+'² × x₀²','x₀² = [[2 × '+g2(E)+'|'+g2(m)+' × '+c4(w)+'²]]','x₀ = '+c4(x0/100)+' m','x₀ = '+c3(x0)+' cm'])};
  }
  const m=calcPick(rnd,[0.20,0.35,0.50,0.80]),A=calcPick(rnd,[2.0,3.0,4.0,5.0]),E=calcPick(rnd,[0.0060,0.012,0.018,0.025]),v=R4(Math.sqrt(2*E/m)),w=R4(v/(A/100)),T=R3(2*Math.PI/w);
  const c=calcPick(rnd,['A pendulum bob','A trolley between two springs','A robot arm’s gripper on a spring']);
  return {q:c+' of mass '+g2(m)+' kg oscillates with simple harmonic motion of amplitude '+A.toFixed(1)+' cm. Its maximum kinetic energy is '+g2(E)+' J. Calculate the period.',unit:'s',answer:T,
    hints:['The kinetic energy is a maximum at the equilibrium position, where v = v<sub>max</sub>: Eₖ = ½mv².','v<sub>max</sub> = Aω, then T = [[2π|ω]].'],
    working:wk(['m = '+g2(m)+' kg','A = '+A.toFixed(1)+' cm = '+calcNum(A/100)+' m','Eₖ = '+g2(E)+' J','T = ?'],
      ['Eₖ = ½mv²',g2(E)+' = ½ × '+g2(m)+' × v²','v = '+RT(fr('2 × '+g2(E),g2(m))),'v<sub>max</sub> = '+c4(v)+' m s⁻¹','v<sub>max</sub> = Aω',c4(v)+' = '+calcNum(A/100)+' × ω','ω = '+c4(w)+' rad s⁻¹','T = [[2π|ω]]','T = '+c3(T)+' s'])};
};
// Q2: harder. IAL: Ek,max from a static extension (k, T, v = Aω), or the speed at a displacement by energy. IB (HL): Ek at x; x where Ek = Ep.
const en_q2=rnd=>{
  const v=rnd();
  if(IB){
    if(v<0.5){
      const m=calcPick(rnd,[0.30,0.50,0.75]),f=calcPick(rnd,[1.5,2.0,2.5]),x0=calcPick(rnd,[4.0,5.0,6.0]),x=calcPick(rnd,[1.5,2.0,3.0]),w=R4(2*Math.PI*f),ET=R4(0.5*m*w*w*(x0/100)**2),EP=R4(0.5*m*w*w*(x/100)**2),EK=R3(ET-EP);
      return {q:HLB+' A '+g2(m)+' kg mass on a spring oscillates at '+f.toFixed(1)+' Hz with amplitude '+x0.toFixed(1)+' cm. Calculate its kinetic energy when its displacement is '+x.toFixed(1)+' cm.',unit:'J',answer:EK,
        hints:['E<sub>T</sub> = ½mω²x₀² and E<sub>p</sub> = ½mω²x².','Eₖ = E<sub>T</sub> − E<sub>p</sub>.'],
        working:wk(['m = '+g2(m)+' kg','f = '+f.toFixed(1)+' Hz','x₀ = '+calcNum(x0/100)+' m','x = '+calcNum(x/100)+' m','Eₖ = ?'],
          ['ω = 2πf','ω = '+c4(w)+' rad s⁻¹','E<sub>T</sub> = ½mω²x₀²','E<sub>T</sub> = ½ × '+g2(m)+' × '+c4(w)+'² × '+calcNum(x0/100)+'²','E<sub>T</sub> = '+c4(ET)+' J','E<sub>p</sub> = ½mω²x²','E<sub>p</sub> = '+c4(EP)+' J','Eₖ = E<sub>T</sub> − E<sub>p</sub>','Eₖ = '+c3(EK)+' J'])};
    }
    const x0=calcPick(rnd,[4.0,5.0,6.0,8.0]),x=R3(x0/Math.SQRT2);
    return {q:HLB+' A robot’s camera oscillates on its spring mount with amplitude '+x0.toFixed(1)+' cm. At what displacement are its kinetic energy and potential energy equal? Give the size, in cm.',unit:'cm',answer:x,
      hints:['Eₖ = E<sub>p</sub> means each is half of E<sub>T</sub>.','E<sub>p</sub> = ½mω²x² = ½ × ½mω²x₀², so x² = [[x₀²|2]].'],
      working:wk(['x₀ = '+x0.toFixed(1)+' cm','x = ?'],
        ['E<sub>p</sub> = ½E<sub>T</sub>','½mω²x² = ½ × ½mω²x₀²','x² = [[x₀²|2]]','x = [[x₀|√2]]','x = [['+x0.toFixed(1)+'|√2]]','x = '+c3(x)+' cm'])};
  }
  if(v<0.5){
    const m=calcPick(rnd,[0.20,0.25,0.40]),dx=calcPick(rnd,[12.0,15.0,18.0]),A=calcPick(rnd,[3.0,4.0,5.0]),k=R4(m*G/(dx/100)),T=R4(2*Math.PI*Math.sqrt(m/k)),w=R4(2*Math.PI/T),vm=R4(A/100*w),E=R3(0.5*m*vm*vm);
    return {q:'A '+g2(m)+' kg mass hangs at rest from a spring, which is stretched by '+dx.toFixed(1)+' cm. The mass is pulled down a further '+A.toFixed(1)+' cm and released. Calculate its maximum kinetic energy.',unit:'J',answer:E,
      hints:['k = [[mg|Δx]], using the stretch at rest.','T = 2π√(m/k), ω = [[2π|T]], v<sub>max</sub> = Aω, then Eₖ = ½mv².'],
      working:wk(['m = '+g2(m)+' kg','Δx = '+calcNum(dx/100)+' m','A = '+calcNum(A/100)+' m','Eₖ = ?'],
        ['k = [[mg|Δx]]','k = [['+g2(m)+' × '+GS+'|'+calcNum(dx/100)+']]','k = '+c4(k)+' N m⁻¹',TS,'T = '+c4(T)+' s','ω = [[2π|T]]','ω = '+c4(w)+' rad s⁻¹','v<sub>max</sub> = Aω','v<sub>max</sub> = '+calcNum(A/100)+' × '+c4(w),'v<sub>max</sub> = '+c4(vm)+' m s⁻¹','Eₖ = ½mv²','Eₖ = ½ × '+g2(m)+' × '+c4(vm)+'²','Eₖ = '+c3(E)+' J'])};
  }
  const m=calcPick(rnd,[0.40,0.50,0.60]),k=calcPick(rnd,[30,40,60]),A=calcPick(rnd,[4.0,5.0,6.0]),x=calcPick(rnd,[2.0,2.5,3.0]),E1=R4(0.5*k*(A/100)**2),E2=R4(0.5*k*(x/100)**2),sp=R3(Math.sqrt(2*(E1-E2)/m));
  return {q:'A '+g2(m)+' kg trolley oscillates between springs of combined '+KN+' '+k+' N m⁻¹, with amplitude '+A.toFixed(1)+' cm and no friction. Use conservation of energy to calculate its speed when it is '+x.toFixed(1)+' cm from the equilibrium position.',unit:'m s⁻¹',answer:sp,
    hints:['The elastic potential energy at displacement x is ½kx². At the amplitude all the energy is potential: ½kA².','½kA² = ½kx² + ½mv².'],
    working:wk(['m = '+g2(m)+' kg','k = '+k+' N m⁻¹','A = '+calcNum(A/100)+' m','x = '+calcNum(x/100)+' m','v = ?'],
      ['total energy = ½kA²','total energy = ½ × '+k+' × '+calcNum(A/100)+'²','total energy = '+c4(E1)+' J','potential energy at x = ½kx²','potential energy at x = '+c4(E2)+' J','½mv² = '+c4(E1)+' − '+c4(E2),'½mv² = '+c4(E1-E2)+' J','v = '+RT(fr('2 × '+c4(E1-E2),g2(m))),'v = '+c3(sp)+' m s⁻¹'])};
};
calcAct('energy',IB?HLB+' Energy calculations':'Energy calculations',IB?'HL only. Give answers to 3 significant figures. Press New problems for another pair.':'g = 9.81 N kg⁻¹. Give answers to 3 significant figures. Press New problems for another pair.',[calcFix(en_q1,51),calcFix(en_q2,52)]);
pairActs('energy',1,2);

/* ================= 7. EXAM ================= */
// One original structured question for each level (not from a paper): a 0.36 kg instrument on a spring of 90 N m⁻¹ in a
// deep-sea robot, displaced 1.5 cm. ω = √(k/m) = 15.81 rad s⁻¹, T = 0.397 s, v_max = 0.237 m s⁻¹, a_max = 3.75 m s⁻²,
// Ek,max = 1.01 × 10⁻² J; IB HL: v at 0.75 cm = 0.205 m s⁻¹.
if(IB){
  explainAct('exam','An instrument in a deep-sea robot','A deep-sea robot carries an instrument of mass 0.36 kg on a spring of spring constant 90 N m⁻¹, to protect it from vibration. The instrument is displaced 1.5 cm from its equilibrium position and released. Write your answer to each part, then open the model answer.',[
    {n:'(a)',q:'State the conditions for the instrument to perform simple harmonic motion.',m:2,a:['the acceleration (or restoring force) is proportional to the displacement from the equilibrium position','and in the opposite direction to the displacement (directed towards the equilibrium position)']},
    {n:'(b)',q:'Show that the period of oscillation is about 0.4 s.',m:2,a:['T = 2π√([[m|k]]) = 2π√([[0.36|90]])','T = 0.397 s ≈ 0.4 s']},
    {n:'(c)',q:'Calculate the maximum acceleration of the instrument.',m:2,a:['ω = [[2π|T]] = [[2π|0.397]] = 15.8 rad s⁻¹','a = ω²x₀ = 15.8² × 0.015 = 3.75 m s⁻²']},
    {n:'(d)',q:'Describe the energy changes during one cycle of the oscillation, starting from the moment of release.',m:2,a:['at release all the energy is elastic potential energy; it is transferred to kinetic energy as the instrument moves to the equilibrium position, where the kinetic energy is a maximum','then back to potential energy at the other extreme, and so on twice in each cycle; the total energy stays constant (no damping)']},
    {n:'(e)',q:HLB+' The instrument is released at t = 0. Its displacement is x = x₀ sin (ωt + ϕ). State the value of ϕ.',m:1,a:['ϕ = [[π|2]] rad (x = x₀ at t = 0, so sin ϕ = 1)']},
    {n:'(f)',q:HLB+' Calculate the speed of the instrument when its displacement is 0.75 cm.',m:2,a:['v = ω√(x₀² − x²) = 15.8 × √(0.015² − 0.0075²)','v = 0.205 m s⁻¹']},
    {n:'(g)',q:HLB+' Calculate the total energy of the oscillation.',m:2,a:['E<sub>T</sub> = ½mω²x₀² = ½ × 0.36 × 15.8² × 0.015²','E<sub>T</sub> = 1.01 × 10⁻² J']}
  ]);
}else{
  explainAct('exam','An instrument in a deep-sea robot','A deep-sea robot carries an instrument of mass 0.36 kg on a spring of stiffness 90 N m⁻¹, to protect it from vibration. The instrument is displaced 1.5 cm from its equilibrium position and released. Write your answer to each part, then open the model answer.',[
    {n:'(a)',q:'State the conditions for the instrument to move with simple harmonic motion.',m:2,a:['there is a (resultant) force that is proportional to the displacement from the equilibrium position','and (always) acting towards the equilibrium position (in the opposite direction to the displacement)']},
    {n:'(b)',q:'Show that the period of oscillation is about 0.4 s.',m:2,a:['use of T = 2π√([[m|k]]) = 2π√([[0.36|90]])','T = 0.397 s']},
    {n:'(c)',q:'Calculate the maximum speed of the instrument.',m:3,a:['use of ω = [[2π|T]]: ω = [[2π|0.397 s]] = 15.8 rad s⁻¹','use of v = Aω sin ωt with sin ωt = 1 (v<sub>max</sub> = Aω)','v<sub>max</sub> = 0.015 m × 15.8 rad s⁻¹ = 0.237 m s⁻¹']},
    {n:'(d)',q:'Calculate the maximum acceleration of the instrument.',m:2,a:['use of a = −ω²x with x = A','a = (−)15.8² × 0.015 = (−)3.75 m s⁻²']},
    {n:'(e)',q:'The instrument is released at t = 0. Sketch the velocity–time graph for one period, with the direction of the initial displacement as positive.',m:2,a:['a sinusoidal curve with the same period as the displacement (0.40 s) and a peak of 0.24 m s⁻¹','starting at v = 0 and becoming negative first (shifted a quarter cycle from the displacement–time graph)']},
    {n:'(f)',q:'Calculate the maximum kinetic energy of the instrument.',m:2,a:['use of Eₖ = ½mv² with v<sub>max</sub>','Eₖ = ½ × 0.36 kg × (0.237 m s⁻¹)² = 1.01 × 10⁻² J']},
    {n:'(g)',q:'Explain how conservation of energy applies to the instrument while it oscillates with no damping.',m:2,a:['the total energy (kinetic + elastic potential) stays constant','elastic potential energy is transferred to kinetic energy as it moves towards the equilibrium position, and back to potential energy as it moves out to maximum displacement']}
  ]);
}

/* ================= 8. SUM UP ================= */
{
  wordBox('sumup','The condition',[IB?'For simple harmonic motion, the acceleration is ':'For simple harmonic motion, the resultant force is ',['a1','proportional'],' to the displacement from the ',['a2','equilibrium'],' position and always directed ',['a3','towards'],
    ' it. So the acceleration is greatest at ',['a4','maximum'],' displacement and zero at the equilibrium position.'],['inversely proportional','away from','constant']);
  wordBox('sumup','Graphs and energy',['The velocity is the ',['b1','gradient'],' of the displacement–time graph, and it is greatest at the equilibrium position. The period does not depend on the ',['b2','amplitude'],
    '. With no damping the ',['b3','total'],' energy stays constant, while the kinetic energy is a maximum ',['b4','twice'],' in each period.'],['area',IB?'spring constant':'stiffness','once','kinetic']);
  if(IB)wordBox('sumup','The equations (HL)',['An oscillator let go from rest at x = +x₀ has phase angle ϕ = ',['c1','π/2'],' rad in x = x₀ sin (ωt + ϕ). Its speed, ±ω√(x₀² − x²), is greatest at x = ',['c2','0'],
    '. The total energy is ½mω²x₀², so doubling the amplitude makes it ',['c3','four'],' times as big.'],['π','x₀','two']);
  else wordBox('sumup','Springs, pendulums and energy',['The period of a mass on a spring depends on the mass and the ',['c1','stiffness'],', but the period of a simple pendulum does not depend on the ',['c2','mass'],
    '. Doubling the amplitude doubles the maximum speed and makes the maximum kinetic energy ',['c3','four'],' times as big.'],['length','gravity','two']);
  pairFirstTwo('sumup');
}
