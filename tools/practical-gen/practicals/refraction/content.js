/* ================= helpers for this page ================= */
function answerBox(body,html){const d=mk('details','');d.innerHTML='<summary>Check your answer</summary><div>'+FR(html)+'</div>';body.appendChild(d);}

/* ================= 1. METHOD ================= */
{
  const body=act('method','Order','Trace a ray through a rectangular block','Put the steps in the order you would do them. Drag the ≡ handle, or use the ▲▼ buttons.');
  createReorder({host:body,steps:[
    {id:'a',text:'Put the glass block on a sheet of plain paper and draw round it with a sharp pencil.'},
    {id:'b',text:'Shine a narrow ray from the ray box at one side of the block, at an angle to the normal.'},
    {id:'c',text:'Mark the ray going in (the incident ray) with two crosses, far apart.'},
    {id:'d',text:'Mark the ray coming out of the block (the emergent ray) with two crosses, far apart.'},
    {id:'e',text:'Switch off the ray box and remove the block.'},
    {id:'f',text:'Join each pair of crosses with a ruler, then join the point where the ray went in to the point where it came out.'},
    {id:'g',text:'Draw the normal at 90° to the surface where the ray went in.'},
    {id:'h',text:'Measure the angle of incidence and the angle of refraction from the normal with a protractor.'},
    {id:'i',text:'Repeat with other angles of incidence, then with a semicircular block and a triangular prism.'}
  ],constraints:[['a','b'],['b','c'],['b','d'],['c','e'],['d','e'],['e','f'],['a','g'],['f','h'],['g','h'],['h','i']],
  why:'Draw round the block first, so you can put it back and draw the ray through it. Mark both rays while the light is on, then remove the block and join the crosses. The normal can be drawn at any point after the outline, but it must be there before you measure.'});
}
{
  const body=act('method','Match','What each piece of equipment is for','Pair each piece of equipment with its job. Drag one card onto the other, or tap one card and then the other.');
  createMatchGame({host:body,leftTitle:'Equipment',rightTitle:'Its job',pairs:[
    {id:'r',l:'Ray box with a single slit (or a laser)',r:'Gives a narrow beam, so the path of the light can be marked'},
    {id:'p',l:'Sharp pencil',r:'Draws a thin outline round the block and marks thin crosses'},
    {id:'u',l:'Ruler',r:'Joins the crosses with straight lines through the outline'},
    {id:'q',l:'Protractor',r:'Measures the angles between each ray and the normal'},
    {id:'w',l:'Plain white paper',r:'Shows up the ray, and keeps a record of the block and the rays'},
    {id:'d',l:'A darkened room',r:'Makes the ray bright compared with its surroundings'}
  ]});
}

/* ================= 2. EXPERIMENT ================= */
{
  act('experiment','Your turn','Trace the rays yourself','Press Experiment. Choose the semicircular block (ray in through the curved side) and find the critical angle to within 2°. Then trace the ray through the 60° prism, with one colour and with white light, and through both sides of the 45° prism. What happens at the second face each time, and which colour is refracted most?');
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
    {id:'6',text:'A ray is turned through 90° with no light lost',cat:'p'}
  ]});
}
{
  const body=act('experiment','Predict','Along the normal','');
  createPredict({host:body,q:'Hana shines the ray at the rectangular block along the normal (i = 0°). What happens to the ray?',options:[
    {text:'It goes straight through without bending',correct:true},
    {text:'It bends towards the normal as it goes in',why:'It is already along the normal. With i = 0° the angle of refraction is 0° too.'},
    {text:'It is totally internally reflected inside',why:'Total internal reflection only happens going from glass to air, above the critical angle.'},
    {text:'It bends away from the normal as it goes in',why:'Light going into glass slows down; it never bends away from the normal going in.'}
  ],explain:'With i = 0°, the angle of refraction is also 0°: the light slows down but does not change direction.'});
}
{
  const body=act('experiment','Predict','The ray stops coming out','');
  createPredict({host:body,q:'Lucas makes i smaller at the first face of the 60° prism. Below about 28° no light comes out of the second face. Why?',options:[
    {text:'It meets the second face at more than c',correct:true},
    {text:'The glass absorbs light at small angles',why:'Glass absorbs very little light. The light is still there: it reflects inside the prism.'},
    {text:'It reflects off the first face instead',why:'Most of the light still goes in at the first face. The change is at the second face.'},
    {text:'Light cannot be refracted at two faces',why:'At bigger angles of incidence it is refracted at both faces.'}
  ],explain:'A smaller i at the first face makes the angle at the second face bigger (it is 60° − r). Once that is more than the critical angle (41.8°), the ray is totally internally reflected.'});
}

