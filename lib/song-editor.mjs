import {chords,rhythmCatalog} from './music.mjs';
import {normalizeChord} from './song-import.mjs';

export function songEditorState({title='',sequenceText='',noteText='',reviewed=false,hasFile=false,songId='',busy=false}={}){
 const chordTokens=sequenceText.split(/[\s|,;]+/).filter(Boolean),sequence=chordTokens.map(normalizeChord);
 const unsupported=chordTokens.filter((_,i)=>!sequence[i]||!Object.hasOwn(chords,sequence[i]));
 const noteTokens=noteText.split(/[\s,;]+/).filter(Boolean),notes=noteTokens.map(token=>{const m=token.match(/^([1-6]):(\d{1,2})$/);return m?{string:+m[1]-1,fret:+m[2]}:null;});
 const badNotes=notes.some(n=>!n||n.fret>24);
 const originalReasons=[];if(!title.trim())originalReasons.push('Escribe un título para la canción.');
 if(!hasFile&&!songId)originalReasons.push('Selecciona o vuelve a adjuntar el archivo original.');
 const contentReasons=[];
 if(!sequence.length&&!notes.length)contentReasons.push('Lee el archivo o escribe acordes o notas en el fragmento de práctica.');
 if(unsupported.length)contentReasons.push('Corrige los acordes sin diagrama: '+unsupported.join(', ')+'.');
 if(badNotes)contentReasons.push('Corrige la tablatura: usa cuerda:traste, con cuerdas 1–6 y trastes 0–24.');
 if(sequence.length>16)contentReasons.push(`Hay ${sequence.length} acordes: elige un fragmento de hasta 16. El original completo se conserva.`);
 if(notes.length>128)contentReasons.push(`Hay ${notes.length} notas: elige un fragmento de hasta 128.`);
 const practiceReasons=[...originalReasons,...contentReasons];if(!reviewed)practiceReasons.push('Marca «He revisado los acordes, las notas y el fragmento».');
 return {sequence,unsupported,noteTokens,notes,badNotes,valid:!!title.trim()&&!contentReasons.length,originalReasons,practiceReasons,canSaveOriginal:!busy&&!originalReasons.length,canSavePractice:!busy&&!practiceReasons.length};
}
export function recoverSongDraft(value){
 if(!value||typeof value!=='object'||Array.isArray(value))return null;
 return {...value,patternIndex:Number.isInteger(value.patternIndex)&&value.patternIndex>=0&&value.patternIndex<rhythmCatalog.length?value.patternIndex:1,requiresOriginal:!value.songId};
}
export async function songResponse(response){
 let data;try{data=await response.json();}catch{throw Error(response.status===401?'Tu sesión ha caducado. Vuelve a entrar y reintenta; conserva este borrador.':'El servidor no ha enviado una respuesta válida. Conserva el borrador y vuelve a intentarlo.');}
 if(!response.ok)throw Error(data?.error||'No se ha podido guardar la canción. Reintenta sin cerrar el borrador.');
 return data;
}
