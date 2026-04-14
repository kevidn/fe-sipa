"use client";

import { useState } from 'react';
import Link from 'next/link';

const letterTypes = [
  {
    id: 'kuliah',
    title: 'Surat Keterangan Masih Kuliah',
    estimation: 'Estimasi: 1-2 hari kerja',
    icon: (selected: boolean) => (
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selected ? 'border-sipa-green bg-sipa-green' : 'border-slate-300'}`}>
        {selected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
      </div>
    )
  },
  {
    id: 'skripsi',
    title: 'Surat Ijin Survei Penelitian (Skripsi)',
    estimation: 'Estimasi: 3-5 hari kerja',
    icon: (selected: boolean) => (
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selected ? 'border-sipa-green bg-sipa-green' : 'border-slate-300'}`}>
        {selected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
      </div>
    )
  },
  {
    id: 'tunjangan',
    title: 'Surat Tunjangan/Pensiun/Akses',
    estimation: 'Estimasi: 2-3 hari kerja',
    icon: (selected: boolean) => (
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selected ? 'border-sipa-green bg-sipa-green' : 'border-slate-300'}`}>
        {selected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
      </div>
    )
  },
  {
    id: 'beasiswa-tidak',
    title: 'Surat Keterangan Tidak Menerima Beasiswa',
    estimation: 'Estimasi: 1-2 hari kerja',
    icon: (selected: boolean) => (
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selected ? 'border-sipa-green bg-sipa-green' : 'border-slate-300'}`}>
        {selected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
      </div>
    )
  },
  {
    id: 'beasiswa-rek',
    title: 'Surat Rekomendasi Beasiswa',
    estimation: 'Estimasi: 3-5 hari kerja',
    icon: (selected: boolean) => (
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selected ? 'border-sipa-green bg-sipa-green' : 'border-slate-300'}`}>
        {selected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
      </div>
    )
  },
  {
    id: 'skck',
    title: 'Surat Keterangan Kelakuan Baik',
    estimation: 'Estimasi: 1-2 hari kerja',
    icon: (selected: boolean) => (
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selected ? 'border-sipa-green bg-sipa-green' : 'border-slate-300'}`}>
        {selected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
      </div>
    )
  }
];

export default function AjukanSuratBaru() {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  return (
    <div className="space-y-8 pb-20">
      {/* Back Link */}
      <Link 
        href="/dashboard/mahasiswa" 
        className="inline-flex items-center gap-2 text-sipa-green font-bold hover:gap-3 transition-all group"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        Kembali ke Dashboard
      </Link>

      {/* Hero Card */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        <div className="bg-sipa-green p-10 flex items-center gap-8">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Ajukan Surat Baru</h2>
            <p className="text-white/80 font-medium mt-1">Isi formulir dengan lengkap dan benar</p>
          </div>
        </div>

        <div className="p-10">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-6 px-2">
            Jenis Surat <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {letterTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedLetter(type.id)}
                className={`flex items-start gap-5 p-6 rounded-3xl border-2 text-left transition-all duration-300 group
                  ${selectedLetter === type.id 
                    ? 'border-sipa-green bg-sipa-green/[0.03] shadow-lg shadow-sipa-green/[0.05]' 
                    : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                  }`}
              >
                <div className="mt-1 flex-shrink-0">
                  {type.icon(selectedLetter === type.id)}
                </div>
                <div>
                  <h3 className={`font-bold transition-colors ${selectedLetter === type.id ? 'text-sipa-green' : 'text-slate-800'}`}>
                    {type.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold mt-1.5 uppercase tracking-wide">
                    {type.estimation}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Continue Button */}
          {selectedLetter && (
            <div className="mt-12 flex justify-end animate-in fade-in slide-in-from-bottom-4 duration-500">
              <button 
                className="bg-sipa-green text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-sipa-green/20 hover:bg-sipa-green-dark transition-all active:scale-95 flex items-center gap-3"
              >
                LANJUTKAN PROSES
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
