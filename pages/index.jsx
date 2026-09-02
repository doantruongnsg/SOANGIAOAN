import Head from 'next/head';
import { useEffect, useRef } from 'react';
import fs from 'fs';
import path from 'path';

export default function HomePage({ initialHtml }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Small delay to ensure external CDN scripts (Mammoth, html2pdf, Firebase) are ready
    const timer = setInterval(() => {
      if (typeof window !== 'undefined' && window.App && window.App.init) {
        window.App.init();
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Head>
        <title>Quản lý Sổ đầu bài & Soạn giáo án - Bách khoa Nam Sài Gòn</title>
      </Head>
      <div 
        id="rootAppContainer" 
        dangerouslySetInnerHTML={{ __html: initialHtml }} 
        suppressHydrationWarning={true}
      />
    </>
  );
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'public/app-template.html');
  const initialHtml = fs.readFileSync(filePath, 'utf8');
  return {
    props: {
      initialHtml
    }
  };
}
