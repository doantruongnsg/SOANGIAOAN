import "./globals.css";

export const metadata = {
  title: "Quản lý Sổ đầu bài & Soạn giáo án",
  description: "Ứng dụng chia tiết học, lập Sổ đầu bài và soạn giáo án",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
