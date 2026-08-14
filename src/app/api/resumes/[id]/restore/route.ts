import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db/mongoose';
import { Resume } from '@/lib/models/Resume';
import { ResumeVersion } from '@/lib/models/ResumeVersion';

type Params = { params: { id: string } };

export async function POST(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const userId = (session.user as { id?: string }).id || session.user.email!;
  const { versionId } = await req.json();

  const version = await ResumeVersion.findOne({ _id: versionId, resumeId: params.id, userId });
  if (!version) return NextResponse.json({ error: 'Version not found' }, { status: 404 });

  const snapshot = version.snapshot as Record<string, unknown>;
  const { _id, createdAt, updatedAt, ...restSnapshot } = snapshot;

  const restored = await Resume.findOneAndUpdate(
    { _id: params.id, userId },
    { $set: restSnapshot },
    { new: true }
  );

  if (!restored) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
  return NextResponse.json({ resume: restored });
}
