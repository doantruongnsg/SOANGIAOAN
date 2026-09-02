# Ứng Dụng Quản Lý Sổ Đầu Bài & Soạn Giáo Án (Next.js Full Stack - BKNSG v2.0)

Hệ thống quản lý Sổ đầu bài, tự động tính toán chia lịch giảng dạy và soạn Giáo án theo mẫu **Phụ lục 10** (chuẩn Tổng cục Giáo dục Nghề nghiệp) được xây dựng hoàn chỉnh trên nền tảng **Next.js (React + Next API Routes)**, kết hợp cơ sở dữ liệu tập trung và đồng bộ đám mây **Firebase Cloud (`soangiaoan-7b315`)**.

> **Tác giả:** Trần Hữu Nhân - Giảng viên Khoa Công nghệ Thông tin - Kinh tế số  
> **Đơn vị:** Trường Cao đẳng Bách khoa Nam Sài Gòn (BKNSG)

---

## 🌟 Tính Năng Nổi Bật

1. **Framework Next.js Full Stack**:
   - Backend API Routes (`/api/schedules`, `/api/programs`, `/api/lesson-plans`, `/api/ai`, `/api/settings`).
   - Hiệu năng vượt trội, hỗ trợ Server-Side Rendering và Client-Side Rendering tối ưu.
   - Tích hợp Firebase App, Firestore và Analytics (`soangiaoan-7b315`).

2. **Chuẩn 100% UI/UX & Typography**:
   - Giao diện thiết kế chuẩn mực với font chữ *Times New Roman*, tone màu xanh Nam Sài Gòn (`#16469d`, `#eef3f9`).
   - Mẫu Giáo án Phụ lục 10 được định dạng chuẩn A4 có thể in ấn hoặc xuất trực tiếp sang file Microsoft Word (`.docx`/`.doc`) và PDF.

3. **Quy Trình Tự Động Hóa Dữ Liệu Liền Mạch (Seamless Workflow)**:
   - **Bước 1 (Lập Sổ đầu bài)**:
     - Tải đề cương chi tiết (Word `.docx`) hoặc chọn môn học mẫu.
     - Tự động quy đổi tỷ lệ Lý thuyết (LT), Thực hành (TH), Kiểm tra định kỳ (KT) và Tự học.
     - Thiết lập lịch học trong tuần, ngày khai giảng và ngày nghỉ/lễ.
     - Thuật toán tự động chia lịch và sinh bảng Sổ đầu bài chuẩn.
     - Bấm **"SOẠN GIÁO ÁN BUỔI NÀY"** tại bất kỳ buổi dạy nào để tự động liên kết và chuyển dữ liệu sang Bước 2.
   - **Bước 2 (Soạn Giáo án Phụ lục 10)**:
     - Tự động khóa đúng Tên môn học, Mã môn, STT buổi dạy, Ngày dạy, Thời lượng và Nội dung bài học từ Sổ đầu bài.
     - Tự động phân bổ thời lượng 5 bước lên lớp và kiểm tra chuẩn thời gian.
     - Trợ lý AI Gemini hỗ trợ: Triển khai nội dung, Viết lại sinh động, Bổ sung ví dụ thực tế, Thao tác mẫu cho sinh viên, Cảnh báo lỗi thường gặp và Kiểm tra chuẩn kỹ năng nghề.
   - **Tab 3 (Quản lý CSDL & Thống kê)**:
     - Lưu trữ nhiều môn học, lớp học và học kỳ trên máy chủ.
     - Đồng bộ đám mây Firebase Firestore 1-click.
     - Sao lưu (Backup) và Khôi phục (Restore) CSDL.

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### Cách 1: Khởi chạy 1-Click trên Windows
- Nhấp đúp chuột vào file **`start.bat`**.
- Trình duyệt sẽ tự động mở trang web tại địa chỉ: **`http://localhost:3000`**.

### Cách 2: Chạy bằng dòng lệnh (Terminal)
```bash
# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Khởi động Next.js dev server
npm run dev
```
Mở trình duyệt và truy cập: `http://localhost:3000`

---

## 📄 Bản Quyền & Giấy Phép
Phát triển bởi **Trần Hữu Nhân** - Khoa Công nghệ Thông tin - Kinh tế số, Trường Cao đẳng Bách khoa Nam Sài Gòn.
