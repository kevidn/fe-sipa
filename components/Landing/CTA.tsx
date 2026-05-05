"use client";
import Link from 'next/link';

export default function CTA() {
  return (
    <section className="cta">
      <div className="landing-container">
        <div className="cta-box animate-in zoom-in duration-1000">
          <div className="cta-content">
            <h2 className="text-white">Siap Memulai?</h2>
            <p className="text-white/80">
              Bergabunglah dengan ribuan mahasiswa yang telah merasakan kemudahan layanan akademik digital
            </p>
            <Link href="/login" className="cta-btn group">
              Akses SIPA UNESA 
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform ml-2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
          
          {/* Decorative shapes */}
          <div className="cta-shape shape-1"></div>
          <div className="cta-shape shape-2"></div>
        </div>
      </div>

      <style jsx>{`
        .cta {
          padding: 6rem 0 8rem;
        }
        .cta-box {
          background: #00a86b;
          border-radius: 3.5rem;
          padding: 6rem 4rem;
          position: relative;
          overflow: hidden;
          text-align: center;
          box-shadow: 0 40px 80px rgba(0, 168, 107, 0.2);
        }
        .cta-content {
          position: relative;
          z-index: 5;
          max-width: 700px;
          margin: 0 auto;
        }
        .cta-box h2 {
          font-size: 3.5rem;
          font-weight: 900;
          margin-bottom: 1.5rem;
          letter-spacing: -0.04em;
        }
        .cta-box p {
          font-size: 1.25rem;
          margin-bottom: 3.5rem;
          line-height: 1.6;
          font-weight: 500;
        }
        .cta-btn {
          background: white;
          color: #00a86b;
          padding: 1.2rem 3rem;
          border-radius: 1.25rem;
          font-weight: 900;
          font-size: 1.1rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          transition: all 0.3s ease;
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        }
        .cta-btn:hover {
          transform: translateY(-5px) scale(1.02);
          background: #f8fafc;
          box-shadow: 0 20px 45px rgba(0,0,0,0.15);
        }
        .cta-shape {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          pointer-events: none;
        }
        .shape-1 {
          width: 400px;
          height: 400px;
          top: -200px;
          right: -100px;
        }
        .shape-2 {
          width: 300px;
          height: 300px;
          bottom: -150px;
          left: -50px;
        }
        @media (max-width: 768px) {
          .cta-box {
            padding: 4rem 2rem;
            border-radius: 2.5rem;
          }
          .cta-box h2 { font-size: 2.5rem; }
          .cta-box p { font-size: 1rem; }
        }
      `}</style>
    </section>
  );
}