/* ================= 3. RECTANGULAR BLOCK ================= */
{
  const body=act('rect','Match','The words for a ray diagram','Pair each word with its meaning. Drag one card onto the other, or tap one card and then the other.');
  createMatchGame({host:body,leftTitle:'Word',rightTitle:'Meaning',pairs:[
    {id:'n',l:'Normal',r:'A line at 90° to the surface, where the ray meets it'},
    {id:'i',l:'Angle of incidence',r:'The angle between the ray going in and the normal'},
    {id:'r',l:'Angle of refraction',r:'The angle between the refracted ray and the normal'},
    {id:'e',l:'Emergent ray',r:'The ray that comes out of the block on the far side'},
    {id:'f',l:'Refraction',r:'Light changes speed, and so direction, as it crosses into a new material'},
    {id:'t',l:'Light wave',r:'A transverse wave, which can be reflected and refracted'}
  ]});
}
{
  const body=act('rect','Predict','Why the ray bends','');
  createPredict({host:body,q:'Why does the ray bend towards the normal as it goes into the glass?',options:[
    {text:'The light slows down in the glass',correct:true},
    {text:'The light speeds up in the glass',why:'Light travels more slowly in glass than in air (that is why n is more than 1).'},
    {text:'The glass surface attracts the light',why:'Nothing pulls on the light. The change of direction comes from the change of speed.'},
    {text:'Some light reflects off the surface',why:'A little does reflect, but that is a separate, weak ray. It does not bend the ray going in.'}
  ],explain:'Light is slower in glass than in air. A ray that meets the surface at an angle changes direction as it slows, bending towards the normal. Coming out, it speeds up and bends away from the normal.'});
}
{
  const body=act('rect','Predict','The ray coming out','');
  createPredict({host:body,q:'Compared with the ray going into a rectangular block, the ray coming out is…',options:[
    {text:'parallel to it, but shifted sideways',correct:true},
    {text:'bent even further towards the normal',why:'Coming out, the light speeds up and bends away from the normal, by the same amount it bent going in.'},
    {text:'on exactly the same straight line as it',why:'It is parallel, but the path through the block moves it sideways.'},
    {text:'turned through 90° by the glass block',why:'Turning through 90° needs total internal reflection, as in a 45° prism.'}
  ],explain:'The two long faces are parallel, so the angle inside the glass is r at both faces. The ray leaves at the angle it went in: parallel to the incident ray, shifted sideways.'});
}
{
  const body=act('rect','Predict','The weak reflection','');
  createPredict({host:body,q:'A little light reflects off the top of the block where the ray goes in at i = 40°. What is the angle of reflection?',options:[
    {text:'40°, measured from the normal',correct:true},
    {text:'50°, measured from the surface',why:'The angle of reflection is measured from the normal, like the angle of incidence.'},
    {text:'25°, the same as the angle r',why:'r is for the ray that goes into the glass. A reflected ray obeys the law of reflection.'},
    {text:'80°, twice the angle of incidence',why:'80° is the angle between the incident and reflected rays, not the angle of reflection.'}
  ],explain:'The law of reflection: the angle of incidence equals the angle of reflection, both measured from the normal. So it is 40°.'});
}

