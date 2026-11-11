import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const api=require('pdfjs-dist/package.json').version;
const worker=readFileSync('public/vendor/pdf/pdf.worker.min.mjs','utf8');
if(!worker.includes(api))throw Error('El worker PDF no coincide con pdfjs-dist '+api);
const pkg=JSON.parse(readFileSync('package.json','utf8'));
if(pkg.dependencies['pdfjs-dist']!==api)throw Error('La versión PDF debe estar fijada para evitar incompatibilidades');
console.log('PDF API y worker compatibles: '+api);
