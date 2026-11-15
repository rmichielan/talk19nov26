/* Each slide owns its narration; slides 8–10 share one RGG state. */
const DeckScenes=(()=>{
 const {svg,NS,rng,key,clamp,mod,torusSegments}=Model;
 const get=id=>document.getElementById(id);
 const state={seed:2049226,coverSeed:20261112,hiddenSeed:54029,erSeed:7751,world:null,cover:null,hidden:null,pair:null,er:null,geometryStep:0,geometryNodes:[],recMode:0,recOverride:null,recAnimating:false,renderRequested:false,paused:false,coverTimer:0,coverGlitchTimer:0};
 const point=(el,p,cls,r)=>svg('circle',{cx:p.x,cy:p.y,r,class:cls},el);
 const line=(el,a,b,cls='net-edge')=>svg('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,class:cls},el);
 const group=(parent,attrs={})=>svg('g',attrs,parent);
 const S=(x,y,p,w=1,h=w)=>({x:x+p.x*w,y:y+p.y*h});
 function start(){state.world=Model.makeRGG(state.seed,Math.log(250),250,8);state.hidden=Model.makeHidden(state.hiddenSeed);state.pair=Model.makePair(state.hiddenSeed^0xa82);state.er=Model.generateER(state.erSeed,29,.5,7);initCover();initGeometry();initControls();}
 function initCover(){
   // Preserve the exact 12-Nov signal propagation and RGB-split glitch logic.
   state.cover=new ScientificNetwork(get('network'),{seed:state.coverSeed,n:87,meanDegree:8.0});
   if(Number(get('slide').dataset.page)===1)state.cover.start();
 }
 function renderCover(){
   if(!state.cover)return;
   state.cover.setAboutMode(Number(get('slide').dataset.step)===1);
   state.cover.setPaused(state.paused);
   if(Number(get('slide').dataset.page)===1)state.cover.start();
 }
 function flashCover(){state.cover?.revealAnomaly();}
 function simpleGraph(rootId,obj,opts={}){const root=get(rootId);if(!root)return;root.replaceChildren();const box=opts.box||[34,30,opts.width||770,opts.height||426],coords=(opts.positions||obj.points).map(p=>S(box[0],box[1],p,box[2],box[3]));let edges=opts.edges || obj.full || obj.baseline || [];const background=group(root),active=group(root),nodes=group(root);
  const selected=new Set(opts.selected||[]),addSet=new Set((opts.highlightEdges||[]).map(([a,b])=>key(a,b))),naturalSet=new Set((opts.naturalEdges||[]).map(([a,b])=>key(a,b)));
  for(const [a,b] of edges){const k=key(a,b);line(k===undefined?background:(!addSet.has(k)&&!naturalSet.has(k)?background:active),coords[a],coords[b],addSet.has(k)?'net-edge added':naturalSet.has(k)?'net-edge natural-highlight':'net-edge');}
  for(let i=0;i<coords.length;i++)point(nodes,coords[i],selected.has(i)?(opts.naturalSelection?'net-node natural-marked':'net-node marked'):'net-node',opts.radius||5.3);
 }
 // The visual coordinates are derived from adjacency only (Kamada-Kawai),
 // never from the arbitrary positions used to sample the null graph.
 function hiddenKK(obj){
  if(obj.kkPositions)return obj.kkPositions;
  const topology={seed:obj.seed,N:obj.n,mu:0,k:0,graphVersion:0,allEdges:obj.full,kkCache:null};
  obj.kkPositions=Model.kkLayout(topology);
  return obj.kkPositions;
 }
 function renderHidden(){
  const step=Number(get('slide').dataset.step),h=state.hidden;
  const natural=step===1, planted=step===2;
  const hset=natural?(h.natural||[]):planted?h.planted:[];
  const motif=natural?h.natural:planted?h.planted:null;
  const markedEdges=motif?Model.Hedges.map(([i,j])=>[motif[i],motif[j]]):[];
  simpleGraph('hidden-graph',h,{edges:h.full,positions:hiddenKK(h),selected:hset,
    naturalSelection:natural,naturalEdges:natural?markedEdges:[],
    highlightEdges:planted?markedEdges:[],radius:6.2,width:772,height:416});
  get('hidden-first-question').textContent=natural
    ?'This copy is natural — it was NOT planted.'
    :planted?'This is the PLANTED copy of the same pattern.'
    :'A copy of H was planted. Can you find the planted one?';
  const pair=state.pair;
  for(const lab of ['a','b']){
    const label=lab.toUpperCase(),p=pair[label],correct=pair.correct===label,show=step>=4&&correct;
    simpleGraph('hidden-pair-'+lab,p,{box:[30,20,540,370],edges:p.full,positions:hiddenKK(p),
      selected:show?p.planted:[],highlightEdges:show?Model.Hedges.map(([i,j])=>[p.planted[i],p.planted[j]]):[],radius:5.8});
    const root=get('hidden-pair-'+lab);
    root?.parentElement?.classList.toggle('right-answer',show);
  }
  const captions=[
    'One particular copy was planted. Which vertices are the original ones?',
    'This is a naturally occurring copy, not the planted one.',
    'This is the planted copy. Finding the pattern alone is not enough.',
    'Same null model, but only one network contains an inserted pattern.',
    'The planted structure is in Network '+state.pair.correct+'.',
    'Detection: can we tell which network was altered?'
  ];
  get('hidden-caption').textContent=captions[step]||captions[0];
 }
 function renderER(){const step=Number(get('slide').dataset.step),o=state.er;const vertices=step===1||step===2?o.planted:[];const edges=step<=1?o.baseline:[...o.baseline,...o.added];simpleGraph('er-graph',o,{box:[35,18,728,560],edges,selected:vertices,highlightEdges:step===2?o.added:[],radius:6.3});get('er-step-label').textContent=['BASELINE · G(n, ½)','SELECT UNIFORMLY','ADD MISSING EDGES','HIDE PLANTED SET','EXACT RECOVERY?'][step];}
 /* Forty curated people, fixed identities. Geographic, political, and feature coordinates are illustrative, not measured. */
 const geographic=[[.44,.47],[.51,.39],[.54,.54],[.38,.42],[.42,.35],[.58,.45],[.48,.60],[.61,.52],[.36,.58],[.47,.30],[.55,.28],[.67,.31],[.32,.25],[.29,.39],[.36,.71],[.49,.73],[.57,.69],[.69,.69],[.76,.51],[.21,.51],[.18,.34],[.26,.65],[.71,.21],[.79,.34],[.22,.79],[.84,.74],[.66,.83],[.43,.84],[.33,.84],[.14,.18],[.56,.16],[.86,.17],[.09,.58],[.89,.55],[.73,.92],[.52,.90],[.39,.15],[.61,.61],[.30,.53],[.75,.42]];
 const political=[[.28,.32],[.27,.37],[.20,.26],[.32,.43],[.23,.45],[.35,.28],[.29,.39],[.43,.34],[.15,.30],[.38,.47],[.67,.33],[.73,.28],[.78,.41],[.65,.47],[.84,.32],[.61,.36],[.75,.52],[.87,.22],[.57,.27],[.78,.55],[.27,.70],[.22,.78],[.36,.65],[.42,.75],[.18,.66],[.39,.89],[.30,.81],[.47,.69],[.34,.59],[.11,.87],[.70,.70],[.78,.82],[.63,.67],[.84,.76],[.61,.82],[.90,.69],[.73,.61],[.55,.73],[.51,.55],[.47,.49]];
 const ageMath=[[.12,.35],[.17,.67],[.23,.41],[.29,.82],[.35,.21],[.41,.48],[.47,.70],[.56,.33],[.61,.61],[.75,.43],[.19,.76],[.27,.38],[.34,.54],[.44,.92],[.53,.16],[.63,.84],[.79,.68],[.88,.29],[.22,.89],[.38,.34],[.15,.25],[.30,.58],[.48,.28],[.57,.55],[.68,.74],[.82,.45],[.70,.17],[.89,.88],[.26,.15],[.46,.63],[.11,.54],[.32,.76],[.51,.43],[.66,.31],[.73,.56],[.85,.70],[.92,.52],[.43,.19],[.60,.93],[.78,.18]];
 const geometryLists=[geographic,political,ageMath];
 const personColors=['#d58a60','#498daa','#598faf','#6589ac','#418f96','#846caa','#4b9399','#c58858','#4b8aab','#6d85a9'];
 function initGeometry(){const root=get('geometry-svg');if(!root)return;root.replaceChildren();const back=group(root,{'id':'geom-backgrounds'}),bg0=group(back,{'id':'geom-bg0'}),bg1=group(back,{'id':'geom-bg1'}),bg2=group(back,{'id':'geom-bg2'});for(const g of [bg0,bg1,bg2])g.style.transition='opacity 750ms ease';
  svg('rect',{x:16,y:12,width:868,height:548,rx:10,fill:'#f5f9fa'},bg0);
  // Stylized Torino: orthogonal city blocks, two diagonal boulevards, river Po to the east.
  for(let i=0;i<14;i++){const x=45+i*58;svg('path',{d:`M ${x} 20 L ${x+28} 548`,stroke:i%3===0?'#c6dadc':'#e0e9e9','stroke-width':i%3===0?5:2,fill:'none'},bg0);}
  for(let i=0;i<11;i++){const y=35+i*50;svg('path',{d:`M 18 ${y+9} L 872 ${y-6}`,stroke:i%2===0?'#d1e1e3':'#e1e9ea','stroke-width':i%2===0?4:2,fill:'none'},bg0);}
  svg('path',{d:'M 780 0 C 709 116 807 202 744 290 S 790 433 707 580',fill:'none',stroke:'#b2d9e7','stroke-width':23,opacity:.95},bg0);
  svg('path',{d:'M 780 0 C 709 116 807 202 744 290 S 790 433 707 580',fill:'none',stroke:'#d9f0f7','stroke-width':16},bg0);
  svg('path',{d:'M 250 70 L 655 473 M 130 425 L 595 80',fill:'none',stroke:'#bed5d9','stroke-width':6,opacity:.65},bg0);
  svg('ellipse',{cx:430,cy:288,rx:76,ry:52,fill:'#e9e5d6',stroke:'#d3dccf','stroke-width':2},bg0);
  svg('text',{x:432,y:289,'text-anchor':'middle',fill:'#79959c','font-size':25,'font-weight':700},bg0).textContent='TORINO';
  svg('text',{x:766,y:175,fill:'#6aa5b8','font-size':14,transform:'rotate(90 766 175)'},bg0).textContent='RIVER PO';
  svg('rect',{x:16,y:12,width:868,height:548,rx:10,fill:'#fbfdfd'},bg1);svg('rect',{x:18,y:14,width:430,height:271,fill:'#e7f2ee',opacity:.7},bg1);svg('rect',{x:448,y:14,width:434,height:271,fill:'#eff0f7',opacity:.7},bg1);svg('rect',{x:18,y:285,width:430,height:274,fill:'#f4eef1',opacity:.7},bg1);svg('rect',{x:448,y:285,width:434,height:274,fill:'#f5f1e7',opacity:.75},bg1);
  svg('line',{x1:448,y1:16,x2:448,y2:557,stroke:'#829fa9','stroke-width':2},bg1);svg('line',{x1:18,y1:285,x2:881,y2:285,stroke:'#829fa9','stroke-width':2},bg1);
  for(const [txt,x,y] of [['LEFT',53,304],['RIGHT',791,304],['AUTHORITARIAN',464,52],['LIBERTARIAN',461,540]])svg('text',{x,y,fill:'#98aeb6','font-size':16,'font-weight':700},bg1).textContent=txt;
  svg('rect',{x:16,y:12,width:868,height:548,rx:10,fill:'#fbfdfd'},bg2);for(let i=0;i<10;i++){svg('line',{x1:70+i*80,y1:35,x2:70+i*80,y2:515,stroke:'#e8eff0','stroke-width':1},bg2);svg('line',{x1:55,y1:55+i*51,x2:854,y2:55+i*51,stroke:'#e8eff0','stroke-width':1},bg2);}
  svg('line',{x1:55,y1:515,x2:860,y2:515,stroke:'#829fa9','stroke-width':2.5},bg2);svg('line',{x1:55,y1:515,x2:55,y2:29,stroke:'#829fa9','stroke-width':2.5},bg2);
  svg('text',{x:800,y:546,fill:'#628794','font-size':18},bg2).textContent='AGE →';svg('text',{x:26,y:317,fill:'#628794','font-size':18,transform:'rotate(-90 26 317)'},bg2).textContent='INTEREST IN MATHEMATICS →';
  state.geometryNodes=[];const nodes=group(root,{'id':'geom-people'});for(let i=0;i<40;i++){const c=svg('g',{'data-person':i},nodes);svg('circle',{cx:0,cy:0,r:i%9===0?10:8,fill:personColors[i%personColors.length],stroke:'#fff','stroke-width':2},c);if(i%9===0)svg('circle',{cx:0,cy:0,r:3.1,fill:'#fff',opacity:.95},c);state.geometryNodes.push(c);}setGeometry(0,true);}
 function geomXY(p){return {x:45+p[0]*792,y:40+p[1]*475};}
 function setGeometry(step,instant=false){const level=Math.min(2,step),root=get('geometry-svg');if(!root)return;state.geometryStep=level;for(let i=0;i<3;i++)get('geom-bg'+i).style.opacity=i===level?'1':'0';const titles=['Where we live','What we believe','What we are interested in'],descs=['Positions represent geographical coordinates — here, a stylized map of Torino.','The same people move to a political-orientation plane. Distance now measures political similarity.','The same people move again: horizontal position is age, vertical position is interest in mathematics.'],tags=['01 / 03 · GEOGRAPHICAL SPACE','02 / 03 · POLITICAL SPACE','03 / 03 · FEATURE SPACE'];get('geom-heading').textContent=titles[level];get('geom-description').textContent=descs[level];get('geom-scene-tag').textContent=tags[level];
  if(state.geometryRaf)cancelAnimationFrame(state.geometryRaf);const start=state.geometryNodes.map((g,i)=>({x:Number(g.dataset.x)||geomXY(geographic[i]).x,y:Number(g.dataset.y)||geomXY(geographic[i]).y})),end=geometryLists[level].map(geomXY),t0=performance.now(),duration=instant?1:950;
  const frame=now=>{const t=Math.min(1,(now-t0)/duration),e=1-Math.pow(1-t,3);for(let i=0;i<40;i++){const x=start[i].x+(end[i].x-start[i].x)*e,y=start[i].y+(end[i].y-start[i].y)*e,g=state.geometryNodes[i];g.setAttribute('transform',`translate(${x.toFixed(2)} ${y.toFixed(2)})`);g.dataset.x=x;g.dataset.y=y;}if(t<1)state.geometryRaf=requestAnimationFrame(frame);};state.geometryRaf=requestAnimationFrame(frame);}
 const WX=52,WY=13,WS=550;
 function drawTorus(rootId,opt={}){const root=get(rootId),o=state.world;if(!root||!o)return;root.replaceChildren();const points=Model.renderedPos(o),periodic=opt.periodic!==false;const defs=svg('defs',{},root),clip=svg('clipPath',{id:`torus-clip-${rootId}`},defs);svg('rect',{x:WX,y:WY,width:WS,height:WS},clip);svg('rect',{x:WX,y:WY,width:WS,height:WS,rx:2,fill:'#f8fbfc',stroke:'#97b9c1','stroke-width':1.5},root);
  for(let t=1;t<5;t++){const x=WX+WS*t/5,y=WY+WS*t/5;svg('line',{x1:x,y1:WY,x2:x,y2:WY+WS,stroke:'#e8f1f2','stroke-width':1},root);svg('line',{x1:WX,y1:y,x2:WX+WS,y2:y,stroke:'#e8f1f2','stroke-width':1},root);}
  const edgeLayer=group(root,{'clip-path':`url(#torus-clip-${rootId})`}),ballLayer=group(root,{'clip-path':`url(#torus-clip-${rootId})`}),nodeLayer=group(root,{'clip-path':`url(#torus-clip-${rootId})`});
  const comp=Model.components(o);const palette=['#398b97','#c38d5d','#729aba','#8e82b3','#4d9e84','#bd8291','#a59c65','#5a8d99','#7caa89'];
  const selected=opt.select?o.plantedSet:null;
  function drawEdge(u,v,kind){const a=points[u],b=points[v];if(kind==='added'&&opt.showAdded===false)return;const segments=periodic?torusSegments(a,b):[[a.x,a.y,b.x,b.y]];for(const [x1,y1,x2,y2] of segments){const cn=kind==='added'&&opt.highlightAdded?'net-edge added':'net-edge';svg('line',{x1:WX+x1*WS,y1:WY+y1*WS,x2:WX+x2*WS,y2:WY+y2*WS,class:cn,stroke:kind==='added'&&opt.highlightAdded?'#df8d54':undefined,'stroke-opacity':kind==='added'&&!opt.highlightAdded?.45:undefined},edgeLayer);}}
  // Draw all natural edges first. Geometric edges crossing the torus are split at borders, never dashed across the interior.
  for(const [u,v] of o.base)drawEdge(u,v,'base');if(opt.showAdded!==false)for(const [u,v] of o.added)drawEdge(u,v,'added');
  if(opt.showBall&&o.showBall){const q=points[o.selectedBall]||points[0];for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++)svg('circle',{cx:WX+(q.x+i)*WS,cy:WY+(q.y+j)*WS,r:o.r*WS,fill:'#5fbcb5', 'fill-opacity':.11,stroke:'#239e9b','stroke-width':2},ballLayer);}
  for(let i=0;i<points.length;i++){const p=points[i],isSelected=selected?.has(i),color=isSelected?'#de9159':(opt.components&&comp.count>1?palette[comp.labels[i]%palette.length]:'#4b94a4');svg('circle',{cx:WX+p.x*WS,cy:WY+p.y*WS,r:isSelected?4.6:3.6,fill:color,stroke:isSelected?'#fff':'#e7f3f6','stroke-width':isSelected?1.4:.65,'data-vertex':i},nodeLayer);}
  // Clearly labelled boundary; note that only the 2D depiction is shown.
  svg('text',{x:WX+WS/2,y:582,'text-anchor':'middle',class:'torus-label'},root).textContent='periodic boundary · opposite sides identified';
  return comp;
 }
 function updateWorldInfo(){const o=state.world;if(!o)return;const comp=Model.components(o);get('mu-value').textContent='μ = '+o.mu.toFixed(2);get('rgg-N').textContent=String(o.N);get('rgg-components').textContent=String(comp.count);get('rgg-radius').textContent=o.r.toFixed(4);get('mu-slider').value=o.mu.toString();const ratio=o.mu/Math.log(o.meanN);get('rgg-regime').textContent=ratio<.8?'BELOW CONNECTIVITY':ratio>1.3?'ABOVE CONNECTIVITY':'CONNECTIVITY SCALE';get('rgg-loglabel').textContent='log n ≈ '+Math.log(o.meanN).toFixed(2);}
 function renderRgg(){const o=state.world,step=Number(get('slide').dataset.step);drawTorus('rgg-svg',{showAdded:false,showBall:step>=1,components:step>=3});updateWorldInfo();}
 function renderPlant(){const step=Number(get('slide').dataset.step),o=state.world,annotate=typeof o.plantOverride==='boolean'?o.plantOverride:(step===1||step===2),showAdded=step>=2;
  drawTorus('plant-svg',{showAdded,select:annotate,highlightAdded:annotate&&showAdded});get('plant-step-label').textContent=['ORIGINAL RGG','SELECT Kₙ','ADD THE MISSING EDGES','OBSERVED PLANTED GRAPH'][step];get('k-slider-label').textContent='k = '+o.k;get('k-slider').value=o.k;}
 function edgeLayersForRecovery(root,positions,edgeType,opacity){const layer=group(root,{opacity,'data-edge-layout':edgeType});const o=state.world;for(const [u,v] of o.allEdges){const a=positions[u],b=positions[v];const segments=edgeType==='torus'?torusSegments(a,b):[[a.x,a.y,b.x,b.y]];for(const [x1,y1,x2,y2] of segments)svg('line',{x1:WX+x1*WS,y1:WY+y1*WS,x2:WX+x2*WS,y2:WY+y2*WS,class:'net-edge'},layer);}return layer;}
 function updateRecoveryText(mode,step){get('rec-layout-caption').textContent=mode===0?'LATENT GEOMETRY · NOT OBSERVABLE':'KAMADA–KAWAI · GRAPH ONLY';get('rec-graph-counter').textContent=`N = ${state.world.N} · SAME E′`;const heading=get('rec-state-heading'),desc=get('rec-state-description');if(step===4){heading.textContent='Which graph statistics reveal the hidden clique?';desc.textContent='The observed graph contains both geometric dependencies and non-geometric planted edges. Next: vertex degrees and common neighbors.';}else if(step===0){heading.textContent='We know how the network was generated.';desc.textContent='The latent positions determine natural edges; orange vertices indicate the planted clique.';}else{heading.textContent='But we observe only the graph topology.';desc.textContent='The new drawing is computed from adjacency alone — it does not reconstruct the hidden coordinates.';}}
 function drawRecovery(progress,step){const root=get('recovery-svg'),o=state.world;if(!root||!o)return;root.replaceChildren();const latent=Model.renderedPos(o),layout=Model.kkLayout(o);const x0=latent.map(p=>({x:p.x,y:p.y})),p=clamp(progress,0,1);svg('rect',{x:WX,y:WY,width:WS,height:WS,fill:'#f8fbfc',stroke:'#a8c1c9','stroke-width':1.2},root);if(p<1){const edgesGeo=edgeLayersForRecovery(root,x0,'torus',Math.max(0,1-p));edgesGeo.setAttribute('stroke-opacity',.4);}if(p>0){const edgesKK=edgeLayersForRecovery(root,layout,'kk',p);edgesKK.setAttribute('stroke-opacity',.4);}
  const dots=group(root);for(let i=0;i<o.N;i++){const a=x0[i],b=layout[i],x=a.x*(1-p)+b.x*p,y=a.y*(1-p)+b.y*p,selected=step===0&&o.plantedSet.has(i);svg('circle',{cx:WX+x*WS,cy:WY+y*WS,r:selected?5.0:3.9,fill:selected?'#e09660':'#468fa2',stroke:'#f5faf9','stroke-width':selected?1.4:.6},dots);}svg('text',{x:WX+WS/2,y:582,'text-anchor':'middle',class:'torus-label'},root).textContent=p>.5?'Kamada–Kawai layout · coordinates from adjacency':'Latent toroidal positions · unavailable to the algorithm';}
 function changeRecovery(target,step,instant=false){if(state.recRaf)cancelAnimationFrame(state.recRaf);const start=state.recMode,finish=target;state.recAnimating=!instant;const t0=performance.now(),dur=instant?1:1050;const frame=now=>{const u=Math.min(1,(now-t0)/dur),t=1-Math.pow(1-u,3),value=start+(finish-start)*t;drawRecovery(value,step);if(u<1){state.recRaf=requestAnimationFrame(frame);}else{state.recMode=finish;state.recAnimating=false;}};state.recRaf=requestAnimationFrame(frame);state.recMode=target;updateRecoveryText(target,step);}
 function renderRecovery(context){const step=Number(get('slide').dataset.step),desired=state.recOverride!==null?state.recOverride:(step===0?0:1),oldPage=context?.oldPage,oldStep=context?.oldStep,enterFromPlant=oldPage===9;const instant=!(oldPage===10||enterFromPlant)&&step>=1;changeRecovery(desired,step,instant);}
 function dragSurface(rootId,redraw){const el=get(rootId);if(!el)return;let start=null,moved=false;el.addEventListener('pointerdown',e=>{if(e.button!==0)return;start={x:e.clientX,y:e.clientY,offsetX:state.world.offset.x,offsetY:state.world.offset.y};moved=false;el.setPointerCapture?.(e.pointerId);});el.addEventListener('pointermove',e=>{if(!start)return;const rect=el.getBoundingClientRect();const dx=(e.clientX-start.x)/(rect.height||1),dy=(e.clientY-start.y)/(rect.height||1);if(Math.hypot(dx,dy)>.005)moved=true;state.world.offset.x=mod(start.offsetX+dx);state.world.offset.y=mod(start.offsetY+dy);if(!state.renderRequested){state.renderRequested=true;requestAnimationFrame(()=>{state.renderRequested=false;redraw();});}});el.addEventListener('pointerup',e=>{if(!start)return;if(!moved && rootId==='rgg-svg'){const t=e.target.closest('[data-vertex]');if(t){state.world.selectedBall=Number(t.getAttribute('data-vertex'));state.world.showBall=true;renderRgg();}}start=null;});el.addEventListener('pointercancel',()=>{start=null;});}
 function initControls(){get('mu-slider').addEventListener('input',e=>{const next=Math.min(26,Math.max(.5,Number(e.target.value)));state.world.mu=next;Model.rebuildRGG(state.world);Model.choosePlanted(state.world);renderRgg();});get('k-slider').addEventListener('input',e=>{state.world.k=Number(e.target.value);Model.choosePlanted(state.world);renderPlant();});dragSurface('rgg-svg',renderRgg);dragSurface('plant-svg',renderPlant);}
 function enter(page,context={}){if(page===1)renderCover();if(page===2)renderHidden();if(page===4)renderER();if(page===7)setGeometry(context.step,false);if(page===8)renderRgg();if(page===9){if(context.oldPage!==9||context.oldStep!==context.step)state.world.plantOverride=null;renderPlant();}if(page===10){if(context.oldPage!==10)state.recOverride=null;else if(context.oldStep!==context.step)state.recOverride=null;renderRecovery(context);}}
 function leave(page){if(page===1)state.cover?.stop();if(page===7&&state.geometryRaf)cancelAnimationFrame(state.geometryRaf);if(page===10&&state.recRaf)cancelAnimationFrame(state.recRaf);}
 function trigger(page){if(page===1){flashCover();return;}if(page===8){state.world.showBall=!state.world.showBall;renderRgg();return;}if(page===9){const o=state.world,step=Number(get('slide').dataset.step),def=step===1||step===2;o.plantOverride=typeof o.plantOverride==='boolean'?!o.plantOverride:!def;renderPlant();return;}if(page===10){state.recOverride=state.recMode===1?0:1;changeRecovery(state.recOverride,Number(get('slide').dataset.step),false);return;}}
 function reroll(page){if(page===1){state.coverSeed+=947;state.cover?.reseed(state.coverSeed);renderCover();}if(page===2){state.hiddenSeed+=977;state.hidden=Model.makeHidden(state.hiddenSeed);state.pair=Model.makePair(state.hiddenSeed^0xa82);renderHidden();}if(page===4){state.erSeed+=1069;state.er=Model.generateER(state.erSeed);renderER();}if([8,9,10].includes(page)){const old=state.world;state.seed+=1687;const mu=page===8?Math.log(250):old.mu;state.world=Model.makeRGG(state.seed,mu,250,old.k);if(page===8)renderRgg();if(page===9){if(context.oldPage!==9||context.oldStep!==context.step)state.world.plantOverride=null;renderPlant();}if(page===10){state.recMode=0;state.recOverride=null;renderRecovery({oldPage:0,oldStep:0,step:Number(get('slide').dataset.step)});}}}
 function pause(value){state.paused=!!value;state.cover?.setPaused(state.paused);}
 return{init:start,enter,leave,trigger,reroll,pause,state};
})();
