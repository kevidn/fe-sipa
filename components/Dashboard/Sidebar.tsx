"use client";

import { useState } from 'react';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const menuItems = [
  { 
    name: 'Dashboard', 
    href: '/dashboard/mahasiswa', 
    icon: (active: boolean) => (
      <svg className={`${active ? 'text-sipa-green' : 'text-slate-400'}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    )
  },
  { 
    name: 'Ajukan Surat Baru', 
    href: '/dashboard/pengajuan/baru', 
    icon: (active: boolean) => (
      <svg className={`${active ? 'text-sipa-green' : 'text-slate-400'}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
      </svg>
    )
  },
  { 
    name: 'Riwayat Pengajuan', 
    href: '/dashboard/pengajuan', 
    icon: (active: boolean) => (
      <svg className={`${active ? 'text-sipa-green' : 'text-slate-400'}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    )
  },
  { 
    name: 'Unduh Kitir Digital', 
    href: '/dashboard/unduh', 
    icon: (active: boolean) => (
      <svg className={`${active ? 'text-sipa-green' : 'text-slate-400'}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    )
  },
  { 
    name: 'Bantuan & FAQ', 
    href: '/dashboard/bantuan', 
    icon: (active: boolean) => (
      <svg className={`${active ? 'text-sipa-green' : 'text-slate-400'}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    )
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('sipa_token')}`,
          'Content-Type': 'application/json',
        },
      }).catch(err => console.error("Logout API failed (ignored):", err));

      localStorage.removeItem('sipa_token');
      localStorage.removeItem('sipa_user');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('sipa_token');
      localStorage.removeItem('sipa_user');
      router.push('/login');
    }
  };

  return (
    <>
      <aside className="w-72 bg-white h-screen sticky top-0 border-r border-slate-100 flex flex-col z-40">
        {/* Brand */}
        <div className="p-8 flex items-center gap-4">
          <div className="w-10 h-10 bg-sipa-green rounded-xl flex items-center justify-center shadow-lg shadow-sipa-green/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">SIPA UNESA</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Sistem Pelayanan Akademik</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group
                  ${active 
                    ? 'bg-sipa-green/10 text-sipa-green font-bold' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
              >
                <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon(active)}
                </div>
                <span className="text-sm tracking-tight">{item.name}</span>
                {active && <div className="ml-auto w-1.5 h-6 bg-sipa-green rounded-full"></div>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-6">
          <button 
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center justify-center gap-3 w-full py-3 rounded-2xl text-red-500 font-bold text-sm bg-red-50 hover:bg-red-100 transition-all active:scale-95 border border-red-100"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Keluar
          </button>
        </div>
      </aside>

      {/* --- LOGOUT MODAL --- */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowLogoutModal(false)}
          />
          
          {/* Modal Card */}
          <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center">
              {/* Icon */}
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-red-100">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </div>

              {/* Text */}
              <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight text-center">Konfirmasi Keluar</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-10 text-center">
                Apakah Anda yakin ingin keluar dari sistem? Anda harus masuk kembali untuk mengakses dashboard.
              </p>

              {/* Actions */}
              <div className="flex flex-col w-full gap-3">
                <button 
                  onClick={confirmLogout}
                  className="w-full py-4 rounded-2xl bg-red-500 text-white font-black text-sm shadow-xl shadow-red-200 hover:bg-red-600 transition-all active:scale-95"
                >
                  YA, KELUAR
                </button>
                <button 
                  onClick={() => setShowLogoutModal(false)}
                  className="w-full py-4 rounded-2xl bg-slate-100 text-slate-500 font-black text-sm hover:bg-slate-200 transition-all active:scale-95"
                >
                  BATALKAN
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
