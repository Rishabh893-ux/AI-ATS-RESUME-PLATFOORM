import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { ResumeData, ResumeTemplate, ResumeSection } from '@/types/resume';
import { nanoid } from 'nanoid';

const DEFAULT_RESUME: ResumeData = {
  title: 'Untitled Resume',
  template: 'professional',
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  achievements: [],
  sectionOrder: ['personal', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'achievements'],
};

interface ResumeStore {
  resume: ResumeData;
  isDirty: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  activeSection: ResumeSection;

  // Actions
  setResume: (resume: ResumeData) => void;
  updatePersonalInfo: (info: Partial<ResumeData['personalInfo']>) => void;
  updateSummary: (summary: string) => void;
  updateTemplate: (template: ResumeTemplate) => void;
  updateTitle: (title: string) => void;
  setSectionOrder: (order: ResumeSection[]) => void;
  setActiveSection: (section: ResumeSection) => void;
  setSaveStatus: (status: ResumeStore['saveStatus']) => void;
  setDirty: (dirty: boolean) => void;
  reset: () => void;

  // Experience
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<ResumeData['experience'][0]>) => void;
  removeExperience: (id: string) => void;
  reorderExperience: (fromIndex: number, toIndex: number) => void;
  addExpBullet: (expId: string, bullet?: string) => void;
  updateExpBullet: (expId: string, index: number, bullet: string) => void;
  removeExpBullet: (expId: string, index: number) => void;

  // Education
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<ResumeData['education'][0]>) => void;
  removeEducation: (id: string) => void;

  // Skills
  addSkillCategory: (category?: string) => void;
  updateSkillCategory: (id: string, data: Partial<ResumeData['skills'][0]>) => void;
  removeSkillCategory: (id: string) => void;
  addSkillItem: (categoryId: string, item: string) => void;
  removeSkillItem: (categoryId: string, item: string) => void;

  // Projects
  addProject: () => void;
  updateProject: (id: string, data: Partial<ResumeData['projects'][0]>) => void;
  removeProject: (id: string) => void;
  addProjectBullet: (projectId: string, bullet?: string) => void;
  updateProjectBullet: (projectId: string, index: number, bullet: string) => void;
  removeProjectBullet: (projectId: string, index: number) => void;

  // Certifications
  addCertification: () => void;
  updateCertification: (id: string, data: Partial<ResumeData['certifications'][0]>) => void;
  removeCertification: (id: string) => void;

  // Achievements
  addAchievement: () => void;
  updateAchievement: (id: string, data: Partial<ResumeData['achievements'][0]>) => void;
  removeAchievement: (id: string) => void;
}

