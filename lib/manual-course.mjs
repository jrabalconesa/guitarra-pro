import {MANUAL_ITEMS,MANUAL_PAGES} from './manual-catalog.mjs';
export {MANUAL_ITEMS,MANUAL_PAGES,MANUAL_PDF} from './manual-catalog.mjs';
export const MANUAL_BLOCKS=[['1','Teoría y armonía'],['2','Solfeo y lectura'],['3','Técnica'],['4','CAGED'],['5','Cinco canciones']];
export function manualExercise(id){const item=MANUAL_ITEMS.find(x=>x.id===id);if(!item?.pitchReady)return null;return {id:item.id,title:item.title+' · manual',custom:true,manualId:item.id,sourcePage:Number(item.printed),skill:'melodia',level:1,baseTempo:item.baseBpm,tempo:item.baseBpm,source:'Manual ampliado',description:'Verificación de las tres notas aisladas de la TAB. El silencio final, la digitación y el gesto se revisan en el manual; no se puntúan aquí.',notes:item.notes.map(x=>({...x})),speeds:[36,48,60]};}
export function effectiveManualTempo(item,speed){return Math.round(item.baseBpm*speed)/100;}
export function emptyManualState(){return {version:1,updated:0,lastId:MANUAL_ITEMS[0].id,page:1,speed:60,read:{},heard:{},plan:{},entries:[]};}
export function validManualState(s){if(!s||Array.isArray(s)||s.version!==1||!Number.isFinite(s.updated)||!MANUAL_ITEMS.some(i=>i.id===s.lastId)||!Number.isInteger(s.page)||s.page<1||s.page>MANUAL_PAGES.length||![60,80,100].includes(s.speed))return false;
 for(const key of ['read','heard','plan'])if(!s[key]||Array.isArray(s[key])||typeof s[key]!=='object'||Object.keys(s[key]).length>300||Object.entries(s[key]).some(([k,v])=>k.length>100||typeof v!=='string'||v.length>40))return false;
 return Array.isArray(s.entries)&&s.entries.length<=90&&s.entries.every(e=>typeof e.id==='string'&&e.id.length<=100&&MANUAL_ITEMS.some(i=>i.id===e.itemId)&&Number.isFinite(e.date)&&[60,80,100].includes(e.speed)&&['easy','ok','hard'].includes(e.self)&&Number.isInteger(e.minutes)&&e.minutes>=1&&e.minutes<=60&&typeof e.note==='string'&&e.note.length<=300);
}
export function mergeManualState(a,b){if(!validManualState(a))return validManualState(b)?b:emptyManualState();if(!validManualState(b))return a;const latest=a.updated>=b.updated?a:b;return {...latest,read:{...a.read,...b.read},heard:{...a.heard,...b.heard},plan:{...a.plan,...b.plan},entries:[...new Map([...a.entries,...b.entries].map(e=>[e.id,e])).values()].sort((a,b)=>b.date-a.date).slice(0,90)};}
export function manualRecommendation(state,attempts=[],now=Date.now()){
 const last=state.entries[0];const measured=attempts.filter(a=>a.reliable&&a.exerciseId?.startsWith('manual-')).sort((a,b)=>b.date-a.date)[0];
 if(last?.self==='hard')return {id:last.itemId,speed:60,reason:'En tu última autoevaluación pediste repetir. Trabaja un fragmento al 60 %.'};
 if(measured&&(measured.pitchScore<85||measured.coverage<85))return {id:measured.exerciseId,speed:60,reason:'Tu último intento utilizable necesita repaso de notas. Escucha y vuelve a practicar sin prisa.'};
 const due=state.entries.find(e=>now-e.date>7*86400000);if(due)return {id:due.itemId,speed:60,reason:'Hace más de siete días que practicaste este contenido. Comprueba qué recuerdas.'};
 return {id:state.lastId,speed:state.speed,reason:'Continúa tu última referencia. Aumenta velocidad tras tres repeticiones claras, sin detenerte.'};
}
// A flexible 28-day plan. Reading and sounds remain available without completing earlier days.
export const MANUAL_PLAN=[
 ['Sonido y cuerdas al aire','GP_U17',1],['Escuchar la tercera menor','GP_U02',1],['Escala de do','GP_Escala_Do_Mayor',1],['Fundamentales de una rueda','GP_Rueda_C',1],['Cuatro pulsos','GP_Solfeo_01',2],['Repaso cómodo','GP_U17',1],['Primera canción','song1',5],
 ['Corcheas despacio','GP_Ritmo_01',2],['Subdivisiones y escucha','GP_Ritmo_02',2],['Tres pulsos','GP_3_4',2],['Dos cuerdas','GP_Lectura_Dos_Cuerdas',2],['Repeticiones','GP_Repeticion',2],['Escuchar y grabar','song2',5],['Repaso semanal','song3',5],
 ['Preparar hammer-on','GP_Tecnica_01',3],['Preparar pull-off','GP_Tecnica_02',3],['Slide sin tensión','GP_Tecnica_03',3],['Palm mute suave','GP_U30',3],['Vibrato y gesto','GP_Tecnica_avanzada_01',3],['Repetir dos técnicas','GP_U27',3],['Aplicar a una canción','song3',5],
 ['Formas C y A','GP_CAGED_Formas_C_A',4],['Dos formas CAGED','GP_CAGED_Arpegios',4],['Conexión C-F','GP_CAGED_C_F',4],['Frase sobre Am','GP_CAGED_Frases_Am',4],['Canción completa','song1',5],['Ensayo con calma','song4',5],['Interpretación y siguiente objetivo','song5',5]
].map(([title,code,block],i)=>({day:i+1,title,block,id:String(code).startsWith('song')?'manual-song-'+String(code).slice(4):'manual-'+code}));
