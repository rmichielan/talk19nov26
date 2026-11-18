/* Scientific conclusions, slides 22–25.
   22: conditional exact-n=300 RGG with observed Kamada–Kawai embedding and
       two synchronized qualitative phase diagrams. Theory is asymptotic!
   23: validated finite-n VD/CN (1000 runs/point), plus exploratory HC pilot (40 runs/point).
   25: reuse original 12-Nov animated cover, QR and institutional marks. */
const ConclusionScenes=(()=>{
 'use strict';
 const $=id=>document.getElementById(id),svg=Model.svg,clamp=Model.clamp;
 const st={mu:7.5,k:10,n:300,seed:551003,world:null,position:null,ready:false,timer:0,layoutCache:new Map(),chartMu:12};
 const C={blue:'#5a98ab',edge:'#80aabd',orange:'#db9450',green:'#3d9d77'};
 const fmt=n=>Number(n.toFixed(1));
 const nn=()=>st.n;
 function createWorld(newSeed=false){
   if(newSeed)st.seed+=417;
   const rand=Model.rng(st.seed^0x1a27e0c3),pts=Array.from({length:st.n},(_,id)=>({id,x:rand(),y:rand()}));
   const shuffled=Model.shuffle(st.n,Model.rng(st.seed^0x9b84a1e3));
   st.world={seed:st.seed,meanN:st.n,N:st.n,pts,k:st.k,mu:st.mu,graphVersion:0,plantedCandidates:shuffled.slice(0,30)};
   Model.rebuildRGG(st.world);Model.choosePlanted(st.world);
   st.layoutCache.clear();
 }
 // Common schematic coordinate system for both cropped v3 diagrams.
 // μ remains bounded by the original [0.5,55] simulator slider. The three
 // equally wide columns denote asymptotic regimes, not finite-n thresholds.
 function xCoord(mu){
   const low=0.5,mid=Math.log(st.n),high=3*mid,limit=55;
   const m=clamp(mu,low,limit);let t;
   if(m<=mid)t=Math.log(m/low)/Math.log(mid/low)/3;
   else if(m<=high)t=1/3+Math.log(m/mid)/Math.log(high/mid)/3;
   else t=2/3+Math.log(m/high)/Math.log(limit/high)/3;
   return 46+592*t;
 }
 // Crop only the displayed theoretical k range (1 ... 10^3.3), so
 // k=2...30 visibly moves the marker while the region geometry stays intact.
 function yCoord(k){return 178-(Math.log10(Math.max(1,k))/3.3)*(178-34);}
 function markers(page){
   if(page===22){for(const id of ['con22-vd-marker','con22-cn-marker']){
     const el=$(id);if(el)el.setAttribute('transform',`translate(${xCoord(st.mu).toFixed(1)},${yCoord(st.k).toFixed(1)})`);
   }}
 }
 function ensure(){
   if(!st.world)createWorld();if(st.ready)return;
   const m=$('con22-mu'),k=$('con22-k');
   m?.addEventListener('input',e=>{st.mu=clamp(+e.target.value,.5,55);if($('con22-mu-output'))$('con22-mu-output').textContent=st.mu.toFixed(1);markers(22);scheduleGraph();});
   k?.addEventListener('input',e=>{st.k=clamp(+e.target.value,2,30);if($('con22-k-output'))$('con22-k-output').textContent=st.k;markers(22);scheduleGraph();});
   document.querySelectorAll('#con23-mu-controls button[data-mu]').forEach(button=>button.addEventListener('click',()=>{st.chartMu=Number(button.dataset.mu);chart();}));
   // Enter/Space should toggle a focused summary natively, not advance the talk.
   document.querySelectorAll('.s23 .con23-alg > summary').forEach(summary=>summary.addEventListener('keydown',event=>{
     if(event.key==='Enter'||event.key===' ')event.stopPropagation();
   }));
   st.ready=true;
 }
 function scheduleGraph(){clearTimeout(st.timer);st.timer=setTimeout(()=>paintGraph(),135);}
 function pathLines(edges,pos){return edges.map(([i,j])=>{const a=pos[i],b=pos[j];return `M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b.x.toFixed(1)} ${b.y.toFixed(1)}`;}).join('');}
 function paintGraph(){
   if(!$('con22-graph'))return;
   st.world.mu=st.mu;st.world.k=st.k;Model.rebuildRGG(st.world);Model.choosePlanted(st.world);
   const o=st.world,root=$('con22-graph');root.replaceChildren();
   // True KK layout uses graph-theoretic distances on the observed graph.
   let pp=Model.kkLayout(o),pos=pp.map(p=>({x:28+p.x*635,y:20+p.y*424}));
   svg('rect',{x:13,y:8,width:664,height:460,rx:9,fill:'#f8fbfc',stroke:'#e4eff2'},root);
   svg('path',{d:pathLines(o.base,pos),stroke:C.edge,'stroke-width':o.base.length>4300?'.92':'1.35','stroke-opacity':o.base.length>4300?'.32':'.46',fill:'none','stroke-linecap':'round'},root);
   if(st.k<=8)svg('path',{d:pathLines(o.added,pos),stroke:'#ffe3bf','stroke-width':7,'stroke-opacity':.75,fill:'none','stroke-linecap':'round'},root);
   svg('path',{d:pathLines(o.added,pos),stroke:C.orange,'stroke-width':st.k>=18?'2.1':st.k<=8?'3.45':'2.65','stroke-opacity':st.k>=18?'.54':'.83',fill:'none','stroke-linecap':'round'},root);
   const nodeG=svg('g',{},root);
   for(let i=0;i<o.N;i++){const p=pos[i],active=o.plantedSet.has(i);svg('circle',{cx:p.x,cy:p.y,r:active?(st.k<=8?6.05:4.75):2.9,fill:active?C.orange:C.blue,stroke:active?'#fff':'#edf7f9','stroke-width':active?1.5:.55,'fill-opacity':active?1:.92},nodeG);}
   const stat=$('con22-readout');if(stat)stat.innerHTML=`Natural edges: <strong>${o.base.length.toLocaleString()}</strong> <span>·</span> Added edges: <strong>${o.added.length}</strong>`;
 }
 const dataset=RecoveryBenchmark;
 function text(root,x,y,content,attrs={}){const el=svg('text',{x,y,fill:'#526578','font-family':'Aptos,Segoe UI,Arial,sans-serif',...attrs},root);el.textContent=content;return el;}
 function chart(){
   const root=$('con23-curves');if(!root)return;
   const mu=st.chartMu;
   const L=91,T=26,W=867,H=370,B=T+H;
   const x=k=>L+(k-2)/38*W,y=rate=>B-clamp(rate,0,1)*H;
   const blue='#1f5aa8',orange='#e4792d',green='#218765';
   const showHC=Number(document.querySelector('.s23')?.dataset.step||0)>=1;
   root.replaceChildren();
   const subtitle=$('con23-selection-label');if(subtitle)subtitle.textContent=`μ = ${mu}`;
   const methodLabel=$('con23-method-detail');if(methodLabel)methodLabel.textContent=showHC?'VD/CN: 1,000 runs/point · HC*: 40 runs/point':'1,000 realizations per point';
   root.setAttribute('aria-label',`Exact recovery percentage against planted clique size for μ=${mu}; ${showHC?'VD, CN and exploratory HC':'VD and CN'}`);
   const contextDetail=$('con23-context-detail');if(contextDetail)contextDetail.textContent=showHC?'All three methods use topology, without access to vertex coordinates.':'Both algorithms use topology, without access to vertex coordinates.';
   document.querySelectorAll('#con23-mu-controls button[data-mu]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.mu)===mu)));
   // Five evenly spaced reference lines; percentages are raw success counts / 1000.
   for(let j=0;j<=5;j++){
     const v=j/5,py=y(v);
     svg('line',{x1:L,y1:py,x2:L+W,y2:py,stroke:'#dce5ef','stroke-width':j===0?1.45:1.05},root);
     text(root,L-17,py+6,`${20*j}%`,{'class':'plot-text','font-size':19,'text-anchor':'end','font-weight':620,fill:'#516a80'});
   }
   for(const k of [2,5,10,15,20,25,30,35,40]){
     const px=x(k);svg('line',{x1:px,y1:B,x2:px,y2:B+9,stroke:'#92aabe','stroke-width':1.5},root);
     text(root,px,B+35,String(k),{'class':'plot-text','font-size':19,'text-anchor':'middle','font-weight':650,fill:'#526578'});
   }
   svg('path',{d:`M${L} ${T-6}V${B}H${L+W}`,fill:'none',stroke:'#59758d','stroke-width':1.8},root);
   text(root,L+W/2,467,'Planted clique size  k',{'class':'plot-text','font-size':22,'text-anchor':'middle','font-weight':730,fill:'#12263b'});
   text(root,25,209,'Exact recovery (%)',{'class':'plot-text','font-size':20,'text-anchor':'middle','font-weight':730,fill:'#12263b',transform:'rotate(-90 25 209)'});
   for(const [alg,color] of [['VD',blue],['CN',orange]]){
     const values=dataset.curves.filter(r=>r.mu===mu&&r.algorithm===alg).sort((a,b)=>a.k-b.k);
     if(values.length!==39)throw new Error(`Missing exact-recovery observations for ${mu} ${alg}`);
     const line=values.map((p,i)=>`${i?'L':'M'}${x(p.k).toFixed(2)} ${y(p.rate).toFixed(2)}`).join(' ');
     svg('path',{d:line,stroke:color,'stroke-width':5.4,fill:'none','stroke-linejoin':'round','stroke-linecap':'round'},root);
     for(const p of values){
       // Plot all 39 observed values in the line, with sparse markers for projection clarity.
       const marker=(p.k===2||p.k===40||p.k%3===2);
       const cx=x(p.k),cy=y(p.rate);
       let node;
       if(marker){
         if(alg==='VD')node=svg('circle',{cx,cy,r:7.3,fill:'#ffffff',stroke:color,'stroke-width':3.7},root);
         else node=svg('path',{d:`M${cx.toFixed(2)} ${(cy-8.7).toFixed(2)} L${(cx+8.7).toFixed(2)} ${cy.toFixed(2)} L${cx.toFixed(2)} ${(cy+8.7).toFixed(2)} L${(cx-8.7).toFixed(2)} ${cy.toFixed(2)} Z`,fill:color,stroke:'#ffffff','stroke-width':1.6},root);
       }else node=svg('circle',{cx,cy,r:7,fill:'transparent',stroke:'none'},root);
       const tooltip=svg('title',{},node);tooltip.textContent=`${alg} · μ=${mu} · k=${p.k}: ${(p.rate*100).toFixed(1)}% (${p.success_count}/1000)`;
     }
   }
   // Add the exploratory third curve ONLY after the reveal. These are 19 actually
   // measured k values, not interpolated/fabricated trials at unmeasured k.
   // mu=4 uses exact HC; mu=12,36 uses the q=256 landmark approximation.
   if(showHC){
     const points=HCPilotBenchmark.curves.filter(p=>p.mu===mu).sort((a,b)=>a.k-b.k);
     if(points.length!==19)throw new Error(`Missing HC pilot observations for mu=${mu}`);
     const exact=mu===4;
     const line=points.map((p,i)=>`${i?'L':'M'}${x(p.k).toFixed(2)} ${y(p.rate).toFixed(2)}`).join(' ');
     const style={d:line,stroke:green,'stroke-width':5.5,fill:'none','stroke-linejoin':'round','stroke-linecap':'round'};
     svg('path',style,root);
     for(const p of points){
       const cx=x(p.k),cy=y(p.rate),r=9.1;
       const marker=svg('path',{d:`M${cx.toFixed(2)} ${(cy-r).toFixed(2)} L${(cx+r*.9).toFixed(2)} ${(cy+r*.70).toFixed(2)} L${(cx-r*.9).toFixed(2)} ${(cy+r*.70).toFixed(2)} Z`,stroke:'#fff','stroke-width':2.0,fill:green},root);
       const title=svg('title',{},marker);
       title.textContent=`HC ${exact?'(exact)':'(q=256 approximate)'} · μ=${mu} · k=${p.k}: ${(p.rate*100).toFixed(1)}% (${p.success_count}/${p.trials})`;
     }
   }
 }

 function resetPanelDetails(){
   const showHC=Number(document.querySelector('.s23')?.dataset.step||0)>=1;
   const vd=$('con23-detail-vd'),cn=$('con23-detail-cn'),hc=$('con23-detail-hc');
   if(vd)vd.open=!showHC;
   if(cn)cn.open=!showHC;
   if(hc)hc.open=showHC;
 }
 function enter(page){
   if(page===22){ensure();const m=$('con22-mu'),k=$('con22-k');if(m){m.value=st.mu;m.parentNode.querySelector('output').textContent=st.mu.toFixed(1);}if(k){k.value=st.k;k.parentNode.querySelector('output').textContent=st.k;}markers(22);paintGraph();}
   else if(page===23){ensure();resetPanelDetails();chart();}
 }
 function leave(page){if(page===22)clearTimeout(st.timer);}
 function trigger(page){if(page===22){createWorld(true);paintGraph();}}
 function reroll(page){if(page===22)trigger(page);}
 function pause(){}
 return {enter,leave,trigger,reroll,pause,state:st,chart,markers};
})();
