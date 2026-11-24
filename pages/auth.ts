import {learnerUserId} from '../lib/learner-profiles.mjs';
export async function getChatGPTUser(request?:Request){return {userId:learnerUserId('github-pages-local-browser',request?.headers.get('X-Guitar-Profile')||'main'),displayName:'Guitarrista',email:''};}
