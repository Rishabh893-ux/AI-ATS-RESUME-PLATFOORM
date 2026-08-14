'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, X, AlertTriangle } from 'lucide-react';
import ScoreRing from '@/components/ui/ScoreRing';
import Button from '@/components/ui/Button';
import { useUIStore } from '@/store/uiStore';
import type { ATSAnalysis } from '@/types/ats';
import styles from './ats-checker.module.css';

type UploadStep = 'idle' | 'uploading' | 'parsing' | 'analyzing' | 'done' | 'error';
type ActiveTab = 'overview' | 'keywords' | 'formatting' | 'sections' | 'recommendations';

const PARSING_STEPS = [
  { key: 'upload', label: 'Uploading resume...' },
  { key: 'parse', label: 'Extracting content...' },
  { key: 'structure', label: 'Analyzing sections...' },
  { key: 'keywords', label: 'Checking keywords...' },
  { key: 'report', label: 'Generating report...' },
];

const SEVERITY_COLORS: Record<string, string> = {
  critical: 'var(--error)',
  high: 'var(--warning)',
  medium: 'var(--info)',
  low: 'var(--text-muted)',
};

const SEVERITY_BG: Record<string, string> = {
  critical: 'var(--error-bg)',
  high: 'var(--warning-bg)',
  medium: 'var(--info-bg)',
  low: 'var(--severity-low-bg)',
};

