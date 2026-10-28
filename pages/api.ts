import * as practice from '../app/api/practice/route';
import * as workspace from '../app/api/workspace/route';
import * as aia from '../app/api/aia/route';
import * as songs from '../app/api/songs/route';
import {tutorialSearchLinks} from '../lib/song-import.mjs';
const handlers:Record<string,any>={practice,workspace,aia,songs};
const nativeFetch=window.fetch.bind(window);
window.fetch=async(input:any,init?:RequestInit)=>{
 const raw=input instanceof Request?input.url:String(input),url=new URL(raw,location.href);
 const match=url.pathname.match(/^\/(?:guitarra-pro\/)?api\/([a-z]+)$/);
 if(url.origin!==location.origin||!match)return nativeFetch(input,init);
 try{const request=new Request(url,input instanceof Request?input:init);
 if(match[1]==='tutorials'){const data=await request.json();return Response.json({results:[],links:tutorialSearchLinks(data.title,data.artist),notice:'Abre estas búsquedas de tutoriales. GitHub Pages no consulta vídeos desde un servidor.'});}
 const handler=handlers[match[1]]?.[request.method];if(!handler)return Response.json({error:'Operación no disponible'},{status:405});return await handler(request);
 }catch(e){return Response.json({error:e instanceof Error?e.message:'No se pudo guardar en este navegador.'},{status:500});}
};
