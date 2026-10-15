"use strict";
(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const reduce=matchMedia("(prefers-reduced-motion: reduce)");
const header=$("#header"),menu=$("#menu-toggle"),mobileNav=$("#mobile-nav"),action=$("#mobile-action"),closing=$("#contato");
function setMenu(open){mobileNav.hidden=!open;menu.setAttribute("aria-expanded",String(open));menu.setAttribute("aria-label",open?"Fechar menu":"Abrir menu");document.body.classList.toggle("menu-open",open)}
menu.addEventListener("click",()=>setMenu(mobileNav.hidden));
$$("#mobile-nav a").forEach(a=>a.addEventListener("click",()=>setMenu(false)));
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!mobileNav.hidden){setMenu(false);menu.focus()}});
document.addEventListener("click",e=>{if(!mobileNav.hidden&&!header.contains(e.target))setMenu(false)});
const wide=matchMedia("(min-width:931px)");
if(wide.addEventListener)wide.addEventListener("change",e=>{if(e.matches)setMenu(false)});
function scrollUI(){
const h=document.documentElement.scrollHeight-innerHeight;
$("#progress-bar").style.width=(h?Math.max(0,Math.min(100,scrollY/h*100)):0)+"%";
header.classList.toggle("is-scrolled",scrollY>10);
const hide=closing.getBoundingClientRect().top<innerHeight*.78;
action.classList.toggle("is-hidden",hide);
action.querySelector("button").tabIndex=hide?-1:0;
}
let scrollPending=false;
window.addEventListener("scroll",()=>{if(!scrollPending){scrollPending=true;requestAnimationFrame(()=>{scrollUI();scrollPending=false})}},{passive:true});
window.addEventListener("resize",scrollUI,{passive:true});scrollUI();
if("IntersectionObserver"in window&&!reduce.matches){
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("is-visible");observer.unobserve(e.target)}}),{rootMargin:"0px 0px -20px 0px",threshold:.06});
 $$("[data-reveal]").forEach(e=>observer.observe(e));
}else $$("[data-reveal]").forEach(e=>e.classList.add("is-visible"));
const leadDialog=$("#lead-modal"),reelDialog=$("#reel-dialog");let beforeLead=null,beforeReel=null;
function showDialog(dialog){if(!dialog.open){dialog.showModal();document.body.classList.add("dialog-open")}}
function hideDialog(dialog){if(dialog.open)dialog.close();document.body.classList.remove("dialog-open")}
[leadDialog,reelDialog].forEach(d=>d.addEventListener("close",()=>document.body.classList.remove("dialog-open")));


// Licensed player embeds from verified official Brendi videos on YouTube.
// Videos are not downloaded, hosted, or copied into this site.
const demoDialog=$("#demo-dialog"),demoFrame=$("#demo-frame"),demoButtons=$$(".demo-card");
let previousDemoFocus=null;
function closeDemo(){
 hideDialog(demoDialog);
 demoFrame.removeAttribute("src");
 if(previousDemoFocus?.focus)previousDemoFocus.focus({preventScroll:true});
}
demoButtons.forEach(button=>button.addEventListener("click",()=>{
 previousDemoFocus=button;
 const id=button.dataset.videoId;
 const start=Number(button.dataset.start||0);
 if(!/^[A-Za-z0-9_-]{11}$/.test(id))return;
 $("#demo-dialog-title").textContent=button.dataset.demoTitle;
 $("#demo-original").href="https://www.youtube.com/watch?v="+encodeURIComponent(id);
 demoFrame.src="https://www.youtube-nocookie.com/embed/"+encodeURIComponent(id)+"?rel=0&autoplay=1&playsinline=1"+(start?"&start="+start:"");
 showDialog(demoDialog);
 $("#demo-close").focus({preventScroll:true});
}));
$("#demo-close").addEventListener("click",closeDemo);
demoDialog.addEventListener("click",e=>{if(e.target===demoDialog)closeDemo()});
demoDialog.addEventListener("close",()=>demoFrame.removeAttribute("src"));

