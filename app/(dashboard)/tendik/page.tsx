"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CustomSelect from '@/components/CustomSelect';

import * as XLSX from 'xlsx';

interface Stats {
  total_antrian: number;
  sedang_diproses: number;
  total_selesai: number;
  sla_terlampaui: number;
}

interface User {
  nama_lengkap: string;
  nim: string;
}

interface Pengajuan {
  id: number;
  nomor_surat: string;
  jenis_surat: string;
  created_at: string;
  status: string;
  sla_status: 'Aman' | 'Mendekati' | 'Terlampaui';
  user: User;
}

export default function DashboardTendik() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [antrian, setAntrian] = useState<Pengajuan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterJenis, setFilterJenis] = useState('Semua Jenis Surat');
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  const [sortConfig, setSortConfig] = useState({ key: 'tanggal_masuk', direction: 'desc' });
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sipa_token');
      const [resStats, resAntrian] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/surat/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/surat?sort=${sortConfig.key}&order=${sortConfig.direction}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (resStats.ok) {
        const data = await resStats.json();
        setStats(data.data);
      }
      if (resAntrian.ok) {
        const data = await resAntrian.json();
        setAntrian(data.data);
      }
    } catch (err) {
      console.error('Gagal mengambil data dashboard:', err);
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

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterJenis, filterStatus]);

  const filteredAntrian = antrian.filter((item) => {
    const matchesSearch = item.nomor_surat.toLowerCase().includes(search.toLowerCase()) || 
                          item.user.nama_lengkap.toLowerCase().includes(search.toLowerCase());
    const matchesJenis = filterJenis === 'Semua Jenis Surat' || item.jenis_surat === filterJenis;
    
    let matchesStatus = false;
    if (filterStatus === 'Semua Status') {
      matchesStatus = true;
    } else if (filterStatus === 'SLA Terlampaui') {
      matchesStatus = item.sla_status === 'Terlampaui';
    } else {
      matchesStatus = item.status === filterStatus;
    }

    return matchesSearch && matchesJenis && matchesStatus;
  });

  const totalPages = Math.ceil(filteredAntrian.length / itemsPerPage);
  const paginatedAntrian = filteredAntrian.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatTanggal = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\./g, ':');
  };

  const handleExportExcel = () => {
    if (filteredAntrian.length === 0) {
      alert("Tidak ada data untuk diekspor");
      return;
    }

    const headers = ["No. Pengajuan", "Nama Mahasiswa", "NIM", "Jenis Surat", "Tanggal Masuk", "Status", "SLA Status"];
    const rows = filteredAntrian.map((item) => [
      item.nomor_surat,
      item.user.nama_lengkap,
      item.user.nim.toString(),
      item.jenis_surat,
      formatTanggal(item.created_at),
      item.status,
      item.sla_status
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Antrian");

    // Write valid binary Excel file (triggers direct download without warnings)
    XLSX.writeFile(workbook, `Data_Antrian_Tendik_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Dashboard Tendik</h1>
        <p className="text-slate-400 font-medium">Kelola dan proses pengajuan surat mahasiswa</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Antrian Baru', value: stats?.total_antrian || 0, color: 'bg-blue-500', activeRing: 'ring-blue-500/30 border-blue-500', icon: 'M12 8v4l3 3m6-3a9 9 0 1 1-9-9 9 9 0 0 1 6 2.23L21 7M21 3v4h-4', filterValue: 'Diajukan' },
          { label: 'Sedang Diproses', value: stats?.sedang_diproses || 0, color: 'bg-amber-500', activeRing: 'ring-amber-500/30 border-amber-500', icon: 'M12 8v4l3 3m6-3a9 9 0 1 1-9-9 9 9 0 0 1 6 2.23L21 7M21 3v4h-4', filterValue: 'Diproses' },
          { label: 'Total Selesai', value: stats?.total_selesai || 0, color: 'bg-emerald-500', activeRing: 'ring-emerald-500/30 border-emerald-500', icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3', filterValue: 'Selesai' },
          { label: 'SLA Terlampaui', value: stats?.sla_terlampaui || 0, color: 'bg-red-500', activeRing: 'ring-red-500/30 border-red-500', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', filterValue: 'SLA Terlampaui' }
        ].map((stat, idx) => (
          <div 
            key={idx} 
            onClick={() => setFilterStatus(filterStatus === stat.filterValue ? 'Semua Status' : stat.filterValue)}
            className={`bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border flex items-center justify-between transition-all cursor-pointer hover:-translate-y-1 hover:shadow-2xl ${
              filterStatus === stat.filterValue 
                ? `ring-4 ${stat.activeRing}` 
                : 'border-slate-100 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={stat.icon}/>
                </svg>
              </div>
              <p className="font-bold text-slate-500 dark:text-slate-400">{stat.label}</p>
            </div>
            <p className="text-3xl font-black text-slate-800 dark:text-slate-100">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 space-y-4 transition-colors">
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
           Filter Pengajuan
        </h2>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input 
              type="text" 
              placeholder="Cari nomor pengajuan atau nama mahasiswa..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-600 dark:text-slate-300 transition-all placeholder:text-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <CustomSelect 
            value={filterJenis}
            onChange={(val) => setFilterJenis(val)}
            className="flex-1 lg:flex-none"
            options={[
              { value: 'Semua Jenis Surat', label: 'Semua Jenis Surat' },
              { value: 'Surat Keterangan Masih Kuliah', label: 'Surat Keterangan Masih Kuliah' },
              { value: 'Surat Ijin Survei Penelitian (Skripsi)', label: 'Surat Ijin Survei Penelitian (Skripsi)' },
              { value: 'Surat Tunjangan/Pensiun/Akses', label: 'Surat Tunjangan/Pensiun/Akses' }
            ]}
          />
          <CustomSelect 
            value={filterStatus}
            onChange={(val) => setFilterStatus(val)}
            className="flex-1 lg:flex-none"
            options={[
              { value: 'Semua Status', label: 'Semua Status' },
              { value: 'Diajukan', label: 'Diajukan' },
              { value: 'Diterima Tendik', label: 'Diterima Tendik' },
              { value: 'Diproses', label: 'Diproses' },
              { value: 'Selesai', label: 'Selesai' },
              { value: 'Ditolak', label: 'Ditolak' },
              { value: 'SLA Terlampaui', label: 'SLA Terlampaui' }
            ]}
          />
          <button 
            onClick={handleExportExcel}
            className="px-8 py-4 rounded-2xl bg-emerald-600 text-white font-black flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Ekspor Excel
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50 overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800/50">
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">Antrian Pengajuan</h2>
          <p className="text-sm font-medium text-slate-400 mt-1">Ditemukan {filteredAntrian.length} pengajuan</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                <th onClick={() => handleSort('sla')} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-1.5">SLA <span className={sortConfig.key === 'sla' ? 'text-emerald-500 text-xs' : 'text-slate-300 dark:text-slate-600 text-xs'}>{sortConfig.key === 'sla' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}</span></div>
                </th>
                <th onClick={() => handleSort('nomor_surat')} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-1.5">No. Pengajuan <span className={sortConfig.key === 'nomor_surat' ? 'text-emerald-500 text-xs' : 'text-slate-300 dark:text-slate-600 text-xs'}>{sortConfig.key === 'nomor_surat' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}</span></div>
                </th>
                <th onClick={() => handleSort('mahasiswa')} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-1.5">Mahasiswa <span className={sortConfig.key === 'mahasiswa' ? 'text-emerald-500 text-xs' : 'text-slate-300 dark:text-slate-600 text-xs'}>{sortConfig.key === 'mahasiswa' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}</span></div>
                </th>
                <th onClick={() => handleSort('jenis_surat')} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-1.5">Jenis Surat <span className={sortConfig.key === 'jenis_surat' ? 'text-emerald-500 text-xs' : 'text-slate-300 dark:text-slate-600 text-xs'}>{sortConfig.key === 'jenis_surat' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}</span></div>
                </th>
                <th onClick={() => handleSort('tanggal_masuk')} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-1.5">Tanggal Masuk <span className={sortConfig.key === 'tanggal_masuk' ? 'text-emerald-500 text-xs' : 'text-slate-300 dark:text-slate-600 text-xs'}>{sortConfig.key === 'tanggal_masuk' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}</span></div>
                </th>
                <th onClick={() => handleSort('status')} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-1.5">Status <span className={sortConfig.key === 'status' ? 'text-emerald-500 text-xs' : 'text-slate-300 dark:text-slate-600 text-xs'}>{sortConfig.key === 'status' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}</span></div>
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Sinkronisasi Data...</p>
                  </td>
                </tr>
              ) : paginatedAntrian.length === 0 ? (
                <tr>
                   <td colSpan={7} className="px-8 py-20 text-center text-slate-400 font-bold">Tidak ada pengajuan ditemukan</td>
                </tr>
              ) : (
                paginatedAntrian.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <div className={`w-2.5 h-2.5 rounded-full ${
                          item.sla_status === 'Terlampaui' ? 'bg-red-500' : 
                          item.sla_status === 'Mendekati' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}></div>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          {item.sla_status === 'Terlampaui' ? 'Terlambat' : item.sla_status === 'Mendekati' ? '12 jam' : 'Aman'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-black text-slate-800 dark:text-slate-200 text-sm">
                        {item.nomor_surat ? item.nomor_surat : <span className="text-slate-400 italic font-medium text-xs">(Menunggu Penomoran)</span>}
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col">
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{item.user.nama_lengkap}</span>
                          <span className="text-[10px] font-medium text-slate-400">{item.user.nim}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 font-medium text-slate-600 dark:text-slate-300 text-sm">{item.jenis_surat}</td>
                    <td className="px-8 py-6 text-slate-400 dark:text-slate-500 font-medium text-sm">{formatTanggal(item.created_at)}</td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap inline-block text-center min-w-[110px]
                        ${item.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600' : 
                          item.status === 'Diajukan' ? 'bg-blue-50 text-blue-600' : 
                          item.status === 'Diterima Tendik' ? 'bg-purple-50 text-purple-600' : 
                          item.status === 'Diproses' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}
                      `}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-2">
                        <Link href={`/tendik/verifikasi/${item.id}`} className="text-blue-500 font-bold text-xs hover:underline">Verifikasi</Link>
                        <Link href={`/tendik/pengajuan/${item.id}`} className="text-emerald-600 font-bold text-xs hover:underline">Detail</Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-8 border-t border-slate-50 dark:border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
           <p className="text-xs font-bold text-slate-400">
             Menampilkan {filteredAntrian.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredAntrian.length)} dari {filteredAntrian.length} pengajuan
           </p>
           <div className="flex items-center gap-3">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              
              <select 
                 value={currentPage}
                 onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                 className="appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl px-5 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer text-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
               >
                 {Array.from({ length: totalPages || 1 }).map((_, i) => (
                   <option key={i} value={i + 1}>Hal {i + 1}</option>
                 ))}
               </select>

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
           </div>
        </div>
      </div>

      {/* SLA Legend */}
      <div className="bg-slate-50/50 dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 transition-colors">
         <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Indikator SLA</h3>
         <div className="flex flex-wrap gap-8">
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
               <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Aman (lebih dari 1 hari)</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-amber-500"></div>
               <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Peringatan (1 hari atau kurang)</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-red-500"></div>
               <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Terlampaui</span>
            </div>
         </div>
      </div>
    </div>
  );
}
