import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/tokens.css';
import '../styles/animations.css';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ResumeAI — AI-Powered ATS Resume Platform',
    template: '%s | ResumeAI',
  },
  description:
    'Build ATS-friendly resumes, check compatibility scores, match job descriptions, and get AI-powered optimization suggestions.',
  keywords: ['resume builder', 'ATS checker', 'ATS score', 'job description matcher', 'AI resume'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
