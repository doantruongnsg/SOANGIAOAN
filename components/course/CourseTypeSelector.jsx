"use client";

import { BookOpen, Wrench, Layers, CheckCircle2 } from "lucide-react";

export default function CourseTypeSelector({ selectedMode, onSelectMode }) {
  const types = [
    {
      id: "theory",
      title: "Môn Lý thuyết",
      desc: "Chương trình thuần lý thuyết. Hệ thống tự động xử lý các bài học và bài kiểm tra lý thuyết theo quy định.",
      icon: BookOpen,
      color: "blue"
    },
    {
      id: "practice",
      title: "Môn Thực hành",
      desc: "Chương trình thực hành tay nghề. Hệ thống tự động phân bổ và xử lý kiểm tra thực hành tương ứng.",
      icon: Wrench,
      color: "cyan"
    },
    {
      id: "integrated",
      title: "Môn Tích hợp",
      desc: "Kết hợp Lý thuyết & Thực hành. Hệ thống tự động chọn mẫu giáo án theo đúng từng buổi học thực tế.",
      icon: Layers,
      color: "indigo"
    }
  ];

  return (
    <div className="course-type-section">
      <div className="section-header-box">
        <span className="step-tag">BƯỚC 1</span>
        <h3 className="section-title-text">Chọn Loại Môn Học</h3>
        <p className="section-desc-text">Xác định hình thức giảng dạy để hệ thống tự động áp dụng đúng mẫu giáo án và quy tắc kiểm tra.</p>
      </div>

      <div className="type-cards-grid">
        {types.map((t) => {
          const Icon = t.icon;
          const isSelected = selectedMode === t.id;

          return (
            <div
              key={t.id}
              className={`type-card ${isSelected ? "selected" : ""}`}
              onClick={() => onSelectMode(t.id)}
            >
              <div className="card-top-row">
                <div className={`type-icon-box ${t.color}`}>
                  <Icon size={20} />
                </div>
                {isSelected && (
                  <div className="check-badge">
                    <CheckCircle2 size={18} />
                  </div>
                )}
              </div>

              <h4 className="type-card-title">{t.title}</h4>
              <p className="type-card-desc">{t.desc}</p>

              <div className="type-card-footer">
                <span className="select-prompt-text">
                  {isSelected ? "✓ Đang chọn áp dụng" : "Nhấn để chọn →"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .course-type-section {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        }

        .section-header-box {
          margin-bottom: 18px;
        }

        .step-tag {
          display: inline-block;
          background: #e0edff;
          color: #1a56db;
          font-size: 11px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 5px;
          margin-bottom: 6px;
          letter-spacing: 0.04em;
        }

        .section-title-text {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 4px;
          letter-spacing: -0.02em;
        }

        .section-desc-text {
          font-size: 13.5px;
          color: #64748b;
          line-height: 1.5;
        }

        .type-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 14px;
        }

        .type-card {
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          padding: 20px;
          background: #f8fafc;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
        }

        .type-card:hover {
          border-color: #93c5fd;
          background: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(26, 86, 219, 0.06);
        }

        .type-card.selected {
          border-color: #1a56db;
          background: #ffffff;
          box-shadow: 0 8px 22px rgba(26, 86, 219, 0.1);
        }

        .card-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .type-icon-box {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .type-icon-box.blue { background: #e0edff; color: #1a56db; }
        .type-icon-box.cyan { background: #e0f2fe; color: #0284c7; }
        .type-icon-box.indigo { background: #ede9fe; color: #6366f1; }

        .check-badge {
          color: #1a56db;
        }

        .type-card-title {
          font-size: 15.5px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 6px;
        }

        .type-card-desc {
          font-size: 13px;
          color: #475569;
          line-height: 1.55;
          flex: 1;
          margin-bottom: 14px;
        }

        .type-card-footer {
          border-top: 1px solid #f1f5f9;
          padding-top: 10px;
        }

        .select-prompt-text {
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
        }

        .type-card.selected .select-prompt-text {
          color: #1a56db;
        }
      `}</style>
    </div>
  );
}