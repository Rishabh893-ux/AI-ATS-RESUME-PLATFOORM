'use client';

import { useState, useEffect } from 'react';
import { Mail, RefreshCw, Copy, Check, Download, AlertTriangle, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useUIStore } from '@/store/uiStore';
import styles from './cover-letter.module.css';

interface Resume {
  _id: string;
  title: string;
}

const TONES = [
  { id: 'professional', label: 'Professional', desc: 'Formal and polished' },
  { id: 'confident', label: 'Confident', desc: 'Bold and assertive' },
  { id: 'friendly', label: 'Friendly', desc: 'Warm and personable' },
  { id: 'concise', label: 'Concise', desc: 'Brief and direct' },
];

export default function CoverLetterPage() {
  const { addToast } = useUIStore();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [tone, setTone] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    fetch('/api/resumes')
      .then((r) => r.json())
      .then((d) => {
        setResumes(d.resumes || []);
        if (d.resumes?.[0]) setSelectedResume(d.resumes[0]._id);
      });
  }, []);

  async function handleGenerate() {
    if (!selectedResume || !jobDescription.trim()) {
      setError('Please select a resume and paste a job description');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId: selectedResume, jobDescription, targetRole, companyName, tone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const letterContent = data.coverLetter?.content || data.coverLetter || '';
      setCoverLetter(letterContent);
      setCharCount(letterContent.length);
      addToast({ type: 'success', message: 'Cover letter generated successfully!' });
    } catch (err: any) {
      setError(err.message || 'Generation failed');
      addToast({ type: 'error', message: err.message || 'Failed to generate cover letter' });
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!coverLetter) return;
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast({ type: 'success', message: 'Copied to clipboard!' });
  }

  function handleDownloadTxt() {
    if (!coverLetter) return;
    const blob = new Blob([coverLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-${(targetRole || companyName || 'generated').replace(/\s+/g, '_').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({ type: 'success', message: 'Downloaded!' });
  }

  function handleOutputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setCoverLetter(e.target.value);
    setCharCount(e.target.value.length);
  }

  const wordCount = coverLetter.trim() ? coverLetter.trim().split(/\s+/).length : 0;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <Mail size={22} />
        </div>
        <div>
          <h1 className={styles.title}>AI Cover Letter Generator</h1>
          <p className={styles.subtitle}>
            Generate a tailored, professional cover letter that matches your resume to the job.
          </p>
        </div>
      </div>

      <div className={styles.content}>
        {/* Left — Input */}
        <div className={styles.inputPanel}>
          {/* Resume + Role row */}
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label}>Select Resume</label>
              <select
                className={styles.input}
                value={selectedResume}
                onChange={(e) => setSelectedResume(e.target.value)}
              >
                {resumes.length === 0 && <option value="">No resumes yet — create one first</option>}
                {resumes.map((r) => (
                  <option key={r._id} value={r._id}>{r.title}</option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Target Role <span className={styles.optional}>(optional)</span></label>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. Senior Frontend Engineer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Company Name <span className={styles.optional}>(optional)</span></label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. Google, Microsoft..."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          {/* Tone selector */}
          <div className={styles.field}>
            <label className={styles.label}>Writing Tone</label>
            <div className={styles.toneGrid}>
              {TONES.map((t) => (
                <button
                  key={t.id}
                  className={`${styles.toneBtn} ${tone === t.id ? styles.toneBtnActive : ''}`}
                  onClick={() => setTone(t.id)}
                >
                  <span className={styles.toneName}>{t.label}</span>
                  <span className={styles.toneDesc}>{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Job Description</label>
            <textarea
              className={styles.textarea}
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={10}
            />
            {jobDescription && (
              <div className={styles.fieldHint}>{jobDescription.trim().split(/\s+/).length} words</div>
            )}
          </div>

          {error && (
            <div className={styles.errorBox}>
              <AlertTriangle size={15} />
              <span>{error}</span>
            </div>
          )}

          <Button
            onClick={handleGenerate}
            loading={loading}
            size="lg"
            fullWidth
            leftIcon={<Sparkles size={17} />}
            disabled={!selectedResume || !jobDescription.trim()}
          >
            Generate Cover Letter
          </Button>
        </div>

        {/* Right — Output */}
        <div className={styles.outputPanel}>
          <div className={styles.outputHeader}>
            <div>
              <h3 className={styles.outputTitle}>Generated Cover Letter</h3>
              {coverLetter && (
                <div className={styles.outputMeta}>
                  {wordCount} words · {charCount} characters
                </div>
              )}
            </div>
            <div className={styles.outputActions}>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={copied ? <Check size={14} /> : <Copy size={14} />}
                onClick={handleCopy}
                disabled={!coverLetter}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Download size={14} />}
                onClick={handleDownloadTxt}
                disabled={!coverLetter}
              >
                Download
              </Button>
            </div>
          </div>

          <div className={styles.outputBody}>
            {loading ? (
              <div className={styles.loadingState}>
                <div className={styles.loadingOrb} />
                <RefreshCw size={22} className={styles.spinner} />
                <p className={styles.loadingText}>Writing your cover letter...</p>
                <span className={styles.loadingSub}>This usually takes 5–10 seconds</span>
              </div>
            ) : coverLetter ? (
              <textarea
                className={styles.outputTextarea}
                value={coverLetter}
                onChange={handleOutputChange}
                placeholder="Your generated cover letter will appear here..."
              />
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <Mail size={32} />
                </div>
                <p className={styles.emptyTitle}>Ready to generate</p>
                <p className={styles.emptyDesc}>
                  Fill in the form on the left and click Generate Cover Letter
                </p>
                <div className={styles.emptyHints}>
                  <span>✓ Tailored to the job</span>
                  <span>✓ Professional tone</span>
                  <span>✓ Editable output</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
