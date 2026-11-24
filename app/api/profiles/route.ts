import {getChatGPTUser} from '../../chatgpt-auth';
import {getDb} from '../../../db';
import {records} from '../../../db/schema';
import {and,eq,inArray} from 'drizzle-orm';
import {save} from '../../../lib/store';
import {learnerUserId,normalizeGuitarProfile} from '../../../lib/learner-profiles.mjs';
const headers={'Cache-Control':'private, no-store'};
export async function GET(){const u=await getChatGPTUser();if(!u)return Response.json({error:'Inicia sesión.'},{status:401,headers});
 const db=getDb(),entries=await db.select().from(records).where(and(eq(records.userId,u.userId),eq(records.kind,'learner')));
 const ids=['main',...entries.map(r=>JSON.parse(r.payload).learnerId)],people=await db.select().from(records).where(and(inArray(records.userId,ids.map(id=>learnerUserId(u.userId,id))),eq(records.kind,'profile')));
 return Response.json({profiles:ids.map(id=>({id,name:JSON.parse(people.find(r=>r.userId===learnerUserId(u.userId,id))?.payload||'{}').name||(id==='main'?'Perfil principal':'Guitarrista')}))},{headers});}
export async function POST(request:Request){const u=await getChatGPTUser();if(!u)return Response.json({error:'Inicia sesión.'},{status:401,headers});if(request.headers.get('origin')&&request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Origen no válido'},{status:403});
 try{const body:any=await request.json(),name=String(body.name||'').trim();if(!name||name.length>60)throw Error('Escribe un nombre de hasta 60 caracteres.');const existing=await getDb().select().from(records).where(and(eq(records.userId,u.userId),eq(records.kind,'learner')));if(existing.length>=19)throw Error('Puedes guardar hasta 20 personas.');
 const id=crypto.randomUUID();await save(learnerUserId(u.userId,id),'profile',normalizeGuitarProfile({name}));await save(u.userId,'learner',{learnerId:id});return Response.json({id},{headers});
 }catch(e){return Response.json({error:(e as Error).message},{status:400,headers});}}
