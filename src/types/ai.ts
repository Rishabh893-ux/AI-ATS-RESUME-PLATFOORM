// AI Feature Types

export interface AISuggestion {
  original: string;
  suggestion: string;
  problems?: string[];
  improvements?: string[];
  accepted?: boolean;
  rejected?: boolean;
}

export interface BulletAnalysis {
  hasActionVerb: boolean;
  hasQuantification: boolean;
  hasTechDetail: boolean;
  clarity: number; // 1–5
  conciseness: number; // 1–5
  problems: string[];
}

export interface AITailoringResult {
  summary?: AISuggestion;
  bullets: Array<{
    sectionId: string;
    bulletIndex: number;
    original: string;
    suggestion: string;
    reason: string;
  }>;
  skillsToAdd: string[];
  keywordsToAdd: string[];
}

export interface CoverLetter {
  _id?: string;
  resumeId: string;
  jobDescriptionText: string;
  content: string;
  targetRole?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type AILoadingState = 'idle' | 'loading' | 'streaming' | 'done' | 'error';
