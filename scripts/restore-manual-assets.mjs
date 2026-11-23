import {readFileSync,mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {createHash} from 'node:crypto';import {tmpdir} from 'node:os';import {join} from 'node:path';import {execFileSync} from 'node:child_process';
const manifest=JSON.parse(readFileSync('manual-assets.json','utf8')),chunks=[];
for(const [file,sha] of Object.entries(manifest.files)){
 if(!/^manual-assets\.part\d{3}$/.test(file))throw Error('Unexpected asset shard');
 const bytes=readFileSync(file);if(createHash('sha256').update(bytes).digest('hex')!==sha)throw Error('Asset shard changed: '+file);chunks.push(bytes);
}
const archive=Buffer.concat(chunks);if(createHash('sha256').update(archive).digest('hex')!==manifest.archive_sha256)throw Error('Learning archive changed');
const temp=mkdtempSync(join(tmpdir(),'guitarra-assets-'));try{const file=join(temp,'assets.tar.gz');writeFileSync(file,archive);execFileSync('tar',['--skip-old-files','-xzf',file],{stdio:'inherit'});}finally{rmSync(temp,{recursive:true,force:true});}
console.log('Restored verified manual and guitar samples from Sites 52.');
