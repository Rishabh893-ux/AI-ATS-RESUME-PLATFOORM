import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/getAuthUser';
import { connectDB } from '@/lib/db/mongoose';
import { Resume } from '@/lib/models/Resume';
import { ATSAnalysis } from '@/lib/models/ATSAnalysis';
import { runATSAnalysis } from '@/lib/ats-engine';
import type { ResumeData } from '@/types/resume';

type Params = { params: { id: string } };

export async function POST(req: NextRequest, { params }: Params) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();

  const resume = await Resume.findOne({ _id: params.id, userId: user.id }).lean();
  if (!resume) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const jobDescription = body.jobDescription || '';

  const resumeText = buildResumeText(resume as unknown as ResumeData);

  try {
    const analysis = await runATSAnalysis(params.id, {
      resumeText,
      resumeData: resume as unknown as ResumeData,
      jobDescription: jobDescription || undefined,
      fileType: 'docx',
    });

    const saved = await ATSAnalysis.findOneAndUpdate(
      { resumeId: params.id, userId: user.id },
      {
        $set: {
          ...analysis,
          userId: user.id,
          jobDescriptionUsed: !!jobDescription,
        },
      },
      { new: true, upsert: true }
    ).lean();

    await Resume.updateOne(
      { _id: params.id },
      { $set: { atsScore: analysis.overallScore, lastAnalyzedAt: new Date() } }
    );

    return NextResponse.json({ analysis: saved });
  } catch (err: unknown) {
    console.error('ATS Analysis failed:', err);
    const message = err instanceof Error ? err.message : 'Analysis failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function buildResumeText(resume: ResumeData): string {
  const lines: string[] = [];

  if (resume.personalInfo?.name) lines.push(resume.personalInfo.name);
  if (resume.personalInfo?.email) lines.push(resume.personalInfo.email);
  if (resume.personalInfo?.phone) lines.push(resume.personalInfo.phone);
  if (resume.personalInfo?.location) lines.push(resume.personalInfo.location);

  if (resume.summary) {
    lines.push('\nSUMMARY');
    lines.push(resume.summary);
  }

  if (resume.experience?.length) {
    lines.push('\nEXPERIENCE');
    resume.experience.forEach((exp) => {
      lines.push(`${exp.jobTitle} — ${exp.company}`);
      lines.push(`${exp.startDate} – ${exp.endDate || 'Present'}`);
      exp.bullets?.forEach((b) => lines.push(`• ${b}`));
    });
  }

  if (resume.education?.length) {
    lines.push('\nEDUCATION');
    resume.education.forEach((edu) => {
      lines.push(`${edu.degree} — ${edu.institution}`);
    });
  }

  if (resume.skills?.length) {
    lines.push('\nSKILLS');
    resume.skills.forEach((cat) => {
      lines.push(`${cat.category}: ${cat.items.join(', ')}`);
    });
  }

  if (resume.projects?.length) {
    lines.push('\nPROJECTS');
    resume.projects.forEach((proj) => {
      lines.push(proj.name);
      if (proj.technologies?.length) lines.push(`Technologies: ${proj.technologies.join(', ')}`);
      proj.bullets?.forEach((b) => lines.push(`• ${b}`));
    });
  }

  return lines.join('\n');
}
