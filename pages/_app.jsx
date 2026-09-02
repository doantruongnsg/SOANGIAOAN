import '../styles/globals.css';
import Head from 'next/head';
import Script from 'next/script';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Quản lý Sổ đầu bài & Soạn giáo án - Bách khoa Nam Sài Gòn</title>
      </Head>

      {/* External Scripts */}
      <Script src="https://unpkg.com/mammoth@1.8.0/mammoth.browser.min.js" strategy="beforeInteractive" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" strategy="beforeInteractive" />
      <Script src="https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js" strategy="beforeInteractive" />
      <Script src="https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics-compat.js" strategy="beforeInteractive" />
      <Script src="https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore-compat.js" strategy="beforeInteractive" />

      {/* Application Scripts */}
      <Script src="/js/api.js" strategy="beforeInteractive" />
      <Script src="/js/firebase-sync.js" strategy="beforeInteractive" />
      <Script src="/js/schedule.js" strategy="beforeInteractive" />
      <Script src="/js/planner.js" strategy="beforeInteractive" />
      <Script src="/js/app.js" strategy="beforeInteractive" />

      <Component {...pageProps} />
    </>
  );
}
