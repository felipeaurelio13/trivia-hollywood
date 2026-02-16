'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearSoloSession, loadSoloSession, saveSoloSession } from '@/lib/game/session';
import { computeScore } from '@/lib/game/scoring';
import { trackEvent } from '@/lib/analytics/events';

export default function SoloPlayPage() {
  const router = useRouter();
  const [showFeedback, setShowFeedback] = useState(false);
  const [session, setSession] = useState(loadSoloSession());

  useEffect(() => {
    if (!session) {
      router.replace('/solo');
    }
  }, [session, router]);

  const currentIndex = session?.currentQuestionIndex ?? 0;
  const answers = session?.answers ?? [];
  const question = useMemo(() => session?.questions[currentIndex], [session, currentIndex]);
  const selected = answers[currentIndex];
  const progressPercentage = session ? Math.round(((currentIndex + 1) / session.questions.length) * 100) : 0;
  const correctAnswers = session
    ? session.questions.reduce((total, currentQuestion, index) => {
        if (answers[index] === currentQuestion.correctIndex) {
          return total + 1;
        }

        return total;
      }, 0)
    : 0;

  useEffect(() => {
    setShowFeedback(selected !== undefined);
  }, [selected]);

  if (!session || !question) return null;

  const submitAnswer = (optionIndex: number) => {
    if (showFeedback) return;

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
  };

  const nextQuestion = () => {
    if (currentIndex === session.questions.length - 1) {
      const correctAnswers = session.questions.reduce(
        (total, q, index) => total + (answers[index] === q.correctIndex ? 1 : 0),
        0
      );
      const elapsedMs = Date.now() - session.startedAt;
      const result = {
        correctAnswers,
        totalQuestions: session.questions.length,
        score: computeScore(correctAnswers),
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
  };

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-3 py-1">
      <header className="space-y-2">
        <div className="space-y-1.5" aria-label="Progreso de partida">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-cyan-200">
            <span>Progreso</span>
            <span aria-live="polite">{progressPercentage}%</span>
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
        <p className="text-base font-semibold text-cyan-200">Pregunta {currentIndex + 1} de 10</p>
        <p className="text-sm font-medium text-slate-200" aria-live="polite">
          Aciertos actuales: <span className="font-bold text-cyan-100">{correctAnswers}</span>
        </p>
        <h1 className="text-xl font-semibold leading-snug">{question.prompt}</h1>
      </header>

      <div className="flex flex-col gap-2.5">
        {question.options.map((option, index) => {
          const isSelected = selected === index;
          const isCorrect = question.correctIndex === index;
          const disabled = showFeedback || selected !== undefined;
          return (
            <button
              key={`${question.id}-${option}`}
              type="button"
              aria-label={`Opción ${index + 1}: ${option}`}
              disabled={disabled}
              onClick={() => submitAnswer(index)}
              className={`rounded-2xl border-2 p-3 text-left text-base font-medium leading-snug transition ${
                showFeedback
                  ? isCorrect
                    ? 'border-emerald-300 bg-emerald-900/40 text-emerald-100'
                    : isSelected
                      ? 'border-rose-300 bg-rose-900/40 text-rose-100'
                      : 'border-slate-600 bg-slate-900 text-slate-100'
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
        {showFeedback ? (
          <div
            className="rounded-2xl border-2 border-cyan-500/70 bg-cyan-950/40 p-3 text-sm leading-relaxed text-cyan-50"
            role="status"
            aria-live="polite"
          >
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">
              {selected === question.correctIndex ? '¡Respuesta correcta!' : 'Respuesta incorrecta'}
            </p>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">Dato curioso</p>
            <p>{question.explanation}</p>
          </div>
        ) : null}

        <button
          type="button"
          onClick={nextQuestion}
          disabled={!showFeedback}
          className="h-14 w-full rounded-2xl border-2 border-cyan-300 bg-cyan-200 text-lg font-bold text-slate-950 shadow-sm disabled:opacity-60"
        >
          {currentIndex === 9 ? 'Ver resultados' : 'Siguiente pregunta'}
        </button>
      </div>
    </section>
  );
}
