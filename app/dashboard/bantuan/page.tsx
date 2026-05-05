"use client";

import { useState } from 'react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

export default function BantuanFAQ() {
  const [openId, setOpenId] = useState<string | null>("Umum-0");

  const faqData: FAQCategory[] = [
    {
      title: "Umum",
      items: [
        {
          question: "Apa itu SIPA UNESA?",
          answer: "SIPA UNESA (Sistem Pelayanan Akademik Universitas Negeri Surabaya) adalah platform digital untuk mengajukan berbagai jenis surat akademik secara online tanpa perlu datang ke kampus."
        },
        {
          question: "Jenis surat apa saja yang bisa diajukan?",
          answer: "Saat ini SIPA UNESA melayani 6 jenis surat akademik: (1) Surat Keterangan Masih Kuliah, (2) Surat Ijin Survei Penelitian (Skripsi), (3) Surat Rekomendasi Beasiswa, (4) Surat Keterangan Kelakuan Baik, (5) Surat Tunjangan/Pensiun/Akses, dan (6) Surat Keterangan Tidak Menerima Beasiswa."
        },
        {
          question: "Apakah ada biaya untuk mengajukan surat?",
          answer: "Tidak ada biaya yang dikenakan. Semua layanan pengajuan surat akademik di SIPA UNESA adalah gratis untuk mahasiswa aktif."
        }
      ]
    },
    {
      title: "Pengajuan Surat",
      items: [
        {
          question: "Bagaimana cara mengajukan surat?",
          answer: "Login ke SIPA UNESA, pilih menu 'Ajukan Surat Baru', pilih jenis surat yang diinginkan, isi formulir dengan lengkap, upload dokumen pendukung jika diperlukan, lalu klik 'Ajukan Surat'."
        },
        {
          question: "Berapa lama proses pengajuan surat?",
          answer: "Waktu proses berbeda-beda tergantung jenis surat: Surat Keterangan Masih Kuliah (1-2 hari kerja), Surat Ijin Survei Penelitian (3-5 hari kerja), Surat Rekomendasi Beasiswa (3-5 hari kerja), dan surat lainnya (1-3 hari kerja)."
        },
        {
          question: "Apa itu Kitir Digital?",
          answer: "Kitir Digital adalah bukti pengajuan surat yang diterbitkan otomatis setelah Anda mengajukan surat. Dokumen ini dilengkapi dengan QR Code untuk verifikasi keaslian dan dapat digunakan sebagai bukti sementara bahwa pengajuan Anda telah masuk ke sistem."
        },
        {
          question: "Bagaimana cara mengecek status pengajuan?",
          answer: "Anda dapat mengecek status pengajuan melalui menu 'Riwayat Pengajuan' atau 'Dashboard'. Status akan diupdate secara real-time dan Anda akan menerima notifikasi email setiap ada perubahan status."
        }
      ]
    },
    {
      title: "Dokumen & Persyaratan",
      items: [
        {
          question: "Dokumen apa saja yang perlu disiapkan?",
          answer: "Persyaratan berbeda untuk tiap surat. Umumnya Anda membutuhkan KTM Digital, KRS semester berjalan, dan dokumen pendukung khusus (seperti surat keterangan dari instansi untuk ijin penelitian)."
        },
        {
          question: "Format file apa yang diterima untuk upload dokumen?",
          answer: "Sistem menerima file dalam format PDF, JPG, atau PNG dengan ukuran maksimal 2MB per file."
        },
        {
          question: "Bagaimana jika pengajuan saya ditolak?",
          answer: "Jika ditolak, Anda akan menerima alasan penolakan melalui detail pengajuan. Anda dapat memperbaiki dokumen atau informasi yang salah dan mengajukan ulang."
        }
      ]
    },
    {
      title: "Teknis",
      items: [
        {
          question: "Bagaimana cara mengunduh surat yang sudah selesai?",
          answer: "Setelah surat selesai diproses, buka menu 'Riwayat Pengajuan' atau 'Detail Pengajuan', lalu klik tombol 'Unduh Surat Keterangan'. Surat akan diunduh dalam format PDF."
        },
        {
          question: "Apakah bisa mengajukan lebih dari satu surat sekaligus?",
          answer: "Ya, Anda dapat mengajukan beberapa surat sekaligus. Setiap pengajuan akan diproses secara terpisah sesuai dengan SLA masing-masing jenis surat."
        },
        {
          question: "Apa yang harus dilakukan jika lupa password?",
          answer: "Klik 'Lupa Password' di halaman login, masukkan email yang terdaftar, dan ikuti instruksi yang dikirimkan ke email Anda untuk reset password."
        }
      ]
    }
  ];

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center space-y-4">
        <Link 
          href="/dashboard/mahasiswa" 
          className="self-start inline-flex items-center gap-2 text-slate-400 font-bold hover:text-sipa-green transition-all group mb-4"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Kembali ke Dashboard
        </Link>
        
        <div className="w-20 h-20 bg-sipa-green rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-sipa-green/20">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Bantuan & FAQ</h1>
        <p className="text-slate-400 font-medium max-w-md">Temukan jawaban untuk pertanyaan yang sering diajukan tentang SIPA UNESA</p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50/50 dark:bg-blue-500/5 p-8 rounded-[2.5rem] border border-blue-100 dark:border-blue-500/20 space-y-4 transition-all hover:shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-200 dark:shadow-none">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <div>
            <h3 className="font-black text-blue-900 dark:text-blue-300">Email</h3>
            <p className="text-blue-800/60 dark:text-blue-400/60 text-sm font-medium">Hubungi kami via email</p>
            <p className="text-blue-600 dark:text-blue-400 font-bold mt-2">sipa@unesa.ac.id</p>
          </div>
        </div>

        <div className="bg-emerald-50/50 dark:bg-emerald-500/5 p-8 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-500/20 space-y-4 transition-all hover:shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200 dark:shadow-none">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>
          <div>
            <h3 className="font-black text-emerald-900 dark:text-emerald-300">Telepon</h3>
            <p className="text-emerald-800/60 dark:text-emerald-400/60 text-sm font-medium">Senin - Jumat, 08:00 - 16:00</p>
            <p className="text-emerald-600 dark:text-emerald-400 font-bold mt-2">(031) 8280009</p>
          </div>
        </div>

        <div className="bg-purple-50/50 dark:bg-purple-500/5 p-8 rounded-[2.5rem] border border-purple-100 dark:border-purple-500/20 space-y-4 transition-all hover:shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-purple-500 flex items-center justify-center text-white shadow-lg shadow-purple-200 dark:shadow-none">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div>
            <h3 className="font-black text-purple-900 dark:text-purple-300">Lokasi</h3>
            <p className="text-purple-800/60 dark:text-purple-400/60 text-sm font-medium">Bagian Akademik</p>
            <p className="text-purple-600 dark:text-purple-400 font-bold mt-2">Gedung Rektorat Lt. 1</p>
          </div>
        </div>
      </div>

      {/* FAQ Accordions */}
      <div className="space-y-8">
        {faqData.map((category) => (
          <div key={category.title} className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
            <div className="bg-sipa-green px-10 py-5">
              <h2 className="text-lg font-black text-white uppercase tracking-widest">{category.title}</h2>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {category.items.map((item, idx) => {
                const id = `${category.title}-${idx}`;
                const isOpen = openId === id;
                return (
                  <div key={idx} className="transition-all">
                    <button 
                      onClick={() => toggleAccordion(id)}
                      className="w-full px-10 py-6 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-left group"
                    >
                      <span className={`font-bold transition-colors ${isOpen ? 'text-sipa-green' : 'text-slate-700 dark:text-slate-200 group-hover:text-sipa-green'}`}>
                        {item.question}
                      </span>
                      <svg 
                        className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-sipa-green' : ''}`} 
                        width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="px-10 pb-8 animate-in slide-in-from-top-2 duration-300">
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Operational Hours */}
      <div className="bg-emerald-50/50 dark:bg-emerald-500/5 p-10 rounded-[3rem] border border-emerald-100 dark:border-emerald-500/20 flex flex-col md:flex-row gap-10 items-center transition-all duration-300">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-200 dark:shadow-none">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div className="flex-1 w-full space-y-6">
          <h2 className="text-2xl font-black text-emerald-900 dark:text-emerald-300 tracking-tight">Jam Operasional</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
            <div className="flex justify-between items-center border-b border-emerald-100/50 dark:border-emerald-500/10 pb-2">
              <span className="text-emerald-800/70 dark:text-emerald-400/70 font-bold">Senin - Kamis</span>
              <span className="font-black text-emerald-900 dark:text-emerald-200 text-sm tracking-widest">08:00 - 16:00 WIB</span>
            </div>
            <div className="flex justify-between items-center border-b border-emerald-100/50 dark:border-emerald-500/10 pb-2">
              <span className="text-emerald-800/70 dark:text-emerald-400/70 font-bold">Jumat</span>
              <span className="font-black text-emerald-900 dark:text-emerald-200 text-sm tracking-widest">08:00 - 16:30 WIB</span>
            </div>
            <div className="flex justify-between items-center border-b border-emerald-100/50 dark:border-emerald-500/10 pb-2">
              <span className="text-emerald-800/70 dark:text-emerald-400/70 font-bold">Sabtu - Minggu</span>
              <span className="font-black text-red-500 text-sm tracking-widest">TUTUP</span>
            </div>
          </div>
          <p className="text-[10px] font-bold text-emerald-600/60 dark:text-emerald-400/40 uppercase tracking-[0.2em]">
            * Sistem SIPA UNESA dapat diakses 24/7, namun proses verifikasi dilakukan pada jam operasional
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-sipa-green p-12 rounded-[3.5rem] text-center space-y-8 shadow-2xl shadow-sipa-green/30 relative overflow-hidden group">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -ml-10 -mb-10 group-hover:scale-150 transition-transform duration-700" />
        
        <div className="relative space-y-4">
          <h2 className="text-3xl font-black text-white tracking-tight">Tidak Menemukan Jawaban?</h2>
          <p className="text-white/80 font-medium max-w-xl mx-auto">
            Hubungi kami melalui email atau telepon untuk bantuan lebih lanjut terkait layanan SIPA UNESA.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative">
          <a 
            href="mailto:sipa@unesa.ac.id"
            className="w-full sm:w-auto px-10 py-4 bg-white text-sipa-green font-black rounded-2xl hover:bg-slate-50 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            Kirim Email
          </a>
          <button 
            className="w-full sm:w-auto px-10 py-4 border-2 border-white/30 text-white font-black rounded-2xl hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            Hubungi Kami
          </button>
        </div>
      </div>
    </div>
  );
}
