"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Pengajuan {
  id: number;
  nomor_surat: string;
  jenis_surat: string;
  created_at: string;
  status: string;
  sla_status: string;
  user: {
    nama_lengkap: string;
    nim: string;
  };
}

export default function AntrianTendik() {
  const [antrian, setAntrian] = useState<Pengajuan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [catatan, setCatatan] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchAntrian = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sipa_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/surat`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Tendik can see all
        setAntrian(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAntrian();
  }, []);

  const handleUpdateStatus = async () => {
    if (!selectedId || !newStatus) return;
    if (newStatus === 'Ditolak' && !catatan) {
      alert("Alasan penolakan wajib diisi!");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('sipa_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/surat/${selectedId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus, catatan: catatan })
      });

      if (res.ok) {
        setSelectedId(null);
        setCatatan('');
        setNewStatus('');
        fetchAntrian();
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Antrian Pengajuan</h1>
          <p className="text-slate-400 font-medium">Kelola dan proses surat masuk dari mahasiswa</p>
        </div>
        <button onClick={fetchAntrian} className="bg-white p-4 rounded-2xl shadow-lg border border-slate-100 text-slate-400 hover:text-sipa-green transition-all">
          <svg className={loading ? 'animate-spin' : ''} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6m12-4a9 9 0 0 1-15 6.7L3 16"/>
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="bg-white p-20 rounded-[2.5rem] text-center shadow-xl">
             <div className="w-12 h-12 border-4 border-sipa-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
             <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Memuat Antrian...</p>
          </div>
        ) : antrian.length === 0 ? (
          <div className="bg-white p-20 rounded-[2.5rem] text-center shadow-xl border border-dashed border-slate-200">
             <p className="text-slate-400 font-bold">Tidak ada pengajuan aktif saat ini.</p>
          </div>
        ) : (
          antrian.map((item) => (
            <div key={item.id} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-8 items-center transition-all hover:shadow-2xl hover:border-sipa-green/20 group">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    item.sla_status === 'Terlampaui' ? 'bg-red-50 text-red-500' :
                    item.sla_status === 'Mendekati' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'
                  }`}>
                    SLA: {item.sla_status || 'Aman'}
                  </span>
                  <span className="text-xs font-black text-slate-300 uppercase tracking-widest">{item.nomor_surat}</span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">{item.jenis_surat}</h3>
                  <p className="text-slate-400 font-medium">{item.user?.nama_lengkap} - {item.user?.nim || 'N/A'}</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                   <div className="flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {new Date(item.created_at).toLocaleDateString('id-ID')}
                   </div>
                   <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${item.status === 'Selesai' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                      {item.status}
                   </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {selectedId === item.id ? (
                  <div className="flex flex-col gap-3 w-full md:w-64 animate-in slide-in-from-right-4 duration-300">
                    <select 
                      value={newStatus} 
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-sipa-green/20"
                    >
                      <option value="">Pilih Status Baru</option>
                      <option value="Diterima Tendik">Terima (Validasi)</option>
                      <option value="Diproses">Sedang Diproses</option>
                      <option value="Selesai">Selesai</option>
                      <option value="Ditolak">Tolak Pengajuan</option>
                    </select>
                    <textarea 
                      placeholder="Tambahkan catatan/alasan..." 
                      value={catatan}
                      onChange={(e) => setCatatan(e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-sipa-green/20 min-h-[80px]"
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={handleUpdateStatus}
                        disabled={submitting}
                        className="flex-1 bg-sipa-green text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-sipa-green/20 active:scale-95 transition-all"
                      >
                        {submitting ? '...' : 'SIMPAN'}
                      </button>
                      <button 
                        onClick={() => setSelectedId(null)}
                        className="px-4 bg-slate-100 text-slate-400 py-3 rounded-xl text-xs font-black uppercase active:scale-95 transition-all"
                      >
                        X
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Link href={`/dashboard/pengajuan/${item.id}`} className="px-6 py-4 rounded-2xl bg-slate-50 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-100 hover:text-slate-800 transition-all">
                      Detail
                    </Link>
                    <button 
                      onClick={() => { setSelectedId(item.id); setNewStatus(item.status); }}
                      className="px-8 py-4 rounded-2xl bg-sipa-green text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-sipa-green/20 hover:bg-sipa-green-dark transition-all active:scale-95"
                    >
                      PROSES
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
