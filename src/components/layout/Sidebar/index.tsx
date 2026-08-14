'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  ScanSearch,
  FileText,
  Briefcase,
  Sparkles,
  Mail,
  FolderOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  LogOut,
} from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/ats-checker', label: 'ATS Checker', icon: ScanSearch },
  { href: '/resume-builder', label: 'Resume Builder', icon: FileText },
  { href: '/job-matcher', label: 'Job Matcher', icon: Briefcase },
  { href: '/ai-tools', label: 'AI Tools', icon: Sparkles },
  { href: '/cover-letter', label: 'Cover Letter', icon: Mail },
  { href: '/my-resumes', label: 'My Resumes', icon: FolderOpen },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { data: session } = useSession();

  const name = session?.user?.name || 'Demo User';
  const email = session?.user?.email || 'demo@example.com';
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''}`}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <Zap size={18} />
        </div>
        {!sidebarCollapsed && <span className={styles.logoText}>ResumeAI</span>}
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              title={sidebarCollapsed ? label : undefined}
            >
              <Icon size={18} className={styles.navIcon} />
              {!sidebarCollapsed && <span className={styles.navLabel}>{label}</span>}
              {isActive && !sidebarCollapsed && <div className={styles.activeIndicator} />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section — Settings + User profile */}
      <div className={styles.bottom}>
        <Link
          href="/settings"
          className={`${styles.navItem} ${pathname === '/settings' ? styles.active : ''}`}
          title={sidebarCollapsed ? 'Settings' : undefined}
        >
          <Settings size={18} className={styles.navIcon} />
          {!sidebarCollapsed && <span className={styles.navLabel}>Settings</span>}
        </Link>

        {/* User profile */}
        <div className={`${styles.userProfile} ${sidebarCollapsed ? styles.userProfileCollapsed : ''}`}>
          <div className={styles.userAvatar}>{initials}</div>
          {!sidebarCollapsed && (
            <div className={styles.userInfo}>
              <div className={styles.userName}>{name.split(' ')[0]}</div>
              <div className={styles.userEmail}>{email}</div>
            </div>
          )}
          {!sidebarCollapsed && (
            <button
              className={styles.signOutBtn}
              onClick={() => signOut({ callbackUrl: '/login' })}
              title="Sign out"
            >
              <LogOut size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        className={styles.collapseBtn}
        onClick={toggleSidebar}
        aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}
