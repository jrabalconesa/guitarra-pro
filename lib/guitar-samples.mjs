// FreePats Spanish classical guitar, recorded samples, CC0. See public/guitar-samples/manifest.json.
export const GUITAR_SAMPLE_NOTES=[40,41,43,45,47,48,50,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84];
const banks=new WeakMap();
export function nearestGuitarSample(midi){return GUITAR_SAMPLE_NOTES.reduce((a,b)=>Math.abs(b-midi)<Math.abs(a-midi)?b:a,GUITAR_SAMPLE_NOTES[0]);}
export async function loadGuitarSamples(context){
 if(banks.has(context))return banks.get(context);
 const pending=Promise.all(GUITAR_SAMPLE_NOTES.map(async midi=>{const response=await fetch('/guitar-samples/'+midi+'.mp3');if(!response.ok)throw Error('No se pudo cargar el banco de guitarra. Comprueba tu conexión y vuelve a escuchar.');return [midi,await context.decodeAudioData(await response.arrayBuffer())];})).then(entries=>new Map(entries));
 banks.set(context,pending);try{return await pending}catch(error){banks.delete(context);throw error}
}
