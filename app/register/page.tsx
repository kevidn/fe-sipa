"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    nim: '',
    email: '',
    role: 'MAHASISWA' as 'MAHASISWA' | 'TENDIK' | 'KAPRODI',
    program_studi: '',
    password: '',
    konfirmasi_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.konfirmasi_password) {
      setError("Konfirmasi password tidak cocok");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama_lengkap: formData.nama_lengkap,
          username: formData.nim,
          email: formData.email,
          role: formData.role,
          password: formData.password
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Pendaftaran gagal');

      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
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
        <div className="max-w-md mx-auto w-full space-y-8">
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
            <h2 className="text-4xl font-black text-slate-800 tracking-tight">Daftar Akun Baru</h2>
            <p className="text-slate-400 font-medium text-lg">Lengkapi data diri untuk membuat akun</p>
          </div>

          {/* Role Selection */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Daftar Sebagai</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'MAHASISWA', name: 'Mahasiswa', icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                )},
                { id: 'TENDIK', name: 'Tendik', icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                )},
                { id: 'KAPRODI', name: 'Kaprodi', icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                )}
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setFormData({...formData, role: r.id as any})}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300 group
                    ${formData.role === r.id 
                      ? 'border-sipa-green bg-sipa-green/5 text-sipa-green shadow-lg shadow-sipa-green/10' 
                      : 'border-slate-100 hover:border-sipa-green/30 text-slate-400 hover:text-slate-600'
                    }`}
                >
                  <div className={`mb-1 transition-transform duration-300 ${formData.role === r.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {r.icon}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest">{r.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 text-red-500 rounded-2xl border border-red-100 text-sm font-bold animate-in shake-1">
                {error}
              </div>
            )}
            {success && (
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 text-sm font-bold">
                Pendaftaran berhasil! Mengalihkan ke login...
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Nama Lengkap</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sipa-green transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Masukkan nama lengkap" 
                    className="w-full pl-14 pr-6 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-sipa-green/20 outline-none transition-all font-medium text-slate-600"
                    value={formData.nama_lengkap}
                    onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{formData.role === 'MAHASISWA' ? 'NIM' : 'NIP / ID'}</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sipa-green transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 10h8M8 14h4"/></svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder={`Masukkan ${formData.role === 'MAHASISWA' ? 'NIM' : 'NIP'}`} 
                    className="w-full pl-14 pr-6 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-sipa-green/20 outline-none transition-all font-medium text-slate-600"
                    value={formData.nim}
                    onChange={(e) => setFormData({...formData, nim: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Email {formData.role === 'MAHASISWA' ? 'Mahasiswa' : 'Staff'}</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sipa-green transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <input 
                    type="email" 
                    placeholder="contoh@unesa.ac.id" 
                    className="w-full pl-14 pr-6 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-sipa-green/20 outline-none transition-all font-medium text-slate-600"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              {formData.role === 'MAHASISWA' && (
                <div className="space-y-1 animate-in fade-in duration-500">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Program Studi</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sipa-green transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                    </div>
                    <select 
                      className="w-full pl-14 pr-6 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-sipa-green/20 outline-none transition-all font-medium text-slate-600 appearance-none"
                      value={formData.program_studi}
                      onChange={(e) => setFormData({...formData, program_studi: e.target.value})}
                      required
                    >
                      <option value="">Pilih Program Studi</option>
                      <option>S1 Pendidikan Teknologi Informasi</option>
                      <option>S1 Teknik Informatika</option>
                      <option>S1 Sistem Informasi</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Password</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sipa-green transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </div>
                    <input 
                      type="password" 
                      placeholder="Minimal 8 karakter" 
                      className="w-full pl-14 pr-6 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-sipa-green/20 outline-none transition-all font-medium text-slate-600 text-sm"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Konfirmasi Password</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sipa-green transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <input 
                      type="password" 
                      placeholder="Ulangi password" 
                      className="w-full pl-14 pr-6 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-sipa-green/20 outline-none transition-all font-medium text-slate-600 text-sm"
                      value={formData.konfirmasi_password}
                      onChange={(e) => setFormData({...formData, konfirmasi_password: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer group px-2">
              <input type="checkbox" className="mt-1 w-5 h-5 rounded-lg border-2 border-slate-200 text-sipa-green focus:ring-sipa-green/20 transition-all cursor-pointer" required />
              <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-800 transition-colors leading-relaxed">
                Saya setuju dengan <Link href="#" className="text-sipa-green hover:underline">Syarat dan Ketentuan</Link> serta <Link href="#" className="text-sipa-green hover:underline">Kebijakan Privasi</Link>
              </span>
            </label>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-sipa-green text-white font-black rounded-2xl shadow-xl shadow-sipa-green/20 hover:bg-emerald-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Daftar Sekarang 
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm font-bold text-slate-400">
            Sudah punya akun? <Link href="/login" className="text-sipa-green hover:underline">Masuk di sini</Link>
          </p>
        </div>
      </div>

      {/* Right Column - Info */}
      <div className="hidden lg:flex lg:w-2/5 bg-sipa-green p-24 flex-col justify-center relative overflow-hidden animate-in fade-in slide-in-from-right-10 duration-700">
        <div className="absolute inset-0 opacity-10">
           <div className="absolute top-[-10%] left-[-10%] w-96 h-96 border-4 border-white rounded-full"></div>
           <div className="absolute bottom-[-5%] right-[-5%] w-64 h-64 bg-white rounded-3xl rotate-45"></div>
        </div>

        <div className="relative space-y-12">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-white">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
          </div>

          <div className="space-y-6">
            <h3 className="text-5xl font-black text-white leading-tight">
              Bergabung dengan SIPA UNESA
            </h3>
            <p className="text-white/80 font-medium text-lg max-w-md">
              Akses mudah untuk mengajukan berbagai surat akademik dengan sistem yang transparan dan cepat
            </p>
          </div>

          <div className="space-y-6">
            {[
              { title: 'Registrasi Mudah & Cepat', sub: 'Hanya butuh beberapa menit untuk membuat akun' },
              { title: 'Akses Instant', sub: 'Langsung gunakan layanan setelah verifikasi' },
              { title: 'Data Aman Terlindungi', sub: 'Privasi dan keamanan data terjamin' }
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

          {/* Social Proof Card */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/20 flex items-center gap-6 animate-in zoom-in duration-1000">
             <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-sipa-green bg-slate-200 overflow-hidden"></div>
                <div className="w-10 h-10 rounded-full border-2 border-sipa-green bg-slate-300 overflow-hidden"></div>
                <div className="w-10 h-10 rounded-full border-2 border-sipa-green bg-slate-400 overflow-hidden"></div>
             </div>
             <div>
               <p className="text-white font-black text-sm">2,500+ Mahasiswa</p>
               <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">telah terdaftar</p>
             </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-24">
          <p className="text-white/30 text-[10px] font-black tracking-[0.2em] uppercase">© 2024 UNIVERSITAS NEGERI SURABAYA</p>
        </div>
      </div>
    </div>
  );
}
