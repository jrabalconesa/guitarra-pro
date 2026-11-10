import {chords} from './music.mjs';
import {rhythmCatalog,isRhythmRest,strumVoicing} from './rhythms.mjs';
import {labExercise} from './accompaniment-lab.mjs';

export const RHYTHM_CHORDS=['Em','Am','C','G','D','A','E','Dm','E7','G7','Am7','Em7'];
// Original practice suggestions, not mandatory harmonies or song transcriptions.
export const RHYTHM_PROGRESSIONS={
 negras:['Em','Am'],alterno:['Em','Am'],pop:['G','D','Em','C'],
 balada:['C','Am','G','C'],folk:['C','G','Am','G'],vals:['Am','Dm','E7','Am'],
 'pop-apagado':['G','D','Em','C'],rock:['Em','G','D','A'],
 'folk-alterno':['C','G','Am','G'],reggae:['Am','Dm','E7','Am'],
 rumba:['Am','G','E7','Am'],balada68:['C','G','Am','G'],funk:['Em7','Am7'],
 'bajo-tres-acordes':['C','G','Am','G'],'marcha-aguda':['C','D','Em','G'],
 'respuesta-silencio':['Em','Am']
};
export function rhythmAccompaniment(id,mode='single',symbol='Em'){
 const rhythm=rhythmCatalog.find(r=>r.id===id);
 if(!rhythm||!Object.hasOwn(chords,symbol)||!['single','progression'].includes(mode))throw Error('Ritmo o acompañamiento no disponible.');
 const progression=mode==='single'?[symbol]:RHYTHM_PROGRESSIONS[id];
 if(!progression)throw Error('Falta la rueda de práctica.');
 const exercise={...labExercise(progression.length===1?[symbol,symbol]:progression),pattern:rhythm.pattern,patternIndex:rhythmCatalog.indexOf(rhythm)};
 return {rhythm,progression,exercise};
}
export function rhythmPreviewEvents(id,mode='single',symbol='Em',tempo=72){
 if(!Number.isFinite(tempo)||tempo<=0)throw Error('Tempo no válido.');
 const {rhythm,progression}=rhythmAccompaniment(id,mode,symbol),step=60/tempo/rhythm.subdivision;
 return progression.flatMap((chord,bar)=>rhythm.pattern.flatMap((stroke,slot)=>isRhythmRest(stroke)?[]:[{
  chord,bar,slot,stroke,time:(bar*rhythm.pattern.length+slot)*step,
  notes:strumVoicing(chords[chord],stroke),muted:stroke.startsWith('('),step
 }]));
}
