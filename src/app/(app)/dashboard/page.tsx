'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  ScanSearch, FileText, Briefcase, Sparkles, Mail,
  TrendingUp, Clock, ArrowRight, Plus, ChevronRight,
  Target, Zap, BarChart3, CheckCircle2
} from 'lucide-react';
import Button from '@/components/ui/Button';

import styles from './dashboard.module.css';

const QUICK_ACTIONS = [
  { label: 'ATS Checker', href: '/ats-checker', icon: ScanSearch, color: '#4F46E5', bg: '#4F46E514', description: 'Analyze your resume' },
  { label: 'Resume Builder', href: '/resume-builder', icon: FileText, color: '#059669', bg: '#05966914', description: 'Build from scratch' },
  { label: 'Job Matcher', href: '/job-matcher', icon: Briefcase, color: '#D97706', bg: '#D9770614', description: 'Match to a job' },
  { label: 'AI Tools', href: '/ai-tools', icon: Sparkles, color: '#7C3AED', bg: '#7C3AED14', description: 'Optimize bullets' },
  { label: 'Cover Letter', href: '/cover-letter', icon: Mail, color: '#DC2626', bg: '#DC262614', description: 'Generate letter' },
];

interface Resume {
  _id: string;
  title: string;
  atsScore?: number;
  updatedAt: string;
  template: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/resumes')
      .then((r) => r.json())
      .then((d) => setResumes(d.resumes || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const firstName = session?.user?.name?.split(' ')[0] || 'there';
  const scoredResumes = resumes.filter((r) => r.atsScore);
  const avgScore = scoredResumes.length
    ? Math.round(scoredResumes.reduce((a, r) => a + (r.atsScore || 0), 0) / scoredResumes.length)
    : 0;
  const bestScore = resumes.length > 0 ? Math.max(...resumes.map((r) => r.atsScore || 0)) : 0;

  const STATS = [
    { label: 'Total Resumes', value: resumes.length, icon: FileText, color: '#4F46E5', suffix: '' },
    { label: 'Avg ATS Score', value: avgScore || '—', icon: BarChart3, color: '#059669', suffix: avgScore ? '/100' : '' },
    { label: 'Best Score', value: bestScore || '—', icon: Target, color: '#D97706', suffix: bestScore ? '/100' : '' },
    { label: 'Last Activity', value: resumes.length > 0 ? formatDate(resumes[0].updatedAt) : '—', icon: Clock, color: '#7C3AED', suffix: '' },
  ];

  const checklist = [
    { done: resumes.length > 0, label: 'Create your first resume', href: '/resume-builder' },
    { done: scoredResumes.length > 0, label: 'Get an ATS score', href: '/ats-checker' },
    { done: resumes.length > 0 && bestScore >= 70, label: 'Achieve 70+ ATS score', href: '/ats-checker' },
    { done: false, label: 'Match a job description', href: '/job-matcher' },
  ];
  const checklistDone = checklist.filter(c => c.done).length;

  return (
    <div className={styles.page}>
      {/* Welcome */}
      <div className={styles.welcome}>
        <div>
          <h1 className={styles.welcomeTitle}>
            Good {getTimeOfDay()}, {firstName} 👋
          </h1>
          <p className={styles.welcomeSub}>
            {resumes.length === 0
              ? 'Get started by creating your first resume below.'
              : `You have ${resumes.length} resume${resumes.length !== 1 ? 's' : ''}. Keep optimizing!`}
          </p>
        </div>
        <Link href="/resume-builder">
          <Button leftIcon={<Plus size={16} />} size="md">New Resume</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        {STATS.map(({ label, value, icon: Icon, color, suffix }) => (
          <div key={label} className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: `${color}14`, color }}>
              <Icon size={18} />
            </div>
            <div>
              <div className={styles.statLabel}>{label}</div>
              <div className={styles.statValue}>{value}{suffix}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.content}>
        {/* Left column */}
        <div className={styles.left}>
          {/* Quick Actions */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Quick Actions</h2>
            <div className={styles.quickActions}>
              {QUICK_ACTIONS.map(({ label, href, icon: Icon, color, bg, description }) => (
                <Link key={href} href={href} className={styles.actionCard}>
                  <div className={styles.actionIcon} style={{ background: bg, color }}>
                    <Icon size={20} />
                  </div>
                  <div className={styles.actionText}>
                    <div className={styles.actionLabel}>{label}</div>
                    <div className={styles.actionDesc}>{description}</div>
                  </div>
                  <ChevronRight size={16} className={styles.actionArrow} />
                </Link>
              ))}
            </div>
          </section>

          {/* Getting Started Checklist */}
          <section className={styles.section}>
            <div className={styles.checklistCard}>
              <div className={styles.checklistHeader}>
                <div className={styles.checklistTitle}>
                  <Zap size={16} style={{ color: '#D97706' }} />
                  Getting Started
                </div>
                <div className={styles.checklistProgress}>
                  {checklistDone}/{checklist.length}
                </div>
              </div>
              <div className={styles.checklistBar}>
                <div className={styles.checklistBarFill} style={{ width: `${(checklistDone / checklist.length) * 100}%` }} />
              </div>
              <div className={styles.checklistItems}>
                {checklist.map((item) => (
                  <Link key={item.label} href={item.done ? '#' : item.href} className={`${styles.checklistItem} ${item.done ? styles.checklistItemDone : ''}`}>
                    <div className={`${styles.checklistDot} ${item.done ? styles.checklistDotDone : ''}`}>
                      {item.done && <CheckCircle2 size={14} />}
                    </div>
                    <span className={styles.checklistLabel}>{item.label}</span>
                    {!item.done && <ArrowRight size={12} className={styles.checklistArrow} />}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Right column — Recent Resumes */}
        <div className={styles.right}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>My Resumes</h2>
              <Link href="/my-resumes" className={styles.viewAll}>View all →</Link>
            </div>

            {loading ? (
              <div className={styles.resumeList}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`${styles.resumeCard} skeleton`} style={{ height: 88 }} />
                ))}
              </div>
            ) : resumes.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📄</div>
                <div className={styles.emptyTitle}>No resumes yet</div>
                <div className={styles.emptyDesc}>Create your first ATS-optimized resume</div>
                <Link href="/resume-builder">
                  <Button size="sm" leftIcon={<Plus size={14} />}>Create Resume</Button>
                </Link>
              </div>
            ) : (
              <div className={styles.resumeList}>
                {resumes.slice(0, 5).map((resume) => {
                  const tier = resume.atsScore ? getScoreTier(resume.atsScore) : null;
                  const ringColor = resume.atsScore
                    ? resume.atsScore >= 80 ? '#16A34A' : resume.atsScore >= 65 ? '#2563EB' : resume.atsScore >= 45 ? '#D97706' : '#DC2626'
                    : '#E5E5E3';
                  const circumference = 2 * Math.PI * 16; // r=16
                  const offset = resume.atsScore
                    ? circumference - (resume.atsScore / 100) * circumference
                    : circumference;
                  return (
                    <div key={resume._id} className={styles.resumeCard}>
                      {resume.atsScore ? (
                        <div className={styles.scoreMiniRing}>
                          <svg width="48" height="48" viewBox="0 0 48 48">
                            <circle cx="24" cy="24" r="16" fill="none" stroke="var(--bg-elevated)" strokeWidth="4"/>
                            <circle cx="24" cy="24" r="16" fill="none" stroke={ringColor} strokeWidth="4"
                              strokeDasharray={circumference}
                              strokeDashoffset={offset}
                              strokeLinecap="round"
                              transform="rotate(-90 24 24)"
                              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                            />
                          </svg>
                          <span className={styles.scoreMiniRingNum}>{resume.atsScore}</span>
                        </div>
                      ) : (
                        <div className={styles.scoreMiniRing}>
                          <svg width="48" height="48" viewBox="0 0 48 48">
                            <circle cx="24" cy="24" r="16" fill="none" stroke="var(--bg-elevated)" strokeWidth="4"/>
                          </svg>
                          <span className={styles.scoreMiniRingNum} style={{ color: 'var(--text-muted)', fontSize: 8 }}>N/A</span>
                        </div>
                      )}
                      <div className={styles.resumeInfo}>
                        <div className={styles.resumeTitle}>{resume.title}</div>
                        <div className={styles.resumeMeta}>
                          <Clock size={11} />
                          {formatDate(resume.updatedAt)}
                        </div>
                        {resume.atsScore && tier && (
                          <span className={styles.scoreBadge} data-score={tier}>
                            {tier.charAt(0).toUpperCase() + tier.slice(1)} · {resume.atsScore}/100
                          </span>
                        )}
                        {!resume.atsScore && (
                          <div className={styles.noScore}>Not analyzed yet</div>
                        )}
                      </div>
                      <div className={styles.resumeActions}>
                        <Link href={`/resume-builder/${resume._id}`}>
                          <Button size="sm" variant="secondary">Edit</Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Improvement loop */}
          <section className={styles.section}>
            <div className={styles.loopCard}>
              <div className={styles.loopTitle}>
                <TrendingUp size={16} />
                The Resume Improvement Loop
              </div>
              <div className={styles.loop}>
                {['Build', 'Check', 'Match', 'Improve', 'Export'].map((step, i, arr) => (
                  <div key={step} className={styles.loopStep}>
                    <span className={styles.loopLabel}>{step}</span>
                    {i < arr.length - 1 && <ArrowRight size={11} className={styles.loopArrow} />}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      <p className={styles.disclaimer}>
        * ATS Compatibility Scores are generated by this application and do not represent
        the proprietary scoring system of any specific ATS vendor.
      </p>
    </div>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getScoreTier(score: number): string {
  if (score >= 80) return 'excellent';
  if (score >= 65) return 'good';
  if (score >= 45) return 'fair';
  return 'poor';
}
