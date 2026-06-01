"use client";

import { useState, useEffect } from 'react';

interface SystemSettings {
  smtp_server: string;
  smtp_port: number;
  max_login_attempts: number;
  session_timeout_min: number;
}

export default function PengaturanSistem() {
  const [settings, setSettings] = useState<SystemSettings>({
    smtp_server: '',
    smtp_port: 587,
    max_login_attempts: 5,
    session_timeout_min: 30
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('sipa_token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          setSettings({
            smtp_server: json.data.smtp_server || '',
            smtp_port: json.data.smtp_port || 587,
            max_login_attempts: json.data.max_login_attempts || 5,
            session_timeout_min: json.data.session_timeout_min || 30
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
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
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-8 font-poppins pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Pengaturan Sistem</h1>
        <p className="text-slate-400 font-medium text-sm mt-1">Konfigurasi umum sistem SIPA</p>
      </div>

      <div className="max-w-5xl space-y-6">
        {/* Notifikasi Email */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 p-8">
          <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-8">Notifikasi Email</h2>
          
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-slate-50 dark:border-slate-800/50">
              <div className="flex-1">
                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">SMTP Server</p>
                <p className="text-slate-400 text-xs font-medium mt-1">Konfigurasi server email</p>
              </div>
              <div className="w-full md:w-1/2">
                <input 
                  type="text" 
                  value={settings.smtp_server}
                  onChange={(e) => setSettings({...settings, smtp_server: e.target.value})}
                  className="w-full px-4 py-3 bg-transparent border-2 border-slate-200 dark:border-slate-700 rounded-xl font-medium text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
              <div className="flex-1">
                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">SMTP Port</p>
                <p className="text-slate-400 text-xs font-medium mt-1">Port server email</p>
              </div>
              <div className="w-full md:w-1/2">
                <input 
                  type="number" 
                  value={settings.smtp_port}
                  onChange={(e) => setSettings({...settings, smtp_port: parseInt(e.target.value) || 587})}
                  className="w-full px-4 py-3 bg-transparent border-2 border-slate-200 dark:border-slate-700 rounded-xl font-medium text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Keamanan */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 p-8">
          <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-8">Keamanan</h2>
          
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-slate-50 dark:border-slate-800/50">
              <div className="flex-1">
                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">Batas Percobaan Login</p>
                <p className="text-slate-400 text-xs font-medium mt-1">Maksimal percobaan login gagal</p>
              </div>
              <div className="w-full md:w-1/2">
                <input 
                  type="number" 
                  value={settings.max_login_attempts}
                  onChange={(e) => setSettings({...settings, max_login_attempts: parseInt(e.target.value) || 5})}
                  className="w-full px-4 py-3 bg-transparent border-2 border-slate-200 dark:border-slate-700 rounded-xl font-medium text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
              <div className="flex-1">
                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">Durasi Sesi (menit)</p>
                <p className="text-slate-400 text-xs font-medium mt-1">Timeout otomatis untuk inaktivitas</p>
              </div>
              <div className="w-full md:w-1/2">
                <input 
                  type="number" 
                  value={settings.session_timeout_min}
                  onChange={(e) => setSettings({...settings, session_timeout_min: parseInt(e.target.value) || 30})}
                  className="w-full px-4 py-3 bg-transparent border-2 border-slate-200 dark:border-slate-700 rounded-xl font-medium text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 bg-[#00a651] hover:bg-[#008c44] text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-emerald-600/20 active:scale-95 transition-all text-sm ${isSaving ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : saveSuccess ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            )}
            {saveSuccess ? 'Tersimpan!' : 'Simpan Pengaturan'}
          </button>
        </div>

      </div>
    </div>
  );
}
