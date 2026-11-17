/* Section V · Common Neighbors. Uses the identical toroidal RGG geometry and
   planted-clique model as slides 8–10, conditional on exactly n=300 vertices. */
const CNScenes=(()=>{
 'use strict';
 const $=id=>document.getElementById(id), svg=Model.svg, clamp=Model.clamp;
 const st={seed:20261117,world:null,selectionNatural:null,selectionPlanted:null,naturalCursor:0,plantedCursor:0,
   naturalCandidates:[],plantedCandidates:[],view:{zoom:1,focusX:.5,focusY:.5},panX:0,panY:0,
   lastStep:0,raf:0,lastPage:0,drag:null,bound:false,paused:false};
 const palette={node:'#6a9fae',edge:'#88b5c1',neighbor:'#568eaa',focus:'#cf8241',common:'#e69b52',green:'#4d9679'};
 const pairKey=(a,b)=>a<b?`${a},${b}`:`${b},${a}`;
 const torPoint=(a,b)=>Math.hypot(Model.dtor(a.x,b.x),Model.dtor(a.y,b.y));
 const mid=(a,b)=>({x:Model.mod(a.x+Model.dtor(a.x,b.x)/2),y:Model.mod(a.y+Model.dtor(a.y,b.y)/2)});
 const dist=(a,b)=>torPoint(a,b);
 const rand=Model.rng;
 function neighbors(o){const adj=Array.from({length:o.N},()=>new Set());for(const [a,b] of o.allEdges){adj[a].add(b);adj[b].add(a);}return adj;}
 function common(adj,a,b){const aa=adj[a],bb=adj[b],out=[];for(const c of aa)if(bb.has(c))out.push(c);return out;}
 function clique(adj,ids){for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++)if(!adj[ids[i]].has(ids[j]))return false;return true;}
 function initWorld(seed){
   const uniform=rand(seed^0x42a1f4bc),N=300;
   const pts=Array.from({length:N},(_,id)=>({id,x:uniform(),y:uniform()}));
   const o={seed,meanN:300,N,pts,mu:7.5,k:10,graphVersion:0};
   Model.rebuildRGG(o);Model.choosePlanted(o);
   const adj=neighbors(o);
   const far=o.added.filter(([a,b])=>dist(o.pts[a],o.pts[b])>2*o.r+1e-8);
   const natural=o.base.filter(([a,b])=>!o.plantedSet.has(a)&&!o.plantedSet.has(b))
      .map(([a,b])=>({a,b,cn:common(adj,a,b)}));
   // Test actual Algorithm 2 on the selected seeded graph (not a claim about all n).
   let accepted=null;
   for(const [a,b] of o.allEdges){const ids=common(adj,a,b);
     if(ids.length===o.k-2&&clique(adj,ids)){accepted=new Set([a,b,...ids]);break;}
   }
   const recovered=accepted&&accepted.size===o.k&&o.planted.every(id=>accepted.has(id));
   const illustrative=natural.filter(e=>e.cn.length>=2&&!clique(adj,e.cn));
   const good=far.length>=5&&illustrative.length>=20&&recovered;
   return {o,adj,far,natural,illustrative,recovered,good};
 }
 function ensure(){
   if(st.world)return;
   let picked;
   for(let tries=0;tries<100;tries++){const res=initWorld(st.seed+tries);if(res.good){picked=res;st.seed+=tries;break;}if(!picked)picked=res;}
   st.world=picked.o;st.adj=picked.adj;st.recovered=!!picked.recovered;
   st.addedEdges=new Set(st.world.added.map(([a,b])=>pairKey(a,b)));
   const order=rand(st.seed^0x214fcb7);
   const sortByRand=a=>a.map(v=>({v,q:order()})).sort((a,b)=>a.q-b.q).map(e=>e.v);
   st.naturalCandidates=sortByRand(picked.natural);
   st.plantedCandidates=sortByRand(picked.far.map(([a,b])=>({a,b,cn:common(picked.adj,a,b)})));
   // A representative initial edge makes the first diagram pedagogically legible;
   // pressing R subsequently cycles through *all* eligible natural edges uniformly.
   st.selectionNatural=sortByRand(picked.illustrative)[0]||st.naturalCandidates[0]||null;
   st.selectionPlanted=st.plantedCandidates[0]||null;
   st.naturalCursor=0;st.plantedCursor=0;
   bind();
 }
 function bind(){if(st.bound)return;const s=$('cn16-graph');if(!s)return;
   s.addEventListener('pointerdown',ev=>{if(ev.button!==0)return;st.drag={x:ev.clientX,y:ev.clientY,panX:st.panX,panY:st.panY};s.setPointerCapture?.(ev.pointerId);});
   s.addEventListener('pointermove',ev=>{if(!st.drag)return;const rect=s.getBoundingClientRect(),scale=rect.width/914;
     // The actual network projection uses a 500-px basic torus side.
     const zoom=st.view.zoom;
     st.panX=st.drag.panX+(ev.clientX-st.drag.x)/Math.max(1,scale*500*zoom);
     st.panY=st.drag.panY+(ev.clientY-st.drag.y)/Math.max(1,scale*500*zoom);
     if(Math.abs(st.panX)>.5)st.panX=Model.dtor(0,st.panX%1);
     if(Math.abs(st.panY)>.5)st.panY=Model.dtor(0,st.panY%1);
     draw(slideStep());});
   const end=()=>st.drag=null;s.addEventListener('pointerup',end);s.addEventListener('pointercancel',end);
   st.bound=true;
 }
 function slideStep(){return +($('slide')?.dataset.step||0);}
 const cx=457,cy=256;
 function project(pt,view){
   const zoom=view.zoom;
   let wx=Model.dtor(view.focusX,pt.x)+st.panX;
   let wy=Model.dtor(view.focusY,pt.y)+st.panY;
   if(zoom<1.3){wx=Model.mod(wx+.5)-.5;wy=Model.mod(wy+.5)-.5;}
   return [cx+500*zoom*wx,cy+500*zoom*wy];
 }
 // Liang–Barsky segment clipping, applied to all periodic copies. This avoids
 // artificial long spokes along the cut of the flat-torus fundamental domain.
 function clipSegment(x0,y0,x1,y1,box){
   const [xmin,ymin,xmax,ymax]=box,dx=x1-x0,dy=y1-y0;
   let lo=0,hi=1;
   for(const [p,q] of [[-dx,x0-xmin],[dx,xmax-x0],[-dy,y0-ymin],[dy,ymax-y0]]){
     if(Math.abs(p)<1e-10){if(q<0)return null;continue;}
     const t=q/p;if(p<0){lo=Math.max(lo,t);if(lo>hi)return null;}
     else{hi=Math.min(hi,t);if(lo>hi)return null;}
   }
   if(hi-lo<1e-5)return null;
   return [x0+lo*dx,y0+lo*dy,x0+hi*dx,y0+hi*dy];
 }
 function edgeSegments(o,a,b,view){
   const side=500*view.zoom,A=o.pts[a],B=o.pts[b];
   const ax=Model.dtor(view.focusX,A.x)+st.panX,ay=Model.dtor(view.focusY,A.y)+st.panY;
   const dx=Model.dtor(A.x,B.x),dy=Model.dtor(A.y,B.y);
   const area=view.zoom<1.3?[cx-side/2,cy-side/2,cx+side/2,cy+side/2]:[0,0,914,526];
   const pieces=[];
   for(let ix=-1;ix<=1;ix++)for(let iy=-1;iy<=1;iy++){
     const x=cx+(ax+ix)*side,y=cy+(ay+iy)*side;
     const seg=clipSegment(x,y,x+dx*side,y+dy*side,area);
     if(seg)pieces.push(seg);
   }
   return pieces;
 }
 function draw(step){
   const root=$('cn16-graph');if(!root||!st.world)return;const o=st.world,v=st.view;
   root.replaceChildren();
   const selection=step>=4?st.selectionPlanted:st.selectionNatural;
   const hasSel=step>=1&&!!selection;
   const focusSet=new Set(),commonSet=new Set();
   if(hasSel){const {a,b,cn}=selection;focusSet.add(a);focusSet.add(b);
     if(step!==4){for(const t of st.adj[a])focusSet.add(t);for(const t of st.adj[b])focusSet.add(t);}
     cn.forEach(t=>commonSet.add(t));}
   const cnOn=step===3||step===6;
   const showBalls=step>=2&&step<=3;
   const zooming=step>=2&&step<=3;
   svg('rect',{x:0,y:0,width:914,height:526,rx:8,fill:'#f8fcfd'},root);
   const side=500*v.zoom;
   if(v.zoom<1.3){svg('rect',{x:cx-side/2,y:cy-side/2,width:side,height:side,fill:'none',stroke:'#bed6db','stroke-width':1.35},root);}
   else{
     const boundaryStart=project({x:0,y:0},v),mapX=boundaryStart[0],mapY=boundaryStart[1];
     for(let u=-1;u<=1;u++)for(let w=-1;w<=1;w++){
       const x=mapX+u*side,y=mapY+w*side;
       if(x>914||y>526||x+side<0||y+side<0)continue;
       svg('rect',{x,y,width:side,height:side,fill:'none',stroke:'#bed6db','stroke-width':1.15,'stroke-opacity':.3},root);
     }
   }
   const edgeLayer=svg('g',{},root),inducedLayer=svg('g',{},root),nodeLayer=svg('g',{},root),circleLayer=svg('g',{},root),topLayer=svg('g',{},root);
   const inViewport=([x,y,x2,y2])=>Math.max(x,x2)>=-16&&Math.min(x,x2)<=930&&Math.max(y,y2)>=-16&&Math.min(y,y2)<=542;
   // First, translucent context, then all retained induced edges on top.
   const activeNodes=new Set(hasSel?[...focusSet]:[]);
   const paintEdge=([a,b])=>{
     const isFocus=hasSel&&focusSet.has(a)&&focusSet.has(b),
       isOrange=cnOn&&hasSel&&(
         (commonSet.has(a)&&(commonSet.has(b)||b===selection.a||b===selection.b))||
         (commonSet.has(b)&&(commonSet.has(a)||a===selection.a||a===selection.b))||
         (step>=6&&o.plantedSet.has(a)&&o.plantedSet.has(b))
       );
     const isMain=hasSel&&((a===selection.a&&b===selection.b)||(a===selection.b&&b===selection.a));
     let alpha=hasSel?(isFocus?.92:((step===1||step>=4)?.19:.15)):.29,stroke=isFocus?'#769eaf':'#b5cbd3',width=isFocus?2.45:.92;
     if(isOrange){alpha=1;stroke=palette.common;width=3.5;}
     if(isMain){alpha=1;stroke=step>=4?'#d37e37':'#3a748c';width=5.0;}
     // Highlighted artificial connections are drawn as straight chords in the
     // fundamental square: unlike natural RGG edges they do not reflect geometric
     // proximity. In particular, the full highlighted planted clique remains
     // recognizable rather than being fragmented at the periodic cut.
     // Keep the same rendering rule as the latent-position slides 9 and 10:
     // any edge introduced by planting is a straight chord, not a periodic hop.
     // At the planted-edge reveal, all clique edges are straight for visual clarity.
     const directChord= v.zoom<1.3 && (st.addedEdges.has(pairKey(a,b)) || (step>=4&&o.plantedSet.has(a)&&o.plantedSet.has(b)));
     const pieces=directChord?[[...project(o.pts[a],v),...project(o.pts[b],v)]]:edgeSegments(o,a,b,v);
     for(const pos of pieces)svg('line',{x1:pos[0],y1:pos[1],x2:pos[2],y2:pos[3],stroke,'stroke-width':width,'stroke-opacity':alpha,'stroke-linecap':'round',class:'cn16-g-edge'},isFocus?inducedLayer:edgeLayer);
   };
   for(const edge of o.allEdges)paintEdge(edge);
   for(const p of o.pts){
     const [x,y]=project(p,v);if(x<-20||x>934||y<-20||y>546)continue;
     const endpoint=hasSel&&(p.id===selection.a||p.id===selection.b),isCommon=cnOn&&commonSet.has(p.id),isNeighbor=hasSel&&focusSet.has(p.id);
     let fill=isCommon?palette.common:endpoint?palette.focus:isNeighbor?palette.neighbor:palette.node,
         alpha=hasSel?(isNeighbor?1:((step===1||step>=4)?.31:.21)):.82,
         rad=endpoint?8.2:isCommon?7.0:isNeighbor?5.65:3.2;
     if(step===6&&o.plantedSet.has(p.id))rad=5.6;
     const g=endpoint?topLayer:nodeLayer;
     if(endpoint)svg('circle',{cx:x,cy:y,r:rad+5.1,fill:fill,'fill-opacity':.11,stroke:fill,'stroke-opacity':.65,'stroke-width':1.7},g);
     svg('circle',{cx:x,cy:y,r:rad,fill,'fill-opacity':alpha,stroke:'#fff','stroke-width':endpoint?1.2:.7,'stroke-opacity':alpha*.9,class:'cn16-g-node'},g);
   }
   if(hasSel&&showBalls){
     const radius=o.r*500*v.zoom;
     for(const q of [selection.a,selection.b]){
       const [x,y]=project(o.pts[q],v);
       svg('circle',{cx:x,cy:y,r:radius,class:'cn16-r-ring'},circleLayer);
     }
   }
   if(hasSel){
     const [a,b]=[selection.a,selection.b];
     const p1=project(o.pts[a],v),p2=project(o.pts[b],v);
     for(const p of [p1,p2])svg('circle',{cx:p[0],cy:p[1],r:8.2,fill:palette.focus,stroke:'#fff','stroke-width':1.4},topLayer);
   }
 }
 function setContent(step){
   const mode=$('cn16-mode'),label=$('cn16-label'),stat=$('cn16-stat'),cap=$('cn16-stat-caption'),story=$('cn16-story'),rule=$('cn16-rule');
   if(!mode)return;
   const sel=step>=4?st.selectionPlanted:st.selectionNatural;
   const n=sel?.cn.length;
   const stories=[
     'Which patterns can reveal an artificial clique when positions are hidden?',
     'Choose a natural edge. Highlight both endpoints, all their neighbors, and the induced edges.',
     'Zoom into the two neighborhoods. Natural common neighbors lie inside the overlap of the radius-r balls.',
     'The common neighbors inherit geometry: their induced subgraph need not be a clique.',
     'Now choose a newly planted edge. Its endpoints may be geometrically far apart.',
     'The endpoints share all other planted vertices, even though their geometric neighborhoods are disjoint.',
     'The common neighbors form the planted clique, together with the two endpoints.'
   ];
   mode.textContent=step>=4?'PLANTED EDGE':step>=1?'NATURAL EDGE':'300 VERTICES · LATENT POSITIONS';
   label.textContent=step>=4?'PLANTED COMMON NEIGHBORS':'GEOMETRY OF COMMON NEIGHBORS';
   stat.textContent=(step===3||step===6)?String(n??0):'';
   cap.textContent=step===0?'Common neighbors':step>=4?'Common neighbors · planted edge':'Common neighbors · natural edge';
   story.textContent=stories[clamp(step,0,6)];
   rule.style.opacity=step===0?'.3':step>=6?'1':'.72';
 }
 function animateView(next,step){cancelAnimationFrame(st.raf);
   const prev={...st.view},start=performance.now();const moving=Math.abs(prev.zoom-next.zoom)>.02||Math.abs(Model.dtor(prev.focusX,next.focusX))>.02||Math.abs(Model.dtor(prev.focusY,next.focusY))>.02;
   if(!moving||st.paused){st.view={...next};draw(step);return;}
   const dx=Model.dtor(prev.focusX,next.focusX),dy=Model.dtor(prev.focusY,next.focusY);
   const run=now=>{const t=clamp((now-start)/740,0,1),e=t*t*(3-2*t);st.view={zoom:prev.zoom+(next.zoom-prev.zoom)*e,
     focusX:Model.mod(prev.focusX+dx*e),focusY:Model.mod(prev.focusY+dy*e)};
     draw(step);if(t<1)st.raf=requestAnimationFrame(run);};st.raf=requestAnimationFrame(run);
 }
 function paint(step){setContent(step);const natural=st.selectionNatural;
   let view={zoom:1,focusX:.5,focusY:.5};
   if(step===2||step===3){const p=st.world.pts;const q=mid(p[natural.a],p[natural.b]);view={zoom:3.675,focusX:Model.mod(q.x+st.panX),focusY:Model.mod(q.y+st.panY)};}
   animateView(view,step);st.lastStep=step;
 }
 function enter(page,ctx){st.lastPage=page;if(page!==16)return;ensure();paint(ctx.step);}
 function leave(page){if(page===16){cancelAnimationFrame(st.raf);st.raf=0;st.drag=null;}}
 function reroll(page){if(page!==16)return;ensure();const step=slideStep();
   if(step>=4){if(st.plantedCandidates.length){st.plantedCursor=(st.plantedCursor+1)%st.plantedCandidates.length;st.selectionPlanted=st.plantedCandidates[st.plantedCursor];}}
   else{if(st.naturalCandidates.length){st.naturalCursor=(st.naturalCursor+1)%st.naturalCandidates.length;st.selectionNatural=st.naturalCandidates[st.naturalCursor];}}
   st.panX=st.panY=0;paint(step);
 }
 function trigger(page){if(page===16)reroll(16);}
 function pause(paused){st.paused=paused;if(paused){cancelAnimationFrame(st.raf);st.raf=0;}}
 return{enter,leave,reroll,trigger,pause,measure(){ensure();const o=st.world;return{N:o.N,mu:o.mu,k:o.k,r:o.r,naturalEdges:o.base.length,plantedEdges:o.added.length,
   naturalCN:st.selectionNatural?.cn.length,plantedCN:st.selectionPlanted?.cn.length,
   plantedDistance:st.selectionPlanted?torPoint(o.pts[st.selectionPlanted.a],o.pts[st.selectionPlanted.b]):null,
   seed:st.seed,zoom:st.view.zoom,cnRecovers:st.recovered};}};
})();
