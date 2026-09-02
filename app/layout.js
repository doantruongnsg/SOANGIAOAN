import "./globals.css";

export const metadata = {
  title: "Quản lý Sổ đầu bài & Soạn giáo án - Bách khoa Nam Sài Gòn",
  description: "Ứng dụng chia tiết học, lập Sổ đầu bài và soạn giáo án Phụ lục 10 chuẩn quy định - Cao đẳng Bách khoa Nam Sài Gòn",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        {/* SHIELD AGAINST THIRD-PARTY CHROME EXTENSION RUNTIME ERRORS */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                window.addEventListener('error', function(e) {
                  if (
                    (e.filename && (e.filename.includes('chrome-extension:') || e.filename.includes('moz-extension:') || e.filename.includes('executors'))) ||
                    (e.message && (e.message.includes('M_ID') || e.message.includes('chrome-extension')))
                  ) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    return true;
                  }
                }, true);
                window.addEventListener('unhandledrejection', function(e) {
                  const str = String(e.reason || '');
                  if (str.includes('chrome-extension:') || str.includes('M_ID')) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    return true;
                  }
                }, true);
              }
            `
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}