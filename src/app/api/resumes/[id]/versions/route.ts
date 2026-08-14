import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db/mongoose';
import { Resume } from '@/lib/models/Resume';
import { ResumeVersion } from '@/lib/models/ResumeVersion';

type Params = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const userId = (session.user as { id?: string }).id || session.user.email!;
  const versions = await ResumeVersion.find({ resumeId: params.id, userId })
    .sort({ versionNumber: -1 })
    .lean();

  return NextResponse.json({ versions });
}

export async function POST(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const userId = (session.user as { id?: string }).id || session.user.email!;

  const resume = await Resume.findOne({ _id: params.id, userId }).lean();
  if (!resume) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });

  const lastVersion = await ResumeVersion.findOne({ resumeId: params.id }).sort({ versionNumber: -1 });
  const versionNumber = (lastVersion?.versionNumber || 0) + 1;

  const version = await ResumeVersion.create({
    resumeId: params.id,
    userId,
    versionNumber,
    snapshot: resume,
  });

  return NextResponse.json({ version }, { status: 201 });
}
