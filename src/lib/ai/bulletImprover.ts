import { generateJSON, ANTI_FABRICATION_INSTRUCTION } from './gemini';

interface BulletAnalysisResult {
  problems: string[];
  improvedBullet: string;
  improvements: string[];
}

export async function improveBullet(
  bullet: string,
  context?: { jobTitle?: string; company?: string; technologies?: string[] }
): Promise<BulletAnalysisResult> {
  const contextStr = context
    ? `Context: ${context.jobTitle || ''} at ${context.company || ''}. Technologies used: ${context.technologies?.join(', ') || 'not specified'}.`
    : '';

  const prompt = `
Original bullet point: "${bullet}"
${contextStr}

Analyze and improve this resume bullet point. Only use the information provided. Do NOT add technologies, metrics, or details not implied by the original text.

Return JSON with this exact structure:
{
  "problems": ["list of specific problems with the original bullet"],
  "improvedBullet": "the improved bullet point text",
  "improvements": ["list of what was improved and why"]
}
`;

  return generateJSON<BulletAnalysisResult>(prompt, `
${ANTI_FABRICATION_INSTRUCTION}
Additional rules for bullet improvement:
- Start with a strong action verb (Developed, Built, Implemented, Designed, Led, Optimized, etc.)
- Keep the same meaning — only improve clarity, specificity, and professionalism
- Do NOT add fake percentages, numbers, or team sizes that aren't in the original
- If the original mentions a technology, keep it. Do not add unlisted technologies.
- Keep it to 1–2 lines maximum
`);
}
