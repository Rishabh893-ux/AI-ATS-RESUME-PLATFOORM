// PDF Parser using pdf-parse
// Server-side only

export async function parsePDF(buffer: Buffer): Promise<{ text: string; pageCount: number }> {
  // Dynamic import to avoid client-side bundling
  const pdfParseModule = await import('pdf-parse');
  const pdfParse = (pdfParseModule as any).default || pdfParseModule;

  try {
    const data = await pdfParse(buffer, {
      // Don't render page content (just extract text)
      pagerender: undefined,
    });

    return {
      text: data.text || '',
      pageCount: data.numpages || 1,
    };
  } catch (err) {
    console.error('PDF Parse error:', err);
    throw new Error('Failed to parse PDF. Please ensure the file is a text-based PDF and not a scanned image.');
  }
}
