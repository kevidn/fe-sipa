"use client";

import { useState } from 'react';
import Link from 'next/link';

const allPengajuan = [
  {
    id: 'SKM-2024-001',
    jenis: 'Surat Keterangan Masih Kuliah',
    tanggal: '2024-04-01',
    status: 'Selesai',
    sla: 'Tepat Waktu'
  },
  {
    id: 'SKRIPSI-2024-015',
    jenis: 'Surat Ijin Survei Penelitian (Skripsi)',
    tanggal: '2024-03-28',
    status: 'Diproses',
    sla: '2 HARI LAGI'
  },
  {
    id: 'TUNJANGAN-2024-003',
    jenis: 'Surat Tunjangan/Pensiun/Akses',
    tanggal: '2024-03-15',
    status: 'Selesai',
    sla: 'Tepat Waktu'
  },
  {
    id: 'BEA-TIDAK-2024-011',
    jenis: 'Surat Keterangan Tidak Menerima Beasiswa',
    tanggal: '2024-03-10',
    status: 'Selesai',
    sla: 'Tepat Waktu'
  },
  {
    id: 'SKM-2024-003',
    jenis: 'Surat Keterangan Masih Kuliah',
    tanggal: '2024-03-05',
    status: 'Selesai',
    sla: 'Tepat Waktu'
  },
  {
    id: 'SKRIPSI-2024-012',
    jenis: 'Surat Ijin Survei Penelitian (Skripsi)',
    tanggal: '2024-02-28',
    status: 'Selesai',
    sla: 'Tepat Waktu'
  },
  {
    id: 'BEA-2024-019',
    jenis: 'Surat Rekomendasi Beasiswa',
    tanggal: '2024-02-25',
    status: 'Ditolak',
    sla: 'Terlampaui'
  },
  {
    id: 'KELAKUAN-2024-005',
    jenis: 'Surat Keterangan Kelakuan Baik',
    tanggal: '2024-02-20',
    status: 'Selesai',
    sla: 'Tepat Waktu'
  },
  {
    id: 'SKM-2024-004',
    jenis: 'Surat Keterangan Masih Kuliah',
    tanggal: '2024-02-15',
    status: 'Selesai',
    sla: 'Tepat Waktu'
  }
];

export default function RiwayatPengajuan() {
  const [search, setSearch] = useState('');
  const [filterJenis, setFilterJenis] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="space-y-2">
        <Link 
          href="/dashboard/mahasiswa" 
          className="inline-flex items-center gap-2 text-sipa-green font-bold hover:gap-3 transition-all group mb-4"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Kembali ke Dashboard
        </Link>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Riwayat Pengajuan</h1>
        <p className="text-slate-400 font-medium">Semua riwayat pengajuan surat Anda</p>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input 
            type="text" 
            placeholder="Cari nomor pengajuan..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-sipa-green/20 font-medium text-slate-600 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select 
          className="w-full md:w-64 px-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-sipa-green/20 font-medium text-slate-600 cursor-pointer appearance-none"
          value={filterJenis}
          onChange={(e) => setFilterJenis(e.target.value)}
        >
          <option>Semua Jenis Surat</option>
          <option>Surat Keterangan Masih Kuliah</option>
          <option>Surat Ijin Survei Penelitian (Skripsi)</option>
        </select>
        <select 
           className="w-full md:w-64 px-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-sipa-green/20 font-medium text-slate-600 cursor-pointer appearance-none"
           value={filterStatus}
           onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option>Semua Status</option>
          <option>Selesai</option>
          <option>Diproses</option>
          <option>Ditolak</option>
        </select>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-800">Semua Pengajuan ({allPengajuan.length})</h2>
          <button className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-sipa-green transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            Filter Lanjutan
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">No. Pengajuan</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Jenis Surat</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal Ajukan</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">SLA</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {allPengajuan.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-6 font-black text-slate-800 text-sm">{item.id}</td>
                  <td className="px-8 py-6 font-medium text-slate-600 text-sm">{item.jenis}</td>
                  <td className="px-8 py-6 text-slate-400 font-medium text-sm">{item.tanggal}</td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap
                      ${item.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600' : 
                        item.status === 'Diproses' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}
                    `}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap
                      ${item.sla === 'Tepat Waktu' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}
                    `}>
                      {item.sla}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                       <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-sipa-green/10 hover:text-sipa-green transition-all" title="Download">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                      </button>
                      <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-all" title="Detail">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-8 bg-slate-50/30 flex items-center justify-between border-t border-slate-50">
          <p className="text-xs font-bold text-slate-400">
            Menampilkan <span className="text-slate-800">12</span> dari <span className="text-slate-800">12</span> pengajuan
          </p>
          <div className="flex items-center gap-2">
            <button className="px-6 py-2.5 rounded-xl bg-white border border-slate-100 text-xs font-black text-slate-400 hover:bg-slate-50 transition-all">
              Sebelumnya
            </button>
            <button className="px-6 py-2.5 rounded-xl bg-sipa-green text-white text-xs font-black shadow-lg shadow-sipa-green/20 hover:bg-sipa-green-dark transition-all">
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
