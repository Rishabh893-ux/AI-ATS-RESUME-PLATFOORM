import { generateText, ANTI_FABRICATION_INSTRUCTION } from './gemini';
import type { ResumeData } from '@/types/resume';

const TONE_INSTRUCTIONS: Record<string, string> = {
  professional: 'Use a formal, polished, and professional tone.',
  confident: 'Use a bold, assertive, and self-assured tone — project confidence.',
  friendly: 'Use a warm, personable, and approachable tone while remaining professional.',
  concise: 'Be brief, direct, and clear. Keep the letter short — under 250 words.',
};

export async function generateCoverLetter(
  resumeData: ResumeData,
  jobDescription: string,
  targetRole?: string,
  companyName?: string,
  tone: string = 'professional'
): Promise<string> {
  const candidateName = resumeData.personalInfo?.name || 'the candidate';
  const role = targetRole || 'the position';
  const company = companyName || 'the company';
  const topSkills = resumeData.skills?.flatMap((s) => s.items).slice(0, 10).join(', ') || '';
  const experience = resumeData.experience?.slice(0, 2).map((e) => `${e.jobTitle} at ${e.company}`).join(', ') || '';
  const toneInstruction = TONE_INSTRUCTIONS[tone] || TONE_INSTRUCTIONS.professional;

  const prompt = `
Write a cover letter for ${candidateName} applying for: ${role} at ${company}.

Tone: ${toneInstruction}

Candidate Information:
- Name: ${candidateName}
- Key Experience: ${experience || 'see resume'}
- Key Skills: ${topSkills || 'see resume'}
- Summary: ${resumeData.summary?.slice(0, 300) || ''}

Job Description (excerpt):
${jobDescription.slice(0, 1500)}

Write a 3-paragraph cover letter:
1. Opening: Express interest in the role and ${company}, mention 1–2 relevant strengths
2. Middle: Connect specific experience and skills to the job requirements
3. Closing: Thank them, express enthusiasm for next steps, sign off with the candidate's name

${tone === 'concise' ? 'Keep under 250 words.' : 'Keep under 350 words.'}
`;

  return generateText(prompt, `
${ANTI_FABRICATION_INSTRUCTION}
For cover letters:
- Only mention experiences and skills that appear in the provided resume data
- Be specific but do not invent metrics or achievements
- Address the actual role and company mentioned
- Write in first person
- Do not start with "I am writing to" — use a more engaging opening
- Apply the tone instruction strictly
`);
}
