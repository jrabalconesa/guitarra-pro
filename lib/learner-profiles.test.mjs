import test from 'node:test';
import assert from 'node:assert/strict';
import {learnerUserId,normalizeGuitarProfile,instrumentContext} from './learner-profiles.mjs';
import {profileKey} from './aia.mjs';
import {exportGuitar,guitarWrites} from './backup.mjs';
const id='12345678-1234-4123-8123-123456789abc';
test('legacy records keep the exact owner namespace; people never share a namespace',()=>{
 assert.equal(learnerUserId('owner','main'),'owner');
 assert.notEqual(learnerUserId('owner',id),learnerUserId('other',id));
 assert.notEqual(learnerUserId('owner',id),'owner');
 assert.throws(()=>learnerUserId('owner','../../other'));
});
test('legacy profile migrates guitars while retaining name, goal, time and active type',()=>{
 const p=normalizeGuitarProfile({name:'Jose',guitar:'Acústica',goal:'Arpegios',minutes:20});
 assert.equal(p.name,'Jose');assert.equal(p.minutes,20);assert.equal(p.goal,'Arpegios');assert.equal(p.instruments.length,3);assert.equal(instrumentContext(p).instrumentType,'Acústica');
});
test('switching guitars preserves AIA identity; changing person goals changes it',()=>{
 const p=normalizeGuitarProfile({name:'Jose'}),q=normalizeGuitarProfile({...p,activeInstrumentId:'guitar-2'});
 assert.equal(profileKey(p),profileKey(q));assert.notDeepEqual(instrumentContext(p),instrumentContext(q));assert.notEqual(profileKey(p),profileKey({...p,goal:'Otro objetivo'}));
});
test('instruments survive export and import without copying another owner',async()=>{
 const p=normalizeGuitarProfile({name:'Jose'});p.instruments[1].notes='Cuerdas nuevas';
 const copy=await exportGuitar([{id:'profile_owner',userId:'owner',kind:'profile',payload:JSON.stringify(p),createdAt:Date.now()}]);
 const writes=await guitarWrites([],copy,learnerUserId('other',id));assert.equal(writes.length,1);assert.deepEqual(JSON.parse(writes[0].payload),p);assert.equal(writes[0].userId,learnerUserId('other',id));
});
test('duplicate instrument identifiers and unsupported types are rejected',()=>{
 const p=normalizeGuitarProfile();assert.throws(()=>normalizeGuitarProfile({...p,instruments:[p.instruments[0],p.instruments[0]]}));assert.throws(()=>normalizeGuitarProfile({...p,instruments:[{...p.instruments[0],type:'invalid'}]}));
});
