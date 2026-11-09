// Recommended evidence-based self-checks for the 18 existing lessons.
// These are practice criteria, not microphone scores or automated proof of mastery.
export const CAGED_MASTERY={
  '1-1':{tempo:50,criteria:['Identifico el acorde real y la forma CAGED sin confundirlos.','Localizo dos tónicas de un mismo acorde en cuerdas distintas.','Puedo explicar por qué Do con forma E sigue siendo Do.']},
  '1-2':{tempo:50,criteria:['Encuentro tres tónicas distintas sin mostrar sus nombres.','Reconozco un patrón de octavas incluyendo el cambio de afinación en la segunda cuerda.','Repito la localización de tónicas en dos tonalidades.']},
  '1-3':{tempo:50,criteria:['Toco despacio las cinco formas abiertas que pueda ejecutar con comodidad.','Distingo raíz, tercera y quinta al señalar notas del dibujo.','Puedo explicar por qué no es necesario tocar una forma completa difícil.']},
  '2-1':{tempo:55,criteria:['Toco una forma E o A móvil sin dolor ni ruido excesivo.','Transporto una forma dos trastes y digo correctamente el nuevo acorde.','Puedo reducir una cejilla a un fragmento útil de tres cuerdas.']},
  '2-2':{tempo:55,criteria:['Toco la tríada Do en tres cuerdas y nombro sus notas.','Identifico cuál es su nota más grave y la inversión.','Hago Do–Fa–Sol–Do a pulsos regulares.']},
  '2-3':{tempo:55,criteria:['Localizo las cinco regiones de Do mayor.','Encuentro una nota compartida entre dos formas vecinas.','Repito una transición en otra tonalidad.']},
  '3-1':{tempo:60,criteria:['Identifico qué tercera cambia de mayor a menor.','Toco una tríada mayor y menor con la misma fundamental.','Distingo ambas sonoridades por escucha guiada.']},
  '3-2':{tempo:60,criteria:['Encuentro las terceras y séptimas de 7, maj7 y m7.','Puedo explicar la diferencia entre Do7 y DoMaj7.','Reconozco que el mapa de séptimas no es necesariamente una digitación simultánea.']},
  '3-3':{tempo:60,criteria:['Encuentro una nota común entre dos tríadas vecinas.','Cambio Do–Fa–Sol con mínimo desplazamiento posible.','Mantengo el pulso durante cuatro vueltas.']},
  '4-1':{tempo:65,criteria:['Reconozco las cinco notas de una pentatónica mayor y menor.','Localizo los tonos del acorde dentro de una pentatónica.','Creo una frase breve terminada en una nota del acorde.']},
  '4-2':{tempo:65,criteria:['Creo pregunta y respuesta con pausas claras.','Puedo variar el ritmo conservando las alturas.','Resuelvo la respuesta de forma reconocible.']},
  '4-3':{tempo:65,criteria:['Conecto dos regiones CAGED sin perder la tónica.','Identifico una nota de enlace en ambas regiones.','Repito el enlace en otra tonalidad.']},
  '5-1':{tempo:70,criteria:['Diferencio pentatónica y escala diatónica.','Identifico los grados 4 y 7 añadidos a la pentatónica mayor.','Construyo una breve resolución de Si a Do o Fa a Mi.']},
  '5-2':{tempo:70,criteria:['Arpegio un acorde en una posición sin apresurarme.','Encuentro la tercera del acorde siguiente.','Construyo una frase que termine en la tercera de Fa o Sol.']},
  '5-3':{tempo:70,criteria:['Explico qué es la novena respecto a la segunda.','Localizo una extensión y una nota de resolución.','Distingo una extensión melódica de una cejilla obligatoria.']},
  '6-1':{tempo:75,criteria:['Sigo la progresión I–IV–V con notas objetivo.','Puedo mantener la tonalidad mientras cambian los acordes diatónicos.','Termino tres frases sobre notas del acorde correspondiente.']},
  '6-2':{tempo:75,criteria:['Creo dos frases propias en una forma.','Varío su ritmo y dejo silencios musicales.','Traslado una frase a otro registro explicando sus notas objetivo.']},
  '6-3':{tempo:75,criteria:['Realizo ocho compases alternando tríadas y respuestas melódicas.','Mantengo el pulso sin base en una segunda pasada.','Repito el arreglo en otra tonalidad y detecto mis puntos débiles.']}
};
export const masteryCount=id=>CAGED_MASTERY[id]?.criteria.length||0;
