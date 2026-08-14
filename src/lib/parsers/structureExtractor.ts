import type { ResumeData, ExperienceItem, EducationItem, SkillCategory, ProjectItem, CertificationItem, AchievementItem } from '@/types/resume';
import { nanoid } from 'nanoid';

// Regex patterns for section detection
const SECTION_PATTERNS: Record<string, RegExp> = {
  summary: /^(?:summary|professional summary|objective|about me|profile|overview|career objective)\s*:?\s*$/im,
  experience: /^(?:experience|work experience|employment|work history|professional experience|career history)\s*:?\s*$/im,
  education: /^(?:education|academic background|qualifications|academic qualifications)\s*:?\s*$/im,
  skills: /^(?:skills|technical skills|competencies|expertise|core competencies|technologies|tech stack)\s*:?\s*$/im,
  projects: /^(?:projects|personal projects|side projects|portfolio|key projects)\s*:?\s*$/im,
  certifications: /^(?:certifications?|certificates?|credentials|licenses?|accreditations?)\s*:?\s*$/im,
  achievements: /^(?:achievements?|accomplishments?|awards?|honors?|recognition)\s*:?\s*$/im,
};

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
const LINKEDIN_REGEX = /linkedin\.com\/in\/[\w-]+/i;
const GITHUB_REGEX = /github\.com\/[\w-]+/i;
const URL_REGEX = /https?:\/\/[^\s]+/g;
const DATE_REGEX = /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4}\s*[-–]\s*(?:\d{4}|present|current)/gi;

export function extractStructuredData(rawText: string): Partial<ResumeData> {
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);

  // Extract personal info from the first few lines (before any section heading)
  const personalInfo = extractPersonalInfo(rawText, lines);

  // Split into sections
  const sections = detectSections(lines);

  // Parse each section
  const summary = parseSummary(sections.summary || '');
  const experience = parseExperience(sections.experience || '');
  const education = parseEducation(sections.education || '');
  const skills = parseSkills(sections.skills || '');
  const projects = parseProjects(sections.projects || '');
  const certifications = parseCertifications(sections.certifications || '');
  const achievements = parseAchievements(sections.achievements || '');

  return {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    achievements,
    sectionOrder: ['personal', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'achievements'],
  };
}

function extractPersonalInfo(text: string, lines: string[]) {
  const emailMatch = text.match(EMAIL_REGEX);
  const phoneMatch = text.match(PHONE_REGEX);
  const linkedinMatch = text.match(LINKEDIN_REGEX);
  const githubMatch = text.match(GITHUB_REGEX);

  // Name is typically the first non-empty line (before any section)
  const nameLine = lines.find(
    (l) =>
      l.length > 2 &&
      l.length < 60 &&
      !EMAIL_REGEX.test(l) &&
      !PHONE_REGEX.test(l) &&
      !l.toLowerCase().includes('http')
  );

  // Location: look for "City, State" or "City, Country" pattern
  const locationMatch = text.match(/[A-Z][a-z]+,\s+[A-Z][a-z]+(?:\s+\d{5})?/);

  return {
    name: nameLine || '',
    email: emailMatch ? emailMatch[0] : '',
    phone: phoneMatch ? phoneMatch[0] : '',
    location: locationMatch ? locationMatch[0] : '',
    linkedin: linkedinMatch ? `https://${linkedinMatch[0]}` : '',
    github: githubMatch ? `https://${githubMatch[0]}` : '',
    portfolio: '',
  };
}

function detectSections(lines: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  let currentSection: string | null = null;
  let currentLines: string[] = [];

  for (const line of lines) {
    let matched = false;
    for (const [section, pattern] of Object.entries(SECTION_PATTERNS)) {
      if (pattern.test(line)) {
        // Save previous section
        if (currentSection) {
          result[currentSection] = currentLines.join('\n');
        }
        currentSection = section;
        currentLines = [];
        matched = true;
        break;
      }
    }
    if (!matched && currentSection) {
      currentLines.push(line);
    }
  }

  // Save last section
  if (currentSection && currentLines.length > 0) {
    result[currentSection] = currentLines.join('\n');
  }

  return result;
}

