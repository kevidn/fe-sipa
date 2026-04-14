'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan.');
      }

      setToastMessage('Tautan reset kata sandi telah dikirim ke email Anda.');
      setEmail('');
      
      setTimeout(() => {
        setToastMessage('');
      }, 5000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sipa-root relative">
      {/* ── TOAST NOTIFICATION ── */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            backgroundColor: '#10B981',
            color: 'white',
            padding: '16px 24px',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'fadeSlideIn 0.4s ease-out forwards'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span style={{ fontWeight: 500 }}>{toastMessage}</span>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-20px) translateX(20px); }
          to { opacity: 1; transform: translateY(0) translateX(0); }
        }
      `}} />

      {/* ── LEFT PANEL ── */}
      <aside className="sipa-left">
        <div className="sipa-badge">
          <span className="sipa-badge-dot" />
          PEMULIHAN AKUN
        </div>

        <div className="sipa-illus-card">
          <Image
            src="/illustration.png"
            alt="SIPA Illustration"
            width={160}
            height={130}
            priority
            className="sipa-illus-img"
          />
        </div>

        <div className="sipa-brand">
          <h1 className="sipa-brand-main">SIPA</h1>
          <h2 className="sipa-brand-sub">UNESA.</h2>
        </div>

        <div className="sipa-desc">
          <p className="sipa-desc-title">Keamanan Portal Akademik</p>
          <p className="sipa-desc-body">
            Gunakan email UNESA Anda yang terdaftar untuk memulihkan akses ke portal SIPA.
          </p>
        </div>

        <div className="sipa-blob" />
        <footer className="sipa-footer">
          EST. 2024 · UNIVERSITAS NEGERI SURABAYA
        </footer>
      </aside>

      {/* ── RIGHT PANEL ── */}
      <main className="sipa-right">
        <div className="sipa-right-header" style={{ paddingBottom: '3rem' }}>
          <Link href="/login" className="sipa-forgot" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--sipa-green)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Kembali ke Login
          </Link>
        </div>

        <div className="sipa-right-body">
          <div className="sipa-form-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            <div style={{ 
              width: '64px', 
              height: '64px', 
              backgroundColor: 'var(--sipa-green-bg)', 
              borderRadius: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '2rem',
              color: 'var(--sipa-green)',
              border: '1px solid #dcfce7'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            <div className="sipa-heading" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2 className="sipa-heading-title" style={{ fontSize: '2.2rem' }}>Lupa Password?</h2>
              <p className="sipa-heading-sub" style={{ maxWidth: '300px', margin: '0.5rem auto 0' }}>
                Masukkan email yang terdaftar, kami akan mengirimkan tautan untuk mereset kata sandi Anda.
              </p>
            </div>

            {error && <div className="sipa-error" style={{ width: '100%' }}>{error}</div>}

            <form onSubmit={handleSubmit} className="sipa-form" style={{ width: '100%' }}>
              <div className="sipa-field">
                <label className="sipa-label">Email</label>
                <div className="sipa-input-wrap">
                  <span className="sipa-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    placeholder="contoh@mhs.unesa.ac.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="sipa-input"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="sipa-submit" disabled={loading} style={{ background: 'var(--sipa-green)', boxShadow: '0 4px 18px rgba(0, 168, 107, 0.2)' }}>
                {loading ? (
                  <span className="sipa-spinner" />
                ) : (
                  <>Kirim Link Reset</>
                )}
              </button>
            </form>

            <div style={{
              marginTop: '2rem',
              padding: '1.2rem',
              backgroundColor: '#eff6ff',
              borderRadius: '12px',
              border: '1px solid #dbeafe',
              width: '100%'
            }}>
              <p style={{ fontSize: '0.82rem', color: '#1e40af', lineHeight: '1.5' }}>
                <strong>Catatan:</strong> Link reset password akan dikirim ke email Anda dan berlaku selama 1 jam.
              </p>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '3rem', fontSize: '0.85rem', color: 'var(--text-mid)' }}>
              Butuh bantuan? <Link href="#" style={{ color: 'var(--sipa-green)', fontWeight: 600 }}>Hubungi Support</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
