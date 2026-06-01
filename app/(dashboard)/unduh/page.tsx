"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { printKitir } from '@/utils/printKitir';

interface User {
  nama_lengkap: string;
  nim: string;
  program_studi: string;
}

interface Pengajuan {
  id: number;
  nomor_surat: string;
  jenis_surat: string;
  created_at: string;
  status: string;
  user: User;
}

export default function UnduhKitir() {
  const [pengajuan, setPengajuan] = useState<Pengajuan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKitir, setSelectedKitir] = useState<Pengajuan | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sipa_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/surat?page=${currentPage}&limit=${itemsPerPage}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPengajuan(data.data || []);
        setLastPage(data.last_page || 1);
      }
    } catch (err) {
      console.error('Gagal mengambil data surat:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage]);

  const handlePrint = () => {
    if (selectedKitir) {
      printKitir(selectedKitir);
    }
  };

  const formatTanggal = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('id-ID', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <>
      <div className="space-y-8 pb-10">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Unduh Kitir Digital</h1>
          <p className="text-slate-400 font-medium">Cetak bukti pengajuan surat akademik Anda sebagai referensi</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50 overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors">
           <div className="p-8 border-b border-slate-50 dark:border-slate-800/50">
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">Daftar Pengajuan Anda</h2>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">No. Pengajuan</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Jenis Surat</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Aksi</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                    {loading ? (
                       <tr><td colSpan={5} className="py-20 text-center font-bold text-slate-400">Memuat data...</td></tr>
                    ) : pengajuan.length === 0 ? (
                       <tr><td colSpan={5} className="py-20 text-center font-bold text-slate-400">Belum ada pengajuan</td></tr>
                    ) : pengajuan.map((item) => (
                       <tr key={item.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-all">
                          <td className="px-8 py-6 font-medium text-slate-500 dark:text-slate-400 text-sm">{formatTanggal(item.created_at)}</td>
                          <td className="px-8 py-6 font-black text-slate-800 dark:text-slate-200 text-sm">
                             {item.nomor_surat ? item.nomor_surat : <span className="text-slate-400 italic font-medium text-xs">(Menunggu Penomoran)</span>}
                          </td>
                          <td className="px-8 py-6 font-bold text-slate-600 dark:text-slate-300 text-sm">{item.jenis_surat}</td>
                          <td className="px-8 py-6">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap inline-block text-center min-w-[110px]
                              ${item.status === 'Selesai' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                                item.status === 'Diajukan' ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400' :
                                  item.status === 'Diterima Tendik' ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                                    item.status === 'Diproses' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                                      'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                              }
                            `}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-center">
                             <button 
                               onClick={() => setSelectedKitir(item)}
                               className="px-6 py-2 bg-sipa-green text-white rounded-xl font-black text-xs hover:bg-sipa-green-dark transition-all"
                             >
                               Lihat Kitir
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
           {/* Pagination UI */}
           <div className="p-6 border-t border-slate-50 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500">Tampilkan</span>
                <select 
                   value={itemsPerPage} 
                   onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                   className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-lg focus:ring-sipa-green focus:border-sipa-green block p-2 font-bold cursor-pointer"
                >
                   <option value={5}>5 baris</option>
                   <option value={10}>10 baris</option>
                   <option value={25}>25 baris</option>
                   <option value={50}>50 baris</option>
                </select>
             </div>
             
             <div className="flex items-center gap-2">
                <button 
                   onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                   disabled={currentPage === 1}
                   className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                
                <div className="flex items-center gap-1 px-2">
                   <span className="text-sm font-black text-slate-700 dark:text-slate-200">{currentPage}</span>
                   <span className="text-sm font-bold text-slate-400">/</span>
                   <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{lastPage}</span>
                </div>

                <button 
                   onClick={() => setCurrentPage(prev => Math.min(lastPage, prev + 1))}
                   disabled={currentPage === lastPage}
                   className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
             </div>
           </div>
        </div>
      </div>

      {/* Kitir Modal */}
      {selectedKitir && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedKitir(null)}></div>
          
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
               <h3 className="text-xl font-black text-slate-800">Pratinjau Kitir</h3>
               <button onClick={() => setSelectedKitir(null)} className="p-2 text-slate-400 hover:text-slate-600"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
            </div>
            
            <div className="p-10 overflow-y-auto">
              {/* This is the area that will be printed */}
              <div id="printable-kitir" className="border-2 border-slate-200 p-10 rounded-[24px] bg-white text-slate-800 font-sans relative overflow-hidden">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 text-[100px] font-black text-black/[0.02] pointer-events-none whitespace-nowrap z-0">SIPA UNESA</div>
                 
                 <div className="relative z-10 flex items-center gap-5 border-b-2 border-slate-100 pb-5 mb-8">
                    <div className="w-[60px] h-[60px] bg-sipa-green rounded-xl flex items-center justify-center text-white font-black text-2xl">S</div>
                    <div className="flex-1">
                       <h1 className="m-0 text-xl font-black uppercase tracking-widest text-slate-800">Bukti Pengajuan Surat (Kitir)</h1>
                       <p className="m-0 mt-1 text-xs text-slate-500 font-bold">Sistem Pelayanan Akademik (SIPA) - Universitas Negeri Surabaya</p>
                    </div>
                    <div className="text-right">
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">No. Registrasi</div>
                       <div className="text-lg font-bold text-sipa-green">{selectedKitir.nomor_surat ? selectedKitir.nomor_surat : '(Menunggu Penomoran)'}</div>
                    </div>
                 </div>
                 
                 <div className="relative z-10 grid grid-cols-2 gap-8 mb-10">
                    <div>
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nama Lengkap</div>
                       <div className="text-sm font-bold text-slate-800">{selectedKitir.user.nama_lengkap}</div>
                    </div>
                    <div>
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">NIM / Username</div>
                       <div className="text-sm font-bold text-slate-800">{selectedKitir.user.nim}</div>
                    </div>
                    <div>
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Jenis Surat</div>
                       <div className="text-sm font-bold text-slate-800">{selectedKitir.jenis_surat}</div>
                    </div>
                    <div>
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Program Studi</div>
                       <div className="text-sm font-bold text-slate-800">{selectedKitir.user.program_studi || 'N/A'}</div>
                    </div>
                    <div>
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tanggal Pengajuan</div>
                       <div className="text-sm font-bold text-slate-800">{formatTanggal(selectedKitir.created_at)}</div>
                    </div>
                    <div>
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Keperluan</div>
                       <div className="text-sm font-bold text-slate-800">-</div>
                    </div>
                 </div>

                 <div className="relative z-10 bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-10">
                    <div className="text-xs font-black text-slate-500 mb-3">Status Terakhir Pengajuan</div>
                    <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black uppercase tracking-wider">{selectedKitir.status}</div>
                    <p className="text-[11px] text-slate-500 mt-4 font-medium leading-relaxed">
                       Simpan bukti ini untuk melakukan pengecekan status secara berkala melalui sistem SIPA. Gunakan nomor registrasi di atas untuk berkomunikasi dengan petugas akademik jika diperlukan.
                    </p>
                 </div>

                 <div className="relative z-10 flex justify-between items-end border-t-2 border-slate-100 pt-8 mt-10">
                    <div className="w-[100px] h-[100px] border border-slate-200 rounded-xl flex items-center justify-center text-[8px] text-slate-400 text-center p-2">
                       VERIFIED BY SIPA SYSTEM<br/><br/>{selectedKitir.nomor_surat}
                    </div>
                    <div className="text-right">
                       <div className="text-xs font-bold text-slate-800 mb-[60px]">Dicetak pada: {new Date().toLocaleString('id-ID')}</div>
                       <div className="text-sm font-black border-b border-slate-800 inline-block pb-1">SIPA UNESA DIGITAL SIGNATURE</div>
                       <div className="text-[10px] text-slate-400 font-bold mt-1">Dokumen ini sah tanpa tanda tangan basah</div>
                    </div>
                 </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-4">
               <button onClick={() => setSelectedKitir(null)} className="px-8 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50">Tutup</button>
               <button onClick={handlePrint} className="px-8 py-3 rounded-xl bg-sipa-green text-white font-black flex items-center gap-2 hover:bg-sipa-green-dark shadow-xl shadow-sipa-green/20">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                  Cetak PDF
               </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