// All eight links provided by the owner; user-initiated official Instagram embed.
const reelCards=$$(".reel-card"),reelIds=reelCards.map(card=>card.dataset.reelId),frame=$("#reel-iframe"),loader=$("#reel-loading");let reelIndex=0;
// Lazy-load publisher-native thumbnails in the gallery, never static imitation images.
function loadReelCover(card){
 const id=card.dataset.reelId,slot=$(".reel-cover-preview",card);
 if(!slot||slot.dataset.requested==="true"||!/^[A-Za-z0-9_-]{11}$/.test(id))return;
 slot.dataset.requested="true";
 const preview=document.createElement("iframe");
 preview.className="reel-cover-iframe";
 preview.loading="lazy";
 preview.tabIndex=-1;
 preview.setAttribute("aria-hidden","true");
 preview.setAttribute("referrerpolicy","strict-origin-when-cross-origin");
 preview.title="Prévia visual da publicação "+id+" no Instagram";
 preview.setAttribute("allow","encrypted-media");
 preview.addEventListener("load",()=>slot.classList.add("is-loaded"),{once:true});
 preview.src="https://www.instagram.com/reel/"+encodeURIComponent(id)+"/embed/";
 slot.append(preview);
}
if("IntersectionObserver" in window){
 const coverObserver=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){loadReelCover(e.target);coverObserver.unobserve(e.target)}});
 },{rootMargin:"180px 250px",threshold:0});
 reelCards.forEach(card=>coverObserver.observe(card));
}else reelCards.slice(0,3).forEach(loadReelCover);

function selectReel(n){
 reelIndex=(n+reelIds.length)%reelIds.length;
 const permalink="https://www.instagram.com/reel/"+encodeURIComponent(reelIds[reelIndex])+"/";
 $("#reel-dialog-title").textContent="Publicação "+String(reelIndex+1).padStart(2,"0")+" / 08";
 $("#reel-dialog-index").textContent=String(reelIndex+1).padStart(2,"0")+" / 08";
 $("#reel-original").href=permalink;
 loader.hidden=false;
 frame.removeAttribute("src");
 frame.src=permalink+"embed/";
 frame.title="Reel "+(reelIndex+1)+" incorporado do Instagram";
}
function closeReel(){hideDialog(reelDialog);frame.removeAttribute("src");if(beforeReel?.focus)beforeReel.focus({preventScroll:true})}
reelCards.forEach((c,i)=>c.addEventListener("click",()=>{beforeReel=c;selectReel(i);showDialog(reelDialog);$("#reel-close").focus({preventScroll:true})}));
frame.addEventListener("load",()=>{loader.hidden=true});
$("#reel-close").addEventListener("click",closeReel);
reelDialog.addEventListener("click",e=>{if(e.target===reelDialog)closeReel()});
reelDialog.addEventListener("close",()=>frame.removeAttribute("src"));
$("#reel-prev").addEventListener("click",()=>selectReel(reelIndex-1));
$("#reel-next").addEventListener("click",()=>selectReel(reelIndex+1));
const rail=$("#reels-rail");for(const [sel,dir] of [["#reels-prev",-1],["#reels-next",1]]){
 $(sel).addEventListener("click",()=>rail.scrollBy({left:dir*Math.max(255,rail.clientWidth*.75),behavior:reduce.matches?"auto":"smooth"}));
}

