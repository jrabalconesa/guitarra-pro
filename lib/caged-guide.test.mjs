import test from 'node:test';
import assert from 'node:assert/strict';
import {LESSONS,SHAPES,shapeNotes,OPEN,interval,makeCagedTab,zoneNotes} from './caged.mjs';
import {CAGED_GUIDE} from './caged-guide.mjs';

test('CAGED guided manual covers exactly all 18 canonical lessons without replacing them',()=>{
  assert.equal(LESSONS.length,18);
  assert.deepEqual(Object.keys(CAGED_GUIDE).sort(),LESSONS.map(l=>l.id).sort());
  for (const lesson of LESSONS){
    const guide=CAGED_GUIDE[lesson.id];
    assert(guide.why.length>35);
    assert(guide.example.length>45);
    assert.equal(guide.steps.length,3);
    assert(guide.steps.every(s=>s.length>=20));
    assert(guide.question.length>20);
    assert(guide.answer.length>15);
  }
});
test('CAGED major triads and the three-string examples use notes 1, 3, 5',()=>{
  for(const shape of Object.keys(SHAPES)){
    const notes=shapeNotes(0,shape);
    const pitchClasses=[...new Set(notes.map(n=>interval(n.midi,0)))].sort((a,b)=>a-b);
    assert.deepEqual(pitchClasses,[0,4,7]);
  }
  // 3rd-2nd-1st strings: C (0,1,0), F (2,1,1), G (4,3,3)
  for(const [root,frets] of [[0,[0,1,0]],[5,[2,1,1]],[7,[4,3,3]]]){
    const actual=frets.map((f,i)=>interval(OPEN[2-i]+f,root)).sort((a,b)=>a-b);
    assert.deepEqual(actual,[0,4,7]);
  }
});

test('tablatures match actual strings, frets, midi and valid scale tones across all tonalities',()=>{
 for(let root=0;root<12;root++)for(const shape of Object.keys(SHAPES))for(const quality of ['major','minor','7','maj7','m7'])for(const layer of ['chord','pent','scale']){
  const tab=makeCagedTab(root,shape,quality,layer);
  assert.equal(tab.lines.length,6);
  assert(tab.sequence.length>0&&tab.sequence.length<=8);
  const valid=zoneNotes(root,shape,layer,quality);
  for(let k=0;k<tab.sequence.length;k++){
   const note=tab.sequence[k];
   assert(valid.some(n=>n.string===note.string&&n.fret===note.fret&&n.midi===note.midi));
   assert.equal(note.midi,OPEN[note.string]+note.fret);
   const matches=tab.lines.map((row,s)=>({s,token:row.slice(2+3*k,2+3*k+3)})).filter(({token})=>/\\d/.test(token));
   assert.equal(matches.length,1);
   assert.equal(matches[0].s,note.string);
   assert.equal(Number(matches[0].token.replace(/-/g,'')),note.fret);
  }
 }
});
