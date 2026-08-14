import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/getAuthUser';
import { connectDB } from '@/lib/db/mongoose';
import { Resume } from '@/lib/models/Resume';
import { JobMatch as JobMatchModel } from '@/lib/models/JobMatch';
import { extractKeywordsFromText, extractResumeSkills, getKeywordFrequency } from '@/lib/ats-engine/keywordExtractor';
import { semanticSimilarityScore, extractJDKeywords } from '@/lib/ats-engine/semanticMatcher';
import type { ResumeData } from '@/types/resume';

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const { resumeId, jobDescription } = await req.json();

  if (!jobDescription?.trim()) {
    return NextResponse.json({ error: 'Job description is required' }, { status: 400 });
  }

  const resume = await Resume.findOne({ _id: resumeId, userId: user.id }).lean();
  if (!resume) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });

  const resumeData = resume as unknown as ResumeData;
  const resumeText = buildResumeText(resumeData);

  // Extract skills from resume
  const resumeSkills = extractResumeSkills(resumeData);
  const resumeKeywords = extractKeywordsFromText(resumeText);
  const allResumeKeywords = [...new Set([...resumeSkills, ...resumeKeywords])];

  // Extract from JD
  const jdKeywords = extractKeywordsFromText(jobDescription);
  const jdData = extractJDKeywords(jobDescription);

  // Calculate semantic similarity
  const semanticScore = semanticSimilarityScore(resumeText, jobDescription);

  // Match keywords
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  const partialSkills: string[] = [];

  for (const kw of jdKeywords) {
    const exact = allResumeKeywords.some(
      (rk) => rk.toLowerCase() === kw.toLowerCase()
    );
    const partial = !exact && allResumeKeywords.some(
      (rk) => rk.toLowerCase().includes(kw.toLowerCase()) || kw.toLowerCase().includes(rk.toLowerCase())
    );

    if (exact) matchedSkills.push(kw);
    else if (partial) partialSkills.push(kw);
    else missingSkills.push(kw);
  }

  // Calculate individual scores
  const totalJD = jdKeywords.length || 1;
  const keywordMatch = Math.round((matchedSkills.length / totalJD) * 100);
  const skillsMatch = Math.round(((matchedSkills.length + partialSkills.length * 0.5) / totalJD) * 100);

  // Experience match — heuristic based on exp count
  const expCount = resumeData.experience?.length || 0;
  const expMatch = Math.min(100, 50 + expCount * 10);

  // Responsibility match — semantic similarity of bullets vs JD
  const bulletText = resumeData.experience?.flatMap((e) => e.bullets || []).join(' ') || '';
  const responsibilityMatch = semanticSimilarityScore(bulletText, jobDescription);

  // Overall match
  const matchScore = Math.round(
    semanticScore * 0.25 +
    keywordMatch * 0.30 +
    skillsMatch * 0.20 +
    expMatch * 0.15 +
    responsibilityMatch * 0.10
  );

  const keywords = jdKeywords.map((kw) => ({
    keyword: kw,
    status: matchedSkills.includes(kw) ? 'matched' : partialSkills.includes(kw) ? 'partial' : 'missing',
    frequencyInJD: getKeywordFrequency(jobDescription, kw),
    frequencyInResume: getKeywordFrequency(resumeText, kw),
    priority: getKeywordFrequency(jobDescription, kw) >= 2 ? 'high' : 'medium',
    why: !matchedSkills.includes(kw) && !partialSkills.includes(kw)
      ? `Not detected in your resume. If you have experience with ${kw}, consider adding it.`
      : undefined,
  }));

  const match = await JobMatchModel.findOneAndUpdate(
    { resumeId, userId: user.id },
    {
      $set: {
        resumeId,
        userId: user.id,
        jobDescriptionText: jobDescription.slice(0, 5000),
        jobTitle: jdData.jobTitle,
        matchScore,
        scores: {
          skillsMatch,
          keywordMatch,
          experienceMatch: expMatch,
          responsibilityMatch,
          semanticMatch: semanticScore,
        },
        matchedSkills,
        missingSkills,
        partialSkills,
        keywords,
        extractedRequirements: {
          required: jdData.required,
          preferred: jdData.preferred,
        },
      },
    },
    { new: true, upsert: true }
  ).lean();

  return NextResponse.json({ match });
}

function buildResumeText(resume: ResumeData): string {
  const parts: string[] = [];
  if (resume.summary) parts.push(resume.summary);
  resume.experience?.forEach((e) => {
    parts.push(`${e.jobTitle} ${e.company}`);
    e.bullets?.forEach((b) => parts.push(b));
  });
  resume.skills?.forEach((s) => parts.push(s.items.join(' ')));
  resume.projects?.forEach((p) => {
    parts.push(p.name);
    parts.push(p.technologies?.join(' ') || '');
    p.bullets?.forEach((b) => parts.push(b));
  });
  return parts.join(' ');
}
