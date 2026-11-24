# Mapa del mástil · 24/11/2026

## Accesos
- Mi recorrido > Mapa del mástil.
- Sistema CAGED > Mapa del mástil; el curso y sus 18 lecciones siguen disponibles.
- AIA > Tu repaso del mástil, con acceso a la cuerda y nota recomendadas.

## Contenido
Mapa cromático de seis cuerdas y trastes 0–15, vista de naturales o una nota, filtro por cuerda y zona. Acordes, arpegios y seis escalas mantienen tónica y zona y destacan notas comunes. Diez calidades incluyen sus2, sus4, power chord, disminuido y semidisminuido. Notación Do/C, intervalos y nombres equivalentes con sostenidos o bemoles. Orientación para zurdos, controles táctiles, zona desplazable y tempo 20–180 BPM. Se reutiliza el motor de muestras de guitarra.

## Retos y seguimiento
Encontrar, nombrar y buscar una octava más aguda. La octava se calcula por MIDI real, incluida la afinación relativa de la segunda cuerda. No se pregunta una octava inexistente en la zona. Se registra el primer intento de cada pregunta, con acierto, nota, cuerda y traste objetivo. Guardado separado en workspace_fretboard del usuario; últimos 200 eventos, combinados por identificador para reintentos idempotentes. Los fallos de carga bloquean respuestas hasta recuperar datos; los de escritura ofrecen reintento.

AIA incorpora un panel de repaso visual: prioriza proporción de errores y, en empate, la referencia más antigua. No modifica el nivel de ejecución medida con estas respuestas. Las sesiones AIA anteriores siguen disponibles.

El botón de práctica abre hasta ocho alturas de la escala y zona elegidas en Practicar; el servidor reconstruye la secuencia desde un identificador validado. El micrófono mide alturas aisladas, no cuerda, postura ni acordes simultáneos. Resultados separados en Mi progreso.

La copia de seguridad conserva el nuevo registro como una clave independiente. No se eliminan ni migran progresos anteriores.

## Comprobación
143 pruebas automatizadas correctas, TypeScript sin errores y compilación verificada. Pruebas nuevas: capas, calidades/escala, octavas, respuestas equivalentes, validación y unión de registros, prioridad de repaso, reconstrucción de ejercicios y clave de copia de seguridad.

Navegador de desarrollo: acceso desde Mi recorrido, cambio de capas con La menor, nombres C/Do, inversión de trastes para zurdos, audio y apertura de práctica. Anchuras de 375 y 753 px sin desbordamiento del documento; el mástil desplaza dentro de su contenedor. El entorno local no dispone de sesión ChatGPT: guardado y panel autenticado no se verificaron en esa vista. No se hicieron pruebas físicas de micrófono ni de dispositivos iOS.
