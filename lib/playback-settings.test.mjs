import test from 'node:test';
import assert from 'node:assert/strict';
import {MIN_TEMPO,MAX_TEMPO,METRONOME_PEAK,METRONOME_DECAY,normalizeTempo,validatePracticeTempo} from './playback-settings.mjs';
import {rhythmCatalog} from './rhythms.mjs';
import {rhythmPreviewEvents} from './rhythm-accompaniment.mjs';
import {expectedAttacks} from './practice-progression.mjs';
import {rhythmAccompaniment} from './rhythm-accompaniment.mjs';

test('custom practice accepts 40 through 180 including one-BPM increments',()=>{
 assert.equal(MIN_TEMPO,40);assert.equal(MAX_TEMPO,180);
 for(let bpm=40;bpm<=180;bpm++){assert.doesNotThrow(()=>validatePracticeTempo(bpm));assert.equal(normalizeTempo(bpm),bpm);}
 for(const invalid of [39,181,Infinity,NaN,undefined,'180'])assert.throws(()=>validatePracticeTempo(invalid));
});
test('restoring or importing a high tempo keeps 180 and bounds invalid values',()=>{
 assert.equal(normalizeTempo('180'),180);assert.equal(normalizeTempo(250),180);assert.equal(normalizeTempo(20),40);assert.equal(normalizeTempo(undefined),60);assert.equal(normalizeTempo('bad',40),40);
});
test('metronome clicks have higher peak and duration without overlapping at 180 BPM',()=>{
 assert(METRONOME_PEAK>.5&&METRONOME_PEAK<1);
 assert(METRONOME_DECAY>.065);assert(METRONOME_DECAY+.02<60/MAX_TEMPO);
});
test('every rhythm schedules correct pulses at maximum tempo in its own meter',()=>{
 for(const r of rhythmCatalog){
  const {exercise}=rhythmAccompaniment(r.id,'progression');
  const attacks=expectedAttacks(exercise,r.pattern,180,1);assert(attacks.length>0);
  const preview=rhythmPreviewEvents(r.id,'progression','Em',180);
  for(let i=1;i<preview.length;i++)assert(preview[i].time>preview[i-1].time);
  const barSeconds=r.beats*60/180;
  for(const e of preview)assert(Math.abs(e.time-(e.bar*barSeconds+e.slot*60/180/r.subdivision))<1e-8);
 }
});

test('audio engine routes the louder click around the example compressor into the output limiter',async()=>{
 const {readFileSync}=await import('node:fs');const {runInNewContext}=await import('node:vm');
 const source=readFileSync(new URL('../app/audio-engine.tsx',import.meta.url),'utf8');
 const created=[],param=()=>({value:0,setValueAtTime(v){this.value=v},linearRampToValueAtTime(v,t){this.peak={v,t}},exponentialRampToValueAtTime(v,t){this.end={v,t}}});
 const node=()=>({connections:[],connect(n){this.connections.push(n)},disconnect(){}});
 class Context{constructor(){this.currentTime=1;this.destination=node();}
  createGain(){const n={...node(),gain:param()};created.push(n);return n;}
  createDynamicsCompressor(){const n={...node(),threshold:param(),knee:param(),ratio:param(),attack:param(),release:param()};created.push(n);return n;}
  createOscillator(){const n={...node(),frequency:param(),start(t){this.started=t},stop(t){this.stopped=t}};created.push(n);return n;}
  async resume(){}
 }
 const engine={current:{ctx:null,sources:[]}},settings={current:{volume:1,exampleBoost:2,metronomeVolume:.9}};
 const body=source.slice(source.indexOf(' async function output()'),source.indexOf(' function tone(')).replaceAll('(window as any)','window');
 const click=source.slice(source.indexOf(' function metronome('),source.indexOf(' function later(')).replaceAll(':number','');
 const sandbox={engine,settings,window:{AudioContext:Context},METRONOME_PEAK,METRONOME_DECAY};
 const api=runInNewContext(body+click+';({output,metronome})',sandbox);await api.output();
 const e=engine.current,exampleCompressor=e.master.connections[0],limiter=e.clickMaster.connections[0];
 assert.notEqual(limiter,exampleCompressor);assert.equal(exampleCompressor.connections[0],limiter);assert.equal(limiter.connections[0],e.ctx.destination);assert.equal(limiter.threshold.value,-.5);
 api.metronome(2,true);const oscillator=e.sources[0],envelope=oscillator.connections[0];
 assert.equal(envelope.connections[0],e.clickMaster);assert.equal(oscillator.frequency.value,1650);assert.equal(envelope.gain.peak.v,.95);assert.equal(envelope.gain.end.t,2.18);api.metronome(3,false);assert.equal(e.sources[1].frequency.value,1250);assert(oscillator.stopped<2+60/180);
});
