import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IResume extends Document {
  userId: string;
  title: string;
  template: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    jobTitle: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    bullets: string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    location?: string;
    startDate: string;
    endDate?: string;
    gpa?: string;
  }>;
  skills: Array<{
    id: string;
    category: string;
    items: string[];
  }>;
  projects: Array<{
    id: string;
    name: string;
    description?: string;
    technologies: string[];
    githubUrl?: string;
    liveUrl?: string;
    bullets: string[];
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date?: string;
    credentialUrl?: string;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description?: string;
    date?: string;
  }>;
  sectionOrder: string[];
  atsScore?: number;
  lastAnalyzedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true, default: 'Untitled Resume' },
    template: { type: String, default: 'professional' },
    personalInfo: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      linkedin: String,
      github: String,
      portfolio: String,
    },
    summary: { type: String, default: '' },
    experience: [
      {
        id: String,
        jobTitle: String,
        company: String,
        location: String,
        startDate: String,
        endDate: String,
        current: { type: Boolean, default: false },
        bullets: [String],
      },
    ],
    education: [
      {
        id: String,
        degree: String,
        institution: String,
        location: String,
        startDate: String,
        endDate: String,
        gpa: String,
      },
    ],
    skills: [
      {
        id: String,
        category: String,
        items: [String],
      },
    ],
    projects: [
      {
        id: String,
        name: String,
        description: String,
        technologies: [String],
        githubUrl: String,
        liveUrl: String,
        bullets: [String],
      },
    ],
    certifications: [
      {
        id: String,
        name: String,
        issuer: String,
        date: String,
        credentialUrl: String,
      },
    ],
    achievements: [
      {
        id: String,
        title: String,
        description: String,
        date: String,
      },
    ],
    sectionOrder: {
      type: [String],
      default: ['personal', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'achievements'],
    },
    atsScore: Number,
    lastAnalyzedAt: Date,
  },
  { timestamps: true }
);

export const Resume = models.Resume || model<IResume>('Resume', ResumeSchema);
