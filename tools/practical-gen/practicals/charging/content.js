/* 2.23P Charging insulators by friction. Observe and explain, so the Variables, Results, Graphs and Calculate
   tabs of the model page became Is It Charged?, Electrons, Conductors and Dangers and Uses (2.22P–2.28P).
   Mark scheme wording from the IGCSE Question Index (see tools/CORE-PRACTICALS.md). */
function examPart(body,head,q,bullets){
  body.appendChild(mk('p','sub',head));
  body.appendChild(mk('p','',q));
  const d=mk('details','');
  d.innerHTML='<summary>Check your answer</summary><div><ul>'+bullets.map(b=>'<li>'+FR(b)+'</li>').join('')+'</ul></div>';
  body.appendChild(d);
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

/* ================= 2. EXPERIMENT ================= */
{
  act('experiment','Your turn','Take your own readings','Press Experiment. With the hanging rod, try all four pairs: polythene or acetate hanging, and polythene or acetate in your hand. Then try a metal rod and a rod that has not been rubbed, and the paper, water and electroscope tests. Which pairs attract, which repel, and what does that tell you about the types of charge?');
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
  const body=act('experiment','Predict','The metal rod','');
  createPredict({host:body,q:'Lucas rubs a metal rod while holding it in his hand. It does not move the hanging rod at all. Why?',options:[
    {text:'Charge flows through it and him to earth',correct:true},
    {text:'Metals cannot gain or lose electrons',why:'Metals do gain electrons when rubbed, but they are conductors, so the electrons flow away.'},
    {text:'The metal rod is too heavy to be charged',why:'Mass has nothing to do with it. The metal is a conductor, so the charge does not stay on it.'},
    {text:'Metal only works with a cloth made of metal',why:'The cloth is fine: the problem is that the metal lets the charge flow away through his hand.'}
  ],explain:'Metal is a conductor. Any electrons moved onto it flow through the rod, Lucas’s hand and his body to earth, so it is left uncharged. Held on an insulating handle, a metal rod can be charged.'});
}

/* ================= 3. IS IT CHARGED? ================= */
{
  const body=act('charged','Sort','Does it show the rod is charged?','A rubbed rod is held near each thing. Sort each card by what it shows, then press Check.');
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
  const body=act('charged','Predict','Paper pieces','');
  createPredict({host:body,q:'The pieces of paper are not charged. Why are they attracted to a charged rod held just above them?',options:[
    {text:'It induces an opposite charge nearby',correct:true},
    {text:'The rod pulls on them with a magnetic force',why:'Paper is not magnetic. This is an electrostatic force, between charges.'},
    {text:'Rubbing the rod gave the paper a charge too',why:'The paper was never rubbed. It is uncharged until the rod comes near.'},
    {text:'Gravity pulls them up towards the rod',why:'Gravity pulls them down, towards the Earth. An electrostatic force pulls them up.'}
  ],explain:'The charged rod pushes or pulls electrons in the paper, so the side nearest the rod gets the opposite charge (an induced charge). Unlike charges attract, and the near side is closer than the far side, so the paper is attracted.'});
}
{
  const body=act('charged','Predict','A positive rod and water','');
  createPredict({host:body,q:'Ananya holds a positively charged acetate rod near a thin stream of water. What happens?',options:[
    {text:'The stream bends towards the rod',correct:true},
    {text:'The stream bends away from the rod',why:'The rod induces a negative charge on the near side of the water, and unlike charges attract.'},
    {text:'The stream does not move at all',why:'Any charged rod attracts the water, positive or negative.'},
    {text:'It bends only for a negative rod',why:'A negative rod and a positive rod both bend the stream towards them, so this test cannot tell them apart.'}
  ],explain:'Either type of charge induces the opposite charge on the near side of the water, so the stream always bends towards a charged rod. It shows the rod is charged, but not which type of charge it has.'});
}

/* ================= 4. ELECTRONS ================= */
{
  const body=act('electrons','Sort','Gains or loses electrons?','Each object has just been rubbed. Sort it by what happened to its electrons, then press Check.');
  createSortGame({host:body,cats:[
    {id:'g',label:'Gained electrons: negative',hint:'',color:'--c1',soft:'--c1-soft'},
    {id:'l',label:'Lost electrons: positive',hint:'',color:'--c2',soft:'--c2-soft'}
  ],items:[
    {id:'1',text:'A polythene rod rubbed with a cloth',cat:'g'},
    {id:'2',text:'The cloth used to rub an acetate rod',cat:'g'},
    {id:'3',text:'A balloon that repels a polythene rod',cat:'g'},
    {id:'4',text:'An acetate rod rubbed with a cloth',cat:'l'},
    {id:'5',text:'The cloth used to rub a polythene rod',cat:'l'},
    {id:'6',text:'A rod that repels a charged acetate rod',cat:'l'}
  ]});
}
{
  const body=act('electrons','Predict','What moves?','');
  createPredict({host:body,q:'An acetate rod becomes positively charged when rubbed with a cloth. What moved?',options:[
    {text:'Electrons, from the rod to the cloth',correct:true},
    {text:'Protons, from the cloth to the rod',why:'Protons are held in the nuclei of the atoms. Only electrons are transferred by rubbing.'},
    {text:'Electrons, from the cloth to the rod',why:'Gaining electrons would make the rod negative, not positive.'},
    {text:'Positive charges, from the cloth to the rod',why:'Positive charges do not move. The rod is positive because it has lost electrons.'}
  ],explain:'Friction transfers electrons. The acetate lost electrons to the cloth, so it is left positive, and the cloth gained them, so it is left negative. Mark schemes reject “protons move” and “positive charge moves”.'});
}
{
  const body=act('electrons','Predict','Equal and opposite','');
  createPredict({host:body,q:'Rubbing moves 2 million electrons from a cloth onto a polythene rod. What charge is the cloth left with?',options:[
    {text:'Positive, the same size as the rod’s',correct:true},
    {text:'Negative, the same charge as the rod',why:'The cloth lost electrons, so it is left with fewer electrons than protons: positive.'},
    {text:'None, as only the rod was charged',why:'The electrons came from the cloth, so the cloth is charged too.'},
    {text:'Positive, but smaller than the rod’s charge',why:'Every electron the rod gained, the cloth lost, so the two charges are the same size.'}
  ],explain:'Charge is not made by rubbing, only moved. The cloth lost exactly the electrons the rod gained, so the cloth’s positive charge is the same size as the rod’s negative charge.'});
}

/* ================= 5. CONDUCTORS ================= */
{
  const body=act('conductors','Sort','Conductor or insulator?','Sort each material, then press Check.');
  createSortGame({host:body,cats:[
    {id:'c',label:'Electrical conductor',hint:'Charge flows through it',color:'--c2',soft:'--c2-soft'},
    {id:'i',label:'Electrical insulator',hint:'Charge stays where it is',color:'--c1',soft:'--c1-soft'}
  ],items:[
    {id:'1',text:'Copper',cat:'c'},{id:'2',text:'Aluminium',cat:'c'},{id:'3',text:'Steel',cat:'c'},{id:'4',text:'Graphite (carbon)',cat:'c'},
    {id:'5',text:'Polythene',cat:'i'},{id:'6',text:'Acetate',cat:'i'},{id:'7',text:'Rubber',cat:'i'},{id:'8',text:'Dry wood',cat:'i'}
  ]});
}
{
  const body=act('conductors','Predict','Why insulators?','');
  createPredict({host:body,q:'Why is the practical done with insulating rods, such as polythene, rather than metal ones?',options:[
    {text:'The charge stays on an insulator',correct:true},
    {text:'Only insulators have any electrons',why:'Metals have electrons too, many of them free to move. That is why charge flows away through them.'},
    {text:'Insulators are lighter, so they move',why:'The rod in your hand does not need to move. The point is that an insulator keeps its charge.'},
    {text:'Rubbing would scratch a metal rod',why:'Scratching is not the problem: charge on a metal rod held in your hand flows away to earth.'}
  ],explain:'In an insulator, electrons cannot move through the material, so the charge stays where it was rubbed on. In a metal, charge flows through the rod and your body to earth.'});
}
{
  const body=act('conductors','Predict','Touching the rod','');
  createPredict({host:body,q:'A charged metal sphere stands on an insulating stand. Poppy touches it with her finger. What happens?',options:[
    {text:'Charge flows through her to earth',correct:true},
    {text:'Nothing, as she is not charged herself',why:'Her body is a conductor connected to earth, so charge can flow through her.'},
    {text:'It gains more charge from her finger',why:'Touching is not rubbing. Charge flows away from the sphere, through her, to earth.'},
    {text:'Only the charge near her finger flows away',why:'The sphere is a conductor, so all of its charge can flow, not just the charge near her finger.'}
  ],explain:'The sphere and Poppy are both conductors. Electrons flow between the sphere and the Earth through her body until the sphere is neutral: it is earthed.'});
}

/* ================= 6. DANGERS AND USES ================= */
{
  const body=act('uses','Order','Why a fuel tanker is earthed','Put the explanation in order. Drag the ≡ handle, or use the ▲▼ buttons.');
  createReorder({host:body,steps:[
    {id:'a',text:'Fuel rubs against the pipe as it flows.'},
    {id:'b',text:'Friction transfers electrons, so charge builds up.'},
    {id:'c',text:'A spark could jump to the nozzle or the ground.'},
    {id:'d',text:'The spark could ignite the fuel vapour: fire or an explosion.'},
    {id:'e',text:'So the tanker is connected to earth with a metal wire.'},
    {id:'f',text:'Charge flows through the wire to earth, so none builds up.'}
  ],constraints:[['a','b'],['b','c'],['c','d'],['d','e'],['e','f']],
  why:'Friction charges the fuel and the tanker. A spark from the charge could ignite the fuel, so the tanker is earthed: charge flows to earth through the wire and cannot build up.'});
}
{
  const body=act('uses','Sort','Danger or use?','Sort each card, then press Check.');
  createSortGame({host:body,cats:[
    {id:'d',label:'A danger of electrostatic charge',hint:'',color:'--c2',soft:'--c2-soft'},
    {id:'u',label:'A use of electrostatic charge',hint:'',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Refuelling an aircraft: a spark could ignite the fuel',cat:'d'},
    {id:'2',text:'Flour dust in a mill: a spark could cause an explosion',cat:'d'},
    {id:'3',text:'Touching a charged car door: an electric shock',cat:'d'},
    {id:'4',text:'An inkjet printer steers charged drops of ink',cat:'u'},
    {id:'5',text:'A photocopier’s charged drum picks up toner powder',cat:'u'},
    {id:'6',text:'A charged paint spray gives an even coat',cat:'u'}
  ]});
}
{
  const body=act('uses','Predict','Spray painting','');
  createPredict({host:body,q:'Why are the drops of paint from an electrostatic spray gun all given the same charge?',options:[
    {text:'They repel, so they spread out evenly',correct:true},
    {text:'They attract, so they form bigger drops',why:'Like charges repel, not attract, so the drops push apart.'},
    {text:'Charged paint dries much more quickly',why:'The charge does not change how paint dries. It spreads the spray out.'},
    {text:'It stops the paint conducting electricity',why:'Charging the paint does not stop it conducting. The point is that the drops repel.'}
  ],explain:'Like charges repel, so the drops push apart into a fine, even spray. The object is given the opposite charge (or earthed), so the paint is attracted to it, even round the back: an even coat with little waste.'});
}
{
  const body=act('uses','Predict','Inkjet printer','');
  createPredict({host:body,q:'In an inkjet printer, a negatively charged drop of ink falls between two charged plates. Which way is it pushed?',options:[
    {text:'Towards the positive plate',correct:true},
    {text:'Towards the negative plate',why:'Like charges repel, so the negative plate pushes the drop away from it.'},
    {text:'Straight down: the plates do nothing',why:'The drop is charged, so the charged plates exert a force on it.'},
    {text:'It depends on the colour of the ink',why:'The colour does not matter. The direction depends on the charge on the drop and the plates.'}
  ],explain:'Opposite charges attract and like charges repel, so a negative drop is pushed away from the negative plate and towards the positive plate. Changing the charge on the plates steers each drop to the right place on the paper.'});
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
  const body=act('accuracy','Predict','A damp day','');
  createPredict({host:body,q:'On a very damp day, Charlotte’s rubbed rods hardly move the hanging rod. Why?',options:[
    {text:'Charge leaks away through the damp',correct:true},
    {text:'Water makes the rods conduct electrons less',why:'Water on the surface conducts, so it lets the charge leak away; it does not stop charging.'},
    {text:'Damp air is heavier, so the rod cannot turn',why:'The air is not much heavier. The rods lose their charge, so the force is tiny.'},
    {text:'Damp cloths give the rods too much charge',why:'A damp cloth makes it harder, not easier, to keep charge on the rod.'}
  ],explain:'A thin layer of water on the rods, the cloth and the stirrup conducts, so the charge leaks away almost as soon as it is rubbed on. Dry equipment (or a warm, dry room) gives much clearer results.'});
}
{
  const body=act('accuracy','Predict','Why hang the rod?','');
  createPredict({host:body,q:'Why is one rod hung from a thread instead of being laid on the bench?',options:[
    {text:'Small forces can turn it, so you can see them',correct:true},
    {text:'The thread charges the rod as it turns',why:'The thread is there to let the rod turn freely, not to charge it.'},
    {text:'On the bench, its charge would vanish',why:'The bench is an insulator, so the charge would mostly stay. The problem is friction stopping it moving.'},
    {text:'Hanging it makes the force between the rods bigger',why:'The force is the same. Hanging the rod just lets that small force move it.'}
  ],explain:'The electrostatic force between the rods is small. On the bench, friction would stop the rod moving. Hung from a thread (or balanced on a watch glass), the rod can swing freely, so even a small attraction or repulsion turns it.'});
}

/* ================= EXAM PRACTICE ================= */
{
  const body=act('exam','Exam style','Charging by friction','Write each answer, then check it against the model answer.');
  examPart(body,'(a) 2 marks','Describe how Yassin can charge a polythene rod.',[
    'Rub it (friction).',
    'With a dry cloth or duster (another insulator).']);
  examPart(body,'(b) 2 marks','Explain how the polythene rod becomes negatively charged.',[
    'Electrons are transferred from the cloth to the rod by friction.',
    'The rod gains electrons (the cloth loses electrons and is left positive).',
    'Protons do not move: “positive charge moves” scores nothing.']);
  examPart(body,'(c) 2 marks','Describe one way Yassin can show that the rod is charged. Give what he would see.',[
    'Hold it near small pieces of paper, a thin stream of water or hair, or near the cap of an electroscope.',
    'The paper jumps up to the rod / the water bends towards it / the hair is attracted / the leaf rises.']);
  examPart(body,'(d) 3 marks','Yassin also has an acetate rod. Describe how he can use the rods and the cloth to show that there are two types of charge. You may draw a diagram.',[
    'Charge a rod by rubbing and hang it so it can swing freely (paper stirrup on a thread, or on a watch glass).',
    'Charge another rod and bring it close to one end, without touching.',
    'Observe both attraction and repulsion: a second polythene rod repels it, an acetate rod attracts it.',
    'So like charges repel and unlike charges attract: there must be two types of charge.']);
  examPart(body,'(e) 3 marks','A metal rod held in the hand cannot be charged by rubbing. Explain why, and how it could be charged.',[
    'Metal is a conductor (polythene is an insulator).',
    'Electrons rubbed onto it flow through the rod and the person to earth, so no charge builds up.',
    'Hold it with an insulating handle, so the charge cannot flow away.']);
  examPart(body,'(f) 3 marks','Explain why an aircraft is connected to earth before it is refuelled.',[
    'Friction between the fuel and the pipe transfers electrons, so the aircraft becomes charged.',
    'A spark could ignite the fuel, causing a fire or explosion.',
    'With an earth wire, charge flows to earth, so no charge builds up and there is no spark.']);
  examPart(body,'(g) 3 marks','Explain how charging the drops of paint and the car body helps a car to be sprayed evenly.',[
    'The paint drops are given the same charge, so they repel each other and spread out.',
    'The car body is given the opposite charge (or is earthed), so the paint is attracted to it.',
    'An even coat, reaching awkward places, with less paint wasted.']);
}
