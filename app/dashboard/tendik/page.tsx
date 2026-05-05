"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Surat {
  id: number;
  nomor_surat: string;
  jenis_surat: string;
  created_at: string;
  status: string;
  sla_status: string;
  deadline_sla: string;
  user: {
    nama_lengkap: string;
    nim: string;
  };
}

export default function DashboardTendik() {
  const [suratList, setSuratList] = useState<Surat[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterJenis, setFilterJenis] = useState('Semua Jenis Surat');
  const [filterStatus, setFilterStatus] = useState('Semua Status');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('sipa_token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/surat`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSuratList(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = {
    antrian: suratList.filter(s => s.status === 'Diajukan').length,
    proses: suratList.filter(s => s.status === 'Diproses' || s.status === 'Diterima Tendik').length,
    selesai: suratList.filter(s => {
      const today = new Date().toDateString();
      return s.status === 'Selesai' && new Date(s.created_at).toDateString() === today;
    }).length,
    terlampaui: suratList.filter(s => s.sla_status === 'Terlampaui').length
  };

  const filteredList = suratList.filter(s => {
    const matchesSearch = s.nomor_surat.toLowerCase().includes(search.toLowerCase()) || 
                          s.user.nama_lengkap.toLowerCase().includes(search.toLowerCase());
    const matchesJenis = filterJenis === 'Semua Jenis Surat' || s.jenis_surat === filterJenis;
    const matchesStatus = filterStatus === 'Semua Status' || s.status === filterStatus;
    return matchesSearch && matchesJenis && matchesStatus;
  });

  const getSlaLabel = (s: Surat) => {
    if (s.status === 'Selesai') return { label: 'Selesai', color: 'text-emerald-500', dot: 'bg-emerald-500' };
    if (s.sla_status === 'Terlampaui') return { label: 'Terlambat', color: 'text-red-500', dot: 'bg-red-500' };
    if (s.sla_status === 'Mendekati') return { label: 'Mendekati', color: 'text-amber-500', dot: 'bg-amber-500' };
    return { label: 'Aman', color: 'text-emerald-500', dot: 'bg-emerald-500' };
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Dashboard Tendik</h1>
        <p className="text-slate-400 font-medium mt-1">Kelola dan proses pengajuan surat mahasiswa</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Antrian Baru', value: stats.antrian, icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          ), color: 'bg-blue-500', shadow: 'shadow-blue-200 dark:shadow-blue-900/20' },
          { label: 'Sedang Diproses', value: stats.proses, icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          ), color: 'bg-amber-500', shadow: 'shadow-amber-200 dark:shadow-amber-900/20' },
          { label: 'Selesai Hari Ini', value: stats.selesai, icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          ), color: 'bg-emerald-500', shadow: 'shadow-emerald-200 dark:shadow-emerald-900/20' },
          { label: 'SLA Terlampaui', value: stats.terlampaui, icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          ), color: 'bg-red-500', shadow: 'shadow-red-200 dark:shadow-red-900/20' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm hover:shadow-xl transition-all duration-500 group">
            <div className="space-y-1">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-4xl font-black text-slate-800 dark:text-slate-100">{stat.value}</h3>
            </div>
            <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full relative group">
          <svg className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sipa-green transition-colors" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input 
            type="text" 
            placeholder="Cari nomor pengajuan atau nama mahasiswa..."
            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-sipa-green/20 font-medium text-slate-600 dark:text-slate-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select 
          className="w-full md:w-64 px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-sipa-green/20 font-medium text-slate-600 dark:text-slate-300 appearance-none"
          value={filterJenis}
          onChange={(e) => setFilterJenis(e.target.value)}
        >
          <option>Semua Jenis Surat</option>
          <option>Surat Keterangan Masih Kuliah</option>
          <option>Surat Ijin Survei Penelitian (Skripsi)</option>
          <option>Surat Rekomendasi Beasiswa</option>
        </select>
        <select 
          className="w-full md:w-48 px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-sipa-green/20 font-medium text-slate-600 dark:text-slate-300 appearance-none"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option>Semua Status</option>
          <option>Diajukan</option>
          <option>Diterima Tendik</option>
          <option>Diproses</option>
          <option>Selesai</option>
        </select>
      </div>

      {/* Queue Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">Antrian Pengajuan</h2>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sistem Online</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                <th className="py-5 px-10">SLA</th>
                <th className="py-5 px-10">No. Pengajuan</th>
                <th className="py-5 px-10">Mahasiswa</th>
                <th className="py-5 px-10">Jenis Surat</th>
                <th className="py-5 px-10">Status</th>
                <th className="py-5 px-10 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {loading ? (
                <tr><td colSpan={6} className="py-20 text-center font-bold text-slate-300">Memuat antrian...</td></tr>
              ) : filteredList.length === 0 ? (
                <tr><td colSpan={6} className="py-20 text-center font-bold text-slate-300">Tidak ada pengajuan ditemukan.</td></tr>
              ) : (
                filteredList.map((item) => {
                  const sla = getSlaLabel(item);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="py-6 px-10">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${sla.dot}`} />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${sla.color}`}>{sla.label}</span>
                        </div>
                      </td>
                      <td className="py-6 px-10">
                        <span className="font-black text-slate-800 dark:text-slate-200 text-sm">{item.nomor_surat}</span>
                      </td>
                      <td className="py-6 px-10">
                        <p className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight">{item.user.nama_lengkap}</p>
                        <p className="text-[10px] font-bold text-slate-400 tracking-widest mt-1">{item.user.nim}</p>
                      </td>
                      <td className="py-6 px-10">
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{item.jenis_surat}</p>
                      </td>
                      <td className="py-6 px-10">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
                          ${item.status === 'Selesai' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 
                            item.status === 'Diterima Tendik' ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                            item.status === 'Diproses' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}
                        `}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-6 px-10 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <Link href={`/dashboard/tendik/pengajuan/${item.id}`} className="text-[10px] font-black text-sipa-green uppercase tracking-widest hover:underline">Verifikasi</Link>
                          <Link href={`/dashboard/tendik/pengajuan/${item.id}`} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-800 dark:hover:text-slate-200">Detail</Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SLA Legend */}
      <div className="flex flex-wrap items-center gap-8 px-8 py-6 bg-slate-50/50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Indikator SLA:</span>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Aman (Lebih dari 1 hari)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Peringatan (1 hari atau kurang)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Terlampaui</span>
        </div>
      </div>
    </div>
  );
}
