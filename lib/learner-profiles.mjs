export const PRIMARY_PROFILE='main';
export function validLearnerId(id){return id==='main'||typeof id==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);}
export function learnerUserId(owner,id='main'){if(!validLearnerId(id))throw Error('Perfil no válido');return id==='main'?owner:owner+':learner:'+id;}
export const GUITAR_TYPES=['Española','Acústica','Eléctrica con sonido limpio'];
export function defaultInstruments(){return GUITAR_TYPES.map((type,i)=>({id:'guitar-'+i,name:type.replace(' con sonido limpio',''),type,notes:''}));}
export function normalizeGuitarProfile(value={}){
 const instruments=Array.isArray(value.instruments)?value.instruments:defaultInstruments();
 if(!instruments.length||instruments.length>30)throw Error('Añade entre 1 y 30 instrumentos.');
 const seen=new Set();const cleaned=instruments.map(x=>{if(!x||typeof x.id!=='string'||!/^[a-zA-Z0-9-]{1,60}$/.test(x.id)||seen.has(x.id)||!GUITAR_TYPES.includes(x.type))throw Error('Instrumento no válido');seen.add(x.id);const name=String(x.name||'').trim().slice(0,60);if(!name)throw Error('Escribe el nombre del instrumento');return {id:x.id,name,type:x.type,notes:String(x.notes||'').slice(0,500)};});
 const active=cleaned.find(x=>x.id===value.activeInstrumentId)||cleaned.find(x=>x.type===value.guitar)||cleaned[0];
 return {name:String(value.name||'Guitarrista').trim().slice(0,60)||'Guitarrista',goal:String(value.goal||'Acompañar y tocar arpegios').slice(0,160),minutes:Math.min(60,Math.max(5,Number(value.minutes)||10)),instruments:cleaned,activeInstrumentId:active.id,guitar:active.type};
}
export function instrumentContext(profile){const p=normalizeGuitarProfile(profile),i=p.instruments.find(x=>x.id===p.activeInstrumentId);return {instrumentId:i.id,instrumentName:i.name,instrumentType:i.type};}
