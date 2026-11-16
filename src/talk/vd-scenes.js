/* Section IV — Vertex Degree. Reproducible RGG demo and smooth animated degree reordering.
   Does not modify the shared slide 8–10 graph model. */
const VDScenes=(()=>{
 'use strict';
 const G=id=>document.getElementById(id), {svg,clamp}=Model;
 const st={seed:10000,meanN:180,mu:2.3,k:10,world:null,layout:null,visible:false,raf:0,paused:false,initialized:false,graphVersion:-1,bindDone:false,currentPage:0,animationFrom:0,animationTarget:0,animationStarted:0};
 const COLORS={ink:'#2e5366',edge:'#81a9b7',node:'#377f98',clique:'#e39b55',select:'#217d99',frame:'#d5e4e9',axis:'#93a7b0'};
 const svgGroup=(root,attrs={})=>svg('g',attrs,root);
 const text=(parent,x,y,value,attrs={})=>{const el=svg('text',{x,y,fill:COLORS.ink,'font-family':'Aptos, Segoe UI, sans-serif',...attrs},parent);el.textContent=value;return el;};
 const mk=()=>{
   st.world=Model.makeRGG(st.seed,st.mu,st.meanN,st.k);
   st.layout=null;st.graphVersion=-1;
   st.visible=false;st.animationFrom=0;st.animationTarget=0;
 };
 function ensure(){if(!st.world)mk();if(st.bindDone)return;
   const mu=G('vd-mu-slider'),k=G('vd-k-slider');
   mu.addEventListener('input',e=>{
     stop();st.mu=clamp(+e.target.value,.5,20);st.world.mu=st.mu;
     Model.rebuildRGG(st.world);Model.choosePlanted(st.world);
     st.layout=null;st.graphVersion=-1;
     render(15,1);
   });
   k.addEventListener('input',e=>{
     stop();st.k=clamp(+e.target.value,2,10);st.world.k=st.k;
     Model.choosePlanted(st.world); // preserves ordered 10-candidate prefix
     render(15,1);
   });
   st.bindDone=true;
 }
 const degrees=(edges,n)=>{const d=new Int32Array(n);for(const [a,b] of edges){d[a]++;d[b]++;}return d;};
 const sortDegrees=d=>Array.from(d,(_,i)=>i).sort((a,b)=>d[b]-d[a]||a-b);
 function counts(){const o=st.world,original=degrees(o.base,o.N),planted=degrees(o.allEdges,o.N),baseOrder=sortDegrees(original),plantOrder=sortDegrees(planted),truth=o.plantedSet;
   const top=plantOrder.slice(0,o.k),matched=top.filter(x=>truth.has(x)).length;
   return {original,planted,baseOrder,plantOrder,matched,success:matched===o.k,top:new Set(top)};
 }
 function layout(){const o=st.world;if(st.layout&&st.graphVersion===o.graphVersion)return st.layout;
   // Kamada–Kawai of the observed natural topology: freeze this layout when planting
   // so audiences can follow each vertex while degrees and bars reorder.
   const inp={seed:o.seed,N:o.N,mu:o.mu,k:0,graphVersion:o.graphVersion,allEdges:o.base,kkCache:null};
   st.layout=Model.kkLayout(inp);st.graphVersion=o.graphVersion;return st.layout;
 }
 const alpha=(a,b,t)=>a+(b-a)*t;
 const ease=t=>t*t*(3-2*t);
 function paintGraph(id,frac,opts={}){
   const root=G(id);if(!root)return;root.replaceChildren();const o=st.world,p=layout(),margin=28;
   const W=opts.compact?550:(opts.small?536:568),H=opts.compact?172:(opts.small?330:418),cx=opts.compact?23:(opts.small?24:34),cy=opts.compact?13:(opts.small?19:27);
   const pos=i=>({x:cx+p[i].x*W,y:cy+p[i].y*H});
   svg('rect',{x:12,y:10,width:opts.compact?568:(opts.small?568:609),height:opts.compact?192:(opts.small?345:456),rx:10,fill:'#f8fbfc',stroke:'#e1edf0','stroke-width':1.1},root);
   const bg=svgGroup(root,{'stroke-linecap':'round'});
   for(const [a,b] of o.base){const pa=pos(a),pb=pos(b);svg('line',{x1:pa.x,y1:pa.y,x2:pb.x,y2:pb.y,stroke:COLORS.edge,'stroke-opacity':opts.small?.31:.39,'stroke-width':opts.small?1.1:1.25},bg);}
   if(frac>0.001){const fg=svgGroup(root,{'stroke-linecap':'round'});for(const [a,b] of o.added){const pa=pos(a),pb=pos(b);svg('line',{x1:pa.x,y1:pa.y,x2:pb.x,y2:pb.y,stroke:COLORS.clique,'stroke-opacity':.92*frac,'stroke-width':opts.small?2.1:2.35},fg);}}
   const count=counts(),showPicks=opts.showPicks;
   for(let i=0;i<o.N;i++){
     const q=pos(i),planted=o.plantedSet.has(i),picked=count.top.has(i)&&showPicks&&frac>.75;
     if(picked)svg('circle',{cx:q.x,cy:q.y,r:opts.small?6.6:7.8,fill:'none',stroke:COLORS.select,'stroke-width':1.75,'stroke-opacity':.92},root);
     svg('circle',{cx:q.x,cy:q.y,r:opts.small?2.6:3.15,fill:COLORS.node,stroke:'#fff','stroke-width':.55},root);
     if(planted&&frac>.001)svg('circle',{cx:q.x,cy:q.y,r:opts.small?4.15:4.9,fill:COLORS.clique,'fill-opacity':frac,stroke:'#fff','stroke-opacity':frac,'stroke-width':1.05},root);
   }
   if(!opts.small&&!opts.compact){text(root,320,478,'N = '+o.N+'  ·  Same vertex identities before and after planting',{'font-size':14,'text-anchor':'middle',fill:'#7893a0'});}
 }
 function paintBars(id,frac,opts={}){
   const root=G(id);if(!root)return;root.replaceChildren();const o=st.world,c=counts(),n=o.N;
   const W=opts.compact?640:(opts.small?648:654),H=opts.compact?250:(opts.small?356:479),left=28,right=12,top=opts.compact?15:24,bottom=opts.compact?29:(opts.small?41:46);
   const chartH=H-top-bottom-3,chartW=W-left-right;
   const maxV=Math.max(8,...c.planted)+1;
   const prev=new Int32Array(n),next=new Int32Array(n);
   c.baseOrder.forEach((id,i)=>prev[id]=i);c.plantOrder.forEach((id,i)=>next[id]=i);
   const fracE=ease(clamp(frac,0,1));
   const w=chartW/n,gap=n>150?.4:.65;
   for(let v=0;v<n;v++){
     const x=left+alpha(prev[v],next[v],fracE)*w;
     const val=alpha(c.original[v],c.planted[v],fracE);
     const bh=Math.max(1,val/maxV*chartH),planted=o.plantedSet.has(v),isTop=c.top.has(v)&&frac>.90;
     svg('rect',{x:x+.2,y:top+chartH-bh,width:Math.max(.7,w-gap),height:bh,rx:Math.min(1.3,w/5),fill:planted?'#e5a264':'#5b92ab','fill-opacity':planted?.35+.65*frac:'.82',stroke:isTop&&opts.showPicks?'#126d88':'none','stroke-width':isTop?1.3:0},root);
   }
   const boundaryX=left+o.k*w;
   if(opts.showCutoff){svg('line',{x1:boundaryX,y1:top-4,x2:boundaryX,y2:top+chartH+2,stroke:'#d39a4b','stroke-width':1.8,'stroke-dasharray':'5 4'},root);
     text(root,boundaryX-7,17,'TOP k',{'text-anchor':'end','font-size':14,'font-weight':770,fill:'#c58942'});}
   svg('line',{x1:left,y1:top+chartH,x2:W-right,y2:top+chartH,stroke:'#a4b6bf','stroke-width':1.4},root);
   text(root,W/2,H-11,'Vertices sorted by decreasing degree',{'text-anchor':'middle','font-size':14,fill:'#718d9d'});
   text(root,11,top+chartH/2,'Degree',{'font-size':13,fill:'#718d9d','text-anchor':'middle',transform:`rotate(-90 11 ${top+chartH/2})`});
   const upper=maxV-1;text(root,left,top+11,String(upper),{'font-size':12,fill:'#8da3ae'});
 }
 function paintSlide11(frac){
   const step=Number(G('slide').dataset.step),c=counts();
   paintGraph('vd11-graph',frac,{showPicks:step>=2});
   paintBars('vd11-bars',frac,{showCutoff:step>=2,showPicks:step>=2});
   G('vd11-graph-state').textContent=frac>.5?'PLANTED GRAPH':'NATURAL GRAPH';
   G('vd11-rank-state').textContent=frac>.5?'AFTER PLANTING':'BEFORE PLANTING';
   G('vd11-metrics').textContent=step>=2?`${c.matched} / ${st.k} planted vertices in top-k`:'Bars track the same vertices throughout';
   G('vd11-result').textContent=c.success?'The top-k vertices exactly match the planted set.':`Only ${c.matched} of the ${st.k} planted vertices rank in the top-k.`;
   G('vd11-result-symbol').textContent=c.success?'✓':'×';
   G('vd11-result-symbol').style.background=c.success?'#d8efe2':'#f9e2e0';
 }
 function paintSlide12(){const step=+G('slide').dataset.step;paintBars('vd12-bars',1,{compact:true,showCutoff:step>=2,showPicks:step>=2});paintGraph('vd12-graph',1,{small:true,compact:true,showPicks:step>=2});}
 function movePhase(){const dot=G('vd15-phase-dot'),ring=G('vd15-phase-ring');if(!dot||!ring)return;
   const x=12+543*(st.mu-.5)/19.5,y=15+114*(10-st.k)/8;
   for(const el of [dot,ring]){el.setAttribute('cx',String(x));el.setAttribute('cy',String(y));}
 }
 function paintSlide15(frac){const c=counts(),o=st.world;
   paintGraph('vd15-graph',frac,{small:true,showPicks:true});paintBars('vd15-bars',frac,{small:true,showCutoff:true,showPicks:true});
   G('vd15-graph-status').textContent=frac>.5?'PLANTED':'NATURAL';
   G('vd15-ranking-status').textContent=`N = ${o.N} · TOP ${o.k}`;
   G('vd-mu-value').textContent=st.mu.toFixed(1);G('vd-k-value').textContent=String(st.k);
   G('vd-mu-slider').value=String(st.mu);G('vd-k-slider').value=String(st.k);
   const status=G('vd15-status');status.classList.toggle('failure',!c.success&&frac>.5);status.classList.toggle('success',c.success&&frac>.5);
   const headline=status.querySelector('b'),detail=status.querySelector('span');
   if(frac<.5){headline.textContent='UNPLANTED RGG';detail.textContent='The original graph contains only natural edges.';}
   else{headline.textContent=c.success?'EXACT RECOVERY':'RECOVERY FAILS';detail.textContent=`${c.matched} of ${st.k} planted vertices belong to the top-${st.k}.`;}
   movePhase();
 }
 function render(page,frac){if(page===11)paintSlide11(frac);else if(page===12)paintSlide12();else if(page===15)paintSlide15(frac);}
 function stop(){if(st.raf)cancelAnimationFrame(st.raf);st.raf=0;}
 function transition(page,target,instant=false){stop();target=target?1:0;
   const from=st.animationFrom ?? (st.visible?1:0);st.visible=!!target;st.animationTarget=target;
   if(instant||Math.abs(target-from)<.001){st.animationFrom=target;render(page,target);return;}
   const t0=performance.now(),dur=920;
   const tick=now=>{const u=Math.min(1,(now-t0)/dur);const frac=alpha(from,target,ease(u));st.animationFrom=frac;render(page,frac);
     if(u<1&&!st.paused){st.raf=requestAnimationFrame(tick);}else{st.animationFrom=target;st.raf=0;render(page,target);}};
   st.raf=requestAnimationFrame(tick);
 }
 function enter(page,context={}){ensure();st.currentPage=page;stop();
   if(page===11){
     // A new explanatory example, deliberately distinct from the slide 8–10 state.
     if(context.oldPage===10){st.seed=10000;st.mu=2.3;st.k=10;mk();}
     transition(11,+G('slide').dataset.step>=1,true);
   } else if(page===12){transition(12,true,true);}
   else if(page===15){transition(15,true,true);}else if(page===13||page===14){st.animationFrom=st.visible?1:0;}
 }
 function leave(page){stop();}
 function trigger(page){if(![11,15].includes(page))return;transition(page,!st.visible,false);}
 function reroll(page){if(![11,15].includes(page))return;stop();st.seed+=137; if(page===11){st.mu=2.3;st.k=10;}mk();transition(page,page===15?1:(+G('slide').dataset.step>=1),true);}
 function pause(flag){st.paused=!!flag;if(flag&&st.raf){stop();st.animationFrom=st.animationTarget;render(st.currentPage,st.animationTarget);}}
 return {enter,leave,trigger,reroll,pause,render,state:st};
})();