// Six factual Brenda capabilities, shown through fictional demo conversations.
// Audio received by Brenda is an official platform capability.
// Text-to-speech below only illustrates a customer's audio; it is NOT Brenda's voice.
const journey=[
 {kicker:"01 / ATENDIMENTO HUMANIZADO",title:"A Brenda responde. Você continua produzindo.",description:"Tira dúvidas, atende 24h e conversa com o tom do seu restaurante.",features:["24h, todos os dias","Tom personalizado","Assuma a conversa se precisar"],floating:"Atendimento inteligente",receipt:"Conversa em andamento",
  messages:[{side:"in",text:"Oi! Vocês estão abertos?"},{side:"out",text:"Olá! Estamos atendendo, sim. Posso te mostrar o cardápio?"},{side:"in",text:"Quais são os combos de hoje?"},{side:"out",text:"Vou te ajudar a escolher. Temos opções para todos os gostos!"}]},
 {kicker:"02 / ÁUDIO, IMAGEM E FIGURINHA",title:"Mandou áudio? A Brenda entende.",description:"Ela interpreta mensagens de voz e imagens recebidas, sem exigir que o cliente digite tudo.",features:["Entende áudios","Interpreta imagens","Compreende figurinhas"],floating:"Áudio compreendido",receipt:"Informação identificada",
  messages:[{side:"in",type:"audio",duration:"0:08",text:"Oi, quero dois combos, um sem cebola, e uma bebida."},{side:"out",text:"Entendi! Dois combos, um sem cebola, e uma bebida. Certinho?"},{side:"in",type:"image",text:"Foto de um comprovante de pagamento"},{side:"out",text:"Recebi a imagem! Posso ajudar com mais alguma coisa?"}]},
 {kicker:"03 / PRODUTOS E SUGESTÕES",title:"Ela ajuda a montar o pedido.",description:"O cliente tira dúvidas, escolhe produtos e recebe sugestões relevantes do cardápio.",features:["Sugestões de adicionais","Preferências registradas","Conversa natural"],floating:"Pedido em construção",receipt:"Itens organizados",
  messages:[{side:"in",text:"Quero o combo da casa, sem cebola."},{side:"out",text:"Combinado! Vou registrar sem cebola."},{side:"out",type:"product",title:"Combo da casa",detail:"Sem cebola · Adicional opcional"},{side:"out",text:"Quer incluir uma bebida no pedido?"}]},
 {kicker:"04 / PAGAMENTO NO FLUXO",title:"Do pedido ao Pix, sem complicar.",description:"A plataforma oferece pagamento online por Pix ou cartão, conforme a configuração do estabelecimento.",features:["Pix online","Cartão online","Checkout integrado"],floating:"Etapa de pagamento",receipt:"Opções disponíveis",
  messages:[{side:"out",text:"Seu pedido está quase pronto! Como prefere pagar?"},{side:"out",type:"pay",title:"Formas de pagamento",detail:"Pix ou cartão no fluxo de compra"},{side:"in",text:"Pode ser no Pix."},{side:"out",text:"Perfeito! Vamos seguir com o pagamento pelo link do pedido."}]},
 {kicker:"05 / ROTINA OPERACIONAL",title:"O pedido chega organizado.",description:"Status, informações do pedido e histórico ficam centralizados no gestor Brendi.",features:["Gestor de pedidos","Status atualizados","Histórico do cliente"],floating:"Gestor conectado",receipt:"Pedido no painel",
  messages:[{side:"out",type:"status",title:"Pedido recebido",detail:"Aguardando preparo · exemplo ilustrativo"},{side:"out",text:"Pedido registrado! A equipe poderá acompanhar as próximas etapas."},{side:"in",text:"Tudo certo, obrigado!"}]},
 {kicker:"06 / RELACIONAMENTO E RECOMPRA",title:"A venda termina. A relação não.",description:"Cupons, campanhas e recuperação de clientes podem estimular novas compras.",features:["Campanhas segmentadas","Cupons e cashback","Recuperação de clientes"],floating:"Relacionamento ativo",receipt:"Campanha configurável",
  messages:[{side:"out",text:"Faz tempo que você não pede com a gente! Temos novidades no cardápio."},{side:"out",type:"product",title:"Um motivo para voltar",detail:"Oferta ou cupom configurável"},{side:"in",text:"Boa! Vou olhar o cardápio."},{side:"out",text:"Que bom! Pode contar com a gente."}]}
];
const tabs=$$(".story-tab"),storyPrev=$("#story-prev"),storyNext=$("#story-next"),storyChat=$("#story-messages");
const soundDemo=$("#story-sound-demo");
const audioExample=journey[1].messages[0].text;
const messageHeights=[9,15,24,13,19,27,12,23,14,20,28,18,10,17,25,16,12,21,15];
let journeyStep=0,audioPlaying=false,audioUtterance=null;
function stopExampleAudio(){
 if("speechSynthesis" in window)try{window.speechSynthesis.cancel()}catch(_){}
 audioUtterance=null;audioPlaying=false;
 soundDemo.setAttribute("aria-pressed","false");
 soundDemo.querySelector("span:last-child").textContent="Ouvir pedido ilustrativo";
 storyChat.querySelectorAll(".story-audio-button").forEach(b=>{b.textContent="▶";b.setAttribute("aria-label","Ouvir mensagem de áudio ilustrativa");b.setAttribute("aria-pressed","false")});
}
function playExampleAudio(){
 if(audioPlaying){stopExampleAudio();return}
 if(!("speechSynthesis" in window)||typeof SpeechSynthesisUtterance==="undefined"){
  $("#screenreader-status").textContent="Áudio não disponível neste navegador. A transcrição aparece na conversa.";
  return;
 }
 try{
  window.speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance(audioExample);
  utterance.lang="pt-BR";utterance.rate=.94;utterance.pitch=1;
  const voices=window.speechSynthesis.getVoices();
  const voice=voices.find(v=>v.lang.toLowerCase().startsWith("pt-br"));
  if(voice)utterance.voice=voice;
  audioPlaying=true;audioUtterance=utterance;
  soundDemo.setAttribute("aria-pressed","true");
  soundDemo.querySelector("span:last-child").textContent="Parar narração";
  storyChat.querySelectorAll(".story-audio-button").forEach(b=>{b.textContent="■";b.setAttribute("aria-label","Parar narração ilustrativa");b.setAttribute("aria-pressed","true")});
  const cleanup=()=>{if(audioUtterance===utterance)stopExampleAudio()};
  utterance.onend=cleanup;utterance.onerror=cleanup;
  window.speechSynthesis.speak(utterance);
 }catch(_){stopExampleAudio();$("#screenreader-status").textContent="Não foi possível reproduzir a narração. A transcrição está disponível."}
}
soundDemo.addEventListener("click",playExampleAudio);
storyChat.addEventListener("click",event=>{
 if(event.target.closest(".story-audio-button"))playExampleAudio();
});
function messageElement(message,index){
 const bubble=document.createElement("div");
 bubble.className="story-msg "+message.side;
 if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches)bubble.style.animationDelay=Math.min(index,6)*85+"ms";
 if(message.type==="audio"){
  bubble.classList.add("is-audio");
  const row=document.createElement("div");row.className="story-audio-row";
  const play=document.createElement("button");play.className="story-audio-button";play.type="button";play.textContent="▶";play.setAttribute("aria-label","Ouvir mensagem de áudio ilustrativa");play.setAttribute("aria-pressed","false");
  const bars=document.createElement("span");bars.className="story-audio-visual";bars.setAttribute("aria-hidden","true");
  messageHeights.forEach(height=>{const bar=document.createElement("i");bar.style.setProperty("--bar-h",height+"px");bars.append(bar)});
  const time=document.createElement("span");time.className="story-audio-duration";time.textContent=message.duration;
  row.append(play,bars,time);
  const transcript=document.createElement("div");transcript.className="story-transcription";
  transcript.textContent="Transcrição de exemplo: “"+message.text+"”";
  bubble.append(row,transcript);
 }else if(message.type==="image"){
  const attachment=document.createElement("div");attachment.className="story-attachment";
  const icon=document.createElement("span");icon.setAttribute("aria-hidden","true");icon.textContent="▧";
  const label=document.createElement("strong");label.textContent="Imagem recebida";
  const desc=document.createElement("small");desc.textContent="Comprovante · exemplo";
  attachment.append(icon,label,desc);bubble.append(attachment);
 }else if(["product","pay","status"].includes(message.type)){
  const card=document.createElement("div");
  card.className=message.type==="product"?"story-product":message.type==="pay"?"story-pay-card":"story-status-card";
  const title=document.createElement("strong");title.textContent=message.title;
  const detail=document.createElement(message.type==="product"?"small":"span");detail.textContent=message.detail;
  if(message.type==="product"){
   const topic=document.createElement("span");topic.textContent="EXEMPLO DO CARDÁPIO";card.append(topic);
  }
  card.append(title,detail);bubble.append(card);
 }else bubble.textContent=message.text;
 const timestamp=document.createElement("small");timestamp.textContent=message.side==="out"?"14:39 ✓✓":"14:39";
 bubble.append(timestamp);
 return bubble;
}
function showJourney(n,focus=false){
 stopExampleAudio();
 journeyStep=Math.max(0,Math.min(journey.length-1,n));
 const step=journey[journeyStep];
 tabs.forEach((tab,i)=>{const active=i===journeyStep;tab.classList.toggle("is-selected",active);tab.setAttribute("aria-pressed",String(active))});
 $("#story-content").dataset.scene=String(journeyStep);
 $("#story-eyebrow").textContent=step.kicker;
 $("#story-scene-number").textContent=String(journeyStep+1).padStart(2,"0");
 $("#story-title").textContent=step.title;
 $("#story-description").textContent=step.description;
 $("#story-float-label").querySelector("strong").textContent=step.floating;
 $("#story-receipt-text").textContent=step.receipt;
 $("#story-count").textContent=String(journeyStep+1).padStart(2,"0")+" / "+String(journey.length).padStart(2,"0");
 storyPrev.disabled=journeyStep===0;storyNext.disabled=journeyStep===journey.length-1;
 const chips=document.createDocumentFragment();
 step.features.forEach(label=>{const tag=document.createElement("span");tag.textContent=label;chips.append(tag)});
 $("#story-benefits").replaceChildren(chips);
 const chat=document.createDocumentFragment();
 step.messages.forEach((msg,i)=>chat.append(messageElement(msg,i)));
 storyChat.replaceChildren(chat);
 const scrollParent=$("#story-phone-chat");scrollParent.scrollTop=0;
 soundDemo.hidden=journeyStep!==1;
 $$(".story-footer-progress span").forEach((bar,i)=>bar.classList.toggle("is-on",i<=journeyStep));
 if(focus)tabs[journeyStep].focus({preventScroll:true});
 // Keep active tab in the horizontal rail, but never hijack page scrolling.
 if($("#story-controls").scrollWidth>$("#story-controls").clientWidth){
  const rail=$("#story-controls"),tab=tabs[journeyStep];
  rail.scrollTo({left:tab.offsetLeft-rail.offsetLeft-(rail.clientWidth-tab.clientWidth)/2,behavior:"auto"});
 }
}
tabs.forEach((tab,i)=>{
 tab.addEventListener("click",()=>showJourney(i));
 tab.addEventListener("keydown",e=>{
  if(["ArrowRight","ArrowLeft","Home","End"].includes(e.key)){
   e.preventDefault();
   showJourney(e.key==="Home"?0:e.key==="End"?journey.length-1:(i+(e.key==="ArrowRight"?1:journey.length-1))%journey.length,true);
  }
 });
});
storyPrev.addEventListener("click",()=>showJourney(journeyStep-1));
storyNext.addEventListener("click",()=>showJourney(journeyStep+1));
document.addEventListener("visibilitychange",()=>{if(document.hidden)stopExampleAudio()});
showJourney(0);

