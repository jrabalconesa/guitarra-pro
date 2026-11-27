import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';

test('the original viewer requests the active learner and surfaces missing originals',async t=>{
 const keys=['window','location','sessionStorage'];
 const previous=keys.map(key=>Object.getOwnPropertyDescriptor(globalThis,key));
 t.after(()=>keys.forEach((key,i)=>previous[i]?Object.defineProperty(globalThis,key,previous[i]):delete globalThis[key]));
 let active='main',missing=false;const requests=[];
 globalThis.sessionStorage={setItem(_key,value){active=value},getItem(){return active}};
 globalThis.location={href:'https://local.test/guitarra-pro/',origin:'https://local.test'};
 globalThis.window={fetch:async(input,init)=>{requests.push({url:String(input),learner:init.headers.get('X-Guitar-Profile')});return new Response('original-test-only',{status:missing?404:200})}};
 const source=stripTypeScriptTypes(readFileSync(new URL('../lib/profile-fetch.ts',import.meta.url),'utf8')).replace("'./learner-profiles.mjs'",JSON.stringify(new URL('../lib/learner-profiles.mjs',import.meta.url).href));
 const moduleURL='data:text/javascript;base64,'+Buffer.from(source).toString('base64');
 const {selectLearner}=await import(moduleURL);
 const viewer=stripTypeScriptTypes(readFileSync(new URL('./original-preview.ts',import.meta.url),'utf8')).replace("'../lib/profile-fetch'",JSON.stringify(moduleURL));
 const {originalPreview}=await import('data:text/javascript;base64,'+Buffer.from(viewer).toString('base64'));
 for(const learner of ['main','12345678-1234-4123-8123-123456789abc']){
  selectLearner(learner);const url=await originalPreview('song_test');
  try{assert.equal(await (await fetch(url)).text(),'original-test-only')}finally{URL.revokeObjectURL(url)}
  assert.deepEqual(requests.at(-1),{url:'/api/songs?id=song_test&original=1',learner});
 }
 missing=true;await assert.rejects(originalPreview('song_missing'),/No se pudo abrir el archivo original/);
});
