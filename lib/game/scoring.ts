export const POINTS_PER_CORRECT = 100;

export function computeScore(correctAnswers: number): number {
  return correctAnswers * POINTS_PER_CORRECT;
}
