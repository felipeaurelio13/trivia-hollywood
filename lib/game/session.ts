import { TriviaQuestion } from './types';

export interface SoloSession {
  sessionId: string;
  startedAt: number;
  questions: TriviaQuestion[];
  currentQuestionIndex: number;
  answers: number[];
}

export const SOLO_SESSION_KEY = 'trivia_hollywood_solo_session';

export function saveSoloSession(session: SoloSession) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SOLO_SESSION_KEY, JSON.stringify(session));
}

export function loadSoloSession(): SoloSession | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(SOLO_SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<SoloSession>;
    if (!parsed.sessionId || !parsed.startedAt || !Array.isArray(parsed.questions)) {
      return null;
    }

    return {
      sessionId: parsed.sessionId,
      startedAt: parsed.startedAt,
      questions: parsed.questions,
      currentQuestionIndex: Math.max(0, parsed.currentQuestionIndex ?? 0),
      answers: Array.isArray(parsed.answers) ? parsed.answers : []
    };
  } catch {
    return null;
  }
}

export function clearSoloSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SOLO_SESSION_KEY);
}

export function hasInProgressSoloSession() {
  const session = loadSoloSession();
  if (!session) return false;
  return session.answers.length < session.questions.length;
}
