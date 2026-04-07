"use client";
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="landing-container footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="logo-icon white">SU</div>
            <div className="logo-text">
              <strong>SIPA UNESA</strong>
              <span>Sistem Pelayanan Akademik</span>
            </div>
          </div>
          <p className="footer-desc">
            Digitalisasi layanan akademik untuk kemudahan dan transparansi pelayanan di Universitas Negeri Surabaya.
          </p>
        </div>

        <div className="footer-links">
          <h4>Layanan</h4>
          <ul>
            <li><Link href="#">Surat Keterangan Masih Kuliah</Link></li>
            <li><Link href="#">Surat Ijin Penelitian</Link></li>
            <li><Link href="#">Surat Rekomendasi Beasiswa</Link></li>
            <li><Link href="#">Surat Kelakuan Baik</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Kontak</h4>
          <p><strong>Universitas Negeri Surabaya</strong></p>
          <p>Jl. Ketintang, Surabaya</p>
          <p>Email: sipa@unesa.ac.id</p>
          <p>Telp: (031) 8280009</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 SIPA UNESA. All rights reserved.</p>
      </div>

      <style jsx>{`
        .footer {
          background: var(--sipa-navy);
          color: white;
          padding: 5rem 0 2rem;
          margin-top: 4rem;
        }
        .footer-content {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 4rem;
          margin-bottom: 4rem;
        }
        .logo-icon.white {
          background: var(--sipa-green);
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .footer-logo .logo-text strong {
          color: white;
          font-size: 1rem;
        }
        .footer-logo .logo-text span {
          color: rgba(255,255,255,0.6);
          font-size: 0.65rem;
        }
        .footer-desc {
          color: rgba(255,255,255,0.6);
          font-size: 0.9rem;
          line-height: 1.6;
          max-width: 320px;
        }
        .footer-links h4, .footer-contact h4 {
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
          letter-spacing: 0.05em;
        }
        .footer-links ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }
        .footer-links a {
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          font-size: 0.95rem;
          transition: color 0.2s;
        }
        .footer-links a:hover {
          color: var(--sipa-green);
        }
        .footer-contact p {
          color: rgba(255,255,255,0.6);
          font-size: 0.95rem;
          margin-bottom: 0.5rem;
        }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 2rem;
          text-align: center;
          color: rgba(255,255,255,0.4);
          font-size: 0.85rem;
        }
        @media (max-width: 992px) {
          .footer-content {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
      `}</style>
    </footer>
  );
}
