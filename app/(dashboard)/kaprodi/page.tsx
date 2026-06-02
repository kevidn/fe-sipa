"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CustomSelect from '@/components/CustomSelect';
import * as XLSX from 'xlsx';

interface Surat {
  id: number;
  nomor_surat: string;
  jenis_surat: string;
  created_at: string;
  deadline_sla?: string;
  User?: {
    nama_lengkap: string;
  };
}

interface Stats {
  total_pengajuan: number;
  selesai: number;
  dalam_proses: number;
  ditolak: number;
  sla_terlampaui: number;
  sla_terlampaui_list?: Surat[];
}

export default function DashboardKaprodi() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('sipa_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/kaprodi/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data.data);
      }
    } catch (err) {
      console.error('Gagal mengambil statistik Kaprodi:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();

    // 1. Statistik Utama
    const mainStatsData = [
      ["Kategori", "Jumlah"],
      ["Total Pengajuan", stats?.total_pengajuan || 345],
      ["Selesai Tepat Waktu", stats?.selesai || 318],
      ["Dalam Proses", stats?.dalam_proses || 23],
      ["SLA Terlampaui", stats?.sla_terlampaui || 4],
      ["Ditolak", stats?.ditolak || 2]
    ];
    const wsMain = XLSX.utils.aoa_to_sheet(mainStatsData);
    XLSX.utils.book_append_sheet(workbook, wsMain, "Statistik Utama");

    // 2. Trend Pengajuan (Mock Data like on UI)
    const trendData = [
      ["Bulan", "Total Pengajuan", "Selesai", "SLA Terlampaui"],
      ["Jan", 50, 45, 2],
      ["Feb", 65, 60, 3],
      ["Mar", 72, 68, 4]
    ];
    const wsTrend = XLSX.utils.aoa_to_sheet(trendData);
    XLSX.utils.book_append_sheet(workbook, wsTrend, "Trend Pengajuan");

    // 3. Distribusi Jenis Surat (Mock Data like on UI)
    const jenisSuratData = [
      ["Jenis Surat", "Jumlah"],
      ["Surat Keterangan Masih Kuliah", 120],
      ["Surat Ijin Survei Penelitian", 85],
      ["Surat Rekomendasi Beasiswa", 65],
      ["Surat Kelakuan Baik", 45],
      ["Lainnya", 30]
    ];
    const wsJenis = XLSX.utils.aoa_to_sheet(jenisSuratData);
    XLSX.utils.book_append_sheet(workbook, wsJenis, "Distribusi Jenis Surat");

    // 4. SLA Terlampaui List
    if (stats?.sla_terlampaui_list && stats.sla_terlampaui_list.length > 0) {
      const headers = ["No. Pengajuan", "Jenis Surat", "Nama Mahasiswa", "Keterlambatan"];
      const rows = stats.sla_terlampaui_list.map((item) => {
        let keterlambatan = "N/A";
        if (item.deadline_sla) {
           const diff = Math.floor((new Date().getTime() - new Date(item.deadline_sla).getTime()) / (1000 * 3600 * 24));
           if (diff > 0) keterlambatan = `${diff} hari`;
        }
        return [
          item.nomor_surat,
          item.jenis_surat,
          item.User?.nama_lengkap || '-',
          keterlambatan
        ];
      });

      const wsData = [headers, ...rows];
      const worksheet = XLSX.utils.aoa_to_sheet(wsData);

      const colWidths = headers.map((header, colIdx) => {
        let maxLen = header.length;
        rows.forEach((row) => {
          const val = String(row[colIdx]) || "";
          if (val.length > maxLen) {
            maxLen = val.length;
          }
        });
        return { wch: Math.max(12, maxLen + 2) };
      });
      worksheet["!cols"] = colWidths;
      XLSX.utils.book_append_sheet(workbook, worksheet, "SLA Terlampaui List");
    }

    XLSX.writeFile(workbook, `Laporan_Kaprodi_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  return (
    <div className="space-y-8 pb-10 max-w-7xl">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl lg:text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Dashboard Monitoring Kaprodi</h1>
          <p className="text-slate-400 font-medium">Pantau kinerja pelayanan akademik secara real-time</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative min-w-[200px]">
            <CustomSelect 
              value={'Periode: Bulan Ini'}
              onChange={() => {}}
              options={[
                { value: 'Periode: Bulan Ini', label: 'Periode: Bulan Ini' },
                { value: 'Bulan Lalu', label: 'Bulan Lalu' },
                { value: 'Semester Ini', label: 'Semester Ini' }
              ]}
            />
          </div>
          <button onClick={handleExportExcel} className="bg-emerald-500 text-white px-5 py-3 rounded-xl font-black text-xs shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-all flex items-center gap-2 whitespace-nowrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Ekspor Laporan
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center font-bold text-slate-400">Sinkronisasi Data...</div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Card 1: Total Pengajuan */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 relative">
               <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-500 text-xs font-black bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                     +12%
                  </div>
               </div>
               <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-1">{stats?.total_pengajuan || 345}</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Pengajuan Bulan Ini</p>
            </div>

            {/* Card 2: Selesai Tepat Waktu */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 relative">
               <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-500 text-xs font-black bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                     +8%
                  </div>
               </div>
               <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-1">{stats?.selesai || 318}</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Selesai Tepat Waktu</p>
            </div>

            {/* Card 3: Dalam Proses */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 relative">
               <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 text-xs font-black bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </div>
               </div>
               <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-1">{stats?.dalam_proses || 23}</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dalam Proses</p>
            </div>

            {/* Card 4: SLA Terlampaui */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 relative">
               <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-500/30">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  </div>
                  <div className="flex items-center gap-1 text-red-500 text-xs font-black bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded-lg">
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
                     -5%
                  </div>
               </div>
               <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-1">{stats?.sla_terlampaui || 4}</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SLA Terlampaui</p>
            </div>

            {/* Card 5: Ditolak */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 relative">
               <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-slate-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-500/30">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 text-xs font-black bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </div>
               </div>
               <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-1">{stats?.ditolak || 2}</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ditolak</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Bar Chart Mockup */}
             <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">Trend Pengajuan</h3>
                <p className="text-xs font-medium text-slate-400 mb-8">Perbandingan total pengajuan dengan yang selesai dan terlampaui SLA</p>
                
                {/* Mock Chart Area */}
                <div className="h-48 md:h-64 w-full flex items-end gap-2 sm:gap-6 border-b border-l border-slate-200 dark:border-slate-700 pb-2 pl-2 relative ml-4 group cursor-pointer">
                   {/* Y Axis Labels */}
                   <div className="absolute left-[-20px] top-0 bottom-0 flex flex-col justify-between text-[10px] font-bold text-slate-400 h-full pb-2">
                      <span>80</span>
                      <span>60</span>
                      <span>40</span>
                      <span>20</span>
                      <span>0</span>
                   </div>
                   
                   {/* Grid lines */}
                   <div className="absolute left-0 right-0 top-0 h-full w-full flex flex-col justify-between pointer-events-none pb-2">
                      <div className="w-full border-b border-dashed border-slate-200 dark:border-slate-700"></div>
                      <div className="w-full border-b border-dashed border-slate-200 dark:border-slate-700"></div>
                      <div className="w-full border-b border-dashed border-slate-200 dark:border-slate-700"></div>
                      <div className="w-full border-b border-dashed border-slate-200 dark:border-slate-700"></div>
                      <div className="w-full border-b-0"></div>
                   </div>

                   {/* Bars (Mock Data) */}
                   <div className="flex-1 flex justify-center items-end h-full z-10 gap-1 sm:gap-2 transition-transform duration-300 group-hover:scale-[1.02]">
                      <div className="w-8 sm:w-16 bg-blue-500 rounded-t-sm" style={{height: '92%'}}></div>
                      <div className="w-8 sm:w-16 bg-emerald-500 rounded-t-sm" style={{height: '85%'}}></div>
                      <div className="w-8 sm:w-16 bg-red-500 rounded-t-sm" style={{height: '10%'}}></div>
                   </div>

                   {/* Tooltip */}
                   <div className="absolute top-4 right-1/4 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 p-4 z-20 pointer-events-none whitespace-nowrap">
                      <p className="text-base font-medium text-slate-800 dark:text-slate-200 mb-2">Mar</p>
                      <p className="text-sm font-medium text-blue-500 mb-1.5">Total Pengajuan : 72</p>
                      <p className="text-sm font-medium text-emerald-500 mb-1.5">Selesai : 68</p>
                      <p className="text-sm font-medium text-red-500">SLA Terlampaui : 4</p>
                   </div>
                </div>
                {/* X Axis Label */}
                <div className="w-full flex justify-center mt-2 pl-4">
                   <span className="text-[10px] font-bold text-slate-400">Mar</span>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-6">
                   <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-blue-500"></div><span className="text-[10px] font-black text-slate-500 dark:text-slate-400">Total Pengajuan</span></div>
                   <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-emerald-500"></div><span className="text-[10px] font-black text-slate-500 dark:text-slate-400">Selesai</span></div>
                   <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-red-500"></div><span className="text-[10px] font-black text-slate-500 dark:text-slate-400">SLA Terlampaui</span></div>
                </div>
             </div>

             {/* Pie Chart Mockup */}
             <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 flex flex-col">
                <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">Distribusi Jenis Surat</h3>
                <p className="text-xs font-medium text-slate-400 mb-8">Periode Maret 2024</p>
                
                <div className="flex justify-center mb-10 flex-1 items-center relative group cursor-pointer">
                   {/* CSS Pie Chart Mock */}
                   <div className="w-48 h-48 rounded-full shadow-inner relative overflow-hidden transition-transform duration-300 group-hover:scale-105" style={{
                      background: 'conic-gradient(#10b981 0% 35%, #8b5cf6 35% 44%, #f59e0b 44% 63%, #3b82f6 63% 88%, #64748b 88% 100%)'
                   }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-full shadow-sm"></div>
                      </div>
                      
                      {/* Annotations */}
                      <span className="absolute top-4 right-10 text-[10px] font-black text-white drop-shadow-md">35%</span>
                      <span className="absolute bottom-8 right-8 text-[10px] font-black text-white drop-shadow-md">9%</span>
                      <span className="absolute bottom-4 left-14 text-[10px] font-black text-white drop-shadow-md">19%</span>
                      <span className="absolute top-16 left-4 text-[10px] font-black text-white drop-shadow-md">25%</span>
                   </div>

                   {/* Tooltip */}
                   <div className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 py-3 px-5 z-20 pointer-events-none whitespace-nowrap -translate-y-4 group-hover:-translate-y-0">
                      <p className="text-base font-medium text-slate-800 dark:text-slate-200">
                         Surat Keterangan Masih Kuliah : 120
                      </p>
                   </div>
                </div>

                <div className="space-y-3">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div><span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Surat Keterangan Masih Kuliah</span></div>
                      <span className="text-[10px] font-black text-slate-800 dark:text-slate-200">120</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div><span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Surat Ijin Survei Penelitian</span></div>
                      <span className="text-[10px] font-black text-slate-800 dark:text-slate-200">85</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div><span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Surat Rekomendasi Beasiswa</span></div>
                      <span className="text-[10px] font-black text-slate-800 dark:text-slate-200">65</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div><span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Surat Kelakuan Baik</span></div>
                      <span className="text-[10px] font-black text-slate-800 dark:text-slate-200">45</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-slate-500"></div><span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Lainnya</span></div>
                      <span className="text-[10px] font-black text-slate-800 dark:text-slate-200">30</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Warning Table */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 overflow-hidden border border-slate-100 dark:border-slate-800">
             <div className="p-8 border-b border-slate-50 dark:border-slate-800/50">
                <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">Pengajuan yang Melampaui SLA</h3>
                <p className="text-xs font-medium text-slate-400">Memerlukan perhatian khusus</p>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                         <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">No. Pengajuan</th>
                         <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Jenis Surat</th>
                         <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mahasiswa</th>
                         <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Keterlambatan</th>
                         <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Aksi</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                      {stats?.sla_terlampaui_list && stats.sla_terlampaui_list.length > 0 ? (
                         stats.sla_terlampaui_list.map((item) => {
                            let keterlambatan = "N/A";
                            if (item.deadline_sla) {
                               const diff = Math.floor((new Date().getTime() - new Date(item.deadline_sla).getTime()) / (1000 * 3600 * 24));
                               if (diff > 0) keterlambatan = `${diff} hari`;
                            }
                            return (
                               <tr key={item.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-all">
                                  <td className="px-8 py-5 font-black text-slate-800 dark:text-slate-200 text-sm">
                                     {item.nomor_surat ? item.nomor_surat : <span className="text-slate-400 italic font-medium text-xs">(Menunggu Penomoran)</span>}
                                  </td>
                                  <td className="px-8 py-5 font-medium text-slate-600 dark:text-slate-300 text-sm">{item.jenis_surat}</td>
                                  <td className="px-8 py-5 font-bold text-slate-800 dark:text-slate-200 text-sm">{item.User?.nama_lengkap || '-'}</td>
                                  <td className="px-8 py-5 text-center">
                                     <span className="inline-block px-3 py-1.5 rounded-lg text-[10px] font-black bg-red-50 dark:bg-red-500/10 text-red-600">{keterlambatan}</span>
                                  </td>
                                  <td className="px-8 py-5 text-center">
                                     <Link href={`/kaprodi/monitoring/${item.id}`} className="text-emerald-600 font-black text-xs hover:underline uppercase tracking-widest">Lihat Detail</Link>
                                  </td>
                               </tr>
                            );
                         })
                      ) : (
                         <tr>
                            <td colSpan={5} className="px-8 py-8 text-center text-slate-400 text-sm font-bold">Tidak ada pengajuan yang melampaui SLA saat ini</td>
                         </tr>
                      )}
                   </tbody>
                </table>
             </div>
             <div className="p-6 border-t border-slate-50 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-800/20">
                <p className="text-xs font-bold text-slate-400 text-center">Menampilkan {stats?.sla_terlampaui_list?.length || 0} pengajuan yang melampaui SLA</p>
             </div>
          </div>

          {/* Performance Banner */}
          <div className="bg-emerald-600 rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-emerald-600/30 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-emerald-500/50 text-white text-center">
             <div className="pt-4 md:pt-0">
                <h3 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">92.1%</h3>
                <p className="text-emerald-100 font-bold text-sm tracking-wide">Tingkat Ketepatan SLA</p>
             </div>
             <div className="pt-8 md:pt-0">
                <h3 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">2.3 <span className="text-2xl font-bold">hari</span></h3>
                <p className="text-emerald-100 font-bold text-sm tracking-wide">Rata-rata Waktu Proses</p>
             </div>
          </div>
        </>
      )}
    </div>
  );
}
