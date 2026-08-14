'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useResumeStore } from '@/store/resumeStore';
import { useUIStore } from '@/store/uiStore';
import BuilderSidebar from '@/components/builder/BuilderSidebar';
import ResumePreview from '@/components/builder/ResumePreview';
import ResumeToolbar from '@/components/builder/ResumeToolbar';
import styles from './builder.module.css';

export default function ResumeBuilderPage() {
  const { id } = useParams() as { id: string };
  const { setResume, setSaveStatus } = useResumeStore();
  const { addToast } = useUIStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/resumes/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load');
        return res.json();
      })
      .then((data) => {
        if (data.resume) {
          setResume(data.resume);
        }
      })
      .catch((err) => {
        addToast({ type: 'error', message: err.message });
      })
      .finally(() => setLoading(false));
  }, [id, setResume, addToast]);

  // Auto-save effect
  useEffect(() => {
    const handleSave = async () => {
      const state = useResumeStore.getState();
      if (!state.isDirty || state.saveStatus === 'saving') return;

      setSaveStatus('saving');
      try {
        const res = await fetch(`/api/resumes/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(state.resume),
        });

        if (res.ok) {
          state.setDirty(false);
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 2000);
        } else {
          throw new Error('Save failed');
        }
      } catch (err) {
        setSaveStatus('error');
      }
    };

    const interval = setInterval(handleSave, 3000);
    return () => clearInterval(interval);
  }, [id, setSaveStatus]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        Loading your resume...
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ResumeToolbar resumeId={id} />
      <div className={styles.workspace}>
        <div className={styles.sidebarWrapper}>
          <BuilderSidebar />
        </div>
        <div className={styles.previewWrapper}>
          <ResumePreview />
        </div>
      </div>
    </div>
  );
}
