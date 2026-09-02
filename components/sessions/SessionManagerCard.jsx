"use client";

import { FolderKanban, Play, Save, Trash2, Calendar, BookOpen } from "lucide-react";

export default function SessionManagerCard({ 
  sessions = [], 
  onLoadSession, 
  onSaveSession, 
  onDeleteSession 
}) {
  return (
    <div className="session-manager-section">
      <div className="section-header-box">
        <div className="header-left">
          <span className="step-tag">QUẢN LÝ PHIÊN</span>
          <h3 className="section-title-text">Phiên Làm Việc Đã Lưu</h3>
          <p className="section-desc-text">Tên phiên được tự động đặt theo <b>Mã môn + Tên môn + Loại môn</b> để bạn dễ dàng mở lại bất cứ lúc nào.</p>
        </div>
        <button className="btn-save-current" onClick={onSaveSession}>
          <Save size={16} />
          <span>LƯU PHIÊN HIỆN TẠI</span>
        </button>
      </div>

      <div className="sessions-cards-grid">
        {sessions.length === 0 ? (
          <div className="empty-sessions-box">
            <FolderKanban size={36} className="empty-icon" />
            <b>Chưa có phiên làm việc nào được lưu</b>
            <p>Sau khi chia lịch hoặc soạn giáo án, bấm "LƯU PHIÊN HIỆN TẠI" để lưu lại tiến trình.</p>
          </div>
        ) : (
          sessions.map((s, idx) => (
            <div key={s.id || idx} className="session-card">
              <div className="session-card-top">
                <div className="session-badge">{s.course?.code || "MH"}</div>
                <span className="session-type-pill">{s.course?.modeLabel || "Tích hợp"}</span>
              </div>

              <h4 className="session-title">{s.name || s.course?.name || "Phiên làm việc"}</h4>

              <div className="session-meta-row">
                <div className="meta-item">
                  <Calendar size={13} />
                  <span>{s.sessions?.length || 0} buổi học</span>
                </div>
                <div className="meta-item">
                  <BookOpen size={13} />
                  <span>{s.updatedAt ? new Date(s.updatedAt).toLocaleDateString("vi-VN") : "Hôm nay"}</span>
                </div>
              </div>

              <div className="session-card-actions">
                <button className="btn-action open" onClick={() => onLoadSession && onLoadSession(s.id || idx)}>
                  <Play size={14} />
                  <span>MỞ</span>
                </button>
                <button className="btn-action delete" onClick={() => onDeleteSession && onDeleteSession(s.id || idx)}>
                  <Trash2 size={14} />
                  <span>XÓA</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .session-manager-section {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 28px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
        }

        .section-header-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .step-tag {
          display: inline-block;
          background: #fef3c7;
          color: #92400e;
          font-size: 11px;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 6px;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
        }

        .section-title-text {
          font-size: 19px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .section-desc-text {
          font-size: 13.5px;
          color: #64748b;
        }

        .btn-save-current {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #1a56db 0%, #0284c7 100%);
          color: #ffffff;
          border: 0;
          border-radius: 10px;
          padding: 10px 18px;
          font-weight: 700;
          font-size: 13.5px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(26, 86, 219, 0.25);
          transition: all 0.2s;
        }

        .btn-save-current:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(26, 86, 219, 0.35);
        }

        .sessions-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        .empty-sessions-box {
          grid-column: 1 / -1;
          text-align: center;
          padding: 40px 20px;
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 16px;
        }

        .empty-icon {
          color: #94a3b8;
          margin-bottom: 12px;
        }

        .empty-sessions-box b {
          display: block;
          font-size: 15px;
          color: #334155;
          margin-bottom: 4px;
        }

        .empty-sessions-box p {
          font-size: 13px;
          color: #64748b;
          margin: 0;
        }

        .session-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 18px;
          transition: all 0.2s;
        }

        .session-card:hover {
          background: #ffffff;
          border-color: #93c5fd;
          box-shadow: 0 6px 18px rgba(26, 86, 219, 0.08);
          transform: translateY(-2px);
        }

        .session-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .session-badge {
          background: #1a56db;
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 6px;
        }

        .session-type-pill {
          background: #e2e8f0;
          color: #475569;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 9999px;
        }

        .session-title {
          font-size: 14.5px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 12px;
          line-height: 1.35;
        }

        .session-meta-row {
          display: flex;
          align-items: center;
          gap: 14px;
          font-size: 12px;
          color: #64748b;
          margin-bottom: 16px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .session-card-actions {
          display: flex;
          gap: 8px;
        }

        .btn-action {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          height: 34px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          border: 0;
          transition: all 0.15s;
        }

        .btn-action.open {
          background: #1a56db;
          color: #ffffff;
        }

        .btn-action.open:hover {
          background: #0f3ba1;
        }

        .btn-action.delete {
          background: #fee2e2;
          color: #b91c1c;
        }

        .btn-action.delete:hover {
          background: #fecaca;
        }
      `}</style>
    </div>
  );
}