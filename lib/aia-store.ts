import {CURRICULUM} from './aia.mjs';
import {getDb} from '../db';
import {records} from '../db/schema';
import {and,eq} from 'drizzle-orm';
export async function readAia(userId:string){const row=(await getDb().select().from(records).where(and(eq(records.id,'aia_'+userId),eq(records.userId,userId),eq(records.kind,'aia'))).limit(1))[0];const state=row?JSON.parse(row.payload):{revision:0,settings:{},session:null,completed:[]};for(const step of state.session?.steps||[]){const a=step.assignment,unit=a&&(CURRICULUM as any)[a.track]?.find((u:any)=>u.id===a.unitId);if(unit&&a.unitTitle!==unit.title){if(typeof a.reason==='string'&&a.unitTitle)a.reason=a.reason.replaceAll(a.unitTitle,unit.title);a.unitTitle=unit.title;}}return {raw:row?.payload||null,state};}
export async function writeAia(userId:string,raw:string|null,state:any){const id='aia_'+userId,payload=JSON.stringify({...state,revision:(state.revision||0)+1}),db=getDb();let result;
 if(raw===null)result=await db.insert(records).values({id,userId,kind:'aia',payload,createdAt:Date.now()}).onConflictDoNothing().returning({id:records.id});
 else result=await db.update(records).set({payload,createdAt:Date.now()}).where(and(eq(records.id,id),eq(records.userId,userId),eq(records.kind,'aia'),eq(records.payload,raw))).returning({id:records.id});
 if(!result.length)throw Error('AIA se ha actualizado en otra pestaña. Actualiza para recuperar la sesión vigente.');return JSON.parse(payload);
}
