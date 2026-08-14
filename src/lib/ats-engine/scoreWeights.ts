import type { ScoreWeights } from '@/types/ats';

export const DEFAULT_WEIGHTS: ScoreWeights = {
  readability: 0.20,
  keywordRelevance: 0.20,
  jobMatch: 0.20,
  structure: 0.15,
  formatting: 0.10,
  content: 0.10,
  completeness: 0.05,
};

export function calculateWeightedScore(
  scores: {
    readability: number;
    keywordRelevance: number;
    jobMatch: number;
    structure: number;
    formatting: number;
    content: number;
    completeness: number;
  },
  weights: ScoreWeights = DEFAULT_WEIGHTS
): number {
  const total =
    scores.readability * weights.readability +
    scores.keywordRelevance * weights.keywordRelevance +
    scores.jobMatch * weights.jobMatch +
    scores.structure * weights.structure +
    scores.formatting * weights.formatting +
    scores.content * weights.content +
    scores.completeness * weights.completeness;

  return Math.round(Math.min(100, Math.max(0, total)));
}
