import test from 'node:test';import assert from 'node:assert/strict';import {speedPresets,speedProgress,TimingTracker,AttackTracker,distinctAttempts,expectedAttacks} from './practice-progression.mjs';
const context={exerciseId:'melodia-1',patternIndex:null,loops:1,speedTier:'slow',tempo:40};const win=i=>({...context,id:'a'+i,attemptId:'u'+i,date:5000*i,mode:'timed',engineVersion:'3.0',reliable:true,score:95,pitchScore:100,rhythmScore:88,coverage:100});
test('three consecutive wins promote slow then medium; fast finishes without another tier',()=>{assert.equal(speedProgress([win(2),win(1)],context).next,null);assert.equal(speedProgress([win(3),win(2),win(1)],context).next,'medium');const mid={...context,speedTier:'medium',tempo:60};assert.equal(speedProgress([3,2,1].map(i=>({...win(i),...mid})),mid).next,'fast');const fast={...context,speedTier:'fast',tempo:80};assert.equal(speedProgress([3,2,1].map(i=>({...win(i),...fast})),fast).mastered,true);});
test('failed, unreliable or changed settings break the run; duplicates never count twice',()=>{assert.equal(speedProgress([win(3),{...win(2),rhythmScore:60},win(1)],context).streak,1);assert.equal(speedProgress([win(3),win(3),win(1)],context).streak,2);assert.equal(speedProgress([win(3),{...win(2),reliable:false},win(1)],context).streak,1);assert.equal(speedProgress([{...win(4),speedTier:'medium'},win(3),win(2),win(1)],context).streak,0);assert.equal(speedProgress([{...win(3),mode:'free'},win(2)],context).streak,1);});
test('presets are ordered and specific to the exercise, old duplicate metrics do not form a streak',()=>{assert.deepEqual(speedPresets({baseTempo:55}).map(x=>x.bpm),[40,60,80]);const old={...win(1),attemptId:undefined,engineVersion:'2.0'};assert.equal(distinctAttempts([{...old,id:'x',date:1000},{...old,id:'y',date:1800}]).length,1);assert.equal(speedProgress([old,old,old],context).streak,0);});
test('timing retains signed offsets, one event per target, and applies latency compensation',()=>{const t=new TimingTracker([0,1,2],60);assert.equal(t.accept(-.2).direction,'early');assert.equal(t.accept(1.01).direction,'onTime');assert.equal(t.accept(2.24).direction,'late');assert.equal(t.summary().timingEarly,1);assert.equal(t.summary().timingLate,1);assert.equal(t.summary().rhythmScore,33);assert.equal(t.accept(2.25),null);const compensated=new TimingTracker([0],60,200);assert.equal(compensated.accept(.2).direction,'onTime');});
test('attack tracker times pitch changes and repeated strikes, never sustained frames or clipping',()=>{const a=new AttackTracker();const f={midi:64,confidence:.99,clipped:false,attack:false};assert.equal(a.observe(f,0),null);assert.equal(a.observe(f,.05),0);assert.equal(a.observe(f,.5),null);assert.equal(a.observe({...f,attack:true},1),1);assert.equal(a.observe({...f,attack:true,clipped:true},2),null);});
test('every arrow creates an expected strum, rests do not',()=>{const ex={skill:'acompanamiento'};assert.equal(expectedAttacks(ex,['↓','—','↓','—','↓','—','↓','—'],60,1).length,16);});
import {attemptStorageId} from './practice-progression.mjs';
test('idempotency key is stable and isolated per authenticated person',async()=>{const a=await attemptStorageId('person-a','same-uuid'),b=await attemptStorageId('person-b','same-uuid');assert.equal(a,await attemptStorageId('person-a','same-uuid'));assert.notEqual(a,b);assert.match(a,/^attempt_[a-f0-9]{64}$/);});
import {EnergyAttackTracker,minimumAttackInterval,timingPercentages} from './practice-progression.mjs';
test('timing percentages exclude extras and omissions and survive empty attempts',()=>{
 const t=new TimingTracker([0,1,2,3,4],60);[-.2,1,2.2,3,.51].forEach(at=>t.accept(at));const s=t.summary();
 assert.equal(s.extra,1);assert.equal(s.timingMissing,1);assert.deepEqual(timingPercentages(s),{early:25,onTime:50,late:25});
 assert.equal(s.timingEarlyPercent+s.timingOnTimePercent+s.timingLatePercent,100);
 assert.deepEqual(timingPercentages({}),{early:0,onTime:0,late:0});assert.equal(new TimingTracker([],180).summary().timingMeanMs,null);
 const thirds=timingPercentages({timingEarly:1,timingOnTime:1,timingLate:1,extra:20});assert.ok(Math.abs(thirds.early+thirds.onTime+thirds.late-100)<=.11);
});
for(const bpm of [40,60,100,137,180])for(const subdivision of [1,2,4])for(const pitchBased of [false,true])test(`attacks and duplicate rejection at ${bpm} BPM subdivision ${subdivision} pitch ${pitchBased}`,()=>{
 const gap=60/bpm/subdivision,expected=Array.from({length:16},(_,i)=>i*gap),a=new AttackTracker(pitchBased,minimumAttackInterval(expected,bpm)),t=new TimingTracker(expected,bpm,25);
 expected.forEach((at,i)=>{const frame={midi:i%2?64:67,confidence:.99,clipped:false,attack:true};const onset=a.observe(frame,at+.025);assert.notEqual(onset,null);t.accept(onset);assert.equal(a.observe(frame,at+.045),null);});
 assert.equal(t.summary().timingOnTime,16);assert.equal(t.summary().extra,0);assert.equal(t.summary().timingMissing,0);assert.equal(t.summary().timingMeanMs,0);
});
test('repeated notes require new attacks and unstable pitch and clipping are ignored',()=>{
 const a=new AttackTracker(true,1/12),f={midi:64,confidence:.99,attack:true};[0,1/12,2/12,3/12].forEach(at=>assert.equal(a.observe(f,at),at));
 assert.equal(a.observe({...f,attack:false},1),null);assert.equal(a.observe({...f,confidence:.7},1.1),null);assert.equal(a.observe({...f,clipped:true},1.2),null);
});
test('energy rise is rearmed only after decay, preserving rapid repeated strikes',()=>{
 const a=new EnergyAttackTracker();assert.equal(a.observe(.001,0,.003),false);assert.equal(a.observe(.02,.02,.003),true);
 assert.equal(a.observe(.029,.04,.003),false);assert.equal(a.observe(.04,.08,.003),false);
 assert.equal(a.observe(.005,.1,.003),false);assert.equal(a.observe(.025,.12,.003),true);
});
test('rests are omitted from targets and muted strokes remain attacks',()=>{
 const ex={skill:'acompanamiento',progression:['Em']},pattern=['↓','—','(↓)','—','↑','S','↓','—'];const targets=expectedAttacks(ex,pattern,180);
 assert.equal(targets.length,4);assert.equal(minimumAttackInterval(targets,180),1/3);const t=new TimingTracker(targets,180);targets.slice(0,-1).forEach(x=>t.accept(x));assert.equal(t.summary().timingMissing,1);
});
