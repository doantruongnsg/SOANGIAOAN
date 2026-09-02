"use client";

import { 
  Sparkles, 
  ArrowRight, 
  FolderKanban, 
  CalendarCheck,
  ShieldCheck
} from "lucide-react";

export default function HeroSection({ onStartSchedule, onOpenRecentSession }) {
  return (
    <section className="enterprise-hero">
      <div className="hero-glow-blob-1"></div>
      <div className="hero-glow-blob-2"></div>
      <div className="hero-3d-grid-lines"></div>

      <div className="hero-content-wrapper">
        <div className="hero-tag-pill">
          <Sparkles size={14} className="pill-icon" />
          <span>HỆ THỐNG QUẢN LÝ GIÁO ÁN & SỔ ĐẦU BÀI ĐIỆN TỬ</span>
        </div>

        <h1 className="hero-main-heading">
          Quản Lý Giảng Dạy
          <span className="heading-gradient"> Thông Minh Với AI</span>
        </h1>

        <p className="hero-subtext">
          Chuyển đổi chương trình môn học thành Sổ đầu bài tự động, tạo giáo án Phụ lục 10 quy chuẩn Bộ LĐ-TB&XH, tối ưu thời lượng và hỗ trợ sư phạm bởi Gemini 3.7.
        </p>

        <div className="hero-cta-group">
          <button className="cta-btn primary" onClick={onStartSchedule}>
            <CalendarCheck size={18} />
            <span>Bắt đầu Lập Sổ đầu bài</span>
            <ArrowRight size={16} />
          </button>

          <button className="cta-btn secondary" onClick={onOpenRecentSession}>
            <FolderKanban size={18} />
            <span>Mở Phiên gần nhất</span>
          </button>
        </div>

        <div className="hero-feature-pills">
          <div className="feature-pill">
            <ShieldCheck size={15} className="feat-icon" />
            <span>Tự động phân bổ đề mục không trùng lặp</span>
          </div>
          <div className="feature-pill">
            <ShieldCheck size={15} className="feat-icon" />
            <span>Khóa cứng 1 tiết kiểm tra 45 phút</span>
          </div>
          <div className="feature-pill">
            <ShieldCheck size={15} className="feat-icon" />
            <span>Xuất file Word & PDF A4 chuẩn quy định</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .enterprise-hero {
          position: relative;
          background: linear-gradient(135deg, #0b132b 0%, #0f172a 55%, #1e1b4b 100%);
          border-radius: 20px;
          padding: 48px 40px 40px;
          margin-bottom: 24px;
          overflow: hidden;
          box-shadow: 0 16px 40px rgba(11, 19, 43, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .hero-glow-blob-1 {
          position: absolute;
          top: -100px;
          right: -100px;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(26, 86, 219, 0.35) 0%, rgba(2, 132, 199, 0) 70%);
          filter: blur(50px);
          pointer-events: none;
        }

        .hero-glow-blob-2 {
          position: absolute;
          bottom: -80px;
          left: 15%;
          width: 350px;
          height: 350px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%);
          filter: blur(60px);
          pointer-events: none;
        }

        .hero-3d-grid-lines {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 36px 36px;
          pointer-events: none;
        }

        .hero-content-wrapper {
          position: relative;
          z-index: 2;
          max-width: 920px;
        }

        .hero-tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          padding: 5px 14px;
          border-radius: 9999px;
          color: #38bdf8;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.3px;
          margin-bottom: 18px;
        }

        .hero-main-heading {
          font-size: 38px;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.2;
          letter-spacing: -0.03em;
          margin-bottom: 14px;
        }

        .heading-gradient {
          background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtext {
          font-size: 15px;
          color: #cbd5e1;
          line-height: 1.65;
          max-width: 780px;
          margin-bottom: 28px;
          font-weight: 400;
        }

        .hero-cta-group {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 28px;
        }

        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border: 0;
          letter-spacing: -0.01em;
        }

        .cta-btn.primary {
          background: linear-gradient(135deg, #1a56db 0%, #0284c7 100%);
          color: #ffffff;
          box-shadow: 0 6px 18px rgba(26, 86, 219, 0.35);
        }

        .cta-btn.primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(26, 86, 219, 0.5);
        }

        .cta-btn.secondary {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: #ffffff;
          backdrop-filter: blur(8px);
        }

        .cta-btn.secondary:hover {
          background: rgba(255, 255, 255, 0.14);
          transform: translateY(-1px);
        }

        .hero-feature-pills {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 18px;
        }

        .feature-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #94a3b8;
          font-size: 12.5px;
          font-weight: 500;
        }

        .feat-icon {
          color: #10b981;
        }

        @media (max-width: 768px) {
          .enterprise-hero { padding: 32px 20px; }
          .hero-main-heading { font-size: 28px; }
          .cta-btn { width: 100%; justify-content: center; }
        }
      `}</style>
    </section>
  );
}