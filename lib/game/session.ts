import { TriviaQuestion } from './types';

export interface SoloSession {
  sessionId: string;
  startedAt: number;
  questions: TriviaQuestion[];
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
    return JSON.parse(raw) as SoloSession;
  } catch {
    return null;
  }
}

export function clearSoloSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SOLO_SESSION_KEY);
}
