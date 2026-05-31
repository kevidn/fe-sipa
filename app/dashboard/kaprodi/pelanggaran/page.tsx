"use client";

import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import Link from 'next/link';

export default function DaftarPelanggaranSLA() {
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState<any[]>([]);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('Semua Severity');
  const [jenisFilter, setJenisFilter] = useState('Semua Jenis Surat');

  useEffect(() => {
    const fetchRealData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('sipa_token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/surat`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const result = await res.json();
          // Filter ONLY the ones that are 'Terlampaui'
          const violators = (result.data || []).filter((item: any) => item.sla_status === 'Terlampaui');
          setRawData(violators);
        }
      } catch (err) {
        console.error('Failed to fetch SLA violators', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRealData();
  }, []);

  const getProcessedData = () => {
    let totalCritical = 0;
    let totalHighMedium = 0;
    let totalLatenessDays = 0;

    // Process each item to calculate lateness and severity
    const processedItems = rawData.map((item: any) => {
      const created = new Date(item.created_at);
      let end = new Date();
      if (item.status === 'Selesai' || item.status === 'Ditolak') {
        end = new Date(item.updated_at);
      }
      
      const diffTime = Math.abs(end.getTime() - created.getTime());
      const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      
      // Determine target SLA based on type (mock logic similar to screenshot)
      let target = 3;
      if (item.jenis_surat?.toLowerCase().includes('masih kuliah') || item.jenis_surat?.toLowerCase().includes('kelakuan baik')) {
        target = 2;
      }
      
      let lateness = diffDays - target;
      if (lateness <= 0) lateness = 1; // If it's flagged as Terlampaui, minimum lateness is 1 day
      
      totalLatenessDays += lateness;
      
      let severity = 'Medium';
      if (lateness >= 3) {
         severity = 'Critical';
         totalCritical++;
      } else {
         severity = lateness === 2 ? 'High' : 'Medium';
         totalHighMedium++;
      }
      
      let penyebab = item.komentar;
      if (!penyebab || penyebab.trim() === '') {
         penyebab = 'Menunggu konfirmasi proses lanjutan';
      }

      return {
        ...item,
        target_sla: target,
        aktual_hari: diffDays,
        keterlambatan: lateness,
        severity: severity,
        penyebab: penyebab
      };
    });
    
    // Sort items by lateness descending
    processedItems.sort((a, b) => b.keterlambatan - a.keterlambatan);

    // Filter for Table
    const filteredTable = processedItems.filter((item: any) => {
      const matchesSearch = 
        item.nomor_surat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.user?.nama_lengkap?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.user?.nim?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.penyebab?.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesSeverity = severityFilter === 'Semua Severity' || item.severity === severityFilter;
      const matchesJenis = jenisFilter === 'Semua Jenis Surat' || item.jenis_surat === jenisFilter;
      
      return matchesSearch && matchesSeverity && matchesJenis;
    });

    // Trend Bulanan
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const trendMap: any = {};
    processedItems.forEach((item: any) => {
      const d = new Date(item.created_at);
      const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
      if (!trendMap[key]) trendMap[key] = { name: key, Pelanggaran: 0 };
      trendMap[key].Pelanggaran += 1;
    });
    const trendBulanan = Object.values(trendMap);

    // Pelanggaran per Jenis Surat
    const jenisMap: any = {};
    processedItems.forEach((item: any) => {
      const jenis = item.jenis_surat || 'Lainnya';
      if (!jenisMap[jenis]) jenisMap[jenis] = { name: jenis, Pelanggaran: 0 };
      jenisMap[jenis].Pelanggaran += 1;
    });
    const jenisStats = Object.values(jenisMap).map((j: any) => {
       let shortName = j.name;
       if (shortName.length > 20) {
          shortName = shortName.replace('Surat Keterangan', 'Ket.');
          shortName = shortName.replace('Surat Ijin', 'Ijin');
          shortName = shortName.replace('Surat Rekomendasi', 'Rek.');
       }
       return { name: shortName, Pelanggaran: j.Pelanggaran };
    }).sort((a: any, b: any) => b.Pelanggaran - a.Pelanggaran);
    
    // Extract unique jenis surat for filter dropdown
    const uniqueJenis = Array.from(new Set(processedItems.map((item: any) => item.jenis_surat || 'Lainnya')));

    // Calculate Trend vs Last Month
    const now = new Date();
    const currentMonthStr = `${months[now.getMonth()]} ${now.getFullYear()}`;
    
    let lastMonthDate = new Date();
    lastMonthDate.setMonth(now.getMonth() - 1);
    const lastMonthStr = `${months[lastMonthDate.getMonth()]} ${lastMonthDate.getFullYear()}`;

    const currentMonthCount = trendMap[currentMonthStr]?.Pelanggaran || 0;
    const lastMonthCount = trendMap[lastMonthStr]?.Pelanggaran || 0;
    
    let trendPercentage = 0;
    let trendDirection = 'stable';
    if (lastMonthCount === 0 && currentMonthCount > 0) {
       trendPercentage = 100;
       trendDirection = 'up';
    } else if (lastMonthCount > 0) {
       trendPercentage = Math.round(((currentMonthCount - lastMonthCount) / lastMonthCount) * 100);
       trendDirection = trendPercentage > 0 ? 'up' : trendPercentage < 0 ? 'down' : 'stable';
    }

    return {
      total: processedItems.length,
      critical: totalCritical,
      highMedium: totalHighMedium,
      avgLateness: processedItems.length > 0 ? (totalLatenessDays / processedItems.length).toFixed(1) : 0,
      trendBulanan,
      jenisStats,
      tableData: filteredTable,
      uniqueJenis,
      trendPercentage,
      trendDirection
    };
  };

  const data = getProcessedData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xl border border-slate-700/50">
          <p className="opacity-70 mb-1">{label}</p>
          <p className="text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].color }}></span>
            {payload[0].value} Pelanggaran
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 font-poppins">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-800 tracking-tight">Daftar Pelanggaran SLA</h1>
          <p className="text-slate-500 font-medium mt-2">Monitoring dan analisis pengajuan yang melampaui target waktu SLA</p>
        </div>
        
        <button className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-emerald-500/20 active:scale-95">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Ekspor Data
        </button>
      </div>

      {loading ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold animate-pulse">Memuat data pelanggaran SLA...</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Pelanggaran Card */}
            <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex items-start justify-between group hover:shadow-lg hover:shadow-red-500/10 transition-all">
              <div>
                <p className="text-red-600 font-bold text-sm mb-2">Total Pelanggaran</p>
                <h3 className="text-4xl font-black text-red-700">{data.total}</h3>
                {data.trendDirection !== 'stable' && (
                  <p className={`text-xs font-bold mt-2 flex items-center gap-1 ${data.trendDirection === 'down' ? 'text-emerald-500' : 'text-red-500'}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={data.trendDirection === 'down' ? '' : 'rotate-180'}>
                      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>
                    </svg>
                    {data.trendDirection === 'down' ? '' : '+'}{data.trendPercentage}% vs bulan lalu
                  </p>
                )}
                {data.trendDirection === 'stable' && (
                  <p className="text-xs font-bold mt-2 flex items-center gap-1 text-slate-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Sama vs bulan lalu
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
            </div>

            {/* Critical Card */}
            <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 flex items-start justify-between group hover:shadow-lg hover:shadow-orange-500/10 transition-all">
              <div>
                <p className="text-orange-600 font-bold text-sm mb-2">Critical</p>
                <h3 className="text-4xl font-black text-orange-700">{data.critical}</h3>
                <p className="text-xs font-medium text-orange-500 mt-2">&gt;2 hari keterlambatan</p>
              </div>
              <div className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
            </div>

            {/* High + Medium Card */}
            <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex items-start justify-between group hover:shadow-lg hover:shadow-amber-500/10 transition-all">
              <div>
                <p className="text-amber-700 font-bold text-sm mb-2">High + Medium</p>
                <h3 className="text-4xl font-black text-amber-600">{data.highMedium}</h3>
                <p className="text-xs font-medium text-amber-600/70 mt-2">1-2 hari keterlambatan</p>
              </div>
              <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
            </div>

            {/* Average Card */}
            <div className="bg-fuchsia-50 p-6 rounded-3xl border border-fuchsia-100 flex items-start justify-between group hover:shadow-lg hover:shadow-fuchsia-500/10 transition-all">
              <div>
                <p className="text-fuchsia-700 font-bold text-sm mb-2">Rata-rata Keterlambatan</p>
                <div className="flex items-end gap-2">
                  <h3 className="text-4xl font-black text-fuchsia-700">{data.avgLateness}</h3>
                  <span className="text-fuchsia-600 font-bold mb-1">hari</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-fuchsia-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-fuchsia-500/30 group-hover:scale-110 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trend Chart */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/20">
              <div className="mb-8">
                <h3 className="text-xl font-black text-slate-800">Trend Pelanggaran Bulanan</h3>
                <p className="text-sm font-medium text-slate-400">Total pelanggaran SLA per bulan</p>
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.trendBulanan} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="Pelanggaran" stroke="#ef4444" strokeWidth={3} dot={{r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6, fill: '#ef4444', strokeWidth: 0}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Jenis Surat Chart */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/20">
              <div className="mb-8">
                <h3 className="text-xl font-black text-slate-800">Pelanggaran per Jenis Surat</h3>
                <p className="text-sm font-medium text-slate-400">Distribusi pelanggaran berdasarkan tipe dokumen</p>
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.jenisStats} margin={{ top: 5, right: 20, bottom: 25, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} angle={-15} textAnchor="end" height={50} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                    <Bar dataKey="Pelanggaran" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
            {/* Table Filters */}
            <div className="p-6 lg:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
                <input 
                  type="text"
                  placeholder="Cari nomor pengajuan, nama mahasiswa, NIM, atau penyebab..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 bg-white focus:border-sipa-green/30 outline-none transition-all font-medium text-slate-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <select 
                  className="px-4 py-3.5 rounded-2xl border-2 border-slate-200 bg-white font-bold text-slate-600 outline-none focus:border-sipa-green/30 cursor-pointer min-w-[160px]"
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                >
                  <option value="Semua Severity">Semua Severity</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                </select>
                <select 
                  className="px-4 py-3.5 rounded-2xl border-2 border-slate-200 bg-white font-bold text-slate-600 outline-none focus:border-sipa-green/30 cursor-pointer min-w-[200px]"
                  value={jenisFilter}
                  onChange={(e) => setJenisFilter(e.target.value)}
                >
                  <option value="Semua Jenis Surat">Semua Jenis Surat</option>
                  {data.uniqueJenis.map((jenis: any) => (
                    <option key={jenis} value={jenis}>{jenis}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b-2 border-slate-100">
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">No. Pengajuan</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Mahasiswa</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest min-w-[180px]">Jenis Surat</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Target SLA</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Keterlambatan</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Severity</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest min-w-[200px]">Penyebab</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.tableData.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-12 text-center">
                        <div className="inline-flex flex-col items-center justify-center text-slate-400">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                          <p className="font-bold">Tidak ada data pelanggaran ditemukan.</p>
                          <p className="text-sm font-medium mt-1">Coba ubah filter atau pencarian Anda.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data.tableData.map((item: any) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-6">
                          <p className="font-black text-slate-800 text-sm whitespace-nowrap">{item.nomor_surat}</p>
                          <p className="text-xs font-medium text-slate-400 mt-1 flex items-center gap-1">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </td>
                        <td className="p-6">
                          <p className="font-bold text-slate-700 text-sm">{item.user?.nama_lengkap}</p>
                          <p className="text-xs font-bold text-slate-400 mt-1">{item.user?.nim}</p>
                        </td>
                        <td className="p-6">
                          <p className="font-bold text-slate-600 text-sm">{item.jenis_surat}</p>
                        </td>
                        <td className="p-6">
                          <p className="font-bold text-slate-700 text-sm">{item.target_sla} hari</p>
                          <p className="text-xs font-medium text-slate-400 mt-1">Aktual: {item.aktual_hari} hari</p>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-1.5 text-red-500 bg-red-50 px-3 py-1.5 rounded-lg w-fit">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            <span className="font-black text-xs whitespace-nowrap">{item.keterlambatan} hari</span>
                          </div>
                        </td>
                        <td className="p-6">
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-black whitespace-nowrap
                            ${item.severity === 'Critical' ? 'bg-red-50 text-red-600 border border-red-100' : 
                              item.severity === 'High' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 
                              'bg-amber-50 text-amber-600 border border-amber-100'}`}
                          >
                            {item.severity}
                          </span>
                        </td>
                        <td className="p-6">
                          <p className="font-bold text-slate-600 text-xs line-clamp-2">{item.penyebab}</p>
                          {item.processor && (
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">PJ: {item.processor.nama_lengkap.split(' ')[0]}</p>
                          )}
                        </td>
                        <td className="p-6 text-center">
                          <Link 
                            href={`/dashboard/kaprodi/persetujuan/${item.id}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl font-bold text-xs transition-all active:scale-95 whitespace-nowrap"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            Detail
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
