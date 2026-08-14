import { Loader2 } from 'lucide-react';

export default function LoginLoading() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'var(--bg-base)',
      gap: '1rem',
      color: 'var(--text-secondary)'
    }}>
      <Loader2 className="animate-spin" size={32} />
      <p style={{ fontSize: 'var(--text-sm)' }}>Loading...</p>
    </div>
  );
}
