import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface ICoverLetter extends Document {
  resumeId: string;
  userId: string;
  jobDescriptionText: string;
  targetRole?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const CoverLetterSchema = new Schema<ICoverLetter>(
  {
    resumeId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    jobDescriptionText: String,
    targetRole: String,
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const CoverLetter =
  models.CoverLetter || model<ICoverLetter>('CoverLetter', CoverLetterSchema);
