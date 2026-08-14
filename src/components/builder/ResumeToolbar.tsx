'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { useUIStore } from '@/store/uiStore';
import type { ResumeTemplate } from '@/types/resume';
import { Download, Check, Loader2, Sparkles, AlertCircle, FileText, ChevronDown, Layout, Palette } from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import styles from './ResumeToolbar.module.css';


const TEMPLATES = [
  { id: 'professional', label: 'Classic Professional', desc: 'Traditional ATS-friendly layout' },
  { id: 'modern', label: 'Modern Bold', desc: 'Contemporary colored header' },
  { id: 'minimal', label: 'Clean Minimal', desc: 'Elegant whitespace-focused' },
];

export default function ResumeToolbar({ resumeId }: { resumeId: string }) {
  const { resume, updateTitle, updateTemplate, saveStatus } = useResumeStore();
  const { addToast } = useUIStore();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);

  const currentTemplate = TEMPLATES.find(t => t.id === (resume.template || 'professional')) || TEMPLATES[0];

  const handlePDFExport = () => {
    setShowExportMenu(false);
    document.body.classList.add('print-mode');
    window.print();
    setTimeout(() => document.body.classList.remove('print-mode'), 500);
  };

  const handleDOCXExport = async () => {
    setShowExportMenu(false);
    addToast({ type: 'info', message: 'Preparing DOCX download...' });
    try {
      const res = await fetch(`/api/resumes/${resumeId}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format: 'docx' }),
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resume.title.replace(/\s+/g, '_')}.docx`;
      a.click();
      URL.revokeObjectURL(url);
      addToast({ type: 'success', message: 'DOCX downloaded!' });
    } catch {
      addToast({ type: 'info', message: 'Use Export → PDF for best results' });
    }
  };

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.left}>
          <Link href="/my-resumes" className={styles.backLink} title="Back to My Resumes">
            <ChevronDown size={14} style={{ transform: 'rotate(90deg)' }} />
          </Link>
          <div className={styles.divider} />
          <input
            className={styles.titleInput}
            value={resume.title}
            onChange={(e) => updateTitle(e.target.value)}
            placeholder="Untitled Resume"
          />

          <div className={styles.saveStatus}>
            {saveStatus === 'saving' && (
              <><Loader2 size={13} className={styles.spinner} /> Saving...</>
            )}
            {saveStatus === 'saved' && (
              <><Check size={13} className={styles.success} /> Saved</>
            )}
            {saveStatus === 'error' && (
              <><AlertCircle size={13} className={styles.error} /> Failed to save</>
            )}
            {saveStatus === 'idle' && (
              <span className={styles.idleText}>All changes saved</span>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          {/* Template switcher */}
          <div className={styles.menuWrapper}>
            <button
              className={styles.templateBtn}
              onClick={() => { setShowTemplateMenu(!showTemplateMenu); setShowExportMenu(false); }}
            >
              <Palette size={15} />
              <span>{currentTemplate.label}</span>
              <ChevronDown size={13} className={showTemplateMenu ? styles.chevronUp : ''} />
            </button>
            {showTemplateMenu && (
              <>
                <div className={styles.menuOverlay} onClick={() => setShowTemplateMenu(false)} />
                <div className={styles.dropdownMenu}>
                  <div className={styles.menuHeader}>Resume Template</div>
                  {TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      className={`${styles.menuItem} ${resume.template === tpl.id ? styles.menuItemActive : ''}`}
                      onClick={() => { updateTemplate(tpl.id as ResumeTemplate); setShowTemplateMenu(false); addToast({ type: 'success', message: `Template changed to ${tpl.label}` }); }}
                    >
                      <Layout size={14} />
                      <div className={styles.menuItemContent}>
                        <div className={styles.menuItemLabel}>{tpl.label}</div>
                        <div className={styles.menuItemDesc}>{tpl.desc}</div>
                      </div>
                      {resume.template === tpl.id && <Check size={14} className={styles.menuItemCheck} />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <Link href={`/ats-checker?id=${resumeId}`}>
            <Button variant="ghost" size="sm" leftIcon={<FileText size={15} />}>
              ATS Check
            </Button>
          </Link>
          <Link href="/ai-tools">
            <Button variant="secondary" size="sm" leftIcon={<Sparkles size={15} />}>
              AI Tools
            </Button>
          </Link>

          {/* Export menu */}
          <div className={styles.menuWrapper}>
            <Button
              variant="primary"
              size="sm"
              onClick={() => { setShowExportMenu(!showExportMenu); setShowTemplateMenu(false); }}
              leftIcon={<Download size={15} />}
            >
              Export
              <ChevronDown size={13} style={{ marginLeft: 2 }} />
            </Button>
            {showExportMenu && (
              <>
                <div className={styles.menuOverlay} onClick={() => setShowExportMenu(false)} />
                <div className={styles.dropdownMenu}>
                  <button className={styles.menuItem} onClick={handlePDFExport}>
                    <FileText size={14} />
                    <div className={styles.menuItemContent}>
                      <div className={styles.menuItemLabel}>Export as PDF</div>
                      <div className={styles.menuItemDesc}>Print via browser dialog</div>
                    </div>
                  </button>
                  <button className={styles.menuItem} onClick={handleDOCXExport}>
                    <Download size={14} />
                    <div className={styles.menuItemContent}>
                      <div className={styles.menuItemLabel}>Export as DOCX</div>
                      <div className={styles.menuItemDesc}>Microsoft Word format</div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
