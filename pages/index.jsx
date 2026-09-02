import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadApp() {
      try {
        const res = await fetch('/app-template.html');
        const html = await res.text();
        const container = document.getElementById('rootAppContainer');
        if (container) {
          container.innerHTML = html;
        }
        setLoaded(true);

        // Initialize scripts
        setTimeout(() => {
          if (typeof window !== 'undefined' && window.App && window.App.init) {
            window.App.init();
          }
        }, 150);
      } catch (err) {
        console.error("Error loading app template:", err);
      }
    }
    loadApp();
  }, []);

  return (
    <>
      <Head>
        <title>Quản lý Sổ đầu bài & Soạn giáo án - Bách khoa Nam Sài Gòn</title>
      </Head>
      <div id="rootAppContainer">
        {!loaded && (
          <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px', color: '#16469d', fontWeight: 'bold' }}>
            ⏳ Đang tải Hệ thống Quản lý Sổ đầu bài & Soạn giáo án (Next.js)...
          </div>
        )}
      </div>
    </>
  );
}
