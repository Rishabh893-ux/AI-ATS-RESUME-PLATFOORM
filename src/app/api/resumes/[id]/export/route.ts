import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/getAuthUser';
import { connectDB } from '@/lib/db/mongoose';
import { Resume } from '@/lib/models/Resume';
import type { ResumeData } from '@/types/resume';
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, convertInchesToTwip
} from 'docx';

type Params = { params: { id: string } };

export async function POST(req: NextRequest, { params }: Params) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const resume = await Resume.findOne({ _id: params.id, userId: user.id }).lean();
  if (!resume) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });

  const data = resume as unknown as ResumeData;

  try {
    const children: Paragraph[] = [];

    // Header
    children.push(
      new Paragraph({
        children: [new TextRun({ text: data.personalInfo?.name || 'Resume', bold: true, size: 32 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
      })
    );

    const contactParts: string[] = [];
    if (data.personalInfo?.email) contactParts.push(data.personalInfo.email);
    if (data.personalInfo?.phone) contactParts.push(data.personalInfo.phone);
    if (data.personalInfo?.location) contactParts.push(data.personalInfo.location);
    if (data.personalInfo?.linkedin) contactParts.push(data.personalInfo.linkedin);
    if (data.personalInfo?.github) contactParts.push(data.personalInfo.github);

    if (contactParts.length) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: contactParts.join(' | '), size: 20, color: '555555' })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        })
      );
    }

    // Summary
    if (data.summary) {
      addSectionHeading(children, 'PROFESSIONAL SUMMARY');
      children.push(new Paragraph({
        children: [new TextRun({ text: data.summary, size: 22 })],
        spacing: { after: 200 },
      }));
    }

    // Experience
    if (data.experience?.length) {
      addSectionHeading(children, 'WORK EXPERIENCE');
      data.experience.forEach((exp) => {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: `${exp.jobTitle} — ${exp.company}`, bold: true, size: 24 }),
          ],
          spacing: { before: 100 },
        }));
        const dateStr = `${exp.startDate} – ${exp.current ? 'Present' : exp.endDate || ''}`;
        children.push(new Paragraph({
          children: [new TextRun({ text: dateStr, italics: true, color: '666666', size: 20 })],
          spacing: { after: 80 },
        }));
        exp.bullets?.filter(Boolean).forEach((bullet) => {
          children.push(new Paragraph({
            children: [new TextRun({ text: `• ${bullet}`, size: 22 })],
            indent: { left: convertInchesToTwip(0.25) },
            spacing: { after: 60 },
          }));
        });
      });
    }

    // Education
    if (data.education?.length) {
      addSectionHeading(children, 'EDUCATION');
      data.education.forEach((edu) => {
        children.push(new Paragraph({
          children: [new TextRun({ text: `${edu.degree} — ${edu.institution}`, bold: true, size: 24 })],
          spacing: { before: 100 },
        }));
        const eduDateStr = `${edu.startDate}${edu.endDate ? ` – ${edu.endDate}` : ''}`;
        if (eduDateStr.trim()) {
          children.push(new Paragraph({
            children: [new TextRun({ text: eduDateStr, italics: true, color: '666666', size: 20 })],
          }));
        }
        if (edu.gpa) {
          children.push(new Paragraph({
            children: [new TextRun({ text: `GPA: ${edu.gpa}`, size: 20 })],
            spacing: { after: 80 },
          }));
        }
      });
    }

    // Skills
    if (data.skills?.length) {
      addSectionHeading(children, 'SKILLS');
      data.skills.forEach((cat) => {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: `${cat.category}: `, bold: true, size: 22 }),
            new TextRun({ text: cat.items.join(', '), size: 22 }),
          ],
          spacing: { after: 80 },
        }));
      });
    }

    // Projects
    if (data.projects?.length) {
      addSectionHeading(children, 'PROJECTS');
      data.projects.forEach((proj) => {
        children.push(new Paragraph({
          children: [new TextRun({ text: proj.name, bold: true, size: 24 })],
          spacing: { before: 100 },
        }));
        if (proj.technologies?.length) {
          children.push(new Paragraph({
            children: [new TextRun({ text: `Technologies: ${proj.technologies.join(', ')}`, italics: true, color: '666666', size: 20 })],
          }));
        }
        proj.bullets?.filter(Boolean).forEach((bullet) => {
          children.push(new Paragraph({
            children: [new TextRun({ text: `• ${bullet}`, size: 22 })],
            indent: { left: convertInchesToTwip(0.25) },
            spacing: { after: 60 },
          }));
        });
      });
    }

    // Certifications
    if (data.certifications?.length) {
      addSectionHeading(children, 'CERTIFICATIONS');
      data.certifications.forEach((cert) => {
        const certText = `${cert.name} — ${cert.issuer}${cert.date ? ` (${cert.date})` : ''}`;
        children.push(new Paragraph({
          children: [new TextRun({ text: certText, size: 22 })],
          spacing: { after: 80 },
        }));
      });
    }

    // Achievements
    if (data.achievements?.length) {
      addSectionHeading(children, 'ACHIEVEMENTS');
      data.achievements.forEach((ach) => {
        children.push(new Paragraph({
          children: [new TextRun({ text: ach.title, bold: true, size: 22 })],
          spacing: { before: 80 },
        }));
        if (ach.description) {
          children.push(new Paragraph({
            children: [new TextRun({ text: ach.description, size: 22 })],
            spacing: { after: 80 },
          }));
        }
      });
    }

    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.75),
              right: convertInchesToTwip(0.75),
              bottom: convertInchesToTwip(0.75),
              left: convertInchesToTwip(0.75),
            },
          },
        },
        children,
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    const filename = `${data.title?.replace(/[^a-z0-9]/gi, '_') || 'resume'}.docx`;

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err: unknown) {
    console.error('DOCX export error:', err);
    const message = err instanceof Error ? err.message : 'Export failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function addSectionHeading(children: Paragraph[], text: string) {
  children.push(
    new Paragraph({
      children: [new TextRun({ text, bold: true, size: 24, allCaps: true })],
      spacing: { before: 240, after: 120 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 6, color: '333333', space: 4 },
      },
    })
  );
}
