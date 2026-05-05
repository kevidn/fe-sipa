"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function VerificationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [surat, setSurat] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('KTM');
  const [checklist, setChecklist] = useState({
    ktm_valid: false,
    foto_jelas: false,
    data_sesuai: false,
    status_aktif: false,
    no_tunggakan: false,
  });
  const [revisionNote, setRevisionNote] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem('sipa_token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/surat/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSurat(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  const allChecked = Object.values(checklist).every(v => v === true);

  const handleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateStatus = async (newStatus: string) => {
    if (newStatus === 'Diterima Tendik' && !allChecked) return;
    if (newStatus === 'Ditolak' && !revisionNote) {
      alert('Mohon isi catatan revisi jika ingin menolak pengajuan.');
      return;
    }

    setIsVerifying(true);
    try {
      const token = localStorage.getItem('sipa_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/surat/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus,
          catatan: revisionNote || 'Dokumen telah diverifikasi dan valid.'
        })
      });

      if (res.ok) {
        alert(`Pengajuan berhasil ${newStatus === 'Ditolak' ? 'ditolak' : 'diverifikasi'}!`);
        router.push('/dashboard/tendik');
      } else {
        const err = await res.json();
        alert(err.error || 'Gagal memperbarui status');
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan koneksi');
    } finally {
      setIsVerifying(false);
    }
  };

  const tabs = [
    { id: 'KTM', name: 'Kartu Tanda Mahasiswa' },
    { id: 'TRANSKRIP', name: 'Transkrip Nilai' },
    { id: 'KRS', name: 'Kartu Rencana Studi' },
    { id: 'KTM_BACK', name: 'KTM (Belakang)' },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-bold animate-pulse uppercase text-xs tracking-widest">Memuat Data Pengajuan...</p>
      </div>
    );
  }

  if (!surat) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-2">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h2 className="text-xl font-black text-slate-800">Pengajuan Tidak Ditemukan</h2>
        <Link href="/dashboard/tendik" className="text-emerald-600 font-bold hover:underline">Kembali ke Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <Link 
            href="/dashboard/tendik" 
            className="inline-flex items-center gap-2 text-emerald-600 font-bold text-xs mb-4 group"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </div>
            Kembali ke Dashboard
          </Link>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Workspace Verifikasi Berkas</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">Tinjau dan verifikasi dokumen persyaratan pengajuan surat</p>
        </div>
        
        <div className="px-5 py-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ID Pengajuan</p>
          <p className="text-sm font-black text-emerald-600">#{surat.nomor_surat}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left: Document Viewer */}
        <div className="xl:col-span-8 flex flex-col gap-4">
          {/* Tabs */}
          <div className="flex gap-2 p-1.5 bg-slate-900 rounded-2xl overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all
                  ${activeTab === tab.id 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Viewer Area */}
          <div className="relative aspect-[4/3] bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-800 flex flex-col shadow-2xl">
            <div className="flex-1 flex items-center justify-center p-8">
              {/* Document Display based on active tab */}
              <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl p-8 animate-in fade-in zoom-in duration-500 overflow-hidden">
                {surat.file_url ? (
                   <img 
                    src={surat.file_url} 
                    alt={activeTab} 
                    className="w-full h-auto object-contain"
                   />
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-300 gap-4">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <p className="font-bold uppercase tracking-widest text-xs">Dokumen Tidak Tersedia</p>
                  </div>
                )}
              </div>
            </div>

            {/* Viewer Controls */}
            <div className="p-4 bg-slate-900/80 backdrop-blur-md border-t border-slate-800 flex justify-center items-center gap-6">
              <button className="text-slate-400 hover:text-white transition-colors p-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              </button>
              <span className="text-xs font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">100%</span>
              <button className="text-slate-400 hover:text-white transition-colors p-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              </button>
              <div className="h-6 w-px bg-slate-800 mx-2"></div>
              <div className="flex items-center gap-4">
                <button className="text-slate-400 hover:text-white disabled:opacity-30 p-2"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg></button>
                <span className="text-xs font-bold text-slate-300">1 / 1</span>
                <button className="text-slate-400 hover:text-white disabled:opacity-30 p-2"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg></button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Data & Verification */}
        <div className="xl:col-span-4 space-y-6">
          {/* Info Card */}
          <div className="bg-emerald-50 dark:bg-emerald-500/5 rounded-[2.5rem] p-8 border border-emerald-100 dark:border-emerald-500/10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div>
                <h3 className="font-black text-slate-800 dark:text-white text-sm">Verifikasi Mahasiswa</h3>
                <p className="text-xs font-bold text-emerald-600">{surat.jenis_surat}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white/60 dark:bg-slate-900/40 rounded-2xl p-4 border border-white dark:border-slate-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Identitas Pemohon</h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nama Lengkap</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{surat.user?.nama_lengkap || '-'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">NIM</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{surat.user?.nim || '-'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Semester</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{surat.semester || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h3 className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-[0.2em]">Checklist Persyaratan</h3>
            </div>

            <div className="space-y-3 mb-8">
              {[
                { key: 'ktm_valid', label: 'KTM masih berlaku' },
                { key: 'foto_jelas', label: 'Foto pada KTM jelas dan sesuai' },
                { key: 'data_sesuai', label: 'Data mahasiswa sesuai dengan sistem' },
                { key: 'status_aktif', label: 'Status mahasiswa aktif' },
                { key: 'no_tunggakan', label: 'Tidak ada tunggakan administrasi' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleCheck(item.key as any)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left
                    ${checklist[item.key as keyof typeof checklist]
                      ? 'bg-emerald-50/50 border-emerald-500/20 text-emerald-700 dark:bg-emerald-500/5' 
                      : 'bg-slate-50 border-transparent text-slate-500 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
                    ${checklist[item.key as keyof typeof checklist]
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : 'border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {checklist[item.key as keyof typeof checklist] && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    )}
                  </div>
                  <span className="text-sm font-bold tracking-tight">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Revision Note */}
            <div className="space-y-2 mb-8">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Catatan Revisi (Opsional)</label>
              <textarea
                placeholder="Tuliskan catatan jika ada dokumen yang perlu diperbaiki..."
                className="w-full h-32 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:bg-white dark:focus:bg-slate-950 focus:border-emerald-500/20 outline-none transition-all font-medium text-slate-600 dark:text-slate-300 text-sm resize-none"
                value={revisionNote}
                onChange={(e) => setRevisionNote(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => updateStatus('Diproses')}
                disabled={!allChecked || isVerifying}
                className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-sm transition-all
                  ${allChecked 
                    ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 active:scale-[0.98]' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800'
                  }`}
              >
                {isVerifying ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    Verifikasi & Proses
                  </>
                )}
              </button>
              <button
                onClick={() => updateStatus('Ditolak')}
                disabled={isVerifying}
                className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-sm text-red-500 border-2 border-red-100 dark:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/5 transition-all active:scale-[0.98]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                Tolak Pengajuan
              </button>
            </div>

            {!allChecked && (
              <div className="mt-6 flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-500/5 rounded-2xl border border-amber-100 dark:border-amber-500/10">
                <div className="text-amber-500">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </div>
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-wider">Harap centang semua checklist sebelum memverifikasi</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
