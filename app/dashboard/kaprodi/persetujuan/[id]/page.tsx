"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface User {
  id_user: string;
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
  komentar: string;
  sla_status: string;
  deadline_sla: string;
  created_at: string;
  updated_at: string;
  processor?: User;
}

export default function DetailPersetujuan() {
  const { id } = useParams();
  const [data, setData] = useState<Pengajuan | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [alasanPenolakan, setAlasanPenolakan] = useState('');

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
      } else {
         // Mock data for preview if API fails
         setData({
            id: Number(id),
            id_user: '123',
            user: {
               id_user: '123',
               nama_lengkap: 'Hafiyyan Lintang Arizaki',
               nim: '25051204267',
               program_studi: 'S1 Sistem Informasi',
               email: 'hafiyyan@mhs.unesa.ac.id',
               phone_number: '081234567890'
            },
            nomor_surat: 'SKM-2024-201',
            jenis_surat: 'Surat Keterangan Masih Kuliah',
            keperluan: 'Untuk keperluan beasiswa LPDP',
            semester: '6',
            status: 'Menunggu Persetujuan Kaprodi',
            komentar: '-',
            sla_status: 'Aman',
            deadline_sla: '2024-06-01T10:00:00Z',
            created_at: '2024-05-29T10:00:00Z',
            updated_at: '2024-05-29T10:00:00Z'
         });
      }
    } catch (err) {
      console.error('Gagal mengambil detail:', err);
      // Mock data fallback
      setData({
         id: Number(id),
         id_user: '123',
         user: {
            id_user: '123',
            nama_lengkap: 'Hafiyyan Lintang Arizaki',
            nim: '25051204267',
            program_studi: 'S1 Sistem Informasi',
            email: 'hafiyyan@mhs.unesa.ac.id',
            phone_number: '081234567890'
         },
         nomor_surat: 'SKM-2024-201',
         jenis_surat: 'Surat Keterangan Masih Kuliah',
         keperluan: 'Untuk keperluan beasiswa LPDP',
         semester: '6',
         status: 'Menunggu Persetujuan Kaprodi',
         komentar: '-',
         sla_status: 'Aman',
         deadline_sla: '2024-06-01T10:00:00Z',
         created_at: '2024-05-29T10:00:00Z',
         updated_at: '2024-05-29T10:00:00Z'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const formatTanggalFull = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) + " WIB";
  };

  const getSlaInfo = () => {
    if (!data) return null;
    const isTerlampaui = data.sla_status === 'Terlampaui';
    
    // Hitung keterlambatan dummy atau nyata jika ada logic, untuk UI saja saat ini
    const delayDays = isTerlampaui ? "2 hari" : "-";

    return (
      <div className={`p-8 rounded-[2rem] border space-y-6 ${isTerlampaui ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isTerlampaui ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
             {isTerlampaui ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
             ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
             )}
          </div>
          <div>
            <h2 className={`text-lg font-black ${isTerlampaui ? 'text-red-700' : 'text-emerald-700'}`}>
              {isTerlampaui ? 'SLA Terlampaui!' : 'SLA Aman'}
            </h2>
            <p className={`text-sm font-medium mt-1 ${isTerlampaui ? 'text-red-800/80' : 'text-emerald-800/80'}`}>
              {isTerlampaui 
                ? `Pengajuan ini telah melampaui target SLA sebesar ${delayDays}` 
                : 'Pengajuan ini diproses sesuai dengan target waktu SLA yang ditentukan.'}
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
           <div className="flex justify-between items-center text-sm">
             <span className={`font-medium ${isTerlampaui ? 'text-red-700/70' : 'text-emerald-700/70'}`}>Target SLA:</span>
             <span className={`font-bold ${isTerlampaui ? 'text-red-900' : 'text-emerald-900'}`}>
               {data.deadline_sla ? new Date(data.deadline_sla).toLocaleDateString('id-ID', {day:'2-digit', month:'long', year:'numeric'}) : '-'}
             </span>
           </div>
           <div className="flex justify-between items-center text-sm">
             <span className={`font-medium ${isTerlampaui ? 'text-red-700/70' : 'text-emerald-700/70'}`}>Status Saat Ini:</span>
             <span className={`font-bold ${isTerlampaui ? 'text-red-900' : 'text-emerald-900'}`}>{data.status}</span>
           </div>
           {isTerlampaui && (
             <div className="flex justify-between items-center text-sm">
               <span className={`font-medium text-red-700/70`}>Keterlambatan:</span>
               <span className={`font-bold text-red-900`}>{delayDays}</span>
             </div>
           )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Memuat Detail Pengajuan...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Data pengajuan tidak ditemukan</h2>
        <Link href="/dashboard/kaprodi/persetujuan" className="text-emerald-500 font-bold mt-4 inline-block">Kembali ke Persetujuan Surat</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header / Breadcrumb */}
      <div>
        <Link 
          href="/dashboard/kaprodi/persetujuan" 
          className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold hover:text-slate-800 dark:hover:text-slate-200 transition-all group mb-4"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Kembali ke Persetujuan Surat
        </Link>
        <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Detail Pengajuan</h1>
        <p className="text-slate-500 font-medium text-lg mt-1">Review detail sebelum menyetujui pengajuan surat</p>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Nomor Pengajuan: <span className="text-emerald-600 dark:text-emerald-500">{data.nomor_surat}</span></h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg mt-1">Jenis Surat: <span className="text-slate-700 dark:text-slate-200">{data.jenis_surat}</span></p>
          </div>
          <div className="flex gap-3">
             <button onClick={() => setShowRejectModal(true)} className="px-6 py-3 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 font-bold transition-colors shadow-sm text-sm">
                Tolak Pengajuan
             </button>
             <button onClick={() => setShowApproveModal(true)} className="px-6 py-3 rounded-2xl bg-[#00d053] text-white hover:bg-[#00b548] font-bold shadow-lg shadow-[#00d053]/30 transition-all active:scale-95 text-sm flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Setujui Pengajuan
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Data Mahasiswa */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800">
             <div className="flex items-center gap-3 mb-8">
               <div className="text-emerald-500">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
               </div>
               <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">Data Mahasiswa</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400">Nama Lengkap</p>
                  <p className="text-slate-800 dark:text-slate-200 font-medium">{data.user?.nama_lengkap || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400">NIM</p>
                  <p className="text-slate-800 dark:text-slate-200 font-medium">{data.user?.nim || data.user?.id_user || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400">Program Studi</p>
                  <p className="text-slate-800 dark:text-slate-200 font-medium">{data.user?.program_studi || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400">Semester</p>
                  <p className="text-slate-800 dark:text-slate-200 font-medium">Semester {data.semester || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400">Email</p>
                  <p className="text-slate-800 dark:text-slate-200 font-medium">{data.user?.email || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400">No. Telepon</p>
                  <p className="text-slate-800 dark:text-slate-200 font-medium">{data.user?.phone_number || '-'}</p>
                </div>
             </div>
          </div>

          {/* Detail Pengajuan */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800">
             <div className="flex items-center gap-3 mb-8">
               <div className="text-emerald-500">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
               </div>
               <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">Detail Pengajuan</h3>
             </div>
             
             <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Tujuan Penggunaan</p>
                  <p className="text-slate-800 dark:text-slate-200 font-medium">{data.keperluan || '-'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Keterangan Tambahan</p>
                  <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">{data.komentar || '-'}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="space-y-2 flex items-center gap-3">
                    <div className="text-slate-400"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Tanggal Diajukan</p>
                      <p className="text-slate-800 dark:text-slate-200 font-medium text-sm mt-0.5">{formatTanggalFull(data.created_at)}</p>
                    </div>
                  </div>
                  <div className="space-y-2 flex items-center gap-3">
                    <div className="text-slate-400"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Target SLA</p>
                      <p className="text-slate-800 dark:text-slate-200 font-medium text-sm mt-0.5">{data.deadline_sla ? new Date(data.deadline_sla).toLocaleDateString('id-ID', {day:'2-digit', month:'long', year:'numeric'}) : '-'}</p>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Aksi Persetujuan Card */}
          <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-8 rounded-[2rem] border border-emerald-100 dark:border-emerald-900/50 space-y-4">
             <div className="flex items-center gap-3">
               <div className="text-emerald-600 dark:text-emerald-500">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
               </div>
               <h2 className="text-lg font-black text-emerald-900 dark:text-emerald-400">Aksi Persetujuan</h2>
             </div>
             <p className="text-emerald-800/80 dark:text-emerald-500/80 text-sm font-medium leading-relaxed mb-4">
               Silakan tinjau detail pengajuan di samping sebelum mengambil keputusan. Pengajuan yang disetujui akan diteruskan ke Tendik.
             </p>
             <div className="flex flex-col gap-3">
               <button onClick={() => setShowApproveModal(true)} className="w-full py-3.5 rounded-xl bg-[#00d053] text-white font-bold hover:bg-[#00b548] shadow-lg shadow-[#00d053]/30 transition-all active:scale-95">Setujui Pengajuan</button>
               <button onClick={() => setShowRejectModal(true)} className="w-full py-3.5 rounded-xl bg-white dark:bg-slate-800 border-2 border-red-100 dark:border-red-900/50 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">Tolak Pengajuan</button>
             </div>
          </div>

          {/* SLA Info Card */}
          {getSlaInfo()}

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
