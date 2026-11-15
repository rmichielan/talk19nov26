  // The deck is designed once at 1600 x 900. Resize changes only this scale.
  const Viewport=(()=>{
    const width=1600,height=900;
    let scale=1;
    function fit(){
      scale=Math.min(innerWidth/width,innerHeight/height);
      document.documentElement.style.setProperty('--deck-scale',String(scale));
    }
    function rect(element){
      const r=element.getBoundingClientRect();
      const frame=document.querySelector('#slide').getBoundingClientRect();
      const s=frame.width/width||scale;
      return {left:(r.left-frame.left)/s,top:(r.top-frame.top)/s,width:r.width/s,height:r.height/s};
    }
    function contentRect(element,aspect=1100/860){
      const r=rect(element),w=Math.min(r.width,r.height*aspect),h=w/aspect;
      return {left:r.left+(r.width-w)/2,top:r.top+(r.height-h)/2,width:w,height:h};
    }
    fit();
    addEventListener('resize',fit);
    document.addEventListener('fullscreenchange',fit);
    return {width,height,rect,contentRect,get scale(){return scale;}};
  })();
