'use client';
import {useState} from 'react';
import Diagram from './chord-diagram';
import {useGuitarAudio,AudioPrefs} from './audio-engine';
import {chords,exercises} from '../lib/music.mjs';
import {rhythmCatalog,isRhythmRest,strumVoicing} from '../lib/rhythms.mjs';
import {labExercise} from '../lib/accompaniment-lab.mjs';

type Area='acordes'|'ritmos'|'arpegios';
const chordStages=[
 {title:'Primeros acordes',symbols:['C','G','D','Em','Am','A','E']},
 {title:'Acordes menores',symbols:['Dm','Bm','Fm','Gm','Cm']},
 {title:'Acordes de séptima',symbols:['C7','D7','E7','G7','A7','B7','Am7','Em7']},
 {title:'Acordes de quinta',symbols:['E5','A5','D5','G5','C5','F5','B5']},
 {title:'Variantes y extensiones',symbols:['Cmaj7','Gmaj7','Dsus2','Asus4','Cadd9','Em7','Am7']}
];
const rhythmStages=[
 ['negras','alterno','pop'],['balada','folk','vals'],['pop-apagado','rock','folk-alterno'],
 ['reggae','rumba','balada68'],['funk','bajo-tres-acordes','marcha-aguda','respuesta-silencio']
];
const arpStages=[
 {title:'Tres cuerdas al aire',chord:'Em',strings:[5,4,3,4,5,4,3,4],tip:'Pulgar e índice: escucha cada nota por separado.'},
 {title:'Pulgar, índice, medio y anular',chord:'C',strings:[4,2,1,0,4,2,1,0],tip:'Mantén la mano relajada y reparte las voces.'},
 {title:'Bajo alterno',chord:'Am',strings:[4,2,1,2,3,2,1,2],tip:'El pulgar alterna entre dos bajos sin perder el pulso.'},
 {title:'Arpegio de seis notas',chord:'G',strings:[5,2,1,0,1,2,5,2,1,0,1,2],tip:'Combina subida y bajada con el mismo volumen.'},
 {title:'Fingerpicking con bajo independiente',chord:'C',strings:[4,2,3,1,4,2,3,0,4,2,3,1],tip:'Nivel de exploración: alterna el bajo y acentúa la melodía; todavía sin evaluación automática específica.'}
];
const progressionStages=[
 {name:'Primeras transiciones',chords:['Em','Am','C','G'],description:'Cambios sencillos con acordes abiertos.'},
 {name:'Pop y folk',chords:['G','D','Em','C'],description:'Rueda de cuatro acordes para rasgueos habituales.'},
 {name:'Blues de séptimas',chords:['A7','D7','E7','A7'],description:'Cadencia de blues; escucha la tensión de la séptima.'},
 {name:'Quintas de rock',chords:['E5','G5','A5','E5'],description:'Acordes de potencia, con cuerdas graves y silencios controlados.'},
 {name:'Colores armónicos',chords:['Cmaj7','Am7','Dm','G7'],description:'Progresión con extensiones y resolución.'}
];
const frettedMidi=(symbol:string,string:number)=>{const c=chords[symbol];const fret=c?.frets[string];return fret===undefined||fret<0?null:[40,45,50,55,59,64][string]+fret};
export default function TechniqueCatalog({prefs,onPractice,attempts=[]}:{prefs:AudioPrefs,onPractice:(exercise:any)=>void,attempts?:any[]}){
 const [area,setArea]=useState<Area>('acordes'),[mode,setMode]=useState<'consulta'|'curso'>('consulta'),[level,setLevel]=useState(1),[search,setSearch]=useState('');
 const audio=useGuitarAudio(prefs);
 const chordKeys=Object.keys(chords).filter(s=>!s.includes('#')&&!s.includes('b')).filter(s=>!search||s.toLowerCase().includes(search.toLowerCase())||chords[s].name.toLowerCase().includes(search.toLowerCase()));
 const visibleChords=mode==='curso'?chordStages[level-1].symbols:chordKeys.slice(0,48);
 const visibleRhythms=mode==='curso'?rhythmCatalog.filter(r=>rhythmStages[level-1].includes(r.id)):rhythmCatalog;
 const visibleArps=mode==='curso'?[arpStages[level-1]]:arpStages;
 async function playChord(symbol:string){audio.stop();await audio.output();const notes=chords[symbol]?.midi||[];const t=audio.now()+.06;notes.forEach((m:number,i:number)=>audio.tone(m,t+i*.085,.85,.24));}
 async function playRhythm(r:any){audio.stop();await audio.output();const t=audio.now()+.08,step=60/72/r.subdivision;const sample=chords.Em;r.pattern.forEach((symbol:string,i:number)=>{if(isRhythmRest(symbol))return;const notes=strumVoicing(sample,symbol);notes.forEach((m:number,j:number)=>audio.tone(m,t+i*step+j*.013,step*.85,.13));});}
 async function playArp(a:typeof arpStages[number]){audio.stop();await audio.output();const t=audio.now()+.06;a.strings.forEach((s,i)=>{const midi=frettedMidi(a.chord,s);if(midi!==null)audio.tone(midi,t+i*.31,.42,.36);});}
 async function playProgression(symbols:string[]){audio.stop();await audio.output();const t=audio.now()+.08;symbols.forEach((symbol,index)=>{const notes=chords[symbol]?.midi||[];notes.forEach((m:number,i:number)=>audio.tone(m,t+index*1.25+i*.035,.95,.2));});}
 const progressionMatches=(symbols:string[])=>attempts.filter(a=>a.exerciseId==='lab_'+symbols.join('_'));
 const chooseArea=(next:Area)=>{audio.stop();setArea(next);setSearch('')};
 const chooseLevel=(next:number)=>{audio.stop();setLevel(next)};
 return <section className="technique-catalog">
  <div className="page-heading"><div><div className="eyebrow">TÉCNICA Y REPERTORIO</div><h1>Acordes, ritmos y arpegios</h1><p>Consulta libre o aprende de forma progresiva. Escucha cada ejemplo y lleva los ejercicios al centro de práctica.</p></div></div>
  <div className="technique-toolbar" role="group" aria-label="Modalidad de aprendizaje"><button className={mode==='consulta'?'active':''} onClick={()=>setMode('consulta')} aria-pressed={mode==='consulta'}>Consulta libre</button><button className={mode==='curso'?'active':''} onClick={()=>setMode('curso')} aria-pressed={mode==='curso'}>Curso progresivo</button></div>
  <div className="technique-tabs" role="group" aria-label="Apartado técnico">{(['acordes','ritmos','arpegios'] as Area[]).map(id=><button key={id} className={area===id?'active':''} aria-pressed={area===id} onClick={()=>chooseArea(id)}>{id==='acordes'?'▦ Acordes':id==='ritmos'?'↓↑ Ritmos':'♫ Arpegios'}</button>)}</div>
  {mode==='curso'&&<div className="technique-levels" role="group" aria-label="Nivel del curso">{[1,2,3,4,5].map(n=><button key={n} className={level===n?'active':''} aria-pressed={level===n} onClick={()=>chooseLevel(n)}>Nivel {n}</button>)}</div>}
  {area==='acordes'&&<><p className="technique-note">{mode==='curso'?chordStages[level-1].title:'Acordes mayores, menores, séptimas, quintas y variantes. Los diagramas indican trastes y cuerdas que no se tocan.'}</p>{mode==='consulta'&&<label className="technique-search">Buscar acorde<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Por ejemplo: Am, Sol, séptima…"/></label>}<div className="technique-grid">{visibleChords.filter(s=>chords[s]).map(symbol=><article className="technique-card" key={symbol}><Diagram symbol={symbol}/><div className="technique-actions"><button className="secondary" onClick={()=>playChord(symbol)}>♫ Escuchar</button><button className="secondary" onClick={()=>onPractice(labExercise([symbol,symbol==='Em'?'Am':'Em']))}>Practicar cambio</button></div></article>)}</div>{mode==='consulta'&&chordKeys.length>48&&<p className="technique-note">Mostrando 48 acordes. Utiliza la búsqueda para encontrar otros.</p>}<h2 className="technique-subtitle">Secuencias de acordes para practicar</h2><p className="technique-note">Escucha cuatro compases y practica la rueda completa. Los intentos evaluados aparecen al volver a esta sección.</p><div className="technique-grid">{progressionStages.map((p,i)=>mode==='curso'&&i!==level-1?null:<article className="technique-card technique-progression" key={p.name}><small>Nivel {i+1}</small><h3>{p.name}</h3><p>{p.description}</p><div className="technique-chord-sequence">{p.chords.map((c,j)=><span key={j}>{c}</span>)}</div><p className="technique-records">{progressionMatches(p.chords).length} práctica(s) registrada(s) · {progressionMatches(p.chords).filter(a=>a.reliable&&a.score>=80).length} con puntuación ≥80</p><div className="technique-actions"><button className="secondary" onClick={()=>playProgression(p.chords)}>♫ Escuchar secuencia</button><button className="secondary" onClick={()=>onPractice(labExercise(p.chords))}>Practicar secuencia</button></div></article>)}</div></>}
  {area==='ritmos'&&<><p className="technique-note">Los símbolos ↓ y ↑ indican rasgueo; B, bajo; —, silencio. Los golpes entre paréntesis son apagados. Ejemplos originales a 72 pulsos/min.</p><div className="technique-grid">{visibleRhythms.map((r:any)=><article className="technique-card" key={r.id}><h3>{r.name}</h3><p>{r.meter} · {r.beats} pulsos</p><div className="rhythm-symbols" aria-label={'Patrón '+r.pattern.join(' ')}>{r.pattern.map((s:string,i:number)=><span key={i}>{s}</span>)}</div><p>{r.tip||'Mantén una pulsación constante y escucha los acentos.'}</p><div className="technique-actions"><button className="secondary" onClick={()=>playRhythm(r)}>♫ Escuchar</button><button className="secondary" onClick={()=>onPractice({...labExercise(['Em','Am']),pattern:r.pattern,patternIndex:rhythmCatalog.indexOf(r)})}>Practicar</button></div></article>)}</div></>}
  {area==='arpegios'&&<><p className="technique-note">Cinco pasos de fingerpicking: del pulgar e índice a un bajo independiente. Las muestras son originales; el quinto nivel se practica por ahora con seguimiento manual.</p><div className="technique-grid">{visibleArps.map(a=><article className="technique-card" key={a.title}><h3>{a.title}</h3><p>Acorde {a.chord} · {a.strings.length} notas</p><p>{a.tip}</p><div className="arp-fingers">{a.strings.map((s,i)=><span key={i}>{6-s}</span>)}</div><div className="technique-actions"><button className="secondary" onClick={()=>playArp(a)}>♫ Escuchar</button><button className="secondary" onClick={()=>onPractice(exercises.find((e:any)=>e.skill==='arpegio'&&e.level===Math.min(4,arpStages.indexOf(a)+1)))}>Abrir práctica</button></div></article>)}</div></>}
  <div className="technique-foot"><button className="secondary" onClick={()=>audio.stop()}>Detener audio</button><p>Las muestras se sintetizan en el dispositivo. El progreso evaluado se registra en Practicar; esta consulta no marca ejercicios como superados automáticamente.</p></div>
 </section>;
}
