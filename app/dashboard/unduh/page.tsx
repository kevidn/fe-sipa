"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sipa_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/surat`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPengajuan(data.data);
      }
    } catch (err) {
      console.error('Gagal mengambil data surat:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const formatTanggal = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('id-ID', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          #printable-kitir, #printable-kitir * { visibility: visible; }
          #printable-kitir {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 2cm;
          }
          .no-print { display: none !important; }
        }
      `}} />

      <div className="space-y-8 pb-10 no-print">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Unduh Kitir Digital</h1>
          <p className="text-slate-400 font-medium">Cetak bukti pengajuan surat akademik Anda sebagai referensi</p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
           <div className="p-8 border-b border-slate-50">
              <h2 className="text-xl font-black text-slate-800">Daftar Pengajuan Anda</h2>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50/50">
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">No. Pengajuan</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Jenis Surat</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Aksi</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {loading ? (
                       <tr><td colSpan={5} className="py-20 text-center font-bold text-slate-400">Memuat data...</td></tr>
                    ) : pengajuan.length === 0 ? (
                       <tr><td colSpan={5} className="py-20 text-center font-bold text-slate-400">Belum ada pengajuan</td></tr>
                    ) : pengajuan.map((item) => (
                       <tr key={item.id} className="hover:bg-slate-50/30 transition-all">
                          <td className="px-8 py-6 font-medium text-slate-500 text-sm">{formatTanggal(item.created_at)}</td>
                          <td className="px-8 py-6 font-black text-slate-800 text-sm">{item.nomor_surat}</td>
                          <td className="px-8 py-6 font-bold text-slate-600 text-sm">{item.jenis_surat}</td>
                          <td className="px-8 py-6">
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full font-black text-[10px] uppercase">
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
        </div>
      </div>

      {/* Kitir Modal / Printable Area */}
      {selectedKitir && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 no-print">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedKitir(null)}></div>
          
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
               <h3 className="text-xl font-black text-slate-800">Pratinjau Kitir</h3>
               <button onClick={() => setSelectedKitir(null)} className="p-2 text-slate-400 hover:text-slate-600"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
            </div>
            
            <div className="p-10 overflow-y-auto">
              {/* This is the area that will be printed */}
              <div id="printable-kitir" className="border-2 border-slate-200 p-10 rounded-2xl bg-white text-slate-800 font-sans">
                 <div className="text-center mb-8 border-b-2 border-slate-200 pb-8">
                    <h1 className="text-2xl font-black uppercase tracking-widest mb-1">KITIR PENGANTAR</h1>
                    <h2 className="text-lg font-bold text-slate-600">SISTEM PELAYANAN AKADEMIK UNESA</h2>
                    <p className="text-sm font-medium mt-4">Tanggal Cetak: {new Date().toLocaleDateString('id-ID')}</p>
                 </div>
                 
                 <div className="space-y-6">
                    <div>
                       <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Nomor Pengajuan</p>
                       <p className="text-3xl font-black text-sipa-green tracking-tighter">{selectedKitir.nomor_surat}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                       <div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Nama Mahasiswa</p>
                          <p className="font-bold text-lg">{selectedKitir.user.nama_lengkap}</p>
                       </div>
                       <div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">NIM</p>
                          <p className="font-bold text-lg">{selectedKitir.user.nim}</p>
                       </div>
                    </div>

                    <div>
                       <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Jenis Layanan</p>
                       <p className="font-bold text-lg">{selectedKitir.jenis_surat}</p>
                    </div>

                    <div>
                       <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Tanggal Masuk</p>
                       <p className="font-bold text-lg">{formatTanggal(selectedKitir.created_at)}</p>
                    </div>
                 </div>

                 <div className="mt-12 pt-8 border-t-2 border-slate-200 text-center">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Peringatan</p>
                    <p className="text-sm font-medium text-slate-600">Simpan kitir ini dengan baik. Nomor pengajuan digunakan untuk melacak status surat atau saat mengambil surat fisik di tata usaha fakultas.</p>
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
