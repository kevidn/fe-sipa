"use client";
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero">
      <div className="landing-container">
        <div className="hero-content">
          <div className="hero-left animate-in fade-in slide-in-from-left duration-700">
            <div className="badge">
              <span className="dot"></span>
              Sistem Pelayanan Akademik Universitas Negeri Surabaya
            </div>
            <h1>
              Layanan Akademik <br />
              <span className="text-sipa-green">Lebih Cepat & Mudah</span>
            </h1>
            <p className="hero-description">
              Digitalisasi proses pengajuan surat akademik dengan sistem workflow otomatis dan monitoring SLA real-time.
            </p>
            <div className="hero-actions">
              <Link href="/login" className="bg-sipa-green text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-sipa-green/20 hover:bg-emerald-700 transition-all flex items-center justify-center">
                Mulai Sekarang →
              </Link>
              <Link href="#tentang" className="bg-slate-100 text-slate-600 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center">
                Pelajari Lebih Lanjut
              </Link>
            </div>

            {/* Stats Row */}
            <div className="stats-row animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
              <div className="stat-item">
                <div className="stat-value">1000+</div>
                <div className="stat-label">Pengajuan/Bulan</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-value">95%</div>
                <div className="stat-label">Tepat Waktu</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-value">24/7</div>
                <div className="stat-label">Akses Online</div>
              </div>
            </div>
          </div>

          <div className="hero-right animate-in fade-in slide-in-from-right duration-700">
            <div className="status-card glass-panel shadow-2xl shadow-sipa-green/5">
              <div className="card-header">
                <div className="header-left">
                   <div className="icon-circle bg-sipa-green/10 text-sipa-green">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                   </div>
                   <div>
                     <h3 className="font-bold text-slate-800">Pengajuan Baru</h3>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SKM-2024-125</p>
                   </div>
                </div>
                <span className="status-badge">Selesai</span>
              </div>
              
              <div className="timeline">
                {[
                  { label: 'Pengajuan Dikirim', time: '2 April 2024, 08:30', active: true },
                  { label: 'Diverifikasi Tendik', time: '2 April 2024, 09:45', active: true },
                  { label: 'Surat Diproses / Dicetak', time: '2 April 2024, 12:00', active: true },
                  { label: 'Surat Selesai / Siap Diunduh', time: '2 April 2024, 14:00', active: true }
                ].map((item, idx) => (
                  <div key={idx} className={`timeline-item ${item.active ? 'active' : ''}`}>
                    <div className="time-icon">
                      {item.active ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : null}
                    </div>
                    <div className="time-content">
                      <h4>{item.label}</h4>
                      <p>{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="btn-download-kitir mt-4 group">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-y-0.5 transition-transform"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Unduh Surat Keterangan
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero {
          padding: 8rem 0 6rem;
          background: radial-gradient(circle at top right, rgba(0, 168, 107, 0.08), transparent 60%);
          overflow: hidden;
        }
        .hero-content {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 4rem;
          align-items: center;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: #f0fdf4;
          color: #166534;
          padding: 0.6rem 1.2rem;
          border-radius: 99px;
          font-size: 0.75rem;
          font-weight: 700;
          border: 1px solid rgba(0, 168, 107, 0.1);
          margin-bottom: 2rem;
          letter-spacing: 0.01em;
        }
        .dot {
          width: 8px;
          height: 8px;
          background: #00a86b;
          border-radius: 50%;
          box-shadow: 0 0 10px #00a86b;
        }
        h1 {
          font-size: 4rem;
          font-weight: 900;
          line-height: 1.1;
          color: #0f172a;
          margin-bottom: 1.5rem;
          letter-spacing: -0.04em;
        }
        .text-sipa-green {
          color: #00a86b;
        }
        .hero-description {
          font-size: 1.2rem;
          color: #64748b;
          line-height: 1.7;
          max-width: 520px;
          margin-bottom: 2.5rem;
          font-weight: 500;
        }
        .hero-actions {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 4rem;
        }
        
        .stats-row {
          display: flex;
          align-items: center;
          gap: 3rem;
        }
        .stat-value {
          font-size: 2rem;
          font-weight: 900;
          color: #0f172a;
          line-height: 1;
          margin-bottom: 0.25rem;
        }
        .stat-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #94a3b8;
        }
        .stat-divider {
          width: 2px;
          height: 40px;
          background: #f1f5f9;
        }

        /* Status Card */
        .status-card {
          background: white;
          padding: 2.5rem;
          border-radius: 3rem;
          position: relative;
          border: 1px solid #f1f5f9;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2.5rem;
        }
        .header-left {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .icon-circle {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .status-badge {
          background: #dcfce7;
          color: #166534;
          padding: 0.4rem 1rem;
          border-radius: 99px;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .timeline {
          display: flex;
          flex-direction: column;
          gap: 1.8rem;
          margin-bottom: 2rem;
        }
        .timeline-item {
          display: flex;
          gap: 1.5rem;
          position: relative;
        }
        .timeline-item:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 11px;
          top: 26px;
          width: 2px;
          height: calc(1.8rem + 10px);
          background: #f1f5f9;
        }
        .timeline-item.active::after {
          background: #00a86b;
        }
        .time-icon {
          width: 24px;
          height: 24px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          z-index: 1;
          transition: all 0.3s;
        }
        .timeline-item.active .time-icon {
          background: #dcfce7;
          color: #00a86b;
          border-color: #00a86b;
        }
        .time-content h4 {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.2rem;
        }
        .time-content p {
          font-size: 0.8rem;
          color: #94a3b8;
          font-weight: 600;
        }
        .btn-download-kitir {
          width: 100%;
          background: #f0fdf4;
          color: #00a86b;
          border: 1.5px solid #dcfce7;
          padding: 1rem;
          border-radius: 1.25rem;
          font-weight: 800;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }
        .btn-download-kitir:hover {
          background: #dcfce7;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 168, 107, 0.1);
        }

        @media (max-width: 992px) {
          .hero {
            padding: 6.5rem 0 4rem;
          }
          .hero-content {
            grid-template-columns: 1.15fr 0.85fr;
            text-align: left;
            gap: 2rem;
            align-items: center;
          }
          .badge {
            font-size: 0.65rem;
            padding: 0.4rem 0.8rem;
            margin-bottom: 1rem;
          }
          .badge, .hero-description, .stats-row, .hero-actions {
            margin-left: 0;
            margin-right: 0;
          }
          h1 { 
            font-size: 2.2rem; 
            margin-bottom: 1rem;
            line-height: 1.15;
          }
          .hero-description { 
            font-size: 0.9rem; 
            margin-bottom: 1.5rem;
            line-height: 1.5;
          }
          .hero-actions { 
            gap: 0.75rem; 
            margin-bottom: 2rem; 
            flex-wrap: wrap; 
          }
          .stats-row { 
            gap: 1rem; 
          }
          .stat-value { 
            font-size: 1.4rem; 
          }
          .stat-label { 
            font-size: 0.7rem; 
          }
          .stat-divider { 
            height: 25px; 
          }
          .status-card {
            padding: 1.5rem;
            border-radius: 2rem;
          }
          .card-header {
            margin-bottom: 1.5rem;
            flex-direction: column;
            gap: 0.75rem;
            align-items: flex-start;
          }
          .status-badge {
            align-self: flex-start;
          }
          .timeline {
            gap: 1rem;
          }
          .time-content h4 {
            font-size: 0.85rem;
          }
          .time-content p {
            font-size: 0.7rem;
          }
          .btn-download-kitir {
            padding: 0.75rem;
            font-size: 0.8rem;
            border-radius: 1rem;
          }
        }

        @media (max-width: 640px) {
          .hero {
            padding: 5.5rem 0 3rem;
          }
          .hero-content {
            grid-template-columns: 1.1fr 0.9fr;
            gap: 1.25rem;
          }
          .badge {
            display: none; /* Hide badge on very small screens to save space */
          }
          h1 {
            font-size: 1.6rem;
            line-height: 1.2;
          }
          .hero-description {
            font-size: 0.75rem;
            margin-bottom: 1rem;
            line-height: 1.4;
          }
          .hero-actions {
            flex-direction: column;
            gap: 0.5rem;
            width: 100%;
          }
          .hero-actions a {
            width: 100%;
            text-align: center;
            justify-content: center;
            padding: 0.6rem 0.8rem;
            font-size: 0.8rem;
            border-radius: 10px;
          }
          .stats-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          .stat-value {
            font-size: 1.2rem;
          }
          .stat-label {
            font-size: 0.65rem;
          }
          .stat-divider {
            display: none;
          }
          .status-card {
            padding: 1rem;
            border-radius: 1.5rem;
          }
          .card-header {
            margin-bottom: 1rem;
            gap: 0.5rem;
          }
          .header-left {
            gap: 0.5rem;
          }
          .icon-circle {
            width: 32px;
            height: 32px;
            border-radius: 8px;
          }
          .icon-circle svg {
            width: 14px;
            height: 14px;
          }
          .header-left h3 {
            font-size: 0.8rem;
          }
          .status-badge {
            font-size: 0.6rem;
            padding: 0.25rem 0.6rem;
          }
          .timeline {
            gap: 0.75rem;
            margin-bottom: 1rem;
          }
          .timeline-item {
            gap: 0.75rem;
          }
          .timeline-item:not(:last-child)::after {
            left: 7px;
            top: 18px;
            height: calc(0.75rem + 12px);
          }
          .time-icon {
            width: 16px;
            height: 16px;
          }
          .time-icon svg {
            width: 8px;
            height: 8px;
          }
          .time-content h4 {
            font-size: 0.7rem;
            margin-bottom: 0.1rem;
          }
          .time-content p {
            font-size: 0.6rem;
          }
          .btn-download-kitir {
            padding: 0.6rem;
            font-size: 0.75rem;
            border-radius: 10px;
            gap: 0.5rem;
          }
          .btn-download-kitir svg {
            width: 14px;
            height: 14px;
          }
        }
      `}</style>
    </section>
  );
}
