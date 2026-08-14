import type { ResumeData } from '@/types/resume';
import type { SectionStatus } from '@/types/ats';

interface SectionCheckResult {
  sectionStatus: SectionStatus[];
  score: number; // 0–100
  completenessScore: number; // 0–100
}

const STANDARD_SECTION_HEADINGS: Record<string, string[]> = {
  summary: ['summary', 'professional summary', 'objective', 'about', 'profile', 'overview'],
  experience: ['experience', 'work experience', 'employment', 'work history', 'professional experience'],
  education: ['education', 'academic', 'qualification', 'degree'],
  skills: ['skills', 'technical skills', 'competencies', 'expertise', 'technologies'],
  projects: ['projects', 'personal projects', 'side projects', 'portfolio'],
  certifications: ['certifications', 'certificates', 'credentials', 'licenses', 'accreditations'],
  achievements: ['achievements', 'accomplishments', 'awards', 'honors', 'recognition'],
};

function detectExperienceLevel(resumeData: ResumeData): 'student' | 'junior' | 'experienced' {
  const expCount = resumeData.experience?.length || 0;
  const totalBullets = resumeData.experience?.reduce((a, e) => a + (e.bullets?.length || 0), 0) || 0;

  if (expCount === 0 && (resumeData.education?.length || 0) > 0) return 'student';
  if (expCount <= 1 && totalBullets < 5) return 'junior';
  return 'experienced';
}

export function checkSections(
  resumeData: ResumeData,
  resumeText: string
): SectionCheckResult {
  const level = detectExperienceLevel(resumeData);
  const statuses: SectionStatus[] = [];
  let totalScore = 0;
  let maxScore = 0;

  // Contact Information
  const hasContact =
    !!resumeData.personalInfo?.name &&
    !!resumeData.personalInfo?.email &&
    !!resumeData.personalInfo?.phone;
  const contactStatus: SectionStatus = {
    section: 'contact',
    label: 'Contact Information',
    status: hasContact ? 'present' : resumeData.personalInfo?.name ? 'needs-improvement' : 'missing',
    notes: !hasContact ? 'Missing phone or email' : undefined,
  };
  statuses.push(contactStatus);
  const contactWeight = 20;
  maxScore += contactWeight;
  totalScore += contactStatus.status === 'present' ? contactWeight : contactStatus.status === 'needs-improvement' ? contactWeight * 0.5 : 0;

  // Summary
  const hasSummary = !!resumeData.summary && resumeData.summary.trim().length > 30;
  const summaryStatus: SectionStatus = {
    section: 'summary',
    label: 'Professional Summary',
    status: hasSummary ? 'present' : resumeData.summary?.trim().length ? 'needs-improvement' : 'missing',
    notes: !hasSummary ? 'A strong summary (2–4 sentences) improves ATS keyword matching' : undefined,
  };
  statuses.push(summaryStatus);
  const summaryWeight = level === 'student' ? 8 : 12;
  maxScore += summaryWeight;
  totalScore += summaryStatus.status === 'present' ? summaryWeight : summaryStatus.status === 'needs-improvement' ? summaryWeight * 0.5 : 0;

  // Experience
  const expCount = resumeData.experience?.length || 0;
  const avgBullets = expCount > 0
    ? (resumeData.experience?.reduce((a, e) => a + (e.bullets?.length || 0), 0) || 0) / expCount
    : 0;
  const expStatus: SectionStatus = {
    section: 'experience',
    label: 'Work Experience',
    status:
      expCount === 0
        ? level === 'student'
          ? 'missing'
          : 'missing'
        : avgBullets < 2
        ? 'needs-improvement'
        : 'present',
    notes:
      expCount > 0 && avgBullets < 2
        ? 'Add at least 2–4 bullet points per role with quantified achievements'
        : undefined,
  };
  statuses.push(expStatus);
  const expWeight = level === 'student' ? 10 : 20;
  maxScore += expWeight;
  totalScore += expStatus.status === 'present' ? expWeight : expStatus.status === 'needs-improvement' ? expWeight * 0.5 : 0;

  // Education
  const eduCount = resumeData.education?.length || 0;
  const eduStatus: SectionStatus = {
    section: 'education',
    label: 'Education',
    status: eduCount > 0 ? 'present' : 'missing',
    notes: eduCount === 0 ? 'Education section is expected by most ATS systems' : undefined,
  };
  statuses.push(eduStatus);
  const eduWeight = level === 'student' ? 20 : 12;
  maxScore += eduWeight;
  totalScore += eduStatus.status === 'present' ? eduWeight : 0;

  // Skills
  const allSkills = resumeData.skills?.flatMap((s) => s.items) || [];
  const skillsStatus: SectionStatus = {
    section: 'skills',
    label: 'Skills',
    status:
      allSkills.length === 0
        ? 'missing'
        : allSkills.length < 4
        ? 'needs-improvement'
        : 'present',
    notes: allSkills.length < 4 ? 'Add more relevant technical skills for better keyword matching' : undefined,
  };
  statuses.push(skillsStatus);
  const skillsWeight = 15;
  maxScore += skillsWeight;
  totalScore += skillsStatus.status === 'present' ? skillsWeight : skillsStatus.status === 'needs-improvement' ? skillsWeight * 0.5 : 0;

  // Projects
  const projectCount = resumeData.projects?.length || 0;
  const projectStatus: SectionStatus = {
    section: 'projects',
    label: 'Projects',
    status:
      level === 'student'
        ? projectCount === 0
          ? 'missing'
          : 'present'
        : projectCount === 0
        ? 'needs-improvement'
        : 'present',
    notes:
      level === 'student' && projectCount === 0
        ? 'Projects are crucial for students to demonstrate hands-on skills'
        : undefined,
  };
  statuses.push(projectStatus);
  const projectWeight = level === 'student' ? 15 : 8;
  maxScore += projectWeight;
  totalScore += projectStatus.status === 'present' ? projectWeight : projectStatus.status === 'needs-improvement' ? projectWeight * 0.5 : 0;

  // Certifications
  const certCount = resumeData.certifications?.length || 0;
  const certStatus: SectionStatus = {
    section: 'certifications',
    label: 'Certifications',
    status: certCount > 0 ? 'present' : 'needs-improvement',
    notes: certCount === 0 ? 'Adding relevant certifications strengthens your profile' : undefined,
  };
  statuses.push(certStatus);
  const certWeight = level === 'student' ? 7 : 5;
  maxScore += certWeight;
  totalScore += certStatus.status === 'present' ? certWeight : certStatus.status === 'needs-improvement' ? certWeight * 0.3 : 0;

  // Achievements
  const achieveCount = resumeData.achievements?.length || 0;
  const achieveStatus: SectionStatus = {
    section: 'achievements',
    label: 'Achievements',
    status: achieveCount > 0 ? 'present' : 'needs-improvement',
    notes: achieveCount === 0 ? 'Achievements highlight impact beyond job duties' : undefined,
  };
  statuses.push(achieveStatus);
  const achieveWeight = level === 'experienced' ? 8 : 5;
  maxScore += achieveWeight;
  totalScore += achieveStatus.status === 'present' ? achieveWeight : achieveStatus.status === 'needs-improvement' ? achieveWeight * 0.3 : 0;

  const structureScore = Math.round((totalScore / maxScore) * 100);

  // Completeness — % of key sections present
  const presentCount = statuses.filter((s) => s.status === 'present').length;
  const completenessScore = Math.round((presentCount / statuses.length) * 100);

  return { sectionStatus: statuses, score: structureScore, completenessScore };
}
