'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'masuk' | 'daftar'>('masuk');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nim_nip: nim, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'NIM/NIP atau kata sandi salah.');
      }
      // Handle successful login — redirect or store token
      window.location.href = '/dashboard';
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sipa-root">
      {/* ── LEFT PANEL ── */}
      <aside className="sipa-left">
        {/* Badge */}
        <div className="sipa-badge">
          <span className="sipa-badge-dot" />
          PORTAL AKADEMIK
        </div>

        {/* Illustration card */}
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

        {/* Brand text */}
        <div className="sipa-brand">
          <h1 className="sipa-brand-main">SIPA</h1>
          <h2 className="sipa-brand-sub">UNESA.</h2>
        </div>

        {/* Description */}
        <div className="sipa-desc">
          <p className="sipa-desc-title">Sistem Informasi Pelayanan Akademik</p>
          <p className="sipa-desc-body">
            Digitalisasi layanan surat-menyurat dengan alur kerja terotomatisasi
            dan pemantauan SLA untuk efisiensi birokrasi.
          </p>
        </div>

        {/* Decorative blob */}
        <div className="sipa-blob" />

        {/* Footer */}
        <footer className="sipa-footer">
          EST. 2024 · UNIVERSITAS NEGERI SURABAYA
        </footer>
      </aside>

      {/* ── RIGHT PANEL ── */}
      <main className="sipa-right">
        <div className="sipa-form-wrap">
          {/* Tabs */}
          <nav className="sipa-tabs">
            <button
              className={`sipa-tab${activeTab === 'masuk' ? ' sipa-tab-active' : ''}`}
              onClick={() => setActiveTab('masuk')}
            >
              Masuk
            </button>
            <button
              className={`sipa-tab${activeTab === 'daftar' ? ' sipa-tab-active' : ''}`}
              onClick={() => setActiveTab('daftar')}
            >
              Daftar Akun
            </button>
          </nav>
          <div className="sipa-tab-divider" />

          {activeTab === 'masuk' ? (
            <>
              {/* Heading */}
              <div className="sipa-heading">
                <h2 className="sipa-heading-title">Selamat Datang.</h2>
                <p className="sipa-heading-sub">
                  Akses portal untuk memantau pengajuan akademikmu.
                </p>
              </div>

              {/* Error */}
              {error && <div className="sipa-error">{error}</div>}

              {/* Form */}
              <form onSubmit={handleSubmit} className="sipa-form">
                {/* NIM / NIP */}
                <div className="sipa-field">
                  <label className="sipa-label" htmlFor="nim">
                    NIM / NIP
                  </label>
                  <div className="sipa-input-wrap">
                    <span className="sipa-input-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                      </svg>
                    </span>
                    <input
                      id="nim"
                      type="text"
                      placeholder="Masukkan Identitas"
                      value={nim}
                      onChange={(e) => setNim(e.target.value)}
                      className="sipa-input"
                      required
                      autoComplete="username"
                    />
                  </div>
                </div>

                {/* Kata Sandi */}
                <div className="sipa-field">
                  <div className="sipa-label-row">
                    <label className="sipa-label" htmlFor="password">
                      KATA SANDI
                    </label>
                    <Link href="/forgot-password" className="sipa-forgot">
                      Lupa Sandi?
                    </Link>
                  </div>
                  <div className="sipa-input-wrap">
                    <span className="sipa-input-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="sipa-input"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="sipa-eye-btn"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
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
                </div>

                {/* Submit */}
                <button type="submit" className="sipa-submit" disabled={loading}>
                  {loading ? (
                    <span className="sipa-spinner" />
                  ) : (
                    <>
                      Akses Sistem
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="sipa-heading">
              <h2 className="sipa-heading-title">Daftar Akun.</h2>
              <p className="sipa-heading-sub">
                Fitur pendaftaran akan segera tersedia.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
