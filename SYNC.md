# Sincronización PRO

`pro-sync.json` registra los archivos comunes y sus SHA-256 al sincronizar Sites y GitHub. Los adaptadores de plataforma quedan fuera. `node scripts/check-pro-sync.mjs` enumera cambios desde la última sincronización.

La comprobación automática compara ambos lados con esa base: propaga cambios de un solo lado, detiene conflictos y valida antes de publicar. Se conserva la privacidad actual de Sites. No se copian datos de usuarios, credenciales, PDF personales ni estado de bases de datos al repositorio.

Los perfiles y el progreso se trasladan por copia JSON desde la propia aplicación. La sincronización de código no implica sincronización de datos personales.

## Perfiles e instrumentos · 24/11/2026

La persona principal mantiene los identificadores y datos existentes. Cada persona adicional usa un espacio separado para historial, AIA, recorrido y biblioteca. Los instrumentos de cada persona comparten progreso; cambiar de guitarra mantiene la sesión AIA y los ejercicios superados. Los intentos nuevos guardan la guitarra utilizada, sin asignar instrumentos a los intentos antiguos. Los ajustes de audio son locales por persona e instrumento.

En Perfiles, elige o crea una persona, añade o edita guitarras y pulsa Guardar instrumentos. Las copias JSON exportan la persona activa y se importan en la persona activa del destino. Los archivos originales se trasladan por separado. La sincronización entre publicaciones cubre el código; no copia automáticamente los datos personales.
