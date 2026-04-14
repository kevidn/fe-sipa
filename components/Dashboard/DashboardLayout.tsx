"use client";

import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#fcfbf9] text-slate-800 font-sans selection:bg-sipa-green/10 selection:text-sipa-green">
      {/* Sidebar - Fixed on the left */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        
        <main className="flex-1 overflow-x-hidden p-6 sm:p-10 animate-in fade-in duration-500">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
