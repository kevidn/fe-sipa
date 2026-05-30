"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

interface UserData {
  nama_lengkap: string;
  role: string;
  username: string;
  id_user: string;
}

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: string;
  link: string;
  is_read: boolean;
  created_at: string;
}

export default function DashboardHeader() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Initialize theme from localStorage or system
    const savedTheme = localStorage.getItem('sipa_theme');
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    const userDataStr = localStorage.getItem('sipa_user');
    if (userDataStr) {
      try { setUser(JSON.parse(userDataStr)); } catch (e) {}
    }

    fetchNotifications();

    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('sipa_token');
      if (!token) return;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const result = await res.json();
        setNotifications(result.data || []);
      }
    } catch (error) {
      console.error("Gagal mengambil notifikasi", error);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sipa_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sipa_theme', 'light');
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const token = localStorage.getItem('sipa_token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (error) {
      console.error("Gagal update notifikasi", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('sipa_token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/read-all`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error("Gagal update semua notifikasi", error);
    }
  };

  const deleteNotif = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('sipa_token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error("Gagal hapus notifikasi", error);
    }
  };

  const getRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Baru saja";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
    return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-end px-10 sticky top-0 z-30 transition-colors duration-300">
      <div className="flex items-center gap-8">
        {/* Actions */}
        <div className="flex items-center gap-4 text-slate-400">
          <button 
            onClick={toggleDarkMode}
            className="p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all hover:text-sipa-green active:scale-90 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center min-w-[42px] min-h-[42px]"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {mounted ? (
              isDarkMode ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )
            ) : (
              <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-400 rounded-full animate-spin" />
            )}
          </button>
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setShowNotif(!showNotif)}
              className={`p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative ${showNotif ? 'text-sipa-green bg-slate-100 dark:bg-slate-800' : ''}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 text-[8px] font-bold text-white flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotif && (
              <div className="absolute right-0 mt-3 w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col z-50">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                  <div>
                    <h3 className="font-black text-slate-800 dark:text-slate-100">Notifikasi</h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{unreadCount} notifikasi belum dibaca</p>
                  </div>
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-xs font-bold text-sipa-green hover:underline">
                      Tandai semua dibaca
                    </button>
                  )}
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 font-medium text-sm">
                      Belum ada notifikasi
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        onClick={() => {
                           if (!notif.is_read) markAsRead(notif.id);
                        }}
                        className={`p-4 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer flex gap-3 relative group
                          ${!notif.is_read ? 'bg-sipa-green/5 dark:bg-sipa-green/10' : ''}
                        `}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border
                          ${notif.type === 'Success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                            notif.type === 'Error' ? 'bg-red-50 text-red-600 border-red-100' : 
                            notif.type === 'Process' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                            'bg-slate-50 text-slate-600 border-slate-100'}
                        `}>
                          {notif.type === 'Success' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                          {notif.type === 'Error' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
                          {notif.type === 'Process' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
                          {notif.type === 'Info' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>}
                        </div>
                        <div className="flex-1 pr-6">
                           <div className="flex justify-between items-start">
                             <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{notif.title}</h4>
                             {!notif.is_read && <span className="w-2 h-2 rounded-full bg-sipa-green shrink-0 mt-1"></span>}
                           </div>
                           <p className="text-xs text-slate-500 mt-1 leading-relaxed">{notif.message}</p>
                           <div className="flex justify-between items-center mt-2">
                             <span className="text-[10px] font-bold text-slate-400">{getRelativeTime(notif.created_at)}</span>
                             {notif.link && (
                                <Link 
                                  href={notif.link}
                                  onClick={(e) => {
                                     // e.stopPropagation(); // Biarkan propagasi agar terbaca
                                  }}
                                  className="text-[10px] font-bold text-sipa-green hover:underline"
                                >
                                  Lihat Detail
                                </Link>
                             )}
                           </div>
                        </div>
                        <button 
                          onClick={(e) => deleteNotif(e, notif.id)}
                          className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-center bg-slate-50/50 dark:bg-slate-800/50">
                   <Link href="/dashboard/notifikasi" className="text-xs font-bold text-sipa-green hover:underline">
                     Lihat Semua Riwayat
                   </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-4 pl-6 border-l border-slate-100 dark:border-slate-800">
          <div className="text-right">
            <p className="text-sm font-black text-slate-800 dark:text-slate-200 leading-none">{user?.nama_lengkap || 'Ahmad Rizki'}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">NIM: {user?.id_user || '210611100042'}</p>
          </div>
          <div className="w-11 h-11 bg-sipa-green rounded-2xl flex items-center justify-center text-white text-lg font-black shadow-lg shadow-sipa-green/20 border-2 border-white dark:border-slate-800">
            {user?.nama_lengkap?.charAt(0) || 'A'}
          </div>
        </div>
      </div>
    </header>
  );
}
