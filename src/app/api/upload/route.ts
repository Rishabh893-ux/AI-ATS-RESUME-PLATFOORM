import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/getAuthUser';
import { parsePDF } from '@/lib/parsers/pdfParser';
import { parseDOCX } from '@/lib/parsers/docxParser';
import { extractStructuredData } from '@/lib/parsers/structureExtractor';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type) && !file.name.match(/\.(pdf|docx)$/i)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a PDF or DOCX file.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File is too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    let rawText = '';
    let pageCount = 1;

    if (isPDF) {
      const result = await parsePDF(buffer);
      rawText = result.text;
      pageCount = result.pageCount;
    } else {
      const result = await parseDOCX(buffer);
      rawText = result.text;
    }

    if (!rawText || rawText.trim().length < 50) {
      return NextResponse.json(
        {
          error:
            "We couldn't extract enough text from this file. Try uploading a text-based PDF or DOCX file. Scanned image PDFs are not supported.",
        },
        { status: 422 }
      );
    }

    const structuredData = extractStructuredData(rawText);

    return NextResponse.json({
      success: true,
      rawText,
      structuredData,
      pageCount,
      fileType: isPDF ? 'pdf' : 'docx',
      fileName: file.name,
    });
  } catch (err: unknown) {
    console.error('Upload error:', err);
    const message = err instanceof Error ? err.message : 'Failed to process file';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
