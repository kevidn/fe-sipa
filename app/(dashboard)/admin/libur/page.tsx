"use client";

import { useState, useEffect } from 'react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

interface HariLibur {
  id: number;
  tanggal: string;
  nama_libur: string;
}

export default function HariLiburNasional() {
  const [data, setData] = useState<HariLibur[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [liburForm, setLiburForm] = useState({ tanggal: '', nama_libur: '' });

  useBodyScrollLock(isModalOpen);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('sipa_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hari-libur`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      setIsModalOpen(false);
      setLiburForm({ tanggal: '', nama_libur: '' });
      fetchData();
    } catch (err) {
      console.error("Failed to add hari libur:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus hari libur ini?')) return;
    try {
      const token = localStorage.getItem('sipa_token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hari-libur/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const formatDateString = (isoString: string) => {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-8 font-poppins pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Konfigurasi Hari Libur Nasional</h1>
          <p className="text-slate-400 font-medium text-sm mt-1">Kelola daftar hari libur untuk perhitungan SLA</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#00a651] hover:bg-[#008c44] text-white font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-emerald-600/20 active:scale-95 transition-all text-sm flex items-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Tambah Hari Libur
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-4 px-6 w-16">No</th>
                <th className="py-4 px-6">Tanggal</th>
                <th className="py-4 px-6">Nama Hari Libur</th>
                <th className="py-4 px-6 w-24 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-100">{index + 1}</td>
                  <td className="py-4 px-6 font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {formatDateString(item.tanggal)}
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-100">{item.nama_libur}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-red-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 font-medium">Belum ada data hari libur</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alert Info */}
      <div className="bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-800/30 rounded-3xl p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-white dark:bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 shadow-sm border border-blue-100 dark:border-blue-500/20">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Informasi Penting</h3>
          <p className="text-blue-500 dark:text-blue-400 text-sm font-medium leading-relaxed">
            Perhitungan SLA akan mengecualikan hari Sabtu, Minggu, dan semua hari libur yang terdaftar di atas. Pastikan untuk memperbarui daftar ini setiap tahunnya untuk perhitungan yang akurat.
          </p>
        </div>
      </div>

      {/* Modal Tambah Hari Libur */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-8 shadow-2xl relative border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
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
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-emerald-500 transition-colors dark:[&::-webkit-calendar-picker-indicator]:invert"
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
                  onClick={() => setIsModalOpen(false)}
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
