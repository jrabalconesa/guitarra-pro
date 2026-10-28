import {chords,STRINGS,rhythmCatalog} from './music.mjs';
const spanish={do:'C',re:'D',mi:'E',fa:'F',sol:'G',la:'A',si:'B'};
export function normalizeChord(value){let s=String(value).trim().replace(/[♯]/g,'#').replace(/[♭]/g,'b').replace(/[.,;:()[\]{}]/g,'');s=s.replace(/^(sol|do|re|mi|fa|la|si)(?=[#b]?([mM0-9]|sus|add|dim|aug|$|\/))/i,(_,r)=>spanish[r.toLowerCase()]);if(!/^[A-G][#b]?(?:m(?:aj)?\d*|\d+|sus[24]|add9|dim|aug)?(?:\/[A-G][#b]?)?$/.test(s))return null;return s;}
export function parseSongText(text){
 const lines=String(text).replace(/\r/g,'').split('\n'),sequence=[],notes=[],warnings=[];
 for(const line of lines){const brackets=[...line.matchAll(/\[([^\]]+)\]/g)].map(m=>normalizeChord(m[1])).filter(Boolean);if(brackets.length){sequence.push(...brackets);continue;}
 const clean=line.replace(/\|/g,' ').replace(/\s+[-–—→]+\s+/g,' ').trim(),tokens=clean.split(/\s+/).filter(Boolean),c=tokens.map(normalizeChord).filter(Boolean);
 // Isolated A/E in prose are not chord lines. A one-chord line is explicit enough to review.
 if(tokens.length&&c.length/tokens.length>=.75&&tokens.length<=40)sequence.push(...c);
 }
 for(let start=0;start<lines.length-5;start++){
 const block=lines.slice(start,start+6).map(l=>l.match(/^\s*(?:[eEBGDA]|mi|si|sol|re|la)\s*[|:]([\d\s|\-hpbrv~x/\\().]+)$/i));
 if(block.some(m=>!m))continue;
 const events=[];block.forEach((m,string)=>{for(const hit of m[1].matchAll(/\d{1,2}/g)){const fret=+hit[0];if(fret<=24)events.push({column:hit.index,string,fret,midi:STRINGS[string]+fret});}});
 events.sort((a,b)=>a.column-b.column||b.string-a.string);if(events.some((n,i)=>i>0&&n.column===events[i-1].column))warnings.push('La tablatura incluye notas simultáneas: para la escucha guiada se practicarán por separado.');
 notes.push(...events.map(({column,...n})=>n));start+=5;
 }
 if(notes.length)warnings.push('La tablatura no determina por sí sola las duraciones. Se propone una nota por pulso; revisa el ritmo en el original.');
 const unsupported=[...new Set(sequence.filter(c=>!chords[c]))];
 if(unsupported.length)warnings.push('Revisa o sustituye los acordes sin diagrama: '+unsupported.join(', ')+'.');
 return {sequence,notes,warnings:[...new Set(warnings)],unsupported};
}
export function makeSongExercise(song,kind='chords'){
 const id=song.id+'-v'+song.updated+(kind==='tab'?'-tab':kind==='arpeggio'?'-arp':'-chords');
 if(kind==='tab')return {id,custom:true,songId:song.id,skill:'melodia',level:1,title:song.title+' · tablatura',baseTempo:50,notes:song.notes||[],description:'Notas importadas y revisadas; una nota por pulso es una propuesta de práctica.'};
 if(kind==='arpeggio'){
 const notes=(song.sequence||[]).flatMap(symbol=>{const ch=chords[symbol];if(!ch)return [];const bass=6-ch.frets.findIndex(f=>f>=0);return [bass,3,2,1,2,3,2,1].map((string,i)=>({string:string-1,fret:ch.frets[6-string],midi:STRINGS[string-1]+ch.frets[6-string],finger:['p','i','m','a','m','i','m','a'][i],symbol}));});
 return {id,custom:true,songId:song.id,skill:'arpegio',level:1,title:song.title+' · arpegio propuesto',baseTempo:50,notes,description:'Propuesta original: bajo–3ª–2ª–1ª–2ª–3ª–2ª–1ª. Una nota por pulso, sin atribuir este arreglo a la grabación.'};
 }
 return {id,custom:true,songId:song.id,skill:'acompanamiento',level:1,title:song.title,baseTempo:50,notes:[],progression:song.sequence||[],durations:song.durations,capo:song.capo||0,family:'cancion',description:'Secuencia revisada. Un acorde por compás; ajusta repeticiones según el original.'};
}
export function tutorialSearchLinks(title,artist=''){const q=[title,artist,'tutorial guitarra acordes ritmo arpegio español'].filter(Boolean).join(' ');return [{title:'Buscar tutoriales en YouTube',url:'https://www.youtube.com/results?search_query='+encodeURIComponent(q)},{title:'Buscar tutoriales en la web',url:'https://www.google.com/search?q='+encodeURIComponent(q)}];}

export function suggestSongRhythm(text){const lines=String(text).split('\n');for(const line of lines){const symbols=line.match(/\([↓↑]\)|[↓↑X·—]/g);if(symbols&&symbols.length>=6){const normalized=symbols.map(s=>s==='·'?'—':s==='X'?'(↓)':s);const match=rhythmCatalog.findIndex(r=>r.pattern.join('|')===normalized.join('|'));if(match>=0)return {index:match,detected:true};}}if(/6\s*\/\s*8/.test(text))return {index:9,detected:true};if(/3\s*\/\s*4/.test(text))return {index:8,detected:true};return {index:1,detected:false};}
