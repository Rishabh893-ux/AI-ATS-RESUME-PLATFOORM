import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/getAuthUser';
import { connectDB } from '@/lib/db/mongoose';
import { Resume } from '@/lib/models/Resume';
import { CoverLetter as CoverLetterModel } from '@/lib/models/CoverLetter';
import { generateCoverLetter } from '@/lib/ai/coverLetterGen';
import type { ResumeData } from '@/types/resume';

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const { resumeId, jobDescription, targetRole, companyName, tone } = await req.json();

  if (!resumeId) return NextResponse.json({ error: 'Resume ID required' }, { status: 400 });

  const resume = await Resume.findOne({ _id: resumeId, userId: user.id }).lean();
  if (!resume) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });

  try {
    const content = await generateCoverLetter(
      resume as unknown as ResumeData,
      jobDescription || '',
      targetRole,
      companyName,
      tone
    );

    const coverLetter = await CoverLetterModel.findOneAndUpdate(
      { resumeId, userId: user.id },
      { $set: { resumeId, userId: user.id, jobDescriptionText: jobDescription, targetRole, content } },
      { new: true, upsert: true }
    ).lean();

    return NextResponse.json({ coverLetter });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Cover letter generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
