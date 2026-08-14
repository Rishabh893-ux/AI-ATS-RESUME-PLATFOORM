'use client';

import { useState, useEffect } from 'react';
import { Briefcase, ChevronRight, Check, AlertTriangle, Circle } from 'lucide-react';
import Button from '@/components/ui/Button';
import ScoreRing from '@/components/ui/ScoreRing';
import styles from './job-matcher.module.css';

interface Resume {
  _id: string;
  title: string;
  atsScore?: number;
}

interface JobMatchResult {
  matchScore: number;
  jobTitle?: string;
  scores: {
    skillsMatch: number;
    keywordMatch: number;
    experienceMatch: number;
    responsibilityMatch: number;
    semanticMatch: number;
  };
  matchedSkills: string[];
  missingSkills: string[];
  partialSkills: string[];
  keywords: Array<{
    keyword: string;
    status: string;
    frequencyInJD?: number;
    frequencyInResume?: number;
    why?: string;
  }>;
}

export default function JobMatcherPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JobMatchResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/resumes')
      .then((r) => r.json())
      .then((d) => {
        setResumes(d.resumes || []);
        if (d.resumes?.[0]) setSelectedResume(d.resumes[0]._id);
      });
  }, []);

  async function handleMatch() {
    if (!selectedResume || !jobDescription.trim()) {
      setError('Please select a resume and paste a job description');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/job-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId: selectedResume, jobDescription }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.match);
    } catch (err: any) {
      setError(err.message || 'Matching failed');
    } finally {
      setLoading(false);
    }
  }

  const SCORE_LABELS: Record<string, string> = {
    skillsMatch: 'Skills Match',
    keywordMatch: 'Keyword Match',
    experienceMatch: 'Experience Match',
    responsibilityMatch: 'Responsibility Match',
    semanticMatch: 'Semantic Match',
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Job Description Matcher</h1>
        <p className={styles.subtitle}>
          Compare your resume against any job description to see how well you match.
        </p>
      </div>

      {/* Input panel */}
      <div className={styles.inputPanel}>
        <div className={styles.inputLeft}>
          <div className={styles.field}>
            <label className={styles.label}>Select Resume</label>
            <select
              className={styles.select}
              value={selectedResume}
              onChange={(e) => setSelectedResume(e.target.value)}
              id="resume-select"
            >
              {resumes.length === 0 && <option value="">No resumes yet — create one first</option>}
              {resumes.map((r) => (
                <option key={r._id} value={r._id}>{r.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.inputRight}>
          <div className={styles.field}>
            <label className={styles.label}>Job Description</label>
            <textarea
              className={styles.textarea}
              placeholder="Paste the complete job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={10}
              id="jd-input"
            />
          </div>
        </div>
      </div>

      {error && <div className={styles.error}><AlertTriangle size={16} />{error}</div>}

      <Button
        onClick={handleMatch}
        loading={loading}
        size="lg"
        leftIcon={<Briefcase size={18} />}
        id="match-button"
      >
        Analyze Job Match
      </Button>

      {/* Results */}
      {result && (
        <div className={styles.results}>
          {/* Overall match */}
          <div className={styles.matchHeader}>
            <ScoreRing score={result.matchScore} size={160} animate />
            <div className={styles.matchInfo}>
              <h2 className={styles.matchTitle}>
                {result.jobTitle ? `Match for: ${result.jobTitle}` : 'Job Match Score'}
              </h2>
              <div className={styles.scoreBars}>
                {Object.entries(result.scores).map(([key, value]) => (
                  <div key={key} className={styles.scoreBar}>
                    <div className={styles.scoreBarLabel}>{SCORE_LABELS[key] || key}</div>
                    <div className={styles.scoreBarTrack}>
                      <div
                        className={styles.scoreBarFill}
                        style={{
                          width: `${value}%`,
                          background: value >= 80 ? 'var(--success)' : value >= 60 ? 'var(--info)' : 'var(--warning)',
                        }}
                      />
                    </div>
                    <div className={styles.scoreBarVal}>{Math.round(value)}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skill comparison */}
          <div className={styles.comparison}>
            <div className={styles.compPanel}>
              <h3 className={styles.compTitle}>
                <Check size={16} style={{ color: 'var(--success)' }} />
                Matched Skills ({result.matchedSkills.length})
              </h3>
              <div className={styles.chips}>
                {result.matchedSkills.map((s) => (
                  <span key={s} className={`${styles.chip} ${styles.chipMatched}`}>✓ {s}</span>
                ))}
                {result.matchedSkills.length === 0 && <span className={styles.noItems}>None detected</span>}
              </div>
            </div>

            <div className={styles.compPanel}>
              <h3 className={styles.compTitle}>
                <AlertTriangle size={16} style={{ color: 'var(--warning)' }} />
                Not Detected ({result.missingSkills.length})
              </h3>
              <div className={styles.chips}>
                {result.missingSkills.map((s) => (
                  <span key={s} className={`${styles.chip} ${styles.chipMissing}`}>⚠ {s}</span>
                ))}
                {result.missingSkills.length === 0 && <span className={styles.noItems}>All detected!</span>}
              </div>
            </div>

            <div className={styles.compPanel}>
              <h3 className={styles.compTitle}>
                <Circle size={16} style={{ color: 'var(--info)' }} />
                Partially Matched ({result.partialSkills.length})
              </h3>
              <div className={styles.chips}>
                {result.partialSkills.map((s) => (
                  <span key={s} className={`${styles.chip} ${styles.chipPartial}`}>◐ {s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Skill gap analysis */}
          {result.missingSkills.length > 0 && (
            <div className={styles.gapAnalysis}>
              <h3 className={styles.gapTitle}>Skill Gap Analysis</h3>
              <p className={styles.gapNote}>
                The following skills were not detected in your resume. This does not mean you lack
                these skills — only that they are not mentioned. If you have experience with any of
                these, consider adding them to your resume.
              </p>
              <div className={styles.gaps}>
                {result.missingSkills.slice(0, 10).map((skill) => (
                  <div key={skill} className={styles.gapItem}>
                    <AlertTriangle size={14} style={{ color: 'var(--warning)', flexShrink: 0 }} />
                    <div>
                      <div className={styles.gapSkill}>{skill}</div>
                      <div className={styles.gapDesc}>
                        Not detected in your resume. If you have experience with {skill}, consider adding it to your Skills or relevant sections.
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <Button variant="secondary" onClick={() => setResult(null)}>Match Another Job</Button>
            <Button variant="primary" onClick={() => window.location.href = '/ai-tools'}>
              Tailor Resume with AI
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
