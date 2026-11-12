# Actualización del manual de uso

La fuente editable reproducible está en `docs/manual-source`: contenido, generador y capturas de la interfaz revisada. El PDF y el Word publicados están en `public/manuales`.

1. Revisar primero Sites y conservar todas las funciones y datos existentes.
2. Ante cambios significativos de navegación, controles, almacenamiento o aprendizaje, actualizar los capítulos y capturas afectados. Regenerar Word y PDF A4; comprobar todas las páginas, índice y enlaces.
3. Para un ajuste menor, dejar constancia de la revisión en `manual-version.json` sin regenerar documentos si siguen siendo fieles. Actualizar las huellas de las fuentes revisadas y de los documentos solo tras revisarlos.
4. Ejecutar `node scripts/check-manual.mjs`, pruebas y compilación. La publicación de Pages ejecuta el control del manual y falla si cambia una fuente vigilada sin revisión.
5. Actualizar `pro-sync.json` con las huellas reales, publicar Sites y después trasladar las fuentes comunes a GitHub, conservando sus adaptadores de rutas y almacenamiento local.
6. Comprobar ambas descargas publicadas y comparar sus SHA-256. Código sincronizado no implica sincronización automática de perfiles, archivos ni progresos entre plataformas.

No regenerar el manual por cada pequeño cambio visual. No sobrescribir datos personales ni migrarlos entre plataformas sin una operación explícita de copia.
