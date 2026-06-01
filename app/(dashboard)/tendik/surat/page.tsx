"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CustomSelect from '@/components/CustomSelect';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

interface JenisSurat {
  id: number;
  kode: string;
  nama: string;
  sla: string;
  template_file: string;
  status: string;
  persyaratan: string;
  total_pengajuan: number;
}

export default function ManajemenJenisSurat() {
  const [list, setList] = useState<JenisSurat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState<'add' | 'edit' | 'view' | 'delete' | null>(null);
  const [selected, setSelected] = useState<JenisSurat | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    kode: '',
    nama: '',
    sla: '1-2 hari kerja',
    template_file: '',
    persyaratan: 'KTM, Transkrip Nilai Terakhir'
  });

  useBodyScrollLock(showModal !== null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sipa_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jenis-surat`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setList(data.data);
      }
    } catch (err) {
      console.error('Gagal mengambil data jenis surat:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (type: 'add' | 'edit' | 'view' | 'delete', item?: JenisSurat) => {
    setSelected(item || null);
    if (item && (type === 'edit' || type === 'view')) {
      setFormData({
        kode: item.kode,
        nama: item.nama,
        sla: item.sla,
        template_file: item.template_file,
        persyaratan: item.persyaratan
      });
    } else {
      setFormData({ kode: '', nama: '', sla: '1-2 hari kerja', template_file: '', persyaratan: 'KTM, Transkrip Nilai Terakhir' });
    }
    setSelectedFile(null);
    setShowModal(type);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('sipa_token');

    let finalTemplateFile = formData.template_file;
    if (selectedFile) {
      setIsUploading(true);
      const uploadData = new FormData();
      uploadData.append('file', selectedFile);
      
      try {
        const upRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: uploadData
        });
        
        if (upRes.ok) {
          const upJson = await upRes.json();
          finalTemplateFile = upJson.data.file_url;
        } else {
          const upErr = await upRes.json();
          alert(upErr.error || 'Gagal mengunggah file template');
          setIsUploading(false);
          return;
        }
      } catch (err) {
        alert('Terjadi kesalahan saat mengunggah file');
        setIsUploading(false);
        return;
      }
    }

    const payload = { ...formData, template_file: finalTemplateFile };

    const method = showModal === 'add' ? 'POST' : 'PUT';
    const url = showModal === 'add' 
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/jenis-surat` 
      : `${process.env.NEXT_PUBLIC_API_URL}/api/jenis-surat/${selected?.id}`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowModal(null);
        setSelectedFile(null);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || 'Terjadi kesalahan');
      }
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('sipa_token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jenis-surat/${selected?.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setShowModal(null);
        fetchData();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <Link href="/tendik" className="text-emerald-600 font-bold text-xs flex items-center gap-1 mb-2">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
             Kembali ke Dashboard
          </Link>
          <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Manajemen Jenis Surat</h1>
          <p className="text-slate-400 font-medium">Kelola template, SLA, dan persyaratan dokumen</p>
        </div>
        <button 
          onClick={() => handleOpenModal('add')}
          className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Tambah Jenis Surat
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Jenis Surat', value: list.length, color: 'bg-blue-500', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' },
          { label: 'Aktif', value: list.filter(l => l.status === 'Aktif').length, color: 'bg-emerald-500', icon: 'M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z' },
          { label: 'Template Tersedia', value: list.filter(l => l.template_file).length, color: 'bg-purple-500', icon: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' },
          { label: 'Total Pengajuan', value: list.reduce((acc, curr) => acc + curr.total_pengajuan, 0), color: 'bg-orange-500', icon: 'M12 8v4l3 3m6-3a9 9 0 1 1-9-9 9 9 0 0 1 6 2.23L21 7M21 3v4h-4' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors">
             <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d={stat.icon}/></svg>
                </div>
                <p className="font-bold text-slate-500 dark:text-slate-400">{stat.label}</p>
             </div>
             <p className="text-3xl font-black text-slate-800 dark:text-slate-100">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50 overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors">
         <div className="p-8 border-b border-slate-50 dark:border-slate-800/50">
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">Daftar Jenis Surat ({list.length})</h2>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kode</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Surat</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">SLA</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Template</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Total Pengajuan</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Aksi</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {loading ? (
                     <tr><td colSpan={7} className="py-20 text-center font-bold text-slate-400 uppercase tracking-widest text-xs">Menyinkronkan Data...</td></tr>
                   ) : list.map((item) => (
                     <tr key={item.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-all group">
                        <td className="px-8 py-6 font-black text-slate-800 dark:text-slate-200 text-sm">{item.kode}</td>
                        <td className="px-8 py-6 font-bold text-slate-700 dark:text-slate-300 text-sm">{item.nama}</td>
                        <td className="px-8 py-6 text-center">
                           <div className="flex items-center justify-center gap-2 text-slate-500 font-medium text-xs">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                              {item.sla}
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           {item.template_file ? (
                              <button 
                                 onClick={() => window.open(item.template_file, '_blank')}
                                 className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold text-xs flex items-center gap-2 transition-colors"
                              >
                                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/></svg>
                                 Unduh Template
                              </button>
                           ) : (
                              <span className="text-xs text-slate-400 italic font-medium">Tidak ada</span>
                           )}
                        </td>
                        <td className="px-8 py-6 text-center font-black text-slate-800 dark:text-slate-200 text-sm">{item.total_pengajuan}</td>
                        <td className="px-8 py-6 text-center">
                           <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 whitespace-nowrap inline-block text-center min-w-[110px]">
                              {item.status}
                           </span>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center justify-center gap-4">
                              <button onClick={() => handleOpenModal('view', item)} className="text-blue-500 hover:text-blue-700 transition-colors">
                                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                              </button>
                              <button onClick={() => handleOpenModal('edit', item)} className="text-emerald-600 hover:text-emerald-800 transition-colors">
                                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                              </button>
                              <button onClick={() => handleOpenModal('delete', item)} className="text-red-500 hover:text-red-700 transition-colors">
                                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* --- MODALS --- */}

      {/* ADD / EDIT MODAL */}
      {(showModal === 'add' || showModal === 'edit') && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(null)}></div>
           <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg max-h-[90vh] flex flex-col rounded-[2.5rem] overflow-hidden shadow-2xl transition-colors">
              <div className="bg-emerald-600 px-6 sm:px-10 py-5 sm:py-6 text-white shrink-0">
                 <h2 className="text-xl font-black tracking-tight">{showModal === 'add' ? 'Tambah Jenis Surat Baru' : 'Edit Jenis Surat'}</h2>
              </div>
              <div className="p-6 sm:p-10 space-y-5 sm:space-y-6 overflow-y-auto">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kode Surat *</label>
                    <input 
                       type="text" 
                       placeholder="Contoh: SKM"
                       className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-700 dark:text-slate-200"
                       value={formData.kode}
                       onChange={(e) => setFormData({...formData, kode: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Surat *</label>
                    <input 
                       type="text" 
                       placeholder="Nama lengkap jenis surat"
                       className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-700 dark:text-slate-200"
                       value={formData.nama}
                       onChange={(e) => setFormData({...formData, nama: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SLA (Service Level Agreement) *</label>
                    <CustomSelect 
                       value={formData.sla}
                       onChange={(val) => setFormData({...formData, sla: val})}
                       options={[
                         { value: '1-2 hari kerja', label: '1-2 hari kerja' },
                         { value: '3-5 hari kerja', label: '3-5 hari kerja' },
                         { value: '1-3 hari kerja', label: '1-3 hari kerja' }
                       ]}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">File Template *</label>
                    <div className="flex flex-col gap-2">
                       <input 
                          type="file" 
                          accept=".doc,.docx,.pdf"
                          className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-700 dark:text-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200 cursor-pointer"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                       />
                       {formData.template_file && !selectedFile && (
                          <div className="px-5 py-3 rounded-xl bg-blue-50 border border-blue-100 text-xs font-medium text-blue-700 flex items-center gap-2">
                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                             Template saat ini: {formData.template_file.split('/').pop()}
                          </div>
                       )}
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Persyaratan Dokumen *</label>
                    <input 
                       type="text" 
                       placeholder="Contoh: KTM, Transkrip Nilai Terakhir (pisahkan dengan koma)"
                       className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-700 dark:text-slate-200"
                       value={formData.persyaratan}
                       onChange={(e) => setFormData({...formData, persyaratan: e.target.value})}
                    />
                    <span className="text-[10px] text-slate-400 block font-medium">Pisahkan persyaratan dengan tanda koma (e.g. KTM, Kartu Rencana Studi)</span>
                 </div>
                 <div className="flex gap-4 pt-6">
                    <button onClick={() => setShowModal(null)} className="flex-1 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">Batal</button>
                    <button 
                       onClick={handleSubmit} 
                       disabled={isUploading}
                       className="flex-1 py-4 rounded-2xl bg-emerald-600 text-white font-black text-xs shadow-xl shadow-emerald-200 dark:shadow-emerald-900 hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                       {isUploading ? (
                          <>
                             <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                             Mengunggah...
                          </>
                       ) : 'Simpan'}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* VIEW DETAIL MODAL */}
      {showModal === 'view' && selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(null)}></div>
           <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg max-h-[90vh] flex flex-col rounded-[2.5rem] overflow-hidden shadow-2xl transition-colors">
              <div className="bg-emerald-600 px-6 sm:px-10 py-5 sm:py-6 text-white shrink-0">
                 <h2 className="text-xl font-black tracking-tight">Detail Jenis Surat</h2>
              </div>
              <div className="p-6 sm:p-10 space-y-6 sm:space-y-8 overflow-y-auto">
                 <div className="grid grid-cols-2 gap-8">
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kode Surat</p>
                       <p className="font-black text-slate-800 dark:text-slate-100 text-lg">{selected.kode}</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SLA</p>
                       <p className="font-bold text-slate-700 dark:text-slate-300">{selected.sla}</p>
                    </div>
                    <div className="col-span-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Surat</p>
                       <p className="font-bold text-slate-800 dark:text-slate-100">{selected.nama}</p>
                    </div>
                    <div className="col-span-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Template File</p>
                       <div className="text-emerald-600 font-black text-sm flex items-center gap-2 mt-1">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                          {selected.template_file}
                       </div>
                    </div>
                    <div className="col-span-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Persyaratan Dokumen</p>
                       <div className="space-y-2">
                          {selected.persyaratan.split(',').map((p, i) => (
                             <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                                <svg className="text-emerald-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                {p.trim()}
                             </div>
                          ))}
                       </div>
                    </div>
                    <div className="col-span-2 flex items-center justify-between pt-4">
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Pengajuan</p>
                          <p className="font-black text-slate-800 dark:text-slate-100">{selected.total_pengajuan} pengajuan</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                          <p className="text-emerald-600 font-black flex items-center gap-1 justify-end">
                             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                             {selected.status}
                          </p>
                       </div>
                    </div>
                 </div>
                 <button onClick={() => setShowModal(null)} className="w-full py-4 rounded-2xl bg-slate-800 dark:bg-slate-700 text-white font-black text-xs hover:bg-slate-700 dark:hover:bg-slate-600 transition-all">Tutup</button>
              </div>
           </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showModal === 'delete' && selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(null)}></div>
           <div className="relative bg-white dark:bg-slate-900 w-full max-w-sm max-h-[90vh] flex flex-col rounded-[2.5rem] p-6 sm:p-10 text-center shadow-2xl transition-colors overflow-y-auto">
              <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                 <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2">Hapus Jenis Surat?</h2>
              <p className="text-sm font-medium text-slate-400 dark:text-slate-500 leading-relaxed mb-8">
                 Jenis surat <span className="font-bold text-slate-800 dark:text-slate-200">"{selected.nama}"</span> akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => setShowModal(null)} className="py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">Batal</button>
                 <button onClick={handleDelete} className="py-4 rounded-2xl bg-red-600 text-white font-black text-xs shadow-xl shadow-red-200 dark:shadow-red-900 hover:bg-red-700 transition-all">Ya, Hapus</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
