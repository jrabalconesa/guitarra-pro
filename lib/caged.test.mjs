import test from 'node:test';
import assert from 'node:assert/strict';
import {OPEN,SHAPES,QUALITY,LESSONS,shapeNotes,zoneNotes,interval,makeExercise,cagedFromId} from './caged.mjs';
test('C major has the five canonical CAGED voicings and common notes',()=>{
 const expected={C:[-1,3,2,0,1,0],A:[-1,3,5,5,5,3],G:[8,7,5,5,5,8],E:[8,10,10,9,8,8],D:[-1,-1,10,12,13,12]};
 for(const [shape,frets] of Object.entries(expected)){const actual=Array(6).fill(-1);for(const n of shapeNotes(0,shape))actual[5-n.string]=n.fret;assert.deepEqual(actual,frets);}
 const names=Object.keys(SHAPES);for(let i=0;i<4;i++){const a=shapeNotes(0,names[i]),b=shapeNotes(0,names[i+1]);assert(a.some(n=>b.some(m=>n.string===m.string&&n.fret===m.fret)));}
});
test('all keys, shapes, qualities and layers have legal notes and correct intervals',()=>{
 for(let root=0;root<12;root++)for(const shape of Object.keys(SHAPES))for(const quality of Object.keys(QUALITY))for(const layer of ['chord','pent','scale']){
 const ns=zoneNotes(root,shape,layer,quality);assert(ns.length>0);const minor=['minor','m7'].includes(quality),mask=layer==='chord'?QUALITY[quality]:layer==='pent'?(minor?[0,3,5,7,10]:[0,2,4,7,9]):minor?[0,2,3,5,7,8,10]:[0,2,4,5,7,9,11];
 for(const n of ns){assert(n.fret>=0&&n.fret<=15);assert.equal(n.midi,OPEN[n.string]+n.fret);assert(mask.includes(interval(n.midi,root)));}assert(ns.some(n=>interval(n.midi,root)===0));
 }
});
test('every configured lesson is reconstructible by the authenticated attempt API',()=>{
 assert.equal(LESSONS.length,18);
 for(const l of LESSONS)for(let r=0;r<12;r++)for(const s of Object.keys(SHAPES))for(const q of Object.keys(QUALITY)){
 const ex=makeExercise(l,r,s,q);assert(ex.notes.length>0&&ex.notes.length<=16);assert.deepEqual(cagedFromId(ex.id),ex);for(const n of ex.notes)assert(n.fret>=0&&n.fret<=15&&n.midi===OPEN[n.string]+n.fret);if(l.kind==='roots')assert(ex.notes.every(n=>interval(n.midi,r)===0));if(l.kind==='triad')assert(ex.notes.every(n=>n.string<3));
 }
 assert.equal(cagedFromId('caged-1-1-12-C-major'),null);assert.equal(cagedFromId('caged-9-9-0-C-major'),null);assert.equal(cagedFromId(null),null);
});
