# Arquitectura · Trivia Hollywood

## Stack
- Next.js App Router + TypeScript.
- TailwindCSS.
- Zod.
- Prisma + SQLite (dev), migrable a Postgres.
- Guest identity via localStorage/cookie (MVP).
- Vitest + Playwright.

## Decisiones clave
1. **Server routes para generación**: `/api/solo/start` usa DB y genera set de preguntas.
2. **Persistencia de sesión solo en cliente** para MVP de velocidad de entrega.
3. **Modelo normalizado de Oscar nominations** para consultas de trivia y escalado multiplayer.
4. **Telemetría desacoplada**: interfaz local primero, proveedor real después.

## Modelo de datos actual
- `Movie`
  - metadatos de película (año, director, topCast, etc.)
- `OscarNomination`
  - `ceremonyYear`, `category`, `won`
  - relación muchos-a-uno con `Movie`

## Endpoints MVP
- `GET /api/solo/start`: retorna `sessionId`, `startedAt`, `questions[10]`.
- `POST /api/analytics`: recepción y log de eventos.
- `POST /api/multiplayer/rooms`: crea sala privada con código corto único y capacidad 2–8.

## Multiplayer (diseño Milestone 2)
Estados de sala:
- `waiting`: admite join (2–8).
- `started`: set congelado, partidas por jugador en progreso.
- `finished`: todos completan o expira timeout.

Entidades propuestas:
- `Room`
- `RoomPlayer`
- `RoomQuestionSet`
- `RoomRun`
- `RoomAnswer`

## Tradeoffs
- Guardar respuestas correctas en cliente simplifica MVP, pero no es anti-cheat.
- SQLite acelera iteración local; Postgres recomendado para multiplayer real.
- GitHub Pages no soporta backend Prisma directamente: requiere backend separado o despliegue serverful.
