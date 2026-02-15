# TODO · Trivia Hollywood

## Milestone 1 — MVP Solo (esta sesión)
- [x] Scaffold Next.js + TypeScript + Tailwind + Prisma + Zod.
- [x] Definir esquema de datos `Movie` y `OscarNomination`.
- [x] Crear seed real en `data/movies.sample.json` (solo películas USA con >=1 nominación Oscar).
- [x] Flujo Solo completo: start -> 10 preguntas -> resultados.
- [x] Generador de 10 preguntas con mezcla A/B/C/D/E.
- [x] Feedback inmediato con explicación breve.
- [x] Scoring +100 por correcta.
- [x] Footer con versión visible.
- [x] Tests unitarios para scoring/generador/seed schema.
- [x] E2E base para navegación home -> solo.

## Milestone 2 — Multiplayer asincrónico (2–8)
- [ ] Modelo `Room`, `RoomPlayer`, `RoomRun`, `RoomQuestionSet`.
- [ ] Crear sala privada con código corto.
- [ ] Join room con validación de capacidad (2–8).
- [ ] Lobby con estado `waiting` y lista de jugadores.
- [ ] Congelar set de 10 preguntas al iniciar sala.
- [ ] Juego asincrónico por jugador + persistencia de respuestas/tiempo.
- [ ] Leaderboard final por score y desempate por menor tiempo.
- [ ] Estado `finished` por completitud o timeout.
- [ ] Evento analytics `room_created` + eventos de room lifecycle.
- [ ] Tests unit/e2e del flujo create/join/play/ranking.

## Milestone 3 — Live Arena (posterior)
- [ ] Diseño de canal realtime (WebSocket/SSE).
- [ ] Presencia online y sincronización de ronda.
- [ ] Timer global y bonus por rapidez.
- [ ] Anti-cheat básico (server-authoritative).
- [ ] Escalabilidad y observabilidad.

## Cómo continuar en próxima sesión
- Prompt 1: `Implementa el siguiente ítem no marcado de Milestone 2 y actualiza tests/documentación.`
- Prompt 2: `Avanza con el flujo create/join/lobby multiplayer, sin romper mobile-first ni accesibilidad.`
