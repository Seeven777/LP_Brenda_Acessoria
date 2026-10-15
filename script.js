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
      const popup=window.open(target,"_blank","noopener,noreferrer");
      successCopy.textContent="Sua mensagem está pronta. O WhatsApp foi aberto para você conferir e enviar o contato. Se a nova aba não abriu, copie a mensagem abaixo.";
      if(!popup){successCopy.textContent="Copie sua mensagem abaixo para entrar em contato. O navegador pode ter bloqueado a nova aba do WhatsApp."}
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
 const demo=[
  {title:"Brenda • Atendimento",messages:[["in","Oi, vocês estão abertos?"],["out","Olá! Sim, estamos atendendo. 😊 Quer conhecer nosso cardápio?"],["in","Quero pedir para entrega."],["out","Perfeito! Vamos escolher seu pedido."]]},
  {title:"Brenda • Cardápio",messages:[["in","Tem combo com batata?"],["out","Temos sim! Nosso combo inclui burger, batata e bebida."],["in","Vou querer um, sem cebola."],["out","Combinado! Vou anotar sem cebola."]]},
  {title:"Brenda • Pedidos",messages:[["in","É para entregar aqui perto."],["out","Ótimo! Vou confirmar os dados e a forma de pagamento."],["order","Pedido em organização|1 combo da casa, sem cebola|Aguardando confirmação"]]},
  {title:"Brenda • Relacionamento",messages:[["out","Obrigado pelo seu pedido! Esperamos que tenha gostado."],["in","Estava uma delícia! 😍"],["out","Que bom! Quando quiser repetir, estaremos por aqui."]]}
 ];
 const msgRoot=$("#stage-messages"),deviceTitle=$("#device-title"),stageCounter=$("#stage-counter"),storySteps=$$(".story-step"),dots=$$(".stage-dot");let activeIndex=-1;
 function showStep(index){const i=Math.max(0,Math.min(3,index));if(i===activeIndex)return;activeIndex=i;storySteps.forEach(function(e,n){e.classList.toggle("is-active",n===i)});dots.forEach(function(e,n){e.classList.toggle("active",n===i);if(n===i)e.setAttribute("aria-current","step");else e.removeAttribute("aria-current")});deviceTitle.textContent=demo[i].title;stageCounter.textContent="0"+(i+1)+" / 04";msgRoot.replaceChildren();demo[i].messages.forEach(function(pair,n){let node;if(pair[0]==="order"){const parts=pair[1].split("|");node=document.createElement("div");node.className="stage-order";const top=document.createElement("div");top.className="stage-order-top";top.textContent=parts[0];const item=document.createElement("strong");item.textContent=parts[1];const foot=document.createElement("small");foot.textContent=parts[2];node.append(top,item,foot)}else{node=document.createElement("div");node.className="stage-msg "+pair[0];node.textContent=pair[1]}node.style.animationDelay=(n*85)+"ms";msgRoot.appendChild(node)})}
 dots.forEach(function(dot){dot.addEventListener("click",function(){const n=Number(dot.dataset.showStep);showStep(n);if(window.innerWidth>700)storySteps[n].scrollIntoView({behavior:"smooth",block:"center"})})});
 if("IntersectionObserver"in window){const stepObserver=new IntersectionObserver(function(entries){let best=null;entries.forEach(function(e){if(e.isIntersecting&&(!best||e.intersectionRatio>best.intersectionRatio))best=e});if(best)showStep(Number(best.target.dataset.step))},{rootMargin:"-30% 0px -32% 0px",threshold:[0,.15,.3,.55,1]});storySteps.forEach(function(el){stepObserver.observe(el)})}showStep(0);
 $$(".faq-items details").forEach(function(d){d.addEventListener("toggle",function(){if(d.open)$$(".faq-items details").forEach(function(other){if(other!==d)other.open=false})})});
 $("#year").textContent=new Date().getFullYear();
})();