"use client";

import { useEffect, useState } from 'react';

interface UserData {
  nama_lengkap: string;
  role: string;
  username: string;
  id_user: string;
}

export default function DashboardHeader() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

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
  }, []);

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
          <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors hover:text-sipa-green relative">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
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
