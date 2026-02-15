# PRD · Trivia Hollywood

## Objetivo
App web mobile-first de trivia de películas de Hollywood con elegibilidad estricta: largometrajes USA con al menos una nominación al Oscar.

## Alcance MVP (Milestone 1)
- Modo Solo completo.
- 10 preguntas exactas.
- Feedback inmediato y resultados.
- Dataset real validado y seed reproducible.

## Pantallas
1. Home: CTA Solo / Multiplayer / Ajustes.
2. Solo Start: resumen corto + botón comenzar.
3. Solo Play: pregunta + 4 opciones + feedback + siguiente.
4. Solo Results: score, aciertos, tiempo.
5. Multiplayer placeholder para siguiente milestone.
6. Ajustes básicos informativos.

## Flujos
- Home -> Solo -> Start -> 10Q -> Results -> Replay.
- Home -> Multiplayer (placeholder de roadmap).

## Reglas
- 10 preguntas por partida.
- Sin vidas.
- Tipos:
  - Director
  - Actor/actriz
  - Año de estreno
  - Oscar (categoría/año/ganó vs nominada)
  - Intrusa (no nominada)
- Scoring: +100 correcta.

## Multiplayer MVP (Milestone 2)
- Sala privada (2–8), código, set congelado de 10 preguntas.
- Progreso asincrónico por jugador.
- Ranking por score, desempate por menor tiempo.
- Estados sala: waiting -> started -> finished.

## Accesibilidad
- Objetivos WCAG AA básicos en contraste.
- Componentes táctiles grandes.
- Foco visible por teclado.
- Textos breves con truncado en opciones.

## Telemetría MVP
- Eventos tipados:
  - `answer_submitted`
  - `game_finished`
  - `room_created` (milestone 2)
- Logger local (`console`) con interfaz desacoplada para integrar proveedor futuro.

## Métricas iniciales
- Completion rate de partidas solo.
- Distribución de score.
- Tiempo promedio por partida.
- Drop-off por índice de pregunta.
