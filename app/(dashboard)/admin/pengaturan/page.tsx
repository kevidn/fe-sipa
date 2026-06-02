"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Settings, Bell, Clock, Database, Shield, Mail, Calendar, 
  ChevronLeft, Plus, X, Save, RotateCcw
} from 'lucide-react';

interface SystemSettings {
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

interface HariLibur {
  id: number;
  tanggal: string;
  keterangan: string;
}

export default function PengaturanSistem() {
  const [settings, setSettings] = useState<SystemSettings>({
    email_notification: true,
    push_notification: true,
    sla_performance_hrs: 6,
    backup_otomatis: true,
    backup_interval: 'Harian (setiap hari pukul 00:00)',
    max_file_upload_mb: 5,
    session_timeout_min: 30,
    smtp_server: 'smtp.unesa.ac.id',
    smtp_port: 587
  });
  
  const [liburList, setLiburList] = useState<HariLibur[]>([]);
  const [newLiburDate, setNewLiburDate] = useState('');
  const [newLiburName, setNewLiburName] = useState('');

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('sipa_token');
        
        // Fetch Settings
        const resSettings = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resSettings.ok) {
          const json = await resSettings.json();
          setSettings(prev => ({ ...prev, ...json.data }));
        }

        // Fetch Hari Libur
        const resLibur = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hari-libur`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resLibur.ok) {
          const json = await resLibur.json();
          setLiburList(json.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const handleAddLibur = async () => {
    if (!newLiburDate || !newLiburName) return;
    try {
      const token = localStorage.getItem('sipa_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hari-libur`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          tanggal: newLiburDate,
          keterangan: newLiburName
        })
      });
      if (res.ok) {
        const json = await res.json();
        setLiburList([...liburList, json.data]);
        setNewLiburDate('');
        setNewLiburName('');
      }
    } catch (err) {
      console.error("Failed to add hari libur:", err);
    }
  };

  const handleDeleteLibur = async (id: number) => {
    try {
      const token = localStorage.getItem('sipa_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hari-libur/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setLiburList(liburList.filter(l => l.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete hari libur:", err);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-[#1c4ed8] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-8 font-poppins pb-20">
      {/* Header */}
      <div>
        <Link href="/admin" className="inline-flex items-center text-sm font-bold text-[#1c4ed8] hover:text-blue-700 mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Kembali ke Dashboard
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#1c4ed8] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Settings className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[#1c4ed8] tracking-tight">Pengaturan Sistem</h1>
            <p className="text-slate-500 font-medium text-sm mt-1">Konfigurasi sistem SIPA UNESA</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl space-y-8">
        
        {/* Notifikasi */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="bg-blue-50 dark:bg-blue-900/20 px-8 py-5 flex items-center gap-3">
            <div className="bg-[#1c4ed8] p-2 rounded-xl">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Notifikasi</h2>
              <p className="text-xs text-slate-500 font-medium">Pengaturan notifikasi sistem</p>
            </div>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">Notifikasi Email</p>
                <p className="text-slate-400 text-xs font-medium mt-1">Kirim notifikasi via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={settings.email_notification} onChange={(e) => setSettings({...settings, email_notification: e.target.checked})} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-[#1c4ed8]"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">Notifikasi Push</p>
                <p className="text-slate-400 text-xs font-medium mt-1">Kirim notifikasi browser push</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={settings.push_notification} onChange={(e) => setSettings({...settings, push_notification: e.target.checked})} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-[#1c4ed8]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* SLA */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="bg-orange-50 dark:bg-orange-900/20 px-8 py-5 flex items-center gap-3">
            <div className="bg-[#f59e0b] p-2 rounded-xl">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">SLA (Service Level Agreement)</h2>
              <p className="text-xs text-slate-500 font-medium">Pengaturan batas waktu pemrosesan</p>
            </div>
          </div>
          <div className="p-8 space-y-4">
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">Peringatan SLA (jam sebelum batas)</p>
              <p className="text-slate-400 text-xs font-medium mt-1 mb-6">Sistem akan memberi peringatan sebelum SLA terlampaui</p>
            </div>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="1" 
                max="24" 
                value={settings.sla_performance_hrs} 
                onChange={(e) => setSettings({...settings, sla_performance_hrs: parseInt(e.target.value)})}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-[#1c4ed8]"
              />
              <span className="font-black text-[#1c4ed8] text-lg w-8 text-center">{settings.sla_performance_hrs}</span>
            </div>
            <p className="text-xs text-slate-400 font-medium pt-2">Peringatan akan dikirim {settings.sla_performance_hrs} jam sebelum batas waktu SLA</p>
          </div>
        </div>

        {/* Backup Database */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="bg-fuchsia-50 dark:bg-fuchsia-900/20 px-8 py-5 flex items-center gap-3">
            <div className="bg-[#a855f7] p-2 rounded-xl">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Backup Database</h2>
              <p className="text-xs text-slate-500 font-medium">Pengaturan backup otomatis</p>
            </div>
          </div>
          <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">Backup Otomatis</p>
                <p className="text-slate-400 text-xs font-medium mt-1">Aktifkan backup database otomatis</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={settings.backup_otomatis} onChange={(e) => setSettings({...settings, backup_otomatis: e.target.checked})} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-[#1c4ed8]"></div>
              </label>
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-3">Interval Backup</p>
              <select 
                value={settings.backup_interval}
                onChange={(e) => setSettings({...settings, backup_interval: e.target.value})}
                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#1c4ed8] focus:ring-2 focus:ring-[#1c4ed8]/20 transition-all cursor-pointer"
              >
                <option value="Harian (setiap hari pukul 00:00)">Harian (setiap hari pukul 00:00)</option>
                <option value="Mingguan (setiap hari Minggu)">Mingguan (setiap hari Minggu)</option>
                <option value="Bulanan (setiap tanggal 1)">Bulanan (setiap tanggal 1)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Keamanan Sistem */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 px-8 py-5 flex items-center gap-3">
            <div className="bg-[#10b981] p-2 rounded-xl">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Keamanan Sistem</h2>
              <p className="text-xs text-slate-500 font-medium">Pengaturan keamanan dan upload file</p>
            </div>
          </div>
          <div className="p-8 space-y-8">
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">Maksimal Ukuran File Upload (MB)</p>
              <div className="flex items-center gap-4 mt-6">
                <input 
                  type="range" 
                  min="1" 
                  max="50" 
                  value={settings.max_file_upload_mb} 
                  onChange={(e) => setSettings({...settings, max_file_upload_mb: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-[#1c4ed8]"
                />
                <span className="font-black text-[#1c4ed8] text-lg w-8 text-center">{settings.max_file_upload_mb}</span>
              </div>
              <p className="text-xs text-slate-400 font-medium pt-2 mt-2">File lebih dari {settings.max_file_upload_mb} MB tidak dapat diupload</p>
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-3">Session Timeout (menit)</p>
              <input 
                type="number" 
                value={settings.session_timeout_min}
                onChange={(e) => setSettings({...settings, session_timeout_min: parseInt(e.target.value) || 30})}
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#1c4ed8] focus:ring-2 focus:ring-[#1c4ed8]/20 transition-all"
              />
              <p className="text-xs text-slate-400 font-medium pt-2 mt-1">User akan otomatis logout setelah {settings.session_timeout_min} menit tidak aktif</p>
            </div>
          </div>
        </div>

        {/* Server Email */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="bg-rose-50 dark:bg-rose-900/20 px-8 py-5 flex items-center gap-3">
            <div className="bg-[#f43f5e] p-2 rounded-xl">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Server Email</h2>
              <p className="text-xs text-slate-500 font-medium">Konfigurasi SMTP server</p>
            </div>
          </div>
          <div className="p-8 space-y-6">
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-3">SMTP Server</p>
              <input 
                type="text" 
                value={settings.smtp_server}
                onChange={(e) => setSettings({...settings, smtp_server: e.target.value})}
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#1c4ed8] focus:ring-2 focus:ring-[#1c4ed8]/20 transition-all"
              />
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-3">Port SMTP</p>
              <input 
                type="number" 
                value={settings.smtp_port}
                onChange={(e) => setSettings({...settings, smtp_port: parseInt(e.target.value) || 587})}
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#1c4ed8] focus:ring-2 focus:ring-[#1c4ed8]/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Hari Libur Nasional */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="bg-amber-50 dark:bg-amber-900/20 px-8 py-5 flex items-center gap-3">
            <div className="bg-[#fbbf24] p-2 rounded-xl">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Hari Libur Nasional</h2>
              <p className="text-xs text-slate-500 font-medium">Konfigurasi hari libur untuk perhitungan SLA hari kerja</p>
            </div>
          </div>
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <input 
                type="date" 
                value={newLiburDate}
                onChange={(e) => setNewLiburDate(e.target.value)}
                className="w-full md:w-1/3 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#1c4ed8] focus:ring-2 focus:ring-[#1c4ed8]/20 transition-all"
              />
              <input 
                type="text" 
                placeholder="Nama hari libur (contoh: Hari Raya Idul Adha)"
                value={newLiburName}
                onChange={(e) => setNewLiburName(e.target.value)}
                className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#1c4ed8] focus:ring-2 focus:ring-[#1c4ed8]/20 transition-all"
              />
              <button 
                onClick={handleAddLibur}
                disabled={!newLiburDate || !newLiburName}
                className="bg-[#1c4ed8] hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Tambah
              </button>
            </div>

            <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden mb-4">
              <div className="max-h-64 overflow-y-auto custom-scrollbar">
                {liburList.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 font-medium text-sm">Belum ada hari libur yang ditambahkan.</div>
                ) : (
                  <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                    {liburList.map((libur) => (
                      <li key={libur.id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                        <div className="flex items-center gap-6">
                          <span className="text-sm font-medium text-slate-500 w-28">{libur.tanggal.split('T')[0]}</span>
                          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{libur.keterangan}</span>
                        </div>
                        <button 
                          onClick={() => handleDeleteLibur(libur.id)}
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          title="Hapus"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-400 font-medium">Total {liburList.length} hari libur dikonfigurasi - SLA dihitung berdasarkan hari kerja Senin-Jumat, tidak termasuk hari-hari di atas.</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-bold py-3 px-6 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Reset ke Default
          </button>
          
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 bg-[#1c4ed8] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-500/30 active:scale-95 transition-all text-sm ${isSaving ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : saveSuccess ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saveSuccess ? 'Tersimpan!' : 'Simpan Pengaturan'}
          </button>
        </div>

      </div>
    </div>
  );
}
