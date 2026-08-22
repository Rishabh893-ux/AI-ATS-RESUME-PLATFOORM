'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Zap, Lock, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token. Please request a new reset link.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong. Please try again.');
      } else {
        setIsSuccess(true);
        setTimeout(() => router.push('/login'), 3000);
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
          {!isSuccess ? (
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
                  <Lock size={26} color="#6366f1" />
                </div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
                  Reset Password
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  Enter your new password below. Make sure it&apos;s at least 6 characters.
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
                  <label htmlFor="password" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{
                        width: '100%',
                        padding: '0.8rem 3rem 0.8rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        boxSizing: 'border-box',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="confirmPassword" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      padding: '0.8rem 1rem',
                      borderRadius: '8px',
                      border: `1px solid ${confirmPassword && password !== confirmPassword ? '#ef4444' : 'var(--border)'}`,
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem',
                    }}
                  />
                  {confirmPassword && password !== confirmPassword && (
                    <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>Passwords do not match</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !token}
                  style={{
                    padding: '0.875rem',
                    borderRadius: '8px',
                    background: (isLoading || !token) ? 'var(--text-muted)' : 'linear-gradient(135deg, #4338ca, #6d28d9)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    border: 'none',
                    cursor: (isLoading || !token) ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
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
                Password Reset!
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Your password has been successfully updated. Redirecting you to sign in...
              </p>
            </div>
          )}
        </div>

        {/* Back Link */}
        {!isSuccess && (
          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Remember your password?{' '}
            <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
