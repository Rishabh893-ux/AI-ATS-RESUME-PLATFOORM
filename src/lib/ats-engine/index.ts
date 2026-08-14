// Main ATS Analysis Orchestrator

import type { ResumeData } from '@/types/resume';
import type { ATSAnalysis, ATSRecommendation, KeywordMatch } from '@/types/ats';
import { checkFormatting } from './formattingChecker';
import { checkSections } from './sectionChecker';
import { extractKeywordsFromText, extractResumeSkills, getKeywordFrequency } from './keywordExtractor';
import { semanticSimilarityScore, extractJDKeywords } from './semanticMatcher';
import { calculateWeightedScore } from './scoreWeights';
import { nanoid } from 'nanoid';

interface AnalysisOptions {
  resumeText: string;
  resumeData: ResumeData;
  jobDescription?: string;
  llmContentScore?: number; // 0–100 from Gemini qualitative analysis
  fileType?: 'pdf' | 'docx';
}

export async function runATSAnalysis(
  resumeId: string,
  options: AnalysisOptions
): Promise<ATSAnalysis> {
  const { resumeText, resumeData, jobDescription, llmContentScore, fileType } = options;

  // ── Signal A: Formatting (Deterministic) ─────────────────────────────
  const formattingResult = checkFormatting(resumeText, resumeData, fileType);

  // ── Signal A: Section Check (Deterministic) ───────────────────────────
  const sectionResult = checkSections(resumeData, resumeText);

  // ── Signal B: Keyword Analysis ────────────────────────────────────────
  const resumeKeywords = extractResumeSkills(resumeData);
  const resumeKeywordsInText = extractKeywordsFromText(resumeText);
  const allResumeKeywords = [...new Set([...resumeKeywords, ...resumeKeywordsInText])];

  let keywordScore = Math.min(100, allResumeKeywords.length * 4);

  // ── Signal C: Job Match (Semantic + Keyword) ─────────────────────────
  let jobMatchScore = 70; // neutral when no JD provided
  let semanticScore = 70;
  let matchedKeywords: KeywordMatch[] = [];
  let missingKeywords: KeywordMatch[] = [];
  let partialKeywords: KeywordMatch[] = [];

  if (jobDescription) {
    const jdData = extractJDKeywords(jobDescription);
    const jdKeywords = extractKeywordsFromText(jobDescription);
    semanticScore = semanticSimilarityScore(resumeText, jobDescription);

    // Keyword matching
    for (const kw of jdKeywords) {
      const inResume = allResumeKeywords.some(
        (rk) => rk.toLowerCase().includes(kw.toLowerCase()) || kw.toLowerCase().includes(rk.toLowerCase())
      );
      const freqJD = getKeywordFrequency(jobDescription, kw);
      const freqResume = getKeywordFrequency(resumeText, kw);

      if (freqResume > 0) {
        matchedKeywords.push({
          keyword: kw,
          status: 'matched',
          frequencyInJD: freqJD,
          frequencyInResume: freqResume,
          priority: freqJD >= 2 ? 'high' : 'medium',
        });
      } else if (inResume) {
        partialKeywords.push({
          keyword: kw,
          status: 'partial',
          frequencyInJD: freqJD,
          frequencyInResume: 0,
        });
      } else {
        missingKeywords.push({
          keyword: kw,
          status: 'missing',
          frequencyInJD: freqJD,
          priority: freqJD >= 2 ? 'high' : 'low',
          why: `Not detected in your resume. If you have experience with ${kw}, consider adding it to your Skills or relevant sections.`,
        });
      }
    }

    const totalJDKeywords = jdKeywords.length || 1;
    keywordScore = Math.round((matchedKeywords.length / totalJDKeywords) * 100);
    jobMatchScore = Math.round((semanticScore * 0.5) + (keywordScore * 0.5));
  } else {
    // No JD: show resume keywords as "matched"
    matchedKeywords = allResumeKeywords.slice(0, 20).map((kw) => ({
      keyword: kw,
      status: 'matched' as const,
      frequencyInResume: getKeywordFrequency(resumeText, kw),
      priority: 'medium' as const,
    }));
  }

  // ── Signal D: LLM Content Quality ────────────────────────────────────
  const contentScore = llmContentScore ?? estimateContentScore(resumeData);

  // ── ATS Readability Score ─────────────────────────────────────────────
  const readabilityScore = calculateReadabilityScore(resumeText, resumeData);

  // ── Combine all scores ────────────────────────────────────────────────
  const scores = {
    readability: readabilityScore,
    keywordRelevance: keywordScore,
    jobMatch: jobMatchScore,
    structure: sectionResult.score,
    formatting: formattingResult.score,
    content: contentScore,
    completeness: sectionResult.completenessScore,
  };

  const overallScore = calculateWeightedScore(scores);

  // ── Build Recommendations ─────────────────────────────────────────────
  const recommendations = buildRecommendations(
    resumeData,
    formattingResult.issues,
    sectionResult.sectionStatus,
    matchedKeywords,
    missingKeywords,
    scores
  );

  return {
    resumeId,
    overallScore,
    scores,
    recommendations,
    keywords: {
      matched: matchedKeywords,
      missing: missingKeywords,
      partial: partialKeywords,
    },
    formattingIssues: formattingResult.issues,
    sectionStatus: sectionResult.sectionStatus,
    jobDescriptionUsed: !!jobDescription,
  };
}

