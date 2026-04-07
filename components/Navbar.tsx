"use client";
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="landing-container nav-content">
        <div className="nav-logo">
          <div className="logo-icon">SU</div>
          <div className="logo-text">
            <strong>SIPA UNESA</strong>
            <span>Sistem Pelayanan Akademik</span>
          </div>
        </div>
        
        <ul className="nav-links">
          <li><Link href="#fitur">Fitur</Link></li>
          <li><Link href="#tentang">Tentang</Link></li>
          <li><Link href="/login?tab=daftar">Daftar</Link></li>
        </ul>

        <Link href="/login" className="btn-primary login-btn">
          Login
        </Link>
      </div>

      <style jsx>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--cream-dark);
          padding: 0.75rem 0;
        }
        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .logo-icon {
          background: var(--sipa-green);
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
        }
        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }
        .logo-text strong {
          font-size: 1.1rem;
          color: var(--sipa-text);
          letter-spacing: 0.02em;
        }
        .logo-text span {
          font-size: 0.7rem;
          color: var(--sipa-text-dim);
        }
        .nav-links {
          display: flex;
          gap: 2.5rem;
          list-style: none;
        }
        .nav-links a {
          text-decoration: none;
          color: var(--sipa-text-dim);
          font-weight: 500;
          font-size: 0.95rem;
          transition: color 0.2s;
        }
        .nav-links a:hover {
          color: var(--sipa-green);
        }
        .login-btn {
          padding: 0.6rem 1.8rem;
          border-radius: 8px;
        }
        @media (max-width: 768px) {
          .nav-links { display: none; }
        }
      `}</style>
    </nav>
  );
}
