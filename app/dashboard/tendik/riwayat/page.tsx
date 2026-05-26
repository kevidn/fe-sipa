"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

import * as XLSX from 'xlsx';

interface Processor {
  nama_lengkap: string;
}

interface User {
  nama_lengkap: string;
  nim: string;
}

interface Pengajuan {
  id: number;
  nomor_surat: string;
  jenis_surat: string;
  status: string;
  sla_status: string;
  created_at: string;
  updated_at: string;
  user: User;
  processor?: Processor;
}

export default function RiwayatPemrosesan() {
  const [riwayat, setRiwayat] = useState<Pengajuan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterJenis, setFilterJenis] = useState('Semua Jenis Surat');
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  const [sortConfig, setSortConfig] = useState({ key: 'tanggal_masuk', direction: 'desc' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sipa_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/surat?sort=${sortConfig.key}&order=${sortConfig.direction}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Only show "Selesai" or "Ditolak" for Riwayat
        const processed = data.data.filter((s: Pengajuan) => s.status === 'Selesai' || s.status === 'Ditolak');
        setRiwayat(processed);
      }
    } catch (err) {
      console.error('Gagal mengambil riwayat:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  useEffect(() => {
    fetchData();
  }, [sortConfig]);

  const calculateProcessingTime = (start: string, end: string) => {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    const diff = e - s;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} hari ${hours} jam`;
    return `${hours} jam`;
  };

  const formatTanggal = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\./g, ':');
  };

  const handleExportExcel = () => {
    if (filteredRiwayat.length === 0) {
      alert("Tidak ada data untuk diekspor");
      return;
    }

    const headers = ["No. Pengajuan", "Nama Mahasiswa", "NIM", "Jenis Surat", "Tanggal Selesai", "Waktu Proses", "Status", "SLA Status", "Diproses Oleh"];
    const rows = filteredRiwayat.map((item) => [
      item.nomor_surat,
      item.user.nama_lengkap,
      item.user.nim.toString(),
      item.jenis_surat,
      formatTanggal(item.updated_at),
      calculateProcessingTime(item.created_at, item.updated_at),
      item.status,
      item.sla_status,
      item.processor?.nama_lengkap || "-"
    ]);

    // Create worksheet
    const wsData = [headers, ...rows];
    const worksheet = XLSX.utils.aoa_to_sheet(wsData);

    // Calculate dynamic column widths (wch = character width)
    const colWidths = headers.map((header, colIdx) => {
      let maxLen = header.length;
      rows.forEach((row) => {
        const val = row[colIdx] || "";
        if (val.length > maxLen) {
          maxLen = val.length;
        }
      });
      return { wch: Math.max(12, maxLen + 2) };
    });
    worksheet["!cols"] = colWidths;

    // Create workbook and append worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Riwayat");

    // Write valid binary Excel file (triggers direct download without warnings)
    XLSX.writeFile(workbook, `Data_Riwayat_Tendik_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const filteredRiwayat = riwayat.filter((item) => {
    const matchesSearch = item.nomor_surat.toLowerCase().includes(search.toLowerCase()) || 
                          item.user.nama_lengkap.toLowerCase().includes(search.toLowerCase());
    const matchesJenis = filterJenis === 'Semua Jenis Surat' || item.jenis_surat === filterJenis;
    const matchesStatus = filterStatus === 'Semua Status' || item.status === filterStatus;
    return matchesSearch && matchesJenis && matchesStatus;
  });

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="space-y-1">
        <Link href="/dashboard/tendik" className="text-emerald-600 font-bold text-xs flex items-center gap-1 mb-2">
           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
           Kembali ke Dashboard
        </Link>
        <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Riwayat Pemrosesan</h1>
        <p className="text-slate-400 font-medium">Lihat semua pengajuan yang sudah diproses</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Diproses', value: riwayat.length, color: 'bg-blue-500', icon: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2' },
          { label: 'Selesai', value: riwayat.filter(r => r.status === 'Selesai').length, color: 'bg-emerald-500', icon: 'M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z' },
          { label: 'Ditolak', value: riwayat.filter(r => r.status === 'Ditolak').length, color: 'bg-red-500', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z' },
          { label: 'SLA Terlampaui', value: riwayat.filter(r => r.sla_status === 'Terlampaui').length, color: 'bg-orange-500', icon: 'M12 8v4l3 3m6-3a9 9 0 1 1-9-9 9 9 0 0 1 6 2.23L21 7M21 3v4h-4' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors">
             <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d={stat.icon}/></svg>
                </div>
                <p className="font-bold text-slate-500 dark:text-slate-400">{stat.label}</p>
             </div>
             <p className="text-3xl font-black text-slate-800 dark:text-slate-100">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 items-center transition-colors">
         <div className="flex items-center gap-2 text-slate-400 mr-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            <span className="text-xs font-black uppercase tracking-widest">Filter Riwayat</span>
         </div>
         <div className="flex-1 min-w-[200px] relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
               type="text" 
               placeholder="Cari nomor/nama/NIM..."
               className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium dark:text-slate-200 placeholder:text-slate-400"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <select className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm font-medium dark:text-slate-200" value={filterJenis} onChange={(e) => setFilterJenis(e.target.value)}>
            <option>Semua Jenis Surat</option>
            <option>Surat Keterangan Masih Kuliah</option>
            <option>Surat Ijin Survei Penelitian</option>
         </select>
         <select className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm font-medium dark:text-slate-200" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option>Semua Status</option>
            <option>Selesai</option>
            <option>Ditolak</option>
         </select>
         <button 
            onClick={handleExportExcel}
            className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center gap-2 hover:bg-emerald-700 transition-all"
         >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Ekspor
         </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50 overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors">
         <div className="p-8 border-b border-slate-50 dark:border-slate-800/50 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">Daftar Riwayat ({filteredRiwayat.length})</h2>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
               <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                     <th onClick={() => handleSort('nomor_surat')} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <div className="flex items-center gap-1.5">No. Pengajuan <span className={sortConfig.key === 'nomor_surat' ? 'text-emerald-500 text-xs' : 'text-slate-300 dark:text-slate-600 text-xs'}>{sortConfig.key === 'nomor_surat' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}</span></div>
                     </th>
                     <th onClick={() => handleSort('mahasiswa')} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <div className="flex items-center gap-1.5">Mahasiswa <span className={sortConfig.key === 'mahasiswa' ? 'text-emerald-500 text-xs' : 'text-slate-300 dark:text-slate-600 text-xs'}>{sortConfig.key === 'mahasiswa' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}</span></div>
                     </th>
                     <th onClick={() => handleSort('jenis_surat')} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <div className="flex items-center gap-1.5">Jenis Surat <span className={sortConfig.key === 'jenis_surat' ? 'text-emerald-500 text-xs' : 'text-slate-300 dark:text-slate-600 text-xs'}>{sortConfig.key === 'jenis_surat' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}</span></div>
                     </th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tgl Selesai</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Waktu Proses</th>
                     <th onClick={() => handleSort('status')} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <div className="flex items-center gap-1.5">Status <span className={sortConfig.key === 'status' ? 'text-emerald-500 text-xs' : 'text-slate-300 dark:text-slate-600 text-xs'}>{sortConfig.key === 'status' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}</span></div>
                     </th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">SLA</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Diprose Oleh</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Aksi</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {loading ? (
                     <tr><td colSpan={9} className="py-20 text-center font-bold text-slate-400 uppercase tracking-widest text-xs">Memuat Riwayat...</td></tr>
                   ) : filteredRiwayat.map((item) => (
                     <tr key={item.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-all group">
                        <td className="px-8 py-6 font-black text-slate-800 dark:text-slate-200 text-sm">{item.nomor_surat}</td>
                        <td className="px-8 py-6">
                           <div className="flex flex-col">
                              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{item.user.nama_lengkap}</span>
                              <span className="text-[10px] font-medium text-slate-400">{item.user.nim}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 font-medium text-slate-600 dark:text-slate-300 text-sm">{item.jenis_surat}</td>
                        <td className="px-8 py-6 text-slate-400 font-medium text-sm whitespace-nowrap">
                           <div className="flex items-center gap-2">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                              {formatTanggal(item.updated_at)}
                           </div>
                        </td>
                        <td className="px-8 py-6 text-slate-500 font-bold text-xs whitespace-nowrap">
                           <div className="flex items-center gap-2">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                              {calculateProcessingTime(item.created_at, item.updated_at)}
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider
                              ${item.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}
                           `}>
                              {item.status}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-center">
                           <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider
                              ${item.sla_status === 'Terlampaui' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}
                           `}>
                              {item.sla_status === 'Terlampaui' ? 'Terlampaui' : 'Tepat Waktu'}
                           </span>
                        </td>
                        <td className="px-8 py-6 font-bold text-slate-700 dark:text-slate-300 text-xs">{item.processor?.nama_lengkap || 'Sistem'}</td>
                        <td className="px-8 py-6 text-center">
                           <Link href={`/dashboard/tendik/pengajuan/${item.id}`} className="text-emerald-600 font-black text-xs hover:underline uppercase tracking-widest">Detail</Link>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         {/* Footer Pagination */}
         <div className="p-8 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400">Menampilkan 1 - {filteredRiwayat.length} dari {riwayat.length} riwayat</p>
            <div className="flex items-center gap-2">
               <button className="px-6 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-black text-slate-400 opacity-50">Sebelumnya</button>
               <button className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-xs">1</button>
               <button className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 text-slate-400 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800">2</button>
               <button className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-black text-xs">Selanjutnya</button>
            </div>
         </div>
      </div>
    </div>
  );
}
