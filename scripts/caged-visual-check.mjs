import {chromium} from 'playwright';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {mkdirSync} from 'node:fs';
const url=pathToFileURL(resolve('public/manual-caged.html')).href;
const browser=await chromium.launch({headless:true});
const devices=[['movil',390,844],['tableta',820,1180],['escritorio',1440,900]];
mkdirSync('caged-visual-evidence',{recursive:true});
try{
 for(const [label,width,height] of devices){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url,{waitUntil:'load'});
  if(await page.locator('#guided-course .guide-card').count()!==18)throw Error(label+': no aparecen 18 capítulos');
  if(await page.locator('#shape-diagrams .shape-panel').count()!==5)throw Error(label+': faltan diagramas de CAGED');
  if(await page.locator('#fretboard svg').count()!==1)throw Error(label+': el mapa del mástil no se dibuja');
  await page.locator('#root').selectOption('7');
  await page.locator('#layer').selectOption('pent');
  if(await page.locator('#fretboard svg circle').count()<10)throw Error(label+': las opciones no actualizan el mástil');
  await page.goto(url+'#lesson-2-2');
  if(!await page.locator('#lesson-2-2').evaluate(el=>el.open))throw Error(label+': el enlace al capítulo 2-2 no se abre');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  if(overflow>3)throw Error(label+': desbordamiento horizontal del documento de '+overflow+'px');
  if(errors.length)throw Error(label+': error JavaScript '+errors.join('; '));
  await page.screenshot({path:'caged-visual-evidence/'+label+'.png',fullPage:true});
  console.log(label+': OK · 18 capítulos, 5 diagramas, mástil interactivo, navegación y ancho');
  await context.close();
 }
}finally{await browser.close();}
