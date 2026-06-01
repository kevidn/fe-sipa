"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { printKitir } from '@/utils/printKitir';
import CustomSelect from '@/components/CustomSelect';

interface Pengajuan {
  id: number;
  nomor_surat: string;
  jenis_surat: string;
  created_at: string;
  status: 'Diajukan' | 'Selesai' | 'Diproses' | 'Diterima Tendik' | 'Ditolak';
  sla_status: 'Aman' | 'Mendekati' | 'Terlampaui';
  file_url?: string;
}

export default function RiwayatPengajuan() {
  const [search, setSearch] = useState('');
  const [filterJenis, setFilterJenis] = useState('Semua Jenis Surat');
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  const [history, setHistory] = useState<Pengajuan[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sipa_token');
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: search,
        jenis: filterJenis,
        status: filterStatus
      });
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/surat?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data.data || []);
        setTotalPages(data.last_page || 1);
        setTotalData(data.total || 0);
      }
    } catch (err) {
      console.error('Gagal mengambil riwayat:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [currentPage, itemsPerPage, search, filterJenis, filterStatus]);

  const formatTanggal = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleDownload = (item: Pengajuan) => {
    printKitir(item);
  };


  return (
    <div className="space-y-8 pb-10">
      {/* Headers */}
      <div className="space-y-2">
        <Link
          href="/mahasiswa"
          className="inline-flex items-center gap-2 text-sipa-green font-bold hover:gap-3 transition-all group mb-4"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Kembali ke Dashboard
        </Link>
        <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Riwayat Pengajuan</h1>
        <p className="text-slate-400 font-medium">Semua riwayat pengajuan surat Anda</p>
      </div>

      {/* Filter Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center transition-colors duration-300">
        <div className="flex-1 w-full relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Cari nomor pengajuan..."
            className="w-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-sipa-green focus:border-sipa-green block pl-10 p-2.5 transition-colors placeholder-slate-400"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="relative w-full md:w-64">
          <CustomSelect 
            value={filterJenis}
            onChange={(val) => { setFilterJenis(val); setCurrentPage(1); }}
            options={[
              { value: 'Semua Jenis Surat', label: 'Semua Jenis Surat' },
              { value: 'Surat Keterangan Masih Kuliah', label: 'Surat Keterangan Masih Kuliah' },
              { value: 'Surat Ijin Survei Penelitian (Skripsi)', label: 'Surat Ijin Survei Penelitian (Skripsi)' },
              { value: 'Surat Tunjangan/Pensiun/Akses', label: 'Surat Tunjangan/Pensiun/Akses' },
              { value: 'Surat Keterangan Tidak Menerima Beasiswa', label: 'Surat Keterangan Tidak Menerima Beasiswa' },
              { value: 'Surat Rekomendasi Beasiswa', label: 'Surat Rekomendasi Beasiswa' },
              { value: 'Surat Keterangan Kelakuan Baik', label: 'Surat Keterangan Kelakuan Baik' }
            ]}
          />
        </div>
        <div className="relative w-full md:w-64">
          <CustomSelect 
            value={filterStatus}
            onChange={(val) => { setFilterStatus(val); setCurrentPage(1); }}
            options={[
              { value: 'Semua Status', label: 'Semua Status' },
              { value: 'Diajukan', label: 'Diajukan' },
              { value: 'Diterima Tendik', label: 'Diterima Tendik' },
              { value: 'Diproses', label: 'Diproses' },
              { value: 'Selesai', label: 'Selesai' },
              { value: 'Ditolak', label: 'Ditolak' }
            ]}
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50 overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">
            {loading ? 'Memuat Data...' : `Semua Pengajuan (${totalData})`}
          </h2>
          <button
            onClick={fetchHistory}
            className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-sipa-green transition-colors disabled:opacity-50"
            disabled={loading}
          >
            <svg className={loading ? 'animate-spin' : ''} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6m12-4a9 9 0 0 1-15 6.7L3 16" />
            </svg>
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">No. Pengajuan</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Jenis Surat</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">SLA</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-sipa-green border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Sinkronisasi Data...</p>
                    </div>
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-200 dark:text-slate-700">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                      </div>
                      <p className="text-sm font-bold text-slate-400">Tidak ada pengajuan yang ditemukan.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-8 py-6">
                      <p className="font-black text-slate-800 dark:text-slate-200 text-sm mb-1">
                         {item.nomor_surat ? item.nomor_surat : <span className="text-slate-400 italic font-medium text-xs">(Menunggu Penomoran)</span>}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{formatTanggal(item.created_at)}</p>
                    </td>
                    <td className="px-8 py-6 font-medium text-slate-600 dark:text-slate-300 text-sm">{item.jenis_surat}</td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap inline-block text-center min-w-[110px]
                        ${item.status === 'Selesai' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                          item.status === 'Diajukan' ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400' :
                            item.status === 'Diterima Tendik' ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                              item.status === 'Diproses' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'}
                      `}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${item.sla_status === 'Terlampaui' ? 'bg-red-500' :
                            item.sla_status === 'Mendekati' ? 'bg-amber-400' : 'bg-emerald-400'
                          }`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${item.sla_status === 'Terlampaui' ? 'text-red-500' :
                            item.sla_status === 'Mendekati' ? 'text-amber-500' : 'text-emerald-500'
                          }`}>
                          {item.sla_status || 'Aman'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleDownload(item)}
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-sipa-green/10 hover:text-sipa-green transition-all"
                          title="Download"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                        </button>
                        <Link href={`/pengajuan/${item.id}`} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200 transition-all" title="Detail">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                          </svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-6 bg-slate-50/30 dark:bg-slate-800/30 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-50 dark:border-slate-800 transition-colors duration-300">
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
          
          <div className="flex items-center gap-4">
            <p className="text-xs font-bold text-slate-400">
              Halaman <span className="text-slate-800 dark:text-slate-200">{currentPage}</span> dari <span className="text-slate-800 dark:text-slate-200">{totalPages || 1}</span> ({totalData} data)
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-6 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-xs font-black text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-6 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-xs font-black text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Selanjutnya
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
