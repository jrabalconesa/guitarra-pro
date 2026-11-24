'use client';
import {profileFetch as fetch} from '../lib/profile-fetch';
import {useEffect,useRef,useState} from 'react';
import {mergeFretboard,validFretboardState} from '../lib/fretboard.mjs';
export function useFretboardProgress(){
 const [state,setState]=useState<any>({events:[]}),[ready,setReady]=useState(false),[status,setStatus]=useState('Cargando retos guardados…'),[failed,setFailed]=useState(false);
 const pending=useRef<any[]>([]),working=useRef(false),alive=useRef(true),loaded=useRef(false);
 async function load(){try{const r=await fetch('/api/workspace',{cache:'no-store'});if(!r.ok)throw Error();const d:any=await r.json(),v=validFretboardState(d.data?.fretboard)?d.data.fretboard:{events:[]};if(alive.current){setState(v);setReady(true);setFailed(false);setStatus('Retos conectados a tu cuenta.');loaded.current=true;}}catch{if(alive.current){setFailed(true);setStatus('No se pudieron recuperar los retos. Reintenta antes de responder.');}}}
 useEffect(()=>{alive.current=true;void load();return()=>{alive.current=false}},[]);
 async function flush(){if(working.current||!loaded.current)return;working.current=true;try{while(pending.current.length){const batch=pending.current.slice();const r=await fetch('/api/workspace',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:'fretboard',value:{events:batch}})});if(!r.ok)throw Error();const d:any=await r.json();pending.current=pending.current.filter(e=>!batch.some(x=>x.id===e.id));if(alive.current){if(validFretboardState(d.value))setState((v:any)=>mergeFretboard(v,d.value));setFailed(false);setStatus('Retos guardados en tu cuenta.');}}}catch{if(alive.current){setFailed(true);setStatus('Respuesta pendiente de guardar. Reintenta antes de salir.');}}finally{working.current=false;}}
 function record(event:any){const e={...event,id:crypto.randomUUID(),date:Date.now()};pending.current=[...pending.current,e].slice(-200);setState((v:any)=>mergeFretboard(v,{events:[e]}));setStatus('Guardando respuesta…');void flush();}
 return {state,ready,status,failed,record,retry:()=>void (loaded.current?flush():load())};
}
