"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CustomSelect from '@/components/CustomSelect';

interface Stats {
  total_antrian: number;
  prioritas_tinggi: number;
  dokumen_lengkap: number;
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
  prioritas: 'Normal' | 'Sedang' | 'Tinggi';
  is_document_complete: boolean;
  user: User;
}

export default function AntrianBaru() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [antrian, setAntrian] = useState<Pengajuan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterJenis, setFilterJenis] = useState('Semua Jenis Surat');
  const [filterPrioritas, setFilterPrioritas] = useState('Semua Prioritas');
  const [sortConfig, setSortConfig] = useState({ key: 'tanggal_masuk', direction: 'desc' });

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
        // Only show "Diajukan" status for this page
        const newOnly = data.data.filter((s: Pengajuan) => s.status === 'Diajukan');
        setAntrian(newOnly);
      }
    } catch (err) {
      console.error('Gagal mengambil data antrian:', err);
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

  const filteredAntrian = antrian.filter((item) => {
    const matchesSearch = item.nomor_surat.toLowerCase().includes(search.toLowerCase()) || 
                          item.user.nama_lengkap.toLowerCase().includes(search.toLowerCase());
    const matchesJenis = filterJenis === 'Semua Jenis Surat' || item.jenis_surat === filterJenis;
    const matchesPrioritas = filterPrioritas === 'Semua Prioritas' || item.prioritas === filterPrioritas;
    return matchesSearch && matchesJenis && matchesPrioritas;
  });

  return (
    <div className="space-y-8 pb-10">
      {/* Breadcrumb */}
      <div>
        <Link href="/tendik" className="text-emerald-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Kembali ke Dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Antrian Pengajuan Baru</h1>
        <p className="text-slate-400 font-medium">Kelola dan proses pengajuan surat yang baru masuk</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Antrian', value: stats?.total_antrian || 0, color: 'bg-blue-500', icon: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2' },
          { label: 'Prioritas Tinggi', value: stats?.prioritas_tinggi || 0, color: 'bg-red-500', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
          { label: 'Dokumen Lengkap', value: stats?.dokumen_lengkap || 0, color: 'bg-emerald-500', icon: 'M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z' },
          { label: 'SLA Terlampaui', value: stats?.sla_terlampaui || 0, color: 'bg-orange-500', icon: 'M12 8v4l3 3m6-3a9 9 0 1 1-9-9 9 9 0 0 1 6 2.23L21 7M21 3v4h-4' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 transition-colors">
             <div className="flex items-center gap-4 mb-4">
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d={stat.icon}/></svg>
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
             </div>
             <p className="text-4xl font-black text-slate-800 dark:text-slate-100">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 items-center transition-colors">
         <div className="flex items-center gap-2 text-slate-400 mr-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            <span className="text-xs font-black uppercase tracking-widest">Filter Antrian</span>
         </div>
         <div className="flex-1 min-w-[200px] relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
               type="text" 
               placeholder="Cari nomor/nama/NIM..."
               className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium dark:text-slate-200"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <CustomSelect 
            value={filterJenis}
            onChange={(val) => setFilterJenis(val)}
            className="flex-1 min-w-[200px]"
            options={[
              { value: 'Semua Jenis Surat', label: 'Semua Jenis Surat' },
              { value: 'Surat Keterangan Masih Kuliah', label: 'Surat Keterangan Masih Kuliah' },
              { value: 'Surat Ijin Survei Penelitian', label: 'Surat Ijin Survei Penelitian' }
            ]}
         />
         <CustomSelect 
            value={filterPrioritas}
            onChange={(val) => setFilterPrioritas(val)}
            className="flex-1 min-w-[200px]"
            options={[
              { value: 'Semua Prioritas', label: 'Semua Prioritas' },
              { value: 'Normal', label: 'Normal' },
              { value: 'Sedang', label: 'Sedang' },
              { value: 'Tinggi', label: 'Tinggi' }
            ]}
         />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50 overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors">
         <div className="p-8 border-b border-slate-50 dark:border-slate-800/50">
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">Daftar Antrian ({filteredAntrian.length})</h2>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                   <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                     <th className="px-8 py-5 w-10"><input type="checkbox" className="rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-emerald-600 focus:ring-emerald-500"/></th>
                     <th onClick={() => handleSort('sla')} className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
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
                     <th onClick={() => handleSort('prioritas')} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <div className="flex items-center gap-1.5">Prioritas <span className={sortConfig.key === 'prioritas' ? 'text-emerald-500 text-xs' : 'text-slate-300 dark:text-slate-600 text-xs'}>{sortConfig.key === 'prioritas' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}</span></div>
                     </th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dokumen</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Aksi</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {loading ? (
                     <tr><td colSpan={8} className="py-20 text-center font-bold text-slate-400">Memuat Antrian...</td></tr>
                  ) : filteredAntrian.length === 0 ? (
                     <tr><td colSpan={8} className="py-20 text-center font-bold text-slate-400">Tidak ada antrian baru</td></tr>
                  ) : (
                     filteredAntrian.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-all group">
                           <td className="px-8 py-6"><input type="checkbox" className="rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-emerald-600 focus:ring-emerald-500"/></td>
                           <td className="px-4 py-6">
                              <div className="flex items-center gap-2">
                                 <div className={`w-2.5 h-2.5 rounded-full ${
                                    item.sla_status === 'Terlampaui' ? 'bg-red-500 shadow-lg shadow-red-200 dark:shadow-red-900' : 
                                    item.sla_status === 'Mendekati' ? 'bg-amber-500 shadow-lg shadow-amber-200 dark:shadow-amber-900' : 'bg-emerald-500 shadow-lg shadow-emerald-200 dark:shadow-emerald-900'
                                 }`}></div>
                                 <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 whitespace-nowrap">1 hari 12 jam</span>
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
                           <td className="px-8 py-6">
                              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider
                                 ${item.prioritas === 'Tinggi' ? 'bg-red-50 text-red-600' : 
                                   item.prioritas === 'Sedang' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}
                              `}>
                                 {item.prioritas}
                              </span>
                           </td>
                           <td className="px-8 py-6">
                              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider w-fit
                                 ${item.is_document_complete ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}
                              `}>
                                 {item.is_document_complete ? (
                                    <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Lengkap</>
                                 ) : (
                                    <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Belum</>
                                 )}
                              </div>
                           </td>
                           <td className="px-8 py-6 text-center">
                              <Link 
                                 href={`/tendik/verifikasi/${item.id}`} 
                                 className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-600 hover:text-emerald-700 transition-all"
                              >
                                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                                 Proses
                              </Link>
                           </td>
                        </tr>
                     ))
                  )}
               </tbody>
            </table>
         </div>
         {/* Footer Pagination */}
         <div className="p-8 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400">Menampilkan 1 - {filteredAntrian.length} dari {filteredAntrian.length} pengajuan</p>
            <div className="flex items-center gap-2">
               <button className="px-6 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-black text-slate-400 opacity-50">Sebelumnya</button>
               <button className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-xs">1</button>
               <button className="px-6 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-xs font-black text-emerald-600 dark:text-emerald-400">Selanjutnya</button>
            </div>
         </div>
      </div>
    </div>
  );
}