function ATSCheckerContent() {
  const { addToast } = useUIStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const idFromUrl = searchParams.get('id');
  const [step, setStep] = useState<UploadStep>('idle');
  const [currentParseStep, setCurrentParseStep] = useState(0);
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);
  const [savedResumeId, setSavedResumeId] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [dragOver, setDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [dismissedRecs, setDismissedRecs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (idFromUrl && !savedResumeId) {
      setSavedResumeId(idFromUrl);
    }
  }, [idFromUrl, savedResumeId]);

  const handleAnalyzeExisting = useCallback(async (resumeId: string) => {
    setStep('analyzing');
    setCurrentParseStep(4);
    setErrorMessage('');

    try {
      const analyzeRes = await fetch(`/api/resumes/${resumeId}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: jobDescription || undefined }),
      });

      const analyzeData = await analyzeRes.json();
      if (!analyzeRes.ok) throw new Error(analyzeData.error || 'Analysis failed');

      setCurrentParseStep(5);
      setAnalysis(analyzeData.analysis);
      setStep('done');
      addToast({ type: 'success', message: 'Resume analyzed successfully!' });
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
      setStep('error');
      addToast({ type: 'error', message: err.message || 'Analysis failed' });
    }
  }, [jobDescription, addToast]);

  const handleFile = useCallback(async (file: File) => {
    if (!file) return;

    setStep('uploading');
    setErrorMessage('');
    setCurrentParseStep(0);

    try {
      // Step 1: Upload & parse
      const formData = new FormData();
      formData.append('file', file);

      setCurrentParseStep(1);
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || 'Upload failed');
      }

      setParsedData(uploadData.structuredData);
      setCurrentParseStep(2);
      setStep('parsing');

      // Step 2: Save resume to DB
      const createRes = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: file.name.replace(/\.(pdf|docx)$/i, ''),
          ...uploadData.structuredData,
        }),
      });

      const createData = await createRes.json();
      if (!createRes.ok) throw new Error(createData.error || 'Failed to save resume');

      const resumeId = createData.resume._id;
      setSavedResumeId(resumeId);
      setCurrentParseStep(3);

      await handleAnalyzeExisting(resumeId);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
      setStep('error');
      addToast({ type: 'error', message: err.message || 'Analysis failed' });
    }
  }, [handleAnalyzeExisting, addToast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const reset = () => {
    setStep('idle');
    setAnalysis(null);
    setParsedData(null);
    setSavedResumeId(null);
    setErrorMessage('');
    setCurrentParseStep(0);
    setActiveTab('overview');
    setDismissedRecs(new Set());
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>ATS Resume Checker</h1>
        <p className={styles.subtitle}>
          Upload your resume to receive a transparent ATS Compatibility Score and actionable recommendations.
        </p>
      </div>

      {step === 'idle' && (
        <div className={styles.uploadSection}>
          {/* Optional JD input */}
          <div className={styles.jdSection}>
            <label className={styles.jdLabel}>
              Job Description <span className={styles.optional}>(optional — improves keyword matching)</span>
            </label>
            <textarea
              className={styles.jdInput}
              placeholder="Paste the job description here for better keyword analysis and job match scoring..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={5}
              id="job-description-input"
            />
          </div>

          {/* Drop zone or Analyze existing */}
          {savedResumeId ? (
            <div className={styles.dropzone}>
              <div className={styles.dropzoneContent}>
                <div className={styles.dropzoneIcon}>
                  <FileText size={32} />
                </div>
                <div className={styles.dropzoneText}>
                  <strong>Resume Selected</strong>
                  <span>Ready to analyze</span>
                </div>
                <Button onClick={() => handleAnalyzeExisting(savedResumeId)} variant="primary" size="md">
                  Analyze Now
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={`${styles.dropzone} ${dragOver ? styles.dragOver : ''}`}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              role="button"
              tabIndex={0}
              aria-label="Upload resume — drag and drop or click to select"
              onKeyDown={(e) => e.key === 'Enter' && document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".pdf,.docx"
                className={styles.fileInput}
                onChange={handleFileInput}
                aria-label="Select resume file"
              />
              <div className={styles.dropzoneContent}>
                <div className={styles.dropzoneIcon}>
                  <Upload size={32} />
                </div>
                <div className={styles.dropzoneText}>
                  <strong>Drag & drop your resume here</strong>
                  <span>or click to browse files</span>
                </div>
                <div className={styles.dropzoneFormats}>
                  PDF or DOCX · Max 5MB
                </div>
                <label htmlFor="file-input">
                  <Button variant="primary" size="md" leftIcon={<FileText size={16} />}>
                    Choose File
                  </Button>
                </label>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Parsing progress */}
      {(step === 'uploading' || step === 'parsing' || step === 'analyzing') && (
        <div className={styles.progress}>
          <div className={styles.progressTitle}>
            <Loader2 size={20} className={styles.spinner} />
            Analyzing your resume...
          </div>
          <div className={styles.steps}>
            {PARSING_STEPS.map((s, i) => (
              <div key={s.key} className={`${styles.stepRow} ${
                i < currentParseStep ? styles.stepDone :
                i === currentParseStep ? styles.stepActive :
                styles.stepPending
              }`}>
                <div className={styles.stepIcon}>
                  {i < currentParseStep ? (
                    <CheckCircle size={16} />
                  ) : i === currentParseStep ? (
                    <Loader2 size={16} className={styles.spinner} />
                  ) : (
                    <div className={styles.stepDot} />
                  )}
                </div>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error state */}
      {step === 'error' && (
        <div className={styles.errorState}>
          <AlertCircle size={24} />
          <div>
            <div className={styles.errorTitle}>Analysis failed</div>
            <div className={styles.errorMessage}>{errorMessage}</div>
          </div>
          <Button variant="secondary" onClick={reset}>Try Again</Button>
        </div>
      )}

      {/* Results */}
      {step === 'done' && analysis && (
        <div className={styles.results}>
          {/* Score overview */}
          <div className={styles.scoreSection}>
            <div className={styles.scorePrimary}>
              <ScoreRing score={analysis.overallScore} size={180} animate />
              <div className={styles.scoreInfo}>
                <h2 className={styles.scoreTitle}>ATS Compatibility Score</h2>
                <p className={styles.scoreDisclaimer}>
                  * This score is generated by this application and does not represent
                  the proprietary scoring system of any specific ATS vendor.
                </p>
                <div className={styles.scoreBars}>
                  {Object.entries(analysis.scores).map(([key, value]) => (
                    <div key={key} className={styles.scoreBar}>
                      <div className={styles.scoreBarLabel}>{formatScoreKey(key)}</div>
                      <div className={styles.scoreBarTrack}>
                        <div
                          className={styles.scoreBarFill}
                          style={{
                            width: `${value}%`,
                            background: value >= 80 ? 'var(--success)' : value >= 60 ? 'var(--info)' : 'var(--warning)',
                          }}
                        />
                      </div>
                      <div className={styles.scoreBarValue}>{Math.round(value)}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className={styles.tabs}>
            {(['overview', 'keywords', 'formatting', 'sections', 'recommendations'] as ActiveTab[]).map((tab) => (
              <button
                key={tab}
                className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'recommendations' && (
                  <span className={styles.tabBadge}>
                    {analysis.recommendations.filter(r => !dismissedRecs.has(r.id)).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className={styles.tabContent}>

            {activeTab === 'overview' && (
              <div className={styles.overviewTab}>
                <div className={styles.sectionStatusGrid}>
                  {analysis.sectionStatus.map((sec) => (
                    <div key={sec.section} className={`${styles.sectionCard} ${styles[`status_${sec.status.replace('-', '_')}`]}`}>
                      <div className={styles.sectionCardIcon}>
                        {sec.status === 'present' ? '✓' : sec.status === 'needs-improvement' ? '⚠' : '✗'}
                      </div>
                      <div>
                        <div className={styles.sectionCardLabel}>{sec.label}</div>
                        {sec.notes && <div className={styles.sectionCardNote}>{sec.notes}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'keywords' && (
              <div className={styles.keywordsTab}>
                {analysis.keywords.matched.length > 0 && (
                  <div className={styles.kwGroup}>
                    <h3 className={styles.kwGroupTitle}>
                      <span className={styles.kwDot} style={{ background: 'var(--success)' }} />
                      Matched Keywords ({analysis.keywords.matched.length})
                    </h3>
                    <div className={styles.kwChips}>
                      {analysis.keywords.matched.map((kw) => (
                        <span key={kw.keyword} className={`${styles.kwChip} ${styles.kwMatched}`}>
                          ✓ {kw.keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {analysis.keywords.missing.length > 0 && (
                  <div className={styles.kwGroup}>
                    <h3 className={styles.kwGroupTitle}>
                      <span className={styles.kwDot} style={{ background: 'var(--warning)' }} />
                      Not Detected in Resume ({analysis.keywords.missing.length})
                    </h3>
                    <div className={styles.kwChips}>
                      {analysis.keywords.missing.map((kw) => (
                        <div key={kw.keyword} className={styles.kwMissingCard}>
                          <span className={`${styles.kwChip} ${styles.kwMissing}`}>⚠ {kw.keyword}</span>
                          {kw.why && <p className={styles.kwWhy}>{kw.why}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {analysis.keywords.partial.length > 0 && (
                  <div className={styles.kwGroup}>
                    <h3 className={styles.kwGroupTitle}>
                      <span className={styles.kwDot} style={{ background: 'var(--info)' }} />
                      Partially Matched ({analysis.keywords.partial.length})
                    </h3>
                    <div className={styles.kwChips}>
                      {analysis.keywords.partial.map((kw) => (
                        <span key={kw.keyword} className={`${styles.kwChip} ${styles.kwPartial}`}>
                          ◐ {kw.keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {!jobDescription && (
                  <div className={styles.kwNoJD}>
                    <AlertTriangle size={16} />
                    Add a Job Description above to see job-specific keyword matching
                  </div>
                )}
              </div>
            )}

            {activeTab === 'formatting' && (
              <div className={styles.formattingTab}>
                {analysis.formattingIssues.length === 0 ? (
                  <div className={styles.allGood}>
                    <CheckCircle size={20} />
                    No critical formatting issues detected. Your resume format appears ATS-friendly.
                  </div>
                ) : (
                  analysis.formattingIssues.map((issue) => (
                    <div key={issue.id} className={styles.issueCard}>
                      <div className={styles.issueHeader}>
                        <span className={styles.issueSeverity} style={{
                          background: SEVERITY_BG[issue.severity],
                          color: SEVERITY_COLORS[issue.severity],
                        }}>
                          {issue.severity.toUpperCase()}
                        </span>
                        <span className={styles.issueType}>{issue.description}</span>
                      </div>
                      <div className={styles.issueWhy}>
                        <strong>Why it matters:</strong> {issue.why}
                      </div>
                      <div className={styles.issueFix}>
                        <strong>Recommendation:</strong> {issue.recommendation}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'sections' && (
              <div className={styles.sectionsTab}>
                {analysis.sectionStatus.map((sec) => (
                  <div key={sec.section} className={styles.sectionRow}>
                    <div className={styles.sectionRowIcon} data-status={sec.status}>
                      {sec.status === 'present' ? '✓' : sec.status === 'needs-improvement' ? '⚠' : '✗'}
                    </div>
                    <div className={styles.sectionRowInfo}>
                      <div className={styles.sectionRowLabel}>{sec.label}</div>
                      {sec.notes && <div className={styles.sectionRowNote}>{sec.notes}</div>}
                    </div>
                    <div className={styles.sectionRowStatus} data-status={sec.status}>
                      {sec.status === 'present' ? 'Present' : sec.status === 'needs-improvement' ? 'Needs Improvement' : 'Missing'}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div className={styles.recsTab}>
                {analysis.recommendations
                  .filter((r) => !dismissedRecs.has(r.id))
                  .map((rec) => (
                    <div key={rec.id} className={styles.recCard}>
                      <div className={styles.recHeader}>
                        <span className={styles.recSeverity} style={{
                          background: SEVERITY_BG[rec.severity],
                          color: SEVERITY_COLORS[rec.severity],
                        }}>
                          {rec.severity.toUpperCase()}
                        </span>
                        <span className={styles.recCategory}>{rec.category}</span>
                        <button
                          className={styles.recDismiss}
                          onClick={() => setDismissedRecs(s => new Set([...s, rec.id]))}
                          aria-label="Dismiss recommendation"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <h4 className={styles.recProblem}>{rec.problem}</h4>
                      <div className={styles.recWhy}>
                        <strong>Why does this matter?</strong>
                        <p>{rec.explanation}</p>
                      </div>
                      <div className={styles.recSuggestion}>
                        <strong>Recommendation:</strong>
                        <p>{rec.suggestion}</p>
                      </div>
                      <div className={styles.recActions}>
                        {rec.canAIFix && savedResumeId && (
                          <Button size="sm" variant="primary" leftIcon={<span>✨</span>} onClick={() => router.push(`/resume-builder/${savedResumeId}`)}>
                            Fix with AI
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDismissedRecs(s => new Set([...s, rec.id]))}
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  ))}
                {analysis.recommendations.filter((r) => !dismissedRecs.has(r.id)).length === 0 && (
                  <div className={styles.allGood}>
                    <CheckCircle size={20} />
                    All recommendations addressed! Great work.
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Reset button */}
          <div className={styles.actions}>
            <Button variant="secondary" onClick={reset}>Analyze Another Resume</Button>
            {savedResumeId && (
              <Button variant="primary" onClick={() => window.location.href = `/resume-builder/${savedResumeId}`}>
                Edit in Builder
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function formatScoreKey(key: string): string {
  const labels: Record<string, string> = {
    readability: 'ATS Readability',
    keywordRelevance: 'Keyword Relevance',
    jobMatch: 'Job Match',
    structure: 'Resume Structure',
    formatting: 'Formatting',
    content: 'Content Quality',
    completeness: 'Section Completeness',
  };
  return labels[key] || key;
}

export default function ATSCheckerPage() {
  return (
    <Suspense fallback={<div className={styles.page}><div className={styles.progress}><Loader2 size={24} className={styles.spinner} />Loading...</div></div>}>
      <ATSCheckerContent />
    </Suspense>
  );
}
