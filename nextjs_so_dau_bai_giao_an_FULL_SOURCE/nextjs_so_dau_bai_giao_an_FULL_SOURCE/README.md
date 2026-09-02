# FULL SOURCE - Sổ đầu bài & Soạn giáo án (Next.js)

Đây là bản **full source**, không còn kiểu `page.js` chỉ bọc một file `legacy-app.html` duy nhất.
Toàn bộ ứng dụng HTML đã được tách ra thành các phần có thể đọc/sửa trực tiếp trong project Next.js.

## Cấu trúc

```text
app/
  page.js                         Trang chính Next.js
  layout.js
  globals.css
  api/
    health/route.js               Kiểm tra backend
    program/parse/route.js        Backend đọc DOCX bằng Mammoth
    gemini/models/route.js        Backend lấy danh sách model Gemini
    gemini/generate/route.js      Backend gọi Gemini
components/
  MainAppShell.jsx                Khung ứng dụng + truyền dữ liệu Bước 1 -> Bước 2
public/
  frames/
    schedule.html                 FULL SOURCE Bước 1: loại môn, tải CTMH, chia lịch, nghỉ, lưu phiên, Sổ đầu bài
    planner.html                  FULL SOURCE Bước 2: chọn mẫu theo SĐB, giáo án số=STT, ngày từ SĐB, kiểm tra 45p, AI, Word/PDF
source/
  original/                       Bản HTML gốc dùng để đối chiếu
  frames/                         Bản source tách của hai khối chính
```

## Những chức năng đã giữ nguyên từ bản HTML

- Chọn loại môn: Lý thuyết / Thực hành / Tích hợp.
- Môn Lý thuyết -> kiểm tra Lý thuyết.
- Môn Thực hành/Tích hợp -> kiểm tra Thực hành.
- Đọc chương trình môn học DOCX.
- Chia lịch theo đúng thứ trong tuần và số tiết cố định của từng thứ.
- Bỏ qua ngày nghỉ, không chuyển quota tiết sang ngày khác.
- Không bỏ thiếu đề mục; phân đề mục theo đúng thứ tự.
- Sổ đầu bài LT / TH / KT.
- Lưu / mở / xóa phiên làm việc; tên phiên tự lấy môn đang thực hiện.
- Giáo án số tự lấy từ STT Sổ đầu bài.
- Ngày thực hiện tự lấy từ ngày Sổ đầu bài.
- Môn Tích hợp tự chọn mẫu theo buổi: LT -> GA Lý thuyết, TH -> GA Thực hành, LT+TH -> GA Tích hợp.
- 1 tiết kiểm tra giữ cố định 45 phút và đặt sau phần Hướng dẫn tự học / tự rèn luyện.
- Xuất Word, PDF, in.
- Gemini hỗ trợ từng dòng và toàn bộ giáo án.

## Backend đã bổ sung

### 1. Đọc DOCX
Frontend gửi file đến:

```text
POST /api/program/parse
```

Server dùng package `mammoth`, vì vậy không phụ thuộc Mammoth CDN ở Bước 1.

### 2. Gemini qua backend

```text
GET  /api/gemini/models
POST /api/gemini/generate
```

Khuyến nghị đặt API key trong `.env.local`:

```env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.0-flash
```

Nếu backend có key, người dùng không cần nhập key trên giao diện. Giao diện vẫn giữ khả năng nhập key cá nhân để tương thích cách dùng cũ.

## Cài đặt

```bash
npm install
npm run dev
```

Mở:

```text
http://localhost:3000
```

Kiểm tra backend:

```text
http://localhost:3000/api/health
```

## Build production

```bash
npm run build
npm start
```

## Khi đưa vào Antigravity

Hãy đưa **toàn bộ thư mục project**, không chỉ `app/page.js`.
Đặc biệt không được bỏ:

- `public/frames/schedule.html`
- `public/frames/planner.html`
- `app/api/program/parse/route.js`
- `app/api/gemini/*`
- `components/MainAppShell.jsx`
- `package.json`

Hai file trong `public/frames/` chính là toàn bộ logic chi tiết đã tích lũy từ ứng dụng HTML, không phải bản demo rút gọn.
