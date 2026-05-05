"use client";

import { useState, useEffect } from 'react';

interface Stats {
  total: number;
  selesai: number;
  proses: number;
  ditolak: number;
  slaTerlampaui: number;
}

export default function MonitoringKaprodi() {
  const [history, setHistory] = useState<any[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, selesai: 0, proses: 0, ditolak: 0, slaTerlampaui: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('sipa_token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/surat`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const docs = data.data;
          setHistory(docs);
          
          const newStats = {
            total: docs.length,
            selesai: docs.filter((d: any) => d.status === 'Selesai').length,
            proses: docs.filter((d: any) => ['Diajukan', 'Diterima Tendik', 'Diproses'].includes(d.status)).length,
            ditolak: docs.filter((d: any) => d.status === 'Ditolak').length,
            slaTerlampaui: docs.filter((d: any) => d.sla_status === 'Terlampaui').length
          };
          setStats(newStats);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Monitoring & Statistik</h1>
        <p className="text-slate-400 font-medium">Laporan kinerja pelayanan akademik dan SLA</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Pengajuan" value={stats.total} color="bg-blue-500" icon="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
        <StatCard title="Selesai" value={stats.selesai} color="bg-emerald-500" icon="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
        <StatCard title="Dalam Proses" value={stats.proses} color="bg-amber-500" icon="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
        <StatCard title="SLA Terlampaui" value={stats.slaTerlampaui} color="bg-red-500" icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
        <h3 className="text-xl font-black text-slate-800 mb-6">Pelanggaran SLA Terkini</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                <th className="py-4 px-4">Mahasiswa</th>
                <th className="py-4 px-4">Jenis Surat</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={4} className="py-10 text-center font-bold text-slate-300">Memuat data...</td></tr>
              ) : history.filter(h => h.sla_status === 'Terlampaui').length === 0 ? (
                <tr><td colSpan={4} className="py-10 text-center font-bold text-slate-300">Tidak ada pelanggaran SLA.</td></tr>
              ) : (
                history.filter(h => h.sla_status === 'Terlampaui').map(item => (
                  <tr key={item.id} className="text-sm font-medium text-slate-600 hover:bg-red-50/30 transition-colors">
                    <td className="py-4 px-4">{item.user?.nama_lengkap}</td>
                    <td className="py-4 px-4">{item.jenis_surat}</td>
                    <td className="py-4 px-4">
                       <span className="text-red-500 font-black">{item.status}</span>
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                       {item.deadline_sla ? new Date(item.deadline_sla).toLocaleDateString('id-ID') : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, icon }: { title: string, value: number, color: string, icon: string }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-6 group hover:scale-105 transition-all duration-300">
      <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-${color.split('-')[1]}-200 group-hover:rotate-6 transition-transform`}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d={icon} />
        </svg>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-black text-slate-800">{value}</p>
      </div>
    </div>
  );
}
