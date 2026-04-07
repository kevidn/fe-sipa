"use client";
import Link from 'next/link';

export default function CTA() {
  return (
    <section className="cta">
      <div className="landing-container">
        <div className="cta-box">
          <div className="cta-content">
            <h2>Siap Memulai?</h2>
            <p>
              Bergabunglah dengan ribuan mahasiswa yang telah merasakan <br />
              kemudahan layanan akademik digital
            </p>
            <Link href="/login" className="cta-btn btn-primary-white">
              Akses SIPA UNESA →
            </Link>
          </div>
          <div className="cta-deco"></div>
        </div>
      </div>

      <style jsx>{`
        .cta {
          padding: 6rem 0;
        }
        .cta-box {
          background: var(--sipa-green);
          background: linear-gradient(135deg, var(--sipa-green) 0%, #10b981 100%);
          border-radius: 40px;
          padding: 5rem 3rem;
          position: relative;
          overflow: hidden;
          text-align: center;
          color: white;
          box-shadow: 0 30px 60px rgba(0, 168, 107, 0.2);
        }
        .cta-content {
          position: relative;
          z-index: 2;
        }
        .cta-box h2 {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }
        .cta-box p {
          font-size: 1.25rem;
          opacity: 0.9;
          margin-bottom: 3rem;
          line-height: 1.6;
        }
        .cta-btn {
          background: white;
          color: var(--sipa-green-dark);
          padding: 1rem 2.5rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.1rem;
          text-decoration: none;
          display: inline-block;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .cta-btn:hover {
          transform: translateY(-4px) scale(1.02);
          background: #f0fdf4;
          box-shadow: 0 15px 40px rgba(0,0,0,0.15);
        }
        .cta-deco {
          position: absolute;
          top: -50%;
          right: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
          border-radius: 50%;
        }
        @media (max-width: 768px) {
          .cta-box {
            padding: 4rem 2rem;
            border-radius: 30px;
          }
          .cta-box h2 { font-size: 2rem; }
          .cta-box p { font-size: 1rem; }
        }
      `}</style>
    </section>
  );
}
