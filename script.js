"use strict";
(function(){
 const config=window.BRENDA_CONFIG||{};
 const $=function(s,r){return(r||document).querySelector(s)};
 const $$=function(s,r){return Array.from((r||document).querySelectorAll(s))};
 const header=$("#site-header"),progress=$("#scroll-progress");
 let ticking=false;
 function onScroll(){if(ticking)return;ticking=true;requestAnimationFrame(function(){const y=window.scrollY;header.classList.toggle("is-scrolled",y>24);const max=document.documentElement.scrollHeight-window.innerHeight;progress.style.width=(max?Math.min(100,y/max*100):0)+"%";ticking=false})}
 window.addEventListener("scroll",onScroll,{passive:true});onScroll();
 const menuToggle=$("#menu-toggle"),mobileMenu=$("#mobile-menu");
 function closeMenu(){menuToggle.setAttribute("aria-expanded","false");menuToggle.setAttribute("aria-label","Abrir menu");mobileMenu.hidden=true}
 menuToggle.addEventListener("click",function(){const next=menuToggle.getAttribute("aria-expanded")!=="true";menuToggle.setAttribute("aria-expanded",String(next));menuToggle.setAttribute("aria-label",next?"Fechar menu":"Abrir menu");mobileMenu.hidden=!next});
 $$("#mobile-menu a").forEach(function(a){a.addEventListener("click",closeMenu)});
 const revealObserver="IntersectionObserver"in window?new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add("is-visible");revealObserver.unobserve(entry.target)}})},{threshold:.08,rootMargin:"0px 0px -30px 0px"}):null;
 $$(".reveal").forEach(function(e){if(revealObserver)revealObserver.observe(e);else e.classList.add("is-visible")});
 const dialogs=$("#lead-modal"),openers=$$("[data-open-lead]"),close=$("#modal-close"),form=$("#lead-form"),formView=$("#lead-form-view"),successView=$("#lead-success-view"),copy=$("#lead-copy"),newBtn=$("#lead-new"),successCopy=$("#lead-success-copy"),summary=$("#lead-summary"),sr=$("#screenreader-status");let modalPreviousFocus=null;
 function openDialog(){closeMenu();modalPreviousFocus=document.activeElement;if(!dialogs.open){if(typeof dialogs.showModal==="function"){dialogs.showModal()}else dialogs.setAttribute("open","")}document.body.style.overflow="hidden"}
 function closeDialog(){if(dialogs.open){if(typeof dialogs.close==="function")dialogs.close();else dialogs.removeAttribute("open")}document.body.style.overflow="";if(modalPreviousFocus&&typeof modalPreviousFocus.focus==="function")modalPreviousFocus.focus()}
 openers.forEach(function(btn){btn.addEventListener("click",function(e){e.preventDefault();openDialog()})});
 close.addEventListener("click",closeDialog);
 dialogs.addEventListener("click",function(e){if(e.target===dialogs)closeDialog()});
 dialogs.addEventListener("close",function(){document.body.style.overflow=""});
 function escapeMessage(v){return String(v||"").trim().replace(/\s+/g," ").slice(0,160)}
 function buildLead(data){return "Olá! Quero solicitar um diagnóstico para implantar a Brendi/Brenda no meu estabelecimento.\n\n"+
 "Nome: "+escapeMessage(data.name)+"\n"+
 "Estabelecimento: "+escapeMessage(data.business)+"\n"+
 "WhatsApp: "+escapeMessage(data.phone)+"\n"+
 "Cidade: "+escapeMessage(data.city)+"\n"+
 "Principal desafio: "+escapeMessage(data.challenge)+"\n\n"+
 "Gostaria de entender como funciona a assessoria de implantação."}
 form.addEventListener("submit",function(e){
   e.preventDefault();if(!form.reportValidity())return;
   const data=Object.fromEntries(new FormData(form).entries());
   const digits=String(data.phone||"").replace(/\D/g,"");
   if(digits.length<10||digits.length>13){$("input[name=phone]",form).setCustomValidity("Informe seu WhatsApp com DDD.");form.reportValidity();return}
   const message=buildLead(data);summary.value=message;
   const businessDigits=String(config.whatsAppNumber||"").replace(/\D/g,"");
   if(businessDigits.length>=12&&businessDigits.length<=13){
      const target="https://wa.me/"+businessDigits+"?text="+encodeURIComponent(message);
      window.open(target,"_blank","noopener,noreferrer");
      if(Array.isArray(window.dataLayer))window.dataLayer.push({event:"diagnostico_whatsapp_iniciado"});
      successCopy.textContent="Sua mensagem está preparada. Confira a nova aba do WhatsApp para revisar e enviar. Caso a aba tenha sido bloqueada, copie a mensagem abaixo.";
   }else{
      successCopy.textContent="Esta é uma prévia do site. O WhatsApp comercial ainda não foi configurado; sua mensagem foi preparada para você copiar. Nenhum dado foi enviado ou armazenado.";
   }
   formView.hidden=true;successView.hidden=false;copy.focus();
 });
 const phoneField=$("input[name=phone]",form);
 phoneField.addEventListener("input",function(){phoneField.setCustomValidity("")});
 copy.addEventListener("click",async function(){try{await navigator.clipboard.writeText(summary.value);copy.textContent="Copiado ✓";sr.textContent="Mensagem copiada";setTimeout(function(){copy.textContent="Copiar mensagem"},2200)}catch(_){summary.focus();summary.select();copy.textContent="Selecione e copie"}});newBtn.addEventListener("click",function(){formView.hidden=false;successView.hidden=true;form.querySelector("input").focus()});
 const orders=$("#orders"),minutes=$("#minutes"),days=$("#days");
 function calc(){const o=Number(orders.value),m=Number(minutes.value),d=Number(days.value),hrs=o*m*d/60;$("#orders-output").textContent=o.toLocaleString("pt-BR");$("#minutes-output").textContent=m+" min";$("#days-output").textContent=d;$("#hours-result").textContent=new Intl.NumberFormat("pt-BR",{maximumFractionDigits:1}).format(hrs);$("#calc-equivalent").textContent="O equivalente a "+new Intl.NumberFormat("pt-BR",{maximumFractionDigits:1}).format(hrs/8)+" jornadas de 8 horas.";[orders,minutes,days].forEach(function(el){const percent=(Number(el.value)-Number(el.min))/(Number(el.max)-Number(el.min))*100;el.style.background="linear-gradient(90deg,#a3cb50 "+percent+"%,#dbe2d5 "+percent+"%)"})}
 [orders,minutes,days].forEach(function(el){el.addEventListener("input",calc)});calc();

 // Story state is driven by document geometry, never by competing IntersectionObservers.
 // Clicking a control changes the visualization only; it never triggers scrollIntoView.
 const demo=[
   {title:"Brenda • Atendimento",messages:[["in","Oi, vocês estão abertos?"],["out","Olá! Sim, estamos atendendo. Quer conhecer nosso cardápio?"],["in","Quero pedir para entrega."],["out","Perfeito! Vamos escolher seu pedido."]]},
   {title:"Brenda • Cardápio",messages:[["in","Tem combo com batata?"],["out","Temos sim! Nosso combo inclui burger, batata e bebida."],["in","Vou querer um, sem cebola."],["out","Combinado! Vou anotar sem cebola."]]},
   {title:"Brenda • Pedidos",messages:[["in","É para entregar aqui perto."],["out","Ótimo! Vou confirmar os dados e a forma de pagamento."],["order","Pedido em organização|1 combo da casa, sem cebola|Aguardando confirmação"]]},
   {title:"Brenda • Relacionamento",messages:[["out","Obrigado pelo seu pedido! Esperamos que tenha gostado."],["in","Estava uma delícia!"],["out","Que bom! Quando quiser repetir, estaremos por aqui."]]}
 ];
 const msgRoot=$("#stage-messages"),deviceTitle=$("#device-title"),stageCounter=$("#stage-counter"),storySteps=$$(".story-step"),dots=$$(".stage-dot"),storySection=$("#experiencia"),storyStage=$("#story-stage");
 let activeIndex=-1,manualSelectionY=null;
 function showStep(index,force){
   const i=Math.max(0,Math.min(demo.length-1,Number(index)||0));
   if(i===activeIndex&&!force)return;
   activeIndex=i;
   storySteps.forEach(function(el,n){el.classList.toggle("is-active",n===i);el.setAttribute("aria-pressed",String(n===i))});
   dots.forEach(function(el,n){el.classList.toggle("active",n===i);if(n===i)el.setAttribute("aria-current","step");else el.removeAttribute("aria-current")});
   storyStage.dataset.activeStep=String(i);
   storyStage.style.setProperty("--step-fill",((i+1)/demo.length*100)+"%");
   deviceTitle.textContent=demo[i].title;
   stageCounter.textContent="0"+(i+1)+" / 04";
   const children=document.createDocumentFragment();
   demo[i].messages.forEach(function(pair,n){
     const node=document.createElement("div");
     if(pair[0]==="order"){
       const fields=pair[1].split("|");node.className="stage-order";
       const title=document.createElement("div");title.className="stage-order-top";title.textContent=fields[0];
       const item=document.createElement("strong");item.textContent=fields[1];
       const foot=document.createElement("small");foot.textContent=fields[2];
       node.append(title,item,foot);
     }else{node.className="stage-msg "+pair[0];node.textContent=pair[1]}
     node.style.animationDelay=n*70+"ms";
     children.appendChild(node);
   });
   msgRoot.replaceChildren(children);
 }
 function chooseManually(i){
   manualSelectionY=window.scrollY;
   showStep(i);
   storyStage.classList.remove("story-bounce");
   void storyStage.offsetWidth;
   storyStage.classList.add("story-bounce");
 }
 dots.forEach(function(el){el.addEventListener("click",function(){chooseManually(el.dataset.showStep)})});
 storySteps.forEach(function(el){
   el.addEventListener("click",function(){chooseManually(el.dataset.step)});
   el.addEventListener("keydown",function(ev){if(ev.key==="Enter"||ev.key===" "){ev.preventDefault();chooseManually(el.dataset.step)}});
 });
 function updateStory(){
   const sectionRect=storySection.getBoundingClientRect();
   if(sectionRect.top>innerHeight||sectionRect.bottom<0)return;
   if(manualSelectionY!==null){
     if(Math.abs(window.scrollY-manualSelectionY)<55)return;
     manualSelectionY=null;
   }
   const mobile=window.innerWidth<=700;
   const scanY=window.innerHeight*(mobile?.83:.55);
   let selected=0;
   storySteps.forEach(function(step,index){if(step.getBoundingClientRect().top<=scanY)selected=index});
   showStep(selected);
 }
 const prefersLessMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 const parallaxItems=$$("[data-parallax]");
 const floating=$("#floating-contact");
 const hero=$("#inicio"),finalSection=$("#contato");
 let visualTicking=false;
 function updateDynamicVisuals(){
   updateStory();
   const isAfterHero=window.scrollY>Math.max(520,hero.offsetHeight*.78);
   const nearFinal=finalSection.getBoundingClientRect().top<innerHeight*.85;
   const showFloating=isAfterHero&&!nearFinal&&!dialogs.open;
   floating.classList.toggle("is-visible",showFloating);
   floating.tabIndex=showFloating?0:-1;
   if(!prefersLessMotion){
     parallaxItems.forEach(function(el){
       const parent=el.closest("section"),r=parent.getBoundingClientRect();
       if(r.bottom<0||r.top>innerHeight)return;
       const offset=(window.innerHeight*.5-(r.top+r.height*.5))*Number(el.dataset.parallax||0);
       el.style.setProperty("--parallax-y",Math.max(-55,Math.min(55,offset)).toFixed(1)+"px");
     });
   }
 }
 function onVisualScroll(){
   if(visualTicking)return;visualTicking=true;
   requestAnimationFrame(function(){updateDynamicVisuals();visualTicking=false});
 }
 window.addEventListener("scroll",onVisualScroll,{passive:true});
 window.addEventListener("resize",onVisualScroll,{passive:true});
 // Light-touch hover spotlight and staged entrances.
 $$(".pain-card,.feature-card,.more-card").forEach(function(card){
   card.addEventListener("pointermove",function(ev){
     if(prefersLessMotion||ev.pointerType==="touch")return;
     const r=card.getBoundingClientRect();
     card.style.setProperty("--spot-x",((ev.clientX-r.left)/r.width*100).toFixed(2)+"%");
     card.style.setProperty("--spot-y",((ev.clientY-r.top)/r.height*100).toFixed(2)+"%");
   },{passive:true});
 });
 $$(".pain-card,.feature-card,.more-card,.method-item").forEach(function(card,i){card.style.setProperty("--reveal-delay",(i%3*70)+"ms")});
 // Non-identifying analytics event hooks work only if the site adds a dataLayer.
 $$("[data-track]").forEach(function(link){
   link.addEventListener("click",function(){
     if(Array.isArray(window.dataLayer))window.dataLayer.push({event:link.dataset.track});
   });
 });
 showStep(0,true);
 updateDynamicVisuals();
 $$(".faq-items details").forEach(function(d){d.addEventListener("toggle",function(){if(d.open)$$(".faq-items details").forEach(function(other){if(other!==d)other.open=false})})});
 $("#year").textContent=new Date().getFullYear();
})();