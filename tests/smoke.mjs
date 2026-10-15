import { chromium } from "playwright";
import fs from "node:fs/promises";
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
await fs.mkdir("tests/screenshots",{recursive:true});
function assert(ok,name){if(!ok)throw Error(name);console.log("PASS "+name)}
async function setup(width,height=850){
 const context=await browser.newContext({viewport:{width,height},reducedMotion:"reduce"});
 await context.route("**/*",route=>route.request().url().startsWith("http://127.0.0.1:4173/")||route.request().url().startsWith("data:")?route.continue():route.abort());
 const page=await context.newPage();let errors=[];
 page.on("pageerror",e=>errors.push(e.message));
 await page.goto("http://127.0.0.1:4173/",{waitUntil:"domcontentloaded"});
 return {page,context,errors};
}
async function isOpen(page,id){return page.locator(id).evaluate(e=>e.open)}
try{
 const test=await setup(1440,900),p=test.page;
 assert(await p.locator("#hero-title").isVisible(),"hero desktop");
 assert(await p.locator(".reel-card").count()===8,"oito reels");
 assert(await p.locator(".reel-cover-preview").count()===8,"oito contêineres de capas reais");
 assert(await p.locator(".demo-card").count()===3,"três demonstrações verificadas no canal Brendi");
 await p.locator(".demo-card").first().click();
 assert(await isOpen(p,"#demo-dialog"),"demonstração abre dentro do site");
 const youtube=await p.locator("#demo-frame").getAttribute("src");
 assert(youtube.includes("youtube-nocookie.com/embed/TBF1w3cGw2o"),"player YouTube oficial verificado");
 await p.locator("#demo-close").click();
 assert(!(await isOpen(p,"#demo-dialog")),"demonstração fecha");
 assert(!(await p.locator("#demo-frame").getAttribute("src")),"vídeo para quando modal fecha");
 const ctAs=await p.locator("[data-open-lead]").all();let clicks=0;
 for(const el of ctAs){
  if(!(await el.isVisible()))continue;
  await el.click({timeout:9000});
  assert(await isOpen(p,"#lead-modal"),"CTA abre modal "+(++clicks));
  await p.locator("#lead-close").click();
 }
 assert(clicks>=4,"CTAs desktop");
 await p.locator(".reel-card").first().scrollIntoViewIfNeeded();
 await p.waitForTimeout(200);
 assert((await p.locator(".reel-cover-iframe").count())>0,"prévias do Instagram criadas sob demanda");
 await p.locator(".reel-card").first().click();
 assert(await isOpen(p,"#reel-dialog"),"player abre sem sair da página");
 assert((await p.locator("#reel-iframe").getAttribute("src")).includes("/DWjgf7ajewY/embed/"),"link de incorporação correto");
 await p.locator("#reel-next").click();
 assert((await p.locator("#reel-iframe").getAttribute("src")).includes("/DdwPzZfx3Jh/embed/"),"próximo Reel");
 await p.locator("#reel-prev").click();
 assert((await p.locator("#reel-iframe").getAttribute("src")).includes("/DWjgf7ajewY/embed/"),"anterior Reel");
 await p.locator("#reel-close").click();
 assert(!(await isOpen(p,"#reel-dialog")),"fechar reel");
 assert(!(await p.locator("#reel-iframe").getAttribute("src")),"player interrompido");
 assert(await p.locator(".story-tab").count()===6,"seis capacidades exploráveis");
 await p.locator("#story-next").click();
 assert((await p.locator("#story-title").textContent()).includes("áudio"),"avança para compreensão de áudio");
 assert(await p.locator("#story-sound-demo").isVisible(),"narração de exemplo disponível");
 assert(await p.locator(".story-audio-button").count()===1,"mensagem com controle de áudio");
 assert((await p.locator(".story-transcription").textContent()).includes("dois combos"),"transcrição de áudio legível");
 assert(await p.locator(".story-attachment").count()===1,"imagem ilustrativa recebida");
 await p.locator("#story-next").click();
 assert((await p.locator("#story-title").textContent()).includes("pedido"),"etapa de sugestão de pedido");
 await p.locator(".story-tab[data-step='3']").click();
 assert(await p.locator(".story-pay-card").isVisible(),"opções Pix e cartão visualizadas");
 await p.locator(".story-tab[data-step='4']").click();
 assert(await p.locator(".story-status-card").isVisible(),"pedido exibido no gestor");
 await p.locator(".story-tab[data-step='5']").click();
 assert((await p.locator("#story-title").textContent()).includes("relação"),"recompra na sexta etapa");
 assert(await p.locator("#story-next").isDisabled(),"próximo desabilitado ao final");
 await p.locator(".story-tab[data-step='0']").click();
 assert((await p.locator("#story-title").textContent()).includes("Brenda"),"retorna ao atendimento");
 assert(await p.locator("#story-prev").isDisabled(),"anterior desabilitado no começo");
 await p.locator(".micro-story [data-open-lead]").click();
 assert(await isOpen(p,"#lead-modal"),"CTA da jornada abre formulário");
 await p.locator("#lead-close").click();
 await p.locator("#brenda-em-acao").screenshot({path:"tests/screenshots/brenda-story-desktop.png"});
 await p.locator("#diagnostico-cardapio").scrollIntoViewIfNeeded();
 for(let i=0;i<5;i++){
  await p.locator('.audit-choice[data-value="2"]').click();
  assert(await p.locator("#audit-next").isEnabled(),"questão "+(i+1));
  await p.locator("#audit-next").click();
 }
 assert(await p.locator("#audit-result").isVisible(),"resultado do checklist");
 assert((await p.locator("#audit-score").textContent()).trim()==="10","resultado 10/10");
 await p.locator("#audit-contact").click();
 assert(await isOpen(p,"#lead-modal"),"CTA do checklist");
 assert(await p.locator('select[name="challenge"]').inputValue()==="Revisar e melhorar meu cardápio digital","preenchimento de necessidade");
 await p.locator('input[name="name"]').fill("Cliente Teste");
 await p.locator('input[name="business"]').fill("Delivery Exemplo");
 await p.locator('input[name="phone"]').fill("11987654321");
 await p.locator('input[name="city"]').fill("São Paulo");
 await p.locator('#lead-form button[type="submit"]').click();
 assert(await p.locator("#lead-result").isVisible(),"resumo do contato");
 assert((await p.locator("#lead-summary").inputValue()).includes("Autoavaliação"),"quiz no contato");
 const url=await p.locator("#lead-send").getAttribute("href");
 assert(url.startsWith("https://wa.me/5511920626850?text="),"numero WhatsApp e URL");
 assert(decodeURIComponent(url).includes("Delivery Exemplo"),"dados no WhatsApp");
 await p.locator("#lead-back").click();
 assert(await p.locator("#lead-entry").isVisible(),"voltar para edição");
 await p.locator("#lead-close").click();
 await p.locator("#audit-restart").click();
 assert(await p.locator("#audit-quiz").isVisible(),"reiniciar checklist");
 assert(!test.errors.length,"nenhum erro JS no desktop: "+test.errors.join(";"));
 await p.screenshot({path:"tests/screenshots/desktop.png",fullPage:true});
 await test.context.close();
 for(const width of [390,320,768,1024]){
  const mob=await setup(width),m=mob.page;
  const overflow=await m.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert(overflow<=3,"sem rolagem horizontal em "+width+" px ("+overflow+")");
  if(width<=930){
   await m.locator("#menu-toggle").click();
   assert(await m.locator("#mobile-nav").isVisible(),"menu mobile abre "+width);
   await m.locator('#mobile-nav a[href="#diagnostico-cardapio"]').click();
   assert(!(await m.locator("#mobile-nav").isVisible()),"menu mobile fecha "+width);
  }
  await m.locator('.story-tab[data-step="5"]').click();
  assert((await m.locator("#story-title").textContent()).includes("relação"),"navegação da sexta etapa em "+width);
  await m.locator('.story-tab[data-step="1"]').click();
  assert(await m.locator(".story-audio-button").isVisible(),"controle de áudio em "+width);
  assert(await m.locator(".story-transcription").isVisible(),"transcrição visível em "+width);
  if(width===390){
    await m.locator("#brenda-em-acao").scrollIntoViewIfNeeded();
    await m.waitForTimeout(170);
    assert(await m.locator(".mobile-action").evaluate(e=>e.classList.contains("is-hidden")),"CTA fixo não sobrepõe a demonstração mobile");
    await m.locator("#brenda-em-acao").screenshot({path:"tests/screenshots/brenda-story-mobile.png"});
  }
  await m.locator(".demo-card").first().click();
  assert(await isOpen(m,"#demo-dialog"),"demonstração no viewport "+width);
  await m.locator("#demo-close").click();
  await m.locator(".reel-card").nth(7).click();
  assert((await m.locator("#reel-iframe").getAttribute("src")).includes("Db9XOsdRlT7"),"reel 8 em "+width);
  await m.locator("#reel-close").click();
  if(width<=680){
   await m.locator(".mobile-action button").click();
   assert(await isOpen(m,"#lead-modal"),"CTA fixo mobile "+width);
   await m.locator("#lead-close").click();
  }
  assert(!mob.errors.length,"nenhum erro JS em "+width+": "+mob.errors.join(";"));
  if(width===390)await m.screenshot({path:"tests/screenshots/mobile.png",fullPage:true});
  await mob.context.close();
 }
 console.log("ALL CHECKS PASSED");
}catch(e){console.error("SMOKE TEST FAILED:",e);process.exitCode=1}
finally{await browser.close()}
