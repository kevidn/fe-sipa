"use client";
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero">
      <div className="landing-container hero-content">
        <div className="hero-left">
          <div className="badge">
            <span className="dot"></span>
            Sistem Pelayanan Akademik Universitas Negeri Surabaya
          </div>
          <h1>
            Layanan Akademik <br />
            <span className="text-gradient">Lebih Cepat & Mudah</span>
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
        </div>

        <div className="hero-right">
          <div className="status-card glass-panel">
            <div className="card-header">
              <h3>Pengajuan Baru</h3>
              <span className="status-badge">Selesai</span>
            </div>
            <p className="card-number">SKM-2024-125</p>
            
            <div className="timeline">
              <div className="timeline-item active">
                <div className="time-icon">✓</div>
                <div className="time-content">
                  <h4>Pengajuan Diterima</h4>
                  <p>2 April 2024, 08:30</p>
                </div>
              </div>
              <div className="timeline-item active">
                <div className="time-icon">✓</div>
                <div className="time-content">
                  <h4>Diproses Tendik</h4>
                  <p>2 April 2024, 10:15</p>
                </div>
              </div>
              <div className="timeline-item active">
                <div className="time-icon">✓</div>
                <div className="time-content">
                  <h4>Surat Selesai</h4>
                  <p>2 April 2024, 14:00</p>
                </div>
              </div>
            </div>

            <button className="btn-download">
              Download Kitir Digital
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero {
          padding: 6rem 0;
          background: radial-gradient(circle at top right, rgba(0, 168, 107, 0.05), transparent 60%);
          overflow: hidden;
        }
        .hero-content {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 4rem;
          align-items: center;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: var(--sipa-green-bg);
          color: var(--sipa-green-dark);
          padding: 0.5rem 1rem;
          border-radius: 99px;
          font-size: 0.8rem;
          font-weight: 600;
          border: 1px solid rgba(0, 168, 107, 0.1);
          margin-bottom: 2rem;
        }
        .dot {
          width: 8px;
          height: 8px;
          background: var(--sipa-green);
          border-radius: 50%;
        }
        h1 {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.2;
          color: var(--sipa-text);
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }
        .hero-description {
          font-size: 1.1rem;
          color: var(--sipa-text-dim);
          line-height: 1.6;
          max-width: 480px;
          margin-bottom: 2.5rem;
        }
        .hero-actions {
          display: flex;
          gap: 1.5rem;
        }
        
        /* Status Card */
        .status-card {
          padding: 2rem;
          border-radius: 24px;
          position: relative;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        .card-header h3 {
          font-size: 1.1rem;
          color: var(--sipa-text);
        }
        .status-badge {
          background: #dcfce7;
          color: #166534;
          padding: 0.25rem 0.75rem;
          border-radius: 99px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .card-number {
          font-size: 0.85rem;
          color: var(--sipa-text-dim);
          margin-bottom: 2rem;
        }
        .timeline {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .timeline-item {
          display: flex;
          gap: 1.2rem;
          position: relative;
        }
        .timeline-item:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 11px;
          top: 24px;
          width: 2px;
          height: calc(1.5rem + 8px);
          background: #e2e8f0;
        }
        .timeline-item.active::after {
          background: var(--sipa-green);
        }
        .time-icon {
          width: 24px;
          height: 24px;
          background: #f1f5f9;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          color: var(--sipa-text-dim);
          z-index: 1;
        }
        .timeline-item.active .time-icon {
          background: #dcfce7;
          color: var(--sipa-green);
          border: 1px solid var(--sipa-green);
        }
        .time-content h4 {
          font-size: 0.95rem;
          color: var(--sipa-text);
          margin-bottom: 0.2rem;
        }
        .time-content p {
          font-size: 0.75rem;
          color: var(--sipa-text-dim);
        }
        .btn-download {
          width: 100%;
          background: #f0fdf4;
          color: var(--sipa-green);
          border: 1px solid rgba(0, 168, 107, 0.1);
          padding: 0.9rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-download:hover {
          background: #dcfce7;
        }

        @media (max-width: 992px) {
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 4rem;
          }
          .badge, .hero-description {
            margin-left: auto;
            margin-right: auto;
          }
          .hero-actions {
            justify-content: center;
          }
          h1 { font-size: 3rem; }
          .hero-right {
            max-width: 440px;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
}
