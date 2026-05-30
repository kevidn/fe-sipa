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

export default function DetailMonitoring() {
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
        <div className="w-12 h-12 border-4 border-sipa-green border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Memuat Data Monitoring...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">Data pengajuan tidak ditemukan</h2>
        <Link href="/dashboard/kaprodi/monitoring" className="text-sipa-green font-bold mt-4 inline-block">Kembali ke Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header / Breadcrumb */}
      <div>
        <Link 
          href="/dashboard/kaprodi/monitoring" 
          className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 transition-all group mb-4"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Kembali ke Dashboard
        </Link>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Detail Pengajuan (Monitoring)</h1>
        <p className="text-slate-500 font-medium text-lg mt-1">Laporan read-only untuk monitoring dan analisis SLA</p>
      </div>

      {/* Main Card */}
      <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Nomor Pengajuan: <span className="text-slate-800">{data.nomor_surat}</span></h2>
            <p className="text-slate-500 font-medium text-lg mt-1"><span className="text-slate-400">Jenis Surat:</span> {data.jenis_surat}</p>
          </div>
          <div className={`px-6 py-3 rounded-2xl flex items-center gap-3 font-bold text-sm border
            ${data.sla_status === 'Terlampaui' ? 'bg-red-50 border-red-200 text-red-600' : 
              data.sla_status === 'Mendekati' ? 'bg-amber-50 border-amber-200 text-amber-600' :
              'bg-emerald-50 border-emerald-200 text-emerald-600'}
          `}>
             <div className="flex flex-col">
               <span className="text-[10px] uppercase tracking-widest opacity-80">SLA Status</span>
               <span>{data.sla_status === 'Terlampaui' ? 'Terlambat' : data.sla_status === 'Mendekati' ? 'Mendekati Batas' : 'Tepat Waktu'}</span>
             </div>
             {data.sla_status === 'Terlampaui' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
             )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Data Mahasiswa */}
          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
             <div className="flex items-center gap-3 mb-8">
               <div className="text-emerald-500">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
               </div>
               <h3 className="text-xl font-black text-slate-800">Data Mahasiswa</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400">Nama Lengkap</p>
                  <p className="text-slate-800 font-medium">{data.user?.nama_lengkap || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400">NIM</p>
                  <p className="text-slate-800 font-medium">{data.user?.nim || data.user?.id_user || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400">Program Studi</p>
                  <p className="text-slate-800 font-medium">{data.user?.program_studi || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400">Semester</p>
                  <p className="text-slate-800 font-medium">Semester {data.semester || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400">Email</p>
                  <p className="text-slate-800 font-medium">{data.user?.email || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400">No. Telepon</p>
                  <p className="text-slate-800 font-medium">{data.user?.phone_number || '-'}</p>
                </div>
             </div>
          </div>

          {/* Detail Pengajuan */}
          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
             <div className="flex items-center gap-3 mb-8">
               <div className="text-emerald-500">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
               </div>
               <h3 className="text-xl font-black text-slate-800">Detail Pengajuan</h3>
             </div>
             
             <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm font-bold text-slate-500">Tujuan Penggunaan</p>
                  <p className="text-slate-800 font-medium">{data.keperluan || '-'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-bold text-slate-500">Keterangan Tambahan</p>
                  <p className="text-slate-800 font-medium leading-relaxed">{data.komentar || '-'}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 pt-4">
                  <div className="space-y-2 flex items-center gap-3">
                    <div className="text-slate-400"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
                    <div>
                      <p className="text-xs font-bold text-slate-500">Tanggal Diajukan</p>
                      <p className="text-slate-800 font-medium text-sm mt-0.5">{formatTanggalFull(data.created_at)}</p>
                    </div>
                  </div>
                  <div className="space-y-2 flex items-center gap-3">
                    <div className="text-slate-400"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
                    <div>
                      <p className="text-xs font-bold text-slate-500">Tanggal Dibutuhkan (Target SLA)</p>
                      <p className="text-slate-800 font-medium text-sm mt-0.5">{data.deadline_sla ? new Date(data.deadline_sla).toLocaleDateString('id-ID', {day:'2-digit', month:'long', year:'numeric'}) : '-'}</p>
                    </div>
                  </div>
                </div>
             </div>
          </div>

          {/* Timeline Proses */}
          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="text-emerald-500">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <h2 className="text-xl font-black text-slate-800">Timeline Proses</h2>
            </div>

            <div className="space-y-0 relative pl-4">
              {/* Vertical Line */}
              <div className="absolute left-[35px] top-4 bottom-10 w-0.5 bg-emerald-200/50"></div>

              {/* Step 1: Diajukan */}
              <div className="relative pl-12 pb-10">
                <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-emerald-500 shadow-md shadow-emerald-200 flex items-center justify-center text-white z-10">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-slate-800 text-lg">Diajukan</h3>
                    <p className="text-slate-500 font-medium text-sm mt-1">oleh {data.user?.nama_lengkap} (Mahasiswa)</p>
                    <p className="text-slate-400 text-xs mt-1 flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {formatTanggalFull(data.created_at)}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">Selesai</span>
                </div>
              </div>

              {/* Step 2: Diterima Tendik */}
              <div className="relative pl-12 pb-10">
                <div className={`absolute left-0 top-0 w-10 h-10 rounded-full shadow-md flex items-center justify-center z-10
                  ${(data.status === 'Diterima Tendik' || data.status === 'Diproses' || data.status === 'Selesai') ? 'bg-emerald-500 shadow-emerald-200 text-white' : 'bg-slate-100 shadow-none text-slate-300'}
                `}>
                  {(data.status === 'Diterima Tendik' || data.status === 'Diproses' || data.status === 'Selesai') ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : <div className="w-2 h-2 rounded-full bg-current"></div>}
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-slate-800 text-lg">Diterima Tendik</h3>
                    <p className="text-slate-500 font-medium text-sm mt-1">oleh {data.processor ? data.processor.nama_lengkap : 'Admin Akademik'} (Tendik)</p>
                    {(data.status === 'Diterima Tendik' || data.status === 'Diproses' || data.status === 'Selesai') && (
                       <p className="text-slate-400 text-xs mt-1 flex items-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          {formatTanggalFull(data.updated_at)}
                       </p>
                    )}
                  </div>
                  {(data.status === 'Diterima Tendik' || data.status === 'Diproses' || data.status === 'Selesai') ? (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">Selesai</span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Pending</span>
                  )}
                </div>
              </div>

              {/* Step 3: Menunggu Diproses */}
              <div className="relative pl-12">
                <div className={`absolute left-0 top-0 w-10 h-10 rounded-full shadow-md flex items-center justify-center z-10
                  ${(data.status === 'Diproses' || data.status === 'Selesai') ? 'bg-emerald-500 shadow-emerald-200 text-white' : 'bg-slate-100 shadow-none text-slate-400'}
                `}>
                  {(data.status === 'Diproses' || data.status === 'Selesai') ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  )}
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-slate-800 text-lg">Menunggu Diproses</h3>
                    <p className="text-slate-500 font-medium text-sm mt-1">oleh -</p>
                  </div>
                  {(data.status === 'Diproses' || data.status === 'Selesai') ? (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">Selesai</span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Pending</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* SLA Info Card */}
          {getSlaInfo()}

          {/* Status Saat Ini */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-4">
             <h2 className="text-lg font-black text-slate-800">Status Saat Ini</h2>
             <div className="inline-block px-4 py-1.5 rounded-full bg-purple-50 text-purple-600 font-black text-sm">
                {data.status}
             </div>
             <p className="text-slate-600 font-medium text-sm leading-relaxed">
               {data.status === 'Diterima Tendik' 
                  ? 'Pengajuan telah diterima oleh Tendik dan menunggu untuk diproses. Terjadi keterlambatan dalam workflow.' 
                  : `Pengajuan saat ini berada pada tahap ${data.status}.`}
             </p>
          </div>

          {/* Catatan Kaprodi Card */}
          <div className="bg-blue-50/50 p-8 rounded-[2rem] border border-blue-100 space-y-4">
             <div className="flex items-center gap-3">
               <div className="text-blue-600">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
               </div>
               <h2 className="text-lg font-black text-blue-900">Catatan Kaprodi</h2>
             </div>
             <p className="text-blue-800/80 text-sm font-medium leading-relaxed">
               Ini adalah halaman monitoring read-only untuk Kaprodi. Anda dapat melihat detail pengajuan dan status SLA, namun tidak dapat melakukan update status. Update status dilakukan oleh Tendik.
             </p>
          </div>

          {/* Penanggung Jawab */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-4">
             <h2 className="text-lg font-black text-slate-800">Penanggung Jawab</h2>
             <div>
               <p className="font-bold text-slate-800">{data.processor ? data.processor.nama_lengkap : 'Dwi Lestari, S.Kom'}</p>
               <p className="text-sm text-slate-500 font-medium">Tenaga Kependidikan</p>
             </div>
             <div className="space-y-2 pt-2">
               <div className="flex items-center gap-3 text-sm">
                 <div className="text-pink-600"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>
                 <span className="font-medium text-slate-600">(031) 8280009 ext. 123</span>
               </div>
               <div className="flex items-center gap-3 text-sm">
                 <div className="text-purple-400"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
                 <span className="font-medium text-slate-600">{data.processor ? data.processor.email : 'dwi.lestari@unesa.ac.id'}</span>
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