// Five questions. Self-reported, not an automated platform audit.
const questions=[
 ["IDENTIDADE VISUAL","Seu cardápio tem uma aparência coerente com sua marca?","Logo e cores ajudam o cliente a reconhecer o negócio.","Identidade visual","Padronizar a apresentação do cardápio."],
 ["ORGANIZAÇÃO","É fácil encontrar pratos, combos e bebidas?","Categorias organizadas simplificam a escolha.","Organização","Revisar a ordem das categorias e dos produtos."],
 ["FOTOGRAFIAS","Os principais produtos têm fotos claras e verdadeiras?","As imagens devem representar o prato entregue.","Fotografia","Priorizar imagens boas dos principais produtos."],
 ["DESCRIÇÕES","As descrições explicam ingredientes e porções?","Informações claras reduzem dúvidas antes da compra.","Descrições","Explicar ingredientes e informações importantes."],
 ["PROMOÇÕES","As promoções consideram custo e margem?","Descontos sem cálculo podem prejudicar o negócio.","Promoções","Planejar ofertas considerando sua margem."]
];
const choices=$$(".audit-choice"),answers=Array(5).fill(null),auditPrev=$("#audit-prev"),auditNext=$("#audit-next");let auditStep=0,auditDone=false;
function renderQuiz(){
 const q=questions[auditStep];$("#audit-step-counter").textContent=String(auditStep+1).padStart(2,"0")+" / 05";
 $("#audit-progress-fill").style.width=((auditStep+1)*20)+"%";$("#audit-progress").setAttribute("aria-valuenow",String(auditStep+1));
 $("#audit-topic").textContent=q[0];$("#audit-question").textContent=q[1];$("#audit-hint").textContent=q[2];
 choices.forEach(b=>b.setAttribute("aria-pressed",String(Number(b.dataset.value)===answers[auditStep])));
 auditPrev.disabled=auditStep===0;auditNext.disabled=answers[auditStep]===null;
 auditNext.textContent=auditStep===4?"Ver meu resultado →":"Continuar →";
}
choices.forEach(b=>b.addEventListener("click",()=>{answers[auditStep]=Number(b.dataset.value);renderQuiz()}));
auditPrev.addEventListener("click",()=>{if(auditStep>0){auditStep--;renderQuiz()}});
function finishQuiz(){
 auditDone=true;
 const score=answers.reduce((a,b)=>a+b,0);
 $("#audit-score").textContent=String(score);
 $("#audit-result-label").textContent=score>=8?"BOA BASE":score>=5?"HÁ AJUSTES IMPORTANTES":"PONTOS QUE MERECEM ATENÇÃO";
 $("#audit-result-title").textContent=score>=8?"Sua base está bem encaminhada.":score>=5?"Seu cardápio pode melhorar.":"Vale rever os fundamentos.";
 $("#audit-result-description").textContent=score>=8?"Uma revisão profissional pode identificar outros detalhes.":score>=5?"Algumas melhorias podem facilitar a escolha.":"Há pontos básicos que vale organizar primeiro.";
 const items=questions.map((q,i)=>({label:q[3],action:q[4],value:answers[i],i})).filter(q=>q.value<2).sort((a,b)=>a.value-b.value||a.i-b.i);
 const priority=items.length?items.slice(0,3):[{label:"Experiência no celular",action:"Verifique se está simples comprar pelo smartphone."}];
 const frag=document.createDocumentFragment();priority.forEach((x,i)=>{
  const row=document.createElement("div");row.className="audit-priority";
  const n=document.createElement("span");n.textContent=String(i+1).padStart(2,"0");
  const div=document.createElement("div"),title=document.createElement("strong"),desc=document.createElement("small");
  title.textContent=x.label;desc.textContent=x.action;div.append(title,desc);row.append(n,div);frag.append(row);
 });
 $("#audit-priority-list").replaceChildren(frag);
 $("#audit-quiz").hidden=true;$("#audit-result").hidden=false;
 $("#audit-result-title").focus({preventScroll:true});
}
auditNext.addEventListener("click",()=>{if(answers[auditStep]===null)return;if(auditStep<4){auditStep++;renderQuiz()}else finishQuiz()});
$("#audit-restart").addEventListener("click",()=>{answers.fill(null);auditStep=0;auditDone=false;$("#audit-result").hidden=true;$("#audit-quiz").hidden=false;renderQuiz();$("#audit-question").setAttribute("tabindex","-1");$("#audit-question").focus({preventScroll:true})});
renderQuiz();

