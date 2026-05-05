"use client";

import { useState, useEffect } from 'react';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const getMenuItems = (role: string) => {
  const normalizedRole = (role || '').toLowerCase();
  
  const roleSpecificItems = [];
  
  if (normalizedRole === 'mahasiswa') {
    roleSpecificItems.push(
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
      }
    );
  } else if (normalizedRole === 'tendik') {
    roleSpecificItems.push(
      { 
        name: 'Dashboard Utama', 
        href: '/dashboard/tendik', 
        icon: (active: boolean) => (
          <svg className={`${active ? 'text-emerald-600' : 'text-slate-400'}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
        )
      },
      { 
        name: 'Antrian Pengajuan Baru', 
        href: '/dashboard/tendik/antrian', 
        badge: 8,
        icon: (active: boolean) => (
          <svg className={`${active ? 'text-emerald-600' : 'text-slate-400'}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12H2M22 12l-4 4M22 12l-4-4M2 12l4 4M2 12l4-4" strokeOpacity="0"/> {/* Hidden reference for layout */}
            <rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M8 15h8"/>
          </svg>
        )
      },
      { 
        name: 'Riwayat Pemrosesan', 
        href: '/dashboard/tendik/riwayat', 
        icon: (active: boolean) => (
          <svg className={`${active ? 'text-emerald-600' : 'text-slate-400'}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8v4l3 3m6-3a9 9 0 1 1-9-9 9 9 0 0 1 6 2.23L21 7M21 3v4h-4"/>
          </svg>
        )
      },
      { 
        name: 'Log Aktivitas', 
        href: '/dashboard/tendik/log', 
        icon: (active: boolean) => (
          <svg className={`${active ? 'text-emerald-600' : 'text-slate-400'}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
        )
      },
      { 
        name: 'Manajemen Jenis Surat', 
        href: '/dashboard/tendik/surat', 
        icon: (active: boolean) => (
          <svg className={`${active ? 'text-emerald-600' : 'text-slate-400'}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/>
          </svg>
        )
      },
      { 
        name: 'Pengaturan Sistem', 
        href: '/dashboard/tendik/pengaturan', 
        icon: (active: boolean) => (
          <svg className={`${active ? 'text-emerald-600' : 'text-slate-400'}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
          </svg>
        )
      }
    );
  } else if (normalizedRole === 'kaprodi') {
    roleSpecificItems.push(
      { 
        name: 'Dashboard Kaprodi', 
        href: '/dashboard/kaprodi', 
        icon: (active: boolean) => (
          <svg className={`${active ? 'text-sipa-green' : 'text-slate-400'}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
        )
      },
      { 
        name: 'Monitoring SLA', 
        href: '/dashboard/kaprodi/monitoring', 
        icon: (active: boolean) => (
          <svg className={`${active ? 'text-sipa-green' : 'text-slate-400'}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
        )
      }
    );
  }

  const commonItemsAfter = [
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

  // Only show common items (Unduh Kitir & FAQ) for Mahasiswa
  if (normalizedRole === 'mahasiswa') {
    return [...roleSpecificItems, ...commonItemsAfter];
  }

  return [...roleSpecificItems];
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userDataStr = localStorage.getItem('sipa_user');
    if (userDataStr) {
      setUser(JSON.parse(userDataStr));
    }
  }, []);

  const menuItems = getMenuItems(user?.role || 'Mahasiswa');

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
      <aside className="w-72 bg-white dark:bg-slate-900 h-screen sticky top-0 border-r border-slate-100 dark:border-slate-800 flex flex-col z-40 transition-colors duration-300">
        {/* Brand */}
        <div className="p-8 flex items-center gap-4">
          <div className="w-10 h-10 bg-sipa-green rounded-xl flex items-center justify-center shadow-lg shadow-sipa-green/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none">SIPA UNESA</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Sistem Pelayanan Akademik</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 mt-2">
          {menuItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative
                  ${active 
                    ? 'bg-emerald-50 text-emerald-700 font-bold' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
              >
                {/* Active Indicator on Left */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-emerald-600 rounded-r-full"></div>
                )}

                <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon(active)}
                </div>
                <span className={`text-sm tracking-tight ${active ? 'text-emerald-700' : 'dark:text-slate-300 dark:group-hover:text-white'}`}>{item.name}</span>
                
                {item.badge && (
                  <div className="ml-auto bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                    {item.badge}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-6">
          <button 
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center justify-center gap-3 w-full py-3 rounded-2xl text-red-500 font-bold text-sm bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all active:scale-95 border border-red-100 dark:border-red-500/20"
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
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100 dark:border-slate-800">
            <div className="flex flex-col items-center text-center">
              {/* Icon */}
              <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-red-100 dark:shadow-none">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </div>

              {/* Text */}
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-3 tracking-tight text-center">Konfirmasi Keluar</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10 text-center">
                Apakah Anda yakin ingin keluar dari sistem? Anda harus masuk kembali untuk mengakses dashboard.
              </p>

              {/* Actions */}
              <div className="flex flex-col w-full gap-3">
                <button 
                  onClick={confirmLogout}
                  className="w-full py-4 rounded-2xl bg-red-500 text-white font-black text-sm shadow-xl shadow-red-200 dark:shadow-red-900/40 hover:bg-red-600 transition-all active:scale-95"
                >
                  YA, KELUAR
                </button>
                <button 
                  onClick={() => setShowLogoutModal(false)}
                  className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
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