/* ================= 4. SEMICIRCULAR BLOCK ================= */
{
  const body=act('semi','Predict','Aim at the centre','');
  createPredict({host:body,q:'Why must the ray be aimed through the curved side at the centre of the flat face?',options:[
    {text:'It travels along a radius, so it does not bend going in',correct:true},
    {text:'It reflects off the curved side, back towards the centre',why:'The ray goes through the curved side. Along a radius it meets that side along the normal.'},
    {text:'So that the angle of incidence is always 90° at the flat face',why:'The angle at the flat face changes as you turn the ray box. That is what you measure.'},
    {text:'The centre of the flat face is the brightest part of the block',why:'Brightness has nothing to do with it. It is about where the ray bends.'}
  ],explain:'A radius meets a circle at 90°, so the ray meets the curved side along the normal and does not bend. All the bending then happens at the flat face, where you measure the angles.'});
}
{
  const body=act('semi','Sort','What happens at the flat face?','This glass has a critical angle of 42°. Sort each angle of incidence inside the glass, at the flat face, then press Check.');
  createSortGame({host:body,cats:[
    {id:'o',label:'Refracts out (and a weak reflection)',color:'--c1',soft:'--c1-soft'},
    {id:'t',label:'Total internal reflection',color:'--c2',soft:'--c2-soft'}
  ],items:[
    {id:'1',text:'20° in the glass',cat:'o'},
    {id:'2',text:'35° in the glass',cat:'o'},
    {id:'3',text:'40° in the glass',cat:'o'},
    {id:'4',text:'45° in the glass',cat:'t'},
    {id:'5',text:'60° in the glass',cat:'t'},
    {id:'6',text:'75° in the glass',cat:'t'}
  ]});
}
{
  const body=act('semi','Predict','The critical angle','');
  createPredict({host:body,q:'What is the critical angle?',options:[
    {text:'The angle of incidence in the glass that gives an angle of refraction of 90°',correct:true},
    {text:'The angle between the ray and the surface when light first goes into the glass',why:'Angles are measured from the normal, and the critical angle is for light inside the glass, going out.'},
    {text:'The angle of incidence at which all of the light is refracted out of the glass',why:'It is the other way round: above the critical angle, none of the light is refracted out.'},
    {text:'The biggest angle of incidence that a ray box can make with the flat face',why:'A ray box can be turned to any angle. The critical angle depends on the glass.'}
  ],explain:'At the critical angle the refracted ray runs along the surface (angle of refraction 90°). Above it, there is total internal reflection.'});
}
{
  const body=act('semi','Predict','When does it happen?','');
  createPredict({host:body,q:'Which two conditions give total internal reflection?',options:[
    {text:'Glass to air, with i bigger than c',correct:true},
    {text:'Air to glass, with i bigger than c',why:'Going into glass the light slows down and can always get in. It must be going from glass to air.'},
    {text:'Glass to air, with i smaller than c',why:'Below the critical angle most of the light refracts out.'},
    {text:'Air to glass, with i smaller than c',why:'That is ordinary refraction into the glass.'}
  ],explain:'Total internal reflection needs light going from a material with a higher refractive index to a lower one (glass to air), with an angle of incidence bigger than the critical angle.'});
}

/* ================= 5. PRISMS ================= */
{
  const body=act('prisms','Predict','A 45° prism','');
  createPredict({host:body,q:'A ray goes into a short side of a 45° prism along the normal. What happens when it meets the long side?',options:[
    {text:'Total internal reflection: 45° is more than 42°',correct:true},
    {text:'It refracts out into the air: 45° is less than 90°',why:'Compare the angle with the critical angle (42°), not with 90°.'},
    {text:'It passes straight out through the long side',why:'It meets the long side at 45°, not along the normal.'},
    {text:'Half of it reflects and half of it refracts out',why:'Above the critical angle there is no refracted ray at all.'}
  ],explain:'The ray meets the long side at 45°. For glass the critical angle is about 42°, so all the light is reflected and the ray turns through 90°. Two such prisms make a periscope.'});
}
{
  const body=act('prisms','Predict','White light','');
  createPredict({host:body,q:'Why does a triangular prism split white light into a spectrum?',options:[
    {text:'Each colour is refracted by a different amount',correct:true},
    {text:'The glass of the prism adds colours to the light',why:'White light already contains all the colours. The prism only separates them.'},
    {text:'Only some colours are reflected back inside',why:'All the colours come out. They leave at different angles.'},
    {text:'The colours reflect off the prism at new angles',why:'The colours are separated by refraction, at both faces.'}
  ],explain:'Each colour has a slightly different refractive index, so each is refracted by a different amount. Violet is refracted most and red least: this is dispersion. The two faces are not parallel, so the colours spread further apart.'});
}
{
  const body=act('prisms','Predict','Which colour bends most?','');
  createPredict({host:body,q:'In the spectrum from a prism, which colour is refracted the most?',options:[
    {text:'Violet: its refractive index is biggest',correct:true},
    {text:'Red: its refractive index is the biggest',why:'Red has the smallest refractive index, so it is refracted least.'},
    {text:'Red: because its wavelength is longest',why:'Red does have the longest wavelength, but that makes it refracted the least.'},
    {text:'None: every colour bends by the same amount',why:'If they all bent the same, white light would stay white.'}
  ],explain:'Violet has the biggest refractive index in glass, so it slows down most and is refracted most. Red is refracted least.'});
}
{
  const body=act('prisms','Match','Uses of total internal reflection','Pair each use with how total internal reflection helps. Drag one card onto the other, or tap one card and then the other.');
  createMatchGame({host:body,leftTitle:'Use',rightTitle:'How it works',pairs:[
    {id:'f',l:'Optical fibre in communications',r:'Light reflects again and again inside a thin glass strand, carrying signals'},
    {id:'e',l:'Endoscope',r:'A bundle of fibres carries light into the body and an image back out'},
    {id:'p',l:'Periscope with two 45° prisms',r:'Each prism turns the light through 90°, so you can see over a wall'},
    {id:'b',l:'Binoculars',r:'Prisms turn the light back through 180°, making them shorter'},
    {id:'c',l:'Bicycle reflector',r:'Light from car headlights is sent back towards the car'}
  ]});
}
{
  const body=act('prisms','Predict','An optical fibre','');
  createPredict({host:body,q:'Why does light stay inside an optical fibre, even round a bend?',options:[
    {text:'It meets the side at more than c, every time',correct:true},
    {text:'The glass absorbs light that tries to escape',why:'Absorbed light would be lost. In a fibre it is reflected and carried along.'},
    {text:'Light can only travel in a straight line',why:'The fibre bends, and the light follows it by reflecting off the sides.'},
    {text:'The fibre has a mirror coating on the outside',why:'No coating is needed: the reflection is total internal reflection.'}
  ],explain:'The fibre core has a higher refractive index than its surroundings, and the light meets the side at more than the critical angle. So it is totally internally reflected every time it hits the side.'});
}

