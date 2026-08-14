// ATS Analysis Types

export type RecommendationSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface ATSRecommendation {
  id: string;
  severity: RecommendationSeverity;
  category: string;
  problem: string;
  explanation: string;
  suggestion: string;
  canAIFix: boolean;
  dismissed?: boolean;
}

export interface KeywordMatch {
  keyword: string;
  status: 'matched' | 'missing' | 'partial';
  frequencyInJD?: number;
  frequencyInResume?: number;
  priority?: 'high' | 'medium' | 'low';
  locations?: string[];
  why?: string;
}

export interface FormattingIssue {
  id: string;
  type: string;
  description: string;
  why: string;
  recommendation: string;
  severity: RecommendationSeverity;
}

export interface SectionStatus {
  section: string;
  label: string;
  status: 'present' | 'needs-improvement' | 'missing';
  notes?: string;
}

export interface ATSScores {
  readability: number;
  keywordRelevance: number;
  jobMatch: number;
  structure: number;
  formatting: number;
  content: number;
  completeness: number;
}

export interface ATSAnalysis {
  _id?: string;
  resumeId: string;
  overallScore: number;
  scores: ATSScores;
  recommendations: ATSRecommendation[];
  keywords: {
    matched: KeywordMatch[];
    missing: KeywordMatch[];
    partial: KeywordMatch[];
  };
  formattingIssues: FormattingIssue[];
  sectionStatus: SectionStatus[];
  jobDescriptionUsed?: boolean;
  createdAt?: string;
}

// Job Match Types
export interface JobMatchScores {
  skillsMatch: number;
  keywordMatch: number;
  experienceMatch: number;
  responsibilityMatch: number;
  semanticMatch: number;
}

export interface JobMatch {
  _id?: string;
  resumeId: string;
  jobDescriptionText: string;
  jobTitle?: string;
  matchScore: number;
  scores: JobMatchScores;
  matchedSkills: string[];
  missingSkills: string[];
  partialSkills: string[];
  keywords: KeywordMatch[];
  extractedRequirements?: {
    required: string[];
    preferred: string[];
    experience?: string;
  };
  createdAt?: string;
}

// Score weights (configurable)
export interface ScoreWeights {
  readability: number;    // default 0.20
  keywordRelevance: number; // default 0.20
  jobMatch: number;       // default 0.20
  structure: number;      // default 0.15
  formatting: number;     // default 0.10
  content: number;        // default 0.10
  completeness: number;   // default 0.05
}
