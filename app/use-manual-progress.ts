'use client';
import {profileFetch as fetch} from '../lib/profile-fetch';
import {useEffect,useRef,useState} from 'react';
import {emptyManualState,validManualState,mergeManualState} from '../lib/manual-course.mjs';
import {accountStorageKey,readLocal,writeLocal} from '../lib/client-storage.mjs';
export function useManualProgress(accountKey:string){
 const [state,setState]=useState<any>(emptyManualState),[ready,setReady]=useState(false),[notice,setNotice]=useState('');const latest=useRef<any>(state),identity=useRef(accountKey),queue=useRef(Promise.resolve()),revision=useRef(0);identity.current=accountKey;
 useEffect(()=>{let live=true;setReady(false);revision.current=0;const local=readLocal(accountStorageKey(accountKey,'manual'));const initial=validManualState(local)?local:emptyManualState();latest.current=initial;setState(initial);if(!accountKey){setNotice('Inicia sesión para conservar tu recorrido.');return;}
 void fetch('/api/workspace',{cache:'no-store'}).then(async r=>{if(!r.ok)throw Error();const d:any=await r.json();if(!live)return;const merged=mergeManualState(initial,d.data?.manual);latest.current=merged;setState(merged);writeLocal(accountStorageKey(accountKey,'manual'),merged);setNotice('Recorrido recuperado.');}).catch(()=>{if(live)setNotice('Sin conexión: se conserva la copia de este dispositivo.');}).finally(()=>{if(live)setReady(true)});return()=>{live=false};},[accountKey]);
 function update(patch:any){if(accountKey&&!ready)return;const next={...latest.current,...patch,updated:Date.now()};if(!validManualState(next))return;latest.current=next;setState(next);if(!accountKey)return;const local=writeLocal(accountStorageKey(accountKey,'manual'),next);setNotice(local?'Conservado en este dispositivo; sincronizando…':'Sincronizando con tu cuenta…');const rev=++revision.current,owner=accountKey;
 queue.current=queue.current.catch(()=>{}).then(async()=>{if(identity.current!==owner)return;try{const r=await fetch('/api/workspace',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'manual',value:next})});if(!r.ok)throw Error();if(identity.current===owner&&revision.current===rev)setNotice('Recorrido guardado en tu cuenta.');}catch{if(identity.current===owner&&revision.current===rev)setNotice(local?'Guardado en este dispositivo; pendiente de sincronizar. Pulsa Reintentar.':'No se pudo guardar. Mantén abierta la página y pulsa Reintentar.');}});
 }
 return {state,ready,notice,update,retry:()=>update({})};
}
