  // Shared, pause-aware delay for slide-specific animation triggers.
  function waitPresentation(ms,valid){
    return new Promise(resolve=>{
      let previous=null,remaining=ms;
      const frame=now=>{
        if(!valid())return resolve(false);
        if(previous!==null&&!paused)remaining-=Math.max(0,now-previous);
        previous=now;
        if(remaining<=0)resolve(true);else requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    });
  }
  // Color interpolation is symmetric: returning to an unmodified copy restores
  // its original node colors without a last-frame flash.
  const parseRgb=color=>{
    const values=(String(color).match(/[0-9]+/g)||[]).map(Number);
    if(String(color).startsWith('#')){
      const hex=String(color).slice(1);
      return [0,2,4].map(i=>parseInt(hex.slice(i,i+2),16));
    }
    return values.slice(0,3);
  };
  const lerpColor=(a,b,p)=>{
    const ra=parseRgb(a),rb=parseRgb(b);
    return 'rgb('+ra.map((v,i)=>Math.round(v*(1-p)+rb[i]*p)).join(',')+')';
  };
