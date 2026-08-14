import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/getAuthUser';
import { generateSummary } from '@/lib/ai/summaryGenerator';
import { improveBullet } from '@/lib/ai/bulletImprover';
import type { ResumeData } from '@/types/resume';

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { action, resumeData, bullet, context, targetRole } = await req.json();

  if (!action) return NextResponse.json({ error: 'Action is required' }, { status: 400 });

  try {
    if (action === 'summary') {
      if (!resumeData) return NextResponse.json({ error: 'Resume data required' }, { status: 400 });
      const summary = await generateSummary(resumeData as ResumeData, targetRole);
      return NextResponse.json({ result: summary });
    }

    if (action === 'bullet') {
      if (!bullet) return NextResponse.json({ error: 'Bullet text required' }, { status: 400 });
      const result = await improveBullet(bullet, context);
      return NextResponse.json({ result });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'AI request failed';
    if (message.includes('GEMINI_API_KEY')) {
      return NextResponse.json(
        { error: 'AI features are not configured. Please add your GEMINI_API_KEY to .env.local.' },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
