'use client';
// All reading happens in the browser. Worker, OCR models and fonts are served by this Site.
export async function readSongFile(file:File,onProgress:(s:string)=>void,options:{first:number,last:number,forceOCR:boolean},signal:AbortSignal){
 let worker:any=null,pdf:any=null,pdfTask:any=null;const check=()=>{if(signal.aborted)throw Error('Lectura cancelada.');};
 const ocr=async(canvas:HTMLCanvasElement)=>{check();if(!worker){const {createWorker}=await import('tesseract.js');worker=await createWorker(['spa','eng'],1,{workerPath:'/vendor/ocr/worker.min.js',corePath:'/vendor/ocr/core',langPath:'/vendor/ocr/lang',logger:m=>{if(m.status==='recognizing text')onProgress('Leyendo imagen · '+Math.round(m.progress*100)+' %');}});await worker.setParameters({preserve_interword_spaces:'1',tessedit_pageseg_mode:'6'});}check();const r=await worker.recognize(canvas);return r.data.text as string;};
 const canvasFor=(width:number,height:number)=>{const canvas=document.createElement('canvas'),scale=Math.min(1,2400/Math.max(width,height));canvas.width=Math.ceil(width*scale);canvas.height=Math.ceil(height*scale);return canvas;};
 try{check();if(file.type==='application/pdf'){
  const pdfjs=await import('pdfjs-dist/legacy/build/pdf.mjs');pdfjs.GlobalWorkerOptions.workerSrc='/vendor/pdf/pdf.worker.min.mjs';
  pdfTask=pdfjs.getDocument({data:await file.arrayBuffer(),cMapUrl:'/vendor/pdf/cmaps/',cMapPacked:true,standardFontDataUrl:'/vendor/pdf/fonts/',wasmUrl:'/vendor/pdf/wasm/'});pdf=await pdfTask.promise;
  const first=Math.max(1,Math.min(pdf.numPages,options.first)),last=Math.max(first,Math.min(pdf.numPages,options.last,first+11));const pages=[];
  for(let i=first;i<=last;i++){check();onProgress(`Leyendo página ${i} de ${pdf.numPages}…`);const page=await pdf.getPage(i),content=await page.getTextContent();
   const items:any[]=content.items.filter((x:any)=>'str' in x&&x.str.trim());let text='';
   if(!options.forceOCR&&items.reduce((n,x)=>n+x.str.length,0)>15){
    const rows:any[]=[];for(const item of items){let row=rows.find(r=>Math.abs(r.y-item.transform[5])<3);if(!row){row={y:item.transform[5],items:[]};rows.push(row);}row.items.push(item);}
    text=rows.sort((a,b)=>b.y-a.y).map(row=>{const parts=row.items.sort((a:any,b:any)=>a.transform[4]-b.transform[4]);let line='',lastX=parts[0]?.transform[4]||0;for(const item of parts){const unit=Math.max(2,item.width/Math.max(1,item.str.length));line+=' '.repeat(Math.min(100,Math.max(0,Math.round((item.transform[4]-lastX)/unit))))+item.str;lastX=item.transform[4]+item.width;}return line;}).join('\n');
   }else{const viewport=page.getViewport({scale:2}),canvas=canvasFor(viewport.width,viewport.height),v=page.getViewport({scale:2*canvas.width/viewport.width});await page.render({canvasContext:canvas.getContext('2d')!,canvas,viewport:v}).promise;text=await ocr(canvas);canvas.width=canvas.height=1;}
   pages.push(text);page.cleanup();
  }
  return {text:pages.join('\n\n'),notice:`Páginas ${first}–${last} de ${pdf.numPages}. El archivo original se guarda completo.`};
 }
 const bytes=new Uint8Array(await file.slice(0,12).arrayBuffer());if(file.type==='image/png'&&(bytes[0]!==137||bytes[1]!==80))throw Error('El archivo no contiene una imagen PNG válida');const dataURL=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(Error('No se pudo leer la imagen'));reader.readAsDataURL(file);});try{const image=new Image();image.src=dataURL;await image.decode();check();const canvas=canvasFor(image.naturalWidth,image.naturalHeight);canvas.getContext('2d')!.drawImage(image,0,0,canvas.width,canvas.height);const text=await ocr(canvas);canvas.width=canvas.height=1;return {text,notice:'Lectura de imagen: revisa acordes, números y alineación de la tablatura.'};}finally{}
 }finally{await worker?.terminate();await pdfTask?.destroy();}
}
