'use client';

import { useState, Suspense, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type Role = 'MAHASISWA' | 'TENDIK' | 'KAPRODI';

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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="sipa-root flex items-center justify-center min-h-screen">Memuat...</div>}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  // Login state
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'masuk' | 'daftar'>('masuk');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Register state
  const [regNama, setRegNama] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regNim, setRegNim] = useState('');
  const [regWa, setRegWa] = useState('');
  const [regRole, setRegRole] = useState<Role>('MAHASISWA');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');

  // Notification state
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (tabParam === 'daftar') {
      setActiveTab('daftar');
    } else {
      setActiveTab('masuk');
    }
  }, [tabParam]);

  const pwStrength = getPasswordStrength(regPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        username: nim,
        password: password
      };
      console.log("Mencoba Login dengan:", payload);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        console.error("Detail Error Login:", data);
        throw new Error(data?.error || data?.message || 'NIM/NIP atau kata sandi salah.');
      }

      const successData = await res.json();
      console.log("Login Berhasil:", successData);

      if (successData.token) {
        localStorage.setItem('sipa_token', successData.token);
      }

      if (successData.data) {
        localStorage.setItem('sipa_user', JSON.stringify(successData.data));
      }

      // Redirect berdasarkan role
      const role = successData.data?.role?.toUpperCase();
      if (role === 'MAHASISWA') {
        window.location.href = '/dashboard/mahasiswa';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegLoading(true);
    try {
      const payload = {
        nama_lengkap: regNama,
        email: regEmail,
        username: regNim,
        phone_number: regWa,
        role: regRole,
        password: regPassword,
      };
      console.log("Mengirim data registrasi:", payload);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        console.error("Detail Error Register Server:", data);
        throw new Error(data?.error || data?.message || 'Pendaftaran gagal. Coba lagi.');
      }

      // Tampilkan Notifikasi Toast
      setToastMessage('Pendaftaran berhasil! Silakan masuk dengan akun Anda.');

      // Bonus UX: Pindahkan NIM ke form login otomatis agar tidak perlu ketik ulang
      setNim(regNim);

      // Pindah ke tab login otomatis
      setActiveTab('masuk');

      // Hilangkan notifikasi setelah 4 detik
      setTimeout(() => {
        setToastMessage('');
      }, 4000);

    } catch (err: unknown) {
      setRegError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setRegLoading(false);
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
            backgroundColor: '#10B981', // Warna hijau elegan (Emerald)
            color: 'white',
            padding: '16px 24px',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.3s ease',
            animation: 'fadeSlideIn 0.4s ease-out forwards'
          }}
        >
          {/* Ikon Centang */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span style={{ fontWeight: 500, fontSize: '15px' }}>
            {toastMessage}
          </span>
        </div>
      )}

      {/* Tambahkan keyframes untuk animasi toast di dalam tag style (atau bisa dipindah ke globals.css nantinya) */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-20px) translateX(20px); }
          to { opacity: 1; transform: translateY(0) translateX(0); }
        }
      `}} />

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
        {/* ── Tab nav — always visible, never scrolls away ── */}
        <div className="sipa-right-header">
          <Link href="/" className="sipa-home-logo" aria-label="Kembali ke Beranda">
            <div className="logo-icon">SU</div>
            <div className="logo-text">
              <strong>SIPA UNESA</strong>
              <span>Sistem Pelayanan Akademik</span>
            </div>
          </Link>
          <div className="sipa-right-tabs-inner">
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
          </div>
        </div>

        {/* ── Scrollable form body ── */}
        <div className="sipa-right-body">
          <div className="sipa-form-wrap">
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
              <>
                {/* Heading */}
                <div className="sipa-heading">
                  <h2 className="sipa-heading-title">Registrasi Baru.</h2>
                  <p className="sipa-heading-sub">
                    Lengkapi data untuk bergabung dalam sistem SIPA.
                  </p>
                </div>

                {/* Error */}
                {regError && <div className="sipa-error">{regError}</div>}

                {/* Register Form */}
                <form onSubmit={handleRegister} className="sipa-form">
                  {/* Nama Lengkap */}
                  <div className="sipa-field">
                    <label className="sipa-label" htmlFor="reg-nama">NAMA LENGKAP</label>
                    <div className="sipa-input-wrap">
                      <span className="sipa-input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="16" rx="2" />
                          <path d="M8 10h8M8 14h4" />
                        </svg>
                      </span>
                      <input
                        id="reg-nama"
                        type="text"
                        placeholder="Sesuai KTP / KTM"
                        value={regNama}
                        onChange={(e) => setRegNama(e.target.value)}
                        className="sipa-input"
                        required
                        autoComplete="name"
                      />
                    </div>
                  </div>

                  {/* Email UNESA */}
                  <div className="sipa-field">
                    <label className="sipa-label" htmlFor="reg-email">EMAIL UNESA</label>
                    <div className="sipa-input-wrap">
                      <span className="sipa-input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                      </span>
                      <input
                        id="reg-email"
                        type="email"
                        placeholder="EmailAktif@unesa.ac.id"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="sipa-input"
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* NIM / NIP + WhatsApp — two columns */}
                  <div className="sipa-row">
                    <div className="sipa-field">
                      <label className="sipa-label" htmlFor="reg-nim">NIM / NIP</label>
                      <div className="sipa-input-wrap">
                        <span className="sipa-input-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                          </svg>
                        </span>
                        <input
                          id="reg-nim"
                          type="text"
                          placeholder="ID Sistem"
                          value={regNim}
                          onChange={(e) => setRegNim(e.target.value)}
                          className="sipa-input"
                          required
                        />
                      </div>
                    </div>
                    <div className="sipa-field">
                      <label className="sipa-label" htmlFor="reg-wa">WHATSAPP</label>
                      <div className="sipa-input-wrap">
                        <span className="sipa-input-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                            <line x1="12" y1="18" x2="12.01" y2="18" />
                          </svg>
                        </span>
                        <input
                          id="reg-wa"
                          type="tel"
                          placeholder="+62"
                          value={regWa}
                          onChange={(e) => setRegWa(e.target.value)}
                          className="sipa-input"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Role Selector */}
                  <div className="sipa-field">
                    <label className="sipa-label">HAK AKSES PROFIL</label>
                    <div className="sipa-role-group">
                      {(['MAHASISWA', 'TENDIK', 'KAPRODI'] as Role[]).map((role) => (
                        <button
                          key={role}
                          type="button"
                          className={`sipa-role-btn${regRole === role ? ' sipa-role-btn-active' : ''}`}
                          onClick={() => setRegRole(role)}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Kata Sandi */}
                  <div className="sipa-field">
                    <label className="sipa-label" htmlFor="reg-password">KATA SANDI</label>
                    <div className="sipa-input-wrap">
                      <span className="sipa-input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </span>
                      <input
                        id="reg-password"
                        type={showRegPassword ? 'text' : 'password'}
                        placeholder="Buat kata sandi"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="sipa-input"
                        required
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="sipa-eye-btn"
                        onClick={() => setShowRegPassword((v) => !v)}
                        aria-label={showRegPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                      >
                        {showRegPassword ? (
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

                    {/* Password Strength */}
                    {regPassword && (
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

                  {/* Submit */}
                  <button type="submit" className="sipa-submit sipa-submit-register" disabled={regLoading}>
                    {regLoading ? (
                      <span className="sipa-spinner" />
                    ) : (
                      <>
                        DAFTAR SEKARANG
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </>
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