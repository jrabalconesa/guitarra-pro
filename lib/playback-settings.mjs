export const MIN_TEMPO=40;
export const MAX_TEMPO=180;
export const METRONOME_PEAK=.9;
export const METRONOME_DECAY=.1;
export function normalizeTempo(value,fallback=60){const n=Number(value);return Math.max(MIN_TEMPO,Math.min(MAX_TEMPO,Number.isFinite(n)&&n>0?n:fallback));}
export function validatePracticeTempo(value){if(!Number.isFinite(value)||value<MIN_TEMPO||value>MAX_TEMPO)throw Error('Tempo no válido');}
