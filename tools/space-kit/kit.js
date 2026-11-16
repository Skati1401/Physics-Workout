/* Space kit (16 Nov 2026): the Sun, the Earth and the Moon for the Year 9 space animations (8L).
   Master copy: tools/space-kit/kit.js. Never edit the copy inside a page: edit this file, then run
     python3 tools/space-kit.py                  (refreshes every page that has the block)
     python3 tools/space-kit.py new-page.html    (adds the block to a new page in animations/)
   See tools/ANIMATION-STYLE.md, "The space kit".
   Every function returns SVG markup (a string) in the caller's own units, so a page can put it in any group.
   Colours are fixed, not theme tokens: space stays dark in both themes, like the dark window of star-life-cycle.html.
   Directions are given in picture terms: [right, down, towards the viewer]. */
var SK=(function(){
  'use strict';
  var uid=0;
  function f(n){ return String(Math.round(n*10)/10); }
  function nid(p){ return 'sk-'+p+(uid++); }
  function dot(a,b){ return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]; }
  function cross(a,b){ return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]; }
  function norm(a){ var l=Math.sqrt(dot(a,a))||1; return [a[0]/l,a[1]/l,a[2]/l]; }
  function hash(n){ var x=Math.sin(n*127.1+311.7)*43758.5453; return x-Math.floor(x); }
  function poly(pts){ return 'M'+pts.map(function(p){ return f(p[0])+' '+f(p[1]); }).join(' L')+' Z'; }

  // ---------- a dark window with fixed stars ----------
  // o.rx corner radius, o.seed, o.n number of stars (default about one per 2600 square units)
  function sky(x,y,w,h,o){
    o=o||{};
    var s='<rect x="'+f(x)+'" y="'+f(y)+'" width="'+f(w)+'" height="'+f(h)+'" rx="'+(o.rx==null?10:o.rx)+'" fill="#070b16"/>';
    var n=o.n==null?Math.round(w*h/2600):o.n, sd=o.seed||1;
    for(var i=0;i<n;i++){
      var a=hash(i*3+sd), b=hash(i*3+sd+1), c=hash(i*3+sd+2);
      s+='<circle cx="'+f(x+4+a*(w-8))+'" cy="'+f(y+4+b*(h-8))+'" r="'+f(0.5+c*1.1)+'" fill="#fff" opacity="'+(0.25+0.6*c).toFixed(2)+'"/>';
    }
    return s;
  }

  // ---------- text on a dark window: light with a dark edge ----------
  // o.a anchor (start|middle|end), o.fs size (default 13), o.w weight, o.col colour
  function txt(x,y,s,o){
    o=o||{};
    return '<text x="'+f(x)+'" y="'+f(y)+'" text-anchor="'+(o.a||'start')+'" font-size="'+(o.fs||13)+'"'+(o.w?' font-weight="'+o.w+'"':'')
      +' fill="'+(o.col||'#e8edf7')+'" paint-order="stroke" stroke="#070b16" stroke-width="3.5" stroke-linejoin="round" style="font-family:var(--font-mono,ui-monospace,monospace)">'+s+'</text>';
  }

  // ---------- the Sun ----------
  // o.glow glow radius as a multiple of r (default 2.1), o.clip id of a clipPath to keep the glow in a window
  function sun(x,y,r,o){
    o=o||{};
    var g=nid('sun'), k=o.glow==null?2.1:o.glow;
    return '<defs><radialGradient id="'+g+'a"><stop offset="0" stop-color="#fff3c4" stop-opacity=".85"/><stop offset=".45" stop-color="#ffc947" stop-opacity=".35"/><stop offset="1" stop-color="#ff8a1f" stop-opacity="0"/></radialGradient>'
      +'<radialGradient id="'+g+'b" cx=".4" cy=".38" r=".75"><stop offset="0" stop-color="#fffbe6"/><stop offset=".45" stop-color="#ffd84a"/><stop offset="1" stop-color="#f59e0b"/></radialGradient></defs>'
      +'<g'+(o.clip?' clip-path="url(#'+o.clip+')"':'')+'><circle cx="'+f(x)+'" cy="'+f(y)+'" r="'+f(r*k)+'" fill="url(#'+g+'a)"/>'
      +'<circle cx="'+f(x)+'" cy="'+f(y)+'" r="'+f(r)+'" fill="url(#'+g+'b)"/></g>';
  }

  // ---------- sunlight: parallel arrows ----------
  // from (x,y), travelling at angle ang (degrees, 0 = to the right, 90 = down), n arrows gap apart, each len long
  function rays(x,y,ang,len,n,gap,o){
    o=o||{};
    var a=ang*Math.PI/180, ux=Math.cos(a), uy=Math.sin(a), px=-uy, py=ux, s='', col=o.col||'#ffd84a';
    for(var i=0;i<n;i++){
      var k=(i-(n-1)/2)*gap, x0=x+px*k, y0=y+py*k, x1=x0+ux*len, y1=y0+uy*len;
      s+='<line x1="'+f(x0)+'" y1="'+f(y0)+'" x2="'+f(x1)+'" y2="'+f(y1)+'" stroke="'+col+'" stroke-width="'+(o.w||2)+'" stroke-linecap="round" opacity="'+(o.op||0.85)+'"/>'
        +'<path d="M'+f(x1+ux*7)+' '+f(y1+uy*7)+' L'+f(x1-px*4)+' '+f(y1-py*4)+' L'+f(x1+px*4)+' '+f(y1+py*4)+' Z" fill="'+col+'" opacity="'+(o.op||0.85)+'"/>';
    }
    return s;
  }

  // ---------- day and night on any sphere ----------
  // S: direction to the Sun, [right, down, towards the viewer]. Returns the outline of the dark part, or null when it is all lit.
  function nightPts(x,y,r,S,N,ro){
    S=norm(S); N=N||48; ro=ro||r;
    var sd=Math.sqrt(S[0]*S[0]+S[1]*S[1]), pts=[], i, t;
    if(sd<1e-6){
      if(S[2]>0) return null;
      for(i=0;i<2*N;i++){ t=Math.PI*i/N; pts.push([x+ro*Math.cos(t), y+ro*Math.sin(t)]); }
      return pts;
    }
    var d=[S[0]/sd,S[1]/sd], e=[-d[1],d[0]], k=S[2];
    for(i=0;i<=N;i++){ t=Math.PI*i/N; pts.push([x+r*(Math.cos(t)*e[0]-Math.sin(t)*k*d[0]), y+r*(Math.cos(t)*e[1]-Math.sin(t)*k*d[1])]); }   // the terminator
    for(i=(ro>r?0:1);i<=(ro>r?N:N-1);i++){ t=Math.PI*i/N; pts.push([x+ro*(-Math.cos(t)*e[0]-Math.sin(t)*d[0]), y+ro*(-Math.cos(t)*e[1]-Math.sin(t)*d[1])]); }   // the dark edge
    return pts;
  }
  // o.fill, o.op; o.soft: blur the line between day and night by this fraction of r (draw it inside a clip to the disc)
  function shade(x,y,r,S,o){
    o=o||{};
    var soft=o.soft&&r>=10?o.soft:0, pts=nightPts(x,y,r,S,48,soft?r*1.35:r), defs='', fl='';
    if(!pts) return '';
    if(soft){ var id=nid('blur'); fl=' filter="url(#'+id+')"'; defs='<defs><filter id="'+id+'" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="'+f(r*soft)+'"/></filter></defs>'; }
    return defs+'<path d="'+poly(pts)+'" fill="'+(o.fill||'#04060c')+'" opacity="'+(o.op==null?0.8:o.op)+'"'+fl+'/>';
  }
  // a smooth closed curve through points (Catmull-Rom)
  function smooth(P){
    var n=P.length, d='M'+f(P[0][0])+' '+f(P[0][1]);
    for(var i=0;i<n;i++){
      var p0=P[(i-1+n)%n], p1=P[i], p2=P[(i+1)%n], p3=P[(i+2)%n];
      d+=' C'+f(p1[0]+(p2[0]-p0[0])/6)+' '+f(p1[1]+(p2[1]-p0[1])/6)+' '+f(p2[0]-(p3[0]-p1[0])/6)+' '+f(p2[1]-(p3[1]-p1[1])/6)+' '+f(p2[0])+' '+f(p2[1]);
    }
    return d+' Z';
  }
  // a gradient centre moved towards the Sun, so the bright side of a ball faces the light
  function litCentre(S,dflt){
    if(!S) return dflt;
    var n=norm(S), k=0.3*(1-Math.max(0,n[2])*0.5);
    return [0.5+k*n[0], 0.5+k*n[1]];
  }

  // ---------- the Moon ----------
  // S: direction to the Sun from the Moon, in picture terms. o.night darkness of the unlit part (default .93),
  // o.rim draw a faint edge so a new moon can still be found (default true).
  // The face is the near side seen from the Earth (north up): the dark seas (maria) where they really are, craters
  // drawn on the ball (squashed near the edge) and shadowed on the side the light comes from, Tycho's bright rays
  // at full moon, a soft line between day and night.
  // Maria: [longitude, latitude, angular radius, seed] in degrees (east = right).
  var MARIA=[[-16,34,16,1],[-4,24,9,2],[17,27,10,3],[28,12,10,4],[38,4,9,5],[59,17,7,6],[52,-5,8,7],[34,-15,6,8],[-16,-20,10,9],[-38,-24,6,10],
    [-56,22,13,11],[-48,4,13,12],[-62,38,9,13],[-34,12,10,14],[-28,-6,8,15],[-62,-6,9,16],[-12,56,5,17],[8,57,5,18],[-30,52,6,19],[4,6,5,20]];
  // Craters: [longitude, latitude, angular radius, bright], bright = a young crater with a light floor (Tycho, Copernicus, Aristarchus, Kepler)
  var MCRAT=[[-11,-43,3.3,1],[-20,10,3.2,1],[-47,24,1.5,1],[-38,8,1.6,1],[-2,-60,5,0],[20,-50,4.5,0],[40,-30,3.5,0],[-5,-30,3,0],[60,-40,4,0],
    [-60,-10,3.5,0],[10,-20,3,0],[45,40,3.5,0],[-10,50,3.2,0],[70,5,4,0],[-75,-30,4,0],[25,-65,4,0],[-35,-50,3.5,0],[8,72,4,0],[-50,60,3.5,0],[65,-55,3.5,0]];
  function mPt(lon,lat){ var l=lon*Math.PI/180, p=lat*Math.PI/180; return [Math.cos(p)*Math.sin(l), -Math.sin(p), Math.cos(p)*Math.cos(l)]; }
  // a point a great-circle angle rho from the centre C, in direction t (east, then north)
  function mOff(lon,lat,rho,t){
    var l=lon*Math.PI/180, p=lat*Math.PI/180, C=mPt(lon,lat), E=[Math.cos(l),0,-Math.sin(l)], N=[-Math.sin(p)*Math.sin(l),-Math.cos(p),-Math.sin(p)*Math.cos(l)];
    var cr=Math.cos(rho), sr=Math.sin(rho), ct=Math.cos(t), st=Math.sin(t);
    return [C[0]*cr+(E[0]*ct+N[0]*st)*sr, C[1]*cr+(E[1]*ct+N[1]*st)*sr, C[2]*cr+(E[2]*ct+N[2]*st)*sr];
  }
  function moon(x,y,r,S,o){
    o=o||{};
    var g=nid('moon'), Sn=norm(S), lc=litCentre(S,[.42,.4]);
    var s='<defs><radialGradient id="'+g+'g" cx="'+lc[0].toFixed(3)+'" cy="'+lc[1].toFixed(3)+'" r=".75"><stop offset="0" stop-color="#f4f1e8"/><stop offset=".55" stop-color="#dcd7cb"/><stop offset="1" stop-color="#aaa598"/></radialGradient>'
      +'<radialGradient id="'+g+'l" cx=".5" cy=".5" r=".5"><stop offset=".7" stop-color="#5e5a52" stop-opacity="0"/><stop offset="1" stop-color="#5e5a52" stop-opacity=".28"/></radialGradient>'
      +'<clipPath id="'+g+'c"><circle cx="'+f(x)+'" cy="'+f(y)+'" r="'+f(r)+'"/></clipPath></defs>';
    s+='<circle cx="'+f(x)+'" cy="'+f(y)+'" r="'+f(r)+'" fill="url(#'+g+'g)"/><g clip-path="url(#'+g+'c)">';
    if(r>=4){
      // the seas: soft dark patches with wobbly edges, foreshortened towards the edge
      var sea='';
      MARIA.forEach(function(m){
        var pts=[], n=r>=20?18:10;
        for(var i=0;i<n;i++){
          var t=2*Math.PI*i/n, w=1+0.13*Math.sin(t*3+m[3])+0.07*(hash(m[3]*17+i)-0.5)*2, P=mOff(m[0],m[1],m[2]*w*Math.PI/180,t);
          if(P[2]<0){ var L=Math.sqrt(P[0]*P[0]+P[1]*P[1])||1; P=[P[0]/L,P[1]/L,0]; }
          pts.push([x+r*P[0], y+r*P[1]]);
        }
        sea+='<path d="'+smooth(pts)+'"/>';
      });
      var sb='';
      if(r>=20){ sb=nid('sea'); s+='<defs><filter id="'+sb+'" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="'+f(r*0.012)+'"/></filter></defs>'; }
      s+='<g fill="#8d8b86" opacity=".55"'+(sb?' filter="url(#'+sb+')"':'')+'>'+sea+'</g>';
    }
    if(r>=8){
      // craters: a darker bowl, the lit far wall, a light rim; the shadow falls on the side towards the Sun
      var sx=Sn[0], sy=Sn[1], small=r<30;
      MCRAT.forEach(function(c,i){
        if(small && !c[3] && i%2) return;
        var C=mPt(c[0],c[1]); if(C[2]<0.08) return;
        var q=[x+r*C[0], y+r*C[1]], R=r*Math.sin(c[2]*Math.PI/180)*(small?1.5:1), rot=Math.atan2(C[1],C[0])*180/Math.PI;
        if(R<0.8) return;
        var ry=R*C[2], tf=' transform="rotate('+f(rot)+' '+f(q[0])+' '+f(q[1])+')"';
        var ox=-sx*R*0.28, oy=-sy*R*0.28;   // the lit inner wall is on the side away from the Sun
        s+='<ellipse cx="'+f(q[0])+'" cy="'+f(q[1])+'" rx="'+f(ry)+'" ry="'+f(R)+'" fill="'+(c[3]?'#b9b4a8':'#a7a296')+'" stroke="#f3f0e7" stroke-width="'+f(Math.max(0.5,R*0.14))+'" stroke-opacity=".7"'+tf+'/>';
        s+='<ellipse cx="'+f(q[0]+ox)+'" cy="'+f(q[1]+oy)+'" rx="'+f(ry*0.72)+'" ry="'+f(R*0.72)+'" fill="'+(c[3]?'#f1eee5':'#c9c4b8')+'"'+tf.replace(f(q[0])+' '+f(q[1]),f(q[0]+ox)+' '+f(q[1]+oy))+'/>';
      });
      // Tycho's rays, which stand out at full moon
      var full=Math.max(0,Sn[2]);
      if(full>0.6 && r>=20){
        var T=mPt(-11,-43), tq=[x+r*T[0], y+r*T[1]], ray='';
        for(var k=0;k<9;k++){
          var ang=2*Math.PI*k/9+hash(k+40), len=r*(0.18+0.3*hash(k+60));
          ray+='<line x1="'+f(tq[0])+'" y1="'+f(tq[1])+'" x2="'+f(tq[0]+Math.cos(ang)*len)+'" y2="'+f(tq[1]+Math.sin(ang)*len*0.8)+'"/>';
        }
        s+='<g stroke="#fbfaf5" stroke-width="'+f(r*0.03)+'" stroke-linecap="round" opacity="'+(0.3*(full-0.6)/0.4).toFixed(2)+'">'+ray+'</g>';
      }
    }
    s+='<circle cx="'+f(x)+'" cy="'+f(y)+'" r="'+f(r)+'" fill="url(#'+g+'l)"/>';
    s+=shade(x,y,r,S,{fill:'#0b0e16',op:o.night==null?0.93:o.night,soft:0.035});
    s+='</g>';
    if(o.rim!==false) s+='<circle cx="'+f(x)+'" cy="'+f(y)+'" r="'+f(r)+'" fill="none" stroke="#5b6478" stroke-width="'+f(Math.max(0.8,r*0.02))+'" opacity=".7"/>';
    return s;
  }

  // ---------- the Earth: a globe with land, seen from any direction ----------
  // Rough coastlines, [latitude, longitude] in degrees, east and north positive. Good enough to see the land turn.
  var LAND=[
    [[70,-165],[71,-156],[70,-140],[69,-125],[73,-95],[68,-82],[63,-78],[60,-64],[52,-56],[47,-60],[44,-66],[41,-70],[35,-76],[30,-81],[25,-80],[30,-84],[29,-90],[29,-95],[26,-97],[22,-97],[19,-96],[18,-88],[21,-87],[16,-88],[15,-84],[11,-84],[9,-79],[8,-77],[8,-81],[13,-88],[16,-95],[20,-105],[23,-106],[31,-113],[23,-110],[32,-117],[38,-123],[43,-124],[48,-124],[55,-131],[59,-138],[60,-147],[58,-152],[55,-162],[60,-165],[65,-168]],
    [[12,-72],[11,-64],[8,-60],[5,-52],[0,-50],[-5,-36],[-8,-35],[-13,-38],[-23,-41],[-25,-48],[-34,-53],[-39,-58],[-41,-63],[-47,-66],[-52,-69],[-55,-67],[-54,-72],[-47,-75],[-38,-74],[-30,-71],[-18,-70],[-14,-76],[-5,-81],[-1,-80],[2,-79],[7,-77],[9,-76]],
    [[36,-9],[43,-9],[44,-1],[48,-5],[49,0],[51,2],[53,5],[54,9],[57,8],[56,12],[59,11],[58,6],[63,5],[70,20],[71,28],[69,40],[68,44],[66,40],[69,55],[73,70],[76,100],[77,105],[73,113],[71,130],[72,150],[69,161],[66,179],[62,179],[60,165],[57,163],[51,157],[59,155],[59,143],[54,140],[47,139],[42,133],[39,128],[35,129],[35,127],[38,125],[40,122],[37,120],[31,122],[25,119],[22,114],[21,108],[16,108],[10,106],[9,105],[13,100],[7,100],[2,103],[1,104],[5,100],[8,98],[16,97],[16,94],[22,91],[20,87],[15,80],[10,79],[8,77],[13,75],[19,73],[22,69],[25,66],[25,57],[27,56],[30,48],[24,51],[22,59],[17,55],[13,45],[17,42],[23,38],[28,35],[30,33],[31,32],[33,35],[36,36],[37,28],[41,27],[40,23],[38,22],[40,20],[45,13],[40,18],[38,16],[42,12],[44,9],[43,4],[42,3],[40,0],[37,-2],[36,-6]],
    [[35,-6],[37,10],[33,11],[31,20],[32,30],[31,32],[22,37],[15,40],[12,43],[11,51],[2,46],[-4,40],[-11,40],[-16,41],[-25,35],[-34,26],[-34,19],[-29,16],[-22,14],[-17,12],[-12,14],[-6,12],[-1,9],[4,9],[4,6],[6,1],[4,-8],[7,-13],[11,-16],[15,-17],[21,-17],[27,-13],[31,-10]],
    [[-12,49],[-16,50],[-25,47],[-25,44],[-16,44]],
    [[-11,132],[-12,137],[-17,141],[-11,142],[-19,146],[-25,153],[-33,152],[-38,148],[-38,141],[-35,136],[-32,133],[-35,118],[-31,115],[-22,114],[-20,119],[-15,125],[-14,129]],
    [[-34.5,173],[-37,176],[-39,178],[-41.5,175],[-39.5,174],[-37,174.5]],
    [[-40.5,173],[-42,174],[-44,173],[-46.5,169],[-46,166.5],[-43,170],[-41,172]],
    [[50,-5.5],[51,1.5],[53,0.3],[55.5,-1.6],[58.5,-3],[58.5,-5],[56,-6],[54.5,-3.4],[53,-4.5],[51.5,-5]],
    [[52,-10],[55,-7.5],[54,-6],[52,-6.3]],
    [[31,130],[34,136],[36,140],[41,141],[45,142],[43,145],[39,142],[35,140],[33,132]],
    [[7,117],[1,119],[-4,116],[-3,111],[1,109]],
    [[5,95],[-6,106],[-4,103],[2,99]],
    [[-1,131],[-6,141],[-10,148],[-8,143],[-4,134]]
  ];
  var ICE=[
    [[83,-35],[82,-20],[76,-19],[70,-22],[65,-38],[60,-43],[65,-52],[70,-54],[76,-68],[79,-70],[82,-60]],
    [[-66,0],[-70,30],[-67,60],[-66,90],[-66,120],[-68,150],[-72,170],[-78,-165],[-75,-140],[-73,-110],[-72,-80],[-64,-58],[-70,-60],[-77,-45],[-72,-15]]
  ];
  // Dry land drawn tan on top of the green: the Sahara and Arabia, central Asia, Australia, the south-west USA, the Kalahari.
  var DESERT=[
    [[30,-8],[32,8],[30,20],[31,29],[29,34],[30,46],[24,55],[18,52],[15,43],[17,33],[15,22],[16,8],[17,-4],[20,-15],[26,-13]],
    [[46,52],[47,64],[46,80],[45,95],[43,108],[39,103],[38,90],[40,74],[37,60]],
    [[-19,121],[-20,133],[-24,140],[-30,138],[-31,127],[-27,117],[-22,116]],
    [[38,-118],[37,-109],[31,-104],[29,-111],[33,-116]],
    [[-21,17],[-20,24],[-26,26],[-28,19]]
  ];
  // the sea ice round the North Pole
  var SEAICE=[[[84,-180],[82,-140],[85,-100],[81,-60],[83,-20],[81,20],[84,60],[81,100],[84,140],[82,170]]];
  // Cartoon clouds: puffy clusters [lat, lon, size in degrees], each a few round puffs on the surface, so they turn with the Earth.
  var CLOUDS=[[52,-35,7],[47,-155,6],[60,25,6],[45,160,6.5],[-48,-10,7],[-52,85,7],[-45,-170,6],[7,-25,4.5],[5,100,4.5],[9,-118,4.5],
    [-8,170,4.5],[32,-65,5],[-30,-88,5],[64,-145,5],[-62,-100,6],[20,60,4],[-20,40,4.5],[38,135,5]];
  // The frame of a globe. o.N: the direction of the North Pole, o.ref: the direction of longitude 0 before spinning
  // (default: towards the viewer), o.spin: how far it has turned, in degrees (the land moves east as spin grows).
  function frame(o){
    var n=norm(o.N||[0,-1,0]), ref=o.ref||[0,0,1];
    var m=[ref[0]-n[0]*dot(ref,n), ref[1]-n[1]*dot(ref,n), ref[2]-n[2]*dot(ref,n)];
    if(dot(m,m)<1e-6){ ref=[1,0,0]; m=[ref[0]-n[0]*dot(ref,n), ref[1]-n[1]*dot(ref,n), ref[2]-n[2]*dot(ref,n)]; }
    m=norm(m);
    // [right, down, towards the viewer] is a mirror-image frame, so east is a x n here (not n x a): this keeps the land the right way round.
    var s=(o.spin||0)*Math.PI/180, mn=cross(m,n);
    var a=[m[0]*Math.cos(s)+mn[0]*Math.sin(s), m[1]*Math.cos(s)+mn[1]*Math.sin(s), m[2]*Math.cos(s)+mn[2]*Math.sin(s)];
    return {n:n, a:a, b:cross(a,n)};
  }
  // a point on the surface (unit vector, picture terms) at a latitude and longitude
  function surf(F,lat,lon){
    var p=lat*Math.PI/180, l=lon*Math.PI/180, c=Math.cos(p);
    return [c*Math.cos(l)*F.a[0]+c*Math.sin(l)*F.b[0]+Math.sin(p)*F.n[0],
            c*Math.cos(l)*F.a[1]+c*Math.sin(l)*F.b[1]+Math.sin(p)*F.n[1],
            c*Math.cos(l)*F.a[2]+c*Math.sin(l)*F.b[2]+Math.sin(p)*F.n[2]];
  }
  // where a point of the globe is drawn; a point round the back is pushed out to the edge (for filled land)
  function proj(x,y,r,P,edge){
    if(edge && P[2]<0){ var l=Math.sqrt(P[0]*P[0]+P[1]*P[1])||1; return [x+r*P[0]/l, y+r*P[1]/l]; }
    return [x+r*P[0], y+r*P[1]];
  }
  // A line of latitude: the front part only. With S given, its day part and night part are told apart.
  function latLine(x,y,r,F,lat,o){
    o=o||{};
    var s='', run=[], runLit=null, N=120, S=o.S?norm(o.S):null;
    function flush(){
      if(run.length>1){
        var col=runLit===null?(o.col||'#ffffff'):(runLit?(o.day||'#ffd84a'):(o.night||'#1d2a4a'));
        s+='<polyline points="'+run.map(function(p){ return f(p[0])+','+f(p[1]); }).join(' ')+'" fill="none" stroke="'+col+'" stroke-width="'+(o.w||1.2)+'"'
          +(o.dash&&runLit!==false?' stroke-dasharray="'+o.dash+'"':'')+' stroke-linecap="round" opacity="'+(o.op==null?1:o.op)+'"/>';
      }
      run=[];
    }
    for(var i=0;i<=N;i++){
      var P=surf(F,lat,360*i/N), vis=P[2]>=0, lit=S?dot(P,S)>0:null;
      if(!vis){ flush(); runLit=null; continue; }
      if(S && run.length && lit!==runLit){ var last=run[run.length-1]; flush(); run.push(last); }
      runLit=lit; run.push(proj(x,y,r,P));
    }
    flush();
    return s;
  }
  // o: N, ref, spin (see frame); S direction to the Sun (no S: no night side); o.night darkness (default .62);
  // o.axis draw the axis through the poles (o.axisCol, o.axisLen as a multiple of r, o.poles to write N and S);
  // o.lats [{lat, col, day, night, w, dash, op}] lines of latitude (with day and night colours when o.S is given);
  // o.equator a faint equator; o.pins [{lat, lon, col}] places marked on the surface.
  function earth(x,y,r,o){
    o=o||{};
    var F=frame(o), g=nid('earth'), s='', lc=litCentre(o.S,[.42,.38]), w=f(Math.max(0.4,r*0.008));
    s+='<defs><radialGradient id="'+g+'o" cx="'+lc[0].toFixed(3)+'" cy="'+lc[1].toFixed(3)+'" r=".75"><stop offset="0" stop-color="#5ea6ef"/><stop offset=".6" stop-color="#2f6fc4"/><stop offset="1" stop-color="#1b4a92"/></radialGradient>'
      +'<radialGradient id="'+g+'h" cx=".5" cy=".5" r=".5"><stop offset=".78" stop-color="#bfe3ff" stop-opacity="0"/><stop offset="1" stop-color="#bfe3ff" stop-opacity=".42"/></radialGradient>'
      +'<clipPath id="'+g+'c"><circle cx="'+f(x)+'" cy="'+f(y)+'" r="'+f(r)+'"/></clipPath></defs>';
    if(r>=10) s+='<circle cx="'+f(x)+'" cy="'+f(y)+'" r="'+f(r*1.025)+'" fill="none" stroke="#7ec4ff" stroke-width="'+f(r*0.05)+'" opacity=".28"/>';   // the thin blue air
    s+='<circle cx="'+f(x)+'" cy="'+f(y)+'" r="'+f(r)+'" fill="url(#'+g+'o)"/><g clip-path="url(#'+g+'c)">';
    function land(list,fill,stroke,round,op){
      list.forEach(function(L){
        var Ps=L.map(function(q){ return surf(F,q[0],q[1]); });
        if(!Ps.some(function(P){ return P[2]>0; })) return;
        var pts=Ps.map(function(P){ return proj(x,y,r,P,true); });
        s+='<path d="'+(round?smooth(pts):poly(pts))+'" fill="'+fill+'"'+(stroke?' stroke="'+stroke+'" stroke-width="'+w+'" stroke-linejoin="round"':'')+(op?' opacity="'+op+'"':'')+'/>';
      });
    }
    land(LAND,'#68a94e','#4a8a3a');
    if(r>=10) land(DESERT,'#cdb875',null,true,.85);
    land(ICE,'#f1f6f9','#cfdbe3');
    if(r>=10) land(SEAICE,'#eef4f8',null,true,.9);
    if(r>=14){
      // clouds: clusters of round puffs, squashed towards the edge (front side only)
      var cl='';
      CLOUDS.forEach(function(c,i){
        for(var k=0;k<5;k++){
          var da=(k-2)*c[2]*0.75, db=c[2]*0.35*Math.sin(k*2.1+i), pr=c[2]*(k===2?0.75:0.5+0.15*hash(i*7+k));
          var P=surf(F,c[0]+db,c[1]+da/Math.max(0.3,Math.cos(c[0]*Math.PI/180)));
          if(P[2]<0.08) continue;
          var q=proj(x,y,r,P), R=r*Math.sin(pr*Math.PI/180), rot=Math.atan2(P[1],P[0])*180/Math.PI;
          cl+='<ellipse cx="'+f(q[0])+'" cy="'+f(q[1])+'" rx="'+f(R*P[2])+'" ry="'+f(R)+'" transform="rotate('+f(rot)+' '+f(q[0])+' '+f(q[1])+')"/>';
        }
      });
      s+='<g fill="#ffffff" opacity=".72">'+cl+'</g>';
    }
    if(o.equator) s+=latLine(x,y,r,F,0,{col:'#ffffff',w:1,dash:'3 4',op:.55});
    (o.lats||[]).forEach(function(L){ s+=latLine(x,y,r,F,L.lat,{S:L.split===false?null:o.S,col:L.col,day:L.day,night:L.night,w:L.w,dash:L.dash,op:L.op}); });
    s+='<circle cx="'+f(x)+'" cy="'+f(y)+'" r="'+f(r)+'" fill="url(#'+g+'h)"/>';   // haze at the edge
    if(o.S) s+=shade(x,y,r,o.S,{fill:'#030612',op:o.night==null?0.62:o.night,soft:0.04});
    s+='</g><circle cx="'+f(x)+'" cy="'+f(y)+'" r="'+f(r)+'" fill="none" stroke="#9fd0ff" stroke-width="'+f(Math.max(1,r*0.03))+'" opacity=".4"/>';
    (o.pins||[]).forEach(function(p){
      var P=surf(F,p.lat,p.lon); if(P[2]<-0.02) return;
      var q=proj(x,y,r,P), pr=Math.max(3,r*0.06);
      s+='<circle cx="'+f(q[0])+'" cy="'+f(q[1])+'" r="'+f(pr+1.6)+'" fill="#fff"/><circle cx="'+f(q[0])+'" cy="'+f(q[1])+'" r="'+f(pr)+'" fill="'+(p.col||'#ff4d4d')+'"/>';
    });
    if(o.axis){
      var L=o.axisLen||1.4, col=o.axisCol||'#e8edf7';
      [1,-1].forEach(function(sg){
        var n=[F.n[0]*sg,F.n[1]*sg,F.n[2]*sg], t0=1;
        if(n[2]<0){                       // this pole is round the back: the stick shows only outside the disc
          var pl=Math.sqrt(n[0]*n[0]+n[1]*n[1]); if(pl*L<=1) return; t0=1/pl;
        }
        var a=[x+r*n[0]*t0, y+r*n[1]*t0], b=[x+r*n[0]*L, y+r*n[1]*L];
        s+='<line x1="'+f(a[0])+'" y1="'+f(a[1])+'" x2="'+f(b[0])+'" y2="'+f(b[1])+'" stroke="'+col+'" stroke-width="'+f(Math.max(1.4,r*0.035))+'" stroke-linecap="round"/>';
        if(o.poles){
          var q=[x+r*n[0]*(L+0.18)+0, y+r*n[1]*(L+0.18)];
          s+=txt(q[0], q[1]+4, sg>0?'N':'S', {a:'middle', fs:o.poleFs||12, w:600});
        }
      });
    }
    return s;
  }
  // where a place is drawn on a globe drawn with the same o (and whether it can be seen)
  function place(x,y,r,o,lat,lon){ var P=surf(frame(o),lat,lon); var q=proj(x,y,r,P); return {x:q[0], y:q[1], z:P[2]}; }

  return {sky:sky, txt:txt, sun:sun, rays:rays, shade:shade, nightPts:nightPts, moon:moon, earth:earth, place:place, frame:frame, surf:surf, f:f, hash:hash};
})();
