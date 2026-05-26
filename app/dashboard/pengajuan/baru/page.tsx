"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface JenisSurat {
  id: number;
  nama: string;
  sla_hari: number;
  persyaratan: string;
  is_active: boolean;
}

export default function AjukanSuratBaru() {
  const router = useRouter();
  const [letterTypes, setLetterTypes] = useState<JenisSurat[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState<{ show: boolean, type: 'success' | 'error', message: string }>({ show: false, type: 'success', message: '' });

  // Form State
  const [semester, setSemester] = useState('');
  const [keperluan, setKeperluan] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File | null }>({});

  const getRequirements = (letterName: string, backendPersyaratan?: string): string[] => {
    if (backendPersyaratan && backendPersyaratan.trim()) {
      return backendPersyaratan.split(',').map(s => s.trim());
    }
    switch (letterName) {
      case 'Surat Keterangan Masih Kuliah':
        return ['Kartu Tanda Mahasiswa', 'Kartu Rencana Studi'];
      case 'Surat Ijin Survei Penelitian (Skripsi)':
        return ['Kartu Tanda Mahasiswa', 'Transkrip Nilai'];
      case 'Surat Tunjangan/Pensiun/Akses':
        return ['Kartu Tanda Mahasiswa', 'Kartu Rencana Studi'];
      case 'Surat Keterangan Tidak Menerima Beasiswa':
        return ['Kartu Tanda Mahasiswa', 'Transkrip Nilai'];
      case 'Surat Rekomendasi Beasiswa':
        return ['Kartu Tanda Mahasiswa', 'Kartu Rencana Studi', 'Transkrip Nilai'];
      case 'Surat Keterangan Kelakuan Baik':
        return ['Kartu Tanda Mahasiswa', 'Transkrip Nilai'];
      default:
        return ['Kartu Tanda Mahasiswa'];
    }
  };

  const requirements = getRequirements(selectedLetter || '', letterTypes.find(l => l.nama === selectedLetter)?.persyaratan);

  useEffect(() => {
    const userDataStr = localStorage.getItem('sipa_user');
    if (userDataStr) {
      setUser(JSON.parse(userDataStr));
    }
    
    // Fetch Jenis Surat (FR032)
    const fetchJenisSurat = async () => {
      const fallbackJenisSurat: JenisSurat[] = [
        { id: 1, nama: 'Surat Keterangan Masih Kuliah', sla_hari: 3, persyaratan: 'Kartu Tanda Mahasiswa, Kartu Rencana Studi', is_active: true },
        { id: 2, nama: 'Surat Ijin Survei Penelitian (Skripsi)', sla_hari: 5, persyaratan: 'Kartu Tanda Mahasiswa, Transkrip Nilai', is_active: true },
        { id: 3, nama: 'Surat Tunjangan/Pensiun/Akses', sla_hari: 3, persyaratan: 'Kartu Tanda Mahasiswa, Kartu Rencana Studi', is_active: true },
        { id: 4, nama: 'Surat Keterangan Tidak Menerima Beasiswa', sla_hari: 3, persyaratan: 'Kartu Tanda Mahasiswa, Transkrip Nilai', is_active: true },
        { id: 5, nama: 'Surat Rekomendasi Beasiswa', sla_hari: 3, persyaratan: 'Kartu Tanda Mahasiswa, Kartu Rencana Studi, Transkrip Nilai', is_active: true },
        { id: 6, nama: 'Surat Keterangan Kelakuan Baik', sla_hari: 3, persyaratan: 'Kartu Tanda Mahasiswa, Transkrip Nilai', is_active: true }
      ];

      try {
        const token = localStorage.getItem('sipa_token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jenis-surat`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const list = (data.data || []).filter((item: JenisSurat) => item.is_active);
          setLetterTypes(list.length > 0 ? list : fallbackJenisSurat);
        } else {
          setLetterTypes(fallbackJenisSurat);
        }
      } catch (error) {
        console.error('Failed to fetch jenis surat', error);
        setLetterTypes(fallbackJenisSurat);
      }
    };
    fetchJenisSurat();
  }, []);

  const handleFileChange = (requirement: string, file: File | null) => {
    setUploadedFiles(prev => ({
      ...prev,
      [requirement]: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLetter || !semester || !keperluan) {
      setShowModal({ show: true, type: 'error', message: 'Mohon lengkapi semua field yang wajib diisi.' });
      return;
    }

    const missingFiles = requirements.filter(req => !uploadedFiles[req]);
    if (missingFiles.length > 0) {
      setShowModal({ show: true, type: 'error', message: `Mohon unggah semua dokumen persyaratan: ${missingFiles.join(', ')}.` });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('sipa_token');
      const uploadedUrls: { [key: string]: string } = {};

      for (const req of requirements) {
        const fileToUpload = uploadedFiles[req];
        if (fileToUpload) {
          const formData = new FormData();
          formData.append('file', fileToUpload);
          
          const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          });

          if (!uploadRes.ok) {
            const errData = await uploadRes.json();
            throw new Error(errData.error || `Gagal mengunggah berkas ${req}.`);
          }

          const uploadData = await uploadRes.json();
          uploadedUrls[req] = uploadData.data.file_url;
        }
      }

      const payload = {
        jenis_surat: selectedLetter,
        keperluan: keperluan,
        semester: semester,
        file_url: JSON.stringify(uploadedUrls)
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/surat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Gagal mengirim pengajuan surat.');
      }

      setShowModal({ show: true, type: 'success', message: 'Pengajuan surat berhasil dikirim! Silakan cek riwayat pengajuan Anda secara berkala.' });
      
    } catch (err: any) {
      setShowModal({ show: true, type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    if (showModal.type === 'success') {
      router.push('/dashboard/mahasiswa');
    } else {
      setShowModal({ ...showModal, show: false });
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Success/Error Modal Popup */}
      {showModal.show && (
        <div className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center p-6">
          <div className="fixed inset-0 w-screen h-screen bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={closeModal}></div>
          <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 text-center border border-slate-100 dark:border-slate-800">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 ${showModal.type === 'success' ? 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400'}`}>
              {showModal.type === 'success' ? (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              ) : (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              )}
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2">{showModal.type === 'success' ? 'Berhasil!' : 'Terjadi Kesalahan'}</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">{showModal.message}</p>
            <button 
              onClick={closeModal}
              className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all active:scale-95 ${showModal.type === 'success' ? 'bg-sipa-green shadow-sipa-green/20' : 'bg-red-500 shadow-red-500/20'}`}
            >
              {showModal.type === 'success' ? 'KEMBALI KE DASHBOARD' : 'COBA LAGI'}
            </button>
          </div>
        </div>
      )}

      {/* Back Link */}
      <Link 
        href="/dashboard/mahasiswa" 
        className="inline-flex items-center gap-2 text-sipa-green font-bold hover:gap-3 transition-all group"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        Kembali ke Dashboard
      </Link>

      {/* Hero Card */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50 overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="bg-sipa-green p-10 flex items-center gap-8">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Ajukan Surat Baru</h2>
            <p className="text-white/80 font-medium mt-1">Isi formulir dengan lengkap dan benar</p>
          </div>
        </div>

        <div className="p-10">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-6 px-2">
            Jenis Surat <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {letterTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedLetter(type.nama)}
                className={`flex items-start gap-5 p-6 rounded-3xl border-2 text-left transition-all duration-300 group
                  ${selectedLetter === type.nama 
                    ? 'border-sipa-green bg-sipa-green/[0.03] dark:bg-sipa-green/5 shadow-lg shadow-sipa-green/[0.05]' 
                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
              >
                <div className="mt-1 flex-shrink-0">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedLetter === type.nama ? 'border-sipa-green bg-sipa-green' : 'border-slate-300'}`}>
                    {selectedLetter === type.nama && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                  </div>
                </div>
                <div>
                  <h3 className={`font-bold transition-colors ${selectedLetter === type.nama ? 'text-sipa-green' : 'text-slate-800 dark:text-slate-200'}`}>
                    {type.nama}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold mt-1.5 uppercase tracking-wide">
                    Estimasi: {(type as any).sla || `${type.sla_hari} hari kerja`}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Dynamic Form */}
          {selectedLetter && (
            <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Nama Lengkap</label>
                  <input 
                    type="text" 
                    value={user?.nama_lengkap || ''} 
                    readOnly 
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-6 py-4 text-slate-500 dark:text-slate-400 font-bold focus:outline-none cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">NIM</label>
                  <input 
                    type="text" 
                    value={user?.username || ''} 
                    readOnly 
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-6 py-4 text-slate-500 dark:text-slate-400 font-bold focus:outline-none cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Program Studi</label>
                  <input 
                    type="text" 
                    value={user?.program_studi || 'Pendidikan Teknologi Informasi'} 
                    readOnly 
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-6 py-4 text-slate-500 dark:text-slate-400 font-bold focus:outline-none cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Semester <span className="text-red-500">*</span></label>
                  <select 
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-sipa-green/20 focus:border-sipa-green outline-none transition-all appearance-none"
                    required
                  >
                    <option value="" className="dark:bg-slate-900">Pilih Semester</option>
                    {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(s => (
                      <option key={s} value={s.toString()} className="dark:bg-slate-900">Semester {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Keperluan <span className="text-red-500">*</span></label>
                <textarea 
                  value={keperluan}
                  onChange={(e) => setKeperluan(e.target.value)}
                  placeholder="Jelaskan keperluan pengajuan surat..."
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-slate-800 dark:text-slate-200 font-bold focus:ring-2 focus:ring-sipa-green/20 focus:border-sipa-green outline-none transition-all min-h-[150px]"
                  required
                />
              </div>

              <div className="space-y-6">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 block">Dokumen Pendukung Wajib</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {requirements.map((req) => (
                    <div key={req} className="flex flex-col gap-2">
                      <span className="text-xs font-black text-slate-500 dark:text-slate-400 px-1">{req} <span className="text-red-500">*</span></span>
                      <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2rem] p-6 flex flex-col items-center justify-center gap-2 hover:border-sipa-green/50 hover:bg-sipa-green/[0.01] dark:hover:bg-sipa-green/5 transition-all cursor-pointer relative group">
                        <input 
                          type="file" 
                          onChange={(e) => handleFileChange(req, e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          required
                        />
                        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-sipa-green transition-colors">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-xs text-slate-600 dark:text-slate-300">
                            {uploadedFiles[req] ? (uploadedFiles[req] as File).name : `Klik untuk upload ${req}`}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">PDF, JPG, PNG, DOC, DOCX (Max 5MB)</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 rounded-[2rem] p-8 space-y-3">
                <h4 className="text-blue-800 dark:text-blue-300 font-black text-xs uppercase tracking-widest">Catatan Penting:</h4>
                <ul className="text-sm text-blue-700/80 dark:text-blue-400/80 font-medium space-y-2 list-disc list-inside">
                  <li>Pastikan semua data yang diisi sudah benar</li>
                  <li>Anda akan menerima email konfirmasi setelah pengajuan berhasil</li>
                  <li>Kitir digital sebagai bukti pengajuan akan langsung diterbitkan</li>
                  <li>Estimasi waktu proses sesuai dengan SLA yang berlaku</li>
                </ul>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => router.back()}
                  className="px-10 py-4 rounded-2xl font-black text-sm text-slate-400 hover:text-slate-600 transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-sipa-green text-white px-12 py-4 rounded-2xl font-black text-sm shadow-xl shadow-sipa-green/20 hover:bg-sipa-green-dark transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center gap-3"
                >
                  {loading ? 'MEMPROSES...' : 'AJUKAN SURAT'}
                  {!loading && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
