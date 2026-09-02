# Ứng Dụng Quản Lý Sổ Đầu Bài & Soạn Giáo Án (BKNSG v2.0 - Full Backend)

Hệ thống quản lý Sổ đầu bài, tự động tính toán chia lịch giảng dạy và soạn Giáo án theo mẫu **Phụ lục 10** (chuẩn Giáo dục Nghề nghiệp) với cơ sở dữ liệu tập trung (Full Backend) và tích hợp AI Gemini.

> **Tác giả:** Trần Hữu Nhân - Giảng viên Khoa Công nghệ Thông tin - Kinh tế số  
> **Đơn vị:** Trường Cao đẳng Bách khoa Nam Sài Gòn (BKNSG)

---

## 🌟 Tính Năng Nổi Bật

1. **Chuẩn 100% UI/UX & Typography**:
   - Giao diện thiết kế chuẩn mực với font chữ *Times New Roman*, tone màu xanh Nam Sài Gòn (`#16469d`, `#eef3f9`).
   - Mẫu Giáo án Phụ lục 10 được định dạng chuẩn A4 có thể in ấn hoặc xuất trực tiếp sang file Microsoft Word (`.docx`/`.doc`) và PDF.

2. **Quy Trình Tự Động Hóa Dữ Liệu Liền Mạch (Seamless Workflow)**:
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
     - Thống kê số buổi đã dạy, tiến độ hoàn thành giáo án.
     - Sao lưu (Backup) và Khôi phục (Restore) CSDL chỉ với 1 click.

3. **Full Backend Server & API**:
   - Máy chủ Node.js & Express tốc độ cao.
   - Cơ sở dữ liệu JSON/SQLite bền vững, hỗ trợ tự động lưu (Auto-save) và đồng bộ theo thời gian thực (Real-time sync).
   - AI Proxy an toàn hỗ trợ các model Gemini mới nhất (`gemini-2.5-flash`, `gemini-1.5-flash`, `gemini-1.5-pro`).

---

## 🚀 Hướng Dẫn Cài Đặt & Sử Dụng

### Cách 1: Khởi chạy 1-Click trên Windows
- Nhấp đúp chuột vào file **`start.bat`**.
- Ứng dụng sẽ tự động cài đặt thư viện và mở trình duyệt tại địa chỉ: **`http://localhost:3000`**.

### Cách 2: Chạy bằng dòng lệnh (Terminal)
```bash
# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Khởi động server
npm start
```
Mở trình duyệt và truy cập: `http://localhost:3000`

---

## 📂 Cấu Trúc Thư Mục Dự Án

```
├── server.js               # Máy chủ Express & REST API Endpoints
├── database.js             # Lớp quản lý CSDL tập trung (Persistent DB Layer)
├── package.json            # Cấu hình dự án & dependencies
├── start.bat               # File khởi chạy 1-click cho Windows
├── data/                   # Thư mục lưu trữ CSDL (Programs, Schedules, Lesson Plans, Settings)
├── public/                 # Giao diện Frontend Single Page App
│   ├── index.html          # Trang giao diện chính (Chuẩn 100% UI/UX bản gốc)
│   ├── css/
│   │   └── style.css       # Toàn bộ mã định dạng CSS chuẩn Times New Roman
│   └── js/
│       ├── api.js          # Module API Client & Auto-save
│       ├── schedule.js     # Logic Bước 1 (Lập Sổ đầu bài & Chia lịch)
│       ├── planner.js      # Logic Bước 2 (Giáo án Phụ lục 10 & AI)
│       └── app.js          # Điều phối luồng làm việc & Dashboard
└── test/
    └── api.test.js         # Bộ kiểm thử tự động API
```

---

## 📄 Bản Quyền & Giấy Phép
Phát triển bởi **Trần Hữu Nhân** - Khoa Công nghệ Thông tin - Kinh tế số, Trường Cao đẳng Bách khoa Nam Sài Gòn.
