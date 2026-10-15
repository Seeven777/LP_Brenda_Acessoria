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

// Self-assessment drawn from five common menu practices. This is a self-report,
// not an automated audit or the Brendi Raio-X product.
const auditQuestions=[
 {topic:"IDENTIDADE VISUAL",question:"Seu cardápio tem logo, cores e uma aparência coerente com a sua marca?",hint:"Pense na primeira impressão de quem ainda não conhece seu restaurante.",label:"Identidade visual",recommendation:"Padronizar marca, cores e apresentação visual para que o cardápio seja reconhecível."},
 {topic:"ORGANIZAÇÃO DO CARDÁPIO",question:"Seus produtos estão divididos em categorias fáceis de encontrar?",hint:"Um cliente novo conseguiria localizar pratos, combos e bebidas sem precisar procurar muito?",label:"Organização das categorias",recommendation:"Reordenar categorias e itens para tornar a escolha mais intuitiva."},
 {topic:"FOTOS DOS PRODUTOS",question:"Seus principais pratos têm fotos reais, claras e convidativas?",hint:"As imagens representam o produto que o cliente realmente vai receber?",label:"Fotografia de produtos",recommendation:"Priorizar fotos verdadeiras e bem iluminadas dos itens mais importantes."},
 {topic:"DESCRIÇÕES E INFORMAÇÕES",question:"As descrições explicam ingredientes, porções e detalhes importantes?",hint:"O cliente sabe o que está comprando, inclusive quando há ingredientes que exigem atenção?",label:"Descrições dos pratos",recommendation:"Revisar descrições, informações úteis e possíveis alergênicos com clareza."},
 {topic:"PROMOÇÕES E MARGEM",question:"Você planeja as promoções considerando custos e margem de lucro?",hint:"Descontos frequentes sem cálculo podem comprometer o resultado da operação.",label:"Estratégia de promoções",recommendation:"Planejar ofertas pontuais e sustentáveis, evitando descontos sem controle."}
];
const quiz=$("#audit-quiz"),auditResult=$("#audit-result"),auditAnswers=Array(auditQuestions.length).fill(null);
const auditButtons=$(".audit-choice"),auditPrevious=$("#audit-prev"),auditNext=$("#audit-next");
let auditPosition=0,auditComplete=false;
function renderAudit(){
  const q=auditQuestions[auditPosition];
  $("#audit-step-counter").textContent=String(auditPosition+1).padStart(2,"0")+" / 05";
  $("#audit-progress").setAttribute("aria-valuenow",String(auditPosition+1));
  $("#audit-progress-fill").style.width=((auditPosition+1)*20)+"%";
  $("#audit-topic").textContent=q.topic;
  $("#audit-question").textContent=q.question;
  $("#audit-hint").textContent=q.hint;
  auditButtons.forEach(b=>b.setAttribute("aria-pressed",String(Number(b.dataset.value)===auditAnswers[auditPosition])));
  auditPrevious.disabled=auditPosition===0;
  auditNext.disabled=auditAnswers[auditPosition]===null;
  auditNext.innerHTML=(auditPosition===auditQuestions.length-1?"Ver meu resultado":"Continuar")+' <span aria-hidden="true">→</span>';
}
auditButtons.forEach(b=>b.addEventListener("click",()=>{
  auditAnswers[auditPosition]=Number(b.dataset.value);
  renderAudit();
  if(Array.isArray(window.dataLayer))window.dataLayer.push({event:"avaliacao_cardapio_resposta",question:auditPosition+1});
}));
auditPrevious.addEventListener("click",()=>{if(auditPosition>0){auditPosition--;renderAudit()}});
auditNext.addEventListener("click",()=>{
  if(auditAnswers[auditPosition]===null)return;
  if(auditPosition<auditQuestions.length-1){
    auditPosition++;renderAudit();
  }else completeAudit();
});
function completeAudit(){
  auditComplete=true;
  const score=auditAnswers.reduce((sum,v)=>sum+v,0);
  const issues=auditQuestions.map((q,i)=>({...q,score:auditAnswers[i],index:i})).filter(q=>q.score<2).sort((a,b)=>a.score-b.score||a.index-b.index);
  $("#audit-score").textContent=String(score);
  $("#audit-result-label").textContent=score>=8?"BASE BEM ESTRUTURADA":score>=5?"EXISTEM AJUSTES IMPORTANTES":"PONTOS QUE MERECEM ATENÇÃO";
  $("#audit-result-title").textContent=score>=8?"Seu cardápio tem uma boa base.":score>=5?"Seu cardápio pode ficar mais claro.":"Há oportunidades de melhoria.";
  $("#audit-result-description").textContent=score>=8?"Pelas suas respostas, a maior parte dos fundamentos está presente. Uma revisão profissional pode identificar detalhes que este checklist não verifica.":score>=5?"Você já tem alguns cuidados importantes, mas certos pontos podem dificultar a escolha do cliente.":"Pelas suas respostas, vale priorizar os fundamentos do cardápio antes de investir em novas campanhas.";
  const list=$("#audit-priority-list");list.replaceChildren();
  const priorities=issues.length?issues.slice(0,3):[{label:"Revisar a experiência completa",recommendation:"Confira usabilidade no celular, atualização de informações e integração entre cardápio e pedido."}];
  priorities.forEach((p,i)=>{
    const item=document.createElement("div");item.className="audit-priority";
    const number=document.createElement("span");number.textContent=String(i+1).padStart(2,"0");
    const body=document.createElement("div");
    const title=document.createElement("strong");title.textContent=p.label;
    const detail=document.createElement("small");detail.textContent=p.recommendation;
    body.append(title,detail);item.append(number,body);list.append(item);
  });
  auditResult.hidden=false;quiz.hidden=true;
  if(Array.isArray(window.dataLayer))window.dataLayer.push({event:"avaliacao_cardapio_concluida",score});
  $("#audit-result-title").setAttribute("tabindex","-1");
  $("#audit-result-title").focus({preventScroll:true});
}
$("#audit-restart").addEventListener("click",()=>{
  auditAnswers.fill(null);auditPosition=0;auditComplete=false;
  auditResult.hidden=true;quiz.hidden=false;renderAudit();
  $("#audit-question").setAttribute("tabindex","-1");$("#audit-question").focus({preventScroll:true});
});
renderAudit();