function parseSummary(text: string): string {
  return text.trim();
}

function parseExperience(text: string): ExperienceItem[] {
  if (!text.trim()) return [];
  const experiences: ExperienceItem[] = [];

  // Split by company/role lines (heuristics)
  const lines = text.split('\n').filter(Boolean);
  let current: Partial<ExperienceItem> | null = null;
  let bullets: string[] = [];

  for (const line of lines) {
    const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || line.startsWith('–');
    const hasDate = DATE_REGEX.test(line);

    if (hasDate && !isBullet) {
      // Save previous experience
      if (current) {
        experiences.push({
          id: nanoid(),
          jobTitle: current.jobTitle || '',
          company: current.company || '',
          location: current.location || '',
          startDate: current.startDate || '',
          endDate: current.endDate || '',
          current: current.current || false,
          bullets,
        });
      }
      // Parse new entry
      const dateMatch = line.match(DATE_REGEX);
      const dateStr = dateMatch ? dateMatch[0] : '';
      const [start, end] = dateStr.split(/\s*[-–]\s*/);
      const isCurrent = /present|current/i.test(end || '');
      const title = line.replace(DATE_REGEX, '').replace(/[|,]/g, '').trim();

      current = {
        jobTitle: title.split(/\s{2,}|,/)[0]?.trim() || title,
        company: title.split(/\s{2,}|,/)[1]?.trim() || '',
        startDate: start?.trim() || '',
        endDate: isCurrent ? '' : (end?.trim() || ''),
        current: isCurrent,
      };
      bullets = [];
    } else if (isBullet && current) {
      bullets.push(line.replace(/^[•\-*–]\s*/, '').trim());
    } else if (current && !isBullet) {
      // Could be company name on separate line
      if (!current.company && !hasDate) {
        current.company = line.trim();
      }
    }
  }

  // Save last entry
  if (current) {
    experiences.push({
      id: nanoid(),
      jobTitle: current.jobTitle || '',
      company: current.company || '',
      location: current.location || '',
      startDate: current.startDate || '',
      endDate: current.endDate || '',
      current: current.current || false,
      bullets,
    });
  }

  return experiences;
}

function parseEducation(text: string): EducationItem[] {
  if (!text.trim()) return [];
  const educations: EducationItem[] = [];
  const lines = text.split('\n').filter(Boolean);

  let current: Partial<EducationItem> | null = null;

  for (const line of lines) {
    const hasDate = DATE_REGEX.test(line);
    const degreeKeywords = /bachelor|master|b\.?tech|m\.?tech|b\.?e|m\.?e|b\.?sc|m\.?sc|phd|doctorate|diploma|associate/i;

    if (degreeKeywords.test(line) || hasDate) {
      if (current && (current.degree || current.institution)) {
        educations.push({
          id: nanoid(),
          degree: current.degree || '',
          institution: current.institution || '',
          location: current.location || '',
          startDate: current.startDate || '',
          endDate: current.endDate || '',
          gpa: current.gpa || '',
        });
      }

      const dateMatch = line.match(DATE_REGEX);
      const dateStr = dateMatch ? dateMatch[0] : '';
      const [start, end] = dateStr.split(/\s*[-–]\s*/);
      const textWithoutDate = line.replace(DATE_REGEX, '').trim();

      const prev = current as Partial<EducationItem> | null;
      current = {
        degree: degreeKeywords.test(line) ? textWithoutDate : (prev?.degree || ''),
        institution: !degreeKeywords.test(line) ? textWithoutDate : (prev?.institution || ''),
        startDate: start?.trim() || '',
        endDate: end?.trim() || '',
      };
    } else if (current) {
      if (!current.institution && line.length > 3) {
        current.institution = line;
      }
      const gpaMatch = line.match(/(?:gpa|cgpa|grade)[:\s]+([0-9.]+)/i);
      if (gpaMatch) current.gpa = gpaMatch[1];
    }
  }

  if (current && (current.degree || current.institution)) {
    educations.push({
      id: nanoid(),
      degree: current.degree || '',
      institution: current.institution || '',
      location: current.location || '',
      startDate: current.startDate || '',
      endDate: current.endDate || '',
      gpa: current.gpa || '',
    });
  }

  return educations;
}

