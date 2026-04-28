"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const letterTypes = [
  {
    id: 'kuliah',
    title: 'Surat Keterangan Masih Kuliah',
    estimation: 'Estimasi: 1-2 hari kerja',
    icon: (selected: boolean) => (
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selected ? 'border-sipa-green bg-sipa-green' : 'border-slate-300'}`}>
        {selected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
      </div>
    )
  },
  {
    id: 'skripsi',
    title: 'Surat Ijin Survei Penelitian (Skripsi)',
    estimation: 'Estimasi: 3-5 hari kerja',
    icon: (selected: boolean) => (
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selected ? 'border-sipa-green bg-sipa-green' : 'border-slate-300'}`}>
        {selected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
      </div>
    )
  },
  {
    id: 'tunjangan',
    title: 'Surat Tunjangan/Pensiun/Akses',
    estimation: 'Estimasi: 2-3 hari kerja',
    icon: (selected: boolean) => (
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selected ? 'border-sipa-green bg-sipa-green' : 'border-slate-300'}`}>
        {selected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
      </div>
    )
  },
  {
    id: 'beasiswa-tidak',
    title: 'Surat Keterangan Tidak Menerima Beasiswa',
    estimation: 'Estimasi: 1-2 hari kerja',
    icon: (selected: boolean) => (
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selected ? 'border-sipa-green bg-sipa-green' : 'border-slate-300'}`}>
        {selected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
      </div>
    )
  },
  {
    id: 'beasiswa-rek',
    title: 'Surat Rekomendasi Beasiswa',
    estimation: 'Estimasi: 3-5 hari kerja',
    icon: (selected: boolean) => (
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selected ? 'border-sipa-green bg-sipa-green' : 'border-slate-300'}`}>
        {selected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
      </div>
    )
  },
  {
    id: 'skck',
    title: 'Surat Keterangan Kelakuan Baik',
    estimation: 'Estimasi: 1-2 hari kerja',
    icon: (selected: boolean) => (
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selected ? 'border-sipa-green bg-sipa-green' : 'border-slate-300'}`}>
        {selected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
      </div>
    )
  }
];

export default function AjukanSuratBaru() {
  const router = useRouter();
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState<{ show: boolean, type: 'success' | 'error', message: string }>({ show: false, type: 'success', message: '' });

  // Form State
  const [semester, setSemester] = useState('');
  const [keperluan, setKeperluan] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const userDataStr = localStorage.getItem('sipa_user');
    if (userDataStr) {
      setUser(JSON.parse(userDataStr));
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLetter || !semester || !keperluan) {
      setShowModal({ show: true, type: 'error', message: 'Mohon lengkapi semua field yang wajib diisi.' });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('sipa_token');
      const letterTypeTitle = letterTypes.find(t => t.id === selectedLetter)?.title || selectedLetter;

      const payload = {
        jenis_surat: letterTypeTitle,
        keperluan: keperluan,
        semester: semester,
        file_url: file ? file.name : '' 
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
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={closeModal}></div>
          <div className="relative bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 text-center">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 ${showModal.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {showModal.type === 'success' ? (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              ) : (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              )}
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">{showModal.type === 'success' ? 'Berhasil!' : 'Terjadi Kesalahan'}</h3>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">{showModal.message}</p>
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
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
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
                onClick={() => setSelectedLetter(type.id)}
                className={`flex items-start gap-5 p-6 rounded-3xl border-2 text-left transition-all duration-300 group
                  ${selectedLetter === type.id 
                    ? 'border-sipa-green bg-sipa-green/[0.03] shadow-lg shadow-sipa-green/[0.05]' 
                    : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                  }`}
              >
                <div className="mt-1 flex-shrink-0">
                  {type.icon(selectedLetter === type.id)}
                </div>
                <div>
                  <h3 className={`font-bold transition-colors ${selectedLetter === type.id ? 'text-sipa-green' : 'text-slate-800'}`}>
                    {type.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold mt-1.5 uppercase tracking-wide">
                    {type.estimation}
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
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-500 font-bold focus:outline-none cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">NIM</label>
                  <input 
                    type="text" 
                    value={user?.username || ''} 
                    readOnly 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-500 font-bold focus:outline-none cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Program Studi</label>
                  <input 
                    type="text" 
                    value={user?.program_studi || 'Pendidikan Teknologi Informasi'} 
                    readOnly 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-500 font-bold focus:outline-none cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Semester <span className="text-red-500">*</span></label>
                  <select 
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-slate-800 font-bold focus:ring-2 focus:ring-sipa-green/20 focus:border-sipa-green outline-none transition-all appearance-none"
                    required
                  >
                    <option value="">Pilih Semester</option>
                    {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(s => (
                      <option key={s} value={s.toString()}>Semester {s}</option>
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
                  className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-slate-800 font-bold focus:ring-2 focus:ring-sipa-green/20 focus:border-sipa-green outline-none transition-all min-h-[150px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Dokumen Pendukung (opsional)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-10 flex flex-col items-center justify-center gap-4 hover:border-sipa-green/50 hover:bg-sipa-green/[0.02] transition-all cursor-pointer relative group">
                  <input 
                    type="file" 
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-sipa-green transition-colors">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-slate-600">{file ? file.name : 'Klik untuk upload file'}</p>
                    <p className="text-xs text-slate-400 font-medium mt-1">PDF, JPG, PNG (Max 5MB)</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-[2rem] p-8 space-y-3">
                <h4 className="text-blue-800 font-black text-xs uppercase tracking-widest">Catatan Penting:</h4>
                <ul className="text-sm text-blue-700/80 font-medium space-y-2 list-disc list-inside">
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
