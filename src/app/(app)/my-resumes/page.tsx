'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, MoreHorizontal, Copy, Clock, BarChart2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useUIStore } from '@/store/uiStore';
import styles from './my-resumes.module.css';

interface Resume {
  _id: string;
  title: string;
  template: string;
  atsScore?: number;
  updatedAt: string;
  createdAt: string;
}

export default function MyResumesPage() {
  const { addToast } = useUIStore();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadResumes();
  }, []);

  async function loadResumes() {
    try {
      const res = await fetch('/api/resumes');
      const data = await res.json();
      setResumes(data.resumes || []);
    } finally {
      setLoading(false);
    }
  }

  async function createNew() {
    window.location.href = '/resume-builder';
  }

  async function duplicate(resume: Resume) {
    const res = await fetch('/api/resumes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...resume, title: `${resume.title} (Copy)`, _id: undefined }),
    });
    if (res.ok) {
      addToast({ type: 'success', message: 'Resume duplicated!' });
      loadResumes();
    }
  }

  async function deleteResume(id: string) {
    setDeleting(id);
    const res = await fetch(`/api/resumes/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setResumes((prev) => prev.filter((r) => r._id !== id));
      addToast({ type: 'success', message: 'Resume deleted' });
    } else {
      addToast({ type: 'error', message: 'Failed to delete resume' });
    }
    setDeleting(null);
  }

  const getScoreTier = (score?: number) => {
    if (!score) return 'none';
    if (score >= 80) return 'excellent';
    if (score >= 65) return 'good';
    if (score >= 45) return 'fair';
    return 'poor';
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>My Resumes</h1>
          <p className={styles.subtitle}>Manage all your resume versions and templates</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={createNew}>New Resume</Button>
      </div>

      {loading ? (
        <div className={styles.grid}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={`${styles.card} skeleton`} style={{ height: 160 }} />
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📄</div>
          <h2 className={styles.emptyTitle}>Create your first resume</h2>
          <p className={styles.emptyDesc}>
            Build an ATS-friendly resume and start optimizing it for your target jobs.
          </p>
          <Button leftIcon={<Plus size={16} />} onClick={createNew}>Create Resume</Button>
        </div>
      ) : (
        <div className={styles.grid}>
          {resumes.map((resume) => (
            <div key={resume._id} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.templateBadge}>{resume.template}</div>
                {resume.atsScore && (
                  <div className={styles.scoreChip} data-tier={getScoreTier(resume.atsScore)}>
                    {resume.atsScore}/100
                  </div>
                )}
              </div>

              <h3 className={styles.cardTitle}>{resume.title}</h3>
              <div className={styles.cardMeta}>
                <Clock size={12} />
                Updated {formatDate(resume.updatedAt)}
              </div>

              {resume.atsScore ? (
                <div className={styles.atsProgress}>
                  <div className={styles.atsBar}>
                    <div
                      className={styles.atsBarFill}
                      data-tier={getScoreTier(resume.atsScore)}
                      style={{ width: `${resume.atsScore}%` }}
                    />
                  </div>
                  <div className={styles.atsLabel}>
                    <span className={styles.atsLabelText}>ATS Score</span>
                    <span className={styles.atsScore} data-tier={getScoreTier(resume.atsScore)}>
                      {resume.atsScore}/100
                    </span>
                  </div>
                </div>
              ) : (
                <div className={styles.atsNoScore}>Not yet analyzed — run ATS Check</div>
              )}

              <div className={styles.cardActions}>
                <Link href={`/resume-builder/${resume._id}`} style={{ flex: 1 }}>
                  <Button variant="secondary" size="sm" fullWidth leftIcon={<Edit2 size={14} />}>
                    Edit
                  </Button>
                </Link>
                <Link href={`/ats-checker?id=${resume._id}`} style={{ flex: 1 }}>
                  <Button variant="ghost" size="sm" fullWidth leftIcon={<BarChart2 size={14} />}>
                    Analyze
                  </Button>
                </Link>
                <div className={styles.menuWrapper}>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<MoreHorizontal size={14} />}
                    onClick={() => setOpenMenu(openMenu === resume._id ? null : resume._id)}
                    aria-label="More options"
                  />
                  {openMenu === resume._id && (
                    <div className={styles.menu}>
                      <button className={styles.menuItem} onClick={() => { duplicate(resume); setOpenMenu(null); }}>
                        <Copy size={14} /> Duplicate
                      </button>
                      <button
                        className={`${styles.menuItem} ${styles.menuDanger}`}
                        onClick={() => { deleteResume(resume._id); setOpenMenu(null); }}
                        disabled={deleting === resume._id}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatDate(d: string) {
  const date = new Date(d);
  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  return `${days} days ago`;
}
