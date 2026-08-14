'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Zap, Layout, Loader2, ChevronRight, Check } from 'lucide-react';
import styles from './resume-builder-index.module.css';

const TEMPLATES = [
  {
    id: 'professional',
    name: 'Classic Professional',
    desc: 'Clean, traditional layout. Best ATS compatibility. Trusted by hiring managers.',
    badge: 'Most Popular',
    badgeColor: '#4F46E5',
    preview: 'classic',
    icon: FileText,
  },
  {
    id: 'modern',
    name: 'Modern Bold',
    desc: 'Contemporary design with accent header. Great for tech & creative roles.',
    badge: 'Recommended',
    badgeColor: '#059669',
    preview: 'modern',
    icon: Zap,
  },
  {
    id: 'minimal',
    name: 'Clean Minimal',
    desc: 'Elegant whitespace-focused layout. Lets your content speak for itself.',
    badge: 'Clean',
    badgeColor: '#7C3AED',
    preview: 'minimal',
    icon: Layout,
  },
];

export default function ResumeBuilderIndex() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [creating, setCreating] = useState(false);

  async function handleCreate() {
    setCreating(true);
    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Untitled Resume', template: selectedTemplate }),
      });
      const data = await res.json();
      if (data.resume?._id) {
        router.push(`/resume-builder/${data.resume._id}`);
      } else {
        router.push('/dashboard');
      }
    } catch {
      router.push('/dashboard');
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerBadge}>
          <Zap size={14} />
          Resume Builder
        </div>
        <h1 className={styles.title}>Choose a Template</h1>
        <p className={styles.subtitle}>
          Select a starting template. You can always change it later in the builder.
        </p>
      </div>

      <div className={styles.templates}>
        {TEMPLATES.map((tpl) => {
          const Icon = tpl.icon;
          const isSelected = selectedTemplate === tpl.id;
          return (
            <button
              key={tpl.id}
              className={`${styles.templateCard} ${isSelected ? styles.selected : ''}`}
              onClick={() => setSelectedTemplate(tpl.id)}
            >
              {/* Preview area */}
              <div className={`${styles.preview} ${styles[`preview_${tpl.preview}`]}`}>
                <ResumePreviewMini template={tpl.preview} />
              </div>

              <div className={styles.templateInfo}>
                <div className={styles.templateTop}>
                  <div className={styles.templateIconWrap} style={{ background: `${tpl.badgeColor}18`, color: tpl.badgeColor }}>
                    <Icon size={16} />
                  </div>
                  <span className={styles.templateBadge} style={{ background: `${tpl.badgeColor}18`, color: tpl.badgeColor }}>
                    {tpl.badge}
                  </span>
                </div>
                <h3 className={styles.templateName}>{tpl.name}</h3>
                <p className={styles.templateDesc}>{tpl.desc}</p>
                {isSelected && (
                  <div className={styles.selectedCheck}>
                    <Check size={14} /> Selected
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className={styles.actions}>
        <button className={styles.backBtn} onClick={() => router.push('/my-resumes')}>
          Back to My Resumes
        </button>
        <button
          className={styles.createBtn}
          onClick={handleCreate}
          disabled={creating}
        >
          {creating ? (
            <><Loader2 size={18} className={styles.spin} /> Creating workspace...</>
          ) : (
            <>Start Building <ChevronRight size={18} /></>
          )}
        </button>
      </div>

      <p className={styles.disclaimer}>
        All templates are optimized for ATS (Applicant Tracking Systems)
      </p>
    </div>
  );
}

function ResumePreviewMini({ template }: { template: string }) {
  return (
    <div className={`${styles.miniResume} ${styles[`mini_${template}`]}`}>
      {template === 'modern' ? (
        <>
          <div className={styles.miniHeader} />
          <div className={styles.miniBody}>
            <div className={styles.miniSection}>
              <div className={styles.miniLine} style={{ width: '60%', height: 8 }} />
              <div className={styles.miniLine} style={{ width: '40%', height: 5 }} />
            </div>
            <div className={styles.miniSection}>
              <div className={styles.miniLabel} />
              <div className={styles.miniLine} style={{ width: '90%', height: 4 }} />
              <div className={styles.miniLine} style={{ width: '75%', height: 4 }} />
              <div className={styles.miniLine} style={{ width: '60%', height: 4 }} />
            </div>
            <div className={styles.miniSection}>
              <div className={styles.miniLabel} />
              <div className={styles.miniLine} style={{ width: '50%', height: 4 }} />
              <div className={styles.miniLine} style={{ width: '70%', height: 4 }} />
            </div>
          </div>
        </>
      ) : template === 'minimal' ? (
        <>
          <div className={styles.miniBody}>
            <div className={styles.miniSection} style={{ borderBottom: '1px solid #e5e5e3', paddingBottom: 8, marginBottom: 8 }}>
              <div className={styles.miniLine} style={{ width: '55%', height: 9 }} />
              <div className={styles.miniLine} style={{ width: '80%', height: 4 }} />
            </div>
            <div className={styles.miniSection}>
              <div className={styles.miniLine} style={{ width: '30%', height: 5, background: '#9CA3AF' }} />
              <div className={styles.miniLine} style={{ width: '90%', height: 4 }} />
              <div className={styles.miniLine} style={{ width: '70%', height: 4 }} />
            </div>
            <div className={styles.miniSection}>
              <div className={styles.miniLine} style={{ width: '30%', height: 5, background: '#9CA3AF' }} />
              <div className={styles.miniLine} style={{ width: '80%', height: 4 }} />
            </div>
          </div>
        </>
      ) : (
        // Classic
        <>
          <div className={styles.miniBody}>
            <div className={styles.miniClassicHeader}>
              <div className={styles.miniLine} style={{ width: '60%', height: 10 }} />
              <div className={styles.miniLine} style={{ width: '90%', height: 4 }} />
            </div>
            <div className={styles.miniSection}>
              <div className={styles.miniClassicSection} />
              <div className={styles.miniLine} style={{ width: '95%', height: 4 }} />
              <div className={styles.miniLine} style={{ width: '80%', height: 4 }} />
              <div className={styles.miniLine} style={{ width: '65%', height: 4 }} />
            </div>
            <div className={styles.miniSection}>
              <div className={styles.miniClassicSection} />
              <div className={styles.miniLine} style={{ width: '50%', height: 4 }} />
              <div className={styles.miniLine} style={{ width: '70%', height: 4 }} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
