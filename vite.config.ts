import {defineConfig} from 'vite';
import vinext from 'vinext';
import {cloudflare} from '@cloudflare/vite-plugin';

// Ejecuta las rutas de servidor en Workers y resuelve sus bindings nativos.
export default defineConfig({
 plugins:[{name:'cloudflare-native-module',enforce:'pre',resolveId(id){if(id==='cloudflare:workers')return {id,external:true};}},vinext(),cloudflare({viteEnvironment:{name:'rsc',childEnvironments:['ssr']}})],
 build:{rolldownOptions:{external:['cloudflare:workers']}},
 environments:{rsc:{build:{rolldownOptions:{external:['cloudflare:workers']}}},ssr:{build:{rolldownOptions:{external:['cloudflare:workers']}}}}
});
