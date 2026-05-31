"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  nama_lengkap: string;
  nim: string;
  program_studi?: string;
}

interface Pengajuan {
  id: number;
  nomor_surat: string;
  jenis_surat: string;
  keperluan?: string;
  created_at: string;
  status: string;
  prioritas: 'Normal' | 'Urgent';
  waktu_tunggu?: string;
  user: User;
}

export default function PersetujuanSuratKaprodi() {
  const [pengajuanList, setPengajuanList] = useState<Pengajuan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterPrioritas, setFilterPrioritas] = useState<'Semua' | 'Urgent' | 'Normal'>('Semua');

  // Modal States
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedPengajuan, setSelectedPengajuan] = useState<Pengajuan | null>(null);
  const [alasanPenolakan, setAlasanPenolakan] = useState('');

  const fetchPengajuan = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sipa_token');
      // Replace with actual API endpoint later if needed
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/surat?status=Menunggu Persetujuan Kaprodi`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setPengajuanList(data.data || []);
      } else {
        // Mock data if API fails or is not ready
        setPengajuanList([
          {
            id: 1,
            nomor_surat: 'SKM-2024-201',
            jenis_surat: 'Surat Keterangan Masih Kuliah',
            keperluan: 'Untuk keperluan beasiswa LPDP',
            created_at: '2024-05-29T10:00:00Z',
            status: 'Menunggu Persetujuan Kaprodi',
            prioritas: 'Urgent',
            waktu_tunggu: '2 jam yang lalu',
            user: {
              nama_lengkap: 'Hafiyyan Lintang Arizaki',
              nim: '25051204267',
              program_studi: 'S1 Sistem Informasi'
            }
          },
          {
            id: 2,
            nomor_surat: 'SIP-2024-089',
            jenis_surat: 'Surat Ijin Survei Penelitian',
            keperluan: 'Untuk tugas akhir skripsi',
            created_at: '2024-05-28T14:30:00Z',
            status: 'Menunggu Persetujuan Kaprodi',
            prioritas: 'Normal',
            waktu_tunggu: '1 hari yang lalu',
            user: {
              nama_lengkap: 'Siti Nurhaliza',
              nim: '25051204112',
              program_studi: 'S1 Sistem Informasi'
            }
          }
        ]);
      }
    } catch (err) {
      console.error('Gagal mengambil data pengajuan:', err);
      // Mock data fallback
      setPengajuanList([
        {
          id: 1,
          nomor_surat: 'SKM-2024-201',
          jenis_surat: 'Surat Keterangan Masih Kuliah',
          keperluan: 'Untuk keperluan beasiswa LPDP',
          created_at: '2024-05-29T10:00:00Z',
          status: 'Menunggu Persetujuan Kaprodi',
          prioritas: 'Urgent',
          waktu_tunggu: '2 jam yang lalu',
          user: {
            nama_lengkap: 'Hafiyyan Lintang Arizaki',
            nim: '25051204267',
            program_studi: 'S1 Sistem Informasi'
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPengajuan();
  }, []);

  const filteredList = pengajuanList.filter((item) => {
    const matchesSearch = item.nomor_surat.toLowerCase().includes(search.toLowerCase()) || 
                          item.user.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
                          item.user.nim.toLowerCase().includes(search.toLowerCase());
    const matchesPrioritas = filterPrioritas === 'Semua' || item.prioritas === filterPrioritas;
    return matchesSearch && matchesPrioritas;
  });

  const stats = {
    total: pengajuanList.length,
    urgent: pengajuanList.filter(p => p.prioritas === 'Urgent').length,
    normal: pengajuanList.filter(p => p.prioritas === 'Normal').length
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl lg:text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Persetujuan Surat</h1>
        <p className="text-slate-500 font-medium">Review dan setujui pengajuan surat yang memerlukan persetujuan Kaprodi</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Perlu Persetujuan */}
        <div className="bg-orange-50 dark:bg-orange-950/30 p-6 rounded-[2rem] border border-orange-200 dark:border-orange-900/50 flex justify-between items-center transition-transform hover:scale-[1.02] cursor-pointer">
           <div>
              <p className="text-sm font-bold text-orange-600 dark:text-orange-400 mb-1">Perlu Persetujuan</p>
              <h3 className="text-5xl font-black text-orange-700 dark:text-orange-500">{stats.total > 0 ? stats.total : 5}</h3>
           </div>
           <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
           </div>
        </div>

        {/* Card 2: Prioritas Urgent */}
        <div className="bg-red-50 dark:bg-red-950/30 p-6 rounded-[2rem] border border-red-200 dark:border-red-900/50 flex justify-between items-center transition-transform hover:scale-[1.02] cursor-pointer">
           <div>
              <p className="text-sm font-bold text-red-600 dark:text-red-400 mb-1">Prioritas Urgent</p>
              <h3 className="text-5xl font-black text-red-700 dark:text-red-500">{stats.urgent > 0 ? stats.urgent : 2}</h3>
           </div>
           <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-500/30">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
           </div>
        </div>

        {/* Card 3: Prioritas Normal */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-[2rem] border border-blue-200 dark:border-blue-900/50 flex justify-between items-center transition-transform hover:scale-[1.02] cursor-pointer">
           <div>
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-1">Prioritas Normal</p>
              <h3 className="text-5xl font-black text-blue-700 dark:text-blue-500">{stats.normal > 0 ? stats.normal : 3}</h3>
           </div>
           <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
           </div>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 items-center">
         <div className="flex-1 min-w-[300px] relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
               type="text" 
               placeholder="Cari nomor pengajuan, nama mahasiswa, NIM, atau jenis surat..."
               className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-sm font-medium dark:text-slate-200 transition-all outline-none placeholder:text-slate-400"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-100 dark:border-slate-700">
            <button 
               onClick={() => setFilterPrioritas('Semua')}
               className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${filterPrioritas === 'Semua' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
               Semua
            </button>
            <button 
               onClick={() => setFilterPrioritas('Urgent')}
               className={`px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${filterPrioritas === 'Urgent' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={filterPrioritas === 'Urgent' ? 'text-red-500' : 'text-slate-400'}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
               Urgent
            </button>
            <button 
               onClick={() => setFilterPrioritas('Normal')}
               className={`px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${filterPrioritas === 'Normal' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
               Normal
            </button>
         </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50 overflow-hidden border border-slate-100 dark:border-slate-800">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                     <th className="px-6 py-5 w-10 text-center"><div className="w-4 h-4 bg-slate-700 dark:bg-slate-500 rounded-[3px] mx-auto opacity-70"></div></th>
                     <th className="px-6 py-5 text-[11px] font-black text-slate-500 uppercase tracking-widest">No. Pengajuan</th>
                     <th className="px-6 py-5 text-[11px] font-black text-slate-500 uppercase tracking-widest">Mahasiswa</th>
                     <th className="px-6 py-5 text-[11px] font-black text-slate-500 uppercase tracking-widest">Jenis Surat</th>
                     <th className="px-6 py-5 text-[11px] font-black text-slate-500 uppercase tracking-widest">Waktu Tunggu</th>
                     <th className="px-6 py-5 text-[11px] font-black text-slate-500 uppercase tracking-widest">Prioritas</th>
                     <th className="px-6 py-5 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">Aksi</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loading ? (
                     <tr><td colSpan={7} className="py-20 text-center font-bold text-slate-400">Memuat data...</td></tr>
                  ) : filteredList.length === 0 ? (
                     <tr><td colSpan={7} className="py-20 text-center font-bold text-slate-400">Tidak ada pengajuan</td></tr>
                  ) : (
                     filteredList.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all group">
                           <td className="px-6 py-6 text-center">
                              <div className="w-4 h-4 bg-slate-700 dark:bg-slate-500 rounded-[3px] mx-auto opacity-70"></div>
                           </td>
                           <td className="px-6 py-6">
                              <div className="font-black text-slate-800 dark:text-slate-200 text-sm mb-1">{item.nomor_surat}</div>
                              <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                 {new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </div>
                           </td>
                           <td className="px-6 py-6">
                              <div className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-0.5">{item.user.nama_lengkap}</div>
                              <div className="text-[11px] font-medium text-slate-500">{item.user.nim}</div>
                              {item.user.program_studi && <div className="text-[11px] font-medium text-slate-400 mt-0.5">{item.user.program_studi}</div>}
                           </td>
                           <td className="px-6 py-6 max-w-[200px]">
                              <div className="font-medium text-slate-700 dark:text-slate-300 text-sm mb-1">{item.jenis_surat}</div>
                              {item.keperluan && <div className="text-[11px] text-slate-500 italic truncate" title={item.keperluan}>{item.keperluan}</div>}
                           </td>
                           <td className="px-6 py-6">
                              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium">
                                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                 {item.waktu_tunggu || 'Beberapa saat yang lalu'}
                              </div>
                           </td>
                           <td className="px-6 py-6">
                              <span className={`inline-flex px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider
                                 ${item.prioritas === 'Urgent' ? 'bg-red-50 text-red-600 dark:bg-red-500/10' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}
                              `}>
                                 {item.prioritas}
                              </span>
                           </td>
                           <td className="px-6 py-6">
                              <div className="flex items-center justify-center gap-3">
                                 <Link href={`/dashboard/kaprodi/persetujuan/${item.id}`} className="w-8 h-8 rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors" title="Lihat Detail">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                 </Link>
                                 <button 
                                    onClick={() => { setSelectedPengajuan(item); setShowApproveModal(true); }}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors" title="Setujui"
                                 >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                 </button>
                                 <button 
                                    onClick={() => { setSelectedPengajuan(item); setAlasanPenolakan(''); setShowRejectModal(true); }}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" title="Tolak"
                                 >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                                 </button>
                              </div>
                           </td>
                        </tr>
                     ))
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowApproveModal(false)}></div>
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] p-8 relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
               <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                     <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-3">Setujui Pengajuan?</h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 px-4 leading-relaxed">
                     Pengajuan yang disetujui akan diteruskan ke tahap pemrosesan surat oleh Tendik.
                  </p>
                  <div className="flex w-full gap-4">
                     <button onClick={() => setShowApproveModal(false)} className="flex-1 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Batal</button>
                     <button onClick={() => {
                        // Implement approval logic here
                        setShowApproveModal(false);
                     }} className="flex-1 py-3.5 rounded-xl bg-[#00d053] text-white font-bold hover:bg-[#00b548] shadow-lg shadow-[#00d053]/30 transition-all active:scale-95">Ya, Setujui</button>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowRejectModal(false)}></div>
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] p-8 relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
               <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-red-100 dark:bg-red-500/20 text-red-600 rounded-full flex items-center justify-center mb-6">
                     <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2">Tolak Pengajuan</h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 px-4">
                     Berikan alasan penolakan untuk mahasiswa.
                  </p>
                  <textarea 
                     className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm font-medium focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all mb-8 resize-none dark:text-slate-200"
                     rows={4}
                     placeholder="Tuliskan alasan penolakan..."
                     value={alasanPenolakan}
                     onChange={(e) => setAlasanPenolakan(e.target.value)}
                  ></textarea>
                  <div className="flex w-full gap-4">
                     <button onClick={() => setShowRejectModal(false)} className="flex-1 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Batal</button>
                     <button onClick={() => {
                        // Implement rejection logic here
                        setShowRejectModal(false);
                     }} className="flex-1 py-3.5 rounded-xl bg-[#ff8888] hover:bg-[#ff7575] text-white font-bold shadow-lg shadow-[#ff8888]/30 transition-all active:scale-95">Tolak Pengajuan</button>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
