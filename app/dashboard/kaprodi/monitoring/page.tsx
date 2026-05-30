"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  nama_lengkap: string;
  nim: string;
}

interface Pengajuan {
  id: number;
  nomor_surat: string;
  jenis_surat: string;
  status: string;
  sla_status: string;
  created_at: string;
  user: User;
}

import { useRouter } from 'next/navigation';

export default function MonitoringSLA() {
  const router = useRouter();
  const [pengajuan, setPengajuan] = useState<Pengajuan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sipa_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/surat`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Hanya tampilkan yang SLA nya bermasalah atau aktif
        const filtered = data.data.filter((s: Pengajuan) => s.status !== 'Selesai' && s.status !== 'Ditolak');
        setPengajuan(filtered);
      }
    } catch (err) {
      console.error('Gagal mengambil data monitoring:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatTanggal = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('id-ID', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).replace(/\./g, ':');
  };

  const getSlaBadge = (status: string) => {
    if (status === 'Terlampaui') return <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full font-black text-[10px] uppercase">Terlampaui</span>;
    if (status === 'Mendekati') return <span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-full font-black text-[10px] uppercase">Peringatan</span>;
    return <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full font-black text-[10px] uppercase">Aman</span>;
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="space-y-1">
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Monitoring SLA</h1>
        <p className="text-slate-400 font-medium">Pantau pengajuan yang mendekati atau melampaui batas waktu</p>
      </div>

      <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
         <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-xl font-black text-slate-800">Daftar Pengajuan Aktif</h2>
            <button className="text-sm font-bold text-blue-600 hover:underline">Ekspor Terlampaui Saja (PDF)</button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50">
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">SLA Status</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">No. Pengajuan</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mahasiswa</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Jenis Surat</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal Masuk</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Saat Ini</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {loading ? (
                     <tr><td colSpan={6} className="py-20 text-center font-bold text-slate-400">Sinkronisasi Data...</td></tr>
                  ) : pengajuan.length === 0 ? (
                     <tr><td colSpan={6} className="py-20 text-center font-bold text-slate-400">Tidak ada pengajuan aktif</td></tr>
                  ) : pengajuan.map((item) => (
                     <tr 
                        key={item.id} 
                        onClick={() => router.push(`/dashboard/kaprodi/monitoring/${item.id}`)}
                        className="hover:bg-slate-50/30 transition-all cursor-pointer"
                     >
                        <td className="px-8 py-6">{getSlaBadge(item.sla_status)}</td>
                        <td className="px-8 py-6 font-black text-slate-800 text-sm">{item.nomor_surat}</td>
                        <td className="px-8 py-6">
                           <div className="flex flex-col">
                              <span className="font-bold text-slate-800 text-sm">{item.user.nama_lengkap}</span>
                              <span className="text-[10px] font-medium text-slate-400">{item.user.nim}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 font-medium text-slate-600 text-sm">{item.jenis_surat}</td>
                        <td className="px-8 py-6 font-bold text-slate-500 text-xs">{formatTanggal(item.created_at)}</td>
                        <td className="px-8 py-6 font-bold text-slate-700 text-xs">{item.status}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
