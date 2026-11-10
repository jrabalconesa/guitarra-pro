import test from 'node:test';
import assert from 'node:assert/strict';
import {songEditorState,recoverSongDraft,songResponse} from './song-editor.mjs';

test('an uploaded original can be saved before reading or reviewing musical content',()=>{
 const s=songEditorState({title:'Mi canción',hasFile:true});
 assert.equal(s.canSaveOriginal,true);assert.equal(s.canSavePractice,false);
 assert(s.practiceReasons.some(r=>r.includes('Lee el archivo')));
});
test('an overlong or unsupported OCR result blocks practice but never saving the original',()=>{
 const s=songEditorState({title:'Lectura completa',hasFile:true,reviewed:true,sequenceText:Array(18).fill('Cdim').join(' | '),noteText:Array(129).fill('1:0').join(', ')});
 assert(s.canSaveOriginal);assert(!s.canSavePractice);
 assert(s.practiceReasons.some(r=>r.includes('18 acordes')));assert(s.practiceReasons.some(r=>r.includes('129 notas')));assert(s.practiceReasons.some(r=>r.includes('Cdim')));
});
test('save guidance identifies missing title, original and review separately',()=>{
 const s=songEditorState({sequenceText:'Em C G D'});
 assert.equal(s.originalReasons.length,2);assert.equal(s.practiceReasons.length,3);
 assert(!s.canSaveOriginal);assert(!s.canSavePractice);
});
test('valid reviewed practice saves against a new file or an already stored song',()=>{
 for(const original of [{hasFile:true},{songId:'song_existing'}]){
 const s=songEditorState({...original,title:'Ejercicio',reviewed:true,sequenceText:'Do | Lam | Sol7',noteText:'1:0, 2:1, 6:24'});
 assert(s.canSavePractice);assert.deepEqual(s.sequence,['C','Am','G7']);assert.equal(s.notes[2].string,5);
 }
});
test('malformed note tokens give a specific correction without disabling original storage',()=>{
 const s=songEditorState({title:'Notas',hasFile:true,reviewed:true,noteText:'7:2, 1:25, abc'});
 assert(s.badNotes);assert(!s.canSavePractice);assert(s.canSaveOriginal);assert(s.practiceReasons.some(r=>r.includes('cuerdas 1–6')));
});
test('recovered drafts preserve all edits and rhythm while asking to reattach a missing original',()=>{
 const draft={title:'Corregida',sequenceText:'Em | Am',noteText:'1:3',patternIndex:8,originalName:'mi-original.pdf',fileType:'application/pdf',durationText:'3, 3',fragments:[{name:'Estribillo'}]};
 const recovered=recoverSongDraft(JSON.parse(JSON.stringify(draft)));assert(recovered.requiresOriginal);
 for(const key of Object.keys(draft))assert.deepEqual(recovered[key],draft[key]);
 assert.equal(recoverSongDraft({...draft,songId:'song_existing'}).requiresOriginal,false);
 assert.equal(recoverSongDraft({patternIndex:999}).patternIndex,1);assert.equal(recoverSongDraft(null),null);
});
test('busy state prevents both save actions and content limits are inclusive',()=>{
 const input={title:'Límite',hasFile:true,reviewed:true,sequenceText:Array(16).fill('Em').join(' '),noteText:Array(128).fill('1:0').join(',')};
 assert(songEditorState(input).canSavePractice);assert(!songEditorState({...input,busy:true}).canSavePractice);assert(!songEditorState({...input,busy:true}).canSaveOriginal);
});
test('server save errors are readable even when a session error returns HTML',async()=>{
 await assert.rejects(songResponse(new Response('<html>login</html>',{status:401})),/sesión ha caducado/);
 await assert.rejects(songResponse(Response.json({error:'El archivo supera el límite'},{status:400})),/supera el límite/);
 assert.deepEqual(await songResponse(Response.json({song:{id:'saved'}})),{song:{id:'saved'}});
});