/* ================= 6. CALCULATE ================= */
{
  const body=act('calculate','Calculate','Using n = [[sin i|sin r]] and sin c = [[1|n]]','Give each answer to 3 significant figures, in the unit shown.');
  createCalc({host:body,questions:[
    {q:'A ray goes into a glass block with i = 50° and r = 30.7°. The refractive index of the glass is',unit:'',answer:1.5,working:'n = [[sin i|sin r]]<br>n = [[sin 50°|sin 30.7°]]<br>n = [[0.7660|0.5105]]<br>n = 1.50'},
    {q:'Light goes into glass of refractive index 1.50 with i = 35°. The angle of refraction is',unit:'°',answer:22.5,working:'n = [[sin i|sin r]]<br>1.50 = [[sin 35°|sin r]]<br>sin r = [[sin 35°|1.50]]<br>sin r = [[0.5736|1.50]]<br>sin r = 0.3824<br>r = 22.5°'},
    {q:'Glass has a refractive index of 1.50. Its critical angle is',unit:'°',answer:41.8,working:'sin c = [[1|n]]<br>sin c = [[1|1.50]]<br>sin c = 0.6667<br>c = 41.8°'},
    {q:'The critical angle for water is 48.8°. The refractive index of water is',unit:'',answer:1.33,working:'sin c = [[1|n]]<br>sin 48.8° = [[1|n]]<br>0.7524 = [[1|n]]<br>n = [[1|0.7524]]<br>n = 1.33'}
  ]});
}

/* ================= 7. ACCURACY AND SAFETY ================= */
{
  const body=act('accuracy','Sort','Better results or safer?','Sort each card into the right bin, then press Check.');
  createSortGame({host:body,cats:[
    {id:'a',label:'Better results',hint:'More accurate angles',color:'--c1',soft:'--c1-soft'},
    {id:'s',label:'Keeps people safe',hint:'Protects people and equipment',color:'--c3',soft:'--c3-soft'}
  ],items:[
    {id:'1',text:'Mark the crosses on each ray far apart',cat:'a'},
    {id:'2',text:'Use a narrow ray from a single slit',cat:'a'},
    {id:'3',text:'Use a sharp pencil for thin lines',cat:'a'},
    {id:'4',text:'Measure each angle from the normal, not the surface',cat:'a'},
    {id:'5',text:'Do not touch the ray box: it gets hot',cat:'s'},
    {id:'6',text:'Never look straight into a laser beam',cat:'s'},
    {id:'7',text:'Handle the glass block carefully: chipped edges are sharp',cat:'s'}
  ]});
}
{
  const body=act('accuracy','Predict','Crosses far apart','');
  createPredict({host:body,q:'Why should the two crosses on each ray be far apart?',options:[
    {text:'A small slip in a cross changes the angle less',correct:true},
    {text:'So that the ray looks brighter on the white paper',why:'Where you put the crosses does not change the light.'},
    {text:'So that the protractor fits in between the crosses',why:'The protractor goes on the normal where the ray meets the block.'},
    {text:'So that the light does not reflect off the pencil',why:'The pencil marks do not affect the light.'}
  ],explain:'Each cross can be off by a millimetre or so. With the crosses far apart, that error turns the line through a much smaller angle, so the angles you measure are more accurate.'});
}
{
  const body=act('accuracy','Predict','Measured from the surface','');
  createPredict({host:body,q:'Sophie measures 50° between the incident ray and the surface of the block. What is the angle of incidence?',options:[
    {text:'40°, because i is measured from the normal',correct:true},
    {text:'50°, because that is the angle she measured',why:'She measured from the surface. Angles of incidence are measured from the normal.'},
    {text:'130°, the angle on the other side of the ray',why:'An angle of incidence is never more than 90°.'},
    {text:'90°, because the normal is at 90° to the surface',why:'90° is the angle between the normal and the surface, not the ray.'}
  ],explain:'The normal is at 90° to the surface, so i = 90° − 50° = 40°.'});
}

