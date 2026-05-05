"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: nim, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login gagal');

      localStorage.setItem('sipa_token', data.token);
      localStorage.setItem('sipa_user', JSON.stringify(data.data));

      const userRole = data.data.role.toLowerCase();
      if (userRole === 'mahasiswa') {
        window.location.href = '/dashboard/mahasiswa';
      } else if (userRole === 'tendik') {
        window.location.href = '/dashboard/tendik';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-poppins">
      {/* Left Column - Form */}
      <div className="w-full lg:w-3/5 p-8 lg:p-24 flex flex-col justify-center animate-in fade-in slide-in-from-left-10 duration-700">
        <div className="max-w-md mx-auto w-full space-y-10">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-sipa-green rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-sipa-green/20">
              SU
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none uppercase">SIPA UNESA</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Sistem Pelayanan Akademik</p>
            </div>
          </div>

          {/* Titles */}
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-slate-800 tracking-tight">Selamat Datang</h2>
            <p className="text-slate-400 font-medium text-lg">Silakan login untuk mengakses sistem</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-500 rounded-2xl border border-red-100 text-sm font-bold animate-in shake-1">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Email atau NIM</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sipa-green transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Masukkan email atau NIM" 
                    value={nim}
                    onChange={(e) => setNim(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-sipa-green/20 outline-none transition-all font-medium text-slate-600"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Password</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sipa-green transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <input 
                    type="password" 
                    placeholder="Masukkan password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-sipa-green/20 outline-none transition-all font-medium text-slate-600"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded-lg border-2 border-slate-200 text-sipa-green focus:ring-sipa-green/20 transition-all cursor-pointer" />
                <span className="text-sm font-bold text-slate-500 group-hover:text-slate-800 transition-colors">Ingat saya</span>
              </label>
              <Link href="/forgot-password" title="Lupa password" className="text-sm font-bold text-sipa-green hover:underline">Lupa password?</Link>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-sipa-green text-white font-black rounded-2xl shadow-xl shadow-sipa-green/20 hover:bg-emerald-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Masuk 
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm font-bold text-slate-400">
            Belum punya akun? <Link href="/register" className="text-sipa-green hover:underline">Daftar di sini</Link>
          </p>
        </div>
      </div>

      {/* Right Column - Info */}
      <div className="hidden lg:flex lg:w-2/5 bg-sipa-green p-24 flex-col justify-center relative overflow-hidden animate-in fade-in slide-in-from-right-10 duration-700">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-10">
           <div className="absolute top-[-10%] right-[-10%] w-96 h-96 border-4 border-white rounded-full"></div>
           <div className="absolute bottom-[-5%] left-[-5%] w-64 h-64 bg-white rounded-3xl rotate-45"></div>
        </div>

        <div className="relative space-y-12">
          <div className="space-y-6">
            <h3 className="text-5xl font-black text-white leading-tight">
              Sistem Pelayanan Akademik Berbasis Workflow & SLA
            </h3>
            <p className="text-white/80 font-medium text-lg max-w-md">
              Digitalisasi proses pengajuan surat akademik yang efisien, transparan, dan terukur
            </p>
          </div>

          <div className="space-y-6">
            {[
              { title: 'Portal Pengajuan Online', sub: 'Ajukan surat akademik kapan saja, di mana saja' },
              { title: 'Tracking Real-time', sub: 'Pantau status pengajuan surat secara langsung' },
              { title: 'SLA Monitoring', sub: 'Proses terjamin dengan batas waktu yang jelas' }
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${i * 200}ms` }}>
                <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-white shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <h4 className="font-black text-white">{feature.title}</h4>
                  <p className="text-white/60 text-sm font-medium">{feature.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Right */}
        <div className="absolute bottom-12 left-24">
          <p className="text-white/30 text-[10px] font-black tracking-[0.2em] uppercase">© 2024 UNIVERSITAS NEGERI SURABAYA</p>
        </div>
      </div>
    </div>
  );
}