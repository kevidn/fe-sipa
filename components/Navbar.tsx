"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="landing-container nav-content">
        <div className="nav-logo">
          <Image 
            src="/icon.png" 
            alt="Logo SIPA UNESA" 
            width={50} 
            height={50} 
            className="h-10 w-auto object-contain" 
            priority 
          />
          <div className="logo-text">
            <strong>SIPA</strong>
            <span>Sistem Informasi & Pengolahan Admisi</span>
          </div>
        </div>
        
        {/* Desktop Menu */}
        <div className="nav-right desktop-menu">
          <ul className="nav-links">
            <li><Link href="#fitur">Fitur</Link></li>
            <li><Link href="#tentang">Tentang</Link></li>
            <li><Link href="/register">Daftar</Link></li>
          </ul>

          <Link href="/login" className="bg-sipa-green text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-sipa-green/20">
            Login
          </Link>
        </div>

        {/* Hamburger Toggle Button for Mobile */}
        <button 
          className={`hamburger-btn ${isOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(false)}>
        <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
          <ul className="mobile-nav-links">
            <li>
              <Link href="#fitur" onClick={() => setIsOpen(false)}>Fitur</Link>
            </li>
            <li>
              <Link href="#tentang" onClick={() => setIsOpen(false)}>Tentang</Link>
            </li>
            <li>
              <Link href="/register" onClick={() => setIsOpen(false)}>Daftar</Link>
            </li>
            <li className="mobile-btn-container">
              <Link href="/login" className="bg-sipa-green text-white block text-center px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-sipa-green/20 w-full" onClick={() => setIsOpen(false)}>
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(241, 245, 249, 0.8);
          padding: 1rem 0;
          transition: all 0.3s ease;
        }
        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 1rem;
          z-index: 1002;
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

        /* Hamburger Button */
        .hamburger-btn {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 28px;
          height: 19px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 1002;
        }
        .hamburger-btn .bar {
          width: 100%;
          height: 3px;
          background-color: #0f172a;
          border-radius: 4px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hamburger-btn.active .bar:nth-child(1) {
          transform: translateY(8px) rotate(45deg);
          background-color: #00a86b;
        }
        .hamburger-btn.active .bar:nth-child(2) {
          opacity: 0;
          transform: translateX(-10px);
        }
        .hamburger-btn.active .bar:nth-child(3) {
          transform: translateY(-8px) rotate(-45deg);
          background-color: #00a86b;
        }

        /* Mobile Menu Drawer Overlay */
        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: rgba(15, 23, 42, 0.3);
          backdrop-filter: blur(8px);
          opacity: 0;
          pointer-events: none;
          z-index: 999;
          transition: opacity 0.3s ease;
        }
        .mobile-menu-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }

        .mobile-menu {
          position: absolute;
          top: 0;
          right: 0;
          width: 75%;
          max-width: 320px;
          height: 100vh;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          box-shadow: -10px 0 30px rgba(15, 23, 42, 0.08);
          padding: 7rem 2rem 2rem;
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-left: 1px solid rgba(241, 245, 249, 0.8);
        }
        .mobile-menu-overlay.open .mobile-menu {
          transform: translateX(0);
        }

        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .mobile-nav-links a {
          text-decoration: none;
          color: #64748b;
          font-weight: 700;
          font-size: 1.15rem;
          transition: color 0.2s;
          display: block;
        }
        .mobile-nav-links a:hover {
          color: #00a86b;
        }
        .mobile-btn-container {
          margin-top: 1.5rem;
          border-top: 1px solid #f1f5f9;
          padding-top: 2rem;
        }
        .btn-login-mobile {
          background: #00a86b;
          color: white;
          padding: 0.9rem 2rem;
          border-radius: 12px;
          font-weight: 800;
          font-size: 1.05rem;
          text-decoration: none;
          transition: all 0.3s ease;
          display: block;
          text-align: center;
          box-shadow: 0 8px 16px rgba(0, 168, 107, 0.2);
        }
        .btn-login-mobile:hover {
          background: #008f5d;
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0, 168, 107, 0.3);
        }

        @media (max-width: 992px) {
          .desktop-menu {
            display: none;
          }
          .hamburger-btn {
            display: flex;
          }
        }
      `}</style>
    </nav>
  );
}
