"use strict";
(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const reduce=matchMedia("(prefers-reduced-motion: reduce)");
const header=$("#header"),progress=$("#progress-bar"),menu=$("#menu-toggle"),nav=$("#mobile-nav"),mobileAction=$("#mobile-action"),closing=$("#contato");
function setMenu(open){nav.hidden=!open;menu.setAttribute("aria-expanded",String(open));menu.setAttribute("aria-label",open?"Fechar menu":"Abrir menu");document.body.classList.toggle("menu-open",open)}
menu.addEventListener("click",()=>setMenu(nav.hidden));
$$("#mobile-nav a").forEach(el=>el.addEventListener("click",()=>setMenu(false)));
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!nav.hidden){setMenu(false);menu.focus()}});
document.addEventListener("click",e=>{if(!nav.hidden&&!header.contains(e.target))setMenu(false)});
matchMedia("(min-width:931px)").addEventListener("change",e=>{if(e.matches)setMenu(false)});
let ticking=false;
function updateScroll(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max?Math.min(100,100*scrollY/max):0)+"%";header.classList.toggle("is-scrolled",scrollY>12);mobileAction.classList.toggle("is-hidden",closing.getBoundingClientRect().top<innerHeight*.75)}
function onScroll(){if(ticking)return;ticking=true;requestAnimationFrame(()=>{updateScroll();ticking=false})}
window.addEventListener("scroll",onScroll,{passive:true});window.addEventListener("resize",onScroll,{passive:true});updateScroll();
const reveals=$$("[data-reveal]");
if("IntersectionObserver" in window&&!reduce.matches){const ob=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("is-visible");ob.unobserve(e.target)}}),{rootMargin:"0px 0px -25px 0px",threshold:.08});reveals.forEach(el=>ob.observe(el))}
else reveals.forEach(el=>el.classList.add("is-visible"));
const steps=[
{eyebrow:"01 / ATENDIMENTO",title:"O cliente chama. A Brenda responde.",description:"Dúvidas e pedidos começam no WhatsApp. A IA pode orientar a conversa de maneira natural.",messages:[["in","Oi! Vocês estão atendendo?"],["out","Olá! Estamos sim. Posso te ajudar com o pedido?"],["in","Quero ver os pratos de hoje."],["out","Claro! Vou te mostrar nosso cardápio."]]},
{eyebrow:"02 / CARDÁPIO",title:"Escolher fica mais fácil.",description:"Com as opções organizadas, o cliente encontra produtos, complementos e condições de compra.",messages:[["in","Tem alguma opção com frango?"],["out","Temos opções com frango. Quer conferir?"],["in","Pode ser, sem cebola."],["out","Perfeito. Vamos conferir os detalhes."]]},
{eyebrow:"03 / PEDIDOS",title:"Cada pedido tem um caminho claro.",description:"As etapas podem ser acompanhadas em uma rotina integrada, conforme as configurações do estabelecimento.",messages:[["in","Quero finalizar para entrega."],["out","Vamos confirmar os dados para seguir com o pedido."],["in","Tudo certo por aqui."],["out","Ótimo! Vou encaminhar os próximos passos."]]},
{eyebrow:"04 / RECOMPRA",title:"O relacionamento continua depois.",description:"Campanhas e ações de relacionamento podem ajudar o estabelecimento a manter contato com sua própria base.",messages:[["out","Obrigado pelo seu pedido! Esperamos que tenha gostado."],["in","Estava uma delícia!"],["out","Que bom receber esse retorno. Até a próxima!"]]}
];
const tabs=$$(".story-tab"),prev=$("#story-prev"),next=$("#story-next"),messages=$("#story-messages"),rail=$("#story-controls");
let current=0;
function showStep(index,focus=false){
current=Math.min(3,Math.max(0,index));
tabs.forEach((tab,n)=>{const active=n===current;tab.classList.toggle("is-selected",active);tab.setAttribute("aria-pressed",String(active))});
$("#story-title").textContent=steps[current].title;$("#story-description").textContent=steps[current].description;$("#story-eyebrow").textContent=steps[current].eyebrow;$("#story-count").textContent=String(current+1).padStart(2,"0")+" — 04";
prev.disabled=current===0;next.disabled=current===3;
const fragment=document.createDocumentFragment();
steps[current].messages.forEach(([dir,value],i)=>{const bubble=document.createElement("div");bubble.className="bubble "+dir;bubble.textContent=value;bubble.style.animationDelay=i*70+"ms";fragment.append(bubble)});
messages.replaceChildren(fragment);
if(focus)tabs[current].focus({preventScroll:true});
if(rail.scrollWidth>rail.clientWidth){const t=tabs[current];rail.scrollTo({left:t.offsetLeft-rail.offsetLeft-(rail.clientWidth-t.clientWidth)/2,behavior:reduce.matches?"auto":"smooth"})}
}
tabs.forEach((tab,i)=>{tab.addEventListener("click",()=>showStep(i));tab.addEventListener("keydown",e=>{if(["ArrowRight","ArrowLeft","Home","End"].includes(e.key)){e.preventDefault();showStep(e.key==="Home"?0:e.key==="End"?3:(i+(e.key==="ArrowRight"?1:3))%4,true)}})});
prev.addEventListener("click",()=>showStep(current-1));next.addEventListener("click",()=>showStep(current+1));showStep(0);
const orders=$("#orders"),minutes=$("#minutes"),days=$("#days");
const number=n=>new Intl.NumberFormat("pt-BR",{maximumFractionDigits:1}).format(n);
function calculate(){const o=+orders.value,m=+minutes.value,d=+days.value,h=o*m*d/60;
$("#orders-output").textContent=String(o);$("#minutes-output").textContent=m+" min";$("#days-output").textContent=String(d);$("#hours-result").textContent=number(h);$("#calc-equivalent").textContent="Equivale a "+number(h/8)+" jornadas de 8 horas.";
[orders,minutes,days].forEach(el=>{const v=(+el.value-+el.min)/(+el.max-+el.min)*100;el.style.background="linear-gradient(90deg,#436b48 "+v+"%,#d9e2d6 "+v+"%)"})}
[orders,minutes,days].forEach(el=>el.addEventListener("input",calculate));calculate();
const modal=$("#lead-modal"),form=$("#lead-form"),entry=$("#lead-entry"),result=$("#lead-result"),summary=$("#lead-summary");let previousFocus=null;
function openLead(e){if(e)e.preventDefault();setMenu(false);previousFocus=document.activeElement;entry.hidden=false;result.hidden=true;if(!modal.open)modal.showModal();document.body.classList.add("dialog-open")}
function closeLead(){if(modal.open)modal.close();document.body.classList.remove("dialog-open");if(previousFocus?.focus)previousFocus.focus({preventScroll:true})}
$$("[data-open-lead]").forEach(btn=>btn.addEventListener("click",openLead));
$("#lead-close").addEventListener("click",closeLead);modal.addEventListener("click",e=>{if(e.target===modal)closeLead()});modal.addEventListener("close",()=>document.body.classList.remove("dialog-open"));
const phone=form.elements.phone;phone.addEventListener("input",()=>phone.setCustomValidity(""));
const trim=v=>String(v||"").trim().replace(/\s+/g," ").slice(0,125);
form.addEventListener("submit",e=>{
e.preventDefault();if(!form.reportValidity())return;
const data=Object.fromEntries(new FormData(form).entries());const digits=String(data.phone||"").replace(/\D/g,"");
if(digits.length<10||digits.length>13){phone.setCustomValidity("Informe o WhatsApp com DDD.");phone.reportValidity();return}
const text="Olá! Gostaria de solicitar um diagnóstico para implantação da Brendi/Brenda.\n\nNome: "+trim(data.name)+"\nEstabelecimento: "+trim(data.business)+"\nWhatsApp: "+trim(data.phone)+"\nCidade: "+trim(data.city)+"\nNecessidade: "+trim(data.challenge)+"\n\nGostaria de conversar sobre a assessoria.";
summary.value=text;
const company=String(window.BRENDA_CONFIG?.whatsAppNumber||"").replace(/\D/g,"");
if(company.length===13){window.open("https://wa.me/"+company+"?text="+encodeURIComponent(text),"_blank","noopener,noreferrer");$("#lead-result-text").textContent="A mensagem está preparada. Confira a nova aba do WhatsApp para revisar e enviar. Caso ela não tenha aberto, copie a mensagem abaixo.";if(Array.isArray(window.dataLayer))window.dataLayer.push({event:"diagnostico_whatsapp_aberto"})}
else $("#lead-result-text").textContent="O número comercial não está configurado. Sua mensagem está pronta para copiar; nada foi enviado.";
entry.hidden=true;result.hidden=false;$("#copy-message").focus();
});
$("#copy-message").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(summary.value);$("#copy-message").textContent="Mensagem copiada ✓";$("#screenreader-status").textContent="Mensagem copiada"}catch(_){summary.focus();summary.select();$("#screenreader-status").textContent="Selecione o texto para copiar manualmente"}});
$("#lead-back").addEventListener("click",()=>{entry.hidden=false;result.hidden=true;form.elements.name.focus()});
const video=$("#cinema-video");let loaded=false;
function startVideo(){if(loaded||innerWidth<=680||reduce.matches||navigator.connection?.saveData)return;loaded=true;const iframe=document.createElement("iframe");iframe.src="https://player.vimeo.com/video/"+encodeURIComponent(video.dataset.videoId)+"?background=1&autoplay=1&muted=1&loop=1&autopause=0&title=0&byline=0&portrait=0";iframe.title="Vídeo ilustrativo de pessoas preparando alimentos";iframe.allow="autoplay; fullscreen";iframe.loading="lazy";iframe.tabIndex=-1;iframe.setAttribute("aria-hidden","true");video.append(iframe)}
if("IntersectionObserver" in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){startVideo();io.disconnect()}}),{rootMargin:"250px"});io.observe(video)}
$$(".faq-list details").forEach(d=>d.addEventListener("toggle",()=>{if(d.open)$$(".faq-list details").forEach(other=>{if(other!==d)other.open=false})}));
$$("[data-track]").forEach(link=>link.addEventListener("click",()=>{if(Array.isArray(window.dataLayer))window.dataLayer.push({event:link.dataset.track})}));
$("#year").textContent=new Date().getFullYear();
})();