// CTA delegation prevents the selector errors encountered in previous versions.
const form=$("#lead-form"),entry=$("#lead-entry"),result=$("#lead-result"),summary=$("#lead-summary"),send=$("#lead-send");
function openLead(e){
 e.preventDefault();const btn=e.target.closest("[data-open-lead]");
 beforeLead=btn||document.activeElement;setMenu(false);
 entry.hidden=false;result.hidden=true;$("#copy-message").textContent="Copiar texto";
 if(btn?.id==="audit-contact")form.elements.challenge.value="Revisar e melhorar meu cardápio digital";
 showDialog(leadDialog);form.elements.name.focus({preventScroll:true});
}
document.addEventListener("click",e=>{if(e.target.closest?.("[data-open-lead]"))openLead(e)});
function closeLead(){hideDialog(leadDialog);if(beforeLead?.focus)beforeLead.focus({preventScroll:true})}
$("#lead-close").addEventListener("click",closeLead);
leadDialog.addEventListener("click",e=>{if(e.target===leadDialog)closeLead()});
const phone=form.elements.phone;phone.addEventListener("input",()=>phone.setCustomValidity(""));
const tidy=x=>String(x||"").trim().replace(/\s+/g," ").slice(0,140);
form.addEventListener("submit",e=>{
 e.preventDefault();if(!form.reportValidity())return;
 const d=Object.fromEntries(new FormData(form).entries()),digits=String(d.phone).replace(/\D/g,"");
 if(digits.length<10||digits.length>13){phone.setCustomValidity("Informe o WhatsApp com DDD.");phone.reportValidity();return}
 let msg="Olá! Quero conhecer a assessoria para implantação da Brendi e Brenda.\n\n"+
 "Nome: "+tidy(d.name)+"\nEstabelecimento: "+tidy(d.business)+"\nWhatsApp: "+tidy(d.phone)+"\nCidade: "+tidy(d.city)+"\nNecessidade: "+tidy(d.challenge);
 if(auditDone)msg+="\n\nAutoavaliação (respostas minhas):\n"+questions.map((q,i)=>"- "+q[3]+": "+["Ainda não","Em parte","Sim"][answers[i]]).join("\n")+"\nPontuação: "+answers.reduce((a,b)=>a+b,0)+"/10";
 msg+="\n\nGostaria de receber uma proposta.";
 summary.value=msg;
 const number=String(window.BRENDA_CONFIG?.whatsAppNumber||"").replace(/\D/g,"");
 const ok=number.length>=12&&number.length<=13;
 send.href=ok?"https://wa.me/"+number+"?text="+encodeURIComponent(msg):"#";
 send.hidden=!ok;
 $("#lead-result-text").textContent=ok?"Confira a mensagem e clique para enviar. O WhatsApp solicitará sua confirmação.":"WhatsApp não configurado. Copie a mensagem para enviar manualmente.";
 entry.hidden=true;result.hidden=false;
 (ok?send:$("#copy-message")).focus({preventScroll:true});
});
$("#copy-message").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(summary.value);$("#copy-message").textContent="Copiado ✓";$("#screenreader-status").textContent="Mensagem copiada"}catch(e){summary.select();summary.focus();$("#screenreader-status").textContent="Copie manualmente a mensagem selecionada"}});
$("#lead-back").addEventListener("click",()=>{result.hidden=true;entry.hidden=false;form.elements.name.focus({preventScroll:true})});
$$("[data-track]").forEach(a=>a.addEventListener("click",()=>{if(Array.isArray(window.dataLayer))window.dataLayer.push({event:a.dataset.track})}));
$("#year").textContent=String(new Date().getFullYear());
})();