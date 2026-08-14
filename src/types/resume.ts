// Resume Types
export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface ExperienceItem {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
}

export interface SkillCategory {
  id: string;
  category: string;
  items: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  bullets: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date?: string;
  credentialUrl?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description?: string;
  date?: string;
}

export type ResumeSection =
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'achievements';

export type ResumeTemplate =
  | 'classic'
  | 'professional'
  | 'modern'
  | 'minimal'
  | 'modern-minimal'
  | 'fresher'
  | 'software-developer';


export interface ResumeData {
  _id?: string;
  userId?: string;
  title: string;
  template: ResumeTemplate;
  personalInfo: PersonalInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  sectionOrder: ResumeSection[];
  atsScore?: number;
  lastAnalyzedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ResumeVersion {
  _id: string;
  resumeId: string;
  versionNumber: number;
  label?: string;
  snapshot: ResumeData;
  createdAt: string;
}
