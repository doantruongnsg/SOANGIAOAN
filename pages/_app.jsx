import '../styles/globals.css';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Quản lý Sổ đầu bài & Soạn giáo án - Bách khoa Nam Sài Gòn</title>
        <script src="https://unpkg.com/mammoth@1.8.0/mammoth.browser.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
        <script src="https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"></script>
        <script src="https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics-compat.js"></script>
        <script src="https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore-compat.js"></script>
        <script src="/js/api.js"></script>
        <script src="/js/firebase-sync.js"></script>
        <script src="/js/schedule.js"></script>
        <script src="/js/planner.js"></script>
        <script src="/js/app.js"></script>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
