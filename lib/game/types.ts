export type QuestionType = 'DIRECTOR' | 'CAST' | 'YEAR' | 'OSCAR' | 'INTRUDER';

export interface TriviaQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  movieTitle: string;
}

export interface GameResult {
  correctAnswers: number;
  score: number;
  totalQuestions: number;
  elapsedMs: number;
}

export interface MovieRecord {
  id: string;
  title: string;
  releaseYear: number;
  decade: string;
  director: string;
  topCast: string;
  nominations: { ceremonyYear: number; category: string; won: boolean }[];
}
