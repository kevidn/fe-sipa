"use client";
const features = [
  {
    title: "Portal Pengajuan Online",
    desc: "Ajukan 6 jenis surat akademik secara online kapan saja dan di mana saja tanpa perlu datang ke kampus.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ),
    color: "#10b981",
    bg: "#f0fdf4"
  },
  {
    title: "Tracking Real-time",
    desc: "Pantau status pengajuan surat Anda secara real-time dengan indikator yang jelas di setiap tahapan.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    ),
    color: "#3b82f6",
    bg: "#eff6ff"
  },
  {
    title: "Notifikasi Otomatis",
    desc: "Terima notifikasi email otomatis setiap ada perubahan status pada pengajuan surat Anda.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 01-3.46 0"></path>
      </svg>
    ),
    color: "#a855f7",
    bg: "#f5f3ff"
  },
  {
    title: "SLA Monitoring",
    desc: "Sistem pemantauan SLA dengan indikator visual untuk memastikan proses sesuai batas waktu.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0110 0v4"></path>
      </svg>
    ),
    color: "#eab308",
    bg: "#fefce8"
  },
  {
    title: "Keamanan Terjamin",
    desc: "Data Anda dilindungi dengan enkripsi HTTPS dan sistem autentikasi berbasis role.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    ),
    color: "#ef4444",
    bg: "#fef2f2"
  },
  {
    title: "Multi-Role Access",
    desc: "Akses yang disesuaikan untuk Mahasiswa, Tendik, Kaprodi dengan dashboard masing-masing.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 00-3-3.87"></path>
        <path d="M16 3.13a4 4 0 010 7.75"></path>
      </svg>
    ),
    color: "#10b981",
    bg: "#f0fdf4"
  }
];

export default function Features() {
  return (
    <section id="fitur" className="features">
      <div className="landing-container">
        <div className="section-header">
          <h2>Fitur Unggulan</h2>
          <p>
            Sistem yang dirancang untuk memudahkan proses pelayanan akademik <br />
            dengan teknologi terkini
          </p>
        </div>

        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card glass-panel">
              <div 
                className="icon-wrap" 
                style={{ backgroundColor: f.bg, color: f.color }}
              >
                {f.icon}
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .features {
          padding: 6rem 0;
          background: #fdfdfd;
        }
        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }
        .section-header h2 {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--sipa-text);
          margin-bottom: 1rem;
        }
        .section-header p {
          color: var(--sipa-text-dim);
          font-size: 1.1rem;
          line-height: 1.6;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }
        .feature-card {
          padding: 2.5rem;
          border-radius: 24px;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }
        .feature-card:hover {
          transform: translateY(-8px);
          border-color: var(--sipa-green);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }
        .icon-wrap {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        .feature-card h3 {
          font-size: 1.25rem;
          color: var(--sipa-text);
          margin-bottom: 1rem;
          font-weight: 700;
        }
        .feature-card p {
          color: var(--sipa-text-dim);
          font-size: 0.95rem;
          line-height: 1.6;
        }
        @media (max-width: 768px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
