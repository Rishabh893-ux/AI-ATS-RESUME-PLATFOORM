'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useUIStore } from '@/store/uiStore';
import { Moon, Sun, User, Bell, Shield, LogOut, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import styles from './settings.module.css';

export default function SettingsPage() {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useUIStore();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const name = session?.user?.name || 'Demo User';
  const email = session?.user?.email || 'demo@example.com';
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>Manage your account and preferences</p>
      </div>

      <div className={styles.content}>
        {/* Profile */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <User size={18} />
            <h2 className={styles.sectionTitle}>Profile</h2>
          </div>
          <div className={styles.card}>
            <div className={styles.profileRow}>
              <div className={styles.avatar}>{initials}</div>
              <div className={styles.profileInfo}>
                <div className={styles.profileName}>{name}</div>
                <div className={styles.profileEmail}>{email}</div>
              </div>
            </div>
            <div className={styles.divider} />
            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label className={styles.label}>Display Name</label>
                <input className={styles.input} defaultValue={name} placeholder="Your name" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input className={styles.input} defaultValue={email} placeholder="your@email.com" disabled />
                <span className={styles.inputHint}>Email is managed by your auth provider</span>
              </div>
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Sun size={18} />
            <h2 className={styles.sectionTitle}>Appearance</h2>
          </div>
          <div className={styles.card}>
            <div className={styles.settingRow}>
              <div>
                <div className={styles.settingLabel}>Theme</div>
                <div className={styles.settingDesc}>Switch between light and dark mode</div>
              </div>
              <button
                className={`${styles.themeToggle} ${theme === 'dark' ? styles.dark : ''}`}
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                <div className={styles.themeToggleKnob}>
                  {theme === 'dark' ? <Moon size={12} /> : <Sun size={12} />}
                </div>
              </button>
            </div>
            <div className={styles.divider} />
            <div className={styles.themeCards}>
              <button
                className={`${styles.themeCard} ${theme === 'light' ? styles.themeCardActive : ''}`}
                onClick={() => theme !== 'light' && toggleTheme()}
              >
                <div className={styles.themePreviewLight}>
                  <div className={styles.previewSidebar} />
                  <div className={styles.previewContent}>
                    <div className={styles.previewLine} style={{ width: '70%' }} />
                    <div className={styles.previewLine} style={{ width: '50%' }} />
                  </div>
                </div>
                <span>Light</span>
                {theme === 'light' && <Check size={14} className={styles.themeCheck} />}
              </button>
              <button
                className={`${styles.themeCard} ${theme === 'dark' ? styles.themeCardActive : ''}`}
                onClick={() => theme !== 'dark' && toggleTheme()}
              >
                <div className={styles.themePreviewDark}>
                  <div className={styles.previewSidebar} />
                  <div className={styles.previewContent}>
                    <div className={styles.previewLine} style={{ width: '70%' }} />
                    <div className={styles.previewLine} style={{ width: '50%' }} />
                  </div>
                </div>
                <span>Dark</span>
                {theme === 'dark' && <Check size={14} className={styles.themeCheck} />}
              </button>
            </div>
          </div>
        </section>

        {/* AI Configuration */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Shield size={18} />
            <h2 className={styles.sectionTitle}>AI Configuration</h2>
          </div>
          <div className={styles.card}>
            <div className={styles.field}>
              <label className={styles.label}>Gemini API Key</label>
              <input
                className={styles.input}
                type="password"
                placeholder="AIza... (from Google AI Studio)"
                defaultValue=""
              />
              <span className={styles.inputHint}>
                Get your free API key from{' '}
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                  Google AI Studio
                </a>
                . Without this, AI features use demo responses.
              </span>
            </div>
            <div className={styles.infoBox}>
              <Bell size={14} />
              <span>Add your Gemini API key to <code>.env.local</code> as <code>GEMINI_API_KEY=your_key</code> for real AI responses.</span>
            </div>
          </div>
        </section>

        {/* Account */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Shield size={18} />
            <h2 className={styles.sectionTitle}>Account</h2>
          </div>
          <div className={styles.card}>
            <div className={styles.dangerZone}>
              <div>
                <div className={styles.settingLabel}>Sign Out</div>
                <div className={styles.settingDesc}>Sign out of your current session</div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<LogOut size={14} />}
                onClick={() => signOut({ callbackUrl: '/login' })}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </section>

        <div className={styles.saveRow}>
          <Button
            onClick={handleSave}
            leftIcon={saved ? <Check size={16} /> : undefined}
          >
            {saved ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
