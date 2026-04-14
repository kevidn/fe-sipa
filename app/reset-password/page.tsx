'use client';

import { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

function getPasswordStrength(pw: string): { score: number; label: string } {
  if (!pw) return { score: 0, label: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ['', 'Lemah', 'Cukup', 'Bagus', 'Kuat'];
  return { score, label: labels[score] };
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="sipa-root flex items-center justify-center min-h-screen">Memuat...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const pwStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (pwStrength.score < 2) {
      setError('Kata sandi terlalu lemah.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan.');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="sipa-root flex flex-col items-center justify-center p-8 text-center bg-cream">
        <div className="sipa-error">Token tidak ditemukan atau tidak valid.</div>
        <Link href="/login" className="btn-primary mt-4">Kembali ke Login</Link>
      </div>
    );
  }

  return (
    <div className="sipa-root relative">
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
            Silakan masukkan kata sandi baru Anda untuk mendapatkan kembali akses penuh ke portal SIPA.
          </p>
        </div>

        <div className="sipa-blob" />
        <footer className="sipa-footer">
          EST. 2024 · UNIVERSITAS NEGERI SURABAYA
        </footer>
      </aside>

      <main className="sipa-right">
        <div className="sipa-right-header">
           <Link href="/" className="sipa-home-logo">
            <div className="logo-icon">SU</div>
            <div className="logo-text">
              <strong>SIPA UNESA</strong>
              <span>Sistem Pelayanan Akademik</span>
            </div>
          </Link>
        </div>

        <div className="sipa-right-body">
          <div className="sipa-form-wrap">
            {success ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                 <div style={{ 
                    width: '64px', 
                    height: '64px', 
                    backgroundColor: '#10B981', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    margin: '0 auto 2rem',
                    color: 'white'
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                <h2 className="sipa-heading-title">Berhasil!</h2>
                <p className="sipa-heading-sub">
                  Kata sandi Anda telah berhasil diperbarui. Mengalihkan ke halaman login...
                </p>
              </div>
            ) : (
              <>
                <div className="sipa-heading">
                  <h2 className="sipa-heading-title">Atur Ulang Sandi.</h2>
                  <p className="sipa-heading-sub">
                    Buat kata sandi baru yang kuat untuk keamanan akun Anda.
                  </p>
                </div>

                {error && <div className="sipa-error">{error}</div>}

                <form onSubmit={handleSubmit} className="sipa-form">
                  <div className="sipa-field">
                    <label className="sipa-label">KATA SANDI BARU</label>
                    <div className="sipa-input-wrap">
                      <span className="sipa-input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Minimal 8 karakter"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="sipa-input"
                        required
                      />
                      <button
                        type="button"
                        className="sipa-eye-btn"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                           </svg>
                        ) : (
                           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                           </svg>
                        )}
                      </button>
                    </div>

                    {password && (
                      <div className="sipa-pw-strength">
                        <div className="sipa-pw-bars">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`sipa-pw-bar${pwStrength.score >= i ? ` sipa-pw-bar-${pwStrength.score}` : ''}`}
                            />
                          ))}
                        </div>
                        <span className={`sipa-pw-label sipa-pw-label-${pwStrength.score}`}>
                          {pwStrength.label}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="sipa-field">
                    <label className="sipa-label">KONFIRMASI KATA SANDI</label>
                    <div className="sipa-input-wrap">
                      <span className="sipa-input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Ulangi kata sandi"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="sipa-input"
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="sipa-submit" disabled={loading}>
                    {loading ? (
                      <span className="sipa-spinner" />
                    ) : (
                      <>Simpan Kata Sandi</>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