const orders=$("#orders"),minutes=$("#minutes"),days=$("#days");
const number=n=>new Intl.NumberFormat("pt-BR",{maximumFractionDigits:1}).format(n);
function calculate(){const o=+orders.value,m=+minutes.value,d=+days.value,h=o*m*d/60;
$("#orders-output").textContent=String(o);$("#minutes-output").textContent=m+" min";$("#days-output").textContent=String(d);$("#hours-result").textContent=number(h);$("#calc-equivalent").textContent="Equivale a "+number(h/8)+" jornadas de 8 horas.";
[orders,minutes,days].forEach(el=>{const v=(+el.value-+el.min)/(+el.max-+el.min)*100;el.style.background="linear-gradient(90deg,#436b48 "+v+"%,#d9e2d6 "+v+"%)"})}
[orders,minutes,days].forEach(el=>el.addEventListener("input",calculate));calculate();
const modal=$("#lead-modal"),form=$("#lead-form"),entry=$("#lead-entry"),result=$("#lead-result"),summary=$("#lead-summary");let previousFocus=null;
function openLead(e){if(e)e.preventDefault();setMenu(false);previousFocus=document.activeElement;entry.hidden=false;result.hidden=true;if(!modal.open)modal.showModal();document.body.classList.add("dialog-open")}
function closeLead(){if(modal.open)modal.close();document.body.classList.remove("dialog-open");if(previousFocus?.focus)previousFocus.focus({preventScroll:true})}
$("[data-open-lead]").forEach(btn=>btn.addEventListener("click",e=>{if(btn.id==="audit-contact"){$("select[name=challenge]",form).value="Revisar e melhorar meu cardápio digital"}openLead(e)}));
$("#lead-close").addEventListener("click",closeLead);modal.addEventListener("click",e=>{if(e.target===modal)closeLead()});modal.addEventListener("close",()=>document.body.classList.remove("dialog-open"));
const phone=form.elements.phone;phone.addEventListener("input",()=>phone.setCustomValidity(""));
const trim=v=>String(v||"").trim().replace(/\s+/g," ").slice(0,125);
form.addEventListener("submit",e=>{
e.preventDefault();if(!form.reportValidity())return;
const data=Object.fromEntries(new FormData(form).entries());const digits=String(data.phone||"").replace(/\D/g,"");
if(digits.length<10||digits.length>13){phone.setCustomValidity("Informe o WhatsApp com DDD.");phone.reportValidity();return}
const auditSummary=auditComplete?"\n\nAutoavaliação de cardápio (respostas do estabelecimento):\n"+auditQuestions.map((q,i)=>"- "+q.label+": "+(["Ainda não","Em parte","Sim, está bem resolvido"][auditAnswers[i]])).join("\n")+"\nNota orientativa: "+auditAnswers.reduce((n,v)=>n+v,0)+"/10":"";
const text="Olá! Gostaria de solicitar um diagnóstico para implantação da Brendi/Brenda.\n\nNome: "+trim(data.name)+"\nEstabelecimento: "+trim(data.business)+"\nWhatsApp: "+trim(data.phone)+"\nCidade: "+trim(data.city)+"\nNecessidade: "+trim(data.challenge)+auditSummary+"\n\nGostaria de conversar sobre a assessoria.";
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
