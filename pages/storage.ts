// IndexedDB adapter: all records and original files remain on this browser.
let opening:Promise<IDBDatabase>;
function open(){return opening??=new Promise((resolve,reject)=>{const r=indexedDB.open('guitarra-pro-pages-v26',1);r.onupgradeneeded=()=>{r.result.createObjectStore('records',{keyPath:'id'});r.result.createObjectStore('files');};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
export async function transaction(store:string,mode:IDBTransactionMode,work:(s:IDBObjectStore,done:(v:any)=>void)=>void){const db=await open();return new Promise<any>((resolve,reject)=>{const tx=db.transaction(store,mode);let result:any;work(tx.objectStore(store),v=>result=v);tx.oncomplete=()=>resolve(result);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('No se pudo guardar en este navegador.'));});}
export const eq=(k:string,v:any)=>(r:any)=>r[k]===v;
export const ne=(k:string,v:any)=>(r:any)=>r[k]!==v;
export const and=(...p:any[])=>(r:any)=>p.every(f=>f(r));
export const inArray=(k:string,v:any[])=>(r:any)=>v.includes(r[k]);
export const desc=(k:string)=>k;
export const records={id:'id',userId:'userId',kind:'kind',payload:'payload',createdAt:'createdAt'};
class Query {
 op:string; predicate=(r:any)=>true; maximum=Infinity; sort=''; valuesData:any; conflict:any=null; ignore=false; projection:any;
 constructor(op:string){this.op=op;}
 from(_:any){return this;} where(p:any){this.predicate=p;return this;} orderBy(k:string){this.sort=k;return this;} limit(n:number){this.maximum=n;return this;}
 values(v:any){this.valuesData=v;return this;} set(v:any){this.valuesData=v;return this;}
 onConflictDoNothing(){this.ignore=true;return this;} onConflictDoUpdate(c:any){this.conflict=c;return this;} returning(p:any){this.projection=p;return this;}
 then(resolve:any,reject:any){return transaction('records',this.op==='select'?'readonly':'readwrite',(s,done)=>{const req=s.getAll();req.onsuccess=()=>{const all=req.result;let rows:any[]=[];if(this.op==='select'){rows=all.filter(this.predicate);if(this.sort)rows.sort((a,b)=>b[this.sort]-a[this.sort]);rows=rows.slice(0,this.maximum);}else if(this.op==='insert'){const existing=all.find(r=>r.id===this.valuesData.id);if(!existing){s.add(this.valuesData);rows=[this.valuesData];}else if(this.conflict&&(!this.conflict.setWhere||this.conflict.setWhere(existing))){const updated={...existing,...this.conflict.set};s.put(updated);rows=[updated];}else if(!this.ignore&&!this.conflict){throw Error('Registro duplicado');}}else{rows=all.filter(this.predicate).map(r=>({...r,...this.valuesData}));rows.forEach(r=>s.put(r));}done(this.projection?rows.map(r=>Object.fromEntries(Object.entries(this.projection).map(([k,v])=>[k,r[v as string]]))):rows);};}).then(resolve,reject);}
}
export const getDb=()=>({select:()=>new Query('select'),insert:(_:any)=>new Query('insert'),update:(_:any)=>new Query('update')});
export const env={BUCKET:{async get(key:string){const blob=await transaction('files','readonly',(s,d)=>{const r=s.get(key);r.onsuccess=()=>d(r.result);});return blob?{body:blob}:null;},async put(key:string,bytes:any,options:any){await transaction('files','readwrite',(s,d)=>{s.put(new Blob([bytes],{type:options?.httpMetadata?.contentType}),key);d(true);});}}};
