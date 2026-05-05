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
              <Link href="/login" className="btn-primary">
                Mulai Sekarang →
              </Link>
              <Link href="#tentang" className="btn-secondary">
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
                  { label: 'Pengajuan Diterima', time: '2 April 2024, 08:30', active: true },
                  { label: 'Diproses Tendik', time: '2 April 2024, 10:15', active: true },
                  { label: 'Surat Selesai', time: '2 April 2024, 14:00', active: true }
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
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 4rem;
          }
          .badge, .hero-description, .stats-row, .hero-actions {
            margin-left: auto;
            margin-right: auto;
          }
          .stats-row { justify-content: center; }
          h1 { font-size: 3rem; }
          .hero-right {
            max-width: 500px;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
}
