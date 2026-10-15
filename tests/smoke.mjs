import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
await fs.mkdir('tests/screenshots',{recursive:true});

async function makePage(width,height){
  const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
  await context.route('**/*', async route=>{
    const url=route.request().url();
    if(url.startsWith('http://127.0.0.1:4173/')||url.startsWith('data:'))return route.continue();
    return route.abort();
  });
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',err=>errors.push(err.message));
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded',timeout:20000});
  await page.waitForTimeout(450);
  return {page,context,errors};
}
function assert(condition,message){if(!condition)throw new Error(message);console.log('OK '+message)}
async function isOpen(page){return page.locator('#lead-modal').evaluate(el=>el.open)}
try{
  const desk=await makePage(1440,900);
  const {page}=desk;
  assert(await page.locator('#hero-title').isVisible(),'Desktop hero renders');
  assert(await page.locator('#como-entregamos').count()===1,'Clear commercial proposition present');
  await page.locator('.nav-contact').click();
  assert(await isOpen(page),'Desktop header CTA opens lead dialog');
  await page.locator('#lead-close').click();
  assert(!(await isOpen(page)),'Close button closes lead dialog');
  await page.locator('#diagnostico-cardapio').scrollIntoViewIfNeeded();
  for(let i=0;i<5;i++){
    await page.locator('.audit-choice[data-value="2"]').click();
    await page.locator('#audit-next').click();
  }
  assert(await page.locator('#audit-result').isVisible(),'Audit completes after five answers');
  assert((await page.locator('#audit-score').textContent()).trim()==='10','Audit score is correct');
  await page.locator('#audit-contact').click();
  assert(await isOpen(page),'Audit CTA opens lead dialog');
  const choice=await page.locator('select[name="challenge"]').inputValue();
  assert(choice==='Revisar e melhorar meu cardápio digital','Audit context is transferred to lead');
  await page.locator('input[name="name"]').fill('Cliente Teste');
  await page.locator('input[name="business"]').fill('Delivery Exemplo');
  await page.locator('input[name="phone"]').fill('11987654321');
  await page.locator('input[name="city"]').fill('São Paulo, SP');
  // Popups do WhatsApp não precisam completar o carregamento para validar o formulário.
  await page.locator('#lead-form button[type="submit"]').click();
  assert(await page.locator('#lead-result').isVisible(),'Lead submission renders preview');
  assert((await page.locator('#lead-summary').inputValue()).includes('Autoavaliação de cardápio'),'Lead message includes audit answers');
  await page.locator('#lead-close').click();
  await page.locator('#na-pratica').scrollIntoViewIfNeeded();
  await page.locator('#story-next').click();
  assert((await page.locator('#story-title').textContent()).includes('Escolher'),'Desktop story next works');
  await page.locator('#story-prev').click();
  assert((await page.locator('#story-title').textContent()).includes('Brenda'),'Desktop story previous works');
  assert(desk.errors.length===0,'No uncaught desktop JavaScript errors: '+desk.errors.join(', '));
  await page.screenshot({path:'tests/screenshots/desktop.png',fullPage:true});
  await desk.context.close();

  const mob=await makePage(390,844);
  const m=mob.page;
  await m.locator('#menu-toggle').click();
  assert(await m.locator('#mobile-nav').isVisible(),'Mobile menu opens');
  await m.locator('#mobile-nav a[href="#diagnostico-cardapio"]').click();
  assert(!(await m.locator('#mobile-nav').isVisible()),'Mobile menu closes after navigation');
  await m.locator('#audit-prev').scrollIntoViewIfNeeded();
  await m.locator('.audit-choice[data-value="1"]').click();
  assert(await m.locator('#audit-next').isEnabled(),'Audit response enables next');
  await m.locator('#audit-next').click();
  assert((await m.locator('#audit-step-counter').textContent()).includes('02'),'Mobile quiz advances');
  await m.locator('#audit-prev').click();
  assert((await m.locator('#audit-step-counter').textContent()).includes('01'),'Mobile quiz returns');
  await m.locator('#story-controls').scrollIntoViewIfNeeded();
  await m.locator('.story-tab[data-step="3"]').click();
  assert((await m.locator('#story-title').textContent()).includes('relacionamento'),'Mobile story tab works');
  await m.locator('.mobile-action button').click();
  assert(await isOpen(m),'Mobile fixed CTA opens dialog');
  await m.locator('#lead-close').click();
  assert(!(await isOpen(m)),'Mobile close works');
  const overflow=await m.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert(overflow<=3,'Mobile has no horizontal overflow (px='+overflow+')');
  assert(mob.errors.length===0,'No uncaught mobile JavaScript errors: '+mob.errors.join(', '));
  await m.screenshot({path:'tests/screenshots/mobile.png',fullPage:true});
  await mob.context.close();
  console.log('ALL CHECKS PASSED');
}catch(err){
  console.error('SMOKE TEST FAILED:',err);
  process.exitCode=1;
}finally{await browser.close()}
