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
 const ctAs=await p.locator("[data-open-lead]").all();let clicks=0;
 for(const el of ctAs){
  if(!(await el.isVisible()))continue;
  await el.click({timeout:9000});
  assert(await isOpen(p,"#lead-modal"),"CTA abre modal "+(++clicks));
  await p.locator("#lead-close").click();
 }
 assert(clicks>=4,"CTAs desktop");
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
 await p.locator("#story-next").click();
 assert((await p.locator("#story-title").textContent()).includes("Escolher"),"jornada avança");
 await p.locator("#story-prev").click();
 assert((await p.locator("#story-title").textContent()).includes("Brenda"),"jornada retrocede");
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
  await m.locator('.story-tab[data-step="3"]').click();
  assert((await m.locator("#story-title").textContent()).includes("relacionamento"),"tabs em "+width);
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
