import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/getAuthUser';
import { connectDB } from '@/lib/db/mongoose';
import { Resume } from '@/lib/models/Resume';
import { tailorResume } from '@/lib/ai/resumeTailor';
import type { ResumeData } from '@/types/resume';

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const { resumeId, jobDescription } = await req.json();

  if (!resumeId || !jobDescription?.trim()) {
    return NextResponse.json({ error: 'Resume ID and job description are required' }, { status: 400 });
  }

  const resume = await Resume.findOne({ _id: resumeId, userId: user.id }).lean();
  if (!resume) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });

  try {
    const result = await tailorResume(resume as unknown as ResumeData, jobDescription);
    return NextResponse.json({ result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Tailoring failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