/* ================= 8. EXAM PRACTICE ================= */
{
  const body=act('exam','Exam style','A semicircular block','Charlie shines a ray through the curved side of a semicircular glass block, towards the centre of the flat face. He measures the angle in the glass and the angle in the air. One reading is missing.');
  const tbl=mk('div','table-scroll');
  tbl.innerHTML='<table class="units res-tbl"><thead><tr><th>Angle in the glass (°)</th><th>10</th><th>20</th><th>30</th><th>35</th><th>40</th><th>45</th></tr></thead><tbody><tr><th>Angle in the air (°)</th><td>15.3</td><td>31.3</td><td>49.5</td><td><b>?</b></td><td>77.7</td><td>no ray</td></tr></tbody></table>';
  body.appendChild(tbl);
  body.appendChild(mk('p','sub','(a) 1 mark'));
  body.appendChild(mk('p','','Name the piece of equipment Charlie uses to measure the angles.'));
  answerBox(body,'<ul><li>A protractor.</li></ul>');
  body.appendChild(mk('p','sub','(b) 3 marks'));
  createCalc({host:body,questions:[
    {q:FR('The glass has a refractive index of 1.52. Use n = [[sin (angle in air)|sin (angle in glass)]] to find the missing angle in the air.'),unit:'°',answer:60.7,working:'n = [[sin (angle in air)|sin (angle in glass)]]<br>1.52 = [[sin r|sin 35°]]<br>sin r = 1.52 × sin 35°<br>sin r = 1.52 × 0.5736<br>sin r = 0.8718<br>r = 60.7°'}
  ]});
  body.appendChild(mk('p','sub','(c) 2 marks'));
  body.appendChild(mk('p','','Explain why the ray does not bend where it goes into the curved side of the block.'));
  answerBox(body,'<ul><li>The ray travels along a radius, so it meets the curved surface along the normal.</li><li>The angle of incidence is 0°, so the angle of refraction is 0°: no change of direction.</li></ul>');
  body.appendChild(mk('p','sub','(d) 3 marks'));
  createCalc({host:body,questions:[
    {q:'Calculate the critical angle of the glass (n = 1.52).',unit:'°',answer:41.1,working:'sin c = [[1|n]]<br>sin c = [[1|1.52]]<br>sin c = 0.6579<br>c = 41.1°'}
  ]});
  body.appendChild(mk('p','sub','(e) 3 marks'));
  body.appendChild(mk('p','','Explain why there is no ray in the air when the angle in the glass is 45°.'));
  answerBox(body,'<ul><li>The light is totally internally reflected.</li><li>45° is greater than the critical angle (41.1°).</li><li>The light is going from glass into air, from a higher to a lower refractive index (it would speed up).</li></ul><p class="sub">Each point scores. "It reflects" alone does not: say total internal reflection.</p>');
  body.appendChild(mk('p','sub','(f) 5 marks'));
  body.appendChild(mk('p','','Charlie then uses a rectangular block. Describe how he should trace the ray and measure the angles of incidence and refraction. You may draw a diagram.'));
  answerBox(body,'<ul><li>Put the block on paper and draw round it.</li><li>Shine a narrow ray from a ray box (or laser) at the block, at an angle to the normal.</li><li>Mark the incident ray and the emergent ray with two crosses each, far apart.</li><li>Remove the block, join the crosses, and join the entry and exit points to show the ray inside.</li><li>Draw the normal at the point where the ray goes in.</li><li>Measure the angle of incidence and the angle of refraction from the normal with a protractor.</li><li>Repeat for a range of angles of incidence.</li></ul><p class="sub">Any five points score. A labelled diagram showing the normal, i and r can score too.</p>');
  body.appendChild(mk('p','sub','(g) 3 marks'));
  body.appendChild(mk('p','','A periscope uses two glass prisms with angles of 45°, 45° and 90°. Explain how a prism turns the light through 90°.'));
  answerBox(body,'<ul><li>The light goes into a short side along the normal, so it does not bend.</li><li>It meets the long side at an angle of incidence of 45°, which is more than the critical angle (about 42°).</li><li>So it is totally internally reflected, and leaves through the other short side at 90° to its first direction.</li></ul>');
}
