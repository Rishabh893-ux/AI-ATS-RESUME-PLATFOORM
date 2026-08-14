import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IResumeVersion extends Document {
  resumeId: string;
  userId: string;
  versionNumber: number;
  label?: string;
  snapshot: object;
  createdAt: Date;
}

const ResumeVersionSchema = new Schema<IResumeVersion>(
  {
    resumeId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    versionNumber: { type: Number, required: true },
    label: String,
    snapshot: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ResumeVersion =
  models.ResumeVersion || model<IResumeVersion>('ResumeVersion', ResumeVersionSchema);
