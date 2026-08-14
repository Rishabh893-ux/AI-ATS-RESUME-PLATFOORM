// DOCX Parser using mammoth
// Server-side only

export async function parseDOCX(buffer: Buffer): Promise<{ text: string }> {
  const mammoth = await import('mammoth');

  try {
    const result = await mammoth.extractRawText({ buffer });
    return { text: result.value || '' };
  } catch (err) {
    throw new Error('Failed to parse DOCX file. Please ensure the file is a valid Word document.');
  }
}
