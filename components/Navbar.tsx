"use client";
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="landing-container nav-content">
        <div className="nav-logo">
          <div className="logo-icon-circle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
          <div className="logo-text">
            <strong>SIPA UNESA</strong>
            <span>Sistem Pelayanan Akademik</span>
          </div>
        </div>
        
        <div className="nav-right">
          <ul className="nav-links">
            <li><Link href="#fitur">Fitur</Link></li>
            <li><Link href="#tentang">Tentang</Link></li>
            <li><Link href="/register">Daftar</Link></li>
          </ul>

          <Link href="/login" className="btn-login shadow-lg shadow-sipa-green/20">
            Login
          </Link>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(241, 245, 249, 0.8);
          padding: 1.25rem 0;
          transition: all 0.3s ease;
        }
        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .logo-icon-circle {
          background: #00a86b;
          color: white;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 16px rgba(0, 168, 107, 0.2);
        }
        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }
        .logo-text strong {
          font-size: 1.2rem;
          color: #0f172a;
          letter-spacing: -0.01em;
          font-weight: 900;
          text-transform: uppercase;
        }
        .logo-text span {
          font-size: 0.7rem;
          color: #64748b;
          font-weight: 600;
          letter-spacing: 0.02em;
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 3rem;
        }
        .nav-links {
          display: flex;
          gap: 2.5rem;
          list-style: none;
        }
        .nav-links a {
          text-decoration: none;
          color: #64748b;
          font-weight: 700;
          font-size: 0.95rem;
          transition: color 0.2s;
        }
        .nav-links a:hover {
          color: #00a86b;
        }
        .btn-login {
          background: #00a86b;
          color: white;
          padding: 0.75rem 2rem;
          border-radius: 12px;
          font-weight: 800;
          font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .btn-login:hover {
          background: #008f5d;
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0, 168, 107, 0.3);
        }
        @media (max-width: 992px) {
          .nav-links { display: none; }
        }
      `}</style>
    </nav>
  );
}
