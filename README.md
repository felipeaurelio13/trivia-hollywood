# Trivia Hollywood

App web mobile-first de trivia sobre largometrajes de producción/distribución mayoritariamente estadounidense con al menos una nominación al Oscar.

## Stack
- Next.js (App Router) + TypeScript
- TailwindCSS
- Zod
- Vitest + Playwright

## Requisitos
- Node 20+

## Setup
```bash
npm install
```

## Variables de entorno (multiplayer)
Configura estas variables según tu entorno:

- `DATABASE_URL`: necesaria en el backend donde viven las API routes de multiplayer (Prisma).
- `NEXT_PUBLIC_MULTIPLAYER_API_BASE_URL`: necesaria en frontend estático (GitHub Pages) para apuntar al backend multiplayer externo.

Ejemplo local:
```bash
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_MULTIPLAYER_API_BASE_URL="http://localhost:3000"
```

## Desarrollo
```bash
npm run dev
```

## Calidad
```bash
npm run lint
npm run test:unit
npm run test:e2e
```

## Reglas MVP implementadas
- Partida de 10 preguntas exactas.
- 4 opciones por pregunta.
- Feedback inmediato.
- Sin vidas.
- Puntaje +100 por correcta.


## Avance Milestone 2 (multiplayer asincrónico)
- Modelado inicial en Prisma para salas privadas: `Room`, `RoomPlayer`, `RoomRun`, `RoomQuestionSet`.
- Estados de sala disponibles: `waiting`, `started`, `finished`.
- Helpers de dominio para código de sala y validación de capacidad (2-8).
- UI inicial mobile-first en `/multiplayer` para crear sala y unirse por código (paso siguiente: conectar handlers/API).

## Accesibilidad 70+
- Tipografía base aumentada para mejorar legibilidad en móvil.
- Contraste alto por defecto en botones, tarjetas y foco.
- Objetivos táctiles grandes (mínimo 56px) para reducir errores de toque.
- Opción de salto al contenido principal para navegación rápida con teclado/lectores.
- Respeto de `prefers-reduced-motion` para personas sensibles a animaciones.

## Despliegue en GitHub Pages
Este repositorio quedó preparado para despliegue estático en GitHub Pages.

1. En GitHub, entra a **Settings → Pages**.
2. En **Build and deployment**, selecciona **Source: GitHub Actions**.
3. Haz push a `main`.
4. El workflow `Deploy to GitHub Pages` construye y publica automáticamente el contenido estático en `out/`.

### URL pública
- Formato estándar: `https://<tu-usuario>.github.io/<tu-repo>/`
- Para este repositorio, la ruta esperada es: `https://<tu-usuario>.github.io/trivia-hollywood/`
- La URL exacta publicada queda visible al finalizar el job **deploy** en Actions, en el campo `page_url`.

### Notas técnicas
- Se usa `output: "export"` para generar sitio estático.
- Se calcula `basePath`/`assetPrefix` automáticamente durante Actions usando `GITHUB_REPOSITORY`, para que funcione en repos de tipo `usuario/repo`.
- La partida solo usa datos locales curados (`data/movies.sample.json`), sin API runtime.

## Novedades de UX y despliegue (v0.10.2)
- Multiplayer en GitHub Pages ahora funciona apuntando a un backend externo configurable con `NEXT_PUBLIC_MULTIPLAYER_API_BASE_URL`.
- El cliente multiplayer ya no depende únicamente de rutas relativas: crea/busca/une sala usando la URL base configurada.
- La UI mantiene feedback claro: bloquea acciones cuando falta backend y muestra estado activo cuando sí está configurado.
- Se añadieron pruebas unitarias para blindar la resolución de URLs de multiplayer y el comportamiento de la pantalla en export estático.
- En el feedback post-respuesta, el rótulo "Explicación" se renombró a "Dato curioso" para que el texto refleje mejor el contenido mostrado al usuario.

## Novedades de UX y calidad (v0.10.0)
- El dataset curado se amplió a 54 largometrajes elegibles (USA + >=1 nominación Oscar) para reducir repeticiones y mejorar cobertura histórica en modo solo.
- El generador de preguntas ahora usa barajado Fisher-Yates con aleatoriedad criptográfica cuando está disponible, mejorando la variación entre partidas consecutivas.
- El plan de 10 preguntas se genera por partida con mezcla dinámica y garantía de incluir todos los tipos A/B/C/D/E (DIRECTOR/CAST/YEAR/OSCAR/INTRUDER).
- Se amplió el pool de películas intrusas no nominadas para evitar patrones repetitivos en ese tipo de pregunta.
- Nuevas pruebas unitarias para validar la mezcla completa de tipos y el tamaño mínimo del dataset curado.

