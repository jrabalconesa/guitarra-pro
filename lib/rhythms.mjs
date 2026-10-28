const count4=['1','y','2','y','3','y','4','y'];
const rhythm=(id,name,pattern,beats=4,subdivision=2,meter='4/4',counts=count4,tip='',accents=[0,4])=>({id,name,pattern,beats,subdivision,meter,counts,tip,accents});
// The first four indexes are stable: earlier saved attempts keep their meaning.
export const rhythmCatalog=[
 rhythm('negras','Cuatro golpes', ['↓','—','↓','—','↓','—','↓','—']),
 rhythm('pop','Pop alterno', ['↓','—','↓','↑','—','↑','↓','↑'],4,2,'4/4',count4,'Mantén la mano en movimiento incluso cuando no toques.',[0,2,6]),
 rhythm('pop-apagado','Pop con apagado', ['↓','—','(↓)','↑','—','↑','↓','↑']),
 rhythm('alterno','Alterno continuo', ['↓','↑','↓','↑','↓','↑','↓','↑']),
 rhythm('rock','Rock · ocho abajo',Array(8).fill('↓'),4,2,'4/4',count4,'Ocho golpes hacia abajo; reduce el recorrido.',[0,2,4,6]),
 rhythm('balada','Balada · espacio en 1 y 3',['↓','—','—','—','↓','—','—','—']),
 rhythm('folk','Folk · bajo y respuesta',['B','—','↓','↑','↓','↑','↓','↑'],4,2,'4/4',count4,'B = la cuerda más grave que sí pertenece al acorde.'),
 rhythm('folk-alterno','Folk · dos bajos',['B','—','↓','↑','B','—','↓','↑']),
 rhythm('vals','Vals · bajo y rasgueo',['B','—','↓','↑','↓','↑'],3,2,'3/4',['1','y','2','y','3','y'],'Cuenta UNO-dos-tres; cambia después del tercer pulso.',[0]),
 rhythm('balada68','Balada · dos pulsos grandes',['↓','—','↑','↓','—','↑'],2,3,'6/8',['1','2','3','4','5','6'],'Dos clics por compás, en 1 y 4; cada clic se divide en tres.',[0,3]),
 rhythm('reggae','Reggae · contratiempos',['—','↑','—','↑','—','↑','—','↑'],4,2,'4/4',count4,'Toca en las «y» y corta el sonido después del rasgueo.',[1,3,5,7]),
 rhythm('rumba','Rumba pop · apagados',['↓','↑','(↓)','↑','↓','↑','(↓)','↑'],4,2,'4/4',count4,'El ataque entre paréntesis es apagado, sin golpear la tapa.',[0,2,4,6]),
 rhythm('funk','Funk · semicorcheas',Array.from({length:4},()=>['↓','—','↓','(↑)']).flat(),4,4,'4/4',['1','e','y','a','2','e','y','a','3','e','y','a','4','e','y','a'],'Cada pulso tiene cuatro partes: 1-e-y-a. Los apagados son breves.',[0,4,8,12]),
 rhythm('bajo-tres-acordes','Minicurso · bajo y tres acordes agudos',['B','—','↓₃','—','↓₃','—','↓₃','—'],4,2,'4/4',count4,'B = bajo del acorde; ↓₃ = solo las cuerdas 3ª, 2ª y 1ª. Adaptación de la página 3.',[0]),
 rhythm('marcha-aguda','Minicurso · bajo y respuesta aguda',['B','—','↓₃','—','B','—','↑₃','—'],4,2,'4/4',count4,'Alterna bajo y acorde agudo. En Do el bajo está en la 5ª, en Re en la 4ª, en Mi en la 6ª.',[0,4]),
 rhythm('respuesta-silencio','Minicurso · respuesta y silencio',['↓₃','B','↓₃','B','↓₃','B','↓₃','S'],4,2,'4/4',count4,'S = silencio: corta el sonido antes de volver al comienzo. El silencio no cuenta como ataque. Adaptación didáctica de la página 3.',[0,4])
];
export const strums=rhythmCatalog.map(r=>r.pattern);
export function rhythmFor(pattern){return rhythmCatalog.find(r=>r.pattern===pattern||r.pattern.join('|')===pattern?.join('|'))||rhythmCatalog[0];}

export const isRhythmRest=symbol=>symbol==='—'||symbol==='S';
export function strumVoicing(chord,symbol){if(isRhythmRest(symbol))return [];const notes=symbol==='B'?[chord.midi[0]]:symbol.includes('₃')?chord.midi.slice(-3):[...chord.midi];return symbol.includes('↑')?[...notes].reverse():[...notes];}
