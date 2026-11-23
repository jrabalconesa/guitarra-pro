'use client';
import {MANUAL_ITEMS,manualRecommendation} from '../lib/manual-course.mjs';
export default function ManualEntry({tab,state,attempts,onOpen}:{tab:string,state:any,attempts:any[],onOpen:(block?:string,id?:string,view?:string)=>void}){
 const rec=manualRecommendation(state,attempts),item=MANUAL_ITEMS.find(x=>x.id===rec.id)||MANUAL_ITEMS[0];
 const title=tab==='caged'?'CAGED con el manual y sus audios':tab==='biblioteca'?'Manual de aprendizaje y cinco canciones':tab==='aia'?'Repaso del manual según tu práctica':tab==='progreso'?'Tu recorrido con el manual':'Aprende con el manual completo';
 return <section className="manual-entry"><div><b>{title}</b><p>{tab==='aia'?rec.reason:tab==='progreso'?state.entries.length+' sesiones por autoevaluación · '+Object.keys(state.read).length+' referencias leídas.':'Explicaciones, tablaturas y guitarra muestreada al 60 %, 80 % y 100 %.'}</p></div><div className="actions"><button className="secondary" onClick={()=>onOpen(tab==='caged'?'4':'all',tab==='aia'?item.id:undefined,tab==='progreso'?'progress':'course')}>{tab==='progreso'?'Ver registro y repasos':tab==='caged'?'Abrir referencias CAGED':'Abrir curso del manual'}</button>{tab==='biblioteca'&&<button className="secondary" onClick={()=>onOpen('5')}>Cinco canciones de práctica</button>}</div></section>;
}
