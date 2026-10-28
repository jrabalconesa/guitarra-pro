import {STRINGS,noteName} from './music.mjs';
export const TUNING=[...STRINGS].reverse().map((midi,i)=>({string:6-i,midi,name:noteName(midi),letter:['E','A','D','G','B','E'][i],octave:Math.floor(midi/12)-1,hz:440*2**((midi-69)/12)}));
export function signalLevel(buffer,gain=1){let square=0,peak=0;for(const x of buffer){square+=x*x;peak=Math.max(peak,Math.abs(x));}const rms=Math.sqrt(square/buffer.length);return {rms,peak,db:rms>0?20*Math.log10(rms):-100,percent:Math.max(0,Math.min(100,(20*Math.log10(rms||1e-5)+60)/.6)),clipped:peak>=.98};}
export function tunerReading(midi,selected='auto',reference=440){if(!Number.isFinite(midi))return null;const adjusted=midi-12*Math.log2(reference/440);const target=selected==='auto'?TUNING.reduce((a,b)=>Math.abs(adjusted-a.midi)<Math.abs(adjusted-b.midi)?a:b):TUNING.find(s=>s.string===Number(selected));if(!target)return null;const cents=(adjusted-target.midi)*100;return {target,cents,hz:440*2**((midi-69)/12),state:Math.abs(cents)<=5?'tuned':cents<0?'flat':'sharp'};}
export function classifyNote(pitch,target,clipped=false){if(clipped)return {state:'clipped',label:'Entrada demasiado alta',cents:null,percent:0};if(!pitch||pitch.midi===null||pitch.confidence<.88)return {state:'waiting',label:'Toca una nota clara',cents:null,percent:0};const cents=(pitch.midi-target)*100;return {state:Math.abs(cents)<35?'correct':Math.abs(cents)<65?'near':'wrong',label:Math.abs(cents)<35?'Nota correcta':Math.abs(cents)<65?'Casi: ajusta la afinación':'Revisa cuerda y traste',cents,percent:Math.max(0,Math.round(100-Math.abs(cents)))};}
// A note is accepted only after stable evidence. Silence or a new attack is required for repeated targets.
export class NoteFollower{
 constructor(targets,{hold=.24,tolerance=.35}={}){this.targets=targets;this.hold=hold;this.tolerance=tolerance;this.index=0;this.goodSince=null;this.wrongSince=null;this.wrong=false;this.needsRelease=false;this.results=[];this.errors=0;}
 update(pitch,t,{attack=false,clipped=false}={}){if(this.index>=this.targets.length)return {done:true,index:this.index,progress:1};const target=this.targets[this.index],midi=typeof target==='number'?target:target.midi;const clear=pitch?.midi!==null&&Number.isFinite(pitch?.midi)&&pitch.confidence>=.9&&!clipped;
 if(!clear){this.goodSince=null;this.wrongSince=null;this.needsRelease=false;return {index:this.index,progress:0};}
 const previous=this.results[this.results.length-1]?.expected;if(previous!==undefined&&previous!==midi&&Math.abs(pitch.midi-previous)<this.tolerance&&!attack){this.goodSince=null;return {index:this.index,progress:0};}
 if(this.needsRelease&&!attack)return {index:this.index,progress:0};
 if(attack)this.needsRelease=false;
 if(Math.abs(pitch.midi-midi)>this.tolerance){this.goodSince=null;if(this.wrongSince===null)this.wrongSince=t;if(t-this.wrongSince>.18)this.wrong=true;return {index:this.index,progress:0};}
 this.wrongSince=null;if(this.goodSince===null)this.goodSince=t;const progress=Math.min(1,(t-this.goodSince)/this.hold);if(progress<1)return {index:this.index,progress};
 const result={expected:midi,heard:Math.round(pitch.midi),correct:true,firstTry:!this.wrong,cents:Math.round((pitch.midi-midi)*100),timingMs:null};this.results.push(result);if(this.wrong)this.errors++;this.index++;const next=this.targets[this.index],nextMidi=typeof next==='number'?next:next?.midi;this.needsRelease=nextMidi===midi;this.goodSince=null;this.wrongSince=null;this.wrong=false;return {index:this.index,progress:0,accepted:true,done:this.index>=this.targets.length};
 }
 summary(){const completed=this.results.length,first=this.results.filter(r=>r.firstTry).length,coverage=Math.round(100*completed/this.targets.length);return {mode:'free',score:completed?Math.round(100*first/completed):0,pitchScore:completed?Math.round(100*first/completed):0,rhythmScore:null,timingCoverage:null,coverage,reliable:coverage>=65&&completed>=Math.min(3,this.targets.length),bins:this.results,completed,total:this.targets.length};}
}
export function chordTargets(progression,chords,loops=1){return Array.from({length:loops},()=>progression).flat().flatMap((symbol,chordIndex)=>{const chord=chords[symbol];let i=0;return chord.frets.flatMap((fret,s)=>fret<0?[]:[{midi:chord.midi[i++],string:6-s,fret,symbol,chordIndex}]);});}

// Sequential standard tuning. A fresh stable target is required after every advance.
export class TuningSequence {
 constructor(){this.reset();}
 reset(){this.index=0;this.completed=[];this.goodSince=null;this.lastTime=null;}
 pause(){this.goodSince=null;this.lastTime=null;}
 get target(){return TUNING[Math.min(this.index,5)];}
 update(frame,time,reference=440){
  if(this.index>=6)return this.snapshot();
  const reading=Number.isFinite(frame?.midi)&&frame.confidence>=.9&&!frame.clipped?tunerReading(frame.midi,String(this.target.string),reference):null;
  if(this.lastTime!==null&&(time-this.lastTime>.2||time<this.lastTime))this.goodSince=null;
  this.lastTime=time;
  if(reading?.state!=='tuned'){this.goodSince=null;return this.snapshot();}
  if(this.goodSince===null)this.goodSince=time;
  if(time-this.goodSince>=.75){this.completed.push(this.target.string);this.index++;this.goodSince=null;}
  return this.snapshot();
 }
 snapshot(){return {completed:[...this.completed],target:this.target,done:this.index>=6};}
}
