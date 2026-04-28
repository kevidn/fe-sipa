'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserData {
  nama_lengkap: string;
  role: string;
  username: string;
  id_user: string;
}

interface Pengajuan {
  id: number;
  nomor_surat: string;
  jenis_surat: string;
  created_at: string;
  status: 'Selesai' | 'Diproses' | 'Diterima Tendik' | 'Ditolak';
  file_url?: string;
}

export default function MahasiswaDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<Pengajuan[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    setRefreshing(true);
    try {
      const token = localStorage.getItem('sipa_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/surat`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data.data);
      }
    } catch (err) {
      console.error('Gagal mengambil riwayat:', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('sipa_token');
    const userDataStr = localStorage.getItem('sipa_user');

    if (!token || !userDataStr) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(userDataStr);
      if (userData.role.toUpperCase() !== 'MAHASISWA') {
        router.push('/dashboard');
        return;
      }
      setUser(userData);
      fetchHistory();
    } catch (e) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const stats = [
    { label: 'Total Pengajuan', value: history.length, icon: 'file-text', color: 'blue' },
    { label: 'Dalam Proses', value: history.filter(h => h.status === 'Diproses' || h.status === 'Diterima Tendik').length, icon: 'clock', color: 'orange' },
    { label: 'Selesai', value: history.filter(h => h.status === 'Selesai').length, icon: 'check-circle', color: 'green' },
    { label: 'Ditolak', value: history.filter(h => h.status === 'Ditolak').length, icon: 'x-circle', color: 'red' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f3ee] gap-4">
        <div className="w-12 h-12 border-4 border-sipa-green border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Menyiapkan Dashboard...</p>
      </div>
    );
  }

  const formatTanggal = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <>
      {/* --- WELCOME SECTION --- */}
      <section className="mb-10">
        <h2 className="text-4xl font-black mb-2 tracking-tight text-slate-800 uppercase">Halo, {user?.nama_lengkap.split(' ')[0]}!</h2>
        <p className="text-base text-slate-400 font-medium">Selamat datang kembali! Kelola pengajuan surat Anda di sini.</p>
      </section>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
            <div className="flex flex-col gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 shadow-lg
                ${stat.color === 'blue' ? 'bg-[#3b82f6] text-white shadow-blue-200' : ''}
                ${stat.color === 'orange' ? 'bg-[#f97316] text-white shadow-orange-200' : ''}
                ${stat.color === 'green' ? 'bg-[#10b981] text-white shadow-green-200' : ''}
                ${stat.color === 'red' ? 'bg-[#ef4444] text-white shadow-red-200' : ''}
              `}>
                {stat.icon === 'file-text' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>}
                {stat.icon === 'clock' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
                {stat.icon === 'check-circle' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
                {stat.icon === 'x-circle' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
            </div>
            <span className="text-4xl font-extrabold text-slate-800 tracking-tighter">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* --- CTA BANNER --- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#00a86b] to-[#008f5d] rounded-[2.5rem] p-10 sm:p-14 text-white shadow-2xl shadow-[#00a86b]/20 mb-12 flex items-center justify-between">
        <div className="relative z-10 space-y-8 max-w-xl">
          <div>
            <h3 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight">Ajukan Surat Baru</h3>
            <p className="text-base sm:text-xl text-white/90 leading-relaxed font-medium">Pilih jenis surat yang ingin Anda ajukan dan isi formulir dengan lengkap.</p>
          </div>
          <Link href="/dashboard/pengajuan/baru" className="bg-white text-sipa-green px-8 py-4 rounded-2xl font-black text-lg flex items-center gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 active:scale-95 border-none w-fit">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Buat Pengajuan Baru
          </Link>
        </div>
        
        <div className="hidden lg:block bg-white/10 p-8 rounded-[3rem] backdrop-blur-md border border-white/20 transform rotate-6 hover:rotate-0 transition-transform duration-700 shadow-2xl">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        </div>
      </section>

      {/* --- RIWAYAT TABLE --- */}
      <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mb-12">
        <div className="p-8 sm:p-10 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-2xl text-slate-800 tracking-tight">Riwayat Pengajuan</h3>
            <p className="text-sm text-slate-400 font-medium mt-1">Daftar pengajuan surat yang Anda lakukan baru-baru ini.</p>
          </div>
          <button 
            onClick={fetchHistory}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 text-xs font-black text-slate-400 hover:text-sipa-green bg-slate-50 hover:bg-sipa-green/10 px-6 py-3.5 rounded-2xl transition-all duration-300 active:scale-95 w-full sm:w-auto uppercase tracking-widest disabled:opacity-50"
          >
            <svg className={refreshing ? 'animate-spin' : ''} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6m12-4a9 9 0 0 1-15 6.7L3 16"/></svg>
            {refreshing ? 'REFRESHING...' : 'REFRESH'}
          </button>
        </div>
        
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                <th className="px-8 py-6">No. Pengajuan</th>
                <th className="px-8 py-6">Jenis Surat</th>
                <th className="px-8 py-6">Tanggal Ajukan</th>
                <th className="px-8 py-6 text-center">Status</th>
                <th className="px-8 py-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                      </div>
                      <p className="text-sm font-bold text-slate-400">Belum ada riwayat pengajuan surat.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                history.map((item, idx) => (
                  <tr key={idx} className="group hover:bg-slate-50/50 transition-all duration-300">
                    <td className="px-8 py-8">
                      <span className="text-sm font-black text-slate-800 group-hover:text-sipa-green transition-colors">{item.nomor_surat}</span>
                    </td>
                    <td className="px-8 py-8">
                      <p className="text-sm font-bold text-slate-600">{item.jenis_surat}</p>
                    </td>
                    <td className="px-8 py-8 text-sm font-semibold text-slate-400">{formatTanggal(item.created_at)}</td>
                    <td className="px-8 py-8">
                      <div className="flex justify-center">
                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border shadow-sm
                          ${item.status === 'Selesai' ? 'bg-green-50 text-green-600 border-green-100' : ''}
                          ${item.status === 'Diproses' ? 'bg-blue-50 text-blue-600 border-blue-100' : ''}
                          ${item.status === 'Diterima Tendik' ? 'bg-purple-50 text-purple-600 border-purple-100' : ''}
                          ${item.status === 'Ditolak' ? 'bg-red-50 text-red-600 border-red-100' : ''}
                        `}>
                          {item.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex justify-end gap-3 text-right">
                        <button className="bg-white border border-slate-100 p-3 rounded-xl text-slate-300 hover:text-sipa-green hover:border-sipa-green hover:shadow-lg transition-all duration-300 active:scale-90" title="Download">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        </button>
                        <button className="bg-white border border-slate-100 p-3 rounded-xl text-slate-300 hover:text-blue-500 hover:border-blue-500 hover:shadow-lg transition-all duration-300 active:scale-90" title="Detail">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-8 sm:p-10 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Menampilkan {history.length} pengajuan</span>
          <Link href="/dashboard/pengajuan" className="group flex items-center gap-3 bg-sipa-green text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-sipa-green/20 hover:shadow-2xl hover:-translate-x-1 transition-all duration-300 active:scale-95">
            LIHAT SEMUA
            <svg className="group-hover:translate-x-2 transition-transform duration-300" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </section>
    </>
  );
}
