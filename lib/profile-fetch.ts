import {validLearnerId} from './learner-profiles.mjs';
let selected='main';
export function selectLearner(id:string){if(!validLearnerId(id))throw Error('Perfil no válido');try{sessionStorage.setItem('guitarra-active-learner',id)}catch{throw Error('No se pudo seleccionar el perfil en esta pestaña.')}selected=id;}
export function currentLearner(){if(typeof window!=='undefined')try{const id=sessionStorage.getItem('guitarra-active-learner');if(validLearnerId(id))selected=id!;}catch{}return selected;}
// Capture identity on each request; switching profiles reloads the page and clears all views.
export function profileFetch(input:RequestInfo|URL,init?:RequestInit){
 const url=new URL(input instanceof Request?input.url:String(input),location.href);
 if(url.origin!==location.origin||!/^\/(?:guitarra-pro\/)?api\//.test(url.pathname))return window.fetch(input,init);
 const headers=new Headers(init?.headers||(input instanceof Request?input.headers:undefined));headers.set('X-Guitar-Profile',currentLearner());
 return window.fetch(input,{...init,headers});
}
