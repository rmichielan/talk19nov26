/* Reusable scientific network cover animation from the 12-Nov-2026 talk.
   Same cascade, travelling signal, and RGB clique glitch engine;
   base graph ONLY is now a 2D hard random geometric graph in the Euclidean square.
   Given a seed: reproducible graph, cascades, and planted-motif glitches.
   Cascades wait min(Exp(rate), 3s). Glitches recur exactly every 15
   seconds of unpaused simulation time (manual glitches do not reset it). */
(() => {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const MAX_SEED = 0xffffffff;
  const prng = seed => {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t=a;
      t=Math.imul(t^(t>>>15),t|1);
      t ^= t + Math.imul(t^(t>>>7),t|61);
      return ((t^(t>>>14))>>>0) / 4294967296;
    };
  };
  const gaussian = rand => Math.sqrt(-2*Math.log(Math.max(1e-9,rand())))*Math.cos(2*Math.PI*rand());
  const clamp = (x,a,b) => Math.max(a, Math.min(b,x));
  const svgElement = (name, props={}, parent=null) => {
    const el = document.createElementNS(NS,name);
    for(const [k,v] of Object.entries(props)) el.setAttribute(k,String(v));
    if(parent) parent.appendChild(el);
    return el;
  };

  class ScientificNetwork {
    constructor(svg, options={}) {
      this.svg=svg;
      this.layers={
        edges:svg.querySelector('#edges'),
        signals:svg.querySelector('#signals'),
        nodes:svg.querySelector('#nodes'),
        anomalies:svg.querySelector('#anomalies'),
        glitch:svg.querySelector('#glitch-overlay'),
        base:svg.querySelector('#base-network')
      };
      this.options={ seed:6040, n:87, meanDegree:8.0, ...options };
      this.activity=1;
      this.paused=false;
      this.focus=false;
      this.running=false;
      this.frame=this.frame.bind(this);
      this.reseed(this.options.seed);
    }
    reseed(seed) {
      this.seed=(Number(seed)>>>0);
      this.options.seed=this.seed;
      this.graphRandom=prng((this.seed ^ 0x1f123bb5)>>>0);
      this.eventRandom=prng((this.seed ^ 0x92be81fd)>>>0);
      for(const name of ['edges','signals','nodes','anomalies','glitch'])this.layers[name].replaceChildren();
      this.vertices=[];
      this.edges=[];
      this.edgeIndex=new Map();
      this.pulses=[];
      this.travelers=[];
      this.anomaly=null;
      this.simMs=0;
      this.accumulator=0;
      this.cascades=0;
      this.eventLog=[];
      this.createGraph();
      this.nextCascadeMs = this.cascadeWaitMs();
      this.nextAnomalyMs = 15000;
      return this.seed;
    }
    getSeed(){return this.seed;}
    getTopology(){
      return {
        vertices:this.vertices.map(v=>({id:v.id,x:v.x,y:v.y,latentX:v.latentX,latentY:v.latentY,weight:v.weight,r:v.r,degree:v.neighbors.length,isHub:v.isHub})),
        edges:this.edges.map(e=>({source:e.a,target:e.b})),
        model:{...this.model}
      };
    }
    uniform(){ return this.eventRandom(); }
    range(lo,hi){ return lo+(hi-lo)*this.uniform(); }
    expWaitMs(ratePerSec){return 1000*(-Math.log(1-this.uniform()))/ratePerSec;}
    cascadeWaitMs(){return Math.min(3000,this.expWaitMs(.52*this.activity));}
    weightedSource(){
      // P(source=v | graph) = deg(v) / sum_u deg(u), exactly.
      const sum=this.vertices.reduce((s,v)=>s+v.neighbors.length,0);
      if(!sum) return -1;
      let draw=this.uniform()*sum;
      for(const v of this.vertices){draw-=v.neighbors.length;if(draw<0)return v.id;}
      return this.vertices[this.vertices.length-1].id;
    }
    createGraph(){
      // The ONLY substantive change relative to 12 November 2026:
      // replace the zero-temperature GIRG by a hard 2D RGG.
      // No weights, no rank-based geometry, no independent random edges.
      // As in the original decorative cover, use the nonperiodic square
      // so the original signal-travel animations follow visible edge segments.
      const n=Number(this.options.n ?? 87);
      const mu=Number(this.options.meanDegree ?? 8.0);
      const radius=Math.sqrt(mu/(n*Math.PI));
      const positionRand=prng((this.seed^0x1f123bb5)>>>0);
      const vertices=[];
      for(let i=0;i<n;i++){
        const u=positionRand(),v=positionRand();
        vertices.push({id:i,latentX:u,latentY:v,
          x:43+1014*u,y:43+774*v,weight:1,isHub:false,r:0,neighbors:[]});
      }
      this.vertices=vertices;
      this.edges=[];this.edgeIndex.clear();
      for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){
        const a=vertices[i],b=vertices[j];
        if(Math.hypot(a.latentX-b.latentX,a.latentY-b.latentY)<=radius){
          const edge={id:this.edges.length,a:i,b:j,dist:Math.hypot(a.x-b.x,a.y-b.y)};
          this.edges.push(edge);this.edgeIndex.set(`${i}-${j}`,edge);
          a.neighbors.push(j);b.neighbors.push(i);
        }
      }
      // Visual emphasis by observed degree only (NOT heterogeneous weights).
      const byDegree=[...vertices].sort((a,b)=>b.neighbors.length-a.neighbors.length);
      const highDegree=new Set(byDegree.slice(0,6).map(v=>v.id));
      for(const v of vertices){
        v.isHub=highDegree.has(v.id);
        v.r=clamp(5.3+2.35*Math.sqrt(v.neighbors.length+1),7.5,18);
      }
      this.model={family:'hard random geometric graph',dimension:2,n,
        geometry:'Euclidean unit square [0,1]^2, nonperiodic (decorative cover)',
        radius,nominalMeanDegree:mu,expectedDegree:'boundary-dependent; no weights'};
      for(const edge of this.edges){
        const a=vertices[edge.a],b=vertices[edge.b],hub=a.isHub||b.isHub;
        edge.line=svgElement('line',{x1:a.x.toFixed(2),y1:a.y.toFixed(2),
          x2:b.x.toFixed(2),y2:b.y.toFixed(2),stroke:hub?'#75bdc8':'#6da9be',
          'stroke-width':hub?3.0:2.6,'stroke-opacity':hub?.49:.37},this.layers.edges);
      }
      for(const v of vertices){
        const g=svgElement('g',{'data-id':v.id},this.layers.nodes);
        v.halo=svgElement('circle',{cx:v.x,cy:v.y,r:v.r*5,fill:'url(#node-halo)',opacity:v.isHub?.14:.04},g);
        v.core=svgElement('circle',{cx:v.x,cy:v.y,r:v.r.toFixed(2),fill:v.isHub?'#96d9de':'#8bb3c6',opacity:1},g);
      }
      this.setupGlitchLayers();
    }
    start(){
      if(this.running)return;
      this.running=true;
      this.last=performance.now();
      this.raf=requestAnimationFrame(this.frame);
    }
    stop(){
      this.running=false;
      if(this.raf)cancelAnimationFrame(this.raf);
    }
    frame(now){
      if(!this.running)return;
      const dt=Math.min(250,Math.max(0,now-this.last));
      this.last=now;
      if(!this.paused){
        // Fixed simulation steps make seeded event order independent of FPS.
        this.accumulator+=dt;
        const fixedStep=1000/60;
        while(this.accumulator>=fixedStep){
          this.step(fixedStep);
          this.accumulator-=fixedStep;
        }
      }
      this.raf=requestAnimationFrame(this.frame);
    }
    step(dt){
      this.simMs+=dt;
      while(this.simMs>=this.nextCascadeMs){
        this.emitCascade();
        this.nextCascadeMs+=this.cascadeWaitMs();
      }
      while(this.simMs+0.001>=this.nextAnomalyMs){
        this.revealAnomaly();
        this.nextAnomalyMs+=15000;
      }
      this.drawPulses(dt);
      this.drawTravelers();
      this.drawAnomaly(dt);
    }
    setPaused(value){this.paused=Boolean(value);}
    setActivity(value){this.activity=clamp(value,.3,3);}
    activateNode(index, customDuration=null){
      const v=this.vertices[index];
      if(!v)return;
      // Degree controls persistence. The high-degree hubs retain a longer glow.
      const d=v.neighbors.length;
      const duration=customDuration??(680+Math.min(900,d*88)+(v.isHub?620:0)+this.range(0,260));
      this.pulses.push({index,elapsed:0,duration});
    }
    drawPulses(dt){
      const strengths=new Float32Array(this.vertices.length);
      this.pulses=this.pulses.filter(p=>{
        p.elapsed+=dt;
        if(p.elapsed>=p.duration)return false;
        const u=p.elapsed/p.duration;
        const strength=Math.min(1,clamp(u/.12,0,1)*Math.pow(1-u,.65)*1.15);
        strengths[p.index]=Math.max(strengths[p.index],strength);
        return true;
      });
      for(let i=0;i<this.vertices.length;i++){
        const v=this.vertices[i],s=strengths[i];
        v.halo.setAttribute('r',(v.r*3.1+s*(v.isHub?37:23)).toFixed(2));
        v.halo.setAttribute('opacity',(.06+(v.isHub?.12:0)+s*.48).toFixed(3));
        v.core.setAttribute('r',(v.r+s*(v.isHub?1.4:1)).toFixed(2));
        v.core.setAttribute('fill',s>.08?'#c9f9f6':(v.isHub?'#96d9de':'#8bb3c6'));
        // Brightness and size animate; keep the disk opaque at all times.
      }
    }
    chooseNeighbors(id, count, exclude=[]){
      const pool=this.vertices[id].neighbors.filter(n=>!exclude.includes(n));
      const out=[];
      for(let i=0;i<count&&pool.length;i++){
        const k=Math.floor(this.uniform()*pool.length);
        out.push(pool[k]);
        pool.splice(k,1);
      }
      return out;
    }
    emitCascade(){
      const source=this.weightedSource();
      if(source<0)return;
      this.cascades++;
      this.activateNode(source);
      // A small subset of distinct neighbors; most events touch 1 or 2.
      let count=1;
      for(let i=0;i<3;i++)if(this.uniform()<.31)count++;
      const recipients=this.chooseNeighbors(source,count);
      this.eventLog.push({type:'cascade',t:+this.simMs.toFixed(3),source,recipients:[...recipients]});
      if(this.eventLog.length>512)this.eventLog.shift();
      for(let i=0;i<recipients.length;i++){
        const neighbor=recipients[i];
        const delay=110+i*110+this.range(0,120);
        this.launchSignal(source,neighbor,delay,'outbound',source);
      }
      return {source,recipients};
    }
    // For backward compatibility with the demo's previous public API.
    sendSignal(){return this.emitCascade();}
    launchSignal(from,to,delayMs,kind,root){
      const a=this.vertices[from],b=this.vertices[to];
      if(!a||!b)return;
      const group=svgElement('g',{},this.layers.signals);
      const trail=svgElement('line',{'stroke':'#87e6e5','stroke-width':2.25,'stroke-linecap':'round','stroke-opacity':0},group);
      const halo=svgElement('circle',{r:12,fill:'url(#node-halo)',opacity:0},group);
      const dot=svgElement('circle',{r:2.55,fill:'#cbfffa',opacity:0},group);
      this.travelers.push({from,to,kind,root,start:this.simMs+delayMs,duration:this.range(400,750),group,trail,halo,dot});
    }
    drawTravelers(){
      const arrivals=[];
      this.travelers=this.travelers.filter(s=>{
        const t=(this.simMs-s.start)/s.duration;
        if(t<0)return true;
        if(t>=1){s.group.remove();arrivals.push(s);return false;}
        const a=this.vertices[s.from],b=this.vertices[s.to];
        const u=t*t*(3-2*t);
        const head={x:a.x+(b.x-a.x)*u,y:a.y+(b.y-a.y)*u};
        const tailFraction=Math.max(0,u-.22);
        const tail={x:a.x+(b.x-a.x)*tailFraction,y:a.y+(b.y-a.y)*tailFraction};
        const fade=clamp(Math.sin(Math.PI*t)*2.9,0,1);
        s.trail.setAttribute('x1',tail.x);s.trail.setAttribute('y1',tail.y);
        s.trail.setAttribute('x2',head.x);s.trail.setAttribute('y2',head.y);
        s.trail.setAttribute('stroke-opacity',(.64*fade).toFixed(3));
        for(const el of [s.halo,s.dot]){
          el.setAttribute('cx',head.x);
          el.setAttribute('cy',head.y);
          el.setAttribute('opacity',(.78*fade).toFixed(3));
        }
        return true;
      });
      for(const s of arrivals){
        this.activateNode(s.to);
        if(s.kind==='outbound'){
          const r=this.uniform();
          if(r<.72){
            // Common response: immediate echo back to the original source.
            this.launchSignal(s.to,s.from,this.range(120,350),'return',s.root);
          } else if(r<.83){
            // Rare continuation: one additional neighbor, at most two hops out.
            const candidate=this.chooseNeighbors(s.to,1,[s.from,s.root]);
            if(candidate.length)this.launchSignal(s.to,candidate[0],this.range(160,370),'forward',s.root);
          }
        }
      }
    }
    // Choose a fresh subset of vertices every time; at least 2/3 of the
    // clique's missing pairs are new relative to the unchanged base graph.
    choosePlantedVertices(){
      const verts=this.vertices;
      let best=null;
      for(let trial=0;trial<220;trial++){
        const size=this.uniform()<.53?3:4;
        const visible=verts.filter(v=>v.x>=310&&v.x<=825&&v.y>=165&&v.y<=710);
        const anchor=visible[Math.floor(this.uniform()*visible.length)];
        const candidatePool=verts.filter(v=>v.id!==anchor.id &&
          Math.hypot(v.x-anchor.x,v.y-anchor.y)<(size===3?310:290) &&
          Math.hypot(v.x-anchor.x,v.y-anchor.y)>55 &&
          v.x>=280&&v.x<=875&&v.y>=115&&v.y<=745);
        if(candidatePool.length<size-1)continue;
        const chosen=[anchor.id];
        for(let k=1;k<size;k++){
          const idx=Math.floor(this.uniform()*candidatePool.length);
          chosen.push(candidatePool.splice(idx,1)[0].id);
        }
        const missing=[];
        for(let i=0;i<size;i++)for(let j=i+1;j<size;j++){
          const a=Math.min(chosen[i],chosen[j]),b=Math.max(chosen[i],chosen[j]);
          if(!this.edgeIndex.has(`${a}-${b}`))missing.push([a,b]);
        }
        if(missing.length>=Math.ceil(size*(size-1)/2*.75)){
          best={vertices:chosen,newEdges:missing};
          break;
        }
      }
      if(!best){
        // Guaranteed termination even for a nearly complete future topology.
        const chosen=[];
        const available=verts.map(v=>v.id);
        while(chosen.length<4&&available.length){
          chosen.push(available.splice(Math.floor(this.uniform()*available.length),1)[0]);
        }
        const missing=[];
        for(let i=0;i<chosen.length;i++)for(let j=i+1;j<chosen.length;j++){
          const a=Math.min(chosen[i],chosen[j]),b=Math.max(chosen[i],chosen[j]);
          if(!this.edgeIndex.has(`${a}-${b}`))missing.push([a,b]);
        }
        best={vertices:chosen,newEdges:missing};
      }
      return best;
    }
    setupGlitchLayers(){
      const overlay=this.layers.glitch;
      const defs=this.svg.querySelector('defs');
      const tint=(name,r,g,b)=>{
        const filter=svgElement('filter',{id:name,x:'-30%',y:'-30%',width:'160%',height:'160%'},defs);
        const vals=`0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  0 0 0 .7 0`;
        svgElement('feColorMatrix',{type:'matrix',values:vals},filter);
      };
      // Built only once, but support reseed() without duplicate IDs.
      for(const id of ['glitch-tint-red','glitch-tint-cyan'])defs.querySelector('#'+id)?.remove();
      for(let i=0;i<4;i++)defs.querySelector('#glitch-band-'+i)?.remove();
      tint('glitch-tint-red',1,.21,.18);
      tint('glitch-tint-cyan',.10,.92,.96);
      this.glitchBands=[];
      for(let i=0;i<4;i++){
        const clip=svgElement('clipPath',{id:'glitch-band-'+i,clipPathUnits:'userSpaceOnUse'},defs);
        const rect=svgElement('rect',{x:0,y:50+i*175,width:1100,height:38},clip);
        const g=svgElement('g',{'clip-path':`url(#glitch-band-${i})`,opacity:0},overlay);
        const cyan=svgElement('use',{href:'#base-network',filter:'url(#glitch-tint-cyan)',opacity:.77},g);
        const red=svgElement('use',{href:'#base-network',filter:'url(#glitch-tint-red)',opacity:.70},g);
        this.glitchBands.push({g,rect,cyan,red});
      }
      const full=svgElement('g',{opacity:0},overlay);
      this.rgbFull={g:full,
        cyan:svgElement('use',{href:'#base-network',filter:'url(#glitch-tint-cyan)',opacity:.45},full),
        red:svgElement('use',{href:'#base-network',filter:'url(#glitch-tint-red)',opacity:.4},full)};
      this.digitalTears=[];
      for(let i=0;i<3;i++){
        this.digitalTears.push(svgElement('rect',{x:40,y:100+i*230,width:1020,height:2.5,
          fill:i===1?'#f29c86':'#3ce8e3',opacity:0},overlay));
      }
    }
    revealAnomaly(){
      if(this.anomaly){this.anomaly.group.remove();this.anomaly=null;}
      const motif=this.choosePlantedVertices();
      const set=motif.vertices;
      this.eventLog.push({type:'motif',t:+this.simMs.toFixed(3),vertices:[...set],newEdges:motif.newEdges.map(e=>[...e])});
      if(this.eventLog.length>512)this.eventLog.shift();
      const group=svgElement('g',{},this.layers.anomalies);
      const lines=[];
      // Crucially, none of these edges exist in the base network.
      for(const [i,j] of motif.newEdges){
        const a=this.vertices[i],b=this.vertices[j];
        const d=`M ${a.x} ${a.y} L ${b.x} ${b.y}`;
        const warm=svgElement('path',{d,stroke:'#e1a28d','stroke-width':1.75,
          'stroke-opacity':0,'stroke-linecap':'round',fill:'none'},group);
        const red=svgElement('path',{d,stroke:'#f68e77','stroke-width':1.65,
          'stroke-opacity':0,fill:'none'},group);
        const cyan=svgElement('path',{d,stroke:'#49d1cc','stroke-width':1.5,
          'stroke-opacity':0,fill:'none'},group);
        lines.push({a,b,warm,red,cyan,phase:this.range(0,6.28),skew:this.range(-1,1)});
      }
      const dots=set.map(i=>{
        const v=this.vertices[i];
        return {
          halo:svgElement('circle',{cx:v.x,cy:v.y,r:v.r*4,fill:'url(#anomaly-halo)',opacity:0},group),
          node:svgElement('circle',{cx:v.x,cy:v.y,r:v.r+1,fill:'#d9a69c',opacity:0},group)
        };
      });
      this.anomaly={group,lines,dots,elapsed:0,duration:1850,
        // Short asynchronous-sounding digital interruptions within one event.
        bursts:[{start:55,end:195,amp:1},{start:325,end:448,amp:.80},
          {start:694,end:816,amp:.95},{start:1110,end:1190,amp:.62}],
        stripeY:[this.range(65,190),this.range(250,385),this.range(420,560),this.range(610,750)],
        stripeShift:[this.range(-14,-7),this.range(7,18),this.range(-18,-8),this.range(7,15)]
      };
    }
    distortedPath(a,b,amp,phase,time){
      const dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1;
      const nx=-dy/len,ny=dx/len;
      const u1=.31,u2=.68;
      const d1=amp*(.35+.65*Math.sin(time*.028+phase));
      const d2=amp*(.45+.55*Math.cos(time*.039+phase*1.4));
      return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} L ${(a.x+dx*u1+nx*d1).toFixed(2)} ${(a.y+dy*u1+ny*d1).toFixed(2)} L ${(a.x+dx*u2-nx*d2).toFixed(2)} ${(a.y+dy*u2-ny*d2).toFixed(2)} L ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
    }
    clearGlitch(){
      if(!this.rgbFull)return;
      this.layers.base.removeAttribute('transform');
      this.rgbFull.g.setAttribute('opacity',0);
      for(const s of this.glitchBands)s.g.setAttribute('opacity',0);
      for(const r of this.digitalTears)r.setAttribute('opacity',0);
    }
    drawAnomaly(dt){
      if(!this.anomaly){this.clearGlitch();return;}
      const a=this.anomaly;
      a.elapsed+=dt;
      if(a.elapsed>=a.duration){a.group.remove();this.anomaly=null;this.clearGlitch();return;}
      const t=a.elapsed,progress=t/a.duration;
      const envelope=clamp(t/160,0,1)*clamp((a.duration-t)/650,0,1);
      const inBurst=a.bursts.find(b=>t>=b.start&&t<b.end);
      const burstAmp=inBurst?inBurst.amp:0;
      const pulseIndex=inBurst?a.bursts.indexOf(inBurst):0;
      // A brief RGB displacement affects the WHOLE NETWORK, not the text.
      if(inBurst){
        const sign=pulseIndex%2?-1:1;
        const stutter=Math.sin(t*.075+4*pulseIndex);
        const x=sign*(2.7+Math.abs(stutter)*3)*burstAmp;
        this.layers.base.setAttribute('transform',`translate(${x.toFixed(2)} ${(stutter*1.2).toFixed(2)})`);
        this.rgbFull.g.setAttribute('opacity',(.56+Math.abs(stutter)*.23).toFixed(3));
        this.rgbFull.red.setAttribute('transform',`translate(${(x+8.5*burstAmp).toFixed(2)} 0)`);
        this.rgbFull.cyan.setAttribute('transform',`translate(${(x-8.5*burstAmp).toFixed(2)} 0)`);
        for(let k=0;k<this.glitchBands.length;k++){
          const s=this.glitchBands[k],jitter=Math.sin(t*.095+k*2.7);
          s.rect.setAttribute('y',(a.stripeY[k]+jitter*9).toFixed(2));
          s.rect.setAttribute('height',(18+9*Math.abs(jitter)).toFixed(2));
          s.g.setAttribute('opacity',(.53+.27*Math.abs(jitter)).toFixed(3));
          s.cyan.setAttribute('transform',`translate(${(a.stripeShift[k]*burstAmp).toFixed(2)} ${jitter.toFixed(2)})`);
          s.red.setAttribute('transform',`translate(${(-a.stripeShift[k]*.6*burstAmp).toFixed(2)} 0)`);
        }
        for(let i=0;i<this.digitalTears.length;i++){
          const e=this.digitalTears[i];
          e.setAttribute('y',(a.stripeY[(i+pulseIndex)%4]+8*Math.sin(t*.08+i)).toFixed(2));
          e.setAttribute('opacity',(.15+.22*Math.abs(Math.sin(t*.061+i))).toFixed(3));
        }
      }else this.clearGlitch();
      for(const e of a.lines){
        // Anomaly edges appear and disappear independently; distorted segments
        // resemble brief transmission/data-corruption glitches.
        const flick=.5+.5*Math.sin(t*.023+e.phase);
        const on=(flick>.24 && (inBurst || (t>210 && t<1350)))?1:0;
        const mild=(.31+.14*flick)*envelope*on;
        const deformation=burstAmp*(3.7+4.5*flick)+(!inBurst?1.0*Math.sin(t*.014+e.phase):0);
        const d=this.distortedPath(e.a,e.b,deformation,e.phase,t);
        e.warm.setAttribute('d',d);
        e.red.setAttribute('d',d);
        e.cyan.setAttribute('d',d);
        e.warm.setAttribute('stroke-opacity',mild.toFixed(3));
        e.red.setAttribute('stroke-opacity',(inBurst?.21*envelope*on:0).toFixed(3));
        e.cyan.setAttribute('stroke-opacity',(inBurst?.25*envelope*on:0).toFixed(3));
        e.red.setAttribute('transform',inBurst?'translate(3.6 -.3)':'translate(0 0)');
        e.cyan.setAttribute('transform',inBurst?'translate(-3.7 .5)':'translate(0 0)');
        e.warm.setAttribute('stroke-dasharray',inBurst?'7 2 18 3':'none');
      }
      for(const d of a.dots){
        const flick=.68+.32*Math.sin(t*.014);
        d.halo.setAttribute('opacity',(.12*envelope*flick).toFixed(3));
        d.node.setAttribute('opacity',(.31*envelope*flick).toFixed(3));
      }
    }
    toggleFocus(){this.focus=!this.focus;return this.focus;}
  }
  window.ScientificNetwork=ScientificNetwork;
})();