## Novedades de UX y calidad (v0.9.8)
- La pantalla de juego solo ahora incorpora una barra de progreso accesible con porcentaje visible para reducir incertidumbre durante la partida.
- Se añade contador de aciertos en tiempo real para reforzar feedback motivacional sin fricción.
- El bloque de feedback posterior a la respuesta muestra estado explícito (correcta/incorrecta) además de la explicación, mejorando claridad y comprensión.
- Nueva prueba unitaria para blindar progreso visible y feedback post-respuesta en `/solo/play`.

## Novedades de UX y calidad (v0.9.7)
- La explicación en juego ahora aparece solo después de responder, evitando contenido redundante antes de la interacción.
- Se mejoró el contenido de feedback para aportar contexto útil (p. ej. ceremonia/etapa) en lugar de repetir literalmente la respuesta.
- Se ajustó el layout de `/solo/play` para mantener visible el CTA de avance en móvil y evitar que quede fuera del área útil.
- Se actualizaron pruebas e2e y unitarias para cubrir visibilidad del CTA, feedback post-respuesta y calidad mínima de explicación.

## Novedades de UX y calidad (v0.9.6)
- El generador de preguntas ahora deduplica y valida opciones antes de renderizar cada pregunta para impedir alternativas repetidas (A/B/C/D siempre únicas).
- Si una combinación de datos no permite generar 4 alternativas únicas para un tipo de pregunta, se corta la generación con error explícito para proteger la calidad de la partida.
- Se agregaron pruebas unitarias para blindar la regla de opciones únicas y prevenir regresiones.

## Novedades de UX (v0.9.5)
- Nuevo bloque de diagnóstico en Ajustes para explicar por qué a veces se ve el README en lugar de la app y cómo corregirlo en GitHub Pages (URL correcta + fuente GitHub Actions).
- Se documenta explícitamente la URL esperada de GitHub Pages (`https://<tu-usuario>.github.io/trivia-hollywood/`) y dónde verificar la URL final publicada (`page_url` en Actions).
- En despliegue estático de GitHub Pages, multiplayer se conecta a backend externo si configuras `NEXT_PUBLIC_MULTIPLAYER_API_BASE_URL`; si falta, la UI informa el requisito y bloquea acciones para evitar errores.
- La pregunta en juego se muestra completa (sin truncado con puntos suspensivos).
- Las alternativas incorporan identificador visual A/B/C/D para mejorar escaneabilidad.
- El bloque de explicación final ahora se diferencia mejor con estilo y título explícito.
- Nueva acción de **Reanudar partida** en modo solo cuando hay progreso pendiente en el dispositivo.
- El avance de la partida (pregunta actual y respuestas) se persiste para continuar sin fricción tras recargar o cerrar accidentalmente.

- Multiplayer ahora permite crear sala privada real desde `/multiplayer` con capacidad configurable (2–8) y código corto único de 6 caracteres.
- Nuevo endpoint `POST /api/multiplayer/rooms` para persistir salas en estado `waiting` con validación de capacidad y reintentos por colisión de código.

- Multiplayer ahora permite buscar una sala privada por código y ver estado/cupos antes de unirse.
- Nuevo endpoint `GET /api/multiplayer/rooms/code?code=<ROOM_CODE>` para validar código, consultar sala y retornar disponibilidad en tiempo real.

- Join room ahora está habilitado end-to-end: búsqueda por código + ingreso con nombre + validación de estado/cupos en backend.
- Nuevo endpoint `POST /api/multiplayer/rooms/code?code=<ROOM_CODE>` para registrar jugador en salas `waiting`, validar nombre y bloquear salas llenas/ya iniciadas.

- Build de CI/servidor ahora conserva runtime (sin `output: "export"`) para que las API routes multiplayer funcionen en `next build`.
- Export estático para GitHub Pages se activa solo en el workflow de Pages (o con `STATIC_EXPORT=true`).
- Fix de build para GitHub Pages: se reemplazó la ruta dinámica `/api/multiplayer/rooms/[code]` por un endpoint estático con query (`/api/multiplayer/rooms/code?code=...`), evitando el error de export estático en `next build` durante Actions.
