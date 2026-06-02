"use client";

import { useState, useEffect } from 'react';
import CustomSelect from '@/components/CustomSelect';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

interface User {
  id_user: string;
  nama_lengkap: string;
  nim: string;
  email: string;
  role: string;
  status_akun: string;
}

export default function ManajemenPengguna() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('Semua');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<User | null>(null);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({ id_user: '', nama_lengkap: '', nim: '', email: '', role: 'Mahasiswa', password: '' });

  // Lock body scroll when any modal is open
  useBodyScrollLock(isAddModalOpen || isEditModalOpen);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('sipa_token');
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (roleFilter !== 'Semua') params.append('role', roleFilter);
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json.data || []);
        if (json.meta) setTotalPages(json.meta.last_page);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter, limit]);

  useEffect(() => {
    // debounce search
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, roleFilter, page, limit]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('sipa_token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(addForm)
      });
      setIsAddModalOpen(false);
      setAddForm({ id_user: '', nama_lengkap: '', nim: '', email: '', role: 'Mahasiswa', password: '' });
      fetchData();
    } catch (err) {
      console.error("Failed to add user:", err);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;

    try {
      const token = localStorage.getItem('sipa_token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${editForm.id_user}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(editForm)
      });
      setIsEditModalOpen(false);
      setEditForm(null);
      fetchData();
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus akun ${nama}? Tindakan ini tidak dapat dibatalkan.`)) return;
    try {
      const token = localStorage.getItem('sipa_token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const exportToCSV = () => {
    if (data.length === 0) return;
    
    // Create CSV header
    const headers = ['No', 'ID User', 'Nama Lengkap', 'NIM/NIP', 'Email', 'Role', 'Status Akun'];
    
    // Create CSV rows
    const rows = data.map((user, index) => [
      index + 1,
      user.id_user,
      `"${user.nama_lengkap}"`,
      `"${user.nim || '-'}"`,
      `"${user.email}"`,
      user.role,
      user.status_akun
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `data_pengguna_sipa_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate summaries
  const totalAdmin = data.filter(u => u.role.toLowerCase() === 'admin sistem').length;
  const totalTendik = data.filter(u => u.role.toLowerCase() === 'tendik').length;
  const totalKaprodi = data.filter(u => u.role.toLowerCase() === 'kaprodi').length;
  const totalMahasiswa = data.filter(u => u.role.toLowerCase() === 'mahasiswa').length;

  const renderRoleBadge = (role: string) => {
    const roleLower = role.toLowerCase();
    if (roleLower.includes('admin')) return <span className="text-emerald-500 font-black text-xs tracking-wider uppercase">Admin</span>;
    if (roleLower === 'tendik') return <span className="text-blue-500 font-black text-xs tracking-wider uppercase">Tendik</span>;
    if (roleLower === 'kaprodi') return <span className="text-purple-500 font-black text-xs tracking-wider uppercase">Kaprodi</span>;
    return <span className="text-orange-500 font-black text-xs tracking-wider uppercase">Mahasiswa</span>;
  };

  const renderStatusBadge = (status: string) => {
    if (status === 'Aktif') {
      return <span className="text-emerald-500 font-black text-xs tracking-wider uppercase">Aktif</span>;
    }
    return <span className="text-slate-400 font-black text-xs tracking-wider uppercase">Nonaktif</span>;
  };

  return (
    <div className="space-y-8 font-poppins pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Manajemen Pengguna</h1>
          <p className="text-slate-400 font-medium text-sm mt-1">Kelola akun pengguna dan hak akses sistem</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#00a651] hover:bg-[#008c44] text-white font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-emerald-600/20 active:scale-95 transition-all text-sm flex items-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
          Tambah Pengguna
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Admin Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <p className="text-2xl font-black text-emerald-500">{loading ? '...' : totalAdmin}</p>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Admin</p>
          </div>
        </div>

        {/* Tendik Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </div>
          <div>
            <p className="text-2xl font-black text-blue-500">{loading ? '...' : totalTendik}</p>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Tendik</p>
          </div>
        </div>

        {/* Kaprodi Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div>
            <p className="text-2xl font-black text-purple-500">{loading ? '...' : totalKaprodi}</p>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Kaprodi</p>
          </div>
        </div>

        {/* Mahasiswa Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          </div>
          <div>
            <p className="text-2xl font-black text-orange-500">{loading ? '...' : totalMahasiswa}</p>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Mahasiswa</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/30">
        <div className="relative w-full md:w-96">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input 
            type="text" 
            placeholder="Cari nama, NIM/NIP, atau email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all border-none"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <CustomSelect 
            value={roleFilter}
            onChange={(val) => setRoleFilter(val)}
            className="w-full md:w-auto"
            options={[
              { value: 'Semua', label: 'Semua Role' },
              { value: 'Admin Sistem', label: 'Admin' },
              { value: 'Tendik', label: 'Tendik' },
              { value: 'Kaprodi', label: 'Kaprodi' },
              { value: 'Mahasiswa', label: 'Mahasiswa' }
            ]}
          />

          <button 
            onClick={exportToCSV}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-200 transition-all cursor-pointer shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-4 px-6 w-16">No</th>
                <th className="py-4 px-6">Nama</th>
                <th className="py-4 px-6">NIM/NIP</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 w-24 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading && data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">Memuat data pengguna...</td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">Tidak ada pengguna yang cocok.</td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={item.id_user} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-100">{index + 1}</td>
                    <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs uppercase shrink-0">
                        {item.nama_lengkap.charAt(0)}
                      </div>
                      {item.nama_lengkap}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-500">{item.nim || '-'}</td>
                    <td className="py-4 px-6 font-medium text-slate-500">{item.email}</td>
                    <td className="py-4 px-6">{renderRoleBadge(item.role)}</td>
                    <td className="py-4 px-6">{renderStatusBadge(item.status_akun)}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => {
                            setEditForm(item);
                            setIsEditModalOpen(true);
                          }}
                          className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-800 hover:border-slate-300 transition-all flex items-center justify-center"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id_user, item.nama_lengkap)} 
                          className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-red-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all flex items-center justify-center"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-500">Tampilkan</span>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm font-medium text-slate-500">entri</span>
            </div>
            <span className="text-sm font-medium text-slate-500 hidden sm:inline-block">|</span>
            <span className="text-sm font-medium text-slate-500">
              Halaman <span className="font-bold text-slate-700 dark:text-slate-300">{page}</span> dari <span className="font-bold text-slate-700 dark:text-slate-300">{totalPages}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Sebelumnya
            </button>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      {/* Alert Info */}
      <div className="bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-800/30 rounded-3xl p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-white dark:bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 shadow-sm border border-blue-100 dark:border-blue-500/20">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Informasi Manajemen Pengguna</h3>
          <p className="text-blue-500 dark:text-blue-400 text-sm font-medium leading-relaxed">
            Setiap role memiliki hak akses yang berbeda dalam sistem. Admin dapat mengelola semua konfigurasi, Tendik memproses surat, Kaprodi memberikan persetujuan, dan Mahasiswa mengajukan permohonan surat.
          </p>
        </div>
      </div>

      {/* Modal Edit Pengguna */}
      {isEditModalOpen && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-8 shadow-2xl relative border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Edit Pengguna</h2>
            <p className="text-slate-400 text-sm font-medium mt-1 mb-6">Ubah hak akses atau status akun {editForm.nama_lengkap}</p>

            <form className="space-y-5" onSubmit={handleEditSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={editForm.nama_lengkap}
                  onChange={(e) => setEditForm({...editForm, nama_lengkap: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-xl border-none bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Role Sistem</label>
                <CustomSelect 
                  value={editForm.role}
                  onChange={(val) => setEditForm({...editForm, role: val})}
                  options={[
                    { value: 'Admin Sistem', label: 'Admin Sistem' },
                    { value: 'Tendik', label: 'Tendik' },
                    { value: 'Kaprodi', label: 'Kaprodi' },
                    { value: 'Mahasiswa', label: 'Mahasiswa' }
                  ]}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Status Akun Aktif</span>
                <div 
                  onClick={() => setEditForm({...editForm, status_akun: editForm.status_akun === 'Aktif' ? 'Non-Aktif' : 'Aktif'})}
                  className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${editForm.status_akun === 'Aktif' ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${editForm.status_akun === 'Aktif' ? 'right-1' : 'left-1'}`}></div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 rounded-xl font-bold bg-[#00a651] hover:bg-[#008c44] text-white shadow-lg shadow-emerald-500/30 transition-all"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal Tambah Pengguna */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-8 shadow-2xl relative border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Tambah Pengguna</h2>
            <p className="text-slate-400 text-sm font-medium mt-1 mb-6">Buat akun pengguna baru</p>

            <form className="space-y-4" onSubmit={handleAddSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">ID User (Username)</label>
                <input 
                  type="text" 
                  value={addForm.id_user}
                  onChange={(e) => setAddForm({...addForm, id_user: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={addForm.nama_lengkap}
                  onChange={(e) => setAddForm({...addForm, nama_lengkap: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email</label>
                <input 
                  type="email" 
                  value={addForm.email}
                  onChange={(e) => setAddForm({...addForm, email: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Role Sistem</label>
                  <CustomSelect 
                    value={addForm.role}
                    onChange={(val) => setAddForm({...addForm, role: val})}
                    options={[
                      { value: 'Admin Sistem', label: 'Admin Sistem' },
                      { value: 'Tendik', label: 'Tendik' },
                      { value: 'Kaprodi', label: 'Kaprodi' },
                      { value: 'Mahasiswa', label: 'Mahasiswa' }
                    ]}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">NIM/NIP</label>
                  <input 
                    type="text" 
                    value={addForm.nim}
                    onChange={(e) => setAddForm({...addForm, nim: e.target.value})}
                    placeholder="Opsional"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 rounded-xl font-bold bg-[#00a651] hover:bg-[#008c44] text-white shadow-lg shadow-emerald-500/30 transition-all"
                >
                  + Tambah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
