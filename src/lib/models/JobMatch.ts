import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IJobMatch extends Document {
  resumeId: string;
  userId: string;
  jobDescriptionText: string;
  jobTitle?: string;
  matchScore: number;
  scores: {
    skillsMatch: number;
    keywordMatch: number;
    experienceMatch: number;
    responsibilityMatch: number;
    semanticMatch: number;
  };
  matchedSkills: string[];
  missingSkills: string[];
  partialSkills: string[];
  keywords: object[];
  extractedRequirements?: object;
  createdAt: Date;
}

const JobMatchSchema = new Schema<IJobMatch>(
  {
    resumeId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    jobDescriptionText: { type: String, required: true },
    jobTitle: String,
    matchScore: Number,
    scores: {
      skillsMatch: Number,
      keywordMatch: Number,
      experienceMatch: Number,
      responsibilityMatch: Number,
      semanticMatch: Number,
    },
    matchedSkills: [String],
    missingSkills: [String],
    partialSkills: [String],
    keywords: [Schema.Types.Mixed],
    extractedRequirements: Schema.Types.Mixed,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const JobMatch = models.JobMatch || model<IJobMatch>('JobMatch', JobMatchSchema);
