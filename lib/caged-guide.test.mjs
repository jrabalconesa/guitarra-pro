import test from 'node:test';
import assert from 'node:assert/strict';
import {LESSONS,SHAPES,shapeNotes,OPEN,interval} from './caged.mjs';
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
