import { chromium } from "playwright";
import fs from "node:fs/promises";
await fs.mkdir("tests/screenshots",{recursive:true});
const b=await chromium.launch({headless:true,args:["--no-sandbox"]});
const context=await b.newContext({viewport:{width:1440,height:900}});
const p=await context.newPage();
const responses=[];
p.on("response",r=>{
  if(/instagram.com\/reel\/.*\/embed\/|i\.ytimg\.com/.test(r.url()))responses.push({status:r.status(),url:r.url().slice(0,100)});
});
try{
  await p.goto("http://127.0.0.1:4173/",{waitUntil:"domcontentloaded",timeout:12000});
  await p.locator("#provas").scrollIntoViewIfNeeded();
  await p.waitForTimeout(5000);
  const cards=await p.locator(".reel-card").count();
  const covers=await p.locator(".reel-cover-iframe").count();
  await p.locator("#reels-rail").screenshot({path:"tests/screenshots/instagram-covers-check.png",timeout:18000});
  console.log("INSTAGRAM DIAGNOSTIC",JSON.stringify({cards,covers,responses}));
}catch(e){console.log("INSTAGRAM DIAGNOSTIC ERROR",String(e))}
finally{await b.close()}
