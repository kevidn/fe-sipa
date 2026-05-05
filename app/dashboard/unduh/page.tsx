"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { printKitir } from '@/utils/printKitir';

interface User {
  id_user: string;
  nama_lengkap: string;
}

interface Pengajuan {
  id: number;
  id_user: string;
  user: User;
  nomor_surat: string;
  jenis_surat: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function UnduhKitir() {
  const [history, setHistory] = useState<Pengajuan[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('sipa_token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/surat`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Filter only completed or submitted ones that have kitir
          setHistory(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredHistory = history.filter(item => 
    item.nomor_surat.toLowerCase().includes(search.toLowerCase()) ||
    item.jenis_surat.toLowerCase().includes(search.toLowerCase())
  );

  const handleDownload = (item: Pengajuan) => {
    printKitir(item);
  };

  const formatTanggal = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="space-y-2">
        <Link 
          href="/dashboard/mahasiswa" 
          className="inline-flex items-center gap-2 text-sipa-green font-bold hover:gap-3 transition-all group mb-4"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Kembali ke Dashboard
        </Link>
        <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Kitir Digital</h1>
        <p className="text-slate-400 font-medium">Unduh bukti pengajuan (kitir) digital untuk semua surat yang telah selesai</p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50/50 dark:bg-blue-500/5 p-8 rounded-[2.5rem] border border-blue-100 dark:border-blue-500/20 flex flex-col md:flex-row items-start gap-6 transition-colors duration-300">
        <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-200 dark:shadow-none">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            <circle cx="12" cy="12" r="1"/>
          </svg>
        </div>
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-black text-blue-900 dark:text-blue-300">Tentang Kitir Digital</h2>
            <p className="text-blue-800/70 dark:text-blue-400/70 text-sm font-medium leading-relaxed mt-1">
              Kitir digital adalah bukti pengajuan surat yang dilengkapi dengan QR Code untuk verifikasi keaslian. Dokumen ini diterbitkan otomatis saat Anda mengajukan surat dan dapat digunakan sebagai bukti bahwa pengajuan Anda telah masuk ke sistem.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {['Dilengkapi QR Code', 'Dapat Diverifikasi', 'Format PDF'].map((tag) => (
              <div key={tag} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 dark:bg-blue-500/10 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="relative group">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sipa-green transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <input 
          type="text" 
          placeholder="Cari nomor pengajuan atau jenis surat..."
          className="w-full pl-14 pr-8 py-5 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm focus:ring-4 focus:ring-sipa-green/10 focus:border-sipa-green outline-none font-medium text-slate-600 dark:text-slate-300 transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Kitir Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-64 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800">
           <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-200 dark:text-slate-700 mx-auto mb-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
           </div>
           <p className="text-slate-400 font-bold">Tidak ada kitir digital yang ditemukan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHistory.map((item) => (
            <div 
              key={item.id} 
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-950/50 transition-all duration-500 group relative overflow-hidden"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-sipa-green/10 flex items-center justify-center text-sipa-green group-hover:scale-110 transition-transform duration-500 shadow-inner">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider
                    ${item.status === 'Selesai' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'}
                  `}>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'Selesai' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                      {item.status}
                    </div>
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="space-y-4 mb-8">
                <div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight group-hover:text-sipa-green transition-colors">{item.nomor_surat}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1 line-clamp-1">{item.jenis_surat}</p>
                </div>
                
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-slate-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <span className="text-[11px] font-bold uppercase tracking-wider">Diajukan: {formatTanggal(item.created_at)}</span>
                  </div>
                  {item.status === 'Selesai' && (
                    <div className="flex items-center gap-2 text-emerald-500/70">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <span className="text-[11px] font-bold uppercase tracking-wider">Selesai: {formatTanggal(item.updated_at)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleDownload(item)}
                  className="flex-1 bg-sipa-green text-white py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 dark:shadow-none active:scale-95"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Unduh
                </button>
                <Link 
                  href={`/dashboard/pengajuan/${item.id}`}
                  className="w-14 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition-all border border-slate-100 dark:border-slate-800"
                  title="Detail Pengajuan"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                </Link>
              </div>

              {/* Hover Effect - Corner Decoration */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-sipa-green/5 rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
