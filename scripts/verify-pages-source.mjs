import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const version=JSON.parse(readFileSync('public/version.json','utf8'));
let count=0;
for(const [path,expected] of Object.entries(version.source_sha256)){
 const actual=createHash('sha256').update(readFileSync(path)).digest('hex');
 if(actual!==expected)throw Error('Source differs from Sites v26: '+path);
 count++;
}
console.log(`Verified ${count} original files against Sites ${version.sites_version}, commit ${version.sites_commit}`);
