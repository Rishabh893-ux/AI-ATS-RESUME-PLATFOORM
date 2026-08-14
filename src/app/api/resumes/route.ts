import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/getAuthUser';
import { connectDB } from '@/lib/db/mongoose';
import { Resume } from '@/lib/models/Resume';

export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const resumes = await Resume.find({ userId: user.id }).sort({ updatedAt: -1 }).lean();
  return NextResponse.json({ resumes });
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const body = await req.json();

  const resume = await Resume.create({
    userId: user.id,
    title: body.title || 'Untitled Resume',
    template: body.template || 'professional',
    personalInfo: body.personalInfo || {},
    summary: body.summary || '',
    experience: body.experience || [],
    education: body.education || [],
    skills: body.skills || [],
    projects: body.projects || [],
    certifications: body.certifications || [],
    achievements: body.achievements || [],
    sectionOrder: body.sectionOrder || ['personal', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'achievements'],
  });

  return NextResponse.json({ resume }, { status: 201 });
}
