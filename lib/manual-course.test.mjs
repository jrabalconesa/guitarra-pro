import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {MANUAL_ITEMS,MANUAL_PAGES,MANUAL_PLAN,manualExercise,effectiveManualTempo,emptyManualState,validManualState,mergeManualState,manualRecommendation} from './manual-course.mjs';
import {validWorkspaceValue} from './workspace-state.mjs';
import {exportGuitar,guitarWrites} from './backup.mjs';
import {speedPresets} from './practice-progression.mjs';
import {GUITAR_SAMPLE_NOTES,nearestGuitarSample} from './guitar-samples.mjs';
test('all 258 audio references and PDF page destinations exist, including the five songs',()=>{
 assert.equal(MANUAL_ITEMS.length,86);assert.equal(MANUAL_PAGES.length,214);assert.equal(new Set(MANUAL_ITEMS.map(i=>i.id)).size,86);let files=0;
 for(const i of MANUAL_ITEMS){assert(i.page>=1&&i.page<=214);assert.equal(MANUAL_PAGES[i.page-1].printed,Number(i.printed.split('–')[0]));for(const v of [60,80,100]){assert(fs.statSync('public'+i.audio[v]).size>10000);files++;}}
 assert.equal(files,258);assert.equal(MANUAL_ITEMS.find(i=>i.id==='manual-song-1').page,207);
});
test('percentages preserve actual slow tempos and do not reinterpret 100 as BPM',()=>{
 const song=MANUAL_ITEMS.find(i=>i.id==='manual-song-1');assert.equal(effectiveManualTempo(song,60),43.2);assert.equal(effectiveManualTempo(song,80),57.6);assert.equal(effectiveManualTempo(song,100),72);
 const ex=manualExercise('manual-GP_U17');assert.deepEqual(speedPresets(ex).map(p=>p.bpm),[36,48,60]);assert.deepEqual(ex.notes.map(n=>n.midi),[40,52,64]);assert.equal(manualExercise('manual-song-1'),null);assert.equal(manualExercise('not-an-exercise'),null);
 assert.equal(MANUAL_ITEMS.filter(i=>i.pitchReady).length,47);for(const i of MANUAL_ITEMS.filter(i=>i.pitchReady)){const ex=manualExercise(i.id);assert.equal(ex.notes.length,3);ex.notes.forEach(n=>assert.equal(n.midi,[64,59,55,50,45,40][n.string]+n.fret));}
});
test('manual merge retains independent sessions and earlier read marks without changing old course data',async()=>{
 const a=emptyManualState(),b=emptyManualState();a.updated=10;a.read[a.lastId]='2026-11-23';b.updated=20;b.page=207;b.lastId='manual-song-1';b.entries=[{id:'session-1',itemId:b.lastId,date:Date.now(),speed:60,self:'hard',minutes:10,note:'Repetir el salto'}];
 const m=mergeManualState(a,b);assert(validManualState(m));assert.equal(m.page,207);assert.equal(m.read[a.lastId],'2026-11-23');assert.equal(m.entries.length,1);assert.equal(mergeManualState(m,b).entries.length,1);assert(validWorkspaceValue('manual',m));assert(!validWorkspaceValue('manual',{...m,page:215}));assert(!validWorkspaceValue('manual',{...m,entries:[{...b.entries[0],self:'measured'}]}));
 const now=Date.now();const rows=[{id:'workspace_manual_u',userId:'u',kind:'workspace',createdAt:now,payload:JSON.stringify(m)},{id:'workspace_course_u',userId:'u',kind:'workspace',createdAt:now,payload:JSON.stringify({'0':'consolidado:2026-11-23'})}];const copy=await exportGuitar(rows);const writes=await guitarWrites([],copy,'v');assert.equal(writes.length,2);assert(writes.some(x=>x.id==='workspace_manual_v'));assert(writes.some(x=>JSON.parse(x.payload)['0']==='consolidado:2026-11-23'));
});
test('AIA recommendations distinguish difficult self-assessment from measured note outcomes',()=>{
 const state=emptyManualState();state.entries=[{itemId:'manual-song-3',self:'hard',date:Date.now()}];assert.equal(manualRecommendation(state).id,'manual-song-3');assert.equal(manualRecommendation(state).speed,60);state.entries=[];const rec=manualRecommendation(state,[{exerciseId:'manual-GP_U17',reliable:true,date:Date.now(),pitchScore:50,coverage:100}]);assert.equal(rec.id,'manual-GP_U17');assert(rec.reason.includes('intento utilizable'));assert.equal(MANUAL_PLAN.length,28);for(const day of MANUAL_PLAN)assert(MANUAL_ITEMS.some(x=>x.id===day.id));
});
test('recorded guitar samples cover standard tuning and all normal study pitches',()=>{
 const m=JSON.parse(fs.readFileSync('public/guitar-samples/manifest.json'));assert.equal(m.license,'CC0-1.0');assert.equal(m.samples.length,GUITAR_SAMPLE_NOTES.length);
 for(const note of GUITAR_SAMPLE_NOTES)assert(fs.statSync('public/guitar-samples/'+note+'.mp3').size>1000);
 for(let n=40;n<=84;n++)assert(Math.abs(n-nearestGuitarSample(n))<=1);
 const s=fs.readFileSync('app/audio-engine.tsx','utf8');const tone=s.slice(s.indexOf(' function tone('),s.indexOf(' function metronome('));assert(!tone.includes('createOscillator'));assert(!tone.includes('Math.random'));assert(tone.includes('createBufferSource'));assert(tone.includes('source.playbackRate.value=rate'));
});
