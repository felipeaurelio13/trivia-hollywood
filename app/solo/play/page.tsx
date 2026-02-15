'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearSoloSession, loadSoloSession, saveSoloSession } from '@/lib/game/session';
import { computeScore } from '@/lib/game/scoring';
import { trackEvent } from '@/lib/analytics/events';

export default function SoloPlayPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [session, setSession] = useState(loadSoloSession());

  useEffect(() => {
    if (!session) {
      router.replace('/solo');
    }
  }, [session, router]);

  const question = useMemo(() => session?.questions[currentIndex], [session, currentIndex]);

  if (!session || !question) return null;

  const submitAnswer = (optionIndex: number) => {
    const updated = [...answers, optionIndex];
    setAnswers(updated);
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

    setCurrentIndex((prev) => prev + 1);
    setShowFeedback(false);
    const updatedSession = { ...session };
    saveSoloSession(updatedSession);
    setSession(updatedSession);
  };

  const selected = answers[currentIndex];

  return (
    <section className="flex min-h-[calc(100dvh-7rem)] flex-col gap-3 overflow-hidden py-1">
      <header className="space-y-1">
        <p className="text-xs text-cyan-300">Pregunta {currentIndex + 1}/10</p>
        <h1 className="line-clamp-2 text-lg font-semibold">{question.prompt}</h1>
      </header>

      <div className="grid flex-1 grid-rows-4 gap-2">
        {question.options.map((option, index) => {
          const isSelected = selected === index;
          const isCorrect = question.correctIndex === index;
          const disabled = showFeedback;
          return (
            <button
              key={`${question.id}-${option}`}
              type="button"
              aria-label={`Opción ${index + 1}: ${option}`}
              disabled={disabled}
              onClick={() => submitAnswer(index)}
              className={`rounded-2xl border p-3 text-left text-sm transition ${
                showFeedback
                  ? isCorrect
                    ? 'border-emerald-400 bg-emerald-900/30'
                    : isSelected
                      ? 'border-rose-400 bg-rose-900/30'
                      : 'border-slate-700 bg-slate-900'
                  : 'border-slate-700 bg-slate-900 active:scale-[0.99]'
              }`}
            >
              <span className="line-clamp-2">{option}</span>
            </button>
          );
        })}
      </div>

      <div className="min-h-16 rounded-xl bg-slate-900 p-3 text-xs text-slate-300">
        {showFeedback ? question.explanation : 'Selecciona una opción para recibir feedback inmediato.'}
      </div>

      <button
        type="button"
        onClick={nextQuestion}
        disabled={!showFeedback}
        className="h-12 rounded-2xl bg-cyan-500 text-base font-semibold text-slate-950 disabled:opacity-50"
      >
        {currentIndex === 9 ? 'Ver resultados' : 'Siguiente'}
      </button>
    </section>
  );
}
