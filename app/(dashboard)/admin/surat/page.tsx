"use client";

import { useState, useEffect } from 'react';
import CustomSelect from '@/components/CustomSelect';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

interface JenisSurat {
  id: number;
  kode: string;
  kode_sifat: string;
  kode_klasifikasi: string;
  nama: string;
  sla: string;
  persyaratan: string;
  status: string;
}

export default function ManajemenJenisSurat() {
  const [data, setData] = useState<JenisSurat[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ nama: '', kode_sifat: 'B', kode_klasifikasi: 'KM', sla: '1', persyaratan: '', status: 'Aktif' });

  // Lock body scroll when the modal is open
  useBodyScrollLock(isModalOpen);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('sipa_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jenis-surat`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setFormData({ nama: '', kode_sifat: 'B', kode_klasifikasi: 'KM', sla: '1', persyaratan: '', status: 'Aktif' });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: JenisSurat) => {
    // Parse SLA number from string (e.g., "2 Hari Kerja" -> "2")
    const slaNum = item.sla.split(' ')[0] || '1';
    setFormData({ nama: item.nama, kode_sifat: item.kode_sifat || 'B', kode_klasifikasi: item.kode_klasifikasi || 'KM', sla: slaNum, persyaratan: item.persyaratan, status: item.status });
    setSelectedId(item.id);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('sipa_token');
      const payload = {
        nama: formData.nama,
        kode_sifat: formData.kode_sifat,
        kode_klasifikasi: formData.kode_klasifikasi,
        sla: `${formData.sla} Hari Kerja`,
        persyaratan: formData.persyaratan,
        status: formData.status
      };

      const url = isEdit 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/jenis-surat/${selectedId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/jenis-surat`;

      const method = isEdit ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(payload)
      });
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus jenis surat ini?')) return;
    try {
      const token = localStorage.getItem('sipa_token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jenis-surat/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (item: JenisSurat) => {
    try {
      const token = localStorage.getItem('sipa_token');
      const newStatus = item.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jenis-surat/${item.id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          nama: item.nama,
          kode_sifat: item.kode_sifat,
          kode_klasifikasi: item.kode_klasifikasi,
          sla: item.sla,
          persyaratan: item.persyaratan,
          status: newStatus
        })
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-8 font-poppins pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Manajemen Jenis Surat</h1>
          <p className="text-slate-400 font-medium text-sm mt-1">Kelola jenis surat, SLA, dan persyaratan dokumen</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-emerald-600/20 active:scale-95 transition-all text-sm flex items-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Tambah Jenis Surat
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-4 px-6 w-16">No</th>
                <th className="py-4 px-6">Nama Jenis Surat</th>
                <th className="py-4 px-6 w-32">SLA (Hari)</th>
                <th className="py-4 px-6">Persyaratan</th>
                <th className="py-4 px-6 w-32">Status</th>
                <th className="py-4 px-6 w-24 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.map((item, index) => {
                const reqArray = item.persyaratan.split(',').map(r => r.trim()).filter(r => r);
                const displayReqs = reqArray.slice(0, 2);
                const extraReqs = reqArray.length - 2;
                const isAktif = item.status === 'Aktif';

                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-100">{index + 1}</td>
                    <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-100">{item.nama}</td>
                    <td className="py-4 px-6">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-500 text-xs font-bold">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {item.sla.replace(/Kerja/gi, '').trim().toLowerCase()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2 items-center flex-wrap">
                        {displayReqs.map((req, i) => (
                          <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold">
                            {req}
                          </span>
                        ))}
                        {extraReqs > 0 && (
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-lg text-xs font-bold">
                            +{extraReqs}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div 
                          onClick={() => toggleStatus(item)}
                          className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${isAktif ? 'bg-slate-800 dark:bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isAktif ? 'right-1' : 'left-1'}`}></div>
                        </div>
                        <span className={`text-xs font-bold ${isAktif ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}`}>
                          {item.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleOpenEdit(item)} className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50 transition-all flex items-center justify-center">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-red-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all flex items-center justify-center">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl p-8 relative animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
              {isEdit ? 'Edit Jenis Surat' : 'Tambah Jenis Surat Baru'}
            </h2>
            <p className="text-slate-400 text-sm font-medium mt-1 mb-6">
              {isEdit ? 'Ubah konfigurasi jenis surat dan SLA' : 'Buat jenis surat baru dengan konfigurasi SLA'}
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nama Jenis Surat</label>
                <input 
                  type="text" 
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  required
                  placeholder="Contoh: Surat Keterangan Aktif Kuliah" 
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-100 font-medium placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Kode Sifat</label>
                  <input 
                    type="text" 
                    value={formData.kode_sifat}
                    onChange={(e) => setFormData({...formData, kode_sifat: e.target.value})}
                    placeholder="Contoh: B (Biasa)" 
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-100 font-medium placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Kode Klasifikasi</label>
                  <input 
                    type="text" 
                    value={formData.kode_klasifikasi}
                    onChange={(e) => setFormData({...formData, kode_klasifikasi: e.target.value})}
                    placeholder="Contoh: KM (Kemahasiswaan)" 
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-100 font-medium placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">SLA (Hari Kerja)</label>
                <CustomSelect 
                  value={formData.sla}
                  onChange={(val) => setFormData({...formData, sla: val})}
                  options={[
                    { value: '1', label: '1 Hari Kerja' },
                    { value: '2', label: '2 Hari Kerja' },
                    { value: '3', label: '3 Hari Kerja' },
                    { value: '4', label: '4 Hari Kerja' },
                    { value: '5', label: '5 Hari Kerja' }
                  ]}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Persyaratan Dokumen</label>
                <input 
                  type="text" 
                  value={formData.persyaratan}
                  onChange={(e) => setFormData({...formData, persyaratan: e.target.value})}
                  placeholder="Pisahkan dengan koma" 
                  className="w-full px-4 py-3 rounded-xl border-none bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
                <p className="text-xs text-slate-400 font-medium mt-1">Contoh: KTM Aktif, Bukti Pembayaran UKT, Surat Pernyataan</p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <div 
                  onClick={() => setFormData({...formData, status: formData.status === 'Aktif' ? 'Nonaktif' : 'Aktif'})}
                  className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${formData.status === 'Aktif' ? 'bg-slate-800 dark:bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.status === 'Aktif' ? 'right-1' : 'left-1'}`}></div>
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Aktifkan jenis surat ini</span>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-2"
                >
                  {isEdit ? 'Simpan Perubahan' : (
                    <>
                      <span className="text-xl leading-none -mt-1">+</span> Tambah Jenis Surat
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
