"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CustomSelect from '@/components/CustomSelect';

import * as XLSX from 'xlsx';

interface User {
  nama_lengkap: string;
}

interface Log {
  id: number;
  aksi: string;
  keterangan: string;
  status: string;
  ip_address: string;
  referansi_id: string;
  created_at: string;
  user: User;
}

interface Stats {
  total_log: number;
  hari_ini: number;
  berhasil: number;
  gagal: number;
}

export default function LogAktivitas() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sipa_token');
      const [resLogs, resStats] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logs`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logs/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (resLogs.ok) {
        const data = await resLogs.json();
        setLogs(data.data);
      }
      if (resStats.ok) {
        const data = await resStats.json();
        setStats(data.data);
      }
    } catch (err) {
      console.error('Gagal mengambil data log:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatTanggalFull = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(/\./g, ':');
  };

  const getIcon = (aksi: string, status: string) => {
    if (status === 'Gagal') return <svg className="text-red-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;
    if (aksi.includes('Pengajuan')) return <svg className="text-emerald-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3"/></svg>;
    if (aksi.includes('Login')) return <svg className="text-purple-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>;
    return <svg className="text-blue-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
  };

  const filteredLogs = logs.filter(log => 
    log.aksi.toLowerCase().includes(search.toLowerCase()) || 
    log.keterangan.toLowerCase().includes(search.toLowerCase()) ||
    log.user.nama_lengkap.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportExcel = () => {
    if (filteredLogs.length === 0) {
      alert("Tidak ada data untuk diekspor");
      return;
    }

    const headers = ["ID", "Aksi", "Keterangan", "User", "Tanggal", "Referensi ID", "IP Address", "Status"];
    const rows = filteredLogs.map((item) => [
      item.id.toString(),
      item.aksi,
      item.keterangan,
      item.user.nama_lengkap,
      formatTanggalFull(item.created_at),
      item.referansi_id || "-",
      item.ip_address,
      item.status
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Logs");

    // Write valid binary Excel file (triggers direct download without warnings)
    XLSX.writeFile(workbook, `Data_Log_Aktivitas_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="space-y-1">
        <Link href="/tendik" className="text-emerald-600 font-bold text-xs flex items-center gap-1 mb-2">
           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
           Kembali ke Dashboard
        </Link>
        <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Log Aktivitas</h1>
        <p className="text-slate-400 font-medium">Pantau semua aktivitas sistem SIPA UNESA</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Log', value: stats?.total_log || 0, color: 'bg-blue-500', icon: 'M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z' },
          { label: 'Hari Ini', value: stats?.hari_ini || 0, color: 'bg-purple-500', icon: 'M12 8v4l3 3m6-3a9 9 0 1 1-9-9 9 9 0 0 1 6 2.23L21 7M21 3v4h-4' },
          { label: 'Berhasil', value: stats?.berhasil || 0, color: 'bg-emerald-500', icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3' },
          { label: 'Gagal', value: stats?.gagal || 0, color: 'bg-red-500', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' }
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
            <span className="text-xs font-black uppercase tracking-widest">Filter Log</span>
         </div>
         <div className="flex-1 min-w-[200px] relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
               type="text" 
               placeholder="Cari log..."
               className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium dark:text-slate-200 placeholder:text-slate-400"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <CustomSelect 
            value="Semua User"
            onChange={() => {}}
            options={[{ value: 'Semua User', label: 'Semua User' }]}
         />
         <CustomSelect 
            value="Semua Aksi"
            onChange={() => {}}
            options={[{ value: 'Semua Aksi', label: 'Semua Aksi' }]}
         />
         <CustomSelect 
            value="Semua Status"
            onChange={() => {}}
            options={[{ value: 'Semua Status', label: 'Semua Status' }]}
         />
         <button 
            onClick={handleExportExcel}
            className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center gap-2 hover:bg-emerald-700 transition-all"
         >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Ekspor
         </button>
      </div>

      {/* Timeline Section */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50 overflow-hidden border border-slate-100 dark:border-slate-800 p-8 space-y-8 transition-colors">
         <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">Timeline Log ({filteredLogs.length})</h2>
         
         <div className="space-y-4">
            {loading ? (
               <div className="py-20 text-center font-bold text-slate-400">Sinkronisasi Log...</div>
            ) : filteredLogs.length === 0 ? (
               <div className="py-20 text-center font-bold text-slate-400">Tidak ada log aktivitas</div>
            ) : filteredLogs.map((log) => (
               <div key={log.id} className="p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700/50 hover:border-emerald-200 transition-all group flex items-start justify-between">
                  <div className="flex items-start gap-6">
                     <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800">
                        {getIcon(log.aksi, log.status)}
                     </div>
                     <div className="space-y-1">
                        <h3 className="font-black text-slate-800 dark:text-slate-200 leading-none">{log.aksi}</h3>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{log.keterangan}</p>
                        <div className="flex items-center gap-4 mt-3">
                           <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                              {formatTanggalFull(log.created_at)}
                           </div>
                           <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                              {log.user.nama_lengkap}
                           </div>
                           {log.referansi_id && (
                              <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600">
                                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                 #{log.referansi_id}
                              </div>
                           )}
                           <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                              <span className="uppercase tracking-widest opacity-50">IP:</span>
                              {log.ip_address}
                           </div>
                        </div>
                     </div>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider whitespace-nowrap inline-block text-center min-w-[110px]
                     ${log.status === 'Berhasil' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}
                  `}>
                     {log.status}
                  </span>
               </div>
            ))}
         </div>

         {/* Pagination */}
         <div className="flex items-center justify-between pt-8 border-t border-slate-50 dark:border-slate-800/50">
            <p className="text-xs font-bold text-slate-400">Menampilkan 1 - {filteredLogs.length} dari {logs.length} log</p>
            <div className="flex items-center gap-2">
               <button className="px-6 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-black text-slate-400 opacity-50">Sebelumnya</button>
               <button className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-xs">1</button>
               <button className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-black text-xs">Selanjutnya</button>
            </div>
         </div>
      </div>
    </div>
  );
}
