"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { printKitir } from '@/utils/printKitir';

interface User {
  id_user: string;
  nama_lengkap: string;
  nim: string;
  program_studi: string;
}

interface Pengajuan {
  id: number;
  id_user: string;
  user: User;
  nomor_surat: string;
  jenis_surat: string;
  keperluan: string;
  semester: string;
  status: 'Selesai' | 'Diproses' | 'Diterima Tendik' | 'Ditolak';
  file_url?: string;
  komentar?: string;
  created_at: string;
  updated_at: string;
}

export default function DetailPengajuan() {
  const { id } = useParams();
  const [data, setData] = useState<Pengajuan | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sipa_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/surat/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const result = await res.json();
        setData(result.data);
      }
    } catch (err) {
      console.error('Gagal mengambil detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const handleDownloadSurat = () => {
    if (!data || data.status !== 'Selesai') return;
    const content = `SURAT KETERANGAN AKADEMIK
------------------------------------------
Nomor Surat     : ${data.nomor_surat}
Jenis Surat     : ${data.jenis_surat}
Nama Mahasiswa  : ${data.user.nama_lengkap}
NIM             : ${data.user.nim}
Program Studi   : ${data.user.program_studi}
Keperluan       : ${data.keperluan}
Status          : SELESAI

Surat ini telah diverifikasi secara digital.
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SURAT-${data.nomor_surat}.txt`;
    a.click();
  };

  const handleDownloadKitir = () => {
    if (!data) return;
    printKitir(data);
  };

  const handlePreview = () => {
    if (!data || data.status !== 'Selesai') return;
    alert(`Pratinjau Surat ${data.nomor_surat}\n\nJenis: ${data.jenis_surat}\nNama: ${data.user.nama_lengkap}\nNIM: ${data.user.nim}`);
  };

  const formatTanggalFull = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) + " WIB";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-sipa-green border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Memuat Detail Pengajuan...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">Pengajuan tidak ditemukan</h2>
        <Link href="/dashboard/pengajuan" className="text-sipa-green font-bold mt-4 inline-block">Kembali ke Riwayat</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header / Breadcrumb */}
      <div>
        <Link 
          href="/dashboard/pengajuan" 
          className="inline-flex items-center gap-2 text-slate-400 font-bold hover:text-sipa-green transition-all group mb-4"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Kembali ke Riwayat Pengajuan
        </Link>
      </div>

      {/* Main Status Card */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Nomor Pengajuan: {data.nomor_surat}</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg mt-1">Jenis Surat: {data.jenis_surat}</p>
          </div>
          <div className={`px-6 py-2.5 rounded-2xl flex items-center gap-2 font-black uppercase tracking-widest text-sm
            ${data.status === 'Selesai' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 
              data.status === 'Diproses' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' : 
              data.status === 'Diterima Tendik' ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400' : 
              data.status === 'Diajukan' ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400' : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'}
          `}>
            {(data.status === 'Selesai' || data.status === 'Diterima Tendik' || data.status === 'Diproses') && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            )}
            {data.status}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Timeline & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline Section */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-sipa-green/10 flex items-center justify-center text-sipa-green">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">Timeline Proses</h2>
            </div>

            <div className="space-y-0 relative">
              {/* Vertical Line */}
              <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-100 dark:bg-slate-800"></div>

              {/* Step 1: Diajukan */}
              <div className="relative pl-14 pb-10">
                <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center text-white z-10">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-slate-800 dark:text-slate-200 text-lg">Diajukan</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Pengajuan surat berhasil dibuat</p>
                    <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">{formatTanggalFull(data.created_at)}</p>
                  </div>
                  <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full">Selesai</span>
                </div>
              </div>

              {/* Step 2: Diterima Tendik */}
              <div className="relative pl-14 pb-10">
                <div className={`absolute left-0 top-0 w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center z-10
                  ${(data.status === 'Diterima Tendik' || data.status === 'Diproses' || data.status === 'Selesai') ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600'}
                `}>
                  {(data.status === 'Diterima Tendik' || data.status === 'Diproses' || data.status === 'Selesai') ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : <div className="w-2 h-2 rounded-full bg-current"></div>}
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-slate-800 dark:text-slate-200 text-lg">Diterima Tendik</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Pengajuan diterima oleh petugas akademik</p>
                    {(data.status === 'Diterima Tendik' || data.status === 'Diproses' || data.status === 'Selesai') && (
                       <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">{formatTanggalFull(data.updated_at)}</p>
                    )}
                  </div>
                  {(data.status === 'Diterima Tendik' || data.status === 'Diproses' || data.status === 'Selesai') && (
                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full">Selesai</span>
                  )}
                </div>
              </div>

              {/* Step 3: Diproses */}
              <div className="relative pl-14 pb-10">
                <div className={`absolute left-0 top-0 w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center z-10
                  ${(data.status === 'Diproses' || data.status === 'Selesai') ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600'}
                `}>
                  {(data.status === 'Diproses' || data.status === 'Selesai') ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : <div className="w-2 h-2 rounded-full bg-current"></div>}
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-slate-800 dark:text-slate-200 text-lg">Diproses</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Surat sedang dalam proses pembuatan</p>
                  </div>
                  {(data.status === 'Diproses' || data.status === 'Selesai') && (
                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full">Selesai</span>
                  )}
                </div>
              </div>

              {/* Step 4: Selesai */}
              <div className="relative pl-14">
                <div className={`absolute left-0 top-0 w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center z-10
                  ${data.status === 'Selesai' ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600'}
                `}>
                  {data.status === 'Selesai' ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : <div className="w-2 h-2 rounded-full bg-current"></div>}
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-slate-800 dark:text-slate-200 text-lg">Selesai</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Surat telah selesai dan siap diunduh</p>
                    {data.status === 'Selesai' && (
                       <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">{formatTanggalFull(data.updated_at)}</p>
                    )}
                  </div>
                  {data.status === 'Selesai' && (
                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full">Selesai</span>
                  )}
                </div>
              </div>
            </div>

            {data.status === 'Selesai' && (
              <div className="mt-8 bg-emerald-50 dark:bg-emerald-500/10 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <h4 className="font-black text-emerald-800 dark:text-emerald-400">Pengajuan Selesai</h4>
                  <p className="text-emerald-700/80 dark:text-emerald-300/80 text-sm font-medium mt-1">
                    Surat {data.jenis_surat} Anda telah selesai diproses dan siap untuk diunduh. Silakan klik tombol "Unduh Surat Keterangan" di panel sebelah kanan.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Details Table Section */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 transition-colors duration-300">
             <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-8">Detail Pengajuan</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Pemohon</p>
                  <p className="text-slate-800 dark:text-slate-200 font-bold">{data.user.nama_lengkap}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NIM</p>
                  <p className="text-slate-800 dark:text-slate-200 font-bold">{data.user.nim || data.user.id_user || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Program Studi</p>
                  <p className="text-slate-800 dark:text-slate-200 font-bold">{data.user.program_studi || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Semester</p>
                  <p className="text-slate-800 dark:text-slate-200 font-bold">Semester {data.semester}</p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tujuan Penggunaan</p>
                  <p className="text-slate-800 dark:text-slate-200 font-bold">{data.keperluan}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Actions & Stats */}
        <div className="space-y-6">
          {/* Action Sidebar */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 space-y-4 transition-colors duration-300">
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-4">Aksi Pengajuan</h2>
            
            <button 
              onClick={handleDownloadSurat}
              disabled={data.status !== 'Selesai'}
              className="w-full py-4 px-6 rounded-2xl bg-sipa-green text-white font-black flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 disabled:shadow-none"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Unduh Surat Keterangan
            </button>

            <button 
               onClick={handlePreview}
               disabled={data.status !== 'Selesai'}
               className="w-full py-4 px-6 rounded-2xl bg-white dark:bg-slate-800 border-2 border-blue-500 text-blue-600 font-black flex items-center justify-center gap-3 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all disabled:border-slate-200 dark:disabled:border-slate-700 disabled:text-slate-400 disabled:bg-transparent"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              Preview Surat
            </button>

            <button 
               onClick={handleDownloadKitir}
               className="w-full py-4 px-6 rounded-2xl bg-white dark:bg-slate-800 border-2 border-sipa-green text-sipa-green font-black flex items-center justify-center gap-3 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              Unduh Ulang Kitir
            </button>

            <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 font-bold leading-relaxed px-4">
              File yang diunduh dalam format PDF dan telah dilengkapi dengan QR Code untuk verifikasi keaslian
            </p>
          </div>

          {/* Info Status Card */}
          <div className="bg-emerald-50/50 dark:bg-emerald-500/5 p-8 rounded-[2rem] border border-emerald-100 dark:border-emerald-500/20 space-y-6">
            <h2 className="text-lg font-black text-slate-800 dark:text-slate-200">Informasi Status</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Status Pengajuan:</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400">{data.status}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Waktu Proses:</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400">1 hari</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400 font-medium">SLA Status:</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400">Tepat Waktu</span>
              </div>
            </div>
          </div>

          {/* Help Card */}
          <div className="bg-blue-50/50 dark:bg-blue-500/5 p-8 rounded-[2rem] border border-blue-100 dark:border-blue-500/20 space-y-4">
            <h2 className="text-lg font-black text-blue-900 dark:text-blue-300">Butuh Bantuan?</h2>
            <p className="text-blue-800/70 dark:text-blue-400/70 text-sm font-medium">
              Jika ada pertanyaan atau kendala terkait surat ini, hubungi:
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <span className="text-sm font-bold text-blue-900 dark:text-blue-300">(031) 8280009</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <span className="text-sm font-bold text-blue-900 dark:text-blue-300">akademik@unesa.ac.id</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
