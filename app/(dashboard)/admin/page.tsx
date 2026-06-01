"use client";

import { useState, useEffect } from 'react';
import CustomSelect from '@/components/CustomSelect';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

export default function DashboardAdmin() {
  const [isSuratModalOpen, setIsSuratModalOpen] = useState(false);
  const [isLiburModalOpen, setIsLiburModalOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [suratForm, setSuratForm] = useState({ nama: '', sla: '1', persyaratan: '', status: 'Aktif' });
  const [liburForm, setLiburForm] = useState({ tanggal: '', nama_libur: '' });

  useBodyScrollLock(isSuratModalOpen || isLiburModalOpen);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('sipa_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSurat = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('sipa_token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jenis-surat`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          nama: suratForm.nama,
          sla: `${suratForm.sla} Hari Kerja`,
          persyaratan: suratForm.persyaratan,
          status: suratForm.status
        })
      });
      setIsSuratModalOpen(false);
      setSuratForm({ nama: '', sla: '1', persyaratan: '', status: 'Aktif' });
      fetchData();
    } catch (err) {
      console.error("Failed to add jenis surat:", err);
    }
  };

  const handleAddLibur = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('sipa_token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hari-libur`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          tanggal: new Date(liburForm.tanggal).toISOString(),
          nama_libur: liburForm.nama_libur
        })
      });
      setIsLiburModalOpen(false);
      setLiburForm({ tanggal: '', nama_libur: '' });
      fetchData();
    } catch (err) {
      console.error("Failed to add hari libur:", err);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-8 pb-10 relative">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Dashboard Admin</h1>
        <p className="text-slate-400 font-medium">Selamat datang di panel administrasi SIPA UNESA</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 flex flex-col transition-all cursor-default">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center shadow-sm">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </div>
            <span className="text-emerald-500 text-xs font-black tracking-widest uppercase mt-2">Aktif</span>
          </div>
          <div>
            <p className="font-bold text-slate-500 dark:text-slate-400 text-sm">Total Jenis Surat</p>
            <p className="text-4xl font-black text-slate-800 dark:text-slate-100 my-1">{stats?.total_jenis_surat || 0}</p>
            <p className="text-emerald-500 text-xs font-bold tracking-wide">{stats?.surat_aktif || 0} surat aktif</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 flex flex-col transition-all cursor-default">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center shadow-sm">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <span className="text-blue-500 text-xs font-black tracking-widest uppercase mt-2">2026</span>
          </div>
          <div>
            <p className="font-bold text-slate-500 dark:text-slate-400 text-sm">Hari Libur</p>
            <p className="text-4xl font-black text-slate-800 dark:text-slate-100 my-1">{stats?.total_hari_libur || 0}</p>
            <p className="text-blue-500 text-xs font-bold tracking-wide">Terkonfigurasi</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 flex flex-col transition-all cursor-default">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center shadow-sm">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <span className="text-amber-500 text-xs font-black tracking-widest uppercase mt-2">Rata-rata</span>
          </div>
          <div>
            <p className="font-bold text-slate-500 dark:text-slate-400 text-sm">SLA Rata-rata</p>
            <p className="text-4xl font-black text-slate-800 dark:text-slate-100 my-1">{stats?.avg_sla || "0.0"}</p>
            <p className="text-amber-500 text-xs font-bold tracking-wide">Hari kerja</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 flex flex-col transition-all cursor-default">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center shadow-sm">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <span className="text-purple-500 text-xs font-black tracking-widest uppercase mt-2">Aktif</span>
          </div>
          <div>
            <p className="font-bold text-slate-500 dark:text-slate-400 text-sm">Total Pengguna</p>
            <p className="text-4xl font-black text-slate-800 dark:text-slate-100 my-1">{stats?.total_pengguna || 0}</p>
            <p className="text-purple-500 text-xs font-bold tracking-wide">{stats?.total_role || 0} role berbeda</p>
          </div>
        </div>
      </div>

      {/* Aksi Cepat */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 transition-all">
        <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 mb-6">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button 
            onClick={() => setIsSuratModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#00a651] hover:bg-[#008c44] text-white py-3 px-4 rounded-xl font-bold transition-colors text-sm shadow-lg shadow-emerald-500/30"
          >
            <span>+</span> Tambah Jenis Surat
          </button>
          
          <button 
            onClick={() => setIsLiburModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 py-3 px-4 rounded-xl font-bold transition-all text-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Tambah Hari Libur
          </button>

          <button className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 py-3 px-4 rounded-xl font-bold transition-all text-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Kelola Pengguna
          </button>

          <button className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 py-3 px-4 rounded-xl font-bold transition-all text-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            Pengaturan
          </button>
        </div>
      </div>

      {/* Aktivitas Terbaru */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 transition-all">
        <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 mb-6">Aktivitas Terbaru</h2>
        
        <div className="space-y-6">
          {stats?.recent_activities?.length > 0 ? (
            stats.recent_activities.map((activity: any) => {
              // Dynamic Icon Logic
              let Icon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
              let colorClass = "bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400";
              
              const aksiLower = activity.aksi.toLowerCase();
              if (aksiLower.includes('login')) {
                Icon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>;
                colorClass = "bg-blue-50 text-blue-500 dark:bg-blue-500/10";
              } else if (aksiLower.includes('libur')) {
                Icon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
                colorClass = "bg-orange-50 text-orange-500 dark:bg-orange-500/10";
              } else if (aksiLower.includes('surat') || aksiLower.includes('pengajuan')) {
                Icon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
                colorClass = "bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10";
              } else if (aksiLower.includes('pengguna') || aksiLower.includes('user')) {
                Icon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
                colorClass = "bg-purple-50 text-purple-500 dark:bg-purple-500/10";
              }

              return (
              <div key={activity.id} className="flex items-start justify-between pb-6 border-b border-slate-100 dark:border-slate-800/80 last:border-0 last:pb-0">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mt-1 ${colorClass}`}>
                    {Icon}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-100">{activity.aksi}</p>
                    <p className="text-slate-400 text-sm font-medium mt-0.5">{activity.keterangan}</p>
                  </div>
                </div>
                <span className="text-slate-400 text-xs font-bold tracking-wider">
                  {new Date(activity.created_at).toLocaleDateString('id-ID')}
                </span>
              </div>
              );
            })
          ) : (
            <p className="text-slate-400 text-sm">Belum ada aktivitas.</p>
          )}
        </div>
      </div>

      {/* Modal Tambah Jenis Surat */}
      {isSuratModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg p-8 shadow-2xl relative border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsSuratModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Tambah Jenis Surat Baru</h2>
            <p className="text-slate-400 text-sm font-medium mt-1 mb-6">Buat jenis surat baru dengan konfigurasi SLA</p>

            <form className="space-y-5" onSubmit={handleAddSurat}>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nama Jenis Surat</label>
                <input 
                  type="text" 
                  value={suratForm.nama}
                  onChange={(e) => setSuratForm({...suratForm, nama: e.target.value})}
                  required
                  placeholder="Contoh: Surat Keterangan Aktif Kuliah" 
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-100 font-medium placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">SLA (Hari Kerja)</label>
                <CustomSelect 
                  value={suratForm.sla}
                  onChange={(val) => setSuratForm({...suratForm, sla: val})}
                  options={[
                    { value: '1', label: '1 Hari Kerja' },
                    { value: '2', label: '2 Hari Kerja' },
                    { value: '3', label: '3 Hari Kerja' },
                    { value: '5', label: '5 Hari Kerja' }
                  ]}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Persyaratan Dokumen</label>
                <input 
                  type="text" 
                  value={suratForm.persyaratan}
                  onChange={(e) => setSuratForm({...suratForm, persyaratan: e.target.value})}
                  placeholder="Pisahkan dengan koma" 
                  className="w-full px-4 py-3 rounded-xl border-none bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
                <p className="text-xs text-slate-400 font-medium mt-1">Contoh: KTM Aktif, Bukti Pembayaran UKT, Surat Pernyataan</p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <div 
                  onClick={() => setSuratForm({...suratForm, status: suratForm.status === 'Aktif' ? 'Non-Aktif' : 'Aktif'})}
                  className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${suratForm.status === 'Aktif' ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${suratForm.status === 'Aktif' ? 'right-1' : 'left-1'}`}></div>
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Aktifkan jenis surat ini</span>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setIsSuratModalOpen(false)}
                  className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 rounded-xl font-bold bg-[#00a651] hover:bg-[#008c44] text-white shadow-lg shadow-emerald-500/30 transition-all"
                >
                  + Tambah Jenis Surat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Hari Libur */}
      {isLiburModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-8 shadow-2xl relative border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsLiburModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Tambah Hari Libur Nasional</h2>
            <p className="text-slate-400 text-sm font-medium mt-1 mb-6">Tambahkan hari libur untuk perhitungan SLA</p>

            <form className="space-y-5" onSubmit={handleAddLibur}>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tanggal</label>
                <input 
                  type="date" 
                  value={liburForm.tanggal}
                  onChange={(e) => setLiburForm({...liburForm, tanggal: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nama Hari Libur</label>
                <input 
                  type="text" 
                  value={liburForm.nama_libur}
                  onChange={(e) => setLiburForm({...liburForm, nama_libur: e.target.value})}
                  required
                  placeholder="Contoh: Hari Raya Idul Fitri" 
                  className="w-full px-4 py-3 rounded-xl border-none bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setIsLiburModalOpen(false)}
                  className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 rounded-xl font-bold bg-[#00a651] hover:bg-[#008c44] text-white shadow-lg shadow-emerald-500/30 transition-all"
                >
                  + Tambah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