function parseSkills(text: string): SkillCategory[] {
  if (!text.trim()) return [];

  const categories: SkillCategory[] = [];
  const lines = text.split('\n').filter(Boolean);

  for (const line of lines) {
    // Try to detect "Category: skill1, skill2" pattern
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0 && colonIdx < 40) {
      const category = line.slice(0, colonIdx).trim();
      const items = line
        .slice(colonIdx + 1)
        .split(/[,|•]/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (items.length > 0) {
        categories.push({ id: nanoid(), category, items });
        continue;
      }
    }

    // Plain comma-separated skills
    const items = line.split(/[,|•]/).map((s) => s.trim()).filter(Boolean);
    if (items.length > 1) {
      categories.push({ id: nanoid(), category: 'Technical Skills', items });
    }
  }

  // Merge duplicate "Technical Skills" categories
  const merged: SkillCategory[] = [];
  const seen = new Map<string, number>();
  for (const cat of categories) {
    const key = cat.category.toLowerCase();
    if (seen.has(key)) {
      merged[seen.get(key)!].items.push(...cat.items);
    } else {
      seen.set(key, merged.length);
      merged.push({ ...cat, items: [...cat.items] });
    }
  }

  return merged;
}

function parseProjects(text: string): ProjectItem[] {
  if (!text.trim()) return [];
  const projects: ProjectItem[] = [];
  const lines = text.split('\n').filter(Boolean);
  let current: Partial<ProjectItem> | null = null;
  let bullets: string[] = [];

  for (const line of lines) {
    const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*');
    const hasGithub = GITHUB_REGEX.test(line);
    const techPattern = /(?:tech(?:nologies|nology|nical)?|built with|stack|tools?)[:\s]+/i;

    if (!isBullet && !techPattern.test(line) && !hasGithub && line.length < 80) {
      if (current) {
        projects.push({
          id: nanoid(),
          name: current.name || '',
          description: current.description || '',
          technologies: current.technologies || [],
          githubUrl: current.githubUrl || '',
          liveUrl: current.liveUrl || '',
          bullets,
        });
      }
      current = { name: line.trim(), technologies: [], bullets: [] };
      bullets = [];
    } else if (techPattern.test(line) && current) {
      const techStr = line.replace(techPattern, '');
      current.technologies = techStr.split(/[,|•]/).map((t) => t.trim()).filter(Boolean);
    } else if (hasGithub && current) {
      const m = line.match(GITHUB_REGEX);
      if (m) current.githubUrl = `https://${m[0]}`;
    } else if (isBullet && current) {
      bullets.push(line.replace(/^[•\-*]\s*/, '').trim());
    } else if (current && !current.description && line.length > 20) {
      current.description = line;
    }
  }

  if (current) {
    projects.push({
      id: nanoid(),
      name: current.name || '',
      description: current.description || '',
      technologies: current.technologies || [],
      githubUrl: current.githubUrl || '',
      liveUrl: current.liveUrl || '',
      bullets,
    });
  }

  return projects;
}

function parseCertifications(text: string): CertificationItem[] {
  if (!text.trim()) return [];
  return text
    .split('\n')
    .filter(Boolean)
    .map((line) => ({
      id: nanoid(),
      name: line.replace(/^[•\-*]\s*/, '').trim(),
      issuer: '',
      date: '',
      credentialUrl: '',
    }))
    .filter((c) => c.name.length > 3);
}

function parseAchievements(text: string): AchievementItem[] {
  if (!text.trim()) return [];
  return text
    .split('\n')
    .filter(Boolean)
    .map((line) => ({
      id: nanoid(),
      title: line.replace(/^[•\-*]\s*/, '').trim(),
      description: '',
      date: '',
    }))
    .filter((a) => a.title.length > 3);
}
