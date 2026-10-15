"use strict";
(()=>{
const $=(q,r=document)=>r.querySelector(q);
const $$=(q,r=document)=>Array.from(r.querySelectorAll(q));
const trigger=$("#fp-menu-trigger"),mobile=$("#fp-mobile-nav");
function setMenu(open){
 if(!trigger||!mobile)return;
 mobile.hidden=!open;
 trigger.setAttribute("aria-expanded",String(open));
 trigger.setAttribute("aria-label",open?"Fechar menu":"Abrir menu");
 document.body.classList.toggle("fp-lock-scroll",open);
}
if(trigger&&mobile){
 trigger.addEventListener("click",()=>setMenu(mobile.hidden));
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!mobile.hidden){setMenu(false);trigger.focus()}});
 document.addEventListener("click",e=>{if(!mobile.hidden&&!$("#header").contains(e.target))setMenu(false)});
 $$("#fp-mobile-nav a").forEach(a=>a.addEventListener("click",()=>setMenu(false)));
 const query=matchMedia("(min-width:931px)");
 const onChange=e=>{if(e.matches)setMenu(false)};
 if(query.addEventListener)query.addEventListener("change",onChange);
 else if(query.addListener)query.addListener(onChange);
}
const selectors=$$(".fp-demo-tabs button[data-demo-target]");
const panels=$$(".fp-demo-pane");
function showPanel(index,focus=false){
 const i=Math.max(0,Math.min(panels.length-1,index));
 selectors.forEach((button,n)=>{
  button.classList.toggle("is-active",n===i);
  button.setAttribute("aria-pressed",String(n===i));
 });
 panels.forEach((panel,n)=>{panel.hidden=n!==i});
 if(focus)selectors[i]?.focus({preventScroll:true});
}
selectors.forEach((button,index)=>{
 button.addEventListener("click",()=>showPanel(index));
 button.addEventListener("keydown",e=>{
  if(["ArrowLeft","ArrowRight","Home","End"].includes(e.key)){
   e.preventDefault();
   const target=e.key==="Home"?0:e.key==="End"?selectors.length-1:(index+(e.key==="ArrowRight"?1:selectors.length-1))%selectors.length;
   showPanel(target,true);
  }
 });
});
const filterButtons=$$(".fp-hub-filters button[data-filter]");
const cards=$$(".fp-hub-card[data-group]");
filterButtons.forEach(btn=>btn.addEventListener("click",()=>{
 const selected=btn.dataset.filter;
 filterButtons.forEach(x=>{x.classList.toggle("is-active",x===btn);x.setAttribute("aria-pressed",String(x===btn))});
 let shown=0;
 cards.forEach(card=>{const visible=selected==="all"||selected===card.dataset.group;card.hidden=!visible;if(visible)shown++});
 const empty=$(".fp-hub-empty");if(empty)empty.hidden=shown>0;
}));
$$(".fp-faq-list details").forEach(detail=>detail.addEventListener("toggle",()=>{
 if(detail.open)$$(".fp-faq-list details").forEach(other=>{if(other!==detail)other.open=false});
}));
const sticky=$("#fp-mobile-cta");
if(sticky){
 let ticking=false;
 function update(){
  const hero=$(".fp-hero")||$(".fp-hub-hero"),pitch=$(".fp-pitch");
  const heroVisible=hero?.getBoundingClientRect().bottom>innerHeight*.38;
  const pitchVisible=pitch?.getBoundingClientRect().top<innerHeight*.83&&pitch?.getBoundingClientRect().bottom>0;
  const hide=Boolean(heroVisible||pitchVisible);
  sticky.classList.toggle("is-hidden",hide);
  sticky.setAttribute("aria-hidden",String(hide));
  const a=$("a",sticky);if(a)a.tabIndex=hide?-1:0;
 }
 const onScroll=()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{update();ticking=false})};
 window.addEventListener("scroll",onScroll,{passive:true});
 window.addEventListener("resize",onScroll,{passive:true});
 update();
}
})();