export const useResumeStore = create<ResumeStore>()(
  subscribeWithSelector((set, get) => ({
    resume: DEFAULT_RESUME,
    isDirty: false,
    saveStatus: 'idle',
    activeSection: 'personal',

    setResume: (resume) => set({ resume, isDirty: false }),
    updatePersonalInfo: (info) =>
      set((s) => ({
        resume: { ...s.resume, personalInfo: { ...s.resume.personalInfo, ...info } },
        isDirty: true,
      })),
    updateSummary: (summary) =>
      set((s) => ({ resume: { ...s.resume, summary }, isDirty: true })),
    updateTemplate: (template) =>
      set((s) => ({ resume: { ...s.resume, template }, isDirty: true })),
    updateTitle: (title) =>
      set((s) => ({ resume: { ...s.resume, title }, isDirty: true })),
    setSectionOrder: (sectionOrder) =>
      set((s) => ({ resume: { ...s.resume, sectionOrder }, isDirty: true })),
    setActiveSection: (section) => set({ activeSection: section }),
    setSaveStatus: (saveStatus) => set({ saveStatus }),
    setDirty: (isDirty) => set({ isDirty }),
    reset: () => set({ resume: DEFAULT_RESUME, isDirty: false, saveStatus: 'idle' }),

    // ── Experience ────────────────────────────────────────────────────
    addExperience: () =>
      set((s) => ({
        resume: {
          ...s.resume,
          experience: [
            ...s.resume.experience,
            {
              id: nanoid(),
              jobTitle: '',
              company: '',
              location: '',
              startDate: '',
              endDate: '',
              current: false,
              bullets: [''],
            },
          ],
        },
        isDirty: true,
      })),
    updateExperience: (id, data) =>
      set((s) => ({
        resume: {
          ...s.resume,
          experience: s.resume.experience.map((e) =>
            e.id === id ? { ...e, ...data } : e
          ),
        },
        isDirty: true,
      })),
    removeExperience: (id) =>
      set((s) => ({
        resume: {
          ...s.resume,
          experience: s.resume.experience.filter((e) => e.id !== id),
        },
        isDirty: true,
      })),
    reorderExperience: (fromIndex, toIndex) =>
      set((s) => {
        const exp = [...s.resume.experience];
        const [moved] = exp.splice(fromIndex, 1);
        exp.splice(toIndex, 0, moved);
        return { resume: { ...s.resume, experience: exp }, isDirty: true };
      }),
    addExpBullet: (expId, bullet = '') =>
      set((s) => ({
        resume: {
          ...s.resume,
          experience: s.resume.experience.map((e) =>
            e.id === expId ? { ...e, bullets: [...e.bullets, bullet] } : e
          ),
        },
        isDirty: true,
      })),
    updateExpBullet: (expId, index, bullet) =>
      set((s) => ({
        resume: {
          ...s.resume,
          experience: s.resume.experience.map((e) => {
            if (e.id !== expId) return e;
            const bullets = [...e.bullets];
            bullets[index] = bullet;
            return { ...e, bullets };
          }),
        },
        isDirty: true,
      })),
    removeExpBullet: (expId, index) =>
      set((s) => ({
        resume: {
          ...s.resume,
          experience: s.resume.experience.map((e) => {
            if (e.id !== expId) return e;
            const bullets = e.bullets.filter((_, i) => i !== index);
            return { ...e, bullets };
          }),
        },
        isDirty: true,
      })),

    // ── Education ─────────────────────────────────────────────────────
    addEducation: () =>
      set((s) => ({
        resume: {
          ...s.resume,
          education: [
            ...s.resume.education,
            { id: nanoid(), degree: '', institution: '', location: '', startDate: '', endDate: '', gpa: '' },
          ],
        },
        isDirty: true,
      })),
    updateEducation: (id, data) =>
      set((s) => ({
        resume: {
          ...s.resume,
          education: s.resume.education.map((e) => (e.id === id ? { ...e, ...data } : e)),
        },
        isDirty: true,
      })),
    removeEducation: (id) =>
      set((s) => ({
        resume: {
          ...s.resume,
          education: s.resume.education.filter((e) => e.id !== id),
        },
        isDirty: true,
      })),

    // ── Skills ────────────────────────────────────────────────────────
    addSkillCategory: (category = 'Technical Skills') =>
      set((s) => ({
        resume: {
          ...s.resume,
          skills: [...s.resume.skills, { id: nanoid(), category, items: [] }],
        },
        isDirty: true,
      })),
    updateSkillCategory: (id, data) =>
      set((s) => ({
        resume: {
          ...s.resume,
          skills: s.resume.skills.map((c) => (c.id === id ? { ...c, ...data } : c)),
        },
        isDirty: true,
      })),
    removeSkillCategory: (id) =>
      set((s) => ({
        resume: {
          ...s.resume,
          skills: s.resume.skills.filter((c) => c.id !== id),
        },
        isDirty: true,
      })),
    addSkillItem: (categoryId, item) =>
      set((s) => ({
        resume: {
          ...s.resume,
          skills: s.resume.skills.map((c) =>
            c.id === categoryId ? { ...c, items: [...c.items, item] } : c
          ),
        },
        isDirty: true,
      })),
    removeSkillItem: (categoryId, item) =>
      set((s) => ({
        resume: {
          ...s.resume,
          skills: s.resume.skills.map((c) =>
            c.id === categoryId ? { ...c, items: c.items.filter((i) => i !== item) } : c
          ),
        },
        isDirty: true,
      })),

    // ── Projects ──────────────────────────────────────────────────────
    addProject: () =>
      set((s) => ({
        resume: {
          ...s.resume,
          projects: [
            ...s.resume.projects,
            { id: nanoid(), name: '', description: '', technologies: [], githubUrl: '', liveUrl: '', bullets: [] },
          ],
        },
        isDirty: true,
      })),
    updateProject: (id, data) =>
      set((s) => ({
        resume: {
          ...s.resume,
          projects: s.resume.projects.map((p) => (p.id === id ? { ...p, ...data } : p)),
        },
        isDirty: true,
      })),
    removeProject: (id) =>
      set((s) => ({
        resume: {
          ...s.resume,
          projects: s.resume.projects.filter((p) => p.id !== id),
        },
        isDirty: true,
      })),
    addProjectBullet: (projectId, bullet = '') =>
      set((s) => ({
        resume: {
          ...s.resume,
          projects: s.resume.projects.map((p) =>
            p.id === projectId ? { ...p, bullets: [...p.bullets, bullet] } : p
          ),
        },
        isDirty: true,
      })),
    updateProjectBullet: (projectId, index, bullet) =>
      set((s) => ({
        resume: {
          ...s.resume,
          projects: s.resume.projects.map((p) => {
            if (p.id !== projectId) return p;
            const bullets = [...p.bullets];
            bullets[index] = bullet;
            return { ...p, bullets };
          }),
        },
        isDirty: true,
      })),
    removeProjectBullet: (projectId, index) =>
      set((s) => ({
        resume: {
          ...s.resume,
          projects: s.resume.projects.map((p) => {
            if (p.id !== projectId) return p;
            return { ...p, bullets: p.bullets.filter((_, i) => i !== index) };
          }),
        },
        isDirty: true,
      })),

    // ── Certifications ────────────────────────────────────────────────
    addCertification: () =>
      set((s) => ({
        resume: {
          ...s.resume,
          certifications: [
            ...s.resume.certifications,
            { id: nanoid(), name: '', issuer: '', date: '', credentialUrl: '' },
          ],
        },
        isDirty: true,
      })),
    updateCertification: (id, data) =>
      set((s) => ({
        resume: {
          ...s.resume,
          certifications: s.resume.certifications.map((c) => (c.id === id ? { ...c, ...data } : c)),
        },
        isDirty: true,
      })),
    removeCertification: (id) =>
      set((s) => ({
        resume: {
          ...s.resume,
          certifications: s.resume.certifications.filter((c) => c.id !== id),
        },
        isDirty: true,
      })),

    // ── Achievements ─────────────────────────────────────────────────
    addAchievement: () =>
      set((s) => ({
        resume: {
          ...s.resume,
          achievements: [
            ...s.resume.achievements,
            { id: nanoid(), title: '', description: '', date: '' },
          ],
        },
        isDirty: true,
      })),
    updateAchievement: (id, data) =>
      set((s) => ({
        resume: {
          ...s.resume,
          achievements: s.resume.achievements.map((a) => (a.id === id ? { ...a, ...data } : a)),
        },
        isDirty: true,
      })),
    removeAchievement: (id) =>
      set((s) => ({
        resume: {
          ...s.resume,
          achievements: s.resume.achievements.filter((a) => a.id !== id),
        },
        isDirty: true,
      })),
  }))
);
