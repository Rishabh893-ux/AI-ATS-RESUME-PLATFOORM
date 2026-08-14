import { generateText, ANTI_FABRICATION_INSTRUCTION } from './gemini';
import type { ResumeData } from '@/types/resume';

export async function generateSummary(resumeData: ResumeData, targetRole?: string): Promise<string> {
  const context = buildResumeContext(resumeData);
  const role = targetRole || 'the position';

  const prompt = `
Generate a professional resume summary for ${role} using ONLY the following resume information.
The summary should be 3–4 concise sentences. Focus on years of experience (if available), key skills, and professional value.

Resume Information:
${context}

Write only the summary text. No labels, no quotes, no explanations.
`;

  return generateText(prompt, ANTI_FABRICATION_INSTRUCTION);
}

function buildResumeContext(resumeData: ResumeData): string {
  const lines: string[] = [];

  if (resumeData.personalInfo?.name) lines.push(`Name: ${resumeData.personalInfo.name}`);

  if (resumeData.experience?.length) {
    lines.push('\nWork Experience:');
    resumeData.experience.forEach((exp) => {
      lines.push(`- ${exp.jobTitle} at ${exp.company} (${exp.startDate} – ${exp.endDate || 'Present'})`);
      exp.bullets?.slice(0, 2).forEach((b) => lines.push(`  • ${b}`));
    });
  }

  if (resumeData.education?.length) {
    lines.push('\nEducation:');
    resumeData.education.forEach((edu) => {
      lines.push(`- ${edu.degree} from ${edu.institution}`);
    });
  }

  const allSkills = resumeData.skills?.flatMap((s) => s.items) || [];
  if (allSkills.length) {
    lines.push(`\nSkills: ${allSkills.slice(0, 20).join(', ')}`);
  }

  if (resumeData.projects?.length) {
    lines.push('\nProjects:');
    resumeData.projects.slice(0, 3).forEach((p) => {
      lines.push(`- ${p.name} (${p.technologies?.join(', ')})`);
    });
  }

  return lines.join('\n');
}
