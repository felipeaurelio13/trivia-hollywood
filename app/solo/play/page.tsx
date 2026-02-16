'use client';

import { useEffect, useMemo, useState } from 'react';
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
    <section className="flex min-h-[calc(100dvh-8rem)] flex-col gap-4 overflow-hidden py-2">
      <header className="space-y-2">
        <p className="text-base font-semibold text-cyan-200">Pregunta {currentIndex + 1} de 10</p>
        <h1 className="text-xl font-semibold leading-snug sm:text-2xl">{question.prompt}</h1>
      </header>

      <div className="grid flex-1 grid-rows-4 gap-3">
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
              className={`rounded-2xl border-2 p-4 text-left text-lg font-medium leading-snug transition ${
                showFeedback
                  ? isCorrect
                    ? 'border-emerald-300 bg-emerald-900/40 text-emerald-100'
                    : isSelected
                      ? 'border-rose-300 bg-rose-900/40 text-rose-100'
                      : 'border-slate-600 bg-slate-900 text-slate-100'
                  : 'border-slate-500 bg-slate-900 text-slate-100 hover:border-cyan-200'
              }`}
            >
              <span className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-cyan-200/70 bg-cyan-900/40 text-sm font-bold text-cyan-100">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="block">{option}</span>
            </button>
          );
        })}
      </div>

      <div className="min-h-20 rounded-2xl border-2 border-cyan-500/70 bg-cyan-950/40 p-4 text-base leading-relaxed text-cyan-50">
        <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-cyan-200">Explicación</p>
        <p>{showFeedback ? question.explanation : 'Selecciona una opción para ver la explicación inmediata.'}</p>
      </div>

      <button
        type="button"
        onClick={nextQuestion}
        disabled={!showFeedback}
        className="h-16 rounded-2xl border-2 border-cyan-300 bg-cyan-200 text-lg font-bold text-slate-950 shadow-sm disabled:opacity-60"
      >
        {currentIndex === 9 ? 'Ver resultados' : 'Siguiente pregunta'}
      </button>
    </section>
  );
}
