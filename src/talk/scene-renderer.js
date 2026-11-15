/* Each slide owns its narration; slides 8–10 share one RGG state. */
const DeckScenes=(()=>{
 const {svg,NS,rng,key,clamp,mod,torusSegments}=Model;
 const get=id=>document.getElementById(id);
 const state={seed:2049226,coverSeed:20261112,hiddenSeed:54029,erSeed:7751,world:null,cover:null,hidden:null,pair:null,er:null,geometryStep:0,geometryNodes:[],recMode:0,recOverride:null,recAnimating:false,renderRequested:false,paused:false,coverTimer:0,coverGlitchTimer:0};
 const point=(el,p,cls,r)=>svg('circle',{cx:p.x,cy:p.y,r,class:cls},el);
 const line=(el,a,b,cls='net-edge')=>svg('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,class:cls},el);
 const group=(parent,attrs={})=>svg('g',attrs,parent);
 const S=(x,y,p,w=1,h=w)=>({x:x+p.x*w,y:y+p.y*h});
 function start(){state.world=Model.makeRGG(state.seed,1.2*Math.log(250),250,5);state.hidden=Model.makeHidden(state.hiddenSeed);state.pair=Model.makePair(state.hiddenSeed^0xa82);state.er=Model.generateER(state.erSeed,29,.5,7);initCover();initGeometry();initControls();}
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
  for(let i=0;i<coords.length;i++)point(nodes,coords[i],selected.has(i)?(opts.naturalSelection?'net-node natural-marked':'net-node marked'):'net-node',selected.has(i)&&opts.selectedRadius?opts.selectedRadius:(opts.radius||5.3));
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
 function erKK(o){
  if(o.kkPositions)return o.kkPositions;
  const graph={seed:o.seed,N:o.n,mu:0,k:0,graphVersion:0,allEdges:o.baseline,kkCache:null};
  o.kkPositions=Model.kkLayout(graph);return o.kkPositions;
 }
 function renderER(){
  const step=Number(get('slide').dataset.step),o=state.er;
  const vertices=step===1||step===2?o.planted:[];
  const edges=step<=1?o.baseline:[...o.baseline,...o.added];
  simpleGraph('er-graph',o,{box:[42,32,716,530],positions:erKK(o),edges,
   selected:vertices,highlightEdges:step===2?o.added:[],radius:6.2,selectedRadius:11.1});
  get('er-step-label').textContent=['BASELINE · G(n, ½)','SELECT UNIFORMLY',
    'ADD MISSING EDGES','HIDE PLANTED SET','OBSERVED GRAPH'][step];
 }

 /* Forty curated people, fixed identities. Geographic, political, and feature coordinates are illustrative, not measured. */
 const geographic=[[.44,.47],[.51,.39],[.54,.54],[.38,.42],[.42,.35],[.58,.45],[.48,.60],[.61,.52],[.36,.58],[.47,.30],[.55,.28],[.67,.31],[.32,.25],[.29,.39],[.36,.71],[.49,.73],[.57,.69],[.69,.69],[.76,.51],[.21,.51],[.18,.34],[.26,.65],[.71,.21],[.79,.34],[.22,.79],[.84,.74],[.66,.83],[.43,.84],[.33,.84],[.14,.18],[.56,.16],[.86,.17],[.09,.58],[.89,.55],[.73,.92],[.52,.90],[.39,.15],[.61,.61],[.30,.53],[.75,.42]];
 const political=[[.28,.32],[.27,.37],[.20,.26],[.32,.43],[.23,.45],[.35,.28],[.29,.39],[.43,.34],[.15,.30],[.38,.47],[.67,.33],[.73,.28],[.78,.41],[.65,.47],[.84,.32],[.61,.36],[.75,.52],[.87,.22],[.57,.27],[.78,.55],[.27,.70],[.22,.78],[.36,.65],[.42,.75],[.18,.66],[.39,.89],[.30,.81],[.47,.69],[.34,.59],[.11,.87],[.70,.70],[.78,.82],[.63,.67],[.84,.76],[.61,.82],[.90,.69],[.73,.61],[.55,.73],[.51,.55],[.47,.49]];
 const ageMath=[[.12,.35],[.17,.67],[.23,.41],[.29,.82],[.35,.21],[.41,.48],[.47,.70],[.56,.33],[.61,.61],[.75,.43],[.19,.76],[.27,.38],[.34,.54],[.44,.92],[.53,.16],[.63,.84],[.79,.68],[.88,.29],[.22,.89],[.38,.34],[.15,.25],[.30,.58],[.48,.28],[.57,.55],[.68,.74],[.82,.45],[.70,.17],[.89,.88],[.26,.15],[.46,.63],[.11,.54],[.32,.76],[.51,.43],[.66,.31],[.73,.56],[.85,.70],[.92,.52],[.43,.19],[.60,.93],[.78,.18]];
 const geometryLists=[geographic,political,ageMath];
 const PERSON_COLOR='#287f91';
 function geomXY(p){return {x:45+p[0]*792,y:40+p[1]*475};}
 function street(g,d,width=2,color='#cbd8d5',opacity=1){svg('path',{d,fill:'none',stroke:color,'stroke-width':width,'stroke-linecap':'round','stroke-linejoin':'round',opacity},g);}
 function mapLabel(g,text,x,y,opts={}){const t=svg('text',{x,y,fill:opts.color||'#60838a','font-size':opts.size||13,'font-weight':opts.bold?750:550,'letter-spacing':opts.spacing||'.02em','text-anchor':opts.anchor||'start',opacity:opts.opacity??1,transform:opts.transform},g);t.textContent=text;return t;}
 function torinoMap(g){
   svg('rect',{x:16,y:12,width:868,height:548,rx:10,fill:'#f0f5f2'},g);
   // A legible cartographic illustration of central Turin: the orthogonal street grid,
   // large corso axes, Dora Riparia to the north and Po to the east.
   svg('path',{d:'M 706 10 C 698 88 725 134 746 193 C 769 250 743 313 775 370 C 813 443 814 491 829 567 L 902 567 L 902 0 Z',fill:'#e3ede6'},g);
   svg('path',{d:'M 765 -24 C 741 49 744 95 763 137 S 786 216 760 278 S 769 378 800 428 S 806 528 819 610',stroke:'#c5e5ed','stroke-width':43,fill:'none','stroke-linecap':'round'},g);
   svg('path',{d:'M 765 -24 C 741 49 744 95 763 137 S 786 216 760 278 S 769 378 800 428 S 806 528 819 610',stroke:'#a8d8e6','stroke-width':9,fill:'none',opacity:.65},g);
   // Dora Riparia across the northern part of the city.
   street(g,'M 7 150 C 176 137 289 129 431 126 C 553 122 635 115 753 147',17,'#d2e7ee');
   street(g,'M 7 150 C 176 137 289 129 431 126 C 553 122 635 115 753 147',5,'#b8dbe7');
   // The city's grid lies approximately NW/SE; keep streets subdued under the markers.
   const grid=group(g,{transform:'rotate(-11 400 305)'});
   for(let i=0;i<21;i++){
     const x=37+i*36;
     street(grid,`M ${x} 19 L ${x} 566`,i%4===0?3.3:1.8,i%4===0?'#bbd0d0':'#d4e2df',i%4===0?.87:.88);
   }
   for(let j=0;j<17;j++){
     const y=30+j*34;
     street(grid,`M 20 ${y} L 850 ${y}`,j%4===0?3.4:1.75,j%4===0?'#c0d3d2':'#d6e3df',.9);
   }
   // Characteristic broad roads and plazas: these lines are intentionally pronounced.
   street(g,'M -35 187 L 735 180',11,'#e1e8da');street(g,'M -35 187 L 735 180',4.2,'#98b4b7');  // Regina Margherita
   street(g,'M -20 390 L 833 411',14,'#e1e8da');street(g,'M -20 390 L 833 411',5.3,'#88adb1');  // Vittorio Emanuele II
   street(g,'M 28 62 L 470 272',11,'#e1e8da');street(g,'M 28 62 L 470 272',4.3,'#93b2b2');  // Francia
   street(g,'M 467 36 L 487 557',8,'#e2eadd');street(g,'M 467 36 L 487 557',3.5,'#a2bfc0'); // Via Roma / center axis
   street(g,'M 508 260 L 746 335',8,'#e1e8da');street(g,'M 508 260 L 746 335',3.5,'#93b3b7'); // Via Po
   street(g,'M 228 550 L 589 75',8,'#e1e8da');street(g,'M 228 550 L 589 75',3.5,'#99b7b6'); // diagonal
   street(g,'M 650 565 C 678 490 708 441 738 386 L 776 312',7,'#b4cbbd'); // Po riverside
   // Recognizable urban parks and landmarks.
   svg('path',{d:'M 600 448 Q 679 438 715 459 L 727 540 Q 675 558 627 534 Z',fill:'#dcebcf',stroke:'#c8ddba','stroke-width':1.2},g);
   svg('rect',{x:485,y:241,width:41,height:33,rx:6,fill:'#f7f0d9',stroke:'#b8c6b3','stroke-width':1.6},g);
   svg('circle',{cx:733,cy:334,r:15,fill:'#f7f0d9',stroke:'#b8c6b3','stroke-width':1.6},g);
   svg('ellipse',{cx:472,cy:423,rx:13,ry:10,fill:'#f7f0d9',stroke:'#b8c6b3','stroke-width':1.3},g);
   mapLabel(g,'TORINO',396,83,{size:44,bold:true,color:'#517c86',opacity:.28,spacing:'.13em'});
   mapLabel(g,'CORSO REGINA MARGHERITA',83,169,{size:11,color:'#6a9295'});
   mapLabel(g,'CORSO VITTORIO EMANUELE II',88,380,{size:11,color:'#668f94'});
   mapLabel(g,'CORSO FRANCIA',86,112,{size:11,color:'#6b9293'});
   mapLabel(g,'VIA ROMA',457,505,{size:11,color:'#769699',transform:'rotate(-90 457 505)'});
   mapLabel(g,'VIA PO',595,275,{size:12,color:'#668f94',transform:'rotate(17 595 275)'});
   mapLabel(g,'PIAZZA CASTELLO',515,236,{size:12,bold:true,color:'#6c8690'});
   mapLabel(g,'PIAZZA VITTORIO VENETO',660,309,{size:11,color:'#6c8690'});
   mapLabel(g,'PORTA NUOVA',475,450,{size:11,color:'#718c90'});
   mapLabel(g,'PARCO DEL VALENTINO',609,555,{size:11,color:'#739278'});
   mapLabel(g,'PO',819,199,{size:17,bold:true,color:'#5895a9',transform:'rotate(82 819 199)'});
   mapLabel(g,'DORA RIPARIA',578,115,{size:11,color:'#76a3b3'});
   // Actual street geometry from OpenStreetMap (Wikimedia Commons, Flappiefh,
   // CC BY-SA 3.0). Image is fetched only when viewing the HTML online;
   // the detailed, embedded vector illustration above remains available offline.
   // Cropping centers on the inner city and the river Po, not the full province.
   const mapWindow=svg('svg',{x:16,y:12,width:868,height:548,
     viewBox:'480 545 690 438',preserveAspectRatio:'xMidYMid slice'},g);
   svg('image',{
     href:'https://upload.wikimedia.org/wikipedia/commons/0/0e/Location_map_Italy_Torino.jpg',
     x:0,y:0,width:1653,height:1590,preserveAspectRatio:'none'
   },mapWindow);
   svg('rect',{x:16,y:12,width:868,height:548,rx:8,fill:'#ffffff',opacity:.11,'pointer-events':'none'},g);
   svg('rect',{x:30,y:23,width:202,height:44,rx:6,fill:'#ffffff',opacity:.88},g);
   mapLabel(g,'TORINO · CENTER',43,51,{size:20,bold:true,color:'#325d69',spacing:'.09em'});
   svg('rect',{x:537,y:536,width:336,height:18,rx:4,fill:'#ffffff',opacity:.92},g);
   mapLabel(g,'Map: Flappiefh / © OpenStreetMap contributors · CC BY-SA 3.0',544,549,{size:10,color:'#5e7882'});
 }
 function politicalMap(g){
   // True square political compass, including when shrunk into the triptych.
   const x=204,y=35,a=510,h=a/2;
   svg('rect',{x:x-8,y:y-8,width:a+16,height:a+16,rx:12,fill:'#ffffff',stroke:'#d9e5e8','stroke-width':1.6},g);
   for(const [qx,qy,fill] of [[x,y,'#e7f2ee'],[x+h,y,'#eef0f8'],[x,y+h,'#f5eef4'],[x+h,y+h,'#f7f3eb']])svg('rect',{x:qx,y:qy,width:h,height:h,fill,opacity:.9},g);
   svg('rect',{x,y,width:a,height:a,fill:'none',stroke:'#aec1c8','stroke-width':2},g);
   svg('line',{x1:x+h,y1:y,x2:x+h,y2:y+a,stroke:'#91aeb8','stroke-width':2.1},g);
   svg('line',{x1:x,y1:y+h,x2:x+a,y2:y+h,stroke:'#91aeb8','stroke-width':2.1},g);
   mapLabel(g,'LEFT',150,y+h+6,{size:17,bold:true,color:'#758f9b',anchor:'middle'});
   mapLabel(g,'RIGHT',772,y+h+6,{size:17,bold:true,color:'#758f9b',anchor:'middle'});
   mapLabel(g,'AUTHORITARIAN',x+h,y-9,{size:16,bold:true,color:'#758f9b',anchor:'middle'});
   mapLabel(g,'LIBERTARIAN',x+h,y+a+27,{size:16,bold:true,color:'#758f9b',anchor:'middle'});
 }
 function personXY(level,p){
   // Rescale only political coordinates to the square diagram; all identities persist.
   return level===1?{x:204+510*p[0],y:35+510*p[1]}:geomXY(p);
 }
 function featuresMap(g){
   svg('rect',{x:16,y:12,width:868,height:548,rx:10,fill:'#fafdfd'},g);
   for(let i=0;i<10;i++){
     svg('line',{x1:70+i*80,y1:35,x2:70+i*80,y2:515,stroke:'#e3edef','stroke-width':1.3},g);
     svg('line',{x1:55,y1:55+i*51,x2:854,y2:55+i*51,stroke:'#e3edef','stroke-width':1.3},g);
   }
   svg('line',{x1:55,y1:515,x2:860,y2:515,stroke:'#8fabb4','stroke-width':2.6},g);
   svg('line',{x1:55,y1:515,x2:55,y2:29,stroke:'#8fabb4','stroke-width':2.6},g);
   mapLabel(g,'AGE →',793,549,{size:19,bold:true,color:'#73949d'});
   mapLabel(g,'INTEREST IN MATHEMATICS →',25,323,{size:19,bold:true,color:'#73949d',transform:'rotate(-90 25 323)'});
 }
 function initGeometry(){
   const root=get('geometry-svg');if(!root)return;
   root.replaceChildren();
   const back=group(root,{'id':'geom-backgrounds'}),bg0=group(back,{'id':'geom-bg0'}),bg1=group(back,{'id':'geom-bg1'}),bg2=group(back,{'id':'geom-bg2'});
   [bg0,bg1,bg2].forEach(g=>{g.style.transition='opacity 750ms ease'});
   torinoMap(bg0);politicalMap(bg1);featuresMap(bg2);
   state.geometryNodes=[];
   const nodes=group(root,{'id':'geom-people'});
   for(let i=0;i<40;i++){
     const c=svg('g',{'data-person':i},nodes);
     svg('circle',{cx:0,cy:0,r:7.2,fill:PERSON_COLOR,stroke:'#fff','stroke-width':2.1},c);
     state.geometryNodes.push(c);
   }
   const miniIds=['geom-mini-geography','geom-mini-politics','geom-mini-features'];
   const sources=[bg0,bg1,bg2];
   miniIds.forEach((id,idx)=>{
     const mini=get(id);if(!mini)return;mini.replaceChildren();
     const bgCopy=sources[idx].cloneNode(true);bgCopy.removeAttribute('id');bgCopy.style.opacity='1';mini.appendChild(bgCopy);
     const overlay=group(mini);
     for(const coord of geometryLists[idx]){
       const p=personXY(idx,coord);
       svg('circle',{cx:p.x,cy:p.y,r:8.0,fill:PERSON_COLOR,stroke:'#fff','stroke-width':2.7},overlay);
     }
   });
   setGeometry(0,true);
 }
 function setGeometry(step,instant=false){
   const level=Math.min(2,step),root=get('geometry-svg');if(!root)return;
   state.geometryStep=step;
   for(let i=0;i<3;i++)get('geom-bg'+i).style.opacity=i===level?'1':'0';
   const titles=['Where we live','What we believe','What we are interested in'];
   const descs=['Illustrative positions in Torino: the Po, city streets and major thoroughfares provide the geographic setting.','The same individuals move to a political-orientation space. Closeness now means similar viewpoints.','The same individuals move again: horizontal position is age, vertical position is interest in mathematics.'];
   const tags=['01 / 03 · GEOGRAPHICAL SPACE','02 / 03 · POLITICAL SPACE','03 / 03 · FEATURE SPACE'];
   get('geom-heading').textContent=titles[level];get('geom-description').textContent=descs[level];get('geom-scene-tag').textContent=tags[level];
   if(state.geometryRaf)cancelAnimationFrame(state.geometryRaf);
   const start=state.geometryNodes.map((g,i)=>({x:Number(g.dataset.x)||geomXY(geographic[i]).x,y:Number(g.dataset.y)||geomXY(geographic[i]).y}));
   const end=geometryLists[level].map(p=>personXY(level,p)),t0=performance.now(),duration=instant?1:950;
   const frame=now=>{
     const t=Math.min(1,(now-t0)/duration),e=1-Math.pow(1-t,3);
     for(let i=0;i<40;i++){
       const x=start[i].x+(end[i].x-start[i].x)*e,y=start[i].y+(end[i].y-start[i].y)*e,g=state.geometryNodes[i];
       g.setAttribute('transform',`translate(${x.toFixed(2)} ${y.toFixed(2)})`);
       g.dataset.x=x;g.dataset.y=y;
     }
     if(t<1)state.geometryRaf=requestAnimationFrame(frame);
   };
   state.geometryRaf=requestAnimationFrame(frame);
 }
 const WX=52,WY=13,WS=550;
 function drawTorus(rootId,opt={}){const root=get(rootId),o=state.world;if(!root||!o)return;root.replaceChildren();const points=Model.renderedPos(o),periodic=opt.periodic!==false;const defs=svg('defs',{},root),clip=svg('clipPath',{id:`torus-clip-${rootId}`},defs);svg('rect',{x:WX,y:WY,width:WS,height:WS},clip);svg('rect',{x:WX,y:WY,width:WS,height:WS,rx:2,fill:'#f8fbfc',stroke:'#97b9c1','stroke-width':1.5},root);
  for(let t=1;t<5;t++){const x=WX+WS*t/5,y=WY+WS*t/5;svg('line',{x1:x,y1:WY,x2:x,y2:WY+WS,stroke:'#e8f1f2','stroke-width':1},root);svg('line',{x1:WX,y1:y,x2:WX+WS,y2:y,stroke:'#e8f1f2','stroke-width':1},root);}
  const edgeLayer=group(root,{'clip-path':`url(#torus-clip-${rootId})`}),ballLayer=group(root,{'clip-path':`url(#torus-clip-${rootId})`}),nodeLayer=group(root,{'clip-path':`url(#torus-clip-${rootId})`});
  const comp=Model.components(o);
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
 function updateWorldInfo(){const o=state.world;if(!o)return;const comp=Model.components(o);get('mu-value').textContent='μ = '+o.mu.toFixed(2);get('rgg-N').textContent=String(o.N);get('rgg-components').textContent=String(comp.count);get('rgg-radius').textContent=o.r.toFixed(4);get('mu-slider').value=o.mu.toString();const ratio=o.mu/Math.log(o.meanN);get('rgg-regime').textContent=ratio<.8?'SUB-CONNECTIVITY':ratio>2?'SUPER-CONNECTIVITY':'CONNECTIVITY';
   const min=.5,max=20;const lo=100*(.8*Math.log(o.meanN)-min)/(max-min);const hi=100*(2*Math.log(o.meanN)-min)/(max-min);
   const bands=get('rgg-regime-scale')?.querySelectorAll('.regime-band');
   if(bands?.length===3){bands[0].style.width=lo+'%';bands[1].style.left=lo+'%';bands[1].style.width=(hi-lo)+'%';bands[2].style.left=hi+'%';bands[2].style.width=(100-hi)+'%';}
   const captions=get('rgg-regime-scale')?.querySelectorAll('.regime-captions span');
   if(captions?.length===3){captions[0].style.width=lo+'%';captions[1].style.left=lo+'%';captions[1].style.width=(hi-lo)+'%';captions[2].style.left=hi+'%';captions[2].style.width=(100-hi)+'%';}}
 function renderRgg(){const o=state.world,step=Number(get('slide').dataset.step);drawTorus('rgg-svg',{showAdded:false,showBall:step>=1});updateWorldInfo();}
 function renderPlant(){const step=Number(get('slide').dataset.step),o=state.world,annotate=typeof o.plantOverride==='boolean'?o.plantOverride:(step===1||step===2),showAdded=step>=2;
  drawTorus('plant-svg',{showAdded,select:annotate,highlightAdded:annotate&&showAdded});get('plant-step-label').textContent=['ORIGINAL RGG','SELECT K','ADD THE MISSING EDGES','OBSERVED PLANTED GRAPH'][step];get('k-slider-label').textContent='k = '+o.k;get('k-slider').value=o.k;}
 function edgeLayersForRecovery(root,positions,edgeType,opacity){const layer=group(root,{opacity,'data-edge-layout':edgeType});const o=state.world;for(const [u,v] of o.allEdges){const a=positions[u],b=positions[v];const segments=edgeType==='torus'?torusSegments(a,b):[[a.x,a.y,b.x,b.y]];for(const [x1,y1,x2,y2] of segments)svg('line',{x1:WX+x1*WS,y1:WY+y1*WS,x2:WX+x2*WS,y2:WY+y2*WS,class:'net-edge'},layer);}return layer;}
 function updateRecoveryText(mode,step){
   get('rec-layout-caption').textContent=mode===0?'LATENT GEOMETRY · NOT OBSERVABLE':'KAMADA–KAWAI · GRAPH ONLY';
   get('rec-graph-counter').textContent=`N = ${state.world.N} · SAME E′`;
   const heading=get('rec-state-heading'),desc=get('rec-state-description');
   get('rec-question').querySelector('small').textContent=mode===0?'GENERATIVE VIEW':'OBSERVED GRAPH';
   get('rec-legend-planted').textContent=mode===0?'Planted group (only shown for explanation)':'Planted set (hidden from the observer)';
   if(step===4){
     heading.textContent='Which graph statistics reveal the hidden clique?';
     desc.textContent='The observed graph contains geometric dependencies and non-geometric planted edges. Next: vertex degrees and common neighbors.';
   }else if(mode===0){
     heading.textContent='The latent geometric model generates the edges.';
     desc.textContent='The positions explain natural connections. Orange marks the planted set, shown only for illustration.';
   }else{
     heading.textContent='But we observe only the graph topology.';
     desc.textContent='Kamada–Kawai uses adjacency alone: this drawing does not reconstruct the hidden coordinates.';
   }
 }
 function drawRecovery(progress,step){const root=get('recovery-svg'),o=state.world;if(!root||!o)return;root.replaceChildren();const latent=Model.renderedPos(o),layout=Model.kkLayout(o);const x0=latent.map(p=>({x:p.x,y:p.y})),p=clamp(progress,0,1);svg('rect',{x:WX,y:WY,width:WS,height:WS,fill:'#f8fbfc',stroke:'#a8c1c9','stroke-width':1.2},root);if(p<1){const edgesGeo=edgeLayersForRecovery(root,x0,'torus',Math.max(0,1-p));edgesGeo.setAttribute('stroke-opacity',.4);}if(p>0){const edgesKK=edgeLayersForRecovery(root,layout,'kk',p);edgesKK.setAttribute('stroke-opacity',.4);}
  const dots=group(root);for(let i=0;i<o.N;i++){const a=x0[i],b=layout[i],x=a.x*(1-p)+b.x*p,y=a.y*(1-p)+b.y*p,selected=step===0&&p<.35&&o.plantedSet.has(i);svg('circle',{cx:WX+x*WS,cy:WY+y*WS,r:selected?5.0:3.9,fill:selected?'#e09660':'#468fa2',stroke:'#f5faf9','stroke-width':selected?1.4:.6},dots);}svg('text',{x:WX+WS/2,y:582,'text-anchor':'middle',class:'torus-label'},root).textContent=p>.5?'Kamada–Kawai layout · coordinates from adjacency':'Latent toroidal positions · unavailable to the algorithm';}
 function changeRecovery(target,step,instant=false){if(state.recRaf)cancelAnimationFrame(state.recRaf);const start=state.recMode,finish=target;state.recAnimating=!instant;const t0=performance.now(),dur=instant?1:1050;const frame=now=>{const u=Math.min(1,(now-t0)/dur),t=1-Math.pow(1-u,3),value=start+(finish-start)*t;drawRecovery(value,step);if(u<1){state.recRaf=requestAnimationFrame(frame);}else{state.recMode=finish;state.recAnimating=false;}};state.recRaf=requestAnimationFrame(frame);state.recMode=target;updateRecoveryText(target,step);}
 function renderRecovery(context){const step=Number(get('slide').dataset.step),desired=state.recOverride!==null?state.recOverride:(step===0?0:1),oldPage=context?.oldPage,oldStep=context?.oldStep,enterFromPlant=oldPage===9;const instant=!(oldPage===10||enterFromPlant)&&step>=1;changeRecovery(desired,step,instant);}
 function dragSurface(rootId,redraw){const el=get(rootId);if(!el)return;let start=null,moved=false;el.addEventListener('pointerdown',e=>{if(e.button!==0)return;start={x:e.clientX,y:e.clientY,offsetX:state.world.offset.x,offsetY:state.world.offset.y};moved=false;el.setPointerCapture?.(e.pointerId);});el.addEventListener('pointermove',e=>{if(!start)return;const rect=el.getBoundingClientRect();const dx=(e.clientX-start.x)/(rect.height||1),dy=(e.clientY-start.y)/(rect.height||1);if(Math.hypot(dx,dy)>.005)moved=true;state.world.offset.x=mod(start.offsetX+dx);state.world.offset.y=mod(start.offsetY+dy);if(!state.renderRequested){state.renderRequested=true;requestAnimationFrame(()=>{state.renderRequested=false;redraw();});}});el.addEventListener('pointerup',e=>{if(!start)return;if(!moved && rootId==='rgg-svg'){const t=e.target.closest('[data-vertex]');if(t){state.world.selectedBall=Number(t.getAttribute('data-vertex'));state.world.showBall=true;renderRgg();}}start=null;});el.addEventListener('pointercancel',()=>{start=null;});}
 function initControls(){get('mu-slider').addEventListener('input',e=>{const next=Math.min(20,Math.max(.5,Number(e.target.value)));state.world.mu=next;Model.rebuildRGG(state.world);Model.choosePlanted(state.world);renderRgg();});get('k-slider').addEventListener('input',e=>{state.world.k=Number(e.target.value);Model.choosePlanted(state.world);renderPlant();});dragSurface('rgg-svg',renderRgg);dragSurface('plant-svg',renderPlant);}
 function enter(page,context={}){if(page===1)renderCover();if(page===2)renderHidden();if(page===4)renderER();if(page===7)setGeometry(context.step,false);if(page===8)renderRgg();if(page===9){if(context.oldPage!==9||context.oldStep!==context.step)state.world.plantOverride=null;renderPlant();}if(page===10){if(context.oldPage!==10)state.recOverride=null;else if(context.oldStep!==context.step)state.recOverride=null;renderRecovery(context);}}
 function leave(page){if(page===1)state.cover?.stop();if(page===7&&state.geometryRaf)cancelAnimationFrame(state.geometryRaf);if(page===10&&state.recRaf)cancelAnimationFrame(state.recRaf);}
 function trigger(page){if(page===1){flashCover();return;}if(page===8){state.world.showBall=!state.world.showBall;renderRgg();return;}if(page===9){const o=state.world,step=Number(get('slide').dataset.step),def=step===1||step===2;o.plantOverride=typeof o.plantOverride==='boolean'?!o.plantOverride:!def;renderPlant();return;}if(page===10){state.recOverride=state.recMode===1?0:1;changeRecovery(state.recOverride,Number(get('slide').dataset.step),false);return;}}
 function reroll(page){
   if(page===1){state.coverSeed+=947;state.cover?.reseed(state.coverSeed);renderCover();}
   if(page===2){state.hiddenSeed+=977;state.hidden=Model.makeHidden(state.hiddenSeed);state.pair=Model.makePair(state.hiddenSeed^0xa82);renderHidden();}
   if(page===4){state.erSeed+=1069;state.er=Model.generateER(state.erSeed);renderER();}
   if([8,9,10].includes(page)){
     const old=state.world;
     state.seed+=1687;
     const mu=page===8?1.2*Math.log(old.meanN):old.mu;
     state.world=Model.makeRGG(state.seed,mu,old.meanN,old.k);
     if(page===8)renderRgg();
     if(page===9){state.world.plantOverride=null;renderPlant();}
     if(page===10){state.recMode=0;state.recOverride=null;renderRecovery({oldPage:0,oldStep:0,step:Number(get('slide').dataset.step)});}
   }
 }
 function pause(value){state.paused=!!value;state.cover?.setPaused(state.paused);}
 return{init:start,enter,leave,trigger,reroll,pause,state};
})();
