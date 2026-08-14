import { generateText, ANTI_FABRICATION_INSTRUCTION } from './gemini';
import type { ResumeData } from '@/types/resume';

interface TailoringResult {
  summaryRewrite?: { original: string; suggestion: string; reason: string };
  bulletImprovements: Array<{
    experienceIndex: number;
    bulletIndex: number;
    original: string;
    suggestion: string;
    reason: string;
  }>;
  keywordsToAdd: string[];
  skillsToConsiderAdding: string[];
}

export async function tailorResume(
  resumeData: ResumeData,
  jobDescription: string
): Promise<TailoringResult> {
  const resumeText = serializeResume(resumeData);

  const prompt = `
You are helping tailor a resume to a job description.

JOB DESCRIPTION:
${jobDescription.slice(0, 2000)}

CURRENT RESUME:
${resumeText}

Generate specific tailoring suggestions. Return JSON with this structure:
{
  "summaryRewrite": {
    "original": "current summary text",
    "suggestion": "improved summary text",
    "reason": "why this change improves job match"
  },
  "bulletImprovements": [
    {
      "experienceIndex": 0,
      "bulletIndex": 0,
      "original": "original bullet",
      "suggestion": "improved bullet",
      "reason": "how this aligns with the job"
    }
  ],
  "keywordsToAdd": ["keyword1", "keyword2"],
  "skillsToConsiderAdding": ["skill1"]
}

Only suggest improvements for bullets that genuinely need it. If a bullet is already strong, skip it.
For skillsToConsiderAdding, only list skills that appeared in the JD and might be in the candidate's background based on their experience.
`;

  const text = await generateText(prompt, `
${ANTI_FABRICATION_INSTRUCTION}
For tailoring:
- Only suggest rewriting bullets that are weak or don't align with the JD
- Never fabricate technologies or experiences not present in the original resume
- For keywords to add: only suggest things genuinely present in the candidate's background
- For skills to consider adding: ONLY suggest if there's reasonable basis from their experience, and phrase as "If you have experience with X, consider adding it"
- Maximum 5 bullet improvements. Maximum 10 keywords. Maximum 5 skills.
`);

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch {}

  return {
    bulletImprovements: [],
    keywordsToAdd: [],
    skillsToConsiderAdding: [],
  };
}

function serializeResume(resumeData: ResumeData): string {
  const lines: string[] = [];

  lines.push(`Summary: ${resumeData.summary || '(none)'}`);

  if (resumeData.experience?.length) {
    lines.push('\nExperience:');
    resumeData.experience.forEach((exp, i) => {
      lines.push(`[${i}] ${exp.jobTitle} at ${exp.company}`);
      exp.bullets?.forEach((b, j) => lines.push(`  [${j}] ${b}`));
    });
  }

  const skills = resumeData.skills?.flatMap((s) => s.items) || [];
  if (skills.length) lines.push(`\nSkills: ${skills.join(', ')}`);

  return lines.join('\n');
}