function calculateReadabilityScore(text: string, resumeData: ResumeData): number {
  let score = 100;

  // Text length check
  if (text.length < 300) score -= 30;
  else if (text.length < 600) score -= 10;

  // Contact info present
  if (!resumeData.personalInfo?.email) score -= 10;
  if (!resumeData.personalInfo?.phone) score -= 5;

  // Text extractable (non-empty)
  if (text.trim().length === 0) score = 0;

  return Math.max(0, score);
}

function estimateContentScore(resumeData: ResumeData): number {
  let score = 50; // baseline

  // Has bullets with action verbs
  const actionVerbs = [
    'developed', 'built', 'created', 'designed', 'implemented', 'improved',
    'led', 'managed', 'architected', 'optimized', 'reduced', 'increased',
    'delivered', 'launched', 'collaborated', 'engineered', 'automated',
  ];

  let bulletCount = 0;
  let actionVerbCount = 0;

  resumeData.experience?.forEach((exp) => {
    exp.bullets?.forEach((b) => {
      bulletCount++;
      const lower = b.toLowerCase();
      if (actionVerbs.some((v) => lower.startsWith(v))) actionVerbCount++;
    });
  });

  if (bulletCount > 0) {
    const actionRatio = actionVerbCount / bulletCount;
    score += Math.round(actionRatio * 30);
  }

  // Summary quality
  if (resumeData.summary && resumeData.summary.length > 100) score += 10;
  else if (resumeData.summary && resumeData.summary.length > 50) score += 5;

  // Project descriptions
  const projectsWithDesc = resumeData.projects?.filter(
    (p) => p.description && p.description.length > 30
  ).length || 0;
  score += Math.min(10, projectsWithDesc * 3);

  return Math.min(100, score);
}

function buildRecommendations(
  resumeData: ResumeData,
  formattingIssues: Array<{ id: string; type: string; description: string; severity: string; recommendation: string }>,
  sectionStatus: Array<{ section: string; label: string; status: string; notes?: string }>,
  matchedKeywords: KeywordMatch[],
  missingKeywords: KeywordMatch[],
  scores: Record<string, number>
): ATSRecommendation[] {
  const recs: ATSRecommendation[] = [];

  // From formatting issues
  for (const issue of formattingIssues) {
    recs.push({
      id: nanoid(),
      severity: issue.severity as ATSRecommendation['severity'],
      category: 'Formatting',
      problem: issue.description,
      explanation: issue.recommendation,
      suggestion: issue.recommendation,
      canAIFix: false,
    });
  }

  // From missing sections
  for (const sec of sectionStatus) {
    if (sec.status === 'missing') {
      recs.push({
        id: nanoid(),
        severity: 'high',
        category: 'Sections',
        problem: `${sec.label} section is missing`,
        explanation: `The ${sec.label} section is expected by most ATS systems. ${sec.notes || ''}`,
        suggestion: `Add a ${sec.label} section to your resume.`,
        canAIFix: sec.section === 'summary',
      });
    } else if (sec.status === 'needs-improvement' && sec.notes) {
      recs.push({
        id: nanoid(),
        severity: 'medium',
        category: 'Sections',
        problem: `${sec.label} needs improvement`,
        explanation: sec.notes,
        suggestion: sec.notes,
        canAIFix: sec.section === 'summary',
      });
    }
  }

  // Weak bullets check
  const weakBullets: string[] = [];
  resumeData.experience?.forEach((exp) => {
    exp.bullets?.forEach((b) => {
      const lower = b.toLowerCase();
      if (
        lower.startsWith('worked on') ||
        lower.startsWith('responsible for') ||
        lower.startsWith('helped') ||
        lower.startsWith('assisted') ||
        b.length < 30
      ) {
        weakBullets.push(b.slice(0, 60));
      }
    });
  });

  if (weakBullets.length > 0) {
    recs.push({
      id: nanoid(),
      severity: 'high',
      category: 'Content',
      problem: `${weakBullets.length} experience bullet${weakBullets.length > 1 ? 's' : ''} contain weak or generic wording`,
      explanation:
        'Bullets starting with "Worked on", "Responsible for", or "Helped" lack specificity. Strong bullets use action verbs + technology + measurable impact.',
      suggestion: 'Rewrite bullets to start with strong action verbs (Developed, Built, Optimized) and include specific technologies and outcomes.',
      canAIFix: true,
    });
  }

  // Missing high-priority keywords from JD
  const highPriorityMissing = missingKeywords.filter((k) => k.priority === 'high');
  if (highPriorityMissing.length > 0) {
    recs.push({
      id: nanoid(),
      severity: 'high',
      category: 'Keywords',
      problem: `${highPriorityMissing.length} high-priority keywords from the job description were not detected in your resume`,
      explanation:
        'Keywords that appear frequently in the job description are likely required competencies. Not having them may cause ATS systems to rank your resume lower.',
      suggestion: `If you have experience with these skills, add them to your Skills section or mention them in your experience bullets: ${highPriorityMissing.map((k) => k.keyword).join(', ')}`,
      canAIFix: true,
    });
  }

  // No LinkedIn
  if (!resumeData.personalInfo?.linkedin) {
    recs.push({
      id: nanoid(),
      severity: 'low',
      category: 'Contact',
      problem: 'LinkedIn URL not found',
      explanation:
        'Including a LinkedIn profile URL allows recruiters to learn more about you and validates your professional presence.',
      suggestion: 'Add your LinkedIn profile URL to your contact information section.',
      canAIFix: false,
    });
  }

  // Sort by severity
  const severityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  return recs.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}
