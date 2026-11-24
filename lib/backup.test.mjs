import {test} from 'node:test';import assert from 'node:assert/strict';import {exportGuitar,guitarWrites,validateGuitar} from './backup.mjs';
const userId='user-secret',row={id:'profile_'+userId,userId,kind:'profile',createdAt:1700000000000,payload:JSON.stringify({name:'Jose',minutes:10,guitar:'Española'})};
test('portable backup removes account identity and preserves date',async()=>{const b=await exportGuitar([row]);assert.equal(JSON.stringify(b).includes(userId),false);const writes=await guitarWrites([],JSON.parse(JSON.stringify(b)),'target');assert.equal(writes[0].createdAt,row.createdAt);assert.equal(writes[0].id,'profile_target');assert.equal((await guitarWrites([row],b,userId)).length,0);});
test('workspace arrays are portable',async()=>{const b=await exportGuitar([{...row,kind:'workspace',id:'workspace_favourites_'+userId,payload:'["si"]'}]);assert.deepEqual(b.records[0].payload,['si']);});
test('other apps and unsafe payloads are rejected',()=>{assert.throws(()=>validateGuitar({app:'piano-pro',version:1,records:[]}));assert.throws(()=>validateGuitar({app:'guitarra-pro',version:1,records:[{key:'profile',kind:'profile',createdAt:1,payload:{name:'x',minutes:-1}}]}));});
test('legacy profile rows export the newest profile and preserve all historical values without changing source rows',async()=>{
 const rows=Array.from({length:13},(_,i)=>({...row,id:'legacy-'+i,createdAt:row.createdAt+i,payload:JSON.stringify({name:'Jose '+i,minutes:10,guitar:'Española'})}));
 const original=JSON.stringify(rows),backup=await exportGuitar(rows);
 assert.equal(backup.records.length,1);assert.equal(backup.archivedRecords.length,12);
 assert.equal(backup.records[0].payload.name,'Jose 12');assert.equal(JSON.stringify(rows),original);
 assert.equal(JSON.stringify(backup).includes(userId),false);
 assert.deepEqual([...backup.records,...backup.archivedRecords].map(r=>r.createdAt).sort(),rows.map(r=>r.createdAt).sort());
 assert.deepEqual((await exportGuitar([...rows].reverse())).records,backup.records);
 const writes=await guitarWrites([],JSON.parse(JSON.stringify(backup)),'target');
 assert.equal(writes.length,1);assert.equal(JSON.parse(writes[0].payload).name,'Jose 12');
});
test('a stale AIA session is preserved in full alongside historical profiles',async()=>{
 const payload={revision:2,completed:[],settings:{minutes:10},session:{profileKey:{name:'Earlier profile'},steps:[{description:'x'.repeat(4000)}]},adaptations:{retained:true}};
 const backup=await exportGuitar([row,{...row,id:'older',createdAt:row.createdAt-1},{...row,id:'aia_'+userId,kind:'aia',payload:JSON.stringify(payload)}]);
 assert.deepEqual(backup.records.find(r=>r.kind==='aia').payload,payload);
 assert.equal(backup.archivedRecords.length,1);
 assert.equal((await guitarWrites([],JSON.parse(JSON.stringify(backup)),'target')).length,2);
});
