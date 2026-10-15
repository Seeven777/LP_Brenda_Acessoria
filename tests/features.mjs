import { chromium } from "playwright";
import fs from "node:fs/promises";
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
const slugs=["sistema-para-restaurantes","relatorios","cupom","programa-de-fidelidade","recuperador-de-clientes","disparos","trafego-pago","cardapio-digital","atendimento-virtual"];
const origin="http://127.0.0.1:4173";
await fs.mkdir("tests/screenshots",{recursive:true});
function ok(condition,label){if(!condition)throw Error(label);console.log("PASS "+label)}
async function openPage(url,width,height=900){
 const ctx=await browser.newContext({viewport:{width,height},reducedMotion:"reduce"});
 await ctx.route("**/*",route=>route.request().url().startsWith(origin)||route.request().url().startsWith("data:")?route.continue():route.abort());
 const page=await ctx.newPage(),errors=[];
 page.on("pageerror",e=>errors.push(e.message));
 const response=await page.goto(origin+url,{waitUntil:"domcontentloaded",timeout:17000});
 ok(response?.status()===200,url+" HTTP 200 ("+width+")");
 return {ctx,page,errors};
}
async function checkOverflow(page,name){
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
 ok(overflow<=3,name+" sem overflow horizontal ("+overflow+"px)");
}
try{
 const index=await openPage("/funcionalidades/",1440);
 ok(await index.page.locator(".fp-hub-card").count()===9,"índice com nove funcionalidades");
 ok(await index.page.locator(".fp-hub-card:visible").count()===9,"todas visíveis");
 for(const [cat,n] of [["vendas",3],["fidelizacao",4],["gestao",2],["all",9]]){
  await index.page.locator('[data-filter="'+cat+'"]').click();
  ok(await index.page.locator(".fp-hub-card:visible").count()===n,"filtro "+cat+" => "+n);
  ok(await index.page.locator('[data-filter="'+cat+'"]').getAttribute("aria-pressed")==="true","filtro acessível "+cat);
 }
 const fullSource=await index.page.locator('a[href="/funcionalidades/cardapio-digital/"]').first().getAttribute("href");
 ok(fullSource==="/funcionalidades/cardapio-digital/","link de cardápio");
 await index.page.screenshot({path:"tests/screenshots/features-index-desktop.png",fullPage:true});
 ok(index.errors.length===0,"nenhum erro JavaScript no índice");
 await index.ctx.close();

 for(const slug of slugs){
  const path="/funcionalidades/"+slug+"/";
  const doc=await openPage(path,1440);
  const {page}=doc;
  ok(await page.locator("h1").isVisible(),slug+" heading visível");
  ok(await page.locator(".fp-feature-card").count()===6,slug+" seis detalhes úteis");
  ok(await page.locator(".fp-demo-pane").count()===3,slug+" três cenários ilustrativos");
  ok(await page.locator(".fp-demo-pane:visible").count()===1,slug+" só um cenário ativo");
  await page.locator('[data-demo-target="1"]').click();
  ok(await page.locator('[data-demo-target="1"]').getAttribute("aria-pressed")==="true",slug+" segunda etapa interativa");
  ok(await page.locator('.fp-demo-pane[data-demo-index="1"]').isVisible(),slug+" segundo painel visível");
  await page.locator('[data-demo-target="2"]').click();
  ok(await page.locator('.fp-demo-pane[data-demo-index="2"]').isVisible(),slug+" terceiro painel visível");
  await page.locator('[data-demo-target="0"]').click();
  ok(await page.locator('.fp-demo-pane[data-demo-index="0"]').isVisible(),slug+" painel reiniciado");
  await page.locator(".fp-faq-list summary").first().click();
  ok(await page.locator(".fp-faq-list details").first().getAttribute("open")!==null,slug+" FAQ abre");
  const urls=await page.locator('a[href*="wa.me"]').evaluateAll(els=>els.map(e=>e.href));
  ok(urls.length>=3&&urls.every(u=>u.includes("5511920626850")),slug+" WhatsApp comercial em todos os CTAs");
  await checkOverflow(page,slug+" desktop");
  ok(doc.errors.length===0,slug+" sem erros JS: "+doc.errors.join(", "));
  if(slug==="cardapio-digital")await page.screenshot({path:"tests/screenshots/feature-cardapio-desktop.png",fullPage:true});
  await doc.ctx.close();
 }
 for(const width of [320,390,768,1024]){
  const hub=await openPage("/funcionalidades/",width,844),page=hub.page;
  await checkOverflow(page,"índice "+width);
  if(width<=930){
   await page.locator("#fp-menu-trigger").click();
   ok(await page.locator("#fp-mobile-nav").isVisible(),"menu abre "+width);
   await page.locator('#fp-mobile-nav a[href="/funcionalidades/cardapio-digital/"]').click();
   ok(page.url().includes("/funcionalidades/cardapio-digital/"),"menu navega "+width);
   ok(!(await page.locator("#fp-mobile-nav").isVisible()),"menu fecha ao navegar "+width);
  }
  ok(hub.errors.length===0,"mobile sem erro JS "+width);
  if(width===390)await page.screenshot({path:"tests/screenshots/features-index-mobile.png",fullPage:true});
  await hub.ctx.close();
  const feature=await openPage("/funcionalidades/atendimento-virtual/",width,844),f=feature.page;
  await checkOverflow(f,"funcionalidade "+width);
  await f.locator('[data-demo-target="2"]').click();
  ok(await f.locator('.fp-demo-pane[data-demo-index="2"]').isVisible(),"demonstração responsive "+width);
  await f.locator(".fp-faq-list summary").nth(1).click();
  ok(await f.locator(".fp-faq-list details").nth(1).getAttribute("open")!==null,"FAQ responsive "+width);
  ok(feature.errors.length===0,"feature sem erro JS "+width);
  if(width===390)await f.screenshot({path:"tests/screenshots/feature-atendimento-mobile.png",fullPage:true});
  await feature.ctx.close();
 }
 const home=await openPage("/",1440);
 ok(await home.page.locator('a[href="/funcionalidades/"]').count()>=2,"home integrada à central");
 ok(await home.page.locator(".feature-discovery").isVisible(),"CTA de navegação profunda visível");
 ok(home.errors.length===0,"home preservada sem JS errors");
 await home.ctx.close();
 console.log("ALL FEATURE CHECKS PASSED");
}catch(e){console.error("FEATURE TEST FAILED:",e);process.exitCode=1}
finally{await browser.close()}
