import test from 'node:test';
import assert from 'node:assert/strict';
import {songTempoReference,tempoFromText,initialPracticeTempo} from './song-tempo.mjs';
import {rhythmCatalog} from './rhythms.mjs';
import {makeSongExercise} from './song-import.mjs';
import {speedPresets,expectedAttacks} from './practice-progression.mjs';

test('saved song tempos reach every practice variant without the former fixed 50 BPM',()=>{
 for(const tempo of [40,60,100,107,180])for(const kind of ['chords','tab','arpeggio']){
  const ex=makeSongExercise({id:'song_test',title:'Canción',updated:1,tempo,sequence:['Em','C'],notes:[{string:0,fret:0,midi:64}]},kind);
  assert.equal(ex.baseTempo,tempo);assert.equal(initialPracticeTempo(ex),tempo);
  const presets=speedPresets(ex);assert.equal(presets[2].bpm,tempo);
  assert(presets.every(p=>p.bpm>=40&&p.bpm<=tempo));
 }
 assert.deepEqual(speedPresets({baseTempo:55}).map(p=>p.bpm),[40,60,80]);
 assert.equal(initialPracticeTempo({baseTempo:55}),null);
});
test('100 BPM reference schedules attacks every 600 ms and 107 is retained exactly',()=>{
 const song={id:'s',title:'Canción',tempo:100,sequence:['Em'],notes:[]};
 const ex=makeSongExercise(song);assert.deepEqual(expectedAttacks(ex,rhythmCatalog[0].pattern,100),[0,.6,1.2,1.7999999999999998]);
 assert.deepEqual(speedPresets(makeSongExercise({...song,tempo:107})).map(p=>p.bpm),[64,86,107]);
});
test('reference lookup requires matching title AND artist, without overwriting a chosen live tempo',()=>{
 const ref=songTempoReference('¡Hay que vivir!','Joan Baptista Humet');assert.equal(ref.bpm,100);
 assert.equal(songTempoReference('Hay que vivir','Joan Bautista Humet').bpm,100);
 assert.equal(songTempoReference('Hay que vivir',''),null);
 assert.equal(songTempoReference('Hay que vivir','Otro artista'),null);
 const song={songId:'s',songTempo:107};assert.equal(initialPracticeTempo(song),107);
});
test('explicit document BPM is recognized; conflicting values and unrelated numbers are not inferred',()=>{
 for(const text of ['100 BPM','Tempo: 107','♩ = 100','100 ppm'])assert([100,107].includes(tempoFromText(text)));
 for(const text of ['4/4 22 acordes','100 BPM o 107 BPM','tempo: 999','1:0 2:3'])assert.equal(tempoFromText(text),null);
});
