'use client';

import { useState } from 'react';
import { Zap, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [devResetUrl, setDevResetUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong. Please try again.');
      } else {
        setIsSubmitted(true);
        if (data.devResetUrl) setDevResetUrl(data.devResetUrl);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-base)',
      padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <Link href="/login" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '2.5rem',
          textDecoration: 'none',
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            background: 'linear-gradient(135deg, #4338ca, #7c3aed)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Zap size={18} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
            ResumeAI
          </span>
        </Link>

        {/* Card */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '2.5rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        }}>
          {!isSubmitted ? (
            <>
              <div style={{ marginBottom: '2rem' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: 'linear-gradient(135deg, rgba(67,56,202,0.12), rgba(124,58,237,0.12))',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}>
                  <Mail size={26} color="#6366f1" />
                </div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
                  Forgot Password?
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  No worries! Enter your email address and we&apos;ll send you a link to reset your password.
                </p>
              </div>

              {error && (
                <div style={{
                  color: '#ef4444',
                  fontSize: '0.875rem',
                  marginBottom: '1.25rem',
                  background: '#fef2f2',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #fecaca',
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="email" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={{
                      padding: '0.8rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    padding: '0.875rem',
                    borderRadius: '8px',
                    background: isLoading
                      ? 'var(--text-muted)'
                      : 'linear-gradient(135deg, #4338ca, #6d28d9)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    border: 'none',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            /* Success State */
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(16,185,129,0.12))',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}>
                <CheckCircle2 size={32} color="#22c55e" />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                Check your inbox!
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                If an account exists for <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>,
                a password reset link has been sent. Check your spam folder if you don&apos;t see it.
              </p>

              {devResetUrl && (
                <div style={{
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  textAlign: 'left',
                }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e', marginBottom: '0.5rem' }}>
                    🛠️ DEV MODE — Reset Link (email not sent):
                  </p>
                  <a
                    href={devResetUrl}
                    style={{ fontSize: '0.75rem', color: '#4338ca', wordBreak: 'break-all', textDecoration: 'underline' }}
                  >
                    {devResetUrl}
                  </a>
                </div>
              )}

              <button
                onClick={() => { setIsSubmitted(false); setEmail(''); setDevResetUrl(''); }}
                style={{
                  background: 'none',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '0.75rem 1.5rem',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                Try a different email
              </button>
            </div>
          )}
        </div>

        {/* Back to Login */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link
            href="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              textDecoration: 'none',
              fontWeight: 500,
              transition: 'color 0.2s',
            }}
          >
            <ArrowLeft size={14} />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
