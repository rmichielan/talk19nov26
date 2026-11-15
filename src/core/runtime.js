
  const $=s=>document.querySelector(s),NS='http://www.w3.org/2000/svg';
  const E=(tag,attrs={},p)=>{const e=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))e.setAttribute(k,v);p?.appendChild(e);return e;};
  const mkRand=s=>{let a=s>>>0;return()=>{a=(a+0x6d2b79f5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};};
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

  let slide=1,step=0,paused=false;
