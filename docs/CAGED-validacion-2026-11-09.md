# Integración CAGED - 9 de noviembre de 2026

## Base y preservación

Sites versión 38, commit 45d7ca68466dfa74dffa99e720590e711ee52df2.
GitHub main eb87c9c78de2bd4c6cb49c3e13dce8e03e3bafc7.
Propuesta PR 5, head de768c088a7c603739ab7d1f8d1aeb149a3042c3.
Comparación de blobs de app/ y lib/: coincidencia salvo app/layout.tsx, adaptador de plataforma preservado. Parche aplicado sin conflictos sobre la fuente real de Sites. No se modifican esquemas, rutas de datos, AIA, perfiles, audios existentes ni progresos de usuarios.

## Cambios

- 18 explicaciones ampliadas con ejemplos, pasos y preguntas con solución.
- Manual visual interactivo: 18 capítulos enlazados, cinco diagramas, mapa de notas y ruta de estudio.
- 54 criterios de autoevaluación de sesión, separados del progreso registrado.
- Tablaturas por tonalidad, forma, calidad y capa, con una nota por pulso y metrónomo.
- Corregidos los saltos de línea de la tablatura, el rango de trastes accesible de los diagramas y la disposición de casillas en móvil.
- Añadidos tempos lentos e intermedios, conservando los anteriores.
- Ampliada la cobertura de firmas compartidas para incluir los módulos y manual nuevos.

## Pruebas

- 74 pruebas Node superadas: currículo, 12 tonalidades, cinco formas, cinco calidades, tres capas, inversiones, MIDI/cuerdas/trastes, tablatura, scripts del manual, AIA, copias de seguridad y progresión.
- Compilación de producción de Sites superada.
- Chromium: aplicación y manual en contenedores de 1440, 1180, 820 y 390 px. Desbordamiento horizontal de documento: 0 px en todos ellos; el mástil conserva su desplazamiento interno.
- Navegación secuencial por 18 lecciones y botón final desactivado; apertura de solución y autoevaluación; inicio de audio y controles Detener; selección CAGED recibida por el estudio de práctica.
- Manual: 18 capítulos, cinco diagramas, cambios de tónica/capa y solución desplegable.

## Límites y pendientes

La revisión responsive utiliza Chromium con anchos representativos; no equivale a probar Safari en iPad o iPhone físicos. No se ha ejecutado una toma de micrófono con guitarra real ni evaluado la comodidad física de cada postura. Las alturas objetivo y el orden del audio se verifican por MIDI; la valoración auditiva y pedagógica con instrumento real sigue pendiente. Los criterios nuevos son temporales y no alteran el registro previo. No se transfieren datos personales entre plataformas.
