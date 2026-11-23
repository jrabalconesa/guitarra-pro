"""Build the CC0 FreePats guitar bank. Run only to regenerate committed samples."""
import concurrent.futures,hashlib,json,re,subprocess,tempfile,urllib.request,urllib.parse
from pathlib import Path
root=Path(__file__).resolve().parents[1];out=root/'public/guitar-samples';out.mkdir(exist_ok=True)
repo='https://api.github.com/repos/freepats/spanish-classical-guitar/commits/main'
sha=json.loads(urllib.request.urlopen(repo,timeout=30).read())['sha']
base=f'https://raw.githubusercontent.com/freepats/spanish-classical-guitar/{sha}/'
sfz=urllib.request.urlopen(base+'SpanishClassicalGuitar-20190618.sfz',timeout=30).read().decode()
(out/'LICENSE-CC0.txt').write_bytes(urllib.request.urlopen(base+'LICENSE',timeout=30).read())
regions=[]
for r in sfz.split('<region>')[1:]:
 m=re.search(r'(?:pitch_keycenter|\bkey)=(\d+)',r);f=re.search(r'sample=(.*)',r)
 if m and f and 40<=int(m[1])<=84:regions.append((int(m[1]),f[1].strip()))
def make(pair):
 midi,path=pair;data=urllib.request.urlopen(base+urllib.parse.quote(path),timeout=45).read()
 with tempfile.NamedTemporaryFile(suffix='.flac') as f:
  f.write(data);f.flush();subprocess.run(['ffmpeg','-v','error','-y','-i',f.name,'-af','atrim=duration=6,afade=t=out:st=5.8:d=0.2','-ac','1','-ar','44100','-b:a','128k',str(out/f'{midi}.mp3')],check=True)
 return {'midi':midi,'file':f'{midi}.mp3','source':path,'source_sha256':hashlib.sha256(data).hexdigest()}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:items=list(pool.map(make,regions))
manifest={'title':'Spanish classical guitar · FreePats','source':'https://github.com/freepats/spanish-classical-guitar','commit':sha,'license':'CC0-1.0','recorded_by':'Roberto, FreePats (2008); edition 2019-06-18','processing':'mono MP3 44.1 kHz 128 kbps, maximum 6 seconds, tail fade','samples':sorted(items,key=lambda x:x['midi'])}
(out/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n');print('Guitar samples:',len(items),'bytes:',sum(x.stat().st_size for x in out.glob('*.mp3')))
