'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearSoloSession, loadSoloSession, saveSoloSession } from '@/lib/game/session';
import { computeScore } from '@/lib/game/scoring';
import { trackEvent } from '@/lib/analytics/events';

function formatClock(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.max(0, totalSeconds % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function getQuestionTypeLabel(type: string) {
  const labels: Record<string, string> = {
    DIRECTOR: 'Director/a',
    CAST: 'Elenco',
    YEAR: 'Año de estreno',
    OSCAR: 'Oscars',
    INTRUDER: 'Película intrusa'
  };

  return labels[type] ?? 'Pregunta de cine';
}

export default function SoloPlayPage() {
  const router = useRouter();
  const [showFeedback, setShowFeedback] = useState(false);
  const [session, setSession] = useState(loadSoloSession());
  const [pendingAnswer, setPendingAnswer] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!session) {
      router.replace('/solo');
    }
  }, [session, router]);

  const currentIndex = session?.currentQuestionIndex ?? 0;
  const answers = useMemo(() => session?.answers ?? [], [session]);
  const question = useMemo(() => session?.questions[currentIndex], [session, currentIndex]);
  const selected = answers[currentIndex];
  const progressPercentage = session ? Math.round(((currentIndex + 1) / session.questions.length) * 100) : 0;
  const remainingQuestions = session ? session.questions.length - (currentIndex + 1) : 0;
  const correctAnswers = session
    ? session.questions.reduce((total, currentQuestion, index) => {
        if (answers[index] === currentQuestion.correctIndex) {
          return total + 1;
        }

        return total;
      }, 0)
    : 0;

  const submitAnswer = useCallback(
    (optionIndex: number) => {
      if (!session || !question || showFeedback) return;

      const updatedAnswers = [...answers];
      updatedAnswers[currentIndex] = optionIndex;

      const updatedSession = {
        ...session,
        answers: updatedAnswers
      };

      saveSoloSession(updatedSession);
      setSession(updatedSession);
      setShowFeedback(true);

      trackEvent('answer_submitted', {
        sessionId: session.sessionId,
        questionId: question.id,
        correct: optionIndex === question.correctIndex,
        questionType: question.type
      });
    },
    [answers, currentIndex, question, session, showFeedback]
  );

  const nextQuestion = useCallback(() => {
    if (!session) return;

    if (currentIndex === session.questions.length - 1) {
      const totalCorrectAnswers = session.questions.reduce(
        (total, currentQuestion, index) => total + (answers[index] === currentQuestion.correctIndex ? 1 : 0),
        0
      );
      const elapsedMs = Date.now() - session.startedAt;
      const result = {
        correctAnswers: totalCorrectAnswers,
        totalQuestions: session.questions.length,
        score: computeScore(totalCorrectAnswers),
        elapsedMs
      };
      localStorage.setItem('trivia_hollywood_last_result', JSON.stringify(result));
      trackEvent('game_finished', { ...result, sessionId: session.sessionId });
      clearSoloSession();
      router.push('/solo/results');
      return;
    }

    const updatedSession = {
      ...session,
      currentQuestionIndex: currentIndex + 1
    };

    saveSoloSession(updatedSession);
    setSession(updatedSession);
    setShowFeedback(false);
  }, [answers, currentIndex, router, session]);

  useEffect(() => {
    setShowFeedback(selected !== undefined);
    if (selected !== undefined) {
      setPendingAnswer(selected);
    } else {
      setPendingAnswer(null);
    }
  }, [selected]);

  useEffect(() => {
    if (!session) return;

    const tick = () => {
      setElapsedSeconds(Math.max(0, Math.round((Date.now() - session.startedAt) / 1000)));
    };

    tick();
    const intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
  }, [session]);

  useEffect(() => {
    if (!session || showFeedback) return;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [session, showFeedback]);

  useEffect(() => {
    if (!session) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const index = Number(event.key) - 1;
      if (index >= 0 && index <= 3 && !showFeedback) {
        setPendingAnswer(index);
      }

      if (event.key === 'Enter') {
        if (!showFeedback && pendingAnswer !== null) {
          submitAnswer(pendingAnswer);
          return;
        }

        if (showFeedback) {
          nextQuestion();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [nextQuestion, pendingAnswer, session, showFeedback, submitAnswer]);

  if (!session || !question) return null;

  const abandonGame = () => {
    if (!window.confirm('¿Seguro que quieres salir? Perderás el avance actual.')) {
      return;
    }

    clearSoloSession();
    router.push('/solo');
  };

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-3 py-1">
      <header className="space-y-2">
        <div className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-cyan-200">
          <span className="info-chip" aria-label={`Tiempo transcurrido ${formatClock(elapsedSeconds)}`}>
            {formatClock(elapsedSeconds)}
          </span>
          <button
            type="button"
            onClick={abandonGame}
            className="rounded-full border border-slate-400 bg-slate-900 px-3 py-1 text-slate-100"
          >
            Salir
          </button>
        </div>
        <div className="space-y-1.5" aria-label="Progreso de partida">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-cyan-200">
            <span>Progreso · {currentIndex + 1}/10</span>
            <span aria-live="polite">{progressPercentage}% completado</span>
          </div>
          <div
            role="progressbar"
            aria-label="Progreso de preguntas respondidas"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPercentage}
            className="h-2.5 overflow-hidden rounded-full border border-cyan-300/60 bg-slate-900"
          >
            <div className="h-full rounded-full bg-cyan-300 transition-all" style={{ width: `${progressPercentage}%` }} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-base font-semibold text-cyan-200">Pregunta {currentIndex + 1} de 10</p>
          <span className="info-chip">{getQuestionTypeLabel(question.type)}</span>
        </div>
        <p className="text-sm font-medium text-slate-200" aria-live="polite">
          Aciertos: <span className="font-bold text-cyan-100">{correctAnswers}</span> · Restan{' '}
          <span className="font-bold text-cyan-100">{remainingQuestions}</span>
        </p>
        <h1 className="text-xl font-semibold leading-snug">{question.prompt}</h1>
        <div className="flex flex-wrap gap-2" aria-label="Pasos de respuesta">
          <span className="info-chip">1) Selecciona</span>
          <span className="info-chip">2) Confirma</span>
        </div>
        <p className="text-sm text-slate-200" aria-live="polite">
          {showFeedback
            ? 'Revisa el resultado y continúa con Enter o tocando el botón de abajo.'
            : pendingAnswer === null
              ? 'Selecciona una alternativa para habilitar el botón de confirmar.'
              : `Opción ${String.fromCharCode(65 + pendingAnswer)} seleccionada. Puedes cambiarla antes de confirmar.`}
        </p>
      </header>

      <div className="flex flex-col gap-2.5">
        {question.options.map((option, index) => {
          const isSelected = (showFeedback ? selected : pendingAnswer) === index;
          const isCorrect = question.correctIndex === index;
          const disabled = showFeedback;
          return (
            <button
              key={`${question.id}-${option}`}
              type="button"
              aria-label={`Opción ${index + 1}: ${option}`}
              disabled={disabled}
              onClick={() => setPendingAnswer(index)}
              className={`rounded-2xl border-2 p-3 text-left text-base font-medium leading-snug transition ${
                showFeedback
                  ? isCorrect
                    ? 'border-emerald-300 bg-emerald-900/40 text-emerald-100'
                    : isSelected
                      ? 'border-rose-300 bg-rose-900/40 text-rose-100'
                      : 'border-slate-600 bg-slate-900 text-slate-100'
                  : isSelected
                    ? 'border-cyan-200 bg-cyan-950/60 text-cyan-50'
                    : 'border-slate-500 bg-slate-900 text-slate-100 hover:border-cyan-200'
              }`}
            >
              <span className="mb-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full border border-cyan-200/70 bg-cyan-900/40 text-sm font-bold text-cyan-100">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="block">{option}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto space-y-3 pb-1">
        {!showFeedback ? (
          <button
            type="button"
            disabled={pendingAnswer === null}
            onClick={() => {
              if (pendingAnswer === null) return;
              submitAnswer(pendingAnswer);
            }}
            className="btn-primary"
          >
            {pendingAnswer === null ? 'Selecciona una opción' : 'Confirmar respuesta'}
          </button>
        ) : null}
        {showFeedback ? (
          <div
            className="rounded-2xl border-2 border-cyan-500/70 bg-cyan-950/40 p-3 text-sm leading-relaxed text-cyan-50"
            role="status"
            aria-live="polite"
          >
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">
              {selected === question.correctIndex ? '¡Respuesta correcta!' : 'Respuesta incorrecta'}
            </p>
            {selected !== question.correctIndex ? (
              <p className="mb-1 text-xs font-semibold text-cyan-100">
                Respuesta correcta: {question.options[question.correctIndex]}
              </p>
            ) : null}
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">Dato curioso</p>
            <p>{question.explanation}</p>
          </div>
        ) : null}

        <button
          type="button"
          onClick={nextQuestion}
          disabled={!showFeedback}
          className="btn-primary"
        >
          {currentIndex === 9 ? 'Ver resultados' : 'Siguiente pregunta'}
        </button>
      </div>
    </section>
  );
}
