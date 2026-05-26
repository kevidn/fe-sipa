"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

interface User {
  nama_lengkap: string;
  nim: string;
  program_studi: string;
  semester: string;
  email: string;
  phone_number: string;
}

interface Pengajuan {
  id: number;
  nomor_surat: string;
  jenis_surat: string;
  file_url: string;
  user: User;
}

export default function WorkspaceVerifikasi() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<Pengajuan | null>(null);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = useState('');
  const [catatan, setCatatan] = useState('');
  const [dynamicChecklist, setDynamicChecklist] = useState<{ id: string; label: string; checked: boolean }[]>([]);
  const [processing, setProcessing] = useState<'Diterima Tendik' | 'Ditolak' | null>(null);

  const allChecked = dynamicChecklist.length > 0 ? dynamicChecklist.every(item => item.checked) : false;

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
        if (result.data && result.data.file_url) {
          try {
            const parsed = JSON.parse(result.data.file_url);
            setDocuments(parsed);
            const keys = Object.keys(parsed);
            if (keys.length > 0) {
              setActiveTab(keys[0]);
            }
          } catch (e) {
            console.warn("file_url is not a JSON string", result.data.file_url);
            setDocuments({ "Dokumen Pendukung": result.data.file_url });
            setActiveTab("Dokumen Pendukung");
          }
        }
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

  useEffect(() => {
    if (Object.keys(documents).length > 0) {
      const items: { id: string; label: string; checked: boolean }[] = [];
      Object.keys(documents).forEach((docName) => {
        if (docName.toLowerCase().includes("mahasiswa") || docName.toLowerCase().includes("ktm")) {
          items.push(
            { id: `${docName}_berlaku`, label: `${docName} masih berlaku`, checked: false },
            { id: `${docName}_foto`, label: `Foto & data pada ${docName} jelas`, checked: false }
          );
        } else if (docName.toLowerCase().includes("krs") || docName.toLowerCase().includes("rencana studi")) {
          items.push(
            { id: `${docName}_aktif`, label: `${docName} semester berjalan aktif`, checked: false },
            { id: `${docName}_valid`, label: `Tanda tangan/persetujuan pada ${docName} lengkap`, checked: false }
          );
        } else if (docName.toLowerCase().includes("transkrip")) {
          items.push(
            { id: `${docName}_sah`, label: `${docName} sah & berstempel resmi`, checked: false },
            { id: `${docName}_ipk`, label: `IPK pada ${docName} sesuai syarat`, checked: false }
          );
        } else {
          items.push(
            { id: `${docName}_valid`, label: `Dokumen ${docName} valid & terbaca`, checked: false },
            { id: `${docName}_asli`, label: `Keaslian berkas ${docName} sesuai`, checked: false }
          );
        }
      });
      // Always add general checks:
      items.push(
        { id: `status_aktif`, label: `Status mahasiswa aktif di sistem`, checked: false },
        { id: `bebas_tunggakan`, label: `Bebas dari tunggakan administrasi`, checked: false }
      );
      setDynamicChecklist(items);
    }
  }, [documents]);

  const handleToggleCheck = (idCheck: string) => {
    setDynamicChecklist(prev => prev.map(item => item.id === idCheck ? { ...item, checked: !item.checked } : item));
  };

  const handleProcess = async (status: 'Diterima Tendik' | 'Ditolak') => {
    if (status === 'Diterima Tendik' && !allChecked) {
      alert('Harap centang semua checklist sebelum memverifikasi!');
      return;
    }
    if (status === 'Ditolak' && !catatan.trim()) {
      alert('Alasan penolakan wajib diisi di Catatan Revisi!');
      return;
    }

    setProcessing(status);
    try {
      const token = localStorage.getItem('sipa_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/surat/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, catatan })
      });

      if (res.ok) {
        router.push('/dashboard/tendik/antrian');
      } else {
        const errData = await res.json();
        alert(`Gagal: ${errData.error || 'Terjadi kesalahan sistem.'}`);
      }
    } catch (err: any) {
      console.error('Gagal memproses verifikasi:', err);
      alert(`Error: ${err.message || 'Koneksi gagal.'}`);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return <div className="p-10 text-center font-bold">Memuat Workspace...</div>;
  if (!data) return <div className="p-10 text-center font-bold">Data tidak ditemukan</div>;

  return (
    <div className="h-screen flex flex-col -m-8 overflow-hidden bg-slate-900">
      {/* Top Header */}
      <div className="bg-white px-8 py-4 flex items-center justify-between border-b border-slate-100 shrink-0">
         <div className="flex flex-col">
            <Link href="/dashboard/tendik/antrian" className="text-emerald-600 font-bold text-xs flex items-center gap-1 mb-1">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
               Kembali ke Dashboard
            </Link>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">Workspace Verifikasi Berkas</h1>
            <p className="text-[10px] font-medium text-slate-400 mt-1">Tinjau dan verifikasi dokumen persyaratan pengajuan surat</p>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Document Viewer */}
        <div className="flex-1 flex flex-col bg-slate-800 p-6">
           <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {Object.keys(documents).map((docName) => (
                <button 
                  key={docName}
                  onClick={() => setActiveTab(docName)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shrink-0
                    ${activeTab === docName ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}
                  `}
                >
                  {docName}
                </button>
              ))}
           </div>
           
           <div className="flex-1 bg-white rounded-3xl flex flex-col items-center justify-center p-6 overflow-hidden shadow-inner relative">
              {documents[activeTab] ? (
                <div className="w-full h-full flex flex-col items-center justify-center relative">
                  <div className="absolute top-4 right-4 z-10">
                    <a 
                      href={documents[activeTab]} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-md hover:bg-emerald-700 transition-all flex items-center gap-1"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      Buka Tab Baru
                    </a>
                  </div>
                  
                  {documents[activeTab].toLowerCase().endsWith('.pdf') ? (
                    <object 
                      data={documents[activeTab]} 
                      type="application/pdf" 
                      className="w-full h-full rounded-2xl border border-slate-100"
                    >
                      <iframe 
                        src={`https://docs.google.com/gview?url=${encodeURIComponent(documents[activeTab])}&embedded=true`}
                        className="w-full h-full rounded-2xl border border-slate-100"
                      />
                    </object>
                  ) : (
                    <img 
                      src={documents[activeTab]} 
                      alt={activeTab} 
                      className="max-w-full max-h-full object-contain rounded-2xl shadow-lg"
                    />
                  )}
                </div>
              ) : (
                <div className="text-slate-400 font-bold text-center">
                  <svg className="mx-auto mb-3 text-slate-300 animate-bounce" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  Tidak ada dokumen terlampir
                </div>
              )}
           </div>
        </div>

        {/* Right: Verification Form */}
        <div className="w-[450px] bg-slate-50 border-l border-slate-200 flex flex-col overflow-y-auto">
           <div className="p-8 space-y-8">
              {/* Header Box */}
              <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4"/><path d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5z"/></svg>
                    </div>
                    <h2 className="text-lg font-black text-slate-800 tracking-tight">Verifikasi Pengajuan</h2>
                 </div>
                 <p className="text-xs font-bold text-slate-400">No. Pengajuan: <span className="text-emerald-600">{data.nomor_surat}</span></p>
              </div>

              {/* Data Mahasiswa */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Data Mahasiswa
                 </h3>
                 <div className="grid grid-cols-2 gap-y-4">
                    <div className="col-span-2">
                       <p className="text-[10px] font-black text-slate-300 uppercase leading-none">Nama Lengkap</p>
                       <p className="text-xs font-bold text-slate-700 mt-1">{data.user.nama_lengkap}</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-300 uppercase leading-none">NIM</p>
                       <p className="text-xs font-bold text-slate-700 mt-1">{data.user.nim}</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-300 uppercase leading-none">Semester</p>
                       <p className="text-xs font-bold text-slate-700 mt-1">{data.user.semester} (Enam)</p>
                    </div>
                    <div className="col-span-2">
                       <p className="text-[10px] font-black text-slate-300 uppercase leading-none">Program Studi</p>
                       <p className="text-xs font-bold text-slate-700 mt-1">{data.user.program_studi}</p>
                    </div>
                    <div className="col-span-2">
                       <p className="text-[10px] font-black text-slate-300 uppercase leading-none">Email</p>
                       <p className="text-xs font-bold text-slate-700 mt-1">{data.user.email}</p>
                    </div>
                    <div className="col-span-2">
                       <p className="text-[10px] font-black text-slate-300 uppercase leading-none">Telepon</p>
                       <p className="text-xs font-bold text-slate-700 mt-1">{data.user.phone_number || '-'}</p>
                    </div>
                 </div>
              </div>

              {/* Checklist */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                    Checklist Persyaratan
                 </h3>
                 <div className="space-y-3">
                    {dynamicChecklist.map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => handleToggleCheck(item.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer
                           ${item.checked ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}
                        `}
                      >
                         <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all
                            ${item.checked ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-300'}
                         `}>
                            {item.checked && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                         </div>
                         <span className={`text-[11px] font-bold ${item.checked ? 'text-emerald-700' : 'text-slate-500'}`}>{item.label}</span>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Catatan Revision */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Catatan Revisi (Opsional)</h3>
                 <textarea 
                    className="w-full bg-slate-50 border-none rounded-xl p-4 text-xs font-medium focus:ring-2 focus:ring-emerald-500/10 min-h-[100px]"
                    placeholder="Tuliskan catatan jika ada dokumen yang perlu diperbaiki..."
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                 />
              </div>

              {/* Buttons */}
              <div className="space-y-3 pb-4">
                 <button 
                    disabled={!allChecked || processing !== null}
                    onClick={() => handleProcess('Diterima Tendik')}
                    className={`w-full py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all
                       ${allChecked && processing === null ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-200 hover:bg-emerald-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
                    `}
                 >
                    {processing === 'Diterima Tendik' ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    )}
                    {processing === 'Diterima Tendik' ? 'MEMPROSES VERIFIKASI...' : 'Verifikasi & Proses'}
                 </button>
                 <button 
                    disabled={processing !== null}
                    onClick={() => handleProcess('Ditolak')}
                    className={`w-full py-4 rounded-2xl bg-white border-2 font-black text-xs transition-all flex items-center justify-center gap-2
                       ${processing !== null ? 'border-slate-100 text-slate-400 cursor-not-allowed' : 'border-red-100 text-red-500 hover:bg-red-50'}
                    `}
                 >
                    {processing === 'Ditolak' ? (
                      <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : null}
                    {processing === 'Ditolak' ? 'MENOLAK PENGAJUAN...' : 'Tolak Pengajuan'}
                 </button>
                 
                 {!allChecked && (
                   <div className="flex items-center gap-2 bg-amber-50 p-4 rounded-xl border border-amber-100">
                      <svg className="text-amber-600" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                      <p className="text-[10px] font-black text-amber-700 uppercase tracking-tight leading-none">Harap centang semua checklist sebelum memverifikasi</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
