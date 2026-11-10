import test from 'node:test';
import assert from 'node:assert/strict';
import {chords} from './music.mjs';
import {rhythmCatalog,isRhythmRest,strumVoicing} from './rhythms.mjs';
import {RHYTHM_CHORDS,RHYTHM_PROGRESSIONS,rhythmAccompaniment,rhythmPreviewEvents} from './rhythm-accompaniment.mjs';

test('every rhythm has playable suggested chords and preserves its stable practice index',()=>{
 assert.deepEqual(Object.keys(RHYTHM_PROGRESSIONS).sort(),rhythmCatalog.map(r=>r.id).sort());
 for(const [index,r] of rhythmCatalog.entries())for(const mode of ['single','progression'])for(const symbol of RHYTHM_CHORDS){
  const {progression,exercise}=rhythmAccompaniment(r.id,mode,symbol);
  assert(progression.every(c=>chords[c]?.midi.length));
  assert.deepEqual(exercise.progression,mode==='single'?[symbol,symbol]:progression);
  assert.equal(exercise.patternIndex,index);assert.deepEqual(exercise.pattern,r.pattern);
 }
});
test('preview uses exactly the displayed chords and correct bar timing in 4/4, 3/4 and 6/8',()=>{
 for(const r of rhythmCatalog){
  const {progression}=rhythmAccompaniment(r.id,'progression');
  const events=rhythmPreviewEvents(r.id,'progression','Em',72);
  const attacks=r.pattern.filter(s=>!isRhythmRest(s)).length;
  assert.equal(events.length,progression.length*attacks);
  for(const e of events){
   assert.equal(e.chord,progression[e.bar]);
   assert(Math.abs(e.time-(e.bar*r.pattern.length+e.slot)*60/72/r.subdivision)<1e-9);
   assert.deepEqual(e.notes,strumVoicing(chords[e.chord],e.stroke));
  }
  assert(Math.abs(r.pattern.length/r.subdivision-r.beats)<1e-9);
 }
});
test('single chord previews respect the chosen chord including bass, partial strums and rests',()=>{
 for(const r of rhythmCatalog){const events=rhythmPreviewEvents(r.id,'single','D');
  assert(events.every(e=>e.chord==='D'&&!isRhythmRest(e.stroke)));
  for(const e of events){assert(e.notes.every(m=>chords.D.midi.includes(m)));if(e.stroke==='B')assert.deepEqual(e.notes,[chords.D.midi[0]]);if(e.stroke.includes('₃'))assert.equal(e.notes.length,3);if(e.stroke.startsWith('('))assert(e.muted);}
 }
});
test('invalid accompaniment choices fail without creating an unrelated exercise',()=>{
 assert.throws(()=>rhythmAccompaniment('missing'));
 assert.throws(()=>rhythmAccompaniment('pop','single','missing'));
 assert.throws(()=>rhythmAccompaniment('pop','missing'));
 assert.throws(()=>rhythmPreviewEvents('pop','single','Em',0));
});
