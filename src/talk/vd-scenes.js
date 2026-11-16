/* Section IV (slides 11–15). 100-vertex conditional RGG demonstration.
   Fixed vertex identities, honest natural degrees, orange added-degree segments.
   The mathematical model and the state on slides 8–10 are untouched. */
const VDScenes=(()=>{
 'use strict';
 const $=id=>document.getElementById(id), svg=Model.svg, clamp=Model.clamp;
 const BLUE='#5c94ad', ORANGE='#de9854', NODE='#3a8ca1', EDGE='#8ab2bd';
 const st={seed:9000,n:100,mu:4.5,k:10,world:null,layout:null,layoutVersion:-1,
   stepBoost:0,stepSort:0,displayBoost:0,displaySort:0,visible:true,raf:0,paused:false,
   initialized:false,bindDone:false,currentPage:0,renderVersion:0};
 function createWorld(){
   const random=Model.rng(st.seed^0x42a1f4bc);
   const pts=Array.from({length:st.n},(_,id)=>({id,x:random(),y:random()}));
   st.world={seed:st.seed,meanN:st.n,N:st.n,pts,mu:st.mu,k:st.k,graphVersion:0};
   Model.rebuildRGG(st.world);Model.choosePlanted(st.world);
   st.layout=null;st.layoutVersion=-1;
 }
 function ensure(){if(!st.world)createWorld();if(st.bindDone)return;
   const mu=$('vd-mu-slider'),k=$('vd-k-slider');
   if(mu)mu.addEventListener('input',e=>{
     stop();st.mu=clamp(+e.target.value,.5,19);st.world.mu=st.mu;
     Model.rebuildRGG(st.world);Model.choosePlanted(st.world);st.layout=null;
     st.displayBoost=st.visible?1:0;st.displaySort=st.visible?1:0;paintSlide15();
   });
   if(k)k.addEventListener('input',e=>{
     stop();st.k=clamp(+e.target.value,2,10);st.world.k=st.k;
     Model.choosePlanted(st.world); // Uses a frozen ordered candidate list.
     st.displayBoost=st.visible?1:0;st.displaySort=st.visible?1:0;paintSlide15();
   });
   st.bindDone=true;
 }
 function degrees(edges,N){const arr=new Int32Array(N);for(const [i,j] of edges){arr[i]++;arr[j]++;}return arr;}
 function sort(d){return Array.from(d,(_,i)=>i).sort((a,b)=>d[b]-d[a]||a-b);}
 function measures(){const o=st.world,base=degrees(o.base,o.N),full=degrees(o.allEdges,o.N);
   const baseOrder=sort(base),newOrder=sort(full),top=newOrder.slice(0,o.k),correct=top.filter(v=>o.plantedSet.has(v)).length;
   return {base,full,baseOrder,newOrder,correct,success:correct===o.k};
 }
 function kk(){const o=st.world;if(st.layout&&st.layoutVersion===o.graphVersion)return st.layout;
   const inp={seed:o.seed,N:o.N,mu:o.mu,k:0,graphVersion:o.graphVersion,allEdges:o.base,kkCache:null};
   st.layout=Model.kkLayout(inp);st.layoutVersion=o.graphVersion;return st.layout;
 }
 function linear(a,b,t){return a+(b-a)*t;}
 function ease(t){return t*t*(3-2*t);}
 function txt(root,x,y,v,a={}){const t=svg('text',{x,y,'font-family':'Aptos,Segoe UI,sans-serif',fill:'#5e7887',...a},root);t.textContent=v;return t;}
 // BARS: vertical bars with fixed vertex identities. Blue = natural degree,
 // orange = new neighbours, stacked on TOP. x-order animates only at step 3.
 function bars(id,boost,orderShift,options={}){
   const root=$(id);if(!root)return;root.replaceChildren();
   const o=st.world,c=measures(),N=o.N;
   const W=780,H=548,L=61,R=20,T=54,B=49,
      chartW=W-L-R,chartH=H-T-B,baseY=T+chartH,
      slot=chartW/N,barW=Math.max(4.05,slot-2.0),maxD=Math.max(1,...c.full)+2;
   svg('rect',{x:L-8,y:T-10,width:chartW+12,height:chartH+20,rx:7,fill:'#f7fbfc'},root);
   const rankBase=new Int16Array(N),rankNew=new Int16Array(N);
   c.baseOrder.forEach((v,i)=>rankBase[v]=i);c.newOrder.forEach((v,i)=>rankNew[v]=i);
   for(let j=0;j<=4;j++){
     const d=Math.round(maxD*j/4),y=baseY-d/maxD*chartH;
     svg('line',{x1:L-3,y1:y,x2:W-R,y2:y,stroke:'#a4bfcb','stroke-opacity':j===0?.8:.35,'stroke-width':j===0?1.4:1},root);
     txt(root,L-13,y+6,String(d),{'font-size':17,'font-weight':630,'text-anchor':'end',fill:'#6e8b99'});
   }
   const order=ease(clamp(orderShift,0,1)),b=clamp(boost,0,1);
   for(let v=0;v<N;v++){
     const rank=linear(rankBase[v],rankNew[v],order),x=L+rank*slot+(slot-barW)/2,
       baseH=c.base[v]/maxD*chartH,
       bonusH=(c.full[v]-c.base[v])/maxD*chartH*b;
     svg('rect',{x,y:baseY-baseH,width:barW,height:Math.max(.6,baseH),rx:.65,fill:BLUE,'fill-opacity':.91},root);
     if(bonusH>.12)svg('rect',{x,y:baseY-baseH-bonusH,width:barW,height:bonusH,rx:.65,fill:ORANGE,'fill-opacity':.99},root);
   }
   svg('line',{x1:L,y1:baseY,x2:W-R,y2:baseY,stroke:'#66899a','stroke-width':1.6},root);
   if(options.cutoff){
     const x=L+o.k*slot;
     svg('line',{x1:x,y1:T-7,x2:x,y2:baseY+7,stroke:'#7f8991','stroke-width':2.2,'stroke-dasharray':'7 5','stroke-opacity':.86},root);
     txt(root,x+12,T+22,'top-k',{'font-size':29,'font-weight':790,'text-anchor':'start',fill:'#526f7e'});
   }
   txt(root,9,30,'Degree',{'font-size':28,'font-weight':760,fill:'#456d83'});
   txt(root,(L+W-R)/2,H-7,'Vertices ordered by degree',{'font-size':19,'font-weight':710,'text-anchor':'middle',fill:'#536f81'});
 }
 function graph(id,boost){
   const root=$(id);if(!root)return;root.replaceChildren();
   const o=st.world,p=kk(),ox=24,oy=27,SX=562,SY=475;
   const pos=i=>({x:ox+p[i].x*SX,y:oy+p[i].y*SY});
   svg('rect',{x:12,y:12,width:586,height:516,rx:8,fill:'#f7fbfc',stroke:'#e5edf0'},root);
   const bg=svg('g',{'stroke-linecap':'round'},root);
   for(const [i,j] of o.base){const a=pos(i),b=pos(j);svg('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,
     stroke:EDGE,'stroke-width':1.22,'stroke-opacity':.46},bg);}
   if(boost>.005){const fg=svg('g',{'stroke-linecap':'round'},root);
     for(const [i,j] of o.added){const a=pos(i),b=pos(j);svg('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,
       stroke:ORANGE,'stroke-width':2.1,'stroke-opacity':.8*boost},fg);}}
   const nodes=svg('g',{},root);
   for(let i=0;i<o.N;i++){
     const q=pos(i),selected=o.plantedSet.has(i),r=selected&&boost>.005?3.9:3.1;
     svg('circle',{cx:q.x,cy:q.y,r,fill:selected&&boost>.005?ORANGE:NODE,
       'fill-opacity':selected&&boost>.005?.5+.5*boost:1,
       stroke:'#fff','stroke-opacity':.92,'stroke-width':.85},nodes);
   }
 }
 function paintSlide11(){const step=Number($('slide').dataset.step);
   graph('vd11-graph',st.displayBoost);bars('vd11-bars',st.displayBoost,st.displaySort,{cutoff:step>=2});
   $('vd11-graph-state').textContent=step===0?'NATURAL GRAPH':'PLANTED CLIQUE';
   $('vd11-rank-state').textContent=step===0?'NATURAL DEGREES':step===1?'DEGREES AFTER PLANTING':'REORDERED DEGREES';
 }
 function paintSlide12(){const step=Number($('slide').dataset.step);bars('vd12-bars',1,1,{cutoff:step>=2});}
 function marker(){
   // The diagram is asymptotic, while the demo fixes n=100: position is schematic.
   const g=$('vd15-marker'),ring=$('vd15-ring'),dot=$('vd15-dot');if(!g||!ring||!dot)return;
   const x=75+620*clamp(Math.log(st.mu/.06)/Math.log(1200/.06),0,1),
         y=371-307*clamp(Math.log(st.k)/Math.log(5000),0,1);
   for(const el of [ring,dot]){el.setAttribute('cx',x.toFixed(2));el.setAttribute('cy',y.toFixed(2));}
   g.style.display='';
 }
 function paintSlide15(){
   const c=measures(),b=st.displayBoost,s=st.displaySort;
   graph('vd15-graph',b);bars('vd15-bars',b,s,{cutoff:true});
   $('vd-mu-value').textContent=st.mu.toFixed(1);$('vd-mu-slider').value=st.mu.toFixed(1);
   $('vd-k-value').textContent=String(st.k);$('vd-k-slider').value=String(st.k);
   $('vd15-graph-status').textContent=b>.5?'PLANTED':'NATURAL';
   $('vd15-left-heading').textContent=Number($('slide').dataset.step)>=1?'RECOVERY REGIMES':'NETWORK';
   $('vd15-ranking-status').textContent=b>.5?`${c.correct} / ${st.k} RECOVERED`:'NATURAL DEGREES';
   const status=$('vd15-status'),label=status.querySelector('b'),detail=$('vd15-result-detail');
   status.classList.toggle('failure',b>.5&&!c.success);
   if(b<.5){label.textContent='UNPLANTED RGG';detail.textContent='Natural degree ranking';}
   else{label.textContent=c.success?'EXACT RECOVERY':'RECOVERY FAILS';detail.textContent=`${c.correct} / ${st.k} planted vertices in top-${st.k}`;}
   marker();
 }
 function render(page){if(page===11)paintSlide11();else if(page===12)paintSlide12();else if(page===15)paintSlide15();}
 function stop(){if(st.raf)cancelAnimationFrame(st.raf);st.raf=0;}
 function animate(page,boost,sortShift,instant=false){
   stop();const a=st.displayBoost,b=st.displaySort, B=boost,S=sortShift;
   if(instant||st.paused||Math.abs(a-B)+Math.abs(b-S)<.001){st.displayBoost=B;st.displaySort=S;render(page);return;}
   const start=performance.now(),duration=960;
   function frame(now){const t=ease(clamp((now-start)/duration,0,1));st.displayBoost=linear(a,B,t);st.displaySort=linear(b,S,t);render(page);
     if(t<.999){st.raf=requestAnimationFrame(frame);}else{st.raf=0;st.displayBoost=B;st.displaySort=S;render(page);}}
   st.raf=requestAnimationFrame(frame);
 }
 function enter(page,context={}){
   ensure();st.currentPage=page;
   if(page===11){
     // Begin a NEW narrative example on normal forward navigation from slide 10.
     if(context.oldPage!==11){st.seed=9000;st.mu=4.5;st.k=10;createWorld();}
     const step=Number($('slide').dataset.step),same=context.oldPage===11;
     animate(11,step>=1?1:0,step>=2?1:0,!same);
   }else if(page===12){st.displayBoost=1;st.displaySort=1;render(12);}
   else if(page===15){
     // Moving from 14 to 15 starts with the same model, then permits exploration.
     st.visible=true;st.displayBoost=1;st.displaySort=1;paintSlide15();
   }else stop();
 }
 function leave(){stop();}
 function trigger(page){if(page!==15)return;st.visible=!st.visible;animate(15,st.visible?1:0,st.visible?1:0);}
 function reroll(page){if(page!==11&&page!==15)return;
   stop();st.seed+=137;
   if(page===11){st.mu=4.5;st.k=10;}
   createWorld();
   if(page===11){let tries=0;while(!measures().success&&tries++<120){st.seed+=1;createWorld();}}
   st.visible=true;
   const step=Number($('slide').dataset.step);
   animate(page,page===11&&step===0?0:1,page===11&&step<2?0:1,true);
 }
 function pause(v){st.paused=!!v;if(v&&st.raf){stop();render(st.currentPage);}}
 return {enter,leave,trigger,reroll,pause,render,state:st,measures};
})();
