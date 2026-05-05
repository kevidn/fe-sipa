export const printKitir = (data: any) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <html>
      <head>
        <title>Kitir Digital - ${data.nomor_surat}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; }
          .container { max-width: 800px; margin: 0 auto; border: 2px solid #e2e8f0; border-radius: 24px; padding: 40px; position: relative; overflow: hidden; }
          .header { display: flex; align-items: center; gap: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { width: 60px; h-height: 60px; background: #00aa5b; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 24px; }
          .title { flex: 1; }
          .title h1 { margin: 0; font-size: 20px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; }
          .title p { margin: 5px 0 0; font-size: 12px; color: #64748b; font-weight: 700; }
          
          .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
          .info-group { margin-bottom: 20px; }
          .label { font-size: 10px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
          .value { font-size: 14px; font-weight: 700; color: #1e293b; }
          
          .status-box { background: #f8fafc; border-radius: 16px; padding: 20px; border: 1px solid #e2e8f0; margin-bottom: 40px; }
          .status-label { font-size: 12px; font-weight: 900; color: #64748b; margin-bottom: 10px; }
          .status-value { display: inline-block; padding: 6px 16px; border-radius: 99px; background: #ecfdf5; color: #059669; font-size: 12px; font-weight: 900; text-transform: uppercase; }
          
          .footer { display: flex; justify-content: space-between; align-items: flex-end; border-top: 2px solid #f1f5f9; pt: 30px; margin-top: 40px; }
          .qr-code { width: 100px; height: 100px; border: 1px solid #e2e8f0; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 8px; color: #94a3b8; text-align: center; padding: 10px; }
          .signature { text-align: right; }
          .signature-label { font-size: 12px; font-weight: 700; margin-bottom: 60px; }
          .signature-name { font-size: 14px; font-weight: 900; border-bottom: 1px solid #1e293b; display: inline-block; padding-bottom: 2px; }
          
          .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-auto, -auto) rotate(-45deg); font-size: 100px; font-weight: 900; color: rgba(0,0,0,0.02); pointer-events: none; white-space: nowrap; }
          
          @media print {
            body { padding: 0; }
            .container { border: none; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="watermark">SIPA UNESA</div>
          <div class="header">
            <div class="logo">S</div>
            <div class="title">
              <h1>Bukti Pengajuan Surat (Kitir)</h1>
              <p>Sistem Pelayanan Akademik (SIPA) - Universitas Negeri Surabaya</p>
            </div>
            <div style="text-align: right">
              <div class="label">No. Registrasi</div>
              <div class="value" style="font-size: 18px; color: #00aa5b;">${data.nomor_surat}</div>
            </div>
          </div>
          
          <div class="grid">
            <div class="info-group">
              <div class="label">Nama Lengkap</div>
              <div class="value">${data.user?.nama_lengkap || '-'}</div>
            </div>
            <div class="info-group">
              <div class="label">NIM / Username</div>
              <div class="value">${data.user?.nim || data.user?.id_user || '-'}</div>
            </div>
            <div class="info-group">
              <div class="label">Jenis Surat</div>
              <div class="value">${data.jenis_surat}</div>
            </div>
            <div class="info-group">
              <div class="label">Program Studi</div>
              <div class="value">${data.user?.program_studi || 'N/A'}</div>
            </div>
            <div class="info-group">
              <div class="label">Tanggal Pengajuan</div>
              <div class="value">${new Date(data.created_at).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}</div>
            </div>
            <div class="info-group">
              <div class="label">Keperluan</div>
              <div class="value">${data.keperluan || '-'}</div>
            </div>
          </div>
          
          <div class="status-box">
            <div class="status-label">Status Terakhir Pengajuan</div>
            <div class="status-value">${data.status}</div>
            <p style="font-size: 11px; color: #64748b; margin-top: 15px; font-weight: 500;">
              Simpan bukti ini untuk melakukan pengecekan status secara berkala melalui sistem SIPA. 
              Gunakan nomor registrasi di atas untuk berkomunikasi dengan petugas akademik jika diperlukan.
            </p>
          </div>
          
          <div class="footer">
            <div class="qr-code">
              VERIFIED BY SIPA SYSTEM<br>
              ${data.nomor_surat}
            </div>
            <div class="signature">
              <div class="signature-label">Dicetak pada: ${new Date().toLocaleString('id-ID')}</div>
              <div class="signature-name">SIPA UNESA DIGITAL SIGNATURE</div>
              <div style="font-size: 10px; color: #94a3b8; font-weight: 700; margin-top: 5px;">Dokumen ini sah tanpa tanda tangan basah</div>
            </div>
          </div>
        </div>
        <script>
          window.onload = () => { 
            window.print();
            // window.close(); 
          }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};
