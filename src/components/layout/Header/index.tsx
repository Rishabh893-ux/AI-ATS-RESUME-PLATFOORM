/* eslint-disable @next/next/no-img-element */
'use client';


import { useSession, signOut } from 'next-auth/react';
import { Moon, Sun, ChevronDown, LogOut, Settings } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import styles from './Header.module.css';
import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useUIStore();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        {/* Breadcrumb can go here */}
      </div>

      <div className={styles.right}>
        {/* Theme toggle */}
        <button
          className={styles.iconBtn}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Profile */}
        {session?.user && (
          <div className={styles.profile}>
            <button
              className={styles.profileBtn}
              onClick={() => setProfileOpen(!profileOpen)}
              aria-expanded={profileOpen}
            >
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'Profile'}
                  className={styles.avatar}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className={styles.avatarFallback}>
                  {session.user.name?.[0] || session.user.email?.[0] || 'U'}
                </div>
              )}
              <span className={styles.profileName}>{session.user.name}</span>
              <ChevronDown size={14} className={styles.chevron} />
            </button>

            {profileOpen && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownUser}>
                  <div className={styles.dropdownName}>{session.user.name}</div>
                  <div className={styles.dropdownEmail}>{session.user.email}</div>
                </div>
                <div className={styles.dropdownDivider} />
                <Link
                  href="/settings"
                  className={styles.dropdownItem}
                  onClick={() => setProfileOpen(false)}
                >
                  <Settings size={14} />
                  Settings
                </Link>
                <button
                  className={styles.dropdownItem}
                  onClick={() => signOut({ callbackUrl: '/login' })}
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
