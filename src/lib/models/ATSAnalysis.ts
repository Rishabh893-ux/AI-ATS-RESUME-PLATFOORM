import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IATSAnalysis extends Document {
  resumeId: string;
  userId: string;
  overallScore: number;
  scores: {
    readability: number;
    keywordRelevance: number;
    jobMatch: number;
    structure: number;
    formatting: number;
    content: number;
    completeness: number;
  };
  recommendations: Array<{
    id: string;
    severity: string;
    category: string;
    problem: string;
    explanation: string;
    suggestion: string;
    canAIFix: boolean;
  }>;
  keywords: {
    matched: Array<{ keyword: string; frequencyInJD?: number; frequencyInResume?: number; priority?: string; why?: string }>;
    missing: Array<{ keyword: string; frequencyInJD?: number; priority?: string; why?: string }>;
    partial: Array<{ keyword: string; frequencyInResume?: number; why?: string }>;
  };
  formattingIssues: Array<{
    id: string;
    type: string;
    description: string;
    why: string;
    recommendation: string;
    severity: string;
  }>;
  sectionStatus: Array<{
    section: string;
    label: string;
    status: string;
    notes?: string;
  }>;
  jobDescriptionUsed: boolean;
  createdAt: Date;
}

const ATSAnalysisSchema = new Schema<IATSAnalysis>(
  {
    resumeId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    overallScore: Number,
    scores: {
      readability: Number,
      keywordRelevance: Number,
      jobMatch: Number,
      structure: Number,
      formatting: Number,
      content: Number,
      completeness: Number,
    },
    recommendations: [Schema.Types.Mixed],
    keywords: {
      matched: [Schema.Types.Mixed],
      missing: [Schema.Types.Mixed],
      partial: [Schema.Types.Mixed],
    },
    formattingIssues: [Schema.Types.Mixed],
    sectionStatus: [Schema.Types.Mixed],
    jobDescriptionUsed: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ATSAnalysis =
  models.ATSAnalysis || model<IATSAnalysis>('ATSAnalysis', ATSAnalysisSchema);
