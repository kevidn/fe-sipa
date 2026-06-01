"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import CustomSelect from '@/components/CustomSelect';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

interface User {
  nama_lengkap: string;
  nim: string;
  program_studi: string;
  email: string;
  phone_number: string;
}

interface Pengajuan {
  id: number;
  id_user: string;
  user: User;
  nomor_surat: string;
  jenis_surat: string;
  keperluan: string;
  semester: string;
  status: string;
  sla_status: 'Aman' | 'Mendekati' | 'Terlampaui';
  file_url?: string;
  komentar?: string;
  created_at: string;
  updated_at: string;
  deadline_sla?: string;
}

export default function DetailPengajuanTendik() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<Pengajuan | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [catatan, setCatatan] = useState('');
  const [updating, setUpdating] = useState(false);

  useBodyScrollLock(showUpdateModal);

  const getParsedDocs = (fileUrlString?: string) => {
    if (!fileUrlString) return {};
    try {
      return JSON.parse(fileUrlString);
    } catch (e) {
      return { "Lampiran Dokumen": fileUrlString };
    }
  };

  const handleDownloadAll = () => {
    if (!data?.file_url) return;
    try {
      const docs = JSON.parse(data.file_url);
      Object.entries(docs).forEach(([name, url]) => {
        const a = document.createElement('a');
        a.href = url as string;
        a.target = '_blank';
        a.download = name;
        a.click();
      });
    } catch (e) {
      window.open(data.file_url, '_blank');
    }
  };

  const handleSendEmail = () => {
    if (!data) return;
    const subject = encodeURIComponent(`Informasi Pengajuan Surat ${data.nomor_surat}`);
    const body = encodeURIComponent(`Halo ${data.user.nama_lengkap},\n\nTerkait pengajuan surat Anda (${data.jenis_surat}) dengan nomor ${data.nomor_surat}.\n\nSalam,\nStaf Layanan Akademik`);
    window.location.href = `mailto:${data.user.email}?subject=${subject}&body=${body}`;
  };

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sipa_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/surat/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const result = await res.json();
        setData(result.data);
        setNewStatus(result.data.status);
        setCatatan(result.data.komentar || '');
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

  const handleUpdateStatus = async () => {
    if (newStatus === 'Ditolak' && !catatan.trim()) {
      alert('Alasan penolakan wajib diisi!');
      return;
    }

    setUpdating(true);
    try {
      const token = localStorage.getItem('sipa_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/surat/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus, catatan: catatan })
      });

      if (res.ok) {
        setShowUpdateModal(false);
        fetchDetail();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Gagal memperbarui status');
      }
    } catch (err) {
      console.error('Update status error:', err);
    } finally {
      setUpdating(false);
    }
  };

  const formatTanggalFull = (dateStr: string) => {
    if (!dateStr) return "-";
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
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Memuat Detail Pengajuan...</p>
      </div>
    );
  }

  if (!data) return <div className="text-center py-20 font-bold">Data tidak ditemukan</div>;

  return (
    <>
      {/* Print-Only Style Tag */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          /* Hide all standard screen layout elements */
          aside, nav, header, button, a, footer, .no-print, .shadow-xl, .border-slate-100 {
            display: none !important;
            box-shadow: none !important;
          }
          /* Hide main container completely so we ONLY render the dedicated print document */
          .space-y-6 > *:not(#print-document) {
            display: none !important;
          }
          #print-document {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
            color: black !important;
            padding: 20px !important;
          }
        }
      `}} />

      {/* Official Printed Receipt / Bukti Pengajuan (Clean academic layout) */}
      <div id="print-document" className="hidden font-serif p-8 text-black bg-white max-w-3xl mx-auto border-2 border-slate-200">
         {/* Kop Surat / Academic Letterhead */}
         <div className="text-center border-b-4 border-double border-black pb-4 mb-6">
            <h2 className="text-xl font-bold tracking-wide uppercase">UNIVERSITAS NEGERI SURABAYA</h2>
            <h3 className="text-md font-bold uppercase tracking-widest mt-1">FAKULTAS TEKNIK</h3>
            <p className="text-xs italic font-sans text-slate-500 mt-1">Sistem Informasi Pelayanan Akademik Berbasis Workflow & SLA (SIPA)</p>
         </div>

         {/* Title */}
         <div className="text-center mb-8">
            <h4 className="text-lg font-bold uppercase underline tracking-tight">KAPITIR DIGITAL - BUKTI PENGAJUAN SURAT</h4>
            <p className="text-xs font-sans font-bold text-slate-500 mt-1">Nomor Pengajuan: {data.nomor_surat}</p>
         </div>

         {/* Meta details */}
         <div className="grid grid-cols-2 gap-4 text-xs font-sans mb-6 border-b border-dashed pb-4">
            <div>
               <p><span className="font-bold">Jenis Surat:</span> {data.jenis_surat}</p>
               <p><span className="font-bold">Status Saat Ini:</span> {data.status}</p>
            </div>
            <div className="text-right">
               <p><span className="font-bold">Tanggal Pengajuan:</span> {formatTanggalFull(data.created_at)}</p>
               <p><span className="font-bold">Estimasi SLA:</span> 3 Hari Kerja</p>
            </div>
         </div>

         {/* Data Pemohon */}
         <div className="mb-6">
            <h5 className="text-xs font-sans font-bold uppercase tracking-widest bg-slate-100 p-2 mb-3">I. DATA MAHASISWA (PEMOHON)</h5>
            <table className="w-full text-xs font-sans text-left border-collapse">
               <tbody>
                  <tr className="border-b"><td className="py-2 font-bold w-1/3">Nama Lengkap</td><td className="py-2">{data.user.nama_lengkap}</td></tr>
                  <tr className="border-b"><td className="py-2 font-bold">Nomor Induk Mahasiswa (NIM)</td><td className="py-2">{data.user.nim}</td></tr>
                  <tr className="border-b"><td className="py-2 font-bold">Program Studi</td><td className="py-2">{data.user.program_studi}</td></tr>
                  <tr className="border-b"><td className="py-2 font-bold">Email & Telepon</td><td className="py-2">{data.user.email} / {data.user.phone_number || '-'}</td></tr>
                  <tr className="border-b"><td className="py-2 font-bold">Semester / Kelas</td><td className="py-2">Semester {data.semester}</td></tr>
               </tbody>
            </table>
         </div>

         {/* Detail Pengajuan */}
         <div className="mb-8">
            <h5 className="text-xs font-sans font-bold uppercase tracking-widest bg-slate-100 p-2 mb-3">II. DETAIL PERMOHONAN</h5>
            <div className="text-xs font-serif leading-relaxed border p-4 bg-slate-50/50 min-h-[80px]">
               <p className="font-sans font-bold text-[10px] text-slate-400 uppercase mb-1">Tujuan / Keperluan Penggunaan:</p>
               {data.keperluan}
            </div>
            {data.komentar && (
               <div className="text-xs font-serif leading-relaxed border border-t-0 p-4 bg-slate-50/50">
                  <p className="font-sans font-bold text-[10px] text-slate-400 uppercase mb-1">Catatan Pemrosesan:</p>
                  {data.komentar}
               </div>
            )}
         </div>

         {/* QR verification and stamp */}
         <div className="mt-12 flex justify-between items-start border-t border-dashed pt-6 text-xs font-sans">
            <div className="flex gap-4 items-center">
               <div className="w-20 h-20 bg-slate-100 border-2 border-slate-300 flex items-center justify-center font-bold text-[8px] text-slate-400 text-center uppercase p-1">
                  QR CODE VERIFIKASI DIGITAL
               </div>
               <div>
                  <p className="font-bold text-slate-700">Telah Diverifikasi Secara Digital</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Sistem SIPA Universitas Negeri Surabaya</p>
                  <p className="text-[10px] text-slate-400">Bukti ini sah dikeluarkan oleh fakultas secara elektronik.</p>
               </div>
            </div>
            <div className="text-center w-1/3">
               <p className="text-slate-400 mb-10">Surabaya, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
               <p className="font-bold text-slate-700 underline">Sistem Layanan Akademik</p>
               <p className="text-[10px] text-slate-400">Universitas Negeri Surabaya</p>
            </div>
         </div>
      </div>

      <div className="space-y-6 pb-10 no-print">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <Link 
          href="/tendik" 
          className="inline-flex items-center gap-2 text-slate-400 font-bold hover:text-emerald-600 transition-all group"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Kembali
        </Link>
        <button 
          onClick={() => setShowUpdateModal(true)}
          className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-black text-sm shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"
        >
          Update Status
        </button>
      </div>

      {/* Main Header Card */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Nomor Pengajuan: {data.nomor_surat}</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg mt-1">Jenis Surat: {data.jenis_surat}</p>
          <div className="flex items-center gap-2 mt-4">
             <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap inline-block text-center min-w-[110px]
                ${data.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600' : 
                  data.status === 'Diajukan' ? 'bg-blue-50 text-blue-600' : 
                  data.status === 'Diterima Tendik' ? 'bg-purple-50 text-purple-600' : 
                  data.status === 'Diproses' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}
             `}>
               {data.status}
             </span>
             <span className="text-[10px] text-slate-400 font-bold">Terakhir diperbarui: {formatTanggalFull(data.updated_at)}</span>
          </div>
        </div>
        <div className={`px-5 py-3 rounded-2xl border-2 flex items-center gap-3 font-black text-sm
          ${data.sla_status === 'Terlampaui' ? 'border-red-100 bg-red-50 text-red-600' : 
            data.sla_status === 'Mendekati' ? 'border-amber-100 bg-amber-50 text-amber-600' : 'border-emerald-100 bg-emerald-50 text-emerald-600'}
        `}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <div>
             <p className="text-[10px] uppercase leading-none mb-0.5">Status SLA</p>
             <p className="text-base leading-none">12 jam</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Data Pemohon */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
             <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <h2 className="text-xl font-black text-slate-800 dark:text-white">Data Pemohon</h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Lengkap</p>
                   <p className="text-slate-800 dark:text-slate-200 font-bold">{data.user.nama_lengkap}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NIM</p>
                   <p className="text-slate-800 dark:text-slate-200 font-bold">{data.user.nim}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Program Studi</p>
                   <p className="text-slate-800 dark:text-slate-200 font-bold">{data.user.program_studi}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                   <p className="text-slate-800 dark:text-slate-200 font-bold">{data.user.email}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No. Telepon</p>
                   <p className="text-slate-800 dark:text-slate-200 font-bold">{data.user.phone_number || '-'}</p>
                </div>
             </div>
          </div>

          {/* Detail Pengajuan */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
             <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <h2 className="text-xl font-black text-slate-800 dark:text-white">Detail Pengajuan</h2>
             </div>
             <div className="space-y-8">
                 <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tujuan Penggunaan</p>
                   <p className="text-slate-800 dark:text-slate-200 font-bold">{data.keperluan}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Catatan dari Petugas</p>
                   <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{data.komentar || 'Belum ada catatan'}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal Diajukan</p>
                      <p className="text-slate-800 dark:text-slate-200 font-bold">{formatTanggalFull(data.created_at)}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal Dibutuhkan</p>
                      <p className="text-slate-800 dark:text-slate-200 font-bold">10 April 2024</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Timeline */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
             <h2 className="text-xl font-black text-slate-800 dark:text-white mb-8">Timeline Proses</h2>
             <div className="space-y-8 relative pl-10">
                <div className="absolute left-4 top-1 bottom-1 w-0.5 bg-slate-100"></div>
                
                <div className="relative">
                   <div className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center text-white">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                   </div>
                   <h3 className="font-black text-slate-800 dark:text-slate-200">Diajukan</h3>
                   <p className="text-[10px] text-slate-400 font-bold uppercase">{formatTanggalFull(data.created_at)}</p>
                   <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">oleh {data.user.nama_lengkap}</p>
                </div>

                {data.updated_at !== data.created_at && (
                  <div className="relative">
                    <div className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-blue-500 border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center text-white">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <h3 className="font-black text-slate-800 dark:text-slate-200">{data.status}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{formatTanggalFull(data.updated_at)}</p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">oleh Staf Tata Usaha</p>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Right Col: Sidebar */}
        <div className="space-y-6">
          {/* Dokumen Pendukung */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
             <h2 className="text-lg font-black text-slate-800 dark:text-white mb-6">Dokumen Pendukung</h2>
             <div className="space-y-3">
                {data.file_url && Object.keys(getParsedDocs(data.file_url)).length > 0 ? (
                   Object.entries(getParsedDocs(data.file_url)).map(([name, url]) => (
                     <a 
                       key={name}
                       href={url as string} 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 group hover:bg-white dark:hover:bg-slate-700 hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-all cursor-pointer"
                     >
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                           </div>
                           <div>
                              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{name}</p>
                              <p className="text-[10px] font-medium text-slate-400">Tersedia</p>
                           </div>
                        </div>
                        <svg className="text-slate-300 group-hover:text-emerald-500 transition-colors" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                     </a>
                   ))
                ) : (
                   <p className="text-sm text-slate-400 font-medium text-center py-4">Tidak ada dokumen pendukung</p>
                )}
             </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-emerald-50/50 dark:bg-emerald-500/5 p-8 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-500/10 space-y-4">
             <h2 className="text-lg font-black text-slate-800 dark:text-white mb-4">Quick Actions</h2>
             <button onClick={handleDownloadAll} className="w-full py-3 px-4 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-black hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white transition-all">Download Semua Dokumen</button>
             <button onClick={() => window.print()} className="w-full py-3 px-4 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-black hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white transition-all">Cetak Detail Pengajuan</button>
             <button onClick={handleSendEmail} className="w-full py-3 px-4 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-black hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white transition-all">Kirim Email ke Pemohon</button>
          </div>

          {/* Informasi SLA */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 space-y-4">
             <h2 className="text-lg font-black text-slate-800 dark:text-white mb-4">Informasi SLA</h2>
             <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <span className="text-sm font-medium text-slate-400">Target Penyelesaian:</span>
                   <span className="text-sm font-bold text-slate-800 dark:text-slate-200">3 hari kerja</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-sm font-medium text-slate-400">Sisa Waktu:</span>
                   <span className="text-sm font-bold text-amber-600">12 jam</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-sm font-medium text-slate-400">Status SLA:</span>
                   <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-full">Peringatan</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* --- UPDATE STATUS MODAL --- */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !updating && setShowUpdateModal(false)}></div>
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 dark:border-slate-800">
             <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6">Update Status Pengajuan</h2>
             
             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Pilih Status Baru</label>
                   <CustomSelect 
                      value={newStatus}
                      onChange={(val) => setNewStatus(val)}
                      options={[
                        { value: 'Diajukan', label: 'Diajukan' },
                        { value: 'Diterima Tendik', label: 'Diterima Tendik' },
                        { value: 'Diproses', label: 'Diproses' },
                        { value: 'Selesai', label: 'Selesai' },
                        { value: 'Ditolak', label: 'Ditolak' }
                      ]}
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Catatan / Alasan (Wajib jika ditolak)</label>
                   <textarea 
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-700 dark:text-slate-200 min-h-[120px]"
                      placeholder="Masukkan catatan pemrosesan..."
                      value={catatan}
                      onChange={(e) => setCatatan(e.target.value)}
                   ></textarea>
                </div>

                <div className="flex gap-4 pt-4">
                   <button 
                      onClick={() => setShowUpdateModal(false)}
                      disabled={updating}
                      className="flex-1 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                   >
                      Batal
                   </button>
                   <button 
                      onClick={handleUpdateStatus}
                      disabled={updating}
                      className="flex-1 py-4 rounded-2xl bg-emerald-600 text-white font-black text-sm shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                   >
                      {updating && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                      SIMPAN PERUBAHAN
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
