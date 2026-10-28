// Standard tuning, first string first. Original teaching material.
export const OPEN=[64,59,55,50,45,40];
export const KEYS=['Do','Do♯ / Re♭','Re','Re♯ / Mi♭','Mi','Fa','Fa♯ / Sol♭','Sol','Sol♯ / La♭','La','La♯ / Si♭','Si'];
export const SHAPES={C:{root:0,frets:[-1,3,2,0,1,0]},A:{root:9,frets:[-1,0,2,2,2,0]},G:{root:7,frets:[3,2,0,0,0,3]},E:{root:4,frets:[0,2,2,1,0,0]},D:{root:2,frets:[-1,-1,0,2,3,2]}};
export const mod=n=>((n%12)+12)%12;
export const interval=(m,root)=>mod(m-root);
export const degree=n=>({0:'R',2:'2',3:'♭3',4:'3',5:'4',7:'5',8:'♭6',9:'6',10:'♭7',11:'7'}[n]||'');
export const QUALITY={major:[0,4,7],minor:[0,3,7],'7':[0,4,7,10],maj7:[0,4,7,11],m7:[0,3,7,10]};
export function shapeNotes(root,shape='C',minor=false){const x=SHAPES[shape],shift=mod(root-x.root);return x.frets.flatMap((f,i)=>{if(f<0)return [];const string=5-i;let fret=f+shift;if(minor&&interval(OPEN[string]+fret,root)===4)fret--;return fret<0?[]:[{string,fret,midi:OPEN[string]+fret}];});}
export function zoneNotes(root,shape,layer='chord',quality='major'){
 const base=shapeNotes(root,shape,quality==='minor'||quality==='m7'),lo=Math.min(...base.map(n=>n.fret)),hi=Math.max(...base.map(n=>n.fret));
 if(layer==='chord'&&(quality==='major'||quality==='minor'))return base;
 const mask=layer==='pent'?(quality==='minor'||quality==='m7'?[0,3,5,7,10]:[0,2,4,7,9]):layer==='scale'?(quality==='minor'||quality==='m7'?[0,2,3,5,7,8,10]:[0,2,4,5,7,9,11]):QUALITY[quality];
 return OPEN.flatMap((m,string)=>Array.from({length:hi-lo+1},(_,i)=>({string,fret:lo+i,midi:m+lo+i})).filter(n=>mask.includes(interval(n.midi,root))));
}
export function fretboardNotes(root,layer='chord',quality='major'){
 const minor=quality==='minor'||quality==='m7',mask=layer==='pent'?(minor?[0,3,5,7,10]:[0,2,4,7,9]):layer==='scale'?(minor?[0,2,3,5,7,8,10]:[0,2,4,5,7,9,11]):QUALITY[quality];
 return OPEN.flatMap((m,string)=>Array.from({length:16},(_,fret)=>({string,fret,midi:m+fret})).filter(n=>mask.includes(interval(n.midi,root))));
}
export const SOURCES=[
 {title:'Guitareo / Nate Savage · The CAGED System',url:'https://www.guitarlessons.com/guitar-lessons/guitar-theory-ear-training-and-reading/the-caged-system/',use:'Formas abiertas, tónicas, enlaces por parejas y práctica de un acorde antes de cambiar de tonalidad.'},
 {title:'Andy Guitar · Introduction to the CAGED system for Lead Guitar',url:'https://www.andyguitar.co.uk/videos/lesson-1-introduction-to-the-caged-system',use:'Relación entre formas, pentatónicas y mezcla de acompañamiento y melodía.'},
 {title:'Fretjam · Major Chord Colouring Using The CAGED System',url:'https://www.fretjam.com/caged-major-chords.html',use:'Voicings reducidos para añadir séptimas y extensiones sin exigir posturas completas.'},
 {title:'TrueFire · An Introduction to the CAGED System',url:'https://blog.truefire.com/guitar-lessons/introduction-caged-system/',use:'Octavas y notas de la tríada como referencias para descubrir las formas.'}
];
const L=(id,title,concept,visual,task,error,application,check,kind='arpeggio')=>({id,title,concept,visual,task,error,application,check,kind});
export const MODULES=[
 {level:1,title:'Las cinco formas y sus tónicas',lessons:[
 L('1-1','Una forma no es un acorde','CAGED son cinco dibujos: C/Do, A/La, G/Sol, E/Mi y D/Re. La tónica es la nota que da nombre al acorde.','Elige Do y forma E: verás un acorde de Do con dibujo de Mi, en el traste 8.','Alterna C y E en el mapa. Escucha sus notas y busca las R (raíces).','Llamar Mi a cualquier acorde con forma de Mi.','Acompaña un mismo Do en registro grave y agudo.','Nombra acorde y forma por separado en tres ejemplos.','roots'),
 L('1-2','Tónicas y octavas','La misma nota puede sonar más grave o más aguda. Una octava conserva el nombre.','Do: 5ª traste 3 y 3ª traste 5. La: 6ª traste 5 y 4ª traste 7.','Activa el reto de tónicas y localiza tres raíces sin revelar las notas.','Usar la regla de dos trastes al cruzar la 2ª cuerda: ahí cambia la afinación relativa.','Encuentra el bajo antes de empezar un arpegio.','Localiza la tónica en 6ª, 5ª y 4ª con el mapa completo.','roots'),
 L('1-3','Escuchar las cinco formas abiertas','Un acorde mayor contiene tónica, tercera y quinta: en Do son Do, Mi y Sol.','Para ver cada forma abierta, elige la tonalidad con el mismo nombre que la forma. 0 es cuerda al aire.','Escucha cada acorde, arpegia sus cuerdas una a una y señala su raíz.','Apretar toda la mano más de lo necesario. En española el mástil suele ser más ancho; ajusta la mano.','Toca una rueda abierta Do–La menor–Fa–Sol usando acordes que ya conozcas.','Explica qué nota da nombre a cada una de las cinco formas.')
 ]},
 {level:1,title:'Mover y conectar sin tensión',lessons:[
 L('2-1','Mi y La: las primeras formas móviles','El índice sustituye las cuerdas al aire que necesitas. No todas las formas exigen una cejilla de seis cuerdas.','Forma E en Fa: 133211 de 6ª a 1ª. Forma A en Si: x24442. x significa no tocar.','Practica primero solo tres cuerdas, luego añade otras si suenan cómodas.','Confundir fuerza con precisión. Si aparece dolor, para y recoloca.','Lleva un acompañamiento a otra tonalidad.','Toca dos acordes móviles limpios con presión cómoda.'),
 L('2-2','Tríadas pequeñas desde el principio','Una tríada usa tres notas distintas del acorde; una inversión cambia cuál queda más grave.','Do en 3ª, 2ª y 1ª: 5–5–3 = Do–Mi–Sol.','Selecciona forma A en Do y vista tres cuerdas. Arpegia y después toca el fragmento junto.','Pensar que debes abarcar toda la forma G o C. Puedes usar solo un fragmento.','Añade un acompañamiento agudo a una rueda pop o indie.','Reconoce R, 3 y 5 en una tríada.','triad'),
 L('2-3','El mismo acorde en cinco lugares','Las formas se solapan en orden circular C–A–G–E–D. El punto de inicio depende del acorde.','En Do: C abierta, A desde traste 3, G desde 5, E desde 8 y D desde 10.','Usa los botones de forma y busca una nota común entre dos vecinas. Después recorre las cinco.','Tratar C–A–G–E–D como una progresión de cinco acordes diferentes.','Sostén un Do mientras cambias el registro del acompañamiento.','Encuentra una nota común entre cada pareja vecina.','connect')
 ]},
 {level:2,title:'Menores, séptimas y conducción de voces',lessons:[
 L('3-1','De mayor a menor: cambia la tercera','Bajar la tercera un semitono transforma una tríada mayor en menor. En Do: Mi pasa a Mi♭.','Compara Mayor y Menor en la misma zona. R y 5 conservan su función.','Escucha las dos versiones y toca R–3–5, luego R–♭3–5.','Esperar cinco posturas menores completas igual de cómodas: usaremos fragmentos.','Cambia el color de una frase sin cambiar la tónica.','Identifica de oído y en el mapa la tercera que cambió.'),
 L('3-2','7, maj7 y m7 con sentido','7 usa tercera mayor y séptima menor; maj7 usa tercera y séptima mayores; m7 usa ambas menores.','En Do: 7 añade Si♭; maj7 añade Si; m7 contiene Mi♭ y Si♭.','Selecciona cada calidad y escucha su arpegio. El mapa es de notas, no una postura para tocar todas juntas.','Confundir 7 con maj7 o añadir una séptima que no aparece en la armonía.','Da color a un acorde estático antes de usar una rueda.','Distingue las tres calidades y encuentra su tercera y séptima.'),
 L('3-3','Cambiar acorde moviendo poco','Conducir voces significa llevar cada nota a una nota cercana del siguiente acorde.','Do–Fa: conserva Do cuando sea posible; Mi puede subir a Fa y Sol a La.','Sobre la base I–IV–V busca una tríada cercana al cambiar de acorde.','Saltar siempre a la postura grave que ya conoces.','Acompaña pop o indie con tríadas de las cuerdas finas.','Prepara dos cambios sin saltar innecesariamente de zona.','triad')
 ]},
 {level:2,title:'Pentatónicas y frases entre zonas',lessons:[
 L('4-1','Ver el acorde dentro de la pentatónica','Una pentatónica tiene cinco notas. La mayor usa R–2–3–5–6; la menor R–♭3–4–5–♭7.','En Do mayor: Do–Re–Mi–Sol–La. En Do menor: Do–Mi♭–Fa–Sol–Si♭.','Alterna Acorde y Pentatónica. Acaba una frase en R, 3 o 5.','Confundir Do mayor con Do menor porque comparten tónica.','Improvisa dos compases sobre un solo acorde.','Señala las notas del acorde dentro de la pentatónica.','pent'),
 L('4-2','Pregunta y respuesta','Una frase breve puede repetirse y variar. Los silencios también forman parte de la música.','Toca tres notas, deja respirar y responde acabando en una nota del acorde.','Escucha el recorrido de ejemplo; después inventa otro ritmo con solo tres notas.','Recorrer la escala arriba y abajo sin intención.','Construye una respuesta original sobre una base folk o pop.','Crea dos frases distintas con las mismas tres notas.','pent'),
 L('4-3','Cruzar una frontera','Conectar dos zonas empieza con una nota compartida y un desplazamiento consciente.','Escoge dos formas vecinas y localiza una nota igual en ambas.','Toca cuatro notas en una zona y cuatro en la siguiente; vuelve a la raíz.','Aprender cinco cajas aisladas sin practicar las uniones.','Amplía un solo sin perder la referencia armónica.','Une dos zonas en dos tonalidades sin mirar todas las notas.','connect')
 ]},
 {level:3,title:'Escala diatónica, arpegios y colores',lessons:[
 L('5-1','De cinco a siete notas','La escala mayor añade 4 y 7 a la pentatónica mayor. La menor natural añade 2 y ♭6 a la menor.','En Do mayor añade Fa y Si. No todas las notas tienen la misma sensación de reposo.','Compara pentatónica y escala, y resuelve una nota de paso sobre 3 o R.','Pensar que las cinco zonas CAGED son los siete modos: posiciones y modos son conceptos diferentes.','Añade movimiento a una melodía sin perder el acorde.','Identifica las dos notas añadidas y resuelve una de ellas.','scale'),
 L('5-2','Arpegios como notas de destino','Un arpegio toca por separado las notas de un acorde. No exige sweep picking ni velocidad.','Mayor R–3–5; menor R–♭3–5. Añade la séptima solo cuando corresponda.','Toca un arpegio por zona con púa alterna o dedos, luego une dos.','Hacer de una técnica de mano derecha un requisito para entender CAGED.','Subraya la tercera al llegar un acorde nuevo.','Encuentra la tercera del siguiente acorde antes de cambiar.'),
 L('5-3','9, 11 y 13: colores opcionales','Las extensiones son notas añadidas: 9 equivale a 2 una octava arriba; 11 a 4 y 13 a 6.','En Do, Re es 9, Fa es 11 y La es 13. Fa junto a Mi puede crear tensión.','Usa la escala para añadir Re a una frase de Do, escucha la tensión y vuelve a Mi o Do.','Acumular extensiones sin escuchar el acorde ni el contexto.','Diseña un arreglo original con un add9 y un fragmento cómodo.','Explica el color elegido y qué nota resuelve la tensión.','scale')
 ]},
 {level:3,title:'Seguir la armonía y tocar con autonomía',lessons:[
 L('6-1','Seguir los acordes con notas objetivo','Playing the changes es hacer que la melodía refleje la armonía. No necesitas cambiar de escala en cada acorde diatónico.','En Do–Fa–Sol puedes mantener Do mayor y apuntar a Mi, La y Si, terceras de cada acorde.','Elige base I–IV–V. En cada cambio busca primero la raíz; después la tercera.','Cambiar de caja mecánicamente en cada compás o confundir tonalidad con acorde actual.','Construye un solo breve que permita oír los cambios de armonía.','Termina tres frases en notas del acorde que suena.','scale'),
 L('6-2','Diez ideas propias y varios estilos','Un lick es una frase corta reutilizable. Desarrolla dos ideas por forma en vez de memorizar una carrera.','En cada zona: una frase que termine en R y otra en 3 o ♭3.','Alterna fragmentos de acorde y respuestas. Varía ritmo, articulación y silencios.','Copiar frases sin saber sobre qué acorde funcionan.','Prueba carácter pop/indie, folk, blues o rock con material original.','Crea y anota dos frases por zona. Bends y vibrato son opcionales.','pent'),
 L('6-3','Mini jam y arreglo sin acompañamiento','Puedes alternar un fragmento de acorde, una respuesta melódica y un bajo para sugerir armonía a solas.','Dos pulsos de tríada, un pulso de respuesta y uno de espacio. Cuenta 1–2–3–4.','Prepara 8 compases con inicio y final. Usa la base y luego repite sin ella.','Tocar todas las notas disponibles sin construir una forma musical.','Lleva una progresión de una canción de Biblioteca a dos registros del mástil.','Repite otro día y en otra tonalidad; anota qué sigue necesitando trabajo.','triad')
 ]}
];
export const LESSONS=MODULES.flatMap((m,i)=>m.lessons.map(l=>({...l,module:i+1,moduleTitle:m.title,level:m.level})));
export function makeExercise(lesson,root,shape,quality){const layer=lesson.kind==='pent'?'pent':lesson.kind==='scale'?'scale':'chord';let ns=zoneNotes(root,shape,layer,quality).sort((a,b)=>a.midi-b.midi||b.string-a.string);
 if(lesson.kind==='roots')ns=ns.filter(n=>interval(n.midi,root)===0);
 if(lesson.kind==='triad')ns=ns.filter(n=>n.string<3);
 if(lesson.kind==='connect'){const next=Object.keys(SHAPES)[(Object.keys(SHAPES).indexOf(shape)+1)%5];ns=[...zoneNotes(root,shape,'chord',quality).filter(n=>n.string<3),...zoneNotes(root,next,'chord',quality).filter(n=>n.string<3)];}
 // Keep detector exercises short: they assess isolated notes, not free phrasing.
 ns=ns.slice(0,16);if(ns.length<4)ns=[...ns,...ns];
 return {id:`caged-${lesson.id}-${root}-${shape}-${quality}`,custom:true,skill:'melodia',level:lesson.level,title:`CAGED ${lesson.id} · ${KEYS[root]} ${quality} · forma ${shape}`,description:'Recorrido original de notas aisladas: una nota por pulso. Silencia la anterior para comprobar el sonido. La app no identifica la cuerda ni la postura por el audio.',notes:ns,baseTempo:lesson.level===1?60:lesson.level===2?75:90,beatsPerBar:4};
}

export function cagedFromId(id){
 if(typeof id!=='string')return null;
 const m=id.match(/^caged-([1-6]-[1-3])-(\d{1,2})-([CAGED])-(major|minor|7|maj7|m7)$/);
 if(!m||Number(m[2])>11)return null;const lesson=LESSONS.find(l=>l.id===m[1]);
 return lesson?makeExercise(lesson,Number(m[2]),m[3],m[4]):null;
}
