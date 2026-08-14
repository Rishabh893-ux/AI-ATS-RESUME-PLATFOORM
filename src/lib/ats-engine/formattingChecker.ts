import type { ResumeData } from '@/types/resume';
import type { FormattingIssue } from '@/types/ats';
import { nanoid } from 'nanoid';

interface FormattingCheckResult {
  score: number; // 0–100
  issues: FormattingIssue[];
}

export function checkFormatting(
  resumeText: string,
  resumeData: ResumeData,
  fileType?: 'pdf' | 'docx'
): FormattingCheckResult {
  const issues: FormattingIssue[] = [];
  let deductions = 0;

  // 1. Multi-column layout detection (heuristic: many short lines alternating)
  const lines = resumeText.split('\n').filter(Boolean);
  const shortLines = lines.filter((l) => l.trim().length < 30 && l.trim().length > 3);
  if (shortLines.length > lines.length * 0.45) {
    issues.push({
      id: nanoid(),
      type: 'multi-column',
      description: 'Possible multi-column layout detected',
      why: 'Some ATS parsers read multi-column layouts left-to-right across columns, causing text to appear jumbled.',
      recommendation: 'Use a single-column layout for maximum ATS compatibility.',
      severity: 'high',
    });
    deductions += 20;
  }

  // 2. Images / icons (only detectable from parsing flags, heuristic: very low text density)
  if (resumeText.trim().length < 200 && resumeData.personalInfo?.name) {
    issues.push({
      id: nanoid(),
      type: 'low-text-density',
      description: 'Very little text was extracted from the resume',
      why: 'The document may contain mostly images or graphics which ATS systems cannot parse.',
      recommendation: 'Use text-based content. Remove images and replace graphical elements with text.',
      severity: 'critical',
    });
    deductions += 30;
  }

  // 3. Tables (heuristic: tab characters or pipe characters suggest tables)
  if ((resumeText.match(/\t/g) || []).length > 5 || (resumeText.match(/\|/g) || []).length > 4) {
    issues.push({
      id: nanoid(),
      type: 'tables',
      description: 'Table or tab-separated content detected',
      why: 'ATS parsers often cannot correctly read data inside HTML/Word tables, causing information to merge or disappear.',
      recommendation: 'Replace tables with plain text lists and standard sections.',
      severity: 'high',
    });
    deductions += 15;
  }

  // 4. Special characters / skill bars (unicode blocks)
  const specialCharMatches = resumeText.match(/[█▓▒░▪▫●◆◇■□★☆]/g) || [];
  if (specialCharMatches.length > 2) {
    issues.push({
      id: nanoid(),
      type: 'special-characters',
      description: 'Special block characters or skill bar elements detected',
      why: 'These characters are typically used for graphical skill bars or visual ratings, which ATS systems cannot interpret.',
      recommendation: 'Remove graphical skill ratings. List skills as plain text.',
      severity: 'medium',
    });
    deductions += 10;
  }

  // 5. Excessive whitespace
  const blankLines = lines.filter((l) => l.trim() === '').length;
  if (blankLines > lines.length * 0.3) {
    issues.push({
      id: nanoid(),
      type: 'excessive-whitespace',
      description: 'Excessive blank lines detected',
      why: 'Too much whitespace can cause ATS systems to misparse section boundaries.',
      recommendation: 'Keep spacing consistent. Use single blank lines between sections.',
      severity: 'low',
    });
    deductions += 5;
  }

  // 6. Headers / footers (heuristic: repeated text in very first / very last lines)
  const firstLine = lines[0]?.trim() || '';
  const lastLine = lines[lines.length - 1]?.trim() || '';
  if (
    (firstLine.toLowerCase().includes('page') || firstLine.match(/^\d+$/)) ||
    (lastLine.toLowerCase().includes('page') || lastLine.match(/^\d+$/))
  ) {
    issues.push({
      id: nanoid(),
      type: 'header-footer',
      description: 'Header or footer content detected',
      why: 'ATS parsers may parse header/footer content as part of resume sections, corrupting the structure.',
      recommendation: 'Remove headers and footers. Place your name in the main body only.',
      severity: 'medium',
    });
    deductions += 8;
  }

  // 7. No issues = full formatting score
  const score = Math.max(0, 100 - deductions);

  return { score, issues };
}
