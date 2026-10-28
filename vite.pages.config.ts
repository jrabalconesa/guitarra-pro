import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/postcss';
import path from 'node:path';
const root=process.cwd();
export default defineConfig({base:'/guitarra-pro/',plugins:[{
 name:'pages-platform-adapter',enforce:'pre',
 resolveId(source,importer){if(!importer)return;if(source==='drizzle-orm'||source==='cloudflare:workers'||(/(?:^|\/)db(?:\/schema)?$/.test(source))){return path.join(root,'pages/storage.ts');}if(source.endsWith('/chatgpt-auth'))return path.join(root,'pages/auth.ts');},
 transform(code,id){if(!id.startsWith(root+'/app/')&&!id.startsWith(root+'/lib/'))return;return code.replace("from './song-reader';","from './song-reader';\nimport {originalPreview} from '../pages/original-preview';").replace("setPreview('/api/songs?id='+encodeURIComponent(s.id)+'&original=1');","setPreview(await originalPreview(s.id));").replace("function newSong(){","useEffect(()=>()=>{if(preview.startsWith('blob:'))URL.revokeObjectURL(preview)},[preview]);\n function newSong(){").replace(/(["'`])\/(branding|fonts|manuales|vendor)\//g,'$1/guitarra-pro/$2/').replace(/href="\/"/g,'href="/guitarra-pro/"').replaceAll('En ChatGPT, selecciona Guitarra PRO y pide: «Consulta mi progreso y propón el siguiente ejercicio».','Para consultar tu progreso desde ChatGPT, usa la versión de Sites. El progreso de GitHub Pages permanece en este navegador.').replaceAll('Progreso conectado a tu cuenta','Progreso guardado en este navegador').replaceAll('Guardado requiere sesión','Guardado local pendiente').replaceAll('Puedes recuperarlo desde cualquiera de tus dispositivos.','Puedes recuperarlo desde este navegador.').replaceAll('Favoritos guardados en este dispositivo; no se han sincronizado.','No se han podido guardar los favoritos en este navegador.');}
},react()],css:{postcss:{plugins:[tailwind()]}},build:{outDir:'dist-pages',emptyOutDir:true}});
