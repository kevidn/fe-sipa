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
        <h1 className="text-4xl font-black text-blue-600 dark:text-blue-500 tracking-tight">Dashboard Administrator</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Kelola sistem SIPA UNESA secara menyeluruh</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Pengguna */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 flex flex-col justify-between transition-all">
          <div className="flex items-center gap-6 mb-4">
            <div className="w-16 h-16 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <p className="text-5xl font-black text-slate-800 dark:text-slate-100">{stats?.total_pengguna || "0"}</p>
          </div>
          <div>
            <p className="font-bold text-slate-500 dark:text-slate-400 text-sm">Total Pengguna</p>
            <p className="text-blue-500 text-xs font-bold mt-1">+12 bulan ini</p>
          </div>
        </div>

        {/* Card 2: Total Pengajuan */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 flex flex-col justify-between transition-all">
          <div className="flex items-center gap-6 mb-4">
            <div className="w-16 h-16 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </div>
            <p className="text-5xl font-black text-slate-800 dark:text-slate-100">{stats?.total_pengajuan || "0"}</p>
          </div>
          <div>
            <p className="font-bold text-slate-500 dark:text-slate-400 text-sm">Total Pengajuan</p>
            <p className="text-blue-500 text-xs font-bold mt-1">+234 bulan ini</p>
          </div>
        </div>

        {/* Card 3: Jenis Surat Aktif */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 flex flex-col justify-between transition-all">
          <div className="flex items-center gap-6 mb-4">
            <div className="w-16 h-16 bg-[#a855f7] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </div>
            <p className="text-5xl font-black text-slate-800 dark:text-slate-100">{stats?.surat_aktif || "0"}</p>
          </div>
          <div>
            <p className="font-bold text-slate-500 dark:text-slate-400 text-sm">Jenis Surat Aktif</p>
            <p className="text-blue-500 text-xs font-bold mt-1">Semua aktif</p>
          </div>
        </div>

        {/* Card 4: Uptime Sistem */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 flex flex-col justify-between transition-all">
          <div className="flex items-center gap-6 mb-4">
            <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <p className="text-5xl font-black text-slate-800 dark:text-slate-100">99.8%</p>
          </div>
          <div>
            <p className="font-bold text-slate-500 dark:text-slate-400 text-sm">Uptime Sistem</p>
            <p className="text-blue-500 text-xs font-bold mt-1">30 hari terakhir</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* System Health */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3 mb-8">
            <svg className="text-blue-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            System Health
          </h2>
          <div className="space-y-4">
            {[
              { name: "Database", icon: "M21 5c0 1.1-4 2-9 2s-9-.9-9-2 4-2 9-2 9 .9 9 2zm0 0v14c0 1.1-4 2-9 2s-9-.9-9-2V5m18 7c0 1.1-4 2-9 2s-9-.9-9-2" },
              { name: "Email Service", icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2l8 5 8-5" },
              { name: "Authentication", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
              { name: "File Storage", icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-bold">
                  <svg className="text-emerald-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon}/></svg>
                  {item.name}
                </div>
                <span className="text-sm font-bold text-blue-500">Healthy</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 flex flex-col">
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3 mb-8">
            <svg className="text-purple-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            <button onClick={() => setIsSuratModalOpen(true)} className="flex items-center gap-4 bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-left h-full">
              <svg className="w-8 h-8 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              <span className="font-bold text-lg">Manajemen Jenis Surat</span>
            </button>
            <button className="flex items-center gap-4 bg-[#a855f7] hover:bg-[#9333ea] text-white p-6 rounded-2xl transition-all shadow-lg shadow-purple-500/20 active:scale-95 text-left h-full">
              <svg className="w-8 h-8 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              <span className="font-bold text-lg">Pengaturan Sistem</span>
            </button>
            <button className="flex items-center gap-4 bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 text-left h-full">
              <svg className="w-8 h-8 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              <span className="font-bold text-lg">Log Aktivitas</span>
            </button>
            <button className="flex items-center gap-4 bg-[#eab308] hover:bg-[#ca8a04] text-white p-6 rounded-2xl transition-all shadow-lg shadow-yellow-500/20 active:scale-95 text-left h-full">
              <svg className="w-8 h-8 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="8" y2="16"/><line x1="16" y1="4" x2="16" y2="16"/></svg>
              <span className="font-bold text-lg">Laporan Lengkap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Aktivitas Terbaru */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 transition-all">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">Aktivitas Terbaru</h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Log aktivitas sistem dalam 1 jam terakhir</p>
          </div>
          <button className="text-[#a855f7] dark:text-[#c084fc] text-sm font-bold hover:underline">
            Lihat Semua &rarr;
          </button>
        </div>
        
        <div className="space-y-4">
          {stats?.recent_activities?.length > 0 ? (
            stats.recent_activities.map((activity: any) => {
              // Dynamic Icon Logic
              let Icon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
              let colorClass = "bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400";
              
              const aksiLower = activity.aksi.toLowerCase();
              if (aksiLower.includes('login') || aksiLower.includes('melihat')) {
                Icon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
                colorClass = "bg-blue-50 text-blue-500 dark:bg-blue-500/10";
              } else if (aksiLower.includes('update') || aksiLower.includes('libur')) {
                Icon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
                colorClass = "bg-orange-50 text-orange-500 dark:bg-orange-500/10";
              } else if (aksiLower.includes('surat') || aksiLower.includes('pengajuan')) {
                Icon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
                colorClass = "bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10";
              }

              return (
              <div key={activity.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
                  {Icon}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                    {activity.user?.nama_lengkap || 'Admin System'}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-0.5">{activity.aksi} {activity.keterangan}</p>
                  <p className="text-slate-400 text-[10px] font-bold mt-1">
                    {new Date(activity.created_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              Belum ada aktivitas dalam 1 jam terakhir
            </div>
          )}
        </div>
      </div>

      {/* Mode Administrator Banner */}
      <div className="bg-[#f3e8ff] dark:bg-purple-500/10 border border-[#e9d5ff] dark:border-purple-500/30 rounded-2xl p-6 flex items-start gap-4 shadow-sm mt-4">
        <div className="text-purple-600 dark:text-purple-400 mt-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div>
          <h4 className="text-purple-800 dark:text-purple-300 font-bold mb-1">Mode Administrator</h4>
          <p className="text-purple-700/80 dark:text-purple-400/80 text-sm font-medium">Anda memiliki akses penuh ke semua konfigurasi sistem. Gunakan dengan bijak untuk menjaga integritas data.</p>
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
