import {MIN_TEMPO,MAX_TEMPO,normalizeTempo} from './playback-settings.mjs';

const key=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
// References belong to a named recording; they are suggestions, never edits to a saved song.
const references=[{title:'Hay que vivir',artists:['Joan Baptista Humet','Joan Bautista Humet'],bpm:100,recording:'Melancolía · 3:45',sourceName:'Tunebat',sourceUrl:'https://tunebat.com/Info/Hay-Que-Vivir-Joan-Baptista-Humet/73s0GG2v8ryXOvJmRgxOhn'}];
export function songTempoReference(title,artist){return references.find(r=>key(r.title)===key(title)&&r.artists.some(a=>key(a)===key(artist)))||null;}
export function tempoFromText(text){
 const values=[...String(text).matchAll(/\b(\d{2,3}(?:[.,]\d+)?)\s*(?:BPM|PPM)\b|(?:\btempo\s*[:=]|[♩♪]\s*=)\s*(\d{2,3}(?:[.,]\d+)?)/gi)].map(m=>Number((m[1]||m[2]).replace(',','.'))).filter(n=>n>=MIN_TEMPO&&n<=MAX_TEMPO);
 const unique=[...new Set(values)];return unique.length===1?unique[0]:null;
}
export function songTempoSearch(title,artist){return 'https://www.google.com/search?q='+encodeURIComponent([title,artist,'BPM tempo'].filter(Boolean).join(' '));}
export function initialPracticeTempo(ex){return ex?.songId&&Number(ex.songTempo)>0?normalizeTempo(ex.songTempo):null;}
