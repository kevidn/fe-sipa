"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Settings {
  email_notification: boolean;
  push_notification: boolean;
  sla_performance_hrs: number;
  backup_otomatis: boolean;
  backup_interval: string;
  max_file_upload_mb: number;
  session_timeout_min: number;
  smtp_server: string;
  smtp_port: number;
}

export default function PengaturanSistem() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sipa_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data.data);
      }
    } catch (err) {
      console.error('Gagal mengambil pengaturan:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const token = localStorage.getItem('sipa_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        alert('Pengaturan berhasil disimpan!');
      }
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center font-bold">Memuat Pengaturan...</div>;
  if (!settings) return <div className="p-10 text-center font-bold">Gagal memuat data</div>;

  return (
    <div className="max-w-4xl space-y-8 pb-10">
      {/* Header */}
      <div className="space-y-1">
        <Link href="/dashboard/tendik" className="text-emerald-600 font-bold text-xs flex items-center gap-1 mb-2">
           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
           Kembali ke Dashboard
        </Link>
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200 dark:shadow-emerald-900">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
           </div>
           <div>
              <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none">Pengaturan Sistem</h1>
              <p className="text-slate-400 font-medium mt-1">Konfigurasi sistem SIPA UNESA</p>
           </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Notifikasi */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors">
           <div className="bg-blue-50/50 dark:bg-blue-500/10 px-8 py-4 flex items-center gap-3 border-b border-slate-50 dark:border-slate-800/50">
              <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              </div>
              <div>
                 <h2 className="text-sm font-black text-slate-800 dark:text-slate-100">Notifikasi</h2>
                 <p className="text-[10px] font-bold text-slate-400">Pengaturan notifikasi sistem</p>
              </div>
           </div>
           <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                 <div>
                    <p className="text-sm font-black text-slate-700 dark:text-slate-200">Notifikasi Email</p>
                    <p className="text-xs font-medium text-slate-400">Kirim notifikasi via email</p>
                 </div>
                 <button 
                    onClick={() => setSettings({...settings, email_notification: !settings.email_notification})}
                    className={`w-12 h-6 rounded-full transition-all relative ${settings.email_notification ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                 >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.email_notification ? 'right-1' : 'left-1'}`}></div>
                 </button>
              </div>
              <div className="flex items-center justify-between">
                 <div>
                    <p className="text-sm font-black text-slate-700 dark:text-slate-200">Notifikasi Push</p>
                    <p className="text-xs font-medium text-slate-400">Kirim notifikasi browser push</p>
                 </div>
                 <button 
                    onClick={() => setSettings({...settings, push_notification: !settings.push_notification})}
                    className={`w-12 h-6 rounded-full transition-all relative ${settings.push_notification ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                 >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.push_notification ? 'right-1' : 'left-1'}`}></div>
                 </button>
              </div>
           </div>
        </div>

        {/* SLA */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors">
           <div className="bg-amber-50/50 dark:bg-amber-500/10 px-8 py-4 flex items-center gap-3 border-b border-slate-50 dark:border-slate-800/50">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div>
                 <h2 className="text-sm font-black text-slate-800 dark:text-slate-100">SLA (Service Level Agreement)</h2>
                 <p className="text-[10px] font-bold text-slate-400">Pengaturan batas waktu pemrosesan</p>
              </div>
           </div>
           <div className="p-8 space-y-8">
              <div className="space-y-4">
                 <div className="flex justify-between">
                    <div>
                       <p className="text-sm font-black text-slate-700 dark:text-slate-200">Peringatan SLA (jam sebelum batas)</p>
                       <p className="text-xs font-medium text-slate-400">Sistem akan memberi peringatan sebelum SLA terlampaui</p>
                    </div>
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-500">{settings.sla_performance_hrs}</span>
                 </div>
                 <input 
                    type="range" min="1" max="48" 
                    className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    value={settings.sla_performance_hrs}
                    onChange={(e) => setSettings({...settings, sla_performance_hrs: parseInt(e.target.value)})}
                 />
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Peringatan akan dikirim {settings.sla_performance_hrs} jam sebelum batas waktu SLA</p>
              </div>
           </div>
        </div>

        {/* Backup Database */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors">
           <div className="bg-purple-50/50 dark:bg-purple-500/10 px-8 py-4 flex items-center gap-3 border-b border-slate-50 dark:border-slate-800/50">
              <div className="w-8 h-8 rounded-lg bg-purple-500 text-white flex items-center justify-center">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </div>
              <div>
                 <h2 className="text-sm font-black text-slate-800 dark:text-slate-100">Backup Database</h2>
                 <p className="text-[10px] font-bold text-slate-400">Pengaturan backup otomatis</p>
              </div>
           </div>
           <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                 <div>
                    <p className="text-sm font-black text-slate-700 dark:text-slate-200">Backup Otomatis</p>
                    <p className="text-xs font-medium text-slate-400">Aktifkan backup database otomatis</p>
                 </div>
                 <button 
                    onClick={() => setSettings({...settings, backup_otomatis: !settings.backup_otomatis})}
                    className={`w-12 h-6 rounded-full transition-all relative ${settings.backup_otomatis ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                 >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.backup_otomatis ? 'right-1' : 'left-1'}`}></div>
                 </button>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Interval Backup</label>
                 <select 
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-slate-700 dark:text-slate-200 text-xs"
                    value={settings.backup_interval}
                    onChange={(e) => setSettings({...settings, backup_interval: e.target.value})}
                 >
                    <option>Harian (setiap hari pukul 00:00)</option>
                    <option>Mingguan (setiap hari Minggu)</option>
                 </select>
              </div>
           </div>
        </div>

        {/* Keamanan Sistem */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors">
           <div className="bg-emerald-50/50 dark:bg-emerald-500/10 px-8 py-4 flex items-center gap-3 border-b border-slate-50 dark:border-slate-800/50">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div>
                 <h2 className="text-sm font-black text-slate-800 dark:text-slate-100">Keamanan Sistem</h2>
                 <p className="text-[10px] font-bold text-slate-400">Pengaturan keamanan dan upload file</p>
              </div>
           </div>
           <div className="p-8 space-y-8">
              <div className="space-y-4">
                 <div className="flex justify-between">
                    <div>
                       <p className="text-sm font-black text-slate-700 dark:text-slate-200">Maksimal Ukuran File Upload (MB)</p>
                       <p className="text-xs font-medium text-slate-400">File lebih dari 5 MB tidak dapat diupload</p>
                    </div>
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-500">{settings.max_file_upload_mb}</span>
                 </div>
                 <input 
                    type="range" min="1" max="25" 
                    className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    value={settings.max_file_upload_mb}
                    onChange={(e) => setSettings({...settings, max_file_upload_mb: parseInt(e.target.value)})}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Session Timeout (menit)</label>
                 <input 
                    type="number" 
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-slate-700 dark:text-slate-200 text-xs"
                    value={settings.session_timeout_min}
                    onChange={(e) => setSettings({...settings, session_timeout_min: parseInt(e.target.value)})}
                 />
                 <p className="text-[10px] font-bold text-slate-400">User akan otomatis logout setelah {settings.session_timeout_min} menit tidak aktif</p>
              </div>
           </div>
        </div>

        {/* Server Email */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors">
           <div className="bg-red-50/50 dark:bg-red-500/10 px-8 py-4 flex items-center gap-3 border-b border-slate-50 dark:border-slate-800/50">
              <div className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div>
                 <h2 className="text-sm font-black text-slate-800 dark:text-slate-100">Server Email</h2>
                 <p className="text-[10px] font-bold text-slate-400">Konfigurasi SMTP server</p>
              </div>
           </div>
           <div className="p-8 space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SMTP Server</label>
                 <input 
                    type="text" 
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-slate-700 dark:text-slate-200 text-xs"
                    value={settings.smtp_server}
                    onChange={(e) => setSettings({...settings, smtp_server: e.target.value})}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Port SMTP</label>
                 <input 
                    type="number" 
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-slate-700 dark:text-slate-200 text-xs"
                    value={settings.smtp_port}
                    onChange={(e) => setSettings({...settings, smtp_port: parseInt(e.target.value)})}
                 />
              </div>
           </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 transition-colors">
           <button onClick={fetchData} className="px-8 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
              Reset ke Default
           </button>
           <button 
              onClick={handleSave}
              disabled={saving}
              className="px-10 py-3 rounded-xl bg-emerald-600 text-white font-black text-sm shadow-xl shadow-emerald-200 dark:shadow-emerald-900 hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50"
           >
              {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              Simpan Pengaturan
           </button>
        </div>
      </div>
    </div>
  );
}
