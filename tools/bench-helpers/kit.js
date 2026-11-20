// glass with a liquid in it, drawn straight on: the liquid from its surface ys down to the bottom yb, then the glass in front
function liquid(cx,yb,rx,ry,ys,fill,top){
  return '<path d="M'+f1(cx-rx)+','+f1(ys)+' L'+f1(cx-rx)+','+f1(yb)+' A'+f1(rx)+','+f1(ry)+' 0 0 0 '+f1(cx+rx)+','+f1(yb)+' L'+f1(cx+rx)+','+f1(ys)+' z" fill="'+fill+'"/>'+ell(cx,ys,rx,ry,top||fill); }
function glass(cx,yb,rx,ry,yr){
  return '<path d="M'+f1(cx-rx)+','+f1(yr)+' L'+f1(cx-rx)+','+f1(yb)+' A'+f1(rx)+','+f1(ry)+' 0 0 0 '+f1(cx+rx)+','+f1(yb)+' L'+f1(cx+rx)+','+f1(yr)+'" fill="none" stroke="var(--glass)" stroke-width="2.6"/>'+
    '<ellipse cx="'+f1(cx)+'" cy="'+f1(yr)+'" rx="'+f1(rx)+'" ry="'+f1(ry)+'" fill="none" stroke="var(--glass)" stroke-width="2.2"/>'+
    ln(cx-rx+7,yr+12,cx-rx+7,yb-8,'#fff',2.8,' stroke-linecap="round" opacity=".55"'); }
// a close-up of a glass thermometer with 1 °C marks, for reading to 0.5 °C: the thread stands at T on the dashed line
function thermoClose(x,y,w,h,T,id,name){
  var z=h/12, cy=y+h/2, sx=x+w*0.66, g='', d;
  g+=rect(x,y,w,h,'var(--panel)',' stroke="var(--panel-border)" rx="10"');
  g+='<clipPath id="tc-'+id+'"><rect x="'+f1(x+3)+'" y="'+f1(y+3)+'" width="'+f1(w-6)+'" height="'+f1(h-6)+'" rx="8"/></clipPath><g clip-path="url(#tc-'+id+')">';
  g+=rect(sx-13,y-4,26,h+8,'var(--thermo)',' stroke="var(--ink-faint)" stroke-width="1.2"')+rect(sx-9,y-4,4,h+8,'#fff',' opacity=".6"');
  g+=rect(sx-4.5,cy,9,y+h-cy+4,'var(--thread)');
  for(d=Math.floor(T-7); d<=Math.ceil(T+7); d++){ var yy=cy-(d-T)*z, big=d%5===0;
    g+=ln(sx-13-(big?24:13),yy,sx-13,yy,'var(--ink)',big?1.7:1.1);
    if(big && yy>y+12 && yy<y+h-8) g+=txt(sx-13-29,yy+5,String(d).replace('-','−'),{a:'end',fs:14.5,c:'var(--ink)',w:600}); }
  g+=ln(x+8,cy,sx+13,cy,'var(--accent)',1.2,' stroke-dasharray="4 3"')+'</g>';
  return g+(name?txt(x+w/2,y+h+18,name,{a:'middle',fs:12.5,c:'var(--ink)'}):'');
}
// a Bunsen burner standing on the bench, its flame reaching up to gz
function bunsen(fx,bench,gz,on){
  var ty=bench-52, g='';
  g+='<path d="M'+f1(fx+20)+','+(bench-4)+' C'+f1(fx+60)+','+(bench-4)+' '+f1(fx+70)+','+(bench+3)+' '+f1(fx+104)+','+(bench+1)+'" fill="none" stroke="var(--hose)" stroke-width="6.5" stroke-linecap="round"/>';
  g+=ell(fx,bench-2,25,6.5,'var(--steel-sh)')+ell(fx,bench-5.5,25,6.5,'var(--steel)')+ell(fx-4,bench-7,15,3.4,'var(--steel-hi)',' opacity=".5"');
  g+=rect(fx-5.5,ty,11,bench-7-ty,'var(--steel)')+rect(fx-3.6,ty,2.6,bench-7-ty,'var(--steel-hi)',' opacity=".8"')+rect(fx+2.4,ty,3.1,bench-7-ty,'#000',' opacity=".2"')+
     rect(fx-8.5,bench-27,17,10,'var(--steel-sh)',' rx="2"')+ell(fx,bench-22,2.6,2.6,'#000',' opacity=".55"')+ell(fx,ty,5.5,1.8,'var(--steel-sh)');
  if(on){ var fh=ty-gz+1;
    g+='<path d="M'+f1(fx-7)+','+ty+' Q'+f1(fx-11)+','+f1(ty-fh*0.5)+' '+f1(fx)+','+f1(ty-fh)+' Q'+f1(fx+11)+','+f1(ty-fh*0.5)+' '+f1(fx+7)+','+ty+' z" fill="#3b82f6" opacity=".78"/>'+
       '<path d="M'+f1(fx-3.6)+','+ty+' Q'+f1(fx-4.6)+','+f1(ty-fh*0.3)+' '+f1(fx)+','+f1(ty-fh*0.55)+' Q'+f1(fx+4.6)+','+f1(ty-fh*0.3)+' '+f1(fx+3.6)+','+ty+' z" fill="#dbeafe" opacity=".95"/>'; }
  return g;
}
function hash(i){ var x=Math.sin(i*127.1+3.7)*43758.5453; return x-Math.floor(x); }
function clamp(v,a,b){ return Math.min(b,Math.max(a,v)); }
function vpt(svg,e){ var p=svg.createSVGPoint(); p.x=e.clientX; p.y=e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); }
