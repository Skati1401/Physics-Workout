// Crossword layout for createCrossword (the act() engine).
// Usage: node tools/crossword/layout.js ROWS COLS WORD WORD WORD ...
// Tries seeds 1, 2, 3 … until every word fits inside ROWS x COLS, then prints the grid and one
// {a, r, c, d} line per word to paste into the page (add each clue). Words must cross; no two
// words touch side by side. 15 key words of 5–12 letters needed 14 x 16 (2 Nov 2026); 13 x 13 failed.
function layout(words,rows,cols,seed){
  let s=seed>>>0||1;const rnd=()=>((s=(s*1664525+1013904223)>>>0)/4294967296);
  function attempt(){
    const g={},at=(r,c)=>g[r+','+c],placed=[];let box=null;
    const list=words.map((a,i)=>({a:a,i:i,k:rnd()})).sort((x,y)=>(y.a.length+y.k*4)-(x.a.length+x.k*4));
    const grow=(b,r,c,d,n)=>{const r2=r+d*(n-1),c2=c+(1-d)*(n-1);return b?[Math.min(b[0],r),Math.min(b[1],c),Math.max(b[2],r2),Math.max(b[3],c2)]:[r,c,r2,c2];};
    function fits(a,r,c,d){
      const dr=d,dc=1-d;let cross=0;
      if(at(r-dr,c-dc)||at(r+dr*a.length,c+dc*a.length))return -1;
      for(let k=0;k<a.length;k++){
        const rr=r+dr*k,cc=c+dc*k,ch=at(rr,cc);
        if(ch){if(ch!==a[k])return -1;cross++;continue;}
        if(at(rr+dc,cc+dr)||at(rr-dc,cc-dr))return -1;
      }
      return cross;
    }
    function put(x,r,c,d){for(let k=0;k<x.a.length;k++)g[(r+d*k)+','+(c+(1-d)*k)]=x.a[k];box=grow(box,r,c,d,x.a.length);placed.push({a:x.a,r:r,c:c,d:d});}
    let left=list.slice();put(left.shift(),0,0,rnd()<.5?0:1);
    for(let pass=0;pass<4&&left.length;pass++){
      const again=[];
      left.forEach(x=>{
        const opts=[];
        Object.keys(g).forEach(key=>{
          const p=key.split(',').map(Number);
          for(let k=0;k<x.a.length;k++){if(x.a[k]!==g[key])continue;
            for(const d of [0,1]){
              const r=p[0]-d*k,c=p[1]-(1-d)*k,cr=fits(x.a,r,c,d);if(cr<1)continue;
              const b=grow(box,r,c,d,x.a.length);if(b[2]-b[0]>=rows||b[3]-b[1]>=cols)continue;
              opts.push({r:r,c:c,d:d,v:cr*3+rnd()*4});
            }}
        });
        if(!opts.length){again.push(x);return;}
        opts.sort((p,q)=>q.v-p.v);put(x,opts[0].r,opts[0].c,opts[0].d);
      });
      left=again;
    }
    return {placed:placed,box:box,missed:left.map(x=>x.a)};
  }
  let best=null;
  for(let t=0;t<1500;t++){
    const o=attempt(),h=o.box[2]-o.box[0]+1,w=o.box[3]-o.box[1]+1;
    o.score=-o.missed.length*1000-Math.max(h,w)*10-h*w/10;
    if(!best||o.score>best.score)best=o;
  }
  return best;
}
const [R,C,...W]=process.argv.slice(2);
if(!W.length){console.log('Usage: node tools/crossword/layout.js ROWS COLS WORD WORD …');process.exit(1);}
const words=W.map(w=>w.toUpperCase());
for(let seed=1;seed<=40;seed++){
  const o=layout(words,+R,+C,seed);if(o.missed.length)continue;
  const g={};o.placed.forEach(p=>{for(let k=0;k<p.a.length;k++)g[(p.r+p.d*k)+','+(p.c+(1-p.d)*k)]=p.a[k];});
  for(let r=o.box[0];r<=o.box[2];r++){let s='';for(let c=o.box[1];c<=o.box[3];c++)s+=(g[r+','+c]||'.')+' ';console.log(s);}
  console.log('seed '+seed+', '+(o.box[2]-o.box[0]+1)+' rows x '+(o.box[3]-o.box[1]+1)+' columns');
  o.placed.forEach(p=>console.log("  {a:'"+p.a+"',r:"+(p.r-o.box[0])+",c:"+(p.c-o.box[1])+",d:'"+(p.d?'d':'a')+"',clue:''},"));
  process.exit(0);
}
console.log('No layout fits '+R+' x '+C+' with seeds 1–40. Try a bigger grid or fewer words.');process.exit(2);
