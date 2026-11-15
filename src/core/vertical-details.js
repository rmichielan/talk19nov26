/* Configurable vertical details: source and parent slides are declared in src/details.json.
 * Down enters; Up returns to the exact reveal; Right/Space advances the detail.
 */
const AsideNav=(()=>{
 let active=null,parentStep=0,current=0;
 const entry=name=>DECK_DETAILS[name];
 function render(){
  if(!active)return;
  const cfg=entry(active),root=$('#aside-'+active);
  root.dataset.step=current;
  DetailRenderers.stop?.();
  DetailRenderers.phases?.(root,current);
  DetailRenderers.render?.(active,current);
  $('#counter').textContent=cfg.label+' / '+slideCount;
 }
 function open(name){
  const cfg=entry(name);
  if(!cfg||active===name)return;
  const parent=cfg.parent;
  if(slide!==parent)go(parent,slideMeta(parent).reveals);
  DetailRenderers.stop?.();
  parentStep=step;active=name;current=0;
  document.body.dataset.aside=name;
  document.querySelector(`.stage[data-slide="${slide}"]`)?.classList.remove('is-active');
  const root=$('#aside-'+name);
  root.classList.add('is-active');root.inert=false;
  root.setAttribute('aria-hidden','false');render();
 }
 function close(resume=true){
  if(!active)return;
  DetailRenderers.stop?.();
  const root=$('#aside-'+active);
  root.classList.remove('is-active');root.inert=true;
  root.setAttribute('aria-hidden','true');
  active=null;delete document.body.dataset.aside;
  const parent=document.querySelector(`.stage[data-slide="${slide}"]`);
  parent?.classList.add('is-active');
  if(resume){step=parentStep;$('#counter').textContent=String(slide).padStart(2,'0')+' / '+String(slideCount).padStart(2,'0');}
 }
 function nextDetail(){
  if(!active)return;
  if(current<entry(active).reveals){current++;render();}
  else{const nextPage=slide+1;close(false);go(nextPage,0);}
 }
 document.querySelectorAll('[data-open-aside]').forEach(b=>b.onclick=()=>open(b.dataset.openAside));
 document.querySelectorAll('[data-close-aside]').forEach(b=>b.onclick=()=>close());
 return{
  open,close,
  forSlide:page=>Object.keys(DECK_DETAILS).find(name=>entry(name).parent===page)||null,
  restore(saved){if(!saved?.active)return;open(saved.active);current=saved.current;render();},
  next:nextDetail,
  prev(){if(current>0){current--;render();}else close();},
  trigger:render,
  get active(){return active;},
  state:()=>({active,current,parent:slide,parentStep}),
  reset(){DetailRenderers.reset?.();}
 };
})();
