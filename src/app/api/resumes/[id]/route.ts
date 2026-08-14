import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/getAuthUser';
import { connectDB } from '@/lib/db/mongoose';
import { Resume } from '@/lib/models/Resume';
import { ResumeVersion } from '@/lib/models/ResumeVersion';

type Params = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Params) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const resume = await Resume.findOne({ _id: params.id, userId: user.id }).lean();

  if (!resume) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
  return NextResponse.json({ resume });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const body = await req.json();

  const resume = await Resume.findOneAndUpdate(
    { _id: params.id, userId: user.id },
    { $set: body },
    { new: true, runValidators: false }
  ).lean();

  if (!resume) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
  return NextResponse.json({ resume });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const result = await Resume.deleteOne({ _id: params.id, userId: user.id });
  if (result.deletedCount === 0) {
    return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
  }

  await ResumeVersion.deleteMany({ resumeId: params.id });
  return NextResponse.json({ success: true });
}
