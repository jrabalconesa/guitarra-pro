# Validación de práctica y sincronización

Revisión del 12 de noviembre de 2026. Release `practice-final-2026-11-12`.

## Estado anterior y reversión

Sites 49: `b9da663e41faae73a19a904654468a0164793cba`, acceso exclusivo del propietario.
GitHub main: `a5eb9234f24c46cbf05f3aaed3c5cc52b890d1d4`, PR #13.
La comparación contra pro-sync encontró diferencias comunes únicamente en audio-engine,
practice-studio y practice-progression. Se conservan los adaptadores, almacenamiento y
funciones exclusivas de cada plataforma. Rama local de reversión
`backup/before-final-sync-20261112` y bundle del repositorio Sites antes de cambios.
GitHub conserva el commit anterior y una rama de respaldo antes de publicar.
No se han leído ni migrado perfiles, bibliotecas, bases de datos o archivos personales.

## Cambios

- Clic seno a 1250/1650 Hz, pico limitado a 0,95 y caída a 180 ms.
  Ganancia independiente, compresión del ejemplo y limitador de salida conservados.
  Los filtros notch de entrada se alinean con las nuevas frecuencias del clic.
- Detector de energía con rearme tras caída al 70 % del pico y separación de 55 ms.
  El seguimiento de ataques utiliza 45 % del intervalo mínimo esperado, limitado
  entre 55 y 140 ms, en lugar de 190 ms fijos. Confirmación de cambio de altura: 35 ms.
  Muestreo de análisis solicitado cada 20 ms mediante requestAnimationFrame; la
  frecuencia efectiva depende del navegador y de la carga del dispositivo.
- Porcentajes sobre a tiempo + adelantadas + atrasadas, excluyendo extras y omisiones.
  Resumen en una fila flexible sin salto, scroll local, foco y etiqueta accesible.
  Se conserva la media firmada y la retroalimentación durante la ejecución.
- Manual 1.2: manual 1.1 íntegro más dos páginas explicativas y acceso desde el índice.
- Se actualizan los hashes de origen que bloquearon Actions, sin desactivar la comprobación.

## Evidencia automática

Sites antes: 96 pruebas, todas correctas. GitHub PR #13 tenía una regresión en la prueba
existente de ataques y el despliegue 43196427113 falló por hashes obsoletos.
Después: 130 pruebas correctas en ambos árboles. Se cubren 40, 60, 100, 137 y 180 BPM,
subdivisiones 1, 2 y 4, detección rítmica y con altura, notas distintas y repetidas,
duplicados, clipping, ruido de baja confianza, silencios, apagados, compensación y porcentajes.
Las pruebas previas de AIA, CAGED, copias, biblioteca, importación, ritmos y progresión
se mantienen. Compilaciones de ambas plataformas verificadas antes de publicación.

## Interfaz y límites

Vista previa de escritorio: carga del estudio y CAGED, selector personalizado a 180 BPM,
arranque y finalización de Probar metrónomo. La vista local de Sites carece de sesión
válida para comprobar escritura de datos de cuenta; no se interpreta como fallo de producción.
CSS revisado para limitar el scroll de resultados a su contenedor.

Pendiente de validación manual: audibilidad con guitarra y auriculares reales,
latencia y resonancias de dispositivos concretos; ejecución y guardado de un intento
con micrófono real; iPhone, Android, iPad en ambas orientaciones, Safari en Mac y Windows.
No se han simulado dispositivos como si fueran pruebas físicas. El detector continúa
siendo aproximado y no verifica dirección del rasgueo ni técnica del apagado.

## Revisión de publicación

Los identificadores de despliegue y commits definitivos se registran en el informe
entregado al concluir la publicación. El archivo public/version.json identifica la
release y sus hashes. La sincronización de código conserva la separación de los datos.
