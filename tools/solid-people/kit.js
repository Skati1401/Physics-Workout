// A standing person about 84 units tall, feet at (X0, FY0), drawn k times larger. o.girl: a solid dress and a ponytail;
// o.face: 1 looks right, -1 left; o.hands: where the two hands are, [[x, y], [x, y]] in the person's own units
// (x to the right of the feet, y up from the ground), the far arm first; o.top: the colour of the shirt or dress.
function figure(X0, FY0, k, o){
  o=o||{}; var f=o.face||1, g='', sk='var(--skin)', top=o.top||(o.girl?'var(--accent)':'var(--shirt)'), hi=o.top?top:(o.girl?top:'var(--shirt-hi)'), hy=-73;
  var hands=o.hands||[[-f*6,38],[f*7,38]];
  function arm(h){ var sx=f*1.5, syy=-58, ex=(sx+h[0])/2-f*1.5, ey=(syy-h[1])/2+5;   // shoulder, elbow, hand
    var straight=Math.hypot(h[0]-sx,-h[1]-syy)>20;
    return (straight ? tube(sx,syy,h[0],-h[1],5,o.girl?sk:top,o.girl?sk:hi) : tube(sx,syy,ex,ey,5,o.girl?sk:top,o.girl?sk:hi)+tube(ex,ey,h[0],-h[1],5,o.girl?sk:top,o.girl?sk:hi))+
      '<circle cx="'+f1(h[0])+'" cy="'+f1(-h[1])+'" r="3.2" fill="'+sk+'"/>'; }
  if(!o.noshadow) g+=ell(3,1,15,3.2,'#000',' opacity=".14"');
  g+=arm(hands[0]);
  if(o.girl) g+=tube(-4,-30,-4.5,-5,5.5,sk,sk)+tube(4,-30,4.5,-5,5.5,sk,sk);
  else g+=tube(-4.5,-36,-5,-5,7.5,'var(--jeans)','var(--jeans-hi)')+tube(4.5,-36,5,-5,7.5,'var(--jeans)','var(--jeans-hi)');
  g+=ell(-5+f*2.5,-2.5,6,3.2,'#23262c')+ell(5+f*2.5,-2.5,6,3.2,'#23262c');
  if(o.girl) g+='<path d="M-7.5,-61 Q0,-66 7.5,-61 L13,-24 L-13,-24 Z" fill="'+top+'"/><path d="M-7.5,-61 L-13,-24 L-7,-24 L-4,-62 Z" fill="#000" opacity=".15"/>';
  else g+=rect(-9,-63,18,30,top,' rx="6"')+rect(-9,-63,5.5,30,'#000',' rx="2.7" opacity=".16"')+rect(3.5,-60,3,20,'#fff',' rx="1.5" opacity=".2"');
  g+=rect(-2.6,-67,5.2,6,sk);
  if(o.girl) g+='<path d="M'+f1(-f*5)+','+f1(hy-5)+' Q'+f1(-f*17)+','+f1(hy-3)+' '+f1(-f*14)+','+f1(hy+16)+'" fill="none" stroke="var(--hair)" stroke-width="5.2" stroke-linecap="round"/>';
  g+='<circle cx="'+f1(-f*1.2)+'" cy="'+f1(hy-1)+'" r="9.6" fill="var(--hair)"/><circle cx="'+f1(f*1.6)+'" cy="'+f1(hy+1.2)+'" r="8" fill="'+sk+'"/><circle cx="'+f1(f*5.4)+'" cy="'+f1(hy+0.4)+'" r="1" fill="#23262c"/>';
  g+=arm(hands[1]);
  return '<g transform="translate('+f1(X0)+' '+f1(FY0)+') scale('+f1(k*100)/100+')">'+g+'</g>';
}
